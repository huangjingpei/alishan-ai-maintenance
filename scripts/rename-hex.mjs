#!/usr/bin/env node
// hex 标识符作用域感知重命名（AST 级）。
//
// 用法：
//   node scripts/rename-hex.mjs <文件或目录...>             试运行，只输出报告
//   node scripts/rename-hex.mjs <文件或目录...> --write     应用重命名
//   node scripts/rename-hex.mjs ... --report <out.json>     额外写出 JSON 报告
//
// 安全设计：
// - 只重命名「绑定标识符」（声明/引用/赋值目标），经 Babel 作用域解析定位；
//   对象键、成员属性（obj._0x1）、字符串字面量、标签一律不碰；
// - 候选名先做碰撞检查：同作用域重名、祖先绑定截获、全局名捕获，冲突自动加后缀；
// - 输出按原文偏移拼接标识符 token，不改排版、不丢注释，git diff 最小化；
// - 写回前对结果重新做语法解析自检，失败则拒绝写盘。

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('@babel/parser');
const traverseMod = require('@babel/traverse');
const traverse = traverseMod.default || traverseMod;

const HEX_RE = /^_0x[0-9a-f]{4,8}$/;
const RESERVED = new Set(
  ('break case catch class const continue debugger default delete do else export extends finally for function ' +
    'if import in instanceof new return super switch this throw try typeof var void while with yield let static ' +
    'enum await implements package protected interface private public arguments eval undefined NaN Infinity ' +
    'null true false').split(/\s+/)
);

const GENERIC_PREFIX = {
  catch: 'error',
  param: 'arg',
  loop: 'item',
  require: 'mod',
  alias: 'val',
  rhs: 'value',
  fnname: 'fn',
  classname: 'cls',
  exportfn: 'fn',
  generic: 'local',
};

const argv = process.argv.slice(2);
const write = argv.includes('--write');
const reportIdx = argv.indexOf('--report');
const reportPath = reportIdx >= 0 ? argv[reportIdx + 1] : null;
const targets = argv.filter((a, i) => !a.startsWith('--') && (reportIdx < 0 || i !== reportIdx + 1));

if (!targets.length) {
  console.error('用法: node scripts/rename-hex.mjs <文件或目录...> [--write] [--report out.json]');
  process.exit(1);
}

function toCamelCase(raw) {
  const s = String(raw);
  const parts = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (!parts.length) return '';
  const fixPart = (p, isFirst) => {
    const isUpper = /[A-Z]/.test(p) && p === p.toUpperCase();
    const base = isUpper ? p.toLowerCase() : p;
    return isFirst
      ? base.charAt(0).toLowerCase() + base.slice(1)
      : base.charAt(0).toUpperCase() + base.slice(1);
  };
  const head = fixPart(parts[0], true);
  const rest = parts.slice(1).map((p) => fixPart(p, false));
  return head + rest.join('');
}

function isValidName(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !RESERVED.has(name);
}

function collectFiles(target, out) {
  const st = fs.statSync(target);
  if (st.isFile()) {
    out.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === 'assets' || entry.name === 'node_modules') continue;
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) collectFiles(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
}

function isRequireCall(node) {
  return !!node && node.type === 'CallExpression' &&
    node.callee?.type === 'Identifier' && node.callee.name === 'require' &&
    node.arguments.length === 1 && node.arguments[0]?.type === 'StringLiteral';
}

function moduleBaseName(spec) {
  const noScheme = String(spec).replace(/^[^:]+:/, '');
  let base = noScheme.split('/').filter(Boolean).pop() || '';
  base = base.replace(/\.(js|mjs|cjs|json|node)$/i, '');
  return toCamelCase(base);
}

function propertyKeyName(propPath) {
  const prop = propPath.node;
  if (!prop || prop.computed) return null;
  const key = prop.key;
  if (!key) return null;
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'StringLiteral') return key.value;
  if (key.type === 'NumericLiteral') return 'key' + String(key.value);
  return null;
}

function containsNode(root, target) {
  if (!root || typeof root !== 'object') return false;
  if (root === target) return true;
  const stack = [root];
  const seen = new Set();
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== 'object' || seen.has(cur)) continue;
    seen.add(cur);
    if (cur === target) return true;
    for (const key of Object.keys(cur)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments') continue;
      const v = cur[key];
      if (Array.isArray(v)) {
        for (const item of v) if (item && typeof item.type === 'string') stack.push(item);
      } else if (v && typeof v.type === 'string') {
        stack.push(v);
      }
    }
  }
  return false;
}

function paramElementFor(fnNode, ident) {
  return fnNode.params.find((param) => containsNode(param, ident)) || null;
}

function defaultHintFor(param, ident) {
  if (!param || param.type !== 'AssignmentPattern') return null;
  if (!containsNode(param.left, ident)) return null;
  const right = param.right;
  if (!right) return null;
  if (right.type === 'ObjectExpression') return 'object';
  if (right.type === 'ArrayExpression') return 'array';
  if (right.type === 'StringLiteral' || right.type === 'TemplateLiteral') return 'string';
  if (right.type === 'NumericLiteral') return 'number';
  if (right.type === 'BooleanLiteral') return 'boolean';
  return null;
}

function rhsShape(init) {
  if (!init) return null;
  switch (init.type) {
    case 'ArrayExpression': return 'list';
    case 'ObjectExpression': return 'obj';
    case 'RegExpLiteral': return 'pattern';
    case 'StringLiteral':
    case 'TemplateLiteral': return 'text';
    case 'BooleanLiteral': return 'flag';
    case 'NumericLiteral':
    case 'BigIntLiteral': return 'num';
    case 'NewExpression': {
      if (init.callee?.type === 'Identifier') {
        const c = toCamelCase(init.callee.name);
        if (c) return c;
      }
      return null;
    }
    case 'CallExpression':
      if (init.callee?.type === 'Identifier' && /^(is|has)[A-Z]/.test(init.callee.name)) return 'flag';
      return 'result';
    case 'AwaitExpression': return 'result';
    case 'MemberExpression':
    case 'BinaryExpression':
    case 'ConditionalExpression': return 'value';
    case 'UnaryExpression': return init.operator === '!' ? 'flag' : 'value';
    default: return null;
  }
}

function categorize(declPath) {
  const p = declPath;
  const parent = p.parentPath;
  if (!parent) return { cat: 'generic', base: '' };

  if (parent.isCatchClause()) return { cat: 'catch', base: 'error' };

  // { key: _0x1 } / { key: _0x1 = def } —— 反混淆恢复语义名的最大来源
  if (parent.isObjectProperty()) {
    const key = propertyKeyName(parent);
    return { cat: 'alias', base: key ? toCamelCase(key) : '' };
  }
  if (parent.isAssignmentPattern() && parent.parentPath?.isObjectProperty()) {
    const key = propertyKeyName(parent.parentPath);
    return { cat: 'alias', base: key ? toCamelCase(key) : '' };
  }

  if (parent.isVariableDeclarator()) {
    const init = parent.node.init;
    if (isRequireCall(init)) {
      const base = moduleBaseName(init.arguments[0].value);
      if (base) return { cat: 'require', base };
    }
    const decl = parent.parentPath;
    if (decl?.isVariableDeclaration()) {
      const head = decl.parentPath;
      if (head && (head.isForOfStatement() || head.isForInStatement())) {
        return { cat: 'loop', base: 'item' };
      }
    }
    const shape = rhsShape(init);
    if (shape) return { cat: 'rhs', base: shape };
  }

  // 函数/类名绑定
  if (parent.isFunction() || parent.isClass()) {
    if (parent.node.id === p.node) {
      return { cat: parent.isClass() ? 'classname' : 'fnname', base: parent.isClass() ? 'cls' : 'fn' };
    }
  }

  // 函数参数（直接参数 / 默认值 / 剩余参数）
  {
    const ident = p.node;
    let node = p.node;
    let cur = parent;
    let depth = 0;
    while (cur && depth++ < 12) {
      if (cur.isFunction()) {
        const param = paramElementFor(cur.node, node);
        if (!param) return { cat: 'generic', base: '' };
        if (param.type === 'RestElement' && containsNode(param.argument, ident)) {
          return { cat: 'param', base: 'restArgs' };
        }
        const idx = cur.node.params.indexOf(param);
        const hint = defaultHintFor(param, ident);
        const base = hint === 'object' ? 'options'
          : hint === 'array' ? 'list'
          : hint === 'string' ? 'text'
          : hint === 'number' ? 'num'
          : hint === 'boolean' ? 'flag'
          : 'arg' + (idx + 1);
        return { cat: 'param', base };
      }
      if (cur.isVariableDeclarator() || cur.isCatchClause() || cur.isObjectProperty()) {
        return { cat: 'generic', base: '' };
      }
      node = cur.node;
      cur = cur.parentPath;
    }
  }

  return { cat: 'generic', base: '' };
}

function effectiveName(binding, overlay) {
  return overlay.get(binding) ?? binding.identifier?.name ?? '';
}

function scopeHasEffective(scope, name, overlay, excludeBinding) {
  for (const b of Object.values(scope.bindings)) {
    if (b === excludeBinding) continue;
    if (effectiveName(b, overlay) === name) return true;
  }
  return false;
}

function isInSubtree(scope, ancestorScope) {
  let s = scope;
  while (s) {
    if (s === ancestorScope) return true;
    s = s.parent;
  }
  return false;
}

// 标识符是否处于「引用位」（排除对象键、成员属性、标签等非引用位）
function isReferencePosition(p) {
  const parent = p.parentPath;
  if (!parent) return false;
  const node = parent.node;
  if ((parent.isObjectProperty() || parent.isObjectMethod() ||
      parent.isClassProperty() || parent.isClassMethod()) &&
    node.key === p.node && !node.computed &&
    !(parent.isObjectProperty() && node.shorthand)) return false;
  if (parent.isMemberExpression() && node.property === p.node && !node.computed) return false;
  if (parent.isLabeledStatement() && node.label === p.node) return false;
  if ((parent.isBreakStatement() || parent.isContinueStatement()) && node.label === p.node) return false;
  if (parent.isImportSpecifier() && node.imported === p.node) return false;
  if (parent.isExportSpecifier() && node.exported === p.node) return false;
  return true;
}

// 候选名是否安全：
// 0) 文件中从未出现过该名字时可快速通过；
// 1) 绑定自身的任何引用到声明作用域之间，不能已有同名绑定（否则引用被中途截获）；
// 2) 祖先作用域若有同名绑定且其引用落在声明作用域子树内，重命名会截获那些引用；
// 3) 声明作用域子树内若有同名「未绑定引用」（全局名），重命名会把它捕获成本地绑定。
function makeCanUse(allNames, unboundRefs) {
  return function canUse(binding, candidate, overlay, refs) {
    if (!allNames.has(candidate) && !unboundRefs.has(candidate)) return true;
    const S = binding.scope;
    for (const ref of refs) {
      let s = ref.scope;
      while (s && s !== S) {
        if (scopeHasEffective(s, candidate, overlay, null)) return false;
        s = s.parent;
      }
      if (scopeHasEffective(S, candidate, overlay, binding)) return false;
    }
    for (let a = S.parent; a; a = a.parent) {
      for (const b2 of Object.values(a.bindings)) {
        if (effectiveName(b2, overlay) !== candidate) continue;
        const refScopes = [
          ...(b2.referencePaths || []).map((r) => r.scope),
          ...(b2.constantViolations || []).map((v) => v.scope),
        ];
        if (refScopes.some((rs) => rs && isInSubtree(rs, S))) return false;
      }
    }
    const globalUseScopes = unboundRefs.get(candidate);
    if (globalUseScopes && globalUseScopes.some((rs) => isInSubtree(rs, S))) return false;
    return true;
  };
}

function processFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const quickCount = (src.match(/_0x[0-9a-f]{4,8}/g) || []).length;
  const report = {
    file: path.relative(process.cwd(), file).replace(/\\/g, '/'),
    hexTokenCount: quickCount,
    renamed: 0,
    byCategory: {},
    unbound: { member: 0, key: 0, other: 0 },
    residual: null,
    changed: false,
    error: null,
  };
  if (quickCount === 0) return report;

  let ast;
  try {
    ast = parse(src, {
      sourceType: 'unambiguous',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowSuperOutsideMethod: true,
    });
  } catch (e) {
    report.error = 'parse: ' + e.message;
    return report;
  }

  const hexBindings = [];
  const bindingInfo = new Map();
  const unboundRefs = new Map(); // 名字 -> 引用该名字（未绑定）的作用域列表

  try {
    traverse(ast, {
      Identifier(p) {
        const name = p.node.name;
        const binding = p.scope.getBinding(name);
        if (!binding) {
          if (isReferencePosition(p)) {
            let list = unboundRefs.get(name);
            if (!list) {
              list = [];
              unboundRefs.set(name, list);
            }
            list.push(p.scope);
          }
          if (!HEX_RE.test(name)) return;
          const parent = p.parent;
          if (parent?.type === 'MemberExpression' && parent.property === p.node && !parent.computed) {
            report.unbound.member += 1;
          } else if (p.parentPath?.isObjectProperty() && p.parentPath.node.key === p.node && !p.parentPath.node.computed && !p.parentPath.node.shorthand) {
            report.unbound.key += 1;
          } else {
            report.unbound.other += 1;
          }
          return;
        }
        if (!HEX_RE.test(name)) return;
        let info = bindingInfo.get(binding);
        if (!info) {
          info = { nodes: [], decl: null, refs: [] };
          bindingInfo.set(binding, info);
          hexBindings.push(binding);
        }
        info.nodes.push(p.node);
        info.refs.push({ scope: p.scope });
        if (p.node === binding.identifier && !info.decl) info.decl = p;
      },
    });
  } catch (e) {
    report.error = 'traverse: ' + e.message;
    return report;
  }

  // 全文件现有绑定名集合：作为候选名碰撞检查的种子
  // （非 hex 绑定保持原名，hex 绑定的新名也会随重命名进度加入）
  const allNames = new Set();
  const seenScopes = new Set();
  try {
    traverse(ast, {
      Scopable(p) {
        const scope = p.scope;
        if (!scope || seenScopes.has(scope)) return;
        seenScopes.add(scope);
        for (const name of Object.keys(scope.bindings)) allNames.add(name);
      },
    });
  } catch (e) {
    report.error = 'seed scopes: ' + e.message;
    return report;
  }

  const overlay = new Map();
  const counters = new Map();
  const nextSeq = (prefix) => {
    const n = (counters.get(prefix) || 0) + 1;
    counters.set(prefix, n);
    return n;
  };
  const canUse = makeCanUse(allNames, unboundRefs);

  try {
    for (const binding of hexBindings) {
      const info = bindingInfo.get(binding);
      if (!info || !info.decl) continue;
      const { cat, base } = categorize(info.decl);
      let finalName = null;
      if (base && isValidName(base) && canUse(binding, base, overlay, info.refs)) {
        finalName = base;
      }
      if (!finalName) {
        const prefix = base && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(base) ? base : (GENERIC_PREFIX[cat] || 'local');
        const candidates = [prefix];
        for (let i = 2; i < 1000; i++) candidates.push(prefix + i);
        for (const cand of candidates) {
          if (isValidName(cand) && canUse(binding, cand, overlay, info.refs)) {
            finalName = cand;
            break;
          }
        }
      }
      if (!finalName) throw new Error('cannot find safe name for ' + binding.identifier.name);
      overlay.set(binding, finalName);
      allNames.add(finalName);
      report.byCategory[cat] = (report.byCategory[cat] || 0) + 1;
    }
  } catch (e) {
    report.error = 'rename: ' + e.message;
    return report;
  }

  const splices = [];
  for (const [binding, info] of bindingInfo) {
    const name = overlay.get(binding);
    if (!name) continue;
    for (const node of info.nodes) {
      splices.push({ start: node.start, end: node.end, text: name });
    }
  }
  splices.sort((a, b) => b.start - a.start);
  let lastStart = Number.MAX_SAFE_INTEGER;
  let out = src;
  for (const sp of splices) {
    if (sp.end > lastStart) {
      report.error = 'splice overlap at ' + sp.start;
      return report;
    }
    out = out.slice(0, sp.start) + sp.text + out.slice(sp.end);
    lastStart = sp.start;
  }

  try {
    parse(out, {
      sourceType: 'unambiguous',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowSuperOutsideMethod: true,
    });
  } catch (e) {
    report.error = 'reparse: ' + e.message;
    return report;
  }

  report.renamed = splices.length;
  const residualAll = (out.match(/_0x[0-9a-f]{4,8}/g) || []).length;
  const residualMember = (out.match(/\._0x[0-9a-f]{4,8}\b/g) || []).length;
  report.residual = { total: residualAll, memberProps: residualMember, other: residualAll - residualMember };
  report.changed = out !== src;

  if (write && report.changed) {
    fs.writeFileSync(file, out, 'utf8');
  }
  return report;
}

const files = [];
for (const t of targets) collectFiles(path.resolve(t), files);

const reports = [];
for (const file of files) {
  try {
    reports.push(processFile(file));
  } catch (e) {
    reports.push({ file: path.relative(process.cwd(), file).replace(/\\/g, '/'), error: String(e && e.message || e) });
  }
}

let totalRenamed = 0;
let totalResidualOther = 0;
for (const r of reports) {
  totalRenamed += r.renamed || 0;
  totalResidualOther += r.residual?.other || 0;
  const status = r.error ? `ERROR(${r.error})` : `renamed=${r.renamed}`;
  const residual = r.residual ? ` residual(total=${r.residual.total}, memberProps=${r.residual.memberProps}, other=${r.residual.other})` : '';
  const unbound = r.unbound ? ` unbound(member=${r.unbound.member}, key=${r.unbound.key}, other=${r.unbound.other})` : '';
  console.log(`${status}${unbound}${residual}  ${r.file}`);
}
console.log(`\nfiles=${reports.length} renamedTotal=${totalRenamed} residualOther=${totalResidualOther} mode=${write ? 'WRITE' : 'DRY-RUN'}`);

if (reportPath) {
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2), 'utf8');
  console.log('report -> ' + reportPath);
}

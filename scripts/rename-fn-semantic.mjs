#!/usr/bin/env node
// 占位函数名（fn/fnN/fnNN）语义化重命名。
//
// 用法：
//   node scripts/rename-fn-semantic.mjs <文件> [--from-exports] [--map <map.json>] [--write]
//
// --from-exports  从对象字面量别名 { someKey: fnNN } 自动还原：把 fnNN 绑定改名为 someKey。
//                 同一 fnNN 出现多个不同键名时视为歧义、跳过。
// --map           应用人工/AI 整理的 JSON 映射 { "fn155": "waitForCommentPanelStable", ... }。
//
// 安全机制与 rename-hex.mjs 相同：作用域碰撞检查（绑定遮蔽、祖先截获、全局名捕获）、
// 按原文偏移拼接、写盘前重新语法解析自检。

import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('@babel/parser');
const traverseMod = require('@babel/traverse');
const traverse = traverseMod.default || traverseMod;

const PLACEHOLDER_RE = /^fn\d*$/;
const RESERVED = new Set(
  ('break case catch class const continue debugger default delete do else export extends finally for function ' +
    'if import in instanceof new return super switch this throw try typeof var void while with yield let static ' +
    'enum await implements package protected interface private public arguments eval undefined NaN Infinity ' +
    'null true false').split(/\s+/)
);

const argv = process.argv.slice(2);
const write = argv.includes('--write');
const fromExports = argv.includes('--from-exports');
const mapIdx = argv.indexOf('--map');
const mapPath = mapIdx >= 0 ? argv[mapIdx + 1] : null;
const targets = argv.filter((a, i) => !a.startsWith('--') && (mapIdx < 0 || i !== mapIdx + 1));
if (!targets.length || (!fromExports && !mapPath)) {
  console.error('用法: node scripts/rename-fn-semantic.mjs <文件> [--from-exports] [--map map.json] [--write]');
  process.exit(1);
}
const manualMap = mapPath ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : null;

function isValidName(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !RESERVED.has(name);
}

function isReferencePosition(p) {
  const parent = p.parentPath;
  if (!parent) return false;
  const node = parent.node;
  if ((parent.isObjectProperty() || parent.isObjectMethod() || parent.isClassProperty() || parent.isClassMethod()) &&
    node.key === p.node && !node.computed && !(parent.isObjectProperty() && node.shorthand)) return false;
  if (parent.isMemberExpression() && node.property === p.node && !node.computed) return false;
  if (parent.isLabeledStatement() && node.label === p.node) return false;
  if ((parent.isBreakStatement() || parent.isContinueStatement()) && node.label === p.node) return false;
  if (parent.isImportSpecifier() && node.imported === p.node) return false;
  if (parent.isExportSpecifier() && node.exported === p.node) return false;
  return true;
}

function isInSubtree(scope, ancestorScope) {
  let s = scope;
  while (s) {
    if (s === ancestorScope) return true;
    s = s.parent;
  }
  return false;
}

// 主流程：解析、收集占位绑定与别名对、碰撞检查、拼接输出
function run(file) {
  const src = fs.readFileSync(file, 'utf8');
  const OPTS = { sourceType: 'unambiguous', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true, allowSuperOutsideMethod: true };
  let ast;
  try {
    ast = parse(src, OPTS);
  } catch (e) {
    return { file, error: 'parse: ' + e.message };
  }

  const bindingInfo = new Map();
  const aliasTargets = new Map();
  const allNames = new Set();
  const unboundRefs = new Map();
  const seenScopes = new Set();

  traverse(ast, {
    Scopable(p) {
      const scope = p.scope;
      if (!scope || seenScopes.has(scope)) return;
      seenScopes.add(scope);
      for (const name of Object.keys(scope.bindings)) allNames.add(name);
    },
    ObjectProperty(p) {
      const node = p.node;
      if (node.computed || node.shorthand) return;
      if (node.value?.type !== 'Identifier' || !PLACEHOLDER_RE.test(node.value.name)) return;
      const keyName = node.key.type === 'Identifier' ? node.key.name
        : node.key.type === 'StringLiteral' ? node.key.value : null;
      if (!keyName || !isValidName(keyName)) return;
      let set = aliasTargets.get(node.value.name);
      if (!set) {
        set = new Set();
        aliasTargets.set(node.value.name, set);
      }
      set.add(keyName);
    },
    Identifier(p) {
      const name = p.node.name;
      const binding = p.scope.getBinding(name);
      if (!PLACEHOLDER_RE.test(name)) {
        if (!binding && isReferencePosition(p)) {
          let list = unboundRefs.get(name);
          if (!list) {
            list = [];
            unboundRefs.set(name, list);
          }
          list.push(p.scope);
        }
        return;
      }
      if (!binding) return;
      let info = bindingInfo.get(binding);
      if (!info) {
        info = { nodes: [], decl: null };
        bindingInfo.set(binding, info);
      }
      info.nodes.push(p.node);
      if (p.node === binding.identifier && !info.decl) info.decl = p;
    },
  });

  const byPlaceholder = new Map();
  for (const [binding] of bindingInfo) {
    const name = binding.identifier.name;
    if (!byPlaceholder.has(name)) byPlaceholder.set(name, []);
    byPlaceholder.get(name).push(binding);
  }

  function canUse(binding, candidate) {
    if (!allNames.has(candidate) && !unboundRefs.has(candidate)) return true;
    const S = binding.scope;
    // 1) 祖先作用域不能有同名绑定（祖先引用会被截获）
    for (let s = S.parent; s; s = s.parent) {
      if (s.bindings[candidate] && s.bindings[candidate] !== binding) return false;
    }
    // 2) S 子树作用域内不能有同名绑定（本文件其他绑定，含已改名的）
    for (const [b2] of bindingInfo) {
      if (b2 === binding) continue;
      const eff = overlay.has(b2) ? overlay.get(b2) : b2.identifier.name;
      if (eff === candidate && isInSubtree(b2.scope, S)) return false;
    }
    // 3) S 子树内不能有同名未绑定引用（全局名，会被捕获）
    const globalUseScopes = unboundRefs.get(candidate);
    if (globalUseScopes && globalUseScopes.some((rs) => isInSubtree(rs, S))) return false;
    return true;
  }

  const overlay = new Map();
  const applied = [];
  let skippedAmbiguous = 0;
  const notFound = [];

  // --from-exports
  if (fromExports) {
    for (const [phName, keySet] of aliasTargets) {
      if (keySet.size !== 1) {
        skippedAmbiguous += 1;
        continue;
      }
      const newName = [...keySet][0];
      const candidates = byPlaceholder.get(phName);
      if (!candidates || candidates.length !== 1) {
        skippedAmbiguous += 1;
        continue;
      }
      const binding = candidates[0];
      if (canUse(binding, newName)) {
        overlay.set(binding, newName);
        allNames.add(newName);
        applied.push({ from: phName, to: newName, kind: 'export' });
      } else {
        skippedAmbiguous += 1;
      }
    }
  }

  // --map
  if (manualMap) {
    for (const [phName, newName] of Object.entries(manualMap)) {
      if (!isValidName(newName)) {
        notFound.push(phName + '(invalid name ' + newName + ')');
        continue;
      }
      const candidates = byPlaceholder.get(phName);
      if (!candidates || candidates.length !== 1) {
        notFound.push(phName + '(binding ' + candidates?.length + ')');
        continue;
      }
      const binding = candidates[0];
      if (!canUse(binding, newName)) {
        notFound.push(phName + '(collision with ' + newName + ')');
        continue;
      }
      overlay.set(binding, newName);
      allNames.add(newName);
      applied.push({ from: phName, to: newName, kind: 'manual' });
    }
  }

  // 拼接输出
  const splices = [];
  for (const [binding, newName] of overlay) {
    const info = bindingInfo.get(binding);
    for (const node of info.nodes) splices.push({ start: node.start, end: node.end, text: newName });
  }
  splices.sort((a, b) => b.start - a.start);
  let out = src;
  let lastStart = Number.MAX_SAFE_INTEGER;
  for (const sp of splices) {
    if (sp.end > lastStart) return { file, error: 'splice overlap at ' + sp.start };
    out = out.slice(0, sp.start) + sp.text + out.slice(sp.end);
    lastStart = sp.start;
  }
  try {
    parse(out, OPTS);
  } catch (e) {
    return { file, error: 'reparse: ' + e.message };
  }
  if (write && out !== src) fs.writeFileSync(file, out, 'utf8');
  const renamedTotal = splices.length;
  return { file, renamedTotal, appliedCount: applied.length, skippedAmbiguous, notFound, applied };
}

for (const t of targets) {
  const r = run(path.resolve(t));
  if (r.error) {
    console.log(`ERROR(${r.error})  ${r.file}`);
    continue;
  }
  console.log(`renamed=${r.renamedTotal} functions=${r.appliedCount} ambiguous=${r.skippedAmbiguous} mode=${write ? 'WRITE' : 'DRY-RUN'}  ${r.file}`);
  for (const a of r.applied) console.log(`  ${a.from} -> ${a.to}  (${a.kind})`);
  for (const n of r.notFound) console.log(`  !! 未应用: ${n}`);
}

#!/usr/bin/env node
// AST 语义等价校验器：验证重命名后的文件与原文件语义一致。
//
// 用法：
//   node scripts/verify-ast-equiv.mjs <原文件> <新文件>
//
// 原理：把两棵 AST 中所有「绑定标识符」规范化为按首次访问顺序的 b1/b2/...，
// 未绑定标识符（全局名、对象键、成员属性）按结构识别并保留原名，然后整体序列化对比。
// 任何重命名引入的语义偏差（遮蔽、漏改、错改、引用错位）都会导致规范化结果不一致。
// 退出码 0 = 等价，1 = 不等价或出错。

import fs from 'node:fs';
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { parse } = require('@babel/parser');
const traverseMod = require('@babel/traverse');
const traverse = traverseMod.default || traverseMod;

const [oldFile, newFile] = process.argv.slice(2);
if (!oldFile || !newFile) {
  console.error('用法: node scripts/verify-ast-equiv.mjs <原文件> <新文件>');
  process.exit(1);
}

const OPTS = {
  sourceType: 'unambiguous',
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowSuperOutsideMethod: true,
};

function canonicalize(src) {
  const ast = parse(src, OPTS);
  const bindingIds = new Map();
  let seq = 0;
  traverse(ast, {
    Identifier(p) {
      // 非引用标识符（对象键/成员属性/标签等）不能靠作用域查找判断——
      // 重命名后键名可能恰好撞上新绑定名，必须按结构统一跳过、保留原名。
      const parent = p.parentPath;
      if (parent) {
        const node = parent.node;
        const isKey = (parent.isObjectProperty() || parent.isObjectMethod() ||
            parent.isClassProperty() || parent.isClassMethod()) &&
          node.key === p.node && !node.computed &&
          !(parent.isObjectProperty() && node.shorthand);
        if (isKey) return;
        if (parent.isMemberExpression() && node.property === p.node && !node.computed) return;
        if (parent.isLabeledStatement() && node.label === p.node) return;
        if ((parent.isBreakStatement() || parent.isContinueStatement()) && node.label === p.node) return;
        if (parent.isImportSpecifier() && node.imported === p.node) return;
        if (parent.isExportSpecifier() && node.exported === p.node) return;
      }
      const binding = p.scope.getBinding(p.node.name);
      if (!binding) return; // 未绑定标识符：保留原名
      let id = bindingIds.get(binding);
      if (!id) {
        id = 'b' + (++seq);
        bindingIds.set(binding, id);
      }
      p.node.name = id;
    },
  });
  stripPositions(ast);
  ast.comments = [];
  ast.tokens = [];
  return JSON.stringify(ast);
}

function stripPositions(value) {
  if (Array.isArray(value)) {
    for (const item of value) stripPositions(item);
    return;
  }
  if (!value || typeof value !== 'object') return;
  delete value.start;
  delete value.end;
  delete value.loc;
  delete value.extra;
  delete value.leadingComments;
  delete value.trailingComments;
  delete value.innerComments;
  for (const key of Object.keys(value)) stripPositions(value[key]);
}

function firstDiff(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return i;
  }
  return a.length === b.length ? -1 : len;
}

try {
  const oldJson = canonicalize(fs.readFileSync(oldFile, 'utf8'));
  const newJson = canonicalize(fs.readFileSync(newFile, 'utf8'));
  if (oldJson === newJson) {
    console.log(`EQUIVALENT  ${oldFile}  ===  ${newFile}`);
    process.exit(0);
  }
  const idx = firstDiff(oldJson, newJson);
  const from = Math.max(0, idx - 150);
  console.error(`NOT EQUIVALENT  首个差异位置 ${idx}`);
  console.error('--- 原文件 ---');
  console.error(oldJson.slice(from, idx + 150));
  console.error('--- 新文件 ---');
  console.error(newJson.slice(from, idx + 150));
  process.exit(1);
} catch (e) {
  console.error('ERROR: ' + (e && e.message || e));
  process.exit(1);
}

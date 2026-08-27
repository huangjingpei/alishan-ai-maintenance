import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distRoot = path.join(repoRoot, 'dist-protected');

const requiredFiles = [
  'package.json',
  'dist-protected/main.js',
  'dist-protected/main.x64.jsc',
  'dist-protected/main.arm64.jsc',
  'dist-protected/main.jsc',
  'dist-protected/automation-preload.js',
  'dist-protected/renderer/index.html',
];

const missing = requiredFiles.filter((relative) => !fs.existsSync(path.join(repoRoot, relative)));
const javascriptFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith('.js')) {
      javascriptFiles.push(fullPath);
    }
  }
}

walk(distRoot);

const syntaxFailures = [];
for (const file of javascriptFiles) {
  try {
    const source = fs.readFileSync(file, 'utf8');
    const isRendererModule = file.includes(`${path.sep}renderer${path.sep}assets${path.sep}`);
    if (isRendererModule) {
      new vm.SourceTextModule(source, { identifier: file });
    } else {
      new vm.Script(source, { filename: file });
    }
  } catch (error) {
    syntaxFailures.push({
      file: path.relative(repoRoot, file),
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const builderConfig = fs.readFileSync(path.join(repoRoot, 'electron-builder.yml'), 'utf8');
const packageDigest = crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(repoRoot, 'package.json')))
  .digest('hex');

const warnings = [];
if (/\.recovered\b/.test(builderConfig)) {
  warnings.push('根目录 electron-builder.yml 仍在使用占位 appId，禁止直接生产发布。');
}
if (!/electronVersion:\s*24\.8\.8\b/.test(builderConfig)) {
  warnings.push('Electron 版本不是已验证的 24.8.8，main.x64.jsc 可能不兼容。');
}
if (packageJson.main !== 'dist-protected/main.js') {
  warnings.push(`package.json main 当前为 ${packageJson.main}，与恢复入口不一致。`);
}

console.log(`Repository: ${repoRoot}`);
console.log(`JavaScript files checked: ${javascriptFiles.length}`);
console.log(`Required files missing: ${missing.length}`);
console.log(`Syntax failures: ${syntaxFailures.length}`);
console.log(`package.json SHA-256: ${packageDigest}`);

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}
for (const file of missing) {
  console.error(`MISSING: ${file}`);
}
for (const failure of syntaxFailures) {
  console.error(`SYNTAX: ${failure.file}: ${failure.message}`);
}

if (missing.length > 0 || syntaxFailures.length > 0) {
  process.exitCode = 1;
}

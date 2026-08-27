import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const distRoot = path.join(repoRoot, 'dist-protected');
const manifestPath = path.join(distRoot, 'protection-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const result = {
  manifestEntries: 0,
  matched: [],
  changed: [],
  missing: [],
};

for (const [relativePath, expectedHash] of Object.entries(manifest.files ?? {})) {
  result.manifestEntries += 1;
  if (relativePath === 'protection-manifest.json') {
    continue;
  }

  const fullPath = path.join(distRoot, ...relativePath.split('/'));
  if (!fs.existsSync(fullPath)) {
    result.missing.push(relativePath);
    continue;
  }

  const actualHash = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
  if (actualHash === expectedHash) {
    result.matched.push(relativePath);
  } else {
    result.changed.push({ relativePath, expectedHash, actualHash });
  }
}

console.log(`Manifest entries: ${result.manifestEntries}`);
console.log(`Matched: ${result.matched.length}`);
console.log(`Changed: ${result.changed.length}`);
console.log(`Missing: ${result.missing.length}`);
console.log('Changed files are expected in the readable development tree. Runtime enforcement is not yet confirmed.');

for (const file of result.missing) {
  console.error(`MISSING: ${file}`);
}
for (const item of result.changed.slice(0, 25)) {
  console.log(`CHANGED: ${item.relativePath}`);
}
if (result.changed.length > 25) {
  console.log(`... ${result.changed.length - 25} additional changed files omitted`);
}

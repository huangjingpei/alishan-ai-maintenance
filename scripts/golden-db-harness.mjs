// dbManager 黄金基线 harness：在临时目录上执行一组固定的数据库操作，把结果序列化为 JSON。
//
// 用法（必须用 Electron 的 Node 运行时，better-sqlite3 按 Electron ABI 编译）：
//   ELECTRON_RUN_AS_NODE=1 node_modules/electron/dist/electron.exe scripts/golden-db-harness.mjs <out.json>
//
// 改名前后各跑一次，diff 两份 JSON 即语义回归门。时间戳类字段会被掩码保证可复现。

import Module from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(repoRoot, 'dist-protected');

const outPath = process.argv[2] || path.join(repoRoot, '.temp', 'golden-latest.json');
fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });

// ---- electron 打桩：依赖链只用到 app.getPath("userData")，且都有降级逻辑 ----
const stubDirs = [];
const electronStub = {
  app: {
    isPackaged: true,
    getPath: (name) => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hk-stub-' + name + '-'));
      stubDirs.push(dir);
      return dir;
    },
    on() {},
    setPath() {},
    whenReady: () => Promise.resolve(),
    getAppPath: () => repoRoot,
  },
  ipcMain: { handle() {}, on() {}, removeAllListeners() {} },
  ipcRenderer: { invoke: () => Promise.resolve(null), on() {}, send() {} },
  BrowserWindow: class {
    constructor() { this.webContents = { on() {}, send() {}, closeDevTools() {} }; }
    loadURL() { return Promise.resolve(); }
    loadFile() { return Promise.resolve(); }
    on() {}
  },
};
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'electron') return electronStub;
  return origLoad.call(this, request, parent, isMain);
};

// console 输出走缓冲，保持 stdout 只有 JSON
const logs = [];
console.log = (...a) => logs.push(a.map(String).join(' '));
console.error = (...a) => logs.push('[err] ' + a.map(String).join(' '));
console.warn = (...a) => logs.push('[warn] ' + a.map(String).join(' '));

const dbManager = require(path.join(distRoot, 'main', 'dbManager.js'));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hk-golden-'));
const steps = [];

function step(name, fn) {
  const entry = { name };
  try {
    entry.result = fn();
    entry.ok = true;
  } catch (e) {
    entry.ok = false;
    entry.error = String((e && e.message) || e);
  }
  steps.push(entry);
}

step('initDatabase', () => {
  const db = dbManager.initDatabase(tmp);
  return { open: !!db && db.open, inMemory: db && db.name === ':memory:' };
});

step('initDatabase.idempotent', () => {
  const db = dbManager.initDatabase(tmp);
  return { open: !!db && db.open };
});

step('migrations.run', () => dbManager.runCollectedLibraryMigrations(tmp, tmp));

step('migration.roundtrip', () => {
  dbManager.recordMigration('golden_m1');
  return {
    after: dbManager.isMigrationExecuted('golden_m1'),
    missing: dbManager.isMigrationExecuted('golden_never'),
  };
});

step('aiAgents.crud', () => {
  const saved = dbManager.saveAiAgentsBatch([
    { id: 'agent-a', name: '测试智能体', description: '描述', system_prompt: '系统提示词', model: 'gpt-test' },
    { id: 'agent-b', name: '备用智能体', prompt: '提示词B' },
  ]);
  const listed = dbManager.getAiAgents();
  const deleted = dbManager.deleteAiAgent('agent-a');
  const afterDelete = dbManager.getAiAgents();
  return { saved, listed, deleted, afterDeleteNames: afterDelete.map((a) => a.name) };
});

step('entityLeadgen.flow', () => {
  const task = dbManager.upsertEntityLeadgenTask({
    id: 'task-g1',
    name: '黄金任务',
    status: 'running',
    leads: [
      { id: 'lead-1', nickname: '用户一', source_type: 'comment' },
      { id: 'lead-2', nickname: '用户二', source_type: 'video' },
    ],
  });
  const appended = dbManager.appendEntityLeadgenLeads('task-g1', [
    { id: 'lead-3', nickname: '用户三', source_type: 'author' },
  ]);
  const count = dbManager.countEntityLeadgenLeads('task-g1');
  const page = dbManager.listEntityLeadgenLeadsPage('task-g1', { page: 1, pageSize: 10 });
  const removed = dbManager.deleteEntityLeadgenLeads('task-g1', { leadIds: ['lead-2'] });
  const countAfter = dbManager.countEntityLeadgenLeads('task-g1');
  return {
    task: task && { id: task.id, name: task.name, status: task.status, leadCount: Array.isArray(task.leads) ? task.leads.length : null },
    appended, count,
    page: page && { total: page.total, itemCount: Array.isArray(page.items) ? page.items.length : null, counts: page.counts },
    removed, countAfter,
  };
});

step('entityLeadgen.invalidTask', () => ({
  append: dbManager.appendEntityLeadgenLeads('task-never', [{ id: 'x' }]),
  count: dbManager.countEntityLeadgenLeads('task-never'),
}));

step('videoCardHelpers', () => ({
  like1: dbManager.isVideoCardLeadLike({ id: 'v1', nickname: 'n', source_type: 'video' }),
  like2: dbManager.isVideoCardLeadLike({ nickname: 'n' }),
  normalized: dbManager.normalizeVideoCardLeadForPool({ id: 'v2', nickname: '用户N', video_url: 'https://v.douyin.com/x/', extra: 'keep' }),
}));

step('leadOptionLists', () => ({
  accounts: dbManager.listLeadAccountNames(),
  keywords: dbManager.listLeadSearchKeywords(),
  locations: dbManager.listLeadLocations(),
  runtimeReady: dbManager.isLeadsRuntimeReady(),
}));

step('schema.ensure', () => {
  dbManager.ensureLeadSchemaColumns();
  return { ok: true };
});

// ---- 稳定化：掩码时间戳与临时路径 ----
const maskPaths = [tmp, ...stubDirs];
function stabilize(value, key) {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return '<date>';
  if (Array.isArray(value)) return value.map((v) => stabilize(v, key));
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = /(_at$|^ts$|At$|savedAt|captured)/.test(k) ? '<ts>' : stabilize(v, k);
    }
    return out;
  }
  if (typeof value === 'string') {
    let s = value;
    for (const p of maskPaths) s = s.split(p).join('<tmp>');
    return s;
  }
  return value;
}

const report = {
  generatedAt: '<masked>',
  node: process.version,
  steps: stabilize(steps),
  logTail: logs.slice(-40).map((l) => l.split(tmp).join('<tmp>')),
};
fs.writeFileSync(path.resolve(outPath), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log = process.stdout.write.bind(process.stdout);
console.log('golden baseline written: ' + outPath);

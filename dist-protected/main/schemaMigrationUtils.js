'use strict';

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
function getDbManager() {
  try {
    return require("./dbManager");
  } catch (_0x20ad9c) {
    return null;
  }
}
function getDb() {
  const _0x186a1c = getDbManager();
  if (!_0x186a1c?.getDatabaseInstance) {
    return null;
  }
  const _0x2af779 = _0x186a1c.getDatabaseInstance();
  if (!_0x2af779) {
    return null;
  }
  try {
    _0x2af779.prepare("SELECT 1").get();
    return _0x2af779;
  } catch (_0x365c80) {
    return null;
  }
}
function getUserDataPath() {
  try {
    const {
      app: _0x3d7e04
    } = require("electron");
    if (_0x3d7e04?.getPath) {
      return _0x3d7e04.getPath("userData");
    }
  } catch (_0x119677) {}
  try {
    const _0x2d9252 = getDb();
    if (_0x2d9252?.name) {
      return path.dirname(_0x2d9252.name);
    }
  } catch (_0x46bc46) {}
  return "";
}
function ensureSchemaMigrationsTable(_0x3ff6ad) {
  if (!_0x3ff6ad) {
    return;
  }
  _0x3ff6ad.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(_0x247bc5, _0x45d283) {
  try {
    ensureSchemaMigrationsTable(_0x247bc5);
    return _0x247bc5.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(_0x45d283) || null;
  } catch (_0x564f16) {
    return null;
  }
}
function isMigrationDone(_0xda3e1a, _0x1f2b95) {
  return String(getMigrationRow(_0xda3e1a, _0x1f2b95)?.status || "") === "done";
}
function markMigrationDone(_0x2f39f6, _0x2432bb, {
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(_0x2f39f6);
  _0x2f39f6.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(_0x2432bb, Date.now(), String(backupPath || ""), JSON.stringify(stats || {}));
}
function listStoreKeys(_0x83444a) {
  try {
    if (_0x83444a && typeof _0x83444a.store === "object" && _0x83444a.store) {
      return Object.keys(_0x83444a.store);
    }
  } catch (_0x26451c) {}
  return [];
}
function writeJsonBackup(_0x56e30e, _0x5c4cb8, _0x198301, _0x239ae6) {
  if (!_0x56e30e) {
    return {
      backupPath: "",
      checksum: ""
    };
  }
  const _0x3420fc = path.join(_0x56e30e, "backups");
  fs.mkdirSync(_0x3420fc, {
    recursive: true
  });
  const _0x444261 = Date.now();
  const _0xd29f7e = path.join(_0x3420fc, _0x5c4cb8 + "_" + _0x444261 + ".json");
  const _0x2ec936 = JSON.stringify(_0x239ae6);
  const _0x429550 = crypto.createHash("sha256").update(_0x2ec936).digest("hex");
  const _0x227bab = {
    version: 1,
    migrationId: _0x198301,
    exportedAt: _0x444261,
    checksum: _0x429550,
    ..._0x239ae6
  };
  fs.writeFileSync(_0xd29f7e, JSON.stringify(_0x227bab), "utf8");
  const _0x3db660 = JSON.parse(fs.readFileSync(_0xd29f7e, "utf8"));
  if (String(_0x3db660.checksum || "") !== _0x429550) {
    throw new Error(_0x5c4cb8 + " 备份校验和不一致");
  }
  fs.writeFileSync(_0xd29f7e + ".meta.json", JSON.stringify({
    migrationId: _0x198301,
    exportedAt: _0x444261,
    checksum: _0x429550,
    backupPath: _0xd29f7e,
    keys: Object.keys(_0x239ae6 || {})
  }, null, 2), "utf8");
  return {
    backupPath: _0xd29f7e,
    checksum: _0x429550
  };
}
module.exports = {
  getDbManager: getDbManager,
  getDb: getDb,
  getUserDataPath: getUserDataPath,
  ensureSchemaMigrationsTable: ensureSchemaMigrationsTable,
  getMigrationRow: getMigrationRow,
  isMigrationDone: isMigrationDone,
  markMigrationDone: markMigrationDone,
  listStoreKeys: listStoreKeys,
  writeJsonBackup: writeJsonBackup
};
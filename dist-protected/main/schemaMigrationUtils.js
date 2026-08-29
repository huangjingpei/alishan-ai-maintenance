'use strict';

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
function getDbManager() {
  try {
    return require("./dbManager");
  } catch (error) {
    return null;
  }
}
function getDb() {
  const result = getDbManager();
  if (!result?.getDatabaseInstance) {
    return null;
  }
  const result2 = result.getDatabaseInstance();
  if (!result2) {
    return null;
  }
  try {
    result2.prepare("SELECT 1").get();
    return result2;
  } catch (error) {
    return null;
  }
}
function getUserDataPath() {
  try {
    const {
      app: app
    } = require("electron");
    if (app?.getPath) {
      return app.getPath("userData");
    }
  } catch (error) {}
  try {
    const result = getDb();
    if (result?.name) {
      return path.dirname(result.name);
    }
  } catch (error) {}
  return "";
}
function ensureSchemaMigrationsTable(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(arg1, arg2) {
  try {
    ensureSchemaMigrationsTable(arg1);
    return arg1.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(arg2) || null;
  } catch (error) {
    return null;
  }
}
function isMigrationDone(arg1, arg2) {
  return String(getMigrationRow(arg1, arg2)?.status || "") === "done";
}
function markMigrationDone(arg1, arg2, {
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(arg1);
  arg1.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(arg2, Date.now(), String(backupPath || ""), JSON.stringify(stats || {}));
}
function listStoreKeys(arg1) {
  try {
    if (arg1 && typeof arg1.store === "object" && arg1.store) {
      return Object.keys(arg1.store);
    }
  } catch (error) {}
  return [];
}
function writeJsonBackup(arg1, arg2, arg3, arg4) {
  if (!arg1) {
    return {
      backupPath: "",
      checksum: ""
    };
  }
  const result = path.join(arg1, "backups");
  fs.mkdirSync(result, {
    recursive: true
  });
  const result2 = Date.now();
  const result3 = path.join(result, arg2 + "_" + result2 + ".json");
  const result4 = JSON.stringify(arg4);
  const result5 = crypto.createHash("sha256").update(result4).digest("hex");
  const obj = {
    version: 1,
    migrationId: arg3,
    exportedAt: result2,
    checksum: result5,
    ...arg4
  };
  fs.writeFileSync(result3, JSON.stringify(obj), "utf8");
  const result6 = JSON.parse(fs.readFileSync(result3, "utf8"));
  if (String(result6.checksum || "") !== result5) {
    throw new Error(arg2 + " 备份校验和不一致");
  }
  fs.writeFileSync(result3 + ".meta.json", JSON.stringify({
    migrationId: arg3,
    exportedAt: result2,
    checksum: result5,
    backupPath: result3,
    keys: Object.keys(arg4 || {})
  }, null, 2), "utf8");
  return {
    backupPath: result3,
    checksum: result5
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
'use strict';

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const processedVideosStore = require("./processedVideosStore");
const STORE_KEY = "processed_videos_detail";
const STORE_KEY_V1 = "processed_videos";
const STORE_KEY_V2 = "processed_videos_v2";
const MIGRATION_ID = "processed_videos_sqlite_v1";
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
  if (result2) {
    processedVideosStore.ensureTables(result2);
  }
  return result2;
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
  const result = getDbManager();
  try {
    const result = getDb();
    if (result?.name) {
      return path.dirname(result.name);
    }
  } catch (error) {}
  return "";
}
function ensureSchemaMigrationsTable(arg1) {
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(arg1) {
  try {
    ensureSchemaMigrationsTable(arg1);
    return arg1.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(MIGRATION_ID) || null;
  } catch (error) {
    return null;
  }
}
function isMigrationDone(arg1) {
  return String(getMigrationRow(arg1)?.status || "") === "done";
}
function markMigrationDone(arg1, {
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(arg1);
  arg1.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), String(backupPath || ""), JSON.stringify(stats));
}
function collectLegacyProcessedVideos(arg1) {
  if (!arg1 || typeof arg1.get !== "function") {
    return [];
  }
  const local = arg1.get(STORE_KEY, []) || [];
  const local2 = arg1.get(STORE_KEY_V1, []) || [];
  const local3 = arg1.get(STORE_KEY_V2, []) || [];
  const list = [];
  const set = new Set();
  const local4 = arg1 => {
    if (!arg1) {
      return;
    }
    const value = typeof arg1 === "string" ? arg1 : String(arg1.url || "").trim();
    if (!value || set.has(value)) {
      return;
    }
    set.add(value);
    if (typeof arg1 === "string") {
      list.push({
        url: value,
        title: "历史扫描记录",
        platform: "douyin",
        timestamp: Date.now(),
        recordType: "history_video"
      });
    } else {
      list.push({
        ...arg1,
        url: value
      });
    }
  };
  local.forEach(local4);
  local3.forEach(local4);
  local2.forEach(local4);
  return list;
}
function writeBackup(arg1, arg2) {
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
  const result3 = path.join(result, "processed_videos_" + result2 + ".json");
  const obj = {
    version: 1,
    migrationId: MIGRATION_ID,
    exportedAt: result2,
    count: arg2.length,
    items: arg2
  };
  const result4 = crypto.createHash("sha256").update(JSON.stringify(arg2)).digest("hex");
  obj.checksum = result4;
  fs.writeFileSync(result3, JSON.stringify(obj), "utf8");
  const result5 = JSON.parse(fs.readFileSync(result3, "utf8"));
  if (!Array.isArray(result5.items) || result5.items.length !== arg2.length) {
    throw new Error("历史视频备份读回条数不一致");
  }
  fs.writeFileSync(result3 + ".meta.json", JSON.stringify({
    migrationId: MIGRATION_ID,
    exportedAt: result2,
    count: arg2.length,
    checksum: result4,
    backupPath: result3
  }, null, 2), "utf8");
  return {
    backupPath: result3,
    checksum: result4
  };
}
function clearLegacyStoreKeys(arg1) {
  if (!arg1 || typeof arg1.set !== "function") {
    return;
  }
  try {
    arg1.set(STORE_KEY, []);
    arg1.set(STORE_KEY + "_migrated_at", Date.now());
    if (typeof arg1.delete === "function") {
      arg1.delete(STORE_KEY_V1);
      arg1.delete(STORE_KEY_V2);
    }
  } catch (error) {}
}
function runProcessedVideosSqliteMigrationIfNeeded(arg1) {
  const result = getDb();
  if (!result) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  const result2 = collectLegacyProcessedVideos(arg1);
  const flag = isMigrationDone(result);
  if (flag && result2.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (flag && result2.length > 0) {
    console.warn("[Migrate] processed_videos_sqlite_v1 已 done 但 store 仍有 " + result2.length + " 条残留，补导入");
  }
  if (!result2.length) {
    markMigrationDone(result, {
      stats: {
        imported: 0,
        storeCount: 0,
        empty: true
      }
    });
    console.log("[Migrate] processed_videos_sqlite_v1: store 无历史视频，已标记 done");
    return {
      skipped: false,
      empty: true,
      done: true
    };
  }
  const result3 = getUserDataPath();
  let obj = {
    backupPath: "",
    checksum: ""
  };
  try {
    obj = writeBackup(result3, result2);
    console.log("[Migrate] 已备份 " + result2.length + " 条历史视频 → " + obj.backupPath);
  } catch (error) {
    console.error("[Migrate] 历史视频备份失败，中止迁移（保留 store）:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "backup"
    };
  }
  const result4 = processedVideosStore.count(result);
  try {
    const result3 = processedVideosStore.upsertMany(result, result2);
    const result5 = processedVideosStore.count(result);
    const value = result2.filter(arg1 => !!processedVideosStore.resolveVideoId(arg1)).length;
    if (value > 0 && result5 < Math.min(value, result4 + result3) && result3 === 0) {
      throw new Error("校验失败：可解析 " + value + " 条但写入 0");
    }
    markMigrationDone(result, {
      backupPath: obj.backupPath,
      stats: {
        imported: result3,
        storeCount: result2.length,
        resolvable: value,
        sqliteCountBefore: result4,
        sqliteCountAfter: result5,
        checksum: obj.checksum,
        residualReimport: flag
      }
    });
    clearLegacyStoreKeys(arg1);
    console.log("[Migrate] processed_videos_sqlite_v1 完成: store=" + result2.length + " imported=" + result3 + " sqlite=" + result5 + " backup=" + obj.backupPath);
    return {
      skipped: false,
      imported: result3,
      done: true,
      backupPath: obj.backupPath,
      sqliteCount: result5
    };
  } catch (error) {
    console.error("[Migrate] processed_videos_sqlite_v1 失败（保留 store + 备份）:", error);
    return {
      skipped: false,
      error: error.message || String(error),
      stage: "migrate",
      backupPath: obj.backupPath
    };
  }
}
function listAll(arg1) {
  const result = getDb();
  if (result) {
    return processedVideosStore.listAll(result);
  }
  return collectLegacyProcessedVideos(arg1);
}
function listHistoryVideos(arg1) {
  const result = getDb();
  if (result) {
    return processedVideosStore.listHistoryVideos(result);
  }
  return collectLegacyProcessedVideos(arg1).filter(arg1 => arg1?.recordType !== "collected_link");
}
function listHistoryVideosPage(arg1, options = {}) {
  const result = Math.max(1, Number(options.page) || Number(options.current) || 1);
  const result2 = Math.max(1, Math.min(500, Number(options.pageSize) || Number(options.limit) || 20));
  const value = (result - 1) * result2;
  const result3 = String(options.keyword || options.search || "").trim();
  const result4 = getDb();
  if (result4) {
    const result5 = processedVideosStore.queryHistoryPage(result4, {
      offset: value,
      limit: result2,
      keyword: result3
    });
    return {
      ...result5,
      page: result,
      pageSize: result2
    };
  }
  let result5 = collectLegacyProcessedVideos(arg1).filter(arg1 => arg1?.recordType !== "collected_link");
  if (result3) {
    const result = result3.toLowerCase();
    result5 = result5.filter(arg1 => [arg1.title, arg1.author, arg1.authorNickname, arg1.url, arg1.video_id, arg1.videoId].some(arg1 => String(arg1 || "").toLowerCase().includes(result)));
  }
  result5.sort((arg1, arg2) => (Number(arg2.timestamp) || 0) - (Number(arg1.timestamp) || 0));
  const value2 = result5.length;
  return {
    items: result5.slice(value, value + result2),
    total: value2,
    page: result,
    pageSize: result2
  };
}
function upsert(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.upsertOne(result, arg2);
  }
  if (!arg1) {
    return false;
  }
  const local = arg1.get(STORE_KEY, []) || [];
  const {
    processedVideoKeysMatch: processedVideoKeysMatch
  } = require("../shared/processedVideoKey");
  const local2 = arg2?.url || "";
  const result2 = local.findIndex(arg1 => processedVideoKeysMatch(arg1.url, local2));
  if (result2 >= 0) {
    local[result2] = {
      ...local[result2],
      ...arg2
    };
  } else {
    local.unshift(arg2);
  }
  arg1.set(STORE_KEY, local.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK));
  return true;
}
function upsertMany(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.upsertMany(result, arg2);
  }
  if (!arg1 || !Array.isArray(arg2)) {
    return 0;
  }
  let local = arg1.get(STORE_KEY, []) || [];
  const {
    processedVideoKeysMatch: processedVideoKeysMatch
  } = require("../shared/processedVideoKey");
  for (const item of arg2) {
    const result = local.findIndex(arg1 => processedVideoKeysMatch(arg1.url, item?.url));
    if (result >= 0) {
      local[result] = {
        ...local[result],
        ...item
      };
    } else {
      local.unshift(item);
    }
  }
  local = local.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK);
  arg1.set(STORE_KEY, local);
  return arg2.length;
}
function replaceAll(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.replaceAll(result, arg2);
  }
  if (!arg1) {
    return false;
  }
  arg1.set(STORE_KEY, Array.isArray(arg2) ? arg2.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK) : []);
  return true;
}
function removeByUrls(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.deleteByUrls(result, arg2);
  }
  if (!arg1) {
    return 0;
  }
  const {
    processedVideoKeysMatch: processedVideoKeysMatch
  } = require("../shared/processedVideoKey");
  const value = Array.isArray(arg2) ? arg2 : [arg2];
  const value2 = (arg1.get(STORE_KEY, []) || []).length;
  const result2 = (arg1.get(STORE_KEY, []) || []).filter(arg1 => !value.some(arg12 => processedVideoKeysMatch(arg1.url, arg12)));
  arg1.set(STORE_KEY, result2);
  return value2 - result2.length;
}
function clearAuthorUrls(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.clearAuthorUrlByVideoUrls(result, arg2);
  }
  if (!arg1) {
    return 0;
  }
  const {
    processedVideoKeysMatch: processedVideoKeysMatch
  } = require("../shared/processedVideoKey");
  const local = arg1.get(STORE_KEY, []) || [];
  let num = 0;
  const result2 = local.map(arg1 => {
    if (!arg2.some(arg12 => processedVideoKeysMatch(arg1.url, arg12))) {
      return arg1;
    }
    if (!arg1?.authorUrl) {
      return arg1;
    }
    num += 1;
    return {
      ...arg1,
      authorUrl: ""
    };
  });
  if (num) {
    arg1.set(STORE_KEY, result2);
  }
  return num;
}
function clearAll(arg1) {
  const result = getDb();
  if (result) {
    return processedVideosStore.clearAll(result);
  }
  if (!arg1) {
    return 0;
  }
  const value = collectLegacyProcessedVideos(arg1).length;
  clearLegacyStoreKeys(arg1);
  return value;
}
function findByUrl(arg1, arg2) {
  const result = getDb();
  if (result) {
    return processedVideosStore.findByUrl(result, arg2);
  }
  const {
    processedVideoKeysMatch: processedVideoKeysMatch
  } = require("../shared/processedVideoKey");
  return collectLegacyProcessedVideos(arg1).find(arg1 => processedVideoKeysMatch(arg1.url, arg2)) || null;
}
function isProcessed(arg1, arg2) {
  return !!findByUrl(arg1, arg2);
}
module.exports = {
  STORE_KEY: STORE_KEY,
  MIGRATION_ID: MIGRATION_ID,
  collectLegacyProcessedVideos: collectLegacyProcessedVideos,
  runProcessedVideosSqliteMigrationIfNeeded: runProcessedVideosSqliteMigrationIfNeeded,
  listAll: listAll,
  listHistoryVideos: listHistoryVideos,
  listHistoryVideosPage: listHistoryVideosPage,
  upsert: upsert,
  upsertMany: upsertMany,
  replaceAll: replaceAll,
  removeByUrls: removeByUrls,
  clearAuthorUrls: clearAuthorUrls,
  clearAll: clearAll,
  findByUrl: findByUrl,
  isProcessed: isProcessed
};
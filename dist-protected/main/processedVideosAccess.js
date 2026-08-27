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
  } catch (_0x14f3bf) {
    return null;
  }
}
function getDb() {
  const _0x3527b7 = getDbManager();
  if (!_0x3527b7?.getDatabaseInstance) {
    return null;
  }
  const _0x3cd802 = _0x3527b7.getDatabaseInstance();
  if (_0x3cd802) {
    processedVideosStore.ensureTables(_0x3cd802);
  }
  return _0x3cd802;
}
function getUserDataPath() {
  try {
    const {
      app: _0x1c3a30
    } = require("electron");
    if (_0x1c3a30?.getPath) {
      return _0x1c3a30.getPath("userData");
    }
  } catch (_0x37f169) {}
  const _0x500c2f = getDbManager();
  try {
    const _0x28d8b6 = getDb();
    if (_0x28d8b6?.name) {
      return path.dirname(_0x28d8b6.name);
    }
  } catch (_0x705adb) {}
  return "";
}
function ensureSchemaMigrationsTable(_0x2a7fe9) {
  _0x2a7fe9.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(_0x48951f) {
  try {
    ensureSchemaMigrationsTable(_0x48951f);
    return _0x48951f.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(MIGRATION_ID) || null;
  } catch (_0xf43e18) {
    return null;
  }
}
function isMigrationDone(_0x541df5) {
  return String(getMigrationRow(_0x541df5)?.status || "") === "done";
}
function markMigrationDone(_0x1de417, {
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(_0x1de417);
  _0x1de417.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), String(backupPath || ""), JSON.stringify(stats));
}
function collectLegacyProcessedVideos(_0xcef757) {
  if (!_0xcef757 || typeof _0xcef757.get !== "function") {
    return [];
  }
  const _0x308847 = _0xcef757.get(STORE_KEY, []) || [];
  const _0x6338c4 = _0xcef757.get(STORE_KEY_V1, []) || [];
  const _0x3646d5 = _0xcef757.get(STORE_KEY_V2, []) || [];
  const _0x17df46 = [];
  const _0x51a2ba = new Set();
  const _0x240f1d = _0x50e230 => {
    if (!_0x50e230) {
      return;
    }
    const _0x316e90 = typeof _0x50e230 === "string" ? _0x50e230 : String(_0x50e230.url || "").trim();
    if (!_0x316e90 || _0x51a2ba.has(_0x316e90)) {
      return;
    }
    _0x51a2ba.add(_0x316e90);
    if (typeof _0x50e230 === "string") {
      _0x17df46.push({
        url: _0x316e90,
        title: "历史扫描记录",
        platform: "douyin",
        timestamp: Date.now(),
        recordType: "history_video"
      });
    } else {
      _0x17df46.push({
        ..._0x50e230,
        url: _0x316e90
      });
    }
  };
  _0x308847.forEach(_0x240f1d);
  _0x3646d5.forEach(_0x240f1d);
  _0x6338c4.forEach(_0x240f1d);
  return _0x17df46;
}
function writeBackup(_0x2ec1a4, _0x268a40) {
  if (!_0x2ec1a4) {
    return {
      backupPath: "",
      checksum: ""
    };
  }
  const _0x41ea53 = path.join(_0x2ec1a4, "backups");
  fs.mkdirSync(_0x41ea53, {
    recursive: true
  });
  const _0x45ca31 = Date.now();
  const _0x321322 = path.join(_0x41ea53, "processed_videos_" + _0x45ca31 + ".json");
  const _0x5e2c13 = {
    version: 1,
    migrationId: MIGRATION_ID,
    exportedAt: _0x45ca31,
    count: _0x268a40.length,
    items: _0x268a40
  };
  const _0x26065f = crypto.createHash("sha256").update(JSON.stringify(_0x268a40)).digest("hex");
  _0x5e2c13.checksum = _0x26065f;
  fs.writeFileSync(_0x321322, JSON.stringify(_0x5e2c13), "utf8");
  const _0xd7e5cf = JSON.parse(fs.readFileSync(_0x321322, "utf8"));
  if (!Array.isArray(_0xd7e5cf.items) || _0xd7e5cf.items.length !== _0x268a40.length) {
    throw new Error("历史视频备份读回条数不一致");
  }
  fs.writeFileSync(_0x321322 + ".meta.json", JSON.stringify({
    migrationId: MIGRATION_ID,
    exportedAt: _0x45ca31,
    count: _0x268a40.length,
    checksum: _0x26065f,
    backupPath: _0x321322
  }, null, 2), "utf8");
  return {
    backupPath: _0x321322,
    checksum: _0x26065f
  };
}
function clearLegacyStoreKeys(_0x4423c1) {
  if (!_0x4423c1 || typeof _0x4423c1.set !== "function") {
    return;
  }
  try {
    _0x4423c1.set(STORE_KEY, []);
    _0x4423c1.set(STORE_KEY + "_migrated_at", Date.now());
    if (typeof _0x4423c1.delete === "function") {
      _0x4423c1.delete(STORE_KEY_V1);
      _0x4423c1.delete(STORE_KEY_V2);
    }
  } catch (_0xf11514) {}
}
function runProcessedVideosSqliteMigrationIfNeeded(_0x16d3eb) {
  const _0x28d637 = getDb();
  if (!_0x28d637) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  const _0x880b7a = collectLegacyProcessedVideos(_0x16d3eb);
  const _0x4684e2 = isMigrationDone(_0x28d637);
  if (_0x4684e2 && _0x880b7a.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (_0x4684e2 && _0x880b7a.length > 0) {
    console.warn("[Migrate] processed_videos_sqlite_v1 已 done 但 store 仍有 " + _0x880b7a.length + " 条残留，补导入");
  }
  if (!_0x880b7a.length) {
    markMigrationDone(_0x28d637, {
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
  const _0x52d35e = getUserDataPath();
  let _0x1dfac7 = {
    backupPath: "",
    checksum: ""
  };
  try {
    _0x1dfac7 = writeBackup(_0x52d35e, _0x880b7a);
    console.log("[Migrate] 已备份 " + _0x880b7a.length + " 条历史视频 → " + _0x1dfac7.backupPath);
  } catch (_0x104239) {
    console.error("[Migrate] 历史视频备份失败，中止迁移（保留 store）:", _0x104239);
    return {
      success: false,
      error: _0x104239.message || String(_0x104239),
      stage: "backup"
    };
  }
  const _0x255d4b = processedVideosStore.count(_0x28d637);
  try {
    const _0x769c1e = processedVideosStore.upsertMany(_0x28d637, _0x880b7a);
    const _0x1c6db8 = processedVideosStore.count(_0x28d637);
    const _0x1e4e54 = _0x880b7a.filter(_0x35dd0b => !!processedVideosStore.resolveVideoId(_0x35dd0b)).length;
    if (_0x1e4e54 > 0 && _0x1c6db8 < Math.min(_0x1e4e54, _0x255d4b + _0x769c1e) && _0x769c1e === 0) {
      throw new Error("校验失败：可解析 " + _0x1e4e54 + " 条但写入 0");
    }
    markMigrationDone(_0x28d637, {
      backupPath: _0x1dfac7.backupPath,
      stats: {
        imported: _0x769c1e,
        storeCount: _0x880b7a.length,
        resolvable: _0x1e4e54,
        sqliteCountBefore: _0x255d4b,
        sqliteCountAfter: _0x1c6db8,
        checksum: _0x1dfac7.checksum,
        residualReimport: _0x4684e2
      }
    });
    clearLegacyStoreKeys(_0x16d3eb);
    console.log("[Migrate] processed_videos_sqlite_v1 完成: store=" + _0x880b7a.length + " imported=" + _0x769c1e + " sqlite=" + _0x1c6db8 + " backup=" + _0x1dfac7.backupPath);
    return {
      skipped: false,
      imported: _0x769c1e,
      done: true,
      backupPath: _0x1dfac7.backupPath,
      sqliteCount: _0x1c6db8
    };
  } catch (_0x489b61) {
    console.error("[Migrate] processed_videos_sqlite_v1 失败（保留 store + 备份）:", _0x489b61);
    return {
      skipped: false,
      error: _0x489b61.message || String(_0x489b61),
      stage: "migrate",
      backupPath: _0x1dfac7.backupPath
    };
  }
}
function listAll(_0x4eb247) {
  const _0x2688db = getDb();
  if (_0x2688db) {
    return processedVideosStore.listAll(_0x2688db);
  }
  return collectLegacyProcessedVideos(_0x4eb247);
}
function listHistoryVideos(_0x6339e4) {
  const _0xde1fe6 = getDb();
  if (_0xde1fe6) {
    return processedVideosStore.listHistoryVideos(_0xde1fe6);
  }
  return collectLegacyProcessedVideos(_0x6339e4).filter(_0x1dd079 => _0x1dd079?.recordType !== "collected_link");
}
function listHistoryVideosPage(_0xdd6a7e, _0x20a5fe = {}) {
  const _0x4753c8 = Math.max(1, Number(_0x20a5fe.page) || Number(_0x20a5fe.current) || 1);
  const _0x185e4b = Math.max(1, Math.min(500, Number(_0x20a5fe.pageSize) || Number(_0x20a5fe.limit) || 20));
  const _0x4f5b8e = (_0x4753c8 - 1) * _0x185e4b;
  const _0x158870 = String(_0x20a5fe.keyword || _0x20a5fe.search || "").trim();
  const _0x1a4062 = getDb();
  if (_0x1a4062) {
    const _0x17759d = processedVideosStore.queryHistoryPage(_0x1a4062, {
      offset: _0x4f5b8e,
      limit: _0x185e4b,
      keyword: _0x158870
    });
    return {
      ..._0x17759d,
      page: _0x4753c8,
      pageSize: _0x185e4b
    };
  }
  let _0x548660 = collectLegacyProcessedVideos(_0xdd6a7e).filter(_0x1f0d68 => _0x1f0d68?.recordType !== "collected_link");
  if (_0x158870) {
    const _0x26b0d2 = _0x158870.toLowerCase();
    _0x548660 = _0x548660.filter(_0x499eef => [_0x499eef.title, _0x499eef.author, _0x499eef.authorNickname, _0x499eef.url, _0x499eef.video_id, _0x499eef.videoId].some(_0x475ddb => String(_0x475ddb || "").toLowerCase().includes(_0x26b0d2)));
  }
  _0x548660.sort((_0x51e583, _0x46c047) => (Number(_0x46c047.timestamp) || 0) - (Number(_0x51e583.timestamp) || 0));
  const _0x4f43cf = _0x548660.length;
  return {
    items: _0x548660.slice(_0x4f5b8e, _0x4f5b8e + _0x185e4b),
    total: _0x4f43cf,
    page: _0x4753c8,
    pageSize: _0x185e4b
  };
}
function upsert(_0x9b1b7a, _0xb817d3) {
  const _0x1dc154 = getDb();
  if (_0x1dc154) {
    return processedVideosStore.upsertOne(_0x1dc154, _0xb817d3);
  }
  if (!_0x9b1b7a) {
    return false;
  }
  const _0x4769bd = _0x9b1b7a.get(STORE_KEY, []) || [];
  const {
    processedVideoKeysMatch: _0x20ea82
  } = require("../shared/processedVideoKey");
  const _0x26f209 = _0xb817d3?.url || "";
  const _0x204c83 = _0x4769bd.findIndex(_0x426cc1 => _0x20ea82(_0x426cc1.url, _0x26f209));
  if (_0x204c83 >= 0) {
    _0x4769bd[_0x204c83] = {
      ..._0x4769bd[_0x204c83],
      ..._0xb817d3
    };
  } else {
    _0x4769bd.unshift(_0xb817d3);
  }
  _0x9b1b7a.set(STORE_KEY, _0x4769bd.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK));
  return true;
}
function upsertMany(_0x352bea, _0x2ab323) {
  const _0x24cb4d = getDb();
  if (_0x24cb4d) {
    return processedVideosStore.upsertMany(_0x24cb4d, _0x2ab323);
  }
  if (!_0x352bea || !Array.isArray(_0x2ab323)) {
    return 0;
  }
  let _0x57de86 = _0x352bea.get(STORE_KEY, []) || [];
  const {
    processedVideoKeysMatch: _0x1c3c69
  } = require("../shared/processedVideoKey");
  for (const _0x179adc of _0x2ab323) {
    const _0x2ab546 = _0x57de86.findIndex(_0x3db597 => _0x1c3c69(_0x3db597.url, _0x179adc?.url));
    if (_0x2ab546 >= 0) {
      _0x57de86[_0x2ab546] = {
        ..._0x57de86[_0x2ab546],
        ..._0x179adc
      };
    } else {
      _0x57de86.unshift(_0x179adc);
    }
  }
  _0x57de86 = _0x57de86.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK);
  _0x352bea.set(STORE_KEY, _0x57de86);
  return _0x2ab323.length;
}
function replaceAll(_0x11fec8, _0x87866a) {
  const _0x1fe196 = getDb();
  if (_0x1fe196) {
    return processedVideosStore.replaceAll(_0x1fe196, _0x87866a);
  }
  if (!_0x11fec8) {
    return false;
  }
  _0x11fec8.set(STORE_KEY, Array.isArray(_0x87866a) ? _0x87866a.slice(0, processedVideosStore.MAX_PROCESSED_VIDEOS_STORE_FALLBACK) : []);
  return true;
}
function removeByUrls(_0x39bd9a, _0x2116c0) {
  const _0x21eb6c = getDb();
  if (_0x21eb6c) {
    return processedVideosStore.deleteByUrls(_0x21eb6c, _0x2116c0);
  }
  if (!_0x39bd9a) {
    return 0;
  }
  const {
    processedVideoKeysMatch: _0x35ad35
  } = require("../shared/processedVideoKey");
  const _0x4c026c = Array.isArray(_0x2116c0) ? _0x2116c0 : [_0x2116c0];
  const _0x35b176 = (_0x39bd9a.get(STORE_KEY, []) || []).length;
  const _0x2ac439 = (_0x39bd9a.get(STORE_KEY, []) || []).filter(_0x501cba => !_0x4c026c.some(_0xa9ea85 => _0x35ad35(_0x501cba.url, _0xa9ea85)));
  _0x39bd9a.set(STORE_KEY, _0x2ac439);
  return _0x35b176 - _0x2ac439.length;
}
function clearAuthorUrls(_0x13b95f, _0x385afa) {
  const _0x113376 = getDb();
  if (_0x113376) {
    return processedVideosStore.clearAuthorUrlByVideoUrls(_0x113376, _0x385afa);
  }
  if (!_0x13b95f) {
    return 0;
  }
  const {
    processedVideoKeysMatch: _0x3b605f
  } = require("../shared/processedVideoKey");
  const _0x5364bb = _0x13b95f.get(STORE_KEY, []) || [];
  let _0x14a3a2 = 0;
  const _0x5ed8d7 = _0x5364bb.map(_0x46ad2c => {
    if (!_0x385afa.some(_0xa22110 => _0x3b605f(_0x46ad2c.url, _0xa22110))) {
      return _0x46ad2c;
    }
    if (!_0x46ad2c?.authorUrl) {
      return _0x46ad2c;
    }
    _0x14a3a2 += 1;
    return {
      ..._0x46ad2c,
      authorUrl: ""
    };
  });
  if (_0x14a3a2) {
    _0x13b95f.set(STORE_KEY, _0x5ed8d7);
  }
  return _0x14a3a2;
}
function clearAll(_0x546c0e) {
  const _0x1e5d22 = getDb();
  if (_0x1e5d22) {
    return processedVideosStore.clearAll(_0x1e5d22);
  }
  if (!_0x546c0e) {
    return 0;
  }
  const _0x3abc71 = collectLegacyProcessedVideos(_0x546c0e).length;
  clearLegacyStoreKeys(_0x546c0e);
  return _0x3abc71;
}
function findByUrl(_0x1b5a7d, _0x30cd2d) {
  const _0x50e992 = getDb();
  if (_0x50e992) {
    return processedVideosStore.findByUrl(_0x50e992, _0x30cd2d);
  }
  const {
    processedVideoKeysMatch: _0x1cce2a
  } = require("../shared/processedVideoKey");
  return collectLegacyProcessedVideos(_0x1b5a7d).find(_0x2f476f => _0x1cce2a(_0x2f476f.url, _0x30cd2d)) || null;
}
function isProcessed(_0x29f893, _0x2d4e07) {
  return !!findByUrl(_0x29f893, _0x2d4e07);
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
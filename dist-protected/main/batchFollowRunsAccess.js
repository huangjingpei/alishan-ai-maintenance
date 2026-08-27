'use strict';

const {
  getDb,
  getUserDataPath,
  isMigrationDone,
  markMigrationDone,
  writeJsonBackup
} = require("./schemaMigrationUtils");
const STORE_KEY = "batch_follow_runs";
const MIGRATION_ID = "batch_follow_runs_sqlite_v1";
const RUN_LIMIT = 30;
const LOG_LIMIT = 120;
const RESULT_LIMIT = 80;
function ensureTables(_0x51bdf7) {
  if (!_0x51bdf7) {
    return;
  }
  _0x51bdf7.exec("\n    CREATE TABLE IF NOT EXISTS batch_follow_runs (\n      id TEXT PRIMARY KEY,\n      run_id TEXT DEFAULT '',\n      started_at INTEGER DEFAULT 0,\n      ended_at INTEGER,\n      status TEXT DEFAULT '',\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_batch_follow_runs_started ON batch_follow_runs(started_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_batch_follow_runs_run_id ON batch_follow_runs(run_id);\n  ");
}
function capRuns(_0x4398b4) {
  if (!Array.isArray(_0x4398b4)) {
    return [];
  }
  return _0x4398b4.slice(0, RUN_LIMIT).map(_0x207adc => {
    if (!_0x207adc || typeof _0x207adc !== "object") {
      return _0x207adc;
    }
    const _0x43f1a1 = {
      ..._0x207adc
    };
    if (Array.isArray(_0x43f1a1.logs) && _0x43f1a1.logs.length > LOG_LIMIT) {
      _0x43f1a1.logs = _0x43f1a1.logs.slice(-LOG_LIMIT);
    }
    if (Array.isArray(_0x43f1a1.results) && _0x43f1a1.results.length > RESULT_LIMIT) {
      _0x43f1a1.results = _0x43f1a1.results.slice(0, RESULT_LIMIT);
    }
    return _0x43f1a1;
  });
}
function collectLegacy(_0x323deb) {
  if (!_0x323deb || typeof _0x323deb.get !== "function") {
    return [];
  }
  const _0x29fc29 = _0x323deb.get(STORE_KEY, []);
  if (Array.isArray(_0x29fc29)) {
    return _0x29fc29.filter(_0xf6dd0 => _0xf6dd0 && typeof _0xf6dd0 === "object" && (_0xf6dd0.id || _0xf6dd0.runId));
  } else {
    return [];
  }
}
function parseRow(_0x422e51) {
  if (!_0x422e51) {
    return null;
  }
  try {
    return JSON.parse(_0x422e51.raw_data || "{}");
  } catch (_0x57c6c6) {
    return null;
  }
}
function toSummary(_0x100781) {
  if (!_0x100781 || typeof _0x100781 !== "object") {
    return null;
  }
  const _0xa79483 = Array.isArray(_0x100781.results) ? _0x100781.results : [];
  const _0x42626e = Array.isArray(_0x100781.logs) ? _0x100781.logs : [];
  const _0x530295 = {
    ..._0x100781
  };
  delete _0x530295.results;
  delete _0x530295.logs;
  return {
    ..._0x530295,
    resultCount: _0xa79483.length,
    logCount: _0x42626e.length
  };
}
function parseJsonArray(_0x4abddd) {
  if (Array.isArray(_0x4abddd)) {
    return _0x4abddd;
  }
  if (_0x4abddd == null || _0x4abddd === "") {
    return [];
  }
  if (typeof _0x4abddd !== "string") {
    return [];
  }
  try {
    const _0x195805 = JSON.parse(_0x4abddd);
    if (Array.isArray(_0x195805)) {
      return _0x195805;
    } else {
      return [];
    }
  } catch (_0x201935) {
    return [];
  }
}
function listAllFromDb(_0x4b3428) {
  ensureTables(_0x4b3428);
  const _0xf4977b = _0x4b3428.prepare("\n    SELECT id, run_id, started_at, ended_at, status, raw_data\n    FROM batch_follow_runs\n    ORDER BY started_at DESC, updated_at DESC\n  ").all();
  return _0xf4977b.map(parseRow).filter(Boolean);
}
function countDb(_0x6927c6) {
  ensureTables(_0x6927c6);
  return Number(_0x6927c6.prepare("SELECT COUNT(*) AS c FROM batch_follow_runs").get()?.c) || 0;
}
function upsertOneDb(_0x4dcf39, _0x214b13) {
  ensureTables(_0x4dcf39);
  if (!_0x214b13 || typeof _0x214b13 !== "object") {
    return null;
  }
  const _0x50f3ac = String(_0x214b13.id || _0x214b13.runId || "").trim();
  if (!_0x50f3ac) {
    return null;
  }
  const _0x3684c1 = {
    ..._0x214b13,
    id: _0x50f3ac
  };
  if (!_0x3684c1.runId) {
    _0x3684c1.runId = String(_0x214b13.runId || _0x50f3ac);
  }
  const _0xc39a25 = Number(_0x3684c1.startedAt) || 0;
  const _0x658250 = _0x3684c1.endedAt == null ? null : Number(_0x3684c1.endedAt) || null;
  _0x4dcf39.prepare("\n    INSERT INTO batch_follow_runs (id, run_id, started_at, ended_at, status, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      run_id = excluded.run_id,\n      started_at = excluded.started_at,\n      ended_at = excluded.ended_at,\n      status = excluded.status,\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ").run(_0x50f3ac, String(_0x3684c1.runId || ""), _0xc39a25, _0x658250, String(_0x3684c1.status || ""), Date.now(), JSON.stringify(_0x3684c1));
  return _0x3684c1;
}
function getByIdFromDb(_0x4c0f17, _0x567cc1) {
  ensureTables(_0x4c0f17);
  const _0x1a5673 = String(_0x567cc1 || "").trim();
  if (!_0x1a5673) {
    return null;
  }
  const _0x4ebb55 = _0x4c0f17.prepare("SELECT raw_data FROM batch_follow_runs WHERE id = ?").get(_0x1a5673);
  if (_0x4ebb55) {
    return parseRow(_0x4ebb55);
  }
  const _0x5a1ba8 = _0x4c0f17.prepare("\n    SELECT raw_data FROM batch_follow_runs\n    WHERE run_id = ?\n    ORDER BY started_at DESC, updated_at DESC\n    LIMIT 1\n  ").get(_0x1a5673);
  return parseRow(_0x5a1ba8);
}
function deleteByIdsFromDb(_0x438b80, _0x118a9e = []) {
  ensureTables(_0x438b80);
  const _0x21c76d = [...new Set((Array.isArray(_0x118a9e) ? _0x118a9e : [_0x118a9e]).map(_0x12e5ec => String(_0x12e5ec || "").trim()).filter(Boolean))];
  if (!_0x21c76d.length) {
    return 0;
  }
  const _0x3d962f = _0x438b80.prepare("DELETE FROM batch_follow_runs WHERE id = ? OR run_id = ?");
  let _0x22c2c1 = 0;
  const _0x1eedb8 = _0x438b80.transaction(_0x1bae04 => {
    for (const _0x2a0a71 of _0x1bae04) {
      _0x22c2c1 += Number(_0x3d962f.run(_0x2a0a71, _0x2a0a71)?.changes) || 0;
    }
  });
  _0x1eedb8(_0x21c76d);
  return _0x22c2c1;
}
function listSummariesPageFromDb(_0x30a911, _0x50e936 = {}) {
  ensureTables(_0x30a911);
  const _0x331245 = Math.max(0, Number(_0x50e936.offset) || 0);
  const _0x1b7bba = Math.max(1, Math.min(200, Number(_0x50e936.limit) || 10));
  const _0x5aba71 = countDb(_0x30a911);
  let _0x2b5e3b = [];
  try {
    _0x2b5e3b = _0x30a911.prepare("\n      SELECT\n        id,\n        run_id,\n        started_at,\n        ended_at,\n        status,\n        json_extract(raw_data, '$.type') AS type,\n        json_extract(raw_data, '$.total') AS total,\n        json_extract(raw_data, '$.current') AS current,\n        json_extract(raw_data, '$.success') AS success,\n        json_extract(raw_data, '$.failed') AS failed,\n        json_extract(raw_data, '$.skipped') AS skipped,\n        json_extract(raw_data, '$.genderFilter') AS gender_filter,\n        json_extract(raw_data, '$.accountIds') AS account_ids_json,\n        json_extract(raw_data, '$.accountNames') AS account_names_json,\n        json_array_length(raw_data, '$.results') AS result_count,\n        json_array_length(raw_data, '$.logs') AS log_count\n      FROM batch_follow_runs\n      ORDER BY started_at DESC, updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(_0x1b7bba, _0x331245);
    return {
      items: _0x2b5e3b.map(_0x1729c6 => ({
        id: _0x1729c6.id,
        runId: _0x1729c6.run_id,
        startedAt: Number(_0x1729c6.started_at) || 0,
        endedAt: _0x1729c6.ended_at,
        status: _0x1729c6.status || "",
        type: _0x1729c6.type || "",
        total: Number(_0x1729c6.total) || 0,
        current: Number(_0x1729c6.current) || 0,
        success: Number(_0x1729c6.success) || 0,
        failed: Number(_0x1729c6.failed) || 0,
        skipped: Number(_0x1729c6.skipped) || 0,
        genderFilter: _0x1729c6.gender_filter || "all",
        accountIds: parseJsonArray(_0x1729c6.account_ids_json),
        accountNames: parseJsonArray(_0x1729c6.account_names_json),
        resultCount: Number(_0x1729c6.result_count) || 0,
        logCount: Number(_0x1729c6.log_count) || 0
      })),
      total: _0x5aba71
    };
  } catch (_0x595665) {
    console.warn("[DB] batch_follow_runs 摘要 JSON 查询失败，回退解析 raw_data:", _0x595665?.message || _0x595665);
    const _0x53c5d8 = _0x30a911.prepare("\n      SELECT raw_data FROM batch_follow_runs\n      ORDER BY started_at DESC, updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(_0x1b7bba, _0x331245);
    return {
      items: _0x53c5d8.map(parseRow).map(toSummary).filter(Boolean),
      total: _0x5aba71
    };
  }
}
function replaceAllDb(_0x502276, _0x3be121) {
  ensureTables(_0x502276);
  const _0x1066b6 = Array.isArray(_0x3be121) ? _0x3be121 : [];
  const _0x49171f = _0x502276.prepare("DELETE FROM batch_follow_runs");
  const _0x3bead9 = _0x502276.prepare("\n    INSERT INTO batch_follow_runs (id, run_id, started_at, ended_at, status, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n  ");
  const _0x155bb3 = _0x502276.transaction(_0x45e234 => {
    _0x49171f.run();
    const _0x2b1bb7 = Date.now();
    for (const _0x127527 of _0x45e234) {
      if (!_0x127527) {
        continue;
      }
      const _0x5e573a = String(_0x127527.id || _0x127527.runId || "").trim();
      if (!_0x5e573a) {
        continue;
      }
      const _0x17f0e5 = Number(_0x127527.startedAt) || 0;
      const _0x906809 = _0x127527.endedAt == null ? null : Number(_0x127527.endedAt) || null;
      _0x3bead9.run(_0x5e573a, String(_0x127527.runId || ""), _0x17f0e5, _0x906809, String(_0x127527.status || ""), _0x2b1bb7, JSON.stringify(_0x127527));
    }
  });
  _0x155bb3(_0x1066b6);
  return _0x1066b6;
}
function clearLegacyStore(_0x3218fa) {
  if (!_0x3218fa) {
    return;
  }
  try {
    _0x3218fa.set(STORE_KEY, []);
    _0x3218fa.set(STORE_KEY + "_migrated_at", Date.now());
  } catch (_0x380e83) {}
}
function runBatchFollowRunsSqliteMigrationIfNeeded(_0x17b981) {
  const _0x2dd676 = getDb();
  if (!_0x2dd676) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(_0x2dd676);
  const _0x2195ad = collectLegacy(_0x17b981);
  const _0xea6c56 = isMigrationDone(_0x2dd676, MIGRATION_ID);
  if (_0xea6c56 && _0x2195ad.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (_0xea6c56 && _0x2195ad.length > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + _0x2195ad.length + " 条残留，补导入");
  }
  if (!_0x2195ad.length) {
    markMigrationDone(_0x2dd676, MIGRATION_ID, {
      stats: {
        imported: 0,
        storeCount: 0,
        empty: true
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + ": store 无数据，已标记 done");
    return {
      skipped: false,
      empty: true,
      done: true
    };
  }
  let _0x3f3b27 = {
    backupPath: "",
    checksum: ""
  };
  try {
    _0x3f3b27 = writeJsonBackup(getUserDataPath(), "batch_follow_runs", MIGRATION_ID, {
      count: _0x2195ad.length,
      items: _0x2195ad
    });
    const _0x4817ba = JSON.parse(require("fs").readFileSync(_0x3f3b27.backupPath, "utf8")).items?.length;
    if (_0x4817ba !== _0x2195ad.length) {
      throw new Error("批量跟进备份读回条数不一致");
    }
    console.log("[Migrate] 已备份 " + _0x2195ad.length + " 条 batch_follow_runs → " + _0x3f3b27.backupPath);
  } catch (_0x49ab2f) {
    console.error("[Migrate] batch_follow_runs 备份失败，中止迁移（保留 store）:", _0x49ab2f);
    return {
      success: false,
      error: _0x49ab2f.message || String(_0x49ab2f),
      stage: "backup"
    };
  }
  const _0xefa84 = countDb(_0x2dd676);
  try {
    let _0x1e5ae5 = _0x2195ad;
    if (_0xea6c56 && _0xefa84 > 0) {
      const _0x173d16 = listAllFromDb(_0x2dd676);
      const _0x466f81 = new Map();
      for (const _0x2b2b9d of _0x173d16) {
        const _0x4dc2fb = String(_0x2b2b9d?.id || _0x2b2b9d?.runId || "");
        if (_0x4dc2fb) {
          _0x466f81.set(_0x4dc2fb, _0x2b2b9d);
        }
      }
      for (const _0x4416ee of _0x2195ad) {
        const _0x168bc4 = String(_0x4416ee?.id || _0x4416ee?.runId || "");
        if (!_0x168bc4) {
          continue;
        }
        const _0x2ead4d = _0x466f81.get(_0x168bc4);
        if (!_0x2ead4d || (Number(_0x4416ee.startedAt) || 0) >= (Number(_0x2ead4d.startedAt) || 0)) {
          _0x466f81.set(_0x168bc4, _0x4416ee);
        }
      }
      _0x1e5ae5 = [..._0x466f81.values()].sort((_0x808bdc, _0x49c0cc) => (Number(_0x49c0cc.startedAt) || 0) - (Number(_0x808bdc.startedAt) || 0));
    }
    const _0x34192c = replaceAllDb(_0x2dd676, _0x1e5ae5);
    const _0x3572c3 = countDb(_0x2dd676);
    if (_0x34192c.length > 0 && _0x3572c3 === 0) {
      throw new Error("校验失败：写入后表为空");
    }
    markMigrationDone(_0x2dd676, MIGRATION_ID, {
      backupPath: _0x3f3b27.backupPath,
      stats: {
        imported: _0x34192c.length,
        storeCount: _0x2195ad.length,
        sqliteCountBefore: _0xefa84,
        sqliteCountAfter: _0x3572c3,
        checksum: _0x3f3b27.checksum,
        residualReimport: _0xea6c56
      }
    });
    clearLegacyStore(_0x17b981);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: store=" + _0x2195ad.length + " imported=" + _0x34192c.length + " sqlite=" + _0x3572c3);
    return {
      skipped: false,
      imported: _0x34192c.length,
      done: true,
      backupPath: _0x3f3b27.backupPath,
      sqliteCount: _0x3572c3
    };
  } catch (_0x7b84e4) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", _0x7b84e4);
    return {
      skipped: false,
      error: _0x7b84e4.message || String(_0x7b84e4),
      stage: "migrate",
      backupPath: _0x3f3b27.backupPath
    };
  }
}
function listAll(_0x1ab122) {
  const _0x3ede9a = getDb();
  if (_0x3ede9a) {
    ensureTables(_0x3ede9a);
    return listAllFromDb(_0x3ede9a);
  }
  return capRuns(collectLegacy(_0x1ab122));
}
function listSummariesPage(_0x47016b, _0x3bf6d6 = {}) {
  const _0x4a7857 = Math.max(1, Number(_0x3bf6d6.page) || Number(_0x3bf6d6.current) || 1);
  const _0x16c881 = Math.max(1, Math.min(200, Number(_0x3bf6d6.pageSize) || Number(_0x3bf6d6.limit) || 10));
  const _0x4761f3 = (_0x4a7857 - 1) * _0x16c881;
  const _0x14c6d8 = getDb();
  if (_0x14c6d8) {
    const _0x2f5368 = listSummariesPageFromDb(_0x14c6d8, {
      offset: _0x4761f3,
      limit: _0x16c881
    });
    return {
      ..._0x2f5368,
      page: _0x4a7857,
      pageSize: _0x16c881
    };
  }
  const _0x3e275a = capRuns(collectLegacy(_0x47016b)).map(toSummary).filter(Boolean);
  return {
    items: _0x3e275a.slice(_0x4761f3, _0x4761f3 + _0x16c881),
    total: _0x3e275a.length,
    page: _0x4a7857,
    pageSize: _0x16c881
  };
}
function getById(_0x409a77, _0x4c5a4a) {
  const _0x3c1e4f = getDb();
  if (_0x3c1e4f) {
    return getByIdFromDb(_0x3c1e4f, _0x4c5a4a);
  }
  const _0xc1a76f = String(_0x4c5a4a || "").trim();
  const _0x27f01b = collectLegacy(_0x409a77);
  return _0x27f01b.find(_0x28053a => String(_0x28053a?.id || "") === _0xc1a76f) || _0x27f01b.find(_0x13e516 => String(_0x13e516?.runId || "") === _0xc1a76f) || null;
}
function upsert(_0x111f2d, _0x39c883) {
  const _0x20cf7b = getDb();
  if (_0x20cf7b) {
    return upsertOneDb(_0x20cf7b, _0x39c883);
  }
  if (!_0x111f2d || !_0x39c883) {
    return null;
  }
  const _0x45460e = String(_0x39c883.id || _0x39c883.runId || "").trim();
  if (!_0x45460e) {
    return null;
  }
  const _0x12ac0c = collectLegacy(_0x111f2d);
  const _0x576280 = _0x12ac0c.findIndex(_0x216c0d => String(_0x216c0d?.id || "") === _0x45460e || String(_0x216c0d?.runId || "") === _0x45460e);
  if (_0x576280 >= 0) {
    _0x12ac0c[_0x576280] = {
      ..._0x12ac0c[_0x576280],
      ..._0x39c883,
      id: _0x45460e
    };
  } else {
    _0x12ac0c.unshift({
      ..._0x39c883,
      id: _0x45460e
    });
  }
  _0x111f2d.set(STORE_KEY, capRuns(_0x12ac0c));
  return _0x12ac0c[_0x576280 >= 0 ? _0x576280 : 0];
}
function replaceAll(_0x3231ab, _0x368511) {
  const _0x2a8f44 = getDb();
  if (_0x2a8f44) {
    ensureTables(_0x2a8f44);
    return replaceAllDb(_0x2a8f44, _0x368511);
  }
  const _0x1a7ac1 = capRuns(_0x368511);
  if (_0x3231ab) {
    _0x3231ab.set(STORE_KEY, _0x1a7ac1);
  }
  return _0x1a7ac1;
}
function deleteByIds(_0x120f8e, _0x12fb73 = []) {
  const _0x4f8b8c = getDb();
  if (_0x4f8b8c) {
    return deleteByIdsFromDb(_0x4f8b8c, _0x12fb73);
  }
  if (!_0x120f8e) {
    return 0;
  }
  const _0x546fec = new Set((Array.isArray(_0x12fb73) ? _0x12fb73 : [_0x12fb73]).map(_0x3b4381 => String(_0x3b4381 || "")));
  const _0xee3712 = collectLegacy(_0x120f8e);
  const _0x36a89a = _0xee3712.filter(_0x560fe5 => !_0x546fec.has(String(_0x560fe5?.id || "")) && !_0x546fec.has(String(_0x560fe5?.runId || "")));
  _0x120f8e.set(STORE_KEY, capRuns(_0x36a89a));
  return _0xee3712.length - _0x36a89a.length;
}
function clearAll(_0x45fa07) {
  const _0x39bc02 = getDb();
  if (_0x39bc02) {
    ensureTables(_0x39bc02);
    _0x39bc02.prepare("DELETE FROM batch_follow_runs").run();
    return true;
  }
  clearLegacyStore(_0x45fa07);
  return true;
}
module.exports = {
  STORE_KEY: STORE_KEY,
  MIGRATION_ID: MIGRATION_ID,
  RUN_LIMIT: RUN_LIMIT,
  LOG_LIMIT: LOG_LIMIT,
  RESULT_LIMIT: RESULT_LIMIT,
  ensureTables: ensureTables,
  capRuns: capRuns,
  toSummary: toSummary,
  collectLegacy: collectLegacy,
  runBatchFollowRunsSqliteMigrationIfNeeded: runBatchFollowRunsSqliteMigrationIfNeeded,
  listAll: listAll,
  listSummariesPage: listSummariesPage,
  getById: getById,
  upsert: upsert,
  replaceAll: replaceAll,
  deleteByIds: deleteByIds,
  clearAll: clearAll
};
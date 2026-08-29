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
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS batch_follow_runs (\n      id TEXT PRIMARY KEY,\n      run_id TEXT DEFAULT '',\n      started_at INTEGER DEFAULT 0,\n      ended_at INTEGER,\n      status TEXT DEFAULT '',\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_batch_follow_runs_started ON batch_follow_runs(started_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_batch_follow_runs_run_id ON batch_follow_runs(run_id);\n  ");
}
function capRuns(arg1) {
  if (!Array.isArray(arg1)) {
    return [];
  }
  return arg1.slice(0, RUN_LIMIT).map(arg1 => {
    if (!arg1 || typeof arg1 !== "object") {
      return arg1;
    }
    const obj = {
      ...arg1
    };
    if (Array.isArray(obj.logs) && obj.logs.length > LOG_LIMIT) {
      obj.logs = obj.logs.slice(-LOG_LIMIT);
    }
    if (Array.isArray(obj.results) && obj.results.length > RESULT_LIMIT) {
      obj.results = obj.results.slice(0, RESULT_LIMIT);
    }
    return obj;
  });
}
function collectLegacy(arg1) {
  if (!arg1 || typeof arg1.get !== "function") {
    return [];
  }
  const result = arg1.get(STORE_KEY, []);
  if (Array.isArray(result)) {
    return result.filter(arg1 => arg1 && typeof arg1 === "object" && (arg1.id || arg1.runId));
  } else {
    return [];
  }
}
function parseRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    return JSON.parse(arg1.raw_data || "{}");
  } catch (error) {
    return null;
  }
}
function toSummary(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  const value = Array.isArray(arg1.results) ? arg1.results : [];
  const value2 = Array.isArray(arg1.logs) ? arg1.logs : [];
  const obj = {
    ...arg1
  };
  delete obj.results;
  delete obj.logs;
  return {
    ...obj,
    resultCount: value.length,
    logCount: value2.length
  };
}
function parseJsonArray(arg1) {
  if (Array.isArray(arg1)) {
    return arg1;
  }
  if (arg1 == null || arg1 === "") {
    return [];
  }
  if (typeof arg1 !== "string") {
    return [];
  }
  try {
    const result = JSON.parse(arg1);
    if (Array.isArray(result)) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
function listAllFromDb(arg1) {
  ensureTables(arg1);
  const result = arg1.prepare("\n    SELECT id, run_id, started_at, ended_at, status, raw_data\n    FROM batch_follow_runs\n    ORDER BY started_at DESC, updated_at DESC\n  ").all();
  return result.map(parseRow).filter(Boolean);
}
function countDb(arg1) {
  ensureTables(arg1);
  return Number(arg1.prepare("SELECT COUNT(*) AS c FROM batch_follow_runs").get()?.c) || 0;
}
function upsertOneDb(arg1, arg2) {
  ensureTables(arg1);
  if (!arg2 || typeof arg2 !== "object") {
    return null;
  }
  const result = String(arg2.id || arg2.runId || "").trim();
  if (!result) {
    return null;
  }
  const obj = {
    ...arg2,
    id: result
  };
  if (!obj.runId) {
    obj.runId = String(arg2.runId || result);
  }
  const local = Number(obj.startedAt) || 0;
  const value = obj.endedAt == null ? null : Number(obj.endedAt) || null;
  arg1.prepare("\n    INSERT INTO batch_follow_runs (id, run_id, started_at, ended_at, status, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      run_id = excluded.run_id,\n      started_at = excluded.started_at,\n      ended_at = excluded.ended_at,\n      status = excluded.status,\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ").run(result, String(obj.runId || ""), local, value, String(obj.status || ""), Date.now(), JSON.stringify(obj));
  return obj;
}
function getByIdFromDb(arg1, arg2) {
  ensureTables(arg1);
  const result = String(arg2 || "").trim();
  if (!result) {
    return null;
  }
  const result2 = arg1.prepare("SELECT raw_data FROM batch_follow_runs WHERE id = ?").get(result);
  if (result2) {
    return parseRow(result2);
  }
  const result3 = arg1.prepare("\n    SELECT raw_data FROM batch_follow_runs\n    WHERE run_id = ?\n    ORDER BY started_at DESC, updated_at DESC\n    LIMIT 1\n  ").get(result);
  return parseRow(result3);
}
function deleteByIdsFromDb(arg1, list = []) {
  ensureTables(arg1);
  const list2 = [...new Set((Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "").trim()).filter(Boolean))];
  if (!list2.length) {
    return 0;
  }
  const result = arg1.prepare("DELETE FROM batch_follow_runs WHERE id = ? OR run_id = ?");
  let num = 0;
  const result2 = arg1.transaction(arg1 => {
    for (const item of arg1) {
      num += Number(result.run(item, item)?.changes) || 0;
    }
  });
  result2(list2);
  return num;
}
function listSummariesPageFromDb(arg1, options = {}) {
  ensureTables(arg1);
  const result = Math.max(0, Number(options.offset) || 0);
  const result2 = Math.max(1, Math.min(200, Number(options.limit) || 10));
  const result3 = countDb(arg1);
  let list = [];
  try {
    list = arg1.prepare("\n      SELECT\n        id,\n        run_id,\n        started_at,\n        ended_at,\n        status,\n        json_extract(raw_data, '$.type') AS type,\n        json_extract(raw_data, '$.total') AS total,\n        json_extract(raw_data, '$.current') AS current,\n        json_extract(raw_data, '$.success') AS success,\n        json_extract(raw_data, '$.failed') AS failed,\n        json_extract(raw_data, '$.skipped') AS skipped,\n        json_extract(raw_data, '$.genderFilter') AS gender_filter,\n        json_extract(raw_data, '$.accountIds') AS account_ids_json,\n        json_extract(raw_data, '$.accountNames') AS account_names_json,\n        json_array_length(raw_data, '$.results') AS result_count,\n        json_array_length(raw_data, '$.logs') AS log_count\n      FROM batch_follow_runs\n      ORDER BY started_at DESC, updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(result2, result);
    return {
      items: list.map(arg1 => ({
        id: arg1.id,
        runId: arg1.run_id,
        startedAt: Number(arg1.started_at) || 0,
        endedAt: arg1.ended_at,
        status: arg1.status || "",
        type: arg1.type || "",
        total: Number(arg1.total) || 0,
        current: Number(arg1.current) || 0,
        success: Number(arg1.success) || 0,
        failed: Number(arg1.failed) || 0,
        skipped: Number(arg1.skipped) || 0,
        genderFilter: arg1.gender_filter || "all",
        accountIds: parseJsonArray(arg1.account_ids_json),
        accountNames: parseJsonArray(arg1.account_names_json),
        resultCount: Number(arg1.result_count) || 0,
        logCount: Number(arg1.log_count) || 0
      })),
      total: result3
    };
  } catch (error) {
    console.warn("[DB] batch_follow_runs 摘要 JSON 查询失败，回退解析 raw_data:", error?.message || error);
    const result4 = arg1.prepare("\n      SELECT raw_data FROM batch_follow_runs\n      ORDER BY started_at DESC, updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(result2, result);
    return {
      items: result4.map(parseRow).map(toSummary).filter(Boolean),
      total: result3
    };
  }
}
function replaceAllDb(arg1, arg2) {
  ensureTables(arg1);
  const value = Array.isArray(arg2) ? arg2 : [];
  const result = arg1.prepare("DELETE FROM batch_follow_runs");
  const result2 = arg1.prepare("\n    INSERT INTO batch_follow_runs (id, run_id, started_at, ended_at, status, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n  ");
  const result3 = arg1.transaction(arg1 => {
    result.run();
    const result3 = Date.now();
    for (const item of arg1) {
      if (!item) {
        continue;
      }
      const result = String(item.id || item.runId || "").trim();
      if (!result) {
        continue;
      }
      const local = Number(item.startedAt) || 0;
      const value = item.endedAt == null ? null : Number(item.endedAt) || null;
      result2.run(result, String(item.runId || ""), local, value, String(item.status || ""), result3, JSON.stringify(item));
    }
  });
  result3(value);
  return value;
}
function clearLegacyStore(arg1) {
  if (!arg1) {
    return;
  }
  try {
    arg1.set(STORE_KEY, []);
    arg1.set(STORE_KEY + "_migrated_at", Date.now());
  } catch (error) {}
}
function runBatchFollowRunsSqliteMigrationIfNeeded(arg1) {
  const result = getDb();
  if (!result) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(result);
  const result2 = collectLegacy(arg1);
  const flag = isMigrationDone(result, MIGRATION_ID);
  if (flag && result2.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (flag && result2.length > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + result2.length + " 条残留，补导入");
  }
  if (!result2.length) {
    markMigrationDone(result, MIGRATION_ID, {
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
  let obj = {
    backupPath: "",
    checksum: ""
  };
  try {
    obj = writeJsonBackup(getUserDataPath(), "batch_follow_runs", MIGRATION_ID, {
      count: result2.length,
      items: result2
    });
    const local = JSON.parse(require("fs").readFileSync(obj.backupPath, "utf8")).items?.length;
    if (local !== result2.length) {
      throw new Error("批量跟进备份读回条数不一致");
    }
    console.log("[Migrate] 已备份 " + result2.length + " 条 batch_follow_runs → " + obj.backupPath);
  } catch (error) {
    console.error("[Migrate] batch_follow_runs 备份失败，中止迁移（保留 store）:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "backup"
    };
  }
  const result3 = countDb(result);
  try {
    let local = result2;
    if (flag && result3 > 0) {
      const result3 = listAllFromDb(result);
      const map = new Map();
      for (const item of result3) {
        const result = String(item?.id || item?.runId || "");
        if (result) {
          map.set(result, item);
        }
      }
      for (const item of result2) {
        const result = String(item?.id || item?.runId || "");
        if (!result) {
          continue;
        }
        const result2 = map.get(result);
        if (!result2 || (Number(item.startedAt) || 0) >= (Number(result2.startedAt) || 0)) {
          map.set(result, item);
        }
      }
      local = [...map.values()].sort((arg1, arg2) => (Number(arg2.startedAt) || 0) - (Number(arg1.startedAt) || 0));
    }
    const result4 = replaceAllDb(result, local);
    const result5 = countDb(result);
    if (result4.length > 0 && result5 === 0) {
      throw new Error("校验失败：写入后表为空");
    }
    markMigrationDone(result, MIGRATION_ID, {
      backupPath: obj.backupPath,
      stats: {
        imported: result4.length,
        storeCount: result2.length,
        sqliteCountBefore: result3,
        sqliteCountAfter: result5,
        checksum: obj.checksum,
        residualReimport: flag
      }
    });
    clearLegacyStore(arg1);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: store=" + result2.length + " imported=" + result4.length + " sqlite=" + result5);
    return {
      skipped: false,
      imported: result4.length,
      done: true,
      backupPath: obj.backupPath,
      sqliteCount: result5
    };
  } catch (error) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", error);
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
    ensureTables(result);
    return listAllFromDb(result);
  }
  return capRuns(collectLegacy(arg1));
}
function listSummariesPage(arg1, options = {}) {
  const result = Math.max(1, Number(options.page) || Number(options.current) || 1);
  const result2 = Math.max(1, Math.min(200, Number(options.pageSize) || Number(options.limit) || 10));
  const value = (result - 1) * result2;
  const result3 = getDb();
  if (result3) {
    const result4 = listSummariesPageFromDb(result3, {
      offset: value,
      limit: result2
    });
    return {
      ...result4,
      page: result,
      pageSize: result2
    };
  }
  const result4 = capRuns(collectLegacy(arg1)).map(toSummary).filter(Boolean);
  return {
    items: result4.slice(value, value + result2),
    total: result4.length,
    page: result,
    pageSize: result2
  };
}
function getById(arg1, arg2) {
  const result = getDb();
  if (result) {
    return getByIdFromDb(result, arg2);
  }
  const result2 = String(arg2 || "").trim();
  const result3 = collectLegacy(arg1);
  return result3.find(arg1 => String(arg1?.id || "") === result2) || result3.find(arg1 => String(arg1?.runId || "") === result2) || null;
}
function upsert(arg1, arg2) {
  const result = getDb();
  if (result) {
    return upsertOneDb(result, arg2);
  }
  if (!arg1 || !arg2) {
    return null;
  }
  const result2 = String(arg2.id || arg2.runId || "").trim();
  if (!result2) {
    return null;
  }
  const result3 = collectLegacy(arg1);
  const result4 = result3.findIndex(arg1 => String(arg1?.id || "") === result2 || String(arg1?.runId || "") === result2);
  if (result4 >= 0) {
    result3[result4] = {
      ...result3[result4],
      ...arg2,
      id: result2
    };
  } else {
    result3.unshift({
      ...arg2,
      id: result2
    });
  }
  arg1.set(STORE_KEY, capRuns(result3));
  return result3[result4 >= 0 ? result4 : 0];
}
function replaceAll(arg1, arg2) {
  const result = getDb();
  if (result) {
    ensureTables(result);
    return replaceAllDb(result, arg2);
  }
  const result2 = capRuns(arg2);
  if (arg1) {
    arg1.set(STORE_KEY, result2);
  }
  return result2;
}
function deleteByIds(arg1, list = []) {
  const result = getDb();
  if (result) {
    return deleteByIdsFromDb(result, list);
  }
  if (!arg1) {
    return 0;
  }
  const set = new Set((Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "")));
  const result2 = collectLegacy(arg1);
  const result3 = result2.filter(arg1 => !set.has(String(arg1?.id || "")) && !set.has(String(arg1?.runId || "")));
  arg1.set(STORE_KEY, capRuns(result3));
  return result2.length - result3.length;
}
function clearAll(arg1) {
  const result = getDb();
  if (result) {
    ensureTables(result);
    result.prepare("DELETE FROM batch_follow_runs").run();
    return true;
  }
  clearLegacyStore(arg1);
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
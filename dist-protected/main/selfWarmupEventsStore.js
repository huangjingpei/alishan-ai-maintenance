'use strict';

const {
  getDb,
  getUserDataPath,
  isMigrationDone,
  markMigrationDone,
  writeJsonBackup
} = require("./schemaMigrationUtils");
const {
  buildSelfWarmupEventSeenKey
} = require("../shared/selfWarmupDedupe");
const MIGRATION_ID = "self_warmup_events_sqlite_v1";
const MAX_EVENT_RECORDS = 800;
function ensureTables(arg1 = getDb()) {
  if (!arg1) {
    return false;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS self_warmup_events (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      nickname TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      matched INTEGER NOT NULL DEFAULT 1,\n      seen_key TEXT DEFAULT '',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_ts\n      ON self_warmup_events(task_id, ts DESC);\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_seen\n      ON self_warmup_events(task_id, seen_key);\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_nick\n      ON self_warmup_events(task_id, nickname);\n  ");
  return true;
}
function isReady() {
  const result = getDb();
  if (!result) {
    return false;
  }
  try {
    ensureTables(result);
    return true;
  } catch (error) {
    return false;
  }
}
function isMigrationApplied() {
  const result = getDb();
  if (!result) {
    return false;
  }
  try {
    ensureTables(result);
    return isMigrationDone(result, MIGRATION_ID);
  } catch (error) {
    return false;
  }
}
function escapeLike(arg1) {
  return String(arg1 || "").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function parseEventRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result || typeof result !== "object") {
      return null;
    }
    if (!result.id && arg1.id) {
      result.id = arg1.id;
    }
    if (!result.ts && arg1.ts) {
      result.ts = arg1.ts;
    }
    if (result.matched === undefined) {
      result.matched = Number(arg1.matched) !== 0;
    }
    return result;
  } catch (error) {
    return null;
  }
}
function trimTaskEvents(arg1, arg2) {
  const result = String(arg2);
  const result2 = arg1.prepare("\n    SELECT id FROM self_warmup_events\n    WHERE task_id = ?\n    ORDER BY ts DESC, id DESC\n    LIMIT -1 OFFSET ?\n  ").all(result, MAX_EVENT_RECORDS);
  if (!result2.length) {
    return;
  }
  const result3 = arg1.prepare("DELETE FROM self_warmup_events WHERE id = ?");
  const result4 = arg1.transaction(arg1 => {
    for (const item of arg1) {
      result3.run(item.id);
    }
  });
  result4(result2);
}
function upsertEvents(arg1, list = [], {
  normalizeEvent: normalizeEvent
} = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  const result2 = (Array.isArray(list) ? list : [list]).filter(arg1 => arg1 && typeof arg1 === "object").map(arg1 => typeof normalizeEvent === "function" ? normalizeEvent(arg1) : arg1);
  if (!result2.length) {
    return 0;
  }
  const result3 = result.prepare("\n    INSERT INTO self_warmup_events (id, task_id, ts, nickname, account_id, matched, seen_key, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      nickname = excluded.nickname,\n      account_id = excluded.account_id,\n      matched = excluded.matched,\n      seen_key = excluded.seen_key,\n      raw_data = excluded.raw_data\n  ");
  const result4 = result.prepare("\n    SELECT id FROM self_warmup_events WHERE task_id = ? AND seen_key = ? LIMIT 1\n  ");
  const result5 = result.transaction(arg12 => {
    let num = 0;
    for (const item of arg12) {
      const result = buildSelfWarmupEventSeenKey(item);
      let result2 = String(item.id || "").trim();
      if (result) {
        const result3 = result4.get(String(arg1), result);
        if (result3?.id) {
          result2 = result3.id;
        }
      }
      if (!result2) {
        result2 = "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      }
      const obj = {
        ...item,
        id: result2
      };
      result3.run(result2, String(arg1), Number(obj.ts) || Date.now(), String(obj.nickname || ""), String(obj.accountId || ""), obj.matched === false ? 0 : 1, result || "", JSON.stringify(obj));
      num += 1;
    }
    return num;
  });
  const result6 = result5(result2);
  trimTaskEvents(result, arg1);
  return result6;
}
function deleteEvents(arg1, {
  eventIds = [],
  clearAll = false
} = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return {
      deleted: 0,
      rows: []
    };
  }
  ensureTables(result);
  const result2 = String(arg1);
  if (clearAll) {
    const result3 = result.prepare("SELECT raw_data FROM self_warmup_events WHERE task_id = ?").all(result2).map(parseEventRow).filter(Boolean);
    const local = result.prepare("DELETE FROM self_warmup_events WHERE task_id = ?").run(result2).changes || 0;
    return {
      deleted: local,
      rows: result3
    };
  }
  const result3 = (Array.isArray(eventIds) ? eventIds : [eventIds]).map(String).filter(Boolean);
  if (!result3.length) {
    return {
      deleted: 0,
      rows: []
    };
  }
  const result4 = result.prepare("SELECT raw_data FROM self_warmup_events WHERE task_id = ? AND id = ?");
  const result5 = result.prepare("DELETE FROM self_warmup_events WHERE task_id = ? AND id = ?");
  const list = [];
  const result6 = result.transaction(arg1 => {
    let num = 0;
    for (const item of arg1) {
      const result = parseEventRow(result4.get(result2, item));
      if (result) {
        list.push(result);
      }
      num += result5.run(result2, item).changes || 0;
    }
    return num;
  });
  return {
    deleted: result6(result3),
    rows: list
  };
}
function listEventsPage(arg1, options = {}) {
  const result = getDb();
  const obj = {
    items: [],
    total: 0,
    counts: {
      all: 0,
      hit: 0,
      miss: 0
    }
  };
  if (!result || !arg1) {
    return obj;
  }
  ensureTables(result);
  const result2 = String(arg1);
  const result3 = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result4 = Math.max(0, Number(options.offset) || 0);
  const list = ["task_id = ?"];
  const list2 = [result2];
  const result5 = String(options.result || "all");
  if (result5 === "hit") {
    list.push("matched != 0");
  }
  if (result5 === "miss") {
    list.push("matched = 0");
  }
  const result6 = String(options.keyword || "").trim();
  if (result6) {
    const value = "%" + escapeLike(result6) + "%";
    list.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    list2.push(value, value, value);
  }
  const result7 = list.join(" AND ");
  const local = Number(result.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE " + result7).get(...list2)?.c) || 0;
  const result8 = result.prepare("\n    SELECT id, task_id, ts, matched, raw_data\n    FROM self_warmup_events\n    WHERE " + result7 + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(...list2, result3, result4);
  const local2 = Number(result.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE task_id = ?").get(result2)?.c) || 0;
  const local3 = Number(result.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE task_id = ? AND matched != 0").get(result2)?.c) || 0;
  return {
    items: result8.map(parseEventRow).filter(Boolean),
    total: local,
    counts: {
      all: local2,
      hit: local3,
      miss: Math.max(0, local2 - local3)
    }
  };
}
function listEventsForUser(arg1, {
  nickname = "",
  userUrl = ""
} = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return [];
  }
  ensureTables(result);
  const result2 = String(arg1);
  const result3 = String(nickname || "").trim().toLowerCase();
  const result4 = String(userUrl || "").trim();
  if (!result3 && !result4) {
    return [];
  }
  const list = ["task_id = ?"];
  const list2 = [result2];
  const list3 = [];
  if (result3) {
    list3.push("LOWER(IFNULL(nickname, '')) = ?");
    list2.push(result3);
  }
  if (result4) {
    list3.push("IFNULL(json_extract(raw_data, '$.userUrl'), '') LIKE ? ESCAPE '\\'");
    list2.push("%" + escapeLike(result4.split("?")[0]) + "%");
  }
  list.push("(" + list3.join(" OR ") + ")");
  const result5 = result.prepare("\n    SELECT raw_data FROM self_warmup_events\n    WHERE " + list.join(" AND ") + "\n    ORDER BY ts DESC\n    LIMIT ?\n  ").all(...list2, MAX_EVENT_RECORDS);
  return result5.map(parseEventRow).filter(Boolean);
}
function countEventsByTask() {
  const result = getDb();
  const map = new Map();
  if (!result) {
    return map;
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT task_id AS taskId,\n      COUNT(*) AS allCount,\n      SUM(CASE WHEN matched != 0 THEN 1 ELSE 0 END) AS hitCount\n    FROM self_warmup_events\n    GROUP BY task_id\n  ").all();
  for (const item of result2) {
    map.set(String(item.taskId), {
      eventCount: Number(item.allCount) || 0,
      hitCount: Number(item.hitCount) || 0
    });
  }
  return map;
}
function deleteAllForTask(arg1) {
  return deleteEvents(arg1, {
    clearAll: true
  }).deleted;
}
function countSqliteRows() {
  const result = getDb();
  if (!result) {
    return 0;
  }
  ensureTables(result);
  return Number(result.prepare("SELECT COUNT(*) AS c FROM self_warmup_events").get()?.c) || 0;
}
function importTaskEvents(list = [], {
  normalizeEvent: normalizeEvent
} = {}) {
  let num = 0;
  for (const item of Array.isArray(list) ? list : []) {
    const result = String(item?.id || "");
    if (!result || !Array.isArray(item.events) || !item.events.length) {
      continue;
    }
    num += upsertEvents(result, item.events, {
      normalizeEvent: normalizeEvent
    });
  }
  return num;
}
function runSelfWarmupEventsSqliteMigrationIfNeeded({
  readTasks: readTasks,
  writeTasks: writeTasks,
  normalizeEvent: normalizeEvent
} = {}) {
  const result = getDb();
  if (!result || typeof readTasks !== "function" || typeof writeTasks !== "function") {
    return {
      ok: false,
      skipped: true
    };
  }
  ensureTables(result);
  const result2 = readTasks();
  const result3 = (Array.isArray(result2) ? result2 : []).filter(arg1 => Array.isArray(arg1?.events) && arg1.events.length > 0);
  const flag = isMigrationDone(result, MIGRATION_ID);
  if (!result3.length) {
    if (!flag) {
      markMigrationDone(result, MIGRATION_ID, {
        stats: {
          importedEvents: 0,
          taskCount: 0,
          empty: true
        }
      });
    }
    return {
      ok: true,
      empty: true,
      alreadyDone: flag
    };
  }
  if (flag) {
    const result = importTaskEvents(result3, {
      normalizeEvent: normalizeEvent
    });
    writeTasks((Array.isArray(result2) ? result2 : []).map(arg1 => ({
      ...arg1,
      events: []
    })));
    console.log("[Migrate] " + MIGRATION_ID + " 已 done 但 enc 仍有残留，补导入 events=" + result);
    return {
      ok: true,
      residual: true,
      importedEvents: result
    };
  }
  let obj = {
    backupPath: ""
  };
  try {
    obj = writeJsonBackup(getUserDataPath(), "self_warmup_events", MIGRATION_ID, {
      tasks: result3.map(arg1 => ({
        id: arg1.id,
        name: arg1.name,
        eventCount: Array.isArray(arg1.events) ? arg1.events.length : 0,
        events: arg1.events || []
      }))
    });
    const result4 = importTaskEvents(result3, {
      normalizeEvent: normalizeEvent
    });
    const result5 = result3.reduce((arg1, arg2) => arg1 + (arg2.events || []).length, 0);
    if (result4 < result5) {
      throw new Error("自动回复明细导入条数少于源数据，中止剥离 enc");
    }
    writeTasks((Array.isArray(result2) ? result2 : []).map(arg1 => ({
      ...arg1,
      events: []
    })));
    markMigrationDone(result, MIGRATION_ID, {
      backupPath: obj.backupPath,
      stats: {
        importedEvents: result4,
        sqliteEvents: countSqliteRows(),
        taskCount: result3.length
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + result3.length + " events=" + result4);
    return {
      ok: true,
      importedEvents: result4,
      backupPath: obj.backupPath
    };
  } catch (error) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 enc + 备份）:", error);
    return {
      ok: false,
      error: error.message || String(error),
      backupPath: obj.backupPath
    };
  }
}
module.exports = {
  MIGRATION_ID: MIGRATION_ID,
  MAX_EVENT_RECORDS: MAX_EVENT_RECORDS,
  ensureTables: ensureTables,
  isReady: isReady,
  isMigrationApplied: isMigrationApplied,
  upsertEvents: upsertEvents,
  deleteEvents: deleteEvents,
  listEventsPage: listEventsPage,
  listEventsForUser: listEventsForUser,
  countEventsByTask: countEventsByTask,
  deleteAllForTask: deleteAllForTask,
  runSelfWarmupEventsSqliteMigrationIfNeeded: runSelfWarmupEventsSqliteMigrationIfNeeded
};
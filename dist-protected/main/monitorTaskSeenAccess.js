'use strict';

const fs = require("fs");
const {
  getDb,
  getUserDataPath,
  isMigrationDone,
  markMigrationDone,
  listStoreKeys,
  writeJsonBackup
} = require("./schemaMigrationUtils");
const MIGRATION_ID = "monitor_task_seen_sqlite_v1";
const SEEN_PREFIX = "monitor_task_seen_";
const NOTIFIED_PREFIX = "monitor_task_notified_";
const MAX_KEYS_PER_TASK = 3000;
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS monitor_task_seen (\n      task_id TEXT PRIMARY KEY,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n  ");
}
function normalizeKeys(arg1) {
  return (Array.isArray(arg1) ? arg1 : []).map(arg1 => String(arg1 || "").trim()).filter(Boolean).slice(-MAX_KEYS_PER_TASK);
}
function collectLegacyByTask(arg1) {
  const map = new Map();
  if (!arg1 || typeof arg1.get !== "function") {
    return map;
  }
  const result = listStoreKeys(arg1);
  for (const item of result) {
    let text = "";
    let flag = false;
    if (item.startsWith(SEEN_PREFIX)) {
      text = item.slice(SEEN_PREFIX.length);
    } else if (item.startsWith(NOTIFIED_PREFIX)) {
      text = item.slice(NOTIFIED_PREFIX.length);
      flag = true;
    } else {
      continue;
    }
    if (!text) {
      continue;
    }
    const result = arg1.get(item, []);
    if (!Array.isArray(result) || !result.length) {
      continue;
    }
    const local = map.get(text) || [];
    if (flag && local.length) {
      const set = new Set(local);
      const result2 = local.slice();
      for (const item of result) {
        const result = String(item || "").trim();
        if (!result || set.has(result)) {
          continue;
        }
        set.add(result);
        result2.push(result);
      }
      map.set(text, normalizeKeys(result2));
    } else if (!flag) {
      const set = new Set();
      const list = [];
      for (const item of [...result, ...(local || [])]) {
        const result = String(item || "").trim();
        if (!result || set.has(result)) {
          continue;
        }
        set.add(result);
        list.push(result);
      }
      map.set(text, normalizeKeys(list));
    } else {
      map.set(text, normalizeKeys(result));
    }
  }
  return map;
}
function listLegacyStoreKeys(arg1) {
  return listStoreKeys(arg1).filter(arg1 => arg1.startsWith(SEEN_PREFIX) || arg1.startsWith(NOTIFIED_PREFIX));
}
function getFromDb(arg1, arg2) {
  ensureTables(arg1);
  const result = String(arg2 || "").trim();
  if (!result) {
    return [];
  }
  const result2 = arg1.prepare("SELECT raw_data FROM monitor_task_seen WHERE task_id = ?").get(result);
  if (!result2) {
    return [];
  }
  try {
    const result = JSON.parse(result2.raw_data || "[]");
    if (Array.isArray(result)) {
      return normalizeKeys(result);
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
}
function saveToDb(arg1, arg2, arg3) {
  ensureTables(arg1);
  const result = String(arg2 || "").trim();
  if (!result) {
    return false;
  }
  const result2 = normalizeKeys(arg3);
  arg1.prepare("\n    INSERT INTO monitor_task_seen (task_id, updated_at, raw_data)\n    VALUES (?, ?, ?)\n    ON CONFLICT(task_id) DO UPDATE SET\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ").run(result, Date.now(), JSON.stringify(result2));
  return true;
}
function deleteFromDb(arg1, arg2) {
  ensureTables(arg1);
  const result = String(arg2 || "").trim();
  if (!result) {
    return;
  }
  arg1.prepare("DELETE FROM monitor_task_seen WHERE task_id = ?").run(result);
}
function countTasksDb(arg1) {
  ensureTables(arg1);
  return Number(arg1.prepare("SELECT COUNT(*) AS c FROM monitor_task_seen").get()?.c) || 0;
}
function importMapToDb(arg1, arg2) {
  ensureTables(arg1);
  const result = arg1.prepare("\n    INSERT INTO monitor_task_seen (task_id, updated_at, raw_data)\n    VALUES (?, ?, ?)\n    ON CONFLICT(task_id) DO UPDATE SET\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ");
  const result2 = arg1.prepare("SELECT raw_data FROM monitor_task_seen WHERE task_id = ?");
  const result3 = Date.now();
  let num = 0;
  const result4 = arg1.transaction(arg1 => {
    for (const [local, local2] of arg1) {
      const result4 = String(local || "").trim();
      if (!result4) {
        continue;
      }
      let result5 = normalizeKeys(local2);
      const result6 = result2.get(result4);
      if (result6) {
        try {
          const result = JSON.parse(result6.raw_data || "[]");
          if (Array.isArray(result) && result.length) {
            const set = new Set();
            const list = [];
            for (const item of [...result, ...result5]) {
              const result = String(item || "").trim();
              if (!result || set.has(result)) {
                continue;
              }
              set.add(result);
              list.push(result);
            }
            result5 = normalizeKeys(list);
          }
        } catch (error) {}
      }
      result.run(result4, result3, JSON.stringify(result5));
      num += 1;
    }
  });
  result4([...arg2.entries()]);
  return num;
}
function clearLegacyStore(arg1) {
  if (!arg1) {
    return 0;
  }
  const result = listLegacyStoreKeys(arg1);
  let num = 0;
  for (const item of result) {
    try {
      if (typeof arg1.delete === "function") {
        arg1.delete(item);
      } else {
        arg1.set(item, []);
      }
      num += 1;
    } catch (error) {}
  }
  try {
    arg1.set("monitor_task_seen_migrated_at", Date.now());
  } catch (error) {}
  return num;
}
function runMonitorTaskSeenSqliteMigrationIfNeeded(arg1) {
  const result = getDb();
  if (!result) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(result);
  const result2 = collectLegacyByTask(arg1);
  const value = listLegacyStoreKeys(arg1).length;
  const flag = isMigrationDone(result, MIGRATION_ID);
  if (flag && result2.size === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (flag && result2.size > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + result2.size + " 个任务指纹残留，补导入");
  }
  if (result2.size === 0) {
    markMigrationDone(result, MIGRATION_ID, {
      stats: {
        imported: 0,
        taskCount: 0,
        storeKeyCount: 0,
        empty: true
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + ": store 无指纹，已标记 done");
    return {
      skipped: false,
      empty: true,
      done: true
    };
  }
  const obj = {};
  let num = 0;
  for (const [local, local2] of result2.entries()) {
    obj[local] = local2;
    num += local2.length;
  }
  let obj2 = {
    backupPath: "",
    checksum: ""
  };
  try {
    obj2 = writeJsonBackup(getUserDataPath(), "monitor_task_seen", MIGRATION_ID, {
      taskCount: result2.size,
      totalKeys: num,
      storeKeyCount: value,
      items: obj
    });
    const result = JSON.parse(fs.readFileSync(obj2.backupPath, "utf8"));
    if (Number(result.taskCount) !== result2.size) {
      throw new Error("监控指纹备份任务数不一致");
    }
    console.log("[Migrate] 已备份 monitor_task_seen " + result2.size + " 任务 / " + num + " 指纹 → " + obj2.backupPath);
  } catch (error) {
    console.error("[Migrate] monitor_task_seen 备份失败，中止迁移（保留 store）:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "backup"
    };
  }
  const result3 = countTasksDb(result);
  try {
    const result4 = importMapToDb(result, result2);
    const result5 = countTasksDb(result);
    if (result4 > 0 && result5 === 0) {
      throw new Error("校验失败：写入后表为空");
    }
    markMigrationDone(result, MIGRATION_ID, {
      backupPath: obj2.backupPath,
      stats: {
        imported: result4,
        taskCount: result2.size,
        totalKeys: num,
        storeKeyCount: value,
        sqliteCountBefore: result3,
        sqliteCountAfter: result5,
        checksum: obj2.checksum,
        residualReimport: flag
      }
    });
    const result6 = clearLegacyStore(arg1);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + result2.size + " keys=" + num + " sqlite=" + result5 + " clearedStoreKeys=" + result6);
    return {
      skipped: false,
      imported: result4,
      done: true,
      backupPath: obj2.backupPath,
      sqliteCount: result5
    };
  } catch (error) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", error);
    return {
      skipped: false,
      error: error.message || String(error),
      stage: "migrate",
      backupPath: obj2.backupPath
    };
  }
}
function getSeenKeys(arg1, arg2) {
  const result = getDb();
  if (result) {
    return getFromDb(result, arg2);
  }
  const result2 = String(arg2 || "").trim();
  if (!result2 || !arg1) {
    return [];
  }
  const result3 = arg1.get("" + SEEN_PREFIX + result2, null);
  if (Array.isArray(result3) && result3.length > 0) {
    return normalizeKeys(result3);
  }
  const result4 = arg1.get("" + NOTIFIED_PREFIX + result2, []);
  if (Array.isArray(result4) && result4.length > 0) {
    try {
      arg1.set("" + SEEN_PREFIX + result2, result4);
    } catch (error) {}
    return normalizeKeys(result4);
  }
  return [];
}
function saveSeenKeys(arg1, arg2, arg3) {
  const result = getDb();
  if (result) {
    return saveToDb(result, arg2, arg3);
  }
  const result2 = String(arg2 || "").trim();
  if (!result2 || !arg1) {
    return false;
  }
  arg1.set("" + SEEN_PREFIX + result2, normalizeKeys(arg3));
  return true;
}
function clearSeenKeys(arg1, arg2) {
  const result = getDb();
  const result2 = String(arg2 || "").trim();
  if (!result2) {
    return 0;
  }
  const value = getSeenKeys(arg1, result2).length;
  if (result) {
    deleteFromDb(result, result2);
  }
  if (arg1) {
    try {
      if (typeof arg1.delete === "function") {
        arg1.delete("" + SEEN_PREFIX + result2);
        arg1.delete("" + NOTIFIED_PREFIX + result2);
      } else {
        arg1.set("" + SEEN_PREFIX + result2, []);
        arg1.set("" + NOTIFIED_PREFIX + result2, []);
      }
    } catch (error) {}
  }
  return value;
}
function pruneSqlite({
  seenLimit = MAX_KEYS_PER_TASK,
  seenKeyLimit = 40
} = {}) {
  const result = getDb();
  const obj = {
    trimmed: 0,
    removed: 0
  };
  if (!result) {
    return obj;
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT task_id, updated_at, raw_data FROM monitor_task_seen\n    ORDER BY updated_at ASC\n  ").all();
  if (result2.length > seenKeyLimit) {
    const result3 = result2.slice(0, result2.length - seenKeyLimit);
    const result4 = result.prepare("DELETE FROM monitor_task_seen WHERE task_id = ?");
    const result5 = result.transaction(arg1 => {
      for (const item of arg1) {
        result4.run(item.task_id);
        obj.removed += 1;
      }
    });
    result5(result3);
  }
  const result3 = result.prepare("\n    SELECT task_id, raw_data FROM monitor_task_seen\n  ").all();
  const result4 = result.prepare("\n    UPDATE monitor_task_seen SET raw_data = ?, updated_at = ? WHERE task_id = ?\n  ");
  const result5 = Date.now();
  for (const item of result3) {
    let list = [];
    try {
      list = JSON.parse(item.raw_data || "[]");
    } catch (error) {
      list = [];
    }
    if (!Array.isArray(list) || list.length <= seenLimit) {
      continue;
    }
    result4.run(JSON.stringify(list.slice(-seenLimit)), result5, item.task_id);
    obj.trimmed += 1;
  }
  return obj;
}
module.exports = {
  MIGRATION_ID: MIGRATION_ID,
  SEEN_PREFIX: SEEN_PREFIX,
  NOTIFIED_PREFIX: NOTIFIED_PREFIX,
  MAX_KEYS_PER_TASK: MAX_KEYS_PER_TASK,
  ensureTables: ensureTables,
  collectLegacyByTask: collectLegacyByTask,
  runMonitorTaskSeenSqliteMigrationIfNeeded: runMonitorTaskSeenSqliteMigrationIfNeeded,
  getSeenKeys: getSeenKeys,
  saveSeenKeys: saveSeenKeys,
  clearSeenKeys: clearSeenKeys,
  pruneSqlite: pruneSqlite
};
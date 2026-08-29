'use strict';

const {
  getDb,
  getUserDataPath,
  isMigrationDone,
  markMigrationDone,
  writeJsonBackup
} = require("./schemaMigrationUtils");
const {
  normalizeMonitorTaskCycle
} = require("./monitorTaskCycles");
const {
  normalizeMonitorVideoCommentRecord
} = require("./monitorTaskVideoComments");
const MIGRATION_ID = "monitor_task_details_sqlite_v1";
function ensureTables(arg1 = getDb()) {
  if (!arg1) {
    return false;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS monitor_task_matches (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      nickname TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      matched INTEGER NOT NULL DEFAULT 1,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_ts\n      ON monitor_task_matches(task_id, ts DESC);\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_matched\n      ON monitor_task_matches(task_id, matched);\n\n    CREATE TABLE IF NOT EXISTS monitor_task_cycles (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      round INTEGER NOT NULL DEFAULT 1,\n      started_at INTEGER,\n      ended_at INTEGER,\n      status TEXT DEFAULT 'done',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_cycles_task_started\n      ON monitor_task_cycles(task_id, started_at DESC);\n\n    CREATE TABLE IF NOT EXISTS monitor_task_video_comments (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      account_id TEXT DEFAULT '',\n      video_id TEXT DEFAULT '',\n      status TEXT DEFAULT 'success',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_video_comments_task_ts\n      ON monitor_task_video_comments(task_id, ts DESC);\n  ");
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
function jsonStatusNotNone(arg1) {
  return "(IFNULL(json_extract(raw_data, '$." + arg1 + "'), 'none') NOT IN ('', 'none'))";
}
function actionPredicate(arg1) {
  if (arg1 === "like") {
    return jsonStatusNotNone("likeStatus");
  }
  if (arg1 === "follow") {
    return jsonStatusNotNone("followStatus");
  }
  if (arg1 === "dm") {
    return jsonStatusNotNone("dmStatus");
  }
  if (arg1 === "reply") {
    return "(\n      " + jsonStatusNotNone("replyStatus") + "\n      AND IFNULL(json_extract(raw_data, '$.replyTarget'), '') != 'profile_first'\n    )";
  }
  if (arg1 === "profileComment") {
    return "(\n      " + jsonStatusNotNone("profileCommentStatus") + "\n      OR IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first'\n    )";
  }
  return "";
}
function actionStatusExpr(arg1) {
  if (arg1 === "like") {
    return "IFNULL(json_extract(raw_data, '$.likeStatus'), 'none')";
  }
  if (arg1 === "follow") {
    return "IFNULL(json_extract(raw_data, '$.followStatus'), 'none')";
  }
  if (arg1 === "dm") {
    return "IFNULL(json_extract(raw_data, '$.dmStatus'), 'none')";
  }
  if (arg1 === "reply") {
    return "CASE\n      WHEN IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first' THEN 'none'\n      ELSE IFNULL(json_extract(raw_data, '$.replyStatus'), 'none')\n    END";
  }
  if (arg1 === "profileComment") {
    return "CASE\n      WHEN IFNULL(json_extract(raw_data, '$.profileCommentStatus'), 'none') NOT IN ('', 'none')\n        THEN json_extract(raw_data, '$.profileCommentStatus')\n      WHEN IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first'\n        THEN IFNULL(json_extract(raw_data, '$.replyStatus'), 'none')\n      ELSE 'none'\n    END";
  }
  return "'none'";
}
function buildMatchWhere(arg1, options = {}) {
  const list = ["task_id = ?"];
  const list2 = [String(arg1)];
  const result = String(options.result || "all");
  if (result === "hit") {
    list.push("matched != 0");
  }
  if (result === "miss") {
    list.push("matched = 0");
  }
  const result2 = String(options.keyword || "").trim();
  if (result2) {
    const value = "%" + escapeLike(result2) + "%";
    list.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    list2.push(value, value, value);
  }
  const value = Array.isArray(options.actions) ? options.actions.filter(Boolean) : [];
  if (value.length) {
    const result = value.map(actionPredicate).filter(Boolean);
    if (result.length) {
      list.push("(" + result.join(" OR ") + ")");
    }
  }
  const result3 = String(options.outcome || "all");
  if (result3 === "success" || result3 === "failed") {
    const value2 = value.length ? value : ["like", "reply", "profileComment", "follow", "dm"];
    const result = value2.map(arg1 => {
      const result = actionStatusExpr(arg1);
      if (result3 === "success") {
        return "(" + result + " IN ('success', 'already_followed'))";
      }
      return "(" + result + " = 'failed')";
    });
    if (result.length) {
      list.push("(" + result.join(" OR ") + ")");
    }
  }
  return {
    sql: list.join(" AND "),
    params: list2
  };
}
function parseMatchRow(arg1) {
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
function parseCycleRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    return normalizeMonitorTaskCycle({
      ...result,
      id: result.id || arg1.id,
      round: result.round || arg1.round,
      startedAt: result.startedAt ?? arg1.started_at,
      endedAt: result.endedAt ?? arg1.ended_at,
      status: result.status || arg1.status
    });
  } catch (error) {
    return null;
  }
}
function appendMatches(arg1, list = []) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  const result2 = (Array.isArray(list) ? list : [list]).filter(arg1 => arg1 && typeof arg1 === "object");
  if (!result2.length) {
    return 0;
  }
  const result3 = result.prepare("\n    INSERT INTO monitor_task_matches (id, task_id, ts, nickname, account_id, matched, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      nickname = excluded.nickname,\n      account_id = excluded.account_id,\n      matched = excluded.matched,\n      raw_data = excluded.raw_data\n  ");
  const result4 = result.transaction(arg12 => {
    let num = 0;
    for (const item of arg12) {
      const result = String(item.id || "").trim();
      if (!result) {
        continue;
      }
      result3.run(result, String(arg1), Number(item.ts) || Date.now(), String(item.nickname || ""), String(item.accountId || ""), item.matched === false ? 0 : 1, JSON.stringify(item));
      num += 1;
    }
    return num;
  });
  return result4(result2);
}
function deleteMatches(arg1, {
  matchIds = [],
  clearAll = false,
  clearMisses = false
} = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  const result2 = String(arg1);
  if (clearAll) {
    return result.prepare("DELETE FROM monitor_task_matches WHERE task_id = ?").run(result2).changes || 0;
  }
  if (clearMisses) {
    return result.prepare("DELETE FROM monitor_task_matches WHERE task_id = ? AND matched = 0").run(result2).changes || 0;
  }
  const result3 = (Array.isArray(matchIds) ? matchIds : [matchIds]).map(String).filter(Boolean);
  if (!result3.length) {
    return 0;
  }
  const result4 = result.prepare("DELETE FROM monitor_task_matches WHERE task_id = ? AND id = ?");
  const result5 = result.transaction(arg1 => {
    let num = 0;
    for (const item of arg1) {
      num += result4.run(result2, item).changes || 0;
    }
    return num;
  });
  return result5(result3);
}
function listMatchesPage(arg1, options = {}) {
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
  const {
    sql: sql,
    params: params
  } = buildMatchWhere(result2, options);
  const local = Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE " + sql).get(...params)?.c) || 0;
  const result5 = result.prepare("\n    SELECT id, task_id, ts, matched, raw_data\n    FROM monitor_task_matches\n    WHERE " + sql + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(...params, result3, result4);
  const local2 = Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE task_id = ?").get(result2)?.c) || 0;
  const local3 = Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE task_id = ? AND matched != 0").get(result2)?.c) || 0;
  return {
    items: result5.map(parseMatchRow).filter(Boolean),
    total: local,
    counts: {
      all: local2,
      hit: local3,
      miss: Math.max(0, local2 - local3)
    }
  };
}
function countMatchesByTask() {
  const result = getDb();
  const map = new Map();
  if (!result) {
    return map;
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT task_id AS taskId,\n      COUNT(*) AS allCount,\n      SUM(CASE WHEN matched != 0 THEN 1 ELSE 0 END) AS hitCount\n    FROM monitor_task_matches\n    GROUP BY task_id\n  ").all();
  for (const item of result2) {
    map.set(String(item.taskId), {
      matchCount: Number(item.allCount) || 0,
      hitCount: Number(item.hitCount) || 0
    });
  }
  return map;
}
function listMatchUserKeys(arg1) {
  const result = getDb();
  if (!result || !arg1) {
    return [];
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT\n      IFNULL(json_extract(raw_data, '$.userUrl'), '') AS userUrl,\n      IFNULL(json_extract(raw_data, '$.secUid'), '') AS secUid,\n      IFNULL(json_extract(raw_data, '$.sec_uid'), '') AS sec_uid,\n      IFNULL(json_extract(raw_data, '$.matchType'), '') AS matchType,\n      matched,\n      IFNULL(json_extract(raw_data, '$.judgeReason'), '') AS judgeReason\n    FROM monitor_task_matches\n    WHERE task_id = ?\n  ").all(String(arg1));
  return result2;
}
function upsertCycle(arg1, options = {}) {
  const result = getDb();
  if (!result || !arg1 || !options?.id) {
    return null;
  }
  ensureTables(result);
  const result2 = normalizeMonitorTaskCycle(options);
  result.prepare("\n    INSERT INTO monitor_task_cycles (id, task_id, round, started_at, ended_at, status, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      round = excluded.round,\n      started_at = excluded.started_at,\n      ended_at = excluded.ended_at,\n      status = excluded.status,\n      raw_data = excluded.raw_data\n  ").run(result2.id, String(arg1), result2.round, result2.startedAt, result2.endedAt, result2.status, JSON.stringify(result2));
  return result2;
}
function getCycle(arg1, arg2) {
  const result = getDb();
  if (!result || !arg1 || !arg2) {
    return null;
  }
  ensureTables(result);
  const result2 = result.prepare("SELECT * FROM monitor_task_cycles WHERE task_id = ? AND id = ?").get(String(arg1), String(arg2));
  return parseCycleRow(result2);
}
function listOpenCycles(arg1) {
  const result = getDb();
  if (!result || !arg1) {
    return [];
  }
  ensureTables(result);
  return result.prepare("\n    SELECT * FROM monitor_task_cycles WHERE task_id = ? AND status = 'running'\n  ").all(String(arg1)).map(parseCycleRow).filter(Boolean);
}
function maxCycleRound(arg1) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  return Number(result.prepare("SELECT MAX(round) AS m FROM monitor_task_cycles WHERE task_id = ?").get(String(arg1))?.m) || 0;
}
function listCyclesPage(arg1, options = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return {
      items: [],
      total: 0
    };
  }
  ensureTables(result);
  const result2 = String(arg1);
  const result3 = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result4 = Math.max(0, Number(options.offset) || 0);
  const local = Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_cycles WHERE task_id = ?").get(result2)?.c) || 0;
  const result5 = result.prepare("\n    SELECT * FROM monitor_task_cycles\n    WHERE task_id = ?\n    ORDER BY started_at DESC, round DESC\n    LIMIT ? OFFSET ?\n  ").all(result2, result3, result4);
  return {
    items: result5.map(parseCycleRow).filter(Boolean),
    total: local
  };
}
function countCyclesByTask() {
  const result = getDb();
  const map = new Map();
  if (!result) {
    return map;
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT task_id AS taskId, COUNT(*) AS c FROM monitor_task_cycles GROUP BY task_id\n  ").all();
  for (const item of result2) {
    map.set(String(item.taskId), Number(item.c) || 0);
  }
  return map;
}
function deleteCyclesForTask(arg1) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  return result.prepare("DELETE FROM monitor_task_cycles WHERE task_id = ?").run(String(arg1)).changes || 0;
}
function parseVideoCommentRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    return normalizeMonitorVideoCommentRecord({
      ...result,
      id: result.id || arg1.id,
      ts: result.ts || arg1.ts,
      accountId: result.accountId || arg1.account_id,
      videoId: result.videoId || arg1.video_id,
      status: result.status || arg1.status
    });
  } catch (error) {
    return null;
  }
}
function appendVideoComments(arg1, list = []) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  const result2 = (Array.isArray(list) ? list : [list]).map(normalizeMonitorVideoCommentRecord).filter(arg1 => arg1 && arg1.id);
  if (!result2.length) {
    return 0;
  }
  const result3 = result.prepare("\n    INSERT INTO monitor_task_video_comments (id, task_id, ts, account_id, video_id, status, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      account_id = excluded.account_id,\n      video_id = excluded.video_id,\n      status = excluded.status,\n      raw_data = excluded.raw_data\n  ");
  const result4 = result.transaction(arg12 => {
    let num = 0;
    for (const item of arg12) {
      result3.run(item.id, String(arg1), item.ts, item.accountId, item.videoId, item.status, JSON.stringify(item));
      num += 1;
    }
    return num;
  });
  return result4(result2);
}
function listVideoCommentsPage(arg1, options = {}) {
  const result = getDb();
  if (!result || !arg1) {
    return {
      items: [],
      total: 0
    };
  }
  ensureTables(result);
  const result2 = String(arg1);
  const result3 = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result4 = Math.max(0, Number(options.offset) || 0);
  const result5 = String(options.keyword || "").trim();
  const list = ["task_id = ?"];
  const list2 = [result2];
  if (result5) {
    const value = "%" + escapeLike(result5) + "%";
    list.push("(\n      IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR IFNULL(video_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    list2.push(value, value, value);
  }
  const result6 = list.join(" AND ");
  const local = Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_video_comments WHERE " + result6).get(...list2)?.c) || 0;
  const result7 = result.prepare("\n    SELECT * FROM monitor_task_video_comments\n    WHERE " + result6 + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(...list2, result3, result4);
  return {
    items: result7.map(parseVideoCommentRow).filter(Boolean),
    total: local
  };
}
function countVideoCommentsByTask() {
  const result = getDb();
  const map = new Map();
  if (!result) {
    return map;
  }
  ensureTables(result);
  const result2 = result.prepare("\n    SELECT task_id AS taskId, COUNT(*) AS c FROM monitor_task_video_comments GROUP BY task_id\n  ").all();
  for (const item of result2) {
    map.set(String(item.taskId), Number(item.c) || 0);
  }
  return map;
}
function deleteVideoCommentsForTask(arg1) {
  const result = getDb();
  if (!result || !arg1) {
    return 0;
  }
  ensureTables(result);
  return result.prepare("DELETE FROM monitor_task_video_comments WHERE task_id = ?").run(String(arg1)).changes || 0;
}
function deleteAllForTask(arg1) {
  deleteMatches(arg1, {
    clearAll: true
  });
  deleteCyclesForTask(arg1);
  deleteVideoCommentsForTask(arg1);
}
function countSqliteRows() {
  const result = getDb();
  if (!result) {
    return {
      matches: 0,
      cycles: 0
    };
  }
  ensureTables(result);
  return {
    matches: Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches").get()?.c) || 0,
    cycles: Number(result.prepare("SELECT COUNT(*) AS c FROM monitor_task_cycles").get()?.c) || 0
  };
}
function importTaskDetails(list = []) {
  let num = 0;
  let num2 = 0;
  let num3 = 0;
  for (const item of Array.isArray(list) ? list : []) {
    const result = String(item?.id || "");
    if (!result) {
      continue;
    }
    if (Array.isArray(item.matches) && item.matches.length) {
      num += appendMatches(result, item.matches);
    }
    if (Array.isArray(item.cycles) && item.cycles.length) {
      for (const item2 of item.cycles) {
        if (upsertCycle(result, item2)) {
          num2 += 1;
        }
      }
    }
    if (Array.isArray(item.videoComments) && item.videoComments.length) {
      num3 += appendVideoComments(result, item.videoComments);
    }
  }
  return {
    matchCount: num,
    cycleCount: num2,
    videoCommentCount: num3
  };
}
function runMonitorTaskDetailsSqliteMigrationIfNeeded({
  readTasks: readTasks,
  writeTasks: writeTasks
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
  const result3 = (Array.isArray(result2) ? result2 : []).filter(arg1 => Array.isArray(arg1?.matches) && arg1.matches.length > 0 || Array.isArray(arg1?.cycles) && arg1.cycles.length > 0 || Array.isArray(arg1?.videoComments) && arg1.videoComments.length > 0);
  const flag = isMigrationDone(result, MIGRATION_ID);
  if (!result3.length) {
    if (!flag) {
      markMigrationDone(result, MIGRATION_ID, {
        stats: {
          importedMatches: 0,
          importedCycles: 0,
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
    const result = importTaskDetails(result3);
    writeTasks((Array.isArray(result2) ? result2 : []).map(arg1 => ({
      ...arg1,
      matches: [],
      cycles: [],
      videoComments: []
    })));
    console.log("[Migrate] " + MIGRATION_ID + " 已 done 但 enc 仍有残留，补导入 matches=" + result.matchCount + " cycles=" + result.cycleCount + " videoComments=" + (result.videoCommentCount || 0));
    return {
      ok: true,
      residual: true,
      ...result
    };
  }
  let obj = {
    backupPath: ""
  };
  try {
    obj = writeJsonBackup(getUserDataPath(), "monitor_task_details", MIGRATION_ID, {
      tasks: result3.map(arg1 => ({
        id: arg1.id,
        name: arg1.name,
        matchCount: Array.isArray(arg1.matches) ? arg1.matches.length : 0,
        cycleCount: Array.isArray(arg1.cycles) ? arg1.cycles.length : 0,
        videoCommentCount: Array.isArray(arg1.videoComments) ? arg1.videoComments.length : 0,
        matches: arg1.matches || [],
        cycles: arg1.cycles || [],
        videoComments: arg1.videoComments || []
      }))
    });
    const result4 = importTaskDetails(result3);
    const result5 = countSqliteRows();
    if (result4.matchCount < result3.reduce((arg1, arg2) => arg1 + (arg2.matches || []).length, 0)) {
      throw new Error("研判明细导入条数少于源数据，中止剥离 enc");
    }
    if (result4.videoCommentCount < result3.reduce((arg1, arg2) => arg1 + (arg2.videoComments || []).length, 0)) {
      throw new Error("视频主评导入条数少于源数据，中止剥离 enc");
    }
    writeTasks((Array.isArray(result2) ? result2 : []).map(arg1 => ({
      ...arg1,
      matches: [],
      cycles: [],
      videoComments: []
    })));
    markMigrationDone(result, MIGRATION_ID, {
      backupPath: obj.backupPath,
      stats: {
        importedMatches: result4.matchCount,
        importedCycles: result4.cycleCount,
        importedVideoComments: result4.videoCommentCount,
        sqliteMatches: result5.matches,
        sqliteCycles: result5.cycles,
        taskCount: result3.length
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + result3.length + " matches=" + result4.matchCount + " cycles=" + result4.cycleCount + " videoComments=" + result4.videoCommentCount);
    return {
      ok: true,
      ...result4,
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
  ensureTables: ensureTables,
  isReady: isReady,
  isMigrationApplied: isMigrationApplied,
  appendMatches: appendMatches,
  deleteMatches: deleteMatches,
  listMatchesPage: listMatchesPage,
  countMatchesByTask: countMatchesByTask,
  listMatchUserKeys: listMatchUserKeys,
  upsertCycle: upsertCycle,
  getCycle: getCycle,
  listOpenCycles: listOpenCycles,
  maxCycleRound: maxCycleRound,
  listCyclesPage: listCyclesPage,
  countCyclesByTask: countCyclesByTask,
  deleteCyclesForTask: deleteCyclesForTask,
  appendVideoComments: appendVideoComments,
  listVideoCommentsPage: listVideoCommentsPage,
  countVideoCommentsByTask: countVideoCommentsByTask,
  deleteVideoCommentsForTask: deleteVideoCommentsForTask,
  deleteAllForTask: deleteAllForTask,
  runMonitorTaskDetailsSqliteMigrationIfNeeded: runMonitorTaskDetailsSqliteMigrationIfNeeded
};
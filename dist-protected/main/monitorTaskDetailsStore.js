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
function ensureTables(_0x3c47ea = getDb()) {
  if (!_0x3c47ea) {
    return false;
  }
  _0x3c47ea.exec("\n    CREATE TABLE IF NOT EXISTS monitor_task_matches (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      nickname TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      matched INTEGER NOT NULL DEFAULT 1,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_ts\n      ON monitor_task_matches(task_id, ts DESC);\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_matched\n      ON monitor_task_matches(task_id, matched);\n\n    CREATE TABLE IF NOT EXISTS monitor_task_cycles (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      round INTEGER NOT NULL DEFAULT 1,\n      started_at INTEGER,\n      ended_at INTEGER,\n      status TEXT DEFAULT 'done',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_cycles_task_started\n      ON monitor_task_cycles(task_id, started_at DESC);\n\n    CREATE TABLE IF NOT EXISTS monitor_task_video_comments (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      account_id TEXT DEFAULT '',\n      video_id TEXT DEFAULT '',\n      status TEXT DEFAULT 'success',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_monitor_task_video_comments_task_ts\n      ON monitor_task_video_comments(task_id, ts DESC);\n  ");
  return true;
}
function isReady() {
  const _0x37cde7 = getDb();
  if (!_0x37cde7) {
    return false;
  }
  try {
    ensureTables(_0x37cde7);
    return true;
  } catch (_0x43a049) {
    return false;
  }
}
function isMigrationApplied() {
  const _0x4b73ac = getDb();
  if (!_0x4b73ac) {
    return false;
  }
  try {
    ensureTables(_0x4b73ac);
    return isMigrationDone(_0x4b73ac, MIGRATION_ID);
  } catch (_0x2b32ea) {
    return false;
  }
}
function escapeLike(_0x4fa583) {
  return String(_0x4fa583 || "").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function jsonStatusNotNone(_0x20084f) {
  return "(IFNULL(json_extract(raw_data, '$." + _0x20084f + "'), 'none') NOT IN ('', 'none'))";
}
function actionPredicate(_0x34f287) {
  if (_0x34f287 === "like") {
    return jsonStatusNotNone("likeStatus");
  }
  if (_0x34f287 === "follow") {
    return jsonStatusNotNone("followStatus");
  }
  if (_0x34f287 === "dm") {
    return jsonStatusNotNone("dmStatus");
  }
  if (_0x34f287 === "reply") {
    return "(\n      " + jsonStatusNotNone("replyStatus") + "\n      AND IFNULL(json_extract(raw_data, '$.replyTarget'), '') != 'profile_first'\n    )";
  }
  if (_0x34f287 === "profileComment") {
    return "(\n      " + jsonStatusNotNone("profileCommentStatus") + "\n      OR IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first'\n    )";
  }
  return "";
}
function actionStatusExpr(_0x565f0b) {
  if (_0x565f0b === "like") {
    return "IFNULL(json_extract(raw_data, '$.likeStatus'), 'none')";
  }
  if (_0x565f0b === "follow") {
    return "IFNULL(json_extract(raw_data, '$.followStatus'), 'none')";
  }
  if (_0x565f0b === "dm") {
    return "IFNULL(json_extract(raw_data, '$.dmStatus'), 'none')";
  }
  if (_0x565f0b === "reply") {
    return "CASE\n      WHEN IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first' THEN 'none'\n      ELSE IFNULL(json_extract(raw_data, '$.replyStatus'), 'none')\n    END";
  }
  if (_0x565f0b === "profileComment") {
    return "CASE\n      WHEN IFNULL(json_extract(raw_data, '$.profileCommentStatus'), 'none') NOT IN ('', 'none')\n        THEN json_extract(raw_data, '$.profileCommentStatus')\n      WHEN IFNULL(json_extract(raw_data, '$.replyTarget'), '') = 'profile_first'\n        THEN IFNULL(json_extract(raw_data, '$.replyStatus'), 'none')\n      ELSE 'none'\n    END";
  }
  return "'none'";
}
function buildMatchWhere(_0x170f8a, _0x345d51 = {}) {
  const _0x284456 = ["task_id = ?"];
  const _0x10afdb = [String(_0x170f8a)];
  const _0x18ffb5 = String(_0x345d51.result || "all");
  if (_0x18ffb5 === "hit") {
    _0x284456.push("matched != 0");
  }
  if (_0x18ffb5 === "miss") {
    _0x284456.push("matched = 0");
  }
  const _0x319af6 = String(_0x345d51.keyword || "").trim();
  if (_0x319af6) {
    const _0x52834c = "%" + escapeLike(_0x319af6) + "%";
    _0x284456.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    _0x10afdb.push(_0x52834c, _0x52834c, _0x52834c);
  }
  const _0xad2d68 = Array.isArray(_0x345d51.actions) ? _0x345d51.actions.filter(Boolean) : [];
  if (_0xad2d68.length) {
    const _0x24c023 = _0xad2d68.map(actionPredicate).filter(Boolean);
    if (_0x24c023.length) {
      _0x284456.push("(" + _0x24c023.join(" OR ") + ")");
    }
  }
  const _0x18ee87 = String(_0x345d51.outcome || "all");
  if (_0x18ee87 === "success" || _0x18ee87 === "failed") {
    const _0x1d0d6f = _0xad2d68.length ? _0xad2d68 : ["like", "reply", "profileComment", "follow", "dm"];
    const _0x5a7dd1 = _0x1d0d6f.map(_0x52e1bb => {
      const _0x136afa = actionStatusExpr(_0x52e1bb);
      if (_0x18ee87 === "success") {
        return "(" + _0x136afa + " IN ('success', 'already_followed'))";
      }
      return "(" + _0x136afa + " = 'failed')";
    });
    if (_0x5a7dd1.length) {
      _0x284456.push("(" + _0x5a7dd1.join(" OR ") + ")");
    }
  }
  return {
    sql: _0x284456.join(" AND "),
    params: _0x10afdb
  };
}
function parseMatchRow(_0x40927c) {
  if (!_0x40927c) {
    return null;
  }
  try {
    const _0x1f6c99 = JSON.parse(_0x40927c.raw_data || "{}");
    if (!_0x1f6c99 || typeof _0x1f6c99 !== "object") {
      return null;
    }
    if (!_0x1f6c99.id && _0x40927c.id) {
      _0x1f6c99.id = _0x40927c.id;
    }
    if (!_0x1f6c99.ts && _0x40927c.ts) {
      _0x1f6c99.ts = _0x40927c.ts;
    }
    if (_0x1f6c99.matched === undefined) {
      _0x1f6c99.matched = Number(_0x40927c.matched) !== 0;
    }
    return _0x1f6c99;
  } catch (_0x41b254) {
    return null;
  }
}
function parseCycleRow(_0x4d1da5) {
  if (!_0x4d1da5) {
    return null;
  }
  try {
    const _0x5b0260 = JSON.parse(_0x4d1da5.raw_data || "{}");
    return normalizeMonitorTaskCycle({
      ..._0x5b0260,
      id: _0x5b0260.id || _0x4d1da5.id,
      round: _0x5b0260.round || _0x4d1da5.round,
      startedAt: _0x5b0260.startedAt ?? _0x4d1da5.started_at,
      endedAt: _0x5b0260.endedAt ?? _0x4d1da5.ended_at,
      status: _0x5b0260.status || _0x4d1da5.status
    });
  } catch (_0x23063e) {
    return null;
  }
}
function appendMatches(_0x354a70, _0x3b5f9d = []) {
  const _0x52f4dc = getDb();
  if (!_0x52f4dc || !_0x354a70) {
    return 0;
  }
  ensureTables(_0x52f4dc);
  const _0x16f250 = (Array.isArray(_0x3b5f9d) ? _0x3b5f9d : [_0x3b5f9d]).filter(_0x29a312 => _0x29a312 && typeof _0x29a312 === "object");
  if (!_0x16f250.length) {
    return 0;
  }
  const _0x5ac53f = _0x52f4dc.prepare("\n    INSERT INTO monitor_task_matches (id, task_id, ts, nickname, account_id, matched, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      nickname = excluded.nickname,\n      account_id = excluded.account_id,\n      matched = excluded.matched,\n      raw_data = excluded.raw_data\n  ");
  const _0x321cae = _0x52f4dc.transaction(_0xcc078b => {
    let _0x4a8c14 = 0;
    for (const _0x328dcf of _0xcc078b) {
      const _0x527d4d = String(_0x328dcf.id || "").trim();
      if (!_0x527d4d) {
        continue;
      }
      _0x5ac53f.run(_0x527d4d, String(_0x354a70), Number(_0x328dcf.ts) || Date.now(), String(_0x328dcf.nickname || ""), String(_0x328dcf.accountId || ""), _0x328dcf.matched === false ? 0 : 1, JSON.stringify(_0x328dcf));
      _0x4a8c14 += 1;
    }
    return _0x4a8c14;
  });
  return _0x321cae(_0x16f250);
}
function deleteMatches(_0x3efb7a, {
  matchIds = [],
  clearAll = false,
  clearMisses = false
} = {}) {
  const _0x5bdcad = getDb();
  if (!_0x5bdcad || !_0x3efb7a) {
    return 0;
  }
  ensureTables(_0x5bdcad);
  const _0x267af9 = String(_0x3efb7a);
  if (clearAll) {
    return _0x5bdcad.prepare("DELETE FROM monitor_task_matches WHERE task_id = ?").run(_0x267af9).changes || 0;
  }
  if (clearMisses) {
    return _0x5bdcad.prepare("DELETE FROM monitor_task_matches WHERE task_id = ? AND matched = 0").run(_0x267af9).changes || 0;
  }
  const _0x35f11c = (Array.isArray(matchIds) ? matchIds : [matchIds]).map(String).filter(Boolean);
  if (!_0x35f11c.length) {
    return 0;
  }
  const _0x4da9ba = _0x5bdcad.prepare("DELETE FROM monitor_task_matches WHERE task_id = ? AND id = ?");
  const _0xa2f44d = _0x5bdcad.transaction(_0x4a3061 => {
    let _0x2e3ef9 = 0;
    for (const _0x3371c9 of _0x4a3061) {
      _0x2e3ef9 += _0x4da9ba.run(_0x267af9, _0x3371c9).changes || 0;
    }
    return _0x2e3ef9;
  });
  return _0xa2f44d(_0x35f11c);
}
function listMatchesPage(_0x565a8e, _0x3e50d0 = {}) {
  const _0x1b55bc = getDb();
  const _0x3f2456 = {
    items: [],
    total: 0,
    counts: {
      all: 0,
      hit: 0,
      miss: 0
    }
  };
  if (!_0x1b55bc || !_0x565a8e) {
    return _0x3f2456;
  }
  ensureTables(_0x1b55bc);
  const _0x198ace = String(_0x565a8e);
  const _0xf6a301 = Math.max(1, Math.min(100, Number(_0x3e50d0.limit) || 20));
  const _0x1fe273 = Math.max(0, Number(_0x3e50d0.offset) || 0);
  const {
    sql: _0x34ea0b,
    params: _0x31b3b0
  } = buildMatchWhere(_0x198ace, _0x3e50d0);
  const _0x40befa = Number(_0x1b55bc.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE " + _0x34ea0b).get(..._0x31b3b0)?.c) || 0;
  const _0x456fe5 = _0x1b55bc.prepare("\n    SELECT id, task_id, ts, matched, raw_data\n    FROM monitor_task_matches\n    WHERE " + _0x34ea0b + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(..._0x31b3b0, _0xf6a301, _0x1fe273);
  const _0x38beb3 = Number(_0x1b55bc.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE task_id = ?").get(_0x198ace)?.c) || 0;
  const _0x3308ea = Number(_0x1b55bc.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches WHERE task_id = ? AND matched != 0").get(_0x198ace)?.c) || 0;
  return {
    items: _0x456fe5.map(parseMatchRow).filter(Boolean),
    total: _0x40befa,
    counts: {
      all: _0x38beb3,
      hit: _0x3308ea,
      miss: Math.max(0, _0x38beb3 - _0x3308ea)
    }
  };
}
function countMatchesByTask() {
  const _0x1442a4 = getDb();
  const _0x38d487 = new Map();
  if (!_0x1442a4) {
    return _0x38d487;
  }
  ensureTables(_0x1442a4);
  const _0x42bc90 = _0x1442a4.prepare("\n    SELECT task_id AS taskId,\n      COUNT(*) AS allCount,\n      SUM(CASE WHEN matched != 0 THEN 1 ELSE 0 END) AS hitCount\n    FROM monitor_task_matches\n    GROUP BY task_id\n  ").all();
  for (const _0x503122 of _0x42bc90) {
    _0x38d487.set(String(_0x503122.taskId), {
      matchCount: Number(_0x503122.allCount) || 0,
      hitCount: Number(_0x503122.hitCount) || 0
    });
  }
  return _0x38d487;
}
function listMatchUserKeys(_0x4ea53e) {
  const _0x139323 = getDb();
  if (!_0x139323 || !_0x4ea53e) {
    return [];
  }
  ensureTables(_0x139323);
  const _0x5b1931 = _0x139323.prepare("\n    SELECT\n      IFNULL(json_extract(raw_data, '$.userUrl'), '') AS userUrl,\n      IFNULL(json_extract(raw_data, '$.secUid'), '') AS secUid,\n      IFNULL(json_extract(raw_data, '$.sec_uid'), '') AS sec_uid,\n      IFNULL(json_extract(raw_data, '$.matchType'), '') AS matchType,\n      matched,\n      IFNULL(json_extract(raw_data, '$.judgeReason'), '') AS judgeReason\n    FROM monitor_task_matches\n    WHERE task_id = ?\n  ").all(String(_0x4ea53e));
  return _0x5b1931;
}
function upsertCycle(_0x44bd47, _0x467ae2 = {}) {
  const _0x36ad86 = getDb();
  if (!_0x36ad86 || !_0x44bd47 || !_0x467ae2?.id) {
    return null;
  }
  ensureTables(_0x36ad86);
  const _0x5202e8 = normalizeMonitorTaskCycle(_0x467ae2);
  _0x36ad86.prepare("\n    INSERT INTO monitor_task_cycles (id, task_id, round, started_at, ended_at, status, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      round = excluded.round,\n      started_at = excluded.started_at,\n      ended_at = excluded.ended_at,\n      status = excluded.status,\n      raw_data = excluded.raw_data\n  ").run(_0x5202e8.id, String(_0x44bd47), _0x5202e8.round, _0x5202e8.startedAt, _0x5202e8.endedAt, _0x5202e8.status, JSON.stringify(_0x5202e8));
  return _0x5202e8;
}
function getCycle(_0x1245da, _0x1707d1) {
  const _0x19f407 = getDb();
  if (!_0x19f407 || !_0x1245da || !_0x1707d1) {
    return null;
  }
  ensureTables(_0x19f407);
  const _0x1151cb = _0x19f407.prepare("SELECT * FROM monitor_task_cycles WHERE task_id = ? AND id = ?").get(String(_0x1245da), String(_0x1707d1));
  return parseCycleRow(_0x1151cb);
}
function listOpenCycles(_0x5267c3) {
  const _0x2e3c6d = getDb();
  if (!_0x2e3c6d || !_0x5267c3) {
    return [];
  }
  ensureTables(_0x2e3c6d);
  return _0x2e3c6d.prepare("\n    SELECT * FROM monitor_task_cycles WHERE task_id = ? AND status = 'running'\n  ").all(String(_0x5267c3)).map(parseCycleRow).filter(Boolean);
}
function maxCycleRound(_0x3c5b6c) {
  const _0x52974d = getDb();
  if (!_0x52974d || !_0x3c5b6c) {
    return 0;
  }
  ensureTables(_0x52974d);
  return Number(_0x52974d.prepare("SELECT MAX(round) AS m FROM monitor_task_cycles WHERE task_id = ?").get(String(_0x3c5b6c))?.m) || 0;
}
function listCyclesPage(_0x2caf42, _0x4232e1 = {}) {
  const _0x2a35b4 = getDb();
  if (!_0x2a35b4 || !_0x2caf42) {
    return {
      items: [],
      total: 0
    };
  }
  ensureTables(_0x2a35b4);
  const _0x225be8 = String(_0x2caf42);
  const _0xb13734 = Math.max(1, Math.min(100, Number(_0x4232e1.limit) || 20));
  const _0x27b0f1 = Math.max(0, Number(_0x4232e1.offset) || 0);
  const _0x2fdfcd = Number(_0x2a35b4.prepare("SELECT COUNT(*) AS c FROM monitor_task_cycles WHERE task_id = ?").get(_0x225be8)?.c) || 0;
  const _0x5d7a6c = _0x2a35b4.prepare("\n    SELECT * FROM monitor_task_cycles\n    WHERE task_id = ?\n    ORDER BY started_at DESC, round DESC\n    LIMIT ? OFFSET ?\n  ").all(_0x225be8, _0xb13734, _0x27b0f1);
  return {
    items: _0x5d7a6c.map(parseCycleRow).filter(Boolean),
    total: _0x2fdfcd
  };
}
function countCyclesByTask() {
  const _0x9ca9c4 = getDb();
  const _0x7c63c1 = new Map();
  if (!_0x9ca9c4) {
    return _0x7c63c1;
  }
  ensureTables(_0x9ca9c4);
  const _0x26fe7a = _0x9ca9c4.prepare("\n    SELECT task_id AS taskId, COUNT(*) AS c FROM monitor_task_cycles GROUP BY task_id\n  ").all();
  for (const _0x799b5e of _0x26fe7a) {
    _0x7c63c1.set(String(_0x799b5e.taskId), Number(_0x799b5e.c) || 0);
  }
  return _0x7c63c1;
}
function deleteCyclesForTask(_0x25642b) {
  const _0x4addc5 = getDb();
  if (!_0x4addc5 || !_0x25642b) {
    return 0;
  }
  ensureTables(_0x4addc5);
  return _0x4addc5.prepare("DELETE FROM monitor_task_cycles WHERE task_id = ?").run(String(_0x25642b)).changes || 0;
}
function parseVideoCommentRow(_0x288950) {
  if (!_0x288950) {
    return null;
  }
  try {
    const _0x47142c = JSON.parse(_0x288950.raw_data || "{}");
    return normalizeMonitorVideoCommentRecord({
      ..._0x47142c,
      id: _0x47142c.id || _0x288950.id,
      ts: _0x47142c.ts || _0x288950.ts,
      accountId: _0x47142c.accountId || _0x288950.account_id,
      videoId: _0x47142c.videoId || _0x288950.video_id,
      status: _0x47142c.status || _0x288950.status
    });
  } catch (_0x5542c1) {
    return null;
  }
}
function appendVideoComments(_0x3cafda, _0x3a9060 = []) {
  const _0x247b02 = getDb();
  if (!_0x247b02 || !_0x3cafda) {
    return 0;
  }
  ensureTables(_0x247b02);
  const _0x4f6854 = (Array.isArray(_0x3a9060) ? _0x3a9060 : [_0x3a9060]).map(normalizeMonitorVideoCommentRecord).filter(_0x33c1d0 => _0x33c1d0 && _0x33c1d0.id);
  if (!_0x4f6854.length) {
    return 0;
  }
  const _0xbc71f = _0x247b02.prepare("\n    INSERT INTO monitor_task_video_comments (id, task_id, ts, account_id, video_id, status, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      account_id = excluded.account_id,\n      video_id = excluded.video_id,\n      status = excluded.status,\n      raw_data = excluded.raw_data\n  ");
  const _0x5a678c = _0x247b02.transaction(_0x1069bb => {
    let _0x830044 = 0;
    for (const _0x5cd506 of _0x1069bb) {
      _0xbc71f.run(_0x5cd506.id, String(_0x3cafda), _0x5cd506.ts, _0x5cd506.accountId, _0x5cd506.videoId, _0x5cd506.status, JSON.stringify(_0x5cd506));
      _0x830044 += 1;
    }
    return _0x830044;
  });
  return _0x5a678c(_0x4f6854);
}
function listVideoCommentsPage(_0x5a34f6, _0x17f862 = {}) {
  const _0x48c00c = getDb();
  if (!_0x48c00c || !_0x5a34f6) {
    return {
      items: [],
      total: 0
    };
  }
  ensureTables(_0x48c00c);
  const _0x2003ee = String(_0x5a34f6);
  const _0xb4726b = Math.max(1, Math.min(100, Number(_0x17f862.limit) || 20));
  const _0x1894a9 = Math.max(0, Number(_0x17f862.offset) || 0);
  const _0x7764e2 = String(_0x17f862.keyword || "").trim();
  const _0x56aa48 = ["task_id = ?"];
  const _0x36ac94 = [_0x2003ee];
  if (_0x7764e2) {
    const _0x25d433 = "%" + escapeLike(_0x7764e2) + "%";
    _0x56aa48.push("(\n      IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR IFNULL(video_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    _0x36ac94.push(_0x25d433, _0x25d433, _0x25d433);
  }
  const _0x52ee4e = _0x56aa48.join(" AND ");
  const _0x5bf7d4 = Number(_0x48c00c.prepare("SELECT COUNT(*) AS c FROM monitor_task_video_comments WHERE " + _0x52ee4e).get(..._0x36ac94)?.c) || 0;
  const _0x46d8a1 = _0x48c00c.prepare("\n    SELECT * FROM monitor_task_video_comments\n    WHERE " + _0x52ee4e + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(..._0x36ac94, _0xb4726b, _0x1894a9);
  return {
    items: _0x46d8a1.map(parseVideoCommentRow).filter(Boolean),
    total: _0x5bf7d4
  };
}
function countVideoCommentsByTask() {
  const _0x32c7e6 = getDb();
  const _0x485b59 = new Map();
  if (!_0x32c7e6) {
    return _0x485b59;
  }
  ensureTables(_0x32c7e6);
  const _0xdf828a = _0x32c7e6.prepare("\n    SELECT task_id AS taskId, COUNT(*) AS c FROM monitor_task_video_comments GROUP BY task_id\n  ").all();
  for (const _0x588f4b of _0xdf828a) {
    _0x485b59.set(String(_0x588f4b.taskId), Number(_0x588f4b.c) || 0);
  }
  return _0x485b59;
}
function deleteVideoCommentsForTask(_0x37c83f) {
  const _0x43f014 = getDb();
  if (!_0x43f014 || !_0x37c83f) {
    return 0;
  }
  ensureTables(_0x43f014);
  return _0x43f014.prepare("DELETE FROM monitor_task_video_comments WHERE task_id = ?").run(String(_0x37c83f)).changes || 0;
}
function deleteAllForTask(_0x41d503) {
  deleteMatches(_0x41d503, {
    clearAll: true
  });
  deleteCyclesForTask(_0x41d503);
  deleteVideoCommentsForTask(_0x41d503);
}
function countSqliteRows() {
  const _0x59d17d = getDb();
  if (!_0x59d17d) {
    return {
      matches: 0,
      cycles: 0
    };
  }
  ensureTables(_0x59d17d);
  return {
    matches: Number(_0x59d17d.prepare("SELECT COUNT(*) AS c FROM monitor_task_matches").get()?.c) || 0,
    cycles: Number(_0x59d17d.prepare("SELECT COUNT(*) AS c FROM monitor_task_cycles").get()?.c) || 0
  };
}
function importTaskDetails(_0x27fa58 = []) {
  let _0xcd057f = 0;
  let _0x3cb0d0 = 0;
  let _0x3f9aae = 0;
  for (const _0x5f400c of Array.isArray(_0x27fa58) ? _0x27fa58 : []) {
    const _0x28314c = String(_0x5f400c?.id || "");
    if (!_0x28314c) {
      continue;
    }
    if (Array.isArray(_0x5f400c.matches) && _0x5f400c.matches.length) {
      _0xcd057f += appendMatches(_0x28314c, _0x5f400c.matches);
    }
    if (Array.isArray(_0x5f400c.cycles) && _0x5f400c.cycles.length) {
      for (const _0x343c97 of _0x5f400c.cycles) {
        if (upsertCycle(_0x28314c, _0x343c97)) {
          _0x3cb0d0 += 1;
        }
      }
    }
    if (Array.isArray(_0x5f400c.videoComments) && _0x5f400c.videoComments.length) {
      _0x3f9aae += appendVideoComments(_0x28314c, _0x5f400c.videoComments);
    }
  }
  return {
    matchCount: _0xcd057f,
    cycleCount: _0x3cb0d0,
    videoCommentCount: _0x3f9aae
  };
}
function runMonitorTaskDetailsSqliteMigrationIfNeeded({
  readTasks: _0x30139d,
  writeTasks: _0x2e1220
} = {}) {
  const _0x253f1b = getDb();
  if (!_0x253f1b || typeof _0x30139d !== "function" || typeof _0x2e1220 !== "function") {
    return {
      ok: false,
      skipped: true
    };
  }
  ensureTables(_0x253f1b);
  const _0x4e4571 = _0x30139d();
  const _0x4e3f32 = (Array.isArray(_0x4e4571) ? _0x4e4571 : []).filter(_0x6df37b => Array.isArray(_0x6df37b?.matches) && _0x6df37b.matches.length > 0 || Array.isArray(_0x6df37b?.cycles) && _0x6df37b.cycles.length > 0 || Array.isArray(_0x6df37b?.videoComments) && _0x6df37b.videoComments.length > 0);
  const _0x4bbef9 = isMigrationDone(_0x253f1b, MIGRATION_ID);
  if (!_0x4e3f32.length) {
    if (!_0x4bbef9) {
      markMigrationDone(_0x253f1b, MIGRATION_ID, {
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
      alreadyDone: _0x4bbef9
    };
  }
  if (_0x4bbef9) {
    const _0x3f33a9 = importTaskDetails(_0x4e3f32);
    _0x2e1220((Array.isArray(_0x4e4571) ? _0x4e4571 : []).map(_0x59c001 => ({
      ..._0x59c001,
      matches: [],
      cycles: [],
      videoComments: []
    })));
    console.log("[Migrate] " + MIGRATION_ID + " 已 done 但 enc 仍有残留，补导入 matches=" + _0x3f33a9.matchCount + " cycles=" + _0x3f33a9.cycleCount + " videoComments=" + (_0x3f33a9.videoCommentCount || 0));
    return {
      ok: true,
      residual: true,
      ..._0x3f33a9
    };
  }
  let _0x350fa9 = {
    backupPath: ""
  };
  try {
    _0x350fa9 = writeJsonBackup(getUserDataPath(), "monitor_task_details", MIGRATION_ID, {
      tasks: _0x4e3f32.map(_0x5f2eaa => ({
        id: _0x5f2eaa.id,
        name: _0x5f2eaa.name,
        matchCount: Array.isArray(_0x5f2eaa.matches) ? _0x5f2eaa.matches.length : 0,
        cycleCount: Array.isArray(_0x5f2eaa.cycles) ? _0x5f2eaa.cycles.length : 0,
        videoCommentCount: Array.isArray(_0x5f2eaa.videoComments) ? _0x5f2eaa.videoComments.length : 0,
        matches: _0x5f2eaa.matches || [],
        cycles: _0x5f2eaa.cycles || [],
        videoComments: _0x5f2eaa.videoComments || []
      }))
    });
    const _0x5d0a69 = importTaskDetails(_0x4e3f32);
    const _0x2363f3 = countSqliteRows();
    if (_0x5d0a69.matchCount < _0x4e3f32.reduce((_0x1f7910, _0x88db28) => _0x1f7910 + (_0x88db28.matches || []).length, 0)) {
      throw new Error("研判明细导入条数少于源数据，中止剥离 enc");
    }
    if (_0x5d0a69.videoCommentCount < _0x4e3f32.reduce((_0x4b373d, _0x46499d) => _0x4b373d + (_0x46499d.videoComments || []).length, 0)) {
      throw new Error("视频主评导入条数少于源数据，中止剥离 enc");
    }
    _0x2e1220((Array.isArray(_0x4e4571) ? _0x4e4571 : []).map(_0x28129d => ({
      ..._0x28129d,
      matches: [],
      cycles: [],
      videoComments: []
    })));
    markMigrationDone(_0x253f1b, MIGRATION_ID, {
      backupPath: _0x350fa9.backupPath,
      stats: {
        importedMatches: _0x5d0a69.matchCount,
        importedCycles: _0x5d0a69.cycleCount,
        importedVideoComments: _0x5d0a69.videoCommentCount,
        sqliteMatches: _0x2363f3.matches,
        sqliteCycles: _0x2363f3.cycles,
        taskCount: _0x4e3f32.length
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + _0x4e3f32.length + " matches=" + _0x5d0a69.matchCount + " cycles=" + _0x5d0a69.cycleCount + " videoComments=" + _0x5d0a69.videoCommentCount);
    return {
      ok: true,
      ..._0x5d0a69,
      backupPath: _0x350fa9.backupPath
    };
  } catch (_0x234d91) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 enc + 备份）:", _0x234d91);
    return {
      ok: false,
      error: _0x234d91.message || String(_0x234d91),
      backupPath: _0x350fa9.backupPath
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
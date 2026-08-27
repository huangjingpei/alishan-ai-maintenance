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
function ensureTables(_0x416b06 = getDb()) {
  if (!_0x416b06) {
    return false;
  }
  _0x416b06.exec("\n    CREATE TABLE IF NOT EXISTS self_warmup_events (\n      id TEXT PRIMARY KEY,\n      task_id TEXT NOT NULL,\n      ts INTEGER NOT NULL,\n      nickname TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      matched INTEGER NOT NULL DEFAULT 1,\n      seen_key TEXT DEFAULT '',\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_ts\n      ON self_warmup_events(task_id, ts DESC);\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_seen\n      ON self_warmup_events(task_id, seen_key);\n    CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_nick\n      ON self_warmup_events(task_id, nickname);\n  ");
  return true;
}
function isReady() {
  const _0x7c672f = getDb();
  if (!_0x7c672f) {
    return false;
  }
  try {
    ensureTables(_0x7c672f);
    return true;
  } catch (_0x1bfaf7) {
    return false;
  }
}
function isMigrationApplied() {
  const _0x5929a4 = getDb();
  if (!_0x5929a4) {
    return false;
  }
  try {
    ensureTables(_0x5929a4);
    return isMigrationDone(_0x5929a4, MIGRATION_ID);
  } catch (_0x577532) {
    return false;
  }
}
function escapeLike(_0x395019) {
  return String(_0x395019 || "").replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function parseEventRow(_0x190b1c) {
  if (!_0x190b1c) {
    return null;
  }
  try {
    const _0x19fdc2 = JSON.parse(_0x190b1c.raw_data || "{}");
    if (!_0x19fdc2 || typeof _0x19fdc2 !== "object") {
      return null;
    }
    if (!_0x19fdc2.id && _0x190b1c.id) {
      _0x19fdc2.id = _0x190b1c.id;
    }
    if (!_0x19fdc2.ts && _0x190b1c.ts) {
      _0x19fdc2.ts = _0x190b1c.ts;
    }
    if (_0x19fdc2.matched === undefined) {
      _0x19fdc2.matched = Number(_0x190b1c.matched) !== 0;
    }
    return _0x19fdc2;
  } catch (_0x28bca9) {
    return null;
  }
}
function trimTaskEvents(_0x5b343e, _0x4f0d93) {
  const _0x386f1e = String(_0x4f0d93);
  const _0x101e3b = _0x5b343e.prepare("\n    SELECT id FROM self_warmup_events\n    WHERE task_id = ?\n    ORDER BY ts DESC, id DESC\n    LIMIT -1 OFFSET ?\n  ").all(_0x386f1e, MAX_EVENT_RECORDS);
  if (!_0x101e3b.length) {
    return;
  }
  const _0x1f05a1 = _0x5b343e.prepare("DELETE FROM self_warmup_events WHERE id = ?");
  const _0xafc134 = _0x5b343e.transaction(_0x4b237c => {
    for (const _0x1aad50 of _0x4b237c) {
      _0x1f05a1.run(_0x1aad50.id);
    }
  });
  _0xafc134(_0x101e3b);
}
function upsertEvents(_0x417e83, _0x59bd0e = [], {
  normalizeEvent: _0x4395b2
} = {}) {
  const _0x45c34e = getDb();
  if (!_0x45c34e || !_0x417e83) {
    return 0;
  }
  ensureTables(_0x45c34e);
  const _0x34bd1b = (Array.isArray(_0x59bd0e) ? _0x59bd0e : [_0x59bd0e]).filter(_0x217294 => _0x217294 && typeof _0x217294 === "object").map(_0x26ecc9 => typeof _0x4395b2 === "function" ? _0x4395b2(_0x26ecc9) : _0x26ecc9);
  if (!_0x34bd1b.length) {
    return 0;
  }
  const _0x5b697a = _0x45c34e.prepare("\n    INSERT INTO self_warmup_events (id, task_id, ts, nickname, account_id, matched, seen_key, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      task_id = excluded.task_id,\n      ts = excluded.ts,\n      nickname = excluded.nickname,\n      account_id = excluded.account_id,\n      matched = excluded.matched,\n      seen_key = excluded.seen_key,\n      raw_data = excluded.raw_data\n  ");
  const _0x300056 = _0x45c34e.prepare("\n    SELECT id FROM self_warmup_events WHERE task_id = ? AND seen_key = ? LIMIT 1\n  ");
  const _0x44d72a = _0x45c34e.transaction(_0x5af433 => {
    let _0x34affc = 0;
    for (const _0x1df15d of _0x5af433) {
      const _0x10e0a3 = buildSelfWarmupEventSeenKey(_0x1df15d);
      let _0x4eba8e = String(_0x1df15d.id || "").trim();
      if (_0x10e0a3) {
        const _0x42fdc9 = _0x300056.get(String(_0x417e83), _0x10e0a3);
        if (_0x42fdc9?.id) {
          _0x4eba8e = _0x42fdc9.id;
        }
      }
      if (!_0x4eba8e) {
        _0x4eba8e = "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      }
      const _0x2444ba = {
        ..._0x1df15d,
        id: _0x4eba8e
      };
      _0x5b697a.run(_0x4eba8e, String(_0x417e83), Number(_0x2444ba.ts) || Date.now(), String(_0x2444ba.nickname || ""), String(_0x2444ba.accountId || ""), _0x2444ba.matched === false ? 0 : 1, _0x10e0a3 || "", JSON.stringify(_0x2444ba));
      _0x34affc += 1;
    }
    return _0x34affc;
  });
  const _0xeb6b03 = _0x44d72a(_0x34bd1b);
  trimTaskEvents(_0x45c34e, _0x417e83);
  return _0xeb6b03;
}
function deleteEvents(_0x10b1a1, {
  eventIds = [],
  clearAll = false
} = {}) {
  const _0x252c5c = getDb();
  if (!_0x252c5c || !_0x10b1a1) {
    return {
      deleted: 0,
      rows: []
    };
  }
  ensureTables(_0x252c5c);
  const _0x2d4265 = String(_0x10b1a1);
  if (clearAll) {
    const _0x1a0fca = _0x252c5c.prepare("SELECT raw_data FROM self_warmup_events WHERE task_id = ?").all(_0x2d4265).map(parseEventRow).filter(Boolean);
    const _0x15a08a = _0x252c5c.prepare("DELETE FROM self_warmup_events WHERE task_id = ?").run(_0x2d4265).changes || 0;
    return {
      deleted: _0x15a08a,
      rows: _0x1a0fca
    };
  }
  const _0x617cea = (Array.isArray(eventIds) ? eventIds : [eventIds]).map(String).filter(Boolean);
  if (!_0x617cea.length) {
    return {
      deleted: 0,
      rows: []
    };
  }
  const _0x219260 = _0x252c5c.prepare("SELECT raw_data FROM self_warmup_events WHERE task_id = ? AND id = ?");
  const _0x211f90 = _0x252c5c.prepare("DELETE FROM self_warmup_events WHERE task_id = ? AND id = ?");
  const _0x40331d = [];
  const _0x533a76 = _0x252c5c.transaction(_0x2b66cf => {
    let _0x11795a = 0;
    for (const _0x20ab5c of _0x2b66cf) {
      const _0x5c0b84 = parseEventRow(_0x219260.get(_0x2d4265, _0x20ab5c));
      if (_0x5c0b84) {
        _0x40331d.push(_0x5c0b84);
      }
      _0x11795a += _0x211f90.run(_0x2d4265, _0x20ab5c).changes || 0;
    }
    return _0x11795a;
  });
  return {
    deleted: _0x533a76(_0x617cea),
    rows: _0x40331d
  };
}
function listEventsPage(_0x5df617, _0x22e24d = {}) {
  const _0x5063d3 = getDb();
  const _0x1e0227 = {
    items: [],
    total: 0,
    counts: {
      all: 0,
      hit: 0,
      miss: 0
    }
  };
  if (!_0x5063d3 || !_0x5df617) {
    return _0x1e0227;
  }
  ensureTables(_0x5063d3);
  const _0x51cdae = String(_0x5df617);
  const _0x4ffb11 = Math.max(1, Math.min(100, Number(_0x22e24d.limit) || 20));
  const _0x3d804b = Math.max(0, Number(_0x22e24d.offset) || 0);
  const _0x14b433 = ["task_id = ?"];
  const _0x4b5698 = [_0x51cdae];
  const _0x2a77d9 = String(_0x22e24d.result || "all");
  if (_0x2a77d9 === "hit") {
    _0x14b433.push("matched != 0");
  }
  if (_0x2a77d9 === "miss") {
    _0x14b433.push("matched = 0");
  }
  const _0x2659ea = String(_0x22e24d.keyword || "").trim();
  if (_0x2659ea) {
    const _0x30b69b = "%" + escapeLike(_0x2659ea) + "%";
    _0x14b433.push("(\n      nickname LIKE ? ESCAPE '\\'\n      OR IFNULL(account_id, '') LIKE ? ESCAPE '\\'\n      OR raw_data LIKE ? ESCAPE '\\'\n    )");
    _0x4b5698.push(_0x30b69b, _0x30b69b, _0x30b69b);
  }
  const _0x5912c2 = _0x14b433.join(" AND ");
  const _0x14ed24 = Number(_0x5063d3.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE " + _0x5912c2).get(..._0x4b5698)?.c) || 0;
  const _0xe2fcfa = _0x5063d3.prepare("\n    SELECT id, task_id, ts, matched, raw_data\n    FROM self_warmup_events\n    WHERE " + _0x5912c2 + "\n    ORDER BY ts DESC, id DESC\n    LIMIT ? OFFSET ?\n  ").all(..._0x4b5698, _0x4ffb11, _0x3d804b);
  const _0x45a9ee = Number(_0x5063d3.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE task_id = ?").get(_0x51cdae)?.c) || 0;
  const _0x2ac226 = Number(_0x5063d3.prepare("SELECT COUNT(*) AS c FROM self_warmup_events WHERE task_id = ? AND matched != 0").get(_0x51cdae)?.c) || 0;
  return {
    items: _0xe2fcfa.map(parseEventRow).filter(Boolean),
    total: _0x14ed24,
    counts: {
      all: _0x45a9ee,
      hit: _0x2ac226,
      miss: Math.max(0, _0x45a9ee - _0x2ac226)
    }
  };
}
function listEventsForUser(_0x251c86, {
  nickname = "",
  userUrl = ""
} = {}) {
  const _0x273c00 = getDb();
  if (!_0x273c00 || !_0x251c86) {
    return [];
  }
  ensureTables(_0x273c00);
  const _0x234189 = String(_0x251c86);
  const _0x595f81 = String(nickname || "").trim().toLowerCase();
  const _0x41b1e2 = String(userUrl || "").trim();
  if (!_0x595f81 && !_0x41b1e2) {
    return [];
  }
  const _0x5b20b1 = ["task_id = ?"];
  const _0x546992 = [_0x234189];
  const _0x5c3e48 = [];
  if (_0x595f81) {
    _0x5c3e48.push("LOWER(IFNULL(nickname, '')) = ?");
    _0x546992.push(_0x595f81);
  }
  if (_0x41b1e2) {
    _0x5c3e48.push("IFNULL(json_extract(raw_data, '$.userUrl'), '') LIKE ? ESCAPE '\\'");
    _0x546992.push("%" + escapeLike(_0x41b1e2.split("?")[0]) + "%");
  }
  _0x5b20b1.push("(" + _0x5c3e48.join(" OR ") + ")");
  const _0x5a0372 = _0x273c00.prepare("\n    SELECT raw_data FROM self_warmup_events\n    WHERE " + _0x5b20b1.join(" AND ") + "\n    ORDER BY ts DESC\n    LIMIT ?\n  ").all(..._0x546992, MAX_EVENT_RECORDS);
  return _0x5a0372.map(parseEventRow).filter(Boolean);
}
function countEventsByTask() {
  const _0x48a2ca = getDb();
  const _0x39c3b4 = new Map();
  if (!_0x48a2ca) {
    return _0x39c3b4;
  }
  ensureTables(_0x48a2ca);
  const _0x224284 = _0x48a2ca.prepare("\n    SELECT task_id AS taskId,\n      COUNT(*) AS allCount,\n      SUM(CASE WHEN matched != 0 THEN 1 ELSE 0 END) AS hitCount\n    FROM self_warmup_events\n    GROUP BY task_id\n  ").all();
  for (const _0x4dbe17 of _0x224284) {
    _0x39c3b4.set(String(_0x4dbe17.taskId), {
      eventCount: Number(_0x4dbe17.allCount) || 0,
      hitCount: Number(_0x4dbe17.hitCount) || 0
    });
  }
  return _0x39c3b4;
}
function deleteAllForTask(_0x2ce626) {
  return deleteEvents(_0x2ce626, {
    clearAll: true
  }).deleted;
}
function countSqliteRows() {
  const _0x51287b = getDb();
  if (!_0x51287b) {
    return 0;
  }
  ensureTables(_0x51287b);
  return Number(_0x51287b.prepare("SELECT COUNT(*) AS c FROM self_warmup_events").get()?.c) || 0;
}
function importTaskEvents(_0x3aef83 = [], {
  normalizeEvent: _0x2d015c
} = {}) {
  let _0x41c148 = 0;
  for (const _0x2e6bc0 of Array.isArray(_0x3aef83) ? _0x3aef83 : []) {
    const _0x5cdacd = String(_0x2e6bc0?.id || "");
    if (!_0x5cdacd || !Array.isArray(_0x2e6bc0.events) || !_0x2e6bc0.events.length) {
      continue;
    }
    _0x41c148 += upsertEvents(_0x5cdacd, _0x2e6bc0.events, {
      normalizeEvent: _0x2d015c
    });
  }
  return _0x41c148;
}
function runSelfWarmupEventsSqliteMigrationIfNeeded({
  readTasks: _0x228685,
  writeTasks: _0x507726,
  normalizeEvent: _0x4eaecf
} = {}) {
  const _0x19edd6 = getDb();
  if (!_0x19edd6 || typeof _0x228685 !== "function" || typeof _0x507726 !== "function") {
    return {
      ok: false,
      skipped: true
    };
  }
  ensureTables(_0x19edd6);
  const _0x37de12 = _0x228685();
  const _0x376c5e = (Array.isArray(_0x37de12) ? _0x37de12 : []).filter(_0xb36334 => Array.isArray(_0xb36334?.events) && _0xb36334.events.length > 0);
  const _0x2212ba = isMigrationDone(_0x19edd6, MIGRATION_ID);
  if (!_0x376c5e.length) {
    if (!_0x2212ba) {
      markMigrationDone(_0x19edd6, MIGRATION_ID, {
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
      alreadyDone: _0x2212ba
    };
  }
  if (_0x2212ba) {
    const _0x47de73 = importTaskEvents(_0x376c5e, {
      normalizeEvent: _0x4eaecf
    });
    _0x507726((Array.isArray(_0x37de12) ? _0x37de12 : []).map(_0x5aa3f7 => ({
      ..._0x5aa3f7,
      events: []
    })));
    console.log("[Migrate] " + MIGRATION_ID + " 已 done 但 enc 仍有残留，补导入 events=" + _0x47de73);
    return {
      ok: true,
      residual: true,
      importedEvents: _0x47de73
    };
  }
  let _0x121904 = {
    backupPath: ""
  };
  try {
    _0x121904 = writeJsonBackup(getUserDataPath(), "self_warmup_events", MIGRATION_ID, {
      tasks: _0x376c5e.map(_0x136f76 => ({
        id: _0x136f76.id,
        name: _0x136f76.name,
        eventCount: Array.isArray(_0x136f76.events) ? _0x136f76.events.length : 0,
        events: _0x136f76.events || []
      }))
    });
    const _0x5bbf71 = importTaskEvents(_0x376c5e, {
      normalizeEvent: _0x4eaecf
    });
    const _0x52562b = _0x376c5e.reduce((_0x147047, _0x468b14) => _0x147047 + (_0x468b14.events || []).length, 0);
    if (_0x5bbf71 < _0x52562b) {
      throw new Error("自动回复明细导入条数少于源数据，中止剥离 enc");
    }
    _0x507726((Array.isArray(_0x37de12) ? _0x37de12 : []).map(_0x5230c9 => ({
      ..._0x5230c9,
      events: []
    })));
    markMigrationDone(_0x19edd6, MIGRATION_ID, {
      backupPath: _0x121904.backupPath,
      stats: {
        importedEvents: _0x5bbf71,
        sqliteEvents: countSqliteRows(),
        taskCount: _0x376c5e.length
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + _0x376c5e.length + " events=" + _0x5bbf71);
    return {
      ok: true,
      importedEvents: _0x5bbf71,
      backupPath: _0x121904.backupPath
    };
  } catch (_0x39f8b6) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 enc + 备份）:", _0x39f8b6);
    return {
      ok: false,
      error: _0x39f8b6.message || String(_0x39f8b6),
      backupPath: _0x121904.backupPath
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
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
function ensureTables(_0xab7a25) {
  if (!_0xab7a25) {
    return;
  }
  _0xab7a25.exec("\n    CREATE TABLE IF NOT EXISTS monitor_task_seen (\n      task_id TEXT PRIMARY KEY,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n  ");
}
function normalizeKeys(_0x3188db) {
  return (Array.isArray(_0x3188db) ? _0x3188db : []).map(_0x5ab267 => String(_0x5ab267 || "").trim()).filter(Boolean).slice(-MAX_KEYS_PER_TASK);
}
function collectLegacyByTask(_0x2ff274) {
  const _0x59260b = new Map();
  if (!_0x2ff274 || typeof _0x2ff274.get !== "function") {
    return _0x59260b;
  }
  const _0x3c1259 = listStoreKeys(_0x2ff274);
  for (const _0x45e032 of _0x3c1259) {
    let _0x20055b = "";
    let _0x327d56 = false;
    if (_0x45e032.startsWith(SEEN_PREFIX)) {
      _0x20055b = _0x45e032.slice(SEEN_PREFIX.length);
    } else if (_0x45e032.startsWith(NOTIFIED_PREFIX)) {
      _0x20055b = _0x45e032.slice(NOTIFIED_PREFIX.length);
      _0x327d56 = true;
    } else {
      continue;
    }
    if (!_0x20055b) {
      continue;
    }
    const _0x5ea6ee = _0x2ff274.get(_0x45e032, []);
    if (!Array.isArray(_0x5ea6ee) || !_0x5ea6ee.length) {
      continue;
    }
    const _0x3830da = _0x59260b.get(_0x20055b) || [];
    if (_0x327d56 && _0x3830da.length) {
      const _0x504c29 = new Set(_0x3830da);
      const _0x293507 = _0x3830da.slice();
      for (const _0x2776a9 of _0x5ea6ee) {
        const _0x3bc459 = String(_0x2776a9 || "").trim();
        if (!_0x3bc459 || _0x504c29.has(_0x3bc459)) {
          continue;
        }
        _0x504c29.add(_0x3bc459);
        _0x293507.push(_0x3bc459);
      }
      _0x59260b.set(_0x20055b, normalizeKeys(_0x293507));
    } else if (!_0x327d56) {
      const _0x554299 = new Set();
      const _0x48ab37 = [];
      for (const _0x37c616 of [..._0x5ea6ee, ...(_0x3830da || [])]) {
        const _0x256a91 = String(_0x37c616 || "").trim();
        if (!_0x256a91 || _0x554299.has(_0x256a91)) {
          continue;
        }
        _0x554299.add(_0x256a91);
        _0x48ab37.push(_0x256a91);
      }
      _0x59260b.set(_0x20055b, normalizeKeys(_0x48ab37));
    } else {
      _0x59260b.set(_0x20055b, normalizeKeys(_0x5ea6ee));
    }
  }
  return _0x59260b;
}
function listLegacyStoreKeys(_0x38b930) {
  return listStoreKeys(_0x38b930).filter(_0x243b99 => _0x243b99.startsWith(SEEN_PREFIX) || _0x243b99.startsWith(NOTIFIED_PREFIX));
}
function getFromDb(_0x1cc848, _0x574dc) {
  ensureTables(_0x1cc848);
  const _0x2f6108 = String(_0x574dc || "").trim();
  if (!_0x2f6108) {
    return [];
  }
  const _0x24d86f = _0x1cc848.prepare("SELECT raw_data FROM monitor_task_seen WHERE task_id = ?").get(_0x2f6108);
  if (!_0x24d86f) {
    return [];
  }
  try {
    const _0xc9feaa = JSON.parse(_0x24d86f.raw_data || "[]");
    if (Array.isArray(_0xc9feaa)) {
      return normalizeKeys(_0xc9feaa);
    } else {
      return [];
    }
  } catch (_0x4545d1) {
    return [];
  }
}
function saveToDb(_0x2c4e1a, _0x4671e0, _0x39fe28) {
  ensureTables(_0x2c4e1a);
  const _0x4f8bc8 = String(_0x4671e0 || "").trim();
  if (!_0x4f8bc8) {
    return false;
  }
  const _0x1291d7 = normalizeKeys(_0x39fe28);
  _0x2c4e1a.prepare("\n    INSERT INTO monitor_task_seen (task_id, updated_at, raw_data)\n    VALUES (?, ?, ?)\n    ON CONFLICT(task_id) DO UPDATE SET\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ").run(_0x4f8bc8, Date.now(), JSON.stringify(_0x1291d7));
  return true;
}
function deleteFromDb(_0x5f0e17, _0x54a28f) {
  ensureTables(_0x5f0e17);
  const _0x148c30 = String(_0x54a28f || "").trim();
  if (!_0x148c30) {
    return;
  }
  _0x5f0e17.prepare("DELETE FROM monitor_task_seen WHERE task_id = ?").run(_0x148c30);
}
function countTasksDb(_0x217bbe) {
  ensureTables(_0x217bbe);
  return Number(_0x217bbe.prepare("SELECT COUNT(*) AS c FROM monitor_task_seen").get()?.c) || 0;
}
function importMapToDb(_0x5c2c4f, _0x555049) {
  ensureTables(_0x5c2c4f);
  const _0x5c3f26 = _0x5c2c4f.prepare("\n    INSERT INTO monitor_task_seen (task_id, updated_at, raw_data)\n    VALUES (?, ?, ?)\n    ON CONFLICT(task_id) DO UPDATE SET\n      updated_at = excluded.updated_at,\n      raw_data = excluded.raw_data\n  ");
  const _0x48c4ff = _0x5c2c4f.prepare("SELECT raw_data FROM monitor_task_seen WHERE task_id = ?");
  const _0xc99bb1 = Date.now();
  let _0x4bc5a1 = 0;
  const _0x384b88 = _0x5c2c4f.transaction(_0x3d1e54 => {
    for (const [_0x47f558, _0x470c50] of _0x3d1e54) {
      const _0x9bded6 = String(_0x47f558 || "").trim();
      if (!_0x9bded6) {
        continue;
      }
      let _0xf73085 = normalizeKeys(_0x470c50);
      const _0x1df076 = _0x48c4ff.get(_0x9bded6);
      if (_0x1df076) {
        try {
          const _0x1a42ac = JSON.parse(_0x1df076.raw_data || "[]");
          if (Array.isArray(_0x1a42ac) && _0x1a42ac.length) {
            const _0x1f599e = new Set();
            const _0x363914 = [];
            for (const _0x3c827d of [..._0x1a42ac, ..._0xf73085]) {
              const _0x31585d = String(_0x3c827d || "").trim();
              if (!_0x31585d || _0x1f599e.has(_0x31585d)) {
                continue;
              }
              _0x1f599e.add(_0x31585d);
              _0x363914.push(_0x31585d);
            }
            _0xf73085 = normalizeKeys(_0x363914);
          }
        } catch (_0xafda74) {}
      }
      _0x5c3f26.run(_0x9bded6, _0xc99bb1, JSON.stringify(_0xf73085));
      _0x4bc5a1 += 1;
    }
  });
  _0x384b88([..._0x555049.entries()]);
  return _0x4bc5a1;
}
function clearLegacyStore(_0x464679) {
  if (!_0x464679) {
    return 0;
  }
  const _0x5d09f6 = listLegacyStoreKeys(_0x464679);
  let _0xa63551 = 0;
  for (const _0x3f87a0 of _0x5d09f6) {
    try {
      if (typeof _0x464679.delete === "function") {
        _0x464679.delete(_0x3f87a0);
      } else {
        _0x464679.set(_0x3f87a0, []);
      }
      _0xa63551 += 1;
    } catch (_0x175bf5) {}
  }
  try {
    _0x464679.set("monitor_task_seen_migrated_at", Date.now());
  } catch (_0x5ee601) {}
  return _0xa63551;
}
function runMonitorTaskSeenSqliteMigrationIfNeeded(_0x192f76) {
  const _0x20eeaf = getDb();
  if (!_0x20eeaf) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(_0x20eeaf);
  const _0x59e13b = collectLegacyByTask(_0x192f76);
  const _0x375d12 = listLegacyStoreKeys(_0x192f76).length;
  const _0x27f99b = isMigrationDone(_0x20eeaf, MIGRATION_ID);
  if (_0x27f99b && _0x59e13b.size === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (_0x27f99b && _0x59e13b.size > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + _0x59e13b.size + " 个任务指纹残留，补导入");
  }
  if (_0x59e13b.size === 0) {
    markMigrationDone(_0x20eeaf, MIGRATION_ID, {
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
  const _0x1fcad4 = {};
  let _0x77bcd0 = 0;
  for (const [_0x565b4a, _0x486dcb] of _0x59e13b.entries()) {
    _0x1fcad4[_0x565b4a] = _0x486dcb;
    _0x77bcd0 += _0x486dcb.length;
  }
  let _0x2ee628 = {
    backupPath: "",
    checksum: ""
  };
  try {
    _0x2ee628 = writeJsonBackup(getUserDataPath(), "monitor_task_seen", MIGRATION_ID, {
      taskCount: _0x59e13b.size,
      totalKeys: _0x77bcd0,
      storeKeyCount: _0x375d12,
      items: _0x1fcad4
    });
    const _0x106f3a = JSON.parse(fs.readFileSync(_0x2ee628.backupPath, "utf8"));
    if (Number(_0x106f3a.taskCount) !== _0x59e13b.size) {
      throw new Error("监控指纹备份任务数不一致");
    }
    console.log("[Migrate] 已备份 monitor_task_seen " + _0x59e13b.size + " 任务 / " + _0x77bcd0 + " 指纹 → " + _0x2ee628.backupPath);
  } catch (_0xec0d42) {
    console.error("[Migrate] monitor_task_seen 备份失败，中止迁移（保留 store）:", _0xec0d42);
    return {
      success: false,
      error: _0xec0d42.message || String(_0xec0d42),
      stage: "backup"
    };
  }
  const _0x23cd6a = countTasksDb(_0x20eeaf);
  try {
    const _0x1422f9 = importMapToDb(_0x20eeaf, _0x59e13b);
    const _0xb49962 = countTasksDb(_0x20eeaf);
    if (_0x1422f9 > 0 && _0xb49962 === 0) {
      throw new Error("校验失败：写入后表为空");
    }
    markMigrationDone(_0x20eeaf, MIGRATION_ID, {
      backupPath: _0x2ee628.backupPath,
      stats: {
        imported: _0x1422f9,
        taskCount: _0x59e13b.size,
        totalKeys: _0x77bcd0,
        storeKeyCount: _0x375d12,
        sqliteCountBefore: _0x23cd6a,
        sqliteCountAfter: _0xb49962,
        checksum: _0x2ee628.checksum,
        residualReimport: _0x27f99b
      }
    });
    const _0x14cee3 = clearLegacyStore(_0x192f76);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: tasks=" + _0x59e13b.size + " keys=" + _0x77bcd0 + " sqlite=" + _0xb49962 + " clearedStoreKeys=" + _0x14cee3);
    return {
      skipped: false,
      imported: _0x1422f9,
      done: true,
      backupPath: _0x2ee628.backupPath,
      sqliteCount: _0xb49962
    };
  } catch (_0x25e41a) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", _0x25e41a);
    return {
      skipped: false,
      error: _0x25e41a.message || String(_0x25e41a),
      stage: "migrate",
      backupPath: _0x2ee628.backupPath
    };
  }
}
function getSeenKeys(_0x5161af, _0x131b3d) {
  const _0x4507ea = getDb();
  if (_0x4507ea) {
    return getFromDb(_0x4507ea, _0x131b3d);
  }
  const _0x493f37 = String(_0x131b3d || "").trim();
  if (!_0x493f37 || !_0x5161af) {
    return [];
  }
  const _0x52b18e = _0x5161af.get("" + SEEN_PREFIX + _0x493f37, null);
  if (Array.isArray(_0x52b18e) && _0x52b18e.length > 0) {
    return normalizeKeys(_0x52b18e);
  }
  const _0x132ebc = _0x5161af.get("" + NOTIFIED_PREFIX + _0x493f37, []);
  if (Array.isArray(_0x132ebc) && _0x132ebc.length > 0) {
    try {
      _0x5161af.set("" + SEEN_PREFIX + _0x493f37, _0x132ebc);
    } catch (_0x22d85c) {}
    return normalizeKeys(_0x132ebc);
  }
  return [];
}
function saveSeenKeys(_0x40444c, _0x5ed911, _0x3cfeff) {
  const _0x32ceda = getDb();
  if (_0x32ceda) {
    return saveToDb(_0x32ceda, _0x5ed911, _0x3cfeff);
  }
  const _0x69d2a4 = String(_0x5ed911 || "").trim();
  if (!_0x69d2a4 || !_0x40444c) {
    return false;
  }
  _0x40444c.set("" + SEEN_PREFIX + _0x69d2a4, normalizeKeys(_0x3cfeff));
  return true;
}
function clearSeenKeys(_0x2b537b, _0x1fa7f3) {
  const _0x46fc3f = getDb();
  const _0x575946 = String(_0x1fa7f3 || "").trim();
  if (!_0x575946) {
    return 0;
  }
  const _0x2f90bb = getSeenKeys(_0x2b537b, _0x575946).length;
  if (_0x46fc3f) {
    deleteFromDb(_0x46fc3f, _0x575946);
  }
  if (_0x2b537b) {
    try {
      if (typeof _0x2b537b.delete === "function") {
        _0x2b537b.delete("" + SEEN_PREFIX + _0x575946);
        _0x2b537b.delete("" + NOTIFIED_PREFIX + _0x575946);
      } else {
        _0x2b537b.set("" + SEEN_PREFIX + _0x575946, []);
        _0x2b537b.set("" + NOTIFIED_PREFIX + _0x575946, []);
      }
    } catch (_0x3f3112) {}
  }
  return _0x2f90bb;
}
function pruneSqlite({
  seenLimit = MAX_KEYS_PER_TASK,
  seenKeyLimit = 40
} = {}) {
  const _0x3b0526 = getDb();
  const _0x1f8d8f = {
    trimmed: 0,
    removed: 0
  };
  if (!_0x3b0526) {
    return _0x1f8d8f;
  }
  ensureTables(_0x3b0526);
  const _0x18e9ce = _0x3b0526.prepare("\n    SELECT task_id, updated_at, raw_data FROM monitor_task_seen\n    ORDER BY updated_at ASC\n  ").all();
  if (_0x18e9ce.length > seenKeyLimit) {
    const _0x34b5a6 = _0x18e9ce.slice(0, _0x18e9ce.length - seenKeyLimit);
    const _0xca3e5c = _0x3b0526.prepare("DELETE FROM monitor_task_seen WHERE task_id = ?");
    const _0xc54802 = _0x3b0526.transaction(_0x51ac21 => {
      for (const _0x2458f7 of _0x51ac21) {
        _0xca3e5c.run(_0x2458f7.task_id);
        _0x1f8d8f.removed += 1;
      }
    });
    _0xc54802(_0x34b5a6);
  }
  const _0x8da8c8 = _0x3b0526.prepare("\n    SELECT task_id, raw_data FROM monitor_task_seen\n  ").all();
  const _0x2c3dc0 = _0x3b0526.prepare("\n    UPDATE monitor_task_seen SET raw_data = ?, updated_at = ? WHERE task_id = ?\n  ");
  const _0x251141 = Date.now();
  for (const _0x54f7b2 of _0x8da8c8) {
    let _0x4deb24 = [];
    try {
      _0x4deb24 = JSON.parse(_0x54f7b2.raw_data || "[]");
    } catch (_0x3a3464) {
      _0x4deb24 = [];
    }
    if (!Array.isArray(_0x4deb24) || _0x4deb24.length <= seenLimit) {
      continue;
    }
    _0x2c3dc0.run(JSON.stringify(_0x4deb24.slice(-seenLimit)), _0x251141, _0x54f7b2.task_id);
    _0x1f8d8f.trimmed += 1;
  }
  return _0x1f8d8f;
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
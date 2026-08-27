'use strict';

const MIGRATION_ID = "leads_sec_uid_backfill_v1";
function ensureSchemaMigrationsTable(_0x525f56) {
  if (!_0x525f56) {
    return;
  }
  _0x525f56.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function isDone(_0x525ebd) {
  try {
    ensureSchemaMigrationsTable(_0x525ebd);
    const _0x2883e9 = _0x525ebd.prepare("SELECT status FROM schema_migrations WHERE id = ?").get(MIGRATION_ID);
    return String(_0x2883e9?.status || "") === "done";
  } catch (_0x5f15c3) {
    return false;
  }
}
function markDone(_0x4797be, _0x1f0ea2 = {}) {
  ensureSchemaMigrationsTable(_0x4797be);
  _0x4797be.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', '', ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), JSON.stringify(_0x1f0ea2));
}
function parseRaw(_0x5ce7c2) {
  try {
    return JSON.parse(_0x5ce7c2.raw_data || "{}");
  } catch (_0x17c486) {
    return {};
  }
}
function runLeadsSecUidBackfillIfNeeded(_0x14fdd2) {
  if (!_0x14fdd2) {
    return {
      skipped: true,
      updated: 0,
      merged: 0
    };
  }
  ensureSchemaMigrationsTable(_0x14fdd2);
  if (isDone(_0x14fdd2)) {
    return {
      skipped: true,
      updated: 0,
      merged: 0
    };
  }
  let _0x40f888;
  try {
    _0x40f888 = require("../shared/leadUserKey");
  } catch (_0x50d2ee) {
    console.error("[Migrate] leads_sec_uid_backfill 无法加载 leadUserKey:", _0x50d2ee.message);
    return {
      skipped: true,
      updated: 0,
      merged: 0,
      error: _0x50d2ee.message
    };
  }
  try {
    const _0x46d888 = _0x14fdd2.prepare("PRAGMA table_info(leads)").all();
    if (!_0x46d888.some(_0x3bd0b => _0x3bd0b.name === "sec_uid")) {
      _0x14fdd2.exec("ALTER TABLE leads ADD COLUMN sec_uid TEXT DEFAULT ''");
    }
  } catch (_0x232564) {
    console.warn("[Migrate] 确保 sec_uid 列失败:", _0x232564.message);
  }
  let _0x5c359d = 0;
  let _0x3827f5 = 0;
  try {
    const _0x45b9f6 = _0x14fdd2.transaction(() => {
      const _0xbb8b71 = _0x14fdd2.prepare("\n        SELECT id, lead_user_id, sec_uid, captured_at, raw_data, lead_kind\n        FROM leads\n        WHERE lead_kind IS NULL OR lead_kind = '' OR (lead_kind != 'video_card' AND lead_kind != 'video')\n      ").all();
      const _0x41506b = new Map();
      for (const _0x5ccd00 of _0xbb8b71) {
        const _0x50e46c = parseRaw(_0x5ccd00);
        if (_0x40f888.isVideoLeadRecord?.(_0x50e46c)) {
          continue;
        }
        const _0x3d8db2 = String(_0x40f888.getPersonLeadSecUid?.(_0x50e46c) || (_0x40f888.isDouyinSecUid?.(_0x5ccd00.id) ? _0x5ccd00.id : "") || (_0x40f888.isDouyinSecUid?.(_0x5ccd00.lead_user_id) ? _0x5ccd00.lead_user_id : "") || (_0x40f888.isDouyinSecUid?.(_0x5ccd00.sec_uid) ? _0x5ccd00.sec_uid : "") || "").trim();
        if (!_0x3d8db2) {
          continue;
        }
        const _0x554a9f = _0x41506b.get(_0x3d8db2);
        if (!_0x554a9f) {
          _0x41506b.set(_0x3d8db2, {
            keepId: _0x5ccd00.id,
            row: _0x5ccd00,
            raw: _0x50e46c
          });
          continue;
        }
        const _0x1a7722 = String(_0x554a9f.raw.content || "").length + String(_0x554a9f.raw.userUrl || "").length;
        const _0x46ac80 = String(_0x50e46c.content || "").length + String(_0x50e46c.userUrl || "").length;
        const _0x2b572f = Number(_0x554a9f.row.captured_at) || 0;
        const _0x5e34de = Number(_0x5ccd00.captured_at) || 0;
        const _0x231588 = _0x46ac80 > _0x1a7722 || _0x46ac80 === _0x1a7722 && _0x5e34de >= _0x2b572f;
        if (_0x231588) {
          _0x40f888.mergeLeadRecords(_0x50e46c, _0x554a9f.raw);
          _0x41506b.set(_0x3d8db2, {
            keepId: _0x5ccd00.id,
            row: _0x5ccd00,
            raw: _0x50e46c
          });
          _0x554a9f._drop = true;
        } else {
          _0x40f888.mergeLeadRecords(_0x554a9f.raw, _0x50e46c);
          _0x554a9f._dropIds = _0x554a9f._dropIds || [];
          _0x554a9f._dropIds.push(_0x5ccd00.id);
        }
      }
      const _0x865884 = _0x14fdd2.prepare("\n        UPDATE leads\n        SET id = ?, lead_user_id = ?, sec_uid = ?, raw_data = ?\n        WHERE id = ?\n      ");
      const _0x4d8bf6 = _0x14fdd2.prepare("DELETE FROM leads WHERE id = ?");
      for (const [_0x1e5b5b, _0x459313] of _0x41506b.entries()) {
        const _0x33c302 = new Set(_0x459313._dropIds || []);
        if (_0x459313.keepId !== _0x1e5b5b) {
          const _0x292592 = _0x14fdd2.prepare("SELECT id FROM leads WHERE id = ?").get(_0x1e5b5b);
          if (_0x292592 && _0x292592.id !== _0x459313.keepId) {
            const _0x1e515c = _0x14fdd2.prepare("SELECT raw_data FROM leads WHERE id = ?").get(_0x1e5b5b);
            if (_0x1e515c) {
              try {
                const _0x32a5ca = JSON.parse(_0x1e515c.raw_data || "{}");
                _0x40f888.mergeLeadRecords(_0x459313.raw, _0x32a5ca);
              } catch (_0x467840) {}
              _0x33c302.add(_0x1e5b5b);
            }
          }
        }
        for (const _0x58aacf of _0x33c302) {
          if (_0x58aacf === _0x459313.keepId) {
            continue;
          }
          _0x4d8bf6.run(_0x58aacf);
          _0x3827f5 += 1;
        }
        _0x459313.raw.secUid = _0x1e5b5b;
        _0x459313.raw.leadId = _0x1e5b5b;
        _0x459313.raw.key = _0x1e5b5b;
        _0x459313.raw.userKey = _0x1e5b5b;
        const _0x36cbfe = JSON.stringify(_0x459313.raw);
        if (_0x459313.keepId === _0x1e5b5b) {
          _0x14fdd2.prepare("UPDATE leads SET lead_user_id = ?, sec_uid = ?, raw_data = ? WHERE id = ?").run(_0x1e5b5b, _0x1e5b5b, _0x36cbfe, _0x1e5b5b);
          _0x5c359d += 1;
        } else {
          try {
            _0x4d8bf6.run(_0x1e5b5b);
          } catch (_0x52b682) {}
          try {
            _0x865884.run(_0x1e5b5b, _0x1e5b5b, _0x1e5b5b, _0x36cbfe, _0x459313.keepId);
            _0x5c359d += 1;
            if (_0x459313.keepId !== _0x1e5b5b) {
              _0x3827f5 += 1;
            }
          } catch (_0x20cfbd) {
            _0x14fdd2.prepare("\n              INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n              )\n              SELECT ?, ?, nickname, video_id, video_title, account_id, content, captured_at, ?,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, ?\n              FROM leads WHERE id = ?\n            ").run(_0x1e5b5b, _0x1e5b5b, _0x36cbfe, _0x1e5b5b, _0x459313.keepId);
            _0x4d8bf6.run(_0x459313.keepId);
            _0x5c359d += 1;
            _0x3827f5 += 1;
          }
        }
      }
      try {
        _0x14fdd2.exec("\n          CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_sec_uid_unique\n          ON leads(sec_uid)\n          WHERE sec_uid IS NOT NULL AND sec_uid != ''\n        ");
      } catch (_0x5a8d69) {
        console.warn("[Migrate] idx_leads_sec_uid_unique 仍失败:", _0x5a8d69.message);
      }
      markDone(_0x14fdd2, {
        updated: _0x5c359d,
        merged: _0x3827f5,
        scanned: _0xbb8b71.length
      });
    });
    _0x45b9f6();
    console.log("[Migrate] leads_sec_uid_backfill_v1 完成: updated=" + _0x5c359d + " merged=" + _0x3827f5);
    return {
      skipped: false,
      updated: _0x5c359d,
      merged: _0x3827f5
    };
  } catch (_0x2e4e5d) {
    console.error("[Migrate] leads_sec_uid_backfill_v1 失败:", _0x2e4e5d);
    return {
      skipped: false,
      updated: _0x5c359d,
      merged: _0x3827f5,
      error: _0x2e4e5d.message || String(_0x2e4e5d)
    };
  }
}
module.exports = {
  MIGRATION_ID: MIGRATION_ID,
  runLeadsSecUidBackfillIfNeeded: runLeadsSecUidBackfillIfNeeded
};
'use strict';

const MIGRATION_ID = "leads_sec_uid_backfill_v1";
function ensureSchemaMigrationsTable(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function isDone(arg1) {
  try {
    ensureSchemaMigrationsTable(arg1);
    const result = arg1.prepare("SELECT status FROM schema_migrations WHERE id = ?").get(MIGRATION_ID);
    return String(result?.status || "") === "done";
  } catch (error) {
    return false;
  }
}
function markDone(arg1, options = {}) {
  ensureSchemaMigrationsTable(arg1);
  arg1.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, 'done', '', ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = 'done',\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), JSON.stringify(options));
}
function parseRaw(arg1) {
  try {
    return JSON.parse(arg1.raw_data || "{}");
  } catch (error) {
    return {};
  }
}
function runLeadsSecUidBackfillIfNeeded(arg1) {
  if (!arg1) {
    return {
      skipped: true,
      updated: 0,
      merged: 0
    };
  }
  ensureSchemaMigrationsTable(arg1);
  if (isDone(arg1)) {
    return {
      skipped: true,
      updated: 0,
      merged: 0
    };
  }
  let local;
  try {
    local = require("../shared/leadUserKey");
  } catch (error) {
    console.error("[Migrate] leads_sec_uid_backfill 无法加载 leadUserKey:", error.message);
    return {
      skipped: true,
      updated: 0,
      merged: 0,
      error: error.message
    };
  }
  try {
    const result = arg1.prepare("PRAGMA table_info(leads)").all();
    if (!result.some(arg1 => arg1.name === "sec_uid")) {
      arg1.exec("ALTER TABLE leads ADD COLUMN sec_uid TEXT DEFAULT ''");
    }
  } catch (error) {
    console.warn("[Migrate] 确保 sec_uid 列失败:", error.message);
  }
  let num = 0;
  let num2 = 0;
  try {
    const result = arg1.transaction(() => {
      const result = arg1.prepare("\n        SELECT id, lead_user_id, sec_uid, captured_at, raw_data, lead_kind\n        FROM leads\n        WHERE lead_kind IS NULL OR lead_kind = '' OR (lead_kind != 'video_card' AND lead_kind != 'video')\n      ").all();
      const map = new Map();
      for (const item of result) {
        const result = parseRaw(item);
        if (local.isVideoLeadRecord?.(result)) {
          continue;
        }
        const result2 = String(local.getPersonLeadSecUid?.(result) || (local.isDouyinSecUid?.(item.id) ? item.id : "") || (local.isDouyinSecUid?.(item.lead_user_id) ? item.lead_user_id : "") || (local.isDouyinSecUid?.(item.sec_uid) ? item.sec_uid : "") || "").trim();
        if (!result2) {
          continue;
        }
        const result3 = map.get(result2);
        if (!result3) {
          map.set(result2, {
            keepId: item.id,
            row: item,
            raw: result
          });
          continue;
        }
        const value = String(result3.raw.content || "").length + String(result3.raw.userUrl || "").length;
        const value2 = String(result.content || "").length + String(result.userUrl || "").length;
        const local2 = Number(result3.row.captured_at) || 0;
        const local3 = Number(item.captured_at) || 0;
        const local4 = value2 > value || value2 === value && local3 >= local2;
        if (local4) {
          local.mergeLeadRecords(result, result3.raw);
          map.set(result2, {
            keepId: item.id,
            row: item,
            raw: result
          });
          result3._drop = true;
        } else {
          local.mergeLeadRecords(result3.raw, result);
          result3._dropIds = result3._dropIds || [];
          result3._dropIds.push(item.id);
        }
      }
      const result2 = arg1.prepare("\n        UPDATE leads\n        SET id = ?, lead_user_id = ?, sec_uid = ?, raw_data = ?\n        WHERE id = ?\n      ");
      const result3 = arg1.prepare("DELETE FROM leads WHERE id = ?");
      for (const [local2, local3] of map.entries()) {
        const set = new Set(local3._dropIds || []);
        if (local3.keepId !== local2) {
          const result = arg1.prepare("SELECT id FROM leads WHERE id = ?").get(local2);
          if (result && result.id !== local3.keepId) {
            const result = arg1.prepare("SELECT raw_data FROM leads WHERE id = ?").get(local2);
            if (result) {
              try {
                const result2 = JSON.parse(result.raw_data || "{}");
                local.mergeLeadRecords(local3.raw, result2);
              } catch (error) {}
              set.add(local2);
            }
          }
        }
        for (const item of set) {
          if (item === local3.keepId) {
            continue;
          }
          result3.run(item);
          num2 += 1;
        }
        local3.raw.secUid = local2;
        local3.raw.leadId = local2;
        local3.raw.key = local2;
        local3.raw.userKey = local2;
        const result = JSON.stringify(local3.raw);
        if (local3.keepId === local2) {
          arg1.prepare("UPDATE leads SET lead_user_id = ?, sec_uid = ?, raw_data = ? WHERE id = ?").run(local2, local2, result, local2);
          num += 1;
        } else {
          try {
            result3.run(local2);
          } catch (error) {}
          try {
            result2.run(local2, local2, local2, result, local3.keepId);
            num += 1;
            if (local3.keepId !== local2) {
              num2 += 1;
            }
          } catch (error) {
            arg1.prepare("\n              INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n              )\n              SELECT ?, ?, nickname, video_id, video_title, account_id, content, captured_at, ?,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, ?\n              FROM leads WHERE id = ?\n            ").run(local2, local2, result, local2, local3.keepId);
            result3.run(local3.keepId);
            num += 1;
            num2 += 1;
          }
        }
      }
      try {
        arg1.exec("\n          CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_sec_uid_unique\n          ON leads(sec_uid)\n          WHERE sec_uid IS NOT NULL AND sec_uid != ''\n        ");
      } catch (error) {
        console.warn("[Migrate] idx_leads_sec_uid_unique 仍失败:", error.message);
      }
      markDone(arg1, {
        updated: num,
        merged: num2,
        scanned: result.length
      });
    });
    result();
    console.log("[Migrate] leads_sec_uid_backfill_v1 完成: updated=" + num + " merged=" + num2);
    return {
      skipped: false,
      updated: num,
      merged: num2
    };
  } catch (error) {
    console.error("[Migrate] leads_sec_uid_backfill_v1 失败:", error);
    return {
      skipped: false,
      updated: num,
      merged: num2,
      error: error.message || String(error)
    };
  }
}
module.exports = {
  MIGRATION_ID: MIGRATION_ID,
  runLeadsSecUidBackfillIfNeeded: runLeadsSecUidBackfillIfNeeded
};
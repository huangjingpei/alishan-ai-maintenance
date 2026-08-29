'use strict';

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const collectedVideosStore = require("./collectedVideosStore");
const collectedAuthorsStore = require("./collectedAuthorsStore");
const {
  splitVideoCardIntoCollectedRecords,
  wantsCollectedVideo,
  wantsCollectedAuthor
} = require("../shared/collectedLeadKeys");
const MIGRATION_ID = "leads_split_collected_v1";
function ensureSchemaMigrationsTable(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(arg1, arg2 = MIGRATION_ID) {
  if (!arg1) {
    return null;
  }
  ensureSchemaMigrationsTable(arg1);
  try {
    return arg1.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(arg2) || null;
  } catch (error) {
    return null;
  }
}
function isSplitMigrationDone(arg1) {
  const result = getMigrationRow(arg1);
  return String(result?.status || "") === "done";
}
function upsertMigrationRow(arg1, {
  status: status,
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(arg1);
  arg1.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = excluded.status,\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), String(status || "done"), String(backupPath || ""), JSON.stringify(stats || {}));
}
function isVideoCardRow(arg1, text = "") {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  try {
    const leadUserKey = require("../shared/leadUserKey");
    if (leadUserKey.isVideoLeadRecord(arg1)) {
      return true;
    }
  } catch (error) {}
  if (arg1.leadKind === "video_card" || arg1.sourceType === "video" || arg1.identityType === "video") {
    return true;
  }
  const result = String(arg1.leadId || arg1.userKey || arg1.key || text || "").trim();
  return /^video:\d{10,}$/.test(result);
}
function listLegacyVideoCardLeads(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    const result = arg1.prepare("\n      SELECT id, captured_at, raw_data FROM leads\n      WHERE lead_kind = 'video_card'\n         OR lead_kind = 'video'\n         OR id LIKE 'video:%'\n         OR lead_user_id LIKE 'video:%'\n      ORDER BY captured_at DESC\n    ").all();
    const list = [];
    const set = new Set();
    for (const item of result) {
      let local = null;
      try {
        local = JSON.parse(item.raw_data || "{}");
      } catch (error) {
        local = null;
      }
      if (!local || !isVideoCardRow(local, item.id)) {
        continue;
      }
      const result = String(local.leadId || local.key || item.id || "");
      if (!result || set.has(result)) {
        continue;
      }
      set.add(result);
      list.push({
        ...local,
        leadId: local.leadId || result,
        key: local.key || result,
        _rowId: item.id,
        timestamp: local.timestamp || item.captured_at
      });
    }
    return list;
  } catch (error) {
    console.error("[Migrate] listLegacyVideoCardLeads 失败:", error);
    return [];
  }
}
function checksumPayload(arg1) {
  return crypto.createHash("sha256").update(JSON.stringify(arg1)).digest("hex");
}
function writeBackup(arg1, arg2) {
  const result = path.join(arg1, "backups");
  fs.mkdirSync(result, {
    recursive: true
  });
  const result2 = Date.now();
  const result3 = path.join(result, "leads_video_cards_" + result2 + ".json");
  const value = result3 + ".meta.json";
  const obj = {
    version: 1,
    migrationId: MIGRATION_ID,
    exportedAt: result2,
    count: arg2.length,
    items: arg2.map(arg1 => {
      const {
        _rowId: rowId,
        ...local
      } = arg1;
      return {
        ...local,
        _rowId: rowId
      };
    })
  };
  const result4 = checksumPayload(obj.items);
  obj.checksum = result4;
  fs.writeFileSync(result3, JSON.stringify(obj), "utf8");
  const result5 = JSON.parse(fs.readFileSync(result3, "utf8"));
  if (!Array.isArray(result5.items) || result5.items.length !== arg2.length) {
    throw new Error("备份文件读回条数不一致");
  }
  if (checksumPayload(result5.items) !== result4) {
    throw new Error("备份文件 checksum 校验失败");
  }
  const obj2 = {
    migrationId: MIGRATION_ID,
    exportedAt: result2,
    count: arg2.length,
    checksum: result4,
    backupPath: result3
  };
  fs.writeFileSync(value, JSON.stringify(obj2, null, 2), "utf8");
  return {
    backupPath: result3,
    metaPath: value,
    checksum: result4,
    count: arg2.length
  };
}
function expandCollectedFromCards(arg1) {
  const list = [];
  const list2 = [];
  const set = new Set();
  const set2 = new Set();
  for (const item of arg1) {
    const {
      video: video,
      author: author
    } = splitVideoCardIntoCollectedRecords(item);
    if (video && !set.has(video.id)) {
      set.add(video.id);
      list.push(video);
    } else if (video && wantsCollectedVideo(item)) {}
    if (author && !set2.has(author.id)) {
      set2.add(author.id);
      list2.push(author);
    }
  }
  return {
    videos: list,
    authors: list2,
    expectedVideoIds: set,
    expectedAuthorIds: set2
  };
}
function runLeadsCollectedSplitMigrationIfNeeded(arg1, arg2) {
  if (!arg1 || !arg2) {
    return {
      skipped: true,
      reason: "no_db_or_path"
    };
  }
  ensureSchemaMigrationsTable(arg1);
  collectedVideosStore.ensureTables(arg1);
  collectedAuthorsStore.ensureTables(arg1);
  const result = listLegacyVideoCardLeads(arg1);
  if (isSplitMigrationDone(arg1)) {
    if (!result.length) {
      return {
        skipped: true,
        reason: "already_done"
      };
    }
    const result2 = getMigrationRow(arg1);
    let obj = {};
    try {
      obj = JSON.parse(result2?.stats_json || "{}");
    } catch (error) {
      obj = {};
    }
    console.warn("[Migrate] leads_split 已 done 但仍有 " + result.length + " 条 video_card 残留" + ((obj.empty ? "（此前空库提前标 done，多见于 enc→SQLite 之后）" : "") + "，继续迁出"));
  }
  if (!result.length) {
    upsertMigrationRow(arg1, {
      status: "done",
      backupPath: "",
      stats: {
        videoCards: 0,
        videos: 0,
        authors: 0,
        empty: true
      }
    });
    console.log("[Migrate] leads_split_collected_v1: 无需迁出 video_card，已标记 done");
    return {
      skipped: false,
      empty: true,
      done: true
    };
  }
  let local;
  try {
    local = writeBackup(arg2, result);
    console.log("[Migrate] 已备份 " + local.count + " 条 video_card → " + local.backupPath);
  } catch (error) {
    console.error("[Migrate] 备份失败，中止迁移:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "backup"
    };
  }
  const {
    videos: videos,
    authors: authors,
    expectedVideoIds: expectedVideoIds,
    expectedAuthorIds: expectedAuthorIds
  } = expandCollectedFromCards(result);
  const list = [...new Set(result.map(arg1 => String(arg1._rowId || arg1.leadId || arg1.key || "")).filter(Boolean))];
  try {
    const result2 = arg1.transaction(() => {
      collectedVideosStore.upsertBatchRecords(arg1, videos);
      collectedAuthorsStore.upsertBatchRecords(arg1, authors);
      const result2 = collectedVideosStore.count(arg1);
      const result3 = collectedAuthorsStore.count(arg1);
      const result4 = collectedVideosStore.listIds(arg1);
      const result5 = collectedAuthorsStore.listIds(arg1);
      for (const item of expectedVideoIds) {
        if (!result4.has(item)) {
          throw new Error("校验失败：缺少 collected_videos " + item);
        }
      }
      for (const item of expectedAuthorIds) {
        if (!result5.has(item)) {
          throw new Error("校验失败：缺少 collected_authors " + item);
        }
      }
      const result6 = arg1.prepare("DELETE FROM leads WHERE id = ?");
      for (const item of list) {
        result6.run(item);
      }
      upsertMigrationRow(arg1, {
        status: "done",
        backupPath: local.backupPath,
        stats: {
          videoCards: result.length,
          videos: expectedVideoIds.size,
          authors: expectedAuthorIds.size,
          deletedLeadRows: list.length,
          videoTableCount: result2,
          authorTableCount: result3,
          checksum: local.checksum
        }
      });
    });
    result2();
    console.log("[Migrate] leads_split_collected_v1 完成: cards=" + result.length + " videos=" + expectedVideoIds.size + " authors=" + expectedAuthorIds.size);
    return {
      success: true,
      done: true,
      backupPath: local.backupPath,
      videos: expectedVideoIds.size,
      authors: expectedAuthorIds.size,
      deleted: list.length
    };
  } catch (error) {
    console.error("[Migrate] leads_split_collected_v1 失败（已 ROLLBACK，源 leads 保留）:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "migrate",
      backupPath: local?.backupPath || ""
    };
  }
}
function findLatestBackup(arg1) {
  const result = path.join(arg1, "backups");
  if (!fs.existsSync(result)) {
    return "";
  }
  const result2 = fs.readdirSync(result).filter(arg1 => /^leads_video_cards_\d+\.json$/.test(arg1)).map(arg1 => ({
    f: arg1,
    mtime: fs.statSync(path.join(result, arg1)).mtimeMs
  })).sort((arg1, arg2) => arg2.mtime - arg1.mtime);
  if (result2[0]) {
    return path.join(result, result2[0].f);
  } else {
    return "";
  }
}
function restoreLeadsCollectedSplitFromBackup(arg1, arg2, text = "") {
  if (!arg1 || !arg2) {
    return {
      success: false,
      error: "no_db_or_path"
    };
  }
  ensureSchemaMigrationsTable(arg1);
  const local = text || getMigrationRow(arg1)?.backup_path || findLatestBackup(arg2);
  if (!local || !fs.existsSync(local)) {
    return {
      success: false,
      error: "backup_not_found"
    };
  }
  let local2;
  try {
    local2 = JSON.parse(fs.readFileSync(local, "utf8"));
  } catch (error) {
    return {
      success: false,
      error: "backup_parse_failed: " + (error.message || error)
    };
  }
  const value = Array.isArray(local2.items) ? local2.items : [];
  if (local2.checksum && checksumPayload(value) !== local2.checksum) {
    return {
      success: false,
      error: "backup_checksum_mismatch"
    };
  }
  const {
    videos: videos,
    authors: authors,
    expectedVideoIds: expectedVideoIds,
    expectedAuthorIds: expectedAuthorIds
  } = expandCollectedFromCards(value);
  try {
    const result = arg1.transaction(() => {
      collectedVideosStore.deleteByKeys(arg1, [...expectedVideoIds]);
      collectedAuthorsStore.deleteByKeys(arg1, [...expectedAuthorIds]);
      const result = arg1.prepare("\n        INSERT INTO leads (\n          id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n          is_high_intention, lead_kind, entry_source, search_keyword, account_name, location\n        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ON CONFLICT(id) DO UPDATE SET\n          lead_user_id = excluded.lead_user_id,\n          nickname = excluded.nickname,\n          video_id = excluded.video_id,\n          video_title = excluded.video_title,\n          account_id = excluded.account_id,\n          content = excluded.content,\n          captured_at = excluded.captured_at,\n          raw_data = excluded.raw_data,\n          is_high_intention = excluded.is_high_intention,\n          lead_kind = excluded.lead_kind,\n          entry_source = excluded.entry_source,\n          search_keyword = excluded.search_keyword,\n          account_name = excluded.account_name,\n          location = excluded.location\n      ");
      for (const item of value) {
        const {
          _rowId: rowId,
          ...local
        } = item;
        const result2 = String(rowId || local.leadId || local.key || "").trim();
        if (!result2) {
          continue;
        }
        const local2 = Number(local.timestamp || local.captured_at || Date.now()) || Date.now();
        const obj = {
          ...local
        };
        delete obj._rowId;
        result.run(result2, String(local.leadId || local.userKey || result2).slice(0, 200), String(local.nickname || "").slice(0, 200), String(local.videoId || (String(result2).startsWith("video:") ? result2.slice(6) : "") || "").slice(0, 80), String(local.title || local.videoTitle || "").slice(0, 300), String(local.accountId || "").slice(0, 120), String(local.content || "").slice(0, 2000), local2, JSON.stringify(obj), local.isHighIntention ? 1 : 0, "video_card", String(local.entrySource || "").slice(0, 80), String(local.searchKeyword || "").slice(0, 200), String(local.accountName || "").slice(0, 200), String(local.location || "").slice(0, 200));
      }
      upsertMigrationRow(arg1, {
        status: "rolled_back",
        backupPath: local,
        stats: {
          restored: value.length,
          clearedVideos: expectedVideoIds.size,
          clearedAuthors: expectedAuthorIds.size
        }
      });
    });
    result();
    console.log("[Migrate] 已从备份还原 " + value.length + " 条 video_card: " + local);
    return {
      success: true,
      restored: value.length,
      backupPath: local
    };
  } catch (error) {
    console.error("[Migrate] 还原失败:", error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}
module.exports = {
  MIGRATION_ID: MIGRATION_ID,
  ensureSchemaMigrationsTable: ensureSchemaMigrationsTable,
  isSplitMigrationDone: isSplitMigrationDone,
  getMigrationRow: getMigrationRow,
  listLegacyVideoCardLeads: listLegacyVideoCardLeads,
  runLeadsCollectedSplitMigrationIfNeeded: runLeadsCollectedSplitMigrationIfNeeded,
  restoreLeadsCollectedSplitFromBackup: restoreLeadsCollectedSplitFromBackup,
  wantsCollectedVideo: wantsCollectedVideo,
  wantsCollectedAuthor: wantsCollectedAuthor
};
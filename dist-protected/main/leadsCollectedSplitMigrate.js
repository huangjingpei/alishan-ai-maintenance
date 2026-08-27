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
function ensureSchemaMigrationsTable(_0x517d6a) {
  if (!_0x517d6a) {
    return;
  }
  _0x517d6a.exec("\n    CREATE TABLE IF NOT EXISTS schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL,\n      status TEXT NOT NULL DEFAULT 'done',\n      backup_path TEXT DEFAULT '',\n      stats_json TEXT DEFAULT '{}'\n    );\n  ");
}
function getMigrationRow(_0x3640e0, _0xbe025f = MIGRATION_ID) {
  if (!_0x3640e0) {
    return null;
  }
  ensureSchemaMigrationsTable(_0x3640e0);
  try {
    return _0x3640e0.prepare("SELECT * FROM schema_migrations WHERE id = ?").get(_0xbe025f) || null;
  } catch (_0x319921) {
    return null;
  }
}
function isSplitMigrationDone(_0x37c9e6) {
  const _0x1546d6 = getMigrationRow(_0x37c9e6);
  return String(_0x1546d6?.status || "") === "done";
}
function upsertMigrationRow(_0x4efd1e, {
  status: _0xdea34,
  backupPath = "",
  stats = {}
} = {}) {
  ensureSchemaMigrationsTable(_0x4efd1e);
  _0x4efd1e.prepare("\n    INSERT INTO schema_migrations (id, applied_at, status, backup_path, stats_json)\n    VALUES (?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      applied_at = excluded.applied_at,\n      status = excluded.status,\n      backup_path = excluded.backup_path,\n      stats_json = excluded.stats_json\n  ").run(MIGRATION_ID, Date.now(), String(_0xdea34 || "done"), String(backupPath || ""), JSON.stringify(stats || {}));
}
function isVideoCardRow(_0x198ec5, _0x259832 = "") {
  if (!_0x198ec5 || typeof _0x198ec5 !== "object") {
    return false;
  }
  try {
    const _0x2b2d02 = require("../shared/leadUserKey");
    if (_0x2b2d02.isVideoLeadRecord(_0x198ec5)) {
      return true;
    }
  } catch (_0x5976a0) {}
  if (_0x198ec5.leadKind === "video_card" || _0x198ec5.sourceType === "video" || _0x198ec5.identityType === "video") {
    return true;
  }
  const _0x5b04fc = String(_0x198ec5.leadId || _0x198ec5.userKey || _0x198ec5.key || _0x259832 || "").trim();
  return /^video:\d{10,}$/.test(_0x5b04fc);
}
function listLegacyVideoCardLeads(_0x40fb9f) {
  if (!_0x40fb9f) {
    return [];
  }
  try {
    const _0x46d5bb = _0x40fb9f.prepare("\n      SELECT id, captured_at, raw_data FROM leads\n      WHERE lead_kind = 'video_card'\n         OR lead_kind = 'video'\n         OR id LIKE 'video:%'\n         OR lead_user_id LIKE 'video:%'\n      ORDER BY captured_at DESC\n    ").all();
    const _0x37ff7a = [];
    const _0x34fc3e = new Set();
    for (const _0x1f826e of _0x46d5bb) {
      let _0x53e21f = null;
      try {
        _0x53e21f = JSON.parse(_0x1f826e.raw_data || "{}");
      } catch (_0x3f5308) {
        _0x53e21f = null;
      }
      if (!_0x53e21f || !isVideoCardRow(_0x53e21f, _0x1f826e.id)) {
        continue;
      }
      const _0x2ab779 = String(_0x53e21f.leadId || _0x53e21f.key || _0x1f826e.id || "");
      if (!_0x2ab779 || _0x34fc3e.has(_0x2ab779)) {
        continue;
      }
      _0x34fc3e.add(_0x2ab779);
      _0x37ff7a.push({
        ..._0x53e21f,
        leadId: _0x53e21f.leadId || _0x2ab779,
        key: _0x53e21f.key || _0x2ab779,
        _rowId: _0x1f826e.id,
        timestamp: _0x53e21f.timestamp || _0x1f826e.captured_at
      });
    }
    return _0x37ff7a;
  } catch (_0x14b53c) {
    console.error("[Migrate] listLegacyVideoCardLeads 失败:", _0x14b53c);
    return [];
  }
}
function checksumPayload(_0x169abf) {
  return crypto.createHash("sha256").update(JSON.stringify(_0x169abf)).digest("hex");
}
function writeBackup(_0x24733e, _0x509b66) {
  const _0x2bf651 = path.join(_0x24733e, "backups");
  fs.mkdirSync(_0x2bf651, {
    recursive: true
  });
  const _0x14acac = Date.now();
  const _0x444fcd = path.join(_0x2bf651, "leads_video_cards_" + _0x14acac + ".json");
  const _0x128058 = _0x444fcd + ".meta.json";
  const _0x57866d = {
    version: 1,
    migrationId: MIGRATION_ID,
    exportedAt: _0x14acac,
    count: _0x509b66.length,
    items: _0x509b66.map(_0x51fde7 => {
      const {
        _rowId: _0x133925,
        ..._0x3df334
      } = _0x51fde7;
      return {
        ..._0x3df334,
        _rowId: _0x133925
      };
    })
  };
  const _0x523b5f = checksumPayload(_0x57866d.items);
  _0x57866d.checksum = _0x523b5f;
  fs.writeFileSync(_0x444fcd, JSON.stringify(_0x57866d), "utf8");
  const _0x1c7b1f = JSON.parse(fs.readFileSync(_0x444fcd, "utf8"));
  if (!Array.isArray(_0x1c7b1f.items) || _0x1c7b1f.items.length !== _0x509b66.length) {
    throw new Error("备份文件读回条数不一致");
  }
  if (checksumPayload(_0x1c7b1f.items) !== _0x523b5f) {
    throw new Error("备份文件 checksum 校验失败");
  }
  const _0x4de074 = {
    migrationId: MIGRATION_ID,
    exportedAt: _0x14acac,
    count: _0x509b66.length,
    checksum: _0x523b5f,
    backupPath: _0x444fcd
  };
  fs.writeFileSync(_0x128058, JSON.stringify(_0x4de074, null, 2), "utf8");
  return {
    backupPath: _0x444fcd,
    metaPath: _0x128058,
    checksum: _0x523b5f,
    count: _0x509b66.length
  };
}
function expandCollectedFromCards(_0x36c39d) {
  const _0x3d3944 = [];
  const _0x2c30a9 = [];
  const _0x231811 = new Set();
  const _0x488234 = new Set();
  for (const _0x44c255 of _0x36c39d) {
    const {
      video: _0x16c1c1,
      author: _0x1daef2
    } = splitVideoCardIntoCollectedRecords(_0x44c255);
    if (_0x16c1c1 && !_0x231811.has(_0x16c1c1.id)) {
      _0x231811.add(_0x16c1c1.id);
      _0x3d3944.push(_0x16c1c1);
    } else if (_0x16c1c1 && wantsCollectedVideo(_0x44c255)) {}
    if (_0x1daef2 && !_0x488234.has(_0x1daef2.id)) {
      _0x488234.add(_0x1daef2.id);
      _0x2c30a9.push(_0x1daef2);
    }
  }
  return {
    videos: _0x3d3944,
    authors: _0x2c30a9,
    expectedVideoIds: _0x231811,
    expectedAuthorIds: _0x488234
  };
}
function runLeadsCollectedSplitMigrationIfNeeded(_0x1b10e1, _0x46d85c) {
  if (!_0x1b10e1 || !_0x46d85c) {
    return {
      skipped: true,
      reason: "no_db_or_path"
    };
  }
  ensureSchemaMigrationsTable(_0x1b10e1);
  collectedVideosStore.ensureTables(_0x1b10e1);
  collectedAuthorsStore.ensureTables(_0x1b10e1);
  const _0x4ac872 = listLegacyVideoCardLeads(_0x1b10e1);
  if (isSplitMigrationDone(_0x1b10e1)) {
    if (!_0x4ac872.length) {
      return {
        skipped: true,
        reason: "already_done"
      };
    }
    const _0x41e5af = getMigrationRow(_0x1b10e1);
    let _0x196607 = {};
    try {
      _0x196607 = JSON.parse(_0x41e5af?.stats_json || "{}");
    } catch (_0x18fb54) {
      _0x196607 = {};
    }
    console.warn("[Migrate] leads_split 已 done 但仍有 " + _0x4ac872.length + " 条 video_card 残留" + ((_0x196607.empty ? "（此前空库提前标 done，多见于 enc→SQLite 之后）" : "") + "，继续迁出"));
  }
  if (!_0x4ac872.length) {
    upsertMigrationRow(_0x1b10e1, {
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
  let _0x329f5e;
  try {
    _0x329f5e = writeBackup(_0x46d85c, _0x4ac872);
    console.log("[Migrate] 已备份 " + _0x329f5e.count + " 条 video_card → " + _0x329f5e.backupPath);
  } catch (_0x948aab) {
    console.error("[Migrate] 备份失败，中止迁移:", _0x948aab);
    return {
      success: false,
      error: _0x948aab.message || String(_0x948aab),
      stage: "backup"
    };
  }
  const {
    videos: _0x59f7c8,
    authors: _0x512f24,
    expectedVideoIds: _0x42727e,
    expectedAuthorIds: _0xf68a8a
  } = expandCollectedFromCards(_0x4ac872);
  const _0x448af0 = [...new Set(_0x4ac872.map(_0x2ec7d3 => String(_0x2ec7d3._rowId || _0x2ec7d3.leadId || _0x2ec7d3.key || "")).filter(Boolean))];
  try {
    const _0x257709 = _0x1b10e1.transaction(() => {
      collectedVideosStore.upsertBatchRecords(_0x1b10e1, _0x59f7c8);
      collectedAuthorsStore.upsertBatchRecords(_0x1b10e1, _0x512f24);
      const _0x45e057 = collectedVideosStore.count(_0x1b10e1);
      const _0x5669fb = collectedAuthorsStore.count(_0x1b10e1);
      const _0xe83e95 = collectedVideosStore.listIds(_0x1b10e1);
      const _0x21a6e4 = collectedAuthorsStore.listIds(_0x1b10e1);
      for (const _0x29ca89 of _0x42727e) {
        if (!_0xe83e95.has(_0x29ca89)) {
          throw new Error("校验失败：缺少 collected_videos " + _0x29ca89);
        }
      }
      for (const _0x1f9fb2 of _0xf68a8a) {
        if (!_0x21a6e4.has(_0x1f9fb2)) {
          throw new Error("校验失败：缺少 collected_authors " + _0x1f9fb2);
        }
      }
      const _0x285f86 = _0x1b10e1.prepare("DELETE FROM leads WHERE id = ?");
      for (const _0x347be2 of _0x448af0) {
        _0x285f86.run(_0x347be2);
      }
      upsertMigrationRow(_0x1b10e1, {
        status: "done",
        backupPath: _0x329f5e.backupPath,
        stats: {
          videoCards: _0x4ac872.length,
          videos: _0x42727e.size,
          authors: _0xf68a8a.size,
          deletedLeadRows: _0x448af0.length,
          videoTableCount: _0x45e057,
          authorTableCount: _0x5669fb,
          checksum: _0x329f5e.checksum
        }
      });
    });
    _0x257709();
    console.log("[Migrate] leads_split_collected_v1 完成: cards=" + _0x4ac872.length + " videos=" + _0x42727e.size + " authors=" + _0xf68a8a.size);
    return {
      success: true,
      done: true,
      backupPath: _0x329f5e.backupPath,
      videos: _0x42727e.size,
      authors: _0xf68a8a.size,
      deleted: _0x448af0.length
    };
  } catch (_0x5a4154) {
    console.error("[Migrate] leads_split_collected_v1 失败（已 ROLLBACK，源 leads 保留）:", _0x5a4154);
    return {
      success: false,
      error: _0x5a4154.message || String(_0x5a4154),
      stage: "migrate",
      backupPath: _0x329f5e?.backupPath || ""
    };
  }
}
function findLatestBackup(_0x56adfe) {
  const _0x4270eb = path.join(_0x56adfe, "backups");
  if (!fs.existsSync(_0x4270eb)) {
    return "";
  }
  const _0x46ab94 = fs.readdirSync(_0x4270eb).filter(_0x47f2a4 => /^leads_video_cards_\d+\.json$/.test(_0x47f2a4)).map(_0x20d6bf => ({
    f: _0x20d6bf,
    mtime: fs.statSync(path.join(_0x4270eb, _0x20d6bf)).mtimeMs
  })).sort((_0x1e7aef, _0x1a3d78) => _0x1a3d78.mtime - _0x1e7aef.mtime);
  if (_0x46ab94[0]) {
    return path.join(_0x4270eb, _0x46ab94[0].f);
  } else {
    return "";
  }
}
function restoreLeadsCollectedSplitFromBackup(_0x334888, _0xdc477c, _0xd28967 = "") {
  if (!_0x334888 || !_0xdc477c) {
    return {
      success: false,
      error: "no_db_or_path"
    };
  }
  ensureSchemaMigrationsTable(_0x334888);
  const _0x4bddf4 = _0xd28967 || getMigrationRow(_0x334888)?.backup_path || findLatestBackup(_0xdc477c);
  if (!_0x4bddf4 || !fs.existsSync(_0x4bddf4)) {
    return {
      success: false,
      error: "backup_not_found"
    };
  }
  let _0x57473b;
  try {
    _0x57473b = JSON.parse(fs.readFileSync(_0x4bddf4, "utf8"));
  } catch (_0x5842ea) {
    return {
      success: false,
      error: "backup_parse_failed: " + (_0x5842ea.message || _0x5842ea)
    };
  }
  const _0x32c81c = Array.isArray(_0x57473b.items) ? _0x57473b.items : [];
  if (_0x57473b.checksum && checksumPayload(_0x32c81c) !== _0x57473b.checksum) {
    return {
      success: false,
      error: "backup_checksum_mismatch"
    };
  }
  const {
    videos: _0x4c798f,
    authors: _0x2f5e89,
    expectedVideoIds: _0x17bb57,
    expectedAuthorIds: _0x47b308
  } = expandCollectedFromCards(_0x32c81c);
  try {
    const _0x3fe29a = _0x334888.transaction(() => {
      collectedVideosStore.deleteByKeys(_0x334888, [..._0x17bb57]);
      collectedAuthorsStore.deleteByKeys(_0x334888, [..._0x47b308]);
      const _0x2df4de = _0x334888.prepare("\n        INSERT INTO leads (\n          id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n          is_high_intention, lead_kind, entry_source, search_keyword, account_name, location\n        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ON CONFLICT(id) DO UPDATE SET\n          lead_user_id = excluded.lead_user_id,\n          nickname = excluded.nickname,\n          video_id = excluded.video_id,\n          video_title = excluded.video_title,\n          account_id = excluded.account_id,\n          content = excluded.content,\n          captured_at = excluded.captured_at,\n          raw_data = excluded.raw_data,\n          is_high_intention = excluded.is_high_intention,\n          lead_kind = excluded.lead_kind,\n          entry_source = excluded.entry_source,\n          search_keyword = excluded.search_keyword,\n          account_name = excluded.account_name,\n          location = excluded.location\n      ");
      for (const _0xc07df2 of _0x32c81c) {
        const {
          _rowId: _0x4f4f46,
          ..._0x333132
        } = _0xc07df2;
        const _0x5a38c8 = String(_0x4f4f46 || _0x333132.leadId || _0x333132.key || "").trim();
        if (!_0x5a38c8) {
          continue;
        }
        const _0x2eaada = Number(_0x333132.timestamp || _0x333132.captured_at || Date.now()) || Date.now();
        const _0x161b1c = {
          ..._0x333132
        };
        delete _0x161b1c._rowId;
        _0x2df4de.run(_0x5a38c8, String(_0x333132.leadId || _0x333132.userKey || _0x5a38c8).slice(0, 200), String(_0x333132.nickname || "").slice(0, 200), String(_0x333132.videoId || (String(_0x5a38c8).startsWith("video:") ? _0x5a38c8.slice(6) : "") || "").slice(0, 80), String(_0x333132.title || _0x333132.videoTitle || "").slice(0, 300), String(_0x333132.accountId || "").slice(0, 120), String(_0x333132.content || "").slice(0, 2000), _0x2eaada, JSON.stringify(_0x161b1c), _0x333132.isHighIntention ? 1 : 0, "video_card", String(_0x333132.entrySource || "").slice(0, 80), String(_0x333132.searchKeyword || "").slice(0, 200), String(_0x333132.accountName || "").slice(0, 200), String(_0x333132.location || "").slice(0, 200));
      }
      upsertMigrationRow(_0x334888, {
        status: "rolled_back",
        backupPath: _0x4bddf4,
        stats: {
          restored: _0x32c81c.length,
          clearedVideos: _0x17bb57.size,
          clearedAuthors: _0x47b308.size
        }
      });
    });
    _0x3fe29a();
    console.log("[Migrate] 已从备份还原 " + _0x32c81c.length + " 条 video_card: " + _0x4bddf4);
    return {
      success: true,
      restored: _0x32c81c.length,
      backupPath: _0x4bddf4
    };
  } catch (_0x489678) {
    console.error("[Migrate] 还原失败:", _0x489678);
    return {
      success: false,
      error: _0x489678.message || String(_0x489678)
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
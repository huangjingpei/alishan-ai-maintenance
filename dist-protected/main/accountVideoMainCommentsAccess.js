'use strict';

const fs = require("fs");
const {
  extractDouyinVideoId,
  normalizeProcessedVideoKey,
  processedVideoKeysMatch
} = require("../shared/processedVideoKey");
const {
  getDb,
  getUserDataPath,
  isMigrationDone,
  markMigrationDone,
  writeJsonBackup
} = require("./schemaMigrationUtils");
const STORE_KEY = "account_video_main_comments";
const MIGRATION_ID = "account_video_main_comments_sqlite_v1";
const MAX_ROWS_STORE_FALLBACK = 5000;
function ensureTables(_0x535166) {
  if (!_0x535166) {
    return;
  }
  _0x535166.exec("\n    CREATE TABLE IF NOT EXISTS account_video_main_comments (\n      account_id TEXT NOT NULL,\n      video_id TEXT NOT NULL,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL,\n      PRIMARY KEY (account_id, video_id)\n    );\n    CREATE INDEX IF NOT EXISTS idx_avmc_account_updated\n      ON account_video_main_comments(account_id, updated_at DESC);\n  ");
}
function collectLegacy(_0x1c02d9) {
  if (!_0x1c02d9 || typeof _0x1c02d9.get !== "function") {
    return [];
  }
  const _0x47b1bd = _0x1c02d9.get(STORE_KEY, []);
  if (Array.isArray(_0x47b1bd)) {
    return _0x47b1bd.filter(_0x451c9a => _0x451c9a && typeof _0x451c9a === "object");
  } else {
    return [];
  }
}
function parseRow(_0x19d8c2) {
  if (!_0x19d8c2) {
    return null;
  }
  try {
    const _0x3f58ca = JSON.parse(_0x19d8c2.raw_data || "{}");
    if (!_0x3f58ca.accountId && _0x19d8c2.account_id) {
      _0x3f58ca.accountId = _0x19d8c2.account_id;
    }
    if (!_0x3f58ca.videoId && _0x19d8c2.video_id) {
      _0x3f58ca.videoId = _0x19d8c2.video_id;
    }
    if (!_0x3f58ca.timestamp && _0x19d8c2.updated_at) {
      _0x3f58ca.timestamp = _0x19d8c2.updated_at;
    }
    return _0x3f58ca;
  } catch (_0x33f0ca) {
    return null;
  }
}
function toPayload(_0x14f013 = {}) {
  const _0x2401a9 = String(_0x14f013.accountId || _0x14f013.account_id || "default").trim() || "default";
  let _0x3214f8 = String(_0x14f013.videoId || _0x14f013.video_id || "").trim();
  if (!_0x3214f8) {
    _0x3214f8 = extractDouyinVideoId(_0x14f013.url || "") || "";
  }
  if (!_0x3214f8) {
    return null;
  }
  const _0x260ea2 = Number(_0x14f013.timestamp || _0x14f013.updated_at || Date.now()) || Date.now();
  const _0xefe1e5 = String(_0x14f013.content || _0x14f013.comment || _0x14f013.commentText || "").trim();
  const _0x43094 = {
    ..._0x14f013,
    accountId: _0x2401a9,
    videoId: _0x3214f8,
    url: normalizeProcessedVideoKey(_0x14f013.url || "") || _0x14f013.url || "",
    title: _0x14f013.title || "",
    platform: _0x14f013.platform || "douyin",
    content: _0xefe1e5,
    timestamp: _0x260ea2
  };
  return {
    accountId: _0x2401a9,
    videoId: _0x3214f8,
    updatedAt: _0x260ea2,
    raw: _0x43094
  };
}
function listAllFromDb(_0x4bd115) {
  ensureTables(_0x4bd115);
  return _0x4bd115.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    ORDER BY updated_at DESC\n  ").all().map(parseRow).filter(Boolean);
}
function listByAccountFromDb(_0x62a036, _0x4883bc) {
  ensureTables(_0x62a036);
  const _0x1e2fae = String(_0x4883bc || "default").trim() || "default";
  return _0x62a036.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    WHERE account_id = ?\n    ORDER BY updated_at DESC\n  ").all(_0x1e2fae).map(parseRow).filter(Boolean);
}
function findOneFromDb(_0x46394d, _0x55fa0b, _0x5bda7c) {
  ensureTables(_0x46394d);
  const _0x5d5e89 = String(_0x55fa0b || "default").trim() || "default";
  const _0x1529ef = String(_0x5bda7c || "").trim();
  if (!_0x1529ef) {
    return null;
  }
  const _0x39e74b = _0x46394d.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    WHERE account_id = ? AND video_id = ?\n  ").get(_0x5d5e89, _0x1529ef);
  return parseRow(_0x39e74b);
}
function listVideoIdsByAccountFromDb(_0x2fff89, _0x23237a) {
  ensureTables(_0x2fff89);
  const _0x877c34 = String(_0x23237a || "default").trim() || "default";
  return _0x2fff89.prepare("\n    SELECT video_id FROM account_video_main_comments WHERE account_id = ?\n  ").all(_0x877c34).map(_0xfe4007 => String(_0xfe4007.video_id || "").trim()).filter(Boolean);
}
function queryPageFromDb(_0x53de7d, _0x3c8a9d = {}) {
  ensureTables(_0x53de7d);
  const _0x367655 = Math.max(0, Number(_0x3c8a9d.offset) || 0);
  const _0x438dfe = Math.max(1, Math.min(500, Number(_0x3c8a9d.limit) || 20));
  const _0x33b045 = String(_0x3c8a9d.accountId || "").trim();
  const _0x400adf = String(_0x3c8a9d.keyword || "").trim();
  const _0x2c4b6c = [];
  const _0x448d5a = [];
  if (_0x33b045) {
    _0x2c4b6c.push("account_id = ?");
    _0x448d5a.push(_0x33b045);
  }
  if (_0x400adf) {
    const _0x6d756c = "%" + _0x400adf + "%";
    _0x2c4b6c.push("(\n      video_id LIKE ?\n      OR account_id LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.title'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.url'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.content'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.comment'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.accountName'), '') LIKE ?\n    )");
    _0x448d5a.push(_0x6d756c, _0x6d756c, _0x6d756c, _0x6d756c, _0x6d756c, _0x6d756c, _0x6d756c);
  }
  const _0x47292c = _0x2c4b6c.length ? "WHERE " + _0x2c4b6c.join(" AND ") : "";
  const _0x3d2a11 = Number(_0x53de7d.prepare("SELECT COUNT(*) AS c FROM account_video_main_comments " + _0x47292c).get(..._0x448d5a)?.c) || 0;
  const _0x31cadb = _0x53de7d.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    " + _0x47292c + "\n    ORDER BY updated_at DESC\n    LIMIT ? OFFSET ?\n  ").all(..._0x448d5a, _0x438dfe, _0x367655);
  return {
    items: _0x31cadb.map(parseRow).filter(Boolean),
    total: _0x3d2a11
  };
}
function countDb(_0x2a8f03) {
  ensureTables(_0x2a8f03);
  return Number(_0x2a8f03.prepare("SELECT COUNT(*) AS c FROM account_video_main_comments").get()?.c) || 0;
}
function upsertManyDb(_0x5900b1, _0x32f0ae) {
  ensureTables(_0x5900b1);
  const _0x30a4fe = _0x5900b1.prepare("\n    INSERT INTO account_video_main_comments (account_id, video_id, updated_at, raw_data)\n    VALUES (?, ?, ?, ?)\n    ON CONFLICT(account_id, video_id) DO UPDATE SET\n      updated_at = CASE\n        WHEN excluded.updated_at >= account_video_main_comments.updated_at THEN excluded.updated_at\n        ELSE account_video_main_comments.updated_at\n      END,\n      raw_data = CASE\n        WHEN excluded.updated_at >= account_video_main_comments.updated_at THEN excluded.raw_data\n        ELSE account_video_main_comments.raw_data\n      END\n  ");
  let _0xd053e2 = 0;
  const _0x4b9458 = _0x5900b1.transaction(_0xc48338 => {
    for (const _0x4b92d0 of _0xc48338) {
      const _0x3ad963 = toPayload(_0x4b92d0);
      if (!_0x3ad963) {
        continue;
      }
      _0x30a4fe.run(_0x3ad963.accountId, _0x3ad963.videoId, _0x3ad963.updatedAt, JSON.stringify(_0x3ad963.raw));
      _0xd053e2 += 1;
    }
  });
  _0x4b9458(Array.isArray(_0x32f0ae) ? _0x32f0ae : []);
  return _0xd053e2;
}
function clearLegacyStore(_0x5c4c66) {
  if (!_0x5c4c66) {
    return;
  }
  try {
    _0x5c4c66.set(STORE_KEY, []);
    _0x5c4c66.set(STORE_KEY + "_migrated_at", Date.now());
  } catch (_0x5770ad) {}
}
function runAccountVideoMainCommentsSqliteMigrationIfNeeded(_0x30d884) {
  const _0x5276eb = getDb();
  if (!_0x5276eb) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(_0x5276eb);
  const _0x35dffa = collectLegacy(_0x30d884);
  const _0x586fb9 = isMigrationDone(_0x5276eb, MIGRATION_ID);
  if (_0x586fb9 && _0x35dffa.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (_0x586fb9 && _0x35dffa.length > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + _0x35dffa.length + " 条残留，补导入");
  }
  if (!_0x35dffa.length) {
    markMigrationDone(_0x5276eb, MIGRATION_ID, {
      stats: {
        imported: 0,
        storeCount: 0,
        empty: true
      }
    });
    console.log("[Migrate] " + MIGRATION_ID + ": store 无数据，已标记 done");
    return {
      skipped: false,
      empty: true,
      done: true
    };
  }
  let _0xd7e40d = {
    backupPath: "",
    checksum: ""
  };
  try {
    _0xd7e40d = writeJsonBackup(getUserDataPath(), "account_video_main_comments", MIGRATION_ID, {
      count: _0x35dffa.length,
      items: _0x35dffa
    });
    const _0xcc812b = JSON.parse(fs.readFileSync(_0xd7e40d.backupPath, "utf8"));
    if (!Array.isArray(_0xcc812b.items) || _0xcc812b.items.length !== _0x35dffa.length) {
      throw new Error("视频主评备份读回条数不一致");
    }
    console.log("[Migrate] 已备份 " + _0x35dffa.length + " 条 account_video_main_comments → " + _0xd7e40d.backupPath);
  } catch (_0x2aded6) {
    console.error("[Migrate] account_video_main_comments 备份失败，中止迁移（保留 store）:", _0x2aded6);
    return {
      success: false,
      error: _0x2aded6.message || String(_0x2aded6),
      stage: "backup"
    };
  }
  const _0x503b05 = countDb(_0x5276eb);
  try {
    const _0x32b395 = upsertManyDb(_0x5276eb, _0x35dffa);
    const _0xddebbb = countDb(_0x5276eb);
    const _0x4397ee = _0x35dffa.filter(_0x12e7ef => !!toPayload(_0x12e7ef)).length;
    if (_0x4397ee > 0 && _0x32b395 === 0 && _0xddebbb === _0x503b05) {
      throw new Error("校验失败：可解析 " + _0x4397ee + " 条但写入 0");
    }
    markMigrationDone(_0x5276eb, MIGRATION_ID, {
      backupPath: _0xd7e40d.backupPath,
      stats: {
        imported: _0x32b395,
        storeCount: _0x35dffa.length,
        resolvable: _0x4397ee,
        sqliteCountBefore: _0x503b05,
        sqliteCountAfter: _0xddebbb,
        checksum: _0xd7e40d.checksum,
        residualReimport: _0x586fb9
      }
    });
    clearLegacyStore(_0x30d884);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: store=" + _0x35dffa.length + " imported=" + _0x32b395 + " sqlite=" + _0xddebbb);
    return {
      skipped: false,
      imported: _0x32b395,
      done: true,
      backupPath: _0xd7e40d.backupPath,
      sqliteCount: _0xddebbb
    };
  } catch (_0x3d1f49) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", _0x3d1f49);
    return {
      skipped: false,
      error: _0x3d1f49.message || String(_0x3d1f49),
      stage: "migrate",
      backupPath: _0xd7e40d.backupPath
    };
  }
}
function listByAccount(_0x3ae6a5, _0x1b9fa1) {
  const _0x3300de = getDb();
  const _0xca31c0 = _0x1b9fa1 || "default";
  if (_0x3300de) {
    return listByAccountFromDb(_0x3300de, _0xca31c0);
  }
  return collectLegacy(_0x3ae6a5).filter(_0x37113c => String(_0x37113c.accountId || "default") === String(_0xca31c0));
}
function record(_0x3ab46f, _0x25f39d, {
  url: _0x5d7e46,
  title: _0x356460,
  platform: _0x31bd5a,
  content: _0x252676,
  comment: _0x12175a
} = {}) {
  const _0x557722 = extractDouyinVideoId(_0x5d7e46 || "");
  if (!_0x557722) {
    return false;
  }
  const _0x356a4f = _0x25f39d || "default";
  const _0x2ca1ef = String(_0x252676 || _0x12175a || "").trim();
  const _0x609458 = {
    accountId: _0x356a4f,
    videoId: _0x557722,
    url: normalizeProcessedVideoKey(_0x5d7e46) || _0x5d7e46,
    title: _0x356460 || "",
    platform: _0x31bd5a || "douyin",
    content: _0x2ca1ef,
    timestamp: Date.now()
  };
  const _0x474569 = getDb();
  if (_0x474569) {
    const _0x455d49 = findOneFromDb(_0x474569, _0x356a4f, _0x557722) || (_0x5d7e46 ? listByAccountFromDb(_0x474569, _0x356a4f).find(_0x30f6c4 => processedVideoKeysMatch(_0x30f6c4.url, _0x5d7e46)) : null);
    if (_0x455d49) {
      if (_0x2ca1ef && !String(_0x455d49.content || _0x455d49.comment || "").trim()) {
        upsertManyDb(_0x474569, [{
          ..._0x455d49,
          ..._0x609458,
          timestamp: _0x455d49.timestamp || _0x609458.timestamp
        }]);
      }
      return true;
    }
    upsertManyDb(_0x474569, [_0x609458]);
    return true;
  }
  if (!_0x3ab46f) {
    return false;
  }
  let _0x2bfaed = collectLegacy(_0x3ab46f);
  const _0xf90722 = _0x2bfaed.findIndex(_0x5982f9 => _0x5982f9.accountId === _0x356a4f && (_0x5982f9.videoId === _0x557722 || processedVideoKeysMatch(_0x5982f9.url, _0x5d7e46)));
  if (_0xf90722 >= 0) {
    if (_0x2ca1ef && !String(_0x2bfaed[_0xf90722].content || _0x2bfaed[_0xf90722].comment || "").trim()) {
      _0x2bfaed[_0xf90722] = {
        ..._0x2bfaed[_0xf90722],
        content: _0x2ca1ef
      };
      _0x3ab46f.set(STORE_KEY, _0x2bfaed);
    }
    return true;
  }
  _0x2bfaed.unshift(_0x609458);
  if (_0x2bfaed.length > MAX_ROWS_STORE_FALLBACK) {
    _0x2bfaed = _0x2bfaed.slice(0, MAX_ROWS_STORE_FALLBACK);
  }
  _0x3ab46f.set(STORE_KEY, _0x2bfaed);
  return true;
}
function listAll(_0x5efa4a) {
  const _0x10cfb4 = getDb();
  if (_0x10cfb4) {
    return listAllFromDb(_0x10cfb4);
  }
  return collectLegacy(_0x5efa4a);
}
function findOne(_0x3cf037, _0x17218a, _0x1885fc) {
  const _0x4f1e0b = getDb();
  const _0x17c34a = _0x17218a || "default";
  const _0x40aa66 = String(_0x1885fc || "").trim();
  if (_0x4f1e0b) {
    return findOneFromDb(_0x4f1e0b, _0x17c34a, _0x40aa66);
  }
  return collectLegacy(_0x3cf037).find(_0x2a772f => String(_0x2a772f.accountId || "default") === String(_0x17c34a) && String(_0x2a772f.videoId || "") === _0x40aa66) || null;
}
function listVideoIdsByAccount(_0x545a81, _0x2d927f) {
  const _0x6aa23c = getDb();
  const _0x2b7755 = _0x2d927f || "default";
  if (_0x6aa23c) {
    return listVideoIdsByAccountFromDb(_0x6aa23c, _0x2b7755);
  }
  return collectLegacy(_0x545a81).filter(_0x57b706 => String(_0x57b706.accountId || "default") === String(_0x2b7755)).map(_0x2f9af8 => String(_0x2f9af8.videoId || "").trim()).filter(Boolean);
}
function queryPage(_0x3063ca, _0x4648b7 = {}) {
  const _0x6590a7 = Math.max(1, Number(_0x4648b7.page) || Number(_0x4648b7.current) || 1);
  const _0xc65630 = Math.max(1, Math.min(500, Number(_0x4648b7.pageSize) || Number(_0x4648b7.limit) || 20));
  const _0x14b851 = (_0x6590a7 - 1) * _0xc65630;
  const _0x1b18e5 = String(_0x4648b7.accountId || "").trim();
  const _0x17c8c4 = String(_0x4648b7.keyword || "").trim();
  const _0x1f18f3 = getDb();
  if (_0x1f18f3) {
    const _0x1c98d4 = queryPageFromDb(_0x1f18f3, {
      offset: _0x14b851,
      limit: _0xc65630,
      accountId: _0x1b18e5,
      keyword: _0x17c8c4
    });
    return {
      ..._0x1c98d4,
      page: _0x6590a7,
      pageSize: _0xc65630
    };
  }
  let _0x404329 = collectLegacy(_0x3063ca);
  if (_0x1b18e5) {
    _0x404329 = _0x404329.filter(_0x5c7d6c => String(_0x5c7d6c.accountId || "default") === _0x1b18e5);
  }
  if (_0x17c8c4) {
    const _0x41af06 = _0x17c8c4.toLowerCase();
    _0x404329 = _0x404329.filter(_0x9e13af => [_0x9e13af.title, _0x9e13af.url, _0x9e13af.videoId, _0x9e13af.accountId, _0x9e13af.accountName, _0x9e13af.content, _0x9e13af.comment].some(_0x2fe0c => String(_0x2fe0c || "").toLowerCase().includes(_0x41af06)));
  }
  _0x404329.sort((_0x407b99, _0x3b48d6) => (Number(_0x3b48d6.timestamp) || 0) - (Number(_0x407b99.timestamp) || 0));
  const _0xbb118 = _0x404329.length;
  return {
    items: _0x404329.slice(_0x14b851, _0x14b851 + _0xc65630),
    total: _0xbb118,
    page: _0x6590a7,
    pageSize: _0xc65630
  };
}
function removeMany(_0x55e20c, _0x49cc99) {
  const _0x2e0d9f = Array.isArray(_0x49cc99) ? _0x49cc99 : [_0x49cc99];
  const _0x1f1234 = [];
  for (const _0x5d3a09 of _0x2e0d9f) {
    if (typeof _0x5d3a09 === "string" && _0x5d3a09.includes("::")) {
      const [_0x5d9139, _0x7bfcd2] = _0x5d3a09.split("::");
      if (_0x5d9139 && _0x7bfcd2) {
        _0x1f1234.push({
          accountId: _0x5d9139,
          videoId: _0x7bfcd2
        });
      }
      continue;
    }
    if (_0x5d3a09 && typeof _0x5d3a09 === "object") {
      const _0xdbf805 = String(_0x5d3a09.accountId || "default").trim() || "default";
      let _0x336d73 = String(_0x5d3a09.videoId || "").trim();
      if (!_0x336d73) {
        _0x336d73 = extractDouyinVideoId(_0x5d3a09.url || "") || "";
      }
      if (_0xdbf805 && _0x336d73) {
        _0x1f1234.push({
          accountId: _0xdbf805,
          videoId: _0x336d73
        });
      }
    }
  }
  if (!_0x1f1234.length) {
    return 0;
  }
  const _0x5b0470 = getDb();
  if (_0x5b0470) {
    ensureTables(_0x5b0470);
    const _0x10eef2 = _0x5b0470.prepare("DELETE FROM account_video_main_comments WHERE account_id = ? AND video_id = ?");
    let _0x4ce350 = 0;
    const _0x1c191f = _0x5b0470.transaction(_0x516b5f => {
      for (const _0x1076a2 of _0x516b5f) {
        const _0x2fcb17 = _0x10eef2.run(_0x1076a2.accountId, _0x1076a2.videoId);
        _0x4ce350 += Number(_0x2fcb17?.changes) || 0;
      }
    });
    _0x1c191f(_0x1f1234);
    return _0x4ce350;
  }
  if (!_0x55e20c) {
    return 0;
  }
  const _0x5ab906 = collectLegacy(_0x55e20c);
  const _0x27ba92 = new Set(_0x1f1234.map(_0x38ad88 => _0x38ad88.accountId + "::" + _0x38ad88.videoId));
  const _0x403d14 = _0x5ab906.filter(_0x12e783 => {
    const _0x22346e = String(_0x12e783.accountId || "default");
    const _0x3d6d79 = String(_0x12e783.videoId || extractDouyinVideoId(_0x12e783.url || "") || "");
    return !_0x27ba92.has(_0x22346e + "::" + _0x3d6d79);
  });
  const _0x2cbe2c = _0x5ab906.length - _0x403d14.length;
  if (_0x2cbe2c > 0) {
    _0x55e20c.set(STORE_KEY, _0x403d14);
  }
  return _0x2cbe2c;
}
function clearAll(_0x5c9a1c) {
  const _0x58b8dd = getDb();
  if (_0x58b8dd) {
    ensureTables(_0x58b8dd);
    const _0x206c58 = countDb(_0x58b8dd);
    _0x58b8dd.prepare("DELETE FROM account_video_main_comments").run();
    return _0x206c58;
  }
  const _0x24c896 = collectLegacy(_0x5c9a1c).length;
  clearLegacyStore(_0x5c9a1c);
  return _0x24c896;
}
module.exports = {
  STORE_KEY: STORE_KEY,
  MIGRATION_ID: MIGRATION_ID,
  MAX_ROWS_STORE_FALLBACK: MAX_ROWS_STORE_FALLBACK,
  ensureTables: ensureTables,
  collectLegacy: collectLegacy,
  runAccountVideoMainCommentsSqliteMigrationIfNeeded: runAccountVideoMainCommentsSqliteMigrationIfNeeded,
  listByAccount: listByAccount,
  listVideoIdsByAccount: listVideoIdsByAccount,
  findOne: findOne,
  listAll: listAll,
  queryPage: queryPage,
  record: record,
  removeMany: removeMany,
  clearAll: clearAll
};
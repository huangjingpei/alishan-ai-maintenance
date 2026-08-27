'use strict';

const {
  splitVideoCardIntoCollectedRecords,
  toCollectedAuthorKey,
  extractAuthorSecUid,
  normalizeAuthorProfileUrl,
  authorRowToLibraryItem
} = require("../shared/collectedLeadKeys");
function ensureTables(_0x36719a) {
  if (!_0x36719a) {
    return;
  }
  _0x36719a.exec("\n    CREATE TABLE IF NOT EXISTS collected_authors (\n      id TEXT PRIMARY KEY,\n      sec_uid TEXT NOT NULL UNIQUE,\n      profile_url TEXT NOT NULL,\n      nickname TEXT DEFAULT '',\n      source_video_id TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      account_name TEXT DEFAULT '',\n      entry_source TEXT DEFAULT '',\n      search_keyword TEXT DEFAULT '',\n      captured_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_collected_authors_captured ON collected_authors(captured_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_collected_authors_account ON collected_authors(account_id);\n  ");
}
function upsertOne(_0x20fad8, _0x3964a1) {
  if (!_0x20fad8 || !_0x3964a1) {
    return false;
  }
  const _0x3f1550 = String(_0x3964a1.secUid || extractAuthorSecUid(_0x3964a1.id || _0x3964a1.profileUrl || "") || "").trim();
  if (!_0x3f1550) {
    return false;
  }
  const _0x2b6a3c = String(_0x3964a1.id || "author:" + _0x3f1550).trim();
  const _0x58ff03 = String(_0x3964a1.profileUrl || normalizeAuthorProfileUrl(_0x3f1550)).trim();
  const _0x1fe0ba = Number(_0x3964a1.capturedAt) || Date.now();
  const _0x52d029 = JSON.stringify(_0x3964a1.raw || _0x3964a1);
  _0x20fad8.prepare("\n    INSERT INTO collected_authors (\n      id, sec_uid, profile_url, nickname, source_video_id,\n      account_id, account_name, entry_source, search_keyword, captured_at, raw_data\n    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      sec_uid = excluded.sec_uid,\n      profile_url = excluded.profile_url,\n      nickname = CASE WHEN excluded.nickname != '' THEN excluded.nickname ELSE collected_authors.nickname END,\n      source_video_id = CASE WHEN excluded.source_video_id != '' THEN excluded.source_video_id ELSE collected_authors.source_video_id END,\n      account_id = CASE WHEN excluded.account_id != '' THEN excluded.account_id ELSE collected_authors.account_id END,\n      account_name = CASE WHEN excluded.account_name != '' THEN excluded.account_name ELSE collected_authors.account_name END,\n      entry_source = CASE WHEN excluded.entry_source != '' THEN excluded.entry_source ELSE collected_authors.entry_source END,\n      search_keyword = CASE WHEN excluded.search_keyword != '' THEN excluded.search_keyword ELSE collected_authors.search_keyword END,\n      captured_at = CASE WHEN excluded.captured_at >= collected_authors.captured_at THEN excluded.captured_at ELSE collected_authors.captured_at END,\n      raw_data = excluded.raw_data\n  ").run(_0x2b6a3c, _0x3f1550, _0x58ff03, String(_0x3964a1.nickname || "").slice(0, 200), String(_0x3964a1.sourceVideoId || "").slice(0, 80), String(_0x3964a1.accountId || "").slice(0, 120), String(_0x3964a1.accountName || "").slice(0, 200), String(_0x3964a1.entrySource || "").slice(0, 80), String(_0x3964a1.searchKeyword || "").slice(0, 200), _0x1fe0ba, _0x52d029);
  return true;
}
function upsertFromLead(_0x210ddd, _0x44bd41) {
  const {
    author: _0x5b3424
  } = splitVideoCardIntoCollectedRecords(_0x44bd41);
  if (!_0x5b3424) {
    return false;
  }
  return upsertOne(_0x210ddd, _0x5b3424);
}
function upsertBatchFromLeads(_0xf1869b, _0x50eb95 = []) {
  if (!_0xf1869b || !Array.isArray(_0x50eb95) || !_0x50eb95.length) {
    return 0;
  }
  let _0x156f45 = 0;
  const _0x44b582 = _0xf1869b.transaction(_0x177ef6 => {
    for (const _0x14f068 of _0x177ef6) {
      if (upsertFromLead(_0xf1869b, _0x14f068)) {
        _0x156f45 += 1;
      }
    }
  });
  _0x44b582(_0x50eb95);
  return _0x156f45;
}
function upsertBatchRecords(_0x63a1d0, _0x143c06 = []) {
  if (!_0x63a1d0 || !Array.isArray(_0x143c06) || !_0x143c06.length) {
    return 0;
  }
  let _0x44e869 = 0;
  const _0x25bd1b = _0x63a1d0.transaction(_0x330daa => {
    for (const _0x465351 of _0x330daa) {
      if (upsertOne(_0x63a1d0, _0x465351)) {
        _0x44e869 += 1;
      }
    }
  });
  _0x25bd1b(_0x143c06);
  return _0x44e869;
}
function listAll(_0x435bc5) {
  if (!_0x435bc5) {
    return [];
  }
  try {
    const _0x2d9f8a = _0x435bc5.prepare("\n      SELECT * FROM collected_authors ORDER BY captured_at DESC\n    ").all();
    return _0x2d9f8a.map(authorRowToLibraryItem);
  } catch (_0x1516a4) {
    console.error("[DB] collectedAuthorsStore.listAll 失败:", _0x1516a4);
    return [];
  }
}
function queryPage(_0x1f40b6, _0x1c3bb3 = {}) {
  if (!_0x1f40b6) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    const _0x2d4f40 = Math.max(0, Number(_0x1c3bb3.offset) || 0);
    const _0xf09723 = Math.max(1, Math.min(500, Number(_0x1c3bb3.limit) || 50));
    const _0x2e6bdc = String(_0x1c3bb3.keyword || "").trim();
    let _0x4d01cc = "";
    const _0x36bd7f = [];
    if (_0x2e6bdc) {
      _0x4d01cc = "WHERE nickname LIKE ? OR profile_url LIKE ? OR search_keyword LIKE ?";
      const _0x508d05 = "%" + _0x2e6bdc + "%";
      _0x36bd7f.push(_0x508d05, _0x508d05, _0x508d05);
    }
    const _0x129750 = Number(_0x1f40b6.prepare("SELECT COUNT(*) AS cnt FROM collected_authors " + _0x4d01cc).get(..._0x36bd7f)?.cnt) || 0;
    const _0x3ecb14 = _0x1f40b6.prepare("\n      SELECT *\n      FROM collected_authors\n      " + _0x4d01cc + "\n      ORDER BY captured_at DESC\n      LIMIT ? OFFSET ?\n    ").all(..._0x36bd7f, _0xf09723, _0x2d4f40);
    return {
      items: _0x3ecb14.map(authorRowToLibraryItem),
      total: _0x129750
    };
  } catch (_0x20a6bb) {
    console.error("[DB] collectedAuthorsStore.queryPage 失败:", _0x20a6bb);
    return {
      items: [],
      total: 0
    };
  }
}
function listIds(_0x3449ab) {
  if (!_0x3449ab) {
    return new Set();
  }
  try {
    const _0x35c2c1 = _0x3449ab.prepare("SELECT id FROM collected_authors").all();
    return new Set(_0x35c2c1.map(_0x19ff58 => String(_0x19ff58.id || "")).filter(Boolean));
  } catch (_0x34264c) {
    return new Set();
  }
}
function count(_0x2f2718) {
  if (!_0x2f2718) {
    return 0;
  }
  try {
    return Number(_0x2f2718.prepare("SELECT COUNT(*) AS cnt FROM collected_authors").get()?.cnt) || 0;
  } catch (_0x43fcbd) {
    return 0;
  }
}
function deleteByKeys(_0x2f2071, _0x441af3 = []) {
  if (!_0x2f2071 || !Array.isArray(_0x441af3) || !_0x441af3.length) {
    return 0;
  }
  const _0x578ef9 = [...new Set(_0x441af3.map(_0x2e2cea => toCollectedAuthorKey(_0x2e2cea) || String(_0x2e2cea || "").trim()).filter(Boolean))];
  if (!_0x578ef9.length) {
    return 0;
  }
  let _0x3d4b20 = 0;
  const _0x50cf34 = _0x2f2071.prepare("DELETE FROM collected_authors WHERE id = ?");
  const _0x58be9e = _0x2f2071.prepare("DELETE FROM collected_authors WHERE sec_uid = ?");
  const _0x412a81 = _0x2f2071.transaction(_0x395515 => {
    for (const _0x56146a of _0x395515) {
      _0x3d4b20 += _0x50cf34.run(_0x56146a).changes || 0;
      const _0x3d404d = extractAuthorSecUid(_0x56146a);
      if (_0x3d404d) {
        _0x3d4b20 += _0x58be9e.run(_0x3d404d).changes || 0;
      }
    }
  });
  try {
    _0x412a81(_0x578ef9);
    return _0x3d4b20;
  } catch (_0x326870) {
    console.error("[DB] collectedAuthorsStore.deleteByKeys 失败:", _0x326870);
    return 0;
  }
}
function clearAll(_0xa5fe67) {
  if (!_0xa5fe67) {
    return 0;
  }
  try {
    return Number(_0xa5fe67.prepare("DELETE FROM collected_authors").run()?.changes) || 0;
  } catch (_0x24745a) {
    console.error("[DB] collectedAuthorsStore.clearAll 失败:", _0x24745a);
    return 0;
  }
}
function getById(_0x532b75, _0x1c59a0) {
  if (!_0x532b75 || !_0x1c59a0) {
    return null;
  }
  const _0x170d9e = toCollectedAuthorKey(_0x1c59a0) || String(_0x1c59a0).trim();
  try {
    const _0x58c0a6 = _0x532b75.prepare("SELECT * FROM collected_authors WHERE id = ? OR sec_uid = ? LIMIT 1").get(_0x170d9e, extractAuthorSecUid(_0x170d9e) || _0x170d9e);
    if (_0x58c0a6) {
      return authorRowToLibraryItem(_0x58c0a6);
    } else {
      return null;
    }
  } catch (_0x49f9b6) {
    return null;
  }
}
module.exports = {
  ensureTables: ensureTables,
  upsertOne: upsertOne,
  upsertFromLead: upsertFromLead,
  upsertBatchFromLeads: upsertBatchFromLeads,
  upsertBatchRecords: upsertBatchRecords,
  listAll: listAll,
  queryPage: queryPage,
  listIds: listIds,
  count: count,
  deleteByKeys: deleteByKeys,
  clearAll: clearAll,
  getById: getById
};
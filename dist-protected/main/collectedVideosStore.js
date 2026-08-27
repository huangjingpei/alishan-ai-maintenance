'use strict';

const {
  splitVideoCardIntoCollectedRecords,
  toCollectedVideoKey,
  videoRowToLibraryItem,
  extractAwemeId
} = require("../shared/collectedLeadKeys");
function ensureTables(_0x488e73) {
  if (!_0x488e73) {
    return;
  }
  _0x488e73.exec("\n    CREATE TABLE IF NOT EXISTS collected_videos (\n      id TEXT PRIMARY KEY,\n      video_id TEXT NOT NULL UNIQUE,\n      video_url TEXT NOT NULL,\n      title TEXT DEFAULT '',\n      author_nickname TEXT DEFAULT '',\n      author_profile_url TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      account_name TEXT DEFAULT '',\n      entry_source TEXT DEFAULT '',\n      search_keyword TEXT DEFAULT '',\n      captured_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_collected_videos_captured ON collected_videos(captured_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_collected_videos_account ON collected_videos(account_id);\n  ");
}
function upsertOne(_0x541c71, _0x272ffb) {
  if (!_0x541c71 || !_0x272ffb) {
    return false;
  }
  const _0x523b85 = String(_0x272ffb.videoId || extractAwemeId(_0x272ffb.id || _0x272ffb.videoUrl || "") || "").trim();
  if (!_0x523b85) {
    return false;
  }
  const _0x2e8263 = String(_0x272ffb.id || "video:" + _0x523b85).trim();
  const _0x2863b7 = String(_0x272ffb.videoUrl || "https://www.douyin.com/video/" + _0x523b85).trim();
  const _0x452b4c = Number(_0x272ffb.capturedAt) || Date.now();
  const _0x59b53f = JSON.stringify(_0x272ffb.raw || _0x272ffb);
  _0x541c71.prepare("\n    INSERT INTO collected_videos (\n      id, video_id, video_url, title, author_nickname, author_profile_url,\n      account_id, account_name, entry_source, search_keyword, captured_at, raw_data\n    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      video_id = excluded.video_id,\n      video_url = excluded.video_url,\n      title = CASE WHEN excluded.title != '' THEN excluded.title ELSE collected_videos.title END,\n      author_nickname = CASE WHEN excluded.author_nickname != '' THEN excluded.author_nickname ELSE collected_videos.author_nickname END,\n      author_profile_url = CASE WHEN excluded.author_profile_url != '' THEN excluded.author_profile_url ELSE collected_videos.author_profile_url END,\n      account_id = CASE WHEN excluded.account_id != '' THEN excluded.account_id ELSE collected_videos.account_id END,\n      account_name = CASE WHEN excluded.account_name != '' THEN excluded.account_name ELSE collected_videos.account_name END,\n      entry_source = CASE WHEN excluded.entry_source != '' THEN excluded.entry_source ELSE collected_videos.entry_source END,\n      search_keyword = CASE WHEN excluded.search_keyword != '' THEN excluded.search_keyword ELSE collected_videos.search_keyword END,\n      captured_at = CASE WHEN excluded.captured_at >= collected_videos.captured_at THEN excluded.captured_at ELSE collected_videos.captured_at END,\n      raw_data = excluded.raw_data\n  ").run(_0x2e8263, _0x523b85, _0x2863b7, String(_0x272ffb.title || "").slice(0, 300), String(_0x272ffb.authorNickname || "").slice(0, 200), String(_0x272ffb.authorProfileUrl || "").slice(0, 500), String(_0x272ffb.accountId || "").slice(0, 120), String(_0x272ffb.accountName || "").slice(0, 200), String(_0x272ffb.entrySource || "").slice(0, 80), String(_0x272ffb.searchKeyword || "").slice(0, 200), _0x452b4c, _0x59b53f);
  return true;
}
function upsertFromLead(_0x2b63be, _0x3eb7bb) {
  const {
    video: _0x25f88e
  } = splitVideoCardIntoCollectedRecords(_0x3eb7bb);
  if (!_0x25f88e) {
    return false;
  }
  return upsertOne(_0x2b63be, _0x25f88e);
}
function upsertBatchFromLeads(_0x25d110, _0xbca338 = []) {
  if (!_0x25d110 || !Array.isArray(_0xbca338) || !_0xbca338.length) {
    return 0;
  }
  let _0xcc0f85 = 0;
  const _0x8a4b6d = _0x25d110.transaction(_0x4cc736 => {
    for (const _0x48b570 of _0x4cc736) {
      if (upsertFromLead(_0x25d110, _0x48b570)) {
        _0xcc0f85 += 1;
      }
    }
  });
  _0x8a4b6d(_0xbca338);
  return _0xcc0f85;
}
function upsertBatchRecords(_0x3f92ba, _0x40d390 = []) {
  if (!_0x3f92ba || !Array.isArray(_0x40d390) || !_0x40d390.length) {
    return 0;
  }
  let _0x1e4847 = 0;
  const _0xb82c2c = _0x3f92ba.transaction(_0x4892d5 => {
    for (const _0x24bf95 of _0x4892d5) {
      if (upsertOne(_0x3f92ba, _0x24bf95)) {
        _0x1e4847 += 1;
      }
    }
  });
  _0xb82c2c(_0x40d390);
  return _0x1e4847;
}
function listAll(_0x2435a7) {
  if (!_0x2435a7) {
    return [];
  }
  try {
    const _0x20f64d = _0x2435a7.prepare("\n      SELECT * FROM collected_videos ORDER BY captured_at DESC\n    ").all();
    return _0x20f64d.map(videoRowToLibraryItem);
  } catch (_0x1d022a) {
    console.error("[DB] collectedVideosStore.listAll 失败:", _0x1d022a);
    return [];
  }
}
function listLinkMigrateHints(_0x8e517b) {
  if (!_0x8e517b) {
    return [];
  }
  try {
    return _0x8e517b.prepare("\n      SELECT video_url AS videoUrl,\n             author_profile_url AS authorProfileUrl,\n             author_nickname AS authorNickname\n      FROM collected_videos\n    ").all().map(_0x2bbd7b => ({
      videoUrl: String(_0x2bbd7b.videoUrl || ""),
      authorProfileUrl: String(_0x2bbd7b.authorProfileUrl || ""),
      authorNickname: String(_0x2bbd7b.authorNickname || "")
    }));
  } catch (_0x2183e6) {
    console.error("[DB] collectedVideosStore.listLinkMigrateHints 失败:", _0x2183e6);
    return [];
  }
}
function queryPage(_0x227077, _0x463e51 = {}) {
  if (!_0x227077) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    const _0x4a5789 = Math.max(0, Number(_0x463e51.offset) || 0);
    const _0x67dad0 = Math.max(1, Math.min(500, Number(_0x463e51.limit) || 50));
    const _0x21e2be = String(_0x463e51.keyword || "").trim();
    let _0x48f67b = "";
    const _0x3b53be = [];
    if (_0x21e2be) {
      _0x48f67b = "WHERE title LIKE ? OR author_nickname LIKE ? OR video_url LIKE ? OR author_profile_url LIKE ?";
      const _0xf52b3 = "%" + _0x21e2be + "%";
      _0x3b53be.push(_0xf52b3, _0xf52b3, _0xf52b3, _0xf52b3);
    }
    const _0x2f1eb2 = Number(_0x227077.prepare("SELECT COUNT(*) AS cnt FROM collected_videos " + _0x48f67b).get(..._0x3b53be)?.cnt) || 0;
    const _0x441d64 = _0x227077.prepare("\n      SELECT *\n      FROM collected_videos\n      " + _0x48f67b + "\n      ORDER BY captured_at DESC\n      LIMIT ? OFFSET ?\n    ").all(..._0x3b53be, _0x67dad0, _0x4a5789);
    return {
      items: _0x441d64.map(videoRowToLibraryItem),
      total: _0x2f1eb2
    };
  } catch (_0x260e05) {
    console.error("[DB] collectedVideosStore.queryPage 失败:", _0x260e05);
    return {
      items: [],
      total: 0
    };
  }
}
function listVideoUrls(_0x4b60e9) {
  if (!_0x4b60e9) {
    return [];
  }
  try {
    return _0x4b60e9.prepare("SELECT video_url AS videoUrl FROM collected_videos").all().map(_0x44c1d2 => String(_0x44c1d2.videoUrl || "").trim()).filter(Boolean);
  } catch (_0x5ed144) {
    console.error("[DB] collectedVideosStore.listVideoUrls 失败:", _0x5ed144);
    return [];
  }
}
function listImportKeys(_0x1b19d6) {
  if (!_0x1b19d6) {
    return [];
  }
  try {
    return _0x1b19d6.prepare("SELECT video_id AS videoId, video_url AS videoUrl FROM collected_videos").all().map(_0x10bd58 => ({
      videoId: String(_0x10bd58.videoId || "").trim(),
      videoUrl: String(_0x10bd58.videoUrl || "").trim()
    })).filter(_0x2d8bc7 => _0x2d8bc7.videoId || _0x2d8bc7.videoUrl);
  } catch (_0x1fb05d) {
    console.error("[DB] collectedVideosStore.listImportKeys 失败:", _0x1fb05d);
    return [];
  }
}
function listIds(_0x766fc0) {
  if (!_0x766fc0) {
    return new Set();
  }
  try {
    const _0x4351a2 = _0x766fc0.prepare("SELECT id FROM collected_videos").all();
    return new Set(_0x4351a2.map(_0xd1b7b => String(_0xd1b7b.id || "")).filter(Boolean));
  } catch (_0x44f564) {
    return new Set();
  }
}
function count(_0x2a4e65) {
  if (!_0x2a4e65) {
    return 0;
  }
  try {
    return Number(_0x2a4e65.prepare("SELECT COUNT(*) AS cnt FROM collected_videos").get()?.cnt) || 0;
  } catch (_0x1488dd) {
    return 0;
  }
}
function deleteByKeys(_0x3c9ad1, _0x481010 = []) {
  if (!_0x3c9ad1 || !Array.isArray(_0x481010) || !_0x481010.length) {
    return 0;
  }
  const _0x14a831 = [...new Set(_0x481010.map(_0x126eea => toCollectedVideoKey(_0x126eea) || String(_0x126eea || "").trim()).filter(Boolean))];
  if (!_0x14a831.length) {
    return 0;
  }
  let _0x5127bc = 0;
  const _0x3acbae = _0x3c9ad1.prepare("DELETE FROM collected_videos WHERE id = ?");
  const _0x1b24d8 = _0x3c9ad1.prepare("DELETE FROM collected_videos WHERE video_id = ?");
  const _0x10afc7 = _0x3c9ad1.transaction(_0xf97463 => {
    for (const _0x9dbe92 of _0xf97463) {
      _0x5127bc += _0x3acbae.run(_0x9dbe92).changes || 0;
      const _0x49a21e = extractAwemeId(_0x9dbe92);
      if (_0x49a21e) {
        _0x5127bc += _0x1b24d8.run(_0x49a21e).changes || 0;
      }
    }
  });
  try {
    _0x10afc7(_0x14a831);
    return _0x5127bc;
  } catch (_0x1915c7) {
    console.error("[DB] collectedVideosStore.deleteByKeys 失败:", _0x1915c7);
    return 0;
  }
}
function clearAll(_0x97e2c8) {
  if (!_0x97e2c8) {
    return 0;
  }
  try {
    return Number(_0x97e2c8.prepare("DELETE FROM collected_videos").run()?.changes) || 0;
  } catch (_0x5b3739) {
    console.error("[DB] collectedVideosStore.clearAll 失败:", _0x5b3739);
    return 0;
  }
}
function getById(_0x2187a7, _0x26b4b4) {
  if (!_0x2187a7 || !_0x26b4b4) {
    return null;
  }
  const _0x40403c = toCollectedVideoKey(_0x26b4b4) || String(_0x26b4b4).trim();
  try {
    const _0x197aed = _0x2187a7.prepare("SELECT * FROM collected_videos WHERE id = ? OR video_id = ? LIMIT 1").get(_0x40403c, extractAwemeId(_0x40403c) || _0x40403c);
    if (_0x197aed) {
      return videoRowToLibraryItem(_0x197aed);
    } else {
      return null;
    }
  } catch (_0x24847f) {
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
  listLinkMigrateHints: listLinkMigrateHints,
  queryPage: queryPage,
  listVideoUrls: listVideoUrls,
  listImportKeys: listImportKeys,
  listIds: listIds,
  count: count,
  deleteByKeys: deleteByKeys,
  clearAll: clearAll,
  getById: getById
};
'use strict';

const {
  extractDouyinVideoId,
  normalizeProcessedVideoKey,
  processedVideoKeysMatch
} = require("../shared/processedVideoKey");
const MAX_PROCESSED_VIDEOS_STORE_FALLBACK = 3000;
const MAX_PROCESSED_VIDEOS = 0;
function ensureTables(_0x579384) {
  if (!_0x579384) {
    return;
  }
  _0x579384.exec("\n    CREATE TABLE IF NOT EXISTS processed_videos (\n      video_id TEXT PRIMARY KEY,\n      title TEXT,\n      author TEXT,\n      lead_count INTEGER DEFAULT 0,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_processed_videos_updated ON processed_videos(updated_at DESC);\n  ");
}
function resolveVideoId(_0x5a6378 = {}) {
  const _0x2c2821 = String(_0x5a6378.video_id || _0x5a6378.videoId || "").trim();
  if (/^\d{10,}$/.test(_0x2c2821)) {
    return _0x2c2821;
  }
  const _0x200172 = extractDouyinVideoId(_0x5a6378.url || _0x5a6378.videoUrl || _0x5a6378.id || "");
  if (_0x200172) {
    return _0x200172;
  }
  const _0x40eb45 = normalizeProcessedVideoKey(_0x5a6378.url || _0x5a6378.videoUrl || "");
  if (_0x40eb45) {
    const _0x2fbe0a = extractDouyinVideoId(_0x40eb45);
    if (_0x2fbe0a) {
      return _0x2fbe0a;
    }
    return "url:" + _0x40eb45.slice(0, 180);
  }
  return "";
}
function toRowPayload(_0x4a25c7 = {}) {
  const _0x3db59e = resolveVideoId(_0x4a25c7);
  if (!_0x3db59e) {
    return null;
  }
  const _0x4433e1 = normalizeProcessedVideoKey(_0x4a25c7.url || _0x4a25c7.videoUrl || "") || (_0x3db59e.startsWith("url:") ? _0x3db59e.slice(4) : "https://www.douyin.com/video/" + _0x3db59e);
  const _0x5e1a94 = Number(_0x4a25c7.timestamp || _0x4a25c7.updated_at || _0x4a25c7.updatedAt || Date.now()) || Date.now();
  const _0x4c902e = {
    ..._0x4a25c7,
    url: _0x4433e1,
    video_id: _0x3db59e.startsWith("url:") ? "" : _0x3db59e,
    timestamp: _0x5e1a94
  };
  return {
    videoId: _0x3db59e,
    title: String(_0x4a25c7.title || _0x4a25c7.videoTitle || "").slice(0, 300),
    author: String(_0x4a25c7.authorNickname || _0x4a25c7.author || _0x4a25c7.nickname || "").slice(0, 200),
    leadCount: Number(_0x4a25c7.lead_count || _0x4a25c7.leadCount || 0) || 0,
    updatedAt: _0x5e1a94,
    raw: _0x4c902e
  };
}
function parseRow(_0x1ebce6) {
  if (!_0x1ebce6) {
    return null;
  }
  try {
    const _0x4d641c = JSON.parse(_0x1ebce6.raw_data || "{}");
    if (!_0x4d641c.url && _0x1ebce6.video_id && !String(_0x1ebce6.video_id).startsWith("url:")) {
      _0x4d641c.url = "https://www.douyin.com/video/" + _0x1ebce6.video_id;
    }
    if (!_0x4d641c.timestamp && _0x1ebce6.updated_at) {
      _0x4d641c.timestamp = _0x1ebce6.updated_at;
    }
    return _0x4d641c;
  } catch (_0x22e468) {
    return null;
  }
}
function listAll(_0x4b2564) {
  if (!_0x4b2564) {
    return [];
  }
  try {
    const _0x38ab2d = _0x4b2564.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      ORDER BY updated_at DESC\n    ").all();
    return _0x38ab2d.map(parseRow).filter(Boolean);
  } catch (_0x472966) {
    console.error("[DB] processedVideosStore.listAll 失败:", _0x472966);
    return [];
  }
}
const HISTORY_VIDEO_WHERE = "COALESCE(json_extract(raw_data, '$.recordType'), '') != 'collected_link'";
function listHistoryVideos(_0x4c67a6) {
  if (!_0x4c67a6) {
    return [];
  }
  try {
    const _0x4a1c39 = _0x4c67a6.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      WHERE " + HISTORY_VIDEO_WHERE + "\n      ORDER BY updated_at DESC\n    ").all();
    return _0x4a1c39.map(parseRow).filter(Boolean);
  } catch (_0x381538) {
    console.error("[DB] processedVideosStore.listHistoryVideos 失败:", _0x381538);
    return listAll(_0x4c67a6).filter(_0x3d7729 => _0x3d7729?.recordType !== "collected_link");
  }
}
function queryHistoryPage(_0x5f354c, _0x5e84c8 = {}) {
  if (!_0x5f354c) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    const _0x4136fe = Math.max(0, Number(_0x5e84c8.offset) || 0);
    const _0x1849a6 = Math.max(1, Math.min(500, Number(_0x5e84c8.limit) || 20));
    const _0x589b63 = String(_0x5e84c8.keyword || "").trim();
    let _0x1060c8 = "WHERE " + HISTORY_VIDEO_WHERE;
    const _0x268ac7 = [];
    if (_0x589b63) {
      const _0x69394f = "%" + _0x589b63 + "%";
      _0x1060c8 += " AND (title LIKE ? OR author LIKE ? OR video_id LIKE ? OR IFNULL(json_extract(raw_data, '$.url'), '') LIKE ?)";
      _0x268ac7.push(_0x69394f, _0x69394f, _0x69394f, _0x69394f);
    }
    const _0x4050ed = Number(_0x5f354c.prepare("SELECT COUNT(*) AS c FROM processed_videos " + _0x1060c8).get(..._0x268ac7)?.c) || 0;
    const _0x39471c = _0x5f354c.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      " + _0x1060c8 + "\n      ORDER BY updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(..._0x268ac7, _0x1849a6, _0x4136fe);
    return {
      items: _0x39471c.map(parseRow).filter(Boolean),
      total: _0x4050ed
    };
  } catch (_0x5db15f) {
    console.error("[DB] processedVideosStore.queryHistoryPage 失败:", _0x5db15f);
    return {
      items: [],
      total: 0
    };
  }
}
function count(_0x53f89e) {
  if (!_0x53f89e) {
    return 0;
  }
  try {
    return Number(_0x53f89e.prepare("SELECT COUNT(*) AS c FROM processed_videos").get()?.c) || 0;
  } catch (_0x147ef4) {
    return 0;
  }
}
function upsertOne(_0x42170e, _0x235b40) {
  if (!_0x42170e || !_0x235b40) {
    return false;
  }
  const _0x2fc27d = toRowPayload(_0x235b40);
  if (!_0x2fc27d) {
    return false;
  }
  _0x42170e.prepare("\n    INSERT INTO processed_videos (video_id, title, author, lead_count, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?)\n    ON CONFLICT(video_id) DO UPDATE SET\n      title = CASE WHEN excluded.title != '' AND excluded.title != '处理中' THEN excluded.title ELSE processed_videos.title END,\n      author = CASE WHEN excluded.author != '' THEN excluded.author ELSE processed_videos.author END,\n      lead_count = excluded.lead_count,\n      updated_at = CASE WHEN excluded.updated_at >= processed_videos.updated_at THEN excluded.updated_at ELSE processed_videos.updated_at END,\n      raw_data = excluded.raw_data\n  ").run(_0x2fc27d.videoId, _0x2fc27d.title, _0x2fc27d.author, _0x2fc27d.leadCount, _0x2fc27d.updatedAt, JSON.stringify(_0x2fc27d.raw));
  return true;
}
function upsertMany(_0x48de25, _0x2483bd = [], {
  cap = 0
} = {}) {
  if (!_0x48de25 || !Array.isArray(_0x2483bd)) {
    return 0;
  }
  let _0x11a577 = 0;
  const _0x2435ea = _0x48de25.transaction(_0x5806c1 => {
    for (const _0x373dd1 of _0x5806c1) {
      if (upsertOne(_0x48de25, _0x373dd1)) {
        _0x11a577 += 1;
      }
    }
    if (cap > 0) {
      const _0x5e2ff2 = _0x48de25.prepare("\n        SELECT video_id FROM processed_videos\n        ORDER BY updated_at DESC\n        LIMIT -1 OFFSET ?\n      ").all(cap);
      const _0x327d46 = _0x48de25.prepare("DELETE FROM processed_videos WHERE video_id = ?");
      for (const _0x5d5b90 of _0x5e2ff2) {
        _0x327d46.run(_0x5d5b90.video_id);
      }
    }
  });
  try {
    _0x2435ea(_0x2483bd);
    return _0x11a577;
  } catch (_0x2a26d0) {
    console.error("[DB] processedVideosStore.upsertMany 失败:", _0x2a26d0);
    return _0x11a577;
  }
}
function replaceAll(_0x5664ac, _0x10efce = []) {
  if (!_0x5664ac) {
    return false;
  }
  try {
    const _0x5ea99b = _0x5664ac.transaction(_0x18c382 => {
      _0x5664ac.prepare("DELETE FROM processed_videos").run();
      for (const _0x36e610 of _0x18c382) {
        upsertOne(_0x5664ac, _0x36e610);
      }
    });
    _0x5ea99b(Array.isArray(_0x10efce) ? _0x10efce : []);
    return true;
  } catch (_0x22e376) {
    console.error("[DB] processedVideosStore.replaceAll 失败:", _0x22e376);
    return false;
  }
}
function findByUrl(_0x56e973, _0x594051) {
  if (!_0x56e973 || !_0x594051) {
    return null;
  }
  const _0x54a6ad = resolveVideoId({
    url: _0x594051
  });
  if (_0x54a6ad) {
    try {
      const _0x190d77 = _0x56e973.prepare("SELECT raw_data, updated_at, video_id FROM processed_videos WHERE video_id = ?").get(_0x54a6ad);
      if (_0x190d77) {
        return parseRow(_0x190d77);
      }
    } catch (_0x11ad35) {}
  }
  const _0x1f4ebc = listAll(_0x56e973);
  return _0x1f4ebc.find(_0x24c4d4 => processedVideoKeysMatch(_0x24c4d4.url, _0x594051)) || null;
}
function isProcessed(_0x2b1064, _0x4414e2) {
  return !!findByUrl(_0x2b1064, _0x4414e2);
}
function deleteByUrls(_0x4e6d38, _0x437ab3 = []) {
  if (!_0x4e6d38) {
    return 0;
  }
  const _0x3c0f96 = (Array.isArray(_0x437ab3) ? _0x437ab3 : [_0x437ab3]).map(_0x373b08 => String(_0x373b08 || "").trim()).filter(Boolean);
  if (!_0x3c0f96.length) {
    return 0;
  }
  let _0x2a8b0e = 0;
  const _0x255a7e = _0x4e6d38.prepare("DELETE FROM processed_videos WHERE video_id = ?");
  const _0x4f1afd = _0x4e6d38.transaction(_0x15ce60 => {
    for (const _0x2e9245 of _0x15ce60) {
      const _0x211e36 = resolveVideoId({
        url: _0x2e9245
      });
      if (_0x211e36) {
        _0x2a8b0e += _0x255a7e.run(_0x211e36).changes || 0;
        continue;
      }
    }
    const _0x584d73 = listAll(_0x4e6d38);
    for (const _0x5dda98 of _0x584d73) {
      if (_0x3c0f96.some(_0xd8f9ed => processedVideoKeysMatch(_0x5dda98.url, _0xd8f9ed))) {
        const _0xee3353 = resolveVideoId(_0x5dda98);
        if (_0xee3353) {
          _0x2a8b0e += _0x255a7e.run(_0xee3353).changes || 0;
        }
      }
    }
  });
  try {
    _0x4f1afd(_0x3c0f96);
    return _0x2a8b0e;
  } catch (_0x345859) {
    console.error("[DB] processedVideosStore.deleteByUrls 失败:", _0x345859);
    return _0x2a8b0e;
  }
}
function clearAuthorUrlByVideoUrls(_0x30d4c3, _0x478f46 = []) {
  if (!_0x30d4c3) {
    return 0;
  }
  const _0x101dee = (Array.isArray(_0x478f46) ? _0x478f46 : [_0x478f46]).filter(Boolean);
  if (!_0x101dee.length) {
    return 0;
  }
  let _0x3446ff = 0;
  const _0x93b79d = listAll(_0x30d4c3);
  const _0x54b7c7 = [];
  for (const _0x43ac02 of _0x93b79d) {
    if (!_0x101dee.some(_0x393207 => processedVideoKeysMatch(_0x43ac02.url, _0x393207))) {
      continue;
    }
    if (!_0x43ac02.authorUrl) {
      continue;
    }
    _0x54b7c7.push({
      ..._0x43ac02,
      authorUrl: ""
    });
    _0x3446ff += 1;
  }
  if (_0x54b7c7.length) {
    upsertMany(_0x30d4c3, _0x54b7c7, {
      cap: 0
    });
  }
  return _0x3446ff;
}
function clearAll(_0x33a0fe) {
  if (!_0x33a0fe) {
    return 0;
  }
  try {
    return _0x33a0fe.prepare("DELETE FROM processed_videos").run().changes || 0;
  } catch (_0x35f4a5) {
    console.error("[DB] processedVideosStore.clearAll 失败:", _0x35f4a5);
    return 0;
  }
}
module.exports = {
  MAX_PROCESSED_VIDEOS: MAX_PROCESSED_VIDEOS,
  MAX_PROCESSED_VIDEOS_STORE_FALLBACK: MAX_PROCESSED_VIDEOS_STORE_FALLBACK,
  ensureTables: ensureTables,
  resolveVideoId: resolveVideoId,
  listAll: listAll,
  listHistoryVideos: listHistoryVideos,
  queryHistoryPage: queryHistoryPage,
  count: count,
  upsertOne: upsertOne,
  upsertMany: upsertMany,
  replaceAll: replaceAll,
  findByUrl: findByUrl,
  isProcessed: isProcessed,
  deleteByUrls: deleteByUrls,
  clearAuthorUrlByVideoUrls: clearAuthorUrlByVideoUrls,
  clearAll: clearAll
};
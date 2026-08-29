'use strict';

const {
  extractDouyinVideoId,
  normalizeProcessedVideoKey,
  processedVideoKeysMatch
} = require("../shared/processedVideoKey");
const MAX_PROCESSED_VIDEOS_STORE_FALLBACK = 3000;
const MAX_PROCESSED_VIDEOS = 0;
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS processed_videos (\n      video_id TEXT PRIMARY KEY,\n      title TEXT,\n      author TEXT,\n      lead_count INTEGER DEFAULT 0,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_processed_videos_updated ON processed_videos(updated_at DESC);\n  ");
}
function resolveVideoId(options = {}) {
  const result = String(options.video_id || options.videoId || "").trim();
  if (/^\d{10,}$/.test(result)) {
    return result;
  }
  const result2 = extractDouyinVideoId(options.url || options.videoUrl || options.id || "");
  if (result2) {
    return result2;
  }
  const result3 = normalizeProcessedVideoKey(options.url || options.videoUrl || "");
  if (result3) {
    const result = extractDouyinVideoId(result3);
    if (result) {
      return result;
    }
    return "url:" + result3.slice(0, 180);
  }
  return "";
}
function toRowPayload(options = {}) {
  const result = resolveVideoId(options);
  if (!result) {
    return null;
  }
  const local = normalizeProcessedVideoKey(options.url || options.videoUrl || "") || (result.startsWith("url:") ? result.slice(4) : "https://www.douyin.com/video/" + result);
  const local2 = Number(options.timestamp || options.updated_at || options.updatedAt || Date.now()) || Date.now();
  const obj = {
    ...options,
    url: local,
    video_id: result.startsWith("url:") ? "" : result,
    timestamp: local2
  };
  return {
    videoId: result,
    title: String(options.title || options.videoTitle || "").slice(0, 300),
    author: String(options.authorNickname || options.author || options.nickname || "").slice(0, 200),
    leadCount: Number(options.lead_count || options.leadCount || 0) || 0,
    updatedAt: local2,
    raw: obj
  };
}
function parseRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result.url && arg1.video_id && !String(arg1.video_id).startsWith("url:")) {
      result.url = "https://www.douyin.com/video/" + arg1.video_id;
    }
    if (!result.timestamp && arg1.updated_at) {
      result.timestamp = arg1.updated_at;
    }
    return result;
  } catch (error) {
    return null;
  }
}
function listAll(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    const result = arg1.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      ORDER BY updated_at DESC\n    ").all();
    return result.map(parseRow).filter(Boolean);
  } catch (error) {
    console.error("[DB] processedVideosStore.listAll 失败:", error);
    return [];
  }
}
const HISTORY_VIDEO_WHERE = "COALESCE(json_extract(raw_data, '$.recordType'), '') != 'collected_link'";
function listHistoryVideos(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    const result = arg1.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      WHERE " + HISTORY_VIDEO_WHERE + "\n      ORDER BY updated_at DESC\n    ").all();
    return result.map(parseRow).filter(Boolean);
  } catch (error) {
    console.error("[DB] processedVideosStore.listHistoryVideos 失败:", error);
    return listAll(arg1).filter(arg1 => arg1?.recordType !== "collected_link");
  }
}
function queryHistoryPage(arg1, options = {}) {
  if (!arg1) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    const result = Math.max(0, Number(options.offset) || 0);
    const result2 = Math.max(1, Math.min(500, Number(options.limit) || 20));
    const result3 = String(options.keyword || "").trim();
    let value = "WHERE " + HISTORY_VIDEO_WHERE;
    const list = [];
    if (result3) {
      const value2 = "%" + result3 + "%";
      value += " AND (title LIKE ? OR author LIKE ? OR video_id LIKE ? OR IFNULL(json_extract(raw_data, '$.url'), '') LIKE ?)";
      list.push(value2, value2, value2, value2);
    }
    const local = Number(arg1.prepare("SELECT COUNT(*) AS c FROM processed_videos " + value).get(...list)?.c) || 0;
    const result4 = arg1.prepare("\n      SELECT video_id, updated_at, raw_data FROM processed_videos\n      " + value + "\n      ORDER BY updated_at DESC\n      LIMIT ? OFFSET ?\n    ").all(...list, result2, result);
    return {
      items: result4.map(parseRow).filter(Boolean),
      total: local
    };
  } catch (error) {
    console.error("[DB] processedVideosStore.queryHistoryPage 失败:", error);
    return {
      items: [],
      total: 0
    };
  }
}
function count(arg1) {
  if (!arg1) {
    return 0;
  }
  try {
    return Number(arg1.prepare("SELECT COUNT(*) AS c FROM processed_videos").get()?.c) || 0;
  } catch (error) {
    return 0;
  }
}
function upsertOne(arg1, arg2) {
  if (!arg1 || !arg2) {
    return false;
  }
  const result = toRowPayload(arg2);
  if (!result) {
    return false;
  }
  arg1.prepare("\n    INSERT INTO processed_videos (video_id, title, author, lead_count, updated_at, raw_data)\n    VALUES (?, ?, ?, ?, ?, ?)\n    ON CONFLICT(video_id) DO UPDATE SET\n      title = CASE WHEN excluded.title != '' AND excluded.title != '处理中' THEN excluded.title ELSE processed_videos.title END,\n      author = CASE WHEN excluded.author != '' THEN excluded.author ELSE processed_videos.author END,\n      lead_count = excluded.lead_count,\n      updated_at = CASE WHEN excluded.updated_at >= processed_videos.updated_at THEN excluded.updated_at ELSE processed_videos.updated_at END,\n      raw_data = excluded.raw_data\n  ").run(result.videoId, result.title, result.author, result.leadCount, result.updatedAt, JSON.stringify(result.raw));
  return true;
}
function upsertMany(arg1, list = [], {
  cap = 0
} = {}) {
  if (!arg1 || !Array.isArray(list)) {
    return 0;
  }
  let num = 0;
  const result = arg1.transaction(arg12 => {
    for (const item of arg12) {
      if (upsertOne(arg1, item)) {
        num += 1;
      }
    }
    if (cap > 0) {
      const result = arg1.prepare("\n        SELECT video_id FROM processed_videos\n        ORDER BY updated_at DESC\n        LIMIT -1 OFFSET ?\n      ").all(cap);
      const result2 = arg1.prepare("DELETE FROM processed_videos WHERE video_id = ?");
      for (const item of result) {
        result2.run(item.video_id);
      }
    }
  });
  try {
    result(list);
    return num;
  } catch (error) {
    console.error("[DB] processedVideosStore.upsertMany 失败:", error);
    return num;
  }
}
function replaceAll(arg1, list = []) {
  if (!arg1) {
    return false;
  }
  try {
    const result = arg1.transaction(arg12 => {
      arg1.prepare("DELETE FROM processed_videos").run();
      for (const item of arg12) {
        upsertOne(arg1, item);
      }
    });
    result(Array.isArray(list) ? list : []);
    return true;
  } catch (error) {
    console.error("[DB] processedVideosStore.replaceAll 失败:", error);
    return false;
  }
}
function findByUrl(arg1, arg2) {
  if (!arg1 || !arg2) {
    return null;
  }
  const result = resolveVideoId({
    url: arg2
  });
  if (result) {
    try {
      const result2 = arg1.prepare("SELECT raw_data, updated_at, video_id FROM processed_videos WHERE video_id = ?").get(result);
      if (result2) {
        return parseRow(result2);
      }
    } catch (error) {}
  }
  const result2 = listAll(arg1);
  return result2.find(arg1 => processedVideoKeysMatch(arg1.url, arg2)) || null;
}
function isProcessed(arg1, arg2) {
  return !!findByUrl(arg1, arg2);
}
function deleteByUrls(arg1, list = []) {
  if (!arg1) {
    return 0;
  }
  const result = (Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  if (!result.length) {
    return 0;
  }
  let num = 0;
  const result2 = arg1.prepare("DELETE FROM processed_videos WHERE video_id = ?");
  const result3 = arg1.transaction(arg12 => {
    for (const item of arg12) {
      const result = resolveVideoId({
        url: item
      });
      if (result) {
        num += result2.run(result).changes || 0;
        continue;
      }
    }
    const result3 = listAll(arg1);
    for (const item of result3) {
      if (result.some(arg1 => processedVideoKeysMatch(item.url, arg1))) {
        const result = resolveVideoId(item);
        if (result) {
          num += result2.run(result).changes || 0;
        }
      }
    }
  });
  try {
    result3(result);
    return num;
  } catch (error) {
    console.error("[DB] processedVideosStore.deleteByUrls 失败:", error);
    return num;
  }
}
function clearAuthorUrlByVideoUrls(arg1, list = []) {
  if (!arg1) {
    return 0;
  }
  const result = (Array.isArray(list) ? list : [list]).filter(Boolean);
  if (!result.length) {
    return 0;
  }
  let num = 0;
  const result2 = listAll(arg1);
  const list2 = [];
  for (const item of result2) {
    if (!result.some(arg1 => processedVideoKeysMatch(item.url, arg1))) {
      continue;
    }
    if (!item.authorUrl) {
      continue;
    }
    list2.push({
      ...item,
      authorUrl: ""
    });
    num += 1;
  }
  if (list2.length) {
    upsertMany(arg1, list2, {
      cap: 0
    });
  }
  return num;
}
function clearAll(arg1) {
  if (!arg1) {
    return 0;
  }
  try {
    return arg1.prepare("DELETE FROM processed_videos").run().changes || 0;
  } catch (error) {
    console.error("[DB] processedVideosStore.clearAll 失败:", error);
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
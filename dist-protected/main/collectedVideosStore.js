'use strict';

const {
  splitVideoCardIntoCollectedRecords,
  toCollectedVideoKey,
  videoRowToLibraryItem,
  extractAwemeId
} = require("../shared/collectedLeadKeys");
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS collected_videos (\n      id TEXT PRIMARY KEY,\n      video_id TEXT NOT NULL UNIQUE,\n      video_url TEXT NOT NULL,\n      title TEXT DEFAULT '',\n      author_nickname TEXT DEFAULT '',\n      author_profile_url TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      account_name TEXT DEFAULT '',\n      entry_source TEXT DEFAULT '',\n      search_keyword TEXT DEFAULT '',\n      captured_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_collected_videos_captured ON collected_videos(captured_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_collected_videos_account ON collected_videos(account_id);\n  ");
}
function upsertOne(arg1, arg2) {
  if (!arg1 || !arg2) {
    return false;
  }
  const result = String(arg2.videoId || extractAwemeId(arg2.id || arg2.videoUrl || "") || "").trim();
  if (!result) {
    return false;
  }
  const result2 = String(arg2.id || "video:" + result).trim();
  const result3 = String(arg2.videoUrl || "https://www.douyin.com/video/" + result).trim();
  const local = Number(arg2.capturedAt) || Date.now();
  const result4 = JSON.stringify(arg2.raw || arg2);
  arg1.prepare("\n    INSERT INTO collected_videos (\n      id, video_id, video_url, title, author_nickname, author_profile_url,\n      account_id, account_name, entry_source, search_keyword, captured_at, raw_data\n    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      video_id = excluded.video_id,\n      video_url = excluded.video_url,\n      title = CASE WHEN excluded.title != '' THEN excluded.title ELSE collected_videos.title END,\n      author_nickname = CASE WHEN excluded.author_nickname != '' THEN excluded.author_nickname ELSE collected_videos.author_nickname END,\n      author_profile_url = CASE WHEN excluded.author_profile_url != '' THEN excluded.author_profile_url ELSE collected_videos.author_profile_url END,\n      account_id = CASE WHEN excluded.account_id != '' THEN excluded.account_id ELSE collected_videos.account_id END,\n      account_name = CASE WHEN excluded.account_name != '' THEN excluded.account_name ELSE collected_videos.account_name END,\n      entry_source = CASE WHEN excluded.entry_source != '' THEN excluded.entry_source ELSE collected_videos.entry_source END,\n      search_keyword = CASE WHEN excluded.search_keyword != '' THEN excluded.search_keyword ELSE collected_videos.search_keyword END,\n      captured_at = CASE WHEN excluded.captured_at >= collected_videos.captured_at THEN excluded.captured_at ELSE collected_videos.captured_at END,\n      raw_data = excluded.raw_data\n  ").run(result2, result, result3, String(arg2.title || "").slice(0, 300), String(arg2.authorNickname || "").slice(0, 200), String(arg2.authorProfileUrl || "").slice(0, 500), String(arg2.accountId || "").slice(0, 120), String(arg2.accountName || "").slice(0, 200), String(arg2.entrySource || "").slice(0, 80), String(arg2.searchKeyword || "").slice(0, 200), local, result4);
  return true;
}
function upsertFromLead(arg1, arg2) {
  const {
    video: video
  } = splitVideoCardIntoCollectedRecords(arg2);
  if (!video) {
    return false;
  }
  return upsertOne(arg1, video);
}
function upsertBatchFromLeads(arg1, list = []) {
  if (!arg1 || !Array.isArray(list) || !list.length) {
    return 0;
  }
  let num = 0;
  const result = arg1.transaction(arg12 => {
    for (const item of arg12) {
      if (upsertFromLead(arg1, item)) {
        num += 1;
      }
    }
  });
  result(list);
  return num;
}
function upsertBatchRecords(arg1, list = []) {
  if (!arg1 || !Array.isArray(list) || !list.length) {
    return 0;
  }
  let num = 0;
  const result = arg1.transaction(arg12 => {
    for (const item of arg12) {
      if (upsertOne(arg1, item)) {
        num += 1;
      }
    }
  });
  result(list);
  return num;
}
function listAll(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    const result = arg1.prepare("\n      SELECT * FROM collected_videos ORDER BY captured_at DESC\n    ").all();
    return result.map(videoRowToLibraryItem);
  } catch (error) {
    console.error("[DB] collectedVideosStore.listAll 失败:", error);
    return [];
  }
}
function listLinkMigrateHints(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    return arg1.prepare("\n      SELECT video_url AS videoUrl,\n             author_profile_url AS authorProfileUrl,\n             author_nickname AS authorNickname\n      FROM collected_videos\n    ").all().map(arg1 => ({
      videoUrl: String(arg1.videoUrl || ""),
      authorProfileUrl: String(arg1.authorProfileUrl || ""),
      authorNickname: String(arg1.authorNickname || "")
    }));
  } catch (error) {
    console.error("[DB] collectedVideosStore.listLinkMigrateHints 失败:", error);
    return [];
  }
}
function queryPage(arg1, options = {}) {
  if (!arg1) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    const result = Math.max(0, Number(options.offset) || 0);
    const result2 = Math.max(1, Math.min(500, Number(options.limit) || 50));
    const result3 = String(options.keyword || "").trim();
    let text = "";
    const list = [];
    if (result3) {
      text = "WHERE title LIKE ? OR author_nickname LIKE ? OR video_url LIKE ? OR author_profile_url LIKE ?";
      const value = "%" + result3 + "%";
      list.push(value, value, value, value);
    }
    const local = Number(arg1.prepare("SELECT COUNT(*) AS cnt FROM collected_videos " + text).get(...list)?.cnt) || 0;
    const result4 = arg1.prepare("\n      SELECT *\n      FROM collected_videos\n      " + text + "\n      ORDER BY captured_at DESC\n      LIMIT ? OFFSET ?\n    ").all(...list, result2, result);
    return {
      items: result4.map(videoRowToLibraryItem),
      total: local
    };
  } catch (error) {
    console.error("[DB] collectedVideosStore.queryPage 失败:", error);
    return {
      items: [],
      total: 0
    };
  }
}
function listVideoUrls(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    return arg1.prepare("SELECT video_url AS videoUrl FROM collected_videos").all().map(arg1 => String(arg1.videoUrl || "").trim()).filter(Boolean);
  } catch (error) {
    console.error("[DB] collectedVideosStore.listVideoUrls 失败:", error);
    return [];
  }
}
function listImportKeys(arg1) {
  if (!arg1) {
    return [];
  }
  try {
    return arg1.prepare("SELECT video_id AS videoId, video_url AS videoUrl FROM collected_videos").all().map(arg1 => ({
      videoId: String(arg1.videoId || "").trim(),
      videoUrl: String(arg1.videoUrl || "").trim()
    })).filter(arg1 => arg1.videoId || arg1.videoUrl);
  } catch (error) {
    console.error("[DB] collectedVideosStore.listImportKeys 失败:", error);
    return [];
  }
}
function listIds(arg1) {
  if (!arg1) {
    return new Set();
  }
  try {
    const result = arg1.prepare("SELECT id FROM collected_videos").all();
    return new Set(result.map(arg1 => String(arg1.id || "")).filter(Boolean));
  } catch (error) {
    return new Set();
  }
}
function count(arg1) {
  if (!arg1) {
    return 0;
  }
  try {
    return Number(arg1.prepare("SELECT COUNT(*) AS cnt FROM collected_videos").get()?.cnt) || 0;
  } catch (error) {
    return 0;
  }
}
function deleteByKeys(arg1, list = []) {
  if (!arg1 || !Array.isArray(list) || !list.length) {
    return 0;
  }
  const list2 = [...new Set(list.map(arg1 => toCollectedVideoKey(arg1) || String(arg1 || "").trim()).filter(Boolean))];
  if (!list2.length) {
    return 0;
  }
  let num = 0;
  const result = arg1.prepare("DELETE FROM collected_videos WHERE id = ?");
  const result2 = arg1.prepare("DELETE FROM collected_videos WHERE video_id = ?");
  const result3 = arg1.transaction(arg1 => {
    for (const item of arg1) {
      num += result.run(item).changes || 0;
      const result3 = extractAwemeId(item);
      if (result3) {
        num += result2.run(result3).changes || 0;
      }
    }
  });
  try {
    result3(list2);
    return num;
  } catch (error) {
    console.error("[DB] collectedVideosStore.deleteByKeys 失败:", error);
    return 0;
  }
}
function clearAll(arg1) {
  if (!arg1) {
    return 0;
  }
  try {
    return Number(arg1.prepare("DELETE FROM collected_videos").run()?.changes) || 0;
  } catch (error) {
    console.error("[DB] collectedVideosStore.clearAll 失败:", error);
    return 0;
  }
}
function getById(arg1, arg2) {
  if (!arg1 || !arg2) {
    return null;
  }
  const local = toCollectedVideoKey(arg2) || String(arg2).trim();
  try {
    const result = arg1.prepare("SELECT * FROM collected_videos WHERE id = ? OR video_id = ? LIMIT 1").get(local, extractAwemeId(local) || local);
    if (result) {
      return videoRowToLibraryItem(result);
    } else {
      return null;
    }
  } catch (error) {
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
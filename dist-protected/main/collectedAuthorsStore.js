'use strict';

const {
  splitVideoCardIntoCollectedRecords,
  toCollectedAuthorKey,
  extractAuthorSecUid,
  normalizeAuthorProfileUrl,
  authorRowToLibraryItem
} = require("../shared/collectedLeadKeys");
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS collected_authors (\n      id TEXT PRIMARY KEY,\n      sec_uid TEXT NOT NULL UNIQUE,\n      profile_url TEXT NOT NULL,\n      nickname TEXT DEFAULT '',\n      source_video_id TEXT DEFAULT '',\n      account_id TEXT DEFAULT '',\n      account_name TEXT DEFAULT '',\n      entry_source TEXT DEFAULT '',\n      search_keyword TEXT DEFAULT '',\n      captured_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL\n    );\n    CREATE INDEX IF NOT EXISTS idx_collected_authors_captured ON collected_authors(captured_at DESC);\n    CREATE INDEX IF NOT EXISTS idx_collected_authors_account ON collected_authors(account_id);\n  ");
}
function upsertOne(arg1, arg2) {
  if (!arg1 || !arg2) {
    return false;
  }
  const result = String(arg2.secUid || extractAuthorSecUid(arg2.id || arg2.profileUrl || "") || "").trim();
  if (!result) {
    return false;
  }
  const result2 = String(arg2.id || "author:" + result).trim();
  const result3 = String(arg2.profileUrl || normalizeAuthorProfileUrl(result)).trim();
  const local = Number(arg2.capturedAt) || Date.now();
  const result4 = JSON.stringify(arg2.raw || arg2);
  arg1.prepare("\n    INSERT INTO collected_authors (\n      id, sec_uid, profile_url, nickname, source_video_id,\n      account_id, account_name, entry_source, search_keyword, captured_at, raw_data\n    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n    ON CONFLICT(id) DO UPDATE SET\n      sec_uid = excluded.sec_uid,\n      profile_url = excluded.profile_url,\n      nickname = CASE WHEN excluded.nickname != '' THEN excluded.nickname ELSE collected_authors.nickname END,\n      source_video_id = CASE WHEN excluded.source_video_id != '' THEN excluded.source_video_id ELSE collected_authors.source_video_id END,\n      account_id = CASE WHEN excluded.account_id != '' THEN excluded.account_id ELSE collected_authors.account_id END,\n      account_name = CASE WHEN excluded.account_name != '' THEN excluded.account_name ELSE collected_authors.account_name END,\n      entry_source = CASE WHEN excluded.entry_source != '' THEN excluded.entry_source ELSE collected_authors.entry_source END,\n      search_keyword = CASE WHEN excluded.search_keyword != '' THEN excluded.search_keyword ELSE collected_authors.search_keyword END,\n      captured_at = CASE WHEN excluded.captured_at >= collected_authors.captured_at THEN excluded.captured_at ELSE collected_authors.captured_at END,\n      raw_data = excluded.raw_data\n  ").run(result2, result, result3, String(arg2.nickname || "").slice(0, 200), String(arg2.sourceVideoId || "").slice(0, 80), String(arg2.accountId || "").slice(0, 120), String(arg2.accountName || "").slice(0, 200), String(arg2.entrySource || "").slice(0, 80), String(arg2.searchKeyword || "").slice(0, 200), local, result4);
  return true;
}
function upsertFromLead(arg1, arg2) {
  const {
    author: author
  } = splitVideoCardIntoCollectedRecords(arg2);
  if (!author) {
    return false;
  }
  return upsertOne(arg1, author);
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
    const result = arg1.prepare("\n      SELECT * FROM collected_authors ORDER BY captured_at DESC\n    ").all();
    return result.map(authorRowToLibraryItem);
  } catch (error) {
    console.error("[DB] collectedAuthorsStore.listAll 失败:", error);
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
      text = "WHERE nickname LIKE ? OR profile_url LIKE ? OR search_keyword LIKE ?";
      const value = "%" + result3 + "%";
      list.push(value, value, value);
    }
    const local = Number(arg1.prepare("SELECT COUNT(*) AS cnt FROM collected_authors " + text).get(...list)?.cnt) || 0;
    const result4 = arg1.prepare("\n      SELECT *\n      FROM collected_authors\n      " + text + "\n      ORDER BY captured_at DESC\n      LIMIT ? OFFSET ?\n    ").all(...list, result2, result);
    return {
      items: result4.map(authorRowToLibraryItem),
      total: local
    };
  } catch (error) {
    console.error("[DB] collectedAuthorsStore.queryPage 失败:", error);
    return {
      items: [],
      total: 0
    };
  }
}
function listIds(arg1) {
  if (!arg1) {
    return new Set();
  }
  try {
    const result = arg1.prepare("SELECT id FROM collected_authors").all();
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
    return Number(arg1.prepare("SELECT COUNT(*) AS cnt FROM collected_authors").get()?.cnt) || 0;
  } catch (error) {
    return 0;
  }
}
function deleteByKeys(arg1, list = []) {
  if (!arg1 || !Array.isArray(list) || !list.length) {
    return 0;
  }
  const list2 = [...new Set(list.map(arg1 => toCollectedAuthorKey(arg1) || String(arg1 || "").trim()).filter(Boolean))];
  if (!list2.length) {
    return 0;
  }
  let num = 0;
  const result = arg1.prepare("DELETE FROM collected_authors WHERE id = ?");
  const result2 = arg1.prepare("DELETE FROM collected_authors WHERE sec_uid = ?");
  const result3 = arg1.transaction(arg1 => {
    for (const item of arg1) {
      num += result.run(item).changes || 0;
      const result3 = extractAuthorSecUid(item);
      if (result3) {
        num += result2.run(result3).changes || 0;
      }
    }
  });
  try {
    result3(list2);
    return num;
  } catch (error) {
    console.error("[DB] collectedAuthorsStore.deleteByKeys 失败:", error);
    return 0;
  }
}
function clearAll(arg1) {
  if (!arg1) {
    return 0;
  }
  try {
    return Number(arg1.prepare("DELETE FROM collected_authors").run()?.changes) || 0;
  } catch (error) {
    console.error("[DB] collectedAuthorsStore.clearAll 失败:", error);
    return 0;
  }
}
function getById(arg1, arg2) {
  if (!arg1 || !arg2) {
    return null;
  }
  const local = toCollectedAuthorKey(arg2) || String(arg2).trim();
  try {
    const result = arg1.prepare("SELECT * FROM collected_authors WHERE id = ? OR sec_uid = ? LIMIT 1").get(local, extractAuthorSecUid(local) || local);
    if (result) {
      return authorRowToLibraryItem(result);
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
  queryPage: queryPage,
  listIds: listIds,
  count: count,
  deleteByKeys: deleteByKeys,
  clearAll: clearAll,
  getById: getById
};
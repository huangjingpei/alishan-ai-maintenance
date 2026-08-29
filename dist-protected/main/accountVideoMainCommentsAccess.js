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
function ensureTables(arg1) {
  if (!arg1) {
    return;
  }
  arg1.exec("\n    CREATE TABLE IF NOT EXISTS account_video_main_comments (\n      account_id TEXT NOT NULL,\n      video_id TEXT NOT NULL,\n      updated_at INTEGER NOT NULL,\n      raw_data TEXT NOT NULL,\n      PRIMARY KEY (account_id, video_id)\n    );\n    CREATE INDEX IF NOT EXISTS idx_avmc_account_updated\n      ON account_video_main_comments(account_id, updated_at DESC);\n  ");
}
function collectLegacy(arg1) {
  if (!arg1 || typeof arg1.get !== "function") {
    return [];
  }
  const result = arg1.get(STORE_KEY, []);
  if (Array.isArray(result)) {
    return result.filter(arg1 => arg1 && typeof arg1 === "object");
  } else {
    return [];
  }
}
function parseRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result.accountId && arg1.account_id) {
      result.accountId = arg1.account_id;
    }
    if (!result.videoId && arg1.video_id) {
      result.videoId = arg1.video_id;
    }
    if (!result.timestamp && arg1.updated_at) {
      result.timestamp = arg1.updated_at;
    }
    return result;
  } catch (error) {
    return null;
  }
}
function toPayload(options = {}) {
  const local = String(options.accountId || options.account_id || "default").trim() || "default";
  let result = String(options.videoId || options.video_id || "").trim();
  if (!result) {
    result = extractDouyinVideoId(options.url || "") || "";
  }
  if (!result) {
    return null;
  }
  const local2 = Number(options.timestamp || options.updated_at || Date.now()) || Date.now();
  const result2 = String(options.content || options.comment || options.commentText || "").trim();
  const obj = {
    ...options,
    accountId: local,
    videoId: result,
    url: normalizeProcessedVideoKey(options.url || "") || options.url || "",
    title: options.title || "",
    platform: options.platform || "douyin",
    content: result2,
    timestamp: local2
  };
  return {
    accountId: local,
    videoId: result,
    updatedAt: local2,
    raw: obj
  };
}
function listAllFromDb(arg1) {
  ensureTables(arg1);
  return arg1.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    ORDER BY updated_at DESC\n  ").all().map(parseRow).filter(Boolean);
}
function listByAccountFromDb(arg1, arg2) {
  ensureTables(arg1);
  const local = String(arg2 || "default").trim() || "default";
  return arg1.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    WHERE account_id = ?\n    ORDER BY updated_at DESC\n  ").all(local).map(parseRow).filter(Boolean);
}
function findOneFromDb(arg1, arg2, arg3) {
  ensureTables(arg1);
  const local = String(arg2 || "default").trim() || "default";
  const result = String(arg3 || "").trim();
  if (!result) {
    return null;
  }
  const result2 = arg1.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    WHERE account_id = ? AND video_id = ?\n  ").get(local, result);
  return parseRow(result2);
}
function listVideoIdsByAccountFromDb(arg1, arg2) {
  ensureTables(arg1);
  const local = String(arg2 || "default").trim() || "default";
  return arg1.prepare("\n    SELECT video_id FROM account_video_main_comments WHERE account_id = ?\n  ").all(local).map(arg1 => String(arg1.video_id || "").trim()).filter(Boolean);
}
function queryPageFromDb(arg1, options = {}) {
  ensureTables(arg1);
  const result = Math.max(0, Number(options.offset) || 0);
  const result2 = Math.max(1, Math.min(500, Number(options.limit) || 20));
  const result3 = String(options.accountId || "").trim();
  const result4 = String(options.keyword || "").trim();
  const list = [];
  const list2 = [];
  if (result3) {
    list.push("account_id = ?");
    list2.push(result3);
  }
  if (result4) {
    const value = "%" + result4 + "%";
    list.push("(\n      video_id LIKE ?\n      OR account_id LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.title'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.url'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.content'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.comment'), '') LIKE ?\n      OR IFNULL(json_extract(raw_data, '$.accountName'), '') LIKE ?\n    )");
    list2.push(value, value, value, value, value, value, value);
  }
  const value = list.length ? "WHERE " + list.join(" AND ") : "";
  const local = Number(arg1.prepare("SELECT COUNT(*) AS c FROM account_video_main_comments " + value).get(...list2)?.c) || 0;
  const result5 = arg1.prepare("\n    SELECT account_id, video_id, updated_at, raw_data\n    FROM account_video_main_comments\n    " + value + "\n    ORDER BY updated_at DESC\n    LIMIT ? OFFSET ?\n  ").all(...list2, result2, result);
  return {
    items: result5.map(parseRow).filter(Boolean),
    total: local
  };
}
function countDb(arg1) {
  ensureTables(arg1);
  return Number(arg1.prepare("SELECT COUNT(*) AS c FROM account_video_main_comments").get()?.c) || 0;
}
function upsertManyDb(arg1, arg2) {
  ensureTables(arg1);
  const result = arg1.prepare("\n    INSERT INTO account_video_main_comments (account_id, video_id, updated_at, raw_data)\n    VALUES (?, ?, ?, ?)\n    ON CONFLICT(account_id, video_id) DO UPDATE SET\n      updated_at = CASE\n        WHEN excluded.updated_at >= account_video_main_comments.updated_at THEN excluded.updated_at\n        ELSE account_video_main_comments.updated_at\n      END,\n      raw_data = CASE\n        WHEN excluded.updated_at >= account_video_main_comments.updated_at THEN excluded.raw_data\n        ELSE account_video_main_comments.raw_data\n      END\n  ");
  let num = 0;
  const result2 = arg1.transaction(arg1 => {
    for (const item of arg1) {
      const result2 = toPayload(item);
      if (!result2) {
        continue;
      }
      result.run(result2.accountId, result2.videoId, result2.updatedAt, JSON.stringify(result2.raw));
      num += 1;
    }
  });
  result2(Array.isArray(arg2) ? arg2 : []);
  return num;
}
function clearLegacyStore(arg1) {
  if (!arg1) {
    return;
  }
  try {
    arg1.set(STORE_KEY, []);
    arg1.set(STORE_KEY + "_migrated_at", Date.now());
  } catch (error) {}
}
function runAccountVideoMainCommentsSqliteMigrationIfNeeded(arg1) {
  const result = getDb();
  if (!result) {
    return {
      skipped: true,
      reason: "no_db"
    };
  }
  ensureTables(result);
  const result2 = collectLegacy(arg1);
  const flag = isMigrationDone(result, MIGRATION_ID);
  if (flag && result2.length === 0) {
    return {
      skipped: true,
      reason: "already_done"
    };
  }
  if (flag && result2.length > 0) {
    console.warn("[Migrate] " + MIGRATION_ID + " 已 done 但 store 仍有 " + result2.length + " 条残留，补导入");
  }
  if (!result2.length) {
    markMigrationDone(result, MIGRATION_ID, {
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
  let obj = {
    backupPath: "",
    checksum: ""
  };
  try {
    obj = writeJsonBackup(getUserDataPath(), "account_video_main_comments", MIGRATION_ID, {
      count: result2.length,
      items: result2
    });
    const result = JSON.parse(fs.readFileSync(obj.backupPath, "utf8"));
    if (!Array.isArray(result.items) || result.items.length !== result2.length) {
      throw new Error("视频主评备份读回条数不一致");
    }
    console.log("[Migrate] 已备份 " + result2.length + " 条 account_video_main_comments → " + obj.backupPath);
  } catch (error) {
    console.error("[Migrate] account_video_main_comments 备份失败，中止迁移（保留 store）:", error);
    return {
      success: false,
      error: error.message || String(error),
      stage: "backup"
    };
  }
  const result3 = countDb(result);
  try {
    const result4 = upsertManyDb(result, result2);
    const result5 = countDb(result);
    const value = result2.filter(arg1 => !!toPayload(arg1)).length;
    if (value > 0 && result4 === 0 && result5 === result3) {
      throw new Error("校验失败：可解析 " + value + " 条但写入 0");
    }
    markMigrationDone(result, MIGRATION_ID, {
      backupPath: obj.backupPath,
      stats: {
        imported: result4,
        storeCount: result2.length,
        resolvable: value,
        sqliteCountBefore: result3,
        sqliteCountAfter: result5,
        checksum: obj.checksum,
        residualReimport: flag
      }
    });
    clearLegacyStore(arg1);
    console.log("[Migrate] " + MIGRATION_ID + " 完成: store=" + result2.length + " imported=" + result4 + " sqlite=" + result5);
    return {
      skipped: false,
      imported: result4,
      done: true,
      backupPath: obj.backupPath,
      sqliteCount: result5
    };
  } catch (error) {
    console.error("[Migrate] " + MIGRATION_ID + " 失败（保留 store + 备份）:", error);
    return {
      skipped: false,
      error: error.message || String(error),
      stage: "migrate",
      backupPath: obj.backupPath
    };
  }
}
function listByAccount(arg1, arg2) {
  const result = getDb();
  const local = arg2 || "default";
  if (result) {
    return listByAccountFromDb(result, local);
  }
  return collectLegacy(arg1).filter(arg1 => String(arg1.accountId || "default") === String(local));
}
function record(arg1, arg2, {
  url: url,
  title: title,
  platform: platform,
  content: content,
  comment: comment
} = {}) {
  const result = extractDouyinVideoId(url || "");
  if (!result) {
    return false;
  }
  const local = arg2 || "default";
  const result2 = String(content || comment || "").trim();
  const obj = {
    accountId: local,
    videoId: result,
    url: normalizeProcessedVideoKey(url) || url,
    title: title || "",
    platform: platform || "douyin",
    content: result2,
    timestamp: Date.now()
  };
  const result3 = getDb();
  if (result3) {
    const local2 = findOneFromDb(result3, local, result) || (url ? listByAccountFromDb(result3, local).find(arg1 => processedVideoKeysMatch(arg1.url, url)) : null);
    if (local2) {
      if (result2 && !String(local2.content || local2.comment || "").trim()) {
        upsertManyDb(result3, [{
          ...local2,
          ...obj,
          timestamp: local2.timestamp || obj.timestamp
        }]);
      }
      return true;
    }
    upsertManyDb(result3, [obj]);
    return true;
  }
  if (!arg1) {
    return false;
  }
  let result4 = collectLegacy(arg1);
  const result5 = result4.findIndex(arg1 => arg1.accountId === local && (arg1.videoId === result || processedVideoKeysMatch(arg1.url, url)));
  if (result5 >= 0) {
    if (result2 && !String(result4[result5].content || result4[result5].comment || "").trim()) {
      result4[result5] = {
        ...result4[result5],
        content: result2
      };
      arg1.set(STORE_KEY, result4);
    }
    return true;
  }
  result4.unshift(obj);
  if (result4.length > MAX_ROWS_STORE_FALLBACK) {
    result4 = result4.slice(0, MAX_ROWS_STORE_FALLBACK);
  }
  arg1.set(STORE_KEY, result4);
  return true;
}
function listAll(arg1) {
  const result = getDb();
  if (result) {
    return listAllFromDb(result);
  }
  return collectLegacy(arg1);
}
function findOne(arg1, arg2, arg3) {
  const result = getDb();
  const local = arg2 || "default";
  const result2 = String(arg3 || "").trim();
  if (result) {
    return findOneFromDb(result, local, result2);
  }
  return collectLegacy(arg1).find(arg1 => String(arg1.accountId || "default") === String(local) && String(arg1.videoId || "") === result2) || null;
}
function listVideoIdsByAccount(arg1, arg2) {
  const result = getDb();
  const local = arg2 || "default";
  if (result) {
    return listVideoIdsByAccountFromDb(result, local);
  }
  return collectLegacy(arg1).filter(arg1 => String(arg1.accountId || "default") === String(local)).map(arg1 => String(arg1.videoId || "").trim()).filter(Boolean);
}
function queryPage(arg1, options = {}) {
  const result = Math.max(1, Number(options.page) || Number(options.current) || 1);
  const result2 = Math.max(1, Math.min(500, Number(options.pageSize) || Number(options.limit) || 20));
  const value = (result - 1) * result2;
  const result3 = String(options.accountId || "").trim();
  const result4 = String(options.keyword || "").trim();
  const result5 = getDb();
  if (result5) {
    const result6 = queryPageFromDb(result5, {
      offset: value,
      limit: result2,
      accountId: result3,
      keyword: result4
    });
    return {
      ...result6,
      page: result,
      pageSize: result2
    };
  }
  let result6 = collectLegacy(arg1);
  if (result3) {
    result6 = result6.filter(arg1 => String(arg1.accountId || "default") === result3);
  }
  if (result4) {
    const result = result4.toLowerCase();
    result6 = result6.filter(arg1 => [arg1.title, arg1.url, arg1.videoId, arg1.accountId, arg1.accountName, arg1.content, arg1.comment].some(arg1 => String(arg1 || "").toLowerCase().includes(result)));
  }
  result6.sort((arg1, arg2) => (Number(arg2.timestamp) || 0) - (Number(arg1.timestamp) || 0));
  const value2 = result6.length;
  return {
    items: result6.slice(value, value + result2),
    total: value2,
    page: result,
    pageSize: result2
  };
}
function removeMany(arg1, arg2) {
  const value = Array.isArray(arg2) ? arg2 : [arg2];
  const list = [];
  for (const item of value) {
    if (typeof item === "string" && item.includes("::")) {
      const [local, local2] = item.split("::");
      if (local && local2) {
        list.push({
          accountId: local,
          videoId: local2
        });
      }
      continue;
    }
    if (item && typeof item === "object") {
      const local = String(item.accountId || "default").trim() || "default";
      let result = String(item.videoId || "").trim();
      if (!result) {
        result = extractDouyinVideoId(item.url || "") || "";
      }
      if (local && result) {
        list.push({
          accountId: local,
          videoId: result
        });
      }
    }
  }
  if (!list.length) {
    return 0;
  }
  const result = getDb();
  if (result) {
    ensureTables(result);
    const result2 = result.prepare("DELETE FROM account_video_main_comments WHERE account_id = ? AND video_id = ?");
    let num = 0;
    const result3 = result.transaction(arg1 => {
      for (const item of arg1) {
        const result = result2.run(item.accountId, item.videoId);
        num += Number(result?.changes) || 0;
      }
    });
    result3(list);
    return num;
  }
  if (!arg1) {
    return 0;
  }
  const result2 = collectLegacy(arg1);
  const set = new Set(list.map(arg1 => arg1.accountId + "::" + arg1.videoId));
  const result3 = result2.filter(arg1 => {
    const result = String(arg1.accountId || "default");
    const result2 = String(arg1.videoId || extractDouyinVideoId(arg1.url || "") || "");
    return !set.has(result + "::" + result2);
  });
  const value2 = result2.length - result3.length;
  if (value2 > 0) {
    arg1.set(STORE_KEY, result3);
  }
  return value2;
}
function clearAll(arg1) {
  const result = getDb();
  if (result) {
    ensureTables(result);
    const result2 = countDb(result);
    result.prepare("DELETE FROM account_video_main_comments").run();
    return result2;
  }
  const value = collectLegacy(arg1).length;
  clearLegacyStore(arg1);
  return value;
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
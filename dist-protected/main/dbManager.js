const path = require("path");
const fs = require("fs");
const collectedVideosStore = require("./collectedVideosStore");
const collectedAuthorsStore = require("./collectedAuthorsStore");
const leadsCollectedSplitMigrate = require("./leadsCollectedSplitMigrate");
const collectedLibraryWrite = require("./collectedLibraryWrite");
const leadsSecUidBackfill = require("./leadsSecUidBackfill");
const processedVideosStore = require("./processedVideosStore");
const processedVideosAccess = require("./processedVideosAccess");
const batchFollowRunsAccess = require("./batchFollowRunsAccess");
const monitorTaskSeenAccess = require("./monitorTaskSeenAccess");
const accountVideoMainCommentsAccess = require("./accountVideoMainCommentsAccess");
const entityLeadgenLeadsQuery = require("./entityLeadgenLeadsQuery");
let db = null;
let isInitialized = false;
let activeDbPath = null;
let activeUserDataPath = null;
function initDatabase(arg1) {
  const result = path.join(arg1, "huoke_radar.db");
  if (isInitialized && db && activeDbPath === result) {
    return db;
  }
  try {
    if (db) {
      try {
        db.close();
      } catch (error) {}
      db = null;
      isInitialized = false;
      activeDbPath = null;
      activeUserDataPath = null;
    }
    if (!fs.existsSync(arg1)) {
      fs.mkdirSync(arg1, {
        recursive: true
      });
    }
    const betterSqlite3 = require("better-sqlite3");
    console.log("[DB] 正在连接 SQLite 数据库: " + result);
    db = new betterSqlite3(result, {
      timeout: 5000
    });
    db.pragma("journal_mode = WAL");
    db.pragma("busy_timeout = 5000");
    db.pragma("synchronous = NORMAL");
    db.pragma("foreign_keys = ON");
    createTablesSchema();
    activeUserDataPath = arg1;
    processedVideosStore.ensureTables(db);
    batchFollowRunsAccess.ensureTables(db);
    monitorTaskSeenAccess.ensureTables(db);
    accountVideoMainCommentsAccess.ensureTables(db);
    isInitialized = true;
    activeDbPath = result;
    console.log("[DB] SQLite 数据库已成功初始化，WAL 模式生效");
    return db;
  } catch (error) {
    console.error("[DB] SQLite 数据库初始化失败:", error);
    throw error;
  }
}
function runCollectedLibraryMigrations(arg1 = activeUserDataPath, arg2 = null) {
  if (!db) {
    return {
      ok: false,
      error: "db_not_ready"
    };
  }
  const local = arg1 || activeUserDataPath;
  const obj = {
    ok: true,
    split: null,
    secUid: null,
    processedVideos: null,
    batchFollowRuns: null,
    monitorTaskSeen: null,
    monitorTaskDetails: null,
    accountVideoMainComments: null
  };
  try {
    obj.split = leadsCollectedSplitMigrate.runLeadsCollectedSplitMigrationIfNeeded(db, local);
  } catch (error) {
    console.error("[DB] leads_split_collected_v1 迁移异常（不影响启动）:", error);
    obj.split = {
      error: error.message || String(error)
    };
    obj.ok = false;
  }
  try {
    obj.secUid = leadsSecUidBackfill.runLeadsSecUidBackfillIfNeeded(db);
  } catch (error) {
    console.error("[DB] leads_sec_uid_backfill_v1 异常（不影响启动）:", error);
    obj.secUid = {
      error: error.message || String(error)
    };
  }
  try {
    obj.processedVideos = processedVideosAccess.runProcessedVideosSqliteMigrationIfNeeded(arg2);
  } catch (error) {
    console.error("[DB] processed_videos_sqlite_v1 异常（不影响启动）:", error);
    obj.processedVideos = {
      error: error.message || String(error)
    };
  }
  try {
    obj.batchFollowRuns = batchFollowRunsAccess.runBatchFollowRunsSqliteMigrationIfNeeded(arg2);
  } catch (error) {
    console.error("[DB] batch_follow_runs_sqlite_v1 异常（不影响启动）:", error);
    obj.batchFollowRuns = {
      error: error.message || String(error)
    };
  }
  try {
    obj.monitorTaskSeen = monitorTaskSeenAccess.runMonitorTaskSeenSqliteMigrationIfNeeded(arg2);
  } catch (error) {
    console.error("[DB] monitor_task_seen_sqlite_v1 异常（不影响启动）:", error);
    obj.monitorTaskSeen = {
      error: error.message || String(error)
    };
  }
  try {
    const monitorTaskDetailsStore = require("./monitorTaskDetailsStore");
    monitorTaskDetailsStore.ensureTables(db);
    obj.monitorTaskDetails = {
      ok: true
    };
  } catch (error) {
    console.error("[DB] monitor_task_details 建表异常（不影响启动）:", error);
    obj.monitorTaskDetails = {
      error: error.message || String(error)
    };
  }
  try {
    obj.accountVideoMainComments = accountVideoMainCommentsAccess.runAccountVideoMainCommentsSqliteMigrationIfNeeded(arg2);
  } catch (error) {
    console.error("[DB] account_video_main_comments_sqlite_v1 异常（不影响启动）:", error);
    obj.accountVideoMainComments = {
      error: error.message || String(error)
    };
  }
  return obj;
}
function createTablesSchema() {
  if (!db) {
    return;
  }
  db.exec("\n        -- 迁移日志记录表\n        CREATE TABLE IF NOT EXISTS sys_migrations (\n            name TEXT PRIMARY KEY,\n            executed_at INTEGER NOT NULL\n        );\n\n        -- 关键系统 KV 存储表（用于基础标记）\n        CREATE TABLE IF NOT EXISTS sys_kv (\n            key TEXT PRIMARY KEY,\n            value TEXT NOT NULL,\n            updated_at INTEGER NOT NULL\n        );\n\n        -- 账号池表\n        CREATE TABLE IF NOT EXISTS accounts (\n            id TEXT PRIMARY KEY,\n            platform TEXT NOT NULL,\n            name TEXT,\n            nickname TEXT,\n            avatar TEXT,\n            cookie TEXT,\n            fingerprintSeed TEXT,\n            fingerprintPolicy TEXT,\n            created_at INTEGER,\n            updated_at INTEGER,\n            raw_data TEXT NOT NULL\n        );\n\n        -- 已处理视频明细表\n        CREATE TABLE IF NOT EXISTS processed_videos (\n            video_id TEXT PRIMARY KEY,\n            title TEXT,\n            author TEXT,\n            lead_count INTEGER DEFAULT 0,\n            updated_at INTEGER NOT NULL,\n            raw_data TEXT NOT NULL\n        );\n\n        -- 捕获线索明细表\n        CREATE TABLE IF NOT EXISTS leads (\n            id TEXT PRIMARY KEY,\n            lead_user_id TEXT,\n            nickname TEXT,\n            video_id TEXT,\n            video_title TEXT,\n            account_id TEXT,\n            content TEXT,\n            captured_at INTEGER NOT NULL,\n            raw_data TEXT NOT NULL,\n            is_high_intention INTEGER DEFAULT 0,\n            lead_kind TEXT DEFAULT '',\n            entry_source TEXT DEFAULT '',\n            search_keyword TEXT DEFAULT '',\n            account_name TEXT DEFAULT '',\n            location TEXT DEFAULT '',\n            sec_uid TEXT DEFAULT '',\n            last_batch_follow_result TEXT DEFAULT ''\n        );\n\n        -- 监控任务通知去重 Hash 表\n        CREATE TABLE IF NOT EXISTS monitor_notified_keys (\n            key_hash TEXT PRIMARY KEY,\n            created_at INTEGER NOT NULL\n        );\n\n        -- AI 智能体配置与 Prompt 模板表\n        CREATE TABLE IF NOT EXISTS ai_agents (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL,\n            description TEXT,\n            system_prompt TEXT,\n            model TEXT,\n            updated_at INTEGER NOT NULL,\n            raw_data TEXT NOT NULL\n        );\n\n        -- 线索采集任务表（原 entity_leadgen_tasks.enc）\n        CREATE TABLE IF NOT EXISTS entity_leadgen_tasks (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL,\n            status TEXT NOT NULL DEFAULT 'draft',\n            created_at INTEGER NOT NULL,\n            started_at INTEGER,\n            ended_at INTEGER,\n            end_reason TEXT DEFAULT '',\n            remark TEXT DEFAULT '',\n            updated_at INTEGER NOT NULL,\n            raw_data TEXT NOT NULL\n        );\n\n        -- 线索采集任务明细（任务详情「采集明细」）\n        CREATE TABLE IF NOT EXISTS entity_leadgen_leads (\n            id TEXT PRIMARY KEY,\n            task_id TEXT NOT NULL,\n            ts INTEGER NOT NULL,\n            nickname TEXT DEFAULT '',\n            source_type TEXT DEFAULT '',\n            account_id TEXT DEFAULT '',\n            raw_data TEXT NOT NULL,\n            FOREIGN KEY (task_id) REFERENCES entity_leadgen_tasks(id) ON DELETE CASCADE\n        );\n\n        -- 创建查询优化索引\n        CREATE INDEX IF NOT EXISTS idx_leads_captured_at ON leads(captured_at DESC);\n        CREATE INDEX IF NOT EXISTS idx_leads_account_id ON leads(account_id);\n        CREATE INDEX IF NOT EXISTS idx_processed_videos_updated ON processed_videos(updated_at DESC);\n        CREATE INDEX IF NOT EXISTS idx_entity_leadgen_tasks_created ON entity_leadgen_tasks(created_at DESC);\n        CREATE INDEX IF NOT EXISTS idx_entity_leadgen_leads_task_ts ON entity_leadgen_leads(task_id, ts DESC);\n\n        CREATE TABLE IF NOT EXISTS monitor_task_matches (\n            id TEXT PRIMARY KEY,\n            task_id TEXT NOT NULL,\n            ts INTEGER NOT NULL,\n            nickname TEXT DEFAULT '',\n            account_id TEXT DEFAULT '',\n            matched INTEGER NOT NULL DEFAULT 1,\n            raw_data TEXT NOT NULL\n        );\n        CREATE TABLE IF NOT EXISTS monitor_task_cycles (\n            id TEXT PRIMARY KEY,\n            task_id TEXT NOT NULL,\n            round INTEGER NOT NULL DEFAULT 1,\n            started_at INTEGER,\n            ended_at INTEGER,\n            status TEXT DEFAULT 'done',\n            raw_data TEXT NOT NULL\n        );\n        CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_ts ON monitor_task_matches(task_id, ts DESC);\n        CREATE INDEX IF NOT EXISTS idx_monitor_task_matches_task_matched ON monitor_task_matches(task_id, matched);\n        CREATE INDEX IF NOT EXISTS idx_monitor_task_cycles_task_started ON monitor_task_cycles(task_id, started_at DESC);\n\n        CREATE TABLE IF NOT EXISTS monitor_task_video_comments (\n            id TEXT PRIMARY KEY,\n            task_id TEXT NOT NULL,\n            ts INTEGER NOT NULL,\n            account_id TEXT DEFAULT '',\n            video_id TEXT DEFAULT '',\n            status TEXT DEFAULT 'success',\n            raw_data TEXT NOT NULL\n        );\n        CREATE INDEX IF NOT EXISTS idx_monitor_task_video_comments_task_ts\n          ON monitor_task_video_comments(task_id, ts DESC);\n\n        CREATE TABLE IF NOT EXISTS self_warmup_events (\n            id TEXT PRIMARY KEY,\n            task_id TEXT NOT NULL,\n            ts INTEGER NOT NULL,\n            nickname TEXT DEFAULT '',\n            account_id TEXT DEFAULT '',\n            matched INTEGER NOT NULL DEFAULT 1,\n            seen_key TEXT DEFAULT '',\n            raw_data TEXT NOT NULL\n        );\n        CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_ts ON self_warmup_events(task_id, ts DESC);\n        CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_seen ON self_warmup_events(task_id, seen_key);\n        CREATE INDEX IF NOT EXISTS idx_self_warmup_events_task_nick ON self_warmup_events(task_id, nickname);\n    ");
  ensureLeadSchemaColumns();
  db.exec("\n        CREATE INDEX IF NOT EXISTS idx_leads_lead_user_id ON leads(lead_user_id);\n        CREATE INDEX IF NOT EXISTS idx_leads_nickname ON leads(nickname);\n        CREATE INDEX IF NOT EXISTS idx_leads_lead_kind ON leads(lead_kind);\n        CREATE INDEX IF NOT EXISTS idx_leads_intention ON leads(is_high_intention);\n        CREATE INDEX IF NOT EXISTS idx_leads_account_name ON leads(account_name);\n        CREATE INDEX IF NOT EXISTS idx_leads_entry_source ON leads(entry_source);\n    ");
  collectedVideosStore.ensureTables(db);
  collectedAuthorsStore.ensureTables(db);
  leadsCollectedSplitMigrate.ensureSchemaMigrationsTable(db);
}
function tableHasColumn(arg1, arg2) {
  if (!db) {
    return false;
  }
  try {
    const result = db.prepare("PRAGMA table_info(" + arg1 + ")").all();
    return result.some(arg1 => String(arg1.name) === String(arg2));
  } catch (error) {
    return false;
  }
}
function ensureLeadSchemaColumns() {
  if (!db) {
    return;
  }
  const list = [["is_high_intention", "INTEGER DEFAULT 0"], ["lead_kind", "TEXT DEFAULT ''"], ["entry_source", "TEXT DEFAULT ''"], ["search_keyword", "TEXT DEFAULT ''"], ["account_name", "TEXT DEFAULT ''"], ["location", "TEXT DEFAULT ''"], ["sec_uid", "TEXT DEFAULT ''"], ["last_batch_follow_result", "TEXT DEFAULT ''"]];
  for (const [local, local2] of list) {
    if (!tableHasColumn("leads", local)) {
      try {
        db.exec("ALTER TABLE leads ADD COLUMN " + local + " " + local2);
      } catch (error) {
        console.warn("[DB] ALTER leads ADD " + local + " 失败:", error.message);
      }
    }
  }
  try {
    db.exec("\n            CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_sec_uid_unique\n            ON leads(sec_uid)\n            WHERE sec_uid IS NOT NULL AND sec_uid != ''\n        ");
  } catch (error) {
    console.warn("[DB] CREATE UNIQUE INDEX idx_leads_sec_uid_unique 失败:", error.message);
  }
}
function extractLeadLocation(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return "";
  }
  const local = arg1.location || arg1.ipLocation || arg1.region || arg1.city || "";
  return String(local || "").trim().slice(0, 80);
}
function resolveLeadCapturedAtMs(arg1, arg2 = Date.now()) {
  if (!arg1 || typeof arg1 !== "object") {
    return arg2;
  }
  const value = arg1.timestamp;
  const result = Number(value);
  if (Number.isFinite(result) && result > 100000000000) {
    return Math.floor(result);
  }
  if (Number.isFinite(result) && result > 1000000000 && result < 100000000000) {
    return Math.floor(result * 1000);
  }
  const result2 = Date.parse(value || "");
  if (Number.isFinite(result2) && result2 > 0) {
    return result2;
  }
  const result3 = Date.parse(arg1.capturedAt || "");
  if (Number.isFinite(result3) && result3 > 0) {
    return result3;
  }
  const result4 = Number(arg1.ts);
  if (Number.isFinite(result4) && result4 > 100000000000) {
    return Math.floor(result4);
  }
  if (Number.isFinite(result4) && result4 > 1000000000 && result4 < 100000000000) {
    return Math.floor(result4 * 1000);
  }
  return arg2;
}
function isVideoCardLeadLike(options = {}) {
  if (!options || typeof options !== "object") {
    return false;
  }
  try {
    const leadUserKey = require("../shared/leadUserKey");
    return !!leadUserKey.isVideoLeadRecord(options);
  } catch (error) {
    if (options.leadKind === "video_card" || options.sourceType === "video" || options.identityType === "video") {
      return true;
    }
    const result = String(options.leadId || options.userKey || options.key || options.id || "").trim();
    if (/^video:\d{10,}$/.test(result)) {
      return true;
    }
    const result2 = String(options.userUrl || "").trim();
    return /(?:video|note)\/\d{10,}/i.test(result2);
  }
}
function normalizeVideoCardLeadForPool(options = {}) {
  const value = options && typeof options === "object" ? {
    ...options
  } : {};
  let text = "";
  try {
    const {
      extractDouyinVideoId: extractDouyinVideoId
    } = require("../shared/processedVideoKey");
    text = extractDouyinVideoId(value.videoUrl || value.url || value.content || "") || "";
  } catch (error) {
    text = "";
  }
  if (!text) {
    const result = String(value.leadId || value.userKey || value.key || value.id || "").match(/^video:(\d{10,})$/);
    if (result) {
      text = result[1];
    }
  }
  if (!text) {
    const result = String(value.videoUrl || value.url || value.content || "").match(/(?:video|note)\/(\d{10,})/i);
    if (result) {
      text = result[1];
    }
  }
  if (!text) {
    return null;
  }
  const value2 = "https://www.douyin.com/video/" + text;
  const value3 = "video:" + text;
  const result = resolveLeadCapturedAtMs(value, Date.now());
  const local = String(value.title || value.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
  const result2 = Array.isArray(value.collectedFields);
  const value4 = result2 ? value.collectedFields.map(String).filter(Boolean) : [];
  if (!result2 || value4.length === 0) {
    value4.push("video");
  }
  return {
    ...value,
    platform: value.platform || "DY",
    leadKind: "video_card",
    leadId: value3,
    key: value3,
    userKey: value3,
    title: local,
    nickname: value.nickname && value.nickname !== local ? value.nickname : value.authorNickname || "未知作者",
    content: value.content || "",
    timeText: value.timeText || "卡片采集",
    userUrl: value.userUrl || "",
    authorProfileUrl: value.authorProfileUrl || "",
    url: value2,
    videoUrl: value2,
    identityType: "video",
    profileAvailable: false,
    profileUnavailable: true,
    profileUnavailableReason: value.profileUnavailableReason || "视频作品链接",
    collectedFields: value4,
    sourceType: "video",
    entrySource: value.entrySource || "entity_video",
    entryLabel: value.entryLabel || "线索采集：视频作品链接",
    searchKeyword: String(value.searchKeyword || ""),
    timestamp: result,
    capturedAt: value.capturedAt || new Date(result).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function extractLeadColumns(arg1) {
  let value = arg1 && typeof arg1 === "object" ? {
    ...arg1
  } : {};
  const result = Date.now();
  if (isVideoCardLeadLike(value)) {
    const result = normalizeVideoCardLeadForPool(value);
    if (result) {
      value = result;
    } else {
      value.leadKind = "video_card";
      if (value.sourceType === "video" || !value.sourceType) {
        value.sourceType = "video";
      }
    }
  }
  let local = null;
  try {
    local = require("../shared/leadUserKey");
  } catch (error) {
    local = null;
  }
  const value2 = local ? String(local.getPersonLeadSecUid?.(value) || "").trim() : "";
  let text = "";
  try {
    text = String(local?.getLeadUserKey(value) || "").trim();
  } catch (error) {
    text = "";
  }
  let text2 = "";
  if (isVideoCardLeadLike(value)) {
    text2 = String(value.leadId || value.key || text || value.id || "lead_" + result);
  } else if (value2) {
    text2 = value2;
    value.secUid = value2;
    value.leadId = value2;
    value.key = value2;
    value.userKey = value2;
  } else {
    const value2 = local?.buildLeadId ? String(local.buildLeadId({
      ...value,
      leadId: local.isTransientLeadIdentityKey?.(value.leadId) ? "" : value.leadId,
      key: local.isTransientLeadIdentityKey?.(value.key) ? "" : value.key,
      userKey: local.isDouyinSecUid?.(value.userKey) ? value.userKey : ""
    }) || "").trim() : "";
    text2 = value2 || "lead_" + result;
    value.leadId = text2;
    value.key = text2;
  }
  const result2 = resolveLeadCapturedAtMs(value, result);
  value.timestamp = result2;
  if (!value.capturedAt) {
    value.capturedAt = new Date(result2).toISOString();
  }
  const result3 = String(value.leadKind || value.sourceType || value.identityType || "").slice(0, 40);
  const value3 = result3 === "video" || value.leadKind === "video_card" ? "video_card" : result3;
  const obj = {
    ...value
  };
  delete obj.lastBatchFollowResult;
  return {
    id: text2,
    lead_user_id: String(value2 || text || value.leadUserId || text2 || "").slice(0, 200),
    sec_uid: value2.slice(0, 200),
    nickname: String(value.nickname || "").slice(0, 200),
    video_id: String(value.videoId || (String(text2).startsWith("video:") ? text2.slice(6) : "") || "").slice(0, 80),
    video_title: String(value.title || value.videoTitle || "").slice(0, 300),
    account_id: String(value.accountId || "").slice(0, 120),
    content: String(value.content || value.comment || "").slice(0, 2000),
    captured_at: result2,
    is_high_intention: value.isHighIntention ? 1 : 0,
    lead_kind: value3,
    entry_source: String(value.entrySource || "").slice(0, 60),
    search_keyword: String(value.searchKeyword || "").slice(0, 120),
    account_name: String(value.accountName || "").slice(0, 120),
    location: extractLeadLocation(value),
    raw_data: JSON.stringify(obj)
  };
}
function parseLeadRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result.leadId && arg1.id) {
      result.leadId = arg1.id;
    }
    if (!result.key && arg1.id) {
      result.key = arg1.id;
    }
    const local = Number(arg1.captured_at) || 0;
    const result2 = resolveLeadCapturedAtMs(result, 0);
    const local2 = (result2 > 0 ? result2 : 0) || (local > 0 ? local : 0);
    if (local2 > 0) {
      const local = Number(result.timestamp) > 0 || Number.isFinite(Date.parse(result.timestamp || "")) && Date.parse(result.timestamp) > 0;
      if (!local) {
        result.timestamp = local2;
      }
      if (!result.capturedAt) {
        result.capturedAt = new Date(local2).toISOString();
      }
    }
    const result3 = String(arg1.last_batch_follow_result || "").trim();
    if (result3) {
      try {
        const result2 = JSON.parse(result3);
        if (result2 && typeof result2 === "object") {
          result.lastBatchFollowResult = result2;
        }
      } catch (error) {
        if (result3 === "success" || result3 === "failed") {
          result.lastBatchFollowResult = {
            status: result3
          };
        }
      }
    } else {
      delete result.lastBatchFollowResult;
    }
    return result;
  } catch (error) {
    return null;
  }
}
function getKV(arg1, arg2 = null) {
  if (!db) {
    return arg2;
  }
  try {
    const result = db.prepare("SELECT value FROM sys_kv WHERE key = ?");
    const result2 = result.get(arg1);
    if (!result2) {
      return arg2;
    }
    try {
      return JSON.parse(result2.value);
    } catch (error) {
      return result2.value;
    }
  } catch (error) {
    console.error("[DB] getKV失败 [" + arg1 + "]:", error);
    return arg2;
  }
}
function setKV(arg1, arg2) {
  if (!db) {
    return false;
  }
  try {
    const value = typeof arg2 === "object" ? JSON.stringify(arg2) : String(arg2);
    const result = db.prepare("\n            INSERT INTO sys_kv (key, value, updated_at)\n            VALUES (?, ?, ?)\n            ON CONFLICT(key) DO UPDATE SET\n                value = excluded.value,\n                updated_at = excluded.updated_at\n        ");
    result.run(arg1, value, Date.now());
    return true;
  } catch (error) {
    console.error("[DB] setKV失败 [" + arg1 + "]:", error);
    return false;
  }
}
function getAccountPool() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("SELECT raw_data FROM accounts ORDER BY updated_at DESC");
    const result2 = result.all();
    return result2.map(arg1 => {
      try {
        return JSON.parse(arg1.raw_data);
      } catch (error) {
        return null;
      }
    }).filter(Boolean);
  } catch (error) {
    console.error("[DB] getAccountPool 失败:", error);
    return [];
  }
}
function saveAccountPool(arg1) {
  if (!db || !Array.isArray(arg1)) {
    return false;
  }
  try {
    const result = db.prepare("DELETE FROM accounts");
    const result2 = db.prepare("\n            INSERT INTO accounts (id, platform, name, nickname, avatar, cookie, fingerprintSeed, fingerprintPolicy, created_at, updated_at, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ");
    const result3 = db.transaction(arg1 => {
      result.run();
      const result3 = Date.now();
      for (const item of arg1) {
        if (!item || !item.id) {
          continue;
        }
        result2.run(String(item.id), String(item.platform || "douyin"), item.name || "", item.nickname || "", item.avatar || "", item.cookie || "", item.fingerprintSeed || "", item.fingerprintPolicy || "passthrough", item.created_at || result3, result3, JSON.stringify(item));
      }
    });
    result3(arg1);
    return true;
  } catch (error) {
    console.error("[DB] saveAccountPool 失败:", error);
    return false;
  }
}
function getProcessedVideosDetail() {
  if (!db) {
    return [];
  }
  return processedVideosStore.listAll(db);
}
function saveProcessedVideosDetail(arg1) {
  if (!db || !Array.isArray(arg1)) {
    return false;
  }
  return processedVideosStore.replaceAll(db, arg1);
}
function getMonitorNotifiedKeys() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("SELECT key_hash FROM monitor_notified_keys");
    return result.all().map(arg1 => arg1.key_hash);
  } catch (error) {
    console.error("[DB] getMonitorNotifiedKeys 失败:", error);
    return [];
  }
}
function saveMonitorNotifiedKeys(arg1) {
  if (!db || !Array.isArray(arg1)) {
    return false;
  }
  try {
    const result = db.prepare("\n            INSERT INTO monitor_notified_keys (key_hash, created_at)\n            VALUES (?, ?)\n            ON CONFLICT(key_hash) DO NOTHING\n        ");
    const result2 = db.transaction(arg1 => {
      const result2 = Date.now();
      for (const item of arg1) {
        if (!item) {
          continue;
        }
        result.run(String(item), result2);
      }
    });
    result2(arg1);
    return true;
  } catch (error) {
    console.error("[DB] saveMonitorNotifiedKeys 失败:", error);
    return false;
  }
}
function saveLeadsBatch(arg1) {
  if (!db || !Array.isArray(arg1)) {
    return 0;
  }
  try {
    ensureLeadSchemaColumns();
    const result = db.prepare("\n            INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n            )\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                lead_user_id = excluded.lead_user_id,\n                nickname = excluded.nickname,\n                video_id = excluded.video_id,\n                video_title = excluded.video_title,\n                account_id = excluded.account_id,\n                content = excluded.content,\n                captured_at = excluded.captured_at,\n                raw_data = excluded.raw_data,\n                is_high_intention = excluded.is_high_intention,\n                lead_kind = excluded.lead_kind,\n                entry_source = excluded.entry_source,\n                search_keyword = excluded.search_keyword,\n                account_name = excluded.account_name,\n                location = excluded.location,\n                sec_uid = excluded.sec_uid\n        ");
    let num = 0;
    const result2 = db.transaction(arg1 => {
      for (let num2 = 0; num2 < arg1.length; num2++) {
        const value = arg1[num2];
        if (!value || typeof value !== "object") {
          continue;
        }
        if (collectedLibraryWrite.isCollectedRouteLead(value)) {
          if (collectedLibraryWrite.upsertCollectedFromLead(db, value).written) {
            num++;
          }
          continue;
        }
        const result2 = extractLeadColumns(value);
        if (!result2.id) {
          continue;
        }
        result.run(result2.id, result2.lead_user_id, result2.nickname, result2.video_id, result2.video_title, result2.account_id, result2.content, result2.captured_at, result2.raw_data, result2.is_high_intention, result2.lead_kind, result2.entry_source, result2.search_keyword, result2.account_name, result2.location, result2.sec_uid);
        num++;
      }
    });
    result2(arg1);
    return num;
  } catch (error) {
    console.error("[DB] saveLeadsBatch 失败:", error);
    return 0;
  }
}
function getLeadById(arg1) {
  if (!db || !arg1) {
    return null;
  }
  try {
    const result = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads WHERE id = ?").get(String(arg1));
    return parseLeadRow(result);
  } catch (error) {
    console.error("[DB] getLeadById 失败:", error);
    return null;
  }
}
function listLeadsByIds(list = [], options = {}) {
  if (!db) {
    return [];
  }
  const result = (Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  if (!result.length) {
    return [];
  }
  const list2 = [...new Set(result)];
  const result2 = Math.max(1, Math.min(100000, Number(options.limit) || list2.length));
  const result3 = Math.max(50, Math.min(400, Number(options.chunkSize) || 300));
  try {
    ensureLeadSchemaColumns();
    const map = new Map();
    const map2 = new Map();
    for (let num = 0; num < list2.length; num += result3) {
      const result = list2.slice(num, num + result3);
      const result2 = result.map(() => "?").join(",");
      const result4 = db.prepare("\n                SELECT id, captured_at, raw_data, lead_user_id, last_batch_follow_result FROM leads\n                WHERE id IN (" + result2 + ") OR lead_user_id IN (" + result2 + ")\n            ").all(...result, ...result);
      for (const item of result4) {
        const result = parseLeadRow(item);
        if (!result) {
          continue;
        }
        const result2 = String(item.id || result.leadId || "");
        if (!result2) {
          continue;
        }
        if (!map.has(result2)) {
          map.set(result2, result);
        }
        map2.set(result2, result2);
        const result3 = String(item.lead_user_id || result.leadUserId || result.userKey || "").trim();
        if (result3) {
          map2.set(result3, result2);
        }
        if (result.leadId) {
          map2.set(String(result.leadId), result2);
        }
        if (result.key) {
          map2.set(String(result.key), result2);
        }
      }
    }
    const list = [];
    const set = new Set();
    for (const item of result) {
      const result = map2.get(item);
      if (!result || set.has(result)) {
        continue;
      }
      const result3 = map.get(result);
      if (!result3) {
        continue;
      }
      set.add(result);
      list.push(result3);
      if (list.length >= result2) {
        break;
      }
    }
    return list;
  } catch (error) {
    console.error("[DB] listLeadsByIds 失败:", error);
    return [];
  }
}
function getLeadByUserKey(arg1) {
  if (!db || !arg1) {
    return null;
  }
  try {
    const result = String(arg1);
    const result2 = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(result, result);
    return parseLeadRow(result2);
  } catch (error) {
    console.error("[DB] getLeadByUserKey 失败:", error);
    return null;
  }
}
function findLeadRowId(arg1) {
  if (!db || arg1 == null) {
    return null;
  }
  try {
    let text = "";
    let local = null;
    if (typeof arg1 === "object") {
      local = arg1;
      try {
        const leadUserKey = require("../shared/leadUserKey");
        text = String(leadUserKey.getLeadUserKey(local) || local.leadId || local.key || "").trim();
      } catch (error) {
        text = String(local.leadId || local.key || "").trim();
      }
    } else {
      text = String(arg1).trim();
    }
    if (!text) {
      return null;
    }
    const result = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(text, text);
    if (result?.id) {
      return String(result.id);
    }
    if (local && typeof local === "object") {
      const result = String(local.nickname || "").trim();
      const result2 = String(local.content || local.comment || "").trim();
      let text2 = "";
      try {
        const leadUserKey = require("../shared/leadUserKey");
        text2 = String(leadUserKey.getLeadUserKey(local) || "").trim();
      } catch (error) {
        text2 = "";
      }
      if (result && result2) {
        const value = result + "_" + result2;
        if (value && value !== text) {
          const result = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(value, value);
          if (result?.id) {
            return String(result.id);
          }
        }
      }
      if (result && text2) {
        const list = [result + "_", result];
        for (const item of list) {
          if (!item || item === text || item === text2) {
            continue;
          }
          const result3 = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(item, item);
          if (!result3?.id) {
            continue;
          }
          const result4 = getLeadById(result3.id);
          if (!result4) {
            continue;
          }
          let text3 = "";
          try {
            const leadUserKey = require("../shared/leadUserKey");
            if (leadUserKey.isVideoLeadRecord?.(result4)) {
              continue;
            }
            text3 = String(leadUserKey.getLeadUserKey(result4) || "").trim();
          } catch (error) {
            text3 = "";
          }
          if (text3 && text3 !== item && text3 !== result && text3 !== result + "_") {
            continue;
          }
          const result5 = String(result4.content || result4.comment || "").trim();
          if (result5 && result2 && result5 !== result2) {
            continue;
          }
          return String(result3.id);
        }
        try {
          const result2 = db.prepare("\n                        SELECT id FROM leads\n                        WHERE nickname = ?\n                          AND (content IS NULL OR TRIM(content) = '')\n                        LIMIT 8\n                    ").all(result);
          for (const item of result2) {
            if (!item?.id) {
              continue;
            }
            const result2 = getLeadById(item.id);
            if (!result2) {
              continue;
            }
            let text = "";
            try {
              const leadUserKey = require("../shared/leadUserKey");
              if (leadUserKey.isVideoLeadRecord?.(result2)) {
                continue;
              }
              text = String(leadUserKey.getLeadUserKey(result2) || "").trim();
            } catch (error) {
              text = "";
            }
            if (text && text !== String(item.id) && text !== result && text !== result + "_") {
              continue;
            }
            return String(item.id);
          }
        } catch (error) {}
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}
function upsertLead(arg1, {
  mergeFn: mergeFn,
  updateOnly = false
} = {}) {
  if (!db || !arg1 || typeof arg1 !== "object") {
    return null;
  }
  try {
    if (collectedLibraryWrite.isCollectedRouteLead(arg1)) {
      if (updateOnly) {
        const result = collectedVideosStore.getById(db, arg1.leadId || arg1.key || arg1.videoUrl || "");
        const result2 = collectedAuthorsStore.getById(db, arg1.authorProfileUrl || arg1.userUrl || arg1.leadId || "");
        if (!result && !result2) {
          return null;
        }
      }
      const result = collectedLibraryWrite.upsertCollectedFromLead(db, arg1);
      if (result.written) {
        return arg1;
      } else {
        return null;
      }
    }
    ensureLeadSchemaColumns();
    let local = null;
    try {
      local = require("../shared/leadUserKey");
    } catch (error) {
      local = null;
    }
    const result = String(local?.getPersonLeadSecUid?.(arg1) || "").trim();
    if (result) {
      arg1.secUid = result;
      arg1.leadId = result;
      arg1.key = result;
      arg1.userKey = result;
    } else {
      if (local?.isTransientLeadIdentityKey?.(arg1.leadId) || local?.isTransientLeadIdentityKey?.(arg1.key) || local?.isTransientLeadIdentityKey?.(arg1.userKey)) {
        arg1.leadId = "";
        arg1.key = "";
        if (local?.isTransientLeadIdentityKey?.(arg1.userKey)) {
          arg1.userKey = "";
        }
      }
      const result = String(local?.buildLeadId?.(arg1) || "").trim();
      if (result) {
        arg1.leadId = result;
        arg1.key = result;
      }
    }
    const result2 = extractLeadColumns(arg1);
    let local2 = null;
    if (result) {
      try {
        const result2 = db.prepare("SELECT id FROM leads WHERE sec_uid = ? OR id = ? OR lead_user_id = ? LIMIT 1").get(result, result, result);
        if (result2?.id) {
          local2 = String(result2.id);
        }
      } catch (error) {}
    }
    if (!local2) {
      local2 = findLeadRowId(arg1) || findLeadRowId(result2.id) || (result2.lead_user_id ? findLeadRowId(result2.lead_user_id) : null);
    }
    const value = local2 ? getLeadById(local2) : null;
    if (updateOnly && !value) {
      return null;
    }
    let local3 = arg1;
    if (value && typeof mergeFn === "function") {
      mergeFn(value, arg1);
      local3 = value;
      if (result) {
        local3.secUid = result;
        local3.leadId = result;
        local3.key = result;
        local3.userKey = result;
      }
    } else if (value) {
      local3 = {
        ...value,
        ...arg1
      };
      if (result) {
        local3.secUid = result;
        local3.leadId = result;
        local3.key = result;
        local3.userKey = result;
      }
    }
    if (value?.leadId && !local3.leadId) {
      local3.leadId = value.leadId;
    }
    const result3 = extractLeadColumns(local3);
    if (local2 && local2 !== result3.id) {
      try {
        db.prepare("DELETE FROM leads WHERE id = ?").run(local2);
      } catch (error) {}
    }
    db.prepare("\n            INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n            )\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                lead_user_id = excluded.lead_user_id,\n                nickname = excluded.nickname,\n                video_id = excluded.video_id,\n                video_title = excluded.video_title,\n                account_id = excluded.account_id,\n                content = excluded.content,\n                captured_at = excluded.captured_at,\n                raw_data = excluded.raw_data,\n                is_high_intention = excluded.is_high_intention,\n                lead_kind = excluded.lead_kind,\n                entry_source = excluded.entry_source,\n                search_keyword = excluded.search_keyword,\n                account_name = excluded.account_name,\n                location = excluded.location,\n                sec_uid = excluded.sec_uid\n        ").run(result3.id, result3.lead_user_id, result3.nickname, result3.video_id, result3.video_title, result3.account_id, result3.content, result3.captured_at, result3.raw_data, result3.is_high_intention, result3.lead_kind, result3.entry_source, result3.search_keyword, result3.account_name, result3.location, result3.sec_uid);
    return local3;
  } catch (error) {
    console.error("[DB] upsertLead 失败:", error);
    return null;
  }
}
function upsertLeadsBatch(arg1, {
  mergeFn: mergeFn,
  updateOnly = false
} = {}) {
  if (!db || !Array.isArray(arg1)) {
    return 0;
  }
  let num = 0;
  const result = db.transaction(arg1 => {
    for (const item of arg1) {
      if (upsertLead(item, {
        mergeFn: mergeFn,
        updateOnly: updateOnly
      })) {
        num += 1;
      }
    }
  });
  try {
    result(arg1);
    return num;
  } catch (error) {
    console.error("[DB] upsertLeadsBatch 失败:", error);
    return num;
  }
}
function setLeadLastBatchFollowResult(arg1, options = {}) {
  if (!db || arg1 == null) {
    return false;
  }
  const result = String(options?.status || "").trim();
  if (result !== "success" && result !== "failed") {
    return false;
  }
  try {
    ensureLeadSchemaColumns();
    const result2 = findLeadRowId(arg1);
    if (!result2) {
      return false;
    }
    const obj = {
      status: result,
      message: String(options?.message || "").trim().slice(0, 1000),
      at: Number(options?.at) > 0 ? Number(options.at) : Date.now(),
      type: String(options?.type || "").trim().slice(0, 80),
      runId: Number.isFinite(Number(options?.runId)) ? Number(options.runId) : null
    };
    const result3 = db.prepare("\n            UPDATE leads\n            SET last_batch_follow_result = ?\n            WHERE id = ?\n        ").run(JSON.stringify(obj), String(result2));
    return (result3.changes || 0) > 0;
  } catch (error) {
    console.error("[DB] setLeadLastBatchFollowResult 失败:", error);
    return false;
  }
}
function deleteFailedBatchFollowLeads() {
  if (!db) {
    return 0;
  }
  try {
    ensureLeadSchemaColumns();
    const result = db.prepare("\n            DELETE FROM leads\n            WHERE last_batch_follow_result = 'failed'\n               OR last_batch_follow_result LIKE '{\"status\":\"failed\"%'\n        ").run();
    return result.changes || 0;
  } catch (error) {
    console.error("[DB] deleteFailedBatchFollowLeads 失败:", error);
    return 0;
  }
}
function deleteLeadsByIds(arg1) {
  if (!db || !Array.isArray(arg1) || !arg1.length) {
    return 0;
  }
  try {
    const result = db.prepare("DELETE FROM leads WHERE id = ?");
    const result2 = db.prepare("DELETE FROM leads WHERE lead_user_id = ?");
    let num = 0;
    const result3 = db.transaction(arg1 => {
      for (const item of arg1) {
        if (!item) {
          continue;
        }
        const result3 = String(item);
        num += result.run(result3).changes || 0;
        num += result2.run(result3).changes || 0;
      }
    });
    result3(arg1);
    return num;
  } catch (error) {
    console.error("[DB] deleteLeadsByIds 失败:", error);
    return 0;
  }
}
function clearAllLeads() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("DELETE FROM leads").run();
    return result.changes || 0;
  } catch (error) {
    console.error("[DB] clearAllLeads 失败:", error);
    return 0;
  }
}
function deleteLowIntentionLeads() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("\n            DELETE FROM leads\n            WHERE (is_high_intention IS NULL OR is_high_intention = 0)\n              AND (lead_kind IS NULL OR lead_kind != 'video_card')\n        ").run();
    return result.changes || 0;
  } catch (error) {
    console.error("[DB] deleteLowIntentionLeads 失败:", error);
    return 0;
  }
}
function listLeadUserKeys() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("\n            SELECT id, lead_user_id FROM leads\n        ").all();
    const list = [];
    const set = new Set();
    for (const item of result) {
      for (const item2 of [item.id, item.lead_user_id]) {
        const result = String(item2 || "").trim();
        if (!result || set.has(result)) {
          continue;
        }
        set.add(result);
        list.push(result);
      }
    }
    return list;
  } catch (error) {
    console.error("[DB] listLeadUserKeys 失败:", error);
    return [];
  }
}
function findExistingLeadUserKeys(arg1, num = 400) {
  if (!db) {
    return [];
  }
  const list = [...new Set((Array.isArray(arg1) ? arg1 : []).map(arg1 => String(arg1 || "").trim()).filter(Boolean))];
  if (!list.length) {
    return [];
  }
  const result = Math.max(1, Math.min(400, Number(num) || 400));
  const set = new Set(list);
  const set2 = new Set();
  try {
    for (let num = 0; num < list.length; num += result) {
      const result2 = list.slice(num, num + result);
      const result3 = result2.map(() => "?").join(", ");
      const result4 = db.prepare("\n                SELECT id, lead_user_id FROM leads\n                WHERE id IN (" + result3 + ") OR lead_user_id IN (" + result3 + ")\n            ").all(...result2, ...result2);
      for (const item of result4) {
        for (const item2 of [item.id, item.lead_user_id]) {
          const result = String(item2 || "").trim();
          if (result && set.has(result)) {
            set2.add(result);
          }
        }
      }
    }
    return [...set2];
  } catch (error) {
    console.error("[DB] findExistingLeadUserKeys 失败:", error);
    throw error;
  }
}
function buildLeadsWhere(options = {}) {
  const list = [];
  const list2 = [];
  const local = options || {};
  if (local.excludeVideoCards !== false && !local.includeVideoCards) {
    list.push("(lead_kind IS NULL OR lead_kind != 'video_card')");
  }
  if (local.leadKind) {
    list.push("lead_kind = ?");
    list2.push(String(local.leadKind));
  }
  if (local.keyword) {
    const value = "%" + String(local.keyword).trim() + "%";
    list.push("(nickname LIKE ? OR content LIKE ? OR search_keyword LIKE ? OR video_title LIKE ? OR location LIKE ?)");
    list2.push(value, value, value, value, value);
  }
  if (local.searchKeyword) {
    list.push("(search_keyword LIKE ? OR entry_source LIKE ?)");
    const value = "%" + String(local.searchKeyword).trim() + "%";
    list2.push(value, value);
  }
  if (local.intention === "high") {
    list.push("is_high_intention = 1");
  } else if (local.intention === "low") {
    list.push("(is_high_intention IS NULL OR is_high_intention = 0)");
  }
  const result = String(local.batchFollowStatus || "").trim();
  if (result === "success" || result === "failed") {
    list.push("(last_batch_follow_result = ? OR last_batch_follow_result LIKE ?)");
    list2.push(result, "{\"status\":\"" + result + "\"%");
  }
  if (Array.isArray(local.account) && local.account.length) {
    const list3 = [];
    const list4 = [];
    for (const item of local.account) {
      const result = String(item || "").trim();
      if (!result) {
        continue;
      }
      if (result.startsWith("name:")) {
        list4.push(result.slice(5));
      } else {
        list3.push(result);
      }
    }
    if (list3.length) {
      try {
        const result = getAccountPool();
        for (const item of list3) {
          const result2 = result.find(arg1 => String(arg1?.id || "") === item);
          if (result2) {
            for (const item of collectAccountNameAliases(result2)) {
              list4.push(item);
            }
          }
        }
      } catch (error) {}
    }
    const list5 = [...new Set(list4.map(String).map(arg1 => arg1.trim()).filter(Boolean))];
    const list6 = [];
    if (list3.length) {
      list6.push("account_id IN (" + list3.map(() => "?").join(",") + ")");
      list2.push(...list3);
    }
    if (list5.length) {
      list6.push("((account_id IS NULL OR TRIM(account_id) = '') AND account_name IN (" + list5.map(() => "?").join(",") + "))");
      list2.push(...list5);
    }
    if (list6.length) {
      list.push("(" + list6.join(" OR ") + ")");
    }
  }
  if (Array.isArray(local.locations) && local.locations.length) {
    list.push("location IN (" + local.locations.map(() => "?").join(",") + ")");
    list2.push(...local.locations.map(String));
  }
  return {
    sql: list.length ? "WHERE " + list.join(" AND ") : "",
    params: list2
  };
}
function needsLeadPostFilter(options = {}) {
  const local = options || {};
  if (local.minTouchTotal != null && local.minTouchTotal !== "") {
    return true;
  }
  if (Array.isArray(local.touchTypes) && local.touchTypes.length) {
    return true;
  }
  if (Array.isArray(local.entrySource) && local.entrySource.length) {
    return true;
  }
  if (local.timeRange && local.timeRange !== "all") {
    return true;
  }
  if (local.captureTimeRange && (Array.isArray(local.captureTimeRange) ? local.captureTimeRange.length : local.captureTimeRange)) {
    return true;
  }
  if (Array.isArray(local.accountFlags) && local.accountFlags.length) {
    return true;
  }
  if (typeof local.postFilter === "function") {
    return true;
  }
  return false;
}
function getLeadsCount(options = {}) {
  if (!db) {
    return 0;
  }
  try {
    if (needsLeadPostFilter(options)) {
      console.warn("[DB] getLeadsCount 遇到复杂筛选，返回 0；请使用 queryLeadsPage(_countOnly)");
      return 0;
    }
    const {
      sql: sql,
      params: params
    } = buildLeadsWhere(options);
    const result = db.prepare("SELECT COUNT(*) as cnt FROM leads " + sql).get(...params);
    if (result) {
      return Number(result.cnt) || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("[DB] getLeadsCount 失败:", error);
    return 0;
  }
}
function createEmptyLeadPoolStats() {
  return {
    total: 0,
    likes: 0,
    replies: 0,
    messages: 0,
    follows: 0,
    touched: 0,
    untouched: 0,
    profileComments: 0
  };
}
function yieldMainThread() {
  return new Promise(arg1 => setImmediate(arg1));
}
const LEADS_POOL_STATS_YIELD_EVERY = 250;
async function aggregateLeadsPoolStats(options = {}) {
  const obj = {
    stats: createEmptyLeadPoolStats(),
    accountStats: []
  };
  if (!db) {
    return obj;
  }
  try {
    ensureLeadSchemaColumns();
    const {
      sql: sql,
      params: params
    } = buildLeadsWhere(options);
    const leadPoolFilters = require("../shared/leadPoolFilters");
    const leadTouch = require("../shared/leadTouch");
    const result = needsLeadPostFilter(options);
    const result2 = createEmptyLeadPoolStats();
    const result3 = Object.create(null);
    const result4 = db.prepare("SELECT account_id AS accountId, account_name AS accountName, lead_kind AS leadKind, raw_data FROM leads " + sql);
    let num = 0;
    for (const item of result4.iterate(...params)) {
      let local = null;
      try {
        local = JSON.parse(item.raw_data || "{}");
      } catch (error) {
        local = null;
      }
      if (!local) {
        continue;
      }
      if (!local.accountId && item.accountId) {
        local.accountId = item.accountId;
      }
      if (!local.accountName && item.accountName) {
        local.accountName = item.accountName;
      }
      if (!local.leadKind && item.leadKind) {
        local.leadKind = item.leadKind;
      }
      if (result && !leadPoolFilters.leadMatchesComplexFilters(local, options)) {
        continue;
      }
      if (String(local.leadKind || "") === "video_card") {
        continue;
      }
      const result4 = leadTouch.migrateTouchCountsFromLegacy(local);
      const local2 = result4.like > 0 || !!local.liked || !!local.actions?.liked;
      const local3 = result4.reply > 0 || !!local.replied || !!local.actions?.replied;
      const local4 = result4.message > 0 || !!local.messaged || !!local.actions?.messaged;
      const local5 = result4.follow > 0 || !!local.followed || !!local.actions?.followed;
      const local6 = result4.profileComment > 0 || !!local.actions?.profileWorkCommented;
      const local7 = leadTouch.getTotalTouchCount(result4) > 0 || local2 || local3 || local5 || local4 || local6;
      result2.total += 1;
      if (local2) {
        result2.likes += 1;
      }
      if (local3) {
        result2.replies += 1;
      }
      if (local4) {
        result2.messages += 1;
      }
      if (local5) {
        result2.follows += 1;
      }
      if (local6) {
        result2.profileComments += 1;
      }
      if (local7) {
        result2.touched += 1;
      } else {
        result2.untouched += 1;
      }
      const result5 = String(local.accountId || item.accountId || "").trim();
      const local8 = String(local.accountName || item.accountName || "").trim() || "未知账号";
      const local9 = result5 || "name:" + local8;
      let value = result3[local9];
      if (!value) {
        value = {
          accountId: result5,
          name: local8,
          total: 0,
          likes: 0,
          replies: 0,
          messages: 0,
          follows: 0
        };
        result3[local9] = value;
      } else if (local8 && local8 !== "未知账号" && (!value.name || value.name === "未知账号")) {
        value.name = local8;
      }
      value.total += 1;
      if (local2) {
        value.likes += 1;
      }
      if (local3) {
        value.replies += 1;
      }
      if (local4) {
        value.messages += 1;
      }
      if (local5) {
        value.follows += 1;
      }
      num += 1;
      if (num % LEADS_POOL_STATS_YIELD_EVERY === 0) {
        await yieldMainThread();
      }
    }
    return {
      stats: result2,
      accountStats: Object.values(result3).sort((arg1, arg2) => arg2.total - arg1.total || String(arg1.name).localeCompare(String(arg2.name), "zh-CN"))
    };
  } catch (error) {
    console.error("[DB] aggregateLeadsPoolStats 失败:", error);
    return obj;
  }
}
const LEADS_PAGE_YIELD_EVERY = 250;
async function queryLeadsPage(options = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    ensureLeadSchemaColumns();
    const result = Math.max(0, Number(options.offset) || 0);
    const value = options.forExport || options.forBatch ? 100000 : 500;
    const result2 = Math.max(1, Math.min(value, Number(options.limit) || 50));
    const local = options.filters || {};
    const value2 = options.orderBy === "captured_at_asc" ? "captured_at ASC" : "captured_at DESC";
    const {
      sql: sql,
      params: params
    } = buildLeadsWhere(local);
    const leadPoolFilters = require("../shared/leadPoolFilters");
    if (!needsLeadPostFilter(local)) {
      const result3 = db.prepare("SELECT COUNT(*) as cnt FROM leads " + sql).get(...params);
      const value = result3 ? Number(result3.cnt) || 0 : 0;
      if (options._countOnly) {
        return {
          items: [],
          total: value
        };
      }
      const result4 = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads " + sql + " ORDER BY " + value2 + " LIMIT ? OFFSET ?").all(...params, result2, result);
      const result5 = result4.map(parseLeadRow).filter(Boolean);
      return {
        items: result5,
        total: value
      };
    }
    const result3 = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads " + sql + " ORDER BY " + value2);
    const list = [];
    let num = 0;
    let num2 = 0;
    const flag = !!options._countOnly;
    const value3 = result + result2;
    for (const item of result3.iterate(...params)) {
      const result2 = parseLeadRow(item);
      num2 += 1;
      if (!result2) {
        if (num2 % LEADS_PAGE_YIELD_EVERY === 0) {
          await yieldMainThread();
        }
        continue;
      }
      if (!leadPoolFilters.leadMatchesComplexFilters(result2, local)) {
        if (num2 % LEADS_PAGE_YIELD_EVERY === 0) {
          await yieldMainThread();
        }
        continue;
      }
      if (typeof local.postFilter === "function") {
        try {
          if (!local.postFilter(result2)) {
            if (num2 % LEADS_PAGE_YIELD_EVERY === 0) {
              await yieldMainThread();
            }
            continue;
          }
        } catch (error) {
          if (num2 % LEADS_PAGE_YIELD_EVERY === 0) {
            await yieldMainThread();
          }
          continue;
        }
      }
      if (!flag && num >= result && num < value3) {
        list.push(result2);
      }
      num += 1;
      if (num2 % LEADS_PAGE_YIELD_EVERY === 0) {
        await yieldMainThread();
      }
    }
    if (flag) {
      return {
        items: [],
        total: num
      };
    }
    return {
      items: list,
      total: num
    };
  } catch (error) {
    console.error("[DB] queryLeadsPage 失败:", error);
    return {
      items: [],
      total: 0
    };
  }
}
function listVideoCardLeads() {
  if (!db) {
    return [];
  }
  try {
    if (leadsCollectedSplitMigrate.isSplitMigrationDone(db)) {
      return [...collectedVideosStore.listAll(db), ...collectedAuthorsStore.listAll(db)];
    }
    const result = db.prepare("\n            SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n            WHERE lead_kind = 'video_card'\n               OR lead_kind = 'video'\n               OR id LIKE 'video:%'\n               OR lead_user_id LIKE 'video:%'\n            ORDER BY captured_at DESC\n        ").all();
    const list = [];
    const set = new Set();
    for (const item of result) {
      const result = parseLeadRow(item);
      if (!result || !isVideoCardLeadLike(result)) {
        continue;
      }
      const local = normalizeVideoCardLeadForPool(result) || result;
      const result2 = String(local.leadId || local.key || item.id || "");
      if (!result2 || set.has(result2)) {
        continue;
      }
      set.add(result2);
      list.push(local);
    }
    return list;
  } catch (error) {
    console.error("[DB] listVideoCardLeads 失败:", error);
    return [];
  }
}
function listCollectedVideos() {
  if (!db) {
    return [];
  }
  return collectedVideosStore.listAll(db);
}
function listCollectedVideoLinkHints() {
  if (!db) {
    return [];
  }
  return collectedVideosStore.listLinkMigrateHints(db);
}
function queryCollectedVideosPage(options = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  return collectedVideosStore.queryPage(db, options);
}
function listCollectedVideoUrls() {
  if (!db) {
    return [];
  }
  return collectedVideosStore.listVideoUrls(db);
}
function listCollectedVideoImportKeys() {
  if (!db) {
    return [];
  }
  return collectedVideosStore.listImportKeys(db);
}
function listCollectedAuthorDedupKeys() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("SELECT id, sec_uid FROM collected_authors").all();
    const list = [];
    const set = new Set();
    for (const item of result) {
      const result = String(item.id || "").trim();
      const result2 = String(item.sec_uid || "").trim();
      for (const item of [result, result2, result2 ? "author:" + result2 : ""]) {
        if (!item || set.has(item)) {
          continue;
        }
        set.add(item);
        list.push(item);
      }
    }
    return list;
  } catch (error) {
    console.error("[DB] listCollectedAuthorDedupKeys 失败:", error);
    return [];
  }
}
function listCollectedAuthors() {
  if (!db) {
    return [];
  }
  return collectedAuthorsStore.listAll(db);
}
function queryCollectedAuthorsPage(options = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  return collectedAuthorsStore.queryPage(db, options);
}
function deleteCollectedVideosByKeys(list = []) {
  if (!db) {
    return 0;
  }
  return collectedVideosStore.deleteByKeys(db, list);
}
function deleteCollectedAuthorsByKeys(list = []) {
  if (!db) {
    return 0;
  }
  return collectedAuthorsStore.deleteByKeys(db, list);
}
function clearAllCollectedVideos() {
  if (!db) {
    return 0;
  }
  return collectedVideosStore.clearAll(db);
}
function clearAllCollectedAuthors() {
  if (!db) {
    return 0;
  }
  return collectedAuthorsStore.clearAll(db);
}
function clearAllEntityLeadgenVideoCards() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("\n            SELECT id FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n               OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n               OR raw_data LIKE '%\"identityType\":\"video\"%'\n        ").all();
    if (!result.length) {
      return 0;
    }
    const result2 = db.prepare("DELETE FROM entity_leadgen_leads WHERE id = ?");
    let num = 0;
    const result3 = db.transaction(arg1 => {
      for (const item of arg1) {
        num += result2.run(String(item.id)).changes || 0;
      }
    });
    result3(result);
    return num;
  } catch (error) {
    console.error("[DB] clearAllEntityLeadgenVideoCards 失败:", error);
    return 0;
  }
}
function stripAuthorTargetFromEntityLeadgenVideoCards() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("\n            SELECT id, raw_data FROM entity_leadgen_leads\n            WHERE raw_data LIKE '%\"author\"%'\n              AND (\n                source_type = 'video'\n                OR source_type = 'video_card'\n                OR id LIKE 'video:%'\n                OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n                OR raw_data LIKE '%\"identityType\":\"video\"%'\n              )\n        ").all();
    if (!result.length) {
      return 0;
    }
    const result2 = db.prepare("UPDATE entity_leadgen_leads SET raw_data = ? WHERE id = ?");
    let num = 0;
    const result3 = db.transaction(arg1 => {
      for (const item of arg1) {
        let local = null;
        try {
          local = JSON.parse(item.raw_data || "{}");
        } catch (error) {
          local = null;
        }
        if (!local || typeof local !== "object") {
          continue;
        }
        const value = Array.isArray(local.collectedFields) ? local.collectedFields.map(String).filter(arg1 => arg1 && arg1 !== "author") : [];
        const local2 = Array.isArray(local.collectedFields) && local.collectedFields.map(String).includes("author");
        if (!local2) {
          continue;
        }
        local.collectedFields = value.length ? value : ["video"];
        result2.run(JSON.stringify(local), String(item.id));
        num += 1;
      }
    });
    result3(result);
    return num;
  } catch (error) {
    console.error("[DB] stripAuthorTargetFromEntityLeadgenVideoCards 失败:", error);
    return 0;
  }
}
function listEntityLeadgenVideoCardLeads() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("\n            SELECT id, task_id, ts, source_type, raw_data\n            FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n            ORDER BY ts DESC\n        ").all();
    const result2 = db.prepare("\n            SELECT id, task_id, ts, source_type, raw_data\n            FROM entity_leadgen_leads\n            WHERE (source_type IS NULL OR source_type = '')\n              AND (\n                raw_data LIKE '%\"leadKind\":\"video_card\"%'\n                OR raw_data LIKE '%\"sourceType\":\"video\"%'\n                OR raw_data LIKE '%\"identityType\":\"video\"%'\n              )\n            ORDER BY ts DESC\n            LIMIT 5000\n        ").all();
    const list = [];
    const set = new Set();
    for (const item of [...result, ...result2]) {
      let local = null;
      try {
        local = JSON.parse(item.raw_data || "{}");
      } catch (error) {
        local = null;
      }
      if (!local) {
        continue;
      }
      if (!isVideoCardLeadLike(local) && item.source_type !== "video") {
        continue;
      }
      const result = normalizeVideoCardLeadForPool({
        ...local,
        id: local.id || item.id,
        ts: local.ts || item.ts,
        sourceType: local.sourceType || item.source_type || "video",
        taskId: local.taskId || item.task_id
      });
      if (!result) {
        continue;
      }
      const result2 = String(result.leadId || "");
      if (!result2 || set.has(result2)) {
        continue;
      }
      set.add(result2);
      list.push(result);
    }
    return list;
  } catch (error) {
    console.error("[DB] listEntityLeadgenVideoCardLeads 失败:", error);
    return [];
  }
}
function listLeadsByAutomationTaskIds(list = [], options = {}) {
  if (!db) {
    return [];
  }
  const list2 = [...new Set((Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "").trim()).filter(Boolean))];
  if (!list2.length) {
    return [];
  }
  const result = Math.max(1, Math.min(50000, Number(options.limit) || 20000));
  const value = options.includeVideoCards === true;
  try {
    ensureLeadSchemaColumns();
    let list = [];
    try {
      const result2 = list2.map(() => "?").join(",");
      list = db.prepare("\n                SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n                WHERE json_extract(raw_data, '$.taskId') IN (" + result2 + ")\n                   OR json_extract(raw_data, '$.automationTaskId') IN (" + result2 + ")\n                ORDER BY captured_at DESC\n                LIMIT ?\n            ").all(...list2, ...list2, result);
    } catch (error) {
      const list3 = [];
      const list4 = [];
      for (const item of list2) {
        list3.push("raw_data LIKE ?");
        list4.push("%\"taskId\":\"" + item + "\"%");
        list3.push("raw_data LIKE ?");
        list4.push("%\"automationTaskId\":\"" + item + "\"%");
      }
      list = db.prepare("\n                SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n                WHERE (" + list3.join(" OR ") + ")\n                ORDER BY captured_at DESC\n                LIMIT ?\n            ").all(...list4, Math.min(result * 3, 60000));
    }
    const set = new Set(list2);
    const list3 = [];
    const set2 = new Set();
    for (const item of list) {
      const result2 = parseLeadRow(item);
      if (!result2) {
        continue;
      }
      if (!value && String(result2.leadKind || "") === "video_card") {
        continue;
      }
      const result3 = String(result2.taskId || result2.automationTaskId || "").trim();
      if (!set.has(result3)) {
        continue;
      }
      const result4 = String(result2.leadId || result2.key || result2.id || item.id || "");
      if (!result4 || set2.has(result4)) {
        continue;
      }
      set2.add(result4);
      list3.push(result2);
      if (list3.length >= result) {
        break;
      }
    }
    return list3;
  } catch (error) {
    console.error("[DB] listLeadsByAutomationTaskIds 失败:", error);
    return [];
  }
}
const LEAD_TOUCHED_SQL = "(\n  IFNULL(json_extract(raw_data, '$.touchCounts.like'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.reply'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.follow'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.message'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.profileComment'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.videoComment'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.liked'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.replied'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.followed'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.messaged'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.liked'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.replied'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.followed'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.messaged'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.profileWorkCommented'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.videoCommented'), 0) IN (1, 'true')\n)";
function deleteTouchedLeads() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("\n            DELETE FROM leads\n            WHERE (lead_kind IS NULL OR lead_kind != 'video_card')\n              AND " + LEAD_TOUCHED_SQL + "\n        ").run();
    return result.changes || 0;
  } catch (error) {
    console.error("[DB] deleteTouchedLeads 失败:", error);
    return 0;
  }
}
function queryLeadsByAutomationTaskIdsPage(list = [], options = {}) {
  const obj = {
    items: [],
    total: 0,
    counts: {
      all: 0,
      touched: 0,
      untouched: 0
    }
  };
  if (!db) {
    return obj;
  }
  const list2 = [...new Set((Array.isArray(list) ? list : [list]).map(arg1 => String(arg1 || "").trim()).filter(Boolean))];
  if (!list2.length) {
    return obj;
  }
  const result = Math.max(1, Math.min(100, Number(options.limit) || 20));
  const result2 = Math.max(0, Number(options.offset) || 0);
  const result3 = String(options.touch || "all");
  try {
    ensureLeadSchemaColumns();
    const result4 = list2.map(() => "?").join(",");
    const list = ["(\n          json_extract(raw_data, '$.taskId') IN (" + result4 + ")\n          OR json_extract(raw_data, '$.automationTaskId') IN (" + result4 + ")\n        )"];
    const list3 = [...list2, ...list2];
    if (options.includeVideoCards !== true) {
      list.push("IFNULL(json_extract(raw_data, '$.leadKind'), '') != 'video_card'");
    }
    if (result3 === "touched") {
      list.push(LEAD_TOUCHED_SQL);
    }
    if (result3 === "untouched") {
      list.push("NOT " + LEAD_TOUCHED_SQL);
    }
    const result5 = list.join(" AND ");
    const local = Number(db.prepare("SELECT COUNT(*) AS c FROM leads WHERE " + result5).get(...list3)?.c) || 0;
    const result6 = db.prepare("\n            SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n            WHERE " + result5 + "\n            ORDER BY captured_at DESC\n            LIMIT ? OFFSET ?\n        ").all(...list3, result, result2);
    const list4 = [list[0]];
    if (options.includeVideoCards !== true) {
      list4.push("IFNULL(json_extract(raw_data, '$.leadKind'), '') != 'video_card'");
    }
    const result7 = list4.join(" AND ");
    const value = result3 === "all" ? local : Number(db.prepare("SELECT COUNT(*) AS c FROM leads WHERE " + result7).get(...list2, ...list2)?.c) || 0;
    const local2 = Number(db.prepare("\n            SELECT COUNT(*) AS c FROM leads\n            WHERE " + result7 + "\n              AND " + LEAD_TOUCHED_SQL + "\n        ").get(...list2, ...list2)?.c) || 0;
    return {
      items: result6.map(parseLeadRow).filter(Boolean),
      total: local,
      counts: {
        all: value,
        touched: local2,
        untouched: Math.max(0, value - local2)
      }
    };
  } catch (error) {
    console.error("[DB] queryLeadsByAutomationTaskIdsPage 失败:", error);
    return obj;
  }
}
function syncEntityVideoCardsIntoLeadPool() {
  if (!db) {
    return {
      synced: 0
    };
  }
  return collectedLibraryWrite.syncEntityCollectedIntoLibraries(db, listEntityLeadgenVideoCardLeads);
}
function restoreLeadsCollectedSplitFromBackup(text = "") {
  if (!db || !activeUserDataPath) {
    return {
      success: false,
      error: "db_not_ready"
    };
  }
  return leadsCollectedSplitMigrate.restoreLeadsCollectedSplitFromBackup(db, activeUserDataPath, text);
}
function isCollectedSplitMigrationDone() {
  return leadsCollectedSplitMigrate.isSplitMigrationDone(db);
}
function deleteEntityLeadgenVideoCardsByKeys(list = []) {
  if (!db || !Array.isArray(list) || !list.length) {
    return 0;
  }
  try {
    const set = new Set();
    for (const item of list) {
      const result = String(item || "").trim();
      if (!result) {
        continue;
      }
      set.add(result);
      const local = result.match(/^video:(\d{10,})$/i) || result.match(/(?:video|note)\/(\d{10,})/i);
      if (local?.[1]) {
        set.add("video:" + local[1]);
        set.add(local[1]);
        set.add("https://www.douyin.com/video/" + local[1]);
      }
    }
    if (!set.size) {
      return 0;
    }
    const local = arg1 => {
      const result = String(arg1 || "").trim();
      if (!result) {
        return "";
      }
      const local = result.match(/^video:(\d{10,})$/i)?.[1];
      if (local) {
        return "video:" + local;
      }
      const local2 = result.match(/(?:video|note)\/(\d{10,})/i)?.[1];
      if (local2) {
        return "video:" + local2;
      }
      if (/^\d{10,}$/.test(result)) {
        return "video:" + result;
      }
      return "";
    };
    const result = db.prepare("\n            SELECT id, raw_data FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n               OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n               OR raw_data LIKE '%\"sourceType\":\"video\"%'\n               OR raw_data LIKE '%\"identityType\":\"video\"%'\n        ").all();
    const list2 = [];
    for (const item of result) {
      let local2 = null;
      try {
        local2 = JSON.parse(item.raw_data || "{}");
      } catch (error) {
        local2 = null;
      }
      const list = [item.id, local2?.id, local2?.leadId, local2?.userKey, local2?.key, local2?.videoUrl, local2?.url, local2?.content];
      const result = list.some(arg1 => {
        const result = String(arg1 || "").trim();
        if (!result) {
          return false;
        }
        if (set.has(result)) {
          return true;
        }
        const result2 = local(result);
        return !!result2 && (!!set.has(result2) || !!set.has(result2.slice(6)));
      });
      if (result) {
        list2.push(String(item.id));
      }
    }
    if (!list2.length) {
      return 0;
    }
    const result2 = db.prepare("DELETE FROM entity_leadgen_leads WHERE id = ?");
    let num = 0;
    const result3 = db.transaction(arg1 => {
      for (const item of arg1) {
        num += result2.run(item).changes || 0;
      }
    });
    result3([...new Set(list2)]);
    return num;
  } catch (error) {
    console.error("[DB] deleteEntityLeadgenVideoCardsByKeys 失败:", error);
    return 0;
  }
}
function normalizeAccountLabelKey(text = "") {
  return String(text || "").trim().replace(/（/g, "(").replace(/）/g, ")").replace(/\s+/g, " ").toLowerCase();
}
function formatPoolAccountLabel(arg1) {
  if (!arg1) {
    return "";
  }
  const result = String(arg1.nickname || "").trim();
  const result2 = String(arg1.name || arg1.remark || arg1.note || arg1.alias || "").trim();
  if (result && result2 && result !== result2) {
    return result2 + "·" + result;
  }
  return result || result2 || "";
}
function collectAccountNameAliases(arg1) {
  const set = new Set();
  const result = String(arg1?.nickname || "").trim();
  const result2 = String(arg1?.name || arg1?.remark || arg1?.note || arg1?.alias || "").trim();
  for (const item of [result, result2, arg1?.remark, arg1?.note, arg1?.alias, formatPoolAccountLabel(arg1), result && result2 && result !== result2 ? result + " (" + result2 + ")" : ""]) {
    const result = String(item || "").trim();
    if (result) {
      set.add(result);
    }
  }
  return [...set];
}
function matchUniquePoolAccountByName(arg1, list = []) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return null;
  }
  const value = Array.isArray(list) ? list : [];
  const result2 = value.filter(arg1 => {
    const result2 = collectAccountNameAliases(arg1);
    if (result2.some(arg1 => arg1 === result || normalizeAccountLabelKey(arg1) === normalizeAccountLabelKey(result))) {
      return true;
    }
    const result3 = result.indexOf("·");
    if (result3 > 0) {
      const result2 = result.slice(0, result3).trim();
      const result4 = result.slice(result3 + 1).trim();
      const result5 = String(arg1?.nickname || "").trim();
      const result6 = String(arg1?.name || arg1?.remark || "").trim();
      if (result4 && result5 === result4 && (!result2 || !result6 || result6 === result2)) {
        return true;
      }
    }
    const result4 = result.match(/^(.*?)\s*[\(（]\s*(.*?)\s*[\)）]\s*$/);
    if (!result4) {
      return false;
    }
    const result5 = String(result4[1] || "").trim();
    const result6 = String(result4[2] || "").trim();
    const result7 = String(arg1?.nickname || "").trim();
    const result8 = String(arg1?.name || arg1?.remark || "").trim();
    return !!result5 && result7 === result5 && (!result6 || !result8 || result8 === result6);
  });
  if (result2.length === 1) {
    return result2[0];
  } else {
    return null;
  }
}
let leadAccountIdBackfillScheduled = false;
function backfillLeadAccountIdsFromPool() {
  if (!db) {
    return 0;
  }
  const result = getAccountPool();
  if (!result.length) {
    return 0;
  }
  try {
    const result2 = db.prepare("\n            SELECT id, account_name, raw_data\n            FROM leads\n            WHERE (account_id IS NULL OR TRIM(account_id) = '')\n              AND account_name IS NOT NULL AND TRIM(account_name) != ''\n        ").all();
    if (!result2.length) {
      return 0;
    }
    const result3 = db.prepare("UPDATE leads SET account_id = ?, raw_data = ? WHERE id = ?");
    let num = 0;
    const result4 = db.transaction(arg1 => {
      for (const item of arg1) {
        const result2 = matchUniquePoolAccountByName(item.account_name, result);
        if (!result2?.id) {
          continue;
        }
        let obj = {};
        try {
          obj = JSON.parse(item.raw_data || "{}") || {};
        } catch (error) {
          obj = {};
        }
        const result4 = String(result2.id);
        obj.accountId = result4;
        if (!String(obj.accountName || "").trim()) {
          obj.accountName = String(item.account_name || formatPoolAccountLabel(result2) || "").trim();
        }
        result3.run(result4, JSON.stringify(obj), item.id);
        num += 1;
      }
    });
    result4(result2);
    if (num > 0) {
      console.log("[DB] 已回填线索 account_id：" + num + " 条");
    }
    return num;
  } catch (error) {
    console.warn("[DB] backfillLeadAccountIdsFromPool 失败:", error?.message || error);
    return 0;
  }
}
function scheduleLeadAccountIdBackfill() {
  if (leadAccountIdBackfillScheduled || !db) {
    return;
  }
  leadAccountIdBackfillScheduled = true;
  setImmediate(() => {
    try {
      backfillLeadAccountIdsFromPool();
    } catch (error) {}
  });
}
function listLeadAccountOptions() {
  if (!db) {
    return [];
  }
  try {
    scheduleLeadAccountIdBackfill();
    const result = getAccountPool();
    const result2 = db.prepare("\n            SELECT account_id AS accountId,\n                   MAX(account_name) AS accountName\n            FROM leads\n            WHERE account_id IS NOT NULL AND TRIM(account_id) != ''\n            GROUP BY account_id\n        ").all();
    const result3 = db.prepare("\n            SELECT account_name AS accountName\n            FROM leads\n            WHERE (account_id IS NULL OR TRIM(account_id) = '')\n              AND account_name IS NOT NULL AND TRIM(account_name) != ''\n            GROUP BY account_name\n        ").all();
    const map = new Map();
    const local = (arg1, arg2) => {
      let result2 = String(arg1 || "").trim();
      const result3 = String(arg2 || "").trim();
      if (!result2 && !result3) {
        return;
      }
      const value = result2 ? result.find(arg1 => String(arg1?.id || "") === result2) : null;
      const value2 = !value && result3 ? matchUniquePoolAccountByName(result3, result) : null;
      const local = value || value2 || null;
      if (local?.id) {
        result2 = String(local.id).trim();
      }
      const local2 = result2 || "name:" + result3;
      const result4 = map.get(local2);
      if (!result4) {
        map.set(local2, {
          accountId: result2,
          accountName: result3 || formatPoolAccountLabel(local) || ""
        });
        return;
      }
      if (result3 && !result4.accountName) {
        result4.accountName = result3;
      }
      if (result2 && !result4.accountId) {
        result4.accountId = result2;
      }
    };
    for (const item of result2) {
      local(item.accountId, item.accountName);
    }
    for (const item of result3) {
      local("", item.accountName);
    }
    const list = [...map.values()];
    const map2 = new Map();
    for (const item of list) {
      if (!item.accountId) {
        continue;
      }
      const result2 = result.find(arg1 => String(arg1?.id || "") === item.accountId);
      const result3 = normalizeAccountLabelKey(result2 ? formatPoolAccountLabel(result2) : item.accountName);
      if (result3) {
        map2.set(result3, item);
      }
    }
    for (const item of list) {
      if (item.accountId) {
        continue;
      }
      const result2 = matchUniquePoolAccountByName(item.accountName, result);
      const result3 = normalizeAccountLabelKey(result2 ? formatPoolAccountLabel(result2) : item.accountName);
      const value = result3 ? map2.get(result3) : null;
      if (value) {
        map.delete("name:" + item.accountName);
      }
    }
    return [...map.values()].filter(arg1 => arg1.accountId || arg1.accountName).sort((arg1, arg2) => String(arg1.accountName || "").localeCompare(String(arg2.accountName || ""), "zh-CN"));
  } catch (error) {
    return [];
  }
}
function listLeadAccountNames() {
  return listLeadAccountOptions().map(arg1 => arg1.accountName).filter(Boolean);
}
function listLeadSearchKeywords() {
  if (!db) {
    return [];
  }
  try {
    return db.prepare("\n            SELECT DISTINCT search_keyword AS kw FROM leads\n            WHERE search_keyword IS NOT NULL AND search_keyword != ''\n            ORDER BY search_keyword ASC\n        ").all().map(arg1 => arg1.kw).filter(Boolean);
  } catch (error) {
    return [];
  }
}
function listLeadLocations() {
  if (!db) {
    return [];
  }
  try {
    return db.prepare("\n            SELECT DISTINCT location AS loc FROM leads\n            WHERE location IS NOT NULL AND location != '' AND location != '未知'\n            ORDER BY location ASC\n        ").all().map(arg1 => arg1.loc).filter(Boolean);
  } catch (error) {
    return [];
  }
}
function isLeadsRuntimeReady() {
  return isMigrationExecuted("v3_leads_runtime_cutover");
}
function getAllLeadsRaw() {
  if (!db) {
    return [];
  }
  try {
    return db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads ORDER BY captured_at DESC").all().map(parseLeadRow).filter(Boolean);
  } catch (error) {
    console.error("[DB] getAllLeadsRaw 失败:", error);
    return [];
  }
}
function getAiAgents() {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("SELECT raw_data FROM ai_agents ORDER BY updated_at DESC");
    const result2 = result.all();
    return result2.map(arg1 => {
      try {
        return JSON.parse(arg1.raw_data);
      } catch (error) {
        return null;
      }
    }).filter(Boolean);
  } catch (error) {
    console.error("[DB] getAiAgents 失败:", error);
    return [];
  }
}
function saveAiAgentsBatch(arg1) {
  if (!db || !Array.isArray(arg1)) {
    return 0;
  }
  try {
    const result = db.prepare("\n            INSERT INTO ai_agents (id, name, description, system_prompt, model, updated_at, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                name = excluded.name,\n                description = excluded.description,\n                system_prompt = excluded.system_prompt,\n                model = excluded.model,\n                updated_at = excluded.updated_at,\n                raw_data = excluded.raw_data\n        ");
    let num = 0;
    const result2 = db.transaction(arg1 => {
      const result2 = Date.now();
      for (let num2 = 0; num2 < arg1.length; num2++) {
        const value = arg1[num2];
        if (!value || typeof value !== "object") {
          continue;
        }
        const local = value.id || "agent_" + num2 + "_" + result2;
        result.run(String(local), String(value.name || value.title || "自定义智能体"), String(value.description || ""), String(value.system_prompt || value.prompt || value.aiPrompt || ""), String(value.model || "default"), Number(value.updated_at || result2), JSON.stringify(value));
        num++;
      }
    });
    result2(arg1);
    return num;
  } catch (error) {
    console.error("[DB] saveAiAgentsBatch 失败:", error);
    return 0;
  }
}
function deleteAiAgent(arg1) {
  if (!db || !arg1) {
    return false;
  }
  try {
    db.prepare("DELETE FROM ai_agents WHERE id = ?").run(String(arg1));
    return true;
  } catch (error) {
    console.error("[DB] deleteAiAgent 失败 [" + arg1 + "]:", error);
    return false;
  }
}
function parseEntityLeadgenTaskRow(arg1, list = []) {
  if (!arg1) {
    return null;
  }
  let obj = {};
  try {
    obj = JSON.parse(arg1.raw_data || "{}") || {};
  } catch (error) {
    obj = {};
  }
  const result = String(arg1.remark ?? "");
  const result2 = String(obj.remark || "");
  const value = result2.length > result.length ? result2 : result || result2;
  return {
    ...obj,
    id: String(arg1.id || obj.id || ""),
    name: String(arg1.name ?? (obj.name || "线索采集")),
    status: String(arg1.status || obj.status || "draft"),
    createdAt: Number(arg1.created_at ?? obj.createdAt) || Date.now(),
    startedAt: arg1.started_at != null ? Number(arg1.started_at) : obj.startedAt != null ? Number(obj.startedAt) : null,
    endedAt: arg1.ended_at != null ? Number(arg1.ended_at) : obj.endedAt != null ? Number(obj.endedAt) : null,
    endReason: String(arg1.end_reason ?? (obj.endReason || "")),
    remark: value,
    leads: Array.isArray(list) ? list : []
  };
}
function parseEntityLeadgenLeadRow(arg1) {
  if (!arg1) {
    return null;
  }
  try {
    const result = JSON.parse(arg1.raw_data || "{}");
    if (!result.id && arg1.id) {
      result.id = arg1.id;
    }
    if (!result.ts && arg1.ts) {
      result.ts = Number(arg1.ts);
    }
    return result;
  } catch (error) {
    return null;
  }
}
function extractEntityLeadgenTaskColumns(arg1) {
  const value = arg1 && typeof arg1 === "object" ? arg1 : {};
  const result = Date.now();
  const result2 = String(value.id || "entity_" + result);
  const {
    leads: leads,
    ...local
  } = value;
  return {
    id: result2,
    name: String(value.name || "线索采集").slice(0, 200),
    status: String(value.status || "draft").slice(0, 40),
    created_at: Number(value.createdAt || result) || result,
    started_at: value.startedAt != null ? Number(value.startedAt) : null,
    ended_at: value.endedAt != null ? Number(value.endedAt) : null,
    end_reason: String(value.endReason || "").slice(0, 80),
    remark: String(value.remark || "").slice(0, 500),
    updated_at: result,
    raw_data: JSON.stringify({
      ...local,
      id: result2,
      leads: undefined
    })
  };
}
function extractEntityLeadgenLeadColumns(arg1, arg2) {
  const value = arg2 && typeof arg2 === "object" ? arg2 : {};
  const result = Date.now();
  const result2 = String(value.id || "entity_lead_" + result + "_" + Math.random().toString(36).slice(2, 8));
  return {
    id: result2,
    task_id: String(arg1),
    ts: Number(value.ts || result) || result,
    nickname: String(value.nickname || value.title || "").slice(0, 200),
    source_type: String(value.sourceType || "").slice(0, 40),
    account_id: String(value.accountId || "").slice(0, 120),
    raw_data: JSON.stringify({
      ...value,
      id: result2
    })
  };
}
function listEntityLeadgenTasks({
  includeLeads = true,
  leadLimit = 0
} = {}) {
  if (!db) {
    return [];
  }
  try {
    const result = db.prepare("\n            SELECT id, name, status, created_at, started_at, ended_at, end_reason, remark, raw_data\n            FROM entity_leadgen_tasks\n            ORDER BY created_at DESC\n        ").all();
    if (!includeLeads) {
      return result.map(arg1 => parseEntityLeadgenTaskRow(arg1, []));
    }
    const result2 = Math.max(0, Math.floor(Number(leadLimit) || 0));
    const result3 = db.prepare("\n            SELECT id, task_id, ts, raw_data\n            FROM entity_leadgen_leads\n            ORDER BY ts DESC\n        ").all();
    const map = new Map();
    for (const item of result3) {
      const result = String(item.task_id || "");
      if (!result) {
        continue;
      }
      if (!map.has(result)) {
        map.set(result, []);
      }
      const result3 = map.get(result);
      if (result2 > 0 && result3.length >= result2) {
        continue;
      }
      const result4 = parseEntityLeadgenLeadRow(item);
      if (result4) {
        result3.push(result4);
      }
    }
    return result.map(arg1 => parseEntityLeadgenTaskRow(arg1, map.get(String(arg1.id)) || []));
  } catch (error) {
    console.error("[DB] listEntityLeadgenTasks 失败:", error);
    return [];
  }
}
function getEntityLeadgenTaskById(arg1, {
  includeLeads = true,
  leadLimit = 0
} = {}) {
  if (!db || !arg1) {
    return null;
  }
  try {
    const result = db.prepare("\n            SELECT id, name, status, created_at, started_at, ended_at, end_reason, remark, raw_data\n            FROM entity_leadgen_tasks WHERE id = ?\n        ").get(String(arg1));
    if (!result) {
      return null;
    }
    if (!includeLeads) {
      return parseEntityLeadgenTaskRow(result, []);
    }
    const result2 = Math.max(0, Math.floor(Number(leadLimit) || 0));
    const value = result2 > 0 ? db.prepare("\n                SELECT id, task_id, ts, raw_data\n                FROM entity_leadgen_leads\n                WHERE task_id = ?\n                ORDER BY ts DESC\n                LIMIT ?\n            ").all(String(arg1), result2) : db.prepare("\n                SELECT id, task_id, ts, raw_data\n                FROM entity_leadgen_leads\n                WHERE task_id = ?\n                ORDER BY ts DESC\n            ").all(String(arg1));
    const result3 = value.map(parseEntityLeadgenLeadRow).filter(Boolean);
    return parseEntityLeadgenTaskRow(result, result3);
  } catch (error) {
    console.error("[DB] getEntityLeadgenTaskById 失败:", error);
    return null;
  }
}
function upsertEntityLeadgenTask(arg1, {
  replaceLeads = false
} = {}) {
  if (!db || !arg1 || typeof arg1 !== "object") {
    return null;
  }
  try {
    const result = extractEntityLeadgenTaskColumns(arg1);
    const result2 = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(result.id);
    db.prepare("\n            INSERT INTO entity_leadgen_tasks (\n                id, name, status, created_at, started_at, ended_at, end_reason, remark, updated_at, raw_data\n            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                name = excluded.name,\n                status = excluded.status,\n                created_at = excluded.created_at,\n                started_at = excluded.started_at,\n                ended_at = excluded.ended_at,\n                end_reason = excluded.end_reason,\n                remark = excluded.remark,\n                updated_at = excluded.updated_at,\n                raw_data = excluded.raw_data\n        ").run(result.id, result.name, result.status, result.created_at, result.started_at, result.ended_at, result.end_reason, result.remark, result.updated_at, result.raw_data);
    if (replaceLeads && Array.isArray(arg1.leads)) {
      replaceEntityLeadgenLeads(result.id, arg1.leads);
    } else if (!result2 && Array.isArray(arg1.leads) && arg1.leads.length) {
      appendEntityLeadgenLeads(result.id, arg1.leads);
    }
    return getEntityLeadgenTaskById(result.id, {
      includeLeads: true
    });
  } catch (error) {
    console.error("[DB] upsertEntityLeadgenTask 失败:", error);
    return null;
  }
}
function deleteEntityLeadgenTasks(list = []) {
  if (!db) {
    return false;
  }
  const result = (Array.isArray(list) ? list : [list]).map(String).filter(Boolean);
  if (!result.length) {
    return true;
  }
  try {
    const result2 = db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?");
    const result3 = db.prepare("DELETE FROM entity_leadgen_tasks WHERE id = ?");
    const result4 = db.transaction(arg1 => {
      for (const item of arg1) {
        result2.run(item);
        result3.run(item);
      }
    });
    result4(result);
    return true;
  } catch (error) {
    console.error("[DB] deleteEntityLeadgenTasks 失败:", error);
    return false;
  }
}
function appendEntityLeadgenLeads(arg1, list = []) {
  if (!db || !arg1) {
    return 0;
  }
  const value = Array.isArray(list) ? list : [list];
  if (!value.length) {
    return 0;
  }
  try {
    const result = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(String(arg1));
    if (!result) {
      return 0;
    }
    const result2 = db.prepare("\n            INSERT INTO entity_leadgen_leads (id, task_id, ts, nickname, source_type, account_id, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                task_id = excluded.task_id,\n                ts = excluded.ts,\n                nickname = excluded.nickname,\n                source_type = excluded.source_type,\n                account_id = excluded.account_id,\n                raw_data = excluded.raw_data\n        ");
    let num = 0;
    const result3 = db.transaction(arg12 => {
      for (const item of arg12) {
        if (!item || typeof item !== "object") {
          continue;
        }
        const result = extractEntityLeadgenLeadColumns(arg1, item);
        result2.run(result.id, result.task_id, result.ts, result.nickname, result.source_type, result.account_id, result.raw_data);
        num += 1;
      }
    });
    result3(value);
    return num;
  } catch (error) {
    console.error("[DB] appendEntityLeadgenLeads 失败:", error);
    return 0;
  }
}
function replaceEntityLeadgenLeads(arg1, list = []) {
  if (!db || !arg1) {
    return 0;
  }
  const value = Array.isArray(list) ? list : [];
  try {
    const result = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(String(arg1));
    if (!result) {
      return 0;
    }
    const result2 = db.prepare("\n            INSERT INTO entity_leadgen_leads (id, task_id, ts, nickname, source_type, account_id, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                task_id = excluded.task_id,\n                ts = excluded.ts,\n                nickname = excluded.nickname,\n                source_type = excluded.source_type,\n                account_id = excluded.account_id,\n                raw_data = excluded.raw_data\n        ");
    const result3 = db.transaction(arg12 => {
      db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?").run(String(arg1));
      let num = 0;
      for (const item of arg12) {
        if (!item || typeof item !== "object") {
          continue;
        }
        const result = extractEntityLeadgenLeadColumns(arg1, item);
        result2.run(result.id, result.task_id, result.ts, result.nickname, result.source_type, result.account_id, result.raw_data);
        num += 1;
      }
      return num;
    });
    return result3(value);
  } catch (error) {
    console.error("[DB] replaceEntityLeadgenLeads 失败:", error);
    return 0;
  }
}
function deleteEntityLeadgenLeads(arg1, {
  leadIds = [],
  clearAll = false
} = {}) {
  if (!db || !arg1) {
    return 0;
  }
  try {
    if (clearAll) {
      return db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?").run(String(arg1)).changes || 0;
    }
    const result = (Array.isArray(leadIds) ? leadIds : [leadIds]).map(String).filter(Boolean);
    if (!result.length) {
      return 0;
    }
    const result2 = db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ? AND id = ?");
    let num = 0;
    const result3 = db.transaction(arg12 => {
      for (const item of arg12) {
        num += result2.run(String(arg1), item).changes || 0;
      }
    });
    result3(result);
    return num;
  } catch (error) {
    console.error("[DB] deleteEntityLeadgenLeads 失败:", error);
    return 0;
  }
}
function listEntityLeadgenLeadsPage(arg1, options = {}) {
  if (!db || !arg1) {
    return {
      items: [],
      total: 0,
      counts: {
        all: 0,
        comments: 0,
        video: 0,
        author: 0
      }
    };
  }
  try {
    return entityLeadgenLeadsQuery.listEntityLeadgenLeadsPage(db, arg1, options);
  } catch (error) {
    console.error("[DB] listEntityLeadgenLeadsPage 失败:", error);
    return {
      items: [],
      total: 0,
      counts: {
        all: 0,
        comments: 0,
        video: 0,
        author: 0
      }
    };
  }
}
function countEntityLeadgenLeads(arg1) {
  if (!db || !arg1) {
    return 0;
  }
  try {
    const result = db.prepare("SELECT COUNT(*) AS cnt FROM entity_leadgen_leads WHERE task_id = ?").get(String(arg1));
    if (result) {
      return Number(result.cnt) || 0;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}
function getEntityLeadgenTasksCount() {
  if (!db) {
    return 0;
  }
  try {
    const result = db.prepare("SELECT COUNT(*) AS cnt FROM entity_leadgen_tasks").get();
    if (result) {
      return Number(result.cnt) || 0;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}
function isEntityLeadgenRuntimeReady() {
  return isMigrationExecuted("v4_entity_leadgen_sqlite");
}
function isMigrationExecuted(arg1) {
  if (!db) {
    return false;
  }
  try {
    const result = db.prepare("SELECT name FROM sys_migrations WHERE name = ?").get(arg1);
    return Boolean(result);
  } catch (error) {
    return false;
  }
}
function recordMigration(arg1) {
  if (!db) {
    return false;
  }
  try {
    db.prepare("INSERT INTO sys_migrations (name, executed_at) VALUES (?, ?)").run(arg1, Date.now());
    return true;
  } catch (error) {
    console.error("[DB] 记录迁移 [" + arg1 + "] 失败:", error);
    return false;
  }
}
function getDatabaseInstance() {
  return db;
}
module.exports = {
  initDatabase: initDatabase,
  runCollectedLibraryMigrations: runCollectedLibraryMigrations,
  getDatabaseInstance: getDatabaseInstance,
  getKV: getKV,
  setKV: setKV,
  getAccountPool: getAccountPool,
  saveAccountPool: saveAccountPool,
  getProcessedVideosDetail: getProcessedVideosDetail,
  saveProcessedVideosDetail: saveProcessedVideosDetail,
  getMonitorNotifiedKeys: getMonitorNotifiedKeys,
  saveMonitorNotifiedKeys: saveMonitorNotifiedKeys,
  saveLeadsBatch: saveLeadsBatch,
  getLeadsCount: getLeadsCount,
  aggregateLeadsPoolStats: aggregateLeadsPoolStats,
  getLeadById: getLeadById,
  listLeadsByIds: listLeadsByIds,
  getLeadByUserKey: getLeadByUserKey,
  findLeadRowId: findLeadRowId,
  upsertLead: upsertLead,
  upsertLeadsBatch: upsertLeadsBatch,
  setLeadLastBatchFollowResult: setLeadLastBatchFollowResult,
  deleteFailedBatchFollowLeads: deleteFailedBatchFollowLeads,
  deleteLeadsByIds: deleteLeadsByIds,
  clearAllLeads: clearAllLeads,
  deleteLowIntentionLeads: deleteLowIntentionLeads,
  deleteTouchedLeads: deleteTouchedLeads,
  listLeadUserKeys: listLeadUserKeys,
  findExistingLeadUserKeys: findExistingLeadUserKeys,
  queryLeadsPage: queryLeadsPage,
  listVideoCardLeads: listVideoCardLeads,
  listCollectedVideos: listCollectedVideos,
  listCollectedVideoLinkHints: listCollectedVideoLinkHints,
  queryCollectedVideosPage: queryCollectedVideosPage,
  listCollectedVideoUrls: listCollectedVideoUrls,
  listCollectedVideoImportKeys: listCollectedVideoImportKeys,
  listCollectedAuthors: listCollectedAuthors,
  listCollectedAuthorDedupKeys: listCollectedAuthorDedupKeys,
  queryCollectedAuthorsPage: queryCollectedAuthorsPage,
  deleteCollectedVideosByKeys: deleteCollectedVideosByKeys,
  deleteCollectedAuthorsByKeys: deleteCollectedAuthorsByKeys,
  clearAllCollectedVideos: clearAllCollectedVideos,
  clearAllCollectedAuthors: clearAllCollectedAuthors,
  clearAllEntityLeadgenVideoCards: clearAllEntityLeadgenVideoCards,
  stripAuthorTargetFromEntityLeadgenVideoCards: stripAuthorTargetFromEntityLeadgenVideoCards,
  listLeadsByAutomationTaskIds: listLeadsByAutomationTaskIds,
  queryLeadsByAutomationTaskIdsPage: queryLeadsByAutomationTaskIdsPage,
  listEntityLeadgenVideoCardLeads: listEntityLeadgenVideoCardLeads,
  syncEntityVideoCardsIntoLeadPool: syncEntityVideoCardsIntoLeadPool,
  deleteEntityLeadgenVideoCardsByKeys: deleteEntityLeadgenVideoCardsByKeys,
  normalizeVideoCardLeadForPool: normalizeVideoCardLeadForPool,
  isVideoCardLeadLike: isVideoCardLeadLike,
  restoreLeadsCollectedSplitFromBackup: restoreLeadsCollectedSplitFromBackup,
  isCollectedSplitMigrationDone: isCollectedSplitMigrationDone,
  listLeadAccountNames: listLeadAccountNames,
  listLeadAccountOptions: listLeadAccountOptions,
  backfillLeadAccountIdsFromPool: backfillLeadAccountIdsFromPool,
  listLeadSearchKeywords: listLeadSearchKeywords,
  listLeadLocations: listLeadLocations,
  isLeadsRuntimeReady: isLeadsRuntimeReady,
  getAllLeadsRaw: getAllLeadsRaw,
  getAiAgents: getAiAgents,
  saveAiAgentsBatch: saveAiAgentsBatch,
  deleteAiAgent: deleteAiAgent,
  listEntityLeadgenTasks: listEntityLeadgenTasks,
  getEntityLeadgenTaskById: getEntityLeadgenTaskById,
  upsertEntityLeadgenTask: upsertEntityLeadgenTask,
  deleteEntityLeadgenTasks: deleteEntityLeadgenTasks,
  appendEntityLeadgenLeads: appendEntityLeadgenLeads,
  replaceEntityLeadgenLeads: replaceEntityLeadgenLeads,
  deleteEntityLeadgenLeads: deleteEntityLeadgenLeads,
  listEntityLeadgenLeadsPage: listEntityLeadgenLeadsPage,
  countEntityLeadgenLeads: countEntityLeadgenLeads,
  getEntityLeadgenTasksCount: getEntityLeadgenTasksCount,
  isEntityLeadgenRuntimeReady: isEntityLeadgenRuntimeReady,
  isMigrationExecuted: isMigrationExecuted,
  recordMigration: recordMigration,
  ensureLeadSchemaColumns: ensureLeadSchemaColumns
};
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
function initDatabase(_0x4eaaf7) {
  const _0x46bd57 = path.join(_0x4eaaf7, "huoke_radar.db");
  if (isInitialized && db && activeDbPath === _0x46bd57) {
    return db;
  }
  try {
    if (db) {
      try {
        db.close();
      } catch (_0x38b0b8) {}
      db = null;
      isInitialized = false;
      activeDbPath = null;
      activeUserDataPath = null;
    }
    if (!fs.existsSync(_0x4eaaf7)) {
      fs.mkdirSync(_0x4eaaf7, {
        recursive: true
      });
    }
    const _0x5254fa = require("better-sqlite3");
    console.log("[DB] 正在连接 SQLite 数据库: " + _0x46bd57);
    db = new _0x5254fa(_0x46bd57, {
      timeout: 5000
    });
    db.pragma("journal_mode = WAL");
    db.pragma("busy_timeout = 5000");
    db.pragma("synchronous = NORMAL");
    db.pragma("foreign_keys = ON");
    createTablesSchema();
    activeUserDataPath = _0x4eaaf7;
    processedVideosStore.ensureTables(db);
    batchFollowRunsAccess.ensureTables(db);
    monitorTaskSeenAccess.ensureTables(db);
    accountVideoMainCommentsAccess.ensureTables(db);
    isInitialized = true;
    activeDbPath = _0x46bd57;
    console.log("[DB] SQLite 数据库已成功初始化，WAL 模式生效");
    return db;
  } catch (_0x4ef327) {
    console.error("[DB] SQLite 数据库初始化失败:", _0x4ef327);
    throw _0x4ef327;
  }
}
function runCollectedLibraryMigrations(_0x128d12 = activeUserDataPath, _0x5ae964 = null) {
  if (!db) {
    return {
      ok: false,
      error: "db_not_ready"
    };
  }
  const _0x3c7a5b = _0x128d12 || activeUserDataPath;
  const _0x49eb10 = {
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
    _0x49eb10.split = leadsCollectedSplitMigrate.runLeadsCollectedSplitMigrationIfNeeded(db, _0x3c7a5b);
  } catch (_0x4a4830) {
    console.error("[DB] leads_split_collected_v1 迁移异常（不影响启动）:", _0x4a4830);
    _0x49eb10.split = {
      error: _0x4a4830.message || String(_0x4a4830)
    };
    _0x49eb10.ok = false;
  }
  try {
    _0x49eb10.secUid = leadsSecUidBackfill.runLeadsSecUidBackfillIfNeeded(db);
  } catch (_0x48a721) {
    console.error("[DB] leads_sec_uid_backfill_v1 异常（不影响启动）:", _0x48a721);
    _0x49eb10.secUid = {
      error: _0x48a721.message || String(_0x48a721)
    };
  }
  try {
    _0x49eb10.processedVideos = processedVideosAccess.runProcessedVideosSqliteMigrationIfNeeded(_0x5ae964);
  } catch (_0x5cf1f4) {
    console.error("[DB] processed_videos_sqlite_v1 异常（不影响启动）:", _0x5cf1f4);
    _0x49eb10.processedVideos = {
      error: _0x5cf1f4.message || String(_0x5cf1f4)
    };
  }
  try {
    _0x49eb10.batchFollowRuns = batchFollowRunsAccess.runBatchFollowRunsSqliteMigrationIfNeeded(_0x5ae964);
  } catch (_0x35fb31) {
    console.error("[DB] batch_follow_runs_sqlite_v1 异常（不影响启动）:", _0x35fb31);
    _0x49eb10.batchFollowRuns = {
      error: _0x35fb31.message || String(_0x35fb31)
    };
  }
  try {
    _0x49eb10.monitorTaskSeen = monitorTaskSeenAccess.runMonitorTaskSeenSqliteMigrationIfNeeded(_0x5ae964);
  } catch (_0x7be10e) {
    console.error("[DB] monitor_task_seen_sqlite_v1 异常（不影响启动）:", _0x7be10e);
    _0x49eb10.monitorTaskSeen = {
      error: _0x7be10e.message || String(_0x7be10e)
    };
  }
  try {
    const _0x5daa3c = require("./monitorTaskDetailsStore");
    _0x5daa3c.ensureTables(db);
    _0x49eb10.monitorTaskDetails = {
      ok: true
    };
  } catch (_0x69a688) {
    console.error("[DB] monitor_task_details 建表异常（不影响启动）:", _0x69a688);
    _0x49eb10.monitorTaskDetails = {
      error: _0x69a688.message || String(_0x69a688)
    };
  }
  try {
    _0x49eb10.accountVideoMainComments = accountVideoMainCommentsAccess.runAccountVideoMainCommentsSqliteMigrationIfNeeded(_0x5ae964);
  } catch (_0x16fca5) {
    console.error("[DB] account_video_main_comments_sqlite_v1 异常（不影响启动）:", _0x16fca5);
    _0x49eb10.accountVideoMainComments = {
      error: _0x16fca5.message || String(_0x16fca5)
    };
  }
  return _0x49eb10;
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
function tableHasColumn(_0x3504c5, _0x1726d0) {
  if (!db) {
    return false;
  }
  try {
    const _0x5e859f = db.prepare("PRAGMA table_info(" + _0x3504c5 + ")").all();
    return _0x5e859f.some(_0x866b28 => String(_0x866b28.name) === String(_0x1726d0));
  } catch (_0x3b1067) {
    return false;
  }
}
function ensureLeadSchemaColumns() {
  if (!db) {
    return;
  }
  const _0x1b9a9d = [["is_high_intention", "INTEGER DEFAULT 0"], ["lead_kind", "TEXT DEFAULT ''"], ["entry_source", "TEXT DEFAULT ''"], ["search_keyword", "TEXT DEFAULT ''"], ["account_name", "TEXT DEFAULT ''"], ["location", "TEXT DEFAULT ''"], ["sec_uid", "TEXT DEFAULT ''"], ["last_batch_follow_result", "TEXT DEFAULT ''"]];
  for (const [_0x2023f9, _0x3ce062] of _0x1b9a9d) {
    if (!tableHasColumn("leads", _0x2023f9)) {
      try {
        db.exec("ALTER TABLE leads ADD COLUMN " + _0x2023f9 + " " + _0x3ce062);
      } catch (_0x18966c) {
        console.warn("[DB] ALTER leads ADD " + _0x2023f9 + " 失败:", _0x18966c.message);
      }
    }
  }
  try {
    db.exec("\n            CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_sec_uid_unique\n            ON leads(sec_uid)\n            WHERE sec_uid IS NOT NULL AND sec_uid != ''\n        ");
  } catch (_0x2a09ef) {
    console.warn("[DB] CREATE UNIQUE INDEX idx_leads_sec_uid_unique 失败:", _0x2a09ef.message);
  }
}
function extractLeadLocation(_0xd7e02b) {
  if (!_0xd7e02b || typeof _0xd7e02b !== "object") {
    return "";
  }
  const _0x4e4b85 = _0xd7e02b.location || _0xd7e02b.ipLocation || _0xd7e02b.region || _0xd7e02b.city || "";
  return String(_0x4e4b85 || "").trim().slice(0, 80);
}
function resolveLeadCapturedAtMs(_0x5b3354, _0x10b781 = Date.now()) {
  if (!_0x5b3354 || typeof _0x5b3354 !== "object") {
    return _0x10b781;
  }
  const _0x5ae9c1 = _0x5b3354.timestamp;
  const _0x1b29fb = Number(_0x5ae9c1);
  if (Number.isFinite(_0x1b29fb) && _0x1b29fb > 100000000000) {
    return Math.floor(_0x1b29fb);
  }
  if (Number.isFinite(_0x1b29fb) && _0x1b29fb > 1000000000 && _0x1b29fb < 100000000000) {
    return Math.floor(_0x1b29fb * 1000);
  }
  const _0x3d0279 = Date.parse(_0x5ae9c1 || "");
  if (Number.isFinite(_0x3d0279) && _0x3d0279 > 0) {
    return _0x3d0279;
  }
  const _0x34ac85 = Date.parse(_0x5b3354.capturedAt || "");
  if (Number.isFinite(_0x34ac85) && _0x34ac85 > 0) {
    return _0x34ac85;
  }
  const _0x46df50 = Number(_0x5b3354.ts);
  if (Number.isFinite(_0x46df50) && _0x46df50 > 100000000000) {
    return Math.floor(_0x46df50);
  }
  if (Number.isFinite(_0x46df50) && _0x46df50 > 1000000000 && _0x46df50 < 100000000000) {
    return Math.floor(_0x46df50 * 1000);
  }
  return _0x10b781;
}
function isVideoCardLeadLike(_0x1e25c9 = {}) {
  if (!_0x1e25c9 || typeof _0x1e25c9 !== "object") {
    return false;
  }
  try {
    const _0x28c747 = require("../shared/leadUserKey");
    return !!_0x28c747.isVideoLeadRecord(_0x1e25c9);
  } catch (_0x5acc22) {
    if (_0x1e25c9.leadKind === "video_card" || _0x1e25c9.sourceType === "video" || _0x1e25c9.identityType === "video") {
      return true;
    }
    const _0x494aef = String(_0x1e25c9.leadId || _0x1e25c9.userKey || _0x1e25c9.key || _0x1e25c9.id || "").trim();
    if (/^video:\d{10,}$/.test(_0x494aef)) {
      return true;
    }
    const _0xe9a5eb = String(_0x1e25c9.userUrl || "").trim();
    return /(?:video|note)\/\d{10,}/i.test(_0xe9a5eb);
  }
}
function normalizeVideoCardLeadForPool(_0x26e678 = {}) {
  const _0x49d489 = _0x26e678 && typeof _0x26e678 === "object" ? {
    ..._0x26e678
  } : {};
  let _0x201e94 = "";
  try {
    const {
      extractDouyinVideoId: _0x3521d4
    } = require("../shared/processedVideoKey");
    _0x201e94 = _0x3521d4(_0x49d489.videoUrl || _0x49d489.url || _0x49d489.content || "") || "";
  } catch (_0x19faa5) {
    _0x201e94 = "";
  }
  if (!_0x201e94) {
    const _0x46c3c2 = String(_0x49d489.leadId || _0x49d489.userKey || _0x49d489.key || _0x49d489.id || "").match(/^video:(\d{10,})$/);
    if (_0x46c3c2) {
      _0x201e94 = _0x46c3c2[1];
    }
  }
  if (!_0x201e94) {
    const _0x417eb8 = String(_0x49d489.videoUrl || _0x49d489.url || _0x49d489.content || "").match(/(?:video|note)\/(\d{10,})/i);
    if (_0x417eb8) {
      _0x201e94 = _0x417eb8[1];
    }
  }
  if (!_0x201e94) {
    return null;
  }
  const _0x2c938e = "https://www.douyin.com/video/" + _0x201e94;
  const _0x344b9a = "video:" + _0x201e94;
  const _0x2f9fc9 = resolveLeadCapturedAtMs(_0x49d489, Date.now());
  const _0x43df6e = String(_0x49d489.title || _0x49d489.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
  const _0x1d4b49 = Array.isArray(_0x49d489.collectedFields);
  const _0x3d3359 = _0x1d4b49 ? _0x49d489.collectedFields.map(String).filter(Boolean) : [];
  if (!_0x1d4b49 || _0x3d3359.length === 0) {
    _0x3d3359.push("video");
  }
  return {
    ..._0x49d489,
    platform: _0x49d489.platform || "DY",
    leadKind: "video_card",
    leadId: _0x344b9a,
    key: _0x344b9a,
    userKey: _0x344b9a,
    title: _0x43df6e,
    nickname: _0x49d489.nickname && _0x49d489.nickname !== _0x43df6e ? _0x49d489.nickname : _0x49d489.authorNickname || "未知作者",
    content: _0x49d489.content || "",
    timeText: _0x49d489.timeText || "卡片采集",
    userUrl: _0x49d489.userUrl || "",
    authorProfileUrl: _0x49d489.authorProfileUrl || "",
    url: _0x2c938e,
    videoUrl: _0x2c938e,
    identityType: "video",
    profileAvailable: false,
    profileUnavailable: true,
    profileUnavailableReason: _0x49d489.profileUnavailableReason || "视频作品链接",
    collectedFields: _0x3d3359,
    sourceType: "video",
    entrySource: _0x49d489.entrySource || "entity_video",
    entryLabel: _0x49d489.entryLabel || "线索采集：视频作品链接",
    searchKeyword: String(_0x49d489.searchKeyword || ""),
    timestamp: _0x2f9fc9,
    capturedAt: _0x49d489.capturedAt || new Date(_0x2f9fc9).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function extractLeadColumns(_0x27ab96) {
  let _0x19a170 = _0x27ab96 && typeof _0x27ab96 === "object" ? {
    ..._0x27ab96
  } : {};
  const _0x606dc4 = Date.now();
  if (isVideoCardLeadLike(_0x19a170)) {
    const _0x175948 = normalizeVideoCardLeadForPool(_0x19a170);
    if (_0x175948) {
      _0x19a170 = _0x175948;
    } else {
      _0x19a170.leadKind = "video_card";
      if (_0x19a170.sourceType === "video" || !_0x19a170.sourceType) {
        _0x19a170.sourceType = "video";
      }
    }
  }
  let _0x57c7bf = null;
  try {
    _0x57c7bf = require("../shared/leadUserKey");
  } catch (_0x3bc35c) {
    _0x57c7bf = null;
  }
  const _0x268eb0 = _0x57c7bf ? String(_0x57c7bf.getPersonLeadSecUid?.(_0x19a170) || "").trim() : "";
  let _0x4ab74a = "";
  try {
    _0x4ab74a = String(_0x57c7bf?.getLeadUserKey(_0x19a170) || "").trim();
  } catch (_0x18eaa1) {
    _0x4ab74a = "";
  }
  let _0x5bdfa0 = "";
  if (isVideoCardLeadLike(_0x19a170)) {
    _0x5bdfa0 = String(_0x19a170.leadId || _0x19a170.key || _0x4ab74a || _0x19a170.id || "lead_" + _0x606dc4);
  } else if (_0x268eb0) {
    _0x5bdfa0 = _0x268eb0;
    _0x19a170.secUid = _0x268eb0;
    _0x19a170.leadId = _0x268eb0;
    _0x19a170.key = _0x268eb0;
    _0x19a170.userKey = _0x268eb0;
  } else {
    const _0x53a3f8 = _0x57c7bf?.buildLeadId ? String(_0x57c7bf.buildLeadId({
      ..._0x19a170,
      leadId: _0x57c7bf.isTransientLeadIdentityKey?.(_0x19a170.leadId) ? "" : _0x19a170.leadId,
      key: _0x57c7bf.isTransientLeadIdentityKey?.(_0x19a170.key) ? "" : _0x19a170.key,
      userKey: _0x57c7bf.isDouyinSecUid?.(_0x19a170.userKey) ? _0x19a170.userKey : ""
    }) || "").trim() : "";
    _0x5bdfa0 = _0x53a3f8 || "lead_" + _0x606dc4;
    _0x19a170.leadId = _0x5bdfa0;
    _0x19a170.key = _0x5bdfa0;
  }
  const _0x2d27d0 = resolveLeadCapturedAtMs(_0x19a170, _0x606dc4);
  _0x19a170.timestamp = _0x2d27d0;
  if (!_0x19a170.capturedAt) {
    _0x19a170.capturedAt = new Date(_0x2d27d0).toISOString();
  }
  const _0x4b187c = String(_0x19a170.leadKind || _0x19a170.sourceType || _0x19a170.identityType || "").slice(0, 40);
  const _0x528fba = _0x4b187c === "video" || _0x19a170.leadKind === "video_card" ? "video_card" : _0x4b187c;
  const _0x560dc7 = {
    ..._0x19a170
  };
  delete _0x560dc7.lastBatchFollowResult;
  return {
    id: _0x5bdfa0,
    lead_user_id: String(_0x268eb0 || _0x4ab74a || _0x19a170.leadUserId || _0x5bdfa0 || "").slice(0, 200),
    sec_uid: _0x268eb0.slice(0, 200),
    nickname: String(_0x19a170.nickname || "").slice(0, 200),
    video_id: String(_0x19a170.videoId || (String(_0x5bdfa0).startsWith("video:") ? _0x5bdfa0.slice(6) : "") || "").slice(0, 80),
    video_title: String(_0x19a170.title || _0x19a170.videoTitle || "").slice(0, 300),
    account_id: String(_0x19a170.accountId || "").slice(0, 120),
    content: String(_0x19a170.content || _0x19a170.comment || "").slice(0, 2000),
    captured_at: _0x2d27d0,
    is_high_intention: _0x19a170.isHighIntention ? 1 : 0,
    lead_kind: _0x528fba,
    entry_source: String(_0x19a170.entrySource || "").slice(0, 60),
    search_keyword: String(_0x19a170.searchKeyword || "").slice(0, 120),
    account_name: String(_0x19a170.accountName || "").slice(0, 120),
    location: extractLeadLocation(_0x19a170),
    raw_data: JSON.stringify(_0x560dc7)
  };
}
function parseLeadRow(_0x217662) {
  if (!_0x217662) {
    return null;
  }
  try {
    const _0x2165cb = JSON.parse(_0x217662.raw_data || "{}");
    if (!_0x2165cb.leadId && _0x217662.id) {
      _0x2165cb.leadId = _0x217662.id;
    }
    if (!_0x2165cb.key && _0x217662.id) {
      _0x2165cb.key = _0x217662.id;
    }
    const _0x3b14b7 = Number(_0x217662.captured_at) || 0;
    const _0x250532 = resolveLeadCapturedAtMs(_0x2165cb, 0);
    const _0x435a05 = (_0x250532 > 0 ? _0x250532 : 0) || (_0x3b14b7 > 0 ? _0x3b14b7 : 0);
    if (_0x435a05 > 0) {
      const _0x56493a = Number(_0x2165cb.timestamp) > 0 || Number.isFinite(Date.parse(_0x2165cb.timestamp || "")) && Date.parse(_0x2165cb.timestamp) > 0;
      if (!_0x56493a) {
        _0x2165cb.timestamp = _0x435a05;
      }
      if (!_0x2165cb.capturedAt) {
        _0x2165cb.capturedAt = new Date(_0x435a05).toISOString();
      }
    }
    const _0x50cc39 = String(_0x217662.last_batch_follow_result || "").trim();
    if (_0x50cc39) {
      try {
        const _0x114915 = JSON.parse(_0x50cc39);
        if (_0x114915 && typeof _0x114915 === "object") {
          _0x2165cb.lastBatchFollowResult = _0x114915;
        }
      } catch (_0x559262) {
        if (_0x50cc39 === "success" || _0x50cc39 === "failed") {
          _0x2165cb.lastBatchFollowResult = {
            status: _0x50cc39
          };
        }
      }
    } else {
      delete _0x2165cb.lastBatchFollowResult;
    }
    return _0x2165cb;
  } catch (_0x1923b5) {
    return null;
  }
}
function getKV(_0x3e0a04, _0x25114d = null) {
  if (!db) {
    return _0x25114d;
  }
  try {
    const _0x29f0b8 = db.prepare("SELECT value FROM sys_kv WHERE key = ?");
    const _0x1d1bfc = _0x29f0b8.get(_0x3e0a04);
    if (!_0x1d1bfc) {
      return _0x25114d;
    }
    try {
      return JSON.parse(_0x1d1bfc.value);
    } catch (_0x73a6c7) {
      return _0x1d1bfc.value;
    }
  } catch (_0x197091) {
    console.error("[DB] getKV失败 [" + _0x3e0a04 + "]:", _0x197091);
    return _0x25114d;
  }
}
function setKV(_0x4e3c56, _0x36f6d4) {
  if (!db) {
    return false;
  }
  try {
    const _0x2c3c9d = typeof _0x36f6d4 === "object" ? JSON.stringify(_0x36f6d4) : String(_0x36f6d4);
    const _0x4750cb = db.prepare("\n            INSERT INTO sys_kv (key, value, updated_at)\n            VALUES (?, ?, ?)\n            ON CONFLICT(key) DO UPDATE SET\n                value = excluded.value,\n                updated_at = excluded.updated_at\n        ");
    _0x4750cb.run(_0x4e3c56, _0x2c3c9d, Date.now());
    return true;
  } catch (_0x436591) {
    console.error("[DB] setKV失败 [" + _0x4e3c56 + "]:", _0x436591);
    return false;
  }
}
function getAccountPool() {
  if (!db) {
    return [];
  }
  try {
    const _0x5ba2b8 = db.prepare("SELECT raw_data FROM accounts ORDER BY updated_at DESC");
    const _0x3c7b84 = _0x5ba2b8.all();
    return _0x3c7b84.map(_0x5b682c => {
      try {
        return JSON.parse(_0x5b682c.raw_data);
      } catch (_0x3870c3) {
        return null;
      }
    }).filter(Boolean);
  } catch (_0x499934) {
    console.error("[DB] getAccountPool 失败:", _0x499934);
    return [];
  }
}
function saveAccountPool(_0x1b781a) {
  if (!db || !Array.isArray(_0x1b781a)) {
    return false;
  }
  try {
    const _0x402ffd = db.prepare("DELETE FROM accounts");
    const _0x5bfb16 = db.prepare("\n            INSERT INTO accounts (id, platform, name, nickname, avatar, cookie, fingerprintSeed, fingerprintPolicy, created_at, updated_at, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ");
    const _0x20b87c = db.transaction(_0x844a90 => {
      _0x402ffd.run();
      const _0x8b5098 = Date.now();
      for (const _0x5a9d08 of _0x844a90) {
        if (!_0x5a9d08 || !_0x5a9d08.id) {
          continue;
        }
        _0x5bfb16.run(String(_0x5a9d08.id), String(_0x5a9d08.platform || "douyin"), _0x5a9d08.name || "", _0x5a9d08.nickname || "", _0x5a9d08.avatar || "", _0x5a9d08.cookie || "", _0x5a9d08.fingerprintSeed || "", _0x5a9d08.fingerprintPolicy || "passthrough", _0x5a9d08.created_at || _0x8b5098, _0x8b5098, JSON.stringify(_0x5a9d08));
      }
    });
    _0x20b87c(_0x1b781a);
    return true;
  } catch (_0x156fd4) {
    console.error("[DB] saveAccountPool 失败:", _0x156fd4);
    return false;
  }
}
function getProcessedVideosDetail() {
  if (!db) {
    return [];
  }
  return processedVideosStore.listAll(db);
}
function saveProcessedVideosDetail(_0x6a91fc) {
  if (!db || !Array.isArray(_0x6a91fc)) {
    return false;
  }
  return processedVideosStore.replaceAll(db, _0x6a91fc);
}
function getMonitorNotifiedKeys() {
  if (!db) {
    return [];
  }
  try {
    const _0x220bc6 = db.prepare("SELECT key_hash FROM monitor_notified_keys");
    return _0x220bc6.all().map(_0x2da764 => _0x2da764.key_hash);
  } catch (_0x3bf273) {
    console.error("[DB] getMonitorNotifiedKeys 失败:", _0x3bf273);
    return [];
  }
}
function saveMonitorNotifiedKeys(_0x1e2308) {
  if (!db || !Array.isArray(_0x1e2308)) {
    return false;
  }
  try {
    const _0x597608 = db.prepare("\n            INSERT INTO monitor_notified_keys (key_hash, created_at)\n            VALUES (?, ?)\n            ON CONFLICT(key_hash) DO NOTHING\n        ");
    const _0x17f07e = db.transaction(_0x59f1e4 => {
      const _0x35e56e = Date.now();
      for (const _0x560469 of _0x59f1e4) {
        if (!_0x560469) {
          continue;
        }
        _0x597608.run(String(_0x560469), _0x35e56e);
      }
    });
    _0x17f07e(_0x1e2308);
    return true;
  } catch (_0x53c6a9) {
    console.error("[DB] saveMonitorNotifiedKeys 失败:", _0x53c6a9);
    return false;
  }
}
function saveLeadsBatch(_0x2bf9fb) {
  if (!db || !Array.isArray(_0x2bf9fb)) {
    return 0;
  }
  try {
    ensureLeadSchemaColumns();
    const _0x536eef = db.prepare("\n            INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n            )\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                lead_user_id = excluded.lead_user_id,\n                nickname = excluded.nickname,\n                video_id = excluded.video_id,\n                video_title = excluded.video_title,\n                account_id = excluded.account_id,\n                content = excluded.content,\n                captured_at = excluded.captured_at,\n                raw_data = excluded.raw_data,\n                is_high_intention = excluded.is_high_intention,\n                lead_kind = excluded.lead_kind,\n                entry_source = excluded.entry_source,\n                search_keyword = excluded.search_keyword,\n                account_name = excluded.account_name,\n                location = excluded.location,\n                sec_uid = excluded.sec_uid\n        ");
    let _0x215e1f = 0;
    const _0x40fee4 = db.transaction(_0x3a6e1a => {
      for (let _0x4616ba = 0; _0x4616ba < _0x3a6e1a.length; _0x4616ba++) {
        const _0x79a25 = _0x3a6e1a[_0x4616ba];
        if (!_0x79a25 || typeof _0x79a25 !== "object") {
          continue;
        }
        if (collectedLibraryWrite.isCollectedRouteLead(_0x79a25)) {
          if (collectedLibraryWrite.upsertCollectedFromLead(db, _0x79a25).written) {
            _0x215e1f++;
          }
          continue;
        }
        const _0xdbcd65 = extractLeadColumns(_0x79a25);
        if (!_0xdbcd65.id) {
          continue;
        }
        _0x536eef.run(_0xdbcd65.id, _0xdbcd65.lead_user_id, _0xdbcd65.nickname, _0xdbcd65.video_id, _0xdbcd65.video_title, _0xdbcd65.account_id, _0xdbcd65.content, _0xdbcd65.captured_at, _0xdbcd65.raw_data, _0xdbcd65.is_high_intention, _0xdbcd65.lead_kind, _0xdbcd65.entry_source, _0xdbcd65.search_keyword, _0xdbcd65.account_name, _0xdbcd65.location, _0xdbcd65.sec_uid);
        _0x215e1f++;
      }
    });
    _0x40fee4(_0x2bf9fb);
    return _0x215e1f;
  } catch (_0x64283b) {
    console.error("[DB] saveLeadsBatch 失败:", _0x64283b);
    return 0;
  }
}
function getLeadById(_0x18aaba) {
  if (!db || !_0x18aaba) {
    return null;
  }
  try {
    const _0x2912ca = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads WHERE id = ?").get(String(_0x18aaba));
    return parseLeadRow(_0x2912ca);
  } catch (_0x2dc0c4) {
    console.error("[DB] getLeadById 失败:", _0x2dc0c4);
    return null;
  }
}
function listLeadsByIds(_0x4ff639 = [], _0x3e6fad = {}) {
  if (!db) {
    return [];
  }
  const _0x2184d6 = (Array.isArray(_0x4ff639) ? _0x4ff639 : [_0x4ff639]).map(_0x57740b => String(_0x57740b || "").trim()).filter(Boolean);
  if (!_0x2184d6.length) {
    return [];
  }
  const _0x6b6cec = [...new Set(_0x2184d6)];
  const _0x5591dd = Math.max(1, Math.min(100000, Number(_0x3e6fad.limit) || _0x6b6cec.length));
  const _0x2463dc = Math.max(50, Math.min(400, Number(_0x3e6fad.chunkSize) || 300));
  try {
    ensureLeadSchemaColumns();
    const _0x1583e4 = new Map();
    const _0x4bf32a = new Map();
    for (let _0x4353e0 = 0; _0x4353e0 < _0x6b6cec.length; _0x4353e0 += _0x2463dc) {
      const _0x1da585 = _0x6b6cec.slice(_0x4353e0, _0x4353e0 + _0x2463dc);
      const _0x1e2610 = _0x1da585.map(() => "?").join(",");
      const _0x32a858 = db.prepare("\n                SELECT id, captured_at, raw_data, lead_user_id, last_batch_follow_result FROM leads\n                WHERE id IN (" + _0x1e2610 + ") OR lead_user_id IN (" + _0x1e2610 + ")\n            ").all(..._0x1da585, ..._0x1da585);
      for (const _0x5a853c of _0x32a858) {
        const _0x3a467a = parseLeadRow(_0x5a853c);
        if (!_0x3a467a) {
          continue;
        }
        const _0xa23458 = String(_0x5a853c.id || _0x3a467a.leadId || "");
        if (!_0xa23458) {
          continue;
        }
        if (!_0x1583e4.has(_0xa23458)) {
          _0x1583e4.set(_0xa23458, _0x3a467a);
        }
        _0x4bf32a.set(_0xa23458, _0xa23458);
        const _0xaa71a2 = String(_0x5a853c.lead_user_id || _0x3a467a.leadUserId || _0x3a467a.userKey || "").trim();
        if (_0xaa71a2) {
          _0x4bf32a.set(_0xaa71a2, _0xa23458);
        }
        if (_0x3a467a.leadId) {
          _0x4bf32a.set(String(_0x3a467a.leadId), _0xa23458);
        }
        if (_0x3a467a.key) {
          _0x4bf32a.set(String(_0x3a467a.key), _0xa23458);
        }
      }
    }
    const _0x2d8b00 = [];
    const _0x4a8496 = new Set();
    for (const _0x166039 of _0x2184d6) {
      const _0x4bd7f8 = _0x4bf32a.get(_0x166039);
      if (!_0x4bd7f8 || _0x4a8496.has(_0x4bd7f8)) {
        continue;
      }
      const _0x4da240 = _0x1583e4.get(_0x4bd7f8);
      if (!_0x4da240) {
        continue;
      }
      _0x4a8496.add(_0x4bd7f8);
      _0x2d8b00.push(_0x4da240);
      if (_0x2d8b00.length >= _0x5591dd) {
        break;
      }
    }
    return _0x2d8b00;
  } catch (_0x2ecb6f) {
    console.error("[DB] listLeadsByIds 失败:", _0x2ecb6f);
    return [];
  }
}
function getLeadByUserKey(_0x16e023) {
  if (!db || !_0x16e023) {
    return null;
  }
  try {
    const _0x35137d = String(_0x16e023);
    const _0x19bcd1 = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(_0x35137d, _0x35137d);
    return parseLeadRow(_0x19bcd1);
  } catch (_0x588340) {
    console.error("[DB] getLeadByUserKey 失败:", _0x588340);
    return null;
  }
}
function findLeadRowId(_0x58ccd4) {
  if (!db || _0x58ccd4 == null) {
    return null;
  }
  try {
    let _0x4b3a17 = "";
    let _0x1f7ef5 = null;
    if (typeof _0x58ccd4 === "object") {
      _0x1f7ef5 = _0x58ccd4;
      try {
        const _0x1b343f = require("../shared/leadUserKey");
        _0x4b3a17 = String(_0x1b343f.getLeadUserKey(_0x1f7ef5) || _0x1f7ef5.leadId || _0x1f7ef5.key || "").trim();
      } catch (_0x3784d0) {
        _0x4b3a17 = String(_0x1f7ef5.leadId || _0x1f7ef5.key || "").trim();
      }
    } else {
      _0x4b3a17 = String(_0x58ccd4).trim();
    }
    if (!_0x4b3a17) {
      return null;
    }
    const _0x2f85e2 = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(_0x4b3a17, _0x4b3a17);
    if (_0x2f85e2?.id) {
      return String(_0x2f85e2.id);
    }
    if (_0x1f7ef5 && typeof _0x1f7ef5 === "object") {
      const _0xd1214e = String(_0x1f7ef5.nickname || "").trim();
      const _0x4e948e = String(_0x1f7ef5.content || _0x1f7ef5.comment || "").trim();
      let _0x1b9388 = "";
      try {
        const _0x1b8367 = require("../shared/leadUserKey");
        _0x1b9388 = String(_0x1b8367.getLeadUserKey(_0x1f7ef5) || "").trim();
      } catch (_0x405400) {
        _0x1b9388 = "";
      }
      if (_0xd1214e && _0x4e948e) {
        const _0x504132 = _0xd1214e + "_" + _0x4e948e;
        if (_0x504132 && _0x504132 !== _0x4b3a17) {
          const _0x33fbc3 = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(_0x504132, _0x504132);
          if (_0x33fbc3?.id) {
            return String(_0x33fbc3.id);
          }
        }
      }
      if (_0xd1214e && _0x1b9388) {
        const _0x2f078c = [_0xd1214e + "_", _0xd1214e];
        for (const _0x57c10a of _0x2f078c) {
          if (!_0x57c10a || _0x57c10a === _0x4b3a17 || _0x57c10a === _0x1b9388) {
            continue;
          }
          const _0x47d914 = db.prepare("SELECT id FROM leads WHERE id = ? OR lead_user_id = ? LIMIT 1").get(_0x57c10a, _0x57c10a);
          if (!_0x47d914?.id) {
            continue;
          }
          const _0x18cfa7 = getLeadById(_0x47d914.id);
          if (!_0x18cfa7) {
            continue;
          }
          let _0x198ae3 = "";
          try {
            const _0x52072e = require("../shared/leadUserKey");
            if (_0x52072e.isVideoLeadRecord?.(_0x18cfa7)) {
              continue;
            }
            _0x198ae3 = String(_0x52072e.getLeadUserKey(_0x18cfa7) || "").trim();
          } catch (_0x14ee68) {
            _0x198ae3 = "";
          }
          if (_0x198ae3 && _0x198ae3 !== _0x57c10a && _0x198ae3 !== _0xd1214e && _0x198ae3 !== _0xd1214e + "_") {
            continue;
          }
          const _0x3a402f = String(_0x18cfa7.content || _0x18cfa7.comment || "").trim();
          if (_0x3a402f && _0x4e948e && _0x3a402f !== _0x4e948e) {
            continue;
          }
          return String(_0x47d914.id);
        }
        try {
          const _0x5d11cf = db.prepare("\n                        SELECT id FROM leads\n                        WHERE nickname = ?\n                          AND (content IS NULL OR TRIM(content) = '')\n                        LIMIT 8\n                    ").all(_0xd1214e);
          for (const _0x3ea206 of _0x5d11cf) {
            if (!_0x3ea206?.id) {
              continue;
            }
            const _0x59e87c = getLeadById(_0x3ea206.id);
            if (!_0x59e87c) {
              continue;
            }
            let _0x283078 = "";
            try {
              const _0x54ec16 = require("../shared/leadUserKey");
              if (_0x54ec16.isVideoLeadRecord?.(_0x59e87c)) {
                continue;
              }
              _0x283078 = String(_0x54ec16.getLeadUserKey(_0x59e87c) || "").trim();
            } catch (_0x5d8e0f) {
              _0x283078 = "";
            }
            if (_0x283078 && _0x283078 !== String(_0x3ea206.id) && _0x283078 !== _0xd1214e && _0x283078 !== _0xd1214e + "_") {
              continue;
            }
            return String(_0x3ea206.id);
          }
        } catch (_0x23a7d1) {}
      }
    }
    return null;
  } catch (_0x513112) {
    return null;
  }
}
function upsertLead(_0x2604c5, {
  mergeFn: _0x3f2704,
  updateOnly = false
} = {}) {
  if (!db || !_0x2604c5 || typeof _0x2604c5 !== "object") {
    return null;
  }
  try {
    if (collectedLibraryWrite.isCollectedRouteLead(_0x2604c5)) {
      if (updateOnly) {
        const _0x16889e = collectedVideosStore.getById(db, _0x2604c5.leadId || _0x2604c5.key || _0x2604c5.videoUrl || "");
        const _0x52bda5 = collectedAuthorsStore.getById(db, _0x2604c5.authorProfileUrl || _0x2604c5.userUrl || _0x2604c5.leadId || "");
        if (!_0x16889e && !_0x52bda5) {
          return null;
        }
      }
      const _0x29c062 = collectedLibraryWrite.upsertCollectedFromLead(db, _0x2604c5);
      if (_0x29c062.written) {
        return _0x2604c5;
      } else {
        return null;
      }
    }
    ensureLeadSchemaColumns();
    let _0x44e524 = null;
    try {
      _0x44e524 = require("../shared/leadUserKey");
    } catch (_0x51e0e2) {
      _0x44e524 = null;
    }
    const _0x1f4706 = String(_0x44e524?.getPersonLeadSecUid?.(_0x2604c5) || "").trim();
    if (_0x1f4706) {
      _0x2604c5.secUid = _0x1f4706;
      _0x2604c5.leadId = _0x1f4706;
      _0x2604c5.key = _0x1f4706;
      _0x2604c5.userKey = _0x1f4706;
    } else {
      if (_0x44e524?.isTransientLeadIdentityKey?.(_0x2604c5.leadId) || _0x44e524?.isTransientLeadIdentityKey?.(_0x2604c5.key) || _0x44e524?.isTransientLeadIdentityKey?.(_0x2604c5.userKey)) {
        _0x2604c5.leadId = "";
        _0x2604c5.key = "";
        if (_0x44e524?.isTransientLeadIdentityKey?.(_0x2604c5.userKey)) {
          _0x2604c5.userKey = "";
        }
      }
      const _0x2e97c3 = String(_0x44e524?.buildLeadId?.(_0x2604c5) || "").trim();
      if (_0x2e97c3) {
        _0x2604c5.leadId = _0x2e97c3;
        _0x2604c5.key = _0x2e97c3;
      }
    }
    const _0x5e3c4e = extractLeadColumns(_0x2604c5);
    let _0x248d81 = null;
    if (_0x1f4706) {
      try {
        const _0x166e46 = db.prepare("SELECT id FROM leads WHERE sec_uid = ? OR id = ? OR lead_user_id = ? LIMIT 1").get(_0x1f4706, _0x1f4706, _0x1f4706);
        if (_0x166e46?.id) {
          _0x248d81 = String(_0x166e46.id);
        }
      } catch (_0x300944) {}
    }
    if (!_0x248d81) {
      _0x248d81 = findLeadRowId(_0x2604c5) || findLeadRowId(_0x5e3c4e.id) || (_0x5e3c4e.lead_user_id ? findLeadRowId(_0x5e3c4e.lead_user_id) : null);
    }
    const _0x396d4f = _0x248d81 ? getLeadById(_0x248d81) : null;
    if (updateOnly && !_0x396d4f) {
      return null;
    }
    let _0xcaae76 = _0x2604c5;
    if (_0x396d4f && typeof _0x3f2704 === "function") {
      _0x3f2704(_0x396d4f, _0x2604c5);
      _0xcaae76 = _0x396d4f;
      if (_0x1f4706) {
        _0xcaae76.secUid = _0x1f4706;
        _0xcaae76.leadId = _0x1f4706;
        _0xcaae76.key = _0x1f4706;
        _0xcaae76.userKey = _0x1f4706;
      }
    } else if (_0x396d4f) {
      _0xcaae76 = {
        ..._0x396d4f,
        ..._0x2604c5
      };
      if (_0x1f4706) {
        _0xcaae76.secUid = _0x1f4706;
        _0xcaae76.leadId = _0x1f4706;
        _0xcaae76.key = _0x1f4706;
        _0xcaae76.userKey = _0x1f4706;
      }
    }
    if (_0x396d4f?.leadId && !_0xcaae76.leadId) {
      _0xcaae76.leadId = _0x396d4f.leadId;
    }
    const _0x1a98f7 = extractLeadColumns(_0xcaae76);
    if (_0x248d81 && _0x248d81 !== _0x1a98f7.id) {
      try {
        db.prepare("DELETE FROM leads WHERE id = ?").run(_0x248d81);
      } catch (_0x12882f) {}
    }
    db.prepare("\n            INSERT INTO leads (\n                id, lead_user_id, nickname, video_id, video_title, account_id, content, captured_at, raw_data,\n                is_high_intention, lead_kind, entry_source, search_keyword, account_name, location, sec_uid\n            )\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                lead_user_id = excluded.lead_user_id,\n                nickname = excluded.nickname,\n                video_id = excluded.video_id,\n                video_title = excluded.video_title,\n                account_id = excluded.account_id,\n                content = excluded.content,\n                captured_at = excluded.captured_at,\n                raw_data = excluded.raw_data,\n                is_high_intention = excluded.is_high_intention,\n                lead_kind = excluded.lead_kind,\n                entry_source = excluded.entry_source,\n                search_keyword = excluded.search_keyword,\n                account_name = excluded.account_name,\n                location = excluded.location,\n                sec_uid = excluded.sec_uid\n        ").run(_0x1a98f7.id, _0x1a98f7.lead_user_id, _0x1a98f7.nickname, _0x1a98f7.video_id, _0x1a98f7.video_title, _0x1a98f7.account_id, _0x1a98f7.content, _0x1a98f7.captured_at, _0x1a98f7.raw_data, _0x1a98f7.is_high_intention, _0x1a98f7.lead_kind, _0x1a98f7.entry_source, _0x1a98f7.search_keyword, _0x1a98f7.account_name, _0x1a98f7.location, _0x1a98f7.sec_uid);
    return _0xcaae76;
  } catch (_0x17a052) {
    console.error("[DB] upsertLead 失败:", _0x17a052);
    return null;
  }
}
function upsertLeadsBatch(_0x23b227, {
  mergeFn: _0x505462,
  updateOnly = false
} = {}) {
  if (!db || !Array.isArray(_0x23b227)) {
    return 0;
  }
  let _0x26ae67 = 0;
  const _0x3676fa = db.transaction(_0x16dedb => {
    for (const _0xfe8486 of _0x16dedb) {
      if (upsertLead(_0xfe8486, {
        mergeFn: _0x505462,
        updateOnly: updateOnly
      })) {
        _0x26ae67 += 1;
      }
    }
  });
  try {
    _0x3676fa(_0x23b227);
    return _0x26ae67;
  } catch (_0x328915) {
    console.error("[DB] upsertLeadsBatch 失败:", _0x328915);
    return _0x26ae67;
  }
}
function setLeadLastBatchFollowResult(_0x3dd600, _0x59e2c1 = {}) {
  if (!db || _0x3dd600 == null) {
    return false;
  }
  const _0x180280 = String(_0x59e2c1?.status || "").trim();
  if (_0x180280 !== "success" && _0x180280 !== "failed") {
    return false;
  }
  try {
    ensureLeadSchemaColumns();
    const _0x133c44 = findLeadRowId(_0x3dd600);
    if (!_0x133c44) {
      return false;
    }
    const _0x12c53b = {
      status: _0x180280,
      message: String(_0x59e2c1?.message || "").trim().slice(0, 1000),
      at: Number(_0x59e2c1?.at) > 0 ? Number(_0x59e2c1.at) : Date.now(),
      type: String(_0x59e2c1?.type || "").trim().slice(0, 80),
      runId: Number.isFinite(Number(_0x59e2c1?.runId)) ? Number(_0x59e2c1.runId) : null
    };
    const _0x1ced65 = db.prepare("\n            UPDATE leads\n            SET last_batch_follow_result = ?\n            WHERE id = ?\n        ").run(JSON.stringify(_0x12c53b), String(_0x133c44));
    return (_0x1ced65.changes || 0) > 0;
  } catch (_0x11b66f) {
    console.error("[DB] setLeadLastBatchFollowResult 失败:", _0x11b66f);
    return false;
  }
}
function deleteFailedBatchFollowLeads() {
  if (!db) {
    return 0;
  }
  try {
    ensureLeadSchemaColumns();
    const _0x1470e2 = db.prepare("\n            DELETE FROM leads\n            WHERE last_batch_follow_result = 'failed'\n               OR last_batch_follow_result LIKE '{\"status\":\"failed\"%'\n        ").run();
    return _0x1470e2.changes || 0;
  } catch (_0x10bcba) {
    console.error("[DB] deleteFailedBatchFollowLeads 失败:", _0x10bcba);
    return 0;
  }
}
function deleteLeadsByIds(_0x8d5624) {
  if (!db || !Array.isArray(_0x8d5624) || !_0x8d5624.length) {
    return 0;
  }
  try {
    const _0x4dd771 = db.prepare("DELETE FROM leads WHERE id = ?");
    const _0x5d0b7c = db.prepare("DELETE FROM leads WHERE lead_user_id = ?");
    let _0x120d0d = 0;
    const _0xe342aa = db.transaction(_0x5c532a => {
      for (const _0x36b8f1 of _0x5c532a) {
        if (!_0x36b8f1) {
          continue;
        }
        const _0x3c4259 = String(_0x36b8f1);
        _0x120d0d += _0x4dd771.run(_0x3c4259).changes || 0;
        _0x120d0d += _0x5d0b7c.run(_0x3c4259).changes || 0;
      }
    });
    _0xe342aa(_0x8d5624);
    return _0x120d0d;
  } catch (_0xacd66a) {
    console.error("[DB] deleteLeadsByIds 失败:", _0xacd66a);
    return 0;
  }
}
function clearAllLeads() {
  if (!db) {
    return 0;
  }
  try {
    const _0x5eca99 = db.prepare("DELETE FROM leads").run();
    return _0x5eca99.changes || 0;
  } catch (_0x2be895) {
    console.error("[DB] clearAllLeads 失败:", _0x2be895);
    return 0;
  }
}
function deleteLowIntentionLeads() {
  if (!db) {
    return 0;
  }
  try {
    const _0x4f5cda = db.prepare("\n            DELETE FROM leads\n            WHERE (is_high_intention IS NULL OR is_high_intention = 0)\n              AND (lead_kind IS NULL OR lead_kind != 'video_card')\n        ").run();
    return _0x4f5cda.changes || 0;
  } catch (_0x92a978) {
    console.error("[DB] deleteLowIntentionLeads 失败:", _0x92a978);
    return 0;
  }
}
function listLeadUserKeys() {
  if (!db) {
    return [];
  }
  try {
    const _0xc84c = db.prepare("\n            SELECT id, lead_user_id FROM leads\n        ").all();
    const _0x9e08ff = [];
    const _0x4b7bb5 = new Set();
    for (const _0x5c0dff of _0xc84c) {
      for (const _0x27673a of [_0x5c0dff.id, _0x5c0dff.lead_user_id]) {
        const _0x53b36c = String(_0x27673a || "").trim();
        if (!_0x53b36c || _0x4b7bb5.has(_0x53b36c)) {
          continue;
        }
        _0x4b7bb5.add(_0x53b36c);
        _0x9e08ff.push(_0x53b36c);
      }
    }
    return _0x9e08ff;
  } catch (_0x11497f) {
    console.error("[DB] listLeadUserKeys 失败:", _0x11497f);
    return [];
  }
}
function findExistingLeadUserKeys(_0x5387fc, _0x641e7c = 400) {
  if (!db) {
    return [];
  }
  const _0x4879bb = [...new Set((Array.isArray(_0x5387fc) ? _0x5387fc : []).map(_0x14b389 => String(_0x14b389 || "").trim()).filter(Boolean))];
  if (!_0x4879bb.length) {
    return [];
  }
  const _0x6b3208 = Math.max(1, Math.min(400, Number(_0x641e7c) || 400));
  const _0x494e41 = new Set(_0x4879bb);
  const _0x1f79e2 = new Set();
  try {
    for (let _0x1ff03d = 0; _0x1ff03d < _0x4879bb.length; _0x1ff03d += _0x6b3208) {
      const _0x2a121c = _0x4879bb.slice(_0x1ff03d, _0x1ff03d + _0x6b3208);
      const _0x1a2361 = _0x2a121c.map(() => "?").join(", ");
      const _0x1bd785 = db.prepare("\n                SELECT id, lead_user_id FROM leads\n                WHERE id IN (" + _0x1a2361 + ") OR lead_user_id IN (" + _0x1a2361 + ")\n            ").all(..._0x2a121c, ..._0x2a121c);
      for (const _0xc1df5c of _0x1bd785) {
        for (const _0x1b4384 of [_0xc1df5c.id, _0xc1df5c.lead_user_id]) {
          const _0x487b50 = String(_0x1b4384 || "").trim();
          if (_0x487b50 && _0x494e41.has(_0x487b50)) {
            _0x1f79e2.add(_0x487b50);
          }
        }
      }
    }
    return [..._0x1f79e2];
  } catch (_0x4b5409) {
    console.error("[DB] findExistingLeadUserKeys 失败:", _0x4b5409);
    throw _0x4b5409;
  }
}
function buildLeadsWhere(_0x526c6b = {}) {
  const _0x30b649 = [];
  const _0x62954a = [];
  const _0xa9f5d = _0x526c6b || {};
  if (_0xa9f5d.excludeVideoCards !== false && !_0xa9f5d.includeVideoCards) {
    _0x30b649.push("(lead_kind IS NULL OR lead_kind != 'video_card')");
  }
  if (_0xa9f5d.leadKind) {
    _0x30b649.push("lead_kind = ?");
    _0x62954a.push(String(_0xa9f5d.leadKind));
  }
  if (_0xa9f5d.keyword) {
    const _0x436448 = "%" + String(_0xa9f5d.keyword).trim() + "%";
    _0x30b649.push("(nickname LIKE ? OR content LIKE ? OR search_keyword LIKE ? OR video_title LIKE ? OR location LIKE ?)");
    _0x62954a.push(_0x436448, _0x436448, _0x436448, _0x436448, _0x436448);
  }
  if (_0xa9f5d.searchKeyword) {
    _0x30b649.push("(search_keyword LIKE ? OR entry_source LIKE ?)");
    const _0x5256fa = "%" + String(_0xa9f5d.searchKeyword).trim() + "%";
    _0x62954a.push(_0x5256fa, _0x5256fa);
  }
  if (_0xa9f5d.intention === "high") {
    _0x30b649.push("is_high_intention = 1");
  } else if (_0xa9f5d.intention === "low") {
    _0x30b649.push("(is_high_intention IS NULL OR is_high_intention = 0)");
  }
  const _0x5dcb3a = String(_0xa9f5d.batchFollowStatus || "").trim();
  if (_0x5dcb3a === "success" || _0x5dcb3a === "failed") {
    _0x30b649.push("(last_batch_follow_result = ? OR last_batch_follow_result LIKE ?)");
    _0x62954a.push(_0x5dcb3a, "{\"status\":\"" + _0x5dcb3a + "\"%");
  }
  if (Array.isArray(_0xa9f5d.account) && _0xa9f5d.account.length) {
    const _0x50d418 = [];
    const _0xd19765 = [];
    for (const _0x28eb1c of _0xa9f5d.account) {
      const _0x1806ab = String(_0x28eb1c || "").trim();
      if (!_0x1806ab) {
        continue;
      }
      if (_0x1806ab.startsWith("name:")) {
        _0xd19765.push(_0x1806ab.slice(5));
      } else {
        _0x50d418.push(_0x1806ab);
      }
    }
    if (_0x50d418.length) {
      try {
        const _0x43d698 = getAccountPool();
        for (const _0x17abd2 of _0x50d418) {
          const _0x38deff = _0x43d698.find(_0x305eae => String(_0x305eae?.id || "") === _0x17abd2);
          if (_0x38deff) {
            for (const _0x341673 of collectAccountNameAliases(_0x38deff)) {
              _0xd19765.push(_0x341673);
            }
          }
        }
      } catch (_0x103cd3) {}
    }
    const _0x1e0f46 = [...new Set(_0xd19765.map(String).map(_0x27eea0 => _0x27eea0.trim()).filter(Boolean))];
    const _0x17038e = [];
    if (_0x50d418.length) {
      _0x17038e.push("account_id IN (" + _0x50d418.map(() => "?").join(",") + ")");
      _0x62954a.push(..._0x50d418);
    }
    if (_0x1e0f46.length) {
      _0x17038e.push("((account_id IS NULL OR TRIM(account_id) = '') AND account_name IN (" + _0x1e0f46.map(() => "?").join(",") + "))");
      _0x62954a.push(..._0x1e0f46);
    }
    if (_0x17038e.length) {
      _0x30b649.push("(" + _0x17038e.join(" OR ") + ")");
    }
  }
  if (Array.isArray(_0xa9f5d.locations) && _0xa9f5d.locations.length) {
    _0x30b649.push("location IN (" + _0xa9f5d.locations.map(() => "?").join(",") + ")");
    _0x62954a.push(..._0xa9f5d.locations.map(String));
  }
  return {
    sql: _0x30b649.length ? "WHERE " + _0x30b649.join(" AND ") : "",
    params: _0x62954a
  };
}
function needsLeadPostFilter(_0x422860 = {}) {
  const _0x1461af = _0x422860 || {};
  if (_0x1461af.minTouchTotal != null && _0x1461af.minTouchTotal !== "") {
    return true;
  }
  if (Array.isArray(_0x1461af.touchTypes) && _0x1461af.touchTypes.length) {
    return true;
  }
  if (Array.isArray(_0x1461af.entrySource) && _0x1461af.entrySource.length) {
    return true;
  }
  if (_0x1461af.timeRange && _0x1461af.timeRange !== "all") {
    return true;
  }
  if (_0x1461af.captureTimeRange && (Array.isArray(_0x1461af.captureTimeRange) ? _0x1461af.captureTimeRange.length : _0x1461af.captureTimeRange)) {
    return true;
  }
  if (Array.isArray(_0x1461af.accountFlags) && _0x1461af.accountFlags.length) {
    return true;
  }
  if (typeof _0x1461af.postFilter === "function") {
    return true;
  }
  return false;
}
function getLeadsCount(_0x11fae7 = {}) {
  if (!db) {
    return 0;
  }
  try {
    if (needsLeadPostFilter(_0x11fae7)) {
      console.warn("[DB] getLeadsCount 遇到复杂筛选，返回 0；请使用 queryLeadsPage(_countOnly)");
      return 0;
    }
    const {
      sql: _0x3eade3,
      params: _0x28aa89
    } = buildLeadsWhere(_0x11fae7);
    const _0x33219f = db.prepare("SELECT COUNT(*) as cnt FROM leads " + _0x3eade3).get(..._0x28aa89);
    if (_0x33219f) {
      return Number(_0x33219f.cnt) || 0;
    } else {
      return 0;
    }
  } catch (_0x59441d) {
    console.error("[DB] getLeadsCount 失败:", _0x59441d);
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
  return new Promise(_0x409562 => setImmediate(_0x409562));
}
const LEADS_POOL_STATS_YIELD_EVERY = 250;
async function aggregateLeadsPoolStats(_0x30caab = {}) {
  const _0x31f722 = {
    stats: createEmptyLeadPoolStats(),
    accountStats: []
  };
  if (!db) {
    return _0x31f722;
  }
  try {
    ensureLeadSchemaColumns();
    const {
      sql: _0x13a6e0,
      params: _0x4d30fa
    } = buildLeadsWhere(_0x30caab);
    const _0x297c9d = require("../shared/leadPoolFilters");
    const _0x66c95 = require("../shared/leadTouch");
    const _0x378dbb = needsLeadPostFilter(_0x30caab);
    const _0x47f071 = createEmptyLeadPoolStats();
    const _0x38edec = Object.create(null);
    const _0x513077 = db.prepare("SELECT account_id AS accountId, account_name AS accountName, lead_kind AS leadKind, raw_data FROM leads " + _0x13a6e0);
    let _0x473cf5 = 0;
    for (const _0x7c4c44 of _0x513077.iterate(..._0x4d30fa)) {
      let _0x1d747b = null;
      try {
        _0x1d747b = JSON.parse(_0x7c4c44.raw_data || "{}");
      } catch (_0x4616ae) {
        _0x1d747b = null;
      }
      if (!_0x1d747b) {
        continue;
      }
      if (!_0x1d747b.accountId && _0x7c4c44.accountId) {
        _0x1d747b.accountId = _0x7c4c44.accountId;
      }
      if (!_0x1d747b.accountName && _0x7c4c44.accountName) {
        _0x1d747b.accountName = _0x7c4c44.accountName;
      }
      if (!_0x1d747b.leadKind && _0x7c4c44.leadKind) {
        _0x1d747b.leadKind = _0x7c4c44.leadKind;
      }
      if (_0x378dbb && !_0x297c9d.leadMatchesComplexFilters(_0x1d747b, _0x30caab)) {
        continue;
      }
      if (String(_0x1d747b.leadKind || "") === "video_card") {
        continue;
      }
      const _0x51873d = _0x66c95.migrateTouchCountsFromLegacy(_0x1d747b);
      const _0x466bfd = _0x51873d.like > 0 || !!_0x1d747b.liked || !!_0x1d747b.actions?.liked;
      const _0x210d0d = _0x51873d.reply > 0 || !!_0x1d747b.replied || !!_0x1d747b.actions?.replied;
      const _0x2b3707 = _0x51873d.message > 0 || !!_0x1d747b.messaged || !!_0x1d747b.actions?.messaged;
      const _0x2629c5 = _0x51873d.follow > 0 || !!_0x1d747b.followed || !!_0x1d747b.actions?.followed;
      const _0x3f1b1f = _0x51873d.profileComment > 0 || !!_0x1d747b.actions?.profileWorkCommented;
      const _0x52c2a0 = _0x66c95.getTotalTouchCount(_0x51873d) > 0 || _0x466bfd || _0x210d0d || _0x2629c5 || _0x2b3707 || _0x3f1b1f;
      _0x47f071.total += 1;
      if (_0x466bfd) {
        _0x47f071.likes += 1;
      }
      if (_0x210d0d) {
        _0x47f071.replies += 1;
      }
      if (_0x2b3707) {
        _0x47f071.messages += 1;
      }
      if (_0x2629c5) {
        _0x47f071.follows += 1;
      }
      if (_0x3f1b1f) {
        _0x47f071.profileComments += 1;
      }
      if (_0x52c2a0) {
        _0x47f071.touched += 1;
      } else {
        _0x47f071.untouched += 1;
      }
      const _0x16c9cf = String(_0x1d747b.accountId || _0x7c4c44.accountId || "").trim();
      const _0x46fb85 = String(_0x1d747b.accountName || _0x7c4c44.accountName || "").trim() || "未知账号";
      const _0xccb595 = _0x16c9cf || "name:" + _0x46fb85;
      let _0x112ac3 = _0x38edec[_0xccb595];
      if (!_0x112ac3) {
        _0x112ac3 = {
          accountId: _0x16c9cf,
          name: _0x46fb85,
          total: 0,
          likes: 0,
          replies: 0,
          messages: 0,
          follows: 0
        };
        _0x38edec[_0xccb595] = _0x112ac3;
      } else if (_0x46fb85 && _0x46fb85 !== "未知账号" && (!_0x112ac3.name || _0x112ac3.name === "未知账号")) {
        _0x112ac3.name = _0x46fb85;
      }
      _0x112ac3.total += 1;
      if (_0x466bfd) {
        _0x112ac3.likes += 1;
      }
      if (_0x210d0d) {
        _0x112ac3.replies += 1;
      }
      if (_0x2b3707) {
        _0x112ac3.messages += 1;
      }
      if (_0x2629c5) {
        _0x112ac3.follows += 1;
      }
      _0x473cf5 += 1;
      if (_0x473cf5 % LEADS_POOL_STATS_YIELD_EVERY === 0) {
        await yieldMainThread();
      }
    }
    return {
      stats: _0x47f071,
      accountStats: Object.values(_0x38edec).sort((_0x201039, _0x13ee89) => _0x13ee89.total - _0x201039.total || String(_0x201039.name).localeCompare(String(_0x13ee89.name), "zh-CN"))
    };
  } catch (_0x4696cf) {
    console.error("[DB] aggregateLeadsPoolStats 失败:", _0x4696cf);
    return _0x31f722;
  }
}
const LEADS_PAGE_YIELD_EVERY = 250;
async function queryLeadsPage(_0x1622bd = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  try {
    ensureLeadSchemaColumns();
    const _0x3b082d = Math.max(0, Number(_0x1622bd.offset) || 0);
    const _0x4cad3d = _0x1622bd.forExport || _0x1622bd.forBatch ? 100000 : 500;
    const _0x33b740 = Math.max(1, Math.min(_0x4cad3d, Number(_0x1622bd.limit) || 50));
    const _0x49de8e = _0x1622bd.filters || {};
    const _0x5eab43 = _0x1622bd.orderBy === "captured_at_asc" ? "captured_at ASC" : "captured_at DESC";
    const {
      sql: _0x34de6a,
      params: _0x8425e0
    } = buildLeadsWhere(_0x49de8e);
    const _0x325004 = require("../shared/leadPoolFilters");
    if (!needsLeadPostFilter(_0x49de8e)) {
      const _0x4f74f6 = db.prepare("SELECT COUNT(*) as cnt FROM leads " + _0x34de6a).get(..._0x8425e0);
      const _0x11c8cc = _0x4f74f6 ? Number(_0x4f74f6.cnt) || 0 : 0;
      if (_0x1622bd._countOnly) {
        return {
          items: [],
          total: _0x11c8cc
        };
      }
      const _0x54b519 = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads " + _0x34de6a + " ORDER BY " + _0x5eab43 + " LIMIT ? OFFSET ?").all(..._0x8425e0, _0x33b740, _0x3b082d);
      const _0x4c1ed9 = _0x54b519.map(parseLeadRow).filter(Boolean);
      return {
        items: _0x4c1ed9,
        total: _0x11c8cc
      };
    }
    const _0x1bf76d = db.prepare("SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads " + _0x34de6a + " ORDER BY " + _0x5eab43);
    const _0xed520f = [];
    let _0x4eabc4 = 0;
    let _0x33b355 = 0;
    const _0x313ad7 = !!_0x1622bd._countOnly;
    const _0x165ebf = _0x3b082d + _0x33b740;
    for (const _0x3bc895 of _0x1bf76d.iterate(..._0x8425e0)) {
      const _0x543c82 = parseLeadRow(_0x3bc895);
      _0x33b355 += 1;
      if (!_0x543c82) {
        if (_0x33b355 % LEADS_PAGE_YIELD_EVERY === 0) {
          await yieldMainThread();
        }
        continue;
      }
      if (!_0x325004.leadMatchesComplexFilters(_0x543c82, _0x49de8e)) {
        if (_0x33b355 % LEADS_PAGE_YIELD_EVERY === 0) {
          await yieldMainThread();
        }
        continue;
      }
      if (typeof _0x49de8e.postFilter === "function") {
        try {
          if (!_0x49de8e.postFilter(_0x543c82)) {
            if (_0x33b355 % LEADS_PAGE_YIELD_EVERY === 0) {
              await yieldMainThread();
            }
            continue;
          }
        } catch (_0x33d952) {
          if (_0x33b355 % LEADS_PAGE_YIELD_EVERY === 0) {
            await yieldMainThread();
          }
          continue;
        }
      }
      if (!_0x313ad7 && _0x4eabc4 >= _0x3b082d && _0x4eabc4 < _0x165ebf) {
        _0xed520f.push(_0x543c82);
      }
      _0x4eabc4 += 1;
      if (_0x33b355 % LEADS_PAGE_YIELD_EVERY === 0) {
        await yieldMainThread();
      }
    }
    if (_0x313ad7) {
      return {
        items: [],
        total: _0x4eabc4
      };
    }
    return {
      items: _0xed520f,
      total: _0x4eabc4
    };
  } catch (_0x4c84a0) {
    console.error("[DB] queryLeadsPage 失败:", _0x4c84a0);
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
    const _0x51e191 = db.prepare("\n            SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n            WHERE lead_kind = 'video_card'\n               OR lead_kind = 'video'\n               OR id LIKE 'video:%'\n               OR lead_user_id LIKE 'video:%'\n            ORDER BY captured_at DESC\n        ").all();
    const _0x142867 = [];
    const _0x28a903 = new Set();
    for (const _0x3051cc of _0x51e191) {
      const _0x3c3070 = parseLeadRow(_0x3051cc);
      if (!_0x3c3070 || !isVideoCardLeadLike(_0x3c3070)) {
        continue;
      }
      const _0x3323b3 = normalizeVideoCardLeadForPool(_0x3c3070) || _0x3c3070;
      const _0xe2159c = String(_0x3323b3.leadId || _0x3323b3.key || _0x3051cc.id || "");
      if (!_0xe2159c || _0x28a903.has(_0xe2159c)) {
        continue;
      }
      _0x28a903.add(_0xe2159c);
      _0x142867.push(_0x3323b3);
    }
    return _0x142867;
  } catch (_0x35df1f) {
    console.error("[DB] listVideoCardLeads 失败:", _0x35df1f);
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
function queryCollectedVideosPage(_0x52780c = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  return collectedVideosStore.queryPage(db, _0x52780c);
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
    const _0x8c669 = db.prepare("SELECT id, sec_uid FROM collected_authors").all();
    const _0x2718fa = [];
    const _0x37fe46 = new Set();
    for (const _0x337475 of _0x8c669) {
      const _0x36e443 = String(_0x337475.id || "").trim();
      const _0x5d0319 = String(_0x337475.sec_uid || "").trim();
      for (const _0x45da6b of [_0x36e443, _0x5d0319, _0x5d0319 ? "author:" + _0x5d0319 : ""]) {
        if (!_0x45da6b || _0x37fe46.has(_0x45da6b)) {
          continue;
        }
        _0x37fe46.add(_0x45da6b);
        _0x2718fa.push(_0x45da6b);
      }
    }
    return _0x2718fa;
  } catch (_0x3b99f9) {
    console.error("[DB] listCollectedAuthorDedupKeys 失败:", _0x3b99f9);
    return [];
  }
}
function listCollectedAuthors() {
  if (!db) {
    return [];
  }
  return collectedAuthorsStore.listAll(db);
}
function queryCollectedAuthorsPage(_0x19a961 = {}) {
  if (!db) {
    return {
      items: [],
      total: 0
    };
  }
  return collectedAuthorsStore.queryPage(db, _0x19a961);
}
function deleteCollectedVideosByKeys(_0x148c90 = []) {
  if (!db) {
    return 0;
  }
  return collectedVideosStore.deleteByKeys(db, _0x148c90);
}
function deleteCollectedAuthorsByKeys(_0xcd371c = []) {
  if (!db) {
    return 0;
  }
  return collectedAuthorsStore.deleteByKeys(db, _0xcd371c);
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
    const _0x10fb9c = db.prepare("\n            SELECT id FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n               OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n               OR raw_data LIKE '%\"identityType\":\"video\"%'\n        ").all();
    if (!_0x10fb9c.length) {
      return 0;
    }
    const _0x12ff7a = db.prepare("DELETE FROM entity_leadgen_leads WHERE id = ?");
    let _0x5651e1 = 0;
    const _0x58619b = db.transaction(_0x3dadeb => {
      for (const _0x1efa84 of _0x3dadeb) {
        _0x5651e1 += _0x12ff7a.run(String(_0x1efa84.id)).changes || 0;
      }
    });
    _0x58619b(_0x10fb9c);
    return _0x5651e1;
  } catch (_0x2391c4) {
    console.error("[DB] clearAllEntityLeadgenVideoCards 失败:", _0x2391c4);
    return 0;
  }
}
function stripAuthorTargetFromEntityLeadgenVideoCards() {
  if (!db) {
    return 0;
  }
  try {
    const _0x280220 = db.prepare("\n            SELECT id, raw_data FROM entity_leadgen_leads\n            WHERE raw_data LIKE '%\"author\"%'\n              AND (\n                source_type = 'video'\n                OR source_type = 'video_card'\n                OR id LIKE 'video:%'\n                OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n                OR raw_data LIKE '%\"identityType\":\"video\"%'\n              )\n        ").all();
    if (!_0x280220.length) {
      return 0;
    }
    const _0x392311 = db.prepare("UPDATE entity_leadgen_leads SET raw_data = ? WHERE id = ?");
    let _0xa20fe2 = 0;
    const _0xe206c8 = db.transaction(_0x135182 => {
      for (const _0x282a4b of _0x135182) {
        let _0x4a8270 = null;
        try {
          _0x4a8270 = JSON.parse(_0x282a4b.raw_data || "{}");
        } catch (_0x5bb668) {
          _0x4a8270 = null;
        }
        if (!_0x4a8270 || typeof _0x4a8270 !== "object") {
          continue;
        }
        const _0x48c336 = Array.isArray(_0x4a8270.collectedFields) ? _0x4a8270.collectedFields.map(String).filter(_0xd20321 => _0xd20321 && _0xd20321 !== "author") : [];
        const _0x4d8b95 = Array.isArray(_0x4a8270.collectedFields) && _0x4a8270.collectedFields.map(String).includes("author");
        if (!_0x4d8b95) {
          continue;
        }
        _0x4a8270.collectedFields = _0x48c336.length ? _0x48c336 : ["video"];
        _0x392311.run(JSON.stringify(_0x4a8270), String(_0x282a4b.id));
        _0xa20fe2 += 1;
      }
    });
    _0xe206c8(_0x280220);
    return _0xa20fe2;
  } catch (_0x225a95) {
    console.error("[DB] stripAuthorTargetFromEntityLeadgenVideoCards 失败:", _0x225a95);
    return 0;
  }
}
function listEntityLeadgenVideoCardLeads() {
  if (!db) {
    return [];
  }
  try {
    const _0x1d93de = db.prepare("\n            SELECT id, task_id, ts, source_type, raw_data\n            FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n            ORDER BY ts DESC\n        ").all();
    const _0x2e7810 = db.prepare("\n            SELECT id, task_id, ts, source_type, raw_data\n            FROM entity_leadgen_leads\n            WHERE (source_type IS NULL OR source_type = '')\n              AND (\n                raw_data LIKE '%\"leadKind\":\"video_card\"%'\n                OR raw_data LIKE '%\"sourceType\":\"video\"%'\n                OR raw_data LIKE '%\"identityType\":\"video\"%'\n              )\n            ORDER BY ts DESC\n            LIMIT 5000\n        ").all();
    const _0x168a22 = [];
    const _0x44fc38 = new Set();
    for (const _0x59a446 of [..._0x1d93de, ..._0x2e7810]) {
      let _0x3f8300 = null;
      try {
        _0x3f8300 = JSON.parse(_0x59a446.raw_data || "{}");
      } catch (_0x1c8861) {
        _0x3f8300 = null;
      }
      if (!_0x3f8300) {
        continue;
      }
      if (!isVideoCardLeadLike(_0x3f8300) && _0x59a446.source_type !== "video") {
        continue;
      }
      const _0x555b45 = normalizeVideoCardLeadForPool({
        ..._0x3f8300,
        id: _0x3f8300.id || _0x59a446.id,
        ts: _0x3f8300.ts || _0x59a446.ts,
        sourceType: _0x3f8300.sourceType || _0x59a446.source_type || "video",
        taskId: _0x3f8300.taskId || _0x59a446.task_id
      });
      if (!_0x555b45) {
        continue;
      }
      const _0x44c38b = String(_0x555b45.leadId || "");
      if (!_0x44c38b || _0x44fc38.has(_0x44c38b)) {
        continue;
      }
      _0x44fc38.add(_0x44c38b);
      _0x168a22.push(_0x555b45);
    }
    return _0x168a22;
  } catch (_0x888b36) {
    console.error("[DB] listEntityLeadgenVideoCardLeads 失败:", _0x888b36);
    return [];
  }
}
function listLeadsByAutomationTaskIds(_0x21f3f5 = [], _0x45aa18 = {}) {
  if (!db) {
    return [];
  }
  const _0xc50663 = [...new Set((Array.isArray(_0x21f3f5) ? _0x21f3f5 : [_0x21f3f5]).map(_0x1ce048 => String(_0x1ce048 || "").trim()).filter(Boolean))];
  if (!_0xc50663.length) {
    return [];
  }
  const _0x310d6b = Math.max(1, Math.min(50000, Number(_0x45aa18.limit) || 20000));
  const _0x4c42db = _0x45aa18.includeVideoCards === true;
  try {
    ensureLeadSchemaColumns();
    let _0x1477be = [];
    try {
      const _0x548500 = _0xc50663.map(() => "?").join(",");
      _0x1477be = db.prepare("\n                SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n                WHERE json_extract(raw_data, '$.taskId') IN (" + _0x548500 + ")\n                   OR json_extract(raw_data, '$.automationTaskId') IN (" + _0x548500 + ")\n                ORDER BY captured_at DESC\n                LIMIT ?\n            ").all(..._0xc50663, ..._0xc50663, _0x310d6b);
    } catch (_0x32883d) {
      const _0x365d3a = [];
      const _0x5c0d44 = [];
      for (const _0x335ff1 of _0xc50663) {
        _0x365d3a.push("raw_data LIKE ?");
        _0x5c0d44.push("%\"taskId\":\"" + _0x335ff1 + "\"%");
        _0x365d3a.push("raw_data LIKE ?");
        _0x5c0d44.push("%\"automationTaskId\":\"" + _0x335ff1 + "\"%");
      }
      _0x1477be = db.prepare("\n                SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n                WHERE (" + _0x365d3a.join(" OR ") + ")\n                ORDER BY captured_at DESC\n                LIMIT ?\n            ").all(..._0x5c0d44, Math.min(_0x310d6b * 3, 60000));
    }
    const _0x274bfc = new Set(_0xc50663);
    const _0x581872 = [];
    const _0x172f1e = new Set();
    for (const _0x295dab of _0x1477be) {
      const _0x235862 = parseLeadRow(_0x295dab);
      if (!_0x235862) {
        continue;
      }
      if (!_0x4c42db && String(_0x235862.leadKind || "") === "video_card") {
        continue;
      }
      const _0x2c97ad = String(_0x235862.taskId || _0x235862.automationTaskId || "").trim();
      if (!_0x274bfc.has(_0x2c97ad)) {
        continue;
      }
      const _0x543072 = String(_0x235862.leadId || _0x235862.key || _0x235862.id || _0x295dab.id || "");
      if (!_0x543072 || _0x172f1e.has(_0x543072)) {
        continue;
      }
      _0x172f1e.add(_0x543072);
      _0x581872.push(_0x235862);
      if (_0x581872.length >= _0x310d6b) {
        break;
      }
    }
    return _0x581872;
  } catch (_0x257719) {
    console.error("[DB] listLeadsByAutomationTaskIds 失败:", _0x257719);
    return [];
  }
}
const LEAD_TOUCHED_SQL = "(\n  IFNULL(json_extract(raw_data, '$.touchCounts.like'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.reply'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.follow'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.message'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.profileComment'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.touchCounts.videoComment'), 0) > 0\n  OR IFNULL(json_extract(raw_data, '$.liked'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.replied'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.followed'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.messaged'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.liked'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.replied'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.followed'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.messaged'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.actions.profileWorkCommented'), 0) IN (1, 'true')\n  OR IFNULL(json_extract(raw_data, '$.videoCommented'), 0) IN (1, 'true')\n)";
function deleteTouchedLeads() {
  if (!db) {
    return 0;
  }
  try {
    const _0x468efe = db.prepare("\n            DELETE FROM leads\n            WHERE (lead_kind IS NULL OR lead_kind != 'video_card')\n              AND " + LEAD_TOUCHED_SQL + "\n        ").run();
    return _0x468efe.changes || 0;
  } catch (_0xae8218) {
    console.error("[DB] deleteTouchedLeads 失败:", _0xae8218);
    return 0;
  }
}
function queryLeadsByAutomationTaskIdsPage(_0x4cb703 = [], _0x24c4aa = {}) {
  const _0x4c807e = {
    items: [],
    total: 0,
    counts: {
      all: 0,
      touched: 0,
      untouched: 0
    }
  };
  if (!db) {
    return _0x4c807e;
  }
  const _0x1ff7f0 = [...new Set((Array.isArray(_0x4cb703) ? _0x4cb703 : [_0x4cb703]).map(_0x190a95 => String(_0x190a95 || "").trim()).filter(Boolean))];
  if (!_0x1ff7f0.length) {
    return _0x4c807e;
  }
  const _0x5d4656 = Math.max(1, Math.min(100, Number(_0x24c4aa.limit) || 20));
  const _0x1ed024 = Math.max(0, Number(_0x24c4aa.offset) || 0);
  const _0x2f48c4 = String(_0x24c4aa.touch || "all");
  try {
    ensureLeadSchemaColumns();
    const _0x316ee2 = _0x1ff7f0.map(() => "?").join(",");
    const _0x5759b0 = ["(\n          json_extract(raw_data, '$.taskId') IN (" + _0x316ee2 + ")\n          OR json_extract(raw_data, '$.automationTaskId') IN (" + _0x316ee2 + ")\n        )"];
    const _0xc2f703 = [..._0x1ff7f0, ..._0x1ff7f0];
    if (_0x24c4aa.includeVideoCards !== true) {
      _0x5759b0.push("IFNULL(json_extract(raw_data, '$.leadKind'), '') != 'video_card'");
    }
    if (_0x2f48c4 === "touched") {
      _0x5759b0.push(LEAD_TOUCHED_SQL);
    }
    if (_0x2f48c4 === "untouched") {
      _0x5759b0.push("NOT " + LEAD_TOUCHED_SQL);
    }
    const _0x263d12 = _0x5759b0.join(" AND ");
    const _0x558839 = Number(db.prepare("SELECT COUNT(*) AS c FROM leads WHERE " + _0x263d12).get(..._0xc2f703)?.c) || 0;
    const _0x28ee8e = db.prepare("\n            SELECT id, captured_at, raw_data, last_batch_follow_result FROM leads\n            WHERE " + _0x263d12 + "\n            ORDER BY captured_at DESC\n            LIMIT ? OFFSET ?\n        ").all(..._0xc2f703, _0x5d4656, _0x1ed024);
    const _0x9db67f = [_0x5759b0[0]];
    if (_0x24c4aa.includeVideoCards !== true) {
      _0x9db67f.push("IFNULL(json_extract(raw_data, '$.leadKind'), '') != 'video_card'");
    }
    const _0x5daf74 = _0x9db67f.join(" AND ");
    const _0x3a2263 = _0x2f48c4 === "all" ? _0x558839 : Number(db.prepare("SELECT COUNT(*) AS c FROM leads WHERE " + _0x5daf74).get(..._0x1ff7f0, ..._0x1ff7f0)?.c) || 0;
    const _0x28ddac = Number(db.prepare("\n            SELECT COUNT(*) AS c FROM leads\n            WHERE " + _0x5daf74 + "\n              AND " + LEAD_TOUCHED_SQL + "\n        ").get(..._0x1ff7f0, ..._0x1ff7f0)?.c) || 0;
    return {
      items: _0x28ee8e.map(parseLeadRow).filter(Boolean),
      total: _0x558839,
      counts: {
        all: _0x3a2263,
        touched: _0x28ddac,
        untouched: Math.max(0, _0x3a2263 - _0x28ddac)
      }
    };
  } catch (_0x1b5977) {
    console.error("[DB] queryLeadsByAutomationTaskIdsPage 失败:", _0x1b5977);
    return _0x4c807e;
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
function restoreLeadsCollectedSplitFromBackup(_0x2bd0f0 = "") {
  if (!db || !activeUserDataPath) {
    return {
      success: false,
      error: "db_not_ready"
    };
  }
  return leadsCollectedSplitMigrate.restoreLeadsCollectedSplitFromBackup(db, activeUserDataPath, _0x2bd0f0);
}
function isCollectedSplitMigrationDone() {
  return leadsCollectedSplitMigrate.isSplitMigrationDone(db);
}
function deleteEntityLeadgenVideoCardsByKeys(_0x3aedf4 = []) {
  if (!db || !Array.isArray(_0x3aedf4) || !_0x3aedf4.length) {
    return 0;
  }
  try {
    const _0x10d0e2 = new Set();
    for (const _0xc60eb8 of _0x3aedf4) {
      const _0x2bf20b = String(_0xc60eb8 || "").trim();
      if (!_0x2bf20b) {
        continue;
      }
      _0x10d0e2.add(_0x2bf20b);
      const _0x561b4b = _0x2bf20b.match(/^video:(\d{10,})$/i) || _0x2bf20b.match(/(?:video|note)\/(\d{10,})/i);
      if (_0x561b4b?.[1]) {
        _0x10d0e2.add("video:" + _0x561b4b[1]);
        _0x10d0e2.add(_0x561b4b[1]);
        _0x10d0e2.add("https://www.douyin.com/video/" + _0x561b4b[1]);
      }
    }
    if (!_0x10d0e2.size) {
      return 0;
    }
    const _0x2fca30 = _0x134986 => {
      const _0x2376ed = String(_0x134986 || "").trim();
      if (!_0x2376ed) {
        return "";
      }
      const _0x48d59e = _0x2376ed.match(/^video:(\d{10,})$/i)?.[1];
      if (_0x48d59e) {
        return "video:" + _0x48d59e;
      }
      const _0x2b024f = _0x2376ed.match(/(?:video|note)\/(\d{10,})/i)?.[1];
      if (_0x2b024f) {
        return "video:" + _0x2b024f;
      }
      if (/^\d{10,}$/.test(_0x2376ed)) {
        return "video:" + _0x2376ed;
      }
      return "";
    };
    const _0x4099e8 = db.prepare("\n            SELECT id, raw_data FROM entity_leadgen_leads\n            WHERE source_type = 'video'\n               OR source_type = 'video_card'\n               OR id LIKE 'video:%'\n               OR raw_data LIKE '%\"leadKind\":\"video_card\"%'\n               OR raw_data LIKE '%\"sourceType\":\"video\"%'\n               OR raw_data LIKE '%\"identityType\":\"video\"%'\n        ").all();
    const _0x3890bb = [];
    for (const _0x35d941 of _0x4099e8) {
      let _0x422c68 = null;
      try {
        _0x422c68 = JSON.parse(_0x35d941.raw_data || "{}");
      } catch (_0x10ee8a) {
        _0x422c68 = null;
      }
      const _0x1f6bc0 = [_0x35d941.id, _0x422c68?.id, _0x422c68?.leadId, _0x422c68?.userKey, _0x422c68?.key, _0x422c68?.videoUrl, _0x422c68?.url, _0x422c68?.content];
      const _0x11309e = _0x1f6bc0.some(_0x377589 => {
        const _0x1961b2 = String(_0x377589 || "").trim();
        if (!_0x1961b2) {
          return false;
        }
        if (_0x10d0e2.has(_0x1961b2)) {
          return true;
        }
        const _0x7a652f = _0x2fca30(_0x1961b2);
        return !!_0x7a652f && (!!_0x10d0e2.has(_0x7a652f) || !!_0x10d0e2.has(_0x7a652f.slice(6)));
      });
      if (_0x11309e) {
        _0x3890bb.push(String(_0x35d941.id));
      }
    }
    if (!_0x3890bb.length) {
      return 0;
    }
    const _0x4f3be6 = db.prepare("DELETE FROM entity_leadgen_leads WHERE id = ?");
    let _0xc8d6e7 = 0;
    const _0x2f8fc5 = db.transaction(_0x489aa6 => {
      for (const _0x477513 of _0x489aa6) {
        _0xc8d6e7 += _0x4f3be6.run(_0x477513).changes || 0;
      }
    });
    _0x2f8fc5([...new Set(_0x3890bb)]);
    return _0xc8d6e7;
  } catch (_0x233f6d) {
    console.error("[DB] deleteEntityLeadgenVideoCardsByKeys 失败:", _0x233f6d);
    return 0;
  }
}
function normalizeAccountLabelKey(_0x4814a0 = "") {
  return String(_0x4814a0 || "").trim().replace(/（/g, "(").replace(/）/g, ")").replace(/\s+/g, " ").toLowerCase();
}
function formatPoolAccountLabel(_0x4a2b5a) {
  if (!_0x4a2b5a) {
    return "";
  }
  const _0x26a945 = String(_0x4a2b5a.nickname || "").trim();
  const _0x31a506 = String(_0x4a2b5a.name || _0x4a2b5a.remark || _0x4a2b5a.note || _0x4a2b5a.alias || "").trim();
  if (_0x26a945 && _0x31a506 && _0x26a945 !== _0x31a506) {
    return _0x31a506 + "·" + _0x26a945;
  }
  return _0x26a945 || _0x31a506 || "";
}
function collectAccountNameAliases(_0x2f7d4c) {
  const _0x5a52ba = new Set();
  const _0x48e1bd = String(_0x2f7d4c?.nickname || "").trim();
  const _0xba80c4 = String(_0x2f7d4c?.name || _0x2f7d4c?.remark || _0x2f7d4c?.note || _0x2f7d4c?.alias || "").trim();
  for (const _0x3838db of [_0x48e1bd, _0xba80c4, _0x2f7d4c?.remark, _0x2f7d4c?.note, _0x2f7d4c?.alias, formatPoolAccountLabel(_0x2f7d4c), _0x48e1bd && _0xba80c4 && _0x48e1bd !== _0xba80c4 ? _0x48e1bd + " (" + _0xba80c4 + ")" : ""]) {
    const _0x4584a7 = String(_0x3838db || "").trim();
    if (_0x4584a7) {
      _0x5a52ba.add(_0x4584a7);
    }
  }
  return [..._0x5a52ba];
}
function matchUniquePoolAccountByName(_0x9cf59a, _0x1a7335 = []) {
  const _0x32769d = String(_0x9cf59a || "").trim();
  if (!_0x32769d) {
    return null;
  }
  const _0xffd5c2 = Array.isArray(_0x1a7335) ? _0x1a7335 : [];
  const _0x42df01 = _0xffd5c2.filter(_0x2d0c39 => {
    const _0x2d6ee9 = collectAccountNameAliases(_0x2d0c39);
    if (_0x2d6ee9.some(_0x5caff0 => _0x5caff0 === _0x32769d || normalizeAccountLabelKey(_0x5caff0) === normalizeAccountLabelKey(_0x32769d))) {
      return true;
    }
    const _0x4a71ff = _0x32769d.indexOf("·");
    if (_0x4a71ff > 0) {
      const _0x56e3bd = _0x32769d.slice(0, _0x4a71ff).trim();
      const _0x3c6ec2 = _0x32769d.slice(_0x4a71ff + 1).trim();
      const _0xe7b64b = String(_0x2d0c39?.nickname || "").trim();
      const _0x17b2b2 = String(_0x2d0c39?.name || _0x2d0c39?.remark || "").trim();
      if (_0x3c6ec2 && _0xe7b64b === _0x3c6ec2 && (!_0x56e3bd || !_0x17b2b2 || _0x17b2b2 === _0x56e3bd)) {
        return true;
      }
    }
    const _0x2db57c = _0x32769d.match(/^(.*?)\s*[\(（]\s*(.*?)\s*[\)）]\s*$/);
    if (!_0x2db57c) {
      return false;
    }
    const _0xb0f1de = String(_0x2db57c[1] || "").trim();
    const _0x4fd2ab = String(_0x2db57c[2] || "").trim();
    const _0x50e2f5 = String(_0x2d0c39?.nickname || "").trim();
    const _0x5bd78f = String(_0x2d0c39?.name || _0x2d0c39?.remark || "").trim();
    return !!_0xb0f1de && _0x50e2f5 === _0xb0f1de && (!_0x4fd2ab || !_0x5bd78f || _0x5bd78f === _0x4fd2ab);
  });
  if (_0x42df01.length === 1) {
    return _0x42df01[0];
  } else {
    return null;
  }
}
let leadAccountIdBackfillScheduled = false;
function backfillLeadAccountIdsFromPool() {
  if (!db) {
    return 0;
  }
  const _0x36db83 = getAccountPool();
  if (!_0x36db83.length) {
    return 0;
  }
  try {
    const _0x2cdabb = db.prepare("\n            SELECT id, account_name, raw_data\n            FROM leads\n            WHERE (account_id IS NULL OR TRIM(account_id) = '')\n              AND account_name IS NOT NULL AND TRIM(account_name) != ''\n        ").all();
    if (!_0x2cdabb.length) {
      return 0;
    }
    const _0x4df6df = db.prepare("UPDATE leads SET account_id = ?, raw_data = ? WHERE id = ?");
    let _0x4d8b67 = 0;
    const _0xd40cd1 = db.transaction(_0x31b10f => {
      for (const _0x58c848 of _0x31b10f) {
        const _0x9455b3 = matchUniquePoolAccountByName(_0x58c848.account_name, _0x36db83);
        if (!_0x9455b3?.id) {
          continue;
        }
        let _0x54a215 = {};
        try {
          _0x54a215 = JSON.parse(_0x58c848.raw_data || "{}") || {};
        } catch (_0x3d08bb) {
          _0x54a215 = {};
        }
        const _0x5a4ff0 = String(_0x9455b3.id);
        _0x54a215.accountId = _0x5a4ff0;
        if (!String(_0x54a215.accountName || "").trim()) {
          _0x54a215.accountName = String(_0x58c848.account_name || formatPoolAccountLabel(_0x9455b3) || "").trim();
        }
        _0x4df6df.run(_0x5a4ff0, JSON.stringify(_0x54a215), _0x58c848.id);
        _0x4d8b67 += 1;
      }
    });
    _0xd40cd1(_0x2cdabb);
    if (_0x4d8b67 > 0) {
      console.log("[DB] 已回填线索 account_id：" + _0x4d8b67 + " 条");
    }
    return _0x4d8b67;
  } catch (_0x3092d9) {
    console.warn("[DB] backfillLeadAccountIdsFromPool 失败:", _0x3092d9?.message || _0x3092d9);
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
    } catch (_0x56708c) {}
  });
}
function listLeadAccountOptions() {
  if (!db) {
    return [];
  }
  try {
    scheduleLeadAccountIdBackfill();
    const _0x30c9c9 = getAccountPool();
    const _0x1d85fe = db.prepare("\n            SELECT account_id AS accountId,\n                   MAX(account_name) AS accountName\n            FROM leads\n            WHERE account_id IS NOT NULL AND TRIM(account_id) != ''\n            GROUP BY account_id\n        ").all();
    const _0x2e07b3 = db.prepare("\n            SELECT account_name AS accountName\n            FROM leads\n            WHERE (account_id IS NULL OR TRIM(account_id) = '')\n              AND account_name IS NOT NULL AND TRIM(account_name) != ''\n            GROUP BY account_name\n        ").all();
    const _0x228e35 = new Map();
    const _0x2006ef = (_0x10551e, _0x287258) => {
      let _0xe22b5e = String(_0x10551e || "").trim();
      const _0x4ef6f7 = String(_0x287258 || "").trim();
      if (!_0xe22b5e && !_0x4ef6f7) {
        return;
      }
      const _0x3df033 = _0xe22b5e ? _0x30c9c9.find(_0x8b42a4 => String(_0x8b42a4?.id || "") === _0xe22b5e) : null;
      const _0x15066e = !_0x3df033 && _0x4ef6f7 ? matchUniquePoolAccountByName(_0x4ef6f7, _0x30c9c9) : null;
      const _0x19215f = _0x3df033 || _0x15066e || null;
      if (_0x19215f?.id) {
        _0xe22b5e = String(_0x19215f.id).trim();
      }
      const _0x460b4c = _0xe22b5e || "name:" + _0x4ef6f7;
      const _0x17dc29 = _0x228e35.get(_0x460b4c);
      if (!_0x17dc29) {
        _0x228e35.set(_0x460b4c, {
          accountId: _0xe22b5e,
          accountName: _0x4ef6f7 || formatPoolAccountLabel(_0x19215f) || ""
        });
        return;
      }
      if (_0x4ef6f7 && !_0x17dc29.accountName) {
        _0x17dc29.accountName = _0x4ef6f7;
      }
      if (_0xe22b5e && !_0x17dc29.accountId) {
        _0x17dc29.accountId = _0xe22b5e;
      }
    };
    for (const _0x51fd70 of _0x1d85fe) {
      _0x2006ef(_0x51fd70.accountId, _0x51fd70.accountName);
    }
    for (const _0x2f4f42 of _0x2e07b3) {
      _0x2006ef("", _0x2f4f42.accountName);
    }
    const _0x51ddf3 = [..._0x228e35.values()];
    const _0x4f48d4 = new Map();
    for (const _0x544558 of _0x51ddf3) {
      if (!_0x544558.accountId) {
        continue;
      }
      const _0x31b915 = _0x30c9c9.find(_0x5cb385 => String(_0x5cb385?.id || "") === _0x544558.accountId);
      const _0x58066a = normalizeAccountLabelKey(_0x31b915 ? formatPoolAccountLabel(_0x31b915) : _0x544558.accountName);
      if (_0x58066a) {
        _0x4f48d4.set(_0x58066a, _0x544558);
      }
    }
    for (const _0x7cfd35 of _0x51ddf3) {
      if (_0x7cfd35.accountId) {
        continue;
      }
      const _0x57dec3 = matchUniquePoolAccountByName(_0x7cfd35.accountName, _0x30c9c9);
      const _0x3e700a = normalizeAccountLabelKey(_0x57dec3 ? formatPoolAccountLabel(_0x57dec3) : _0x7cfd35.accountName);
      const _0x20ee4e = _0x3e700a ? _0x4f48d4.get(_0x3e700a) : null;
      if (_0x20ee4e) {
        _0x228e35.delete("name:" + _0x7cfd35.accountName);
      }
    }
    return [..._0x228e35.values()].filter(_0x4bfc01 => _0x4bfc01.accountId || _0x4bfc01.accountName).sort((_0xe92183, _0xb0942f) => String(_0xe92183.accountName || "").localeCompare(String(_0xb0942f.accountName || ""), "zh-CN"));
  } catch (_0x214369) {
    return [];
  }
}
function listLeadAccountNames() {
  return listLeadAccountOptions().map(_0x599cbb => _0x599cbb.accountName).filter(Boolean);
}
function listLeadSearchKeywords() {
  if (!db) {
    return [];
  }
  try {
    return db.prepare("\n            SELECT DISTINCT search_keyword AS kw FROM leads\n            WHERE search_keyword IS NOT NULL AND search_keyword != ''\n            ORDER BY search_keyword ASC\n        ").all().map(_0x4ef783 => _0x4ef783.kw).filter(Boolean);
  } catch (_0x3733cf) {
    return [];
  }
}
function listLeadLocations() {
  if (!db) {
    return [];
  }
  try {
    return db.prepare("\n            SELECT DISTINCT location AS loc FROM leads\n            WHERE location IS NOT NULL AND location != '' AND location != '未知'\n            ORDER BY location ASC\n        ").all().map(_0x2eb76a => _0x2eb76a.loc).filter(Boolean);
  } catch (_0x29b32a) {
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
  } catch (_0x500539) {
    console.error("[DB] getAllLeadsRaw 失败:", _0x500539);
    return [];
  }
}
function getAiAgents() {
  if (!db) {
    return [];
  }
  try {
    const _0x3ee00b = db.prepare("SELECT raw_data FROM ai_agents ORDER BY updated_at DESC");
    const _0x43b1e6 = _0x3ee00b.all();
    return _0x43b1e6.map(_0xb3d063 => {
      try {
        return JSON.parse(_0xb3d063.raw_data);
      } catch (_0x26a451) {
        return null;
      }
    }).filter(Boolean);
  } catch (_0x3ac40d) {
    console.error("[DB] getAiAgents 失败:", _0x3ac40d);
    return [];
  }
}
function saveAiAgentsBatch(_0x4f77ac) {
  if (!db || !Array.isArray(_0x4f77ac)) {
    return 0;
  }
  try {
    const _0x17d93c = db.prepare("\n            INSERT INTO ai_agents (id, name, description, system_prompt, model, updated_at, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                name = excluded.name,\n                description = excluded.description,\n                system_prompt = excluded.system_prompt,\n                model = excluded.model,\n                updated_at = excluded.updated_at,\n                raw_data = excluded.raw_data\n        ");
    let _0x4d7182 = 0;
    const _0x4df934 = db.transaction(_0xb3094 => {
      const _0xb25011 = Date.now();
      for (let _0x294164 = 0; _0x294164 < _0xb3094.length; _0x294164++) {
        const _0x104142 = _0xb3094[_0x294164];
        if (!_0x104142 || typeof _0x104142 !== "object") {
          continue;
        }
        const _0x3a197f = _0x104142.id || "agent_" + _0x294164 + "_" + _0xb25011;
        _0x17d93c.run(String(_0x3a197f), String(_0x104142.name || _0x104142.title || "自定义智能体"), String(_0x104142.description || ""), String(_0x104142.system_prompt || _0x104142.prompt || _0x104142.aiPrompt || ""), String(_0x104142.model || "default"), Number(_0x104142.updated_at || _0xb25011), JSON.stringify(_0x104142));
        _0x4d7182++;
      }
    });
    _0x4df934(_0x4f77ac);
    return _0x4d7182;
  } catch (_0x39de6f) {
    console.error("[DB] saveAiAgentsBatch 失败:", _0x39de6f);
    return 0;
  }
}
function deleteAiAgent(_0x3de596) {
  if (!db || !_0x3de596) {
    return false;
  }
  try {
    db.prepare("DELETE FROM ai_agents WHERE id = ?").run(String(_0x3de596));
    return true;
  } catch (_0x178a7f) {
    console.error("[DB] deleteAiAgent 失败 [" + _0x3de596 + "]:", _0x178a7f);
    return false;
  }
}
function parseEntityLeadgenTaskRow(_0x234215, _0x3f787a = []) {
  if (!_0x234215) {
    return null;
  }
  let _0x326821 = {};
  try {
    _0x326821 = JSON.parse(_0x234215.raw_data || "{}") || {};
  } catch (_0x26ba27) {
    _0x326821 = {};
  }
  const _0x302193 = String(_0x234215.remark ?? "");
  const _0x50e336 = String(_0x326821.remark || "");
  const _0x3605b3 = _0x50e336.length > _0x302193.length ? _0x50e336 : _0x302193 || _0x50e336;
  return {
    ..._0x326821,
    id: String(_0x234215.id || _0x326821.id || ""),
    name: String(_0x234215.name ?? (_0x326821.name || "线索采集")),
    status: String(_0x234215.status || _0x326821.status || "draft"),
    createdAt: Number(_0x234215.created_at ?? _0x326821.createdAt) || Date.now(),
    startedAt: _0x234215.started_at != null ? Number(_0x234215.started_at) : _0x326821.startedAt != null ? Number(_0x326821.startedAt) : null,
    endedAt: _0x234215.ended_at != null ? Number(_0x234215.ended_at) : _0x326821.endedAt != null ? Number(_0x326821.endedAt) : null,
    endReason: String(_0x234215.end_reason ?? (_0x326821.endReason || "")),
    remark: _0x3605b3,
    leads: Array.isArray(_0x3f787a) ? _0x3f787a : []
  };
}
function parseEntityLeadgenLeadRow(_0xabf9bb) {
  if (!_0xabf9bb) {
    return null;
  }
  try {
    const _0x1e75f4 = JSON.parse(_0xabf9bb.raw_data || "{}");
    if (!_0x1e75f4.id && _0xabf9bb.id) {
      _0x1e75f4.id = _0xabf9bb.id;
    }
    if (!_0x1e75f4.ts && _0xabf9bb.ts) {
      _0x1e75f4.ts = Number(_0xabf9bb.ts);
    }
    return _0x1e75f4;
  } catch (_0x2f0bc8) {
    return null;
  }
}
function extractEntityLeadgenTaskColumns(_0x2f754b) {
  const _0x40a67d = _0x2f754b && typeof _0x2f754b === "object" ? _0x2f754b : {};
  const _0x32f278 = Date.now();
  const _0x5ccd43 = String(_0x40a67d.id || "entity_" + _0x32f278);
  const {
    leads: _0x3648cd,
    ..._0x1b61f6
  } = _0x40a67d;
  return {
    id: _0x5ccd43,
    name: String(_0x40a67d.name || "线索采集").slice(0, 200),
    status: String(_0x40a67d.status || "draft").slice(0, 40),
    created_at: Number(_0x40a67d.createdAt || _0x32f278) || _0x32f278,
    started_at: _0x40a67d.startedAt != null ? Number(_0x40a67d.startedAt) : null,
    ended_at: _0x40a67d.endedAt != null ? Number(_0x40a67d.endedAt) : null,
    end_reason: String(_0x40a67d.endReason || "").slice(0, 80),
    remark: String(_0x40a67d.remark || "").slice(0, 500),
    updated_at: _0x32f278,
    raw_data: JSON.stringify({
      ..._0x1b61f6,
      id: _0x5ccd43,
      leads: undefined
    })
  };
}
function extractEntityLeadgenLeadColumns(_0x13e48f, _0x330c5f) {
  const _0x3649da = _0x330c5f && typeof _0x330c5f === "object" ? _0x330c5f : {};
  const _0x346998 = Date.now();
  const _0x1dfba0 = String(_0x3649da.id || "entity_lead_" + _0x346998 + "_" + Math.random().toString(36).slice(2, 8));
  return {
    id: _0x1dfba0,
    task_id: String(_0x13e48f),
    ts: Number(_0x3649da.ts || _0x346998) || _0x346998,
    nickname: String(_0x3649da.nickname || _0x3649da.title || "").slice(0, 200),
    source_type: String(_0x3649da.sourceType || "").slice(0, 40),
    account_id: String(_0x3649da.accountId || "").slice(0, 120),
    raw_data: JSON.stringify({
      ..._0x3649da,
      id: _0x1dfba0
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
    const _0x5ac070 = db.prepare("\n            SELECT id, name, status, created_at, started_at, ended_at, end_reason, remark, raw_data\n            FROM entity_leadgen_tasks\n            ORDER BY created_at DESC\n        ").all();
    if (!includeLeads) {
      return _0x5ac070.map(_0x3add37 => parseEntityLeadgenTaskRow(_0x3add37, []));
    }
    const _0x3cb970 = Math.max(0, Math.floor(Number(leadLimit) || 0));
    const _0x687e60 = db.prepare("\n            SELECT id, task_id, ts, raw_data\n            FROM entity_leadgen_leads\n            ORDER BY ts DESC\n        ").all();
    const _0x5849f0 = new Map();
    for (const _0x2bbb02 of _0x687e60) {
      const _0x16d28e = String(_0x2bbb02.task_id || "");
      if (!_0x16d28e) {
        continue;
      }
      if (!_0x5849f0.has(_0x16d28e)) {
        _0x5849f0.set(_0x16d28e, []);
      }
      const _0x4cc766 = _0x5849f0.get(_0x16d28e);
      if (_0x3cb970 > 0 && _0x4cc766.length >= _0x3cb970) {
        continue;
      }
      const _0x1e611e = parseEntityLeadgenLeadRow(_0x2bbb02);
      if (_0x1e611e) {
        _0x4cc766.push(_0x1e611e);
      }
    }
    return _0x5ac070.map(_0x283c98 => parseEntityLeadgenTaskRow(_0x283c98, _0x5849f0.get(String(_0x283c98.id)) || []));
  } catch (_0x18cde8) {
    console.error("[DB] listEntityLeadgenTasks 失败:", _0x18cde8);
    return [];
  }
}
function getEntityLeadgenTaskById(_0x1d582e, {
  includeLeads = true,
  leadLimit = 0
} = {}) {
  if (!db || !_0x1d582e) {
    return null;
  }
  try {
    const _0x2338a0 = db.prepare("\n            SELECT id, name, status, created_at, started_at, ended_at, end_reason, remark, raw_data\n            FROM entity_leadgen_tasks WHERE id = ?\n        ").get(String(_0x1d582e));
    if (!_0x2338a0) {
      return null;
    }
    if (!includeLeads) {
      return parseEntityLeadgenTaskRow(_0x2338a0, []);
    }
    const _0x3fd4f7 = Math.max(0, Math.floor(Number(leadLimit) || 0));
    const _0x3454cf = _0x3fd4f7 > 0 ? db.prepare("\n                SELECT id, task_id, ts, raw_data\n                FROM entity_leadgen_leads\n                WHERE task_id = ?\n                ORDER BY ts DESC\n                LIMIT ?\n            ").all(String(_0x1d582e), _0x3fd4f7) : db.prepare("\n                SELECT id, task_id, ts, raw_data\n                FROM entity_leadgen_leads\n                WHERE task_id = ?\n                ORDER BY ts DESC\n            ").all(String(_0x1d582e));
    const _0x424280 = _0x3454cf.map(parseEntityLeadgenLeadRow).filter(Boolean);
    return parseEntityLeadgenTaskRow(_0x2338a0, _0x424280);
  } catch (_0x5c8d6e) {
    console.error("[DB] getEntityLeadgenTaskById 失败:", _0x5c8d6e);
    return null;
  }
}
function upsertEntityLeadgenTask(_0x582736, {
  replaceLeads = false
} = {}) {
  if (!db || !_0x582736 || typeof _0x582736 !== "object") {
    return null;
  }
  try {
    const _0x54b57a = extractEntityLeadgenTaskColumns(_0x582736);
    const _0x48e5cf = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(_0x54b57a.id);
    db.prepare("\n            INSERT INTO entity_leadgen_tasks (\n                id, name, status, created_at, started_at, ended_at, end_reason, remark, updated_at, raw_data\n            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                name = excluded.name,\n                status = excluded.status,\n                created_at = excluded.created_at,\n                started_at = excluded.started_at,\n                ended_at = excluded.ended_at,\n                end_reason = excluded.end_reason,\n                remark = excluded.remark,\n                updated_at = excluded.updated_at,\n                raw_data = excluded.raw_data\n        ").run(_0x54b57a.id, _0x54b57a.name, _0x54b57a.status, _0x54b57a.created_at, _0x54b57a.started_at, _0x54b57a.ended_at, _0x54b57a.end_reason, _0x54b57a.remark, _0x54b57a.updated_at, _0x54b57a.raw_data);
    if (replaceLeads && Array.isArray(_0x582736.leads)) {
      replaceEntityLeadgenLeads(_0x54b57a.id, _0x582736.leads);
    } else if (!_0x48e5cf && Array.isArray(_0x582736.leads) && _0x582736.leads.length) {
      appendEntityLeadgenLeads(_0x54b57a.id, _0x582736.leads);
    }
    return getEntityLeadgenTaskById(_0x54b57a.id, {
      includeLeads: true
    });
  } catch (_0x35d321) {
    console.error("[DB] upsertEntityLeadgenTask 失败:", _0x35d321);
    return null;
  }
}
function deleteEntityLeadgenTasks(_0x3036a9 = []) {
  if (!db) {
    return false;
  }
  const _0x1fa65a = (Array.isArray(_0x3036a9) ? _0x3036a9 : [_0x3036a9]).map(String).filter(Boolean);
  if (!_0x1fa65a.length) {
    return true;
  }
  try {
    const _0x1bac78 = db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?");
    const _0x38fbfa = db.prepare("DELETE FROM entity_leadgen_tasks WHERE id = ?");
    const _0xaff527 = db.transaction(_0x33a284 => {
      for (const _0x345a16 of _0x33a284) {
        _0x1bac78.run(_0x345a16);
        _0x38fbfa.run(_0x345a16);
      }
    });
    _0xaff527(_0x1fa65a);
    return true;
  } catch (_0x5cfa10) {
    console.error("[DB] deleteEntityLeadgenTasks 失败:", _0x5cfa10);
    return false;
  }
}
function appendEntityLeadgenLeads(_0x569353, _0x36b2d8 = []) {
  if (!db || !_0x569353) {
    return 0;
  }
  const _0xf69a8 = Array.isArray(_0x36b2d8) ? _0x36b2d8 : [_0x36b2d8];
  if (!_0xf69a8.length) {
    return 0;
  }
  try {
    const _0x54a7eb = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(String(_0x569353));
    if (!_0x54a7eb) {
      return 0;
    }
    const _0x4524fd = db.prepare("\n            INSERT INTO entity_leadgen_leads (id, task_id, ts, nickname, source_type, account_id, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                task_id = excluded.task_id,\n                ts = excluded.ts,\n                nickname = excluded.nickname,\n                source_type = excluded.source_type,\n                account_id = excluded.account_id,\n                raw_data = excluded.raw_data\n        ");
    let _0x321f76 = 0;
    const _0x33f1ce = db.transaction(_0x140dbc => {
      for (const _0x4732d7 of _0x140dbc) {
        if (!_0x4732d7 || typeof _0x4732d7 !== "object") {
          continue;
        }
        const _0x2b003d = extractEntityLeadgenLeadColumns(_0x569353, _0x4732d7);
        _0x4524fd.run(_0x2b003d.id, _0x2b003d.task_id, _0x2b003d.ts, _0x2b003d.nickname, _0x2b003d.source_type, _0x2b003d.account_id, _0x2b003d.raw_data);
        _0x321f76 += 1;
      }
    });
    _0x33f1ce(_0xf69a8);
    return _0x321f76;
  } catch (_0x52ff1c) {
    console.error("[DB] appendEntityLeadgenLeads 失败:", _0x52ff1c);
    return 0;
  }
}
function replaceEntityLeadgenLeads(_0x577ae1, _0x1b9989 = []) {
  if (!db || !_0x577ae1) {
    return 0;
  }
  const _0x30d644 = Array.isArray(_0x1b9989) ? _0x1b9989 : [];
  try {
    const _0x13372f = db.prepare("SELECT id FROM entity_leadgen_tasks WHERE id = ?").get(String(_0x577ae1));
    if (!_0x13372f) {
      return 0;
    }
    const _0x27f7b8 = db.prepare("\n            INSERT INTO entity_leadgen_leads (id, task_id, ts, nickname, source_type, account_id, raw_data)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n            ON CONFLICT(id) DO UPDATE SET\n                task_id = excluded.task_id,\n                ts = excluded.ts,\n                nickname = excluded.nickname,\n                source_type = excluded.source_type,\n                account_id = excluded.account_id,\n                raw_data = excluded.raw_data\n        ");
    const _0x191261 = db.transaction(_0x45c43e => {
      db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?").run(String(_0x577ae1));
      let _0xaee212 = 0;
      for (const _0x20b470 of _0x45c43e) {
        if (!_0x20b470 || typeof _0x20b470 !== "object") {
          continue;
        }
        const _0x29be98 = extractEntityLeadgenLeadColumns(_0x577ae1, _0x20b470);
        _0x27f7b8.run(_0x29be98.id, _0x29be98.task_id, _0x29be98.ts, _0x29be98.nickname, _0x29be98.source_type, _0x29be98.account_id, _0x29be98.raw_data);
        _0xaee212 += 1;
      }
      return _0xaee212;
    });
    return _0x191261(_0x30d644);
  } catch (_0x275035) {
    console.error("[DB] replaceEntityLeadgenLeads 失败:", _0x275035);
    return 0;
  }
}
function deleteEntityLeadgenLeads(_0x469b94, {
  leadIds = [],
  clearAll = false
} = {}) {
  if (!db || !_0x469b94) {
    return 0;
  }
  try {
    if (clearAll) {
      return db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ?").run(String(_0x469b94)).changes || 0;
    }
    const _0x492110 = (Array.isArray(leadIds) ? leadIds : [leadIds]).map(String).filter(Boolean);
    if (!_0x492110.length) {
      return 0;
    }
    const _0x5dc93a = db.prepare("DELETE FROM entity_leadgen_leads WHERE task_id = ? AND id = ?");
    let _0x49bf47 = 0;
    const _0x35b519 = db.transaction(_0x2e4710 => {
      for (const _0x4fbe95 of _0x2e4710) {
        _0x49bf47 += _0x5dc93a.run(String(_0x469b94), _0x4fbe95).changes || 0;
      }
    });
    _0x35b519(_0x492110);
    return _0x49bf47;
  } catch (_0x18538e) {
    console.error("[DB] deleteEntityLeadgenLeads 失败:", _0x18538e);
    return 0;
  }
}
function listEntityLeadgenLeadsPage(_0xacb12b, _0x519b06 = {}) {
  if (!db || !_0xacb12b) {
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
    return entityLeadgenLeadsQuery.listEntityLeadgenLeadsPage(db, _0xacb12b, _0x519b06);
  } catch (_0x5b81ba) {
    console.error("[DB] listEntityLeadgenLeadsPage 失败:", _0x5b81ba);
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
function countEntityLeadgenLeads(_0x5761cf) {
  if (!db || !_0x5761cf) {
    return 0;
  }
  try {
    const _0x3006a2 = db.prepare("SELECT COUNT(*) AS cnt FROM entity_leadgen_leads WHERE task_id = ?").get(String(_0x5761cf));
    if (_0x3006a2) {
      return Number(_0x3006a2.cnt) || 0;
    } else {
      return 0;
    }
  } catch (_0x10da01) {
    return 0;
  }
}
function getEntityLeadgenTasksCount() {
  if (!db) {
    return 0;
  }
  try {
    const _0x114795 = db.prepare("SELECT COUNT(*) AS cnt FROM entity_leadgen_tasks").get();
    if (_0x114795) {
      return Number(_0x114795.cnt) || 0;
    } else {
      return 0;
    }
  } catch (_0x10edeb) {
    return 0;
  }
}
function isEntityLeadgenRuntimeReady() {
  return isMigrationExecuted("v4_entity_leadgen_sqlite");
}
function isMigrationExecuted(_0x257f13) {
  if (!db) {
    return false;
  }
  try {
    const _0x1c5b64 = db.prepare("SELECT name FROM sys_migrations WHERE name = ?").get(_0x257f13);
    return Boolean(_0x1c5b64);
  } catch (_0x3802f7) {
    return false;
  }
}
function recordMigration(_0x437ca5) {
  if (!db) {
    return false;
  }
  try {
    db.prepare("INSERT INTO sys_migrations (name, executed_at) VALUES (?, ?)").run(_0x437ca5, Date.now());
    return true;
  } catch (_0x149c88) {
    console.error("[DB] 记录迁移 [" + _0x437ca5 + "] 失败:", _0x149c88);
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
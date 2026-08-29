const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  stripLocationFromCommentTimeText
} = require("../shared/commentTime");
const {
  extractDouyinVideoId,
  canonicalizeDouyinVideoUrl
} = require("../shared/processedVideoKey");
const {
  normalizeAwemeCreateTimeMs
} = require("../shared/entityBloggerProfileSelect");
const dbManager = require("./dbManager");
const entityLeadgenLeadsQuery = require("./entityLeadgenLeadsQuery");
function normalizeLeadPublishTimeMs(arg1) {
  return normalizeAwemeCreateTimeMs(arg1?.publishTime ?? arg1?.createTime ?? arg1?.create_time ?? 0);
}
const ENTITY_LEADGEN_TASKS_FILE = arg1 => path.join(arg1, "entity_leadgen_tasks.enc");
function createCrypto(arg1) {
  const result = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const result2 = Buffer.alloc(16, 0);
  const result3 = ENTITY_LEADGEN_TASKS_FILE(arg1);
  function fn(arg1, list = []) {
    if (!fs.existsSync(arg1)) {
      return list;
    }
    try {
      const result3 = fs.readFileSync(arg1, "utf8");
      if (!result3) {
        return list;
      }
      const result4 = crypto.createDecipheriv("aes-256-cbc", result, result2);
      let result5 = result4.update(result3, "hex", "utf8");
      result5 += result4.final("utf8");
      return JSON.parse(result5);
    } catch (error) {
      return list;
    }
  }
  function fn2(arg1, arg2) {
    const result3 = crypto.createCipheriv("aes-256-cbc", result, result2);
    let result4 = result3.update(JSON.stringify(arg2), "utf8", "hex");
    result4 += result3.final("hex");
    fs.writeFileSync(arg1, result4);
  }
  return {
    filePath: result3,
    readTasks: () => fn(result3, []),
    writeTasks: arg1 => fn2(result3, arg1)
  };
}
function createEmptyEntityLeadgenTaskStats() {
  return {
    collected: 0,
    blogger: 0,
    user: 0,
    mutual: 0,
    following: 0,
    live: 0,
    comment: 0,
    video: 0,
    author: 0,
    duplicates: 0,
    keywordsDone: 0,
    lastCycleAt: null
  };
}
function normalizeLeadRecord(options = {}, options2 = {}) {
  const result = String(options.sourceType || "").trim();
  const result2 = String(options.leadKind || "").trim();
  const result3 = String(options.videoUrl || options.url || "").trim();
  const value = result2 === "video_card" || result === "video" || String(options.identityType || "") === "video" ? extractDouyinVideoId(result3 || options.content || options.leadId || "") || (String(options.leadId || options.userKey || "").startsWith("video:") ? String(options.leadId || options.userKey).slice(6) : "") : "";
  const local = !!value || result2 === "video_card" || result === "video";
  const value2 = options2.stableId ? ensureStableEntityLeadId(options2.taskId, options) : String(options.id || "entity_lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8));
  if (local && value) {
    const value3 = "https://www.douyin.com/video/" + value;
    const local = String(options.title || "").replace(/\s+/g, " ").trim() || String(options.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
    const value4 = Array.isArray(options.collectedFields) && options.collectedFields.length ? options.collectedFields.map(String) : ["video"];
    const local2 = String(options.authorProfileUrl || "").trim() || (value4.includes("author") && /\/user\//i.test(String(options.userUrl || "")) && !/\/(?:video|note)\//i.test(String(options.userUrl || "")) ? String(options.userUrl || "").trim() : "");
    const local3 = String(options.authorNickname || "").trim().replace(/^@+/, "") || (value4.includes("author") && String(options.nickname || "").trim() && String(options.nickname || "").trim() !== local ? String(options.nickname || "").trim().replace(/^@+/, "") : "");
    return {
      id: value2,
      ts: Number(options.ts || Date.now()),
      accountId: String(options.accountId || ""),
      accountName: String(options.accountName || ""),
      nickname: local3 || local,
      title: local,
      uid: "",
      secUid: "",
      webcastUid: "",
      privacyMasked: false,
      identityType: "video",
      profileAvailable: !!value4.includes("author") && !!local2,
      profileUnavailable: !value4.includes("author") || !local2,
      profileUnavailableReason: value4.includes("author") && local2 ? "" : "视频作品链接",
      userUrl: local2,
      authorProfileUrl: local2,
      videoUrl: value3,
      url: value3,
      leadKind: "video_card",
      leadId: "video:" + value,
      collectedFields: value4,
      content: value3,
      timeText: String(options.timeText || options.publishTimeText || "卡片采集"),
      ipLocation: "",
      messageId: "",
      eventTimestamp: Number(options.eventTimestamp || 0) || 0,
      publishTime: normalizeLeadPublishTimeMs(options),
      publishTimeText: String(options.publishTimeText || "").trim(),
      liveEvent: null,
      liveEvents: [],
      sourceType: "video",
      searchKeyword: String(options.searchKeyword || ""),
      entrySource: String(options.entrySource || "entity_video"),
      entryLabel: String(options.entryLabel || "线索采集：视频作品链接"),
      duplicate: !!options.duplicate
    };
  }
  const result4 = String(options.uid || "");
  const result5 = String(options.secUid || options.sec_uid || "");
  const result6 = String(options.webcastUid || options.webcast_uid || "");
  const value3 = !result4 && !result5 && result6.length >= 15 && result6 !== "111111" && /^[A-Za-z0-9_-]+$/.test(result6) ? result6 : "";
  const flag = !!result5;
  const value4 = flag ? "https://www.douyin.com/user/" + result5 : "";
  return {
    id: value2,
    ts: Number(options.ts || Date.now()),
    accountId: String(options.accountId || ""),
    accountName: String(options.accountName || ""),
    nickname: String(options.nickname || ""),
    title: String(options.title || options.sourceVideoTitle || "").trim(),
    sourceVideoTitle: String(options.sourceVideoTitle || options.title || "").trim(),
    uid: result4,
    secUid: result5,
    webcastUid: value3,
    privacyMasked: !!options.privacyMasked,
    identityType: flag ? "profile" : value3 ? "webcast" : String(options.identityType || "numeric"),
    profileAvailable: flag,
    profileUnavailable: !flag,
    profileUnavailableReason: flag ? "" : String(options.profileUnavailableReason || (value3 ? "主播设置不支持查看他人资料" : "实时消息未提供主页标识")),
    userUrl: value4,
    videoUrl: canonicalizeDouyinVideoUrl(options.videoUrl) || "",
    url: String(options.url || value4 || ""),
    leadKind: String(options.leadKind || ""),
    leadId: String(options.leadId || ""),
    collectedFields: Array.isArray(options.collectedFields) ? options.collectedFields.map(String) : [],
    content: String(options.content || ""),
    timeText: stripLocationFromCommentTimeText(options.timeText || options.time) || String(options.timeText || options.time || ""),
    ipLocation: String(options.ipLocation || options.location || ""),
    messageId: String(options.messageId || ""),
    eventTimestamp: Number(options.eventTimestamp || 0) || 0,
    publishTime: normalizeLeadPublishTimeMs(options),
    liveEvent: options.liveEvent && typeof options.liveEvent === "object" ? options.liveEvent : null,
    liveEvents: Array.isArray(options.liveEvents) ? options.liveEvents.slice(-500) : [],
    sourceType: String(options.sourceType || ""),
    searchKeyword: String(options.searchKeyword || ""),
    entrySource: String(options.entrySource || ""),
    entryLabel: String(options.entryLabel || ""),
    duplicate: !!options.duplicate
  };
}
function normalizeEntityLeadgenTask(options = {}) {
  const value = Array.isArray(options.runs) ? options.runs.map(arg1 => ({
    accountId: String(arg1.accountId || ""),
    nickname: String(arg1.nickname || arg1.name || ""),
    name: String(arg1.name || ""),
    endedAt: arg1.endedAt != null ? Number(arg1.endedAt) : null,
    endReason: arg1.endReason || ""
  })).filter(arg1 => arg1.accountId) : [];
  const value2 = Array.isArray(options.leads) ? options.leads : [];
  const result = value2.map(arg1 => normalizeLeadRecord(arg1, {
    taskId: String(options.id || ""),
    stableId: true
  }));
  return {
    id: String(options.id || "entity_" + Date.now()),
    name: String(options.name || "线索采集"),
    status: options.status || "draft",
    createdAt: Number(options.createdAt || Date.now()),
    startedAt: options.startedAt != null ? Number(options.startedAt) : null,
    endedAt: options.endedAt != null ? Number(options.endedAt) : null,
    endReason: options.endReason || "",
    runs: value,
    configSnapshot: options.configSnapshot || null,
    stats: {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(options.stats || {})
    },
    leads: result,
    roomHints: Array.isArray(options.roomHints) ? options.roomHints.map(arg1 => ({
      url: String(arg1?.url || ""),
      reason: String(arg1?.reason || ""),
      message: String(arg1?.message || ""),
      ts: Number(arg1?.ts || Date.now()) || Date.now()
    })).filter(arg1 => arg1.url).slice(-50) : [],
    remark: options.remark || ""
  };
}
function normalizeEntityLeadgenTaskForMigration(options = {}) {
  return normalizeEntityLeadgenTask(options);
}
function ensureStableEntityLeadId(arg1, options = {}) {
  const result = String(options.id || "").trim();
  if (result) {
    return result;
  }
  const result2 = String(options.leadId || options.userKey || "").trim();
  if (/^video:\d{10,}$/i.test(result2) || /^author:/i.test(result2)) {
    const result = crypto.createHash("sha1").update(String(arg1 || "") + "|" + result2.toLowerCase()).digest("hex").slice(0, 20);
    return "entity_lead_" + result;
  }
  const result3 = extractDouyinVideoId(options.videoUrl || options.url || options.content || "");
  if (result3 && (options.leadKind === "video_card" || options.sourceType === "video" || options.identityType === "video")) {
    const result = crypto.createHash("sha1").update(String(arg1 || "") + "|video:" + result3).digest("hex").slice(0, 20);
    return "entity_lead_" + result;
  }
  const result4 = [String(arg1 || ""), String(options.ts || ""), String(options.nickname || options.title || ""), String(options.content || ""), String(options.sourceType || options.leadKind || ""), String(options.accountId || ""), String(options.leadId || options.secUid || options.uid || options.videoUrl || options.url || options.userUrl || ""), String(options.messageId || "")].join("|");
  const result5 = crypto.createHash("sha1").update(result4).digest("hex").slice(0, 20);
  return "entity_lead_" + result5;
}
function ensureSqliteReady(arg1) {
  dbManager.initDatabase(arg1);
  return !!dbManager.getDatabaseInstance();
}
function createEncEntityLeadgenTasksApi(arg1) {
  const result = createCrypto(arg1);
  const {
    readTasks: readTasks,
    writeTasks: writeTasks
  } = result;
  function fn() {
    return readTasks().map(normalizeEntityLeadgenTask).sort((arg1, arg2) => (arg2.createdAt || 0) - (arg1.createdAt || 0));
  }
  function fn2(arg1) {
    return fn().find(arg12 => arg12.id === arg1) || null;
  }
  function fn3(arg1) {
    const result = readTasks().map(normalizeEntityLeadgenTask);
    const result2 = normalizeEntityLeadgenTask(arg1);
    const result3 = result.findIndex(arg1 => arg1.id === result2.id);
    if (result3 === -1) {
      result.unshift(result2);
    } else {
      result[result3] = {
        ...result[result3],
        ...result2
      };
    }
    writeTasks(result);
    return result2;
  }
  function fn4(arg1, options = {}) {
    const result = readTasks().map(normalizeEntityLeadgenTask);
    const result2 = result.findIndex(arg12 => arg12.id === arg1);
    if (result2 === -1) {
      return null;
    }
    result[result2] = normalizeEntityLeadgenTask({
      ...result[result2],
      ...options,
      id: arg1
    });
    writeTasks(result);
    return result[result2];
  }
  function fn5(list = []) {
    const set = new Set(Array.isArray(list) ? list : [list]);
    const result = readTasks().filter(arg1 => !set.has(arg1.id));
    writeTasks(result);
    return true;
  }
  function fn6(arg1, options = {}) {
    const result = fn2(arg1);
    if (!result) {
      return null;
    }
    const obj = {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(result.stats || {})
    };
    Object.keys(createEmptyEntityLeadgenTaskStats()).forEach(arg1 => {
      if (arg1 === "lastCycleAt") {
        return;
      }
      const result = Number(options[arg1]);
      if (Number.isFinite(result) && result > 0) {
        obj[arg1] += Math.floor(result);
      }
    });
    if (options.lastCycleAt != null) {
      obj.lastCycleAt = Number(options.lastCycleAt);
    }
    return fn4(arg1, {
      stats: obj
    });
  }
  function fn7(arg1, list = []) {
    const result = (Array.isArray(list) ? list : [list]).filter(Boolean).map(arg12 => normalizeLeadRecord(arg12, {
      stableId: true,
      taskId: arg1
    })).sort((arg1, arg2) => arg2.ts - arg1.ts);
    if (!result.length) {
      return fn2(arg1);
    }
    const result2 = readTasks().map(normalizeEntityLeadgenTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    const value = Array.isArray(result2[result3].leads) ? result2[result3].leads : [];
    const map = new Map(value.map(arg1 => [String(arg1.id || ""), arg1]));
    result.forEach(arg1 => {
      if (!arg1?.id) {
        return;
      }
      map.set(String(arg1.id), arg1);
    });
    result2[result3] = normalizeEntityLeadgenTask({
      ...result2[result3],
      leads: [...map.values()].sort((arg1, arg2) => (arg2.ts || 0) - (arg1.ts || 0))
    });
    writeTasks(result2);
    return result2[result3];
  }
  function fn8(arg1, options = {}) {
    const result = fn2(arg1);
    const value = Array.isArray(result?.leads) ? result.leads : [];
    return entityLeadgenLeadsQuery.paginateLeadsArray(value, options);
  }
  function fn9(arg1, options = {}) {
    const result = fn2(arg1);
    if (!result) {
      return null;
    }
    const {
      leadIds = [],
      clearAll = false
    } = options;
    if (clearAll) {
      return fn4(arg1, {
        leads: [],
        stats: createEmptyEntityLeadgenTaskStats()
      });
    }
    const set = new Set(Array.isArray(leadIds) ? leadIds : [leadIds]);
    if (set.size === 0) {
      return result;
    }
    const result2 = (result.leads || []).filter(arg1 => !set.has(arg1.id));
    return fn4(arg1, {
      leads: result2
    });
  }
  function fn10() {
    const result = readTasks().map(normalizeEntityLeadgenTask);
    const result2 = Date.now();
    let flag = false;
    const result3 = result.map(arg1 => {
      if (arg1.status !== "running") {
        return arg1;
      }
      flag = true;
      const result = (arg1.runs || []).map(arg1 => arg1.endedAt ? arg1 : {
        ...arg1,
        endedAt: result2,
        endReason: "app_restart"
      });
      return normalizeEntityLeadgenTask({
        ...arg1,
        status: "stopped",
        runs: result,
        endedAt: arg1.endedAt || result2,
        endReason: "app_restart"
      });
    });
    if (flag) {
      writeTasks(result3);
    }
    return flag;
  }
  return {
    runtime: "enc",
    listTasks: fn,
    findTaskById: fn2,
    upsertTask: fn3,
    patchTask: fn4,
    deleteTasks: fn5,
    incrementStats: fn6,
    appendLeadRecords: fn7,
    listLeadRecordsPage: fn8,
    deleteLeadRecords: fn9,
    resetStaleRunningTasks: fn10,
    normalizeEntityLeadgenTask: normalizeEntityLeadgenTask
  };
}
function createSqliteEntityLeadgenTasksApi(arg1) {
  ensureSqliteReady(arg1);
  function fn(arg1, {
    includeLeads = true
  } = {}) {
    if (!arg1) {
      return null;
    }
    const result = normalizeEntityLeadgenTask({
      ...arg1,
      leads: includeLeads && Array.isArray(arg1.leads) ? arg1.leads : []
    });
    if (!includeLeads) {
      result.leads = [];
    }
    return result;
  }
  function fn2(options = {}) {
    const value = options.includeLeads !== false;
    return dbManager.listEntityLeadgenTasks({
      includeLeads: value,
      leadLimit: 0
    }).map(arg1 => fn(arg1, {
      includeLeads: value
    }));
  }
  function fn3(arg1, options = {}) {
    const value = options.includeLeads !== false;
    const result = dbManager.getEntityLeadgenTaskById(arg1, {
      includeLeads: value,
      leadLimit: 0
    });
    return fn(result, {
      includeLeads: value
    });
  }
  function fn4(arg1) {
    const value = arg1 && typeof arg1 === "object" ? arg1 : {};
    const result = String(value.id || "entity_" + Date.now());
    const result2 = dbManager.getEntityLeadgenTaskById(result, {
      includeLeads: false
    });
    if (!result2) {
      const result2 = normalizeEntityLeadgenTask({
        ...value,
        id: result
      });
      const result3 = dbManager.upsertEntityLeadgenTask(result2, {
        replaceLeads: false
      });
      return fn(result3 || result2);
    }
    const obj = {
      ...result2,
      ...value,
      id: result,
      createdAt: result2.createdAt || value.createdAt
    };
    const list = ["roomHints", "remark", "stats", "configSnapshot", "runs"];
    for (const item of list) {
      if (!Object.prototype.hasOwnProperty.call(value, item)) {
        obj[item] = result2[item];
      }
    }
    obj.leads = [];
    const result3 = normalizeEntityLeadgenTask(obj);
    const result4 = dbManager.upsertEntityLeadgenTask(result3, {
      replaceLeads: false
    });
    return fn(result4 || result3);
  }
  function fn5(arg1, options = {}) {
    const result = fn3(arg1, {
      includeLeads: false
    });
    if (!result) {
      return null;
    }
    const {
      leads: leads,
      ...local
    } = options || {};
    const result2 = normalizeEntityLeadgenTask({
      ...result,
      ...local,
      id: arg1,
      leads: result.leads || []
    });
    dbManager.upsertEntityLeadgenTask(result2, {
      replaceLeads: false
    });
    if (Object.prototype.hasOwnProperty.call(options || {}, "leads")) {
      if (!Array.isArray(leads) || leads.length === 0) {
        dbManager.deleteEntityLeadgenLeads(arg1, {
          clearAll: true
        });
      } else {
        dbManager.replaceEntityLeadgenLeads(arg1, leads.map(normalizeLeadRecord));
      }
    }
    return fn3(arg1);
  }
  function fn6(list = []) {
    return dbManager.deleteEntityLeadgenTasks(list);
  }
  function fn7(arg1, options = {}) {
    const result = fn3(arg1, {
      includeLeads: false
    });
    if (!result) {
      return null;
    }
    const obj = {
      ...createEmptyEntityLeadgenTaskStats(),
      ...(result.stats || {})
    };
    Object.keys(createEmptyEntityLeadgenTaskStats()).forEach(arg1 => {
      if (arg1 === "lastCycleAt") {
        return;
      }
      const result = Number(options[arg1]);
      if (Number.isFinite(result) && result > 0) {
        obj[arg1] += Math.floor(result);
      }
    });
    if (options.lastCycleAt != null) {
      obj.lastCycleAt = Number(options.lastCycleAt);
    }
    return fn5(arg1, {
      stats: obj
    });
  }
  function fn8(arg1, list = []) {
    const result = (Array.isArray(list) ? list : [list]).filter(Boolean).map(arg12 => normalizeLeadRecord(arg12, {
      stableId: true,
      taskId: arg1
    }));
    if (!result.length) {
      return fn3(arg1, {
        includeLeads: false
      });
    }
    const result2 = dbManager.getEntityLeadgenTaskById(arg1, {
      includeLeads: false
    });
    if (!result2) {
      return null;
    }
    dbManager.appendEntityLeadgenLeads(arg1, result);
    return fn3(arg1, {
      includeLeads: false
    });
  }
  function fn9(arg1, options = {}) {
    return dbManager.listEntityLeadgenLeadsPage(arg1, options);
  }
  function fn10(arg1, options = {}) {
    const result = dbManager.getEntityLeadgenTaskById(arg1, {
      includeLeads: false
    });
    if (!result) {
      return null;
    }
    const {
      leadIds = [],
      clearAll = false
    } = options;
    dbManager.deleteEntityLeadgenLeads(arg1, {
      leadIds: leadIds,
      clearAll: clearAll
    });
    if (clearAll) {
      return fn5(arg1, {
        stats: createEmptyEntityLeadgenTaskStats()
      });
    }
    return fn3(arg1, {
      includeLeads: false
    });
  }
  function resetStaleRunningTasks() {
    const result = dbManager.listEntityLeadgenTasks({
      includeLeads: false
    });
    const result2 = Date.now();
    let flag = false;
    for (const item of result) {
      if (item.status !== "running") {
        continue;
      }
      flag = true;
      const result = (item.runs || []).map(arg1 => arg1.endedAt ? arg1 : {
        ...arg1,
        endedAt: result2,
        endReason: "app_restart"
      });
      const result3 = normalizeEntityLeadgenTask({
        ...item,
        status: "stopped",
        runs: result,
        endedAt: item.endedAt || result2,
        endReason: "app_restart",
        leads: []
      });
      dbManager.upsertEntityLeadgenTask(result3, {
        replaceLeads: false
      });
    }
    return flag;
  }
  return {
    runtime: "sqlite",
    listTasks: fn2,
    findTaskById: fn3,
    upsertTask: fn4,
    patchTask: fn5,
    deleteTasks: fn6,
    incrementStats: fn7,
    appendLeadRecords: fn8,
    listLeadRecordsPage: fn9,
    deleteLeadRecords: fn10,
    resetStaleRunningTasks: resetStaleRunningTasks,
    normalizeEntityLeadgenTask: normalizeEntityLeadgenTask
  };
}
function createEntityLeadgenTasksApi({
  userDataPath: userDataPath
}) {
  try {
    ensureSqliteReady(userDataPath);
    const dbMigration = require("./dbMigration");
    const result = dbMigration.runV4EntityLeadgenCutoverIfNeeded(userDataPath);
    if (dbManager.isEntityLeadgenRuntimeReady()) {
      return createSqliteEntityLeadgenTasksApi(userDataPath);
    }
    if (!result.ok) {
      console.warn("[EntityLeadgen] v4 迁移未成功:", result.error || "");
      const result2 = ENTITY_LEADGEN_TASKS_FILE(userDataPath);
      if (fs.existsSync(result2)) {
        console.warn("[EntityLeadgen] 继续使用 enc，待下次启动重试迁移");
        return createEncEntityLeadgenTasksApi(userDataPath);
      }
    }
    return createSqliteEntityLeadgenTasksApi(userDataPath);
  } catch (error) {
    console.warn("[EntityLeadgen] SQLite 不可用，回退 enc:", error.message);
    return createEncEntityLeadgenTasksApi(userDataPath);
  }
}
module.exports = {
  createEntityLeadgenTasksApi: createEntityLeadgenTasksApi,
  normalizeEntityLeadgenTask: normalizeEntityLeadgenTask,
  normalizeEntityLeadgenTaskForMigration: normalizeEntityLeadgenTaskForMigration,
  normalizeLeadRecord: normalizeLeadRecord,
  ensureStableEntityLeadId: ensureStableEntityLeadId,
  createEmptyEntityLeadgenTaskStats: createEmptyEntityLeadgenTaskStats,
  MAX_ENTITY_LEADGEN_DETAIL_RECORDS: 0,
  ENTITY_LEADGEN_TASKS_FILE: ENTITY_LEADGEN_TASKS_FILE,
  createCrypto: createCrypto
};
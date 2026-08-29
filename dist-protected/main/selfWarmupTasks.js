const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  buildSelfWarmupEventSeenKey
} = require("../shared/selfWarmupDedupe");
const SELF_WARMUP_TASKS_FILE = arg1 => path.join(arg1, "self_warmup_tasks.enc");
const MAX_EVENT_RECORDS = 800;
function createCrypto(arg1) {
  const result = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const result2 = Buffer.alloc(16, 0);
  const result3 = SELF_WARMUP_TASKS_FILE(arg1);
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
function createEmptySelfWarmupTaskStats() {
  return {
    checks: 0,
    eventsTotal: 0,
    notifications: 0,
    comments: 0,
    replies: 0,
    likes: 0,
    follows: 0,
    messages: 0,
    matched: 0,
    suggestions: 0,
    webhookPushed: 0,
    actionsExecuted: 0,
    lastCycleEvents: 0,
    lastCycleAt: null
  };
}
function normalizeSelfWarmupEvent(options = {}) {
  return {
    id: String(options.id || "warm_event_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(options.ts || Date.now()),
    accountId: String(options.accountId || ""),
    accountName: String(options.accountName || ""),
    source: options.source || "notification",
    eventType: options.eventType || "unknown",
    eventLabel: String(options.eventLabel || ""),
    nickname: String(options.nickname || ""),
    userUrl: String(options.userUrl || ""),
    videoUrl: String(options.videoUrl || ""),
    text: String(options.text || ""),
    timeText: String(options.timeText || options.time || ""),
    unread: !!options.unread,
    isGroupChat: !!options.isGroupChat,
    hasFollowButton: options.hasFollowButton === undefined ? false : !!options.hasFollowButton,
    matched: options.matched === undefined ? true : !!options.matched,
    matchType: options.matchType || "rule",
    judgeReason: String(options.judgeReason || ""),
    suggestedText: String(options.suggestedText || ""),
    suggestedCommentText: String(options.suggestedCommentText || ""),
    suggestedDmText: String(options.suggestedDmText || ""),
    suggestionStatus: options.suggestionStatus || "none",
    webhookStatus: options.webhookStatus || "none",
    actionStatus: options.actionStatus || "none",
    actionSummary: String(options.actionSummary || ""),
    actionErrorReason: String(options.actionErrorReason || ""),
    actionFailures: Array.isArray(options.actionFailures) ? options.actionFailures.map(arg1 => ({
      action: String(arg1?.action || ""),
      reason: String(arg1?.reason || "")
    })) : [],
    actionSkippedReasons: Array.isArray(options.actionSkippedReasons) ? options.actionSkippedReasons.map(arg1 => ({
      action: String(arg1?.action || ""),
      reason: String(arg1?.reason || "")
    })) : [],
    actionsTaken: Array.isArray(options.actionsTaken) ? options.actionsTaken.map(String) : [],
    suggestionErrorReason: String(options.suggestionErrorReason || ""),
    webhookErrorReason: String(options.webhookErrorReason || "")
  };
}
function normalizeSelfWarmupTask(options = {}) {
  const value = Array.isArray(options.runs) ? options.runs.map(arg1 => ({
    accountId: String(arg1.accountId || ""),
    nickname: String(arg1.nickname || arg1.name || ""),
    name: String(arg1.name || ""),
    personaId: arg1.personaId || "none",
    endedAt: arg1.endedAt != null ? Number(arg1.endedAt) : null,
    endReason: arg1.endReason || ""
  })).filter(arg1 => arg1.accountId) : [];
  return {
    id: String(options.id || "self_warmup_" + Date.now()),
    name: String(options.name || "自热互动"),
    status: options.status || "draft",
    createdAt: Number(options.createdAt || Date.now()),
    startedAt: options.startedAt != null ? Number(options.startedAt) : null,
    endedAt: options.endedAt != null ? Number(options.endedAt) : null,
    endReason: options.endReason || "",
    runs: value,
    configSnapshot: options.configSnapshot || null,
    stats: {
      ...createEmptySelfWarmupTaskStats(),
      ...(options.stats || {})
    },
    events: Array.isArray(options.events) ? options.events.map(normalizeSelfWarmupEvent).slice(0, MAX_EVENT_RECORDS) : [],
    remark: options.remark || ""
  };
}
function createSelfWarmupTasksApi({
  userDataPath: userDataPath
}) {
  const result = createCrypto(userDataPath);
  const {
    readTasks: readTasks,
    writeTasks: writeTasks
  } = result;
  const selfWarmupEventsStore = require("./selfWarmupEventsStore");
  try {
    selfWarmupEventsStore.runSelfWarmupEventsSqliteMigrationIfNeeded({
      readTasks: readTasks,
      writeTasks: writeTasks,
      normalizeEvent: normalizeSelfWarmupEvent
    });
  } catch (error) {
    console.error("[SelfWarmup] 明细 SQLite 迁移异常（保留 enc）:", error);
  }
  function fn() {
    if (!selfWarmupEventsStore.isReady()) {
      return false;
    }
    try {
      selfWarmupEventsStore.runSelfWarmupEventsSqliteMigrationIfNeeded({
        readTasks: readTasks,
        writeTasks: writeTasks,
        normalizeEvent: normalizeSelfWarmupEvent
      });
    } catch (error) {
      console.error("[SelfWarmup] 明细 SQLite 迁移异常（保留 enc）:", error);
      return false;
    }
    return selfWarmupEventsStore.isMigrationApplied();
  }
  function fn2(arg1) {
    const result = fn();
    writeTasks((Array.isArray(arg1) ? arg1 : []).map(arg1 => {
      const obj = {
        ...arg1
      };
      if (result) {
        obj.events = [];
      }
      return obj;
    }));
  }
  function fn3(arg1) {
    if (!arg1) {
      return null;
    }
    if (!fn()) {
      const value = Array.isArray(arg1.events) ? arg1.events : [];
      return {
        ...arg1,
        eventCount: value.length,
        hitCount: value.filter(arg1 => arg1?.matched !== false).length
      };
    }
    return {
      ...arg1,
      events: [],
      eventCount: Number(arg1.eventCount) || 0,
      hitCount: Number(arg1.hitCount) || 0
    };
  }
  function fn4(arg1) {
    if (!fn()) {
      return arg1.map(fn3);
    }
    const result = selfWarmupEventsStore.countEventsByTask();
    return arg1.map(arg1 => {
      const local = result.get(String(arg1.id)) || {
        eventCount: 0,
        hitCount: 0
      };
      return fn3({
        ...arg1,
        events: [],
        eventCount: local.eventCount,
        hitCount: local.hitCount
      });
    });
  }
  function listTasks() {
    return fn4(readTasks().map(normalizeSelfWarmupTask).sort((arg1, arg2) => (arg2.createdAt || 0) - (arg1.createdAt || 0)));
  }
  function findTaskById(arg1) {
    const result = readTasks().map(normalizeSelfWarmupTask).find(arg12 => arg12.id === arg1);
    if (!result) {
      return null;
    }
    return fn4([result])[0];
  }
  function upsertTask(arg1) {
    const result = readTasks().map(normalizeSelfWarmupTask);
    const result2 = normalizeSelfWarmupTask(arg1);
    const result3 = result.findIndex(arg1 => arg1.id === result2.id);
    if (result3 === -1) {
      result.unshift(result2);
      if (fn() && Array.isArray(arg1?.events) && arg1.events.length) {
        selfWarmupEventsStore.upsertEvents(result2.id, arg1.events, {
          normalizeEvent: normalizeSelfWarmupEvent
        });
      }
    } else {
      const obj = {
        ...result[result3],
        ...result2,
        id: result2.id
      };
      if (!Array.isArray(arg1.events) && !fn()) {
        obj.events = result[result3].events;
      }
      result[result3] = normalizeSelfWarmupTask(obj);
    }
    fn2(result);
    return findTaskById(result2.id);
  }
  function patchTask(arg1, options = {}) {
    const result = readTasks().map(normalizeSelfWarmupTask);
    const result2 = result.findIndex(arg12 => arg12.id === arg1);
    if (result2 === -1) {
      return null;
    }
    const {
      events: events,
      ...local
    } = options || {};
    const obj = {
      ...result[result2],
      ...local,
      id: arg1
    };
    if (!fn() && Object.prototype.hasOwnProperty.call(options || {}, "events")) {
      obj.events = events;
    }
    result[result2] = normalizeSelfWarmupTask(obj);
    fn2(result);
    if (fn() && Object.prototype.hasOwnProperty.call(options || {}, "events")) {
      selfWarmupEventsStore.deleteEvents(arg1, {
        clearAll: true
      });
      if (Array.isArray(events) && events.length) {
        selfWarmupEventsStore.upsertEvents(arg1, events, {
          normalizeEvent: normalizeSelfWarmupEvent
        });
      }
    }
    return findTaskById(arg1);
  }
  function deleteTasks(list = []) {
    const set = new Set(Array.isArray(list) ? list : [list]);
    const result = readTasks().filter(arg1 => !set.has(arg1.id));
    fn2(result);
    if (fn()) {
      set.forEach(arg1 => selfWarmupEventsStore.deleteAllForTask(arg1));
    }
    return true;
  }
  function incrementStats(arg1, options = {}) {
    const result = findTaskById(arg1);
    if (!result) {
      return null;
    }
    const obj = {
      ...createEmptySelfWarmupTaskStats(),
      ...(result.stats || {})
    };
    Object.keys(createEmptySelfWarmupTaskStats()).forEach(arg1 => {
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
    if (options.lastCycleEvents != null) {
      obj.lastCycleEvents = Number(options.lastCycleEvents);
    }
    return patchTask(arg1, {
      stats: obj
    });
  }
  function appendEventRecord(arg1, options = {}) {
    const result = normalizeSelfWarmupEvent(options);
    if (fn()) {
      if (!findTaskById(arg1)) {
        return null;
      }
      selfWarmupEventsStore.upsertEvents(arg1, [result], {
        normalizeEvent: normalizeSelfWarmupEvent
      });
      return findTaskById(arg1);
    }
    const result2 = readTasks().map(normalizeSelfWarmupTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    const result4 = (result2[result3].events || []).map(normalizeSelfWarmupEvent);
    const result5 = buildSelfWarmupEventSeenKey(result);
    const result6 = result4.findIndex(arg1 => buildSelfWarmupEventSeenKey(arg1) === result5);
    if (result6 >= 0) {
      result4[result6] = normalizeSelfWarmupEvent({
        ...result4[result6],
        ...result,
        id: result4[result6].id || result.id
      });
      result2[result3] = normalizeSelfWarmupTask({
        ...result2[result3],
        events: result4.slice(0, MAX_EVENT_RECORDS)
      });
    } else {
      result2[result3] = normalizeSelfWarmupTask({
        ...result2[result3],
        events: [result, ...result4].slice(0, MAX_EVENT_RECORDS)
      });
    }
    fn2(result2);
    return fn3(result2[result3]);
  }
  function deleteEventRecords(arg1, options = {}) {
    const result = findTaskById(arg1);
    if (!result) {
      return null;
    }
    if (fn()) {
      const {
        rows: rows
      } = selfWarmupEventsStore.deleteEvents(arg1, options);
      return {
        ...findTaskById(arg1),
        _removedEvents: rows
      };
    }
    const {
      eventIds = [],
      clearAll = false
    } = options;
    const result2 = readTasks().map(normalizeSelfWarmupTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    const local = result2[result3].events || [];
    let local2 = local;
    let list = [];
    if (clearAll) {
      list = local;
      local2 = [];
    } else {
      const set = new Set(Array.isArray(eventIds) ? eventIds : [eventIds]);
      if (set.size === 0) {
        return fn3(result2[result3]);
      }
      list = local.filter(arg1 => set.has(arg1.id));
      local2 = local.filter(arg1 => !set.has(arg1.id));
    }
    result2[result3] = normalizeSelfWarmupTask({
      ...result2[result3],
      events: local2
    });
    fn2(result2);
    return {
      ...fn3(result2[result3]),
      _removedEvents: list
    };
  }
  function listEventRecordsPage(arg1, options = {}) {
    if (fn()) {
      return selfWarmupEventsStore.listEventsPage(arg1, options);
    }
    const result = readTasks().map(normalizeSelfWarmupTask).find(arg12 => arg12.id === arg1);
    let value = Array.isArray(result?.events) ? result.events : [];
    const result2 = String(options.result || "all");
    if (result2 === "hit") {
      value = value.filter(arg1 => arg1?.matched !== false);
    }
    if (result2 === "miss") {
      value = value.filter(arg1 => arg1?.matched === false);
    }
    const result3 = String(options.keyword || "").trim().toLowerCase();
    if (result3) {
      value = value.filter(arg1 => {
        const result = [arg1.nickname, arg1.text, arg1.eventLabel, arg1.judgeReason, arg1.suggestedText, arg1.accountName, arg1.timeText, arg1.actionErrorReason, arg1.suggestionErrorReason, arg1.webhookErrorReason].map(arg1 => String(arg1 || "").toLowerCase()).join(" ");
        return result.includes(result3);
      });
    }
    const value2 = Array.isArray(result?.events) ? result.events : [];
    const result4 = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const result5 = Math.max(0, Number(options.offset) || 0);
    return {
      items: value.slice(result5, result5 + result4),
      total: value.length,
      counts: {
        all: value2.length,
        hit: value2.filter(arg1 => arg1?.matched !== false).length,
        miss: value2.filter(arg1 => arg1?.matched === false).length
      }
    };
  }
  function listEventsForUser(arg1, options = {}) {
    if (fn()) {
      return selfWarmupEventsStore.listEventsForUser(arg1, options);
    }
    const result = readTasks().map(normalizeSelfWarmupTask).find(arg12 => arg12.id === arg1);
    const result2 = String(options.nickname || "").trim().toLowerCase();
    const result3 = String(options.userUrl || "").trim();
    return (result?.events || []).filter(arg1 => {
      const result = String(arg1.nickname || "").trim().toLowerCase();
      const local = result2 && result && result2 === result;
      const local2 = result3 && String(arg1.userUrl || "").includes(result3.split("?")[0]);
      return local || local2;
    });
  }
  function resetStaleRunningTasks() {
    const result = readTasks().map(normalizeSelfWarmupTask);
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
      return normalizeSelfWarmupTask({
        ...arg1,
        status: "stopped",
        runs: result,
        endedAt: arg1.endedAt || result2,
        endReason: "app_restart"
      });
    });
    if (flag) {
      fn2(result3);
    }
    return flag;
  }
  return {
    listTasks: listTasks,
    findTaskById: findTaskById,
    upsertTask: upsertTask,
    patchTask: patchTask,
    deleteTasks: deleteTasks,
    incrementStats: incrementStats,
    appendEventRecord: appendEventRecord,
    deleteEventRecords: deleteEventRecords,
    listEventRecordsPage: listEventRecordsPage,
    listEventsForUser: listEventsForUser,
    resetStaleRunningTasks: resetStaleRunningTasks,
    normalizeSelfWarmupTask: normalizeSelfWarmupTask
  };
}
module.exports = {
  createSelfWarmupTasksApi: createSelfWarmupTasksApi,
  normalizeSelfWarmupTask: normalizeSelfWarmupTask,
  createEmptySelfWarmupTaskStats: createEmptySelfWarmupTaskStats,
  createCrypto: createCrypto
};
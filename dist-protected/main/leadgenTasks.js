const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  leadHasAnyTouch
} = require("../shared/leadPoolFilters");
const LEADGEN_TASKS_FILE = arg1 => path.join(arg1, "leadgen_tasks.enc");
const MIGRATION_FLAG_KEY = "leadgen_tasks_migrated_v1";
function createCrypto(arg1) {
  const result = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const result2 = Buffer.alloc(16, 0);
  const result3 = LEADGEN_TASKS_FILE(arg1);
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
  function fn3(arg1) {
    return fn(arg1, []);
  }
  function fn4() {
    return fn(result3, []);
  }
  function fn5(arg1) {
    fn2(result3, arg1);
  }
  return {
    filePath: result3,
    readTasks: fn4,
    writeTasks: fn5,
    readHistory: fn3,
    readJsonFile: fn
  };
}
function createEmptyTaskStats() {
  return {
    videos: 0,
    likes: 0,
    replies: 0,
    videoComments: 0,
    profileComments: 0,
    follows: 0,
    messages: 0,
    leadsTotal: 0
  };
}
function normalizeTouchCounts(arg1) {
  const obj = {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0,
    videoComment: 0
  };
  if (!arg1 || typeof arg1 !== "object") {
    return obj;
  }
  Object.keys(obj).forEach(arg12 => {
    const result = Number(arg1[arg12]);
    obj[arg12] = Number.isFinite(result) && result > 0 ? Math.floor(result) : 0;
  });
  return obj;
}
function aggregateStatsFromItems(list = [], options = {}) {
  const result = createEmptyTaskStats();
  result.videos = Number(options.videoTotal) || 0;
  result.leadsTotal = Array.isArray(list) ? list.length : 0;
  for (const item of list || []) {
    const result2 = normalizeTouchCounts(item.touchCounts);
    const result3 = Object.values(result2).some(arg1 => arg1 > 0);
    if (result3) {
      result.likes += result2.like;
      result.replies += result2.reply;
      result.profileComments += result2.profileComment;
      result.videoComments += result2.videoComment;
      result.follows += result2.follow;
      result.messages += result2.message;
      continue;
    }
    if (item.liked || item.actions?.liked) {
      result.likes += 1;
    }
    if (item.actions?.profileWorkCommented) {
      result.profileComments += 1;
    } else if (item.replied || item.actions?.replied) {
      result.replies += 1;
    }
    if (item.followed || item.actions?.followed) {
      result.follows += 1;
    }
    if (item.messaged || item.actions?.messaged) {
      result.messages += 1;
    }
    if (item.videoCommented || item.actions?.videoCommented) {
      result.videoComments += 1;
    }
  }
  return result;
}
function aggregateAccountStatsFromItems(list = [], list2 = []) {
  const map = new Map();
  const local = (arg1, options = {}) => {
    if (!map.has(arg1)) {
      map.set(arg1, {
        accountId: String(options.accountId || ""),
        accountName: String(options.accountName || options.nickname || options.name || ""),
        automationTaskId: String(options.automationTaskId || ""),
        ...createEmptyTaskStats()
      });
    }
    return map.get(arg1);
  };
  for (const item of list2 || []) {
    const result = String(item.automationTaskId || item.accountId || "").trim();
    if (!result) {
      continue;
    }
    const result2 = local(result, {
      accountId: item.accountId,
      accountName: item.nickname || item.name,
      automationTaskId: item.automationTaskId
    });
    const local2 = Number(item.progress?.videos?.done) || 0;
    if (local2 > result2.videos) {
      result2.videos = local2;
    }
  }
  for (const item of list || []) {
    const result = String(item.taskId || item.automationTaskId || "").trim();
    const result2 = String(item.accountId || "").trim();
    const result3 = String(item.accountName || item.accountNickname || "").trim();
    const local2 = result || result2 || result3 || "unknown";
    const result4 = local(local2, {
      accountId: result2,
      accountName: result3,
      automationTaskId: result
    });
    if (!result4.accountId && result2) {
      result4.accountId = result2;
    }
    if (!result4.accountName && result3) {
      result4.accountName = result3;
    }
    if (!result4.automationTaskId && result) {
      result4.automationTaskId = result;
    }
    result4.leadsTotal += 1;
    const result5 = normalizeTouchCounts(item.touchCounts);
    const result6 = Object.values(result5).some(arg1 => arg1 > 0);
    if (result6) {
      result4.likes += result5.like;
      result4.replies += result5.reply;
      result4.profileComments += result5.profileComment;
      result4.videoComments += result5.videoComment;
      result4.follows += result5.follow;
      result4.messages += result5.message;
    } else {
      if (item.liked || item.actions?.liked) {
        result4.likes += 1;
      }
      if (item.actions?.profileWorkCommented) {
        result4.profileComments += 1;
      } else if (item.replied || item.actions?.replied) {
        result4.replies += 1;
      }
      if (item.followed || item.actions?.followed) {
        result4.follows += 1;
      }
      if (item.messaged || item.actions?.messaged) {
        result4.messages += 1;
      }
      if (item.videoCommented || item.actions?.videoCommented) {
        result4.videoComments += 1;
      }
    }
  }
  return Array.from(map.values()).sort((arg1, arg2) => arg2.leadsTotal + arg2.likes + arg2.replies + arg2.follows + arg2.messages - (arg1.leadsTotal + arg1.likes + arg1.replies + arg1.follows + arg1.messages));
}
function normalizeLeadgenTask(options = {}) {
  const value = Array.isArray(options.runs) ? options.runs.map(arg1 => ({
    accountId: String(arg1.accountId || ""),
    automationTaskId: String(arg1.automationTaskId || arg1.taskId || ""),
    nickname: String(arg1.nickname || arg1.name || ""),
    name: String(arg1.name || ""),
    keywords: String(arg1.keywords || ""),
    personaId: arg1.personaId || "none",
    endedAt: arg1.endedAt != null ? Number(arg1.endedAt) : null,
    endReason: String(arg1.endReason || ""),
    progress: arg1.progress && typeof arg1.progress === "object" ? arg1.progress : null,
    stats: arg1.stats && typeof arg1.stats === "object" ? {
      ...createEmptyTaskStats(),
      ...arg1.stats
    } : null
  })).filter(arg1 => arg1.automationTaskId) : [];
  return {
    id: String(options.id || options.taskId || "leadgen_" + Date.now()),
    name: String(options.name || options.taskName || "获客任务"),
    status: options.status || "completed",
    legacy: !!options.legacy,
    createdAt: Number(options.createdAt || options.timestamp || Date.now()),
    startedAt: options.startedAt != null ? Number(options.startedAt) : null,
    endedAt: options.endedAt != null ? Number(options.endedAt) : null,
    endReason: options.endReason || "",
    runs: value,
    configSnapshot: options.configSnapshot || null,
    stats: {
      ...createEmptyTaskStats(),
      ...(options.stats || {})
    },
    remark: options.remark || ""
  };
}
function buildLegacyTaskFromHistory(options = {}) {
  const result = String(options.taskId || "");
  if (!result) {
    return null;
  }
  const result2 = aggregateStatsFromItems(options.items, options.stats || {});
  return normalizeLeadgenTask({
    id: result,
    name: options.taskName || options.remark || "历史获客任务",
    status: "completed",
    legacy: true,
    createdAt: options.timestamp || Date.now(),
    startedAt: options.timestamp || Date.now(),
    endedAt: options.timestamp || Date.now(),
    runs: [{
      accountId: "legacy",
      automationTaskId: result,
      nickname: options.accountName || "未知账号",
      name: options.accountName || ""
    }],
    configSnapshot: null,
    stats: result2,
    remark: options.remark || ""
  });
}
function createLeadgenTasksApi({
  userDataPath: userDataPath,
  historyFile: historyFile,
  store: store,
  listLeadsByAutomationTaskIds = null,
  queryLeadsByAutomationTaskIdsPage = null,
  isLeadsRuntimeReady = null
} = {}) {
  const result = createCrypto(userDataPath);
  const {
    readTasks: readTasks,
    writeTasks: writeTasks,
    readHistory: readHistory
  } = result;
  function fn() {
    try {
      if (typeof isLeadsRuntimeReady === "function" && !isLeadsRuntimeReady()) {
        return false;
      }
      return typeof listLeadsByAutomationTaskIds === "function" || typeof queryLeadsByAutomationTaskIdsPage === "function";
    } catch (error) {
      return false;
    }
  }
  function fn2(list = []) {
    const result = [...list].filter(Boolean);
    if (!result.length) {
      return {
        items: [],
        videoTotal: 0,
        source: "none"
      };
    }
    if (fn() && typeof listLeadsByAutomationTaskIds === "function") {
      try {
        const local = listLeadsByAutomationTaskIds(result, {
          limit: 20000,
          includeVideoCards: false
        }) || [];
        return {
          items: local,
          videoTotal: 0,
          source: "sqlite"
        };
      } catch (error) {
        console.warn("[LeadgenTasks] SQLite 拉取任务线索失败，回退 enc:", error?.message || error);
      }
    }
    const result2 = readHistory(historyFile);
    const set = new Set(result);
    const result3 = result2.filter(arg1 => set.has(arg1.taskId));
    const result4 = result3.flatMap(arg1 => arg1.items || []);
    const result5 = result3.reduce((arg1, arg2) => arg1 + (Number(arg2.stats?.videoTotal) || 0), 0);
    return {
      items: result4,
      videoTotal: result5,
      source: "enc"
    };
  }
  function fn3() {
    if (store.get(MIGRATION_FLAG_KEY)) {
      return readTasks();
    }
    const result = readTasks();
    const set = new Set();
    result.forEach(arg1 => {
      (arg1.runs || []).forEach(arg1 => {
        if (arg1.automationTaskId) {
          set.add(arg1.automationTaskId);
        }
      });
      if (arg1.legacy && arg1.id) {
        set.add(arg1.id);
      }
    });
    const result2 = readHistory(historyFile);
    let flag = false;
    result2.forEach(arg1 => {
      if (!arg1?.taskId || set.has(arg1.taskId)) {
        return;
      }
      const result2 = buildLegacyTaskFromHistory(arg1);
      if (!result2) {
        return;
      }
      result.unshift(result2);
      set.add(arg1.taskId);
      flag = true;
    });
    if (flag) {
      writeTasks(result);
    }
    store.set(MIGRATION_FLAG_KEY, true);
    return result.map(normalizeLeadgenTask);
  }
  function fn4() {
    const result = fn3();
    return result.map(normalizeLeadgenTask).sort((arg1, arg2) => (arg2.createdAt || 0) - (arg1.createdAt || 0));
  }
  function fn5(arg1) {
    return fn4().find(arg12 => arg12.id === arg1) || null;
  }
  function findTaskByAutomationTaskId(arg1) {
    return fn4().find(arg12 => (arg12.runs || []).some(arg12 => arg12.automationTaskId === arg1)) || null;
  }
  function upsertTask(arg1) {
    const result = readTasks().map(normalizeLeadgenTask);
    const result2 = normalizeLeadgenTask(arg1);
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
  function patchTask(arg1, options = {}) {
    const result = readTasks().map(normalizeLeadgenTask);
    const result2 = result.findIndex(arg12 => arg12.id === arg1);
    if (result2 === -1) {
      return null;
    }
    result[result2] = normalizeLeadgenTask({
      ...result[result2],
      ...options,
      id: arg1
    });
    writeTasks(result);
    return result[result2];
  }
  function patchTaskByAutomationTaskId(arg1, options = {}) {
    const result = findTaskByAutomationTaskId(arg1);
    if (!result) {
      return null;
    }
    return patchTask(result.id, options);
  }
  function deleteTasks(list = []) {
    const set = new Set(Array.isArray(list) ? list : [list]);
    const result = readTasks().filter(arg1 => !set.has(arg1.id));
    writeTasks(result);
    return true;
  }
  function fn11(arg1, num = 0) {
    const result = (arg1.runs || []).reduce((arg1, arg2) => arg1 + (Number(arg2.progress?.videos?.done) || 0), 0);
    return Math.max(Number(num) || 0, result);
  }
  function fn12(list = [], list2 = []) {
    const map = new Map();
    const map2 = new Map();
    for (const item of list2 || []) {
      if (item.automationTaskId) {
        map.set(String(item.automationTaskId), item);
      }
      if (item.accountId) {
        map2.set(String(item.accountId), item);
      }
    }
    return (list || []).map(arg1 => {
      const local = map.get(String(arg1.automationTaskId || "")) || map2.get(String(arg1.accountId || ""));
      if (!local) {
        return arg1;
      }
      const obj = {
        ...createEmptyTaskStats(),
        ...local
      };
      const local2 = Number(arg1.progress?.videos?.done) || 0;
      if (local2 > obj.videos) {
        obj.videos = local2;
      }
      return {
        ...arg1,
        stats: obj
      };
    });
  }
  function refreshTaskStatsFromHistory(arg1) {
    const result = fn5(arg1);
    if (!result) {
      return null;
    }
    const result2 = (result.runs || []).map(arg1 => arg1.automationTaskId).filter(Boolean);
    const {
      items: items,
      videoTotal: videoTotal
    } = fn2(result2);
    const result3 = aggregateStatsFromItems(items, {
      videoTotal: fn11(result, videoTotal)
    });
    const result4 = aggregateAccountStatsFromItems(items, result.runs || []);
    const result5 = fn12(result.runs || [], result4);
    return patchTask(arg1, {
      stats: result3,
      runs: result5
    });
  }
  function resetStaleRunningTasks() {
    const result = readTasks().map(normalizeLeadgenTask);
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
      return normalizeLeadgenTask({
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
  function finalizeTaskRun(arg1, options = {}) {
    const result = findTaskByAutomationTaskId(arg1);
    if (!result) {
      return null;
    }
    const local = options.progress || {};
    const local2 = Number(local.videos?.done) || 0;
    const result2 = (result.runs || []).map(arg12 => {
      if (arg12.automationTaskId !== arg1) {
        return arg12;
      }
      return {
        ...arg12,
        endedAt: Date.now(),
        endReason: options.reason || "completed",
        progress: local
      };
    });
    const obj = {
      runs: result2
    };
    const result3 = patchTask(result.id, obj);
    const result4 = refreshTaskStatsFromHistory(result3?.id || result.id);
    if (result4) {
      obj.stats = {
        ...result4.stats
      };
      obj.runs = result4.runs;
      if (local2 > 0) {
        obj.stats.videos = Math.max(obj.stats.videos || 0, local2);
      }
    }
    const local3 = obj.runs || result2;
    const result5 = local3.some(arg1 => !arg1.endedAt);
    if (!result5) {
      const set = new Set(["manual_stop", "schedule_preempted", "schedule_window_end", "app_restart"]);
      obj.status = set.has(options.reason) ? "stopped" : "completed";
      obj.endedAt = Date.now();
      obj.endReason = options.reason || "completed";
    } else {
      obj.status = "running";
    }
    return patchTask(result.id, obj);
  }
  function getTaskDetail(arg1) {
    const result = fn5(arg1);
    if (!result) {
      return null;
    }
    const result2 = (result.runs || []).map(arg1 => arg1.automationTaskId).filter(Boolean);
    const result3 = listLeadRecordsPage(arg1, {
      offset: 0,
      limit: 1,
      touch: "all"
    });
    const result4 = (result.runs || []).map(arg1 => ({
      accountId: arg1.accountId,
      accountName: arg1.nickname || arg1.name || arg1.accountId,
      automationTaskId: arg1.automationTaskId,
      ...createEmptyTaskStats(),
      ...(arg1.stats || {}),
      videos: Number(arg1.stats?.videos) || Number(arg1.progress?.videos?.done) || 0
    }));
    return {
      task: result,
      leads: [],
      accountStats: result4,
      source: fn() ? "sqlite" : "enc",
      leadTotal: Number(result3.counts?.all) || Number(result3.total) || 0,
      automationIds: result2
    };
  }
  function listLeadRecordsPage(arg1, options = {}) {
    const obj = {
      items: [],
      total: 0,
      counts: {
        all: 0,
        touched: 0,
        untouched: 0
      }
    };
    const result = fn5(arg1);
    if (!result) {
      return obj;
    }
    const result2 = (result.runs || []).map(arg1 => arg1.automationTaskId).filter(Boolean);
    const result3 = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const result4 = Math.max(0, Number(options.offset) || 0);
    const result5 = String(options.touch || "all");
    if (fn() && typeof queryLeadsByAutomationTaskIdsPage === "function") {
      try {
        return queryLeadsByAutomationTaskIdsPage(result2, {
          offset: result4,
          limit: result3,
          touch: result5,
          includeVideoCards: false
        });
      } catch (error) {
        console.warn("[LeadgenTasks] 明细分页失败，回退 enc:", error?.message || error);
      }
    }
    const {
      items: items
    } = fn2(result2);
    let result6 = items.slice().sort((arg1, arg2) => Number(arg2.timestamp || arg2.capturedAt || 0) - Number(arg1.timestamp || arg1.capturedAt || 0));
    const value = result6.length;
    const value2 = result6.filter(arg1 => leadHasAnyTouch(arg1)).length;
    if (result5 === "touched") {
      result6 = result6.filter(arg1 => leadHasAnyTouch(arg1));
    }
    if (result5 === "untouched") {
      result6 = result6.filter(arg1 => !leadHasAnyTouch(arg1));
    }
    return {
      items: result6.slice(result4, result4 + result3),
      total: result6.length,
      counts: {
        all: value,
        touched: value2,
        untouched: Math.max(0, value - value2)
      }
    };
  }
  return {
    listTasks: fn4,
    findTaskById: fn5,
    findTaskByAutomationTaskId: findTaskByAutomationTaskId,
    upsertTask: upsertTask,
    patchTask: patchTask,
    patchTaskByAutomationTaskId: patchTaskByAutomationTaskId,
    deleteTasks: deleteTasks,
    refreshTaskStatsFromHistory: refreshTaskStatsFromHistory,
    finalizeTaskRun: finalizeTaskRun,
    getTaskDetail: getTaskDetail,
    listLeadRecordsPage: listLeadRecordsPage,
    resetStaleRunningTasks: resetStaleRunningTasks,
    aggregateStatsFromItems: aggregateStatsFromItems,
    aggregateAccountStatsFromItems: aggregateAccountStatsFromItems,
    normalizeLeadgenTask: normalizeLeadgenTask,
    createEmptyTaskStats: createEmptyTaskStats
  };
}
module.exports = {
  createLeadgenTasksApi: createLeadgenTasksApi,
  aggregateStatsFromItems: aggregateStatsFromItems,
  aggregateAccountStatsFromItems: aggregateAccountStatsFromItems,
  normalizeLeadgenTask: normalizeLeadgenTask,
  createEmptyTaskStats: createEmptyTaskStats
};
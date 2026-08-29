const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const {
  MAX_MONITOR_TASK_CYCLES,
  normalizeMonitorTaskCycle,
  nextCycleRound,
  closeOpenCycles,
  prependCycle,
  addCycleMetrics,
  mergeCycleMetrics
} = require("./monitorTaskCycles");
const {
  MAX_MONITOR_TASK_VIDEO_COMMENTS,
  normalizeMonitorVideoCommentRecord
} = require("./monitorTaskVideoComments");
const MONITOR_TASKS_FILE = arg1 => path.join(arg1, "monitor_tasks.enc");
function createCrypto(arg1) {
  const result = crypto.scryptSync("huoke-radar-secret-v1", "salt", 32);
  const result2 = Buffer.alloc(16, 0);
  const result3 = MONITOR_TASKS_FILE(arg1);
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
  function fn3() {
    return fn(result3, []);
  }
  function fn4(arg1) {
    fn2(result3, arg1);
  }
  return {
    filePath: result3,
    readTasks: fn3,
    writeTasks: fn4
  };
}
function createEmptyMonitorTaskStats() {
  return {
    checks: 0,
    newWorks: 0,
    commentsTotal: 0,
    newComments: 0,
    matched: 0,
    likes: 0,
    replies: 0,
    follows: 0,
    followRequests: 0,
    messages: 0,
    lastCycleComments: 0,
    lastCycleAt: null
  };
}
function formatMonitorIntentionLabel(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = result.toLowerCase();
  if (result2 === "high") {
    return "高意向";
  }
  if (result2 === "medium" || result2 === "mid") {
    return "中意向";
  }
  if (result2 === "low") {
    return "低意向";
  }
  return result;
}
function normalizeMatchRecord(options = {}) {
  return {
    id: String(options.id || "match_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(options.ts || Date.now()),
    accountId: String(options.accountId || ""),
    accountName: String(options.accountName || ""),
    videoUrl: String(options.videoUrl || ""),
    videoTitle: String(options.videoTitle || ""),
    nickname: String(options.nickname || ""),
    userUrl: String(options.userUrl || ""),
    commentText: String(options.commentText || ""),
    matchType: options.matchType || "keyword",
    aiIntention: formatMonitorIntentionLabel(options.aiIntention || ""),
    judgeReason: String(options.judgeReason || ""),
    excludedCommentKeyword: String(options.excludedCommentKeyword || ""),
    matched: options.matched === undefined ? true : !!options.matched,
    webhookStatus: options.webhookStatus || "none",
    webhookError: String(options.webhookError || ""),
    followStatus: options.followStatus || "none",
    followError: String(options.followError || ""),
    followErrorCode: String(options.followErrorCode || ""),
    followDiagnostic: String(options.followDiagnostic || ""),
    followRequested: !!options.followRequested,
    followRequestSent: !!options.followRequestSent,
    followIsPrivate: !!options.followIsPrivate,
    replyContent: String(options.replyContent || ""),
    replyStatus: options.replyStatus || "none",
    likeStatus: options.likeStatus || "none",
    likeError: String(options.likeError || ""),
    replyError: String(options.replyError || ""),
    replyErrorCode: String(options.replyErrorCode || ""),
    replyDiagnostic: String(options.replyDiagnostic || ""),
    replyTarget: ["comment", "profile_first"].includes(String(options.replyTarget || "")) ? String(options.replyTarget) : "",
    profileCommentStatus: options.profileCommentStatus || "none",
    profileCommentError: String(options.profileCommentError || ""),
    profileCommentErrorCode: String(options.profileCommentErrorCode || ""),
    dmContent: String(options.dmContent || ""),
    dmStatus: options.dmStatus || "none"
  };
}
function normalizeMonitorTaskConfig(options = {}) {
  if (!options || typeof options !== "object") {
    return null;
  }
  const obj = {
    ...options
  };
  if (!Array.isArray(obj.videoUrls)) {
    obj.videoUrls = [];
  }
  if (!Array.isArray(obj.authorUrls)) {
    obj.authorUrls = [];
  }
  if (!Array.isArray(obj.selectedAccounts)) {
    obj.selectedAccounts = [];
  }
  const value = Array.isArray(obj.monitorTargetTypes) ? obj.monitorTargetTypes.filter(arg1 => arg1 === "video" || arg1 === "author") : [];
  const set = new Set();
  if (value.length > 0) {
    value.forEach(arg1 => set.add(arg1));
  } else {
    if ((obj.videoUrls || []).some(arg1 => arg1?.url)) {
      set.add("video");
    }
    if ((obj.authorUrls || []).some(arg1 => arg1?.url)) {
      set.add("author");
    }
    if (set.size === 0) {
      set.add("video");
    }
  }
  obj.monitorTargetTypes = [...set];
  return obj;
}
function normalizeMonitorTask(options = {}) {
  const value = Array.isArray(options.runs) ? options.runs.map(arg1 => ({
    accountId: String(arg1.accountId || ""),
    nickname: String(arg1.nickname || arg1.name || ""),
    name: String(arg1.name || ""),
    personaId: arg1.personaId || "none",
    endedAt: arg1.endedAt != null ? Number(arg1.endedAt) : null,
    endReason: arg1.endReason || ""
  })).filter(arg1 => arg1.accountId) : [];
  return {
    id: String(options.id || "monitor_" + Date.now()),
    name: String(options.name || "监控任务"),
    status: options.status || "draft",
    createdAt: Number(options.createdAt || Date.now()),
    startedAt: options.startedAt != null ? Number(options.startedAt) : null,
    endedAt: options.endedAt != null ? Number(options.endedAt) : null,
    endReason: options.endReason || "",
    runs: value,
    configSnapshot: options.configSnapshot ? normalizeMonitorTaskConfig(options.configSnapshot) : null,
    stats: {
      ...createEmptyMonitorTaskStats(),
      ...(options.stats || {})
    },
    matches: Array.isArray(options.matches) ? options.matches.map(normalizeMatchRecord) : [],
    cycles: Array.isArray(options.cycles) ? options.cycles.map(normalizeMonitorTaskCycle).slice(0, MAX_MONITOR_TASK_CYCLES) : [],
    videoComments: Array.isArray(options.videoComments) ? options.videoComments.map(normalizeMonitorVideoCommentRecord).slice(0, MAX_MONITOR_TASK_VIDEO_COMMENTS) : [],
    remark: options.remark || ""
  };
}
function createMonitorTasksApi({
  userDataPath: userDataPath
}) {
  const result = createCrypto(userDataPath);
  const {
    readTasks: readTasks,
    writeTasks: writeTasks
  } = result;
  const monitorTaskDetailsStore = require("./monitorTaskDetailsStore");
  try {
    monitorTaskDetailsStore.runMonitorTaskDetailsSqliteMigrationIfNeeded({
      readTasks: readTasks,
      writeTasks: writeTasks
    });
  } catch (error) {
    console.error("[MonitorTasks] 明细 SQLite 迁移异常（保留 enc）:", error);
  }
  function fn() {
    if (!monitorTaskDetailsStore.isReady()) {
      return false;
    }
    try {
      monitorTaskDetailsStore.runMonitorTaskDetailsSqliteMigrationIfNeeded({
        readTasks: readTasks,
        writeTasks: writeTasks
      });
    } catch (error) {
      console.error("[MonitorTasks] 明细 SQLite 迁移异常（保留 enc）:", error);
      return false;
    }
    return monitorTaskDetailsStore.isMigrationApplied();
  }
  function fn2(arg1) {
    const result = fn();
    writeTasks((Array.isArray(arg1) ? arg1 : []).map(arg1 => {
      const obj = {
        ...arg1
      };
      if (result) {
        obj.matches = [];
        obj.cycles = [];
        obj.videoComments = [];
      }
      return obj;
    }));
  }
  function fn3(arg1) {
    if (!arg1) {
      return null;
    }
    if (!fn()) {
      const value = Array.isArray(arg1.matches) ? arg1.matches : [];
      const value2 = Array.isArray(arg1.cycles) ? arg1.cycles : [];
      const value3 = Array.isArray(arg1.videoComments) ? arg1.videoComments : [];
      return {
        ...arg1,
        matchCount: value.length,
        hitCount: value.filter(arg1 => arg1?.matched !== false).length,
        cycleCount: value2.length,
        videoCommentCount: value3.length
      };
    }
    return {
      ...arg1,
      matches: [],
      cycles: [],
      videoComments: [],
      matchCount: Number(arg1.matchCount) || 0,
      hitCount: Number(arg1.hitCount) || 0,
      cycleCount: Number(arg1.cycleCount) || 0,
      videoCommentCount: Number(arg1.videoCommentCount) || 0
    };
  }
  function fn4(arg1) {
    if (!fn()) {
      return arg1.map(fn3);
    }
    const result = monitorTaskDetailsStore.countMatchesByTask();
    const result2 = monitorTaskDetailsStore.countCyclesByTask();
    const result3 = monitorTaskDetailsStore.countVideoCommentsByTask();
    return arg1.map(arg1 => {
      const local = result.get(String(arg1.id)) || {
        matchCount: 0,
        hitCount: 0
      };
      return fn3({
        ...arg1,
        matches: [],
        cycles: [],
        videoComments: [],
        matchCount: local.matchCount,
        hitCount: local.hitCount,
        cycleCount: result2.get(String(arg1.id)) || 0,
        videoCommentCount: result3.get(String(arg1.id)) || 0
      });
    });
  }
  function listTasks() {
    return fn4(readTasks().map(normalizeMonitorTask).sort((arg1, arg2) => (arg2.createdAt || 0) - (arg1.createdAt || 0)));
  }
  function findTaskById(arg1) {
    const result = readTasks().map(normalizeMonitorTask).find(arg12 => arg12.id === arg1);
    if (!result) {
      return null;
    }
    return fn4([result])[0];
  }
  function upsertTask(arg1) {
    const result = readTasks().map(normalizeMonitorTask);
    const result2 = normalizeMonitorTask(arg1);
    const result3 = result.findIndex(arg1 => arg1.id === result2.id);
    if (result3 === -1) {
      result.unshift(result2);
      if (fn()) {
        if (Array.isArray(arg1?.matches) && arg1.matches.length) {
          monitorTaskDetailsStore.appendMatches(result2.id, arg1.matches.map(normalizeMatchRecord));
        }
        if (Array.isArray(arg1?.cycles) && arg1.cycles.length) {
          arg1.cycles.forEach(arg1 => monitorTaskDetailsStore.upsertCycle(result2.id, arg1));
        }
        if (Array.isArray(arg1?.videoComments) && arg1.videoComments.length) {
          monitorTaskDetailsStore.appendVideoComments(result2.id, arg1.videoComments.map(normalizeMonitorVideoCommentRecord));
        }
      }
    } else {
      const obj = {
        ...result[result3],
        ...result2,
        id: result2.id
      };
      if (!Array.isArray(arg1.cycles) && !fn()) {
        obj.cycles = result[result3].cycles;
      }
      if (!Array.isArray(arg1.matches) && !fn()) {
        obj.matches = result[result3].matches;
      }
      if (!Array.isArray(arg1.videoComments) && !fn()) {
        obj.videoComments = result[result3].videoComments;
      }
      result[result3] = normalizeMonitorTask(obj);
    }
    fn2(result);
    return findTaskById(result2.id);
  }
  function patchTask(arg1, options = {}) {
    const result = readTasks().map(normalizeMonitorTask);
    const result2 = result.findIndex(arg12 => arg12.id === arg1);
    if (result2 === -1) {
      return null;
    }
    const {
      matches: matches,
      cycles: cycles,
      ...local
    } = options || {};
    const obj = {
      ...result[result2],
      ...local,
      id: arg1
    };
    if (!fn()) {
      if (Object.prototype.hasOwnProperty.call(options || {}, "matches")) {
        obj.matches = matches;
      }
      if (Object.prototype.hasOwnProperty.call(options || {}, "cycles")) {
        obj.cycles = cycles;
      }
    }
    result[result2] = normalizeMonitorTask(obj);
    fn2(result);
    if (fn() && Object.prototype.hasOwnProperty.call(options || {}, "matches")) {
      if (!Array.isArray(matches) || matches.length === 0) {
        monitorTaskDetailsStore.deleteMatches(arg1, {
          clearAll: true
        });
      } else {
        monitorTaskDetailsStore.deleteMatches(arg1, {
          clearAll: true
        });
        monitorTaskDetailsStore.appendMatches(arg1, matches.map(normalizeMatchRecord));
      }
    }
    if (fn() && Object.prototype.hasOwnProperty.call(options || {}, "cycles")) {
      monitorTaskDetailsStore.deleteCyclesForTask(arg1);
      (Array.isArray(cycles) ? cycles : []).forEach(arg12 => monitorTaskDetailsStore.upsertCycle(arg1, arg12));
    }
    return findTaskById(arg1);
  }
  function deleteTasks(list = []) {
    const set = new Set(Array.isArray(list) ? list : [list]);
    const result = readTasks().filter(arg1 => !set.has(arg1.id));
    fn2(result);
    if (fn()) {
      set.forEach(arg1 => monitorTaskDetailsStore.deleteAllForTask(arg1));
    }
    return true;
  }
  function incrementStats(arg1, options = {}) {
    const result = findTaskById(arg1);
    if (!result) {
      return null;
    }
    const obj = {
      ...createEmptyMonitorTaskStats(),
      ...(result.stats || {})
    };
    Object.keys(createEmptyMonitorTaskStats()).forEach(arg1 => {
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
    if (options.lastCycleComments != null) {
      obj.lastCycleComments = Number(options.lastCycleComments);
    }
    return patchTask(arg1, {
      stats: obj
    });
  }
  function resetStaleRunningTasks() {
    const result = readTasks().map(normalizeMonitorTask);
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
      return normalizeMonitorTask({
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
  function appendMatchRecord(arg1, options = {}) {
    return appendMatchRecords(arg1, [options]);
  }
  function appendMatchRecords(arg1, list = []) {
    const result = (Array.isArray(list) ? list : [list]).filter(Boolean).map(normalizeMatchRecord);
    if (!result.length) {
      return findTaskById(arg1);
    }
    if (fn()) {
      if (!findTaskById(arg1)) {
        return null;
      }
      monitorTaskDetailsStore.appendMatches(arg1, result);
      return findTaskById(arg1);
    }
    const result2 = readTasks().map(normalizeMonitorTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    const local = result2[result3].matches || [];
    const set = new Set(result.map(arg1 => arg1.id));
    const result4 = local.filter(arg1 => !set.has(arg1.id));
    result2[result3] = normalizeMonitorTask({
      ...result2[result3],
      matches: [...result, ...result4]
    });
    fn2(result2);
    return fn3(result2[result3]);
  }
  function deleteMatchRecords(arg1, options = {}) {
    const result = findTaskById(arg1);
    if (!result) {
      return null;
    }
    if (fn()) {
      monitorTaskDetailsStore.deleteMatches(arg1, options);
      return findTaskById(arg1);
    }
    const {
      matchIds = [],
      clearAll = false,
      clearMisses = false
    } = options;
    const result2 = readTasks().map(normalizeMonitorTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    let local = result2[result3].matches || [];
    if (clearAll) {
      local = [];
    } else if (clearMisses) {
      local = local.filter(arg1 => arg1?.matched !== false);
    } else {
      const set = new Set(Array.isArray(matchIds) ? matchIds : [matchIds]);
      local = local.filter(arg1 => !set.has(arg1.id));
    }
    result2[result3] = normalizeMonitorTask({
      ...result2[result3],
      matches: local
    });
    fn2(result2);
    return fn3(result2[result3]);
  }
  function listMatchRecordsPage(arg1, options = {}) {
    if (fn()) {
      return monitorTaskDetailsStore.listMatchesPage(arg1, options);
    }
    const result = readTasks().map(normalizeMonitorTask).find(arg12 => arg12.id === arg1);
    const value = Array.isArray(result?.matches) ? result.matches : [];
    const result2 = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const result3 = Math.max(0, Number(options.offset) || 0);
    return {
      items: value.slice(result3, result3 + result2),
      total: value.length,
      counts: {
        all: value.length,
        hit: value.filter(arg1 => arg1?.matched !== false).length,
        miss: value.filter(arg1 => arg1?.matched === false).length
      }
    };
  }
  function listCycleRecordsPage(arg1, options = {}) {
    if (fn()) {
      return monitorTaskDetailsStore.listCyclesPage(arg1, options);
    }
    const result = readTasks().map(normalizeMonitorTask).find(arg12 => arg12.id === arg1);
    const value = Array.isArray(result?.cycles) ? result.cycles : [];
    const result2 = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const result3 = Math.max(0, Number(options.offset) || 0);
    return {
      items: value.slice(result3, result3 + result2),
      total: value.length
    };
  }
  function listVideoCommentRecordsPage(arg1, options = {}) {
    if (fn()) {
      return monitorTaskDetailsStore.listVideoCommentsPage(arg1, options);
    }
    const result = readTasks().map(normalizeMonitorTask).find(arg12 => arg12.id === arg1);
    let value = Array.isArray(result?.videoComments) ? result.videoComments : [];
    const result2 = String(options.keyword || "").trim().toLowerCase();
    if (result2) {
      value = value.filter(arg1 => {
        const result = [arg1.content, arg1.videoTitle, arg1.videoUrl, arg1.accountName, arg1.accountId].map(arg1 => String(arg1 || "").toLowerCase()).join(" ");
        return result.includes(result2);
      });
    }
    const result3 = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const result4 = Math.max(0, Number(options.offset) || 0);
    return {
      items: value.slice(result4, result4 + result3),
      total: value.length
    };
  }
  function appendVideoCommentRecords(arg1, list = []) {
    const result = (Array.isArray(list) ? list : [list]).filter(Boolean).map(normalizeMonitorVideoCommentRecord);
    if (!result.length) {
      return findTaskById(arg1);
    }
    if (fn()) {
      if (!findTaskById(arg1)) {
        return null;
      }
      monitorTaskDetailsStore.appendVideoComments(arg1, result);
      return findTaskById(arg1);
    }
    const result2 = readTasks().map(normalizeMonitorTask);
    const result3 = result2.findIndex(arg12 => arg12.id === arg1);
    if (result3 === -1) {
      return null;
    }
    const local = result2[result3].videoComments || [];
    const set = new Set(result.map(arg1 => arg1.id));
    const result4 = local.filter(arg1 => !set.has(arg1.id));
    result2[result3] = normalizeMonitorTask({
      ...result2[result3],
      videoComments: [...result, ...result4].slice(0, MAX_MONITOR_TASK_VIDEO_COMMENTS)
    });
    fn2(result2);
    return fn3(result2[result3]);
  }
  function listMatchUserKeys(arg1) {
    if (fn()) {
      return monitorTaskDetailsStore.listMatchUserKeys(arg1);
    }
    const result = readTasks().map(normalizeMonitorTask).find(arg12 => arg12.id === arg1);
    return (result?.matches || []).map(arg1 => ({
      userUrl: arg1.userUrl || "",
      secUid: arg1.secUid || "",
      sec_uid: arg1.sec_uid || "",
      matchType: arg1.matchType || "",
      matched: arg1.matched !== false ? 1 : 0,
      judgeReason: arg1.judgeReason || ""
    }));
  }
  function beginCycle(arg1, options = {}) {
    const local = Number(options.startedAt) || Date.now();
    if (fn()) {
      if (!findTaskById(arg1)) {
        return null;
      }
      const result = monitorTaskDetailsStore.listOpenCycles(arg1);
      result.forEach(arg12 => {
        monitorTaskDetailsStore.upsertCycle(arg1, {
          ...arg12,
          endedAt: local,
          durationMs: arg12.startedAt ? Math.max(0, local - Number(arg12.startedAt)) : arg12.durationMs,
          status: "stopped"
        });
      });
      const result2 = normalizeMonitorTaskCycle({
        ...options,
        id: options.id || "cycle_" + local + "_" + Math.random().toString(36).slice(2, 8),
        round: options.round || monitorTaskDetailsStore.maxCycleRound(arg1) + 1,
        startedAt: local,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
      monitorTaskDetailsStore.upsertCycle(arg1, result2);
      return {
        ...findTaskById(arg1),
        cycles: [result2]
      };
    }
    const result = findTaskById(arg1);
    if (!result) {
      return null;
    }
    const result2 = closeOpenCycles(result.cycles || [], local);
    const result3 = normalizeMonitorTaskCycle({
      ...options,
      id: options.id || "cycle_" + local + "_" + Math.random().toString(36).slice(2, 8),
      round: options.round || nextCycleRound(result2),
      startedAt: local,
      endedAt: null,
      durationMs: null,
      status: "running"
    });
    return patchTask(arg1, {
      cycles: prependCycle(result2, result3)
    });
  }
  function incrementCycleMetrics(arg1, arg2, options = {}) {
    if (!arg1 || !arg2) {
      return null;
    }
    const result = Object.values(options || {}).some(arg1 => Number(arg1) > 0);
    if (!result) {
      return findTaskById(arg1);
    }
    if (fn()) {
      const result = monitorTaskDetailsStore.getCycle(arg1, arg2);
      if (!result || result.status !== "running") {
        return findTaskById(arg1);
      }
      const result2 = normalizeMonitorTaskCycle({
        ...result,
        ...addCycleMetrics(result, options),
        id: result.id,
        round: result.round,
        startedAt: result.startedAt,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
      monitorTaskDetailsStore.upsertCycle(arg1, result2);
      return {
        ...findTaskById(arg1),
        cycles: [result2]
      };
    }
    const result2 = findTaskById(arg1);
    if (!result2) {
      return null;
    }
    const result3 = (result2.cycles || []).map(arg1 => {
      if (arg1.id !== arg2 || arg1.status !== "running") {
        return arg1;
      }
      return normalizeMonitorTaskCycle({
        ...arg1,
        ...addCycleMetrics(arg1, options),
        id: arg1.id,
        endedAt: null,
        durationMs: null,
        status: "running"
      });
    });
    return patchTask(arg1, {
      cycles: result3
    });
  }
  function finishCycle(arg1, arg2, options = {}) {
    const value = options.endedAt != null ? Number(options.endedAt) : Date.now();
    if (fn()) {
      const result = monitorTaskDetailsStore.getCycle(arg1, arg2);
      if (!result) {
        return findTaskById(arg1);
      }
      const local = Number(result.startedAt) || value;
      const result2 = normalizeMonitorTaskCycle({
        ...result,
        ...options,
        ...mergeCycleMetrics(result, options),
        id: result.id,
        round: result.round,
        startedAt: local,
        endedAt: value,
        durationMs: options.durationMs != null ? Number(options.durationMs) : Math.max(0, value - local),
        status: options.status || "done"
      });
      monitorTaskDetailsStore.upsertCycle(arg1, result2);
      return {
        ...findTaskById(arg1),
        cycles: [result2]
      };
    }
    const result = findTaskById(arg1);
    if (!result || !arg2) {
      return result;
    }
    const result2 = (result.cycles || []).map(arg1 => {
      if (arg1.id !== arg2) {
        return arg1;
      }
      const local = Number(arg1.startedAt) || value;
      return normalizeMonitorTaskCycle({
        ...arg1,
        ...options,
        ...mergeCycleMetrics(arg1, options),
        id: arg1.id,
        round: arg1.round,
        startedAt: local,
        endedAt: value,
        durationMs: options.durationMs ?? Math.max(0, value - local),
        status: options.status || "done"
      });
    });
    return patchTask(arg1, {
      cycles: result2
    });
  }
  return {
    listTasks: listTasks,
    findTaskById: findTaskById,
    upsertTask: upsertTask,
    patchTask: patchTask,
    deleteTasks: deleteTasks,
    incrementStats: incrementStats,
    appendMatchRecord: appendMatchRecord,
    appendMatchRecords: appendMatchRecords,
    deleteMatchRecords: deleteMatchRecords,
    listMatchRecordsPage: listMatchRecordsPage,
    listCycleRecordsPage: listCycleRecordsPage,
    listVideoCommentRecordsPage: listVideoCommentRecordsPage,
    appendVideoCommentRecords: appendVideoCommentRecords,
    listMatchUserKeys: listMatchUserKeys,
    beginCycle: beginCycle,
    incrementCycleMetrics: incrementCycleMetrics,
    finishCycle: finishCycle,
    resetStaleRunningTasks: resetStaleRunningTasks,
    normalizeMonitorTask: normalizeMonitorTask
  };
}
module.exports = {
  createMonitorTasksApi: createMonitorTasksApi,
  normalizeMonitorTask: normalizeMonitorTask,
  createCrypto: createCrypto
};
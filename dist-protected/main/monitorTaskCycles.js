'use strict';

const MAX_MONITOR_TASK_CYCLES = 200;
function createEmptyCycleMetrics() {
  return {
    newComments: 0,
    newWorks: 0,
    matched: 0,
    likes: 0,
    replies: 0,
    follows: 0,
    followRequests: 0,
    messages: 0
  };
}
function normalizeMonitorTaskCycle(options = {}) {
  const result = createEmptyCycleMetrics();
  Object.keys(result).forEach(arg1 => {
    const result2 = Number(options[arg1]);
    result[arg1] = Number.isFinite(result2) && result2 > 0 ? Math.floor(result2) : 0;
  });
  const value = options.startedAt != null ? Number(options.startedAt) : null;
  const value2 = options.endedAt != null ? Number(options.endedAt) : null;
  let value3 = options.durationMs != null ? Number(options.durationMs) : null;
  if ((!Number.isFinite(value3) || value3 < 0) && value && value2 && value2 >= value) {
    value3 = value2 - value;
  }
  const value4 = ["running", "done", "stopped", "error"].includes(String(options.status || "")) ? String(options.status) : value2 ? "done" : "running";
  return {
    id: String(options.id || "cycle_" + (value || Date.now()) + "_" + Math.random().toString(36).slice(2, 8)),
    round: Math.max(1, Math.floor(Number(options.round) || 1)),
    startedAt: Number.isFinite(value) ? value : null,
    endedAt: Number.isFinite(value2) ? value2 : null,
    durationMs: Number.isFinite(value3) ? Math.max(0, Math.floor(value3)) : null,
    status: value4,
    ...result
  };
}
function nextCycleRound(list = []) {
  return (Array.isArray(list) ? list : []).reduce((arg1, arg2) => Math.max(arg1, Number(arg2?.round) || 0), 0) + 1;
}
function closeOpenCycles(list = [], arg2 = Date.now()) {
  const local = Number(arg2) || Date.now();
  return (Array.isArray(list) ? list : []).map(arg1 => {
    if (arg1?.status !== "running") {
      return normalizeMonitorTaskCycle(arg1);
    }
    return normalizeMonitorTaskCycle({
      ...arg1,
      endedAt: local,
      durationMs: arg1.startedAt ? Math.max(0, local - Number(arg1.startedAt)) : arg1.durationMs,
      status: "stopped"
    });
  });
}
function metricsFromMatchRecords(list = []) {
  const result = createEmptyCycleMetrics();
  (Array.isArray(list) ? list : []).forEach(arg1 => {
    result.newComments += 1;
    if (arg1?.matched !== false) {
      result.matched += 1;
    }
    if (arg1?.likeStatus === "success") {
      result.likes += 1;
    }
    if (arg1?.replyStatus === "success") {
      result.replies += 1;
    }
    if (arg1?.followStatus === "success") {
      result.follows += 1;
    }
    if (arg1?.followStatus === "requested" && arg1?.followRequestSent) {
      result.followRequests += 1;
    }
    if (arg1?.dmStatus === "success") {
      result.messages += 1;
    }
  });
  return result;
}
function mergeCycleMetrics(options = {}, options2 = {}) {
  const result = createEmptyCycleMetrics();
  Object.keys(result).forEach(arg1 => {
    const result2 = Number(options[arg1] || 0);
    const result3 = Number(options2[arg1]);
    const value = Number.isFinite(result2) ? Math.max(0, Math.floor(result2)) : 0;
    const value2 = Number.isFinite(result3) ? Math.max(0, Math.floor(result3)) : 0;
    result[arg1] = Math.max(value, value2);
  });
  return result;
}
function addCycleMetrics(options = {}, options2 = {}) {
  const result = createEmptyCycleMetrics();
  Object.keys(result).forEach(arg1 => {
    const result2 = Number(options[arg1] || 0);
    const result3 = Number(options2[arg1]);
    const value = Number.isFinite(result2) ? Math.max(0, Math.floor(result2)) : 0;
    const value2 = Number.isFinite(result3) && result3 > 0 ? Math.floor(result3) : 0;
    result[arg1] = value + value2;
  });
  return result;
}
function prependCycle(arg1, arg2, arg3 = MAX_MONITOR_TASK_CYCLES) {
  const result = normalizeMonitorTaskCycle(arg2);
  const list = [result, ...(Array.isArray(arg1) ? arg1 : []).filter(arg1 => arg1?.id !== result.id)];
  return list.slice(0, Math.max(1, arg3));
}
module.exports = {
  MAX_MONITOR_TASK_CYCLES: MAX_MONITOR_TASK_CYCLES,
  createEmptyCycleMetrics: createEmptyCycleMetrics,
  normalizeMonitorTaskCycle: normalizeMonitorTaskCycle,
  nextCycleRound: nextCycleRound,
  closeOpenCycles: closeOpenCycles,
  prependCycle: prependCycle,
  metricsFromMatchRecords: metricsFromMatchRecords,
  mergeCycleMetrics: mergeCycleMetrics,
  addCycleMetrics: addCycleMetrics
};
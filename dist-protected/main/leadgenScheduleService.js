const LEADGEN_SCHEDULES_KEY = "leadgen_schedules_v1";
const MAX_LEADGEN_SCHEDULE_TIMEOUT_MS = 2147000000;
const DUE_LEADGEN_SCHEDULE_RETRY_MS = 30000;
const LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN = "leadgen-schedule";
function normalizeMode(arg1) {
  if (arg1 === "restart") {
    return "restart";
  } else {
    return "resume";
  }
}
function getWakeAt(arg1) {
  const result = Number(arg1?.nextActionAt || arg1?.runAt || 0);
  if (Number.isFinite(result) && result > 0) {
    return result;
  } else {
    return 0;
  }
}
function normalizeLeadgenScheduleEntryForMain(arg1, arg2 = Date.now()) {
  if (Number.isFinite(Number(arg1)) && Number(arg1) > 0) {
    const result = Number(arg1);
    return {
      type: "once",
      runAt: result,
      mode: "resume",
      createdAt: arg2,
      retryCount: 0,
      nextAction: "start",
      nextActionAt: result
    };
  }
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  const local = arg1.type === "daily" || !!arg1.startHm && !!arg1.endHm && !Number(arg1.runAt);
  if (local) {
    const result = String(arg1.startHm || "").trim();
    const result2 = String(arg1.endHm || "").trim();
    if (!/^\d{1,2}:\d{2}$/.test(result) || !/^\d{1,2}:\d{2}$/.test(result2)) {
      return null;
    }
    if (result === result2) {
      return null;
    }
    let value = arg1.nextAction === "stop" ? "stop" : "start";
    let result3 = Number(arg1.nextActionAt || 0);
    if (!Number.isFinite(result3) || result3 <= 0) {
      value = "start";
      result3 = arg2;
    }
    return {
      type: "daily",
      startHm: result,
      endHm: result2,
      mode: "restart",
      enabled: arg1.enabled !== false,
      createdAt: Number(arg1.createdAt) || arg2,
      retryCount: Math.max(0, Number(arg1.retryCount) || 0),
      activeWindowId: arg1.activeWindowId || null,
      nextAction: value,
      nextActionAt: result3,
      windowId: arg1.windowId || null
    };
  }
  const result = Number(arg1.runAt || arg1.targetTime || 0);
  if (!Number.isFinite(result) || result <= 0) {
    return null;
  }
  return {
    type: "once",
    runAt: result,
    mode: normalizeMode(arg1.mode),
    createdAt: Number(arg1.createdAt) || arg2,
    retryCount: Math.max(0, Number(arg1.retryCount) || 0),
    nextAction: "start",
    nextActionAt: result
  };
}
function normalizeLeadgenSchedulesForMain(arg1, arg2 = Date.now()) {
  if (arg1 == null) {
    return null;
  }
  const obj = {};
  if (!arg1 || typeof arg1 !== "object") {
    return obj;
  }
  Object.entries(arg1).forEach(([arg1, arg12]) => {
    const result = normalizeLeadgenScheduleEntryForMain(arg12, arg2);
    if (arg1 && result) {
      obj[arg1] = result;
    }
  });
  return obj;
}
function createLeadgenScheduleService({
  store: store,
  getMainWindow: getMainWindow,
  acquireTaskRuntimeGuard: acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard: releaseTaskRuntimeGuard
}) {
  let local = null;
  function clearLeadgenScheduleTimer() {
    if (local) {
      clearTimeout(local);
    }
    local = null;
  }
  function fn2(arg1) {
    const result = Object.values(arg1 || {}).map(arg1 => ({
      entry: arg1,
      wakeAt: getWakeAt(arg1)
    })).filter(arg1 => arg1.wakeAt > 0).sort((arg1, arg2) => arg1.wakeAt - arg2.wakeAt);
    if (result.length === 0) {
      releaseTaskRuntimeGuard(LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN);
      return;
    }
    acquireTaskRuntimeGuard(LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN, {
      type: "leadgen-schedule",
      count: result.length,
      nextRunAt: result[0].wakeAt
    });
  }
  function fn3() {
    return normalizeLeadgenSchedulesForMain(store.get(LEADGEN_SCHEDULES_KEY, null)) || {};
  }
  function fn4(arg1) {
    store.set(LEADGEN_SCHEDULES_KEY, arg1 || {});
  }
  function dispatchDueLeadgenSchedules() {
    clearLeadgenScheduleTimer();
    const result = fn3();
    fn2(result);
    const result2 = Date.now();
    const result3 = Object.entries(result).map(([arg1, arg12]) => ({
      taskId: arg1,
      entry: arg12,
      wakeAt: getWakeAt(arg12)
    })).filter(arg1 => arg1.wakeAt > 0 && arg1.wakeAt <= result2).sort((arg1, arg2) => arg1.wakeAt - arg2.wakeAt);
    if (result3.length > 0) {
      const value = typeof getMainWindow === "function" ? getMainWindow() : null;
      if (value && !value.isDestroyed()) {
        value.webContents.send("leadgen-schedule-due", {
          taskIds: result3.map(arg1 => arg1.taskId),
          actions: result3.map(arg1 => ({
            taskId: arg1.taskId,
            action: arg1.entry.nextAction || "start",
            type: arg1.entry.type || "once"
          }))
        });
      }
      local = setTimeout(dispatchDueLeadgenSchedules, DUE_LEADGEN_SCHEDULE_RETRY_MS);
      return;
    }
    queueNextLeadgenSchedule();
  }
  function queueNextLeadgenSchedule() {
    clearLeadgenScheduleTimer();
    const result = fn3();
    fn2(result);
    const value = Object.values(result).map(arg1 => getWakeAt(arg1)).filter(arg1 => arg1 > 0).sort((arg1, arg2) => arg1 - arg2)[0];
    if (!value) {
      return;
    }
    const result2 = Math.max(0, value - Date.now());
    local = setTimeout(dispatchDueLeadgenSchedules, Math.min(result2, MAX_LEADGEN_SCHEDULE_TIMEOUT_MS));
  }
  function getLeadgenSchedules() {
    const result = fn3();
    queueNextLeadgenSchedule();
    return result;
  }
  function saveLeadgenSchedules(arg1) {
    const local = normalizeLeadgenSchedulesForMain(arg1) || {};
    fn4(local);
    queueNextLeadgenSchedule();
    return true;
  }
  function removeLeadgenSchedules(arg1) {
    const result = (Array.isArray(arg1) ? arg1 : [arg1]).filter(Boolean).map(arg1 => String(arg1));
    if (result.length === 0) {
      return false;
    }
    const result2 = fn3();
    let flag = false;
    result.forEach(arg1 => {
      if (Object.prototype.hasOwnProperty.call(result2, arg1)) {
        delete result2[arg1];
        flag = true;
      }
    });
    if (flag) {
      fn4(result2);
    }
    queueNextLeadgenSchedule();
    return flag;
  }
  return {
    LEADGEN_SCHEDULES_KEY: LEADGEN_SCHEDULES_KEY,
    normalizeLeadgenSchedulesForMain: normalizeLeadgenSchedulesForMain,
    clearLeadgenScheduleTimer: clearLeadgenScheduleTimer,
    queueNextLeadgenSchedule: queueNextLeadgenSchedule,
    dispatchDueLeadgenSchedules: dispatchDueLeadgenSchedules,
    getLeadgenSchedules: getLeadgenSchedules,
    saveLeadgenSchedules: saveLeadgenSchedules,
    removeLeadgenSchedules: removeLeadgenSchedules
  };
}
module.exports = {
  createLeadgenScheduleService: createLeadgenScheduleService,
  normalizeLeadgenSchedulesForMain: normalizeLeadgenSchedulesForMain
};
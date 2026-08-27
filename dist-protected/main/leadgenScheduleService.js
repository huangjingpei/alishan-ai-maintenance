const LEADGEN_SCHEDULES_KEY = "leadgen_schedules_v1";
const MAX_LEADGEN_SCHEDULE_TIMEOUT_MS = 2147000000;
const DUE_LEADGEN_SCHEDULE_RETRY_MS = 30000;
const LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN = "leadgen-schedule";
function normalizeMode(_0x5d8579) {
  if (_0x5d8579 === "restart") {
    return "restart";
  } else {
    return "resume";
  }
}
function getWakeAt(_0x4600b0) {
  const _0x3840e5 = Number(_0x4600b0?.nextActionAt || _0x4600b0?.runAt || 0);
  if (Number.isFinite(_0x3840e5) && _0x3840e5 > 0) {
    return _0x3840e5;
  } else {
    return 0;
  }
}
function normalizeLeadgenScheduleEntryForMain(_0x78c9f8, _0x13c2c7 = Date.now()) {
  if (Number.isFinite(Number(_0x78c9f8)) && Number(_0x78c9f8) > 0) {
    const _0x15c1bd = Number(_0x78c9f8);
    return {
      type: "once",
      runAt: _0x15c1bd,
      mode: "resume",
      createdAt: _0x13c2c7,
      retryCount: 0,
      nextAction: "start",
      nextActionAt: _0x15c1bd
    };
  }
  if (!_0x78c9f8 || typeof _0x78c9f8 !== "object") {
    return null;
  }
  const _0x55674f = _0x78c9f8.type === "daily" || !!_0x78c9f8.startHm && !!_0x78c9f8.endHm && !Number(_0x78c9f8.runAt);
  if (_0x55674f) {
    const _0x589441 = String(_0x78c9f8.startHm || "").trim();
    const _0x3350ed = String(_0x78c9f8.endHm || "").trim();
    if (!/^\d{1,2}:\d{2}$/.test(_0x589441) || !/^\d{1,2}:\d{2}$/.test(_0x3350ed)) {
      return null;
    }
    if (_0x589441 === _0x3350ed) {
      return null;
    }
    let _0x369240 = _0x78c9f8.nextAction === "stop" ? "stop" : "start";
    let _0x20b602 = Number(_0x78c9f8.nextActionAt || 0);
    if (!Number.isFinite(_0x20b602) || _0x20b602 <= 0) {
      _0x369240 = "start";
      _0x20b602 = _0x13c2c7;
    }
    return {
      type: "daily",
      startHm: _0x589441,
      endHm: _0x3350ed,
      mode: "restart",
      enabled: _0x78c9f8.enabled !== false,
      createdAt: Number(_0x78c9f8.createdAt) || _0x13c2c7,
      retryCount: Math.max(0, Number(_0x78c9f8.retryCount) || 0),
      activeWindowId: _0x78c9f8.activeWindowId || null,
      nextAction: _0x369240,
      nextActionAt: _0x20b602,
      windowId: _0x78c9f8.windowId || null
    };
  }
  const _0x4c838a = Number(_0x78c9f8.runAt || _0x78c9f8.targetTime || 0);
  if (!Number.isFinite(_0x4c838a) || _0x4c838a <= 0) {
    return null;
  }
  return {
    type: "once",
    runAt: _0x4c838a,
    mode: normalizeMode(_0x78c9f8.mode),
    createdAt: Number(_0x78c9f8.createdAt) || _0x13c2c7,
    retryCount: Math.max(0, Number(_0x78c9f8.retryCount) || 0),
    nextAction: "start",
    nextActionAt: _0x4c838a
  };
}
function normalizeLeadgenSchedulesForMain(_0x1e7aa9, _0x19dd51 = Date.now()) {
  if (_0x1e7aa9 == null) {
    return null;
  }
  const _0x37b061 = {};
  if (!_0x1e7aa9 || typeof _0x1e7aa9 !== "object") {
    return _0x37b061;
  }
  Object.entries(_0x1e7aa9).forEach(([_0x4772cb, _0x1dcc7c]) => {
    const _0x4d9aa6 = normalizeLeadgenScheduleEntryForMain(_0x1dcc7c, _0x19dd51);
    if (_0x4772cb && _0x4d9aa6) {
      _0x37b061[_0x4772cb] = _0x4d9aa6;
    }
  });
  return _0x37b061;
}
function createLeadgenScheduleService({
  store: _0x1c7077,
  getMainWindow: _0x530b06,
  acquireTaskRuntimeGuard: _0x28ff4e,
  releaseTaskRuntimeGuard: _0x4a2469
}) {
  let _0x501266 = null;
  function _0x390137() {
    if (_0x501266) {
      clearTimeout(_0x501266);
    }
    _0x501266 = null;
  }
  function _0x49a734(_0x4999ff) {
    const _0x28e9ea = Object.values(_0x4999ff || {}).map(_0x3125ea => ({
      entry: _0x3125ea,
      wakeAt: getWakeAt(_0x3125ea)
    })).filter(_0x33b9ae => _0x33b9ae.wakeAt > 0).sort((_0xa50e19, _0x2ab0f1) => _0xa50e19.wakeAt - _0x2ab0f1.wakeAt);
    if (_0x28e9ea.length === 0) {
      _0x4a2469(LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN);
      return;
    }
    _0x28ff4e(LEADGEN_SCHEDULE_RUNTIME_GUARD_TOKEN, {
      type: "leadgen-schedule",
      count: _0x28e9ea.length,
      nextRunAt: _0x28e9ea[0].wakeAt
    });
  }
  function _0x2e56ea() {
    return normalizeLeadgenSchedulesForMain(_0x1c7077.get(LEADGEN_SCHEDULES_KEY, null)) || {};
  }
  function _0x926dfd(_0x52b9ad) {
    _0x1c7077.set(LEADGEN_SCHEDULES_KEY, _0x52b9ad || {});
  }
  function _0x5cd0a4() {
    _0x390137();
    const _0x4a8b85 = _0x2e56ea();
    _0x49a734(_0x4a8b85);
    const _0x51e907 = Date.now();
    const _0x391994 = Object.entries(_0x4a8b85).map(([_0xb2edb2, _0x22ffdd]) => ({
      taskId: _0xb2edb2,
      entry: _0x22ffdd,
      wakeAt: getWakeAt(_0x22ffdd)
    })).filter(_0x58a940 => _0x58a940.wakeAt > 0 && _0x58a940.wakeAt <= _0x51e907).sort((_0x296531, _0x1bf260) => _0x296531.wakeAt - _0x1bf260.wakeAt);
    if (_0x391994.length > 0) {
      const _0x108cf0 = typeof _0x530b06 === "function" ? _0x530b06() : null;
      if (_0x108cf0 && !_0x108cf0.isDestroyed()) {
        _0x108cf0.webContents.send("leadgen-schedule-due", {
          taskIds: _0x391994.map(_0xbd5d19 => _0xbd5d19.taskId),
          actions: _0x391994.map(_0x30e28c => ({
            taskId: _0x30e28c.taskId,
            action: _0x30e28c.entry.nextAction || "start",
            type: _0x30e28c.entry.type || "once"
          }))
        });
      }
      _0x501266 = setTimeout(_0x5cd0a4, DUE_LEADGEN_SCHEDULE_RETRY_MS);
      return;
    }
    _0x3c15f0();
  }
  function _0x3c15f0() {
    _0x390137();
    const _0x23d00b = _0x2e56ea();
    _0x49a734(_0x23d00b);
    const _0x252ebb = Object.values(_0x23d00b).map(_0x259783 => getWakeAt(_0x259783)).filter(_0x159083 => _0x159083 > 0).sort((_0x2cba10, _0x4a48b9) => _0x2cba10 - _0x4a48b9)[0];
    if (!_0x252ebb) {
      return;
    }
    const _0xa6b595 = Math.max(0, _0x252ebb - Date.now());
    _0x501266 = setTimeout(_0x5cd0a4, Math.min(_0xa6b595, MAX_LEADGEN_SCHEDULE_TIMEOUT_MS));
  }
  function _0x40b234() {
    const _0x5e924a = _0x2e56ea();
    _0x3c15f0();
    return _0x5e924a;
  }
  function _0x5647f4(_0x5d83d9) {
    const _0x5e8d8e = normalizeLeadgenSchedulesForMain(_0x5d83d9) || {};
    _0x926dfd(_0x5e8d8e);
    _0x3c15f0();
    return true;
  }
  function _0x29f14b(_0x2dff6d) {
    const _0x360936 = (Array.isArray(_0x2dff6d) ? _0x2dff6d : [_0x2dff6d]).filter(Boolean).map(_0x123744 => String(_0x123744));
    if (_0x360936.length === 0) {
      return false;
    }
    const _0x2c82ce = _0x2e56ea();
    let _0x1ef0b8 = false;
    _0x360936.forEach(_0x3154f3 => {
      if (Object.prototype.hasOwnProperty.call(_0x2c82ce, _0x3154f3)) {
        delete _0x2c82ce[_0x3154f3];
        _0x1ef0b8 = true;
      }
    });
    if (_0x1ef0b8) {
      _0x926dfd(_0x2c82ce);
    }
    _0x3c15f0();
    return _0x1ef0b8;
  }
  return {
    LEADGEN_SCHEDULES_KEY: LEADGEN_SCHEDULES_KEY,
    normalizeLeadgenSchedulesForMain: normalizeLeadgenSchedulesForMain,
    clearLeadgenScheduleTimer: _0x390137,
    queueNextLeadgenSchedule: _0x3c15f0,
    dispatchDueLeadgenSchedules: _0x5cd0a4,
    getLeadgenSchedules: _0x40b234,
    saveLeadgenSchedules: _0x5647f4,
    removeLeadgenSchedules: _0x29f14b
  };
}
module.exports = {
  createLeadgenScheduleService: createLeadgenScheduleService,
  normalizeLeadgenSchedulesForMain: normalizeLeadgenSchedulesForMain
};
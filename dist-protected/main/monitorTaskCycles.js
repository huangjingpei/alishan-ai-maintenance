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
function normalizeMonitorTaskCycle(_0x4b77f8 = {}) {
  const _0x1ab2b1 = createEmptyCycleMetrics();
  Object.keys(_0x1ab2b1).forEach(_0x1a2c51 => {
    const _0xbe6ea5 = Number(_0x4b77f8[_0x1a2c51]);
    _0x1ab2b1[_0x1a2c51] = Number.isFinite(_0xbe6ea5) && _0xbe6ea5 > 0 ? Math.floor(_0xbe6ea5) : 0;
  });
  const _0xb8618b = _0x4b77f8.startedAt != null ? Number(_0x4b77f8.startedAt) : null;
  const _0x46c3b9 = _0x4b77f8.endedAt != null ? Number(_0x4b77f8.endedAt) : null;
  let _0xf38052 = _0x4b77f8.durationMs != null ? Number(_0x4b77f8.durationMs) : null;
  if ((!Number.isFinite(_0xf38052) || _0xf38052 < 0) && _0xb8618b && _0x46c3b9 && _0x46c3b9 >= _0xb8618b) {
    _0xf38052 = _0x46c3b9 - _0xb8618b;
  }
  const _0x351a3c = ["running", "done", "stopped", "error"].includes(String(_0x4b77f8.status || "")) ? String(_0x4b77f8.status) : _0x46c3b9 ? "done" : "running";
  return {
    id: String(_0x4b77f8.id || "cycle_" + (_0xb8618b || Date.now()) + "_" + Math.random().toString(36).slice(2, 8)),
    round: Math.max(1, Math.floor(Number(_0x4b77f8.round) || 1)),
    startedAt: Number.isFinite(_0xb8618b) ? _0xb8618b : null,
    endedAt: Number.isFinite(_0x46c3b9) ? _0x46c3b9 : null,
    durationMs: Number.isFinite(_0xf38052) ? Math.max(0, Math.floor(_0xf38052)) : null,
    status: _0x351a3c,
    ..._0x1ab2b1
  };
}
function nextCycleRound(_0x4089d4 = []) {
  return (Array.isArray(_0x4089d4) ? _0x4089d4 : []).reduce((_0xf78cf, _0x4400b7) => Math.max(_0xf78cf, Number(_0x4400b7?.round) || 0), 0) + 1;
}
function closeOpenCycles(_0x2af2c3 = [], _0x5751db = Date.now()) {
  const _0x5edf5c = Number(_0x5751db) || Date.now();
  return (Array.isArray(_0x2af2c3) ? _0x2af2c3 : []).map(_0x41003a => {
    if (_0x41003a?.status !== "running") {
      return normalizeMonitorTaskCycle(_0x41003a);
    }
    return normalizeMonitorTaskCycle({
      ..._0x41003a,
      endedAt: _0x5edf5c,
      durationMs: _0x41003a.startedAt ? Math.max(0, _0x5edf5c - Number(_0x41003a.startedAt)) : _0x41003a.durationMs,
      status: "stopped"
    });
  });
}
function metricsFromMatchRecords(_0x396fca = []) {
  const _0x414856 = createEmptyCycleMetrics();
  (Array.isArray(_0x396fca) ? _0x396fca : []).forEach(_0x5ce5c3 => {
    _0x414856.newComments += 1;
    if (_0x5ce5c3?.matched !== false) {
      _0x414856.matched += 1;
    }
    if (_0x5ce5c3?.likeStatus === "success") {
      _0x414856.likes += 1;
    }
    if (_0x5ce5c3?.replyStatus === "success") {
      _0x414856.replies += 1;
    }
    if (_0x5ce5c3?.followStatus === "success") {
      _0x414856.follows += 1;
    }
    if (_0x5ce5c3?.followStatus === "requested" && _0x5ce5c3?.followRequestSent) {
      _0x414856.followRequests += 1;
    }
    if (_0x5ce5c3?.dmStatus === "success") {
      _0x414856.messages += 1;
    }
  });
  return _0x414856;
}
function mergeCycleMetrics(_0x44cb7b = {}, _0x32e5f2 = {}) {
  const _0x3c646e = createEmptyCycleMetrics();
  Object.keys(_0x3c646e).forEach(_0x40cc9d => {
    const _0x2e86f6 = Number(_0x44cb7b[_0x40cc9d] || 0);
    const _0xaaab3a = Number(_0x32e5f2[_0x40cc9d]);
    const _0x10e4be = Number.isFinite(_0x2e86f6) ? Math.max(0, Math.floor(_0x2e86f6)) : 0;
    const _0x3ab4ad = Number.isFinite(_0xaaab3a) ? Math.max(0, Math.floor(_0xaaab3a)) : 0;
    _0x3c646e[_0x40cc9d] = Math.max(_0x10e4be, _0x3ab4ad);
  });
  return _0x3c646e;
}
function addCycleMetrics(_0xd6da3e = {}, _0xfdf377 = {}) {
  const _0x1847fe = createEmptyCycleMetrics();
  Object.keys(_0x1847fe).forEach(_0x4bfa89 => {
    const _0x330322 = Number(_0xd6da3e[_0x4bfa89] || 0);
    const _0x2aeb0e = Number(_0xfdf377[_0x4bfa89]);
    const _0x4871e0 = Number.isFinite(_0x330322) ? Math.max(0, Math.floor(_0x330322)) : 0;
    const _0x429960 = Number.isFinite(_0x2aeb0e) && _0x2aeb0e > 0 ? Math.floor(_0x2aeb0e) : 0;
    _0x1847fe[_0x4bfa89] = _0x4871e0 + _0x429960;
  });
  return _0x1847fe;
}
function prependCycle(_0x51957e, _0xe33dc3, _0x2b8c84 = MAX_MONITOR_TASK_CYCLES) {
  const _0x1de51a = normalizeMonitorTaskCycle(_0xe33dc3);
  const _0x333b7d = [_0x1de51a, ...(Array.isArray(_0x51957e) ? _0x51957e : []).filter(_0x535654 => _0x535654?.id !== _0x1de51a.id)];
  return _0x333b7d.slice(0, Math.max(1, _0x2b8c84));
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
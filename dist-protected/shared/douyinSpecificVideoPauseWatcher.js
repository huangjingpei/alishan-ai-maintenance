'use strict';

function findSpecificVideoResumeHint(_0x11a375) {
  if (!_0x11a375) {
    return false;
  }
  try {
    let _0xbab60b = null;
    for (let _0x5bc838 = 0; _0x5bc838 < _0x11a375.length; _0x5bc838++) {
      const _0x486b5a = _0x11a375.key(_0x5bc838);
      if (!_0x486b5a || !_0x486b5a.startsWith("radar_state_")) {
        continue;
      }
      const _0x5d13b9 = JSON.parse(_0x11a375.getItem(_0x486b5a) || "{}");
      if (_0x5d13b9?.loopId && (!_0xbab60b || Number(_0x5d13b9.updatedAt || 0) > Number(_0xbab60b.updatedAt || 0))) {
        _0xbab60b = _0x5d13b9;
      }
    }
    if (!_0xbab60b) {
      return false;
    }
    const _0x3e30c0 = String(_0xbab60b.videoSourcesKey || "").split(",");
    return _0x3e30c0[_0xbab60b.sIndex] === "specific";
  } catch (_0x5cad6f) {
    return false;
  }
}
function createDouyinSpecificVideoPauseWatcher({
  storage: _0x3ca876,
  getTaskState: _0x1095a4,
  getCurrentUrl: _0x55a346,
  isViewingVideoPage: _0x181526,
  queryVideos: _0x34492f,
  now = Date.now,
  random = Math.random,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  log = () => {},
  bootstrapMs = 3000,
  intervalMs = 50
} = {}) {
  const _0x832875 = now();
  const _0x305686 = _0x832875 + bootstrapMs;
  const _0x154b12 = findSpecificVideoResumeHint(_0x3ca876);
  let _0x547c72 = null;
  let _0xf79acc = null;
  let _0x4d1aac = null;
  let _0x2867bd = 1000 + random() * 2000;
  function _0x45c3cf() {
    const _0x57448d = typeof _0x1095a4 === "function" ? _0x1095a4() : {};
    if (_0x57448d.taskRunning && !_0x57448d.stopRequested && _0x57448d.currentRunningSource === "specific") {
      return true;
    }
    return !_0x57448d.stopRequested && _0x154b12 && now() < _0x305686;
  }
  function _0x48737e() {
    if (_0x547c72 === null) {
      return;
    }
    clearIntervalFn(_0x547c72);
    _0x547c72 = null;
    _0xf79acc = null;
    _0x4d1aac = null;
  }
  function _0x2dc031() {
    if (!_0x45c3cf()) {
      _0x48737e();
      return;
    }
    const _0x304d52 = typeof _0x55a346 === "function" ? String(_0x55a346() || "") : "";
    if (_0x304d52 !== _0xf79acc) {
      _0xf79acc = _0x304d52;
      _0x4d1aac = null;
      _0x2867bd = 1000 + random() * 2000;
    }
    if (typeof _0x181526 !== "function" || !_0x181526(_0x304d52)) {
      return;
    }
    const _0x620db5 = typeof _0x34492f === "function" ? Array.from(_0x34492f() || []) : [];
    if (!_0x620db5.length) {
      return;
    }
    if (_0x4d1aac === null) {
      _0x4d1aac = now();
      log("[Built-in-Debug] [指定视频-延时暂停] 检测到视频渲染，设定延时 " + _0x2867bd.toFixed(0) + "ms 后暂停");
    }
    if (now() - _0x4d1aac < _0x2867bd) {
      return;
    }
    _0x620db5.forEach(_0x208ae9 => {
      try {
        _0x208ae9.muted = true;
        if (!_0x208ae9.paused) {
          _0x208ae9.pause();
          log("[Built-in-Debug] [指定视频-延时暂停] 已达到延时，极速暂停了视频播放！");
        }
      } catch (_0x312f64) {}
    });
  }
  function _0x5d9868() {
    if (_0x547c72 !== null || !_0x45c3cf()) {
      return;
    }
    _0x547c72 = setIntervalFn(_0x2dc031, intervalMs);
  }
  function _0x5d4d27() {
    if (_0x45c3cf()) {
      _0x5d9868();
    } else {
      _0x48737e();
    }
  }
  return {
    sync: _0x5d4d27,
    stop: _0x48737e,
    isRunning: () => _0x547c72 !== null
  };
}
module.exports = {
  findSpecificVideoResumeHint: findSpecificVideoResumeHint,
  createDouyinSpecificVideoPauseWatcher: createDouyinSpecificVideoPauseWatcher
};
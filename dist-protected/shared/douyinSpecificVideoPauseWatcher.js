'use strict';

function findSpecificVideoResumeHint(arg1) {
  if (!arg1) {
    return false;
  }
  try {
    let local = null;
    for (let num = 0; num < arg1.length; num++) {
      const result = arg1.key(num);
      if (!result || !result.startsWith("radar_state_")) {
        continue;
      }
      const result2 = JSON.parse(arg1.getItem(result) || "{}");
      if (result2?.loopId && (!local || Number(result2.updatedAt || 0) > Number(local.updatedAt || 0))) {
        local = result2;
      }
    }
    if (!local) {
      return false;
    }
    const result = String(local.videoSourcesKey || "").split(",");
    return result[local.sIndex] === "specific";
  } catch (error) {
    return false;
  }
}
function createDouyinSpecificVideoPauseWatcher({
  storage: storage,
  getTaskState: getTaskState,
  getCurrentUrl: getCurrentUrl,
  isViewingVideoPage: isViewingVideoPage,
  queryVideos: queryVideos,
  now = Date.now,
  random = Math.random,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  log = () => {},
  bootstrapMs = 3000,
  intervalMs = 50
} = {}) {
  const result = now();
  const value = result + bootstrapMs;
  const result2 = findSpecificVideoResumeHint(storage);
  let local = null;
  let local2 = null;
  let local3 = null;
  let value2 = 1000 + random() * 2000;
  function fn() {
    const value2 = typeof getTaskState === "function" ? getTaskState() : {};
    if (value2.taskRunning && !value2.stopRequested && value2.currentRunningSource === "specific") {
      return true;
    }
    return !value2.stopRequested && result2 && now() < value;
  }
  function stop() {
    if (local === null) {
      return;
    }
    clearIntervalFn(local);
    local = null;
    local2 = null;
    local3 = null;
  }
  function fn3() {
    if (!fn()) {
      stop();
      return;
    }
    const value = typeof getCurrentUrl === "function" ? String(getCurrentUrl() || "") : "";
    if (value !== local2) {
      local2 = value;
      local3 = null;
      value2 = 1000 + random() * 2000;
    }
    if (typeof isViewingVideoPage !== "function" || !isViewingVideoPage(value)) {
      return;
    }
    const value3 = typeof queryVideos === "function" ? Array.from(queryVideos() || []) : [];
    if (!value3.length) {
      return;
    }
    if (local3 === null) {
      local3 = now();
      log("[Built-in-Debug] [指定视频-延时暂停] 检测到视频渲染，设定延时 " + value2.toFixed(0) + "ms 后暂停");
    }
    if (now() - local3 < value2) {
      return;
    }
    value3.forEach(arg1 => {
      try {
        arg1.muted = true;
        if (!arg1.paused) {
          arg1.pause();
          log("[Built-in-Debug] [指定视频-延时暂停] 已达到延时，极速暂停了视频播放！");
        }
      } catch (error) {}
    });
  }
  function fn4() {
    if (local !== null || !fn()) {
      return;
    }
    local = setIntervalFn(fn3, intervalMs);
  }
  function sync() {
    if (fn()) {
      fn4();
    } else {
      stop();
    }
  }
  return {
    sync: sync,
    stop: stop,
    isRunning: () => local !== null
  };
}
module.exports = {
  findSpecificVideoResumeHint: findSpecificVideoResumeHint,
  createDouyinSpecificVideoPauseWatcher: createDouyinSpecificVideoPauseWatcher
};
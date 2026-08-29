'use strict';

function createBackgroundPreviewAutoClose({
  delayMs = 60000,
  shouldSchedule = () => true,
  onTimeout = () => {}
} = {}) {
  let local = null;
  let text = "";
  function schedule(text2 = "background") {
    if (!shouldSchedule()) {
      return false;
    }
    if (local) {
      return true;
    }
    text = text2;
    local = setTimeout(() => {
      local = null;
      const local2 = text || "background";
      text = "";
      onTimeout(local2);
    }, Math.max(0, Number(delayMs) || 0));
    if (typeof local.unref === "function") {
      local.unref();
    }
    return true;
  }
  function cancel() {
    if (!local) {
      return false;
    }
    clearTimeout(local);
    local = null;
    text = "";
    return true;
  }
  function isScheduled() {
    return Boolean(local);
  }
  return {
    schedule: schedule,
    cancel: cancel,
    isScheduled: isScheduled
  };
}
module.exports = {
  createBackgroundPreviewAutoClose: createBackgroundPreviewAutoClose
};
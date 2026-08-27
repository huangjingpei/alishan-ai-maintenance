'use strict';

function createBackgroundPreviewAutoClose({
  delayMs = 60000,
  shouldSchedule = () => true,
  onTimeout = () => {}
} = {}) {
  let _0x192e66 = null;
  let _0x312971 = "";
  function _0x5b3a45(_0x3899c1 = "background") {
    if (!shouldSchedule()) {
      return false;
    }
    if (_0x192e66) {
      return true;
    }
    _0x312971 = _0x3899c1;
    _0x192e66 = setTimeout(() => {
      _0x192e66 = null;
      const _0x2d111d = _0x312971 || "background";
      _0x312971 = "";
      onTimeout(_0x2d111d);
    }, Math.max(0, Number(delayMs) || 0));
    if (typeof _0x192e66.unref === "function") {
      _0x192e66.unref();
    }
    return true;
  }
  function _0x5c68bb() {
    if (!_0x192e66) {
      return false;
    }
    clearTimeout(_0x192e66);
    _0x192e66 = null;
    _0x312971 = "";
    return true;
  }
  function _0xc29497() {
    return Boolean(_0x192e66);
  }
  return {
    schedule: _0x5b3a45,
    cancel: _0x5c68bb,
    isScheduled: _0xc29497
  };
}
module.exports = {
  createBackgroundPreviewAutoClose: createBackgroundPreviewAutoClose
};
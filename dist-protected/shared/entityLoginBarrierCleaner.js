'use strict';

const PRIMARY_LOGIN_SELECTORS = ["[class*=\"login-portal\"]", "[class*=\"loginPortal\"]", ".login-mask"];
const SECONDARY_LOGIN_SELECTOR = ".dy-anchor-portal, [class*=\"mask\"], [class*=\"Mask\"]";
function removeEntityLoginBarriers(_0x3a59aa) {
  if (!_0x3a59aa?.querySelectorAll) {
    return 0;
  }
  let _0x4865fe = 0;
  try {
    _0x3a59aa.querySelectorAll(PRIMARY_LOGIN_SELECTORS.join(",")).forEach(_0x469003 => {
      const _0x2a73bc = String(_0x469003.innerText || _0x469003.textContent || "");
      if (/登录|扫码|验证码|打开抖音APP/.test(_0x2a73bc)) {
        _0x469003.remove();
        _0x4865fe += 1;
      }
    });
    _0x3a59aa.querySelectorAll(SECONDARY_LOGIN_SELECTOR).forEach(_0x1cdb76 => {
      const _0x1977b0 = String(_0x1cdb76.innerText || _0x1cdb76.textContent || "");
      if (/登录后即可|扫码登录|验证码登录|密码登录/.test(_0x1977b0)) {
        _0x1cdb76.remove();
        _0x4865fe += 1;
      }
    });
    if (_0x4865fe > 0) {
      _0x3a59aa.body?.style?.removeProperty("overflow");
      _0x3a59aa.documentElement?.style?.removeProperty("overflow");
    }
  } catch (_0x23c569) {}
  return _0x4865fe;
}
function createEntityLoginBarrierCleaner({
  documentRef: _0x3cfc64,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  intervalMs = 800
} = {}) {
  let _0x48466b = null;
  function _0x499dd9() {
    return removeEntityLoginBarriers(_0x3cfc64);
  }
  function _0x53e3e2() {
    if (_0x48466b !== null) {
      return;
    }
    _0x499dd9();
    _0x48466b = setIntervalFn(_0x499dd9, intervalMs);
  }
  function _0x50cb3c() {
    if (_0x48466b === null) {
      return;
    }
    clearIntervalFn(_0x48466b);
    _0x48466b = null;
  }
  return {
    start: _0x53e3e2,
    stop: _0x50cb3c,
    clean: _0x499dd9,
    isRunning: () => _0x48466b !== null
  };
}
module.exports = {
  PRIMARY_LOGIN_SELECTORS: PRIMARY_LOGIN_SELECTORS,
  SECONDARY_LOGIN_SELECTOR: SECONDARY_LOGIN_SELECTOR,
  removeEntityLoginBarriers: removeEntityLoginBarriers,
  createEntityLoginBarrierCleaner: createEntityLoginBarrierCleaner
};
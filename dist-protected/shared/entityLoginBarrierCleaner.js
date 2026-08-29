'use strict';

const PRIMARY_LOGIN_SELECTORS = ["[class*=\"login-portal\"]", "[class*=\"loginPortal\"]", ".login-mask"];
const SECONDARY_LOGIN_SELECTOR = ".dy-anchor-portal, [class*=\"mask\"], [class*=\"Mask\"]";
function removeEntityLoginBarriers(arg1) {
  if (!arg1?.querySelectorAll) {
    return 0;
  }
  let num = 0;
  try {
    arg1.querySelectorAll(PRIMARY_LOGIN_SELECTORS.join(",")).forEach(arg1 => {
      const result = String(arg1.innerText || arg1.textContent || "");
      if (/登录|扫码|验证码|打开抖音APP/.test(result)) {
        arg1.remove();
        num += 1;
      }
    });
    arg1.querySelectorAll(SECONDARY_LOGIN_SELECTOR).forEach(arg1 => {
      const result = String(arg1.innerText || arg1.textContent || "");
      if (/登录后即可|扫码登录|验证码登录|密码登录/.test(result)) {
        arg1.remove();
        num += 1;
      }
    });
    if (num > 0) {
      arg1.body?.style?.removeProperty("overflow");
      arg1.documentElement?.style?.removeProperty("overflow");
    }
  } catch (error) {}
  return num;
}
function createEntityLoginBarrierCleaner({
  documentRef: documentRef,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  intervalMs = 800
} = {}) {
  let local = null;
  function clean() {
    return removeEntityLoginBarriers(documentRef);
  }
  function start() {
    if (local !== null) {
      return;
    }
    clean();
    local = setIntervalFn(clean, intervalMs);
  }
  function stop() {
    if (local === null) {
      return;
    }
    clearIntervalFn(local);
    local = null;
  }
  return {
    start: start,
    stop: stop,
    clean: clean,
    isRunning: () => local !== null
  };
}
module.exports = {
  PRIMARY_LOGIN_SELECTORS: PRIMARY_LOGIN_SELECTORS,
  SECONDARY_LOGIN_SELECTOR: SECONDARY_LOGIN_SELECTOR,
  removeEntityLoginBarriers: removeEntityLoginBarriers,
  createEntityLoginBarrierCleaner: createEntityLoginBarrierCleaner
};
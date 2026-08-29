function createAutomationPaintGuard({
  getMainWindow: getMainWindow,
  getVisibleViews: getVisibleViews,
  getPlatformViews: getPlatformViews,
  shouldAttachAutomationView: shouldAttachAutomationView,
  isValidAutomationBounds: isValidAutomationBounds,
  nudgeAutomationViewRepaint: nudgeAutomationViewRepaint,
  nudgeHostCompositor: nudgeHostCompositor,
  intervalMs = 10000
} = {}) {
  let local = null;
  function tick() {
    const local = getMainWindow?.();
    if (!local || local.isDestroyed()) {
      return;
    }
    const local2 = getVisibleViews?.() || getPlatformViews?.();
    if (!local2) {
      return;
    }
    let num = 0;
    for (const [local3, local4] of local2.entries()) {
      if (!shouldAttachAutomationView?.(local3)) {
        continue;
      }
      if (!local4?.webContents || local4.webContents.isDestroyed()) {
        continue;
      }
      if (!local.getBrowserViews().includes(local4)) {
        continue;
      }
      const local2 = local4.getBounds?.();
      if (!isValidAutomationBounds?.(local2)) {
        continue;
      }
      const local5 = local4.webContents.getURL?.() || "";
      if (!local5 || local5 === "about:blank") {
        continue;
      }
      nudgeAutomationViewRepaint?.(local4.webContents, local4);
      num += 1;
    }
    if (num > 0) {
      nudgeHostCompositor?.(local.webContents);
    }
  }
  function start() {
    if (local) {
      return;
    }
    local = setInterval(tick, intervalMs);
    if (typeof local.unref === "function") {
      local.unref();
    }
  }
  function stop() {
    if (!local) {
      return;
    }
    clearInterval(local);
    local = null;
  }
  return {
    start: start,
    stop: stop,
    tick: tick
  };
}
module.exports = {
  createAutomationPaintGuard: createAutomationPaintGuard
};
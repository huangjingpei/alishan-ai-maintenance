const {
  ipcMain
} = require("electron");
const {
  automationWindowManager
} = require("./automationWindowManager");
const {
  automationScreencastBridge
} = require("./automationScreencastBridge");
function setupAutomationIpcRouter(_0xab7a7 = {}) {
  const {
    configureSession: _0x23ab16
  } = _0xab7a7;
  function _0x5e81ff(_0x34826b) {
    if (!_0x34826b) {
      return "";
    }
    for (const _0x46d216 of automationWindowManager.getActiveViewKeys()) {
      const _0x1661ce = automationWindowManager.getAccountWindow(_0x46d216);
      if (_0x1661ce && _0x1661ce.webContents === _0x34826b) {
        return _0x46d216;
      }
    }
    return "";
  }
  try {
    ipcMain.removeHandler("ensure-background-automation-layout");
  } catch (_0x2e2bab) {}
  ipcMain.handle("ensure-background-automation-layout", async (_0x9d8445, {
    viewKey: _0x313b91,
    claimInteractionSlot = false,
    requireComposerSurface = false
  } = {}) => {
    const _0x5bea8d = _0x313b91 || _0x5e81ff(_0x9d8445.sender);
    if (!_0x5bea8d) {
      return {
        ok: false,
        attached: false,
        reason: "view_key_missing"
      };
    }
    try {
      const _0x2a8ed6 = automationWindowManager.getOrCreateAccountWindow(_0x5bea8d, {}, _0x23ab16);
      if (!_0x2a8ed6 || _0x2a8ed6.isDestroyed()) {
        return {
          ok: false,
          attached: false,
          reason: "window_create_failed"
        };
      }
      automationWindowManager.focusAccountWindow(_0x5bea8d);
      return {
        ok: true,
        attached: true,
        visible: true,
        parkedInMainWindow: false,
        interaction: true,
        composerSurface: true,
        interactionSlotAcquired: true,
        interactionSlotWaitedMs: 0
      };
    } catch (_0x4727cd) {
      console.warn("[IpcRouter] 准备独立后台布局异常 (" + _0x5bea8d + "):", _0x4727cd.message || _0x4727cd);
      return {
        ok: false,
        attached: false,
        reason: _0x4727cd.message || "ensure_failed"
      };
    }
  });
  ipcMain.on("focus-automation-view", (_0x5cd4ae, _0x4ed156) => {
    let _0x2d82eb = "";
    if (typeof _0x4ed156 === "string") {
      _0x2d82eb = _0x4ed156;
    } else if (_0x4ed156 && typeof _0x4ed156 === "object") {
      _0x2d82eb = _0x4ed156.viewKey || _0x4ed156.key;
    }
    if (!_0x2d82eb) {
      _0x2d82eb = _0x5e81ff(_0x5cd4ae.sender);
    }
    if (_0x2d82eb) {
      automationWindowManager.focusAccountWindow(_0x2d82eb);
    }
  });
  try {
    ipcMain.removeHandler("release-background-automation-layout");
  } catch (_0x5ed62e) {}
  ipcMain.handle("release-background-automation-layout", async (_0x4cc24e, {
    viewKey: _0x31a1ac,
    preferReacquireMs = 0
  } = {}) => {
    const _0x353ac2 = _0x31a1ac || _0x5e81ff(_0x4cc24e.sender);
    return {
      ok: true,
      released: true,
      interactionSlotReleased: true,
      interactionSlotReserved: false
    };
  });
  ipcMain.on("release-automation-view", (_0x4ce53a, _0x41824f) => {
    let _0x3369ae = "";
    let _0x51ab16 = "user_closed";
    if (typeof _0x41824f === "string") {
      _0x3369ae = _0x41824f;
    } else if (_0x41824f && typeof _0x41824f === "object") {
      _0x3369ae = _0x41824f.viewKey || _0x41824f.key;
      _0x51ab16 = _0x41824f.reason || _0x51ab16;
    }
    if (_0x3369ae) {
      const _0x3aa194 = new Set(["user_closed", "close_idle_card", "close_card", "destroy", "account_removed", "dismiss_card"]);
      if (_0x3aa194.has(_0x51ab16)) {
        automationScreencastBridge.unbindView(_0x3369ae);
        automationWindowManager.destroyAccountWindow(_0x3369ae, _0x51ab16);
      } else {
        automationScreencastBridge.unbindView(_0x3369ae);
      }
    }
  });
  ipcMain.on("sync-automation-view-bounds", (_0x37d9b8, _0x4193f7) => {
    if (!_0x4193f7 || typeof _0x4193f7 !== "object") {
      return;
    }
    const {
      viewKey: _0x41a7e7,
      bounds: _0x48a01d
    } = _0x4193f7;
    if (_0x41a7e7 && _0x48a01d) {
      automationScreencastBridge.syncViewBounds(_0x41a7e7, _0x48a01d, _0x37d9b8.sender.getOwnerBrowserWindow());
    }
  });
}
module.exports = {
  setupAutomationIpcRouter: setupAutomationIpcRouter
};
const {
  ipcMain
} = require("electron");
const {
  automationWindowManager
} = require("./automationWindowManager");
const {
  automationScreencastBridge
} = require("./automationScreencastBridge");
function setupAutomationIpcRouter(options = {}) {
  const {
    configureSession: configureSession
  } = options;
  function fn(arg1) {
    if (!arg1) {
      return "";
    }
    for (const item of automationWindowManager.getActiveViewKeys()) {
      const result = automationWindowManager.getAccountWindow(item);
      if (result && result.webContents === arg1) {
        return item;
      }
    }
    return "";
  }
  try {
    ipcMain.removeHandler("ensure-background-automation-layout");
  } catch (error) {}
  ipcMain.handle("ensure-background-automation-layout", async (arg1, {
    viewKey: viewKey,
    claimInteractionSlot = false,
    requireComposerSurface = false
  } = {}) => {
    const local = viewKey || fn(arg1.sender);
    if (!local) {
      return {
        ok: false,
        attached: false,
        reason: "view_key_missing"
      };
    }
    try {
      const result = automationWindowManager.getOrCreateAccountWindow(local, {}, configureSession);
      if (!result || result.isDestroyed()) {
        return {
          ok: false,
          attached: false,
          reason: "window_create_failed"
        };
      }
      automationWindowManager.focusAccountWindow(local);
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
    } catch (error) {
      console.warn("[IpcRouter] 准备独立后台布局异常 (" + local + "):", error.message || error);
      return {
        ok: false,
        attached: false,
        reason: error.message || "ensure_failed"
      };
    }
  });
  ipcMain.on("focus-automation-view", (arg1, arg2) => {
    let text = "";
    if (typeof arg2 === "string") {
      text = arg2;
    } else if (arg2 && typeof arg2 === "object") {
      text = arg2.viewKey || arg2.key;
    }
    if (!text) {
      text = fn(arg1.sender);
    }
    if (text) {
      automationWindowManager.focusAccountWindow(text);
    }
  });
  try {
    ipcMain.removeHandler("release-background-automation-layout");
  } catch (error) {}
  ipcMain.handle("release-background-automation-layout", async (arg1, {
    viewKey: viewKey,
    preferReacquireMs = 0
  } = {}) => {
    const local = viewKey || fn(arg1.sender);
    return {
      ok: true,
      released: true,
      interactionSlotReleased: true,
      interactionSlotReserved: false
    };
  });
  ipcMain.on("release-automation-view", (arg1, arg2) => {
    let text = "";
    let text2 = "user_closed";
    if (typeof arg2 === "string") {
      text = arg2;
    } else if (arg2 && typeof arg2 === "object") {
      text = arg2.viewKey || arg2.key;
      text2 = arg2.reason || text2;
    }
    if (text) {
      const set = new Set(["user_closed", "close_idle_card", "close_card", "destroy", "account_removed", "dismiss_card"]);
      if (set.has(text2)) {
        automationScreencastBridge.unbindView(text);
        automationWindowManager.destroyAccountWindow(text, text2);
      } else {
        automationScreencastBridge.unbindView(text);
      }
    }
  });
  ipcMain.on("sync-automation-view-bounds", (arg1, arg2) => {
    if (!arg2 || typeof arg2 !== "object") {
      return;
    }
    const {
      viewKey: viewKey,
      bounds: bounds
    } = arg2;
    if (viewKey && bounds) {
      automationScreencastBridge.syncViewBounds(viewKey, bounds, arg1.sender.getOwnerBrowserWindow());
    }
  });
}
module.exports = {
  setupAutomationIpcRouter: setupAutomationIpcRouter
};
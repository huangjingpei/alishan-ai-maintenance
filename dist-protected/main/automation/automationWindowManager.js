const {
  BrowserWindow
} = require("electron");
const {
  getAutomationWindowOptions
} = require("./automationWindowConfig");
class AutomationWindowManager {
  constructor() {
    this.windowsMap = new Map();
  }
  extractAccountId(arg1) {
    if (!arg1) {
      return "";
    }
    if (arg1.startsWith("douyin_")) {
      return arg1.slice("douyin_".length);
    }
    return arg1;
  }
  getOrCreateAccountWindow(arg1, options = {}, arg3 = null) {
    if (!arg1) {
      return null;
    }
    const result = this.windowsMap.get(arg1);
    if (result && result.win && !result.win.isDestroyed()) {
      return result.win;
    }
    const local = options.accountId || this.extractAccountId(arg1);
    const result2 = getAutomationWindowOptions(local, options);
    const browserWindow = new BrowserWindow(result2);
    if (process.platform === "win32") {
      try {
        browserWindow.showInactive();
      } catch (error) {}
    }
    if (typeof arg3 === "function") {
      try {
        arg3(browserWindow.webContents.session, arg1);
      } catch (error) {
        console.warn("[WindowManager] 配置 Session 指纹异常 (" + arg1 + "):", error.message || error);
      }
    }
    const obj = {
      win: browserWindow,
      viewKey: arg1,
      accountId: local,
      createdAt: Date.now()
    };
    this.windowsMap.set(arg1, obj);
    browserWindow.on("closed", () => {
      if (this.windowsMap.get(arg1)?.win === browserWindow) {
        this.windowsMap.delete(arg1);
        console.log("[WindowManager] 独立后台窗口已释放 (" + arg1 + ")");
      }
    });
    browserWindow.webContents.on("crashed", () => {
      console.error("[WindowManager] 账号渲染进程崩溃 (" + arg1 + ")");
      this.destroyAccountWindow(arg1, "renderer_crashed");
    });
    return browserWindow;
  }
  destroyAccountWindow(arg1, text = "user_closed") {
    const result = this.windowsMap.get(arg1);
    if (!result) {
      return false;
    }
    this.windowsMap.delete(arg1);
    const {
      win: win
    } = result;
    if (win && !win.isDestroyed()) {
      try {
        win.removeAllListeners();
        win.webContents?.removeAllListeners();
        win.destroy();
        console.log("[WindowManager] 成功销毁账号窗口 (" + arg1 + ", 原因: " + text + ")");
      } catch (error) {
        console.warn("[WindowManager] 销毁账号窗口异常 (" + arg1 + "):", error.message || error);
      }
    }
    return true;
  }
  getAccountWindow(arg1) {
    const result = this.windowsMap.get(arg1);
    if (result && result.win && !result.win.isDestroyed()) {
      return result.win;
    }
    return null;
  }
  focusAccountWindow(arg1) {
    const result = this.getAccountWindow(arg1);
    if (!result) {
      return false;
    }
    try {
      if (process.platform === "win32" && !result.isVisible()) {
        result.showInactive();
      }
      result.webContents?.focus();
      return true;
    } catch (error) {
      console.warn("[WindowManager] 聚焦独立 WebContents 异常 (" + arg1 + "):", error.message || error);
      return false;
    }
  }
  getActiveViewKeys() {
    const list = [];
    for (const [local, local2] of this.windowsMap.entries()) {
      if (local2.win && !local2.win.isDestroyed()) {
        list.push(local);
      } else {
        this.windowsMap.delete(local);
      }
    }
    return list;
  }
  destroyAll() {
    for (const item of Array.from(this.windowsMap.keys())) {
      this.destroyAccountWindow(item, "app_quit");
    }
  }
}
const automationWindowManager = new AutomationWindowManager();
module.exports = {
  automationWindowManager: automationWindowManager,
  AutomationWindowManager: AutomationWindowManager
};
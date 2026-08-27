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
  extractAccountId(_0x4bef2f) {
    if (!_0x4bef2f) {
      return "";
    }
    if (_0x4bef2f.startsWith("douyin_")) {
      return _0x4bef2f.slice("douyin_".length);
    }
    return _0x4bef2f;
  }
  getOrCreateAccountWindow(_0x5953df, _0x2d6cbe = {}, _0x32ff12 = null) {
    if (!_0x5953df) {
      return null;
    }
    const _0x345455 = this.windowsMap.get(_0x5953df);
    if (_0x345455 && _0x345455.win && !_0x345455.win.isDestroyed()) {
      return _0x345455.win;
    }
    const _0x91345b = _0x2d6cbe.accountId || this.extractAccountId(_0x5953df);
    const _0x3a15e0 = getAutomationWindowOptions(_0x91345b, _0x2d6cbe);
    const _0x3e3c39 = new BrowserWindow(_0x3a15e0);
    if (process.platform === "win32") {
      try {
        _0x3e3c39.showInactive();
      } catch (_0x3bd013) {}
    }
    if (typeof _0x32ff12 === "function") {
      try {
        _0x32ff12(_0x3e3c39.webContents.session, _0x5953df);
      } catch (_0x28adf0) {
        console.warn("[WindowManager] 配置 Session 指纹异常 (" + _0x5953df + "):", _0x28adf0.message || _0x28adf0);
      }
    }
    const _0xd3ddfe = {
      win: _0x3e3c39,
      viewKey: _0x5953df,
      accountId: _0x91345b,
      createdAt: Date.now()
    };
    this.windowsMap.set(_0x5953df, _0xd3ddfe);
    _0x3e3c39.on("closed", () => {
      if (this.windowsMap.get(_0x5953df)?.win === _0x3e3c39) {
        this.windowsMap.delete(_0x5953df);
        console.log("[WindowManager] 独立后台窗口已释放 (" + _0x5953df + ")");
      }
    });
    _0x3e3c39.webContents.on("crashed", () => {
      console.error("[WindowManager] 账号渲染进程崩溃 (" + _0x5953df + ")");
      this.destroyAccountWindow(_0x5953df, "renderer_crashed");
    });
    return _0x3e3c39;
  }
  destroyAccountWindow(_0x22cf4a, _0x513eee = "user_closed") {
    const _0x1940ee = this.windowsMap.get(_0x22cf4a);
    if (!_0x1940ee) {
      return false;
    }
    this.windowsMap.delete(_0x22cf4a);
    const {
      win: _0x4c8f4b
    } = _0x1940ee;
    if (_0x4c8f4b && !_0x4c8f4b.isDestroyed()) {
      try {
        _0x4c8f4b.removeAllListeners();
        _0x4c8f4b.webContents?.removeAllListeners();
        _0x4c8f4b.destroy();
        console.log("[WindowManager] 成功销毁账号窗口 (" + _0x22cf4a + ", 原因: " + _0x513eee + ")");
      } catch (_0x3a6c54) {
        console.warn("[WindowManager] 销毁账号窗口异常 (" + _0x22cf4a + "):", _0x3a6c54.message || _0x3a6c54);
      }
    }
    return true;
  }
  getAccountWindow(_0x2a5f22) {
    const _0x3d0637 = this.windowsMap.get(_0x2a5f22);
    if (_0x3d0637 && _0x3d0637.win && !_0x3d0637.win.isDestroyed()) {
      return _0x3d0637.win;
    }
    return null;
  }
  focusAccountWindow(_0x3448ac) {
    const _0x3409d2 = this.getAccountWindow(_0x3448ac);
    if (!_0x3409d2) {
      return false;
    }
    try {
      if (process.platform === "win32" && !_0x3409d2.isVisible()) {
        _0x3409d2.showInactive();
      }
      _0x3409d2.webContents?.focus();
      return true;
    } catch (_0x16b827) {
      console.warn("[WindowManager] 聚焦独立 WebContents 异常 (" + _0x3448ac + "):", _0x16b827.message || _0x16b827);
      return false;
    }
  }
  getActiveViewKeys() {
    const _0x5557c0 = [];
    for (const [_0x19593c, _0x2ba991] of this.windowsMap.entries()) {
      if (_0x2ba991.win && !_0x2ba991.win.isDestroyed()) {
        _0x5557c0.push(_0x19593c);
      } else {
        this.windowsMap.delete(_0x19593c);
      }
    }
    return _0x5557c0;
  }
  destroyAll() {
    for (const _0x16f717 of Array.from(this.windowsMap.keys())) {
      this.destroyAccountWindow(_0x16f717, "app_quit");
    }
  }
}
const automationWindowManager = new AutomationWindowManager();
module.exports = {
  automationWindowManager: automationWindowManager,
  AutomationWindowManager: AutomationWindowManager
};
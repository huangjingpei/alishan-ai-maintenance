const {
  ipcMain
} = require("electron");
const CREATOR_UPLOAD_URL = "https://creator.douyin.com/creator-micro/content/upload?enter_from=dou_web";
const CREATOR_URL_READY_RE = /^https:\/\/(?:www\.)?creator\.douyin\.com\//i;
const FREE_BLOCK_MSG = "当前未激活专业版，试用期间或升级专业版后可使用创作聚合";
function normalizeViewBounds(_0x239864) {
  const _0xa9ead7 = Math.round(Number(_0x239864?.x));
  const _0x582d8b = Math.round(Number(_0x239864?.y));
  const _0x4ac480 = Math.round(Number(_0x239864?.width));
  const _0x51da1b = Math.round(Number(_0x239864?.height));
  if (![_0xa9ead7, _0x582d8b, _0x4ac480, _0x51da1b].every(Number.isFinite)) {
    return null;
  }
  if (_0x4ac480 < 120 || _0x51da1b < 120) {
    return null;
  }
  return {
    x: Math.max(0, _0xa9ead7),
    y: Math.max(0, _0x582d8b),
    width: Math.max(120, _0x4ac480),
    height: Math.max(120, _0x51da1b)
  };
}
function createCreatorAggregateApi(_0x186a14) {
  const _0x581ae2 = _0x186a14.viewsMap || new Map();
  let _0x36042f = null;
  let _0x2b0f42 = 0;
  let _0x40bc9d = false;
  function _0xfb15f0(_0x434585 = {}) {
    const _0x1c5cff = _0x186a14.getMainWindow?.();
    if (!_0x1c5cff || _0x1c5cff.isDestroyed() || _0x1c5cff.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x1c5cff.webContents.send("creator-view-status", {
        at: Date.now(),
        ..._0x434585
      });
    } catch (_0x367d9a) {}
  }
  function _0x2eff1b(_0x6fcadc, _0x1de105) {
    const _0x24dcef = normalizeViewBounds(_0x1de105);
    if (!_0x6fcadc || _0x6fcadc.webContents?.isDestroyed?.() || !_0x24dcef) {
      return false;
    }
    try {
      _0x6fcadc.setBounds(_0x24dcef);
      return true;
    } catch (_0x5273aa) {
      console.warn("[CreatorAggregate] 更新视图坐标失败: " + _0x5273aa.message);
      return false;
    }
  }
  function _0x361aea(_0x1f5c8b) {
    if (_0x1f5c8b === "light") {
      return "light";
    } else {
      return "dark";
    }
  }
  function _0x1118e7(_0x27c38a, _0x30de9b) {
    if (!_0x27c38a || _0x27c38a.webContents?.isDestroyed?.()) {
      return false;
    }
    const _0x2c30bf = _0x361aea(_0x30de9b);
    try {
      _0x27c38a.setBackgroundColor(_0x2c30bf === "light" ? "#ffffff" : "#171923");
      _0x27c38a.webContents.executeJavaScript("document.documentElement.style.colorScheme = " + JSON.stringify(_0x2c30bf), true).catch(() => {});
      return true;
    } catch (_0x490958) {
      return false;
    }
  }
  function _0x1b894e(_0x164d3b) {
    const _0x444792 = _0x36042f;
    const _0x40c62e = _0x186a14.getMainWindow?.();
    if (!_0x444792?.view || _0x444792.view.webContents?.isDestroyed?.()) {
      return false;
    }
    if (!_0x40c62e || _0x40c62e.isDestroyed()) {
      return false;
    }
    const _0x334dbe = _0x40c62e.getBrowserViews().includes(_0x444792.view);
    if (_0x164d3b) {
      if (!_0x334dbe) {
        try {
          _0x40c62e.addBrowserView(_0x444792.view);
        } catch (_0x339fc1) {
          console.warn("[CreatorAggregate] 重新挂载失败: " + _0x339fc1.message);
          return false;
        }
        if (_0x444792.bounds) {
          _0x2eff1b(_0x444792.view, _0x444792.bounds);
        }
        _0x186a14.safeSetTopBrowserView(_0x444792.view, {
          context: "creator-reattach:" + _0x444792.viewKey
        });
      }
      _0x444792.detachedForOverlay = false;
      return true;
    }
    if (_0x334dbe) {
      try {
        _0x40c62e.removeBrowserView(_0x444792.view);
      } catch (_0x2fc737) {
        console.warn("[CreatorAggregate] 临时摘除失败: " + _0x2fc737.message);
        return false;
      }
    }
    _0x444792.detachedForOverlay = true;
    return true;
  }
  function _0x1a04b8(_0x3cc336 = "closed", {
    notify = true
  } = {}) {
    _0x2b0f42 += 1;
    const _0x5c666f = _0x36042f;
    if (!_0x5c666f) {
      return false;
    }
    _0x36042f = null;
    _0x581ae2.delete(_0x5c666f.viewKey);
    if (_0x5c666f.readyProbeTimer) {
      clearTimeout(_0x5c666f.readyProbeTimer);
      _0x5c666f.readyProbeTimer = null;
    }
    _0x186a14.destroyAutomationBrowserView(_0x5c666f.view, _0x5c666f.viewKey, "creator");
    if (notify) {
      _0xfb15f0({
        status: "closed",
        viewKey: _0x5c666f.viewKey,
        accountId: _0x5c666f.accountId,
        reason: _0x3cc336
      });
    }
    console.log("[CreatorAggregate] 视图已关闭: " + _0x5c666f.viewKey + " (" + _0x3cc336 + ")");
    return true;
  }
  async function _0x292f56({
    accountId: _0x10bc94,
    name = "",
    proxy = null,
    theme = "dark",
    bounds = null
  } = {}) {
    if (typeof _0x186a14.ensureAccess === "function" && !_0x186a14.ensureAccess()) {
      return {
        success: false,
        message: FREE_BLOCK_MSG
      };
    }
    const _0x5b1986 = String(_0x10bc94 || "").trim();
    if (!_0x5b1986) {
      return {
        success: false,
        message: "缺少抖音账号信息"
      };
    }
    const _0x5ee1ca = _0x186a14.getMainWindow?.();
    if (!_0x5ee1ca || _0x5ee1ca.isDestroyed()) {
      return {
        success: false,
        message: "主窗口不可用"
      };
    }
    const _0x296234 = "douyin_" + _0x5b1986;
    const _0x274f32 = normalizeViewBounds(bounds);
    if (!_0x274f32) {
      return {
        success: false,
        message: "创作窗口尺寸无效"
      };
    }
    try {
      _0x186a14.destroyConflictingView?.("creator-opened", {
        notify: true
      });
    } catch (_0x4a11cc) {}
    const _0x2226d6 = _0x36042f;
    if (_0x2226d6?.viewKey === _0x296234 && !_0x2226d6.view?.webContents?.isDestroyed?.()) {
      _0x186a14.hideAutomationViews?.();
      _0x2226d6.bounds = _0x274f32;
      _0x2eff1b(_0x2226d6.view, _0x274f32);
      if (!_0x5ee1ca.getBrowserViews().includes(_0x2226d6.view)) {
        _0x5ee1ca.addBrowserView(_0x2226d6.view);
      }
      _0x186a14.safeSetTopBrowserView(_0x2226d6.view, {
        context: "creator-reopen:" + _0x296234
      });
      try {
        _0x2226d6.view.webContents.setUserAgent(_0x186a14.getAutomationUserAgent());
      } catch (_0xb9055) {}
      _0x1118e7(_0x2226d6.view, theme);
      _0xfb15f0({
        status: _0x2226d6.status || "ready",
        viewKey: _0x296234,
        accountId: _0x5b1986,
        url: _0x2226d6.view.webContents.getURL()
      });
      return {
        success: true,
        reused: true,
        viewKey: _0x296234
      };
    }
    _0x1a04b8("account-switch", {
      notify: false
    });
    const _0x28e349 = ++_0x2b0f42;
    const _0x458cab = new _0x186a14.BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: "persist:automation:" + _0x296234,
        backgroundThrottling: true,
        spellcheck: true
      }
    });
    const _0x282647 = {
      view: _0x458cab,
      viewKey: _0x296234,
      accountId: _0x5b1986,
      name: String(name || ""),
      status: "loading",
      generation: _0x28e349,
      bounds: _0x274f32,
      theme: _0x361aea(theme)
    };
    _0x36042f = _0x282647;
    _0x581ae2.set(_0x296234, _0x458cab);
    _0x1118e7(_0x458cab, _0x282647.theme);
    _0x458cab.webContents.setUserAgent(_0x186a14.getAutomationUserAgent());
    _0x186a14.attachProtocolGuard(_0x458cab.webContents, _0x296234 + ":creator");
    _0x186a14.configureAutomationSession(_0x458cab.webContents.session, _0x296234);
    const _0x2f0f1f = () => _0x36042f === _0x282647 && _0x282647.generation === _0x28e349 && !_0x458cab.webContents.isDestroyed();
    const _0x1b712e = (_0x231078, _0x26ebb4 = {}) => {
      if (!_0x2f0f1f()) {
        return;
      }
      _0x282647.status = _0x231078;
      _0xfb15f0({
        status: _0x231078,
        viewKey: _0x296234,
        accountId: _0x5b1986,
        ..._0x26ebb4
      });
    };
    const _0x56d16f = () => {
      if (!_0x2f0f1f()) {
        return;
      }
      const _0xaa0d87 = _0x458cab.webContents.getURL();
      if (!CREATOR_URL_READY_RE.test(_0xaa0d87)) {
        return;
      }
      _0x1b712e("ready", {
        url: _0xaa0d87
      });
    };
    const _0x2c70b4 = () => {
      if (_0x282647.readyProbeTimer) {
        clearTimeout(_0x282647.readyProbeTimer);
      }
      _0x282647.readyProbeTimer = setTimeout(async () => {
        _0x282647.readyProbeTimer = null;
        if (!_0x2f0f1f() || _0x282647.status !== "loading") {
          return;
        }
        try {
          const _0x4b2762 = await _0x458cab.webContents.executeJavaScript("document.readyState", true);
          if (_0x4b2762 === "interactive" || _0x4b2762 === "complete") {
            _0x56d16f();
          }
        } catch (_0x3cf1a8) {}
      }, 3000);
    };
    _0x458cab.webContents.on("did-start-loading", () => {
      _0x1b712e("loading");
      _0x2c70b4();
    });
    _0x458cab.webContents.on("dom-ready", () => {
      _0x1118e7(_0x458cab, _0x282647.theme);
      _0x2c70b4();
    });
    try {
      _0x458cab.webContents.setMaxListeners?.(20);
    } catch (_0x16b687) {}
    _0x458cab.webContents.removeAllListeners("did-stop-loading");
    _0x458cab.webContents.on("did-stop-loading", _0x56d16f);
    _0x458cab.webContents.on("did-finish-load", _0x56d16f);
    _0x458cab.webContents.on("did-navigate", (_0x185a93, _0x37bdd7) => {
      _0x1b712e(_0x282647.status || "loading", {
        url: _0x37bdd7
      });
    });
    _0x458cab.webContents.on("did-navigate-in-page", (_0x1a0e86, _0x363b43) => {
      _0x1b712e(_0x282647.status || "ready", {
        url: _0x363b43
      });
    });
    _0x458cab.webContents.on("did-fail-load", (_0x33b879, _0x23c213, _0x2d1c87, _0x88bf61, _0x433bc7) => {
      if (!_0x433bc7 || _0x23c213 === -3) {
        return;
      }
      _0x1b712e("error", {
        url: _0x88bf61,
        message: _0x2d1c87 || "页面加载失败 (" + _0x23c213 + ")"
      });
    });
    _0x458cab.webContents.on("render-process-gone", (_0x300f32, _0x4dedf9 = {}) => {
      _0x1b712e("error", {
        message: "创作页面异常退出：" + (_0x4dedf9.reason || "unknown")
      });
    });
    _0x458cab.webContents.on("unresponsive", () => {
      _0x1b712e("error", {
        message: "创作页面暂时无响应，可点击刷新重试"
      });
    });
    _0x186a14.hideAutomationViews?.();
    _0x2eff1b(_0x458cab, _0x274f32);
    _0x5ee1ca.addBrowserView(_0x458cab);
    _0x186a14.safeSetTopBrowserView(_0x458cab, {
      context: "creator-open:" + _0x296234
    });
    _0x1b712e("loading", {
      url: CREATOR_UPLOAD_URL
    });
    await _0x186a14.bindAutomationViewProxy({
      proxy: proxy
    }, _0x296234, _0x458cab.webContents.session);
    if (!_0x2f0f1f()) {
      return {
        success: false,
        superseded: true,
        message: "账号已切换"
      };
    }
    try {
      await _0x458cab.webContents.loadURL(CREATOR_UPLOAD_URL);
      if (!_0x2f0f1f()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      return {
        success: true,
        reused: false,
        viewKey: _0x296234,
        url: _0x458cab.webContents.getURL()
      };
    } catch (_0x793259) {
      if (!_0x2f0f1f()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      _0x1b712e("error", {
        message: _0x793259.message || "创作页面加载失败"
      });
      return {
        success: false,
        viewKey: _0x296234,
        message: _0x793259.message || "创作页面加载失败"
      };
    }
  }
  async function _0x5ef7e3({
    viewKey: _0x58f497
  } = {}) {
    const _0x333fe5 = _0x36042f;
    if (!_0x333fe5 || _0x333fe5.view?.webContents?.isDestroyed?.()) {
      return {
        success: false,
        message: "创作窗口尚未打开"
      };
    }
    if (_0x58f497 && _0x333fe5.viewKey !== _0x58f497) {
      return {
        success: false,
        message: "当前账号已切换"
      };
    }
    _0x333fe5.status = "loading";
    _0xfb15f0({
      status: "loading",
      viewKey: _0x333fe5.viewKey,
      accountId: _0x333fe5.accountId
    });
    try {
      await _0x333fe5.view.webContents.reload();
      return {
        success: true
      };
    } catch (_0x38e82d) {
      return {
        success: false,
        message: _0x38e82d.message || "刷新失败"
      };
    }
  }
  function _0xa4d474({
    viewKey: _0x28d5cc,
    bounds: _0x3f3784
  } = {}) {
    const _0x497b55 = _0x36042f;
    if (!_0x497b55 || _0x28d5cc && _0x497b55.viewKey !== _0x28d5cc) {
      return;
    }
    const _0x75b983 = normalizeViewBounds(_0x3f3784);
    if (!_0x75b983) {
      return;
    }
    _0x497b55.bounds = _0x75b983;
    if (_0x497b55.detachedForOverlay) {
      return;
    }
    _0x2eff1b(_0x497b55.view, _0x75b983);
  }
  function _0x3d5119(_0x4b0ce9) {
    const _0x5c8b7b = _0x36042f;
    if (!_0x5c8b7b || _0x5c8b7b.view?.webContents?.isDestroyed?.()) {
      return false;
    }
    _0x5c8b7b.theme = _0x361aea(_0x4b0ce9);
    return _0x1118e7(_0x5c8b7b.view, _0x5c8b7b.theme);
  }
  function _0xeb9a97() {
    const _0xdf7c07 = _0x36042f;
    const _0x10d14f = _0x186a14.getMainWindow?.();
    if (!_0xdf7c07 || _0xdf7c07.view?.webContents?.isDestroyed?.()) {
      return {
        active: false,
        count: 0
      };
    }
    const _0x1fe1a5 = !!_0x10d14f && !_0x10d14f.isDestroyed() && !!_0x10d14f.getBrowserViews().includes(_0xdf7c07.view);
    return {
      active: true,
      count: _0x581ae2.size,
      viewKey: _0xdf7c07.viewKey,
      accountId: _0xdf7c07.accountId,
      status: _0xdf7c07.status,
      url: _0xdf7c07.view.webContents.getURL(),
      attached: _0x1fe1a5
    };
  }
  function _0xb1a2b9() {
    if (_0x40bc9d) {
      return;
    }
    _0x40bc9d = true;
    ipcMain.handle("open-creator-view", async (_0x39de3b, _0x12c7d3 = {}) => {
      try {
        return await _0x292f56(_0x12c7d3);
      } catch (_0x2fd6d7) {
        console.error("[CreatorAggregate] 打开失败:", _0x2fd6d7);
        return {
          success: false,
          message: _0x2fd6d7.message || "打开创作视图失败"
        };
      }
    });
    ipcMain.on("update-creator-view-bounds", (_0x55af19, _0x1a4ae7 = {}) => {
      _0xa4d474(_0x1a4ae7);
    });
    ipcMain.on("set-creator-view-attached", (_0x43cd31, {
      attached = true
    } = {}) => {
      _0x1b894e(!!attached);
    });
    ipcMain.on("set-creator-view-theme", (_0x1d3ff1, {
      theme = "dark"
    } = {}) => {
      _0x3d5119(theme);
    });
    ipcMain.handle("reload-creator-view", async (_0x5baa5c, _0x3ed1ef = {}) => _0x5ef7e3(_0x3ed1ef));
    ipcMain.on("destroy-creator-view", (_0x558358, {
      reason = "renderer-closed"
    } = {}) => {
      _0x1a04b8(reason);
    });
    ipcMain.handle("get-creator-view-state", () => _0xeb9a97());
  }
  return {
    CREATOR_UPLOAD_URL: CREATOR_UPLOAD_URL,
    FREE_BLOCK_MSG: FREE_BLOCK_MSG,
    creatorViewsMap: _0x581ae2,
    registerIpc: _0xb1a2b9,
    openView: _0x292f56,
    destroyActive: _0x1a04b8,
    setAttached: _0x1b894e,
    setTheme: _0x3d5119,
    getState: _0xeb9a97,
    getActiveState: () => _0x36042f
  };
}
module.exports = {
  CREATOR_UPLOAD_URL: CREATOR_UPLOAD_URL,
  FREE_BLOCK_MSG: FREE_BLOCK_MSG,
  createCreatorAggregateApi: createCreatorAggregateApi
};
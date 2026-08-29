const {
  ipcMain
} = require("electron");
const CREATOR_UPLOAD_URL = "https://creator.douyin.com/creator-micro/content/upload?enter_from=dou_web";
const CREATOR_URL_READY_RE = /^https:\/\/(?:www\.)?creator\.douyin\.com\//i;
const FREE_BLOCK_MSG = "当前未激活专业版，试用期间或升级专业版后可使用创作聚合";
function normalizeViewBounds(arg1) {
  const result = Math.round(Number(arg1?.x));
  const result2 = Math.round(Number(arg1?.y));
  const result3 = Math.round(Number(arg1?.width));
  const result4 = Math.round(Number(arg1?.height));
  if (![result, result2, result3, result4].every(Number.isFinite)) {
    return null;
  }
  if (result3 < 120 || result4 < 120) {
    return null;
  }
  return {
    x: Math.max(0, result),
    y: Math.max(0, result2),
    width: Math.max(120, result3),
    height: Math.max(120, result4)
  };
}
function createCreatorAggregateApi(arg1) {
  const local = arg1.viewsMap || new Map();
  let local2 = null;
  let num = 0;
  let flag = false;
  function fn(options = {}) {
    const local = arg1.getMainWindow?.();
    if (!local || local.isDestroyed() || local.webContents.isDestroyed()) {
      return;
    }
    try {
      local.webContents.send("creator-view-status", {
        at: Date.now(),
        ...options
      });
    } catch (error) {}
  }
  function fn2(arg1, arg2) {
    const result = normalizeViewBounds(arg2);
    if (!arg1 || arg1.webContents?.isDestroyed?.() || !result) {
      return false;
    }
    try {
      arg1.setBounds(result);
      return true;
    } catch (error) {
      console.warn("[CreatorAggregate] 更新视图坐标失败: " + error.message);
      return false;
    }
  }
  function fn3(arg1) {
    if (arg1 === "light") {
      return "light";
    } else {
      return "dark";
    }
  }
  function fn4(arg1, arg2) {
    if (!arg1 || arg1.webContents?.isDestroyed?.()) {
      return false;
    }
    const result = fn3(arg2);
    try {
      arg1.setBackgroundColor(result === "light" ? "#ffffff" : "#171923");
      arg1.webContents.executeJavaScript("document.documentElement.style.colorScheme = " + JSON.stringify(result), true).catch(() => {});
      return true;
    } catch (error) {
      return false;
    }
  }
  function setAttached(arg12) {
    const local = local2;
    const local3 = arg1.getMainWindow?.();
    if (!local?.view || local.view.webContents?.isDestroyed?.()) {
      return false;
    }
    if (!local3 || local3.isDestroyed()) {
      return false;
    }
    const result = local3.getBrowserViews().includes(local.view);
    if (arg12) {
      if (!result) {
        try {
          local3.addBrowserView(local.view);
        } catch (error) {
          console.warn("[CreatorAggregate] 重新挂载失败: " + error.message);
          return false;
        }
        if (local.bounds) {
          fn2(local.view, local.bounds);
        }
        arg1.safeSetTopBrowserView(local.view, {
          context: "creator-reattach:" + local.viewKey
        });
      }
      local.detachedForOverlay = false;
      return true;
    }
    if (result) {
      try {
        local3.removeBrowserView(local.view);
      } catch (error) {
        console.warn("[CreatorAggregate] 临时摘除失败: " + error.message);
        return false;
      }
    }
    local.detachedForOverlay = true;
    return true;
  }
  function destroyActive(text = "closed", {
    notify = true
  } = {}) {
    num += 1;
    const local3 = local2;
    if (!local3) {
      return false;
    }
    local2 = null;
    local.delete(local3.viewKey);
    if (local3.readyProbeTimer) {
      clearTimeout(local3.readyProbeTimer);
      local3.readyProbeTimer = null;
    }
    arg1.destroyAutomationBrowserView(local3.view, local3.viewKey, "creator");
    if (notify) {
      fn({
        status: "closed",
        viewKey: local3.viewKey,
        accountId: local3.accountId,
        reason: text
      });
    }
    console.log("[CreatorAggregate] 视图已关闭: " + local3.viewKey + " (" + text + ")");
    return true;
  }
  async function openView({
    accountId: accountId,
    name = "",
    proxy = null,
    theme = "dark",
    bounds = null
  } = {}) {
    if (typeof arg1.ensureAccess === "function" && !arg1.ensureAccess()) {
      return {
        success: false,
        message: FREE_BLOCK_MSG
      };
    }
    const result = String(accountId || "").trim();
    if (!result) {
      return {
        success: false,
        message: "缺少抖音账号信息"
      };
    }
    const local3 = arg1.getMainWindow?.();
    if (!local3 || local3.isDestroyed()) {
      return {
        success: false,
        message: "主窗口不可用"
      };
    }
    const value = "douyin_" + result;
    const result2 = normalizeViewBounds(bounds);
    if (!result2) {
      return {
        success: false,
        message: "创作窗口尺寸无效"
      };
    }
    try {
      arg1.destroyConflictingView?.("creator-opened", {
        notify: true
      });
    } catch (error) {}
    const local4 = local2;
    if (local4?.viewKey === value && !local4.view?.webContents?.isDestroyed?.()) {
      arg1.hideAutomationViews?.();
      local4.bounds = result2;
      fn2(local4.view, result2);
      if (!local3.getBrowserViews().includes(local4.view)) {
        local3.addBrowserView(local4.view);
      }
      arg1.safeSetTopBrowserView(local4.view, {
        context: "creator-reopen:" + value
      });
      try {
        local4.view.webContents.setUserAgent(arg1.getAutomationUserAgent());
      } catch (error) {}
      fn4(local4.view, theme);
      fn({
        status: local4.status || "ready",
        viewKey: value,
        accountId: result,
        url: local4.view.webContents.getURL()
      });
      return {
        success: true,
        reused: true,
        viewKey: value
      };
    }
    destroyActive("account-switch", {
      notify: false
    });
    const local5 = ++num;
    const local6 = new arg1.BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        partition: "persist:automation:" + value,
        backgroundThrottling: true,
        spellcheck: true
      }
    });
    const obj = {
      view: local6,
      viewKey: value,
      accountId: result,
      name: String(name || ""),
      status: "loading",
      generation: local5,
      bounds: result2,
      theme: fn3(theme)
    };
    local2 = obj;
    local.set(value, local6);
    fn4(local6, obj.theme);
    local6.webContents.setUserAgent(arg1.getAutomationUserAgent());
    arg1.attachProtocolGuard(local6.webContents, value + ":creator");
    arg1.configureAutomationSession(local6.webContents.session, value);
    const local7 = () => local2 === obj && obj.generation === local5 && !local6.webContents.isDestroyed();
    const local8 = (arg1, options = {}) => {
      if (!local7()) {
        return;
      }
      obj.status = arg1;
      fn({
        status: arg1,
        viewKey: value,
        accountId: result,
        ...options
      });
    };
    const local9 = () => {
      if (!local7()) {
        return;
      }
      const result = local6.webContents.getURL();
      if (!CREATOR_URL_READY_RE.test(result)) {
        return;
      }
      local8("ready", {
        url: result
      });
    };
    const local10 = () => {
      if (obj.readyProbeTimer) {
        clearTimeout(obj.readyProbeTimer);
      }
      obj.readyProbeTimer = setTimeout(async () => {
        obj.readyProbeTimer = null;
        if (!local7() || obj.status !== "loading") {
          return;
        }
        try {
          const result = await local6.webContents.executeJavaScript("document.readyState", true);
          if (result === "interactive" || result === "complete") {
            local9();
          }
        } catch (error) {}
      }, 3000);
    };
    local6.webContents.on("did-start-loading", () => {
      local8("loading");
      local10();
    });
    local6.webContents.on("dom-ready", () => {
      fn4(local6, obj.theme);
      local10();
    });
    try {
      local6.webContents.setMaxListeners?.(20);
    } catch (error) {}
    local6.webContents.removeAllListeners("did-stop-loading");
    local6.webContents.on("did-stop-loading", local9);
    local6.webContents.on("did-finish-load", local9);
    local6.webContents.on("did-navigate", (arg1, arg2) => {
      local8(obj.status || "loading", {
        url: arg2
      });
    });
    local6.webContents.on("did-navigate-in-page", (arg1, arg2) => {
      local8(obj.status || "ready", {
        url: arg2
      });
    });
    local6.webContents.on("did-fail-load", (arg1, arg2, arg3, arg4, arg5) => {
      if (!arg5 || arg2 === -3) {
        return;
      }
      local8("error", {
        url: arg4,
        message: arg3 || "页面加载失败 (" + arg2 + ")"
      });
    });
    local6.webContents.on("render-process-gone", (arg1, options = {}) => {
      local8("error", {
        message: "创作页面异常退出：" + (options.reason || "unknown")
      });
    });
    local6.webContents.on("unresponsive", () => {
      local8("error", {
        message: "创作页面暂时无响应，可点击刷新重试"
      });
    });
    arg1.hideAutomationViews?.();
    fn2(local6, result2);
    local3.addBrowserView(local6);
    arg1.safeSetTopBrowserView(local6, {
      context: "creator-open:" + value
    });
    local8("loading", {
      url: CREATOR_UPLOAD_URL
    });
    await arg1.bindAutomationViewProxy({
      proxy: proxy
    }, value, local6.webContents.session);
    if (!local7()) {
      return {
        success: false,
        superseded: true,
        message: "账号已切换"
      };
    }
    try {
      await local6.webContents.loadURL(CREATOR_UPLOAD_URL);
      if (!local7()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      return {
        success: true,
        reused: false,
        viewKey: value,
        url: local6.webContents.getURL()
      };
    } catch (error) {
      if (!local7()) {
        return {
          success: false,
          superseded: true,
          message: "账号已切换"
        };
      }
      local8("error", {
        message: error.message || "创作页面加载失败"
      });
      return {
        success: false,
        viewKey: value,
        message: error.message || "创作页面加载失败"
      };
    }
  }
  async function fn8({
    viewKey: viewKey
  } = {}) {
    const local = local2;
    if (!local || local.view?.webContents?.isDestroyed?.()) {
      return {
        success: false,
        message: "创作窗口尚未打开"
      };
    }
    if (viewKey && local.viewKey !== viewKey) {
      return {
        success: false,
        message: "当前账号已切换"
      };
    }
    local.status = "loading";
    fn({
      status: "loading",
      viewKey: local.viewKey,
      accountId: local.accountId
    });
    try {
      await local.view.webContents.reload();
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "刷新失败"
      };
    }
  }
  function fn9({
    viewKey: viewKey,
    bounds: bounds
  } = {}) {
    const local = local2;
    if (!local || viewKey && local.viewKey !== viewKey) {
      return;
    }
    const result = normalizeViewBounds(bounds);
    if (!result) {
      return;
    }
    local.bounds = result;
    if (local.detachedForOverlay) {
      return;
    }
    fn2(local.view, result);
  }
  function setTheme(arg1) {
    const local = local2;
    if (!local || local.view?.webContents?.isDestroyed?.()) {
      return false;
    }
    local.theme = fn3(arg1);
    return fn4(local.view, local.theme);
  }
  function getState() {
    const local3 = local2;
    const local4 = arg1.getMainWindow?.();
    if (!local3 || local3.view?.webContents?.isDestroyed?.()) {
      return {
        active: false,
        count: 0
      };
    }
    const local5 = !!local4 && !local4.isDestroyed() && !!local4.getBrowserViews().includes(local3.view);
    return {
      active: true,
      count: local.size,
      viewKey: local3.viewKey,
      accountId: local3.accountId,
      status: local3.status,
      url: local3.view.webContents.getURL(),
      attached: local5
    };
  }
  function registerIpc() {
    if (flag) {
      return;
    }
    flag = true;
    ipcMain.handle("open-creator-view", async (arg1, options = {}) => {
      try {
        return await openView(options);
      } catch (error) {
        console.error("[CreatorAggregate] 打开失败:", error);
        return {
          success: false,
          message: error.message || "打开创作视图失败"
        };
      }
    });
    ipcMain.on("update-creator-view-bounds", (arg1, options = {}) => {
      fn9(options);
    });
    ipcMain.on("set-creator-view-attached", (arg1, {
      attached = true
    } = {}) => {
      setAttached(!!attached);
    });
    ipcMain.on("set-creator-view-theme", (arg1, {
      theme = "dark"
    } = {}) => {
      setTheme(theme);
    });
    ipcMain.handle("reload-creator-view", async (arg1, options = {}) => fn8(options));
    ipcMain.on("destroy-creator-view", (arg1, {
      reason = "renderer-closed"
    } = {}) => {
      destroyActive(reason);
    });
    ipcMain.handle("get-creator-view-state", () => getState());
  }
  return {
    CREATOR_UPLOAD_URL: CREATOR_UPLOAD_URL,
    FREE_BLOCK_MSG: FREE_BLOCK_MSG,
    creatorViewsMap: local,
    registerIpc: registerIpc,
    openView: openView,
    destroyActive: destroyActive,
    setAttached: setAttached,
    setTheme: setTheme,
    getState: getState,
    getActiveState: () => local2
  };
}
module.exports = {
  CREATOR_UPLOAD_URL: CREATOR_UPLOAD_URL,
  FREE_BLOCK_MSG: FREE_BLOCK_MSG,
  createCreatorAggregateApi: createCreatorAggregateApi
};
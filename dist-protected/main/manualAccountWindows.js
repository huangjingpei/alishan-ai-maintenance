'use strict';

const path = require("path");
const fs = require("fs");
const {
  app,
  BrowserWindow,
  ipcMain,
  shell
} = require("electron");
const {
  isBlockedExternalProtocol,
  isAllowedExternalOpenUrl,
  logBlockedExternalProtocol
} = require("./protocolGuard");
const {
  getLeadCommentLocatePageSource,
  getLeadCommentPausePageSource
} = require("../shared/leadCommentLocatePage");
const {
  handleStripFrameBlockingHeaders
} = require("./stripFrameBlockingHeaders");
function registerManualAccountWindows(arg1) {
  const {
    store: store,
    getActiveManualWindows: getActiveManualWindows,
    ensureXianyuAccess: ensureXianyuAccess,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    configureAutomationSession: configureAutomationSession,
    setRequestHeader: setRequestHeader,
    automationUserAgent: automationUserAgent,
    automationAcceptLanguage: automationAcceptLanguage
  } = arg1;
  function fn(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    const result = String(arg2?.cid || arg2?.commentId || "").trim();
    const result2 = String(arg2?.nickname || "").trim();
    const result3 = String(arg2?.content || arg2?.comment || "").trim();
    if (!result && !result2 && !result3) {
      return;
    }
    const value = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    arg1._leadCommentLocateToken = value;
    let flag = false;
    const local = async () => {
      if (arg1.isDestroyed() || arg1._leadCommentLocateToken !== value) {
        return;
      }
      const result4 = Date.now();
      try {
        await arg1.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
      } catch (error) {}
      while (Date.now() - result4 < 28000) {
        if (arg1.isDestroyed() || arg1._leadCommentLocateToken !== value) {
          return;
        }
        try {
          await arg1.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
          const result4 = await arg1.webContents.executeJavaScript(getLeadCommentLocatePageSource({
            cid: result,
            nickname: result2,
            content: result3
          }), true);
          if (result4?.ok) {
            console.log("[Main] 线索评论已定位 cid=" + (result4.cid || result || "") + " score=" + (result4.score || 0));
            return;
          }
        } catch (error) {
          console.warn("[Main] 线索评论定位脚本:", error?.message || error);
        }
        await new Promise(arg1 => setTimeout(arg1, 900));
      }
      console.warn("[Main] 线索评论定位超时");
    };
    const local2 = () => {
      if (flag || arg1.isDestroyed() || arg1._leadCommentLocateToken !== value) {
        return;
      }
      flag = true;
      setTimeout(local, 1400);
    };
    arg1.webContents.once("did-finish-load", local2);
    setTimeout(local2, 8000);
  }
  ipcMain.on("open-in-account-context", (arg1, {
    url: url,
    accountId: accountId,
    platform: platform,
    locateComment: locateComment
  }) => {
    if (!url) {
      return;
    }
    if (platform === "xianyu" && !ensureXianyuAccess()) {
      return;
    }
    const result = getActiveManualWindows();
    const value = accountId && accountId !== "default" ? platform + "_" + accountId : platform;
    const value2 = "persist:automation:" + value;
    let local = url;
    try {
      const url = new URL(local);
      url.searchParams.set("from_tab_name", "main");
      local = url.toString();
    } catch (error) {
      if (local.includes("?")) {
        if (!local.includes("from_tab_name=")) {
          local += "&from_tab_name=main";
        }
      } else {
        local += "?from_tab_name=main";
      }
    }
    const result2 = result.get(value);
    if (result2 && !result2.isDestroyed()) {
      console.log("[Main] 单窗口复用 → Electron loadURL 重加载, Partition: " + value2);
      console.log("[Main]   目标: " + local);
      if (result2._isOffScreen && result2._lastBounds) {
        result2.setBounds(result2._lastBounds);
        result2._isOffScreen = false;
      }
      if (!result2.isVisible()) {
        result2.show();
      }
      if (result2.isMinimized()) {
        result2.restore();
      }
      result2.focus();
      const value = platform === "xianyu" ? "https://www.goofish.com/" : "https://www.douyin.com/";
      result2.loadURL(local, {
        httpReferrer: value
      });
      fn(result2, locateComment);
      return;
    }
    console.log("[Main] 首次创建独立视图窗口, Partition: " + value2);
    let result3 = path.join(__dirname, "..", "manual-view-preload.js");
    if (app.isPackaged) {
      const result = store.get("latest_resource_path");
      if (result && fs.existsSync(path.join(result, "manual-view-preload.js"))) {
        result3 = path.join(result, "manual-view-preload.js");
      }
    }
    let browserWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      title: "获客雷达 - 独立账号视图",
      webPreferences: {
        partition: value2,
        nodeIntegration: false,
        contextIsolation: true,
        preload: result3,
        backgroundThrottling: true,
        spellcheck: false
      },
      autoHideMenuBar: app.isPackaged
    });
    applyPackagedWindowMenuPolicy(browserWindow);
    const value3 = browserWindow.webContents.session;
    result.set(value, browserWindow);
    if (platform === "xianyu") {
      browserWindow.setTitle("获客雷达 - 闲鱼独立账号视图");
      browserWindow.webContents.setUserAgent(automationUserAgent);
      value3.setUserAgent(automationUserAgent, automationAcceptLanguage);
      value3.webRequest.onBeforeSendHeaders({
        urls: ["*://*.goofish.com/*", "*://*.taobao.com/*", "*://*.alicdn.com/*"]
      }, (arg1, arg2) => {
        const local = arg1.requestHeaders || {};
        local["User-Agent"] = automationUserAgent;
        local["Accept-Language"] = automationAcceptLanguage;
        arg2({
          requestHeaders: local
        });
      });
    } else {
      browserWindow.webContents.setUserAgent(automationUserAgent);
      configureAutomationSession(value3, value);
    }
    value3.webRequest.onBeforeSendHeaders({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, (arg1, arg2) => {
      const local = arg1.requestHeaders || {};
      setRequestHeader(local, "User-Agent", automationUserAgent);
      setRequestHeader(local, "Accept-Language", automationAcceptLanguage);
      if (!app.isPackaged && arg1.url.includes("/aweme/v1/web/user/profile/other/")) {
        console.log("[🔬 API Request Headers] URL: " + arg1.url);
        console.log("[🔬 API Request Headers] Headers: " + JSON.stringify(local, null, 2));
      }
      arg2({
        requestHeaders: local
      });
    });
    value3.webRequest.onHeadersReceived({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, handleStripFrameBlockingHeaders);
    browserWindow.on("close", arg1 => {
      if (!app.isQuitting) {
        arg1.preventDefault();
        if (!browserWindow.isMinimized() && !browserWindow.isMaximized()) {
          browserWindow._lastBounds = browserWindow.getBounds();
        }
        browserWindow.setPosition(-10000, -10000);
        browserWindow._isOffScreen = true;
        console.log("[Main] 用户手动关闭独立视图窗口，已拦截并移至屏幕外休眠以保留完整会话上下文, Partition: " + value2);
      }
    });
    browserWindow.on("closed", () => {
      result.delete(value);
      if (browserWindow) {
        browserWindow.removeAllListeners();
        browserWindow = null;
      }
    });
    if (!app.isPackaged) {
      browserWindow.webContents.on("console-message", (arg1, arg2, arg3, arg4, arg5) => {
        const list = ["DEBUG", "LOG", "WARNING", "ERROR"];
        const local = list[arg2] || "LOG";
        if (arg3.includes("Failed to load resource") && !arg3.includes("aweme/v1")) {
          return;
        }
        console.log("[Browser Console][" + local + "] " + arg3 + " (Source: " + path.basename(arg5 || "") + ":" + arg4 + ")");
      });
      value3.webRequest.onCompleted({
        urls: ["*://*.douyin.com/aweme/v1/web/user/profile/other/*"]
      }, arg1 => {
        console.log("[🔬 API 诊断] 核心资料接口调用完毕: " + arg1.url);
        console.log("[🔬 API 诊断]   状态码: " + arg1.statusCode + ", 来源: " + (arg1.fromCache ? "Cache" : "Network"));
      });
    }
    console.log("[Main] 正在加载目标 URL: " + local);
    const value4 = platform === "xianyu" ? "https://www.goofish.com/" : "https://www.douyin.com/";
    browserWindow.loadURL(local, {
      httpReferrer: value4
    });
    fn(browserWindow, locateComment);
  });
  ipcMain.on("open-url", async (arg1, arg2) => {
    try {
      console.log("[Main] [open-url] IPC received rawUrl:", arg2);
      if (!arg2) {
        console.log("[Main] [open-url] rawUrl is empty, skip.");
        return;
      }
      let result = String(arg2).trim();
      if (result.startsWith("//")) {
        result = "https:" + result;
      } else if (!result.startsWith("http://") && !result.startsWith("https://")) {
        result = "https://" + result;
      }
      console.log("[Main] [open-url] Normalized URL: " + result);
      if (isBlockedExternalProtocol(result)) {
        logBlockedExternalProtocol(result, "open-url", "ipc");
        return;
      }
      if (!isAllowedExternalOpenUrl(result)) {
        console.warn("[Main] open-url 仅支持 http/https: " + result);
        return;
      }
      console.log("[Main] [open-url] Attempting to shell.openExternal: " + result);
      await shell.openExternal(result);
      console.log("[Main] [open-url] shell.openExternal success: " + result);
    } catch (error) {
      console.error("[Main] [open-url] Critical error during execution:", error.stack || error.message || error);
    }
  });
}
module.exports = {
  registerManualAccountWindows: registerManualAccountWindows
};
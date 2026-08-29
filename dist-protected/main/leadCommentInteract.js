'use strict';

const path = require("path");
const fs = require("fs");
const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const {
  getLeadCommentLocatePageSource,
  getLeadCommentPausePageSource
} = require("../shared/leadCommentLocatePage");
function registerLeadCommentInteract(options = {}) {
  const {
    store: store,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    configureAutomationSession: configureAutomationSession,
    setRequestHeader: setRequestHeader,
    automationUserAgent: automationUserAgent,
    automationAcceptLanguage: automationAcceptLanguage,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath,
    attachProtocolGuard: attachProtocolGuard
  } = options;
  const map = new Map();
  function fn() {
    if (typeof resolveAutomationPreloadPath === "function") {
      try {
        const result = resolveAutomationPreloadPath();
        if (result) {
          return result;
        }
      } catch (error) {}
    }
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const local = store?.get?.("latest_resource_path");
      if (local && fs.existsSync(path.join(local, "automation-preload.js"))) {
        result = path.join(local, "automation-preload.js");
      }
    }
    return result;
  }
  async function fn2(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已关闭"
      };
    }
    try {
      await arg1.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
    } catch (error) {}
    await new Promise(arg1 => setTimeout(arg1, 600));
    if (arg1.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已关闭"
      };
    }
    try {
      const result = await arg1.webContents.executeJavaScript(getLeadCommentLocatePageSource({
        ...arg2,
        clickReply: true,
        timeoutMs: 40000
      }), true);
      if (result && typeof result === "object") {
        return result;
      } else {
        return {
          ok: false,
          reason: "定位脚本无结果"
        };
      }
    } catch (error) {
      console.warn("[Main] 定位评论:", error?.message || error);
      return {
        ok: false,
        reason: error?.message || "定位脚本失败"
      };
    }
  }
  function fn3(arg1) {
    const value = "douyin_" + (arg1 || "default");
    const browserWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      show: true,
      title: "获客雷达 - 定位评论",
      skipTaskbar: false,
      focusable: true,
      webPreferences: {
        partition: "persist:automation:" + value,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: fn(),
        spellcheck: false
      },
      autoHideMenuBar: app.isPackaged
    });
    if (typeof applyPackagedWindowMenuPolicy === "function") {
      applyPackagedWindowMenuPolicy(browserWindow);
    }
    const value2 = browserWindow.webContents.session;
    if (typeof configureAutomationSession === "function") {
      configureAutomationSession(value2, value);
    }
    if (automationUserAgent) {
      browserWindow.webContents.setUserAgent(automationUserAgent);
    }
    if (typeof setRequestHeader === "function" && automationUserAgent) {
      value2.webRequest.onBeforeSendHeaders({
        urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
      }, (arg1, arg2) => {
        const local = arg1.requestHeaders || {};
        setRequestHeader(local, "User-Agent", automationUserAgent);
        if (automationAcceptLanguage) {
          setRequestHeader(local, "Accept-Language", automationAcceptLanguage);
        }
        arg2({
          requestHeaders: local
        });
      });
    }
    if (typeof attachProtocolGuard === "function") {
      attachProtocolGuard(browserWindow.webContents, "lead-comment-interact:" + value);
    }
    browserWindow.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    const local = () => {
      if (browserWindow.isDestroyed()) {
        return;
      }
      browserWindow.webContents.executeJavaScript(getLeadCommentPausePageSource()).catch(() => {});
    };
    browserWindow.webContents.on("dom-ready", local);
    browserWindow.webContents.on("did-finish-load", local);
    browserWindow.on("closed", () => {
      for (const [local, local2] of map.entries()) {
        if (local2 === browserWindow) {
          map.delete(local);
        }
      }
    });
    return browserWindow;
  }
  ipcMain.handle("lead-comment-interact", async (arg1, options = {}) => {
    const result = String(options.url || "").trim();
    const local = String(options.accountId || "default").trim() || "default";
    if (!result) {
      return {
        ok: false,
        reason: "没有作品链接"
      };
    }
    const local2 = options.locateComment || {};
    const local3 = options.lead || {};
    let result2 = map.get(local);
    if (!result2 || result2.isDestroyed()) {
      result2 = fn3(local);
      map.set(local, result2);
    } else {
      if (result2.isMinimized()) {
        result2.restore();
      }
      result2.show();
      result2.focus();
    }
    try {
      await result2.loadURL(result, {
        httpReferrer: "https://www.douyin.com/"
      });
    } catch (error) {
      return {
        ok: false,
        reason: error?.message || "打开作品页失败"
      };
    }
    const result3 = await fn2(result2, {
      cid: local2.cid || local3.cid || local3.commentId,
      nickname: local2.nickname || local3.nickname,
      content: local2.content || local3.content || local3.comment
    });
    return {
      ok: !!result3.ok,
      located: !!result3.ok,
      replyClicked: !!result3.replyClicked,
      locateReason: result3.reason || "",
      accountId: local
    };
  });
}
module.exports = {
  registerLeadCommentInteract: registerLeadCommentInteract
};
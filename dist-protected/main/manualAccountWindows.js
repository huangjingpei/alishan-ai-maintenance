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
function registerManualAccountWindows(_0xa3a731) {
  const {
    store: _0x3dd6a2,
    getActiveManualWindows: _0xb96298,
    ensureXianyuAccess: _0x2f5cd2,
    applyPackagedWindowMenuPolicy: _0x291de2,
    configureAutomationSession: _0x4f7d33,
    setRequestHeader: _0x533d37,
    automationUserAgent: _0x57cf8c,
    automationAcceptLanguage: _0x228180
  } = _0xa3a731;
  function _0x1d1e7a(_0x3f5da2, _0x378ec3) {
    if (!_0x3f5da2 || _0x3f5da2.isDestroyed()) {
      return;
    }
    const _0x4034ff = String(_0x378ec3?.cid || _0x378ec3?.commentId || "").trim();
    const _0x55af3f = String(_0x378ec3?.nickname || "").trim();
    const _0x47b37e = String(_0x378ec3?.content || _0x378ec3?.comment || "").trim();
    if (!_0x4034ff && !_0x55af3f && !_0x47b37e) {
      return;
    }
    const _0x4ce6de = Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    _0x3f5da2._leadCommentLocateToken = _0x4ce6de;
    let _0x211642 = false;
    const _0x2bfb41 = async () => {
      if (_0x3f5da2.isDestroyed() || _0x3f5da2._leadCommentLocateToken !== _0x4ce6de) {
        return;
      }
      const _0x3ef0b9 = Date.now();
      try {
        await _0x3f5da2.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
      } catch (_0x597a22) {}
      while (Date.now() - _0x3ef0b9 < 28000) {
        if (_0x3f5da2.isDestroyed() || _0x3f5da2._leadCommentLocateToken !== _0x4ce6de) {
          return;
        }
        try {
          await _0x3f5da2.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
          const _0x3b7cd4 = await _0x3f5da2.webContents.executeJavaScript(getLeadCommentLocatePageSource({
            cid: _0x4034ff,
            nickname: _0x55af3f,
            content: _0x47b37e
          }), true);
          if (_0x3b7cd4?.ok) {
            console.log("[Main] 线索评论已定位 cid=" + (_0x3b7cd4.cid || _0x4034ff || "") + " score=" + (_0x3b7cd4.score || 0));
            return;
          }
        } catch (_0x55e1bb) {
          console.warn("[Main] 线索评论定位脚本:", _0x55e1bb?.message || _0x55e1bb);
        }
        await new Promise(_0x272592 => setTimeout(_0x272592, 900));
      }
      console.warn("[Main] 线索评论定位超时");
    };
    const _0x733054 = () => {
      if (_0x211642 || _0x3f5da2.isDestroyed() || _0x3f5da2._leadCommentLocateToken !== _0x4ce6de) {
        return;
      }
      _0x211642 = true;
      setTimeout(_0x2bfb41, 1400);
    };
    _0x3f5da2.webContents.once("did-finish-load", _0x733054);
    setTimeout(_0x733054, 8000);
  }
  ipcMain.on("open-in-account-context", (_0x4db537, {
    url: _0x41d72e,
    accountId: _0xcb55d2,
    platform: _0x213e71,
    locateComment: _0x5b1595
  }) => {
    if (!_0x41d72e) {
      return;
    }
    if (_0x213e71 === "xianyu" && !_0x2f5cd2()) {
      return;
    }
    const _0x469390 = _0xb96298();
    const _0x988012 = _0xcb55d2 && _0xcb55d2 !== "default" ? _0x213e71 + "_" + _0xcb55d2 : _0x213e71;
    const _0x119640 = "persist:automation:" + _0x988012;
    let _0x1a20b5 = _0x41d72e;
    try {
      const _0x3e9b33 = new URL(_0x1a20b5);
      _0x3e9b33.searchParams.set("from_tab_name", "main");
      _0x1a20b5 = _0x3e9b33.toString();
    } catch (_0x252e9d) {
      if (_0x1a20b5.includes("?")) {
        if (!_0x1a20b5.includes("from_tab_name=")) {
          _0x1a20b5 += "&from_tab_name=main";
        }
      } else {
        _0x1a20b5 += "?from_tab_name=main";
      }
    }
    const _0x23080b = _0x469390.get(_0x988012);
    if (_0x23080b && !_0x23080b.isDestroyed()) {
      console.log("[Main] 单窗口复用 → Electron loadURL 重加载, Partition: " + _0x119640);
      console.log("[Main]   目标: " + _0x1a20b5);
      if (_0x23080b._isOffScreen && _0x23080b._lastBounds) {
        _0x23080b.setBounds(_0x23080b._lastBounds);
        _0x23080b._isOffScreen = false;
      }
      if (!_0x23080b.isVisible()) {
        _0x23080b.show();
      }
      if (_0x23080b.isMinimized()) {
        _0x23080b.restore();
      }
      _0x23080b.focus();
      const _0x5d7ee9 = _0x213e71 === "xianyu" ? "https://www.goofish.com/" : "https://www.douyin.com/";
      _0x23080b.loadURL(_0x1a20b5, {
        httpReferrer: _0x5d7ee9
      });
      _0x1d1e7a(_0x23080b, _0x5b1595);
      return;
    }
    console.log("[Main] 首次创建独立视图窗口, Partition: " + _0x119640);
    let _0x20395f = path.join(__dirname, "..", "manual-view-preload.js");
    if (app.isPackaged) {
      const _0x34c33e = _0x3dd6a2.get("latest_resource_path");
      if (_0x34c33e && fs.existsSync(path.join(_0x34c33e, "manual-view-preload.js"))) {
        _0x20395f = path.join(_0x34c33e, "manual-view-preload.js");
      }
    }
    let _0x503bd3 = new BrowserWindow({
      width: 1280,
      height: 800,
      title: "获客雷达 - 独立账号视图",
      webPreferences: {
        partition: _0x119640,
        nodeIntegration: false,
        contextIsolation: true,
        preload: _0x20395f,
        backgroundThrottling: true,
        spellcheck: false
      },
      autoHideMenuBar: app.isPackaged
    });
    _0x291de2(_0x503bd3);
    const _0x3f3f56 = _0x503bd3.webContents.session;
    _0x469390.set(_0x988012, _0x503bd3);
    if (_0x213e71 === "xianyu") {
      _0x503bd3.setTitle("获客雷达 - 闲鱼独立账号视图");
      _0x503bd3.webContents.setUserAgent(_0x57cf8c);
      _0x3f3f56.setUserAgent(_0x57cf8c, _0x228180);
      _0x3f3f56.webRequest.onBeforeSendHeaders({
        urls: ["*://*.goofish.com/*", "*://*.taobao.com/*", "*://*.alicdn.com/*"]
      }, (_0x3da935, _0x3ebd66) => {
        const _0x4aebd7 = _0x3da935.requestHeaders || {};
        _0x4aebd7["User-Agent"] = _0x57cf8c;
        _0x4aebd7["Accept-Language"] = _0x228180;
        _0x3ebd66({
          requestHeaders: _0x4aebd7
        });
      });
    } else {
      _0x503bd3.webContents.setUserAgent(_0x57cf8c);
      _0x4f7d33(_0x3f3f56, _0x988012);
    }
    _0x3f3f56.webRequest.onBeforeSendHeaders({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, (_0x518ccd, _0x2e2091) => {
      const _0x1f15c8 = _0x518ccd.requestHeaders || {};
      _0x533d37(_0x1f15c8, "User-Agent", _0x57cf8c);
      _0x533d37(_0x1f15c8, "Accept-Language", _0x228180);
      if (!app.isPackaged && _0x518ccd.url.includes("/aweme/v1/web/user/profile/other/")) {
        console.log("[🔬 API Request Headers] URL: " + _0x518ccd.url);
        console.log("[🔬 API Request Headers] Headers: " + JSON.stringify(_0x1f15c8, null, 2));
      }
      _0x2e2091({
        requestHeaders: _0x1f15c8
      });
    });
    _0x3f3f56.webRequest.onHeadersReceived({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, handleStripFrameBlockingHeaders);
    _0x503bd3.on("close", _0xb963bc => {
      if (!app.isQuitting) {
        _0xb963bc.preventDefault();
        if (!_0x503bd3.isMinimized() && !_0x503bd3.isMaximized()) {
          _0x503bd3._lastBounds = _0x503bd3.getBounds();
        }
        _0x503bd3.setPosition(-10000, -10000);
        _0x503bd3._isOffScreen = true;
        console.log("[Main] 用户手动关闭独立视图窗口，已拦截并移至屏幕外休眠以保留完整会话上下文, Partition: " + _0x119640);
      }
    });
    _0x503bd3.on("closed", () => {
      _0x469390.delete(_0x988012);
      if (_0x503bd3) {
        _0x503bd3.removeAllListeners();
        _0x503bd3 = null;
      }
    });
    if (!app.isPackaged) {
      _0x503bd3.webContents.on("console-message", (_0x54e541, _0x559c48, _0x431e13, _0x30900d, _0x5af390) => {
        const _0x39e85d = ["DEBUG", "LOG", "WARNING", "ERROR"];
        const _0x5cbcac = _0x39e85d[_0x559c48] || "LOG";
        if (_0x431e13.includes("Failed to load resource") && !_0x431e13.includes("aweme/v1")) {
          return;
        }
        console.log("[Browser Console][" + _0x5cbcac + "] " + _0x431e13 + " (Source: " + path.basename(_0x5af390 || "") + ":" + _0x30900d + ")");
      });
      _0x3f3f56.webRequest.onCompleted({
        urls: ["*://*.douyin.com/aweme/v1/web/user/profile/other/*"]
      }, _0x586c0c => {
        console.log("[🔬 API 诊断] 核心资料接口调用完毕: " + _0x586c0c.url);
        console.log("[🔬 API 诊断]   状态码: " + _0x586c0c.statusCode + ", 来源: " + (_0x586c0c.fromCache ? "Cache" : "Network"));
      });
    }
    console.log("[Main] 正在加载目标 URL: " + _0x1a20b5);
    const _0x4c2922 = _0x213e71 === "xianyu" ? "https://www.goofish.com/" : "https://www.douyin.com/";
    _0x503bd3.loadURL(_0x1a20b5, {
      httpReferrer: _0x4c2922
    });
    _0x1d1e7a(_0x503bd3, _0x5b1595);
  });
  ipcMain.on("open-url", async (_0x318ba9, _0x5ef089) => {
    try {
      console.log("[Main] [open-url] IPC received rawUrl:", _0x5ef089);
      if (!_0x5ef089) {
        console.log("[Main] [open-url] rawUrl is empty, skip.");
        return;
      }
      let _0x2fe484 = String(_0x5ef089).trim();
      if (_0x2fe484.startsWith("//")) {
        _0x2fe484 = "https:" + _0x2fe484;
      } else if (!_0x2fe484.startsWith("http://") && !_0x2fe484.startsWith("https://")) {
        _0x2fe484 = "https://" + _0x2fe484;
      }
      console.log("[Main] [open-url] Normalized URL: " + _0x2fe484);
      if (isBlockedExternalProtocol(_0x2fe484)) {
        logBlockedExternalProtocol(_0x2fe484, "open-url", "ipc");
        return;
      }
      if (!isAllowedExternalOpenUrl(_0x2fe484)) {
        console.warn("[Main] open-url 仅支持 http/https: " + _0x2fe484);
        return;
      }
      console.log("[Main] [open-url] Attempting to shell.openExternal: " + _0x2fe484);
      await shell.openExternal(_0x2fe484);
      console.log("[Main] [open-url] shell.openExternal success: " + _0x2fe484);
    } catch (_0x3092e0) {
      console.error("[Main] [open-url] Critical error during execution:", _0x3092e0.stack || _0x3092e0.message || _0x3092e0);
    }
  });
}
module.exports = {
  registerManualAccountWindows: registerManualAccountWindows
};
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
function registerLeadCommentInteract(_0x4a5191 = {}) {
  const {
    store: _0x42340e,
    applyPackagedWindowMenuPolicy: _0x199deb,
    configureAutomationSession: _0x2142da,
    setRequestHeader: _0xcc7a79,
    automationUserAgent: _0x21ad0a,
    automationAcceptLanguage: _0x42b730,
    resolveAutomationPreloadPath: _0x2648ca,
    attachProtocolGuard: _0x2b1e2e
  } = _0x4a5191;
  const _0x8855e7 = new Map();
  function _0x38c332() {
    if (typeof _0x2648ca === "function") {
      try {
        const _0x4fc053 = _0x2648ca();
        if (_0x4fc053) {
          return _0x4fc053;
        }
      } catch (_0x132d6a) {}
    }
    let _0x5f3e1e = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const _0x3c3dd3 = _0x42340e?.get?.("latest_resource_path");
      if (_0x3c3dd3 && fs.existsSync(path.join(_0x3c3dd3, "automation-preload.js"))) {
        _0x5f3e1e = path.join(_0x3c3dd3, "automation-preload.js");
      }
    }
    return _0x5f3e1e;
  }
  async function _0xf514e5(_0x586e86, _0x2c6dac) {
    if (!_0x586e86 || _0x586e86.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已关闭"
      };
    }
    try {
      await _0x586e86.webContents.executeJavaScript(getLeadCommentPausePageSource(), true);
    } catch (_0x49285e) {}
    await new Promise(_0x315d61 => setTimeout(_0x315d61, 600));
    if (_0x586e86.isDestroyed()) {
      return {
        ok: false,
        reason: "窗口已关闭"
      };
    }
    try {
      const _0x448308 = await _0x586e86.webContents.executeJavaScript(getLeadCommentLocatePageSource({
        ..._0x2c6dac,
        clickReply: true,
        timeoutMs: 40000
      }), true);
      if (_0x448308 && typeof _0x448308 === "object") {
        return _0x448308;
      } else {
        return {
          ok: false,
          reason: "定位脚本无结果"
        };
      }
    } catch (_0xd23712) {
      console.warn("[Main] 定位评论:", _0xd23712?.message || _0xd23712);
      return {
        ok: false,
        reason: _0xd23712?.message || "定位脚本失败"
      };
    }
  }
  function _0x3d1bd5(_0x30aaca) {
    const _0x4214c3 = "douyin_" + (_0x30aaca || "default");
    const _0x137ee3 = new BrowserWindow({
      width: 1280,
      height: 800,
      show: true,
      title: "获客雷达 - 定位评论",
      skipTaskbar: false,
      focusable: true,
      webPreferences: {
        partition: "persist:automation:" + _0x4214c3,
        backgroundThrottling: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x38c332(),
        spellcheck: false
      },
      autoHideMenuBar: app.isPackaged
    });
    if (typeof _0x199deb === "function") {
      _0x199deb(_0x137ee3);
    }
    const _0x4014c0 = _0x137ee3.webContents.session;
    if (typeof _0x2142da === "function") {
      _0x2142da(_0x4014c0, _0x4214c3);
    }
    if (_0x21ad0a) {
      _0x137ee3.webContents.setUserAgent(_0x21ad0a);
    }
    if (typeof _0xcc7a79 === "function" && _0x21ad0a) {
      _0x4014c0.webRequest.onBeforeSendHeaders({
        urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
      }, (_0x27f56a, _0x5a7170) => {
        const _0x14c416 = _0x27f56a.requestHeaders || {};
        _0xcc7a79(_0x14c416, "User-Agent", _0x21ad0a);
        if (_0x42b730) {
          _0xcc7a79(_0x14c416, "Accept-Language", _0x42b730);
        }
        _0x5a7170({
          requestHeaders: _0x14c416
        });
      });
    }
    if (typeof _0x2b1e2e === "function") {
      _0x2b1e2e(_0x137ee3.webContents, "lead-comment-interact:" + _0x4214c3);
    }
    _0x137ee3.webContents.setWindowOpenHandler(() => ({
      action: "deny"
    }));
    const _0x591626 = () => {
      if (_0x137ee3.isDestroyed()) {
        return;
      }
      _0x137ee3.webContents.executeJavaScript(getLeadCommentPausePageSource()).catch(() => {});
    };
    _0x137ee3.webContents.on("dom-ready", _0x591626);
    _0x137ee3.webContents.on("did-finish-load", _0x591626);
    _0x137ee3.on("closed", () => {
      for (const [_0x2796c6, _0x2a4e70] of _0x8855e7.entries()) {
        if (_0x2a4e70 === _0x137ee3) {
          _0x8855e7.delete(_0x2796c6);
        }
      }
    });
    return _0x137ee3;
  }
  ipcMain.handle("lead-comment-interact", async (_0x3fb7be, _0x11df93 = {}) => {
    const _0x33742e = String(_0x11df93.url || "").trim();
    const _0x150197 = String(_0x11df93.accountId || "default").trim() || "default";
    if (!_0x33742e) {
      return {
        ok: false,
        reason: "没有作品链接"
      };
    }
    const _0x55544c = _0x11df93.locateComment || {};
    const _0x3cc3b1 = _0x11df93.lead || {};
    let _0x2dfb06 = _0x8855e7.get(_0x150197);
    if (!_0x2dfb06 || _0x2dfb06.isDestroyed()) {
      _0x2dfb06 = _0x3d1bd5(_0x150197);
      _0x8855e7.set(_0x150197, _0x2dfb06);
    } else {
      if (_0x2dfb06.isMinimized()) {
        _0x2dfb06.restore();
      }
      _0x2dfb06.show();
      _0x2dfb06.focus();
    }
    try {
      await _0x2dfb06.loadURL(_0x33742e, {
        httpReferrer: "https://www.douyin.com/"
      });
    } catch (_0xb2c8d0) {
      return {
        ok: false,
        reason: _0xb2c8d0?.message || "打开作品页失败"
      };
    }
    const _0x45237a = await _0xf514e5(_0x2dfb06, {
      cid: _0x55544c.cid || _0x3cc3b1.cid || _0x3cc3b1.commentId,
      nickname: _0x55544c.nickname || _0x3cc3b1.nickname,
      content: _0x55544c.content || _0x3cc3b1.content || _0x3cc3b1.comment
    });
    return {
      ok: !!_0x45237a.ok,
      located: !!_0x45237a.ok,
      replyClicked: !!_0x45237a.replyClicked,
      locateReason: _0x45237a.reason || "",
      accountId: _0x150197
    };
  });
}
module.exports = {
  registerLeadCommentInteract: registerLeadCommentInteract
};
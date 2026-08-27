'use strict';

const {
  BrowserView
} = require("electron");
const {
  buildMonitorViewKey,
  buildAccountSessionKey
} = require("./monitorAutomationViewHost");
function createMonitorProfileSubviewRunner(_0x5da4e5 = {}) {
  const {
    getInteractionViewsMap: _0x4b1202,
    configureAutomationSession: _0x287253,
    attachProtocolGuard: _0x4c4ffd,
    applyAccountProxy: _0x553841,
    resolveAutomationPreloadPath: _0x49ef19,
    automationUserAgent = "",
    store: _0x610050,
    runtimeConfig: _0x5db683,
    automationViewportSession: _0x3128d4
  } = _0x5da4e5;
  const _0x515e5d = new Set();
  function _0x143a1c(_0x136f68) {
    _0x515e5d.delete(_0x136f68);
    _0x3128d4?.destroyViewportSubview?.(_0x136f68, "monitor-destroy");
  }
  function _0x5adc16(_0x575023, _0x59c564) {
    const _0x4b07d4 = buildMonitorViewKey(_0x575023);
    const _0x9c3d1e = _0x4b1202?.();
    const _0x35f8ed = _0x9c3d1e?.get?.(_0x4b07d4);
    if (_0x35f8ed && !_0x35f8ed.webContents?.isDestroyed?.()) {
      _0x35f8ed.__radarMonitorInteraction = true;
      _0x515e5d.add(_0x4b07d4);
      return _0x35f8ed;
    }
    if (_0x35f8ed) {
      _0x9c3d1e.delete(_0x4b07d4);
    }
    const _0x11b579 = buildAccountSessionKey(_0x575023);
    const _0x2adb4f = _0x11b579 ? "persist:automation:" + _0x11b579 : "temp:monitor-interaction:" + _0x4b07d4;
    const _0x11261b = typeof _0x49ef19 === "function" ? _0x49ef19() : "";
    const _0x388187 = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x11261b,
        partition: _0x2adb4f,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    try {
      _0x388187.setBackgroundColor("#111827");
    } catch (_0x48dc63) {}
    const _0x3b5eb7 = _0x388187.webContents;
    const _0x42a351 = _0x11b579 || _0x4b07d4;
    try {
      _0x287253?.(_0x3b5eb7.session, _0x42a351);
    } catch (_0x516e4d) {}
    try {
      _0x4c4ffd?.(_0x3b5eb7, _0x4b07d4 + ":interaction");
    } catch (_0x549194) {}
    try {
      _0x3b5eb7.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (_0x387e37) {}
    if (automationUserAgent) {
      try {
        _0x3b5eb7.setUserAgent(automationUserAgent);
      } catch (_0x3d47d3) {}
    }
    try {
      const _0x27b4fe = _0x610050?.get?.("system_video_muted", true);
      _0x3b5eb7.setAudioMuted(_0x27b4fe !== false);
    } catch (_0x33e16f) {
      try {
        _0x3b5eb7.setAudioMuted(true);
      } catch (_0x32b2d2) {}
    }
    _0x3b5eb7.on("dom-ready", () => {
      try {
        _0x5db683?.ensureAndPushToWebContents?.(_0x3b5eb7);
      } catch (_0xe807b8) {}
    });
    _0x388187.__radarMonitorInteraction = true;
    _0x515e5d.add(_0x4b07d4);
    _0x3128d4?.registerInteractionSubview?.(_0x4b07d4, _0x388187);
    const _0x447598 = () => {
      try {
        if (_0x3b5eb7.isDestroyed?.()) {
          return;
        }
        _0x3b5eb7.executeJavaScript("\n          (() => {\n            try {\n              window.__radar_monitor_interaction = true;\n              window.__radar_view_key = '';\n            } catch (_) {}\n            return true;\n          })()\n        ", true).catch(() => {});
      } catch (_0x596759) {}
    };
    try {
      _0x3b5eb7.on("dom-ready", _0x447598);
    } catch (_0x34b6ca) {}
    _0x447598();
    if (typeof _0x553841 === "function") {
      Promise.resolve(_0x553841(_0x3b5eb7.session, _0x59c564, _0x42a351)).catch(_0x140506 => {
        console.warn("[MonitorSubview] 代理设置失败:", _0x140506?.message || _0x140506);
      });
    }
    return _0x388187;
  }
  function _0x1e294d(_0x368474) {
    if (!_0x368474 || _0x368474.isDestroyed?.()) {
      return false;
    }
    try {
      const _0x525b36 = _0x4b1202?.();
      for (const _0x3459b1 of _0x515e5d) {
        const _0x454cc9 = _0x525b36?.get?.(_0x3459b1);
        if (_0x454cc9?.webContents === _0x368474) {
          return true;
        }
      }
    } catch (_0x3a49c9) {}
    return false;
  }
  async function _0x258302(_0x51ab06, _0x26fb99, _0x56ca5e, _0x287cdf, _0x178d7a, _0x4b1ddc) {
    const _0x3104e2 = buildMonitorViewKey(_0x51ab06);
    const _0x3d2953 = _0x5adc16(_0x51ab06, _0x26fb99);
    if (!_0x3d2953) {
      throw new Error("无法创建监控互动子视图");
    }
    if (!_0x3128d4) {
      _0x143a1c(_0x3104e2);
      throw new Error("监控互动视口生命周期不可用");
    }
    let _0x43c3db = "";
    let _0x5dd22a = {};
    let _0x3c6b69 = null;
    let _0x3d6187 = false;
    const _0x408e76 = new AbortController();
    const _0x26eea8 = {
      timeoutMs: 360000,
      onTimeout: ({
        interactionId: _0x1c7ff6
      }) => {
        if (_0x43c3db && _0x1c7ff6 !== _0x43c3db) {
          return;
        }
        _0x3d6187 = true;
        _0x408e76.abort(new Error("monitor_interaction_timeout"));
      }
    };
    let _0x376788 = null;
    const _0x5d3519 = Date.now() + 2400;
    do {
      _0x376788 = _0x3128d4.beginViewportSession(_0x3104e2, _0x26eea8);
      if (_0x376788?.started) {
        break;
      }
      if (!["invalid_bounds", "visible_stack_not_staged", "viewport_staging_failed"].includes(_0x376788?.reason)) {
        break;
      }
      await new Promise(_0xc20568 => setTimeout(_0xc20568, 120));
    } while (Date.now() < _0x5d3519);
    if (!_0x376788?.started) {
      _0x143a1c(_0x3104e2);
      throw new Error("无法启动监控互动视口：" + (_0x376788?.reason || "unknown"));
    }
    _0x43c3db = _0x376788.interactionId;
    _0x3d2953.webContents.__radarMonitorAbortSignal = _0x408e76.signal;
    try {
      const _0x5bdeeb = {
        webContents: _0x3d2953.webContents,
        isDestroyed: () => !!_0x3d2953.webContents?.isDestroyed?.(),
        loadURL: _0x2434cf => _0x3d2953.webContents.loadURL(_0x2434cf),
        __radarMonitorInteraction: true,
        __radarMonitorViewKey: _0x3104e2 + ":interaction",
        __radarMonitorParentViewKey: _0x3104e2,
        abortSignal: _0x408e76.signal
      };
      if (typeof _0x4b1ddc === "function") {
        await _0x4b1ddc(_0x5bdeeb, _0x56ca5e);
      } else {
        await _0x3d2953.webContents.loadURL(_0x56ca5e);
      }
      await new Promise(_0x20192b => setTimeout(_0x20192b, 3500));
      const _0x2cc967 = await _0x3128d4.revealViewportSession(_0x3104e2, _0x43c3db);
      if (!_0x2cc967?.ready) {
        throw new Error("互动页面首帧未就绪：" + (_0x2cc967?.reason || "unknown"));
      }
      _0x5dd22a = await _0x178d7a(_0x5bdeeb);
      if (_0x3d6187) {
        throw Object.assign(new Error("monitor_interaction_timeout"), {
          code: "monitor_interaction_timeout"
        });
      }
      return _0x5dd22a;
    } catch (_0x5911d8) {
      _0x3c6b69 = _0x5911d8;
      throw _0x5911d8;
    } finally {
      try {
        delete _0x3d2953.webContents.__radarMonitorAbortSignal;
      } catch (_0x4f57c4) {}
      _0x3128d4.endViewportSession(_0x3104e2, {
        interactionId: _0x43c3db,
        results: _0x3c6b69 ? {
          success: false,
          error: _0x3c6b69?.message || String(_0x3c6b69)
        } : _0x5dd22a,
        reason: _0x3d6187 ? "monitor-timeout" : _0x3c6b69 ? "monitor-error" : "monitor-done",
        destroySubview: true
      });
      _0x515e5d.delete(_0x3104e2);
    }
  }
  function _0x383c28() {
    for (const _0x1fe79f of [..._0x515e5d]) {
      _0x143a1c(_0x1fe79f);
    }
  }
  return {
    runMonitorProfileActionsInSubview: _0x258302,
    destroyAllInteractionViews: _0x383c28,
    ensureMonitorInteractionView: _0x5adc16,
    isMonitorInteractionWebContents: _0x1e294d
  };
}
module.exports = {
  createMonitorProfileSubviewRunner: createMonitorProfileSubviewRunner
};
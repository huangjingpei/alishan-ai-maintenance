'use strict';

const {
  BrowserView
} = require("electron");
function buildMonitorViewKey(_0x57af4a) {
  const _0x5e3511 = String(_0x57af4a || "").trim() || "unknown";
  return "monitor_" + _0x5e3511;
}
function buildAccountSessionKey(_0x2450fa, {
  platform = "douyin"
} = {}) {
  const _0x801cb4 = String(_0x2450fa || "").trim();
  if (!_0x801cb4) {
    return "";
  }
  const _0x4a08a2 = String(platform || "douyin").trim().toLowerCase() || "douyin";
  return _0x4a08a2 + "_" + _0x801cb4;
}
function createMonitorAutomationViewHostFactory(_0x1f7e64 = {}) {
  const {
    getPlatformViews: _0x3fb5ed,
    getMainWindow: _0x3f8554,
    attachAutomationViewToBackgroundHost: _0x5a1b02,
    ensureBackgroundAutomationHostWindow: _0x3a3e7c,
    configureAutomationSession: _0x125ed1,
    attachProtocolGuard: _0x3bc2a9,
    applyAccountProxy: _0x68cb9c,
    resolveAutomationPreloadPath: _0x2b23bf,
    automationUserAgent = "",
    store: _0x721a40,
    getViewSettingsMap: _0x277261,
    destroyAutomationBrowserView: _0x2deb66
  } = _0x1f7e64;
  async function _0x2d416a(_0x2070a9, _0x1c3828, {
    platform = "douyin"
  } = {}) {
    const _0x2608a8 = buildMonitorViewKey(_0x2070a9);
    const _0x48917a = buildAccountSessionKey(_0x2070a9, {
      platform: platform
    });
    const _0x3c4cbb = _0x3fb5ed?.();
    if (!_0x3c4cbb) {
      throw new Error("platformViews 不可用");
    }
    const _0x4e0944 = _0x48917a ? "persist:automation:" + _0x48917a : "temp:monitor:" + _0x2608a8;
    const _0x5e6bee = typeof _0x2b23bf === "function" ? _0x2b23bf() : "";
    const _0x531dd1 = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x5e6bee,
        partition: _0x4e0944,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    try {
      _0x531dd1.setBackgroundColor("#111827");
    } catch (_0x3b1d35) {}
    try {
      _0x531dd1.setBounds({
        x: 0,
        y: 0,
        width: 1280,
        height: 800
      });
    } catch (_0x41e294) {}
    const _0x19e35c = _0x531dd1.webContents;
    const _0x26f29b = _0x48917a || _0x2608a8;
    if (typeof _0x125ed1 === "function") {
      _0x125ed1(_0x19e35c.session, _0x26f29b);
    }
    if (automationUserAgent) {
      try {
        _0x19e35c.setUserAgent(automationUserAgent);
      } catch (_0x50f94e) {}
    }
    try {
      _0x3bc2a9?.(_0x19e35c, "video-monitor:" + _0x2608a8);
    } catch (_0x1a4cb6) {}
    try {
      _0x19e35c.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (_0x2e54fc) {}
    if (typeof _0x68cb9c === "function") {
      await _0x68cb9c(_0x19e35c.session, _0x1c3828, _0x48917a || _0x2608a8);
    }
    try {
      const _0x2e0e66 = _0x721a40?.get?.("system_video_muted", true);
      _0x19e35c.setAudioMuted(_0x2e0e66 !== false);
    } catch (_0x4632be) {}
    try {
      _0x19e35c.setFrameRate?.(30);
    } catch (_0x155ef9) {}
    _0x3c4cbb.set(_0x2608a8, _0x531dd1);
    try {
      const _0x3b4ed3 = typeof _0x277261 === "function" ? _0x277261() : null;
      _0x3b4ed3?.set?.(_0x2608a8, {
        taskId: "monitor-host:" + _0x2070a9,
        accountId: String(_0x2070a9),
        platform: platform || "douyin",
        taskMode: "video_monitor",
        videoMonitor: true
      });
    } catch (_0x1e4ab3) {}
    let _0x4ff32f = false;
    const _0x9de00e = [];
    const _0x193bc4 = {
      value: "监控任务 - " + _0x2070a9
    };
    const _0x54fd6e = {
      __radarMonitorHost: true,
      __radarMonitorViewKey: _0x2608a8,
      __radarMonitorAccountSessionKey: _0x48917a || "",
      __radarMonitorAccountId: String(_0x2070a9),
      __radarAllowVisibleMonitor: false,
      __radarMonitorActive: false,
      __radarMonitorLastUsedAt: Date.now(),
      __radarMonitorProcessedVideos: 0,
      webContents: _0x19e35c,
      isDestroyed: () => _0x4ff32f || _0x19e35c.isDestroyed?.(),
      loadURL: _0xd78cd5 => _0x19e35c.loadURL(_0xd78cd5),
      setTitle: _0x3958e4 => {
        _0x193bc4.value = String(_0x3958e4 || _0x193bc4.value);
      },
      getTitle: () => _0x193bc4.value,
      on: (_0x4de5f0, _0x330a79) => {
        if (_0x4de5f0 === "closed") {
          _0x9de00e.push(_0x330a79);
          return _0x54fd6e;
        }
        if (_0x4de5f0 === "close") {
          return _0x54fd6e;
        }
        try {
          _0x19e35c.on(_0x4de5f0, _0x330a79);
        } catch (_0x1b7c73) {}
        return _0x54fd6e;
      },
      once: (_0x6623dc, _0xb5c5e4) => {
        if (_0x6623dc === "closed") {
          const _0x1ec2e1 = (..._0x23d58c) => {
            const _0x3abd1b = _0x9de00e.indexOf(_0x1ec2e1);
            if (_0x3abd1b >= 0) {
              _0x9de00e.splice(_0x3abd1b, 1);
            }
            _0xb5c5e4(..._0x23d58c);
          };
          _0x9de00e.push(_0x1ec2e1);
          return _0x54fd6e;
        }
        try {
          _0x19e35c.once(_0x6623dc, _0xb5c5e4);
        } catch (_0x2f9a68) {}
        return _0x54fd6e;
      },
      destroy: () => {
        if (_0x4ff32f) {
          return;
        }
        _0x4ff32f = true;
        try {
          _0x3c4cbb.delete(_0x2608a8);
        } catch (_0xc02e8) {}
        try {
          const _0x2d523b = typeof _0x277261 === "function" ? _0x277261() : null;
          _0x2d523b?.delete?.(_0x2608a8);
        } catch (_0x46666d) {}
        try {
          if (typeof _0x2deb66 === "function") {
            _0x2deb66(_0x531dd1, _0x2608a8, "monitor-main");
          } else if (!_0x19e35c.isDestroyed?.()) {
            try {
              _0x3f8554?.()?.removeBrowserView?.(_0x531dd1);
            } catch (_0x4ffd42) {}
            try {
              _0x3a3e7c?.()?.removeBrowserView?.(_0x531dd1);
            } catch (_0x1afa48) {}
            _0x19e35c.destroy?.();
          }
        } catch (_0x46a3c5) {}
        for (const _0x277ae2 of _0x9de00e.splice(0)) {
          try {
            _0x277ae2();
          } catch (_0x2a8844) {}
        }
      },
      show: () => {},
      hide: () => {},
      focus: () => {},
      isVisible: () => false,
      showInactive: () => {},
      setOpacity: () => {},
      setSkipTaskbar: () => {},
      setFocusable: () => {},
      setPosition: () => {},
      center: () => {},
      setSize: () => {},
      setBounds: () => {},
      getBounds: () => {
        try {
          return _0x531dd1.getBounds();
        } catch (_0x2001ef) {
          return {
            x: 0,
            y: 0,
            width: 1280,
            height: 800
          };
        }
      },
      getContentBounds: () => {
        try {
          return _0x531dd1.getBounds();
        } catch (_0x461166) {
          return {
            x: 0,
            y: 0,
            width: 1280,
            height: 800
          };
        }
      }
    };
    return {
      facade: _0x54fd6e,
      view: _0x531dd1,
      viewKey: _0x2608a8,
      webContents: _0x19e35c
    };
  }
  return {
    buildMonitorViewKey: buildMonitorViewKey,
    buildAccountSessionKey: buildAccountSessionKey,
    createMonitorAccountHost: _0x2d416a
  };
}
module.exports = {
  buildMonitorViewKey: buildMonitorViewKey,
  buildAccountSessionKey: buildAccountSessionKey,
  createMonitorAutomationViewHostFactory: createMonitorAutomationViewHostFactory
};
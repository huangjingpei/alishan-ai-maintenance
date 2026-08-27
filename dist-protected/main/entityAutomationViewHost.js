'use strict';

const {
  BrowserView
} = require("electron");
const {
  handleStripFrameBlockingHeaders
} = require("./stripFrameBlockingHeaders");
function buildEntityViewKey(_0x5f0750, {
  guest = false
} = {}) {
  const _0x4b9dd3 = String(_0x5f0750 || "").trim() || "guest";
  if (guest) {
    return "entity_guest_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  }
  return "entity_" + _0x4b9dd3;
}
function buildAccountSessionKey(_0x24a202, {
  guest = false,
  platform = "douyin"
} = {}) {
  const _0x468650 = String(_0x24a202 || "").trim();
  if (guest || !_0x468650) {
    return "";
  }
  const _0x29b579 = String(platform || "douyin").trim().toLowerCase() || "douyin";
  return _0x29b579 + "_" + _0x468650;
}
function createEntityAutomationViewHostFactory(_0x5e3b79 = {}) {
  const {
    getPlatformViews: _0x12e0ca,
    getMainWindow: _0xe54269,
    attachAutomationViewToBackgroundHost: _0x12e135,
    ensureBackgroundAutomationHostWindow: _0x2f41d0,
    configureAutomationSession: _0x3c190c,
    attachProtocolGuard: _0x1250ae,
    applyAccountProxy: _0x87b548,
    resolveAutomationPreloadPath: _0x3a3d4c,
    automationUserAgent = "",
    store: _0x3439f3,
    destroyAutomationBrowserView: _0x530ccb
  } = _0x5e3b79;
  async function _0x546f2f(_0xa75edd, _0x327c1c, {
    guest = false,
    platform = "douyin"
  } = {}) {
    const _0x29a3d3 = buildEntityViewKey(_0xa75edd, {
      guest: guest
    });
    const _0x309e90 = buildAccountSessionKey(_0xa75edd, {
      guest: guest,
      platform: platform
    });
    const _0x27a980 = _0x12e0ca?.();
    if (!_0x27a980) {
      throw new Error("platformViews 不可用");
    }
    const _0xd12e1e = guest || !_0x309e90 ? "temp:entity-guest:" + _0x29a3d3 : "persist:automation:" + _0x309e90;
    const _0x1a767a = typeof _0x3a3d4c === "function" ? _0x3a3d4c() : "";
    const _0x522f13 = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: _0x1a767a,
        partition: _0xd12e1e,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    try {
      _0x522f13.setBackgroundColor("#111827");
    } catch (_0x1d7f54) {}
    try {
      _0x522f13.setBounds({
        x: 0,
        y: 0,
        width: 1200,
        height: 800
      });
    } catch (_0x4b37d6) {}
    const _0x491aeb = _0x522f13.webContents;
    const _0x4c94c2 = _0x309e90 || _0x29a3d3;
    if (typeof _0x3c190c === "function") {
      _0x3c190c(_0x491aeb.session, _0x4c94c2);
    }
    if (guest) {
      try {
        _0x491aeb.session.webRequest.onHeadersReceived({
          urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
        }, handleStripFrameBlockingHeaders);
      } catch (_0x2a09cd) {}
    }
    if (automationUserAgent) {
      try {
        _0x491aeb.setUserAgent(automationUserAgent);
      } catch (_0x228a0c) {}
    }
    try {
      _0x1250ae?.(_0x491aeb, "entity-leadgen:" + _0x29a3d3);
    } catch (_0x531b5b) {}
    try {
      _0x491aeb.setWindowOpenHandler(() => ({
        action: "deny"
      }));
    } catch (_0x142ea5) {}
    if (!guest && typeof _0x87b548 === "function") {
      await _0x87b548(_0x491aeb.session, _0x327c1c, _0x309e90 || _0x29a3d3);
    }
    try {
      const _0x1d207c = _0x3439f3?.get?.("system_video_muted", true);
      _0x491aeb.setAudioMuted(_0x1d207c !== false);
    } catch (_0x4ea34d) {}
    try {
      _0x491aeb.setFrameRate?.(30);
    } catch (_0x5bfd66) {}
    _0x27a980.set(_0x29a3d3, _0x522f13);
    let _0x3bb7f5 = false;
    const _0x565c50 = [];
    const _0x470af3 = {
      value: guest ? "线索采集（无账号游客）" : "线索采集 - " + _0xa75edd
    };
    const _0xf167e3 = {
      __radarEntityHost: true,
      __radarEntityViewKey: _0x29a3d3,
      __radarEntityAccountSessionKey: _0x309e90 || "",
      __radarEntityGuest: !!guest,
      __radarEntityAccountId: String(_0xa75edd),
      __radarAllowVisibleMonitor: false,
      webContents: _0x491aeb,
      isDestroyed: () => _0x3bb7f5 || _0x491aeb.isDestroyed?.(),
      loadURL: _0xdab5d1 => _0x491aeb.loadURL(_0xdab5d1),
      setTitle: _0x29b788 => {
        _0x470af3.value = String(_0x29b788 || _0x470af3.value);
      },
      getTitle: () => _0x470af3.value,
      on: (_0x10871c, _0x31eabe) => {
        if (_0x10871c === "closed") {
          _0x565c50.push(_0x31eabe);
          return _0xf167e3;
        }
        if (_0x10871c === "close") {
          return _0xf167e3;
        }
        try {
          _0x491aeb.on(_0x10871c, _0x31eabe);
        } catch (_0x2de861) {}
        return _0xf167e3;
      },
      once: (_0x31a54a, _0x2d5935) => {
        if (_0x31a54a === "closed") {
          const _0x316677 = (..._0x45cbf2) => {
            const _0x3c86d7 = _0x565c50.indexOf(_0x316677);
            if (_0x3c86d7 >= 0) {
              _0x565c50.splice(_0x3c86d7, 1);
            }
            _0x2d5935(..._0x45cbf2);
          };
          _0x565c50.push(_0x316677);
          return _0xf167e3;
        }
        try {
          _0x491aeb.once(_0x31a54a, _0x2d5935);
        } catch (_0x4a3432) {}
        return _0xf167e3;
      },
      destroy: () => {
        if (_0x3bb7f5) {
          return;
        }
        _0x3bb7f5 = true;
        try {
          _0x27a980.delete(_0x29a3d3);
        } catch (_0x3bfe40) {}
        try {
          if (typeof _0x530ccb === "function") {
            _0x530ccb(_0x522f13, _0x29a3d3, "entity-main");
          } else if (!_0x491aeb.isDestroyed?.()) {
            try {
              _0xe54269?.()?.removeBrowserView?.(_0x522f13);
            } catch (_0x2e63c8) {}
            try {
              _0x2f41d0?.()?.removeBrowserView?.(_0x522f13);
            } catch (_0x4d5d88) {}
            _0x491aeb.destroy?.();
          }
        } catch (_0x59044d) {}
        for (const _0x4db6b5 of _0x565c50.splice(0)) {
          try {
            _0x4db6b5();
          } catch (_0x2c61c9) {}
        }
      },
      show: () => {},
      hide: () => {},
      focus: () => {},
      setOpacity: () => {},
      setSkipTaskbar: () => {},
      setFocusable: () => {},
      setPosition: () => {},
      center: () => {},
      setSize: () => {},
      getBounds: () => {
        try {
          return _0x522f13.getBounds();
        } catch (_0x523ca3) {
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
      facade: _0xf167e3,
      view: _0x522f13,
      viewKey: _0x29a3d3,
      webContents: _0x491aeb
    };
  }
  return {
    buildEntityViewKey: buildEntityViewKey,
    buildAccountSessionKey: buildAccountSessionKey,
    createEntityAccountHost: _0x546f2f
  };
}
module.exports = {
  buildEntityViewKey: buildEntityViewKey,
  buildAccountSessionKey: buildAccountSessionKey,
  createEntityAutomationViewHostFactory: createEntityAutomationViewHostFactory
};
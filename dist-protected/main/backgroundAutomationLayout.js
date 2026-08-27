'use strict';

const {
  BrowserWindow,
  ipcMain,
  screen
} = require("electron");
const {
  restoreOccludedPageRendering
} = require("./automationRenderingPolicy");
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
const VISIBLE_AUTOMATION_LOGICAL_WIDTH = 1280;
const VISIBLE_AUTOMATION_LOGICAL_HEIGHT = 800;
const MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR = 0.25;
const BACKGROUND_LAYOUT_WARMUP_MS = 160;
const BACKGROUND_INTERACTION_RESUME_WARMUP_MS = 900;
const BACKGROUND_AUTOMATION_FRAME_RATE_ACTIVE = 30;
const BACKGROUND_AUTOMATION_FRAME_RATE_IDLE = 30;
const FOREGROUND_AUTOMATION_FRAME_RATE = 60;
const BACKGROUND_INTERACTION_SLOT_LEASE_MS = 300000;
const BACKGROUND_HOST_FOCUS_ACTIVATE_GUARD_MS = 500;
const BACKGROUND_HOST_SHOW_ACTIVATE_GUARD_MS = 1000;
const BACKGROUND_HOST_RELATED_EVENT_GRACE_MS = 500;
const MAIN_WINDOW_COMPOSITOR_NUDGE_COOLDOWN_MS = 500;
const AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS = 50;
const VISIBLE_AUTOMATION_REPAINT_DELAYS_MS = [50, 250, 700];
const BOUNDS_SYNC_MIN_INTERVAL_MS = 40;
function createBackgroundAutomationLayout(_0x39eb05) {
  const {
    getMainWindow: _0x577aff,
    getPlatformViews: _0x1beec,
    getInteractionViewsMap: _0x4ae3ed,
    getInteractionLocksMap: _0x1c23ef,
    getViewSettingsMap: _0x15482d,
    getBoundsStateByViewKey: _0x2f9f4c,
    getVisibleAutomationRepaintTimers: _0x11a774,
    getBackgroundDetachedViewKeys: _0x2f80d7,
    getBackgroundLayoutHoldViewKeys: _0x207c8c,
    getBackgroundOriginalZoomFactors: _0x25bc09,
    getBackgroundInteractionWaiters: _0x87d265,
    getPendingAutomationWebContentsClose: _0x32ee21,
    getAutomationViewsVisible: _0x44bb32,
    setAutomationViewsVisible: _0x3b0ff6,
    getVisibleAutomationViewKeys: _0x23460b,
    setVisibleAutomationViewKeys: _0x2ec272,
    getMainWindowBackgrounded: _0xa80493,
    setMainWindowBackgrounded: _0x24fbd1,
    getMainWindowBackgroundReason: _0x4ef0c6,
    setMainWindowBackgroundReason: _0x32f1a8,
    getBackgroundAutomationHostWindow: _0x1750bc,
    setBackgroundAutomationHostWindow: _0x15d7a9,
    getBackgroundAutomationHostDestroyTimer: _0xc58d82,
    setBackgroundAutomationHostDestroyTimer: _0x5c7f1c,
    getBackgroundInteractionSlot: _0x22db08,
    setBackgroundInteractionSlot: _0x5cb6ec,
    getBackgroundHostInternalActivateUntil: _0x2dd610,
    setBackgroundHostInternalActivateUntil: _0x306a39,
    getBackgroundHostInternalActivatePending: _0x8a6c1a,
    setBackgroundHostInternalActivatePending: _0x123e53,
    getBackgroundHostRelatedEventUntil: _0x3e6b29,
    setBackgroundHostRelatedEventUntil: _0x166d2f,
    getAutomationWindow: _0xc6e123,
    setAutomationWindow: _0x553bd1,
    getActivePlatform: _0x29c090,
    isBatchViewRuntimeActive: _0x5f0b30,
    isMonitorTaskViewRunning: _0x74d7e2,
    applyPackagedWindowMenuPolicy: _0x2fbb55,
    appendDiagnosticsLog: _0x1e7df3,
    requestAutomationLayoutRefresh: _0x8c2ce,
    recoverMainAutomationView: _0x48c31a,
    store: _0x313703,
    backgroundLivePreviewAutoCloseMs: _0x502fd8
  } = _0x39eb05;
  const _0x3af5bb = new Map();
  const _0x5c5640 = new Map();
  function _0x45ba52(_0x204b1e) {
    const _0x556acb = Number(_0x3af5bb.get(_0x204b1e) || 0) + 1;
    _0x3af5bb.set(_0x204b1e, _0x556acb);
    return _0x556acb;
  }
  const _0x340b3b = new WeakMap();
  let _0x4bdadd = 0;
  function _0x3c586b(_0xabdbb3, _0x963ae9 = 1) {
    const _0x2dbff3 = Number(_0xabdbb3);
    if (!Number.isFinite(_0x2dbff3) || _0x2dbff3 <= 0) {
      return _0x963ae9;
    }
    return Math.max(MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR, _0x2dbff3);
  }
  function _0x3659a6(_0x2d154a) {
    const _0x182eca = _0x4ae3ed();
    for (const [_0x432846, _0x39d7b8] of _0x182eca.entries()) {
      if (_0x39d7b8.webContents === _0x2d154a) {
        return _0x432846;
      }
    }
    return null;
  }
  function _0x1ea899(_0x50af9d) {
    const _0x2aa41d = _0x1beec();
    for (const [_0x1b6b36, _0x28e536] of _0x2aa41d.entries()) {
      if (_0x28e536.webContents === _0x50af9d) {
        return _0x1b6b36;
      }
    }
    return _0x3659a6(_0x50af9d);
  }
  function _0x41d29e() {
    const _0x160b35 = _0x577aff();
    if (!_0x160b35 || _0x160b35.isDestroyed() || _0x160b35.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x160b35.webContents.setBackgroundThrottling(false);
    } catch (_0x39a4df) {}
    try {
      _0x160b35.webContents.setFrameRate(_0xa80493() ? 30 : 60);
    } catch (_0x7fc7cd) {}
    try {
      _0x160b35.webContents.setImageAnimationPolicy(_0xa80493() ? "noAnimation" : "animate");
    } catch (_0x5069c7) {}
  }
  function _0x47f22d(_0x56d52a = "") {
    const _0x8a0a66 = _0x577aff();
    if (!_0x8a0a66 || _0x8a0a66.isDestroyed() || _0x8a0a66.webContents.isDestroyed()) {
      return;
    }
    if (!_0x8a0a66.isVisible() || _0x8a0a66.isMinimized()) {
      return;
    }
    try {
      _0x8a0a66.webContents.invalidate();
    } catch (_0x10ad05) {}
    _0x178fdf(_0x56d52a || "ui-wake");
    [120, 400].forEach(_0x1f0603 => {
      const _0x2e9620 = setTimeout(() => {
        const _0x7de4fb = _0x577aff();
        if (!_0x7de4fb || _0x7de4fb.isDestroyed() || _0x7de4fb.webContents.isDestroyed()) {
          return;
        }
        if (!_0x7de4fb.isVisible() || _0x7de4fb.isMinimized()) {
          return;
        }
        try {
          _0x7de4fb.webContents.invalidate();
        } catch (_0x9744a9) {}
      }, _0x1f0603);
      if (typeof _0x2e9620.unref === "function") {
        _0x2e9620.unref();
      }
    });
  }
  function _0x183795(_0x15d2f3 = "") {
    const _0xfdc541 = _0x577aff();
    if (!_0xfdc541 || _0xfdc541.isDestroyed() || _0xfdc541.webContents.isDestroyed()) {
      return;
    }
    if (!_0xfdc541.isVisible() || _0xfdc541.isMinimized()) {
      return;
    }
    try {
      if (!_0xfdc541.isFocused()) {
        _0xfdc541.focus();
      }
    } catch (_0x45c873) {}
    try {
      _0xfdc541.webContents.focus();
    } catch (_0x8c1604) {}
    _0x47f22d(_0x15d2f3 || "restore-ui-focus");
  }
  function _0x42c39b(_0x37116d, {
    force = false
  } = {}) {
    if (!_0x37116d || _0x37116d.isDestroyed?.()) {
      return false;
    }
    const _0x4bad29 = _0x14baa6();
    const _0xb3596f = _0x4bad29.some(_0x3f8c28 => _0x3f8c28?.webContents === _0x37116d);
    if (_0xb3596f) {
      try {
        _0x37116d.executeJavaScript("(() => { try { document.body && document.body.focus(); } catch (_) {} return true; })()", true).catch(() => {});
      } catch (_0x2cea17) {}
      const _0x1330a3 = _0x1750bc();
      if (_0x1330a3 && !_0x1330a3.isDestroyed()) {
        _0x30ec8d(_0x1330a3, "safe-focus-skip");
        try {
          if (_0x1330a3.isFocused()) {
            _0x1330a3.blur();
          }
        } catch (_0x104e92) {}
        _0x240208(_0x1330a3, "safe-focus-skip");
      }
      const _0x3db1e0 = _0x577aff();
      if (_0x3db1e0 && !_0x3db1e0.isDestroyed() && _0x3db1e0.isVisible() && !_0x3db1e0.isMinimized()) {
        setImmediate(() => _0x183795("after-host-safe-focus"));
      }
      return false;
    }
    const _0x241f73 = !_0x44bb32();
    if (_0x241f73 && !force) {
      try {
        _0x37116d.executeJavaScript("(() => { try { document.body && document.body.focus(); } catch (_) {} return true; })()", true).catch(() => {});
      } catch (_0x5bd6eb) {}
      setImmediate(() => _0x183795("after-offscreen-safe-focus"));
      return false;
    }
    const _0x1ff134 = _0x577aff();
    if (!force && _0x1ff134 && !_0x1ff134.isDestroyed() && !_0x1ff134.isFocused()) {
      return false;
    }
    try {
      _0x37116d.focus();
      return true;
    } catch (_0x108d0f) {
      return false;
    }
  }
  function _0x672d4f(_0x28b32a = "foreground") {
    const _0x3237f8 = _0x577aff();
    if (!_0x44bb32() || !_0x3237f8 || _0x3237f8.isDestroyed() || !_0x3237f8.isVisible() || _0x3237f8.isMinimized()) {
      return 0;
    }
    const _0x1b2f26 = _0x1beec();
    const _0x3d22ab = _0x4ae3ed();
    const _0x2642f1 = _0x1c23ef();
    const _0x4bcf16 = _0x2f9f4c();
    const _0x1e1e9a = _0x207c8c();
    const _0x1f7d16 = _0x23460b();
    let _0x24c96c = 0;
    for (const [_0x482ed6, _0x5ae2ac] of _0x1b2f26.entries()) {
      if (_0x1f7d16 && !_0x1f7d16.has(_0x482ed6)) {
        continue;
      }
      if (_0x447cc2(_0x482ed6)) {
        if (_0x1d881e(_0x482ed6)) {
          const _0x309064 = _0x258d66(_0x482ed6, "foreground-locked-restore:" + _0x28b32a);
          if (_0x309064.restored) {
            _0x24c96c += 1;
          }
          continue;
        }
        const _0x584a21 = _0x2642f1.has(_0x482ed6) ? _0x3d22ab.get(_0x482ed6) : null;
        if (_0x584a21 && !_0x584a21.webContents?.isDestroyed?.()) {
          _0x13dd57(_0x482ed6, _0x584a21, {
            active: true
          });
          _0x1e1e9a.add(_0x482ed6);
        } else if (_0x5ae2ac && !_0x5ae2ac.webContents?.isDestroyed?.()) {
          _0x13dd57(_0x482ed6, _0x5ae2ac, {
            active: true
          });
          _0x1e1e9a.add(_0x482ed6);
        }
        if (_0x584a21 && _0x3f44d5(_0x482ed6, _0x5ae2ac)) {
          _0x24c96c += 1;
        }
        continue;
      }
      const _0x13f1ff = _0x2642f1.get(_0x482ed6);
      const _0x112b84 = _0x13f1ff ? _0x3d22ab.get(_0x482ed6) : null;
      const _0xda3a2d = _0x112b84 || _0x5ae2ac;
      if (!_0xda3a2d?.webContents || _0xda3a2d.webContents.isDestroyed()) {
        continue;
      }
      const _0x146fe4 = _0x4bcf16.get(_0x482ed6);
      const _0x14c215 = _0x13f1ff?.bounds || _0x146fe4?.bounds;
      if (!_0x133324(_0x14c215)) {
        continue;
      }
      _0x2758e1(_0xda3a2d);
      _0x2b41c7(_0xda3a2d.webContents);
      try {
        _0xda3a2d.setBounds({
          ..._0x14c215
        });
      } catch (_0x5bcf1c) {}
      const _0x5e089f = Number(_0x13f1ff?.zoomFactor || _0x146fe4?.zoomFactor || 0);
      if (_0x5e089f > 0) {
        try {
          _0xda3a2d.webContents.setZoomFactor(_0x5e089f);
        } catch (_0x1828dd) {}
      }
      if (!_0x3237f8.getBrowserViews().includes(_0xda3a2d)) {
        _0x3237f8.addBrowserView(_0xda3a2d);
      }
      _0x4dbb08(_0xda3a2d, {
        context: "foreground-restore:" + _0x482ed6
      });
      if (Number(_0x5e089f) > 0 && Number(_0x5e089f) < 0.98) {
        _0x7cfdcc(_0xda3a2d.webContents);
      } else {
        _0x3ab56c(_0xda3a2d.webContents, {
          force: true
        });
      }
      _0x3cfc9d(_0xda3a2d.webContents, _0xda3a2d);
      if (!_0x112b84) {
        _0x581888(_0x482ed6);
      }
      _0x24c96c += 1;
    }
    _0x2a2d51();
    if (_0x24c96c > 0) {
      console.log("[Main] 前台实况视图已主动恢复: " + _0x24c96c + " 个 (" + _0x28b32a + ")");
    }
    return _0x24c96c;
  }
  function _0x2b0142(_0x1a91e9 = "background-timeout") {
    if (!_0x44bb32()) {
      return false;
    }
    _0x3b0ff6(false);
    _0x2ec272(null);
    const _0x70f773 = _0x11a774();
    _0x70f773.forEach(_0x4185a3 => clearTimeout(_0x4185a3));
    _0x70f773.clear();
    const _0x407e59 = _0x1beec();
    const _0x54ead9 = _0x4ae3ed();
    _0x407e59.forEach((_0x47ffea, _0x2b655c) => {
      _0x3c5ea4(_0x2b655c, _0x47ffea);
      const _0x378aec = _0x54ead9.get(_0x2b655c);
      if (_0x378aec) {
        _0x3c5ea4(_0x2b655c, _0x378aec);
      }
    });
    _0x2a2d51();
    const _0x214c18 = {
      reason: _0x1a91e9,
      delayMs: _0x502fd8
    };
    _0x1e7df3("PERF", "live preview auto closed in background", _0x214c18);
    const _0x5767a2 = _0x577aff();
    if (_0x5767a2 && !_0x5767a2.isDestroyed() && !_0x5767a2.webContents.isDestroyed()) {
      try {
        _0x5767a2.webContents.send("automation-live-preview-auto-closed", _0x214c18);
      } catch (_0x4a4b2a) {}
    }
    console.log("[Perf] 软件后台超过 " + _0x502fd8 / 1000 + "s，已自动关闭实况画面 (" + _0x1a91e9 + ")");
    return true;
  }
  function _0x39a114(_0x2e7d34, _0x503c6c = "") {
    const _0x4e236a = _0xa80493();
    _0x24fbd1(!!_0x2e7d34);
    if (_0xa80493()) {
      _0x32f1a8(_0x503c6c || _0x4ef0c6() || "unknown");
    } else {
      _0x32f1a8("");
    }
    const _0x32e711 = _0x577aff();
    if (!_0x32e711 || _0x32e711.isDestroyed() || _0x32e711.webContents.isDestroyed()) {
      return;
    }
    _0x41d29e();
    if (_0xa80493() === _0x4e236a) {
      return;
    }
    const _0x1170d7 = _0x11a774();
    const _0x6b1da4 = _0x1beec();
    const _0x398e49 = _0x4ae3ed();
    if (_0xa80493()) {
      _0x1170d7.forEach(_0x347e41 => clearTimeout(_0x347e41));
      _0x1170d7.clear();
      _0x6b1da4.forEach((_0x4ed46a, _0x51fa27) => {
        _0x3c5ea4(_0x51fa27, _0x4ed46a);
        const _0x2b7c18 = _0x398e49.get(_0x51fa27);
        if (_0x2b7c18) {
          _0x3c5ea4(_0x51fa27, _0x2b7c18);
        }
      });
      console.log("[Main] 主窗口进入后台模式 (" + (_0x503c6c || "unknown") + ")，任务视图已迁移至低功耗宿主");
      return;
    }
    if (!_0x44bb32()) {
      const _0x500961 = _0x1c23ef();
      const _0xa99115 = _0x2f80d7();
      _0x6b1da4.forEach((_0x1f1e36, _0x5ab64c) => {
        if (!_0x516db6(_0x5ab64c)) {
          return;
        }
        const _0x263aea = _0x500961.has(_0x5ab64c) ? _0x398e49.get(_0x5ab64c) || _0x1f1e36 : _0x1f1e36;
        _0xa99115.add(_0x5ab64c);
        _0x3d800c(_0x5ab64c, _0x263aea);
      });
    }
    _0x672d4f(_0x503c6c || "foreground");
    _0x8c2ce();
    _0x28debd("main-window-" + (_0x503c6c || "foreground"));
    const _0x413ffb = setTimeout(() => {
      _0x672d4f((_0x503c6c || "foreground") + "-confirm");
      _0x40e977("");
    }, 120);
    if (typeof _0x413ffb.unref === "function") {
      _0x413ffb.unref();
    }
  }
  function _0x1d881e(_0x118d83) {
    const _0x408962 = _0x577aff();
    if (_0xa80493() || !_0x408962 || _0x408962.isDestroyed()) {
      return false;
    }
    if (!_0x408962.isVisible() || _0x408962.isMinimized()) {
      return false;
    }
    const _0x5b187 = _0x23460b();
    return _0x44bb32() && (!_0x5b187 || _0x5b187.has(_0x118d83));
  }
  function _0x45f3d6(_0xe81eb1) {
    const _0x32555c = Math.max(_0xe81eb1?.width || 800, 100);
    const _0x3af7f4 = Math.max(_0xe81eb1?.height || 600, 100);
    return {
      x: -5000,
      y: -5000,
      width: _0x32555c,
      height: _0x3af7f4
    };
  }
  function _0xe82ffb(_0x4f289f, _0x2d4995 = "release") {
    if (!_0x4f289f || _0x22db08() !== _0x4f289f) {
      return false;
    }
    if (_0x4f289f.timer) {
      clearTimeout(_0x4f289f.timer);
    }
    if (_0x4f289f.affinityReleaseTimer) {
      clearTimeout(_0x4f289f.affinityReleaseTimer);
    }
    if (_0x4f289f.webContents && _0x4f289f.destroyedListener) {
      try {
        _0x4f289f.webContents.removeListener("destroyed", _0x4f289f.destroyedListener);
      } catch (_0x3ac698) {}
    }
    _0x5cb6ec(null);
    console.log("[Main] 后台互动执行权已释放: " + _0x4f289f.viewKey + " (" + _0x2d4995 + ")");
    _0x309d79();
    return true;
  }
  function _0x309d79() {
    if (_0x22db08()) {
      return;
    }
    const _0x251115 = _0x87d265();
    while (_0x251115.length > 0) {
      const _0x31b000 = _0x251115.shift();
      const _0x4bf31b = _0x31b000.webContents;
      if (!_0x4bf31b || _0x4bf31b.isDestroyed?.()) {
        _0x31b000.resolve({
          acquired: false,
          reason: "sender_destroyed"
        });
        continue;
      }
      const _0x3740aa = {
        viewKey: _0x31b000.viewKey,
        webContents: _0x4bf31b,
        webContentsId: _0x4bf31b.id,
        acquiredAt: Date.now(),
        timer: null,
        destroyedListener: null
      };
      _0x3740aa.destroyedListener = () => _0xe82ffb(_0x3740aa, "sender_destroyed");
      try {
        _0x4bf31b.once("destroyed", _0x3740aa.destroyedListener);
      } catch (_0x2b5e34) {}
      _0x3740aa.timer = setTimeout(() => {
        console.warn("[Main] 后台互动执行权超时释放: " + _0x3740aa.viewKey);
        _0xe82ffb(_0x3740aa, "lease_timeout");
      }, BACKGROUND_INTERACTION_SLOT_LEASE_MS);
      if (typeof _0x3740aa.timer.unref === "function") {
        _0x3740aa.timer.unref();
      }
      _0x5cb6ec(_0x3740aa);
      console.log("[Main] 后台互动执行权已授予: " + _0x3740aa.viewKey + " wait=" + (Date.now() - _0x31b000.queuedAt) + "ms");
      _0x31b000.resolve({
        acquired: true,
        waitedMs: Date.now() - _0x31b000.queuedAt
      });
      return;
    }
  }
  function _0x53e695(_0x124c3d, _0x285e72) {
    if (!_0x124c3d || !_0x285e72 || _0x285e72.isDestroyed?.()) {
      return Promise.resolve({
        acquired: false,
        reason: "invalid_sender"
      });
    }
    const _0xe5a418 = _0x22db08();
    if (_0xe5a418 && _0xe5a418.viewKey === _0x124c3d && _0xe5a418.webContentsId === _0x285e72.id) {
      if (_0xe5a418.affinityReleaseTimer) {
        clearTimeout(_0xe5a418.affinityReleaseTimer);
        _0xe5a418.affinityReleaseTimer = null;
      }
      _0xe5a418.affinityHolding = false;
      return Promise.resolve({
        acquired: true,
        reused: true,
        waitedMs: 0
      });
    }
    if (_0xe5a418 && _0xe5a418.affinityHolding && _0xe5a418.viewKey !== _0x124c3d) {
      console.log("[Main] 发现其它账号 " + _0x124c3d + " 申请执行权，抢占清理上个账号的 affinity 保留锁: " + _0xe5a418.viewKey);
      _0xe82ffb(_0xe5a418, "preempt_for_next_account");
    }
    return new Promise(_0x18171d => {
      _0x87d265().push({
        viewKey: _0x124c3d,
        webContents: _0x285e72,
        queuedAt: Date.now(),
        resolve: _0x18171d
      });
      _0x309d79();
    });
  }
  function _0xe06977(_0x35a8c4, _0x51639a, _0x5c9b02 = "release", {
    preferReacquireMs = 0
  } = {}) {
    const _0x5cf8d5 = _0x22db08();
    if (!_0x5cf8d5) {
      return {
        released: false,
        reason: "no_owner"
      };
    }
    if (_0x5cf8d5.viewKey !== _0x35a8c4 || _0x5cf8d5.webContentsId !== _0x51639a?.id) {
      return {
        released: false,
        reason: "not_owner"
      };
    }
    const _0x551aee = _0x87d265().length > 0;
    const _0x26c76e = _0x551aee ? 0 : Math.max(0, Math.min(15000, Number(preferReacquireMs) || 0));
    if (_0x26c76e > 0) {
      if (_0x5cf8d5.affinityReleaseTimer) {
        clearTimeout(_0x5cf8d5.affinityReleaseTimer);
      }
      _0x5cf8d5.affinityHolding = true;
      _0x5cf8d5.affinityReleaseTimer = setTimeout(() => {
        _0x5cf8d5.affinityReleaseTimer = null;
        _0x5cf8d5.affinityHolding = false;
        _0x71829(_0x35a8c4);
        _0xe82ffb(_0x5cf8d5, "affinity_timeout");
      }, _0x26c76e);
      _0x5cf8d5.affinityReleaseTimer.unref?.();
      console.log("[Main] 为同一用户后续动作保留互动执行权: " + _0x35a8c4 + " " + _0x26c76e + "ms");
      return {
        released: false,
        reserved: true,
        preferReacquireMs: _0x26c76e
      };
    }
    return {
      released: _0xe82ffb(_0x5cf8d5, _0x5c9b02)
    };
  }
  function _0x28ad37(_0x362cbc, _0x304fe3 = "view_stopped") {
    if (!_0x362cbc) {
      return;
    }
    const _0x439ed3 = _0x87d265();
    for (let _0x3334cb = _0x439ed3.length - 1; _0x3334cb >= 0; _0x3334cb--) {
      const _0x319493 = _0x439ed3[_0x3334cb];
      if (_0x319493.viewKey !== _0x362cbc) {
        continue;
      }
      _0x439ed3.splice(_0x3334cb, 1);
      try {
        _0x319493.resolve({
          acquired: false,
          reason: _0x304fe3
        });
      } catch (_0x5a9af8) {}
    }
    const _0x4efe37 = _0x22db08();
    if (_0x4efe37?.viewKey === _0x362cbc) {
      _0xe82ffb(_0x4efe37, _0x304fe3);
    }
  }
  function _0x14baa6() {
    const _0x380aa1 = _0x1750bc();
    if (!_0x380aa1 || _0x380aa1.isDestroyed()) {
      return [];
    }
    try {
      return _0x380aa1.getBrowserViews();
    } catch (_0x2754d7) {
      return [];
    }
  }
  function _0x1e5f3a() {
    let _0x75fdda = 0;
    let _0x41e865 = 0;
    try {
      const _0x7e8368 = screen.getAllDisplays();
      if (_0x7e8368.length > 0) {
        _0x75fdda = Math.min(..._0x7e8368.map(_0x1b6b0e => Number(_0x1b6b0e.bounds?.x) || 0));
        const _0x297b09 = screen.getPrimaryDisplay();
        _0x41e865 = Number(_0x297b09?.workArea?.y ?? _0x297b09?.bounds?.y) || 0;
      }
    } catch (_0x270186) {}
    return {
      x: _0x75fdda - COMPACT_BACKGROUND_AUTOMATION_WIDTH - 4096,
      y: _0x41e865,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    };
  }
  function _0x3c839d() {
    const _0x5e4191 = _0x1e5f3a();
    if (process.platform !== "win32") {
      return _0x5e4191;
    }
    let _0x4fd351 = 0;
    try {
      const _0x3b46e5 = screen.getAllDisplays();
      if (_0x3b46e5.length > 0) {
        _0x4fd351 = Math.min(..._0x3b46e5.map(_0x2c4b0c => Number(_0x2c4b0c.bounds?.x) || 0));
      }
    } catch (_0x256127) {}
    return {
      ..._0x5e4191,
      x: _0x4fd351 - COMPACT_BACKGROUND_AUTOMATION_WIDTH + 1
    };
  }
  function _0x24cc79(_0x38f72b, _0x1b1760) {
    if (process.platform !== "win32") {
      return false;
    }
    const _0x54e89e = _0x1750bc();
    if (!_0x54e89e || _0x54e89e.isDestroyed()) {
      return false;
    }
    _0x54e89e.__radarComposerSurfaceViewKey = _0x38f72b;
    try {
      _0x54e89e.setBounds(_0x3c839d(), false);
      _0x54e89e.setSkipTaskbar(true);
      try {
        _0x54e89e.webContents.invalidate();
      } catch (_0x214e14) {}
      try {
        _0x1b1760?.invalidate?.();
      } catch (_0x18fea0) {}
      return true;
    } catch (_0x515609) {
      _0x54e89e.__radarComposerSurfaceViewKey = null;
      console.warn("[Main] 评论编辑器激活面创建失败 " + (_0x38f72b || "?") + ": " + _0x515609.message);
      return false;
    }
  }
  async function _0x1cb43a(_0x34e948) {
    if (process.platform !== "win32" || !_0x34e948 || _0x34e948.isDestroyed?.()) {
      return {
        enabled: false,
        reason: process.platform === "win32" ? "web_contents_unavailable" : "not_windows"
      };
    }
    const _0x4eba9b = _0x34e948.debugger;
    let _0xa69439 = false;
    try {
      if (!_0x4eba9b.isAttached()) {
        _0x4eba9b.attach("1.3");
        _0xa69439 = true;
      }
      await _0x4eba9b.sendCommand("Emulation.setFocusEmulationEnabled", {
        enabled: true
      });
      try {
        await _0x4eba9b.sendCommand("Page.bringToFront");
      } catch (_0x22f543) {}
      return {
        enabled: true
      };
    } catch (_0xb888fb) {
      console.warn("[Main] Windows 后台页面焦点仿真失败: " + _0xb888fb.message);
      return {
        enabled: false,
        reason: _0xb888fb.message || "focus_emulation_failed"
      };
    } finally {
      if (_0xa69439 && _0x4eba9b.isAttached()) {
        try {
          _0x4eba9b.detach();
        } catch (_0x576f2d) {}
      }
    }
  }
  function _0x2a259c(_0x5520cf) {
    const _0x13e890 = _0x1750bc();
    if (!_0x13e890 || _0x13e890.isDestroyed()) {
      return false;
    }
    if (_0x13e890.__radarComposerSurfaceViewKey && _0x13e890.__radarComposerSurfaceViewKey !== _0x5520cf) {
      return false;
    }
    if (!_0x13e890.__radarComposerSurfaceViewKey) {
      return false;
    }
    _0x13e890.__radarComposerSurfaceViewKey = null;
    _0x30ec8d(_0x13e890, "composer-release");
    return true;
  }
  function _0x30ec8d(_0x4017f3, _0x1651ae = "park") {
    if (!_0x4017f3 || _0x4017f3.isDestroyed() || _0x4017f3.__radarBackgroundHostParking) {
      return false;
    }
    if (_0x4017f3.__radarComposerSurfaceViewKey && _0x1651ae !== "composer-release") {
      return false;
    }
    _0x4017f3.__radarBackgroundHostParking = true;
    try {
      const _0x3b3956 = _0x1e5f3a();
      const _0x465c76 = _0x4017f3.getBounds();
      const _0x27d212 = _0x465c76.x !== _0x3b3956.x || _0x465c76.y !== _0x3b3956.y || _0x465c76.width !== _0x3b3956.width || _0x465c76.height !== _0x3b3956.height;
      if (_0x27d212) {
        _0x4017f3.setBounds(_0x3b3956, false);
      }
      try {
        _0x4017f3.setSkipTaskbar(true);
      } catch (_0x396894) {}
      return true;
    } catch (_0x22f254) {
      console.warn("[Main] 后台自动化宿主屏外校正失败(" + _0x1651ae + "): " + _0x22f254.message);
      return false;
    } finally {
      _0x4017f3.__radarBackgroundHostParking = false;
    }
  }
  function _0x240208(_0x51146a, _0x589c1b = "repark") {
    if (!_0x51146a || _0x51146a.isDestroyed()) {
      return;
    }
    if (_0x51146a.__radarBackgroundHostReparkTimer) {
      clearTimeout(_0x51146a.__radarBackgroundHostReparkTimer);
    }
    _0x51146a.__radarBackgroundHostReparkTimer = setTimeout(() => {
      _0x51146a.__radarBackgroundHostReparkTimer = null;
      _0x30ec8d(_0x51146a, _0x589c1b);
    }, 0);
    _0x51146a.__radarBackgroundHostReparkTimer.unref?.();
  }
  function _0x4e5878() {
    _0x123e53(false);
    _0x306a39(0);
    _0x166d2f(0);
  }
  function _0x202bf0(_0x30af0a = BACKGROUND_HOST_FOCUS_ACTIVATE_GUARD_MS) {
    if (process.platform !== "darwin" || !_0xa80493()) {
      return;
    }
    _0x123e53(true);
    _0x306a39(Date.now() + Math.max(100, Number(_0x30af0a) || 0));
    _0x166d2f(0);
  }
  function _0x2f1cde(_0x22d62c) {
    if (!_0x22d62c || _0x22d62c.isDestroyed()) {
      return;
    }
    _0x30ec8d(_0x22d62c, "before-show");
    if (!_0x22d62c.isVisible()) {
      _0x202bf0(BACKGROUND_HOST_SHOW_ACTIVATE_GUARD_MS);
      try {
        _0x22d62c.showInactive();
      } catch (_0xff0b29) {}
    }
    _0x30ec8d(_0x22d62c, "after-show");
    _0x240208(_0x22d62c, "after-show-confirm");
  }
  function _0x26478d() {
    const _0x50e7be = Date.now();
    const _0x612c73 = _0x577aff();
    const _0x1eaf60 = _0x1750bc();
    const _0x2f18bd = process.platform === "darwin" && !!_0xa80493() && !!_0x612c73 && !_0x612c73.isDestroyed() && !!_0x1eaf60 && !_0x1eaf60.isDestroyed();
    if (!_0x2f18bd) {
      _0x4e5878();
      return false;
    }
    if (_0x8a6c1a() && _0x50e7be <= _0x2dd610()) {
      _0x123e53(false);
      _0x306a39(0);
      _0x166d2f(_0x50e7be + BACKGROUND_HOST_RELATED_EVENT_GRACE_MS);
      return true;
    }
    if (_0x50e7be <= _0x3e6b29()) {
      return true;
    }
    _0x4e5878();
    return false;
  }
  function _0x587405(_0x5fd327) {
    if (!_0x26478d()) {
      return false;
    }
    const _0x49006b = _0x4ef0c6();
    console.log("[Main] 已忽略后台自动化宿主触发的主窗口 " + _0x5fd327);
    setImmediate(() => {
      const _0x187a7c = _0x577aff();
      if (!_0x187a7c || _0x187a7c.isDestroyed() || !_0xa80493()) {
        return;
      }
      try {
        if (_0x49006b === "minimize") {
          if (!_0x187a7c.isMinimized()) {
            _0x187a7c.minimize();
          }
        } else if (_0x187a7c.isVisible()) {
          _0x187a7c.hide();
        }
      } catch (_0x16320f) {}
    });
    return true;
  }
  function _0x315f90() {
    const _0x4c8644 = _0x1750bc();
    if (_0x4c8644 && !_0x4c8644.isDestroyed()) {
      _0x2f1cde(_0x4c8644);
      return _0x4c8644;
    }
    const _0x1aefec = _0x1e5f3a();
    const _0x513da7 = new BrowserWindow({
      ..._0x1aefec,
      show: false,
      frame: false,
      title: "",
      hasShadow: false,
      backgroundColor: "#111827",
      focusable: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      closable: false,
      fullscreenable: false,
      paintWhenInitiallyHidden: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        backgroundThrottling: false
      }
    });
    _0x15d7a9(_0x513da7);
    _0x2fbb55(_0x513da7);
    if (process.platform === "darwin") {
      try {
        _0x513da7.setHiddenInMissionControl(true);
      } catch (_0x25ca4e) {}
      try {
        _0x513da7.setWindowButtonVisibility(false);
      } catch (_0x51b839) {}
    }
    _0x30ec8d(_0x513da7, "created");
    try {
      _0x513da7.setIgnoreMouseEvents(true);
    } catch (_0x47b297) {}
    try {
      _0x513da7.webContents.setAudioMuted(true);
    } catch (_0xc1e8b9) {}
    const _0x5a8d09 = () => {
      if (!_0x513da7.isDestroyed()) {
        _0x2f1cde(_0x513da7);
      }
    };
    _0x513da7.once("ready-to-show", _0x5a8d09);
    _0x513da7.webContents.once("did-finish-load", _0x5a8d09);
    const _0x10c7df = () => {
      _0x240208(_0x513da7, "display-topology-changed");
    };
    try {
      screen.on("display-added", _0x10c7df);
      screen.on("display-removed", _0x10c7df);
      screen.on("display-metrics-changed", _0x10c7df);
    } catch (_0x4324c2) {}
    _0x513da7.on("show", () => {
      if (_0x513da7.isDestroyed()) {
        return;
      }
      _0x30ec8d(_0x513da7, "show-event");
      _0x240208(_0x513da7, "show-event-confirm");
    });
    _0x513da7.on("move", () => {
      if (!_0x513da7.__radarBackgroundHostParking) {
        _0x240208(_0x513da7, "move-event");
      }
    });
    _0x513da7.on("focus", () => {
      _0x240208(_0x513da7, "focus-event");
      setImmediate(() => {
        if (_0x513da7.isDestroyed()) {
          return;
        }
        _0x30ec8d(_0x513da7, "focus-repark");
        try {
          if (_0x513da7.isFocused()) {
            _0x513da7.blur();
          }
        } catch (_0x214f55) {}
        const _0x4f1abb = _0x577aff();
        if (_0x4f1abb && !_0x4f1abb.isDestroyed() && _0x4f1abb.isVisible() && !_0x4f1abb.isMinimized()) {
          _0x183795("host-focus-repark");
        }
      });
    });
    _0x513da7.on("closed", () => {
      if (_0x513da7.__radarBackgroundHostReparkTimer) {
        clearTimeout(_0x513da7.__radarBackgroundHostReparkTimer);
        _0x513da7.__radarBackgroundHostReparkTimer = null;
      }
      try {
        screen.removeListener("display-added", _0x10c7df);
        screen.removeListener("display-removed", _0x10c7df);
        screen.removeListener("display-metrics-changed", _0x10c7df);
      } catch (_0x213bd3) {}
      if (_0x1750bc() === _0x513da7) {
        _0x15d7a9(null);
      }
      const _0x544495 = _0x577aff();
      if (_0x544495 && !_0x544495.isDestroyed() && _0x544495.isVisible()) {
        _0x183795("background-host-closed");
      }
    });
    _0x513da7.loadURL("about:blank").catch(() => {});
    setTimeout(_0x5a8d09, 250);
    console.log("[Main] 已创建低功耗后台自动化宿主窗口");
    return _0x513da7;
  }
  function _0x29d855(_0x20e0cf, _0x4d0183) {
    if (!_0x20e0cf || _0x20e0cf.isDestroyed() || !_0x4d0183) {
      return;
    }
    try {
      if (_0x20e0cf.getBrowserViews().includes(_0x4d0183)) {
        _0x20e0cf.removeBrowserView(_0x4d0183);
      }
    } catch (_0x27beb8) {}
  }
  function _0x2758e1(_0x6d369) {
    _0x29d855(_0x1750bc(), _0x6d369);
  }
  function _0x2a2d51() {
    const _0x270a5e = _0x1750bc();
    if (!_0x270a5e || _0x270a5e.isDestroyed()) {
      return;
    }
    if (_0x14baa6().length > 0) {
      return;
    }
    if (_0xc58d82()) {
      return;
    }
    const _0x3a5117 = process.platform === "darwin" ? 800 : 100;
    const _0x4288ed = setTimeout(() => {
      _0x5c7f1c(null);
      if (_0x1750bc() !== _0x270a5e || _0x270a5e.isDestroyed()) {
        return;
      }
      if (_0x14baa6().length > 0) {
        return;
      }
      if (_0x32ee21().size > 0) {
        _0x2a2d51();
        return;
      }
      _0x15d7a9(null);
      try {
        _0x270a5e.destroy();
      } catch (_0x1922bf) {}
      console.log("[Main] 后台自动化宿主已安全释放");
    }, _0x3a5117);
    _0x5c7f1c(_0x4288ed);
    if (typeof _0x4288ed.unref === "function") {
      _0x4288ed.unref();
    }
  }
  function _0x516db6(_0x5ef395) {
    if (_0x1c23ef().has(_0x5ef395)) {
      return true;
    }
    if (_0x5f0b30(_0x5ef395)) {
      return true;
    }
    if (_0x74d7e2(_0x5ef395)) {
      return true;
    }
    const _0x3e2c49 = _0x15482d().get(_0x5ef395);
    return !!_0x3e2c49 && !!_0x3e2c49.taskId;
  }
  function _0x7cfdcc(_0x975624) {
    if (!_0x975624 || _0x975624.isDestroyed?.()) {
      return;
    }
    _0x975624.executeJavaScript("\n            (() => {\n                window.__radarAutomationViewportChangedAt = Date.now();\n                return true;\n            })()\n        ", true).catch(() => {});
    [60, 200].forEach(_0x297c89 => {
      const _0x3e78c3 = setTimeout(() => {
        if (_0x975624.isDestroyed?.()) {
          return;
        }
        _0x3ab56c(_0x975624, {
          force: true
        });
      }, _0x297c89);
      if (typeof _0x3e78c3.unref === "function") {
        _0x3e78c3.unref();
      }
    });
  }
  function _0xd854f2(_0x391bcf) {
    return _0x2f80d7().has(_0x391bcf) || _0x207c8c().has(_0x391bcf);
  }
  function _0x581888(_0x16a0fb) {
    _0x2f80d7().delete(_0x16a0fb);
    _0x207c8c().delete(_0x16a0fb);
    _0x5c5640.delete(_0x16a0fb);
  }
  function _0x447cc2(_0x170e1d) {
    return !!_0x170e1d && (_0x207c8c().has(_0x170e1d) || _0x1c23ef().has(_0x170e1d));
  }
  function _0x2f07f4(_0x1a0776, _0x4699aa, _0x4a3a95) {
    if (!_0x1a0776 || !_0x133324(_0x4699aa)) {
      return;
    }
    const _0x2b09a0 = _0x2f9f4c();
    const _0x9eb733 = Number(_0x4a3a95);
    const _0x30e17e = _0x9eb733 > 0 ? _0x3c586b(_0x9eb733) : 0;
    _0x2b09a0.set(_0x1a0776, {
      bounds: {
        ..._0x4699aa
      },
      pendingBounds: {
        ..._0x4699aa
      },
      zoomFactor: _0x30e17e > 0 ? _0x30e17e : _0x2b09a0.get(_0x1a0776)?.zoomFactor || 0,
      at: Date.now()
    });
    const _0x5d0642 = _0x1c23ef().get(_0x1a0776);
    if (_0x5d0642) {
      _0x5d0642.previewBounds = {
        ..._0x4699aa
      };
      if (_0x30e17e > 0) {
        _0x5d0642.previewZoomFactor = _0x30e17e;
      }
    }
  }
  function _0x4af95c(_0x37503d, _0x11525c = null) {
    const _0x438de2 = _0x2f9f4c().get(_0x37503d);
    const _0x49ae04 = _0x133324(_0x11525c?.previewBounds) ? _0x11525c.previewBounds : _0x133324(_0x438de2?.bounds) ? _0x438de2.bounds : _0x11525c?.bounds;
    const _0x4ccd31 = Number(_0x11525c?.previewZoomFactor || _0x438de2?.zoomFactor || _0x11525c?.zoomFactor || 1);
    const _0x3837de = _0x133324(_0x49ae04) ? Math.max(MIN_INTERACTIVE_AUTOMATION_ZOOM_FACTOR, Math.min(1, Number(_0x49ae04.width) / VISIBLE_AUTOMATION_LOGICAL_WIDTH, Number(_0x49ae04.height) / VISIBLE_AUTOMATION_LOGICAL_HEIGHT)) : 1;
    const _0x5bbf2f = _0x4ccd31 > 0 ? Math.min(_0x4ccd31, _0x3837de) : _0x3837de;
    return {
      bounds: _0x133324(_0x49ae04) ? {
        ..._0x49ae04
      } : null,
      zoomFactor: _0x5bbf2f > 0 ? _0x5bbf2f : 1
    };
  }
  function _0x3f44d5(_0x1854f2, _0x10c519) {
    if (!_0x1854f2 || !_0x10c519 || _0x10c519.webContents?.isDestroyed?.()) {
      return false;
    }
    const _0x3d089d = _0x577aff();
    if (!_0x1d881e(_0x1854f2) || !_0x3d089d || _0x3d089d.isDestroyed()) {
      return false;
    }
    const _0xb1273b = _0x2f9f4c().get(_0x1854f2);
    if (!_0x133324(_0xb1273b?.bounds)) {
      return false;
    }
    _0x2758e1(_0x10c519);
    _0x2b41c7(_0x10c519.webContents);
    _0x10c519.setBounds({
      ..._0xb1273b.bounds
    });
    if (Number(_0xb1273b.zoomFactor) > 0) {
      try {
        _0x10c519.webContents.setZoomFactor(Number(_0xb1273b.zoomFactor));
      } catch (_0x50ee9a) {}
    }
    if (!_0x3d089d.getBrowserViews().includes(_0x10c519)) {
      _0x3d089d.addBrowserView(_0x10c519);
    }
    if (!_0x1c23ef().has(_0x1854f2)) {
      _0x4dbb08(_0x10c519, {
        context: "restore-preview-after-execution:" + _0x1854f2
      });
    }
    _0x3cfc9d(_0x10c519.webContents, _0x10c519);
    return true;
  }
  function _0x5073d1(_0x18bd37, {
    active = false
  } = {}) {
    if (!_0x18bd37 || _0x18bd37.isDestroyed?.()) {
      return;
    }
    const _0x3f0f70 = _0x1ea899(_0x18bd37);
    if (_0x3f0f70 && _0x1d881e(_0x3f0f70) && !_0x447cc2(_0x3f0f70)) {
      _0x2b41c7(_0x18bd37);
      return;
    }
    try {
      _0x18bd37.setAudioMuted(true);
    } catch (_0x17c249) {}
    try {
      _0x18bd37.setBackgroundThrottling(false);
    } catch (_0x55ca65) {}
    try {
      _0x18bd37.setImageAnimationPolicy("animate");
    } catch (_0x565a78) {}
    try {
      _0x18bd37.setFrameRate(active ? BACKGROUND_AUTOMATION_FRAME_RATE_ACTIVE : BACKGROUND_AUTOMATION_FRAME_RATE_IDLE);
    } catch (_0x23ff68) {}
  }
  function _0x2b5976(_0x161f7c) {
    if (!_0x161f7c || _0x161f7c.isDestroyed?.()) {
      return;
    }
    const _0x8515d = _0x25bc09();
    try {
      if (!_0x8515d.has(_0x161f7c)) {
        const _0x24753a = _0x161f7c.getZoomFactor?.() || 1;
        _0x8515d.set(_0x161f7c, _0x24753a);
      }
      if (Math.abs((_0x161f7c.getZoomFactor?.() || 1) - 1) > 0.001) {
        _0x161f7c.setZoomFactor(1);
      }
    } catch (_0x14d6fd) {}
  }
  function _0x2b41c7(_0x3ff68e) {
    if (!_0x3ff68e || _0x3ff68e.isDestroyed?.()) {
      return;
    }
    try {
      _0x3ff68e.setAudioMuted(_0x313703.get("system_video_muted", true));
    } catch (_0x29ccdc) {}
    try {
      _0x3ff68e.setBackgroundThrottling(false);
    } catch (_0x403689) {}
    try {
      _0x3ff68e.setFrameRate(FOREGROUND_AUTOMATION_FRAME_RATE);
    } catch (_0x1ba07c) {}
    try {
      _0x3ff68e.setImageAnimationPolicy("animate");
    } catch (_0x513cc1) {}
    const _0x3e160d = _0x25bc09();
    try {
      if (_0x3e160d.has(_0x3ff68e)) {
        const _0x4e946d = _0x3e160d.get(_0x3ff68e) || 1;
        _0x3e160d.delete(_0x3ff68e);
        _0x3ff68e.setZoomFactor(_0x4e946d);
      }
    } catch (_0x2f54e7) {}
    restoreOccludedPageRendering(_0x3ff68e);
  }
  function _0x435e64(_0xf2efa9) {
    return {
      x: 0,
      y: 0,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    };
  }
  function _0x381b80() {
    if (process.platform === "win32") {
      return false;
    }
    const _0x224dcd = _0x577aff();
    return Boolean(_0x224dcd && !_0x224dcd.isDestroyed() && _0x224dcd.isVisible() && !_0x224dcd.isMinimized());
  }
  function _0x3d800c(_0x3f4003, _0x34ba6d) {
    if (!_0x34ba6d || _0x34ba6d.webContents?.isDestroyed?.() || !_0x381b80()) {
      return false;
    }
    if (_0x1d881e(_0x3f4003)) {
      return false;
    }
    _0x2758e1(_0x34ba6d);
    _0x5073d1(_0x34ba6d.webContents, {
      active: _0x207c8c().has(_0x3f4003) || _0x1c23ef().has(_0x3f4003)
    });
    _0x2b5976(_0x34ba6d.webContents);
    const _0x5c2b8d = _0x577aff();
    if (!_0x5c2b8d.getBrowserViews().includes(_0x34ba6d)) {
      _0x5c2b8d.addBrowserView(_0x34ba6d);
    }
    _0x34ba6d.setBounds({
      x: -5000,
      y: -5000,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    });
    try {
      _0x34ba6d.webContents.invalidate?.();
    } catch (_0x7fe421) {}
    _0x2a2d51();
    console.log("[Main] 实况视图已在主窗口内离屏保留: " + _0x3f4003);
    return true;
  }
  function _0x13dd57(_0x1e826c, _0x27cb37, {
    active = false,
    force = false
  } = {}) {
    if (!_0x27cb37 || _0x27cb37.webContents?.isDestroyed?.()) {
      return;
    }
    if (!force && _0x1d881e(_0x1e826c)) {
      console.log("[Main] 跳过后台托管（画面已打开）: " + _0x1e826c);
      return null;
    }
    const _0x189f67 = _0x577aff();
    if (_0x3d800c(_0x1e826c, _0x27cb37)) {
      return _0x189f67;
    }
    _0x5073d1(_0x27cb37.webContents, {
      active: active
    });
    _0x2b5976(_0x27cb37.webContents);
    _0x29d855(_0x189f67, _0x27cb37);
    const _0x5b9828 = _0x315f90();
    _0x27cb37.setBounds(_0x435e64(_0x1e826c));
    if (!_0x5b9828.getBrowserViews().includes(_0x27cb37)) {
      _0x5b9828.addBrowserView(_0x27cb37);
    }
    if (!_0x27cb37.webContents.__radarBackgroundLowPowerHookAttached) {
      _0x27cb37.webContents.__radarBackgroundLowPowerHookAttached = true;
      _0x27cb37.webContents.on("dom-ready", () => {
        if (!_0x14baa6().includes(_0x27cb37)) {
          return;
        }
        _0x5073d1(_0x27cb37.webContents, {
          active: _0x207c8c().has(_0x1e826c) || _0x1c23ef().has(_0x1e826c)
        });
      });
    }
    if (active) {
      const _0x3ec314 = _0x22db08();
      const _0x1a2e30 = !!_0x3ec314 && (_0x3ec314.viewKey !== _0x1e826c || _0x3ec314.webContentsId !== _0x27cb37.webContents.id);
      if (!_0x1a2e30) {
        try {
          _0x5b9828.setTopBrowserView(_0x27cb37);
        } catch (_0xf60102) {}
        _0x202bf0();
        _0x42c39b(_0x27cb37.webContents);
        _0x30ec8d(_0x5b9828, "after-active-attach");
        try {
          if (_0x5b9828.isFocused()) {
            _0x5b9828.blur();
          }
        } catch (_0x529fe0) {}
        _0x240208(_0x5b9828, "after-active-attach");
      }
    }
    return _0x5b9828;
  }
  function _0x2288d4(_0x53a6a5, _0x5850cf = "preview-spectator") {
    if (!_0x53a6a5 || !_0x1d881e(_0x53a6a5)) {
      return false;
    }
    const _0x20c7d6 = _0x1beec().get(_0x53a6a5);
    if (!_0x20c7d6 || _0x20c7d6.webContents?.isDestroyed?.()) {
      return false;
    }
    if (_0x1c23ef().has(_0x53a6a5)) {
      const _0x1ffe16 = _0x258d66(_0x53a6a5, _0x5850cf);
      if (_0x1ffe16.restored) {
        _0x3cfc9d(_0x20c7d6.webContents, _0x20c7d6);
        return true;
      }
      return false;
    }
    if (_0x3f44d5(_0x53a6a5, _0x20c7d6)) {
      return true;
    }
    console.warn("[Main] 打开画面暂无有效卡片尺寸，等待 bounds 同步: " + _0x53a6a5 + " (" + _0x5850cf + ")");
    return false;
  }
  function _0x164b9e(_0x432757, _0x1d9b40) {
    if (!_0x1d9b40 || _0x1d9b40.webContents?.isDestroyed?.()) {
      return;
    }
    _0x207c8c().delete(_0x432757);
    _0x2f80d7().add(_0x432757);
    _0x13dd57(_0x432757, _0x1d9b40, {
      active: false
    });
    console.log("[Main] 任务进入低功耗后台宿主: " + _0x432757);
  }
  async function _0x3407da(_0x3638c1, {
    claimInteractionSlot = false,
    requesterWebContents = null,
    requireComposerSurface = false
  } = {}) {
    if (!_0x3638c1) {
      return {
        ok: false,
        reason: "no_view_key"
      };
    }
    const _0x4267e3 = _0x1beec().get(_0x3638c1);
    if (!_0x4267e3) {
      return {
        ok: false,
        reason: "no_view"
      };
    }
    if (!_0x3af5bb.has(_0x3638c1)) {
      _0x3af5bb.set(_0x3638c1, 1);
    }
    const _0x515b8e = _0x3af5bb.get(_0x3638c1);
    const _0x375f32 = String(_0x15482d().get(_0x3638c1)?.taskId || "");
    const _0x2dc69d = String(_0x1c23ef().get(_0x3638c1)?.interactionId || "");
    const _0x35b918 = !!_0x5f0b30?.(_0x3638c1);
    const _0x477d6e = !!_0x74d7e2?.(_0x3638c1);
    const _0x3d9d7c = () => _0x3af5bb.get(_0x3638c1) === _0x515b8e && _0x1beec().get(_0x3638c1) === _0x4267e3 && !_0x4267e3.webContents?.isDestroyed?.() && String(_0x15482d().get(_0x3638c1)?.taskId || "") === _0x375f32 && String(_0x1c23ef().get(_0x3638c1)?.interactionId || "") === _0x2dc69d && (!_0x35b918 || !!_0x5f0b30?.(_0x3638c1)) && (!_0x477d6e || !!_0x74d7e2?.(_0x3638c1)) && (_0x1d881e(_0x3638c1) || _0x516db6(_0x3638c1));
    if (_0x1d881e(_0x3638c1) && !claimInteractionSlot) {
      const _0xd09188 = _0x577aff();
      return {
        ok: true,
        attached: !!_0xd09188 && !_0xd09188.isDestroyed() && !!_0xd09188.getBrowserViews().includes(_0x4267e3),
        visible: true
      };
    }
    if (!_0x1d881e(_0x3638c1) && !_0x516db6(_0x3638c1)) {
      return {
        ok: true,
        attached: false,
        reason: "no_active_task"
      };
    }
    let _0x5cf0de = false;
    let _0x1219d9 = 0;
    if (claimInteractionSlot) {
      const _0x2db0ef = await _0x53e695(_0x3638c1, requesterWebContents || _0x4267e3.webContents);
      if (!_0x2db0ef?.acquired) {
        return {
          ok: false,
          attached: false,
          reason: _0x2db0ef?.reason || "interaction_slot_failed"
        };
      }
      if (!_0x3d9d7c()) {
        _0xe06977(_0x3638c1, requesterWebContents || _0x4267e3.webContents, "stale_layout_generation");
        return {
          ok: false,
          attached: false,
          reason: "stale_layout_generation"
        };
      }
      _0x5cf0de = true;
      _0x1219d9 = Number(_0x2db0ef.waitedMs || 0);
      if (_0x1d881e(_0x3638c1) && !_0x1c23ef().has(_0x3638c1)) {
        _0x2758e1(_0x4267e3);
        const _0x43a1c2 = _0x577aff();
        if (_0x43a1c2 && !_0x43a1c2.isDestroyed() && !_0x43a1c2.getBrowserViews().includes(_0x4267e3)) {
          _0x43a1c2.addBrowserView(_0x4267e3);
        }
        _0x2b41c7(_0x4267e3.webContents);
        _0x4dbb08(_0x4267e3, {
          context: "ensure-visible-main-interaction:" + _0x3638c1
        });
        _0x42c39b(_0x4267e3.webContents);
        return {
          ok: true,
          attached: true,
          visible: true,
          interactionSlotAcquired: _0x5cf0de,
          interactionSlotWaitedMs: _0x1219d9
        };
      }
    }
    if (_0x1c23ef().has(_0x3638c1)) {
      const _0x2fd7aa = _0x1c23ef().get(_0x3638c1);
      const _0x20e14b = _0x4ae3ed().get(_0x3638c1);
      if (_0x20e14b && !_0x20e14b.webContents.isDestroyed()) {
        if (_0x119099(_0x3638c1) && _0x133324(_0x2fd7aa?.bounds)) {
          const _0xe8ccdd = _0x258d66(_0x3638c1, "ensure-visible-subview-interaction:" + _0x3638c1);
          if (_0xe8ccdd.interactionVisible) {
            _0x42c39b(_0x20e14b.webContents, {
              force: true
            });
          }
          _0x207c8c().add(_0x3638c1);
          return {
            ok: true,
            attached: true,
            visible: true,
            interaction: _0xe8ccdd.interactionVisible,
            warming: !_0xe8ccdd.interactionVisible,
            interactionSlotAcquired: _0x5cf0de,
            interactionSlotWaitedMs: _0x1219d9
          };
        }
        _0x13dd57(_0x3638c1, _0x20e14b, {
          active: true
        });
        const _0x33b907 = requireComposerSurface && _0x24cc79(_0x3638c1, _0x20e14b.webContents);
        const _0x34d01e = requireComposerSurface ? await _0x1cb43a(_0x20e14b.webContents) : {
          enabled: false
        };
        if (requireComposerSurface) {
          _0x20e14b.setBounds(_0x435e64(_0x3638c1));
          _0x3ab56c(_0x20e14b.webContents, {
            force: true
          });
          _0x3cfc9d(_0x20e14b.webContents, _0x20e14b);
          const _0x43f02e = _0x1219d9 >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420);
          await new Promise(_0x3bff77 => setTimeout(_0x3bff77, _0x43f02e));
          if (!_0x3d9d7c()) {
            if (_0x5cf0de) {
              _0xe06977(_0x3638c1, requesterWebContents || _0x4267e3.webContents, "stale_layout_generation");
            }
            return {
              ok: false,
              attached: false,
              reason: "stale_layout_generation"
            };
          }
        }
        _0x2f80d7().delete(_0x3638c1);
        _0x207c8c().add(_0x3638c1);
        return {
          ok: true,
          attached: true,
          interaction: true,
          stableViewport: true,
          composerSurface: !!_0x33b907,
          focusEmulated: !!_0x34d01e.enabled,
          surfaceWarmupMs: requireComposerSurface ? _0x1219d9 >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : 0,
          nativeWindowFocused: !!_0x1750bc()?.isFocused?.(),
          webContentsFocused: !!_0x20e14b.webContents?.isFocused?.(),
          interactionSlotAcquired: _0x5cf0de,
          interactionSlotWaitedMs: _0x1219d9
        };
      }
    }
    if (_0x381b80()) {
      const _0xd99975 = _0x1c23ef().has(_0x3638c1) ? _0x4ae3ed().get(_0x3638c1) || _0x4267e3 : _0x4267e3;
      _0x2f80d7().delete(_0x3638c1);
      _0x207c8c().add(_0x3638c1);
      _0x3d800c(_0x3638c1, _0xd99975);
      _0x3cfc9d(_0xd99975.webContents, _0xd99975);
      await new Promise(_0x2d6d64 => setTimeout(_0x2d6d64, BACKGROUND_LAYOUT_WARMUP_MS));
      if (!_0x3d9d7c()) {
        if (_0x5cf0de) {
          _0xe06977(_0x3638c1, requesterWebContents || _0x4267e3.webContents, "stale_layout_generation");
        }
        return {
          ok: false,
          attached: false,
          reason: "stale_layout_generation"
        };
      }
      return {
        ok: true,
        attached: true,
        parkedInMainWindow: true,
        interactionSlotAcquired: _0x5cf0de,
        interactionSlotWaitedMs: _0x1219d9
      };
    }
    const _0x1f0360 = _0x315f90();
    if (_0x207c8c().has(_0x3638c1) && _0x1f0360.getBrowserViews().includes(_0x4267e3)) {
      _0x13dd57(_0x3638c1, _0x4267e3, {
        active: true
      });
      const _0x526b28 = requireComposerSurface && _0x24cc79(_0x3638c1, _0x4267e3.webContents);
      const _0x82dfa5 = requireComposerSurface ? await _0x1cb43a(_0x4267e3.webContents) : {
        enabled: false
      };
      if (requireComposerSurface) {
        _0x4267e3.setBounds(_0x435e64(_0x3638c1));
        _0x3ab56c(_0x4267e3.webContents, {
          force: true
        });
        _0x3cfc9d(_0x4267e3.webContents, _0x4267e3);
        const _0x3e9144 = _0x1219d9 >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420);
        await new Promise(_0x2c823d => setTimeout(_0x2c823d, _0x3e9144));
        if (!_0x3d9d7c()) {
          if (_0x5cf0de) {
            _0xe06977(_0x3638c1, requesterWebContents || _0x4267e3.webContents, "stale_layout_generation");
          }
          return {
            ok: false,
            attached: false,
            reason: "stale_layout_generation"
          };
        }
      }
      return {
        ok: true,
        attached: true,
        reused: true,
        composerSurface: !!_0x526b28,
        focusEmulated: !!_0x82dfa5.enabled,
        surfaceWarmupMs: requireComposerSurface ? _0x1219d9 >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : 0,
        nativeWindowFocused: !!_0x1750bc()?.isFocused?.(),
        webContentsFocused: !!_0x4267e3.webContents?.isFocused?.(),
        interactionSlotAcquired: _0x5cf0de,
        interactionSlotWaitedMs: _0x1219d9
      };
    }
    _0x13dd57(_0x3638c1, _0x4267e3, {
      active: true
    });
    const _0x4d6ca2 = requireComposerSurface && _0x24cc79(_0x3638c1, _0x4267e3.webContents);
    const _0x8493f = requireComposerSurface ? await _0x1cb43a(_0x4267e3.webContents) : {
      enabled: false
    };
    _0x2f80d7().delete(_0x3638c1);
    _0x207c8c().add(_0x3638c1);
    _0x3cfc9d(_0x4267e3.webContents, _0x4267e3);
    const _0x1d4467 = requireComposerSurface && _0x1219d9 >= 500 ? BACKGROUND_INTERACTION_RESUME_WARMUP_MS : requireComposerSurface ? Math.max(BACKGROUND_LAYOUT_WARMUP_MS, 420) : BACKGROUND_LAYOUT_WARMUP_MS;
    await new Promise(_0xa32aac => setTimeout(_0xa32aac, _0x1d4467));
    if (!_0x3d9d7c()) {
      if (_0x5cf0de) {
        _0xe06977(_0x3638c1, requesterWebContents || _0x4267e3.webContents, "stale_layout_generation");
      }
      return {
        ok: false,
        attached: false,
        reason: "stale_layout_generation"
      };
    }
    return {
      ok: true,
      attached: true,
      composerSurface: !!_0x4d6ca2,
      focusEmulated: !!_0x8493f.enabled,
      surfaceWarmupMs: _0x1d4467,
      nativeWindowFocused: !!_0x1750bc()?.isFocused?.(),
      webContentsFocused: !!_0x4267e3.webContents?.isFocused?.(),
      interactionSlotAcquired: _0x5cf0de,
      interactionSlotWaitedMs: _0x1219d9
    };
  }
  function _0x71829(_0x4f8b09) {
    if (!_0x4f8b09) {
      return {
        ok: false,
        reason: "no_view_key"
      };
    }
    _0x45ba52(_0x4f8b09);
    _0x2a259c(_0x4f8b09);
    const _0x4f53e7 = _0x207c8c();
    if (!_0x4f53e7.has(_0x4f8b09)) {
      return {
        ok: true,
        skipped: true
      };
    }
    const _0xcda86 = _0x1beec().get(_0x4f8b09);
    _0x4f53e7.delete(_0x4f8b09);
    if (_0x1c23ef().has(_0x4f8b09)) {
      const _0x1f6694 = _0x1c23ef().get(_0x4f8b09);
      const _0x105fc4 = _0x4ae3ed().get(_0x4f8b09);
      let _0x387008 = false;
      if (_0x105fc4 && !_0x105fc4.webContents?.isDestroyed?.()) {
        if (_0x119099(_0x4f8b09) && _0x133324(_0x1f6694?.bounds)) {
          const _0x48cef4 = _0x258d66(_0x4f8b09, "release-visible-subview-interaction:" + _0x4f8b09);
          _0x387008 = _0x48cef4.interactionVisible;
        } else {
          _0x13dd57(_0x4f8b09, _0x105fc4, {
            active: true
          });
        }
        _0x4f53e7.add(_0x4f8b09);
      }
      if (_0xcda86 && !_0x387008) {
        _0x3f44d5(_0x4f8b09, _0xcda86);
      }
      if (_0x387008) {
        return {
          ok: true,
          visible: true,
          interaction: true
        };
      } else {
        return {
          ok: true,
          stableViewport: true,
          previewWatchOnly: true
        };
      }
    }
    if (_0x1d881e(_0x4f8b09)) {
      if (_0xcda86) {
        if (!_0x3f44d5(_0x4f8b09, _0xcda86)) {
          _0x2b41c7(_0xcda86.webContents);
        }
      }
      return {
        ok: true,
        visible: true
      };
    }
    if (_0xcda86 && _0x516db6(_0x4f8b09)) {
      _0x164b9e(_0x4f8b09, _0xcda86);
    }
    return {
      ok: true
    };
  }
  async function _0x946527(_0x5040c7, {
    taskGeneration = 0,
    runtimeTaskId = ""
  } = {}) {
    const _0x36148e = String(_0x5040c7 || "");
    if (!_0x36148e.startsWith("entity_")) {
      return {
        ok: false,
        reason: "not_entity_view"
      };
    }
    const _0x1cd479 = _0x1beec().get(_0x36148e);
    if (!_0x1cd479 || _0x1cd479.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable"
      };
    }
    const _0xadda0d = {
      taskGeneration: Number(taskGeneration) || 0,
      runtimeTaskId: String(runtimeTaskId || ""),
      acquiredAt: Date.now()
    };
    _0x5c5640.set(_0x36148e, _0xadda0d);
    _0x207c8c().add(_0x36148e);
    let _0x543c77;
    if (_0x1d881e(_0x36148e)) {
      const _0x17fcfe = _0x2f9f4c().get(_0x36148e);
      _0x2758e1(_0x1cd479);
      _0x2b41c7(_0x1cd479.webContents);
      const _0x137f38 = _0x577aff();
      if (_0x137f38 && !_0x137f38.isDestroyed() && !_0x137f38.getBrowserViews().includes(_0x1cd479)) {
        _0x137f38.addBrowserView(_0x1cd479);
      }
      if (_0x133324(_0x17fcfe?.bounds)) {
        _0x1cd479.setBounds({
          ..._0x17fcfe.bounds
        });
      }
      if (Number(_0x17fcfe?.zoomFactor) > 0) {
        try {
          _0x1cd479.webContents.setZoomFactor(Number(_0x17fcfe.zoomFactor));
        } catch (_0x5ce1c3) {}
      }
      _0x4dbb08(_0x1cd479, {
        context: "entity-execution-lease:" + _0x36148e
      });
      _0x543c77 = {
        ok: true,
        attached: true,
        visible: true
      };
    } else {
      _0x543c77 = await _0x3407da(_0x36148e, {
        claimInteractionSlot: false
      });
    }
    const _0x287b85 = _0x5c5640.get(_0x36148e);
    if (_0x287b85 !== _0xadda0d || _0x543c77 && _0x543c77.ok === false || _0x1beec().get(_0x36148e) !== _0x1cd479 || _0x1cd479.webContents?.isDestroyed?.()) {
      if (_0x287b85 === _0xadda0d) {
        _0x5c5640.delete(_0x36148e);
        _0x207c8c().delete(_0x36148e);
      }
      return {
        ok: false,
        reason: _0x543c77?.reason || "stale_entity_execution_lease"
      };
    }
    return {
      ok: true,
      taskGeneration: _0xadda0d.taskGeneration,
      layout: _0x543c77 || null
    };
  }
  function _0x2d0735(_0x34209f, {
    taskGeneration = null
  } = {}) {
    const _0x16e785 = String(_0x34209f || "");
    if (!_0x16e785.startsWith("entity_")) {
      return {
        ok: false,
        reason: "not_entity_view"
      };
    }
    const _0x5e55f7 = _0x5c5640.get(_0x16e785);
    if (!_0x5e55f7) {
      return {
        ok: true,
        skipped: true
      };
    }
    if (taskGeneration != null && Number(taskGeneration) !== Number(_0x5e55f7.taskGeneration)) {
      return {
        ok: false,
        reason: "stale_entity_execution_lease_release"
      };
    }
    _0x5c5640.delete(_0x16e785);
    return _0x71829(_0x16e785);
  }
  function _0xe0055d(_0x48f358) {
    return _0x5c5640.has(String(_0x48f358 || ""));
  }
  function _0x3c5ea4(_0xc6d429, _0x592fcb) {
    if (!_0x592fcb) {
      return;
    }
    const _0x44da82 = _0x577aff();
    if (_0x4ae3ed().get(_0xc6d429) === _0x592fcb && !_0x1c23ef().has(_0xc6d429)) {
      _0x29d855(_0x44da82, _0x592fcb);
      _0x2758e1(_0x592fcb);
      _0x2a2d51();
      return;
    }
    if (_0x207c8c().has(_0xc6d429)) {
      if (_0x516db6(_0xc6d429)) {
        if (_0x3d800c(_0xc6d429, _0x592fcb)) {
          return;
        }
        _0x13dd57(_0xc6d429, _0x592fcb, {
          active: true
        });
      }
      return;
    }
    if (_0x516db6(_0xc6d429)) {
      if (_0x381b80()) {
        _0x2f80d7().add(_0xc6d429);
        _0x3d800c(_0xc6d429, _0x592fcb);
        return;
      }
      _0x164b9e(_0xc6d429, _0x592fcb);
      return;
    }
    _0x581888(_0xc6d429);
    _0x29d855(_0x44da82, _0x592fcb);
    _0x2758e1(_0x592fcb);
    _0x2a2d51();
  }
  function _0x119099(_0x5178c3) {
    return _0x1d881e(_0x5178c3);
  }
  function _0x258d66(_0x1a51f6, _0x1c10ab = "visible-interaction-stack") {
    const _0x459546 = _0x1c23ef().get(_0x1a51f6);
    const _0x569bdf = _0x1beec().get(_0x1a51f6);
    const _0x49fcac = _0x4ae3ed().get(_0x1a51f6);
    const _0xeb5a58 = _0x577aff();
    if (!_0x459546 || !_0x569bdf || _0x569bdf.webContents?.isDestroyed?.() || !_0x1d881e(_0x1a51f6) || !_0xeb5a58 || _0xeb5a58.isDestroyed()) {
      return {
        restored: false,
        interactionVisible: false,
        interactionStaged: false
      };
    }
    const _0x349bfa = _0x2f9f4c().get(_0x1a51f6);
    const _0x40627a = _0x4af95c(_0x1a51f6, _0x459546);
    const _0x18358d = _0x40627a.bounds;
    if (!_0x133324(_0x18358d)) {
      return {
        restored: false,
        interactionVisible: false,
        interactionStaged: false
      };
    }
    _0x2758e1(_0x569bdf);
    _0x2b41c7(_0x569bdf.webContents);
    if (!_0xeb5a58.getBrowserViews().includes(_0x569bdf)) {
      _0xeb5a58.addBrowserView(_0x569bdf);
    }
    _0x569bdf.setBounds({
      ..._0x18358d
    });
    if (Number(_0x349bfa?.zoomFactor) > 0) {
      try {
        _0x569bdf.webContents.setZoomFactor(Number(_0x349bfa.zoomFactor));
      } catch (_0x316d2e) {}
    }
    let _0x2a4799 = false;
    let _0x2f2557 = false;
    if (_0x49fcac && !_0x49fcac.webContents?.isDestroyed?.()) {
      _0x2758e1(_0x49fcac);
      _0x2b41c7(_0x49fcac.webContents);
      if (_0x40627a.zoomFactor > 0) {
        try {
          _0x49fcac.webContents.setZoomFactor(_0x40627a.zoomFactor);
        } catch (_0x36710a) {}
      }
      _0x49fcac.setBounds({
        ..._0x18358d
      });
      if (!_0xeb5a58.getBrowserViews().includes(_0x49fcac)) {
        _0xeb5a58.addBrowserView(_0x49fcac);
      }
      const _0x16a361 = _0x40627a.zoomFactor;
      if (_0x16a361 > 0 && _0x16a361 < 0.98) {
        _0x7cfdcc(_0x49fcac.webContents);
      } else {
        _0x3ab56c(_0x49fcac.webContents, {
          force: true
        });
      }
      _0x3cfc9d(_0x49fcac.webContents, _0x49fcac);
      _0x2f2557 = true;
    }
    if (_0x459546.visibleSwapReady && _0x2f2557) {
      _0x4dbb08(_0x49fcac, {
        context: _0x1c10ab + ":interaction-top"
      });
      _0x2a4799 = true;
    } else {
      _0x4dbb08(_0x569bdf, {
        context: _0x1c10ab + ":main-cover"
      });
    }
    _0x2f80d7().delete(_0x1a51f6);
    return {
      restored: true,
      interactionVisible: _0x2a4799,
      interactionStaged: _0x2f2557
    };
  }
  function _0x4dbb08(_0x200a72, {
    attachIfMissing = false,
    context = ""
  } = {}) {
    const _0x29b2ba = _0x577aff();
    if (!_0x29b2ba || _0x29b2ba.isDestroyed() || !_0x200a72) {
      return false;
    }
    try {
      const _0x3b6e48 = _0x29b2ba.getBrowserViews().includes(_0x200a72);
      if (!_0x3b6e48 && attachIfMissing) {
        _0x29b2ba.addBrowserView(_0x200a72);
      } else if (!_0x3b6e48) {
        return false;
      }
      _0x29b2ba.setTopBrowserView(_0x200a72);
      return true;
    } catch (_0x3dc66f) {
      console.warn("[Main] setTopBrowserView 已忽略(" + (context || "unknown") + "): " + _0x3dc66f.message);
      return false;
    }
  }
  function _0x419085(_0x111302) {
    let _0x5b1e52 = 0;
    for (const _0x18cdeb of _0x1beec().keys()) {
      if (_0x18cdeb === _0x111302 || _0x18cdeb.startsWith(_0x111302 + "_")) {
        _0x5b1e52++;
      }
    }
    return _0x5b1e52;
  }
  function _0x778b4f(_0x3097ca) {
    const _0x5455d4 = _0x1beec().get(_0x3097ca);
    const _0x339256 = _0x577aff();
    if (!_0x5455d4 || !_0x339256 || _0x339256.isDestroyed()) {
      return;
    }
    if (_0x447cc2(_0x3097ca)) {
      if (_0x1d881e(_0x3097ca)) {
        _0x258d66(_0x3097ca, "attach-main-locked:" + _0x3097ca);
        return;
      }
      const _0x214520 = _0x1c23ef().has(_0x3097ca) ? _0x4ae3ed().get(_0x3097ca) : null;
      if (_0x214520 && !_0x214520.webContents?.isDestroyed?.()) {
        _0x13dd57(_0x3097ca, _0x214520, {
          active: true
        });
        _0x207c8c().add(_0x3097ca);
        _0x3f44d5(_0x3097ca, _0x5455d4);
      } else {
        _0x13dd57(_0x3097ca, _0x5455d4, {
          active: true
        });
        _0x207c8c().add(_0x3097ca);
      }
      return;
    }
    if (_0x1d881e(_0x3097ca)) {
      _0x2758e1(_0x5455d4);
      _0x2b41c7(_0x5455d4.webContents);
      const _0x4c20be = _0x2f9f4c().get(_0x3097ca);
      if (_0x133324(_0x4c20be?.bounds)) {
        _0x5455d4.setBounds({
          ..._0x4c20be.bounds
        });
      }
      if (Number(_0x4c20be?.zoomFactor) > 0) {
        try {
          _0x5455d4.webContents.setZoomFactor(Number(_0x4c20be.zoomFactor));
        } catch (_0x4d30ea) {}
      }
      if (!_0x339256.getBrowserViews().includes(_0x5455d4)) {
        _0x339256.addBrowserView(_0x5455d4);
      }
      _0x4dbb08(_0x5455d4, {
        context: "attachMainAutomationView:" + _0x3097ca
      });
    } else {
      _0x3c5ea4(_0x3097ca, _0x5455d4);
    }
  }
  function _0x133324(_0x2632ba) {
    return Boolean(_0x2632ba && _0x2632ba.width > 50 && _0x2632ba.height > 50 && _0x2632ba.x > -1000 && _0x2632ba.y > -1000);
  }
  function _0x4a9fef(_0x138dfa, _0x11ed6c, _0x299d61 = null, _0x327bae = null) {
    const _0x454a99 = _0x1d881e(_0x138dfa);
    const _0xc87c96 = _0x2f9f4c();
    const _0x1427fd = [_0x11ed6c?.getBounds?.(), _0x327bae?.previewBounds, _0x327bae?.bounds, _0x299d61?.getBounds?.(), _0xc87c96.get(_0x138dfa)?.bounds, _0xc87c96.get(_0x138dfa + ":interaction")?.bounds];
    if (_0x454a99) {
      for (const _0x56e174 of _0x1427fd) {
        if (_0x133324(_0x56e174)) {
          return {
            ..._0x56e174
          };
        }
      }
    } else {
      for (const _0x1fe51d of _0x1427fd) {
        if (_0x133324(_0x1fe51d) && Number(_0x1fe51d.x) < -100 && Number(_0x1fe51d.y) < -100) {
          return {
            x: 0,
            y: 0,
            width: Math.max(Number(_0x1fe51d.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(_0x1fe51d.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
        }
        if (_0x1fe51d && Number(_0x1fe51d.width) > 50 && Number(_0x1fe51d.height) > 50) {
          return {
            x: 0,
            y: 0,
            width: Math.max(Number(_0x1fe51d.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(_0x1fe51d.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
        }
      }
      return _0x435e64(_0x138dfa);
    }
    for (const _0x414615 of _0x1427fd) {
      if (_0x414615 && Number(_0x414615.width) > 50 && Number(_0x414615.height) > 50) {
        const _0x52a21c = {
          x: 0,
          y: 0,
          width: Math.max(Number(_0x414615.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
          height: Math.max(Number(_0x414615.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
        };
        console.warn("[Main] [" + _0x138dfa + "] 实况坐标不完整，复用尺寸兜底 " + _0x52a21c.width + "x" + _0x52a21c.height);
        return _0x52a21c;
      }
    }
    const _0x6464e5 = _0x435e64(_0x138dfa);
    console.warn("[Main] [" + _0x138dfa + "] 无坐标缓存（多见于批量开始前未打开画面），使用默认后台视口 " + _0x6464e5.width + "x" + _0x6464e5.height);
    return _0x6464e5;
  }
  function _0x7326b4(_0x5d1533) {
    const _0x2e426a = _0x1beec().get(_0x5d1533);
    if (!_0x2e426a) {
      return null;
    }
    const _0x56e0ce = _0x4ae3ed().get(_0x5d1533);
    const _0x2e4519 = _0x577aff();
    if (_0x2e4519 && !_0x2e4519.isDestroyed()) {
      const _0x2e6d40 = _0x56e0ce && _0x2e4519.getBrowserViews().includes(_0x56e0ce);
      const _0x39a9b1 = _0x2e4519.getBrowserViews().includes(_0x2e426a);
      if (_0x2e6d40 || !_0x39a9b1) {
        console.log("[Batch] 恢复主自动化视图置顶: " + _0x5d1533 + " (interactionOnTop=" + _0x2e6d40 + ")");
        _0x48c31a(_0x5d1533);
      } else if (_0x1d881e(_0x5d1533)) {
        _0x4dbb08(_0x2e426a, {
          context: "ensureMainViewVisibleForBatch:" + _0x5d1533
        });
      }
    }
    return _0x2e426a;
  }
  function _0x21d66b(_0x3f3d3a) {
    if (process.platform !== "darwin") {
      return true;
    }
    const _0x397147 = _0x3f3d3a?.getBounds?.();
    if (!_0x397147) {
      return true;
    }
    return !(_0x397147.x > -1000) || !(_0x397147.y > -1000);
  }
  function _0x3cfc9d(_0x2ce81a, _0x751c59 = null) {
    if (!_0x2ce81a || _0x2ce81a.isDestroyed()) {
      return;
    }
    try {
      _0x2ce81a.invalidate();
      const _0x5112c5 = _0x2ce81a.getZoomFactor?.() || 1;
      if (_0x5112c5 > 0) {
        _0x2ce81a.setZoomFactor(_0x5112c5 + 0.0001);
        setImmediate(() => {
          if (!_0x2ce81a.isDestroyed()) {
            _0x2ce81a.setZoomFactor(_0x5112c5);
            _0x2ce81a.invalidate();
          }
        });
      }
      if (_0x21d66b(_0x751c59)) {
        if (_0x751c59 && typeof _0x751c59.getBounds === "function" && typeof _0x751c59.setBounds === "function") {
          const _0x455266 = _0x751c59.getBounds();
          if (_0x455266 && _0x455266.width > 52 && _0x455266.height > 52 && _0x455266.x > -1000 && _0x455266.y > -1000) {
            _0x751c59.setBounds({
              ..._0x455266,
              width: _0x455266.width - 1
            });
            setImmediate(() => {
              if (!_0x751c59.webContents?.isDestroyed?.()) {
                _0x751c59.setBounds(_0x455266);
                _0x2ce81a.invalidate();
              }
            });
          }
        }
      } else {
        _0x3ab56c(_0x2ce81a, {
          force: true
        });
      }
    } catch (_0x1aac4f) {}
  }
  function _0xbb49c8(_0x441044) {
    if (!_0x441044 || _0x441044.isDestroyed?.()) {
      return false;
    }
    try {
      _0x441044.invalidate();
      return true;
    } catch (_0x1723ec) {
      return false;
    }
  }
  function _0x3ab56c(_0x43402a, {
    force = false
  } = {}) {
    if (!_0x43402a || _0x43402a.isDestroyed?.()) {
      return;
    }
    let _0x5b7d13 = _0x340b3b.get(_0x43402a);
    if (!_0x5b7d13) {
      _0x5b7d13 = {
        lastAt: 0,
        timer: null
      };
      _0x340b3b.set(_0x43402a, _0x5b7d13);
    }
    const _0x370722 = () => {
      _0x5b7d13.timer = null;
      _0x5b7d13.lastAt = Date.now();
      if (_0x43402a.isDestroyed?.()) {
        return;
      }
      _0x43402a.executeJavaScript("\n                (() => {\n                    window.__radarAutomationViewportChangedAt = Date.now();\n                    requestAnimationFrame(() => {\n                        window.dispatchEvent(new Event('resize'));\n                        try { window.visualViewport?.dispatchEvent(new Event('resize')); } catch (_) {}\n                    });\n                    return true;\n                })()\n            ", true).catch(() => {});
    };
    const _0x5e006e = Date.now() - _0x5b7d13.lastAt;
    if (force || _0x5e006e >= AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS) {
      if (_0x5b7d13.timer) {
        clearTimeout(_0x5b7d13.timer);
      }
      _0x370722();
      return;
    }
    if (_0x5b7d13.timer) {
      return;
    }
    _0x5b7d13.timer = setTimeout(_0x370722, AUTOMATION_VIEWPORT_REFRESH_MIN_INTERVAL_MS - _0x5e006e);
    if (typeof _0x5b7d13.timer.unref === "function") {
      _0x5b7d13.timer.unref();
    }
  }
  function _0x178fdf(_0x963a2b = "") {
    const _0x863abb = _0x577aff();
    if (!_0x863abb || _0x863abb.isDestroyed()) {
      return;
    }
    const _0x1f1b93 = Date.now();
    if (_0x1f1b93 - _0x4bdadd < MAIN_WINDOW_COMPOSITOR_NUDGE_COOLDOWN_MS) {
      return;
    }
    _0x4bdadd = _0x1f1b93;
    try {
      _0x863abb.webContents?.invalidate?.();
    } catch (_0x3d8537) {}
    if (process.platform === "darwin") {
      return;
    }
    try {
      if (_0x863abb.isMinimized?.() || _0x863abb.isMaximized?.() || _0x863abb.isFullScreen?.()) {
        return;
      }
      const _0x4d6c79 = _0x863abb.getBounds();
      if (!_0x4d6c79 || _0x4d6c79.width < 400 || _0x4d6c79.height < 300) {
        return;
      }
      _0x863abb.setBounds({
        ..._0x4d6c79,
        width: _0x4d6c79.width - 1
      }, false);
      setImmediate(() => {
        try {
          const _0xea4e7b = _0x577aff();
          if (!_0xea4e7b || _0xea4e7b.isDestroyed()) {
            return;
          }
          _0xea4e7b.setBounds(_0x4d6c79, false);
          _0xea4e7b.webContents?.invalidate?.();
        } catch (_0x37b4bb) {}
      });
    } catch (_0x8944b8) {
      console.warn("[Main] 主窗口合成层唤醒已忽略(" + (_0x963a2b || "unknown") + "): " + _0x8944b8.message);
    }
  }
  function _0x33f3af(_0x575ff8 = "", {
    skipCompositor = false,
    heavy = false
  } = {}) {
    const _0x2fcf3d = _0x577aff();
    if (!_0x2fcf3d || _0x2fcf3d.isDestroyed()) {
      return false;
    }
    const _0xf9b1 = _0x1beec();
    const _0x3d18c4 = _0x1c23ef();
    const _0x1353cf = _0x4ae3ed();
    let _0x4d0d8 = false;
    for (const [_0x21b5d6, _0x475a69] of _0xf9b1.entries()) {
      if (!_0x1d881e(_0x21b5d6)) {
        continue;
      }
      if (_0x447cc2(_0x21b5d6)) {
        if (!_0x475a69?.webContents || _0x475a69.webContents.isDestroyed()) {
          continue;
        }
        if (!_0x2fcf3d.getBrowserViews().includes(_0x475a69) || _0x14baa6().includes(_0x475a69) || !_0x133324(_0x475a69.getBounds?.())) {
          _0x4d0d8 = true;
          break;
        }
        continue;
      }
      const _0x266b28 = _0x3d18c4.has(_0x21b5d6) ? _0x1353cf.get(_0x21b5d6) || _0x475a69 : _0x475a69;
      if (!_0x266b28?.webContents || _0x266b28.webContents.isDestroyed()) {
        continue;
      }
      if (!_0x2fcf3d.getBrowserViews().includes(_0x266b28) || _0x14baa6().includes(_0x266b28)) {
        _0x4d0d8 = true;
        break;
      }
    }
    if (_0x4d0d8) {
      _0x672d4f("paint-audit:" + (_0x575ff8 || "unknown"));
    }
    let _0x39775c = false;
    for (const [_0x24977f, _0x4ad85f] of _0xf9b1.entries()) {
      if (!_0x1d881e(_0x24977f)) {
        continue;
      }
      const _0x20f61f = _0x447cc2(_0x24977f) ? [_0x4ad85f] : _0x3d18c4.has(_0x24977f) ? [_0x1353cf.get(_0x24977f) || _0x4ad85f] : [_0x4ad85f];
      for (const _0x44d0c2 of _0x20f61f) {
        if (!_0x44d0c2?.webContents || _0x44d0c2.webContents.isDestroyed()) {
          continue;
        }
        if (!_0x2fcf3d.getBrowserViews().includes(_0x44d0c2)) {
          continue;
        }
        if (!_0x133324(_0x44d0c2.getBounds?.())) {
          continue;
        }
        if (heavy) {
          _0x3cfc9d(_0x44d0c2.webContents, _0x44d0c2);
          _0x39775c = true;
        } else if (_0xbb49c8(_0x44d0c2.webContents)) {
          _0x39775c = true;
        }
      }
    }
    if (_0x39775c && !skipCompositor) {
      _0x178fdf(_0x575ff8);
    }
    return _0x39775c;
  }
  function _0x28debd(_0x274b5f = "", {
    skipCompositor = false
  } = {}) {
    const _0x1fae6d = _0x11a774();
    _0x1fae6d.forEach(_0x4c4ee0 => clearTimeout(_0x4c4ee0));
    _0x1fae6d.clear();
    VISIBLE_AUTOMATION_REPAINT_DELAYS_MS.forEach((_0x7bbffc, _0x5d4d70) => {
      const _0x55edfa = setTimeout(() => {
        _0x1fae6d.delete(_0x55edfa);
        _0x33f3af(_0x274b5f, {
          heavy: _0x5d4d70 === 0,
          skipCompositor: skipCompositor || _0x5d4d70 > 0
        });
      }, _0x7bbffc);
      if (typeof _0x55edfa.unref === "function") {
        _0x55edfa.unref();
      }
      _0x1fae6d.add(_0x55edfa);
    });
  }
  function _0x40e977(_0x1ff8b5 = "") {
    const _0x46d240 = _0x577aff();
    if (!_0x46d240 || _0x46d240.isDestroyed()) {
      return;
    }
    const _0x28219b = _0x1beec();
    const _0x65f625 = _0x1c23ef();
    const _0x32c246 = _0x4ae3ed();
    const _0x5399e4 = _0x2f9f4c();
    const _0x434a11 = ({
      focus = false
    } = {}) => {
      let _0xbcb70e = null;
      for (const [_0x2722fe, _0x30497e] of _0x28219b.entries()) {
        if (!_0x1d881e(_0x2722fe)) {
          continue;
        }
        if (_0x447cc2(_0x2722fe)) {
          const _0x427b97 = _0x30497e;
          if (!_0x427b97?.webContents || _0x427b97.webContents.isDestroyed()) {
            continue;
          }
          if (!_0x46d240.getBrowserViews().includes(_0x427b97) || _0x14baa6().includes(_0x427b97) || !_0x133324(_0x427b97.getBounds?.())) {
            _0x2288d4(_0x2722fe, "wake-locked-missing");
          }
          if (!_0x46d240.getBrowserViews().includes(_0x427b97)) {
            continue;
          }
          const _0x189337 = _0x5399e4.get(_0x2722fe);
          if (_0x133324(_0x189337?.bounds)) {
            try {
              _0x427b97.setBounds({
                ..._0x189337.bounds
              });
            } catch (_0x306d98) {}
          }
          if (Number(_0x189337?.zoomFactor) > 0) {
            try {
              _0x427b97.webContents.setZoomFactor(Number(_0x189337.zoomFactor));
            } catch (_0x98ed9) {}
          }
          try {
            _0x427b97.webContents.invalidate();
          } catch (_0x2cbb0f) {}
          _0x3cfc9d(_0x427b97.webContents, _0x427b97);
          continue;
        }
        const _0x4bdd52 = _0x65f625.has(_0x2722fe) ? _0x32c246.get(_0x2722fe) || _0x30497e : _0x30497e;
        if (!_0x4bdd52?.webContents || _0x4bdd52.webContents.isDestroyed()) {
          continue;
        }
        if (!_0x46d240.getBrowserViews().includes(_0x4bdd52)) {
          continue;
        }
        const _0x373dc3 = _0x5399e4.get(_0x2722fe);
        if (_0x133324(_0x373dc3?.bounds)) {
          try {
            _0x4bdd52.setBounds({
              ..._0x373dc3.bounds
            });
          } catch (_0x7f37dd) {}
        }
        if (Number(_0x373dc3?.zoomFactor) > 0) {
          try {
            _0x4bdd52.webContents.setZoomFactor(Number(_0x373dc3.zoomFactor));
          } catch (_0x27f7c5) {}
        }
        try {
          _0x4bdd52.webContents.invalidate();
        } catch (_0x2c7695) {}
        const _0x26cac6 = focus && _0x2722fe === _0x1ff8b5;
        const _0x3b15cd = Number(_0x373dc3?.zoomFactor || 0);
        if (_0x3b15cd > 0 && _0x3b15cd < 0.98) {
          _0x7cfdcc(_0x4bdd52.webContents);
        } else {
          _0x4bdd52.webContents.executeJavaScript("\n                    (() => {\n                        requestAnimationFrame(() => {\n                            window.dispatchEvent(new Event('resize'));\n                            " + (_0x26cac6 ? "window.dispatchEvent(new Event('focus'));" : "") + "\n                        });\n                        return true;\n                    })()\n                ", true).catch(() => {});
        }
        if (_0x26cac6) {
          _0xbcb70e = _0x4bdd52;
        }
      }
      if (focus && _0xbcb70e && _0x46d240.isFocused?.()) {
        _0x4dbb08(_0xbcb70e, {
          context: "wake-foreground:" + _0x1ff8b5
        });
        try {
          _0xbcb70e.webContents.focus();
        } catch (_0x1a3e7d) {}
      }
      try {
        _0x46d240.webContents.invalidate();
      } catch (_0x5337ea) {}
    };
    try {
      if (_0x46d240.isFocused?.()) {
        _0x46d240.webContents.invalidate();
      } else {
        _0x46d240.focus();
      }
    } catch (_0xb3bded) {}
    _0x434a11({
      focus: true
    });
    const _0x56c384 = [80, 300, 700];
    _0x56c384.forEach((_0x24367a, _0x18ab86) => {
      const _0x4da3a4 = setTimeout(() => _0x434a11({
        focus: _0x18ab86 === 0
      }), _0x24367a);
      if (typeof _0x4da3a4.unref === "function") {
        _0x4da3a4.unref();
      }
    });
  }
  function _0x723ea8(_0x3f6e7f, _0x165800) {
    return Boolean(_0x3f6e7f && _0x165800 && Math.abs(_0x3f6e7f.x - _0x165800.x) <= 1 && Math.abs(_0x3f6e7f.y - _0x165800.y) <= 1 && Math.abs(_0x3f6e7f.width - _0x165800.width) <= 1 && Math.abs(_0x3f6e7f.height - _0x165800.height) <= 1);
  }
  function _0x39757e(_0x2723cc, _0x59fec7, _0x221ed1) {
    const _0x56dd3f = Date.now();
    const _0x2b4249 = _0x2f9f4c();
    const _0xd4cfcb = _0x2b4249.get(_0x2723cc);
    if (_0xd4cfcb && _0x723ea8(_0xd4cfcb.bounds, _0x59fec7) && Math.abs((_0xd4cfcb.zoomFactor || 0) - (_0x221ed1 || 0)) < 0.001) {
      return false;
    }
    if (_0xd4cfcb && _0x56dd3f - _0xd4cfcb.at < BOUNDS_SYNC_MIN_INTERVAL_MS && Math.abs((_0xd4cfcb.zoomFactor || 0) - (_0x221ed1 || 0)) < 0.001 && _0x723ea8(_0xd4cfcb.pendingBounds || _0xd4cfcb.bounds, _0x59fec7)) {
      return false;
    }
    _0x2b4249.set(_0x2723cc, {
      bounds: {
        ..._0x59fec7
      },
      pendingBounds: {
        ..._0x59fec7
      },
      zoomFactor: _0x221ed1,
      at: _0x56dd3f
    });
    return true;
  }
  function _0x328c05() {
    ipcMain.on("update-automation-bounds", (_0x24cde6, _0x295ed9) => {
      const _0x14ea2d = _0xc6e123();
      if (typeof _0x14ea2d !== "undefined" && _0x14ea2d) {
        return;
      }
      const {
        bounds: _0x4ee365,
        zoomFactor: _0x1f0973,
        viewKey = "douyin_default",
        light = false,
        force = false
      } = _0x295ed9;
      const _0x1af960 = Number(_0x1f0973) > 0 ? _0x3c586b(_0x1f0973) : _0x1f0973;
      const _0x324034 = _0x1beec();
      const _0x2897c9 = _0x324034.get(viewKey);
      if (_0x2897c9) {
        const _0x191bf0 = _0x1c23ef();
        const _0x4c9db3 = _0x4ae3ed();
        const _0x475134 = _0x207c8c();
        const _0x55c75e = _0x577aff();
        const _0x1e34ee = _0x191bf0.get(viewKey);
        const _0x40c2eb = _0x4c9db3.get(viewKey);
        const _0x59a9e5 = !_0x133324(_0x2897c9.getBounds());
        const _0xb7431d = _0x40c2eb?.webContents?.getURL?.() || "";
        const _0x4e6145 = _0x1e34ee ? Date.now() - (_0x1e34ee.startedAt || 0) : 0;
        const _0xa20cf8 = _0x1e34ee && _0x59a9e5 && _0x4e6145 > 200000 && (!_0xb7431d || _0xb7431d === "about:blank");
        if (_0x1e34ee && !_0xa20cf8) {
          if (_0x133324(_0x4ee365)) {
            _0x2f07f4(viewKey, _0x4ee365, _0x1af960);
            _0x2f07f4(viewKey + ":interaction", _0x4ee365, _0x1af960);
            if (_0x1d881e(viewKey)) {
              const _0x691e32 = _0x258d66(viewKey, "update-bounds-locked-preview");
              if (!_0x691e32.restored) {
                _0x2288d4(viewKey, "update-bounds-locked-preview");
              } else {
                const _0x393169 = _0x324034.get(viewKey);
                if (_0x393169?.webContents && !_0x393169.webContents.isDestroyed()) {
                  _0x3cfc9d(_0x393169.webContents, _0x393169);
                }
              }
            } else if (_0x40c2eb && !_0x119099(viewKey)) {
              _0x13dd57(viewKey, _0x40c2eb, {
                active: true,
                force: true
              });
              _0x475134.add(viewKey);
            }
          }
          return;
        }
        if ((_0x59a9e5 || _0xa20cf8) && !_0xd854f2(viewKey)) {
          console.warn("[Main] 检测到主视图不可见" + (_0xa20cf8 ? "（僵死子视图锁）" : "") + "，强制恢复");
          _0x48c31a(viewKey, _0x4ee365);
        }
        if (_0x133324(_0x4ee365)) {
          if (_0x191bf0.has(viewKey)) {
            _0x2f07f4(viewKey, _0x4ee365, _0x1af960);
            return;
          }
          if (_0x1d881e(viewKey) && _0x475134.has(viewKey) && (!_0x55c75e?.getBrowserViews?.().includes(_0x2897c9) || _0x14baa6().includes(_0x2897c9) || !_0x133324(_0x2897c9.getBounds?.()))) {
            _0x2f07f4(viewKey, _0x4ee365, _0x1af960);
            if (_0x2288d4(viewKey, "update-bounds-layout-hold")) {
              return;
            }
          }
          if (!_0x1d881e(viewKey) && _0x516db6(viewKey)) {
            _0x39757e(viewKey, _0x4ee365, _0x1af960);
            _0x13dd57(viewKey, _0x2897c9, {
              active: _0x475134.has(viewKey)
            });
            return;
          }
          const _0x4e3117 = !_0x133324(_0x2897c9.getBounds());
          const _0x41f0eb = _0x55c75e && !_0x55c75e.isDestroyed() ? _0x55c75e.getBrowserViews().includes(_0x2897c9) : false;
          const _0x337696 = _0xd854f2(viewKey) || _0x14baa6().includes(_0x2897c9);
          const _0x43e848 = _0x39757e(viewKey, _0x4ee365, _0x1af960);
          if (!_0x59a9e5 && !_0xa20cf8 && !_0x43e848 && _0x41f0eb && !_0x337696) {
            return;
          }
          const _0x1ba30b = _0x1d881e(viewKey) && _0x55c75e && !_0x55c75e.isDestroyed();
          if (_0x1ba30b) {
            if (_0x337696) {
              _0x2758e1(_0x2897c9);
            }
            _0x2b41c7(_0x2897c9.webContents);
          }
          _0x2897c9.setBounds(_0x4ee365);
          if (_0x1af960) {
            _0x2897c9.webContents.setZoomFactor(_0x1af960);
          }
          if (_0x1ba30b) {
            if (!_0x41f0eb) {
              _0x55c75e.addBrowserView(_0x2897c9);
            }
            if (!_0x191bf0.has(viewKey)) {
              _0x4dbb08(_0x2897c9, {
                context: "update-automation-bounds:" + viewKey
              });
            }
            _0x581888(viewKey);
            _0x2a2d51();
            if (Number(_0x1af960) > 0 && Number(_0x1af960) < 0.98) {
              _0x7cfdcc(_0x2897c9.webContents);
            } else {
              _0x3ab56c(_0x2897c9.webContents, {
                force: force || !_0x41f0eb || _0x4e3117 || _0x337696
              });
            }
          }
          if (!light || force || !_0x41f0eb || _0x4e3117 || _0x337696) {
            _0x3cfc9d(_0x2897c9.webContents, _0x2897c9);
            _0x28debd("update-automation-bounds:" + viewKey, {
              skipCompositor: light && !force && !_0x4e3117
            });
          } else {
            try {
              _0x2897c9.webContents.invalidate?.();
            } catch (_0x200a1c) {}
          }
        } else {
          console.warn("[Main] 无效的边界值: " + viewKey + ", bounds:", _0x4ee365);
        }
      } else {
        console.warn("[Main] 找不到对应的视图: " + viewKey + ", 当前池大小: " + _0x324034.size);
      }
    });
    ipcMain.on("toggle-automation-detach", (_0x574264, _0x3d68c6) => {
      const _0x33009d = _0x1beec();
      const _0x2bb4dd = _0x29c090();
      const _0x1bf6d3 = _0x33009d.get(_0x2bb4dd);
      if (!_0x1bf6d3) {
        return;
      }
      try {
        if (_0x3d68c6) {
          const _0x4c160a = _0xc6e123();
          if (_0x4c160a && !_0x4c160a.isDestroyed()) {
            _0x4c160a.focus();
            return;
          }
          const _0x1a6abc = _0x577aff();
          _0x33009d.forEach((_0x12112a, _0x4ad1ac) => {
            _0x29d855(_0x1a6abc, _0x12112a);
            if (_0x12112a === _0x1bf6d3) {
              _0x2758e1(_0x12112a);
            } else {
              _0x3c5ea4(_0x4ad1ac, _0x12112a);
            }
          });
          const _0x164c99 = new BrowserWindow({
            width: 1000,
            height: 800,
            title: "采集引擎 - " + _0x2bb4dd,
            autoHideMenuBar: true,
            backgroundColor: "#000000",
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true
            }
          });
          _0x553bd1(_0x164c99);
          _0x2fbb55(_0x164c99);
          _0x164c99.setBrowserView(_0x1bf6d3);
          _0x1bf6d3.setBounds({
            x: 0,
            y: 0,
            width: 1000,
            height: 800
          });
          _0x164c99.on("resize", () => {
            const _0x1a2a74 = _0xc6e123();
            if (_0x1a2a74 && !_0x1a2a74.isDestroyed()) {
              const _0xcca035 = _0x1a2a74.getContentBounds();
              _0x1bf6d3.setBounds({
                x: 0,
                y: 0,
                width: _0xcca035.width,
                height: _0xcca035.height
              });
            }
          });
          _0x164c99.on("close", () => {
            const _0x592047 = _0xc6e123();
            if (_0x592047 && !_0x592047.isDestroyed()) {
              _0x592047.setBrowserView(null);
            }
          });
          _0x164c99.on("closed", () => {
            _0x553bd1(null);
            setTimeout(() => {
              const _0x177cd9 = _0x577aff();
              if (_0x177cd9 && !_0x177cd9.isDestroyed()) {
                _0x33009d.forEach(_0xb8d0e8 => _0x177cd9.addBrowserView(_0xb8d0e8));
                _0x177cd9.webContents.send("automation-attached");
              }
            }, 300);
          });
          _0x574264.reply("automation-detached");
        } else {
          const _0x376d60 = _0xc6e123();
          const _0x375c8a = _0x577aff();
          if (_0x376d60 && !_0x376d60.isDestroyed()) {
            _0x376d60.close();
          } else if (_0x375c8a) {
            _0x33009d.forEach(_0x3fd336 => _0x375c8a.addBrowserView(_0x3fd336));
            _0x375c8a.webContents.send("automation-attached");
          }
        }
      } catch (_0x392921) {
        console.error("[Main] 切换自动化窗口模式失败:", _0x392921);
      }
    });
  }
  return {
    inferInteractionViewKey: _0x3659a6,
    inferAutomationViewKey: _0x1ea899,
    applyMainWindowRuntimePerformancePolicy: _0x41d29e,
    wakeMainWindowUiSurface: _0x47f22d,
    restoreMainWindowUiFocus: _0x183795,
    focusAutomationWebContentsSafely: _0x42c39b,
    restoreRequestedAutomationViewsToMainWindow: _0x672d4f,
    closeAutomationLivePreviewForBackground: _0x2b0142,
    setMainWindowBackgroundState: _0x39a114,
    shouldAttachAutomationView: _0x1d881e,
    buildOffscreenAutomationBounds: _0x45f3d6,
    clearBackgroundInteractionSlot: _0xe82ffb,
    grantNextBackgroundInteractionSlot: _0x309d79,
    acquireBackgroundInteractionSlot: _0x53e695,
    releaseBackgroundInteractionSlot: _0xe06977,
    cancelBackgroundInteractionForView: _0x28ad37,
    getBackgroundAutomationHostViews: _0x14baa6,
    getBackgroundAutomationHostOffscreenBounds: _0x1e5f3a,
    getBackgroundAutomationComposerSurfaceBounds: _0x3c839d,
    activateBackgroundAutomationComposerSurface: _0x24cc79,
    emulateBackgroundAutomationPageFocus: _0x1cb43a,
    releaseBackgroundAutomationComposerSurface: _0x2a259c,
    parkBackgroundAutomationHostWindow: _0x30ec8d,
    scheduleBackgroundAutomationHostRepark: _0x240208,
    clearBackgroundHostInternalActivation: _0x4e5878,
    armBackgroundHostInternalActivation: _0x202bf0,
    showBackgroundAutomationHostInactive: _0x2f1cde,
    consumeBackgroundHostInternalActivation: _0x26478d,
    suppressMainWindowEventFromBackgroundHost: _0x587405,
    ensureBackgroundAutomationHostWindow: _0x315f90,
    removeAutomationViewFromWindow: _0x29d855,
    removeAutomationViewFromBackgroundHost: _0x2758e1,
    maybeDestroyBackgroundAutomationHostWindow: _0x2a2d51,
    shouldKeepAutomationViewAttached: _0x516db6,
    schedulePreviewViewportResizeAfterZoom: _0x7cfdcc,
    isBackgroundAutomationHidden: _0xd854f2,
    clearBackgroundAutomationState: _0x581888,
    isAutomationExecutionViewportLocked: _0x447cc2,
    cacheAutomationPreviewBounds: _0x2f07f4,
    restoreAutomationPreviewAfterExecution: _0x3f44d5,
    applyBackgroundAutomationOptimizations: _0x5073d1,
    applyBackgroundAutomationZoom: _0x2b5976,
    restoreForegroundAutomationRendering: _0x2b41c7,
    buildCompactBackgroundAutomationBounds: _0x435e64,
    canParkAutomationViewInMainWindow: _0x381b80,
    parkAutomationViewInMainWindow: _0x3d800c,
    attachAutomationViewToBackgroundHost: _0x13dd57,
    attachLivePreviewSpectatorIfPossible: _0x2288d4,
    enterBackgroundDetachedMode: _0x164b9e,
    ensureBackgroundAutomationLayout: _0x3407da,
    releaseBackgroundAutomationLayout: _0x71829,
    acquireEntityExecutionViewportLease: _0x946527,
    releaseEntityExecutionViewportLease: _0x2d0735,
    hasEntityExecutionViewportLease: _0xe0055d,
    detachAutomationViewFromWindow: _0x3c5ea4,
    shouldShowInteractionView: _0x119099,
    restoreVisibleInteractionStack: _0x258d66,
    safeSetTopBrowserView: _0x4dbb08,
    countPlatformAutomationViews: _0x419085,
    attachMainAutomationView: _0x778b4f,
    isValidAutomationBounds: _0x133324,
    resolveInteractionViewportBounds: _0x4a9fef,
    ensureMainViewVisibleForBatch: _0x7326b4,
    shouldNudgeAutomationViewGeometry: _0x21d66b,
    nudgeAutomationViewRepaint: _0x3cfc9d,
    invalidateAutomationViewRepaint: _0xbb49c8,
    notifyAutomationViewportChanged: _0x3ab56c,
    nudgeMainWindowCompositor: _0x178fdf,
    nudgeVisibleAutomationViews: _0x33f3af,
    scheduleVisibleAutomationViewsRepaint: _0x28debd,
    wakeForegroundAutomationSurfaces: _0x40e977,
    areBoundsClose: _0x723ea8,
    shouldApplyBoundsUpdate: _0x39757e,
    registerIpc: _0x328c05
  };
}
module.exports = {
  createBackgroundAutomationLayout: createBackgroundAutomationLayout
};
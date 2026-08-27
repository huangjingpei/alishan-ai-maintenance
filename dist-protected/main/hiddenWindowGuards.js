const OFFSCREEN_X = -20000;
const OFFSCREEN_Y = -20000;
function readSafeSize(_0x362caa, _0x1b2672 = 1280, _0x33f032 = 800) {
  try {
    const _0x496690 = _0x362caa.getBounds();
    return {
      width: Math.max(1000, _0x496690.width || _0x1b2672),
      height: Math.max(720, _0x496690.height || _0x33f032)
    };
  } catch (_0x221423) {
    return {
      width: _0x1b2672,
      height: _0x33f032
    };
  }
}
function isOnscreenBounds(_0x595152 = {}) {
  const _0x890cd = Number(_0x595152.x);
  const _0x26cbf6 = Number(_0x595152.y);
  if (!Number.isFinite(_0x890cd) || !Number.isFinite(_0x26cbf6)) {
    return true;
  }
  return _0x890cd > -800 || _0x26cbf6 > -800;
}
function detachAutomationParent(_0xf8a95a) {
  if (!_0xf8a95a || _0xf8a95a.isDestroyed()) {
    return;
  }
  try {
    if (typeof _0xf8a95a.getParentWindow === "function" && _0xf8a95a.getParentWindow()) {
      _0xf8a95a.setParentWindow(null);
    }
  } catch (_0x1e2fc9) {}
}
function pinWindowOffscreen(_0x166f89, {
  width: _0x1b5fc6,
  height: _0x6b92da
} = {}) {
  if (!_0x166f89 || _0x166f89.isDestroyed()) {
    return;
  }
  try {
    const _0x498b72 = _0x1b5fc6 && _0x6b92da ? {
      width: _0x1b5fc6,
      height: _0x6b92da
    } : readSafeSize(_0x166f89);
    try {
      _0x166f89.setOpacity(0);
    } catch (_0x4c59a9) {}
    try {
      _0x166f89.setSkipTaskbar(true);
    } catch (_0x1f3c8b) {}
    _0x166f89.setBounds({
      x: OFFSCREEN_X,
      y: OFFSCREEN_Y,
      width: _0x498b72.width,
      height: _0x498b72.height
    });
  } catch (_0x1efaa9) {}
}
function reassertOffscreenKeepAliveSurface(_0x613941) {
  if (!_0x613941 || _0x613941.isDestroyed()) {
    return;
  }
  if (_0x613941.__radarAllowVisibleMonitor) {
    return;
  }
  if (_0x613941.__radarKeepAliveAsserting) {
    return;
  }
  _0x613941.__radarKeepAliveAsserting = true;
  try {
    detachAutomationParent(_0x613941);
    try {
      _0x613941.setFocusable(false);
    } catch (_0x384f19) {}
    try {
      _0x613941.setSkipTaskbar(true);
    } catch (_0x3f5061) {}
    pinWindowOffscreen(_0x613941);
    try {
      _0x613941.blur();
    } catch (_0x18f801) {}
  } catch (_0x3de88f) {} finally {
    _0x613941.__radarKeepAliveAsserting = false;
  }
}
function keepOffscreenWindowAlive(_0x32d55f) {
  if (!_0x32d55f || _0x32d55f.isDestroyed()) {
    return;
  }
  if (_0x32d55f.__radarAllowVisibleMonitor) {
    return;
  }
  if (_0x32d55f.__radarKeepAliveAsserting) {
    return;
  }
  _0x32d55f.__radarKeepAliveAsserting = true;
  try {
    const {
      width: _0x33c527,
      height: _0x57a23d
    } = readSafeSize(_0x32d55f);
    detachAutomationParent(_0x32d55f);
    try {
      _0x32d55f.setFocusable(false);
      _0x32d55f.setSkipTaskbar(true);
      try {
        _0x32d55f.webContents?.setBackgroundThrottling?.(false);
      } catch (_0x1277eb) {}
      pinWindowOffscreen(_0x32d55f, {
        width: _0x33c527,
        height: _0x57a23d
      });
      if (!_0x32d55f.isVisible()) {
        if (typeof _0x32d55f.showInactive === "function") {
          _0x32d55f.showInactive();
        } else {
          _0x32d55f.show();
        }
      }
      pinWindowOffscreen(_0x32d55f, {
        width: _0x33c527,
        height: _0x57a23d
      });
      try {
        _0x32d55f.blur();
      } catch (_0x244145) {}
    } catch (_0x4a2a39) {}
  } finally {
    _0x32d55f.__radarKeepAliveAsserting = false;
  }
}
function enableOffscreenKeepAliveWindow(_0x5db52a) {
  if (!_0x5db52a || _0x5db52a.isDestroyed()) {
    return;
  }
  _0x5db52a.__radarPreferOffscreenKeepAlive = true;
  _0x5db52a.__radarUseOffscreenKeepAlive = true;
  _0x5db52a.__radarInteractionPrimed = true;
  keepOffscreenWindowAlive(_0x5db52a);
}
function applyHiddenAutomationWindowPolicy(_0x33ad32, {
  parent = null
} = {}) {
  if (!_0x33ad32 || _0x33ad32.isDestroyed()) {
    return;
  }
  if (parent && !parent.isDestroyed() && !_0x33ad32.__radarPreferOffscreenKeepAlive) {
    try {
      _0x33ad32.setParentWindow(parent);
    } catch (_0x47707d) {}
  }
  try {
    _0x33ad32.setFocusable(false);
    _0x33ad32.setSkipTaskbar(true);
    _0x33ad32.setMenuBarVisibility(false);
  } catch (_0x18bdf9) {}
  if (process.platform === "darwin") {
    try {
      _0x33ad32.setWindowButtonVisibility(false);
      _0x33ad32.setVisibleOnAllWorkspaces(false);
    } catch (_0x262619) {}
  }
  const _0x34af4e = () => {
    if (!_0x33ad32 || _0x33ad32.isDestroyed()) {
      return;
    }
    if (_0x33ad32.__radarAllowVisibleMonitor) {
      return;
    }
    if (_0x33ad32.__radarUseOffscreenKeepAlive || _0x33ad32.__radarInteractionPrimed) {
      reassertOffscreenKeepAliveSurface(_0x33ad32);
      return;
    }
    ensureHiddenWindowStaysHidden(_0x33ad32);
  };
  _0x33ad32.on("show", _0x34af4e);
  _0x33ad32.on("restore", _0x34af4e);
  _0x33ad32.on("moved", () => {
    if (!_0x33ad32 || _0x33ad32.isDestroyed() || _0x33ad32.__radarAllowVisibleMonitor) {
      return;
    }
    try {
      if (isOnscreenBounds(_0x33ad32.getBounds())) {
        reassertOffscreenKeepAliveSurface(_0x33ad32);
      }
    } catch (_0x250f54) {}
  });
  _0x33ad32.on("focus", () => {
    if (_0x33ad32.__radarAllowVisibleMonitor) {
      return;
    }
    if (!_0x33ad32.isDestroyed()) {
      try {
        _0x33ad32.blur();
      } catch (_0x28efac) {}
      if (_0x33ad32.__radarUseOffscreenKeepAlive || _0x33ad32.__radarInteractionPrimed) {
        reassertOffscreenKeepAliveSurface(_0x33ad32);
        return;
      }
      try {
        const _0x4dce54 = _0x33ad32.getParentWindow?.() || parent;
        if (_0x4dce54 && !_0x4dce54.isDestroyed() && _0x4dce54.isFocused()) {
          _0x4dce54.focus();
        }
      } catch (_0x464e63) {}
    }
  });
}
function primeHiddenWindowForInteraction(_0x36c297) {
  if (!_0x36c297 || _0x36c297.isDestroyed()) {
    return () => {};
  }
  if (_0x36c297.__radarAllowVisibleMonitor) {
    try {
      _0x36c297.webContents?.focus?.();
    } catch (_0x24af15) {}
    return () => {};
  }
  const _0x63a509 = !!_0x36c297.__radarPreferOffscreenKeepAlive;
  const {
    width: _0x267a4e,
    height: _0xe8b275
  } = readSafeSize(_0x36c297, 1020, 800);
  _0x36c297.__radarInteractionPrimed = true;
  if (_0x63a509) {
    _0x36c297.__radarUseOffscreenKeepAlive = true;
  }
  try {
    detachAutomationParent(_0x36c297);
    _0x36c297.setFocusable(true);
    _0x36c297.setSkipTaskbar(true);
    pinWindowOffscreen(_0x36c297, {
      width: _0x267a4e,
      height: _0xe8b275
    });
    try {
      _0x36c297.webContents?.setBackgroundThrottling?.(false);
    } catch (_0x28306d) {}
    try {
      _0x36c297.webContents?.setFrameRate?.(30);
    } catch (_0x59f856) {}
    if (!_0x36c297.isVisible()) {
      if (typeof _0x36c297.showInactive === "function") {
        _0x36c297.showInactive();
      } else {
        _0x36c297.show();
      }
      pinWindowOffscreen(_0x36c297, {
        width: _0x267a4e,
        height: _0xe8b275
      });
    }
    if (!_0x63a509) {
      try {
        _0x36c297.webContents?.focus?.();
      } catch (_0x35c8bd) {}
    }
  } catch (_0x55e167) {}
  return () => {
    if (!_0x36c297 || _0x36c297.isDestroyed()) {
      return;
    }
    if (_0x63a509 || _0x36c297.__radarPreferOffscreenKeepAlive) {
      enableOffscreenKeepAliveWindow(_0x36c297);
      return;
    }
    _0x36c297.__radarInteractionPrimed = false;
    if (_0x36c297.__radarAllowVisibleMonitor) {
      return;
    }
    try {
      _0x36c297.setFocusable(false);
      _0x36c297.setSkipTaskbar(true);
      ensureHiddenWindowStaysHidden(_0x36c297);
    } catch (_0x58d40e) {}
  };
}
function ensureHiddenWindowStaysHidden(_0x4a113c) {
  if (!_0x4a113c || _0x4a113c.isDestroyed()) {
    return;
  }
  if (_0x4a113c.__radarAllowVisibleMonitor) {
    return;
  }
  if (_0x4a113c.__radarUseOffscreenKeepAlive || _0x4a113c.__radarPreferOffscreenKeepAlive) {
    _0x4a113c.__radarUseOffscreenKeepAlive = true;
    keepOffscreenWindowAlive(_0x4a113c);
    return;
  }
  try {
    try {
      _0x4a113c.setOpacity(0);
    } catch (_0x4cd585) {}
    if (_0x4a113c.isVisible() && !_0x4a113c.__radarInteractionPrimed) {
      try {
        _0x4a113c.hide();
      } catch (_0x3a12fa) {}
    }
    const {
      width: _0x42efeb,
      height: _0x4a5516
    } = readSafeSize(_0x4a113c);
    _0x4a113c.setBounds({
      x: OFFSCREEN_X,
      y: OFFSCREEN_Y,
      width: _0x42efeb,
      height: _0x4a5516
    });
  } catch (_0xb9cb23) {}
}
function showHiddenAutomationWindow(_0x4c1a9b, {
  title = "",
  width = 1120,
  height = 820
} = {}) {
  if (!_0x4c1a9b || _0x4c1a9b.isDestroyed()) {
    return false;
  }
  try {
    _0x4c1a9b.__radarAllowVisibleMonitor = true;
    _0x4c1a9b.__radarInteractionPrimed = false;
    _0x4c1a9b.__radarUseOffscreenKeepAlive = false;
    detachAutomationParent(_0x4c1a9b);
    if (title) {
      _0x4c1a9b.setTitle(title);
    }
    _0x4c1a9b.setOpacity(1);
    _0x4c1a9b.setFocusable(true);
    _0x4c1a9b.setSkipTaskbar(false);
    _0x4c1a9b.setBounds({
      ..._0x4c1a9b.getBounds(),
      width: width,
      height: height
    });
    _0x4c1a9b.center();
    if (process.platform === "darwin") {
      try {
        _0x4c1a9b.setWindowButtonVisibility(true);
      } catch (_0x55b8dc) {}
    }
    _0x4c1a9b.show();
    _0x4c1a9b.focus();
    return true;
  } catch (_0x2c8563) {
    return false;
  }
}
function hideVisibleAutomationWindow(_0x3d8a9f) {
  if (!_0x3d8a9f || _0x3d8a9f.isDestroyed()) {
    return false;
  }
  try {
    _0x3d8a9f.__radarAllowVisibleMonitor = false;
    _0x3d8a9f.__radarInteractionPrimed = false;
    if (process.platform === "darwin") {
      try {
        _0x3d8a9f.setWindowButtonVisibility(false);
      } catch (_0x42a77e) {}
    }
    _0x3d8a9f.setFocusable(false);
    _0x3d8a9f.setSkipTaskbar(true);
    if (_0x3d8a9f.__radarPreferOffscreenKeepAlive) {
      enableOffscreenKeepAliveWindow(_0x3d8a9f);
      return true;
    }
    try {
      const {
        BrowserWindow: _0x4a7778
      } = require("electron");
      const _0x347ad6 = _0x4a7778.getAllWindows();
      const _0x2d40ca = _0x347ad6.find(_0x16da13 => _0x16da13 !== _0x3d8a9f && !_0x16da13.isDestroyed() && _0x16da13.webContents && !_0x16da13.webContents.getURL().includes("douyin.com"));
      if (_0x2d40ca) {
        _0x3d8a9f.setParentWindow(_0x2d40ca);
      }
    } catch (_0xd47eec) {}
    ensureHiddenWindowStaysHidden(_0x3d8a9f);
    return true;
  } catch (_0x3d6293) {
    return false;
  }
}
module.exports = {
  applyHiddenAutomationWindowPolicy: applyHiddenAutomationWindowPolicy,
  enableOffscreenKeepAliveWindow: enableOffscreenKeepAliveWindow,
  ensureHiddenWindowStaysHidden: ensureHiddenWindowStaysHidden,
  hideVisibleAutomationWindow: hideVisibleAutomationWindow,
  keepOffscreenWindowAlive: keepOffscreenWindowAlive,
  showHiddenAutomationWindow: showHiddenAutomationWindow,
  primeHiddenWindowForInteraction: primeHiddenWindowForInteraction
};
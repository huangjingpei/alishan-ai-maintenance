const OFFSCREEN_X = -20000;
const OFFSCREEN_Y = -20000;
function readSafeSize(arg1, num = 1280, num2 = 800) {
  try {
    const result = arg1.getBounds();
    return {
      width: Math.max(1000, result.width || num),
      height: Math.max(720, result.height || num2)
    };
  } catch (error) {
    return {
      width: num,
      height: num2
    };
  }
}
function isOnscreenBounds(options = {}) {
  const result = Number(options.x);
  const result2 = Number(options.y);
  if (!Number.isFinite(result) || !Number.isFinite(result2)) {
    return true;
  }
  return result > -800 || result2 > -800;
}
function detachAutomationParent(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  try {
    if (typeof arg1.getParentWindow === "function" && arg1.getParentWindow()) {
      arg1.setParentWindow(null);
    }
  } catch (error) {}
}
function pinWindowOffscreen(arg1, {
  width: width,
  height: height
} = {}) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  try {
    const value = width && height ? {
      width: width,
      height: height
    } : readSafeSize(arg1);
    try {
      arg1.setOpacity(0);
    } catch (error) {}
    try {
      arg1.setSkipTaskbar(true);
    } catch (error) {}
    arg1.setBounds({
      x: OFFSCREEN_X,
      y: OFFSCREEN_Y,
      width: value.width,
      height: value.height
    });
  } catch (error) {}
}
function reassertOffscreenKeepAliveSurface(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  if (arg1.__radarAllowVisibleMonitor) {
    return;
  }
  if (arg1.__radarKeepAliveAsserting) {
    return;
  }
  arg1.__radarKeepAliveAsserting = true;
  try {
    detachAutomationParent(arg1);
    try {
      arg1.setFocusable(false);
    } catch (error) {}
    try {
      arg1.setSkipTaskbar(true);
    } catch (error) {}
    pinWindowOffscreen(arg1);
    try {
      arg1.blur();
    } catch (error) {}
  } catch (error) {} finally {
    arg1.__radarKeepAliveAsserting = false;
  }
}
function keepOffscreenWindowAlive(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  if (arg1.__radarAllowVisibleMonitor) {
    return;
  }
  if (arg1.__radarKeepAliveAsserting) {
    return;
  }
  arg1.__radarKeepAliveAsserting = true;
  try {
    const {
      width: width,
      height: height
    } = readSafeSize(arg1);
    detachAutomationParent(arg1);
    try {
      arg1.setFocusable(false);
      arg1.setSkipTaskbar(true);
      try {
        arg1.webContents?.setBackgroundThrottling?.(false);
      } catch (error) {}
      pinWindowOffscreen(arg1, {
        width: width,
        height: height
      });
      if (!arg1.isVisible()) {
        if (typeof arg1.showInactive === "function") {
          arg1.showInactive();
        } else {
          arg1.show();
        }
      }
      pinWindowOffscreen(arg1, {
        width: width,
        height: height
      });
      try {
        arg1.blur();
      } catch (error) {}
    } catch (error) {}
  } finally {
    arg1.__radarKeepAliveAsserting = false;
  }
}
function enableOffscreenKeepAliveWindow(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  arg1.__radarPreferOffscreenKeepAlive = true;
  arg1.__radarUseOffscreenKeepAlive = true;
  arg1.__radarInteractionPrimed = true;
  keepOffscreenWindowAlive(arg1);
}
function applyHiddenAutomationWindowPolicy(arg1, {
  parent = null
} = {}) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  if (parent && !parent.isDestroyed() && !arg1.__radarPreferOffscreenKeepAlive) {
    try {
      arg1.setParentWindow(parent);
    } catch (error) {}
  }
  try {
    arg1.setFocusable(false);
    arg1.setSkipTaskbar(true);
    arg1.setMenuBarVisibility(false);
  } catch (error) {}
  if (process.platform === "darwin") {
    try {
      arg1.setWindowButtonVisibility(false);
      arg1.setVisibleOnAllWorkspaces(false);
    } catch (error) {}
  }
  const local = () => {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    if (arg1.__radarAllowVisibleMonitor) {
      return;
    }
    if (arg1.__radarUseOffscreenKeepAlive || arg1.__radarInteractionPrimed) {
      reassertOffscreenKeepAliveSurface(arg1);
      return;
    }
    ensureHiddenWindowStaysHidden(arg1);
  };
  arg1.on("show", local);
  arg1.on("restore", local);
  arg1.on("moved", () => {
    if (!arg1 || arg1.isDestroyed() || arg1.__radarAllowVisibleMonitor) {
      return;
    }
    try {
      if (isOnscreenBounds(arg1.getBounds())) {
        reassertOffscreenKeepAliveSurface(arg1);
      }
    } catch (error) {}
  });
  arg1.on("focus", () => {
    if (arg1.__radarAllowVisibleMonitor) {
      return;
    }
    if (!arg1.isDestroyed()) {
      try {
        arg1.blur();
      } catch (error) {}
      if (arg1.__radarUseOffscreenKeepAlive || arg1.__radarInteractionPrimed) {
        reassertOffscreenKeepAliveSurface(arg1);
        return;
      }
      try {
        const local = arg1.getParentWindow?.() || parent;
        if (local && !local.isDestroyed() && local.isFocused()) {
          local.focus();
        }
      } catch (error) {}
    }
  });
}
function primeHiddenWindowForInteraction(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return () => {};
  }
  if (arg1.__radarAllowVisibleMonitor) {
    try {
      arg1.webContents?.focus?.();
    } catch (error) {}
    return () => {};
  }
  const flag = !!arg1.__radarPreferOffscreenKeepAlive;
  const {
    width: width,
    height: height
  } = readSafeSize(arg1, 1020, 800);
  arg1.__radarInteractionPrimed = true;
  if (flag) {
    arg1.__radarUseOffscreenKeepAlive = true;
  }
  try {
    detachAutomationParent(arg1);
    arg1.setFocusable(true);
    arg1.setSkipTaskbar(true);
    pinWindowOffscreen(arg1, {
      width: width,
      height: height
    });
    try {
      arg1.webContents?.setBackgroundThrottling?.(false);
    } catch (error) {}
    try {
      arg1.webContents?.setFrameRate?.(30);
    } catch (error) {}
    if (!arg1.isVisible()) {
      if (typeof arg1.showInactive === "function") {
        arg1.showInactive();
      } else {
        arg1.show();
      }
      pinWindowOffscreen(arg1, {
        width: width,
        height: height
      });
    }
    if (!flag) {
      try {
        arg1.webContents?.focus?.();
      } catch (error) {}
    }
  } catch (error) {}
  return () => {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    if (flag || arg1.__radarPreferOffscreenKeepAlive) {
      enableOffscreenKeepAliveWindow(arg1);
      return;
    }
    arg1.__radarInteractionPrimed = false;
    if (arg1.__radarAllowVisibleMonitor) {
      return;
    }
    try {
      arg1.setFocusable(false);
      arg1.setSkipTaskbar(true);
      ensureHiddenWindowStaysHidden(arg1);
    } catch (error) {}
  };
}
function ensureHiddenWindowStaysHidden(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return;
  }
  if (arg1.__radarAllowVisibleMonitor) {
    return;
  }
  if (arg1.__radarUseOffscreenKeepAlive || arg1.__radarPreferOffscreenKeepAlive) {
    arg1.__radarUseOffscreenKeepAlive = true;
    keepOffscreenWindowAlive(arg1);
    return;
  }
  try {
    try {
      arg1.setOpacity(0);
    } catch (error) {}
    if (arg1.isVisible() && !arg1.__radarInteractionPrimed) {
      try {
        arg1.hide();
      } catch (error) {}
    }
    const {
      width: width,
      height: height
    } = readSafeSize(arg1);
    arg1.setBounds({
      x: OFFSCREEN_X,
      y: OFFSCREEN_Y,
      width: width,
      height: height
    });
  } catch (error) {}
}
function showHiddenAutomationWindow(arg1, {
  title = "",
  width = 1120,
  height = 820
} = {}) {
  if (!arg1 || arg1.isDestroyed()) {
    return false;
  }
  try {
    arg1.__radarAllowVisibleMonitor = true;
    arg1.__radarInteractionPrimed = false;
    arg1.__radarUseOffscreenKeepAlive = false;
    detachAutomationParent(arg1);
    if (title) {
      arg1.setTitle(title);
    }
    arg1.setOpacity(1);
    arg1.setFocusable(true);
    arg1.setSkipTaskbar(false);
    arg1.setBounds({
      ...arg1.getBounds(),
      width: width,
      height: height
    });
    arg1.center();
    if (process.platform === "darwin") {
      try {
        arg1.setWindowButtonVisibility(true);
      } catch (error) {}
    }
    arg1.show();
    arg1.focus();
    return true;
  } catch (error) {
    return false;
  }
}
function hideVisibleAutomationWindow(arg1) {
  if (!arg1 || arg1.isDestroyed()) {
    return false;
  }
  try {
    arg1.__radarAllowVisibleMonitor = false;
    arg1.__radarInteractionPrimed = false;
    if (process.platform === "darwin") {
      try {
        arg1.setWindowButtonVisibility(false);
      } catch (error) {}
    }
    arg1.setFocusable(false);
    arg1.setSkipTaskbar(true);
    if (arg1.__radarPreferOffscreenKeepAlive) {
      enableOffscreenKeepAliveWindow(arg1);
      return true;
    }
    try {
      const {
        BrowserWindow: browserWindow
      } = require("electron");
      const result = browserWindow.getAllWindows();
      const result2 = result.find(arg12 => arg12 !== arg1 && !arg12.isDestroyed() && arg12.webContents && !arg12.webContents.getURL().includes("douyin.com"));
      if (result2) {
        arg1.setParentWindow(result2);
      }
    } catch (error) {}
    ensureHiddenWindowStaysHidden(arg1);
    return true;
  } catch (error) {
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
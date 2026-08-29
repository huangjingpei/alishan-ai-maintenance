'use strict';

const {
  ipcMain
} = require("electron");
const TRUSTED_AUTOMATION_KEYS = {
  ArrowDown: {
    code: "ArrowDown",
    windowsVirtualKeyCode: 40,
    nativeVirtualKeyCode: 40
  },
  Escape: {
    code: "Escape",
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27
  }
};
const TRUSTED_CLICK_TARGET_ATTR = "data-radar-trusted-click-target";
function registerTrustedInputSimulation(arg1) {
  const {
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    inferAutomationViewKey: inferAutomationViewKey,
    getBackgroundAutomationHostViews: getBackgroundAutomationHostViews,
    getBackgroundInteractionSlot: getBackgroundInteractionSlot,
    getBackgroundAutomationHostWindow: getBackgroundAutomationHostWindow,
    getAutomationViewsVisible: getAutomationViewsVisible,
    getMainWindow: getMainWindow,
    safeSetTopBrowserView: safeSetTopBrowserView,
    parkBackgroundAutomationHostWindow: parkBackgroundAutomationHostWindow,
    restoreMainWindowUiFocus: restoreMainWindowUiFocus
  } = arg1;
  function fn(arg1) {
    for (const item of getPlatformViews().values()) {
      if (item?.webContents === arg1) {
        return item;
      }
    }
    for (const item of getInteractionViewsMap().values()) {
      if (item?.webContents === arg1) {
        return item;
      }
    }
    return null;
  }
  async function fn2(arg1, arg2) {
    const result = String(arg2 || "").trim();
    if (!/^[a-zA-Z0-9_-]{8,96}$/.test(result)) {
      return null;
    }
    const result2 = JSON.stringify(TRUSTED_CLICK_TARGET_ATTR);
    const result3 = JSON.stringify(result);
    try {
      return await arg1.executeJavaScript("\n                (() => {\n                    const attr = " + result2 + ";\n                    const token = " + result3 + ";\n                    const controls = Array.from(document.querySelectorAll('[' + attr + ']'));\n                    const control = controls.find((el) => el.getAttribute(attr) === token);\n                    if (!control || control.isConnected === false || !control.getBoundingClientRect) return null;\n                    const rect = control.getBoundingClientRect();\n                    if (!(rect.width > 1 && rect.height > 1)) return null;\n                    const samples = [[0.5, 0.5], [0.5, 0.35], [0.5, 0.65], [0.32, 0.5], [0.68, 0.5]];\n                    for (const [rx, ry] of samples) {\n                        const x = rect.left + rect.width * rx;\n                        const y = rect.top + rect.height * ry;\n                        const hit = document.elementFromPoint(x, y);\n                        const matched = !!(hit && (\n                            hit === control || control.contains(hit) || hit.contains(control)\n                        ));\n                        if (!matched) continue;\n                        return {\n                            x,\n                            y,\n                            rect: {\n                                left: rect.left,\n                                top: rect.top,\n                                width: rect.width,\n                                height: rect.height,\n                            },\n                            tag: String(control.tagName || ''),\n                            hitTag: String(hit.tagName || ''),\n                        };\n                    }\n                    return null;\n                })()\n            ", true);
    } catch (error) {
      return null;
    }
  }
  async function fn3(arg1, {
    x: x2,
    y: y2,
    targetToken: targetToken
  } = {}) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const result = inferAutomationViewKey(arg1);
    const result2 = fn(arg1);
    const result3 = getBackgroundAutomationHostViews();
    const local = !!result2 && result3.includes(result2);
    let flag = false;
    const result4 = getMainWindow();
    if (local) {
      const result3 = getBackgroundInteractionSlot();
      flag = !!result3 && result3.viewKey === result && result3.webContentsId === arg1.id;
      if (flag) {
        try {
          getBackgroundAutomationHostWindow()?.setTopBrowserView(result2);
        } catch (error) {}
      }
    } else if (getAutomationViewsVisible() && result2 && result4 && !result4.isDestroyed() && result4.getBrowserViews().includes(result2)) {
      safeSetTopBrowserView(result2, {
        context: "trusted-click:" + (result || "?")
      });
    }
    const value = targetToken ? await fn2(arg1, targetToken) : null;
    if (targetToken && !value) {
      return {
        success: false,
        reason: "target_not_found_or_not_hittable",
        viewKey: result
      };
    }
    const result5 = Number(value?.x ?? x2);
    const result6 = Number(value?.y ?? y2);
    if (!Number.isFinite(result5) || !Number.isFinite(result6)) {
      return {
        success: false,
        reason: "invalid_coordinates",
        viewKey: result
      };
    }
    const value2 = arg1.debugger;
    let flag2 = false;
    let flag3 = false;
    try {
      if (!value2.isAttached()) {
        value2.attach("1.3");
        flag2 = true;
      }
      await value2.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: result5,
        y: result6,
        button: "none",
        buttons: 0
      });
      await value2.sendCommand("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: result5,
        y: result6,
        button: "left",
        buttons: 1,
        clickCount: 1
      });
      flag3 = true;
      await new Promise(arg1 => setTimeout(arg1, 55));
      await value2.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: result5,
        y: result6,
        button: "left",
        buttons: 0,
        clickCount: 1
      });
      flag3 = false;
      return {
        success: true,
        transport: "cdp",
        viewKey: result,
        backgroundHosted: local,
        backgroundSlotOwned: flag,
        zoomFactor: Number(arg1.getZoomFactor?.() || 1),
        x: result5,
        y: result6,
        targetResolved: !!value,
        targetRect: value?.rect || null
      };
    } catch (error) {
      if (flag3 && value2.isAttached()) {
        try {
          await value2.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseReleased",
            x: result5,
            y: result6,
            button: "left",
            buttons: 0,
            clickCount: 1
          });
        } catch (error) {}
      }
      console.warn("[Main] CDP 原生点击失败 " + (result || "?") + ": " + error.message);
    } finally {
      if (flag2 && value2.isAttached()) {
        try {
          value2.detach();
        } catch (error) {}
      }
    }
    if (local) {
      const result2 = getBackgroundAutomationHostWindow();
      if (result2 && !result2.isDestroyed()) {
        parkBackgroundAutomationHostWindow(result2, "click-fallback-skip-focus");
        try {
          if (result2.isFocused()) {
            result2.blur();
          }
        } catch (error) {}
      }
      if (result4 && !result4.isDestroyed() && result4.isVisible() && !result4.isMinimized()) {
        restoreMainWindowUiFocus("click-fallback-host-skip");
      }
      return {
        success: false,
        reason: "cdp_failed_background_host_no_focus",
        viewKey: result
      };
    }
    if (!getAutomationViewsVisible()) {
      restoreMainWindowUiFocus("click-fallback-preview-closed");
      return {
        success: false,
        reason: "cdp_failed_preview_closed_no_focus",
        viewKey: result
      };
    }
    return {
      success: false,
      reason: "cdp_failed_no_coordinate_fallback",
      viewKey: result
    };
  }
  async function fn4(arg1, arg2) {
    const value = TRUSTED_AUTOMATION_KEYS[arg2];
    if (!value) {
      return {
        success: false,
        reason: "unsupported_key"
      };
    }
    if (!arg1 || arg1.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const result = inferAutomationViewKey(arg1);
    const result2 = fn(arg1);
    const local = !!result2 && getBackgroundAutomationHostViews().includes(result2);
    const value2 = arg1.debugger;
    let flag = false;
    try {
      if (!value2.isAttached()) {
        value2.attach("1.3");
        flag = true;
      }
      await value2.sendCommand("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: arg2,
        ...value
      });
      await new Promise(arg1 => setTimeout(arg1, 45));
      await value2.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: arg2,
        ...value
      });
      return {
        success: true,
        transport: "cdp",
        viewKey: result,
        backgroundHosted: local,
        key: arg2
      };
    } catch (error) {
      return {
        success: false,
        reason: error.message || "trusted_key_failed",
        viewKey: result,
        backgroundHosted: local,
        key: arg2
      };
    } finally {
      if (flag && value2.isAttached()) {
        try {
          value2.detach();
        } catch (error) {}
      }
    }
  }
  async function fn5(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const result = inferAutomationViewKey(arg1);
    const result2 = fn(arg1);
    const local = !!result2 && getBackgroundAutomationHostViews().includes(result2);
    if (local) {
      const result3 = getBackgroundInteractionSlot();
      if (!result3 || result3.viewKey !== result || result3.webContentsId !== arg1.id) {
        return {
          success: false,
          reason: "background_interaction_slot_not_owned",
          viewKey: result
        };
      }
      try {
        getBackgroundAutomationHostWindow()?.setTopBrowserView(result2);
      } catch (error) {}
    }
    const value = arg1.debugger;
    let flag = false;
    try {
      if (!value.isAttached()) {
        value.attach("1.3");
        flag = true;
      }
      await value.sendCommand("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Enter",
        code: "Enter",
        text: "\r",
        unmodifiedText: "\r",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13
      });
      await new Promise(arg1 => setTimeout(arg1, 45));
      await value.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13
      });
      return {
        success: true,
        transport: "cdp",
        viewKey: result,
        backgroundHosted: local
      };
    } catch (error) {
      return {
        success: false,
        reason: error.message || "native_enter_failed",
        viewKey: result,
        backgroundHosted: local
      };
    } finally {
      if (flag && value.isAttached()) {
        try {
          value.detach();
        } catch (error) {}
      }
    }
  }
  ipcMain.handle("simulate-native-click", async (arg1, options = {}) => {
    return fn3(arg1.sender, options);
  });
  ipcMain.handle("simulate-trusted-key", async (arg1, {
    key: key
  } = {}) => {
    return fn4(arg1.sender, key);
  });
  ipcMain.handle("simulate-native-enter", async arg1 => {
    return fn5(arg1.sender);
  });
  async function fn6(arg1, arg2, num = 50) {
    if (!arg1 || arg1.isDestroyed()) {
      return {
        success: false,
        reason: "destroyed"
      };
    }
    const result = String(arg2 || "");
    if (!result) {
      return {
        success: true,
        count: 0,
        transport: "empty"
      };
    }
    const local = () => new Promise(arg1 => {
      setTimeout(arg1, Math.max(10, Number(num) || 50) + Math.floor(Math.random() * 30));
    });
    const value = arg1.debugger;
    let flag = false;
    try {
      if (!value.isAttached()) {
        value.attach("1.3");
        flag = true;
      }
      for (const item of result) {
        if (arg1.isDestroyed()) {
          break;
        }
        const local2 = item.codePointAt(0) || 0;
        const value2 = local2 <= 255 ? local2 : 0;
        await value.sendCommand("Input.dispatchKeyEvent", {
          type: "keyDown",
          text: item,
          unmodifiedText: item,
          key: item,
          windowsVirtualKeyCode: value2,
          nativeVirtualKeyCode: value2
        });
        await value.sendCommand("Input.dispatchKeyEvent", {
          type: "keyUp",
          key: item,
          windowsVirtualKeyCode: value2,
          nativeVirtualKeyCode: value2
        });
        await local();
      }
      return {
        success: true,
        count: result.length,
        transport: "cdp"
      };
    } catch (error) {
      try {
        for (const item of result) {
          if (arg1.isDestroyed()) {
            break;
          }
          arg1.sendInputEvent({
            type: "char",
            keyCode: item
          });
          await local();
        }
        return {
          success: true,
          count: result.length,
          transport: "sendInputEvent-char"
        };
      } catch (error) {
        return {
          success: false,
          reason: error?.message || "simulate_text_failed"
        };
      }
    } finally {
      if (flag && value.isAttached()) {
        try {
          value.detach();
        } catch (error) {}
      }
    }
  }
  ipcMain.handle("simulate-text", async (arg1, {
    text: text,
    delay = 50
  } = {}) => {
    return fn6(arg1.sender, text, delay);
  });
  ipcMain.on("simulate-text", async (arg1, {
    text: text,
    delay = 50
  } = {}) => {
    await fn6(arg1.sender, text, delay);
  });
  ipcMain.on("simulate-key", (arg1, {
    type: type,
    keyCode: keyCode,
    modifiers: modifiers
  }) => {
    const value = arg1.sender;
    if (value && !value.isDestroyed()) {
      value.sendInputEvent({
        type: type,
        keyCode: keyCode,
        modifiers: modifiers
      });
    }
  });
}
module.exports = {
  registerTrustedInputSimulation: registerTrustedInputSimulation
};
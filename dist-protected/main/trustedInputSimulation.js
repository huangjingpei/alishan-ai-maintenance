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
function registerTrustedInputSimulation(_0x336a1b) {
  const {
    getPlatformViews: _0x1dced7,
    getInteractionViewsMap: _0x4510d3,
    inferAutomationViewKey: _0x108e94,
    getBackgroundAutomationHostViews: _0x4858cb,
    getBackgroundInteractionSlot: _0x215bde,
    getBackgroundAutomationHostWindow: _0x292eb0,
    getAutomationViewsVisible: _0x30d664,
    getMainWindow: _0x2b2a96,
    safeSetTopBrowserView: _0x747bbe,
    parkBackgroundAutomationHostWindow: _0x523e67,
    restoreMainWindowUiFocus: _0x21163
  } = _0x336a1b;
  function _0x12ec9b(_0x1a252c) {
    for (const _0x2b30ee of _0x1dced7().values()) {
      if (_0x2b30ee?.webContents === _0x1a252c) {
        return _0x2b30ee;
      }
    }
    for (const _0x3151a4 of _0x4510d3().values()) {
      if (_0x3151a4?.webContents === _0x1a252c) {
        return _0x3151a4;
      }
    }
    return null;
  }
  async function _0x4061e5(_0x1a2255, _0x5ab295) {
    const _0x2a3d86 = String(_0x5ab295 || "").trim();
    if (!/^[a-zA-Z0-9_-]{8,96}$/.test(_0x2a3d86)) {
      return null;
    }
    const _0xea119b = JSON.stringify(TRUSTED_CLICK_TARGET_ATTR);
    const _0x162e8c = JSON.stringify(_0x2a3d86);
    try {
      return await _0x1a2255.executeJavaScript("\n                (() => {\n                    const attr = " + _0xea119b + ";\n                    const token = " + _0x162e8c + ";\n                    const controls = Array.from(document.querySelectorAll('[' + attr + ']'));\n                    const control = controls.find((el) => el.getAttribute(attr) === token);\n                    if (!control || control.isConnected === false || !control.getBoundingClientRect) return null;\n                    const rect = control.getBoundingClientRect();\n                    if (!(rect.width > 1 && rect.height > 1)) return null;\n                    const samples = [[0.5, 0.5], [0.5, 0.35], [0.5, 0.65], [0.32, 0.5], [0.68, 0.5]];\n                    for (const [rx, ry] of samples) {\n                        const x = rect.left + rect.width * rx;\n                        const y = rect.top + rect.height * ry;\n                        const hit = document.elementFromPoint(x, y);\n                        const matched = !!(hit && (\n                            hit === control || control.contains(hit) || hit.contains(control)\n                        ));\n                        if (!matched) continue;\n                        return {\n                            x,\n                            y,\n                            rect: {\n                                left: rect.left,\n                                top: rect.top,\n                                width: rect.width,\n                                height: rect.height,\n                            },\n                            tag: String(control.tagName || ''),\n                            hitTag: String(hit.tagName || ''),\n                        };\n                    }\n                    return null;\n                })()\n            ", true);
    } catch (_0x40e3c0) {
      return null;
    }
  }
  async function _0x3378a1(_0x85203b, {
    x: _0x5b6bb9,
    y: _0x4e740f,
    targetToken: _0xde6042
  } = {}) {
    if (!_0x85203b || _0x85203b.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const _0x2c190e = _0x108e94(_0x85203b);
    const _0x390736 = _0x12ec9b(_0x85203b);
    const _0x140ea6 = _0x4858cb();
    const _0x407783 = !!_0x390736 && _0x140ea6.includes(_0x390736);
    let _0x5f28c4 = false;
    const _0x636409 = _0x2b2a96();
    if (_0x407783) {
      const _0x27eba4 = _0x215bde();
      _0x5f28c4 = !!_0x27eba4 && _0x27eba4.viewKey === _0x2c190e && _0x27eba4.webContentsId === _0x85203b.id;
      if (_0x5f28c4) {
        try {
          _0x292eb0()?.setTopBrowserView(_0x390736);
        } catch (_0x4d236f) {}
      }
    } else if (_0x30d664() && _0x390736 && _0x636409 && !_0x636409.isDestroyed() && _0x636409.getBrowserViews().includes(_0x390736)) {
      _0x747bbe(_0x390736, {
        context: "trusted-click:" + (_0x2c190e || "?")
      });
    }
    const _0x1c70f6 = _0xde6042 ? await _0x4061e5(_0x85203b, _0xde6042) : null;
    if (_0xde6042 && !_0x1c70f6) {
      return {
        success: false,
        reason: "target_not_found_or_not_hittable",
        viewKey: _0x2c190e
      };
    }
    const _0x548e2b = Number(_0x1c70f6?.x ?? _0x5b6bb9);
    const _0x436b12 = Number(_0x1c70f6?.y ?? _0x4e740f);
    if (!Number.isFinite(_0x548e2b) || !Number.isFinite(_0x436b12)) {
      return {
        success: false,
        reason: "invalid_coordinates",
        viewKey: _0x2c190e
      };
    }
    const _0xf6c901 = _0x85203b.debugger;
    let _0x270711 = false;
    let _0x25857d = false;
    try {
      if (!_0xf6c901.isAttached()) {
        _0xf6c901.attach("1.3");
        _0x270711 = true;
      }
      await _0xf6c901.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: _0x548e2b,
        y: _0x436b12,
        button: "none",
        buttons: 0
      });
      await _0xf6c901.sendCommand("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: _0x548e2b,
        y: _0x436b12,
        button: "left",
        buttons: 1,
        clickCount: 1
      });
      _0x25857d = true;
      await new Promise(_0x38be3d => setTimeout(_0x38be3d, 55));
      await _0xf6c901.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: _0x548e2b,
        y: _0x436b12,
        button: "left",
        buttons: 0,
        clickCount: 1
      });
      _0x25857d = false;
      return {
        success: true,
        transport: "cdp",
        viewKey: _0x2c190e,
        backgroundHosted: _0x407783,
        backgroundSlotOwned: _0x5f28c4,
        zoomFactor: Number(_0x85203b.getZoomFactor?.() || 1),
        x: _0x548e2b,
        y: _0x436b12,
        targetResolved: !!_0x1c70f6,
        targetRect: _0x1c70f6?.rect || null
      };
    } catch (_0x5d56f7) {
      if (_0x25857d && _0xf6c901.isAttached()) {
        try {
          await _0xf6c901.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseReleased",
            x: _0x548e2b,
            y: _0x436b12,
            button: "left",
            buttons: 0,
            clickCount: 1
          });
        } catch (_0x34f346) {}
      }
      console.warn("[Main] CDP 原生点击失败 " + (_0x2c190e || "?") + ": " + _0x5d56f7.message);
    } finally {
      if (_0x270711 && _0xf6c901.isAttached()) {
        try {
          _0xf6c901.detach();
        } catch (_0x2a256f) {}
      }
    }
    if (_0x407783) {
      const _0x139151 = _0x292eb0();
      if (_0x139151 && !_0x139151.isDestroyed()) {
        _0x523e67(_0x139151, "click-fallback-skip-focus");
        try {
          if (_0x139151.isFocused()) {
            _0x139151.blur();
          }
        } catch (_0x3f1b7d) {}
      }
      if (_0x636409 && !_0x636409.isDestroyed() && _0x636409.isVisible() && !_0x636409.isMinimized()) {
        _0x21163("click-fallback-host-skip");
      }
      return {
        success: false,
        reason: "cdp_failed_background_host_no_focus",
        viewKey: _0x2c190e
      };
    }
    if (!_0x30d664()) {
      _0x21163("click-fallback-preview-closed");
      return {
        success: false,
        reason: "cdp_failed_preview_closed_no_focus",
        viewKey: _0x2c190e
      };
    }
    return {
      success: false,
      reason: "cdp_failed_no_coordinate_fallback",
      viewKey: _0x2c190e
    };
  }
  async function _0x56b81b(_0x4ac12e, _0x430a40) {
    const _0x1c5f8e = TRUSTED_AUTOMATION_KEYS[_0x430a40];
    if (!_0x1c5f8e) {
      return {
        success: false,
        reason: "unsupported_key"
      };
    }
    if (!_0x4ac12e || _0x4ac12e.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const _0x2bac15 = _0x108e94(_0x4ac12e);
    const _0x5b79e6 = _0x12ec9b(_0x4ac12e);
    const _0x351e43 = !!_0x5b79e6 && _0x4858cb().includes(_0x5b79e6);
    const _0x58ee78 = _0x4ac12e.debugger;
    let _0x299292 = false;
    try {
      if (!_0x58ee78.isAttached()) {
        _0x58ee78.attach("1.3");
        _0x299292 = true;
      }
      await _0x58ee78.sendCommand("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: _0x430a40,
        ..._0x1c5f8e
      });
      await new Promise(_0x3fd87c => setTimeout(_0x3fd87c, 45));
      await _0x58ee78.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: _0x430a40,
        ..._0x1c5f8e
      });
      return {
        success: true,
        transport: "cdp",
        viewKey: _0x2bac15,
        backgroundHosted: _0x351e43,
        key: _0x430a40
      };
    } catch (_0x3b0d13) {
      return {
        success: false,
        reason: _0x3b0d13.message || "trusted_key_failed",
        viewKey: _0x2bac15,
        backgroundHosted: _0x351e43,
        key: _0x430a40
      };
    } finally {
      if (_0x299292 && _0x58ee78.isAttached()) {
        try {
          _0x58ee78.detach();
        } catch (_0x5afe08) {}
      }
    }
  }
  async function _0x5ceb3e(_0xf198e) {
    if (!_0xf198e || _0xf198e.isDestroyed?.()) {
      return {
        success: false,
        reason: "web_contents_unavailable"
      };
    }
    const _0x983e46 = _0x108e94(_0xf198e);
    const _0x28f024 = _0x12ec9b(_0xf198e);
    const _0x4e49f2 = !!_0x28f024 && _0x4858cb().includes(_0x28f024);
    if (_0x4e49f2) {
      const _0x5986c9 = _0x215bde();
      if (!_0x5986c9 || _0x5986c9.viewKey !== _0x983e46 || _0x5986c9.webContentsId !== _0xf198e.id) {
        return {
          success: false,
          reason: "background_interaction_slot_not_owned",
          viewKey: _0x983e46
        };
      }
      try {
        _0x292eb0()?.setTopBrowserView(_0x28f024);
      } catch (_0x4e73be) {}
    }
    const _0x311312 = _0xf198e.debugger;
    let _0x3e6cdc = false;
    try {
      if (!_0x311312.isAttached()) {
        _0x311312.attach("1.3");
        _0x3e6cdc = true;
      }
      await _0x311312.sendCommand("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Enter",
        code: "Enter",
        text: "\r",
        unmodifiedText: "\r",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13
      });
      await new Promise(_0x32228b => setTimeout(_0x32228b, 45));
      await _0x311312.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13
      });
      return {
        success: true,
        transport: "cdp",
        viewKey: _0x983e46,
        backgroundHosted: _0x4e49f2
      };
    } catch (_0x27b09c) {
      return {
        success: false,
        reason: _0x27b09c.message || "native_enter_failed",
        viewKey: _0x983e46,
        backgroundHosted: _0x4e49f2
      };
    } finally {
      if (_0x3e6cdc && _0x311312.isAttached()) {
        try {
          _0x311312.detach();
        } catch (_0x1774f2) {}
      }
    }
  }
  ipcMain.handle("simulate-native-click", async (_0x5a1a0e, _0x3dab88 = {}) => {
    return _0x3378a1(_0x5a1a0e.sender, _0x3dab88);
  });
  ipcMain.handle("simulate-trusted-key", async (_0x37adcd, {
    key: _0x564370
  } = {}) => {
    return _0x56b81b(_0x37adcd.sender, _0x564370);
  });
  ipcMain.handle("simulate-native-enter", async _0x59849d => {
    return _0x5ceb3e(_0x59849d.sender);
  });
  async function _0x377ac8(_0x155a0b, _0x2ba06d, _0x5b0bbf = 50) {
    if (!_0x155a0b || _0x155a0b.isDestroyed()) {
      return {
        success: false,
        reason: "destroyed"
      };
    }
    const _0x103e53 = String(_0x2ba06d || "");
    if (!_0x103e53) {
      return {
        success: true,
        count: 0,
        transport: "empty"
      };
    }
    const _0x345d4e = () => new Promise(_0x17256d => {
      setTimeout(_0x17256d, Math.max(10, Number(_0x5b0bbf) || 50) + Math.floor(Math.random() * 30));
    });
    const _0x33f6ee = _0x155a0b.debugger;
    let _0x273b45 = false;
    try {
      if (!_0x33f6ee.isAttached()) {
        _0x33f6ee.attach("1.3");
        _0x273b45 = true;
      }
      for (const _0x436cfc of _0x103e53) {
        if (_0x155a0b.isDestroyed()) {
          break;
        }
        const _0x377b4b = _0x436cfc.codePointAt(0) || 0;
        const _0x3bbc34 = _0x377b4b <= 255 ? _0x377b4b : 0;
        await _0x33f6ee.sendCommand("Input.dispatchKeyEvent", {
          type: "keyDown",
          text: _0x436cfc,
          unmodifiedText: _0x436cfc,
          key: _0x436cfc,
          windowsVirtualKeyCode: _0x3bbc34,
          nativeVirtualKeyCode: _0x3bbc34
        });
        await _0x33f6ee.sendCommand("Input.dispatchKeyEvent", {
          type: "keyUp",
          key: _0x436cfc,
          windowsVirtualKeyCode: _0x3bbc34,
          nativeVirtualKeyCode: _0x3bbc34
        });
        await _0x345d4e();
      }
      return {
        success: true,
        count: _0x103e53.length,
        transport: "cdp"
      };
    } catch (_0x247d5a) {
      try {
        for (const _0x31b860 of _0x103e53) {
          if (_0x155a0b.isDestroyed()) {
            break;
          }
          _0x155a0b.sendInputEvent({
            type: "char",
            keyCode: _0x31b860
          });
          await _0x345d4e();
        }
        return {
          success: true,
          count: _0x103e53.length,
          transport: "sendInputEvent-char"
        };
      } catch (_0x2ed8de) {
        return {
          success: false,
          reason: _0x2ed8de?.message || "simulate_text_failed"
        };
      }
    } finally {
      if (_0x273b45 && _0x33f6ee.isAttached()) {
        try {
          _0x33f6ee.detach();
        } catch (_0x4e0e44) {}
      }
    }
  }
  ipcMain.handle("simulate-text", async (_0x361b80, {
    text: _0x182c6b,
    delay = 50
  } = {}) => {
    return _0x377ac8(_0x361b80.sender, _0x182c6b, delay);
  });
  ipcMain.on("simulate-text", async (_0x447b27, {
    text: _0x7d03a2,
    delay = 50
  } = {}) => {
    await _0x377ac8(_0x447b27.sender, _0x7d03a2, delay);
  });
  ipcMain.on("simulate-key", (_0x54dda5, {
    type: _0x4f8e34,
    keyCode: _0x3282c5,
    modifiers: _0x2e4f8b
  }) => {
    const _0x5b532d = _0x54dda5.sender;
    if (_0x5b532d && !_0x5b532d.isDestroyed()) {
      _0x5b532d.sendInputEvent({
        type: _0x4f8e34,
        keyCode: _0x3282c5,
        modifiers: _0x2e4f8b
      });
    }
  });
}
module.exports = {
  registerTrustedInputSimulation: registerTrustedInputSimulation
};
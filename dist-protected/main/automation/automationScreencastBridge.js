const {
  automationWindowManager
} = require("./automationWindowManager");
class AutomationScreencastBridge {
  constructor() {
    this.cardBindings = new Map();
  }
  syncViewBounds(_0x25b80a, _0x12e8a5, _0x1de86d) {
    if (!_0x25b80a || !_0x12e8a5) {
      return false;
    }
    const _0x59938d = automationWindowManager.getAccountWindow(_0x25b80a);
    if (!_0x59938d) {
      return false;
    }
    const {
      x: _0x41b684,
      y: _0x4106b2,
      width: _0x1d5971,
      height: _0x4194dc
    } = _0x12e8a5;
    this.cardBindings.set(_0x25b80a, {
      parentWindow: _0x1de86d,
      rect: {
        x: _0x41b684,
        y: _0x4106b2,
        width: _0x1d5971,
        height: _0x4194dc
      }
    });
    try {
      if (_0x1d5971 > 0 && _0x4194dc > 0) {
        if (_0x59938d.isDestroyed()) {
          return false;
        }
        _0x59938d.setContentSize(Math.max(1200, Math.round(_0x1d5971)), Math.max(800, Math.round(_0x4194dc)));
      }
      return true;
    } catch (_0xbd6448) {
      console.warn("[ScreencastBridge] 视口大小同步异常 (" + _0x25b80a + "):", _0xbd6448.message || _0xbd6448);
      return false;
    }
  }
  unbindView(_0x1144b1) {
    this.cardBindings.delete(_0x1144b1);
    const _0x40afa5 = automationWindowManager.getAccountWindow(_0x1144b1);
    if (_0x40afa5 && !_0x40afa5.isDestroyed()) {
      try {
        if (_0x40afa5.isVisible()) {
          _0x40afa5.hide();
        }
      } catch (_0x295aa6) {}
    }
  }
  clearAll() {
    this.cardBindings.clear();
  }
}
const automationScreencastBridge = new AutomationScreencastBridge();
module.exports = {
  automationScreencastBridge: automationScreencastBridge,
  AutomationScreencastBridge: AutomationScreencastBridge
};
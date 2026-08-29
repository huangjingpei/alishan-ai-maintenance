const {
  automationWindowManager
} = require("./automationWindowManager");
class AutomationScreencastBridge {
  constructor() {
    this.cardBindings = new Map();
  }
  syncViewBounds(arg1, arg2, arg3) {
    if (!arg1 || !arg2) {
      return false;
    }
    const result = automationWindowManager.getAccountWindow(arg1);
    if (!result) {
      return false;
    }
    const {
      x: x,
      y: y,
      width: width,
      height: height
    } = arg2;
    this.cardBindings.set(arg1, {
      parentWindow: arg3,
      rect: {
        x: x,
        y: y,
        width: width,
        height: height
      }
    });
    try {
      if (width > 0 && height > 0) {
        if (result.isDestroyed()) {
          return false;
        }
        result.setContentSize(Math.max(1200, Math.round(width)), Math.max(800, Math.round(height)));
      }
      return true;
    } catch (error) {
      console.warn("[ScreencastBridge] 视口大小同步异常 (" + arg1 + "):", error.message || error);
      return false;
    }
  }
  unbindView(arg1) {
    this.cardBindings.delete(arg1);
    const result = automationWindowManager.getAccountWindow(arg1);
    if (result && !result.isDestroyed()) {
      try {
        if (result.isVisible()) {
          result.hide();
        }
      } catch (error) {}
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
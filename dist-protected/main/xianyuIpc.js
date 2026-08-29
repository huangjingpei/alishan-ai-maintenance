'use strict';

const {
  ipcMain
} = require("electron");
function registerXianyuIpc({
  enabled: enabled,
  getXianyuMonitor: getXianyuMonitor,
  ensureXianyuAccess: ensureXianyuAccess,
  acquireTaskRuntimeGuard: acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard: releaseTaskRuntimeGuard
}) {
  if (!enabled) {
    return;
  }
  ipcMain.on("start-xianyu-monitor", (arg1, arg2) => {
    if (!ensureXianyuAccess()) {
      return;
    }
    const result = getXianyuMonitor();
    if (result) {
      console.log("[Main] 启动闲鱼监控，关键词:", arg2.keywords);
      result.start(arg2);
      if (result.isMonitorRunning()) {
        acquireTaskRuntimeGuard("xianyu-monitor", {
          type: "xianyu-monitor"
        });
      }
    } else {
      console.error("[Main] 闲鱼监控引擎未初始化");
    }
  });
  ipcMain.on("update-xianyu-monitor-config", (arg1, arg2) => {
    const result = getXianyuMonitor();
    if (result) {
      console.log("[Main] 收到闲鱼监控配置热更新");
      result.updateConfig(arg2);
    }
  });
  ipcMain.on("stop-xianyu-monitor", () => {
    const result = getXianyuMonitor();
    if (result) {
      console.log("[Main] 停止闲鱼监控");
      result.stop();
    }
    releaseTaskRuntimeGuard("xianyu-monitor");
  });
  ipcMain.on("clear-xianyu-monitor-history", () => {
    const result = getXianyuMonitor();
    if (result) {
      console.log("[Main] 清空闲鱼去重历史缓存");
      result.history.clear();
      result.saveHistory();
    }
  });
  ipcMain.handle("get-xianyu-monitor-status", async () => {
    const result = getXianyuMonitor();
    if (result) {
      return result.getStatus();
    }
    return {
      running: false,
      config: null,
      nextCheck: "--"
    };
  });
  ipcMain.handle("get-xianyu-monitor-runtime-logs", async () => {
    const result = getXianyuMonitor();
    if (result) {
      return result.getRuntimeLogs();
    }
    return [];
  });
  ipcMain.on("set-xianyu-monitor-preview-visible", (arg1, arg2) => {
    const result = getXianyuMonitor();
    if (result) {
      result.setPreviewVisible(!!arg2);
    }
  });
  ipcMain.on("update-xianyu-monitor-preview-bounds", (arg1, options = {}) => {
    const result = getXianyuMonitor();
    if (result) {
      result.setPreviewBounds(options.bounds || options);
    }
  });
}
module.exports = {
  registerXianyuIpc: registerXianyuIpc
};
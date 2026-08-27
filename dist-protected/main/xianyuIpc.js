'use strict';

const {
  ipcMain
} = require("electron");
function registerXianyuIpc({
  enabled: _0x14cf19,
  getXianyuMonitor: _0x312572,
  ensureXianyuAccess: _0x1f8f15,
  acquireTaskRuntimeGuard: _0x3144d8,
  releaseTaskRuntimeGuard: _0x1d810d
}) {
  if (!_0x14cf19) {
    return;
  }
  ipcMain.on("start-xianyu-monitor", (_0x19b840, _0x16ed17) => {
    if (!_0x1f8f15()) {
      return;
    }
    const _0xd8acd6 = _0x312572();
    if (_0xd8acd6) {
      console.log("[Main] 启动闲鱼监控，关键词:", _0x16ed17.keywords);
      _0xd8acd6.start(_0x16ed17);
      if (_0xd8acd6.isMonitorRunning()) {
        _0x3144d8("xianyu-monitor", {
          type: "xianyu-monitor"
        });
      }
    } else {
      console.error("[Main] 闲鱼监控引擎未初始化");
    }
  });
  ipcMain.on("update-xianyu-monitor-config", (_0xc71239, _0x58ae16) => {
    const _0x530286 = _0x312572();
    if (_0x530286) {
      console.log("[Main] 收到闲鱼监控配置热更新");
      _0x530286.updateConfig(_0x58ae16);
    }
  });
  ipcMain.on("stop-xianyu-monitor", () => {
    const _0x47d7e5 = _0x312572();
    if (_0x47d7e5) {
      console.log("[Main] 停止闲鱼监控");
      _0x47d7e5.stop();
    }
    _0x1d810d("xianyu-monitor");
  });
  ipcMain.on("clear-xianyu-monitor-history", () => {
    const _0x46a9b5 = _0x312572();
    if (_0x46a9b5) {
      console.log("[Main] 清空闲鱼去重历史缓存");
      _0x46a9b5.history.clear();
      _0x46a9b5.saveHistory();
    }
  });
  ipcMain.handle("get-xianyu-monitor-status", async () => {
    const _0x4b0aae = _0x312572();
    if (_0x4b0aae) {
      return _0x4b0aae.getStatus();
    }
    return {
      running: false,
      config: null,
      nextCheck: "--"
    };
  });
  ipcMain.handle("get-xianyu-monitor-runtime-logs", async () => {
    const _0x1fe909 = _0x312572();
    if (_0x1fe909) {
      return _0x1fe909.getRuntimeLogs();
    }
    return [];
  });
  ipcMain.on("set-xianyu-monitor-preview-visible", (_0x1aa364, _0x1d066d) => {
    const _0x156ad8 = _0x312572();
    if (_0x156ad8) {
      _0x156ad8.setPreviewVisible(!!_0x1d066d);
    }
  });
  ipcMain.on("update-xianyu-monitor-preview-bounds", (_0x4a0d17, _0x300c05 = {}) => {
    const _0x273e3d = _0x312572();
    if (_0x273e3d) {
      _0x273e3d.setPreviewBounds(_0x300c05.bounds || _0x300c05);
    }
  });
}
module.exports = {
  registerXianyuIpc: registerXianyuIpc
};
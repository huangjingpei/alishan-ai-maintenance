'use strict';

const os = require("os");
const {
  app,
  ipcMain
} = require("electron");
const {
  calculateRecommendedConcurrentAccounts
} = require("../shared/systemPerformance");
function registerSystemPerformanceIpc(_0x54727f) {
  const {
    store: _0x46e8dc,
    appVersion: _0x1ac002,
    deviceId: _0x166642,
    maxPlatformAccounts: _0x511dc8,
    getMainWindow: _0x2fd704,
    getAutomationWindow: _0x34629b,
    getPlatformViews: _0x34dd83,
    getInteractionViewsMap: _0x57f0aa,
    getChatViewsMap: _0x42054f,
    getChatMonitorWindowsMap: _0x305bb4,
    getCreatorViewsMap: _0x2307a2,
    getActiveManualWindows: _0x865ceb,
    getBackgroundAutomationHostViews: _0x225da9
  } = _0x54727f;
  const _0x26898a = () => typeof _0x166642 === "function" ? _0x166642() : _0x166642;
  ipcMain.handle("get-version-info", () => {
    return {
      appVersion: _0x1ac002,
      extVersion: _0x46e8dc.get("local_ext_version", "原始版本"),
      isDevEdition: !app.isPackaged,
      deviceId: _0x26898a()
    };
  });
  function _0x2f1986(_0x4d3b1d) {
    if (!_0x4d3b1d || _0x4d3b1d.isDestroyed?.()) {
      return null;
    }
    try {
      if (typeof _0x4d3b1d.getOSProcessId === "function") {
        const _0x5a7025 = _0x4d3b1d.getOSProcessId();
        if (_0x5a7025 > 0) {
          return _0x5a7025;
        } else {
          return null;
        }
      }
      if (typeof _0x4d3b1d.getProcessId === "function") {
        const _0x1c3516 = _0x4d3b1d.getProcessId();
        if (_0x1c3516 > 0) {
          return _0x1c3516;
        } else {
          return null;
        }
      }
    } catch (_0x5b8bb7) {}
    return null;
  }
  function _0x2ba25e() {
    const _0x2aa7a2 = new Map();
    const _0x1ca275 = (_0x39d3f7, _0xfc5c82, _0x23c197) => {
      const _0x226801 = _0x2f1986(_0x39d3f7);
      if (!_0x226801) {
        return;
      }
      _0x2aa7a2.set(_0x226801, {
        category: _0xfc5c82,
        label: _0x23c197
      });
    };
    const _0x1f0858 = _0x2fd704();
    const _0x24c766 = _0x34629b();
    _0x1ca275(_0x1f0858?.webContents, "ui", "主界面");
    if (_0x24c766 && !_0x24c766.isDestroyed?.()) {
      _0x1ca275(_0x24c766.webContents, "ui", "独立实况窗口");
    }
    _0x34dd83().forEach((_0x5f33d6, _0x40bde0) => {
      _0x1ca275(_0x5f33d6?.webContents, "automation", _0x40bde0);
    });
    _0x57f0aa().forEach((_0x2f7a52, _0xea4381) => {
      _0x1ca275(_0x2f7a52?.webContents, "interaction", _0xea4381 + ":互动页");
    });
    _0x42054f().forEach((_0x66ca8, _0x3fe2b8) => {
      _0x1ca275(_0x66ca8?.webContents, "chat", _0x3fe2b8 + ":消息页");
    });
    _0x305bb4().forEach((_0x5eac9b, _0x7920e0) => {
      _0x1ca275(_0x5eac9b?.webContents, "chat", _0x7920e0 + ":消息后台检查");
    });
    _0x2307a2().forEach((_0x3a9eaa, _0x2db241) => {
      _0x1ca275(_0x3a9eaa?.webContents, "creator", _0x2db241 + ":创作页");
    });
    _0x865ceb().forEach((_0x558e51, _0x1bc384) => {
      _0x1ca275(_0x558e51?.webContents, "manual", _0x1bc384 + ":手动窗口");
    });
    return _0x2aa7a2;
  }
  ipcMain.handle("get-system-performance", async () => {
    const _0x1d1a9b = os.totalmem();
    const _0x14f8a4 = os.freemem();
    const _0x4efb45 = _0x1d1a9b - _0x14f8a4;
    const _0x5c96f6 = Math.round(_0x4efb45 / _0x1d1a9b * 100);
    const _0x27132c = os.cpus();
    const _0x5d3a49 = _0x27132c.length > 0 ? _0x27132c[0].model.trim() : "未知 CPU";
    const _0x2b9339 = _0x27132c.length;
    const _0x5a2d86 = () => {
      const _0x46d709 = os.cpus();
      return new Promise(_0x5c720b => {
        setTimeout(() => {
          const _0x2a538f = os.cpus();
          let _0x169f0a = 0;
          let _0x471357 = 0;
          for (let _0x48942c = 0; _0x48942c < _0x46d709.length; _0x48942c++) {
            const _0x4c8236 = _0x46d709[_0x48942c];
            const _0x5e3d71 = _0x2a538f[_0x48942c];
            const _0x3586ed = Object.values(_0x4c8236.times).reduce((_0x4c4001, _0x411a1f) => _0x4c4001 + _0x411a1f, 0);
            const _0xb2c428 = Object.values(_0x5e3d71.times).reduce((_0x523f38, _0x2d8232) => _0x523f38 + _0x2d8232, 0);
            _0x169f0a += _0xb2c428 - _0x3586ed;
            _0x471357 += _0x5e3d71.times.idle - _0x4c8236.times.idle;
          }
          const _0x2ed8d6 = _0x169f0a === 0 ? 0 : 1 - _0x471357 / _0x169f0a;
          _0x5c720b(Math.round(_0x2ed8d6 * 100));
        }, 200);
      });
    };
    const _0xcb5618 = await _0x5a2d86();
    const _0x5cc70b = os.loadavg();
    const _0x371ddf = _0x5cc70b.map(_0x4a41bb => _0x4a41bb.toFixed(2)).join(" / ");
    let _0x27d8eb = 0;
    let _0x1c05c9 = 0;
    let _0x236b22 = 0;
    let _0x537fd8 = 0;
    const _0x4fee26 = {
      browser: 0,
      renderer: 0,
      gpu: 0,
      utility: 0,
      other: 0
    };
    const _0x309f90 = {
      ui: 0,
      automation: 0,
      interaction: 0,
      chat: 0,
      manual: 0,
      other: 0
    };
    const _0x48e134 = [];
    let _0x58c37b = 0;
    try {
      const _0x522456 = app.getAppMetrics();
      const _0x1259d4 = _0x2ba25e();
      _0x236b22 = _0x522456.length;
      for (const _0x75a943 of _0x522456) {
        const _0x33de39 = _0x75a943.memory && _0x75a943.memory.workingSetSize ? Math.round(_0x75a943.memory.workingSetSize / 1024) : 0;
        if (_0x75a943.memory && _0x75a943.memory.workingSetSize) {
          _0x27d8eb += _0x75a943.memory.workingSetSize;
        }
        if (_0x33de39 > 0) {
          if (_0x75a943.type === "Browser") {
            _0x4fee26.browser += _0x33de39;
          } else if (_0x75a943.type === "Tab" || _0x75a943.type === "Renderer") {
            _0x4fee26.renderer += _0x33de39;
            _0x58c37b = Math.max(_0x58c37b, _0x33de39);
            const _0x52dae3 = _0x1259d4.get(_0x75a943.pid) || {
              category: "other",
              label: _0x75a943.type || "未归属页面"
            };
            const _0x226b6c = _0x309f90[_0x52dae3.category] === undefined ? "other" : _0x52dae3.category;
            _0x309f90[_0x226b6c] += _0x33de39;
            _0x48e134.push({
              pid: _0x75a943.pid || 0,
              category: _0x226b6c,
              label: _0x52dae3.label,
              memoryMb: _0x33de39
            });
          } else if (_0x75a943.type === "GPU") {
            _0x4fee26.gpu += _0x33de39;
          } else if (_0x75a943.type === "Utility") {
            _0x4fee26.utility += _0x33de39;
          } else {
            _0x4fee26.other += _0x33de39;
          }
        }
        if (_0x75a943.cpu && typeof _0x75a943.cpu.percentCPUUsage === "number") {
          _0x1c05c9 += _0x75a943.cpu.percentCPUUsage;
        }
        if (_0x75a943.type === "Tab" || _0x75a943.type === "Renderer") {
          _0x537fd8 += 1;
        }
      }
    } catch (_0xbc2020) {
      console.error("[Perf] 获取 App 性能指标失败:", _0xbc2020.message);
    }
    const _0x373612 = Math.round(_0x27d8eb / 1024);
    _0x48e134.sort((_0x264ab, _0x1c573e) => _0x1c573e.memoryMb - _0x264ab.memoryMb);
    const _0xbbbfce = Math.min(100, Math.round(_0x1c05c9 / (_0x2b9339 || 1)));
    const {
      recommendedConcurrentAccounts: _0x2d832d,
      performanceTier: _0x42ea9e
    } = calculateRecommendedConcurrentAccounts({
      totalMemBytes: _0x1d1a9b,
      cpuCores: _0x2b9339,
      maxAccounts: _0x511dc8
    });
    const _0x42bac3 = _0x2fd704();
    const _0x2be58e = _0x42bac3 && !_0x42bac3.isDestroyed() ? _0x42bac3.getBrowserViews().length : 0;
    const _0x25a684 = _0x2be58e + _0x225da9().length;
    const _0x460e5c = os.uptime();
    const _0x1fe9e2 = Math.floor(_0x460e5c / 3600);
    const _0x15b240 = Math.floor(_0x460e5c % 3600 / 60);
    let _0x2d27c3 = _0x15b240 + "分钟";
    if (_0x1fe9e2 > 0) {
      _0x2d27c3 = _0x1fe9e2 + "小时 " + _0x15b240 + "分钟";
    }
    const _0x2960ba = _0x34dd83();
    const _0x117e63 = _0x57f0aa();
    const _0x1bb489 = _0x42054f();
    const _0x325471 = _0x305bb4();
    const _0x315498 = _0x2307a2();
    const _0x36cf90 = _0x865ceb();
    return {
      success: true,
      cpuUsage: _0xcb5618,
      cpuModel: _0x5d3a49,
      cpuCores: _0x2b9339,
      memUsagePercent: _0x5c96f6,
      totalMemGB: (_0x1d1a9b / 1024 / 1024 / 1024).toFixed(1),
      usedMemGB: (_0x4efb45 / 1024 / 1024 / 1024).toFixed(1),
      loadAvg: _0x371ddf,
      appCpuUsage: _0xbbbfce,
      appMemory: _0x373612,
      appMemoryBreakdown: _0x4fee26,
      appRendererMemoryBreakdown: _0x309f90,
      rendererProcessDetails: _0x48e134.slice(0, 8),
      largestRendererMemoryMb: _0x58c37b,
      appProcessCount: _0x236b22,
      appRendererProcessCount: _0x537fd8,
      automationViewCount: _0x2960ba.size,
      interactionViewCount: _0x117e63.size,
      chatViewCount: _0x1bb489.size + _0x325471.size,
      chatMonitorViewCount: _0x325471.size,
      creatorViewCount: _0x315498.size,
      manualWindowCount: _0x36cf90.size,
      attachedViewCount: _0x25a684,
      recommendedConcurrentAccounts: _0x2d832d,
      performanceTier: _0x42ea9e,
      uptime: _0x2d27c3
    };
  });
  ipcMain.handle("get-recommended-concurrent-accounts", () => {
    try {
      const _0x28d111 = 4;
      const _0x57c715 = calculateRecommendedConcurrentAccounts({
        totalMemBytes: os.totalmem(),
        cpuCores: os.cpus().length,
        maxAccounts: Math.min(_0x28d111, _0x511dc8)
      });
      return {
        success: true,
        recommended: Math.min(_0x28d111, _0x57c715.recommendedConcurrentAccounts),
        cpuCores: _0x57c715.cpuCores,
        totalMemGB: _0x57c715.totalMemGB,
        performanceTier: _0x57c715.performanceTier
      };
    } catch (_0xb1b115) {
      console.error("[Main] get-recommended-concurrent-accounts failed:", _0xb1b115?.message || _0xb1b115);
      return {
        success: false,
        recommended: 1,
        cpuCores: 0,
        totalMemGB: 0,
        reason: _0xb1b115?.message || String(_0xb1b115)
      };
    }
  });
}
module.exports = {
  registerSystemPerformanceIpc: registerSystemPerformanceIpc
};
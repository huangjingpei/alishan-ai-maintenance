'use strict';

const os = require("os");
const {
  app,
  ipcMain
} = require("electron");
const {
  calculateRecommendedConcurrentAccounts
} = require("../shared/systemPerformance");
function registerSystemPerformanceIpc(arg1) {
  const {
    store: store,
    appVersion: appVersion,
    deviceId: deviceId,
    maxPlatformAccounts: maxPlatformAccounts,
    getMainWindow: getMainWindow,
    getAutomationWindow: getAutomationWindow,
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    getChatViewsMap: getChatViewsMap,
    getChatMonitorWindowsMap: getChatMonitorWindowsMap,
    getCreatorViewsMap: getCreatorViewsMap,
    getActiveManualWindows: getActiveManualWindows,
    getBackgroundAutomationHostViews: getBackgroundAutomationHostViews
  } = arg1;
  const local = () => typeof deviceId === "function" ? deviceId() : deviceId;
  ipcMain.handle("get-version-info", () => {
    return {
      appVersion: appVersion,
      extVersion: store.get("local_ext_version", "原始版本"),
      isDevEdition: !app.isPackaged,
      deviceId: local()
    };
  });
  function fn(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return null;
    }
    try {
      if (typeof arg1.getOSProcessId === "function") {
        const result = arg1.getOSProcessId();
        if (result > 0) {
          return result;
        } else {
          return null;
        }
      }
      if (typeof arg1.getProcessId === "function") {
        const result = arg1.getProcessId();
        if (result > 0) {
          return result;
        } else {
          return null;
        }
      }
    } catch (error) {}
    return null;
  }
  function fn2() {
    const map = new Map();
    const local = (arg1, arg2, arg3) => {
      const result = fn(arg1);
      if (!result) {
        return;
      }
      map.set(result, {
        category: arg2,
        label: arg3
      });
    };
    const result = getMainWindow();
    const result2 = getAutomationWindow();
    local(result?.webContents, "ui", "主界面");
    if (result2 && !result2.isDestroyed?.()) {
      local(result2.webContents, "ui", "独立实况窗口");
    }
    getPlatformViews().forEach((arg1, arg2) => {
      local(arg1?.webContents, "automation", arg2);
    });
    getInteractionViewsMap().forEach((arg1, arg2) => {
      local(arg1?.webContents, "interaction", arg2 + ":互动页");
    });
    getChatViewsMap().forEach((arg1, arg2) => {
      local(arg1?.webContents, "chat", arg2 + ":消息页");
    });
    getChatMonitorWindowsMap().forEach((arg1, arg2) => {
      local(arg1?.webContents, "chat", arg2 + ":消息后台检查");
    });
    getCreatorViewsMap().forEach((arg1, arg2) => {
      local(arg1?.webContents, "creator", arg2 + ":创作页");
    });
    getActiveManualWindows().forEach((arg1, arg2) => {
      local(arg1?.webContents, "manual", arg2 + ":手动窗口");
    });
    return map;
  }
  ipcMain.handle("get-system-performance", async () => {
    const result = os.totalmem();
    const result2 = os.freemem();
    const value = result - result2;
    const result3 = Math.round(value / result * 100);
    const result4 = os.cpus();
    const value2 = result4.length > 0 ? result4[0].model.trim() : "未知 CPU";
    const value3 = result4.length;
    const local = () => {
      const result = os.cpus();
      return new Promise(arg1 => {
        setTimeout(() => {
          const result2 = os.cpus();
          let num = 0;
          let num2 = 0;
          for (let num3 = 0; num3 < result.length; num3++) {
            const value = result[num3];
            const value2 = result2[num3];
            const result3 = Object.values(value.times).reduce((arg1, arg2) => arg1 + arg2, 0);
            const result4 = Object.values(value2.times).reduce((arg1, arg2) => arg1 + arg2, 0);
            num += result4 - result3;
            num2 += value2.times.idle - value.times.idle;
          }
          const value = num === 0 ? 0 : 1 - num2 / num;
          arg1(Math.round(value * 100));
        }, 200);
      });
    };
    const result5 = await local();
    const result6 = os.loadavg();
    const result7 = result6.map(arg1 => arg1.toFixed(2)).join(" / ");
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    const obj = {
      browser: 0,
      renderer: 0,
      gpu: 0,
      utility: 0,
      other: 0
    };
    const obj2 = {
      ui: 0,
      automation: 0,
      interaction: 0,
      chat: 0,
      manual: 0,
      other: 0
    };
    const list = [];
    let num5 = 0;
    try {
      const result = app.getAppMetrics();
      const result2 = fn2();
      num3 = result.length;
      for (const item of result) {
        const value = item.memory && item.memory.workingSetSize ? Math.round(item.memory.workingSetSize / 1024) : 0;
        if (item.memory && item.memory.workingSetSize) {
          num += item.memory.workingSetSize;
        }
        if (value > 0) {
          if (item.type === "Browser") {
            obj.browser += value;
          } else if (item.type === "Tab" || item.type === "Renderer") {
            obj.renderer += value;
            num5 = Math.max(num5, value);
            const local = result2.get(item.pid) || {
              category: "other",
              label: item.type || "未归属页面"
            };
            const value2 = obj2[local.category] === undefined ? "other" : local.category;
            obj2[value2] += value;
            list.push({
              pid: item.pid || 0,
              category: value2,
              label: local.label,
              memoryMb: value
            });
          } else if (item.type === "GPU") {
            obj.gpu += value;
          } else if (item.type === "Utility") {
            obj.utility += value;
          } else {
            obj.other += value;
          }
        }
        if (item.cpu && typeof item.cpu.percentCPUUsage === "number") {
          num2 += item.cpu.percentCPUUsage;
        }
        if (item.type === "Tab" || item.type === "Renderer") {
          num4 += 1;
        }
      }
    } catch (error) {
      console.error("[Perf] 获取 App 性能指标失败:", error.message);
    }
    const result8 = Math.round(num / 1024);
    list.sort((arg1, arg2) => arg2.memoryMb - arg1.memoryMb);
    const result9 = Math.min(100, Math.round(num2 / (value3 || 1)));
    const {
      recommendedConcurrentAccounts: recommendedConcurrentAccounts,
      performanceTier: performanceTier
    } = calculateRecommendedConcurrentAccounts({
      totalMemBytes: result,
      cpuCores: value3,
      maxAccounts: maxPlatformAccounts
    });
    const result10 = getMainWindow();
    const value4 = result10 && !result10.isDestroyed() ? result10.getBrowserViews().length : 0;
    const value5 = value4 + getBackgroundAutomationHostViews().length;
    const result11 = os.uptime();
    const result12 = Math.floor(result11 / 3600);
    const result13 = Math.floor(result11 % 3600 / 60);
    let value6 = result13 + "分钟";
    if (result12 > 0) {
      value6 = result12 + "小时 " + result13 + "分钟";
    }
    const result14 = getPlatformViews();
    const result15 = getInteractionViewsMap();
    const result16 = getChatViewsMap();
    const result17 = getChatMonitorWindowsMap();
    const result18 = getCreatorViewsMap();
    const result19 = getActiveManualWindows();
    return {
      success: true,
      cpuUsage: result5,
      cpuModel: value2,
      cpuCores: value3,
      memUsagePercent: result3,
      totalMemGB: (result / 1024 / 1024 / 1024).toFixed(1),
      usedMemGB: (value / 1024 / 1024 / 1024).toFixed(1),
      loadAvg: result7,
      appCpuUsage: result9,
      appMemory: result8,
      appMemoryBreakdown: obj,
      appRendererMemoryBreakdown: obj2,
      rendererProcessDetails: list.slice(0, 8),
      largestRendererMemoryMb: num5,
      appProcessCount: num3,
      appRendererProcessCount: num4,
      automationViewCount: result14.size,
      interactionViewCount: result15.size,
      chatViewCount: result16.size + result17.size,
      chatMonitorViewCount: result17.size,
      creatorViewCount: result18.size,
      manualWindowCount: result19.size,
      attachedViewCount: value5,
      recommendedConcurrentAccounts: recommendedConcurrentAccounts,
      performanceTier: performanceTier,
      uptime: value6
    };
  });
  ipcMain.handle("get-recommended-concurrent-accounts", () => {
    try {
      const num = 4;
      const result = calculateRecommendedConcurrentAccounts({
        totalMemBytes: os.totalmem(),
        cpuCores: os.cpus().length,
        maxAccounts: Math.min(num, maxPlatformAccounts)
      });
      return {
        success: true,
        recommended: Math.min(num, result.recommendedConcurrentAccounts),
        cpuCores: result.cpuCores,
        totalMemGB: result.totalMemGB,
        performanceTier: result.performanceTier
      };
    } catch (error) {
      console.error("[Main] get-recommended-concurrent-accounts failed:", error?.message || error);
      return {
        success: false,
        recommended: 1,
        cpuCores: 0,
        totalMemGB: 0,
        reason: error?.message || String(error)
      };
    }
  });
}
module.exports = {
  registerSystemPerformanceIpc: registerSystemPerformanceIpc
};
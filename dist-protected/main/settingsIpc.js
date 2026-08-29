'use strict';

const {
  ipcMain
} = require("electron");
function registerSettingsIpc({
  store: store,
  dbManager: dbManager,
  ACCOUNT_POOL_KEY: accountPoolKey,
  TASK_CONFIG_KEY: taskConfigKey,
  NURTURE_CONFIG_KEY: nurtureConfigKey,
  cleanupOldLogs: cleanupOldLogs,
  automationSessionCache: automationSessionCache,
  pruneElectronStoreBloat: pruneElectronStoreBloat,
  cleanupOrphanAutomationPartitions: cleanupOrphanAutomationPartitions,
  getUserDataPath: getUserDataPath,
  getAllWebContents: getAllWebContents,
  getPlatformViews: getPlatformViews,
  getInteractionViewsMap: getInteractionViewsMap,
  getActiveManualWindows: getActiveManualWindows,
  shouldRunChatMessageMonitor: shouldRunChatMessageMonitor,
  getChatNotificationMonitorGeneration: getChatNotificationMonitorGeneration,
  syncChatMonitorKeepalives: syncChatMonitorKeepalives
}) {
  ipcMain.handle("get-account-pool", async () => {
    try {
      const result = dbManager.getAccountPool();
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
    } catch (error) {}
    return store.get(accountPoolKey, []);
  });
  ipcMain.handle("save-account-pool", async (arg1, arg2) => {
    const value = Array.isArray(arg2) ? arg2 : [];
    try {
      const {
        generateFingerprintSeed: generateFingerprintSeed
      } = require("../shared/hardwareFingerprint");
      value.forEach(arg1 => {
        if (arg1 && typeof arg1 === "object") {
          if (!arg1.fingerprintPolicy) {
            arg1.fingerprintPolicy = "enabled";
            arg1.fingerprintSeed = generateFingerprintSeed();
            console.log("[Fingerprint] 新增账号已成功分配拟真设备指纹: " + (arg1.id || arg1.nickname || "?") + " (" + arg1.fingerprintSeed + ")");
          }
        }
      });
    } catch (error) {
      console.warn("[Fingerprint] 新账号分配指纹异常:", error.message);
    }
    try {
      dbManager.saveAccountPool(value);
    } catch (error) {
      console.warn("[DB] SQLite 账号池保存异常:", error.message);
    }
    const local = store.get("taskSettings") || {};
    store.set({
      [accountPoolKey]: value,
      taskSettings: {
        ...local,
        accounts: value
      }
    });
    if (shouldRunChatMessageMonitor()) {
      const result = getChatNotificationMonitorGeneration();
      const result2 = setTimeout(() => {
        syncChatMonitorKeepalives(result).catch(() => {});
      }, 800);
      result2.unref?.();
    }
    return true;
  });
  ipcMain.handle("get-task-config", async () => {
    return store.get(taskConfigKey, null);
  });
  ipcMain.handle("save-task-config", async (arg1, arg2) => {
    if (arg2 && typeof arg2 === "object") {
      store.set(taskConfigKey, arg2);
      if (Array.isArray(arg2.personas) && arg2.personas.length > 0) {
        try {
          dbManager.saveAiAgentsBatch(arg2.personas);
        } catch (error) {
          console.warn("[DB] SQLite 保存 AI 智能体失败:", error.message);
        }
      }
    }
    return true;
  });
  ipcMain.handle("get-ai-agents", async () => {
    try {
      const result = dbManager.getAiAgents();
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
    } catch (error) {}
    const local = store.get(taskConfigKey) || {};
    if (Array.isArray(local.personas)) {
      return local.personas;
    } else {
      return [];
    }
  });
  ipcMain.handle("save-ai-agents", async (arg1, arg2) => {
    const value = Array.isArray(arg2) ? arg2 : [];
    try {
      dbManager.saveAiAgentsBatch(value);
    } catch (error) {
      console.warn("[DB] SQLite 保存 AI 智能体失败:", error.message);
    }
    const local = store.get(taskConfigKey) || {};
    local.personas = value;
    store.set(taskConfigKey, local);
    return true;
  });
  ipcMain.handle("delete-ai-agent", async (arg1, arg2) => {
    if (!arg2) {
      return false;
    }
    try {
      dbManager.deleteAiAgent(arg2);
    } catch (error) {
      console.warn("[DB] SQLite 删除 AI 智能体 [" + arg2 + "] 失败:", error.message);
    }
    const local = store.get(taskConfigKey) || {};
    if (Array.isArray(local.personas)) {
      local.personas = local.personas.filter(arg1 => arg1.id !== arg2);
      store.set(taskConfigKey, local);
    }
    return true;
  });
  ipcMain.handle("get-nurture-config", async () => {
    return store.get(nurtureConfigKey, null);
  });
  ipcMain.handle("save-nurture-config", async (arg1, arg2) => {
    if (arg2 && typeof arg2 === "object") {
      store.set(nurtureConfigKey, arg2);
    }
    return true;
  });
  ipcMain.handle("clear-cache", async () => {
    try {
      const result = await automationSessionCache.clearKnownCaches({
        includeDefault: true
      });
      const result2 = cleanupOldLogs(7);
      console.log("[Main] 缓存与过期日志清理完成（Session " + result.cleared + "/" + result.total + "，运行中跳过 " + (result.skipped || 0) + "，" + ("超过 7 天日志 " + result2 + " 个）"));
      return {
        success: result.failed === 0,
        ...result,
        cleanedLogs: result2
      };
    } catch (error) {
      console.error("[Main] 清理缓存失败:", error);
      return {
        success: false,
        total: 0,
        cleared: 0,
        failed: 1,
        reason: error?.message || String(error)
      };
    }
  });
  ipcMain.handle("cleanup-idle-account-data", async () => {
    try {
      const value = typeof cleanupOrphanAutomationPartitions === "function" ? cleanupOrphanAutomationPartitions({
        userDataPath: typeof getUserDataPath === "function" ? getUserDataPath() : "",
        accountPool: store.get(accountPoolKey, []),
        getAllWebContents: typeof getAllWebContents === "function" ? getAllWebContents : () => []
      }) : {
        scanned: 0,
        deleted: 0,
        failed: 0
      };
      const value2 = typeof pruneElectronStoreBloat === "function" ? pruneElectronStoreBloat(store) : {
        changed: false
      };
      console.log("[Main] 闲置账号数据清理完成 partitionsDeleted=" + (value.deleted || 0) + ("/" + (value.scanned || 0) + " storeChanged=" + !!value2.changed));
      return {
        success: (value.failed || 0) === 0,
        partitions: value,
        storePrune: value2
      };
    } catch (error) {
      console.error("[Main] 清理闲置账号数据失败:", error);
      return {
        success: false,
        reason: error?.message || String(error),
        partitions: {
          scanned: 0,
          deleted: 0,
          failed: 1
        },
        storePrune: {
          changed: false
        }
      };
    }
  });
  ipcMain.handle("set-all-views-muted", async (arg1, arg2) => {
    try {
      console.log("[Main] 设置所有视图静音状态: " + arg2);
      for (const [local, local2] of getPlatformViews().entries()) {
        if (local2 && !local2.webContents.isDestroyed()) {
          local2.webContents.setAudioMuted(arg2);
          console.log("[Main] 视图 " + local + " 静音状态已设置为: " + arg2);
        }
      }
      for (const [local, local2] of getInteractionViewsMap().entries()) {
        if (local2 && !local2.webContents.isDestroyed()) {
          local2.webContents.setAudioMuted(arg2);
          console.log("[Main] 交互视图 " + local + " 静音状态已设置为: " + arg2);
        }
      }
      for (const [local, local2] of getActiveManualWindows().entries()) {
        if (local2 && !local2.isDestroyed() && !local2.webContents.isDestroyed()) {
          local2.webContents.setAudioMuted(arg2);
          console.log("[Main] 手动窗口 " + local + " 静音状态已设置为: " + arg2);
        }
      }
      store.set("system_video_muted", arg2);
      return true;
    } catch (error) {
      console.error("[Main] 设置静音状态失败:", error);
      return false;
    }
  });
}
module.exports = {
  registerSettingsIpc: registerSettingsIpc
};
'use strict';

const {
  ipcMain
} = require("electron");
function registerSettingsIpc({
  store: _0x5148b7,
  dbManager: _0x2da08a,
  ACCOUNT_POOL_KEY: _0x4066a9,
  TASK_CONFIG_KEY: _0x16f7c6,
  NURTURE_CONFIG_KEY: _0x1f8273,
  cleanupOldLogs: _0x1fb5b1,
  automationSessionCache: _0x3cbda8,
  pruneElectronStoreBloat: _0x524519,
  cleanupOrphanAutomationPartitions: _0x5d2b09,
  getUserDataPath: _0x265e31,
  getAllWebContents: _0x567d33,
  getPlatformViews: _0x1a87f4,
  getInteractionViewsMap: _0x1930cf,
  getActiveManualWindows: _0x4dba89,
  shouldRunChatMessageMonitor: _0x3ce1cb,
  getChatNotificationMonitorGeneration: _0x15f5e5,
  syncChatMonitorKeepalives: _0x588dd3
}) {
  ipcMain.handle("get-account-pool", async () => {
    try {
      const _0x19d934 = _0x2da08a.getAccountPool();
      if (Array.isArray(_0x19d934) && _0x19d934.length > 0) {
        return _0x19d934;
      }
    } catch (_0x17af49) {}
    return _0x5148b7.get(_0x4066a9, []);
  });
  ipcMain.handle("save-account-pool", async (_0x40d292, _0x1f151f) => {
    const _0x557b09 = Array.isArray(_0x1f151f) ? _0x1f151f : [];
    try {
      const {
        generateFingerprintSeed: _0x18f538
      } = require("../shared/hardwareFingerprint");
      _0x557b09.forEach(_0x21392b => {
        if (_0x21392b && typeof _0x21392b === "object") {
          if (!_0x21392b.fingerprintPolicy) {
            _0x21392b.fingerprintPolicy = "enabled";
            _0x21392b.fingerprintSeed = _0x18f538();
            console.log("[Fingerprint] 新增账号已成功分配拟真设备指纹: " + (_0x21392b.id || _0x21392b.nickname || "?") + " (" + _0x21392b.fingerprintSeed + ")");
          }
        }
      });
    } catch (_0x349443) {
      console.warn("[Fingerprint] 新账号分配指纹异常:", _0x349443.message);
    }
    try {
      _0x2da08a.saveAccountPool(_0x557b09);
    } catch (_0x35b061) {
      console.warn("[DB] SQLite 账号池保存异常:", _0x35b061.message);
    }
    const _0x5d3aca = _0x5148b7.get("taskSettings") || {};
    _0x5148b7.set({
      [_0x4066a9]: _0x557b09,
      taskSettings: {
        ..._0x5d3aca,
        accounts: _0x557b09
      }
    });
    if (_0x3ce1cb()) {
      const _0x155af2 = _0x15f5e5();
      const _0x5bf1f7 = setTimeout(() => {
        _0x588dd3(_0x155af2).catch(() => {});
      }, 800);
      _0x5bf1f7.unref?.();
    }
    return true;
  });
  ipcMain.handle("get-task-config", async () => {
    return _0x5148b7.get(_0x16f7c6, null);
  });
  ipcMain.handle("save-task-config", async (_0x402a9f, _0x21cf10) => {
    if (_0x21cf10 && typeof _0x21cf10 === "object") {
      _0x5148b7.set(_0x16f7c6, _0x21cf10);
      if (Array.isArray(_0x21cf10.personas) && _0x21cf10.personas.length > 0) {
        try {
          _0x2da08a.saveAiAgentsBatch(_0x21cf10.personas);
        } catch (_0x58afcc) {
          console.warn("[DB] SQLite 保存 AI 智能体失败:", _0x58afcc.message);
        }
      }
    }
    return true;
  });
  ipcMain.handle("get-ai-agents", async () => {
    try {
      const _0x404815 = _0x2da08a.getAiAgents();
      if (Array.isArray(_0x404815) && _0x404815.length > 0) {
        return _0x404815;
      }
    } catch (_0x6b06d) {}
    const _0x57609c = _0x5148b7.get(_0x16f7c6) || {};
    if (Array.isArray(_0x57609c.personas)) {
      return _0x57609c.personas;
    } else {
      return [];
    }
  });
  ipcMain.handle("save-ai-agents", async (_0xfed3c3, _0x4d0ddd) => {
    const _0x585587 = Array.isArray(_0x4d0ddd) ? _0x4d0ddd : [];
    try {
      _0x2da08a.saveAiAgentsBatch(_0x585587);
    } catch (_0x3206e3) {
      console.warn("[DB] SQLite 保存 AI 智能体失败:", _0x3206e3.message);
    }
    const _0x317fa6 = _0x5148b7.get(_0x16f7c6) || {};
    _0x317fa6.personas = _0x585587;
    _0x5148b7.set(_0x16f7c6, _0x317fa6);
    return true;
  });
  ipcMain.handle("delete-ai-agent", async (_0x135e26, _0xcab35c) => {
    if (!_0xcab35c) {
      return false;
    }
    try {
      _0x2da08a.deleteAiAgent(_0xcab35c);
    } catch (_0x4434ea) {
      console.warn("[DB] SQLite 删除 AI 智能体 [" + _0xcab35c + "] 失败:", _0x4434ea.message);
    }
    const _0x1adcaa = _0x5148b7.get(_0x16f7c6) || {};
    if (Array.isArray(_0x1adcaa.personas)) {
      _0x1adcaa.personas = _0x1adcaa.personas.filter(_0x1ec2fe => _0x1ec2fe.id !== _0xcab35c);
      _0x5148b7.set(_0x16f7c6, _0x1adcaa);
    }
    return true;
  });
  ipcMain.handle("get-nurture-config", async () => {
    return _0x5148b7.get(_0x1f8273, null);
  });
  ipcMain.handle("save-nurture-config", async (_0x26fa5c, _0x5b8f54) => {
    if (_0x5b8f54 && typeof _0x5b8f54 === "object") {
      _0x5148b7.set(_0x1f8273, _0x5b8f54);
    }
    return true;
  });
  ipcMain.handle("clear-cache", async () => {
    try {
      const _0x27de08 = await _0x3cbda8.clearKnownCaches({
        includeDefault: true
      });
      const _0x23cbd7 = _0x1fb5b1(7);
      console.log("[Main] 缓存与过期日志清理完成（Session " + _0x27de08.cleared + "/" + _0x27de08.total + "，运行中跳过 " + (_0x27de08.skipped || 0) + "，" + ("超过 7 天日志 " + _0x23cbd7 + " 个）"));
      return {
        success: _0x27de08.failed === 0,
        ..._0x27de08,
        cleanedLogs: _0x23cbd7
      };
    } catch (_0x30d722) {
      console.error("[Main] 清理缓存失败:", _0x30d722);
      return {
        success: false,
        total: 0,
        cleared: 0,
        failed: 1,
        reason: _0x30d722?.message || String(_0x30d722)
      };
    }
  });
  ipcMain.handle("cleanup-idle-account-data", async () => {
    try {
      const _0x280e41 = typeof _0x5d2b09 === "function" ? _0x5d2b09({
        userDataPath: typeof _0x265e31 === "function" ? _0x265e31() : "",
        accountPool: _0x5148b7.get(_0x4066a9, []),
        getAllWebContents: typeof _0x567d33 === "function" ? _0x567d33 : () => []
      }) : {
        scanned: 0,
        deleted: 0,
        failed: 0
      };
      const _0x2ac381 = typeof _0x524519 === "function" ? _0x524519(_0x5148b7) : {
        changed: false
      };
      console.log("[Main] 闲置账号数据清理完成 partitionsDeleted=" + (_0x280e41.deleted || 0) + ("/" + (_0x280e41.scanned || 0) + " storeChanged=" + !!_0x2ac381.changed));
      return {
        success: (_0x280e41.failed || 0) === 0,
        partitions: _0x280e41,
        storePrune: _0x2ac381
      };
    } catch (_0x2cd72d) {
      console.error("[Main] 清理闲置账号数据失败:", _0x2cd72d);
      return {
        success: false,
        reason: _0x2cd72d?.message || String(_0x2cd72d),
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
  ipcMain.handle("set-all-views-muted", async (_0x3673dc, _0x5a4f37) => {
    try {
      console.log("[Main] 设置所有视图静音状态: " + _0x5a4f37);
      for (const [_0x22d4ef, _0x1885db] of _0x1a87f4().entries()) {
        if (_0x1885db && !_0x1885db.webContents.isDestroyed()) {
          _0x1885db.webContents.setAudioMuted(_0x5a4f37);
          console.log("[Main] 视图 " + _0x22d4ef + " 静音状态已设置为: " + _0x5a4f37);
        }
      }
      for (const [_0xd00220, _0x7669b4] of _0x1930cf().entries()) {
        if (_0x7669b4 && !_0x7669b4.webContents.isDestroyed()) {
          _0x7669b4.webContents.setAudioMuted(_0x5a4f37);
          console.log("[Main] 交互视图 " + _0xd00220 + " 静音状态已设置为: " + _0x5a4f37);
        }
      }
      for (const [_0x39f4be, _0x30ac57] of _0x4dba89().entries()) {
        if (_0x30ac57 && !_0x30ac57.isDestroyed() && !_0x30ac57.webContents.isDestroyed()) {
          _0x30ac57.webContents.setAudioMuted(_0x5a4f37);
          console.log("[Main] 手动窗口 " + _0x39f4be + " 静音状态已设置为: " + _0x5a4f37);
        }
      }
      _0x5148b7.set("system_video_muted", _0x5a4f37);
      return true;
    } catch (_0x476307) {
      console.error("[Main] 设置静音状态失败:", _0x476307);
      return false;
    }
  });
}
module.exports = {
  registerSettingsIpc: registerSettingsIpc
};
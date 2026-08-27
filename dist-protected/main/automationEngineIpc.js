'use strict';

const {
  ipcMain
} = require("electron");
const {
  resolveDouyinSpecifiedUrlsText
} = require("../shared/resolveDouyinShareUrl");
function createAutomationEngineIpc(_0x285423) {
  const {
    getMainWindow: _0x2b2edf,
    getPlatformViews: _0x99d631,
    getViewSettingsMap: _0x341da2,
    getPendingRestartByViewKey: _0x1eb911,
    getIsBatchActionRunningMap: _0x83fde5,
    getIsCurrentUserFree: _0x23ff2a,
    getActiveSettings: _0x36073a,
    setActiveSettings: _0x2919ee,
    ensureRuntimeConfigReadyForTask: _0x3eff6f,
    runtimeConfigBlockReason: _0x356a3e,
    runtimeConfig: _0x1d090f,
    removeSpecificVideosFromProcessedStore: _0x3bab82,
    getProcessedVideoUrlsForSettings: _0x2149ad,
    injectInteractedUsers: _0x5a8c98,
    ensureXianyuAccess: _0x107a8d,
    isBatchViewRuntimeActive: _0x1be7a3,
    syncAutomationRuntimeGuard: _0x72b561,
    reconcileActiveSettings: _0x176763,
    incrementTaskStats: _0x4dda87,
    appendHistory: _0x339e68,
    trackInteractions: _0x2ca5ea,
    addToReportQueue: _0x2e0e55,
    syncRadarDouyinAccountsToBackend: _0x2900ad,
    cancelPendingAutomationViewDestroy: _0x459a8a,
    initAutomationView: _0x554475,
    resolveActiveBatchRunId: _0x5f3794,
    appendBatchFollowLog: _0x14c7ad,
    resolveViewKeyFromSender: _0x13c7c6,
    isEntityLeadgenAccountBusy = null,
    isVideoMonitorAccountBusy = null
  } = _0x285423;
  function _0x5e0ee1(_0x258f0c, _0x51a5b1) {
    (async () => {
      try {
        if (_0x23ff2a()) {
          const _0x576762 = _0x51a5b1?.taskMode || "interaction";
          const _0x1146f1 = _0x576762 === "nurture" ? "当前未激活专业版，请激活专业版后使用养号功能" : "当前未激活专业版，请激活专业版后使用获客任务";
          console.warn("[Auth-Shield] 拦截未激活状态启动任务 mode=" + _0x576762);
          const _0xb09e66 = _0x2b2edf();
          if (_0xb09e66 && !_0xb09e66.isDestroyed()) {
            _0xb09e66.webContents.send("task-start-rejected", {
              viewKey: _0x51a5b1?.viewKey,
              taskId: _0x51a5b1?.taskId,
              taskMode: _0x576762,
              reason: _0x1146f1
            });
          }
          return;
        }
        const _0x45bdee = await _0x3eff6f({
          allowDialogRetry: true
        });
        if (!_0x45bdee.ok) {
          const _0x5a80f9 = _0x45bdee.reason || _0x356a3e;
          console.warn("[RuntimeConfig] 拦截启动：运行配置未就绪或不完整");
          const _0x1f5893 = _0x2b2edf();
          if (_0x1f5893 && !_0x1f5893.isDestroyed()) {
            try {
              _0x1f5893.webContents.send("new-status", "[WARN] " + _0x5a80f9);
            } catch (_0x4adb65) {}
            _0x1f5893.webContents.send("task-start-rejected", {
              viewKey: _0x51a5b1?.viewKey || (_0x51a5b1?.accountId ? (_0x51a5b1?.platform || "douyin") + "_" + _0x51a5b1.accountId : _0x51a5b1?.platform),
              taskId: _0x51a5b1?.taskId,
              taskMode: _0x51a5b1?.taskMode || "interaction",
              reason: _0x5a80f9
            });
          }
          return;
        }
        _0x1d090f.broadcast();
        if (_0x51a5b1.taskMode === "scrape") {
          _0x51a5b1.enableLike = false;
          _0x51a5b1.enableComment = false;
          _0x51a5b1.enableFollow = false;
          _0x51a5b1.enableDM = false;
          _0x51a5b1.enableWarmup = false;
          console.log("[Scrape-Shield] 启动时已硬熔断点赞/评论/关注/私信/预热配置");
        }
        if (_0x51a5b1.taskMode === "nurture") {
          _0x51a5b1.enableLike = false;
          _0x51a5b1.enableComment = false;
          _0x51a5b1.enableFollow = false;
          _0x51a5b1.enableDM = false;
          _0x51a5b1.enableWarmup = false;
          _0x51a5b1.enableVideoComment = false;
          _0x51a5b1.aiReplyMode = false;
          _0x51a5b1.videoSources = ["recommend"];
          console.log("[Nurture-Shield] 养号模式：已禁用全部获客互动");
        }
        _0x2919ee(_0x51a5b1);
        const _0x3635f0 = _0x51a5b1.platform || "douyin";
        console.log("[Main] 收到启动任务请求: Platform=" + _0x3635f0 + ", Mode=" + (_0x51a5b1.taskMode || "interaction") + ", AccountId=" + (_0x51a5b1.accountId || "default"));
        const _0x86f316 = Array.isArray(_0x51a5b1.locationFilterRegions) ? _0x51a5b1.locationFilterRegions.filter(Boolean) : [];
        if (_0x86f316.length) {
          console.log("[Main] 地区过滤: mode=" + (_0x51a5b1.locationFilterMode || "include") + " regions=" + JSON.stringify(_0x86f316));
        }
        const _0x45e643 = _0x51a5b1.accountId ? _0x3635f0 + "_" + _0x51a5b1.accountId : _0x3635f0;
        _0x459a8a(_0x45e643);
        try {
          const _0x1fe133 = String(_0x51a5b1.accountId || "").trim();
          if (_0x1fe133 && typeof isEntityLeadgenAccountBusy === "function" && isEntityLeadgenAccountBusy(_0x1fe133)) {
            const _0x46301d = "该账号正在线索采集，请先停止线索采集后再启动评论获客";
            console.warn("[Main] 拒绝启动: " + _0x45e643 + " 线索采集占用中");
            const _0x2ec654 = _0x2b2edf();
            if (_0x2ec654 && !_0x2ec654.isDestroyed()) {
              try {
                _0x2ec654.webContents.send("new-status", "[WARN] " + _0x46301d);
              } catch (_0x57a8a0) {}
              _0x2ec654.webContents.send("task-start-rejected", {
                viewKey: _0x45e643,
                taskId: _0x51a5b1?.taskId,
                taskMode: _0x51a5b1?.taskMode || "interaction",
                reason: _0x46301d
              });
            }
            return;
          }
          if (_0x1fe133 && typeof isVideoMonitorAccountBusy === "function" && isVideoMonitorAccountBusy(_0x1fe133)) {
            const _0x4379bf = "该账号正在监控任务中，请先停止监控后再启动评论获客";
            console.warn("[Main] 拒绝启动: " + _0x45e643 + " 监控任务占用中");
            const _0x41c41d = _0x2b2edf();
            if (_0x41c41d && !_0x41c41d.isDestroyed()) {
              try {
                _0x41c41d.webContents.send("new-status", "[WARN] " + _0x4379bf);
              } catch (_0xea215e) {}
              _0x41c41d.webContents.send("task-start-rejected", {
                viewKey: _0x45e643,
                taskId: _0x51a5b1?.taskId,
                taskMode: _0x51a5b1?.taskMode || "interaction",
                reason: _0x4379bf
              });
            }
            return;
          }
        } catch (_0x2077ee) {}
        if (_0x51a5b1.isRestart) {
          _0x1eb911().set(_0x45e643, true);
          const _0x19feff = (_0x51a5b1.videoSources || []).includes("specific");
          if (_0x19feff && _0x51a5b1.specifiedUrls) {
            const _0xcbf66 = _0x3bab82(_0x51a5b1.specifiedUrls);
            console.log("[Main] 重启指定视频：已从浏览库移除 " + _0xcbf66 + " 条记录 viewKey=" + _0x45e643);
          }
          console.log("[Main] 标记账号重启: " + _0x45e643 + " taskId=" + _0x51a5b1.taskId);
        }
        delete _0x51a5b1.isRestart;
        const _0x525572 = _0x341da2().get(_0x45e643);
        if (_0x525572?.taskId && _0x525572.taskId !== _0x51a5b1.taskId) {
          const _0x389df8 = _0x525572.taskMode || "interaction";
          const _0x4eda19 = _0x51a5b1.taskMode || "interaction";
          let _0x3bf6f3 = "该账号已有任务正在运行，请先停止后再启动新的任务";
          if (_0x389df8 === "nurture") {
            _0x3bf6f3 = "该账号正在养号，请先停止养号";
          } else if (_0x4eda19 === "nurture") {
            _0x3bf6f3 = "该账号正在获客，请先停止获客任务";
          } else if (_0x389df8 !== _0x4eda19) {
            _0x3bf6f3 = "该账号正在执行其它任务，请先停止后再启动";
          }
          console.warn("[Main] 拒绝启动: " + _0x45e643 + " 已有 " + _0x389df8 + " 任务 taskId=" + _0x525572.taskId);
          const _0x1cfc7c = _0x2b2edf();
          if (_0x1cfc7c) {
            _0x1cfc7c.webContents.send("task-start-rejected", {
              viewKey: _0x45e643,
              taskId: _0x51a5b1.taskId,
              taskMode: _0x4eda19,
              reason: _0x3bf6f3
            });
          }
          return;
        }
        if (_0x83fde5().get(_0x45e643)) {
          console.warn("[Main] 拒绝启动任务: 视图 " + _0x45e643 + " 正在执行批量互动任务");
          const _0x1e3318 = _0x2b2edf();
          if (_0x1e3318) {
            _0x1e3318.webContents.send("new-status", "[WARN] 批量互动进行中，请先停止后再启动任务");
          }
          if (_0x1e3318) {
            _0x1e3318.webContents.send("task-start-rejected", {
              viewKey: _0x45e643,
              taskId: _0x51a5b1.taskId,
              taskMode: _0x51a5b1.taskMode || "interaction",
              reason: "批量互动进行中，请稍后再试"
            });
          }
          return;
        }
        _0x5a8c98(_0x51a5b1);
        if (_0x51a5b1.taskMode === "nurture") {
          _0x51a5b1.processedVideos = [];
          console.log("[Main] 养号模式：跳过浏览视频库注入");
        } else {
          _0x51a5b1.processedVideos = _0x2149ad(_0x51a5b1, _0x45e643);
          console.log("[Main] 注入已浏览视频记录 " + _0x51a5b1.processedVideos.length + " 条");
        }
        _0x51a5b1.specifiedUrls &&= await resolveDouyinSpecifiedUrlsText(_0x51a5b1.specifiedUrls);
        _0x554475(_0x51a5b1, _0x3635f0);
      } catch (_0x24e2e4) {
        console.error("[Main] 启动任务失败:", _0x24e2e4);
      }
    })();
  }
  function _0x2399da(_0x49d92b, _0x3b6b9e) {
    try {
      const _0xc6e568 = _0x3b6b9e.platform || "douyin";
      if (_0xc6e568 === "xianyu" && !_0x107a8d()) {
        return;
      }
      const _0x33138b = _0x3b6b9e.accountId ? _0xc6e568 + "_" + _0x3b6b9e.accountId : _0xc6e568;
      _0x459a8a(_0x33138b);
      if (_0x1be7a3(_0x33138b)) {
        console.log("[Main] 批量任务运行中，跳过 init-automation-view: " + _0x33138b);
        return;
      }
      const _0x11decb = _0x341da2().get(_0x33138b);
      if (_0x11decb?.taskId) {
        console.log("[Main] 账号任务运行中，拒绝 init-automation-view（避免重载打断并行任务）: " + _0x33138b + " taskId=" + _0x11decb.taskId);
        return;
      }
      _0x341da2().delete(_0x33138b);
      _0x72b561(_0x33138b, null);
      console.log("[Main] 初始化视图（仅预热，已清除旧任务配置）: " + _0x33138b);
      _0x554475(_0x3b6b9e, _0xc6e568);
    } catch (_0x13b8f6) {
      console.error("[Main] 初始化视图失败:", _0x13b8f6);
    }
  }
  function _0x160167(_0x49b395, _0x34fa11) {
    const _0x10d0c5 = _0x49b395.sender;
    let _0x39dc84 = null;
    _0x99d631().forEach((_0x45f96c, _0x47324a) => {
      if (_0x45f96c.webContents === _0x10d0c5) {
        _0x39dc84 = _0x47324a;
      }
    });
    if (_0x39dc84) {
      console.log("[Main] 账号识别成功: " + _0x39dc84 + ", 昵称: " + _0x34fa11.name + (_0x34fa11.douyinId ? ", 抖音号: " + _0x34fa11.douyinId : ""));
      const _0x95ef82 = _0x341da2();
      _0x95ef82.set(_0x39dc84 + "_nickname", _0x34fa11.name);
      if (_0x34fa11.douyinId) {
        _0x95ef82.set(_0x39dc84 + "_douyinId", _0x34fa11.douyinId);
      }
      if (_0x34fa11.userUrl) {
        _0x95ef82.set(_0x39dc84 + "_userUrl", _0x34fa11.userUrl);
      }
      const _0xe5f3ce = _0x2b2edf();
      if (_0xe5f3ce) {
        _0xe5f3ce.webContents.send("account-updated", {
          viewKey: _0x39dc84,
          nickname: _0x34fa11.name,
          douyinId: _0x34fa11.douyinId || "",
          userUrl: _0x34fa11.userUrl || "",
          status: "online"
        });
      }
      const _0x45972c = _0x39dc84.split("_");
      const _0x3002e9 = _0x45972c[0];
      const _0x5b9a5d = _0x45972c.slice(1).join("_");
      if (_0x3002e9 === "douyin" && _0x5b9a5d) {
        _0x2900ad([{
          clientAccountId: _0x5b9a5d,
          remarkName: "",
          nickname: _0x34fa11.name || "",
          douyinId: _0x34fa11.douyinId || "",
          userUrl: _0x34fa11.userUrl || "",
          proxy: "",
          status: "online",
          loginAt: new Date().toISOString()
        }]).catch(() => {});
      }
    }
  }
  function _0x129454(_0x3d6284) {
    const _0x1dbcdc = _0x3d6284.sender;
    let _0x4d74b4 = null;
    _0x99d631().forEach((_0xe92bf5, _0x244052) => {
      if (_0xe92bf5.webContents === _0x1dbcdc) {
        _0x4d74b4 = _0x244052;
      }
    });
    if (_0x4d74b4) {
      console.warn("[Main] 账号识别超时: " + _0x4d74b4);
      const _0x34672a = _0x2b2edf();
      if (_0x34672a) {
        _0x34672a.webContents.send("account-updated", {
          viewKey: _0x4d74b4,
          status: "offline"
        });
      }
    }
  }
  function _0x2f6da0(_0x14aaf2) {
    const _0x55e427 = _0x14aaf2.sender;
    let _0x3b7d91 = null;
    _0x99d631().forEach((_0x2024be, _0x2378ff) => {
      if (_0x2024be.webContents === _0x55e427) {
        _0x3b7d91 = _0x2378ff;
      }
    });
    const _0x1d5c22 = _0x2b2edf();
    if (_0x3b7d91 && _0x1d5c22) {
      _0x1d5c22.webContents.send("account-updated", {
        viewKey: _0x3b7d91,
        status: "verifying"
      });
    }
  }
  function _0x2c3247(_0x568420, _0x559ddd) {
    const _0x42303f = _0x2b2edf();
    if (_0x42303f) {
      _0x42303f.webContents.send("new-status", _0x559ddd.msg);
    }
  }
  function _0x125792(_0x4c4e23, _0x7de2d1) {
    const _0x13d54b = _0x2b2edf();
    if (_0x13d54b) {
      const _0x2fb349 = Array.isArray(_0x7de2d1.payload) ? _0x7de2d1.payload : [_0x7de2d1.payload];
      const _0x2384bc = _0x99d631();
      const _0x16a8b6 = _0x341da2();
      const _0x51f04b = _0x7de2d1.viewKey || [..._0x2384bc.entries()].find(([_0x133813, _0x4a1133]) => _0x4a1133.webContents === _0x4c4e23.sender)?.[0] || _0x13c7c6(_0x4c4e23.sender);
      if (_0x7de2d1.type === "trace-log") {
        const _0x3cd3c5 = String(_0x7de2d1.payload?.message || "");
        if (_0x3cd3c5.includes("🔍[主评")) {
          const _0x58d921 = _0x7de2d1.payload?.accountId || _0x16a8b6.get(_0x51f04b)?.accountId || "?";
          console.log("[Main][主评轨迹] view=" + (_0x51f04b || "?") + " account=" + _0x58d921 + " " + _0x3cd3c5.slice(0, 120));
        }
        const _0x21c6a6 = _0x5f3794(_0x51f04b, _0x7de2d1.payload?.runId ?? _0x7de2d1.payload?.batchRunId);
        if (_0x21c6a6 != null && _0x3cd3c5) {
          _0x14c7ad(_0x21c6a6, {
            message: _0x3cd3c5,
            level: _0x7de2d1.payload?.level || "normal",
            accountId: _0x7de2d1.payload?.accountId || _0x16a8b6.get(_0x51f04b)?.accountId || "",
            viewKey: _0x51f04b || "",
            phase: "trace"
          });
        }
      }
      if (_0x7de2d1.type === "security-challenge") {
        const _0x58c959 = _0x5f3794(_0x51f04b, _0x7de2d1.payload?.runId ?? _0x7de2d1.payload?.batchRunId);
        if (_0x58c959 != null) {
          const _0x44d02d = _0x7de2d1.payload?.accountId || _0x16a8b6.get(_0x51f04b)?.accountId || "";
          const _0x11dd88 = _0x7de2d1.payload?.message || "⚠️ 检测到安全验证/滑块弹窗，任务已自动暂停！请在本账号窗口手动完成后继续";
          _0x14c7ad(_0x58c959, {
            message: _0x11dd88,
            level: "warn",
            accountId: _0x44d02d,
            viewKey: _0x51f04b || "",
            phase: "security"
          });
        }
      }
      if (_0x7de2d1.type === "video-processed" || _0x7de2d1.type === "keyword-changed" || _0x7de2d1.type === "interaction-progress" || _0x7de2d1.type === "interaction-total-progress" || _0x7de2d1.type === "status" || _0x7de2d1.type === "current-action" || _0x7de2d1.type === "trace-log" || _0x7de2d1.type === "security-challenge" || _0x7de2d1.type === "security-challenge-cleared") {
        _0x13d54b.webContents.send("automation-data", _0x7de2d1);
      } else {
        _0x2fb349.forEach(_0x24623a => {
          _0x13d54b.webContents.send("automation-data", {
            type: "comment",
            payload: _0x24623a,
            checkpointAction: _0x7de2d1.checkpointAction || ""
          });
        });
      }
      const _0xb80825 = _0x51f04b ? _0x16a8b6.get(_0x51f04b) : _0x36073a();
      const _0x2107e3 = _0x7de2d1.taskId || _0xb80825?.taskId || "unknown_task";
      const _0x4156f9 = _0x7de2d1.taskName || _0xb80825?.taskName || "未命名任务";
      if (_0x7de2d1.type === "video-processed") {
        _0x4dda87(_0x2107e3, {
          videoTotal: 1
        }, {
          taskName: _0x4156f9,
          platform: _0xb80825?.platform || _0x7de2d1.platform || "DY",
          accountName: _0xb80825?.nickname || _0xb80825?.name || _0x7de2d1.accountName || "未知账号"
        });
      } else if (_0x7de2d1.type === "comment") {
        const _0x2347aa = !!_0x7de2d1.checkpointAction && (_0x7de2d1.isMonitorAction === true || String(_0x2107e3 || "").startsWith("MONITOR"));
        if (!_0x2347aa) {
          _0x339e68(_0x2fb349, _0x2107e3, _0x4156f9);
        }
      }
      if (_0x7de2d1.type === "action" || _0x2fb349.some(_0x4fe153 => _0x4fe153.actions?.liked || _0x4fe153.actions?.replied || _0x4fe153.actions?.followed || _0x4fe153.actions?.messaged || Number(_0x4fe153.touchCounts?.like || 0) > 0 || Number(_0x4fe153.touchCounts?.reply || 0) > 0 || Number(_0x4fe153.touchCounts?.profileComment || 0) > 0 || Number(_0x4fe153.touchCounts?.follow || 0) > 0 || Number(_0x4fe153.touchCounts?.message || 0) > 0)) {
        _0x2ca5ea(_0x2fb349);
      }
      if (!_0x7de2d1.isAiMode) {
        _0x2e0e55(_0x2fb349, _0x51f04b);
      } else {
        _0x2e0e55(_0x2fb349.map(_0x495c3f => ({
          ..._0x495c3f,
          isAiMode: true
        })), _0x51f04b);
      }
    }
  }
  function _0x535ddb(_0x2ac964) {
    _0x176763();
    const _0x4ec625 = _0x36073a();
    if (_0x4ec625) {
      _0x2ac964.sender.send("control-task", {
        type: "START_TASK",
        payload: _0x4ec625
      });
    }
  }
  function _0x1fea79() {
    ipcMain.on("start-task", _0x5e0ee1);
    ipcMain.on("init-automation-view", _0x2399da);
    ipcMain.on("account-logged-in", _0x160167);
    ipcMain.on("account-login-failed", _0x129454);
    ipcMain.on("account-login-verify", _0x2f6da0);
    ipcMain.on("automation-status", _0x2c3247);
    ipcMain.on("automation-data", _0x125792);
    ipcMain.on("get-active-task", _0x535ddb);
  }
  return {
    handleStartTask: _0x5e0ee1,
    handleInitAutomationView: _0x2399da,
    handleAccountLoggedIn: _0x160167,
    handleAccountLoginFailed: _0x129454,
    handleAccountLoginVerify: _0x2f6da0,
    handleAutomationStatus: _0x2c3247,
    handleAutomationData: _0x125792,
    handleGetActiveTask: _0x535ddb,
    registerIpc: _0x1fea79
  };
}
module.exports = {
  createAutomationEngineIpc: createAutomationEngineIpc
};
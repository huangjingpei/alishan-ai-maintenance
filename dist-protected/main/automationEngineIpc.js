'use strict';

const {
  ipcMain
} = require("electron");
const {
  resolveDouyinSpecifiedUrlsText
} = require("../shared/resolveDouyinShareUrl");
function createAutomationEngineIpc(arg1) {
  const {
    getMainWindow: getMainWindow,
    getPlatformViews: getPlatformViews,
    getViewSettingsMap: getViewSettingsMap,
    getPendingRestartByViewKey: getPendingRestartByViewKey,
    getIsBatchActionRunningMap: getIsBatchActionRunningMap,
    getIsCurrentUserFree: getIsCurrentUserFree,
    getActiveSettings: getActiveSettings,
    setActiveSettings: setActiveSettings,
    ensureRuntimeConfigReadyForTask: ensureRuntimeConfigReadyForTask,
    runtimeConfigBlockReason: runtimeConfigBlockReason,
    runtimeConfig: runtimeConfig,
    removeSpecificVideosFromProcessedStore: removeSpecificVideosFromProcessedStore,
    getProcessedVideoUrlsForSettings: getProcessedVideoUrlsForSettings,
    injectInteractedUsers: injectInteractedUsers,
    ensureXianyuAccess: ensureXianyuAccess,
    isBatchViewRuntimeActive: isBatchViewRuntimeActive,
    syncAutomationRuntimeGuard: syncAutomationRuntimeGuard,
    reconcileActiveSettings: reconcileActiveSettings,
    incrementTaskStats: incrementTaskStats,
    appendHistory: appendHistory,
    trackInteractions: trackInteractions,
    addToReportQueue: addToReportQueue,
    syncRadarDouyinAccountsToBackend: syncRadarDouyinAccountsToBackend,
    cancelPendingAutomationViewDestroy: cancelPendingAutomationViewDestroy,
    initAutomationView: initAutomationView,
    resolveActiveBatchRunId: resolveActiveBatchRunId,
    appendBatchFollowLog: appendBatchFollowLog,
    resolveViewKeyFromSender: resolveViewKeyFromSender,
    isEntityLeadgenAccountBusy = null,
    isVideoMonitorAccountBusy = null
  } = arg1;
  function handleStartTask(arg1, arg2) {
    (async () => {
      try {
        if (getIsCurrentUserFree()) {
          const local = arg2?.taskMode || "interaction";
          const value = local === "nurture" ? "当前未激活专业版，请激活专业版后使用养号功能" : "当前未激活专业版，请激活专业版后使用获客任务";
          console.warn("[Auth-Shield] 拦截未激活状态启动任务 mode=" + local);
          const result = getMainWindow();
          if (result && !result.isDestroyed()) {
            result.webContents.send("task-start-rejected", {
              viewKey: arg2?.viewKey,
              taskId: arg2?.taskId,
              taskMode: local,
              reason: value
            });
          }
          return;
        }
        const result = await ensureRuntimeConfigReadyForTask({
          allowDialogRetry: true
        });
        if (!result.ok) {
          const local = result.reason || runtimeConfigBlockReason;
          console.warn("[RuntimeConfig] 拦截启动：运行配置未就绪或不完整");
          const result2 = getMainWindow();
          if (result2 && !result2.isDestroyed()) {
            try {
              result2.webContents.send("new-status", "[WARN] " + local);
            } catch (error) {}
            result2.webContents.send("task-start-rejected", {
              viewKey: arg2?.viewKey || (arg2?.accountId ? (arg2?.platform || "douyin") + "_" + arg2.accountId : arg2?.platform),
              taskId: arg2?.taskId,
              taskMode: arg2?.taskMode || "interaction",
              reason: local
            });
          }
          return;
        }
        runtimeConfig.broadcast();
        if (arg2.taskMode === "scrape") {
          arg2.enableLike = false;
          arg2.enableComment = false;
          arg2.enableFollow = false;
          arg2.enableDM = false;
          arg2.enableWarmup = false;
          console.log("[Scrape-Shield] 启动时已硬熔断点赞/评论/关注/私信/预热配置");
        }
        if (arg2.taskMode === "nurture") {
          arg2.enableLike = false;
          arg2.enableComment = false;
          arg2.enableFollow = false;
          arg2.enableDM = false;
          arg2.enableWarmup = false;
          arg2.enableVideoComment = false;
          arg2.aiReplyMode = false;
          arg2.videoSources = ["recommend"];
          console.log("[Nurture-Shield] 养号模式：已禁用全部获客互动");
        }
        setActiveSettings(arg2);
        const local = arg2.platform || "douyin";
        console.log("[Main] 收到启动任务请求: Platform=" + local + ", Mode=" + (arg2.taskMode || "interaction") + ", AccountId=" + (arg2.accountId || "default"));
        const value = Array.isArray(arg2.locationFilterRegions) ? arg2.locationFilterRegions.filter(Boolean) : [];
        if (value.length) {
          console.log("[Main] 地区过滤: mode=" + (arg2.locationFilterMode || "include") + " regions=" + JSON.stringify(value));
        }
        const value2 = arg2.accountId ? local + "_" + arg2.accountId : local;
        cancelPendingAutomationViewDestroy(value2);
        try {
          const result = String(arg2.accountId || "").trim();
          if (result && typeof isEntityLeadgenAccountBusy === "function" && isEntityLeadgenAccountBusy(result)) {
            const text = "该账号正在线索采集，请先停止线索采集后再启动评论获客";
            console.warn("[Main] 拒绝启动: " + value2 + " 线索采集占用中");
            const result = getMainWindow();
            if (result && !result.isDestroyed()) {
              try {
                result.webContents.send("new-status", "[WARN] " + text);
              } catch (error) {}
              result.webContents.send("task-start-rejected", {
                viewKey: value2,
                taskId: arg2?.taskId,
                taskMode: arg2?.taskMode || "interaction",
                reason: text
              });
            }
            return;
          }
          if (result && typeof isVideoMonitorAccountBusy === "function" && isVideoMonitorAccountBusy(result)) {
            const text = "该账号正在监控任务中，请先停止监控后再启动评论获客";
            console.warn("[Main] 拒绝启动: " + value2 + " 监控任务占用中");
            const result = getMainWindow();
            if (result && !result.isDestroyed()) {
              try {
                result.webContents.send("new-status", "[WARN] " + text);
              } catch (error) {}
              result.webContents.send("task-start-rejected", {
                viewKey: value2,
                taskId: arg2?.taskId,
                taskMode: arg2?.taskMode || "interaction",
                reason: text
              });
            }
            return;
          }
        } catch (error) {}
        if (arg2.isRestart) {
          getPendingRestartByViewKey().set(value2, true);
          const result = (arg2.videoSources || []).includes("specific");
          if (result && arg2.specifiedUrls) {
            const result = removeSpecificVideosFromProcessedStore(arg2.specifiedUrls);
            console.log("[Main] 重启指定视频：已从浏览库移除 " + result + " 条记录 viewKey=" + value2);
          }
          console.log("[Main] 标记账号重启: " + value2 + " taskId=" + arg2.taskId);
        }
        delete arg2.isRestart;
        const result2 = getViewSettingsMap().get(value2);
        if (result2?.taskId && result2.taskId !== arg2.taskId) {
          const local = result2.taskMode || "interaction";
          const local2 = arg2.taskMode || "interaction";
          let text = "该账号已有任务正在运行，请先停止后再启动新的任务";
          if (local === "nurture") {
            text = "该账号正在养号，请先停止养号";
          } else if (local2 === "nurture") {
            text = "该账号正在获客，请先停止获客任务";
          } else if (local !== local2) {
            text = "该账号正在执行其它任务，请先停止后再启动";
          }
          console.warn("[Main] 拒绝启动: " + value2 + " 已有 " + local + " 任务 taskId=" + result2.taskId);
          const result = getMainWindow();
          if (result) {
            result.webContents.send("task-start-rejected", {
              viewKey: value2,
              taskId: arg2.taskId,
              taskMode: local2,
              reason: text
            });
          }
          return;
        }
        if (getIsBatchActionRunningMap().get(value2)) {
          console.warn("[Main] 拒绝启动任务: 视图 " + value2 + " 正在执行批量互动任务");
          const result = getMainWindow();
          if (result) {
            result.webContents.send("new-status", "[WARN] 批量互动进行中，请先停止后再启动任务");
          }
          if (result) {
            result.webContents.send("task-start-rejected", {
              viewKey: value2,
              taskId: arg2.taskId,
              taskMode: arg2.taskMode || "interaction",
              reason: "批量互动进行中，请稍后再试"
            });
          }
          return;
        }
        injectInteractedUsers(arg2);
        if (arg2.taskMode === "nurture") {
          arg2.processedVideos = [];
          console.log("[Main] 养号模式：跳过浏览视频库注入");
        } else {
          arg2.processedVideos = getProcessedVideoUrlsForSettings(arg2, value2);
          console.log("[Main] 注入已浏览视频记录 " + arg2.processedVideos.length + " 条");
        }
        arg2.specifiedUrls &&= await resolveDouyinSpecifiedUrlsText(arg2.specifiedUrls);
        initAutomationView(arg2, local);
      } catch (error) {
        console.error("[Main] 启动任务失败:", error);
      }
    })();
  }
  function handleInitAutomationView(arg1, arg2) {
    try {
      const local = arg2.platform || "douyin";
      if (local === "xianyu" && !ensureXianyuAccess()) {
        return;
      }
      const value = arg2.accountId ? local + "_" + arg2.accountId : local;
      cancelPendingAutomationViewDestroy(value);
      if (isBatchViewRuntimeActive(value)) {
        console.log("[Main] 批量任务运行中，跳过 init-automation-view: " + value);
        return;
      }
      const result = getViewSettingsMap().get(value);
      if (result?.taskId) {
        console.log("[Main] 账号任务运行中，拒绝 init-automation-view（避免重载打断并行任务）: " + value + " taskId=" + result.taskId);
        return;
      }
      getViewSettingsMap().delete(value);
      syncAutomationRuntimeGuard(value, null);
      console.log("[Main] 初始化视图（仅预热，已清除旧任务配置）: " + value);
      initAutomationView(arg2, local);
    } catch (error) {
      console.error("[Main] 初始化视图失败:", error);
    }
  }
  function handleAccountLoggedIn(arg1, arg2) {
    const value = arg1.sender;
    let local = null;
    getPlatformViews().forEach((arg1, arg2) => {
      if (arg1.webContents === value) {
        local = arg2;
      }
    });
    if (local) {
      console.log("[Main] 账号识别成功: " + local + ", 昵称: " + arg2.name + (arg2.douyinId ? ", 抖音号: " + arg2.douyinId : ""));
      const result = getViewSettingsMap();
      result.set(local + "_nickname", arg2.name);
      if (arg2.douyinId) {
        result.set(local + "_douyinId", arg2.douyinId);
      }
      if (arg2.userUrl) {
        result.set(local + "_userUrl", arg2.userUrl);
      }
      const result2 = getMainWindow();
      if (result2) {
        result2.webContents.send("account-updated", {
          viewKey: local,
          nickname: arg2.name,
          douyinId: arg2.douyinId || "",
          userUrl: arg2.userUrl || "",
          status: "online"
        });
      }
      const result3 = local.split("_");
      const value = result3[0];
      const result4 = result3.slice(1).join("_");
      if (value === "douyin" && result4) {
        syncRadarDouyinAccountsToBackend([{
          clientAccountId: result4,
          remarkName: "",
          nickname: arg2.name || "",
          douyinId: arg2.douyinId || "",
          userUrl: arg2.userUrl || "",
          proxy: "",
          status: "online",
          loginAt: new Date().toISOString()
        }]).catch(() => {});
      }
    }
  }
  function handleAccountLoginFailed(arg1) {
    const value = arg1.sender;
    let local = null;
    getPlatformViews().forEach((arg1, arg2) => {
      if (arg1.webContents === value) {
        local = arg2;
      }
    });
    if (local) {
      console.warn("[Main] 账号识别超时: " + local);
      const result = getMainWindow();
      if (result) {
        result.webContents.send("account-updated", {
          viewKey: local,
          status: "offline"
        });
      }
    }
  }
  function handleAccountLoginVerify(arg1) {
    const value = arg1.sender;
    let local = null;
    getPlatformViews().forEach((arg1, arg2) => {
      if (arg1.webContents === value) {
        local = arg2;
      }
    });
    const result = getMainWindow();
    if (local && result) {
      result.webContents.send("account-updated", {
        viewKey: local,
        status: "verifying"
      });
    }
  }
  function handleAutomationStatus(arg1, arg2) {
    const result = getMainWindow();
    if (result) {
      result.webContents.send("new-status", arg2.msg);
    }
  }
  function handleAutomationData(arg1, arg2) {
    const result = getMainWindow();
    if (result) {
      const value = Array.isArray(arg2.payload) ? arg2.payload : [arg2.payload];
      const result2 = getPlatformViews();
      const result3 = getViewSettingsMap();
      const local = arg2.viewKey || [...result2.entries()].find(([arg12, arg13]) => arg13.webContents === arg1.sender)?.[0] || resolveViewKeyFromSender(arg1.sender);
      if (arg2.type === "trace-log") {
        const result = String(arg2.payload?.message || "");
        if (result.includes("🔍[主评")) {
          const local2 = arg2.payload?.accountId || result3.get(local)?.accountId || "?";
          console.log("[Main][主评轨迹] view=" + (local || "?") + " account=" + local2 + " " + result.slice(0, 120));
        }
        const result2 = resolveActiveBatchRunId(local, arg2.payload?.runId ?? arg2.payload?.batchRunId);
        if (result2 != null && result) {
          appendBatchFollowLog(result2, {
            message: result,
            level: arg2.payload?.level || "normal",
            accountId: arg2.payload?.accountId || result3.get(local)?.accountId || "",
            viewKey: local || "",
            phase: "trace"
          });
        }
      }
      if (arg2.type === "security-challenge") {
        const result = resolveActiveBatchRunId(local, arg2.payload?.runId ?? arg2.payload?.batchRunId);
        if (result != null) {
          const local2 = arg2.payload?.accountId || result3.get(local)?.accountId || "";
          const local3 = arg2.payload?.message || "⚠️ 检测到安全验证/滑块弹窗，任务已自动暂停！请在本账号窗口手动完成后继续";
          appendBatchFollowLog(result, {
            message: local3,
            level: "warn",
            accountId: local2,
            viewKey: local || "",
            phase: "security"
          });
        }
      }
      if (arg2.type === "video-processed" || arg2.type === "keyword-changed" || arg2.type === "interaction-progress" || arg2.type === "interaction-total-progress" || arg2.type === "status" || arg2.type === "current-action" || arg2.type === "trace-log" || arg2.type === "security-challenge" || arg2.type === "security-challenge-cleared") {
        result.webContents.send("automation-data", arg2);
      } else {
        value.forEach(arg1 => {
          result.webContents.send("automation-data", {
            type: "comment",
            payload: arg1,
            checkpointAction: arg2.checkpointAction || ""
          });
        });
      }
      const value2 = local ? result3.get(local) : getActiveSettings();
      const local2 = arg2.taskId || value2?.taskId || "unknown_task";
      const local3 = arg2.taskName || value2?.taskName || "未命名任务";
      if (arg2.type === "video-processed") {
        incrementTaskStats(local2, {
          videoTotal: 1
        }, {
          taskName: local3,
          platform: value2?.platform || arg2.platform || "DY",
          accountName: value2?.nickname || value2?.name || arg2.accountName || "未知账号"
        });
      } else if (arg2.type === "comment") {
        const local = !!arg2.checkpointAction && (arg2.isMonitorAction === true || String(local2 || "").startsWith("MONITOR"));
        if (!local) {
          appendHistory(value, local2, local3);
        }
      }
      if (arg2.type === "action" || value.some(arg1 => arg1.actions?.liked || arg1.actions?.replied || arg1.actions?.followed || arg1.actions?.messaged || Number(arg1.touchCounts?.like || 0) > 0 || Number(arg1.touchCounts?.reply || 0) > 0 || Number(arg1.touchCounts?.profileComment || 0) > 0 || Number(arg1.touchCounts?.follow || 0) > 0 || Number(arg1.touchCounts?.message || 0) > 0)) {
        trackInteractions(value);
      }
      if (!arg2.isAiMode) {
        addToReportQueue(value, local);
      } else {
        addToReportQueue(value.map(arg1 => ({
          ...arg1,
          isAiMode: true
        })), local);
      }
    }
  }
  function handleGetActiveTask(arg1) {
    reconcileActiveSettings();
    const result = getActiveSettings();
    if (result) {
      arg1.sender.send("control-task", {
        type: "START_TASK",
        payload: result
      });
    }
  }
  function registerIpc() {
    ipcMain.on("start-task", handleStartTask);
    ipcMain.on("init-automation-view", handleInitAutomationView);
    ipcMain.on("account-logged-in", handleAccountLoggedIn);
    ipcMain.on("account-login-failed", handleAccountLoginFailed);
    ipcMain.on("account-login-verify", handleAccountLoginVerify);
    ipcMain.on("automation-status", handleAutomationStatus);
    ipcMain.on("automation-data", handleAutomationData);
    ipcMain.on("get-active-task", handleGetActiveTask);
  }
  return {
    handleStartTask: handleStartTask,
    handleInitAutomationView: handleInitAutomationView,
    handleAccountLoggedIn: handleAccountLoggedIn,
    handleAccountLoginFailed: handleAccountLoginFailed,
    handleAccountLoginVerify: handleAccountLoginVerify,
    handleAutomationStatus: handleAutomationStatus,
    handleAutomationData: handleAutomationData,
    handleGetActiveTask: handleGetActiveTask,
    registerIpc: registerIpc
  };
}
module.exports = {
  createAutomationEngineIpc: createAutomationEngineIpc
};
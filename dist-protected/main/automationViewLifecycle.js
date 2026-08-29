'use strict';

const {
  app,
  BrowserView
} = require("electron");
const {
  handleStripFrameBlockingHeaders
} = require("./stripFrameBlockingHeaders");
const TASK_FINISH_IDLE_DESTROY_DELAY_MS = 180000;
const INTERACTION_VIEW_IDLE_CLEANUP_MS = 8000;
const BATCH_INTERACTION_VIEW_IDLE_CLEANUP_MS = 2000;
const VIEW_RECOVERY_COOLDOWN_MS = 45000;
const AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS = 3;
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
function createAutomationViewLifecycle(arg1) {
  const {
    getMainWindow: getMainWindow,
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    getInteractionLocksMap: getInteractionLocksMap,
    getViewSettingsMap: getViewSettingsMap,
    getBoundsStateByViewKey: getBoundsStateByViewKey,
    getPendingAutomationWebContentsClose: getPendingAutomationWebContentsClose,
    getPendingBatchByViewKey: getPendingBatchByViewKey,
    getIsBatchActionRunningMap: getIsBatchActionRunningMap,
    getViewActiveBatchRunMap: getViewActiveBatchRunMap,
    getLastInteractionFinishedAtByViewKey: getLastInteractionFinishedAtByViewKey,
    getPendingRestartByViewKey: getPendingRestartByViewKey,
    getAutomationViewsVisible: getAutomationViewsVisible,
    getVisibleAutomationViewKeys: getVisibleAutomationViewKeys,
    getIsCurrentUserFree: getIsCurrentUserFree,
    isAutomationViewKey: isAutomationViewKey,
    isMonitorTaskViewRunning: isMonitorTaskViewRunning,
    isBatchViewRuntimeActive: isBatchViewRuntimeActive,
    appendDiagnosticsLog: appendDiagnosticsLog,
    requestAutomationLayoutRefresh: requestAutomationLayoutRefresh,
    getActiveAutomationSettings: getActiveAutomationSettings,
    clearBatchWaitTickersForView: clearBatchWaitTickersForView,
    releaseBatchRuntimeGuardIfIdle: releaseBatchRuntimeGuardIfIdle,
    syncAutomationRuntimeGuard: syncAutomationRuntimeGuard,
    completeBatchFromInteraction: completeBatchFromInteraction,
    writeLog: writeLog,
    leadgenTasksApi: leadgenTasksApi,
    extractDouyinVideoId: extractDouyinVideoId,
    configureAutomationSession: configureAutomationSession,
    configureXianyuSession: configureXianyuSession,
    attachProtocolGuard: attachProtocolGuard,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath,
    applyAccountProxy: applyAccountProxy,
    getProcessedVideoUrlsForSettings: getProcessedVideoUrlsForSettings,
    injectInteractedUsers: injectInteractedUsers,
    scheduleAutomationSessionCacheCheck: scheduleAutomationSessionCacheCheck,
    store: store,
    runtimeConfig: runtimeConfig,
    automationUserAgent: automationUserAgent,
    maxPlatformAccounts: maxPlatformAccounts,
    ensureAutomationPaintWatchdog: ensureAutomationPaintWatchdog,
    stopAutomationPaintWatchdogIfIdle: stopAutomationPaintWatchdogIfIdle,
    maybeDestroyBackgroundAutomationHostWindow: maybeDestroyBackgroundAutomationHostWindow,
    removeAutomationViewFromBackgroundHost: removeAutomationViewFromBackgroundHost,
    clearBackgroundAutomationState: clearBackgroundAutomationState,
    isBackgroundAutomationHidden: isBackgroundAutomationHidden,
    cancelBackgroundInteractionForView: cancelBackgroundInteractionForView,
    shouldAttachAutomationView: shouldAttachAutomationView,
    shouldKeepAutomationViewAttached: shouldKeepAutomationViewAttached,
    parkAutomationViewInMainWindow: parkAutomationViewInMainWindow,
    enterBackgroundDetachedMode: enterBackgroundDetachedMode,
    safeSetTopBrowserView: safeSetTopBrowserView,
    nudgeAutomationViewRepaint: nudgeAutomationViewRepaint,
    restoreForegroundAutomationRendering: restoreForegroundAutomationRendering,
    restoreMainWindowUiFocus: restoreMainWindowUiFocus,
    buildCompactBackgroundAutomationBounds: buildCompactBackgroundAutomationBounds,
    isValidAutomationBounds: isValidAutomationBounds,
    countPlatformAutomationViews: countPlatformAutomationViews,
    attachMainAutomationView: attachMainAutomationView,
    realignActiveChatViewBoundsAfterAutomationClose: realignActiveChatViewBoundsAfterAutomationClose
  } = arg1;
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const map5 = new Map();
  const map6 = new Map();
  const list = [];
  let local = null;
  function cancelPendingAutomationViewDestroy(arg1) {
    const result = map5.get(arg1);
    if (!result) {
      return false;
    }
    clearTimeout(result);
    map5.delete(arg1);
    console.log("[Main] 已取消待销毁视图计划: " + arg1);
    return true;
  }
  function cancelInteractionViewIdleCleanup(arg1) {
    const result = map6.get(arg1);
    if (!result) {
      return false;
    }
    clearTimeout(result);
    map6.delete(arg1);
    return true;
  }
  function scheduleDestroyAutomationView(arg1, arg2, options = {}) {
    cancelPendingAutomationViewDestroy(arg1);
    const result = setTimeout(() => {
      map5.delete(arg1);
      if (isBatchViewRuntimeActive(arg1)) {
        console.log("[Main] 跳过延迟销毁（批量任务仍在运行）: " + arg1);
        return;
      }
      if (getViewSettingsMap().has(arg1)) {
        console.log("[Main] 跳过延迟销毁（账号已重新启动）: " + arg1);
        return;
      }
      if (isMonitorTaskViewRunning(arg1)) {
        console.log("[Main] 跳过延迟销毁（监控任务仍在运行）: " + arg1);
        return;
      }
      const result = getVisibleAutomationViewKeys();
      if (getAutomationViewsVisible() && (!result || result.has(arg1))) {
        console.log("[Main] 跳过延迟销毁（实况画面仍打开）: " + arg1);
        return;
      }
      if (!getPlatformViews().has(arg1) && !getInteractionViewsMap().has(arg1)) {
        return;
      }
      destroyAutomationView(arg1, options);
    }, Math.max(0, arg2));
    if (typeof result.unref === "function") {
      result.unref();
    }
    map5.set(arg1, result);
  }
  function scheduleIdleFinishedViewDestroy(arg1, {
    reason = "task_completed_idle",
    settingsSnapshot = null,
    skipHeavyRepaint = false,
    delayMs = TASK_FINISH_IDLE_DESTROY_DELAY_MS
  } = {}) {
    if (!isAutomationViewKey(arg1)) {
      return false;
    }
    if (!getPlatformViews().has(arg1) && !getInteractionViewsMap().has(arg1)) {
      return false;
    }
    if (isBatchViewRuntimeActive(arg1)) {
      return false;
    }
    if (getViewSettingsMap().has(arg1)) {
      return false;
    }
    if (isMonitorTaskViewRunning(arg1)) {
      return false;
    }
    const result = getVisibleAutomationViewKeys();
    if (getAutomationViewsVisible() && (!result || result.has(arg1))) {
      return false;
    }
    scheduleDestroyAutomationView(arg1, delayMs, {
      reason: reason,
      finalizeTask: false,
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    console.log("[Main] 已计划 " + Math.round(delayMs / 1000) + "s 后释放已完成任务的预览视图: " + arg1);
    return true;
  }
  function fn6(arg1) {
    if (local || list.length === 0) {
      return;
    }
    const value = Number.isFinite(arg1) ? arg1 : process.platform === "darwin" ? 1200 : 180;
    local = setTimeout(() => {
      local = null;
      const result = list.shift();
      if (!result) {
        return;
      }
      const {
        webContents: webContents,
        viewKey: viewKey,
        label: label
      } = result;
      try {
        if (!webContents.isDestroyed()) {
          try {
            if (webContents.debugger?.isAttached?.()) {
              webContents.debugger.detach();
            }
          } catch (error) {}
          webContents.close({
            waitForBeforeUnload: false
          });
        }
        console.log("[Main] 自动化视图已安全关闭: " + viewKey + " (" + label + ")");
      } catch (error) {
        console.warn("[Main] webContents.close(" + label + "/" + viewKey + ") 失败: " + error.message);
      } finally {
        getPendingAutomationWebContentsClose().delete(webContents);
        result.view = null;
      }
      maybeDestroyBackgroundAutomationHostWindow();
      realignActiveChatViewBoundsAfterAutomationClose();
      if (list.length > 0) {
        fn6(process.platform === "darwin" ? 500 : 100);
      }
    }, Math.max(0, value));
    if (typeof local.unref === "function") {
      local.unref();
    }
  }
  function enqueueAutomationBrowserViewClose(arg1, arg2, arg3) {
    const local = arg1?.webContents;
    const result = getPendingAutomationWebContentsClose();
    if (!local || local.isDestroyed() || result.has(local)) {
      return;
    }
    result.add(local);
    try {
      local.setAudioMuted(true);
    } catch (error) {}
    try {
      local.setFrameRate(1);
    } catch (error) {}
    list.push({
      view: arg1,
      webContents: local,
      viewKey: arg2,
      label: arg3
    });
    fn6();
  }
  function destroyAutomationBrowserView(arg1, arg2, text = "main") {
    if (!arg1) {
      return;
    }
    const result = getMainWindow();
    try {
      if (result && !result.isDestroyed() && result.getBrowserViews().includes(arg1)) {
        result.removeBrowserView(arg1);
      }
    } catch (error) {
      console.warn("[Main] removeBrowserView(" + text + "/" + arg2 + ") 失败: " + error.message);
    }
    try {
      removeAutomationViewFromBackgroundHost(arg1);
    } catch (error) {
      console.warn("[Main] removeBackgroundBrowserView(" + text + "/" + arg2 + ") 失败: " + error.message);
    }
    enqueueAutomationBrowserViewClose(arg1, arg2, text);
    maybeDestroyBackgroundAutomationHostWindow();
  }
  function finalizeStoppedAutomationTask(arg1, text = "manual_stop") {
    const result = getMainWindow();
    if (!arg1?.taskId || !result || result.isDestroyed()) {
      return;
    }
    if (arg1.taskMode === "nurture") {
      result.webContents.send("nurture-task-finished", {
        taskId: arg1.taskId,
        accountId: arg1.accountId,
        reason: text
      });
      return;
    }
    try {
      const result2 = leadgenTasksApi.finalizeTaskRun(arg1.taskId, {
        reason: text,
        accountId: arg1.accountId,
        progress: {}
      });
      if (result2) {
        result.webContents.send("leadgen-task-record-updated", result2);
      }
    } catch (error) {
      console.warn("[Main] 停止任务落盘失败:", error.message);
    }
    result.webContents.send("leadgen-task-finished", {
      taskId: arg1.taskId,
      accountId: arg1.accountId,
      reason: text,
      progress: {}
    });
  }
  function destroyAutomationView(arg1, {
    reason = "manual_stop",
    finalizeTask = true,
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    if (!isAutomationViewKey(arg1)) {
      return false;
    }
    const local = reason === "manual_stop" || reason === "task_stopped" || reason === "app_quit";
    if (isMonitorTaskViewRunning(arg1) && !local) {
      console.log("[Main] 拦截并阻止非手动停止的销毁动作: " + arg1 + " (" + reason + ")");
      return false;
    }
    cancelPendingAutomationViewDestroy(arg1);
    cancelInteractionViewIdleCleanup(arg1);
    const result = getViewSettingsMap();
    const result2 = getInteractionViewsMap();
    const result3 = getInteractionLocksMap();
    const result4 = getPlatformViews();
    const local2 = settingsSnapshot || result.get(arg1) || null;
    const result5 = result3.get(arg1);
    if (result5?.timer) {
      clearTimeout(result5.timer);
    }
    if (result5?.taskDispatchTimer) {
      clearTimeout(result5.taskDispatchTimer);
    }
    if (result5?.profileOpenTimer) {
      clearTimeout(result5.profileOpenTimer);
    }
    if (result5?.loadListener) {
      const result = result2.get(arg1);
      try {
        result?.webContents?.removeListener("did-finish-load", result5.loadListener);
      } catch (error) {}
    }
    result3.delete(arg1);
    getPendingBatchByViewKey().delete(arg1);
    getIsBatchActionRunningMap().delete(arg1);
    getViewActiveBatchRunMap().delete(arg1);
    clearBatchWaitTickersForView(arg1);
    cancelBackgroundInteractionForView(arg1, "view_stopped");
    releaseBatchRuntimeGuardIfIdle();
    const result6 = result2.get(arg1);
    destroyAutomationBrowserView(result6, arg1, "interaction");
    result2.delete(arg1);
    const result7 = result4.get(arg1);
    destroyAutomationBrowserView(result7, arg1, "main");
    result4.delete(arg1);
    result.delete(arg1);
    syncAutomationRuntimeGuard(arg1, null);
    result.delete(arg1 + "_name");
    result.delete(arg1 + "_platform");
    result.delete(arg1 + "_douyinId");
    map3.delete(arg1);
    getBoundsStateByViewKey().delete(arg1);
    map2.delete(arg1);
    clearAutomationLoadRecovery(arg1);
    getPendingRestartByViewKey().delete(arg1);
    clearBackgroundAutomationState(arg1);
    stopAutomationPaintWatchdogIfIdle();
    const local3 = local2?.accountId || null;
    const local4 = local2?.taskId || null;
    const result8 = getMainWindow();
    if (result8 && !result8.isDestroyed()) {
      const value = getActiveAutomationSettings().length;
      result8.webContents.send("automation-view-closed", {
        viewKey: arg1,
        accountId: local3,
        taskId: local4,
        reason: reason,
        taskMode: local2?.taskMode || "leadgen",
        siblingCount: value
      });
      if (value > 0) {
        console.log("[Main] automation-view-closed " + arg1 + "，另有 " + value + " 个账号运行中（不触发全量布局刷新: " + skipHeavyRepaint + "）");
      }
    }
    if (finalizeTask && local2) {
      finalizeStoppedAutomationTask(local2, reason);
    }
    console.log("[Main] 已停止并摘除自动化视图: " + arg1 + " (" + reason + ")");
    try {
      scheduleAutomationSessionCacheCheck?.(arg1);
    } catch (error) {}
    requestAutomationLayoutRefresh({
      light: skipHeavyRepaint
    });
    return true;
  }
  function releaseAutomationInteraction(arg1, text = "stop") {
    if (getInteractionLocksMap().has(arg1)) {
      finishInteraction(arg1, {
        error: text
      }, text);
      return true;
    }
    const result = getPlatformViews().get(arg1);
    if (result && !isValidAutomationBounds(result.getBounds()) && !isBackgroundAutomationHidden(arg1)) {
      return recoverMainAutomationView(arg1, null, {
        force: true
      });
    }
    return false;
  }
  function preserveAutomationViewAfterTaskFinish(arg1, text = "completed", {
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    if (!isAutomationViewKey(arg1)) {
      return false;
    }
    cancelPendingAutomationViewDestroy(arg1);
    releaseAutomationInteraction(arg1, "task-finished");
    const local = getBoundsStateByViewKey().get(arg1)?.bounds || null;
    recoverMainAutomationView(arg1, local, {
      force: true,
      skipLayoutRefresh: true
    });
    scheduleIdleFinishedViewDestroy(arg1, {
      reason: text === "completed" ? "task_completed_idle" : "task_finished_" + text,
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    console.log("[Main] task-finished 保留预览视图位置: " + arg1 + " (" + text + ")");
    return true;
  }
  function recoverMainAutomationView(arg1, arg2 = null, {
    force = false,
    skipLayoutRefresh = false
  } = {}) {
    const result = getPlatformViews();
    const result2 = getInteractionViewsMap();
    const result3 = getInteractionLocksMap();
    const result4 = result.get(arg1);
    const result5 = result2.get(arg1);
    const result6 = getMainWindow();
    if (!result4 || !result6 || result6.isDestroyed()) {
      return false;
    }
    if (!force && result3.has(arg1)) {
      console.log("[Main] 子视图互动进行中，跳过恢复主视图: " + arg1);
      return false;
    }
    const result7 = result3.get(arg1);
    let local = null;
    const result8 = getBoundsStateByViewKey().get(arg1);
    const list = [arg2, result7?.previewBounds, result8?.bounds, result7?.bounds, result4.getBounds(), result5?.getBounds()];
    for (const item of list) {
      if (isValidAutomationBounds(item)) {
        local = {
          ...item
        };
        break;
      }
    }
    if (!local) {
      for (const item of list) {
        if (item && Number(item.width) > 50 && Number(item.height) > 50) {
          local = {
            x: 0,
            y: 0,
            width: Math.max(Number(item.width) || 0, COMPACT_BACKGROUND_AUTOMATION_WIDTH),
            height: Math.max(Number(item.height) || 0, COMPACT_BACKGROUND_AUTOMATION_HEIGHT)
          };
          break;
        }
      }
    }
    if (!local) {
      local = buildCompactBackgroundAutomationBounds(arg1);
    }
    if (result7?.timer) {
      clearTimeout(result7.timer);
    }
    if (result7?.taskDispatchTimer) {
      clearTimeout(result7.taskDispatchTimer);
    }
    if (result7?.profileOpenTimer) {
      clearTimeout(result7.profileOpenTimer);
    }
    if (result7?.loadListener && result5?.webContents) {
      try {
        result5.webContents.removeListener("did-finish-load", result7.loadListener);
      } catch (error) {}
    }
    try {
      if (result5) {
        const result = Math.max(local.width || 800, 100);
        const result2 = Math.max(local.height || 600, 100);
        result5.setBounds({
          x: -5000,
          y: -5000,
          width: result,
          height: result2
        });
        result5.webContents.setAudioMuted(true);
        if (result6.getBrowserViews().includes(result5)) {
          result6.removeBrowserView(result5);
        }
        removeAutomationViewFromBackgroundHost(result5);
        result5.webContents.loadURL("about:blank").catch(() => {});
      }
    } catch (error) {
      console.warn("[Main] 隐藏互动视图失败: " + error.message);
    }
    result3.delete(arg1);
    if (shouldAttachAutomationView(arg1)) {
      result4.setBounds(local);
      const result = Number(result7?.previewZoomFactor || result8?.zoomFactor || result7?.zoomFactor || 0);
      if (result > 0) {
        result4.webContents.setZoomFactor(result);
      }
      nudgeAutomationViewRepaint(result4.webContents, result4);
      removeAutomationViewFromBackgroundHost(result4);
      restoreForegroundAutomationRendering(result4.webContents);
      if (!result6.getBrowserViews().includes(result4)) {
        result6.addBrowserView(result4);
      }
      safeSetTopBrowserView(result4, {
        context: "recoverMainAutomationView:" + arg1
      });
      clearBackgroundAutomationState(arg1);
      maybeDestroyBackgroundAutomationHostWindow();
      console.log("[Main] 主视图已恢复(实况): " + arg1 + " -> x:" + local.x + ", y:" + local.y + ", w:" + local.width + ", h:" + local.height);
    } else if (shouldKeepAutomationViewAttached(arg1)) {
      const result = Number(result7?.previewZoomFactor || result8?.zoomFactor || result7?.zoomFactor || 0);
      if (result > 0) {
        try {
          result4.webContents.setZoomFactor(result);
        } catch (error) {}
      }
      if (parkAutomationViewInMainWindow(arg1, result4)) {
        console.log("[Main] 主视图已离屏停靠(同获客): " + arg1);
      } else {
        enterBackgroundDetachedMode(arg1, result4);
        console.log("[Main] 主视图已迁入后台宿主: " + arg1);
      }
    } else {
      clearBackgroundAutomationState(arg1);
      removeAutomationViewFromBackgroundHost(result4);
      maybeDestroyBackgroundAutomationHostWindow();
      console.log("[Main] 主视图已拆卸: " + arg1);
    }
    if (!skipLayoutRefresh) {
      requestAutomationLayoutRefresh();
    }
    return true;
  }
  function finishInteraction(arg1, options = {}, text = "done", {
    notifyMainView = true,
    preferLatestBounds = false,
    skipIdleCleanup = false
  } = {}) {
    const result = getPlatformViews();
    const result2 = getInteractionViewsMap();
    const result3 = getInteractionLocksMap();
    const result4 = result.get(arg1);
    const result5 = result2.get(arg1);
    const result6 = getMainWindow();
    const result7 = result3.get(arg1);
    if (result7?.timer) {
      clearTimeout(result7.timer);
    }
    if (result7?.taskDispatchTimer) {
      clearTimeout(result7.taskDispatchTimer);
    }
    if (result7?.profileOpenTimer) {
      clearTimeout(result7.profileOpenTimer);
    }
    if (result7) {
      result7.profileOpenReady = true;
    }
    if (result7?.loadListener && result5?.webContents) {
      try {
        result5.webContents.removeListener("did-finish-load", result7.loadListener);
      } catch (error) {}
    }
    if (!result4 || !result6 || result6.isDestroyed?.()) {
      result3.delete(arg1);
      cancelBackgroundInteractionForView(arg1, "interaction_orphaned:" + text);
      try {
        if (result5) {
          if (result6 && !result6.isDestroyed?.() && result6.getBrowserViews().includes(result5)) {
            result6.removeBrowserView(result5);
          }
          removeAutomationViewFromBackgroundHost(result5);
          if (!result5.webContents?.isDestroyed?.()) {
            result5.webContents.loadURL("about:blank").catch(() => {});
          }
          if (!skipIdleCleanup) {
            scheduleInteractionViewIdleCleanup(arg1);
          }
        }
      } catch (error) {}
      requestAutomationLayoutRefresh();
      console.warn("[Main] [子视图模式] 主视图已缺失，已清理互动锁: " + arg1 + " (" + text + ")");
      return false;
    }
    const result8 = getBoundsStateByViewKey().get(arg1);
    const value = preferLatestBounds && Number(result8?.zoomFactor) > 0 ? Number(result8.zoomFactor) : Number(result7?.previewZoomFactor || result7?.zoomFactor || 0);
    if (result7 && value) {
      result7.previewZoomFactor = value;
    }
    console.log("[Main] [子视图模式] 互动结束(" + text + ")，恢复主视图");
    cancelBackgroundInteractionForView(arg1, "interaction_finished:" + text);
    const value2 = preferLatestBounds && isValidAutomationBounds(result8?.bounds) ? result8.bounds : isValidAutomationBounds(result7?.previewBounds) ? result7.previewBounds : result7?.bounds;
    const result9 = recoverMainAutomationView(arg1, value2, {
      force: true
    });
    if (!result9) {
      console.warn("[Main] [子视图模式] 恢复主视图坐标失败，等待 Dashboard 同步 bounds");
      result3.delete(arg1);
      try {
        if (result5 && result6.getBrowserViews().includes(result5)) {
          result6.removeBrowserView(result5);
        }
        if (shouldAttachAutomationView(arg1)) {
          const local = getBoundsStateByViewKey().get(arg1)?.bounds;
          if (local && isValidAutomationBounds(local)) {
            result4.setBounds({
              ...local
            });
            if (!result6.getBrowserViews().includes(result4)) {
              result6.addBrowserView(result4);
            }
            safeSetTopBrowserView(result4, {
              context: "finishInteraction:fallback:" + arg1
            });
          }
        } else if (shouldKeepAutomationViewAttached(arg1)) {
          if (!parkAutomationViewInMainWindow(arg1, result4)) {
            enterBackgroundDetachedMode(arg1, result4);
          }
        }
      } catch (error) {}
    } else if (value && shouldAttachAutomationView(arg1)) {
      result4.webContents.setZoomFactor(value);
    }
    requestAutomationLayoutRefresh();
    getLastInteractionFinishedAtByViewKey().set(arg1, Date.now());
    if (notifyMainView && !result4.webContents.isDestroyed()) {
      result4.webContents.send("interaction-result", options);
    }
    if (result5) {
      try {
        if (!result5.webContents.isDestroyed()) {
          result5.webContents.loadURL("about:blank").catch(() => {});
        }
      } catch (error) {}
      if (!skipIdleCleanup) {
        scheduleInteractionViewIdleCleanup(arg1);
      }
    }
    if (!getAutomationViewsVisible() && result6 && !result6.isDestroyed() && result6.isVisible()) {
      setImmediate(() => restoreMainWindowUiFocus("finish-interaction:" + text));
    }
    return true;
  }
  function scheduleInteractionViewIdleCleanup(arg1) {
    cancelInteractionViewIdleCleanup(arg1);
    const result = getInteractionViewsMap().get(arg1);
    if (!result) {
      return;
    }
    const value = isBatchViewRuntimeActive(arg1) ? BATCH_INTERACTION_VIEW_IDLE_CLEANUP_MS : INTERACTION_VIEW_IDLE_CLEANUP_MS;
    const result2 = setTimeout(() => {
      map6.delete(arg1);
      try {
        destroyIdleInteractionView(arg1, result, "idle-timeout");
      } catch (error) {
        console.warn("[Perf] 空闲互动视图清理失败 " + arg1 + ": " + error.message);
      }
    }, value);
    if (typeof result2.unref === "function") {
      result2.unref();
    }
    map6.set(arg1, result2);
  }
  function destroyIdleInteractionView(arg1, arg2 = null, text = "idle") {
    if (getInteractionLocksMap().has(arg1) || getPendingBatchByViewKey().has(arg1)) {
      return false;
    }
    const result = getInteractionViewsMap();
    const result2 = result.get(arg1);
    if (!result2 || arg2 && result2 !== arg2) {
      return false;
    }
    cancelInteractionViewIdleCleanup(arg1);
    result.delete(arg1);
    destroyAutomationBrowserView(result2, arg1, "interaction-idle");
    console.log("[Perf] 已销毁空闲互动视图: " + arg1 + " (" + text + ")");
    return true;
  }
  function registerWebContentsLogger(arg1, arg2, flag = false) {
    if (!arg1) {
      return;
    }
    arg1.on("console-message", (arg1, arg2, arg3, arg4, arg5) => {
      const list = ["federation", "fallback", "Security Policy", "Failed to load", "Refused to load", "tracking", "Reporting Observer", "DevTools", "preloaded", "upgrade-insecure-requests", "CORS policy", "imapi.douyin.com", "xgplayer", "mammon", "UnredirectedLogger", "react does not satisfy", "react-dom does not satisfy", "kern.hv_vmm_present", "HTMLImageElement", "/aweme/v1/web", "[c0]", "icons.[object Object]", "init or use must be first call", "DevTools", "chrome-extension", "Failed to execute"];
      const result = arg3.toLowerCase();
      if (list.some(arg1 => result.includes(arg1.toLowerCase()))) {
        return;
      }
      let result2 = arg3.replace(/%c/g, "").trim();
      if (result2.includes("signature") || result2.includes("cookie") || result2.includes("token") || result2.includes("headers") || result2.includes("sec-ch-ua")) {
        return;
      }
      const local = result2.includes("[拟人操作]") || result2.includes("[状态识别]") || result2.includes("[环境清理]") || result2.includes("[页面就绪]") || result2.includes("[节奏控制]") || result2.includes("[执行策略]") || result2.includes("[交互警告]") || result2.includes("[子视图任务]") || result2.includes("[性别过滤]") || result2.includes("[互动动作]") || result2.includes("[详细信息提取]") || result2.includes("[环境重建]") || result2.includes("[网络加固]") || result2.includes("[会话恢复]") || result2.includes("[互动成功]") || result2.includes("[批量执行]") || result2.includes("[批量首作评论]") || result2.includes("[主页首作评论]");
      const list2 = ["DEBUG", "LOG", "WARN", "ERROR"];
      const local2 = list2[arg2] || "LOG";
      const result3 = result2.includes("[批量间隙闲逛]");
      const value = flag ? "[主页跟进]" : result3 ? "[批量间隙]" : "[智能扫描]";
      const value2 = value + " " + result2;
      if (app.isPackaged && local2 === "DEBUG") {
        return;
      }
      if (app.isPackaged && local2 === "LOG" && !local) {
        return;
      }
      writeLog(local2, [value2]);
    });
  }
  function attachAutomationViewStabilityGuards(arg1, arg2, {
    isInteraction = false
  } = {}) {
    if (!arg1 || !arg1.webContents || arg1.webContents.__radarStabilityGuardsAttached) {
      return;
    }
    const value = arg1.webContents;
    value.__radarStabilityGuardsAttached = true;
    const local = arg12 => {
      if (!value || value.isDestroyed()) {
        return;
      }
      const value2 = isInteraction ? getInteractionViewsMap().get(arg2) === arg1 : getPlatformViews().get(arg2) === arg1;
      if (!value2 || getPendingAutomationWebContentsClose().has(value)) {
        return;
      }
      const result = Date.now();
      const local = map2.get(arg2) || {};
      const value3 = isInteraction ? local.lastInteractionAt : local.lastMainAt;
      if (value3 && result - value3 < VIEW_RECOVERY_COOLDOWN_MS) {
        console.warn("[Main] 视图恢复已节流: " + arg2 + (isInteraction ? ":interaction" : "") + " (" + arg12 + ")");
        return;
      }
      map2.set(arg2, {
        ...local,
        [isInteraction ? "lastInteractionAt" : "lastMainAt"]: result
      });
      console.warn("[Main] 自动化视图异常，尝试恢复: " + arg2 + (isInteraction ? ":interaction" : "") + " (" + arg12 + ")");
      try {
        if (isInteraction) {
          const result = getPendingBatchByViewKey().get(arg2);
          if (result) {
            completeBatchFromInteraction(arg2, result, {
              success: false,
              error: "interaction-view-recovered:" + arg12
            }, value);
          }
          recoverMainAutomationView(arg2, null, {
            force: true
          });
          value.loadURL("about:blank").catch(() => {});
          return;
        }
        const result = value.getURL();
        if (result && result !== "about:blank") {
          value.reloadIgnoringCache();
        } else {
          const result = getViewSettingsMap();
          const result2 = result.get(arg2);
          if (result2) {
            initAutomationView(result2, result2.platform || result.get(arg2 + "_platform") || "douyin");
          }
        }
      } catch (error) {
        console.warn("[Main] 自动化视图恢复失败: " + arg2 + " " + error.message);
      }
    };
    value.on("render-process-gone", (arg1, options = {}) => {
      local("render-process-gone:" + (options.reason || "unknown"));
    });
    value.on("unresponsive", () => {
      local("unresponsive");
    });
  }
  function bindAutomationViewProxy(arg1, arg2, arg3) {
    if (!arg3) {
      return Promise.resolve();
    }
    return applyAccountProxy(arg3, arg1?.proxy, arg2).catch(arg1 => {
      console.warn("[Proxy][" + arg2 + "] 应用代理失败: " + arg1.message);
    });
  }
  function buildAutomationStartPayload(arg1, arg2) {
    const obj = {
      ...arg2,
      viewKey: arg1
    };
    const result = getPendingRestartByViewKey();
    if (result.get(arg1)) {
      obj.isRestart = true;
      result.delete(arg1);
    }
    return obj;
  }
  function sendAutomationStartTask(arg1, arg2, arg3) {
    if (!arg1 || arg1.webContents.isDestroyed() || !arg3?.taskId) {
      return;
    }
    runtimeConfig.pushToWebContents(arg1.webContents);
    const result = buildAutomationStartPayload(arg2, arg3);
    console.log("[Main] 下发 START_TASK: " + arg2 + " taskId=" + arg3.taskId + " restart=" + !!result.isRestart);
    arg1.webContents.send("control-task", {
      type: "START_TASK",
      payload: result
    });
  }
  function clearAutomationLoadRecovery(arg1) {
    const result = map4.get(arg1);
    if (result?.timer) {
      clearTimeout(result.timer);
    }
    map4.delete(arg1);
  }
  function scheduleAutomationLoadRecovery(arg1, arg2, arg3, text = "页面加载失败") {
    if (!arg1 || arg1.webContents?.isDestroyed?.()) {
      return false;
    }
    if (getPlatformViews().get(arg2) !== arg1) {
      return false;
    }
    const result = String(arg3 || arg1.webContents.getURL?.() || "");
    if (!/^https?:\/\//i.test(result)) {
      return false;
    }
    const local = map4.get(arg2) || {};
    if (local.timer) {
      return true;
    }
    const value = local.url === result;
    if (value && local.exhausted) {
      return false;
    }
    const value2 = value ? Number(local.attempt || 0) + 1 : 1;
    if (value2 > AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS) {
      map4.set(arg2, {
        url: result,
        attempt: AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS,
        exhausted: true
      });
      const result2 = getViewSettingsMap().get(arg2);
      const local = result2?.nickname || result2?.name || result2?.accountId || arg2;
      const value = local + " 页面连续加载失败，请检查网络或代理后重试";
      console.error("[Main] [页面自愈] " + arg2 + " 已重试 " + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + " 次仍失败: " + text + " " + result);
      appendDiagnosticsLog("ERROR", "automation page load exhausted", {
        viewKey: arg2,
        attempt: AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS,
        errorDescription: text,
        targetUrl: result
      });
      const result3 = getMainWindow();
      try {
        result3?.webContents?.send("new-status", "[WARN] " + value);
      } catch (error) {}
      return false;
    }
    const value3 = 5000 + Math.floor(Math.random() * 5001);
    const result2 = setTimeout(() => {
      const result3 = map4.get(arg2);
      if (!result3 || result3.timer !== result2) {
        return;
      }
      result3.timer = null;
      if (getPlatformViews().get(arg2) !== arg1 || arg1.webContents.isDestroyed()) {
        clearAutomationLoadRecovery(arg2);
        return;
      }
      console.warn("[Main] [页面自愈] " + arg2 + " 第 " + value2 + "/" + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + " 次重载: " + result);
      appendDiagnosticsLog("WARN", "automation page load retry", {
        viewKey: arg2,
        attempt: value2,
        errorDescription: text,
        targetUrl: result
      });
      const result4 = getMainWindow();
      try {
        result4?.webContents?.send("new-status", "[WARN] 页面加载失败，正在自动重试 (" + value2 + "/" + AUTOMATION_LOAD_RECOVERY_MAX_ATTEMPTS + ")…");
      } catch (error) {}
      arg1.webContents.loadURL(result).catch(arg12 => {
        scheduleAutomationLoadRecovery(arg1, arg2, result, arg12?.message || text);
      });
    }, value3);
    if (typeof result2.unref === "function") {
      result2.unref();
    }
    map4.set(arg2, {
      url: result,
      attempt: value2,
      timer: result2
    });
    return true;
  }
  function resolveDouyinSpecificEntryUrl(arg1) {
    const value = String(arg1 || "").split(/[\n,，\s]+/).map(arg1 => arg1.trim()).filter(Boolean)[0];
    if (!value) {
      return "https://www.douyin.com";
    }
    const result = extractDouyinVideoId(value);
    if (result) {
      return "https://www.douyin.com/jingxuan?modal_id=" + result;
    } else {
      return value;
    }
  }
  function initAutomationView(arg1, text = "douyin") {
    if (arg1 && !arg1.platform) {
      arg1.platform = text;
    }
    ensureAutomationPaintWatchdog();
    if (getIsCurrentUserFree()) {
      arg1.enableComment = false;
      arg1.enableVideoComment = false;
      arg1.enableFollow = false;
      arg1.enableDM = false;
      arg1.enableWarmup = false;
      arg1.isFree = true;
      console.log("[Auth-Shield] [安全策略] 已在引擎加载前硬熔断高级特权: enableComment=false, enableVideoComment=false, enableFollow=false, enableDM=false (AccountId: " + (arg1.accountId || "default") + ")");
    }
    if (arg1.taskMode === "scrape") {
      arg1.enableLike = false;
      arg1.enableComment = false;
      arg1.enableFollow = false;
      arg1.enableDM = false;
      arg1.enableWarmup = false;
      console.log("[Scrape-Shield] [安全策略] 仅采集模式已自动熔断所有自动点赞/评论/关注/私信/预热配置");
    }
    const value = arg1.accountId && arg1.accountId !== "default" ? text + "_" + arg1.accountId : text;
    const result = getPlatformViews();
    const result2 = getInteractionViewsMap();
    const result3 = getInteractionLocksMap();
    const result4 = getViewSettingsMap();
    let result5 = result.get(value);
    const local = arg1.keywords?.trim();
    const local2 = local?.split(/[,，\s\n]+/).map(arg1 => arg1.trim()).filter(Boolean) || [];
    const value2 = local2[0];
    const value3 = Array.isArray(arg1.videoSources) && arg1.videoSources.length > 0 ? arg1.videoSources : ["search"];
    const result6 = value3.filter(arg1 => ["search", "follow", "recommend", "like", "specific"].includes(arg1) && (arg1 !== "search" || value2));
    const local3 = result6[0] || "search";
    let local4 = arg1.url || (text === "xianyu" ? "https://www.goofish.com" : "https://www.douyin.com");
    if (text === "douyin") {
      if (local3 === "follow") {
        local4 = "https://www.douyin.com/follow";
      } else if (local3 === "recommend") {
        local4 = "https://www.douyin.com/?recommend=1&from_nav=1";
      } else if (local3 === "like") {
        local4 = "https://www.douyin.com/user/self?from_tab_name=main&showTab=like";
      } else if (local3 === "specific") {
        local4 = resolveDouyinSpecificEntryUrl(arg1.specifiedUrls);
      } else if (value2) {
        local4 = "https://www.douyin.com/search/" + encodeURIComponent(value2);
      }
    }
    if (arg1.name) {
      result4.set(value + "_name", arg1.name);
    }
    if (text) {
      result4.set(value + "_platform", text);
    }
    const value4 = result6.join("|") + "::" + (local || "");
    if (result5) {
      attachAutomationViewStabilityGuards(result5, value, {
        isInteraction: false
      });
      const result = result2.get(value);
      if (result) {
        attachAutomationViewStabilityGuards(result, value, {
          isInteraction: true
        });
      }
      const result6 = map3.get(value);
      const value2 = result6 !== value4;
      const result7 = result4.get(value);
      const flag = !arg1?.taskId;
      console.log("[Main] 恢复已有视图: " + value + ", 启动参数变化=" + value2 + " (" + value4 + ")");
      const result8 = getMainWindow();
      if (result8 && !result8.isDestroyed()) {
        const result = result5.getBounds();
        const result4 = result3.get(value);
        if (result4) {
          const result = result2.get(value);
          const value2 = isValidAutomationBounds(result4.previewBounds) ? result4.previewBounds : result4.bounds;
          if (result && value2 && isValidAutomationBounds(value2)) {
            if (!result8.getBrowserViews().includes(result)) {
              result8.addBrowserView(result);
            }
            const result2 = Number(result4.previewZoomFactor || result4.zoomFactor || 0);
            if (result2 > 0) {
              try {
                result.webContents.setZoomFactor(result2);
              } catch (error) {}
            }
            result.setBounds(value2);
            safeSetTopBrowserView(result, {
              context: "initAutomationView:resumeInteraction:" + value
            });
          }
        } else if (!isValidAutomationBounds(result)) {
          recoverMainAutomationView(value);
        } else {
          attachMainAutomationView(value);
          nudgeAutomationViewRepaint(result5.webContents, result5);
        }
      }
      if (arg1 && arg1.taskId) {
        if (arg1.taskMode === "nurture") {
          arg1.processedVideos = [];
        } else {
          arg1.processedVideos = getProcessedVideoUrlsForSettings(arg1, value);
        }
        injectInteractedUsers(arg1);
        result4.set(value, arg1);
        syncAutomationRuntimeGuard(value, arg1);
        if (!result3.has(value)) {
          attachMainAutomationView(value);
        }
      }
      if (value2) {
        const local = !!result7?.taskId && !!arg1?.taskId && result7.taskId === arg1.taskId;
        if (local) {
          console.log("[Main] 同任务运行中，跳过 launchChanged 页面重载: " + value + " taskId=" + result7.taskId);
          if (result6) {
            map3.set(value, result6);
          }
        } else {
          bindAutomationViewProxy(arg1, value, result5.webContents.session).then(() => {
            console.log("[Main] 启动参数变化，重载目标页: " + value + " -> " + local4);
            map3.set(value, value4);
            result5.webContents.loadURL(local4).catch(arg1 => {
              scheduleAutomationLoadRecovery(result5, value, local4, arg1?.message || "loadURL failed");
            });
          });
        }
      } else if (arg1 && arg1.taskId) {
        bindAutomationViewProxy(arg1, value, result5.webContents.session);
        sendAutomationStartTask(result5, value, arg1);
      } else if (flag) {
        bindAutomationViewProxy(arg1, value, result5.webContents.session).then(() => {
          console.log("[Main] 登录/预热视图重载: " + value + " -> " + local4);
          result5.webContents.loadURL(local4).catch(arg1 => {
            scheduleAutomationLoadRecovery(result5, value, local4, arg1?.message || "loadURL failed");
          });
        });
      } else {
        bindAutomationViewProxy(arg1, value, result5.webContents.session);
      }
      return;
    }
    if (countPlatformAutomationViews(text) >= maxPlatformAccounts) {
      console.warn("[Main] 已达每平台最大登录账号数 " + maxPlatformAccounts + ": " + text);
      const result = getMainWindow();
      if (result && !result.isDestroyed()) {
        result.webContents.send("account-limit-rejected", {
          platform: text,
          max: maxPlatformAccounts,
          reason: "每平台最多同时登录 " + maxPlatformAccounts + " 个账号"
        });
      }
      return;
    }
    console.log("[Main] 初始化内置自动化视图 (" + value + ")...");
    map3.set(value, value4);
    const result7 = resolveAutomationPreloadPath();
    result5 = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: result7,
        partition: "persist:automation:" + value,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    result5.setBackgroundColor("#111827");
    attachProtocolGuard(result5.webContents, value + ":main");
    attachAutomationViewStabilityGuards(result5, value, {
      isInteraction: false
    });
    configureAutomationSession(result5.webContents.session, value);
    if (text === "xianyu") {
      configureXianyuSession(result5.webContents.session);
    }
    result.set(value, result5);
    const result8 = getMainWindow();
    result8.webContents.send("plugin-status", {
      connected: true
    });
    result5.webContents.setUserAgent(automationUserAgent);
    const result9 = store.get("system_video_muted", true);
    result5.webContents.setAudioMuted(result9);
    console.log("[Main] 视图 " + value + " 初始静音状态: " + result9);
    result5.webContents.session.webRequest.onHeadersReceived({
      urls: ["*://*.douyin.com/*", "*://*.bytedance.net/*"]
    }, handleStripFrameBlockingHeaders);
    result5.setBounds({
      x: 0,
      y: 0,
      width: 800,
      height: 600
    });
    if (arg1 && arg1.taskId) {
      if (arg1.taskMode === "nurture") {
        arg1.processedVideos = [];
      } else {
        arg1.processedVideos = getProcessedVideoUrlsForSettings(arg1, value);
      }
      injectInteractedUsers(arg1);
      result4.set(value, arg1);
      syncAutomationRuntimeGuard(value, arg1);
    }
    attachMainAutomationView(value);
    result5.webContents.on("dom-ready", () => {
      runtimeConfig.ensureAndPushToWebContents(result5.webContents);
      const result = result4.get(value);
      const result2 = getIsBatchActionRunningMap().get(value);
      if (result && result.taskId && !result2) {
        console.log("[Main] 页面就绪 (" + value + ")，发送任务指令...");
        sendAutomationStartTask(result5, value, result);
      }
      const result3 = getMainWindow();
      if (result3) {
        result3.webContents.send("automation-url-changed", {
          platform: text,
          url: result5.webContents.getURL()
        });
      }
    });
    result5.webContents.on("did-navigate", (arg1, arg2) => {
      const result = getMainWindow();
      if (result) {
        result.webContents.send("automation-url-changed", {
          platform: text,
          url: arg2
        });
      }
    });
    result5.webContents.on("did-finish-load", () => {
      const result = result5.webContents.getURL();
      if (/^https?:\/\//i.test(result)) {
        clearAutomationLoadRecovery(value);
      }
      nudgeAutomationViewRepaint(result5.webContents, result5);
      requestAutomationLayoutRefresh();
    });
    result5.webContents.on("did-fail-load", (arg1, arg2, arg3, arg4, arg5) => {
      if (arg4?.includes("bytedance.net") || arg4?.includes("douyin.com")) {
        console.warn("[Network][" + value + "] did-fail-load code=" + arg2 + " main=" + arg5 + " " + arg3 + " " + arg4);
      }
      if (arg5 && arg2 !== -3) {
        scheduleAutomationLoadRecovery(result5, value, arg4, arg3 || "ERR_" + arg2);
      }
    });
    registerWebContentsLogger(result5.webContents, text, false);
    bindAutomationViewProxy(arg1, value, result5.webContents.session).then(() => {
      console.log("[Main] 正在加载目标网址: " + local4);
      result5.webContents.loadURL(local4).catch(arg1 => {
        scheduleAutomationLoadRecovery(result5, value, local4, arg1?.message || "loadURL failed");
      });
    });
  }
  return {
    cancelPendingAutomationViewDestroy: cancelPendingAutomationViewDestroy,
    cancelInteractionViewIdleCleanup: cancelInteractionViewIdleCleanup,
    scheduleDestroyAutomationView: scheduleDestroyAutomationView,
    scheduleIdleFinishedViewDestroy: scheduleIdleFinishedViewDestroy,
    enqueueAutomationBrowserViewClose: enqueueAutomationBrowserViewClose,
    destroyAutomationBrowserView: destroyAutomationBrowserView,
    finalizeStoppedAutomationTask: finalizeStoppedAutomationTask,
    destroyAutomationView: destroyAutomationView,
    releaseAutomationInteraction: releaseAutomationInteraction,
    preserveAutomationViewAfterTaskFinish: preserveAutomationViewAfterTaskFinish,
    recoverMainAutomationView: recoverMainAutomationView,
    finishInteraction: finishInteraction,
    scheduleInteractionViewIdleCleanup: scheduleInteractionViewIdleCleanup,
    destroyIdleInteractionView: destroyIdleInteractionView,
    registerWebContentsLogger: registerWebContentsLogger,
    attachAutomationViewStabilityGuards: attachAutomationViewStabilityGuards,
    bindAutomationViewProxy: bindAutomationViewProxy,
    buildAutomationStartPayload: buildAutomationStartPayload,
    sendAutomationStartTask: sendAutomationStartTask,
    clearAutomationLoadRecovery: clearAutomationLoadRecovery,
    scheduleAutomationLoadRecovery: scheduleAutomationLoadRecovery,
    resolveDouyinSpecificEntryUrl: resolveDouyinSpecificEntryUrl,
    initAutomationView: initAutomationView
  };
}
module.exports = {
  createAutomationViewLifecycle: createAutomationViewLifecycle
};
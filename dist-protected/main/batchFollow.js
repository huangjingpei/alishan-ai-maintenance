'use strict';

const fs = require("fs");
const crypto = require("crypto");
const {
  ipcMain,
  BrowserView
} = require("electron");
const dbManager = require("./dbManager");
const {
  waitForInteractionViewVisualReady
} = require("./interactionViewVisualReady");
const BATCH_USER_GONE_REASON = "用户不存在（可能已注销）";
const BATCH_PROFILE_LOAD_MAX_RETRIES = 2;
const BATCH_PROFILE_OPEN_TIMEOUT_MS = 40000;
const SUBVIEW_HANDOFF_MIN_GAP_MS = 2800;
const COMPACT_BACKGROUND_AUTOMATION_WIDTH = 1200;
const COMPACT_BACKGROUND_AUTOMATION_HEIGHT = 800;
function createBatchFollow(arg1) {
  const {
    getMainWindow: getMainWindow,
    getPlatformViews: getPlatformViews,
    getInteractionViewsMap: getInteractionViewsMap,
    getInteractionLocksMap: getInteractionLocksMap,
    getViewSettingsMap: getViewSettingsMap,
    getBatchActionQueueMap: getBatchActionQueueMap,
    getPendingBatchByViewKey: getPendingBatchByViewKey,
    getIsBatchActionRunningMap: getIsBatchActionRunningMap,
    getViewActiveBatchRunMap: getViewActiveBatchRunMap,
    getLastInteractionFinishedAtByViewKey: getLastInteractionFinishedAtByViewKey,
    getBackgroundDetachedViewKeys: getBackgroundDetachedViewKeys,
    getBackgroundLayoutHoldViewKeys: getBackgroundLayoutHoldViewKeys,
    getIsCurrentUserFree: getIsCurrentUserFree,
    isAutomationViewKey: isAutomationViewKey,
    isBatchViewRuntimeActive: isBatchViewRuntimeActive,
    pushAutomationTrace: pushAutomationTrace,
    suspendOccludedAutomationRendering: suspendOccludedAutomationRendering,
    historyManager: historyManager,
    ensureRuntimeConfigReadyForTask: ensureRuntimeConfigReadyForTask,
    runtimeConfigBlockReason: runtimeConfigBlockReason,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath,
    attachProtocolGuard: attachProtocolGuard,
    configureAutomationSession: configureAutomationSession,
    configureXianyuSession: configureXianyuSession,
    store: store,
    runtimeConfig: runtimeConfig,
    automationUserAgent: automationUserAgent,
    historyFile: historyFile,
    cryptoKey: cryptoKey,
    cryptoIv: cryptoIv,
    isLeadsSqliteRuntime: isLeadsSqliteRuntime,
    inferInteractionViewKey: inferInteractionViewKey,
    shouldAttachAutomationView: shouldAttachAutomationView,
    shouldKeepAutomationViewAttached: shouldKeepAutomationViewAttached,
    parkAutomationViewInMainWindow: parkAutomationViewInMainWindow,
    enterBackgroundDetachedMode: enterBackgroundDetachedMode,
    safeSetTopBrowserView: safeSetTopBrowserView,
    nudgeAutomationViewRepaint: nudgeAutomationViewRepaint,
    restoreForegroundAutomationRendering: restoreForegroundAutomationRendering,
    isValidAutomationBounds: isValidAutomationBounds,
    isBackgroundAutomationHidden: isBackgroundAutomationHidden,
    cacheAutomationPreviewBounds: cacheAutomationPreviewBounds,
    resolveInteractionViewportBounds: resolveInteractionViewportBounds,
    shouldShowInteractionView: shouldShowInteractionView,
    restoreVisibleInteractionStack: restoreVisibleInteractionStack,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    focusAutomationWebContentsSafely: focusAutomationWebContentsSafely,
    canParkAutomationViewInMainWindow: canParkAutomationViewInMainWindow,
    attachLivePreviewSpectatorIfPossible: attachLivePreviewSpectatorIfPossible,
    ensureMainViewVisibleForBatch: ensureMainViewVisibleForBatch,
    getBackgroundAutomationHostViews: getBackgroundAutomationHostViews,
    cancelPendingAutomationViewDestroy: cancelPendingAutomationViewDestroy,
    cancelInteractionViewIdleCleanup: cancelInteractionViewIdleCleanup,
    scheduleInteractionViewIdleCleanup: scheduleInteractionViewIdleCleanup,
    finishInteraction: finishInteraction,
    preserveAutomationViewAfterTaskFinish: preserveAutomationViewAfterTaskFinish,
    recoverMainAutomationView: recoverMainAutomationView,
    initAutomationView: initAutomationView,
    cancelAutomationAiRetry = () => {},
    attachAutomationViewStabilityGuards: attachAutomationViewStabilityGuards,
    registerWebContentsLogger: registerWebContentsLogger,
    releaseBatchRuntimeGuardIfIdle: releaseBatchRuntimeGuardIfIdle,
    acquireBatchRuntimeGuard: acquireBatchRuntimeGuard,
    syncAutomationRuntimeGuard: syncAutomationRuntimeGuard
  } = arg1;
  let num = 0;
  let flag = false;
  let num2 = 0;
  let obj = {
    total: 0,
    current: 0,
    success: 0,
    failed: 0,
    skipped: 0
  };
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  function fn(arg1 = null) {
    if (arg1?.canCommentFirstWork) {
      return 360000;
    }
    if (arg1?.canDM) {
      return 240000;
    }
    return 180000;
  }
  function fn2(arg1, text = "", options = {}) {
    const result = getInteractionLocksMap();
    const result2 = result.get(arg1);
    if (!result2 || typeof result2.onTimeout !== "function") {
      return false;
    }
    if (text && result2.interactionId && text !== result2.interactionId) {
      return false;
    }
    const result3 = Number(options.extendMs);
    const value = Number.isFinite(result3) && result3 > 0 ? result3 : Number(result2.timeoutMs) || 360000;
    if (result2.timer) {
      clearTimeout(result2.timer);
    }
    result2.timer = setTimeout(result2.onTimeout, value);
    result2.lastActivityAt = Date.now();
    result2.timeoutMs = Number(result2.timeoutMs) || value;
    return true;
  }
  function fn3(arg1, text = "preempt", options = {}) {
    cancelAutomationAiRetry();
    const result = getInteractionViewsMap().get(arg1);
    if (!result?.webContents || result.webContents.isDestroyed()) {
      return;
    }
    try {
      result.webContents.send("interaction-preempt", {
        viewKey: arg1,
        reason: text,
        ...options
      });
    } catch (error) {
      console.warn("[Batch] [" + arg1 + "] 发送 interaction-preempt 失败: " + (error?.message || error));
    }
  }
  function resolveActiveBatchRunId(arg1 = null, arg2 = null) {
    if (arg2 != null && Number.isFinite(Number(arg2))) {
      return Number(arg2);
    }
    if (arg1) {
      const result = getPendingBatchByViewKey().get(arg1);
      if (result?.runId != null) {
        return result.runId;
      }
      const result2 = getViewActiveBatchRunMap().get(arg1);
      if (result2 != null) {
        return result2;
      }
    }
    return null;
  }
  function appendBatchFollowLog(arg1, options = {}) {
    if (arg1 == null) {
      return null;
    }
    try {
      const result = historyManager.appendBatchRunLog(arg1, options);
      const result2 = getMainWindow();
      if (result && result2 && !result2.isDestroyed()) {
        result2.webContents.send("batch-run-log", {
          runId: arg1,
          log: result
        });
      }
      return result;
    } catch (error) {
      console.warn("[Batch] 写入批量跟进日志失败:", error?.message || error);
      return null;
    }
  }
  function fn6(arg1, arg2) {
    const value = arg1 + "_" + arg2;
    const result = map.get(value);
    if (result) {
      clearInterval(result);
      map.delete(value);
    }
  }
  function fn7(arg1, arg2, arg3, arg4) {
    const value = arg1 + "_" + arg2;
    let result = map2.get(value);
    if (!result) {
      result = new Set();
      map2.set(value, result);
    }
    const result2 = setTimeout(() => {
      const result = map2.get(value);
      result?.delete(result2);
      if (result?.size === 0) {
        map2.delete(value);
      }
      arg3();
    }, Math.max(0, arg4));
    result.add(result2);
    return result2;
  }
  function fn8(arg1, arg2) {
    const value = arg1 + "_" + arg2;
    const result = map2.get(value);
    if (!result) {
      return;
    }
    for (const item of result) {
      clearTimeout(item);
    }
    map2.delete(value);
  }
  function fn9() {
    for (const item of map.values()) {
      clearInterval(item);
    }
    map.clear();
    for (const item of map2.values()) {
      for (const item2 of item) {
        clearTimeout(item2);
      }
    }
    map2.clear();
  }
  function clearBatchWaitTickersForView(arg1) {
    for (const [local, local2] of [...map.entries()]) {
      if (local.startsWith(arg1 + "_")) {
        clearInterval(local2);
        map.delete(local);
      }
    }
    for (const [local, local2] of [...map2.entries()]) {
      if (!local.startsWith(arg1 + "_")) {
        continue;
      }
      for (const item of local2) {
        clearTimeout(item);
      }
      map2.delete(local);
    }
  }
  function cancelBatchWandering(arg1, arg2) {
    getPlatformViews().forEach((arg12, arg22) => {
      if (!arg12 || arg12.webContents.isDestroyed()) {
        return;
      }
      try {
        arg12.webContents.send("control-task", {
          type: "CANCEL_WANDERING",
          payload: {
            reason: arg1,
            batchRunId: arg2,
            viewKey: arg22
          }
        });
      } catch (error) {
        console.warn("[Batch] [" + arg22 + "] 取消拟人闲逛失败: " + error.message);
      }
    });
  }
  function cancelActiveBatchInteractions(arg1, arg2) {
    const result = getBatchActionQueueMap();
    const result2 = getPendingBatchByViewKey();
    const result3 = getViewActiveBatchRunMap();
    const result4 = getInteractionViewsMap();
    const result5 = getInteractionLocksMap();
    const set = new Set([...result.keys(), ...result2.keys(), ...result3.keys()]);
    for (const item of set) {
      const result = result2.get(item);
      if (result && arg2 != null && result.runId !== arg2) {
        continue;
      }
      const result3 = result4.get(item);
      try {
        if (result3 && !result3.webContents.isDestroyed()) {
          result3.webContents.send("interaction-preempt", {
            viewKey: item,
            reason: arg1,
            cancelledBatchRunId: arg2
          });
          result3.webContents.stop();
        }
      } catch (error) {
        console.warn("[Batch] [" + item + "] 取消旧互动任务失败: " + error.message);
      }
      result2.delete(item);
      if (result5.has(item)) {
        finishInteraction(item, {
          error: "batch-cancelled"
        }, arg1);
      }
    }
  }
  function fn13({
    viewKeyFound: viewKeyFound,
    accountId: accountId,
    finishedLeadName: finishedLeadName,
    nextLeadName: nextLeadName,
    delayMs: delayMs,
    delayMin: delayMin,
    delayMax: delayMax,
    sender: sender,
    scheduledRunId: scheduledRunId
  }) {
    const result = Math.round(delayMs / 1000);
    const value = delayMs > 3000 ? Math.round((delayMs - 3000) / 1000) : 0;
    const result2 = Math.max(0, result - value);
    const value2 = delayMin + "-" + delayMax;
    let local;
    if (value > 0) {
      local = "⏳ 批量间隙：@" + (finishedLeadName || "上一条") + " 已完成，" + result + "s 后处理下一条（" + value + "s 推荐页刷视频 + " + result2 + "s 提前准备，间隔设置 " + value2 + "s）";
    } else {
      local = "⏳ 批量间隙：@" + (finishedLeadName || "上一条") + " 已完成，等待 " + result + "s 后处理下一条（间隔设置 " + value2 + "s）";
    }
    pushAutomationTrace(local, accountId, {
      runId: scheduledRunId,
      viewKey: viewKeyFound,
      phase: "delay",
      level: "info"
    });
    if (nextLeadName) {
      pushAutomationTrace("📋 下一条：@" + nextLeadName, accountId, {
        runId: scheduledRunId,
        viewKey: viewKeyFound,
        phase: "delay",
        leadName: nextLeadName
      });
    }
    fn6(viewKeyFound, scheduledRunId);
    fn8(viewKeyFound, scheduledRunId);
    const result3 = Date.now();
    const value3 = viewKeyFound + "_" + scheduledRunId;
    const result4 = setInterval(() => {
      if (flag || num !== scheduledRunId) {
        fn6(viewKeyFound, scheduledRunId);
        return;
      }
      const result2 = Math.floor((Date.now() - result3) / 1000);
      const value = result - result2;
      if (value <= 0) {
        fn6(viewKeyFound, scheduledRunId);
        return;
      }
      pushAutomationTrace("⏳ 批量间隙：剩余约 " + value + "s…", accountId, {
        runId: scheduledRunId,
        viewKey: viewKeyFound,
        phase: "delay",
        persist: false
      });
    }, 10000);
    map.set(value3, result4);
    const result5 = getPlatformViews().get(viewKeyFound);
    if (delayMs > 3000 && result5 && !result5.webContents.isDestroyed()) {
      const value = delayMs - 3000;
      console.log("[Batch] 等待 " + result + "s 后处理下一个任务，期间执行 " + Math.round(value / 1000) + "s 推荐页刷视频...");
      result5.webContents.loadURL("https://www.douyin.com/?recommend=1");
      fn7(viewKeyFound, scheduledRunId, () => {
        if (!flag && num === scheduledRunId && !result5.webContents.isDestroyed()) {
          result5.webContents.send("control-task", {
            type: "PERFORM_WANDERING",
            payload: {
              duration: value,
              traceAccountId: accountId,
              batchRunId: scheduledRunId
            }
          });
        }
      }, 1500);
    } else {
      console.log("[Batch] 等待 " + result + "s 后处理下一个任务...");
    }
    const result6 = getBatchActionQueueMap().get(viewKeyFound);
    const value4 = result6 ? result6[0] : null;
    if (delayMs > 3000 && value4 && value4.lead?.userUrl) {
      fn7(viewKeyFound, scheduledRunId, () => {
        if (!flag && num === scheduledRunId && result5 && !result5.webContents.isDestroyed()) {
          const result = fn14(value4.lead.userUrl);
          pushAutomationTrace("🚀 提前 3 秒导航至下一目标主页进行加载: @" + (value4.lead.nickname || "未知"), accountId, {
            runId: scheduledRunId,
            viewKey: viewKeyFound,
            phase: "delay",
            leadName: value4.lead.nickname || ""
          });
          console.log("[Batch] [" + viewKeyFound + "] 提前 3 秒载入下一目标主页: " + result);
          result5.webContents.loadURL(result);
        }
      }, delayMs - 3000);
    }
    fn7(viewKeyFound, scheduledRunId, () => {
      fn6(viewKeyFound, scheduledRunId);
      if (!flag && num === scheduledRunId) {
        pushAutomationTrace("▶️ 批量间隙结束，开始处理下一条", accountId, {
          runId: scheduledRunId,
          viewKey: viewKeyFound,
          phase: "delay",
          level: "info"
        });
        dispatchNextBatchItem(viewKeyFound, scheduledRunId, "normal-gap-delay");
      }
    }, delayMs);
  }
  function pickBatchDmText(arg1, arg2) {
    const result = (arg1?.template || "你好 {nickname}").split("\n").filter(arg1 => arg1.trim());
    if (result.length === 0) {
      return "你好".replace(/{nickname}/g, arg2?.nickname || "朋友");
    }
    const value = result[num2 % result.length];
    num2 += 1;
    return value.replace(/{nickname}/g, arg2?.nickname || "朋友");
  }
  function fn14(arg1) {
    if (!arg1 || typeof arg1 !== "string") {
      return arg1;
    }
    try {
      const url = new URL(arg1.startsWith("http") ? arg1 : "https://www.douyin.com" + (arg1.startsWith("/") ? arg1 : "/" + arg1));
      url.searchParams.set("from_tab_name", "main");
      return url.toString();
    } catch (error) {
      if (arg1.includes("from_tab_name=")) {
        return arg1;
      }
      if (arg1.includes("?")) {
        return arg1 + "&from_tab_name=main";
      } else {
        return arg1 + "?from_tab_name=main";
      }
    }
  }
  function buildBatchInteractionTask(arg1, arg2, arg3) {
    const local = arg2?.type || "follow_dm";
    const local2 = arg2?.profileCommentUseAi && arg2?.personaByAccount?.[arg1?.accountId];
    const result = (arg2.commentTemplate || "").trim();
    const value = arg2.commentMentionPosition === "after" ? "after" : "before";
    const flag = !!arg2.enableCommentMention;
    const local3 = arg2.commentMentionNicknames || "";
    const value2 = Number.isFinite(Number(arg2.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(arg2.commentMentionPercent)))) : 100;
    if (flag) {
      console.log("[Batch] 构建首作任务 @概率=" + value2 + "% nicks=" + String(local3 || "").slice(0, 40));
    }
    const flag2 = !!arg2.commentUseRandomSuffix;
    const flag3 = !!arg2.enableCommentWithoutText;
    const flag4 = !!arg2.enableCommentImage;
    const flag5 = !!arg2.enableCommentExpression;
    const value3 = Array.isArray(arg2.commentImagePaths) ? arg2.commentImagePaths.filter(arg1 => typeof arg1 === "string" && arg1.trim()) : String(arg2.commentImagePath || "").trim() ? [String(arg2.commentImagePath).trim()] : [];
    const result2 = Math.max(1, Math.min(8, Number(arg2.commentExpressionCount) || 3));
    const value4 = Number.isFinite(Number(arg2.commentAttachmentPercent)) ? Math.max(0, Math.min(100, Number(arg2.commentAttachmentPercent))) : 20;
    const obj = {
      viewKey: arg3,
      lead: arg1,
      isBatchAction: true,
      batchConfig: {
        type: arg2.type,
        template: arg2.template,
        commentTemplate: arg2.commentTemplate,
        profileCommentUseAi: arg2.profileCommentUseAi,
        useRandomSuffix: arg2.useRandomSuffix,
        dmUseRandomSuffix: !!arg2.useRandomSuffix,
        commentUseRandomSuffix: flag2,
        enableCommentWithoutText: flag3,
        enableCommentMention: flag,
        commentMentionNicknames: local3,
        commentMentionPosition: value,
        commentMentionPercent: value2,
        enableCommentImage: flag4,
        commentImagePaths: value3,
        enableCommentExpression: flag5,
        commentExpressionCount: result2,
        commentAttachmentPercent: value4,
        followDmDelayMin: arg2.followDmDelayMin,
        followDmDelayMax: arg2.followDmDelayMax,
        dmTarget: arg2.dmTarget,
        genderFilter: arg2.genderFilter,
        ageFilterEnabled: arg2.ageFilterEnabled === true,
        ageMin: arg2.ageMin,
        ageMax: arg2.ageMax,
        personaByAccount: arg2.personaByAccount,
        profileFirstWorkLikePercent: (() => {
          const result = Number(arg2.profileFirstWorkLikePercent);
          if (Number.isFinite(result)) {
            return Math.max(0, Math.min(100, Math.round(result)));
          } else {
            return 10;
          }
        })(),
        profileFirstWorkCollectPercent: (() => {
          const result = Number(arg2.profileFirstWorkCollectPercent);
          if (Number.isFinite(result)) {
            return Math.max(0, Math.min(100, Math.round(result)));
          } else {
            return 10;
          }
        })()
      },
      canFollow: local.includes("follow"),
      canDM: local === "follow_dm" || local === "message",
      canCommentFirstWork: local === "profile_first_comment",
      commentOnProfileFirstWork: local === "profile_first_comment",
      profileFirstWorkLikePercent: (() => {
        const result = Number(arg2.profileFirstWorkLikePercent);
        if (Number.isFinite(result)) {
          return Math.max(0, Math.min(100, Math.round(result)));
        } else {
          return 10;
        }
      })(),
      profileFirstWorkCollectPercent: (() => {
        const result = Number(arg2.profileFirstWorkCollectPercent);
        if (Number.isFinite(result)) {
          return Math.max(0, Math.min(100, Math.round(result)));
        } else {
          return 10;
        }
      })(),
      enableWarmup: false,
      enableRandomLike: false,
      followDmDelayMin: arg2.followDmDelayMin,
      followDmDelayMax: arg2.followDmDelayMax,
      useRandomSuffix: !!arg2.useRandomSuffix,
      dmUseRandomSuffix: !!arg2.useRandomSuffix,
      genderFilter: arg2.genderFilter || "all",
      ageFilterEnabled: arg2.ageFilterEnabled === true,
      ageMin: arg2.ageMin,
      ageMax: arg2.ageMax,
      dmContent: local.includes("message") || local === "follow_dm" ? pickBatchDmText(arg2, arg1) : "",
      dmTarget: arg2.dmTarget === "followed_only" ? "followed_only" : "all",
      commentTemplate: result,
      commentContent: result,
      videoCommentContent: result,
      batchProfileCommentUseAi: !!arg2.profileCommentUseAi,
      enableCommentMention: flag,
      commentMentionNicknames: local3,
      commentMentionPosition: value,
      commentMentionPercent: value2,
      commentUseRandomSuffix: flag2,
      enableCommentWithoutText: flag3,
      enableCommentImage: flag4,
      commentImagePaths: value3,
      commentImagePath: value3[0] || "",
      enableCommentExpression: flag5,
      commentExpressionCount: result2,
      commentAttachmentPercent: value4
    };
    if (local2) {
      Object.assign(obj, {
        aiReplyMode: true,
        profileFirstCommentUseAi: true,
        aiRole: local2.aiRole,
        aiGoal: local2.aiGoal,
        aiStyle: local2.aiStyle,
        aiPrompt: local2.aiPrompt,
        firstPostGoal: local2.firstPostGoal || "",
        firstPostStyle: local2.firstPostStyle || "",
        firstPostPrompt: local2.firstPostPrompt || "",
        videoGoal: local2.videoGoal || "",
        videoStyle: local2.videoStyle || "",
        videoPrompt: local2.videoPrompt || ""
      });
    }
    return obj;
  }
  function fn18(arg1, options = {}) {
    if (options.profileFirstTargetFiltered || options.targetRejected || options.demographicFilterFailed) {
      return true;
    }
    const result = String(arg1 || "");
    if (!result) {
      return false;
    }
    return result.includes("性别不符") || result.startsWith("年龄不符") || result.includes("低于最小年龄") || result.includes("超过最大年龄");
  }
  function fn19(arg1, options = {}) {
    if (options.noWorks) {
      return true;
    }
    const result = String(arg1 || "");
    return result.includes("作品数为0") || result.includes("无公开作品");
  }
  function fn20(arg1, options = {}) {
    if (options.isPrivate && (options.skipped || String(arg1 || "").includes("私密账号"))) {
      return true;
    }
    const result = String(arg1 || "");
    return result.includes("私密账号");
  }
  function fn21(arg1, options = {}) {
    if (options?.userGone || options?.errorCode === "USER_NOT_FOUND") {
      return true;
    }
    if (options?.profileUnavailable && /用户不存在|已注销|无此用户|账号已被封禁/.test(String(options.profileUnavailableReason || ""))) {
      return true;
    }
    const result = String(arg1 || "");
    return /USER_NOT_FOUND/i.test(result) || result.includes("用户不存在") || result.includes("无此用户") || result.includes("账号已被封禁") || result.includes(BATCH_USER_GONE_REASON);
  }
  function fn22(options = {}) {
    if (!options || typeof options !== "object") {
      return false;
    }
    if (options.userGone) {
      return true;
    }
    if (options.profileUnavailable && /用户不存在|已注销|无此用户|账号已被封禁/.test(String(options.profileUnavailableReason || ""))) {
      return true;
    }
    return /用户不存在|已注销|USER_NOT_FOUND/i.test(String(options.lastBatchSkipReason || options.lastError || ""));
  }
  function isBatchCountedFailure(arg1, options = {}) {
    return fn19(arg1, options) || fn18(arg1, options) || fn20(arg1, options);
  }
  function mapSubviewResultsToBatchPayload(arg1, arg2, arg3) {
    const local = arg2 || {};
    const local2 = local.skipReason || local.error || local.profileUnavailableReason || "";
    const result = fn21(local2, local);
    const local3 = BATCH_USER_GONE_REASON;
    if (arg1 === "profile_first_comment") {
      const local2 = local.skipReason || local.error || "";
      const result2 = fn19(local2, local);
      const result3 = fn18(local2, local);
      const result4 = fn20(local2, local);
      const local4 = result2 || result3 || result4;
      const local5 = !local4 && (result || !!local.skipped || !!local.skipReason);
      const value = local4 ? false : local5 ? false : !!local.success;
      const value2 = result4 ? local2 || "对方账号设置了隐私，未执行关注/私信/首作评论" : result3 ? local2 || "筛选不符" : result2 ? local.error || local2 || "作品数为0" : value && !local5 ? "" : result ? local3 : local.error || local.skipReason || "";
      return {
        leadId: arg3.leadId,
        accountId: arg3.accountId,
        leadName: arg3.nickname,
        leadPlatform: arg3.platform,
        accountName: arg3.accountName,
        ...fn25(arg3),
        success: value,
        skipped: local5,
        skipReason: local4 ? "" : result ? local3 : local.skipReason || "",
        error: value2,
        type: arg1,
        interactionResults: {
          skipped: local5,
          skipReason: local4 ? "" : result ? local3 : local.skipReason || "",
          noWorks: result2,
          isPrivate: local.isPrivate !== undefined ? !!local.isPrivate : result4 || undefined,
          userGone: result || undefined,
          profileUnavailable: result ? true : local.profileUnavailable || undefined,
          profileUnavailableReason: result ? local3 : local.profileUnavailableReason || undefined,
          profileFirstTargetFiltered: !!local.profileFirstTargetFiltered || result3,
          demographicFilterFailed: !!local.demographicFilterFailed || result3,
          profileCommented: !!local.success && !local4 && !local5,
          replyContent: local.content || "",
          worksCount: local.worksCount,
          gender: local.gender,
          age: local.age,
          location: local.location,
          douyinId: local.douyinId,
          signature: local.signature,
          profileCommentAt: local.profileCommentAt || arg3.profileCommentAt,
          lastTouchAt: local.lastTouchAt || arg3.lastTouchAt,
          touchCounts: local.touchCounts || arg3.touchCounts,
          touchLog: local.touchLog || arg3.touchLog
        }
      };
    }
    const flag = !!local.followed;
    const flag2 = !!local.messaged;
    const local4 = local.skipReason || local.error || "";
    const result2 = fn18(local4, local);
    const result3 = fn20(local4, local);
    const local5 = result2 || result3;
    const local6 = !local5 && (result || !!local.skipped);
    const value = local5 ? false : local6 ? false : flag || flag2;
    const value2 = local.worksCount !== undefined && local.worksCount !== null ? local.worksCount : arg3.worksCount !== undefined ? arg3.worksCount : undefined;
    const value3 = local.isPrivate !== undefined ? !!local.isPrivate : arg3.isPrivate !== undefined ? !!arg3.isPrivate : undefined;
    return {
      leadId: arg3.leadId,
      accountId: arg3.accountId,
      leadName: arg3.nickname,
      leadPlatform: arg3.platform,
      accountName: arg3.accountName,
      ...fn25(arg3),
      success: value,
      skipped: local6,
      skipReason: local5 ? "" : result ? local3 : local.skipReason || "",
      error: result3 ? local4 || "对方账号设置了隐私，未执行关注/私信" : result2 ? local4 || "筛选不符" : local6 ? result ? local3 : local.skipReason || "过滤跳过" : local.error || (value ? "" : "互动未完成"),
      type: arg1,
      interactionResults: {
        followed: flag,
        messaged: flag2,
        dmContent: local.dmContent,
        skipped: local6,
        skipReason: local5 ? "" : result ? local3 : local.skipReason || "",
        demographicFilterFailed: !!local.demographicFilterFailed || result2,
        worksCount: value2,
        isPrivate: value3 !== undefined ? value3 : result3 || undefined,
        userGone: result || undefined,
        profileUnavailable: result ? true : local.profileUnavailable || undefined,
        profileUnavailableReason: result ? local3 : local.profileUnavailableReason || undefined,
        gender: local.gender,
        age: local.age,
        location: local.location,
        douyinId: local.douyinId,
        signature: local.signature,
        profileCommentAt: local.profileCommentAt || arg3.profileCommentAt,
        lastTouchAt: local.lastTouchAt || arg3.lastTouchAt,
        touchCounts: local.touchCounts || arg3.touchCounts,
        touchLog: local.touchLog || arg3.touchLog
      }
    };
  }
  function resolveViewKeyFromSender(arg1) {
    if (!arg1) {
      return null;
    }
    for (const [local, local2] of getPlatformViews().entries()) {
      if (local2.webContents === arg1) {
        return local;
      }
    }
    return inferInteractionViewKey(arg1);
  }
  function fn27() {
    return 10000 + Math.floor(Math.random() * 10001);
  }
  function fn28(text = "") {
    try {
      let result = String(text || "").trim();
      if (!result) {
        return "";
      }
      if (result.startsWith("//")) {
        result = "https:" + result;
      }
      if (!/^https?:\/\//i.test(result)) {
        result = "https://www.douyin.com" + (result.startsWith("/") ? result : "/" + result);
      }
      const url = new URL(result);
      const result2 = url.pathname.match(/\/user\/(?:profile\/)?([^/?#]+)/i);
      if (!result2?.[1]) {
        return "";
      }
      const result3 = decodeURIComponent(result2[1]);
      if (!result3 || ["self", "login"].includes(result3.toLowerCase())) {
        return "";
      }
      return result3;
    } catch (error) {
      return "";
    }
  }
  function fn29(arg1) {
    const result = String(arg1 || "").trim();
    return result.length >= 15 && !["self", "login", "anonymous", "undefined", "null"].includes(result.toLowerCase()) && !result.startsWith("name:") && !result.startsWith("live_") && !/^uid:\d+$/i.test(result) && !/^webcast:/i.test(result) && !/^video:\d+$/i.test(result) && /^[A-Za-z0-9_-]+$/.test(result);
  }
  function fn25(options = {}) {
    const result = String(options.userUrl || options.profileUrl || "").trim();
    const result2 = fn28(result);
    const result3 = String(options.secUid || options.sec_uid || "").trim();
    const value = fn29(options.leadId) ? String(options.leadId).trim() : "";
    const local = fn29(result3) && result3 || fn29(result2) && result2 || value || "";
    let text = "";
    if (result && !/(?:video|note)\/\d{10,}/i.test(result)) {
      try {
        const url = new URL(result.startsWith("http") ? result : "https://www.douyin.com" + (result.startsWith("/") ? result : "/" + result));
        text = ("" + url.origin + url.pathname).replace(/\/$/, "");
      } catch (error) {
        text = result;
      }
    }
    if (!text && local) {
      text = "https://www.douyin.com/user/" + local;
    }
    return {
      userUrl: text,
      secUid: local
    };
  }
  async function fn30(arg1, options = {}) {
    const obj = {
      alive: false,
      loading: false,
      blankPage: true,
      networkError: false,
      onProfile: false,
      onVideoDetail: false,
      sameUser: false,
      worksCards: 0,
      panelOpen: false,
      commentInputHint: false,
      href: "",
      textLength: 0
    };
    const result = getInteractionViewsMap().get(arg1);
    if (!result?.webContents || result.webContents.isDestroyed()) {
      return obj;
    }
    const result2 = fn28(options?.userUrl || options?.profileUrl || "");
    try {
      const result3 = await result.webContents.executeJavaScript("(() => {\n                try {\n                    const href = String(location.href || '');\n                    const text = String(document.body?.innerText || '').trim().slice(0, 2400);\n                    const textLength = text.length;\n                    const blankPage = !text || textLength < 8 || href === 'about:blank';\n                    const networkError = /网络不太顺畅|无法访问此网站|刷新一下|err_name_not_resolved|err_connection|err_timed_out|err_aborted|net::err_/i.test(text);\n                    const loadingText = /加载中|正在加载|请稍候|稍后再试/.test(text);\n                    let loadingEl = false;\n                    try {\n                        loadingEl = Array.from(document.querySelectorAll(\n                            '[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]'\n                        )).some((el) => {\n                            const r = el.getBoundingClientRect();\n                            return r.width >= 6 && r.height >= 6 && r.bottom > 0 && r.top < (window.innerHeight || 800);\n                        });\n                    } catch (_) { loadingEl = false; }\n                    const onProfile = /\\/user\\//i.test(href);\n                    const onVideoDetail = /\\/(?:video|note)\\//i.test(href) || /modal_id=/i.test(href);\n                    let worksCards = 0;\n                    try {\n                        const root = document.querySelector('[data-e2e=\"user-post-list\"]') || document.body;\n                        worksCards = Array.from(root.querySelectorAll(\n                            'a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]'\n                        )).filter((el) => {\n                            const r = el.getBoundingClientRect();\n                            return r.width >= 60 && r.height >= 60;\n                        }).length;\n                    } catch (_) { worksCards = 0; }\n                    const panel = document.querySelector(\n                        '[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-list\"], [class*=\"CommentList\"]'\n                    );\n                    let panelOpen = false;\n                    if (panel) {\n                        const pr = panel.getBoundingClientRect();\n                        panelOpen = pr.height > 60 && pr.width > 60;\n                    }\n                    const commentInputHint = /说点什么|留下你的评论|友善交流|写评论/.test(text)\n                        || !!document.querySelector('[contenteditable=\"true\"], textarea[placeholder*=\"评论\"], [data-e2e*=\"comment-input\"]');\n                    let currentUid = '';\n                    try {\n                        const m = href.match(/\\/user\\/(?:profile\\/)?([^/?#]+)/i);\n                        if (m && m[1] && !['self', 'login'].includes(String(m[1]).toLowerCase())) {\n                            currentUid = decodeURIComponent(m[1]);\n                        }\n                    } catch (_) {}\n                    return {\n                        href,\n                        textLength,\n                        blankPage,\n                        networkError,\n                        loading: loadingText || loadingEl,\n                        onProfile,\n                        onVideoDetail,\n                        worksCards,\n                        panelOpen,\n                        commentInputHint,\n                        currentUid,\n                    };\n                } catch (err) {\n                    return {\n                        href: '',\n                        textLength: 0,\n                        blankPage: true,\n                        networkError: false,\n                        loading: false,\n                        onProfile: false,\n                        onVideoDetail: false,\n                        worksCards: 0,\n                        panelOpen: false,\n                        commentInputHint: false,\n                        currentUid: '',\n                        error: String(err && err.message || err || ''),\n                    };\n                }\n            })()", true);
      const result4 = String(result3?.currentUid || "");
      return {
        alive: true,
        loading: !!result3?.loading,
        blankPage: !!result3?.blankPage,
        networkError: !!result3?.networkError,
        onProfile: !!result3?.onProfile,
        onVideoDetail: !!result3?.onVideoDetail,
        sameUser: !!result2 && !!result4 && result2 === result4,
        worksCards: Number(result3?.worksCards) || 0,
        panelOpen: !!result3?.panelOpen,
        commentInputHint: !!result3?.commentInputHint,
        href: String(result3?.href || ""),
        textLength: Number(result3?.textLength) || 0
      };
    } catch (error) {
      return {
        ...obj,
        blankPage: true
      };
    }
  }
  function fn31(options = {}, text = "", text2 = "") {
    const result = ((text || "") + " " + (text2 || "")).toLowerCase();
    if (!options.alive) {
      return {
        reload: true,
        reason: "互动页已失效"
      };
    }
    if (options.blankPage && !options.onProfile && !options.onVideoDetail) {
      return {
        reload: true,
        reason: "页面几乎空白，可能加载失败"
      };
    }
    if (options.networkError && options.blankPage) {
      return {
        reload: true,
        reason: "页面提示网络异常且内容不可用"
      };
    }
    if (result.includes("子视图切换失败") || result.includes("互动子视图创建失败") || result.includes("profile_url_mismatch") || result.includes("navigation") || /net::err_|err_aborted|err_timed_out|err_connection/.test(result)) {
      return {
        reload: true,
        reason: "导航/创建类错误，需重开主页"
      };
    }
    if (options.onProfile && (options.sameUser || !fn28(options.href))) {
      if (result.includes("profile_works_not_ready") || result.includes("作品区未就绪") || result.includes("作品区加载超时") || result.includes("主页打开超时") || result.includes("主页加载超时") || result.includes("profile_ready_timeout") || result.includes("interaction-timeout")) {
        return {
          reload: false,
          reason: options.loading ? "目标主页仍在加载，先等待后原地再跑" : options.worksCards > 0 ? "目标主页仍在（可见作品卡 " + options.worksCards + "），先等待后原地再跑" : "仍在目标主页，先等待后原地再跑"
        };
      }
    }
    if (options.onVideoDetail || options.onProfile && (options.panelOpen || options.commentInputHint)) {
      if (result.includes("comment_input_not_found") || result.includes("未找到评论输入框") || result.includes("profile_video_detail_resume_failed") || result.includes("详情续跑未就绪") || result.includes("作品详情续跑")) {
        return {
          reload: false,
          reason: options.loading ? "作品详情/评论区仍在加载，先等待后原地再跑" : options.panelOpen ? "评论区仍在，先等待后原地再跑" : "仍在作品详情页，先等待后原地再跑"
        };
      }
    }
    if (options.sameUser && (options.onProfile || options.onVideoDetail)) {
      return {
        reload: false,
        reason: options.loading ? "仍在目标用户页且加载中，先等待后原地再跑" : "仍在目标用户页，先等待后原地再跑"
      };
    }
    return {
      reload: true,
      reason: "当前页已偏离目标用户，需重开主页"
    };
  }
  function fn32(arg1, arg2, arg3, arg4, arg5) {
    const result = getInteractionLocksMap();
    if (flag || num !== arg4) {
      finishInteraction(arg1, {
        success: false,
        error: "batch_stopped"
      }, "retry-cancelled");
      return false;
    }
    const result2 = getInteractionViewsMap().get(arg1);
    if (!result2?.webContents || result2.webContents.isDestroyed()) {
      return false;
    }
    let result3 = result.get(arg1);
    const local = result3?.successCheckpoint;
    if (local?.success && local?.profileWorkCommented) {
      const local2 = getPendingBatchByViewKey().get(arg1) || {
        lead: arg2,
        config: arg3,
        runId: arg4
      };
      console.warn("[Batch] [" + arg1 + "] 原地再跑前已有首作评论成功检查点，直接完结 @" + (arg2.nickname || ""));
      fn3(arg1, "success-checkpoint-before-inplace");
      Promise.resolve(completeBatchFromInteraction(arg1, local2, local, result2.webContents)).then(arg12 => {
        if (arg12 !== "retry-scheduled") {
          finishInteraction(arg1, local, "success-checkpoint");
        }
      }).catch(() => finishInteraction(arg1, local, "success-checkpoint"));
      return true;
    }
    fn3(arg1, "batch-inplace-retry", {
      attempt: arg5
    });
    const value = Date.now() + "_inplace_" + Math.random().toString(36).slice(2, 8);
    const obj = {
      ...buildBatchInteractionTask(arg2, arg3, arg1),
      batchRunId: arg4,
      viewKey: arg1,
      interactionId: value,
      createdAt: Date.now(),
      __batchInPlaceRetry: arg5
    };
    const result4 = fn(obj);
    result3 = result.get(arg1);
    if (!result3) {
      const result5 = getPlatformViews().get(arg1);
      const result6 = resolveInteractionViewportBounds(arg1, result5, result2, null);
      result3 = {
        bounds: result6,
        zoomFactor: result5?.webContents && !result5.webContents.isDestroyed() ? result5.webContents.getZoomFactor() : 1,
        previewBounds: result6 ? {
          ...result6
        } : null,
        previewZoomFactor: result5?.webContents && !result5.webContents.isDestroyed() ? result5.webContents.getZoomFactor() : 1,
        startedAt: Date.now(),
        interactionId: value,
        timeoutMs: result4,
        successCheckpoint: null,
        visibleSwapReady: true,
        timer: null,
        taskDispatchTimer: null,
        profileOpenTimer: null,
        profileOpenReady: true,
        onTimeout: null,
        onProfileOpenTimeout: null
      };
      result.set(arg1, result3);
    } else {
      if (result3.timer) {
        clearTimeout(result3.timer);
      }
      if (result3.taskDispatchTimer) {
        clearTimeout(result3.taskDispatchTimer);
      }
      if (result3.profileOpenTimer) {
        clearTimeout(result3.profileOpenTimer);
        result3.profileOpenTimer = null;
      }
      result3.interactionId = value;
      result3.startedAt = Date.now();
      result3.timeoutMs = result4;
      result3.profileOpenReady = true;
    }
    result3.onTimeout = () => {
      const result3 = result.get(arg1);
      if (!result3 || result3.interactionId !== value) {
        return;
      }
      const value2 = result3.successCheckpoint;
      const result4 = getPendingBatchByViewKey().get(arg1);
      if (value2?.success && value2?.profileWorkCommented && result4?.runId === num) {
        Promise.resolve(completeBatchFromInteraction(arg1, result4, value2, result2.webContents)).then(arg12 => {
          if (arg12 !== "retry-scheduled") {
            finishInteraction(arg1, value2, "success-checkpoint");
          }
        }).catch(() => finishInteraction(arg1, value2, "success-checkpoint"));
        return;
      }
      if (result4 && result4.runId === num) {
        Promise.resolve(completeBatchFromInteraction(arg1, result4, {
          success: false,
          error: "interaction-timeout"
        }, result2.webContents)).then(arg12 => {
          if (arg12 !== "retry-scheduled") {
            finishInteraction(arg1, {
              followed: false,
              messaged: false,
              error: "interaction-timeout"
            }, "timeout");
          }
        }).catch(() => {
          finishInteraction(arg1, {
            followed: false,
            messaged: false,
            error: "interaction-timeout"
          }, "timeout");
        });
        return;
      }
      finishInteraction(arg1, {
        followed: false,
        messaged: false,
        error: "interaction-timeout"
      }, "timeout");
    };
    result3.timer = setTimeout(result3.onTimeout, result4);
    getPendingBatchByViewKey().set(arg1, {
      lead: arg2,
      config: arg3,
      runId: arg4
    });
    try {
      result2.webContents.send("interaction-prepare-task", obj);
      console.warn("[Batch] [" + arg1 + "] 第 " + arg5 + " 次原地再跑 @" + (arg2.nickname || "") + "（不重载）");
      return true;
    } catch (error) {
      console.warn("[Batch] [" + arg1 + "] 原地再派发失败:", error?.message || error);
      return false;
    }
  }
  function fn34(arg1, arg2, arg3, arg4, arg5, arg6, text = "", options = {}) {
    try {
      const result = getInteractionViewsMap().get(arg1);
      if (result?.webContents && !result.webContents.isDestroyed()) {
        result.webContents.stop();
      }
    } catch (error) {}
    getPendingBatchByViewKey().delete(arg1);
    finishInteraction(arg1, {
      success: false,
      error: arg6
    }, "retry-cleanup");
    const result = getBatchActionQueueMap();
    const result2 = result.get(arg1);
    if (result2) {
      result2.unshift({
        lead: arg2,
        config: arg3
      });
    } else {
      result.set(arg1, [{
        lead: arg2,
        config: arg3
      }]);
    }
    const value = options.immediate ? 800 : fn27();
    console.warn("[Batch] [" + arg1 + "] " + Math.round(value / 1000) + " 秒后进行第 " + arg5 + " 次主页重开" + ("" + (text ? "（" + text + "）" : "")));
    setTimeout(() => {
      if (!flag && num === arg4) {
        dispatchNextBatchItem(arg1, arg4, "profile-load-retry-" + arg5);
      }
    }, value);
  }
  function fn35(arg1, text = "") {
    if (!arg1 && !text) {
      return false;
    }
    const result = ((arg1 || "") + " " + (text || "")).toLowerCase();
    if (result.includes("user_not_found") || result.includes("用户不存在") || result.includes("无此用户") || result.includes("账号已被封禁") || result.includes("可能已注销")) {
      return false;
    }
    return result.includes("interaction-timeout") || result.includes("profile_ready_timeout") || result.includes("profile_works_not_ready") || result.includes("作品区未就绪") || result.includes("作品区加载超时") || result.includes("profile_video_detail_resume_failed") || result.includes("详情续跑未就绪") || result.includes("作品详情续跑") || result.includes("comment_input_not_found") || result.includes("未找到评论输入框") || result.includes("profile_url_mismatch") || result.includes("主页加载超时") || result.includes("主页打开超时") || result.includes("子视图切换失败") || result.includes("互动子视图创建失败") || result.includes("加载失败") || result.includes("net::err_") || result.includes("页面加载") || result.includes("navigation") || result.includes("err_aborted") || result.includes("err_timed_out") || result.includes("err_connection");
  }
  async function completeBatchFromInteraction(arg1, arg2, arg3, arg4) {
    const {
      lead: lead,
      config: config,
      runId: runId
    } = arg2;
    const local = arg3?.error || arg3?.errorCode || "";
    const local2 = arg3?.errorCode || "";
    if (!arg3?.success && fn35(local, local2)) {
      const value = arg1 + ":" + (lead.leadId || lead.nickname);
      const local3 = map3.get(value) || 0;
      if (local3 < BATCH_PROFILE_LOAD_MAX_RETRIES) {
        map3.set(value, local3 + 1);
        const value2 = local3 + 1;
        const result = await fn30(arg1, lead);
        const result2 = fn31(result, local2, local);
        console.warn("[Batch] [" + arg1 + "] 主页/详情未就绪，第 " + value2 + "/" + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次重试: @" + lead.nickname + (" (" + local + ") → " + (result2.reload ? "重开主页" : "原地再跑") + "（" + result2.reason + "；") + ("加载中=" + (result.loading ? "是" : "否") + "，主页=" + (result.onProfile ? "是" : "否") + "，") + ("详情=" + (result.onVideoDetail ? "是" : "否") + "，作品卡=" + result.worksCards + "）"));
        pushAutomationTrace("⚠️ @" + (lead.nickname || "未知") + " " + (result2.reload ? "需重开主页" : "先原地再试") + ("（" + local + "；" + result2.reason + "），第 " + value2 + "/" + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次"), lead.accountId, {
          runId: runId,
          viewKey: arg1,
          phase: "retry",
          level: "warning",
          leadName: lead.nickname || ""
        });
        appendBatchFollowLog(runId, {
          message: "@" + (lead.nickname || "未知") + " " + (result2.reload ? "将重开主页" : "将原地再跑") + ("（" + local + "；" + result2.reason + "），第 " + value2 + " 次…"),
          level: "warning",
          accountId: lead.accountId,
          accountName: lead.accountName || "",
          viewKey: arg1,
          leadId: lead.leadId,
          leadName: lead.nickname || "",
          phase: "retry"
        });
        if (!result2.reload) {
          const result = fn27();
          console.warn("[Batch] [" + arg1 + "] 不重载，" + Math.round(result / 1000) + " 秒后原地再跑 @" + (lead.nickname || ""));
          fn3(arg1, "batch-inplace-retry-wait", {
            attempt: value2
          });
          const result2 = getInteractionLocksMap();
          const result3 = result2.get(arg1);
          if (result3?.successCheckpoint?.success && result3.successCheckpoint?.profileWorkCommented) {
            console.warn("[Batch] [" + arg1 + "] 超时瞬间已有首作成功检查点，取消原地重试并完结");
            const value = result3.successCheckpoint;
            Promise.resolve(completeBatchFromInteraction(arg1, arg2, value, arg4)).then(arg12 => {
              if (arg12 !== "retry-scheduled") {
                finishInteraction(arg1, value, "success-checkpoint");
              }
            }).catch(() => finishInteraction(arg1, value, "success-checkpoint"));
            return "retry-scheduled";
          }
          if (result3) {
            if (result3.timer) {
              clearTimeout(result3.timer);
            }
            if (result3.taskDispatchTimer) {
              clearTimeout(result3.taskDispatchTimer);
            }
            if (result3.profileOpenTimer) {
              clearTimeout(result3.profileOpenTimer);
              result3.profileOpenTimer = null;
            }
            result3.profileOpenReady = true;
            const value = "batch_wait_retry_" + Date.now();
            result3.interactionId = value;
            result3.timer = setTimeout(() => {
              const result = result2.get(arg1);
              if (!result || result.interactionId !== value) {
                return;
              }
              if (result.successCheckpoint?.success && result.successCheckpoint?.profileWorkCommented) {
                const value = result.successCheckpoint;
                console.warn("[Batch] [" + arg1 + "] 原地等待期间收到成功检查点，完结而非重开 @" + (lead.nickname || ""));
                Promise.resolve(completeBatchFromInteraction(arg1, arg2, value, arg4)).then(arg12 => {
                  if (arg12 !== "retry-scheduled") {
                    finishInteraction(arg1, value, "success-checkpoint");
                  }
                }).catch(() => finishInteraction(arg1, value, "success-checkpoint"));
                return;
              }
              console.warn("[Batch] [" + arg1 + "] 原地等待超时，改为重开主页 @" + (lead.nickname || ""));
              fn34(arg1, lead, config, runId, value2, local, "原地等待超时", {
                immediate: true
              });
            }, result + 90000);
          }
          setTimeout(() => {
            (async () => {
              if (flag || num !== runId) {
                getPendingBatchByViewKey().delete(arg1);
                finishInteraction(arg1, {
                  success: false,
                  error: "batch_stopped"
                }, "retry-cancelled");
                return;
              }
              const result = getInteractionLocksMap();
              const result2 = result.get(arg1);
              if (result2?.successCheckpoint?.success && result2.successCheckpoint?.profileWorkCommented) {
                const value = result2.successCheckpoint;
                console.warn("[Batch] [" + arg1 + "] 原地等待结束前已成功，跳过再跑 @" + (lead.nickname || ""));
                Promise.resolve(completeBatchFromInteraction(arg1, arg2, value, arg4)).then(arg12 => {
                  if (arg12 !== "retry-scheduled") {
                    finishInteraction(arg1, value, "success-checkpoint");
                  }
                }).catch(() => finishInteraction(arg1, value, "success-checkpoint"));
                return;
              }
              const result3 = await fn30(arg1, lead);
              const result4 = fn31(result3, local2, local);
              if (!result4.reload && result3.onProfile && (result3.sameUser || result3.worksCards > 0 || result3.loading)) {
                const result = fn32(arg1, lead, config, runId, value2);
                if (result) {
                  return;
                }
              }
              console.warn("[Batch] [" + arg1 + "] 原地条件不再满足（" + result4.reason + "），改为重开主页");
              fn34(arg1, lead, config, runId, value2, local, result4.reason, {
                immediate: true
              });
            })().catch(arg12 => {
              console.warn("[Batch] [" + arg1 + "] 原地重试异常，改为重开:", arg12?.message || arg12);
              fn34(arg1, lead, config, runId, value2, local, "原地重试异常", {
                immediate: true
              });
            });
          }, result);
          return "retry-scheduled";
        }
        fn34(arg1, lead, config, runId, value2, local, result2.reason);
        return "retry-scheduled";
      }
      map3.delete(value);
      arg3 = {
        ...arg3,
        error: "主页加载超时，已重试" + BATCH_PROFILE_LOAD_MAX_RETRIES + "次仍失败（" + local + "）"
      };
      console.error("[Batch] [" + arg1 + "] 主页加载重试 " + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次后仍失败: @" + lead.nickname);
      appendBatchFollowLog(runId, {
        message: "@" + (lead.nickname || "未知") + " 主页加载重试 " + BATCH_PROFILE_LOAD_MAX_RETRIES + " 次后仍失败，已跳过",
        level: "error",
        accountId: lead.accountId,
        accountName: lead.accountName || "",
        viewKey: arg1,
        leadId: lead.leadId,
        leadName: lead.nickname || "",
        phase: "retry-exhausted"
      });
    } else {
      const value = arg1 + ":" + (lead.leadId || lead.nickname);
      map3.delete(value);
    }
    getPendingBatchByViewKey().delete(arg1);
    const result = mapSubviewResultsToBatchPayload(config.type, arg3, lead);
    const result2 = getInteractionViewsMap().get(arg1);
    const local3 = arg4 && typeof arg4.isDestroyed === "function" && !arg4.isDestroyed();
    const obj = {
      sender: (local3 ? arg4 : null) || result2?.webContents || getPlatformViews().get(arg1)?.webContents
    };
    processBatchItemFinished(obj, result, runId, arg1);
    return "completed";
  }
  function runInteractionStart(arg1, arg2, arg3) {
    const local = getLastInteractionFinishedAtByViewKey().get(arg1) || 0;
    const value = Date.now() - local;
    const result = Math.max(0, SUBVIEW_HANDOFF_MIN_GAP_MS - value);
    if (result > 0) {
      console.log("[Main] [子视图模式] 距上次互动结束 " + value + "ms，缓冲 " + result + "ms 后再打开下一主页");
      setTimeout(() => {
        if (arg3?.isBatchAction && arg3?.batchRunId !== num) {
          console.log("[Batch] 忽略旧代次的延迟互动启动 (" + arg1 + ", run " + arg3?.batchRunId + ")");
          return;
        }
        const result = fn38(arg1, arg2, arg3);
        if (result || !arg3?.isBatchAction) {
          return;
        }
        const result2 = getPendingBatchByViewKey().get(arg1);
        if (!result2 || arg3?.batchRunId != null && result2.runId !== arg3.batchRunId) {
          return;
        }
        console.error("[Batch] [" + arg1 + "] 延迟启动子视图失败，回传失败结果");
        Promise.resolve(completeBatchFromInteraction(arg1, result2, {
          success: false,
          error: "子视图切换失败"
        }, getInteractionViewsMap().get(arg1)?.webContents || getPlatformViews().get(arg1)?.webContents)).then(arg12 => {
          if (arg12 === "retry-scheduled") {
            return;
          }
          finishInteraction(arg1, {
            success: false,
            error: "子视图切换失败"
          }, "delayed-start-failed");
        }).catch(() => {
          finishInteraction(arg1, {
            success: false,
            error: "子视图切换失败"
          }, "delayed-start-failed");
        });
      }, result);
      return true;
    }
    return fn38(arg1, arg2, arg3);
  }
  function ensureInteractionView(arg1) {
    cancelInteractionViewIdleCleanup(arg1);
    const result = getInteractionViewsMap();
    const result2 = result.get(arg1);
    if (result2 && !result2.webContents.isDestroyed()) {
      return result2;
    }
    if (result2) {
      result.delete(arg1);
    }
    const result3 = getPlatformViews().get(arg1);
    const result4 = getMainWindow();
    if (!result3 || !result4 || result4.isDestroyed()) {
      return null;
    }
    const result5 = getViewSettingsMap();
    const local = result5.get(arg1) || {};
    const local2 = local.platform || result5.get(arg1 + "_platform") || arg1.split("_")[0] || "douyin";
    const browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        preload: resolveAutomationPreloadPath(),
        partition: "persist:automation:" + arg1,
        backgroundThrottling: false,
        spellcheck: false
      }
    });
    browserView.setBackgroundColor("#111827");
    browserView.setBounds({
      x: -5000,
      y: -5000,
      width: COMPACT_BACKGROUND_AUTOMATION_WIDTH,
      height: COMPACT_BACKGROUND_AUTOMATION_HEIGHT
    });
    attachProtocolGuard(browserView.webContents, arg1 + ":interaction");
    attachAutomationViewStabilityGuards(browserView, arg1, {
      isInteraction: true
    });
    configureAutomationSession(browserView.webContents.session, arg1);
    if (local2 === "xianyu") {
      configureXianyuSession(browserView.webContents.session);
    }
    browserView.webContents.setUserAgent(automationUserAgent);
    browserView.webContents.setAudioMuted(store.get("system_video_muted", true));
    browserView.webContents.on("did-fail-load", (arg12, arg2, arg3, arg4, arg5) => {
      if (arg4?.includes("bytedance.net") || arg4?.includes("douyin.com")) {
        console.warn("[Network][" + arg1 + ":interaction] did-fail-load code=" + arg2 + " main=" + arg5 + " " + arg3 + " " + arg4);
      }
    });
    registerWebContentsLogger(browserView.webContents, local2, true);
    browserView.webContents.on("dom-ready", () => {
      runtimeConfig.ensureAndPushToWebContents(browserView.webContents);
    });
    result.set(arg1, browserView);
    runtimeConfig.ensureAndPushToWebContents(browserView.webContents);
    console.log("[Perf] 已按需创建互动视图: " + arg1);
    return browserView;
  }
  function fn38(arg1, arg2, arg3) {
    const result = getPlatformViews();
    const result2 = getInteractionLocksMap();
    const result3 = getMainWindow();
    const result4 = getBackgroundDetachedViewKeys();
    const result5 = getBackgroundLayoutHoldViewKeys();
    const result6 = result.get(arg1);
    const result7 = ensureInteractionView(arg1);
    if (!result6 || !result7 || !result3) {
      if (result7) {
        scheduleInteractionViewIdleCleanup(arg1);
      }
      return false;
    }
    const result8 = result2.get(arg1);
    const result9 = resolveInteractionViewportBounds(arg1, result6, result7, result8);
    if (!isValidAutomationBounds(result9)) {
      console.warn("[Main] 无法解析互动视口坐标，取消子视图切换: " + arg1);
      scheduleInteractionViewIdleCleanup(arg1);
      return false;
    }
    console.log("[Main] [子视图模式] 切换至互动视图: " + arg2 + " (坐标: " + result9.x + ", " + result9.y + ")");
    const result10 = result2.get(arg1);
    if (result10?.timer) {
      clearTimeout(result10.timer);
    }
    if (result10?.taskDispatchTimer) {
      clearTimeout(result10.taskDispatchTimer);
    }
    if (result10?.loadListener) {
      result7.webContents.removeListener("did-finish-load", result10.loadListener);
    }
    const value = Date.now() + "_" + Math.random().toString(36).slice(2);
    const result11 = fn(arg3);
    const obj = {
      bounds: result9,
      zoomFactor: result6.webContents.getZoomFactor(),
      previewBounds: {
        ...result9
      },
      previewZoomFactor: result6.webContents.getZoomFactor(),
      startedAt: Date.now(),
      interactionId: value,
      timeoutMs: result11,
      successCheckpoint: null,
      visibleSwapReady: false,
      timer: null,
      taskDispatchTimer: null,
      profileOpenTimer: null,
      profileOpenReady: false,
      onTimeout: null,
      onProfileOpenTimeout: null
    };
    obj.onTimeout = () => {
      const result = result2.get(arg1);
      if (!result || result.interactionId !== value) {
        return;
      }
      if (result.profileOpenTimer) {
        clearTimeout(result.profileOpenTimer);
        result.profileOpenTimer = null;
      }
      const value2 = result.successCheckpoint;
      const result3 = getPendingBatchByViewKey().get(arg1);
      if (value2?.success && value2?.profileWorkCommented && result3?.runId === num) {
        console.warn("[Batch] [" + arg1 + "] 首作评论成功回调迟到，使用成功检查点完成本条，避免误记 interaction-timeout");
        Promise.resolve(completeBatchFromInteraction(arg1, result3, value2, result7.webContents)).then(arg12 => {
          if (arg12 !== "retry-scheduled") {
            finishInteraction(arg1, value2, "success-checkpoint");
          }
        }).catch(() => finishInteraction(arg1, value2, "success-checkpoint"));
        return;
      }
      console.warn("[Main] [子视图模式] 互动超时，强制恢复主视图: " + arg1);
      if (result3 && result3.runId === num) {
        Promise.resolve(completeBatchFromInteraction(arg1, result3, {
          success: false,
          error: "interaction-timeout"
        }, result7.webContents)).then(arg12 => {
          if (arg12 !== "retry-scheduled") {
            finishInteraction(arg1, {
              followed: false,
              messaged: false,
              error: "interaction-timeout"
            }, "timeout");
          }
        }).catch(() => {
          finishInteraction(arg1, {
            followed: false,
            messaged: false,
            error: "interaction-timeout"
          }, "timeout");
        });
        return;
      }
      finishInteraction(arg1, {
        followed: false,
        messaged: false,
        error: "interaction-timeout"
      }, "timeout");
    };
    obj.timer = setTimeout(obj.onTimeout, result11);
    if (arg3?.isBatchAction) {
      obj.onProfileOpenTimeout = async () => {
        const result = result2.get(arg1);
        if (!result || result.interactionId !== value) {
          return;
        }
        if (result.profileOpenReady) {
          return;
        }
        try {
          if (result7?.webContents && !result7.webContents.isDestroyed()) {
            const result2 = await result7.webContents.executeJavaScript("\n                            !!(document.querySelector('a[href*=\"/user/\"]') || document.querySelector('.user-info') || document.querySelector('[data-e2e=\"user-info\"]') || (document.body && document.body.innerText && (document.body.innerText.includes('获赞') || document.body.innerText.includes('作品'))))\n                        ").catch(() => false);
            if (result2) {
              console.warn("[Batch] [" + arg1 + "] 主页加载事件虽阻塞，但 DOM 核心节点已就绪，跳过超时拦截继续跟进");
              result.profileOpenReady = true;
              return;
            }
          }
        } catch (error) {}
        result.profileOpenTimer = null;
        const result3 = getPendingBatchByViewKey().get(arg1);
        console.warn("[Batch] [" + arg1 + "] 主页打开超过 " + BATCH_PROFILE_OPEN_TIMEOUT_MS / 1000 + "s 仍未就绪");
        if (result3 && result3.runId === num) {
          Promise.resolve(completeBatchFromInteraction(arg1, result3, {
            success: false,
            error: "主页打开超时"
          }, result7.webContents)).then(arg12 => {
            if (arg12 !== "retry-scheduled") {
              finishInteraction(arg1, {
                followed: false,
                messaged: false,
                error: "主页打开超时"
              }, "profile-open-timeout");
            }
          }).catch(() => {
            finishInteraction(arg1, {
              followed: false,
              messaged: false,
              error: "主页打开超时"
            }, "profile-open-timeout");
          });
        }
      };
      obj.profileOpenTimer = setTimeout(obj.onProfileOpenTimeout, BATCH_PROFILE_OPEN_TIMEOUT_MS);
    }
    result2.set(arg1, obj);
    if (shouldShowInteractionView(arg1)) {
      const result = restoreVisibleInteractionStack(arg1, "runInteractionStart:stage-before-load:" + arg1);
      pushAutomationTrace(result.interactionStaged ? "🖥 用户主页子视图已进入有效视口（底层预热 " + result9.width + "x" + result9.height + "）" : "⚠ 用户主页子视图未获得有效视口，正在重试", arg3?.lead?.accountId, {
        viewKey: arg1,
        phase: "interaction-viewport",
        leadName: arg3?.lead?.nickname || "",
        level: result.interactionStaged ? "normal" : "warning",
        persist: false
      });
    } else {
      attachAutomationViewToBackgroundHost(arg1, result7, {
        active: true,
        force: true
      });
      result4.delete(arg1);
      result5.add(arg1);
      pushAutomationTrace("🖥 用户主页子视图已进入后台稳定视口（" + COMPACT_BACKGROUND_AUTOMATION_WIDTH + "x" + COMPACT_BACKGROUND_AUTOMATION_HEIGHT + "）", arg3?.lead?.accountId, {
        viewKey: arg1,
        phase: "interaction-viewport",
        leadName: arg3?.lead?.nickname || "",
        persist: false
      });
    }
    let flag = false;
    let local = null;
    const local2 = () => {
      if (flag) {
        return Promise.resolve(true);
      }
      if (local) {
        return local;
      }
      local = (async () => {
        const result = result2.get(arg1);
        if (!result || result.interactionId !== value) {
          return false;
        }
        const result8 = shouldShowInteractionView(arg1);
        if (result8) {
          const result = restoreVisibleInteractionStack(arg1, "runInteractionStart:visual-stage:" + arg1);
          if (!result.interactionStaged) {
            console.warn("[Main] [子视图模式] 互动视图未能获得有效视口，暂不下发任务 (" + arg1 + ")");
            return false;
          }
          const result3 = await waitForInteractionViewVisualReady(result7, () => result2.get(arg1)?.interactionId === value);
          if (!result3.ready) {
            console.warn("[Main] [子视图模式] 可见首帧尚未就绪，继续显示主视图 (" + arg1 + ", " + (result3.reason || "unknown") + ")");
            return false;
          }
          if (!shouldShowInteractionView(arg1)) {
            attachAutomationViewToBackgroundHost(arg1, result7, {
              active: true
            });
            result4.delete(arg1);
            result5.add(arg1);
            flag = true;
            return true;
          }
          const result6 = result2.get(arg1);
          if (!result6 || result6.interactionId !== value) {
            return false;
          }
          await new Promise(arg1 => setTimeout(arg1, 420));
          const result8 = result2.get(arg1);
          if (!result8 || result8.interactionId !== value) {
            return false;
          }
          result8.visibleSwapReady = true;
          const result9 = restoreVisibleInteractionStack(arg1, "runInteractionStart:warmed-visible-swap:" + arg1);
          if (!result9.interactionVisible) {
            return false;
          }
          console.log("[Main] [子视图模式] 可见子视图首帧已预热后置顶 (" + arg1 + ", " + result3.reason + ", " + result3.elapsedMs + "ms)");
          pushAutomationTrace("🖥 首作互动画面已就绪并显示（首帧预热 " + result3.elapsedMs + "ms）", arg3?.lead?.accountId, {
            viewKey: arg1,
            phase: "interaction-view",
            leadName: arg3?.lead?.nickname || "",
            persist: false
          });
        } else {
          if (shouldAttachAutomationView(arg1)) {
            restoreForegroundAutomationRendering(result6.webContents);
            if (!result3.getBrowserViews().includes(result6)) {
              result3.addBrowserView(result6);
            }
            if (!isValidAutomationBounds(result6.getBounds()) && isValidAutomationBounds(result9)) {
              result6.setBounds(result9);
            }
            safeSetTopBrowserView(result6, {
              context: "runInteractionStart:keep-preview:" + arg1
            });
          } else {
            suspendOccludedAutomationRendering(result6.webContents);
            if (canParkAutomationViewInMainWindow()) {
              parkAutomationViewInMainWindow(arg1, result6);
            }
          }
          attachAutomationViewToBackgroundHost(arg1, result7, {
            active: true
          });
          result4.delete(arg1);
          result5.add(arg1);
        }
        flag = true;
        if (result8) {
          focusAutomationWebContentsSafely(result7.webContents);
        }
        return true;
      })().finally(() => {
        if (!flag) {
          local = null;
        }
      });
      return local;
    };
    const result12 = result2.get(arg1);
    const obj2 = {
      ...arg3,
      viewKey: arg1,
      interactionId: value,
      createdAt: Date.now()
    };
    let flag2 = false;
    const local3 = async () => {
      if (flag2) {
        return;
      }
      const result = await local2();
      const result3 = result2.get(arg1);
      if (!result3 || result3.interactionId !== value) {
        return;
      }
      if (!result) {
        if (result3.taskDispatchTimer) {
          clearTimeout(result3.taskDispatchTimer);
        }
        result3.taskDispatchTimer = setTimeout(() => {
          result3.taskDispatchTimer = null;
          local3();
        }, 600);
        if (typeof result3.taskDispatchTimer.unref === "function") {
          result3.taskDispatchTimer.unref();
        }
        return;
      }
      if (result3.taskDispatchTimer) {
        clearTimeout(result3.taskDispatchTimer);
        result3.taskDispatchTimer = null;
      }
      if (result3.profileOpenTimer) {
        clearTimeout(result3.profileOpenTimer);
        result3.profileOpenTimer = null;
      }
      if (!result7.webContents.isDestroyed()) {
        let local = obj2;
        try {
          if (typeof structuredClone === "function") {
            local = structuredClone(obj2);
          } else {
            local = JSON.parse(JSON.stringify(obj2));
          }
        } catch (error) {
          console.warn("[Main] 子视图任务含不可克隆字段，已做 JSON 降级净化: " + error.message);
          try {
            local = JSON.parse(JSON.stringify(obj2));
          } catch (error) {
            local = {
              viewKey: arg1,
              interactionId: value,
              batchRunId: obj2?.batchRunId,
              createdAt: Date.now(),
              lead: obj2?.lead ? {
                nickname: obj2.lead.nickname,
                leadId: obj2.lead.leadId
              } : undefined,
              canFollow: !!obj2?.canFollow,
              canDM: !!obj2?.canDM,
              canCommentFirstWork: !!obj2?.canCommentFirstWork,
              commentOnProfileFirstWork: !!obj2?.commentOnProfileFirstWork || !!obj2?.canCommentFirstWork,
              profileFirstWorkLikePercent: Number.isFinite(Number(obj2?.profileFirstWorkLikePercent)) ? Math.max(0, Math.min(100, Math.round(Number(obj2.profileFirstWorkLikePercent)))) : 10,
              profileFirstWorkCollectPercent: Number.isFinite(Number(obj2?.profileFirstWorkCollectPercent)) ? Math.max(0, Math.min(100, Math.round(Number(obj2.profileFirstWorkCollectPercent)))) : 10,
              enableWarmup: !!obj2?.enableWarmup,
              followDmDelayMin: obj2?.followDmDelayMin,
              followDmDelayMax: obj2?.followDmDelayMax,
              useRandomSuffix: !!obj2?.useRandomSuffix,
              dmUseRandomSuffix: !!obj2?.dmUseRandomSuffix,
              genderFilter: obj2?.genderFilter || "all",
              profileFirstGenderFilter: obj2?.profileFirstGenderFilter || "all",
              profileFirstAgeFilterEnabled: obj2?.profileFirstAgeFilterEnabled === true,
              profileFirstAgeMin: obj2?.profileFirstAgeMin,
              profileFirstAgeMax: obj2?.profileFirstAgeMax,
              ageFilterEnabled: obj2?.ageFilterEnabled === true,
              ageMin: obj2?.ageMin,
              ageMax: obj2?.ageMax,
              dmContent: obj2?.dmContent || "",
              dmTarget: obj2?.dmTarget === "followed_only" ? "followed_only" : "all",
              commentTemplate: obj2?.commentTemplate || "",
              commentContent: obj2?.commentContent || "",
              commentUseRandomSuffix: !!obj2?.commentUseRandomSuffix,
              videoCommentContent: obj2?.videoCommentContent || "",
              videoCommentMode: obj2?.videoCommentMode || "",
              videoCommentUseRandomSuffix: !!obj2?.videoCommentUseRandomSuffix,
              batchProfileCommentUseAi: !!obj2?.batchProfileCommentUseAi,
              profileFirstCommentUseAi: !!obj2?.profileFirstCommentUseAi,
              aiReplyMode: !!obj2?.aiReplyMode,
              aiRole: obj2?.aiRole || "",
              aiGoal: obj2?.aiGoal || "",
              aiStyle: obj2?.aiStyle || "",
              aiPrompt: obj2?.aiPrompt || "",
              firstPostGoal: obj2?.firstPostGoal || "",
              firstPostStyle: obj2?.firstPostStyle || "",
              firstPostPrompt: obj2?.firstPostPrompt || "",
              videoGoal: obj2?.videoGoal || "",
              videoStyle: obj2?.videoStyle || "",
              videoPrompt: obj2?.videoPrompt || "",
              batchConfig: obj2?.batchConfig,
              enableCommentMention: !!obj2?.enableCommentMention,
              commentMentionNicknames: obj2?.commentMentionNicknames || "",
              commentMentionPosition: obj2?.commentMentionPosition || "before",
              commentMentionPercent: Number.isFinite(Number(obj2?.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(obj2.commentMentionPercent)))) : 100,
              enableVideoCommentMention: !!obj2?.enableVideoCommentMention,
              videoCommentMentionNicknames: obj2?.videoCommentMentionNicknames || "",
              videoCommentMentionPosition: obj2?.videoCommentMentionPosition || "before",
              videoCommentMentionPercent: Number.isFinite(Number(obj2?.videoCommentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(obj2.videoCommentMentionPercent)))) : 100,
              enableCommentExpression: !!obj2?.enableCommentExpression,
              commentExpressionCount: obj2?.commentExpressionCount || 3,
              enableCommentImage: !!obj2?.enableCommentImage,
              commentImagePaths: obj2?.commentImagePaths || [],
              commentImagePath: obj2?.commentImagePath || "",
              enableCommentWithoutText: !!obj2?.enableCommentWithoutText,
              commentAttachmentPercent: Number.isFinite(Number(obj2?.commentAttachmentPercent)) ? Number(obj2.commentAttachmentPercent) : 20,
              enableVideoCommentExpression: !!obj2?.enableVideoCommentExpression,
              videoCommentExpressionCount: obj2?.videoCommentExpressionCount || 3,
              enableVideoCommentImage: !!obj2?.enableVideoCommentImage,
              videoCommentImagePaths: obj2?.videoCommentImagePaths || []
            };
          }
        }
        flag2 = true;
        result7.webContents.send("interaction-prepare-task", local);
      }
    };
    if (result12) {
      result12.loadListener = local3;
    }
    result7.webContents.once("did-finish-load", local3);
    try {
      if (!result7.webContents.isDestroyed()) {
        result7.webContents.send("interaction-preempt", {
          viewKey: arg1,
          url: arg2,
          interactionId: value
        });
      }
    } catch (error) {}
    try {
      if (!result7.webContents.isDestroyed()) {
        result7.webContents.stop();
      }
    } catch (error) {}
    result7.webContents.loadURL(arg2).catch(arg12 => {
      console.warn("[Main] [子视图模式] 互动视图加载失败: " + arg12.message);
      const result = result2.get(arg1);
      if (!result || result.interactionId !== value) {
        return;
      }
      const result3 = getPendingBatchByViewKey().get(arg1);
      if (result3 && arg3?.isBatchAction && result3.runId === num) {
        const value = "页面加载失败: " + (arg12.message || "loadURL failed");
        Promise.resolve(completeBatchFromInteraction(arg1, result3, {
          success: false,
          error: value
        }, result7.webContents)).then(arg12 => {
          if (arg12 !== "retry-scheduled") {
            finishInteraction(arg1, {
              followed: false,
              messaged: false,
              error: value
            }, "load-failed");
          }
        }).catch(() => {
          finishInteraction(arg1, {
            followed: false,
            messaged: false,
            error: value
          }, "load-failed");
        });
      }
    });
    return true;
  }
  function fn40(arg1, arg2) {
    return arg1 + "_" + arg2;
  }
  function dispatchNextBatchItem(arg1, arg2, text = "unknown") {
    const result = fn40(arg1, arg2);
    let local;
    try {
      local = processNextBatchItem(arg1, arg2);
    } catch (error) {
      local = Promise.reject(error);
    }
    Promise.resolve(local).then(() => {
      map4.delete(result);
    }).catch(arg12 => {
      const value = (map4.get(result) || 0) + 1;
      map4.set(result, value);
      console.error("[Batch] [" + arg1 + "] 下一条调度异常 (" + text + ", 第" + value + "次):", arg12);
      const value2 = arg1.includes("_") ? arg1.split("_").slice(1).join("_") : "default";
      pushAutomationTrace("⚠️ 批量调度异常，2 秒后自动恢复（" + (arg12?.message || "未知错误") + "）", value2);
      if (flag || num !== arg2 || !isBatchViewRuntimeActive(arg1)) {
        return;
      }
      setTimeout(() => dispatchNextBatchItem(arg1, arg2, "auto-retry"), 2000);
    });
  }
  async function processNextBatchItem(arg1, arg2 = num) {
    const result = getBatchActionQueueMap();
    const result2 = getIsBatchActionRunningMap();
    const result3 = getViewActiveBatchRunMap();
    const result4 = getPendingBatchByViewKey();
    const result5 = getMainWindow();
    if (arg2 !== num) {
      console.log("[Batch] 忽略过期批量代次回调 (" + arg1 + ")");
      return;
    }
    if (flag) {
      console.log("[Batch] 停止信号已触发，清空队列 (" + arg1 + ")");
      result.delete(arg1);
      result2.set(arg1, false);
      result3.delete(arg1);
      preserveAutomationViewAfterTaskFinish(arg1, "manual_stop");
      const value = arg1.includes("_") ? arg1.split("_").slice(1).join("_") : null;
      if (result5) {
        result5.webContents.send("batch-account-finished", {
          viewKey: arg1,
          accountId: value,
          reason: "manual_stop"
        });
        result5.webContents.send("view-batch-status", {
          viewKey: arg1,
          isRunning: false
        });
      }
      return;
    }
    cancelPendingAutomationViewDestroy(arg1);
    const result6 = result4.get(arg1);
    if (result6 && result6.runId === arg2) {
      console.log("[Batch] [" + arg1 + "] 当前条仍在执行，忽略重复的下一条调度");
      return;
    }
    const result7 = result.get(arg1);
    if (!result7 || result7.length === 0) {
      console.log("[Batch] 视图 " + arg1 + " 的批量任务已全部完成");
      result2.set(arg1, false);
      result.delete(arg1);
      result3.delete(arg1);
      map4.delete(fn40(arg1, arg2));
      fn6(arg1, arg2);
      preserveAutomationViewAfterTaskFinish(arg1, "batch_completed");
      const value = arg1.includes("_") ? arg1.split("_").slice(1).join("_") : null;
      if (result5) {
        result5.webContents.send("batch-account-finished", {
          viewKey: arg1,
          accountId: value,
          reason: "batch_completed"
        });
        result5.webContents.send("view-batch-status", {
          viewKey: arg1,
          isRunning: false
        });
        result5.webContents.send("new-status", "[Batch] 视图 " + arg1 + " 批量任务处理完毕");
        const result = Array.from(result2.values()).some(Boolean);
        if (!result) {
          try {
            historyManager.finalizeBatchRun(arg2, "completed");
          } catch (error) {}
          appendBatchFollowLog(arg2, {
            message: "批量跟进已完成：成功 " + (obj.success || 0) + "，失败 " + (obj.failed || 0) + "，跳过 " + (obj.skipped || 0),
            level: "success",
            phase: "run",
            viewKey: arg1,
            accountId: value || ""
          });
          result5.webContents.send("batch-task-complete", {
            runId: arg2
          });
        }
      }
      releaseBatchRuntimeGuardIfIdle?.({
        force: true
      });
      return;
    }
    result2.set(arg1, true);
    if (result5) {
      result5.webContents.send("view-batch-status", {
        viewKey: arg1,
        isRunning: true
      });
    }
    const value = result7[0];
    const {
      lead: lead,
      config: config
    } = value;
    let result8 = getPlatformViews().get(arg1);
    const value2 = arg1.split("_")[0];
    if (!result8) {
      console.log("[Batch] 视图 " + arg1 + " 不存在，正在初始化并等待...");
      initAutomationView({
        accountId: lead.accountId,
        accountName: lead.accountName
      }, value2);
      setTimeout(() => dispatchNextBatchItem(arg1, arg2, "wait-view-init"), 5000);
      return;
    }
    result3.set(arg1, arg2);
    console.log("[Batch] [" + arg1 + "] 正在处理: " + lead.nickname + ", 动作: " + config.type);
    if (fn22(lead)) {
      result7.shift();
      const local = lead.profileUnavailableReason || lead.lastBatchSkipReason || BATCH_USER_GONE_REASON;
      console.warn("[Batch] [" + arg1 + "] @" + (lead.nickname || "未知") + " 已标记" + local + "，跳过开主页");
      result4.delete(arg1);
      processBatchItemFinished({
        sender: result8?.webContents || null
      }, {
        leadId: lead.leadId,
        accountId: lead.accountId,
        leadName: lead.nickname,
        leadPlatform: lead.platform,
        accountName: lead.accountName,
        success: false,
        skipped: true,
        skipReason: local,
        error: local,
        type: config.type,
        interactionResults: {
          skipped: true,
          skipReason: local,
          userGone: true,
          profileUnavailable: true,
          profileUnavailableReason: local
        }
      }, arg2, arg1);
      return;
    }
    const value3 = lead.userUrl;
    if (!value3) {
      result7.shift();
      console.error("[Batch] 线索 " + lead.nickname + " 缺失用户主页链接，跳过");
      obj.current += 1;
      if (obj.total > 0) {
        obj.current = Math.min(obj.current, obj.total);
      }
      obj.failed += 1;
      if (isLeadsSqliteRuntime() && lead.leadId) {
        const result = dbManager.setLeadLastBatchFollowResult(lead.leadId, {
          status: "failed",
          message: "缺失主页链接",
          at: Date.now(),
          type: config.type,
          runId: arg2
        });
        if (!result) {
          console.warn("[Batch] 最近跟进结果回写失败 leadId=" + lead.leadId + "（缺失主页链接）");
        }
      }
      try {
        historyManager.appendBatchRunResult(arg2, {
          leadId: lead.leadId,
          accountId: lead.accountId,
          success: false,
          error: "缺失主页链接",
          type: config.type,
          leadName: lead.nickname || "未知",
          leadPlatform: lead.platform,
          accountName: lead.accountName || "主账号",
          ...fn25(lead),
          time: new Date().toLocaleTimeString(),
          viewKey: arg1
        }, obj);
      } catch (error) {}
      if (result5) {
        result5.webContents.send("batch-item-result", {
          leadId: lead.leadId,
          accountId: lead.accountId,
          success: false,
          error: "缺失主页链接",
          type: config.type,
          leadName: lead.nickname || "未知",
          leadPlatform: lead.platform,
          accountName: lead.accountName || "主账号",
          time: new Date().toLocaleTimeString(),
          viewKey: arg1,
          runId: arg2
        });
        result5.webContents.send("batch-task-progress", {
          ...obj,
          lastLeadName: lead.nickname || "未知",
          lastAction: config.type,
          status: obj.total > 0 && obj.current >= obj.total ? "completed" : "executing"
        });
      }
      dispatchNextBatchItem(arg1, arg2, "missing-profile-url");
      return;
    }
    if (result5) {
      result5.webContents.send("new-log", "[批量跟进] [" + arg1 + "] 正在处理: " + lead.nickname + " (" + config.type + ")");
      result5.webContents.send("batch-item-start", {
        leadId: lead.leadId,
        accountId: lead.accountId,
        accountName: lead.accountName,
        leadName: lead.nickname,
        type: config.type,
        viewKey: arg1,
        runId: arg2
      });
      result5.webContents.send("batch-task-progress", {
        ...obj,
        lastLeadName: lead.nickname || "未知",
        lastAction: config.type,
        status: "executing",
        runId: arg2
      });
    }
    appendBatchFollowLog(arg2, {
      message: "开始处理 @" + (lead.nickname || "未知") + "（" + config.type + "）",
      level: "info",
      accountId: lead.accountId,
      accountName: lead.accountName || "",
      viewKey: arg1,
      leadId: lead.leadId,
      leadName: lead.nickname || "",
      phase: "item"
    });
    console.log("[Batch] [" + arg1 + "] 正在切换至批量任务模式，停止原获客循环");
    getViewSettingsMap().delete(arg1);
    syncAutomationRuntimeGuard?.(arg1, null);
    result8.webContents.send("control-task", {
      type: "STOP_TASK"
    });
    if (!shouldAttachAutomationView(arg1)) {
      if (canParkAutomationViewInMainWindow()) {
        parkAutomationViewInMainWindow(arg1, result8);
      } else {
        enterBackgroundDetachedMode(arg1, result8);
      }
    }
    const result9 = ensureInteractionView(arg1);
    if (!result9) {
      result7.shift();
      console.error("[Batch] 无法创建互动子视图: " + arg1 + "，跳过本条");
      completeBatchFromInteraction(arg1, {
        lead: lead,
        config: config,
        runId: arg2
      }, {
        success: false,
        error: "互动子视图创建失败"
      }, result8.webContents);
      return;
    }
    result4.set(arg1, {
      lead: lead,
      config: config,
      runId: arg2
    });
    const obj2 = {
      ...buildBatchInteractionTask(lead, config, arg1),
      batchRunId: arg2
    };
    const result10 = fn14(value3);
    console.log("[Batch] [" + arg1 + "] 子视图跟进（同自动获客 interaction-start）: " + lead.nickname + " (" + config.type + ")");
    let flag2 = false;
    try {
      flag2 = runInteractionStart(arg1, result10, obj2);
    } catch (error) {
      console.error("[Batch] [" + arg1 + "] 子视图启动异常:", error);
    }
    result7.shift();
    if (!flag2) {
      result4.delete(arg1);
      try {
        recoverMainAutomationView(arg1, null, {
          force: true
        });
      } catch (error) {}
      completeBatchFromInteraction(arg1, {
        lead: lead,
        config: config,
        runId: arg2
      }, {
        success: false,
        error: "子视图切换失败"
      }, result9.webContents);
    }
  }
  function processBatchItemFinished(arg1, arg2, arg3 = num, arg4 = null) {
    const {
      leadId: leadId,
      accountId: accountId,
      success: success,
      type: type,
      error: error,
      leadName: leadName,
      leadPlatform: leadPlatform,
      accountName: accountName,
      skipped: skipped2,
      skipReason: skipReason2,
      interactionResults: interactionResults,
      userUrl: userUrl,
      secUid: secUid,
      profileUrl: profileUrl
    } = arg2;
    const local = arg4 || resolveViewKeyFromSender(arg1?.sender);
    if (!local) {
      console.warn("[Batch] 无法解析 viewKey，丢弃完成回调 lead=" + (leadName || leadId || "?"));
      return;
    }
    const result = getPendingBatchByViewKey();
    if (result.has(local)) {
      result.delete(local);
      finishInteraction(local, interactionResults || arg2, "batch-done");
    }
    const result2 = getViewActiveBatchRunMap().get(local);
    if (result2 !== arg3) {
      console.log("[Batch] 忽略过期任务的完成回调 (" + local + ", run " + result2 + " vs " + arg3 + ")");
      return;
    }
    if (interactionResults) {
      let num = 0;
      let list = [];
      if (fs.existsSync(historyFile)) {
        try {
          const result = fs.readFileSync(historyFile, "utf8");
          const result2 = crypto.createDecipheriv("aes-256-cbc", cryptoKey, cryptoIv);
          let result3 = result2.update(result, "hex", "utf8");
          result3 += result2.final("utf8");
          list = JSON.parse(result3);
        } catch (error) {
          console.error("[Main] History parse error in batch sync", error);
        }
      }
      list.forEach(arg1 => {
        if (!arg1.items) {
          return;
        }
        const result = arg1.items.find(arg1 => arg1.leadId === leadId || arg1.nickname === leadName && arg1.platform === leadPlatform || arg1.nickname === leadName && String(arg1.platform || "").toLowerCase() === String(leadPlatform || "").toLowerCase());
        if (result) {
          result.actions = result.actions || {};
          if (interactionResults.followed) {
            result.followed = true;
            result.actions.followed = true;
          }
          if (interactionResults.messaged) {
            result.messaged = true;
            result.actions.messaged = true;
            if (interactionResults.dmContent) {
              result.dmContent = interactionResults.dmContent;
              result.actions.dmContent = interactionResults.dmContent;
            }
          }
          if (interactionResults.profileCommented) {
            result.replied = true;
            result.actions.profileWorkCommented = true;
            if (interactionResults.replyContent) {
              result.replyContent = interactionResults.replyContent;
              result.actions.replyContent = interactionResults.replyContent;
            }
          }
          if (interactionResults.touchCounts) {
            result.touchCounts = {
              ...(result.touchCounts || {}),
              ...interactionResults.touchCounts
            };
          } else {
            result.touchCounts = result.touchCounts || {
              like: 0,
              reply: 0,
              follow: 0,
              message: 0,
              profileComment: 0
            };
            if (interactionResults.followed) {
              result.touchCounts.follow = Math.max(1, Number(result.touchCounts.follow || 0));
            }
            if (interactionResults.messaged) {
              result.touchCounts.message = Math.max(1, Number(result.touchCounts.message || 0));
            }
            if (interactionResults.profileCommented) {
              result.touchCounts.profileComment = Math.max(1, Number(result.touchCounts.profileComment || 0));
            }
          }
          if (interactionResults.touchLog) {
            result.touchLog = interactionResults.touchLog;
          }
          if (interactionResults.profileCommentAt) {
            result.profileCommentAt = Number(interactionResults.profileCommentAt);
          }
          if (interactionResults.lastTouchAt) {
            result.lastTouchAt = Math.max(Number(result.lastTouchAt || 0), Number(interactionResults.lastTouchAt || 0));
          } else if (interactionResults.messaged || interactionResults.followed || interactionResults.profileCommented) {
            result.lastTouchAt = Date.now();
          }
          if (interactionResults.worksCount !== undefined && interactionResults.worksCount !== null) {
            result.worksCount = interactionResults.worksCount;
            if (Number(interactionResults.worksCount) === 0) {
              result.noWorks = true;
            }
          }
          if (interactionResults.noWorks) {
            result.noWorks = true;
          }
          if (interactionResults.isPrivate !== undefined) {
            result.isPrivate = interactionResults.isPrivate;
          }
          if (interactionResults.userGone || interactionResults.profileUnavailable) {
            result.userGone = true;
            result.profileUnavailable = true;
            result.profileUnavailableReason = interactionResults.profileUnavailableReason || interactionResults.skipReason || BATCH_USER_GONE_REASON;
          }
          if (interactionResults.skipReason) {
            result.lastBatchSkipReason = interactionResults.skipReason;
          }
          if (interactionResults.location) {
            result.location = interactionResults.location;
          }
          if (interactionResults.douyinId) {
            result.douyinId = interactionResults.douyinId;
          }
          if (interactionResults.gender) {
            result.gender = interactionResults.gender;
          }
          if (interactionResults.signature) {
            result.signature = interactionResults.signature;
          }
          if (interactionResults.contact) {
            result.contact = interactionResults.contact;
          }
          num++;
        }
      });
      if (num > 0) {
        console.log("[Batch] 已同步 " + num + " 条历史记录中的线索状态");
        try {
          const result = JSON.stringify(list);
          const result2 = crypto.createCipheriv("aes-256-cbc", cryptoKey, cryptoIv);
          let result3 = result2.update(result, "utf8", "hex");
          result3 += result2.final("hex");
          fs.writeFileSync(historyFile, result3);
        } catch (error) {
          console.error("[Main] History save error in batch sync", error);
        }
      }
    }
    if (interactionResults && (interactionResults.userGone || interactionResults.profileUnavailable || interactionResults.noWorks || interactionResults.isPrivate !== undefined || interactionResults.worksCount !== undefined && interactionResults.worksCount !== null) && isLeadsSqliteRuntime() && leadId) {
      try {
        let local = dbManager.getLeadById(leadId) || dbManager.getLeadByUserKey(leadId);
        if (!local) {
          const result = dbManager.findLeadRowId({
            leadId: leadId,
            key: leadId,
            nickname: leadName,
            platform: leadPlatform,
            worksCount: interactionResults.worksCount,
            noWorks: interactionResults.noWorks,
            isPrivate: interactionResults.isPrivate,
            userGone: interactionResults.userGone
          });
          if (result) {
            local = dbManager.getLeadById(result);
          }
        }
        if (local) {
          if (interactionResults.userGone || interactionResults.profileUnavailable) {
            local.userGone = true;
            local.profileUnavailable = true;
            local.profileUnavailableReason = interactionResults.profileUnavailableReason || interactionResults.skipReason || BATCH_USER_GONE_REASON;
            local.lastBatchSkipReason = interactionResults.skipReason || local.profileUnavailableReason;
          }
          if (interactionResults.worksCount !== undefined && interactionResults.worksCount !== null) {
            local.worksCount = interactionResults.worksCount;
            if (Number(interactionResults.worksCount) === 0) {
              local.noWorks = true;
            }
          }
          if (interactionResults.noWorks) {
            local.noWorks = true;
          }
          if (interactionResults.isPrivate !== undefined) {
            local.isPrivate = !!interactionResults.isPrivate;
          }
          if (interactionResults.skipReason) {
            local.lastBatchSkipReason = interactionResults.skipReason;
          }
          dbManager.upsertLead(local);
        } else {
          console.warn("[Batch] SQLite 未找到线索行，账号标记未落库 leadId=" + leadId + " name=" + (leadName || ""));
        }
      } catch (error) {
        console.warn("[Batch] SQLite 回写账号标记失败:", error?.message || error);
      }
    }
    console.log("[Batch] 动作反馈: leadId=" + leadId + ", success=" + success + ", error=" + (error || "无"));
    const local2 = accountId || (local.includes("_") ? local.split("_").slice(1).join("_") : "default");
    const local3 = skipReason2 || error || interactionResults?.skipReason || "";
    const result3 = isBatchCountedFailure(local3, {
      ...(interactionResults || {}),
      noWorks: !!interactionResults?.noWorks || !!arg2?.noWorks,
      isPrivate: !!interactionResults?.isPrivate || !!arg2?.isPrivate,
      skipped: !!skipped2 || !!interactionResults?.skipped,
      profileFirstTargetFiltered: !!interactionResults?.profileFirstTargetFiltered || !!arg2?.profileFirstTargetFiltered,
      demographicFilterFailed: !!interactionResults?.demographicFilterFailed || !!arg2?.demographicFilterFailed
    });
    const local4 = !result3 && (!!skipped2 || !!interactionResults && !!interactionResults.skipped);
    const local5 = !result3 && !local4 && !!success;
    obj.current += 1;
    if (obj.total > 0) {
      obj.current = Math.min(obj.current, obj.total);
    }
    if (local4) {
      obj.skipped = (obj.skipped || 0) + 1;
    } else if (local5) {
      obj.success += 1;
    } else {
      obj.failed += 1;
    }
    const result4 = getViewSettingsMap();
    const local6 = accountName || result4.get(local + "_nickname") || result4.get(local + "_name") || "主账号";
    const text = "DY";
    const local7 = result4.get(local + "_platform") || "";
    const value = local7 === "xianyu" || local.toLowerCase().startsWith("xianyu") ? "XY" : "DY";
    const value2 = result3 ? local3 || error || "筛选不符" : error;
    const obj2 = {
      leadId: leadId,
      accountId: local2,
      success: local5,
      skipped: local4,
      skipReason: local4 ? skipReason2 || interactionResults && interactionResults.skipReason || "" : "",
      type: type,
      error: value2,
      leadName: leadName || "未知",
      leadPlatform: text,
      accountName: local6,
      platform: value,
      ...fn25({
        leadId: leadId,
        userUrl: userUrl || profileUrl || "",
        secUid: secUid || ""
      }),
      time: new Date().toLocaleTimeString(),
      viewKey: local,
      interactionResults: interactionResults,
      runId: arg3
    };
    if (isLeadsSqliteRuntime() && leadId) {
      const value = local5 ? "执行成功（" + (type || "批量跟进") + "）" : local4 ? "已跳过：" + (obj2.skipReason || value2 || "条件不符") : value2 || "执行失败";
      const result = dbManager.setLeadLastBatchFollowResult(leadId, {
        status: local5 ? "success" : "failed",
        message: value,
        at: Date.now(),
        type: type,
        runId: arg3
      });
      if (!result) {
        console.warn("[Batch] 最近跟进结果回写失败 leadId=" + leadId + " name=" + (leadName || ""));
      }
    }
    try {
      const {
        interactionResults: interactionResults,
        ...local
      } = obj2;
      historyManager.appendBatchRunResult(arg3, local, obj);
    } catch (error) {}
    const value3 = local4 ? "已跳过 @" + (leadName || "未知") + "（" + (obj2.skipReason || "条件不符") + "）" : local5 ? "完成 @" + (leadName || "未知") + "（" + (type || "跟进") + "）" : "失败 @" + (leadName || "未知") + "：" + (value2 || "未知错误");
    appendBatchFollowLog(arg3, {
      message: value3,
      level: local4 ? "warning" : local5 ? "success" : "error",
      accountId: local2,
      accountName: local6,
      viewKey: local,
      leadId: leadId,
      leadName: leadName || "",
      phase: "result"
    });
    const result5 = getMainWindow();
    if (result5) {
      result5.webContents.send("batch-item-result", obj2);
      result5.webContents.send("batch-task-progress", {
        ...obj,
        lastLeadName: leadName || "未知",
        lastAction: type,
        status: obj.total > 0 && obj.current >= obj.total ? "completed" : "executing",
        runId: arg3
      });
    }
    const result6 = getBatchActionQueueMap().get(local);
    const local8 = num;
    if (!result6 || result6.length === 0) {
      console.log("[Batch] 队列已空，立即收尾 (" + local + ")");
      dispatchNextBatchItem(local, local8, "queue-empty-finalize");
      return;
    }
    if (!local5) {
      const value = Math.floor(Math.random() * 6 + 3) * 1000;
      console.log("[Batch] 任务判定为失败/过滤跳过，延迟 " + value / 1000 + " 秒后处理下一条 (" + local + ")");
      pushAutomationTrace("⏳ 失败/跳过缓冲：等 " + value / 1000 + "s 后处理下一条", local2, {
        runId: local8,
        viewKey: local,
        phase: "delay",
        level: "warning",
        accountName: local6,
        leadName: leadName || ""
      });
      fn7(local, local8, () => {
        if (!flag && num === local8) {
          pushAutomationTrace("▶️ 失败/跳过缓冲结束，开始处理下一条", local2, {
            runId: local8,
            viewKey: local,
            phase: "delay",
            level: "info"
          });
          dispatchNextBatchItem(local, local8, "failed-item-delay");
        }
      }, value);
      return;
    }
    const value4 = result6[0];
    const local9 = value4?.config?.delayMin || 120;
    const local10 = value4?.config?.delayMax || 180;
    const value5 = Math.floor(Math.random() * (local10 - local9 + 1) + local9) * 1000;
    fn13({
      viewKeyFound: local,
      accountId: local2,
      finishedLeadName: leadName,
      nextLeadName: value4?.lead?.nickname,
      delayMs: value5,
      delayMin: local9,
      delayMax: local10,
      sender: arg1.sender,
      scheduledRunId: local8
    });
  }
  function stopBatchAccountByViewKey(arg1, text = "manual_stop") {
    if (!arg1 || !isAutomationViewKey(arg1)) {
      return false;
    }
    const result = getViewActiveBatchRunMap();
    const result2 = getBatchActionQueueMap();
    const result3 = getPendingBatchByViewKey();
    const result4 = getIsBatchActionRunningMap();
    const result5 = getInteractionViewsMap();
    const result6 = getInteractionLocksMap();
    const result7 = getMainWindow();
    const local = result.get(arg1) ?? num;
    const local2 = result2.has(arg1) || result3.has(arg1) || result4.get(arg1) || result.has(arg1);
    if (!local2) {
      return false;
    }
    console.log("[Batch] 停止单账号批量任务: " + arg1);
    clearBatchWaitTickersForView(arg1);
    map4.delete(fn40(arg1, local));
    result2.delete(arg1);
    result4.set(arg1, false);
    result.delete(arg1);
    const result8 = result3.get(arg1);
    if (result8) {
      const result = result5.get(arg1);
      try {
        if (result && !result.webContents.isDestroyed()) {
          result.webContents.send("interaction-preempt", {
            viewKey: arg1,
            reason: text,
            cancelledBatchRunId: local
          });
          result.webContents.stop();
        }
      } catch (error) {
        console.warn("[Batch] [" + arg1 + "] 取消互动失败: " + error.message);
      }
      result3.delete(arg1);
    }
    if (result6.has(arg1)) {
      finishInteraction(arg1, {
        error: "batch-account-stopped"
      }, text);
    }
    try {
      const result = getPlatformViews().get(arg1);
      if (result && !result.webContents.isDestroyed()) {
        result.webContents.send("control-task", {
          type: "CANCEL_WANDERING",
          payload: {
            reason: text,
            batchRunId: local,
            viewKey: arg1
          }
        });
      }
    } catch (error) {
      console.warn("[Batch] [" + arg1 + "] 取消拟人闲逛失败: " + error.message);
    }
    preserveAutomationViewAfterTaskFinish(arg1, text);
    const value = arg1.includes("_") ? arg1.split("_").slice(1).join("_") : null;
    if (result7 && !result7.isDestroyed()) {
      result7.webContents.send("batch-account-finished", {
        viewKey: arg1,
        accountId: value,
        reason: text,
        runId: local
      });
      result7.webContents.send("view-batch-status", {
        viewKey: arg1,
        isRunning: false
      });
      const result = Array.from(result4.values()).some(Boolean);
      if (!result) {
        const value2 = text === "manual_stop" ? "stopped" : "completed";
        try {
          historyManager.finalizeBatchRun(local, value2);
        } catch (error) {}
        appendBatchFollowLog(local, {
          message: value2 === "stopped" ? "批量跟进已停止" : "批量跟进已完成：成功 " + (obj.success || 0) + "，失败 " + (obj.failed || 0) + "，跳过 " + (obj.skipped || 0),
          level: value2 === "stopped" ? "warning" : "success",
          phase: "run",
          viewKey: arg1,
          accountId: value || ""
        });
        result7.webContents.send("batch-task-complete", {
          runId: local,
          status: value2
        });
      }
    }
    releaseBatchRuntimeGuardIfIdle?.();
    return true;
  }
  function registerIpc() {
    ipcMain.handle("get-batch-runtime-state", () => {
      const set = new Set();
      getIsBatchActionRunningMap().forEach((arg1, arg2) => {
        if (arg1) {
          set.add(arg2);
        }
      });
      getBatchActionQueueMap().forEach((arg1, arg2) => {
        if (Array.isArray(arg1) && arg1.length > 0) {
          set.add(arg2);
        }
      });
      getPendingBatchByViewKey().forEach((arg1, arg2) => set.add(arg2));
      return {
        active: !flag && set.size > 0,
        runId: num,
        runningViewKeys: [...set],
        progress: {
          ...obj
        }
      };
    });
    ipcMain.on("start-batch-action", (arg1, {
      leads: leads,
      config: config
    }) => {
      (async () => {
        const result = getMainWindow();
        if (getIsCurrentUserFree()) {
          console.warn("[Auth-Shield] 拦截到未激活状态尝试启动批量操作！");
          if (result) {
            result.webContents.send("new-status", "[WARN] 未激活专业版不支持批量关注、私信、首作评论等操作，请激活后使用");
            result.webContents.send("batch-task-stopped");
          }
          return;
        }
        const result2 = await ensureRuntimeConfigReadyForTask({
          allowDialogRetry: true
        });
        if (!result2.ok) {
          console.warn("[RuntimeConfig] 拦截批量跟进：运行配置未就绪");
          if (result && !result.isDestroyed()) {
            result.webContents.send("new-status", "[WARN] " + (result2.reason || runtimeConfigBlockReason));
            result.webContents.send("batch-task-stopped");
          }
          return;
        }
        const result3 = getBatchActionQueueMap();
        const result4 = getIsBatchActionRunningMap();
        const result5 = getViewActiveBatchRunMap();
        const local = num;
        cancelActiveBatchInteractions("batch-replaced", local);
        cancelBatchWandering("batch-replaced", local);
        fn9();
        flag = false;
        releaseBatchRuntimeGuardIfIdle?.({
          force: true
        });
        try {
          historyManager.finalizeBatchRun(local, "stopped");
        } catch (error) {}
        num += 1;
        const local2 = num;
        num2 = 0;
        result3.clear();
        result4.clear();
        result5.clear();
        map4.clear();
        map3.clear();
        obj = {
          total: leads.length,
          current: 0,
          success: 0,
          failed: 0,
          skipped: 0
        };
        if (config && typeof config === "object") {
          const result = Number(config.commentMentionPercent);
          config.commentMentionPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, Math.round(result))) : 100;
        }
        console.log("[Batch] 收到批量任务请求, 线索量: " + leads.length + ", 类型: " + config.type + (", @提及=" + (config.enableCommentMention ? "开" : "关")) + (", @概率=" + (Number.isFinite(Number(config.commentMentionPercent)) ? config.commentMentionPercent : 100) + "%"));
        const result6 = Array.from(new Set((leads || []).map(arg1 => arg1.accountId).filter(Boolean)));
        const result7 = Array.from(new Set((leads || []).map(arg1 => arg1.accountName).filter(Boolean)));
        try {
          historyManager.createBatchRun({
            id: "batch_" + local2 + "_" + Date.now(),
            runId: local2,
            startedAt: Date.now(),
            endedAt: null,
            status: "running",
            type: config?.type || "follow_dm",
            genderFilter: config?.genderFilter || "all",
            accountIds: result6,
            accountNames: result7,
            total: leads.length,
            current: 0,
            success: 0,
            failed: 0,
            skipped: 0,
            results: [],
            logs: []
          });
          appendBatchFollowLog(local2, {
            message: "批量跟进已启动：共 " + leads.length + " 条，动作 " + (config?.type || "follow_dm") + "，账号 " + (result7.join("、") || result6.length),
            level: "info",
            phase: "run"
          });
        } catch (error) {
          console.warn("[Batch] 创建批量跟进详情记录失败:", error?.message || error);
        }
        if (result) {
          result.webContents.send("batch-task-info", {
            total: leads.length,
            runId: local2
          });
        }
        leads.forEach(arg1 => {
          const text = "douyin";
          const value = arg1.accountId && arg1.accountId !== "default" ? text + "_" + arg1.accountId : text;
          if (!result3.has(value)) {
            result3.set(value, []);
          }
          result3.get(value).push({
            lead: arg1,
            config: config
          });
        });
        const result8 = [...result3.values()].some(arg1 => Array.isArray(arg1) && arg1.length > 0);
        if (result8) {
          acquireBatchRuntimeGuard?.(local2, leads.length);
        } else if (result) {
          try {
            historyManager.finalizeBatchRun(local2, "completed");
          } catch (error) {}
          result.webContents.send("batch-task-complete");
        }
        result3.forEach((arg1, arg2) => {
          if (arg1.length > 0) {
            cancelPendingAutomationViewDestroy(arg2);
            result4.set(arg2, true);
            if (result) {
              result.webContents.send("view-batch-status", {
                viewKey: arg2,
                isRunning: true
              });
            }
            dispatchNextBatchItem(arg2, local2, "batch-start");
          }
        });
      })().catch(arg1 => {
        console.error("[Batch] start-batch-action failed:", arg1?.message || arg1);
        const result = getMainWindow();
        if (result && !result.isDestroyed()) {
          result.webContents.send("batch-task-stopped");
        }
      });
    });
    ipcMain.on("batch-item-finished", (arg1, arg2) => {
      processBatchItemFinished(arg1, arg2);
    });
    ipcMain.on("stop-batch-action", () => {
      console.log("[Batch] 收到手动停止指令");
      const result = getMainWindow();
      const result2 = getBatchActionQueueMap();
      const result3 = getIsBatchActionRunningMap();
      const result4 = getViewActiveBatchRunMap();
      const result5 = getPendingBatchByViewKey();
      const local = num;
      const set = new Set([...result2.keys(), ...result5.keys(), ...result4.keys(), ...[...result3.entries()].filter(([, arg1]) => arg1).map(([arg1]) => arg1)]);
      flag = true;
      num += 1;
      cancelActiveBatchInteractions("batch-manual-stop", local);
      cancelBatchWandering("batch-manual-stop", local);
      result2.clear();
      result3.clear();
      result4.clear();
      result5.clear();
      map4.clear();
      map3.clear();
      fn9();
      try {
        historyManager.finalizeBatchRun(local, "stopped");
      } catch (error) {}
      appendBatchFollowLog(local, {
        message: "批量跟进已手动停止",
        level: "warning",
        phase: "run"
      });
      for (const item of set) {
        preserveAutomationViewAfterTaskFinish(item, "manual_stop");
        const value = item.includes("_") ? item.split("_").slice(1).join("_") : null;
        if (result && !result.isDestroyed()) {
          result.webContents.send("batch-account-finished", {
            viewKey: item,
            accountId: value,
            reason: "manual_stop",
            runId: local
          });
          result.webContents.send("view-batch-status", {
            viewKey: item,
            isRunning: false
          });
        }
      }
      releaseBatchRuntimeGuardIfIdle?.({
        force: true
      });
      if (result) {
        result.webContents.send("batch-task-stopped", {
          runId: local
        });
      }
    });
    ipcMain.on("stop-batch-account", (arg1, options = {}) => {
      const value = typeof options === "string" ? options : options?.viewKey;
      if (!value) {
        return;
      }
      stopBatchAccountByViewKey(value, options?.reason || "manual_stop");
    });
    ipcMain.on("interaction-start", (arg1, {
      viewKey: viewKey,
      url: url,
      taskData: taskData
    }) => {
      runInteractionStart(viewKey, url, taskData);
    });
    ipcMain.on("interaction-profile-ready", (arg1, options = {}) => {
      const local = options.viewKey || inferInteractionViewKey(arg1.sender);
      if (!local) {
        return;
      }
      const result = getInteractionLocksMap().get(local);
      if (!result) {
        return;
      }
      if (options.interactionId && result.interactionId && options.interactionId !== result.interactionId) {
        return;
      }
      result.profileOpenReady = true;
      if (result.profileOpenTimer) {
        clearTimeout(result.profileOpenTimer);
        result.profileOpenTimer = null;
      }
    });
    ipcMain.on("interaction-activity", (arg1, options = {}) => {
      const local = options.viewKey || inferInteractionViewKey(arg1.sender);
      if (!local) {
        return;
      }
      const result = fn2(local, options.interactionId || "", {
        extendMs: options.extendMs
      });
      if (result && options.reason) {
        console.log("[Batch] [" + local + "] 互动续期（" + options.reason + "）");
      }
    });
    ipcMain.on("interaction-success-checkpoint", (arg1, options = {}) => {
      const local = options.viewKey || inferInteractionViewKey(arg1.sender);
      if (!local) {
        return;
      }
      const result = getInteractionLocksMap().get(local);
      const result2 = getPendingBatchByViewKey().get(local);
      const local2 = options.results || {};
      if (!result || !result2 || !local2.success || !local2.profileWorkCommented) {
        return;
      }
      const local3 = options.interactionId && result.interactionId && options.interactionId !== result.interactionId && !String(result.interactionId).startsWith("batch_wait_retry_");
      if (local3) {
        return;
      }
      if (options.batchRunId != null && options.batchRunId !== result2.runId) {
        return;
      }
      result.successCheckpoint = local2;
      if (result.timer) {
        clearTimeout(result.timer);
      }
      result.timer = setTimeout(result.onTimeout, 60000);
      console.log("[Batch] [" + local + "] 已记录首作评论成功检查点，等待最终结果回传");
    });
    ipcMain.on("interaction-done", (arg1, {
      viewKey: viewKey,
      interactionId: interactionId2,
      batchRunId: batchRunId,
      results: results
    }) => {
      const local = viewKey || inferInteractionViewKey(arg1.sender);
      if (!local) {
        console.warn("[Main] [子视图模式] 收到互动结束，但无法识别 viewKey");
        return;
      }
      const local2 = getInteractionLocksMap().get(local)?.interactionId;
      const result = getPendingBatchByViewKey().get(local);
      if (interactionId2 && local2 && interactionId2 !== local2) {
        if (result && results?.success && results?.profileWorkCommented && (batchRunId == null || batchRunId === result.runId) && result.runId === num) {
          console.warn("[Batch] [" + local + "] 采纳迟到的首作评论成功（旧 interactionId=" + interactionId2 + "），完结本条并取消重试");
          const result2 = getInteractionLocksMap().get(local);
          if (result2) {
            result2.successCheckpoint = results;
          }
          fn3(local, "late-profile-comment-success");
          Promise.resolve(completeBatchFromInteraction(local, result, results, arg1.sender)).then(arg1 => {
            if (arg1 === "retry-scheduled") {
              return;
            }
            finishInteraction(local, results);
          }).catch(arg1 => {
            console.warn("[Batch] [" + local + "] 迟到成功完结异常:", arg1?.message || arg1);
            finishInteraction(local, results);
          });
          return;
        }
        console.log("[Main] [子视图模式] 忽略旧互动回调 (" + local + ", " + interactionId2 + " != " + local2 + ")");
        return;
      }
      if (result && batchRunId != null && batchRunId !== result.runId) {
        console.log("[Batch] 忽略旧代次互动回调 (" + local + ", run " + batchRunId + " != " + result.runId + ")");
        return;
      }
      if (result) {
        if (result.runId !== num) {
          getPendingBatchByViewKey().delete(local);
          finishInteraction(local, results);
          return;
        }
        Promise.resolve(completeBatchFromInteraction(local, result, results, arg1.sender)).then(arg1 => {
          if (arg1 === "retry-scheduled") {
            return;
          }
          finishInteraction(local, results);
        }).catch(arg1 => {
          console.warn("[Batch] [" + local + "] completeBatchFromInteraction 异常:", arg1?.message || arg1);
          finishInteraction(local, results);
        });
        return;
      }
      finishInteraction(local, results);
    });
  }
  return {
    resolveActiveBatchRunId: resolveActiveBatchRunId,
    appendBatchFollowLog: appendBatchFollowLog,
    clearBatchWaitTickersForView: clearBatchWaitTickersForView,
    cancelBatchWandering: cancelBatchWandering,
    cancelActiveBatchInteractions: cancelActiveBatchInteractions,
    pickBatchDmText: pickBatchDmText,
    buildBatchInteractionTask: buildBatchInteractionTask,
    isBatchCountedFailure: isBatchCountedFailure,
    mapSubviewResultsToBatchPayload: mapSubviewResultsToBatchPayload,
    resolveViewKeyFromSender: resolveViewKeyFromSender,
    completeBatchFromInteraction: completeBatchFromInteraction,
    runInteractionStart: runInteractionStart,
    ensureInteractionView: ensureInteractionView,
    dispatchNextBatchItem: dispatchNextBatchItem,
    processNextBatchItem: processNextBatchItem,
    processBatchItemFinished: processBatchItemFinished,
    stopBatchAccountByViewKey: stopBatchAccountByViewKey,
    registerIpc: registerIpc
  };
}
module.exports = {
  createBatchFollow: createBatchFollow
};
'use strict';

const {
  extractDouyinVideoId
} = require("../shared/processedVideoKey");
function createMonitorAuthorWorkNav(options = {}) {
  const map = new Map();
  function fn(text = "monitor_nav") {
    return text + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  }
  function handleNavResult(options = {}) {
    const result = String(options?.requestId || "").trim();
    if (!result) {
      return;
    }
    const result2 = map.get(result);
    if (!result2) {
      return;
    }
    map.delete(result);
    if (result2.timer) {
      clearTimeout(result2.timer);
    }
    const value = Date.now() - result2.startedAt;
    if (Date.now() > result2.deadline) {
      result2.resolve({
        success: false,
        ok: false,
        error: "主页作品导航超过 " + Math.round(result2.timeoutMs / 1000) + " 秒",
        errorCode: "monitor_author_nav_timeout",
        elapsedMs: value
      });
      return;
    }
    result2.resolve({
      ...options,
      elapsedMs: value,
      ok: !!options?.success
    });
  }
  function cancelPendingForTask(arg1, options = {}) {
    const value = arg1 + "_";
    const set = new Set();
    for (const [local, local2] of map.entries()) {
      if (!String(local).startsWith(value) && local2.taskId !== arg1) {
        continue;
      }
      map.delete(local);
      if (local2.timer) {
        clearTimeout(local2.timer);
      }
      if (local2.webContentsId != null) {
        set.add(local2.webContentsId);
      }
      local2.resolve({
        success: false,
        ok: false,
        error: "监控任务已停止",
        errorCode: "monitor_task_stopped",
        elapsedMs: Date.now() - local2.startedAt,
        ...options
      });
    }
    return set;
  }
  function failPendingForWebContents(arg1, arg2, arg3) {
    if (arg1 == null) {
      return 0;
    }
    let num = 0;
    for (const [local, local2] of map.entries()) {
      if (local2.webContentsId !== arg1) {
        continue;
      }
      map.delete(local);
      if (local2.timer) {
        clearTimeout(local2.timer);
      }
      local2.resolve({
        success: false,
        ok: false,
        error: arg3,
        errorCode: arg2,
        elapsedMs: Date.now() - local2.startedAt
      });
      num += 1;
    }
    return num;
  }
  function fn5(arg1, arg2, options = {}, num = 40000) {
    const result = String(options.taskId || "").trim();
    const local = options.requestId || (result ? result + "_nav_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7) : fn());
    return new Promise(arg12 => {
      const result2 = Date.now();
      const result3 = setTimeout(() => {
        map.delete(local);
        arg12({
          success: false,
          ok: false,
          error: "主页作品导航超时（" + Math.round(num / 1000) + " 秒）",
          errorCode: "monitor_author_nav_timeout",
          elapsedMs: Date.now() - result2
        });
      }, Math.max(5000, Number(num) || 40000));
      map.set(local, {
        resolve: arg12,
        timer: result3,
        startedAt: result2,
        deadline: result2 + Math.max(5000, Number(num) || 40000),
        timeoutMs: Math.max(5000, Number(num) || 40000),
        webContentsId: arg1?.id,
        taskId: result
      });
      try {
        if (!arg1 || arg1.isDestroyed?.()) {
          throw new Error("监控窗口已销毁");
        }
        if (arg1.__radarMonitorUnhealthy) {
          const error = new Error("后台监控渲染进程状态异常");
          error.code = "monitor_renderer_unhealthy";
          throw error;
        }
        arg1.send("control-task", {
          type: arg2,
          payload: {
            ...options,
            requestId: local
          }
        });
      } catch (error) {
        clearTimeout(result3);
        map.delete(local);
        arg12({
          success: false,
          ok: false,
          error: error.message || "无法下发主页作品导航",
          errorCode: error.code || "monitor_author_nav_dispatch_failed",
          elapsedMs: Date.now() - result2
        });
      }
    });
  }
  function fn6(arg1, arg2) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return true;
    }
    const local = extractDouyinVideoId(arg2) || String(arg2 || "").trim();
    return !!local && local === result;
  }
  async function openAuthorWork(arg1, {
    taskId = "",
    awemeId = "",
    url = "",
    authorUrl = "",
    preferFirstCard = true,
    skipPinnedCards = false,
    knownHasWorks = false,
    allowUrlFallback = true,
    timeoutMs = 50000
  } = {}) {
    const result = String(awemeId || extractDouyinVideoId(url) || "").trim();
    const result2 = await fn5(arg1, "VIDEO_MONITOR_OPEN_AUTHOR_WORK", {
      taskId: taskId,
      awemeId: result,
      url: url,
      authorUrl: String(authorUrl || "").trim(),
      preferFirstCard: preferFirstCard !== false,
      skipPinnedCards: skipPinnedCards === true,
      knownHasWorks: knownHasWorks === true || !!result,
      allowUrlFallback: allowUrlFallback !== false
    }, timeoutMs);
    const result3 = String(result2?.videoUrl || "").trim();
    const local = extractDouyinVideoId(result3) || String(result2?.awemeId || "").trim();
    const value = preferFirstCard !== false ? !!local : !result || fn6(result, local || result3);
    const local2 = !!result2?.success && !!value && !!local;
    return {
      ok: local2,
      success: local2,
      videoUrl: result3 || (local ? "https://www.douyin.com/video/" + local : ""),
      awemeId: local || result,
      matched: value,
      error: local2 ? "" : result2?.error || "打开作品失败",
      reason: result2?.reason || "",
      debug: result2?.debug || "",
      cancelled: !!result2?.cancelled
    };
  }
  async function moveNextAuthorWork(arg1, {
    taskId = "",
    expectedAwemeId = "",
    expectedUrl = "",
    requireMatch = false,
    timeoutMs = 40000
  } = {}) {
    const result = String(expectedAwemeId || extractDouyinVideoId(expectedUrl) || "").trim();
    const result2 = await fn5(arg1, "VIDEO_MONITOR_MOVE_NEXT_VIDEO", {
      taskId: taskId,
      expectedAwemeId: result,
      requireMatch: requireMatch === true
    }, timeoutMs);
    const result3 = String(result2?.videoUrl || "").trim();
    const local = extractDouyinVideoId(result3) || String(result2?.awemeId || "").trim();
    const local2 = !!result2?.success || !!result2?.continued;
    const local3 = !result || fn6(result, local || result3);
    const value = requireMatch === true ? local2 && local3 : local2;
    return {
      ok: value,
      success: value,
      videoUrl: result3 || (local ? "https://www.douyin.com/video/" + local : ""),
      awemeId: local || result,
      matched: local3,
      switched: local2,
      error: value ? "" : result2?.error || (!local2 ? "未能切换到下一条" : "下一条作品不匹配"),
      reason: result2?.reason || ""
    };
  }
  async function waitVideoReady(arg1, {
    taskId = "",
    videoUrl = "",
    timeoutMs = 35000
  } = {}) {
    const result = Math.max(12000, Number(timeoutMs) || 35000);
    const result2 = await fn5(arg1, "VIDEO_MONITOR_WAIT_VIDEO_READY", {
      taskId: taskId,
      videoUrl: videoUrl,
      timeoutMs: result
    }, result + 10000);
    return {
      ok: !!result2?.success || !!result2?.ready,
      success: !!result2?.success || !!result2?.ready,
      ready: !!result2?.ready || !!result2?.success,
      unavailable: !!result2?.unavailable,
      reason: String(result2?.reason || ""),
      videoUrl: String(result2?.videoUrl || videoUrl || "").trim(),
      error: result2?.error || ""
    };
  }
  async function confirmAuthor(arg1, {
    taskId = "",
    videoUrl = "",
    expectedAuthorUrl = "",
    expectedSecUid = "",
    timeoutMs = 6000
  } = {}) {
    const result = Math.max(2000, Math.min(12000, Number(timeoutMs) || 6000));
    const result2 = await fn5(arg1, "VIDEO_MONITOR_CONFIRM_AUTHOR", {
      taskId: taskId,
      videoUrl: videoUrl,
      expectedAuthorUrl: expectedAuthorUrl,
      expectedSecUid: expectedSecUid,
      timeoutMs: result
    }, result + 4000);
    return {
      ok: !!result2?.matched,
      success: !!result2?.matched,
      matched: !!result2?.matched,
      skipped: !!result2?.skipped,
      authorMismatch: !!result2?.authorMismatch,
      authorUnconfirmed: !!result2?.authorUnconfirmed,
      nickname: String(result2?.nickname || "").trim(),
      authorUrl: String(result2?.authorUrl || "").trim(),
      pageUrl: String(result2?.pageUrl || "").trim(),
      secUid: String(result2?.secUid || "").trim(),
      videoUrl: String(result2?.videoUrl || videoUrl || "").trim(),
      error: result2?.error || ""
    };
  }
  async function openSpecificVideo(arg1, {
    taskId = "",
    videoUrl = "",
    timeoutMs = 110000
  } = {}) {
    const result = Math.max(60000, Math.min(130000, Number(timeoutMs) || 110000));
    const result2 = await fn5(arg1, "VIDEO_MONITOR_OPEN_SPECIFIC_VIDEO", {
      taskId: taskId,
      videoUrl: videoUrl
    }, result);
    const result3 = String(result2?.status || "").trim();
    const local = !!result2?.success || !!result2?.ready || result3 === "ready";
    return {
      ok: local,
      success: local,
      ready: local,
      status: result3 || (local ? "ready" : "timeout"),
      unavailable: result3 === "unavailable" || !!result2?.unavailable,
      reason: String(result2?.reason || result3 || ""),
      videoUrl: String(result2?.videoUrl || videoUrl || "").trim(),
      error: result2?.error || ""
    };
  }
  function canContinueAuthorFeed(arg1) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.__radarMonitorUnhealthy) {
      return false;
    }
    let text = "";
    try {
      text = String(arg1.webContents?.getURL?.() || "");
    } catch (error) {
      return false;
    }
    if (!text) {
      return false;
    }
    if (/\/video\/|\/note\/|modal_id=/.test(text)) {
      return true;
    }
    if (/\/user\//.test(text)) {
      return true;
    }
    return false;
  }
  return {
    openAuthorWork: openAuthorWork,
    openSpecificVideo: openSpecificVideo,
    moveNextAuthorWork: moveNextAuthorWork,
    waitVideoReady: waitVideoReady,
    confirmAuthor: confirmAuthor,
    canContinueAuthorFeed: canContinueAuthorFeed,
    handleNavResult: handleNavResult,
    cancelPendingForTask: cancelPendingForTask,
    failPendingForWebContents: failPendingForWebContents,
    pendingNav: map
  };
}
module.exports = {
  createMonitorAuthorWorkNav: createMonitorAuthorWorkNav
};
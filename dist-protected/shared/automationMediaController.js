'use strict';

function createAutomationMediaController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    formatScrapeGuardWaitLabel: formatScrapeGuardWaitLabel,
    getBoundSubviewInteractionId: getBoundSubviewInteractionId,
    getDouyinFeedScope: getDouyinFeedScope,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoTitle: getVideoTitle,
    ipcRenderer: ipcRenderer,
    isSubviewInteractionCancelled: isSubviewInteractionCancelled,
    isVisibleElement: isVisibleElement,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    pickLeadVideoUrl: pickLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    sleep: sleep,
    state: state
  } = options;
  function isMonitorLoopId(arg1) {
    return typeof arg1 === "string" && (arg1.startsWith("MONITOR") || arg1 === "VIDEO_MONITOR");
  }
  function shouldAbort(arg1) {
    if (arg1 === "BATCH" || arg1 === "SELF_WARMUP") {
      return state.stopRequested;
    }
    if (typeof arg1 === "string" && arg1.startsWith("ENTITY")) {
      return state.stopRequested;
    }
    if (isMonitorLoopId(arg1)) {
      return state.stopRequested;
    }
    if (arg1 === "SUBVIEW_TASK") {
      const local = state.subviewTaskAls?.getStore?.();
      const result = String(local?.interactionId || getBoundSubviewInteractionId() || "").trim();
      if (isSubviewInteractionCancelled(result)) {
        return true;
      }
      if (local?.taskSeq != null && local.taskSeq !== state.subviewTaskSeq) {
        return true;
      }
      if (state.stopRequested) {
        return true;
      }
      if (state.pausedForSubview && !state.stopRequested) {
        return false;
      }
      return !state.taskRunning || arg1 && arg1 !== state.activeLoopId;
    }
    if (state.pausedForSubview && arg1 === state.activeLoopId && !state.stopRequested) {
      return false;
    }
    return !state.taskRunning || state.stopRequested || arg1 && arg1 !== state.activeLoopId;
  }
  const local = arg1 => !!arg1 && !!arg1.cancelled;
  function resetScrapeAiQueueOnStop() {
    state.scrapeAiQueue.length = 0;
  }
  const num = 1500;
  const num2 = 2500;
  const local2 = async (arg1, arg2, arg3, text = "等待") => {
    if (arg3 !== undefined && arg3 !== null) {
      await awaitSecurityChallengeIfPresent(arg3);
    }
    const result = Math.floor(Math.random() * (arg2 - arg1 + 1) + arg1);
    const local = text || "等待";
    const value = local === "等待" ? num2 : num;
    const value2 = result >= value;
    if (value2) {
      const result2 = (result / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + local + "] 模拟拟人等待 " + result2 + " 秒 (节奏间隔中，请稍候)...");
    }
    await new Promise(arg1 => setTimeout(arg1, result));
    if (value2) {
      const result2 = (result / 1000).toFixed(1);
      const value = "⏱ " + local + "：等待 " + result2 + " 秒";
      if (local === "互动间隔" || local === "主页评论后间隔") {
        reportCurrentAction(value);
      } else {
        reportTraceLog(value);
      }
    }
    if (shouldAbort(arg3)) {
      throw new Error("TASK_ABORTED");
    }
  };
  async function sleepWithinDeadline(arg1, num = 0) {
    const result = Math.max(0, Number(arg1) || 0);
    const value = num > 0 ? Math.max(0, num - Date.now()) : result;
    const value2 = num > 0 ? Math.min(result, value) : result;
    if (value2 <= 0) {
      return false;
    }
    await sleep(value2);
    return num <= 0 || Date.now() < num;
  }
  async function randomDelayWithinDeadline(arg1, arg2, arg3, arg4, num2 = 0) {
    if (arg3 !== undefined && arg3 !== null) {
      await awaitSecurityChallengeIfPresent(arg3);
    }
    const value = num2 > 0 ? Math.max(0, num2 - Date.now()) : Number.MAX_SAFE_INTEGER;
    if (value <= 0) {
      return false;
    }
    const result = Math.floor(Math.random() * (arg2 - arg1 + 1) + arg1);
    const result2 = Math.min(result, value);
    if (result2 >= num) {
      const result = (result2 / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + (arg4 || "等待") + "] 预算内等待 " + result + " 秒...");
      reportTraceLog("⏱ " + (arg4 || "等待") + "：等待 " + result + " 秒");
    }
    await sleep(result2);
    if (shouldAbort(arg3)) {
      throw new Error("TASK_ABORTED");
    }
    return num2 <= 0 || Date.now() < num2;
  }
  const local3 = async (arg1, arg2, arg3, text = "等待", arg5 = document) => {
    if (arg3 !== undefined && arg3 !== null) {
      await awaitSecurityChallengeIfPresent(arg3);
    }
    const result = Math.floor(Math.random() * (arg2 - arg1 + 1) + arg1);
    const local = text || "等待";
    const value = local === "等待" ? num2 : num;
    const value2 = result >= value;
    if (value2) {
      const result2 = (result / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + local + "] 模拟拟人等待 " + result2 + " 秒 (伴随播放器强制锁定中)...");
    }
    const value3 = Date.now() + result;
    while (Date.now() < value3) {
      if (shouldAbort(arg3)) {
        throw new Error("TASK_ABORTED");
      }
      pauseVisibleDouyinVideos(arg5);
      await sleep(Math.min(250, Math.max(50, value3 - Date.now())));
    }
    if (value2) {
      const result2 = (result / 1000).toFixed(1);
      const value = "⏱ " + local + "：等待 " + result2 + " 秒 (已锁定暂停)";
      if (local === "互动间隔" || local === "主页评论后间隔") {
        reportCurrentAction(value);
      } else {
        reportTraceLog(value);
      }
    }
    if (shouldAbort(arg3)) {
      throw new Error("TASK_ABORTED");
    }
  };
  function pauseVisibleDouyinVideos(arg1 = document, text = "") {
    const list = [];
    const local = arg1 => {
      if (arg1 && arg1.querySelectorAll && !list.includes(arg1)) {
        list.push(arg1);
      }
    };
    local(arg1);
    local(document);
    const list2 = [];
    if (arg1 && arg1 !== document && arg1.contains) {
      list2.push(arg1);
    }
    try {
      const result = getDouyinFeedScope();
      if (result && result.contains) {
        list2.push(result);
      }
    } catch (error) {}
    try {
      const result = resolveDouyinVideoDetailModal({
        includeFeed: true
      });
      if (result && result.contains) {
        list2.push(result);
      }
    } catch (error) {}
    const local2 = arg1 => {
      for (const item of list2) {
        if (item.contains(arg1)) {
          return true;
        }
      }
      return false;
    };
    const local3 = arg1 => {
      try {
        arg1.muted = true;
        arg1.autoplay = false;
        arg1.loop = false;
        const result = Number(arg1.duration);
        if (Number.isFinite(result) && result > 0.15 && result <= 15) {
          if (arg1.currentTime >= Math.max(0.02, result - 0.45) || result <= 3 && arg1.currentTime > 0.15) {
            arg1.currentTime = Math.min(0.05, Math.max(0, result * 0.05));
          }
        }
        if (typeof arg1.pause === "function") {
          arg1.pause();
        }
        return true;
      } catch (error) {
        return false;
      }
    };
    const set = new Set();
    let num = 0;
    for (const item of list) {
      if (!item.querySelectorAll) {
        continue;
      }
      const result = Array.from(item.querySelectorAll("video")).filter(arg1 => !set.has(arg1));
      const result2 = Array.from(item.querySelectorAll("audio")).filter(arg1 => !set.has(arg1));
      const list = [...result, ...result2];
      for (const item of list) {
        const result = isVisibleElement(item);
        const local = result || local2(item);
        if (!local) {
          continue;
        }
        set.add(item);
        if (local3(item)) {
          num += 1;
        }
      }
      Array.from(item.querySelectorAll?.(".xgplayer, [class*=\"xgplayer\"], [data-e2e=\"video-player\"], [data-e2e=\"video-player-container\"]") || []).forEach(arg1 => {
        if (!arg1 || set.has(arg1)) {
          return;
        }
        if (!isVisibleElement(arg1) && !local2(arg1)) {
          return;
        }
        set.add(arg1);
        try {
          const local = arg1.__player || arg1.player || arg1.xgPlayer || arg1._player;
          if (local && typeof local.pause === "function") {
            local.pause();
            num += 1;
          }
        } catch (error) {}
        const local = arg1.querySelector?.("video, audio");
        if (local && local3(local)) {
          num += 1;
        }
      });
    }
    if (num > 0 && text) {
      console.log("[Built-in-Debug] [视频防跳] " + text + "，已暂停 " + num + " 个可见或活动播放器");
    }
    return num;
  }
  async function burstPauseWithinOneSecond(arg1 = document, arg2 = null, {
    budgetMs = 1000,
    tickMs = 50,
    reason = "进入视频 1 秒内强制暂停"
  } = {}) {
    const local = arg1 || document;
    const value = Date.now() + Math.max(400, Math.min(1500, Number(budgetMs) || 1000));
    let num = 0;
    let num2 = 0;
    reportTraceLog("🧷 视频防跳：进入后 1 秒内强制暂停（含图文/短片）");
    while (Date.now() < value) {
      if (arg2 != null && shouldAbort(arg2)) {
        throw new Error("TASK_ABORTED");
      }
      num += pauseVisibleDouyinVideos(local, num2 === 0 ? reason : "") || 0;
      num2 += 1;
      await sleep(Math.max(30, Number(tickMs) || 50));
    }
    num += pauseVisibleDouyinVideos(local, reason + "（收尾）") || 0;
    return num;
  }
  function resumeVisibleDouyinVideos(arg1 = document, text = "") {
    const list = [];
    const local = arg1 => {
      if (arg1 && arg1.querySelectorAll && !list.includes(arg1)) {
        list.push(arg1);
      }
    };
    local(arg1);
    local(document);
    const list2 = [];
    if (arg1 && arg1 !== document && arg1.contains) {
      list2.push(arg1);
    }
    try {
      const result = getDouyinFeedScope();
      if (result && result.contains) {
        list2.push(result);
      }
    } catch (error) {}
    const local2 = arg1 => {
      for (const item of list2) {
        if (item.contains(arg1)) {
          return true;
        }
      }
      return false;
    };
    const set = new Set();
    let num = 0;
    for (const item of list) {
      if (!item.querySelectorAll) {
        continue;
      }
      const result = Array.from(item.querySelectorAll("video")).filter(arg1 => !set.has(arg1));
      const result2 = Array.from(item.querySelectorAll("audio")).filter(arg1 => !set.has(arg1));
      const list = [...result, ...result2];
      for (const item of list) {
        const result = isVisibleElement(item);
        const local = result || local2(item);
        if (!local) {
          continue;
        }
        set.add(item);
        try {
          item.muted = true;
          const local = item.play && item.play();
          if (local && typeof local.catch === "function") {
            local.catch(() => {});
          }
          num++;
        } catch (error) {}
      }
    }
    if (num > 0 && text) {
      console.log("[Built-in-Debug] [养号播放] " + text + "，已恢复 " + num + " 个可见或活动播放器");
    }
    return num;
  }
  function fn9(arg1, arg2) {
    const result = normalizeUrl(arg1 || "");
    const result2 = normalizeUrl(arg2 || "");
    if (!result || !result2) {
      return false;
    }
    if (result === result2) {
      return true;
    }
    const result3 = extractSpecificVideoId(result);
    const result4 = extractSpecificVideoId(result2);
    return !!result3 && !!result4 && result3 === result4;
  }
  function isSameVideoTitleLoose(arg1, arg2) {
    const result = String(arg1 || "").trim();
    const result2 = String(arg2 || "").trim();
    if (!result || !result2) {
      return true;
    }
    if (result === "未知视频" || result2 === "未知视频") {
      return true;
    }
    if (result === result2) {
      return true;
    }
    const result3 = result.slice(0, 16);
    const result4 = result2.slice(0, 16);
    return result3 === result4 || result2.includes(result3) || result.includes(result4);
  }
  function fn11(options = {}) {
    const list = [];
    for (const item of [options.leadVideoUrl, options.dedupKey, options.videoId]) {
      const local = extractSpecificVideoId(item) || extractVideoIdFromHref(item) || "";
      if (local && !list.includes(local)) {
        list.push(local);
      }
    }
    return list;
  }
  function getCurrentVideoGuardState(options = {}) {
    const value = platformSelectors["douyin.com"].modalContainer;
    const value2 = options.isFeedPlayback ? getDouyinFeedScope() || options.scope || document : document.querySelector(value) || options.scope || document;
    const result = normalizeUrl(window.location.href);
    const local = extractSpecificVideoId(result) || extractVideoIdFromHref(result) || "";
    const value3 = options.isFeedPlayback ? pickLeadVideoUrl(state.lockedLeadVideoUrl || getFeedVideoIdentity(value2), value2) : resolveCurrentVisibleVideoUrl(result, value2);
    const local2 = extractSpecificVideoId(value3) || extractVideoIdFromHref(value3) || "";
    const result2 = getVideoTitle(value2);
    const result3 = [options.leadVideoUrl, options.dedupKey].filter(Boolean);
    const result4 = fn11(options);
    let flag = true;
    if (value3 && result3.length) {
      flag = result3.some(arg1 => fn9(value3, arg1));
    } else if (result3.length && !value3) {
      flag = options.lenientWhenUnresolved !== false;
    }
    const local3 = options.videoTitle || "";
    const result5 = isSameVideoTitleLoose(local3, result2);
    const result6 = getVideoAuthorNickname(value2, value3);
    const result7 = normalizeAuthorAccountName(options.videoAuthor || "");
    const result8 = normalizeAuthorAccountName(result6);
    const local4 = !result7 || !result8 || result7 === result8;
    const local5 = !!local && !!result4.includes(String(local)) || !!local2 && !!result4.includes(String(local2)) || !!value3 && !!result3.some(arg1 => fn9(value3, arg1));
    const local6 = local5 || flag && result5 && local4;
    return {
      same: local6,
      currentUrl: value3,
      currentTitle: result2,
      currentAuthor: result6,
      sameUrl: flag,
      sameTitle: result5,
      sameAuthor: local4,
      videoIdMatched: local5,
      locationId: local,
      scope: value2
    };
  }
  async function releaseAbandonedVideoClaim(list = [], text = "") {
    const list2 = [...new Set((Array.isArray(list) ? list : [list]).filter(Boolean))];
    if (!list2.length) {
      return;
    }
    try {
      const result = getProcessedVideoKeyModule();
      for (const item of list2) {
        if (typeof result.forgetProcessedVideoKey === "function") {
          result.forgetProcessedVideoKey(state.processedVideos, item);
        } else {
          state.processedVideos.delete(item);
        }
      }
    } catch (error) {}
    try {
      await ipcRenderer.invoke("remove-processed-videos", list2);
      console.log("[Built-in-Debug] [视频防跳] 已释放抢占记录 (" + (text || "abandon") + "): " + list2.map(arg1 => extractSpecificVideoId(arg1) || arg1).join(","));
    } catch (error) {
      console.warn("[Built-in-Debug] [视频防跳] 释放抢占记录失败: " + (error?.message || error));
    }
  }
  async function guardedCurrentVideoDelay(arg1, arg2, arg3, arg4, options = {}, options2 = {}) {
    const {
      allowRandomPlay: allowRandomPlay = true
    } = options2;
    const local = allowRandomPlay && state.currentTask?.taskMode !== "scrape";
    const result = Math.floor(Math.random() * (arg2 - arg1 + 1) + arg1);
    const local2 = arg4 || "等待";
    const value = local2 === "等待" ? num2 : num;
    const value2 = result >= value;
    const result2 = getCurrentContentPauseProfile(options.scope || document);
    const result3 = Math.min(800, result2.intervalMs || 800);
    if (value2) {
      console.log("[Built-in-Debug] [" + local2 + "] 守护等待 " + (result / 1000).toFixed(1) + " 秒（" + result2.label + "，" + result3 + "ms 暂停巡检）...");
    }
    const result4 = Date.now();
    const value3 = result4 + result;
    const local3 = (arg1, arg2) => {
      if (arg1?.videoIdMatched || arg1?.same) {
        return false;
      }
      console.warn("[Built-in-Debug] [视频防跳] " + arg2 + "检测到视频已漂移: urlSame=" + arg1?.sameUrl + ", titleSame=" + arg1?.sameTitle + ", idMatch=" + arg1?.videoIdMatched + ", locId=" + (arg1?.locationId || "") + ", current=" + (arg1?.currentUrl || arg1?.currentTitle || "unknown"));
      return true;
    };
    pauseVisibleDouyinVideos(options.scope || document, "守护等待开始，先暂停视频");
    const result5 = getVisibleDouyinVideoDurationMs(options.scope || document);
    let num3 = 0;
    if (result5 > 0 && !result2.imageText) {
      const value = result5 > 2000 ? result5 - 2000 : Math.floor(result5 / 2);
      if (value > 200) {
        const value2 = Math.floor(Math.random() * 3000) + 2000;
        num3 = Math.min(value2, value);
      }
    }
    if (num3 > 0 && local) {
      console.log("[Built-in-Debug] [视频优化] 检测到视频时长 " + (result5 / 1000).toFixed(1) + " 秒，随机播放 " + (num3 / 1000).toFixed(1) + " 秒后暂停");
      resumeVisibleDouyinVideos(options.scope || document, "模拟视频随机播放阶段");
      const value = Date.now() + num3;
      let num = 0;
      while (Date.now() < value && Date.now() < value3) {
        if (shouldAbort(arg3)) {
          throw new Error("TASK_ABORTED");
        }
        const result = getCurrentVideoGuardState(options);
        if (!result.same) {
          num += 1;
          if (num >= 3 && local3(result, "播放期间")) {
            return false;
          }
        } else {
          num = 0;
        }
        await sleep(Math.min(200, Math.max(50, value - Date.now(), value3 - Date.now())));
      }
      pauseVisibleDouyinVideos(options.scope || document, "随机播放结束，锁定暂停");
    }
    let num4 = 0;
    while (Date.now() < value3) {
      if (shouldAbort(arg3)) {
        throw new Error("TASK_ABORTED");
      }
      pauseVisibleDouyinVideos(options.scope || document);
      const result = getCurrentVideoGuardState(options);
      if (!result.same) {
        num4 += 1;
        if (num4 >= 3 && local3(result, "等待期间")) {
          return false;
        }
      } else {
        num4 = 0;
      }
      await sleep(Math.min(result3, Math.max(120, value3 - Date.now())));
    }
    if (value2) {
      reportTraceLog(formatScrapeGuardWaitLabel(local2, "" + (result / 1000).toFixed(1)));
    }
    if (shouldAbort(arg3)) {
      throw new Error("TASK_ABORTED");
    }
    return true;
  }
  function fn17(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return 0;
    }
    const result2 = result.match(/(?:^|\s)(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s|$)|(?:^|\s)(\d{1,2}):(\d{2})(?:\s|$)/);
    if (!result2) {
      return 0;
    }
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    if (result2[2] !== undefined && result2[3] !== undefined) {
      num = parseInt(result2[1] || "0", 10);
      num2 = parseInt(result2[2] || "0", 10);
      num3 = parseInt(result2[3] || "0", 10);
    } else {
      num2 = parseInt(result2[4] || "0", 10);
      num3 = parseInt(result2[5] || "0", 10);
    }
    if (!Number.isFinite(num2) || !Number.isFinite(num3)) {
      return 0;
    }
    return (num * 3600 + num2 * 60 + num3) * 1000;
  }
  function getVisibleDouyinVideoDurationMs(arg1 = document) {
    const result = Array.from(arg1.querySelectorAll?.("video") || []).filter(isVisibleElement).sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      return result2.width * result2.height - result.width * result.height;
    });
    for (const item of result) {
      try {
        const result = Number(item.duration);
        if (Number.isFinite(result) && result > 0 && result < 86400) {
          return Math.round(result * 1000);
        }
      } catch (error) {}
    }
    const result2 = [".xgplayer-time-duration", "[class*=\"time-duration\"]", "[class*=\"TimeDuration\"]", "[data-e2e*=\"duration\"]", "[aria-label*=\"时长\"]", "[title*=\"时长\"]"].join(", ");
    const result3 = Array.from(arg1.querySelectorAll?.(result2) || []).filter(isVisibleElement);
    for (const item of result3) {
      const result = fn17(item.innerText || item.textContent || item.getAttribute("aria-label") || item.getAttribute("title") || "");
      if (result > 0) {
        return result;
      }
    }
    return 0;
  }
  function fn18(arg1 = document) {
    const result = Array.from(arg1.querySelectorAll?.("video") || []).filter(isVisibleElement);
    if (result.length > 0) {
      return false;
    }
    const result2 = Array.from(arg1.querySelectorAll?.("img, canvas, [data-e2e*=\"image\"], [class*=\"image\"], [class*=\"Image\"], [class*=\"photo\"], [class*=\"Photo\"], [class*=\"slide\"], [class*=\"Slide\"]") || []).filter(isVisibleElement);
    const result3 = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    return result2.length > 0 || /图文|图片|相册|共\d+张/.test(result3);
  }
  function getCurrentContentPauseProfile(arg1 = document) {
    const result = getVisibleDouyinVideoDurationMs(arg1);
    const local = !result && fn18(arg1);
    let num = 650;
    if (local) {
      num = 220;
    } else if (result > 0 && result <= 8000) {
      num = 220;
    } else if (result > 0 && result <= 15000) {
      num = 350;
    } else if (result > 0 && result <= 30000) {
      num = 500;
    }
    return {
      durationMs: result,
      imageText: local,
      intervalMs: num,
      label: result > 0 ? "视频时长约 " + (result / 1000).toFixed(1) + " 秒" : local ? "图文/短内容" : "未知时长"
    };
  }
  function startCurrentVideoPauseGuard(options = {}, arg2 = null, options2 = {}) {
    const local = options.scope || document;
    const result = getCurrentContentPauseProfile(local);
    const local2 = options2.intervalMs || (options2.pauseOnly ? Math.min(80, result.intervalMs) : result.intervalMs);
    const flag = !!options2.pauseOnly;
    let local3 = null;
    const obj = {
      drifted: false,
      stopped: false,
      driftStreak: 0,
      profile: result,
      lastState: null,
      hookedVideos: new Set(),
      stop: () => {}
    };
    const local4 = options2.driftConfirmTicks || 3;
    const local5 = arg1 => {
      if (obj.stopped) {
        return;
      }
      try {
        const value = arg1.target;
        if (value && value.pause) {
          value.pause();
          value.muted = true;
        }
        pauseVisibleDouyinVideos(local);
      } catch (error) {}
    };
    const local6 = arg1 => {
      if (obj.stopped) {
        return;
      }
      try {
        const value = arg1.target;
        if (!value || !value.pause) {
          return;
        }
        value.pause();
        value.muted = true;
        const result = Number(value.duration);
        if (Number.isFinite(result) && result > 0.15) {
          value.currentTime = Math.min(0.05, Math.max(0, result * 0.05));
        }
        pauseVisibleDouyinVideos(local, "ended 拦截：拉回并暂停防切条");
      } catch (error) {}
    };
    const local7 = arg1 => {
      if (obj.stopped || !flag) {
        return;
      }
      try {
        const value = arg1.target;
        if (!value || !value.pause) {
          return;
        }
        if (!value.paused) {
          value.pause();
        }
        const result = Number(value.duration);
        if (Number.isFinite(result) && result > 0 && result <= 5 && value.currentTime > 0.2) {
          value.currentTime = 0.05;
          value.pause();
        }
      } catch (error) {}
    };
    const local8 = arg1 => {
      if (!arg1?.querySelectorAll) {
        return;
      }
      Array.from(arg1.querySelectorAll("video, audio")).forEach(arg1 => {
        if (obj.hookedVideos.has(arg1)) {
          return;
        }
        obj.hookedVideos.add(arg1);
        arg1.addEventListener("play", local5, true);
        arg1.addEventListener("playing", local5, true);
        arg1.addEventListener("ended", local6, true);
        arg1.addEventListener("timeupdate", local7, true);
      });
    };
    const value = flag ? "进入视频后立即锁暂停" : "评论期暂停守护";
    console.log("[Built-in-Debug] [视频防跳] 启动" + value + "：" + result.label + "，间隔 " + local2 + "ms");
    if (!flag) {
      reportTraceLog("🧷 视频防跳：" + result.label + "，评论分析期间持续暂停，防止自动进入下一条");
    } else {
      reportTraceLog("🧷 视频防跳：进入后持续锁暂停（目标 1 秒内停住，含图文/短片）");
    }
    const local9 = () => {
      if (obj.stopped) {
        return;
      }
      if (arg2 && shouldAbort(arg2)) {
        obj.stop();
        return;
      }
      local8(local);
      local8(document);
      pauseVisibleDouyinVideos(local);
      if (flag) {
        return;
      }
      const result = getCurrentVideoGuardState(options);
      obj.lastState = result;
      if (!result.same) {
        obj.driftStreak += 1;
        if (obj.driftStreak >= local4) {
          obj.drifted = true;
          obj.stopped = true;
          console.warn("[Built-in-Debug] [视频防跳] 评论期检测到视频漂移(连续" + obj.driftStreak + "次): urlSame=" + result.sameUrl + ", titleSame=" + result.sameTitle + ", idMatch=" + result.videoIdMatched + ", current=" + (result.currentUrl || result.currentTitle || "unknown"));
        }
      } else {
        obj.driftStreak = 0;
      }
    };
    obj.stop = () => {
      if (obj.stopped && local3 === null && obj.hookedVideos.size === 0) {
        return;
      }
      obj.stopped = true;
      if (local3 !== null) {
        clearInterval(local3);
        local3 = null;
      }
      obj.hookedVideos.forEach(arg1 => {
        try {
          arg1.removeEventListener("play", local5, true);
        } catch (error) {}
        try {
          arg1.removeEventListener("playing", local5, true);
        } catch (error) {}
        try {
          arg1.removeEventListener("ended", local6, true);
        } catch (error) {}
        try {
          arg1.removeEventListener("timeupdate", local7, true);
        } catch (error) {}
      });
      obj.hookedVideos.clear();
    };
    local9();
    if (!obj.stopped) {
      local3 = setInterval(local9, local2);
    }
    return obj;
  }
  return {
    burstPauseWithinOneSecond: burstPauseWithinOneSecond,
    getCurrentContentPauseProfile: getCurrentContentPauseProfile,
    getCurrentVideoGuardState: getCurrentVideoGuardState,
    getVisibleDouyinVideoDurationMs: getVisibleDouyinVideoDurationMs,
    guardedCurrentVideoDelay: guardedCurrentVideoDelay,
    guardedPauseDelay: local3,
    isAiInvokeCancelled: local,
    isMonitorLoopId: isMonitorLoopId,
    isSameVideoTitleLoose: isSameVideoTitleLoose,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    randomDelay: local2,
    randomDelayWithinDeadline: randomDelayWithinDeadline,
    releaseAbandonedVideoClaim: releaseAbandonedVideoClaim,
    resetScrapeAiQueueOnStop: resetScrapeAiQueueOnStop,
    resumeVisibleDouyinVideos: resumeVisibleDouyinVideos,
    shouldAbort: shouldAbort,
    sleepWithinDeadline: sleepWithinDeadline,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard
  };
}
module.exports = {
  createAutomationMediaController: createAutomationMediaController
};
'use strict';

function createSearchVideoQueueController(options = {}) {
  const {
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    closeAllModals: closeAllModals,
    collectDouyinSearchResultCards: collectDouyinSearchResultCards,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findDouyinSearchCardContentId: findDouyinSearchCardContentId,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getDouyinSearchCardRoot: getDouyinSearchCardRoot,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    isVisibleElement: isVisibleElement,
    listLeadgenScrapeAwemes: listLeadgenScrapeAwemes,
    moveToNextVideo: moveToNextVideo,
    normalizeUrl: normalizeUrl,
    randomDelay: randomDelay,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    shouldAbort: shouldAbort,
    sleep: sleep,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    state: state
  } = options;
  function shouldUseSearchVideoUrlQueue(arg1 = state.currentTask) {
    return false;
  }
  function normalizeSearchQueueVideoUrl(arg1) {
    const local = extractSpecificVideoId(arg1) || extractVideoIdFromHref(arg1);
    if (!local || !/^\d{5,}$/.test(String(local))) {
      return "";
    }
    return "https://www.douyin.com/video/" + local;
  }
  function fn3(arg1, arg2 = window._searchVideoUrls) {
    const local = extractSpecificVideoId(arg1) || extractVideoIdFromHref(arg1);
    if (!local || !Array.isArray(arg2) || !arg2.length) {
      return false;
    }
    return arg2.some(arg1 => extractSpecificVideoId(arg1) === local);
  }
  function clearSearchVideoUrlQueue() {
    window._searchVideoUrls = [];
    window._searchVideoQueueKeyword = null;
    window._searchPendingOpenUrl = "";
    window._searchSessionSkippedUrls = [];
    clearSearchSlideOscillationState();
  }
  function clearSearchSlideOscillationState() {
    window._searchSlideLastKey = "";
    window._searchSlidePrevKey = "";
    window._searchSlidePairHits = 0;
    window._searchSlideSameHits = 0;
  }
  function noteSearchSlideVideoKey(arg1) {
    const local = extractSpecificVideoId(arg1) || extractVideoIdFromHref(arg1) || String(arg1 || "").trim();
    if (!local) {
      return "";
    }
    const result = String(window._searchSlideLastKey || "");
    const result2 = String(window._searchSlidePrevKey || "");
    if (local === result) {
      window._searchSlideSameHits = (Number(window._searchSlideSameHits) || 1) + 1;
      console.log("[Built-in-Debug] [搜索末尾] 同一视频连续出现 " + window._searchSlideSameHits + "/3：…" + String(local).slice(-8));
      if (window._searchSlideSameHits >= 3) {
        return "same";
      } else {
        return "";
      }
    }
    window._searchSlideSameHits = 1;
    if (result2 && result && local === result2 && local !== result) {
      window._searchSlidePairHits = (Number(window._searchSlidePairHits) || 0) + 1;
      console.log("[Built-in-Debug] [搜索末尾] 检测到末尾来回 " + window._searchSlidePairHits + "/2：" + ("…" + String(result).slice(-8) + " ↔ …" + String(local).slice(-8)));
      window._searchSlidePrevKey = result;
      window._searchSlideLastKey = local;
      if (window._searchSlidePairHits >= 2) {
        return "pair";
      } else {
        return "";
      }
    }
    if (result2 && result && local !== result && local !== result2) {
      window._searchSlidePairHits = 0;
    }
    window._searchSlidePrevKey = result;
    window._searchSlideLastKey = local;
    return "";
  }
  function markSearchQueueUrlSkipped(arg1, arg2 = null) {
    const local = normalizeSearchQueueVideoUrl(arg1) || (() => {
      try {
        return getProcessedVideoKeyModule().normalizeProcessedVideoKey(arg1) || "";
      } catch (error) {
        return "";
      }
    })() || String(arg1 || "").trim();
    if (!local) {
      return "";
    }
    if (!Array.isArray(window._searchSessionSkippedUrls)) {
      window._searchSessionSkippedUrls = [];
    }
    const result = extractSpecificVideoId(local);
    const result2 = window._searchSessionSkippedUrls.some(arg1 => {
      if (arg1 === local) {
        return true;
      }
      return result && extractSpecificVideoId(arg1) === result;
    });
    if (!result2) {
      window._searchSessionSkippedUrls.push(local);
      if (window._searchSessionSkippedUrls.length > 500) {
        window._searchSessionSkippedUrls = window._searchSessionSkippedUrls.slice(-400);
      }
    }
    try {
      getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
      if (result) {
        getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, "https://www.douyin.com/video/" + result);
      }
    } catch (error) {}
    if (arg2 && typeof arg2.add === "function") {
      arg2.add(local);
      if (result) {
        arg2.add("https://www.douyin.com/video/" + result);
      }
    }
    return local;
  }
  function setSearchPendingOpenUrl(arg1) {
    const local = normalizeSearchQueueVideoUrl(arg1) || String(arg1 || "").trim();
    window._searchPendingOpenUrl = local || "";
    if (local) {
      rememberPendingLeadVideoUrl(local);
    }
    return local;
  }
  function clearSearchPendingOpenUrl() {
    window._searchPendingOpenUrl = "";
  }
  function fn10() {
    const local = normalizeSearchQueueVideoUrl(window._searchPendingOpenUrl || "") || String(window._searchPendingOpenUrl || "").trim();
    window._searchPendingOpenUrl = "";
    return local;
  }
  function peekSearchPendingOpenUrl() {
    return normalizeSearchQueueVideoUrl(window._searchPendingOpenUrl || "") || String(window._searchPendingOpenUrl || "").trim();
  }
  function isSearchQueueUrlSessionDone(arg1, arg2 = null) {
    if (!arg1) {
      return false;
    }
    const result = extractSpecificVideoId(arg1);
    const result2 = normalizeSearchQueueVideoUrl(arg1);
    if (arg2 && typeof arg2.has === "function") {
      if (result2 && arg2.has(result2)) {
        return true;
      }
      if (arg2.has(arg1)) {
        return true;
      }
      if (result && arg2.has("https://www.douyin.com/video/" + result)) {
        return true;
      }
      for (const item of arg2) {
        if (!item) {
          continue;
        }
        if (item === arg1 || item === result2) {
          return true;
        }
        if (result && extractSpecificVideoId(item) === result) {
          return true;
        }
      }
    }
    try {
      if (getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, arg1)) {
        return true;
      }
      if (result2 && getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, result2)) {
        return true;
      }
    } catch (error) {}
    return false;
  }
  function findNextUnprocessedSearchQueueUrl({
    queue = window._searchVideoUrls,
    processedSet = null,
    sessionUrls = null,
    excludeIds = []
  } = {}) {
    const value = Array.isArray(queue) ? queue : [];
    const set = new Set((Array.isArray(excludeIds) ? excludeIds : []).map(arg1 => extractSpecificVideoId(arg1) || String(arg1 || "").trim()).filter(Boolean));
    const local = arg1 => {
      try {
        if (processedSet && getProcessedVideoKeyModule().hasProcessedVideoKey(processedSet, arg1)) {
          return true;
        }
      } catch (error) {}
      return isSearchQueueUrlSessionDone(arg1, sessionUrls);
    };
    return value.find(arg1 => {
      const result = extractSpecificVideoId(arg1);
      if (!result) {
        return false;
      }
      if (set.has(result)) {
        return false;
      }
      if (local(arg1)) {
        return false;
      }
      return true;
    }) || "";
  }
  async function openSearchQueueVideoByUrl(arg1, arg2, {
    allowHardNavigation = true,
    softWaitMs = 3500,
    hardWaitMs = 6500
  } = {}) {
    const local = normalizeSearchQueueVideoUrl(arg2) || String(arg2 || "").trim();
    const result = extractSpecificVideoId(local);
    if (!local || !result) {
      return "failed";
    }
    rememberPendingLeadVideoUrl(local);
    if (window.location.href.includes("/search/")) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("modal_id", result);
        const result2 = url.toString();
        if (result2 !== window.location.href) {
          try {
            history.replaceState({}, "", result2);
            window.dispatchEvent(new PopStateEvent("popstate"));
          } catch (error) {}
        }
        let result3 = await waitForVideoDetailReadyAndPause(arg1, local, softWaitMs);
        if (result3) {
          state.lastClickedId = local;
          return "ready";
        }
        if (allowHardNavigation && !shouldAbort(arg1)) {
          suspendAutomationForNavigation();
          window.location.href = result2;
          return "navigating";
        }
      } catch (error) {}
    }
    if (!allowHardNavigation) {
      return "failed";
    }
    suspendAutomationForNavigation();
    try {
      const value = window.location.href.includes("/search/") ? window.location.href : buildDouyinSearchUrl(window._searchVideoQueueKeyword || "");
      const url = new URL(value);
      url.searchParams.set("modal_id", result);
      window.location.href = url.toString();
    } catch (error) {
      window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + result;
    }
    return "navigating";
  }
  async function advanceAfterSearchQueuedVideo(arg1, {
    videoTitle = "",
    leadVideoUrl = "",
    dedupKey = "",
    modal = null,
    phaseLabel = "导航",
    activeKeyword = "",
    sessionUrls = null,
    onSwitchOk = null
  } = {}) {
    const value = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
    const local = value.length > 0 && shouldUseSearchVideoUrlQueue(state.currentTask);
    if (!local) {
      return "fallback";
    }
    if (state.sessionProcessedCount >= state.targetVideoCount) {
      console.log("[Built-in-Debug] [搜索队列] 已处理 " + state.sessionProcessedCount + "/" + state.targetVideoCount + "，关闭弹窗并收尾本词");
      reportCurrentAction("本词搜索队列已处理完，正在关闭弹窗…");
      reportTraceLog("ℹ️ 搜索评论队列：已完成 " + state.sessionProcessedCount + "/" + state.targetVideoCount + "，切换新词", null, "normal");
      await closeAllModals(arg1);
      return "done";
    }
    const local2 = getFeedVideoIdentity(getDouyinFeedScope() || modal) || "";
    await moveToNextVideo(arg1);
    const result = await awaitFeedVideoSwitchSettled(arg1, {
      previousIdentity: local2,
      previousTitle: videoTitle,
      leadVideoUrl: leadVideoUrl,
      dedupKey: dedupKey,
      phaseLabel: phaseLabel
    });
    const local3 = resolveCurrentVisibleVideoUrl("", getDouyinFeedScope() || resolveDouyinVideoDetailModal({
      includeFeed: false
    }) || document) || "";
    const local4 = extractSpecificVideoId(local3) || extractSpecificVideoId(getFeedVideoIdentity() || "");
    const local5 = local4 && fn3(local3 || local4, value);
    const local6 = sessionUrls || new Set();
    const local7 = local4 && (getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, local3) || getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, "https://www.douyin.com/video/" + local4) || local6.has(local3) || local6.has("https://www.douyin.com/video/" + local4) || isSearchQueueUrlSessionDone(local3 || local4, local6));
    if (result && !local7) {
      if (!local5) {
        console.log("[Built-in-Debug] [搜索队列] 切条成功但未命中预收集队列 (id=" + (local4 || "unknown") + ")，继续处理当前条");
        reportTraceLog("ℹ️ 搜索队列：切条已成功，继续分析当前视频", null, "normal");
      }
      if (typeof onSwitchOk === "function") {
        onSwitchOk();
      }
      window._modalSlideCount = (window._modalSlideCount || 0) + 1;
      await randomDelay(1500, 3000, arg1, "切换喘息");
      return "continued";
    }
    const result2 = findNextUnprocessedSearchQueueUrl({
      queue: value,
      processedSet: state.processedVideos,
      sessionUrls: local6,
      excludeIds: [dedupKey, leadVideoUrl, local3, local4]
    });
    if (!result2) {
      console.log("[Built-in-Debug] [搜索队列] 无剩余未处理链接，收尾本词");
      reportTraceLog("ℹ️ 搜索评论队列：无剩余链接，关闭弹窗并切换新词", null, "normal");
      await closeAllModals(arg1);
      clearSearchPendingOpenUrl();
      state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount);
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      return "done";
    }
    markSearchQueueUrlSkipped(dedupKey || leadVideoUrl, local6);
    if (local7) {
      markSearchQueueUrlSkipped(local3 || local4, local6);
    }
    console.log("[Built-in-Debug] [搜索队列] 弹层切条未对准可用视频，改打开: " + result2 + " (switched=" + !!result + ", inQueue=" + !!local5 + ", done=" + !!local7 + ")");
    reportCurrentAction("搜索队列切条未对准，正在按链接打开下一条…");
    reportTraceLog("🔗 搜索队列兜底打开：…" + String(result2).slice(-16));
    setSearchPendingOpenUrl(result2);
    state.lastClickedId = result2;
    rememberPendingLeadVideoUrl(result2);
    if (window._saveRadarState) {
      window._saveRadarState();
    }
    const result3 = await openSearchQueueVideoByUrl(arg1, result2, {
      allowHardNavigation: true,
      softWaitMs: 4500,
      hardWaitMs: 6500
    });
    if (result3 === "navigating") {
      return "navigating";
    }
    if (result3 === "ready") {
      clearSearchPendingOpenUrl();
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      if (typeof onSwitchOk === "function") {
        onSwitchOk();
      }
      await randomDelay(1200, 2200, arg1, "队列打开喘息");
      return "continued";
    }
    await closeAllModals(arg1);
    suspendAutomationForNavigation();
    try {
      const result = extractSpecificVideoId(result2);
      const value = window.location.href.includes("/search/") ? window.location.href : buildDouyinSearchUrl(activeKeyword || "");
      const url = new URL(value);
      if (result) {
        url.searchParams.set("modal_id", result);
      }
      window.location.href = result ? url.toString() : result2;
    } catch (error) {
      const result = extractSpecificVideoId(result2);
      window.location.href = result ? "https://www.douyin.com/jingxuan?modal_id=" + result : result2;
    }
    return "navigating";
  }
  function buildDouyinSearchResultCardMap() {
    const text = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]";
    let list = [];
    try {
      list = Array.from(document.querySelectorAll(text)).filter(isVisibleElement);
    } catch (error) {
      list = [];
    }
    const map = new Map();
    list.forEach(arg1 => {
      const local = arg1.href || arg1.getAttribute("href");
      if (!local) {
        return;
      }
      const local2 = normalizeSearchQueueVideoUrl(local) || normalizeUrl(local);
      if (!local2 || map.has(local2)) {
        return;
      }
      map.set(local2, {
        clickTarget: arg1,
        card: getDouyinSearchCardRoot(arg1)
      });
    });
    const result = collectDouyinSearchResultCards();
    result.forEach(arg1 => {
      const result = findDouyinSearchCardContentId(arg1);
      if (!result) {
        return;
      }
      const result2 = normalizeSearchQueueVideoUrl("https://www.douyin.com/video/" + result);
      if (!result2 || map.has(result2)) {
        return;
      }
      map.set(result2, {
        clickTarget: getDouyinSearchCardClickTarget(arg1),
        card: getDouyinSearchCardRoot(arg1)
      });
    });
    return {
      cardMap: map,
      allLinks: list,
      customCards: result
    };
  }
  async function collectSearchVideoUrlsForCommentTask(arg1, num = 20) {
    const result = Math.max(1, Math.min(500, Math.floor(Number(num) || 20)));
    reportCurrentAction("正在收集搜索结果视频链接（目标 " + result + " 条）…");
    reportTraceLog("🔍 搜索评论队列：开始收集，目标 " + result + " 条");
    try {
      ensureLeadgenScrapeApiHook({
        force: true
      });
    } catch (error) {}
    const list = [];
    const set = new Set();
    const local = arg1 => {
      const result = normalizeSearchQueueVideoUrl(arg1);
      const result2 = extractSpecificVideoId(result);
      if (!result2 || set.has(result2)) {
        return false;
      }
      set.add(result2);
      list.push(result);
      return true;
    };
    let num2 = 0;
    const result2 = Math.min(80, Math.max(10, result * 3));
    for (let num = 0; num < result2; num += 1) {
      if (shouldAbort(arg1)) {
        break;
      }
      const value = list.length;
      const {
        cardMap: cardMap
      } = buildDouyinSearchResultCardMap();
      for (const item of cardMap.keys()) {
        if (list.length >= result) {
          break;
        }
        local(item);
      }
      try {
        for (const item of listLeadgenScrapeAwemes() || []) {
          if (list.length >= result) {
            break;
          }
          local(item?.videoUrl || item?.videoId);
        }
      } catch (error) {}
      const value2 = list.length - value;
      if (list.length >= result) {
        console.log("[Built-in-Debug] [搜索队列] 已达目标 " + list.length + "/" + result + "（第 " + (num + 1) + " 轮）");
        break;
      }
      if (value2 === 0) {
        num2 += 1;
      } else {
        num2 = 0;
      }
      let flag = false;
      try {
        flag = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      } catch (error) {}
      if (num2 >= 4 || flag && num2 >= 2 || cardMap.size === 0 && num2 >= 2) {
        console.log("[Built-in-Debug] [搜索队列] 停止收集: emptyStreak=" + num2 + " bottom=" + flag + " " + ("cards=" + cardMap.size + " got=" + list.length + "/" + result));
        break;
      }
      reportCurrentAction("搜索队列收集中 " + list.length + "/" + result + "，继续下拉…");
      if (num === 0 || value2 > 0 || num % 3 === 0) {
        reportTraceLog("🎬 搜索评论队列：滚动第 " + (num + 1) + " 轮，已收集 " + list.length + "/" + result);
      }
      try {
        window.scrollBy(0, 1100);
      } catch (error) {}
      await randomDelay(900, 1600, arg1, "搜索队列收集滚动");
    }
    try {
      window.scrollTo(0, 0);
    } catch (error) {}
    await sleep(700);
    reportTraceLog("✅ 搜索评论队列：收集完成 " + list.length + " 条（目标 " + result + "）");
    reportCurrentAction("已收集 " + list.length + " 条搜索视频链接，准备从第一条进入…");
    return list;
  }
  return {
    advanceAfterSearchQueuedVideo: advanceAfterSearchQueuedVideo,
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
    clearSearchSlideOscillationState: clearSearchSlideOscillationState,
    clearSearchVideoUrlQueue: clearSearchVideoUrlQueue,
    collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
    findNextUnprocessedSearchQueueUrl: findNextUnprocessedSearchQueueUrl,
    isSearchQueueUrlSessionDone: isSearchQueueUrlSessionDone,
    markSearchQueueUrlSkipped: markSearchQueueUrlSkipped,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    noteSearchSlideVideoKey: noteSearchSlideVideoKey,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    peekSearchPendingOpenUrl: peekSearchPendingOpenUrl,
    setSearchPendingOpenUrl: setSearchPendingOpenUrl,
    shouldUseSearchVideoUrlQueue: shouldUseSearchVideoUrlQueue
  };
}
module.exports = {
  createSearchVideoQueueController: createSearchVideoQueueController
};
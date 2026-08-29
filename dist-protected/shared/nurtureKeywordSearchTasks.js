'use strict';

const NURTURE_SEARCH_COLLECT_LIMIT = 8;
const NURTURE_SEARCH_READY_WAIT_MS = 5000;
const NURTURE_SEARCH_NAV_REUSE_MS = 45000;
const NURTURE_SEARCH_EMPTY_RETRY_BEFORE_RELOAD = 1;
const NURTURE_SEARCH_EMPTY_RETRY_BEFORE_ADVANCE = 2;
const NURTURE_SEARCH_KEYWORD_COOLDOWN_MS = 720000;
function persistNurtureSearchState(arg1, arg2, arg3) {
  try {
    const {
      currentTask: currentTask,
      ...local
    } = arg3 || {};
    arg1.setItem(arg2, JSON.stringify(local));
  } catch (error) {
    try {
      arg1.setItem(arg2, JSON.stringify(arg3));
    } catch (error) {}
  }
}
function safeDecodeURIComponent(arg1) {
  try {
    return decodeURIComponent(String(arg1 || ""));
  } catch (error) {
    return String(arg1 || "");
  }
}
function extractSearchKeywordFromHref(arg1) {
  try {
    const url = new URL(String(arg1 || ""), "https://www.douyin.com");
    const result = String(url.pathname || "").match(/\/search\/([^/?#]+)/i);
    if (result?.[1]) {
      return safeDecodeURIComponent(result[1]).trim();
    }
    const local = url.searchParams.get("keyword") || url.searchParams.get("search_keyword") || url.searchParams.get("keyword_id") || "";
    return safeDecodeURIComponent(local).trim();
  } catch (error) {
    return "";
  }
}
function isOnAnyDouyinSearchPage() {
  try {
    return /douyin\.com\/search/i.test(String(window.location.href || ""));
  } catch (error) {
    return false;
  }
}
function pickNurtureSearchKeyword(arg1) {
  const value = Array.isArray(arg1.interestKeywords) ? arg1.interestKeywords.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : [];
  if (!value.length) {
    return "";
  }
  const value2 = arg1.searchExhaustedKeywords && typeof arg1.searchExhaustedKeywords === "object" ? arg1.searchExhaustedKeywords : {};
  const result = Date.now();
  const value3 = Math.max(0, Number(arg1.searchKeywordIndex) || 0) % value.length;
  for (let num = 0; num < value.length; num += 1) {
    const value4 = (value3 + num) % value.length;
    const value5 = value[value4];
    const local = Number(value2[value5]) || 0;
    if (local && result < local) {
      continue;
    }
    arg1.searchKeywordIndex = value4;
    return value5;
  }
  return "";
}
function advanceNurtureSearchKeyword(arg1) {
  const value = Array.isArray(arg1.interestKeywords) ? arg1.interestKeywords : [];
  if (!value.length) {
    return;
  }
  arg1.searchKeywordIndex = (Math.max(0, Number(arg1.searchKeywordIndex) || 0) + 1) % value.length;
  arg1.searchQueue = [];
  arg1.searchQueueIndex = 0;
  arg1.searchKeyword = "";
  delete arg1.searchQueueKeyword;
  arg1.searchEmptyStreak = 0;
  delete arg1.searchEmptyReloaded;
  delete arg1.pendingSearchOpenUrl;
  delete arg1.pendingSearchOpenIndex;
  delete arg1.pendingSearchHardNavTried;
}
function markNurtureSearchKeywordExhausted(arg1, arg2) {
  const result = String(arg2 || "").trim();
  if (!result) {
    return;
  }
  if (!arg1.searchExhaustedKeywords || typeof arg1.searchExhaustedKeywords !== "object") {
    arg1.searchExhaustedKeywords = {};
  }
  arg1.searchExhaustedKeywords[result] = Date.now() + NURTURE_SEARCH_KEYWORD_COOLDOWN_MS;
}
function isOnKeywordSearchPage(arg1) {
  try {
    const result = String(window.location.href || "");
    if (!/douyin\.com\/search/i.test(result)) {
      return false;
    }
    const result2 = String(arg1 || "").trim();
    if (!result2) {
      return true;
    }
    const result3 = encodeURIComponent(result2);
    if (result.includes(result3) || result.includes(result2)) {
      return true;
    }
    const result4 = safeDecodeURIComponent(result);
    if (result4.includes(result2)) {
      return true;
    }
    const result5 = extractSearchKeywordFromHref(result);
    if (!result5) {
      return false;
    }
    return result5 === result2 || result5.includes(result2) || result2.includes(result5);
  } catch (error) {
    return isOnAnyDouyinSearchPage();
  }
}
function shouldReuseCurrentSearchPage(arg1, arg2) {
  if (!isOnAnyDouyinSearchPage()) {
    return false;
  }
  if (isOnKeywordSearchPage(arg2)) {
    return true;
  }
  const value = String(arg1.searchNavKeyword || "") === String(arg2 || "");
  const value2 = Date.now() - (Number(arg1.searchNavAt) || 0) < NURTURE_SEARCH_NAV_REUSE_MS;
  return value && value2;
}
function extractIdFromUrl(arg1, arg2) {
  try {
    return arg2?.(arg1) || "";
  } catch (error) {
    return "";
  }
}
function hrefHasModalId(arg1) {
  try {
    const result = String(window.location.href || "");
    if (!arg1) {
      return /modal_id=/.test(result);
    }
    return result.includes("modal_id=" + arg1) || result.includes("/video/" + arg1) || result.includes("/note/" + arg1);
  } catch (error) {
    return false;
  }
}
function findSearchCardForUrl(arg1, options = {}) {
  const {
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    extractSpecificVideoId: extractSpecificVideoId
  } = options;
  if (typeof buildDouyinSearchResultCardMap !== "function") {
    return null;
  }
  const local = normalizeSearchQueueVideoUrl?.(arg1) || String(arg1 || "").trim();
  const result = extractIdFromUrl(local, extractSpecificVideoId);
  const {
    cardMap: cardMap
  } = buildDouyinSearchResultCardMap() || {};
  if (!cardMap || typeof cardMap.get !== "function") {
    return null;
  }
  if (local && cardMap.has(local)) {
    return cardMap.get(local);
  }
  for (const [local, local2] of cardMap.entries()) {
    const result2 = extractIdFromUrl(local, extractSpecificVideoId);
    if (result && result2 && String(result2) === String(result)) {
      return local2;
    }
  }
  return null;
}
async function isNurtureSearchDetailReady(arg1, arg2, options = {}, num = 0) {
  const {
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    isVisibleElement: isVisibleElement
  } = options;
  if (typeof waitForVideoDetailReadyAndPause === "function" && num > 0) {
    const result = await waitForVideoDetailReadyAndPause(arg1, arg2, num);
    if (result) {
      return true;
    }
  }
  try {
    const local = resolveDouyinVideoDetailModal?.({
      includeFeed: false
    });
    if (local && (!isVisibleElement || isVisibleElement(local))) {
      return true;
    }
  } catch (error) {}
  return hrefHasModalId(extractIdFromUrl(arg2, options.extractSpecificVideoId));
}
async function openNurtureSearchVideo(arg1, arg2, arg3, options = {}) {
  const {
    simulateHumanClick: simulateHumanClick,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    extractSpecificVideoId: extractSpecificVideoId,
    setSearchPendingOpenUrl: setSearchPendingOpenUrl,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    shouldAbort: shouldAbort,
    reportTraceLog: reportTraceLog,
    reportCurrentAction: reportCurrentAction,
    clipTraceText: clipTraceText
  } = options;
  const result = extractIdFromUrl(arg2, extractSpecificVideoId);
  if (!result) {
    return "failed";
  }
  try {
    setSearchPendingOpenUrl?.(arg2);
  } catch (error) {}
  if (await isNurtureSearchDetailReady(arg1, arg2, options, 0)) {
    const result = await isNurtureSearchDetailReady(arg1, arg2, options, 2500);
    if (result) {
      reportTraceLog?.("📺 养号：已在目标视频详情，开始完播");
      return "ready";
    }
  }
  const result2 = findSearchCardForUrl(arg2, options);
  const value = result2 ? getDouyinSearchCardClickTarget?.(result2.card) || result2.clickTarget || result2.card : null;
  if (value && typeof simulateHumanClick === "function" && !shouldAbort?.(arg1)) {
    reportCurrentAction?.("养号：点击搜索结果卡片打开视频…");
    reportTraceLog?.("🖱 养号：点击搜索卡片打开 …" + String(result).slice(-8));
    try {
      await simulateHumanClick(value, arg1);
    } catch (error) {
      reportTraceLog?.("养号：搜索卡片点击异常（" + (clipTraceText?.(error?.message || error, 40) || "error") + "）", null, "warning");
    }
    if (await isNurtureSearchDetailReady(arg1, arg2, options, NURTURE_SEARCH_READY_WAIT_MS)) {
      return "ready";
    }
    if (result2?.card && result2.card !== value) {
      try {
        await simulateHumanClick(getDouyinSearchCardClickTarget?.(result2.card) || result2.card, arg1);
      } catch (error) {}
      if (await isNurtureSearchDetailReady(arg1, arg2, options, 3500)) {
        return "ready";
      }
    }
  }
  if (typeof openSearchQueueVideoByUrl === "function") {
    const result = await openSearchQueueVideoByUrl(arg1, arg2, {
      allowHardNavigation: false,
      softWaitMs: NURTURE_SEARCH_READY_WAIT_MS
    });
    if (result === "ready") {
      return "ready";
    }
  } else if (typeof waitForVideoDetailReadyAndPause === "function" && window.location.href.includes("/search/")) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("modal_id", result);
      if (url.toString() !== window.location.href) {
        history.replaceState({}, "", url.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    } catch (error) {}
    if (await waitForVideoDetailReadyAndPause(arg1, arg2, NURTURE_SEARCH_READY_WAIT_MS)) {
      return "ready";
    }
  }
  if (arg3.pendingSearchHardNavTried) {
    reportTraceLog?.("养号：该视频已硬跳仍未进详情，跳过本条", null, "warning");
    return "failed";
  }
  if (shouldAbort?.(arg1)) {
    return "failed";
  }
  arg3.pendingSearchHardNavTried = true;
  reportCurrentAction?.("养号：点击未拉起详情，modal_id 硬跳打开…");
  reportTraceLog?.("🔗 养号：modal_id 硬跳打开 …" + String(result).slice(-8));
  try {
    suspendAutomationForNavigation?.();
  } catch (error) {}
  try {
    const url = new URL(window.location.href.includes("/search/") ? window.location.href : "https://www.douyin.com/search/" + encodeURIComponent(arg3.searchKeyword || ""));
    url.searchParams.set("modal_id", result);
    window.location.href = url.toString();
  } catch (error) {
    window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + result;
  }
  return "navigating";
}
async function runNurtureKeywordSearchWatchRound(arg1, arg2, options = {}) {
  const {
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
    closeAllModals: closeAllModals,
    shouldAbort: shouldAbort,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    clipTraceText: clipTraceText,
    sessionStorage: sessionStorage,
    getNurtureStateKey: getNurtureStateKey,
    nurtureWatchCurrentVideo: nurtureWatchCurrentVideo,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
    waitForDouyinSearchContentAfterZero: waitForDouyinSearchContentAfterZero,
    prepareSearchPageReload: prepareSearchPageReload
  } = options;
  if (typeof buildDouyinSearchUrl !== "function" || typeof collectSearchVideoUrlsForCommentTask !== "function" || typeof nurtureWatchCurrentVideo !== "function") {
    return {
      didWork: false,
      skipped: true,
      reason: "search_deps_missing"
    };
  }
  const value = typeof getNurtureStateKey === "function" ? getNurtureStateKey() : "";
  const result = String(arg2.searchKeyword || pickNurtureSearchKeyword(arg2) || "").trim();
  if (!result) {
    const local = Array.isArray(arg2.interestKeywords) && arg2.interestKeywords.some(arg1 => String(arg1 || "").trim());
    if (local) {
      reportTraceLog?.("🌱 养号：当前关键词暂无可用结果，短暂改走推荐流", null, "warning");
      await randomDelay?.(2500, 4500, arg1, "养号搜索词冷却");
      return {
        didWork: false,
        skipped: true,
        reason: "search_temporarily_exhausted"
      };
    }
    reportTraceLog?.("🌱 养号：未配置兴趣关键词，跳过搜索完播");
    return {
      didWork: false,
      skipped: true,
      reason: "no_keywords"
    };
  }
  arg2.searchKeyword = result;
  try {
    window._searchVideoQueueKeyword = result;
  } catch (error) {}
  if (!Array.isArray(arg2.searchQueue) || !arg2.searchQueue.length || arg2.searchQueueKeyword !== result) {
    if (!arg2.pendingSearchOpenUrl || !Array.isArray(arg2.searchQueue) || !arg2.searchQueue.length) {
      if (!shouldReuseCurrentSearchPage(arg2, result)) {
        const result2 = buildDouyinSearchUrl(result);
        reportCurrentAction?.("养号：搜索「" + result + "」…");
        reportTraceLog?.("🔍 养号：打开搜索「" + (clipTraceText?.(result, 24) || result) + "」并收集视频");
        arg2.searchNavKeyword = result;
        arg2.searchNavAt = Date.now();
        arg2.searchEmptyStreak = 0;
        delete arg2.searchEmptyReloaded;
        try {
          prepareSearchPageReload?.(arg1, result, "养号打开搜索");
        } catch (error) {}
        persistNurtureSearchState(sessionStorage, value, arg2);
        window.location.href = result2;
        return {
          didWork: true,
          navigated: true
        };
      }
      if (typeof awaitSecurityChallengeIfPresent === "function") {
        await awaitSecurityChallengeIfPresent(arg1);
      }
      await randomDelay?.(1800, 3200, arg1, "搜索页加载");
      if (typeof waitForDouyinSearchContentAfterZero === "function") {
        reportCurrentAction?.("养号：等待「" + result + "」搜索结果就绪…");
        const result2 = await waitForDouyinSearchContentAfterZero(arg1, result);
        if (result2?.aborted || shouldAbort?.(arg1)) {
          return {
            didWork: false,
            skipped: true,
            reason: "aborted"
          };
        }
      }
      reportCurrentAction?.("养号：收集「" + result + "」搜索结果…");
      const result2 = await collectSearchVideoUrlsForCommentTask(arg1, NURTURE_SEARCH_COLLECT_LIMIT);
      arg2.searchQueue = Array.isArray(result2) ? result2.filter(Boolean) : [];
      arg2.searchQueueIndex = 0;
      arg2.searchQueueKeyword = result;
      try {
        window._searchVideoUrls = arg2.searchQueue.slice();
      } catch (error) {}
      persistNurtureSearchState(sessionStorage, value, arg2);
      if (!arg2.searchQueue.length) {
        arg2.searchEmptyStreak = (Number(arg2.searchEmptyStreak) || 0) + 1;
        const value2 = arg2.searchEmptyStreak;
        if (value2 <= NURTURE_SEARCH_EMPTY_RETRY_BEFORE_RELOAD) {
          reportTraceLog?.("🔍 养号：「" + (clipTraceText?.(result, 24) || result) + "」暂未扫到视频（第 " + value2 + " 次），稍后同页重试", null, "warning");
          persistNurtureSearchState(sessionStorage, value, arg2);
          await randomDelay?.(2800, 4500, arg1, "养号空搜重试");
          return {
            didWork: true,
            skipped: true,
            reason: "empty_search_retry"
          };
        }
        if (value2 <= NURTURE_SEARCH_EMPTY_RETRY_BEFORE_ADVANCE && !arg2.searchEmptyReloaded) {
          arg2.searchEmptyReloaded = true;
          reportTraceLog?.("🔍 养号：「" + (clipTraceText?.(result, 24) || result) + "」仍无结果，刷新搜索页一次", null, "warning");
          arg2.searchNavKeyword = result;
          arg2.searchNavAt = Date.now();
          try {
            prepareSearchPageReload?.(arg1, result, "养号空搜自愈刷新");
          } catch (error) {}
          persistNurtureSearchState(sessionStorage, value, arg2);
          window.location.href = buildDouyinSearchUrl(result);
          return {
            didWork: true,
            navigated: true
          };
        }
        reportTraceLog?.("🔍 养号：关键词「" + (clipTraceText?.(result, 24) || result) + "」多次无可用视频，切换下一词", null, "warning");
        markNurtureSearchKeywordExhausted(arg2, result);
        advanceNurtureSearchKeyword(arg2);
        persistNurtureSearchState(sessionStorage, value, arg2);
        await randomDelay?.(2000, 3500, arg1, "养号切换搜索词");
        return {
          didWork: true,
          skipped: true,
          reason: "empty_search"
        };
      }
      arg2.searchEmptyStreak = 0;
      delete arg2.searchEmptyReloaded;
      if (arg2.searchExhaustedKeywords?.[result]) {
        delete arg2.searchExhaustedKeywords[result];
      }
      reportTraceLog?.("✅ 养号：「" + (clipTraceText?.(result, 24) || result) + "」已收集 " + arg2.searchQueue.length + " 条，开始完播");
    }
  } else {
    try {
      window._searchVideoUrls = arg2.searchQueue.slice();
    } catch (error) {}
  }
  let result2 = String(arg2.pendingSearchOpenUrl || "").trim();
  let result3 = Math.max(0, Number(arg2.searchQueueIndex) || 0);
  if (!result2) {
    if (result3 >= arg2.searchQueue.length) {
      advanceNurtureSearchKeyword(arg2);
      persistNurtureSearchState(sessionStorage, value, arg2);
      return {
        didWork: true,
        skipped: true,
        reason: "queue_done"
      };
    }
    result2 = arg2.searchQueue[result3];
    arg2.pendingSearchOpenUrl = result2;
    arg2.pendingSearchHardNavTried = false;
    persistNurtureSearchState(sessionStorage, value, arg2);
  } else {
    result3 = Math.max(0, Number(arg2.pendingSearchOpenIndex ?? arg2.searchQueueIndex) || 0);
  }
  arg2.pendingSearchOpenIndex = result3;
  reportCurrentAction?.("养号：完播搜索视频 " + (result3 + 1) + "/" + arg2.searchQueue.length + "（" + result + "）…");
  reportTraceLog?.("📺 养号：打开搜索结果 " + (result3 + 1) + "/" + arg2.searchQueue.length + "「" + (clipTraceText?.(result, 20) || result) + "」");
  const result4 = await openNurtureSearchVideo(arg1, result2, arg2, options);
  persistNurtureSearchState(sessionStorage, value, arg2);
  if (result4 === "navigating") {
    return {
      didWork: true,
      navigated: true
    };
  }
  if (result4 !== "ready") {
    reportTraceLog?.("养号：搜索视频打开失败，跳过本条", null, "warning");
    delete arg2.pendingSearchOpenUrl;
    delete arg2.pendingSearchOpenIndex;
    delete arg2.pendingSearchHardNavTried;
    try {
      clearSearchPendingOpenUrl?.();
    } catch (error) {}
    arg2.searchQueueIndex = result3 + 1;
    if (arg2.searchQueueIndex >= arg2.searchQueue.length) {
      advanceNurtureSearchKeyword(arg2);
    }
    persistNurtureSearchState(sessionStorage, value, arg2);
    return {
      didWork: true,
      skipped: true,
      reason: "open_failed"
    };
  }
  if (typeof awaitSecurityChallengeIfPresent === "function") {
    await awaitSecurityChallengeIfPresent(arg1);
  }
  const result5 = await nurtureWatchCurrentVideo(arg1, arg2, {
    forceComplete: true,
    fromSearch: true
  });
  delete arg2.pendingSearchOpenUrl;
  delete arg2.pendingSearchOpenIndex;
  delete arg2.pendingSearchHardNavTried;
  try {
    clearSearchPendingOpenUrl?.();
  } catch (error) {}
  arg2.searchQueueIndex = result3 + 1;
  if (typeof closeAllModals === "function") {
    try {
      await closeAllModals(arg1);
    } catch (error) {}
  } else {
    try {
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        keyCode: 27,
        bubbles: true
      }));
    } catch (error) {}
  }
  await randomDelay?.(1200, 2200, arg1, "搜索完播后回列表");
  if (arg2.searchQueueIndex >= arg2.searchQueue.length) {
    advanceNurtureSearchKeyword(arg2);
  }
  persistNurtureSearchState(sessionStorage, value, arg2);
  return {
    didWork: true,
    watched: !result5?.skipped,
    skipped: !!result5?.skipped
  };
}
module.exports = {
  NURTURE_SEARCH_COLLECT_LIMIT: NURTURE_SEARCH_COLLECT_LIMIT,
  runNurtureKeywordSearchWatchRound: runNurtureKeywordSearchWatchRound,
  openNurtureSearchVideo: openNurtureSearchVideo,
  pickNurtureSearchKeyword: pickNurtureSearchKeyword,
  advanceNurtureSearchKeyword: advanceNurtureSearchKeyword,
  isOnKeywordSearchPage: isOnKeywordSearchPage,
  isOnAnyDouyinSearchPage: isOnAnyDouyinSearchPage,
  shouldReuseCurrentSearchPage: shouldReuseCurrentSearchPage,
  extractSearchKeywordFromHref: extractSearchKeywordFromHref,
  markNurtureSearchKeywordExhausted: markNurtureSearchKeywordExhausted
};
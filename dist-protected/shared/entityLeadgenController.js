const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createEntityLeadgenController(options = {}) {
  const {
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: specificVideoBareJingxuanConfirmMs,
    aggressiveCommentListScroll: aggressiveCommentListScroll,
    applySearchFilters: applySearchFilters,
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    captureCurrentVideoMetadata: captureCurrentVideoMetadata,
    captureFeedVideoShareUrl: captureFeedVideoShareUrl,
    checkAndClickOneClickLogin: checkAndClickOneClickLogin,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    collectDouyinSearchResultCards: collectDouyinSearchResultCards,
    describeSpecificVideoSkipReason: describeSpecificVideoSkipReason,
    detectPageSecurityChallenge: detectPageSecurityChallenge,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureLeadgenScrapeApiBridge: ensureLeadgenScrapeApiBridge,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    getRuntimeApiHooks: getRuntimeApiHooks,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    evaluateSpecificVideoOpenProgress: evaluateSpecificVideoOpenProgress,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserIdFromUrl: extractUserIdFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findAwemeIdForCard: findAwemeIdForCard,
    findCommentPanelRoot: findCommentPanelRoot,
    findDouyinSearchCardContentId: findDouyinSearchCardContentId,
    findSearchCardAuthorNickname: findSearchCardAuthorNickname,
    findSearchCardAuthorProfileUrl: findSearchCardAuthorProfileUrl,
    findSearchCardVideoUrl: findSearchCardVideoUrl,
    getApplySearchFiltersModule: getApplySearchFiltersModule,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getCommentsTotalCount: getCommentsTotalCount,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getDouyinSearchCardRoot: getDouyinSearchCardRoot,
    getExtendedReadyBudgetMs: getExtendedReadyBudgetMs,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getScrapeNoNewDataTolerance: getScrapeNoNewDataTolerance,
    getSearchFilterSessionModule: getSearchFilterSessionModule,
    getVideoAuthorInfo: getVideoAuthorInfo,
    getVideoSearchCollectionEngineModule: getVideoSearchCollectionEngineModule,
    getVideoSearchScrapePolicyModule: getVideoSearchScrapePolicyModule,
    getVideoTitle: getVideoTitle,
    hasFeedLiveEnterHint: hasFeedLiveEnterHint,
    ipcRenderer: ipcRenderer,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isDouyinFeedLiveStream: isDouyinFeedLiveStream,
    isDouyinFeedPlaying: isDouyinFeedPlaying,
    isDouyinLiveStreamTitle: isDouyinLiveStreamTitle,
    isDouyinSearchPageContentLoading: isDouyinSearchPageContentLoading,
    isDouyinSpecificVideoUnavailable: isDouyinSpecificVideoUnavailable,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    listLeadgenScrapeAwemes: listLeadgenScrapeAwemes,
    clearLeadgenScrapeAwemeCache: clearLeadgenScrapeAwemeCache,
    loadClassifyLiveRoomAvailability: loadClassifyLiveRoomAvailability,
    lockFeedLeadVideoUrl: lockFeedLeadVideoUrl,
    moveToNextVideo: moveToNextVideo,
    normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    normalizeUrl: normalizeUrl,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    parseDouyinCommentNode: parseDouyinCommentNode,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    pickLeadVideoUrl: pickLeadVideoUrl,
    pruneStaleCommentDom: pruneStaleCommentDom,
    queryCommentItemNodes: queryCommentItemNodes,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    scrollCommentList: scrollCommentList,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    skipDouyinFeedLiveStream: skipDouyinFeedLiveStream,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    syncSpecificVideoPauseWatcher: syncSpecificVideoPauseWatcher,
    waitAndCaptureCurrentVideoMetadata: waitAndCaptureCurrentVideoMetadata,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitLeadgenScrapeAwemeAuthor: waitLeadgenScrapeAwemeAuthor,
    webFrame: webFrame,
    preloadDir: preloadDir,
    state: state
  } = options;
  if (!state) {
    throw new TypeError("createEntityLeadgenController requires a runtime state bridge");
  }
  let num = 0;
  const map = new Map();
  let flag = false;
  let flag2 = false;
  let num2 = 0;
  let local = null;
  let obj = {
    taskId: "",
    accountId: "",
    accountName: "",
    generation: null
  };
  function fn() {
    try {
      const value = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: true
      }) : null;
      return value || document.body || document;
    } catch (error) {
      return document;
    }
  }
  function fn2(text = "", options = {}) {
    const flag = !!options.allowFeed;
    const result = String(window.location.href || "");
    const local = extractSpecificVideoId(text) || extractVideoIdFromHref(text) || "";
    const local2 = result.includes("/search/") && !result.includes("modal_id=") && !result.includes("/video/") && !result.includes("/note/");
    let local3 = null;
    let local4 = null;
    try {
      local3 = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) : null;
    } catch (error) {}
    if (flag) {
      try {
        local4 = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
          includeFeed: true
        }) : null;
      } catch (error) {}
    }
    const local5 = !!local3 && !!isVisibleElement(local3);
    const local6 = !!local4 && !!isVisibleElement(local4);
    if (local2 && !local5) {
      return false;
    }
    let local7 = null;
    try {
      local7 = typeof getDouyinFeedScope === "function" ? getDouyinFeedScope() : null;
    } catch (error) {}
    const local8 = !!local7 && (!isVisibleElement || !!isVisibleElement(local7));
    const value = typeof isViewingDouyinVideoPage === "function" ? isViewingDouyinVideoPage(result) : /\/(?:video|note)\//.test(result) || /modal_id=/.test(result);
    if (!value && !local5 && (!flag || !local8 && !local6)) {
      return false;
    }
    const value2 = local5 ? local3 : flag && local6 ? local4 : local7 || document;
    let text2 = "";
    try {
      const value = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(typeof normalizeUrl === "function" ? normalizeUrl(result) : result, value2) : "";
      text2 = extractSpecificVideoId(value) || extractVideoIdFromHref(value) || extractSpecificVideoId(result) || extractVideoIdFromHref(result) || "";
      if (!text2 && flag && typeof state.lockedLeadVideoUrl === "string" && state.lockedLeadVideoUrl) {
        text2 = extractSpecificVideoId(state.lockedLeadVideoUrl) || extractVideoIdFromHref(state.lockedLeadVideoUrl) || "";
      }
    } catch (error) {
      text2 = extractSpecificVideoId(result) || extractVideoIdFromHref(result) || "";
    }
    if (local && text2 && String(local) !== String(text2)) {
      return false;
    }
    const result2 = Array.from(value2.querySelectorAll?.("video, img, canvas") || []).some(arg1 => isVisibleElement(arg1));
    let flag2 = false;
    try {
      flag2 = typeof getVideoTitle === "function" && getVideoTitle() !== "未知视频";
    } catch (error) {}
    if (/\/search\//i.test(result) || /[?&]modal_id=/i.test(result)) {
      return !!local5 && (!!result2 || !!flag2 || !!text2);
    }
    if (flag && !local5) {
      return !!result2 || !!flag2 || !!text2 || !!local8 || !!local6;
    }
    return !!result2 || !!flag2 || !!local5;
  }
  async function fn3(arg1, arg2, text = "", num2 = 10000) {
    const result = String(text || "").trim();
    fn4({
      taskId: arg2,
      message: "正在确认是否已进入指定视频…",
      level: "info"
    });
    if (typeof waitForVideoDetailReadyAndPause === "function") {
      try {
        const result2 = await waitForVideoDetailReadyAndPause("ENTITY_LEADGEN", result, num2);
        if (arg1 !== num) {
          return {
            ready: false,
            cancelled: true
          };
        }
        if (result2 && fn2(result)) {
          fn5("线索采集：确认进入视频后锁定暂停");
          return {
            ready: true
          };
        }
      } catch (error) {
        if (String(error?.message || error) === "TASK_ABORTED" || arg1 !== num) {
          return {
            ready: false,
            cancelled: true
          };
        }
      }
    }
    const result2 = Date.now();
    while (Date.now() - result2 < Math.min(4000, num2)) {
      if (arg1 !== num) {
        return {
          ready: false,
          cancelled: true
        };
      }
      pauseVisibleDouyinVideos(fn(), "线索采集：等待进入视频期间锁定暂停");
      if (fn2(result)) {
        fn5("线索采集：确认进入视频后锁定暂停");
        return {
          ready: true
        };
      }
      if (!(await fn6(350 + Math.random() * 200, arg1))) {
        return {
          ready: false,
          cancelled: true
        };
      }
    }
    return {
      ready: false,
      cancelled: false
    };
  }
  async function fn7(arg1, arg2, text = "", num2 = 20000) {
    const result = String(text || "").trim();
    try {
      ensureSpecificVideoApiHook();
    } catch (error) {}
    const result2 = Date.now();
    let num3 = 0;
    let num4 = 0;
    let value = -1;
    const value2 = Number(specificVideoBareJingxuanConfirmMs) > 0 ? Number(specificVideoBareJingxuanConfirmMs) : 15000;
    const result3 = Math.max(8000, Number(num2) || 20000);
    fn4({
      taskId: arg2,
      message: "正在检测视频是否有效…",
      level: "info"
    });
    while (arg1 === num && Date.now() - result2 < result3) {
      try {
        pauseVisibleDouyinVideos(fn(), "线索采集：等待视频有效性确认期间暂停");
      } catch (error) {}
      if (fn2(result)) {
        fn5("线索采集：确认进入视频后锁定暂停");
        return {
          status: "ready",
          cancelled: false
        };
      }
      let text = "waiting";
      try {
        if (typeof evaluateSpecificVideoOpenProgress === "function") {
          text = evaluateSpecificVideoOpenProgress(result);
        }
      } catch (error) {
        text = "waiting";
      }
      if (text === "ready") {
        fn5("线索采集：确认进入视频后锁定暂停");
        return {
          status: "ready",
          cancelled: false
        };
      }
      if (text === "unavailable") {
        num3 += 1;
        if (num3 >= 3) {
          return {
            status: "unavailable",
            reason: "unavailable",
            cancelled: false
          };
        }
      } else {
        num3 = 0;
      }
      if (text === "loading") {
        num4 = 0;
        const result = Math.floor((Date.now() - result2) / 1000);
        if (result !== value && (result === 0 || result % 5 === 0)) {
          value = result;
          fn4({
            taskId: arg2,
            message: "视频加载中，耐心等待… (" + result + "s/" + Math.floor(result3 / 1000) + "s)",
            level: "info"
          });
        }
        if (!(await fn6(500 + Math.random() * 300, arg1))) {
          return {
            status: "cancelled",
            cancelled: true
          };
        }
        continue;
      }
      if (text === "bare_jingxuan") {
        num4 += 1;
        if (num4 >= 3 && Date.now() - result2 >= value2) {
          return {
            status: "unavailable",
            reason: "bare_jingxuan",
            cancelled: false
          };
        }
      } else {
        num4 = 0;
      }
      if (!(await fn6(400 + Math.random() * 250, arg1))) {
        return {
          status: "cancelled",
          cancelled: true
        };
      }
    }
    if (arg1 !== num) {
      return {
        status: "cancelled",
        cancelled: true
      };
    }
    if (fn2(result)) {
      fn5("线索采集：确认进入视频后锁定暂停");
      return {
        status: "ready",
        cancelled: false
      };
    }
    let text2 = "waiting";
    try {
      if (typeof evaluateSpecificVideoOpenProgress === "function") {
        text2 = evaluateSpecificVideoOpenProgress(result);
      }
    } catch (error) {}
    if (text2 === "ready") {
      fn5("线索采集：确认进入视频后锁定暂停");
      return {
        status: "ready",
        cancelled: false
      };
    }
    if (text2 === "unavailable" || text2 === "bare_jingxuan") {
      return {
        status: "unavailable",
        reason: text2,
        cancelled: false
      };
    }
    try {
      if (typeof isDouyinSpecificVideoUnavailable === "function" && isDouyinSpecificVideoUnavailable()) {
        return {
          status: "unavailable",
          reason: "unavailable",
          cancelled: false
        };
      }
    } catch (error) {}
    return {
      status: "timeout",
      cancelled: false
    };
  }
  function fn8() {
    if (local?.stop) {
      try {
        local.stop();
      } catch (error) {}
    }
    local = null;
  }
  function fn9(text = "") {
    const local = extractSpecificVideoId(text) || extractVideoIdFromHref(text) || String(text || "").trim();
    if (window.__radarEntityFeedSwipeLockInstalled) {
      window.__radarEntityExpectedVideoId = String(local || window.__radarEntityExpectedVideoId || "");
      return;
    }
    const local2 = arg1 => {
      try {
        if (!arg1) {
          return false;
        }
        const result = fn();
        const value = typeof resolveCommentPanelRoot === "function" ? resolveCommentPanelRoot(result) : null;
        if (value && (value === arg1 || value.contains?.(arg1))) {
          return true;
        }
        const value2 = typeof arg1.closest === "function" ? arg1.closest("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"comment-input\"], [class*=\"CommentList\"], [class*=\"comment-list\"], [class*=\"comment-main\"], [class*=\"CommentPanel\"], [class*=\"comment-panel\"], [class*=\"comment-content\"]") : null;
        return !!value2;
      } catch (error) {
        return false;
      }
    };
    const local3 = arg1 => {
      if (local2(arg1.target)) {
        try {
          arg1.stopPropagation();
        } catch (error) {}
        return;
      }
      try {
        arg1.preventDefault();
        arg1.stopPropagation();
      } catch (error) {}
    };
    const local4 = arg1 => {
      if (!/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End)$/.test(arg1.key || "")) {
        return;
      }
      if (local2(arg1.target)) {
        try {
          arg1.stopPropagation();
        } catch (error) {}
        return;
      }
      try {
        arg1.preventDefault();
        arg1.stopPropagation();
      } catch (error) {}
    };
    const local5 = arg1 => {
      if (local2(arg1.target)) {
        return;
      }
      try {
        arg1.preventDefault();
        arg1.stopPropagation();
      } catch (error) {}
    };
    document.addEventListener("wheel", local3, {
      capture: true,
      passive: false
    });
    window.addEventListener("wheel", local3, {
      capture: true,
      passive: false
    });
    document.addEventListener("keydown", local4, true);
    window.addEventListener("keydown", local4, true);
    document.addEventListener("touchmove", local5, {
      capture: true,
      passive: false
    });
    window.__radarEntityFeedSwipeLockInstalled = true;
    window.__radarEntityExpectedVideoId = String(local || "");
    window.__radarEntityFeedSwipeLockCleanup = () => {
      document.removeEventListener("wheel", local3, {
        capture: true
      });
      window.removeEventListener("wheel", local3, {
        capture: true
      });
      document.removeEventListener("keydown", local4, true);
      window.removeEventListener("keydown", local4, true);
      document.removeEventListener("touchmove", local5, {
        capture: true
      });
      window.__radarEntityFeedSwipeLockInstalled = false;
      window.__radarEntityExpectedVideoId = "";
      window.__radarEntityFeedSwipeLockCleanup = null;
    };
  }
  function fn10() {
    try {
      if (typeof window.__radarEntityFeedSwipeLockCleanup === "function") {
        window.__radarEntityFeedSwipeLockCleanup();
      }
    } catch (error) {}
    window.__radarEntityFeedSwipeLockInstalled = false;
    window.__radarEntityExpectedVideoId = "";
  }
  function fn11(text = "") {
    const result = String(window.location.href || "");
    const result2 = fn();
    try {
      const value = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(typeof normalizeUrl === "function" ? normalizeUrl(result) : result, result2) : "";
      return extractSpecificVideoId(value) || extractVideoIdFromHref(value) || extractSpecificVideoId(result) || extractVideoIdFromHref(result) || extractSpecificVideoId(text) || "";
    } catch (error) {
      return extractSpecificVideoId(result) || extractVideoIdFromHref(result) || "";
    }
  }
  function hasVideoDrifted(text = "") {
    const local = extractSpecificVideoId(text) || extractVideoIdFromHref(text) || String(window.__radarEntityExpectedVideoId || "").trim();
    if (!local) {
      return false;
    }
    const result = fn11(text);
    if (!result) {
      return false;
    }
    return String(result) !== String(local);
  }
  function fn5(text = "线索采集：进入视频后立即暂停", options = {}) {
    const value = options.scope && isVisibleElement?.(options.scope) ? options.scope : null;
    const local2 = value || fn();
    pauseVisibleDouyinVideos(local2, text);
    if (local && !local.stopped && options.reuseActive !== false && local.scope === local2) {
      return local;
    }
    fn8();
    let text2 = "";
    try {
      text2 = (typeof pickLeadVideoUrl === "function" ? pickLeadVideoUrl(state.lockedLeadVideoUrl || "", local2) : "") || (typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(typeof normalizeUrl === "function" ? normalizeUrl(window.location.href) : window.location.href, local2) : "");
    } catch (error) {}
    const obj = {
      scope: local2,
      isFeedPlayback: options.isFeedPlayback === true,
      leadVideoUrl: text2 || window.location.href || "",
      videoTitle: typeof getVideoTitle === "function" ? getVideoTitle(local2) || "" : ""
    };
    const obj2 = {
      pauseOnly: true
    };
    if (Number(options.intervalMs) > 0) {
      obj2.intervalMs = Number(options.intervalMs);
    }
    local = startCurrentVideoPauseGuard(obj, options.loopId || "ENTITY_LEADGEN", obj2);
    try {
      local.scope = local2;
    } catch (error) {}
    return local;
  }
  function fn4(options = {}) {
    try {
      ipcRenderer.send("entity-leadgen-collect-progress", {
        taskId: obj.taskId,
        accountId: obj.accountId,
        accountName: obj.accountName,
        generation: obj.generation,
        skipIngest: !!obj.skipIngest,
        ...options
      });
    } catch (error) {}
  }
  function fn13(options = {}) {
    obj = {
      ...obj,
      taskId: options.taskId || obj.taskId || "",
      accountId: options.accountId || obj.accountId || "",
      accountName: options.accountName || options.nickname || obj.accountName || "",
      generation: options.generation != null ? Number(options.generation) : obj.generation,
      skipIngest: options.skipIngest != null ? !!options.skipIngest : obj.skipIngest !== false,
      runningSource: String(options.runningSource || obj.runningSource || "").trim()
    };
    const result = String(options.runningSource || obj.runningSource || "").trim();
    if (result) {
      state.currentRunningSource = result;
      syncSpecificVideoPauseWatcher();
    }
    try {
      const result = String(obj.accountId || "").trim();
      if (result) {
        window._radar_account_id = result;
        sessionStorage.setItem("radar_account_id", result);
      }
    } catch (error) {}
  }
  function buildEntityUserKey(arg1, text = "", text2 = "", text3 = "") {
    const local = normalizeDouyinAuthorProfileUrl(arg1) || String(arg1 || "").trim();
    if (local) {
      const result = extractUserIdFromUrl(local);
      if (result) {
        return result;
      }
      return local;
    }
    const result = String(text2 || "").trim();
    if (/^\d{5,24}$/.test(result) && !/^0+$/.test(result) && result !== "111111") {
      return "uid:" + result;
    }
    const result2 = String(text3 || "").trim();
    if (result2.length >= 15 && /^[A-Za-z0-9_\-]+$/.test(result2)) {
      return "webcast:" + result2;
    }
    const result3 = String(text || "").trim();
    if (result3) {
      return "name:" + result3;
    } else {
      return "";
    }
  }
  function fn15(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "https://www.douyin.com/search";
    }
    return "https://www.douyin.com/search/" + encodeURIComponent(result) + "?type=user";
  }
  function fn16() {
    map.clear();
    num2 = 0;
  }
  function fn17(arg1) {
    if (arg1 == null || arg1 === "") {
      return null;
    }
    if (typeof arg1 === "number" && Number.isFinite(arg1) && arg1 >= 0) {
      return Math.floor(arg1);
    }
    const result = String(arg1).trim().replace(/,/g, "");
    if (!result) {
      return null;
    }
    const result2 = result.match(/^(\d+(?:\.\d+)?)\s*万/);
    if (result2) {
      return Math.floor(Number(result2[1]) * 10000);
    }
    const result3 = result.match(/^(\d+(?:\.\d+)?)\s*亿/);
    if (result3) {
      return Math.floor(Number(result3[1]) * 100000000);
    }
    const result4 = Number(result.replace(/[^\d.]/g, ""));
    if (Number.isFinite(result4) && result4 >= 0) {
      return Math.floor(result4);
    } else {
      return null;
    }
  }
  function fn18(arg1) {
    switch (String(arg1 || "0")) {
      case "1":
        return {
          min: 0,
          max: 1000,
          label: "1000以下"
        };
      case "2":
        return {
          min: 1000,
          max: 10000,
          label: "1000-1w"
        };
      case "3":
        return {
          min: 10000,
          max: 100000,
          label: "1w-10w"
        };
      case "4":
        return {
          min: 100000,
          max: 1000000,
          label: "10w-100w"
        };
      case "5":
        return {
          min: 1000000,
          max: null,
          label: "100w以上"
        };
      default:
        return null;
    }
  }
  function fn19(arg1, arg2) {
    const result = fn18(arg2);
    if (!result) {
      return true;
    }
    const result2 = fn17(arg1);
    if (result2 == null) {
      return false;
    }
    if (result2 < result.min) {
      return false;
    }
    if (result.max != null && result2 >= result.max) {
      return false;
    }
    return true;
  }
  function fn20(arg1) {
    const result = fn17(arg1);
    if (result == null) {
      return "未知";
    }
    if (result >= 100000000) {
      return (result / 100000000).toFixed(1).replace(/\.0$/, "") + "亿";
    }
    if (result >= 10000) {
      return (result / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    }
    return String(result);
  }
  function fn21(...restArgs) {
    const map = new Map();
    restArgs.flat().filter(Boolean).forEach(arg1 => {
      const result = String(arg1.messageId || arg1.msgId || "").trim();
      const value = result ? "id:" + result : [arg1.method || arg1.type || "", arg1.occurredAt || arg1.observedAt || "", arg1.content || arg1.text || ""].join("|");
      if (!map.has(value)) {
        map.set(value, arg1);
      }
    });
    return [...map.values()].sort((arg1, arg2) => Number(arg1.occurredAt || arg1.observedAt || 0) - Number(arg2.occurredAt || arg2.observedAt || 0)).slice(-500);
  }
  const result = Object.freeze(["enter", "like", "follow", "comment", "interaction", "gift"]);
  function fn22(arg1) {
    if (!Array.isArray(arg1)) {
      return [...result];
    }
    const set = new Set(result);
    return [...new Set(arg1.filter(arg1 => set.has(arg1)))];
  }
  function fn23(options = {}) {
    const result2 = String(options.category || options.eventCategory || "").trim();
    if (result.includes(result2)) {
      return result2;
    }
    const result3 = String(options.method || options.type || "").trim();
    const result4 = String(options.content || options.text || "").trim();
    if (/ChatMessage/i.test(result3)) {
      return "comment";
    }
    if (/MemberMessage/i.test(result3)) {
      return "enter";
    }
    if (/LikeMessage/i.test(result3)) {
      return "like";
    }
    if (/GiftMessage/i.test(result3)) {
      return "gift";
    }
    if (/SocialMessage/i.test(result3)) {
      if (/关注|follow/i.test((options.action || "") + " " + result4)) {
        return "follow";
      } else {
        return "interaction";
      }
    }
    if (/进入直播间|进房|来了/.test(result4)) {
      return "enter";
    }
    if (/点赞|赞了直播间/.test(result4)) {
      return "like";
    }
    if (/关注了主播|关注主播/.test(result4)) {
      return "follow";
    }
    if (/评论|弹幕|发言/.test(result4)) {
      return "comment";
    }
    if (/送礼|礼物|赠送/.test(result4)) {
      return "gift";
    }
    return "interaction";
  }
  function fn24(options = {}, text = "any") {
    const result = String(options.nickname || options.nickName || options.nick_name || "").trim().replace(/^@+/, "");
    const result2 = String(options.secUid || options.sec_uid || "").trim();
    const result3 = String(options.uid || options.id_str || options.idStr || options.user_id || "").trim();
    const value = /^\d{5,24}$/.test(result3) && !/^0+$/.test(result3) && result3 !== "111111" ? result3 : "";
    const result4 = String(options.webcastUid || options.webcast_uid || options.webcast_uid_str || "").trim();
    const value2 = !value && !result2 && result4.length >= 15 && result4 !== "111111" && /^[A-Za-z0-9_\-]+$/.test(result4) ? result4 : "";
    let result5 = normalizeDouyinAuthorProfileUrl(options.userUrl || options.profileUrl || "");
    if (!result2 && value2) {
      result5 = "";
    }
    if (!result5 && result2 && !/^(self|login)$/i.test(result2)) {
      result5 = "https://www.douyin.com/user/" + result2;
    }
    const local = String(options.userKey || "").trim() || buildEntityUserKey(result5, result, value, value2);
    if (!local || !result || !result5 && !value && !value2) {
      return false;
    }
    if (/^(关注|粉丝|获赞|私信|回关|已关注|相互关注|互相关注)$/.test(result)) {
      return false;
    }
    const local2 = options.followStatus ?? options.follow_status ?? options.follower_status;
    const result6 = fn17(options.followerCount ?? options.follower_count ?? options.fansCount ?? options.fans_count);
    const result7 = map.get(local);
    const value3 = Array.isArray(options.liveEvents) ? options.liveEvents : options.liveEvent ? [options.liveEvent] : [];
    const result8 = fn21(result7?.liveEvents || [], value3);
    const local3 = result8[result8.length - 1] || options.liveEvent || result7?.liveEvent || null;
    map.set(local, {
      uid: value || result7?.uid || "",
      secUid: result2 || result7?.secUid || "",
      webcastUid: value2 || result7?.webcastUid || "",
      privacyMasked: options.privacyMasked ?? result7?.privacyMasked ?? result.includes("*"),
      identityType: options.identityType || result7?.identityType || (result2 ? "profile" : value2 ? "webcast" : "numeric"),
      profileAvailable: options.profileAvailable ?? result7?.profileAvailable ?? !!result2,
      profileUnavailable: options.profileUnavailable ?? result7?.profileUnavailable ?? !result2,
      profileUnavailableReason: String(options.profileUnavailableReason || result7?.profileUnavailableReason || (!result2 && value2 ? "主播设置不支持查看他人资料" : "")),
      nickname: result,
      userUrl: result5,
      userKey: local,
      sourceHint: text === "live" ? "live" : text || result7?.sourceHint || "any",
      followStatus: local2 ?? result7?.followStatus,
      followerCount: result6 ?? result7?.followerCount ?? null,
      content: String(options.content || local3?.content || result7?.content || "").trim(),
      timeText: String(options.timeText || options.time || result7?.timeText || "").trim(),
      time: String(options.time || options.timeText || result7?.time || result7?.timeText || "").trim(),
      ipLocation: String(options.ipLocation || options.location || result7?.ipLocation || "").trim(),
      location: String(options.location || options.ipLocation || result7?.location || result7?.ipLocation || "").trim(),
      liveEvent: local3,
      liveEvents: result8,
      messageId: String(options.messageId || local3?.messageId || result7?.messageId || "").trim(),
      eventTimestamp: Number(options.eventTimestamp || local3?.occurredAt || result7?.eventTimestamp || 0) || 0
    });
    return true;
  }
  function fn25(options = {}) {
    const value = Array.isArray(options.users) ? options.users : [];
    if (!value.length) {
      return;
    }
    num2 += 1;
    const result = String(options.hint || "any");
    let num = 0;
    value.forEach(arg1 => {
      if (fn24(arg1, result)) {
        num += 1;
      }
    });
    if (num > 0) {
      console.log("[EntityLeadgen][API] hit=" + num2 + " hint=" + result + " +" + num + " total=" + map.size);
    }
  }
  function ensureEntityApiBridge() {
    if (window.__radar_entity_api_bridge) {
      return;
    }
    window.__radar_entity_api_bridge = true;
    const local = arg1 => {
      try {
        fn25(arg1?.detail || {});
      } catch (error) {
        console.warn("[EntityLeadgen][API] bridge error:", error?.message || error);
      }
    };
    document.addEventListener("__radar_entity_api", local);
    document.addEventListener("__radar_entity_live", local);
  }
  function ensureEntityApiHook() {
    ensureEntityApiBridge();
    let text = "";
    try {
      const result = (() => {
        try {
          return require("path");
        } catch (error) {
          return null;
        }
      })();
      const list = ["./entityLeadgenApiHook", "./entityLeadgenApiHook.js"];
      if (result && typeof preloadDir === "string") {
        list.push(result.join(preloadDir, "shared", "entityLeadgenApiHook.js"), result.join(preloadDir, "..", "shared", "entityLeadgenApiHook.js"));
      }
      for (const item of list) {
        try {
          const result = require(item);
          if (typeof result?.getEntityLeadgenApiHookInstaller === "function") {
            const value = typeof getRuntimeApiHooks === "function" ? getRuntimeApiHooks() : null;
            text = result.getEntityLeadgenApiHookInstaller(value);
            break;
          }
        } catch (error) {}
      }
    } catch (error) {}
    if (!text) {
      console.warn("[EntityLeadgen][API] installer module missing");
      flag = false;
      return false;
    }
    try {
      const result = document.createElement("script");
      result.textContent = sanitizeInlinePageScript(text);
      const local = document.documentElement || document.head || document.body;
      if (!local) {
        flag = false;
        return false;
      }
      local.appendChild(result);
      result.remove();
      flag = true;
    } catch (error) {
      console.warn("[EntityLeadgen][API] inject failed:", error?.message || error);
      flag = false;
    }
    return flag;
  }
  function ensureEntityLiveHook() {
    ensureEntityApiBridge();
    let text = "";
    try {
      const result = (() => {
        try {
          return require("path");
        } catch (error) {
          return null;
        }
      })();
      const list = ["./entityLeadgenLiveHook", "./entityLeadgenLiveHook.js"];
      if (result && typeof preloadDir === "string") {
        list.push(result.join(preloadDir, "shared", "entityLeadgenLiveHook.js"), result.join(preloadDir, "..", "shared", "entityLeadgenLiveHook.js"));
      }
      for (const item of list) {
        try {
          const result = require(item);
          if (typeof result?.getEntityLeadgenLiveHookInstaller === "function") {
            text = result.getEntityLeadgenLiveHookInstaller();
            break;
          }
        } catch (error) {}
      }
    } catch (error) {}
    if (!text) {
      flag2 = false;
      return false;
    }
    try {
      if (webFrame && typeof webFrame.executeJavaScript === "function") {
        webFrame.executeJavaScript(text, true).catch(() => {});
        flag2 = true;
        return true;
      }
      const result = document.createElement("script");
      result.textContent = sanitizeInlinePageScript(text);
      const local = document.documentElement || document.head || document.body;
      if (!local) {
        flag2 = false;
        return false;
      }
      local.appendChild(result);
      result.remove();
      flag2 = true;
    } catch (error) {
      console.warn("[EntityLeadgen][Live] inject failed:", error?.message || error);
      flag2 = false;
    }
    return flag2;
  }
  function collectEntityUsersFromApiBuffer(arg1, {
    userFanCount = "0",
    liveEventTypes = null
  } = {}) {
    const list = [];
    let num = 0;
    const list2 = [];
    const set = new Set(fn22(liveEventTypes));
    for (const item of map.values()) {
      const local = item.sourceHint || "any";
      if (arg1 === "blogger") {
        if (local === "user" || local === "mutual" || local === "following" || local === "live" || local === "comment") {
          continue;
        }
      } else if (arg1 === "user") {
        if (local === "blogger" || local === "mutual" || local === "following" || local === "live" || local === "comment") {
          continue;
        }
      } else if (arg1 === "mutual") {
        if (local === "live" || local === "comment") {
          continue;
        }
        const result = Number(item.followStatus);
        if (result === 2 || result === 4) {} else if ((local === "mutual" || local === "relation") && window.__radar_entity_mutual_filter_active) {} else {
          continue;
        }
      } else if (arg1 === "following") {
        if (local === "live" || local === "comment" || local === "user" || local === "blogger") {
          continue;
        }
        if (local !== "mutual" && local !== "relation" && local !== "any" && !window.__radar_entity_following_list_active) {
          continue;
        }
      } else if (arg1 === "live" && local !== "live") {
        continue;
      } else if (arg1 === "comment") {
        if (local !== "comment") {
          continue;
        }
      } else if (arg1 === "video") {
        continue;
      }
      if (arg1 === "live" && !item.liveEvent && !item.liveEvents?.length) {
        continue;
      }
      const value = Array.isArray(item.liveEvents) ? item.liveEvents : item.liveEvent ? [item.liveEvent] : [];
      const value2 = arg1 === "live" ? value.filter(arg1 => set.has(fn23(arg1))) : value;
      if (arg1 === "live" && value2.length === 0) {
        continue;
      }
      const local2 = value2[value2.length - 1] || null;
      if (arg1 === "user" && !fn19(item.followerCount, userFanCount)) {
        num += 1;
        if (list2.length < 3) {
          list2.push("@" + item.nickname + " " + fn20(item.followerCount) + "粉");
        }
        continue;
      }
      list.push({
        uid: item.uid || "",
        secUid: item.secUid || "",
        webcastUid: item.webcastUid || "",
        privacyMasked: !!item.privacyMasked,
        identityType: item.identityType || "",
        profileAvailable: !!item.profileAvailable,
        profileUnavailable: !!item.profileUnavailable,
        profileUnavailableReason: item.profileUnavailableReason || "",
        nickname: item.nickname,
        userUrl: item.userUrl,
        userKey: item.userKey,
        followerCount: item.followerCount,
        content: local2?.content || item.content || "",
        timeText: item.timeText || item.time || "",
        time: item.time || item.timeText || "",
        ipLocation: item.ipLocation || item.location || "",
        location: item.location || item.ipLocation || "",
        liveEvent: local2 || item.liveEvent || null,
        liveEvents: value2,
        messageId: local2?.messageId || item.messageId || "",
        eventTimestamp: local2?.occurredAt || item.eventTimestamp || 0,
        sourceType: arg1 === "live" ? "live" : arg1,
        entrySource: arg1 === "live" ? "entity_live" : undefined,
        entryLabel: arg1 === "live" ? "线索采集：直播间" : undefined
      });
    }
    if (num > 0) {
      const result = fn18(userFanCount);
      console.log("[EntityLeadgen][FansFilter] 丢弃 " + num + " 个不符「" + (result?.label || userFanCount) + "」" + (list2.length ? "，样例：" + list2.join("、") : ""));
    }
    return list;
  }
  async function fn6(arg1, arg2) {
    const value = Date.now() + Math.max(0, arg1);
    while (Date.now() < value) {
      if (arg2 !== num) {
        return false;
      }
      await sleep(Math.min(300, value - Date.now()));
    }
    return arg2 === num;
  }
  function fn30(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return null;
    }
    const result2 = Array.from(document.querySelectorAll("span, div, a, button, [role=\"tab\"]"));
    return result2.find(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result2 = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      if (result2 !== result) {
        return false;
      }
      const local = arg1.getBoundingClientRect?.();
      return local && local.top < 220 && local.width > 20 && local.height > 16;
    }) || null;
  }
  async function fn31(arg1) {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("type") === "user") {
        return true;
      }
    } catch (error) {}
    const result = fn30("用户");
    if (!result) {
      return false;
    }
    await simulateHumanClick(result, null);
    if (!(await fn6(1800 + Math.random() * 1200, arg1))) {
      return false;
    }
    try {
      return new URL(window.location.href).searchParams.get("type") === "user" || !!fn30("用户");
    } catch (error) {
      return !!fn30("用户");
    }
  }
  const result2 = Object.freeze({
    "0": "不限",
    "1": "1000以下",
    "2": "1000-1w",
    "3": "1w-10w",
    "4": "10w-100w",
    "5": "100w以上"
  });
  const result3 = Object.freeze({
    "0": "不限",
    "1": "普通用户",
    "2": "企业认证",
    "3": "个人认证"
  });
  function fn32() {
    let flag = false;
    let flag2 = false;
    for (const item of document.querySelectorAll("span, div, label, p, button")) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const result = String(item.innerText || item.textContent || "").replace(/\s+/g, "").trim();
      if (result === "粉丝数量") {
        flag = true;
      }
      if (result === "用户类型") {
        flag2 = true;
      }
      if (flag || flag2) {
        return true;
      }
    }
    return false;
  }
  function fn33() {
    const result = Array.from(document.querySelectorAll("span")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      return result.startsWith("筛选") && result.length <= 8;
    });
    if (!result.length) {
      return null;
    }
    result.sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      return result.top - result2.top || result2.left - result.left;
    });
    return result[0];
  }
  async function fn34(arg1, arg2) {
    if (fn32()) {
      return true;
    }
    const result = fn33();
    if (!result) {
      fn4({
        taskId: arg2,
        message: "未找到「筛选」按钮，将改用接口筛选参数",
        level: "warning"
      });
      return false;
    }
    const local = result.getBoundingClientRect?.() || {};
    fn4({
      taskId: arg2,
      message: "正在点击「筛选」按钮展开面板：tag=" + result.tagName + ", class=" + result.className + ", text=" + (result.innerText || result.textContent || "").slice(0, 30) + ", rect=[top:" + Math.round(local.top) + ",left:" + Math.round(local.left) + ",w:" + Math.round(local.width) + ",h:" + Math.round(local.height) + "]",
      level: "info"
    });
    await simulateHumanClick(result, null);
    try {
      if (typeof result.click === "function") {
        result.click();
      }
    } catch (error) {}
    for (let num = 0; num < 8; num += 1) {
      if (!(await fn6(350 + Math.random() * 250, arg1))) {
        return false;
      }
      if (fn32()) {
        await fn6(1500 + Math.random() * 1000, arg1);
        return true;
      }
    }
    return false;
  }
  function fn35(arg1, arg2) {
    const local = {
      "0": "",
      "1": "0_1k",
      "2": "1k_1w",
      "3": "1w_10w",
      "4": "10w_100w",
      "5": "100w_"
    }[String(arg1 || "0")] || "";
    const local2 = {
      "0": "",
      "1": "common_user",
      "2": "enterprise_user",
      "3": "personal_user"
    }[String(arg2 || "0")] || "";
    const obj = {
      douyin_user_fans: local,
      douyin_user_type: local2
    };
    try {
      if (local || local2) {
        sessionStorage.setItem("__radar_entity_user_search_filters", JSON.stringify(obj));
        window.__radar_entity_user_search_filters = obj;
      } else {
        sessionStorage.removeItem("__radar_entity_user_search_filters");
        delete window.__radar_entity_user_search_filters;
      }
    } catch (error) {}
    return obj;
  }
  async function fn36(arg1, arg2) {
    const result = Array.from(document.querySelectorAll("button, span, div, [role=\"button\"]")).find(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      if (result !== "搜索") {
        return false;
      }
      const local = arg1.getBoundingClientRect?.();
      return !!local && !!(local.top >= 0) && !!(local.top < 160) && !!(local.width >= 28) && !!(local.height >= 20);
    });
    if (!result) {
      fn4({
        taskId: arg2,
        message: "未找到「搜索」按钮，等待滚动触发筛选接口…",
        level: "info"
      });
      try {
        window.scrollBy(0, 240 + Math.random() * 120);
      } catch (error) {}
      return fn6(2200 + Math.random() * 800, arg1);
    }
    fn4({
      taskId: arg2,
      message: "面板未展开，已写入筛选参数并重新搜索…",
      level: "info"
    });
    await simulateHumanClick(result, null);
    try {
      if (typeof result.click === "function") {
        result.click();
      }
    } catch (error) {}
    return fn6(2800 + Math.random() * 1200, arg1);
  }
  function fn37(arg1, arg2) {
    const result = String(arg1 || "").trim();
    const result2 = String(arg2 || "").trim();
    if (!result || !result2) {
      return null;
    }
    let value = -1;
    let value2 = -1;
    if (result === "粉丝数量") {
      value = 0;
      const obj = {
        "0": "不限",
        "1": "1000以下",
        "2": "1000-1w",
        "3": "1w-10w",
        "4": "10w-100w",
        "5": "100w以上"
      };
      const result = Object.entries(obj).find(([arg1, arg12]) => arg12 === result2);
      if (result) {
        value2 = parseInt(result[0]);
      }
    } else if (result === "用户类型") {
      value = 1;
      const obj = {
        "0": "不限",
        "1": "普通用户",
        "2": "企业认证",
        "3": "个人认证"
      };
      const result = Object.entries(obj).find(([arg1, arg12]) => arg12 === result2);
      if (result) {
        value2 = parseInt(result[0]);
      }
    }
    if (value !== -1 && value2 !== -1) {
      const value3 = "[data-index1=\"" + value + "\"][data-index2=\"" + value2 + "\"], [data-index*=\"" + value + "-" + value2 + "\"]";
      const result = document.querySelector(value3);
      if (result && isVisibleElement(result)) {
        return result;
      }
    }
    const local = (arg1, arg2) => {
      const local = arg1 => String(arg1 || "").replace(/\s+/g, "").replace(/w/g, "万").trim();
      return local(arg1) === local(arg2);
    };
    const result3 = Array.from(document.querySelectorAll("span, div, button, [role=\"button\"]")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = String(arg1.innerText || arg1.textContent || "");
      return local(result, result2);
    });
    if (!result3.length) {
      return null;
    }
    const result4 = Array.from(document.querySelectorAll("span, div, label, p")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result2 = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
      return result2 === result;
    });
    if (result4.length > 0) {
      const value = result4[0];
      const result = value.getBoundingClientRect();
      result3.sort((arg1, arg2) => {
        const result2 = arg1.getBoundingClientRect();
        const result3 = arg2.getBoundingClientRect();
        const result4 = Math.abs(result2.top - result.top);
        const result5 = Math.abs(result3.top - result.top);
        return result4 - result5;
      });
    }
    return result3[0];
  }
  async function fn38(arg1, arg2, options = {}) {
    const result = String(options.searchSort || "0");
    const result2 = String(options.searchPublishTime || "0");
    const result3 = String(options.searchDuration || "0");
    const result4 = String(options.searchScope || "0");
    const result5 = String(options.searchFormat || "0");
    const result6 = String(options.searchKeyword || "").trim();
    if (result === "0" && result2 === "0" && result3 === "0" && result4 === "0" && result5 === "0") {
      return {
        applied: true,
        skipped: true
      };
    }
    const list = [];
    if (result !== "0") {
      list.push(["综合排序", "最新发布", "最多点赞"][Number(result)] || "排序" + result);
    }
    if (result2 !== "0") {
      list.push(["不限", "一天内", "一周内", "半年内"][Number(result2)] || "时间" + result2);
    }
    if (result3 !== "0") {
      list.push(["不限", "1分钟以下", "1-5分钟", "5分钟以上"][Number(result3)] || "时长" + result3);
    }
    if (result4 !== "0") {
      list.push(["不限", "关注的人", "最近看过", "还未看过"][Number(result4)] || "范围" + result4);
    }
    if (result5 !== "0") {
      list.push(["不限", "视频", "图文"][Number(result5)] || "形式" + result5);
    }
    fn4({
      taskId: arg2,
      message: "正在应用官方搜索筛选：" + (list.join(" · ") || "已配置"),
      level: "info"
    });
    state.currentTask = Object.assign({}, state.currentTask && typeof state.currentTask === "object" ? state.currentTask : {}, {
      searchSort: result,
      searchPublishTime: result2,
      searchDuration: result3,
      searchScope: result4,
      searchFormat: result5,
      taskMode: "entity_leadgen",
      accountId: obj?.accountId || options.accountId || ""
    });
    try {
      window.currentTask = state.currentTask;
      const result = String(state.currentTask.accountId || "").trim();
      if (result) {
        window._radar_account_id = result;
        sessionStorage.setItem("radar_account_id", result);
      }
    } catch (error) {}
    const value = "ENTITY_FILTER_" + String(arg2 || "x") + "_" + (result6 || "kw");
    try {
      const result = getSearchFilterSessionModule();
      result?.clearAppliedSearchFilterSession?.(sessionStorage, value, result6);
    } catch (error) {}
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
    } catch (error) {}
    const result7 = (() => {
      try {
        const result = getSearchFilterSessionModule();
        if (typeof result?.buildAppliedFiltersBaseKey === "function") {
          return result.buildAppliedFiltersBaseKey(value, result6);
        }
      } catch (error) {}
      return "applied_filters_" + value + "_" + result6;
    })();
    const local = (arg1, arg2) => String(arg1 || "0") === "0" || sessionStorage.getItem(result7 + "_" + arg2) === "true";
    const local2 = () => {
      const result7 = getApplySearchFiltersModule();
      if (typeof result7?.areOfficialSearchFilterItemLocksReady === "function") {
        return result7.areOfficialSearchFilterItemLocksReady(sessionStorage, {
          sort: result,
          time: result2,
          duration: result3,
          scope: result4,
          format: result5
        }, result6, value, getSearchFilterSessionModule());
      }
      return local(result, "sort") && local(result2, "time") && local(result3, "duration") && local(result4, "scope") && local(result5, "format");
    };
    const local3 = () => {
      const local = arg1 => {
        const result = String(arg1?.innerText || "").trim();
        return result === "筛选" || result === "筛选关闭" || result === "筛选开启" || /^筛选[·•.]?\d*$/.test(result);
      };
      const result = Array.from(document.querySelectorAll("span")).filter(local);
      return result.find(arg1 => isVisibleElement(arg1)) || result[0] || null;
    };
    const local4 = () => {
      if (isVisibleElement(document.querySelector("[data-index1=\"0\"]"))) {
        return true;
      }
      if (isVisibleElement(document.querySelector("[data-index1][data-index2]"))) {
        return true;
      }
      const list = ["一周内", "一天内", "最多点赞", "最新发布", "1-5分钟"];
      return list.some(arg1 => Array.from(document.querySelectorAll("span, div, button")).some(arg12 => isVisibleElement(arg12) && String(arg12.innerText || "").trim() === arg1));
    };
    const local5 = async (num2 = 20000) => {
      const result = Date.now();
      let num3 = 0;
      while (Date.now() - result < num2) {
        if (arg1 !== num) {
          return false;
        }
        await fn39(arg1);
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
        } catch (error) {
          try {
            window.scrollTo(0, 0);
          } catch (error) {}
        }
        if (local4() || local3()) {
          return true;
        }
        if (Date.now() - num3 > 3000) {
          num3 = Date.now();
          fn4({
            taskId: arg2,
            message: "等待搜索页「筛选」按钮出现… (" + Math.floor((Date.now() - result) / 1000) + "s)",
            level: "info"
          });
        }
        if (!(await fn6(500 + Math.random() * 300, arg1))) {
          return false;
        }
      }
      return !!local4() || !!local3();
    };
    const result8 = await local5(22000);
    if (arg1 !== num) {
      return {
        cancelled: true
      };
    }
    if (!result8) {
      fn4({
        taskId: arg2,
        message: "未找到搜索页「筛选」按钮，官方筛选跳过（请确认已登录且页面为综合搜索结果）",
        level: "warning"
      });
      return {
        applied: false,
        skipped: false,
        reason: "no_filter_ui"
      };
    }
    const num2 = 16;
    for (let num3 = 0; num3 < num2; num3 += 1) {
      if (arg1 !== num) {
        return {
          cancelled: true
        };
      }
      if (local2()) {
        sessionStorage.setItem(result7, "true");
        fn4({
          taskId: arg2,
          message: "官方搜索筛选已应用，等待结果刷新…",
          level: "info"
        });
        if (!(await fn6(3500 + Math.random() * 1500, arg1))) {
          return {
            cancelled: true
          };
        }
        return {
          applied: true,
          skipped: false
        };
      }
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      } catch (error) {
        try {
          window.scrollTo(0, 0);
        } catch (error) {}
      }
      await fn39(arg1);
      if (sessionStorage.getItem(result7) === "true" && !local2()) {
        try {
          sessionStorage.removeItem(result7);
        } catch (error) {}
        try {
          sessionStorage.removeItem(result7 + "_attempts");
        } catch (error) {}
        fn4({
          taskId: arg2,
          message: "官方筛选尚未点齐（第 " + (num3 + 1) + "/" + num2 + " 轮），继续尝试…",
          level: "info"
        });
      }
      try {
        await applySearchFilters(result6, value);
      } catch (error) {
        if (String(error?.message || error) === "TASK_ABORTED") {
          return {
            cancelled: true
          };
        }
        console.warn("[线索采集][官方筛选] applySearchFilters 异常", error);
      }
      if (local2()) {
        sessionStorage.setItem(result7, "true");
        fn4({
          taskId: arg2,
          message: "官方搜索筛选已应用，等待结果刷新…",
          level: "info"
        });
        if (!(await fn6(3500 + Math.random() * 1500, arg1))) {
          return {
            cancelled: true
          };
        }
        return {
          applied: true,
          skipped: false
        };
      }
      if (num3 === 0 || num3 % 3 === 2) {
        const list = [];
        if (!local(result, "sort")) {
          list.push("排序");
        }
        if (!local(result2, "time")) {
          list.push("发布时间");
        }
        if (!local(result3, "duration")) {
          list.push("时长");
        }
        if (!local(result4, "scope")) {
          list.push("范围");
        }
        if (!local(result5, "format")) {
          list.push("形式");
        }
        fn4({
          taskId: arg2,
          message: "官方筛选未点齐：" + (list.join("、") || "未知") + "（第 " + (num3 + 1) + "/" + num2 + " 轮）",
          level: "info"
        });
      }
      if (!(await fn6(1200 + Math.random() * 600, arg1))) {
        return {
          cancelled: true
        };
      }
    }
    fn4({
      taskId: arg2,
      message: "官方搜索筛选未能确认生效，将继续采集当前结果（请检查页面是否出现「筛选」）",
      level: "warning"
    });
    return {
      applied: false,
      skipped: false,
      reason: "not_confirmed"
    };
  }
  async function fn40(arg1, arg2, {
    userFanCount = "0",
    userTypeFilter = "0",
    accountId = ""
  } = {}) {
    const result = String(userFanCount || "0");
    const result4 = String(userTypeFilter || "0");
    if (result === "0" && result4 === "0") {
      fn35("0", "0");
      return false;
    }
    const local = result2[result] || "不限";
    const local2 = result3[result4] || "不限";
    const value = result !== "0";
    const value2 = result4 !== "0";
    fn35(result, result4);
    fn4({
      taskId: arg2,
      message: "需应用筛选：粉丝 " + local + " · 类型 " + local2 + "（先点筛选再选选项）",
      level: "info"
    });
    const result5 = await fn34(arg1, arg2);
    if (!result5) {
      fn4({
        taskId: arg2,
        message: "筛选面板未展开，改用接口筛选参数",
        level: "warning"
      });
      fn16();
      fn4({
        taskId: arg2,
        accountId: accountId || "",
        sourceType: "user",
        resetNetworkCapture: true
      });
      await fn36(arg1, arg2);
      return true;
    }
    let flag = false;
    try {
      const result = Array.from(document.querySelectorAll("[data-index1], [data-index2], [data-index]"));
      console.log("[Built-in-Debug] [筛选选项排查] 页面共有 " + result.length + " 个 data-index 元素");
      result.forEach((arg1, arg2) => {
        console.log("[Built-in-Debug] [筛选选项排查] #" + arg2 + ": tag=" + arg1.tagName + ", class=" + arg1.className + ", text=" + (arg1.innerText || arg1.textContent || "").trim() + ", d1=" + arg1.getAttribute("data-index1") + ", d2=" + arg1.getAttribute("data-index2") + ", d=" + arg1.getAttribute("data-index"));
      });
    } catch (error) {}
    if (value) {
      const result = fn37("粉丝数量", local);
      if (result) {
        const local2 = result.getBoundingClientRect?.() || {};
        fn4({
          taskId: arg2,
          message: "选择粉丝数量：" + local + " | tag=" + result.tagName + ", class=" + result.className + ", rect=[top:" + Math.round(local2.top) + ",left:" + Math.round(local2.left) + ",w:" + Math.round(local2.width) + ",h:" + Math.round(local2.height) + "]",
          level: "info"
        });
        await simulateHumanClick(result, null);
        try {
          if (typeof result.click === "function") {
            result.click();
          }
        } catch (error) {}
        flag = true;
        if (!(await fn6(1600 + Math.random() * 900, arg1))) {
          return flag;
        }
      } else {
        fn4({
          taskId: arg2,
          message: "未找到粉丝数量选项「" + local + "」",
          level: "warning"
        });
      }
    }
    if (value2) {
      if (!fn32()) {
        const result = await fn34(arg1, arg2);
        if (!result) {
          fn4({
            taskId: arg2,
            message: "用户类型面板未展开，已保留接口筛选参数",
            level: "warning"
          });
          if (flag) {
            fn16();
            fn4({
              taskId: arg2,
              accountId: accountId || "",
              sourceType: "user",
              resetNetworkCapture: true
            });
          }
          await fn36(arg1, arg2);
          return true;
        }
      }
      const result = fn37("用户类型", local2);
      if (result) {
        const local = result.getBoundingClientRect?.() || {};
        fn4({
          taskId: arg2,
          message: "选择用户类型：" + local2 + " | tag=" + result.tagName + ", class=" + result.className + ", rect=[top:" + Math.round(local.top) + ",left:" + Math.round(local.left) + ",w:" + Math.round(local.width) + ",h:" + Math.round(local.height) + "]",
          level: "info"
        });
        await simulateHumanClick(result, null);
        try {
          if (typeof result.click === "function") {
            result.click();
          }
        } catch (error) {}
        flag = true;
        if (!(await fn6(1600 + Math.random() * 900, arg1))) {
          return flag;
        }
      } else {
        fn4({
          taskId: arg2,
          message: "未找到用户类型选项「" + local2 + "」",
          level: "warning"
        });
      }
    }
    if (!flag) {
      fn16();
      fn4({
        taskId: arg2,
        accountId: accountId || "",
        sourceType: "user",
        resetNetworkCapture: true,
        message: "未点到筛选项，改用接口筛选参数重新搜索",
        level: "warning"
      });
      await fn36(arg1, arg2);
      return true;
    }
    fn16();
    fn4({
      taskId: arg2,
      accountId: accountId || "",
      sourceType: "user",
      resetNetworkCapture: true,
      message: "已应用用户筛选，等待结果刷新…",
      level: "info"
    });
    if (!(await fn6(2800 + Math.random() * 1200, arg1))) {
      return flag;
    }
    await fn41(arg1, arg2, {
      sourceType: "user",
      maxWaitMs: 20000
    });
    return flag;
  }
  function fn42(arg1) {
    const result = String(arg1 || "").replace(/\s+/g, "");
    const result2 = result.match(/(\d+(?:\.\d+)?[万亿]?)粉丝|粉丝(\d+(?:\.\d+)?[万亿]?)/);
    if (!result2) {
      return null;
    }
    return fn17(result2[1] || result2[2]);
  }
  function fn43(options = {}) {
    const result = String(options.userFanCount || window.__radar_entity_user_fan_count || "0");
    const list = [];
    const set = new Set();
    for (const item of collectEntityUsersFromApiBuffer("user", {
      userFanCount: result
    })) {
      if (set.has(item.userKey)) {
        continue;
      }
      set.add(item.userKey);
      list.push(item);
    }
    const result2 = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const item of result2) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const local = item.href || item.getAttribute?.("href") || "";
      if (!local || local.includes("/user/self")) {
        continue;
      }
      const result2 = normalizeDouyinAuthorProfileUrl(local);
      if (!result2) {
        continue;
      }
      const result3 = buildEntityUserKey(result2);
      if (!result3 || set.has(result3)) {
        continue;
      }
      const local2 = item.closest("div, li, article, section") || item.parentElement;
      const result4 = String(local2?.innerText || item.innerText || "");
      let result5 = String(item.innerText || item.textContent || item.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (!result5 || result5.length > 40 || /^(关注|粉丝|获赞|私信|回关|已关注|相互关注)$/.test(result5)) {
        const result = result4.split(/\n+/).map(arg1 => arg1.trim()).find(arg1 => arg1 && arg1.length <= 40 && !/粉丝|关注|获赞|抖音号|私信/.test(arg1));
        result5 = result ? result.replace(/^@+/, "") : "";
      }
      if (!result5) {
        continue;
      }
      const result6 = fn42(result4);
      if (!fn19(result6, result)) {
        continue;
      }
      set.add(result3);
      list.push({
        nickname: result5,
        userUrl: result2,
        userKey: result3,
        followerCount: result6
      });
    }
    return list;
  }
  function fn44(arg1) {
    const result = String(arg1 || "").match(/@([^\s@/#]{1,40})/);
    if (result) {
      return result[1].trim();
    } else {
      return "";
    }
  }
  let local2 = null;
  function getEntityCommentScraperModule() {
    if (!local2) {
      try {
        local2 = require("./entityCommentScraper");
      } catch (error) {
        local2 = null;
      }
    }
    return local2;
  }
  function fn46(arg1 = document) {
    try {
      const value = typeof getVideoAuthorInfo === "function" ? getVideoAuthorInfo(arg1 || document, window.location.href) : null;
      const result = String(value?.nickname || "").trim().replace(/^@+/, "");
      const result2 = normalizeDouyinAuthorProfileUrl(value?.profileUrl || "");
      const value2 = result2 ? typeof extractUserIdFromUrl === "function" ? extractUserIdFromUrl(result2) : "" : "";
      const result3 = getEntityCommentScraperModule();
      if (result3?.normalizeAuthorFilter) {
        return result3.normalizeAuthorFilter({
          nickname: result,
          userUrl: result2,
          secUid: String(value2 || "").trim(),
          userKey: value2 || (result2 ? buildEntityUserKey(result2, result) : "")
        });
      }
      return {
        nickname: result,
        userUrl: result2,
        secUid: String(value2 || "").trim(),
        userKey: value2 || (result2 ? buildEntityUserKey(result2, result) : "")
      };
    } catch (error) {
      return {
        nickname: "",
        userUrl: "",
        secUid: "",
        userKey: ""
      };
    }
  }
  let local3 = null;
  function fn47() {
    if (!local3) {
      try {
        local3 = require("./entityCommentFilters");
      } catch (error) {
        local3 = null;
      }
    }
    return local3;
  }
  function buildEntityCommentScraperDeps() {
    const result = fn47();
    return {
      collectEntityUsersFromApiBuffer: collectEntityUsersFromApiBuffer,
      normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
      buildEntityUserKey: buildEntityUserKey,
      findCommentPanelRoot: typeof findCommentPanelRoot === "function" ? findCommentPanelRoot : null,
      resolveCommentPanelRoot: typeof resolveCommentPanelRoot === "function" ? resolveCommentPanelRoot : null,
      queryCommentItemNodes: typeof queryCommentItemNodes === "function" ? queryCommentItemNodes : null,
      parseDouyinCommentNode: typeof parseDouyinCommentNode === "function" ? parseDouyinCommentNode : null,
      getCommentsTotalCount: typeof getCommentsTotalCount === "function" ? getCommentsTotalCount : null,
      getCommentV2String: typeof getCommentV2String === "function" ? getCommentV2String : null,
      isCommentPanelContentLoading: typeof isCommentPanelContentLoading === "function" ? isCommentPanelContentLoading : null,
      clickCommentPanelLoadingPlaceholder: typeof clickCommentPanelLoadingPlaceholder === "function" ? clickCommentPanelLoadingPlaceholder : null,
      evaluateEntityCommentFilters: result?.evaluateEntityCommentFilters || null,
      normalizeEntityCommentFilters: result?.normalizeEntityCommentFilters || null,
      canonicalizeDouyinVideoUrl: (() => {
        try {
          const result = getProcessedVideoKeyModule();
          return result?.canonicalizeDouyinVideoUrl || result?.normalizeProcessedVideoKey || null;
        } catch (error) {
          return null;
        }
      })(),
      countApiUsers: () => {
        try {
          return (collectEntityUsersFromApiBuffer("comment") || []).length;
        } catch (error) {
          return 0;
        }
      }
    };
  }
  function fn49(arg1, arg2, text = "info", options = {}) {
    fn4({
      taskId: arg1,
      message: arg2,
      level: text,
      accountId: window._radar_account_id || "",
      accountName: window._radar_account_name || "",
      ...options
    });
  }
  function fn50(arg1 = null, arg2 = null) {
    const result = getEntityCommentScraperModule();
    if (!result?.collectEntityCommentsFromPage) {
      return [];
    }
    return result.collectEntityCommentsFromPage(buildEntityCommentScraperDeps(), arg1 || fn46(), arg2);
  }
  async function fn51(arg1, arg2) {
    const value = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
      includeFeed: false
    }) || resolveDouyinVideoDetailModal({
      includeFeed: true
    }) : null;
    const local2 = value || document.body;
    const text = "ENTITY_LEADGEN";
    const result = buildEntityCommentScraperDeps();
    pauseVisibleDouyinVideos(local2, "线索采集：打开评论区前锁定暂停");
    if (!local || local.stopped) {
      fn5("线索采集：打开评论区前锁定暂停");
    }
    const result2 = getEntityCommentScraperModule();
    let obj = {
      opened: false
    };
    if (result2?.openEntityCommentPanel) {
      obj = await result2.openEntityCommentPanel({
        ...result,
        token: arg1,
        taskId: arg2,
        scope: local2,
        loopId: text,
        getCommentTabPrefix: typeof getCommentTabPrefix === "function" ? getCommentTabPrefix : () => "评论",
        isVisibleElement: isVisibleElement,
        simulateHumanClick: typeof simulateHumanClick === "function" ? simulateHumanClick : null,
        waitFn: async arg12 => fn6(arg12, arg1),
        isCancelled: () => arg1 !== num,
        logFn: (arg1, arg22, text = "info") => fn49(arg1 || arg2, arg22, text)
      });
      if (obj?.cancelled) {
        return obj;
      }
    }
    let flag = false;
    if (typeof ensureCommentPanelOpen === "function" && arg1 === num) {
      try {
        flag = !!(await ensureCommentPanelOpen(local2, text));
      } catch (error) {
        fn49(arg2, "获客开评复用异常：" + (error?.message || error), "warning");
      }
    }
    const value2 = typeof result2?.inspectEntityCommentPanel === "function" ? result2.inspectEntityCommentPanel({
      ...result,
      isVisibleElement: isVisibleElement
    }) : obj?.inspection || {
      opened: !!obj?.opened || !!flag
    };
    return {
      ...obj,
      ...value2,
      viaLeadgen: flag,
      opened: !!value2.opened,
      empty: !!value2.empty,
      slow: !value2.opened && !value2.empty,
      badgeOnly: !!value2.badgeOnly
    };
  }
  async function fn52({
    token: token,
    taskId: taskId,
    searchKeyword = "",
    seenKeys: seenKeys,
    collectedUsers: collectedUsers,
    maxCollect: maxCollect,
    authorFilter = null,
    initialPageTotal = null,
    commentFilters = null,
    progressLabel = "视频评论区潜客",
    targetVideoUrl = "",
    sourceVideoTitle = "",
    videoTitle = ""
  }) {
    const result = getEntityCommentScraperModule();
    if (!result?.collectEntityCommentUsersByScrolling) {
      return {
        exhausted: true,
        empty: true
      };
    }
    return result.collectEntityCommentUsersByScrolling(buildEntityCommentScraperDeps(), {
      token: token,
      taskId: taskId,
      searchKeyword: searchKeyword,
      seenKeys: seenKeys,
      collectedUsers: collectedUsers,
      maxCollect: maxCollect,
      authorFilter: authorFilter || fn46(),
      initialPageTotal: initialPageTotal,
      commentFilters: commentFilters,
      progressLabel: progressLabel,
      targetVideoUrl: String(targetVideoUrl || searchKeyword || "").trim(),
      sourceVideoTitle: String(sourceVideoTitle || videoTitle || "").trim(),
      videoTitle: String(videoTitle || sourceVideoTitle || "").trim(),
      loopId: "ENTITY_LEADGEN",
      waitFn: async arg1 => fn6(arg1, token),
      isCancelled: () => token !== num,
      installFeedSwipeLock: fn9,
      removeFeedSwipeLock: fn10,
      hasVideoDrifted: hasVideoDrifted,
      resolveCommentScope: () => {
        try {
          const value = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
            includeFeed: true
          }) : null;
          if (typeof resolveCommentPanelRoot === "function") {
            return resolveCommentPanelRoot(value || document.body) || value || document.body;
          }
          return value || document.body;
        } catch (error) {
          return document.body;
        }
      },
      scrollCommentList: typeof scrollCommentList === "function" ? scrollCommentList : null,
      aggressiveCommentListScroll: typeof aggressiveCommentListScroll === "function" ? aggressiveCommentListScroll : null,
      pruneStaleCommentDom: typeof pruneStaleCommentDom === "function" ? pruneStaleCommentDom : null,
      getCommentEndHintText: typeof getCommentEndHintText === "function" ? getCommentEndHintText : null,
      getCommentScrollMetrics: typeof getCommentScrollMetrics === "function" ? getCommentScrollMetrics : null,
      getScrapeNoNewDataTolerance: typeof getScrapeNoNewDataTolerance === "function" ? getScrapeNoNewDataTolerance : null,
      simulateHumanClick: typeof simulateHumanClick === "function" ? simulateHumanClick : null,
      logFn: (arg1, arg2, text = "info", options = {}) => fn49(arg1 || taskId, arg2, text, options)
    });
  }
  function fn53(arg1) {
    const result = String(arg1 || "").replace(/\s+/g, " ").trim();
    if (!result) {
      return true;
    }
    if (/^(相关搜索|大家都在搜|猜你想搜|热门搜索|搜索发现|筛选|综合|视频|用户|直播|图文)$/i.test(result)) {
      return true;
    }
    if (/相关搜索|大家都在搜|猜你想搜/.test(result) && result.length <= 24) {
      return true;
    }
    if (typeof isDouyinLiveStreamTitle === "function" && isDouyinLiveStreamTitle(result)) {
      return true;
    }
    if (/的抖音直播间|抖音直播间(?:直播)?$|正在直播|进入直播间|直播中/.test(result)) {
      return true;
    }
    if (/^(图片|图文|笔记|封面|视频|播放|查看详情|点击查看|抖音|关注|点赞|评论|收藏|分享|更多)$/i.test(result)) {
      return true;
    }
    if (/^https?:\/\//i.test(result) || /^\d{1,2}:\d{2}$/.test(result)) {
      return true;
    }
    if (/^\d+(?:\.\d+)?[万wkW]?$/.test(result)) {
      return true;
    }
    return false;
  }
  function fn54(arg1) {
    if (!arg1) {
      return true;
    }
    const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    if (!result) {
      return true;
    }
    if (/相关搜索|大家都在搜|猜你想搜/.test(result)) {
      const flag = !!arg1.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], [data-e2e=\"video-desc\"], [data-e2e=\"note-desc\"], video");
      if (!flag || result.length < 80) {
        return true;
      }
    }
    if (arg1.querySelector?.("a[href*=\"/live/\"], a[href*=\"live.douyin.com\"], a[href*=\"webcast\"]")) {
      return true;
    }
    const result2 = Array.from(arg1.querySelectorAll?.("[data-e2e]") || []).slice(0, 20);
    if (result2.some(arg1 => {
      const result = String(arg1.getAttribute?.("data-e2e") || "").toLowerCase();
      return /(^|[-_])(live|webcast)([-_]|$)/.test(result);
    })) {
      return true;
    }
    if (/进入直播间|点击进入直播|观看直播|正在直播/.test(result)) {
      return true;
    }
    if (typeof isDouyinLiveStreamTitle === "function") {
      const result2 = result.split(/\s{2,}|\n+/).map(arg1 => arg1.trim()).filter(Boolean).slice(0, 8);
      if (result2.some(arg1 => isDouyinLiveStreamTitle(arg1))) {
        return true;
      }
    }
    if (/的抖音直播间|抖音直播间(?:直播)?/.test(result)) {
      return true;
    }
    return false;
  }
  function fn55(arg1) {
    if (!arg1) {
      return "";
    }
    const list = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", "[data-e2e*=\"video-title\"]", "[data-e2e*=\"search-card-desc\"]", "[data-e2e*=\"search-result-card-desc\"]", "[class*=\"video-title\"]", "[class*=\"VideoTitle\"]", "[class*=\"note-title\"]", "[class*=\"NoteTitle\"]", "[class*=\"note-desc\"]", "[class*=\"NoteDesc\"]"];
    const local = arg1 => {
      const result = String(arg1 || "").replace(/\s+/g, " ").trim().slice(0, 100);
      if (!result || result.length < 2) {
        return "";
      }
      if (fn53(result)) {
        return "";
      }
      if (/^@/.test(result)) {
        return "";
      }
      return result;
    };
    for (const item of list) {
      for (const item2 of Array.from(arg1.querySelectorAll?.(item) || [])) {
        const result = local(item2.innerText || item2.textContent || "");
        if (result) {
          return result;
        }
      }
    }
    for (const item of Array.from(arg1.querySelectorAll?.("a[title], a[aria-label], img[alt]") || []).slice(0, 12)) {
      for (const item2 of ["title", "aria-label", "alt"]) {
        const result = local(item.getAttribute?.(item2));
        if (result && result.length >= 4) {
          return result;
        }
      }
    }
    const result = String(arg1.innerText || arg1.textContent || "").split(/\n+/).map(arg1 => arg1.replace(/\s+/g, " ").trim()).filter(Boolean);
    const result2 = result.map(arg1 => local(arg1)).filter(Boolean).filter(arg1 => !/^(赞|评论|分享|关注|粉丝|收藏|播放)/.test(arg1)).sort((arg1, arg2) => arg2.length - arg1.length);
    return result2[0] || "";
  }
  function fn56() {
    const list = [];
    const set = new Set();
    const local = (arg1, text = "", arg3 = null) => {
      const result = String(arg1 || "").trim();
      if (!result || !/^\d{10,}$/.test(result)) {
        return false;
      }
      if (arg3 && fn54(arg3)) {
        return false;
      }
      const value = "video:" + result;
      if (set.has(value)) {
        return false;
      }
      let result2 = String(text || "").replace(/\s+/g, " ").trim().slice(0, 100);
      if (fn53(result2)) {
        result2 = "";
      }
      if (!result2 && arg3) {
        result2 = fn55(arg3);
      }
      if (fn53(result2)) {
        result2 = "";
      }
      if (/相关搜索|大家都在搜|的抖音直播间|抖音直播间(?:直播)?|进入直播间|正在直播/.test(String(text || ""))) {
        return false;
      }
      if (!result2) {
        result2 = "抖音视频作品";
      }
      const value2 = "https://www.douyin.com/video/" + result;
      set.add(value);
      let text2 = "";
      let text3 = "";
      let text4 = "";
      try {
        const result = String(arg3?.innerText || arg3?.textContent || "").replace(/\s+/g, " ").trim();
        const result2 = result.match(/(刚刚|刚才|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|个?月|年)前)/);
        if (result2) {
          text4 = String(result2[1] || "").replace(/\s+/g, "");
        }
      } catch (error) {}
      if (arg3 && typeof fn57 === "function") {
        try {
          const result = fn57(arg3);
          if (result?.secUid) {
            text3 = "https://www.douyin.com/user/" + result.secUid;
            text2 = String(result.nickname || "").trim().replace(/^@+/, "");
          }
        } catch (error) {}
      }
      if (!text3 && arg3) {
        const local = arg3.querySelector?.("a[href*=\"/user/\"]");
        const local2 = local?.href || local?.getAttribute?.("href") || "";
        const result = String(local2).match(/\/user\/([^/?#]+)/);
        if (result?.[1] && result[1].length > 8 && !/^(self|login)$/i.test(result[1])) {
          text3 = "https://www.douyin.com/user/" + decodeURIComponent(result[1]);
          text2 = String(local?.textContent || "").trim().replace(/^@+/, "") || text2;
        }
      }
      list.push({
        nickname: result2,
        title: result2,
        userUrl: value2,
        videoUrl: value2,
        userKey: value,
        content: value2,
        sourceType: "video",
        entrySource: "entity_video",
        entryLabel: "线索采集：视频作品链接",
        authorNickname: text2,
        authorProfileUrl: text3,
        publishTimeText: text4
      });
      return true;
    };
    const value = typeof collectDouyinSearchResultCards === "function" ? collectDouyinSearchResultCards() : [];
    for (const item of value) {
      if (fn54(item)) {
        continue;
      }
      let text = "";
      if (typeof findDouyinSearchCardContentId === "function") {
        text = findDouyinSearchCardContentId(item) || "";
      }
      if (!text && typeof findSearchCardVideoUrl === "function") {
        const result = findSearchCardVideoUrl(item);
        text = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(result) : "";
      }
      if (!text && typeof findAwemeIdForCard === "function") {
        text = findAwemeIdForCard(item) || "";
      }
      if (!text) {
        const local = item.closest?.("[id^=\"waterfall_item_\"]") || item;
        const result = String(local?.id || "");
        const result2 = result.match(/waterfall[_-]?item[_-]?(\d{10,})/i);
        if (result2?.[1]) {
          text = result2[1];
        }
      }
      if (text) {
        local(text, fn55(item), item);
      }
    }
    Array.from(document.querySelectorAll("[id^=\"waterfall_item_\"]")).forEach(arg1 => {
      if (!isVisibleElement(arg1)) {
        return;
      }
      if (fn54(arg1)) {
        return;
      }
      const result = String(arg1.id || "").match(/waterfall[_-]?item[_-]?(\d{10,})/i);
      if (result?.[1]) {
        local(result[1], fn55(arg1), arg1);
      }
    });
    return list;
  }
  function fn58() {
    const map = new Map();
    const local = arg1 => {
      if (!arg1?.userKey) {
        return;
      }
      const result = map.get(arg1.userKey);
      if (!result) {
        map.set(arg1.userKey, arg1);
        return;
      }
      const local = (arg1, arg2) => {
        const result = String(arg1 || "").trim();
        const result2 = String(arg2 || "").trim();
        return result || result2;
      };
      map.set(arg1.userKey, {
        ...result,
        ...arg1,
        title: local(result.title || result.nickname, arg1.title || arg1.nickname),
        nickname: local(result.title || result.nickname, arg1.title || arg1.nickname),
        videoUrl: local(result.videoUrl, arg1.videoUrl),
        userUrl: local(result.userUrl, arg1.userUrl),
        authorNickname: local(result.authorNickname, arg1.authorNickname),
        authorProfileUrl: local(result.authorProfileUrl, arg1.authorProfileUrl),
        publishTimeText: local(result.publishTimeText, arg1.publishTimeText),
        createTime: Number(result.createTime || arg1.createTime || 0) || Number(arg1.createTime || result.createTime || 0) || 0
      });
    };
    try {
      const result = fn56();
      for (const item of Array.isArray(result) ? result : []) {
        local(item);
      }
    } catch (error) {}
    try {
      if (typeof ensureLeadgenScrapeApiHook === "function") {
        ensureLeadgenScrapeApiHook({
          force: true
        });
      }
      const value = typeof listLeadgenScrapeAwemes === "function" ? listLeadgenScrapeAwemes() : [];
      const value2 = map.size > 0;
      for (const item of value) {
        const result = String(item?.videoId || "").trim();
        if (!/^\d{10,}$/.test(result)) {
          continue;
        }
        const value = "video:" + result;
        if (value2 && !map.has(value)) {
          continue;
        }
        const local2 = String(item.videoUrl || "").trim() || "https://www.douyin.com/video/" + result;
        const local3 = String(item.title || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
        local({
          nickname: local3,
          title: local3,
          userUrl: local2,
          videoUrl: local2,
          userKey: value,
          content: local2,
          sourceType: "video",
          entrySource: "entity_video",
          entryLabel: "线索采集：视频作品链接",
          authorNickname: String(item.authorNickname || "").trim().replace(/^@+/, ""),
          authorProfileUrl: String(item.authorUrl || "").trim(),
          createTime: Number(item.createTime || 0) || 0,
          publishTime: Number(item.createTime || 0) || 0
        });
      }
    } catch (error) {}
    return Array.from(map.values());
  }
  function fn57(arg1) {
    if (!arg1) {
      return null;
    }
    const value = typeof findSearchCardVideoUrl === "function" ? findSearchCardVideoUrl(arg1) : "";
    const value2 = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(value) : "";
    const result = [arg1.querySelector?.(".videoImage"), arg1.querySelector?.("a[href*=\"/video/\"]"), arg1.querySelector?.("a[href*=\"/note/\"]"), arg1.querySelector?.("a"), arg1.querySelector?.("img"), arg1].filter(Boolean);
    for (const item of result) {
      const result = Object.keys(item).find(arg1 => arg1.startsWith("__reactFiber$") || arg1.startsWith("__reactProps$"));
      if (!result) {
        continue;
      }
      let value = item[result];
      let num = 0;
      let local = null;
      while (value && num < 18) {
        const result = [value.pendingProps, value.memoizedProps].filter(Boolean);
        for (const item of result) {
          const result = [item.awemeInfo, item.aweme, item.data, item.logParams?.awemeInfo, item.activeAweme, item.currentAweme].filter(Boolean);
          for (const item of result) {
            const local2 = item.awemeId || item.aweme_id || item.id || item.gid || item.itemId || item.item_id;
            const local3 = item.authorInfo || item.author || item.author_info;
            const local4 = local3?.secUid || local3?.sec_uid;
            const result = String(local3?.nickname || local3?.nickName || local3?.nick_name || "").trim();
            if (!local4 || typeof local4 !== "string" || !(local4.length > 15)) {
              continue;
            }
            const obj = {
              secUid: local4,
              nickname: result
            };
            if (value2 && local2 && String(local2) === String(value2)) {
              return obj;
            }
            if (!local) {
              local = obj;
            }
          }
          const local2 = item.authorInfo || item.author || item.user;
          if (local2) {
            const local3 = local2.secUid || local2.sec_uid;
            const result = String(local2.nickname || local2.nickName || local2.nick_name || "").trim();
            if (local3 && typeof local3 === "string" && local3.length > 15) {
              const obj = {
                secUid: local3,
                nickname: result
              };
              if (!local) {
                local = obj;
              }
            }
          }
        }
        value = value.return;
        num += 1;
      }
      if (local) {
        return local;
      }
    }
    return null;
  }
  function fn59() {
    const value = window.__radar_entity_login_cleaner;
    if (value?.start) {
      value.start();
      return;
    }
    if (value === true) {
      return;
    }
    try {
      document.body?.style?.removeProperty("overflow");
      document.documentElement?.style?.removeProperty("overflow");
    } catch (error) {}
    try {
      const {
        createEntityLoginBarrierCleaner: createEntityLoginBarrierCleaner
      } = require("./entityLoginBarrierCleaner");
      const result = createEntityLoginBarrierCleaner({
        documentRef: document
      });
      window.__radar_entity_login_cleaner = result;
      result.start();
    } catch (error) {
      console.error("[Built-in-Debug] 登录遮罩清理器加载失败:", error);
    }
  }
  function fn60() {
    const value = window.__radar_entity_login_cleaner;
    if (value?.stop) {
      value.stop();
    }
  }
  async function dismissEntityLoginPopupsCore(arg1) {
    let num2 = 0;
    for (let num3 = 0; num3 < 4; num3 += 1) {
      if (typeof arg1 === "number" && arg1 !== num) {
        return num2;
      }
      try {
        document.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Escape",
          keyCode: 27,
          bubbles: true
        }));
        document.dispatchEvent(new KeyboardEvent("keyup", {
          key: "Escape",
          keyCode: 27,
          bubbles: true
        }));
      } catch (error) {}
      const result = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"login\"], [class*=\"Login\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"mask\"], [class*=\"Mask\"], [class*=\"popup\"], [class*=\"Popup\"]")).filter(arg1 => isVisibleElement(arg1));
      for (const item of result) {
        const result = String(item.innerText || item.textContent || "").replace(/\s+/g, " ");
        const result2 = /登录后即可|扫码登录|验证码登录|密码登录|打开抖音APP|登录后查看|立即登录|手机号登录/.test(result);
        if (!result2) {
          continue;
        }
        const result3 = Array.from(item.querySelectorAll("button, [role=\"button\"], [aria-label*=\"关闭\"], [aria-label*=\"close\" i], [class*=\"close\"], [class*=\"Close\"], svg")).filter(arg1 => isVisibleElement(arg1));
        let flag = false;
        for (const item of result3) {
          const result = ((item.getAttribute?.("aria-label") || "") + " " + (item.className || "") + " " + (item.innerText || "")).toLowerCase();
          const local = item.getBoundingClientRect?.() || {};
          const local2 = (local.width || 0) <= 48 && (local.height || 0) <= 48;
          if (/close|关闭|dismiss|icon/.test(result) || local2) {
            try {
              await simulateHumanClick(item, null);
              num2 += 1;
              flag = true;
              break;
            } catch (error) {}
          }
        }
        if (!flag) {
          const result = Array.from(document.querySelectorAll("div, span, button")).find(arg1 => {
            if (!isVisibleElement(arg1)) {
              return false;
            }
            const result = String(arg1.innerText || arg1.textContent || "").trim();
            return result === "×" || result === "X" || result === "关闭";
          });
          if (result) {
            try {
              await simulateHumanClick(result, null);
              num2 += 1;
            } catch (error) {}
          }
        }
      }
      if (typeof arg1 === "number") {
        if (!(await fn6(450 + Math.random() * 350, arg1))) {
          return num2;
        }
      } else {
        await sleep(450 + Math.random() * 350);
      }
      const result2 = String(document.body?.innerText || "");
      if (!/登录后即可|扫码登录|验证码登录|密码登录/.test(result2)) {
        break;
      }
    }
    return num2;
  }
  async function fn39(arg1) {
    try {
      if (detectPageSecurityChallenge()) {
        const local = obj?.taskId || "";
        if (local) {
          fn4({
            taskId: local,
            message: "检测到安全验证（滑块/验证码），请在采集窗口完成验证后继续…",
            level: "warning"
          });
        }
        await awaitSecurityChallengeIfPresent(typeof arg1 === "string" ? arg1 : "ENTITY");
        if (local) {
          fn4({
            taskId: local,
            message: "安全验证已完成，继续采集",
            level: "info"
          });
        }
      } else {
        await checkAndClickOneClickLogin();
      }
    } catch (error) {}
    return dismissEntityLoginPopupsCore(arg1);
  }
  function fn62() {
    const value = typeof collectDouyinSearchResultCards === "function" ? collectDouyinSearchResultCards().length : 0;
    const value2 = document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]").length;
    const value3 = document.querySelectorAll("a[href*=\"/user/\"]").length;
    const value4 = document.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]").length;
    const value5 = String(document.body?.innerText || "").replace(/\s+/g, "").length;
    const result = /登录后即可|扫码登录|验证码登录|密码登录/.test(String(document.body?.innerText || ""));
    return {
      cards: value,
      videoLinks: value2,
      userLinks: value3,
      commentNodes: value4,
      bodyLen: value5,
      loginGate: result,
      apiCached: map.size
    };
  }
  async function fn41(arg1, arg2, {
    sourceType = "blogger",
    maxWaitMs = 12000
  } = {}) {
    const result = Date.now();
    const value = sourceType === "comment";
    const value2 = value ? Math.min(maxWaitMs, 3000) : maxWaitMs;
    let local = value2;
    let flag = false;
    let num2 = 0;
    let num3 = 0;
    let flag2 = false;
    while (Date.now() - result < local) {
      if (arg1 !== num) {
        return false;
      }
      await fn39(arg1);
      const local2 = !value && isDouyinSearchPageContentLoading();
      if (local2) {
        flag2 = true;
      }
      const result2 = collectEntityUsersFromApiBuffer(sourceType);
      const result3 = fn62();
      const value3 = (result2.length || 0) + (result3.cards || 0) + (result3.videoLinks || 0) + (result3.userLinks || 0) + (value ? result3.commentNodes || 0 : 0);
      if (value3 > num2) {
        num2 = value3;
      }
      const local3 = result2.length > 0 || result3.cards > 0 || value && result3.commentNodes > 0 || result3.videoLinks >= 3 && !value || result3.userLinks >= 3 && !value;
      if (local3 && !local2) {
        return true;
      }
      if (!flag && !value && Date.now() - result >= value2 - 80) {
        const local3 = local2 || flag2 || num2 > 0 || result3.loginGate || document.readyState !== "complete";
        const value = local2 || flag2 ? Math.max(60000, Math.round(value2 * 3)) : Math.min(Math.round(value2 * 2), 28000);
        local = getExtendedReadyBudgetMs(value2, {
          progress: local3,
          hardCapMs: value
        });
        if (local > value2) {
          flag = true;
          fn4({
            taskId: arg2,
            message: local2 || flag2 ? "检测到「加载中」，继续等待搜索结果…" : "网络较慢，继续等待搜索结果加载…",
            level: "info"
          });
        }
      }
      if (flag && !value && (local2 || flag2) && local < 60000 && Date.now() - result >= local - 80) {
        local = 60000;
        fn4({
          taskId: arg2,
          message: "页面仍显示「加载中」，再耐心等待一会儿…",
          level: "info"
        });
      }
      if (!value && Date.now() - num3 > 3000) {
        num3 = Date.now();
        const result2 = Math.floor((Date.now() - result) / 1000);
        const result4 = Math.floor(local / 1000);
        fn4({
          taskId: arg2,
          message: local2 ? "检测到「加载中」，等待页面加载完成… (" + result2 + "s/" + result4 + "s)" : result3.loginGate ? "正在准备数据，请稍候…" : "正在加载搜索结果…",
          level: local2 || result3.loginGate ? "warning" : "info"
        });
      }
      if (!value && !local2) {
        try {
          window.scrollBy(0, 240 + Math.floor(Math.random() * 160));
        } catch (error) {}
      } else if (value) {
        pauseVisibleDouyinVideos(fn(), "线索采集：等待评论就绪期间锁定暂停");
      }
      if (!(await fn6(value ? 400 : 700 + Math.random() * 500, arg1))) {
        return false;
      }
    }
    if (!value && isDouyinSearchPageContentLoading()) {
      fn4({
        taskId: arg2,
        message: "等待超时，页面仍显示「加载中」，将按当前已捕获数据继续（可能偏少）",
        level: "warning"
      });
      return false;
    }
    return true;
  }
  function fn63(arg1, arg2, {
    nickname: nickname,
    userUrl: userUrl
  }) {
    const result = String(nickname || "").trim().replace(/^@+/, "");
    const result2 = normalizeDouyinAuthorProfileUrl(userUrl || "");
    const result3 = buildEntityUserKey(result2, result);
    if (!result3 || !result2 || !result || result === "未知作者" || arg2.has(result3)) {
      return false;
    }
    if (/^(关注|粉丝|获赞|私信|回关|已关注|相互关注|互相关注)$/.test(result)) {
      return false;
    }
    if (result.length > 40) {
      return false;
    }
    arg2.add(result3);
    arg1.push({
      nickname: result,
      userUrl: result2,
      userKey: result3
    });
    return true;
  }
  function fn64() {
    const list = [];
    const set = new Set();
    for (const item of collectEntityUsersFromApiBuffer("blogger")) {
      fn63(list, set, item);
    }
    const value = typeof collectDouyinSearchResultCards === "function" ? collectDouyinSearchResultCards() : [];
    const value2 = value.length ? value : Array.from(document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"/user/\"]")).map(arg1 => arg1.closest("div, li, article, section") || arg1).filter((arg1, arg2, arg3) => arg1 && arg3.indexOf(arg1) === arg2).slice(0, 120);
    for (const item of value2) {
      const result = fn57(item);
      let text = "";
      let text2 = "";
      if (result?.secUid) {
        text = "https://www.douyin.com/user/" + result.secUid;
        text2 = String(result.nickname || "").trim().replace(/^@+/, "");
      }
      if (!text) {
        text = typeof findSearchCardAuthorProfileUrl === "function" ? findSearchCardAuthorProfileUrl(item) : "";
      }
      if (!text) {
        const local = item.querySelector?.("a[href*=\"/user/\"]");
        if (local) {
          text = normalizeDouyinAuthorProfileUrl(local.href || local.getAttribute?.("href") || "");
        }
      }
      if (!text2 || text2 === "未知作者") {
        text2 = (typeof findSearchCardAuthorNickname === "function" ? findSearchCardAuthorNickname(item, text) : "") || text2;
      }
      if (!text2 || text2 === "未知作者") {
        text2 = fn44(item.innerText || item.textContent || "") || text2;
      }
      fn63(list, set, {
        nickname: text2,
        userUrl: text
      });
    }
    const result = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const item of result) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const local = item.href || item.getAttribute?.("href") || "";
      if (!local || local.includes("/user/self")) {
        continue;
      }
      const result = normalizeDouyinAuthorProfileUrl(local);
      if (!result) {
        continue;
      }
      let result2 = String(item.innerText || item.textContent || item.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (!result2 || result2.length > 40 || /^(关注|粉丝|获赞|私信|回关|已关注)$/.test(result2)) {
        const local = item.closest("div, li, article, section") || item.parentElement;
        const result = String(local?.innerText || "").split(/\n+/).map(arg1 => arg1.trim()).find(arg1 => arg1 && arg1.length <= 40 && !/粉丝|关注|获赞|抖音号|私信|点赞|评论|收藏/.test(arg1));
        result2 = result ? result.replace(/^@+/, "") : "";
        if (!result2) {
          result2 = fn44(local?.innerText || "") || "";
        }
      }
      fn63(list, set, {
        nickname: result2,
        userUrl: result
      });
    }
    return list;
  }
  async function fn65(arg1, num2 = 8000, text = "fans") {
    const result = Date.now();
    while (Date.now() - result < num2) {
      if (arg1 !== num) {
        return false;
      }
      const value = text === "following" ? fn66() : fn67();
      if (value) {
        return true;
      }
      if (!(await fn6(400, arg1))) {
        return false;
      }
    }
    return false;
  }
  function fn67() {
    const result = fn68();
    if (result?.findEntitySelfFansEntry) {
      return result.findEntitySelfFansEntry();
    }
    if (result?.findEntitySelfProfileRelationEntry) {
      return result.findEntitySelfProfileRelationEntry("fans");
    }
    return null;
  }
  function fn66() {
    const result = fn68();
    if (result?.findEntitySelfFollowingEntry) {
      return result.findEntitySelfFollowingEntry();
    }
    if (result?.findEntitySelfProfileRelationEntry) {
      return result.findEntitySelfProfileRelationEntry("following");
    }
    return null;
  }
  async function fn69(arg1, num2 = 8000) {
    const result = Date.now();
    const local = () => {
      const result = Array.from(document.querySelectorAll(".semi-tabs-bar"));
      return result.find(arg1 => {
        const result = String(arg1.innerText || "").replace(/\s+/g, "");
        if (!/\u5173注|\u7c89丝/.test(result)) {
          return false;
        }
        let value = arg1.parentElement;
        while (value && value !== document.body) {
          if (window.getComputedStyle(value).position === "fixed") {
            return true;
          }
          value = value.parentElement;
        }
        return false;
      }) || null;
    };
    while (Date.now() - result < num2) {
      if (arg1 !== num) {
        return false;
      }
      if (local()) {
        return true;
      }
      const result = Array.from(document.querySelectorAll("div")).some(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        const result = window.getComputedStyle(arg1);
        const local = parseInt(result.zIndex) || 0;
        if (result.position !== "fixed" || local < 1000) {
          return false;
        }
        return arg1.querySelectorAll("a[href*=\"/user/\"]").length >= 2 || /粉丝|相互关注|互相关注/.test(String(arg1.innerText || "").substring(0, 200));
      });
      if (result) {
        return true;
      }
      const result2 = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(arg1 => isVisibleElement(arg1));
      const result3 = result2.some(arg1 => arg1.querySelectorAll("a[href*=\"/user/\"]").length > 0 || /粉丝|相互关注|互相关注/.test(String(arg1.innerText || arg1.textContent || "")));
      if (result3) {
        return true;
      }
      if (!(await fn6(500, arg1))) {
        return false;
      }
    }
    return false;
  }
  function fn70() {
    const result = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(arg1 => isVisibleElement(arg1));
    const value = result.length ? result : [document.body];
    for (const item of value) {
      const result = Array.from(item.querySelectorAll("button, [role=\"tab\"], [role=\"button\"], div, span, a"));
      const result2 = result.find(arg1 => {
        if (!isVisibleElement(arg1)) {
          return false;
        }
        const result = String(arg1.innerText || arg1.textContent || "").replace(/\s+/g, "").trim();
        return result === "相互关注" || result === "互相关注";
      });
      if (!result2) {
        continue;
      }
      if (result2.matches?.("button, [role=\"tab\"], [role=\"button\"], a")) {
        return result2;
      } else {
        return result2.closest?.("button, [role=\"tab\"], [role=\"button\"], a") || result2;
      }
    }
    return null;
  }
  let local4 = null;
  function fn68() {
    if (!local4) {
      try {
        local4 = require("./entityMutualFollowScraper");
      } catch (error) {
        local4 = null;
      }
    }
    return local4;
  }
  function fn71() {
    const result = fn68();
    if (result?.findEntityFollowingTab) {
      return result.findEntityFollowingTab(arg1 => fn4({
        message: arg1,
        level: "info"
      }));
    }
    return null;
  }
  function fn72() {
    if (window.__radar_entity_mutual_filter_active) {
      return true;
    }
    const result = fn70();
    if (!result) {
      return false;
    }
    const result2 = ((result.getAttribute?.("aria-selected") || "") + " " + (result.className || "")).toLowerCase();
    return /true|active|selected|checked/.test(result2);
  }
  function fn73() {
    const result = fn68();
    if (result?.findEntityRelationModalContainer) {
      return result.findEntityRelationModalContainer();
    }
    return null;
  }
  function fn74() {
    const result = fn68();
    if (result?.findEntityRelationListScroller) {
      return result.findEntityRelationListScroller();
    }
    return null;
  }
  function fn75() {
    const text = "a[href*=\"/user/\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]";
    const result = Array.from(document.querySelectorAll("div, main, section, ul")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = window.getComputedStyle(arg1);
      const local = /(auto|scroll)/.test(result.overflowY || "") && arg1.scrollHeight > arg1.clientHeight + 120;
      if (!local) {
        return false;
      }
      return arg1.querySelectorAll(text).length >= 4;
    }).sort((arg1, arg2) => {
      const value = arg2.querySelectorAll(text).length - arg1.querySelectorAll(text).length;
      if (value !== 0) {
        return value;
      }
      return arg2.scrollHeight - arg2.clientHeight - (arg1.scrollHeight - arg1.clientHeight);
    });
    return result[0] || document.scrollingElement || document.documentElement;
  }
  function fn76(arg1, arg2) {
    let local = arg1;
    while (local && local !== arg2 && local !== document.body) {
      const value = local.querySelectorAll("a[href*=\"/user/\"]").length;
      const result = String(local.innerText || local.textContent || "");
      const result2 = /相互关注|已关注|回关|\+ 关注|移除/.test(result);
      if (value <= 3 && result2) {
        return local;
      }
      local = local.parentElement;
    }
    return arg1.closest("li") || arg1.parentElement;
  }
  function fn77(text = "mutual") {
    const result = fn68();
    const obj = {
      sourceType: text === "following" ? "following" : "mutual",
      collectEntityUsersFromApiBuffer: collectEntityUsersFromApiBuffer,
      normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
      buildEntityUserKey: buildEntityUserKey,
      logFn: arg1 => fn4({
        message: arg1,
        level: "info"
      })
    };
    if (result?.collectEntityRelationUsersFromList) {
      return result.collectEntityRelationUsersFromList(obj);
    }
    if (result?.collectEntityMutualUsersFromList) {
      return result.collectEntityMutualUsersFromList(obj);
    }
    return [];
  }
  function fn78() {
    return fn77("mutual");
  }
  async function fn79(arg1, arg2, {
    forceBottom = false
  } = {}) {
    const local = arg1 || document.scrollingElement || document.documentElement;
    const local2 = local === document.scrollingElement || local === document.documentElement || local === document.body;
    const value = local2 ? window.pageYOffset || document.documentElement.scrollTop || 0 : local.scrollTop || 0;
    const value2 = local2 ? window.innerHeight || document.documentElement.clientHeight || 800 : local.clientHeight || 800;
    const value3 = local2 ? Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) : local.scrollHeight || 0;
    const value4 = forceBottom ? Math.max(value2 * 2.8, 1800) : Math.floor(value2 * (1.8 + Math.random() * 1));
    try {
      const value = document.activeElement;
      if (value && typeof value.blur === "function") {
        value.blur();
      }
      window.focus?.();
      document.body?.focus?.();
      const local3 = (arg1, arg2) => {
        const obj = {
          key: arg1,
          code: arg1,
          keyCode: arg2,
          which: arg2,
          bubbles: true,
          cancelable: true
        };
        window.dispatchEvent(new KeyboardEvent("keydown", obj));
        document.dispatchEvent(new KeyboardEvent("keydown", obj));
        window.dispatchEvent(new KeyboardEvent("keyup", obj));
        document.dispatchEvent(new KeyboardEvent("keyup", obj));
      };
      local3("PageDown", 34);
      if (!(await fn6(220, arg2))) {
        return false;
      }
      local3("PageDown", 34);
      if (!(await fn6(220, arg2))) {
        return false;
      }
      local3("End", 35);
      if (!(await fn6(180, arg2))) {
        return false;
      }
      const value2 = local2 ? document.scrollingElement || document.documentElement : local;
      const local4 = arg1 => {
        const obj = {
          deltaY: arg1,
          deltaMode: 0,
          bubbles: true,
          cancelable: true
        };
        value2.dispatchEvent(new WheelEvent("wheel", obj));
        document.dispatchEvent(new WheelEvent("wheel", obj));
        window.dispatchEvent(new WheelEvent("wheel", obj));
      };
      local4(value4);
      if (!(await fn6(160, arg2))) {
        return false;
      }
      local4(Math.floor(value4 * 0.8));
    } catch (error) {}
    const local3 = (arg1, arg2, arg3) => {
      if (!arg1) {
        return;
      }
      const local = arg1.scrollTop || 0;
      const result = Math.max(0, (arg1.scrollHeight || 0) - (arg1.clientHeight || value2));
      if (arg3) {
        if (local >= result - 20 && result > 100) {
          arg1.scrollTop = Math.max(0, result - 250);
        }
        try {
          arg1.scrollTo({
            top: arg1.scrollHeight || 99999,
            behavior: "smooth"
          });
        } catch (error) {
          arg1.scrollTop = result + 80;
        }
      } else {
        try {
          arg1.scrollBy({
            top: arg2,
            behavior: "smooth"
          });
        } catch (error) {
          arg1.scrollTop = local + arg2;
        }
      }
    };
    if (local2) {
      window.scrollBy(0, value4);
      if (forceBottom) {
        const result = Math.max(0, Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - value2 + 80);
        window.scrollTo(0, result);
        document.documentElement.scrollTop = result;
        if (document.body) {
          document.body.scrollTop = result;
        }
      }
    } else {
      local3(local, value4, forceBottom);
      try {
        window.scrollBy(0, Math.floor(value4 * 0.85));
        if (forceBottom) {
          const result = Math.max(0, Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - value2 + 80);
          window.scrollTo(0, result);
        }
      } catch (error) {}
    }
    try {
      const value = local2 ? window : local;
      value.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
      document.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
      window.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
    } catch (error) {}
    if (!(await fn6(1400 + Math.random() * 800, arg2))) {
      return false;
    }
    const value5 = local2 ? window.pageYOffset || document.documentElement.scrollTop || 0 : local.scrollTop || 0;
    const value6 = local2 ? Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) : local.scrollHeight || 0;
    const value7 = value5 + value2 >= value6 - 160;
    return {
      moved: value5 > value + 40,
      atBottom: value7,
      before: value,
      after: value5,
      delta: Math.round(value5 - value),
      scrollHeight: value6
    };
  }
  function fn80(arg1) {
    if (arg1 === "mutual" || arg1 === "following") {
      return fn74();
    }
    if (arg1 === "blogger" || arg1 === "user" || arg1 === "video") {
      return fn75();
    }
    if (arg1 === "comment") {
      const local = findCommentPanelRoot(document.body) || resolveCommentPanelRoot(document.body);
      if (local && local !== document.body) {
        return local;
      }
    }
    return document.scrollingElement || document.documentElement;
  }
  function fn81() {
    const text = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]";
    const result = Array.from(document.querySelectorAll(text));
    const set = new Set();
    for (const item of result.slice(0, 80)) {
      let local = item?.parentElement;
      let num = 0;
      while (local && local !== document.body && num < 12) {
        if ((local.scrollHeight || 0) > (local.clientHeight || 0) + 80) {
          set.add(local);
        }
        local = local.parentElement;
        num += 1;
      }
    }
    for (const item of document.querySelectorAll("main, section, [class*=\"scroll\"], [class*=\"Scroll\"]")) {
      if ((item.scrollHeight || 0) > (item.clientHeight || 0) + 80) {
        set.add(item);
      }
    }
    return [...set].map(arg1 => {
      const local = arg1.getBoundingClientRect?.() || {};
      const local2 = arg1.querySelectorAll?.(text)?.length || 0;
      const result = Math.max(0, (arg1.scrollHeight || 0) - (arg1.clientHeight || 0));
      const local3 = Number(local.width) > 80 && Number(local.height) > 80 && Number(local.bottom) > 0 && Number(local.top) < (window.innerHeight || 0);
      return {
        node: arg1,
        rect: local,
        cardCount: local2,
        range: result,
        inViewport: local3
      };
    }).filter(arg1 => arg1.range > 80).sort((arg1, arg2) => {
      if (arg1.inViewport !== arg2.inViewport) {
        if (arg1.inViewport) {
          return -1;
        } else {
          return 1;
        }
      }
      if (arg1.cardCount !== arg2.cardCount) {
        return arg2.cardCount - arg1.cardCount;
      }
      return arg2.range - arg1.range;
    });
  }
  async function fn82(arg1, arg2) {
    const local = window.pageYOffset || document.documentElement.scrollTop || 0;
    const result = fn81();
    const map = new Map(result.map(({
      node: node
    }) => [node, Number(node.scrollTop) || 0]));
    try {
      window.scrollBy(0, arg1);
    } catch (error) {}
    if (!(await fn6(100, arg2))) {
      return {
        cancelled: true
      };
    }
    const local2 = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (local2 > local + 2) {
      return {
        cancelled: false,
        method: "window",
        windowDelta: local2 - local,
        innerDelta: 0,
        atBottom: (window.innerHeight || 0) + local2 >= Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - 120
      };
    }
    const local3 = result[0] || null;
    const local4 = local3?.rect || {};
    const result2 = Math.max(1, Math.round(Number(local4.left) + Math.min(Number(local4.width) || window.innerWidth || 1200, window.innerWidth || 1200) * 0.6));
    const result3 = Math.max(1, Math.round(Number(local4.top) + Math.min(Number(local4.height) || window.innerHeight || 800, window.innerHeight || 800) * 0.72));
    let local5 = null;
    try {
      local5 = await ipcRenderer.invoke("entity-leadgen-native-scroll", {
        deltaY: arg1,
        x: Math.min((window.innerWidth || 1200) - 2, result2),
        y: Math.min((window.innerHeight || 800) - 2, result3)
      });
    } catch (error) {}
    if (!(await fn6(320, arg2))) {
      return {
        cancelled: true
      };
    }
    const local6 = window.pageYOffset || document.documentElement.scrollTop || 0;
    let local7 = null;
    let num = 0;
    for (const {
      node: node
    } of result) {
      const value = (Number(node.scrollTop) || 0) - Number(map.get(node) || 0);
      if (Math.abs(value) > Math.abs(num)) {
        local7 = node;
        num = value;
      }
    }
    if (local6 > local + 2 || num > 2) {
      return {
        cancelled: false,
        method: local5?.method || "native",
        windowDelta: local6 - local,
        innerDelta: num,
        nativeOk: local5?.ok === true,
        atBottom: local7 ? (Number(local7.scrollTop) || 0) + (Number(local7.clientHeight) || 0) >= (Number(local7.scrollHeight) || 0) - 120 : (window.innerHeight || 0) + local6 >= Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - 120
      };
    }
    if (local3?.node) {
      const local = Number(local3.node.scrollTop) || 0;
      try {
        if (typeof local3.node.scrollBy === "function") {
          local3.node.scrollBy({
            top: arg1,
            behavior: "auto"
          });
        } else {
          local3.node.scrollTop = local + arg1;
        }
        local3.node.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (error) {}
      if (!(await fn6(180, arg2))) {
        return {
          cancelled: true
        };
      }
      num = (Number(local3.node.scrollTop) || 0) - local;
    }
    return {
      cancelled: false,
      method: num > 2 ? "dom-scroll-root" : local5?.method || "no-movement",
      windowDelta: (window.pageYOffset || document.documentElement.scrollTop || 0) - local,
      innerDelta: num,
      nativeOk: local5?.ok === true,
      candidateCount: result.length,
      atBottom: local3?.node ? (Number(local3.node.scrollTop) || 0) + (Number(local3.node.clientHeight) || 0) >= (Number(local3.node.scrollHeight) || 0) - 120 : false
    };
  }
  async function fn83(arg1, arg2) {
    arg1;
    const local = window.pageYOffset || document.documentElement.scrollTop || 0;
    const result = String(document.visibilityState || "");
    let local2 = null;
    const result2 = getVideoSearchCollectionEngineModule();
    const local3 = () => typeof listLeadgenScrapeAwemes === "function" ? listLeadgenScrapeAwemes().length : 0;
    const local4 = () => typeof collectDouyinSearchResultCards === "function" ? collectDouyinSearchResultCards().length : 0;
    const local5 = () => ({
      y: window.pageYOffset || document.documentElement.scrollTop || 0,
      innerWidth: window.innerWidth || 0,
      innerHeight: window.innerHeight || 0,
      scrollHeight: Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0),
      htmlOverflow: window.getComputedStyle(document.documentElement).overflowY || "",
      bodyOverflow: document.body ? window.getComputedStyle(document.body).overflowY || "" : ""
    });
    const value = result2?.performVideoSearchWindowScroll ? await result2.performVideoSearchWindowScroll({
      scrollBy: async arg1 => {
        local2 = await fn82(arg1, arg2);
      },
      wait: arg1 => fn6(arg1, arg2),
      readApiCount: local3,
      readDomCount: local4,
      readViewport: local5,
      delta: 1000,
      waitMinMs: 1800,
      waitMaxMs: 3200
    }) : await (async () => {
      const result = local3();
      const result2 = local4();
      local2 = await fn82(1000, arg2);
      if (local2?.cancelled) {
        return {
          cancelled: true
        };
      }
      if (!(await fn6(1800 + Math.random() * 1400, arg2))) {
        return {
          cancelled: true
        };
      }
      const result3 = local3();
      const result4 = local4();
      return {
        beforeApi: result,
        afterApi: result3,
        beforeDom: result2,
        afterDom: result4,
        sourceGrew: result3 > result || result4 > result2,
        beforeViewport: {
          y: local
        },
        afterViewport: local5()
      };
    })();
    if (value?.cancelled) {
      return false;
    }
    const local6 = window.pageYOffset || document.documentElement.scrollTop || 0;
    const local7 = window.innerHeight || document.documentElement.clientHeight || 800;
    const result3 = Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0);
    const value2 = local6 > local + 40;
    const value3 = typeof local2?.atBottom === "boolean" ? local2.atBottom : local6 + local7 >= result3 - 120;
    const local8 = Number(local2?.innerDelta) || 0;
    const value4 = Math.abs(local6 - local) >= Math.abs(local8) ? local6 - local : local8;
    return {
      moved: value2 || Math.abs(local8) > 2,
      atBottom: value3,
      before: local,
      after: local6,
      delta: Math.round(value4),
      windowDelta: Math.round(local6 - local),
      innerDelta: Math.round(local8),
      scrollHeight: result3,
      apiBefore: value.beforeApi,
      apiAfter: value.afterApi,
      domBefore: value.beforeDom,
      domAfter: value.afterDom,
      apiGrew: value.sourceGrew,
      visibility: result,
      strategy: "shared-window",
      inputMethod: local2?.method || "unknown",
      nativeOk: local2?.nativeOk === true,
      candidateCount: Number(local2?.candidateCount) || 0,
      viewport: value.afterViewport || local5()
    };
  }
  async function fn84({
    token: token,
    taskId: taskId,
    gatherFn: gatherFn,
    sourceType: sourceType,
    searchKeyword = "",
    seenKeys: seenKeys,
    collectedUsers: collectedUsers,
    maxCollect: maxCollect,
    emptyLimit = 2,
    maxRounds = 80,
    progressLabel = "采集中"
  }) {
    let num2 = 0;
    let num3 = 0;
    let text = "";
    const result = Math.max(1, Number(emptyLimit) || 2);
    const result2 = Math.max(maxRounds, 80);
    for (let num4 = 0; num4 < result2; num4 += 1) {
      if (token !== num) {
        return {
          cancelled: true
        };
      }
      if (maxCollect > 0 && collectedUsers.length >= maxCollect) {
        return {
          reachedLimit: true
        };
      }
      if (num4 === 0 || num4 % 3 === 0) {
        const result = await fn39(token);
        if (result > 0) {
          fn4({
            taskId: taskId,
            message: progressLabel + "：已关闭登录弹窗 ×" + result,
            level: "info"
          });
        }
      }
      const local = gatherFn() || [];
      const result2 = local.map(arg1 => String(arg1?.userKey || "").trim()).filter(Boolean).sort().join("|");
      const local2 = !!result2 && result2 === text;
      if (result2) {
        text = result2;
      }
      let num5 = 0;
      let num6 = 0;
      for (const item of local) {
        if (!item?.userKey) {
          continue;
        }
        if (seenKeys.has(item.userKey)) {
          num6 += 1;
          continue;
        }
        seenKeys.add(item.userKey);
        collectedUsers.push({
          ...item,
          sourceType: sourceType,
          searchKeyword: searchKeyword
        });
        num5 += 1;
        if (maxCollect > 0 && collectedUsers.length >= maxCollect) {
          break;
        }
      }
      if (local.length > 0 && num6 > 0) {
        fn4({
          taskId: taskId,
          message: progressLabel + "：本轮识别 " + local.length + " 条，其中 " + num6 + " 条本页已出现过（去重，已跳过）",
          level: "info"
        });
      } else if (local.length === 0 && num5 === 0 && (sourceType === "video" || sourceType === "blogger") && num4 === 0) {
        const value = typeof fn62 === "function" ? fn62() : null;
        if (value && (value.cards > 0 || value.videoLinks > 0)) {
          fn4({
            taskId: taskId,
            message: progressLabel + "：页面可见卡片约 " + value.cards + "、视频链 " + value.videoLinks + "，但本轮未能解析出有效链接，继续尝试…",
            level: "warning"
          });
        }
      }
      if (num5 > 0) {
        num2 = 0;
        num3 = 0;
        const result = collectedUsers.slice(-num5);
        fn4({
          taskId: taskId,
          accountId: window._radar_account_id || "",
          accountName: window._radar_account_name || "",
          sourceType: sourceType,
          message: progressLabel + "：本轮新增 " + num5 + "，累计 " + collectedUsers.length,
          level: "info",
          users: result
        });
      } else {
        num3 += 1;
        num2 += 1;
        fn4({
          taskId: taskId,
          message: local2 ? progressLabel + "：结果未增长（仍是这 " + local.length + " 条，连续无新增 " + num3 + "/" + result + "，累计 " + collectedUsers.length + "）" : progressLabel + "：本轮暂无新增（连续无新增 " + num3 + "/" + result + "，累计 " + collectedUsers.length + "）",
          level: "info"
        });
        if (sourceType !== "video" && (num2 >= result || num3 >= result)) {
          fn4({
            taskId: taskId,
            message: progressLabel + "：连续 " + result + " 轮无新数据，进入下一步（累计 " + collectedUsers.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      }
      const result3 = fn80(sourceType);
      if (sourceType === "mutual" || sourceType === "following") {
        const result = fn68();
        let local = null;
        if (result?.scrollEntityMutualContainer) {
          local = await result.scrollEntityMutualContainer(result3, arg1 => fn6(arg1, token), arg1 => fn4({
            message: arg1,
            level: "info"
          }));
        } else {
          const result = await fn79(result3, token, {
            forceBottom: true
          });
          if (result === false) {
            return {
              cancelled: true
            };
          }
        }
        if (num5 === 0 && num6 > 0 && local && local.moved === false && num2 >= 3) {
          const value = sourceType === "following" ? "关注列表" : "互关";
          fn4({
            taskId: taskId,
            message: progressLabel + "：列表已无更多可加载内容（连续重复且滚动无位移），结束" + value + "采集（累计 " + collectedUsers.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      } else if (sourceType === "video") {
        const result2 = await fn83(result3, token);
        if (result2 === false) {
          return {
            cancelled: true
          };
        }
        if (num4 === 0 || num4 % 3 === 0 || !result2.apiGrew) {
          try {
            const value = "翻页诊断：位移 " + (result2.delta || 0) + "px" + ("，API " + result2.apiBefore + "->" + result2.apiAfter) + ("，DOM " + result2.domBefore + "->" + result2.domAfter) + ("，视口 " + (result2.viewport?.innerWidth || 0) + "×" + (result2.viewport?.innerHeight || 0)) + ("，输入 " + (result2.inputMethod || "unknown")) + ("，内层位移 " + (result2.innerDelta || 0) + "px") + ("，候选 " + (result2.candidateCount || 0)) + ("，overflow " + (result2.viewport?.htmlOverflow || "?") + "/" + (result2.viewport?.bodyOverflow || "?")) + ("，触底 " + (result2.atBottom ? "是" : "否"));
            console.log("[EntityLeadgen][ScrollDiag] " + progressLabel + (" scroll=" + (result2.delta || 0) + "px") + (" api=" + result2.apiBefore + "->" + result2.apiAfter) + (" dom=" + result2.domBefore + "->" + result2.domAfter) + (" strategy=" + (result2.strategy || "?")) + (" input=" + (result2.inputMethod || "?")) + (" inner=" + (result2.innerDelta || 0) + "px") + (" candidates=" + (result2.candidateCount || 0)) + (" bottom=" + !!result2.atBottom) + (" viewport=" + (result2.viewport?.innerWidth || 0) + "x" + (result2.viewport?.innerHeight || 0)) + (" visibility=" + (result2.visibility || "?")));
            fn4({
              taskId: taskId,
              sourceType: sourceType,
              message: progressLabel + "：" + value,
              level: "info",
              diagnostic: true
            });
          } catch (error) {}
        }
        const result4 = getVideoSearchCollectionEngineModule();
        const value = result4?.evaluateVideoSearchCollectionRound ? result4.evaluateVideoSearchCollectionRound({
          previousEmptyRounds: num5 > 0 ? 0 : Math.max(0, num2 - 1),
          added: num5,
          sourceGrew: result2.apiGrew,
          atBottom: result2.atBottom,
          emptyLimit: Math.min(6, result),
          bottomEmptyLimit: 3
        }) : {
          emptyRounds: result2.apiGrew ? 0 : num2,
          shouldStop: num5 === 0 && !result2.apiGrew && (result2.atBottom && num2 >= 3 || num2 >= Math.min(6, result))
        };
        num2 = value.emptyRounds;
        if (value.shouldStop || num3 >= result) {
          fn4({
            taskId: taskId,
            message: result2.atBottom ? progressLabel + "：已确认搜索结果触底，结束本词（累计 " + collectedUsers.length + "）" : progressLabel + "：连续 " + num3 + " 次下拉无新增，结束本词（累计 " + collectedUsers.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      } else {
        const result = await fn79(result3, token, {
          forceBottom: true
        });
        if (result === false) {
          return {
            cancelled: true
          };
        }
      }
      fn4({
        taskId: taskId,
        message: progressLabel + "：正在加载更多数据…",
        level: "info"
      });
      const value = num5 > 0 ? 1800 + Math.random() * 1200 : 2200 + Math.random() * 1400;
      if (!(await fn6(value, token))) {
        return {
          cancelled: true
        };
      }
    }
    return {
      exhausted: true
    };
  }
  async function fn85(options = {}) {
    const value = options.requestId;
    const value2 = options.taskId;
    const result = String(options.liveUrl || options.searchKeyword || window.location.href).trim();
    const value3 = options.generation != null ? Number(options.generation) : null;
    const local = ++num;
    const value4 = Number(options.maxCollect) > 0 ? Math.floor(Number(options.maxCollect)) : 0;
    const result2 = Number(options.liveDurationSeconds);
    const value5 = Number.isFinite(result2) && result2 >= 0 ? Math.min(10080, Math.max(0, Math.round(result2 / 60))) * 60 : 180;
    const result3 = fn22(options.liveEventTypes);
    const set = new Set(result3);
    const result4 = loadClassifyLiveRoomAvailability();
    const set2 = new Set(Array.isArray(options.seenKeys) ? options.seenKeys.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : []);
    const list = [];
    const map = new Map();
    fn16();
    obj = {
      taskId: value2 || "",
      accountId: options.accountId || "",
      accountName: options.accountName || options.nickname || "",
      generation: value3
    };
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: value2,
          generation: value3,
          ...arg1
        });
      } catch (error) {}
    };
    const local3 = (arg1, num = 0, arg3 = new WeakSet()) => {
      if (!arg1 || typeof arg1 !== "object" || num > 8 || arg3.has(arg1)) {
        return null;
      }
      arg3.add(arg1);
      const local = arg1.sec_uid || arg1.secUid || arg1.sec_id;
      const local2 = arg1.nickname || arg1.nickName || arg1.nick_name;
      if (typeof local === "string" && local.length > 15 && !local.startsWith("live_")) {
        return {
          secUid: local.trim(),
          nickname: local2 ? String(local2).trim().replace(/^@+/, "") : ""
        };
      }
      if (Array.isArray(arg1)) {
        for (const item of arg1) {
          const result = local3(item, num + 1, arg3);
          if (result) {
            return result;
          }
        }
        return null;
      }
      const list = ["user", "userInfo", "user_info", "author", "authorInfo", "msg", "message", "data", "props", "memoizedProps"];
      for (const item of list) {
        if (arg1[item]) {
          const result = local3(arg1[item], num + 1, arg3);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };
    const local4 = arg1 => {
      if (!arg1 || arg1.nodeType !== 1) {
        return null;
      }
      const result2 = (arg1.textContent || "").trim();
      if (!result2 || result2.length > 250) {
        return null;
      }
      let text = "";
      let text2 = "";
      let text3 = "";
      const local = arg1.querySelector?.("a[href*=\"/user/\"], a[href*=\"sec_uid\"]") || (arg1.tagName === "A" && (arg1.href.includes("/user/") || arg1.href.includes("sec_uid")) ? arg1 : null);
      if (local) {
        const local2 = local.href || local.getAttribute?.("href") || "";
        const local3 = local2.match(/\/user\/([^\?\/#]+)/) || local2.match(/sec_uid=([^\&#]+)/);
        if (local3 && local3[1] && local3[1].length > 15 && !local3[1].startsWith("live_")) {
          text = decodeURIComponent(local3[1]).trim();
        }
        text2 = (local.textContent || "").trim().replace(/^@+/, "");
      }
      if (!text || !text2) {
        let local = arg1;
        let num = 0;
        while (local && num < 8) {
          const result = Object.keys(local).filter(arg1 => arg1.startsWith("__reactProps$") || arg1.startsWith("__reactFiber$"));
          for (const item of result) {
            const value = local[item];
            if (!value) {
              continue;
            }
            const result = local3(value, 0, new WeakSet());
            if (result) {
              if (!text && result.secUid && result.secUid.length > 15 && !result.secUid.startsWith("live_")) {
                text = result.secUid;
              }
              if (!text2 && result.nickname) {
                text2 = result.nickname;
              }
            }
          }
          if (text && text2) {
            break;
          }
          local = local.parentElement;
          num++;
        }
      }
      if (!text2) {
        const local = arg1.querySelector?.("[class*=\"nickname\"], [class*=\"user-name\"], [class*=\"author\"], [class*=\"name\"]");
        if (local) {
          text2 = (local.textContent || "").trim().replace(/^@+/, "");
        }
      }
      let text4 = "";
      let text5 = "interaction";
      let text6 = "RoomMessage";
      if (result2.includes("进入直播间") || result2.includes("来了")) {
        text4 = "进入直播间";
        text5 = "enter";
        text6 = "MemberMessage";
        if (!text2) {
          const result = result2.match(/^(.+?)(?:进入直播间|来了)/);
          if (result) {
            text2 = result[1].trim();
          }
        }
      } else if (result2.includes("赞了") || result2.includes("点赞")) {
        text4 = "点赞了直播间";
        text5 = "like";
        text6 = "LikeMessage";
        if (!text2) {
          const result = result2.match(/^(.+?)(?:赞了|点赞)/);
          if (result) {
            text2 = result[1].trim();
          }
        }
      } else if (result2.includes("关注了主播") || result2.includes("关注了")) {
        text4 = "关注了主播";
        text5 = "follow";
        text6 = "SocialMessage";
        if (!text2) {
          const result = result2.match(/^(.+?)(?:关注了主播|关注了)/);
          if (result) {
            text2 = result[1].trim();
          }
        }
      } else if (result2.includes("送给") || result2.includes("送了") || result2.includes("赠送")) {
        let local = result2;
        if (text2 && local.startsWith(text2)) {
          local = local.slice(text2.length).trim();
        }
        text4 = local ? "赠送礼物: " + local : "赠送礼物";
        text5 = "gift";
        text6 = "GiftMessage";
        if (!text2) {
          const result = result2.match(/^(.+?)(?:送给|送了|赠送)/);
          if (result) {
            text2 = result[1].trim();
          }
        }
      } else if (arg1.closest?.("[class*=\"rank\"], [class*=\"online\"], [class*=\"audience\"]")) {
        text4 = "直播间在线观众";
      } else if (result2.includes("分享了直播间") || result2.includes("加入了粉丝团")) {
        text4 = result2;
      } else {
        let local = result2;
        if (text2 && local.startsWith(text2)) {
          local = local.slice(text2.length).replace(/^[\s：:]+/, "");
        }
        text4 = local ? "发表弹幕: " + local : "直播间发言";
        text5 = "comment";
        text6 = "ChatMessage";
      }
      if (!text2) {
        return null;
      }
      if (!set.has(text5)) {
        return null;
      }
      const local2 = text && text.length > 15 && /^[A-Za-z0-9_\-]+$/.test(text) && !text.startsWith("live_");
      const value = local2 ? text : "";
      const value2 = local2 ? "https://www.douyin.com/user/" + value : "";
      const result3 = String(arg1.closest?.("[data-id]")?.getAttribute?.("data-id") || "").trim();
      const result4 = Date.now();
      const obj = {
        messageId: result3,
        method: text6,
        type: text6,
        category: text5,
        content: text4,
        text: text5 === "comment" ? text4.replace(/^发表弹幕:\s*/, "") : "",
        occurredAt: result4,
        observedAt: result4
      };
      return {
        secUid: value,
        userKey: value || "name:" + text2,
        nickname: text2,
        userUrl: value2,
        content: text4,
        messageId: result3,
        liveEvent: obj,
        liveEvents: [obj],
        eventTimestamp: result4,
        sourceType: "live",
        entrySource: "entity_live",
        entryLabel: "线索采集：直播间",
        liveUrl: result,
        searchKeyword: "直播间: " + result
      };
    };
    try {
      window._radar_account_id = options.accountId;
      window._radar_account_name = options.accountName || options.nickname || "";
      ensureEntityApiHook();
      ensureEntityLiveHook();
      fn59();
      fn4({
        sourceType: "live",
        entrySource: "entity_live",
        entryLabel: "线索采集：直播间",
        message: "直播间采集启动：正在监测直播间聊天室…",
        level: "info"
      });
      await fn39(local);
      const set = new Set();
      const set3 = new Set();
      const result2 = Date.now();
      const value = value5 > 0 ? value5 * 1000 : Number.POSITIVE_INFINITY;
      let flag = false;
      while (Date.now() - result2 < value && local === num) {
        const result5 = document.querySelector("[class*=\"chatroom___items\"], [class*=\"webcast-chatroom\"], [data-e2e=\"live-room-chat\"]");
        const value = result5 ? result5.querySelectorAll("div, li, p, span") : [];
        const result6 = collectEntityUsersFromApiBuffer("live", {
          liveEventTypes: result3
        });
        if (result6.length > 0) {
          flag = true;
        }
        const value3 = Date.now() - result2;
        const result7 = [document.title || "", ...Array.from(document.querySelectorAll("[data-e2e*=\"end\"], [class*=\"live-end\"], [class*=\"liveEnd\"], [class*=\"empty\"], [class*=\"offline\"], [class*=\"privacy\"], [class*=\"Password\"], [class*=\"password\"]")).slice(0, 24).map(arg1 => arg1.textContent || ""), String(document.body?.innerText || "").slice(0, result5 ? 4000 : 15000)].join(" ");
        const value5 = list.filter(arg1 => !!arg1?.privacyMasked).length;
        const local3 = list.length > 0 && value5 === list.length;
        const result8 = result4({
          text: result7,
          hasChatContainer: !!result5,
          elapsedMs: value3,
          capturedAnyEvent: flag,
          privacyAudienceOnly: local3,
          privacyAudienceCount: value5
        });
        if (result8.ended) {
          const value = result8.reason === "live_private" ? "⏭ " : "";
          const value3 = "" + value + result8.message + "，已退出当前直播间监控";
          fn4({
            taskId: value2,
            accountId: options.accountId || "",
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            message: value3,
            level: "warning"
          });
          local2({
            success: true,
            ended: true,
            endReason: result8.reason,
            message: value3,
            users: result8.reason === "live_private" ? [] : list
          });
          fn16();
          return;
        }
        const list2 = [];
        if (!result6.length && Date.now() - result2 >= 10000) {
          value.forEach(arg1 => {
            const result = local4(arg1);
            if (result && result.nickname) {
              const local = result.messageId || result.userKey + "_" + result.content;
              if (!set.has(local)) {
                set.add(local);
                if (!set2.has(result.userKey)) {
                  if (value4 > 0 && list.length >= value4) {
                    return;
                  }
                  set2.add(result.userKey);
                  map.set(result.userKey, list.length);
                  list.push(result);
                }
                list2.push(result);
              }
            }
          });
        }
        result6.forEach(arg1 => {
          const local = arg1.userKey || arg1.secUid || (arg1.uid ? "uid:" + arg1.uid : "");
          if (!local) {
            return;
          }
          const value = Array.isArray(arg1.liveEvents) ? arg1.liveEvents : [];
          const result2 = value.filter(arg1 => {
            const local2 = String(arg1.messageId || "").trim() || [local, arg1.method || arg1.type || "", arg1.occurredAt || arg1.observedAt || "", arg1.content || arg1.text || ""].join("|");
            if (set3.has(local2)) {
              return false;
            }
            set3.add(local2);
            return true;
          });
          const result3 = set2.has(local);
          const obj = {
            ...arg1,
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            content: arg1.content || result2[result2.length - 1]?.content || "直播间互动用户",
            liveUrl: result,
            searchKeyword: "直播间: " + result
          };
          const result4 = map.get(local);
          let local2 = result3 || result4 != null;
          if (result4 != null) {
            const value2 = list[result4];
            const result = fn21(value2?.liveEvents || [], value);
            list[result4] = {
              ...value2,
              ...obj,
              liveEvents: result,
              liveEvent: result[result.length - 1] || obj.liveEvent
            };
          } else if (!result3) {
            if (value4 > 0 && list.length >= value4) {
              return;
            }
            set2.add(local);
            map.set(local, list.length);
            list.push(obj);
            local2 = true;
          }
          if (local2 && (!result3 || result2.length)) {
            const local = result2[result2.length - 1] || obj.liveEvent;
            list2.push({
              ...obj,
              content: local?.content || obj.content,
              liveEvent: local || null,
              liveEvents: result2,
              messageId: local?.messageId || obj.messageId || "",
              eventTimestamp: local?.occurredAt || obj.eventTimestamp || Date.now()
            });
          }
        });
        if (list2.length > 0) {
          flag = true;
          fn4({
            taskId: value2,
            accountId: options.accountId || "",
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            message: "直播间实时捕获 " + list2.length + " 条用户互动（累计 " + list.length + " 个用户）",
            level: "info",
            users: list2
          });
        }
        if (value4 > 0 && list.length >= value4) {
          fn4({
            taskId: value2,
            message: "直播间采集达到设置的最大数量 (" + value4 + ")",
            level: "info"
          });
          break;
        }
        if (!(await fn6(2000, local))) {
          break;
        }
      }
      local2({
        success: true,
        users: list,
        message: "直播间采集完成，共获取 " + list.length + " 个观众/弹幕线索"
      });
      fn16();
    } catch (error) {
      local2({
        success: false,
        error: error?.message || String(error),
        users: list
      });
      fn16();
    } finally {
      if (local === num) {
        fn60();
      }
    }
  }
  async function runEntityLeadgenOpenFirstSearchVideo(options = {}) {
    const value = options.requestId;
    const local = options.taskId || "";
    const result = String(options.searchKeyword || "").trim();
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: local,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const local3 = ++num;
      obj = {
        taskId: local,
        accountId: options.accountId || obj?.accountId || "",
        accountName: options.accountName || obj?.accountName || "",
        generation: options.generation != null ? Number(options.generation) : obj?.generation,
        skipIngest: options.skipIngest != null ? !!options.skipIngest : false
      };
      try {
        const result = String(options.accountId || obj.accountId || "").trim();
        if (result) {
          window._radar_account_id = result;
          sessionStorage.setItem("radar_account_id", result);
        }
      } catch (error) {}
      window._searchVideoQueueKeyword = result || window._searchVideoQueueKeyword || "";
      const text = "ENTITY_LEADGEN";
      const result2 = String(window.location.href || "");
      if (!/\/search\//i.test(result2)) {
        local2({
          success: false,
          ready: false,
          reason: "not_on_search"
        });
        return;
      }
      const result3 = await fn38(local3, local, options);
      if (result3?.cancelled || local3 !== num) {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      try {
        ensureLeadgenScrapeApiHook({
          force: true
        });
        ensureLeadgenScrapeApiBridge();
      } catch (error) {}
      fn4({
        taskId: local,
        message: "正在等待搜索结果出现…",
        level: "info"
      });
      if (typeof fn41 === "function") {
        await fn41(local3, local, {
          sourceType: "video",
          maxWaitMs: 18000
        });
      } else {
        await fn6(2200, local3);
      }
      if (local3 !== num) {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      try {
        window.scrollTo(0, 0);
      } catch (error) {}
      await fn6(500, local3);
      let text2 = "";
      let local4 = null;
      let local5 = null;
      try {
        const {
          cardMap: cardMap
        } = typeof buildDouyinSearchResultCardMap === "function" ? buildDouyinSearchResultCardMap() : {
          cardMap: new Map()
        };
        for (const [local, local2] of cardMap.entries()) {
          if (!local) {
            continue;
          }
          text2 = normalizeSearchQueueVideoUrl?.(local) || String(local).trim();
          local4 = local2?.clickTarget || local2?.card || null;
          local5 = local2?.card || (typeof getDouyinSearchCardRoot === "function" ? getDouyinSearchCardRoot(local4) : null);
          break;
        }
      } catch (error) {}
      if (!text2) {
        try {
          const value = typeof listLeadgenScrapeAwemes === "function" ? listLeadgenScrapeAwemes() : [];
          for (const item of value || []) {
            const local = normalizeSearchQueueVideoUrl?.(item?.videoUrl || item?.videoId) || String(item?.videoUrl || "").trim();
            if (local) {
              text2 = local;
              break;
            }
          }
        } catch (error) {}
      }
      if (!text2) {
        local2({
          success: false,
          ready: false,
          reason: "no_search_results"
        });
        return;
      }
      fn4({
        taskId: local,
        message: "正在打开搜索结果第一条视频…",
        level: "info"
      });
      rememberPendingLeadVideoUrl?.(text2);
      state.lastClickedId = text2;
      let flag = false;
      if (local4 && typeof simulateHumanClick === "function") {
        try {
          await simulateHumanClick(local4, text);
        } catch (error) {}
        flag = typeof waitForVideoDetailReadyAndPause === "function" ? await waitForVideoDetailReadyAndPause(text, text2, 5000) : false;
        if (!flag && local4 !== local5 && local5) {
          try {
            const local = (typeof getDouyinSearchCardClickTarget === "function" ? getDouyinSearchCardClickTarget(local5) : null) || local5;
            await simulateHumanClick(local, text);
          } catch (error) {}
          flag = typeof waitForVideoDetailReadyAndPause === "function" ? await waitForVideoDetailReadyAndPause(text, text2, 4000) : false;
        }
      }
      if (!flag) {
        const value = typeof openSearchQueueVideoByUrl === "function" ? await openSearchQueueVideoByUrl(text, text2, {
          allowHardNavigation: true,
          softWaitMs: 4500,
          hardWaitMs: 7000
        }) : "failed";
        if (value === "navigating") {
          local2({
            success: false,
            navigating: true,
            videoUrl: text2
          });
          return;
        }
        flag = value === "ready";
      }
      if (!flag && typeof waitForVideoDetailReadyAndPause === "function") {
        flag = await waitForVideoDetailReadyAndPause(text, text2, 6500);
      }
      const local6 = flag && (fn2?.(text2) || !!resolveDouyinVideoDetailModal?.({
        includeFeed: false
      }));
      if (local6) {
        fn5?.("线索采集：搜索首条打开后锁定暂停");
        const local = resolveCurrentVisibleVideoUrl?.("", resolveDouyinVideoDetailModal?.({
          includeFeed: false
        }) || document) || text2;
        local2({
          success: true,
          ready: true,
          videoUrl: local
        });
        return;
      }
      local2({
        success: false,
        ready: false,
        reason: "detail_not_ready",
        videoUrl: text2
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      local2({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runEntityLeadgenOpenSearchVideo(options = {}) {
    const value = options.requestId;
    const local = options.taskId || "";
    const result = String(options.videoUrl || "").trim();
    const result2 = String(options.searchKeyword || "").trim();
    const flag = !!options.softOnly;
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: local,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      obj = {
        taskId: local,
        accountId: options.accountId || obj?.accountId || "",
        accountName: options.accountName || obj?.accountName || "",
        generation: options.generation != null ? Number(options.generation) : obj?.generation,
        skipIngest: options.skipIngest != null ? !!options.skipIngest : false
      };
      try {
        const result = String(options.accountId || obj.accountId || "").trim();
        if (result) {
          window._radar_account_id = result;
          sessionStorage.setItem("radar_account_id", result);
        }
      } catch (error) {}
      window._searchVideoQueueKeyword = result2 || window._searchVideoQueueKeyword || "";
      const text = "ENTITY_LEADGEN";
      const result3 = String(window.location.href || "");
      const result4 = /\/search\//i.test(result3);
      if (!result4) {
        if (flag) {
          local2({
            success: false,
            ready: false,
            reason: "not_on_search"
          });
          return;
        }
        const local3 = (() => {
          try {
            const {
              buildEntitySearchModalUrl: buildEntitySearchModalUrl
            } = require("./entityLeadgenUrls");
            return buildEntitySearchModalUrl(result, result2);
          } catch (error) {
            return "";
          }
        })() || "https://www.douyin.com/jingxuan?modal_id=" + (extractSpecificVideoId(result) || "");
        fn4({
          taskId: local,
          message: "不在搜索页，正在打开搜索详情弹层…",
          level: "info"
        });
        if (typeof suspendAutomationForNavigation === "function") {
          suspendAutomationForNavigation();
        }
        window.location.href = local3;
        local2({
          success: false,
          navigating: true,
          videoUrl: result
        });
        return;
      }
      fn4({
        taskId: local,
        message: "正在搜索页打开视频详情（对齐仅采集）…",
        level: "info"
      });
      if (typeof openSearchQueueVideoByUrl === "function") {
        const result2 = await openSearchQueueVideoByUrl(text, result, {
          allowHardNavigation: !flag,
          softWaitMs: 4500,
          hardWaitMs: 7000
        });
        if (result2 === "navigating") {
          local2({
            success: false,
            navigating: true,
            videoUrl: result
          });
          return;
        }
        if (result2 === "ready") {
          const local = !!resolveDouyinVideoDetailModal({
            includeFeed: false
          }) && (typeof isViewingDouyinVideoPage === "function" ? isViewingDouyinVideoPage() : true);
          if (local || fn2(result)) {
            fn5("线索采集：搜索弹层打开后锁定暂停");
            local2({
              success: true,
              ready: true,
              videoUrl: resolveCurrentVisibleVideoUrl?.("", resolveDouyinVideoDetailModal({
                includeFeed: false
              }) || document) || result
            });
            return;
          }
        }
      }
      if (typeof waitForVideoDetailReadyAndPause === "function") {
        const result2 = await waitForVideoDetailReadyAndPause(text, result, 6500);
        if (result2 && fn2(result)) {
          fn5("线索采集：搜索弹层打开后锁定暂停");
          local2({
            success: true,
            ready: true,
            videoUrl: result
          });
          return;
        }
      }
      local2({
        success: false,
        ready: false,
        reason: "detail_not_ready"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      local2({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runEntityLeadgenWaitVideoReady(options = {}) {
    const value = options.requestId;
    const local = options.taskId || "";
    const result = String(options.videoUrl || "").trim();
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: local,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      if (!result2.taskRunning) {
        result2.stopRequested = false;
      }
      const local3 = ++num;
      const result2 = await fn7(local3, local, result, 18000);
      if (result2?.cancelled) {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      if (result2?.status === "unavailable") {
        local2({
          success: false,
          videoUnavailable: true,
          unavailableReason: result2.reason || "unavailable"
        });
        return;
      }
      const local4 = result2?.status === "ready" || fn2(result);
      local2({
        success: !!local4,
        ready: !!local4,
        videoUrl: resolveCurrentVisibleVideoUrl?.("", resolveDouyinVideoDetailModal?.({
          includeFeed: false
        }) || document) || result
      });
    } catch (error) {
      local2({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function fn89(options = {}) {
    const text = "ENTITY_LEADGEN_RECOMMEND";
    const value = options.wantAuthor === true;
    const value2 = options.lightCapture === true;
    const result = Math.max(value2 ? 1200 : 8000, Math.min(30000, Number(options.maxWaitMs) || (value2 ? 2500 : 20000)));
    const result2 = Date.now();
    let flag = false;
    let flag2 = false;
    let num = 0;
    const value3 = value2 ? 4 : 12;
    while (Date.now() - result2 < result) {
      if (shouldAbort(text)) {
        return {
          cancelled: true
        };
      }
      let value4 = typeof getDouyinFeedScope === "function" ? getDouyinFeedScope() : null;
      flag = !!value4 && value4 !== document && !!isVisibleElement?.(value4);
      const value5 = typeof getVideoTitle === "function" ? String(getVideoTitle(value4 || document) || "") : "";
      const local = isDouyinFeedLiveStream(value4 || document) || hasFeedLiveEnterHint() || isDouyinLiveStreamTitle(value5);
      if (local) {
        return {
          success: true,
          ready: true,
          live: true,
          identity: getFeedVideoIdentity?.(value4 || document) || "",
          title: value5,
          waitedMs: Date.now() - result2
        };
      }
      flag2 = !!isDouyinFeedPlaying?.();
      if (!flag2) {
        pauseVisibleDouyinVideos(value4 || document, "线索采集：推荐流等待就绪期间锁定暂停");
        num += 1;
        if (!flag || !(num >= Math.min(4, value3))) {
          if (num >= value3) {
            return {
              success: false,
              ready: false,
              reason: "feed_player_not_ready",
              waitedMs: Date.now() - result2,
              scopeFound: flag,
              playing: false,
              href: String(window.location.href || "")
            };
          }
          await sleep(value2 ? 220 : 350);
          continue;
        }
      }
      value4 = (typeof getDouyinFeedScope === "function" ? getDouyinFeedScope() : null) || value4 || document;
      flag = value4 !== document;
      pauseVisibleDouyinVideos(value4, "线索采集：推荐流进入后立即暂停");
      try {
        lockFeedLeadVideoUrl?.(value4);
      } catch (error) {}
      try {
        ensureLeadgenScrapeApiHook?.({
          force: true
        });
      } catch (error) {}
      fn5("线索采集：推荐流当前作品锁定暂停", {
        scope: value4,
        isFeedPlayback: true,
        intervalMs: 250,
        loopId: text,
        reuseActive: true
      });
      const local2 = state.lockedFeedIdentity || getFeedVideoIdentity?.(value4) || "";
      const value6 = typeof pickLeadVideoUrl === "function" ? pickLeadVideoUrl(state.lockedLeadVideoUrl || local2, value4) : state.lockedLeadVideoUrl || "";
      let local3 = value6 || captureFeedVideoShareUrl?.(value4) || resolveCurrentVisibleVideoUrl?.("", value4) || "";
      let local4 = extractSpecificVideoId(local3) || extractVideoIdFromHref(local3) || extractSpecificVideoId(local2) || "";
      if (!local3 && local4) {
        local3 = "https://www.douyin.com/video/" + local4;
      }
      if (!local4 && !local3) {
        await sleep(value2 ? 220 : 350);
        continue;
      }
      const value7 = value && typeof waitAndCaptureCurrentVideoMetadata === "function" ? await waitAndCaptureCurrentVideoMetadata(value4, local3, text, {
        requireAuthor: true,
        requireAuthorUrl: true,
        maxWaitMs: value2 ? 1800 : 4500
      }) : typeof captureCurrentVideoMetadata === "function" ? captureCurrentVideoMetadata(value4, local3) : {
        title: value5,
        authorNickname: "",
        authorUrl: "",
        stats: {}
      };
      if (value && !normalizeDouyinAuthorProfileUrl(value7?.authorUrl || "") && local3) {
        try {
          const result = await waitLeadgenScrapeAwemeAuthor(local3, value2 ? 800 : 1600);
          if (result?.authorUrl) {
            value7.authorUrl = result.authorUrl;
            if (result.authorNickname) {
              value7.authorNickname = result.authorNickname;
            }
            if (result.title && (!value7.title || value7.title === "未知视频")) {
              value7.title = result.title;
            }
            value7.fromApi = true;
          }
        } catch (error) {}
      }
      const local5 = local4 || extractSpecificVideoId(local3) || "";
      const result = String(value7?.title || value5 || "").trim();
      const result3 = String(value7?.authorNickname || "").trim().replace(/^@+/, "");
      if (local5 || result && result !== "未知视频" && (flag2 || flag) && local3) {
        const local = value7?.stats || {};
        const local4 = local5 || extractSpecificVideoId(getFeedVideoIdentity?.(value4) || "") || "";
        const local6 = local3 || (local4 ? "https://www.douyin.com/video/" + local4 : "");
        if (!local4 && !local6) {
          await sleep(value2 ? 220 : 350);
          continue;
        }
        return {
          success: true,
          ready: true,
          live: false,
          identity: getFeedVideoIdentity?.(value4) || local2 || "video:" + local4,
          videoId: local4,
          videoUrl: local6,
          title: result,
          authorNickname: result3,
          authorUrl: String(value7?.authorUrl || "").trim(),
          likeCount: Number(local.likes) || 0,
          commentCount: Number(local.comments) || 0,
          collectCount: Number(local.collects) || 0,
          shareCount: Number(local.shares) || 0,
          fromApi: !!value7?.fromApi,
          waitedMs: Date.now() - result2
        };
      }
      await sleep(value2 ? 220 : 350);
    }
    return {
      success: false,
      ready: false,
      reason: "feed_video_not_ready",
      waitedMs: Date.now() - result2,
      scopeFound: flag,
      playing: flag2,
      href: String(window.location.href || "")
    };
  }
  async function runEntityLeadgenInspectRecommendVideo(options = {}) {
    const {
      requestId: requestId,
      taskId = ""
    } = options;
    const local = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: requestId,
          taskId: taskId,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      fn13(options);
      const value = options.quietReady === true;
      let flag = false;
      const value2 = value ? null : setTimeout(() => {
        flag = true;
        fn4({
          message: "推荐页：正在等待当前作品画面就绪…",
          level: "info"
        });
      }, 1500);
      const result = await fn89(options);
      try {
        if (value2) {
          clearTimeout(value2);
        }
      } catch (error) {}
      if (result?.ready && !result?.live) {
        const result2 = String(result.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
        const result3 = String(result.authorNickname || "").trim();
        fn4({
          message: "推荐页：已识别当前作品" + (result3 ? " 作者「" + result3 + "」" : "") + (result2 ? "《" + result2 + "》" : "") + (result.videoId ? " id=" + result.videoId : "") + (result.fromApi ? "（API）" : ""),
          level: "success"
        });
      } else if (flag && !result?.ready) {
        fn4({
          message: "推荐页：当前作品画面仍未就绪",
          level: "warning"
        });
      }
      local(result);
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true
        });
        return;
      }
      local({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  function fn91(options = {}, options2 = {}) {
    if (!options2 || !options2.ready) {
      return false;
    }
    if (options2.live) {
      return true;
    }
    const result = String(options.videoId || "").trim();
    const result2 = String(options2.videoId || "").trim();
    if (result && result2 && result !== result2) {
      return true;
    }
    const result3 = String(options.identity || "").trim();
    const result4 = String(options2.identity || "").trim();
    if (result3 && result4 && result3 !== result4) {
      return true;
    }
    const result5 = String(options.title || "").trim();
    const result6 = String(options2.title || "").trim();
    if (result5 && result6 && result6 !== "未知视频" && result5 !== result6) {
      return true;
    }
    return false;
  }
  async function runEntityLeadgenMoveNextRecommendVideo(options = {}) {
    const {
      requestId: requestId,
      taskId = "",
      skipLive = false
    } = options;
    const local = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: requestId,
          taskId: taskId,
          ...arg1
        });
      } catch (error) {}
    };
    const text = "ENTITY_LEADGEN_RECOMMEND";
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      fn13(options);
      fn8();
      const local2 = getDouyinFeedScope?.() || document;
      const result = String(options.previousIdentity || getFeedVideoIdentity?.(local2) || "");
      const result2 = String(options.previousTitle || (typeof getVideoTitle === "function" ? getVideoTitle(local2) : "") || "");
      const result3 = String(options.previousAuthor || "").trim().replace(/^@+/, "");
      const result4 = String(options.previousVideoUrl || "").trim();
      const result5 = String(options.previousVideoId || extractSpecificVideoId(result4) || extractSpecificVideoId(result) || "").trim();
      const obj = {
        identity: result,
        title: result2,
        videoId: result5,
        videoUrl: result4
      };
      if (skipLive || isDouyinFeedLiveStream(local2) || hasFeedLiveEnterHint() || isDouyinLiveStreamTitle(result2)) {
        fn4({
          message: "推荐页：画面检测到直播间，正在切换下一条…",
          level: "info"
        });
        await skipDouyinFeedLiveStream(text);
        const result = await fn89({
          wantAuthor: false,
          maxWaitMs: 4000,
          lightCapture: true
        });
        const local2 = fn91(obj, result) || result?.ready && !result?.live;
        if (local2 && result?.ready) {
          fn5("线索采集：跳过直播后锁定下一条", {
            scope: getDouyinFeedScope?.() || document,
            isFeedPlayback: true,
            intervalMs: 250,
            loopId: text,
            reuseActive: true
          });
          fn4({
            message: result.live ? "推荐页：仍落在直播预览，将继续跳过" : "推荐页：直播间已跳过，下一条画面已稳定",
            level: "info"
          });
        }
        local({
          success: !!local2,
          continued: !!local2,
          skippedLive: true,
          identity: result?.identity || "",
          videoId: result?.videoId || "",
          videoUrl: result?.videoUrl || "",
          title: result?.title || "",
          live: !!result?.live,
          reason: local2 ? "" : "live_skip_not_moved",
          nextSnapshot: result?.ready ? result : null
        });
        return;
      }
      fn4({
        message: "推荐页：正在切换下一条作品…",
        level: "info"
      });
      await moveToNextVideo(text);
      let result6 = await awaitFeedVideoSwitchSettled(text, {
        previousIdentity: result,
        previousTitle: result2,
        previousAuthor: result3,
        leadVideoUrl: result4 || (result5 ? "https://www.douyin.com/video/" + result5 : ""),
        dedupKey: result5,
        phaseLabel: "线索采集推荐页切条",
        preferredScope: local2,
        quietTrace: true,
        acceptTitleOnlySwitch: true
      });
      let result7 = await fn89({
        wantAuthor: false,
        maxWaitMs: result6 ? 2500 : 3500,
        lightCapture: true
      });
      if (!result6 && fn91(obj, result7)) {
        result6 = true;
      }
      if (result6) {
        fn5("线索采集：切条后锁定下一条作品", {
          scope: getDouyinFeedScope?.() || document,
          isFeedPlayback: true,
          intervalMs: 250,
          loopId: text,
          reuseActive: true
        });
        const result = String(result7?.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
        fn4({
          message: result7?.live ? "推荐页：已切到直播预览，准备跳过" : "推荐页：已切换到下一条" + (result ? "「" + result + "」" : "") + "，画面已稳定",
          level: "info"
        });
      }
      local({
        success: !!result6,
        continued: !!result6,
        identity: result7?.identity || getFeedVideoIdentity?.(getDouyinFeedScope?.() || document) || "",
        videoId: result7?.videoId || "",
        videoUrl: result7?.videoUrl || "",
        title: result7?.title || "",
        live: !!result7?.live,
        reason: result6 ? "" : "feed_switch_not_settled",
        nextSnapshot: result7?.ready ? result7 : null,
        verifiedBySnapshot: !!result6 && !!result7?.ready
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true
        });
        return;
      }
      local({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runEntityLeadgenMoveNextSearchVideo(options = {}) {
    const value = options.requestId;
    const local = options.taskId || "";
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: local,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const text = "ENTITY_LEADGEN";
      const value = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) : null;
      if (!value || !isVisibleElement(value)) {
        local2({
          success: false,
          continued: false,
          reason: "no_modal"
        });
        return;
      }
      fn4({
        taskId: local,
        message: "正在弹层内切换下一条视频…",
        level: "info"
      });
      const value2 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl("", value || document) || "" : "";
      const value3 = typeof getFeedVideoIdentity === "function" ? getFeedVideoIdentity(getDouyinFeedScope?.() || value) || "" : "";
      const value4 = typeof getVideoTitle === "function" ? String(getVideoTitle() || "") : "";
      const result = (() => {
        try {
          const value = typeof getVideoAuthorInfo === "function" ? getVideoAuthorInfo() : null;
          return String(value?.nickname || value?.name || "").trim();
        } catch (error) {
          return "";
        }
      })();
      const value5 = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(value2) || extractSpecificVideoId(window.location.href) || "" : "";
      await moveToNextVideo(text);
      let flag = false;
      if (typeof awaitFeedVideoSwitchSettled === "function") {
        flag = await awaitFeedVideoSwitchSettled(text, {
          previousIdentity: value3,
          previousTitle: value4,
          previousAuthor: result,
          leadVideoUrl: value2,
          phaseLabel: "线索采集切条",
          requireDistinctVideoId: true
        });
      } else {
        await sleep(1800);
        const value2 = typeof getFeedVideoIdentity === "function" ? getFeedVideoIdentity(getDouyinFeedScope?.() || value) || "" : "";
        flag = !!value2 && value2 !== value3;
      }
      fn5("线索采集：切条后锁定暂停");
      const value6 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl("", value || document) || "" : "";
      const value7 = typeof extractSpecificVideoId === "function" ? extractSpecificVideoId(value6) || extractSpecificVideoId(window.location.href) || "" : "";
      const local3 = !!value5 && !!value7 && String(value5) === String(value7);
      if (flag && local3) {
        flag = false;
      }
      local2({
        success: !!flag,
        continued: !!flag,
        videoUrl: value6,
        reason: flag ? "" : local3 ? "same_video" : "switch_failed"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local2({
          success: false,
          cancelled: true
        });
        return;
      }
      local2({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runEntityLeadgenScrapePage(options = {}) {
    const value = options.requestId;
    const value2 = options.taskId;
    const result = String(options.sourceType || "").trim();
    if (result === "live") {
      await fn85(options);
      return;
    }
    const result2 = String(options.searchKeyword || "").trim();
    const value3 = options.generation != null ? Number(options.generation) : null;
    const local = ++num;
    const value4 = Number(options.maxCollect) > 0 ? Math.floor(Number(options.maxCollect)) : 0;
    const set = new Set(Array.isArray(options.seenKeys) ? options.seenKeys.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : []);
    const list = [];
    obj = {
      taskId: value2 || "",
      accountId: options.accountId || "",
      accountName: options.accountName || options.nickname || "",
      generation: value3,
      skipIngest: !!options.skipIngest,
      sourceType: result
    };
    try {
      const result = String(options.accountId || "").trim();
      if (result) {
        window._radar_account_id = result;
        sessionStorage.setItem("radar_account_id", result);
      }
    } catch (error) {}
    const local2 = arg1 => {
      try {
        ipcRenderer.send("entity-leadgen-collect-result", {
          requestId: value,
          taskId: value2,
          generation: value3,
          ...arg1
        });
      } catch (error) {}
    };
    try {
      window._radar_account_id = options.accountId;
      window._radar_account_name = options.accountName || options.nickname || "";
      ensureEntityApiHook();
      fn59();
      const result3 = (() => {
        const local = result2;
        if (!local) {
          return result;
        }
        if (/^https?:\/\//i.test(local) || /douyin\.com|modal_id=/i.test(local)) {
          return result;
        }
        return result + "「" + local + "」";
      })();
      fn4({
        sourceType: result,
        message: "页面采集开始：" + result3,
        level: "info"
      });
      if (result === "comment") {
        fn5("线索采集：进入视频后立即暂停");
        fn4({
          taskId: value2,
          message: "已暂停播放，防止自动跳转到下一条",
          level: "info"
        });
      }
      const value = result === "comment" ? 350 + Math.random() * 350 : 1800 + Math.random() * 800;
      if (!(await fn6(value, local))) {
        local2({
          success: false,
          cancelled: true,
          users: list
        });
        return;
      }
      ensureEntityApiHook();
      if (result === "comment") {
        fn5("线索采集：页面就绪后再次锁定暂停");
      }
      const result4 = await fn39(local);
      if (result4 > 0) {
        fn4({
          taskId: value2,
          message: "已关闭登录弹窗 ×" + result4,
          level: "info"
        });
        if (!(await fn6(800 + Math.random() * 600, local))) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
      }
      if (result === "user") {
        const result = await fn31(local);
        if (!result) {
          fn4({
            taskId: value2,
            message: "搜索用户" + (result2 ? "「" + result2 + "」" : "") + "：页面暂未准备完成",
            level: "warning"
          });
        } else if (!(await fn6(1800 + Math.random() * 800, local))) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
        await fn40(local, value2, {
          userFanCount: options.userFanCount,
          userTypeFilter: options.userTypeFilter,
          accountId: options.accountId || ""
        });
        if (local !== num) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
      }
      if (result === "mutual" || result === "following") {
        const value = result === "following" ? "关注列表" : "相互关注";
        const value3 = result === "following" ? "following" : "fans";
        const value4 = value3 === "following" ? "关注" : "粉丝";
        window.__radar_entity_mutual_filter_active = false;
        window.__radar_entity_following_list_active = false;
        await fn65(local, 8000, value3);
        const value5 = value3 === "following" ? fn66() : fn67();
        if (!value5) {
          fn4({
            taskId: value2,
            message: value + "：未找到主页「" + value4 + "」入口（可能未登录）",
            level: "warning"
          });
          local2({
            success: true,
            users: [],
            message: "未找到主页" + value4 + "入口"
          });
          return;
        }
        await simulateHumanClick(value5, null);
        try {
          if (value5.click) {
            value5.click();
          }
          const local = value5.querySelector?.("div, span");
          if (local && local.click) {
            local.click();
          }
        } catch (error) {}
        fn4({
          taskId: value2,
          message: value + "：已点击主页「" + value4 + "」，正在打开关系列表",
          level: "info"
        });
        if (!(await fn69(local, 9000))) {
          fn4({
            taskId: value2,
            message: value + "：关系列表未能打开",
            level: "warning"
          });
          local2({
            success: true,
            users: [],
            message: "关系列表未能打开"
          });
          return;
        }
        if (!(await fn6(800 + Math.random() * 500, local))) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
        const result2 = fn71();
        if (result2) {
          fn16();
          fn4({
            taskId: value2,
            accountId: options.accountId || "",
            sourceType: result,
            resetNetworkCapture: true
          });
          await simulateHumanClick(result2, null);
          if (result === "mutual") {
            window.__radar_entity_mutual_filter_active = true;
            window.__radar_entity_following_list_active = false;
            fn4({
              taskId: value2,
              message: "相互关注：已切换到关注列表（将筛选其中的互关用户）",
              level: "info"
            });
          } else {
            window.__radar_entity_mutual_filter_active = false;
            window.__radar_entity_following_list_active = true;
            fn4({
              taskId: value2,
              message: "关注列表：已在关注 Tab，将采集全部关注用户",
              level: "info"
            });
          }
          if (!(await fn6(1800 + Math.random() * 1000, local))) {
            local2({
              success: false,
              cancelled: true,
              users: list
            });
            return;
          }
        } else if (result === "mutual") {
          window.__radar_entity_mutual_filter_active = true;
          fn4({
            taskId: value2,
            message: "相互关注：未找到关注Tab，将在粉丝列表中按followStatus筛选互关用户",
            level: "info"
          });
        } else {
          window.__radar_entity_following_list_active = true;
          fn4({
            taskId: value2,
            message: "关注列表：当前已是关注关系列表，开始采集",
            level: "info"
          });
        }
      }
      if (result === "video" && /\/search\//i.test(String(window.location.href || ""))) {
        const result = await fn38(local, value2, options);
        if (result?.cancelled || local !== num) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
        if (result?.applied && !result?.skipped) {
          fn16();
          try {
            if (typeof clearLeadgenScrapeAwemeCache === "function") {
              clearLeadgenScrapeAwemeCache("after-official-search-filters");
            }
          } catch (error) {}
          try {
            ensureLeadgenScrapeApiHook({
              force: true
            });
            ensureLeadgenScrapeApiBridge();
          } catch (error) {}
          fn4({
            taskId: value2,
            accountId: options.accountId || "",
            sourceType: "video",
            resetNetworkCapture: true
          });
        }
      }
      if (result === "blogger" || result === "user" || result === "video") {
        await fn41(local, value2, {
          sourceType: result,
          maxWaitMs: 20000
        });
      }
      const result5 = String(options.userFanCount || "0");
      const result6 = String(options.userTypeFilter || "0");
      if (result === "user") {
        window.__radar_entity_user_fan_count = result5;
        fn35(result5, result6);
      }
      const result7 = collectEntityUsersFromApiBuffer(result, {
        userFanCount: result5
      });
      if (result7.length) {
        const result = result7.slice(0, 3).map(arg1 => "@" + arg1.nickname + " " + fn20(arg1.followerCount) + "粉").join("、");
        const result2 = fn18(result5);
        fn4({
          taskId: value2,
          message: "首批已获取 " + result7.length + " 个用户" + (result2 ? "（已按粉丝「" + result2.label + "」本地校验）" : "") + (result ? "，样例：" + result : "") + "，继续加载更多",
          level: "info"
        });
      } else if (result !== "comment") {
        fn4({
          taskId: value2,
          message: "正在加载并采集搜索结果…",
          level: "info"
        });
      }
      if (result === "comment") {
        const result = String(options.targetVideoUrl || options.searchKeyword || "").trim();
        const flag = !!options.alreadyOnCurrentVideo;
        const value = flag ? {
          allowFeed: true
        } : {};
        fn5("线索采集：评论采集期间持续暂停");
        fn9(result);
        if (flag) {
          if (!fn2(result, value)) {
            fn4({
              taskId: value2,
              message: "当前推荐作品画面未就绪，跳过本条评论区",
              level: "warning"
            });
            local2({
              success: false,
              videoNotReady: true,
              users: list,
              message: "当前作品未就绪"
            });
            return;
          }
          fn4({
            taskId: value2,
            message: "已在当前作品，开始打开评论区…",
            level: "info"
          });
        } else {
          const result2 = await fn7(local, value2, result, 20000);
          if (result2.cancelled || local !== num) {
            local2({
              success: false,
              cancelled: true,
              users: list
            });
            return;
          }
          if (result2.status === "unavailable") {
            const value = typeof describeSpecificVideoSkipReason === "function" ? describeSpecificVideoSkipReason(result2.reason || "unavailable") : {
              title: "视频失效",
              detail: "视频不存在或无法观看，已跳过"
            };
            fn4({
              taskId: value2,
              message: "视频失效：" + (value.detail || value.title || "视频不存在或无法观看，已跳过"),
              level: "warning"
            });
            local2({
              success: true,
              videoUnavailable: true,
              unavailableReason: result2.reason || "unavailable",
              users: [],
              message: "视频失效已跳过"
            });
            return;
          }
          if (result2.status !== "ready") {
            fn4({
              taskId: value2,
              message: "页面未进入指定视频（可能卡住），将重新打开",
              level: "warning"
            });
            local2({
              success: false,
              needReload: true,
              videoNotReady: true,
              users: list,
              message: "视频页未就绪"
            });
            return;
          }
        }
        const result3 = fn46(document.body);
        if (result3.nickname) {
          fn4({
            taskId: value2,
            message: "当前视频作者 @" + result3.nickname + "，将自动过滤其评论",
            level: "info"
          });
        }
        const result4 = await fn51(local, value2);
        if (result4.cancelled || local !== num) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
        pauseVisibleDouyinVideos(fn(), "线索采集：评论区打开后再次锁定暂停");
        const value3 = flag ? true : fn2(result, value);
        const local3 = !!result4.notOnVideo || !!result4.badgeOnly || !!result4.slow && !result4.empty || !result4.opened;
        if (!flag && !value3 || local3) {
          fn4({
            taskId: value2,
            message: flag ? result4.badgeOnly ? "评论角标有数量但评论列表未打开，跳过本条" : "评论区未能真正打开，跳过本条" : !value3 ? "页面仍未落到指定视频，将重新打开" : result4.badgeOnly ? "评论角标有数量但评论列表未打开，将重新进入视频" : "评论区未能真正打开，将重新进入视频",
            level: "warning"
          });
          local2({
            success: false,
            needReload: !flag,
            videoNotReady: !value3,
            users: list,
            message: flag ? "评论区未就绪" : "评论区未就绪，需重新进入视频"
          });
          return;
        }
        if (result4.empty) {
          fn4({
            taskId: value2,
            message: "该视频确认暂无评论，跳过",
            level: "info"
          });
          local2({
            success: true,
            users: [],
            message: "暂无评论"
          });
          return;
        }
        fn4({
          taskId: value2,
          message: "评论区已就绪（可见评论 " + (Number(result4.visibleItemCount) || 0) + " 条），开始采集潜客（含评论内容）…",
          level: "info"
        });
        const local4 = options.commentFilters || null;
        try {
          const result = fn47();
          const local = result?.formatEntityCommentFiltersSummary?.(local4 || {});
          if (local && local !== "不限") {
            fn4({
              taskId: value2,
              message: "已启用评论筛选：" + local,
              level: "info"
            });
          }
        } catch (error) {}
        let local5 = null;
        try {
          local5 = typeof getCommentsTotalCount === "function" ? getCommentsTotalCount(document.body) : null;
        } catch (error) {}
        const result5 = (() => {
          try {
            const value = typeof getVideoTitle === "function" ? String(getVideoTitle() || "").trim() : "";
            if (value && value !== "未知视频") {
              return value;
            } else {
              return "";
            }
          } catch (error) {
            return "";
          }
        })();
        const result6 = await fn52({
          token: local,
          taskId: value2,
          searchKeyword: result2,
          seenKeys: set,
          collectedUsers: list,
          maxCollect: value4,
          authorFilter: result3,
          initialPageTotal: local5,
          commentFilters: local4,
          targetVideoUrl: result,
          sourceVideoTitle: result5,
          videoTitle: result5,
          progressLabel: (() => {
            const result = String(result2 || "").trim();
            if (!result || /^https?:\/\//i.test(result) || /douyin\.com|modal_id=/i.test(result)) {
              return "视频评论区潜客";
            }
            return "视频评论区潜客「" + result + "」";
          })()
        });
        try {
          const result2 = (() => {
            try {
              const result2 = getProcessedVideoKeyModule();
              return result2?.canonicalizeDouyinVideoUrl?.(result) || result2?.normalizeProcessedVideoKey?.(result) || "";
            } catch (error) {
              return String(result || "").trim();
            }
          })();
          const local = result5 || (() => {
            try {
              const value = typeof getVideoTitle === "function" ? String(getVideoTitle() || "").trim() : "";
              if (value && value !== "未知视频") {
                return value;
              } else {
                return "";
              }
            } catch (error) {
              return "";
            }
          })();
          for (const item of list) {
            if (!item || typeof item !== "object") {
              continue;
            }
            if (!item.videoUrl && result2) {
              item.videoUrl = result2;
            }
            if ((!item.title || item.title === "未知视频") && local) {
              item.title = local;
              item.sourceVideoTitle = local;
            } else if (!item.sourceVideoTitle && (item.title || local)) {
              item.sourceVideoTitle = item.title || local;
            }
          }
        } catch (error) {}
        if (result6.cancelled || local !== num) {
          local2({
            success: false,
            cancelled: true,
            users: list
          });
          return;
        }
        if (result6.needReload || result6.drifted || result6.panelNotOpen) {
          fn4({
            taskId: value2,
            message: result6.panelNotOpen ? "采集过程中评论区未真正打开，将重新进入指定视频" : "采集过程中滑到了其他视频，将重新进入指定视频",
            level: "warning"
          });
          local2({
            success: false,
            needReload: true,
            videoNotReady: true,
            users: list,
            message: result6.panelNotOpen ? "评论区未打开" : "采集中视频漂移"
          });
          return;
        }
        local2({
          success: true,
          users: list,
          message: "本页采集 " + list.length + " 个评论潜客",
          reachedLimit: !!result6.reachedLimit
        });
        fn16();
        return;
      }
      const value3 = result === "blogger" ? fn64 : result === "user" ? () => fn43({
        userFanCount: result5
      }) : result === "mutual" || result === "following" ? () => fn77(result) : result === "video" ? fn58 : () => fn43({
        userFanCount: result5
      });
      if (result === "video") {
        try {
          ensureLeadgenScrapeApiHook({
            force: true
          });
          ensureLeadgenScrapeApiBridge();
        } catch (error) {}
        await fn6(600 + Math.random() * 400, local);
      }
      const local3 = result === "mutual" || result === "following";
      const result8 = await fn84({
        token: local,
        taskId: value2,
        gatherFn: value3,
        sourceType: result,
        searchKeyword: result2,
        seenKeys: set,
        collectedUsers: list,
        maxCollect: value4,
        emptyLimit: local3 ? 8 : result === "video" ? getVideoSearchScrapePolicyModule()?.ENTITY_VIDEO_SEARCH_EMPTY_LIMIT || 12 : 3,
        maxRounds: local3 ? 150 : result === "video" ? getVideoSearchScrapePolicyModule()?.ENTITY_VIDEO_SEARCH_MAX_ROUNDS || 200 : 100,
        progressLabel: result === "blogger" ? "视频博主" + (result2 ? "「" + result2 + "」" : "") : result === "user" ? "搜索用户" + (result2 ? "「" + result2 + "」" : "") : result === "video" ? "搜索视频" + (result2 ? "「" + result2 + "」" : "") : result === "following" ? "关注列表" : "相互关注"
      });
      if (result8.cancelled || local !== num) {
        local2({
          success: false,
          cancelled: true,
          users: list
        });
        return;
      }
      local2({
        success: true,
        users: list,
        message: "本页采集 " + list.length + " 个用户",
        reachedLimit: !!result8.reachedLimit
      });
      fn16();
    } catch (error) {
      local2({
        success: false,
        error: error?.message || String(error),
        users: list
      });
      fn16();
    } finally {
      if (local === num) {
        fn60();
      }
      fn8();
      fn10();
    }
  }
  function cancelEntityLeadgenCollect() {
    num += 1;
    fn60();
    fn8();
    fn10();
    fn16();
  }
  return {
    buildEntityCommentScraperDeps: buildEntityCommentScraperDeps,
    dismissEntityLoginPopupsCore: dismissEntityLoginPopupsCore,
    ensureEntityApiBridge: ensureEntityApiBridge,
    ensureEntityApiHook: ensureEntityApiHook,
    ensureEntityLiveHook: ensureEntityLiveHook,
    getEntityCommentScraperModule: getEntityCommentScraperModule,
    installEntityFeedSwipeLock: fn9,
    isActive: () => !!obj.taskId,
    removeEntityFeedSwipeLock: fn10,
    runEntityLeadgenScrapePage: runEntityLeadgenScrapePage,
    runEntityLeadgenOpenFirstSearchVideo: runEntityLeadgenOpenFirstSearchVideo,
    runEntityLeadgenOpenSearchVideo: runEntityLeadgenOpenSearchVideo,
    runEntityLeadgenWaitVideoReady: runEntityLeadgenWaitVideoReady,
    runEntityLeadgenInspectRecommendVideo: runEntityLeadgenInspectRecommendVideo,
    runEntityLeadgenMoveNextRecommendVideo: runEntityLeadgenMoveNextRecommendVideo,
    runEntityLeadgenMoveNextSearchVideo: runEntityLeadgenMoveNextSearchVideo,
    cancelEntityLeadgenCollect: cancelEntityLeadgenCollect
  };
}
module.exports = {
  createEntityLeadgenController: createEntityLeadgenController
};
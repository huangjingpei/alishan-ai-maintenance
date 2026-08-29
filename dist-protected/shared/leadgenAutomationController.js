function createLeadgenAutomationController(options = {}) {
  const {
    DOUYIN_LIKE_ENTRY_URL: douyinLikeEntryUrl,
    DOUYIN_RECOMMEND_URL: douyinRecommendUrl,
    getDouyinLikeEntryUrl: getDouyinLikeEntryUrl,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    Infinity: infinity,
    PLATFORM_SELECTORS: platformSelectors,
    SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER: searchCardOpenFailureSkipAfter,
    SEARCH_CARD_OPEN_STUCK_RELOAD_AFTER: searchCardOpenStuckReloadAfter,
    SEARCH_ZERO_CARD_MAX_RELOADS: searchZeroCardMaxReloads,
    SEARCH_ZERO_CARD_SCANS_BEFORE_RELOAD: searchZeroCardScansBeforeReload,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: specificVideoLoadTimeoutMs,
    SPECIFIC_VIDEO_NAV_MISS_MAX: specificVideoNavMissMax,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: specificVideoOpenRetryMax,
    WeakSet: weakSet,
    abortAutomationStartup: abortAutomationStartup,
    advanceAfterSearchQueuedVideo: advanceAfterSearchQueuedVideo,
    aggressiveCommentListScroll: aggressiveCommentListScroll,
    applySearchFilters: applySearchFilters,
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    awaitInteractionCooldown: awaitInteractionCooldown,
    awaitPostActionRest: awaitPostActionRest,
    awaitSearchPageLoginGate: awaitSearchPageLoginGate,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    awaitSpecificVideoOpenSettle: awaitSpecificVideoOpenSettle,
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    buildVideoCardLead: buildVideoCardLead,
    burstPauseWithinOneSecond: burstPauseWithinOneSecond,
    canLinkOnlyScrapeWithoutOpen: canLinkOnlyScrapeWithoutOpen,
    captureCurrentVideoMetadata: captureCurrentVideoMetadata,
    clearClaimedSpecificVideoUrl: clearClaimedSpecificVideoUrl,
    clearPendingLeadVideoUrl: clearPendingLeadVideoUrl,
    clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
    clearSearchSlideOscillationState: clearSearchSlideOscillationState,
    clearSearchVideoUrlQueue: clearSearchVideoUrlQueue,
    clearSearchZeroCardRecoveryState: clearSearchZeroCardRecoveryState,
    clearSearchZeroCardRecoveryStatesForLoop: clearSearchZeroCardRecoveryStatesForLoop,
    clearVideoLocalQuotaExhaustedFlag: clearVideoLocalQuotaExhaustedFlag,
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    collectDouyinSearchResultCards: collectDouyinSearchResultCards,
    collectLikedVideos: collectLikedVideos,
    collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
    consumeTaskRestartFlag: consumeTaskRestartFlag,
    decodeURIComponent: decodeURIComponent,
    describeTaskAbortReason: describeTaskAbortReason,
    emitLinkOnlyScrapeLead: emitLinkOnlyScrapeLead,
    emitVideoCardLead: emitVideoCardLead,
    ensureClaimedSpecificVideoUrl: ensureClaimedSpecificVideoUrl,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureCurrentSourcePage: ensureCurrentSourcePage,
    ensureDouyinRecommendFeed: ensureDouyinRecommendFeed,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    evaluateSpecificVideoOpenProgress: evaluateSpecificVideoOpenProgress,
    expandReplies: expandReplies,
    extractLeads: extractLeads,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    finalizeAccountTask: finalizeAccountTask,
    findCommentScrollContainer: findCommentScrollContainer,
    findNextUnprocessedSearchQueueUrl: findNextUnprocessedSearchQueueUrl,
    findProfileVideoCards: findProfileVideoCards,
    finishSpecificSourceTask: finishSpecificSourceTask,
    formatScrapeCommentScrollAction: formatScrapeCommentScrollAction,
    getAdaptiveCommentWaitRange: getAdaptiveCommentWaitRange,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getCurrentContentPauseProfile: getCurrentContentPauseProfile,
    getCurrentVideoGuardState: getCurrentVideoGuardState,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinLikeEntryState: getDouyinLikeEntryState,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getDouyinSearchCardRoot: getDouyinSearchCardRoot,
    getDouyinSearchZeroCardWaitBudgetMs: getDouyinSearchZeroCardWaitBudgetMs,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getIncludeTitleKeywordMatch: getIncludeTitleKeywordMatch,
    getPlannedVideoCountForDisplay: getPlannedVideoCountForDisplay,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getScrapeNoCompliantTolerance: getScrapeNoCompliantTolerance,
    getScrapeNoNewDataTolerance: getScrapeNoNewDataTolerance,
    getScrapeTargetSet: getScrapeTargetSet,
    getSpecificPlannedVideoCount: getSpecificPlannedVideoCount,
    getSpecificVideoUrlList: getSpecificVideoUrlList,
    getVideoSearchCollectionEngineModule: getVideoSearchCollectionEngineModule,
    getVideoTitle: getVideoTitle,
    getVisibleCommentNodeCount: getVisibleCommentNodeCount,
    getVisibleCommentViewportFingerprint: getVisibleCommentViewportFingerprint,
    guardedCurrentVideoDelay: guardedCurrentVideoDelay,
    guardedPauseDelay: guardedPauseDelay,
    hasVideoMainCommented: hasVideoMainCommented,
    initProcessedVideosFromTask: initProcessedVideosFromTask,
    initVideoMainCommentMemoryFromTask: initVideoMainCommentMemoryFromTask,
    ipcRenderer: ipcRenderer,
    isCommentPanelEmptyHint: isCommentPanelEmptyHint,
    isCurrentTaskUsingProxy: isCurrentTaskUsingProxy,
    isCurrentVideoPauseGuardDrifted: isCurrentVideoPauseGuardDrifted,
    isDouyinFeedLiveStream: isDouyinFeedLiveStream,
    isDouyinFeedPlaying: isDouyinFeedPlaying,
    isDouyinJingxuanContentLoading: isDouyinJingxuanContentLoading,
    isDouyinNonVideoPageUrl: isDouyinNonVideoPageUrl,
    isDouyinSearchVideoTabUrl: isDouyinSearchVideoTabUrl,
    isDouyinVideoShareUrl: isDouyinVideoShareUrl,
    isFeedStyleSource: isFeedStyleSource,
    isInteractionLimitReached: isInteractionLimitReached,
    isLinkOnlyScrapeTask: isLinkOnlyScrapeTask,
    isOnDouyinRecommendPage: isOnDouyinRecommendPage,
    isOnSpecificTargetVideo: isOnSpecificTargetVideo,
    isSearchQueueUrlSessionDone: isSearchQueueUrlSessionDone,
    isSpecificVideoCompletedThisSession: isSpecificVideoCompletedThisSession,
    isVideoInSpecificList: isVideoInSpecificList,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    listLeadgenScrapeAwemes: listLeadgenScrapeAwemes,
    loadSpecificVideoState: loadSpecificVideoState,
    localStorage: localStorage,
    lockFeedLeadVideoUrl: lockFeedLeadVideoUrl,
    logTaskDbg: logTaskDbg,
    lookupLeadgenScrapeAweme: lookupLeadgenScrapeAweme,
    markSearchQueueUrlSkipped: markSearchQueueUrlSkipped,
    markSpecificVideoCompletedThisSession: markSpecificVideoCompletedThisSession,
    markSpecificVideoHandled: markSpecificVideoHandled,
    matchCurrentVideoForDy: matchCurrentVideoForDy,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    matchTitleKeywordList: matchTitleKeywordList,
    maybeReportDouyinSearchZeroDiagnostics: maybeReportDouyinSearchZeroDiagnostics,
    maybeTrimRuntimeMemory: maybeTrimRuntimeMemory,
    moveToNextVideo: moveToNextVideo,
    navigateToDouyinLikeEntry: navigateToDouyinLikeEntry,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    normalizeSpecificVideoKey: normalizeSpecificVideoKey,
    normalizeUrl: normalizeUrl,
    noteSearchSlideVideoKey: noteSearchSlideVideoKey,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    openSpecificVideoWithRetries: openSpecificVideoWithRetries,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    parseTitleKeywordList: parseTitleKeywordList,
    pauseSettleThenCaptureVideoMetadata: pauseSettleThenCaptureVideoMetadata,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    peekSearchPendingOpenUrl: peekSearchPendingOpenUrl,
    pickLeadVideoUrl: pickLeadVideoUrl,
    postVideoComment: postVideoComment,
    prefetchAiMainPostComment: prefetchAiMainPostComment,
    prepareSearchPageReload: prepareSearchPageReload,
    probeSpecificVideoOnDirectPage: probeSpecificVideoOnDirectPage,
    processScrapeAiQueue: processScrapeAiQueue,
    pruneSearchCardOpenFailures: pruneSearchCardOpenFailures,
    pruneStaleCommentDom: pruneStaleCommentDom,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    readRadarSessionState: readRadarSessionState,
    readSearchZeroCardRecoveryState: readSearchZeroCardRecoveryState,
    releaseAbandonedVideoClaim: releaseAbandonedVideoClaim,
    reloadCurrentFeedSource: reloadCurrentFeedSource,
    reloadCurrentSearchPageAfterOpenFailures: reloadCurrentSearchPageAfterOpenFailures,
    reloadRecommendFeedAfterSwitchStall: reloadRecommendFeedAfterSwitchStall,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    rememberSearchCardOpenFailure: rememberSearchCardOpenFailure,
    rememberSearchCardOpenSuccess: rememberSearchCardOpenSuccess,
    reportCommentFlowTrace: reportCommentFlowTrace,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resetSearchCardOpenFailureState: resetSearchCardOpenFailureState,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    resolveEffectiveCommentTotalCount: resolveEffectiveCommentTotalCount,
    resolveSearchCardScrapeFields: resolveSearchCardScrapeFields,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    saveCommentScrapeProgress: saveCommentScrapeProgress,
    saveSearchZeroCardRecoveryState: saveSearchZeroCardRecoveryState,
    saveSpecificVideoState: saveSpecificVideoState,
    scrollCommentList: scrollCommentList,
    sessionStorage: sessionStorage,
    setSearchPendingOpenUrl: setSearchPendingOpenUrl,
    shouldAbort: shouldAbort,
    shouldBypassSpecificBrowseDedup: shouldBypassSpecificBrowseDedup,
    shouldCollectScrapeVideoMetadata: shouldCollectScrapeVideoMetadata,
    shouldContinueScrapeAfterDuplicateWindow: shouldContinueScrapeAfterDuplicateWindow,
    shouldEnforceIncludeTitleKeywords: shouldEnforceIncludeTitleKeywords,
    shouldExpandFoldedCommentReplies: shouldExpandFoldedCommentReplies,
    shouldForceSelectByIncludeTitle: shouldForceSelectByIncludeTitle,
    shouldGenerateAiVideoMainPost: shouldGenerateAiVideoMainPost,
    shouldPrefetchMainPostWithVideoMatch: shouldPrefetchMainPostWithVideoMatch,
    shouldProbeIncompleteScrapeBoundary: shouldProbeIncompleteScrapeBoundary,
    shouldReprocessConfiguredSpecific: shouldReprocessConfiguredSpecific,
    shouldSkipSearchCardAfterOpenFailures: shouldSkipSearchCardAfterOpenFailures,
    shouldUsePersonaVideoFilter: shouldUsePersonaVideoFilter,
    shouldUseSearchVideoUrlQueue: shouldUseSearchVideoUrlQueue,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    skipDouyinFeedLiveStream: skipDouyinFeedLiveStream,
    skipFailedSpecificVideoAndOpenNext: skipFailedSpecificVideoAndOpenNext,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    syncEntryContext: syncEntryContext,
    syncSpecificVideoPauseWatcher: syncSpecificVideoPauseWatcher,
    usesSpecificVideoPool: usesSpecificVideoPool,
    waitAndCaptureCurrentVideoMetadata: waitAndCaptureCurrentVideoMetadata,
    waitForCommentDomWarmup: waitForCommentDomWarmup,
    waitForDouyinSearchContentAfterZero: waitForDouyinSearchContentAfterZero,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitSpecificVideoNavAppear: waitSpecificVideoNavAppear,
    state: state
  } = options;
  if (!state) {
    throw new TypeError("createLeadgenAutomationController requires a runtime state bridge");
  }
  const local = () => typeof getDouyinRecommendUrl === "function" ? getDouyinRecommendUrl() : douyinRecommendUrl;
  const local2 = () => typeof getDouyinLikeEntryUrl === "function" ? getDouyinLikeEntryUrl() : douyinLikeEntryUrl;
  async function fn(arg1, arg2) {
    if (await ensureCommentPanelOpen(arg1, arg2)) {
      return true;
    }
    const value = 10000 + Math.floor(Math.random() * 10001);
    const result = Math.round(value / 1000);
    reportCurrentAction("未识别到评论区已打开，等待 " + result + " 秒后再确认…");
    reportTraceLog("💬 首次打开评论区未识别到面板，等待 " + result + " 秒");
    const value2 = Date.now() + value;
    while (Date.now() < value2) {
      if (shouldAbort(arg2)) {
        return false;
      }
      await sleep(Math.min(1000, Math.max(0, value2 - Date.now())));
      if (typeof getVisibleCommentNodeCount === "function" && getVisibleCommentNodeCount(arg1) > 0) {
        reportCurrentAction("等待期间评论区已出现，继续处理");
        return true;
      }
    }
    reportCurrentAction("等待结束，再次打开评论区…");
    if (await ensureCommentPanelOpen(arg1, arg2)) {
      return true;
    }
    reportCurrentAction("评论区仍未打开，跳过本条，切换下一条…");
    reportTraceLog("💬 再次打开评论区仍未识别到面板，跳过本视频", null, "warning");
    return false;
  }
  async function startAutomation(arg1) {
    if (!state.currentTask) {
      return;
    }
    if (state.currentTask.taskMode === "nurture") {
      return;
    }
    try {
      ensureLeadgenScrapeApiHook({
        force: state.currentRunningSource === "search"
      });
    } catch (error) {}
    const result = consumeTaskRestartFlag();
    if (result) {
      clearSearchZeroCardRecoveryStatesForLoop(arg1);
      const local = Array.isArray(state.currentTask?.videoSources) && state.currentTask.videoSources.includes("specific") && String(state.currentTask?.specifiedUrls || "").trim().length > 0;
      if (local) {
        state.allowSpecificReprocess = true;
        reportTraceLog("🔄 重启：指定视频将重新分析（浏览库已解除；本账号已主评的视频不会重复发表评论）");
      }
    }
    const result2 = radarSessionKey(window._radar_account_id, arg1);
    const result3 = readRadarSessionState(window._radar_account_id, arg1, {
      migrateLegacy: true
    });
    const local3 = result3.loopId === arg1 && !result;
    state.processedVideos = initProcessedVideosFromTask(state.currentTask, {
      restart: result,
      resumeSpecific: local3
    });
    resetSearchCardOpenFailureState();
    initVideoMainCommentMemoryFromTask(state.currentTask);
    state.interactedInSession = new Set();
    state.scrapeAiQueue = [];
    try {
      if (result3.loopId === arg1 && Array.isArray(result3.seenUserKeys)) {
        result3.seenUserKeys.forEach(arg1 => state.interactedInSession.add(arg1));
        console.log("[Built-in-Debug] 恢复本会话已见用户 " + state.interactedInSession.size + " 个");
      }
    } catch (error) {}
    const value = Array.isArray(state.currentTask.videoSources) && state.currentTask.videoSources.length > 0 ? state.currentTask.videoSources : ["search"];
    let local4 = state.currentTask.keywords?.split(/[,，\s\n]+/).map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0) || [];
    const result4 = value.filter(arg1 => ["search", "follow", "recommend", "like", "specific"].includes(arg1) && (arg1 !== "search" || local4.length > 0) && (arg1 !== "specific" || (state.currentTask.specifiedUrls || "").trim().length > 0));
    if (state.currentTask.commentContent && !state.currentTask.replyTemplates) {
      state.currentTask.replyTemplates = state.currentTask.commentContent.split("\n").filter(arg1 => arg1.trim());
    }
    if (result4.length === 0) {
      console.warn("[Built-in-Debug] 未检测到可用的视频入口：搜索入口需要配置关键词");
      abortAutomationStartup(arg1, "未配置可用视频入口（勾选搜索时需填写关键词）");
      return;
    }
    if (value.includes("search") && local4.length === 0) {
      console.warn("[Built-in-Debug] 搜索入口未配置关键词，已自动跳过搜索入口");
    }
    const obj = {
      search: "搜索关键词",
      follow: "关注列表",
      recommend: "推荐页",
      like: "喜欢列表",
      specific: "指定视频"
    };
    console.log("[Built-in-Debug] 启动视频入口队列: " + result4.map(arg1 => obj[arg1] || arg1).join(" -> ") + (local4.length ? "；关键词: " + local4.join(" -> ") : ""));
    const value2 = window.location.href;
    const result5 = value2.includes("/search/");
    const result6 = radarSessionKey(window._radar_account_id, arg1);
    let local5 = result3;
    window._likedVideoUrls = local5.likedVideoUrls || [];
    window._searchVideoUrls = Array.isArray(local5.searchVideoUrls) ? local5.searchVideoUrls : [];
    window._searchVideoQueueKeyword = local5.searchVideoQueueKeyword || null;
    const local6 = !local5.loopId || local5.loopId !== arg1;
    if (!local6 && state.currentTask.useGlobalKeywordPool && local5.activeKeyword) {
      state.currentTask.keywords = local5.activeKeyword;
      local4 = state.currentTask.keywords.split(/[,，\s\n]+/).map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0);
    }
    logTaskDbg("会话", "loopId=" + arg1, {
      restart: result,
      resume: local3,
      savedLoopId: local5.loopId || null,
      url: clipTraceText(value2, 96)
    });
    const result7 = result4.join(",");
    let value3 = local6 ? 0 : Number.isInteger(local5.sIndex) ? local5.sIndex : 0;
    if (value3 >= result4.length) {
      value3 = 0;
    }
    let value4 = local6 ? 0 : Number.isInteger(local5.kIndex) ? local5.kIndex : 0;
    if (!local6 && local5.videoSourcesKey && local5.videoSourcesKey !== result7) {
      console.log("[Built-in-Debug] 视频入口配置已变化 (" + local5.videoSourcesKey + " -> " + result7 + ")，重置入口进度");
      value3 = 0;
      value4 = 0;
      state.sessionProcessedCount = 0;
      state.targetVideoCount = 0;
      num = 0;
      clearSearchVideoUrlQueue();
    }
    let value5 = result4[value3];
    state.currentRunningSource = value5;
    syncSpecificVideoPauseWatcher();
    if (value4 >= local4.length) {
      value4 = 0;
    }
    let text = "";
    if (result5) {
      const url = new URL(value2);
      const result = url.pathname.split("/");
      const value = result[result.indexOf("search") + 1];
      text = value ? decodeURIComponent(value) : "";
      for (let num = 0; num < local4.length; num++) {
        if (text === local4[num] || value2.includes(encodeURIComponent(local4[num]))) {
          value4 = num;
          break;
        }
      }
      if (text && local5.activeKeyword === text && value4 < local4.length && local4[value4] !== text) {
        const result = local4.indexOf(local5.activeKeyword);
        if (result >= 0) {
          value4 = result;
        } else if (state.currentTask.useGlobalKeywordPool) {
          local4 = [local5.activeKeyword];
          state.currentTask.keywords = local5.activeKeyword;
          value4 = 0;
        }
      }
    }
    const value6 = value5 === "search" ? local4[value4] : null;
    let local7 = value6;
    let num2 = 0;
    let num = 0;
    window._saveRadarState = () => {
      const obj = {
        loopId: arg1,
        leadgenTaskId: state.currentTask?.leadgenTaskId || null,
        updatedAt: Date.now(),
        videoSourcesKey: result7,
        sIndex: value3,
        kIndex: value4,
        activeKeyword: local7 || null,
        videoMin: state.currentTask?.videoMin,
        videoMax: state.currentTask?.videoMax,
        sessionProcessedCount: state.sessionProcessedCount,
        targetVideoCount: state.targetVideoCount,
        switchNoResponseStreak: num2,
        recommendSwitchRefreshCount: num,
        sessionInteractionCount: state.sessionInteractionCount,
        interactionLimit: state.sessionInteractionLimit,
        followCount: state.sessionFollowCount,
        followLimit: state.sessionFollowLimit,
        dmCount: state.sessionDmCount,
        dmLimit: state.sessionDmLimit,
        seenUserKeys: [...state.interactedInSession].slice(-2000),
        likedVideoUrls: (window._likedVideoUrls || []).slice(-1000),
        searchVideoUrls: (window._searchVideoUrls || []).slice(-500),
        searchVideoQueueKeyword: window._searchVideoQueueKeyword || local7 || null,
        searchSessionSkippedUrls: (window._searchSessionSkippedUrls || []).slice(-500),
        searchPendingOpenUrl: window._searchPendingOpenUrl || "",
        specificCompletedVideoIds: [...(window._specificSessionCompletedIds || [])],
        specificClaimedUrl: window._specificClaimedUrl || null,
        commentScrapeProgress: window._commentScrapeProgress || null,
        commentImageRotateIndex: state.commentImageRotateIndex,
        videoCommentImageRotateIndex: state.videoCommentImageRotateIndex,
        commentExpressionRotateIndex: state.commentExpressionRotateIndex,
        videoCommentExpressionRotateIndex: state.videoCommentExpressionRotateIndex
      };
      try {
        localStorage.setItem(result6, JSON.stringify(obj));
      } catch (error) {
        obj.seenUserKeys = obj.seenUserKeys.slice(-200);
        obj.likedVideoUrls = obj.likedVideoUrls.slice(-200);
        obj.searchVideoUrls = Array.isArray(obj.searchVideoUrls) ? obj.searchVideoUrls.slice(-100) : [];
        obj.searchSessionSkippedUrls = Array.isArray(obj.searchSessionSkippedUrls) ? obj.searchSessionSkippedUrls.slice(-100) : [];
        obj.specificCompletedVideoIds = obj.specificCompletedVideoIds.slice(-200);
        try {
          localStorage.setItem(result6, JSON.stringify(obj));
        } catch (error2) {
          console.warn("[Built-in-Debug] 任务断点保存失败:", error?.message || error);
        }
      }
    };
    window._specificSessionCompletedIds = new Set(local6 ? [] : local5.specificCompletedVideoIds || []);
    if (local6 && !usesSpecificVideoPool()) {
      clearClaimedSpecificVideoUrl();
    }
    if (!local6 && local5.specificClaimedUrl) {
      window._specificClaimedUrl = local5.specificClaimedUrl;
    }
    window._commentScrapeProgress = local6 ? null : local5.commentScrapeProgress || null;
    const local8 = !local6 && local5.sIndex === value3 && (value5 !== "search" || local5.kIndex === value4);
    if (local8) {
      state.sessionProcessedCount = local5.sessionProcessedCount || 0;
      state.targetVideoCount = local5.targetVideoCount || 0;
      num2 = local5.switchNoResponseStreak || 0;
      num = local5.recommendSwitchRefreshCount || 0;
      if (value5 === "search") {
        const value = Array.isArray(local5.searchVideoUrls) ? local5.searchVideoUrls : [];
        const local = local5.searchVideoQueueKeyword || local7 || null;
        if (value.length > 0 && local && local === local7) {
          window._searchVideoUrls = value;
          window._searchVideoQueueKeyword = local;
          window._searchSessionSkippedUrls = Array.isArray(local5.searchSessionSkippedUrls) ? local5.searchSessionSkippedUrls.slice(-500) : [];
          window._searchPendingOpenUrl = String(local5.searchPendingOpenUrl || "").trim();
          if (window._searchPendingOpenUrl) {
            rememberPendingLeadVideoUrl(window._searchPendingOpenUrl);
          }
        } else {
          clearSearchVideoUrlQueue();
        }
      }
      console.log("[Built-in-Debug] 恢复会话进度: " + state.sessionProcessedCount + "/" + state.targetVideoCount);
    } else {
      state.sessionProcessedCount = 0;
      state.targetVideoCount = 0;
      num2 = 0;
      num = 0;
      clearSearchVideoUrlQueue();
      console.log("[Built-in-Debug] " + (local6 ? "新任务启动" : "入口或关键词变化") + "，重置计数器");
    }
    if (value5 !== "search") {
      window._searchSessionSkippedUrls = [];
      window._searchPendingOpenUrl = "";
    } else if (!Array.isArray(window._searchSessionSkippedUrls)) {
      window._searchSessionSkippedUrls = [];
    }
    if (state.targetVideoCount === 0) {
      if (value5 === "specific") {
        state.targetVideoCount = getSpecificPlannedVideoCount(state.currentTask);
      } else {
        state.targetVideoCount = Math.floor(Math.random() * (parseInt(state.currentTask.videoMax) - parseInt(state.currentTask.videoMin) + 1)) + parseInt(state.currentTask.videoMin);
      }
    }
    window._saveRadarState();
    const value7 = value5 === "search" ? "搜索: " + value6 : value5 === "follow" ? "关注列表" : value5 === "like" ? "喜欢列表" : value5 === "specific" ? "指定视频" : "推荐页";
    const result8 = result4.map(arg1 => obj[arg1] || arg1).join(" → ");
    const num3 = 3;
    const num4 = 5;
    const local9 = () => {
      if (num2 <= 0) {
        return;
      }
      num2 = 0;
      if (window._saveRadarState) {
        window._saveRadarState();
      }
    };
    const local10 = async (text = "视频切换") => {
      num2 += 1;
      console.warn("[Built-in-Debug] [" + text + "] 视频切换未响应 (" + num2 + "/" + num3 + ")");
      if (num2 >= num3) {
        num2 = 0;
        clearPendingLeadVideoUrl();
        const local = value5 === "recommend" && state.sessionProcessedCount < state.targetVideoCount && num < num4;
        if (local) {
          num += 1;
          const value = "连续 " + num3 + " 次视频切换未响应，推荐页视频未达标 (" + state.sessionProcessedCount + "/" + state.targetVideoCount + ")，刷新推荐页继续浏览 (" + num + "/" + num4 + ")";
          reportCurrentAction(value);
          reportTraceLog("🔄 " + value, null, "warning");
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          await reloadRecommendFeedAfterSwitchStall(arg1);
          return "refresh";
        }
        const value = "连续 " + num3 + " 次视频切换未响应，判断当前入口已到末尾，准备切换下一步";
        reportCurrentAction(value);
        reportTraceLog("⚠️ " + value + "（" + value7 + "）", null, "warning");
        state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount);
        if (window._saveRadarState) {
          window._saveRadarState();
        }
        return "advance";
      }
      reportCurrentAction("视频切换暂未响应，继续尝试扫描当前页面... (" + num2 + "/" + num3 + ")");
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      return false;
    };
    const local11 = () => {
      syncEntryContext(value5, value5 === "search" ? value6 : null, value7);
      ipcRenderer.send("automation-data", {
        type: "keyword-changed",
        payload: {
          accountId: window._radar_account_id,
          keyword: value7,
          targetCount: getPlannedVideoCountForDisplay(value5, state.currentTask),
          sessionCount: state.sessionProcessedCount,
          isResume: local3
        }
      });
      ipcRenderer.send("automation-data", {
        type: "status",
        payload: {
          accountId: window._radar_account_id,
          status: "running"
        }
      });
      console.log("%c[任务执行] 正在处理入口 [" + (value3 + 1) + "/" + result4.length + "]: " + value7, "color: #fff; background: #3b82f6; font-weight: bold; padding: 4px;");
      console.log("[Built-in-Debug] 本任务入口队列: " + result8);
      reportCurrentAction(result4.length > 1 ? "正在加载入口: " + value7 + "（队列: " + result8 + "）" : "正在加载视频入口: " + value7);
    };
    const local12 = (arg1, arg2 = local4[0]) => {
      if (arg1 === "follow") {
        return "https://www.douyin.com/follow";
      }
      if (arg1 === "recommend") {
        return local();
      }
      if (arg1 === "like") {
        return local2();
      }
      return buildDouyinSearchUrl(arg2);
    };
    if (value5 === "search") {
      const result = local12("search", value6);
      const value = text === value6;
      const result2 = isViewingDouyinVideoPage(value2);
      const result3 = isDouyinSearchVideoTabUrl(value2);
      const local = !!window._searchPendingOpenUrl || !!/(?:modal_id=|\/video\/|\/note\/)/i.test(value2);
      const local2 = result3 && !result2 && !local || !value && !result2 && !local || local6 && result2 && !local;
      if (local2) {
        console.log("[Built-in-Debug] [导航] 搜索入口路径不匹配或仍停留详情，重载至干净搜索页: " + value6);
        const value = window.location.href.split(/[?#]/)[0];
        const value2 = result.split(/[?#]/)[0];
        prepareSearchPageReload(arg1, value6, "导航对齐干净搜索页");
        if (value === value2 && !result3) {
          console.log("[Built-in-Debug] [导航] 目标 URL 路径与当前一致，执行强制 reload 刷新 DOM 状态");
          suspendAutomationForNavigation();
          window.location.reload();
        } else {
          suspendAutomationForNavigation();
          window.location.href = result;
        }
        return;
      } else if (local6) {
        console.log("[Built-in-Debug] [导航] 新任务已在干净搜索入口，沿用当前首屏加载: " + value6);
      }
    } else if (value5 === "follow") {
      const result = value2.includes("/follow");
      const result2 = isViewingDouyinVideoPage(value2);
      if (local6 || !result && !result2) {
        console.log("[Built-in-Debug] [导航] 全新任务会话启动或路径不匹配，强制跳转至关注页");
        suspendAutomationForNavigation();
        window.location.href = local12("follow");
        return;
      }
    } else if (value5 === "like") {
      const result = getDouyinLikeEntryState(value2);
      const local = result.ready || result.onUser;
      const result2 = isViewingDouyinVideoPage(value2);
      if (!local && !result2) {
        console.log("[Built-in-Debug] [导航] 喜欢列表入口不匹配，强制跳转至喜欢列表页 (new=" + local6 + ", onUser=" + result.onUser + ", showTab=" + result.hasShowTab + ", recent=" + result.recentNavigation + ", tab=" + result.tabFound + ", active=" + result.tabActive + ")");
        suspendAutomationForNavigation();
        navigateToDouyinLikeEntry();
        return;
      }
    } else if (value5 === "specific") {
      const result = getSpecificVideoUrlList(state.currentTask);
      window._specificVideoUrls = result;
      state.targetVideoCount = getSpecificPlannedVideoCount(state.currentTask, result);
      console.log("[Built-in-Debug] [指定视频] 计划处理 " + state.targetVideoCount + " 个链接（忽略频率控制-视频数量）");
      if (usesSpecificVideoPool()) {
        reportTraceLog("📋 指定视频抢活：配置 " + result.length + " 条，多账号先到先得领取");
      }
      const result2 = await ensureClaimedSpecificVideoUrl({
        reuseActive: true
      });
      if (result2 && usesSpecificVideoPool()) {
        window._specificClaimedUrl = result2;
      }
      const value = usesSpecificVideoPool() ? result2 ? 1 : 0 : result.filter(arg1 => !isSpecificVideoCompletedThisSession(arg1)).length;
      logTaskDbg("指定视频", "配置 " + result.length + " 条，本账号待处理入口 " + (value ? "有" : "无"), {
        processedKeys: state.processedVideos.size,
        pool: usesSpecificVideoPool()
      });
      if (!result2) {
        const value = result.length === 0 ? "specific_empty" : usesSpecificVideoPool() ? "specific_pool_empty" : "specific_all_processed";
        await finishSpecificSourceTask(arg1, result6, value, {
          configuredCount: result.length
        });
        return;
      }
      if (!isOnSpecificTargetVideo(value2, result2)) {
        logTaskDbg("导航", "跳转领取视频 id=" + extractSpecificVideoId(result2), {
          url: clipTraceText(result2, 80)
        });
        suspendAutomationForNavigation();
        window.location.href = result2;
        return;
      }
      logTaskDbg("导航", "已在目标视频 id=" + extractSpecificVideoId(result2) + "，进入采集循环");
    } else if (value5 === "recommend") {
      if (local6 || !isOnDouyinRecommendPage(value2)) {
        const result = await ensureDouyinRecommendFeed(arg1);
        if (!result) {
          return;
        }
      }
    } else {
      console.warn("[Built-in-Debug] 未知视频入口: " + value5);
      return;
    }
    local11();
    let set = new Set();
    let set2 = new Set((Array.isArray(window._searchSessionSkippedUrls) ? window._searchSessionSkippedUrls : []).map(arg1 => normalizeSearchQueueVideoUrl(arg1) || String(arg1 || "").trim()).filter(Boolean));
    set2.forEach(arg1 => {
      try {
        getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, arg1);
      } catch (error) {}
    });
    let num5 = 0;
    let num6 = 0;
    let num7 = 0;
    let text2 = "";
    let num8 = 0;
    await randomDelay(4000, 7000, arg1, "页面加载稳定");
    let num9 = 0;
    let num10 = 0;
    let num11 = 0;
    let text3 = "";
    let num12 = 0;
    let text4 = "";
    let text5 = "";
    let num13 = 0;
    let num14 = 0;
    const num15 = 5;
    const num16 = 4;
    const num17 = 4;
    while (!shouldAbort(arg1)) {
      await awaitSecurityChallengeIfPresent(arg1);
      try {
        if (isInteractionLimitReached()) {
          console.log("%c[互动上限] 互动总量已达上限 (" + state.sessionInteractionCount + "/" + state.sessionInteractionLimit + ")，该账号任务自动结束！", "color: #fff; background: #ef4444; font-weight: bold; padding: 4px;");
          reportCurrentAction("🛑 互动总量已达上限 (" + state.sessionInteractionCount + "/" + state.sessionInteractionLimit + ")，自动停止");
          processScrapeAiQueue();
          await finalizeAccountTask(arg1, "interaction_limit_reached", {
            current: state.sessionInteractionCount,
            limit: state.sessionInteractionLimit
          }, {
            storageKey: result6
          });
          return;
        }
        if (value5 === "specific") {
          const result = await ensureClaimedSpecificVideoUrl({
            reuseActive: true
          });
          if (!result) {
            console.log("%c[任务结束] 指定视频列表已全部处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
            const local = window._specificVideoUrls || getSpecificVideoUrlList(state.currentTask);
            await finishSpecificSourceTask(arg1, result6, "specific_completed", {
              configuredCount: local.length
            });
            return;
          }
        } else if (state.sessionProcessedCount >= state.targetVideoCount) {
          if (value5 === "search") {
            if (state.currentTask.useGlobalKeywordPool && state.currentTask.leadgenTaskId) {
              const result = await ipcRenderer.invoke("claim-leadgen-keyword", {
                leadgenTaskId: state.currentTask.leadgenTaskId,
                accountId: state.currentTask.accountId
              });
              if (result?.keyword) {
                state.sessionProcessedCount = 0;
                state.targetVideoCount = 0;
                num2 = 0;
                value4 = 0;
                clearSearchVideoUrlQueue();
                state.currentTask.keywords = result.keyword;
                local7 = result.keyword;
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                const value = result.keyword;
                console.log("%c[任务切换] 动态领取关键词 [" + result.claimed + "/" + result.total + "]: " + value + "（池剩余 " + result.remaining + "）", "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
                reportTraceLog("🔑 切换搜索词：" + value + "（全局池剩余 " + result.remaining + " 个）");
                prepareSearchPageReload(arg1, value, "切换关键词");
                suspendAutomationForNavigation();
                window.location.href = local12("search", value);
                return;
              }
            } else if (value4 < local4.length - 1) {
              value4++;
              state.sessionProcessedCount = 0;
              state.targetVideoCount = 0;
              num2 = 0;
              clearSearchVideoUrlQueue();
              local7 = local4[value4];
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              const value = local4[value4];
              console.log("%c[任务切换] 当前词已达标，准备切换至 [" + (value4 + 1) + "/" + local4.length + "]: " + value, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
              prepareSearchPageReload(arg1, value, "切换关键词");
              suspendAutomationForNavigation();
              window.location.href = local12("search", value);
              return;
            }
          }
          if (value3 < result4.length - 1) {
            const value = result4[value3];
            value3++;
            value4 = 0;
            local7 = null;
            state.sessionProcessedCount = 0;
            state.targetVideoCount = 0;
            num2 = 0;
            num = 0;
            clearSearchVideoUrlQueue();
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            const value2 = result4[value3];
            const value5 = (obj[value] || value) + " → " + (obj[value2] || value2);
            console.log("%c[任务切换] 当前视频入口已达标，准备切换: " + value5, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
            reportCurrentAction("入口切换: " + value5);
            suspendAutomationForNavigation();
            window.location.href = local12(value2);
            return;
          } else {
            console.log("%c[任务结束] 所有视频入口队列及关键词已处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
            processScrapeAiQueue();
            await finalizeAccountTask(arg1, "all_sources_completed", {
              viewed: state.sessionProcessedCount,
              planned: state.targetVideoCount
            }, {
              storageKey: result6
            });
            return;
          }
        }
        value5 = result4[value3];
        state.currentRunningSource = value5;
        syncSpecificVideoPauseWatcher();
        const result = await ensureCurrentSourcePage(arg1, value5);
        if (!result) {
          continue;
        }
        const local = window.location.href.includes("/video/") || window.location.href.includes("modal_id=") || window.location.href.includes("/note/");
        if (value5 === "search" && window.location.href.includes("/search/") && !local) {
          try {
            ensureLeadgenScrapeApiHook({
              force: true
            });
          } catch (error) {}
          const value = "applied_filters_" + arg1 + "_" + value6;
          const value2 = sessionStorage.getItem(value) === "true";
          await applySearchFilters(value6, arg1);
          const value3 = sessionStorage.getItem(value) === "true";
          if (!value2 && value3) {
            console.log("[Built-in-Debug] [官方筛选] 过滤器已新应用，休眠 4.5 秒等待搜素结果加载稳定...");
            await randomDelay(4000, 5500, arg1, "等待筛选结果加载");
          }
        }
        if (value5 === "like" && !local) {
          if (!window._likedVideoUrls || window._likedVideoUrls.length === 0) {
            window.__radar_like_link_reclaim_pass = false;
            window._likedVideoUrls = await collectLikedVideos(arg1);
            if (window._likedVideoUrls.length === 0) {
              console.warn("[Built-in-Debug] 喜欢列表没有检测到视频作品，结束任务");
              await finalizeAccountTask(arg1, "like_list_empty", {}, {
                storageKey: result6
              });
              return;
            }
            state.targetVideoCount = Math.min(state.targetVideoCount || infinity, window._likedVideoUrls.length);
            window._saveRadarState();
          }
        }
        if (value5 === "search" && !local && shouldUseSearchVideoUrlQueue(state.currentTask)) {
          const result = String(local7 || value6 || "").trim();
          const value = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
          const local = value.length > 0 && window._searchVideoQueueKeyword && window._searchVideoQueueKeyword === result;
          if (!local) {
            window._searchVideoUrls = await collectSearchVideoUrlsForCommentTask(arg1, state.targetVideoCount);
            window._searchVideoQueueKeyword = result;
            if (!window._searchVideoUrls.length) {
              console.warn("[Built-in-Debug] [搜索队列] 未收集到可用视频链接，推进当前关键词");
              reportTraceLog("⚠️ 搜索评论队列为空，切换下一关键词或结束", null, "warning");
              state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount || 1);
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              continue;
            }
            state.targetVideoCount = Math.min(state.targetVideoCount || infinity, window._searchVideoUrls.length);
            window._modalMaxSlides = window._searchVideoUrls.length;
            window._modalSlideCount = 0;
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            reportTraceLog("📋 搜索评论队列就绪：" + window._searchVideoUrls.length + " 条，本词计划处理 " + state.targetVideoCount + " 条");
          } else {
            state.targetVideoCount = Math.min(state.targetVideoCount || value.length, value.length);
            window._modalMaxSlides = value.length;
          }
        }
        if (value5 === "specific" && !window._specificVideoUrls) {
          window._specificVideoUrls = getSpecificVideoUrlList(state.currentTask);
          reportTraceLog("📋 指定视频列表：共 " + window._specificVideoUrls.length + " 个链接");
          console.log("[Built-in-Debug] [指定视频] 初始化 URL 列表: " + window._specificVideoUrls.length + " 个");
        }
        const result2 = isFeedStyleSource(value5);
        const value = platformSelectors["douyin.com"].modalContainer;
        let value2 = value ? Array.from(document.querySelectorAll(value)).find(isVisibleElement) : null;
        if (!value2 || !isVisibleElement(value2)) {
          value2 = resolveDouyinVideoDetailModal({
            includeFeed: result2
          });
        }
        if (result2) {
          if (isDouyinFeedLiveStream()) {
            num10 = 0;
            const local = getFeedVideoIdentity() || getVideoTitle();
            if (local) {
              set2.add(local);
            }
            if (local && local === text3) {
              num11 += 1;
            } else {
              num11 = 1;
              text3 = local;
            }
            console.log("[Built-in-Debug] [推荐流] 检测到直播间，自动切换下一条");
            reportCurrentAction("检测到直播间，自动切换下一条...");
            await skipDouyinFeedLiveStream(arg1, {
              forceReload: num11 >= num16
            });
            if (num11 >= num16) {
              num11 = 0;
              text3 = "";
            }
            continue;
          }
          num11 = 0;
          text3 = "";
          if (isDouyinFeedPlaying()) {
            num10 = 0;
            value2 = getDouyinFeedScope();
            console.log("[Built-in-Debug] [检测] 推荐/关注流：识别到正在播放的 feed 视频");
          } else {
            num10 += 1;
            pauseVisibleDouyinVideos(getDouyinFeedScope() || document, "推荐流等待就绪期间锁定暂停");
            if (num10 >= num15) {
              num10 = 0;
              console.warn("[Built-in-Debug] [推荐流] 连续等待 " + num15 + " 次仍未就绪，切换下一条");
              reportCurrentAction("推荐流播放器未就绪，切换下一条视频...");
              await moveToNextVideo(arg1);
              await randomDelay(2000, 4000, arg1, "推荐流切换");
              continue;
            }
            reportCurrentAction("推荐流视频加载中，等待播放器就绪 (" + num10 + "/" + num15 + ")...");
            await randomDelay(2500, 4000, arg1, "等待推荐流");
            continue;
          }
        }
        if (value2 && isVisibleElement(value2)) {
          num8 = 0;
          const local = extractSpecificVideoId(window.location.href) || getVideoTitle();
          if (!window._lastModalVisible) {
            window._modalSlideCount = 1;
            const value = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls.length : 0;
            window._modalMaxSlides = value > 0 && shouldUseSearchVideoUrlQueue(state.currentTask) ? value : window._searchCardCount || 0;
            window._lastModalVideoId = local;
            console.log("[Built-in-Debug] [弹窗计数] 详情弹窗新打开，第 1 个视频，" + ("初始可见卡片参考数: " + window._modalMaxSlides + "（不作为搜索结束条件）"));
          } else if (local && local !== window._lastModalVideoId) {
            window._modalSlideCount = (window._modalSlideCount || 0) + 1;
            window._lastModalVideoId = local;
            console.log("[Built-in-Debug] [弹窗计数] 检测到视频切换，进入第 " + window._modalSlideCount + " 个视频" + ("（初始可见卡片参考数: " + window._modalMaxSlides + "）"));
          }
          window._lastModalVisible = true;
          const local2 = value2.getAttribute?.("data-e2e") || "";
          const local3 = result2 && (local2 === "feed-active-video" || local2 === "feed-active-live" || local2 === "feed-live" || local2 === "browse-live" || local2 === "webcast-player");
          const value = local3 ? document : value2;
          console.log(local3 ? "[Built-in-Debug] [检测] 推荐/关注流内联播放，进入 feed 处理模式" : "[Built-in-Debug] [检测] 成功发现视频详情弹窗");
          let local4 = null;
          let local5 = null;
          try {
            let text = "";
            let text5 = "";
            let text6 = "";
            let local = null;
            if (local3) {
              pauseVisibleDouyinVideos(value2, "推荐流进入后立即暂停");
              lockFeedLeadVideoUrl(value2);
              try {
                ensureLeadgenScrapeApiHook({
                  force: true
                });
              } catch (error) {}
              local4 = startCurrentVideoPauseGuard({
                scope: value2
              }, arg1, {
                intervalMs: 250,
                pauseOnly: true
              });
              const local2 = state.lockedFeedIdentity || getFeedVideoIdentity(value2) || "";
              text = local2;
              text5 = pickLeadVideoUrl(state.lockedLeadVideoUrl || local2, value2);
              text6 = isDouyinVideoShareUrl(text5) ? text5 : text;
              const local3 = shouldCollectScrapeVideoMetadata(state.currentTask) && getScrapeTargetSet(state.currentTask).has("author");
              local = local3 ? await waitAndCaptureCurrentVideoMetadata(value2, text5, arg1, {
                requireAuthor: true,
                maxWaitMs: 2800
              }) : captureCurrentVideoMetadata(value2, text5);
            } else if (value5 === "search") {
              pauseVisibleDouyinVideos(value2, "进入视频详情后立即暂停防止自动连播");
              local4 = startCurrentVideoPauseGuard({
                scope: value2
              }, arg1, {
                intervalMs: 80,
                pauseOnly: true
              });
              await burstPauseWithinOneSecond(value2, arg1, {
                budgetMs: 1000,
                tickMs: 50,
                reason: "进入视频 1 秒内强制暂停"
              });
              const result = await pauseSettleThenCaptureVideoMetadata(value2, arg1, {
                isFeedPlayback: false,
                previousAuthor: window._lastProcessedVideoAuthor || window._lastProcessedSearchVideoAuthor || "",
                previousVideoId: window._lastProcessedVideoId || window._lastProcessedSearchVideoId || "",
                settleMs: 400,
                maxWaitMs: shouldCollectScrapeVideoMetadata(state.currentTask) && getScrapeTargetSet(state.currentTask).has("author") ? 2800 : 2000,
                requireAuthor: true,
                skipBurstPause: true
              });
              text = result.url;
              text5 = result.leadVideoUrl;
              text6 = isDouyinVideoShareUrl(text5) ? text5 : result.dedupKey;
              local = result.meta;
            } else {
              pauseVisibleDouyinVideos(value2, "进入视频详情后立即暂停防止自动连播");
              local4 = startCurrentVideoPauseGuard({
                scope: value2
              }, arg1, {
                intervalMs: 250,
                pauseOnly: true
              });
              text = normalizeUrl(window.location.href);
              text5 = pickLeadVideoUrl(text, value || value2);
              text6 = isDouyinVideoShareUrl(text5) ? text5 : text;
              const local2 = shouldCollectScrapeVideoMetadata(state.currentTask) && getScrapeTargetSet(state.currentTask).has("author");
              local = local2 ? await waitAndCaptureCurrentVideoMetadata(value2, text5, arg1, {
                requireAuthor: true,
                maxWaitMs: 2800
              }) : captureCurrentVideoMetadata(value2, text5);
            }
            {
              const result = peekSearchPendingOpenUrl();
              const result2 = extractSpecificVideoId(result);
              const result3 = extractSpecificVideoId(text6 || text5 || text);
              if (result2 && result3 && result2 === result3) {
                clearSearchPendingOpenUrl();
              }
            }
            if (local3 && !isDouyinVideoShareUrl(text5)) {
              console.warn("[Built-in-Debug] [推荐流] 未能锁定标准 /video/xxx 链接，线索可能缺少视频链接");
            } else if (!local3 && !isDouyinVideoShareUrl(text5) && isDouyinNonVideoPageUrl(normalizeUrl(window.location.href))) {
              console.warn("[Built-in-Debug] [视频链接] 未能解析为标准 /video/xxx 格式，线索可能缺少视频链接");
            }
            const value3 = local.title;
            const value4 = local.authorNickname;
            clearVideoLocalQuotaExhaustedFlag(arg1);
            const local2 = local.stats || {};
            const local6 = extractSpecificVideoId(text5 || text6 || text) || extractSpecificVideoId(window.location.href) || "";
            const result = String(local.authorUrl || "").trim();
            const value8 = local.fromApi ? "API" : "DOM";
            reportTraceLog("🎬 当前视频：作者「" + (value4 || "未知作者") + "」" + (" | 标题《" + clipTraceText(value3 || "未知视频", 40) + "》") + (local6 ? " | id=" + local6 : "") + (result ? " | 主页…" + result.slice(-18) : "") + (" | 来源=" + value8) + (" | 赞" + (local2.likes || 0) + "/评" + (local2.comments || 0) + "/藏" + (local2.collects || 0) + "/转" + (local2.shares || 0)), null, "success");
            if (value5 === "search") {
              const local = extractSpecificVideoId(text5 || text6 || text) || text5 || text6 || text;
              const result = noteSearchSlideVideoKey(local);
              if (result) {
                const value = result === "same" ? "搜索已到末尾（同一视频连续出现 3 次），正在关闭并切换新词…" : "搜索已到末尾（末两条视频来回切换），正在关闭并切换新词…";
                reportCurrentAction(value);
                reportTraceLog(result === "same" ? "ℹ️ 搜索下滑：同一视频连续出现 3 次，判定无更多视频" : "ℹ️ 搜索下滑：末尾两条视频来回切换已重复 2 次，判定无新视频", null, "normal");
                await closeAllModals(arg1);
                state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount);
                clearSearchSlideOscillationState();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                continue;
              }
              window._lastProcessedSearchVideoId = extractSpecificVideoId(text5 || text6 || text) || "";
              window._lastProcessedSearchVideoAuthor = value4 || "";
            }
            window._lastProcessedVideoId = extractSpecificVideoId(text5 || text6 || text) || "";
            window._lastProcessedVideoAuthor = value4 || "";
            const obj = {
              isFeedPlayback: local3,
              leadVideoUrl: text5,
              dedupKey: text6,
              videoId: extractSpecificVideoId(text5 || text6 || text) || "",
              videoTitle: value3,
              videoAuthor: value4,
              scope: value2,
              lenientWhenUnresolved: true
            };
            if (state.currentTask?.taskMode === "scrape") {
              try {
                local4?.stop();
              } catch (error) {}
              local4 = null;
              pauseVisibleDouyinVideos(value2, "仅采集模式锁定暂停，禁止自动连播");
              local5 = startCurrentVideoPauseGuard(obj, arg1, {
                intervalMs: 400
              });
            }
            if (value5 === "specific") {
              const local = window._specificVideoUrls || getSpecificVideoUrlList(state.currentTask);
              const result = await ensureClaimedSpecificVideoUrl({
                reuseActive: true
              });
              const result2 = normalizeSpecificVideoKey(text5 || text6 || text);
              const value = result ? normalizeSpecificVideoKey(result) : "";
              if (value && result2 !== value) {
                num6 += 1;
                console.warn("[Built-in-Debug] [指定视频] 当前视频非领取目标，重新打开 (" + num6 + "/" + specificVideoNavMissMax + "): " + result);
                if (num6 >= specificVideoNavMissMax) {
                  const result2 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, "nav_miss_wrong_video_" + num6);
                  if (result2 === "done") {
                    return;
                  }
                  num6 = 0;
                  num5 = 0;
                  continue;
                }
                reportCurrentAction("检测到非指定视频，正在重新打开目标链接 (" + num6 + "/" + specificVideoNavMissMax + ")...");
                window.location.href = result;
                await waitSpecificVideoNavAppear(arg1);
                continue;
              }
              num6 = 0;
              if (!value && !isVideoInSpecificList(text5 || text6, local)) {
                console.warn("[Built-in-Debug] [指定视频] 当前视频不在指定列表中，忽略: " + result2);
                reportCurrentAction("检测到非指定视频，跳过...");
                continue;
              }
            }
            if (value5 === "like") {
              const local = window._likedVideoUrls && window._likedVideoUrls.includes(text5);
              if (!local) {
                const value = "⚠️ 喜欢列表浏览边界到达：当前视频 " + text5 + " 不在喜欢列表中（可能已进入推荐视频页），任务完成。";
                console.log("[Built-in-Debug] [喜欢列表] " + value);
                reportTraceLog(value);
                try {
                  document.querySelector(platformSelectors["douyin.com"].commentPanel)?.closest("[class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"panel\"]")?.querySelector("[data-e2e=\"close\"], [aria-label=\"关闭\"]")?.click?.();
                } catch (error) {}
                await finalizeAccountTask(arg1, "like_list_completed", {}, {
                  storageKey: result6
                });
                return;
              } else {
                reportTraceLog("🎬 轨迹详情：当前正在浏览喜欢列表内的视频: " + text5);
              }
            }
            if (local3 && isDouyinFeedLiveStream(value2)) {
              set2.add(text);
              const local = getFeedVideoIdentity(value2) || value3;
              if (local && local === text3) {
                num11 += 1;
              } else {
                num11 = 1;
                text3 = local;
              }
              console.log("[Built-in-Debug] [推荐流] 当前条为直播间，跳过互动");
              reportCurrentAction("当前为直播间内容，自动切换下一条...");
              await skipDouyinFeedLiveStream(arg1, {
                forceReload: num11 >= num16
              });
              if (num11 >= num16) {
                num11 = 0;
                text3 = "";
              }
              continue;
            }
            let flag = false;
            const local8 = value3 && value3 !== "未知视频";
            const local11 = local3 || text6.includes("/video/") || text6.includes("modal_id=") || text6.includes("vid=") || isDouyinVideoShareUrl(text5);
            const result3 = shouldReprocessConfiguredSpecific(text6);
            const result4 = shouldBypassSpecificBrowseDedup(text6);
            const local12 = result3 || result4;
            const result5 = getProcessedVideoKeyModule();
            if (!local12 && local11) {
              if (set2.has(text6)) {
                console.log("[Built-in-Debug] [去重判定] 跳过视频 (本轮已分析): " + (value4 || "未知作者") + " - 《" + (value3 || "无标题").substring(0, 15) + "...》");
                flag = true;
              } else if (result5.hasProcessedVideoKey(state.processedVideos, text6)) {
                console.log("[Built-in-Debug] [去重判定] 跳过视频 (历史已分析): " + (value4 || "未知作者") + " - 《" + (value3 || "无标题").substring(0, 15) + "...》");
                flag = true;
              }
            } else if (local8 && set.has(value3) && set2.has(text6)) {
              console.log("[Built-in-Debug] [去重判定] 跳过视频 (标题重复): " + (value4 || "未知作者") + " - 《" + (value3 || "无标题").substring(0, 15) + "...》");
              flag = true;
            }
            if (!flag && local8 && state.currentTask.excludeTitleKeywords) {
              const result = parseTitleKeywordList(state.currentTask.excludeTitleKeywords);
              const result2 = matchTitleKeywordList(value3, result);
              if (result2) {
                const value = "⏭️ 跳过视频 (标题含排除词\"" + result2 + "\"): " + (value4 || "未知作者") + " - 《" + value3.substring(0, 15) + "...》";
                console.log("[Built-in-Debug] [标题过滤] " + value);
                reportCurrentAction(value);
                flag = true;
              }
            }
            const value9 = local8 ? getIncludeTitleKeywordMatch(value3) : "";
            if (!flag && shouldEnforceIncludeTitleKeywords(state.currentTask)) {
              if (!local8 || !value9) {
                const value = "⏭️ 跳过视频 (标题未命中包含词): " + (value4 || "未知作者") + " - 《" + (value3 || "无标题").substring(0, 15) + "...》";
                console.log("[Built-in-Debug] [标题过滤] " + value);
                reportCurrentAction(value);
                flag = true;
              }
            }
            const result7 = parseExcludeAuthorAccounts(state.currentTask.excludeAuthorAccounts);
            if (!flag && result7.length > 0) {
              if (!value4) {
                reportTraceLog("⚠️ 作者识别失败，无法比对排除名单（《" + (value3 || "无标题").substring(0, 20) + "...》）");
              } else {
                const result = matchExcludedVideoAuthor(value4, result7);
                if (result.excluded) {
                  const value = "⏭️ 跳过视频 (作者在排除名单「" + result.matched + "」): @" + value4;
                  console.log("[Built-in-Debug] [作者过滤] " + value + " title=" + value3);
                  reportCurrentAction(value + " 《" + (value3 || "无标题").substring(0, 15) + "...》");
                  reportTraceLog("⏭️ 作者过滤：@" + value4 + " 命中排除名单「" + result.matched + "」，已跳过 " + value4 + " - 《" + clipTraceText(value3 || "无标题", 32) + "》");
                  flag = true;
                }
              }
            }
            if (!flag) {
              const local = parseInt(state.currentTask.minVideoLike) || 0;
              const local3 = parseInt(state.currentTask.minVideoComment) || 0;
              const local4 = parseInt(state.currentTask.minVideoCollect) || 0;
              const local5 = parseInt(state.currentTask.minVideoShare) || 0;
              if (local > 0 || local3 > 0 || local4 > 0 || local5 > 0) {
                let text = "";
                if (local > 0 && local2.likes < local) {
                  text = "点赞数 " + local2.likes + " < " + local;
                } else if (local3 > 0 && local2.comments < local3) {
                  text = "评论数 " + local2.comments + " < " + local3;
                } else if (local4 > 0 && local2.collects < local4) {
                  text = "收藏数 " + local2.collects + " < " + local4;
                } else if (local5 > 0 && local2.shares < local5) {
                  text = "转发数 " + local2.shares + " < " + local5;
                }
                if (text) {
                  const value = "⏭️ 跳过视频 (数据未达标 - " + text + "): " + (value4 || "未知作者") + " - 《" + (value3 || "无标题").substring(0, 15) + "......》";
                  console.log("[Built-in-Debug] [数据过滤] " + value + " stats=", local2);
                  reportCurrentAction(value);
                  reportTraceLog("⏭️ 数据过滤：" + text + "，已跳过 " + (value4 || "未知作者") + " - 《" + clipTraceText(value3 || "无标题", 32) + "》");
                  flag = true;
                } else {
                  console.log("[Built-in-Debug] [数据过滤] 校验通过 stats=", local2);
                }
              }
            }
            if (!flag && local11) {
              const local = result5.normalizeProcessedVideoKey(text6 || text5 || text) || text6;
              const result = await ipcRenderer.invoke("claim-processed-video", {
                url: local,
                title: value3 || "未知视频",
                platform: "douyin",
                forceReclaim: local12
              });
              if (!result?.claimed && !local12) {
                const local2 = result?.reason || "unknown";
                if (local2 === "invalid_url" && local3) {
                  console.warn("[Built-in-Debug] [跨账号去重] 推荐流暂无标准视频链接，跳过抢占继续处理 key=" + local);
                } else {
                  result5.rememberProcessedVideoKey(state.processedVideos, local);
                  result5.rememberProcessedVideoKey(state.processedVideos, text6);
                  const value = local2 === "in_flight" ? "其他账号正在处理" : local2 === "already_processed" ? "历史已分析" : "其他账号已占用";
                  const value2 = "⏭️ 跳过视频 (" + value + "): 《" + (value3 || "无标题").substring(0, 15) + "...》";
                  console.log("[Built-in-Debug] [跨账号去重] " + value2 + " reason=" + local2);
                  if (value !== "历史已分析") {
                    reportCurrentAction(value2);
                    reportTraceLog("⏭️ 跨账号去重：视频已被其他账号占用 (" + (result?.reason || "already_claimed") + ")");
                  }
                  flag = true;
                  if (value5 === "specific") {
                    markSpecificVideoCompletedThisSession(text6 || text5 || text);
                    clearClaimedSpecificVideoUrl();
                  }
                }
              } else if (result?.claimed) {
                result5.rememberProcessedVideoKey(state.processedVideos, result.key || local);
                result5.rememberProcessedVideoKey(state.processedVideos, text6);
              } else if (local12) {
                console.warn("[Built-in-Debug] [指定视频] claim 未成功但仍继续处理 reason=" + (result?.reason || "unknown"));
                result5.rememberProcessedVideoKey(state.processedVideos, local);
                result5.rememberProcessedVideoKey(state.processedVideos, text6);
              }
            }
            if (flag) {
              try {
                document.querySelector(platformSelectors["douyin.com"].commentPanel)?.closest("[class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"panel\"]")?.querySelector("[data-e2e=\"close\"], [aria-label=\"关闭\"]")?.click?.();
              } catch (error) {}
              const local = text6 || value3 || "";
              if (local && local === text4) {
                num12 += 1;
              } else {
                num12 = 1;
                text4 = local;
              }
              if (result2 && num12 >= num17) {
                num12 = 0;
                text4 = "";
                await reloadCurrentFeedSource(arg1, value5);
                return;
              }
              if (value5 === "search" && num12 >= 3) {
                num12 = 0;
                text4 = "";
                reportCurrentAction("搜索已到末尾（同一视频连续跳过 3 次），正在关闭并切换新词…");
                reportTraceLog("ℹ️ 搜索下滑：同一已分析视频连续跳过 3 次，判定无更多视频", null, "normal");
                try {
                  local4?.stop();
                } catch (error) {}
                local4 = null;
                try {
                  local5?.stop();
                } catch (error) {}
                local5 = null;
                await closeAllModals(arg1);
                state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount);
                clearSearchSlideOscillationState();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                continue;
              }
              reportCurrentAction("该视频已分析，切换下一条...", null, "warning");
              clearPendingLeadVideoUrl();
              if (value5 === "search" && shouldUseSearchVideoUrlQueue(state.currentTask)) {
                markSearchQueueUrlSkipped(text6 || text5 || text, set2);
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
              }
              if (value5 === "specific") {
                console.log("[Built-in-Debug] [指定视频] 视频已跳过/已分析，直接进入下一轮跳转下一个链接");
                const local = window._specificVideoUrls || getSpecificVideoUrlList(state.currentTask);
                const result = await ensureClaimedSpecificVideoUrl({
                  reuseActive: true
                });
                markSpecificVideoCompletedThisSession(result || text6 || text5 || text);
                markSpecificVideoHandled(state.processedVideos, text6 || text5 || text, local, {
                  persistGlobal: false
                });
                clearClaimedSpecificVideoUrl();
                const result2 = extractSpecificVideoId(text6 || text5 || result || text);
                if (result2 && result2 === text2) {
                  num7 += 1;
                } else {
                  num7 = 1;
                  text2 = result2 || "";
                }
                set2.add(text6);
                state.sessionProcessedCount += 1;
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                const result3 = await ensureClaimedSpecificVideoUrl({
                  reuseActive: false,
                  advance: true
                });
                if (!result3 || num7 >= 3) {
                  if (num7 >= 3) {
                    reportTraceLog("⚠️ 指定视频：同一链接连续跳过，已无更多可处理视频", null, "warning");
                  }
                  console.log("[Built-in-Debug] [指定视频] 跳过后无剩余视频，任务结束");
                  reportCurrentAction("指定视频列表已全部处理，任务结束");
                  await finishSpecificSourceTask(arg1, result6, "specific_completed", {
                    configuredCount: local.length
                  });
                  return;
                }
                const result4 = normalizeSpecificVideoKey(result3);
                const result5 = extractSpecificVideoId(text6 || window.location.href);
                const result7 = extractSpecificVideoId(result3);
                if (result7 && result5 && result7 === result5) {
                  reportTraceLog("⚠️ 指定视频：当前链接已分析，且无其它待处理链接", null, "warning");
                  await finishSpecificSourceTask(arg1, result6, "specific_completed", {
                    configuredCount: local.length
                  });
                  return;
                }
                state.lastClickedId = result4;
                rememberPendingLeadVideoUrl(result4);
                num7 = 0;
                text2 = "";
                console.log("[Built-in-Debug] [指定视频] 跳过后准备跳转下一个目标: " + result3);
                reportCurrentAction("正在打开指定视频 (" + (local.indexOf(result3) + 1) + "/" + local.length + ")...");
                window.location.href = result3;
                await waitSpecificVideoNavAppear(arg1);
                continue;
              }
              {
                try {
                  local4?.stop();
                } catch (error) {}
                local4 = null;
                try {
                  local5?.stop();
                } catch (error) {}
                local5 = null;
                const result = await advanceAfterSearchQueuedVideo(arg1, {
                  videoTitle: value3,
                  leadVideoUrl: text5,
                  dedupKey: text6,
                  modal: value2,
                  phaseLabel: "导航-已分析",
                  activeKeyword: local7 || value6 || "",
                  sessionUrls: set2,
                  onSwitchOk: local9
                });
                if (result === "navigating") {
                  return;
                }
                if (result === "done" || result === "continued") {
                  continue;
                }
              }
              try {
                local4?.stop();
              } catch (error) {}
              local4 = null;
              try {
                local5?.stop();
              } catch (error) {}
              local5 = null;
              const local2 = getFeedVideoIdentity(getDouyinFeedScope() || value2) || "";
              await moveToNextVideo(arg1);
              const result = await awaitFeedVideoSwitchSettled(arg1, {
                previousIdentity: local2,
                previousTitle: value3,
                previousAuthor: value4,
                leadVideoUrl: text5,
                dedupKey: text6,
                phaseLabel: "导航-已分析",
                preferredScope: value || value2
              });
              if (result) {
                local9();
              } else {
                const result = await local10("导航-已分析");
                if (result === "refresh") {
                  return;
                }
                if (result === "advance") {
                  continue;
                }
              }
              await guardedPauseDelay(1500, 3000, arg1, "切换喘息-已分析", value || value2);
              continue;
            }
            let flag2 = false;
            if (!flag && shouldCollectScrapeVideoMetadata(state.currentTask)) {
              const value = local.authorUrl;
              const local2 = getScrapeTargetSet(state.currentTask).has("author") && (!value || !value4);
              const result = buildVideoCardLead({
                videoUrl: text5 || text6 || text,
                title: value3,
                authorNickname: value4,
                authorUrl: value,
                source: "opened_video"
              });
              if (emitVideoCardLead(result) && isLinkOnlyScrapeTask(state.currentTask)) {
                const local = getProcessedVideoKeyModule().normalizeProcessedVideoKey(text5 || text6 || text) || text6;
                set.add(value3);
                set2.add(text6);
                getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
                getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, text6);
                ipcRenderer.send("update-processed-videos", {
                  url: local,
                  title: value3,
                  authorNickname: value4,
                  authorUrl: value,
                  platform: "douyin",
                  timestamp: Date.now()
                });
                state.sessionProcessedCount += 1;
                clearPendingLeadVideoUrl();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                ipcRenderer.send("automation-data", {
                  type: "video-processed",
                  payload: {
                    accountId: window._radar_account_id,
                    accountName: window._radar_account_name,
                    sessionCount: state.sessionProcessedCount,
                    targetCount: getPlannedVideoCountForDisplay(value5, state.currentTask)
                  }
                });
                reportCurrentAction("已采集视频/作者卡片数据（" + state.sessionProcessedCount + "/" + getPlannedVideoCountForDisplay(value5, state.currentTask) + "），未打开评论区");
                reportTraceLog("✅ 视频补采完成：" + (value4 || "未知作者") + " - 《" + clipTraceText(value3, 32) + "》", null, "success");
                flag2 = true;
              } else if (local2 && isLinkOnlyScrapeTask(state.currentTask)) {
                reportCurrentAction("当前视频未识别到有效作者主页，已跳过空记录并继续补采");
                reportTraceLog("⚠️ 主页补采失败：未找到《" + clipTraceText(value3 || "未知视频", 32) + "》的作者主页链接，本条不会计入采集数量", null, "warning");
                flag2 = true;
              } else if (result?.videoUrl) {
                reportTraceLog("🔗 视频解析中：" + (value4 || "未知作者") + " - 《" + clipTraceText(value3, 24) + "》");
              }
            }
            num12 = 0;
            text4 = "";
            if (!flag && !flag2) {
              let local6 = null;
              const value6 = (parseInt(state.currentTask.stayMin) || 5) * 1000;
              const value7 = (parseInt(state.currentTask.stayMax) || 12) * 1000;
              pauseVisibleDouyinVideos(value || value2, "观看前锁定当前视频");
              const result = getCurrentContentPauseProfile(value || value2);
              const value8 = result.imageText ? Math.min(value6, 500) : value6;
              const value9 = result.imageText ? Math.min(value7, 1200) : value7;
              if (result.imageText) {
                console.log("[Built-in-Debug] [视频防跳] 检测到图文/无视频内容，压缩观看休眠并尽快进入评论区");
                reportTraceLog("🧷 视频防跳：检测到图文/无视频内容，已压缩观看休眠，避免 6 秒左右自动跳转");
              }
              const result2 = await guardedCurrentVideoDelay(value8, value9, arg1, "观看休眠", obj, {
                allowRandomPlay: state.currentTask?.taskMode !== "scrape"
              });
              if (!result2) {
                const result = getCurrentVideoGuardState(obj);
                if (result.same || result.videoIdMatched) {
                  console.warn("[Built-in-Debug] [视频防跳] 观看等待曾报切换，但视频 ID 未变，按误判继续");
                  reportTraceLog("🧷 视频防跳：等待期抖动已忽略（视频 ID 未变）", null, "warning");
                } else {
                  reportCurrentAction("当前视频在等待期间已自动切换，重新识别当前视频...");
                  reportTraceLog("⚠️ 视频防跳：等待期间检测到视频已自动切换，已放弃旧视频记录并重新识别当前页面", null, "warning");
                  await releaseAbandonedVideoClaim([obj.leadVideoUrl, obj.dedupKey, text5, text6, text], "watch_drift");
                  clearPendingLeadVideoUrl();
                  continue;
                }
              }
              pauseVisibleDouyinVideos(value || value2, "观看休眠结束后再次锁定当前视频");
              let local7 = null;
              try {
                try {
                  local4?.stop();
                } catch (error) {}
                local4 = null;
                try {
                  local5?.stop();
                } catch (error) {}
                local5 = null;
                local7 = startCurrentVideoPauseGuard(obj, arg1);
                if (await fn(value, arg1)) {
                  pauseVisibleDouyinVideos(value || value2, "评论区打开后锁定当前视频");
                  const result = getCurrentVideoGuardState(obj);
                  if (!result.same) {
                    if (result.videoIdMatched) {
                      console.warn("[Built-in-Debug] [视频防跳] 评论区打开后曾报漂移，但视频 ID 未变，按误判继续");
                    } else {
                      console.warn("[Built-in-Debug] [视频防跳] 评论区打开后检测到视频已漂移: current=" + (result.currentUrl || result.currentTitle || "unknown"));
                      reportCurrentAction("评论区打开后发现视频已切换，重新识别当前视频...");
                      await releaseAbandonedVideoClaim([obj.leadVideoUrl, obj.dedupKey, text5, text6, text], "panel_open_drift");
                      clearPendingLeadVideoUrl();
                      local7?.stop();
                      continue;
                    }
                  }
                  const local4 = parseInt(state.currentTask.likeMin) || 0;
                  const local5 = parseInt(state.currentTask.likeMax) || 0;
                  const local8 = parseInt(state.currentTask.commentMin) || 0;
                  const local9 = parseInt(state.currentTask.commentMax) || 0;
                  const value5 = state.sessionFollowLimit === infinity ? Number.MAX_SAFE_INTEGER : Math.max(0, state.sessionFollowLimit - state.sessionFollowCount);
                  const value6 = state.sessionDmLimit === infinity ? Number.MAX_SAFE_INTEGER : Math.max(0, state.sessionDmLimit - state.sessionDmCount);
                  const obj2 = {
                    likes: state.currentTask.enableLike ? Math.floor(Math.random() * (local5 - local4 + 1)) + local4 : 0,
                    comments: state.currentTask.enableComment ? Math.floor(Math.random() * (local9 - local8 + 1)) + local8 : 0,
                    follows: state.currentTask.enableFollow ? value5 : 0,
                    dms: state.currentTask.enableDM ? value6 : 0
                  };
                  if (state.sessionInteractionLimit !== infinity) {
                    const result = Math.max(0, state.sessionInteractionLimit - state.sessionInteractionCount);
                    let value = obj2.likes + obj2.comments;
                    if (value > result) {
                      const value2 = result / value;
                      obj2.comments = Math.min(obj2.comments, Math.ceil(obj2.comments * value2));
                      obj2.likes = Math.min(obj2.likes, result - obj2.comments);
                      if (obj2.likes < 0) {
                        obj2.likes = 0;
                      }
                      console.log("[Built-in-Debug] [总量控制] 剩余互动额度 " + result + "，本视频配额裁剪为: 点赞=" + obj2.likes + ", 评论=" + obj2.comments);
                    }
                  }
                  const obj3 = {
                    ...obj2
                  };
                  const local10 = () => {
                    ipcRenderer.send("automation-data", {
                      type: "interaction-progress",
                      payload: {
                        accountId: window._radar_account_id,
                        likes: {
                          current: obj3.likes - obj2.likes,
                          total: obj3.likes
                        },
                        replies: {
                          current: obj3.comments - obj2.comments,
                          total: obj3.comments
                        },
                        follows: {
                          current: obj3.follows - obj2.follows,
                          total: obj3.follows
                        },
                        messages: {
                          current: obj3.dms - obj2.dms,
                          total: obj3.dms
                        }
                      }
                    });
                  };
                  local10();
                  console.log("[Built-in-Debug] [处理视频] " + value3 + ", 配额: 点赞=" + obj2.likes + ", 评论=" + obj2.comments + ", 关注=" + obj2.follows + ", 私信=" + obj2.dms);
                  reportCurrentAction("正在分析视频：《" + value3.substring(0, 15) + "...》");
                  local6 = local2.comments;
                  let value7 = local2.comments;
                  reportCurrentAction("   └ 📊 视频数据: 赞 " + local2.likes + " | 评 " + local2.comments + " | 藏 " + local2.collects + " | 转 " + local2.shares);
                  const result2 = await waitForCommentDomWarmup(value, arg1, value7);
                  const result3 = resolveEffectiveCommentTotalCount(value, value7);
                  if (result3 === 0 && value7 > 0) {
                    console.log("[Built-in-Debug] [评论空态] 侧栏评=" + value7 + "，面板暂无评论，改为 0");
                    reportTraceLog("📭 评论区显示暂无评论（侧栏曾显示 " + value7 + "），按 0 条处理");
                    value7 = 0;
                    local6 = 0;
                  } else if (value7 > 0 && result2 === 0 && isCommentPanelEmptyHint(value)) {
                    value7 = 0;
                    local6 = 0;
                  }
                  if (value7 && value7 > 0) {
                    console.log("[Built-in-Debug] [慢设备保护] 评论总数 " + value7 + "，进入分析前已渲染评论节点 " + result2);
                  }
                  let flag = false;
                  let text2 = "";
                  const local11 = text6 || text5 || text;
                  const result4 = shouldForceSelectByIncludeTitle(value3);
                  if (result4) {
                    const result = getIncludeTitleKeywordMatch(value3);
                    reportTraceLog("🎯 标题命中包含词「" + result + "」，已选中（跳过人设预筛）");
                    if (shouldGenerateAiVideoMainPost(state.currentTask) && !hasVideoMainCommented(local11)) {
                      const value2 = local3 ? document : value;
                      const result = sampleVisibleCommentTexts(value2, 8);
                      text2 = await prefetchAiMainPostComment(value3, result, arg1);
                    }
                  } else if (shouldUsePersonaVideoFilter(state.currentTask)) {
                    const value2 = local3 ? document : value;
                    const result = sampleVisibleCommentTexts(value2, 10);
                    const local = shouldPrefetchMainPostWithVideoMatch(state.currentTask) && !hasVideoMainCommented(local11);
                    const result2 = await matchCurrentVideoForDy(value3, result, arg1, {
                      withMainPost: local
                    });
                    flag = result2?.pass === false;
                    if (!flag) {
                      text2 = String(result2?.mainPostComment || "").trim();
                    }
                  }
                  if (flag) {
                    console.log("[Built-in-Debug] [DY智能预筛] 视频《" + value3.substring(0, 20) + "...》不匹配，跳过采集互动");
                    reportCurrentAction("🎯 智能预筛不匹配，切换下一条视频...");
                  } else {
                    if (state.currentTask.enableVideoComment && state.currentTask.taskMode === "interaction" && !isInteractionLimitReached()) {
                      const local = text6 || text5 || text;
                      if (hasVideoMainCommented(local)) {
                        reportTraceLog("📝 视频主评：本账号已评论过此视频，跳过重复发表", null, "warning");
                      } else {
                        let list = [];
                        if (state.currentTask.videoCommentMode === "ai" && !state.currentTask.enableVideoCommentWithoutText && !text2) {
                          await ensureCommentPanelOpen(value, arg1);
                          const value2 = local3 ? document : value;
                          if (value7 !== null && value7 > 0) {
                            await sleep(500);
                          }
                          list = sampleVisibleCommentTexts(value2, 8);
                        }
                        reportCurrentAction("正在自动发表视频主贴评论...");
                        reportCommentFlowTrace("调用 postVideoComment", "videoKey=" + clipTraceText(local, 40));
                        let local2 = null;
                        try {
                          local2 = await postVideoComment(local3 ? getDouyinFeedScope() || value2 : value2, arg1, {
                            commentSamples: list,
                            videoKey: local,
                            videoTitle: value3,
                            prefetchedCommentText: text2
                          });
                        } catch (error) {
                          reportCommentFlowTrace("postVideoComment 异常", clipTraceText(error?.message || error, 80), "warning");
                          if (error?.message !== "TASK_ABORTED") {
                            throw error;
                          }
                          local2 = {
                            success: false,
                            error: "task_aborted",
                            aborted: true
                          };
                        }
                        reportCommentFlowTrace("postVideoComment 返回", "success=" + !!local2?.success + " skipped=" + !!local2?.skipped + " error=" + (local2?.error || "none"));
                        if (local2?.success) {
                          reportTraceLog("📝 视频主评：评论已提交 →「" + clipTraceText(local2.content || "", 32) + "」");
                          await awaitPostActionRest(arg1);
                          await awaitInteractionCooldown(arg1);
                        } else if (local2?.skipped && local2?.reason === "already_commented") {} else if (local2?.error) {
                          reportTraceLog("📝 视频主评：评论失败（" + clipTraceText(local2.error, 60) + "）");
                        }
                        reportCommentFlowTrace("主评阶段结束", "taskRunning=" + state.taskRunning + " budget L" + obj2.likes + "/C" + obj2.comments);
                      }
                    }
                    if (value7 === 0) {
                      console.log("[Built-in-Debug] 该视频总评论数为 0，跳过评论内滚，切换下一条。");
                      reportCurrentAction("⚠️ 检测到评论数为0，跳过评论区滚动...");
                    } else {
                      reportCommentFlowTrace("进入评论内滚", "totalCount=" + (value7 ?? "unknown") + " mode=" + state.currentTask.taskMode);
                      let num = 0;
                      let num2 = 0;
                      let num3 = 0;
                      let local2 = result2 || getVisibleCommentNodeCount(value);
                      let num4 = 0;
                      let result = getVisibleCommentViewportFingerprint(value);
                      let text2 = "";
                      let num5 = 0;
                      let num6 = 0;
                      let text3 = "";
                      const result3 = extractSpecificVideoId(text5 || text6 || text);
                      const value5 = window._commentScrapeProgress;
                      if (state.currentTask.taskMode === "scrape" && value5 && value5.videoId && value5.videoId === result3) {
                        num6 = Math.max(0, Number(value5.scrollRound) || 0);
                        num4 = Math.max(0, Number(value5.videoCollectedCount) || 0);
                        const result = findCommentScrollContainer(value);
                        if (result && value5.scrollTop > 0) {
                          result.scrollTop = value5.scrollTop;
                        }
                        reportTraceLog("🧷 评论" + (state.currentTask.taskMode === "scrape" ? "采集" : "解析") + "：从上次进度继续（约第 " + (num6 + 1) + " 轮，已入库 " + num4 + " 条）");
                        window._commentScrapeProgress = null;
                      }
                      let value6 = state.currentTask.taskMode === "scrape" ? 120 : 60;
                      if (value7 !== null && value7 > 0) {
                        const result = Math.ceil(value7 / 6 * 1.3);
                        const value = state.currentTask.taskMode === "scrape" ? 2000 : 100;
                        value6 = Math.min(result, value);
                        const value2 = state.currentTask.taskMode === "scrape" ? 50 : 20;
                        if (value6 < value2) {
                          value6 = value2;
                        }
                        console.log("[Built-in-Debug] [内滚优化] 视频总评论数 " + value7 + "，计算动态最大滚动次数为: " + value6 + " (任务模式: " + state.currentTask.taskMode + ")");
                      } else {
                        console.log("[Built-in-Debug] [内滚优化] 无法获取视频总评论数，使用默认最大滚动次数: " + value6);
                      }
                      const value8 = new weakSet();
                      const value9 = shouldExpandFoldedCommentReplies({
                        taskMode: "scrape"
                      }) ? {
                        failCount: 0,
                        skipExpand: false
                      } : null;
                      let num7 = 0;
                      for (let local3 = num6; local3 < value6; local3++) {
                        if (shouldAbort(arg1)) {
                          reportCommentFlowTrace("内滚中断", describeTaskAbortReason(arg1), "warning");
                          break;
                        }
                        if (getVisibleCommentNodeCount(value) === 0 && isCommentPanelEmptyHint(value)) {
                          reportTraceLog("📭 评论区显示暂无评论，结束本视频评论滚动");
                          value7 = 0;
                          local6 = 0;
                          break;
                        }
                        pauseVisibleDouyinVideos(value || value2);
                        if (isCurrentVideoPauseGuardDrifted(local7)) {
                          if (state.currentTask.taskMode === "scrape") {
                            saveCommentScrapeProgress(result3, local3, value, num4);
                          }
                          break;
                        }
                        if (isInteractionLimitReached()) {
                          break;
                        }
                        if (state.currentTask.taskMode === "interaction" && obj2.likes <= 0 && obj2.comments <= 0) {
                          console.log("[Built-in-Debug] [内滚] 本视频互动配额已用完，准备切换下一个...");
                          break;
                        }
                        const value5 = state.currentTask.taskMode === "scrape" ? getScrapeNoNewDataTolerance(value7, num4) : 10;
                        if (!text3 && num2 >= value5) {
                          const local = state.currentTask.taskMode === "scrape" && text2 === "session-duplicate" && shouldContinueScrapeAfterDuplicateWindow(value7, num4, value);
                          const local3 = state.currentTask.taskMode === "scrape" && shouldProbeIncompleteScrapeBoundary(value7, num4, num5);
                          if (local || local3) {
                            if (local3) {
                              num5++;
                            }
                            const result = getCommentScrollMetrics(value);
                            const value2 = local ? "同屏重复" : "低覆盖空窗";
                            const value3 = local3 ? ", probe=" + num5 + "/3" : "";
                            console.log("[Built-in-Debug] [内滚恢复] 连续 " + num2 + " 轮" + value2 + "，继续强推滚动复核边界 (remaining=" + Math.round(result.remaining) + "px, 已采=" + num4 + "/" + (value7 || "?") + value3 + ")");
                            reportCurrentAction(local3 ? "评论区可能未到底（已入库 " + num4 + "/" + (value7 || "未知") + "），正在第 " + num5 + "/3 次强制复核…" : "评论区仍未到底（已入库 " + num4 + "/" + (value7 || "未知") + "），继续恢复滚动加载…");
                            pruneStaleCommentDom(value);
                            await aggressiveCommentListScroll(value, arg1, num2);
                          } else {
                            const value = value7 ? "总评论约 " + value7 + " 条" : "总评论数未知";
                            reportTraceLog("📭 本视频采集结束：已连续 " + value5 + " 轮无新入库（本视频累计新入库 " + num4 + " 条，" + value + "，当前可见 " + local2 + " 个节点），切换下一个视频");
                            break;
                          }
                        }
                        if (state.currentTask.taskMode === "scrape" && shouldExpandFoldedCommentReplies({
                          taskMode: "scrape"
                        })) {
                          await expandReplies(value, arg1, value8, value9, {
                            taskMode: "scrape"
                          });
                        }
                        reportCurrentAction(formatScrapeCommentScrollAction(local3, value6, value7));
                        const result2 = await extractLeads(value, value3, arg1, obj2, local10, text5, {
                          nickname: value4,
                          profileUrl: local?.authorUrl || ""
                        });
                        pauseVisibleDouyinVideos(value || value2);
                        if (isCurrentVideoPauseGuardDrifted(local7)) {
                          if (state.currentTask.taskMode === "scrape") {
                            saveCommentScrapeProgress(result3, local3, value, num4);
                          }
                          break;
                        }
                        const result4 = getVisibleCommentNodeCount(value);
                        const result5 = getVisibleCommentViewportFingerprint(value);
                        const local4 = !!result5 && !!result && result5 !== result;
                        if (result5) {
                          result = result5;
                        }
                        num4 += result2.newLeadsCount || 0;
                        const local5 = text3 || getCommentEndHintText(value);
                        text3 = "";
                        if (local5) {
                          const result = clipTraceText(local5, 24);
                          console.log("[Built-in-Debug] [评论区到底] 检测到平台提示「" + result + "」，停止继续下拉");
                          reportCurrentAction("评论区已显示没有更多评论，准备切换下一个视频...");
                          reportTraceLog("📭 本视频评论区已到底：检测到「" + result + "」，不再重复下拉");
                          break;
                        }
                        const value10 = result4 > local2;
                        const value11 = value7 && value7 > 0 ? Math.min(value7, state.currentTask.taskMode === "scrape" ? 10 : 6) : 0;
                        const local8 = value7 && value7 > 0 && result4 > 0 && result4 < value11 && local3 < 6;
                        if (state.currentTask.taskMode === "interaction") {
                          if (result2.newLeadsCount === 0) {
                            if (value10 || local8) {
                              num7 = 0;
                              console.log("[Built-in-Debug] [慢设备保护] 暂未发现新增线索，但评论 DOM " + (value10 ? "仍在增长" : "仍在预热") + " (" + result4 + "/" + (value7 || "?") + ")，不判定历史边界");
                              reportCurrentAction("评论区仍在加载 (" + result4 + "/" + (value7 || "未知") + ")，继续等待分析...");
                            } else {
                              num7++;
                              console.log("[Built-in-Debug] [实时互动] 连续 " + num7 + " 次滚动未发现新增意向线索 (历史已存在或无新增)");
                            }
                            const num = 10;
                            if (num7 >= num) {
                              console.log("[Built-in-Debug] [实时互动] 连续 " + num + " 次滚动未发现新增线索，判定已到达历史处理边界，提前结束此视频");
                              reportTraceLog("📭 本视频互动结束：已连续 " + num + " 轮滚动仍无新增意向线索，切换下一个视频");
                              reportCurrentAction("⚠️ 连续多次未发现新增线索，可能已到达历史处理边界，准备切换下一个视频...");
                              break;
                            }
                          } else {
                            num7 = 0;
                          }
                        }
                        const value12 = result2.newLeadsCount > 0;
                        const local9 = value10 || local8;
                        const local11 = state.currentTask.taskMode === "scrape" && local4;
                        if (value12 || local9 || local11) {
                          num2 = 0;
                          num3 = 0;
                          text2 = "";
                          num5 = 0;
                          if (local11 && !value12) {
                            reportCurrentAction("评论区视口已翻页（可见 " + result4 + " 节点），继续向下采集…");
                          }
                        } else {
                          num2++;
                          const local = result2.parsedCount || 0;
                          const local2 = result2.sessionSkipCount || 0;
                          const local3 = local > 0 && local2 >= local;
                          if (state.currentTask.taskMode === "scrape") {
                            if (!local3 && local === 0) {
                              num3++;
                              text2 = "no-parsed";
                            } else if (local > 0 && local2 < local) {
                              num3++;
                              text2 = "non-session-duplicate";
                            } else if (local3) {
                              text2 = "session-duplicate";
                            }
                          } else {
                            num3++;
                            text2 = "";
                          }
                          const value2 = state.currentTask.taskMode === "scrape" ? getScrapeNoNewDataTolerance(value7, num4) : value5;
                          console.log("[Built-in-Debug] [内滚] 无新入库 (" + num2 + "/" + value2 + ")" + (state.currentTask.taskMode === "scrape" ? " 本视频已采" + num4 + "/" + (value7 || "?") + " 解析" + local + " 本任务重复" + local2 : ""));
                          if (state.currentTask.taskMode === "scrape" && local3) {
                            reportCurrentAction("评论区暂未翻到新内容（本屏 " + local + " 条均已录），加强滚动加载…");
                            await aggressiveCommentListScroll(value, arg1, num2);
                          } else {
                            const result = findCommentScrollContainer(value);
                            if (result) {
                              if (num2 <= 2) {
                                console.log("[Built-in-Debug] [内滚微调] 轻微抖动滚动以触发懒加载");
                                await scrollCommentList(value, -80, arg1, {
                                  delayMin: 60,
                                  delayMax: 120
                                });
                                await scrollCommentList(value, 220, arg1, {
                                  delayMin: 80,
                                  delayMax: 140
                                });
                              } else if (num2 <= 5) {
                                console.log("[Built-in-Debug] [内滚强推] 中等强度滚动（" + num2 + "次空窗）");
                                await scrollCommentList(value, -200, arg1, {
                                  delayMin: 80,
                                  delayMax: 140
                                });
                                await scrollCommentList(value, 1600, arg1, {
                                  delayMin: 120,
                                  delayMax: 220
                                });
                              } else {
                                console.log("[Built-in-Debug] [内滚极推] 高强度滚动（" + num2 + "次空窗）");
                                await aggressiveCommentListScroll(value, arg1, num2);
                              }
                            }
                          }
                        }
                        if (result4 > local2) {
                          local2 = result4;
                        }
                        const value13 = state.currentTask.taskMode === "scrape" ? getScrapeNoCompliantTolerance(value7, num4) : 10;
                        if (num3 >= value13) {
                          const value2 = value7 ? Math.round(num4 / value7 * 100) + "%" : "?";
                          if (state.currentTask.taskMode === "scrape" && shouldProbeIncompleteScrapeBoundary(value7, num4, num5)) {
                            num5++;
                            console.log("[Built-in-Debug] [内滚边界复核] 连续 " + value13 + " 次无有效评论可解析，但覆盖率仍低（已采 " + num4 + "/" + (value7 || "?") + "，" + value2 + "），第 " + num5 + "/3 次强推复核");
                            reportCurrentAction("评论区边界复核中（已入库 " + num4 + "/" + (value7 || "未知") + "，" + value2 + "），继续强推滚动…");
                            pruneStaleCommentDom(value);
                            await aggressiveCommentListScroll(value, arg1, num3);
                          } else {
                            console.log("[Built-in-Debug] [内滚边界] 连续 " + value13 + " 次无有效评论可解析，判定已到达数据边界（已采 " + num4 + "/" + (value7 || "?") + "，" + value2 + "）");
                            reportTraceLog("📭 本视频采集结束：已连续 " + value13 + " 轮无有效评论可解析（已入库 " + num4 + " 条，总评论约 " + (value7 || "未知") + " 条），切换下一个视频");
                            break;
                          }
                        }
                        pruneStaleCommentDom(value);
                        maybeTrimRuntimeMemory(value, "comment-scroll", state.currentTask.taskMode === "interaction" ? 25000 : 45000);
                        await scrollCommentList(value, 1100, arg1, {
                          delayMin: 50,
                          delayMax: 120
                        });
                        let value14 = state.currentTask.taskMode === "scrape" ? 800 : 1500;
                        let value15 = state.currentTask.taskMode === "scrape" ? 1800 : 3000;
                        if (value7 && value7 > 0) {
                          const [local, local4] = getAdaptiveCommentWaitRange({
                            phase: "post-scroll",
                            expectedTotalCount: value7,
                            visibleCount: Math.max(result4, local2),
                            emptyRounds: num2,
                            scrollIndex: local3
                          });
                          value14 = Math.max(value14, local);
                          value15 = Math.max(value15, local4);
                          if (value14 > 1800 || value15 > 3500) {
                            console.log("[Built-in-Debug] [慢设备保护] 自适应延长内滚等待: " + value14 + "-" + value15 + "ms (评论节点 " + Math.max(result4, local2) + "/" + value7 + ", 空窗 " + num2 + ")");
                          }
                        }
                        const result6 = await guardedCurrentVideoDelay(value14, value15, arg1, num2 > 0 ? "评论加载等待" : "内滚", obj, {
                          allowRandomPlay: false
                        });
                        if (!result6) {
                          if (local7) {
                            local7.drifted = true;
                          }
                          if (state.currentTask.taskMode === "scrape") {
                            saveCommentScrapeProgress(result3, local3, value, num4);
                          }
                          break;
                        }
                        text3 = getCommentEndHintText(value);
                      }
                    }
                  }
                } else {
                  reportCurrentAction("评论区仍未打开，跳过本条，切换下一条…");
                }
              } finally {
                local7?.stop();
              }
              if (isCurrentVideoPauseGuardDrifted(local7)) {
                const result = getCurrentVideoGuardState(obj);
                if (result.same || result.videoIdMatched) {
                  reportTraceLog("🧷 视频防跳：评论期抖动已忽略（视频 ID 未变）", null, "warning");
                } else if (value5 === "specific") {
                  const result = await ensureClaimedSpecificVideoUrl({
                    reuseActive: true
                  });
                  const result2 = normalizeUrl(window.location.href);
                  const local = result && isOnSpecificTargetVideo(result2, result);
                  if (local) {
                    reportTraceLog("🧷 指定视频：防跳误判，当前仍在目标视频页，从上次进度继续采集", null, "warning");
                    reportCurrentAction("仍在目标视频上，从上次评论进度继续…");
                    continue;
                  }
                  reportCurrentAction("指定视频在采集期间发生切换，正在重新打开目标链接...");
                  reportTraceLog("⚠️ 指定视频：确认已离开目标视频，将重新打开待处理链接", null, "warning");
                  await releaseAbandonedVideoClaim([obj.leadVideoUrl, obj.dedupKey, text5, text6, text], "specific_comment_drift");
                  clearPendingLeadVideoUrl();
                  if (result) {
                    window.location.href = result;
                    await waitSpecificVideoNavAppear(arg1);
                  }
                  continue;
                } else {
                  reportCurrentAction("评论分析期间发现视频已自动切换，重新识别当前页面...");
                  reportTraceLog("⚠️ 视频防跳：评论分析期间检测到视频已自动切换，已放弃旧视频记录并重新识别当前页面", null, "warning");
                  await releaseAbandonedVideoClaim([obj.leadVideoUrl, obj.dedupKey, text5, text6, text], "comment_drift");
                  clearPendingLeadVideoUrl();
                  continue;
                }
              }
              if (state.currentTask.taskMode === "scrape") {
                const result = extractSpecificVideoId(text5 || text6 || text);
                if (window._commentScrapeProgress?.videoId === result) {
                  window._commentScrapeProgress = null;
                }
              }
              if (local8) {
                set.add(value3);
              }
              set2.add(text6);
              markSpecificVideoCompletedThisSession(text6 || text5 || text);
              const local9 = getProcessedVideoKeyModule().normalizeProcessedVideoKey(isDouyinVideoShareUrl(text5) ? text5 : text6) || text6;
              getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local9);
              getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, text6);
              ipcRenderer.send("update-processed-videos", {
                url: local9,
                title: value3,
                platform: "douyin",
                timestamp: Date.now()
              });
              state.sessionProcessedCount++;
              num12 = 0;
              text4 = "";
              clearPendingLeadVideoUrl();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              reportCommentFlowTrace("视频处理完成", state.sessionProcessedCount + "/" + getPlannedVideoCountForDisplay(value5, state.currentTask) + " · 评论约 " + (local6 ?? "?") + " 条");
              ipcRenderer.send("automation-data", {
                type: "video-processed",
                payload: {
                  accountId: window._radar_account_id,
                  accountName: window._radar_account_name,
                  sessionCount: state.sessionProcessedCount,
                  targetCount: getPlannedVideoCountForDisplay(value5, state.currentTask),
                  commentsCount: local6 !== null ? local6 : undefined
                }
              });
              maybeTrimRuntimeMemory(value || value2 || document.body, "video-processed", 0);
            }
            if (value5 !== "specific" && state.sessionProcessedCount >= state.targetVideoCount) {
              try {
                document.querySelectorAll("video").forEach(arg1 => {
                  if (!arg1.paused) {
                    arg1.pause();
                  }
                });
                console.log("[Built-in-Debug] 目标达成，停止视频并结束任务");
              } catch (error) {}
              processScrapeAiQueue();
              ipcRenderer.send("keyword-finished", {
                taskId: arg1,
                keyword: value7
              });
              continue;
            }
            const result8 = getPlannedVideoCountForDisplay(value5, state.currentTask);
            console.log("[Built-in-Debug] 已处理 " + state.sessionProcessedCount + "/" + result8 + " 个视频，准备切换下一个...");
            reportCurrentAction("视频 " + state.sessionProcessedCount + "/" + result8 + " 已完成，正在切换下一个视频...");
            if (value5 === "specific") {
              console.log("[Built-in-Debug] [指定视频] 视频已完成，直接进入下一轮跳转下一个链接");
              const local = window._specificVideoUrls || [];
              clearClaimedSpecificVideoUrl();
              const result = await ensureClaimedSpecificVideoUrl({
                reuseActive: false,
                advance: true
              });
              if (result) {
                const result2 = normalizeSpecificVideoKey(result);
                state.lastClickedId = result2;
                rememberPendingLeadVideoUrl(result2);
                num7 = 0;
                text2 = "";
                console.log("[Built-in-Debug] [指定视频] 准备跳转领取目标: " + result);
                reportCurrentAction("正在打开指定视频…");
                window.location.href = result;
                await waitSpecificVideoNavAppear(arg1);
              } else {
                console.log("[Built-in-Debug] [指定视频] 无剩余视频，任务结束");
                reportCurrentAction("指定视频列表已全部处理，任务结束");
                await finishSpecificSourceTask(arg1, result6, "specific_completed", {
                  configuredCount: (window._specificVideoUrls || local || []).length
                });
                return;
              }
              continue;
            }
            const result9 = await (async () => {
              try {
                local4?.stop();
              } catch (error) {}
              local4 = null;
              try {
                local5?.stop();
              } catch (error) {}
              local5 = null;
              return advanceAfterSearchQueuedVideo(arg1, {
                videoTitle: value3,
                leadVideoUrl: text5,
                dedupKey: text6,
                modal: value2,
                phaseLabel: "导航",
                activeKeyword: local7 || value6 || "",
                sessionUrls: set2,
                onSwitchOk: local9
              });
            })();
            if (result9 === "navigating") {
              return;
            }
            if (result9 === "done" || result9 === "continued") {
              continue;
            }
            try {
              local4?.stop();
            } catch (error) {}
            local4 = null;
            try {
              local5?.stop();
            } catch (error) {}
            local5 = null;
            const local13 = getFeedVideoIdentity(getDouyinFeedScope() || value2) || "";
            await moveToNextVideo(arg1);
            const result10 = await awaitFeedVideoSwitchSettled(arg1, {
              previousIdentity: local13,
              previousTitle: value3,
              previousAuthor: value4,
              leadVideoUrl: text5,
              dedupKey: text6,
              phaseLabel: "导航",
              preferredScope: value || value2
            });
            if (result10) {
              local9();
            } else {
              const result = await local10("导航");
              if (result === "refresh") {
                return;
              }
              if (result === "advance") {
                continue;
              }
            }
            await guardedPauseDelay(1500, 3000, arg1, "切换喘息", value || value2);
            continue;
          } finally {
            try {
              local4?.stop();
            } catch (error) {}
            local4 = null;
            try {
              local5?.stop();
            } catch (error) {}
            local5 = null;
          }
        }
        if (result2) {
          reportCurrentAction("推荐流未识别到播放器，切换下一条...");
          await moveToNextVideo(arg1);
          await randomDelay(2000, 4000, arg1, "推荐流切换");
          continue;
        }
        if (value5 === "like") {
          if (canLinkOnlyScrapeWithoutOpen(state.currentTask)) {
            ensureLeadgenScrapeApiHook();
            const result = getScrapeTargetSet(state.currentTask).has("author");
            const result2 = findProfileVideoCards({
              ignoreNoWorksGuard: true
            });
            const value = Array.isArray(window._likedVideoUrls) ? window._likedVideoUrls : [];
            let num = 0;
            let local = null;
            if (result && listLeadgenScrapeAwemes().length < Math.min(8, value.length || 8)) {
              reportCurrentAction("正在等待喜欢列表接口补齐作者主页...");
              window.scrollBy(0, 600);
              await sleep(900);
              window.scrollBy(0, -200);
              await sleep(600);
            }
            for (const item of listLeadgenScrapeAwemes()) {
              if (state.sessionProcessedCount >= state.targetVideoCount) {
                break;
              }
              const result2 = await emitLinkOnlyScrapeLead({
                videoUrl: item.videoUrl,
                title: item.title,
                authorNickname: item.authorNickname,
                authorUrl: item.authorUrl,
                source: "api_json",
                likedBoundaryUrls: value.length ? value : null
              });
              if (result2.emitted) {
                num += 1;
                if (result2.videoUrl) {
                  if (!window._likedVideoUrls) {
                    window._likedVideoUrls = [];
                  }
                  if (!window._likedVideoUrls.includes(result2.videoUrl) && !window._likedVideoUrls.some(arg1 => extractSpecificVideoId(arg1) === extractSpecificVideoId(result2.videoUrl))) {
                    window._likedVideoUrls.push(result2.videoUrl);
                  }
                }
              } else if (result && result2.reason === "missing_author" && !local) {
                local = {
                  videoUrl: item.videoUrl,
                  title: item.title,
                  authorNickname: item.authorNickname
                };
              }
            }
            for (const item of value) {
              if (state.sessionProcessedCount >= state.targetVideoCount) {
                break;
              }
              const result3 = lookupLeadgenScrapeAweme(item);
              const result4 = await emitLinkOnlyScrapeLead({
                videoUrl: result3?.videoUrl || item,
                title: result3?.title || "喜欢列表视频",
                authorNickname: result3?.authorNickname || "",
                authorUrl: result3?.authorUrl || "",
                source: result3 ? "api_json" : "like_card",
                likedBoundaryUrls: value
              });
              if (result4.emitted) {
                num += 1;
              } else if (result && result4.reason === "missing_author") {
                const result = result2.find(arg1 => {
                  let local = arg1.href || arg1.getAttribute?.("href") || "";
                  if (!local) {
                    const local2 = arg1.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]");
                    local = local2?.href || local2?.getAttribute?.("href") || "";
                  }
                  const result = extractSpecificVideoId(local);
                  const result2 = extractSpecificVideoId(item);
                  return result && result2 && result === result2;
                });
                if (!local || !local.clickTarget && result) {
                  local = {
                    videoUrl: result3?.videoUrl || item,
                    title: result3?.title || "喜欢列表视频",
                    authorNickname: result3?.authorNickname || "",
                    clickTarget: result || null
                  };
                }
              }
            }
            for (const item of result2) {
              if (state.sessionProcessedCount >= state.targetVideoCount) {
                break;
              }
              let local2 = item.href || item.getAttribute("href");
              if (!local2) {
                const result = item.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
                if (result) {
                  local2 = result.href || result.getAttribute("href");
                }
              }
              const result2 = normalizeUrl(local2 || "");
              if (!result2) {
                continue;
              }
              if (value.length && !value.includes(result2) && !value.some(arg1 => extractSpecificVideoId(arg1) === extractSpecificVideoId(result2))) {
                continue;
              }
              const result3 = resolveSearchCardScrapeFields(item, result2);
              const result4 = await emitLinkOnlyScrapeLead({
                videoUrl: result3.videoUrl || result2,
                title: result3.title,
                authorNickname: result3.authorNickname,
                authorUrl: result3.authorUrl,
                source: result3.fromApi ? "api_json" : "like_card",
                likedBoundaryUrls: value.length ? value : null
              });
              if (result4.emitted) {
                num += 1;
              } else if (result && result4.reason === "missing_author" && item) {
                if (!local || !local.clickTarget) {
                  local = {
                    videoUrl: result3.videoUrl || result2,
                    title: result3.title,
                    authorNickname: result3.authorNickname,
                    clickTarget: item
                  };
                }
              }
            }
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            if (num > 0) {
              num9 = 0;
              reportCurrentAction("喜欢列表已采集 " + num + " 条（" + state.sessionProcessedCount + "/" + state.targetVideoCount + "）");
            } else {
              num9 += 1;
              if (result) {
                reportCurrentAction("喜欢列表暂未拿到作者主页，继续加载或补采…");
              }
            }
            if (state.sessionProcessedCount >= state.targetVideoCount) {
              continue;
            }
            if (result && local?.videoUrl) {
              state.lastClickedId = local.videoUrl;
              rememberPendingLeadVideoUrl(local.videoUrl);
              reportCurrentAction("喜欢列表未识别到作者主页，打开视频补采：@" + (local.authorNickname || "未知作者"));
              reportTraceLog("👤 主页补采：打开《" + clipTraceText(local.title, 32) + "》获取作者主页");
              if (local.clickTarget) {
                await simulateTrustedElementClick(local.clickTarget, arg1, "打开喜欢列表视频补采作者");
              } else {
                window.location.href = local.videoUrl;
              }
              num9 = 0;
              await randomDelay(3500, 5500, arg1, "打开喜欢视频补采作者主页");
              continue;
            }
            const local2 = window._likedVideoUrls && window._likedVideoUrls.length > 0 && window._likedVideoUrls.every(arg1 => getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, arg1));
            const value2 = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            if (local2 && num === 0 && !window.__radar_like_link_reclaim_pass) {
              window.__radar_like_link_reclaim_pass = true;
              const result = getProcessedVideoKeyModule();
              for (const item of value) {
                if (typeof result.forgetProcessedVideoKey === "function") {
                  result.forgetProcessedVideoKey(state.processedVideos, item);
                } else {
                  state.processedVideos.delete(item);
                }
              }
              reportCurrentAction("检测到历史去重占坑，正在重新写入线索库…");
              reportTraceLog("♻️ 喜欢列表：已释放本批历史去重，重新入库（线索库删除后可重采）");
              num9 = 0;
              continue;
            }
            if (local2 && num === 0 || num9 >= 8 || value2 && num9 >= 3 && num === 0) {
              reportCurrentAction(num > 0 ? "喜欢列表链接已直采完毕，正在结束任务..." : "喜欢列表没有新可入库视频（可能仍在历史已分析中），正在结束任务...");
              await finalizeAccountTask(arg1, "like_list_completed", {}, {
                storageKey: result6
              });
              return;
            }
            if (local2 && num > 0) {
              reportCurrentAction("喜欢列表链接已直采完毕，正在结束任务...");
              await finalizeAccountTask(arg1, "like_list_completed", {}, {
                storageKey: result6
              });
              return;
            }
            reportCurrentAction("喜欢列表继续滚动加载（" + num9 + "/8）…");
            window.scrollBy(0, 1000);
            await randomDelay(1800, 3200, arg1, "加载更多喜欢视频");
            continue;
          }
          const result = findProfileVideoCards({
            ignoreNoWorksGuard: true
          });
          console.log("[Built-in-Debug] [喜欢页] 扫描到 " + result.length + " 个潜在卡片");
          reportCurrentAction("喜欢页已定位到 " + result.length + " 个可见视频卡片，正在筛选未处理的喜欢视频...");
          let flag = false;
          for (const item of result) {
            let local = item.href || item.getAttribute("href");
            if (!local) {
              const result = item.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
              if (result) {
                local = result.href || result.getAttribute("href");
              }
            }
            const result = normalizeUrl(local || "");
            if (!result) {
              continue;
            }
            const local2 = window._likedVideoUrls && window._likedVideoUrls.includes(result);
            if (local2 && !getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, result) && result !== state.lastClickedId) {
              state.lastClickedId = result;
              rememberPendingLeadVideoUrl(result);
              console.log("[Built-in-Debug] [喜欢页] 准备点击未处理的喜欢视频: " + result);
              reportCurrentAction("正在打开喜欢列表中的视频 (链接末尾: ..." + result.substring(result.length - 12) + ")");
              reportTraceLog("👆 轨迹详情：正在点击打开喜欢列表中的未处理视频: " + result);
              await simulateTrustedElementClick(item, arg1, "打开喜欢列表视频");
              flag = true;
              await randomDelay(5000, 7000, arg1);
              break;
            }
          }
          if (flag) {
            num9 = 0;
          } else {
            num9++;
            const value = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            const local = window._likedVideoUrls && window._likedVideoUrls.every(arg1 => getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, arg1));
            if (local || num9 >= 6 || value && num9 >= 3) {
              console.log("[Built-in-Debug] [喜欢页竭尽] 喜欢列表视频已全部处理完毕或已到底。");
              reportCurrentAction("喜欢列表的视频已全部处理，正在结束任务...");
              await finalizeAccountTask(arg1, "like_list_completed", {}, {
                storageKey: result6
              });
              return;
            }
            reportCurrentAction("未发现未处理的喜欢视频，正在向下滚动加载更多视频卡片 (" + num9 + "/6)...");
            window.scrollBy(0, 1000);
            await randomDelay(3000, 5000, arg1);
          }
          continue;
        }
        if (value5 === "specific") {
          try {
            ensureSpecificVideoApiHook();
          } catch (error) {}
          const local = window._specificVideoUrls || [];
          const result = await ensureClaimedSpecificVideoUrl({
            reuseActive: true
          });
          if (!result) {
            console.log("[Built-in-Debug] [指定视频] 所有指定视频已处理完毕，任务结束");
            reportCurrentAction("指定视频列表已全部处理，任务结束");
            await finishSpecificSourceTask(arg1, result6, "specific_completed", {
              configuredCount: (window._specificVideoUrls || local || []).length
            });
            return;
          }
          const value = window.location.href;
          const result2 = extractSpecificVideoId(result);
          const result3 = evaluateSpecificVideoOpenProgress(result);
          const result4 = loadSpecificVideoState(result2);
          const local2 = Number(result4.loadStartedAt) || 0;
          const value2 = local2 > 0 ? Date.now() - local2 : 0;
          if (result3 === "ready") {
            num6 = 0;
            num5 = 0;
            saveSpecificVideoState(result2, {
              loadStartedAt: 0,
              probed: true,
              count: 0
            });
            num8 += 1;
            if (num8 <= 3) {
              reportCurrentAction(num8 === 1 ? "指定视频详情已出现，准备进入处理..." : "指定视频详情已出现，正在对齐处理入口… (" + num8 + "/3)");
              await randomDelay(500, 900, arg1, "指定视频详情就绪");
              continue;
            }
            num8 = 0;
            reportTraceLog("⚠️ 指定视频已判就绪但详情容器未识别，改走打开探测", null, "warning");
            reportCurrentAction("详情容器未识别，正在重新对齐指定视频…");
          } else {
            num8 = 0;
          }
          if (result3 === "unavailable" || result3 === "bare_jingxuan") {
            reportCurrentAction(result3 === "bare_jingxuan" ? "当前像精选空壳，先耐心等待详情弹窗…" : "检测到疑似失效提示，先确认是否真失效…");
          }
          state.lastClickedId = normalizeSpecificVideoKey(result);
          rememberPendingLeadVideoUrl(state.lastClickedId);
          const local3 = local2 > 0 && value2 < specificVideoLoadTimeoutMs && Number(result4.openAttempt) > 0 && (isOnSpecificTargetVideo(value, result) || result3 === "loading" || result3 === "waiting" || result3 === "bare_jingxuan" || result3 === "unavailable");
          if (local3) {
            const result2 = Math.max(3000, specificVideoLoadTimeoutMs - value2);
            const value = result3 === "loading" || isDouyinJingxuanContentLoading() ? "检测到「加载中」，等待页面加载完成" : "指定视频打开中，耐心等待";
            reportCurrentAction(value + "… (" + Math.floor(value2 / 1000) + "s/" + Math.floor(specificVideoLoadTimeoutMs / 1000) + "s，第 " + result4.openAttempt + "/" + specificVideoOpenRetryMax + " 次)");
            const result5 = await awaitSpecificVideoOpenSettle(arg1, result, result2);
            if (result5 === "aborted") {
              return;
            }
            if (result5 === "ready") {
              num6 = 0;
              num5 = 0;
              continue;
            }
            if (result5 === "unavailable" || result5 === "bare_jingxuan") {
              const result2 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, result5 === "bare_jingxuan" ? "unavailable_bare_jingxuan" : "unavailable");
              if (result2 === "done") {
                return;
              }
              continue;
            }
            if (Number(result4.openAttempt) < specificVideoOpenRetryMax) {
              const result2 = isDouyinJingxuanContentLoading();
              reportCurrentAction(result2 ? "「加载中」超过 1 分钟，重新进入指定视频 (" + (Number(result4.openAttempt) + 1) + "/" + specificVideoOpenRetryMax + ")…" : "加载过慢，重新进入指定视频 (" + (Number(result4.openAttempt) + 1) + "/" + specificVideoOpenRetryMax + ")…");
              const result3 = await openSpecificVideoWithRetries(arg1, result);
              if (result3 === "aborted") {
                return;
              }
              if (result3 === "ready") {
                continue;
              }
              if (result3 === "unavailable") {
                const result2 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, "unavailable_open");
                if (result2 === "done") {
                  return;
                }
                continue;
              }
            }
            reportCurrentAction("精选打开多次超时，改用播放页再试一次…");
            const result7 = await probeSpecificVideoOnDirectPage(arg1, result);
            if (result7 === "aborted") {
              return;
            }
            if (result7 === "ready") {
              continue;
            }
            const result8 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, result7 === "unavailable" ? "unavailable_probe" : "load_timeout");
            if (result8 === "done") {
              return;
            }
            continue;
          }
          const result5 = await openSpecificVideoWithRetries(arg1, result);
          if (result5 === "aborted") {
            return;
          }
          if (result5 === "ready") {
            num6 = 0;
            num5 = 0;
            continue;
          }
          if (result5 === "unavailable") {
            const result2 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, "unavailable_open");
            if (result2 === "done") {
              return;
            }
            continue;
          }
          reportCurrentAction("精选打开多次超时，改用播放页再试一次…");
          const result7 = await probeSpecificVideoOnDirectPage(arg1, result);
          if (result7 === "aborted") {
            return;
          }
          if (result7 === "ready") {
            continue;
          }
          const result8 = await skipFailedSpecificVideoAndOpenNext(arg1, result6, result, local, result7 === "unavailable" ? "unavailable_probe" : "load_timeout");
          if (result8 === "done") {
            return;
          }
          continue;
        }
        if (value5 !== "search") {
          reportCurrentAction("当前入口暂未发现可处理视频，正在切换下一条内容...");
          await moveToNextVideo(arg1);
          await guardedPauseDelay(2000, 4000, arg1, "入口切换", value2 || document);
          continue;
        }
        window._lastModalVisible = false;
        const {
          cardMap: cardMap,
          allLinks: allLinks,
          customCards: customCards
        } = buildDouyinSearchResultCardMap();
        console.log("[Built-in-Debug] [搜索页] 解析出 " + cardMap.size + " 个独特视频/图文链接");
        window._searchCardCount = cardMap.size;
        if (cardMap.size > 0) {
          clearSearchZeroCardRecoveryState(arg1, value6);
        }
        const value8 = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
        const local2 = value8.length > 0 && shouldUseSearchVideoUrlQueue(state.currentTask);
        let value9 = cardMap.size === 0 ? maybeReportDouyinSearchZeroDiagnostics({
          standardLinkCount: allLinks.length,
          customCardCount: customCards.length
        }) : null;
        if (value9?.loginGate) {
          await awaitSearchPageLoginGate(arg1);
          continue;
        }
        if (cardMap.size === 0 && !value9?.emptyResult) {
          const result = readSearchZeroCardRecoveryState(arg1, value6);
          if (!result.exhausted && result.scans === 0) {
            const result = getDouyinSearchZeroCardWaitBudgetMs();
            const result2 = isCurrentTaskUsingProxy();
            reportCurrentAction("搜索结果仍在加载，" + ("额外等待最多 " + Math.ceil(result / 1000) + " 秒..."));
            reportTraceLog("🌐 搜索慢网保护：为关键词「" + value6 + "」额外等待最多 " + (Math.ceil(result / 1000) + " 秒（" + (result2 ? "代理" : "直连") + "，出现结果立即继续）"));
            const result3 = await waitForDouyinSearchContentAfterZero(arg1, value6);
            if (result3.aborted) {
              continue;
            }
            if (result3.ready) {
              console.log("[Built-in-Debug] [搜索慢网等待] 结果已恢复，耗时 " + ((result3.waitedMs || 0) + "ms"));
              reportCurrentAction("搜索结果已恢复，继续处理关键词「" + value6 + "」...");
              reportTraceLog("✅ 搜索结果延迟加载后已恢复：等待 " + (((result3.waitedMs || 0) / 1000).toFixed(1) + " 秒"));
              continue;
            }
            if (result3.diagnostics) {
              value9 = result3.diagnostics;
            }
            if (value9?.loginGate) {
              await awaitSearchPageLoginGate(arg1);
              continue;
            }
          }
        }
        if (cardMap.size === 0 && value9?.emptyResult) {
          const result = readSearchZeroCardRecoveryState(arg1, value6);
          result.emptyConfirmations += 1;
          result.scans = 0;
          result.exhausted = result.emptyConfirmations >= 2;
          saveSearchZeroCardRecoveryState(arg1, value6, result);
          if (!result.exhausted) {
            reportCurrentAction("搜索页提示暂无结果，保留关键词「" + value6 + "」并再次确认...");
            reportTraceLog("⏳ 搜索空结果确认：保留「" + value6 + "」，稍后复查 (1/2)", null, "warning");
            await randomDelay(isCurrentTaskUsingProxy() ? 8000 : 3500, isCurrentTaskUsingProxy() ? 12000 : 5500, arg1, "确认搜索空结果");
            continue;
          }
          reportCurrentAction("关键词「" + value6 + "」已连续两次明确返回空结果，即将切换新词或结束任务...");
          reportTraceLog("ℹ️ 搜索词「" + value6 + "」连续两次明确无结果，停止无效滚动", null, "warning");
          state.sessionProcessedCount = state.targetVideoCount;
          num9 = 0;
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          continue;
        }
        if (cardMap.size === 0) {
          const result = readSearchZeroCardRecoveryState(arg1, value6);
          result.emptyConfirmations = 0;
          result.scans += 1;
          if (!result.exhausted && result.scans < searchZeroCardScansBeforeReload) {
            saveSearchZeroCardRecoveryState(arg1, value6, result);
            reportCurrentAction("搜索结果暂未渲染，保留关键词「" + value6 + "」并等待重试 " + ("(" + result.scans + "/" + searchZeroCardScansBeforeReload + ")..."));
            reportTraceLog("⏳ 搜索页暂时无作品 DOM：保留「" + value6 + "」，原页等待恢复 " + ("(" + result.scans + "/" + searchZeroCardScansBeforeReload + ")"), null, "warning");
            await randomDelay(1000, 1800, arg1, "等待搜索结果渲染");
            continue;
          }
          if (!result.exhausted && result.reloads < searchZeroCardMaxReloads) {
            result.reloads += 1;
            result.scans = 0;
            saveSearchZeroCardRecoveryState(arg1, value6, result);
            console.warn("[Built-in-Debug] [搜索页自愈] 结果 DOM 持续为空，刷新同一关键词 " + ("(" + result.reloads + "/" + searchZeroCardMaxReloads + "): " + value6));
            reportCurrentAction("搜索结果仍未渲染，正在刷新同一关键词「" + value6 + "」 " + ("(" + result.reloads + "/" + searchZeroCardMaxReloads + ")..."));
            reportTraceLog("🔄 搜索页自愈：保留「" + value6 + "」并刷新恢复 " + ("(" + result.reloads + "/" + searchZeroCardMaxReloads + ")"), null, "warning");
            clearPendingLeadVideoUrl();
            resetSearchCardOpenFailureState();
            prepareSearchPageReload(arg1, value6, "零卡片自愈刷新");
            suspendAutomationForNavigation();
            const result2 = buildDouyinSearchUrl(value6);
            const value = window.location.href.split(/[?#]/)[0];
            const value2 = result2.split(/[?#]/)[0];
            if (value === value2) {
              window.location.reload();
            } else {
              window.location.href = result2;
            }
            return;
          }
          result.exhausted = true;
          saveSearchZeroCardRecoveryState(arg1, value6, result);
          reportCurrentAction("关键词「" + value6 + "」刷新 " + searchZeroCardMaxReloads + " 次后仍无搜索结果，即将切换新词或结束任务...");
          reportTraceLog("⚠️ 搜索页自愈已达上限：保留词「" + value6 + "」仍无作品 DOM，切换下一词以避免死循环", null, "warning");
          state.sessionProcessedCount = state.targetVideoCount;
          num9 = 0;
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          continue;
        }
        reportCurrentAction("搜索页已定位到 " + cardMap.size + " 个可见内容卡片，准备进行筛选分析...");
        const result3 = canLinkOnlyScrapeWithoutOpen(state.currentTask);
        if (result3) {
          ensureLeadgenScrapeApiHook();
          const result = getScrapeTargetSet(state.currentTask);
          const result2 = result.has("author");
          let num = 0;
          let num2 = 0;
          let local = null;
          if (result2) {
            for (let num = 0; num < 3; num++) {
              let num2 = 0;
              let num3 = 0;
              for (const [local, local2] of cardMap.entries()) {
                if (getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, local)) {
                  continue;
                }
                num3++;
                const local3 = local2?.card || getDouyinSearchCardRoot(local2?.clickTarget);
                const result = resolveSearchCardScrapeFields(local3, local);
                if (!result.authorUrl || !result.authorNickname) {
                  num2++;
                }
              }
              const result = listLeadgenScrapeAwemes().some(arg1 => arg1.authorUrl && arg1.authorNickname);
              if (num3 > 0 && num2 === num3 && !result) {
                console.log("[Built-in-Debug] [React Warmup] " + num2 + "/" + num3 + " cards are missing author URLs on attempt " + (num + 1) + ". Waiting 400ms for React/API...");
                await sleep(400);
                continue;
              }
              break;
            }
          }
          for (const item of listLeadgenScrapeAwemes()) {
            if (state.sessionProcessedCount >= state.targetVideoCount) {
              break;
            }
            const result = await emitLinkOnlyScrapeLead({
              videoUrl: item.videoUrl,
              title: item.title,
              authorNickname: item.authorNickname,
              authorUrl: item.authorUrl,
              source: "api_json"
            });
            if (result.emitted) {
              num += 1;
              set2.add(result.videoUrl);
            } else if (result.reason === "exclude_title" || result.reason === "include_title" || result.reason === "exclude_author") {
              num2 += 1;
            } else if (result2 && result.reason === "missing_author" && !local) {
              local = {
                videoUrl: item.videoUrl,
                title: item.title,
                authorNickname: item.authorNickname,
                clickTarget: null
              };
            }
          }
          for (const [local2, local3] of cardMap.entries()) {
            if (state.sessionProcessedCount >= state.targetVideoCount) {
              break;
            }
            if (getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, local2)) {
              continue;
            }
            const local4 = local3?.card || getDouyinSearchCardRoot(local3?.clickTarget);
            const result = resolveSearchCardScrapeFields(local4, local2);
            const result3 = await emitLinkOnlyScrapeLead({
              videoUrl: result.videoUrl || local2,
              title: result.title,
              authorNickname: result.authorNickname,
              authorUrl: result.authorUrl,
              source: result.fromApi ? "api_json" : "search_card"
            });
            if (result3.emitted) {
              num += 1;
              set2.add(result3.videoUrl);
              continue;
            }
            if (result3.reason === "exclude_title" || result3.reason === "include_title" || result3.reason === "exclude_author") {
              num2 += 1;
              continue;
            }
            if (result2 && result3.reason === "missing_author" && local3?.clickTarget) {
              if (!local || !local.clickTarget) {
                local = {
                  videoUrl: result.videoUrl || local2,
                  title: result.title,
                  authorNickname: result.authorNickname,
                  clickTarget: local3.clickTarget
                };
              }
            }
          }
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          if (num > 0) {
            num9 = 0;
            reportCurrentAction("本屏已直采 " + num + " 条" + (num2 ? "，过滤 " + num2 + " 条" : "") + "（" + state.sessionProcessedCount + "/" + state.targetVideoCount + "），未打开视频");
          } else {
            num9 += 1;
          }
          if (state.sessionProcessedCount >= state.targetVideoCount) {
            continue;
          }
          if (result2 && local?.videoUrl) {
            if (!local.clickTarget) {
              for (const [local2, local3] of cardMap.entries()) {
                const result = extractSpecificVideoId(local2);
                const result2 = extractSpecificVideoId(local.videoUrl);
                if (result && result2 && result === result2 && local3?.clickTarget) {
                  local.clickTarget = local3.clickTarget;
                  break;
                }
              }
            }
            state.lastClickedId = local.videoUrl;
            rememberPendingLeadVideoUrl(local.videoUrl);
            reportCurrentAction("卡片未直接识别到作者主页，正在打开视频补采：@" + (local.authorNickname || "未知作者"));
            reportTraceLog("👤 主页补采：打开《" + clipTraceText(local.title, 32) + "》获取作者主页");
            if (local.clickTarget) {
              await simulateHumanClick(local.clickTarget, arg1);
            } else {
              window.location.href = local.videoUrl;
            }
            num9 = 0;
            await randomDelay(3500, 5500, arg1, "打开视频补采作者主页");
            continue;
          }
          const value = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
          const result3 = getVideoSearchCollectionEngineModule();
          const value2 = result3?.evaluateVideoSearchCollectionRound ? result3.evaluateVideoSearchCollectionRound({
            previousEmptyRounds: num > 0 ? 0 : Math.max(0, num9 - 1),
            added: num,
            atBottom: value,
            emptyLimit: 6,
            bottomEmptyLimit: 3
          }) : {
            emptyRounds: num9,
            shouldStop: num9 >= 6 || value && num9 >= 3
          };
          num9 = value2.emptyRounds;
          if (value2.shouldStop) {
            reportCurrentAction("搜索结果已到底，即将切换新词或结束任务...");
            state.sessionProcessedCount = state.targetVideoCount;
            num9 = 0;
            continue;
          }
          if (result3?.performVideoSearchWindowScroll) {
            await result3.performVideoSearchWindowScroll({
              scrollBy: arg1 => window.scrollBy(0, arg1),
              wait: arg12 => randomDelay(arg12, arg12, arg1, "加载更多搜索结果"),
              readApiCount: () => listLeadgenScrapeAwemes().length,
              readDomCount: () => collectDouyinSearchResultCards().length,
              readViewport: () => ({
                y: window.scrollY || 0,
                innerWidth: window.innerWidth || 0,
                innerHeight: window.innerHeight || 0,
                scrollHeight: document.documentElement.scrollHeight || 0
              }),
              delta: 1000,
              waitMinMs: 1800,
              waitMaxMs: 3200
            });
          } else {
            window.scrollBy(0, 1000);
            await randomDelay(1800, 3200, arg1, "加载更多搜索结果");
          }
          continue;
        }
        pruneSearchCardOpenFailures();
        let flag = false;
        let flag2 = false;
        let num3 = 0;
        if (local2) {
          const result = peekSearchPendingOpenUrl();
          if (result && !isSearchQueueUrlSessionDone(result, set2)) {
            reportCurrentAction("正在恢复打开搜索队列待处理视频 (链接末尾: ..." + result.slice(-12) + ")");
            reportTraceLog("🔗 搜索队列恢复打开：…" + String(result).slice(-16));
            setSearchPendingOpenUrl(result);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            const result2 = await openSearchQueueVideoByUrl(arg1, result, {
              allowHardNavigation: true,
              softWaitMs: 4000,
              hardWaitMs: 6500
            });
            if (result2 === "navigating") {
              num9 = 0;
              return;
            }
            if (result2 === "ready") {
              const local = !!resolveDouyinVideoDetailModal({
                includeFeed: false
              }) && isViewingDouyinVideoPage();
              if (!local) {
                reportTraceLog("⚠️ 搜索队列恢复打开误报 ready，保留待处理并结束本轮：…" + String(result).slice(-16), null, "warning");
                setSearchPendingOpenUrl(result);
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                return;
              }
              clearSearchPendingOpenUrl();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              rememberSearchCardOpenSuccess(result);
              state.lastClickedId = result;
              flag = true;
              num9 = 0;
              continue;
            }
            reportTraceLog("⚠️ 搜索队列恢复打开失败，改硬跳待处理视频：…" + String(result).slice(-16), null, "warning");
            setSearchPendingOpenUrl(result);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            suspendAutomationForNavigation();
            try {
              const result2 = extractSpecificVideoId(result);
              const url = new URL(window.location.href);
              if (result2) {
                url.searchParams.set("modal_id", result2);
              }
              window.location.href = result2 ? url.toString() : result;
            } catch (error) {
              const result2 = extractSpecificVideoId(result);
              window.location.href = result2 ? "https://www.douyin.com/jingxuan?modal_id=" + result2 : result;
            }
            return;
          } else if (result && isSearchQueueUrlSessionDone(result, set2)) {
            clearSearchPendingOpenUrl();
            if (window._saveRadarState) {
              window._saveRadarState();
            }
          }
        }
        const result5 = (() => {
          if (!local2) {
            return Array.from(cardMap.entries());
          }
          const map = new Map();
          for (const [local, local2] of cardMap.entries()) {
            const result = extractSpecificVideoId(local);
            if (result && !map.has(result)) {
              map.set(result, {
                url: local,
                record: local2
              });
            }
          }
          return value8.map(arg1 => {
            const result = extractSpecificVideoId(arg1);
            const value = result ? map.get(result) : null;
            return [arg1, value?.record || {
              clickTarget: null,
              card: null
            }];
          });
        })();
        for (const [local, local2] of result5) {
          if (isSearchQueueUrlSessionDone(local, set2) || local === state.lastClickedId) {
            continue;
          }
          if (getProcessedVideoKeyModule().hasProcessedVideoKey(state.processedVideos, local)) {
            markSearchQueueUrlSkipped(local, set2);
            continue;
          }
          if (shouldSkipSearchCardAfterOpenFailures(local)) {
            num3 += 1;
            continue;
          }
          state.lastClickedId = local;
          rememberPendingLeadVideoUrl(local);
          console.log("[Built-in-Debug] [搜索页] 准备点击未处理视频: " + local);
          reportCurrentAction("正在打开新视频卡片 (链接末尾: ..." + local.substring(local.length - 12) + ")");
          const local3 = local2?.clickTarget || local2?.card;
          const local4 = local2?.card || getDouyinSearchCardRoot(local3);
          let flag3 = false;
          if (local3) {
            try {
              await simulateHumanClick(local3, arg1);
            } catch (error) {
              const result = rememberSearchCardOpenFailure(local, "click-error:" + (error?.message || error));
              console.warn("[Built-in-Debug] [搜索页] 卡片点击失败 (" + result + "/" + searchCardOpenFailureSkipAfter + "): " + local, error);
              clearPendingLeadVideoUrl();
              state.lastClickedId = null;
              continue;
            }
            flag3 = await waitForVideoDetailReadyAndPause(arg1, local, 4000);
            if (!flag3 && local3 !== local4 && local4) {
              try {
                const local = getDouyinSearchCardClickTarget(local4) || local4;
                await simulateHumanClick(local, arg1);
              } catch (error) {}
              flag3 = await waitForVideoDetailReadyAndPause(arg1, local, 3500);
            }
          }
          if (!flag3) {
            const local2 = extractSpecificVideoId(local) || extractVideoIdFromHref(local);
            if (local2 && !shouldAbort(arg1)) {
              console.log("[Built-in-Debug] [搜索页] 点击未拉起弹窗，触发 modal_id 强打开兜底: " + local2);
              reportCurrentAction("正在跳转打开视频详情 (modal_id=" + local2 + ")...");
              setSearchPendingOpenUrl(local);
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              suspendAutomationForNavigation();
              try {
                const url = new URL(window.location.href);
                url.searchParams.set("modal_id", local2);
                window.location.href = url.toString();
              } catch (error) {
                window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + local2;
              }
              return;
            }
          }
          if (flag3) {
            rememberSearchCardOpenSuccess(local);
            clearSearchPendingOpenUrl();
            flag = true;
            break;
          }
          const result = rememberSearchCardOpenFailure(local, "detail-timeout");
          console.warn("[Built-in-Debug] [搜索页] 卡片打开后未进入视频详情 (" + result + "/" + searchCardOpenFailureSkipAfter + "): " + local);
          reportCurrentAction("当前搜索卡片未进入视频详情，尝试下一个结果 (" + result + "/" + searchCardOpenFailureSkipAfter + ")...");
          if (result >= searchCardOpenFailureSkipAfter) {
            reportTraceLog("⚠️ 搜索卡片连续打开失败，短期跳过该结果: " + local, null, "warning");
            markSearchQueueUrlSkipped(local, set2);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
          }
          clearPendingLeadVideoUrl();
          state.lastClickedId = null;
          await closeAllModals(arg1);
          if (state.searchCardOpenFailureStreak >= searchCardOpenStuckReloadAfter) {
            flag2 = true;
            await reloadCurrentSearchPageAfterOpenFailures(arg1, value6, "连续 " + state.searchCardOpenFailureStreak + " 次未进入视频详情");
            break;
          }
        }
        if (flag2) {
          num9 = 0;
          continue;
        }
        if (flag) {
          num9 = 0;
        } else {
          if (local2) {
            const result = findNextUnprocessedSearchQueueUrl({
              queue: value8,
              processedSet: state.processedVideos,
              sessionUrls: set2,
              excludeIds: [state.lastClickedId]
            });
            if (!result) {
              console.log("[Built-in-Debug] [搜索队列] 列表阶段无剩余链接，收尾本词");
              reportCurrentAction("搜索队列已全部处理，即将切换新词…");
              clearSearchPendingOpenUrl();
              state.sessionProcessedCount = Math.max(state.sessionProcessedCount, state.targetVideoCount);
              num9 = 0;
              continue;
            }
            state.lastClickedId = result;
            rememberPendingLeadVideoUrl(result);
            setSearchPendingOpenUrl(result);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            reportCurrentAction("搜索队列按链接打开下一条…");
            reportTraceLog("🔗 搜索队列列表兜底打开：…" + String(result).slice(-16));
            const result2 = await openSearchQueueVideoByUrl(arg1, result, {
              allowHardNavigation: true,
              softWaitMs: 3500,
              hardWaitMs: 6500
            });
            num9 = 0;
            if (result2 === "ready") {
              clearSearchPendingOpenUrl();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              continue;
            }
            if (result2 === "navigating") {
              return;
            }
            return;
          }
          num9++;
          const value = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
          if (num9 >= 6 || value && num9 >= 3) {
            console.log("[Built-in-Debug] [搜索页竭尽] 连续滚动 " + num9 + " 次且触底，判定当前搜索结果已处理完毕。");
            reportCurrentAction("当前搜索结果已到底，即将切换新词或结束任务...");
            state.sessionProcessedCount = state.targetVideoCount;
            num9 = 0;
            continue;
          }
          const value2 = num3 > 0 ? "，已跳过 " + num3 + " 个异常卡片" : "";
          reportCurrentAction("未发现符合要求的新内容" + value2 + "，正在向下滚动加载更多搜索结果 (" + num9 + "/6)...");
          window.scrollBy(0, 1000);
          await randomDelay(3000, 5000, arg1);
        }
      } catch (error) {
        console.error("[Built-in-Debug] [抓取异常]", error);
        if (shouldAbort(arg1)) {
          continue;
        }
        const value = (error?.name || "Error") + ":" + (error?.message || String(error));
        const result = Date.now();
        if (value === text5 && result - num13 < 15000) {
          num14 += 1;
        } else {
          text5 = value;
          num14 = 1;
        }
        num13 = result;
        const result2 = Math.min(5000, 2 ** Math.min(3, num14 - 1) * 750);
        reportCurrentAction("视频处理异常，" + Math.ceil(result2 / 1000) + " 秒后重试…");
        if (num14 === 1 || num14 % 5 === 0) {
          reportTraceLog("⚠️ 视频处理异常：" + value.slice(0, 160) + "（连续 " + num14 + " 次）", null, "warning");
        }
        await sleep(result2);
      }
    }
    console.log("%c[任务结束] 所有视频入口队列及关键词已处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
    const value8 = state.stopRequested ? "manual_stop" : "loop_stopped";
    await finalizeAccountTask(arg1, value8, {}, {
      storageKey: state.stopRequested ? result6 : null,
      drainAiQueue: true
    });
  }
  return {
    startAutomation: startAutomation
  };
}
module.exports = {
  createLeadgenAutomationController: createLeadgenAutomationController
};
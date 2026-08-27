function createLeadgenAutomationController(_0x288d64 = {}) {
  const {
    DOUYIN_LIKE_ENTRY_URL: _0x2a8133,
    DOUYIN_RECOMMEND_URL: _0x4f2ac5,
    getDouyinLikeEntryUrl: _0x512b63,
    getDouyinRecommendUrl: _0x240fa3,
    Infinity: _0x1012e0,
    PLATFORM_SELECTORS: _0x2c6aa2,
    SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER: _0x3affdb,
    SEARCH_CARD_OPEN_STUCK_RELOAD_AFTER: _0x41ba1d,
    SEARCH_ZERO_CARD_MAX_RELOADS: _0x124a42,
    SEARCH_ZERO_CARD_SCANS_BEFORE_RELOAD: _0x5cb1f9,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: _0x99997e,
    SPECIFIC_VIDEO_NAV_MISS_MAX: _0x18e12a,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: _0x5aaef6,
    WeakSet: _0x3e7733,
    abortAutomationStartup: _0x589b08,
    advanceAfterSearchQueuedVideo: _0x5b4c11,
    aggressiveCommentListScroll: _0x1ce487,
    applySearchFilters: _0x331e53,
    awaitFeedVideoSwitchSettled: _0x22855b,
    awaitInteractionCooldown: _0x12788e,
    awaitPostActionRest: _0x2ec61b,
    awaitSearchPageLoginGate: _0x3318ad,
    awaitSecurityChallengeIfPresent: _0x12501d,
    awaitSpecificVideoOpenSettle: _0x523c93,
    buildDouyinSearchResultCardMap: _0x193fff,
    buildDouyinSearchUrl: _0x5afb51,
    buildVideoCardLead: _0x30f075,
    burstPauseWithinOneSecond: _0x11dd78,
    canLinkOnlyScrapeWithoutOpen: _0x12f35c,
    captureCurrentVideoMetadata: _0x4a095b,
    clearClaimedSpecificVideoUrl: _0x17375f,
    clearPendingLeadVideoUrl: _0x45b45e,
    clearSearchPendingOpenUrl: _0x46d74f,
    clearSearchSlideOscillationState: _0x4f043f,
    clearSearchVideoUrlQueue: _0xe30627,
    clearSearchZeroCardRecoveryState: _0xbf59b6,
    clearSearchZeroCardRecoveryStatesForLoop: _0x2bbe67,
    clearVideoLocalQuotaExhaustedFlag: _0x1d8497,
    clipTraceText: _0x5bcf18,
    closeAllModals: _0x339679,
    collectDouyinSearchResultCards: _0x4c14ca,
    collectLikedVideos: _0xc44673,
    collectSearchVideoUrlsForCommentTask: _0x167708,
    consumeTaskRestartFlag: _0x1e1f1e,
    decodeURIComponent: _0x4909e0,
    describeTaskAbortReason: _0x3f2526,
    emitLinkOnlyScrapeLead: _0x29e4e6,
    emitVideoCardLead: _0x530975,
    ensureClaimedSpecificVideoUrl: _0x1e6668,
    ensureCommentPanelOpen: _0x48c915,
    ensureCurrentSourcePage: _0x46256a,
    ensureDouyinRecommendFeed: _0x139437,
    ensureLeadgenScrapeApiHook: _0x4ddc49,
    ensureSpecificVideoApiHook: _0x32ad9c,
    evaluateSpecificVideoOpenProgress: _0xaaff23,
    expandReplies: _0xd5c87c,
    extractLeads: _0x2d754f,
    extractSpecificVideoId: _0x55a954,
    extractVideoIdFromHref: _0x5b4fbd,
    finalizeAccountTask: _0x21bbb7,
    findCommentScrollContainer: _0x31576a,
    findNextUnprocessedSearchQueueUrl: _0x1d1d15,
    findProfileVideoCards: _0x15bf7b,
    finishSpecificSourceTask: _0x5a7f01,
    formatScrapeCommentScrollAction: _0x5e45be,
    getAdaptiveCommentWaitRange: _0xca655,
    getCommentEndHintText: _0x32ec1c,
    getCommentScrollMetrics: _0x4505e8,
    getCurrentContentPauseProfile: _0x580be4,
    getCurrentVideoGuardState: _0xfd53b9,
    getDouyinFeedScope: _0x26e218,
    getDouyinLikeEntryState: _0x455873,
    getDouyinSearchCardClickTarget: _0x18860f,
    getDouyinSearchCardRoot: _0x239e66,
    getDouyinSearchZeroCardWaitBudgetMs: _0x18bf0b,
    getFeedVideoIdentity: _0x422e2f,
    getIncludeTitleKeywordMatch: _0x56634c,
    getPlannedVideoCountForDisplay: _0x23aa1b,
    getProcessedVideoKeyModule: _0x59d5e1,
    getScrapeNoCompliantTolerance: _0x1ce98e,
    getScrapeNoNewDataTolerance: _0x2d5544,
    getScrapeTargetSet: _0x19bd50,
    getSpecificPlannedVideoCount: _0x2872dd,
    getSpecificVideoUrlList: _0x442b4e,
    getVideoSearchCollectionEngineModule: _0x2dce82,
    getVideoTitle: _0x2cb4d3,
    getVisibleCommentNodeCount: _0xb56314,
    getVisibleCommentViewportFingerprint: _0x21227b,
    guardedCurrentVideoDelay: _0x175680,
    guardedPauseDelay: _0x2c2bd6,
    hasVideoMainCommented: _0x7eeba5,
    initProcessedVideosFromTask: _0x34452f,
    initVideoMainCommentMemoryFromTask: _0xd72c39,
    ipcRenderer: _0x20bacc,
    isCommentPanelEmptyHint: _0x12aa49,
    isCurrentTaskUsingProxy: _0x526c7e,
    isCurrentVideoPauseGuardDrifted: _0x2b2515,
    isDouyinFeedLiveStream: _0xd9f906,
    isDouyinFeedPlaying: _0x1f7b6a,
    isDouyinJingxuanContentLoading: _0x2a0fd9,
    isDouyinNonVideoPageUrl: _0x38e35a,
    isDouyinSearchVideoTabUrl: _0x5ab7c9,
    isDouyinVideoShareUrl: _0x169927,
    isFeedStyleSource: _0x179f8c,
    isInteractionLimitReached: _0x4ee1a2,
    isLinkOnlyScrapeTask: _0x5c7a24,
    isOnDouyinRecommendPage: _0x4f4475,
    isOnSpecificTargetVideo: _0x544133,
    isSearchQueueUrlSessionDone: _0x57e00e,
    isSpecificVideoCompletedThisSession: _0xd65d79,
    isVideoInSpecificList: _0xbc4162,
    isViewingDouyinVideoPage: _0x51db61,
    isVisibleElement: _0x19e48f,
    listLeadgenScrapeAwemes: _0x52622b,
    loadSpecificVideoState: _0x60a0c6,
    localStorage: _0x5902da,
    lockFeedLeadVideoUrl: _0x443692,
    logTaskDbg: _0xcc28c8,
    lookupLeadgenScrapeAweme: _0x1ede8f,
    markSearchQueueUrlSkipped: _0x317b17,
    markSpecificVideoCompletedThisSession: _0x29adb5,
    markSpecificVideoHandled: _0x442497,
    matchCurrentVideoForDy: _0x22d629,
    matchExcludedVideoAuthor: _0x285c2a,
    matchTitleKeywordList: _0x298ea5,
    maybeReportDouyinSearchZeroDiagnostics: _0x189013,
    maybeTrimRuntimeMemory: _0x39ab75,
    moveToNextVideo: _0x1d7124,
    navigateToDouyinLikeEntry: _0x258a6e,
    normalizeSearchQueueVideoUrl: _0x4496ef,
    normalizeSpecificVideoKey: _0xeebf5d,
    normalizeUrl: _0x20f668,
    noteSearchSlideVideoKey: _0x33206c,
    openSearchQueueVideoByUrl: _0x41f46d,
    openSpecificVideoWithRetries: _0x39a0ce,
    parseExcludeAuthorAccounts: _0x428fb1,
    parseTitleKeywordList: _0x5ad525,
    pauseSettleThenCaptureVideoMetadata: _0x2af5fe,
    pauseVisibleDouyinVideos: _0x4eb145,
    peekSearchPendingOpenUrl: _0x16362d,
    pickLeadVideoUrl: _0x2d580b,
    postVideoComment: _0x23ef9e,
    prefetchAiMainPostComment: _0x16446c,
    prepareSearchPageReload: _0x5dc92b,
    probeSpecificVideoOnDirectPage: _0x161a99,
    processScrapeAiQueue: _0x18bee7,
    pruneSearchCardOpenFailures: _0x3fa0e3,
    pruneStaleCommentDom: _0x1ab00a,
    radarSessionKey: _0x565031,
    randomDelay: _0xb5c9d7,
    readRadarSessionState: _0x277a89,
    readSearchZeroCardRecoveryState: _0x137eec,
    releaseAbandonedVideoClaim: _0x15ab7e,
    reloadCurrentFeedSource: _0x160218,
    reloadCurrentSearchPageAfterOpenFailures: _0x7e3917,
    reloadRecommendFeedAfterSwitchStall: _0x3e87c1,
    rememberPendingLeadVideoUrl: _0x86715c,
    rememberSearchCardOpenFailure: _0x3fae51,
    rememberSearchCardOpenSuccess: _0x5832db,
    reportCommentFlowTrace: _0x22f7f3,
    reportCurrentAction: _0x5db745,
    reportTraceLog: _0x2cccad,
    resetSearchCardOpenFailureState: _0x5beb43,
    resolveDouyinVideoDetailModal: _0x9566d9,
    resolveEffectiveCommentTotalCount: _0x4b0e90,
    resolveSearchCardScrapeFields: _0x2afd48,
    sampleVisibleCommentTexts: _0x21df30,
    saveCommentScrapeProgress: _0x2c725f,
    saveSearchZeroCardRecoveryState: _0x109911,
    saveSpecificVideoState: _0x3e7784,
    scrollCommentList: _0x1e878c,
    sessionStorage: _0x3fe4e5,
    setSearchPendingOpenUrl: _0x5a748f,
    shouldAbort: _0x3c37ea,
    shouldBypassSpecificBrowseDedup: _0x6efb6c,
    shouldCollectScrapeVideoMetadata: _0x43fca3,
    shouldContinueScrapeAfterDuplicateWindow: _0x44abb9,
    shouldEnforceIncludeTitleKeywords: _0xa0eb17,
    shouldExpandFoldedCommentReplies: _0x27a937,
    shouldForceSelectByIncludeTitle: _0x55ea51,
    shouldGenerateAiVideoMainPost: _0x3b7975,
    shouldPrefetchMainPostWithVideoMatch: _0xd317e1,
    shouldProbeIncompleteScrapeBoundary: _0xfca99f,
    shouldReprocessConfiguredSpecific: _0x80d369,
    shouldSkipSearchCardAfterOpenFailures: _0x104e83,
    shouldUsePersonaVideoFilter: _0x31b6d3,
    shouldUseSearchVideoUrlQueue: _0x4f94b7,
    simulateHumanClick: _0x257692,
    simulateTrustedElementClick: _0x562e04,
    skipDouyinFeedLiveStream: _0x338f2e,
    skipFailedSpecificVideoAndOpenNext: _0x23880d,
    sleep: _0x2770da,
    startCurrentVideoPauseGuard: _0x1567ad,
    suspendAutomationForNavigation: _0x5e688b,
    syncEntryContext: _0x4b0544,
    syncSpecificVideoPauseWatcher: _0x437f8f,
    usesSpecificVideoPool: _0x564e5b,
    waitAndCaptureCurrentVideoMetadata: _0x3b3d6a,
    waitForCommentDomWarmup: _0x25d35e,
    waitForDouyinSearchContentAfterZero: _0x353f6e,
    waitForVideoDetailReadyAndPause: _0x15b8ec,
    waitSpecificVideoNavAppear: _0x4c0dfb,
    state: _0x3772c4
  } = _0x288d64;
  if (!_0x3772c4) {
    throw new TypeError("createLeadgenAutomationController requires a runtime state bridge");
  }
  const _0x49bfce = () => typeof _0x240fa3 === "function" ? _0x240fa3() : _0x4f2ac5;
  const _0x60558e = () => typeof _0x512b63 === "function" ? _0x512b63() : _0x2a8133;
  async function _0x27603f(_0x1aec68, _0x5eab32) {
    if (await _0x48c915(_0x1aec68, _0x5eab32)) {
      return true;
    }
    const _0x123128 = 10000 + Math.floor(Math.random() * 10001);
    const _0x465902 = Math.round(_0x123128 / 1000);
    _0x5db745("未识别到评论区已打开，等待 " + _0x465902 + " 秒后再确认…");
    _0x2cccad("💬 首次打开评论区未识别到面板，等待 " + _0x465902 + " 秒");
    const _0x2b03e6 = Date.now() + _0x123128;
    while (Date.now() < _0x2b03e6) {
      if (_0x3c37ea(_0x5eab32)) {
        return false;
      }
      await _0x2770da(Math.min(1000, Math.max(0, _0x2b03e6 - Date.now())));
      if (typeof _0xb56314 === "function" && _0xb56314(_0x1aec68) > 0) {
        _0x5db745("等待期间评论区已出现，继续处理");
        return true;
      }
    }
    _0x5db745("等待结束，再次打开评论区…");
    if (await _0x48c915(_0x1aec68, _0x5eab32)) {
      return true;
    }
    _0x5db745("评论区仍未打开，跳过本条，切换下一条…");
    _0x2cccad("💬 再次打开评论区仍未识别到面板，跳过本视频", null, "warning");
    return false;
  }
  async function _0xc55187(_0x356d6e) {
    if (!_0x3772c4.currentTask) {
      return;
    }
    if (_0x3772c4.currentTask.taskMode === "nurture") {
      return;
    }
    try {
      _0x4ddc49({
        force: _0x3772c4.currentRunningSource === "search"
      });
    } catch (_0x48826f) {}
    const _0x3810d1 = _0x1e1f1e();
    if (_0x3810d1) {
      _0x2bbe67(_0x356d6e);
      const _0x49bcc6 = Array.isArray(_0x3772c4.currentTask?.videoSources) && _0x3772c4.currentTask.videoSources.includes("specific") && String(_0x3772c4.currentTask?.specifiedUrls || "").trim().length > 0;
      if (_0x49bcc6) {
        _0x3772c4.allowSpecificReprocess = true;
        _0x2cccad("🔄 重启：指定视频将重新分析（浏览库已解除；本账号已主评的视频不会重复发表评论）");
      }
    }
    const _0x4327bc = _0x565031(window._radar_account_id, _0x356d6e);
    const _0x2d3ffe = _0x277a89(window._radar_account_id, _0x356d6e, {
      migrateLegacy: true
    });
    const _0x2e6abe = _0x2d3ffe.loopId === _0x356d6e && !_0x3810d1;
    _0x3772c4.processedVideos = _0x34452f(_0x3772c4.currentTask, {
      restart: _0x3810d1,
      resumeSpecific: _0x2e6abe
    });
    _0x5beb43();
    _0xd72c39(_0x3772c4.currentTask);
    _0x3772c4.interactedInSession = new Set();
    _0x3772c4.scrapeAiQueue = [];
    try {
      if (_0x2d3ffe.loopId === _0x356d6e && Array.isArray(_0x2d3ffe.seenUserKeys)) {
        _0x2d3ffe.seenUserKeys.forEach(_0x4f1b64 => _0x3772c4.interactedInSession.add(_0x4f1b64));
        console.log("[Built-in-Debug] 恢复本会话已见用户 " + _0x3772c4.interactedInSession.size + " 个");
      }
    } catch (_0x178d79) {}
    const _0x2c28cc = Array.isArray(_0x3772c4.currentTask.videoSources) && _0x3772c4.currentTask.videoSources.length > 0 ? _0x3772c4.currentTask.videoSources : ["search"];
    let _0x5132df = _0x3772c4.currentTask.keywords?.split(/[,，\s\n]+/).map(_0x534b5a => _0x534b5a.trim()).filter(_0x3cb448 => _0x3cb448.length > 0) || [];
    const _0x197302 = _0x2c28cc.filter(_0x2e7de6 => ["search", "follow", "recommend", "like", "specific"].includes(_0x2e7de6) && (_0x2e7de6 !== "search" || _0x5132df.length > 0) && (_0x2e7de6 !== "specific" || (_0x3772c4.currentTask.specifiedUrls || "").trim().length > 0));
    if (_0x3772c4.currentTask.commentContent && !_0x3772c4.currentTask.replyTemplates) {
      _0x3772c4.currentTask.replyTemplates = _0x3772c4.currentTask.commentContent.split("\n").filter(_0xab450b => _0xab450b.trim());
    }
    if (_0x197302.length === 0) {
      console.warn("[Built-in-Debug] 未检测到可用的视频入口：搜索入口需要配置关键词");
      _0x589b08(_0x356d6e, "未配置可用视频入口（勾选搜索时需填写关键词）");
      return;
    }
    if (_0x2c28cc.includes("search") && _0x5132df.length === 0) {
      console.warn("[Built-in-Debug] 搜索入口未配置关键词，已自动跳过搜索入口");
    }
    const _0x308b58 = {
      search: "搜索关键词",
      follow: "关注列表",
      recommend: "推荐页",
      like: "喜欢列表",
      specific: "指定视频"
    };
    console.log("[Built-in-Debug] 启动视频入口队列: " + _0x197302.map(_0x2b9ba => _0x308b58[_0x2b9ba] || _0x2b9ba).join(" -> ") + (_0x5132df.length ? "；关键词: " + _0x5132df.join(" -> ") : ""));
    const _0x44f102 = window.location.href;
    const _0x5efe82 = _0x44f102.includes("/search/");
    const _0x2eb397 = _0x565031(window._radar_account_id, _0x356d6e);
    let _0x526a3c = _0x2d3ffe;
    window._likedVideoUrls = _0x526a3c.likedVideoUrls || [];
    window._searchVideoUrls = Array.isArray(_0x526a3c.searchVideoUrls) ? _0x526a3c.searchVideoUrls : [];
    window._searchVideoQueueKeyword = _0x526a3c.searchVideoQueueKeyword || null;
    const _0x1b6ef0 = !_0x526a3c.loopId || _0x526a3c.loopId !== _0x356d6e;
    if (!_0x1b6ef0 && _0x3772c4.currentTask.useGlobalKeywordPool && _0x526a3c.activeKeyword) {
      _0x3772c4.currentTask.keywords = _0x526a3c.activeKeyword;
      _0x5132df = _0x3772c4.currentTask.keywords.split(/[,，\s\n]+/).map(_0x25d7c7 => _0x25d7c7.trim()).filter(_0x5f39e0 => _0x5f39e0.length > 0);
    }
    _0xcc28c8("会话", "loopId=" + _0x356d6e, {
      restart: _0x3810d1,
      resume: _0x2e6abe,
      savedLoopId: _0x526a3c.loopId || null,
      url: _0x5bcf18(_0x44f102, 96)
    });
    const _0xd59d6e = _0x197302.join(",");
    let _0x33b534 = _0x1b6ef0 ? 0 : Number.isInteger(_0x526a3c.sIndex) ? _0x526a3c.sIndex : 0;
    if (_0x33b534 >= _0x197302.length) {
      _0x33b534 = 0;
    }
    let _0x59c187 = _0x1b6ef0 ? 0 : Number.isInteger(_0x526a3c.kIndex) ? _0x526a3c.kIndex : 0;
    if (!_0x1b6ef0 && _0x526a3c.videoSourcesKey && _0x526a3c.videoSourcesKey !== _0xd59d6e) {
      console.log("[Built-in-Debug] 视频入口配置已变化 (" + _0x526a3c.videoSourcesKey + " -> " + _0xd59d6e + ")，重置入口进度");
      _0x33b534 = 0;
      _0x59c187 = 0;
      _0x3772c4.sessionProcessedCount = 0;
      _0x3772c4.targetVideoCount = 0;
      _0x55ee7b = 0;
      _0xe30627();
    }
    let _0x2f6f41 = _0x197302[_0x33b534];
    _0x3772c4.currentRunningSource = _0x2f6f41;
    _0x437f8f();
    if (_0x59c187 >= _0x5132df.length) {
      _0x59c187 = 0;
    }
    let _0x268c8d = "";
    if (_0x5efe82) {
      const _0x56bab1 = new URL(_0x44f102);
      const _0x176ff0 = _0x56bab1.pathname.split("/");
      const _0x14d04 = _0x176ff0[_0x176ff0.indexOf("search") + 1];
      _0x268c8d = _0x14d04 ? _0x4909e0(_0x14d04) : "";
      for (let _0x2a6090 = 0; _0x2a6090 < _0x5132df.length; _0x2a6090++) {
        if (_0x268c8d === _0x5132df[_0x2a6090] || _0x44f102.includes(encodeURIComponent(_0x5132df[_0x2a6090]))) {
          _0x59c187 = _0x2a6090;
          break;
        }
      }
      if (_0x268c8d && _0x526a3c.activeKeyword === _0x268c8d && _0x59c187 < _0x5132df.length && _0x5132df[_0x59c187] !== _0x268c8d) {
        const _0x397db6 = _0x5132df.indexOf(_0x526a3c.activeKeyword);
        if (_0x397db6 >= 0) {
          _0x59c187 = _0x397db6;
        } else if (_0x3772c4.currentTask.useGlobalKeywordPool) {
          _0x5132df = [_0x526a3c.activeKeyword];
          _0x3772c4.currentTask.keywords = _0x526a3c.activeKeyword;
          _0x59c187 = 0;
        }
      }
    }
    const _0x13678b = _0x2f6f41 === "search" ? _0x5132df[_0x59c187] : null;
    let _0x3ed3c4 = _0x13678b;
    let _0x41ed7b = 0;
    let _0x55ee7b = 0;
    window._saveRadarState = () => {
      const _0x343c0f = {
        loopId: _0x356d6e,
        leadgenTaskId: _0x3772c4.currentTask?.leadgenTaskId || null,
        updatedAt: Date.now(),
        videoSourcesKey: _0xd59d6e,
        sIndex: _0x33b534,
        kIndex: _0x59c187,
        activeKeyword: _0x3ed3c4 || null,
        videoMin: _0x3772c4.currentTask?.videoMin,
        videoMax: _0x3772c4.currentTask?.videoMax,
        sessionProcessedCount: _0x3772c4.sessionProcessedCount,
        targetVideoCount: _0x3772c4.targetVideoCount,
        switchNoResponseStreak: _0x41ed7b,
        recommendSwitchRefreshCount: _0x55ee7b,
        sessionInteractionCount: _0x3772c4.sessionInteractionCount,
        interactionLimit: _0x3772c4.sessionInteractionLimit,
        followCount: _0x3772c4.sessionFollowCount,
        followLimit: _0x3772c4.sessionFollowLimit,
        dmCount: _0x3772c4.sessionDmCount,
        dmLimit: _0x3772c4.sessionDmLimit,
        seenUserKeys: [..._0x3772c4.interactedInSession].slice(-2000),
        likedVideoUrls: (window._likedVideoUrls || []).slice(-1000),
        searchVideoUrls: (window._searchVideoUrls || []).slice(-500),
        searchVideoQueueKeyword: window._searchVideoQueueKeyword || _0x3ed3c4 || null,
        searchSessionSkippedUrls: (window._searchSessionSkippedUrls || []).slice(-500),
        searchPendingOpenUrl: window._searchPendingOpenUrl || "",
        specificCompletedVideoIds: [...(window._specificSessionCompletedIds || [])],
        specificClaimedUrl: window._specificClaimedUrl || null,
        commentScrapeProgress: window._commentScrapeProgress || null,
        commentImageRotateIndex: _0x3772c4.commentImageRotateIndex,
        videoCommentImageRotateIndex: _0x3772c4.videoCommentImageRotateIndex,
        commentExpressionRotateIndex: _0x3772c4.commentExpressionRotateIndex,
        videoCommentExpressionRotateIndex: _0x3772c4.videoCommentExpressionRotateIndex
      };
      try {
        _0x5902da.setItem(_0x2eb397, JSON.stringify(_0x343c0f));
      } catch (_0x302350) {
        _0x343c0f.seenUserKeys = _0x343c0f.seenUserKeys.slice(-200);
        _0x343c0f.likedVideoUrls = _0x343c0f.likedVideoUrls.slice(-200);
        _0x343c0f.searchVideoUrls = Array.isArray(_0x343c0f.searchVideoUrls) ? _0x343c0f.searchVideoUrls.slice(-100) : [];
        _0x343c0f.searchSessionSkippedUrls = Array.isArray(_0x343c0f.searchSessionSkippedUrls) ? _0x343c0f.searchSessionSkippedUrls.slice(-100) : [];
        _0x343c0f.specificCompletedVideoIds = _0x343c0f.specificCompletedVideoIds.slice(-200);
        try {
          _0x5902da.setItem(_0x2eb397, JSON.stringify(_0x343c0f));
        } catch (_0x24bad6) {
          console.warn("[Built-in-Debug] 任务断点保存失败:", _0x302350?.message || _0x302350);
        }
      }
    };
    window._specificSessionCompletedIds = new Set(_0x1b6ef0 ? [] : _0x526a3c.specificCompletedVideoIds || []);
    if (_0x1b6ef0 && !_0x564e5b()) {
      _0x17375f();
    }
    if (!_0x1b6ef0 && _0x526a3c.specificClaimedUrl) {
      window._specificClaimedUrl = _0x526a3c.specificClaimedUrl;
    }
    window._commentScrapeProgress = _0x1b6ef0 ? null : _0x526a3c.commentScrapeProgress || null;
    const _0x4d34bc = !_0x1b6ef0 && _0x526a3c.sIndex === _0x33b534 && (_0x2f6f41 !== "search" || _0x526a3c.kIndex === _0x59c187);
    if (_0x4d34bc) {
      _0x3772c4.sessionProcessedCount = _0x526a3c.sessionProcessedCount || 0;
      _0x3772c4.targetVideoCount = _0x526a3c.targetVideoCount || 0;
      _0x41ed7b = _0x526a3c.switchNoResponseStreak || 0;
      _0x55ee7b = _0x526a3c.recommendSwitchRefreshCount || 0;
      if (_0x2f6f41 === "search") {
        const _0x535202 = Array.isArray(_0x526a3c.searchVideoUrls) ? _0x526a3c.searchVideoUrls : [];
        const _0x4a7656 = _0x526a3c.searchVideoQueueKeyword || _0x3ed3c4 || null;
        if (_0x535202.length > 0 && _0x4a7656 && _0x4a7656 === _0x3ed3c4) {
          window._searchVideoUrls = _0x535202;
          window._searchVideoQueueKeyword = _0x4a7656;
          window._searchSessionSkippedUrls = Array.isArray(_0x526a3c.searchSessionSkippedUrls) ? _0x526a3c.searchSessionSkippedUrls.slice(-500) : [];
          window._searchPendingOpenUrl = String(_0x526a3c.searchPendingOpenUrl || "").trim();
          if (window._searchPendingOpenUrl) {
            _0x86715c(window._searchPendingOpenUrl);
          }
        } else {
          _0xe30627();
        }
      }
      console.log("[Built-in-Debug] 恢复会话进度: " + _0x3772c4.sessionProcessedCount + "/" + _0x3772c4.targetVideoCount);
    } else {
      _0x3772c4.sessionProcessedCount = 0;
      _0x3772c4.targetVideoCount = 0;
      _0x41ed7b = 0;
      _0x55ee7b = 0;
      _0xe30627();
      console.log("[Built-in-Debug] " + (_0x1b6ef0 ? "新任务启动" : "入口或关键词变化") + "，重置计数器");
    }
    if (_0x2f6f41 !== "search") {
      window._searchSessionSkippedUrls = [];
      window._searchPendingOpenUrl = "";
    } else if (!Array.isArray(window._searchSessionSkippedUrls)) {
      window._searchSessionSkippedUrls = [];
    }
    if (_0x3772c4.targetVideoCount === 0) {
      if (_0x2f6f41 === "specific") {
        _0x3772c4.targetVideoCount = _0x2872dd(_0x3772c4.currentTask);
      } else {
        _0x3772c4.targetVideoCount = Math.floor(Math.random() * (parseInt(_0x3772c4.currentTask.videoMax) - parseInt(_0x3772c4.currentTask.videoMin) + 1)) + parseInt(_0x3772c4.currentTask.videoMin);
      }
    }
    window._saveRadarState();
    const _0xdcca2e = _0x2f6f41 === "search" ? "搜索: " + _0x13678b : _0x2f6f41 === "follow" ? "关注列表" : _0x2f6f41 === "like" ? "喜欢列表" : _0x2f6f41 === "specific" ? "指定视频" : "推荐页";
    const _0x283074 = _0x197302.map(_0x3ddf6c => _0x308b58[_0x3ddf6c] || _0x3ddf6c).join(" → ");
    const _0xf4d918 = 3;
    const _0x2f7fe4 = 5;
    const _0x1f6a18 = () => {
      if (_0x41ed7b <= 0) {
        return;
      }
      _0x41ed7b = 0;
      if (window._saveRadarState) {
        window._saveRadarState();
      }
    };
    const _0x4aefc9 = async (_0x4425df = "视频切换") => {
      _0x41ed7b += 1;
      console.warn("[Built-in-Debug] [" + _0x4425df + "] 视频切换未响应 (" + _0x41ed7b + "/" + _0xf4d918 + ")");
      if (_0x41ed7b >= _0xf4d918) {
        _0x41ed7b = 0;
        _0x45b45e();
        const _0x5c8e58 = _0x2f6f41 === "recommend" && _0x3772c4.sessionProcessedCount < _0x3772c4.targetVideoCount && _0x55ee7b < _0x2f7fe4;
        if (_0x5c8e58) {
          _0x55ee7b += 1;
          const _0x566b81 = "连续 " + _0xf4d918 + " 次视频切换未响应，推荐页视频未达标 (" + _0x3772c4.sessionProcessedCount + "/" + _0x3772c4.targetVideoCount + ")，刷新推荐页继续浏览 (" + _0x55ee7b + "/" + _0x2f7fe4 + ")";
          _0x5db745(_0x566b81);
          _0x2cccad("🔄 " + _0x566b81, null, "warning");
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          await _0x3e87c1(_0x356d6e);
          return "refresh";
        }
        const _0x451144 = "连续 " + _0xf4d918 + " 次视频切换未响应，判断当前入口已到末尾，准备切换下一步";
        _0x5db745(_0x451144);
        _0x2cccad("⚠️ " + _0x451144 + "（" + _0xdcca2e + "）", null, "warning");
        _0x3772c4.sessionProcessedCount = Math.max(_0x3772c4.sessionProcessedCount, _0x3772c4.targetVideoCount);
        if (window._saveRadarState) {
          window._saveRadarState();
        }
        return "advance";
      }
      _0x5db745("视频切换暂未响应，继续尝试扫描当前页面... (" + _0x41ed7b + "/" + _0xf4d918 + ")");
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      return false;
    };
    const _0x2a34b2 = () => {
      _0x4b0544(_0x2f6f41, _0x2f6f41 === "search" ? _0x13678b : null, _0xdcca2e);
      _0x20bacc.send("automation-data", {
        type: "keyword-changed",
        payload: {
          accountId: window._radar_account_id,
          keyword: _0xdcca2e,
          targetCount: _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask),
          sessionCount: _0x3772c4.sessionProcessedCount,
          isResume: _0x2e6abe
        }
      });
      _0x20bacc.send("automation-data", {
        type: "status",
        payload: {
          accountId: window._radar_account_id,
          status: "running"
        }
      });
      console.log("%c[任务执行] 正在处理入口 [" + (_0x33b534 + 1) + "/" + _0x197302.length + "]: " + _0xdcca2e, "color: #fff; background: #3b82f6; font-weight: bold; padding: 4px;");
      console.log("[Built-in-Debug] 本任务入口队列: " + _0x283074);
      _0x5db745(_0x197302.length > 1 ? "正在加载入口: " + _0xdcca2e + "（队列: " + _0x283074 + "）" : "正在加载视频入口: " + _0xdcca2e);
    };
    const _0x1bf82f = (_0xd4ff8f, _0x476f19 = _0x5132df[0]) => {
      if (_0xd4ff8f === "follow") {
        return "https://www.douyin.com/follow";
      }
      if (_0xd4ff8f === "recommend") {
        return _0x49bfce();
      }
      if (_0xd4ff8f === "like") {
        return _0x60558e();
      }
      return _0x5afb51(_0x476f19);
    };
    if (_0x2f6f41 === "search") {
      const _0x516a54 = _0x1bf82f("search", _0x13678b);
      const _0x14113a = _0x268c8d === _0x13678b;
      const _0x2fdfff = _0x51db61(_0x44f102);
      const _0x3796cf = _0x5ab7c9(_0x44f102);
      const _0x5aee2e = !!window._searchPendingOpenUrl || !!/(?:modal_id=|\/video\/|\/note\/)/i.test(_0x44f102);
      const _0x5d900c = _0x3796cf && !_0x2fdfff && !_0x5aee2e || !_0x14113a && !_0x2fdfff && !_0x5aee2e || _0x1b6ef0 && _0x2fdfff && !_0x5aee2e;
      if (_0x5d900c) {
        console.log("[Built-in-Debug] [导航] 搜索入口路径不匹配或仍停留详情，重载至干净搜索页: " + _0x13678b);
        const _0x1bd2c4 = window.location.href.split(/[?#]/)[0];
        const _0x3badfb = _0x516a54.split(/[?#]/)[0];
        _0x5dc92b(_0x356d6e, _0x13678b, "导航对齐干净搜索页");
        if (_0x1bd2c4 === _0x3badfb && !_0x3796cf) {
          console.log("[Built-in-Debug] [导航] 目标 URL 路径与当前一致，执行强制 reload 刷新 DOM 状态");
          _0x5e688b();
          window.location.reload();
        } else {
          _0x5e688b();
          window.location.href = _0x516a54;
        }
        return;
      } else if (_0x1b6ef0) {
        console.log("[Built-in-Debug] [导航] 新任务已在干净搜索入口，沿用当前首屏加载: " + _0x13678b);
      }
    } else if (_0x2f6f41 === "follow") {
      const _0x5c1947 = _0x44f102.includes("/follow");
      const _0x256a4b = _0x51db61(_0x44f102);
      if (_0x1b6ef0 || !_0x5c1947 && !_0x256a4b) {
        console.log("[Built-in-Debug] [导航] 全新任务会话启动或路径不匹配，强制跳转至关注页");
        _0x5e688b();
        window.location.href = _0x1bf82f("follow");
        return;
      }
    } else if (_0x2f6f41 === "like") {
      const _0x2e753f = _0x455873(_0x44f102);
      const _0x10efbc = _0x2e753f.ready || _0x2e753f.onUser;
      const _0x7469a1 = _0x51db61(_0x44f102);
      if (!_0x10efbc && !_0x7469a1) {
        console.log("[Built-in-Debug] [导航] 喜欢列表入口不匹配，强制跳转至喜欢列表页 (new=" + _0x1b6ef0 + ", onUser=" + _0x2e753f.onUser + ", showTab=" + _0x2e753f.hasShowTab + ", recent=" + _0x2e753f.recentNavigation + ", tab=" + _0x2e753f.tabFound + ", active=" + _0x2e753f.tabActive + ")");
        _0x5e688b();
        _0x258a6e();
        return;
      }
    } else if (_0x2f6f41 === "specific") {
      const _0x30c7eb = _0x442b4e(_0x3772c4.currentTask);
      window._specificVideoUrls = _0x30c7eb;
      _0x3772c4.targetVideoCount = _0x2872dd(_0x3772c4.currentTask, _0x30c7eb);
      console.log("[Built-in-Debug] [指定视频] 计划处理 " + _0x3772c4.targetVideoCount + " 个链接（忽略频率控制-视频数量）");
      if (_0x564e5b()) {
        _0x2cccad("📋 指定视频抢活：配置 " + _0x30c7eb.length + " 条，多账号先到先得领取");
      }
      const _0x396a8f = await _0x1e6668({
        reuseActive: true
      });
      if (_0x396a8f && _0x564e5b()) {
        window._specificClaimedUrl = _0x396a8f;
      }
      const _0x355953 = _0x564e5b() ? _0x396a8f ? 1 : 0 : _0x30c7eb.filter(_0x2444ca => !_0xd65d79(_0x2444ca)).length;
      _0xcc28c8("指定视频", "配置 " + _0x30c7eb.length + " 条，本账号待处理入口 " + (_0x355953 ? "有" : "无"), {
        processedKeys: _0x3772c4.processedVideos.size,
        pool: _0x564e5b()
      });
      if (!_0x396a8f) {
        const _0x224b7d = _0x30c7eb.length === 0 ? "specific_empty" : _0x564e5b() ? "specific_pool_empty" : "specific_all_processed";
        await _0x5a7f01(_0x356d6e, _0x2eb397, _0x224b7d, {
          configuredCount: _0x30c7eb.length
        });
        return;
      }
      if (!_0x544133(_0x44f102, _0x396a8f)) {
        _0xcc28c8("导航", "跳转领取视频 id=" + _0x55a954(_0x396a8f), {
          url: _0x5bcf18(_0x396a8f, 80)
        });
        _0x5e688b();
        window.location.href = _0x396a8f;
        return;
      }
      _0xcc28c8("导航", "已在目标视频 id=" + _0x55a954(_0x396a8f) + "，进入采集循环");
    } else if (_0x2f6f41 === "recommend") {
      if (_0x1b6ef0 || !_0x4f4475(_0x44f102)) {
        const _0x54f7da = await _0x139437(_0x356d6e);
        if (!_0x54f7da) {
          return;
        }
      }
    } else {
      console.warn("[Built-in-Debug] 未知视频入口: " + _0x2f6f41);
      return;
    }
    _0x2a34b2();
    let _0x14495d = new Set();
    let _0x25e80e = new Set((Array.isArray(window._searchSessionSkippedUrls) ? window._searchSessionSkippedUrls : []).map(_0xc74052 => _0x4496ef(_0xc74052) || String(_0xc74052 || "").trim()).filter(Boolean));
    _0x25e80e.forEach(_0x5f1ec4 => {
      try {
        _0x59d5e1().rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5f1ec4);
      } catch (_0x21180c) {}
    });
    let _0x8eb3ed = 0;
    let _0x170942 = 0;
    let _0x2e92b3 = 0;
    let _0x408a70 = "";
    let _0x17c485 = 0;
    await _0xb5c9d7(4000, 7000, _0x356d6e, "页面加载稳定");
    let _0x772756 = 0;
    let _0x1c5f76 = 0;
    let _0xc23253 = 0;
    let _0x5e33c7 = "";
    let _0x281ba4 = 0;
    let _0x23c4db = "";
    let _0x2fa832 = "";
    let _0x1188bf = 0;
    let _0x499bea = 0;
    const _0x212c59 = 5;
    const _0x2db040 = 4;
    const _0x169f78 = 4;
    while (!_0x3c37ea(_0x356d6e)) {
      await _0x12501d(_0x356d6e);
      try {
        if (_0x4ee1a2()) {
          console.log("%c[互动上限] 互动总量已达上限 (" + _0x3772c4.sessionInteractionCount + "/" + _0x3772c4.sessionInteractionLimit + ")，该账号任务自动结束！", "color: #fff; background: #ef4444; font-weight: bold; padding: 4px;");
          _0x5db745("🛑 互动总量已达上限 (" + _0x3772c4.sessionInteractionCount + "/" + _0x3772c4.sessionInteractionLimit + ")，自动停止");
          _0x18bee7();
          await _0x21bbb7(_0x356d6e, "interaction_limit_reached", {
            current: _0x3772c4.sessionInteractionCount,
            limit: _0x3772c4.sessionInteractionLimit
          }, {
            storageKey: _0x2eb397
          });
          return;
        }
        if (_0x2f6f41 === "specific") {
          const _0x14550e = await _0x1e6668({
            reuseActive: true
          });
          if (!_0x14550e) {
            console.log("%c[任务结束] 指定视频列表已全部处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
            const _0x379f58 = window._specificVideoUrls || _0x442b4e(_0x3772c4.currentTask);
            await _0x5a7f01(_0x356d6e, _0x2eb397, "specific_completed", {
              configuredCount: _0x379f58.length
            });
            return;
          }
        } else if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
          if (_0x2f6f41 === "search") {
            if (_0x3772c4.currentTask.useGlobalKeywordPool && _0x3772c4.currentTask.leadgenTaskId) {
              const _0x332f03 = await _0x20bacc.invoke("claim-leadgen-keyword", {
                leadgenTaskId: _0x3772c4.currentTask.leadgenTaskId,
                accountId: _0x3772c4.currentTask.accountId
              });
              if (_0x332f03?.keyword) {
                _0x3772c4.sessionProcessedCount = 0;
                _0x3772c4.targetVideoCount = 0;
                _0x41ed7b = 0;
                _0x59c187 = 0;
                _0xe30627();
                _0x3772c4.currentTask.keywords = _0x332f03.keyword;
                _0x3ed3c4 = _0x332f03.keyword;
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                const _0x28b827 = _0x332f03.keyword;
                console.log("%c[任务切换] 动态领取关键词 [" + _0x332f03.claimed + "/" + _0x332f03.total + "]: " + _0x28b827 + "（池剩余 " + _0x332f03.remaining + "）", "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
                _0x2cccad("🔑 切换搜索词：" + _0x28b827 + "（全局池剩余 " + _0x332f03.remaining + " 个）");
                _0x5dc92b(_0x356d6e, _0x28b827, "切换关键词");
                _0x5e688b();
                window.location.href = _0x1bf82f("search", _0x28b827);
                return;
              }
            } else if (_0x59c187 < _0x5132df.length - 1) {
              _0x59c187++;
              _0x3772c4.sessionProcessedCount = 0;
              _0x3772c4.targetVideoCount = 0;
              _0x41ed7b = 0;
              _0xe30627();
              _0x3ed3c4 = _0x5132df[_0x59c187];
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              const _0x339fb7 = _0x5132df[_0x59c187];
              console.log("%c[任务切换] 当前词已达标，准备切换至 [" + (_0x59c187 + 1) + "/" + _0x5132df.length + "]: " + _0x339fb7, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
              _0x5dc92b(_0x356d6e, _0x339fb7, "切换关键词");
              _0x5e688b();
              window.location.href = _0x1bf82f("search", _0x339fb7);
              return;
            }
          }
          if (_0x33b534 < _0x197302.length - 1) {
            const _0x396465 = _0x197302[_0x33b534];
            _0x33b534++;
            _0x59c187 = 0;
            _0x3ed3c4 = null;
            _0x3772c4.sessionProcessedCount = 0;
            _0x3772c4.targetVideoCount = 0;
            _0x41ed7b = 0;
            _0x55ee7b = 0;
            _0xe30627();
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            const _0xed933 = _0x197302[_0x33b534];
            const _0x395ef7 = (_0x308b58[_0x396465] || _0x396465) + " → " + (_0x308b58[_0xed933] || _0xed933);
            console.log("%c[任务切换] 当前视频入口已达标，准备切换: " + _0x395ef7, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
            _0x5db745("入口切换: " + _0x395ef7);
            _0x5e688b();
            window.location.href = _0x1bf82f(_0xed933);
            return;
          } else {
            console.log("%c[任务结束] 所有视频入口队列及关键词已处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
            _0x18bee7();
            await _0x21bbb7(_0x356d6e, "all_sources_completed", {
              viewed: _0x3772c4.sessionProcessedCount,
              planned: _0x3772c4.targetVideoCount
            }, {
              storageKey: _0x2eb397
            });
            return;
          }
        }
        _0x2f6f41 = _0x197302[_0x33b534];
        _0x3772c4.currentRunningSource = _0x2f6f41;
        _0x437f8f();
        const _0x301c69 = await _0x46256a(_0x356d6e, _0x2f6f41);
        if (!_0x301c69) {
          continue;
        }
        const _0x3c9291 = window.location.href.includes("/video/") || window.location.href.includes("modal_id=") || window.location.href.includes("/note/");
        if (_0x2f6f41 === "search" && window.location.href.includes("/search/") && !_0x3c9291) {
          try {
            _0x4ddc49({
              force: true
            });
          } catch (_0x393d03) {}
          const _0x25ed6f = "applied_filters_" + _0x356d6e + "_" + _0x13678b;
          const _0x52e37f = _0x3fe4e5.getItem(_0x25ed6f) === "true";
          await _0x331e53(_0x13678b, _0x356d6e);
          const _0xf733c3 = _0x3fe4e5.getItem(_0x25ed6f) === "true";
          if (!_0x52e37f && _0xf733c3) {
            console.log("[Built-in-Debug] [官方筛选] 过滤器已新应用，休眠 4.5 秒等待搜素结果加载稳定...");
            await _0xb5c9d7(4000, 5500, _0x356d6e, "等待筛选结果加载");
          }
        }
        if (_0x2f6f41 === "like" && !_0x3c9291) {
          if (!window._likedVideoUrls || window._likedVideoUrls.length === 0) {
            window.__radar_like_link_reclaim_pass = false;
            window._likedVideoUrls = await _0xc44673(_0x356d6e);
            if (window._likedVideoUrls.length === 0) {
              console.warn("[Built-in-Debug] 喜欢列表没有检测到视频作品，结束任务");
              await _0x21bbb7(_0x356d6e, "like_list_empty", {}, {
                storageKey: _0x2eb397
              });
              return;
            }
            _0x3772c4.targetVideoCount = Math.min(_0x3772c4.targetVideoCount || _0x1012e0, window._likedVideoUrls.length);
            window._saveRadarState();
          }
        }
        if (_0x2f6f41 === "search" && !_0x3c9291 && _0x4f94b7(_0x3772c4.currentTask)) {
          const _0x719ed = String(_0x3ed3c4 || _0x13678b || "").trim();
          const _0x312124 = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
          const _0x780b22 = _0x312124.length > 0 && window._searchVideoQueueKeyword && window._searchVideoQueueKeyword === _0x719ed;
          if (!_0x780b22) {
            window._searchVideoUrls = await _0x167708(_0x356d6e, _0x3772c4.targetVideoCount);
            window._searchVideoQueueKeyword = _0x719ed;
            if (!window._searchVideoUrls.length) {
              console.warn("[Built-in-Debug] [搜索队列] 未收集到可用视频链接，推进当前关键词");
              _0x2cccad("⚠️ 搜索评论队列为空，切换下一关键词或结束", null, "warning");
              _0x3772c4.sessionProcessedCount = Math.max(_0x3772c4.sessionProcessedCount, _0x3772c4.targetVideoCount || 1);
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              continue;
            }
            _0x3772c4.targetVideoCount = Math.min(_0x3772c4.targetVideoCount || _0x1012e0, window._searchVideoUrls.length);
            window._modalMaxSlides = window._searchVideoUrls.length;
            window._modalSlideCount = 0;
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            _0x2cccad("📋 搜索评论队列就绪：" + window._searchVideoUrls.length + " 条，本词计划处理 " + _0x3772c4.targetVideoCount + " 条");
          } else {
            _0x3772c4.targetVideoCount = Math.min(_0x3772c4.targetVideoCount || _0x312124.length, _0x312124.length);
            window._modalMaxSlides = _0x312124.length;
          }
        }
        if (_0x2f6f41 === "specific" && !window._specificVideoUrls) {
          window._specificVideoUrls = _0x442b4e(_0x3772c4.currentTask);
          _0x2cccad("📋 指定视频列表：共 " + window._specificVideoUrls.length + " 个链接");
          console.log("[Built-in-Debug] [指定视频] 初始化 URL 列表: " + window._specificVideoUrls.length + " 个");
        }
        const _0x5097d4 = _0x179f8c(_0x2f6f41);
        const _0x5da078 = _0x2c6aa2["douyin.com"].modalContainer;
        let _0x1d464e = _0x5da078 ? Array.from(document.querySelectorAll(_0x5da078)).find(_0x19e48f) : null;
        if (!_0x1d464e || !_0x19e48f(_0x1d464e)) {
          _0x1d464e = _0x9566d9({
            includeFeed: _0x5097d4
          });
        }
        if (_0x5097d4) {
          if (_0xd9f906()) {
            _0x1c5f76 = 0;
            const _0x5c74ee = _0x422e2f() || _0x2cb4d3();
            if (_0x5c74ee) {
              _0x25e80e.add(_0x5c74ee);
            }
            if (_0x5c74ee && _0x5c74ee === _0x5e33c7) {
              _0xc23253 += 1;
            } else {
              _0xc23253 = 1;
              _0x5e33c7 = _0x5c74ee;
            }
            console.log("[Built-in-Debug] [推荐流] 检测到直播间，自动切换下一条");
            _0x5db745("检测到直播间，自动切换下一条...");
            await _0x338f2e(_0x356d6e, {
              forceReload: _0xc23253 >= _0x2db040
            });
            if (_0xc23253 >= _0x2db040) {
              _0xc23253 = 0;
              _0x5e33c7 = "";
            }
            continue;
          }
          _0xc23253 = 0;
          _0x5e33c7 = "";
          if (_0x1f7b6a()) {
            _0x1c5f76 = 0;
            _0x1d464e = _0x26e218();
            console.log("[Built-in-Debug] [检测] 推荐/关注流：识别到正在播放的 feed 视频");
          } else {
            _0x1c5f76 += 1;
            _0x4eb145(_0x26e218() || document, "推荐流等待就绪期间锁定暂停");
            if (_0x1c5f76 >= _0x212c59) {
              _0x1c5f76 = 0;
              console.warn("[Built-in-Debug] [推荐流] 连续等待 " + _0x212c59 + " 次仍未就绪，切换下一条");
              _0x5db745("推荐流播放器未就绪，切换下一条视频...");
              await _0x1d7124(_0x356d6e);
              await _0xb5c9d7(2000, 4000, _0x356d6e, "推荐流切换");
              continue;
            }
            _0x5db745("推荐流视频加载中，等待播放器就绪 (" + _0x1c5f76 + "/" + _0x212c59 + ")...");
            await _0xb5c9d7(2500, 4000, _0x356d6e, "等待推荐流");
            continue;
          }
        }
        if (_0x1d464e && _0x19e48f(_0x1d464e)) {
          _0x17c485 = 0;
          const _0x172b5f = _0x55a954(window.location.href) || _0x2cb4d3();
          if (!window._lastModalVisible) {
            window._modalSlideCount = 1;
            const _0x210eb2 = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls.length : 0;
            window._modalMaxSlides = _0x210eb2 > 0 && _0x4f94b7(_0x3772c4.currentTask) ? _0x210eb2 : window._searchCardCount || 0;
            window._lastModalVideoId = _0x172b5f;
            console.log("[Built-in-Debug] [弹窗计数] 详情弹窗新打开，第 1 个视频，" + ("初始可见卡片参考数: " + window._modalMaxSlides + "（不作为搜索结束条件）"));
          } else if (_0x172b5f && _0x172b5f !== window._lastModalVideoId) {
            window._modalSlideCount = (window._modalSlideCount || 0) + 1;
            window._lastModalVideoId = _0x172b5f;
            console.log("[Built-in-Debug] [弹窗计数] 检测到视频切换，进入第 " + window._modalSlideCount + " 个视频" + ("（初始可见卡片参考数: " + window._modalMaxSlides + "）"));
          }
          window._lastModalVisible = true;
          const _0x39b4ba = _0x1d464e.getAttribute?.("data-e2e") || "";
          const _0xc7957e = _0x5097d4 && (_0x39b4ba === "feed-active-video" || _0x39b4ba === "feed-active-live" || _0x39b4ba === "feed-live" || _0x39b4ba === "browse-live" || _0x39b4ba === "webcast-player");
          const _0x10966c = _0xc7957e ? document : _0x1d464e;
          console.log(_0xc7957e ? "[Built-in-Debug] [检测] 推荐/关注流内联播放，进入 feed 处理模式" : "[Built-in-Debug] [检测] 成功发现视频详情弹窗");
          let _0x3a9536 = null;
          let _0x487db2 = null;
          try {
            let _0x17a248 = "";
            let _0x20bfd3 = "";
            let _0x5c80ee = "";
            let _0x3d2011 = null;
            if (_0xc7957e) {
              _0x4eb145(_0x1d464e, "推荐流进入后立即暂停");
              _0x443692(_0x1d464e);
              try {
                _0x4ddc49({
                  force: true
                });
              } catch (_0x28f30d) {}
              _0x3a9536 = _0x1567ad({
                scope: _0x1d464e
              }, _0x356d6e, {
                intervalMs: 250,
                pauseOnly: true
              });
              const _0x5e78ef = _0x3772c4.lockedFeedIdentity || _0x422e2f(_0x1d464e) || "";
              _0x17a248 = _0x5e78ef;
              _0x20bfd3 = _0x2d580b(_0x3772c4.lockedLeadVideoUrl || _0x5e78ef, _0x1d464e);
              _0x5c80ee = _0x169927(_0x20bfd3) ? _0x20bfd3 : _0x17a248;
              const _0x363a2b = _0x43fca3(_0x3772c4.currentTask) && _0x19bd50(_0x3772c4.currentTask).has("author");
              _0x3d2011 = _0x363a2b ? await _0x3b3d6a(_0x1d464e, _0x20bfd3, _0x356d6e, {
                requireAuthor: true,
                maxWaitMs: 2800
              }) : _0x4a095b(_0x1d464e, _0x20bfd3);
            } else if (_0x2f6f41 === "search") {
              _0x4eb145(_0x1d464e, "进入视频详情后立即暂停防止自动连播");
              _0x3a9536 = _0x1567ad({
                scope: _0x1d464e
              }, _0x356d6e, {
                intervalMs: 80,
                pauseOnly: true
              });
              await _0x11dd78(_0x1d464e, _0x356d6e, {
                budgetMs: 1000,
                tickMs: 50,
                reason: "进入视频 1 秒内强制暂停"
              });
              const _0x22b3d4 = await _0x2af5fe(_0x1d464e, _0x356d6e, {
                isFeedPlayback: false,
                previousAuthor: window._lastProcessedVideoAuthor || window._lastProcessedSearchVideoAuthor || "",
                previousVideoId: window._lastProcessedVideoId || window._lastProcessedSearchVideoId || "",
                settleMs: 400,
                maxWaitMs: _0x43fca3(_0x3772c4.currentTask) && _0x19bd50(_0x3772c4.currentTask).has("author") ? 2800 : 2000,
                requireAuthor: true,
                skipBurstPause: true
              });
              _0x17a248 = _0x22b3d4.url;
              _0x20bfd3 = _0x22b3d4.leadVideoUrl;
              _0x5c80ee = _0x169927(_0x20bfd3) ? _0x20bfd3 : _0x22b3d4.dedupKey;
              _0x3d2011 = _0x22b3d4.meta;
            } else {
              _0x4eb145(_0x1d464e, "进入视频详情后立即暂停防止自动连播");
              _0x3a9536 = _0x1567ad({
                scope: _0x1d464e
              }, _0x356d6e, {
                intervalMs: 250,
                pauseOnly: true
              });
              _0x17a248 = _0x20f668(window.location.href);
              _0x20bfd3 = _0x2d580b(_0x17a248, _0x10966c || _0x1d464e);
              _0x5c80ee = _0x169927(_0x20bfd3) ? _0x20bfd3 : _0x17a248;
              const _0x5ae266 = _0x43fca3(_0x3772c4.currentTask) && _0x19bd50(_0x3772c4.currentTask).has("author");
              _0x3d2011 = _0x5ae266 ? await _0x3b3d6a(_0x1d464e, _0x20bfd3, _0x356d6e, {
                requireAuthor: true,
                maxWaitMs: 2800
              }) : _0x4a095b(_0x1d464e, _0x20bfd3);
            }
            {
              const _0x12e78c = _0x16362d();
              const _0x4009c4 = _0x55a954(_0x12e78c);
              const _0x252877 = _0x55a954(_0x5c80ee || _0x20bfd3 || _0x17a248);
              if (_0x4009c4 && _0x252877 && _0x4009c4 === _0x252877) {
                _0x46d74f();
              }
            }
            if (_0xc7957e && !_0x169927(_0x20bfd3)) {
              console.warn("[Built-in-Debug] [推荐流] 未能锁定标准 /video/xxx 链接，线索可能缺少视频链接");
            } else if (!_0xc7957e && !_0x169927(_0x20bfd3) && _0x38e35a(_0x20f668(window.location.href))) {
              console.warn("[Built-in-Debug] [视频链接] 未能解析为标准 /video/xxx 格式，线索可能缺少视频链接");
            }
            const _0x2488c3 = _0x3d2011.title;
            const _0xf6810d = _0x3d2011.authorNickname;
            _0x1d8497(_0x356d6e);
            const _0x3341c0 = _0x3d2011.stats || {};
            const _0x2818cd = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248) || _0x55a954(window.location.href) || "";
            const _0x1fd311 = String(_0x3d2011.authorUrl || "").trim();
            const _0x52e0da = _0x3d2011.fromApi ? "API" : "DOM";
            _0x2cccad("🎬 当前视频：作者「" + (_0xf6810d || "未知作者") + "」" + (" | 标题《" + _0x5bcf18(_0x2488c3 || "未知视频", 40) + "》") + (_0x2818cd ? " | id=" + _0x2818cd : "") + (_0x1fd311 ? " | 主页…" + _0x1fd311.slice(-18) : "") + (" | 来源=" + _0x52e0da) + (" | 赞" + (_0x3341c0.likes || 0) + "/评" + (_0x3341c0.comments || 0) + "/藏" + (_0x3341c0.collects || 0) + "/转" + (_0x3341c0.shares || 0)), null, "success");
            if (_0x2f6f41 === "search") {
              const _0x46d76e = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248) || _0x20bfd3 || _0x5c80ee || _0x17a248;
              const _0x6c75f4 = _0x33206c(_0x46d76e);
              if (_0x6c75f4) {
                const _0x5452ca = _0x6c75f4 === "same" ? "搜索已到末尾（同一视频连续出现 3 次），正在关闭并切换新词…" : "搜索已到末尾（末两条视频来回切换），正在关闭并切换新词…";
                _0x5db745(_0x5452ca);
                _0x2cccad(_0x6c75f4 === "same" ? "ℹ️ 搜索下滑：同一视频连续出现 3 次，判定无更多视频" : "ℹ️ 搜索下滑：末尾两条视频来回切换已重复 2 次，判定无新视频", null, "normal");
                await _0x339679(_0x356d6e);
                _0x3772c4.sessionProcessedCount = Math.max(_0x3772c4.sessionProcessedCount, _0x3772c4.targetVideoCount);
                _0x4f043f();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                continue;
              }
              window._lastProcessedSearchVideoId = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248) || "";
              window._lastProcessedSearchVideoAuthor = _0xf6810d || "";
            }
            window._lastProcessedVideoId = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248) || "";
            window._lastProcessedVideoAuthor = _0xf6810d || "";
            const _0x1d52db = {
              isFeedPlayback: _0xc7957e,
              leadVideoUrl: _0x20bfd3,
              dedupKey: _0x5c80ee,
              videoId: _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248) || "",
              videoTitle: _0x2488c3,
              videoAuthor: _0xf6810d,
              scope: _0x1d464e,
              lenientWhenUnresolved: true
            };
            if (_0x3772c4.currentTask?.taskMode === "scrape") {
              try {
                _0x3a9536?.stop();
              } catch (_0x284ca4) {}
              _0x3a9536 = null;
              _0x4eb145(_0x1d464e, "仅采集模式锁定暂停，禁止自动连播");
              _0x487db2 = _0x1567ad(_0x1d52db, _0x356d6e, {
                intervalMs: 400
              });
            }
            if (_0x2f6f41 === "specific") {
              const _0x4cb477 = window._specificVideoUrls || _0x442b4e(_0x3772c4.currentTask);
              const _0x5ca062 = await _0x1e6668({
                reuseActive: true
              });
              const _0x23dfa2 = _0xeebf5d(_0x20bfd3 || _0x5c80ee || _0x17a248);
              const _0x2380ea = _0x5ca062 ? _0xeebf5d(_0x5ca062) : "";
              if (_0x2380ea && _0x23dfa2 !== _0x2380ea) {
                _0x170942 += 1;
                console.warn("[Built-in-Debug] [指定视频] 当前视频非领取目标，重新打开 (" + _0x170942 + "/" + _0x18e12a + "): " + _0x5ca062);
                if (_0x170942 >= _0x18e12a) {
                  const _0x3bebfa = await _0x23880d(_0x356d6e, _0x2eb397, _0x5ca062, _0x4cb477, "nav_miss_wrong_video_" + _0x170942);
                  if (_0x3bebfa === "done") {
                    return;
                  }
                  _0x170942 = 0;
                  _0x8eb3ed = 0;
                  continue;
                }
                _0x5db745("检测到非指定视频，正在重新打开目标链接 (" + _0x170942 + "/" + _0x18e12a + ")...");
                window.location.href = _0x5ca062;
                await _0x4c0dfb(_0x356d6e);
                continue;
              }
              _0x170942 = 0;
              if (!_0x2380ea && !_0xbc4162(_0x20bfd3 || _0x5c80ee, _0x4cb477)) {
                console.warn("[Built-in-Debug] [指定视频] 当前视频不在指定列表中，忽略: " + _0x23dfa2);
                _0x5db745("检测到非指定视频，跳过...");
                continue;
              }
            }
            if (_0x2f6f41 === "like") {
              const _0x20e58a = window._likedVideoUrls && window._likedVideoUrls.includes(_0x20bfd3);
              if (!_0x20e58a) {
                const _0x35b621 = "⚠️ 喜欢列表浏览边界到达：当前视频 " + _0x20bfd3 + " 不在喜欢列表中（可能已进入推荐视频页），任务完成。";
                console.log("[Built-in-Debug] [喜欢列表] " + _0x35b621);
                _0x2cccad(_0x35b621);
                try {
                  document.querySelector(_0x2c6aa2["douyin.com"].commentPanel)?.closest("[class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"panel\"]")?.querySelector("[data-e2e=\"close\"], [aria-label=\"关闭\"]")?.click?.();
                } catch (_0x652d6) {}
                await _0x21bbb7(_0x356d6e, "like_list_completed", {}, {
                  storageKey: _0x2eb397
                });
                return;
              } else {
                _0x2cccad("🎬 轨迹详情：当前正在浏览喜欢列表内的视频: " + _0x20bfd3);
              }
            }
            if (_0xc7957e && _0xd9f906(_0x1d464e)) {
              _0x25e80e.add(_0x17a248);
              const _0x4a1974 = _0x422e2f(_0x1d464e) || _0x2488c3;
              if (_0x4a1974 && _0x4a1974 === _0x5e33c7) {
                _0xc23253 += 1;
              } else {
                _0xc23253 = 1;
                _0x5e33c7 = _0x4a1974;
              }
              console.log("[Built-in-Debug] [推荐流] 当前条为直播间，跳过互动");
              _0x5db745("当前为直播间内容，自动切换下一条...");
              await _0x338f2e(_0x356d6e, {
                forceReload: _0xc23253 >= _0x2db040
              });
              if (_0xc23253 >= _0x2db040) {
                _0xc23253 = 0;
                _0x5e33c7 = "";
              }
              continue;
            }
            let _0x2e0bd7 = false;
            const _0x1484ed = _0x2488c3 && _0x2488c3 !== "未知视频";
            const _0x3b42f1 = _0xc7957e || _0x5c80ee.includes("/video/") || _0x5c80ee.includes("modal_id=") || _0x5c80ee.includes("vid=") || _0x169927(_0x20bfd3);
            const _0x3a4c64 = _0x80d369(_0x5c80ee);
            const _0x29b1cd = _0x6efb6c(_0x5c80ee);
            const _0x34b3e4 = _0x3a4c64 || _0x29b1cd;
            const _0x5d2646 = _0x59d5e1();
            if (!_0x34b3e4 && _0x3b42f1) {
              if (_0x25e80e.has(_0x5c80ee)) {
                console.log("[Built-in-Debug] [去重判定] 跳过视频 (本轮已分析): " + (_0xf6810d || "未知作者") + " - 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》");
                _0x2e0bd7 = true;
              } else if (_0x5d2646.hasProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee)) {
                console.log("[Built-in-Debug] [去重判定] 跳过视频 (历史已分析): " + (_0xf6810d || "未知作者") + " - 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》");
                _0x2e0bd7 = true;
              }
            } else if (_0x1484ed && _0x14495d.has(_0x2488c3) && _0x25e80e.has(_0x5c80ee)) {
              console.log("[Built-in-Debug] [去重判定] 跳过视频 (标题重复): " + (_0xf6810d || "未知作者") + " - 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》");
              _0x2e0bd7 = true;
            }
            if (!_0x2e0bd7 && _0x1484ed && _0x3772c4.currentTask.excludeTitleKeywords) {
              const _0x1f11fb = _0x5ad525(_0x3772c4.currentTask.excludeTitleKeywords);
              const _0x329c46 = _0x298ea5(_0x2488c3, _0x1f11fb);
              if (_0x329c46) {
                const _0x21cb3a = "⏭️ 跳过视频 (标题含排除词\"" + _0x329c46 + "\"): " + (_0xf6810d || "未知作者") + " - 《" + _0x2488c3.substring(0, 15) + "...》";
                console.log("[Built-in-Debug] [标题过滤] " + _0x21cb3a);
                _0x5db745(_0x21cb3a);
                _0x2e0bd7 = true;
              }
            }
            const _0x127913 = _0x1484ed ? _0x56634c(_0x2488c3) : "";
            if (!_0x2e0bd7 && _0xa0eb17(_0x3772c4.currentTask)) {
              if (!_0x1484ed || !_0x127913) {
                const _0x5324ef = "⏭️ 跳过视频 (标题未命中包含词): " + (_0xf6810d || "未知作者") + " - 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》";
                console.log("[Built-in-Debug] [标题过滤] " + _0x5324ef);
                _0x5db745(_0x5324ef);
                _0x2e0bd7 = true;
              }
            }
            const _0x65ba56 = _0x428fb1(_0x3772c4.currentTask.excludeAuthorAccounts);
            if (!_0x2e0bd7 && _0x65ba56.length > 0) {
              if (!_0xf6810d) {
                _0x2cccad("⚠️ 作者识别失败，无法比对排除名单（《" + (_0x2488c3 || "无标题").substring(0, 20) + "...》）");
              } else {
                const _0x2b4a12 = _0x285c2a(_0xf6810d, _0x65ba56);
                if (_0x2b4a12.excluded) {
                  const _0x50e191 = "⏭️ 跳过视频 (作者在排除名单「" + _0x2b4a12.matched + "」): @" + _0xf6810d;
                  console.log("[Built-in-Debug] [作者过滤] " + _0x50e191 + " title=" + _0x2488c3);
                  _0x5db745(_0x50e191 + " 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》");
                  _0x2cccad("⏭️ 作者过滤：@" + _0xf6810d + " 命中排除名单「" + _0x2b4a12.matched + "」，已跳过 " + _0xf6810d + " - 《" + _0x5bcf18(_0x2488c3 || "无标题", 32) + "》");
                  _0x2e0bd7 = true;
                }
              }
            }
            if (!_0x2e0bd7) {
              const _0x3ae198 = parseInt(_0x3772c4.currentTask.minVideoLike) || 0;
              const _0x11099c = parseInt(_0x3772c4.currentTask.minVideoComment) || 0;
              const _0x4b0340 = parseInt(_0x3772c4.currentTask.minVideoCollect) || 0;
              const _0x11ca97 = parseInt(_0x3772c4.currentTask.minVideoShare) || 0;
              if (_0x3ae198 > 0 || _0x11099c > 0 || _0x4b0340 > 0 || _0x11ca97 > 0) {
                let _0x4edd43 = "";
                if (_0x3ae198 > 0 && _0x3341c0.likes < _0x3ae198) {
                  _0x4edd43 = "点赞数 " + _0x3341c0.likes + " < " + _0x3ae198;
                } else if (_0x11099c > 0 && _0x3341c0.comments < _0x11099c) {
                  _0x4edd43 = "评论数 " + _0x3341c0.comments + " < " + _0x11099c;
                } else if (_0x4b0340 > 0 && _0x3341c0.collects < _0x4b0340) {
                  _0x4edd43 = "收藏数 " + _0x3341c0.collects + " < " + _0x4b0340;
                } else if (_0x11ca97 > 0 && _0x3341c0.shares < _0x11ca97) {
                  _0x4edd43 = "转发数 " + _0x3341c0.shares + " < " + _0x11ca97;
                }
                if (_0x4edd43) {
                  const _0x513244 = "⏭️ 跳过视频 (数据未达标 - " + _0x4edd43 + "): " + (_0xf6810d || "未知作者") + " - 《" + (_0x2488c3 || "无标题").substring(0, 15) + "......》";
                  console.log("[Built-in-Debug] [数据过滤] " + _0x513244 + " stats=", _0x3341c0);
                  _0x5db745(_0x513244);
                  _0x2cccad("⏭️ 数据过滤：" + _0x4edd43 + "，已跳过 " + (_0xf6810d || "未知作者") + " - 《" + _0x5bcf18(_0x2488c3 || "无标题", 32) + "》");
                  _0x2e0bd7 = true;
                } else {
                  console.log("[Built-in-Debug] [数据过滤] 校验通过 stats=", _0x3341c0);
                }
              }
            }
            if (!_0x2e0bd7 && _0x3b42f1) {
              const _0x2250df = _0x5d2646.normalizeProcessedVideoKey(_0x5c80ee || _0x20bfd3 || _0x17a248) || _0x5c80ee;
              const _0x45c07e = await _0x20bacc.invoke("claim-processed-video", {
                url: _0x2250df,
                title: _0x2488c3 || "未知视频",
                platform: "douyin",
                forceReclaim: _0x34b3e4
              });
              if (!_0x45c07e?.claimed && !_0x34b3e4) {
                const _0x57331e = _0x45c07e?.reason || "unknown";
                if (_0x57331e === "invalid_url" && _0xc7957e) {
                  console.warn("[Built-in-Debug] [跨账号去重] 推荐流暂无标准视频链接，跳过抢占继续处理 key=" + _0x2250df);
                } else {
                  _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x2250df);
                  _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee);
                  const _0x5cb432 = _0x57331e === "in_flight" ? "其他账号正在处理" : _0x57331e === "already_processed" ? "历史已分析" : "其他账号已占用";
                  const _0x1b2138 = "⏭️ 跳过视频 (" + _0x5cb432 + "): 《" + (_0x2488c3 || "无标题").substring(0, 15) + "...》";
                  console.log("[Built-in-Debug] [跨账号去重] " + _0x1b2138 + " reason=" + _0x57331e);
                  if (_0x5cb432 !== "历史已分析") {
                    _0x5db745(_0x1b2138);
                    _0x2cccad("⏭️ 跨账号去重：视频已被其他账号占用 (" + (_0x45c07e?.reason || "already_claimed") + ")");
                  }
                  _0x2e0bd7 = true;
                  if (_0x2f6f41 === "specific") {
                    _0x29adb5(_0x5c80ee || _0x20bfd3 || _0x17a248);
                    _0x17375f();
                  }
                }
              } else if (_0x45c07e?.claimed) {
                _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x45c07e.key || _0x2250df);
                _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee);
              } else if (_0x34b3e4) {
                console.warn("[Built-in-Debug] [指定视频] claim 未成功但仍继续处理 reason=" + (_0x45c07e?.reason || "unknown"));
                _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x2250df);
                _0x5d2646.rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee);
              }
            }
            if (_0x2e0bd7) {
              try {
                document.querySelector(_0x2c6aa2["douyin.com"].commentPanel)?.closest("[class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"panel\"]")?.querySelector("[data-e2e=\"close\"], [aria-label=\"关闭\"]")?.click?.();
              } catch (_0x1aaf00) {}
              const _0x50cf3b = _0x5c80ee || _0x2488c3 || "";
              if (_0x50cf3b && _0x50cf3b === _0x23c4db) {
                _0x281ba4 += 1;
              } else {
                _0x281ba4 = 1;
                _0x23c4db = _0x50cf3b;
              }
              if (_0x5097d4 && _0x281ba4 >= _0x169f78) {
                _0x281ba4 = 0;
                _0x23c4db = "";
                await _0x160218(_0x356d6e, _0x2f6f41);
                return;
              }
              if (_0x2f6f41 === "search" && _0x281ba4 >= 3) {
                _0x281ba4 = 0;
                _0x23c4db = "";
                _0x5db745("搜索已到末尾（同一视频连续跳过 3 次），正在关闭并切换新词…");
                _0x2cccad("ℹ️ 搜索下滑：同一已分析视频连续跳过 3 次，判定无更多视频", null, "normal");
                try {
                  _0x3a9536?.stop();
                } catch (_0x55be92) {}
                _0x3a9536 = null;
                try {
                  _0x487db2?.stop();
                } catch (_0x108d8d) {}
                _0x487db2 = null;
                await _0x339679(_0x356d6e);
                _0x3772c4.sessionProcessedCount = Math.max(_0x3772c4.sessionProcessedCount, _0x3772c4.targetVideoCount);
                _0x4f043f();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                continue;
              }
              _0x5db745("该视频已分析，切换下一条...", null, "warning");
              _0x45b45e();
              if (_0x2f6f41 === "search" && _0x4f94b7(_0x3772c4.currentTask)) {
                _0x317b17(_0x5c80ee || _0x20bfd3 || _0x17a248, _0x25e80e);
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
              }
              if (_0x2f6f41 === "specific") {
                console.log("[Built-in-Debug] [指定视频] 视频已跳过/已分析，直接进入下一轮跳转下一个链接");
                const _0x49aede = window._specificVideoUrls || _0x442b4e(_0x3772c4.currentTask);
                const _0x8794b3 = await _0x1e6668({
                  reuseActive: true
                });
                _0x29adb5(_0x8794b3 || _0x5c80ee || _0x20bfd3 || _0x17a248);
                _0x442497(_0x3772c4.processedVideos, _0x5c80ee || _0x20bfd3 || _0x17a248, _0x49aede, {
                  persistGlobal: false
                });
                _0x17375f();
                const _0x4ab3e1 = _0x55a954(_0x5c80ee || _0x20bfd3 || _0x8794b3 || _0x17a248);
                if (_0x4ab3e1 && _0x4ab3e1 === _0x408a70) {
                  _0x2e92b3 += 1;
                } else {
                  _0x2e92b3 = 1;
                  _0x408a70 = _0x4ab3e1 || "";
                }
                _0x25e80e.add(_0x5c80ee);
                _0x3772c4.sessionProcessedCount += 1;
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                const _0x4040a2 = await _0x1e6668({
                  reuseActive: false,
                  advance: true
                });
                if (!_0x4040a2 || _0x2e92b3 >= 3) {
                  if (_0x2e92b3 >= 3) {
                    _0x2cccad("⚠️ 指定视频：同一链接连续跳过，已无更多可处理视频", null, "warning");
                  }
                  console.log("[Built-in-Debug] [指定视频] 跳过后无剩余视频，任务结束");
                  _0x5db745("指定视频列表已全部处理，任务结束");
                  await _0x5a7f01(_0x356d6e, _0x2eb397, "specific_completed", {
                    configuredCount: _0x49aede.length
                  });
                  return;
                }
                const _0x43dc49 = _0xeebf5d(_0x4040a2);
                const _0x5b9d92 = _0x55a954(_0x5c80ee || window.location.href);
                const _0x2f23f5 = _0x55a954(_0x4040a2);
                if (_0x2f23f5 && _0x5b9d92 && _0x2f23f5 === _0x5b9d92) {
                  _0x2cccad("⚠️ 指定视频：当前链接已分析，且无其它待处理链接", null, "warning");
                  await _0x5a7f01(_0x356d6e, _0x2eb397, "specific_completed", {
                    configuredCount: _0x49aede.length
                  });
                  return;
                }
                _0x3772c4.lastClickedId = _0x43dc49;
                _0x86715c(_0x43dc49);
                _0x2e92b3 = 0;
                _0x408a70 = "";
                console.log("[Built-in-Debug] [指定视频] 跳过后准备跳转下一个目标: " + _0x4040a2);
                _0x5db745("正在打开指定视频 (" + (_0x49aede.indexOf(_0x4040a2) + 1) + "/" + _0x49aede.length + ")...");
                window.location.href = _0x4040a2;
                await _0x4c0dfb(_0x356d6e);
                continue;
              }
              {
                try {
                  _0x3a9536?.stop();
                } catch (_0x533998) {}
                _0x3a9536 = null;
                try {
                  _0x487db2?.stop();
                } catch (_0x4cee53) {}
                _0x487db2 = null;
                const _0x42725a = await _0x5b4c11(_0x356d6e, {
                  videoTitle: _0x2488c3,
                  leadVideoUrl: _0x20bfd3,
                  dedupKey: _0x5c80ee,
                  modal: _0x1d464e,
                  phaseLabel: "导航-已分析",
                  activeKeyword: _0x3ed3c4 || _0x13678b || "",
                  sessionUrls: _0x25e80e,
                  onSwitchOk: _0x1f6a18
                });
                if (_0x42725a === "navigating") {
                  return;
                }
                if (_0x42725a === "done" || _0x42725a === "continued") {
                  continue;
                }
              }
              try {
                _0x3a9536?.stop();
              } catch (_0x1cb604) {}
              _0x3a9536 = null;
              try {
                _0x487db2?.stop();
              } catch (_0x1cd30e) {}
              _0x487db2 = null;
              const _0x508966 = _0x422e2f(_0x26e218() || _0x1d464e) || "";
              await _0x1d7124(_0x356d6e);
              const _0x234dfc = await _0x22855b(_0x356d6e, {
                previousIdentity: _0x508966,
                previousTitle: _0x2488c3,
                previousAuthor: _0xf6810d,
                leadVideoUrl: _0x20bfd3,
                dedupKey: _0x5c80ee,
                phaseLabel: "导航-已分析",
                preferredScope: _0x10966c || _0x1d464e
              });
              if (_0x234dfc) {
                _0x1f6a18();
              } else {
                const _0x2c9028 = await _0x4aefc9("导航-已分析");
                if (_0x2c9028 === "refresh") {
                  return;
                }
                if (_0x2c9028 === "advance") {
                  continue;
                }
              }
              await _0x2c2bd6(1500, 3000, _0x356d6e, "切换喘息-已分析", _0x10966c || _0x1d464e);
              continue;
            }
            let _0xc0fe71 = false;
            if (!_0x2e0bd7 && _0x43fca3(_0x3772c4.currentTask)) {
              const _0x59bd57 = _0x3d2011.authorUrl;
              const _0x25cedf = _0x19bd50(_0x3772c4.currentTask).has("author") && (!_0x59bd57 || !_0xf6810d);
              const _0x47f523 = _0x30f075({
                videoUrl: _0x20bfd3 || _0x5c80ee || _0x17a248,
                title: _0x2488c3,
                authorNickname: _0xf6810d,
                authorUrl: _0x59bd57,
                source: "opened_video"
              });
              if (_0x530975(_0x47f523) && _0x5c7a24(_0x3772c4.currentTask)) {
                const _0x2e1e04 = _0x59d5e1().normalizeProcessedVideoKey(_0x20bfd3 || _0x5c80ee || _0x17a248) || _0x5c80ee;
                _0x14495d.add(_0x2488c3);
                _0x25e80e.add(_0x5c80ee);
                _0x59d5e1().rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x2e1e04);
                _0x59d5e1().rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee);
                _0x20bacc.send("update-processed-videos", {
                  url: _0x2e1e04,
                  title: _0x2488c3,
                  authorNickname: _0xf6810d,
                  authorUrl: _0x59bd57,
                  platform: "douyin",
                  timestamp: Date.now()
                });
                _0x3772c4.sessionProcessedCount += 1;
                _0x45b45e();
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                _0x20bacc.send("automation-data", {
                  type: "video-processed",
                  payload: {
                    accountId: window._radar_account_id,
                    accountName: window._radar_account_name,
                    sessionCount: _0x3772c4.sessionProcessedCount,
                    targetCount: _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask)
                  }
                });
                _0x5db745("已采集视频/作者卡片数据（" + _0x3772c4.sessionProcessedCount + "/" + _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask) + "），未打开评论区");
                _0x2cccad("✅ 视频补采完成：" + (_0xf6810d || "未知作者") + " - 《" + _0x5bcf18(_0x2488c3, 32) + "》", null, "success");
                _0xc0fe71 = true;
              } else if (_0x25cedf && _0x5c7a24(_0x3772c4.currentTask)) {
                _0x5db745("当前视频未识别到有效作者主页，已跳过空记录并继续补采");
                _0x2cccad("⚠️ 主页补采失败：未找到《" + _0x5bcf18(_0x2488c3 || "未知视频", 32) + "》的作者主页链接，本条不会计入采集数量", null, "warning");
                _0xc0fe71 = true;
              } else if (_0x47f523?.videoUrl) {
                _0x2cccad("🔗 视频解析中：" + (_0xf6810d || "未知作者") + " - 《" + _0x5bcf18(_0x2488c3, 24) + "》");
              }
            }
            _0x281ba4 = 0;
            _0x23c4db = "";
            if (!_0x2e0bd7 && !_0xc0fe71) {
              let _0x57348a = null;
              const _0xcab378 = (parseInt(_0x3772c4.currentTask.stayMin) || 5) * 1000;
              const _0x544a03 = (parseInt(_0x3772c4.currentTask.stayMax) || 12) * 1000;
              _0x4eb145(_0x10966c || _0x1d464e, "观看前锁定当前视频");
              const _0x816d39 = _0x580be4(_0x10966c || _0x1d464e);
              const _0xdf66a3 = _0x816d39.imageText ? Math.min(_0xcab378, 500) : _0xcab378;
              const _0x4b1bef = _0x816d39.imageText ? Math.min(_0x544a03, 1200) : _0x544a03;
              if (_0x816d39.imageText) {
                console.log("[Built-in-Debug] [视频防跳] 检测到图文/无视频内容，压缩观看休眠并尽快进入评论区");
                _0x2cccad("🧷 视频防跳：检测到图文/无视频内容，已压缩观看休眠，避免 6 秒左右自动跳转");
              }
              const _0x3b591b = await _0x175680(_0xdf66a3, _0x4b1bef, _0x356d6e, "观看休眠", _0x1d52db, {
                allowRandomPlay: _0x3772c4.currentTask?.taskMode !== "scrape"
              });
              if (!_0x3b591b) {
                const _0x2a21b2 = _0xfd53b9(_0x1d52db);
                if (_0x2a21b2.same || _0x2a21b2.videoIdMatched) {
                  console.warn("[Built-in-Debug] [视频防跳] 观看等待曾报切换，但视频 ID 未变，按误判继续");
                  _0x2cccad("🧷 视频防跳：等待期抖动已忽略（视频 ID 未变）", null, "warning");
                } else {
                  _0x5db745("当前视频在等待期间已自动切换，重新识别当前视频...");
                  _0x2cccad("⚠️ 视频防跳：等待期间检测到视频已自动切换，已放弃旧视频记录并重新识别当前页面", null, "warning");
                  await _0x15ab7e([_0x1d52db.leadVideoUrl, _0x1d52db.dedupKey, _0x20bfd3, _0x5c80ee, _0x17a248], "watch_drift");
                  _0x45b45e();
                  continue;
                }
              }
              _0x4eb145(_0x10966c || _0x1d464e, "观看休眠结束后再次锁定当前视频");
              let _0x35d930 = null;
              try {
                try {
                  _0x3a9536?.stop();
                } catch (_0x4995d3) {}
                _0x3a9536 = null;
                try {
                  _0x487db2?.stop();
                } catch (_0xf6cabd) {}
                _0x487db2 = null;
                _0x35d930 = _0x1567ad(_0x1d52db, _0x356d6e);
                if (await _0x27603f(_0x10966c, _0x356d6e)) {
                  _0x4eb145(_0x10966c || _0x1d464e, "评论区打开后锁定当前视频");
                  const _0x57c8ec = _0xfd53b9(_0x1d52db);
                  if (!_0x57c8ec.same) {
                    if (_0x57c8ec.videoIdMatched) {
                      console.warn("[Built-in-Debug] [视频防跳] 评论区打开后曾报漂移，但视频 ID 未变，按误判继续");
                    } else {
                      console.warn("[Built-in-Debug] [视频防跳] 评论区打开后检测到视频已漂移: current=" + (_0x57c8ec.currentUrl || _0x57c8ec.currentTitle || "unknown"));
                      _0x5db745("评论区打开后发现视频已切换，重新识别当前视频...");
                      await _0x15ab7e([_0x1d52db.leadVideoUrl, _0x1d52db.dedupKey, _0x20bfd3, _0x5c80ee, _0x17a248], "panel_open_drift");
                      _0x45b45e();
                      _0x35d930?.stop();
                      continue;
                    }
                  }
                  const _0x45625c = parseInt(_0x3772c4.currentTask.likeMin) || 0;
                  const _0x29dd30 = parseInt(_0x3772c4.currentTask.likeMax) || 0;
                  const _0x4f2061 = parseInt(_0x3772c4.currentTask.commentMin) || 0;
                  const _0x2f197c = parseInt(_0x3772c4.currentTask.commentMax) || 0;
                  const _0x3f5eca = _0x3772c4.sessionFollowLimit === _0x1012e0 ? Number.MAX_SAFE_INTEGER : Math.max(0, _0x3772c4.sessionFollowLimit - _0x3772c4.sessionFollowCount);
                  const _0x5d593b = _0x3772c4.sessionDmLimit === _0x1012e0 ? Number.MAX_SAFE_INTEGER : Math.max(0, _0x3772c4.sessionDmLimit - _0x3772c4.sessionDmCount);
                  const _0x4b176e = {
                    likes: _0x3772c4.currentTask.enableLike ? Math.floor(Math.random() * (_0x29dd30 - _0x45625c + 1)) + _0x45625c : 0,
                    comments: _0x3772c4.currentTask.enableComment ? Math.floor(Math.random() * (_0x2f197c - _0x4f2061 + 1)) + _0x4f2061 : 0,
                    follows: _0x3772c4.currentTask.enableFollow ? _0x3f5eca : 0,
                    dms: _0x3772c4.currentTask.enableDM ? _0x5d593b : 0
                  };
                  if (_0x3772c4.sessionInteractionLimit !== _0x1012e0) {
                    const _0x12269b = Math.max(0, _0x3772c4.sessionInteractionLimit - _0x3772c4.sessionInteractionCount);
                    let _0x4f4741 = _0x4b176e.likes + _0x4b176e.comments;
                    if (_0x4f4741 > _0x12269b) {
                      const _0xafab1 = _0x12269b / _0x4f4741;
                      _0x4b176e.comments = Math.min(_0x4b176e.comments, Math.ceil(_0x4b176e.comments * _0xafab1));
                      _0x4b176e.likes = Math.min(_0x4b176e.likes, _0x12269b - _0x4b176e.comments);
                      if (_0x4b176e.likes < 0) {
                        _0x4b176e.likes = 0;
                      }
                      console.log("[Built-in-Debug] [总量控制] 剩余互动额度 " + _0x12269b + "，本视频配额裁剪为: 点赞=" + _0x4b176e.likes + ", 评论=" + _0x4b176e.comments);
                    }
                  }
                  const _0x165aa4 = {
                    ..._0x4b176e
                  };
                  const _0x5a8666 = () => {
                    _0x20bacc.send("automation-data", {
                      type: "interaction-progress",
                      payload: {
                        accountId: window._radar_account_id,
                        likes: {
                          current: _0x165aa4.likes - _0x4b176e.likes,
                          total: _0x165aa4.likes
                        },
                        replies: {
                          current: _0x165aa4.comments - _0x4b176e.comments,
                          total: _0x165aa4.comments
                        },
                        follows: {
                          current: _0x165aa4.follows - _0x4b176e.follows,
                          total: _0x165aa4.follows
                        },
                        messages: {
                          current: _0x165aa4.dms - _0x4b176e.dms,
                          total: _0x165aa4.dms
                        }
                      }
                    });
                  };
                  _0x5a8666();
                  console.log("[Built-in-Debug] [处理视频] " + _0x2488c3 + ", 配额: 点赞=" + _0x4b176e.likes + ", 评论=" + _0x4b176e.comments + ", 关注=" + _0x4b176e.follows + ", 私信=" + _0x4b176e.dms);
                  _0x5db745("正在分析视频：《" + _0x2488c3.substring(0, 15) + "...》");
                  _0x57348a = _0x3341c0.comments;
                  let _0x4d9ee8 = _0x3341c0.comments;
                  _0x5db745("   └ 📊 视频数据: 赞 " + _0x3341c0.likes + " | 评 " + _0x3341c0.comments + " | 藏 " + _0x3341c0.collects + " | 转 " + _0x3341c0.shares);
                  const _0x5e29bf = await _0x25d35e(_0x10966c, _0x356d6e, _0x4d9ee8);
                  const _0x19a279 = _0x4b0e90(_0x10966c, _0x4d9ee8);
                  if (_0x19a279 === 0 && _0x4d9ee8 > 0) {
                    console.log("[Built-in-Debug] [评论空态] 侧栏评=" + _0x4d9ee8 + "，面板暂无评论，改为 0");
                    _0x2cccad("📭 评论区显示暂无评论（侧栏曾显示 " + _0x4d9ee8 + "），按 0 条处理");
                    _0x4d9ee8 = 0;
                    _0x57348a = 0;
                  } else if (_0x4d9ee8 > 0 && _0x5e29bf === 0 && _0x12aa49(_0x10966c)) {
                    _0x4d9ee8 = 0;
                    _0x57348a = 0;
                  }
                  if (_0x4d9ee8 && _0x4d9ee8 > 0) {
                    console.log("[Built-in-Debug] [慢设备保护] 评论总数 " + _0x4d9ee8 + "，进入分析前已渲染评论节点 " + _0x5e29bf);
                  }
                  let _0x4c4f76 = false;
                  let _0x28fc6f = "";
                  const _0x23d8cb = _0x5c80ee || _0x20bfd3 || _0x17a248;
                  const _0x1ec3c7 = _0x55ea51(_0x2488c3);
                  if (_0x1ec3c7) {
                    const _0x2092c6 = _0x56634c(_0x2488c3);
                    _0x2cccad("🎯 标题命中包含词「" + _0x2092c6 + "」，已选中（跳过人设预筛）");
                    if (_0x3b7975(_0x3772c4.currentTask) && !_0x7eeba5(_0x23d8cb)) {
                      const _0x598697 = _0xc7957e ? document : _0x10966c;
                      const _0x51656c = _0x21df30(_0x598697, 8);
                      _0x28fc6f = await _0x16446c(_0x2488c3, _0x51656c, _0x356d6e);
                    }
                  } else if (_0x31b6d3(_0x3772c4.currentTask)) {
                    const _0x3f0573 = _0xc7957e ? document : _0x10966c;
                    const _0x708657 = _0x21df30(_0x3f0573, 10);
                    const _0x4d5e9e = _0xd317e1(_0x3772c4.currentTask) && !_0x7eeba5(_0x23d8cb);
                    const _0x4dbb34 = await _0x22d629(_0x2488c3, _0x708657, _0x356d6e, {
                      withMainPost: _0x4d5e9e
                    });
                    _0x4c4f76 = _0x4dbb34?.pass === false;
                    if (!_0x4c4f76) {
                      _0x28fc6f = String(_0x4dbb34?.mainPostComment || "").trim();
                    }
                  }
                  if (_0x4c4f76) {
                    console.log("[Built-in-Debug] [DY智能预筛] 视频《" + _0x2488c3.substring(0, 20) + "...》不匹配，跳过采集互动");
                    _0x5db745("🎯 智能预筛不匹配，切换下一条视频...");
                  } else {
                    if (_0x3772c4.currentTask.enableVideoComment && _0x3772c4.currentTask.taskMode === "interaction" && !_0x4ee1a2()) {
                      const _0x4af7f7 = _0x5c80ee || _0x20bfd3 || _0x17a248;
                      if (_0x7eeba5(_0x4af7f7)) {
                        _0x2cccad("📝 视频主评：本账号已评论过此视频，跳过重复发表", null, "warning");
                      } else {
                        let _0x2d088d = [];
                        if (_0x3772c4.currentTask.videoCommentMode === "ai" && !_0x3772c4.currentTask.enableVideoCommentWithoutText && !_0x28fc6f) {
                          await _0x48c915(_0x10966c, _0x356d6e);
                          const _0xf656c1 = _0xc7957e ? document : _0x10966c;
                          if (_0x4d9ee8 !== null && _0x4d9ee8 > 0) {
                            await _0x2770da(500);
                          }
                          _0x2d088d = _0x21df30(_0xf656c1, 8);
                        }
                        _0x5db745("正在自动发表视频主贴评论...");
                        _0x22f7f3("调用 postVideoComment", "videoKey=" + _0x5bcf18(_0x4af7f7, 40));
                        let _0x2e9f8d = null;
                        try {
                          _0x2e9f8d = await _0x23ef9e(_0xc7957e ? _0x26e218() || _0x1d464e : _0x1d464e, _0x356d6e, {
                            commentSamples: _0x2d088d,
                            videoKey: _0x4af7f7,
                            videoTitle: _0x2488c3,
                            prefetchedCommentText: _0x28fc6f
                          });
                        } catch (_0x15aadb) {
                          _0x22f7f3("postVideoComment 异常", _0x5bcf18(_0x15aadb?.message || _0x15aadb, 80), "warning");
                          if (_0x15aadb?.message !== "TASK_ABORTED") {
                            throw _0x15aadb;
                          }
                          _0x2e9f8d = {
                            success: false,
                            error: "task_aborted",
                            aborted: true
                          };
                        }
                        _0x22f7f3("postVideoComment 返回", "success=" + !!_0x2e9f8d?.success + " skipped=" + !!_0x2e9f8d?.skipped + " error=" + (_0x2e9f8d?.error || "none"));
                        if (_0x2e9f8d?.success) {
                          _0x2cccad("📝 视频主评：评论已提交 →「" + _0x5bcf18(_0x2e9f8d.content || "", 32) + "」");
                          await _0x2ec61b(_0x356d6e);
                          await _0x12788e(_0x356d6e);
                        } else if (_0x2e9f8d?.skipped && _0x2e9f8d?.reason === "already_commented") {} else if (_0x2e9f8d?.error) {
                          _0x2cccad("📝 视频主评：评论失败（" + _0x5bcf18(_0x2e9f8d.error, 60) + "）");
                        }
                        _0x22f7f3("主评阶段结束", "taskRunning=" + _0x3772c4.taskRunning + " budget L" + _0x4b176e.likes + "/C" + _0x4b176e.comments);
                      }
                    }
                    if (_0x4d9ee8 === 0) {
                      console.log("[Built-in-Debug] 该视频总评论数为 0，跳过评论内滚，切换下一条。");
                      _0x5db745("⚠️ 检测到评论数为0，跳过评论区滚动...");
                    } else {
                      _0x22f7f3("进入评论内滚", "totalCount=" + (_0x4d9ee8 ?? "unknown") + " mode=" + _0x3772c4.currentTask.taskMode);
                      let _0x1b2b39 = 0;
                      let _0x443e11 = 0;
                      let _0x338d5b = 0;
                      let _0x4dc189 = _0x5e29bf || _0xb56314(_0x10966c);
                      let _0x590dad = 0;
                      let _0x4bb99e = _0x21227b(_0x10966c);
                      let _0x35786e = "";
                      let _0x2eb049 = 0;
                      let _0x422a97 = 0;
                      let _0x3af2ba = "";
                      const _0x131437 = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248);
                      const _0x52ffbd = window._commentScrapeProgress;
                      if (_0x3772c4.currentTask.taskMode === "scrape" && _0x52ffbd && _0x52ffbd.videoId && _0x52ffbd.videoId === _0x131437) {
                        _0x422a97 = Math.max(0, Number(_0x52ffbd.scrollRound) || 0);
                        _0x590dad = Math.max(0, Number(_0x52ffbd.videoCollectedCount) || 0);
                        const _0x8ad642 = _0x31576a(_0x10966c);
                        if (_0x8ad642 && _0x52ffbd.scrollTop > 0) {
                          _0x8ad642.scrollTop = _0x52ffbd.scrollTop;
                        }
                        _0x2cccad("🧷 评论" + (_0x3772c4.currentTask.taskMode === "scrape" ? "采集" : "解析") + "：从上次进度继续（约第 " + (_0x422a97 + 1) + " 轮，已入库 " + _0x590dad + " 条）");
                        window._commentScrapeProgress = null;
                      }
                      let _0x43323b = _0x3772c4.currentTask.taskMode === "scrape" ? 120 : 60;
                      if (_0x4d9ee8 !== null && _0x4d9ee8 > 0) {
                        const _0x2ac46f = Math.ceil(_0x4d9ee8 / 6 * 1.3);
                        const _0x2d0594 = _0x3772c4.currentTask.taskMode === "scrape" ? 2000 : 100;
                        _0x43323b = Math.min(_0x2ac46f, _0x2d0594);
                        const _0x3798f3 = _0x3772c4.currentTask.taskMode === "scrape" ? 50 : 20;
                        if (_0x43323b < _0x3798f3) {
                          _0x43323b = _0x3798f3;
                        }
                        console.log("[Built-in-Debug] [内滚优化] 视频总评论数 " + _0x4d9ee8 + "，计算动态最大滚动次数为: " + _0x43323b + " (任务模式: " + _0x3772c4.currentTask.taskMode + ")");
                      } else {
                        console.log("[Built-in-Debug] [内滚优化] 无法获取视频总评论数，使用默认最大滚动次数: " + _0x43323b);
                      }
                      const _0x23a19d = new _0x3e7733();
                      const _0x56359f = _0x27a937({
                        taskMode: "scrape"
                      }) ? {
                        failCount: 0,
                        skipExpand: false
                      } : null;
                      let _0x23ca98 = 0;
                      for (let _0x350bb7 = _0x422a97; _0x350bb7 < _0x43323b; _0x350bb7++) {
                        if (_0x3c37ea(_0x356d6e)) {
                          _0x22f7f3("内滚中断", _0x3f2526(_0x356d6e), "warning");
                          break;
                        }
                        if (_0xb56314(_0x10966c) === 0 && _0x12aa49(_0x10966c)) {
                          _0x2cccad("📭 评论区显示暂无评论，结束本视频评论滚动");
                          _0x4d9ee8 = 0;
                          _0x57348a = 0;
                          break;
                        }
                        _0x4eb145(_0x10966c || _0x1d464e);
                        if (_0x2b2515(_0x35d930)) {
                          if (_0x3772c4.currentTask.taskMode === "scrape") {
                            _0x2c725f(_0x131437, _0x350bb7, _0x10966c, _0x590dad);
                          }
                          break;
                        }
                        if (_0x4ee1a2()) {
                          break;
                        }
                        if (_0x3772c4.currentTask.taskMode === "interaction" && _0x4b176e.likes <= 0 && _0x4b176e.comments <= 0) {
                          console.log("[Built-in-Debug] [内滚] 本视频互动配额已用完，准备切换下一个...");
                          break;
                        }
                        const _0x447610 = _0x3772c4.currentTask.taskMode === "scrape" ? _0x2d5544(_0x4d9ee8, _0x590dad) : 10;
                        if (!_0x3af2ba && _0x443e11 >= _0x447610) {
                          const _0x2dc63f = _0x3772c4.currentTask.taskMode === "scrape" && _0x35786e === "session-duplicate" && _0x44abb9(_0x4d9ee8, _0x590dad, _0x10966c);
                          const _0x47ac93 = _0x3772c4.currentTask.taskMode === "scrape" && _0xfca99f(_0x4d9ee8, _0x590dad, _0x2eb049);
                          if (_0x2dc63f || _0x47ac93) {
                            if (_0x47ac93) {
                              _0x2eb049++;
                            }
                            const _0x5700f9 = _0x4505e8(_0x10966c);
                            const _0x3c56e0 = _0x2dc63f ? "同屏重复" : "低覆盖空窗";
                            const _0xe154bf = _0x47ac93 ? ", probe=" + _0x2eb049 + "/3" : "";
                            console.log("[Built-in-Debug] [内滚恢复] 连续 " + _0x443e11 + " 轮" + _0x3c56e0 + "，继续强推滚动复核边界 (remaining=" + Math.round(_0x5700f9.remaining) + "px, 已采=" + _0x590dad + "/" + (_0x4d9ee8 || "?") + _0xe154bf + ")");
                            _0x5db745(_0x47ac93 ? "评论区可能未到底（已入库 " + _0x590dad + "/" + (_0x4d9ee8 || "未知") + "），正在第 " + _0x2eb049 + "/3 次强制复核…" : "评论区仍未到底（已入库 " + _0x590dad + "/" + (_0x4d9ee8 || "未知") + "），继续恢复滚动加载…");
                            _0x1ab00a(_0x10966c);
                            await _0x1ce487(_0x10966c, _0x356d6e, _0x443e11);
                          } else {
                            const _0x3cf16f = _0x4d9ee8 ? "总评论约 " + _0x4d9ee8 + " 条" : "总评论数未知";
                            _0x2cccad("📭 本视频采集结束：已连续 " + _0x447610 + " 轮无新入库（本视频累计新入库 " + _0x590dad + " 条，" + _0x3cf16f + "，当前可见 " + _0x4dc189 + " 个节点），切换下一个视频");
                            break;
                          }
                        }
                        if (_0x3772c4.currentTask.taskMode === "scrape" && _0x27a937({
                          taskMode: "scrape"
                        })) {
                          await _0xd5c87c(_0x10966c, _0x356d6e, _0x23a19d, _0x56359f, {
                            taskMode: "scrape"
                          });
                        }
                        _0x5db745(_0x5e45be(_0x350bb7, _0x43323b, _0x4d9ee8));
                        const _0x265ee6 = await _0x2d754f(_0x10966c, _0x2488c3, _0x356d6e, _0x4b176e, _0x5a8666, _0x20bfd3, {
                          nickname: _0xf6810d,
                          profileUrl: _0x3d2011?.authorUrl || ""
                        });
                        _0x4eb145(_0x10966c || _0x1d464e);
                        if (_0x2b2515(_0x35d930)) {
                          if (_0x3772c4.currentTask.taskMode === "scrape") {
                            _0x2c725f(_0x131437, _0x350bb7, _0x10966c, _0x590dad);
                          }
                          break;
                        }
                        const _0x1d4086 = _0xb56314(_0x10966c);
                        const _0x5239f2 = _0x21227b(_0x10966c);
                        const _0x3e27ce = !!_0x5239f2 && !!_0x4bb99e && _0x5239f2 !== _0x4bb99e;
                        if (_0x5239f2) {
                          _0x4bb99e = _0x5239f2;
                        }
                        _0x590dad += _0x265ee6.newLeadsCount || 0;
                        const _0x3435bd = _0x3af2ba || _0x32ec1c(_0x10966c);
                        _0x3af2ba = "";
                        if (_0x3435bd) {
                          const _0x5bef32 = _0x5bcf18(_0x3435bd, 24);
                          console.log("[Built-in-Debug] [评论区到底] 检测到平台提示「" + _0x5bef32 + "」，停止继续下拉");
                          _0x5db745("评论区已显示没有更多评论，准备切换下一个视频...");
                          _0x2cccad("📭 本视频评论区已到底：检测到「" + _0x5bef32 + "」，不再重复下拉");
                          break;
                        }
                        const _0x483cbd = _0x1d4086 > _0x4dc189;
                        const _0x10e282 = _0x4d9ee8 && _0x4d9ee8 > 0 ? Math.min(_0x4d9ee8, _0x3772c4.currentTask.taskMode === "scrape" ? 10 : 6) : 0;
                        const _0x26ce76 = _0x4d9ee8 && _0x4d9ee8 > 0 && _0x1d4086 > 0 && _0x1d4086 < _0x10e282 && _0x350bb7 < 6;
                        if (_0x3772c4.currentTask.taskMode === "interaction") {
                          if (_0x265ee6.newLeadsCount === 0) {
                            if (_0x483cbd || _0x26ce76) {
                              _0x23ca98 = 0;
                              console.log("[Built-in-Debug] [慢设备保护] 暂未发现新增线索，但评论 DOM " + (_0x483cbd ? "仍在增长" : "仍在预热") + " (" + _0x1d4086 + "/" + (_0x4d9ee8 || "?") + ")，不判定历史边界");
                              _0x5db745("评论区仍在加载 (" + _0x1d4086 + "/" + (_0x4d9ee8 || "未知") + ")，继续等待分析...");
                            } else {
                              _0x23ca98++;
                              console.log("[Built-in-Debug] [实时互动] 连续 " + _0x23ca98 + " 次滚动未发现新增意向线索 (历史已存在或无新增)");
                            }
                            const _0x48322f = 10;
                            if (_0x23ca98 >= _0x48322f) {
                              console.log("[Built-in-Debug] [实时互动] 连续 " + _0x48322f + " 次滚动未发现新增线索，判定已到达历史处理边界，提前结束此视频");
                              _0x2cccad("📭 本视频互动结束：已连续 " + _0x48322f + " 轮滚动仍无新增意向线索，切换下一个视频");
                              _0x5db745("⚠️ 连续多次未发现新增线索，可能已到达历史处理边界，准备切换下一个视频...");
                              break;
                            }
                          } else {
                            _0x23ca98 = 0;
                          }
                        }
                        const _0x735c2 = _0x265ee6.newLeadsCount > 0;
                        const _0x2b25a3 = _0x483cbd || _0x26ce76;
                        const _0x5a5eed = _0x3772c4.currentTask.taskMode === "scrape" && _0x3e27ce;
                        if (_0x735c2 || _0x2b25a3 || _0x5a5eed) {
                          _0x443e11 = 0;
                          _0x338d5b = 0;
                          _0x35786e = "";
                          _0x2eb049 = 0;
                          if (_0x5a5eed && !_0x735c2) {
                            _0x5db745("评论区视口已翻页（可见 " + _0x1d4086 + " 节点），继续向下采集…");
                          }
                        } else {
                          _0x443e11++;
                          const _0x130096 = _0x265ee6.parsedCount || 0;
                          const _0x28b566 = _0x265ee6.sessionSkipCount || 0;
                          const _0x41301e = _0x130096 > 0 && _0x28b566 >= _0x130096;
                          if (_0x3772c4.currentTask.taskMode === "scrape") {
                            if (!_0x41301e && _0x130096 === 0) {
                              _0x338d5b++;
                              _0x35786e = "no-parsed";
                            } else if (_0x130096 > 0 && _0x28b566 < _0x130096) {
                              _0x338d5b++;
                              _0x35786e = "non-session-duplicate";
                            } else if (_0x41301e) {
                              _0x35786e = "session-duplicate";
                            }
                          } else {
                            _0x338d5b++;
                            _0x35786e = "";
                          }
                          const _0x3d0d3d = _0x3772c4.currentTask.taskMode === "scrape" ? _0x2d5544(_0x4d9ee8, _0x590dad) : _0x447610;
                          console.log("[Built-in-Debug] [内滚] 无新入库 (" + _0x443e11 + "/" + _0x3d0d3d + ")" + (_0x3772c4.currentTask.taskMode === "scrape" ? " 本视频已采" + _0x590dad + "/" + (_0x4d9ee8 || "?") + " 解析" + _0x130096 + " 本任务重复" + _0x28b566 : ""));
                          if (_0x3772c4.currentTask.taskMode === "scrape" && _0x41301e) {
                            _0x5db745("评论区暂未翻到新内容（本屏 " + _0x130096 + " 条均已录），加强滚动加载…");
                            await _0x1ce487(_0x10966c, _0x356d6e, _0x443e11);
                          } else {
                            const _0x1fcc00 = _0x31576a(_0x10966c);
                            if (_0x1fcc00) {
                              if (_0x443e11 <= 2) {
                                console.log("[Built-in-Debug] [内滚微调] 轻微抖动滚动以触发懒加载");
                                await _0x1e878c(_0x10966c, -80, _0x356d6e, {
                                  delayMin: 60,
                                  delayMax: 120
                                });
                                await _0x1e878c(_0x10966c, 220, _0x356d6e, {
                                  delayMin: 80,
                                  delayMax: 140
                                });
                              } else if (_0x443e11 <= 5) {
                                console.log("[Built-in-Debug] [内滚强推] 中等强度滚动（" + _0x443e11 + "次空窗）");
                                await _0x1e878c(_0x10966c, -200, _0x356d6e, {
                                  delayMin: 80,
                                  delayMax: 140
                                });
                                await _0x1e878c(_0x10966c, 1600, _0x356d6e, {
                                  delayMin: 120,
                                  delayMax: 220
                                });
                              } else {
                                console.log("[Built-in-Debug] [内滚极推] 高强度滚动（" + _0x443e11 + "次空窗）");
                                await _0x1ce487(_0x10966c, _0x356d6e, _0x443e11);
                              }
                            }
                          }
                        }
                        if (_0x1d4086 > _0x4dc189) {
                          _0x4dc189 = _0x1d4086;
                        }
                        const _0x3e4999 = _0x3772c4.currentTask.taskMode === "scrape" ? _0x1ce98e(_0x4d9ee8, _0x590dad) : 10;
                        if (_0x338d5b >= _0x3e4999) {
                          const _0x278fe5 = _0x4d9ee8 ? Math.round(_0x590dad / _0x4d9ee8 * 100) + "%" : "?";
                          if (_0x3772c4.currentTask.taskMode === "scrape" && _0xfca99f(_0x4d9ee8, _0x590dad, _0x2eb049)) {
                            _0x2eb049++;
                            console.log("[Built-in-Debug] [内滚边界复核] 连续 " + _0x3e4999 + " 次无有效评论可解析，但覆盖率仍低（已采 " + _0x590dad + "/" + (_0x4d9ee8 || "?") + "，" + _0x278fe5 + "），第 " + _0x2eb049 + "/3 次强推复核");
                            _0x5db745("评论区边界复核中（已入库 " + _0x590dad + "/" + (_0x4d9ee8 || "未知") + "，" + _0x278fe5 + "），继续强推滚动…");
                            _0x1ab00a(_0x10966c);
                            await _0x1ce487(_0x10966c, _0x356d6e, _0x338d5b);
                          } else {
                            console.log("[Built-in-Debug] [内滚边界] 连续 " + _0x3e4999 + " 次无有效评论可解析，判定已到达数据边界（已采 " + _0x590dad + "/" + (_0x4d9ee8 || "?") + "，" + _0x278fe5 + "）");
                            _0x2cccad("📭 本视频采集结束：已连续 " + _0x3e4999 + " 轮无有效评论可解析（已入库 " + _0x590dad + " 条，总评论约 " + (_0x4d9ee8 || "未知") + " 条），切换下一个视频");
                            break;
                          }
                        }
                        _0x1ab00a(_0x10966c);
                        _0x39ab75(_0x10966c, "comment-scroll", _0x3772c4.currentTask.taskMode === "interaction" ? 25000 : 45000);
                        await _0x1e878c(_0x10966c, 1100, _0x356d6e, {
                          delayMin: 50,
                          delayMax: 120
                        });
                        let _0x40ad2b = _0x3772c4.currentTask.taskMode === "scrape" ? 800 : 1500;
                        let _0x18febd = _0x3772c4.currentTask.taskMode === "scrape" ? 1800 : 3000;
                        if (_0x4d9ee8 && _0x4d9ee8 > 0) {
                          const [_0x3cd970, _0x40f4ec] = _0xca655({
                            phase: "post-scroll",
                            expectedTotalCount: _0x4d9ee8,
                            visibleCount: Math.max(_0x1d4086, _0x4dc189),
                            emptyRounds: _0x443e11,
                            scrollIndex: _0x350bb7
                          });
                          _0x40ad2b = Math.max(_0x40ad2b, _0x3cd970);
                          _0x18febd = Math.max(_0x18febd, _0x40f4ec);
                          if (_0x40ad2b > 1800 || _0x18febd > 3500) {
                            console.log("[Built-in-Debug] [慢设备保护] 自适应延长内滚等待: " + _0x40ad2b + "-" + _0x18febd + "ms (评论节点 " + Math.max(_0x1d4086, _0x4dc189) + "/" + _0x4d9ee8 + ", 空窗 " + _0x443e11 + ")");
                          }
                        }
                        const _0x1c8085 = await _0x175680(_0x40ad2b, _0x18febd, _0x356d6e, _0x443e11 > 0 ? "评论加载等待" : "内滚", _0x1d52db, {
                          allowRandomPlay: false
                        });
                        if (!_0x1c8085) {
                          if (_0x35d930) {
                            _0x35d930.drifted = true;
                          }
                          if (_0x3772c4.currentTask.taskMode === "scrape") {
                            _0x2c725f(_0x131437, _0x350bb7, _0x10966c, _0x590dad);
                          }
                          break;
                        }
                        _0x3af2ba = _0x32ec1c(_0x10966c);
                      }
                    }
                  }
                } else {
                  _0x5db745("评论区仍未打开，跳过本条，切换下一条…");
                }
              } finally {
                _0x35d930?.stop();
              }
              if (_0x2b2515(_0x35d930)) {
                const _0x99decb = _0xfd53b9(_0x1d52db);
                if (_0x99decb.same || _0x99decb.videoIdMatched) {
                  _0x2cccad("🧷 视频防跳：评论期抖动已忽略（视频 ID 未变）", null, "warning");
                } else if (_0x2f6f41 === "specific") {
                  const _0x5e2bb1 = await _0x1e6668({
                    reuseActive: true
                  });
                  const _0x3545e0 = _0x20f668(window.location.href);
                  const _0xd5ced3 = _0x5e2bb1 && _0x544133(_0x3545e0, _0x5e2bb1);
                  if (_0xd5ced3) {
                    _0x2cccad("🧷 指定视频：防跳误判，当前仍在目标视频页，从上次进度继续采集", null, "warning");
                    _0x5db745("仍在目标视频上，从上次评论进度继续…");
                    continue;
                  }
                  _0x5db745("指定视频在采集期间发生切换，正在重新打开目标链接...");
                  _0x2cccad("⚠️ 指定视频：确认已离开目标视频，将重新打开待处理链接", null, "warning");
                  await _0x15ab7e([_0x1d52db.leadVideoUrl, _0x1d52db.dedupKey, _0x20bfd3, _0x5c80ee, _0x17a248], "specific_comment_drift");
                  _0x45b45e();
                  if (_0x5e2bb1) {
                    window.location.href = _0x5e2bb1;
                    await _0x4c0dfb(_0x356d6e);
                  }
                  continue;
                } else {
                  _0x5db745("评论分析期间发现视频已自动切换，重新识别当前页面...");
                  _0x2cccad("⚠️ 视频防跳：评论分析期间检测到视频已自动切换，已放弃旧视频记录并重新识别当前页面", null, "warning");
                  await _0x15ab7e([_0x1d52db.leadVideoUrl, _0x1d52db.dedupKey, _0x20bfd3, _0x5c80ee, _0x17a248], "comment_drift");
                  _0x45b45e();
                  continue;
                }
              }
              if (_0x3772c4.currentTask.taskMode === "scrape") {
                const _0x3ffb86 = _0x55a954(_0x20bfd3 || _0x5c80ee || _0x17a248);
                if (window._commentScrapeProgress?.videoId === _0x3ffb86) {
                  window._commentScrapeProgress = null;
                }
              }
              if (_0x1484ed) {
                _0x14495d.add(_0x2488c3);
              }
              _0x25e80e.add(_0x5c80ee);
              _0x29adb5(_0x5c80ee || _0x20bfd3 || _0x17a248);
              const _0x3fdfce = _0x59d5e1().normalizeProcessedVideoKey(_0x169927(_0x20bfd3) ? _0x20bfd3 : _0x5c80ee) || _0x5c80ee;
              _0x59d5e1().rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x3fdfce);
              _0x59d5e1().rememberProcessedVideoKey(_0x3772c4.processedVideos, _0x5c80ee);
              _0x20bacc.send("update-processed-videos", {
                url: _0x3fdfce,
                title: _0x2488c3,
                platform: "douyin",
                timestamp: Date.now()
              });
              _0x3772c4.sessionProcessedCount++;
              _0x281ba4 = 0;
              _0x23c4db = "";
              _0x45b45e();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              _0x22f7f3("视频处理完成", _0x3772c4.sessionProcessedCount + "/" + _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask) + " · 评论约 " + (_0x57348a ?? "?") + " 条");
              _0x20bacc.send("automation-data", {
                type: "video-processed",
                payload: {
                  accountId: window._radar_account_id,
                  accountName: window._radar_account_name,
                  sessionCount: _0x3772c4.sessionProcessedCount,
                  targetCount: _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask),
                  commentsCount: _0x57348a !== null ? _0x57348a : undefined
                }
              });
              _0x39ab75(_0x10966c || _0x1d464e || document.body, "video-processed", 0);
            }
            if (_0x2f6f41 !== "specific" && _0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
              try {
                document.querySelectorAll("video").forEach(_0x14f86e => {
                  if (!_0x14f86e.paused) {
                    _0x14f86e.pause();
                  }
                });
                console.log("[Built-in-Debug] 目标达成，停止视频并结束任务");
              } catch (_0x9c4e7b) {}
              _0x18bee7();
              _0x20bacc.send("keyword-finished", {
                taskId: _0x356d6e,
                keyword: _0xdcca2e
              });
              continue;
            }
            const _0x3a9c53 = _0x23aa1b(_0x2f6f41, _0x3772c4.currentTask);
            console.log("[Built-in-Debug] 已处理 " + _0x3772c4.sessionProcessedCount + "/" + _0x3a9c53 + " 个视频，准备切换下一个...");
            _0x5db745("视频 " + _0x3772c4.sessionProcessedCount + "/" + _0x3a9c53 + " 已完成，正在切换下一个视频...");
            if (_0x2f6f41 === "specific") {
              console.log("[Built-in-Debug] [指定视频] 视频已完成，直接进入下一轮跳转下一个链接");
              const _0x2f628f = window._specificVideoUrls || [];
              _0x17375f();
              const _0x15901 = await _0x1e6668({
                reuseActive: false,
                advance: true
              });
              if (_0x15901) {
                const _0x4fd0df = _0xeebf5d(_0x15901);
                _0x3772c4.lastClickedId = _0x4fd0df;
                _0x86715c(_0x4fd0df);
                _0x2e92b3 = 0;
                _0x408a70 = "";
                console.log("[Built-in-Debug] [指定视频] 准备跳转领取目标: " + _0x15901);
                _0x5db745("正在打开指定视频…");
                window.location.href = _0x15901;
                await _0x4c0dfb(_0x356d6e);
              } else {
                console.log("[Built-in-Debug] [指定视频] 无剩余视频，任务结束");
                _0x5db745("指定视频列表已全部处理，任务结束");
                await _0x5a7f01(_0x356d6e, _0x2eb397, "specific_completed", {
                  configuredCount: (window._specificVideoUrls || _0x2f628f || []).length
                });
                return;
              }
              continue;
            }
            const _0x1d591a = await (async () => {
              try {
                _0x3a9536?.stop();
              } catch (_0x1dec54) {}
              _0x3a9536 = null;
              try {
                _0x487db2?.stop();
              } catch (_0x30976e) {}
              _0x487db2 = null;
              return _0x5b4c11(_0x356d6e, {
                videoTitle: _0x2488c3,
                leadVideoUrl: _0x20bfd3,
                dedupKey: _0x5c80ee,
                modal: _0x1d464e,
                phaseLabel: "导航",
                activeKeyword: _0x3ed3c4 || _0x13678b || "",
                sessionUrls: _0x25e80e,
                onSwitchOk: _0x1f6a18
              });
            })();
            if (_0x1d591a === "navigating") {
              return;
            }
            if (_0x1d591a === "done" || _0x1d591a === "continued") {
              continue;
            }
            try {
              _0x3a9536?.stop();
            } catch (_0x38c6bc) {}
            _0x3a9536 = null;
            try {
              _0x487db2?.stop();
            } catch (_0x1c9e21) {}
            _0x487db2 = null;
            const _0x1adca5 = _0x422e2f(_0x26e218() || _0x1d464e) || "";
            await _0x1d7124(_0x356d6e);
            const _0xd39179 = await _0x22855b(_0x356d6e, {
              previousIdentity: _0x1adca5,
              previousTitle: _0x2488c3,
              previousAuthor: _0xf6810d,
              leadVideoUrl: _0x20bfd3,
              dedupKey: _0x5c80ee,
              phaseLabel: "导航",
              preferredScope: _0x10966c || _0x1d464e
            });
            if (_0xd39179) {
              _0x1f6a18();
            } else {
              const _0x59c357 = await _0x4aefc9("导航");
              if (_0x59c357 === "refresh") {
                return;
              }
              if (_0x59c357 === "advance") {
                continue;
              }
            }
            await _0x2c2bd6(1500, 3000, _0x356d6e, "切换喘息", _0x10966c || _0x1d464e);
            continue;
          } finally {
            try {
              _0x3a9536?.stop();
            } catch (_0x57c20c) {}
            _0x3a9536 = null;
            try {
              _0x487db2?.stop();
            } catch (_0x5f01f0) {}
            _0x487db2 = null;
          }
        }
        if (_0x5097d4) {
          _0x5db745("推荐流未识别到播放器，切换下一条...");
          await _0x1d7124(_0x356d6e);
          await _0xb5c9d7(2000, 4000, _0x356d6e, "推荐流切换");
          continue;
        }
        if (_0x2f6f41 === "like") {
          if (_0x12f35c(_0x3772c4.currentTask)) {
            _0x4ddc49();
            const _0x60e3b4 = _0x19bd50(_0x3772c4.currentTask).has("author");
            const _0x310e9a = _0x15bf7b({
              ignoreNoWorksGuard: true
            });
            const _0xff03e = Array.isArray(window._likedVideoUrls) ? window._likedVideoUrls : [];
            let _0x5b1ee1 = 0;
            let _0x43c35d = null;
            if (_0x60e3b4 && _0x52622b().length < Math.min(8, _0xff03e.length || 8)) {
              _0x5db745("正在等待喜欢列表接口补齐作者主页...");
              window.scrollBy(0, 600);
              await _0x2770da(900);
              window.scrollBy(0, -200);
              await _0x2770da(600);
            }
            for (const _0x5422f7 of _0x52622b()) {
              if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
                break;
              }
              const _0x23d1df = await _0x29e4e6({
                videoUrl: _0x5422f7.videoUrl,
                title: _0x5422f7.title,
                authorNickname: _0x5422f7.authorNickname,
                authorUrl: _0x5422f7.authorUrl,
                source: "api_json",
                likedBoundaryUrls: _0xff03e.length ? _0xff03e : null
              });
              if (_0x23d1df.emitted) {
                _0x5b1ee1 += 1;
                if (_0x23d1df.videoUrl) {
                  if (!window._likedVideoUrls) {
                    window._likedVideoUrls = [];
                  }
                  if (!window._likedVideoUrls.includes(_0x23d1df.videoUrl) && !window._likedVideoUrls.some(_0x35bc09 => _0x55a954(_0x35bc09) === _0x55a954(_0x23d1df.videoUrl))) {
                    window._likedVideoUrls.push(_0x23d1df.videoUrl);
                  }
                }
              } else if (_0x60e3b4 && _0x23d1df.reason === "missing_author" && !_0x43c35d) {
                _0x43c35d = {
                  videoUrl: _0x5422f7.videoUrl,
                  title: _0x5422f7.title,
                  authorNickname: _0x5422f7.authorNickname
                };
              }
            }
            for (const _0xc6c667 of _0xff03e) {
              if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
                break;
              }
              const _0xca59a8 = _0x1ede8f(_0xc6c667);
              const _0x24e020 = await _0x29e4e6({
                videoUrl: _0xca59a8?.videoUrl || _0xc6c667,
                title: _0xca59a8?.title || "喜欢列表视频",
                authorNickname: _0xca59a8?.authorNickname || "",
                authorUrl: _0xca59a8?.authorUrl || "",
                source: _0xca59a8 ? "api_json" : "like_card",
                likedBoundaryUrls: _0xff03e
              });
              if (_0x24e020.emitted) {
                _0x5b1ee1 += 1;
              } else if (_0x60e3b4 && _0x24e020.reason === "missing_author") {
                const _0x3b0d39 = _0x310e9a.find(_0x5c9b59 => {
                  let _0x1bc895 = _0x5c9b59.href || _0x5c9b59.getAttribute?.("href") || "";
                  if (!_0x1bc895) {
                    const _0x56897f = _0x5c9b59.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]");
                    _0x1bc895 = _0x56897f?.href || _0x56897f?.getAttribute?.("href") || "";
                  }
                  const _0x183d7c = _0x55a954(_0x1bc895);
                  const _0xfb1459 = _0x55a954(_0xc6c667);
                  return _0x183d7c && _0xfb1459 && _0x183d7c === _0xfb1459;
                });
                if (!_0x43c35d || !_0x43c35d.clickTarget && _0x3b0d39) {
                  _0x43c35d = {
                    videoUrl: _0xca59a8?.videoUrl || _0xc6c667,
                    title: _0xca59a8?.title || "喜欢列表视频",
                    authorNickname: _0xca59a8?.authorNickname || "",
                    clickTarget: _0x3b0d39 || null
                  };
                }
              }
            }
            for (const _0x5ea190 of _0x310e9a) {
              if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
                break;
              }
              let _0x566f9d = _0x5ea190.href || _0x5ea190.getAttribute("href");
              if (!_0x566f9d) {
                const _0x12b2f5 = _0x5ea190.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
                if (_0x12b2f5) {
                  _0x566f9d = _0x12b2f5.href || _0x12b2f5.getAttribute("href");
                }
              }
              const _0x2be979 = _0x20f668(_0x566f9d || "");
              if (!_0x2be979) {
                continue;
              }
              if (_0xff03e.length && !_0xff03e.includes(_0x2be979) && !_0xff03e.some(_0x2353a4 => _0x55a954(_0x2353a4) === _0x55a954(_0x2be979))) {
                continue;
              }
              const _0x2f622a = _0x2afd48(_0x5ea190, _0x2be979);
              const _0x1eb99b = await _0x29e4e6({
                videoUrl: _0x2f622a.videoUrl || _0x2be979,
                title: _0x2f622a.title,
                authorNickname: _0x2f622a.authorNickname,
                authorUrl: _0x2f622a.authorUrl,
                source: _0x2f622a.fromApi ? "api_json" : "like_card",
                likedBoundaryUrls: _0xff03e.length ? _0xff03e : null
              });
              if (_0x1eb99b.emitted) {
                _0x5b1ee1 += 1;
              } else if (_0x60e3b4 && _0x1eb99b.reason === "missing_author" && _0x5ea190) {
                if (!_0x43c35d || !_0x43c35d.clickTarget) {
                  _0x43c35d = {
                    videoUrl: _0x2f622a.videoUrl || _0x2be979,
                    title: _0x2f622a.title,
                    authorNickname: _0x2f622a.authorNickname,
                    clickTarget: _0x5ea190
                  };
                }
              }
            }
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            if (_0x5b1ee1 > 0) {
              _0x772756 = 0;
              _0x5db745("喜欢列表已采集 " + _0x5b1ee1 + " 条（" + _0x3772c4.sessionProcessedCount + "/" + _0x3772c4.targetVideoCount + "）");
            } else {
              _0x772756 += 1;
              if (_0x60e3b4) {
                _0x5db745("喜欢列表暂未拿到作者主页，继续加载或补采…");
              }
            }
            if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
              continue;
            }
            if (_0x60e3b4 && _0x43c35d?.videoUrl) {
              _0x3772c4.lastClickedId = _0x43c35d.videoUrl;
              _0x86715c(_0x43c35d.videoUrl);
              _0x5db745("喜欢列表未识别到作者主页，打开视频补采：@" + (_0x43c35d.authorNickname || "未知作者"));
              _0x2cccad("👤 主页补采：打开《" + _0x5bcf18(_0x43c35d.title, 32) + "》获取作者主页");
              if (_0x43c35d.clickTarget) {
                await _0x562e04(_0x43c35d.clickTarget, _0x356d6e, "打开喜欢列表视频补采作者");
              } else {
                window.location.href = _0x43c35d.videoUrl;
              }
              _0x772756 = 0;
              await _0xb5c9d7(3500, 5500, _0x356d6e, "打开喜欢视频补采作者主页");
              continue;
            }
            const _0x2eeb1e = window._likedVideoUrls && window._likedVideoUrls.length > 0 && window._likedVideoUrls.every(_0x2ea608 => _0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x2ea608));
            const _0x2d41dc = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            if (_0x2eeb1e && _0x5b1ee1 === 0 && !window.__radar_like_link_reclaim_pass) {
              window.__radar_like_link_reclaim_pass = true;
              const _0x363874 = _0x59d5e1();
              for (const _0x3a7883 of _0xff03e) {
                if (typeof _0x363874.forgetProcessedVideoKey === "function") {
                  _0x363874.forgetProcessedVideoKey(_0x3772c4.processedVideos, _0x3a7883);
                } else {
                  _0x3772c4.processedVideos.delete(_0x3a7883);
                }
              }
              _0x5db745("检测到历史去重占坑，正在重新写入线索库…");
              _0x2cccad("♻️ 喜欢列表：已释放本批历史去重，重新入库（线索库删除后可重采）");
              _0x772756 = 0;
              continue;
            }
            if (_0x2eeb1e && _0x5b1ee1 === 0 || _0x772756 >= 8 || _0x2d41dc && _0x772756 >= 3 && _0x5b1ee1 === 0) {
              _0x5db745(_0x5b1ee1 > 0 ? "喜欢列表链接已直采完毕，正在结束任务..." : "喜欢列表没有新可入库视频（可能仍在历史已分析中），正在结束任务...");
              await _0x21bbb7(_0x356d6e, "like_list_completed", {}, {
                storageKey: _0x2eb397
              });
              return;
            }
            if (_0x2eeb1e && _0x5b1ee1 > 0) {
              _0x5db745("喜欢列表链接已直采完毕，正在结束任务...");
              await _0x21bbb7(_0x356d6e, "like_list_completed", {}, {
                storageKey: _0x2eb397
              });
              return;
            }
            _0x5db745("喜欢列表继续滚动加载（" + _0x772756 + "/8）…");
            window.scrollBy(0, 1000);
            await _0xb5c9d7(1800, 3200, _0x356d6e, "加载更多喜欢视频");
            continue;
          }
          const _0x4fd5b7 = _0x15bf7b({
            ignoreNoWorksGuard: true
          });
          console.log("[Built-in-Debug] [喜欢页] 扫描到 " + _0x4fd5b7.length + " 个潜在卡片");
          _0x5db745("喜欢页已定位到 " + _0x4fd5b7.length + " 个可见视频卡片，正在筛选未处理的喜欢视频...");
          let _0x53d21a = false;
          for (const _0x24153c of _0x4fd5b7) {
            let _0x45bc78 = _0x24153c.href || _0x24153c.getAttribute("href");
            if (!_0x45bc78) {
              const _0x503358 = _0x24153c.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
              if (_0x503358) {
                _0x45bc78 = _0x503358.href || _0x503358.getAttribute("href");
              }
            }
            const _0x599f7e = _0x20f668(_0x45bc78 || "");
            if (!_0x599f7e) {
              continue;
            }
            const _0x44703c = window._likedVideoUrls && window._likedVideoUrls.includes(_0x599f7e);
            if (_0x44703c && !_0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x599f7e) && _0x599f7e !== _0x3772c4.lastClickedId) {
              _0x3772c4.lastClickedId = _0x599f7e;
              _0x86715c(_0x599f7e);
              console.log("[Built-in-Debug] [喜欢页] 准备点击未处理的喜欢视频: " + _0x599f7e);
              _0x5db745("正在打开喜欢列表中的视频 (链接末尾: ..." + _0x599f7e.substring(_0x599f7e.length - 12) + ")");
              _0x2cccad("👆 轨迹详情：正在点击打开喜欢列表中的未处理视频: " + _0x599f7e);
              await _0x562e04(_0x24153c, _0x356d6e, "打开喜欢列表视频");
              _0x53d21a = true;
              await _0xb5c9d7(5000, 7000, _0x356d6e);
              break;
            }
          }
          if (_0x53d21a) {
            _0x772756 = 0;
          } else {
            _0x772756++;
            const _0x533e04 = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            const _0x20846a = window._likedVideoUrls && window._likedVideoUrls.every(_0x495466 => _0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x495466));
            if (_0x20846a || _0x772756 >= 6 || _0x533e04 && _0x772756 >= 3) {
              console.log("[Built-in-Debug] [喜欢页竭尽] 喜欢列表视频已全部处理完毕或已到底。");
              _0x5db745("喜欢列表的视频已全部处理，正在结束任务...");
              await _0x21bbb7(_0x356d6e, "like_list_completed", {}, {
                storageKey: _0x2eb397
              });
              return;
            }
            _0x5db745("未发现未处理的喜欢视频，正在向下滚动加载更多视频卡片 (" + _0x772756 + "/6)...");
            window.scrollBy(0, 1000);
            await _0xb5c9d7(3000, 5000, _0x356d6e);
          }
          continue;
        }
        if (_0x2f6f41 === "specific") {
          try {
            _0x32ad9c();
          } catch (_0x17bc36) {}
          const _0x5631ba = window._specificVideoUrls || [];
          const _0x1efac7 = await _0x1e6668({
            reuseActive: true
          });
          if (!_0x1efac7) {
            console.log("[Built-in-Debug] [指定视频] 所有指定视频已处理完毕，任务结束");
            _0x5db745("指定视频列表已全部处理，任务结束");
            await _0x5a7f01(_0x356d6e, _0x2eb397, "specific_completed", {
              configuredCount: (window._specificVideoUrls || _0x5631ba || []).length
            });
            return;
          }
          const _0x37b94f = window.location.href;
          const _0x4c6911 = _0x55a954(_0x1efac7);
          const _0x1cd8dd = _0xaaff23(_0x1efac7);
          const _0x52dd5c = _0x60a0c6(_0x4c6911);
          const _0x5d1e71 = Number(_0x52dd5c.loadStartedAt) || 0;
          const _0x1e3cb5 = _0x5d1e71 > 0 ? Date.now() - _0x5d1e71 : 0;
          if (_0x1cd8dd === "ready") {
            _0x170942 = 0;
            _0x8eb3ed = 0;
            _0x3e7784(_0x4c6911, {
              loadStartedAt: 0,
              probed: true,
              count: 0
            });
            _0x17c485 += 1;
            if (_0x17c485 <= 3) {
              _0x5db745(_0x17c485 === 1 ? "指定视频详情已出现，准备进入处理..." : "指定视频详情已出现，正在对齐处理入口… (" + _0x17c485 + "/3)");
              await _0xb5c9d7(500, 900, _0x356d6e, "指定视频详情就绪");
              continue;
            }
            _0x17c485 = 0;
            _0x2cccad("⚠️ 指定视频已判就绪但详情容器未识别，改走打开探测", null, "warning");
            _0x5db745("详情容器未识别，正在重新对齐指定视频…");
          } else {
            _0x17c485 = 0;
          }
          if (_0x1cd8dd === "unavailable" || _0x1cd8dd === "bare_jingxuan") {
            _0x5db745(_0x1cd8dd === "bare_jingxuan" ? "当前像精选空壳，先耐心等待详情弹窗…" : "检测到疑似失效提示，先确认是否真失效…");
          }
          _0x3772c4.lastClickedId = _0xeebf5d(_0x1efac7);
          _0x86715c(_0x3772c4.lastClickedId);
          const _0x11f8c3 = _0x5d1e71 > 0 && _0x1e3cb5 < _0x99997e && Number(_0x52dd5c.openAttempt) > 0 && (_0x544133(_0x37b94f, _0x1efac7) || _0x1cd8dd === "loading" || _0x1cd8dd === "waiting" || _0x1cd8dd === "bare_jingxuan" || _0x1cd8dd === "unavailable");
          if (_0x11f8c3) {
            const _0x11f6a2 = Math.max(3000, _0x99997e - _0x1e3cb5);
            const _0x574c94 = _0x1cd8dd === "loading" || _0x2a0fd9() ? "检测到「加载中」，等待页面加载完成" : "指定视频打开中，耐心等待";
            _0x5db745(_0x574c94 + "… (" + Math.floor(_0x1e3cb5 / 1000) + "s/" + Math.floor(_0x99997e / 1000) + "s，第 " + _0x52dd5c.openAttempt + "/" + _0x5aaef6 + " 次)");
            const _0x9f5012 = await _0x523c93(_0x356d6e, _0x1efac7, _0x11f6a2);
            if (_0x9f5012 === "aborted") {
              return;
            }
            if (_0x9f5012 === "ready") {
              _0x170942 = 0;
              _0x8eb3ed = 0;
              continue;
            }
            if (_0x9f5012 === "unavailable" || _0x9f5012 === "bare_jingxuan") {
              const _0x3224a6 = await _0x23880d(_0x356d6e, _0x2eb397, _0x1efac7, _0x5631ba, _0x9f5012 === "bare_jingxuan" ? "unavailable_bare_jingxuan" : "unavailable");
              if (_0x3224a6 === "done") {
                return;
              }
              continue;
            }
            if (Number(_0x52dd5c.openAttempt) < _0x5aaef6) {
              const _0x2639aa = _0x2a0fd9();
              _0x5db745(_0x2639aa ? "「加载中」超过 1 分钟，重新进入指定视频 (" + (Number(_0x52dd5c.openAttempt) + 1) + "/" + _0x5aaef6 + ")…" : "加载过慢，重新进入指定视频 (" + (Number(_0x52dd5c.openAttempt) + 1) + "/" + _0x5aaef6 + ")…");
              const _0x3ea9f1 = await _0x39a0ce(_0x356d6e, _0x1efac7);
              if (_0x3ea9f1 === "aborted") {
                return;
              }
              if (_0x3ea9f1 === "ready") {
                continue;
              }
              if (_0x3ea9f1 === "unavailable") {
                const _0x25ba09 = await _0x23880d(_0x356d6e, _0x2eb397, _0x1efac7, _0x5631ba, "unavailable_open");
                if (_0x25ba09 === "done") {
                  return;
                }
                continue;
              }
            }
            _0x5db745("精选打开多次超时，改用播放页再试一次…");
            const _0x9e2821 = await _0x161a99(_0x356d6e, _0x1efac7);
            if (_0x9e2821 === "aborted") {
              return;
            }
            if (_0x9e2821 === "ready") {
              continue;
            }
            const _0x2e4541 = await _0x23880d(_0x356d6e, _0x2eb397, _0x1efac7, _0x5631ba, _0x9e2821 === "unavailable" ? "unavailable_probe" : "load_timeout");
            if (_0x2e4541 === "done") {
              return;
            }
            continue;
          }
          const _0xbc5629 = await _0x39a0ce(_0x356d6e, _0x1efac7);
          if (_0xbc5629 === "aborted") {
            return;
          }
          if (_0xbc5629 === "ready") {
            _0x170942 = 0;
            _0x8eb3ed = 0;
            continue;
          }
          if (_0xbc5629 === "unavailable") {
            const _0x543acc = await _0x23880d(_0x356d6e, _0x2eb397, _0x1efac7, _0x5631ba, "unavailable_open");
            if (_0x543acc === "done") {
              return;
            }
            continue;
          }
          _0x5db745("精选打开多次超时，改用播放页再试一次…");
          const _0x1791ac = await _0x161a99(_0x356d6e, _0x1efac7);
          if (_0x1791ac === "aborted") {
            return;
          }
          if (_0x1791ac === "ready") {
            continue;
          }
          const _0x1a76c1 = await _0x23880d(_0x356d6e, _0x2eb397, _0x1efac7, _0x5631ba, _0x1791ac === "unavailable" ? "unavailable_probe" : "load_timeout");
          if (_0x1a76c1 === "done") {
            return;
          }
          continue;
        }
        if (_0x2f6f41 !== "search") {
          _0x5db745("当前入口暂未发现可处理视频，正在切换下一条内容...");
          await _0x1d7124(_0x356d6e);
          await _0x2c2bd6(2000, 4000, _0x356d6e, "入口切换", _0x1d464e || document);
          continue;
        }
        window._lastModalVisible = false;
        const {
          cardMap: _0x26dadb,
          allLinks: _0x520f2b,
          customCards: _0x39ca43
        } = _0x193fff();
        console.log("[Built-in-Debug] [搜索页] 解析出 " + _0x26dadb.size + " 个独特视频/图文链接");
        window._searchCardCount = _0x26dadb.size;
        if (_0x26dadb.size > 0) {
          _0xbf59b6(_0x356d6e, _0x13678b);
        }
        const _0x2fa486 = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
        const _0x3f1d11 = _0x2fa486.length > 0 && _0x4f94b7(_0x3772c4.currentTask);
        let _0x4f5c89 = _0x26dadb.size === 0 ? _0x189013({
          standardLinkCount: _0x520f2b.length,
          customCardCount: _0x39ca43.length
        }) : null;
        if (_0x4f5c89?.loginGate) {
          await _0x3318ad(_0x356d6e);
          continue;
        }
        if (_0x26dadb.size === 0 && !_0x4f5c89?.emptyResult) {
          const _0xbd8721 = _0x137eec(_0x356d6e, _0x13678b);
          if (!_0xbd8721.exhausted && _0xbd8721.scans === 0) {
            const _0x267117 = _0x18bf0b();
            const _0x357f91 = _0x526c7e();
            _0x5db745("搜索结果仍在加载，" + ("额外等待最多 " + Math.ceil(_0x267117 / 1000) + " 秒..."));
            _0x2cccad("🌐 搜索慢网保护：为关键词「" + _0x13678b + "」额外等待最多 " + (Math.ceil(_0x267117 / 1000) + " 秒（" + (_0x357f91 ? "代理" : "直连") + "，出现结果立即继续）"));
            const _0x37fcd9 = await _0x353f6e(_0x356d6e, _0x13678b);
            if (_0x37fcd9.aborted) {
              continue;
            }
            if (_0x37fcd9.ready) {
              console.log("[Built-in-Debug] [搜索慢网等待] 结果已恢复，耗时 " + ((_0x37fcd9.waitedMs || 0) + "ms"));
              _0x5db745("搜索结果已恢复，继续处理关键词「" + _0x13678b + "」...");
              _0x2cccad("✅ 搜索结果延迟加载后已恢复：等待 " + (((_0x37fcd9.waitedMs || 0) / 1000).toFixed(1) + " 秒"));
              continue;
            }
            if (_0x37fcd9.diagnostics) {
              _0x4f5c89 = _0x37fcd9.diagnostics;
            }
            if (_0x4f5c89?.loginGate) {
              await _0x3318ad(_0x356d6e);
              continue;
            }
          }
        }
        if (_0x26dadb.size === 0 && _0x4f5c89?.emptyResult) {
          const _0x5c09a8 = _0x137eec(_0x356d6e, _0x13678b);
          _0x5c09a8.emptyConfirmations += 1;
          _0x5c09a8.scans = 0;
          _0x5c09a8.exhausted = _0x5c09a8.emptyConfirmations >= 2;
          _0x109911(_0x356d6e, _0x13678b, _0x5c09a8);
          if (!_0x5c09a8.exhausted) {
            _0x5db745("搜索页提示暂无结果，保留关键词「" + _0x13678b + "」并再次确认...");
            _0x2cccad("⏳ 搜索空结果确认：保留「" + _0x13678b + "」，稍后复查 (1/2)", null, "warning");
            await _0xb5c9d7(_0x526c7e() ? 8000 : 3500, _0x526c7e() ? 12000 : 5500, _0x356d6e, "确认搜索空结果");
            continue;
          }
          _0x5db745("关键词「" + _0x13678b + "」已连续两次明确返回空结果，即将切换新词或结束任务...");
          _0x2cccad("ℹ️ 搜索词「" + _0x13678b + "」连续两次明确无结果，停止无效滚动", null, "warning");
          _0x3772c4.sessionProcessedCount = _0x3772c4.targetVideoCount;
          _0x772756 = 0;
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          continue;
        }
        if (_0x26dadb.size === 0) {
          const _0x7d6245 = _0x137eec(_0x356d6e, _0x13678b);
          _0x7d6245.emptyConfirmations = 0;
          _0x7d6245.scans += 1;
          if (!_0x7d6245.exhausted && _0x7d6245.scans < _0x5cb1f9) {
            _0x109911(_0x356d6e, _0x13678b, _0x7d6245);
            _0x5db745("搜索结果暂未渲染，保留关键词「" + _0x13678b + "」并等待重试 " + ("(" + _0x7d6245.scans + "/" + _0x5cb1f9 + ")..."));
            _0x2cccad("⏳ 搜索页暂时无作品 DOM：保留「" + _0x13678b + "」，原页等待恢复 " + ("(" + _0x7d6245.scans + "/" + _0x5cb1f9 + ")"), null, "warning");
            await _0xb5c9d7(1000, 1800, _0x356d6e, "等待搜索结果渲染");
            continue;
          }
          if (!_0x7d6245.exhausted && _0x7d6245.reloads < _0x124a42) {
            _0x7d6245.reloads += 1;
            _0x7d6245.scans = 0;
            _0x109911(_0x356d6e, _0x13678b, _0x7d6245);
            console.warn("[Built-in-Debug] [搜索页自愈] 结果 DOM 持续为空，刷新同一关键词 " + ("(" + _0x7d6245.reloads + "/" + _0x124a42 + "): " + _0x13678b));
            _0x5db745("搜索结果仍未渲染，正在刷新同一关键词「" + _0x13678b + "」 " + ("(" + _0x7d6245.reloads + "/" + _0x124a42 + ")..."));
            _0x2cccad("🔄 搜索页自愈：保留「" + _0x13678b + "」并刷新恢复 " + ("(" + _0x7d6245.reloads + "/" + _0x124a42 + ")"), null, "warning");
            _0x45b45e();
            _0x5beb43();
            _0x5dc92b(_0x356d6e, _0x13678b, "零卡片自愈刷新");
            _0x5e688b();
            const _0x20c53f = _0x5afb51(_0x13678b);
            const _0x30e693 = window.location.href.split(/[?#]/)[0];
            const _0x200951 = _0x20c53f.split(/[?#]/)[0];
            if (_0x30e693 === _0x200951) {
              window.location.reload();
            } else {
              window.location.href = _0x20c53f;
            }
            return;
          }
          _0x7d6245.exhausted = true;
          _0x109911(_0x356d6e, _0x13678b, _0x7d6245);
          _0x5db745("关键词「" + _0x13678b + "」刷新 " + _0x124a42 + " 次后仍无搜索结果，即将切换新词或结束任务...");
          _0x2cccad("⚠️ 搜索页自愈已达上限：保留词「" + _0x13678b + "」仍无作品 DOM，切换下一词以避免死循环", null, "warning");
          _0x3772c4.sessionProcessedCount = _0x3772c4.targetVideoCount;
          _0x772756 = 0;
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          continue;
        }
        _0x5db745("搜索页已定位到 " + _0x26dadb.size + " 个可见内容卡片，准备进行筛选分析...");
        const _0xd37b46 = _0x12f35c(_0x3772c4.currentTask);
        if (_0xd37b46) {
          _0x4ddc49();
          const _0x551643 = _0x19bd50(_0x3772c4.currentTask);
          const _0x52f693 = _0x551643.has("author");
          let _0x12737 = 0;
          let _0x4a9da4 = 0;
          let _0x2d56ae = null;
          if (_0x52f693) {
            for (let _0x28b529 = 0; _0x28b529 < 3; _0x28b529++) {
              let _0xfee9ee = 0;
              let _0x571612 = 0;
              for (const [_0x40dd89, _0x5acbce] of _0x26dadb.entries()) {
                if (_0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x40dd89)) {
                  continue;
                }
                _0x571612++;
                const _0x25ef04 = _0x5acbce?.card || _0x239e66(_0x5acbce?.clickTarget);
                const _0x14f77d = _0x2afd48(_0x25ef04, _0x40dd89);
                if (!_0x14f77d.authorUrl || !_0x14f77d.authorNickname) {
                  _0xfee9ee++;
                }
              }
              const _0x55c931 = _0x52622b().some(_0xadc080 => _0xadc080.authorUrl && _0xadc080.authorNickname);
              if (_0x571612 > 0 && _0xfee9ee === _0x571612 && !_0x55c931) {
                console.log("[Built-in-Debug] [React Warmup] " + _0xfee9ee + "/" + _0x571612 + " cards are missing author URLs on attempt " + (_0x28b529 + 1) + ". Waiting 400ms for React/API...");
                await _0x2770da(400);
                continue;
              }
              break;
            }
          }
          for (const _0x474d21 of _0x52622b()) {
            if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
              break;
            }
            const _0xd6d02e = await _0x29e4e6({
              videoUrl: _0x474d21.videoUrl,
              title: _0x474d21.title,
              authorNickname: _0x474d21.authorNickname,
              authorUrl: _0x474d21.authorUrl,
              source: "api_json"
            });
            if (_0xd6d02e.emitted) {
              _0x12737 += 1;
              _0x25e80e.add(_0xd6d02e.videoUrl);
            } else if (_0xd6d02e.reason === "exclude_title" || _0xd6d02e.reason === "include_title" || _0xd6d02e.reason === "exclude_author") {
              _0x4a9da4 += 1;
            } else if (_0x52f693 && _0xd6d02e.reason === "missing_author" && !_0x2d56ae) {
              _0x2d56ae = {
                videoUrl: _0x474d21.videoUrl,
                title: _0x474d21.title,
                authorNickname: _0x474d21.authorNickname,
                clickTarget: null
              };
            }
          }
          for (const [_0x52d12e, _0x554dbf] of _0x26dadb.entries()) {
            if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
              break;
            }
            if (_0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x52d12e)) {
              continue;
            }
            const _0x594ba2 = _0x554dbf?.card || _0x239e66(_0x554dbf?.clickTarget);
            const _0x1862aa = _0x2afd48(_0x594ba2, _0x52d12e);
            const _0x52f427 = await _0x29e4e6({
              videoUrl: _0x1862aa.videoUrl || _0x52d12e,
              title: _0x1862aa.title,
              authorNickname: _0x1862aa.authorNickname,
              authorUrl: _0x1862aa.authorUrl,
              source: _0x1862aa.fromApi ? "api_json" : "search_card"
            });
            if (_0x52f427.emitted) {
              _0x12737 += 1;
              _0x25e80e.add(_0x52f427.videoUrl);
              continue;
            }
            if (_0x52f427.reason === "exclude_title" || _0x52f427.reason === "include_title" || _0x52f427.reason === "exclude_author") {
              _0x4a9da4 += 1;
              continue;
            }
            if (_0x52f693 && _0x52f427.reason === "missing_author" && _0x554dbf?.clickTarget) {
              if (!_0x2d56ae || !_0x2d56ae.clickTarget) {
                _0x2d56ae = {
                  videoUrl: _0x1862aa.videoUrl || _0x52d12e,
                  title: _0x1862aa.title,
                  authorNickname: _0x1862aa.authorNickname,
                  clickTarget: _0x554dbf.clickTarget
                };
              }
            }
          }
          if (window._saveRadarState) {
            window._saveRadarState();
          }
          if (_0x12737 > 0) {
            _0x772756 = 0;
            _0x5db745("本屏已直采 " + _0x12737 + " 条" + (_0x4a9da4 ? "，过滤 " + _0x4a9da4 + " 条" : "") + "（" + _0x3772c4.sessionProcessedCount + "/" + _0x3772c4.targetVideoCount + "），未打开视频");
          } else {
            _0x772756 += 1;
          }
          if (_0x3772c4.sessionProcessedCount >= _0x3772c4.targetVideoCount) {
            continue;
          }
          if (_0x52f693 && _0x2d56ae?.videoUrl) {
            if (!_0x2d56ae.clickTarget) {
              for (const [_0xa21a0a, _0x2a6977] of _0x26dadb.entries()) {
                const _0x5574d3 = _0x55a954(_0xa21a0a);
                const _0x2610fb = _0x55a954(_0x2d56ae.videoUrl);
                if (_0x5574d3 && _0x2610fb && _0x5574d3 === _0x2610fb && _0x2a6977?.clickTarget) {
                  _0x2d56ae.clickTarget = _0x2a6977.clickTarget;
                  break;
                }
              }
            }
            _0x3772c4.lastClickedId = _0x2d56ae.videoUrl;
            _0x86715c(_0x2d56ae.videoUrl);
            _0x5db745("卡片未直接识别到作者主页，正在打开视频补采：@" + (_0x2d56ae.authorNickname || "未知作者"));
            _0x2cccad("👤 主页补采：打开《" + _0x5bcf18(_0x2d56ae.title, 32) + "》获取作者主页");
            if (_0x2d56ae.clickTarget) {
              await _0x257692(_0x2d56ae.clickTarget, _0x356d6e);
            } else {
              window.location.href = _0x2d56ae.videoUrl;
            }
            _0x772756 = 0;
            await _0xb5c9d7(3500, 5500, _0x356d6e, "打开视频补采作者主页");
            continue;
          }
          const _0xa89a2c = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
          const _0x4d0480 = _0x2dce82();
          const _0x22ad66 = _0x4d0480?.evaluateVideoSearchCollectionRound ? _0x4d0480.evaluateVideoSearchCollectionRound({
            previousEmptyRounds: _0x12737 > 0 ? 0 : Math.max(0, _0x772756 - 1),
            added: _0x12737,
            atBottom: _0xa89a2c,
            emptyLimit: 6,
            bottomEmptyLimit: 3
          }) : {
            emptyRounds: _0x772756,
            shouldStop: _0x772756 >= 6 || _0xa89a2c && _0x772756 >= 3
          };
          _0x772756 = _0x22ad66.emptyRounds;
          if (_0x22ad66.shouldStop) {
            _0x5db745("搜索结果已到底，即将切换新词或结束任务...");
            _0x3772c4.sessionProcessedCount = _0x3772c4.targetVideoCount;
            _0x772756 = 0;
            continue;
          }
          if (_0x4d0480?.performVideoSearchWindowScroll) {
            await _0x4d0480.performVideoSearchWindowScroll({
              scrollBy: _0x485c33 => window.scrollBy(0, _0x485c33),
              wait: _0x1ded26 => _0xb5c9d7(_0x1ded26, _0x1ded26, _0x356d6e, "加载更多搜索结果"),
              readApiCount: () => _0x52622b().length,
              readDomCount: () => _0x4c14ca().length,
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
            await _0xb5c9d7(1800, 3200, _0x356d6e, "加载更多搜索结果");
          }
          continue;
        }
        _0x3fa0e3();
        let _0x3dbab0 = false;
        let _0x47a324 = false;
        let _0xa34d72 = 0;
        if (_0x3f1d11) {
          const _0x231906 = _0x16362d();
          if (_0x231906 && !_0x57e00e(_0x231906, _0x25e80e)) {
            _0x5db745("正在恢复打开搜索队列待处理视频 (链接末尾: ..." + _0x231906.slice(-12) + ")");
            _0x2cccad("🔗 搜索队列恢复打开：…" + String(_0x231906).slice(-16));
            _0x5a748f(_0x231906);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            const _0x43dcad = await _0x41f46d(_0x356d6e, _0x231906, {
              allowHardNavigation: true,
              softWaitMs: 4000,
              hardWaitMs: 6500
            });
            if (_0x43dcad === "navigating") {
              _0x772756 = 0;
              return;
            }
            if (_0x43dcad === "ready") {
              const _0xd7a030 = !!_0x9566d9({
                includeFeed: false
              }) && _0x51db61();
              if (!_0xd7a030) {
                _0x2cccad("⚠️ 搜索队列恢复打开误报 ready，保留待处理并结束本轮：…" + String(_0x231906).slice(-16), null, "warning");
                _0x5a748f(_0x231906);
                if (window._saveRadarState) {
                  window._saveRadarState();
                }
                return;
              }
              _0x46d74f();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              _0x5832db(_0x231906);
              _0x3772c4.lastClickedId = _0x231906;
              _0x3dbab0 = true;
              _0x772756 = 0;
              continue;
            }
            _0x2cccad("⚠️ 搜索队列恢复打开失败，改硬跳待处理视频：…" + String(_0x231906).slice(-16), null, "warning");
            _0x5a748f(_0x231906);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            _0x5e688b();
            try {
              const _0x4fd86e = _0x55a954(_0x231906);
              const _0x1266b3 = new URL(window.location.href);
              if (_0x4fd86e) {
                _0x1266b3.searchParams.set("modal_id", _0x4fd86e);
              }
              window.location.href = _0x4fd86e ? _0x1266b3.toString() : _0x231906;
            } catch (_0x1e9b90) {
              const _0x43b1ca = _0x55a954(_0x231906);
              window.location.href = _0x43b1ca ? "https://www.douyin.com/jingxuan?modal_id=" + _0x43b1ca : _0x231906;
            }
            return;
          } else if (_0x231906 && _0x57e00e(_0x231906, _0x25e80e)) {
            _0x46d74f();
            if (window._saveRadarState) {
              window._saveRadarState();
            }
          }
        }
        const _0x5878a0 = (() => {
          if (!_0x3f1d11) {
            return Array.from(_0x26dadb.entries());
          }
          const _0x29fcc4 = new Map();
          for (const [_0x1d8ac7, _0x308c14] of _0x26dadb.entries()) {
            const _0x533ae7 = _0x55a954(_0x1d8ac7);
            if (_0x533ae7 && !_0x29fcc4.has(_0x533ae7)) {
              _0x29fcc4.set(_0x533ae7, {
                url: _0x1d8ac7,
                record: _0x308c14
              });
            }
          }
          return _0x2fa486.map(_0x269020 => {
            const _0x34bd97 = _0x55a954(_0x269020);
            const _0x40c466 = _0x34bd97 ? _0x29fcc4.get(_0x34bd97) : null;
            return [_0x269020, _0x40c466?.record || {
              clickTarget: null,
              card: null
            }];
          });
        })();
        for (const [_0x385f6c, _0xc92f9c] of _0x5878a0) {
          if (_0x57e00e(_0x385f6c, _0x25e80e) || _0x385f6c === _0x3772c4.lastClickedId) {
            continue;
          }
          if (_0x59d5e1().hasProcessedVideoKey(_0x3772c4.processedVideos, _0x385f6c)) {
            _0x317b17(_0x385f6c, _0x25e80e);
            continue;
          }
          if (_0x104e83(_0x385f6c)) {
            _0xa34d72 += 1;
            continue;
          }
          _0x3772c4.lastClickedId = _0x385f6c;
          _0x86715c(_0x385f6c);
          console.log("[Built-in-Debug] [搜索页] 准备点击未处理视频: " + _0x385f6c);
          _0x5db745("正在打开新视频卡片 (链接末尾: ..." + _0x385f6c.substring(_0x385f6c.length - 12) + ")");
          const _0x4b9a88 = _0xc92f9c?.clickTarget || _0xc92f9c?.card;
          const _0x2b010b = _0xc92f9c?.card || _0x239e66(_0x4b9a88);
          let _0x55daef = false;
          if (_0x4b9a88) {
            try {
              await _0x257692(_0x4b9a88, _0x356d6e);
            } catch (_0x5aeb1e) {
              const _0x2f078e = _0x3fae51(_0x385f6c, "click-error:" + (_0x5aeb1e?.message || _0x5aeb1e));
              console.warn("[Built-in-Debug] [搜索页] 卡片点击失败 (" + _0x2f078e + "/" + _0x3affdb + "): " + _0x385f6c, _0x5aeb1e);
              _0x45b45e();
              _0x3772c4.lastClickedId = null;
              continue;
            }
            _0x55daef = await _0x15b8ec(_0x356d6e, _0x385f6c, 4000);
            if (!_0x55daef && _0x4b9a88 !== _0x2b010b && _0x2b010b) {
              try {
                const _0x1cd151 = _0x18860f(_0x2b010b) || _0x2b010b;
                await _0x257692(_0x1cd151, _0x356d6e);
              } catch (_0x250f0d) {}
              _0x55daef = await _0x15b8ec(_0x356d6e, _0x385f6c, 3500);
            }
          }
          if (!_0x55daef) {
            const _0xbb0a6c = _0x55a954(_0x385f6c) || _0x5b4fbd(_0x385f6c);
            if (_0xbb0a6c && !_0x3c37ea(_0x356d6e)) {
              console.log("[Built-in-Debug] [搜索页] 点击未拉起弹窗，触发 modal_id 强打开兜底: " + _0xbb0a6c);
              _0x5db745("正在跳转打开视频详情 (modal_id=" + _0xbb0a6c + ")...");
              _0x5a748f(_0x385f6c);
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              _0x5e688b();
              try {
                const _0xac327f = new URL(window.location.href);
                _0xac327f.searchParams.set("modal_id", _0xbb0a6c);
                window.location.href = _0xac327f.toString();
              } catch (_0xf27a2c) {
                window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + _0xbb0a6c;
              }
              return;
            }
          }
          if (_0x55daef) {
            _0x5832db(_0x385f6c);
            _0x46d74f();
            _0x3dbab0 = true;
            break;
          }
          const _0x2d830e = _0x3fae51(_0x385f6c, "detail-timeout");
          console.warn("[Built-in-Debug] [搜索页] 卡片打开后未进入视频详情 (" + _0x2d830e + "/" + _0x3affdb + "): " + _0x385f6c);
          _0x5db745("当前搜索卡片未进入视频详情，尝试下一个结果 (" + _0x2d830e + "/" + _0x3affdb + ")...");
          if (_0x2d830e >= _0x3affdb) {
            _0x2cccad("⚠️ 搜索卡片连续打开失败，短期跳过该结果: " + _0x385f6c, null, "warning");
            _0x317b17(_0x385f6c, _0x25e80e);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
          }
          _0x45b45e();
          _0x3772c4.lastClickedId = null;
          await _0x339679(_0x356d6e);
          if (_0x3772c4.searchCardOpenFailureStreak >= _0x41ba1d) {
            _0x47a324 = true;
            await _0x7e3917(_0x356d6e, _0x13678b, "连续 " + _0x3772c4.searchCardOpenFailureStreak + " 次未进入视频详情");
            break;
          }
        }
        if (_0x47a324) {
          _0x772756 = 0;
          continue;
        }
        if (_0x3dbab0) {
          _0x772756 = 0;
        } else {
          if (_0x3f1d11) {
            const _0x560717 = _0x1d1d15({
              queue: _0x2fa486,
              processedSet: _0x3772c4.processedVideos,
              sessionUrls: _0x25e80e,
              excludeIds: [_0x3772c4.lastClickedId]
            });
            if (!_0x560717) {
              console.log("[Built-in-Debug] [搜索队列] 列表阶段无剩余链接，收尾本词");
              _0x5db745("搜索队列已全部处理，即将切换新词…");
              _0x46d74f();
              _0x3772c4.sessionProcessedCount = Math.max(_0x3772c4.sessionProcessedCount, _0x3772c4.targetVideoCount);
              _0x772756 = 0;
              continue;
            }
            _0x3772c4.lastClickedId = _0x560717;
            _0x86715c(_0x560717);
            _0x5a748f(_0x560717);
            if (window._saveRadarState) {
              window._saveRadarState();
            }
            _0x5db745("搜索队列按链接打开下一条…");
            _0x2cccad("🔗 搜索队列列表兜底打开：…" + String(_0x560717).slice(-16));
            const _0x3120a5 = await _0x41f46d(_0x356d6e, _0x560717, {
              allowHardNavigation: true,
              softWaitMs: 3500,
              hardWaitMs: 6500
            });
            _0x772756 = 0;
            if (_0x3120a5 === "ready") {
              _0x46d74f();
              if (window._saveRadarState) {
                window._saveRadarState();
              }
              continue;
            }
            if (_0x3120a5 === "navigating") {
              return;
            }
            return;
          }
          _0x772756++;
          const _0x14799c = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
          if (_0x772756 >= 6 || _0x14799c && _0x772756 >= 3) {
            console.log("[Built-in-Debug] [搜索页竭尽] 连续滚动 " + _0x772756 + " 次且触底，判定当前搜索结果已处理完毕。");
            _0x5db745("当前搜索结果已到底，即将切换新词或结束任务...");
            _0x3772c4.sessionProcessedCount = _0x3772c4.targetVideoCount;
            _0x772756 = 0;
            continue;
          }
          const _0x19bbe6 = _0xa34d72 > 0 ? "，已跳过 " + _0xa34d72 + " 个异常卡片" : "";
          _0x5db745("未发现符合要求的新内容" + _0x19bbe6 + "，正在向下滚动加载更多搜索结果 (" + _0x772756 + "/6)...");
          window.scrollBy(0, 1000);
          await _0xb5c9d7(3000, 5000, _0x356d6e);
        }
      } catch (_0x11f15e) {
        console.error("[Built-in-Debug] [抓取异常]", _0x11f15e);
        if (_0x3c37ea(_0x356d6e)) {
          continue;
        }
        const _0x3c171f = (_0x11f15e?.name || "Error") + ":" + (_0x11f15e?.message || String(_0x11f15e));
        const _0x265229 = Date.now();
        if (_0x3c171f === _0x2fa832 && _0x265229 - _0x1188bf < 15000) {
          _0x499bea += 1;
        } else {
          _0x2fa832 = _0x3c171f;
          _0x499bea = 1;
        }
        _0x1188bf = _0x265229;
        const _0x456c4a = Math.min(5000, 2 ** Math.min(3, _0x499bea - 1) * 750);
        _0x5db745("视频处理异常，" + Math.ceil(_0x456c4a / 1000) + " 秒后重试…");
        if (_0x499bea === 1 || _0x499bea % 5 === 0) {
          _0x2cccad("⚠️ 视频处理异常：" + _0x3c171f.slice(0, 160) + "（连续 " + _0x499bea + " 次）", null, "warning");
        }
        await _0x2770da(_0x456c4a);
      }
    }
    console.log("%c[任务结束] 所有视频入口队列及关键词已处理完毕！", "color: #fff; background: #22c55e; font-weight: bold; padding: 4px;");
    const _0x2a91e2 = _0x3772c4.stopRequested ? "manual_stop" : "loop_stopped";
    await _0x21bbb7(_0x356d6e, _0x2a91e2, {}, {
      storageKey: _0x3772c4.stopRequested ? _0x2eb397 : null,
      drainAiQueue: true
    });
  }
  return {
    startAutomation: _0xc55187
  };
}
module.exports = {
  createLeadgenAutomationController: createLeadgenAutomationController
};
const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction
} = require("./douyinVideoSideActions");
const {
  extractDouyinCommentCidFromNode
} = require("./douyinCommentCid");
const {
  isDouyinSecondaryCommentNode
} = require("./douyinCommentReplyGuard");
const {
  commentBodyForKeywordMatch
} = require("./entityCommentFilters");
function createCommentAutomationController(_0x151caf = {}) {
  const {
    ClipboardEvent: _0x31b77a,
    Infinity: _0x4e32e3,
    InputEvent: _0x31e73b,
    KeyboardEvent: _0x10b67e,
    MouseEvent: _0x253307,
    PLATFORM_SELECTORS: _0x3000dc,
    PointerEvent: _0x4b72e5,
    Uint8Array: _0x295be4,
    _migrateTouchCountsFromLegacy: _0x5274c2,
    _normalizeTouchLogEntries: _0x1dc3da,
    _syncTouchCountsFromLog: _0x29c236,
    allowEmptyCommentText: _0x3976ce,
    appendCommentMentionsAfterAttachments: _0x41468,
    appendRandomEmojiSuffix: _0x30a6e2,
    applyEntryMetaToLead: _0x5202ef,
    applyFollowUpActions: _0x15b9b4,
    applyRiskyEmojiReplaceForComment: _0x340bf0,
    atob: _0x3c316f,
    awaitInteractionCooldown: _0xb644a9,
    awaitPostActionRest: _0x5548c2,
    briefEl: _0x4ea7bb,
    describeDomControl: _0x3a1cc0,
    briefPanel: _0x3cddf4,
    buildAutomationAiPayload: _0x325f98,
    buildBlacklistEntry: _0x465282,
    buildLeadCommentFingerprint: _0x475ecc,
    buildLeadIdFromLead: _0x414c74,
    buildMainCommentAbortResult: _0x2081d8,
    buildNodeCommentFingerprint: _0x4ffd0d,
    buildTaskFinishedPayload: _0x3fcbee,
    burstPauseWithinOneSecond: _0x22b5fe,
    classifyCommentFailureToastLocal: _0x88a841,
    cleanTitle: _0x4dd1ca,
    clipTraceText: _0x4b67ce,
    closeAllModals: _0x19f9fe,
    collectDouyinCommentEmojiHints: _0x4ba9a3,
    commentDraftHasCoreTextLocal: _0x2fb956,
    commentNodeViewportBonus: _0x45f54f,
    composeCommentInputWithMentions: _0x99a69c,
    describeCommentLikeState: _0x29951c,
    describeMainCommentInputEnvironment: _0x2ef680,
    describeTaskAbortReason: _0x23c44e,
    dumpEmojiPanelTabCandidates: _0x270ab9,
    emitLeadInteractionUpdate: _0x4bb314,
    ensureCommentPanelOpen: _0x4e12db,
    ensureLeadgenScrapeApiHook: _0x59114f,
    evaluateLeadLocationFilter: _0x4b80a4,
    extractDouyinCommentContent: _0x261c36,
    extractSpecificVideoId: _0xef320c,
    extractUserIdFromUrl: _0x352c8c,
    extractUserKeyFromUrl: _0x9f54bd,
    extractVideoIdFromHref: _0x4ff88b,
    findCommentScrollContainer: _0x3db448,
    focusCurrentAutomationViewForComment: _0x222d23,
    focusWithoutScroll: _0x4b32e1,
    formatTaskLocationFilterSummary: _0x2232cc,
    getApplySearchFiltersModule: _0x1ad53e,
    getBoundSubviewInteractionId: _0x277753,
    getCommentPlaceholderText: _0x32431d,
    getCommentTabPrefix: _0x2799c7,
    getCommentV2String: _0x188fe3,
    getCommentV2List: _0x27f7fd,
    getCommentV2Number: _0x20c23d,
    getVideoEngagePack: _0x386e40,
    getCommentsTotalCount: _0x384ae3,
    getCurrentContentPauseProfile: _0x391363,
    getDouyinFeedScope: _0x524493,
    resolveDouyinVideoDetailModal: _0xa37be7,
    getDouyinVideoAuthorApi: _0x29c3bc,
    getExtendedReadyRounds: _0x2d0f13,
    getFeedVideoIdentity: _0x167b0d,
    getLeadAliasKeys: _0x3d7672,
    getLeadPrimaryKey: _0x572de1,
    getLocationFilterModule: _0xca3f48,
    getMyNickname: _0x20454e,
    getSearchApiReadyTracker: _0x58ba86,
    getSearchFilterSessionModule: _0x3d89f6,
    getVideoIdFromPageUrl: _0x49501c,
    getVideoStats: _0x587472,
    handleGlobalAutomationPopupsAndSecurity: _0x33703f,
    hasCommentLikeTakenEffect: _0x1001c9,
    hasCommentRuntimeReady: _0x4deec8,
    hasLocalReplyTemplates: _0x4c70a6,
    hasVideoCommentTemplates: _0x1b31ba,
    hasVideoMainCommented: _0x560b35,
    incrementInteractionCount: _0x499245,
    insertTextIntoEditable: _0x1922ce,
    installEntityFeedSwipeLock: _0x346bca,
    ipcRenderer: _0x21fac1,
    isAiInvokeCancelled: _0x37fdb0,
    isCommentAreaElement: _0x4245e6,
    isCommentDraftOnlyEmojiDriftLocal: _0x241c29,
    isCommentFromVideoAuthor: _0x31bdaa,
    isDouyinVideoShareUrl: _0x28ebb7,
    isElementInViewport: _0x5cf133,
    isElementInViewportForAutomation: _0x1b07bb,
    isEmojiTriggerCandidate: _0x14a009,
    isEntityLeadgenActive: _0x7b331f,
    isFatalAiAuthError: _0x80f474,
    isInteractionLimitReached: _0x40fdf8,
    isLeadInKnownPool: _0x268b05,
    isLeadInSession: _0x1ead3b,
    queryKnownLeadKeys: _0x215a79,
    isLinkOnlyScrapeTask: _0x339003,
    isMainCommentPlaceholderCandidate: _0x1aa282,
    isProfileCommentUiVisible: _0x29875e,
    isReplyBtnText: _0x15b8e6,
    isSameVideoTitleLoose: _0x59f6f4,
    isSubviewInteractionCancelled: _0x3a826d,
    isValidEmojiPickerPanel: _0x55cb35,
    isVideoLocalQuotaExhaustedReason: _0x41fd7f,
    isVisibleElement: _0x4f83d3,
    isWithinTimeLimit: _0x3fdd03,
    localStorage: _0x19863f,
    lockFeedLeadVideoUrl: _0x56c547,
    lookupLeadgenScrapeAweme: _0x295a83,
    markLeadInSession: _0x23b9f2,
    matchExcludedCommentKeyword: _0x8d0bab,
    matchesPlaceholderHint: _0x433ab2,
    mergeProfileInfoToLead: _0x2c958f,
    normalizeDouyinAuthorProfileUrl: _0x2dfcf2,
    normalizeDouyinCommentContent: _0x1b8d08,
    normalizeUrl: _0x309b45,
    normalizeUserUrl: _0x127bd3,
    noteVideoLocalQuotaExhaustedOnce: _0x18e1a4,
    openProfileVideoCommentPanel: _0x26f289,
    parseDouyinCommentNode: _0x16ab3c,
    pauseVisibleDouyinVideos: _0x1b218b,
    persistSubviewTaskForResume: _0x488dcd,
    pickLeadVideoUrl: _0x2ebcd8,
    pingInteractionActivity: _0x39f4d7,
    prefetchKeywordReplyContents: _0x11109b,
    prepareLeadsForAiAnalysis: _0x9ec67c,
    pushToScrapeAiQueue: _0x1a25c2,
    radarSessionKey: _0xe65d9e,
    randomDelay: _0x3310b6,
    readRadarSessionState: _0x1bdc03,
    recordLeadTouch: _0x13f9ba,
    rememberVideoMainComment: _0x3b2c24,
    removeEntityFeedSwipeLock: _0x204212,
    reopenEmojiPanelIfNeeded: _0x5efca9,
    replaceRiskyCommentEmojisLocal: _0x383d16,
    reportCommentFlowTrace: _0xe12db4,
    reportCurrentAction: _0x4f10ba,
    reportEmojiDebug: _0x42f542,
    reportMentionDebug: _0x18e724,
    reportProfileFirstTrace: _0x26b07b,
    reportTraceLog: _0x348fa4,
    resetScrapeAiQueueOnStop: _0x1e0bae,
    resolveActiveMentionPercent: _0x3bfb34,
    resolveCommentLikeControlInNode: _0x1586ba,
    resolveCommentMentionPosition: _0x16e341,
    resolveDouyinEmojiTabs: _0x5bfb03,
    resolveFollowUpFlags: _0x1e1cea,
    resolveInteractionSkipReason: _0x5d6c52,
    resolveProfileFirstGenderFilter: _0x733ad7,
    resolveTaskGenderFilter: _0x3f3074,
    resolveTaskLocationFilterRegions: _0x2b5274,
    rollMentionProbability: _0x1c83c8,
    safeScrollTargetIntoView: _0x5a444c,
    sampleVisibleCommentTexts: _0x2b3324,
    scoreCommentContentFingerprints: _0x2c66f1,
    scoreEmojiTabContainer: _0x237ec9,
    scoreMainCommentPlaceholderCandidate: _0x3a54f9,
    sessionStorage: _0x20c6e1,
    shouldAbort: _0x48fd75,
    shouldAbortProfileVideoDetailWait: _0x48b04d,
    shouldAppendCommentRandomSuffix: _0xf64af7,
    shouldAppendVideoCommentRandomSuffix: _0x9d7920,
    shouldUseAiCommentAnalysis: _0x1bf25d,
    shouldUseAiReplyGeneration: _0x4d23b8,
    shouldUseCommentKeywordFilter: _0x17574c,
    shouldUseCommentMentions: _0x44998c,
    shouldUseTextlessReplyPayload: _0x5857ab,
    simulateHumanClick: _0x576da8,
    simulateTrustedElementClick: _0x244deb,
    simulateTrustedEnter: _0x44d9ae,
    sleep: _0x1916f8,
    sleepWithinDeadline: _0x53508a,
    snapshotCommentLikeControlState: _0x57baca,
    snapshotComposerEmojiState: _0xb03b98,
    startCurrentVideoPauseGuard: _0x500d5d,
    taskLocationFilterEnabled: _0x476c13,
    toSpecificVideoDirectUrl: _0x4f9983,
    toSpecificVideoJingxuanUrl: _0x323bb2,
    waitForProfileVideoDetailScope: _0x1f5555,
    waitLeadgenScrapeAwemeAuthor: _0xc9870d,
    markBatchProfileCommentDone: _0x14655f,
    wasBatchProfileCommentDone: _0x4f6482,
    withBackgroundAutomationLayout: _0x2f7fef,
    state: _0x3dda76
  } = _0x151caf;
  if (!_0x3dda76) {
    throw new TypeError("createCommentAutomationController requires a runtime state bridge");
  }
  function _0x2bca37(_0x8763e3, _0xcb6a10) {
    const _0x51fa30 = typeof _0x188fe3 === "function" ? _0x188fe3(_0x8763e3) : "";
    return _0x51fa30 || _0xcb6a10;
  }
  function _0x2eb5c3(_0x170707, _0x373565) {
    const _0x45b26a = typeof _0x27f7fd === "function" ? _0x27f7fd(_0x170707) : [];
    if (_0x45b26a.length) {
      return _0x45b26a;
    } else {
      return _0x373565;
    }
  }
  function _0x8dcc04(_0x4ed498) {
    if (typeof _0x433ab2 === "function" && _0x433ab2(_0x4ed498)) {
      return true;
    }
    const _0x1e6fd6 = _0x2bca37("placeholderRegex", "");
    let _0x2c8ba5 = /说点什么|留下你的|留下.*评论|友善交流|发条评论|善语结善缘|写下.*评论/;
    if (_0x1e6fd6) {
      try {
        _0x2c8ba5 = new RegExp(_0x1e6fd6);
      } catch (_0x297158) {}
    }
    return _0x2c8ba5.test(String(_0x4ed498 || ""));
  }
  function _0x649ce(_0x3e5335) {
    const _0x5b14ce = typeof _0x188fe3 === "function" ? _0x188fe3(_0x3e5335) : "";
    if (!_0x5b14ce) {
      return null;
    }
    try {
      return new RegExp(_0x5b14ce, "i");
    } catch (_0xa4b533) {
      return null;
    }
  }
  function _0xd59899() {
    const _0x55e1b4 = ["emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector"];
    const _0x57ee89 = _0x55e1b4.filter(_0x3a45d2 => !_0x188fe3(_0x3a45d2));
    for (const _0x2e6d52 of ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"]) {
      const _0x4d3a28 = typeof _0x20c23d === "function" ? _0x20c23d(_0x2e6d52) : null;
      if (!(Number(_0x4d3a28) > 0)) {
        _0x57ee89.push(_0x2e6d52);
      }
    }
    return _0x57ee89;
  }
  function _0x2b0d08(_0x506c54 = null) {
    const _0x1e28c2 = _0x506c54 ? _0x2d2721(_0x506c54, {
      replyMode: false
    }) : null;
    const _0x3dd0f6 = _0xa9c741(_0x506c54, _0x1e28c2);
    const _0x1b370a = typeof _0x188fe3 === "function" ? _0x188fe3("emojiPanel") : "";
    if (_0x1b370a) {
      let _0x3e019b = [];
      try {
        _0x3e019b = Array.from(document.querySelectorAll(_0x1b370a)).filter(_0xb42dff => _0x55cb35(_0xb42dff, _0x3dd0f6));
      } catch (_0x56c22c) {
        _0x3e019b = [];
      }
      if (_0x3e019b.length) {
        if (_0x3dd0f6) {
          const _0x18eb9a = _0x3dd0f6.getBoundingClientRect();
          _0x3e019b.sort((_0x1d2874, _0x3344ee) => {
            const _0x3b0ecc = _0x1d2874.getBoundingClientRect();
            const _0x36c845 = _0x3344ee.getBoundingClientRect();
            const _0x82c30a = Math.min(Math.abs(_0x3b0ecc.bottom - _0x18eb9a.top), Math.abs(_0x3b0ecc.top - _0x18eb9a.bottom));
            const _0x1a70ff = Math.min(Math.abs(_0x36c845.bottom - _0x18eb9a.top), Math.abs(_0x36c845.top - _0x18eb9a.bottom));
            return _0x82c30a - _0x1a70ff;
          });
        }
        return _0x3e019b[0];
      }
    }
    return null;
  }
  function _0x47fd73(_0x2f08b6 = null) {
    try {
      const _0x5aa21f = _0x2f08b6 || document;
      const _0x5d7366 = _0x5aa21f.matches?.("[data-e2e=\"feed-active-video\"]") ? _0x5aa21f.querySelector("[data-e2e=\"video-desc\"]") : _0x5aa21f.querySelector?.("[data-e2e=\"feed-active-video\"] [data-e2e=\"video-desc\"]");
      if (_0x5d7366?.innerText?.trim()) {
        return _0x4dd1ca(_0x5d7366.innerText);
      }
      const _0x5a7ae7 = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", ".video-info-detail .title", ".video-info-container .title", "[class*=\"note-detail\"] [class*=\"title\"]", "[class*=\"NoteDetail\"] [class*=\"title\"]", "[class*=\"note-detail\"] [class*=\"desc\"]", "[class*=\"NoteDetail\"] [class*=\"desc\"]", "h1.title", ".account-card-container .title", ".desc"];
      let _0x593088 = [];
      for (const _0x31e1ca of _0x5a7ae7) {
        const _0x3002d8 = _0x5aa21f.querySelectorAll?.(_0x31e1ca) || [];
        _0x3002d8.forEach(_0x504ce3 => {
          if (_0x504ce3 && _0x504ce3.innerText && _0x504ce3.innerText.trim().length > 1) {
            _0x593088.push(_0x504ce3);
          }
        });
      }
      if (_0x593088.length === 0) {
        if (_0x2f08b6) {
          return "未知视频";
        }
        const _0x1a135b = document.querySelector("meta[property=\"og:title\"]")?.content || document.querySelector("meta[property=\"og:description\"]")?.content || document.querySelector("meta[name=\"description\"]")?.content;
        if (_0x1a135b && _0x4dd1ca(_0x1a135b) !== "未知视频") {
          return _0x4dd1ca(_0x1a135b).slice(0, 100);
        }
        return _0x4dd1ca(document.title);
      }
      let _0x2c8b6e = null;
      let _0x8eeb7d = _0x4e32e3;
      const _0x23f491 = window.innerHeight / 2;
      const _0x429180 = window.innerWidth / 2;
      _0x593088.forEach(_0x4e1149 => {
        const _0xd3d954 = _0x4e1149.getBoundingClientRect();
        if (_0xd3d954.height > 0 && _0xd3d954.width > 0) {
          const _0x570a5b = _0xd3d954.top + _0xd3d954.height / 2;
          const _0x2e4346 = _0xd3d954.left + _0xd3d954.width / 2;
          const _0x5622f2 = Math.sqrt(Math.pow(_0x570a5b - _0x23f491, 2) + Math.pow(_0x2e4346 - _0x429180, 2));
          if (_0x5622f2 < _0x8eeb7d) {
            _0x8eeb7d = _0x5622f2;
            _0x2c8b6e = _0x4e1149;
          }
        }
      });
      if (_0x2c8b6e) {
        const _0x269214 = _0x4dd1ca(_0x2c8b6e.innerText).substring(0, 100);
        return _0x269214 || _0x4dd1ca(document.title);
      }
      if (_0x2f08b6) {
        return "未知视频";
      }
      const _0x67f4d = document.querySelector("meta[property=\"og:title\"]")?.content || document.querySelector("meta[property=\"og:description\"]")?.content || document.querySelector("meta[name=\"description\"]")?.content;
      if (_0x67f4d && _0x4dd1ca(_0x67f4d) !== "未知视频") {
        return _0x4dd1ca(_0x67f4d).slice(0, 100);
      }
      return _0x4dd1ca(document.title);
    } catch (_0x13c3c1) {
      return "未知视频";
    }
  }
  function _0x59d57c(_0x46ab84) {
    return _0x29c3bc().normalizeAuthorAccountName(_0x46ab84);
  }
  function _0x357569(_0x39970b) {
    return _0x29c3bc().parseExcludeAuthorAccounts(_0x39970b);
  }
  function _0x4288b6(_0x40ad86, _0x597e08 = []) {
    return _0x29c3bc().matchExcludedVideoAuthor(_0x40ad86, _0x597e08);
  }
  function _0x4913aa(_0x1f9583 = null, _0x21dfa5 = "") {
    return _0x29c3bc().getVideoAuthorNickname(_0x1f9583, _0x21dfa5);
  }
  function _0x11ac20(_0x18cf95 = null, _0x47dbe0 = "") {
    return _0x29c3bc().getVideoAuthorProfileUrl(_0x18cf95, _0x47dbe0);
  }
  function _0x3601c3(_0x516331 = null, _0x3a6835 = "") {
    return _0x29c3bc().getVideoAuthorInfo(_0x516331, _0x3a6835);
  }
  function _0x4ae10a(_0xc9607d, _0x50cb32 = "") {
    const _0x137704 = _0xc9607d || _0x524493() || document;
    const _0x5a4e21 = _0x47fd73(_0x137704);
    const _0x2a4202 = _0x3601c3(_0x137704, _0x50cb32);
    let _0x41f748 = _0x2a4202.profileUrl || "";
    let _0x1b1eb6 = _0x2a4202.nickname || "";
    let _0x10a928 = _0x5a4e21;
    const _0x3bb73d = _0xef320c(_0x50cb32) || _0xef320c(window.location.href);
    const _0x17d262 = String(_0x3dda76.currentRunningSource || "");
    const _0x291839 = _0x7b331f();
    const _0x116ecd = !!_0x3bb73d && (!!_0x339003(_0x3dda76.currentTask) || _0x17d262 === "search" || _0x17d262 === "recommend" || _0x17d262 === "follow" || !!_0x291839);
    let _0x364e21 = false;
    if (_0x116ecd) {
      try {
        _0x59114f({
          force: true
        });
      } catch (_0x11385f) {}
      const _0x463345 = _0x295a83(_0x50cb32 || window.location.href);
      if (_0x463345 && String(_0x463345.videoId) === String(_0x3bb73d)) {
        _0x364e21 = !!_0x463345.authorUrl || !!_0x463345.authorNickname || !!_0x463345.title;
        if (_0x463345.authorUrl) {
          _0x41f748 = _0x463345.authorUrl;
        }
        if (_0x463345.authorNickname) {
          _0x1b1eb6 = _0x463345.authorNickname;
        }
        if (_0x463345.title && (!_0x10a928 || _0x10a928 === "未知视频")) {
          _0x10a928 = _0x463345.title;
        }
      }
    }
    return {
      title: _0x10a928,
      authorNickname: _0x1b1eb6,
      authorUrl: _0x41f748,
      stats: _0x587472(_0x137704),
      scope: _0x137704,
      fromApi: _0x364e21
    };
  }
  async function _0x4fe30b(_0x4b3265, _0x59ca79 = "", _0x34a251 = _0x3dda76.activeLoopId, _0x49c175 = {}) {
    const _0x14c0f3 = _0x49c175.requireAuthor !== false;
    const _0x490d58 = _0x49c175.requireAuthorUrl === true;
    const _0x614d84 = Math.max(800, Number(_0x49c175.maxWaitMs) || 2800);
    const _0x535862 = Date.now();
    _0x1b218b(_0x4b3265 || document, "作者识别等待前锁定暂停");
    try {
      _0x59114f({
        force: true
      });
    } catch (_0x3173c4) {}
    const _0x8b5edf = _0xef320c(_0x59ca79) || _0xef320c(window.location.href);
    if (_0x8b5edf && _0x14c0f3) {
      const _0x38b4fb = _0x490d58 ? Math.min(Math.max(2200, _0x614d84 - 200), _0x614d84) : Math.min(1600, _0x614d84);
      const _0x395051 = await _0xc9870d(_0x59ca79 || _0x8b5edf, _0x38b4fb);
      if (_0x395051?.authorUrl || !_0x490d58 && _0x395051?.authorNickname) {
        _0x1b218b(_0x4b3265 || document, "API 作者已就绪，锁定暂停");
        const _0x583720 = _0x4ae10a(_0x4b3265, _0x59ca79);
        if (_0x395051.authorUrl) {
          _0x583720.authorUrl = _0x395051.authorUrl;
        }
        if (_0x395051.authorNickname) {
          _0x583720.authorNickname = _0x395051.authorNickname;
        }
        if (_0x395051.title && (!_0x583720.title || _0x583720.title === "未知视频")) {
          _0x583720.title = _0x395051.title;
        }
        if (_0x583720.authorUrl || !_0x490d58 && _0x583720.authorNickname) {
          _0x583720.fromApi = true;
          return _0x583720;
        }
      }
    }
    let _0x2f14d0 = _0x4ae10a(_0x4b3265, _0x59ca79);
    const _0x395107 = _0x2f14d0.title || "";
    let _0x29de4c = 1;
    while (Date.now() - _0x535862 < _0x614d84) {
      const _0x13cc44 = !!_0x2f14d0.title && _0x2f14d0.title !== "未知视频";
      const _0x1dfca = !!_0x2f14d0.authorUrl && !!_0x2f14d0.authorNickname;
      const _0x2aff31 = !!_0x2f14d0.authorNickname || !!_0x2f14d0.authorUrl;
      const _0x2939e4 = !!_0x2dfcf2(_0x2f14d0.authorUrl || "");
      const _0x477d04 = !_0x395107 || _0x395107 === "未知视频" || _0x59f6f4(_0x395107, _0x2f14d0.title);
      const _0x19aca1 = _0x490d58 ? _0x2939e4 : _0x1dfca || _0x2aff31;
      if (_0x13cc44 && _0x477d04 && (!_0x14c0f3 || _0x19aca1)) {
        return _0x2f14d0;
      }
      if (_0x48fd75(_0x34a251)) {
        break;
      }
      if (_0x29de4c === 1) {
        _0x4f10ba("作者主页尚未就绪，短暂等待后重试识别...");
      }
      _0x1b218b(_0x4b3265 || document);
      await _0x1916f8(350);
      const _0x3a8954 = _0x524493() || _0x4b3265;
      _0x1b218b(_0x3a8954 || _0x4b3265 || document);
      _0x2f14d0 = _0x4ae10a(_0x3a8954, _0x59ca79);
      if (_0x395107 && _0x2f14d0.title && _0x2f14d0.title !== "未知视频" && !_0x59f6f4(_0x395107, _0x2f14d0.title)) {
        console.warn("[Built-in-Debug] [作者对齐] 等待作者期间标题已切换，放弃本条作者补采以免错配下一条");
        return {
          ..._0x2f14d0,
          title: _0x395107,
          authorNickname: "",
          authorUrl: ""
        };
      }
      _0x29de4c += 1;
    }
    return {
      ..._0x2f14d0,
      title: _0x395107 || _0x2f14d0.title
    };
  }
  async function _0x2378d4(_0x1da541, _0x513507, {
    isFeedPlayback = false,
    previousAuthor = "",
    previousVideoId = "",
    settleMs = 1000,
    maxWaitMs = 2200,
    requireAuthor = true,
    skipBurstPause = false
  } = {}) {
    const _0x46ac63 = _0x1da541 || _0x524493() || document;
    _0x1b218b(_0x46ac63, "进入视频：识别元数据前先暂停");
    if (isFeedPlayback) {
      try {
        _0x56c547(_0x46ac63);
      } catch (_0x2c8320) {}
    }
    if (!skipBurstPause) {
      await _0x22b5fe(_0x46ac63, _0x513507, {
        budgetMs: Math.min(1000, Math.max(700, Number(settleMs) || 1000)),
        tickMs: 50,
        reason: "进入视频 1 秒内强制暂停"
      });
    } else {
      for (let _0x4e80d5 = 0; _0x4e80d5 < 4; _0x4e80d5 += 1) {
        if (_0x48fd75(_0x513507)) {
          throw new Error("TASK_ABORTED");
        }
        _0x1b218b(_0x46ac63);
        await _0x1916f8(50);
      }
    }
    let _0x40d252 = "";
    let _0x84665c = "";
    if (isFeedPlayback) {
      const _0xe2be62 = _0x3dda76.lockedFeedIdentity || _0x167b0d(_0x46ac63) || "";
      _0x40d252 = _0xe2be62;
      _0x84665c = _0x2ebcd8(_0x3dda76.lockedLeadVideoUrl || _0xe2be62, _0x46ac63);
    } else {
      _0x40d252 = _0x309b45(window.location.href);
      _0x84665c = _0x2ebcd8(_0x40d252, _0x46ac63);
    }
    const _0x5ba264 = _0x28ebb7(_0x84665c) ? _0x84665c : _0x40d252;
    const _0x16f639 = _0x84665c || _0x5ba264 || _0x40d252;
    _0x1b218b(_0x46ac63, "暂停已稳定，开始识别作者/标题");
    let _0x17c64b = await _0x4fe30b(_0x46ac63, _0x16f639, _0x513507, {
      requireAuthor: requireAuthor,
      maxWaitMs: maxWaitMs
    });
    const _0x91b41f = _0xef320c(_0x16f639) || _0xef320c(_0x40d252) || "";
    const _0x5128a6 = _0x59d57c(previousAuthor || "");
    const _0x3239a2 = String(_0x17c64b.authorNickname || "").trim();
    const _0x5f2859 = !!_0x91b41f && !!previousVideoId && String(_0x91b41f) !== String(previousVideoId) && !!_0x3239a2 && !!_0x5128a6 && _0x59d57c(_0x3239a2) === _0x5128a6;
    if (_0x5f2859) {
      console.warn("[Built-in-Debug] [作者对齐] 暂停后作者仍像上一条「" + _0x3239a2 + "」，再停再采");
      _0x4f10ba("作者疑似上一条残留，暂停后重新识别…");
      _0x1b218b(_0x46ac63, "作者残留：再次暂停后重采");
      await _0x1916f8(600);
      _0x1b218b(_0x46ac63);
      if (!isFeedPlayback) {
        _0x40d252 = _0x309b45(window.location.href);
        _0x84665c = _0x2ebcd8(_0x40d252, _0x46ac63);
      } else {
        try {
          _0x56c547(_0x46ac63);
        } catch (_0x126982) {}
        _0x84665c = _0x2ebcd8(_0x3dda76.lockedLeadVideoUrl || _0x167b0d(_0x46ac63) || "", _0x46ac63);
      }
      const _0x322ecb = _0x84665c || _0x16f639;
      const _0x1ab143 = await _0xc9870d(_0x322ecb, 1200);
      _0x17c64b = _0x4ae10a(_0x46ac63, _0x322ecb);
      if (_0x1ab143 && String(_0x1ab143.videoId) === String(_0xef320c(_0x322ecb) || "")) {
        if (_0x1ab143.authorNickname) {
          _0x17c64b.authorNickname = _0x1ab143.authorNickname;
        }
        if (_0x1ab143.authorUrl) {
          _0x17c64b.authorUrl = _0x1ab143.authorUrl;
        }
        if (_0x1ab143.title && (!_0x17c64b.title || _0x17c64b.title === "未知视频")) {
          _0x17c64b.title = _0x1ab143.title;
        }
        _0x17c64b.fromApi = true;
      }
      const _0x273230 = String(_0x17c64b.authorNickname || "").trim();
      if (_0x273230 && _0x5128a6 && _0x59d57c(_0x273230) === _0x5128a6 && !_0x17c64b.fromApi) {
        console.warn("[Built-in-Debug] [作者对齐] 重采仍同上一条且非 API，清空昵称防错配");
        _0x17c64b = {
          ..._0x17c64b,
          authorNickname: "",
          authorUrl: ""
        };
      }
    }
    const _0x2a4df3 = _0x84665c || _0x16f639;
    return {
      meta: _0x17c64b,
      leadVideoUrl: _0x2a4df3,
      url: _0x40d252 || _0x2a4df3,
      dedupKey: _0x28ebb7(_0x2a4df3) ? _0x2a4df3 : _0x40d252 || _0x2a4df3
    };
  }
  function _0xdd5660() {
    return _0x188fe3("commentPanel");
  }
  function _0x5e81b5() {
    return _0x2eb5c3("publishBtnTexts", ["发布", "发送", "发表", "回复"]);
  }
  function _0x72301b() {
    return _0x5e7a6a(_0x188fe3("commentItem"), _0x188fe3("commentItemLoose"));
  }
  function _0x50787b() {
    return _0x188fe3("commentItemLoose");
  }
  function _0x5e7a6a(..._0x695cb1) {
    const _0x2c5e89 = [];
    const _0x104938 = new Set();
    for (const _0x60f5f9 of _0x695cb1) {
      for (const _0x353893 of String(_0x60f5f9 || "").split(",")) {
        const _0x3c70e1 = _0x353893.trim();
        if (!_0x3c70e1 || _0x104938.has(_0x3c70e1)) {
          continue;
        }
        _0x104938.add(_0x3c70e1);
        _0x2c5e89.push(_0x3c70e1);
      }
    }
    return _0x2c5e89.join(", ");
  }
  function _0x533f8e() {
    return _0x5e7a6a(_0x188fe3("commentInputMain"), _0x188fe3("commentInput"));
  }
  function _0x55ae65() {
    return _0x188fe3("draftEditor");
  }
  function _0x417841() {
    return _0x5e7a6a(_0x188fe3("commentInputShell"), _0x188fe3("commentInputShellLoose"));
  }
  function _0x5a86cc(_0x423f9c) {
    const _0x3a660e = _0x423f9c || document;
    if (!_0x3a660e?.querySelectorAll) {
      return [];
    }
    const _0x12f838 = _0x72301b();
    let _0x590aad = [];
    if (_0x12f838) {
      try {
        _0x590aad = Array.from(_0x3a660e.querySelectorAll(_0x12f838));
      } catch (_0x521023) {
        _0x590aad = [];
      }
    }
    if (_0x590aad.length) {
      return _0x590aad;
    }
    const _0x52e1f6 = _0x50787b();
    if (_0x52e1f6 && _0x52e1f6 !== _0x12f838) {
      try {
        _0x590aad = Array.from(_0x3a660e.querySelectorAll(_0x52e1f6));
      } catch (_0x2f42e5) {
        _0x590aad = [];
      }
    }
    return _0x590aad;
  }
  function _0xa8cd67(_0x198e20) {
    if (!_0x198e20?.querySelectorAll) {
      return false;
    }
    try {
      const _0x439cda = Array.from(_0x198e20.querySelectorAll("span, div, label, em, i, strong"));
      for (const _0x5f5bf1 of _0x439cda) {
        if (!_0xaf1664(_0x5f5bf1, _0x198e20)) {
          continue;
        }
        if ((_0x5f5bf1.children?.length || 0) > 1) {
          continue;
        }
        const _0x4407a7 = String(_0x5f5bf1.innerText || _0x5f5bf1.textContent || "").replace(/\s+/g, " ").trim();
        if (_0x4407a7 === "作者") {
          return true;
        }
      }
    } catch (_0x3d61d6) {}
    return false;
  }
  function _0xaf1664(_0xb703a2, _0xbf599d) {
    if (!_0xb703a2 || !_0xbf599d || typeof _0xbf599d.contains !== "function") {
      return false;
    }
    if (!_0xbf599d.contains(_0xb703a2)) {
      return false;
    }
    const _0x2bbe25 = _0xb703a2.closest?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"], [class*=\"sub-comment-item\"], [class*=\"SubCommentItem\"]");
    if (!_0x2bbe25) {
      return true;
    }
    return _0x2bbe25 === _0xbf599d;
  }
  function _0x44890c(_0x1a5f79, _0x8035d7 = null) {
    if (!_0x1a5f79) {
      return "无节点";
    }
    const _0x3b807d = String(_0x1a5f79.getAttribute?.("data-e2e") || "").trim() || "无e2e";
    const _0x40e1b1 = isDouyinSecondaryCommentNode(_0x1a5f79);
    const _0x2af907 = _0xa8cd67(_0x1a5f79);
    const _0x245de4 = String(_0x8035d7?.nickname || "").trim();
    return (_0x245de4 ? "@" + _0x245de4 + " " : "") + "e2e=" + _0x3b807d + " 二级=" + (_0x40e1b1 ? "是" : "否") + " 作者角标=" + (_0x2af907 ? "是" : "否");
  }
  function _0x125206(_0x30761c = document) {
    const _0x1fb212 = _0xdd5660();
    if (!_0x1fb212) {
      return null;
    }
    const _0xc4fea = [];
    if (_0x30761c?.querySelectorAll) {
      _0xc4fea.push(_0x30761c);
    }
    if (_0x30761c !== document) {
      _0xc4fea.push(document);
    }
    const _0xf5f91b = [];
    const _0x456a90 = new Set();
    const _0x53c174 = _0x2bca37("commentPanel", ".comment-mainContent, [data-e2e=\"comment-list\"], [class*=\"CommentList\"], [class*=\"comment-list\"]");
    const _0x533a2b = _0x5e7a6a(_0x533f8e(), _0x417841(), _0x55ae65());
    for (let _0x28467d = 0; _0x28467d < _0xc4fea.length; _0x28467d += 1) {
      const _0x154324 = _0xc4fea[_0x28467d];
      let _0x3e9dd2 = [];
      try {
        if (_0x154324.matches?.(_0x1fb212)) {
          _0x3e9dd2.push(_0x154324);
        }
        _0x3e9dd2.push(...Array.from(_0x154324.querySelectorAll(_0x1fb212)));
      } catch (_0x5e9870) {
        continue;
      }
      for (const _0x2ae908 of _0x3e9dd2) {
        if (!_0x2ae908 || _0x456a90.has(_0x2ae908) || !_0x4f83d3(_0x2ae908)) {
          continue;
        }
        _0x456a90.add(_0x2ae908);
        let _0x530480 = false;
        let _0x4d09c8 = 0;
        let _0x115d4d = false;
        try {
          _0x530480 = _0x2ae908.matches(_0x53c174);
        } catch (_0x2e89ec) {}
        try {
          _0x4d09c8 = _0x5a86cc(_0x2ae908).filter(_0x4f83d3).length;
        } catch (_0xca7a0a) {}
        try {
          const _0x130038 = _0x533a2b ? _0x2ae908.querySelector(_0x533a2b) : null;
          _0x115d4d = !!_0x130038 && !!_0x4f83d3(_0x130038) || !!_0x1aa282(_0x2ae908, {
            requireViewport: false,
            profileVideo: false
          });
        } catch (_0x477d6b) {}
        if (!_0x530480 && _0x4d09c8 === 0 && !_0x115d4d) {
          continue;
        }
        const _0xec4cec = _0x2ae908.getBoundingClientRect();
        const _0x577339 = _0x30761c && _0x30761c !== document && (_0x2ae908 === _0x30761c || _0x30761c.contains?.(_0x2ae908));
        const _0x1db536 = (_0x577339 ? 1000 : 0) + (_0x28467d === 0 ? 200 : 0) + (_0x530480 ? 120 : 0) + (_0x115d4d ? 160 : 0) + Math.min(_0x4d09c8, 40) * 8 + Math.min(_0xec4cec.width * _0xec4cec.height / 10000, 80);
        _0xf5f91b.push({
          el: _0x2ae908,
          score: _0x1db536
        });
      }
    }
    _0xf5f91b.sort((_0xe48bcd, _0x5e0f8e) => _0x5e0f8e.score - _0xe48bcd.score);
    return _0xf5f91b[0]?.el || null;
  }
  function _0x5f0053(_0x19e9d6) {
    return _0x125206(_0x19e9d6) || _0x19e9d6 || document.body;
  }
  function _0x4c51c6(_0x4f57fd, _0x53d700, _0x43d131 = {}) {
    if (!_0x4f57fd || !_0x53d700) {
      return -1;
    }
    if (isDouyinSecondaryCommentNode(_0x4f57fd) || _0xa8cd67(_0x4f57fd)) {
      return -1;
    }
    const _0x8041f6 = !!_0x43d131.relaxed;
    const _0x2561a2 = String(_0x53d700.commentId || _0x53d700.cid || _0x53d700.comment_id || "").trim();
    if (/^\d{10,}$/.test(_0x2561a2)) {
      let _0x3b380f = "";
      try {
        _0x3b380f = extractDouyinCommentCidFromNode(_0x4f57fd);
      } catch (_0x48fead) {
        _0x3b380f = "";
      }
      if (_0x3b380f && _0x3b380f !== _0x2561a2) {
        return -1;
      }
      if (_0x3b380f && _0x3b380f === _0x2561a2) {
        return 80 + _0x45f54f(_0x4f57fd);
      }
    }
    const _0x11a324 = _0x1b8d08(_0x4f57fd.innerText || "");
    const _0x539cf8 = _0x1b8d08(_0x4f57fd.textContent || "");
    const _0x2542c6 = (_0x53d700.nickname || "").trim();
    if (!_0x2542c6) {
      return -1;
    }
    const _0x3fbb87 = Array.from(_0x4f57fd.querySelectorAll("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"]"));
    const _0xc2e6aa = _0x3fbb87.find(_0x40ca4c => {
      const _0x50894e = _0x1b8d08(_0x40ca4c?.innerText || _0x40ca4c?.textContent || _0x40ca4c?.getAttribute?.("title") || "").replace(/^@+/, "");
      return _0x50894e && (_0x50894e === _0x2542c6 || _0x50894e.includes(_0x2542c6) || _0x2542c6.includes(_0x50894e));
    }) || _0x3fbb87[0] || null;
    const _0xcb651c = _0x1b8d08(_0xc2e6aa?.innerText || _0xc2e6aa?.textContent || _0xc2e6aa?.getAttribute?.("title") || "").replace(/^@+/, "");
    if (!_0x11a324.includes(_0x2542c6) && !_0x539cf8.includes(_0x2542c6) && _0xcb651c !== _0x2542c6) {
      return -1;
    }
    let _0x5c032c = 1;
    const _0x1da927 = _0x1b8d08(_0x53d700.content || _0x53d700.comment || _0x53d700.commentText || "");
    let _0x15e77b = "";
    try {
      _0x15e77b = _0x261c36(_0x4f57fd, _0x2542c6 || _0xcb651c) || "";
    } catch (_0x231d78) {
      _0x15e77b = "";
    }
    const _0x29da73 = _0x4ba9a3(_0x4f57fd);
    const _0x549a03 = [_0x15e77b, _0x11a324, _0x539cf8, ..._0x29da73].filter(Boolean);
    const _0x51e183 = _0x475ecc(_0x1da927);
    const _0x1f5b08 = _0x4ffd0d(_0x4f57fd, _0x2542c6 || _0xcb651c, _0x15e77b, _0x29da73);
    const _0x309e5e = _0x2c66f1(_0x51e183, _0x1f5b08, _0x549a03, _0x2542c6 || _0xcb651c);
    let _0x193f8c = !_0x1da927 || _0x309e5e.hit;
    if (_0x1da927 && !_0x309e5e.hit) {
      if (!_0x8041f6) {
        return -1;
      }
      const _0x2b3c22 = _0x1da927.slice(0, Math.min(10, _0x1da927.length));
      const _0x33b531 = _0x2b3c22.length >= 4 && _0x549a03.some(_0x269781 => _0x269781.includes(_0x2b3c22));
      const _0x70dfea = !_0x15e77b || _0x15e77b === "..." || /^\.{2,}$/.test(_0x15e77b) || _0x11a324.includes("...") || _0x539cf8.includes("...");
      const _0x5e4c07 = (_0x53d700.timeText || _0x53d700.commentTime || "").trim();
      const _0x15f20b = !!_0x5e4c07 && (!!_0x11a324.includes(_0x5e4c07) || !!_0x539cf8.includes(_0x5e4c07));
      const _0x1c4f11 = _0x352c8c(_0x53d700.userUrl || "");
      const _0x5b3543 = _0xc2e6aa ? _0x352c8c(_0xc2e6aa.href || _0xc2e6aa.getAttribute("href") || "") : "";
      const _0x17e8a4 = !!_0x1c4f11 && !!_0x5b3543 && _0x1c4f11 === _0x5b3543;
      if (_0x33b531) {
        _0x193f8c = true;
        _0x5c032c += 8;
      } else if (_0x17e8a4 && (_0x15f20b || _0x70dfea)) {
        _0x193f8c = true;
        _0x5c032c += 5;
      } else if (_0x17e8a4 && _0x15f20b) {
        _0x193f8c = true;
        _0x5c032c += 6;
      } else {
        return -1;
      }
    }
    if (_0x309e5e.scoreBonus) {
      _0x5c032c += _0x309e5e.scoreBonus;
    }
    if (_0x309e5e.soft) {
      _0x5c032c += 0;
    }
    _0x5c032c += _0x45f54f(_0x4f57fd);
    const _0x24d714 = _0x352c8c(_0x53d700.userUrl || "");
    if (_0x24d714) {
      const _0x5d6f04 = _0xc2e6aa ? _0x352c8c(_0xc2e6aa.href || _0xc2e6aa.getAttribute("href") || "") : "";
      if (_0x5d6f04) {
        if (_0x5d6f04 === _0x24d714) {
          _0x5c032c += 18;
        } else if (!_0x193f8c || _0x309e5e.soft) {
          return -1;
        }
      }
    }
    const _0x5e7021 = (_0x53d700.timeText || _0x53d700.commentTime || "").trim();
    if (_0x5e7021 && (_0x11a324.includes(_0x5e7021) || _0x539cf8.includes(_0x5e7021))) {
      _0x5c032c += 10;
    }
    const _0x26d845 = (_0x53d700.ipLocation || _0x53d700.location || "").trim();
    if (_0x26d845 && _0x26d845 !== "未知" && (_0x11a324.includes(_0x26d845) || _0x539cf8.includes(_0x26d845))) {
      _0x5c032c += 4;
    }
    try {
      const _0x233739 = (_0x4f57fd.className || "") + " " + (_0x4f57fd.getAttribute?.("class") || "");
      if (/active|Active|highlight|Highlight|selected|Selected|current|Current/i.test(_0x233739)) {
        _0x5c032c += 10;
      }
    } catch (_0x413172) {}
    return _0x5c032c;
  }
  function _0x1cdcd7(_0x11af1f, _0x1bc676, _0x2bf5dd = {}) {
    const _0x580823 = !!_0x2bf5dd.relaxed;
    const _0x4f44c4 = _0x5f0053(_0x11af1f);
    let _0x43c6c8 = _0x5a86cc(_0x4f44c4);
    if (!_0x43c6c8.length) {
      _0x43c6c8 = _0x5a86cc(document);
    }
    let _0x408df3 = null;
    let _0x4b4006 = -1;
    for (const _0x323a94 of _0x43c6c8) {
      const _0x5562b0 = _0x4c51c6(_0x323a94, _0x1bc676, {
        relaxed: _0x580823
      });
      if (_0x5562b0 > _0x4b4006) {
        _0x4b4006 = _0x5562b0;
        _0x408df3 = _0x323a94;
      }
    }
    if (_0x408df3 && _0x2bf5dd.scrollIntoView !== false) {
      _0x5a444c(_0x408df3, {
        force: true,
        block: "nearest"
      });
    }
    return _0x408df3;
  }
  async function _0x468e3b(_0x298d87, _0x4e139e, _0x57fad5 = {}) {
    const _0x13961e = Number(_0x57fad5.baseRounds) || 8;
    let _0x41f854 = _0x13961e;
    let _0x16a2df = false;
    let _0x302ce1 = 0;
    for (let _0x10dfa2 = 0; _0x10dfa2 < _0x41f854; _0x10dfa2++) {
      if (_0x48fd75(_0x4e139e)) {
        return _0x302ce1;
      }
      const _0xaa877e = _0x5f0053(_0x298d87);
      const _0x253b0f = _0x5a86cc(_0xaa877e).filter(_0x4f83d3).length;
      if (_0x253b0f > _0x302ce1) {
        _0x302ce1 = _0x253b0f;
      }
      if (_0x302ce1 > 0) {
        return _0x302ce1;
      }
      const _0x3bbc84 = _0x384ae3(_0x298d87 || document.body);
      if (_0x3bbc84 === 0) {
        return 0;
      }
      if (!_0x16a2df && _0x10dfa2 >= _0x13961e - 1 && _0x3bbc84 > 0) {
        _0x41f854 = _0x2d0f13(_0x13961e, {
          progress: true,
          hardCapRounds: 14
        });
        if (_0x41f854 > _0x13961e) {
          _0x16a2df = true;
          console.log("[Built-in-Debug] [慢环境] 评论节点尚未渲染，延长等待 " + _0x13961e + "→" + _0x41f854 + " 轮");
          try {
            _0x4f10ba("评论列表加载中，继续等待节点…");
          } catch (_0x276e4b) {}
        }
      }
      await _0x1916f8(_0x57fad5.profileVideo ? 350 : 500);
    }
    return _0x302ce1;
  }
  function _0x50c05c(_0x7f36af, _0x48bfe0, _0x54d985 = {}) {
    if (!_0x7f36af || !_0x4f83d3(_0x7f36af)) {
      return false;
    }
    return _0x4c51c6(_0x7f36af, _0x48bfe0, _0x54d985) >= 0;
  }
  async function _0x2421a5(_0x382fba, _0x390f58) {
    if (!_0x382fba) {
      return null;
    }
    const _0x3996e8 = _0x382fba.getBoundingClientRect();
    const _0x51c2aa = _0x3996e8.bottom > 8 && _0x3996e8.top < window.innerHeight - 8 && _0x3996e8.height > 0;
    if (!_0x51c2aa) {
      _0x5a444c(_0x382fba, {
        force: true,
        block: "nearest"
      });
      await _0x3310b6(160, 320, _0x390f58);
    }
    return _0x382fba;
  }
  function _0x58d981(_0x22eda8, _0x2d5809) {
    const _0x584d56 = String(_0x2d5809 || "").trim();
    const _0x37334e = String(_0x22eda8 || "").trim();
    if (!_0x584d56 || !_0x37334e) {
      return;
    }
    try {
      _0x21fac1.send("video-monitor-action-progress", {
        requestId: _0x37334e,
        message: _0x584d56
      });
    } catch (_0x53f899) {}
  }
  async function _0x2945ef(_0x114207, _0x4a9f48, _0x303f9a, _0x1a4f57 = {}) {
    if (_0x48fd75(_0x303f9a)) {
      return null;
    }
    const _0x4eaf1c = _0x114207 || document.body;
    const _0x3d8402 = String(_0x303f9a || "") === "SELF_WARMUP";
    const _0x236fb4 = String(_0x4a9f48?.commentId || _0x4a9f48?.cid || _0x4a9f48?.comment_id || "").trim();
    const _0xaf6aca = /^\d{10,}$/.test(_0x236fb4);
    const _0xecfc82 = !!_0x1a4f57.fastLocate && !_0x3d8402 && _0x1a4f57.stableLocate !== true;
    const _0x42ba8b = !_0xaf6aca && (!!_0x1a4f57.stableLocate || _0x3d8402) || !_0xecfc82 && !!_0x1a4f57.forceStable;
    const _0x4fc601 = typeof _0x1a4f57.onProgress === "function" ? _0x1a4f57.onProgress : null;
    const _0x36e607 = _0x3faadc => {
      try {
        _0x4fc601?.(_0x3faadc);
      } catch (_0x19eaa8) {}
    };
    try {
      await _0x4e12db(_0x4eaf1c, _0x303f9a);
    } catch (_0x2ede72) {}
    const _0xe09750 = _0xecfc82 ? 3 : _0x42ba8b ? 12 : 8;
    const _0x47091b = _0x5a86cc(_0x5f0053(_0x4eaf1c)).filter(_0x4f83d3).length;
    if (!_0xecfc82 || _0x47091b === 0) {
      _0x36e607("等待评论节点渲染（当前可见 " + _0x47091b + "）");
      await _0x468e3b(_0x4eaf1c, _0x303f9a, {
        profileVideo: !!_0x1a4f57.profileVideo,
        baseRounds: _0xe09750
      });
    } else {
      _0x36e607("评论区已有 " + _0x47091b + " 个可见节点，跳过就绪等待");
    }
    let _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
      scrollIntoView: true
    });
    if (_0x50c05c(_0x1974d6, _0x4a9f48)) {
      _0x36e607("当前视口已命中目标评论");
      return _0x2421a5(_0x1974d6, _0x303f9a);
    }
    if (_0x42ba8b) {
      _0x36e607("等待页面自动跳转到目标评论（慢速稳定模式，最长约 40 秒）…");
      const _0x7463de = Date.now() + 40000;
      let _0x400d79 = 0;
      while (Date.now() < _0x7463de) {
        if (_0x48fd75(_0x303f9a)) {
          return null;
        }
        _0x400d79 += 1;
        await _0x1916f8(600);
        _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
          scrollIntoView: true
        });
        if (_0x50c05c(_0x1974d6, _0x4a9f48)) {
          _0x36e607("页面自动定位命中目标评论（等待第 " + _0x400d79 + " 轮）");
          return _0x2421a5(_0x1974d6, _0x303f9a);
        }
        if (_0x400d79 % 5 === 0) {
          _0x36e607("仍在等待自动定位…（第 " + _0x400d79 + " 轮，约 " + Math.round((Date.now() - (_0x7463de - 40000)) / 1000) + "s）");
        }
      }
      _0x36e607("自动定位等待结束（约 40 秒），改为慢速滚动搜索");
    } else {
      await _0x1916f8(_0xecfc82 ? 280 : 500);
      _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
        scrollIntoView: true
      });
      if (_0x50c05c(_0x1974d6, _0x4a9f48)) {
        _0x36e607("短等后命中目标评论");
        return _0x2421a5(_0x1974d6, _0x303f9a);
      }
    }
    const _0x1b0aa8 = _0x3db448(_0x4eaf1c) || _0x5f0053(_0x4eaf1c) || _0x4eaf1c;
    if (!_0x1b0aa8) {
      return null;
    }
    if (_0x1b0aa8.scrollTop > 0) {
      _0x36e607("重置评论区到顶部(scrollTop=" + Math.round(_0x1b0aa8.scrollTop) + "→0)进行检索");
      _0x1b0aa8.scrollTop = 0;
      try {
        _0x1b0aa8.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (_0x3ca87e) {}
      await _0x1916f8(_0xecfc82 ? 200 : _0x42ba8b ? 600 : 350);
      _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
        scrollIntoView: true
      });
      if (_0x50c05c(_0x1974d6, _0x4a9f48)) {
        _0x36e607("回顶后命中目标评论");
        return _0x2421a5(_0x1974d6, _0x303f9a);
      }
    }
    const _0x2e57a0 = Math.max(400, Math.min(800, _0x1b0aa8.clientHeight || 600));
    const _0x258d22 = _0x42ba8b ? 50 : 40;
    let _0x51c645 = _0x258d22;
    let _0x5ea158 = false;
    let _0x511328 = -1;
    let _0x1c29df = _0x5a86cc(_0x5f0053(_0x4eaf1c)).length;
    let _0x32a04e = 0;
    const _0x51d6bf = _0x384ae3(_0x4eaf1c) || 0;
    _0x36e607("开始滚动搜索目标评论（可见 " + _0x1c29df + "/" + (_0x51d6bf || "?") + "）");
    for (let _0x124385 = 0; _0x124385 < _0x51c645; _0x124385++) {
      if (_0x48fd75(_0x303f9a)) {
        return null;
      }
      _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
        scrollIntoView: true
      });
      if (_0x50c05c(_0x1974d6, _0x4a9f48)) {
        _0x36e607("滚动第 " + (_0x124385 + 1) + " 轮命中目标评论");
        return _0x2421a5(_0x1974d6, _0x303f9a);
      }
      const _0x42f60f = _0x1b0aa8.scrollTop;
      const _0x4d9603 = Math.max(0, _0x1b0aa8.scrollHeight - _0x1b0aa8.clientHeight);
      const _0xa1cf9d = _0x5a86cc(_0x5f0053(_0x4eaf1c)).length;
      const _0x1cecf4 = _0xa1cf9d > _0x1c29df;
      if (_0x1cecf4) {
        _0x1c29df = _0xa1cf9d;
      }
      if (_0x42f60f >= _0x4d9603 - 10 && _0x511328 >= _0x4d9603 - 10) {
        if (_0xecfc82) {
          _0x36e607("已滚到底仍未命中（第 " + (_0x124385 + 1) + " 轮）");
          break;
        }
        _0x32a04e += 1;
        const _0x3d008c = _0x42ba8b ? 6 : 3;
        const _0x1102d5 = _0x1cecf4 || _0x51d6bf > 0 && _0x1c29df < Math.min(_0x51d6bf, _0x1c29df + 8) || _0x32a04e < _0x3d008c;
        if (!_0x1102d5) {
          break;
        }
        await _0x1916f8(_0x1cecf4 ? 500 : _0x42ba8b ? 900 : 700);
      } else {
        _0x32a04e = 0;
      }
      _0x511328 = _0x42f60f;
      if (typeof _0x1b0aa8.scrollBy === "function") {
        _0x1b0aa8.scrollBy(0, _0x2e57a0);
      } else {
        _0x1b0aa8.scrollTop += _0x2e57a0;
      }
      try {
        _0x1b0aa8.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (_0x16445e) {}
      const _0x59d7d2 = _0xa1cf9d;
      await _0x3310b6(_0xecfc82 ? 200 : _0x42ba8b ? 320 : 220, _0xecfc82 ? 350 : _0x42ba8b ? 520 : 380, _0x303f9a);
      let _0x133ed0 = _0x5a86cc(_0x5f0053(_0x4eaf1c)).length;
      if (!_0xecfc82 && _0x133ed0 <= _0x59d7d2) {
        await _0x1916f8(_0x42ba8b ? 450 : 280);
        _0x133ed0 = _0x5a86cc(_0x5f0053(_0x4eaf1c)).length;
      }
      if (_0x133ed0 > _0x1c29df) {
        _0x1c29df = _0x133ed0;
      }
      if ((_0x124385 + 1) % 10 === 0) {
        _0x36e607("滚动搜索中第 " + (_0x124385 + 1) + "/" + _0x51c645 + " 轮，可见节点 " + _0x1c29df);
      }
      if (!_0xecfc82 && !_0x5ea158 && (_0x1cecf4 || _0x133ed0 > _0x59d7d2) && _0x124385 >= _0x258d22 - 1) {
        _0x51c645 = _0x2d0f13(_0x258d22, {
          progress: true,
          hardCapRounds: _0x42ba8b ? 70 : 60
        });
        if (_0x51c645 > _0x258d22) {
          _0x5ea158 = true;
          console.log("[Built-in-Debug] [慢环境] 评论定位滚动仍有新节点，延长 " + _0x258d22 + "→" + _0x51c645 + " 轮");
        }
      }
    }
    _0x1974d6 = _0x1cdcd7(_0x4eaf1c, _0x4a9f48, {
      scrollIntoView: true,
      relaxed: true
    });
    if (_0x50c05c(_0x1974d6, _0x4a9f48, {
      relaxed: true
    })) {
      _0x36e607("严格匹配未中，宽松匹配命中");
      console.log("[Built-in-Debug] [评论定位] 严格匹配未中，宽松匹配命中");
      return _0x2421a5(_0x1974d6, _0x303f9a);
    }
    const _0x63e6f6 = _0x4b67ce((_0x4a9f48.content || "").trim(), 24);
    const _0x916a24 = _0x5a86cc(_0x5f0053(_0x4eaf1c)).filter(_0x4f83d3).length;
    _0x36e607("定位失败，可见节点 " + _0x916a24 + "/" + (_0x51d6bf || "?"));
    _0x348fa4("⚠ 定位评论失败：@" + _0x4a9f48.nickname + (_0x63e6f6 ? "「" + _0x63e6f6 + "」" : "") + "，可见节点 " + _0x916a24 + "/" + (_0x51d6bf || "?") + "，评论区完整滚动搜索后未找到原评论", null, "warning");
    return null;
  }
  function _0x4a3b34(_0x103a3e) {
    if (!_0x103a3e || !_0x4deec8()) {
      return null;
    }
    const _0x279619 = _0x103a3e.matches?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], [class*=\"ReplyItem\"]");
    const _0x2c78a7 = Array.from(_0x103a3e.querySelectorAll("span, a, button, div[role=\"button\"]")).filter(_0x5c2b48 => {
      if (!_0x4f83d3(_0x5c2b48)) {
        return false;
      }
      if (!_0xaf1664(_0x5c2b48, _0x103a3e)) {
        return false;
      }
      const _0xe05e71 = (_0x5c2b48.textContent || "").replace(/\s+/g, " ").trim();
      if (!_0x15b8e6(_0xe05e71)) {
        return false;
      }
      if ((_0x5c2b48.innerText || "").trim().length > 8) {
        return false;
      }
      if (!_0x279619) {
        const _0x1fced7 = !!_0x5c2b48.closest("[class*=\"reply-list\"], [class*=\"ReplyList\"], [class*=\"sub-comment-list\"], [class*=\"SubCommentList\"], [data-e2e=\"comment-reply-list\"]");
        if (_0x1fced7) {
          return false;
        }
      }
      return true;
    });
    if (!_0x2c78a7.length) {
      return null;
    }
    const _0x4d5c00 = _0x103a3e.getBoundingClientRect();
    const _0x538f7e = _0x2c78a7.map(_0x306c11 => {
      const _0x328283 = _0x306c11.getBoundingClientRect();
      let _0x5d9fcf = 0;
      if (_0x306c11.closest("button, a, [role=\"button\"]")) {
        _0x5d9fcf += 4;
      }
      const _0x21776a = Math.max(0, _0x328283.top - _0x4d5c00.top);
      _0x5d9fcf += Math.max(0, 14 - _0x21776a / 18);
      if (_0x328283.width > 0 && _0x328283.width < 80) {
        _0x5d9fcf += 2;
      }
      return {
        el: _0x306c11,
        score: _0x5d9fcf,
        dist: _0x21776a
      };
    }).sort((_0x592b37, _0x2c4e31) => _0x2c4e31.score - _0x592b37.score);
    const _0x5503df = _0x538f7e[0]?.el;
    return _0x5503df?.closest("button, a, div[role=\"button\"], div, span") || _0x5503df || null;
  }
  function _0x2b0c26(_0x4b731b) {
    const _0x1a790f = _0x188fe3("commentInputReply") || _0x188fe3("commentInput");
    const _0x50da3a = _0x188fe3("commentSendBtn");
    const _0x5cb340 = _0x188fe3("commentInputShell");
    if (!_0x4deec8()) {
      return null;
    }
    let _0x2e798e = [];
    if (_0x1a790f) {
      try {
        _0x2e798e = Array.from(document.querySelectorAll(_0x1a790f));
      } catch (_0x1be0a5) {
        _0x2e798e = [];
      }
    }
    if (_0x2e798e.length === 0) {
      const _0x2b9cdb = ["[data-e2e=\"comment-input\"] .public-DraftEditor-content", "[data-e2e=\"comment-input\"] [contenteditable=\"true\"]", "[class*=\"Reply\"] [contenteditable=\"true\"]", "[class*=\"reply\"] [contenteditable=\"true\"]"].join(", ");
      const _0xfd6aa8 = _0x4b731b?.closest?.("[data-e2e*=\"comment\"], [class*=\"comment\"], [class*=\"Comment\"]");
      for (const _0x5ab53b of [_0xfd6aa8, document]) {
        if (!_0x5ab53b?.querySelectorAll) {
          continue;
        }
        try {
          _0x2e798e.push(..._0x5ab53b.querySelectorAll(_0x2b9cdb));
        } catch (_0x4609fc) {}
        if (_0x2e798e.length > 0) {
          break;
        }
      }
    }
    _0x2e798e = [...new Set(_0x2e798e)].filter(_0x388254 => {
      if (!_0x4f83d3(_0x388254)) {
        return false;
      }
      const _0x3b2664 = _0x388254.getBoundingClientRect();
      return _0x3b2664.width >= 40 && _0x3b2664.height >= 14;
    });
    const _0x9a3940 = (_0x4b731b?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 200);
    const _0x1366b4 = _0x2e798e.map(_0x5eb700 => {
      const _0x13c475 = _0x5eb700.closest("[class*=\"comment\"], form, section, [class*=\"Reply\"], [class*=\"reply\"]")?.innerText || "";
      const _0x470a8c = (_0x5eb700.getAttribute("placeholder") || _0x5eb700.getAttribute("data-placeholder") || "").trim();
      let _0x4f092d = 0;
      if (_0x9a3940 && _0x13c475.includes(_0x9a3940.slice(0, 30))) {
        _0x4f092d += 5;
      }
      if (_0x5eb700.matches?.(".public-DraftEditor-content")) {
        _0x4f092d += 3;
      }
      if (_0x5cb340) {
        try {
          if (_0x5eb700.closest(_0x5cb340)) {
            _0x4f092d += 4;
          }
        } catch (_0x630404) {}
      }
      if (_0x50da3a) {
        try {
          if (_0x5eb700.closest("[class*=\"comment\"]")?.querySelector(_0x50da3a)) {
            _0x4f092d += 4;
          }
        } catch (_0x4a6264) {}
      }
      if (_0x433ab2(_0x470a8c) || /回复|评论|说点/.test(_0x470a8c)) {
        _0x4f092d += 5;
      }
      if (_0x4b731b?.contains?.(_0x5eb700)) {
        _0x4f092d += 8;
      }
      return {
        el: _0x5eb700,
        score: _0x4f092d
      };
    }).sort((_0x100e2b, _0x4db109) => _0x4db109.score - _0x100e2b.score);
    return _0x1366b4[0]?.el || null;
  }
  async function _0x4cdd3e(_0x329e9d) {
    const _0x16baec = _0x188fe3("commentInputShellLoose") || _0x188fe3("commentInputShell");
    if (!_0x16baec || !_0x4deec8()) {
      return false;
    }
    const _0x548d92 = Array.from(document.querySelectorAll(_0x16baec)).filter(_0x1b0aa0 => {
      if (!_0x4f83d3(_0x1b0aa0)) {
        return false;
      }
      const _0x4a64c4 = (_0x1b0aa0.getAttribute("placeholder") || _0x1b0aa0.getAttribute("data-placeholder") || _0x1b0aa0.textContent || "").replace(/\s+/g, " ").trim();
      return _0x433ab2(_0x4a64c4) || /回复|说点|评论/.test(_0x4a64c4);
    });
    if (!_0x548d92.length) {
      return false;
    }
    const _0x2c3ef6 = _0x548d92.sort((_0x2c5bd5, _0x60db12) => {
      const _0x502538 = _0x2c5bd5.getBoundingClientRect();
      const _0x4d52e0 = _0x60db12.getBoundingClientRect();
      return _0x4d52e0.bottom - _0x502538.bottom;
    })[0];
    try {
      await _0x244deb(_0x2c3ef6, _0x329e9d, "回复占位符");
    } catch (_0x48214e) {
      try {
        _0x2c3ef6.click();
      } catch (_0x64db6f) {}
    }
    await _0x1916f8(320);
    return true;
  }
  function _0x24b710(_0x3f8a6d = document) {
    const _0xca77cc = _0x533f8e();
    const _0x54f9ec = _0x72301b();
    const _0x20c473 = _0x417841();
    if (!_0xca77cc || !_0x4deec8()) {
      return null;
    }
    const _0x478b9a = [];
    if (_0x3f8a6d) {
      _0x478b9a.push(_0x3f8a6d);
    }
    if (_0x3f8a6d !== document) {
      _0x478b9a.push(document);
    }
    let _0x5d2de4 = [];
    for (const _0x46ee59 of _0x478b9a) {
      _0x5d2de4.push(...Array.from(_0x46ee59.querySelectorAll(_0xca77cc)));
    }
    _0x5d2de4 = [...new Set(_0x5d2de4.map(_0x9a60a).filter(Boolean))].filter(_0x475c29 => {
      if (!_0x4f83d3(_0x475c29)) {
        return false;
      }
      let _0x29a49d = false;
      if (_0x54f9ec) {
        try {
          _0x29a49d = Boolean(_0x475c29.closest(_0x54f9ec));
        } catch (_0x16144b) {}
      }
      if (!_0x29a49d) {
        _0x29a49d = Boolean(_0x475c29.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]") && !_0x475c29.closest("[class*=\"input\"], [class*=\"Input\"], [class*=\"write\"], [class*=\"Write\"], [class*=\"editor\"], [class*=\"Editor\"]"));
      }
      if (_0x29a49d) {
        return false;
      }
      if (_0x475c29.closest("[class*=\"search\"], [data-e2e=\"searchbar\"]")) {
        return false;
      }
      const _0x23eb94 = _0x475c29.getBoundingClientRect();
      if (_0x23eb94.width < 40 || _0x23eb94.height < 16) {
        return false;
      }
      const _0xa28d41 = window.getComputedStyle(_0x475c29);
      if (_0xa28d41.display === "none" || _0xa28d41.visibility === "hidden") {
        return false;
      }
      return true;
    });
    const _0x24d5fa = _0x5d2de4.map(_0x30a882 => {
      let _0x48ad5b = 0;
      const _0x176463 = _0x30a882.getBoundingClientRect();
      if (_0x3f8a6d && _0x3f8a6d !== document && (_0x30a882 === _0x3f8a6d || _0x3f8a6d.contains?.(_0x30a882))) {
        _0x48ad5b += 100;
      }
      const _0x1e7745 = _0xdd5660();
      if (_0x1e7745) {
        try {
          if (_0x30a882.closest(_0x1e7745)) {
            _0x48ad5b += 20;
          }
        } catch (_0x2c8d24) {}
      }
      if (_0x20c473) {
        try {
          if (_0x30a882.closest(_0x20c473)) {
            _0x48ad5b += 10;
          }
        } catch (_0x3d4285) {}
      }
      if (_0x30a882.classList.contains("public-DraftEditor-content")) {
        _0x48ad5b += 6;
      }
      if (_0x30a882.tagName === "TEXTAREA" || _0x30a882.tagName === "INPUT") {
        _0x48ad5b += 7;
      }
      if ((_0x30a882.getAttribute("role") || "").toLowerCase() === "textbox") {
        _0x48ad5b += 5;
      }
      const _0x5e2702 = (_0x30a882.getAttribute("placeholder") || "").toLowerCase();
      if (_0x5e2702.includes("评论") || _0x5e2702.includes("说点")) {
        _0x48ad5b += 8;
      }
      _0x48ad5b += _0x176463.bottom / Math.max(window.innerHeight, 1) * 15;
      if (_0x299e21(_0x30a882)) {
        _0x48ad5b += 12;
      }
      return {
        el: _0x30a882,
        score: _0x48ad5b
      };
    }).sort((_0x11f380, _0x53b16d) => _0x53b16d.score - _0x11f380.score);
    if (_0x24d5fa[0]) {
      console.log("[Built-in-Debug] [主贴输入框] 选中编辑器 (score=" + _0x24d5fa[0].score.toFixed(1) + ")");
    }
    return _0x24d5fa[0]?.el || null;
  }
  function _0x34e49d(_0x1b680e) {
    if (!_0x1b680e || _0x1b680e.nodeType !== 1) {
      return false;
    }
    const _0x3bc714 = String(_0x1b680e.tagName || "").toUpperCase();
    if (_0x3bc714 === "TEXTAREA") {
      return !_0x1b680e.disabled && !_0x1b680e.readOnly;
    }
    if (_0x3bc714 === "INPUT") {
      const _0x1fab09 = String(_0x1b680e.getAttribute("type") || "text").toLowerCase();
      return !_0x1b680e.disabled && !_0x1b680e.readOnly && !["button", "submit", "checkbox", "radio", "hidden", "file"].includes(_0x1fab09);
    }
    const _0x3a09cf = String(_0x1b680e.getAttribute("contenteditable") || "").toLowerCase();
    if (_0x3a09cf === "true" || _0x3a09cf === "plaintext-only" || _0x1b680e.isContentEditable) {
      return true;
    }
    return _0x1b680e.classList?.contains("public-DraftEditor-content") || false;
  }
  function _0x9a60a(_0x58dfc4) {
    if (_0x34e49d(_0x58dfc4)) {
      return _0x58dfc4;
    }
    try {
      return Array.from(_0x58dfc4.querySelectorAll(".public-DraftEditor-content, [contenteditable=\"true\"], [contenteditable=\"plaintext-only\"], textarea, input, [role=\"textbox\"]")).find(_0x2b1dcc => _0x34e49d(_0x2b1dcc) && _0x4f83d3(_0x2b1dcc)) || null;
    } catch (_0x10c0ba) {
      return null;
    }
  }
  async function _0x4a86f9(_0x128309, _0x21814a, _0x281d8a = 15, _0x25c48d = {}) {
    const _0x550ce0 = !!_0x25c48d.profileVideo;
    const _0x311808 = Number(_0x25c48d.deadlineAt || 0);
    try {
      window.focus?.();
    } catch (_0x44afa0) {}
    try {
      if (_0x3dda76.currentViewKey) {
        _0x21fac1.send("focus-automation-view", {
          viewKey: _0x3dda76.currentViewKey,
          bringToFront: true
        });
      }
    } catch (_0x31df6e) {}
    const _0x4e97a5 = [];
    if (_0x128309) {
      _0x4e97a5.push(_0x128309);
    }
    if (!_0x4e97a5.includes(document.body)) {
      _0x4e97a5.push(document.body);
    }
    const _0x17786b = _0x281d8a;
    let _0x451627 = _0x17786b;
    let _0x36a00c = false;
    let _0x14df6d = false;
    for (let _0xf90ddc = 0; _0xf90ddc < _0x451627; _0xf90ddc++) {
      if (_0x48fd75(_0x21814a)) {
        return null;
      }
      if (_0x311808 > 0 && Date.now() >= _0x311808) {
        return null;
      }
      const _0x3e58dc = _0x24b710(_0x128309 || document);
      if (_0x3e58dc) {
        return _0x3e58dc;
      }
      for (const _0x3e3cd2 of _0x4e97a5) {
        if (_0x311808 > 0 && Date.now() >= _0x311808) {
          return null;
        }
        const _0x564b61 = _0x417841();
        const _0x370217 = [_0x564b61, "textarea[placeholder]", "input[placeholder]", "[contenteditable=\"true\"][data-placeholder]", "[role=\"textbox\"][aria-label]", "div", "span", "p"].filter(Boolean).join(", ");
        const _0x266d77 = _0x264920 => _0x564b61 && (() => {
          try {
            return _0x264920.matches(_0x564b61);
          } catch (_0x17d4b0) {
            return false;
          }
        })() && _0x4f83d3(_0x264920) && !_0x264920.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]");
        const _0x350261 = Array.from(_0x3e3cd2.querySelectorAll(_0x370217)).filter(_0x3e0233 => _0x1aa282(_0x3e0233, {
          requireViewport: false,
          profileVideo: _0x550ce0
        }) || _0x266d77(_0x3e0233)).sort((_0x55e099, _0xfb3bc5) => _0x3a54f9(_0xfb3bc5) - _0x3a54f9(_0x55e099));
        let _0x1d72ec = _0x350261.filter(_0x50a7c7 => _0x550ce0 ? _0x5cf133(_0x50a7c7) : _0x1b07bb(_0x50a7c7));
        if (!_0x1d72ec.length && _0x350261[0]) {
          try {
            _0x5a444c(_0x350261[0], {
              force: true,
              block: "nearest"
            });
            await _0x53508a(220, _0x311808);
            _0x1d72ec = _0x350261.filter(_0x599caa => _0x550ce0 ? _0x5cf133(_0x599caa) : _0x1b07bb(_0x599caa));
          } catch (_0x31c4de) {}
        }
        if (_0x1d72ec[0]) {
          _0x14df6d = true;
          const _0x5291ee = _0x1d72ec[0].closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || _0x1d72ec[0];
          await _0x244deb(_0x5291ee, _0x21814a, "主评占位符兜底", {
            deadlineAt: _0x311808
          });
          try {
            _0x1d72ec[0]?.focus?.();
            _0x1d72ec[0]?.click?.();
            _0x5291ee.focus?.();
            _0x5291ee.click?.();
          } catch (_0x5f14e4) {}
          await _0x53508a(300, _0x311808);
        } else {
          const _0x117164 = Array.from(_0x3e3cd2.querySelectorAll("div, span, p, textarea[placeholder], input[placeholder], [data-placeholder], [aria-label]")).filter(_0x4ec4ad => {
            if (!_0x4f83d3(_0x4ec4ad)) {
              return false;
            }
            if (_0x4ec4ad.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")) {
              return false;
            }
            const _0x44cdb8 = _0x32431d(_0x4ec4ad);
            if (!_0x44cdb8 || _0x44cdb8.length > 48) {
              return false;
            }
            if (!_0x8dcc04(_0x44cdb8)) {
              return false;
            }
            const _0x5ea2b5 = _0x4ec4ad.getBoundingClientRect();
            return _0x5ea2b5.width >= 20 && _0x5ea2b5.height >= 12 && _0x5ea2b5.height <= 180 && _0x5ea2b5.width <= Math.max(960, Math.floor(window.innerWidth * 0.85));
          }).sort((_0x4e61cb, _0x11b3fd) => _0x3a54f9(_0x11b3fd) - _0x3a54f9(_0x4e61cb)).slice(0, 3);
          for (const _0x3c0fc4 of _0x117164) {
            if (_0x311808 > 0 && Date.now() >= _0x311808) {
              break;
            }
            _0x14df6d = true;
            try {
              _0x5a444c(_0x3c0fc4, {
                force: true,
                block: "nearest"
              });
              await _0x53508a(220, _0x311808);
              const _0x4f7fca = _0x3c0fc4.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || _0x3c0fc4;
              await _0x244deb(_0x4f7fca, _0x21814a, "主评占位符宽松兜底", {
                deadlineAt: _0x311808,
                allowScrollIntoView: false
              });
              try {
                _0x3c0fc4.click?.();
                _0x4f7fca.click?.();
              } catch (_0x3273e6) {}
              await _0x53508a(400, _0x311808);
              const _0x259559 = _0x24b710(_0x128309 || document);
              if (_0x259559) {
                return _0x259559;
              }
            } catch (_0x22226f) {}
          }
        }
      }
      const _0x262357 = _0x2799c7();
      const _0x2b6ead = _0x262357 ? Array.from(document.querySelectorAll("div, span")).find(_0x29acfb => _0x4f83d3(_0x29acfb) && (_0x29acfb.textContent || "").trim().startsWith(_0x262357) && (_0x29acfb.textContent || "").length < 24) : null;
      if (_0x2b6ead && _0xf90ddc % 3 === 0) {
        await _0x244deb(_0x2b6ead, _0x21814a, "评论页签兜底", {
          deadlineAt: _0x311808
        });
        await _0x53508a(500, _0x311808);
      }
      const _0x3f9233 = _0x24b710(_0x128309 || document);
      if (_0x3f9233) {
        return _0x3f9233;
      }
      if (!_0x36a00c && !_0x311808 && _0x14df6d && _0xf90ddc >= _0x17786b - 1) {
        _0x451627 = _0x2d0f13(_0x17786b, {
          progress: true,
          hardCapRounds: 24
        });
        if (_0x451627 > _0x17786b) {
          _0x36a00c = true;
          console.log("[Built-in-Debug] [慢环境] 主评占位符已出现但编辑器未就绪，延长探测 " + _0x17786b + "→" + _0x451627 + " 轮");
        }
      }
      const _0x5793e1 = _0x311808 > 0 ? Math.max(0, _0x311808 - Date.now()) : 500;
      if (_0x311808 > 0 && _0x5793e1 <= 0) {
        return null;
      }
      await _0x53508a(Math.min(500, _0x5793e1), _0x311808);
    }
    return null;
  }
  function _0x3debfc(_0x27df63, _0x277d56 = 3) {
    const _0x55453c = Number(_0x27df63);
    if (!Number.isFinite(_0x55453c)) {
      return _0x277d56;
    }
    return Math.max(1, Math.min(8, Math.round(_0x55453c)));
  }
  function _0x26dc8e() {
    _0x3dda76.commentExpressionRotateIndex = 0;
    _0x3dda76.videoCommentExpressionRotateIndex = 0;
  }
  function _0x16373f() {
    if ((_0x3dda76.currentTask?.isBatchAction || _0x3dda76.currentTask?.batchConfig) && _0x3dda76.currentTask?.batchRunId != null) {
      return "batch:" + _0x3dda76.currentTask.batchRunId;
    }
    const _0x199c4c = _0x3dda76.currentTask?.monitorTaskId || _0x3dda76.currentTask?.monitorRunId || (_0x3dda76.currentTask?.isMonitorAction ? _0x3dda76.currentTask?.taskId : null);
    if (_0x199c4c != null && String(_0x199c4c).trim()) {
      return "monitor:" + String(_0x199c4c).trim();
    }
    return "";
  }
  function _0x27af81() {
    return !!_0x16373f();
  }
  function _0x3fdafd(_0x5d7263) {
    const _0x1fb4de = _0x16373f();
    if (!_0x1fb4de) {
      return "";
    }
    return "radar_attach_rot_" + _0x1fb4de + "_" + _0x5d7263;
  }
  function _0x1d3f19(_0x4dc700) {
    const _0x3bbcc7 = _0x3fdafd(_0x4dc700);
    if (!_0x3bbcc7) {
      return null;
    }
    try {
      const _0x1c375b = _0x19863f.getItem(_0x3bbcc7);
      if (_0x1c375b != null && _0x1c375b !== "") {
        const _0x129db9 = Number(_0x1c375b);
        if (Number.isFinite(_0x129db9)) {
          return Math.max(0, Math.floor(_0x129db9));
        }
      }
      if ((_0x3dda76.currentTask?.isBatchAction || _0x3dda76.currentTask?.batchConfig) && _0x3dda76.currentTask?.batchRunId != null) {
        const _0x3abc6c = "radar_batch_attach_rot_" + _0x3dda76.currentTask.batchRunId + "_" + _0x4dc700;
        const _0x21f035 = _0x19863f.getItem(_0x3abc6c);
        if (_0x21f035 != null && _0x21f035 !== "") {
          const _0x215da0 = Number(_0x21f035);
          if (Number.isFinite(_0x215da0)) {
            return Math.max(0, Math.floor(_0x215da0));
          }
        }
      }
      return null;
    } catch (_0xb51ba3) {
      return null;
    }
  }
  function _0x3cfab0(_0x5b7548, _0x4878f1) {
    const _0x331cf7 = _0x3fdafd(_0x5b7548);
    if (!_0x331cf7) {
      return;
    }
    try {
      _0x19863f.setItem(_0x331cf7, String(Math.max(0, Math.floor(Number(_0x4878f1) || 0))));
    } catch (_0x12ebfb) {}
  }
  function _0x5d0073() {
    if (!_0x27af81()) {
      return false;
    }
    const _0x2f4679 = _0x1d3f19("commentImage");
    const _0x3b1eaa = _0x1d3f19("videoCommentImage");
    const _0x22db0f = _0x1d3f19("commentExpression");
    const _0x1b0d14 = _0x1d3f19("videoCommentExpression");
    if (_0x2f4679 != null) {
      _0x3dda76.commentImageRotateIndex = _0x2f4679;
    }
    if (_0x3b1eaa != null) {
      _0x3dda76.videoCommentImageRotateIndex = _0x3b1eaa;
    }
    if (_0x22db0f != null) {
      _0x3dda76.commentExpressionRotateIndex = _0x22db0f;
    }
    if (_0x1b0d14 != null) {
      _0x3dda76.videoCommentExpressionRotateIndex = _0x1b0d14;
    }
    console.log("[评论配图] 轮询恢复(scope=" + _0x16373f() + "): 回复图=" + _0x3dda76.commentImageRotateIndex + (" 主评图=" + _0x3dda76.videoCommentImageRotateIndex) + (" 回复表情=" + _0x3dda76.commentExpressionRotateIndex) + (" 主评表情=" + _0x3dda76.videoCommentExpressionRotateIndex));
    return true;
  }
  function _0x4d7471() {
    if (!_0x27af81()) {
      return;
    }
    _0x3cfab0("commentImage", _0x3dda76.commentImageRotateIndex);
    _0x3cfab0("videoCommentImage", _0x3dda76.videoCommentImageRotateIndex);
    _0x3cfab0("commentExpression", _0x3dda76.commentExpressionRotateIndex);
    _0x3cfab0("videoCommentExpression", _0x3dda76.videoCommentExpressionRotateIndex);
  }
  function _0x173cfc() {
    _0x4d7471();
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
        return;
      }
      const _0x5f0bd1 = _0xe65d9e(window._radar_account_id, _0x3dda76.activeLoopId);
      const _0x3195da = _0x1bdc03(window._radar_account_id, _0x3dda76.activeLoopId);
      if (_0x3195da.loopId === _0x3dda76.activeLoopId) {
        _0x3195da.commentImageRotateIndex = _0x3dda76.commentImageRotateIndex;
        _0x3195da.videoCommentImageRotateIndex = _0x3dda76.videoCommentImageRotateIndex;
        _0x3195da.commentExpressionRotateIndex = _0x3dda76.commentExpressionRotateIndex;
        _0x3195da.videoCommentExpressionRotateIndex = _0x3dda76.videoCommentExpressionRotateIndex;
        _0x19863f.setItem(_0x5f0bd1, JSON.stringify(_0x3195da));
      }
    } catch (_0x33907d) {}
  }
  function _0x3ad1b9(_0xd774b0, _0x38bd84) {
    try {
      const _0x249510 = _0x1bdc03(_0xd774b0, _0x38bd84);
      if (_0x249510.loopId !== _0x38bd84) {
        return false;
      }
      if (Number.isFinite(_0x249510.commentImageRotateIndex)) {
        _0x3dda76.commentImageRotateIndex = Math.max(0, Math.floor(_0x249510.commentImageRotateIndex));
      }
      if (Number.isFinite(_0x249510.videoCommentImageRotateIndex)) {
        _0x3dda76.videoCommentImageRotateIndex = Math.max(0, Math.floor(_0x249510.videoCommentImageRotateIndex));
      }
      if (Number.isFinite(_0x249510.commentExpressionRotateIndex)) {
        _0x3dda76.commentExpressionRotateIndex = Math.max(0, Math.floor(_0x249510.commentExpressionRotateIndex));
      }
      if (Number.isFinite(_0x249510.videoCommentExpressionRotateIndex)) {
        _0x3dda76.videoCommentExpressionRotateIndex = Math.max(0, Math.floor(_0x249510.videoCommentExpressionRotateIndex));
      }
      console.log("[评论配图] 恢复轮询索引: 回复图=" + _0x3dda76.commentImageRotateIndex + " 主评图=" + _0x3dda76.videoCommentImageRotateIndex + (" 回复表情=" + _0x3dda76.commentExpressionRotateIndex + " 主评表情=" + _0x3dda76.videoCommentExpressionRotateIndex));
      return true;
    } catch (_0x4a420d) {
      return false;
    }
  }
  function _0x102dc2(_0x4ec1dd, _0x5eb3f0, _0x19913b) {
    const _0x18a588 = _0x3debfc(_0x5eb3f0);
    const _0x1d2a3f = Math.min(Math.max(_0x4ec1dd, 0), _0x18a588);
    if (_0x1d2a3f <= 0) {
      return 0;
    }
    if (_0x27af81()) {
      if (_0x19913b) {
        const _0x3f5a61 = _0x1d3f19("videoCommentExpression");
        if (_0x3f5a61 != null) {
          _0x3dda76.videoCommentExpressionRotateIndex = _0x3f5a61;
        }
      } else {
        const _0x1a5efe = _0x1d3f19("commentExpression");
        if (_0x1a5efe != null) {
          _0x3dda76.commentExpressionRotateIndex = _0x1a5efe;
        }
      }
    }
    if (_0x19913b) {
      const _0x38a0a0 = _0x3dda76.videoCommentExpressionRotateIndex % _0x1d2a3f;
      _0x3dda76.videoCommentExpressionRotateIndex += 1;
      _0x173cfc();
      return _0x38a0a0;
    }
    const _0x4c4f54 = _0x3dda76.commentExpressionRotateIndex % _0x1d2a3f;
    _0x3dda76.commentExpressionRotateIndex += 1;
    _0x173cfc();
    return _0x4c4f54;
  }
  function _0x595de7() {
    const _0x182671 = _0x3dda76.currentTask?.commentImagePaths;
    if (Array.isArray(_0x182671)) {
      return _0x182671.map(_0x28e072 => String(_0x28e072 || "").trim()).filter(Boolean);
    }
    const _0x3940f3 = String(_0x3dda76.currentTask?.commentImagePath || "").trim();
    if (_0x3940f3) {
      return [_0x3940f3];
    } else {
      return [];
    }
  }
  function _0x255b36() {
    const _0x43edc7 = _0x595de7();
    return {
      enabled: !!_0x3dda76.currentTask?.enableCommentImage,
      paths: _0x43edc7
    };
  }
  let _0x463a58 = null;
  function _0x3a5925(_0x36eee7) {
    const _0x59b727 = Number(_0x36eee7);
    if (!Number.isFinite(_0x59b727)) {
      return 20;
    }
    return Math.max(0, Math.min(100, Math.round(_0x59b727)));
  }
  function _0x21516d() {
    const _0x44eadc = _0x255b36();
    return _0x44eadc.enabled && _0x44eadc.paths.length > 0;
  }
  function _0x357afd() {
    const _0x38de0d = _0x2c033a();
    return _0x38de0d.enabled && _0x38de0d.paths.length > 0;
  }
  function _0xf7e615() {
    return !!_0x3dda76.currentTask?.enableCommentExpression;
  }
  function _0x2484b3() {
    return !!_0x3dda76.currentTask?.enableVideoCommentExpression;
  }
  function _0x143edf(_0x2a6e68 = false, _0x5beb3d = {}) {
    if (_0x5beb3d.profileFirst || _0x5beb3d.isProfileFirstComment || _0x5beb3d.profileVideo) {
      return "首作评论";
    }
    if (_0x2a6e68) {
      return "视频主评";
    } else {
      return "回复评论";
    }
  }
  function _0x95d6b8(_0x263637 = false, _0x5afc9d = {}) {
    const _0x26c5db = _0x263637 ? _0x357afd() : _0x21516d();
    const _0x2f0d93 = _0x263637 ? _0x2484b3() : _0xf7e615();
    const _0x463730 = _0x143edf(_0x263637, _0x5afc9d);
    if (!_0x26c5db && !_0x2f0d93) {
      _0x463a58 = {
        image: false,
        expression: false
      };
      _0x348fa4("📎 " + _0x463730 + "：未开启附带图片/表情包，跳过");
      console.log("[评论附带] 已滚动概率判定(isVideoComment=" + _0x263637 + "):", _0x463a58);
      return;
    }
    if (_0x5afc9d.forceWhenTextless) {
      _0x463a58 = {
        image: !!_0x26c5db,
        expression: !_0x26c5db && !!_0x2f0d93
      };
      const _0x5dc9fa = _0x463a58.image ? "图片" : "表情包";
      _0x348fa4("📎 " + _0x463730 + "：正文为空，强制附带" + _0x5dc9fa);
      console.log("[评论附带] 正文为空强制附带(isVideoComment=" + _0x263637 + "):", _0x463a58);
      return;
    }
    let _0x5d5836 = false;
    let _0xbdcc7e = false;
    const _0x3999ff = _0x263637 ? _0x3a5925(_0x3dda76.currentTask?.videoCommentAttachmentPercent) : _0x3a5925(_0x3dda76.currentTask?.commentAttachmentPercent);
    const _0x158341 = Math.random() * 100;
    const _0x478bab = _0x158341 < _0x3999ff;
    const _0x1b29b6 = _0x26c5db ? "图片" : "表情包";
    if (_0x478bab) {
      if (_0x26c5db) {
        _0x5d5836 = true;
      } else if (_0x2f0d93) {
        _0xbdcc7e = true;
      }
      _0x348fa4("📎 " + _0x463730 + "：概率命中（" + _0x3999ff + "%），本次将附带" + _0x1b29b6);
    } else {
      _0x348fa4("📎 " + _0x463730 + "：概率未命中（设置 " + _0x3999ff + "%，本次跳过附带" + _0x1b29b6 + "）");
    }
    _0x463a58 = {
      image: _0x5d5836,
      expression: _0xbdcc7e
    };
    console.log("[评论附带] 已滚动概率判定(isVideoComment=" + _0x263637 + "):", _0x463a58);
  }
  function _0x161208() {
    if (_0x463a58) {
      return _0x463a58.image;
    }
    return _0x21516d();
  }
  function _0x51c623() {
    _0x3dda76.commentImageRotateIndex = 0;
    _0x3dda76.videoCommentImageRotateIndex = 0;
    _0x26dc8e();
  }
  function _0x26c634() {
    const _0x1fd309 = _0x595de7();
    if (!_0x1fd309.length) {
      return "";
    }
    if (_0x27af81()) {
      const _0x2d6009 = _0x1d3f19("commentImage");
      if (_0x2d6009 != null) {
        _0x3dda76.commentImageRotateIndex = _0x2d6009;
      }
    }
    const _0x1a37ba = _0x1fd309[_0x3dda76.commentImageRotateIndex % _0x1fd309.length];
    const _0x3eed20 = _0x3dda76.commentImageRotateIndex % _0x1fd309.length;
    _0x3dda76.commentImageRotateIndex += 1;
    _0x173cfc();
    const _0x4fa639 = _0x1a37ba.split(/[/\\]/).pop() || _0x1a37ba;
    console.log("[评论配图] 轮询 " + (_0x3eed20 + 1) + "/" + _0x1fd309.length + ": " + _0x4fa639);
    return _0x1a37ba;
  }
  function _0x2fad27() {
    const _0x530c63 = _0x3dda76.currentTask?.videoCommentImagePaths;
    if (Array.isArray(_0x530c63)) {
      return _0x530c63.map(_0x54da0d => String(_0x54da0d || "").trim()).filter(Boolean);
    }
    return [];
  }
  function _0x2c033a() {
    const _0x32c6a6 = _0x2fad27();
    return {
      enabled: !!_0x3dda76.currentTask?.enableVideoCommentImage,
      paths: _0x32c6a6
    };
  }
  function _0x1d96c2() {
    if (_0x463a58) {
      return _0x463a58.image;
    }
    return _0x357afd();
  }
  function _0x1f4f22() {
    const _0x4eec04 = _0x2fad27();
    if (!_0x4eec04.length) {
      return "";
    }
    if (_0x27af81()) {
      const _0xe6da73 = _0x1d3f19("videoCommentImage");
      if (_0xe6da73 != null) {
        _0x3dda76.videoCommentImageRotateIndex = _0xe6da73;
      }
    }
    const _0x1eb0cb = _0x4eec04[_0x3dda76.videoCommentImageRotateIndex % _0x4eec04.length];
    const _0x1c605b = _0x3dda76.videoCommentImageRotateIndex % _0x4eec04.length;
    _0x3dda76.videoCommentImageRotateIndex += 1;
    _0x173cfc();
    const _0x98b1c7 = _0x1eb0cb.split(/[/\\]/).pop() || _0x1eb0cb;
    console.log("[视频评论配图] 轮询 " + (_0x1c605b + 1) + "/" + _0x4eec04.length + ": " + _0x98b1c7);
    return _0x1eb0cb;
  }
  function _0x191ae6() {
    if (_0x463a58) {
      return _0x463a58.expression;
    }
    return _0xf7e615();
  }
  function _0x4840db() {
    if (_0x463a58) {
      return _0x463a58.expression;
    }
    return _0x2484b3();
  }
  function _0x5499cd(_0x478ead = false) {
    if (_0x478ead) {
      return _0x357afd() || _0x2484b3();
    } else {
      return _0x21516d() || _0xf7e615();
    }
  }
  function _0x2c3832(_0x51df50 = false) {
    return _0x5499cd(_0x51df50) || _0x44998c(_0x51df50);
  }
  function _0x4a6969(_0x3d33e4 = false, _0xd08b2e = {}) {
    if (!_0x463a58) {
      return;
    }
    if (_0x463a58.image || _0x463a58.expression) {
      return;
    }
    const _0x3fd831 = _0x3d33e4 ? _0x357afd() : _0x21516d();
    const _0x2ac0bb = _0x3d33e4 ? _0x2484b3() : _0xf7e615();
    if (!_0x3fd831 && !_0x2ac0bb) {
      return;
    }
    _0x463a58 = {
      image: !!_0x3fd831,
      expression: !_0x3fd831 && !!_0x2ac0bb
    };
    const _0x4ac110 = _0x143edf(_0x3d33e4, _0xd08b2e);
    const _0x213f0b = _0x463a58.image ? "图片" : "表情包";
    _0x348fa4("📎 " + _0x4ac110 + "：正文为空，已强制附带" + _0x213f0b + "，避免空评论");
  }
  function _0x5adb97(_0x5d5f53 = false) {
    const _0xf885eb = [];
    if (_0x5d5f53 ? _0x1d96c2() : _0x161208()) {
      _0xf885eb.push("图片");
    }
    if (_0x5d5f53 ? _0x4840db() : _0x191ae6()) {
      _0xf885eb.push("表情包");
    }
    if (_0x44998c(_0x5d5f53)) {
      _0xf885eb.push("@账号");
    }
    if (_0xf885eb.length) {
      return _0xf885eb.join("+");
    } else {
      return "无正文内容";
    }
  }
  function _0x40e76a(_0x42b415) {
    if (!_0x42b415) {
      return;
    }
    const _0x446391 = [_0x42b415.querySelector("[scrollable=\"true\"]"), ...Array.from(_0x42b415.querySelectorAll("div")).filter(_0x44e35d => {
      const _0x3f80b4 = window.getComputedStyle(_0x44e35d);
      return (_0x3f80b4.overflowY === "auto" || _0x3f80b4.overflowY === "scroll") && _0x44e35d.scrollHeight > _0x44e35d.clientHeight + 10;
    })].filter(Boolean);
    const _0x4aabb3 = _0x446391[0];
    if (!_0x4aabb3) {
      return;
    }
    _0x4aabb3.scrollTop = Math.min(_0x4aabb3.scrollTop + 80, _0x4aabb3.scrollHeight);
    _0x4aabb3.dispatchEvent(new Event("scroll", {
      bubbles: false
    }));
  }
  function _0x2a60c8(_0x56c1a1) {
    const _0x189a0c = _0x188fe3("emojiItemCandidates");
    if (!_0x56c1a1 || !_0x189a0c) {
      return [];
    }
    try {
      return Array.from(_0x56c1a1.querySelectorAll(_0x189a0c));
    } catch (_0x103156) {
      return [];
    }
  }
  function _0x4f1d31(_0x18be5d, _0x1c3e52) {
    const _0x3eeb0f = _0x188fe3("emojiStickerClickableRoot");
    const _0x59dd11 = _0x188fe3("emojiStickerInteractiveRoot");
    if (!_0x18be5d || !_0x1c3e52 || !_0x3eeb0f || !_0x59dd11) {
      return null;
    }
    try {
      const _0x1bd872 = _0x18be5d.closest(_0x59dd11);
      const _0x20ad3a = _0x1bd872 || _0x18be5d.closest(_0x3eeb0f) || _0x18be5d;
      if (_0x1c3e52.contains(_0x20ad3a)) {
        return _0x20ad3a;
      } else {
        return null;
      }
    } catch (_0x32c041) {
      return null;
    }
  }
  function _0x2c720a(_0x2826c3, _0x311f0c) {
    const _0x3a5b88 = _0x4f1d31(_0x2826c3, _0x311f0c);
    if (!_0x2826c3 || !_0x3a5b88 || !_0x4f83d3(_0x2826c3) || !_0x4f83d3(_0x3a5b88)) {
      return {
        item: _0x2826c3,
        target: _0x3a5b88,
        visible: false,
        sticker: false,
        textEmoji: false
      };
    }
    const _0x23bbcb = _0x649ce("emojiStickerSourcePattern");
    const _0x2a53b7 = _0x649ce("emojiTextSourcePattern");
    const _0x56c3bd = _0x188fe3("emojiStickerInteractiveRoot");
    const _0x1271fb = Number(_0x20c23d("emojiStickerMinImageSide")) || 0;
    const _0x306527 = Number(_0x20c23d("emojiStickerMinFillRatio")) || 0;
    if (!_0x23bbcb || !_0x2a53b7 || !_0x56c3bd || !(_0x1271fb > 0) || !(_0x306527 > 0)) {
      return {
        item: _0x2826c3,
        target: _0x3a5b88,
        visible: true,
        sticker: false,
        textEmoji: false
      };
    }
    try {
      const _0x36d801 = _0x2826c3.getBoundingClientRect();
      const _0x1b32ce = _0x3a5b88.getBoundingClientRect();
      const _0xef547f = [_0x2826c3.getAttribute?.("src"), _0x2826c3.getAttribute?.("data-src"), _0x2826c3.getAttribute?.("style"), _0x2826c3.getAttribute?.("alt")].filter(Boolean).join(" ");
      const _0x131a7c = _0x23bbcb.test(_0xef547f);
      const _0x131d87 = _0x2a53b7.test(_0xef547f);
      const _0x31019f = Math.min(_0x36d801.width, _0x36d801.height);
      const _0x5365f8 = Math.min(_0x36d801.width / Math.max(_0x1b32ce.width, 1), _0x36d801.height / Math.max(_0x1b32ce.height, 1));
      const _0x4b00b8 = _0x3a5b88.matches?.(_0x56c3bd) || false;
      const _0x42c101 = !_0x131d87 && (_0x131a7c || _0x31019f >= _0x1271fb && _0x5365f8 >= _0x306527 && _0x4b00b8);
      return {
        item: _0x2826c3,
        target: _0x3a5b88,
        visible: true,
        sticker: _0x42c101,
        textEmoji: !_0x42c101 && (_0x131d87 || _0x31019f < _0x1271fb),
        sourceSticker: _0x131a7c,
        sourceText: _0x131d87,
        side: _0x31019f,
        fillRatio: _0x5365f8,
        explicitlyInteractive: _0x4b00b8
      };
    } catch (_0x397731) {
      return {
        item: _0x2826c3,
        target: _0x3a5b88,
        visible: true,
        sticker: false,
        textEmoji: false
      };
    }
  }
  function _0x14ed04(_0x51c0a8, _0x448857) {
    const _0x48f3aa = new Set();
    const _0x1be6ea = [];
    for (const _0x381e22 of _0x51c0a8) {
      if (!_0x448857(_0x381e22) || !_0x381e22.target || _0x48f3aa.has(_0x381e22.target)) {
        continue;
      }
      _0x48f3aa.add(_0x381e22.target);
      _0x1be6ea.push(_0x381e22.target);
    }
    return _0x1be6ea;
  }
  function _0x5a755c(_0x5f1605) {
    return _0x2a60c8(_0x5f1605).map(_0x84ffd6 => _0x2c720a(_0x84ffd6, _0x5f1605)).filter(_0x3758bd => _0x3758bd.visible);
  }
  function _0x39ec0b(_0x304c2e) {
    return _0x14ed04(_0x5a755c(_0x304c2e), _0xb9ce68 => _0xb9ce68.sticker);
  }
  function _0x6df0a2(_0x5f4d3d) {
    return _0x14ed04(_0x5a755c(_0x5f4d3d), _0x1162ff => _0x1162ff.textEmoji);
  }
  function _0x128464(_0x287b8f, _0x447167) {
    if (!_0x287b8f || !_0x4f83d3(_0x287b8f) || _0x287b8f.isConnected === false) {
      return false;
    }
    if (!_0x447167) {
      return true;
    }
    try {
      const _0x478d73 = _0x287b8f.getBoundingClientRect();
      const _0x27496c = _0x447167.getBoundingClientRect();
      const _0x2a8dc0 = Math.min(_0x478d73.bottom, _0x27496c.bottom) - Math.max(_0x478d73.top, _0x27496c.top);
      const _0x226ed8 = Math.min(_0x478d73.right, _0x27496c.right) - Math.max(_0x478d73.left, _0x27496c.left);
      return _0x2a8dc0 >= Math.min(Math.max(_0x478d73.height, 1), 36) * 0.65 && _0x226ed8 >= Math.min(Math.max(_0x478d73.width, 1), 36) * 0.65;
    } catch (_0x1024a8) {
      return false;
    }
  }
  function _0x3edb35(_0x21a1c3) {
    return _0x39ec0b(_0x21a1c3).filter(_0x31d905 => _0x128464(_0x31d905, _0x21a1c3));
  }
  function _0x298658(_0x152e98) {
    return _0x6df0a2(_0x152e98).filter(_0x269666 => _0x128464(_0x269666, _0x152e98));
  }
  function _0x46615a(_0xf0d033) {
    if (!_0xf0d033 || !_0x188fe3("emojiItemCandidates")) {
      return {
        matched: 0,
        excludedText: 0,
        visible: 0,
        clickable: []
      };
    }
    try {
      const _0x17b88e = _0x2a60c8(_0xf0d033);
      const _0x69a786 = _0x5a755c(_0xf0d033);
      const _0x31b47e = _0x14ed04(_0x69a786, _0x12db55 => _0x12db55.sticker);
      return {
        matched: _0x17b88e.length,
        excludedText: _0x69a786.filter(_0x2965ff => _0x2965ff.textEmoji).length,
        visible: _0x31b47e.length,
        clickable: _0x31b47e.filter(_0x4e47a1 => _0x128464(_0x4e47a1, _0xf0d033))
      };
    } catch (_0x1e07c4) {
      return {
        matched: 0,
        excludedText: 0,
        visible: 0,
        clickable: []
      };
    }
  }
  function _0x5da6cc(_0x357eb7) {
    const _0x2acc72 = _0x46615a(_0x357eb7);
    return "匹配=" + _0x2acc72.matched + " 排除普通表情=" + _0x2acc72.excludedText + " 可见GIF=" + _0x2acc72.visible + " 可点击GIF=" + _0x2acc72.clickable.length;
  }
  function _0x224f58(_0x303b99, _0x326be1, _0x2cc2d5, _0x9cb1db = {}) {
    const _0x230596 = _0x9cb1db.allowTextEmoji ? _0x298658(_0x303b99) : _0x3edb35(_0x303b99);
    if (_0x326be1 && _0x326be1.isConnected !== false && _0x230596.includes(_0x326be1) && _0x128464(_0x326be1, _0x303b99)) {
      return _0x326be1;
    }
    if (!_0x230596.length) {
      return null;
    }
    const _0x3bc983 = Math.min(Math.max(Number(_0x2cc2d5) || 0, 0), _0x230596.length - 1);
    return _0x230596[_0x3bc983] || _0x230596[0];
  }
  async function _0x10fc8c(_0x5b16dd, _0x220019, _0x11658a, _0x43d244 = "表情面板控件") {
    if (!_0x5b16dd || !_0x220019 || _0x5b16dd.isConnected === false || _0x220019.isConnected === false) {
      return false;
    }
    if (!_0x4f83d3(_0x5b16dd) || !_0x4f83d3(_0x220019)) {
      return false;
    }
    try {
      if (!_0x220019.contains(_0x5b16dd)) {
        return false;
      }
      const _0x4d5521 = _0x5b16dd.getBoundingClientRect();
      if (!(_0x4d5521.width > 1) || !(_0x4d5521.height > 1)) {
        return false;
      }
      const _0x56429d = _0x4d5521.left + _0x4d5521.width / 2;
      const _0x1b3c77 = _0x4d5521.top + _0x4d5521.height / 2;
      const _0x3c09f9 = document.elementFromPoint(_0x56429d, _0x1b3c77);
      if (!_0x3c09f9 || _0x3c09f9 !== _0x5b16dd && !_0x5b16dd.contains(_0x3c09f9) && !_0x3c09f9.contains(_0x5b16dd)) {
        _0x42f542(_0x43d244 + " 实时位置未命中自身，取消点击 " + ("control=" + _0x4ea7bb(_0x5b16dd) + " hit=" + _0x4ea7bb(_0x3c09f9)));
        return false;
      }
      _0x42f542(_0x43d244 + " 按实时控件点击 " + (Math.round(_0x4d5521.width) + "x" + Math.round(_0x4d5521.height)) + ("@(" + Math.round(_0x4d5521.left) + "," + Math.round(_0x4d5521.top) + ") hit=" + _0x4ea7bb(_0x3c09f9)));
    } catch (_0x3db5c0) {
      return false;
    }
    const _0x16cc2a = await _0x244deb(_0x5b16dd, _0x11658a, _0x43d244, {
      allowScrollIntoView: false,
      requireTargetHit: true,
      preferInner: "img, svg",
      waitForStableTarget: /表情包|贴纸/.test(_0x43d244),
      targetStableTimeoutMs: 2400,
      traceToRunLog: true
    });
    return !!_0x16cc2a && !_0x48fd75(_0x11658a);
  }
  function _0x379ee2(_0x3e2b07) {
    if (!_0x3e2b07 || _0x3e2b07.isConnected === false || !_0x4f83d3(_0x3e2b07)) {
      return false;
    }
    const _0x54ccc5 = String(_0x3e2b07.tagName || "").toUpperCase() === "IMG" ? _0x3e2b07 : _0x3e2b07.querySelector?.(_0x188fe3("emojiItemCandidates"));
    if (!_0x54ccc5) {
      return true;
    }
    return _0x54ccc5.complete !== false && Number(_0x54ccc5.naturalWidth || 0) > 0;
  }
  async function _0x5abfb8(_0x230565, _0x3fc2bc, _0x1e41bf, _0x51d0a2, _0x2555e8, _0x3b138f, _0x27013d = 10000) {
    const _0x2b537a = Date.now();
    let _0xf07ca6 = 0;
    let _0x69745a = null;
    let _0x59ea42 = 0;
    while (!_0x48fd75(_0x3b138f) && Date.now() - _0x2b537a < _0x27013d) {
      const _0x24f11f = _0x2b0d08(_0x230565) || _0x3fc2bc;
      if (_0x24f11f && _0x4f83d3(_0x24f11f)) {
        const _0x35dc75 = _0x224f58(_0x24f11f, _0x1e41bf, _0x51d0a2, _0x2555e8);
        const _0x136e74 = !!_0x35dc75 && !!_0x128464(_0x35dc75, _0x24f11f) && !!_0x379ee2(_0x35dc75);
        if (_0x136e74) {
          if (_0x69745a !== _0x35dc75) {
            _0x69745a = _0x35dc75;
            _0xf07ca6 = Date.now();
          } else if (Date.now() - _0xf07ca6 >= 650) {
            return {
              panel: _0x24f11f,
              item: _0x35dc75,
              waitedMs: Date.now() - _0x2b537a
            };
          }
        } else {
          _0x69745a = null;
          _0xf07ca6 = 0;
        }
      }
      if (Date.now() - _0x59ea42 >= 2800) {
        _0x59ea42 = Date.now();
        _0x4f10ba("等待收藏表情控件稳定就绪...");
      }
      await _0x3310b6(220, 380, _0x3b138f, "等待收藏表情控件稳定");
    }
    return {
      panel: _0x2b0d08(_0x230565) || _0x3fc2bc,
      item: null,
      waitedMs: Date.now() - _0x2b537a
    };
  }
  function _0xf779a9(_0x4426c0, _0x5dee3a = null) {
    if (_0x4426c0?.isConnected !== false && _0x4f83d3(_0x4426c0)) {
      return _0x4426c0;
    }
    const _0x2ae903 = [_0x188fe3("draftEditor"), "[contenteditable=\"true\"]"].filter(Boolean).join(", ");
    if (!_0x2ae903) {
      return _0x4426c0;
    }
    let _0x560bcf = [];
    try {
      _0x560bcf = Array.from(document.querySelectorAll(_0x2ae903)).filter(_0x32c0ca => _0x32c0ca.isConnected !== false && _0x4f83d3(_0x32c0ca));
    } catch (_0x5a7ad6) {
      return _0x4426c0;
    }
    if (!_0x560bcf.length) {
      return _0x4426c0;
    }
    const _0x45c4d4 = _0x5dee3a?.inputAnchor;
    if (!_0x45c4d4) {
      return _0x560bcf[0];
    }
    _0x560bcf.sort((_0x2818d0, _0x2edf69) => {
      const _0x25daf4 = _0x2818d0.getBoundingClientRect();
      const _0x1cb6e7 = _0x2edf69.getBoundingClientRect();
      const _0x24da13 = Math.hypot(_0x25daf4.left + _0x25daf4.width / 2 - _0x45c4d4.cx, _0x25daf4.top + _0x25daf4.height / 2 - _0x45c4d4.cy);
      const _0x45546a = Math.hypot(_0x1cb6e7.left + _0x1cb6e7.width / 2 - _0x45c4d4.cx, _0x1cb6e7.top + _0x1cb6e7.height / 2 - _0x45c4d4.cy);
      return _0x24da13 - _0x45546a;
    });
    return _0x560bcf[0] || _0x4426c0;
  }
  async function _0x2aef23(_0x391789, _0x46ee4e, _0x574ec3, _0x199ab9, _0x2f1cfb = 12000) {
    const _0x31b276 = Date.now();
    let _0x5ecb83 = 0;
    let _0x37eaa8 = _0x391789;
    let _0x114356 = _0x46ee4e;
    let _0x402c7a = _0x574ec3;
    while (!_0x48fd75(_0x199ab9) && Date.now() - _0x31b276 < _0x2f1cfb) {
      _0x114356 = _0xf779a9(_0x46ee4e, _0x574ec3);
      _0x402c7a = _0x2d2721(_0x114356, {
        replyMode: !!_0x574ec3?.replyMode
      });
      _0x37eaa8 = _0xb03b98(_0x114356, _0x402c7a);
      const _0x5ae18b = _0x37eaa8.payloadCount > (_0x391789?.payloadCount || 0) || _0x37eaa8.textTokenCount > (_0x391789?.textTokenCount || 0);
      if (_0x5ae18b) {
        return {
          inserted: true,
          snap: _0x37eaa8,
          inputEl: _0x114356,
          scopeInfo: _0x402c7a,
          waitedMs: Date.now() - _0x31b276
        };
      }
      if (Date.now() - _0x5ecb83 >= 3000) {
        _0x5ecb83 = Date.now();
        _0x4f10ba("已选择表情，等待输入框生成预览...");
      }
      await _0x3310b6(240, 420, _0x199ab9, "等待表情插入输入框");
    }
    return {
      inserted: false,
      snap: _0x37eaa8,
      inputEl: _0x114356,
      scopeInfo: _0x402c7a,
      waitedMs: Date.now() - _0x31b276
    };
  }
  function _0xa9c741(_0x537c91, _0x2fd27f = null) {
    const _0x479d32 = _0x2fd27f?.roots?.length ? [..._0x2fd27f.roots] : [_0xff9aef(_0x537c91)].filter(Boolean);
    if (!_0x2fd27f?.forbidGlobalFallback && !_0x479d32.includes(document.body)) {
      _0x479d32.push(document.body);
    }
    const _0xdcd387 = _0x5a4a4b => {
      if (_0x5a4a4b && _0x4f83d3(_0x5a4a4b)) {
        return _0x5a4a4b;
      }
      return null;
    };
    for (const _0x30af10 of _0x479d32) {
      if (!_0x30af10) {
        continue;
      }
      const _0x16dd8b = _0x649ce("emojiTriggerSvgPattern");
      if (_0x16dd8b) {
        const _0x136018 = Array.from(_0x30af10.querySelectorAll("svg"));
        const _0x4f86a0 = _0x136018.find(_0xc35e0d => _0x16dd8b.test(_0xc35e0d.innerHTML || ""));
        if (_0x4f86a0) {
          const _0x2d9c93 = _0x4f86a0.closest("button, span, div[role=\"button\"]") || _0x4f86a0;
          const _0x11ebb1 = _0xdcd387(_0x2d9c93);
          if (_0x11ebb1) {
            return _0x11ebb1;
          }
        }
      }
      const _0xa0b42d = typeof _0x188fe3 === "function" ? _0x188fe3("emojiTrigger") : "";
      if (_0xa0b42d) {
        let _0x28ebc5 = null;
        try {
          _0x28ebc5 = _0x30af10.querySelector(_0xa0b42d);
        } catch (_0x5ee4d3) {
          _0x28ebc5 = null;
        }
        const _0x3aa4d5 = _0xdcd387(_0x28ebc5);
        if (_0x3aa4d5) {
          return _0x3aa4d5;
        }
      }
      const _0x32a98c = _0x649ce("emojiTriggerHintRegex");
      if (_0x32a98c) {
        for (const _0x15591d of _0x30af10.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"]")) {
          const _0x55f37e = [_0x15591d.getAttribute("aria-label"), _0x15591d.getAttribute("title"), _0x15591d.textContent].filter(Boolean).join(" ");
          if (_0x32a98c.test(_0x55f37e)) {
            const _0x221852 = _0xdcd387(_0x15591d);
            if (_0x221852) {
              return _0x221852;
            }
          }
        }
      }
    }
    return null;
  }
  function _0x5ceb51(_0xb51b6c, _0x440042 = null) {
    const _0x240156 = _0x2b0d08(_0xb51b6c);
    if (!_0x240156 || !_0x4f83d3(_0x240156)) {
      return null;
    }
    const _0xfa8cd8 = _0x440042 || _0xa9c741(_0xb51b6c);
    if (_0x55cb35(_0x240156, _0xfa8cd8)) {
      return _0x240156;
    } else {
      return null;
    }
  }
  async function _0x1ae012(_0x5880ed, _0x15659b, _0x5f575e = null) {
    const _0x36490c = _0xa9c741(_0x5880ed, _0x5f575e);
    let _0x59cacf = _0x5ceb51(_0x5880ed, _0x36490c);
    if (_0x59cacf) {
      return {
        panel: _0x59cacf,
        emojiBtn: _0x36490c,
        alreadyOpen: true,
        reason: "already_open"
      };
    }
    if (!_0x36490c) {
      return {
        panel: null,
        emojiBtn: null,
        alreadyOpen: false,
        reason: "trigger_missing"
      };
    }
    const _0x4a6e14 = await _0x244deb(_0x36490c, _0x15659b, "打开评论表情面板", {
      allowScrollIntoView: false
    });
    if (!_0x4a6e14) {
      _0x59cacf = _0x5ceb51(_0x5880ed, _0x36490c);
      if (_0x59cacf) {
        return {
          panel: _0x59cacf,
          emojiBtn: _0x36490c,
          alreadyOpen: false,
          reason: "opened_after_click"
        };
      }
      return {
        panel: null,
        emojiBtn: _0x36490c,
        alreadyOpen: false,
        reason: "trigger_click_failed"
      };
    }
    for (let _0x1f8835 = 0; _0x1f8835 < 10; _0x1f8835++) {
      await _0x3310b6(220, 380, _0x15659b);
      _0x59cacf = _0x5ceb51(_0x5880ed, _0x36490c);
      if (_0x59cacf) {
        return {
          panel: _0x59cacf,
          emojiBtn: _0x36490c,
          alreadyOpen: false,
          reason: "opened_after_click"
        };
      }
    }
    _0x59cacf = _0x5ceb51(_0x5880ed, _0x36490c);
    if (!_0x59cacf && !_0x48fd75(_0x15659b)) {
      _0x42f542("表情入口可信点击无页面响应，改用页面控件点击兜底");
      await _0x576da8(_0x36490c, _0x15659b, {
        deadlineAt: Date.now() + 1800
      });
      for (let _0x3432d7 = 0; _0x3432d7 < 6; _0x3432d7++) {
        await _0x3310b6(180, 300, _0x15659b);
        _0x59cacf = _0x5ceb51(_0x5880ed, _0x36490c);
        if (_0x59cacf) {
          return {
            panel: _0x59cacf,
            emojiBtn: _0x36490c,
            alreadyOpen: false,
            reason: "opened_after_dom_fallback"
          };
        }
      }
    }
    return {
      panel: null,
      emojiBtn: _0x36490c,
      alreadyOpen: false,
      reason: "open_timeout"
    };
  }
  async function _0x264073(_0x56b09b, _0x597a22, _0x254868, _0x54e513) {
    let _0x3b135b = _0x597a22;
    let _0x438f3b = null;
    let _0x1da706 = [];
    for (let _0xa1ea52 = 0; _0xa1ea52 < 8; _0xa1ea52 += 1) {
      _0x3b135b = _0x2b0d08(_0x56b09b) || _0x3b135b;
      const _0x8a8462 = _0x5bfb03(_0x3b135b, _0x254868);
      _0x438f3b = _0x8a8462.tabContainer;
      _0x1da706 = (_0x8a8462.tabs || []).filter(_0x4355e0 => _0x4355e0 && _0x4f83d3(_0x4355e0) && !_0x14a009(_0x4355e0, _0x254868));
      if (_0x1da706.length >= 2) {
        break;
      }
      _0x42f542("表情分类栏未就绪 attempt=" + (_0xa1ea52 + 1) + "/8 tabs=" + _0x1da706.length);
      await _0x3310b6(280, 450, _0x54e513, "等待表情分类栏出现");
    }
    if (_0x1da706.length < 2) {
      return {
        panel: _0x3b135b,
        tabContainer: _0x438f3b,
        tabs: _0x1da706,
        items: [],
        checked: 0
      };
    }
    const _0x4af2b4 = Math.max(2500, Math.min(15000, Number(_0x20c23d("emojiTabProbeTimeoutMs")) || 0));
    const _0x47a9a5 = _0x1da706.map((_0x319497, _0x4148a0) => _0x4148a0).reverse();
    let _0x48325e = 0;
    for (const _0x5a971b of _0x47a9a5) {
      if (_0x48fd75(_0x54e513)) {
        break;
      }
      _0x3b135b = _0x2b0d08(_0x56b09b) || _0x3b135b;
      const _0x2bc464 = _0x5bfb03(_0x3b135b, _0x254868);
      const _0x596783 = (_0x2bc464.tabs || []).filter(_0x49a16b => _0x49a16b && _0x4f83d3(_0x49a16b) && !_0x14a009(_0x49a16b, _0x254868));
      const _0xee5a0c = _0x596783[_0x5a971b];
      if (!_0xee5a0c) {
        continue;
      }
      _0x48325e += 1;
      _0x42f542("探测表情分类 " + _0x48325e + "/" + _0x47a9a5.length + " " + ("" + (typeof _0x3a1cc0 === "function" ? _0x3a1cc0(_0xee5a0c) : _0x4ea7bb(_0xee5a0c))));
      const _0x5b7485 = await _0x10fc8c(_0xee5a0c, _0x3b135b, _0x54e513, "评论表情分类Tab");
      if (!_0x5b7485) {
        continue;
      }
      const _0x474e57 = Date.now();
      let _0x42fce6 = 0;
      while (!_0x48fd75(_0x54e513) && Date.now() - _0x474e57 < _0x4af2b4) {
        await _0x3310b6(260, 430, _0x54e513, "等待表情分类内容");
        _0x3b135b = _0x2b0d08(_0x56b09b) || _0x3b135b;
        if (!_0x3b135b || !_0x4f83d3(_0x3b135b)) {
          break;
        }
        let _0x2cfb92 = _0x3edb35(_0x3b135b);
        if (!_0x2cfb92.length && Date.now() - _0x474e57 > _0x4af2b4 * 0.45) {
          _0x40e76a(_0x3b135b);
          _0x2cfb92 = _0x3edb35(_0x3b135b);
        }
        if (_0x2cfb92.length) {
          _0x42f542("分类 " + (_0x5a971b + 1) + " 已识别贴纸控件: " + _0x2cfb92.length + " 项");
          return {
            panel: _0x3b135b,
            tabContainer: _0x2bc464.tabContainer || _0x438f3b,
            tabs: _0x596783,
            tab: _0xee5a0c,
            items: _0x2cfb92,
            checked: _0x48325e
          };
        }
        if (Date.now() - _0x42fce6 >= 2800) {
          _0x42fce6 = Date.now();
          _0x4f10ba("正在检查表情分类 (" + _0x48325e + "/" + _0x47a9a5.length + ")...");
        }
      }
      _0x42f542("分类 " + (_0x5a971b + 1) + " 未出现贴纸控件：" + _0x5da6cc(_0x3b135b));
    }
    return {
      panel: _0x3b135b,
      tabContainer: _0x438f3b,
      tabs: _0x1da706,
      items: [],
      checked: _0x48325e
    };
  }
  async function _0x1ebab7(_0xb49539, _0x3fcfae, _0x2dd165 = {}) {
    const _0x191d89 = !!_0x2dd165.isVideoComment;
    const _0x485d88 = _0x191d89 ? _0x4840db() : _0x191ae6();
    const _0x257ac2 = _0x191d89 ? _0x3debfc(_0x3dda76.currentTask?.videoCommentExpressionCount) : _0x3debfc(_0x3dda76.currentTask?.commentExpressionCount);
    if (!_0x485d88) {
      return false;
    }
    const _0x129aed = _0xd59899();
    if (_0x129aed.length) {
      const _0x2e02d4 = _0x129aed.join(", ");
      console.warn("[评论表情包] runtime-config commentV2 缺少字段: " + _0x2e02d4);
      _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：后端表情控件配置不完整（" + _0x2e02d4 + "），已取消附加", null, "warning");
      return false;
    }
    _0x42f542("开始附加 isVideoComment=" + _0x191d89 + " 轮询上限=" + _0x257ac2);
    const _0xe29460 = _0x2d2721(_0xb49539, _0x2dd165);
    try {
      const _0x2103e3 = await _0x1ae012(_0xb49539, _0x3fcfae, _0xe29460);
      let _0x3dc43d = _0x2103e3.panel;
      if (!_0x3dc43d) {
        const _0x344955 = _0x2103e3.reason === "trigger_missing";
        console.warn(_0x344955 ? "[评论表情包] 未找到表情按钮" : "[评论表情包] 表情面板超时未打开");
        _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：" + (_0x344955 ? "未找到表情按钮" : "表情面板未能打开") + "，无法附加表情包", null, "warning");
        return false;
      }
      _0x42f542(_0x2103e3.alreadyOpen ? "表情面板已打开，跳过入口点击" : "表情面板已通过入口打开");
      _0x42f542("面板就绪: " + _0x3cddf4(_0x3dc43d));
      const _0x3581d7 = !!_0x2dd165.profileFirst || !!_0x2dd165.profileVideo;
      let _0x3c3262 = false;
      let _0x135c3e = _0x3edb35(_0x3dc43d);
      if (_0x135c3e.length > 0) {
        const _0x3e956a = _0x143edf(_0x191d89, _0x2dd165);
        _0x42f542("当前分类已直接提供贴纸: " + _0x135c3e.length + " 项，无需切换分类");
        _0x348fa4("📎 " + _0x3e956a + "：表情面板已就绪（可点击 " + _0x135c3e.length + " 项），直接选择贴纸");
      } else {
        const _0xe87db2 = _0xa9c741(_0xb49539, _0xe29460);
        const _0x4f5078 = await _0x264073(_0xb49539, _0x3dc43d, _0xe87db2, _0x3fcfae);
        _0x3dc43d = _0x4f5078.panel || _0x3dc43d;
        _0x135c3e = _0x4f5078.items || [];
        if (_0x135c3e.length) {
          _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：已检查 " + _0x4f5078.checked + " 个表情分类，找到 " + _0x135c3e.length + " 个可点击贴纸");
        } else {
          const _0x456dc7 = _0x3581d7 ? _0x298658(_0x3dc43d) : [];
          if (_0x456dc7.length) {
            _0x135c3e = _0x456dc7;
            _0x3c3262 = true;
            _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：未检测到收藏贴纸，改用平台普通表情（可选 " + _0x456dc7.length + " 项）", null, "warning");
          } else {
            const _0x58cea1 = _0x5da6cc(_0x3dc43d);
            console.warn("[评论表情包] 已探测全部分类仍未找到贴纸 " + _0x58cea1 + " " + _0x3cddf4(_0x3dc43d));
            _0x270ab9(_0x3dc43d, _0xe87db2, {
              traceToRunLog: true
            });
            _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：已检查 " + _0x4f5078.checked + " 个表情分类，未识别到可点击贴纸（" + _0x58cea1 + "）", null, "warning");
            return false;
          }
        }
      }
      _0x135c3e = _0x3c3262 ? _0x298658(_0x3dc43d) : _0x3edb35(_0x3dc43d);
      if (_0x135c3e.length === 0) {
        const _0x5d20a5 = _0x5da6cc(_0x3dc43d);
        console.warn("[评论表情包] 未找到可点击的贴纸/GIF（已忽略文字表情如[泣不成声]） " + _0x5d20a5 + " " + _0x3cddf4(_0x3dc43d));
        _0x348fa4("📎 " + _0x143edf(_0x191d89, _0x2dd165) + "：无可用贴纸（" + _0x5d20a5 + "），已跳过", null, "warning");
        return false;
      }
      const _0x31289c = _0x102dc2(_0x135c3e.length, _0x257ac2, _0x191d89);
      const _0x38b770 = {
        allowTextEmoji: _0x3c3262
      };
      let _0x11e91b = _0x224f58(_0x3dc43d, _0x135c3e[_0x31289c], _0x31289c, _0x38b770);
      const _0x366ff8 = _0x143edf(_0x191d89, _0x2dd165);
      _0x42f542("点击表情项 #" + (_0x31289c + 1) + "/" + Math.min(_0x135c3e.length, _0x257ac2) + " (当前可点" + _0x135c3e.length + "项) " + (typeof _0x3a1cc0 === "function" ? _0x3a1cc0(_0x11e91b) : _0x4ea7bb(_0x11e91b)));
      for (let _0x5bf022 = 0; _0x5bf022 < 6; _0x5bf022 += 1) {
        _0x3dc43d = _0x2b0d08(_0xb49539) || _0x3dc43d;
        _0x11e91b = _0x224f58(_0x3dc43d, _0x11e91b, _0x31289c, _0x38b770);
        if (_0x11e91b && _0x128464(_0x11e91b, _0x3dc43d)) {
          break;
        }
        _0x40e76a(_0x3dc43d);
        await _0x3310b6(160, 280, _0x3fcfae, "滚动表情面板露出贴纸");
      }
      _0x3dc43d = _0x2b0d08(_0xb49539) || _0x3dc43d;
      _0x11e91b = _0x224f58(_0x3dc43d, _0x11e91b, _0x31289c, _0x38b770);
      const _0x341aa2 = await _0x5abfb8(_0xb49539, _0x3dc43d, _0x11e91b, _0x31289c, _0x38b770, _0x3fcfae, 10000);
      _0x3dc43d = _0x341aa2.panel || _0x3dc43d;
      _0x11e91b = _0x341aa2.item;
      if (!_0x11e91b) {
        _0x42f542("贴纸控件等待 " + _0x341aa2.waitedMs + "ms 后仍未稳定 " + _0x3cddf4(_0x3dc43d));
        _0x348fa4("📎 " + _0x366ff8 + "：贴纸控件未稳定就绪，已等待 " + Math.ceil(_0x341aa2.waitedMs / 1000) + " 秒", null, "warning");
        return false;
      }
      let _0x52ae67 = _0xf779a9(_0xb49539, _0xe29460);
      let _0x42d32d = _0x2d2721(_0x52ae67, {
        replyMode: !!_0xe29460?.replyMode
      });
      const _0x110359 = _0xb03b98(_0x52ae67, _0x42d32d);
      _0x42f542("即将点击贴纸 " + (typeof _0x3a1cc0 === "function" ? _0x3a1cc0(_0x11e91b) : _0x4ea7bb(_0x11e91b)));
      const _0x1bad70 = await _0x10fc8c(_0x11e91b, _0x3dc43d, _0x3fcfae, "选择评论表情包");
      if (!_0x1bad70) {
        _0x348fa4("📎 " + _0x366ff8 + "：未点到贴纸，准备重试", null, "warning");
      }
      let _0x3764fe = await _0x2aef23(_0x110359, _0x52ae67, _0x42d32d, _0x3fcfae, 12000);
      let _0xa509c3 = _0x3764fe.inserted;
      let _0x383557 = _0x3764fe.snap;
      _0x52ae67 = _0x3764fe.inputEl || _0x52ae67;
      _0x42d32d = _0x3764fe.scopeInfo || _0x42d32d;
      _0x42f542("插入校验 payload " + (_0x110359.payloadCount || 0) + "→" + (_0x383557.payloadCount || 0) + (" 普通表情 " + (_0x110359.textTokenCount || 0) + "→" + (_0x383557.textTokenCount || 0)) + (" 等待=" + _0x3764fe.waitedMs + "ms") + (" " + (_0xa509c3 ? "通过" : "失败")));
      if (!_0xa509c3) {
        const _0x3c4a92 = _0x2b0d08(_0x52ae67);
        if (_0x3c4a92 && _0x4f83d3(_0x3c4a92)) {
          const _0x415586 = await _0x5abfb8(_0x52ae67, _0x3c4a92, null, _0x31289c, _0x38b770, _0x3fcfae, 8000);
          _0x3dc43d = _0x415586.panel || _0x3c4a92;
          _0x11e91b = _0x415586.item;
        } else {
          _0x11e91b = null;
          _0x42f542("贴纸点击后面板已关闭，继续等待预览，不对失效节点补点");
        }
        if (_0x11e91b && !_0xa509c3) {
          _0x348fa4("📎 " + _0x366ff8 + "：首次点击未生效，重新解析贴纸控件后重试", null, "warning");
          const _0x26c5ed = await _0x10fc8c(_0x11e91b, _0x3dc43d, _0x3fcfae, "选择评论表情包");
          if (!_0x26c5ed) {
            _0x348fa4("📎 " + _0x366ff8 + "：重试未点到贴纸", null, "warning");
          }
          _0x3764fe = await _0x2aef23(_0x110359, _0x52ae67, _0x42d32d, _0x3fcfae, 10000);
          _0xa509c3 = _0x3764fe.inserted;
          _0x383557 = _0x3764fe.snap;
          _0x52ae67 = _0x3764fe.inputEl || _0x52ae67;
          _0x42d32d = _0x3764fe.scopeInfo || _0x42d32d;
        }
      }
      if (!_0xa509c3) {
        console.warn("[评论表情包] 表情包未插入输入框");
        _0x348fa4("📎 " + _0x366ff8 + "：表情包点击后未检测到输入框内容", null, "warning");
        return false;
      }
      if (_0x4f83d3(_0x3dc43d)) {
        const _0xd42da4 = _0xa9c741(_0xb49539, _0xe29460);
        if (_0xd42da4) {
          await _0x244deb(_0xd42da4, _0x3fcfae, "关闭评论表情面板", {
            allowScrollIntoView: false
          });
          await _0x3310b6(220, 380, _0x3fcfae);
        }
      }
      _0x42f542("附加成功");
      return true;
    } catch (_0x50bb37) {
      console.warn("[评论表情包] 附加表情包异常:", _0x50bb37.message || _0x50bb37);
      return false;
    }
  }
  function _0xff9aef(_0x5056aa) {
    const _0x1841ce = _0x188fe3("commentInputShell") || _0x188fe3("commentInputShellLoose");
    if (_0x1841ce) {
      try {
        const _0x43586b = _0x5056aa?.closest?.(_0x1841ce);
        if (_0x43586b) {
          return _0x43586b;
        }
      } catch (_0x49ed19) {}
    }
    return _0x5056aa?.closest?.("[class*=\"comment-compose\"]") || _0x5056aa?.parentElement;
  }
  function _0x2d2721(_0x32aa1c, _0xf72f35 = {}) {
    const _0x32e0f3 = _0xff9aef(_0x32aa1c);
    const _0x4840ba = (() => {
      try {
        const _0x4228c5 = _0x32aa1c?.getBoundingClientRect?.();
        if (!_0x4228c5 || !(_0x4228c5.width > 0) || !(_0x4228c5.height > 0)) {
          return null;
        }
        return {
          cx: _0x4228c5.left + _0x4228c5.width / 2,
          cy: _0x4228c5.top + _0x4228c5.height / 2,
          width: _0x4228c5.width,
          height: _0x4228c5.height
        };
      } catch (_0xd366cf) {
        return null;
      }
    })();
    if (_0xf72f35.replyMode) {
      const _0x3b163b = [];
      if (_0x32e0f3) {
        _0x3b163b.push(_0x32e0f3);
      }
      let _0x51a5f8 = _0x32aa1c;
      for (let _0x5e6dcd = 0; _0x5e6dcd < 10 && _0x51a5f8 && _0x51a5f8 !== document.body; _0x5e6dcd++) {
        if (!_0x3b163b.includes(_0x51a5f8)) {
          _0x3b163b.push(_0x51a5f8);
        }
        _0x51a5f8 = _0x51a5f8.parentElement;
      }
      return {
        replyMode: true,
        roots: _0x3b163b,
        forbidGlobalFallback: true,
        inputAnchor: _0x4840ba
      };
    }
    const _0x5396f9 = [];
    let _0x37c30f = _0x32aa1c;
    while (_0x37c30f && _0x37c30f !== document.body) {
      _0x5396f9.push(_0x37c30f);
      if (_0x32e0f3 && _0x37c30f === _0x32e0f3) {
        break;
      }
      _0x37c30f = _0x37c30f.parentElement;
    }
    if (_0x32e0f3 && !_0x5396f9.includes(_0x32e0f3)) {
      _0x5396f9.push(_0x32e0f3);
    }
    return {
      replyMode: false,
      roots: _0x5396f9,
      forbidGlobalFallback: false,
      inputAnchor: _0x4840ba
    };
  }
  function _0x33b836() {
    document.querySelectorAll("input[type=\"file\"][data-radar-comment-file-input]").forEach(_0x533725 => {
      _0x533725.removeAttribute("data-radar-comment-file-input");
    });
  }
  function _0x2ecdc2(_0x42bff6, _0x5ded71 = null) {
    const _0x4202a8 = _0x5ded71?.roots?.length ? [..._0x5ded71.roots] : [_0xff9aef(_0x42bff6)].filter(Boolean);
    if (!_0x5ded71?.forbidGlobalFallback && !_0x4202a8.includes(document.body)) {
      _0x4202a8.push(document.body);
    }
    const _0x591ca9 = [];
    for (const _0x265ab4 of _0x4202a8) {
      if (!_0x265ab4) {
        continue;
      }
      _0x591ca9.push(...Array.from(_0x265ab4.querySelectorAll("input[type=\"file\"]")));
    }
    return [...new Set(_0x591ca9)].find(_0x2ab85d => {
      if (_0x5ded71?.replyMode && _0x5ded71.roots?.length) {
        return _0x5ded71.roots.some(_0x49ac47 => _0x49ac47?.contains?.(_0x2ab85d));
      }
      return true;
    }) || null;
  }
  function _0x4e6011(_0x5fcb00, _0x4c1112) {
    _0x33b836();
    const _0x1aba34 = _0x2ecdc2(_0x5fcb00, _0x4c1112);
    if (!_0x1aba34) {
      return false;
    }
    if (_0x4c1112.replyMode && _0x4c1112.roots?.length) {
      const _0x547601 = _0x4c1112.roots.some(_0x5d7aad => _0x5d7aad?.contains?.(_0x1aba34));
      if (!_0x547601) {
        console.warn("[评论配图] 跳过 scope 外 file input（回复模式）");
        return false;
      }
    }
    _0x1aba34.setAttribute("data-radar-comment-file-input", "1");
    return true;
  }
  function _0x5cc12c(_0x4ab81b, _0x15ca08 = null) {
    const _0x111ba3 = _0x15ca08?.roots?.length ? [..._0x15ca08.roots] : [_0xff9aef(_0x4ab81b)].filter(Boolean);
    const _0x31044c = _0x2bca37("commentImageTriggers", ["[data-e2e=\"comment-image-upload\"]", "[data-e2e=\"comment-upload-image\"]", "[data-e2e=\"comment-picture-icon\"]", "[data-e2e*=\"comment\"][data-e2e*=\"image\"]", "[data-e2e*=\"comment\"][data-e2e*=\"picture\"]", "[data-e2e*=\"comment\"][data-e2e*=\"upload\"]"].join(", ")).split(",").map(_0xe53a43 => _0xe53a43.trim()).filter(Boolean);
    const _0x3141cf = [];
    const _0x4619ed = new Set();
    const _0x4c5303 = (_0x3f2558, _0x1071ab) => {
      if (!_0x3f2558 || _0x4619ed.has(_0x3f2558) || !_0x4f83d3(_0x3f2558)) {
        return;
      }
      if (_0x15ca08?.replyMode && _0x15ca08.roots?.length && !_0x15ca08.roots.some(_0x2b120d => _0x2b120d?.contains?.(_0x3f2558))) {
        return;
      }
      _0x4619ed.add(_0x3f2558);
      _0x3141cf.push({
        el: _0x3f2558,
        reason: _0x1071ab
      });
    };
    for (const _0x417eb6 of _0x111ba3) {
      for (const _0x142bdc of _0x31044c) {
        _0x417eb6.querySelectorAll(_0x142bdc).forEach(_0x5d0669 => _0x4c5303(_0x5d0669, _0x142bdc));
      }
      _0x417eb6.querySelectorAll("button, div[role=\"button\"], span[role=\"button\"], label").forEach(_0x2d96bb => {
        const _0x49795e = [_0x2d96bb.getAttribute("aria-label"), _0x2d96bb.getAttribute("title"), _0x2d96bb.textContent].filter(Boolean).join(" ");
        if (/图片|相册|上传|photo|image/i.test(_0x49795e)) {
          _0x4c5303(_0x2d96bb, "hint");
        }
      });
    }
    return _0x3141cf;
  }
  async function _0x5cb4ed(_0x4df8cb, _0x3b3e5c, _0x129ef7 = null) {
    const _0x2eb0a7 = _0x5cc12c(_0x4df8cb, _0x129ef7);
    if (!_0x2eb0a7.length) {
      return false;
    }
    for (const {
      el: _0x4fdb19,
      reason: _0x519fe5
    } of _0x2eb0a7.slice(0, 4)) {
      console.log("[评论配图] 点击入口: " + _0x519fe5);
      await _0x576da8(_0x4fdb19, _0x3b3e5c);
      await _0x3310b6(350, 700, _0x3b3e5c);
      if (_0x2ecdc2(_0x4df8cb, _0x129ef7)) {
        return true;
      }
    }
    return !!_0x2ecdc2(_0x4df8cb, _0x129ef7);
  }
  function _0x2e9f46(_0x4340ae, _0xabaf89 = null) {
    const _0xd62a9b = _0xabaf89?.roots?.length ? _0xabaf89.roots : [_0xff9aef(_0x4340ae)].filter(Boolean);
    for (const _0x3ca076 of _0xd62a9b) {
      if (!_0x3ca076) {
        continue;
      }
      const _0x218e03 = Array.from(_0x3ca076.querySelectorAll("img")).filter(_0x4b14c8 => _0x4f83d3(_0x4b14c8)).filter(_0x1ab34 => {
        const _0x456495 = _0x1ab34.getAttribute("src") || "";
        return _0x456495.startsWith("blob:") || _0x456495.startsWith("data:") || _0x456495.includes("douyin");
      });
      if (_0x218e03.length > 0) {
        return true;
      }
      if (_0x3ca076.querySelector("[class*=\"upload\"][class*=\"preview\"], [class*=\"image\"][class*=\"preview\"]")) {
        return true;
      }
    }
    return false;
  }
  async function _0x95310e(_0x1bc693, _0x92da19) {
    const _0x5d8967 = _0x3c316f(_0x92da19.base64);
    const _0x1fbf64 = new _0x295be4(_0x5d8967.length);
    for (let _0x2a5fd8 = 0; _0x2a5fd8 < _0x5d8967.length; _0x2a5fd8++) {
      _0x1fbf64[_0x2a5fd8] = _0x5d8967.charCodeAt(_0x2a5fd8);
    }
    const _0x2ccc2b = new File([_0x1fbf64], _0x92da19.name || "comment.jpg", {
      type: _0x92da19.mime || "image/jpeg"
    });
    const _0x2ad206 = new DataTransfer();
    _0x2ad206.items.add(_0x2ccc2b);
    _0x1bc693.files = _0x2ad206.files;
    _0x1bc693.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    _0x1bc693.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    return _0x2ccc2b;
  }
  async function _0xf9373(_0x16f214, _0x5cfb74) {
    if (!_0x16f214 || !_0x5cfb74) {
      return false;
    }
    _0x4b32e1(_0x16f214);
    const _0x23c768 = new DataTransfer();
    _0x23c768.items.add(_0x5cfb74);
    return _0x16f214.dispatchEvent(new _0x31b77a("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: _0x23c768
    })) !== false;
  }
  async function _0x5c4d5e(_0x4f9b05, _0x5ceb24, _0x369e02 = {}) {
    let _0x36a2ee = false;
    let _0x3dfb2b = _0x369e02.imagePath;
    let _0x18239d = [];
    let _0x3e1956 = !!_0x369e02.isVideoComment;
    if (_0x3e1956) {
      const _0x33c915 = _0x2c033a();
      _0x36a2ee = _0x33c915.enabled;
      _0x18239d = _0x33c915.paths;
      if (!_0x3dfb2b) {
        _0x3dfb2b = _0x1f4f22();
      }
    } else {
      const _0x17f28f = _0x255b36();
      _0x36a2ee = _0x17f28f.enabled;
      _0x18239d = _0x17f28f.paths;
      if (!_0x3dfb2b) {
        _0x3dfb2b = _0x26c634();
      }
    }
    if (!_0x36a2ee || !_0x3dfb2b) {
      return {
        attached: false,
        skipped: true
      };
    }
    const _0xbea0c1 = _0x2d2721(_0x4f9b05, _0x369e02);
    const _0x597272 = _0x18239d.length > 1 ? ((_0x3e1956 ? _0x3dda76.videoCommentImageRotateIndex : _0x3dda76.commentImageRotateIndex) - 1 + _0x18239d.length) % _0x18239d.length + 1 : 0;
    const _0x3d4fdb = _0x18239d.length > 1 ? " [" + _0x597272 + "/" + _0x18239d.length + "]" : "";
    console.log("%c[评论配图] 开始注入" + (_0xbea0c1.replyMode ? "（回复）" : "") + _0x3d4fdb + ": " + _0x3dfb2b, "color: #38bdf8; font-weight: bold;");
    try {
      const _0x50fd5c = await _0x21fac1.invoke("read-comment-image", _0x3dfb2b);
      if (!_0x50fd5c?.base64) {
        console.warn("[评论配图] 读取本地图片失败");
        return {
          attached: false,
          error: "read_failed"
        };
      }
      _0x4f9b05?.focus?.();
      await _0x3310b6(400, 800, _0x5ceb24);
      await _0x5cb4ed(_0x4f9b05, _0x5ceb24, _0xbea0c1);
      await _0x3310b6(300, 600, _0x5ceb24);
      _0x4e6011(_0x4f9b05, _0xbea0c1);
      const _0x4dc46b = await _0x21fac1.invoke("automation-attach-comment-image", {
        filePath: _0x3dfb2b,
        requireMarked: !!_0xbea0c1.replyMode
      });
      if (_0x4dc46b?.ok) {
        await _0x3310b6(1500, 2500, _0x5ceb24, "等待评论图片上传");
        if (_0x2e9f46(_0x4f9b05, _0xbea0c1)) {
          console.log("%c[评论配图] CDP 注入成功", "color: #22c55e; font-weight: bold;");
          _0x33b836();
          return {
            attached: true,
            method: "cdp",
            imagePath: _0x3dfb2b
          };
        }
      }
      let _0x154ba9 = _0x2ecdc2(_0x4f9b05, _0xbea0c1);
      if (!_0x154ba9) {
        await _0x5cb4ed(_0x4f9b05, _0x5ceb24, _0xbea0c1);
        await _0x1916f8(500);
        _0x154ba9 = _0x2ecdc2(_0x4f9b05, _0xbea0c1);
      }
      if (_0x154ba9) {
        _0x4e6011(_0x4f9b05, _0xbea0c1);
        const _0x1094cb = await _0x95310e(_0x154ba9, _0x50fd5c);
        await _0x3310b6(1200, 2200, _0x5ceb24, "等待评论图片上传");
        if (_0x2e9f46(_0x4f9b05, _0xbea0c1)) {
          _0x33b836();
          return {
            attached: true,
            method: "data_transfer",
            imagePath: _0x3dfb2b
          };
        }
        await _0xf9373(_0x4f9b05, _0x1094cb);
        await _0x3310b6(1200, 2000, _0x5ceb24);
        if (_0x2e9f46(_0x4f9b05, _0xbea0c1)) {
          _0x33b836();
          return {
            attached: true,
            method: "paste",
            imagePath: _0x3dfb2b
          };
        }
      }
      _0x33b836();
      console.warn("[评论配图] 未检测到图片预览，将仅发送文字");
      return {
        attached: false,
        error: "preview_not_found",
        imagePath: _0x3dfb2b
      };
    } catch (_0x299dfb) {
      _0x33b836();
      console.warn("[评论配图] 异常:", _0x299dfb.message || _0x299dfb);
      return {
        attached: false,
        error: _0x299dfb.message || "unknown"
      };
    }
  }
  async function _0x974f23(_0x537bdf, _0x2b166b, _0x1008ac) {
    if (!_0x537bdf || !_0x2b166b) {
      return;
    }
    _0x537bdf.focus?.();
    await _0x3310b6(400, 700, _0x1008ac);
    const _0x32ddd2 = (_0x537bdf.innerText || _0x537bdf.textContent || "").trim();
    const _0x20ded9 = _0x2b166b.slice(0, Math.min(8, _0x2b166b.length));
    if (_0x20ded9 && !_0x32ddd2.includes(_0x20ded9)) {
      await _0x1922ce(_0x537bdf, _0x2b166b, _0x1008ac);
      await _0x3310b6(400, 700, _0x1008ac);
    }
  }
  const _0x188cbf = [/发布评论失败/, /评论发布失败/, /无法评论/, /没有评论权限/, /不允许评论/, /关闭了评论/, /仅粉丝可评论/, /仅互关/, /发送失败/, /回复失败/, /操作太频繁/, /内容不符合.*规范/, /包含违规/, /审核未通过/, /请稍后再试/, /服务异常/, /网络异常/];
  const _0x392f62 = [/评论失败/];
  function _0x137101(_0x3f2f82) {
    if (!_0x3f2f82?.closest) {
      return false;
    }
    const _0x48eece = _0x188fe3("commentPanel") || _0x3000dc["douyin.com"]?.commentPanel;
    const _0x186159 = _0x188fe3("commentItem") || _0x3000dc["douyin.com"]?.commentItem;
    const _0xe108cb = _0x188fe3("commentInputShell");
    const _0x506005 = [_0x48eece, _0x186159, _0xe108cb, "[class*=\"comment-item\"], [class*=\"CommentList\"], [class*=\"comment-list\"]"].filter(Boolean);
    if (!_0x506005.length) {
      return false;
    }
    try {
      return !!_0x3f2f82.closest(_0x506005.join(", "));
    } catch (_0x1646d3) {
      return false;
    }
  }
  function _0x20e824(_0x37970c, _0x504358) {
    if (!_0x37970c || !_0x504358) {
      return false;
    }
    if (_0x137101(_0x37970c)) {
      return false;
    }
    if (_0x504358.length > 100) {
      return false;
    }
    if (_0x37970c.children?.length > 10) {
      return false;
    }
    const _0x240da3 = _0x504358.replace(/\s+/g, " ").trim();
    const _0x590651 = _0x188cbf.some(_0x49e5b4 => _0x49e5b4.test(_0x240da3));
    if (_0x590651) {
      return true;
    }
    const _0x433699 = _0x392f62.some(_0x42ecac => _0x42ecac.test(_0x240da3));
    if (!_0x433699) {
      return false;
    }
    const _0x51d955 = _0x37970c.closest("[class*=\"toast\"], [class*=\"Toast\"], [class*=\"notice\"], [class*=\"Notice\"], [class*=\"notification\"], [class*=\"Notification\"], [role=\"alert\"], [aria-live=\"assertive\"]");
    return !!_0x51d955 && _0x240da3.length <= 48;
  }
  function _0x251317(_0x3463ae) {
    return (_0x3463ae?.innerText || _0x3463ae?.textContent || "").replace(/\s+/g, "").trim();
  }
  function _0x2e5e12(_0x46d9b5, _0x1ab501) {
    const _0x18a676 = _0x251317(_0x46d9b5);
    const _0x510f18 = String(_0x1ab501 || "").replace(/\s+/g, "").trim();
    if (!_0x510f18 || !_0x18a676) {
      return false;
    }
    if (_0x18a676 === _0x510f18) {
      return true;
    }
    if (_0x2fb956(_0x18a676, _0x510f18)) {
      const _0x3bd113 = _0x18a676.length;
      const _0x24ebe7 = _0x510f18.length;
      if (_0x3bd113 >= Math.min(_0x24ebe7, Math.max(4, Math.floor(_0x24ebe7 * 0.5))) && _0x3bd113 <= Math.ceil(_0x24ebe7 * 1.35)) {
        return true;
      }
    }
    if (_0x17feb7(_0x18a676, _0x510f18) && _0x18a676.length >= Math.min(_0x510f18.length, Math.max(6, Math.floor(_0x510f18.length * 0.85))) && _0x18a676.length <= Math.ceil(_0x510f18.length * 1.2)) {
      return true;
    }
    return false;
  }
  async function _0x50fe49(_0x5a013b, _0x28ad81 = null) {
    if (!_0x5a013b) {
      return false;
    }
    let _0x47dac1 = _0x5a013b;
    try {
      if (_0x5a013b.getAttribute?.("contenteditable") !== "true" && String(_0x5a013b.getAttribute?.("contenteditable") || "").toLowerCase() !== "plaintext-only" && !["INPUT", "TEXTAREA"].includes(_0x5a013b.tagName)) {
        _0x47dac1 = _0x5a013b.querySelector?.("[contenteditable=\"true\"], [contenteditable=\"plaintext-only\"], textarea, input:not([type=\"file\"])") || _0x5a013b;
      }
    } catch (_0x22a91b) {}
    _0x4b32e1(_0x47dac1);
    try {
      if (_0x47dac1.tagName === "TEXTAREA" || _0x47dac1.tagName === "INPUT") {
        const _0x17c22f = _0x47dac1.ownerDocument?.defaultView || window;
        const _0x3d7507 = _0x47dac1.tagName === "TEXTAREA" ? Object.getOwnPropertyDescriptor(_0x17c22f.HTMLTextAreaElement.prototype, "value")?.set : Object.getOwnPropertyDescriptor(_0x17c22f.HTMLInputElement.prototype, "value")?.set;
        if (_0x3d7507) {
          _0x3d7507.call(_0x47dac1, "");
        } else {
          _0x47dac1.value = "";
        }
        _0x47dac1.dispatchEvent(new _0x31e73b("input", {
          bubbles: true,
          inputType: "deleteContentBackward"
        }));
        _0x47dac1.dispatchEvent(new Event("change", {
          bubbles: true
        }));
        return true;
      }
      const _0x22cf5e = _0x47dac1.ownerDocument?.defaultView || window;
      const _0x57daa7 = _0x22cf5e.getSelection?.();
      const _0x36e0c7 = document.createRange();
      _0x36e0c7.selectNodeContents(_0x47dac1);
      _0x57daa7?.removeAllRanges?.();
      _0x57daa7?.addRange?.(_0x36e0c7);
      let _0x139949 = false;
      try {
        _0x139949 = document.execCommand("delete", false);
      } catch (_0x1f4788) {}
      if (!_0x139949) {
        try {
          document.execCommand("selectAll", false);
          _0x139949 = document.execCommand("delete", false);
        } catch (_0x1f0c2d) {}
      }
      if (!_0x139949) {
        try {
          _0x47dac1.textContent = "";
        } catch (_0x18a299) {}
        try {
          _0x47dac1.innerHTML = "";
        } catch (_0x3875f0) {}
      }
      _0x47dac1.dispatchEvent(new _0x31e73b("input", {
        bubbles: true,
        inputType: "deleteContentBackward"
      }));
      if (_0x28ad81 != null) {
        await _0x3310b6(60, 120, _0x28ad81);
      }
      return true;
    } catch (_0x2366b8) {
      return false;
    }
  }
  function _0x2b6d22(_0x4e663d, _0x4f261f = null) {
    try {
      if (_0x2e9f46(_0x4e663d, _0x4f261f)) {
        return true;
      }
    } catch (_0x35c085) {}
    try {
      const _0x5b238d = _0xb03b98(_0x4e663d, _0x4f261f);
      return (_0x5b238d.payloadCount || 0) > 0 || (_0x5b238d.textTokenCount || 0) > 0;
    } catch (_0xf0294b) {}
    return false;
  }
  async function _0x1ffca1(_0x533f91, _0x3ce15e, _0x23b16a = {}, _0x45c4bd = 3) {
    for (let _0x3bcfd8 = 1; _0x3bcfd8 <= _0x45c4bd; _0x3bcfd8++) {
      const _0x1bc94f = await _0x1ebab7(_0x533f91, _0x3ce15e, _0x23b16a);
      if (_0x1bc94f) {
        return true;
      }
      if (_0x2b6d22(_0x533f91, _0x2d2721(_0x533f91, _0x23b16a))) {
        _0x42f542("附加函数未返回 true，但输入框已检测到表情内容（第 " + _0x3bcfd8 + " 次）");
        return true;
      }
      if (_0x3bcfd8 < _0x45c4bd) {
        _0x348fa4("📎 " + _0x143edf(!!_0x23b16a.isVideoComment, _0x23b16a) + "：表情包附加失败，" + (_0x3bcfd8 + 1) + "/" + _0x45c4bd + " 次重试…", null, "warning");
        await _0x3310b6(700, 1200, _0x3ce15e, "表情包附加重试");
      }
    }
    return false;
  }
  function _0x5dcd9c(_0x2768be, _0x51bed4 = "", _0x134e7f = null) {
    if (String(_0x51bed4 || "").trim()) {
      return true;
    }
    if (_0x251317(_0x2768be)) {
      return true;
    }
    return _0x2b6d22(_0x2768be, _0x134e7f);
  }
  function _0x17feb7(_0x568dbc, _0xc31a60) {
    if (_0x2fb956(_0x568dbc, _0xc31a60)) {
      return true;
    }
    const _0x6bdcdf = _0x1794c8 => (_0x1794c8 || "").replace(/\s+/g, "").trim();
    const _0x36e4d5 = _0x6bdcdf(_0x568dbc);
    const _0x381f9d = _0x6bdcdf(_0xc31a60);
    if (!_0x36e4d5 || !_0x381f9d) {
      return false;
    }
    if (_0x36e4d5.length >= 4 && _0x381f9d.includes(_0x36e4d5)) {
      return true;
    }
    if (_0x381f9d.length >= 4 && _0x36e4d5.includes(_0x381f9d)) {
      return true;
    }
    const _0x7c597e = Math.min(8, _0x36e4d5.length, _0x381f9d.length);
    return _0x7c597e >= 4 && _0x36e4d5.slice(0, _0x7c597e) === _0x381f9d.slice(0, _0x7c597e);
  }
  function _0x22f1e9() {
    const _0x107590 = new Set(["已登录(待识别)", "主账号", "默认账号", "本账号", "未知账号", "我的", "登录"]);
    const _0x170230 = [];
    const _0x42d964 = _0x9170fb => {
      const _0xc75362 = String(_0x9170fb || "").trim().replace(/\s+/g, " ");
      if (!_0xc75362 || _0xc75362.length < 2 || _0xc75362.length > 40 || _0x107590.has(_0xc75362)) {
        return;
      }
      if (!_0x170230.includes(_0xc75362)) {
        _0x170230.push(_0xc75362);
      }
    };
    try {
      _0x42d964(window._radar_account_name);
    } catch (_0x2728e2) {}
    try {
      _0x42d964(_0x3dda76.currentTask?.nickname);
    } catch (_0x58343e) {}
    try {
      _0x42d964(_0x3dda76.currentTask?.name);
    } catch (_0x3f9e10) {}
    try {
      _0x42d964(_0x3dda76.currentTask?.accountName);
    } catch (_0x592972) {}
    try {
      _0x42d964(_0x20454e());
    } catch (_0x11d658) {}
    return _0x170230[0] || "";
  }
  function _0x1f3ca2(_0x5eb286, _0x53e9f2) {
    if (!_0x5eb286) {
      return false;
    }
    if (_0x5eb286.isConnected === false) {
      try {
        const _0x5364e5 = _0x3b8434(document.body);
        if (!_0x5364e5) {
          return true;
        }
        return _0x1f3ca2(_0x5364e5, _0x53e9f2);
      } catch (_0x284668) {
        return true;
      }
    }
    const _0x1867b7 = _0x251317(_0x5eb286);
    const _0x423231 = (_0x53e9f2 || "").replace(/\s+/g, "").trim();
    if (!_0x423231) {
      return !_0x1867b7 && !_0x2b6d22(_0x5eb286);
    }
    if (!_0x1867b7) {
      return true;
    }
    if (_0x1867b7.length <= Math.max(2, Math.floor(_0x423231.length * 0.2))) {
      return true;
    }
    return !_0x17feb7(_0x1867b7, _0x423231);
  }
  function _0x2e3d12(_0x14b98f) {
    if (!_0x14b98f) {
      return;
    }
    try {
      _0x14b98f.dispatchEvent(new _0x4b72e5("pointerdown", {
        bubbles: true,
        cancelable: true
      }));
      _0x14b98f.dispatchEvent(new _0x253307("mousedown", {
        bubbles: true,
        cancelable: true
      }));
      _0x14b98f.dispatchEvent(new _0x4b72e5("pointerup", {
        bubbles: true,
        cancelable: true
      }));
      _0x14b98f.dispatchEvent(new _0x253307("mouseup", {
        bubbles: true,
        cancelable: true
      }));
      _0x14b98f.dispatchEvent(new _0x253307("click", {
        bubbles: true,
        cancelable: true
      }));
    } catch (_0x5c2b18) {}
    try {
      _0x14b98f.click?.();
    } catch (_0x5f4409) {}
  }
  async function _0x51f7af(_0x2fc786, _0x47a20b, _0x222cf1, _0x4acb44, _0x520701, _0x548e58 = {}) {
    const _0x108e37 = _0x548e58.scope || document.body;
    const _0x3c36bb = Math.max(500, Number(_0x548e58.waitMs) || 1200);
    const _0xffbff9 = _0x548e58.allowRetry !== false;
    if (!_0x2fc786 || _0x48fd75(_0x4acb44)) {
      return {
        clicked: false,
        settled: false,
        published: false
      };
    }
    const _0x7a60ce = () => {
      if (_0x1f3ca2(_0x47a20b, _0x222cf1)) {
        return true;
      }
      try {
        if (_0x51b822(_0x222cf1, _0x108e37)) {
          return true;
        }
      } catch (_0x45e4f3) {}
      return false;
    };
    try {
      _0x47a20b?.focus?.({
        preventScroll: true
      });
    } catch (_0x3885d4) {
      try {
        _0x47a20b?.focus?.();
      } catch (_0x327e9b) {}
    }
    await _0x1916f8(80);
    await _0x244deb(_0x2fc786, _0x4acb44, _0x520701);
    const _0x4ade4c = Date.now() + _0x3c36bb;
    while (Date.now() < _0x4ade4c) {
      if (_0x48fd75(_0x4acb44)) {
        break;
      }
      if (_0x7a60ce()) {
        return {
          clicked: true,
          settled: true,
          published: true
        };
      }
      await _0x1916f8(120);
    }
    if (_0x7a60ce()) {
      return {
        clicked: true,
        settled: true,
        published: true
      };
    }
    if (!_0x2e5e12(_0x47a20b, _0x222cf1)) {
      const _0x1a7610 = _0x251317(_0x47a20b);
      if (_0x241c29(_0x1a7610, _0x222cf1)) {
        _0xe12db4("草稿仅表情漂移", "核心文案仍在，继续补点");
      } else {
        _0xe12db4("跳过补点", "草稿已变化且未见失败，视为发送中/已发出");
        return {
          clicked: true,
          settled: true,
          published: false,
          softSettled: true
        };
      }
    }
    if (!_0xffbff9 || _0x48fd75(_0x4acb44)) {
      return {
        clicked: true,
        settled: false,
        published: false
      };
    }
    const _0x29fe8a = _0x299e21(_0x47a20b) || _0x2fc786;
    if (!_0x29fe8a) {
      return {
        clicked: true,
        settled: false,
        published: false
      };
    }
    _0xe12db4("发送钮补点", "等待后草稿仍在且评论区未见，补点并派发合成点击");
    await _0x244deb(_0x29fe8a, _0x4acb44, _0x520701 + "补点");
    _0x2e3d12(_0x29fe8a);
    await _0x1916f8(450);
    if (_0x7a60ce()) {
      return {
        clicked: true,
        settled: true,
        published: true
      };
    }
    if (_0x548e58.enterFallback !== false && _0x47a20b && !_0x48fd75(_0x4acb44)) {
      _0xe12db4("发送钮未清空，回车兜底");
      try {
        _0x47a20b.focus?.({
          preventScroll: true
        });
      } catch (_0x366ec4) {
        try {
          _0x47a20b.focus?.();
        } catch (_0x457987) {}
      }
      await _0x1916f8(120);
      const _0x1fe669 = await _0x44d9ae(_0x47a20b, _0x4acb44, _0x520701 + "回车兜底");
      if (!_0x1fe669) {
        try {
          const _0x3ea729 = {
            bubbles: true,
            cancelable: true,
            keyCode: 13,
            key: "Enter",
            code: "Enter"
          };
          _0x47a20b.dispatchEvent(new _0x10b67e("keydown", _0x3ea729));
          _0x47a20b.dispatchEvent(new _0x10b67e("keypress", _0x3ea729));
          _0x47a20b.dispatchEvent(new _0x10b67e("keyup", _0x3ea729));
        } catch (_0x1145f7) {}
      }
      await _0x1916f8(450);
    }
    return {
      clicked: true,
      settled: _0x7a60ce(),
      published: (() => {
        try {
          return _0x51b822(_0x222cf1, _0x108e37);
        } catch (_0x33916f) {
          return false;
        }
      })()
    };
  }
  function _0x3b8434(_0x4f6844 = document.body) {
    try {
      const _0x3a218c = _0x5f0053(_0x4f6844) || _0x4f6844 || document.body;
      const _0x410bc9 = _0x5e7a6a(_0x533f8e(), _0x55ae65(), _0x417841());
      if (!_0x410bc9 || !_0x3a218c?.querySelectorAll) {
        return null;
      }
      return Array.from(_0x3a218c.querySelectorAll(_0x410bc9)).find(_0x3a3dcf => _0x4f83d3(_0x3a3dcf)) || null;
    } catch (_0x44a141) {
      return null;
    }
  }
  function _0x51b822(_0x40e834, _0xf36184 = document.body) {
    const _0x541831 = _0x5f0053(_0xf36184) || _0xf36184 || document.body;
    const _0x319cee = _0x22f1e9();
    const _0x4792b3 = _0x5a86cc(_0x541831);
    const _0x469f41 = (_0x40e834 || "").replace(/\s+/g, "").trim().slice(0, 12);
    if (!_0x469f41) {
      return false;
    }
    const _0x5a6f89 = _0x3cdf4a => {
      for (const _0x3c1dca of _0x4792b3) {
        const _0x41295d = (_0x3c1dca.innerText || _0x3c1dca.textContent || "").replace(/\s+/g, " ").trim();
        if (!_0x41295d) {
          continue;
        }
        if (_0x3cdf4a && _0x319cee && !_0x41295d.includes(_0x319cee)) {
          continue;
        }
        if (_0x17feb7(_0x41295d, _0x40e834)) {
          return true;
        }
      }
      return false;
    };
    if (_0x5a6f89(true)) {
      return true;
    }
    if (_0x319cee && _0x469f41.length >= 8 && _0x5a6f89(false)) {
      console.log("[Built-in-Debug] [主贴评论] 评论区正文已命中，但未匹配本账号昵称，仍视为已发表");
      return true;
    }
    return false;
  }
  async function _0x1ad32e(_0x57c048, _0x419439, _0xf9d060 = document.body) {
    const _0x255912 = !!_0x57c048 && _0x57c048.isConnected !== false;
    if (_0x255912 && _0x1f3ca2(_0x57c048, _0x419439)) {
      return true;
    }
    await _0x1916f8(500);
    const _0x118d99 = !!_0x57c048 && _0x57c048.isConnected !== false;
    if (_0x118d99 && _0x1f3ca2(_0x57c048, _0x419439)) {
      return true;
    }
    if (_0x51b822(_0x419439, _0xf9d060)) {
      return true;
    }
    if (!_0x118d99) {
      const _0x33dd55 = _0x3b8434(_0xf9d060);
      if (_0x33dd55 && _0x1f3ca2(_0x33dd55, _0x419439)) {
        return true;
      }
      if (_0x51b822(_0x419439, _0xf9d060)) {
        return true;
      }
    }
    return false;
  }
  async function _0x3d613d(_0x4907fc, _0x293ca4, _0x5a18cf, _0x2e8c1d = document.body) {
    if (_0x5a18cf?.success) {
      return true;
    }
    if (!_0x5a18cf?.sendDispatched || _0x5a18cf?.failureToast) {
      return false;
    }
    return _0x1ad32e(_0x4907fc, _0x293ca4, _0x2e8c1d);
  }
  function _0x430b62() {
    const _0xbfcc20 = ["[class*=\"toast\"]", "[class*=\"Toast\"]", "[class*=\"notice\"]", "[class*=\"Notice\"]", "[class*=\"notification\"]", "[class*=\"Notification\"]", "[role=\"alert\"]", "[aria-live=\"assertive\"]", "[aria-live=\"polite\"]"];
    const _0x32a36a = [];
    for (const _0x2a8cea of _0xbfcc20) {
      try {
        _0x32a36a.push(...document.querySelectorAll(_0x2a8cea));
      } catch (_0x27c0ed) {}
    }
    const _0x3cd3b6 = Array.from(new Set(_0x32a36a));
    for (const _0x3e92af of _0x3cd3b6) {
      if (!_0x4f83d3(_0x3e92af) || !_0x5cf133(_0x3e92af, 0)) {
        continue;
      }
      const _0x284e53 = (_0x3e92af.innerText || _0x3e92af.textContent || "").replace(/\s+/g, " ").trim();
      if (!_0x284e53) {
        continue;
      }
      if (!_0x20e824(_0x3e92af, _0x284e53)) {
        continue;
      }
      const _0x1ac8f1 = [..._0x188cbf, ..._0x392f62].find(_0x4daa8f => _0x4daa8f.test(_0x284e53));
      if (_0x1ac8f1) {
        return {
          text: _0x4b67ce(_0x284e53, 80),
          pattern: _0x1ac8f1.source,
          ..._0x88a841(_0x284e53)
        };
      }
    }
    return null;
  }
  async function _0x3c0bb3(_0x2ebacf = 4500) {
    const _0x47b9d0 = Date.now() + _0x2ebacf;
    while (Date.now() < _0x47b9d0) {
      const _0x20914d = _0x430b62();
      if (_0x20914d) {
        return _0x20914d;
      }
      await _0x1916f8(180);
    }
    return null;
  }
  function _0x1945c9(_0x1d95f2, _0x552599, _0x4966bf = null) {
    const _0x455006 = _0x552599 || _0x3dda76.activeLoopId || _0x3dda76.currentTask?.taskId;
    const _0x3934f1 = _0x4b67ce(_0x1d95f2 || "发布评论失败", 80);
    const _0x3f5fde = _0x4966bf || _0x88a841(_0x1d95f2);
    if (!_0x455006 || _0x455006 === "BATCH") {
      return;
    }
    if (_0x3dda76.commentFailureStoppedTaskId === _0x455006) {
      return;
    }
    const _0x3551d1 = window._radar_account_id || _0x3dda76.currentTask?.accountId || _0x20c6e1.getItem("radar_account_id") || "default";
    const _0x78fd15 = typeof _0x455006 === "string" && _0x455006.startsWith("MONITOR");
    const _0x59562c = _0x78fd15 || _0x455006 === "SELF_WARMUP";
    if (!_0x3f5fde.stopAccount) {
      const _0x3a431b = "⚠️ 本条评论失败：" + (_0x3f5fde.label || _0x3934f1) + "（" + _0x3f5fde.code + "）。跳过本条，任务继续。";
      console.warn("[Built-in-Debug] [评论失败] " + _0x3a431b);
      _0x348fa4(_0x3a431b, _0x3551d1, "warning");
      return;
    }
    _0x3dda76.commentFailureStoppedTaskId = _0x455006;
    const _0x2c6be9 = _0x59562c ? "⚠️ 互动回复失败：" + _0x3934f1 + "。本次动作已取消，后续任务将继续。" : "⚠️ 检测到评论发布失败：" + _0x3934f1 + "。当前账号任务已停止，请稍后手动检查账号状态。";
    console.warn("[Built-in-Debug] [账号停用] " + _0x2c6be9);
    _0x348fa4(_0x2c6be9, _0x3551d1, "warning");
    if (_0x59562c) {
      return;
    }
    try {
      _0x21fac1.send("automation-data", {
        type: "current-action",
        payload: {
          accountId: _0x3551d1,
          action: "账号已停止：评论发布失败（" + _0x3934f1 + "）",
          level: "warning"
        }
      });
      _0x21fac1.send("automation-data", {
        type: "status",
        payload: {
          accountId: _0x3551d1,
          status: "finished"
        }
      });
    } catch (_0x53305f) {}
    _0x3dda76.pausedForSubview = false;
    _0x3dda76.stopRequested = true;
    _0x3dda76.taskRunning = false;
    _0x3dda76.currentRunningSource = null;
    _0x1e0bae();
    try {
      _0x21fac1.send("task-finished", _0x3fcbee(_0x455006, "comment_publish_failed"));
    } catch (_0x11e80c) {}
  }
  function _0x3ef071(_0x1138af) {
    try {
      const _0x1a88e1 = _0x188fe3("commentInput");
      const _0x49c086 = _0x1a88e1 ? Array.from(document.querySelectorAll(_0x1a88e1)).filter(_0x4f83d3) : [];
      const _0x199416 = Array.from(document.querySelectorAll("span, a, button, div[role=\"button\"]")).filter(_0x5a56b7 => _0x4f83d3(_0x5a56b7) && _0x15b8e6((_0x5a56b7.textContent || "").trim()));
      return ["viewport=" + window.innerWidth + "x" + window.innerHeight, "visibility=" + document.visibilityState, "focused=" + (document.hasFocus?.() !== false), "targetConnected=" + !!_0x1138af?.isConnected, "replyButtons=" + _0x199416.length, "inputs=" + _0x49c086.length, "active=" + (document.activeElement?.tagName || "none"), "native=" + _0x3dda76.lastTrustedClickDiagnostic].join(" ");
    } catch (_0x719a9c) {
      return "diagnostic_failed=" + _0x4b67ce(_0x719a9c?.message || _0x719a9c, 50);
    }
  }
  function _0x10181c(_0x2be64f, _0x4dd64a, _0x4189de = null, _0x276ce2 = "") {
    const _0x2dc89b = _0x3ef071(_0x4189de);
    const _0x4a7ac4 = _0x4dd64a || _0x2be64f || "回复失败";
    console.warn("[Built-in-Debug] [回复失败] code=" + _0x2be64f + " error=" + _0x4a7ac4 + " " + _0x2dc89b + (_0x276ce2 ? " detail=" + _0x276ce2 : ""));
    _0x348fa4("💬 回复失败：" + _0x4a7ac4 + (_0x276ce2 ? "（" + _0x4b67ce(_0x276ce2, 60) + "）" : ""), null, "warning");
    return {
      success: false,
      error: _0x4a7ac4,
      errorCode: _0x2be64f || "reply_failed",
      diagnostic: _0x2dc89b,
      detail: _0x276ce2 || "",
      selfLiked: false
    };
  }
  async function _0x1cfbf8(_0x276e9f, _0x21d09c, _0x44cbff, _0x36d440 = {}) {
    if (!_0x276e9f) {
      return {
        success: false,
        error: "missing_input"
      };
    }
    const _0x137187 = Date.now();
    let _0xb62e3e = false;
    const _0x33e194 = String(_0x21d09c || "");
    const _0x50da55 = _0x33e194.trim() || _0x5adb97(!!_0x36d440.isVideoComment);
    _0xe12db4("开始录入发表", "内容「" + _0x4b67ce(_0x50da55, 20) + "」");
    await _0x244deb(_0x276e9f, _0x44cbff, "主评编辑器", {
      allowScrollIntoView: false
    });
    await _0x3310b6(600, 1200, _0x44cbff);
    const _0x34dc25 = _0x2d2721(_0x276e9f, {
      replyMode: false
    });
    const _0x39da05 = _0xa9c741(_0x276e9f, _0x34dc25);
    const _0x59d7a8 = _0x5cc12c(_0x276e9f, _0x34dc25)[0]?.el;
    const _0x1def68 = {
      ..._0x34dc25,
      emojiBtnCache: _0x39da05,
      imageBtnCache: _0x59d7a8
    };
    const _0x518e4d = _0x33e194.replace(/\s+/g, "").trim();
    let _0x2be72a = !!_0x36d440.resendOnly;
    if (!_0x2be72a && _0x518e4d && _0x2e5e12(_0x276e9f, _0x33e194)) {
      _0x2be72a = true;
    }
    if (_0x2be72a) {
      _0xe12db4("跳过重录", "输入框已有目标文案，直接尝试发送");
    } else if (_0x251317(_0x276e9f)) {
      const _0x598e62 = _0x251317(_0x276e9f).length;
      _0xe12db4("清空残留草稿", "原有约 " + _0x598e62 + " 字，避免重试叠字");
      await _0x50fe49(_0x276e9f, _0x44cbff);
      await _0x3310b6(200, 400, _0x44cbff);
    }
    const _0x2e6ef4 = _0x44998c(!!_0x36d440.isVideoComment) && _0x16e341(!!_0x36d440.isVideoComment) === "before";
    const _0x5e48a2 = !!_0x36d440.attachCommentExpression && (_0x36d440.isVideoComment ? _0x4840db() : _0x191ae6());
    const _0x56ba24 = !_0x33e194.trim() && _0x5e48a2;
    if (!_0x2be72a && !_0x2e6ef4 && !_0x56ba24) {
      try {
        if (_0x39da05) {
          await _0x576da8(_0x39da05, _0x44cbff);
          await _0x3310b6(500, 900, _0x44cbff);
          _0x4b32e1(_0x276e9f);
        }
      } catch (_0x1f70b0) {}
    } else if (!_0x2be72a) {
      _0x18e724(_0x56ba24 ? "纯表情空文案：跳过录入前面板预打开，附加阶段再打开" : "正文前 @：跳过表情诱导点击，避免干扰 @ 按钮定位", true);
    }
    if (!_0x2be72a) {
      const _0x264577 = await _0x99a69c(_0x276e9f, _0x33e194, _0x44cbff, {
        isVideoComment: !!_0x36d440.isVideoComment,
        mentionPosition: _0x36d440.mentionPosition,
        replyMode: false,
        scopeInfo: _0x1def68
      });
      if (!_0x264577) {
        console.warn("[Built-in-Debug] [主贴评论] insertTextIntoEditable 失败");
        _0xe12db4("录入失败", "insertTextIntoEditable 返回 false", "warning");
        return {
          success: false,
          error: "input_failed"
        };
      }
      _0xe12db4(_0x33e194.trim() ? "文案录入完成" : "正文为空，等待附带内容", "耗时 " + ((Date.now() - _0x137187) / 1000).toFixed(1) + "s");
    }
    await _0x3310b6(800, 1200, _0x44cbff);
    const _0x37bf42 = (_0x276e9f.innerText || _0x276e9f.textContent || "").replace(/\s/g, "").trim();
    const _0x36a9b4 = _0x33e194.replace(/\s/g, "").trim();
    if (_0x36a9b4.length > 0 && _0x37bf42.length < Math.min(2, _0x36a9b4.length)) {
      console.warn("[Built-in-Debug] [主贴评论] 录入校验未通过: 期望=\"" + _0x33e194.slice(0, 24) + "\" 实际=\"" + (_0x276e9f.innerText || "").slice(0, 24) + "\"");
      _0xe12db4("录入校验未通过", "期望" + _0x36a9b4.length + "字 实际" + _0x37bf42.length + "字", "warning");
      return {
        success: false,
        error: "input_verify_failed"
      };
    }
    let _0x215f33 = false;
    let _0x33bce5 = false;
    const _0x1f233e = !!_0x36d440.attachCommentExpression && (_0x36d440.isVideoComment ? _0x4840db() : _0x191ae6());
    if (_0x36d440.attachCommentImage && (_0x36d440.isVideoComment ? _0x1d96c2() : _0x161208())) {
      const _0x1507f4 = await _0x5c4d5e(_0x276e9f, _0x44cbff, {
        replyMode: false,
        isVideoComment: !!_0x36d440.isVideoComment
      });
      _0x215f33 = !!_0x1507f4?.attached;
      if (_0x33e194.trim()) {
        await _0x974f23(_0x276e9f, _0x33e194, _0x44cbff);
      }
      await _0x3310b6(500, 900, _0x44cbff);
    }
    if (_0x1f233e) {
      const _0x29cee2 = !_0x33e194.trim();
      if (_0x29cee2) {
        _0xe12db4("开始附加表情包", "正文为空，需附带内容");
      }
      _0x4b32e1(_0x276e9f);
      await _0x3310b6(200, 400, _0x44cbff);
      const _0x34ee1d = _0x29cee2 ? 4 : 3;
      _0x33bce5 = await _0x1ffca1(_0x276e9f, _0x44cbff, {
        isVideoComment: !!_0x36d440.isVideoComment,
        replyMode: false,
        profileFirst: !!_0x36d440.profileVideo || !!_0x36d440.profileFirst,
        profileVideo: !!_0x36d440.profileVideo
      }, _0x34ee1d);
      if (!_0x33bce5 && _0x29cee2) {
        _0x33bce5 = _0x2b6d22(_0x276e9f, _0x1def68);
        if (_0x33bce5) {
          _0xe12db4("表情包校验", "附加重试后输入框已检测到表情内容");
        } else {
          _0xe12db4("表情包附加失败", "输入框仍为空，将取消发送", "warning");
        }
      } else if (_0x33bce5) {
        _0xe12db4("表情包附加成功", "");
      }
      await _0x3310b6(500, 900, _0x44cbff);
    }
    if (_0x1f233e && !_0x33bce5) {
      const _0x278198 = _0x143edf(!!_0x36d440.isVideoComment, _0x36d440);
      console.warn("[Built-in-Debug] [" + _0x278198 + "] 已选择附带表情包，但插入未确认，取消本次发送");
      _0xe12db4("取消发送", "已选择附带表情包，但输入框未确认插入；不降级为纯文字", "warning");
      return {
        success: false,
        error: "comment_expression_attach_failed",
        errorCode: "comment_expression_attach_failed"
      };
    }
    const _0x186b1c = await _0x41468(_0x276e9f, _0x44cbff, {
      isVideoComment: !!_0x36d440.isVideoComment,
      mentionPosition: _0x36d440.mentionPosition,
      replyMode: false,
      scopeInfo: _0x1def68
    });
    const _0x1a48fe = _0x5dcd9c(_0x276e9f, _0x33e194, _0x1def68) || _0x215f33 || _0x33bce5 || !!_0x186b1c?.attached;
    if (!_0x1a48fe) {
      const _0x1fa8c3 = [_0x36d440.attachCommentImage ? "图片" : "", _0x36d440.attachCommentExpression ? "表情包" : ""].filter(Boolean).join("+") || "无";
      console.warn("[Built-in-Debug] [主贴评论] 正文为空且未检测到图片/表情/@，取消发送（计划附带: " + _0x1fa8c3 + "）");
      _0xe12db4("取消发送", "正文为空且未检测到图片/表情/@（计划附带: " + _0x1fa8c3 + "）", "warning");
      return {
        success: false,
        error: "empty_comment_payload"
      };
    }
    const _0x440e56 = !!_0x36d440.profileVideo || !!_0x36d440.useReplyConfig;
    const _0x3d37a8 = _0x440e56 ? 2800 : 1200;
    await _0x1916f8(200);
    let _0x2f89f5 = _0x299e21(_0x276e9f);
    if (!_0x2f89f5) {
      await _0x1916f8(200);
      _0x2f89f5 = _0x299e21(_0x276e9f);
    }
    if (_0x2f89f5) {
      console.log("[Built-in-Debug] [主贴评论] 优先命中发送/发布图标按钮，执行点击");
      _0xe12db4("点击发送按钮");
      await _0x51f7af(_0x2f89f5, _0x276e9f, _0x33e194, _0x44cbff, "主评发送按钮", {
        scope: _0x36d440.publishScope || _0x36d440.scope || document.body,
        waitMs: _0x3d37a8
      });
    } else {
      console.log("[Built-in-Debug] [主贴评论] 未找到常规发送按钮，自动开启 Enter 键盘事件保底发送");
      _0xe12db4("尝试通用发送保底");
      const _0x1ef31c = (() => {
        try {
          return _0x276e9f.getBoundingClientRect();
        } catch (_0x217ff2) {
          return null;
        }
      })();
      const _0xe55a18 = (() => {
        try {
          const _0x4408df = Array.from(document.querySelectorAll("button, [role=\"button\"], div, span")).filter(_0x2985ec => {
            if (!_0x28774b(_0x2985ec, _0x1ef31c)) {
              return false;
            }
            const _0x4be8a8 = String(_0x2985ec.textContent || "").replace(/\s+/g, "").trim();
            return _0x5e81b5().includes(_0x4be8a8) && (_0x2985ec.children?.length || 0) <= 4;
          });
          return _0x4408df[0] || null;
        } catch (_0x160dbc) {
          return null;
        }
      })();
      if (_0xe55a18) {
        _0xe12db4("命中通用发布按钮", "文案: \"" + _0xe55a18.textContent?.trim() + "\"");
        await _0x51f7af(_0xe55a18, _0x276e9f, _0x33e194, _0x44cbff, "通用发布按钮", {
          scope: _0x36d440.publishScope || _0x36d440.scope || document.body,
          waitMs: _0x3d37a8
        });
      }
      if (!_0x1f3ca2(_0x276e9f, _0x33e194) && !_0x51b822(_0x33e194, _0x36d440.publishScope || _0x36d440.scope || document.body)) {
        _0x4b32e1(_0x276e9f);
        await _0x1916f8(150);
        const _0x34d3e3 = await _0x44d9ae(_0x276e9f, _0x44cbff, "主评编辑器");
        await _0x1916f8(450);
        if (!_0x34d3e3 && !_0x1f3ca2(_0x276e9f, _0x33e194) && !_0x51b822(_0x33e194, _0x36d440.publishScope || _0x36d440.scope || document.body)) {
          const _0x20938d = _0x299e21(_0x276e9f);
          if (_0x20938d) {
            _0xe12db4("回车未生效，改点发送图标");
            await _0x51f7af(_0x20938d, _0x276e9f, _0x33e194, _0x44cbff, "主评发送按钮(回车后)", {
              scope: _0x36d440.publishScope || _0x36d440.scope || document.body,
              allowRetry: false
            });
          } else {
            try {
              const _0x1236eb = {
                bubbles: true,
                cancelable: true,
                keyCode: 13,
                key: "Enter",
                code: "Enter"
              };
              _0x276e9f.dispatchEvent(new _0x10b67e("keydown", _0x1236eb));
              _0x276e9f.dispatchEvent(new _0x10b67e("keypress", _0x1236eb));
              _0x276e9f.dispatchEvent(new _0x10b67e("keyup", _0x1236eb));
            } catch (_0x34bd73) {}
          }
        }
      }
    }
    _0xb62e3e = true;
    _0xe12db4("已触发发送", "正在确认是否发布成功…");
    const _0x30c20c = _0x36d440.publishScope || _0x36d440.scope || document.body;
    try {
      const _0x2138f9 = await _0x3c0bb3(_0x440e56 ? 5500 : 4500);
      if (_0x2138f9) {
        const _0x4b8a1e = await _0x1ad32e(_0x276e9f, _0x33e194, _0x30c20c);
        if (_0x4b8a1e) {
          _0xe12db4("检测到提示但评论区已出现，视为发表成功", _0x4b67ce(_0x2138f9.text, 40));
          _0x348fa4("📝 视频主评：评论已发表 →「" + _0x4b67ce(_0x50da55, 32) + "」");
          return {
            success: true,
            sendDispatched: _0xb62e3e,
            verifiedDespiteToast: true
          };
        }
        const _0x5adf2c = _0x88a841(_0x2138f9.text);
        console.warn("[Built-in-Debug] [主贴评论] 检测到失败提示: " + _0x2138f9.text + " (" + _0x5adf2c.code + ")");
        _0xe12db4("检测到失败提示", _0x4b67ce(_0x2138f9.text, 40) + " → " + _0x5adf2c.label, "warning");
        _0x1945c9(_0x2138f9.text, _0x44cbff, _0x5adf2c);
        return {
          success: false,
          error: _0x2138f9.text,
          errorCode: _0x5adf2c.code,
          failureToast: _0x2138f9,
          sendDispatched: _0xb62e3e,
          stopAccount: !!_0x5adf2c.stopAccount
        };
      }
      const _0x42d044 = _0x440e56 ? 1800 + Math.floor(Math.random() * 900) : 800 + Math.floor(Math.random() * 701);
      _0xe12db4("等待评论生效 " + (_0x42d044 / 1000).toFixed(1) + "s");
      await _0x1916f8(_0x42d044);
      let _0x25bd1f = await _0x1ad32e(_0x276e9f, _0x33e194, _0x30c20c);
      if (!_0x25bd1f && _0xb62e3e) {
        const _0x134b3b = _0x440e56 ? 6 : 3;
        const _0x213434 = _0x440e56 ? 3500 : 3000;
        for (let _0x44b8f2 = 1; _0x44b8f2 <= _0x134b3b && !_0x25bd1f; _0x44b8f2 += 1) {
          _0xe12db4("发表延迟确认", "第 " + _0x44b8f2 + "/" + _0x134b3b + " 次轮询评论区（间隔 " + (_0x213434 / 1000).toFixed(1) + " 秒）…");
          await _0x1916f8(_0x213434);
          _0x25bd1f = await _0x1ad32e(_0x276e9f, _0x33e194, _0x30c20c);
        }
      }
      let _0x5aa8bf = _0x1f3ca2(_0x276e9f, _0x33e194);
      if (!_0x5aa8bf && _0x276e9f && _0x276e9f.isConnected === false) {
        const _0x1c368f = _0x3b8434(_0x30c20c);
        _0x5aa8bf = !!_0x1c368f && !!_0x1f3ca2(_0x1c368f, _0x33e194);
      }
      if (_0x25bd1f) {
        _0x348fa4("📝 视频主评：评论已发表 →「" + _0x4b67ce(_0x50da55, 32) + "」");
        return {
          success: true,
          sendDispatched: _0xb62e3e,
          verified: true
        };
      }
      if (_0xb62e3e && _0x5aa8bf) {
        _0xe12db4("容错判定", "输入框已清空且未弹出失败提示，判定为已成功发表");
        _0x348fa4("📝 视频主评：评论已提交 →「" + _0x4b67ce(_0x50da55, 32) + "」");
        return {
          success: true,
          sendDispatched: _0xb62e3e,
          verifiedInferred: true
        };
      }
      if (!_0x25bd1f && _0xb62e3e && _0x440e56 && !_0x48fd75(_0x44cbff)) {
        _0xe12db4("首作发表加长确认", "评论区可能仍在刷新，再等待一轮…");
        for (let _0xb2e377 = 1; _0xb2e377 <= 4 && !_0x25bd1f && !_0x48fd75(_0x44cbff); _0xb2e377 += 1) {
          await _0x1916f8(4000);
          _0x25bd1f = await _0x1ad32e(_0x276e9f, _0x33e194, _0x30c20c);
          _0x5aa8bf = _0x1f3ca2(_0x276e9f, _0x33e194);
          if (!_0x5aa8bf && _0x276e9f && _0x276e9f.isConnected === false) {
            const _0x4f3a1d = _0x3b8434(_0x30c20c);
            _0x5aa8bf = !!_0x4f3a1d && !!_0x1f3ca2(_0x4f3a1d, _0x33e194);
          }
          if (_0x25bd1f || _0x5aa8bf) {
            break;
          }
        }
        if (_0x25bd1f) {
          _0xe12db4("加长确认成功", "评论区已出现本条评论");
          return {
            success: true,
            sendDispatched: _0xb62e3e,
            verified: true,
            slowVerified: true
          };
        }
        if (_0x5aa8bf) {
          _0xe12db4("加长确认容错", "输入框已清空且无失败提示，按已发表处理（防双发）");
          return {
            success: true,
            sendDispatched: _0xb62e3e,
            verifiedInferred: true,
            slowVerified: true
          };
        }
        if (!_0x48fd75(_0x44cbff)) {
          _0xe12db4("加长确认防双发收口", "已触发发送且无失败提示，评论区确认偏慢，按已提交处理");
          return {
            success: true,
            sendDispatched: _0xb62e3e,
            verifiedInferred: true,
            unverifiedSoft: true,
            slowVerified: true
          };
        }
      }
      let _0x1b3f08 = 0;
      try {
        _0x1b3f08 = _0x5a86cc(_0x5f0053(_0x30c20c) || _0x30c20c).length;
      } catch (_0x3da7a6) {}
      _0xe12db4("发表待确认", "总耗时 " + ((Date.now() - _0x137187) / 1000).toFixed(1) + "s，评论区暂未确认内容" + ("（inputLive=" + (!!_0x276e9f && _0x276e9f.isConnected !== false)) + (" softCleared=" + !!_0x5aa8bf) + (" nick=" + (_0x4b67ce(_0x22f1e9(), 16) || "无")) + (" nodes=" + _0x1b3f08) + ((_0x440e56 ? " profileFirst=1" : "") + "）"), "warning");
      return {
        success: false,
        error: "publish_not_verified",
        sendDispatched: _0xb62e3e
      };
    } catch (_0x24c08c) {
      if (_0xb62e3e) {
        const _0x4a97c0 = await _0x1ad32e(_0x276e9f, _0x33e194, _0x30c20c).catch(() => false);
        if (_0x4a97c0) {
          _0xe12db4("发送后异常但评论已出现，视为成功", _0x4b67ce(_0x24c08c?.message || _0x24c08c, 40), "warning");
          return {
            success: true,
            sendDispatched: _0xb62e3e,
            recoveredAfterError: true
          };
        }
      }
      throw _0x24c08c;
    }
  }
  function _0x28774b(_0x477042, _0x1fee1f = null) {
    if (!_0x477042 || !_0x4f83d3(_0x477042)) {
      return false;
    }
    try {
      if (_0x477042.closest("header, nav, [class*=\"header\"], [class*=\"nav\"], [class*=\"danmaku\"], [class*=\"Danmaku\"]")) {
        return false;
      }
      const _0x1e11f4 = [_0x477042.getAttribute?.("data-e2e") || "", _0x477042.getAttribute?.("aria-label") || "", _0x477042.getAttribute?.("title") || "", _0x477042.className || ""].join(" ");
      if (/publish-btn|upload|header|danmaku|search-btn/i.test(_0x1e11f4)) {
        return false;
      }
      const _0x3733fc = String(_0x477042.textContent || "").replace(/\s+/g, "").trim();
      if (/发布作品|弹幕|搜索/.test(_0x3733fc)) {
        return false;
      }
      if (_0x1fee1f && _0x1fee1f.width > 0) {
        const _0x5eb8b9 = _0x477042.getBoundingClientRect();
        if (Math.abs(_0x5eb8b9.top - _0x1fee1f.top) > 160 && Math.abs(_0x5eb8b9.bottom - _0x1fee1f.bottom) > 160) {
          return false;
        }
      }
      return true;
    } catch (_0x41159d) {
      return true;
    }
  }
  function _0x299e21(_0x585c30) {
    if (!_0x585c30) {
      return null;
    }
    const _0x5c3468 = [];
    const _0x3dbd4d = _0x74cf2a => {
      if (_0x74cf2a && _0x74cf2a.querySelectorAll && !_0x5c3468.includes(_0x74cf2a) && _0x74cf2a !== document.body && _0x74cf2a !== document.documentElement) {
        _0x5c3468.push(_0x74cf2a);
      }
    };
    try {
      _0x3dbd4d(_0xff9aef(_0x585c30));
    } catch (_0x59cb42) {}
    try {
      const _0x11caf9 = _0x417841();
      if (_0x11caf9) {
        _0x3dbd4d(_0x585c30.closest(_0x11caf9));
      }
    } catch (_0x37c356) {}
    _0x3dbd4d(_0x585c30.closest("[data-e2e*=\"comment\"], [class*=\"comment-input\"], [class*=\"CommentInput\"], [class*=\"comment-compose\"], [class*=\"CommentCompose\"], form, section, [class*=\"Footer\"], [class*=\"footer\"]"));
    let _0x1125bf = _0x585c30;
    for (let _0x42cb22 = 0; _0x42cb22 < 8 && _0x1125bf && _0x1125bf !== document.body; _0x42cb22 += 1) {
      _0x3dbd4d(_0x1125bf);
      _0x1125bf = _0x1125bf.parentElement;
    }
    _0x3dbd4d(_0x585c30.closest("[class*=\"side\"], [class*=\"Modal\"], [class*=\"detail\"], [class*=\"panel\"], [class*=\"drawer\"]"));
    const _0x2d162d = (() => {
      try {
        return _0x585c30.getBoundingClientRect();
      } catch (_0x272142) {
        return null;
      }
    })();
    for (const _0x3e6ec5 of _0x5c3468) {
      try {
        const _0x21955e = _0x3e6ec5.querySelector(_0x2bca37("commentSendBtnLoose", "[data-e2e=\"comment-send-btn\"], [data-e2e=\"feed-comment-send-btn\"], [data-e2e*=\"comment-send\"], [data-e2e*=\"send-btn\"]"));
        if (_0x21955e && _0x28774b(_0x21955e, _0x2d162d)) {
          const _0x3d83cb = _0x21955e.closest("button, [role=\"button\"], div, span") || _0x21955e;
          if (_0x28774b(_0x3d83cb, _0x2d162d)) {
            console.log("[Built-in-Debug] [主贴发送钮] 命中 data-e2e: \"" + _0x21955e.getAttribute("data-e2e") + "\"");
            return _0x3d83cb;
          }
        }
      } catch (_0xd3d0fd) {}
    }
    for (const _0x5a82e4 of _0x5c3468) {
      try {
        const _0x4575a1 = Array.from(_0x5a82e4.querySelectorAll("div, span, button, p, [role=\"button\"]")).filter(_0x2d7f88 => {
          if (!_0x28774b(_0x2d7f88, _0x2d162d)) {
            return false;
          }
          const _0x4acf45 = String(_0x2d7f88.textContent || "").replace(/\s+/g, "").trim();
          if (!_0x5e81b5().includes(_0x4acf45)) {
            return false;
          }
          if ((_0x2d7f88.children?.length || 0) > 4) {
            return false;
          }
          return true;
        });
        if (_0x4575a1.length) {
          const _0x38fc59 = _0x4575a1[0];
          console.log("[Built-in-Debug] [主贴发送钮] 命中文案按钮: \"" + _0x38fc59.textContent?.trim() + "\"");
          return _0x38fc59;
        }
      } catch (_0x1d3376) {}
    }
    const _0x2baa44 = _0x4ef206 => {
      try {
        let _0x10baa7 = _0x4ef206;
        for (let _0x431e11 = 0; _0x431e11 < 3 && _0x10baa7; _0x431e11 += 1) {
          const _0x3e1334 = window.getComputedStyle(_0x10baa7).backgroundColor || "";
          const _0x497040 = _0x3e1334.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (_0x497040) {
            const _0x1397e8 = Number(_0x497040[1]);
            const _0x55fdbf = Number(_0x497040[2]);
            const _0x7ea6c7 = Number(_0x497040[3]);
            if (_0x1397e8 >= 180 && _0x1397e8 > _0x55fdbf + 40 && _0x1397e8 > _0x7ea6c7 + 20) {
              return true;
            }
          }
          _0x10baa7 = _0x10baa7.parentElement;
        }
      } catch (_0x358323) {}
      return false;
    };
    const _0x3f825e = _0x25c15b => {
      if (!_0x25c15b || String(_0x25c15b.tagName || "").toUpperCase() !== "SVG") {
        return false;
      }
      const _0x59c26f = String(_0x25c15b.getAttribute("viewBox") || "");
      const _0x5e949d = Array.from(_0x25c15b.querySelectorAll("path"));
      if (!_0x5e949d.length) {
        return false;
      }
      const _0x5b70b3 = _0x5e949d.map(_0x5839e4 => _0x5839e4.getAttribute("d") || "").join(" ");
      const _0x4112ac = _0x5e949d.map(_0x207e23 => String(_0x207e23.getAttribute("fill") || "")).join(" ").toUpperCase();
      const _0x3f8a5e = /#?FE2C55/i.test(_0x4112ac);
      const _0x46daa7 = /M17\.5\s+30/.test(_0x5b70b3) && /23\.851/.test(_0x5b70b3);
      const _0x225b5 = /M12\.34\s+16\.117/.test(_0x5b70b3) || /M12\.34/.test(_0x5b70b3);
      if (_0x3f8a5e && (_0x46daa7 || _0x225b5)) {
        return true;
      }
      if (_0x59c26f.includes("0 0 36 36") && _0x3f8a5e && _0x225b5) {
        return true;
      }
      if (_0x46daa7 && _0x225b5) {
        return true;
      }
      return false;
    };
    const _0x1c697 = _0x3fc69e => {
      if (!_0x3fc69e) {
        return false;
      }
      return _0x3fc69e.includes("M17.5 30") || _0x3fc69e.includes("M17.5 30C23.851") || _0x3fc69e.includes("M12.34 16.117") || _0x3fc69e.includes("M12.34") || _0x3fc69e.startsWith("M3.79") || _0x3fc69e.includes("M10 12") || _0x3fc69e.includes("M17.5 13") || _0x3fc69e.includes("M29 18.5");
    };
    const _0x6c1356 = _0x215ddd => {
      if (!_0x215ddd) {
        return null;
      }
      return _0x215ddd.closest("button, [role=\"button\"], [data-e2e*=\"send\"], div, span") || _0x215ddd.parentElement;
    };
    for (const _0x375447 of _0x5c3468) {
      try {
        const _0xe047ee = Array.from(_0x375447.querySelectorAll("svg"));
        for (const _0x5c2842 of _0xe047ee) {
          if (!_0x3f825e(_0x5c2842)) {
            const _0x44baf0 = Array.from(_0x5c2842.querySelectorAll("path"));
            const _0x517b8f = _0x44baf0.some(_0x19e0d1 => {
              const _0x4ee585 = _0x19e0d1.getAttribute("d") || "";
              const _0x505fe0 = String(_0x19e0d1.getAttribute("fill") || "");
              return /#?FE2C55/i.test(_0x505fe0) && _0x1c697(_0x4ee585) || /M17\.5\s+30C23\.851/.test(_0x4ee585) || /M12\.34\s+16\.117/.test(_0x4ee585);
            });
            if (!_0x517b8f) {
              continue;
            }
          }
          const _0xdbd145 = _0x6c1356(_0x5c2842);
          if (_0xdbd145 && _0x28774b(_0xdbd145, _0x2d162d)) {
            console.log("[Built-in-Debug] [主贴发送钮] 命中 #FE2C55 上箭头 SVG");
            return _0xdbd145;
          }
        }
      } catch (_0x47e3c1) {}
    }
    const _0x3349c8 = _0xc04ff1 => {
      const _0x26a390 = _0xc04ff1?.tagName === "SVG" ? _0xc04ff1 : _0xc04ff1?.querySelector?.("svg");
      if (!_0x26a390) {
        return false;
      }
      if (_0x3f825e(_0x26a390)) {
        return true;
      }
      return Array.from(_0x26a390.querySelectorAll("path")).some(_0x4563e0 => {
        const _0x34c518 = _0x4563e0.getAttribute("d") || "";
        const _0x4af117 = String(_0x4563e0.getAttribute("fill") || "");
        return _0x1c697(_0x34c518) || /#?FE2C55/i.test(_0x4af117);
      });
    };
    const _0x3fe75d = _0x59b02c => {
      if (!_0x28774b(_0x59b02c, _0x2d162d)) {
        return -_0x4e32e3;
      }
      const _0x28854f = [_0x59b02c.getAttribute?.("aria-label") || "", _0x59b02c.getAttribute?.("title") || "", _0x59b02c.getAttribute?.("data-e2e") || ""].join(" ");
      if (/弹幕|表情|图片|相册|@|mention|emoji|image/i.test(_0x28854f)) {
        return -_0x4e32e3;
      }
      const _0x6dd42d = String(_0x59b02c.innerText || _0x59b02c.textContent || "").replace(/\s+/g, "").trim();
      if (_0x6dd42d && !_0x5e81b5().includes(_0x6dd42d) && _0x6dd42d.length > 2) {
        return -_0x4e32e3;
      }
      if (/弹幕/.test(_0x6dd42d)) {
        return -_0x4e32e3;
      }
      const _0x3a9c9b = _0x59b02c.getBoundingClientRect();
      if (_0x3a9c9b.width < 18 || _0x3a9c9b.height < 18 || _0x3a9c9b.width > 72 || _0x3a9c9b.height > 72) {
        return -_0x4e32e3;
      }
      if (Math.abs(_0x3a9c9b.width - _0x3a9c9b.height) > 16) {
        return -_0x4e32e3;
      }
      const _0x291672 = _0x2baa44(_0x59b02c);
      const _0x3f12d7 = /发送|发布|发表|send|publish/i.test(_0x28854f);
      const _0xad2aaf = _0x3349c8(_0x59b02c);
      if (!_0x291672 && !_0x3f12d7 && !_0xad2aaf) {
        return -_0x4e32e3;
      }
      let _0x30e2d4 = 0;
      if (_0x3f12d7) {
        _0x30e2d4 += 120;
      }
      if (_0x291672) {
        _0x30e2d4 += 100;
      }
      if (_0xad2aaf) {
        _0x30e2d4 += 70;
      } else if (_0x59b02c.querySelector?.("svg")) {
        _0x30e2d4 += 20;
      }
      if (_0x59b02c.getAttribute?.("role") === "button" || _0x59b02c.tagName === "BUTTON") {
        _0x30e2d4 += 15;
      }
      if (_0x2d162d && _0x2d162d.width > 0) {
        if (_0x3a9c9b.left < _0x2d162d.left + _0x2d162d.width * 0.15) {
          return -_0x4e32e3;
        }
        if (_0x3a9c9b.top > _0x2d162d.bottom + 120 || _0x3a9c9b.bottom < _0x2d162d.top - 60) {
          return -_0x4e32e3;
        }
        _0x30e2d4 += Math.max(0, 40 - Math.abs(_0x3a9c9b.bottom - _0x2d162d.bottom));
        _0x30e2d4 += Math.max(0, Math.min(40, (_0x3a9c9b.left - _0x2d162d.left) / Math.max(_0x2d162d.width, 1) * 40));
      }
      return _0x30e2d4;
    };
    const _0x271397 = [];
    const _0x14a243 = new Set();
    for (const _0x1eefea of _0x5c3468) {
      let _0x148eda = [];
      try {
        _0x148eda = Array.from(_0x1eefea.querySelectorAll("button, [role=\"button\"], div, span, [class*=\"send\"], [class*=\"Send\"], [data-e2e*=\"send\"]"));
      } catch (_0x3dec63) {
        _0x148eda = [];
      }
      for (const _0xb2995e of _0x148eda) {
        const _0x5df2ce = _0xb2995e.querySelector?.("svg") ? _0xb2995e.closest("button, [role=\"button\"]") || _0xb2995e : _0xb2995e;
        if (!_0x5df2ce || _0x14a243.has(_0x5df2ce)) {
          continue;
        }
        const _0x2fcb13 = _0x3fe75d(_0x5df2ce);
        if (_0x2fcb13 > 50) {
          _0x14a243.add(_0x5df2ce);
          _0x271397.push({
            el: _0x5df2ce,
            score: _0x2fcb13
          });
        }
      }
      try {
        for (const _0x38f7e6 of _0x1eefea.querySelectorAll("svg")) {
          const _0x446627 = _0x38f7e6.closest("button, [role=\"button\"], div, span");
          if (!_0x446627 || _0x14a243.has(_0x446627)) {
            continue;
          }
          const _0x482610 = _0x3fe75d(_0x446627);
          if (_0x482610 > 50) {
            _0x14a243.add(_0x446627);
            _0x271397.push({
              el: _0x446627,
              score: _0x482610
            });
          }
        }
      } catch (_0x401943) {}
    }
    if (_0x271397.length) {
      _0x271397.sort((_0x1f9aaf, _0x5aef6d) => _0x5aef6d.score - _0x1f9aaf.score);
      const _0x335c5b = _0x271397[0];
      console.log("[Built-in-Debug] [主贴发送钮] 命中图标按钮 score=" + _0x335c5b.score.toFixed(1));
      return _0x335c5b.el;
    }
    const _0x5c3681 = _0x5c3468[0] || document;
    try {
      for (const _0x3065fb of _0x5c3681.querySelectorAll("svg path")) {
        const _0x321f5f = _0x3065fb.getAttribute("d") || "";
        if (!_0x1c697(_0x321f5f)) {
          continue;
        }
        const _0xc19ef5 = _0x3065fb.closest("div, span, button, [role=\"button\"]");
        if (_0xc19ef5 && _0x4f83d3(_0xc19ef5) && !String(_0xc19ef5.innerText || "").includes("弹幕")) {
          return _0xc19ef5;
        }
      }
    } catch (_0x161d68) {}
    return null;
  }
  function _0x4b0d7f() {
    const _0xfcdeca = _0x2bca37("userPostList", "[data-e2e=\"user-post-list\"], [data-e2e=\"user-post-container\"]");
    try {
      return document.querySelector(_0xfcdeca);
    } catch (_0x409c1e) {
      return document.querySelector("[data-e2e=\"user-post-list\"]") || document.querySelector("[data-e2e=\"user-post-container\"]");
    }
  }
  function _0x45c22() {
    if (!window.location.href.includes("/user/")) {
      return null;
    }
    const _0x15096c = _0x42f8a6 => {
      const _0x458a4a = (_0x42f8a6 || "").replace(/\s+/g, "");
      const _0x3eef33 = _0x458a4a.match(/作品[·\s]*(\d+)/) || _0x458a4a.match(/^作品(\d+)$/);
      if (_0x3eef33) {
        return parseInt(_0x3eef33[1], 10);
      }
      return null;
    };
    const _0x21cf73 = document.querySelectorAll(_0x2bca37("userTabCount", "[data-e2e=\"user-tab-count\"], [data-e2e=\"user-post-tab-count\"], [data-e2e=\"user-tab-count-post\"]"));
    for (const _0x5d0b50 of _0x21cf73) {
      if (!_0x4f83d3(_0x5d0b50)) {
        continue;
      }
      const _0x737a2a = parseInt((_0x5d0b50.innerText || "").replace(/[^\d]/g, ""), 10);
      if (!Number.isNaN(_0x737a2a)) {
        return _0x737a2a;
      }
    }
    const _0x11f7ee = Array.from(document.querySelectorAll("div, span, p, li")).filter(_0x5e07bc => _0x4f83d3(_0x5e07bc) && _0x5e07bc.children.length <= 6);
    for (const _0x45ddeb of _0x11f7ee) {
      const _0x4713e3 = (_0x45ddeb.innerText || "").trim().replace(/\s+/g, "");
      if (/^作品\d+$/.test(_0x4713e3) || /^作品[·\s]*\d+$/.test(_0x4713e3)) {
        const _0x100234 = _0x15096c(_0x4713e3);
        if (_0x100234 !== null) {
          return _0x100234;
        }
      }
    }
    const _0x337e48 = _0x11f7ee.find(_0x25d424 => (_0x25d424.innerText || "").trim() === "作品");
    if (_0x337e48) {
      const _0x164dda = _0x337e48.closest("[role=\"tablist\"]") || _0x337e48.parentElement;
      if (_0x164dda) {
        const _0x34aa39 = _0x15096c(_0x164dda.innerText || "");
        if (_0x34aa39 !== null) {
          return _0x34aa39;
        }
        const _0x478de2 = _0x164dda.querySelectorAll("div, span, p");
        for (const _0x34b257 of _0x478de2) {
          const _0x16feff = (_0x34b257.innerText || "").trim();
          if (/^\d+$/.test(_0x16feff)) {
            return parseInt(_0x16feff, 10);
          }
        }
      }
    }
    const _0x21e187 = Array.from(document.querySelectorAll("div, span, p")).filter(_0xac1f73 => _0x4f83d3(_0xac1f73) && (_0xac1f73.innerText || "").includes("作品"));
    for (const _0x530872 of _0x21e187.slice(0, 12)) {
      const _0x300e5d = (_0x530872.innerText || "").split("\n").map(_0x175ed3 => _0x175ed3.trim()).filter(Boolean);
      const _0x2713d0 = _0x300e5d.findIndex(_0x356c61 => _0x356c61 === "作品" || /^作品\d+$/.test(_0x356c61.replace(/\s+/g, "")));
      if (_0x2713d0 >= 0) {
        const _0x4c216a = _0x300e5d[_0x2713d0].replace(/\s+/g, "");
        const _0x1dafc7 = _0x15096c(_0x4c216a);
        if (_0x1dafc7 !== null) {
          return _0x1dafc7;
        }
        const _0x24e691 = _0x300e5d[_0x2713d0 + 1];
        if (_0x24e691 && /^\d+$/.test(_0x24e691)) {
          return parseInt(_0x24e691, 10);
        }
      }
    }
    return null;
  }
  function _0xbcfa1b() {
    const _0x1361ad = _0x4b0d7f();
    const _0x547dfa = [_0x1361ad?.innerText, document.querySelector("main")?.innerText, document.body?.innerText].filter(Boolean).join("\n").slice(0, 8000);
    return /暂无作品|还没有发布作品|还没有发布过|暂未发布作品|Ta还没有发布|TA还没有发布|该用户还未发布|没有更多作品|暂无内容/.test(_0x547dfa);
  }
  function _0x21f0c9(_0x375b30 = "") {
    const _0x3b3e3e = String(_0x375b30 || "").trim();
    const _0xe8a55c = {
      tab_count_zero: "该用户主页作品数为 0，没有可评论的首作",
      empty_state: "该用户主页显示暂无作品，没有可评论的首作",
      empty_grid: "该用户主页作品列表为空，没有可评论的首作",
      empty_state_late: "等待后仍显示暂无作品，没有可评论的首作",
      timeout_empty: "等待作品区加载超时且未发现公开作品，没有可评论的首作",
      no_video_cards: "该用户主页未找到可打开的作品卡片，没有可评论的首作",
      no_works: "该用户主页未发布公开作品，没有可评论的首作"
    };
    return _0xe8a55c[_0x3b3e3e] || "该用户主页未发布公开作品，没有可评论的首作";
  }
  function _0x804bb2(_0xac2489 = "") {
    const _0x41ab51 = String(_0xac2489 || "").trim();
    const _0x518f48 = {
      timeout_unknown: "用户主页作品区加载超时，尚未确认是否有公开作品（可重试）",
      aborted: "等待作品区加载时任务已停止",
      unknown: "用户主页作品区尚未加载完成，暂时无法评论首作（可重试）"
    };
    return _0x518f48[_0x41ab51] || "用户主页作品区未就绪，暂时无法评论首作（可重试）";
  }
  function _0x4c911e(_0x22d3be = 10000, _0x304fba = 20000) {
    const _0x4d2b3b = Math.max(0, Number(_0x22d3be) || 10000);
    const _0x400908 = Math.max(_0x4d2b3b, Number(_0x304fba) || 20000);
    return _0x4d2b3b + Math.floor(Math.random() * (_0x400908 - _0x4d2b3b + 1));
  }
  function _0x9f04d1() {
    try {
      const _0x41eeec = String(document.body?.innerText || "").slice(0, 2400);
      if (/加载中|正在加载|请稍候|稍后再试|网络不太顺畅|刷新一下|内容加载失败|服务器打瞌睡/.test(_0x41eeec)) {
        return true;
      }
      const _0xbc313f = String(window.location.href || "");
      if (!/\/user\//i.test(_0xbc313f)) {
        return false;
      }
      if (_0x5d3794({
        ignoreNoWorksGuard: true
      }).length > 0) {
        return false;
      }
      return !_0x58166a().noWorks;
    } catch (_0x4a5776) {
      return false;
    }
  }
  function _0x26234d(_0x490646 = "") {
    try {
      const _0x58d960 = String(document.body?.innerText || "").slice(0, 2000);
      if (/加载中|正在加载|请稍候|网络不太顺畅|刷新一下/.test(_0x58d960)) {
        return true;
      }
      const _0xde6ad1 = String(window.location.href || "");
      if (_0x490646 && _0xde6ad1.includes(String(_0x490646))) {
        return true;
      }
      return /\/(?:video|note)\//i.test(_0xde6ad1) || /modal_id=/i.test(_0xde6ad1);
    } catch (_0x402819) {
      return false;
    }
  }
  function _0x19ac8f() {
    try {
      const _0x185f63 = String(window.location.href || "");
      if (!_0x185f63 || _0x185f63 === "about:blank") {
        return true;
      }
      const _0x4eec34 = String(document.body?.innerText || "").trim();
      if (_0x4eec34.length < 8) {
        return true;
      }
      if (/无法访问此网站|dns_probe_finished|err_name_not_resolved|err_connection|err_timed_out|err_aborted|net::err_/i.test(_0x4eec34) && _0x4eec34.length < 800) {
        return true;
      }
      return false;
    } catch (_0x10ca12) {
      return true;
    }
  }
  async function _0xf07032(_0x299fc6, _0x1ed662 = "页面未就绪") {
    if (_0x19ac8f()) {
      _0x26b07b(_0x1ed662 + "：页面空白或网络异常，跳过原地等待，交由上层决定是否重载");
      return 0;
    }
    const _0x4dcfca = _0x4c911e();
    _0x26b07b(_0x1ed662 + "，先原地停留 " + (_0x4dcfca / 1000).toFixed(1) + " 秒再试一次（不重载页面）");
    const _0x32898c = Date.now() + _0x4dcfca;
    while (Date.now() < _0x32898c) {
      if (_0x48fd75(_0x299fc6)) {
        return 0;
      }
      await _0x1916f8(Math.min(400, Math.max(0, _0x32898c - Date.now())));
    }
    return _0x4dcfca;
  }
  function _0x58166a() {
    const _0xc1a92 = _0x45c22();
    if (_0xc1a92 === 0) {
      return {
        noWorks: true,
        worksCount: 0,
        reason: "tab_count_zero"
      };
    }
    if (_0xbcfa1b()) {
      return {
        noWorks: true,
        worksCount: 0,
        reason: "empty_state"
      };
    }
    const _0x3981f0 = _0x4b0d7f();
    if (_0x3981f0 && _0x4f83d3(_0x3981f0)) {
      const _0x311170 = _0x3981f0.querySelectorAll("[data-e2e=\"user-post-item\"], [role=\"listitem\"], a[href*=\"/video/\"], a[href*=\"/note/\"]");
      const _0x58b2ff = Array.from(_0x311170).filter(_0x384007 => {
        if (!_0x4f83d3(_0x384007)) {
          return false;
        }
        const _0x11bc3f = _0x384007.getBoundingClientRect();
        return _0x11bc3f.width >= 60 && _0x11bc3f.height >= 60;
      });
      if (_0x58b2ff.length === 0 && _0xc1a92 === 0) {
        return {
          noWorks: true,
          worksCount: 0,
          reason: "empty_grid"
        };
      }
    }
    if (_0xc1a92 !== null && _0xc1a92 > 0) {
      return {
        noWorks: false,
        worksCount: _0xc1a92
      };
    }
    return {
      noWorks: false,
      worksCount: _0xc1a92
    };
  }
  async function _0x45b254(_0x1d06f4, _0x58aec9 = 14000) {
    await _0x249fcb(_0x1d06f4);
    const _0x3bf12b = Date.now();
    while (Date.now() - _0x3bf12b < _0x58aec9) {
      if (_0x48fd75(_0x1d06f4)) {
        return {
          ready: false,
          noWorks: false
        };
      }
      const _0x56d5d8 = _0x58166a();
      if (_0x56d5d8.noWorks) {
        return {
          ready: true,
          noWorks: true,
          worksCount: 0,
          reason: _0x56d5d8.reason
        };
      }
      const _0x519d8d = _0x5d3794({
        ignoreNoWorksGuard: true
      });
      if (_0x519d8d.length > 0) {
        const _0x7fb364 = _0x45c22();
        return {
          ready: true,
          noWorks: false,
          worksCount: _0x7fb364 ?? _0x519d8d.length
        };
      }
      if (Date.now() - _0x3bf12b > 3500 && _0xbcfa1b()) {
        return {
          ready: true,
          noWorks: true,
          worksCount: 0,
          reason: "empty_state_late"
        };
      }
      await _0x1916f8(500);
    }
    const _0x22aeec = _0x58166a();
    if (_0x22aeec.noWorks) {
      return {
        ready: true,
        noWorks: true,
        worksCount: 0,
        reason: _0x22aeec.reason || "timeout_empty"
      };
    }
    const _0x4da2b6 = _0x5d3794({
      ignoreNoWorksGuard: true
    });
    if (_0x4da2b6.length > 0) {
      return {
        ready: true,
        noWorks: false,
        worksCount: _0x45c22() ?? _0x4da2b6.length,
        reason: "timeout_has_cards"
      };
    }
    return {
      ready: false,
      noWorks: false,
      worksCount: null,
      reason: "timeout_unknown"
    };
  }
  function _0x5d3794(_0x18359e = {}) {
    if (!_0x18359e.ignoreNoWorksGuard) {
      const _0x585303 = _0x58166a();
      if (_0x585303.noWorks) {
        return [];
      }
    }
    const _0x480a5f = _0x4b0d7f();
    let _0x47efe9 = [];
    if (_0x480a5f) {
      _0x47efe9 = Array.from(_0x480a5f.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]")).filter(_0x55258e => {
        if (!_0x4f83d3(_0x55258e)) {
          return false;
        }
        const _0x20a71e = _0x55258e.getBoundingClientRect();
        return _0x20a71e.width >= 60 && _0x20a71e.height >= 60;
      });
    }
    if (_0x47efe9.length === 0) {
      _0x47efe9 = Array.from(document.querySelectorAll("[data-e2e=\"user-post-list\"] [role=\"listitem\"], [data-e2e=\"user-post-item\"]")).filter(_0x24dfe8 => _0x4f83d3(_0x24dfe8));
    }
    if (_0x47efe9.length === 0) {
      const _0x51e749 = document.querySelector("main") || document.body;
      _0x47efe9 = Array.from(_0x51e749.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"]")).filter(_0x2e607e => {
        if (!_0x4f83d3(_0x2e607e)) {
          return false;
        }
        if (_0x2e607e.closest("[data-e2e=\"comment-list\"], [class*=\"comment\"], [data-e2e=\"searchbar\"]")) {
          return false;
        }
        const _0x2d5a6f = _0x2e607e.getBoundingClientRect();
        return _0x2d5a6f.width >= 90 && _0x2d5a6f.height >= 90;
      });
    }
    const _0x569ddf = new Set();
    return _0x47efe9.filter(_0x2888c6 => {
      const _0x117c15 = _0x2888c6.href || _0x2888c6.getAttribute("href") || _0x2888c6.outerHTML?.slice(0, 80);
      if (_0x569ddf.has(_0x117c15)) {
        return false;
      }
      _0x569ddf.add(_0x117c15);
      return true;
    });
  }
  async function _0x249fcb(_0x26668b) {
    const _0xf396dd = Array.from(document.querySelectorAll("div, span, p")).filter(_0x1a22c1 => {
      if (!_0x4f83d3(_0x1a22c1) || _0x1a22c1.children.length > 6) {
        return false;
      }
      const _0x394338 = (_0x1a22c1.innerText || "").trim().replace(/\s+/g, "");
      return _0x394338 === "作品" || /^作品\d+$/.test(_0x394338);
    });
    if (_0xf396dd.length === 0) {
      return;
    }
    const _0x4639ae = _0xf396dd.find(_0x302024 => (_0x302024.innerText || "").trim() === "作品") || _0xf396dd[0];
    const _0x39e7ef = _0xf396dd.find(_0x459062 => _0x459062.className.includes("active") || _0x459062.getAttribute("aria-selected") === "true");
    if (!_0x39e7ef || _0x39e7ef !== _0x4639ae) {
      await _0x244deb(_0x4639ae, _0x26668b, "切换主页作品页签");
      await _0x1916f8(1200);
    }
  }
  function _0x26e0f7(_0x537383, _0x542f96 = {}) {
    return {
      lead: {
        nickname: _0x537383.nickname,
        leadId: _0x537383.leadId,
        title: _0x537383.title || _0x537383.videoTitle || _0x3dda76.currentTask?.videoTitle || "",
        videoTitle: _0x537383.videoTitle || _0x537383.title || _0x3dda76.currentTask?.videoTitle || "",
        content: _0x537383.content || "",
        timeText: _0x537383.timeText || _0x537383.commentTime || "",
        commentTime: _0x537383.commentTime || _0x537383.timeText || "",
        userUrl: _0x537383.userUrl || "",
        url: _0x537383.url || _0x537383.videoUrl || "",
        videoUrl: _0x537383.videoUrl || _0x537383.url || "",
        accountId: _0x537383.accountId || _0x3dda76.currentTask?.accountId || "default",
        accountName: _0x537383.accountName || window._radar_account_name || _0x3dda76.currentTask?.nickname || _0x3dda76.currentTask?.name || "默认账号",
        location: _0x537383.location || _0x537383.ipLocation || "",
        ipLocation: _0x537383.ipLocation || _0x537383.location || "",
        signature: _0x537383.signature || "",
        contact: _0x537383.contact || "",
        douyinId: _0x537383.douyinId || "",
        gender: _0x537383.gender || "",
        age: _0x537383.age,
        worksCount: _0x537383.worksCount,
        isHighIntention: !!_0x537383.isHighIntention,
        aiThought: _0x537383.aiThought || "",
        aiAnalysis: _0x537383.aiAnalysis || "",
        thought: _0x537383.thought || "",
        actions: {
          ...(_0x537383.actions || {})
        },
        touchCounts: {
          ...(_0x537383.touchCounts || {})
        },
        touchLog: Array.isArray(_0x537383.touchLog) ? _0x537383.touchLog.map(_0x44bb8f => ({
          ..._0x44bb8f
        })) : [],
        lastTouchAt: _0x537383.lastTouchAt,
        profileCommentAt: _0x537383.profileCommentAt
      },
      platform: _0x3dda76.currentTask?.platform || window._radar_platform || "douyin",
      taskId: _0x3dda76.currentTask?.taskId || _0x3dda76.activeLoopId,
      parentTaskId: _0x3dda76.currentTask?.parentTaskId || _0x3dda76.currentTask?.taskId || _0x3dda76.activeLoopId,
      taskMode: _0x3dda76.currentTask?.taskMode,
      keywords: _0x3dda76.currentTask?.keywords,
      enableCommentKeywordFilter: !!_0x3dda76.currentTask?.enableCommentKeywordFilter,
      intentionKeywords: _0x3dda76.currentTask?.intentionKeywords,
      excludeCommentKeywords: _0x3dda76.currentTask?.excludeCommentKeywords,
      accountId: _0x3dda76.currentTask?.accountId,
      nickname: _0x3dda76.currentTask?.nickname,
      name: _0x3dda76.currentTask?.name,
      taskName: _0x3dda76.currentTask?.taskName,
      isFree: !!_0x3dda76.currentTask?.isFree,
      isTrial: !!_0x3dda76.currentTask?.isTrial,
      authInfo: _0x3dda76.currentTask?.authInfo,
      dmContent: _0x3dda76.currentTask?.dmContent,
      genderFilter: _0x3f3074(_0x3dda76.currentTask),
      targetGender: _0x3dda76.currentTask?.targetGender,
      profileFirstGenderFilter: _0x733ad7(_0x3dda76.currentTask),
      profileFirstAgeFilterEnabled: _0x3dda76.currentTask?.profileFirstAgeFilterEnabled === true,
      profileFirstAgeMin: _0x3dda76.currentTask?.profileFirstAgeMin,
      profileFirstAgeMax: _0x3dda76.currentTask?.profileFirstAgeMax,
      ageFilterEnabled: _0x3dda76.currentTask?.ageFilterEnabled ?? _0x3dda76.currentTask?.batchConfig?.ageFilterEnabled,
      ageMin: _0x3dda76.currentTask?.ageMin ?? _0x3dda76.currentTask?.targetAgeMin,
      ageMax: _0x3dda76.currentTask?.ageMax ?? _0x3dda76.currentTask?.targetAgeMax,
      targetAgeMin: _0x3dda76.currentTask?.targetAgeMin,
      targetAgeMax: _0x3dda76.currentTask?.targetAgeMax,
      enableWarmup: _0x3dda76.currentTask?.enableWarmup,
      enableComment: _0x3dda76.currentTask?.enableComment,
      followDmDelayMin: _0x3dda76.currentTask?.followDmDelayMin,
      followDmDelayMax: _0x3dda76.currentTask?.followDmDelayMax,
      videoCommentMode: _0x3dda76.currentTask?.videoCommentMode,
      videoCommentContent: _0x3dda76.currentTask?.videoCommentContent,
      videoCommentUseRandomSuffix: !!_0x3dda76.currentTask?.videoCommentUseRandomSuffix,
      aiReplyMode: !!_0x3dda76.currentTask?.aiReplyMode,
      aiRole: _0x3dda76.currentTask?.aiRole,
      aiGoal: _0x3dda76.currentTask?.aiGoal,
      aiStyle: _0x3dda76.currentTask?.aiStyle,
      aiPrompt: _0x3dda76.currentTask?.aiPrompt,
      commentContent: _0x3dda76.currentTask?.commentContent,
      commentUseRandomSuffix: !!_0x3dda76.currentTask?.commentUseRandomSuffix,
      commentOnProfileFirstWork: !!_0x3dda76.currentTask?.commentOnProfileFirstWork,
      profileFirstCommentFallbackMode: _0x3dda76.currentTask?.profileFirstCommentFallbackMode || "reply",
      profileFirstWorkLikePercent: _0x581744(_0x3dda76.currentTask?.profileFirstWorkLikePercent, 10),
      profileFirstWorkCollectPercent: _0x581744(_0x3dda76.currentTask?.profileFirstWorkCollectPercent, 10),
      profileFirstCommentUseAi: !!_0x3dda76.currentTask?.aiReplyMode,
      batchProfileCommentUseAi: !!_0x3dda76.currentTask?.batchProfileCommentUseAi,
      enableCommentMention: _0x3dda76.currentTask?.enableCommentMention,
      commentMentionNicknames: _0x3dda76.currentTask?.commentMentionNicknames,
      commentMentionPosition: _0x3dda76.currentTask?.commentMentionPosition,
      commentMentionPercent: _0x3bfb34(false),
      enableVideoCommentMention: _0x3dda76.currentTask?.enableVideoCommentMention,
      videoCommentMentionNicknames: _0x3dda76.currentTask?.videoCommentMentionNicknames,
      videoCommentMentionPosition: _0x3dda76.currentTask?.videoCommentMentionPosition,
      videoCommentMentionPercent: _0x3bfb34(true),
      enableCommentExpression: _0x3dda76.currentTask?.enableCommentExpression,
      commentExpressionCount: _0x3dda76.currentTask?.commentExpressionCount,
      enableCommentImage: _0x3dda76.currentTask?.enableCommentImage,
      commentImagePaths: _0x3dda76.currentTask?.commentImagePaths,
      commentImagePath: _0x3dda76.currentTask?.commentImagePath,
      enableVideoCommentExpression: _0x3dda76.currentTask?.enableVideoCommentExpression,
      videoCommentExpressionCount: _0x3dda76.currentTask?.videoCommentExpressionCount,
      enableVideoCommentImage: _0x3dda76.currentTask?.enableVideoCommentImage,
      videoCommentImagePaths: _0x3dda76.currentTask?.videoCommentImagePaths,
      enableVideoComment: _0x3dda76.currentTask?.enableVideoComment,
      enableCommentWithoutText: !!_0x3dda76.currentTask?.enableCommentWithoutText,
      enableVideoCommentWithoutText: !!_0x3dda76.currentTask?.enableVideoCommentWithoutText,
      commentAttachmentPercent: _0x3dda76.currentTask?.commentAttachmentPercent,
      videoCommentAttachmentPercent: _0x3dda76.currentTask?.videoCommentAttachmentPercent,
      ..._0x542f96
    };
  }
  function _0x36a4d8(_0x5998a7) {
    if (!_0x5998a7) {
      return false;
    }
    return !!_0x5998a7.aiReplyMode || !!_0x5998a7.profileFirstCommentUseAi || !!_0x5998a7.batchProfileCommentUseAi && !!_0x5998a7.aiRole || !!_0x5998a7.batchConfig?.profileCommentUseAi && !!_0x5998a7.aiRole;
  }
  function _0x3ffc57(_0x326917 = {}) {
    if (_0x326917.forceTemplateOnly) {
      return false;
    }
    if (_0x326917.forceAi || _0x326917.profileAiMode) {
      return true;
    }
    const _0x333707 = _0x326917.templateText != null ? String(_0x326917.templateText).trim() : "";
    if (_0x333707) {
      return false;
    }
    if (!_0x326917.useReplyConfig) {
      return _0x3dda76.currentTask?.videoCommentMode === "ai";
    }
    return !!_0x4d23b8(_0x3dda76.currentTask) || _0x3dda76.currentTask?.videoCommentMode === "ai" || !!_0x36a4d8(_0x3dda76.currentTask);
  }
  async function _0x37f706(_0x4dc0be, _0x4d4351, _0x309878 = {}) {
    const _0x4d5ac2 = !!_0x309878.useReplyConfig;
    const _0x1a4489 = _0x3ffc57(_0x309878);
    const _0x2b6b56 = _0x309878.templateText != null;
    const _0x31c506 = _0x2b6b56 ? String(_0x309878.templateText) : _0x4d5ac2 ? (_0x3dda76.currentTask?.commentContent || "").trim() || (_0x3dda76.currentTask?.videoCommentContent || "").trim() : _0x3dda76.currentTask?.videoCommentContent || "";
    const _0x2f8f4e = _0x2b6b56 ? _0x31c506.split("\n").some(_0x56dacb => _0x56dacb.trim()) : _0x4d5ac2 ? _0x4c70a6() : _0x1b31ba();
    if (_0x4d5ac2) {
      _0x26b07b("解析文案：模式=" + (_0x1a4489 ? "AI智能体" : "固定模板") + "（forceAi=" + !!_0x309878.forceAi + "，forceTpl=" + !!_0x309878.forceTemplateOnly + "，aiReplyMode=" + !!_0x3dda76.currentTask?.aiReplyMode + "）");
    }
    if (_0x1a4489) {
      const _0x461937 = _0x4d5ac2 ? !!_0x3dda76.currentTask?.enableCommentWithoutText : !!_0x3dda76.currentTask?.enableVideoCommentWithoutText;
      if (_0x461937 && !_0x2f8f4e) {
        if (_0x4d5ac2) {
          _0x26b07b("已开启不发文字，跳过 AI 文案生成，仅发送图片/表情/@ 提及");
        } else {
          _0x348fa4("📝 视频主评：已开启不发文字，跳过 AI 文案生成，仅发送图片/表情/@");
        }
        return "";
      }
      if (_0x48fd75(_0x4d4351)) {
        return null;
      }
      const _0x56cbc4 = String(_0x309878.prefetchedCommentText || "").trim();
      if (_0x56cbc4) {
        if (_0x4d5ac2) {
          _0x26b07b("复用提前生成文案 →「" + _0x4b67ce(_0x56cbc4, 32) + "」");
        } else {
          _0x348fa4("🤖 视频主评：复用预筛文案 →「" + _0x4b67ce(_0x56cbc4, 32) + "」");
        }
        return _0x340bf0(_0x56cbc4, _0x4d5ac2 ? "profile" : "comment");
      }
      _0x348fa4("🤖 视频主评：正在生成…");
      _0x39f4d7(_0x4d5ac2 ? "profile-first-ai" : "video-comment-ai", 360000);
      const _0x18d2b6 = Date.now();
      const _0x282f32 = _0x277753();
      try {
        const _0x41c43a = Array.isArray(_0x309878.commentSamples) ? _0x309878.commentSamples.filter(Boolean).slice(0, 8) : [];
        const _0x371261 = Math.floor(Math.random() * 1500) + 150;
        await _0x1916f8(_0x371261);
        if (_0x48fd75(_0x4d4351) || _0x4d4351 === "SUBVIEW_TASK" && _0x3a826d(_0x282f32)) {
          _0x348fa4("🤖 视频主评：任务已停止");
          return null;
        }
        const _0x14dcd2 = await _0x21fac1.invoke("ai-generate-video-comment", _0x325f98({
          videoTitle: (_0x4dc0be || "").trim() || "未知视频",
          comments: _0x41c43a,
          generationMode: _0x4d5ac2 ? "profile_first_comment" : "main_post_comment",
          config: {
            aiRole: _0x3dda76.currentTask.aiRole,
            aiGoal: _0x3dda76.currentTask.aiGoal,
            aiStyle: _0x3dda76.currentTask.aiStyle,
            aiPrompt: _0x3dda76.currentTask.aiPrompt,
            firstPostGoal: _0x3dda76.currentTask.firstPostGoal,
            firstPostStyle: _0x3dda76.currentTask.firstPostStyle,
            firstPostPrompt: _0x3dda76.currentTask.firstPostPrompt,
            videoGoal: _0x3dda76.currentTask.videoGoal,
            videoStyle: _0x3dda76.currentTask.videoStyle,
            videoPrompt: _0x3dda76.currentTask.videoPrompt
          }
        }));
        if (_0x48fd75(_0x4d4351) || _0x37fdb0(_0x14dcd2) || _0x4d4351 === "SUBVIEW_TASK" && _0x3a826d(_0x282f32)) {
          _0x348fa4("🤖 视频主评：任务已停止");
          return null;
        }
        _0x39f4d7(_0x4d5ac2 ? "profile-first-ai-done" : "video-comment-ai-done", 180000);
        const _0x166f23 = ((Date.now() - _0x18d2b6) / 1000).toFixed(1);
        if (_0x14dcd2?.success && (_0x14dcd2.content || "").trim()) {
          const _0x1dd566 = _0x14dcd2.content.trim();
          console.log("%c[视频主评-AI] 已生成评论: \"" + _0x1dd566 + "\"", "color: #a78bfa; font-weight: bold;");
          _0x348fa4("🤖 视频主评：生成成功（" + _0x166f23 + " 秒）→「" + _0x4b67ce(_0x1dd566, 32) + "」");
          return _0x340bf0(_0x1dd566, _0x4d5ac2 ? "profile" : "comment");
        }
        const _0x1fbcec = _0x14dcd2?.msg || "未知原因";
        console.warn("%c[视频主评-AI] 未能生成评论: " + _0x1fbcec, "color: #f97316;");
        _0x348fa4("🤖 视频主评：生成失败（" + _0x166f23 + " 秒），已跳过");
        return null;
      } catch (_0x5001c5) {
        const _0x1d2a45 = ((Date.now() - _0x18d2b6) / 1000).toFixed(1);
        console.warn("[视频主评-AI] 调用异常:", _0x5001c5.message || _0x5001c5);
        _0x348fa4("🤖 视频主评：生成失败（" + _0x1d2a45 + " 秒），已跳过");
        return null;
      }
    }
    const _0x1a4e07 = _0x31c506.split("\n").filter(_0x4f8921 => _0x4f8921.trim());
    const _0x2dfa6c = _0x4d5ac2 ? !!_0x3dda76.currentTask?.enableCommentWithoutText : !!_0x3dda76.currentTask?.enableVideoCommentWithoutText;
    if (_0x309878.allowEmptyText && _0x2dfa6c) {
      if (_0x4d5ac2) {
        _0x26b07b("已开启不发文字，跳过模板/AI 文案");
      } else {
        _0x348fa4("📝 视频主评：已开启不发文字，跳过模板文案");
      }
      return "";
    }
    if (!_0x1a4e07.length) {
      if (_0x4d5ac2) {
        if (_0x3dda76.currentTask?.enableCommentWithoutText) {
          _0x26b07b("正文为空，将仅发送图片/表情/@ 提及");
          return "";
        }
        console.warn("[主贴评论] 无可用模板文案，跳过（智能体模式下不使用「赞同」等兜底）");
        _0x26b07b("无可用模板文案，已跳过（不使用「赞同」等兜底）");
        return null;
      }
      if (_0x309878.allowEmptyText) {
        return "";
      }
      if (_0x2b6b56 || _0x4d5ac2) {
        console.warn("[主贴评论] 无可用模板文案，跳过（智能体模式下不使用「赞同」等兜底）");
        _0x26b07b("无可用模板文案，已跳过（不使用「赞同」等兜底）");
        return null;
      }
      return "好评支持！";
    }
    const _0x135c05 = _0x1a4e07[Math.floor(Math.random() * _0x1a4e07.length)];
    let _0x228e12 = _0x135c05;
    if (_0x4d5ac2) {
      _0x26b07b("使用固定模板 →「" + _0x4b67ce(_0x135c05, 32) + "」");
      if (_0xf64af7(_0x3dda76.currentTask)) {
        _0x228e12 = _0x30a6e2(_0x135c05);
        _0x26b07b("本地回复模板已加随机表情");
      }
    } else if (_0x9d7920(_0x3dda76.currentTask)) {
      _0x228e12 = _0x30a6e2(_0x135c05);
      _0x348fa4("📝 视频主评：自定义模板已加随机表情");
    }
    const _0x187768 = _0x383d16(_0x228e12);
    if (_0x187768.replaced) {
      _0x228e12 = _0x187768.text;
      const _0x48c6b4 = "装饰表情已改为中文标记（" + _0x4b67ce(_0x187768.labels, 24) + "）";
      if (_0x4d5ac2) {
        _0x26b07b(_0x48c6b4);
      } else {
        _0x348fa4("📝 视频主评：" + _0x48c6b4, null, "warning");
      }
    }
    return _0x228e12;
  }
  function _0x581744(_0x5dd9e8, _0x16ef7f = 0) {
    const _0x3efc3a = Number(_0x5dd9e8);
    if (!Number.isFinite(_0x3efc3a)) {
      return Math.max(0, Math.min(100, Math.round(Number(_0x16ef7f) || 0)));
    }
    return Math.max(0, Math.min(100, Math.round(_0x3efc3a)));
  }
  function _0x22195d() {
    const _0xb92305 = _0x3dda76.currentTask;
    if (!_0xb92305) {
      return false;
    }
    return !!_0xb92305.commentOnProfileFirstWork || !!_0xb92305.canCommentFirstWork || _0xb92305.batchConfig?.type === "profile_first_comment";
  }
  function _0x46b9ef() {
    if (!_0x22195d()) {
      return false;
    }
    const _0x4a2da2 = _0x581744(_0x3dda76.currentTask?.profileFirstWorkLikePercent, 10);
    if (_0x4a2da2 <= 0) {
      return false;
    }
    return Math.random() * 100 < _0x4a2da2;
  }
  function _0x4d901c() {
    if (!_0x22195d()) {
      return false;
    }
    const _0x2f0ffd = _0x581744(_0x3dda76.currentTask?.profileFirstWorkCollectPercent, 10);
    if (_0x2f0ffd <= 0) {
      return false;
    }
    return Math.random() * 100 < _0x2f0ffd;
  }
  function _0x1c65fc() {
    return {
      simulateHumanClick: _0x576da8,
      randomDelay: _0x3310b6,
      isVisibleElement: _0x4f83d3,
      getDouyinFeedScope: _0x524493,
      resolveDouyinVideoDetailModal: _0xa37be7,
      getVideoEngagePack: _0x386e40,
      reportTraceLog: _0x4fd648 => {
        _0x26b07b(String(_0x4fd648 || ""));
      }
    };
  }
  async function _0x1c0541(_0x6573c1, _0x526aeb) {
    try {
      const _0x46d6a7 = _0x526aeb?.nickname || "用户";
      _0x4f10ba("随机对 [" + _0x46d6a7 + "] 的首个作品点赞...");
      const _0x538842 = await likeCurrentVideoSideAction(_0x6573c1, _0x1c65fc());
      if (!_0x538842) {
        console.warn("[主页首作评论] 作品点赞未成功（未找到可见按钮或点击失败）");
        _0x26b07b("@" + _0x46d6a7 + " 首作点赞未成功", _0x526aeb?.accountId);
        return false;
      }
      console.log("%c[主页首作评论] 已按概率对作品点赞", "color: #ec4899; font-weight: bold;");
      _0x26b07b("@" + _0x46d6a7 + " 已对首个作品执行点赞", _0x526aeb?.accountId);
      return true;
    } catch (_0x2ecdce) {
      console.warn("[主页首作评论] 作品点赞失败:", _0x2ecdce.message || _0x2ecdce);
      return false;
    }
  }
  async function _0x365524(_0x237d48, _0x29849c) {
    try {
      const _0x2737ba = _0x29849c?.nickname || "用户";
      _0x4f10ba("随机对 [" + _0x2737ba + "] 的首个作品收藏...");
      const _0x47b467 = await collectCurrentVideoSideAction(_0x237d48, _0x1c65fc());
      if (!_0x47b467) {
        console.warn("[主页首作评论] 作品收藏未成功（未找到可见按钮或点击失败）");
        _0x26b07b("@" + _0x2737ba + " 首作收藏未成功", _0x29849c?.accountId);
        return false;
      }
      console.log("%c[主页首作评论] 已按概率对作品收藏", "color: #f59e0b; font-weight: bold;");
      _0x26b07b("@" + _0x2737ba + " 已对首个作品执行收藏", _0x29849c?.accountId);
      return true;
    } catch (_0x266890) {
      console.warn("[主页首作评论] 作品收藏失败:", _0x266890.message || _0x266890);
      return false;
    }
  }
  async function _0x4899f3(_0x1e242f, _0x36903f, _0x165a62 = {}) {
    try {
      await _0x33703f(_0x36903f);
    } catch (_0xf69709) {}
    try {
      const _0x22aff9 = _0x165a62.resumeState?.phase === "video_detail" ? _0x165a62.resumeState : null;
      let _0x572854 = Number(_0x22aff9?.worksCount ?? 0);
      let _0x11dbe9 = null;
      let _0x3e6a97 = String(_0x22aff9?.videoId || "").trim();
      if (_0x22aff9) {
        _0x26b07b("@" + _0x1e242f.nickname + " 已恢复作品详情，继续准备评论（videoId=" + (_0x22aff9.videoId || "?") + "）", _0x1e242f.accountId);
        _0x11dbe9 = await _0x1f5555(_0x36903f, _0x22aff9.videoId || "", {
          maxWaitMs: 15000,
          interactionId: _0x22aff9.interactionId || _0x3dda76.currentTask?.interactionId
        });
        if (!_0x11dbe9 && !_0x48fd75(_0x36903f)) {
          const _0x357fab = _0x26234d(_0x22aff9.videoId || "");
          _0x26b07b("@" + _0x1e242f.nickname + " 详情续跑首次未就绪（" + _0x4b67ce(_0x3dda76.lastProfileVideoDetailDiagnostic, 120) + "）" + ((_0x357fab ? "，路由/加载态仍像目标详情" : "") + "，原地再等一轮"), _0x1e242f.accountId);
          await _0xf07032(_0x36903f, "@" + _0x1e242f.nickname + " 作品详情未挂载");
          if (!_0x48fd75(_0x36903f)) {
            _0x11dbe9 = await _0x1f5555(_0x36903f, _0x22aff9.videoId || "", {
              maxWaitMs: 24000,
              interactionId: _0x22aff9.interactionId || _0x3dda76.currentTask?.interactionId
            });
          }
        }
        if (!_0x11dbe9) {
          if (_0x22aff9.videoId && _0x22aff9.openMode !== "direct") {
            const _0x507e5b = {
              ..._0x22aff9,
              openMode: "direct",
              navigationAttempt: Math.max(2, Number(_0x22aff9.navigationAttempt || 1) + 1),
              createdAt: Date.now()
            };
            const _0x9359ca = _0x488dcd(_0x3dda76.currentTask, {
              __profileFirstResume: _0x507e5b
            });
            if (_0x9359ca) {
              _0x26b07b("@" + _0x1e242f.nickname + " 精选详情未挂载，改用 /video/ 播放页继续（" + _0x4b67ce(_0x3dda76.lastProfileVideoDetailDiagnostic, 120) + "）", _0x1e242f.accountId);
              window.location.href = _0x4f9983(_0x22aff9.videoId);
              return await new Promise(() => {});
            }
          }
          _0x26b07b("@" + _0x1e242f.nickname + " 详情续跑未就绪（" + _0x4b67ce(_0x3dda76.lastProfileVideoDetailDiagnostic, 180) + "）", _0x1e242f.accountId);
          return {
            success: false,
            error: "作品详情续跑未就绪（可重试）",
            errorCode: "profile_video_detail_resume_failed",
            diagnostic: _0x3dda76.lastProfileVideoDetailDiagnostic || "resume_timeout",
            worksCount: _0x572854
          };
        }
      } else {
        let _0x5b28cc = await _0x45b254(_0x36903f);
        if (!_0x5b28cc.ready && !_0x48fd75(_0x36903f)) {
          const _0x3cfc1c = _0x9f04d1();
          _0x26b07b("@" + _0x1e242f.nickname + " 作品区首次探测未就绪（" + (_0x5b28cc.reason || "unknown") + "）" + ((_0x3cfc1c ? "，主页仍像加载中" : "") + "，原地再等一轮"), _0x1e242f.accountId);
          await _0xf07032(_0x36903f, "@" + _0x1e242f.nickname + " 作品区未就绪");
          if (!_0x48fd75(_0x36903f) && !_0x19ac8f()) {
            const _0x46908d = await _0x45b254(_0x36903f, 20000);
            if (_0x46908d.ready) {
              _0x5b28cc = _0x46908d;
            }
          }
        }
        const _0x39dd7a = (_0x3dda76.currentTask?.profileFirstCommentFallbackMode || "reply") === "skip" ? "将按仅首作评论模式跳过回复" : "将回退为回复评论";
        if (!_0x5b28cc.ready) {
          const _0x383bd5 = _0x804bb2(_0x5b28cc.reason || "unknown");
          _0x26b07b("@" + _0x1e242f.nickname + " " + _0x383bd5 + "（" + (_0x5b28cc.reason || "unknown") + "）", _0x1e242f.accountId);
          return {
            success: false,
            error: _0x383bd5,
            errorCode: "profile_works_not_ready",
            diagnostic: _0x5b28cc.reason || "timeout_unknown",
            worksCount: null
          };
        }
        if (_0x5b28cc.noWorks) {
          const _0x1c1ad1 = _0x21f0c9(_0x5b28cc.reason);
          console.log("%c[主页首作评论] " + _0x1e242f.nickname + " 作品数=0（" + (_0x5b28cc.reason || "no_works") + "），" + _0x39dd7a, "color: #94a3b8; font-style: italic;");
          _0x26b07b("@" + _0x1e242f.nickname + " " + _0x1c1ad1, _0x1e242f.accountId);
          return {
            success: false,
            noWorks: true,
            worksCount: 0,
            error: _0x1c1ad1,
            errorCode: "no_works",
            diagnostic: _0x5b28cc.reason || "no_works"
          };
        }
        const _0x28bae8 = _0x5d3794();
        if (_0x28bae8.length === 0) {
          const _0x1539e3 = _0x45c22();
          const _0x14f42b = _0x21f0c9("no_video_cards");
          console.log("%c[主页首作评论] " + _0x1e242f.nickname + " 未找到作品卡片（解析作品数=" + (_0x1539e3 ?? "未知") + "），" + _0x39dd7a, "color: #94a3b8; font-style: italic;");
          _0x26b07b("@" + _0x1e242f.nickname + " " + _0x14f42b, _0x1e242f.accountId);
          return {
            success: false,
            noWorks: true,
            worksCount: _0x1539e3 ?? 0,
            error: _0x14f42b,
            errorCode: "no_works",
            diagnostic: "no_video_cards"
          };
        }
        _0x572854 = _0x5b28cc.worksCount ?? _0x45c22() ?? _0x28bae8.length;
        console.log("%c[主页首作评论] " + _0x1e242f.nickname + " 检测到 " + _0x572854 + " 个作品，准备评论首个", "color: #a78bfa; font-style: italic;");
        const _0x29f984 = _0x28bae8[0];
        const _0xf1d147 = _0x29f984?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? _0x29f984 : _0x29f984?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") || _0x29f984;
        const _0x49a130 = _0xf1d147?.href || _0xf1d147?.getAttribute?.("href") || "";
        let _0x5b62f6 = _0xef320c(_0x49a130) || _0x4ff88b(_0x49a130);
        _0x3e6a97 = String(_0x5b62f6 || "").trim();
        _0x4f10ba("正在打开 [" + _0x1e242f.nickname + "] 的首个作品...");
        _0x26b07b("@" + _0x1e242f.nickname + " 正在打开首个作品（共 " + _0x572854 + " 个，DOM/React 点击，videoId=" + (_0x5b62f6 || "待路由识别") + "）", _0x1e242f.accountId);
        try {
          window.focus?.();
        } catch (_0x172796) {}
        try {
          const _0x4dbe59 = !!window.__radar_monitor_interaction || !!_0x3dda76.currentTask?.isMonitorAction;
          if (_0x3dda76.currentViewKey && !_0x4dbe59) {
            _0x21fac1.send("focus-automation-view", {
              viewKey: _0x3dda76.currentViewKey,
              bringToFront: true
            });
            await _0x21fac1.invoke("ensure-background-automation-layout", {
              viewKey: _0x3dda76.currentViewKey,
              claimInteractionSlot: true,
              requireComposerSurface: true
            });
          }
        } catch (_0x10e243) {}
        await _0x576da8(_0xf1d147, _0x36903f);
        _0x11dbe9 = await _0x1f5555(_0x36903f, _0x5b62f6, {
          maxWaitMs: 6500,
          interactionId: _0x3dda76.currentTask?.interactionId
        });
        if (!_0x5b62f6) {
          _0x5b62f6 = _0x49501c();
        }
        if (_0x5b62f6) {
          _0x3e6a97 = String(_0x5b62f6).trim();
        }
        if (!_0x11dbe9 && _0x48b04d(_0x36903f, _0x3dda76.currentTask?.interactionId)) {
          return {
            success: false,
            error: "aborted",
            worksCount: _0x572854
          };
        }
        if (!_0x11dbe9 && _0x5b62f6) {
          console.log("[Built-in-Debug] [主页首作评论] 点击未拉起详情，保存阶段后用 modal_id 导航: " + _0x5b62f6);
          _0x4f10ba("正在跳转打开首个作品详情 (modal_id=" + _0x5b62f6 + ")...");
          const {
            resumeState: _0x42c5bf,
            resumeContext: _0x14e4df,
            ..._0x2146a7
          } = _0x165a62;
          const _0x4ffa73 = _0x488dcd(_0x3dda76.currentTask, {
            __profileFirstResume: {
              phase: "video_detail",
              interactionId: _0x3dda76.currentTask?.interactionId,
              videoId: _0x5b62f6,
              worksCount: _0x572854,
              detailInfo: _0x14e4df?.detailInfo || {},
              followedNow: !!_0x14e4df?.followedNow,
              batchCommentOpts: _0x2146a7,
              openMode: "jingxuan",
              navigationAttempt: 1,
              createdAt: Date.now()
            }
          });
          if (!_0x4ffa73) {
            return {
              success: false,
              error: "profile_video_resume_persist_failed",
              worksCount: _0x572854
            };
          }
          try {
            window.location.href = _0x323bb2(_0x5b62f6);
            return await new Promise(() => {});
          } catch (_0x295e49) {
            return {
              success: false,
              error: "profile_video_navigation_failed",
              worksCount: _0x572854
            };
          }
        }
        if (!_0x11dbe9) {
          _0x26b07b("@" + _0x1e242f.nickname + " 未能识别首个作品 videoId，停止本条，避免在主页误操作", _0x1e242f.accountId);
          return {
            success: false,
            error: "profile_video_id_missing",
            worksCount: _0x572854
          };
        }
      }
      console.log("[Built-in-Debug] [主页首作评论] 详情层就绪, scope=" + (_0x11dbe9?.tagName || "?"));
      let _0x163e2d = null;
      const _0x441afb = _0x11dbe9 || document.body || document;
      const _0x18cc4f = () => {
        try {
          _0x163e2d?.stop?.();
        } catch (_0xcee28f) {}
        _0x163e2d = null;
        try {
          _0x204212();
        } catch (_0x5a9684) {}
      };
      try {
        _0x1b218b(_0x441afb, "主页首作：进入作品后立即暂停");
        try {
          Array.from(document.querySelectorAll("video, audio")).forEach(_0x3b3d3c => {
            try {
              _0x3b3d3c.muted = true;
              _0x3b3d3c.autoplay = false;
              _0x3b3d3c.loop = false;
              _0x3b3d3c.pause();
            } catch (_0x27e1a0) {}
          });
        } catch (_0x1cd730) {}
        const _0x555e8e = _0x391363(_0x441afb);
        const _0x31725b = Math.min(220, Number(_0x555e8e.intervalMs) || 220);
        _0x163e2d = _0x500d5d({
          scope: _0x441afb,
          leadVideoUrl: window.location.href || "",
          videoTitle: typeof _0x47fd73 === "function" ? _0x47fd73() || "" : ""
        }, _0x36903f, {
          pauseOnly: true,
          intervalMs: _0x31725b
        });
        try {
          const _0x4642c7 = typeof _0xef320c === "function" ? _0xef320c(window.location.href) || "" : "";
          _0x346bca(_0x4642c7);
        } catch (_0xc85e76) {}
        _0x26b07b("@" + _0x1e242f.nickname + " 已启动作品暂停守护（" + _0x555e8e.label + "，巡检 " + _0x31725b + "ms）", _0x1e242f.accountId);
        _0x4f10ba("主页首作：已锁定暂停，防止图文/短片自动切条…");
        const _0x377e9e = (() => {
          const _0x14f36b = _0x3dda76.currentTask?.commentMentionNicknames;
          if (Array.isArray(_0x14f36b) && _0x14f36b.some(_0x282633 => String(_0x282633 || "").trim())) {
            return true;
          }
          return !!_0x3dda76.currentTask?.enableCommentMention;
        })();
        const _0x38c365 = _0xf7e615() || _0x377e9e;
        if (!_0x38c365) {
          try {
            if (_0x3dda76.currentViewKey) {
              _0x21fac1.invoke("release-background-automation-layout", {
                viewKey: _0x3dda76.currentViewKey,
                preferReacquireMs: 0
              }).catch(() => {});
            }
          } catch (_0x4d01a8) {}
        } else {
          _0x26b07b("@" + _0x1e242f.nickname + " 已开启表情/@，AI 预取期间保持互动执行权", _0x1e242f.accountId);
        }
        let _0x55d2d3 = null;
        if (_0x165a62.forceAi && !_0x165a62.forceTemplateOnly) {
          const _0x2a410f = (typeof _0x47fd73 === "function" ? _0x47fd73() : "") || "";
          _0x26b07b(_0x38c365 ? "@" + _0x1e242f.nickname + " 提前生成首作评论文案（保持互动执行权）" : "@" + _0x1e242f.nickname + " 提前生成首作评论文案（不占用互动执行权）", _0x1e242f.accountId);
          _0x39f4d7("profile-first-ai-prefetch", 360000);
          _0x55d2d3 = _0x37f706(_0x2a410f, _0x36903f, {
            useReplyConfig: true,
            forceAi: true,
            forceTemplateOnly: false,
            templateText: _0x165a62.templateText,
            commentSamples: [],
            allowEmptyText: false
          });
        }
        try {
          window.focus?.();
        } catch (_0x153874) {}
        try {
          if (_0x3dda76.currentViewKey) {
            _0x21fac1.send("focus-automation-view", {
              viewKey: _0x3dda76.currentViewKey,
              bringToFront: true
            });
          }
        } catch (_0x119e43) {}
        await _0x3310b6(800, 1600, _0x36903f, "等待播放器就绪");
        _0x1b218b(_0x441afb, "主页首作：等待后再次锁定暂停");
        let _0x566aa3 = false;
        let _0x5c0eb8 = false;
        const _0x294b73 = _0x581744(_0x3dda76.currentTask?.profileFirstWorkLikePercent, 10);
        const _0x3b0173 = _0x581744(_0x3dda76.currentTask?.profileFirstWorkCollectPercent, 10);
        if (_0x46b9ef()) {
          _0x566aa3 = await _0x1c0541(_0x36903f, _0x1e242f);
          _0x1b218b(_0x441afb, "主页首作：点赞后再次锁定暂停");
        } else if (_0x22195d() && _0x294b73 > 0) {
          _0x26b07b("@" + _0x1e242f.nickname + " 本条未命中点赞概率（" + _0x294b73 + "%）", _0x1e242f.accountId);
        }
        if (_0x4d901c()) {
          _0x5c0eb8 = await _0x365524(_0x36903f, _0x1e242f);
          _0x1b218b(_0x441afb, "主页首作：收藏后再次锁定暂停");
        } else if (_0x22195d() && _0x3b0173 > 0) {
          _0x26b07b("@" + _0x1e242f.nickname + " 本条未命中收藏概率（" + _0x3b0173 + "%）", _0x1e242f.accountId);
        }
        let _0x5b9dce = "";
        let _0x52c641 = false;
        if (_0x55d2d3) {
          _0x5b9dce = await _0x55d2d3;
          _0x52c641 = true;
          if (_0x48fd75(_0x36903f)) {
            return {
              success: false,
              error: "aborted"
            };
          }
          if (!String(_0x5b9dce || "").trim()) {
            _0x26b07b("@" + _0x1e242f.nickname + " AI 未返回可用文案，本条跳过", _0x1e242f.accountId);
            return {
              success: false,
              error: "comment_text_unavailable",
              workLiked: _0x566aa3,
              workCollected: _0x5c0eb8,
              worksCount: _0x572854
            };
          }
        }
        if (_0x4f6482(_0x3dda76.currentTask) || _0x36903f === "SUBVIEW_TASK" && _0x3a826d(_0x277753())) {
          _0x26b07b("@" + _0x1e242f.nickname + " 发表前检测到已成功或已抢占，跳过录入", _0x1e242f.accountId);
          if (_0x4f6482(_0x3dda76.currentTask)) {
            return {
              success: true,
              profileWorkCommented: true,
              alreadyProfileCommented: true,
              workLiked: _0x566aa3,
              workCollected: _0x5c0eb8,
              worksCount: _0x572854
            };
          }
          return {
            success: false,
            error: "aborted",
            workLiked: _0x566aa3,
            workCollected: _0x5c0eb8,
            worksCount: _0x572854
          };
        }
        _0x4f10ba("正在对 [" + _0x1e242f.nickname + "] 的首个作品发表评论（同主贴评论流程）...");
        console.log("%c[主页首作评论] 调用 postVideoComment (与自动发表视频评论一致)", "color: #a78bfa; font-weight: bold;");
        const _0xfbfe42 = 3;
        const _0x4ca6ad = _0x39d576 => {
          const _0x5b57f2 = String(_0x39d576?.errorCode || "");
          const _0xaa18e7 = String(_0x39d576?.error || _0x39d576?.reason || "");
          return _0x5b57f2 === "comment_input_not_found" || _0xaa18e7.includes("comment_input_not_found") || _0xaa18e7.includes("未找到评论输入框");
        };
        const _0x5513ff = _0x22212a => {
          _0x18cc4f();
          const _0x811c26 = _0x22212a || document.body || document;
          _0x1b218b(_0x811c26, "主页首作：重进作品后立即暂停");
          const _0x2ef4d4 = _0x391363(_0x811c26);
          const _0x54d68f = Math.min(220, Number(_0x2ef4d4.intervalMs) || 220);
          _0x163e2d = _0x500d5d({
            scope: _0x811c26,
            leadVideoUrl: window.location.href || "",
            videoTitle: typeof _0x47fd73 === "function" ? _0x47fd73() || "" : ""
          }, _0x36903f, {
            pauseOnly: true,
            intervalMs: _0x54d68f
          });
          try {
            const _0x79a607 = typeof _0xef320c === "function" ? _0xef320c(window.location.href) || _0x3e6a97 || "" : _0x3e6a97 || "";
            _0x346bca(_0x79a607);
          } catch (_0x53f6ee) {}
          _0x26b07b("@" + _0x1e242f.nickname + " 重进后已重启作品暂停守护（" + _0x2ef4d4.label + "，巡检 " + _0x54d68f + "ms）", _0x1e242f.accountId);
        };
        const _0x3f4817 = async _0x116a6b => {
          _0x26b07b("@" + _0x1e242f.nickname + " 输入框未出现，关闭作品弹窗后重新进入（" + _0x116a6b + "/" + _0xfbfe42 + "）", _0x1e242f.accountId);
          _0x4f10ba("评论输入框未出现，关闭作品后重新进入（" + _0x116a6b + "/" + _0xfbfe42 + "）...");
          _0x18cc4f();
          try {
            await _0x19f9fe(_0x36903f);
          } catch (_0x2836ea) {}
          await _0x1916f8(900);
          if (_0x48fd75(_0x36903f) || _0x19ac8f()) {
            return {
              ok: false,
              reason: "aborted_or_hard_fail"
            };
          }
          const _0x33f4f2 = await _0x45b254(_0x36903f, 20000);
          if (!_0x33f4f2?.ready || _0x33f4f2?.noWorks) {
            return {
              ok: false,
              reason: _0x33f4f2?.reason || "works_not_ready"
            };
          }
          const _0x11cd9b = _0x5d3794();
          if (!_0x11cd9b.length) {
            return {
              ok: false,
              reason: "no_video_cards"
            };
          }
          const _0x357802 = _0x11cd9b[0];
          const _0x21b18f = _0x357802?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? _0x357802 : _0x357802?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") || _0x357802;
          const _0xbea29a = _0x21b18f?.href || _0x21b18f?.getAttribute?.("href") || "";
          let _0x5c5301 = _0xef320c(_0xbea29a) || _0x4ff88b(_0xbea29a) || _0x3e6a97;
          try {
            window.focus?.();
          } catch (_0x4fa19d) {}
          try {
            const _0x4407f1 = !!window.__radar_monitor_interaction || !!_0x3dda76.currentTask?.isMonitorAction;
            if (_0x3dda76.currentViewKey && !_0x4407f1) {
              _0x21fac1.send("focus-automation-view", {
                viewKey: _0x3dda76.currentViewKey,
                bringToFront: true
              });
              await _0x21fac1.invoke("ensure-background-automation-layout", {
                viewKey: _0x3dda76.currentViewKey,
                claimInteractionSlot: true,
                requireComposerSurface: true
              });
            }
          } catch (_0x378bb4) {}
          await _0x576da8(_0x21b18f, _0x36903f);
          let _0x172537 = await _0x1f5555(_0x36903f, _0x5c5301 || "", {
            maxWaitMs: 12000,
            interactionId: _0x3dda76.currentTask?.interactionId
          });
          if (!_0x5c5301) {
            _0x5c5301 = _0x49501c();
          }
          if (_0x5c5301) {
            _0x3e6a97 = String(_0x5c5301).trim();
          }
          if (!_0x172537) {
            return {
              ok: false,
              reason: "detail_not_ready"
            };
          }
          _0x11dbe9 = _0x172537;
          _0x5513ff(_0x172537);
          await _0x3310b6(600, 1200, _0x36903f, "重进作品后等待播放器就绪");
          _0x1b218b(_0x172537 || document.body, "主页首作：重进后再次锁定暂停");
          return {
            ok: true,
            videoId: _0x3e6a97
          };
        };
        let _0x4ee0de = null;
        for (let _0x288465 = 1; _0x288465 <= _0xfbfe42; _0x288465 += 1) {
          if (_0x48fd75(_0x36903f)) {
            _0x4ee0de = {
              success: false,
              error: "aborted"
            };
            break;
          }
          _0x39f4d7("profile-first-typing", 180000);
          _0x4ee0de = await _0x19e1f7(document.body, _0x36903f, {
            skipEnableCheck: true,
            countInteraction: false,
            expandScope: true,
            profileVideo: true,
            useReplyConfig: true,
            templateText: _0x165a62.templateText,
            forceAi: !!_0x165a62.forceAi,
            forceTemplateOnly: !!_0x165a62.forceTemplateOnly,
            prefetchedCommentText: _0x5b9dce,
            prefetchedCommentResolved: _0x288465 === 1 ? !!_0x52c641 : !!String(_0x5b9dce || "").trim(),
            videoId: _0x3e6a97 || _0x49501c() || ""
          });
          if (_0x4ee0de?.success) {
            break;
          }
          if (!_0x4ca6ad(_0x4ee0de)) {
            break;
          }
          if (_0x288465 >= _0xfbfe42) {
            _0x26b07b("@" + _0x1e242f.nickname + " 关闭重进已达 " + _0xfbfe42 + " 次，仍未找到评论输入框", _0x1e242f.accountId);
            break;
          }
          const _0xc2bf92 = await _0x3f4817(_0x288465 + 1);
          if (!_0xc2bf92?.ok) {
            _0x26b07b("@" + _0x1e242f.nickname + " 关闭重进失败（" + _0x4b67ce(_0xc2bf92?.reason || "unknown", 40) + "），停止重试", _0x1e242f.accountId);
            break;
          }
        }
        if (!_0x4ee0de?.success && _0x4ee0de?.sendDispatched && !_0x4ee0de?.failureToast && String(_0x4ee0de?.error || "") === "publish_not_verified" && !_0x48fd75(_0x36903f)) {
          const _0x3553b5 = String(_0x4ee0de?.content || _0x5b9dce || "").trim();
          _0x26b07b("@" + _0x1e242f.nickname + " 已触发发送但未确认上墙，加长等待评论区（防双发，不再重发）…", _0x1e242f.accountId);
          let _0x4b91df = false;
          for (let _0x2e6459 = 0; _0x2e6459 < 6 && !_0x48fd75(_0x36903f); _0x2e6459 += 1) {
            await _0x1916f8(3500);
            try {
              if (_0x3553b5 && _0x51b822(_0x3553b5, document.body)) {
                _0x4b91df = true;
                break;
              }
              const _0x3833ff = _0x3b8434(document.body) || _0x24b710(document.body);
              if (_0x3833ff && _0x1f3ca2(_0x3833ff, _0x3553b5)) {
                _0x4b91df = true;
                break;
              }
            } catch (_0x33d9b0) {}
          }
          if (!_0x48fd75(_0x36903f)) {
            _0x4ee0de = {
              success: true,
              content: _0x4ee0de?.content || _0x3553b5,
              sendDispatched: true,
              verifiedInferred: true,
              unverifiedSoft: !_0x4b91df
            };
            _0x26b07b(_0x4b91df ? "@" + _0x1e242f.nickname + " 加长等待后已确认评论上墙" : "@" + _0x1e242f.nickname + " 加长等待仍未刷出列表，按已提交收口（防双发）", _0x1e242f.accountId);
          }
        }
        if (_0x4ee0de?.success) {
          try {
            if (typeof _0x14655f === "function") {
              _0x14655f(_0x3dda76.currentTask);
            }
          } catch (_0x3b6020) {}
          await _0x19f9fe(_0x36903f);
        }
        try {
          document.querySelectorAll("video").forEach(_0x494db6 => {
            if (!_0x494db6.paused) {
              _0x494db6.pause();
            }
          });
        } catch (_0xd93cab) {}
        if (_0x4ee0de?.success) {
          console.log("%c[互动成功] 已在 " + _0x1e242f.nickname + " 主页首个作品发表评论", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
          _0x26b07b("@" + _0x1e242f.nickname + " 首作评论成功 →「" + _0x4b67ce(_0x4ee0de.content || "", 32) + "」", _0x1e242f.accountId);
          return {
            success: true,
            content: _0x4ee0de.content,
            profileWorkCommented: true,
            workLiked: _0x566aa3,
            workCollected: _0x5c0eb8,
            worksCount: _0x572854
          };
        }
        const _0x2a3c98 = _0x4ee0de?.error || _0x4ee0de?.reason || "post_failed";
        console.warn("[主页首作评论] postVideoComment 未成功 (" + _0x2a3c98 + ")");
        _0x26b07b("@" + _0x1e242f.nickname + " 首作评论失败（" + _0x4b67ce(_0x2a3c98, 60) + "）", _0x1e242f.accountId);
        return {
          success: false,
          error: _0x2a3c98,
          workLiked: _0x566aa3,
          workCollected: _0x5c0eb8,
          worksCount: _0x572854
        };
      } finally {
        _0x18cc4f();
      }
    } catch (_0xdacf94) {
      console.warn("[主页首作评论] 异常:", _0xdacf94.message || _0xdacf94);
      return {
        success: false,
        error: _0xdacf94.message || "unknown"
      };
    }
  }
  async function _0x19e1f7(_0x456d5e, _0x497de3, _0x4c9edd = {}) {
    const {
      skipEnableCheck = false,
      countInteraction = true,
      expandScope = false,
      profileVideo = false
    } = _0x4c9edd;
    if (!skipEnableCheck && !_0x3dda76.currentTask?.enableVideoComment) {
      return false;
    }
    if (!_0x4deec8()) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过视频主评");
      _0x348fa4("⚠ 功能不可用：评论配置未就绪，请检查网络后重试", null, "warning");
      return {
        success: false,
        error: "runtime_config_missing"
      };
    }
    const _0x31edd1 = _0x4c9edd.useReplyConfig != null ? !!_0x4c9edd.useReplyConfig : !!profileVideo;
    const _0x16f8b9 = _0x4c9edd.videoKey || "";
    if (!_0x31edd1 && _0x16f8b9 && _0x560b35(_0x16f8b9)) {
      _0x348fa4("📝 视频主评：本账号已评论过此视频，跳过重复发表", null, "warning");
      return {
        success: false,
        skipped: true,
        reason: "already_commented"
      };
    }
    return _0x2f7fef(async () => {
      _0x3dda76.lastTrustedClickDiagnostic = "none";
      const _0x507178 = !_0x31edd1;
      const _0x12c3a3 = _0x3976ce(_0x507178, _0x31edd1);
      _0x95d6b8(_0x507178, {
        profileFirst: _0x31edd1
      });
      _0x1c83c8(_0x507178);
      const _0x1be792 = _0x2c3832(_0x507178);
      const _0x18894e = _0x12c3a3;
      const _0x24d758 = Date.now();
      const _0x4b74ee = 60000;
      const _0x13df0a = _0x24d758 + (profileVideo ? _0x4b74ee : 55000);
      const _0x49dad1 = String(_0x4c9edd.videoId || _0x49501c() || _0xef320c(window.location.href) || "").trim();
      const _0x13ff08 = () => {
        if (!profileVideo) {
          return true;
        }
        if (!_0x49dad1) {
          return !_0x19ac8f();
        }
        const _0x350a4b = String(_0x49501c() || _0xef320c(window.location.href) || "").trim();
        if (!_0x350a4b) {
          return !_0x19ac8f();
        }
        return _0x350a4b === _0x49dad1;
      };
      try {
        const _0x19c33d = [];
        if (_0x456d5e) {
          _0x19c33d.push(_0x456d5e);
        }
        if (expandScope && _0x456d5e !== document.body && !_0x19c33d.includes(document.body)) {
          _0x19c33d.push(document.body);
        }
        if (_0x19c33d.length === 0) {
          _0x19c33d.push(document.body);
        }
        console.log("%c[拟人操作] 正在探测视频主贴评论区...", "color: #a5b4fc; font-style: italic;");
        const _0x3d14ee = (typeof _0x47fd73 === "function" ? _0x47fd73() : "") || "";
        let _0x1c8d7d = Array.isArray(_0x4c9edd.commentSamples) ? _0x4c9edd.commentSamples.filter(Boolean) : [];
        const _0x58cf71 = {
          useReplyConfig: _0x4c9edd.useReplyConfig != null ? !!_0x4c9edd.useReplyConfig : !!profileVideo,
          templateText: _0x4c9edd.templateText,
          forceAi: !!_0x4c9edd.forceAi,
          forceTemplateOnly: !!_0x4c9edd.forceTemplateOnly,
          prefetchedCommentText: _0x4c9edd.prefetchedCommentText || "",
          allowEmptyText: _0x12c3a3
        };
        let _0x4e84f5 = _0x4c9edd.prefetchedCommentResolved ? Promise.resolve(_0x4c9edd.prefetchedCommentText == null ? null : String(_0x4c9edd.prefetchedCommentText)) : null;
        const _0x2b0a72 = (_0x13e6b3 = _0x1c8d7d) => {
          if (_0x4e84f5) {
            return _0x4e84f5;
          }
          _0x4e84f5 = _0x37f706(_0x3d14ee, _0x497de3, {
            ..._0x58cf71,
            commentSamples: Array.isArray(_0x13e6b3) ? _0x13e6b3 : []
          });
          return _0x4e84f5;
        };
        const _0x5677c4 = _0x3ffc57(_0x4c9edd) && !_0x18894e;
        const _0x5dd2b4 = !!_0x4c9edd.prefetchedCommentResolved || !!String(_0x4c9edd.prefetchedCommentText || "").trim();
        if (!_0x5677c4 || _0x5dd2b4 || _0x1c8d7d.length > 0) {
          if (_0x5677c4 && !_0x5dd2b4) {
            _0x348fa4("🤖 视频主评：与界面探测并行生成文案…");
          }
          _0x2b0a72(_0x1c8d7d);
        }
        _0x348fa4("📝 视频主评：正在打开评论区…");
        _0xe12db4("打开评论区", profileVideo ? "profileVideo" : "video");
        _0x222d23();
        if (profileVideo) {
          if (!_0x29875e()) {
            await _0x26f289(_0x497de3, {
              deadlineAt: _0x13df0a
            });
          }
          await _0x4e12db(document.body, _0x497de3, {
            profileVideo: true,
            forMainPost: true,
            deadlineAt: _0x13df0a
          });
          _0x222d23();
        } else {
          await _0x4e12db(_0x456d5e || document.body, _0x497de3, {
            forMainPost: true,
            deadlineAt: _0x13df0a
          });
        }
        if (_0x5677c4 && !_0x4e84f5) {
          if (!_0x1c8d7d.length) {
            const _0x262493 = _0x524493() ? document : _0x456d5e || document.body;
            _0x1c8d7d = _0x2b3324(_0x262493, 8);
          }
          _0x348fa4("🤖 视频主评：与界面探测并行生成文案…");
          _0x2b0a72(_0x1c8d7d);
        } else if (!_0x4e84f5) {
          _0x2b0a72(_0x1c8d7d);
        }
        _0x348fa4("📝 视频主评：正在寻找评论输入框…");
        try {
          console.log("[Built-in-Debug] [主评环境] " + _0x2ef680(_0x456d5e));
        } catch (_0x46c986) {}
        _0x222d23();
        const _0x4575bb = _0x533f8e();
        const _0x581991 = _0x55ae65();
        const _0x45dd5a = _0x417841();
        const _0x5ef44d = _0x72301b();
        const _0x488b1d = _0x2799c7();
        let _0x456625 = _0x24b710(_0x456d5e || document);
        if (!_0x456625) {
          _0x456625 = await _0x4a86f9(_0x456d5e || document, _0x497de3, 3, {
            profileVideo: profileVideo,
            deadlineAt: _0x13df0a
          });
        }
        const _0x17b0c2 = profileVideo ? 4 : 6;
        let _0x15264c = _0x17b0c2;
        let _0x46430b = false;
        let _0x3d009e = false;
        for (let _0x243d88 = 0; !_0x456625 && _0x243d88 < _0x15264c && Date.now() < _0x13df0a; _0x243d88++) {
          if (_0x48fd75(_0x497de3)) {
            return _0x2081d8("while_finding_input", _0x497de3);
          }
          if (_0x243d88 === 0 || _0x243d88 === 3) {
            _0x222d23();
          }
          for (const _0x5575dc of _0x19c33d) {
            if (_0x243d88 <= 1) {
              try {
                const _0x58b3e5 = _0x4575bb ? Array.from(_0x5575dc.querySelectorAll(_0x4575bb)).filter(_0x39b727 => _0x4f83d3(_0x39b727) && _0x1b07bb(_0x39b727)).slice(0, 8).map((_0x403f3c, _0x16cec3) => {
                  const _0x13db78 = _0x403f3c.getBoundingClientRect();
                  const _0x2bee86 = (_0x403f3c.getAttribute("placeholder") || "").trim();
                  return "[#" + _0x16cec3 + "] " + _0x403f3c.tagName + " class=\"" + (_0x403f3c.className || "").toString().slice(0, 50) + "\" ph=\"" + _0x2bee86 + "\" rect=" + Math.round(_0x13db78.left) + "," + Math.round(_0x13db78.top) + "," + Math.round(_0x13db78.width) + "x" + Math.round(_0x13db78.height) + " ce=" + (_0x403f3c.getAttribute("contenteditable") || "");
                }) : [];
                if (_0x58b3e5.length) {
                  _0x3d009e = true;
                }
                console.log("[Built-in-Debug] [主贴评论探测] 第 " + (_0x243d88 + 1) + " 轮输入节点采样(" + _0x58b3e5.length + "):\n" + _0x58b3e5.join("\n"));
              } catch (_0x362955) {}
            }
            try {
              const _0x2f158d = _0x581991 ? Array.from(_0x5575dc.querySelectorAll(_0x581991)) : [];
              const _0x32a957 = _0x2f158d.filter(_0x3e968d => _0x4f83d3(_0x3e968d) && _0x1b07bb(_0x3e968d)).filter(_0x2be1db => {
                if (_0x5ef44d) {
                  try {
                    if (_0x2be1db.closest(_0x5ef44d)) {
                      return false;
                    }
                  } catch (_0x2fb0bb) {}
                }
                return !_0x2be1db.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]");
              }).sort((_0x54dbe5, _0x248159) => _0x248159.getBoundingClientRect().bottom - _0x54dbe5.getBoundingClientRect().bottom)[0];
              if (_0x32a957) {
                await _0x576da8(_0x32a957, _0x497de3, {
                  deadlineAt: _0x13df0a
                });
                await _0x53508a(220, _0x13df0a);
                _0x456625 = _0x32a957;
                const _0x5b9a0d = _0x456625.getBoundingClientRect();
                console.log("%c[拟人操作] 直接命中 DraftEditor 主输入: (" + Math.round(_0x5b9a0d.left) + ", " + Math.round(_0x5b9a0d.top) + ")", "color: #22c55e; font-weight: bold;");
                break;
              }
            } catch (_0x1698dd) {}
            try {
              const _0x2332c0 = _0x45dd5a ? Array.from(_0x5575dc.querySelectorAll(_0x45dd5a)).filter(_0xb751a5 => _0x4f83d3(_0xb751a5) && _0x1b07bb(_0xb751a5)).filter(_0x4439a9 => !_0x4439a9.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")).sort((_0x340380, _0x412020) => _0x412020.getBoundingClientRect().bottom - _0x340380.getBoundingClientRect().bottom) : [];
              if (_0x2332c0[0]) {
                await _0x244deb(_0x2332c0[0], _0x497de3, "主评输入容器", {
                  deadlineAt: _0x13df0a
                });
                await _0x53508a(350, _0x13df0a);
                const _0x48cabc = _0x24b710(_0x5575dc);
                if (_0x48cabc) {
                  _0x456625 = _0x48cabc;
                  const _0x3faeaf = _0x456625.getBoundingClientRect();
                  console.log("%c[拟人操作] 命中真实评论输入容器并捕获编辑器: (" + Math.round(_0x3faeaf.left) + ", " + Math.round(_0x3faeaf.top) + ")", "color: #22c55e; font-weight: bold;");
                  break;
                }
              }
            } catch (_0x4f7c2e) {}
            try {
              const _0x1f8e0c = _0x488b1d ? Array.from(_0x5575dc.querySelectorAll("div, span")).filter(_0x40ebdf => _0x4f83d3(_0x40ebdf) && _0x40ebdf.textContent.trim().startsWith(_0x488b1d)) : [];
              if (_0x1f8e0c.length > 0) {
                const _0x39098a = _0x1f8e0c.find(_0x20f653 => _0x20f653.className.includes("active") || _0x20f653.getAttribute("aria-selected") === "true");
                if (!_0x39098a) {
                  console.log("[Built-in-Debug] [页签] 评论页签未激活，尝试切换...");
                  await _0x576da8(_0x1f8e0c[0], _0x497de3, {
                    deadlineAt: _0x13df0a
                  });
                  await _0x53508a(1200, _0x13df0a);
                }
              }
            } catch (_0x4b4493) {}
            const _0x3c83e3 = Array.from(_0x5575dc.querySelectorAll("div, span, p, i, textarea[placeholder], input[placeholder], [contenteditable=\"true\"][data-placeholder], [role=\"textbox\"][aria-label]")).filter(_0x4940f4 => {
              const _0x186c66 = _0x1aa282(_0x4940f4, {
                requireViewport: false,
                profileVideo: profileVideo
              });
              if (_0x186c66) {
                _0x3d009e = true;
              }
              return _0x186c66;
            }).sort((_0x15cc64, _0x186eda) => _0x3a54f9(_0x186eda) - _0x3a54f9(_0x15cc64));
            let _0x3c5c29 = _0x3c83e3.filter(_0x49cb05 => profileVideo ? _0x5cf133(_0x49cb05) : _0x1b07bb(_0x49cb05));
            if (!_0x3c5c29.length && _0x3c83e3[0]) {
              try {
                _0x5a444c(_0x3c83e3[0], {
                  force: true,
                  block: "nearest"
                });
                await _0x53508a(220, _0x13df0a);
                _0x3c5c29 = _0x3c83e3.filter(_0x17fc24 => profileVideo ? _0x5cf133(_0x17fc24) : _0x1b07bb(_0x17fc24));
              } catch (_0x4bebd6) {}
            }
            const _0x148b5a = [];
            const _0x108b6e = new Set();
            for (const _0x3d5c7c of _0x3c5c29) {
              const _0x3f056d = _0x3d5c7c.getBoundingClientRect();
              const _0x3ec46a = Math.round((_0x3f056d.left + _0x3f056d.width / 2) / 6) + "_" + Math.round((_0x3f056d.top + _0x3f056d.height / 2) / 6);
              if (_0x108b6e.has(_0x3ec46a)) {
                continue;
              }
              _0x108b6e.add(_0x3ec46a);
              _0x148b5a.push(_0x3d5c7c);
              if (_0x148b5a.length >= (profileVideo ? 1 : 2)) {
                break;
              }
            }
            if (_0x3c5c29.length > 0) {
              console.log("[Built-in-Debug] [激活探测] 发现 " + _0x3c5c29.length + " 个候选占位符（去重后 " + _0x148b5a.length + " 个）:\n                    " + _0x148b5a.map((_0x45fffe, _0x4caaed) => "  [" + _0x4caaed + "] \"" + _0x32431d(_0x45fffe) + "\" at Y=" + Math.round(_0x45fffe.getBoundingClientRect().top)).join("\n"));
            }
            const _0x4153f1 = _0x148b5a[0];
            if (_0x4153f1) {
              const _0x217fcb = _0x4153f1.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || _0x4153f1;
              console.log("[Built-in-Debug] [饱和激活] 准备对 " + _0x148b5a.length + " 个去重候选点执行点击...");
              window.focus?.();
              for (let _0xd4460a = 0; _0xd4460a < _0x148b5a.length; _0xd4460a++) {
                const _0x3dcccc = _0x148b5a[_0xd4460a];
                const _0x58728c = _0x3dcccc.closest("div[class*=\"comment\"], div[class*=\"input\"], div[class*=\"area\"]") || _0x3dcccc;
                const _0x1f07fa = _0x58728c.getBoundingClientRect();
                const _0x50bd4e = Math.round(_0x1f07fa.left + _0x1f07fa.width / 2);
                const _0x295146 = Math.round(_0x1f07fa.top + _0x1f07fa.height / 2);
                if (_0x1f07fa.width < 12 || _0x1f07fa.height < 12 || _0x50bd4e <= 5 || _0x295146 <= 5) {
                  continue;
                }
                const _0x4e5f59 = document.elementFromPoint(_0x50bd4e, _0x295146);
                if (_0x4e5f59 && !_0x58728c.contains(_0x4e5f59) && _0x4e5f59 !== _0x58728c) {
                  const _0x5bddd3 = _0x4e5f59.style.pointerEvents;
                  _0x4e5f59.style.setProperty("pointer-events", "none", "important");
                  await _0x244deb(_0x58728c, _0x497de3, "主评占位符" + (_0xd4460a + 1), {
                    deadlineAt: _0x13df0a
                  });
                  setTimeout(() => {
                    if (_0x4e5f59) {
                      _0x4e5f59.style.pointerEvents = _0x5bddd3;
                    }
                  }, 500);
                } else {
                  await _0x244deb(_0x58728c, _0x497de3, "主评占位符" + (_0xd4460a + 1), {
                    deadlineAt: _0x13df0a
                  });
                }
                _0x58728c.focus?.();
                _0x3dcccc.focus?.();
                const _0x1e37d3 = _0x24b710(_0x5575dc);
                if (_0x1e37d3) {
                  _0x456625 = _0x1e37d3;
                  break;
                }
              }
              if (_0x456625) {
                break;
              }
              const _0x1fb3e8 = _0x4153f1.getBoundingClientRect();
              const _0x125804 = Array.from(_0x4153f1.parentElement?.querySelectorAll("svg") || []).filter(_0x41611b => {
                if (!_0x4f83d3(_0x41611b) || !_0x1b07bb(_0x41611b)) {
                  return false;
                }
                const _0x10247a = _0x41611b.getBoundingClientRect();
                const _0x3302e8 = _0x10247a.left >= _0x1fb3e8.left - 50 && _0x10247a.top >= _0x1fb3e8.top - 20;
                const _0x20a9cf = Math.sqrt(Math.pow(_0x10247a.top - _0x1fb3e8.top, 2) + Math.pow(_0x10247a.left - _0x1fb3e8.left, 2));
                return _0x3302e8 && _0x20a9cf < 120;
              });
              if (_0x125804.length > 0) {
                console.log("[Built-in-Debug] [诱导激活] 发现身边的功能图标 (" + _0x125804.length + "个)，尝试诱导...");
                await _0x576da8(_0x125804[0], _0x497de3, {
                  deadlineAt: _0x13df0a
                });
                if (_0x125804[0].parentElement) {
                  await _0x576da8(_0x125804[0].parentElement, _0x497de3, {
                    deadlineAt: _0x13df0a
                  });
                }
              }
              try {
                const _0x32e2c5 = {
                  bubbles: true,
                  cancelable: true,
                  view: window
                };
                _0x217fcb.dispatchEvent(new _0x253307("mouseover", _0x32e2c5));
                _0x217fcb.dispatchEvent(new _0x253307("mouseenter", _0x32e2c5));
                _0x217fcb.focus?.();
                await _0x576da8(_0x217fcb, _0x497de3, {
                  deadlineAt: _0x13df0a
                });
                if (_0x243d88 % 2 === 1) {
                  await _0x576da8(_0x4153f1, _0x497de3, {
                    deadlineAt: _0x13df0a
                  });
                }
              } catch (_0xe4a51b) {}
              await _0x53508a(profileVideo ? 700 : 1200, _0x13df0a);
            }
            const _0x5b4bae = _0x24b710(_0x5575dc);
            if (_0x5b4bae) {
              _0x456625 = _0x5b4bae;
              const _0x102594 = _0x456625.getBoundingClientRect();
              console.log("%c[拟人操作] 成功捕获主贴编辑器! 坐标: (" + Math.round(_0x102594.left) + ", " + Math.round(_0x102594.top) + ")", "color: #22c55e; font-weight: bold;");
              break;
            }
          }
          if (!_0x456625 && _0x243d88 > 2) {
            console.log("[Built-in-Debug] [探测中] 第 " + (_0x243d88 + 1) + " 次尝试，仍未捕获到编辑器...");
            if (_0x243d88 === 3 || _0x243d88 === 5) {
              _0x348fa4("📝 视频主评：仍在寻找输入框（第 " + (_0x243d88 + 1) + " 轮）…");
            }
          }
          if (!_0x456625 && (_0x243d88 === 1 || _0x243d88 === 3 || _0x243d88 === 5)) {
            const _0x455d18 = ((Date.now() - _0x24d758) / 1000).toFixed(1);
            _0xe12db4("输入框等待中", _0x455d18 + "s", "warning");
            try {
              console.log("[Built-in-Debug] [主评环境] 等待第" + (_0x243d88 + 1) + "轮 " + _0x2ef680(_0x456d5e));
            } catch (_0x15f314) {}
          }
          if (_0x456625) {
            break;
          }
          if (!_0x456625 && profileVideo && _0x243d88 === 1) {
            _0x222d23();
            _0x348fa4("📝 视频主评：提前启用可信点击兜底…");
            _0x456625 = await _0x4a86f9(_0x456d5e, _0x497de3, 4, {
              profileVideo: true,
              deadlineAt: _0x13df0a
            });
            if (_0x456625) {
              break;
            }
            _0x3d009e = true;
          }
          if (!_0x456625 && !profileVideo && (_0x243d88 === 2 || _0x243d88 === 5 || _0x243d88 === 8 || _0x46430b && _0x243d88 === 14)) {
            await _0x4e12db(_0x456d5e || document.body, _0x497de3, {
              forMainPost: true,
              deadlineAt: _0x13df0a
            });
            _0x3d009e = true;
          }
          if (_0x4c9edd.profileVideo && !_0x456625 && (_0x243d88 === 2 || _0x243d88 === 4)) {
            _0x222d23();
            await _0x26f289(_0x497de3, {
              deadlineAt: _0x13df0a
            });
            _0x3d009e = true;
          }
          if (!_0x46430b && _0x3d009e && _0x243d88 >= _0x17b0c2 - 1 && !_0x456625) {
            _0x15264c = _0x2d0f13(_0x17b0c2, {
              progress: true,
              hardCapRounds: profileVideo ? 12 : 16
            });
            if (_0x15264c > _0x17b0c2) {
              _0x46430b = true;
              console.log("[Built-in-Debug] [慢环境] 主评输入区仍在加载，延长探测 " + _0x17b0c2 + "→" + _0x15264c + " 轮");
              _0x4f10ba("评论输入加载较慢，继续等待…");
            }
          }
          if (!_0x456625 && (_0x243d88 === 2 || _0x243d88 === 5 || _0x46430b && _0x243d88 === 8)) {
            _0x222d23();
            _0x456625 = await _0x4a86f9(_0x456d5e || document, _0x497de3, profileVideo ? 3 : 4, {
              profileVideo: profileVideo,
              deadlineAt: _0x13df0a
            });
            if (_0x456625) {
              break;
            }
          }
          await _0x53508a(profileVideo ? 400 + _0x243d88 * 90 : 550 + _0x243d88 * 120, _0x13df0a);
        }
        if (!_0x456625) {
          _0x348fa4("📝 视频主评：常规探测未命中，启用深度兜底激活与展开…");
          _0x222d23();
          if (Date.now() < _0x13df0a) {
            await _0x4e12db(_0x456d5e || document.body, _0x497de3, {
              profileVideo: profileVideo,
              forMainPost: true,
              deadlineAt: _0x13df0a
            }).catch(() => {});
          }
          if (Date.now() < _0x13df0a) {
            await _0x53508a(Math.min(700, _0x13df0a - Date.now()), _0x13df0a);
            _0x456625 = await _0x4a86f9(_0x456d5e, _0x497de3, profileVideo ? 5 : 8, {
              profileVideo: profileVideo,
              deadlineAt: _0x13df0a
            });
          }
        }
        if (!_0x456625 && profileVideo && Date.now() < _0x13df0a) {
          _0x348fa4("📝 首作评论：在剩余预算内最终捕获输入框…");
          _0x456625 = _0x24b710(_0x456d5e || document.body) || (await _0x4a86f9(_0x456d5e, _0x497de3, 2, {
            profileVideo: true,
            deadlineAt: _0x13df0a
          }));
          if (!_0x456625) {
            const _0x254a71 = _0x49501c() || _0x4c9edd.videoId || _0xef320c(window.location.href);
            if (_0x254a71) {
              console.log("[Built-in-Debug] [主页首作评论] 内嵌弹窗未挂载编辑器，自动跳转独立视频页: " + _0x254a71);
              _0x348fa4("📝 首作评论：主页弹窗输入框未挂载，自动跳转独立视频页评论…");
              try {
                window.location.href = _0x4f9983(_0x254a71);
                return await new Promise(() => {});
              } catch (_0x402108) {}
            }
          }
        }
        if (!_0x456625 && (profileVideo || _0x3dda76.currentTask?.isBatchAction || _0x4c9edd.useReplyConfig) && !_0x48fd75(_0x497de3)) {
          _0xe12db4("评论输入框超时，软重试", null, "warning");
          try {
            console.log("[Built-in-Debug] [主评环境] 软重试前 " + _0x2ef680(_0x456d5e));
          } catch (_0x54adc4) {}
          if (profileVideo || _0x4c9edd.useReplyConfig) {
            const _0x2cc68c = Math.max(0, _0x13df0a - Date.now());
            _0x26b07b(_0x2cc68c > 800 ? "未找到评论输入框，当前仍在作品内则继续等待（剩余 " + (_0x2cc68c / 1000).toFixed(1) + " 秒，总上限 1 分钟）" : "未找到评论输入框，同视频等待已满 1 分钟，交由上层关闭弹窗重进");
            while (!_0x456625 && Date.now() < _0x13df0a && !_0x48fd75(_0x497de3) && _0x13ff08() && !_0x19ac8f()) {
              _0x222d23();
              const _0x56aed3 = Math.min(_0x13df0a, Date.now() + 8000);
              try {
                await _0x26f289(_0x497de3, {
                  deadlineAt: _0x56aed3
                });
                await _0x4e12db(document.body, _0x497de3, {
                  profileVideo: true,
                  forMainPost: true,
                  deadlineAt: _0x56aed3
                });
              } catch (_0x3debc1) {}
              _0x456625 = _0x24b710(_0x456d5e || document.body) || (await _0x4a86f9(_0x456d5e, _0x497de3, 4, {
                profileVideo: true,
                deadlineAt: _0x56aed3
              }));
              if (_0x456625) {
                _0xe12db4("同视频等待已找到输入框");
                _0x26b07b("同视频等待期间已出现评论输入框");
                break;
              }
              await _0x53508a(900, _0x13df0a);
            }
            if (!_0x456625 && !_0x13ff08()) {
              _0x26b07b("已离开当前作品，停止原地等待输入框");
            }
          } else {
            await _0xf07032(_0x497de3, "评论输入框未出现");
            if (!_0x48fd75(_0x497de3) && !_0x19ac8f()) {
              _0x222d23();
              const _0x4de758 = Date.now() + 24000;
              try {
                await _0x4e12db(_0x456d5e || document.body, _0x497de3, {
                  forMainPost: true,
                  deadlineAt: _0x4de758
                });
              } catch (_0x44bb85) {}
              _0x456625 = _0x24b710(_0x456d5e || document.body) || (await _0x4a86f9(_0x456d5e, _0x497de3, 8, {
                profileVideo: false,
                deadlineAt: _0x4de758
              }));
              if (_0x456625) {
                _0xe12db4("软重试已找到输入框");
                try {
                  console.log("[Built-in-Debug] [主评环境] " + _0x2ef680(_0x456d5e));
                } catch (_0x58bc63) {}
              }
            }
          }
        }
        if (_0x456625) {
          const _0xc93792 = ((Date.now() - _0x24d758) / 1000).toFixed(1);
          _0xe12db4("已找到输入框", _0xc93792 + "s");
          try {
            console.log("[Built-in-Debug] [主评环境] 捕获耗时 " + _0xc93792 + "s " + _0x2ef680(_0x456d5e));
          } catch (_0x477faa) {}
          if (!_0x4e84f5) {
            _0x2b0a72(_0x1c8d7d);
          }
          const _0x49cea5 = await _0x4e84f5;
          if (_0x48fd75(_0x497de3)) {
            return _0x2081d8("after_generating_text", _0x497de3);
          }
          if (_0x31edd1) {
            _0x26b07b("文案策略：replyNoText=" + !!_0x3dda76.currentTask?.enableCommentWithoutText + " videoNoText=" + !!_0x3dda76.currentTask?.enableVideoCommentWithoutText + " allowEmpty=" + !!_0x12c3a3);
          }
          if (!_0x49cea5 && !_0x12c3a3) {
            if (_0x3ffc57(_0x4c9edd)) {
              _0x26b07b("AI 未返回可用文案，已跳过（不使用「赞同」等模板）");
            } else if (_0x4c9edd.useReplyConfig || _0x4c9edd.profileVideo) {
              _0x26b07b("未获取到评论文案，已跳过");
            }
            return {
              success: false,
              error: "comment_text_unavailable"
            };
          }
          const _0x113f8c = _0x340bf0(String(_0x49cea5 || ""), _0x31edd1 ? "profile" : "comment");
          if (!_0x113f8c.trim() && _0x12c3a3) {
            _0x4a6969(_0x507178, {
              profileFirst: _0x31edd1
            });
            const _0x3bb023 = _0x5adb97(_0x507178);
            if (_0x4c9edd.useReplyConfig || profileVideo) {
              _0x26b07b("准备发表评论 →「" + _0x3bb023 + "」");
            } else {
              _0x348fa4("📝 视频主评：正文为空，将仅发送" + _0x3bb023);
            }
          }
          if ((_0x4c9edd.useReplyConfig || profileVideo) && _0x113f8c.trim()) {
            _0x26b07b("准备发表评论 →「" + _0x4b67ce(_0x113f8c, 32) + "」");
          }
          const _0x2c8c9d = _0x113f8c.trim() || _0x5adb97(_0x507178);
          console.log("%c[互动动作] 正在录入视频评论: \"" + _0x2c8c9d + "\"", "color: #fff; background: #059669; padding: 2px 4px; border-radius: 2px;");
          const _0x478aa6 = _0x31edd1 ? _0x161208() : _0x1d96c2();
          const _0x4ec69e = _0x31edd1 ? _0x191ae6() : _0x4840db();
          const _0x63580 = {
            attachCommentImage: _0x478aa6,
            attachCommentExpression: _0x4ec69e,
            isVideoComment: _0x507178,
            profileVideo: _0x31edd1,
            publishScope: _0x456d5e || document.body
          };
          let _0x4f169e = null;
          try {
            _0x4f169e = await _0x1cfbf8(_0x456625, _0x113f8c, _0x497de3, _0x63580);
          } catch (_0x48099b) {
            const _0x37e120 = _0x48099b?.message === "TASK_ABORTED";
            _0xe12db4(_0x37e120 ? "录入发表被中断" : "录入发表异常", _0x37e120 ? _0x23c44e(_0x497de3) : _0x4b67ce(_0x48099b?.message || _0x48099b, 60), "warning");
            if (_0x37e120) {
              return {
                success: false,
                error: "task_aborted_during_submit",
                content: _0x113f8c || _0x2c8c9d,
                aborted: true
              };
            }
            const _0x5b545a = await _0x3d613d(_0x456625, _0x113f8c, {
              sendDispatched: true
            }, _0x456d5e || document.body);
            if (_0x5b545a) {
              _0x4f169e = {
                success: true,
                sendDispatched: true,
                recoveredAfterError: true
              };
            } else {
              throw _0x48099b;
            }
          }
          const _0x39eff7 = _0x456d5e || document.body;
          const _0x1a9d8f = _0x31edd1 ? 2 : 3;
          for (let _0x4ef4fd = 2; _0x4ef4fd <= _0x1a9d8f && !_0x4f169e?.success && !_0x48fd75(_0x497de3); _0x4ef4fd++) {
            if (await _0x3d613d(_0x456625, _0x113f8c, _0x4f169e, _0x39eff7)) {
              _0xe12db4("重试前校验", "评论区已出现本账号评论，视为发表成功");
              _0x4f169e = {
                success: true,
                sendDispatched: true,
                inferredBeforeRetry: true
              };
              break;
            }
            if (_0x4f169e?.sendDispatched) {
              const _0x4d9095 = _0x31edd1 ? 12 : 6;
              const _0x1aae1a = _0x31edd1 ? 800 : 500;
              _0xe12db4("重试前防双发等待", _0x31edd1 ? "首作已派发发送，加长确认评论区（不再急着重点发送）…" : "已派发过发送，额外确认评论区…");
              for (let _0x512d27 = 0; _0x512d27 < _0x4d9095 && !_0x48fd75(_0x497de3); _0x512d27 += 1) {
                await _0x1916f8(_0x1aae1a);
                if (await _0x3d613d(_0x456625, _0x113f8c, _0x4f169e, _0x39eff7)) {
                  _0xe12db4("重试前校验", "延迟确认后评论已上墙，取消重发");
                  _0x4f169e = {
                    success: true,
                    sendDispatched: true,
                    inferredBeforeRetry: true
                  };
                  break;
                }
                const _0x199795 = _0x3b8434(_0x39eff7) || _0x456625;
                if (_0x1f3ca2(_0x199795, _0x113f8c)) {
                  _0xe12db4("重试前容错", "草稿已空且无失败提示，按已发表处理");
                  _0x4f169e = {
                    success: true,
                    sendDispatched: true,
                    verifiedInferred: true
                  };
                  break;
                }
              }
              if (_0x4f169e?.success) {
                break;
              }
              if (_0x31edd1) {
                _0x26b07b("已触发发送但评论区确认偏慢，为防双发不再补点；按已提交处理");
                _0x4f169e = {
                  success: true,
                  sendDispatched: true,
                  verifiedInferred: true,
                  unverifiedSoft: true
                };
                break;
              }
            }
            _0x348fa4("📝 视频主评：发表未成功，" + _0x4ef4fd + "/" + _0x1a9d8f + " 次重试（可能因并行账号布局刷新）…", null, "warning");
            await _0x3310b6(1200, 2200, _0x497de3, "评论发表重试等待");
            if (_0x48fd75(_0x497de3)) {
              break;
            }
            const _0x31de3a = (await _0x4a86f9(_0x456d5e, _0x497de3, profileVideo ? 14 : 6, {
              profileVideo: profileVideo
            })) || _0x456625;
            try {
              const _0x1f5dce = _0x2e5e12(_0x31de3a, _0x113f8c);
              if (_0x1f5dce) {
                _0xe12db4("重试策略", "输入框已有目标文案，仅重新发送");
              }
              if (!_0x1f5dce && _0x1f3ca2(_0x31de3a, _0x113f8c)) {
                _0xe12db4("跳过重发", "草稿已空，继续等待评论区确认而不再点击发送");
                if (await _0x3d613d(_0x31de3a, _0x113f8c, {
                  sendDispatched: true
                }, _0x39eff7)) {
                  _0x4f169e = {
                    success: true,
                    sendDispatched: true,
                    inferredBeforeRetry: true
                  };
                  break;
                }
                continue;
              }
              _0x4f169e = await _0x1cfbf8(_0x31de3a, _0x113f8c, _0x497de3, {
                ..._0x63580,
                resendOnly: _0x1f5dce
              });
            } catch (_0x32917a) {
              if (_0x32917a?.message === "TASK_ABORTED") {
                _0xe12db4("重试被中断", _0x23c44e(_0x497de3), "warning");
                break;
              }
              if (await _0x3d613d(_0x31de3a, _0x113f8c, {
                sendDispatched: true
              }, _0x39eff7)) {
                _0x4f169e = {
                  success: true,
                  sendDispatched: true,
                  recoveredAfterError: true
                };
                break;
              }
              throw _0x32917a;
            }
          }
          if (!_0x4f169e?.success && (await _0x3d613d(_0x456625, _0x113f8c, _0x4f169e, _0x39eff7))) {
            _0xe12db4("最终校验", "评论区已出现本账号评论，视为发表成功");
            _0x4f169e = {
              success: true,
              sendDispatched: !!_0x4f169e?.sendDispatched,
              inferredAfterSubmit: true
            };
          }
          _0xe12db4("submit 返回", "success=" + !!_0x4f169e?.success + " error=" + (_0x4f169e?.error || "none"));
          if (_0x4f169e?.success) {
            console.log("%c[互动成功] 视频主贴评论已发表", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
            if (_0x4c9edd.useReplyConfig || profileVideo) {
              _0x26b07b("评论已提交 →「" + _0x4b67ce(_0x2c8c9d, 32) + "」");
            }
            if (countInteraction) {
              _0x499245();
            }
            if (!_0x31edd1 && _0x16f8b9) {
              _0x3b2c24(_0x16f8b9);
              _0x21fac1.invoke("record-video-main-comment", {
                url: _0x16f8b9,
                title: _0x4c9edd.videoTitle || "",
                platform: window._radar_platform || "douyin",
                accountId: window._radar_account_id,
                content: String(_0x113f8c || _0x2c8c9d || "").trim()
              }).catch(() => {});
            }
            if (!_0x31edd1 && typeof _0x21fac1 !== "undefined") {
              _0x21fac1.send("automation-data", {
                type: "video-comment-posted",
                payload: {
                  accountId: window._radar_account_id
                }
              });
            }
            return {
              success: true,
              content: _0x113f8c || _0x2c8c9d
            };
          }
          const _0x46e9a2 = _0x4f169e?.error || "录入或发送失败";
          console.warn("[Built-in-Debug] [主贴评论] " + _0x46e9a2);
          if (_0x4c9edd.useReplyConfig || profileVideo) {
            _0x26b07b("评论失败（" + _0x4b67ce(_0x46e9a2, 40) + "）");
          }
          return {
            success: false,
            error: _0x46e9a2,
            content: _0x113f8c || _0x2c8c9d,
            sendDispatched: !!_0x4f169e?.sendDispatched,
            failureToast: _0x4f169e?.failureToast || null,
            errorCode: _0x4f169e?.errorCode
          };
        } else {
          console.warn("[交互警告] 超时未找到视频主贴评论输入框，请检查评论面板是否已完全展开");
          _0xe12db4("评论输入框超时", ((Date.now() - _0x24d758) / 1000).toFixed(1) + "s", "warning");
          try {
            console.log("[Built-in-Debug] [主评环境] 超时 " + _0x2ef680(_0x456d5e));
          } catch (_0x473b1a) {}
          _0x348fa4("📝 视频主评：未找到评论输入框（超时）", null, "warning");
          if (_0x4c9edd.useReplyConfig || profileVideo) {
            _0x26b07b("未找到评论输入框，超时跳过");
          }
          return {
            success: false,
            error: "未找到评论输入框（超时，可重试）",
            errorCode: "comment_input_not_found",
            diagnostic: _0x2ef680(_0x456d5e)
          };
        }
      } finally {
        _0x463a58 = null;
        _0x3dda76.currentActionMentionRolled = null;
      }
      return {
        success: false,
        error: "未找到评论输入框（超时，可重试）",
        errorCode: "comment_input_not_found"
      };
    }, {
      requireComposerSurface: true,
      preferReacquireMs: _0x31edd1 && _0x3dda76.currentTask?.canDM ? 10000 : 0
    });
  }
  async function _0x5e5b9f(_0x26b3cb, _0x1fc0b7, _0x29c786, _0x5d4b05 = null, _0x31de42 = {}) {
    return _0x2f7fef(async () => {
      if (!_0x3dda76.currentTask?.enableComment) {
        return _0x10181c("reply_disabled", "当前任务未开启自动回复");
      }
      if (!_0x4deec8()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过回复");
        return _0x10181c("runtime_config_missing", "功能不可用，请检查网络后重试");
      }
      _0x95d6b8(false);
      _0x1c83c8(false);
      try {
        const _0x3cc3f7 = await _0x2945ef(_0x26b3cb, _0x1fc0b7, _0x29c786, {
          fastLocate: !!_0x31de42.fastLocate,
          onProgress: typeof _0x31de42.onProgress === "function" ? _0x31de42.onProgress : null
        });
        if (!_0x3cc3f7) {
          console.warn("[Built-in-Debug] [回复] 失败: 找不到目标评论节点 (" + _0x1fc0b7.nickname + ")");
          return _0x10181c("target_comment_not_found", "未找到 @" + (_0x1fc0b7.nickname || "目标用户") + " 的原评论，可能已刷新、折叠或页面发生变化");
        }
        if (isDouyinSecondaryCommentNode(_0x3cc3f7) || _0xa8cd67(_0x3cc3f7)) {
          const _0x440208 = _0x44890c(_0x3cc3f7, _0x1fc0b7);
          console.warn("[Built-in-Debug] [回复] 跳过作者/二级评论: " + _0x440208);
          _0x348fa4("⚠ 跳过回复：命中作者回复或二级评论（" + _0x440208 + "）", null, "warning");
          return _0x10181c("author_or_reply_comment", "定位到作者回复或二级评论，已跳过（@" + (_0x1fc0b7.nickname || "目标用户") + "）");
        }
        const _0x2bf1b2 = _0x4b67ce((_0x1fc0b7.content || "").trim(), 24);
        const _0x54090a = _0x44890c(_0x3cc3f7, _0x1fc0b7);
        _0x348fa4("💬 已定位评论：" + _0x54090a + (_0x2bf1b2 ? "「" + _0x2bf1b2 + "」" : "") + "，准备点击回复");
        const _0x10a7ac = _0x4a3b34(_0x3cc3f7);
        if (_0x10a7ac) {
          const _0x3d163b = _0xaf1664(_0x10a7ac, _0x3cc3f7);
          const _0x38fef4 = String(_0x10a7ac.textContent || "").replace(/\s+/g, " ").trim().slice(0, 8);
          _0x348fa4("💬 回复按钮：文案「" + (_0x38fef4 || "回复") + "」归属主评=" + (_0x3d163b ? "是" : "否"));
          if (!_0x3d163b) {
            _0x348fa4("⚠ 回复按钮落在嵌套回复上，已跳过，避免回给作者", null, "warning");
            return _0x10181c("author_or_reply_comment", "回复按钮落在作者/二级评论上，已跳过（@" + (_0x1fc0b7.nickname || "目标用户") + "）");
          }
          console.log("[Built-in-Debug] [回复] 发起: " + _0x1fc0b7.nickname + " " + _0x54090a);
          try {
            const _0x50302f = (typeof _0x3db448 === "function" ? _0x3db448(document) : null) || (typeof _0x5f0053 === "function" ? _0x5f0053(document.body) : null);
            if (_0x50302f && _0x50302f.contains(_0x10a7ac)) {
              const _0x7bac88 = _0x10a7ac.getBoundingClientRect();
              const _0x22a56d = _0x50302f.getBoundingClientRect();
              const _0x2c292a = _0x7bac88.top + _0x7bac88.height / 2 - (_0x22a56d.top + _0x22a56d.height * 0.42);
              if (Math.abs(_0x2c292a) > 12) {
                _0x50302f.scrollTop += _0x2c292a;
                try {
                  _0x50302f.dispatchEvent(new Event("scroll", {
                    bubbles: true
                  }));
                } catch (_0x39c81e) {}
              }
            } else {
              _0x5a444c(_0x10a7ac, {
                force: true,
                block: "center"
              });
            }
          } catch (_0x23d2e5) {
            _0x5a444c(_0x10a7ac, {
              force: true,
              block: "center"
            });
          }
          await _0x1916f8(180);
          await _0x3310b6(180, 320, _0x29c786);
          const _0x17173d = async _0x388f5e => {
            let _0x34bb50 = await _0x244deb(_0x10a7ac, _0x29c786, _0x388f5e);
            if (!_0x34bb50 && !_0x48fd75(_0x29c786)) {
              try {
                await _0x576da8(_0x10a7ac, _0x29c786);
              } catch (_0x17a7ec) {}
              try {
                _0x10a7ac.click();
              } catch (_0xdc4745) {}
              await _0x1916f8(220);
            }
          };
          await _0x17173d("回复按钮");
          let _0x3f6ace = null;
          const _0x3cdc2a = 24;
          let _0x590ab4 = _0x3cdc2a;
          let _0xbac1e4 = false;
          for (let _0x33af84 = 0; _0x33af84 < _0x590ab4; _0x33af84++) {
            if (_0x48fd75(_0x29c786)) {
              break;
            }
            const _0x5c46b8 = _0x33af84 + 1;
            console.log("[Built-in-Debug] [互动] 等待回复框出现 (" + _0x5c46b8 + "/" + _0x590ab4 + ")...");
            _0x21fac1.send("automation-data", {
              type: "interaction-progress",
              payload: {
                type: "reply",
                current: _0x5c46b8,
                total: _0x590ab4,
                accountId: window._radar_account_id
              }
            });
            await _0x3310b6(220, 360, _0x29c786);
            _0x3f6ace = _0x2b0c26(_0x3cc3f7);
            if (_0x3f6ace) {
              break;
            }
            if (_0x5c46b8 === 4 || _0x5c46b8 === 12 || _0xbac1e4 && _0x5c46b8 === 28) {
              await _0x4cdd3e(_0x29c786);
              _0x3f6ace = _0x2b0c26(_0x3cc3f7);
              if (_0x3f6ace) {
                break;
              }
            }
            if (_0x5c46b8 === 8 || _0xbac1e4 && _0x5c46b8 === 20) {
              await _0x17173d("回复按钮重试");
            }
            if (!_0xbac1e4 && _0x5c46b8 >= _0x3cdc2a && !_0x3f6ace) {
              _0x590ab4 = _0x2d0f13(_0x3cdc2a, {
                progress: true,
                hardCapRounds: 36
              });
              if (_0x590ab4 > _0x3cdc2a) {
                _0xbac1e4 = true;
                console.log("[Built-in-Debug] [慢环境] 回复框未出现，延长等待 " + _0x3cdc2a + "→" + _0x590ab4 + " 轮");
              }
            }
          }
          if (_0x3f6ace) {
            const _0x211a3d = (_0x5d4b05 || "").trim();
            const _0x1271f4 = _0x5857ab();
            if (_0x4d23b8(_0x3dda76.currentTask) && !_0x211a3d && !_0x1271f4) {
              console.warn("[Built-in-Debug] [回复] AI 模式无可用回复文案，跳过 (" + _0x1fc0b7.nickname + ")");
              _0x348fa4("🤖 AI 回复：@" + _0x1fc0b7.nickname + " 无可用文案，已跳过（不使用「赞同」等模板）");
              return _0x10181c("ai_reply_content_unavailable", "AI 未返回可用的回复文案", _0x3cc3f7);
            }
            const _0x17e522 = _0x3dda76.currentTask.replyTemplates || (_0x3dda76.currentTask.commentContent ? _0x3dda76.currentTask.commentContent.split("\n").filter(_0x4abaee => _0x4abaee.trim()) : []);
            if (!_0x211a3d && _0x17e522.length === 0 && !_0x1271f4) {
              console.warn("[Built-in-Debug] [回复] 未配置本地回复内容，跳过 (" + _0x1fc0b7.nickname + ")");
              _0x348fa4("💬 回复跳过：未配置本地回复内容（@" + _0x1fc0b7.nickname + "）");
              return _0x10181c("reply_content_unavailable", "未配置回复内容", _0x3cc3f7);
            }
            const _0x17ae89 = _0x211a3d || (_0x1271f4 ? "" : _0x17e522.length ? _0x17e522[Math.floor(Math.random() * _0x17e522.length)] : "");
            let _0xede6e4 = _0x17ae89;
            if (!_0x211a3d && String(_0xede6e4 || "").trim() && _0xf64af7(_0x3dda76.currentTask)) {
              _0xede6e4 = _0x30a6e2(_0xede6e4);
            }
            _0xede6e4 = _0x340bf0(_0xede6e4, "reply");
            if (!String(_0xede6e4 || "").trim() && _0x1271f4) {
              _0x4a6969(false);
              _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：正文为空，将仅发送" + _0x5adb97(false));
            }
            const _0x266827 = String(_0xede6e4 || "").trim() || _0x5adb97(false);
            console.log("%c[互动动作] 正在对评论进行回复: \"" + _0x266827 + "\"", "color: #fff; background: #f59e0b; padding: 2px 4px; border-radius: 2px;");
            await _0x244deb(_0x3f6ace, _0x29c786, "回复编辑器");
            await _0x3310b6(600, 1200, _0x29c786);
            const _0x199320 = _0x2d2721(_0x3f6ace, {
              replyMode: true
            });
            const _0x139a1b = _0xa9c741(_0x3f6ace, _0x199320);
            const _0x1cc775 = _0x5cc12c(_0x3f6ace, _0x199320)[0]?.el;
            const _0x587064 = {
              ..._0x199320,
              emojiBtnCache: _0x139a1b,
              imageBtnCache: _0x1cc775
            };
            const _0x5779d1 = _0x44998c(false) && _0x16e341(false) === "before";
            const _0x41d72b = _0x191ae6();
            const _0x5459a4 = !_0x161208() && _0x41d72b;
            const _0x3d63a8 = !String(_0xede6e4 || "").trim() && _0x1271f4 && _0x41d72b;
            if (!_0x5779d1 && !_0x3d63a8) {
              try {
                if (_0x139a1b) {
                  console.log("[拟人操作] 回复表情诱导点击");
                  await _0x576da8(_0x139a1b, _0x29c786);
                  await _0x3310b6(500, 900, _0x29c786);
                  _0x3f6ace.focus();
                }
              } catch (_0x4a5596) {}
            } else {
              _0x18e724(_0x3d63a8 ? "回复纯表情空文案：跳过录入前面板预打开，附加阶段再打开" : "回复正文前 @：跳过表情诱导点击", true);
            }
            console.log("%c[拟人操作] 模拟键盘录入中...", "color: #fbbf24; font-style: italic;");
            const _0x530141 = await _0x99a69c(_0x3f6ace, _0xede6e4, _0x29c786, {
              isVideoComment: false,
              replyMode: true,
              scopeInfo: _0x587064
            });
            if (_0x530141) {
              let _0x1f6e05 = false;
              let _0x5e988a = false;
              if (_0x161208()) {
                _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：尝试配图…");
                const _0x550300 = await _0x5c4d5e(_0x3f6ace, _0x29c786, {
                  replyMode: true,
                  commentNode: _0x3cc3f7
                });
                if (_0x550300?.attached) {
                  _0x1f6e05 = true;
                  _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：配图成功");
                } else if (!_0x550300?.skipped) {
                  _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：配图未成功，继续发送其它内容");
                }
                if (String(_0xede6e4 || "").trim()) {
                  await _0x974f23(_0x3f6ace, _0xede6e4, _0x29c786);
                }
              } else if (_0x5459a4) {
                _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：尝试附带表情包…");
                _0x5e988a = await _0x1ffca1(_0x3f6ace, _0x29c786, {
                  isVideoComment: false,
                  replyMode: true,
                  commentNode: _0x3cc3f7
                }, _0x1271f4 ? 4 : 3);
                if (_0x5e988a) {
                  _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：附带表情包成功");
                } else {
                  _0x348fa4("💬 回复 @" + _0x1fc0b7.nickname + "：附带表情包失败，继续校验输入框内容");
                  _0x5e988a = _0x2b6d22(_0x3f6ace, _0x587064);
                }
              }
              if (_0x5459a4 && !_0x5e988a) {
                console.warn("[Built-in-Debug] [回复] 已选择附带表情包，但插入未确认，取消发送 (" + _0x1fc0b7.nickname + ")");
                _0x348fa4("💬 回复取消：@" + _0x1fc0b7.nickname + " 表情包插入未确认，不降级为纯文字", null, "warning");
                return {
                  success: false,
                  error: "comment_expression_attach_failed",
                  errorCode: "comment_expression_attach_failed",
                  content: "",
                  selfLiked: false
                };
              }
              const _0x50ac59 = await _0x41468(_0x3f6ace, _0x29c786, {
                isVideoComment: false,
                replyMode: true,
                scopeInfo: _0x587064
              });
              const _0x4bd140 = _0x5dcd9c(_0x3f6ace, _0xede6e4, _0x587064) || _0x1f6e05 || _0x5e988a || !!_0x50ac59?.attached;
              if (!_0x4bd140) {
                console.warn("[Built-in-Debug] [回复] 正文为空且未检测到图片/表情/@，取消发送 (" + _0x1fc0b7.nickname + ")");
                _0x348fa4("💬 回复取消：@" + _0x1fc0b7.nickname + " 正文为空且未检测到图片/表情/@", null, "warning");
                return {
                  success: false,
                  error: "empty_comment_payload",
                  content: "",
                  selfLiked: false
                };
              }
              await _0x3310b6(1000, 1800, _0x29c786);
              let _0x16f457 = false;
              let _0x7543ff = _0x299e21(_0x3f6ace);
              if (!_0x7543ff) {
                await _0x1916f8(200);
                _0x7543ff = _0x299e21(_0x3f6ace);
              }
              if (_0x7543ff) {
                await _0x51f7af(_0x7543ff, _0x3f6ace, _0xede6e4, _0x29c786, "回复发送按钮", {
                  scope: document.body
                });
                const _0x502ed5 = await _0x3c0bb3(4500);
                if (_0x502ed5) {
                  const _0x490731 = _0x88a841(_0x502ed5.text);
                  console.warn("[Built-in-Debug] [回复] 检测到失败提示: " + _0x502ed5.text + " (" + _0x490731.code + ")");
                  _0x1945c9(_0x502ed5.text, _0x29c786, _0x490731);
                  return {
                    ..._0x10181c(_0x490731.code || "platform_rejected_reply", _0x502ed5.text, _0x3cc3f7),
                    content: _0xede6e4 || _0x266827,
                    selfLiked: _0x16f457,
                    stopAccount: !!_0x490731.stopAccount
                  };
                }
                const _0x32a920 = await _0x1ad32e(_0x3f6ace, _0xede6e4, document.body);
                if (!_0x32a920) {
                  return {
                    ..._0x10181c("reply_publish_not_confirmed", "已点击发送，但输入框未清空且评论区未确认到回复", _0x3cc3f7),
                    content: _0xede6e4 || _0x266827,
                    selfLiked: _0x16f457
                  };
                }
                console.log("%c[互动成功] 回复已提交", "color: #fff; background: #10b981; padding: 2px 4px; border-radius: 2px;");
                await _0x3310b6(800, 1500, _0x29c786);
                return {
                  success: true,
                  content: _0xede6e4 || _0x266827,
                  selfLiked: _0x16f457
                };
              } else {
                console.log("%c[拟人操作] 按钮探测受阻，尝试回车保底发送...", "color: #94a3b8; font-style: italic;");
                const _0x3596d0 = await _0x44d9ae(_0x3f6ace, _0x29c786, "回复编辑器");
                if (!_0x3596d0) {
                  return {
                    ..._0x10181c("reply_send_control_unavailable", "未找到发送按钮，原生回车发送也未成功触发", _0x3cc3f7),
                    content: _0xede6e4 || _0x266827,
                    selfLiked: _0x16f457
                  };
                }
                const _0x48ff2e = await _0x3c0bb3(4500);
                if (_0x48ff2e) {
                  const _0x1b6642 = _0x88a841(_0x48ff2e.text);
                  console.warn("[Built-in-Debug] [回复] 回车发送检测到失败提示: " + _0x48ff2e.text + " (" + _0x1b6642.code + ")");
                  _0x1945c9(_0x48ff2e.text, _0x29c786, _0x1b6642);
                  return {
                    ..._0x10181c(_0x1b6642.code || "platform_rejected_reply", _0x48ff2e.text, _0x3cc3f7),
                    content: _0xede6e4 || _0x266827,
                    selfLiked: _0x16f457,
                    stopAccount: !!_0x1b6642.stopAccount
                  };
                }
                const _0x290f72 = await _0x1ad32e(_0x3f6ace, _0xede6e4, document.body);
                if (!_0x290f72) {
                  return {
                    ..._0x10181c("reply_publish_not_confirmed", "已触发回车发送，但未确认回复发表成功", _0x3cc3f7),
                    content: _0xede6e4 || _0x266827,
                    selfLiked: _0x16f457
                  };
                }
                await _0x3310b6(800, 1500, _0x29c786);
                return {
                  success: true,
                  content: _0xede6e4 || _0x266827,
                  selfLiked: _0x16f457
                };
              }
            } else {
              console.warn("[Built-in-Debug] [回复] 输入失败，跳过发送 (" + _0x1fc0b7.nickname + ")");
              return _0x10181c("reply_input_failed", "回复内容未能写入输入框", _0x3cc3f7);
            }
          } else {
            return _0x10181c(_0x48fd75(_0x29c786) ? "reply_aborted" : "reply_input_not_found", _0x48fd75(_0x29c786) ? "回复过程已被任务停止" : "点击回复后未出现回复输入框", _0x3cc3f7);
          }
        } else {
          return _0x10181c("reply_button_not_found", "已找到目标评论，但未找到“回复”按钮", _0x3cc3f7);
        }
      } catch (_0x5da8f0) {
        console.error("[Built-in-Debug] [回复异常]", _0x5da8f0);
        return _0x10181c("reply_exception", "回复执行发生异常", null, _0x5da8f0?.message || String(_0x5da8f0));
      } finally {
        _0x463a58 = null;
        _0x3dda76.currentActionMentionRolled = null;
      }
      return _0x10181c("reply_unknown_failure", "回复未完成，未命中明确的执行分支");
    });
  }
  function _0x5c8b46(_0x451bc5) {
    if (!_0x451bc5 || typeof _0x451bc5 !== "object") {
      return false;
    }
    if (_0x451bc5.noWorks || _0x451bc5.skipReason === "作品数为0") {
      return false;
    }
    return !!_0x451bc5.profileWorkCommented;
  }
  function _0x43e905(_0x1f1796) {
    if (!_0x1f1796) {
      return;
    }
    _0x1f1796.actions = _0x1f1796.actions || {};
    delete _0x1f1796.actions.profileWorkCommented;
    if (Array.isArray(_0x1f1796.touchLog) && _0x1f1796.touchLog.length) {
      _0x1f1796.touchLog = _0x1f1796.touchLog.filter(_0x1ead9d => _0x1ead9d.type !== "profileComment");
    }
    _0x1f1796.touchCounts = _0x5274c2(_0x1f1796);
    if (_0x1f1796.touchCounts) {
      _0x1f1796.touchCounts.profileComment = 0;
    }
    if (!_0x1f1796.touchLog?.some(_0x1c46c5 => _0x1c46c5.type === "profileComment")) {
      delete _0x1f1796.profileCommentAt;
    }
    if (_0x1f1796.replied && !_0x1f1796.touchCounts?.reply && !_0x1f1796.touchCounts?.profileComment) {
      _0x1f1796.replied = false;
      delete _0x1f1796.actions.replied;
    }
  }
  function _0xe58baa(_0x4c297b, _0x1b3e5b) {
    if (!_0x4c297b || !_0x1b3e5b || typeof _0x1b3e5b !== "object") {
      return;
    }
    _0x4c297b.actions = _0x4c297b.actions || {};
    if (_0x1b3e5b.followed) {
      _0x4c297b.actions.followed = true;
    }
    if (_0x1b3e5b.messaged) {
      _0x4c297b.actions.messaged = true;
    }
    if (_0x1b3e5b.dmSkipped !== undefined) {
      _0x4c297b.actions.dmSkipped = !!_0x1b3e5b.dmSkipped;
    }
    if (_0x1b3e5b.dmContent) {
      _0x4c297b.actions.dmContent = _0x1b3e5b.dmContent;
    }
    if (_0x5c8b46(_0x1b3e5b)) {
      _0x4c297b.actions.profileWorkCommented = true;
      _0x4c297b.actions.replied = true;
    } else if (_0x1b3e5b.noWorks || _0x1b3e5b.skipReason === "作品数为0" || _0x1b3e5b.skipped && !_0x1b3e5b.profileWorkCommented) {
      _0x43e905(_0x4c297b);
    }
    if (_0x1b3e5b.workLiked) {
      _0x4c297b.actions.liked = true;
      _0x4c297b.liked = true;
    }
    if (_0x1b3e5b.workCollected) {
      _0x4c297b.actions.collected = true;
      _0x4c297b.collected = true;
    }
    if (Array.isArray(_0x1b3e5b.touchLog) && _0x1b3e5b.touchLog.length) {
      _0x4c297b.touchLog = _0x1dc3da([...(_0x1b3e5b.touchLog || []), ...(_0x4c297b.touchLog || [])]).slice(0, 200);
      _0x29c236(_0x4c297b);
    }
    if (_0x1b3e5b.touchCounts && typeof _0x1b3e5b.touchCounts === "object") {
      _0x4c297b.touchCounts = {
        ...(_0x4c297b.touchCounts || {})
      };
      for (const [_0x153cb2, _0x1eaf63] of Object.entries(_0x1b3e5b.touchCounts)) {
        const _0xb37606 = Math.max(0, Number(_0x1eaf63) || 0);
        _0x4c297b.touchCounts[_0x153cb2] = Math.max(Number(_0x4c297b.touchCounts[_0x153cb2] || 0), _0xb37606);
      }
    }
    if (_0x1b3e5b.followed && !(_0x4c297b.touchCounts?.follow > 0)) {
      _0x13f9ba(_0x4c297b, "follow");
    }
    if (_0x1b3e5b.messaged && !_0x1b3e5b.dmSkipped && !(_0x4c297b.touchCounts?.message > 0)) {
      _0x13f9ba(_0x4c297b, "message", {
        content: _0x1b3e5b.dmContent || "已发送私信"
      });
    }
    if (_0x1b3e5b.lastTouchAt) {
      _0x4c297b.lastTouchAt = Math.max(Number(_0x4c297b.lastTouchAt || 0), Number(_0x1b3e5b.lastTouchAt || 0));
    }
    if (_0x1b3e5b.profileCommentAt && _0x5c8b46(_0x1b3e5b)) {
      _0x4c297b.profileCommentAt = _0x1b3e5b.profileCommentAt;
    }
  }
  function _0x9ef929(_0x484ff6) {
    return _0x5c8b46(_0x484ff6);
  }
  function _0x496326(_0xfabe9b = {}) {
    if (_0xfabe9b?.canCommentFirstWork) {
      return 375;
    }
    if (_0xfabe9b?.canDM) {
      return 255;
    }
    return 195;
  }
  function _0x4e6b19(_0x22ffce = {}) {
    const _0x4adc04 = [];
    if (_0x22ffce.canCommentFirstWork) {
      _0x4adc04.push("首作评论");
    }
    if (_0x22ffce.canFollow) {
      _0x4adc04.push("关注");
    }
    if (_0x22ffce.canDM) {
      _0x4adc04.push("私信");
    }
    if (_0x4adc04.length) {
      return _0x4adc04.join("+");
    } else {
      return "主页互动";
    }
  }
  function _0x3fcdfd(_0x54047f, _0x2068e4) {
    if (!_0x2068e4?.targetRejected) {
      return false;
    }
    const _0x266d4 = _0x2068e4.reason || _0x2068e4.targetReason || "主页画像判断不匹配";
    _0x54047f.isHighIntention = false;
    _0x54047f.aiThought = _0x266d4;
    _0x54047f.actions = _0x54047f.actions || {};
    _0x54047f.actions.targetRejected = true;
    _0x23b9f2(_0x54047f);
    _0x348fa4("🎯 @" + _0x54047f.nickname + "：画像不匹配，本轮不触达（" + _0x4b67ce(_0x266d4, 48) + "）");
    _0x21fac1.send("automation-data", {
      type: "comment",
      payload: [_0x54047f],
      taskId: _0x3dda76.activeLoopId,
      viewKey: _0x3dda76.currentTask?.viewKey,
      isAiMode: _0x1bf25d(_0x3dda76.currentTask)
    });
    return true;
  }
  async function _0x54c3f6(_0x2a6657, _0x337b79, _0x1f4638, _0x1634af = null, _0x4a7281 = null) {
    if (!_0x3dda76.currentTask?.enableComment) {
      return false;
    }
    if (_0x3dda76.currentTask?.commentOnProfileFirstWork) {
      console.log("%c[主页首作评论] 尝试跳转 " + _0x337b79.nickname + " 主页发表评论...", "color: #a78bfa; font-style: italic;");
      _0x4f10ba("尝试在 [" + _0x337b79.nickname + "] 主页首个作品下评论...");
      _0x26b07b("@" + _0x337b79.nickname + " 获客任务：优先跳转主页首作评论", _0x337b79.accountId);
      const _0x37878f = !!_0x4a7281?.canFollow;
      const _0x33f11c = !!_0x4a7281?.canDM;
      if (_0x3dda76.currentTask?.enableFollow && !_0x37878f) {
        _0x348fa4("⏭ @" + _0x337b79.nickname + "：已开启关注，但当前无可用关注配额（会话 " + _0x3dda76.sessionFollowCount + "/" + (_0x3dda76.sessionFollowLimit === _0x4e32e3 ? "∞" : _0x3dda76.sessionFollowLimit) + "），本趟仅做首作评论", null, "warning");
      }
      if (_0x3dda76.currentTask?.enableDM && !_0x33f11c) {
        _0x348fa4("⏭ @" + _0x337b79.nickname + "：已开启私信，但当前无可用私信配额（会话 " + _0x3dda76.sessionDmCount + "/" + (_0x3dda76.sessionDmLimit === _0x4e32e3 ? "∞" : _0x3dda76.sessionDmLimit) + "），本趟仅做首作评论", null, "warning");
      }
      const _0x1ada67 = await _0x2e7014(_0x2a6657, _0x337b79, _0x1f4638, _0x37878f, _0x33f11c, {
        canCommentFirstWork: true
      });
      if (_0x1ada67 && typeof _0x1ada67 === "object") {
        _0x2c958f(_0x337b79, _0x1ada67);
      }
      if (_0x1ada67?.targetRejected) {
        const _0xd1cbe1 = _0x1ada67.targetReason || _0x1ada67.skipReason || "主页画像判断不匹配";
        _0x337b79.isHighIntention = false;
        _0x337b79.aiThought = _0xd1cbe1;
        console.log("%c[主页首作评论] " + _0x337b79.nickname + " 画像不匹配，跳过原评论回复", "color: #94a3b8; font-style: italic;");
        _0x348fa4("🎯 @" + _0x337b79.nickname + "：画像不匹配，已跳过互动（" + _0x4b67ce(_0xd1cbe1, 48) + "）");
        return {
          success: false,
          targetRejected: true,
          reason: _0xd1cbe1,
          targetScore: _0x1ada67.targetScore,
          worksCount: _0x1ada67.worksCount
        };
      }
      if (_0x1ada67?.profileFirstTargetFiltered) {
        const _0x101f83 = _0x1ada67.skipReason || "不符合主页首作筛选";
        console.log("%c[主页首作评论] " + _0x337b79.nickname + " " + _0x101f83 + "，不回退回复原评论", "color: #94a3b8; font-style: italic;");
        _0x348fa4("⏭ @" + _0x337b79.nickname + "：" + _0x4b67ce(_0x101f83, 48) + "，已跳过首作评论及原评论回复");
        _0x4f10ba("@" + _0x337b79.nickname + " " + _0x101f83 + "，已跳过", _0x337b79.accountId);
        return {
          success: false,
          skipped: true,
          noReplyFallback: true,
          profileFirstTargetFiltered: true,
          skipReason: _0x101f83,
          gender: _0x1ada67.gender,
          age: _0x1ada67.age,
          worksCount: _0x1ada67.worksCount
        };
      }
      if (_0x9ef929(_0x1ada67)) {
        return {
          success: true,
          content: _0x1ada67.content || "已在主页作品评论",
          profileWorkCommented: true,
          worksCount: _0x1ada67.worksCount,
          followed: !!_0x1ada67.followed,
          messaged: !!_0x1ada67.messaged,
          dmContent: _0x1ada67.dmContent
        };
      }
      const _0x718171 = _0x1ada67?.skipReason || (_0x1ada67?.noWorks ? "无公开作品" : null) || _0x1ada67?.error || "首作评论未完成";
      if ((_0x3dda76.currentTask?.profileFirstCommentFallbackMode || "reply") === "skip") {
        console.log("%c[主页首作评论] " + _0x718171 + "，已按“仅首作评论”跳过回复原评论", "color: #94a3b8; font-style: italic;");
        _0x348fa4("⏭ @" + _0x337b79.nickname + "：" + _0x4b67ce(_0x718171, 32) + "，仅首作评论模式，不回复原评论");
        _0x4f10ba("@" + _0x337b79.nickname + " " + _0x718171 + "，已跳过原评论回复", _0x337b79.accountId);
        return {
          success: false,
          skipped: true,
          noReplyFallback: true,
          skipReason: _0x718171,
          noWorks: !!_0x1ada67?.noWorks,
          worksCount: _0x1ada67?.worksCount
        };
      }
      console.log("%c[主页首作评论] " + _0x718171 + "，回退为回复原评论", "color: #94a3b8; font-style: italic;");
      _0x348fa4("↩ @" + _0x337b79.nickname + "：" + _0x4b67ce(_0x718171, 32) + "，回退回复原评论");
    }
    return await _0x5e5b9f(_0x2a6657, _0x337b79, _0x1f4638, _0x1634af);
  }
  async function _0x2e7014(_0xf13433, _0x26bdfc, _0x4806a8, _0x58beff = false, _0x4bdc5c = false, _0xd68564 = {}) {
    let _0x52fa1c = _0x26bdfc.userUrl;
    const _0x28a8c4 = _0x352c8c(_0x26bdfc.userUrl || "");
    try {
      const _0x2efeec = _0x1cdcd7(_0xf13433, _0x26bdfc);
      if (_0x2efeec) {
        const _0x2e0334 = _0x2efeec.querySelector("a[href*=\"/user/\"], [data-e2e=\"comment-at-user\"]");
        if (_0x2e0334) {
          const _0x2370d2 = _0x2e0334.href || _0x2e0334.getAttribute("href") || "";
          const _0x34403b = _0x352c8c(_0x2370d2);
          if (!_0x28a8c4 || !_0x34403b || _0x28a8c4 === _0x34403b) {
            _0x52fa1c = _0x2370d2 || _0x52fa1c;
          } else {
            _0x348fa4("⚠ @" + _0x26bdfc.nickname + "：评论区匹配节点用户不一致，沿用已采集主页链接", null, "warning");
          }
        }
      }
    } catch (_0xcb95da) {
      console.warn("[Built-in-Debug] [主页跳转] 定位评论节点异常，沿用已采集主页链接:", _0xcb95da?.message || _0xcb95da);
    }
    if (!_0x52fa1c) {
      _0x348fa4("⚠ @" + _0x26bdfc.nickname + "：未找到主页链接，跳过跟进");
      return false;
    }
    if (_0x52fa1c.startsWith("/")) {
      _0x52fa1c = window.location.origin + _0x52fa1c;
    }
    const _0x380a8c = _0x352c8c(_0x52fa1c);
    if (!_0x380a8c) {
      _0x348fa4("⚠ @" + _0x26bdfc.nickname + "：主页链接无法解析用户 ID，跳过跟进");
      return false;
    }
    _0x26bdfc.userUrl = _0x127bd3(_0x52fa1c) || _0x52fa1c;
    try {
      const _0x3400fd = new URL(_0x52fa1c);
      _0x3400fd.searchParams.set("from_tab_name", "main");
      _0x52fa1c = _0x3400fd.toString();
    } catch (_0x48ac65) {
      if (_0x52fa1c.includes("?")) {
        if (!_0x52fa1c.includes("from_tab_name=")) {
          _0x52fa1c += "&from_tab_name=main";
        }
      } else {
        _0x52fa1c += "?from_tab_name=main";
      }
    }
    console.log("[Built-in-Debug] [子视图模式] 正在为 " + _0x26bdfc.nickname + " 切换视图上下文...");
    const _0x9950ad = _0x26e0f7(_0x26bdfc, {
      canFollow: _0x58beff,
      canDM: _0x4bdc5c,
      canCommentFirstWork: !!_0xd68564.canCommentFirstWork,
      profileFirstCommentFallbackMode: _0x3dda76.currentTask?.profileFirstCommentFallbackMode || "reply"
    });
    _0x3dda76.pausedForSubview = true;
    let _0x1468ec = false;
    try {
      window._radar_subview_result = null;
      _0x21fac1.send("interaction-start", {
        viewKey: _0x3dda76.currentViewKey,
        url: _0x52fa1c,
        taskData: _0x9950ad
      });
      _0x348fa4("↪ 子视图 @" + _0x26bdfc.nickname + "：已发起主页跟进（uid=" + _0x380a8c + "，" + _0x4e6b19(_0x9950ad) + "），等待互动结果（最长 " + _0x496326(_0x9950ad) + " 秒）…");
      const _0x3c7a5d = _0x496326(_0x9950ad);
      for (let _0x51704b = 0; _0x51704b < _0x3c7a5d; _0x51704b++) {
        if (_0x3dda76.stopRequested) {
          break;
        }
        if (_0x51704b > 0 && _0x51704b % 15 === 0) {
          const _0x3ac0e6 = _0x4e6b19(_0x9950ad);
          _0x348fa4("↪ 子视图 @" + _0x26bdfc.nickname + "：" + _0x3ac0e6 + "进行中（已 " + _0x51704b + " 秒，属正常等待）…");
        }
        if (window._radar_subview_result) {
          const _0x462d84 = window._radar_subview_result;
          window._radar_subview_result = null;
          _0xe58baa(_0x26bdfc, _0x462d84);
          if (_0x462d84.noWorks || _0x462d84.skipReason === "作品数为0") {
            _0x26bdfc.noWorks = true;
            _0x26bdfc.skipReason = _0x462d84.skipReason || "作品数为0";
          }
          if (_0x462d84.isPrivate || _0x462d84.skipReason && String(_0x462d84.skipReason).includes("私密账号")) {
            _0x26bdfc.isPrivate = true;
            _0x26bdfc.actionSkipReason = _0x462d84.skipReason || "对方账号设置了隐私，未执行关注/私信";
            _0x26bdfc.skipReason = _0x26bdfc.actionSkipReason;
          }
          _0x2c958f(_0x26bdfc, _0x462d84);
          if (_0x462d84.error) {
            if (_0x462d84.error === "USER_NOT_FOUND") {
              console.log("%c[会话恢复] 检测到线索 [" + _0x26bdfc.nickname + "] 的账号异常（用户不存在/已被封禁），系统已在 1 秒内完成安全自愈熔断，跳过该用户跟进！", "color: #f59e0b; font-weight: bold;");
            } else {
              console.warn("[子视图跟进] 线索 [" + _0x26bdfc.nickname + "] 互动未完成，原因: " + _0x462d84.error);
            }
          } else if (_0x26bdfc.actionSkipReason) {
            console.log("[子视图跟进] 线索 [" + _0x26bdfc.nickname + "] 已跳过：" + _0x26bdfc.actionSkipReason);
          } else {
            console.log("[Built-in-Debug] [子视图返回] 任务完成, 性别: " + (_0x462d84.gender || "未知"));
          }
          _0x1468ec = _0x462d84;
          break;
        }
        await new Promise(_0x27f2d6 => setTimeout(_0x27f2d6, 1000));
      }
      if (!_0x1468ec) {
        for (let _0x14e0e9 = 0; _0x14e0e9 < 8; _0x14e0e9++) {
          if (window._radar_subview_result) {
            const _0x3464a7 = window._radar_subview_result;
            window._radar_subview_result = null;
            _0xe58baa(_0x26bdfc, _0x3464a7);
            if (_0x3464a7.noWorks || _0x3464a7.skipReason === "作品数为0") {
              _0x26bdfc.noWorks = true;
              _0x26bdfc.skipReason = _0x3464a7.skipReason || "作品数为0";
            }
            _0x2c958f(_0x26bdfc, _0x3464a7);
            _0x348fa4("↪ 子视图 @" + _0x26bdfc.nickname + "：结果延迟 " + (_0x3c7a5d + _0x14e0e9 + 1) + " 秒到达，已补接");
            _0x1468ec = _0x3464a7;
            break;
          }
          await new Promise(_0x37c9b7 => setTimeout(_0x37c9b7, 1000));
        }
      }
      if (!_0x1468ec && !_0x3dda76.stopRequested) {
        _0x348fa4("⚠ @" + _0x26bdfc.nickname + "：" + _0x4e6b19(_0x9950ad) + "未在 " + (_0x3c7a5d + 8) + " 秒内返回结果，本条按超时收口", _0x26bdfc.accountId, "warning");
      }
    } finally {
      _0x3dda76.pausedForSubview = false;
      await _0x3310b6(1500, 2500, _0x4806a8, "子视图切换缓冲");
    }
    return _0x1468ec;
  }
  async function _0x49ca22(_0x4732a0, _0x231332, _0xa28ef, _0x2ed923 = false, _0x4363c6 = false) {
    if (_0x3dda76.currentTask?.taskMode === "scrape") {
      return false;
    }
    if (!_0x2ed923 && !_0x4363c6) {
      return false;
    }
    console.log("[Built-in-Debug] [主页动作] 模式：双视图切换");
    return await _0x2e7014(_0x4732a0, _0x231332, _0xa28ef, _0x2ed923, _0x4363c6);
  }
  async function _0x3ff667(_0x1f6b0e, _0x42b83a, _0x1e681c, _0x50db65 = {}) {
    const _0x5c62b2 = typeof _0x50db65.onProgress === "function" ? _0x50db65.onProgress : null;
    return _0x2f7fef(async () => {
      const _0x3f369b = !!_0x50db65.force;
      if (!_0x3f369b && _0x3dda76.currentTask?.taskMode === "scrape") {
        if (_0x50db65.detail) {
          return {
            success: false,
            error: "scrape_mode",
            errorCode: "scrape_mode"
          };
        } else {
          return false;
        }
      }
      if (!_0x3f369b && !_0x3dda76.currentTask?.enableLike) {
        if (_0x50db65.detail) {
          return {
            success: false,
            error: "like_disabled",
            errorCode: "like_disabled"
          };
        } else {
          return false;
        }
      }
      try {
        _0x5c62b2?.("开始定位目标评论");
        const _0x393b4f = String(_0x1e681c || "") === "SELF_WARMUP";
        const _0x1c4d60 = !!_0x50db65.fastLocate && !_0x393b4f;
        const _0x21f681 = await _0x2945ef(_0x1f6b0e, _0x42b83a, _0x1e681c, {
          profileVideo: !!_0x50db65.profileVideo,
          fastLocate: _0x1c4d60,
          stableLocate: _0x393b4f || !!_0x50db65.stableLocate,
          onProgress: _0x5c62b2
        });
        if (!_0x21f681) {
          console.warn("[Built-in-Debug] [点赞] 失败: 找不到目标评论节点 (" + _0x42b83a.nickname + ")");
          if (_0x50db65.detail) {
            return {
              success: false,
              error: "未找到目标评论",
              errorCode: "comment_node_not_found"
            };
          } else {
            return false;
          }
        }
        _0x5c62b2?.("已定位评论，查找点赞按钮");
        const _0x44be97 = _0x1586ba(_0x21f681);
        if (!_0x44be97.button) {
          console.warn("[Built-in-Debug] [点赞] 失败: 未找到点赞控件 (" + _0x42b83a.nickname + ", reason=" + _0x44be97.reason + ", score=" + _0x44be97.score + ")");
          if (_0x50db65.detail) {
            return {
              success: false,
              error: "未找到评论点赞控件",
              errorCode: "like_button_not_found"
            };
          } else {
            return false;
          }
        }
        if (_0x44be97.alreadyLiked) {
          _0x5c62b2?.("评论已是点赞状态，跳过点击");
          console.log("%c[互动动作] 评论已点赞，跳过重复点击: " + _0x42b83a.nickname, "color: #94a3b8; font-style: italic;");
          if (_0x50db65.detail) {
            return {
              success: true,
              alreadyLiked: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        _0x5c62b2?.("正在点击点赞");
        console.log("%c[互动动作] 正在对评论点赞: " + _0x42b83a.nickname, "color: #fff; background: #ec4899; padding: 2px 4px; border-radius: 2px;");
        const _0x67bd39 = () => {
          if (_0x44be97.button?.isConnected) {
            return _0x44be97.button;
          }
          const _0x25babb = _0x21f681.isConnected ? _0x21f681 : _0x1cdcd7(_0x1f6b0e || document, _0x42b83a, {
            scrollIntoView: false
          }) || _0x1cdcd7(_0x1f6b0e || document, _0x42b83a, {
            scrollIntoView: false,
            relaxed: true
          });
          if (_0x25babb) {
            return _0x1586ba(_0x25babb).button;
          } else {
            return null;
          }
        };
        const _0x5941b8 = async _0x17008a => {
          const _0x25d139 = _0x67bd39();
          if (!_0x25d139) {
            return {
              effect: false,
              before: null,
              after: null
            };
          }
          _0x5a444c(_0x25d139, {
            force: true,
            block: "nearest"
          });
          await _0x1916f8(220);
          const _0x42b32a = _0x57baca(_0x25d139);
          if (_0x42b32a?.liked) {
            return {
              effect: true,
              alreadyLiked: true,
              before: _0x42b32a,
              after: _0x42b32a
            };
          }
          _0x3dda76.lastNativeClickBackgroundHosted = false;
          const _0x47882a = typeof _0x188fe3 === "function" ? _0x188fe3("commentLikeClickInner") : "";
          const _0x409697 = _0x17008a ? _0x47882a ? _0x25d139.querySelector?.(_0x47882a) || _0x25d139 : _0x25d139 : _0x25d139;
          const _0x1d5a3d = await _0x244deb(_0x409697, _0x1e681c, _0x17008a ? "评论点赞按钮(重试)" : "评论点赞按钮");
          if (!_0x1d5a3d || _0x17008a) {
            try {
              _0x409697.click?.();
            } catch (_0x59f28b) {}
            try {
              _0x25d139.click?.();
            } catch (_0x1ba34a) {}
          }
          const _0x1a6d1f = _0x1d5a3d && _0x3dda76.lastNativeClickBackgroundHosted;
          _0x5c62b2?.(_0x17008a ? "重试点击已发出，确认点赞状态" : "点击已发出，确认点赞状态");
          let _0x44566b = null;
          const _0x2ed5d0 = _0x1a6d1f ? 14 : 10;
          for (let _0x51d38f = 0; _0x51d38f < _0x2ed5d0; _0x51d38f += 1) {
            if (_0x48fd75(_0x1e681c)) {
              break;
            }
            await _0x1916f8(250);
            _0x44566b = _0x57baca(_0x67bd39());
            if (_0x1001c9(_0x42b32a, _0x44566b)) {
              return {
                effect: true,
                before: _0x42b32a,
                after: _0x44566b,
                background: _0x1a6d1f,
                nativeClicked: _0x1d5a3d
              };
            }
          }
          return {
            effect: false,
            before: _0x42b32a,
            after: _0x44566b,
            background: _0x1a6d1f,
            nativeClicked: _0x1d5a3d
          };
        };
        const _0x10d72e = _0x153a20 => {
          _0x5c62b2?.("点赞状态已确认");
          console.log("%c[互动成功] 点赞状态已确认（" + _0x29951c(_0x153a20.after) + "）", "color: #f472b6; font-style: italic;");
          if (_0x50db65.detail) {
            return {
              success: true,
              alreadyLiked: !!_0x153a20.alreadyLiked,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        };
        const _0x37a995 = (_0x36c08a, _0x3e65f4) => {
          console.warn("[Built-in-Debug] [点赞] " + (_0x3e65f4 ? "重试后" : "") + "未读到生效信号 (" + _0x42b83a.nickname + ")" + (" before=" + _0x29951c(_0x36c08a.before) + " after=" + _0x29951c(_0x36c08a.after)) + (" nativeClick=" + _0x36c08a.nativeClicked + " click=" + _0x3dda76.lastTrustedClickDiagnostic));
        };
        let _0x48525f = await _0x5941b8(false);
        if (_0x48525f.effect) {
          return _0x10d72e(_0x48525f);
        }
        _0x37a995(_0x48525f, false);
        if (!_0x48fd75(_0x1e681c) && !_0x48525f.effect) {
          _0x5c62b2?.("点赞未生效，精细重试一次");
          console.warn("[Built-in-Debug] [点赞] 红心未点亮，尝试精细目标与 DOM 补扣重试一次 (" + _0x42b83a.nickname + ")");
          _0x48525f = await _0x5941b8(true);
          if (_0x48525f.effect) {
            return _0x10d72e(_0x48525f);
          }
          _0x37a995(_0x48525f, true);
        }
        if (_0x3f369b || String(_0x1e681c || "") === "SELF_WARMUP") {
          _0x5c62b2?.("未读到已赞回显，按已点击成功记");
          console.warn("[Built-in-Debug] [点赞] 未读到已赞回显，自热场景按点击成功记 (" + _0x42b83a.nickname + ")");
          if (_0x50db65.detail) {
            return {
              success: true,
              unconfirmed: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        if (_0x48525f.background) {
          _0x5c62b2?.("后台托管点击已发出，按成功记");
          console.warn("[Built-in-Debug] [点赞] 后台托管点击已发出，按成功记 (" + _0x42b83a.nickname + ")");
          if (_0x50db65.detail) {
            return {
              success: true,
              unconfirmed: true,
              error: "",
              errorCode: ""
            };
          } else {
            return true;
          }
        }
        console.warn("[Built-in-Debug] [点赞] 已尝试点击但未能点亮红心 (" + _0x42b83a.nickname + ")");
        if (_0x50db65.detail) {
          return {
            success: false,
            error: "已点击点赞，但未能点亮红心",
            errorCode: "like_not_confirmed"
          };
        } else {
          return false;
        }
      } catch (_0x2ef0e8) {
        console.error("[Built-in-Debug] [点赞异常]", _0x2ef0e8);
        await _0x1916f8(2000);
        if (_0x50db65.detail) {
          return {
            success: false,
            error: _0x2ef0e8?.message || "点赞异常",
            errorCode: "like_exception"
          };
        } else {
          return false;
        }
      }
    }, {
      onProgress: _0x5c62b2
    });
  }
  async function _0x5e3114(_0x54d57c, _0x5765a0) {
    const _0x11e06f = _0x1ad53e();
    if (!_0x11e06f?.applyOfficialSearchFilters) {
      console.warn("[Built-in-Debug] [官方筛选] 共享模块缺失，跳过");
      return;
    }
    const _0x1e8ab = _0x3d89f6();
    await _0x11e06f.applyOfficialSearchFilters({
      storage: _0x20c6e1,
      isVisibleElement: _0x4f83d3,
      simulateHumanClick: _0x576da8,
      randomDelay: _0x3310b6,
      sleep: _0x1916f8,
      reportCurrentAction: _0x4f10ba,
      reportTraceLog: _0x348fa4,
      filterSessionMod: _0x1e8ab,
      bumpSearchApiGeneration: () => {
        try {
          _0x58ba86().bumpGeneration();
        } catch (_0x106aec) {}
      },
      scrollToTop: () => {
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
        } catch (_0x671011) {
          try {
            window.scrollTo(0, 0);
          } catch (_0x2905fb) {}
        }
      },
      findVisibleBySelector: _0x1957a7 => {
        try {
          return Array.from(document.querySelectorAll(_0x1957a7)).find(_0x4f83d3) || null;
        } catch (_0x19c668) {
          return null;
        }
      },
      findByExactText: (_0x576e84, _0x301778 = false) => {
        const _0x3b7785 = Array.from(document.querySelectorAll("button, [role=\"button\"], span, div")).filter(_0x3d6d7b => (_0x3d6d7b.innerText || "").trim() === _0x576e84);
        const _0x6b3c3d = _0x3b7785.find(_0x5da72f => _0x4f83d3(_0x5da72f) && _0x5da72f.getBoundingClientRect().height <= 80);
        if (_0x6b3c3d) {
          return _0x6b3c3d;
        }
        if (_0x301778) {
          return null;
        } else {
          return _0x3b7785[0] || null;
        }
      }
    }, {
      sort: _0x3dda76.currentTask?.searchSort || "0",
      time: _0x3dda76.currentTask?.searchPublishTime || "0",
      duration: _0x3dda76.currentTask?.searchDuration || "0",
      scope: _0x3dda76.currentTask?.searchScope || "0",
      format: _0x3dda76.currentTask?.searchFormat || "0"
    }, _0x54d57c, _0x5765a0);
  }
  function _0x2497c5(_0x14d318, _0x5cb752, _0x16dd1a, _0x639b87, _0x4d927f, _0x2742c3 = _0x3dda76.currentTask?.taskMode) {
    const _0x5e4583 = _0x2742c3 === "scrape" ? "评论采集" : "评论解析";
    const _0x460965 = _0x16dd1a + _0x639b87 + _0x4d927f;
    let _0x8e6f7e = "📊 " + _0x5e4583 + "：本屏解析 " + _0x14d318 + " 条 → 新入库 " + _0x5cb752 + " 条";
    if (_0x460965 > 0) {
      const _0xf89803 = [];
      if (_0x639b87 > 0) {
        _0xf89803.push("本任务已录 " + _0x639b87);
      }
      if (_0x16dd1a > 0) {
        _0xf89803.push("本屏重复 " + _0x16dd1a);
      }
      if (_0x4d927f > 0) {
        _0xf89803.push("历史库已有 " + _0x4d927f);
      }
      _0x8e6f7e += "｜跳过 " + _0x460965 + " 条（" + _0xf89803.join("，") + "）";
    }
    return _0x8e6f7e;
  }
  function _0x5a452e(_0x309430, _0x4b2614, _0x255f47) {
    const _0x366442 = _0x309430 + 1;
    if (_0x255f47 && _0x255f47 > 0) {
      return "第 " + _0x366442 + "/" + _0x4b2614 + " 轮：解析评论区（视频总评论约 " + _0x255f47 + " 条，按评论量估算最多滚动 " + _0x4b2614 + " 轮）…";
    }
    return "第 " + _0x366442 + "/" + _0x4b2614 + " 轮：解析评论区并去重…";
  }
  function _0x391c66(_0x1a664d, _0x1065c4) {
    const _0x599633 = String(_0x1a664d || "等待").trim();
    if (_0x599633 === "评论加载等待") {
      return "⏱ 等待评论加载 " + _0x1065c4 + " 秒（已暂停视频，防页面跳转）";
    }
    if (_0x599633 === "内滚") {
      return "⏱ 滚动后等待 " + _0x1065c4 + " 秒（已暂停视频，防页面跳转）";
    }
    return "⏱ " + _0x599633 + " " + _0x1065c4 + " 秒（已暂停视频，防页面跳转）";
  }
  function _0x259c6e(_0x5bdf09, _0x3784e3, _0xd399cf, _0x25c6e4) {
    if (!_0x5bdf09) {
      return;
    }
    const _0x1ff59b = _0x3db448(_0xd399cf);
    window._commentScrapeProgress = {
      videoId: _0x5bdf09,
      scrollRound: Math.max(0, Number(_0x3784e3) || 0),
      scrollTop: _0x1ff59b?.scrollTop || 0,
      videoCollectedCount: Math.max(0, Number(_0x25c6e4) || 0)
    };
    if (typeof window._saveRadarState === "function") {
      window._saveRadarState();
    }
  }
  async function _0x52ab4c(_0x3f961b, _0x1e55bb, _0x3e66bd, _0x2cbd83, _0x46f108 = () => {}, _0x583be4 = "", _0x562bda = null) {
    const _0x217269 = _0x3000dc["douyin.com"];
    const _0x18c25b = _0x2ebcd8(_0x583be4, _0x3f961b);
    const _0x3ece28 = _0x5f0053(_0x3f961b) || _0x3f961b;
    const _0x24726b = _0x5a86cc(_0x3ece28);
    const _0x2a4205 = _0x3dda76.currentTask?.taskMode === "scrape";
    const _0x8fd52b = !_0x2a4205 && _0x24726b.length <= 40;
    if (_0x8fd52b) {
      try {
        let _0x39d21 = "\n=== [" + new Date().toLocaleString() + "] extractLeads Started ===\n";
        _0x39d21 += "VideoTitle: " + _0x1e55bb + "\n";
        _0x39d21 += "Scope Container: " + (_0x3ece28 ? _0x3ece28.tagName + " class=\"" + _0x3ece28.className + "\"" : "null") + "\n";
        _0x39d21 += "CommentNodes Count: " + _0x24726b.length + "\n";
        _0x21fac1.send("write-debug-log", _0x39d21);
      } catch (_0xc98a0d) {
        console.error("[Built-in-Debug] [交互警告] IPC Debug Log Error:", _0xc98a0d.message);
      }
    }
    const _0x2f165e = [];
    let _0x18cfcc = 0;
    let _0x10f3cc = 0;
    let _0x582369 = 0;
    let _0x3e79bf = 0;
    let _0x4b0665 = 0;
    let _0x57e56c = 0;
    let _0x1df019 = 0;
    const _0x431eb7 = [];
    const _0x28e99d = [];
    const _0x43b384 = _0x2232cc(_0x3dda76.currentTask || {});
    const _0x40da3d = _0x476c13(_0x3dda76.currentTask || {});
    const _0x38306a = (() => {
      const _0x541af8 = _0x562bda && typeof _0x562bda === "object" ? _0x562bda : null;
      if (_0x541af8 && (_0x541af8.nickname || _0x541af8.authorNickname || _0x541af8.profileUrl || _0x541af8.authorUrl)) {
        return {
          nickname: _0x541af8.nickname || _0x541af8.authorNickname || "",
          profileUrl: _0x541af8.profileUrl || _0x541af8.authorUrl || "",
          secUid: _0x541af8.secUid || ""
        };
      }
      try {
        const _0x4d5682 = _0x3601c3(null, _0x18c25b) || {};
        return {
          nickname: _0x4d5682.nickname || "",
          profileUrl: _0x4d5682.profileUrl || "",
          secUid: ""
        };
      } catch (_0x5e014a) {
        return {
          nickname: "",
          profileUrl: "",
          secUid: ""
        };
      }
    })();
    if (_0x40da3d) {
      const _0x5a98e3 = !!_0xca3f48();
      console.log("[Built-in-Debug] [地区过滤] 本屏启用: " + _0x43b384 + (" regions=" + JSON.stringify(_0x2b5274(_0x3dda76.currentTask))) + (" module=" + (_0x5a98e3 ? "shared" : "inline-fallback")));
    }
    const _0x2c9a8a = _0x20454e();
    if (_0x2c9a8a) {
      console.log("[Built-in-Debug] [自检] 探测到当前账号昵称: " + _0x2c9a8a + "，将自动过滤此人的评论。");
    }
    _0x24726b.forEach((_0x8d28ae, _0x43aa7a) => {
      try {
        if (isDouyinSecondaryCommentNode(_0x8d28ae)) {
          _0x10f3cc++;
          return;
        }
        const _0xd330d1 = _0x16ab3c(_0x8d28ae, {
          requireTime: true,
          skipAuthor: false
        });
        if (!_0xd330d1) {
          _0x3e79bf++;
          return;
        }
        const {
          nickname: _0x4bc71d,
          userUrl: _0x5a810f,
          text: _0x5a9aa8,
          time: _0x2fba26,
          timeOriginal: _0x53ae97,
          ipLocation: _0x411961
        } = _0xd330d1;
        try {
          if (_0x8fd52b) {
            let _0x2a861b = "\n[Node " + _0x43aa7a + " Debug]\n";
            _0x2a861b += "- Tag: " + _0x8d28ae.tagName + ", Class: " + _0x8d28ae.className + ", data-e2e: " + (_0x8d28ae.getAttribute("data-e2e") || "null") + "\n";
            _0x2a861b += "- Parsed nickname: " + JSON.stringify(_0x4bc71d) + "\n";
            _0x2a861b += "- Parsed content: " + JSON.stringify(_0x5a9aa8) + "\n";
            _0x2a861b += "- Parsed time: " + JSON.stringify(_0x2fba26) + "\n";
            _0x2a861b += "- Parsed ipLocation: " + JSON.stringify(_0x411961) + "\n";
            _0x2a861b += "- isAuthor: " + !!_0xd330d1.isAuthor + "\n";
            _0x21fac1.send("write-debug-log", _0x2a861b);
          }
        } catch (_0x63d801) {
          console.error("[Built-in-Debug] [交互警告] Node IPC Debug Log Error:", _0x63d801.message);
        }
        if (_0xd330d1.isAuthor || _0x31bdaa(_0xd330d1, _0x38306a)) {
          _0x18cfcc++;
          return;
        }
        if (_0x2c9a8a && _0x4bc71d === _0x2c9a8a) {
          _0x582369++;
          return;
        }
        if (!_0x3fdd03(_0x2fba26, _0x3dda76.currentTask.commentTimeFilter)) {
          return;
        }
        if (_0x40da3d) {
          const _0x45e3f6 = _0x4b80a4({
            ipLocation: _0x411961,
            location: _0x411961
          }, _0x3dda76.currentTask || {});
          if (!_0x45e3f6.pass) {
            _0x4b0665++;
            if (_0x45e3f6.reason === "地区未知") {
              _0x1df019++;
            }
            if (_0x431eb7.length < 4) {
              _0x431eb7.push("@" + _0x4bc71d + " 属地「" + (_0x411961 || "未知") + "」→ " + (_0x45e3f6.reason || "跳过"));
            }
            return;
          }
          _0x57e56c++;
          if (_0x28e99d.length < 3) {
            _0x28e99d.push("@" + _0x4bc71d + " 属地「" + _0x411961 + "」");
          }
        }
        const _0x1d833f = _0x3dda76.currentTask?.intentionKeywords || "";
        const _0x313f8d = _0x1d833f.split(/[,，\s\n]+/).map(_0x1c810a => _0x1c810a.trim()).filter(_0x5be7e2 => _0x5be7e2.length > 0);
        const _0x103fd8 = commentBodyForKeywordMatch({
          content: _0x5a9aa8,
          text: _0x5a9aa8,
          nickname: _0x4bc71d,
          ipLocation: _0x411961,
          location: _0x411961
        }) || "";
        const _0x266874 = _0x8d0bab(_0x103fd8 || _0x5a9aa8, _0x3dda76.currentTask);
        const _0x46fa99 = _0x313f8d.length === 0;
        const _0x5cbc06 = _0x266874 || _0x46fa99 ? "" : _0x313f8d.find(_0x5678b2 => _0x103fd8.includes(_0x5678b2)) || "";
        const _0x2432ef = !_0x266874 && (_0x46fa99 || !!_0x5cbc06);
        const _0x1dccb2 = _0x266874 ? "命中排除评论关键词「" + _0x266874 + "」，直接判定为低意向" : _0x46fa99 ? "评论关键词为空，视为全部命中" : _0x5cbc06 ? "匹配关键词: \"" + _0x5cbc06 + "\"" : "未匹配到设置的关键词";
        _0x2f165e.push({
          platform: "DY",
          title: _0x1e55bb,
          nickname: _0x4bc71d,
          content: _0x5a9aa8,
          timeText: _0x2fba26,
          userUrl: _0x5a810f,
          secUid: _0x9f54bd(_0x5a810f) || undefined,
          url: _0x18c25b,
          capturedAt: new Date().toISOString(),
          timestamp: Date.now(),
          type: "LEAD",
          isHighIntention: _0x2432ef,
          thought: _0x1dccb2,
          aiThought: _0x266874 ? _0x1dccb2 : "",
          excludedCommentKeyword: _0x266874 || "",
          leadId: _0x414c74(_0x5a810f, _0x4bc71d, _0x5a9aa8),
          accountId: _0x3dda76.currentTask?.accountId || "default",
          accountName: window._radar_account_name || _0x3dda76.currentTask?.nickname || _0x3dda76.currentTask?.name || "默认账号",
          taskName: _0x3dda76.currentTask?.taskName || "未命名任务",
          ipLocation: _0x411961 || "",
          location: _0x411961 || "未知",
          likeCount: (_0x2cf754 => {
            try {
              const _0x54acf0 = _0x2cf754.querySelector(".comment-item-stats-container span") || _0x2cf754.querySelector("[class*=\"like-count\"]") || _0x2cf754.querySelector("[class*=\"Count\"]");
              if (_0x54acf0) {
                const _0x33843f = _0x54acf0.innerText.trim();
                if (_0x33843f.includes("w")) {
                  return parseFloat(_0x33843f) * 10000;
                }
                if (_0x33843f.includes("k")) {
                  return parseFloat(_0x33843f) * 1000;
                }
                return parseInt(_0x33843f) || 0;
              }
            } catch (_0x40ed9b) {}
            return 0;
          })(_0x8d28ae),
          contact: (() => {
            const _0x1fdadf = (_0x4bc71d + " " + _0x5a9aa8).toLowerCase();
            const _0x4e3edb = _0x1fdadf.match(/1[3-9]\d{9}/);
            const _0x2811f4 = _0x1fdadf.match(/(?:vx|v|微|wechat|➕|🛰️)[:：]?\s*([a-zA-Z0-9_-]{5,20})/);
            let _0x2d45c0 = [];
            if (_0x4e3edb) {
              _0x2d45c0.push("手机: " + _0x4e3edb[0]);
            }
            if (_0x2811f4 && !_0x2811f4[1].includes("http")) {
              _0x2d45c0.push("微信: " + _0x2811f4[1]);
            }
            return _0x2d45c0.join(" | ");
          })(),
          actions: {
            liked: false,
            replied: false
          },
          videoUrl: _0x18c25b,
          cid: _0xd330d1.cid || "",
          commentId: _0xd330d1.cid || ""
        });
        _0x5202ef(_0x2f165e[_0x2f165e.length - 1]);
      } catch (_0x2f7497) {
        _0x3e79bf++;
      }
    });
    const _0x2e2186 = _0x40da3d ? ", 地区过滤跳过:" + _0x4b0665 + "（通过:" + _0x57e56c + "，未知:" + _0x1df019 + "，" + _0x43b384 + "）" : "";
    console.log("[Built-in-Debug] [评论抓取] 抓取完毕。有效评论: " + _0x2f165e.length + "条 (跳过作者:" + _0x18cfcc + ", 跳过二级:" + _0x10f3cc + ", 跳过自己:" + _0x582369 + ", 解析失败/无时间:" + _0x3e79bf + _0x2e2186 + ")");
    if (_0x40da3d) {
      if (_0x4b0665 > 0) {
        _0x348fa4("📍 地区过滤：本屏跳过 " + _0x4b0665 + " 条、保留 " + _0x2f165e.length + " 条（" + _0x43b384 + "）");
        _0x431eb7.forEach(_0xa9b937 => {
          _0x348fa4("📍 过滤跳过：" + _0xa9b937, null, "warning");
        });
      } else if (_0x2f165e.length === 0) {
        _0x348fa4("📍 地区过滤：本屏 0 条入库（" + _0x43b384 + "，可能属地均未命中或均为未知）", null, "warning");
      } else {
        _0x348fa4("📍 地区过滤：本屏 " + _0x2f165e.length + " 条通过（" + _0x43b384 + "）");
        _0x28e99d.forEach(_0x251062 => {
          _0x348fa4("📍 过滤通过：" + _0x251062);
        });
      }
    }
    const _0x424d66 = {
      leads: _0x2f165e,
      actionsPerformed: 0
    };
    const _0x1b9e0c = typeof _0x215a79 === "function" ? await _0x215a79(_0x2f165e) : null;
    let _0x5e8f51 = 0;
    let _0x412c2d = 0;
    let _0x42974c = 0;
    const _0x529a38 = new Set();
    const _0xa80bd1 = _0x2f165e.filter(_0x11b084 => {
      const _0x35adf2 = _0x572de1(_0x11b084);
      if (_0x35adf2 && _0x529a38.has(_0x35adf2)) {
        _0x5e8f51++;
        return false;
      }
      if (_0x1ead3b(_0x11b084)) {
        _0x412c2d++;
        return false;
      }
      const _0x5e0e47 = _0x1b9e0c instanceof Set ? _0x3d7672(_0x11b084).some(_0xafa5a8 => _0x1b9e0c.has(_0xafa5a8)) : _0x268b05(_0x11b084);
      if (_0x5e0e47) {
        _0x42974c++;
        return false;
      }
      if (_0x35adf2) {
        _0x529a38.add(_0x35adf2);
      }
      _0x23b9f2(_0x11b084);
      return true;
    });
    _0x424d66.newLeadsCount = _0xa80bd1.length;
    _0x424d66.parsedCount = _0x2f165e.length;
    _0x424d66.sessionSkipCount = _0x412c2d;
    if (_0x2f165e.length > 0) {
      const _0x2a075c = _0x2497c5(_0x2f165e.length, _0xa80bd1.length, _0x5e8f51, _0x412c2d, _0x42974c, _0x3dda76.currentTask?.taskMode);
      console.log("[Built-in-Debug] [去重统计] 解析" + _0x2f165e.length + " 新入库" + _0xa80bd1.length + " 跳过(本屏" + _0x5e8f51 + "/本任务" + _0x412c2d + "/历史" + _0x42974c + ")");
      _0x4f10ba(_0x2a075c);
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
      if (_0xa80bd1.length > 0) {
        _0x21fac1.send("automation-data", {
          type: "comment",
          payload: _0xa80bd1,
          taskId: _0x3dda76.activeLoopId,
          viewKey: _0x3dda76.currentTask?.viewKey,
          isAiMode: _0x1bf25d(_0x3dda76.currentTask)
        });
      }
    }
    if (_0x3dda76.currentTask?.taskMode === "scrape" && _0x1bf25d(_0x3dda76.currentTask)) {
      console.log("[Built-in-Debug] [仅采集模式] 将 " + _0xa80bd1.length + " 条线索加入异步 AI 分析队列...");
      _0x1a25c2(_0xa80bd1);
      return _0x424d66;
    }
    if (_0x3dda76.currentTask?.taskMode === "scrape" || _0x3dda76.currentTask?.enableLike === false && _0x3dda76.currentTask?.enableComment === false && _0x3dda76.currentTask?.enableFollow === false && _0x3dda76.currentTask?.enableDM === false) {
      console.log("[Built-in-Debug] [仅采集/无动作模式] 本轮捕获 " + _0xa80bd1.length + " 条符合要求的线索，跳过后续互动。");
      return _0x424d66;
    }
    if (_0xa80bd1.length > 0 && (_0x2cbd83.likes > 0 || _0x2cbd83.comments > 0 || _0x2cbd83.follows > 0 || _0x2cbd83.dms > 0)) {
      let _0x48027e = new Map();
      let _0x350bc3 = new Map();
      if (_0x17574c(_0x3dda76.currentTask) && _0x4d23b8(_0x3dda76.currentTask)) {
        _0x350bc3 = await _0x11109b(_0xa80bd1, _0x3e66bd);
      }
      if (_0x1bf25d(_0x3dda76.currentTask)) {
        console.log("[Built-in-Debug] [深度AI] 正在对 " + _0xa80bd1.length + " 条线索进行分批智能分析...");
        console.log("%c[AI分析] 🤖 AI 正在分析 " + _0xa80bd1.length + " 条评论，请稍候...", "color: #8b5cf6; font-weight: bold;");
        const {
          forBackend: _0x7bd503,
          localDecisions: _0x35dc3a,
          localCount: _0x2098fd,
          localLeads: _0x5a035f
        } = _0x9ec67c(_0xa80bd1);
        _0x35dc3a.forEach((_0x49db86, _0x3abd35) => _0x48027e.set(_0x3abd35, _0x49db86));
        if (_0x2098fd > 0) {
          _0x348fa4("🤖 AI 分析：" + _0x2098fd + " 条已本地判定（高意向/灌水等，跳过云端），" + _0x7bd503.length + " 条提交后端…");
          _0x21fac1.send("automation-data", {
            type: "comment",
            payload: _0x5a035f,
            taskId: _0x3dda76.activeLoopId,
            viewKey: _0x3dda76.currentTask?.viewKey,
            isAiMode: true
          });
        } else if (_0x7bd503.length > 0) {
          _0x348fa4("🤖 AI 分析：" + _0x7bd503.length + " 条评论提交后端…");
        }
        for (let _0x51e76a = 0; _0x51e76a < _0x7bd503.length; _0x51e76a += 10) {
          if (_0x48fd75(_0x3e66bd)) {
            break;
          }
          const _0x3c86fa = _0x7bd503.slice(_0x51e76a, _0x51e76a + 10);
          const _0x230085 = Math.floor(_0x51e76a / 10) + 1;
          const _0x461402 = Math.ceil(_0x7bd503.length / 10) || 1;
          console.log("%c[AI分析] 📊 正在分析第 " + _0x230085 + "/" + _0x461402 + " 批 (" + _0x3c86fa.length + " 条)...", "color: #8b5cf6;");
          _0x348fa4("🤖 AI 分析：第 " + _0x230085 + "/" + _0x461402 + " 批，" + _0x3c86fa.length + " 条评论，请求后端（失败将自动重试直至成功）…");
          const _0x2d0342 = Date.now();
          const _0x39ef72 = await _0x21fac1.invoke("ai-intelligent-analyze-batch", _0x325f98({
            leads: _0x3c86fa,
            config: {
              aiRole: _0x3dda76.currentTask.aiRole,
              aiGoal: _0x3dda76.currentTask.aiGoal,
              aiStyle: _0x3dda76.currentTask.aiStyle,
              aiPrompt: _0x3dda76.currentTask.aiPrompt
            }
          }));
          if (_0x48fd75(_0x3e66bd) || _0x37fdb0(_0x39ef72)) {
            _0x348fa4("🤖 AI 分析：任务已停止，终止后续批次");
            break;
          }
          const _0x481977 = ((Date.now() - _0x2d0342) / 1000).toFixed(1);
          if (_0x39ef72.success && _0x39ef72.data) {
            console.log("%c[AI分析] ✅ 第 " + _0x230085 + "/" + _0x461402 + " 批分析完成", "color: #10b981; font-weight: bold;");
            _0x348fa4("🤖 AI 分析：第 " + _0x230085 + " 批完成（耗时 " + _0x481977 + "s，返回 " + _0x39ef72.data.length + " 条判定）");
            _0x39ef72.data.forEach((_0x2b8365, _0x5a1c75) => {
              if (_0x3c86fa[_0x5a1c75]) {
                _0x48027e.set(_0x3c86fa[_0x5a1c75].leadId, _0x2b8365);
                _0x3c86fa[_0x5a1c75].isHighIntention = _0x2b8365.decision !== "ignore";
                _0x3c86fa[_0x5a1c75].aiThought = _0x2b8365.aiThought;
                if (_0x2b8365.aiThought) {
                  _0x3c86fa[_0x5a1c75].thought = _0x2b8365.aiThought;
                }
                if (_0x2b8365.replyContent && !_0x5857ab()) {
                  _0x3c86fa[_0x5a1c75].actions = _0x3c86fa[_0x5a1c75].actions || {};
                  _0x3c86fa[_0x5a1c75].actions.replyContent = _0x2b8365.replyContent;
                }
                const _0x1925cb = _0x2b8365.decision === "ignore" ? "忽略" : _0x2b8365.decision === "both" ? "点赞+评论" : _0x2b8365.decision === "like" ? "点赞" : "评论";
                const _0x2e5518 = _0x2b8365.decision === "ignore" ? "color: #64748b" : "color: #3b82f6; font-weight: bold";
                console.log("[AI判定] 线索: %c" + _0x3c86fa[_0x5a1c75].nickname + "%c, 决策: %c" + _0x1925cb + "%c, 理由: " + _0x2b8365.aiThought, "color: #f1f5f9; font-weight: bold", "color: #94a3b8", _0x2e5518, "color: #94a3b8");
              }
            });
            _0x21fac1.send("automation-data", {
              type: "comment",
              payload: _0x3c86fa,
              taskId: _0x3dda76.activeLoopId,
              viewKey: _0x3dda76.currentTask?.viewKey,
              isAiMode: true
            });
          } else {
            console.warn("[Built-in-Debug] AI 分析批次 (" + _0x51e76a + "-" + (_0x51e76a + 10) + ") 失败，跳过此批次。");
            const _0x1d5ed3 = _0x80f474(_0x39ef72?.msg) ? "（额度/授权问题，已停止重试）" : "";
            _0x348fa4("🤖 AI 分析：第 " + _0x230085 + " 批失败（耗时 " + _0x481977 + "s）" + _0x1d5ed3 + "：" + _0x4b67ce(_0x39ef72?.msg || "未知原因"));
          }
        }
        if (!_0x48fd75(_0x3e66bd)) {
          console.log("%c[AI分析] 🎉 所有评论分析完成！共 " + _0xa80bd1.length + " 条（本地 " + _0x2098fd + " + 云端 " + _0x7bd503.length + "）", "color: #10b981; font-weight: bold; font-size: 13px;");
          _0x348fa4("🤖 AI 分析：本视频完成，共 " + _0xa80bd1.length + " 条（本地 " + _0x2098fd + "，云端 " + _0x7bd503.length + "）");
        }
      }
      for (const _0x2e9983 of _0xa80bd1) {
        if (_0x48fd75(_0x3e66bd)) {
          break;
        }
        if (_0x2cbd83.likes <= 0 && _0x2cbd83.comments <= 0 && (_0x3dda76.currentTask?.enableLike || _0x3dda76.currentTask?.enableComment)) {
          console.log("[Built-in-Debug] [配额检查] 本视频点赞/评论配额已达上限，停止互动。");
          _0x18e1a4(_0x3e66bd);
          const _0x3e62c4 = _0xa80bd1.indexOf(_0x2e9983);
          for (let _0x39986f = Math.max(0, _0x3e62c4); _0x39986f < _0xa80bd1.length; _0x39986f += 1) {
            const _0x19affb = _0xa80bd1[_0x39986f];
            if (!_0x19affb?.isHighIntention) {
              continue;
            }
            const _0x2a3cd2 = _0x5d6c52(_0x19affb, {
              budget: _0x2cbd83,
              interactionEntered: true
            });
            _0x4bb314(_0x19affb, {
              actionSkipReason: _0x2a3cd2
            });
          }
          break;
        }
        if (_0x40fdf8()) {
          console.log("[Built-in-Debug] [总量熔断] 互动总量已达上限，停止本视频互动。");
          const _0x29ce4b = _0xa80bd1.indexOf(_0x2e9983);
          for (let _0x53c5f0 = Math.max(0, _0x29ce4b); _0x53c5f0 < _0xa80bd1.length; _0x53c5f0 += 1) {
            const _0x4e0500 = _0xa80bd1[_0x53c5f0];
            if (!_0x4e0500?.isHighIntention) {
              continue;
            }
            const _0x275b82 = _0x5d6c52(_0x4e0500, {
              budget: _0x2cbd83,
              interactionEntered: true
            });
            _0x348fa4("⏭ @" + _0x4e0500.nickname + "：" + _0x275b82);
            _0x4bb314(_0x4e0500, {
              actionSkipReason: _0x275b82
            });
          }
          break;
        }
        let _0x234aba = false;
        let _0x1f354c = false;
        const _0x7328cb = _0x48027e.get(_0x2e9983.leadId);
        const _0x185396 = _0x1e1cea(_0x2cbd83);
        let _0x475db7 = "";
        const _0xf379e7 = async () => {
          const _0x2b5746 = await _0x3ff667(_0x3f961b, _0x2e9983, _0x3e66bd, {
            detail: true
          });
          if (_0x2b5746 && typeof _0x2b5746 === "object") {
            if (!_0x2b5746.success) {
              _0x475db7 = _0x2b5746.errorCode || _0x2b5746.error || "";
            }
            return !!_0x2b5746.success;
          }
          return !!_0x2b5746;
        };
        if (_0x7328cb) {
          const {
            decision: _0x44ea45,
            replyContent: _0x190765,
            aiThought: _0xddcfc6
          } = _0x7328cb;
          const _0x45ffd6 = _0x5857ab();
          const _0x14ae5a = _0x45ffd6 ? null : _0x190765;
          const _0x20ff1f = (_0x44ea45 === "reply" || _0x44ea45 === "both") && (!!_0x14ae5a || _0x45ffd6);
          const _0x3ecd30 = _0x44ea45 === "like" || _0x44ea45 === "both";
          console.log("[Built-in-Debug] [AI判定] 线索: " + _0x2e9983.nickname + ", 决策: " + _0x44ea45 + ", 回复: " + _0x20ff1f + ", 点赞: " + _0x3ecd30);
          if (_0x44ea45 === "ignore") {
            _0x23b9f2(_0x2e9983);
            console.log("[Built-in-Debug] [AI判定] 线索 " + _0x2e9983.nickname + " 被标记为忽略，跳过互动。");
            continue;
          }
          let _0x312266 = false;
          const _0x1377dd = _0x20ff1f && _0x3dda76.currentTask.enableComment && _0x2cbd83.comments > 0;
          const _0x5cff6c = _0x3ecd30 && _0x3dda76.currentTask.enableLike && _0x2cbd83.likes > 0;
          let _0x270b99 = false;
          if (_0x1377dd && _0x5cff6c) {
            const _0x1c6317 = _0x2cbd83.likes / (_0x2cbd83.likes + _0x2cbd83.comments);
            _0x270b99 = Math.random() < _0x1c6317;
          } else if (_0x5cff6c && !_0x1377dd) {
            _0x270b99 = true;
          }
          if (_0x3dda76.currentTask?.commentOnProfileFirstWork && _0x1377dd) {
            _0x270b99 = false;
          }
          if (_0x270b99) {
            if (_0x5cff6c) {
              _0x1f354c = true;
              const _0x26f138 = await _0xf379e7();
              if (_0x26f138) {
                _0x2cbd83.likes--;
                _0x13f9ba(_0x2e9983, "like");
                _0x234aba = true;
                _0x312266 = true;
                _0x499245();
                _0x46f108();
              }
            }
            if (!_0x312266 && _0x1377dd) {
              _0x1f354c = true;
              const _0x29a758 = await _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, _0x14ae5a, _0x185396);
              if (_0x3fcdfd(_0x2e9983, _0x29a758)) {
                _0x312266 = true;
              }
              if (_0x29a758 && _0x29a758.success) {
                _0x2cbd83.comments--;
                if (_0x29a758.profileWorkCommented) {
                  _0x13f9ba(_0x2e9983, "profileComment", {
                    content: _0x29a758.content || _0x14ae5a || "已回复"
                  });
                } else {
                  _0x13f9ba(_0x2e9983, "reply", {
                    content: _0x29a758.content || _0x14ae5a || "已回复"
                  });
                }
                if (_0x29a758.selfLiked) {
                  _0x2e9983.actions = _0x2e9983.actions || {};
                  _0x2e9983.actions.selfLiked = true;
                  _0x2e9983.selfLiked = true;
                }
                _0x234aba = true;
                _0x312266 = true;
                _0x499245();
                _0x46f108();
              }
            }
          } else {
            if (_0x1377dd) {
              _0x1f354c = true;
              const _0x33a038 = await _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, _0x14ae5a, _0x185396);
              if (_0x3fcdfd(_0x2e9983, _0x33a038)) {
                _0x312266 = true;
              }
              if (_0x33a038 && _0x33a038.success) {
                _0x2cbd83.comments--;
                if (_0x33a038.profileWorkCommented) {
                  _0x13f9ba(_0x2e9983, "profileComment", {
                    content: _0x33a038.content || _0x14ae5a || "已回复"
                  });
                } else {
                  _0x13f9ba(_0x2e9983, "reply", {
                    content: _0x33a038.content || _0x14ae5a || "已回复"
                  });
                }
                if (_0x33a038.selfLiked) {
                  _0x2e9983.actions = _0x2e9983.actions || {};
                  _0x2e9983.actions.selfLiked = true;
                  _0x2e9983.selfLiked = true;
                }
                _0x234aba = true;
                _0x312266 = true;
                _0x499245();
                _0x46f108();
              }
            }
            if (!_0x312266 && _0x5cff6c) {
              _0x1f354c = true;
              const _0xf69bad = await _0xf379e7();
              if (_0xf69bad) {
                _0x2cbd83.likes--;
                _0x13f9ba(_0x2e9983, "like");
                _0x234aba = true;
                _0x312266 = true;
                _0x499245();
                _0x46f108();
              }
            }
          }
          if (!_0x234aba && !_0x312266 && _0x44ea45 !== "ignore") {
            console.log("[Built-in-Debug] [AI跳过] 线索 " + _0x2e9983.nickname + " 符合 AI 意向但由于配额不足或配置关闭未执行动作。");
          }
        }
        if (!_0x234aba && !_0x1bf25d(_0x3dda76.currentTask)) {
          if (!_0x2e9983.isHighIntention) {
            console.log("[Built-in-Debug] [关键词跳过] 线索 " + _0x2e9983.nickname + " 未匹配到任何关键词，非高意向，跳过互动动作");
            continue;
          }
          const _0x3af256 = _0x3dda76.currentTask?.enableLike && _0x2cbd83.likes > 0;
          const _0x5a051f = _0x3dda76.currentTask?.enableComment && _0x2cbd83.comments > 0;
          if (_0x3af256 || _0x5a051f) {
            console.log("[Built-in-Debug] [模式切换] 线索 " + _0x2e9983.nickname + " 匹配到关键词，进入高意向" + (_0x4d23b8(_0x3dda76.currentTask) ? "AI回复" : "模板") + "匹配逻辑");
          }
          const _0x330969 = async () => {
            if (!_0x4d23b8(_0x3dda76.currentTask)) {
              return _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, null, _0x185396);
            }
            if (_0x5857ab()) {
              _0x348fa4("🤖 AI 回复：@" + _0x2e9983.nickname + " 纯图片/表情/@ 模式，跳过文案生成");
              return _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, null, _0x185396);
            }
            const _0x449b4c = _0x350bc3.get(_0x2e9983.leadId);
            if (_0x3dda76.currentTask?.commentOnProfileFirstWork) {
              if (!_0x449b4c) {
                _0x348fa4("🤖 首作评论：@" + _0x2e9983.nickname + " 将在作品页单独生成文案");
              }
              return _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, _0x449b4c || null, _0x185396);
            }
            if (_0x449b4c) {
              return _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, _0x449b4c, _0x185396);
            }
            if (_0x4c70a6()) {
              _0x348fa4("🤖 AI 回复不可用，回退本地模板 @" + _0x2e9983.nickname);
              return _0x54c3f6(_0x3f961b, _0x2e9983, _0x3e66bd, null, _0x185396);
            }
            _0x348fa4("🤖 AI 回复：@" + _0x2e9983.nickname + " 无预生成文案且无本地模板，已跳过");
            return null;
          };
          let _0x2fb86b = false;
          if (_0x3af256 && _0x5a051f) {
            const _0x34f3b0 = _0x2cbd83.likes / (_0x2cbd83.likes + _0x2cbd83.comments);
            _0x2fb86b = Math.random() < _0x34f3b0;
          } else if (_0x3af256 && !_0x5a051f) {
            _0x2fb86b = true;
          }
          if (_0x2fb86b) {
            if (_0x3af256) {
              _0x1f354c = true;
              _0x234aba = await _0xf379e7();
              if (_0x234aba) {
                _0x2cbd83.likes--;
                _0x13f9ba(_0x2e9983, "like");
                _0x499245();
                _0x46f108();
              }
            }
            if (!_0x234aba && _0x5a051f) {
              _0x1f354c = true;
              const _0x5efe56 = await _0x330969();
              if (_0x5efe56 && _0x5efe56.success) {
                _0x2cbd83.comments--;
                if (_0x5efe56.profileWorkCommented) {
                  _0x13f9ba(_0x2e9983, "profileComment", {
                    content: _0x5efe56.content || "已回复"
                  });
                } else {
                  _0x13f9ba(_0x2e9983, "reply", {
                    content: _0x5efe56.content || "已回复"
                  });
                }
                if (_0x5efe56.selfLiked) {
                  _0x2e9983.actions = _0x2e9983.actions || {};
                  _0x2e9983.actions.selfLiked = true;
                  _0x2e9983.selfLiked = true;
                }
                _0x234aba = true;
                _0x499245();
                _0x46f108();
              }
            }
          } else {
            if (_0x5a051f) {
              _0x1f354c = true;
              const _0x195638 = await _0x330969();
              if (_0x195638 && _0x195638.success) {
                _0x2cbd83.comments--;
                if (_0x195638.profileWorkCommented) {
                  _0x13f9ba(_0x2e9983, "profileComment", {
                    content: _0x195638.content || "已回复"
                  });
                } else {
                  _0x13f9ba(_0x2e9983, "reply", {
                    content: _0x195638.content || "已回复"
                  });
                }
                if (_0x195638.selfLiked) {
                  _0x2e9983.actions = _0x2e9983.actions || {};
                  _0x2e9983.actions.selfLiked = true;
                  _0x2e9983.selfLiked = true;
                }
                _0x234aba = true;
                _0x499245();
                _0x46f108();
              }
            }
            if (!_0x234aba && _0x3af256) {
              _0x1f354c = true;
              _0x234aba = await _0xf379e7();
              if (_0x234aba) {
                _0x2cbd83.likes--;
                _0x13f9ba(_0x2e9983, "like");
                _0x499245();
                _0x46f108();
              }
            }
          }
        } else if (!_0x234aba && _0x1bf25d(_0x3dda76.currentTask) && !_0x7328cb) {
          console.log("[Built-in-Debug] [AI保护] 线索 " + _0x2e9983.nickname + " 无 AI 分析结果，AI 模式下拒绝自动互动。");
        }
        const _0x8e9b8b = !!_0x3dda76.currentTask?.enableFollow || !!_0x3dda76.currentTask?.enableDM;
        const _0x13caaf = _0x1bf25d(_0x3dda76.currentTask) && (!_0x7328cb || _0x7328cb.decision === "ignore");
        if (_0x2e9983.isHighIntention && _0x8e9b8b && !_0x13caaf) {
          if (!_0x234aba) {
            _0x1f354c = true;
          }
          const _0x4bb450 = await _0x15b9b4(_0x3f961b, _0x2e9983, _0x3e66bd, _0x2cbd83, _0x46f108);
          if (_0x4bb450) {
            _0x234aba = true;
          }
        }
        if (_0x234aba) {
          _0x23b9f2(_0x2e9983);
          _0x21fac1.send("add-to-blacklist", [_0x465282(_0x2e9983, _0x3dda76.currentTask)]);
          _0x4bb314(_0x2e9983);
          _0x424d66.actionsPerformed++;
          await _0x5548c2(_0x3e66bd, {
            profileWork: !!_0x2e9983.actions?.profileWorkCommented
          });
          await _0xb644a9(_0x3e66bd, {
            profileWorkCommented: !!_0x2e9983.actions?.profileWorkCommented
          });
        } else if (_0x2e9983.isHighIntention) {
          const _0x338210 = _0x5d6c52(_0x2e9983, {
            budget: _0x2cbd83,
            aiDecision: _0x7328cb,
            interactionEntered: true,
            actionAttempted: _0x1f354c,
            likeErrorCode: _0x475db7
          });
          if (_0x41fd7f(_0x338210)) {
            _0x18e1a4(_0x3e66bd);
          } else {
            _0x348fa4("⏭ @" + _0x2e9983.nickname + "：" + _0x338210);
          }
          _0x4bb314(_0x2e9983, {
            actionSkipReason: _0x338210
          });
        }
      }
    } else if (_0xa80bd1.length > 0) {
      for (const _0xf29a0d of _0xa80bd1) {
        if (!_0xf29a0d?.isHighIntention) {
          continue;
        }
        const _0x143348 = _0x5d6c52(_0xf29a0d, {
          budget: _0x2cbd83,
          interactionEntered: false
        });
        if (_0x41fd7f(_0x143348)) {
          _0x18e1a4(_0x3e66bd);
        } else {
          _0x348fa4("⏭ @" + _0xf29a0d.nickname + "：" + _0x143348);
        }
        _0x4bb314(_0xf29a0d, {
          actionSkipReason: _0x143348
        });
      }
    }
    return _0x424d66;
  }
  return {
    applySearchFilters: _0x5e3114,
    buildImageAttachScope: _0x2d2721,
    captureCurrentVideoMetadata: _0x4ae10a,
    collectCommentImageTriggerCandidates: _0x5cc12c,
    describeProfileNoWorksReason: _0x21f0c9,
    describeProfileWorksNotReadyReason: _0x804bb2,
    describeReplyEnvironment: _0x3ef071,
    ensureProfileWorksTab: _0x249fcb,
    extractLeads: _0x52ab4c,
    findCommentPanelRoot: _0x125206,
    findDouyinEmojiPanel: _0x2b0d08,
    findEmojiTriggerBtn: _0xa9c741,
    findMainVideoCommentInput: _0x24b710,
    findProfileVideoCards: _0x5d3794,
    findTargetNode: _0x1cdcd7,
    formatScrapeCommentScrollAction: _0x5a452e,
    formatScrapeGuardWaitLabel: _0x391c66,
    getCommentComposerRoot: _0xff9aef,
    getCommentItemLooseSelector: _0x50787b,
    getCommentItemSelector: _0x72301b,
    getCommentPanelSelector: _0xdd5660,
    getMainCommentInputShellSelector: _0x417841,
    getProfilePostListRoot: _0x4b0d7f,
    getVideoAuthorInfo: _0x3601c3,
    getVideoAuthorNickname: _0x4913aa,
    getVideoAuthorProfileUrl: _0x11ac20,
    getVideoTitle: _0x47fd73,
    hasCommentNonTextPayload: _0x2c3832,
    isProfileFirstCommentAiMode: _0x36a4d8,
    isProfileFirstWorkCommentDone: _0x9ef929,
    matchExcludedVideoAuthor: _0x4288b6,
    mergeCommentSelectors: _0x5e7a6a,
    normalizeAuthorAccountName: _0x59d57c,
    parseExcludeAuthorAccounts: _0x357569,
    parseProfileWorksCount: _0x45c22,
    pauseSettleThenCaptureVideoMetadata: _0x2378d4,
    performLike: _0x3ff667,
    performProfileActions: _0x49ca22,
    performProfileFirstWorkComment: _0x4899f3,
    performReply: _0x5e5b9f,
    postVideoComment: _0x19e1f7,
    profileHasNoPublicWorks: _0x58166a,
    queryCommentItemNodes: _0x5a86cc,
    reportMonitorActionProgress: _0x58d981,
    resetCommentImageRotation: _0x51c623,
    resolveCommentImagePaths: _0x595de7,
    resolveCommentPanelRoot: _0x5f0053,
    resolveMainCommentWritableElement: _0x9a60a,
    resolveMainVideoCommentText: _0x37f706,
    resolveVideoCommentImagePaths: _0x2fad27,
    restoreCommentAttachmentRotationFromSession: _0x3ad1b9,
    persistCommentAttachmentRotation: _0x173cfc,
    saveCommentScrapeProgress: _0x259c6e,
    syncCommentAttachmentRotationFromBatchStorage: _0x5d0073,
    waitAndCaptureCurrentVideoMetadata: _0x4fe30b,
    waitForProfileWorksReady: _0x45b254
  };
}
module.exports = {
  createCommentAutomationController: createCommentAutomationController
};
const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createEntityLeadgenController(_0xd89262 = {}) {
  const {
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: _0x460279,
    aggressiveCommentListScroll: _0x3bfd7a,
    applySearchFilters: _0xaa6e49,
    awaitFeedVideoSwitchSettled: _0xcb20c8,
    awaitSecurityChallengeIfPresent: _0x16da8f,
    buildDouyinSearchResultCardMap: _0x39fef9,
    captureCurrentVideoMetadata: _0x5ca4b5,
    captureFeedVideoShareUrl: _0x3d8b0e,
    checkAndClickOneClickLogin: _0x4f4634,
    clickCommentPanelLoadingPlaceholder: _0x21d067,
    collectDouyinSearchResultCards: _0x33a67a,
    describeSpecificVideoSkipReason: _0x2f1d5a,
    detectPageSecurityChallenge: _0x321eb0,
    ensureCommentPanelOpen: _0x5063fb,
    ensureLeadgenScrapeApiBridge: _0x283e6c,
    ensureLeadgenScrapeApiHook: _0xd24701,
    getRuntimeApiHooks: _0x208935,
    ensureSpecificVideoApiHook: _0x2dffb3,
    evaluateSpecificVideoOpenProgress: _0x554e84,
    extractSpecificVideoId: _0x59d57b,
    extractUserIdFromUrl: _0x12e1b6,
    extractVideoIdFromHref: _0x57b5f3,
    findAwemeIdForCard: _0x5c556c,
    findCommentPanelRoot: _0x42c182,
    findDouyinSearchCardContentId: _0x121575,
    findSearchCardAuthorNickname: _0x2ceb88,
    findSearchCardAuthorProfileUrl: _0x4dcc02,
    findSearchCardVideoUrl: _0x17c2bb,
    getApplySearchFiltersModule: _0x95c1da,
    getCommentEndHintText: _0x24b9ed,
    getCommentScrollMetrics: _0x1b520f,
    getCommentTabPrefix: _0xc6ccf,
    getCommentV2String: _0x5e4b1f,
    getCommentsTotalCount: _0x5732ba,
    getDouyinFeedScope: _0x4e1828,
    getDouyinSearchCardClickTarget: _0x7e83ff,
    getDouyinSearchCardRoot: _0x1eba17,
    getExtendedReadyBudgetMs: _0x3b1316,
    getFeedVideoIdentity: _0x4d612a,
    getProcessedVideoKeyModule: _0x2e3bdf,
    getScrapeNoNewDataTolerance: _0x323b5d,
    getSearchFilterSessionModule: _0x136597,
    getVideoAuthorInfo: _0x116c29,
    getVideoSearchCollectionEngineModule: _0x3b9545,
    getVideoSearchScrapePolicyModule: _0x4da700,
    getVideoTitle: _0x518060,
    hasFeedLiveEnterHint: _0x62cea0,
    ipcRenderer: _0x169ee9,
    isCommentPanelContentLoading: _0x1c3228,
    isDouyinFeedLiveStream: _0xa185c3,
    isDouyinFeedPlaying: _0x3c502c,
    isDouyinLiveStreamTitle: _0x1eb8ae,
    isDouyinSearchPageContentLoading: _0x2a8862,
    isDouyinSpecificVideoUnavailable: _0x2b9903,
    isViewingDouyinVideoPage: _0x32875d,
    isVisibleElement: _0x1b22e4,
    listLeadgenScrapeAwemes: _0x49d3d0,
    clearLeadgenScrapeAwemeCache: _0xe0fd77,
    loadClassifyLiveRoomAvailability: _0x2c4be1,
    lockFeedLeadVideoUrl: _0x33457d,
    moveToNextVideo: _0x6755ad,
    normalizeDouyinAuthorProfileUrl: _0x2dea5c,
    normalizeSearchQueueVideoUrl: _0x3866ca,
    normalizeUrl: _0x8685ae,
    openSearchQueueVideoByUrl: _0x16a8bf,
    parseDouyinCommentNode: _0x46559f,
    pauseVisibleDouyinVideos: _0x38705e,
    pickLeadVideoUrl: _0x208cf8,
    pruneStaleCommentDom: _0x8b1228,
    queryCommentItemNodes: _0x340fc5,
    rememberPendingLeadVideoUrl: _0x3ea3e8,
    resolveCommentPanelRoot: _0x52bff0,
    resolveCurrentVisibleVideoUrl: _0x344dfe,
    resolveDouyinVideoDetailModal: _0x288445,
    scrollCommentList: _0x26bd7c,
    shouldAbort: _0x15c8a7,
    simulateHumanClick: _0x4f4edb,
    skipDouyinFeedLiveStream: _0xe64dea,
    sleep: _0x144308,
    startCurrentVideoPauseGuard: _0x2049ee,
    suspendAutomationForNavigation: _0x6da8a4,
    syncSpecificVideoPauseWatcher: _0x47da40,
    waitAndCaptureCurrentVideoMetadata: _0x51cfcb,
    waitForVideoDetailReadyAndPause: _0x36104d,
    waitLeadgenScrapeAwemeAuthor: _0x4fa024,
    webFrame: _0x3275b5,
    preloadDir: _0x104912,
    state: _0x51db40
  } = _0xd89262;
  if (!_0x51db40) {
    throw new TypeError("createEntityLeadgenController requires a runtime state bridge");
  }
  let _0x261e0c = 0;
  const _0x2ad609 = new Map();
  let _0x55f864 = false;
  let _0x71c55c = false;
  let _0x33ed32 = 0;
  let _0x591e5f = null;
  let _0xfbe77f = {
    taskId: "",
    accountId: "",
    accountName: "",
    generation: null
  };
  function _0x4a8389() {
    try {
      const _0x64028c = typeof _0x288445 === "function" ? _0x288445({
        includeFeed: true
      }) : null;
      return _0x64028c || document.body || document;
    } catch (_0x2dd404) {
      return document;
    }
  }
  function _0x5c0002(_0x281982 = "", _0x582601 = {}) {
    const _0x4a7081 = !!_0x582601.allowFeed;
    const _0x2da5e7 = String(window.location.href || "");
    const _0x2bbc38 = _0x59d57b(_0x281982) || _0x57b5f3(_0x281982) || "";
    const _0x191411 = _0x2da5e7.includes("/search/") && !_0x2da5e7.includes("modal_id=") && !_0x2da5e7.includes("/video/") && !_0x2da5e7.includes("/note/");
    let _0x349961 = null;
    let _0x481bda = null;
    try {
      _0x349961 = typeof _0x288445 === "function" ? _0x288445({
        includeFeed: false
      }) : null;
    } catch (_0x3b8c79) {}
    if (_0x4a7081) {
      try {
        _0x481bda = typeof _0x288445 === "function" ? _0x288445({
          includeFeed: true
        }) : null;
      } catch (_0x4f75f8) {}
    }
    const _0x49627c = !!_0x349961 && !!_0x1b22e4(_0x349961);
    const _0x273311 = !!_0x481bda && !!_0x1b22e4(_0x481bda);
    if (_0x191411 && !_0x49627c) {
      return false;
    }
    let _0x10ccfb = null;
    try {
      _0x10ccfb = typeof _0x4e1828 === "function" ? _0x4e1828() : null;
    } catch (_0x2ce9ee) {}
    const _0x548948 = !!_0x10ccfb && (!_0x1b22e4 || !!_0x1b22e4(_0x10ccfb));
    const _0x100ffc = typeof _0x32875d === "function" ? _0x32875d(_0x2da5e7) : /\/(?:video|note)\//.test(_0x2da5e7) || /modal_id=/.test(_0x2da5e7);
    if (!_0x100ffc && !_0x49627c && (!_0x4a7081 || !_0x548948 && !_0x273311)) {
      return false;
    }
    const _0x14b247 = _0x49627c ? _0x349961 : _0x4a7081 && _0x273311 ? _0x481bda : _0x10ccfb || document;
    let _0x25ea7b = "";
    try {
      const _0x4c5bdb = typeof _0x344dfe === "function" ? _0x344dfe(typeof _0x8685ae === "function" ? _0x8685ae(_0x2da5e7) : _0x2da5e7, _0x14b247) : "";
      _0x25ea7b = _0x59d57b(_0x4c5bdb) || _0x57b5f3(_0x4c5bdb) || _0x59d57b(_0x2da5e7) || _0x57b5f3(_0x2da5e7) || "";
      if (!_0x25ea7b && _0x4a7081 && typeof _0x51db40.lockedLeadVideoUrl === "string" && _0x51db40.lockedLeadVideoUrl) {
        _0x25ea7b = _0x59d57b(_0x51db40.lockedLeadVideoUrl) || _0x57b5f3(_0x51db40.lockedLeadVideoUrl) || "";
      }
    } catch (_0x25d4cd) {
      _0x25ea7b = _0x59d57b(_0x2da5e7) || _0x57b5f3(_0x2da5e7) || "";
    }
    if (_0x2bbc38 && _0x25ea7b && String(_0x2bbc38) !== String(_0x25ea7b)) {
      return false;
    }
    const _0x16d156 = Array.from(_0x14b247.querySelectorAll?.("video, img, canvas") || []).some(_0x44e042 => _0x1b22e4(_0x44e042));
    let _0x122041 = false;
    try {
      _0x122041 = typeof _0x518060 === "function" && _0x518060() !== "未知视频";
    } catch (_0x7db07c) {}
    if (/\/search\//i.test(_0x2da5e7) || /[?&]modal_id=/i.test(_0x2da5e7)) {
      return !!_0x49627c && (!!_0x16d156 || !!_0x122041 || !!_0x25ea7b);
    }
    if (_0x4a7081 && !_0x49627c) {
      return !!_0x16d156 || !!_0x122041 || !!_0x25ea7b || !!_0x548948 || !!_0x273311;
    }
    return !!_0x16d156 || !!_0x122041 || !!_0x49627c;
  }
  async function _0x33d010(_0x1f0a95, _0xa3031, _0x66ff4c = "", _0x135bb7 = 10000) {
    const _0x105523 = String(_0x66ff4c || "").trim();
    _0x4125a9({
      taskId: _0xa3031,
      message: "正在确认是否已进入指定视频…",
      level: "info"
    });
    if (typeof _0x36104d === "function") {
      try {
        const _0xe0523c = await _0x36104d("ENTITY_LEADGEN", _0x105523, _0x135bb7);
        if (_0x1f0a95 !== _0x261e0c) {
          return {
            ready: false,
            cancelled: true
          };
        }
        if (_0xe0523c && _0x5c0002(_0x105523)) {
          _0x215a68("线索采集：确认进入视频后锁定暂停");
          return {
            ready: true
          };
        }
      } catch (_0x252efc) {
        if (String(_0x252efc?.message || _0x252efc) === "TASK_ABORTED" || _0x1f0a95 !== _0x261e0c) {
          return {
            ready: false,
            cancelled: true
          };
        }
      }
    }
    const _0x28cb85 = Date.now();
    while (Date.now() - _0x28cb85 < Math.min(4000, _0x135bb7)) {
      if (_0x1f0a95 !== _0x261e0c) {
        return {
          ready: false,
          cancelled: true
        };
      }
      _0x38705e(_0x4a8389(), "线索采集：等待进入视频期间锁定暂停");
      if (_0x5c0002(_0x105523)) {
        _0x215a68("线索采集：确认进入视频后锁定暂停");
        return {
          ready: true
        };
      }
      if (!(await _0x155f4c(350 + Math.random() * 200, _0x1f0a95))) {
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
  async function _0x179306(_0x2bb35b, _0x43d4e1, _0x4c745b = "", _0x4e593a = 20000) {
    const _0x9794ec = String(_0x4c745b || "").trim();
    try {
      _0x2dffb3();
    } catch (_0x3d4576) {}
    const _0x1ca1c0 = Date.now();
    let _0x2c766c = 0;
    let _0x4da593 = 0;
    let _0x2091e2 = -1;
    const _0x3231b0 = Number(_0x460279) > 0 ? Number(_0x460279) : 15000;
    const _0x4ff9dd = Math.max(8000, Number(_0x4e593a) || 20000);
    _0x4125a9({
      taskId: _0x43d4e1,
      message: "正在检测视频是否有效…",
      level: "info"
    });
    while (_0x2bb35b === _0x261e0c && Date.now() - _0x1ca1c0 < _0x4ff9dd) {
      try {
        _0x38705e(_0x4a8389(), "线索采集：等待视频有效性确认期间暂停");
      } catch (_0x122209) {}
      if (_0x5c0002(_0x9794ec)) {
        _0x215a68("线索采集：确认进入视频后锁定暂停");
        return {
          status: "ready",
          cancelled: false
        };
      }
      let _0x491239 = "waiting";
      try {
        if (typeof _0x554e84 === "function") {
          _0x491239 = _0x554e84(_0x9794ec);
        }
      } catch (_0x5905b0) {
        _0x491239 = "waiting";
      }
      if (_0x491239 === "ready") {
        _0x215a68("线索采集：确认进入视频后锁定暂停");
        return {
          status: "ready",
          cancelled: false
        };
      }
      if (_0x491239 === "unavailable") {
        _0x2c766c += 1;
        if (_0x2c766c >= 3) {
          return {
            status: "unavailable",
            reason: "unavailable",
            cancelled: false
          };
        }
      } else {
        _0x2c766c = 0;
      }
      if (_0x491239 === "loading") {
        _0x4da593 = 0;
        const _0x13e096 = Math.floor((Date.now() - _0x1ca1c0) / 1000);
        if (_0x13e096 !== _0x2091e2 && (_0x13e096 === 0 || _0x13e096 % 5 === 0)) {
          _0x2091e2 = _0x13e096;
          _0x4125a9({
            taskId: _0x43d4e1,
            message: "视频加载中，耐心等待… (" + _0x13e096 + "s/" + Math.floor(_0x4ff9dd / 1000) + "s)",
            level: "info"
          });
        }
        if (!(await _0x155f4c(500 + Math.random() * 300, _0x2bb35b))) {
          return {
            status: "cancelled",
            cancelled: true
          };
        }
        continue;
      }
      if (_0x491239 === "bare_jingxuan") {
        _0x4da593 += 1;
        if (_0x4da593 >= 3 && Date.now() - _0x1ca1c0 >= _0x3231b0) {
          return {
            status: "unavailable",
            reason: "bare_jingxuan",
            cancelled: false
          };
        }
      } else {
        _0x4da593 = 0;
      }
      if (!(await _0x155f4c(400 + Math.random() * 250, _0x2bb35b))) {
        return {
          status: "cancelled",
          cancelled: true
        };
      }
    }
    if (_0x2bb35b !== _0x261e0c) {
      return {
        status: "cancelled",
        cancelled: true
      };
    }
    if (_0x5c0002(_0x9794ec)) {
      _0x215a68("线索采集：确认进入视频后锁定暂停");
      return {
        status: "ready",
        cancelled: false
      };
    }
    let _0x2a52c0 = "waiting";
    try {
      if (typeof _0x554e84 === "function") {
        _0x2a52c0 = _0x554e84(_0x9794ec);
      }
    } catch (_0x2f33d8) {}
    if (_0x2a52c0 === "ready") {
      _0x215a68("线索采集：确认进入视频后锁定暂停");
      return {
        status: "ready",
        cancelled: false
      };
    }
    if (_0x2a52c0 === "unavailable" || _0x2a52c0 === "bare_jingxuan") {
      return {
        status: "unavailable",
        reason: _0x2a52c0,
        cancelled: false
      };
    }
    try {
      if (typeof _0x2b9903 === "function" && _0x2b9903()) {
        return {
          status: "unavailable",
          reason: "unavailable",
          cancelled: false
        };
      }
    } catch (_0x30ff52) {}
    return {
      status: "timeout",
      cancelled: false
    };
  }
  function _0x5f17f0() {
    if (_0x591e5f?.stop) {
      try {
        _0x591e5f.stop();
      } catch (_0x577a2c) {}
    }
    _0x591e5f = null;
  }
  function _0x325c29(_0x216bd3 = "") {
    const _0x2e1d4d = _0x59d57b(_0x216bd3) || _0x57b5f3(_0x216bd3) || String(_0x216bd3 || "").trim();
    if (window.__radarEntityFeedSwipeLockInstalled) {
      window.__radarEntityExpectedVideoId = String(_0x2e1d4d || window.__radarEntityExpectedVideoId || "");
      return;
    }
    const _0x205a8c = _0x218866 => {
      try {
        if (!_0x218866) {
          return false;
        }
        const _0x155146 = _0x4a8389();
        const _0x1311a4 = typeof _0x52bff0 === "function" ? _0x52bff0(_0x155146) : null;
        if (_0x1311a4 && (_0x1311a4 === _0x218866 || _0x1311a4.contains?.(_0x218866))) {
          return true;
        }
        const _0x432596 = typeof _0x218866.closest === "function" ? _0x218866.closest("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"comment-input\"], [class*=\"CommentList\"], [class*=\"comment-list\"], [class*=\"comment-main\"], [class*=\"CommentPanel\"], [class*=\"comment-panel\"], [class*=\"comment-content\"]") : null;
        return !!_0x432596;
      } catch (_0x49129e) {
        return false;
      }
    };
    const _0xdce532 = _0x114133 => {
      if (_0x205a8c(_0x114133.target)) {
        try {
          _0x114133.stopPropagation();
        } catch (_0x1bf544) {}
        return;
      }
      try {
        _0x114133.preventDefault();
        _0x114133.stopPropagation();
      } catch (_0x44fe74) {}
    };
    const _0x866f56 = _0x185365 => {
      if (!/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End)$/.test(_0x185365.key || "")) {
        return;
      }
      if (_0x205a8c(_0x185365.target)) {
        try {
          _0x185365.stopPropagation();
        } catch (_0x58c658) {}
        return;
      }
      try {
        _0x185365.preventDefault();
        _0x185365.stopPropagation();
      } catch (_0x33fcd4) {}
    };
    const _0x7e9462 = _0x41f431 => {
      if (_0x205a8c(_0x41f431.target)) {
        return;
      }
      try {
        _0x41f431.preventDefault();
        _0x41f431.stopPropagation();
      } catch (_0x2a7694) {}
    };
    document.addEventListener("wheel", _0xdce532, {
      capture: true,
      passive: false
    });
    window.addEventListener("wheel", _0xdce532, {
      capture: true,
      passive: false
    });
    document.addEventListener("keydown", _0x866f56, true);
    window.addEventListener("keydown", _0x866f56, true);
    document.addEventListener("touchmove", _0x7e9462, {
      capture: true,
      passive: false
    });
    window.__radarEntityFeedSwipeLockInstalled = true;
    window.__radarEntityExpectedVideoId = String(_0x2e1d4d || "");
    window.__radarEntityFeedSwipeLockCleanup = () => {
      document.removeEventListener("wheel", _0xdce532, {
        capture: true
      });
      window.removeEventListener("wheel", _0xdce532, {
        capture: true
      });
      document.removeEventListener("keydown", _0x866f56, true);
      window.removeEventListener("keydown", _0x866f56, true);
      document.removeEventListener("touchmove", _0x7e9462, {
        capture: true
      });
      window.__radarEntityFeedSwipeLockInstalled = false;
      window.__radarEntityExpectedVideoId = "";
      window.__radarEntityFeedSwipeLockCleanup = null;
    };
  }
  function _0x4aa343() {
    try {
      if (typeof window.__radarEntityFeedSwipeLockCleanup === "function") {
        window.__radarEntityFeedSwipeLockCleanup();
      }
    } catch (_0x7dbd1d) {}
    window.__radarEntityFeedSwipeLockInstalled = false;
    window.__radarEntityExpectedVideoId = "";
  }
  function _0xfb6a3a(_0x4a1c72 = "") {
    const _0x2812d7 = String(window.location.href || "");
    const _0x35637a = _0x4a8389();
    try {
      const _0x303556 = typeof _0x344dfe === "function" ? _0x344dfe(typeof _0x8685ae === "function" ? _0x8685ae(_0x2812d7) : _0x2812d7, _0x35637a) : "";
      return _0x59d57b(_0x303556) || _0x57b5f3(_0x303556) || _0x59d57b(_0x2812d7) || _0x57b5f3(_0x2812d7) || _0x59d57b(_0x4a1c72) || "";
    } catch (_0x17ba83) {
      return _0x59d57b(_0x2812d7) || _0x57b5f3(_0x2812d7) || "";
    }
  }
  function _0x1b21ff(_0x35b2cb = "") {
    const _0x61cbf2 = _0x59d57b(_0x35b2cb) || _0x57b5f3(_0x35b2cb) || String(window.__radarEntityExpectedVideoId || "").trim();
    if (!_0x61cbf2) {
      return false;
    }
    const _0x2eddc2 = _0xfb6a3a(_0x35b2cb);
    if (!_0x2eddc2) {
      return false;
    }
    return String(_0x2eddc2) !== String(_0x61cbf2);
  }
  function _0x215a68(_0xe72b99 = "线索采集：进入视频后立即暂停", _0x311138 = {}) {
    const _0x574d47 = _0x311138.scope && _0x1b22e4?.(_0x311138.scope) ? _0x311138.scope : null;
    const _0x1ccb9a = _0x574d47 || _0x4a8389();
    _0x38705e(_0x1ccb9a, _0xe72b99);
    if (_0x591e5f && !_0x591e5f.stopped && _0x311138.reuseActive !== false && _0x591e5f.scope === _0x1ccb9a) {
      return _0x591e5f;
    }
    _0x5f17f0();
    let _0x55c086 = "";
    try {
      _0x55c086 = (typeof _0x208cf8 === "function" ? _0x208cf8(_0x51db40.lockedLeadVideoUrl || "", _0x1ccb9a) : "") || (typeof _0x344dfe === "function" ? _0x344dfe(typeof _0x8685ae === "function" ? _0x8685ae(window.location.href) : window.location.href, _0x1ccb9a) : "");
    } catch (_0x22c248) {}
    const _0x1bf4a7 = {
      scope: _0x1ccb9a,
      isFeedPlayback: _0x311138.isFeedPlayback === true,
      leadVideoUrl: _0x55c086 || window.location.href || "",
      videoTitle: typeof _0x518060 === "function" ? _0x518060(_0x1ccb9a) || "" : ""
    };
    const _0x85661e = {
      pauseOnly: true
    };
    if (Number(_0x311138.intervalMs) > 0) {
      _0x85661e.intervalMs = Number(_0x311138.intervalMs);
    }
    _0x591e5f = _0x2049ee(_0x1bf4a7, _0x311138.loopId || "ENTITY_LEADGEN", _0x85661e);
    try {
      _0x591e5f.scope = _0x1ccb9a;
    } catch (_0x3f2dc1) {}
    return _0x591e5f;
  }
  function _0x4125a9(_0x45db95 = {}) {
    try {
      _0x169ee9.send("entity-leadgen-collect-progress", {
        taskId: _0xfbe77f.taskId,
        accountId: _0xfbe77f.accountId,
        accountName: _0xfbe77f.accountName,
        generation: _0xfbe77f.generation,
        skipIngest: !!_0xfbe77f.skipIngest,
        ..._0x45db95
      });
    } catch (_0x1ef321) {}
  }
  function _0x15c6c2(_0x11bb93 = {}) {
    _0xfbe77f = {
      ..._0xfbe77f,
      taskId: _0x11bb93.taskId || _0xfbe77f.taskId || "",
      accountId: _0x11bb93.accountId || _0xfbe77f.accountId || "",
      accountName: _0x11bb93.accountName || _0x11bb93.nickname || _0xfbe77f.accountName || "",
      generation: _0x11bb93.generation != null ? Number(_0x11bb93.generation) : _0xfbe77f.generation,
      skipIngest: _0x11bb93.skipIngest != null ? !!_0x11bb93.skipIngest : _0xfbe77f.skipIngest !== false,
      runningSource: String(_0x11bb93.runningSource || _0xfbe77f.runningSource || "").trim()
    };
    const _0x8fb18b = String(_0x11bb93.runningSource || _0xfbe77f.runningSource || "").trim();
    if (_0x8fb18b) {
      _0x51db40.currentRunningSource = _0x8fb18b;
      _0x47da40();
    }
    try {
      const _0x14c75f = String(_0xfbe77f.accountId || "").trim();
      if (_0x14c75f) {
        window._radar_account_id = _0x14c75f;
        sessionStorage.setItem("radar_account_id", _0x14c75f);
      }
    } catch (_0x2b381d) {}
  }
  function _0x236e9d(_0x27f26f, _0x167892 = "", _0x4f20dc = "", _0x5a77fb = "") {
    const _0x2df1d5 = _0x2dea5c(_0x27f26f) || String(_0x27f26f || "").trim();
    if (_0x2df1d5) {
      const _0x51f8c9 = _0x12e1b6(_0x2df1d5);
      if (_0x51f8c9) {
        return _0x51f8c9;
      }
      return _0x2df1d5;
    }
    const _0xd75880 = String(_0x4f20dc || "").trim();
    if (/^\d{5,24}$/.test(_0xd75880) && !/^0+$/.test(_0xd75880) && _0xd75880 !== "111111") {
      return "uid:" + _0xd75880;
    }
    const _0x2a0f49 = String(_0x5a77fb || "").trim();
    if (_0x2a0f49.length >= 15 && /^[A-Za-z0-9_\-]+$/.test(_0x2a0f49)) {
      return "webcast:" + _0x2a0f49;
    }
    const _0x27ee55 = String(_0x167892 || "").trim();
    if (_0x27ee55) {
      return "name:" + _0x27ee55;
    } else {
      return "";
    }
  }
  function _0x10e01c(_0x407ac1) {
    const _0x3266b0 = String(_0x407ac1 || "").trim();
    if (!_0x3266b0) {
      return "https://www.douyin.com/search";
    }
    return "https://www.douyin.com/search/" + encodeURIComponent(_0x3266b0) + "?type=user";
  }
  function _0x34975f() {
    _0x2ad609.clear();
    _0x33ed32 = 0;
  }
  function _0x143b77(_0xdc7f02) {
    if (_0xdc7f02 == null || _0xdc7f02 === "") {
      return null;
    }
    if (typeof _0xdc7f02 === "number" && Number.isFinite(_0xdc7f02) && _0xdc7f02 >= 0) {
      return Math.floor(_0xdc7f02);
    }
    const _0x3338dd = String(_0xdc7f02).trim().replace(/,/g, "");
    if (!_0x3338dd) {
      return null;
    }
    const _0x1019c0 = _0x3338dd.match(/^(\d+(?:\.\d+)?)\s*万/);
    if (_0x1019c0) {
      return Math.floor(Number(_0x1019c0[1]) * 10000);
    }
    const _0x530268 = _0x3338dd.match(/^(\d+(?:\.\d+)?)\s*亿/);
    if (_0x530268) {
      return Math.floor(Number(_0x530268[1]) * 100000000);
    }
    const _0x121ccb = Number(_0x3338dd.replace(/[^\d.]/g, ""));
    if (Number.isFinite(_0x121ccb) && _0x121ccb >= 0) {
      return Math.floor(_0x121ccb);
    } else {
      return null;
    }
  }
  function _0x28bd0d(_0x33fb7e) {
    switch (String(_0x33fb7e || "0")) {
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
  function _0x38bd9(_0x2f66f4, _0x699031) {
    const _0x2be1b5 = _0x28bd0d(_0x699031);
    if (!_0x2be1b5) {
      return true;
    }
    const _0x3751ad = _0x143b77(_0x2f66f4);
    if (_0x3751ad == null) {
      return false;
    }
    if (_0x3751ad < _0x2be1b5.min) {
      return false;
    }
    if (_0x2be1b5.max != null && _0x3751ad >= _0x2be1b5.max) {
      return false;
    }
    return true;
  }
  function _0x4bd97f(_0x38e918) {
    const _0x546ab3 = _0x143b77(_0x38e918);
    if (_0x546ab3 == null) {
      return "未知";
    }
    if (_0x546ab3 >= 100000000) {
      return (_0x546ab3 / 100000000).toFixed(1).replace(/\.0$/, "") + "亿";
    }
    if (_0x546ab3 >= 10000) {
      return (_0x546ab3 / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    }
    return String(_0x546ab3);
  }
  function _0x45cf44(..._0x29a28c) {
    const _0x4a1bf7 = new Map();
    _0x29a28c.flat().filter(Boolean).forEach(_0x1a054d => {
      const _0xd32575 = String(_0x1a054d.messageId || _0x1a054d.msgId || "").trim();
      const _0x1b9b91 = _0xd32575 ? "id:" + _0xd32575 : [_0x1a054d.method || _0x1a054d.type || "", _0x1a054d.occurredAt || _0x1a054d.observedAt || "", _0x1a054d.content || _0x1a054d.text || ""].join("|");
      if (!_0x4a1bf7.has(_0x1b9b91)) {
        _0x4a1bf7.set(_0x1b9b91, _0x1a054d);
      }
    });
    return [..._0x4a1bf7.values()].sort((_0xacce6a, _0x107d2b) => Number(_0xacce6a.occurredAt || _0xacce6a.observedAt || 0) - Number(_0x107d2b.occurredAt || _0x107d2b.observedAt || 0)).slice(-500);
  }
  const _0x32a37a = Object.freeze(["enter", "like", "follow", "comment", "interaction", "gift"]);
  function _0x11f483(_0x34b2a8) {
    if (!Array.isArray(_0x34b2a8)) {
      return [..._0x32a37a];
    }
    const _0x117f2b = new Set(_0x32a37a);
    return [...new Set(_0x34b2a8.filter(_0x18c4e6 => _0x117f2b.has(_0x18c4e6)))];
  }
  function _0x18bad5(_0x58a10a = {}) {
    const _0x53f505 = String(_0x58a10a.category || _0x58a10a.eventCategory || "").trim();
    if (_0x32a37a.includes(_0x53f505)) {
      return _0x53f505;
    }
    const _0x3eb213 = String(_0x58a10a.method || _0x58a10a.type || "").trim();
    const _0x366a1b = String(_0x58a10a.content || _0x58a10a.text || "").trim();
    if (/ChatMessage/i.test(_0x3eb213)) {
      return "comment";
    }
    if (/MemberMessage/i.test(_0x3eb213)) {
      return "enter";
    }
    if (/LikeMessage/i.test(_0x3eb213)) {
      return "like";
    }
    if (/GiftMessage/i.test(_0x3eb213)) {
      return "gift";
    }
    if (/SocialMessage/i.test(_0x3eb213)) {
      if (/关注|follow/i.test((_0x58a10a.action || "") + " " + _0x366a1b)) {
        return "follow";
      } else {
        return "interaction";
      }
    }
    if (/进入直播间|进房|来了/.test(_0x366a1b)) {
      return "enter";
    }
    if (/点赞|赞了直播间/.test(_0x366a1b)) {
      return "like";
    }
    if (/关注了主播|关注主播/.test(_0x366a1b)) {
      return "follow";
    }
    if (/评论|弹幕|发言/.test(_0x366a1b)) {
      return "comment";
    }
    if (/送礼|礼物|赠送/.test(_0x366a1b)) {
      return "gift";
    }
    return "interaction";
  }
  function _0x499bad(_0x1612b0 = {}, _0x217589 = "any") {
    const _0x5ee9ac = String(_0x1612b0.nickname || _0x1612b0.nickName || _0x1612b0.nick_name || "").trim().replace(/^@+/, "");
    const _0x4e4339 = String(_0x1612b0.secUid || _0x1612b0.sec_uid || "").trim();
    const _0x520471 = String(_0x1612b0.uid || _0x1612b0.id_str || _0x1612b0.idStr || _0x1612b0.user_id || "").trim();
    const _0x37b28b = /^\d{5,24}$/.test(_0x520471) && !/^0+$/.test(_0x520471) && _0x520471 !== "111111" ? _0x520471 : "";
    const _0x4f88fb = String(_0x1612b0.webcastUid || _0x1612b0.webcast_uid || _0x1612b0.webcast_uid_str || "").trim();
    const _0x1f63fe = !_0x37b28b && !_0x4e4339 && _0x4f88fb.length >= 15 && _0x4f88fb !== "111111" && /^[A-Za-z0-9_\-]+$/.test(_0x4f88fb) ? _0x4f88fb : "";
    let _0x576b66 = _0x2dea5c(_0x1612b0.userUrl || _0x1612b0.profileUrl || "");
    if (!_0x4e4339 && _0x1f63fe) {
      _0x576b66 = "";
    }
    if (!_0x576b66 && _0x4e4339 && !/^(self|login)$/i.test(_0x4e4339)) {
      _0x576b66 = "https://www.douyin.com/user/" + _0x4e4339;
    }
    const _0x4e61c7 = String(_0x1612b0.userKey || "").trim() || _0x236e9d(_0x576b66, _0x5ee9ac, _0x37b28b, _0x1f63fe);
    if (!_0x4e61c7 || !_0x5ee9ac || !_0x576b66 && !_0x37b28b && !_0x1f63fe) {
      return false;
    }
    if (/^(关注|粉丝|获赞|私信|回关|已关注|相互关注|互相关注)$/.test(_0x5ee9ac)) {
      return false;
    }
    const _0x5f43bd = _0x1612b0.followStatus ?? _0x1612b0.follow_status ?? _0x1612b0.follower_status;
    const _0x37dd76 = _0x143b77(_0x1612b0.followerCount ?? _0x1612b0.follower_count ?? _0x1612b0.fansCount ?? _0x1612b0.fans_count);
    const _0x46f719 = _0x2ad609.get(_0x4e61c7);
    const _0x5927a8 = Array.isArray(_0x1612b0.liveEvents) ? _0x1612b0.liveEvents : _0x1612b0.liveEvent ? [_0x1612b0.liveEvent] : [];
    const _0x1c6084 = _0x45cf44(_0x46f719?.liveEvents || [], _0x5927a8);
    const _0x1e985d = _0x1c6084[_0x1c6084.length - 1] || _0x1612b0.liveEvent || _0x46f719?.liveEvent || null;
    _0x2ad609.set(_0x4e61c7, {
      uid: _0x37b28b || _0x46f719?.uid || "",
      secUid: _0x4e4339 || _0x46f719?.secUid || "",
      webcastUid: _0x1f63fe || _0x46f719?.webcastUid || "",
      privacyMasked: _0x1612b0.privacyMasked ?? _0x46f719?.privacyMasked ?? _0x5ee9ac.includes("*"),
      identityType: _0x1612b0.identityType || _0x46f719?.identityType || (_0x4e4339 ? "profile" : _0x1f63fe ? "webcast" : "numeric"),
      profileAvailable: _0x1612b0.profileAvailable ?? _0x46f719?.profileAvailable ?? !!_0x4e4339,
      profileUnavailable: _0x1612b0.profileUnavailable ?? _0x46f719?.profileUnavailable ?? !_0x4e4339,
      profileUnavailableReason: String(_0x1612b0.profileUnavailableReason || _0x46f719?.profileUnavailableReason || (!_0x4e4339 && _0x1f63fe ? "主播设置不支持查看他人资料" : "")),
      nickname: _0x5ee9ac,
      userUrl: _0x576b66,
      userKey: _0x4e61c7,
      sourceHint: _0x217589 === "live" ? "live" : _0x217589 || _0x46f719?.sourceHint || "any",
      followStatus: _0x5f43bd ?? _0x46f719?.followStatus,
      followerCount: _0x37dd76 ?? _0x46f719?.followerCount ?? null,
      content: String(_0x1612b0.content || _0x1e985d?.content || _0x46f719?.content || "").trim(),
      timeText: String(_0x1612b0.timeText || _0x1612b0.time || _0x46f719?.timeText || "").trim(),
      time: String(_0x1612b0.time || _0x1612b0.timeText || _0x46f719?.time || _0x46f719?.timeText || "").trim(),
      ipLocation: String(_0x1612b0.ipLocation || _0x1612b0.location || _0x46f719?.ipLocation || "").trim(),
      location: String(_0x1612b0.location || _0x1612b0.ipLocation || _0x46f719?.location || _0x46f719?.ipLocation || "").trim(),
      liveEvent: _0x1e985d,
      liveEvents: _0x1c6084,
      messageId: String(_0x1612b0.messageId || _0x1e985d?.messageId || _0x46f719?.messageId || "").trim(),
      eventTimestamp: Number(_0x1612b0.eventTimestamp || _0x1e985d?.occurredAt || _0x46f719?.eventTimestamp || 0) || 0
    });
    return true;
  }
  function _0x451d60(_0x407c9b = {}) {
    const _0x8b35e2 = Array.isArray(_0x407c9b.users) ? _0x407c9b.users : [];
    if (!_0x8b35e2.length) {
      return;
    }
    _0x33ed32 += 1;
    const _0x3a021b = String(_0x407c9b.hint || "any");
    let _0x3a1af2 = 0;
    _0x8b35e2.forEach(_0x57cbae => {
      if (_0x499bad(_0x57cbae, _0x3a021b)) {
        _0x3a1af2 += 1;
      }
    });
    if (_0x3a1af2 > 0) {
      console.log("[EntityLeadgen][API] hit=" + _0x33ed32 + " hint=" + _0x3a021b + " +" + _0x3a1af2 + " total=" + _0x2ad609.size);
    }
  }
  function _0x36a380() {
    if (window.__radar_entity_api_bridge) {
      return;
    }
    window.__radar_entity_api_bridge = true;
    const _0x17271b = _0x3b5500 => {
      try {
        _0x451d60(_0x3b5500?.detail || {});
      } catch (_0x440973) {
        console.warn("[EntityLeadgen][API] bridge error:", _0x440973?.message || _0x440973);
      }
    };
    document.addEventListener("__radar_entity_api", _0x17271b);
    document.addEventListener("__radar_entity_live", _0x17271b);
  }
  function _0x5b2e6a() {
    _0x36a380();
    let _0xedef1b = "";
    try {
      const _0x4515eb = (() => {
        try {
          return require("path");
        } catch (_0x5ad18a) {
          return null;
        }
      })();
      const _0x3d34f9 = ["./entityLeadgenApiHook", "./entityLeadgenApiHook.js"];
      if (_0x4515eb && typeof _0x104912 === "string") {
        _0x3d34f9.push(_0x4515eb.join(_0x104912, "shared", "entityLeadgenApiHook.js"), _0x4515eb.join(_0x104912, "..", "shared", "entityLeadgenApiHook.js"));
      }
      for (const _0x16dba8 of _0x3d34f9) {
        try {
          const _0x516d4a = require(_0x16dba8);
          if (typeof _0x516d4a?.getEntityLeadgenApiHookInstaller === "function") {
            const _0x398de1 = typeof _0x208935 === "function" ? _0x208935() : null;
            _0xedef1b = _0x516d4a.getEntityLeadgenApiHookInstaller(_0x398de1);
            break;
          }
        } catch (_0x3209aa) {}
      }
    } catch (_0x57177e) {}
    if (!_0xedef1b) {
      console.warn("[EntityLeadgen][API] installer module missing");
      _0x55f864 = false;
      return false;
    }
    try {
      const _0xecab65 = document.createElement("script");
      _0xecab65.textContent = sanitizeInlinePageScript(_0xedef1b);
      const _0x2cb818 = document.documentElement || document.head || document.body;
      if (!_0x2cb818) {
        _0x55f864 = false;
        return false;
      }
      _0x2cb818.appendChild(_0xecab65);
      _0xecab65.remove();
      _0x55f864 = true;
    } catch (_0x2fa145) {
      console.warn("[EntityLeadgen][API] inject failed:", _0x2fa145?.message || _0x2fa145);
      _0x55f864 = false;
    }
    return _0x55f864;
  }
  function _0x1183b2() {
    _0x36a380();
    let _0x26bac4 = "";
    try {
      const _0x14b977 = (() => {
        try {
          return require("path");
        } catch (_0x11dfd6) {
          return null;
        }
      })();
      const _0x2c3d87 = ["./entityLeadgenLiveHook", "./entityLeadgenLiveHook.js"];
      if (_0x14b977 && typeof _0x104912 === "string") {
        _0x2c3d87.push(_0x14b977.join(_0x104912, "shared", "entityLeadgenLiveHook.js"), _0x14b977.join(_0x104912, "..", "shared", "entityLeadgenLiveHook.js"));
      }
      for (const _0x5f49c7 of _0x2c3d87) {
        try {
          const _0x47d401 = require(_0x5f49c7);
          if (typeof _0x47d401?.getEntityLeadgenLiveHookInstaller === "function") {
            _0x26bac4 = _0x47d401.getEntityLeadgenLiveHookInstaller();
            break;
          }
        } catch (_0x3a7940) {}
      }
    } catch (_0x18364e) {}
    if (!_0x26bac4) {
      _0x71c55c = false;
      return false;
    }
    try {
      if (_0x3275b5 && typeof _0x3275b5.executeJavaScript === "function") {
        _0x3275b5.executeJavaScript(_0x26bac4, true).catch(() => {});
        _0x71c55c = true;
        return true;
      }
      const _0x3a5ef2 = document.createElement("script");
      _0x3a5ef2.textContent = sanitizeInlinePageScript(_0x26bac4);
      const _0x3ceed3 = document.documentElement || document.head || document.body;
      if (!_0x3ceed3) {
        _0x71c55c = false;
        return false;
      }
      _0x3ceed3.appendChild(_0x3a5ef2);
      _0x3a5ef2.remove();
      _0x71c55c = true;
    } catch (_0x447c89) {
      console.warn("[EntityLeadgen][Live] inject failed:", _0x447c89?.message || _0x447c89);
      _0x71c55c = false;
    }
    return _0x71c55c;
  }
  function _0x2a0c74(_0x359287, {
    userFanCount = "0",
    liveEventTypes = null
  } = {}) {
    const _0x8e6899 = [];
    let _0x3a8341 = 0;
    const _0x23b701 = [];
    const _0x320c84 = new Set(_0x11f483(liveEventTypes));
    for (const _0x2c919b of _0x2ad609.values()) {
      const _0x527eec = _0x2c919b.sourceHint || "any";
      if (_0x359287 === "blogger") {
        if (_0x527eec === "user" || _0x527eec === "mutual" || _0x527eec === "following" || _0x527eec === "live" || _0x527eec === "comment") {
          continue;
        }
      } else if (_0x359287 === "user") {
        if (_0x527eec === "blogger" || _0x527eec === "mutual" || _0x527eec === "following" || _0x527eec === "live" || _0x527eec === "comment") {
          continue;
        }
      } else if (_0x359287 === "mutual") {
        if (_0x527eec === "live" || _0x527eec === "comment") {
          continue;
        }
        const _0x432f1d = Number(_0x2c919b.followStatus);
        if (_0x432f1d === 2 || _0x432f1d === 4) {} else if ((_0x527eec === "mutual" || _0x527eec === "relation") && window.__radar_entity_mutual_filter_active) {} else {
          continue;
        }
      } else if (_0x359287 === "following") {
        if (_0x527eec === "live" || _0x527eec === "comment" || _0x527eec === "user" || _0x527eec === "blogger") {
          continue;
        }
        if (_0x527eec !== "mutual" && _0x527eec !== "relation" && _0x527eec !== "any" && !window.__radar_entity_following_list_active) {
          continue;
        }
      } else if (_0x359287 === "live" && _0x527eec !== "live") {
        continue;
      } else if (_0x359287 === "comment") {
        if (_0x527eec !== "comment") {
          continue;
        }
      } else if (_0x359287 === "video") {
        continue;
      }
      if (_0x359287 === "live" && !_0x2c919b.liveEvent && !_0x2c919b.liveEvents?.length) {
        continue;
      }
      const _0x490912 = Array.isArray(_0x2c919b.liveEvents) ? _0x2c919b.liveEvents : _0x2c919b.liveEvent ? [_0x2c919b.liveEvent] : [];
      const _0x2d31dd = _0x359287 === "live" ? _0x490912.filter(_0x2d22d6 => _0x320c84.has(_0x18bad5(_0x2d22d6))) : _0x490912;
      if (_0x359287 === "live" && _0x2d31dd.length === 0) {
        continue;
      }
      const _0x3f6e28 = _0x2d31dd[_0x2d31dd.length - 1] || null;
      if (_0x359287 === "user" && !_0x38bd9(_0x2c919b.followerCount, userFanCount)) {
        _0x3a8341 += 1;
        if (_0x23b701.length < 3) {
          _0x23b701.push("@" + _0x2c919b.nickname + " " + _0x4bd97f(_0x2c919b.followerCount) + "粉");
        }
        continue;
      }
      _0x8e6899.push({
        uid: _0x2c919b.uid || "",
        secUid: _0x2c919b.secUid || "",
        webcastUid: _0x2c919b.webcastUid || "",
        privacyMasked: !!_0x2c919b.privacyMasked,
        identityType: _0x2c919b.identityType || "",
        profileAvailable: !!_0x2c919b.profileAvailable,
        profileUnavailable: !!_0x2c919b.profileUnavailable,
        profileUnavailableReason: _0x2c919b.profileUnavailableReason || "",
        nickname: _0x2c919b.nickname,
        userUrl: _0x2c919b.userUrl,
        userKey: _0x2c919b.userKey,
        followerCount: _0x2c919b.followerCount,
        content: _0x3f6e28?.content || _0x2c919b.content || "",
        timeText: _0x2c919b.timeText || _0x2c919b.time || "",
        time: _0x2c919b.time || _0x2c919b.timeText || "",
        ipLocation: _0x2c919b.ipLocation || _0x2c919b.location || "",
        location: _0x2c919b.location || _0x2c919b.ipLocation || "",
        liveEvent: _0x3f6e28 || _0x2c919b.liveEvent || null,
        liveEvents: _0x2d31dd,
        messageId: _0x3f6e28?.messageId || _0x2c919b.messageId || "",
        eventTimestamp: _0x3f6e28?.occurredAt || _0x2c919b.eventTimestamp || 0,
        sourceType: _0x359287 === "live" ? "live" : _0x359287,
        entrySource: _0x359287 === "live" ? "entity_live" : undefined,
        entryLabel: _0x359287 === "live" ? "线索采集：直播间" : undefined
      });
    }
    if (_0x3a8341 > 0) {
      const _0x42d0ab = _0x28bd0d(userFanCount);
      console.log("[EntityLeadgen][FansFilter] 丢弃 " + _0x3a8341 + " 个不符「" + (_0x42d0ab?.label || userFanCount) + "」" + (_0x23b701.length ? "，样例：" + _0x23b701.join("、") : ""));
    }
    return _0x8e6899;
  }
  async function _0x155f4c(_0x302d56, _0x3bf744) {
    const _0x74a9e8 = Date.now() + Math.max(0, _0x302d56);
    while (Date.now() < _0x74a9e8) {
      if (_0x3bf744 !== _0x261e0c) {
        return false;
      }
      await _0x144308(Math.min(300, _0x74a9e8 - Date.now()));
    }
    return _0x3bf744 === _0x261e0c;
  }
  function _0x2d4cba(_0x5ab057) {
    const _0x527089 = String(_0x5ab057 || "").trim();
    if (!_0x527089) {
      return null;
    }
    const _0x58d5be = Array.from(document.querySelectorAll("span, div, a, button, [role=\"tab\"]"));
    return _0x58d5be.find(_0x50ca48 => {
      if (!_0x1b22e4(_0x50ca48)) {
        return false;
      }
      const _0x5550d0 = String(_0x50ca48.innerText || _0x50ca48.textContent || "").replace(/\s+/g, "").trim();
      if (_0x5550d0 !== _0x527089) {
        return false;
      }
      const _0xd71fb5 = _0x50ca48.getBoundingClientRect?.();
      return _0xd71fb5 && _0xd71fb5.top < 220 && _0xd71fb5.width > 20 && _0xd71fb5.height > 16;
    }) || null;
  }
  async function _0x5bd28f(_0x4160f3) {
    try {
      const _0x16d3bb = new URL(window.location.href);
      if (_0x16d3bb.searchParams.get("type") === "user") {
        return true;
      }
    } catch (_0xca949a) {}
    const _0x52fdce = _0x2d4cba("用户");
    if (!_0x52fdce) {
      return false;
    }
    await _0x4f4edb(_0x52fdce, null);
    if (!(await _0x155f4c(1800 + Math.random() * 1200, _0x4160f3))) {
      return false;
    }
    try {
      return new URL(window.location.href).searchParams.get("type") === "user" || !!_0x2d4cba("用户");
    } catch (_0x3aec24) {
      return !!_0x2d4cba("用户");
    }
  }
  const _0x429330 = Object.freeze({
    "0": "不限",
    "1": "1000以下",
    "2": "1000-1w",
    "3": "1w-10w",
    "4": "10w-100w",
    "5": "100w以上"
  });
  const _0x50a00f = Object.freeze({
    "0": "不限",
    "1": "普通用户",
    "2": "企业认证",
    "3": "个人认证"
  });
  function _0x5035bf() {
    let _0x584d21 = false;
    let _0x5b71a1 = false;
    for (const _0x25d91f of document.querySelectorAll("span, div, label, p, button")) {
      if (!_0x1b22e4(_0x25d91f)) {
        continue;
      }
      const _0x3f4467 = String(_0x25d91f.innerText || _0x25d91f.textContent || "").replace(/\s+/g, "").trim();
      if (_0x3f4467 === "粉丝数量") {
        _0x584d21 = true;
      }
      if (_0x3f4467 === "用户类型") {
        _0x5b71a1 = true;
      }
      if (_0x584d21 || _0x5b71a1) {
        return true;
      }
    }
    return false;
  }
  function _0x266ace() {
    const _0x352c5a = Array.from(document.querySelectorAll("span")).filter(_0x419876 => {
      if (!_0x1b22e4(_0x419876)) {
        return false;
      }
      const _0x2f7ab9 = String(_0x419876.innerText || _0x419876.textContent || "").replace(/\s+/g, "").trim();
      return _0x2f7ab9.startsWith("筛选") && _0x2f7ab9.length <= 8;
    });
    if (!_0x352c5a.length) {
      return null;
    }
    _0x352c5a.sort((_0x4cc719, _0x19bf26) => {
      const _0x513d43 = _0x4cc719.getBoundingClientRect();
      const _0x535466 = _0x19bf26.getBoundingClientRect();
      return _0x513d43.top - _0x535466.top || _0x535466.left - _0x513d43.left;
    });
    return _0x352c5a[0];
  }
  async function _0x54696c(_0x3c4631, _0x40d68c) {
    if (_0x5035bf()) {
      return true;
    }
    const _0x749c97 = _0x266ace();
    if (!_0x749c97) {
      _0x4125a9({
        taskId: _0x40d68c,
        message: "未找到「筛选」按钮，将改用接口筛选参数",
        level: "warning"
      });
      return false;
    }
    const _0x53b271 = _0x749c97.getBoundingClientRect?.() || {};
    _0x4125a9({
      taskId: _0x40d68c,
      message: "正在点击「筛选」按钮展开面板：tag=" + _0x749c97.tagName + ", class=" + _0x749c97.className + ", text=" + (_0x749c97.innerText || _0x749c97.textContent || "").slice(0, 30) + ", rect=[top:" + Math.round(_0x53b271.top) + ",left:" + Math.round(_0x53b271.left) + ",w:" + Math.round(_0x53b271.width) + ",h:" + Math.round(_0x53b271.height) + "]",
      level: "info"
    });
    await _0x4f4edb(_0x749c97, null);
    try {
      if (typeof _0x749c97.click === "function") {
        _0x749c97.click();
      }
    } catch (_0x57c015) {}
    for (let _0x45bcd7 = 0; _0x45bcd7 < 8; _0x45bcd7 += 1) {
      if (!(await _0x155f4c(350 + Math.random() * 250, _0x3c4631))) {
        return false;
      }
      if (_0x5035bf()) {
        await _0x155f4c(1500 + Math.random() * 1000, _0x3c4631);
        return true;
      }
    }
    return false;
  }
  function _0x332224(_0x4344f3, _0x2fc562) {
    const _0x4a310c = {
      "0": "",
      "1": "0_1k",
      "2": "1k_1w",
      "3": "1w_10w",
      "4": "10w_100w",
      "5": "100w_"
    }[String(_0x4344f3 || "0")] || "";
    const _0x313de2 = {
      "0": "",
      "1": "common_user",
      "2": "enterprise_user",
      "3": "personal_user"
    }[String(_0x2fc562 || "0")] || "";
    const _0x340880 = {
      douyin_user_fans: _0x4a310c,
      douyin_user_type: _0x313de2
    };
    try {
      if (_0x4a310c || _0x313de2) {
        sessionStorage.setItem("__radar_entity_user_search_filters", JSON.stringify(_0x340880));
        window.__radar_entity_user_search_filters = _0x340880;
      } else {
        sessionStorage.removeItem("__radar_entity_user_search_filters");
        delete window.__radar_entity_user_search_filters;
      }
    } catch (_0x203909) {}
    return _0x340880;
  }
  async function _0x4924f8(_0x3a2f79, _0x50a345) {
    const _0x444c5c = Array.from(document.querySelectorAll("button, span, div, [role=\"button\"]")).find(_0x124834 => {
      if (!_0x1b22e4(_0x124834)) {
        return false;
      }
      const _0x1862ed = String(_0x124834.innerText || _0x124834.textContent || "").replace(/\s+/g, "").trim();
      if (_0x1862ed !== "搜索") {
        return false;
      }
      const _0x3e9ae8 = _0x124834.getBoundingClientRect?.();
      return !!_0x3e9ae8 && !!(_0x3e9ae8.top >= 0) && !!(_0x3e9ae8.top < 160) && !!(_0x3e9ae8.width >= 28) && !!(_0x3e9ae8.height >= 20);
    });
    if (!_0x444c5c) {
      _0x4125a9({
        taskId: _0x50a345,
        message: "未找到「搜索」按钮，等待滚动触发筛选接口…",
        level: "info"
      });
      try {
        window.scrollBy(0, 240 + Math.random() * 120);
      } catch (_0x3f733) {}
      return _0x155f4c(2200 + Math.random() * 800, _0x3a2f79);
    }
    _0x4125a9({
      taskId: _0x50a345,
      message: "面板未展开，已写入筛选参数并重新搜索…",
      level: "info"
    });
    await _0x4f4edb(_0x444c5c, null);
    try {
      if (typeof _0x444c5c.click === "function") {
        _0x444c5c.click();
      }
    } catch (_0x4e834b) {}
    return _0x155f4c(2800 + Math.random() * 1200, _0x3a2f79);
  }
  function _0x4ae161(_0x47948f, _0x2aef6e) {
    const _0x566829 = String(_0x47948f || "").trim();
    const _0x4ed38c = String(_0x2aef6e || "").trim();
    if (!_0x566829 || !_0x4ed38c) {
      return null;
    }
    let _0x5c596e = -1;
    let _0x5132e6 = -1;
    if (_0x566829 === "粉丝数量") {
      _0x5c596e = 0;
      const _0x17f919 = {
        "0": "不限",
        "1": "1000以下",
        "2": "1000-1w",
        "3": "1w-10w",
        "4": "10w-100w",
        "5": "100w以上"
      };
      const _0x3bb716 = Object.entries(_0x17f919).find(([_0x6eb9ea, _0x3d85cc]) => _0x3d85cc === _0x4ed38c);
      if (_0x3bb716) {
        _0x5132e6 = parseInt(_0x3bb716[0]);
      }
    } else if (_0x566829 === "用户类型") {
      _0x5c596e = 1;
      const _0x1f7549 = {
        "0": "不限",
        "1": "普通用户",
        "2": "企业认证",
        "3": "个人认证"
      };
      const _0xd5c713 = Object.entries(_0x1f7549).find(([_0x276a01, _0x317bf7]) => _0x317bf7 === _0x4ed38c);
      if (_0xd5c713) {
        _0x5132e6 = parseInt(_0xd5c713[0]);
      }
    }
    if (_0x5c596e !== -1 && _0x5132e6 !== -1) {
      const _0x2f101d = "[data-index1=\"" + _0x5c596e + "\"][data-index2=\"" + _0x5132e6 + "\"], [data-index*=\"" + _0x5c596e + "-" + _0x5132e6 + "\"]";
      const _0x2fbbe2 = document.querySelector(_0x2f101d);
      if (_0x2fbbe2 && _0x1b22e4(_0x2fbbe2)) {
        return _0x2fbbe2;
      }
    }
    const _0x55f030 = (_0x1bcc9, _0x37a624) => {
      const _0x3cbc25 = _0x592377 => String(_0x592377 || "").replace(/\s+/g, "").replace(/w/g, "万").trim();
      return _0x3cbc25(_0x1bcc9) === _0x3cbc25(_0x37a624);
    };
    const _0x5373ec = Array.from(document.querySelectorAll("span, div, button, [role=\"button\"]")).filter(_0x4b1ce2 => {
      if (!_0x1b22e4(_0x4b1ce2)) {
        return false;
      }
      const _0x3d745d = String(_0x4b1ce2.innerText || _0x4b1ce2.textContent || "");
      return _0x55f030(_0x3d745d, _0x4ed38c);
    });
    if (!_0x5373ec.length) {
      return null;
    }
    const _0x552251 = Array.from(document.querySelectorAll("span, div, label, p")).filter(_0x4ebf69 => {
      if (!_0x1b22e4(_0x4ebf69)) {
        return false;
      }
      const _0x2d803d = String(_0x4ebf69.innerText || _0x4ebf69.textContent || "").replace(/\s+/g, "").trim();
      return _0x2d803d === _0x566829;
    });
    if (_0x552251.length > 0) {
      const _0x780117 = _0x552251[0];
      const _0x4a9cb1 = _0x780117.getBoundingClientRect();
      _0x5373ec.sort((_0x49bb7f, _0xfafd50) => {
        const _0x25939c = _0x49bb7f.getBoundingClientRect();
        const _0x1e0c74 = _0xfafd50.getBoundingClientRect();
        const _0x39c1bb = Math.abs(_0x25939c.top - _0x4a9cb1.top);
        const _0x186158 = Math.abs(_0x1e0c74.top - _0x4a9cb1.top);
        return _0x39c1bb - _0x186158;
      });
    }
    return _0x5373ec[0];
  }
  async function _0x43d800(_0x3f0d63, _0xe20390, _0x2fbf57 = {}) {
    const _0x1e7ea1 = String(_0x2fbf57.searchSort || "0");
    const _0x3a9b96 = String(_0x2fbf57.searchPublishTime || "0");
    const _0x2aa91c = String(_0x2fbf57.searchDuration || "0");
    const _0x589344 = String(_0x2fbf57.searchScope || "0");
    const _0x3855ea = String(_0x2fbf57.searchFormat || "0");
    const _0x41bc1d = String(_0x2fbf57.searchKeyword || "").trim();
    if (_0x1e7ea1 === "0" && _0x3a9b96 === "0" && _0x2aa91c === "0" && _0x589344 === "0" && _0x3855ea === "0") {
      return {
        applied: true,
        skipped: true
      };
    }
    const _0x5f1df1 = [];
    if (_0x1e7ea1 !== "0") {
      _0x5f1df1.push(["综合排序", "最新发布", "最多点赞"][Number(_0x1e7ea1)] || "排序" + _0x1e7ea1);
    }
    if (_0x3a9b96 !== "0") {
      _0x5f1df1.push(["不限", "一天内", "一周内", "半年内"][Number(_0x3a9b96)] || "时间" + _0x3a9b96);
    }
    if (_0x2aa91c !== "0") {
      _0x5f1df1.push(["不限", "1分钟以下", "1-5分钟", "5分钟以上"][Number(_0x2aa91c)] || "时长" + _0x2aa91c);
    }
    if (_0x589344 !== "0") {
      _0x5f1df1.push(["不限", "关注的人", "最近看过", "还未看过"][Number(_0x589344)] || "范围" + _0x589344);
    }
    if (_0x3855ea !== "0") {
      _0x5f1df1.push(["不限", "视频", "图文"][Number(_0x3855ea)] || "形式" + _0x3855ea);
    }
    _0x4125a9({
      taskId: _0xe20390,
      message: "正在应用官方搜索筛选：" + (_0x5f1df1.join(" · ") || "已配置"),
      level: "info"
    });
    _0x51db40.currentTask = Object.assign({}, _0x51db40.currentTask && typeof _0x51db40.currentTask === "object" ? _0x51db40.currentTask : {}, {
      searchSort: _0x1e7ea1,
      searchPublishTime: _0x3a9b96,
      searchDuration: _0x2aa91c,
      searchScope: _0x589344,
      searchFormat: _0x3855ea,
      taskMode: "entity_leadgen",
      accountId: _0xfbe77f?.accountId || _0x2fbf57.accountId || ""
    });
    try {
      window.currentTask = _0x51db40.currentTask;
      const _0x19b476 = String(_0x51db40.currentTask.accountId || "").trim();
      if (_0x19b476) {
        window._radar_account_id = _0x19b476;
        sessionStorage.setItem("radar_account_id", _0x19b476);
      }
    } catch (_0x263456) {}
    const _0x2928d8 = "ENTITY_FILTER_" + String(_0xe20390 || "x") + "_" + (_0x41bc1d || "kw");
    try {
      const _0x155053 = _0x136597();
      _0x155053?.clearAppliedSearchFilterSession?.(sessionStorage, _0x2928d8, _0x41bc1d);
    } catch (_0x10c031) {}
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
    } catch (_0x531b45) {}
    const _0x2d1c5a = (() => {
      try {
        const _0x2275ef = _0x136597();
        if (typeof _0x2275ef?.buildAppliedFiltersBaseKey === "function") {
          return _0x2275ef.buildAppliedFiltersBaseKey(_0x2928d8, _0x41bc1d);
        }
      } catch (_0x210913) {}
      return "applied_filters_" + _0x2928d8 + "_" + _0x41bc1d;
    })();
    const _0x216076 = (_0x2abde7, _0x5c1b2f) => String(_0x2abde7 || "0") === "0" || sessionStorage.getItem(_0x2d1c5a + "_" + _0x5c1b2f) === "true";
    const _0xce36fc = () => {
      const _0x3affce = _0x95c1da();
      if (typeof _0x3affce?.areOfficialSearchFilterItemLocksReady === "function") {
        return _0x3affce.areOfficialSearchFilterItemLocksReady(sessionStorage, {
          sort: _0x1e7ea1,
          time: _0x3a9b96,
          duration: _0x2aa91c,
          scope: _0x589344,
          format: _0x3855ea
        }, _0x41bc1d, _0x2928d8, _0x136597());
      }
      return _0x216076(_0x1e7ea1, "sort") && _0x216076(_0x3a9b96, "time") && _0x216076(_0x2aa91c, "duration") && _0x216076(_0x589344, "scope") && _0x216076(_0x3855ea, "format");
    };
    const _0x53cae6 = () => {
      const _0xd8646e = _0x2e518b => {
        const _0x171335 = String(_0x2e518b?.innerText || "").trim();
        return _0x171335 === "筛选" || _0x171335 === "筛选关闭" || _0x171335 === "筛选开启" || /^筛选[·•.]?\d*$/.test(_0x171335);
      };
      const _0x517d2f = Array.from(document.querySelectorAll("span")).filter(_0xd8646e);
      return _0x517d2f.find(_0x2448ec => _0x1b22e4(_0x2448ec)) || _0x517d2f[0] || null;
    };
    const _0x45c7d5 = () => {
      if (_0x1b22e4(document.querySelector("[data-index1=\"0\"]"))) {
        return true;
      }
      if (_0x1b22e4(document.querySelector("[data-index1][data-index2]"))) {
        return true;
      }
      const _0x56a1a6 = ["一周内", "一天内", "最多点赞", "最新发布", "1-5分钟"];
      return _0x56a1a6.some(_0x1e2032 => Array.from(document.querySelectorAll("span, div, button")).some(_0x3545eb => _0x1b22e4(_0x3545eb) && String(_0x3545eb.innerText || "").trim() === _0x1e2032));
    };
    const _0x892146 = async (_0x4c907c = 20000) => {
      const _0xab59ac = Date.now();
      let _0xcc65b2 = 0;
      while (Date.now() - _0xab59ac < _0x4c907c) {
        if (_0x3f0d63 !== _0x261e0c) {
          return false;
        }
        await _0x5e9448(_0x3f0d63);
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
        } catch (_0xb6783c) {
          try {
            window.scrollTo(0, 0);
          } catch (_0x46a76a) {}
        }
        if (_0x45c7d5() || _0x53cae6()) {
          return true;
        }
        if (Date.now() - _0xcc65b2 > 3000) {
          _0xcc65b2 = Date.now();
          _0x4125a9({
            taskId: _0xe20390,
            message: "等待搜索页「筛选」按钮出现… (" + Math.floor((Date.now() - _0xab59ac) / 1000) + "s)",
            level: "info"
          });
        }
        if (!(await _0x155f4c(500 + Math.random() * 300, _0x3f0d63))) {
          return false;
        }
      }
      return !!_0x45c7d5() || !!_0x53cae6();
    };
    const _0x17c6d5 = await _0x892146(22000);
    if (_0x3f0d63 !== _0x261e0c) {
      return {
        cancelled: true
      };
    }
    if (!_0x17c6d5) {
      _0x4125a9({
        taskId: _0xe20390,
        message: "未找到搜索页「筛选」按钮，官方筛选跳过（请确认已登录且页面为综合搜索结果）",
        level: "warning"
      });
      return {
        applied: false,
        skipped: false,
        reason: "no_filter_ui"
      };
    }
    const _0x1ba1d6 = 16;
    for (let _0x503cbc = 0; _0x503cbc < _0x1ba1d6; _0x503cbc += 1) {
      if (_0x3f0d63 !== _0x261e0c) {
        return {
          cancelled: true
        };
      }
      if (_0xce36fc()) {
        sessionStorage.setItem(_0x2d1c5a, "true");
        _0x4125a9({
          taskId: _0xe20390,
          message: "官方搜索筛选已应用，等待结果刷新…",
          level: "info"
        });
        if (!(await _0x155f4c(3500 + Math.random() * 1500, _0x3f0d63))) {
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
      } catch (_0x47e998) {
        try {
          window.scrollTo(0, 0);
        } catch (_0x306334) {}
      }
      await _0x5e9448(_0x3f0d63);
      if (sessionStorage.getItem(_0x2d1c5a) === "true" && !_0xce36fc()) {
        try {
          sessionStorage.removeItem(_0x2d1c5a);
        } catch (_0x22f111) {}
        try {
          sessionStorage.removeItem(_0x2d1c5a + "_attempts");
        } catch (_0x2fe8bf) {}
        _0x4125a9({
          taskId: _0xe20390,
          message: "官方筛选尚未点齐（第 " + (_0x503cbc + 1) + "/" + _0x1ba1d6 + " 轮），继续尝试…",
          level: "info"
        });
      }
      try {
        await _0xaa6e49(_0x41bc1d, _0x2928d8);
      } catch (_0x46fd52) {
        if (String(_0x46fd52?.message || _0x46fd52) === "TASK_ABORTED") {
          return {
            cancelled: true
          };
        }
        console.warn("[线索采集][官方筛选] applySearchFilters 异常", _0x46fd52);
      }
      if (_0xce36fc()) {
        sessionStorage.setItem(_0x2d1c5a, "true");
        _0x4125a9({
          taskId: _0xe20390,
          message: "官方搜索筛选已应用，等待结果刷新…",
          level: "info"
        });
        if (!(await _0x155f4c(3500 + Math.random() * 1500, _0x3f0d63))) {
          return {
            cancelled: true
          };
        }
        return {
          applied: true,
          skipped: false
        };
      }
      if (_0x503cbc === 0 || _0x503cbc % 3 === 2) {
        const _0x12708c = [];
        if (!_0x216076(_0x1e7ea1, "sort")) {
          _0x12708c.push("排序");
        }
        if (!_0x216076(_0x3a9b96, "time")) {
          _0x12708c.push("发布时间");
        }
        if (!_0x216076(_0x2aa91c, "duration")) {
          _0x12708c.push("时长");
        }
        if (!_0x216076(_0x589344, "scope")) {
          _0x12708c.push("范围");
        }
        if (!_0x216076(_0x3855ea, "format")) {
          _0x12708c.push("形式");
        }
        _0x4125a9({
          taskId: _0xe20390,
          message: "官方筛选未点齐：" + (_0x12708c.join("、") || "未知") + "（第 " + (_0x503cbc + 1) + "/" + _0x1ba1d6 + " 轮）",
          level: "info"
        });
      }
      if (!(await _0x155f4c(1200 + Math.random() * 600, _0x3f0d63))) {
        return {
          cancelled: true
        };
      }
    }
    _0x4125a9({
      taskId: _0xe20390,
      message: "官方搜索筛选未能确认生效，将继续采集当前结果（请检查页面是否出现「筛选」）",
      level: "warning"
    });
    return {
      applied: false,
      skipped: false,
      reason: "not_confirmed"
    };
  }
  async function _0x306fe1(_0x472302, _0x2bfa14, {
    userFanCount = "0",
    userTypeFilter = "0",
    accountId = ""
  } = {}) {
    const _0x54abf4 = String(userFanCount || "0");
    const _0x3c1c11 = String(userTypeFilter || "0");
    if (_0x54abf4 === "0" && _0x3c1c11 === "0") {
      _0x332224("0", "0");
      return false;
    }
    const _0x175935 = _0x429330[_0x54abf4] || "不限";
    const _0x1563d7 = _0x50a00f[_0x3c1c11] || "不限";
    const _0x2d3fec = _0x54abf4 !== "0";
    const _0x21388e = _0x3c1c11 !== "0";
    _0x332224(_0x54abf4, _0x3c1c11);
    _0x4125a9({
      taskId: _0x2bfa14,
      message: "需应用筛选：粉丝 " + _0x175935 + " · 类型 " + _0x1563d7 + "（先点筛选再选选项）",
      level: "info"
    });
    const _0x45d446 = await _0x54696c(_0x472302, _0x2bfa14);
    if (!_0x45d446) {
      _0x4125a9({
        taskId: _0x2bfa14,
        message: "筛选面板未展开，改用接口筛选参数",
        level: "warning"
      });
      _0x34975f();
      _0x4125a9({
        taskId: _0x2bfa14,
        accountId: accountId || "",
        sourceType: "user",
        resetNetworkCapture: true
      });
      await _0x4924f8(_0x472302, _0x2bfa14);
      return true;
    }
    let _0x39c93e = false;
    try {
      const _0x3d7eb6 = Array.from(document.querySelectorAll("[data-index1], [data-index2], [data-index]"));
      console.log("[Built-in-Debug] [筛选选项排查] 页面共有 " + _0x3d7eb6.length + " 个 data-index 元素");
      _0x3d7eb6.forEach((_0x14d0a2, _0x1efacb) => {
        console.log("[Built-in-Debug] [筛选选项排查] #" + _0x1efacb + ": tag=" + _0x14d0a2.tagName + ", class=" + _0x14d0a2.className + ", text=" + (_0x14d0a2.innerText || _0x14d0a2.textContent || "").trim() + ", d1=" + _0x14d0a2.getAttribute("data-index1") + ", d2=" + _0x14d0a2.getAttribute("data-index2") + ", d=" + _0x14d0a2.getAttribute("data-index"));
      });
    } catch (_0x3f0b62) {}
    if (_0x2d3fec) {
      const _0x25cdbc = _0x4ae161("粉丝数量", _0x175935);
      if (_0x25cdbc) {
        const _0xd9d124 = _0x25cdbc.getBoundingClientRect?.() || {};
        _0x4125a9({
          taskId: _0x2bfa14,
          message: "选择粉丝数量：" + _0x175935 + " | tag=" + _0x25cdbc.tagName + ", class=" + _0x25cdbc.className + ", rect=[top:" + Math.round(_0xd9d124.top) + ",left:" + Math.round(_0xd9d124.left) + ",w:" + Math.round(_0xd9d124.width) + ",h:" + Math.round(_0xd9d124.height) + "]",
          level: "info"
        });
        await _0x4f4edb(_0x25cdbc, null);
        try {
          if (typeof _0x25cdbc.click === "function") {
            _0x25cdbc.click();
          }
        } catch (_0x476dbc) {}
        _0x39c93e = true;
        if (!(await _0x155f4c(1600 + Math.random() * 900, _0x472302))) {
          return _0x39c93e;
        }
      } else {
        _0x4125a9({
          taskId: _0x2bfa14,
          message: "未找到粉丝数量选项「" + _0x175935 + "」",
          level: "warning"
        });
      }
    }
    if (_0x21388e) {
      if (!_0x5035bf()) {
        const _0x520fda = await _0x54696c(_0x472302, _0x2bfa14);
        if (!_0x520fda) {
          _0x4125a9({
            taskId: _0x2bfa14,
            message: "用户类型面板未展开，已保留接口筛选参数",
            level: "warning"
          });
          if (_0x39c93e) {
            _0x34975f();
            _0x4125a9({
              taskId: _0x2bfa14,
              accountId: accountId || "",
              sourceType: "user",
              resetNetworkCapture: true
            });
          }
          await _0x4924f8(_0x472302, _0x2bfa14);
          return true;
        }
      }
      const _0x2c088e = _0x4ae161("用户类型", _0x1563d7);
      if (_0x2c088e) {
        const _0x1ce3e6 = _0x2c088e.getBoundingClientRect?.() || {};
        _0x4125a9({
          taskId: _0x2bfa14,
          message: "选择用户类型：" + _0x1563d7 + " | tag=" + _0x2c088e.tagName + ", class=" + _0x2c088e.className + ", rect=[top:" + Math.round(_0x1ce3e6.top) + ",left:" + Math.round(_0x1ce3e6.left) + ",w:" + Math.round(_0x1ce3e6.width) + ",h:" + Math.round(_0x1ce3e6.height) + "]",
          level: "info"
        });
        await _0x4f4edb(_0x2c088e, null);
        try {
          if (typeof _0x2c088e.click === "function") {
            _0x2c088e.click();
          }
        } catch (_0x372d50) {}
        _0x39c93e = true;
        if (!(await _0x155f4c(1600 + Math.random() * 900, _0x472302))) {
          return _0x39c93e;
        }
      } else {
        _0x4125a9({
          taskId: _0x2bfa14,
          message: "未找到用户类型选项「" + _0x1563d7 + "」",
          level: "warning"
        });
      }
    }
    if (!_0x39c93e) {
      _0x34975f();
      _0x4125a9({
        taskId: _0x2bfa14,
        accountId: accountId || "",
        sourceType: "user",
        resetNetworkCapture: true,
        message: "未点到筛选项，改用接口筛选参数重新搜索",
        level: "warning"
      });
      await _0x4924f8(_0x472302, _0x2bfa14);
      return true;
    }
    _0x34975f();
    _0x4125a9({
      taskId: _0x2bfa14,
      accountId: accountId || "",
      sourceType: "user",
      resetNetworkCapture: true,
      message: "已应用用户筛选，等待结果刷新…",
      level: "info"
    });
    if (!(await _0x155f4c(2800 + Math.random() * 1200, _0x472302))) {
      return _0x39c93e;
    }
    await _0x306158(_0x472302, _0x2bfa14, {
      sourceType: "user",
      maxWaitMs: 20000
    });
    return _0x39c93e;
  }
  function _0x5e83e2(_0x59f56b) {
    const _0x5303f1 = String(_0x59f56b || "").replace(/\s+/g, "");
    const _0x5c4293 = _0x5303f1.match(/(\d+(?:\.\d+)?[万亿]?)粉丝|粉丝(\d+(?:\.\d+)?[万亿]?)/);
    if (!_0x5c4293) {
      return null;
    }
    return _0x143b77(_0x5c4293[1] || _0x5c4293[2]);
  }
  function _0x334336(_0x132e47 = {}) {
    const _0x2e665c = String(_0x132e47.userFanCount || window.__radar_entity_user_fan_count || "0");
    const _0x3ca3d2 = [];
    const _0x4b1400 = new Set();
    for (const _0x59205f of _0x2a0c74("user", {
      userFanCount: _0x2e665c
    })) {
      if (_0x4b1400.has(_0x59205f.userKey)) {
        continue;
      }
      _0x4b1400.add(_0x59205f.userKey);
      _0x3ca3d2.push(_0x59205f);
    }
    const _0xf22ea2 = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const _0x8dde0a of _0xf22ea2) {
      if (!_0x1b22e4(_0x8dde0a)) {
        continue;
      }
      const _0x155204 = _0x8dde0a.href || _0x8dde0a.getAttribute?.("href") || "";
      if (!_0x155204 || _0x155204.includes("/user/self")) {
        continue;
      }
      const _0x29faae = _0x2dea5c(_0x155204);
      if (!_0x29faae) {
        continue;
      }
      const _0x41ad5d = _0x236e9d(_0x29faae);
      if (!_0x41ad5d || _0x4b1400.has(_0x41ad5d)) {
        continue;
      }
      const _0x55d4fc = _0x8dde0a.closest("div, li, article, section") || _0x8dde0a.parentElement;
      const _0x267472 = String(_0x55d4fc?.innerText || _0x8dde0a.innerText || "");
      let _0x40d8e3 = String(_0x8dde0a.innerText || _0x8dde0a.textContent || _0x8dde0a.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (!_0x40d8e3 || _0x40d8e3.length > 40 || /^(关注|粉丝|获赞|私信|回关|已关注|相互关注)$/.test(_0x40d8e3)) {
        const _0x2ac2d0 = _0x267472.split(/\n+/).map(_0x1fb4da => _0x1fb4da.trim()).find(_0x1a2d06 => _0x1a2d06 && _0x1a2d06.length <= 40 && !/粉丝|关注|获赞|抖音号|私信/.test(_0x1a2d06));
        _0x40d8e3 = _0x2ac2d0 ? _0x2ac2d0.replace(/^@+/, "") : "";
      }
      if (!_0x40d8e3) {
        continue;
      }
      const _0x31413a = _0x5e83e2(_0x267472);
      if (!_0x38bd9(_0x31413a, _0x2e665c)) {
        continue;
      }
      _0x4b1400.add(_0x41ad5d);
      _0x3ca3d2.push({
        nickname: _0x40d8e3,
        userUrl: _0x29faae,
        userKey: _0x41ad5d,
        followerCount: _0x31413a
      });
    }
    return _0x3ca3d2;
  }
  function _0x3cf624(_0x1ed4a3) {
    const _0x3e78 = String(_0x1ed4a3 || "").match(/@([^\s@/#]{1,40})/);
    if (_0x3e78) {
      return _0x3e78[1].trim();
    } else {
      return "";
    }
  }
  let _0x5e1cdb = null;
  function _0x18de73() {
    if (!_0x5e1cdb) {
      try {
        _0x5e1cdb = require("./entityCommentScraper");
      } catch (_0x3cd7b5) {
        _0x5e1cdb = null;
      }
    }
    return _0x5e1cdb;
  }
  function _0x17bf81(_0x52cf8c = document) {
    try {
      const _0x538ab8 = typeof _0x116c29 === "function" ? _0x116c29(_0x52cf8c || document, window.location.href) : null;
      const _0x2cab20 = String(_0x538ab8?.nickname || "").trim().replace(/^@+/, "");
      const _0x3222f5 = _0x2dea5c(_0x538ab8?.profileUrl || "");
      const _0x3a66b7 = _0x3222f5 ? typeof _0x12e1b6 === "function" ? _0x12e1b6(_0x3222f5) : "" : "";
      const _0x1ab8b1 = _0x18de73();
      if (_0x1ab8b1?.normalizeAuthorFilter) {
        return _0x1ab8b1.normalizeAuthorFilter({
          nickname: _0x2cab20,
          userUrl: _0x3222f5,
          secUid: String(_0x3a66b7 || "").trim(),
          userKey: _0x3a66b7 || (_0x3222f5 ? _0x236e9d(_0x3222f5, _0x2cab20) : "")
        });
      }
      return {
        nickname: _0x2cab20,
        userUrl: _0x3222f5,
        secUid: String(_0x3a66b7 || "").trim(),
        userKey: _0x3a66b7 || (_0x3222f5 ? _0x236e9d(_0x3222f5, _0x2cab20) : "")
      };
    } catch (_0x4ccefa) {
      return {
        nickname: "",
        userUrl: "",
        secUid: "",
        userKey: ""
      };
    }
  }
  let _0x5ed199 = null;
  function _0x26fd17() {
    if (!_0x5ed199) {
      try {
        _0x5ed199 = require("./entityCommentFilters");
      } catch (_0x1d175c) {
        _0x5ed199 = null;
      }
    }
    return _0x5ed199;
  }
  function _0x5e5715() {
    const _0x49caa0 = _0x26fd17();
    return {
      collectEntityUsersFromApiBuffer: _0x2a0c74,
      normalizeDouyinAuthorProfileUrl: _0x2dea5c,
      buildEntityUserKey: _0x236e9d,
      findCommentPanelRoot: typeof _0x42c182 === "function" ? _0x42c182 : null,
      resolveCommentPanelRoot: typeof _0x52bff0 === "function" ? _0x52bff0 : null,
      queryCommentItemNodes: typeof _0x340fc5 === "function" ? _0x340fc5 : null,
      parseDouyinCommentNode: typeof _0x46559f === "function" ? _0x46559f : null,
      getCommentsTotalCount: typeof _0x5732ba === "function" ? _0x5732ba : null,
      getCommentV2String: typeof _0x5e4b1f === "function" ? _0x5e4b1f : null,
      isCommentPanelContentLoading: typeof _0x1c3228 === "function" ? _0x1c3228 : null,
      clickCommentPanelLoadingPlaceholder: typeof _0x21d067 === "function" ? _0x21d067 : null,
      evaluateEntityCommentFilters: _0x49caa0?.evaluateEntityCommentFilters || null,
      normalizeEntityCommentFilters: _0x49caa0?.normalizeEntityCommentFilters || null,
      canonicalizeDouyinVideoUrl: (() => {
        try {
          const _0x12fc30 = _0x2e3bdf();
          return _0x12fc30?.canonicalizeDouyinVideoUrl || _0x12fc30?.normalizeProcessedVideoKey || null;
        } catch (_0x7f9f34) {
          return null;
        }
      })(),
      countApiUsers: () => {
        try {
          return (_0x2a0c74("comment") || []).length;
        } catch (_0x23348f) {
          return 0;
        }
      }
    };
  }
  function _0xd0fe72(_0x5d7f81, _0x31b7f0, _0x2839f2 = "info", _0x149127 = {}) {
    _0x4125a9({
      taskId: _0x5d7f81,
      message: _0x31b7f0,
      level: _0x2839f2,
      accountId: window._radar_account_id || "",
      accountName: window._radar_account_name || "",
      ..._0x149127
    });
  }
  function _0x23496d(_0x460fde = null, _0x81d59d = null) {
    const _0x1bc512 = _0x18de73();
    if (!_0x1bc512?.collectEntityCommentsFromPage) {
      return [];
    }
    return _0x1bc512.collectEntityCommentsFromPage(_0x5e5715(), _0x460fde || _0x17bf81(), _0x81d59d);
  }
  async function _0x3ed1f6(_0x36c1d6, _0x2650eb) {
    const _0x599955 = typeof _0x288445 === "function" ? _0x288445({
      includeFeed: false
    }) || _0x288445({
      includeFeed: true
    }) : null;
    const _0x4efde3 = _0x599955 || document.body;
    const _0x526248 = "ENTITY_LEADGEN";
    const _0x54ebb5 = _0x5e5715();
    _0x38705e(_0x4efde3, "线索采集：打开评论区前锁定暂停");
    if (!_0x591e5f || _0x591e5f.stopped) {
      _0x215a68("线索采集：打开评论区前锁定暂停");
    }
    const _0xc3f3ef = _0x18de73();
    let _0x2f23a5 = {
      opened: false
    };
    if (_0xc3f3ef?.openEntityCommentPanel) {
      _0x2f23a5 = await _0xc3f3ef.openEntityCommentPanel({
        ..._0x54ebb5,
        token: _0x36c1d6,
        taskId: _0x2650eb,
        scope: _0x4efde3,
        loopId: _0x526248,
        getCommentTabPrefix: typeof _0xc6ccf === "function" ? _0xc6ccf : () => "评论",
        isVisibleElement: _0x1b22e4,
        simulateHumanClick: typeof _0x4f4edb === "function" ? _0x4f4edb : null,
        waitFn: async _0xa99798 => _0x155f4c(_0xa99798, _0x36c1d6),
        isCancelled: () => _0x36c1d6 !== _0x261e0c,
        logFn: (_0x124e84, _0x5a5950, _0x564c7a = "info") => _0xd0fe72(_0x124e84 || _0x2650eb, _0x5a5950, _0x564c7a)
      });
      if (_0x2f23a5?.cancelled) {
        return _0x2f23a5;
      }
    }
    let _0x56c1d2 = false;
    if (typeof _0x5063fb === "function" && _0x36c1d6 === _0x261e0c) {
      try {
        _0x56c1d2 = !!(await _0x5063fb(_0x4efde3, _0x526248));
      } catch (_0x295186) {
        _0xd0fe72(_0x2650eb, "获客开评复用异常：" + (_0x295186?.message || _0x295186), "warning");
      }
    }
    const _0x5f5c2b = typeof _0xc3f3ef?.inspectEntityCommentPanel === "function" ? _0xc3f3ef.inspectEntityCommentPanel({
      ..._0x54ebb5,
      isVisibleElement: _0x1b22e4
    }) : _0x2f23a5?.inspection || {
      opened: !!_0x2f23a5?.opened || !!_0x56c1d2
    };
    return {
      ..._0x2f23a5,
      ..._0x5f5c2b,
      viaLeadgen: _0x56c1d2,
      opened: !!_0x5f5c2b.opened,
      empty: !!_0x5f5c2b.empty,
      slow: !_0x5f5c2b.opened && !_0x5f5c2b.empty,
      badgeOnly: !!_0x5f5c2b.badgeOnly
    };
  }
  async function _0x593a97({
    token: _0xc865b1,
    taskId: _0xe7c97e,
    searchKeyword = "",
    seenKeys: _0x5e3db7,
    collectedUsers: _0x4fa441,
    maxCollect: _0x2d1447,
    authorFilter = null,
    initialPageTotal = null,
    commentFilters = null,
    progressLabel = "视频评论区潜客",
    targetVideoUrl = "",
    sourceVideoTitle = "",
    videoTitle = ""
  }) {
    const _0x3c5738 = _0x18de73();
    if (!_0x3c5738?.collectEntityCommentUsersByScrolling) {
      return {
        exhausted: true,
        empty: true
      };
    }
    return _0x3c5738.collectEntityCommentUsersByScrolling(_0x5e5715(), {
      token: _0xc865b1,
      taskId: _0xe7c97e,
      searchKeyword: searchKeyword,
      seenKeys: _0x5e3db7,
      collectedUsers: _0x4fa441,
      maxCollect: _0x2d1447,
      authorFilter: authorFilter || _0x17bf81(),
      initialPageTotal: initialPageTotal,
      commentFilters: commentFilters,
      progressLabel: progressLabel,
      targetVideoUrl: String(targetVideoUrl || searchKeyword || "").trim(),
      sourceVideoTitle: String(sourceVideoTitle || videoTitle || "").trim(),
      videoTitle: String(videoTitle || sourceVideoTitle || "").trim(),
      loopId: "ENTITY_LEADGEN",
      waitFn: async _0x15ca30 => _0x155f4c(_0x15ca30, _0xc865b1),
      isCancelled: () => _0xc865b1 !== _0x261e0c,
      installFeedSwipeLock: _0x325c29,
      removeFeedSwipeLock: _0x4aa343,
      hasVideoDrifted: _0x1b21ff,
      resolveCommentScope: () => {
        try {
          const _0x1b32c5 = typeof _0x288445 === "function" ? _0x288445({
            includeFeed: true
          }) : null;
          if (typeof _0x52bff0 === "function") {
            return _0x52bff0(_0x1b32c5 || document.body) || _0x1b32c5 || document.body;
          }
          return _0x1b32c5 || document.body;
        } catch (_0x416f08) {
          return document.body;
        }
      },
      scrollCommentList: typeof _0x26bd7c === "function" ? _0x26bd7c : null,
      aggressiveCommentListScroll: typeof _0x3bfd7a === "function" ? _0x3bfd7a : null,
      pruneStaleCommentDom: typeof _0x8b1228 === "function" ? _0x8b1228 : null,
      getCommentEndHintText: typeof _0x24b9ed === "function" ? _0x24b9ed : null,
      getCommentScrollMetrics: typeof _0x1b520f === "function" ? _0x1b520f : null,
      getScrapeNoNewDataTolerance: typeof _0x323b5d === "function" ? _0x323b5d : null,
      simulateHumanClick: typeof _0x4f4edb === "function" ? _0x4f4edb : null,
      logFn: (_0x2bf2ef, _0x24d885, _0x56e978 = "info", _0x573b97 = {}) => _0xd0fe72(_0x2bf2ef || _0xe7c97e, _0x24d885, _0x56e978, _0x573b97)
    });
  }
  function _0x47b06a(_0x17010e) {
    const _0x1ee411 = String(_0x17010e || "").replace(/\s+/g, " ").trim();
    if (!_0x1ee411) {
      return true;
    }
    if (/^(相关搜索|大家都在搜|猜你想搜|热门搜索|搜索发现|筛选|综合|视频|用户|直播|图文)$/i.test(_0x1ee411)) {
      return true;
    }
    if (/相关搜索|大家都在搜|猜你想搜/.test(_0x1ee411) && _0x1ee411.length <= 24) {
      return true;
    }
    if (typeof _0x1eb8ae === "function" && _0x1eb8ae(_0x1ee411)) {
      return true;
    }
    if (/的抖音直播间|抖音直播间(?:直播)?$|正在直播|进入直播间|直播中/.test(_0x1ee411)) {
      return true;
    }
    if (/^(图片|图文|笔记|封面|视频|播放|查看详情|点击查看|抖音|关注|点赞|评论|收藏|分享|更多)$/i.test(_0x1ee411)) {
      return true;
    }
    if (/^https?:\/\//i.test(_0x1ee411) || /^\d{1,2}:\d{2}$/.test(_0x1ee411)) {
      return true;
    }
    if (/^\d+(?:\.\d+)?[万wkW]?$/.test(_0x1ee411)) {
      return true;
    }
    return false;
  }
  function _0x33ca67(_0x542ac9) {
    if (!_0x542ac9) {
      return true;
    }
    const _0x534d6f = String(_0x542ac9.innerText || _0x542ac9.textContent || "").replace(/\s+/g, " ").trim();
    if (!_0x534d6f) {
      return true;
    }
    if (/相关搜索|大家都在搜|猜你想搜/.test(_0x534d6f)) {
      const _0x30ff59 = !!_0x542ac9.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], [data-e2e=\"video-desc\"], [data-e2e=\"note-desc\"], video");
      if (!_0x30ff59 || _0x534d6f.length < 80) {
        return true;
      }
    }
    if (_0x542ac9.querySelector?.("a[href*=\"/live/\"], a[href*=\"live.douyin.com\"], a[href*=\"webcast\"]")) {
      return true;
    }
    const _0x49aec4 = Array.from(_0x542ac9.querySelectorAll?.("[data-e2e]") || []).slice(0, 20);
    if (_0x49aec4.some(_0x5cb0ea => {
      const _0x4a1e0a = String(_0x5cb0ea.getAttribute?.("data-e2e") || "").toLowerCase();
      return /(^|[-_])(live|webcast)([-_]|$)/.test(_0x4a1e0a);
    })) {
      return true;
    }
    if (/进入直播间|点击进入直播|观看直播|正在直播/.test(_0x534d6f)) {
      return true;
    }
    if (typeof _0x1eb8ae === "function") {
      const _0x59375 = _0x534d6f.split(/\s{2,}|\n+/).map(_0x125033 => _0x125033.trim()).filter(Boolean).slice(0, 8);
      if (_0x59375.some(_0x473e14 => _0x1eb8ae(_0x473e14))) {
        return true;
      }
    }
    if (/的抖音直播间|抖音直播间(?:直播)?/.test(_0x534d6f)) {
      return true;
    }
    return false;
  }
  function _0x5b3c43(_0x4a5e4e) {
    if (!_0x4a5e4e) {
      return "";
    }
    const _0x559674 = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", "[data-e2e*=\"video-title\"]", "[data-e2e*=\"search-card-desc\"]", "[data-e2e*=\"search-result-card-desc\"]", "[class*=\"video-title\"]", "[class*=\"VideoTitle\"]", "[class*=\"note-title\"]", "[class*=\"NoteTitle\"]", "[class*=\"note-desc\"]", "[class*=\"NoteDesc\"]"];
    const _0x2c9926 = _0x594cfa => {
      const _0x2a9198 = String(_0x594cfa || "").replace(/\s+/g, " ").trim().slice(0, 100);
      if (!_0x2a9198 || _0x2a9198.length < 2) {
        return "";
      }
      if (_0x47b06a(_0x2a9198)) {
        return "";
      }
      if (/^@/.test(_0x2a9198)) {
        return "";
      }
      return _0x2a9198;
    };
    for (const _0xd5d158 of _0x559674) {
      for (const _0x3ba357 of Array.from(_0x4a5e4e.querySelectorAll?.(_0xd5d158) || [])) {
        const _0x49bd86 = _0x2c9926(_0x3ba357.innerText || _0x3ba357.textContent || "");
        if (_0x49bd86) {
          return _0x49bd86;
        }
      }
    }
    for (const _0x4ecfa9 of Array.from(_0x4a5e4e.querySelectorAll?.("a[title], a[aria-label], img[alt]") || []).slice(0, 12)) {
      for (const _0xd9cd09 of ["title", "aria-label", "alt"]) {
        const _0x54d6b1 = _0x2c9926(_0x4ecfa9.getAttribute?.(_0xd9cd09));
        if (_0x54d6b1 && _0x54d6b1.length >= 4) {
          return _0x54d6b1;
        }
      }
    }
    const _0x21bf7d = String(_0x4a5e4e.innerText || _0x4a5e4e.textContent || "").split(/\n+/).map(_0x459f3e => _0x459f3e.replace(/\s+/g, " ").trim()).filter(Boolean);
    const _0x155c8d = _0x21bf7d.map(_0x8fbe8c => _0x2c9926(_0x8fbe8c)).filter(Boolean).filter(_0x4b0f14 => !/^(赞|评论|分享|关注|粉丝|收藏|播放)/.test(_0x4b0f14)).sort((_0x4b088b, _0x5ba325) => _0x5ba325.length - _0x4b088b.length);
    return _0x155c8d[0] || "";
  }
  function _0x178fdc() {
    const _0x35d3ec = [];
    const _0x97d560 = new Set();
    const _0x12411d = (_0xe44d2f, _0x40ecae = "", _0x567a97 = null) => {
      const _0x138ef5 = String(_0xe44d2f || "").trim();
      if (!_0x138ef5 || !/^\d{10,}$/.test(_0x138ef5)) {
        return false;
      }
      if (_0x567a97 && _0x33ca67(_0x567a97)) {
        return false;
      }
      const _0x48791a = "video:" + _0x138ef5;
      if (_0x97d560.has(_0x48791a)) {
        return false;
      }
      let _0x14315e = String(_0x40ecae || "").replace(/\s+/g, " ").trim().slice(0, 100);
      if (_0x47b06a(_0x14315e)) {
        _0x14315e = "";
      }
      if (!_0x14315e && _0x567a97) {
        _0x14315e = _0x5b3c43(_0x567a97);
      }
      if (_0x47b06a(_0x14315e)) {
        _0x14315e = "";
      }
      if (/相关搜索|大家都在搜|的抖音直播间|抖音直播间(?:直播)?|进入直播间|正在直播/.test(String(_0x40ecae || ""))) {
        return false;
      }
      if (!_0x14315e) {
        _0x14315e = "抖音视频作品";
      }
      const _0x58e607 = "https://www.douyin.com/video/" + _0x138ef5;
      _0x97d560.add(_0x48791a);
      let _0x3392e3 = "";
      let _0xe65160 = "";
      let _0x2d62b4 = "";
      try {
        const _0x333db4 = String(_0x567a97?.innerText || _0x567a97?.textContent || "").replace(/\s+/g, " ").trim();
        const _0x8cfdf4 = _0x333db4.match(/(刚刚|刚才|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|个?月|年)前)/);
        if (_0x8cfdf4) {
          _0x2d62b4 = String(_0x8cfdf4[1] || "").replace(/\s+/g, "");
        }
      } catch (_0x264591) {}
      if (_0x567a97 && typeof _0x35c048 === "function") {
        try {
          const _0x1d029b = _0x35c048(_0x567a97);
          if (_0x1d029b?.secUid) {
            _0xe65160 = "https://www.douyin.com/user/" + _0x1d029b.secUid;
            _0x3392e3 = String(_0x1d029b.nickname || "").trim().replace(/^@+/, "");
          }
        } catch (_0x45988c) {}
      }
      if (!_0xe65160 && _0x567a97) {
        const _0x292d28 = _0x567a97.querySelector?.("a[href*=\"/user/\"]");
        const _0x362050 = _0x292d28?.href || _0x292d28?.getAttribute?.("href") || "";
        const _0x4f4569 = String(_0x362050).match(/\/user\/([^/?#]+)/);
        if (_0x4f4569?.[1] && _0x4f4569[1].length > 8 && !/^(self|login)$/i.test(_0x4f4569[1])) {
          _0xe65160 = "https://www.douyin.com/user/" + decodeURIComponent(_0x4f4569[1]);
          _0x3392e3 = String(_0x292d28?.textContent || "").trim().replace(/^@+/, "") || _0x3392e3;
        }
      }
      _0x35d3ec.push({
        nickname: _0x14315e,
        title: _0x14315e,
        userUrl: _0x58e607,
        videoUrl: _0x58e607,
        userKey: _0x48791a,
        content: _0x58e607,
        sourceType: "video",
        entrySource: "entity_video",
        entryLabel: "线索采集：视频作品链接",
        authorNickname: _0x3392e3,
        authorProfileUrl: _0xe65160,
        publishTimeText: _0x2d62b4
      });
      return true;
    };
    const _0x3434e1 = typeof _0x33a67a === "function" ? _0x33a67a() : [];
    for (const _0x4fe55b of _0x3434e1) {
      if (_0x33ca67(_0x4fe55b)) {
        continue;
      }
      let _0x23aa06 = "";
      if (typeof _0x121575 === "function") {
        _0x23aa06 = _0x121575(_0x4fe55b) || "";
      }
      if (!_0x23aa06 && typeof _0x17c2bb === "function") {
        const _0x50e944 = _0x17c2bb(_0x4fe55b);
        _0x23aa06 = typeof _0x59d57b === "function" ? _0x59d57b(_0x50e944) : "";
      }
      if (!_0x23aa06 && typeof _0x5c556c === "function") {
        _0x23aa06 = _0x5c556c(_0x4fe55b) || "";
      }
      if (!_0x23aa06) {
        const _0x8e9545 = _0x4fe55b.closest?.("[id^=\"waterfall_item_\"]") || _0x4fe55b;
        const _0x593ffe = String(_0x8e9545?.id || "");
        const _0x4a2b64 = _0x593ffe.match(/waterfall[_-]?item[_-]?(\d{10,})/i);
        if (_0x4a2b64?.[1]) {
          _0x23aa06 = _0x4a2b64[1];
        }
      }
      if (_0x23aa06) {
        _0x12411d(_0x23aa06, _0x5b3c43(_0x4fe55b), _0x4fe55b);
      }
    }
    Array.from(document.querySelectorAll("[id^=\"waterfall_item_\"]")).forEach(_0x4e7e7a => {
      if (!_0x1b22e4(_0x4e7e7a)) {
        return;
      }
      if (_0x33ca67(_0x4e7e7a)) {
        return;
      }
      const _0x2896f6 = String(_0x4e7e7a.id || "").match(/waterfall[_-]?item[_-]?(\d{10,})/i);
      if (_0x2896f6?.[1]) {
        _0x12411d(_0x2896f6[1], _0x5b3c43(_0x4e7e7a), _0x4e7e7a);
      }
    });
    return _0x35d3ec;
  }
  function _0x5ace41() {
    const _0x468c48 = new Map();
    const _0x35327a = _0x4d08fe => {
      if (!_0x4d08fe?.userKey) {
        return;
      }
      const _0x48793c = _0x468c48.get(_0x4d08fe.userKey);
      if (!_0x48793c) {
        _0x468c48.set(_0x4d08fe.userKey, _0x4d08fe);
        return;
      }
      const _0x11274b = (_0x166cfc, _0x3ab5ab) => {
        const _0x3854aa = String(_0x166cfc || "").trim();
        const _0x3efd8d = String(_0x3ab5ab || "").trim();
        return _0x3854aa || _0x3efd8d;
      };
      _0x468c48.set(_0x4d08fe.userKey, {
        ..._0x48793c,
        ..._0x4d08fe,
        title: _0x11274b(_0x48793c.title || _0x48793c.nickname, _0x4d08fe.title || _0x4d08fe.nickname),
        nickname: _0x11274b(_0x48793c.title || _0x48793c.nickname, _0x4d08fe.title || _0x4d08fe.nickname),
        videoUrl: _0x11274b(_0x48793c.videoUrl, _0x4d08fe.videoUrl),
        userUrl: _0x11274b(_0x48793c.userUrl, _0x4d08fe.userUrl),
        authorNickname: _0x11274b(_0x48793c.authorNickname, _0x4d08fe.authorNickname),
        authorProfileUrl: _0x11274b(_0x48793c.authorProfileUrl, _0x4d08fe.authorProfileUrl),
        publishTimeText: _0x11274b(_0x48793c.publishTimeText, _0x4d08fe.publishTimeText),
        createTime: Number(_0x48793c.createTime || _0x4d08fe.createTime || 0) || Number(_0x4d08fe.createTime || _0x48793c.createTime || 0) || 0
      });
    };
    try {
      const _0x5f4fec = _0x178fdc();
      for (const _0x17c81f of Array.isArray(_0x5f4fec) ? _0x5f4fec : []) {
        _0x35327a(_0x17c81f);
      }
    } catch (_0x11e82d) {}
    try {
      if (typeof _0xd24701 === "function") {
        _0xd24701({
          force: true
        });
      }
      const _0x22791c = typeof _0x49d3d0 === "function" ? _0x49d3d0() : [];
      const _0x58c1ad = _0x468c48.size > 0;
      for (const _0x25f1cb of _0x22791c) {
        const _0x53f873 = String(_0x25f1cb?.videoId || "").trim();
        if (!/^\d{10,}$/.test(_0x53f873)) {
          continue;
        }
        const _0x49c7b1 = "video:" + _0x53f873;
        if (_0x58c1ad && !_0x468c48.has(_0x49c7b1)) {
          continue;
        }
        const _0x3446d4 = String(_0x25f1cb.videoUrl || "").trim() || "https://www.douyin.com/video/" + _0x53f873;
        const _0x33fb8c = String(_0x25f1cb.title || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
        _0x35327a({
          nickname: _0x33fb8c,
          title: _0x33fb8c,
          userUrl: _0x3446d4,
          videoUrl: _0x3446d4,
          userKey: _0x49c7b1,
          content: _0x3446d4,
          sourceType: "video",
          entrySource: "entity_video",
          entryLabel: "线索采集：视频作品链接",
          authorNickname: String(_0x25f1cb.authorNickname || "").trim().replace(/^@+/, ""),
          authorProfileUrl: String(_0x25f1cb.authorUrl || "").trim(),
          createTime: Number(_0x25f1cb.createTime || 0) || 0,
          publishTime: Number(_0x25f1cb.createTime || 0) || 0
        });
      }
    } catch (_0x48e910) {}
    return Array.from(_0x468c48.values());
  }
  function _0x35c048(_0x15c98c) {
    if (!_0x15c98c) {
      return null;
    }
    const _0x599164 = typeof _0x17c2bb === "function" ? _0x17c2bb(_0x15c98c) : "";
    const _0xadbc5a = typeof _0x59d57b === "function" ? _0x59d57b(_0x599164) : "";
    const _0x2339b9 = [_0x15c98c.querySelector?.(".videoImage"), _0x15c98c.querySelector?.("a[href*=\"/video/\"]"), _0x15c98c.querySelector?.("a[href*=\"/note/\"]"), _0x15c98c.querySelector?.("a"), _0x15c98c.querySelector?.("img"), _0x15c98c].filter(Boolean);
    for (const _0x31f4e2 of _0x2339b9) {
      const _0x18f890 = Object.keys(_0x31f4e2).find(_0x241815 => _0x241815.startsWith("__reactFiber$") || _0x241815.startsWith("__reactProps$"));
      if (!_0x18f890) {
        continue;
      }
      let _0x320e95 = _0x31f4e2[_0x18f890];
      let _0x20f412 = 0;
      let _0x59b21d = null;
      while (_0x320e95 && _0x20f412 < 18) {
        const _0x2d676d = [_0x320e95.pendingProps, _0x320e95.memoizedProps].filter(Boolean);
        for (const _0x5e35e0 of _0x2d676d) {
          const _0x4a17e8 = [_0x5e35e0.awemeInfo, _0x5e35e0.aweme, _0x5e35e0.data, _0x5e35e0.logParams?.awemeInfo, _0x5e35e0.activeAweme, _0x5e35e0.currentAweme].filter(Boolean);
          for (const _0xcdc884 of _0x4a17e8) {
            const _0x4d5b2 = _0xcdc884.awemeId || _0xcdc884.aweme_id || _0xcdc884.id || _0xcdc884.gid || _0xcdc884.itemId || _0xcdc884.item_id;
            const _0x476e76 = _0xcdc884.authorInfo || _0xcdc884.author || _0xcdc884.author_info;
            const _0x255419 = _0x476e76?.secUid || _0x476e76?.sec_uid;
            const _0x2d8b77 = String(_0x476e76?.nickname || _0x476e76?.nickName || _0x476e76?.nick_name || "").trim();
            if (!_0x255419 || typeof _0x255419 !== "string" || !(_0x255419.length > 15)) {
              continue;
            }
            const _0x4ab141 = {
              secUid: _0x255419,
              nickname: _0x2d8b77
            };
            if (_0xadbc5a && _0x4d5b2 && String(_0x4d5b2) === String(_0xadbc5a)) {
              return _0x4ab141;
            }
            if (!_0x59b21d) {
              _0x59b21d = _0x4ab141;
            }
          }
          const _0x135dfc = _0x5e35e0.authorInfo || _0x5e35e0.author || _0x5e35e0.user;
          if (_0x135dfc) {
            const _0x185193 = _0x135dfc.secUid || _0x135dfc.sec_uid;
            const _0x116bcf = String(_0x135dfc.nickname || _0x135dfc.nickName || _0x135dfc.nick_name || "").trim();
            if (_0x185193 && typeof _0x185193 === "string" && _0x185193.length > 15) {
              const _0x45b433 = {
                secUid: _0x185193,
                nickname: _0x116bcf
              };
              if (!_0x59b21d) {
                _0x59b21d = _0x45b433;
              }
            }
          }
        }
        _0x320e95 = _0x320e95.return;
        _0x20f412 += 1;
      }
      if (_0x59b21d) {
        return _0x59b21d;
      }
    }
    return null;
  }
  function _0xf133cb() {
    const _0x211368 = window.__radar_entity_login_cleaner;
    if (_0x211368?.start) {
      _0x211368.start();
      return;
    }
    if (_0x211368 === true) {
      return;
    }
    try {
      document.body?.style?.removeProperty("overflow");
      document.documentElement?.style?.removeProperty("overflow");
    } catch (_0x280473) {}
    try {
      const {
        createEntityLoginBarrierCleaner: _0x320923
      } = require("./entityLoginBarrierCleaner");
      const _0x2cd36d = _0x320923({
        documentRef: document
      });
      window.__radar_entity_login_cleaner = _0x2cd36d;
      _0x2cd36d.start();
    } catch (_0x42b7bb) {
      console.error("[Built-in-Debug] 登录遮罩清理器加载失败:", _0x42b7bb);
    }
  }
  function _0x213059() {
    const _0x412279 = window.__radar_entity_login_cleaner;
    if (_0x412279?.stop) {
      _0x412279.stop();
    }
  }
  async function _0x1dfb8c(_0x5619a8) {
    let _0x473670 = 0;
    for (let _0x46f169 = 0; _0x46f169 < 4; _0x46f169 += 1) {
      if (typeof _0x5619a8 === "number" && _0x5619a8 !== _0x261e0c) {
        return _0x473670;
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
      } catch (_0x271bf8) {}
      const _0x452db1 = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"login\"], [class*=\"Login\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"mask\"], [class*=\"Mask\"], [class*=\"popup\"], [class*=\"Popup\"]")).filter(_0x5a9bc9 => _0x1b22e4(_0x5a9bc9));
      for (const _0x443599 of _0x452db1) {
        const _0x22dc43 = String(_0x443599.innerText || _0x443599.textContent || "").replace(/\s+/g, " ");
        const _0x4d7055 = /登录后即可|扫码登录|验证码登录|密码登录|打开抖音APP|登录后查看|立即登录|手机号登录/.test(_0x22dc43);
        if (!_0x4d7055) {
          continue;
        }
        const _0x205789 = Array.from(_0x443599.querySelectorAll("button, [role=\"button\"], [aria-label*=\"关闭\"], [aria-label*=\"close\" i], [class*=\"close\"], [class*=\"Close\"], svg")).filter(_0x2ae763 => _0x1b22e4(_0x2ae763));
        let _0x4d9259 = false;
        for (const _0x431718 of _0x205789) {
          const _0xcc6138 = ((_0x431718.getAttribute?.("aria-label") || "") + " " + (_0x431718.className || "") + " " + (_0x431718.innerText || "")).toLowerCase();
          const _0x77fbac = _0x431718.getBoundingClientRect?.() || {};
          const _0x1c6345 = (_0x77fbac.width || 0) <= 48 && (_0x77fbac.height || 0) <= 48;
          if (/close|关闭|dismiss|icon/.test(_0xcc6138) || _0x1c6345) {
            try {
              await _0x4f4edb(_0x431718, null);
              _0x473670 += 1;
              _0x4d9259 = true;
              break;
            } catch (_0x5b9d71) {}
          }
        }
        if (!_0x4d9259) {
          const _0x4d927e = Array.from(document.querySelectorAll("div, span, button")).find(_0x4cee0f => {
            if (!_0x1b22e4(_0x4cee0f)) {
              return false;
            }
            const _0x567075 = String(_0x4cee0f.innerText || _0x4cee0f.textContent || "").trim();
            return _0x567075 === "×" || _0x567075 === "X" || _0x567075 === "关闭";
          });
          if (_0x4d927e) {
            try {
              await _0x4f4edb(_0x4d927e, null);
              _0x473670 += 1;
            } catch (_0x4a266f) {}
          }
        }
      }
      if (typeof _0x5619a8 === "number") {
        if (!(await _0x155f4c(450 + Math.random() * 350, _0x5619a8))) {
          return _0x473670;
        }
      } else {
        await _0x144308(450 + Math.random() * 350);
      }
      const _0x5d1f6c = String(document.body?.innerText || "");
      if (!/登录后即可|扫码登录|验证码登录|密码登录/.test(_0x5d1f6c)) {
        break;
      }
    }
    return _0x473670;
  }
  async function _0x5e9448(_0x2d1130) {
    try {
      if (_0x321eb0()) {
        const _0x3b77bc = _0xfbe77f?.taskId || "";
        if (_0x3b77bc) {
          _0x4125a9({
            taskId: _0x3b77bc,
            message: "检测到安全验证（滑块/验证码），请在采集窗口完成验证后继续…",
            level: "warning"
          });
        }
        await _0x16da8f(typeof _0x2d1130 === "string" ? _0x2d1130 : "ENTITY");
        if (_0x3b77bc) {
          _0x4125a9({
            taskId: _0x3b77bc,
            message: "安全验证已完成，继续采集",
            level: "info"
          });
        }
      } else {
        await _0x4f4634();
      }
    } catch (_0x14dcea) {}
    return _0x1dfb8c(_0x2d1130);
  }
  function _0x3418ad() {
    const _0x587b6d = typeof _0x33a67a === "function" ? _0x33a67a().length : 0;
    const _0x40f204 = document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]").length;
    const _0x431463 = document.querySelectorAll("a[href*=\"/user/\"]").length;
    const _0x3d9def = document.querySelectorAll("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], div[class*=\"CommentItem\"]").length;
    const _0x3bc8e2 = String(document.body?.innerText || "").replace(/\s+/g, "").length;
    const _0x551326 = /登录后即可|扫码登录|验证码登录|密码登录/.test(String(document.body?.innerText || ""));
    return {
      cards: _0x587b6d,
      videoLinks: _0x40f204,
      userLinks: _0x431463,
      commentNodes: _0x3d9def,
      bodyLen: _0x3bc8e2,
      loginGate: _0x551326,
      apiCached: _0x2ad609.size
    };
  }
  async function _0x306158(_0xad912, _0x5e5208, {
    sourceType = "blogger",
    maxWaitMs = 12000
  } = {}) {
    const _0x265c93 = Date.now();
    const _0x3e7cab = sourceType === "comment";
    const _0x4e7477 = _0x3e7cab ? Math.min(maxWaitMs, 3000) : maxWaitMs;
    let _0x300223 = _0x4e7477;
    let _0x10c901 = false;
    let _0x3a7ee3 = 0;
    let _0x124e5e = 0;
    let _0x126daf = false;
    while (Date.now() - _0x265c93 < _0x300223) {
      if (_0xad912 !== _0x261e0c) {
        return false;
      }
      await _0x5e9448(_0xad912);
      const _0x1c1751 = !_0x3e7cab && _0x2a8862();
      if (_0x1c1751) {
        _0x126daf = true;
      }
      const _0x29b855 = _0x2a0c74(sourceType);
      const _0xc7795b = _0x3418ad();
      const _0x579065 = (_0x29b855.length || 0) + (_0xc7795b.cards || 0) + (_0xc7795b.videoLinks || 0) + (_0xc7795b.userLinks || 0) + (_0x3e7cab ? _0xc7795b.commentNodes || 0 : 0);
      if (_0x579065 > _0x3a7ee3) {
        _0x3a7ee3 = _0x579065;
      }
      const _0x30b527 = _0x29b855.length > 0 || _0xc7795b.cards > 0 || _0x3e7cab && _0xc7795b.commentNodes > 0 || _0xc7795b.videoLinks >= 3 && !_0x3e7cab || _0xc7795b.userLinks >= 3 && !_0x3e7cab;
      if (_0x30b527 && !_0x1c1751) {
        return true;
      }
      if (!_0x10c901 && !_0x3e7cab && Date.now() - _0x265c93 >= _0x4e7477 - 80) {
        const _0x3ca32c = _0x1c1751 || _0x126daf || _0x3a7ee3 > 0 || _0xc7795b.loginGate || document.readyState !== "complete";
        const _0x16c6d6 = _0x1c1751 || _0x126daf ? Math.max(60000, Math.round(_0x4e7477 * 3)) : Math.min(Math.round(_0x4e7477 * 2), 28000);
        _0x300223 = _0x3b1316(_0x4e7477, {
          progress: _0x3ca32c,
          hardCapMs: _0x16c6d6
        });
        if (_0x300223 > _0x4e7477) {
          _0x10c901 = true;
          _0x4125a9({
            taskId: _0x5e5208,
            message: _0x1c1751 || _0x126daf ? "检测到「加载中」，继续等待搜索结果…" : "网络较慢，继续等待搜索结果加载…",
            level: "info"
          });
        }
      }
      if (_0x10c901 && !_0x3e7cab && (_0x1c1751 || _0x126daf) && _0x300223 < 60000 && Date.now() - _0x265c93 >= _0x300223 - 80) {
        _0x300223 = 60000;
        _0x4125a9({
          taskId: _0x5e5208,
          message: "页面仍显示「加载中」，再耐心等待一会儿…",
          level: "info"
        });
      }
      if (!_0x3e7cab && Date.now() - _0x124e5e > 3000) {
        _0x124e5e = Date.now();
        const _0x1cf917 = Math.floor((Date.now() - _0x265c93) / 1000);
        const _0x32fad4 = Math.floor(_0x300223 / 1000);
        _0x4125a9({
          taskId: _0x5e5208,
          message: _0x1c1751 ? "检测到「加载中」，等待页面加载完成… (" + _0x1cf917 + "s/" + _0x32fad4 + "s)" : _0xc7795b.loginGate ? "正在准备数据，请稍候…" : "正在加载搜索结果…",
          level: _0x1c1751 || _0xc7795b.loginGate ? "warning" : "info"
        });
      }
      if (!_0x3e7cab && !_0x1c1751) {
        try {
          window.scrollBy(0, 240 + Math.floor(Math.random() * 160));
        } catch (_0x583b4e) {}
      } else if (_0x3e7cab) {
        _0x38705e(_0x4a8389(), "线索采集：等待评论就绪期间锁定暂停");
      }
      if (!(await _0x155f4c(_0x3e7cab ? 400 : 700 + Math.random() * 500, _0xad912))) {
        return false;
      }
    }
    if (!_0x3e7cab && _0x2a8862()) {
      _0x4125a9({
        taskId: _0x5e5208,
        message: "等待超时，页面仍显示「加载中」，将按当前已捕获数据继续（可能偏少）",
        level: "warning"
      });
      return false;
    }
    return true;
  }
  function _0x3b98a2(_0x32d708, _0x1aed80, {
    nickname: _0xe087e2,
    userUrl: _0x160630
  }) {
    const _0x16e3eb = String(_0xe087e2 || "").trim().replace(/^@+/, "");
    const _0x2996fc = _0x2dea5c(_0x160630 || "");
    const _0xf9cad0 = _0x236e9d(_0x2996fc, _0x16e3eb);
    if (!_0xf9cad0 || !_0x2996fc || !_0x16e3eb || _0x16e3eb === "未知作者" || _0x1aed80.has(_0xf9cad0)) {
      return false;
    }
    if (/^(关注|粉丝|获赞|私信|回关|已关注|相互关注|互相关注)$/.test(_0x16e3eb)) {
      return false;
    }
    if (_0x16e3eb.length > 40) {
      return false;
    }
    _0x1aed80.add(_0xf9cad0);
    _0x32d708.push({
      nickname: _0x16e3eb,
      userUrl: _0x2996fc,
      userKey: _0xf9cad0
    });
    return true;
  }
  function _0x3b68c6() {
    const _0x7e781d = [];
    const _0x42c135 = new Set();
    for (const _0xac595e of _0x2a0c74("blogger")) {
      _0x3b98a2(_0x7e781d, _0x42c135, _0xac595e);
    }
    const _0x8f0b6d = typeof _0x33a67a === "function" ? _0x33a67a() : [];
    const _0x4ef3cd = _0x8f0b6d.length ? _0x8f0b6d : Array.from(document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"/user/\"]")).map(_0x1bcfaa => _0x1bcfaa.closest("div, li, article, section") || _0x1bcfaa).filter((_0x38ffcc, _0x29949e, _0x3ebd12) => _0x38ffcc && _0x3ebd12.indexOf(_0x38ffcc) === _0x29949e).slice(0, 120);
    for (const _0x58a36d of _0x4ef3cd) {
      const _0x1dfab5 = _0x35c048(_0x58a36d);
      let _0x24ee2c = "";
      let _0xc982d8 = "";
      if (_0x1dfab5?.secUid) {
        _0x24ee2c = "https://www.douyin.com/user/" + _0x1dfab5.secUid;
        _0xc982d8 = String(_0x1dfab5.nickname || "").trim().replace(/^@+/, "");
      }
      if (!_0x24ee2c) {
        _0x24ee2c = typeof _0x4dcc02 === "function" ? _0x4dcc02(_0x58a36d) : "";
      }
      if (!_0x24ee2c) {
        const _0x19f394 = _0x58a36d.querySelector?.("a[href*=\"/user/\"]");
        if (_0x19f394) {
          _0x24ee2c = _0x2dea5c(_0x19f394.href || _0x19f394.getAttribute?.("href") || "");
        }
      }
      if (!_0xc982d8 || _0xc982d8 === "未知作者") {
        _0xc982d8 = (typeof _0x2ceb88 === "function" ? _0x2ceb88(_0x58a36d, _0x24ee2c) : "") || _0xc982d8;
      }
      if (!_0xc982d8 || _0xc982d8 === "未知作者") {
        _0xc982d8 = _0x3cf624(_0x58a36d.innerText || _0x58a36d.textContent || "") || _0xc982d8;
      }
      _0x3b98a2(_0x7e781d, _0x42c135, {
        nickname: _0xc982d8,
        userUrl: _0x24ee2c
      });
    }
    const _0x2e3b44 = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const _0x3e5fbf of _0x2e3b44) {
      if (!_0x1b22e4(_0x3e5fbf)) {
        continue;
      }
      const _0xe24870 = _0x3e5fbf.href || _0x3e5fbf.getAttribute?.("href") || "";
      if (!_0xe24870 || _0xe24870.includes("/user/self")) {
        continue;
      }
      const _0x343cb5 = _0x2dea5c(_0xe24870);
      if (!_0x343cb5) {
        continue;
      }
      let _0x243221 = String(_0x3e5fbf.innerText || _0x3e5fbf.textContent || _0x3e5fbf.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (!_0x243221 || _0x243221.length > 40 || /^(关注|粉丝|获赞|私信|回关|已关注)$/.test(_0x243221)) {
        const _0x201d09 = _0x3e5fbf.closest("div, li, article, section") || _0x3e5fbf.parentElement;
        const _0x471500 = String(_0x201d09?.innerText || "").split(/\n+/).map(_0x4aa50f => _0x4aa50f.trim()).find(_0x31776a => _0x31776a && _0x31776a.length <= 40 && !/粉丝|关注|获赞|抖音号|私信|点赞|评论|收藏/.test(_0x31776a));
        _0x243221 = _0x471500 ? _0x471500.replace(/^@+/, "") : "";
        if (!_0x243221) {
          _0x243221 = _0x3cf624(_0x201d09?.innerText || "") || "";
        }
      }
      _0x3b98a2(_0x7e781d, _0x42c135, {
        nickname: _0x243221,
        userUrl: _0x343cb5
      });
    }
    return _0x7e781d;
  }
  async function _0x37584e(_0x4c68e6, _0x5c5b7a = 8000, _0x21f088 = "fans") {
    const _0x1590cd = Date.now();
    while (Date.now() - _0x1590cd < _0x5c5b7a) {
      if (_0x4c68e6 !== _0x261e0c) {
        return false;
      }
      const _0x31fed1 = _0x21f088 === "following" ? _0x399dc0() : _0x3419a4();
      if (_0x31fed1) {
        return true;
      }
      if (!(await _0x155f4c(400, _0x4c68e6))) {
        return false;
      }
    }
    return false;
  }
  function _0x3419a4() {
    const _0x399fff = _0x1d82c7();
    if (_0x399fff?.findEntitySelfFansEntry) {
      return _0x399fff.findEntitySelfFansEntry();
    }
    if (_0x399fff?.findEntitySelfProfileRelationEntry) {
      return _0x399fff.findEntitySelfProfileRelationEntry("fans");
    }
    return null;
  }
  function _0x399dc0() {
    const _0x376292 = _0x1d82c7();
    if (_0x376292?.findEntitySelfFollowingEntry) {
      return _0x376292.findEntitySelfFollowingEntry();
    }
    if (_0x376292?.findEntitySelfProfileRelationEntry) {
      return _0x376292.findEntitySelfProfileRelationEntry("following");
    }
    return null;
  }
  async function _0x2f0de7(_0x5745c4, _0x33a50a = 8000) {
    const _0x51203d = Date.now();
    const _0x4f067c = () => {
      const _0x5f097c = Array.from(document.querySelectorAll(".semi-tabs-bar"));
      return _0x5f097c.find(_0xad1b0c => {
        const _0x4d1d97 = String(_0xad1b0c.innerText || "").replace(/\s+/g, "");
        if (!/\u5173注|\u7c89丝/.test(_0x4d1d97)) {
          return false;
        }
        let _0x54c1e6 = _0xad1b0c.parentElement;
        while (_0x54c1e6 && _0x54c1e6 !== document.body) {
          if (window.getComputedStyle(_0x54c1e6).position === "fixed") {
            return true;
          }
          _0x54c1e6 = _0x54c1e6.parentElement;
        }
        return false;
      }) || null;
    };
    while (Date.now() - _0x51203d < _0x33a50a) {
      if (_0x5745c4 !== _0x261e0c) {
        return false;
      }
      if (_0x4f067c()) {
        return true;
      }
      const _0x27ce0b = Array.from(document.querySelectorAll("div")).some(_0x377d81 => {
        if (!_0x1b22e4(_0x377d81)) {
          return false;
        }
        const _0x66d1f9 = window.getComputedStyle(_0x377d81);
        const _0x420b95 = parseInt(_0x66d1f9.zIndex) || 0;
        if (_0x66d1f9.position !== "fixed" || _0x420b95 < 1000) {
          return false;
        }
        return _0x377d81.querySelectorAll("a[href*=\"/user/\"]").length >= 2 || /粉丝|相互关注|互相关注/.test(String(_0x377d81.innerText || "").substring(0, 200));
      });
      if (_0x27ce0b) {
        return true;
      }
      const _0x63b6cd = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(_0x41bb60 => _0x1b22e4(_0x41bb60));
      const _0x93cc2e = _0x63b6cd.some(_0x9f4952 => _0x9f4952.querySelectorAll("a[href*=\"/user/\"]").length > 0 || /粉丝|相互关注|互相关注/.test(String(_0x9f4952.innerText || _0x9f4952.textContent || "")));
      if (_0x93cc2e) {
        return true;
      }
      if (!(await _0x155f4c(500, _0x5745c4))) {
        return false;
      }
    }
    return false;
  }
  function _0x52614d() {
    const _0x1f448b = Array.from(document.querySelectorAll("[role=\"dialog\"], [class*=\"modal\"], [class*=\"Modal\"], [class*=\"drawer\"], [class*=\"Drawer\"], [class*=\"popup\"], [class*=\"Popup\"], [class*=\"semi-modal\"], [class*=\"semi-drawer\"], [class*=\"semi-portal\"]")).filter(_0x38e74d => _0x1b22e4(_0x38e74d));
    const _0x3d475d = _0x1f448b.length ? _0x1f448b : [document.body];
    for (const _0x4d1e18 of _0x3d475d) {
      const _0x1d74d0 = Array.from(_0x4d1e18.querySelectorAll("button, [role=\"tab\"], [role=\"button\"], div, span, a"));
      const _0x39a046 = _0x1d74d0.find(_0xc61b05 => {
        if (!_0x1b22e4(_0xc61b05)) {
          return false;
        }
        const _0x513550 = String(_0xc61b05.innerText || _0xc61b05.textContent || "").replace(/\s+/g, "").trim();
        return _0x513550 === "相互关注" || _0x513550 === "互相关注";
      });
      if (!_0x39a046) {
        continue;
      }
      if (_0x39a046.matches?.("button, [role=\"tab\"], [role=\"button\"], a")) {
        return _0x39a046;
      } else {
        return _0x39a046.closest?.("button, [role=\"tab\"], [role=\"button\"], a") || _0x39a046;
      }
    }
    return null;
  }
  let _0x4e0c54 = null;
  function _0x1d82c7() {
    if (!_0x4e0c54) {
      try {
        _0x4e0c54 = require("./entityMutualFollowScraper");
      } catch (_0x1d73b2) {
        _0x4e0c54 = null;
      }
    }
    return _0x4e0c54;
  }
  function _0x5dec6e() {
    const _0x5036bf = _0x1d82c7();
    if (_0x5036bf?.findEntityFollowingTab) {
      return _0x5036bf.findEntityFollowingTab(_0x2c9c7 => _0x4125a9({
        message: _0x2c9c7,
        level: "info"
      }));
    }
    return null;
  }
  function _0x5143ec() {
    if (window.__radar_entity_mutual_filter_active) {
      return true;
    }
    const _0x34a5b1 = _0x52614d();
    if (!_0x34a5b1) {
      return false;
    }
    const _0x1d7cbe = ((_0x34a5b1.getAttribute?.("aria-selected") || "") + " " + (_0x34a5b1.className || "")).toLowerCase();
    return /true|active|selected|checked/.test(_0x1d7cbe);
  }
  function _0x361e20() {
    const _0x20eed5 = _0x1d82c7();
    if (_0x20eed5?.findEntityRelationModalContainer) {
      return _0x20eed5.findEntityRelationModalContainer();
    }
    return null;
  }
  function _0x5bcd35() {
    const _0x412835 = _0x1d82c7();
    if (_0x412835?.findEntityRelationListScroller) {
      return _0x412835.findEntityRelationListScroller();
    }
    return null;
  }
  function _0x28e815() {
    const _0xd975f6 = "a[href*=\"/user/\"], a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]";
    const _0x2cad5e = Array.from(document.querySelectorAll("div, main, section, ul")).filter(_0x27f91a => {
      if (!_0x1b22e4(_0x27f91a)) {
        return false;
      }
      const _0x3d513e = window.getComputedStyle(_0x27f91a);
      const _0x3d627b = /(auto|scroll)/.test(_0x3d513e.overflowY || "") && _0x27f91a.scrollHeight > _0x27f91a.clientHeight + 120;
      if (!_0x3d627b) {
        return false;
      }
      return _0x27f91a.querySelectorAll(_0xd975f6).length >= 4;
    }).sort((_0x16acfc, _0x5d9004) => {
      const _0x1bfb7e = _0x5d9004.querySelectorAll(_0xd975f6).length - _0x16acfc.querySelectorAll(_0xd975f6).length;
      if (_0x1bfb7e !== 0) {
        return _0x1bfb7e;
      }
      return _0x5d9004.scrollHeight - _0x5d9004.clientHeight - (_0x16acfc.scrollHeight - _0x16acfc.clientHeight);
    });
    return _0x2cad5e[0] || document.scrollingElement || document.documentElement;
  }
  function _0x4d30a9(_0x24c949, _0x594524) {
    let _0x54e6ca = _0x24c949;
    while (_0x54e6ca && _0x54e6ca !== _0x594524 && _0x54e6ca !== document.body) {
      const _0x466915 = _0x54e6ca.querySelectorAll("a[href*=\"/user/\"]").length;
      const _0x20e1d8 = String(_0x54e6ca.innerText || _0x54e6ca.textContent || "");
      const _0x3c7e84 = /相互关注|已关注|回关|\+ 关注|移除/.test(_0x20e1d8);
      if (_0x466915 <= 3 && _0x3c7e84) {
        return _0x54e6ca;
      }
      _0x54e6ca = _0x54e6ca.parentElement;
    }
    return _0x24c949.closest("li") || _0x24c949.parentElement;
  }
  function _0x27051b(_0x3bb879 = "mutual") {
    const _0x236825 = _0x1d82c7();
    const _0x33d2bd = {
      sourceType: _0x3bb879 === "following" ? "following" : "mutual",
      collectEntityUsersFromApiBuffer: _0x2a0c74,
      normalizeDouyinAuthorProfileUrl: _0x2dea5c,
      buildEntityUserKey: _0x236e9d,
      logFn: _0x19d0b3 => _0x4125a9({
        message: _0x19d0b3,
        level: "info"
      })
    };
    if (_0x236825?.collectEntityRelationUsersFromList) {
      return _0x236825.collectEntityRelationUsersFromList(_0x33d2bd);
    }
    if (_0x236825?.collectEntityMutualUsersFromList) {
      return _0x236825.collectEntityMutualUsersFromList(_0x33d2bd);
    }
    return [];
  }
  function _0x3ef47e() {
    return _0x27051b("mutual");
  }
  async function _0x15acfb(_0x23ca84, _0x1b78a5, {
    forceBottom = false
  } = {}) {
    const _0x1adf2b = _0x23ca84 || document.scrollingElement || document.documentElement;
    const _0x1462ed = _0x1adf2b === document.scrollingElement || _0x1adf2b === document.documentElement || _0x1adf2b === document.body;
    const _0x4257ac = _0x1462ed ? window.pageYOffset || document.documentElement.scrollTop || 0 : _0x1adf2b.scrollTop || 0;
    const _0x469b6b = _0x1462ed ? window.innerHeight || document.documentElement.clientHeight || 800 : _0x1adf2b.clientHeight || 800;
    const _0x444b8f = _0x1462ed ? Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) : _0x1adf2b.scrollHeight || 0;
    const _0x5f2da3 = forceBottom ? Math.max(_0x469b6b * 2.8, 1800) : Math.floor(_0x469b6b * (1.8 + Math.random() * 1));
    try {
      const _0x5600a7 = document.activeElement;
      if (_0x5600a7 && typeof _0x5600a7.blur === "function") {
        _0x5600a7.blur();
      }
      window.focus?.();
      document.body?.focus?.();
      const _0x3ae686 = (_0x5bab52, _0x59e27d) => {
        const _0x27355f = {
          key: _0x5bab52,
          code: _0x5bab52,
          keyCode: _0x59e27d,
          which: _0x59e27d,
          bubbles: true,
          cancelable: true
        };
        window.dispatchEvent(new KeyboardEvent("keydown", _0x27355f));
        document.dispatchEvent(new KeyboardEvent("keydown", _0x27355f));
        window.dispatchEvent(new KeyboardEvent("keyup", _0x27355f));
        document.dispatchEvent(new KeyboardEvent("keyup", _0x27355f));
      };
      _0x3ae686("PageDown", 34);
      if (!(await _0x155f4c(220, _0x1b78a5))) {
        return false;
      }
      _0x3ae686("PageDown", 34);
      if (!(await _0x155f4c(220, _0x1b78a5))) {
        return false;
      }
      _0x3ae686("End", 35);
      if (!(await _0x155f4c(180, _0x1b78a5))) {
        return false;
      }
      const _0x5c5fc4 = _0x1462ed ? document.scrollingElement || document.documentElement : _0x1adf2b;
      const _0x4f69c9 = _0x3f5ba3 => {
        const _0x41bd82 = {
          deltaY: _0x3f5ba3,
          deltaMode: 0,
          bubbles: true,
          cancelable: true
        };
        _0x5c5fc4.dispatchEvent(new WheelEvent("wheel", _0x41bd82));
        document.dispatchEvent(new WheelEvent("wheel", _0x41bd82));
        window.dispatchEvent(new WheelEvent("wheel", _0x41bd82));
      };
      _0x4f69c9(_0x5f2da3);
      if (!(await _0x155f4c(160, _0x1b78a5))) {
        return false;
      }
      _0x4f69c9(Math.floor(_0x5f2da3 * 0.8));
    } catch (_0x43413f) {}
    const _0x302f6b = (_0x2f7b76, _0xb5c457, _0x478113) => {
      if (!_0x2f7b76) {
        return;
      }
      const _0x2c538e = _0x2f7b76.scrollTop || 0;
      const _0x4240bd = Math.max(0, (_0x2f7b76.scrollHeight || 0) - (_0x2f7b76.clientHeight || _0x469b6b));
      if (_0x478113) {
        if (_0x2c538e >= _0x4240bd - 20 && _0x4240bd > 100) {
          _0x2f7b76.scrollTop = Math.max(0, _0x4240bd - 250);
        }
        try {
          _0x2f7b76.scrollTo({
            top: _0x2f7b76.scrollHeight || 99999,
            behavior: "smooth"
          });
        } catch (_0x129cfb) {
          _0x2f7b76.scrollTop = _0x4240bd + 80;
        }
      } else {
        try {
          _0x2f7b76.scrollBy({
            top: _0xb5c457,
            behavior: "smooth"
          });
        } catch (_0x386e43) {
          _0x2f7b76.scrollTop = _0x2c538e + _0xb5c457;
        }
      }
    };
    if (_0x1462ed) {
      window.scrollBy(0, _0x5f2da3);
      if (forceBottom) {
        const _0x403156 = Math.max(0, Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - _0x469b6b + 80);
        window.scrollTo(0, _0x403156);
        document.documentElement.scrollTop = _0x403156;
        if (document.body) {
          document.body.scrollTop = _0x403156;
        }
      }
    } else {
      _0x302f6b(_0x1adf2b, _0x5f2da3, forceBottom);
      try {
        window.scrollBy(0, Math.floor(_0x5f2da3 * 0.85));
        if (forceBottom) {
          const _0x4a70c0 = Math.max(0, Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - _0x469b6b + 80);
          window.scrollTo(0, _0x4a70c0);
        }
      } catch (_0x2e4db7) {}
    }
    try {
      const _0x165328 = _0x1462ed ? window : _0x1adf2b;
      _0x165328.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
      document.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
      window.dispatchEvent(new Event("scroll", {
        bubbles: true
      }));
    } catch (_0x7579d2) {}
    if (!(await _0x155f4c(1400 + Math.random() * 800, _0x1b78a5))) {
      return false;
    }
    const _0x5e7153 = _0x1462ed ? window.pageYOffset || document.documentElement.scrollTop || 0 : _0x1adf2b.scrollTop || 0;
    const _0x236a80 = _0x1462ed ? Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) : _0x1adf2b.scrollHeight || 0;
    const _0x54c00e = _0x5e7153 + _0x469b6b >= _0x236a80 - 160;
    return {
      moved: _0x5e7153 > _0x4257ac + 40,
      atBottom: _0x54c00e,
      before: _0x4257ac,
      after: _0x5e7153,
      delta: Math.round(_0x5e7153 - _0x4257ac),
      scrollHeight: _0x236a80
    };
  }
  function _0x20eabc(_0x2e45b6) {
    if (_0x2e45b6 === "mutual" || _0x2e45b6 === "following") {
      return _0x5bcd35();
    }
    if (_0x2e45b6 === "blogger" || _0x2e45b6 === "user" || _0x2e45b6 === "video") {
      return _0x28e815();
    }
    if (_0x2e45b6 === "comment") {
      const _0x35db6d = _0x42c182(document.body) || _0x52bff0(document.body);
      if (_0x35db6d && _0x35db6d !== document.body) {
        return _0x35db6d;
      }
    }
    return document.scrollingElement || document.documentElement;
  }
  function _0x2daabe() {
    const _0x4e5b91 = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]";
    const _0xbf9215 = Array.from(document.querySelectorAll(_0x4e5b91));
    const _0x28d8b5 = new Set();
    for (const _0x24cdef of _0xbf9215.slice(0, 80)) {
      let _0x3bb437 = _0x24cdef?.parentElement;
      let _0x26f6bf = 0;
      while (_0x3bb437 && _0x3bb437 !== document.body && _0x26f6bf < 12) {
        if ((_0x3bb437.scrollHeight || 0) > (_0x3bb437.clientHeight || 0) + 80) {
          _0x28d8b5.add(_0x3bb437);
        }
        _0x3bb437 = _0x3bb437.parentElement;
        _0x26f6bf += 1;
      }
    }
    for (const _0x4cb8f6 of document.querySelectorAll("main, section, [class*=\"scroll\"], [class*=\"Scroll\"]")) {
      if ((_0x4cb8f6.scrollHeight || 0) > (_0x4cb8f6.clientHeight || 0) + 80) {
        _0x28d8b5.add(_0x4cb8f6);
      }
    }
    return [..._0x28d8b5].map(_0x4cf8c7 => {
      const _0x1a554e = _0x4cf8c7.getBoundingClientRect?.() || {};
      const _0xcd1a3c = _0x4cf8c7.querySelectorAll?.(_0x4e5b91)?.length || 0;
      const _0x57ee8b = Math.max(0, (_0x4cf8c7.scrollHeight || 0) - (_0x4cf8c7.clientHeight || 0));
      const _0x35aa73 = Number(_0x1a554e.width) > 80 && Number(_0x1a554e.height) > 80 && Number(_0x1a554e.bottom) > 0 && Number(_0x1a554e.top) < (window.innerHeight || 0);
      return {
        node: _0x4cf8c7,
        rect: _0x1a554e,
        cardCount: _0xcd1a3c,
        range: _0x57ee8b,
        inViewport: _0x35aa73
      };
    }).filter(_0xbe3055 => _0xbe3055.range > 80).sort((_0x2ad8fb, _0x3b993a) => {
      if (_0x2ad8fb.inViewport !== _0x3b993a.inViewport) {
        if (_0x2ad8fb.inViewport) {
          return -1;
        } else {
          return 1;
        }
      }
      if (_0x2ad8fb.cardCount !== _0x3b993a.cardCount) {
        return _0x3b993a.cardCount - _0x2ad8fb.cardCount;
      }
      return _0x3b993a.range - _0x2ad8fb.range;
    });
  }
  async function _0x219779(_0x553dc4, _0x2086a5) {
    const _0x1fb717 = window.pageYOffset || document.documentElement.scrollTop || 0;
    const _0x19366e = _0x2daabe();
    const _0x2d5769 = new Map(_0x19366e.map(({
      node: _0x14745a
    }) => [_0x14745a, Number(_0x14745a.scrollTop) || 0]));
    try {
      window.scrollBy(0, _0x553dc4);
    } catch (_0x8e7513) {}
    if (!(await _0x155f4c(100, _0x2086a5))) {
      return {
        cancelled: true
      };
    }
    const _0x55eb7b = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (_0x55eb7b > _0x1fb717 + 2) {
      return {
        cancelled: false,
        method: "window",
        windowDelta: _0x55eb7b - _0x1fb717,
        innerDelta: 0,
        atBottom: (window.innerHeight || 0) + _0x55eb7b >= Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - 120
      };
    }
    const _0xacba18 = _0x19366e[0] || null;
    const _0x95dca2 = _0xacba18?.rect || {};
    const _0x1aa240 = Math.max(1, Math.round(Number(_0x95dca2.left) + Math.min(Number(_0x95dca2.width) || window.innerWidth || 1200, window.innerWidth || 1200) * 0.6));
    const _0x26fde4 = Math.max(1, Math.round(Number(_0x95dca2.top) + Math.min(Number(_0x95dca2.height) || window.innerHeight || 800, window.innerHeight || 800) * 0.72));
    let _0x189538 = null;
    try {
      _0x189538 = await _0x169ee9.invoke("entity-leadgen-native-scroll", {
        deltaY: _0x553dc4,
        x: Math.min((window.innerWidth || 1200) - 2, _0x1aa240),
        y: Math.min((window.innerHeight || 800) - 2, _0x26fde4)
      });
    } catch (_0x6d985b) {}
    if (!(await _0x155f4c(320, _0x2086a5))) {
      return {
        cancelled: true
      };
    }
    const _0x1929f0 = window.pageYOffset || document.documentElement.scrollTop || 0;
    let _0x484b3e = null;
    let _0x4f2512 = 0;
    for (const {
      node: _0xd1762c
    } of _0x19366e) {
      const _0x5eb93d = (Number(_0xd1762c.scrollTop) || 0) - Number(_0x2d5769.get(_0xd1762c) || 0);
      if (Math.abs(_0x5eb93d) > Math.abs(_0x4f2512)) {
        _0x484b3e = _0xd1762c;
        _0x4f2512 = _0x5eb93d;
      }
    }
    if (_0x1929f0 > _0x1fb717 + 2 || _0x4f2512 > 2) {
      return {
        cancelled: false,
        method: _0x189538?.method || "native",
        windowDelta: _0x1929f0 - _0x1fb717,
        innerDelta: _0x4f2512,
        nativeOk: _0x189538?.ok === true,
        atBottom: _0x484b3e ? (Number(_0x484b3e.scrollTop) || 0) + (Number(_0x484b3e.clientHeight) || 0) >= (Number(_0x484b3e.scrollHeight) || 0) - 120 : (window.innerHeight || 0) + _0x1929f0 >= Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0) - 120
      };
    }
    if (_0xacba18?.node) {
      const _0x1e79c3 = Number(_0xacba18.node.scrollTop) || 0;
      try {
        if (typeof _0xacba18.node.scrollBy === "function") {
          _0xacba18.node.scrollBy({
            top: _0x553dc4,
            behavior: "auto"
          });
        } else {
          _0xacba18.node.scrollTop = _0x1e79c3 + _0x553dc4;
        }
        _0xacba18.node.dispatchEvent(new Event("scroll", {
          bubbles: true
        }));
      } catch (_0x330ff1) {}
      if (!(await _0x155f4c(180, _0x2086a5))) {
        return {
          cancelled: true
        };
      }
      _0x4f2512 = (Number(_0xacba18.node.scrollTop) || 0) - _0x1e79c3;
    }
    return {
      cancelled: false,
      method: _0x4f2512 > 2 ? "dom-scroll-root" : _0x189538?.method || "no-movement",
      windowDelta: (window.pageYOffset || document.documentElement.scrollTop || 0) - _0x1fb717,
      innerDelta: _0x4f2512,
      nativeOk: _0x189538?.ok === true,
      candidateCount: _0x19366e.length,
      atBottom: _0xacba18?.node ? (Number(_0xacba18.node.scrollTop) || 0) + (Number(_0xacba18.node.clientHeight) || 0) >= (Number(_0xacba18.node.scrollHeight) || 0) - 120 : false
    };
  }
  async function _0x1866a4(_0x36f036, _0x4aa288) {
    _0x36f036;
    const _0x1bb0d3 = window.pageYOffset || document.documentElement.scrollTop || 0;
    const _0x54997d = String(document.visibilityState || "");
    let _0x9990be = null;
    const _0x3b3567 = _0x3b9545();
    const _0x4be4fe = () => typeof _0x49d3d0 === "function" ? _0x49d3d0().length : 0;
    const _0x46d894 = () => typeof _0x33a67a === "function" ? _0x33a67a().length : 0;
    const _0x2bd860 = () => ({
      y: window.pageYOffset || document.documentElement.scrollTop || 0,
      innerWidth: window.innerWidth || 0,
      innerHeight: window.innerHeight || 0,
      scrollHeight: Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0),
      htmlOverflow: window.getComputedStyle(document.documentElement).overflowY || "",
      bodyOverflow: document.body ? window.getComputedStyle(document.body).overflowY || "" : ""
    });
    const _0x2edbf1 = _0x3b3567?.performVideoSearchWindowScroll ? await _0x3b3567.performVideoSearchWindowScroll({
      scrollBy: async _0x206b9c => {
        _0x9990be = await _0x219779(_0x206b9c, _0x4aa288);
      },
      wait: _0x3075c4 => _0x155f4c(_0x3075c4, _0x4aa288),
      readApiCount: _0x4be4fe,
      readDomCount: _0x46d894,
      readViewport: _0x2bd860,
      delta: 1000,
      waitMinMs: 1800,
      waitMaxMs: 3200
    }) : await (async () => {
      const _0x1c508e = _0x4be4fe();
      const _0x16d33c = _0x46d894();
      _0x9990be = await _0x219779(1000, _0x4aa288);
      if (_0x9990be?.cancelled) {
        return {
          cancelled: true
        };
      }
      if (!(await _0x155f4c(1800 + Math.random() * 1400, _0x4aa288))) {
        return {
          cancelled: true
        };
      }
      const _0x43c80a = _0x4be4fe();
      const _0x46e3bb = _0x46d894();
      return {
        beforeApi: _0x1c508e,
        afterApi: _0x43c80a,
        beforeDom: _0x16d33c,
        afterDom: _0x46e3bb,
        sourceGrew: _0x43c80a > _0x1c508e || _0x46e3bb > _0x16d33c,
        beforeViewport: {
          y: _0x1bb0d3
        },
        afterViewport: _0x2bd860()
      };
    })();
    if (_0x2edbf1?.cancelled) {
      return false;
    }
    const _0x6084f9 = window.pageYOffset || document.documentElement.scrollTop || 0;
    const _0x4884ed = window.innerHeight || document.documentElement.clientHeight || 800;
    const _0x590bb4 = Math.max(document.documentElement.scrollHeight || 0, document.body?.scrollHeight || 0);
    const _0x46d997 = _0x6084f9 > _0x1bb0d3 + 40;
    const _0x566ee0 = typeof _0x9990be?.atBottom === "boolean" ? _0x9990be.atBottom : _0x6084f9 + _0x4884ed >= _0x590bb4 - 120;
    const _0x1caa93 = Number(_0x9990be?.innerDelta) || 0;
    const _0x363e2d = Math.abs(_0x6084f9 - _0x1bb0d3) >= Math.abs(_0x1caa93) ? _0x6084f9 - _0x1bb0d3 : _0x1caa93;
    return {
      moved: _0x46d997 || Math.abs(_0x1caa93) > 2,
      atBottom: _0x566ee0,
      before: _0x1bb0d3,
      after: _0x6084f9,
      delta: Math.round(_0x363e2d),
      windowDelta: Math.round(_0x6084f9 - _0x1bb0d3),
      innerDelta: Math.round(_0x1caa93),
      scrollHeight: _0x590bb4,
      apiBefore: _0x2edbf1.beforeApi,
      apiAfter: _0x2edbf1.afterApi,
      domBefore: _0x2edbf1.beforeDom,
      domAfter: _0x2edbf1.afterDom,
      apiGrew: _0x2edbf1.sourceGrew,
      visibility: _0x54997d,
      strategy: "shared-window",
      inputMethod: _0x9990be?.method || "unknown",
      nativeOk: _0x9990be?.nativeOk === true,
      candidateCount: Number(_0x9990be?.candidateCount) || 0,
      viewport: _0x2edbf1.afterViewport || _0x2bd860()
    };
  }
  async function _0x13d667({
    token: _0x5a4133,
    taskId: _0x539e6d,
    gatherFn: _0x4315d3,
    sourceType: _0x5f0de2,
    searchKeyword = "",
    seenKeys: _0x1ef45f,
    collectedUsers: _0x4bd663,
    maxCollect: _0xb16c53,
    emptyLimit = 2,
    maxRounds = 80,
    progressLabel = "采集中"
  }) {
    let _0x196b63 = 0;
    let _0x582382 = 0;
    let _0x52a0ac = "";
    const _0x50521b = Math.max(1, Number(emptyLimit) || 2);
    const _0x45433c = Math.max(maxRounds, 80);
    for (let _0x3af7db = 0; _0x3af7db < _0x45433c; _0x3af7db += 1) {
      if (_0x5a4133 !== _0x261e0c) {
        return {
          cancelled: true
        };
      }
      if (_0xb16c53 > 0 && _0x4bd663.length >= _0xb16c53) {
        return {
          reachedLimit: true
        };
      }
      if (_0x3af7db === 0 || _0x3af7db % 3 === 0) {
        const _0x3857da = await _0x5e9448(_0x5a4133);
        if (_0x3857da > 0) {
          _0x4125a9({
            taskId: _0x539e6d,
            message: progressLabel + "：已关闭登录弹窗 ×" + _0x3857da,
            level: "info"
          });
        }
      }
      const _0x11e45f = _0x4315d3() || [];
      const _0x51a54a = _0x11e45f.map(_0x4326c9 => String(_0x4326c9?.userKey || "").trim()).filter(Boolean).sort().join("|");
      const _0x48e4a9 = !!_0x51a54a && _0x51a54a === _0x52a0ac;
      if (_0x51a54a) {
        _0x52a0ac = _0x51a54a;
      }
      let _0x17598a = 0;
      let _0x599ca3 = 0;
      for (const _0x616ebf of _0x11e45f) {
        if (!_0x616ebf?.userKey) {
          continue;
        }
        if (_0x1ef45f.has(_0x616ebf.userKey)) {
          _0x599ca3 += 1;
          continue;
        }
        _0x1ef45f.add(_0x616ebf.userKey);
        _0x4bd663.push({
          ..._0x616ebf,
          sourceType: _0x5f0de2,
          searchKeyword: searchKeyword
        });
        _0x17598a += 1;
        if (_0xb16c53 > 0 && _0x4bd663.length >= _0xb16c53) {
          break;
        }
      }
      if (_0x11e45f.length > 0 && _0x599ca3 > 0) {
        _0x4125a9({
          taskId: _0x539e6d,
          message: progressLabel + "：本轮识别 " + _0x11e45f.length + " 条，其中 " + _0x599ca3 + " 条本页已出现过（去重，已跳过）",
          level: "info"
        });
      } else if (_0x11e45f.length === 0 && _0x17598a === 0 && (_0x5f0de2 === "video" || _0x5f0de2 === "blogger") && _0x3af7db === 0) {
        const _0x394733 = typeof _0x3418ad === "function" ? _0x3418ad() : null;
        if (_0x394733 && (_0x394733.cards > 0 || _0x394733.videoLinks > 0)) {
          _0x4125a9({
            taskId: _0x539e6d,
            message: progressLabel + "：页面可见卡片约 " + _0x394733.cards + "、视频链 " + _0x394733.videoLinks + "，但本轮未能解析出有效链接，继续尝试…",
            level: "warning"
          });
        }
      }
      if (_0x17598a > 0) {
        _0x196b63 = 0;
        _0x582382 = 0;
        const _0x48f670 = _0x4bd663.slice(-_0x17598a);
        _0x4125a9({
          taskId: _0x539e6d,
          accountId: window._radar_account_id || "",
          accountName: window._radar_account_name || "",
          sourceType: _0x5f0de2,
          message: progressLabel + "：本轮新增 " + _0x17598a + "，累计 " + _0x4bd663.length,
          level: "info",
          users: _0x48f670
        });
      } else {
        _0x582382 += 1;
        _0x196b63 += 1;
        _0x4125a9({
          taskId: _0x539e6d,
          message: _0x48e4a9 ? progressLabel + "：结果未增长（仍是这 " + _0x11e45f.length + " 条，连续无新增 " + _0x582382 + "/" + _0x50521b + "，累计 " + _0x4bd663.length + "）" : progressLabel + "：本轮暂无新增（连续无新增 " + _0x582382 + "/" + _0x50521b + "，累计 " + _0x4bd663.length + "）",
          level: "info"
        });
        if (_0x5f0de2 !== "video" && (_0x196b63 >= _0x50521b || _0x582382 >= _0x50521b)) {
          _0x4125a9({
            taskId: _0x539e6d,
            message: progressLabel + "：连续 " + _0x50521b + " 轮无新数据，进入下一步（累计 " + _0x4bd663.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      }
      const _0x103b81 = _0x20eabc(_0x5f0de2);
      if (_0x5f0de2 === "mutual" || _0x5f0de2 === "following") {
        const _0x59db91 = _0x1d82c7();
        let _0xeffc41 = null;
        if (_0x59db91?.scrollEntityMutualContainer) {
          _0xeffc41 = await _0x59db91.scrollEntityMutualContainer(_0x103b81, _0x1280e3 => _0x155f4c(_0x1280e3, _0x5a4133), _0x3ecaaf => _0x4125a9({
            message: _0x3ecaaf,
            level: "info"
          }));
        } else {
          const _0x3b9497 = await _0x15acfb(_0x103b81, _0x5a4133, {
            forceBottom: true
          });
          if (_0x3b9497 === false) {
            return {
              cancelled: true
            };
          }
        }
        if (_0x17598a === 0 && _0x599ca3 > 0 && _0xeffc41 && _0xeffc41.moved === false && _0x196b63 >= 3) {
          const _0x5da178 = _0x5f0de2 === "following" ? "关注列表" : "互关";
          _0x4125a9({
            taskId: _0x539e6d,
            message: progressLabel + "：列表已无更多可加载内容（连续重复且滚动无位移），结束" + _0x5da178 + "采集（累计 " + _0x4bd663.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      } else if (_0x5f0de2 === "video") {
        const _0x19573c = await _0x1866a4(_0x103b81, _0x5a4133);
        if (_0x19573c === false) {
          return {
            cancelled: true
          };
        }
        if (_0x3af7db === 0 || _0x3af7db % 3 === 0 || !_0x19573c.apiGrew) {
          try {
            const _0x4fb9d4 = "翻页诊断：位移 " + (_0x19573c.delta || 0) + "px" + ("，API " + _0x19573c.apiBefore + "->" + _0x19573c.apiAfter) + ("，DOM " + _0x19573c.domBefore + "->" + _0x19573c.domAfter) + ("，视口 " + (_0x19573c.viewport?.innerWidth || 0) + "×" + (_0x19573c.viewport?.innerHeight || 0)) + ("，输入 " + (_0x19573c.inputMethod || "unknown")) + ("，内层位移 " + (_0x19573c.innerDelta || 0) + "px") + ("，候选 " + (_0x19573c.candidateCount || 0)) + ("，overflow " + (_0x19573c.viewport?.htmlOverflow || "?") + "/" + (_0x19573c.viewport?.bodyOverflow || "?")) + ("，触底 " + (_0x19573c.atBottom ? "是" : "否"));
            console.log("[EntityLeadgen][ScrollDiag] " + progressLabel + (" scroll=" + (_0x19573c.delta || 0) + "px") + (" api=" + _0x19573c.apiBefore + "->" + _0x19573c.apiAfter) + (" dom=" + _0x19573c.domBefore + "->" + _0x19573c.domAfter) + (" strategy=" + (_0x19573c.strategy || "?")) + (" input=" + (_0x19573c.inputMethod || "?")) + (" inner=" + (_0x19573c.innerDelta || 0) + "px") + (" candidates=" + (_0x19573c.candidateCount || 0)) + (" bottom=" + !!_0x19573c.atBottom) + (" viewport=" + (_0x19573c.viewport?.innerWidth || 0) + "x" + (_0x19573c.viewport?.innerHeight || 0)) + (" visibility=" + (_0x19573c.visibility || "?")));
            _0x4125a9({
              taskId: _0x539e6d,
              sourceType: _0x5f0de2,
              message: progressLabel + "：" + _0x4fb9d4,
              level: "info",
              diagnostic: true
            });
          } catch (_0x12227d) {}
        }
        const _0x46d5c3 = _0x3b9545();
        const _0x2d3ca9 = _0x46d5c3?.evaluateVideoSearchCollectionRound ? _0x46d5c3.evaluateVideoSearchCollectionRound({
          previousEmptyRounds: _0x17598a > 0 ? 0 : Math.max(0, _0x196b63 - 1),
          added: _0x17598a,
          sourceGrew: _0x19573c.apiGrew,
          atBottom: _0x19573c.atBottom,
          emptyLimit: Math.min(6, _0x50521b),
          bottomEmptyLimit: 3
        }) : {
          emptyRounds: _0x19573c.apiGrew ? 0 : _0x196b63,
          shouldStop: _0x17598a === 0 && !_0x19573c.apiGrew && (_0x19573c.atBottom && _0x196b63 >= 3 || _0x196b63 >= Math.min(6, _0x50521b))
        };
        _0x196b63 = _0x2d3ca9.emptyRounds;
        if (_0x2d3ca9.shouldStop || _0x582382 >= _0x50521b) {
          _0x4125a9({
            taskId: _0x539e6d,
            message: _0x19573c.atBottom ? progressLabel + "：已确认搜索结果触底，结束本词（累计 " + _0x4bd663.length + "）" : progressLabel + "：连续 " + _0x582382 + " 次下拉无新增，结束本词（累计 " + _0x4bd663.length + "）",
            level: "info"
          });
          return {
            exhausted: true
          };
        }
      } else {
        const _0x1ef495 = await _0x15acfb(_0x103b81, _0x5a4133, {
          forceBottom: true
        });
        if (_0x1ef495 === false) {
          return {
            cancelled: true
          };
        }
      }
      _0x4125a9({
        taskId: _0x539e6d,
        message: progressLabel + "：正在加载更多数据…",
        level: "info"
      });
      const _0x1033bf = _0x17598a > 0 ? 1800 + Math.random() * 1200 : 2200 + Math.random() * 1400;
      if (!(await _0x155f4c(_0x1033bf, _0x5a4133))) {
        return {
          cancelled: true
        };
      }
    }
    return {
      exhausted: true
    };
  }
  async function _0x28206a(_0x5b0924 = {}) {
    const _0x2b8602 = _0x5b0924.requestId;
    const _0x476abd = _0x5b0924.taskId;
    const _0x332200 = String(_0x5b0924.liveUrl || _0x5b0924.searchKeyword || window.location.href).trim();
    const _0x1b459b = _0x5b0924.generation != null ? Number(_0x5b0924.generation) : null;
    const _0x2f51cf = ++_0x261e0c;
    const _0x1f1b63 = Number(_0x5b0924.maxCollect) > 0 ? Math.floor(Number(_0x5b0924.maxCollect)) : 0;
    const _0x485788 = Number(_0x5b0924.liveDurationSeconds);
    const _0x574b99 = Number.isFinite(_0x485788) && _0x485788 >= 0 ? Math.min(10080, Math.max(0, Math.round(_0x485788 / 60))) * 60 : 180;
    const _0x500976 = _0x11f483(_0x5b0924.liveEventTypes);
    const _0x373d8f = new Set(_0x500976);
    const _0x4d058f = _0x2c4be1();
    const _0x2c4783 = new Set(Array.isArray(_0x5b0924.seenKeys) ? _0x5b0924.seenKeys.map(_0x54e53f => String(_0x54e53f || "").trim()).filter(Boolean) : []);
    const _0x4637dc = [];
    const _0x73313d = new Map();
    _0x34975f();
    _0xfbe77f = {
      taskId: _0x476abd || "",
      accountId: _0x5b0924.accountId || "",
      accountName: _0x5b0924.accountName || _0x5b0924.nickname || "",
      generation: _0x1b459b
    };
    const _0x5d4c0f = _0x5f0b27 => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x2b8602,
          taskId: _0x476abd,
          generation: _0x1b459b,
          ..._0x5f0b27
        });
      } catch (_0x35175c) {}
    };
    const _0x126e67 = (_0xfb072b, _0x336b17 = 0, _0x5183f2 = new WeakSet()) => {
      if (!_0xfb072b || typeof _0xfb072b !== "object" || _0x336b17 > 8 || _0x5183f2.has(_0xfb072b)) {
        return null;
      }
      _0x5183f2.add(_0xfb072b);
      const _0x295163 = _0xfb072b.sec_uid || _0xfb072b.secUid || _0xfb072b.sec_id;
      const _0x50d270 = _0xfb072b.nickname || _0xfb072b.nickName || _0xfb072b.nick_name;
      if (typeof _0x295163 === "string" && _0x295163.length > 15 && !_0x295163.startsWith("live_")) {
        return {
          secUid: _0x295163.trim(),
          nickname: _0x50d270 ? String(_0x50d270).trim().replace(/^@+/, "") : ""
        };
      }
      if (Array.isArray(_0xfb072b)) {
        for (const _0x3980ac of _0xfb072b) {
          const _0x243f89 = _0x126e67(_0x3980ac, _0x336b17 + 1, _0x5183f2);
          if (_0x243f89) {
            return _0x243f89;
          }
        }
        return null;
      }
      const _0x354fbe = ["user", "userInfo", "user_info", "author", "authorInfo", "msg", "message", "data", "props", "memoizedProps"];
      for (const _0x40709c of _0x354fbe) {
        if (_0xfb072b[_0x40709c]) {
          const _0x7e2f72 = _0x126e67(_0xfb072b[_0x40709c], _0x336b17 + 1, _0x5183f2);
          if (_0x7e2f72) {
            return _0x7e2f72;
          }
        }
      }
      return null;
    };
    const _0x3e67d3 = _0x7fcfb7 => {
      if (!_0x7fcfb7 || _0x7fcfb7.nodeType !== 1) {
        return null;
      }
      const _0x2f9246 = (_0x7fcfb7.textContent || "").trim();
      if (!_0x2f9246 || _0x2f9246.length > 250) {
        return null;
      }
      let _0x138a61 = "";
      let _0x146fc9 = "";
      let _0x3e3342 = "";
      const _0x1b3b93 = _0x7fcfb7.querySelector?.("a[href*=\"/user/\"], a[href*=\"sec_uid\"]") || (_0x7fcfb7.tagName === "A" && (_0x7fcfb7.href.includes("/user/") || _0x7fcfb7.href.includes("sec_uid")) ? _0x7fcfb7 : null);
      if (_0x1b3b93) {
        const _0x212805 = _0x1b3b93.href || _0x1b3b93.getAttribute?.("href") || "";
        const _0x300bcb = _0x212805.match(/\/user\/([^\?\/#]+)/) || _0x212805.match(/sec_uid=([^\&#]+)/);
        if (_0x300bcb && _0x300bcb[1] && _0x300bcb[1].length > 15 && !_0x300bcb[1].startsWith("live_")) {
          _0x138a61 = decodeURIComponent(_0x300bcb[1]).trim();
        }
        _0x146fc9 = (_0x1b3b93.textContent || "").trim().replace(/^@+/, "");
      }
      if (!_0x138a61 || !_0x146fc9) {
        let _0x3162da = _0x7fcfb7;
        let _0x4f6f76 = 0;
        while (_0x3162da && _0x4f6f76 < 8) {
          const _0x2795d0 = Object.keys(_0x3162da).filter(_0xd6ec1e => _0xd6ec1e.startsWith("__reactProps$") || _0xd6ec1e.startsWith("__reactFiber$"));
          for (const _0x53e9cd of _0x2795d0) {
            const _0x22148e = _0x3162da[_0x53e9cd];
            if (!_0x22148e) {
              continue;
            }
            const _0x34ef45 = _0x126e67(_0x22148e, 0, new WeakSet());
            if (_0x34ef45) {
              if (!_0x138a61 && _0x34ef45.secUid && _0x34ef45.secUid.length > 15 && !_0x34ef45.secUid.startsWith("live_")) {
                _0x138a61 = _0x34ef45.secUid;
              }
              if (!_0x146fc9 && _0x34ef45.nickname) {
                _0x146fc9 = _0x34ef45.nickname;
              }
            }
          }
          if (_0x138a61 && _0x146fc9) {
            break;
          }
          _0x3162da = _0x3162da.parentElement;
          _0x4f6f76++;
        }
      }
      if (!_0x146fc9) {
        const _0x416118 = _0x7fcfb7.querySelector?.("[class*=\"nickname\"], [class*=\"user-name\"], [class*=\"author\"], [class*=\"name\"]");
        if (_0x416118) {
          _0x146fc9 = (_0x416118.textContent || "").trim().replace(/^@+/, "");
        }
      }
      let _0x28a9e8 = "";
      let _0x4e120a = "interaction";
      let _0x2e2e39 = "RoomMessage";
      if (_0x2f9246.includes("进入直播间") || _0x2f9246.includes("来了")) {
        _0x28a9e8 = "进入直播间";
        _0x4e120a = "enter";
        _0x2e2e39 = "MemberMessage";
        if (!_0x146fc9) {
          const _0x1e6a47 = _0x2f9246.match(/^(.+?)(?:进入直播间|来了)/);
          if (_0x1e6a47) {
            _0x146fc9 = _0x1e6a47[1].trim();
          }
        }
      } else if (_0x2f9246.includes("赞了") || _0x2f9246.includes("点赞")) {
        _0x28a9e8 = "点赞了直播间";
        _0x4e120a = "like";
        _0x2e2e39 = "LikeMessage";
        if (!_0x146fc9) {
          const _0x50fd06 = _0x2f9246.match(/^(.+?)(?:赞了|点赞)/);
          if (_0x50fd06) {
            _0x146fc9 = _0x50fd06[1].trim();
          }
        }
      } else if (_0x2f9246.includes("关注了主播") || _0x2f9246.includes("关注了")) {
        _0x28a9e8 = "关注了主播";
        _0x4e120a = "follow";
        _0x2e2e39 = "SocialMessage";
        if (!_0x146fc9) {
          const _0x3b5e7a = _0x2f9246.match(/^(.+?)(?:关注了主播|关注了)/);
          if (_0x3b5e7a) {
            _0x146fc9 = _0x3b5e7a[1].trim();
          }
        }
      } else if (_0x2f9246.includes("送给") || _0x2f9246.includes("送了") || _0x2f9246.includes("赠送")) {
        let _0xaa8c23 = _0x2f9246;
        if (_0x146fc9 && _0xaa8c23.startsWith(_0x146fc9)) {
          _0xaa8c23 = _0xaa8c23.slice(_0x146fc9.length).trim();
        }
        _0x28a9e8 = _0xaa8c23 ? "赠送礼物: " + _0xaa8c23 : "赠送礼物";
        _0x4e120a = "gift";
        _0x2e2e39 = "GiftMessage";
        if (!_0x146fc9) {
          const _0x55087e = _0x2f9246.match(/^(.+?)(?:送给|送了|赠送)/);
          if (_0x55087e) {
            _0x146fc9 = _0x55087e[1].trim();
          }
        }
      } else if (_0x7fcfb7.closest?.("[class*=\"rank\"], [class*=\"online\"], [class*=\"audience\"]")) {
        _0x28a9e8 = "直播间在线观众";
      } else if (_0x2f9246.includes("分享了直播间") || _0x2f9246.includes("加入了粉丝团")) {
        _0x28a9e8 = _0x2f9246;
      } else {
        let _0x1dc867 = _0x2f9246;
        if (_0x146fc9 && _0x1dc867.startsWith(_0x146fc9)) {
          _0x1dc867 = _0x1dc867.slice(_0x146fc9.length).replace(/^[\s：:]+/, "");
        }
        _0x28a9e8 = _0x1dc867 ? "发表弹幕: " + _0x1dc867 : "直播间发言";
        _0x4e120a = "comment";
        _0x2e2e39 = "ChatMessage";
      }
      if (!_0x146fc9) {
        return null;
      }
      if (!_0x373d8f.has(_0x4e120a)) {
        return null;
      }
      const _0xa10904 = _0x138a61 && _0x138a61.length > 15 && /^[A-Za-z0-9_\-]+$/.test(_0x138a61) && !_0x138a61.startsWith("live_");
      const _0x5c59d7 = _0xa10904 ? _0x138a61 : "";
      const _0x2769ce = _0xa10904 ? "https://www.douyin.com/user/" + _0x5c59d7 : "";
      const _0x1c644e = String(_0x7fcfb7.closest?.("[data-id]")?.getAttribute?.("data-id") || "").trim();
      const _0x2408fe = Date.now();
      const _0x27c7c7 = {
        messageId: _0x1c644e,
        method: _0x2e2e39,
        type: _0x2e2e39,
        category: _0x4e120a,
        content: _0x28a9e8,
        text: _0x4e120a === "comment" ? _0x28a9e8.replace(/^发表弹幕:\s*/, "") : "",
        occurredAt: _0x2408fe,
        observedAt: _0x2408fe
      };
      return {
        secUid: _0x5c59d7,
        userKey: _0x5c59d7 || "name:" + _0x146fc9,
        nickname: _0x146fc9,
        userUrl: _0x2769ce,
        content: _0x28a9e8,
        messageId: _0x1c644e,
        liveEvent: _0x27c7c7,
        liveEvents: [_0x27c7c7],
        eventTimestamp: _0x2408fe,
        sourceType: "live",
        entrySource: "entity_live",
        entryLabel: "线索采集：直播间",
        liveUrl: _0x332200,
        searchKeyword: "直播间: " + _0x332200
      };
    };
    try {
      window._radar_account_id = _0x5b0924.accountId;
      window._radar_account_name = _0x5b0924.accountName || _0x5b0924.nickname || "";
      _0x5b2e6a();
      _0x1183b2();
      _0xf133cb();
      _0x4125a9({
        sourceType: "live",
        entrySource: "entity_live",
        entryLabel: "线索采集：直播间",
        message: "直播间采集启动：正在监测直播间聊天室…",
        level: "info"
      });
      await _0x5e9448(_0x2f51cf);
      const _0x1d6422 = new Set();
      const _0x514adc = new Set();
      const _0x2ee765 = Date.now();
      const _0x4b5132 = _0x574b99 > 0 ? _0x574b99 * 1000 : Number.POSITIVE_INFINITY;
      let _0x2b9b5f = false;
      while (Date.now() - _0x2ee765 < _0x4b5132 && _0x2f51cf === _0x261e0c) {
        const _0x44d5e7 = document.querySelector("[class*=\"chatroom___items\"], [class*=\"webcast-chatroom\"], [data-e2e=\"live-room-chat\"]");
        const _0x2cc59f = _0x44d5e7 ? _0x44d5e7.querySelectorAll("div, li, p, span") : [];
        const _0x3e977d = _0x2a0c74("live", {
          liveEventTypes: _0x500976
        });
        if (_0x3e977d.length > 0) {
          _0x2b9b5f = true;
        }
        const _0x529a4d = Date.now() - _0x2ee765;
        const _0x2d02ab = [document.title || "", ...Array.from(document.querySelectorAll("[data-e2e*=\"end\"], [class*=\"live-end\"], [class*=\"liveEnd\"], [class*=\"empty\"], [class*=\"offline\"], [class*=\"privacy\"], [class*=\"Password\"], [class*=\"password\"]")).slice(0, 24).map(_0x3d6457 => _0x3d6457.textContent || ""), String(document.body?.innerText || "").slice(0, _0x44d5e7 ? 4000 : 15000)].join(" ");
        const _0x15006d = _0x4637dc.filter(_0x51ce6b => !!_0x51ce6b?.privacyMasked).length;
        const _0x3d9fd8 = _0x4637dc.length > 0 && _0x15006d === _0x4637dc.length;
        const _0x345896 = _0x4d058f({
          text: _0x2d02ab,
          hasChatContainer: !!_0x44d5e7,
          elapsedMs: _0x529a4d,
          capturedAnyEvent: _0x2b9b5f,
          privacyAudienceOnly: _0x3d9fd8,
          privacyAudienceCount: _0x15006d
        });
        if (_0x345896.ended) {
          const _0x3df8f9 = _0x345896.reason === "live_private" ? "⏭ " : "";
          const _0x2de791 = "" + _0x3df8f9 + _0x345896.message + "，已退出当前直播间监控";
          _0x4125a9({
            taskId: _0x476abd,
            accountId: _0x5b0924.accountId || "",
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            message: _0x2de791,
            level: "warning"
          });
          _0x5d4c0f({
            success: true,
            ended: true,
            endReason: _0x345896.reason,
            message: _0x2de791,
            users: _0x345896.reason === "live_private" ? [] : _0x4637dc
          });
          _0x34975f();
          return;
        }
        const _0x423cb8 = [];
        if (!_0x3e977d.length && Date.now() - _0x2ee765 >= 10000) {
          _0x2cc59f.forEach(_0x397df5 => {
            const _0x5ef574 = _0x3e67d3(_0x397df5);
            if (_0x5ef574 && _0x5ef574.nickname) {
              const _0x383f40 = _0x5ef574.messageId || _0x5ef574.userKey + "_" + _0x5ef574.content;
              if (!_0x1d6422.has(_0x383f40)) {
                _0x1d6422.add(_0x383f40);
                if (!_0x2c4783.has(_0x5ef574.userKey)) {
                  if (_0x1f1b63 > 0 && _0x4637dc.length >= _0x1f1b63) {
                    return;
                  }
                  _0x2c4783.add(_0x5ef574.userKey);
                  _0x73313d.set(_0x5ef574.userKey, _0x4637dc.length);
                  _0x4637dc.push(_0x5ef574);
                }
                _0x423cb8.push(_0x5ef574);
              }
            }
          });
        }
        _0x3e977d.forEach(_0x55cdc6 => {
          const _0xab795e = _0x55cdc6.userKey || _0x55cdc6.secUid || (_0x55cdc6.uid ? "uid:" + _0x55cdc6.uid : "");
          if (!_0xab795e) {
            return;
          }
          const _0x50e5a7 = Array.isArray(_0x55cdc6.liveEvents) ? _0x55cdc6.liveEvents : [];
          const _0x13a2e4 = _0x50e5a7.filter(_0x2d5041 => {
            const _0x560833 = String(_0x2d5041.messageId || "").trim() || [_0xab795e, _0x2d5041.method || _0x2d5041.type || "", _0x2d5041.occurredAt || _0x2d5041.observedAt || "", _0x2d5041.content || _0x2d5041.text || ""].join("|");
            if (_0x514adc.has(_0x560833)) {
              return false;
            }
            _0x514adc.add(_0x560833);
            return true;
          });
          const _0x32207b = _0x2c4783.has(_0xab795e);
          const _0x3b4559 = {
            ..._0x55cdc6,
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            content: _0x55cdc6.content || _0x13a2e4[_0x13a2e4.length - 1]?.content || "直播间互动用户",
            liveUrl: _0x332200,
            searchKeyword: "直播间: " + _0x332200
          };
          const _0x3d8429 = _0x73313d.get(_0xab795e);
          let _0x3e109e = _0x32207b || _0x3d8429 != null;
          if (_0x3d8429 != null) {
            const _0xae88c3 = _0x4637dc[_0x3d8429];
            const _0x3b2e5d = _0x45cf44(_0xae88c3?.liveEvents || [], _0x50e5a7);
            _0x4637dc[_0x3d8429] = {
              ..._0xae88c3,
              ..._0x3b4559,
              liveEvents: _0x3b2e5d,
              liveEvent: _0x3b2e5d[_0x3b2e5d.length - 1] || _0x3b4559.liveEvent
            };
          } else if (!_0x32207b) {
            if (_0x1f1b63 > 0 && _0x4637dc.length >= _0x1f1b63) {
              return;
            }
            _0x2c4783.add(_0xab795e);
            _0x73313d.set(_0xab795e, _0x4637dc.length);
            _0x4637dc.push(_0x3b4559);
            _0x3e109e = true;
          }
          if (_0x3e109e && (!_0x32207b || _0x13a2e4.length)) {
            const _0x255780 = _0x13a2e4[_0x13a2e4.length - 1] || _0x3b4559.liveEvent;
            _0x423cb8.push({
              ..._0x3b4559,
              content: _0x255780?.content || _0x3b4559.content,
              liveEvent: _0x255780 || null,
              liveEvents: _0x13a2e4,
              messageId: _0x255780?.messageId || _0x3b4559.messageId || "",
              eventTimestamp: _0x255780?.occurredAt || _0x3b4559.eventTimestamp || Date.now()
            });
          }
        });
        if (_0x423cb8.length > 0) {
          _0x2b9b5f = true;
          _0x4125a9({
            taskId: _0x476abd,
            accountId: _0x5b0924.accountId || "",
            sourceType: "live",
            entrySource: "entity_live",
            entryLabel: "线索采集：直播间",
            message: "直播间实时捕获 " + _0x423cb8.length + " 条用户互动（累计 " + _0x4637dc.length + " 个用户）",
            level: "info",
            users: _0x423cb8
          });
        }
        if (_0x1f1b63 > 0 && _0x4637dc.length >= _0x1f1b63) {
          _0x4125a9({
            taskId: _0x476abd,
            message: "直播间采集达到设置的最大数量 (" + _0x1f1b63 + ")",
            level: "info"
          });
          break;
        }
        if (!(await _0x155f4c(2000, _0x2f51cf))) {
          break;
        }
      }
      _0x5d4c0f({
        success: true,
        users: _0x4637dc,
        message: "直播间采集完成，共获取 " + _0x4637dc.length + " 个观众/弹幕线索"
      });
      _0x34975f();
    } catch (_0x219120) {
      _0x5d4c0f({
        success: false,
        error: _0x219120?.message || String(_0x219120),
        users: _0x4637dc
      });
      _0x34975f();
    } finally {
      if (_0x2f51cf === _0x261e0c) {
        _0x213059();
      }
    }
  }
  async function _0x530c01(_0x253fdc = {}) {
    const _0x47bb4f = _0x253fdc.requestId;
    const _0x39f70c = _0x253fdc.taskId || "";
    const _0x40b59d = String(_0x253fdc.searchKeyword || "").trim();
    const _0x5c2c25 = _0x5c2d51 => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x47bb4f,
          taskId: _0x39f70c,
          ..._0x5c2d51
        });
      } catch (_0xf64d03) {}
    };
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
      const _0x5597ef = ++_0x261e0c;
      _0xfbe77f = {
        taskId: _0x39f70c,
        accountId: _0x253fdc.accountId || _0xfbe77f?.accountId || "",
        accountName: _0x253fdc.accountName || _0xfbe77f?.accountName || "",
        generation: _0x253fdc.generation != null ? Number(_0x253fdc.generation) : _0xfbe77f?.generation,
        skipIngest: _0x253fdc.skipIngest != null ? !!_0x253fdc.skipIngest : false
      };
      try {
        const _0x177224 = String(_0x253fdc.accountId || _0xfbe77f.accountId || "").trim();
        if (_0x177224) {
          window._radar_account_id = _0x177224;
          sessionStorage.setItem("radar_account_id", _0x177224);
        }
      } catch (_0xbcf672) {}
      window._searchVideoQueueKeyword = _0x40b59d || window._searchVideoQueueKeyword || "";
      const _0x5f130c = "ENTITY_LEADGEN";
      const _0x39eba0 = String(window.location.href || "");
      if (!/\/search\//i.test(_0x39eba0)) {
        _0x5c2c25({
          success: false,
          ready: false,
          reason: "not_on_search"
        });
        return;
      }
      const _0x2e1e87 = await _0x43d800(_0x5597ef, _0x39f70c, _0x253fdc);
      if (_0x2e1e87?.cancelled || _0x5597ef !== _0x261e0c) {
        _0x5c2c25({
          success: false,
          cancelled: true
        });
        return;
      }
      try {
        _0xd24701({
          force: true
        });
        _0x283e6c();
      } catch (_0x50175c) {}
      _0x4125a9({
        taskId: _0x39f70c,
        message: "正在等待搜索结果出现…",
        level: "info"
      });
      if (typeof _0x306158 === "function") {
        await _0x306158(_0x5597ef, _0x39f70c, {
          sourceType: "video",
          maxWaitMs: 18000
        });
      } else {
        await _0x155f4c(2200, _0x5597ef);
      }
      if (_0x5597ef !== _0x261e0c) {
        _0x5c2c25({
          success: false,
          cancelled: true
        });
        return;
      }
      try {
        window.scrollTo(0, 0);
      } catch (_0x464c25) {}
      await _0x155f4c(500, _0x5597ef);
      let _0x2dd601 = "";
      let _0x5a3629 = null;
      let _0xbf9532 = null;
      try {
        const {
          cardMap: _0x36c805
        } = typeof _0x39fef9 === "function" ? _0x39fef9() : {
          cardMap: new Map()
        };
        for (const [_0x307f55, _0x26741b] of _0x36c805.entries()) {
          if (!_0x307f55) {
            continue;
          }
          _0x2dd601 = _0x3866ca?.(_0x307f55) || String(_0x307f55).trim();
          _0x5a3629 = _0x26741b?.clickTarget || _0x26741b?.card || null;
          _0xbf9532 = _0x26741b?.card || (typeof _0x1eba17 === "function" ? _0x1eba17(_0x5a3629) : null);
          break;
        }
      } catch (_0x144456) {}
      if (!_0x2dd601) {
        try {
          const _0x45a16e = typeof _0x49d3d0 === "function" ? _0x49d3d0() : [];
          for (const _0x441ca0 of _0x45a16e || []) {
            const _0x2c0c65 = _0x3866ca?.(_0x441ca0?.videoUrl || _0x441ca0?.videoId) || String(_0x441ca0?.videoUrl || "").trim();
            if (_0x2c0c65) {
              _0x2dd601 = _0x2c0c65;
              break;
            }
          }
        } catch (_0x33ae85) {}
      }
      if (!_0x2dd601) {
        _0x5c2c25({
          success: false,
          ready: false,
          reason: "no_search_results"
        });
        return;
      }
      _0x4125a9({
        taskId: _0x39f70c,
        message: "正在打开搜索结果第一条视频…",
        level: "info"
      });
      _0x3ea3e8?.(_0x2dd601);
      _0x51db40.lastClickedId = _0x2dd601;
      let _0x3f1b56 = false;
      if (_0x5a3629 && typeof _0x4f4edb === "function") {
        try {
          await _0x4f4edb(_0x5a3629, _0x5f130c);
        } catch (_0x329a9f) {}
        _0x3f1b56 = typeof _0x36104d === "function" ? await _0x36104d(_0x5f130c, _0x2dd601, 5000) : false;
        if (!_0x3f1b56 && _0x5a3629 !== _0xbf9532 && _0xbf9532) {
          try {
            const _0x67c62c = (typeof _0x7e83ff === "function" ? _0x7e83ff(_0xbf9532) : null) || _0xbf9532;
            await _0x4f4edb(_0x67c62c, _0x5f130c);
          } catch (_0x1adc03) {}
          _0x3f1b56 = typeof _0x36104d === "function" ? await _0x36104d(_0x5f130c, _0x2dd601, 4000) : false;
        }
      }
      if (!_0x3f1b56) {
        const _0x45c453 = typeof _0x16a8bf === "function" ? await _0x16a8bf(_0x5f130c, _0x2dd601, {
          allowHardNavigation: true,
          softWaitMs: 4500,
          hardWaitMs: 7000
        }) : "failed";
        if (_0x45c453 === "navigating") {
          _0x5c2c25({
            success: false,
            navigating: true,
            videoUrl: _0x2dd601
          });
          return;
        }
        _0x3f1b56 = _0x45c453 === "ready";
      }
      if (!_0x3f1b56 && typeof _0x36104d === "function") {
        _0x3f1b56 = await _0x36104d(_0x5f130c, _0x2dd601, 6500);
      }
      const _0x5cea38 = _0x3f1b56 && (_0x5c0002?.(_0x2dd601) || !!_0x288445?.({
        includeFeed: false
      }));
      if (_0x5cea38) {
        _0x215a68?.("线索采集：搜索首条打开后锁定暂停");
        const _0x297d44 = _0x344dfe?.("", _0x288445?.({
          includeFeed: false
        }) || document) || _0x2dd601;
        _0x5c2c25({
          success: true,
          ready: true,
          videoUrl: _0x297d44
        });
        return;
      }
      _0x5c2c25({
        success: false,
        ready: false,
        reason: "detail_not_ready",
        videoUrl: _0x2dd601
      });
    } catch (_0xe7e30b) {
      if (String(_0xe7e30b?.message || _0xe7e30b) === "TASK_ABORTED") {
        _0x5c2c25({
          success: false,
          cancelled: true
        });
        return;
      }
      _0x5c2c25({
        success: false,
        error: _0xe7e30b?.message || String(_0xe7e30b)
      });
    }
  }
  async function _0x2aa24d(_0x479f18 = {}) {
    const _0x32a035 = _0x479f18.requestId;
    const _0x27e43d = _0x479f18.taskId || "";
    const _0x4e6593 = String(_0x479f18.videoUrl || "").trim();
    const _0x46b65d = String(_0x479f18.searchKeyword || "").trim();
    const _0x290c83 = !!_0x479f18.softOnly;
    const _0x51a9c7 = _0x3779cc => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x32a035,
          taskId: _0x27e43d,
          ..._0x3779cc
        });
      } catch (_0x459a6d) {}
    };
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
      _0xfbe77f = {
        taskId: _0x27e43d,
        accountId: _0x479f18.accountId || _0xfbe77f?.accountId || "",
        accountName: _0x479f18.accountName || _0xfbe77f?.accountName || "",
        generation: _0x479f18.generation != null ? Number(_0x479f18.generation) : _0xfbe77f?.generation,
        skipIngest: _0x479f18.skipIngest != null ? !!_0x479f18.skipIngest : false
      };
      try {
        const _0xaafa90 = String(_0x479f18.accountId || _0xfbe77f.accountId || "").trim();
        if (_0xaafa90) {
          window._radar_account_id = _0xaafa90;
          sessionStorage.setItem("radar_account_id", _0xaafa90);
        }
      } catch (_0x2ba8ee) {}
      window._searchVideoQueueKeyword = _0x46b65d || window._searchVideoQueueKeyword || "";
      const _0x170ae2 = "ENTITY_LEADGEN";
      const _0xd2e00d = String(window.location.href || "");
      const _0x1f9a6f = /\/search\//i.test(_0xd2e00d);
      if (!_0x1f9a6f) {
        if (_0x290c83) {
          _0x51a9c7({
            success: false,
            ready: false,
            reason: "not_on_search"
          });
          return;
        }
        const _0xbc3bda = (() => {
          try {
            const {
              buildEntitySearchModalUrl: _0x35da18
            } = require("./entityLeadgenUrls");
            return _0x35da18(_0x4e6593, _0x46b65d);
          } catch (_0x4e3a35) {
            return "";
          }
        })() || "https://www.douyin.com/jingxuan?modal_id=" + (_0x59d57b(_0x4e6593) || "");
        _0x4125a9({
          taskId: _0x27e43d,
          message: "不在搜索页，正在打开搜索详情弹层…",
          level: "info"
        });
        if (typeof _0x6da8a4 === "function") {
          _0x6da8a4();
        }
        window.location.href = _0xbc3bda;
        _0x51a9c7({
          success: false,
          navigating: true,
          videoUrl: _0x4e6593
        });
        return;
      }
      _0x4125a9({
        taskId: _0x27e43d,
        message: "正在搜索页打开视频详情（对齐仅采集）…",
        level: "info"
      });
      if (typeof _0x16a8bf === "function") {
        const _0x5ba001 = await _0x16a8bf(_0x170ae2, _0x4e6593, {
          allowHardNavigation: !_0x290c83,
          softWaitMs: 4500,
          hardWaitMs: 7000
        });
        if (_0x5ba001 === "navigating") {
          _0x51a9c7({
            success: false,
            navigating: true,
            videoUrl: _0x4e6593
          });
          return;
        }
        if (_0x5ba001 === "ready") {
          const _0x4963de = !!_0x288445({
            includeFeed: false
          }) && (typeof _0x32875d === "function" ? _0x32875d() : true);
          if (_0x4963de || _0x5c0002(_0x4e6593)) {
            _0x215a68("线索采集：搜索弹层打开后锁定暂停");
            _0x51a9c7({
              success: true,
              ready: true,
              videoUrl: _0x344dfe?.("", _0x288445({
                includeFeed: false
              }) || document) || _0x4e6593
            });
            return;
          }
        }
      }
      if (typeof _0x36104d === "function") {
        const _0x2ae232 = await _0x36104d(_0x170ae2, _0x4e6593, 6500);
        if (_0x2ae232 && _0x5c0002(_0x4e6593)) {
          _0x215a68("线索采集：搜索弹层打开后锁定暂停");
          _0x51a9c7({
            success: true,
            ready: true,
            videoUrl: _0x4e6593
          });
          return;
        }
      }
      _0x51a9c7({
        success: false,
        ready: false,
        reason: "detail_not_ready"
      });
    } catch (_0x5bfe86) {
      if (String(_0x5bfe86?.message || _0x5bfe86) === "TASK_ABORTED") {
        _0x51a9c7({
          success: false,
          cancelled: true
        });
        return;
      }
      _0x51a9c7({
        success: false,
        error: _0x5bfe86?.message || String(_0x5bfe86)
      });
    }
  }
  async function _0x49efb4(_0x44a89e = {}) {
    const _0x36fb7f = _0x44a89e.requestId;
    const _0x3d3cfd = _0x44a89e.taskId || "";
    const _0x5bde43 = String(_0x44a89e.videoUrl || "").trim();
    const _0x296a90 = _0x2804ec => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x36fb7f,
          taskId: _0x3d3cfd,
          ..._0x2804ec
        });
      } catch (_0x36e697) {}
    };
    try {
      if (!_0x34cf39.taskRunning) {
        _0x34cf39.stopRequested = false;
      }
      const _0x1f1adc = ++_0x261e0c;
      const _0x34cf39 = await _0x179306(_0x1f1adc, _0x3d3cfd, _0x5bde43, 18000);
      if (_0x34cf39?.cancelled) {
        _0x296a90({
          success: false,
          cancelled: true
        });
        return;
      }
      if (_0x34cf39?.status === "unavailable") {
        _0x296a90({
          success: false,
          videoUnavailable: true,
          unavailableReason: _0x34cf39.reason || "unavailable"
        });
        return;
      }
      const _0x2cca3a = _0x34cf39?.status === "ready" || _0x5c0002(_0x5bde43);
      _0x296a90({
        success: !!_0x2cca3a,
        ready: !!_0x2cca3a,
        videoUrl: _0x344dfe?.("", _0x288445?.({
          includeFeed: false
        }) || document) || _0x5bde43
      });
    } catch (_0xd0f567) {
      _0x296a90({
        success: false,
        error: _0xd0f567?.message || String(_0xd0f567)
      });
    }
  }
  async function _0x566d74(_0x1a3b80 = {}) {
    const _0x941db6 = "ENTITY_LEADGEN_RECOMMEND";
    const _0x53c46a = _0x1a3b80.wantAuthor === true;
    const _0x1b86bb = _0x1a3b80.lightCapture === true;
    const _0x4a3562 = Math.max(_0x1b86bb ? 1200 : 8000, Math.min(30000, Number(_0x1a3b80.maxWaitMs) || (_0x1b86bb ? 2500 : 20000)));
    const _0x55e15e = Date.now();
    let _0x4bf492 = false;
    let _0x326b20 = false;
    let _0x46e323 = 0;
    const _0x457bd9 = _0x1b86bb ? 4 : 12;
    while (Date.now() - _0x55e15e < _0x4a3562) {
      if (_0x15c8a7(_0x941db6)) {
        return {
          cancelled: true
        };
      }
      let _0xea910f = typeof _0x4e1828 === "function" ? _0x4e1828() : null;
      _0x4bf492 = !!_0xea910f && _0xea910f !== document && !!_0x1b22e4?.(_0xea910f);
      const _0x590dc7 = typeof _0x518060 === "function" ? String(_0x518060(_0xea910f || document) || "") : "";
      const _0x206329 = _0xa185c3(_0xea910f || document) || _0x62cea0() || _0x1eb8ae(_0x590dc7);
      if (_0x206329) {
        return {
          success: true,
          ready: true,
          live: true,
          identity: _0x4d612a?.(_0xea910f || document) || "",
          title: _0x590dc7,
          waitedMs: Date.now() - _0x55e15e
        };
      }
      _0x326b20 = !!_0x3c502c?.();
      if (!_0x326b20) {
        _0x38705e(_0xea910f || document, "线索采集：推荐流等待就绪期间锁定暂停");
        _0x46e323 += 1;
        if (!_0x4bf492 || !(_0x46e323 >= Math.min(4, _0x457bd9))) {
          if (_0x46e323 >= _0x457bd9) {
            return {
              success: false,
              ready: false,
              reason: "feed_player_not_ready",
              waitedMs: Date.now() - _0x55e15e,
              scopeFound: _0x4bf492,
              playing: false,
              href: String(window.location.href || "")
            };
          }
          await _0x144308(_0x1b86bb ? 220 : 350);
          continue;
        }
      }
      _0xea910f = (typeof _0x4e1828 === "function" ? _0x4e1828() : null) || _0xea910f || document;
      _0x4bf492 = _0xea910f !== document;
      _0x38705e(_0xea910f, "线索采集：推荐流进入后立即暂停");
      try {
        _0x33457d?.(_0xea910f);
      } catch (_0x53ed5d) {}
      try {
        _0xd24701?.({
          force: true
        });
      } catch (_0x1f1dba) {}
      _0x215a68("线索采集：推荐流当前作品锁定暂停", {
        scope: _0xea910f,
        isFeedPlayback: true,
        intervalMs: 250,
        loopId: _0x941db6,
        reuseActive: true
      });
      const _0x32358b = _0x51db40.lockedFeedIdentity || _0x4d612a?.(_0xea910f) || "";
      const _0x44a9f1 = typeof _0x208cf8 === "function" ? _0x208cf8(_0x51db40.lockedLeadVideoUrl || _0x32358b, _0xea910f) : _0x51db40.lockedLeadVideoUrl || "";
      let _0x175933 = _0x44a9f1 || _0x3d8b0e?.(_0xea910f) || _0x344dfe?.("", _0xea910f) || "";
      let _0x555832 = _0x59d57b(_0x175933) || _0x57b5f3(_0x175933) || _0x59d57b(_0x32358b) || "";
      if (!_0x175933 && _0x555832) {
        _0x175933 = "https://www.douyin.com/video/" + _0x555832;
      }
      if (!_0x555832 && !_0x175933) {
        await _0x144308(_0x1b86bb ? 220 : 350);
        continue;
      }
      const _0x4d49f1 = _0x53c46a && typeof _0x51cfcb === "function" ? await _0x51cfcb(_0xea910f, _0x175933, _0x941db6, {
        requireAuthor: true,
        requireAuthorUrl: true,
        maxWaitMs: _0x1b86bb ? 1800 : 4500
      }) : typeof _0x5ca4b5 === "function" ? _0x5ca4b5(_0xea910f, _0x175933) : {
        title: _0x590dc7,
        authorNickname: "",
        authorUrl: "",
        stats: {}
      };
      if (_0x53c46a && !_0x2dea5c(_0x4d49f1?.authorUrl || "") && _0x175933) {
        try {
          const _0x5581db = await _0x4fa024(_0x175933, _0x1b86bb ? 800 : 1600);
          if (_0x5581db?.authorUrl) {
            _0x4d49f1.authorUrl = _0x5581db.authorUrl;
            if (_0x5581db.authorNickname) {
              _0x4d49f1.authorNickname = _0x5581db.authorNickname;
            }
            if (_0x5581db.title && (!_0x4d49f1.title || _0x4d49f1.title === "未知视频")) {
              _0x4d49f1.title = _0x5581db.title;
            }
            _0x4d49f1.fromApi = true;
          }
        } catch (_0x261f82) {}
      }
      const _0x39824a = _0x555832 || _0x59d57b(_0x175933) || "";
      const _0x4cc05e = String(_0x4d49f1?.title || _0x590dc7 || "").trim();
      const _0xd9eaa9 = String(_0x4d49f1?.authorNickname || "").trim().replace(/^@+/, "");
      if (_0x39824a || _0x4cc05e && _0x4cc05e !== "未知视频" && (_0x326b20 || _0x4bf492) && _0x175933) {
        const _0x5df6c4 = _0x4d49f1?.stats || {};
        const _0x1fd862 = _0x39824a || _0x59d57b(_0x4d612a?.(_0xea910f) || "") || "";
        const _0x5e1107 = _0x175933 || (_0x1fd862 ? "https://www.douyin.com/video/" + _0x1fd862 : "");
        if (!_0x1fd862 && !_0x5e1107) {
          await _0x144308(_0x1b86bb ? 220 : 350);
          continue;
        }
        return {
          success: true,
          ready: true,
          live: false,
          identity: _0x4d612a?.(_0xea910f) || _0x32358b || "video:" + _0x1fd862,
          videoId: _0x1fd862,
          videoUrl: _0x5e1107,
          title: _0x4cc05e,
          authorNickname: _0xd9eaa9,
          authorUrl: String(_0x4d49f1?.authorUrl || "").trim(),
          likeCount: Number(_0x5df6c4.likes) || 0,
          commentCount: Number(_0x5df6c4.comments) || 0,
          collectCount: Number(_0x5df6c4.collects) || 0,
          shareCount: Number(_0x5df6c4.shares) || 0,
          fromApi: !!_0x4d49f1?.fromApi,
          waitedMs: Date.now() - _0x55e15e
        };
      }
      await _0x144308(_0x1b86bb ? 220 : 350);
    }
    return {
      success: false,
      ready: false,
      reason: "feed_video_not_ready",
      waitedMs: Date.now() - _0x55e15e,
      scopeFound: _0x4bf492,
      playing: _0x326b20,
      href: String(window.location.href || "")
    };
  }
  async function _0x3dfe64(_0x3115ea = {}) {
    const {
      requestId: _0x257e43,
      taskId = ""
    } = _0x3115ea;
    const _0x2cde28 = _0x27ff2d => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x257e43,
          taskId: taskId,
          ..._0x27ff2d
        });
      } catch (_0x3de0ef) {}
    };
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
      _0x15c6c2(_0x3115ea);
      const _0x14afda = _0x3115ea.quietReady === true;
      let _0x1adafa = false;
      const _0xd494f3 = _0x14afda ? null : setTimeout(() => {
        _0x1adafa = true;
        _0x4125a9({
          message: "推荐页：正在等待当前作品画面就绪…",
          level: "info"
        });
      }, 1500);
      const _0x426944 = await _0x566d74(_0x3115ea);
      try {
        if (_0xd494f3) {
          clearTimeout(_0xd494f3);
        }
      } catch (_0x14a345) {}
      if (_0x426944?.ready && !_0x426944?.live) {
        const _0x591f3d = String(_0x426944.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
        const _0x5d3ee9 = String(_0x426944.authorNickname || "").trim();
        _0x4125a9({
          message: "推荐页：已识别当前作品" + (_0x5d3ee9 ? " 作者「" + _0x5d3ee9 + "」" : "") + (_0x591f3d ? "《" + _0x591f3d + "》" : "") + (_0x426944.videoId ? " id=" + _0x426944.videoId : "") + (_0x426944.fromApi ? "（API）" : ""),
          level: "success"
        });
      } else if (_0x1adafa && !_0x426944?.ready) {
        _0x4125a9({
          message: "推荐页：当前作品画面仍未就绪",
          level: "warning"
        });
      }
      _0x2cde28(_0x426944);
    } catch (_0x384d04) {
      if (String(_0x384d04?.message || _0x384d04) === "TASK_ABORTED") {
        _0x2cde28({
          success: false,
          cancelled: true
        });
        return;
      }
      _0x2cde28({
        success: false,
        error: _0x384d04?.message || String(_0x384d04)
      });
    }
  }
  function _0x28b8b4(_0x3faec4 = {}, _0x1e7f23 = {}) {
    if (!_0x1e7f23 || !_0x1e7f23.ready) {
      return false;
    }
    if (_0x1e7f23.live) {
      return true;
    }
    const _0x2783f2 = String(_0x3faec4.videoId || "").trim();
    const _0x2ecaee = String(_0x1e7f23.videoId || "").trim();
    if (_0x2783f2 && _0x2ecaee && _0x2783f2 !== _0x2ecaee) {
      return true;
    }
    const _0x44d8a4 = String(_0x3faec4.identity || "").trim();
    const _0x2b217c = String(_0x1e7f23.identity || "").trim();
    if (_0x44d8a4 && _0x2b217c && _0x44d8a4 !== _0x2b217c) {
      return true;
    }
    const _0x299893 = String(_0x3faec4.title || "").trim();
    const _0x425db6 = String(_0x1e7f23.title || "").trim();
    if (_0x299893 && _0x425db6 && _0x425db6 !== "未知视频" && _0x299893 !== _0x425db6) {
      return true;
    }
    return false;
  }
  async function _0xd88739(_0x323839 = {}) {
    const {
      requestId: _0x1b2fd9,
      taskId = "",
      skipLive = false
    } = _0x323839;
    const _0xe66ac6 = _0x1875d1 => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x1b2fd9,
          taskId: taskId,
          ..._0x1875d1
        });
      } catch (_0x558b84) {}
    };
    const _0x5662f3 = "ENTITY_LEADGEN_RECOMMEND";
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
      _0x15c6c2(_0x323839);
      _0x5f17f0();
      const _0x1c593e = _0x4e1828?.() || document;
      const _0x3c9a26 = String(_0x323839.previousIdentity || _0x4d612a?.(_0x1c593e) || "");
      const _0x16cd4d = String(_0x323839.previousTitle || (typeof _0x518060 === "function" ? _0x518060(_0x1c593e) : "") || "");
      const _0x511911 = String(_0x323839.previousAuthor || "").trim().replace(/^@+/, "");
      const _0x5a1ed5 = String(_0x323839.previousVideoUrl || "").trim();
      const _0x41f7d4 = String(_0x323839.previousVideoId || _0x59d57b(_0x5a1ed5) || _0x59d57b(_0x3c9a26) || "").trim();
      const _0x59f45c = {
        identity: _0x3c9a26,
        title: _0x16cd4d,
        videoId: _0x41f7d4,
        videoUrl: _0x5a1ed5
      };
      if (skipLive || _0xa185c3(_0x1c593e) || _0x62cea0() || _0x1eb8ae(_0x16cd4d)) {
        _0x4125a9({
          message: "推荐页：画面检测到直播间，正在切换下一条…",
          level: "info"
        });
        await _0xe64dea(_0x5662f3);
        const _0x4b9610 = await _0x566d74({
          wantAuthor: false,
          maxWaitMs: 4000,
          lightCapture: true
        });
        const _0x33f0a8 = _0x28b8b4(_0x59f45c, _0x4b9610) || _0x4b9610?.ready && !_0x4b9610?.live;
        if (_0x33f0a8 && _0x4b9610?.ready) {
          _0x215a68("线索采集：跳过直播后锁定下一条", {
            scope: _0x4e1828?.() || document,
            isFeedPlayback: true,
            intervalMs: 250,
            loopId: _0x5662f3,
            reuseActive: true
          });
          _0x4125a9({
            message: _0x4b9610.live ? "推荐页：仍落在直播预览，将继续跳过" : "推荐页：直播间已跳过，下一条画面已稳定",
            level: "info"
          });
        }
        _0xe66ac6({
          success: !!_0x33f0a8,
          continued: !!_0x33f0a8,
          skippedLive: true,
          identity: _0x4b9610?.identity || "",
          videoId: _0x4b9610?.videoId || "",
          videoUrl: _0x4b9610?.videoUrl || "",
          title: _0x4b9610?.title || "",
          live: !!_0x4b9610?.live,
          reason: _0x33f0a8 ? "" : "live_skip_not_moved",
          nextSnapshot: _0x4b9610?.ready ? _0x4b9610 : null
        });
        return;
      }
      _0x4125a9({
        message: "推荐页：正在切换下一条作品…",
        level: "info"
      });
      await _0x6755ad(_0x5662f3);
      let _0x3af2a2 = await _0xcb20c8(_0x5662f3, {
        previousIdentity: _0x3c9a26,
        previousTitle: _0x16cd4d,
        previousAuthor: _0x511911,
        leadVideoUrl: _0x5a1ed5 || (_0x41f7d4 ? "https://www.douyin.com/video/" + _0x41f7d4 : ""),
        dedupKey: _0x41f7d4,
        phaseLabel: "线索采集推荐页切条",
        preferredScope: _0x1c593e,
        quietTrace: true,
        acceptTitleOnlySwitch: true
      });
      let _0x2e0133 = await _0x566d74({
        wantAuthor: false,
        maxWaitMs: _0x3af2a2 ? 2500 : 3500,
        lightCapture: true
      });
      if (!_0x3af2a2 && _0x28b8b4(_0x59f45c, _0x2e0133)) {
        _0x3af2a2 = true;
      }
      if (_0x3af2a2) {
        _0x215a68("线索采集：切条后锁定下一条作品", {
          scope: _0x4e1828?.() || document,
          isFeedPlayback: true,
          intervalMs: 250,
          loopId: _0x5662f3,
          reuseActive: true
        });
        const _0x3fad7c = String(_0x2e0133?.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
        _0x4125a9({
          message: _0x2e0133?.live ? "推荐页：已切到直播预览，准备跳过" : "推荐页：已切换到下一条" + (_0x3fad7c ? "「" + _0x3fad7c + "」" : "") + "，画面已稳定",
          level: "info"
        });
      }
      _0xe66ac6({
        success: !!_0x3af2a2,
        continued: !!_0x3af2a2,
        identity: _0x2e0133?.identity || _0x4d612a?.(_0x4e1828?.() || document) || "",
        videoId: _0x2e0133?.videoId || "",
        videoUrl: _0x2e0133?.videoUrl || "",
        title: _0x2e0133?.title || "",
        live: !!_0x2e0133?.live,
        reason: _0x3af2a2 ? "" : "feed_switch_not_settled",
        nextSnapshot: _0x2e0133?.ready ? _0x2e0133 : null,
        verifiedBySnapshot: !!_0x3af2a2 && !!_0x2e0133?.ready
      });
    } catch (_0x3ce01c) {
      if (String(_0x3ce01c?.message || _0x3ce01c) === "TASK_ABORTED") {
        _0xe66ac6({
          success: false,
          cancelled: true
        });
        return;
      }
      _0xe66ac6({
        success: false,
        error: _0x3ce01c?.message || String(_0x3ce01c)
      });
    }
  }
  async function _0x252abb(_0x5483c6 = {}) {
    const _0x1c1ba0 = _0x5483c6.requestId;
    const _0x41e53d = _0x5483c6.taskId || "";
    const _0x4ee227 = _0x43cc30 => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x1c1ba0,
          taskId: _0x41e53d,
          ..._0x43cc30
        });
      } catch (_0x4e5694) {}
    };
    try {
      if (!_0x51db40.taskRunning) {
        _0x51db40.stopRequested = false;
      }
      const _0x5842ed = "ENTITY_LEADGEN";
      const _0x5d30ba = typeof _0x288445 === "function" ? _0x288445({
        includeFeed: false
      }) : null;
      if (!_0x5d30ba || !_0x1b22e4(_0x5d30ba)) {
        _0x4ee227({
          success: false,
          continued: false,
          reason: "no_modal"
        });
        return;
      }
      _0x4125a9({
        taskId: _0x41e53d,
        message: "正在弹层内切换下一条视频…",
        level: "info"
      });
      const _0x2befb7 = typeof _0x344dfe === "function" ? _0x344dfe("", _0x5d30ba || document) || "" : "";
      const _0x3796f3 = typeof _0x4d612a === "function" ? _0x4d612a(_0x4e1828?.() || _0x5d30ba) || "" : "";
      const _0x561899 = typeof _0x518060 === "function" ? String(_0x518060() || "") : "";
      const _0x5b1d79 = (() => {
        try {
          const _0x5df47a = typeof _0x116c29 === "function" ? _0x116c29() : null;
          return String(_0x5df47a?.nickname || _0x5df47a?.name || "").trim();
        } catch (_0xf253b) {
          return "";
        }
      })();
      const _0x4a2f33 = typeof _0x59d57b === "function" ? _0x59d57b(_0x2befb7) || _0x59d57b(window.location.href) || "" : "";
      await _0x6755ad(_0x5842ed);
      let _0x58e23d = false;
      if (typeof _0xcb20c8 === "function") {
        _0x58e23d = await _0xcb20c8(_0x5842ed, {
          previousIdentity: _0x3796f3,
          previousTitle: _0x561899,
          previousAuthor: _0x5b1d79,
          leadVideoUrl: _0x2befb7,
          phaseLabel: "线索采集切条",
          requireDistinctVideoId: true
        });
      } else {
        await _0x144308(1800);
        const _0x307c10 = typeof _0x4d612a === "function" ? _0x4d612a(_0x4e1828?.() || _0x5d30ba) || "" : "";
        _0x58e23d = !!_0x307c10 && _0x307c10 !== _0x3796f3;
      }
      _0x215a68("线索采集：切条后锁定暂停");
      const _0x267687 = typeof _0x344dfe === "function" ? _0x344dfe("", _0x5d30ba || document) || "" : "";
      const _0x4f8faf = typeof _0x59d57b === "function" ? _0x59d57b(_0x267687) || _0x59d57b(window.location.href) || "" : "";
      const _0x23a41a = !!_0x4a2f33 && !!_0x4f8faf && String(_0x4a2f33) === String(_0x4f8faf);
      if (_0x58e23d && _0x23a41a) {
        _0x58e23d = false;
      }
      _0x4ee227({
        success: !!_0x58e23d,
        continued: !!_0x58e23d,
        videoUrl: _0x267687,
        reason: _0x58e23d ? "" : _0x23a41a ? "same_video" : "switch_failed"
      });
    } catch (_0x2852b1) {
      if (String(_0x2852b1?.message || _0x2852b1) === "TASK_ABORTED") {
        _0x4ee227({
          success: false,
          cancelled: true
        });
        return;
      }
      _0x4ee227({
        success: false,
        error: _0x2852b1?.message || String(_0x2852b1)
      });
    }
  }
  async function _0x3c5932(_0x12aca5 = {}) {
    const _0x38b69f = _0x12aca5.requestId;
    const _0x1c3f19 = _0x12aca5.taskId;
    const _0x7479e2 = String(_0x12aca5.sourceType || "").trim();
    if (_0x7479e2 === "live") {
      await _0x28206a(_0x12aca5);
      return;
    }
    const _0x4d68d4 = String(_0x12aca5.searchKeyword || "").trim();
    const _0x310632 = _0x12aca5.generation != null ? Number(_0x12aca5.generation) : null;
    const _0x269993 = ++_0x261e0c;
    const _0x1fa1d1 = Number(_0x12aca5.maxCollect) > 0 ? Math.floor(Number(_0x12aca5.maxCollect)) : 0;
    const _0x2416c8 = new Set(Array.isArray(_0x12aca5.seenKeys) ? _0x12aca5.seenKeys.map(_0x644d55 => String(_0x644d55 || "").trim()).filter(Boolean) : []);
    const _0x1972c1 = [];
    _0xfbe77f = {
      taskId: _0x1c3f19 || "",
      accountId: _0x12aca5.accountId || "",
      accountName: _0x12aca5.accountName || _0x12aca5.nickname || "",
      generation: _0x310632,
      skipIngest: !!_0x12aca5.skipIngest,
      sourceType: _0x7479e2
    };
    try {
      const _0x5885d1 = String(_0x12aca5.accountId || "").trim();
      if (_0x5885d1) {
        window._radar_account_id = _0x5885d1;
        sessionStorage.setItem("radar_account_id", _0x5885d1);
      }
    } catch (_0x3ff1d3) {}
    const _0x468d89 = _0x5d2b00 => {
      try {
        _0x169ee9.send("entity-leadgen-collect-result", {
          requestId: _0x38b69f,
          taskId: _0x1c3f19,
          generation: _0x310632,
          ..._0x5d2b00
        });
      } catch (_0x1c21b2) {}
    };
    try {
      window._radar_account_id = _0x12aca5.accountId;
      window._radar_account_name = _0x12aca5.accountName || _0x12aca5.nickname || "";
      _0x5b2e6a();
      _0xf133cb();
      const _0x3f14e6 = (() => {
        const _0x10afb6 = _0x4d68d4;
        if (!_0x10afb6) {
          return _0x7479e2;
        }
        if (/^https?:\/\//i.test(_0x10afb6) || /douyin\.com|modal_id=/i.test(_0x10afb6)) {
          return _0x7479e2;
        }
        return _0x7479e2 + "「" + _0x10afb6 + "」";
      })();
      _0x4125a9({
        sourceType: _0x7479e2,
        message: "页面采集开始：" + _0x3f14e6,
        level: "info"
      });
      if (_0x7479e2 === "comment") {
        _0x215a68("线索采集：进入视频后立即暂停");
        _0x4125a9({
          taskId: _0x1c3f19,
          message: "已暂停播放，防止自动跳转到下一条",
          level: "info"
        });
      }
      const _0x1de314 = _0x7479e2 === "comment" ? 350 + Math.random() * 350 : 1800 + Math.random() * 800;
      if (!(await _0x155f4c(_0x1de314, _0x269993))) {
        _0x468d89({
          success: false,
          cancelled: true,
          users: _0x1972c1
        });
        return;
      }
      _0x5b2e6a();
      if (_0x7479e2 === "comment") {
        _0x215a68("线索采集：页面就绪后再次锁定暂停");
      }
      const _0xdd7ad3 = await _0x5e9448(_0x269993);
      if (_0xdd7ad3 > 0) {
        _0x4125a9({
          taskId: _0x1c3f19,
          message: "已关闭登录弹窗 ×" + _0xdd7ad3,
          level: "info"
        });
        if (!(await _0x155f4c(800 + Math.random() * 600, _0x269993))) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
      }
      if (_0x7479e2 === "user") {
        const _0x5aae81 = await _0x5bd28f(_0x269993);
        if (!_0x5aae81) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "搜索用户" + (_0x4d68d4 ? "「" + _0x4d68d4 + "」" : "") + "：页面暂未准备完成",
            level: "warning"
          });
        } else if (!(await _0x155f4c(1800 + Math.random() * 800, _0x269993))) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
        await _0x306fe1(_0x269993, _0x1c3f19, {
          userFanCount: _0x12aca5.userFanCount,
          userTypeFilter: _0x12aca5.userTypeFilter,
          accountId: _0x12aca5.accountId || ""
        });
        if (_0x269993 !== _0x261e0c) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
      }
      if (_0x7479e2 === "mutual" || _0x7479e2 === "following") {
        const _0xeb0561 = _0x7479e2 === "following" ? "关注列表" : "相互关注";
        const _0x48892d = _0x7479e2 === "following" ? "following" : "fans";
        const _0x2407d5 = _0x48892d === "following" ? "关注" : "粉丝";
        window.__radar_entity_mutual_filter_active = false;
        window.__radar_entity_following_list_active = false;
        await _0x37584e(_0x269993, 8000, _0x48892d);
        const _0xf73b5c = _0x48892d === "following" ? _0x399dc0() : _0x3419a4();
        if (!_0xf73b5c) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: _0xeb0561 + "：未找到主页「" + _0x2407d5 + "」入口（可能未登录）",
            level: "warning"
          });
          _0x468d89({
            success: true,
            users: [],
            message: "未找到主页" + _0x2407d5 + "入口"
          });
          return;
        }
        await _0x4f4edb(_0xf73b5c, null);
        try {
          if (_0xf73b5c.click) {
            _0xf73b5c.click();
          }
          const _0x40057e = _0xf73b5c.querySelector?.("div, span");
          if (_0x40057e && _0x40057e.click) {
            _0x40057e.click();
          }
        } catch (_0xad0568) {}
        _0x4125a9({
          taskId: _0x1c3f19,
          message: _0xeb0561 + "：已点击主页「" + _0x2407d5 + "」，正在打开关系列表",
          level: "info"
        });
        if (!(await _0x2f0de7(_0x269993, 9000))) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: _0xeb0561 + "：关系列表未能打开",
            level: "warning"
          });
          _0x468d89({
            success: true,
            users: [],
            message: "关系列表未能打开"
          });
          return;
        }
        if (!(await _0x155f4c(800 + Math.random() * 500, _0x269993))) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
        const _0x4b9c73 = _0x5dec6e();
        if (_0x4b9c73) {
          _0x34975f();
          _0x4125a9({
            taskId: _0x1c3f19,
            accountId: _0x12aca5.accountId || "",
            sourceType: _0x7479e2,
            resetNetworkCapture: true
          });
          await _0x4f4edb(_0x4b9c73, null);
          if (_0x7479e2 === "mutual") {
            window.__radar_entity_mutual_filter_active = true;
            window.__radar_entity_following_list_active = false;
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "相互关注：已切换到关注列表（将筛选其中的互关用户）",
              level: "info"
            });
          } else {
            window.__radar_entity_mutual_filter_active = false;
            window.__radar_entity_following_list_active = true;
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "关注列表：已在关注 Tab，将采集全部关注用户",
              level: "info"
            });
          }
          if (!(await _0x155f4c(1800 + Math.random() * 1000, _0x269993))) {
            _0x468d89({
              success: false,
              cancelled: true,
              users: _0x1972c1
            });
            return;
          }
        } else if (_0x7479e2 === "mutual") {
          window.__radar_entity_mutual_filter_active = true;
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "相互关注：未找到关注Tab，将在粉丝列表中按followStatus筛选互关用户",
            level: "info"
          });
        } else {
          window.__radar_entity_following_list_active = true;
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "关注列表：当前已是关注关系列表，开始采集",
            level: "info"
          });
        }
      }
      if (_0x7479e2 === "video" && /\/search\//i.test(String(window.location.href || ""))) {
        const _0x4b7589 = await _0x43d800(_0x269993, _0x1c3f19, _0x12aca5);
        if (_0x4b7589?.cancelled || _0x269993 !== _0x261e0c) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
        if (_0x4b7589?.applied && !_0x4b7589?.skipped) {
          _0x34975f();
          try {
            if (typeof _0xe0fd77 === "function") {
              _0xe0fd77("after-official-search-filters");
            }
          } catch (_0x3ca835) {}
          try {
            _0xd24701({
              force: true
            });
            _0x283e6c();
          } catch (_0x28702f) {}
          _0x4125a9({
            taskId: _0x1c3f19,
            accountId: _0x12aca5.accountId || "",
            sourceType: "video",
            resetNetworkCapture: true
          });
        }
      }
      if (_0x7479e2 === "blogger" || _0x7479e2 === "user" || _0x7479e2 === "video") {
        await _0x306158(_0x269993, _0x1c3f19, {
          sourceType: _0x7479e2,
          maxWaitMs: 20000
        });
      }
      const _0x5ca2b2 = String(_0x12aca5.userFanCount || "0");
      const _0x1eab3 = String(_0x12aca5.userTypeFilter || "0");
      if (_0x7479e2 === "user") {
        window.__radar_entity_user_fan_count = _0x5ca2b2;
        _0x332224(_0x5ca2b2, _0x1eab3);
      }
      const _0x155025 = _0x2a0c74(_0x7479e2, {
        userFanCount: _0x5ca2b2
      });
      if (_0x155025.length) {
        const _0x2d277c = _0x155025.slice(0, 3).map(_0x4d4d39 => "@" + _0x4d4d39.nickname + " " + _0x4bd97f(_0x4d4d39.followerCount) + "粉").join("、");
        const _0x17e347 = _0x28bd0d(_0x5ca2b2);
        _0x4125a9({
          taskId: _0x1c3f19,
          message: "首批已获取 " + _0x155025.length + " 个用户" + (_0x17e347 ? "（已按粉丝「" + _0x17e347.label + "」本地校验）" : "") + (_0x2d277c ? "，样例：" + _0x2d277c : "") + "，继续加载更多",
          level: "info"
        });
      } else if (_0x7479e2 !== "comment") {
        _0x4125a9({
          taskId: _0x1c3f19,
          message: "正在加载并采集搜索结果…",
          level: "info"
        });
      }
      if (_0x7479e2 === "comment") {
        const _0x39ba38 = String(_0x12aca5.targetVideoUrl || _0x12aca5.searchKeyword || "").trim();
        const _0xe2e04 = !!_0x12aca5.alreadyOnCurrentVideo;
        const _0xa924e = _0xe2e04 ? {
          allowFeed: true
        } : {};
        _0x215a68("线索采集：评论采集期间持续暂停");
        _0x325c29(_0x39ba38);
        if (_0xe2e04) {
          if (!_0x5c0002(_0x39ba38, _0xa924e)) {
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "当前推荐作品画面未就绪，跳过本条评论区",
              level: "warning"
            });
            _0x468d89({
              success: false,
              videoNotReady: true,
              users: _0x1972c1,
              message: "当前作品未就绪"
            });
            return;
          }
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "已在当前作品，开始打开评论区…",
            level: "info"
          });
        } else {
          const _0x36adf6 = await _0x179306(_0x269993, _0x1c3f19, _0x39ba38, 20000);
          if (_0x36adf6.cancelled || _0x269993 !== _0x261e0c) {
            _0x468d89({
              success: false,
              cancelled: true,
              users: _0x1972c1
            });
            return;
          }
          if (_0x36adf6.status === "unavailable") {
            const _0x312941 = typeof _0x2f1d5a === "function" ? _0x2f1d5a(_0x36adf6.reason || "unavailable") : {
              title: "视频失效",
              detail: "视频不存在或无法观看，已跳过"
            };
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "视频失效：" + (_0x312941.detail || _0x312941.title || "视频不存在或无法观看，已跳过"),
              level: "warning"
            });
            _0x468d89({
              success: true,
              videoUnavailable: true,
              unavailableReason: _0x36adf6.reason || "unavailable",
              users: [],
              message: "视频失效已跳过"
            });
            return;
          }
          if (_0x36adf6.status !== "ready") {
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "页面未进入指定视频（可能卡住），将重新打开",
              level: "warning"
            });
            _0x468d89({
              success: false,
              needReload: true,
              videoNotReady: true,
              users: _0x1972c1,
              message: "视频页未就绪"
            });
            return;
          }
        }
        const _0x542d16 = _0x17bf81(document.body);
        if (_0x542d16.nickname) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "当前视频作者 @" + _0x542d16.nickname + "，将自动过滤其评论",
            level: "info"
          });
        }
        const _0x5584c6 = await _0x3ed1f6(_0x269993, _0x1c3f19);
        if (_0x5584c6.cancelled || _0x269993 !== _0x261e0c) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
        _0x38705e(_0x4a8389(), "线索采集：评论区打开后再次锁定暂停");
        const _0x439a3e = _0xe2e04 ? true : _0x5c0002(_0x39ba38, _0xa924e);
        const _0x2bd568 = !!_0x5584c6.notOnVideo || !!_0x5584c6.badgeOnly || !!_0x5584c6.slow && !_0x5584c6.empty || !_0x5584c6.opened;
        if (!_0xe2e04 && !_0x439a3e || _0x2bd568) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: _0xe2e04 ? _0x5584c6.badgeOnly ? "评论角标有数量但评论列表未打开，跳过本条" : "评论区未能真正打开，跳过本条" : !_0x439a3e ? "页面仍未落到指定视频，将重新打开" : _0x5584c6.badgeOnly ? "评论角标有数量但评论列表未打开，将重新进入视频" : "评论区未能真正打开，将重新进入视频",
            level: "warning"
          });
          _0x468d89({
            success: false,
            needReload: !_0xe2e04,
            videoNotReady: !_0x439a3e,
            users: _0x1972c1,
            message: _0xe2e04 ? "评论区未就绪" : "评论区未就绪，需重新进入视频"
          });
          return;
        }
        if (_0x5584c6.empty) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: "该视频确认暂无评论，跳过",
            level: "info"
          });
          _0x468d89({
            success: true,
            users: [],
            message: "暂无评论"
          });
          return;
        }
        _0x4125a9({
          taskId: _0x1c3f19,
          message: "评论区已就绪（可见评论 " + (Number(_0x5584c6.visibleItemCount) || 0) + " 条），开始采集潜客（含评论内容）…",
          level: "info"
        });
        const _0x240a1d = _0x12aca5.commentFilters || null;
        try {
          const _0x237a25 = _0x26fd17();
          const _0x2a26ed = _0x237a25?.formatEntityCommentFiltersSummary?.(_0x240a1d || {});
          if (_0x2a26ed && _0x2a26ed !== "不限") {
            _0x4125a9({
              taskId: _0x1c3f19,
              message: "已启用评论筛选：" + _0x2a26ed,
              level: "info"
            });
          }
        } catch (_0x493002) {}
        let _0x3542f2 = null;
        try {
          _0x3542f2 = typeof _0x5732ba === "function" ? _0x5732ba(document.body) : null;
        } catch (_0xb389fa) {}
        const _0x3ed1d6 = (() => {
          try {
            const _0x251f92 = typeof _0x518060 === "function" ? String(_0x518060() || "").trim() : "";
            if (_0x251f92 && _0x251f92 !== "未知视频") {
              return _0x251f92;
            } else {
              return "";
            }
          } catch (_0x4020e2) {
            return "";
          }
        })();
        const _0x4918fb = await _0x593a97({
          token: _0x269993,
          taskId: _0x1c3f19,
          searchKeyword: _0x4d68d4,
          seenKeys: _0x2416c8,
          collectedUsers: _0x1972c1,
          maxCollect: _0x1fa1d1,
          authorFilter: _0x542d16,
          initialPageTotal: _0x3542f2,
          commentFilters: _0x240a1d,
          targetVideoUrl: _0x39ba38,
          sourceVideoTitle: _0x3ed1d6,
          videoTitle: _0x3ed1d6,
          progressLabel: (() => {
            const _0x47e75a = String(_0x4d68d4 || "").trim();
            if (!_0x47e75a || /^https?:\/\//i.test(_0x47e75a) || /douyin\.com|modal_id=/i.test(_0x47e75a)) {
              return "视频评论区潜客";
            }
            return "视频评论区潜客「" + _0x47e75a + "」";
          })()
        });
        try {
          const _0x119b51 = (() => {
            try {
              const _0x3b7069 = _0x2e3bdf();
              return _0x3b7069?.canonicalizeDouyinVideoUrl?.(_0x39ba38) || _0x3b7069?.normalizeProcessedVideoKey?.(_0x39ba38) || "";
            } catch (_0x4c5379) {
              return String(_0x39ba38 || "").trim();
            }
          })();
          const _0x3d355c = _0x3ed1d6 || (() => {
            try {
              const _0x1779ef = typeof _0x518060 === "function" ? String(_0x518060() || "").trim() : "";
              if (_0x1779ef && _0x1779ef !== "未知视频") {
                return _0x1779ef;
              } else {
                return "";
              }
            } catch (_0x275b57) {
              return "";
            }
          })();
          for (const _0x15d387 of _0x1972c1) {
            if (!_0x15d387 || typeof _0x15d387 !== "object") {
              continue;
            }
            if (!_0x15d387.videoUrl && _0x119b51) {
              _0x15d387.videoUrl = _0x119b51;
            }
            if ((!_0x15d387.title || _0x15d387.title === "未知视频") && _0x3d355c) {
              _0x15d387.title = _0x3d355c;
              _0x15d387.sourceVideoTitle = _0x3d355c;
            } else if (!_0x15d387.sourceVideoTitle && (_0x15d387.title || _0x3d355c)) {
              _0x15d387.sourceVideoTitle = _0x15d387.title || _0x3d355c;
            }
          }
        } catch (_0x48fbeb) {}
        if (_0x4918fb.cancelled || _0x269993 !== _0x261e0c) {
          _0x468d89({
            success: false,
            cancelled: true,
            users: _0x1972c1
          });
          return;
        }
        if (_0x4918fb.needReload || _0x4918fb.drifted || _0x4918fb.panelNotOpen) {
          _0x4125a9({
            taskId: _0x1c3f19,
            message: _0x4918fb.panelNotOpen ? "采集过程中评论区未真正打开，将重新进入指定视频" : "采集过程中滑到了其他视频，将重新进入指定视频",
            level: "warning"
          });
          _0x468d89({
            success: false,
            needReload: true,
            videoNotReady: true,
            users: _0x1972c1,
            message: _0x4918fb.panelNotOpen ? "评论区未打开" : "采集中视频漂移"
          });
          return;
        }
        _0x468d89({
          success: true,
          users: _0x1972c1,
          message: "本页采集 " + _0x1972c1.length + " 个评论潜客",
          reachedLimit: !!_0x4918fb.reachedLimit
        });
        _0x34975f();
        return;
      }
      const _0x224a3f = _0x7479e2 === "blogger" ? _0x3b68c6 : _0x7479e2 === "user" ? () => _0x334336({
        userFanCount: _0x5ca2b2
      }) : _0x7479e2 === "mutual" || _0x7479e2 === "following" ? () => _0x27051b(_0x7479e2) : _0x7479e2 === "video" ? _0x5ace41 : () => _0x334336({
        userFanCount: _0x5ca2b2
      });
      if (_0x7479e2 === "video") {
        try {
          _0xd24701({
            force: true
          });
          _0x283e6c();
        } catch (_0x4565cc) {}
        await _0x155f4c(600 + Math.random() * 400, _0x269993);
      }
      const _0x5810a0 = _0x7479e2 === "mutual" || _0x7479e2 === "following";
      const _0x20165f = await _0x13d667({
        token: _0x269993,
        taskId: _0x1c3f19,
        gatherFn: _0x224a3f,
        sourceType: _0x7479e2,
        searchKeyword: _0x4d68d4,
        seenKeys: _0x2416c8,
        collectedUsers: _0x1972c1,
        maxCollect: _0x1fa1d1,
        emptyLimit: _0x5810a0 ? 8 : _0x7479e2 === "video" ? _0x4da700()?.ENTITY_VIDEO_SEARCH_EMPTY_LIMIT || 12 : 3,
        maxRounds: _0x5810a0 ? 150 : _0x7479e2 === "video" ? _0x4da700()?.ENTITY_VIDEO_SEARCH_MAX_ROUNDS || 200 : 100,
        progressLabel: _0x7479e2 === "blogger" ? "视频博主" + (_0x4d68d4 ? "「" + _0x4d68d4 + "」" : "") : _0x7479e2 === "user" ? "搜索用户" + (_0x4d68d4 ? "「" + _0x4d68d4 + "」" : "") : _0x7479e2 === "video" ? "搜索视频" + (_0x4d68d4 ? "「" + _0x4d68d4 + "」" : "") : _0x7479e2 === "following" ? "关注列表" : "相互关注"
      });
      if (_0x20165f.cancelled || _0x269993 !== _0x261e0c) {
        _0x468d89({
          success: false,
          cancelled: true,
          users: _0x1972c1
        });
        return;
      }
      _0x468d89({
        success: true,
        users: _0x1972c1,
        message: "本页采集 " + _0x1972c1.length + " 个用户",
        reachedLimit: !!_0x20165f.reachedLimit
      });
      _0x34975f();
    } catch (_0x2ddb1c) {
      _0x468d89({
        success: false,
        error: _0x2ddb1c?.message || String(_0x2ddb1c),
        users: _0x1972c1
      });
      _0x34975f();
    } finally {
      if (_0x269993 === _0x261e0c) {
        _0x213059();
      }
      _0x5f17f0();
      _0x4aa343();
    }
  }
  function _0x41b2e7() {
    _0x261e0c += 1;
    _0x213059();
    _0x5f17f0();
    _0x4aa343();
    _0x34975f();
  }
  return {
    buildEntityCommentScraperDeps: _0x5e5715,
    dismissEntityLoginPopupsCore: _0x1dfb8c,
    ensureEntityApiBridge: _0x36a380,
    ensureEntityApiHook: _0x5b2e6a,
    ensureEntityLiveHook: _0x1183b2,
    getEntityCommentScraperModule: _0x18de73,
    installEntityFeedSwipeLock: _0x325c29,
    isActive: () => !!_0xfbe77f.taskId,
    removeEntityFeedSwipeLock: _0x4aa343,
    runEntityLeadgenScrapePage: _0x3c5932,
    runEntityLeadgenOpenFirstSearchVideo: _0x530c01,
    runEntityLeadgenOpenSearchVideo: _0x2aa24d,
    runEntityLeadgenWaitVideoReady: _0x49efb4,
    runEntityLeadgenInspectRecommendVideo: _0x3dfe64,
    runEntityLeadgenMoveNextRecommendVideo: _0xd88739,
    runEntityLeadgenMoveNextSearchVideo: _0x252abb,
    cancelEntityLeadgenCollect: _0x41b2e7
  };
}
module.exports = {
  createEntityLeadgenController: createEntityLeadgenController
};
const path = require("path");
const os = require("os");
const {
  acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard
} = require("./taskRuntimeGuard");
const {
  createEntityAutomationViewHostFactory
} = require("./entityAutomationViewHost");
const leadUserKey = require("../shared/leadUserKey");
const {
  getEntityEntryMeta
} = require("../shared/leadSource");
const {
  buildDouyinSearchUrl,
  buildEntitySearchModalUrl,
  buildDouyinUserSearchUrl,
  buildDouyinLiveUrl,
  parseEntityLiveUrls,
  DOUYIN_SELF_PROFILE_URL
} = require("../shared/entityLeadgenUrls");
const {
  resolveDouyinShareUrl
} = require("../shared/resolveDouyinShareUrl");
const {
  getEntityLeadgenApiHookInstaller
} = require("../shared/entityLeadgenApiHook");
const {
  getLeadgenScrapeApiHookInstaller
} = require("../shared/leadgenScrapeApiHook");
const {
  getEntityLeadgenLiveHookInstaller,
  resolveLiveEventCategory
} = require("../shared/entityLeadgenLiveHook");
const {
  createEntityLeadgenNetworkCapture
} = require("./entityLeadgenNetworkCapture");
const {
  formatEntityIngestSummary,
  entityIngestSummaryLevel
} = require("../shared/entityIngestSummary");
const {
  getLocalLiveRoomConcurrency,
  getLocalLiveRoomConcurrencyDetails,
  isAnonymousEntityAccountId,
  normalizeLiveConcurrency,
  LIVE_CONCURRENCY_DEFAULT
} = require("../shared/entityLiveScheduler");
const {
  toDouyinJingxuanUrl,
  extractDouyinVideoId,
  canonicalizeDouyinVideoUrl
} = require("../shared/processedVideoKey");
const {
  stripLocationFromCommentTimeText
} = require("../shared/commentTime");
const {
  extractAuthorSecUid,
  toCollectedAuthorKey,
  normalizeAuthorProfileUrl,
  isEntityRelationAuthorSource,
  resolveAuthorSecUidFromLead
} = require("../shared/collectedLeadKeys");
const {
  normalizeEntityCommentFilters,
  evaluateEntityCommentFilters
} = require("../shared/entityCommentFilters");
const {
  hasUsableSecUid,
  isEntityLeadEligibleForLeadPool
} = require("../shared/entityLeadPoolEligibility");
const {
  normalizeBloggerWorkSelectMode,
  normalizeBloggerWorkCount,
  normalizeBloggerPublishWithinDays,
  normalizeAwemeCreateTimeMs,
  isBloggerWorkWithinPublishDays
} = require("../shared/entityBloggerProfileSelect");
const {
  resolveBloggerProfileUrls,
  captureBloggerProfileWorks,
  selectWorksForBloggerConfig,
  resolveCaptureMaxWorks,
  resolveScrollRounds
} = require("./entityBloggerProfileCollect");
const {
  createMonitorAuthorWorkNav
} = require("./monitorAuthorWorkNav");
const {
  buildDouyinVideoPublishTimeScrapeExpression,
  buildDouyinVideoCreateTimeWidgetReadExpression,
  parseDouyinRelativePublishTimeMs
} = require("../shared/douyinVideoPublishTime");
const {
  looksLikeMissedPinnedPublishTime
} = require("../shared/douyinProfileWorkPinned");
const {
  enrichVideoPublishTime,
  buildVideoPublishTimeLogJson
} = require("../shared/entityLeadgenSearchPublishTime");
const RUNTIME_LOG_LIMIT = 500;
const RUNTIME_LOG_TASK_LIMIT = 50;
const NAVIGATION_TIMEOUT_MS = 45000;
const PAGE_SCRAPE_TIMEOUT_MS = 720000;
const PAGE_SETTLE_MIN_MS = 1200;
const PAGE_SETTLE_MAX_MS = 8000;
const EXEC_JS_TIMEOUT_MS = 4000;
const BLANK_NAV_TIMEOUT_MS = 8000;
function sleep(_0x172183) {
  return new Promise(_0x3d181e => setTimeout(_0x3d181e, _0x172183));
}
function withTimeout(_0x4b4a7f, _0x57911a, _0x21bb0f = "timeout") {
  let _0x23893d = null;
  return Promise.race([Promise.resolve(_0x4b4a7f), new Promise((_0x2bead4, _0x12fbcb) => {
    _0x23893d = setTimeout(() => {
      _0x12fbcb(Object.assign(new Error(_0x21bb0f), {
        code: "entity_timeout"
      }));
    }, _0x57911a);
  })]).finally(() => {
    if (_0x23893d) {
      clearTimeout(_0x23893d);
    }
  });
}
function createEntityLeadgenRunner(_0x32e717) {
  const _0x480154 = () => runtimeConfig?.getPlain?.()?.urls || null;
  const _0x16b42b = createMonitorAuthorWorkNav();
  const {
    app: _0x1c921e,
    store: _0x26dd8d,
    fs: _0x866731,
    mainWindow: _0x427b5e,
    runtimeConfig = null,
    applyAccountProxy: _0x4b949e,
    configureAutomationSession: _0x2d035a,
    applyPackagedWindowMenuPolicy: _0x25147e,
    attachProtocolGuard: _0x2df114,
    appendHistory: _0x31f44a,
    listKnownLeadUserKeys: _0x24d0c1,
    listKnownCollectedAuthorKeys: _0x3a8ec1,
    getPlatformViews = null,
    attachAutomationViewToBackgroundHost = null,
    ensureBackgroundAutomationHostWindow = null,
    shouldAttachAutomationView = null,
    cancelPendingAutomationViewDestroy = null,
    recoverMainAutomationView = null,
    attachMainAutomationView = null,
    nudgeAutomationViewRepaint = null,
    requestAutomationLayoutRefresh = null,
    ensureAutomationPaintWatchdog = null,
    getBoundsStateByViewKey = null,
    automationLiveViewLifecycle = null,
    destroyAutomationBrowserView = null,
    resolveAutomationPreloadPath: _0x16ef68 = null,
    automationUserAgent = "",
    getViewSettingsMap = null,
    isCommentLeadgenAccountBusy = null,
    isVideoMonitorAccountBusy = null
  } = _0x32e717;
  let _0x41183a = null;
  function _0x5dd514(_0x12e9c1) {
    if (!_0x12e9c1 || _0x12e9c1.isDestroyed?.() || !_0x427b5e || _0x427b5e.isDestroyed?.()) {
      return false;
    }
    const _0x53f453 = String(_0x12e9c1.__radarEntityViewKey || "").trim();
    const _0x10f36b = _0x53f453 && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x53f453) : null;
    if (!_0x10f36b) {
      return false;
    }
    try {
      return _0x427b5e.getBrowserViews?.().includes(_0x10f36b) === true;
    } catch (_0x53f838) {
      return false;
    }
  }
  function _0x5dc34d(_0x3d6616) {
    if (!_0x3d6616 || _0x3d6616.isDestroyed?.() || _0x3d6616.webContents?.isDestroyed?.()) {
      return;
    }
    const _0xe81a7a = _0x5dd514(_0x3d6616);
    const _0x2e7577 = String(_0x3d6616.__radarEntityViewKey || "").trim();
    if (_0x2e7577) {
      try {
        automationLiveViewLifecycle?.wake?.(_0x2e7577);
      } catch (_0xb4ff9) {}
    }
    try {
      _0x3d6616.webContents.setBackgroundThrottling?.(false);
    } catch (_0x1192a2) {}
    try {
      _0x3d6616.webContents.setFrameRate?.(30);
    } catch (_0x3f6f47) {}
    try {
      _0x3d6616.webContents.invalidate?.();
    } catch (_0x4753c9) {}
    if (_0xe81a7a) {
      return;
    }
  }
  function _0x33c5c7() {
    if (typeof _0x16ef68 === "function") {
      try {
        return _0x16ef68();
      } catch (_0x43f7fa) {}
    }
    let _0x357fae = path.join(__dirname, "..", "automation-preload.js");
    if (_0x1c921e.isPackaged) {
      const _0x33ae11 = _0x26dd8d.get("latest_resource_path");
      if (_0x33ae11 && _0x866731.existsSync(path.join(_0x33ae11, "automation-preload.js"))) {
        _0x357fae = path.join(_0x33ae11, "automation-preload.js");
      }
    }
    return _0x357fae;
  }
  const _0x5c36b6 = createEntityAutomationViewHostFactory({
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => null,
    getMainWindow: () => _0x427b5e,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    configureAutomationSession: _0x2d035a,
    attachProtocolGuard: _0x2df114,
    applyAccountProxy: _0x4b949e,
    resolveAutomationPreloadPath: _0x33c5c7,
    automationUserAgent: automationUserAgent,
    store: _0x26dd8d,
    destroyAutomationBrowserView: destroyAutomationBrowserView
  });
  async function _0x31a7f4(_0x39d875) {
    if (!runtimeConfig || !_0x39d875 || _0x39d875.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await withTimeout(runtimeConfig.ensureFetched(), 8000, "entity_runtime_config_timeout");
      }
      runtimeConfig.pushToWebContents?.(_0x39d875);
    } catch (_0x2530ef) {
      console.warn("[EntityLeadgen] runtime config push failed:", _0x2530ef?.message || _0x2530ef);
    }
  }
  function _0xc7ac45(_0x7b423) {
    if (!_0x7b423) {
      return [];
    }
    const _0x4e5dd1 = String(_0x7b423);
    const _0xab42b0 = [];
    const _0x3ec3d0 = /(https?:\/\/[^\s,，;；"'<>()]+|(?:v\.)?douyin\.com\/[^\s,，;；"'<>()]+)/gi;
    let _0x5809b2;
    while ((_0x5809b2 = _0x3ec3d0.exec(_0x4e5dd1)) !== null) {
      let _0x169d9e = _0x5809b2[1].replace(/[),.;:，。！？、》」』】]+$/g, "");
      if (!/^https?:\/\//i.test(_0x169d9e)) {
        _0x169d9e = "https://" + _0x169d9e;
      }
      if (/douyin\.com|iesdouyin\.com/i.test(_0x169d9e) && !_0xab42b0.includes(_0x169d9e)) {
        _0xab42b0.push(_0x169d9e);
      }
    }
    const _0xfb8cd3 = /\b(\d{18,20})\b/g;
    while ((_0x5809b2 = _0xfb8cd3.exec(_0x4e5dd1)) !== null) {
      const _0x39c98a = _0x5809b2[1];
      const _0x34192c = "https://www.douyin.com/video/" + _0x39c98a;
      if (!_0xab42b0.some(_0x494ed9 => _0x494ed9.includes(_0x39c98a))) {
        _0xab42b0.push(_0x34192c);
      }
    }
    return _0xab42b0;
  }
  const _0x5ea9b0 = new Map();
  const _0x4b41fa = new Map();
  const _0x1362f9 = new Map();
  const _0x31c2d3 = new Map();
  const _0x494c23 = _0x2d7b27 => "entity-leadgen:" + _0x2d7b27;
  function _0x4085b5() {
    const _0x372d30 = os.totalmem();
    const _0x296194 = os.freemem();
    const _0x2be815 = _0x296194 / 1073741824;
    const _0x35dbed = _0x372d30 > 0 ? _0x296194 / _0x372d30 : 1;
    let _0x5c03d4 = 0;
    let _0x5e26f3 = 0;
    try {
      (_0x1c921e.getAppMetrics?.() || []).forEach(_0x2811c8 => {
        _0x5c03d4 += Number(_0x2811c8?.cpu?.percentCPUUsage || 0);
        if (_0x2811c8?.type === "Tab" || _0x2811c8?.type === "Renderer") {
          const _0x678d8d = Number(_0x2811c8?.memory?.workingSetSize || 0) / 1024;
          _0x5e26f3 = Math.max(_0x5e26f3, _0x678d8d);
        }
      });
    } catch (_0x5c2335) {}
    const _0x21efd5 = Math.min(100, _0x5c03d4 / Math.max(1, os.cpus().length));
    const _0x4fedcf = _0x2be815 < 2 || _0x35dbed < 0.12 || _0x21efd5 >= 75 || _0x5e26f3 >= 700;
    return {
      pressured: _0x4fedcf,
      freeMemGB: _0x2be815,
      appCpuPercent: _0x21efd5,
      largestRendererMemoryMb: _0x5e26f3
    };
  }
  function _0x396135(_0x37edad, _0x5ac000) {
    try {
      if (_0x427b5e && !_0x427b5e.isDestroyed() && !_0x427b5e.webContents?.isDestroyed?.()) {
        _0x427b5e.webContents.send("entity-leadgen-task-event", {
          taskId: _0x37edad,
          ..._0x5ac000
        });
      }
    } catch (_0x929f53) {}
  }
  function _0x9d21b4(_0xe6528a, _0x4ac9d3, _0x25a72d = "info", _0x184412 = {}) {
    if (!_0xe6528a || !_0x4ac9d3) {
      return;
    }
    let _0x3751f2 = String(_0x184412.accountId || "").trim();
    if (!_0x3751f2) {
      try {
        const _0x1de90a = _0x5ea9b0.get(_0xe6528a);
        const _0x16f6ae = Array.isArray(_0x1de90a?.accounts) ? _0x1de90a.accounts : [];
        const _0x5b96e6 = String(_0x4ac9d3).match(/^\[([^\]]+)\]/);
        if (_0x5b96e6) {
          const _0x1e7448 = _0x5b96e6[1];
          const _0x155c0f = _0x16f6ae.find(_0x120938 => String(_0x120938?.nickname || "") === _0x1e7448 || String(_0x120938?.name || "") === _0x1e7448 || String(_0x120938?.id || "") === _0x1e7448);
          if (_0x155c0f?.id) {
            _0x3751f2 = String(_0x155c0f.id);
          }
        }
        if (!_0x3751f2 && _0x16f6ae.length === 1 && _0x16f6ae[0]?.id) {
          _0x3751f2 = String(_0x16f6ae[0].id);
        }
      } catch (_0x6bc764) {}
    }
    const _0x271725 = {
      taskId: _0xe6528a,
      type: "log",
      message: _0x4ac9d3,
      level: _0x25a72d,
      ts: Date.now(),
      ...(_0x3751f2 ? {
        accountId: _0x3751f2
      } : {})
    };
    if (!_0x1362f9.has(_0xe6528a) && _0x1362f9.size >= RUNTIME_LOG_TASK_LIMIT) {
      const _0x395f63 = [..._0x1362f9.keys()].find(_0x47b20e => !_0x5ea9b0.has(_0x47b20e)) || _0x1362f9.keys().next().value;
      if (_0x395f63 != null) {
        _0x1362f9.delete(_0x395f63);
      }
    }
    const _0x4660d0 = _0x1362f9.get(_0xe6528a) || [];
    _0x4660d0.push(_0x271725);
    if (_0x4660d0.length > RUNTIME_LOG_LIMIT) {
      _0x4660d0.splice(0, _0x4660d0.length - RUNTIME_LOG_LIMIT);
    }
    _0x1362f9.set(_0xe6528a, _0x4660d0);
    _0x396135(_0xe6528a, _0x271725);
  }
  function _0x28e1c2(_0x31c029, _0x1ebd0a, _0x293d96 = {}) {
    if (!_0x31c029 || !_0x1ebd0a?.patchTask || !_0x293d96?.url) {
      return null;
    }
    const _0x2f951a = _0x1ebd0a.findTaskById?.(_0x31c029);
    const _0x370aaa = Array.isArray(_0x2f951a?.roomHints) ? _0x2f951a.roomHints : [];
    const _0x248f56 = {
      url: String(_0x293d96.url || ""),
      reason: String(_0x293d96.reason || "live_private"),
      message: String(_0x293d96.message || "直播间为私密或隐私设置，已跳过"),
      ts: Number(_0x293d96.ts || Date.now()) || Date.now()
    };
    const _0x200a58 = [..._0x370aaa.filter(_0x4b8010 => _0x4b8010.url !== _0x248f56.url || _0x4b8010.reason !== _0x248f56.reason), _0x248f56].slice(-50);
    const _0x5e28c6 = _0x1ebd0a.patchTask(_0x31c029, {
      roomHints: _0x200a58
    });
    if (_0x5e28c6) {
      _0x396135(_0x31c029, {
        type: "task-updated",
        task: _0x5e28c6
      });
    }
    return _0x5e28c6;
  }
  function _0x2ea3e5(_0x9c139c = null) {
    if (_0x9c139c != null && _0x9c139c !== "") {
      return (_0x1362f9.get(_0x9c139c) || []).map(_0x4991f9 => ({
        ..._0x4991f9
      }));
    }
    const _0x463a06 = {};
    for (const [_0x26d743, _0x433e04] of _0x1362f9.entries()) {
      _0x463a06[_0x26d743] = _0x433e04.map(_0x5da8ff => ({
        ..._0x5da8ff
      }));
    }
    return _0x463a06;
  }
  function _0x5db3ad(_0x1772b4 = null) {
    if (_0x1772b4 != null && _0x1772b4 !== "") {
      return _0x1362f9.delete(_0x1772b4);
    }
    const _0x2c2109 = _0x1362f9.size > 0;
    _0x1362f9.clear();
    return _0x2c2109;
  }
  function _0x28927d(_0x4f2aac) {
    return String(_0x4f2aac || "").split(/[\n,，、;；]+/).map(_0x547147 => _0x547147.trim()).filter(Boolean);
  }
  function _0x28ca8e(_0x3d932a = {}) {
    const _0x4b4f70 = new Set(["user", "following", "mutual", "live", "video_search", "video_recommend", "video_like", "video_specific", "author_profile"]);
    const _0x323c13 = new Set(["comments", "video", "author"]);
    const _0x2d083b = new Set(["enter", "like", "follow", "comment", "interaction", "gift"]);
    const _0x4de87f = [..._0x2d083b];
    const _0x41218b = Array.isArray(_0x3d932a.sourceTypes) ? [...new Set(_0x3d932a.sourceTypes.filter(_0x4bb8c5 => _0x4b4f70.has(_0x4bb8c5)))] : [];
    const _0x2b18c8 = _0x41218b.length ? [_0x41218b[0]] : ["video_search"];
    const _0x1af6b7 = _0x2b18c8[0];
    const _0x425839 = ["video_search", "video_recommend", "video_like", "video_specific", "author_profile"].includes(_0x1af6b7);
    let _0x288035 = Array.isArray(_0x3d932a.scrapeTargets) ? [...new Set(_0x3d932a.scrapeTargets.filter(_0x4722cb => _0x323c13.has(_0x4722cb)))] : [];
    if (_0x1af6b7 === "video_specific") {
      _0x288035 = ["comments"];
    } else if (_0x1af6b7 === "author_profile") {
      const _0xb0e519 = new Set(["comments", "video"]);
      _0x288035 = _0x288035.filter(_0x19499e => _0xb0e519.has(_0x19499e));
      if (!_0x288035.length) {
        _0x288035 = ["comments", "video"];
      }
    } else if (_0x425839 && !_0x288035.length) {
      _0x288035 = ["comments", "video", "author"];
    }
    if (!_0x425839) {
      _0x288035 = [];
    }
    const _0x1b1ce1 = Array.isArray(_0x3d932a.liveEventTypes) ? [...new Set(_0x3d932a.liveEventTypes.filter(_0x5cdd12 => _0x2d083b.has(_0x5cdd12)))] : _0x4de87f;
    const _0xabec34 = Number(_0x3d932a.maxCollect);
    let _0x2950cd = 0;
    if (_0x1af6b7 === "video_recommend") {
      _0x2950cd = Number.isFinite(_0xabec34) && _0xabec34 > 0 ? Math.min(20000, Math.floor(_0xabec34)) : 100;
    } else {
      _0x2950cd = Number.isFinite(_0xabec34) && _0xabec34 > 0 ? Math.min(20000, Math.floor(_0xabec34)) : 0;
    }
    const _0x277369 = new Set(["0", "1", "2", "3", "4", "5"]);
    const _0x12aa00 = new Set(["0", "1", "2", "3"]);
    const _0xea10f1 = String(_0x3d932a.userFanCount == null ? "0" : _0x3d932a.userFanCount);
    const _0x1b3ce1 = String(_0x3d932a.userTypeFilter == null ? "0" : _0x3d932a.userTypeFilter);
    const _0x5d2458 = parseEntityLiveUrls(Array.isArray(_0x3d932a.liveUrls) ? _0x3d932a.liveUrls.join("\n") : _0x3d932a.liveUrls);
    const _0x13cec5 = String(_0x3d932a.specifiedUrls || "").trim();
    const _0x2bb287 = String(_0x3d932a.bloggerProfileUrls || "").trim();
    const _0x2979d9 = normalizeBloggerWorkSelectMode(_0x3d932a.bloggerWorkSelectMode);
    const _0x4820ff = normalizeBloggerWorkCount(_0x3d932a.bloggerWorkCount);
    const _0x56823c = normalizeBloggerPublishWithinDays(_0x3d932a.bloggerPublishWithinDays);
    const _0x471444 = _0x3d932a.bloggerExcludePinned !== false;
    const _0x248794 = (_0x304a17, _0x362a14, _0x5383fe = "0") => {
      const _0x49875b = String(_0x304a17 == null ? _0x5383fe : _0x304a17);
      if (_0x362a14.has(_0x49875b)) {
        return _0x49875b;
      } else {
        return _0x5383fe;
      }
    };
    const _0x5786ec = _0x1bd4f6 => {
      const _0xe7a75f = Number(_0x1bd4f6);
      if (!Number.isFinite(_0xe7a75f) || _0xe7a75f <= 0) {
        return 0;
      }
      return Math.floor(_0xe7a75f);
    };
    const _0x579408 = Number(_0x3d932a.liveDurationSeconds);
    const _0x507ad7 = Number.isFinite(_0x579408) && _0x579408 >= 0 ? Math.min(10080, Math.max(0, Math.round(_0x579408 / 60))) * 60 : 180;
    const _0x4e310d = normalizeLiveConcurrency(_0x3d932a.liveConcurrency, LIVE_CONCURRENCY_DEFAULT);
    const _0x5741a8 = new Set(["all", "1d", "3d", "1w", "1mo", "custom"]);
    let _0x1e4434 = String(_0x3d932a.commentTimePreset || "").trim();
    const _0x3bc5d2 = {
      all: 0,
      "1d": 1440,
      "3d": 4320,
      "1w": 10080,
      "1mo": 43200
    };
    const _0x46ba2b = Number(_0x3d932a.commentWindowMinutes);
    let _0x432a3e = Number.isFinite(_0x46ba2b) && _0x46ba2b > 0 ? Math.min(43200, Math.floor(_0x46ba2b)) : 0;
    if (!_0x5741a8.has(_0x1e4434)) {
      if (_0x432a3e <= 0) {
        _0x1e4434 = "all";
      } else {
        const _0x33c56a = Object.entries(_0x3bc5d2).find(([, _0x51c67]) => _0x51c67 === _0x432a3e);
        _0x1e4434 = _0x33c56a ? _0x33c56a[0] : "custom";
      }
    }
    if (_0x1e4434 !== "custom" && Object.prototype.hasOwnProperty.call(_0x3bc5d2, _0x1e4434)) {
      _0x432a3e = _0x3bc5d2[_0x1e4434];
    }
    const _0x33ad6d = _0x3d932a.commentLocationFilterMode === "exclude" ? "exclude" : "include";
    const _0x16e2ac = Array.isArray(_0x3d932a.commentLocationFilterRegions) ? _0x3d932a.commentLocationFilterRegions.map(_0x5a5904 => String(_0x5a5904 || "").trim()).filter(Boolean) : String(_0x3d932a.commentLocationFilterRegions || "").split(/[,，\n\r]+/).map(_0x5eccac => _0x5eccac.trim()).filter(Boolean);
    return {
      selectedAccounts: Array.isArray(_0x3d932a.selectedAccounts) ? _0x3d932a.selectedAccounts.map(String) : [],
      sourceTypes: _0x2b18c8,
      scrapeTargets: _0x288035,
      keywords: Array.isArray(_0x3d932a.keywords) ? _0x3d932a.keywords.map(_0x44fc6e => String(_0x44fc6e || "").trim()).filter(Boolean) : _0x28927d(_0x3d932a.keywords),
      specifiedUrls: _0x13cec5,
      bloggerProfileUrls: _0x2bb287,
      bloggerWorkSelectMode: _0x2979d9,
      bloggerWorkCount: _0x4820ff,
      bloggerPublishWithinDays: _0x56823c,
      bloggerExcludePinned: _0x471444,
      liveUrls: _0x5d2458,
      liveEventTypes: _0x1b1ce1,
      liveDurationSeconds: _0x507ad7,
      liveConcurrency: _0x4e310d,
      userFanCount: _0x277369.has(_0xea10f1) ? _0xea10f1 : "0",
      userTypeFilter: _0x12aa00.has(_0x1b3ce1) ? _0x1b3ce1 : "0",
      maxCollect: _0x2950cd,
      searchSort: _0x248794(_0x3d932a.searchSort, new Set(["0", "1", "2"])),
      searchPublishTime: _0x248794(_0x3d932a.searchPublishTime, new Set(["0", "1", "2", "3"])),
      searchDuration: _0x248794(_0x3d932a.searchDuration, new Set(["0", "1", "2", "3"])),
      searchScope: _0x248794(_0x3d932a.searchScope, new Set(["0", "1", "2", "3"])),
      searchFormat: _0x248794(_0x3d932a.searchFormat, new Set(["0", "1", "2"])),
      excludeTitleKeywords: String(_0x3d932a.excludeTitleKeywords || ""),
      includeTitleKeywords: String(_0x3d932a.includeTitleKeywords || ""),
      excludeAuthorAccounts: String(_0x3d932a.excludeAuthorAccounts || ""),
      videoPublishWithinDays: _0x5786ec(_0x3d932a.videoPublishWithinDays),
      localVideoDuration: _0x248794(_0x3d932a.localVideoDuration, new Set(["0", "1", "2", "3"])),
      minVideoLike: _0x5786ec(_0x3d932a.minVideoLike),
      minVideoComment: _0x5786ec(_0x3d932a.minVideoComment),
      minVideoCollect: _0x5786ec(_0x3d932a.minVideoCollect),
      minVideoShare: _0x5786ec(_0x3d932a.minVideoShare),
      commentTimePreset: _0x1e4434,
      commentWindowMinutes: _0x432a3e,
      commentLocationFilterMode: _0x33ad6d,
      commentLocationFilterRegions: _0x16e2ac,
      commentIncludeKeywords: String(_0x3d932a.commentIncludeKeywords || ""),
      commentExcludeKeywords: String(_0x3d932a.commentExcludeKeywords || "")
    };
  }
  function _0x3c2c48(_0x51ec93, _0x51f5c0) {
    return Array.isArray(_0x51ec93?.scrapeTargets) && _0x51ec93.scrapeTargets.includes(_0x51f5c0);
  }
  function _0x4bfbda(_0x19cfb8 = {}) {
    if (isEntityRelationAuthorSource(_0x19cfb8.sourceType, _0x19cfb8.entrySource)) {
      return false;
    }
    const _0x237cb7 = String(_0x19cfb8.sourceType || "").trim();
    if (_0x237cb7 === "video" || _0x237cb7.startsWith("video_") || _0x237cb7 === "author_profile") {
      return true;
    }
    if (String(_0x19cfb8.identityType || "") === "video") {
      return true;
    }
    if (String(_0x19cfb8.leadKind || "") === "video_card") {
      return true;
    }
    if (/^video:\d{10,}$/.test(String(_0x19cfb8.userKey || _0x19cfb8.leadId || _0x19cfb8.key || "").trim())) {
      return true;
    }
    const _0x3998ad = Array.isArray(_0x19cfb8.collectedFields) ? _0x19cfb8.collectedFields : [];
    return _0x3998ad.includes("video") || _0x3998ad.includes("author");
  }
  function _0x3ba01a(_0x3de88c, _0x408592) {
    const _0x12a097 = _0x3c2c48(_0x408592, "video");
    const _0x1a016b = _0x3c2c48(_0x408592, "author");
    if (!_0x12a097 && !_0x1a016b) {
      return _0x3de88c;
    }
    return (Array.isArray(_0x3de88c) ? _0x3de88c : []).map(_0xa8e277 => {
      const _0x179855 = String(_0xa8e277.authorProfileUrl || "").trim() || (/\/user\//i.test(String(_0xa8e277.userUrl || "")) && !/\/(?:video|note)\//i.test(String(_0xa8e277.userUrl || "")) ? String(_0xa8e277.userUrl || "").trim() : "");
      const _0x38bcb3 = String(_0xa8e277.authorNickname || "").trim().replace(/^@+/, "");
      const _0x51c941 = [];
      if (_0x12a097) {
        _0x51c941.push("video");
      }
      if (_0x1a016b && _0x179855 && !/\/(?:video|note)\//i.test(_0x179855)) {
        _0x51c941.push("author");
      }
      const _0x123519 = getEntityEntryMeta(_0xa8e277.sourceType || "video");
      return {
        ..._0xa8e277,
        authorProfileUrl: _0x179855,
        authorNickname: _0x38bcb3 || (_0x51c941.includes("author") ? "未知作者" : ""),
        collectedFields: _0x51c941,
        sourceType: "video",
        identityType: "video",
        entrySource: _0xa8e277.entrySource || _0x123519.entrySource,
        entryLabel: _0xa8e277.entryLabel || _0x123519.entryLabel
      };
    }).filter(_0x569aa8 => Array.isArray(_0x569aa8.collectedFields) && _0x569aa8.collectedFields.length > 0);
  }
  function _0x5c2229(_0x2c518b) {
    return String(_0x2c518b || "").split(/[,，、;；\n\r]+/).map(_0x542fdf => _0x542fdf.trim()).filter(Boolean);
  }
  function _0x4c8c61(_0x44e7ff, _0x139125 = {}) {
    const _0x57c112 = _0x5c2229(_0x139125.excludeTitleKeywords).map(_0x5b1e0c => _0x5b1e0c.toLowerCase());
    const _0x58b4d2 = _0x5c2229(_0x139125.includeTitleKeywords).map(_0x1c634e => _0x1c634e.toLowerCase());
    const _0x9447ea = new Set(_0x5c2229(_0x139125.excludeAuthorAccounts).map(_0x4cd8f8 => _0x4cd8f8.replace(/^@+/, "").toLowerCase()));
    const _0x4529f4 = Number(_0x139125.minVideoLike) || 0;
    const _0x1b156f = Number(_0x139125.minVideoComment) || 0;
    const _0x500e21 = Number(_0x139125.minVideoCollect) || 0;
    const _0x1f9f28 = Number(_0x139125.minVideoShare) || 0;
    const _0x1f5fe4 = String(Array.isArray(_0x139125.sourceTypes) && _0x139125.sourceTypes[0] || _0x139125.sourceType || "");
    const _0x1cb4ac = _0x1f5fe4 !== "video_search";
    const _0x111817 = _0x1cb4ac ? Number(_0x139125.videoPublishWithinDays) || 0 : 0;
    const _0x36c74c = _0x1cb4ac ? String(_0x139125.localVideoDuration || "0") : "0";
    const _0x4adad0 = Date.now();
    const _0x85156 = (Array.isArray(_0x44e7ff) ? _0x44e7ff : []).map(_0x55fd91 => _0x1f5fe4 === "video_search" ? enrichVideoPublishTime(_0x55fd91, _0x4adad0) : _0x55fd91);
    return _0x85156.filter(_0x47f992 => {
      const _0x466df8 = String(_0x47f992.title || _0x47f992.nickname || "").toLowerCase();
      if (_0x57c112.length && _0x57c112.some(_0x532c5e => _0x466df8.includes(_0x532c5e))) {
        return false;
      }
      if (_0x58b4d2.length && !_0x58b4d2.some(_0x3d0640 => _0x466df8.includes(_0x3d0640))) {
        return false;
      }
      const _0x16b08d = String(_0x47f992.authorNickname || _0x47f992.nickname || "").replace(/^@+/, "").toLowerCase();
      if (_0x16b08d && _0x9447ea.has(_0x16b08d)) {
        return false;
      }
      const _0x26c8dc = Number(_0x47f992.likeCount || _0x47f992.diggCount || 0);
      const _0x1b6461 = Number(_0x47f992.commentCount || 0);
      const _0xa677c6 = Number(_0x47f992.collectCount || 0);
      const _0x1e1e02 = Number(_0x47f992.shareCount || 0);
      if (_0x4529f4 > 0 && _0x26c8dc < _0x4529f4) {
        return false;
      }
      if (_0x1b156f > 0 && _0x1b6461 < _0x1b156f) {
        return false;
      }
      if (_0x500e21 > 0 && _0xa677c6 < _0x500e21) {
        return false;
      }
      if (_0x1f9f28 > 0 && _0x1e1e02 < _0x1f9f28) {
        return false;
      }
      if (_0x111817 > 0) {
        const _0x15da00 = Number(_0x47f992.createTime || _0x47f992.publishTime || _0x47f992.eventTimestamp || 0);
        const _0x5766d6 = _0x15da00 > 1000000000000 ? _0x15da00 : _0x15da00 > 1000000000 ? _0x15da00 * 1000 : 0;
        if (_0x5766d6 > 0 && _0x4adad0 - _0x5766d6 > _0x111817 * 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      const _0x58e6cc = Number(_0x47f992.duration || _0x47f992.videoDuration || 0);
      if (_0x36c74c !== "0" && _0x58e6cc > 0) {
        if (_0x36c74c === "1" && _0x58e6cc >= 60) {
          return false;
        }
        if (_0x36c74c === "2" && (_0x58e6cc < 60 || _0x58e6cc > 300)) {
          return false;
        }
        if (_0x36c74c === "3" && _0x58e6cc <= 300) {
          return false;
        }
      }
      return true;
    });
  }
  function _0x5309f1(_0x58958d = {}, _0x65a9dc = null) {
    const _0x3c7452 = new Set(Array.isArray(_0x65a9dc) ? _0x65a9dc : ["enter", "like", "follow", "comment", "interaction", "gift"]);
    const _0x15da1e = Array.isArray(_0x58958d.liveEvents) ? _0x58958d.liveEvents : _0x58958d.liveEvent ? [_0x58958d.liveEvent] : [];
    const _0xb34ca5 = _0x15da1e.filter(_0x79d87c => _0x3c7452.has(resolveLiveEventCategory(_0x79d87c)));
    if (!_0xb34ca5.length) {
      return null;
    }
    const _0x285f50 = _0xb34ca5[_0xb34ca5.length - 1];
    return {
      ..._0x58958d,
      content: _0x285f50.content || _0x58958d.content || "",
      liveEvent: _0x285f50,
      liveEvents: _0xb34ca5,
      messageId: _0x285f50.messageId || _0x58958d.messageId || "",
      eventTimestamp: _0x285f50.occurredAt || _0x58958d.eventTimestamp || 0
    };
  }
  function _0x48363(_0x5d9a42) {
    if (!_0x5d9a42 || typeof _0x5d9a42 !== "string") {
      return false;
    }
    const _0x398aea = _0x5d9a42.trim();
    if (_0x398aea.length < 15) {
      return false;
    }
    if (["self", "login", "anonymous", "undefined", "null"].includes(_0x398aea.toLowerCase())) {
      return false;
    }
    if (_0x398aea.startsWith("name:") || _0x398aea.startsWith("live_")) {
      return false;
    }
    return /^[A-Za-z0-9_\-]+$/.test(_0x398aea);
  }
  function _0x27bca1(_0x2eb6dd) {
    const _0x25a92b = String(_0x2eb6dd || "").trim();
    return /^\d{5,24}$/.test(_0x25a92b) && !/^0+$/.test(_0x25a92b) && _0x25a92b !== "111111";
  }
  function _0x9edf83(_0x49c09f) {
    const _0x1cf498 = String(_0x49c09f || "").trim();
    return _0x1cf498.length >= 15 && _0x1cf498 !== "111111" && /^[A-Za-z0-9_\-]+$/.test(_0x1cf498);
  }
  function _0x7d3fb2(_0x54e18f = {}) {
    const _0x56face = String(_0x54e18f.userKey || "").trim();
    if (/^video:\d{10,}$/.test(_0x56face)) {
      return _0x56face;
    }
    const _0x3ba2e4 = String(_0x54e18f.sourceType || "").trim();
    const _0x1cadd6 = _0x3ba2e4 === "video" || _0x3ba2e4.startsWith("video_") || String(_0x54e18f.identityType || "") === "video" || _0x56face.startsWith("video:");
    const _0x2f09e1 = /douyin\.com\/(?:video|note)\//i.test(String(_0x54e18f.userUrl || ""));
    if (_0x1cadd6 || _0x2f09e1) {
      const _0x2fb330 = extractDouyinVideoId(_0x54e18f.userUrl || "") || extractDouyinVideoId(_0x54e18f.videoUrl || "") || extractDouyinVideoId(_0x54e18f.content || "") || (_0x56face.startsWith("video:") ? _0x56face.slice(6) : "");
      if (_0x2fb330) {
        return "video:" + _0x2fb330;
      }
    }
    const _0x3d3977 = String(_0x54e18f.secUid || _0x54e18f.sec_uid || "").trim();
    if (_0x48363(_0x3d3977)) {
      return _0x3d3977;
    }
    const _0x3db751 = String(_0x54e18f.webcastUid || _0x54e18f.webcast_uid || _0x54e18f.webcast_uid_str || "").trim();
    if (_0x9edf83(_0x3db751)) {
      return "webcast:" + _0x3db751;
    }
    const _0x5d0ac5 = leadUserKey.getLeadUserKey({
      userUrl: _0x54e18f.userUrl
    });
    if (_0x5d0ac5) {
      return _0x5d0ac5;
    }
    const _0xfd270f = String(_0x54e18f.uid || _0x54e18f.id_str || _0x54e18f.idStr || _0x54e18f.user_id || "").trim();
    if (_0x27bca1(_0xfd270f)) {
      return "uid:" + _0xfd270f;
    }
    if (_0x48363(_0x56face) || /^uid:\d{5,24}$/.test(_0x56face) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(_0x56face)) {
      return _0x56face;
    }
    const _0x6346c8 = String(_0x54e18f.nickname || "").trim();
    if (_0x6346c8) {
      return "name:" + _0x6346c8;
    } else {
      return "";
    }
  }
  function _0x37ab25(_0x305487 = {}) {
    const _0x4f0571 = {
      ..._0x305487
    };
    let _0x1ff324 = String(_0x4f0571.userUrl || _0x4f0571.content || "").trim();
    if (_0x4bfbda(_0x4f0571)) {
      const _0x294228 = extractDouyinVideoId(_0x4f0571.videoUrl || "") || extractDouyinVideoId(_0x1ff324) || extractDouyinVideoId(_0x4f0571.content || "") || (String(_0x4f0571.userKey || "").startsWith("video:") ? String(_0x4f0571.userKey).slice(6) : "");
      if (_0x294228) {
        const _0x3b280d = "https://www.douyin.com/video/" + _0x294228;
        const _0x19695e = String(_0x4f0571.authorProfileUrl || "").trim() || (/\/user\//i.test(String(_0x4f0571.userUrl || "")) && !/\/(?:video|note)\//i.test(String(_0x4f0571.userUrl || "")) ? String(_0x4f0571.userUrl || "").trim() : "");
        const _0x57ffb8 = String(_0x4f0571.authorNickname || "").trim().replace(/^@+/, "");
        const _0x59730b = getEntityEntryMeta(_0x4f0571.sourceType || "video");
        _0x4f0571.videoUrl = _0x3b280d;
        _0x4f0571.userUrl = _0x3b280d;
        _0x4f0571.userKey = "video:" + _0x294228;
        _0x4f0571.content = _0x3b280d;
        _0x4f0571.title = String(_0x4f0571.title || _0x4f0571.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
        _0x4f0571.nickname = _0x4f0571.title;
        _0x4f0571.authorProfileUrl = _0x19695e;
        _0x4f0571.authorNickname = _0x57ffb8;
        _0x4f0571.secUid = "";
        _0x4f0571.uid = "";
        _0x4f0571.webcastUid = "";
        _0x4f0571.identityType = "video";
        _0x4f0571.sourceType = "video";
        _0x4f0571.entrySource = _0x4f0571.entrySource || _0x59730b.entrySource;
        _0x4f0571.entryLabel = _0x4f0571.entryLabel || _0x59730b.entryLabel;
        _0x4f0571.profileAvailable = false;
        _0x4f0571.profileUnavailable = true;
        _0x4f0571.profileUnavailableReason = "视频作品链接";
        return _0x4f0571;
      }
    }
    const _0x2cafa1 = String(_0x4f0571.secUid || _0x4f0571.sec_uid || "").trim();
    const _0x485675 = String(_0x4f0571.webcastUid || _0x4f0571.webcast_uid || _0x4f0571.webcast_uid_str || "").trim();
    const _0xd44149 = leadUserKey.extractUserKeyFromUrl(_0x1ff324);
    const _0x2bcb1d = _0x48363(_0x2cafa1) ? _0x2cafa1 : !_0x485675 && _0x48363(_0xd44149) ? _0xd44149 : "";
    const _0x3f6f56 = String(_0x4f0571.uid || _0x4f0571.id_str || _0x4f0571.idStr || _0x4f0571.user_id || "").trim();
    const _0x2d397a = _0x27bca1(_0x3f6f56) ? _0x3f6f56 : "";
    const _0x274bb3 = !_0x2d397a && !_0x2bcb1d && _0x9edf83(_0x485675) ? _0x485675 : "";
    if (_0x2bcb1d) {
      _0x1ff324 = "https://www.douyin.com/user/" + _0x2bcb1d;
      _0x4f0571.secUid = _0x2bcb1d;
    } else {
      _0x4f0571.secUid = "";
      if (!/\/user\//i.test(_0x1ff324) || /\/(?:video|note)\//i.test(_0x1ff324)) {
        _0x1ff324 = "";
      }
    }
    _0x4f0571.uid = _0x2d397a;
    _0x4f0571.webcastUid = _0x274bb3;
    _0x4f0571.userUrl = _0x1ff324;
    _0x4f0571.userKey = _0x7d3fb2(_0x4f0571);
    _0x4f0571.nickname = String(_0x4f0571.nickname || "").trim().replace(/^@+/, "");
    _0x4f0571.identityType = _0x2bcb1d ? "profile" : _0x274bb3 ? "webcast" : "numeric";
    _0x4f0571.profileAvailable = !!_0x2bcb1d;
    _0x4f0571.profileUnavailable = !_0x2bcb1d;
    _0x4f0571.profileUnavailableReason = _0x2bcb1d ? "" : String(_0x4f0571.profileUnavailableReason || (_0x274bb3 ? "主播设置不支持查看他人资料" : "实时消息未提供主页标识"));
    _0x4f0571.liveEvents = Array.isArray(_0x4f0571.liveEvents) ? _0x4f0571.liveEvents.filter(_0x1c241d => _0x1c241d && typeof _0x1c241d === "object") : _0x4f0571.liveEvent ? [_0x4f0571.liveEvent] : [];
    return _0x4f0571;
  }
  function _0xfbaad0() {
    try {
      if (typeof _0x24d0c1 === "function") {
        const _0x616be2 = _0x24d0c1();
        return new Set(Array.isArray(_0x616be2) ? _0x616be2.map(String).filter(Boolean) : []);
      }
    } catch (_0x40cd6c) {}
    return new Set();
  }
  function _0x43b82a() {
    try {
      if (typeof _0x3a8ec1 === "function") {
        const _0x5aae36 = _0x3a8ec1();
        return new Set(Array.isArray(_0x5aae36) ? _0x5aae36.map(String).filter(Boolean) : []);
      }
    } catch (_0x555faf) {}
    return new Set();
  }
  function _0x2f7dbf(_0x20e270) {
    if (isEntityRelationAuthorSource(_0x20e270)) {
      return _0x43b82a();
    }
    return _0xfbaad0();
  }
  async function _0xdfab78(_0x3af6b6, _0x39b4fe, {
    guest = false,
    platform = "douyin"
  } = {}) {
    const {
      facade: _0x2c8f74,
      viewKey: _0x4732fe
    } = await _0x5c36b6.createEntityAccountHost(_0x3af6b6, _0x39b4fe, {
      guest: guest || isAnonymousEntityAccountId(_0x3af6b6),
      platform: platform || "douyin"
    });
    _0x2c8f74.__radarEntityViewKey = _0x4732fe;
    try {
      const _0x28267a = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
      _0x28267a?.set?.(_0x4732fe, {
        taskId: "entity-host:" + _0x3af6b6,
        accountId: String(_0x3af6b6),
        platform: platform || "douyin",
        taskMode: "entity_leadgen",
        entityLeadgen: true
      });
    } catch (_0x584965) {}
    _0x2c8f74.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(_0x2c8f74.webContents);
      _0x5dc34d(_0x2c8f74);
      try {
        nudgeAutomationViewRepaint?.(_0x2c8f74.webContents, getPlatformViews?.()?.get?.(_0x4732fe));
      } catch (_0x23123c) {}
    });
    _0x2c8f74.webContents.on("did-finish-load", () => {
      _0x5dc34d(_0x2c8f74);
      try {
        nudgeAutomationViewRepaint?.(_0x2c8f74.webContents, getPlatformViews?.()?.get?.(_0x4732fe));
      } catch (_0x41e589) {}
      try {
        requestAutomationLayoutRefresh?.();
      } catch (_0x2303d1) {}
    });
    _0x2c8f74.webContents.on("render-process-gone", () => {
      _0x2c8f74.__radarEntityUnhealthy = true;
    });
    _0x2c8f74.webContents.on("unresponsive", () => {
      _0x2c8f74.__radarEntityUnhealthy = true;
    });
    _0x2c8f74.webContents.on("responsive", () => {
      _0x2c8f74.__radarEntityUnhealthy = false;
    });
    try {
      ensureAutomationPaintWatchdog?.();
    } catch (_0x2f4ea6) {}
    _0x2c8f74.__radarEntityNetworkCapture = createEntityLeadgenNetworkCapture(_0x2c8f74);
    return _0x2c8f74;
  }
  function _0x4b30e6(_0x211c9d, _0x8824b2, _0x471b93 = "") {
    if (!_0x211c9d || _0x211c9d.isDestroyed?.()) {
      return false;
    }
    const _0x2698a9 = String(_0x211c9d.__radarEntityViewKey || "").trim();
    const _0x2dc936 = _0x2698a9 && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x2698a9) : null;
    if (!_0x2dc936 || _0x2dc936.webContents?.isDestroyed?.()) {
      return false;
    }
    _0x5dc34d(_0x211c9d);
    const _0x490d74 = automationLiveViewLifecycle?.beginTask?.(_0x2698a9, {
      taskId: String(_0x471b93 || "entity-host:" + _0x8824b2),
      runtimeTaskId: String(_0x471b93 || ""),
      accountId: String(_0x8824b2),
      taskMode: "entity_leadgen",
      entityLeadgen: true
    });
    return _0x490d74?.ok === true;
  }
  async function _0x3ca1a0(_0x19a067, _0x507a1b, _0x503480 = "") {
    if (!_0x19a067 || _0x19a067.isDestroyed?.()) {
      return {
        ok: false,
        reason: "window_unavailable"
      };
    }
    const _0x1e40ee = String(_0x19a067.__radarEntityViewKey || "").trim();
    const _0x164e8c = _0x1e40ee && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x1e40ee) : null;
    if (!_0x164e8c || _0x164e8c.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable"
      };
    }
    const _0x298154 = await automationLiveViewLifecycle?.acquireExecutionViewport?.(_0x1e40ee, {
      runtimeTaskId: String(_0x507a1b || "")
    });
    if (_0x298154?.ok === false) {
      return _0x298154;
    }
    _0x19a067.__radarEntityExecutionViewportGeneration = _0x298154?.generation ?? null;
    if (_0x5dd514(_0x19a067)) {
      try {
        const _0x321b2e = _0x164e8c.getBounds?.() || {};
        const _0xbdb88 = Math.max(1, Number(_0x321b2e.width) || 1);
        const _0x5ddc78 = Math.max(1, Number(_0x321b2e.height) || 1);
        const _0x43083e = Math.max(0.25, Math.min(1, _0xbdb88 / 1200, _0x5ddc78 / 800));
        _0x164e8c.webContents.setZoomFactor?.(_0x43083e);
      } catch (_0x439bac) {}
    }
    await sleep(180);
    let _0x148d5a = null;
    try {
      _0x148d5a = await withTimeout(_0x164e8c.webContents.executeJavaScript("({\n          innerWidth: window.innerWidth || 0,\n          innerHeight: window.innerHeight || 0,\n          scrollHeight: Math.max(document.documentElement?.scrollHeight || 0, document.body?.scrollHeight || 0),\n          visibility: String(document.visibilityState || '')\n        })", true), 2500, "entity_execution_viewport_probe_timeout");
    } catch (_0x3bbcda) {}
    if (_0x148d5a && (Number(_0x148d5a.innerWidth) < 1000 || Number(_0x148d5a.innerHeight) < 650)) {
      _0x9d21b4(_0x507a1b, "[" + (_0x503480 || "采集账号") + "] 执行视口偏小 " + _0x148d5a.innerWidth + "×" + _0x148d5a.innerHeight + "，已保持桌面缩放继续运行", "warning");
    }
    return {
      ok: true,
      ..._0x298154,
      viewport: _0x148d5a
    };
  }
  function _0x14e7cd(_0x2fa41d) {
    if (!_0x2fa41d) {
      return;
    }
    const _0x1f086a = String(_0x2fa41d.__radarEntityViewKey || "").trim();
    if (!_0x1f086a) {
      return;
    }
    const _0xf45701 = _0x2fa41d.__radarEntityExecutionViewportGeneration;
    _0x2fa41d.__radarEntityExecutionViewportGeneration = null;
    try {
      automationLiveViewLifecycle?.releaseExecutionViewport?.(_0x1f086a, {
        generation: _0xf45701
      });
    } catch (_0x41591f) {}
  }
  async function _0x533ade(_0x3371bf, _0x5e5218, {
    platform = "douyin",
    runtimeTaskId = ""
  } = {}) {
    const _0xafa176 = String(_0x3371bf);
    const _0x31833b = isAnonymousEntityAccountId(_0xafa176);
    let _0x4fa331 = _0x31c2d3.get(_0xafa176);
    if (_0x4fa331 && !_0x4fa331.isDestroyed() && !_0x4fa331.__radarEntityUnhealthy) {
      const _0x4054cf = String(_0x4fa331.__radarEntityViewKey || "").trim();
      const _0x7ff21e = _0x4054cf && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x4054cf) : null;
      if (_0x7ff21e?.webContents === _0x4fa331.webContents && !_0x7ff21e.webContents?.isDestroyed?.()) {
        const _0x2ed428 = typeof getViewSettingsMap === "function" ? getViewSettingsMap()?.get?.(_0x4054cf) : null;
        const _0x5b542a = !!runtimeTaskId && !_0x2ed428?.finishedAt && String(_0x2ed428?.runtimeTaskId || "") === String(runtimeTaskId);
        if (_0x5b542a) {
          _0x4b30e6(_0x4fa331, _0x3371bf, runtimeTaskId);
          return _0x4fa331;
        }
        try {
          cancelPendingAutomationViewDestroy?.(_0x4054cf);
        } catch (_0x340198) {}
      }
      try {
        _0x4fa331.destroy?.();
      } catch (_0xf3a307) {}
      _0x31c2d3.delete(_0xafa176);
      _0x4fa331 = null;
      await sleep(process.platform === "darwin" ? 1300 : 260);
    }
    if (_0x4fa331 && !_0x4fa331.isDestroyed()) {
      try {
        _0x4fa331.destroy?.();
      } catch (_0x159539) {}
      _0x31c2d3.delete(_0xafa176);
      _0x4fa331 = null;
      await sleep(process.platform === "darwin" ? 1300 : 260);
    }
    _0x4fa331 = await _0xdfab78(_0x3371bf, _0x5e5218, {
      guest: _0x31833b,
      platform: platform
    });
    _0x31c2d3.set(_0xafa176, _0x4fa331);
    _0x4fa331.on("closed", () => {
      try {
        _0x4fa331.__radarEntityNetworkCapture?.dispose?.();
      } catch (_0x590202) {}
      if (_0x31c2d3.get(_0xafa176) === _0x4fa331) {
        _0x31c2d3.delete(_0xafa176);
      }
    });
    try {
      _0x4fa331.setTitle(_0x31833b ? "线索采集（无账号游客）" : "线索采集 - " + _0x3371bf);
    } catch (_0x11a760) {}
    _0x4b30e6(_0x4fa331, _0x3371bf, runtimeTaskId);
    await _0x31a7f4(_0x4fa331.webContents);
    return _0x4fa331;
  }
  function _0x15119e() {
    const _0x106662 = new Set();
    for (const _0x18dc9f of _0x5ea9b0.values()) {
      if (_0x18dc9f?.windowKeys && _0x18dc9f.windowKeys.size) {
        for (const _0x29f8ad of _0x18dc9f.windowKeys) {
          if (_0x29f8ad) {
            _0x106662.add(String(_0x29f8ad));
          }
        }
      }
      const _0x1ed7fe = Array.isArray(_0x18dc9f?.accounts) ? _0x18dc9f.accounts : [];
      for (const _0x1444de of _0x1ed7fe) {
        const _0x4e4aa6 = String(_0x1444de?.id || "").trim();
        if (_0x4e4aa6) {
          _0x106662.add(_0x4e4aa6);
        }
      }
    }
    return _0x106662;
  }
  function _0x20dc44(_0x5e5a36 = null) {
    let _0x338eed;
    if (_0x5e5a36 != null && _0x5e5a36 !== "") {
      _0x338eed = [String(_0x5e5a36)];
    } else {
      const _0x200d15 = _0x15119e();
      _0x338eed = _0x200d15.size ? [..._0x200d15] : [];
    }
    const _0x44822b = [];
    const _0x3ef6e1 = new Set();
    _0x338eed.forEach(_0x833565 => {
      const _0x47cbcd = _0x31c2d3.get(String(_0x833565));
      if (!_0x47cbcd || _0x47cbcd.isDestroyed?.()) {
        return;
      }
      const _0x1df4e5 = _0x47cbcd.__radarEntityViewKey;
      if (!_0x1df4e5 || _0x3ef6e1.has(_0x1df4e5)) {
        return;
      }
      const _0x46661a = typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x1df4e5) : null;
      if (!_0x46661a || _0x46661a.webContents?.isDestroyed?.()) {
        return;
      }
      _0x3ef6e1.add(_0x1df4e5);
      _0x44822b.push(_0x1df4e5);
    });
    return _0x44822b;
  }
  function _0xd6004(_0x4d5ea9 = null) {
    const _0x58277e = _0x20dc44(_0x4d5ea9);
    if (!_0x58277e.length) {
      return {
        success: false,
        error: "暂无采集窗口可监控",
        shown: 0
      };
    }
    for (const _0x185168 of _0x58277e) {
      const _0xce7ec0 = [..._0x31c2d3.values()].find(_0x2709e7 => _0x2709e7?.__radarEntityViewKey === _0x185168);
      _0x5dc34d(_0xce7ec0);
    }
    _0x41183a = {
      viewKeys: _0x58277e,
      accountId: _0x4d5ea9 != null ? String(_0x4d5ea9) : null,
      at: Date.now()
    };
    try {
      if (_0x427b5e && !_0x427b5e.isDestroyed() && !_0x427b5e.webContents?.isDestroyed?.()) {
        _0x427b5e.webContents.send("entity-leadgen-open-live-preview", {
          viewKeys: _0x58277e,
          accountId: _0x4d5ea9 != null ? String(_0x4d5ea9) : null
        });
      }
    } catch (_0x14e7ff) {}
    return {
      success: true,
      shown: _0x58277e.length,
      viewKeys: _0x58277e,
      livePreview: true
    };
  }
  function _0x2d7f14(_0x3cb101 = null) {
    const _0x4099ad = _0x20dc44(_0x3cb101);
    _0x41183a = null;
    try {
      if (_0x427b5e && !_0x427b5e.isDestroyed() && !_0x427b5e.webContents?.isDestroyed?.()) {
        _0x427b5e.webContents.send("entity-leadgen-close-live-preview", {
          viewKeys: _0x4099ad,
          accountId: _0x3cb101 != null ? String(_0x3cb101) : null
        });
      }
    } catch (_0x37a98d) {}
    return {
      success: true,
      hidden: _0x4099ad.length,
      viewKeys: _0x4099ad,
      livePreview: true
    };
  }
  function _0x49db9b() {
    if (!_0x41183a) {
      return null;
    }
    const _0x506bb9 = {
      ..._0x41183a,
      viewKeys: Array.isArray(_0x41183a.viewKeys) ? [..._0x41183a.viewKeys] : []
    };
    _0x41183a = null;
    const _0x1caf5c = _0x506bb9.viewKeys.filter(_0x2c42f7 => {
      try {
        const _0x44637d = typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x2c42f7) : null;
        return !!_0x44637d && !_0x44637d.webContents?.isDestroyed?.();
      } catch (_0x1b447f) {
        return false;
      }
    });
    if (!_0x1caf5c.length) {
      return null;
    }
    return {
      ..._0x506bb9,
      viewKeys: _0x1caf5c
    };
  }
  function _0x4f28b9(_0x56a464) {
    const _0x4a31b9 = String(_0x56a464 || "");
    return /douyin\.com\/(?:video|note|jingxuan)\//i.test(_0x4a31b9) || /[?&#]modal_id=/i.test(_0x4a31b9);
  }
  function _0x76d548(_0x25dda2) {
    if (!_0x25dda2 || _0x25dda2.isDestroyed() || _0x25dda2.webContents.isDestroyed()) {
      return;
    }
    withTimeout(_0x25dda2.webContents.executeJavaScript("\n      (() => {\n        const pauseMedia = (media) => {\n          try {\n            media.muted = true;\n            media.autoplay = false;\n            media.loop = false;\n            if (typeof media.pause === 'function') media.pause();\n            media.preload = 'metadata';\n          } catch (_) {}\n        };\n        document.querySelectorAll('video, audio').forEach(pauseMedia);\n        if (!window.__radarEntityVideoMediaBlockerInstalled) {\n          window.__radarEntityVideoMediaBlockerInstalled = true;\n          document.addEventListener('play', (event) => {\n            if (window.__radarEntityAllowVideoPlay) return;\n            const media = event.target;\n            if (media && (media.tagName === 'VIDEO' || media.tagName === 'AUDIO')) {\n              pauseMedia(media);\n            }\n          }, true);\n        }\n        return true;\n      })()\n    ", true), EXEC_JS_TIMEOUT_MS, "entity_media_blocker_timeout").catch(() => {});
  }
  async function _0x250a37(_0x48aaa7, _0x48fb76) {
    if (!_0x48aaa7 || _0x48aaa7.isDestroyed?.() || _0x48aaa7.webContents?.isDestroyed?.()) {
      return false;
    }
    try {
      await withTimeout(_0x48aaa7.webContents.executeJavaScript("window.__radarEntityAllowVideoPlay = " + (_0x48fb76 ? "true" : "false") + "; true;", true), EXEC_JS_TIMEOUT_MS, "entity_allow_play_timeout");
      return true;
    } catch (_0x72cba1) {
      return false;
    }
  }
  async function _0x1c60ea(_0x295092) {
    if (!_0x295092 || _0x295092.isDestroyed?.() || _0x295092.webContents?.isDestroyed?.()) {
      return false;
    }
    await _0x250a37(_0x295092, false);
    _0x76d548(_0x295092);
    try {
      await withTimeout(_0x295092.webContents.executeJavaScript("\n          (() => {\n            document.querySelectorAll('video, audio').forEach((media) => {\n              try {\n                media.muted = true;\n                media.autoplay = false;\n                if (typeof media.pause === 'function') media.pause();\n              } catch (_) {}\n            });\n            return true;\n          })()\n        ", true), EXEC_JS_TIMEOUT_MS, "entity_publish_time_pause_timeout");
      return true;
    } catch (_0x2c67df) {
      return false;
    }
  }
  async function _0x4125dc(_0x337c24) {
    if (!_0x337c24 || _0x337c24.isDestroyed?.() || _0x337c24.webContents?.isDestroyed?.()) {
      return "";
    }
    try {
      const _0x4aedc4 = await withTimeout(_0x337c24.webContents.executeJavaScript(buildDouyinVideoCreateTimeWidgetReadExpression(), true), EXEC_JS_TIMEOUT_MS, "entity_create_time_widget_timeout");
      return String(_0x4aedc4 || "").trim();
    } catch (_0xe98a5e) {
      return "";
    }
  }
  function _0x4d8ab(_0x6bd895) {
    return String(_0x6bd895 || "").replace(/\s+/g, "").trim();
  }
  async function _0x460524(_0x46548f, {
    seenTexts = [],
    timeoutMs = 12000,
    taskId: _0x3078f5 = "",
    generation: _0x2bd676 = 0
  } = {}) {
    const _0x595dde = new Set((Array.isArray(seenTexts) ? seenTexts : []).map(_0x1967f6 => _0x4d8ab(_0x1967f6)).filter(Boolean));
    await _0x250a37(_0x46548f, true);
    let _0x3e1a0a = "";
    const _0x273f05 = Date.now();
    while (Date.now() - _0x273f05 < timeoutMs) {
      if (_0x3078f5 && !_0x4ec184(_0x3078f5, _0x2bd676)) {
        return {
          text: "",
          refreshed: false,
          cancelled: true
        };
      }
      const _0x27f2cf = await _0x4125dc(_0x46548f);
      const _0x36935a = _0x4d8ab(_0x27f2cf);
      if (_0x36935a && !_0x595dde.has(_0x36935a)) {
        if (_0x36935a === _0x3e1a0a) {
          return {
            text: _0x27f2cf,
            refreshed: true
          };
        }
        _0x3e1a0a = _0x36935a;
      } else {
        _0x3e1a0a = "";
      }
      await sleep(500);
    }
    return {
      text: _0x3e1a0a,
      refreshed: false
    };
  }
  async function _0x22f4bb(_0x4d5f67) {
    if (!_0x4d5f67 || _0x4d5f67.isDestroyed() || _0x4d5f67.webContents.isDestroyed()) {
      return;
    }
    try {
      _0x4d5f67.webContents.stop();
    } catch (_0x271e38) {}
    try {
      await withTimeout(_0x4d5f67.loadURL("about:blank"), BLANK_NAV_TIMEOUT_MS, "entity_blank_timeout");
    } catch (_0x12fef7) {
      try {
        _0x4d5f67.webContents.stop();
      } catch (_0x23aeba) {}
    }
    await sleep(280);
  }
  async function _0x44de06(_0x1d2c39, _0x5210b7) {
    if (!_0x1d2c39 || _0x1d2c39.isDestroyed()) {
      throw new Error("线索采集窗口已销毁");
    }
    _0x5dc34d(_0x1d2c39);
    const _0x267aae = () => {
      if (!_0x1d2c39 || _0x1d2c39.isDestroyed()) {
        return;
      }
      const _0x5f0462 = runtimeConfig?.getPlain?.()?.apiHooks || null;
      withTimeout(_0x1d2c39.webContents.executeJavaScript(getEntityLeadgenApiHookInstaller(_0x5f0462), true), EXEC_JS_TIMEOUT_MS, "entity_api_hook_timeout").catch(() => {});
      withTimeout(_0x1d2c39.webContents.executeJavaScript(getLeadgenScrapeApiHookInstaller(_0x5f0462), true), EXEC_JS_TIMEOUT_MS, "leadgen_scrape_api_hook_timeout").catch(() => {});
      if (/^https:\/\/live\.douyin\.com\//i.test(String(_0x5210b7 || ""))) {
        withTimeout(_0x1d2c39.webContents.executeJavaScript(getEntityLeadgenLiveHookInstaller(), true), EXEC_JS_TIMEOUT_MS, "entity_live_hook_timeout").catch(() => {});
      }
      if (_0x4f28b9(_0x5210b7)) {
        _0x76d548(_0x1d2c39);
      }
    };
    const _0x2cf08b = () => _0x267aae();
    const _0x1f4a7d = () => _0x267aae();
    try {
      _0x1d2c39.webContents.once("dom-ready", _0x2cf08b);
      _0x1d2c39.webContents.once("did-finish-load", _0x1f4a7d);
    } catch (_0x1f000b) {}
    let _0x23554e = null;
    try {
      await Promise.race([_0x1d2c39.loadURL(_0x5210b7), new Promise((_0xded2a3, _0x3defed) => {
        _0x23554e = setTimeout(() => {
          _0x3defed(Object.assign(new Error("页面加载超时"), {
            code: "entity_navigation_timeout"
          }));
        }, NAVIGATION_TIMEOUT_MS);
      })]);
    } catch (_0x474802) {
      if (_0x474802?.code === "entity_navigation_timeout") {
        try {
          _0x1d2c39.webContents.stop();
        } catch (_0x276326) {}
        throw _0x474802;
      }
      const _0x4d601e = String(_0x474802?.message || _0x474802 || "");
      if (!/ERR_ABORTED|\(-3\)/.test(_0x4d601e)) {
        throw _0x474802;
      }
      console.log("[EntityLeadgen] loadURL aborted（已忽略）: " + String(_0x5210b7 || "").slice(0, 120));
    } finally {
      if (_0x23554e) {
        clearTimeout(_0x23554e);
      }
      try {
        _0x1d2c39.webContents.removeListener("dom-ready", _0x2cf08b);
        _0x1d2c39.webContents.removeListener("did-finish-load", _0x1f4a7d);
      } catch (_0x351c2b) {}
    }
    _0x267aae();
    await _0x573728(_0x1d2c39);
    _0x267aae();
  }
  async function _0x573728(_0xf87e4a) {
    if (!_0xf87e4a || _0xf87e4a.isDestroyed()) {
      return;
    }
    const _0x2870cf = Date.now();
    await sleep(PAGE_SETTLE_MIN_MS);
    while (Date.now() - _0x2870cf < PAGE_SETTLE_MAX_MS) {
      if (!_0xf87e4a || _0xf87e4a.isDestroyed()) {
        return;
      }
      let _0x23da27 = false;
      try {
        _0x23da27 = await withTimeout(_0xf87e4a.webContents.executeJavaScript("(() => {\n              try {\n                if (document.readyState !== 'complete') return false;\n                const text = ((document.body && document.body.innerText) || '').trim();\n                return text.length > 60;\n              } catch (_) { return false; }\n            })()", true), EXEC_JS_TIMEOUT_MS, "entity_settle_js_timeout");
      } catch (_0x45f422) {
        _0x23da27 = false;
      }
      if (_0x23da27) {
        return;
      }
      await sleep(400);
    }
  }
  async function _0x1f6c38(_0x20cd70, _0x4865bd) {
    if (!_0x20cd70 || _0x20cd70.isDestroyed() || !_0x20cd70.__radarEntityGuest) {
      return;
    }
    if (_0x20cd70.__radarEntityGuestWarmed) {
      return;
    }
    _0x9d21b4(_0x4865bd, "正在准备无账号采集环境…", "info");
    try {
      await _0x44de06(_0x20cd70, "https://www.douyin.com/");
      await sleep(1800);
    } catch (_0x41f49e) {
      _0x9d21b4(_0x4865bd, "无账号采集环境准备未完成，将继续尝试", "warning");
    }
    _0x20cd70.__radarEntityGuestWarmed = true;
  }
  function _0x745e87(_0x12ae7a = []) {
    return (Array.isArray(_0x12ae7a) ? _0x12ae7a : []).map(_0x33ed53 => String(_0x33ed53?.id || _0x33ed53 || "").trim()).filter(Boolean);
  }
  function _0x3ea421(_0x2cfcef = null) {
    const _0x34506c = _0x2cfcef == null ? [..._0x31c2d3.keys()] : _0x745e87(_0x2cfcef);
    _0x34506c.forEach(_0x4e82c1 => {
      const _0x18db22 = _0x31c2d3.get(_0x4e82c1);
      if (!_0x18db22) {
        return;
      }
      _0x31c2d3.delete(_0x4e82c1);
      try {
        _0x18db22.__radarEntityNetworkCapture?.dispose?.();
      } catch (_0xb7e11d) {}
      try {
        const _0x4dac5c = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
        const _0x25e6b5 = _0x18db22.__radarEntityViewKey;
        if (_0x4dac5c && _0x25e6b5) {
          _0x4dac5c.delete(_0x25e6b5);
        }
      } catch (_0x58a5df) {}
      try {
        if (typeof _0x18db22.destroy === "function") {
          _0x18db22.destroy();
        } else {
          _0x18db22.close?.();
        }
      } catch (_0x175be6) {}
    });
  }
  function _0xf412fd(_0x5151d6 = null) {
    _0x41183a = null;
    const _0x54dcad = _0x5151d6 == null ? [..._0x31c2d3.keys()] : _0x745e87(_0x5151d6);
    const _0x3a07fb = [];
    _0x54dcad.forEach(_0x5f920 => {
      const _0x461456 = _0x31c2d3.get(String(_0x5f920));
      if (!_0x461456 || _0x461456.isDestroyed?.()) {
        return;
      }
      const _0x4ba06c = _0x461456.__radarEntityViewKey;
      if (!_0x4ba06c) {
        return;
      }
      _0x3a07fb.push(_0x4ba06c);
      try {
        const _0x20772b = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
        const _0x2b1d4a = _0x20772b?.get?.(_0x4ba06c);
        automationLiveViewLifecycle?.finishTask?.(_0x4ba06c, {
          reason: "entity-finished",
          settingsSnapshot: _0x2b1d4a && typeof _0x2b1d4a === "object" ? {
            ..._0x2b1d4a
          } : null
        });
      } catch (_0x28b8da) {}
    });
    try {
      const _0x322400 = _0x427b5e;
      if (_0x322400 && !_0x322400.isDestroyed() && !_0x322400.webContents?.isDestroyed?.()) {
        _0x322400.webContents.send("entity-leadgen-detach-live-preview", {
          viewKeys: _0x3a07fb,
          accountIds: _0x5151d6 == null ? null : _0x54dcad.map(String)
        });
      }
    } catch (_0x5eb0b6) {}
  }
  async function _0x317311(_0xf0508d, _0x29cb4e, _0x5c5775 = "", _0x59527f = "") {
    try {
      await _0xf0508d?.__radarEntityNetworkCapture?.begin?.({
        sourceType: _0x29cb4e,
        searchKeyword: _0x5c5775,
        sourceVideoUrl: _0x29cb4e === "comment" ? _0x59527f || _0x5c5775 : _0x59527f
      });
    } catch (_0x3b1999) {}
  }
  function _0x516d3(_0x28a3d7, _0x13d4db) {
    const _0x4f58f2 = String(_0x13d4db || "0");
    if (_0x4f58f2 === "0") {
      return true;
    }
    const _0x4de509 = Number(_0x28a3d7);
    if (!Number.isFinite(_0x4de509) || _0x4de509 < 0) {
      return false;
    }
    if (_0x4f58f2 === "1") {
      return _0x4de509 < 1000;
    }
    if (_0x4f58f2 === "2") {
      return _0x4de509 >= 1000 && _0x4de509 < 10000;
    }
    if (_0x4f58f2 === "3") {
      return _0x4de509 >= 10000 && _0x4de509 < 100000;
    }
    if (_0x4f58f2 === "4") {
      return _0x4de509 >= 100000 && _0x4de509 < 1000000;
    }
    if (_0x4f58f2 === "5") {
      return _0x4de509 >= 1000000;
    }
    return true;
  }
  async function _0x5ccd3f(_0x59a333, _0x369c66, _0x5e1b07 = 0, {
    sourceType = "",
    userFanCount = "0",
    liveEventTypes = null,
    commentFilters = null,
    targetVideoUrl = ""
  } = {}) {
    await sleep(350);
    let _0x4bb59b = [];
    try {
      _0x4bb59b = _0x59a333?.__radarEntityNetworkCapture?.takeUsers?.(_0x5e1b07) || [];
    } catch (_0x1bd895) {}
    if (sourceType === "video") {
      _0x4bb59b = _0x4bb59b.filter(_0x41ec4e => String(_0x41ec4e?.sourceType || "") === "video" || String(_0x41ec4e?.userKey || "").startsWith("video:") || !!extractDouyinVideoId(_0x41ec4e?.userUrl || _0x41ec4e?.videoUrl || _0x41ec4e?.content || ""));
      const _0x217718 = Array.isArray(_0x369c66?.users) ? _0x369c66.users : [];
      const _0x24cbe4 = new Set(_0x217718.map(_0x29c56e => _0x7d3fb2(_0x29c56e)).filter(Boolean));
      if (_0x24cbe4.size) {
        _0x4bb59b = _0x4bb59b.filter(_0x10c40d => _0x24cbe4.has(_0x7d3fb2(_0x10c40d)));
      }
      if (!_0x4bb59b.length) {
        return _0x369c66 || {
          success: true,
          users: _0x217718
        };
      }
    }
    if (!_0x4bb59b.length) {
      return _0x369c66;
    }
    if (sourceType === "user" && String(userFanCount || "0") !== "0") {
      _0x4bb59b = _0x4bb59b.filter(_0x4b45c9 => _0x516d3(_0x4b45c9.followerCount, userFanCount));
    }
    if (sourceType === "comment") {
      const _0x5c160c = normalizeEntityCommentFilters(commentFilters || {});
      if (_0x5c160c.active) {
        _0x4bb59b = _0x4bb59b.filter(_0x275162 => evaluateEntityCommentFilters(_0x275162, _0x5c160c).pass);
      }
      if (!_0x4bb59b.length) {
        return _0x369c66 || {
          success: true,
          users: []
        };
      }
    }
    const _0x48b229 = new Map();
    const _0x39d539 = [...(Array.isArray(_0x369c66?.users) ? _0x369c66.users : []), ..._0x4bb59b].map(_0x128442 => sourceType === "live" ? _0x5309f1(_0x128442, liveEventTypes) : _0x128442).filter(Boolean);
    _0x39d539.forEach(_0x1ad92a => {
      const _0xd7392c = _0x7d3fb2(_0x1ad92a);
      if (!_0xd7392c) {
        return;
      }
      if (!_0x48b229.has(_0xd7392c)) {
        _0x48b229.set(_0xd7392c, _0x1ad92a);
        return;
      }
      if (sourceType === "video") {
        const _0x283294 = _0x48b229.get(_0xd7392c) || {};
        const _0x2cfe42 = (_0x182549, _0xb0b7bc) => {
          const _0x113cb7 = String(_0x182549 || "").trim();
          const _0x431a81 = String(_0xb0b7bc || "").trim();
          return _0x113cb7 || _0x431a81;
        };
        _0x48b229.set(_0xd7392c, {
          ..._0x283294,
          ..._0x1ad92a,
          title: _0x2cfe42(_0x283294.title || _0x283294.nickname, _0x1ad92a.title || _0x1ad92a.nickname),
          nickname: _0x2cfe42(_0x283294.title || _0x283294.nickname, _0x1ad92a.title || _0x1ad92a.nickname),
          videoUrl: _0x2cfe42(_0x283294.videoUrl, _0x1ad92a.videoUrl),
          authorProfileUrl: _0x2cfe42(_0x283294.authorProfileUrl, _0x1ad92a.authorProfileUrl),
          authorNickname: _0x2cfe42(_0x283294.authorNickname, _0x1ad92a.authorNickname),
          publishTimeText: _0x2cfe42(_0x283294.publishTimeText, _0x1ad92a.publishTimeText),
          createTime: Number(_0x283294.createTime || _0x1ad92a.createTime || 0) || Number(_0x1ad92a.createTime || _0x283294.createTime || 0) || 0,
          publishTime: Number(_0x283294.publishTime || _0x1ad92a.publishTime || _0x283294.createTime || _0x1ad92a.createTime || 0) || 0
        });
        return;
      }
      if (sourceType === "comment") {
        const _0x3c5d4b = _0x48b229.get(_0xd7392c) || {};
        const _0x592f8b = (_0x2ab106, _0x537d01) => {
          const _0x35a360 = String(_0x2ab106 || "").trim();
          const _0x3cdc33 = String(_0x537d01 || "").trim();
          if (_0x35a360 && _0x35a360 !== "视频评论区潜客" && _0x35a360 !== "实体获客" && _0x35a360 !== "线索采集") {
            return _0x35a360;
          }
          return _0x3cdc33 || _0x35a360;
        };
        _0x48b229.set(_0xd7392c, {
          ..._0x3c5d4b,
          ..._0x1ad92a,
          content: _0x592f8b(_0x3c5d4b.content, _0x1ad92a.content),
          time: _0x592f8b(_0x3c5d4b.time, _0x1ad92a.time),
          timeText: _0x592f8b(_0x3c5d4b.timeText, _0x1ad92a.timeText),
          ipLocation: _0x592f8b(_0x3c5d4b.ipLocation, _0x1ad92a.ipLocation) || _0x592f8b(_0x3c5d4b.location, _0x1ad92a.location),
          location: _0x592f8b(_0x3c5d4b.location, _0x1ad92a.location) || _0x592f8b(_0x3c5d4b.ipLocation, _0x1ad92a.ipLocation),
          videoUrl: canonicalizeDouyinVideoUrl(_0x3c5d4b.videoUrl) || canonicalizeDouyinVideoUrl(_0x1ad92a.videoUrl) || ""
        });
      }
    });
    let _0x3d96aa = [..._0x48b229.values()];
    if (sourceType === "comment") {
      const _0xbae743 = normalizeEntityCommentFilters(commentFilters || {});
      if (_0xbae743.active) {
        _0x3d96aa = _0x3d96aa.filter(_0x319dc3 => evaluateEntityCommentFilters(_0x319dc3, _0xbae743).pass);
      }
      const _0x12c785 = canonicalizeDouyinVideoUrl(targetVideoUrl);
      if (_0x12c785) {
        _0x3d96aa = _0x3d96aa.map(_0x32f87a => ({
          ..._0x32f87a,
          videoUrl: canonicalizeDouyinVideoUrl(_0x32f87a.videoUrl) || _0x12c785,
          title: String(_0x32f87a.title || _0x32f87a.sourceVideoTitle || "").trim(),
          sourceVideoTitle: String(_0x32f87a.sourceVideoTitle || _0x32f87a.title || "").trim()
        }));
      }
    }
    return {
      ...(_0x369c66 || {}),
      success: _0x369c66?.success !== false || _0x3d96aa.length > 0,
      users: _0x5e1b07 > 0 ? _0x3d96aa.slice(0, _0x5e1b07) : _0x3d96aa
    };
  }
  function _0x33fd1c(_0x13b8b1, _0x431ff6, _0x2c1d9d, _0x1aa370) {
    const _0x180752 = getEntityEntryMeta(_0x13b8b1.sourceType);
    const _0x449be4 = Date.now();
    const _0x516891 = Number(_0x13b8b1.eventTimestamp || _0x13b8b1.liveEvent?.occurredAt || 0);
    const _0x4390cc = Number.isFinite(_0x516891) && _0x516891 > 0 ? _0x516891 : _0x449be4;
    const _0x27c446 = String(_0x13b8b1.sourceType || "").trim();
    const _0x4ea295 = _0x4bfbda(_0x13b8b1) ? extractDouyinVideoId(_0x13b8b1.videoUrl || _0x13b8b1.userUrl || _0x13b8b1.content || "") || (String(_0x13b8b1.userKey || "").startsWith("video:") ? String(_0x13b8b1.userKey).slice(6) : "") : "";
    if (_0x4ea295) {
      const _0xff0b4e = "https://www.douyin.com/video/" + _0x4ea295;
      const _0x43e9fa = String(_0x13b8b1.title || _0x13b8b1.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
      const _0x5eac21 = "video:" + _0x4ea295;
      const _0x5afb0c = Array.isArray(_0x13b8b1.collectedFields) && _0x13b8b1.collectedFields.length ? _0x13b8b1.collectedFields.map(String) : ["video"];
      const _0x5ef6aa = String(_0x13b8b1.authorProfileUrl || "").trim() || (/\/user\//i.test(String(_0x13b8b1.userUrl || "")) && !/\/(?:video|note)\//i.test(String(_0x13b8b1.userUrl || "")) ? String(_0x13b8b1.userUrl || "").trim() : "");
      const _0x270bf2 = String(_0x13b8b1.authorNickname || "").trim().replace(/^@+/, "");
      const _0x32be97 = String(_0x13b8b1.entrySource || _0x180752.entrySource || "").trim();
      const _0x2e979b = String(_0x13b8b1.entryLabel || _0x180752.entryLabel || "").trim();
      const _0x8a5f0a = normalizeAwemeCreateTimeMs(_0x13b8b1.publishTime ?? _0x13b8b1.createTime ?? _0x13b8b1.create_time ?? 0);
      const _0x23a570 = String(_0x13b8b1.publishTimeText || "").trim();
      const _0x3c5332 = {
        platform: "DY",
        leadKind: "video_card",
        leadId: _0x5eac21,
        key: _0x5eac21,
        userKey: _0x5eac21,
        type: "LEAD",
        title: _0x43e9fa,
        nickname: _0x270bf2 || "未知作者",
        content: "",
        timeText: _0x23a570 || "卡片采集",
        ipLocation: "",
        userUrl: "",
        authorProfileUrl: "",
        url: _0xff0b4e,
        videoUrl: _0xff0b4e,
        uid: "",
        secUid: "",
        webcastUid: "",
        privacyMasked: false,
        identityType: "video",
        profileAvailable: false,
        profileUnavailable: true,
        profileUnavailableReason: "视频作品链接",
        collectedFields: _0x5afb0c,
        messageId: "",
        liveEvent: null,
        liveEvents: [],
        eventTimestamp: _0x4390cc,
        publishTime: _0x8a5f0a,
        publishTimeText: _0x23a570,
        createTime: _0x8a5f0a,
        firstSeenAt: _0x4390cc,
        lastSeenAt: _0x4390cc,
        liveUrl: "",
        timestamp: _0x4390cc,
        capturedAt: new Date(_0x4390cc).toISOString(),
        isHighIntention: true,
        accountId: String(_0x431ff6.id || _0x431ff6.accountId || ""),
        accountName: _0x431ff6.nickname || _0x431ff6.name || "未知账号",
        taskName: _0x1aa370,
        taskId: _0x2c1d9d,
        searchKeyword: String(_0x13b8b1.searchKeyword || ""),
        entrySource: _0x32be97 || _0x180752.entrySource,
        entryLabel: _0x2e979b || _0x180752.entryLabel,
        thought: _0x2e979b || _0x180752.entryLabel || "线索采集：从搜索结果采集视频链接",
        actions: {
          liked: false,
          replied: false,
          messaged: false,
          followed: false
        },
        sourceType: "video"
      };
      if (_0x5afb0c.includes("author") && _0x5ef6aa && !/\/(?:video|note)\//i.test(_0x5ef6aa)) {
        _0x3c5332.userUrl = _0x5ef6aa;
        _0x3c5332.authorProfileUrl = _0x5ef6aa;
        _0x3c5332.nickname = _0x270bf2 || _0x3c5332.nickname;
        _0x3c5332.profileAvailable = true;
        _0x3c5332.profileUnavailable = false;
        _0x3c5332.profileUnavailableReason = "";
      }
      return _0x3c5332;
    }
    if (isEntityRelationAuthorSource(_0x27c446, _0x13b8b1.entrySource)) {
      const _0x55382a = resolveAuthorSecUidFromLead(_0x13b8b1);
      if (_0x55382a) {
        const _0x4c630b = normalizeAuthorProfileUrl(_0x55382a);
        const _0x5e8c80 = toCollectedAuthorKey(_0x55382a);
        const _0x45a5bd = String(_0x13b8b1.nickname || "").trim().replace(/^@+/, "") || "未知用户";
        return {
          platform: "DY",
          leadKind: "collected_author",
          leadId: _0x5e8c80,
          key: _0x5e8c80,
          userKey: _0x5e8c80,
          type: "LEAD",
          title: "",
          nickname: _0x45a5bd,
          authorNickname: _0x45a5bd,
          content: _0x180752.entryLabel || "线索采集",
          timeText: stripLocationFromCommentTimeText(_0x13b8b1.timeText || _0x13b8b1.time) || String(_0x13b8b1.timeText || _0x13b8b1.time || "").trim() || "线索采集",
          ipLocation: String(_0x13b8b1.ipLocation || _0x13b8b1.location || "").trim(),
          userUrl: _0x4c630b,
          authorProfileUrl: _0x4c630b,
          url: _0x4c630b,
          videoUrl: "",
          uid: String(_0x13b8b1.uid || "").trim(),
          secUid: _0x55382a,
          webcastUid: "",
          privacyMasked: !!_0x13b8b1.privacyMasked,
          identityType: "author",
          profileAvailable: true,
          profileUnavailable: false,
          profileUnavailableReason: "",
          collectedFields: ["author"],
          messageId: "",
          liveEvent: null,
          liveEvents: [],
          eventTimestamp: _0x4390cc,
          firstSeenAt: _0x4390cc,
          lastSeenAt: _0x4390cc,
          timestamp: _0x4390cc,
          capturedAt: new Date(_0x4390cc).toISOString(),
          isHighIntention: false,
          accountId: String(_0x431ff6.id || _0x431ff6.accountId || ""),
          accountName: _0x431ff6.nickname || _0x431ff6.name || "未知账号",
          taskName: _0x1aa370,
          taskId: _0x2c1d9d,
          searchKeyword: String(_0x13b8b1.searchKeyword || ""),
          entrySource: _0x180752.entrySource,
          entryLabel: _0x180752.entryLabel,
          thought: _0x180752.entryLabel,
          actions: {
            liked: false,
            replied: false,
            messaged: false,
            followed: false
          },
          sourceType: _0x27c446
        };
      }
    }
    const _0x16691d = {
      platform: "DY",
      title: _0x13b8b1.liveUrl ? "直播间：" + _0x13b8b1.liveUrl : String(_0x13b8b1.title || _0x13b8b1.sourceVideoTitle || "").replace(/\s+/g, " ").trim(),
      sourceVideoTitle: String(_0x13b8b1.sourceVideoTitle || _0x13b8b1.title || "").replace(/\s+/g, " ").trim(),
      nickname: String(_0x13b8b1.nickname || "").trim() || "未知用户",
      content: _0x13b8b1.content ? _0x13b8b1.content : _0x13b8b1.searchKeyword ? "线索采集关键词：" + _0x13b8b1.searchKeyword : _0x180752.entryLabel || "线索采集",
      timeText: stripLocationFromCommentTimeText(_0x13b8b1.timeText || _0x13b8b1.time) || String(_0x13b8b1.timeText || _0x13b8b1.time || "").trim() || "线索采集",
      ipLocation: String(_0x13b8b1.ipLocation || _0x13b8b1.location || "").trim(),
      userUrl: String(_0x13b8b1.userUrl || "").trim(),
      url: String(_0x13b8b1.userUrl || _0x13b8b1.liveUrl || "").trim(),
      videoUrl: canonicalizeDouyinVideoUrl(_0x13b8b1.videoUrl) || (_0x27c446 === "comment" ? canonicalizeDouyinVideoUrl(_0x13b8b1.sourceVideoUrl || _0x13b8b1.searchKeyword) : "") || "",
      uid: String(_0x13b8b1.uid || "").trim(),
      secUid: String(_0x13b8b1.secUid || "").trim(),
      webcastUid: String(_0x13b8b1.webcastUid || "").trim(),
      privacyMasked: !!_0x13b8b1.privacyMasked,
      identityType: String(_0x13b8b1.identityType || ""),
      profileAvailable: !!_0x13b8b1.profileAvailable,
      profileUnavailable: !!_0x13b8b1.profileUnavailable,
      profileUnavailableReason: String(_0x13b8b1.profileUnavailableReason || ""),
      userKey: _0x7d3fb2(_0x13b8b1),
      messageId: String(_0x13b8b1.messageId || _0x13b8b1.liveEvent?.messageId || "").trim(),
      liveEvent: _0x13b8b1.liveEvent || null,
      liveEvents: Array.isArray(_0x13b8b1.liveEvents) ? _0x13b8b1.liveEvents : [],
      eventTimestamp: _0x4390cc,
      firstSeenAt: _0x4390cc,
      lastSeenAt: _0x4390cc,
      liveUrl: String(_0x13b8b1.liveUrl || "").trim(),
      timestamp: _0x4390cc,
      capturedAt: new Date(_0x4390cc).toISOString(),
      type: "LEAD",
      isHighIntention: true,
      accountId: String(_0x431ff6.id || _0x431ff6.accountId || ""),
      accountName: _0x431ff6.nickname || _0x431ff6.name || "未知账号",
      taskName: _0x1aa370,
      taskId: _0x2c1d9d,
      searchKeyword: String(_0x13b8b1.searchKeyword || ""),
      entrySource: _0x180752.entrySource,
      entryLabel: _0x180752.entryLabel,
      thought: _0x180752.entryLabel,
      actions: {
        liked: false,
        replied: false,
        messaged: false,
        followed: false
      },
      sourceType: _0x27c446
    };
    const _0x463cbe = leadUserKey.buildLeadId(_0x16691d);
    _0x16691d.leadId = _0x463cbe;
    _0x16691d.key = _0x463cbe;
    return _0x16691d;
  }
  function _0x4b6592(_0x49433c, _0x260272, _0x3e0c37) {
    const _0x5cc008 = (Array.isArray(_0x49433c) ? _0x49433c : [_0x49433c]).filter(isEntityLeadEligibleForLeadPool);
    if (!_0x5cc008.length || typeof _0x31f44a !== "function") {
      return 0;
    }
    _0x31f44a(_0x5cc008, _0x260272, _0x3e0c37);
    const _0x34ad0e = _0x5cc008.filter(_0x1be306 => _0x1be306.leadKind !== "collected_author" && _0x1be306.leadKind !== "collected_video" && _0x1be306.leadKind !== "video_card" && !/^author:/.test(String(_0x1be306.leadId || _0x1be306.key || "")));
    if (_0x34ad0e.length && _0x427b5e && !_0x427b5e.isDestroyed()) {
      _0x427b5e.webContents.send("automation-data", {
        type: "comment",
        payload: _0x34ad0e.length === 1 ? _0x34ad0e[0] : _0x34ad0e,
        taskId: _0x260272,
        taskName: _0x3e0c37
      });
    }
    return _0x5cc008.length;
  }
  function _0x1f13af(_0x18f104, _0x33e556) {
    const _0x24b284 = _0x4b41fa.get(_0x18f104);
    if (!_0x24b284) {
      return;
    }
    clearTimeout(_0x24b284.timer);
    if (_0x24b284.softFailTimer) {
      clearTimeout(_0x24b284.softFailTimer);
    }
    _0x4b41fa.delete(_0x18f104);
    _0x24b284.resolve(_0x33e556 || {});
  }
  function _0x23fbd4(_0x4fd112, _0x4bf093) {
    for (const [_0x3207cb, _0x28f7bf] of _0x4b41fa.entries()) {
      if (String(_0x28f7bf.taskId) !== String(_0x4fd112)) {
        continue;
      }
      if (_0x28f7bf.failing) {
        continue;
      }
      _0x28f7bf.failing = true;
      if (_0x28f7bf.softFailTimer) {
        clearTimeout(_0x28f7bf.softFailTimer);
      }
      _0x28f7bf.softFailTimer = setTimeout(() => {
        if (!_0x4b41fa.has(_0x3207cb)) {
          return;
        }
        clearTimeout(_0x28f7bf.timer);
        _0x4b41fa.delete(_0x3207cb);
        _0x28f7bf.resolve({
          success: false,
          cancelled: true,
          error: _0x4bf093 || "任务已停止",
          users: []
        });
      }, 2500);
    }
  }
  function _0x48606e(_0x42e1fe, _0x2ca280) {
    const _0x3e8060 = "entity_scrape_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    return new Promise(_0x206544 => {
      const _0x152d31 = _0x2ca280.sourceType === "live" && Number(_0x2ca280.liveDurationSeconds) === 0;
      const _0x23a880 = _0x2ca280.sourceType === "live" ? Math.max(0, Number(_0x2ca280.liveDurationSeconds) || 0) * 1000 : 0;
      const _0x8847b4 = _0x2ca280.sourceType === "live" ? Math.max(PAGE_SCRAPE_TIMEOUT_MS, _0x23a880 + 60000) : PAGE_SCRAPE_TIMEOUT_MS;
      const _0x2619ec = _0x152d31 ? null : setTimeout(() => {
        _0x4b41fa.delete(_0x3e8060);
        _0x206544({
          success: false,
          error: "页面采集超时（" + Math.round(_0x8847b4 / 60000) + " 分钟）",
          users: []
        });
      }, _0x8847b4);
      _0x4b41fa.set(_0x3e8060, {
        resolve: _0x206544,
        timer: _0x2619ec,
        taskId: _0x2ca280.taskId,
        webContentsId: _0x42e1fe.webContents.id
      });
      (async () => {
        try {
          await _0x31a7f4(_0x42e1fe.webContents);
          if (!_0x42e1fe || _0x42e1fe.isDestroyed()) {
            throw new Error("线索采集窗口已销毁");
          }
          _0x42e1fe.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_SCRAPE_PAGE",
            payload: {
              ..._0x2ca280,
              requestId: _0x3e8060
            }
          });
        } catch (_0x5d8c39) {
          clearTimeout(_0x2619ec);
          _0x4b41fa.delete(_0x3e8060);
          _0x206544({
            success: false,
            error: _0x5d8c39.message || "发送采集指令失败",
            users: []
          });
        }
      })();
    });
  }
  function _0x176869(_0x50010a, _0x3774ec, _0x5d654a = {}, _0x1507e9 = 45000) {
    const _0x3bdb47 = "entity_ctrl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    return new Promise(_0x24535c => {
      const _0x2d96e8 = setTimeout(() => {
        _0x4b41fa.delete(_0x3bdb47);
        _0x24535c({
          success: false,
          error: "操作超时",
          timedOut: true
        });
      }, Math.max(8000, Number(_0x1507e9) || 45000));
      _0x4b41fa.set(_0x3bdb47, {
        resolve: _0x24535c,
        timer: _0x2d96e8,
        taskId: _0x5d654a.taskId,
        webContentsId: _0x50010a?.webContents?.id
      });
      (async () => {
        try {
          await _0x31a7f4(_0x50010a.webContents);
          if (!_0x50010a || _0x50010a.isDestroyed()) {
            throw new Error("线索采集窗口已销毁");
          }
          _0x50010a.webContents.send("control-task", {
            type: _0x3774ec,
            payload: {
              ..._0x5d654a,
              requestId: _0x3bdb47
            }
          });
        } catch (_0x5e60d5) {
          clearTimeout(_0x2d96e8);
          _0x4b41fa.delete(_0x3bdb47);
          _0x24535c({
            success: false,
            error: _0x5e60d5.message || "发送指令失败"
          });
        }
      })();
    });
  }
  function _0x4ec184(_0xf381ea, _0x48a903) {
    const _0x1422bd = _0x5ea9b0.get(_0xf381ea);
    return !!_0x1422bd && _0x1422bd.generation === _0x48a903 && !_0x1422bd.stopRequested;
  }
  function _0x5e63d3(_0x3ea507) {
    if (!_0x3ea507) {
      return false;
    }
    if (_0x3ea507.limitReached) {
      return true;
    }
    const _0x11c846 = Array.isArray(_0x3ea507.config?.sourceTypes) ? _0x3ea507.config.sourceTypes[0] : "";
    if (_0x11c846 === "video_recommend") {
      return false;
    }
    const _0x77d162 = Number(_0x3ea507?.config?.maxCollect) || 0;
    if (_0x77d162 <= 0) {
      return false;
    }
    return (_0x3ea507?.progress?.collectedThisRun || 0) >= _0x77d162;
  }
  function _0x41ccb7(_0x2c15e3) {
    if (!_0x2c15e3 || _0x2c15e3.stopRequested || _0x5e63d3(_0x2c15e3)) {
      return null;
    }
    const _0x459986 = Array.isArray(_0x2c15e3.config?.keywords) ? _0x2c15e3.config.keywords : [];
    const _0x49a87d = Number(_0x2c15e3.nextKeywordIndex) || 0;
    if (_0x49a87d >= _0x459986.length) {
      return null;
    }
    const _0x260795 = _0x459986[_0x49a87d];
    _0x2c15e3.nextKeywordIndex = _0x49a87d + 1;
    return {
      keyword: _0x260795,
      index: _0x49a87d
    };
  }
  function _0x37cbb4(_0x5b2a28) {
    if (!_0x5b2a28 || _0x5b2a28.stopRequested || _0x5e63d3(_0x5b2a28)) {
      return null;
    }
    const _0x4e7e3f = Array.isArray(_0x5b2a28.config?.liveUrls) ? _0x5b2a28.config.liveUrls : [];
    const _0x232c99 = Number(_0x5b2a28.nextLiveUrlIndex) || 0;
    if (_0x232c99 >= _0x4e7e3f.length) {
      return null;
    }
    const _0x392515 = _0x4e7e3f[_0x232c99];
    _0x5b2a28.nextLiveUrlIndex = _0x232c99 + 1;
    return {
      rawUrl: _0x392515,
      index: _0x232c99,
      total: _0x4e7e3f.length
    };
  }
  async function _0x4cd8c8(_0x2db41e) {
    const _0x3eb998 = String(_0x2db41e || "").trim();
    if (!_0x3eb998) {
      return "";
    }
    const _0x2cd609 = buildDouyinLiveUrl(_0x3eb998);
    if (_0x2cd609 && /^https:\/\/live\.douyin\.com\/\d{6,24}$/i.test(_0x2cd609)) {
      return _0x2cd609;
    }
    if (/v\.douyin\.com|iesdouyin\.com\/share|webcast\.amemv\.com|\/webcast\/reflow\//i.test(_0x3eb998) || /v\.douyin\.com|iesdouyin\.com\/share|webcast\.amemv\.com|\/webcast\/reflow\//i.test(_0x2cd609)) {
      try {
        const _0x682252 = await resolveDouyinShareUrl(_0x3eb998);
        const _0x1a2f31 = buildDouyinLiveUrl(_0x682252 || "");
        if (_0x1a2f31 && /^https:\/\/live\.douyin\.com\/\d{6,24}$/i.test(_0x1a2f31)) {
          return _0x1a2f31;
        }
        return _0x1a2f31 || _0x2cd609 || _0x3eb998;
      } catch (_0x1d3b05) {
        return _0x2cd609 || _0x3eb998;
      }
    }
    return _0x2cd609 || _0x3eb998;
  }
  async function _0x25efc1(_0x37ad5c, _0x59b1b4, _0x1fe10b = 0) {
    if (_0x1fe10b <= 0) {
      return true;
    }
    let _0x3d1c86 = false;
    while (_0x4ec184(_0x37ad5c, _0x59b1b4)) {
      const _0xbc6811 = _0x4085b5();
      if (!_0xbc6811.pressured) {
        if (_0x3d1c86) {
          _0x9d21b4(_0x37ad5c, "电脑资源已恢复，继续启动下一个直播间", "info");
        }
        return true;
      }
      if (!_0x3d1c86) {
        _0x3d1c86 = true;
        _0x9d21b4(_0x37ad5c, "当前电脑负载较高，暂停启动新的直播间（可用内存 " + _0xbc6811.freeMemGB.toFixed(1) + "GB，应用 CPU " + _0xbc6811.appCpuPercent.toFixed(0) + "%）", "warning");
      }
      await sleep(3000);
    }
    return false;
  }
  function _0xf71364(_0x49af7f = null) {
    let _0x41e6af = 0;
    for (const [_0x471466, _0x122df5] of _0x5ea9b0.entries()) {
      if (_0x49af7f && String(_0x471466) === String(_0x49af7f)) {
        continue;
      }
      _0x41e6af += Math.max(0, Number(_0x122df5.liveWorkerCount) || 0);
    }
    return _0x41e6af;
  }
  async function _0x2f1658(_0x1b683b, _0x1833ba, _0x25d54b, _0x3a9ae7 = LIVE_CONCURRENCY_DEFAULT) {
    let _0x4e6991 = false;
    const _0xe9713 = normalizeLiveConcurrency(_0x3a9ae7, LIVE_CONCURRENCY_DEFAULT);
    while (_0x4ec184(_0x1b683b, _0x1833ba)) {
      const _0x4fef40 = getLocalLiveRoomConcurrencyDetails(_0x25d54b, _0xe9713);
      const _0x49fb4b = getLocalLiveRoomConcurrencyDetails(_0xe9713, _0xe9713);
      const _0x3b5db2 = Math.max(0, _0x49fb4b.workers - _0xf71364(_0x1b683b));
      if (_0x3b5db2 > 0) {
        const _0x438d88 = Math.max(1, Math.min(_0x4fef40.workers, _0x3b5db2));
        const _0x845d99 = _0x5ea9b0.get(_0x1b683b);
        if (_0x845d99 && _0x845d99.generation === _0x1833ba) {
          _0x845d99.liveWorkerCount = _0x438d88;
          _0x845d99.liveConcurrencyDetails = _0x4fef40;
        }
        if (_0x4e6991) {
          _0x9d21b4(_0x1b683b, "直播采集资源已释放，开始处理直播间队列", "info");
        }
        return _0x438d88;
      }
      if (!_0x4e6991) {
        _0x4e6991 = true;
        _0x9d21b4(_0x1b683b, "其它直播采集任务已占满安全并发额度，正在排队等待", "warning");
      }
      await sleep(3000);
    }
    return 0;
  }
  function _0x314742(_0x34aa33 = {}) {
    const _0x1afcca = _0x34aa33.taskId;
    if (!_0x1afcca || !_0x5ea9b0.has(_0x1afcca)) {
      return;
    }
    const _0x1e8775 = _0x5ea9b0.get(_0x1afcca);
    if (!_0x1e8775) {
      return;
    }
    if (_0x34aa33.generation != null && _0x1e8775.generation != null && Number(_0x34aa33.generation) !== Number(_0x1e8775.generation)) {
      return;
    }
    if (_0x34aa33.resetNetworkCapture) {
      const _0x2d7f12 = _0x31c2d3.get(String(_0x34aa33.accountId || ""));
      try {
        _0x2d7f12?.__radarEntityNetworkCapture?.begin?.({
          sourceType: _0x34aa33.sourceType || "mutual",
          searchKeyword: ""
        });
      } catch (_0x52c323) {}
      try {
        if (_0x2d7f12 && !_0x2d7f12.isDestroyed()) {
          _0x2d7f12.webContents.send("entity-leadgen-clear-scrape-aweme", {
            reason: "reset-network-capture"
          });
        }
      } catch (_0x21e8e4) {}
    }
    if (_0x34aa33.message) {
      const _0x5f53ea = String(_0x34aa33.accountId || "");
      const _0xf6afcd = (_0x1e8775.accounts || []).find(_0x3a8c2e => String(_0x3a8c2e.id) === _0x5f53ea);
      const _0x5f4ff9 = String(_0x34aa33.accountName || _0xf6afcd?.nickname || _0xf6afcd?.name || (_0x5f53ea === "anonymous" ? "无账号采集" : _0x5f53ea)).trim();
      const _0x45d47e = String(_0x34aa33.message);
      const _0x45d910 = _0x5f4ff9 && !_0x45d47e.startsWith("[" + _0x5f4ff9 + "]") ? "[" + _0x5f4ff9 + "] " + _0x45d47e : _0x45d47e;
      _0x9d21b4(_0x1afcca, _0x45d910, _0x34aa33.level || "info", {
        accountId: _0x5f53ea || String(_0xf6afcd?.id || "")
      });
    }
    const _0x30890c = Array.isArray(_0x34aa33.users) ? _0x34aa33.users : [];
    if (!_0x30890c.length) {
      return;
    }
    if (_0x34aa33.skipIngest) {
      return;
    }
    if (!_0x1e8775?.knownKeys || !_0x1e8775.tasksApi) {
      return;
    }
    const _0x4ff2da = String(_0x34aa33.accountId || "");
    const _0x35bdfc = (_0x1e8775.accounts || []).find(_0x181ec9 => String(_0x181ec9.id) === _0x4ff2da) || (_0x1e8775.accounts || [])[0] || {
      id: _0x4ff2da || "anonymous",
      nickname: _0x34aa33.accountName || "无账号采集",
      name: "无账号采集"
    };
    const _0x3e9dea = String(_0x34aa33.sourceType || "blogger");
    let _0x440d89 = _0x30890c;
    let _0x646234 = _0x3e9dea;
    if (_0x3e9dea === "video" || _0x3e9dea.startsWith("video_") || _0x3e9dea === "blogger" || _0x3e9dea === "author_profile") {
      const _0x572b69 = _0x3c2c48(_0x1e8775.config, "video") || _0x3c2c48(_0x1e8775.config, "author");
      if (_0x572b69) {
        const _0xeb221b = _0x4c8c61(_0x30890c, _0x1e8775.config);
        const _0x2a398d = getEntityEntryMeta(_0x3e9dea === "blogger" ? "video_search" : _0x3e9dea);
        _0x440d89 = _0x3ba01a(_0xeb221b, _0x1e8775.config).map(_0x4e4e5f => ({
          ..._0x4e4e5f,
          sourceType: "video",
          identityType: "video",
          entrySource: _0x4e4e5f.entrySource || _0x2a398d.entrySource,
          entryLabel: _0x4e4e5f.entryLabel || _0x2a398d.entryLabel
        }));
        _0x646234 = "video";
      }
    }
    if (!_0x440d89.length) {
      return;
    }
    _0x22b125({
      users: _0x440d89,
      account: _0x35bdfc,
      taskId: _0x1afcca,
      taskName: _0x1e8775.taskName || "线索采集",
      tasksApi: _0x1e8775.tasksApi,
      knownKeys: _0x1e8775.knownKeys,
      sourceType: _0x646234,
      progress: _0x1e8775.progress,
      maxCollect: _0x1e8775.config?.maxCollect || 0,
      generation: _0x1e8775.generation
    });
  }
  function _0x5bf25b(_0xad3435 = {}) {
    if (!_0xad3435.requestId) {
      return;
    }
    _0x1f13af(_0xad3435.requestId, _0xad3435);
  }
  function _0x22b125({
    users: _0x50f045,
    account: _0x186842,
    taskId: _0x55589f,
    taskName: _0x28f788,
    tasksApi: _0x364631,
    knownKeys: _0x46a93f,
    sourceType: _0x452d00,
    progress = null,
    maxCollect = 0,
    generation = null
  }) {
    const _0x33041d = _0x5ea9b0.get(_0x55589f);
    if (generation != null && _0x33041d && Number(_0x33041d.generation) !== Number(generation)) {
      return {
        synced: 0,
        duplicates: 0,
        skipped: 0,
        received: 0,
        truncated: 0
      };
    }
    const _0x261528 = (Array.isArray(_0x50f045) ? _0x50f045 : []).map(_0x4e9811 => _0x37ab25(_0x4e9811)).filter(_0x3514da => {
      if (!_0x3514da || !_0x3514da.nickname) {
        return false;
      }
      const _0x4ce5df = _0x3514da.sourceType || _0x452d00;
      if (_0x4ce5df === "live" || _0x3514da.entrySource === "entity_live") {
        return hasUsableSecUid(_0x3514da);
      }
      return true;
    });
    const _0x4bb387 = [];
    const _0x5c607a = [];
    const _0x4caa0a = [];
    let _0x1b2d5a = 0;
    let _0x364976 = 0;
    let _0x4131db = 0;
    let _0x34a820 = 0;
    let _0x5e266b = 0;
    const _0x466c53 = progress || _0x33041d?.progress || null;
    if (_0x33041d && !(_0x33041d.ingestedKeysThisRun instanceof Set)) {
      _0x33041d.ingestedKeysThisRun = new Set();
    }
    if (_0x33041d && !(_0x33041d.duplicateTrailKeys instanceof Set)) {
      _0x33041d.duplicateTrailKeys = new Set();
    }
    const _0x1d5eef = _0x33041d?.ingestedKeysThisRun || null;
    const _0x2261f6 = _0x33041d?.duplicateTrailKeys || null;
    const _0x5f10f0 = Number(maxCollect) > 0 ? Number(maxCollect) : Number(_0x33041d?.config?.maxCollect) || 0;
    _0x261528.forEach(_0x46df62 => {
      if (isEntityRelationAuthorSource(_0x46df62.sourceType || _0x452d00, _0x46df62.entrySource)) {
        const _0x24ca53 = resolveAuthorSecUidFromLead({
          ..._0x46df62,
          sourceType: _0x46df62.sourceType || _0x452d00
        });
        if (_0x24ca53) {
          _0x46df62.secUid = _0x24ca53;
          _0x46df62.userUrl = normalizeAuthorProfileUrl(_0x24ca53);
          _0x46df62.authorProfileUrl = _0x46df62.userUrl;
        }
      }
      const _0x2577eb = _0x7d3fb2(_0x46df62);
      if (!_0x2577eb) {
        _0x34a820 += 1;
        return;
      }
      if (_0x46a93f.has(_0x2577eb)) {
        if ((_0x46df62.sourceType || _0x452d00) === "live" && (_0x46df62.liveEvent || _0x46df62.liveEvents?.length || _0x46df62.messageId || _0x46df62.content)) {
          _0x5c607a.push({
            ..._0x46df62,
            userKey: _0x2577eb,
            sourceType: "live"
          });
        } else if (_0x1d5eef?.has(_0x2577eb)) {
          _0x4131db += 1;
        } else {
          _0x364976 += 1;
          if (!_0x2261f6?.has(_0x2577eb)) {
            try {
              _0x2261f6?.add(_0x2577eb);
            } catch (_0x25658f) {}
            _0x1b2d5a += 1;
            _0x4caa0a.push({
              ..._0x46df62,
              userKey: _0x2577eb,
              sourceType: _0x46df62.sourceType || _0x452d00
            });
          }
        }
        return;
      }
      if (_0x5f10f0 > 0 && _0x466c53 && (_0x466c53.collectedThisRun || 0) + _0x4bb387.length >= _0x5f10f0) {
        _0x5e266b += 1;
        return;
      }
      _0x46a93f.add(_0x2577eb);
      try {
        _0x1d5eef?.add(_0x2577eb);
      } catch (_0x3f5324) {}
      _0x4bb387.push({
        ..._0x46df62,
        userKey: _0x2577eb,
        sourceType: _0x46df62.sourceType || _0x452d00
      });
    });
    if (_0x466c53 && _0x4bb387.length) {
      _0x466c53.collectedThisRun = (_0x466c53.collectedThisRun || 0) + _0x4bb387.length;
    }
    if (_0x5f10f0 > 0 && _0x466c53 && (_0x466c53.collectedThisRun || 0) >= _0x5f10f0 && _0x33041d && !_0x33041d.limitReached) {
      _0x33041d.limitReached = true;
      _0x23fbd4(_0x55589f, "已达到最大采集数");
      const _0x2adce3 = _0x33041d.windowKeys && _0x33041d.windowKeys.size ? [..._0x33041d.windowKeys] : _0x745e87(_0x33041d.accounts || []);
      for (const _0x24ba5d of _0x2adce3) {
        const _0x27d11a = _0x31c2d3.get(String(_0x24ba5d));
        if (!_0x27d11a || _0x27d11a.isDestroyed()) {
          continue;
        }
        try {
          _0x27d11a.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: _0x55589f,
              accountId: _0x24ba5d,
              generation: _0x33041d.generation
            }
          });
        } catch (_0x2b49cc) {}
      }
    }
    const _0x2518ba = [..._0x4bb387, ..._0x5c607a];
    const _0x232881 = _0x2518ba.map(_0x1e576b => _0x33fd1c(_0x1e576b, _0x186842, _0x55589f, _0x28f788));
    _0x4b6592(_0x232881, _0x55589f, _0x28f788);
    const _0x57d716 = _0x4bb387.length;
    const _0x2d4356 = (_0x11c331, {
      duplicate = false,
      tsOffset = 0
    } = {}) => {
      const _0x1da146 = _0x33fd1c(_0x11c331, _0x186842, _0x55589f, _0x28f788);
      const _0x37361e = _0x1da146.leadKind === "video_card" || (_0x11c331.sourceType || _0x452d00) === "video" || String(_0x11c331.identityType || "") === "video" || String(_0x11c331.userKey || "").startsWith("video:");
      const _0x63955d = Array.isArray(_0x1da146.collectedFields) && _0x1da146.collectedFields.length ? _0x1da146.collectedFields.map(String) : Array.isArray(_0x11c331.collectedFields) && _0x11c331.collectedFields.length ? _0x11c331.collectedFields.map(String) : _0x37361e ? ["video"] : [];
      const _0xbf8a22 = getEntityEntryMeta(_0x37361e ? _0x11c331.entrySource || _0x1da146.entrySource || "video" : _0x11c331.sourceType || _0x452d00);
      return {
        accountId: String(_0x186842.id),
        accountName: _0x186842.nickname || _0x186842.name || "",
        nickname: _0x37361e ? _0x1da146.nickname || _0x11c331.authorNickname || _0x1da146.title || _0x11c331.nickname : _0x11c331.nickname,
        title: _0x1da146.title || _0x11c331.title || _0x11c331.sourceVideoTitle || "",
        sourceVideoTitle: _0x1da146.sourceVideoTitle || _0x11c331.sourceVideoTitle || _0x11c331.title || "",
        uid: _0x37361e ? "" : _0x11c331.uid || "",
        secUid: _0x37361e ? "" : _0x11c331.secUid || "",
        webcastUid: _0x37361e ? "" : _0x11c331.webcastUid || "",
        privacyMasked: !!_0x11c331.privacyMasked,
        identityType: _0x37361e ? "video" : _0x11c331.identityType || "",
        profileAvailable: _0x37361e ? !!_0x1da146.profileAvailable : !!_0x11c331.profileAvailable,
        profileUnavailable: _0x37361e ? !!_0x1da146.profileUnavailable : !!_0x11c331.profileUnavailable,
        profileUnavailableReason: _0x37361e ? _0x1da146.profileUnavailableReason || "视频作品链接" : _0x11c331.profileUnavailableReason || "",
        userUrl: _0x37361e ? _0x1da146.userUrl || _0x1da146.authorProfileUrl || "" : _0x11c331.userUrl || "",
        authorProfileUrl: _0x37361e ? _0x1da146.authorProfileUrl || _0x11c331.authorProfileUrl || "" : "",
        authorNickname: _0x37361e ? _0x11c331.authorNickname || _0x1da146.nickname || "" : "",
        videoUrl: _0x1da146.videoUrl || canonicalizeDouyinVideoUrl(_0x11c331.videoUrl) || "",
        url: _0x37361e ? _0x1da146.url || _0x1da146.videoUrl || "" : _0x1da146.userUrl || _0x11c331.userUrl || "",
        leadKind: _0x37361e ? "video_card" : "",
        leadId: _0x1da146.leadId || "",
        collectedFields: _0x63955d,
        content: _0x37361e ? _0x1da146.videoUrl || _0x11c331.content || "" : _0x11c331.content || "",
        timeText: _0x37361e ? String(_0x11c331.publishTimeText || _0x1da146.timeText || "").trim() || "卡片采集" : stripLocationFromCommentTimeText(_0x11c331.timeText || _0x11c331.time) || String(_0x11c331.timeText || _0x11c331.time || "").trim(),
        ipLocation: _0x37361e ? "" : String(_0x11c331.ipLocation || _0x11c331.location || "").trim(),
        messageId: _0x11c331.messageId || _0x11c331.liveEvent?.messageId || "",
        eventTimestamp: _0x11c331.eventTimestamp || _0x11c331.liveEvent?.occurredAt || 0,
        publishTime: _0x37361e ? normalizeAwemeCreateTimeMs(_0x11c331.publishTime ?? _0x11c331.createTime ?? _0x11c331.create_time ?? _0x1da146.publishTime ?? 0) : 0,
        publishTimeText: _0x37361e ? String(_0x11c331.publishTimeText || "").trim() : "",
        liveEvent: _0x11c331.liveEvent || null,
        liveEvents: Array.isArray(_0x11c331.liveEvents) ? _0x11c331.liveEvents : [],
        sourceType: _0x37361e ? "video" : _0x11c331.sourceType || _0x452d00,
        searchKeyword: _0x11c331.searchKeyword || "",
        entrySource: _0x11c331.entrySource || _0x1da146.entrySource || _0xbf8a22.entrySource,
        entryLabel: _0x11c331.entryLabel || _0x1da146.entryLabel || _0xbf8a22.entryLabel,
        duplicate: !!duplicate,
        ts: Date.now() + tsOffset
      };
    };
    const _0x1b38b6 = [..._0x2518ba.map((_0x2abae6, _0xe43ae2) => _0x2d4356(_0x2abae6, {
      duplicate: _0xe43ae2 >= _0x4bb387.length,
      tsOffset: _0xe43ae2
    })), ..._0x4caa0a.map((_0x1214f0, _0x2bb6ba) => _0x2d4356(_0x1214f0, {
      duplicate: true,
      tsOffset: _0x2518ba.length + _0x2bb6ba
    }))];
    if (_0x1b38b6.length) {
      _0x364631.appendLeadRecords(_0x55589f, _0x1b38b6);
    }
    const _0x593b40 = _0x505556 => _0x4bb387.filter(_0x27c889 => {
      const _0xc75e5a = Array.isArray(_0x27c889.collectedFields) ? _0x27c889.collectedFields : [];
      if (_0x505556 === "video" || _0x505556 === "author") {
        return _0xc75e5a.includes(_0x505556) || _0x505556 === "video" && ((_0x27c889.sourceType || _0x452d00) === "video" || String(_0x27c889.userKey || "").startsWith("video:")) && !_0xc75e5a.length;
      }
      return (_0x27c889.sourceType || _0x452d00) === _0x505556;
    }).length;
    const _0xbc2ed4 = {
      collected: _0x57d716 || _0x4bb387.length,
      duplicates: _0x1b2d5a,
      blogger: _0x593b40("blogger"),
      user: _0x593b40("user"),
      mutual: _0x593b40("mutual"),
      following: _0x593b40("following"),
      live: _0x593b40("live"),
      comment: _0x593b40("comment"),
      video: _0x593b40("video"),
      author: _0x593b40("author"),
      lastCycleAt: Date.now()
    };
    if (_0x57d716 || _0x1b2d5a || _0x4bb387.length || _0x5c607a.length || _0x4caa0a.length) {
      const _0x208ee7 = _0x364631.incrementStats(_0x55589f, _0xbc2ed4);
      _0x396135(_0x55589f, {
        type: "stats",
        accountId: String(_0x186842?.id || ""),
        delta: _0xbc2ed4,
        ts: Date.now()
      });
      if (_0x208ee7) {
        _0x396135(_0x55589f, {
          type: "task-updated",
          task: {
            id: _0x55589f,
            stats: _0x208ee7.stats,
            status: _0x208ee7.status
          },
          ts: Date.now()
        });
      }
    }
    if (_0x1b38b6.length) {
      _0x396135(_0x55589f, {
        type: "leads",
        ts: Date.now()
      });
    }
    return {
      synced: _0x57d716,
      updated: _0x5c607a.length,
      duplicates: _0x1b2d5a,
      inPool: _0x364976,
      alreadyCounted: _0x4131db,
      skipped: _0x34a820,
      truncated: _0x5e266b,
      received: _0x261528.length,
      duplicatePoolLabel: isEntityRelationAuthorSource(_0x452d00) ? "采集主页" : "线索库"
    };
  }
  function _0x43ff91(_0x20baed = {}) {
    return formatEntityIngestSummary(_0x20baed);
  }
  function _0x461305(_0x32fd7a, _0x584c00) {
    const _0x4bcf8b = Array.isArray(_0x32fd7a?.users) ? _0x32fd7a.users : [];
    if (!_0x4bcf8b.length) {
      return {
        synced: 0,
        duplicates: 0,
        skipped: 0,
        truncated: 0,
        received: 0
      };
    }
    return _0x22b125({
      users: _0x4bcf8b,
      account: _0x584c00.account,
      taskId: _0x584c00.taskId,
      taskName: _0x584c00.taskName,
      tasksApi: _0x584c00.tasksApi,
      knownKeys: _0x584c00.knownKeys,
      sourceType: _0x584c00.sourceType,
      progress: _0x584c00.progress,
      maxCollect: _0x584c00.maxCollect,
      generation: _0x584c00.generation
    });
  }
  async function _0x89f5d3(_0x4c4028, {
    taskId: _0x708ea6,
    accountId: _0x2bb81f,
    accountName: _0x437354,
    sourceType: _0x3c9ccd,
    searchKeyword: _0x54214b,
    maxCollect: _0x3bfe96,
    collectedThisRun: _0x4b7a0a,
    knownKeys: _0x3ceddb,
    generation = null,
    userFanCount = "0",
    userTypeFilter = "0",
    liveEventTypes = null,
    liveDurationSeconds = 180,
    skipIngest = false,
    commentFilters = null,
    targetVideoUrl = "",
    alreadyOnCurrentVideo = false,
    searchSort = "0",
    searchPublishTime = "0",
    searchDuration = "0",
    searchScope = "0",
    searchFormat = "0"
  }) {
    const _0x2938b7 = _0x3bfe96 > 0 ? Math.max(0, _0x3bfe96 - _0x4b7a0a) : 0;
    if (_0x3bfe96 > 0 && _0x2938b7 <= 0) {
      return {
        success: true,
        users: [],
        reachedLimit: true
      };
    }
    const _0x312acd = await _0x48606e(_0x4c4028, {
      taskId: _0x708ea6,
      accountId: _0x2bb81f,
      accountName: _0x437354,
      sourceType: _0x3c9ccd,
      searchKeyword: _0x54214b || "",
      maxCollect: _0x3bfe96 > 0 ? _0x2938b7 : 0,
      seenKeys: _0x3c9ccd === "video" || _0x3c9ccd === "comment" ? [] : [..._0x3ceddb],
      generation: generation,
      skipIngest: !!skipIngest,
      userFanCount: _0x3c9ccd === "user" ? String(userFanCount || "0") : "0",
      userTypeFilter: _0x3c9ccd === "user" ? String(userTypeFilter || "0") : "0",
      ...(_0x3c9ccd === "video" ? {
        searchSort: String(searchSort || "0"),
        searchPublishTime: String(searchPublishTime || "0"),
        searchDuration: String(searchDuration || "0"),
        searchScope: String(searchScope || "0"),
        searchFormat: String(searchFormat || "0")
      } : {}),
      liveEventTypes: _0x3c9ccd === "live" && Array.isArray(liveEventTypes) ? liveEventTypes : undefined,
      liveDurationSeconds: _0x3c9ccd === "live" ? liveDurationSeconds : undefined,
      commentFilters: _0x3c9ccd === "comment" && commentFilters ? commentFilters : undefined,
      targetVideoUrl: _0x3c9ccd === "comment" ? String(targetVideoUrl || "").trim() : undefined,
      alreadyOnCurrentVideo: _0x3c9ccd === "comment" ? !!alreadyOnCurrentVideo : undefined
    });
    return _0x5ccd3f(_0x4c4028, _0x312acd, _0x2938b7, {
      sourceType: _0x3c9ccd,
      userFanCount: userFanCount,
      liveEventTypes: liveEventTypes,
      commentFilters: commentFilters,
      targetVideoUrl: _0x3c9ccd === "comment" ? String(targetVideoUrl || "").trim() : ""
    });
  }
  function _0x1aefde(_0x355c6c = {}) {
    return {
      commentTimePreset: String(_0x355c6c.commentTimePreset || "all"),
      commentWindowMinutes: Number(_0x355c6c.commentWindowMinutes) || 0,
      commentLocationFilterMode: _0x355c6c.commentLocationFilterMode === "exclude" ? "exclude" : "include",
      commentLocationFilterRegions: Array.isArray(_0x355c6c.commentLocationFilterRegions) ? _0x355c6c.commentLocationFilterRegions : [],
      commentIncludeKeywords: String(_0x355c6c.commentIncludeKeywords || ""),
      commentExcludeKeywords: String(_0x355c6c.commentExcludeKeywords || "")
    };
  }
  async function _0xe58fbe(_0x2e170b, _0x3e5511, _0x5d04c0) {
    const _0xe78b8e = String(_0x3e5511.id);
    const _0xa0bd0b = _0x3e5511.nickname || _0x3e5511.name || _0xe78b8e;
    const _0xbffe5d = Math.max(0, Number(_0x3e5511.liveWorkerIndex) || 0);
    _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 开始线索采集", "info", {
      accountId: _0xe78b8e
    });
    let _0x2cc526;
    let _0x36dedb = 0;
    let _0x379707 = 0;
    let _0x3637c0 = 0;
    const _0x533aac = _0x5ea9b0.get(_0x2e170b);
    const _0x783633 = _0x533aac?.progress?.collectedThisRun || 0;
    const _0x36adf7 = () => {
      const _0x33b2f7 = _0x5ea9b0.get(_0x2e170b);
      if (!_0x33b2f7 || _0x33b2f7.generation !== _0x5d04c0) {
        return null;
      }
      return _0x33b2f7;
    };
    try {
      if (isAnonymousEntityAccountId(_0xe78b8e) && _0xbffe5d > 0) {
        await sleep(_0xbffe5d * 600);
      }
      _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 正在创建采集窗口…", "info");
      _0x2cc526 = await _0x533ade(_0xe78b8e, _0x3e5511.proxy, {
        platform: _0x3e5511.platform || "douyin",
        runtimeTaskId: _0x2e170b
      });
      if (!_0x4ec184(_0x2e170b, _0x5d04c0)) {
        return {
          collected: 0,
          duplicates: 0
        };
      }
      {
        const _0x238a49 = _0x36adf7();
        if (_0x238a49) {
          if (!_0x238a49.windowKeys) {
            _0x238a49.windowKeys = new Set();
          }
          _0x238a49.windowKeys.add(_0xe78b8e);
        }
      }
      _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 采集窗口已就绪", "info");
      const _0x18ee22 = await _0x3ca1a0(_0x2cc526, _0x2e170b, _0xa0bd0b);
      if (_0x18ee22?.ok === false) {
        throw new Error("无法准备稳定执行视口：" + (_0x18ee22.reason || "unknown"));
      }
      await _0x1f6c38(_0x2cc526, _0x2e170b);
      if (!_0x4ec184(_0x2e170b, _0x5d04c0)) {
        return {
          collected: 0,
          duplicates: 0
        };
      }
      const _0x5752bd = _0x4a3d19 => {
        const _0x405849 = Array.isArray(_0x4a3d19?.users) ? _0x4a3d19.users : [];
        const _0x2fcedd = [];
        const _0x3b9416 = new Set();
        for (const _0x22c15f of _0x405849) {
          const _0x203460 = String(_0x22c15f?.videoUrl || _0x22c15f?.userUrl || _0x22c15f?.content || _0x22c15f?.userKey || "").trim();
          const _0x2bbf40 = extractDouyinVideoId(_0x203460) || (_0x203460.startsWith("video:") ? _0x203460.slice(6) : "");
          if (!_0x2bbf40 || _0x3b9416.has(_0x2bbf40)) {
            continue;
          }
          _0x3b9416.add(_0x2bbf40);
          const _0x1cb721 = String(_0x22c15f?.title || _0x22c15f?.nickname || "").replace(/\s+/g, " ").trim();
          _0x2fcedd.push({
            url: "https://www.douyin.com/video/" + _0x2bbf40,
            title: _0x1cb721 && _0x1cb721 !== "抖音视频作品" && _0x1cb721 !== "未知视频" ? _0x1cb721 : ""
          });
        }
        return _0x2fcedd;
      };
      const _0x2b9453 = _0x1152f6 => _0x5752bd(_0x1152f6).map(_0x47697a => _0x47697a.url);
      const _0x35e20c = async (_0x3dfc6e, {
        label = "视频评论区",
        searchKeyword = "",
        videoTitleByUrl = null
      } = {}) => {
        const _0x36d173 = _0x36adf7();
        if (!_0x36d173) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const {
          config: _0x49397b,
          tasksApi: _0x2ddb6c,
          taskName: _0x31a4d9,
          knownKeys: _0x103769,
          progress: _0x41b8b9
        } = _0x36d173;
        const _0x4dbf6c = Array.isArray(_0x3dfc6e) ? _0x3dfc6e.filter(Boolean) : [];
        const _0x34be37 = videoTitleByUrl instanceof Map ? videoTitleByUrl : new Map();
        const _0x2a5d29 = String(searchKeyword || "").trim();
        const _0x368a3e = !!_0x2a5d29 && _0x2a5d29 !== "喜欢列表" && _0x2a5d29 !== "推荐页";
        const _0x24bef0 = 3;
        let _0x5c896b = {
          success: true,
          users: []
        };
        let _0x5671d6 = false;
        const _0x18e0ae = async (_0x2fbd2e, _0x3e0621, _0x155071) => {
          const _0x22c6fa = buildEntitySearchModalUrl(_0x2fbd2e, _0x2a5d29);
          if (!_0x22c6fa) {
            return {
              ok: false,
              targetUrl: toDouyinJingxuanUrl(_0x2fbd2e)
            };
          }
          _0x9d21b4(_0x2e170b, _0x155071 === 1 ? "[" + _0xa0bd0b + "] " + label + "：搜索页打开视频 (" + (_0x3e0621 + 1) + "/" + _0x4dbf6c.length + ")" : "[" + _0xa0bd0b + "] " + label + "：重新在搜索页打开 (" + _0x155071 + "/" + _0x24bef0 + ")", _0x155071 === 1 ? "info" : "warning");
          if (_0x5671d6 || _0x155071 === 1) {
            const _0x584d0c = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_OPEN_SEARCH_VIDEO", {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              accountName: _0xa0bd0b,
              generation: _0x5d04c0,
              videoUrl: _0x2fbd2e,
              searchKeyword: _0x2a5d29,
              softOnly: true
            }, 35000);
            if (_0x584d0c?.cancelled) {
              return {
                ok: false,
                cancelled: true,
                targetUrl: _0x22c6fa
              };
            }
            if (_0x584d0c?.ready || _0x584d0c?.success) {
              _0x5671d6 = true;
              return {
                ok: true,
                targetUrl: _0x22c6fa,
                openedUrl: _0x584d0c.videoUrl || _0x2fbd2e
              };
            }
            if (_0x584d0c?.navigating) {
              await sleep(2200);
              const _0x515a76 = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
                taskId: _0x2e170b,
                accountId: _0xe78b8e,
                generation: _0x5d04c0,
                videoUrl: _0x2fbd2e
              }, 25000);
              if (_0x515a76?.ready || _0x515a76?.success) {
                _0x5671d6 = true;
                return {
                  ok: true,
                  targetUrl: _0x22c6fa,
                  openedUrl: _0x515a76.videoUrl || _0x2fbd2e
                };
              }
            }
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：加载搜索详情弹层 (" + (_0x3e0621 + 1) + "/" + _0x4dbf6c.length + ")…", "info");
          if (_0x5671d6 === false && (_0x3e0621 > 0 || _0x155071 > 1)) {
            await _0x22f4bb(_0x2cc526);
          }
          try {
            await _0x44de06(_0x2cc526, _0x22c6fa);
          } catch (_0x15bb8e) {
            return {
              ok: false,
              targetUrl: _0x22c6fa,
              error: _0x15bb8e?.message || String(_0x15bb8e)
            };
          }
          await sleep(1600);
          const _0x33f12f = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
            taskId: _0x2e170b,
            accountId: _0xe78b8e,
            generation: _0x5d04c0,
            videoUrl: _0x2fbd2e
          }, 25000);
          if (_0x33f12f?.ready || _0x33f12f?.success) {
            _0x5671d6 = true;
            return {
              ok: true,
              targetUrl: _0x22c6fa,
              openedUrl: _0x33f12f.videoUrl || _0x2fbd2e
            };
          }
          return {
            ok: false,
            targetUrl: _0x22c6fa
          };
        };
        const _0x1a524b = async _0x1b789e => {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：弹层切到下一条 (" + (_0x1b789e + 1) + "/" + _0x4dbf6c.length + ")", "info");
          const _0x2fc4df = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO", {
            taskId: _0x2e170b,
            accountId: _0xe78b8e,
            accountName: _0xa0bd0b,
            generation: _0x5d04c0
          }, 40000);
          if (_0x2fc4df?.cancelled) {
            return {
              ok: false,
              cancelled: true
            };
          }
          if (_0x2fc4df?.success || _0x2fc4df?.continued) {
            return {
              ok: true,
              openedUrl: _0x2fc4df.videoUrl || ""
            };
          }
          return {
            ok: false
          };
        };
        for (let _0x54f22b = 0; _0x54f22b < _0x4dbf6c.length; _0x54f22b += 1) {
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x268e41 = _0x4dbf6c[_0x54f22b];
          const _0x1800e8 = _0x34be37.get(canonicalizeDouyinVideoUrl(_0x268e41)) || _0x34be37.get(String(_0x268e41 || "").trim()) || "";
          let _0x25b177 = {
            success: false,
            users: []
          };
          let _0x5e0bb5 = _0x368a3e ? buildEntitySearchModalUrl(_0x268e41, _0x2a5d29) || toDouyinJingxuanUrl(_0x268e41) : toDouyinJingxuanUrl(_0x268e41);
          let _0x288909 = false;
          for (let _0x253fbb = 1; _0x253fbb <= _0x24bef0; _0x253fbb += 1) {
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            if (_0x368a3e) {
              if (_0x54f22b > 0 && _0x253fbb === 1 && _0x5671d6) {
                const _0x44ef03 = await _0x1a524b(_0x54f22b);
                if (_0x44ef03.cancelled) {
                  _0x25b177 = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                if (_0x44ef03.ok) {
                  _0x288909 = true;
                  if (_0x44ef03.openedUrl) {
                    _0x5e0bb5 = _0x44ef03.openedUrl;
                  }
                }
              }
              if (!_0x288909) {
                const _0x17f4da = await _0x18e0ae(_0x268e41, _0x54f22b, _0x253fbb);
                if (_0x17f4da.cancelled) {
                  _0x25b177 = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                _0x5e0bb5 = _0x17f4da.targetUrl || _0x5e0bb5;
                _0x288909 = !!_0x17f4da.ok;
                if (_0x17f4da.openedUrl) {
                  _0x5e0bb5 = _0x17f4da.openedUrl;
                }
              }
              if (!_0x288909 && _0x253fbb >= _0x24bef0) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：搜索弹层未就绪，回退精选页打开 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")", "warning");
                _0x5e0bb5 = toDouyinJingxuanUrl(_0x268e41);
                await _0x22f4bb(_0x2cc526);
                try {
                  await _0x44de06(_0x2cc526, _0x5e0bb5);
                  _0x288909 = true;
                } catch (_0x29aef3) {
                  _0x25b177 = {
                    success: false,
                    error: _0x29aef3?.message || String(_0x29aef3),
                    users: []
                  };
                  break;
                }
              }
              if (!_0x288909) {
                await sleep(600 + _0x253fbb * 300);
                continue;
              }
            } else {
              _0x9d21b4(_0x2e170b, _0x253fbb === 1 ? "[" + _0xa0bd0b + "] " + label + "：打开视频 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")" : "[" + _0xa0bd0b + "] " + label + "：页面未进入视频，重新打开 (" + _0x253fbb + "/" + _0x24bef0 + ")", _0x253fbb === 1 ? "info" : "warning");
              if (_0x54f22b > 0 || _0x253fbb > 1) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：清理上一页后加载 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")", "info");
                await _0x22f4bb(_0x2cc526);
              }
              if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
                break;
              }
              await _0x317311(_0x2cc526, "comment", _0x5e0bb5);
              try {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：正在加载视频页 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")…", "info");
                await _0x44de06(_0x2cc526, _0x5e0bb5);
                _0x288909 = true;
              } catch (_0x3c80c9) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：打开视频失败 " + (_0x3c80c9?.message || _0x3c80c9), "warning");
                if (_0x253fbb < _0x24bef0) {
                  await _0x22f4bb(_0x2cc526);
                  await sleep(800 + _0x253fbb * 400);
                  continue;
                }
                _0x25b177 = {
                  success: false,
                  error: _0x3c80c9?.message || String(_0x3c80c9),
                  users: []
                };
                break;
              }
            }
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            const _0x48857c = _0x36adf7();
            if (!_0x48857c) {
              break;
            }
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：视频页已打开，开始采集评论区 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")", "info");
            await _0x317311(_0x2cc526, "comment", _0x5e0bb5);
            _0x25b177 = await _0x89f5d3(_0x2cc526, {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              accountName: _0xa0bd0b,
              sourceType: "comment",
              searchKeyword: _0x2a5d29 || _0x5e0bb5,
              maxCollect: _0x49397b.maxCollect,
              collectedThisRun: _0x48857c.progress.collectedThisRun,
              knownKeys: _0x103769,
              generation: _0x5d04c0,
              commentFilters: _0x1aefde(_0x49397b),
              targetVideoUrl: _0x5e0bb5
            });
            if (_0x25b177?.cancelled) {
              break;
            }
            if (_0x25b177?.videoUnavailable) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：视频失效，已跳过 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")" + (_0x25b177?.unavailableReason ? "（" + _0x25b177.unavailableReason + "）" : ""), "warning");
              _0x5671d6 = false;
              break;
            }
            if (_0x25b177?.needReload || _0x25b177?.videoNotReady) {
              _0x288909 = false;
              _0x5671d6 = false;
              if (_0x253fbb < _0x24bef0) {
                await sleep(600 + _0x253fbb * 300);
                continue;
              }
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：多次重进仍未进入视频，跳过 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ")", "warning");
            }
            break;
          }
          _0x5c896b = _0x25b177;
          if (_0x25b177?.cancelled || !_0x4ec184(_0x2e170b, _0x5d04c0)) {
            break;
          }
          if (_0x25b177?.videoUnavailable) {
            continue;
          }
          if (_0x25b177?.needReload || _0x25b177?.videoNotReady) {
            continue;
          }
          const _0x5c5b38 = canonicalizeDouyinVideoUrl(_0x5e0bb5) || canonicalizeDouyinVideoUrl(_0x268e41);
          let _0x3effff = _0x1800e8;
          if (!_0x3effff) {
            try {
              _0x3effff = await withTimeout(_0x2cc526.webContents.executeJavaScript("\n                  (() => {\n                    try {\n                      const t = typeof getVideoTitle === 'function' ? String(getVideoTitle() || '').trim() : '';\n                      return t && t !== '未知视频' ? t : '';\n                    } catch (_) { return ''; }\n                  })()\n                ", true), EXEC_JS_TIMEOUT_MS, "entity_comment_title_timeout");
            } catch (_0x47bf71) {
              _0x3effff = "";
            }
          }
          const _0x358591 = (Array.isArray(_0x25b177?.users) ? _0x25b177.users : []).map(_0x169aa6 => ({
            ..._0x169aa6,
            videoUrl: canonicalizeDouyinVideoUrl(_0x169aa6.videoUrl) || _0x5c5b38 || "",
            title: String(_0x169aa6.title || _0x169aa6.sourceVideoTitle || _0x3effff || "").trim(),
            sourceVideoTitle: String(_0x169aa6.sourceVideoTitle || _0x169aa6.title || _0x3effff || "").trim()
          }));
          const _0x5f3d14 = {
            ..._0x25b177,
            users: _0x358591
          };
          const _0xa3ddcb = _0x461305(_0x5f3d14, {
            account: _0x3e5511,
            taskId: _0x2e170b,
            taskName: _0x31a4d9,
            tasksApi: _0x2ddb6c,
            knownKeys: _0x103769,
            sourceType: "comment",
            progress: _0x41b8b9,
            maxCollect: _0x49397b.maxCollect,
            generation: _0x5d04c0
          });
          _0x36dedb += _0xa3ddcb.synced;
          _0x379707 += _0xa3ddcb.duplicates;
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + " 视频 (" + (_0x54f22b + 1) + "/" + _0x4dbf6c.length + ") 完成：" + _0x43ff91(_0xa3ddcb), entityIngestSummaryLevel(_0xa3ddcb));
        }
        return _0x5c896b;
      };
      const _0x25402a = async ({
        label = "搜索视频评论区",
        searchKeyword = "",
        alsoIngestCards = false
      } = {}) => {
        const _0x5800a5 = _0x36adf7();
        if (!_0x5800a5) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const {
          config: _0xf2d10a,
          tasksApi: _0xa4588,
          taskName: _0x966978,
          knownKeys: _0x32f0ff,
          progress: _0x426913
        } = _0x5800a5;
        const _0x658ae5 = String(searchKeyword || "").trim();
        const _0x51a394 = _0xf2d10a || {};
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：应用筛选后从第一条视频开始采集评论区", "info");
        const _0x1bd334 = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_OPEN_FIRST_SEARCH_VIDEO", {
          taskId: _0x2e170b,
          accountId: _0xe78b8e,
          accountName: _0xa0bd0b,
          generation: _0x5d04c0,
          searchKeyword: _0x658ae5,
          searchSort: _0x51a394.searchSort,
          searchPublishTime: _0x51a394.searchPublishTime,
          searchDuration: _0x51a394.searchDuration,
          searchScope: _0x51a394.searchScope,
          searchFormat: _0x51a394.searchFormat
        }, 60000);
        if (_0x1bd334?.cancelled) {
          return {
            success: false,
            cancelled: true,
            users: []
          };
        }
        let _0x248fdb = _0x1bd334;
        if (_0x248fdb?.navigating) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：等待搜索详情弹层加载…", "info");
          await sleep(2000);
          _0x248fdb = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
            taskId: _0x2e170b,
            accountId: _0xe78b8e,
            generation: _0x5d04c0,
            videoUrl: _0x248fdb.videoUrl || ""
          }, 25000);
        }
        if (!_0x248fdb?.ready && !_0x248fdb?.success) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：未能打开搜索结果第一条视频（" + (_0x248fdb?.reason || _0x248fdb?.error || "未知") + "）", "warning");
          return {
            success: false,
            users: [],
            error: _0x248fdb?.error || _0x248fdb?.reason || "open_first_failed"
          };
        }
        let _0x4a8344 = String(_0x248fdb.videoUrl || _0x1bd334?.videoUrl || "").trim();
        let _0x4fcc8d = {
          success: true,
          users: []
        };
        const _0x39784d = Math.max(20, Math.min(500, Number(_0x51a394.maxCollect) > 0 ? Number(_0x51a394.maxCollect) : 200));
        let _0x4b4586 = 0;
        for (let _0xb7f25a = 0; _0xb7f25a < _0x39784d; _0xb7f25a += 1) {
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x563e4e = _0x36adf7();
          if (!_0x563e4e) {
            break;
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：采集第 " + (_0xb7f25a + 1) + " 条视频评论区", "info");
          await _0x317311(_0x2cc526, "comment", _0x4a8344 || _0x658ae5);
          let _0x142a54 = await _0x89f5d3(_0x2cc526, {
            taskId: _0x2e170b,
            accountId: _0xe78b8e,
            accountName: _0xa0bd0b,
            sourceType: "comment",
            searchKeyword: _0x658ae5,
            targetVideoUrl: _0x4a8344,
            maxCollect: _0x563e4e.config.maxCollect,
            collectedThisRun: _0x563e4e.progress.collectedThisRun,
            knownKeys: _0x563e4e.knownKeys,
            generation: _0x5d04c0,
            commentFilters: _0x1aefde(_0x563e4e.config)
          });
          if (_0x142a54?.cancelled) {
            return {
              success: false,
              cancelled: true,
              users: []
            };
          }
          _0x4fcc8d = _0x142a54 || _0x4fcc8d;
          if (alsoIngestCards && Array.isArray(_0x142a54?.videoUsers) && _0x142a54.videoUsers.length) {
            await _0x4f9a2a({
              success: true,
              users: _0x142a54.videoUsers
            }, {
              label: label + "卡片",
              searchKeyword: _0x658ae5,
              sourceType: "video_search",
              skipComments: true
            });
          }
          const _0x31fe33 = String(_0x142a54?.videoTitle || "").trim();
          const _0x3e5cf6 = canonicalizeDouyinVideoUrl(_0x4a8344) || _0x4a8344;
          const _0x576a8d = (Array.isArray(_0x142a54?.users) ? _0x142a54.users : []).map(_0x490a42 => ({
            ..._0x490a42,
            videoUrl: canonicalizeDouyinVideoUrl(_0x490a42.videoUrl) || _0x3e5cf6 || "",
            title: String(_0x490a42.title || _0x490a42.sourceVideoTitle || _0x31fe33 || "").trim(),
            sourceVideoTitle: String(_0x490a42.sourceVideoTitle || _0x490a42.title || _0x31fe33 || "").trim()
          }));
          const _0x30f441 = _0x461305({
            ..._0x142a54,
            users: _0x576a8d
          }, {
            account: _0x3e5511,
            taskId: _0x2e170b,
            taskName: _0x966978,
            tasksApi: _0xa4588,
            knownKeys: _0x32f0ff,
            sourceType: "comment",
            progress: _0x426913,
            maxCollect: _0xf2d10a.maxCollect,
            generation: _0x5d04c0
          });
          _0x36dedb += _0x30f441.synced;
          _0x379707 += _0x30f441.duplicates;
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + " 第 " + (_0xb7f25a + 1) + " 条完成：" + _0x43ff91(_0x30f441), entityIngestSummaryLevel(_0x30f441));
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          let _0x2e10b5 = false;
          let _0x7d3dae = 0;
          while (_0x4ec184(_0x2e170b, _0x5d04c0) && !_0x5e63d3(_0x36adf7())) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：弹层切到下一条", "info");
            const _0x1fe08d = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO", {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              accountName: _0xa0bd0b,
              generation: _0x5d04c0
            }, 40000);
            if (_0x1fe08d?.cancelled) {
              return {
                success: false,
                cancelled: true,
                users: []
              };
            }
            const _0x3a7691 = String(_0x1fe08d?.videoUrl || "").trim();
            const _0x30a4c4 = extractDouyinVideoId(_0x4a8344);
            const _0x2d8591 = extractDouyinVideoId(_0x3a7691);
            const _0x191b3c = !!_0x30a4c4 && !!_0x2d8591 && _0x30a4c4 === _0x2d8591 || _0x1fe08d?.reason === "same_video";
            if (_0x191b3c) {
              _0x7d3dae += 1;
              if (_0x7d3dae >= 2) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：连续两次切条仍是同一视频，结束本词", "info");
                break;
              }
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：切条后仍是同一视频（" + _0x7d3dae + "/2），再切一次以防卡顿误判", "info");
              continue;
            }
            if (_0x1fe08d?.success || _0x1fe08d?.continued) {
              _0x4b4586 = 0;
              if (_0x1fe08d.videoUrl) {
                _0x4a8344 = String(_0x1fe08d.videoUrl).trim();
              }
              _0x2e10b5 = true;
              break;
            }
            _0x4b4586 += 1;
            if (_0x4b4586 >= 2) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：无法继续切到下一条，结束本词", "info");
              break;
            }
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：切条未成功，再试一次", "warning");
          }
          if (!_0x2e10b5) {
            break;
          }
        }
        return _0x4fcc8d;
      };
      const _0x5b6acf = async (_0x993220, _0x21eb1b) => {
        const _0x1fce3c = _0x36adf7();
        if (!_0x1fce3c || _0x5e63d3(_0x1fce3c)) {
          return {
            success: true,
            users: [],
            cancelled: !!_0x1fce3c?.stopRequested,
            reachedLimit: true
          };
        }
        const {
          config: _0x518287,
          tasksApi: _0x124d59,
          taskName: _0x37bb3c,
          knownKeys: _0x118c04,
          progress: _0x251b1b
        } = _0x1fce3c;
        let _0x29f340 = "搜索视频博主";
        if (_0x21eb1b === "user") {
          _0x29f340 = "搜索用户";
        }
        if (_0x21eb1b === "comment") {
          _0x29f340 = "视频评论区潜客";
        }
        if (_0x21eb1b === "video") {
          _0x29f340 = "视频作品链接";
        }
        const _0x1315cd = _0x21eb1b === "user" && (_0x518287.userFanCount !== "0" || _0x518287.userTypeFilter !== "0") ? "（粉丝" + ({
          0: "不限",
          1: "1000以下",
          2: "1000-1w",
          3: "1w-10w",
          4: "10w-100w",
          5: "100w以上"
        }[_0x518287.userFanCount] || "不限") + "·类型" + ({
          0: "不限",
          1: "普通用户",
          2: "企业认证",
          3: "个人认证"
        }[_0x518287.userTypeFilter] || "不限") + "）" : "";
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x29f340 + "：打开搜索页「" + _0x993220 + "」" + _0x1315cd, "info");
        await _0x317311(_0x2cc526, _0x21eb1b === "comment" ? "video" : _0x21eb1b, _0x993220);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await _0x44de06(_0x2cc526, _0x21eb1b === "user" ? buildDouyinUserSearchUrl(_0x993220, {
          userFanCount: _0x518287.userFanCount,
          userTypeFilter: _0x518287.userTypeFilter
        }) : buildDouyinSearchUrl(_0x993220, _0x480154()));
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const _0xba57ec = _0x36adf7();
        if (!_0xba57ec) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        if (_0x21eb1b === "comment") {
          _0x3637c0 += 1;
          return await _0x25402a({
            label: _0x29f340 + "「" + _0x993220 + "」",
            searchKeyword: _0x993220,
            alsoIngestCards: false
          });
        }
        const _0x3fb75c = await _0x89f5d3(_0x2cc526, {
          taskId: _0x2e170b,
          accountId: _0xe78b8e,
          accountName: _0xa0bd0b,
          sourceType: _0x21eb1b,
          searchKeyword: _0x993220,
          maxCollect: _0x518287.maxCollect,
          collectedThisRun: _0xba57ec.progress.collectedThisRun,
          knownKeys: _0x118c04,
          generation: _0x5d04c0,
          userFanCount: _0x518287.userFanCount,
          userTypeFilter: _0x518287.userTypeFilter
        });
        _0x3637c0 += 1;
        const _0x118bd2 = _0x461305(_0x3fb75c, {
          account: _0x3e5511,
          taskId: _0x2e170b,
          taskName: _0x37bb3c,
          tasksApi: _0x124d59,
          knownKeys: _0x118c04,
          sourceType: _0x21eb1b,
          progress: _0x251b1b,
          maxCollect: _0x518287.maxCollect,
          generation: _0x5d04c0
        });
        _0x36dedb += _0x118bd2.synced;
        _0x379707 += _0x118bd2.duplicates;
        if (!_0x3fb75c.success && !_0x3fb75c.cancelled && !_0x118bd2.received) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x29f340 + "「" + _0x993220 + "」失败：" + (_0x3fb75c.error || "未知错误"), "error");
        } else {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x29f340 + "「" + _0x993220 + "」完成：" + _0x43ff91(_0x118bd2) + (_0x3fb75c.cancelled ? "（提前结束，已入库已采数据）" : ""), entityIngestSummaryLevel(_0x118bd2));
        }
        return _0x3fb75c;
      };
      const _0xa9175a = async _0x4d5d51 => {
        const _0xfefdde = _0x4d5d51 === "following" ? "following" : "mutual";
        const _0x2fe593 = _0xfefdde === "following" ? "关注列表" : "相互关注";
        const _0x1f1bc = _0x36adf7();
        if (!_0x1f1bc || !_0x1f1bc.config.sourceTypes.includes(_0xfefdde)) {
          return null;
        }
        if (_0x1f1bc.stopRequested || _0x5e63d3(_0x1f1bc)) {
          return null;
        }
        const {
          config: _0x1a0425,
          tasksApi: _0x2fccaf,
          taskName: _0x28d0a2,
          knownKeys: _0x463d6e,
          progress: _0x326619
        } = _0x1f1bc;
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x2fe593 + "：打开当前账号主页", "info");
        await _0x317311(_0x2cc526, _0xfefdde, "");
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await _0x44de06(_0x2cc526, DOUYIN_SELF_PROFILE_URL);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const _0x267697 = _0x36adf7();
        if (!_0x267697) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const _0x4ba05b = await _0x89f5d3(_0x2cc526, {
          taskId: _0x2e170b,
          accountId: _0xe78b8e,
          accountName: _0xa0bd0b,
          sourceType: _0xfefdde,
          searchKeyword: "",
          maxCollect: _0x1a0425.maxCollect,
          collectedThisRun: _0x267697.progress.collectedThisRun,
          knownKeys: _0x463d6e,
          generation: _0x5d04c0
        });
        const _0x2ad35a = _0x461305(_0x4ba05b, {
          account: _0x3e5511,
          taskId: _0x2e170b,
          taskName: _0x28d0a2,
          tasksApi: _0x2fccaf,
          knownKeys: _0x463d6e,
          sourceType: _0xfefdde,
          progress: _0x326619,
          maxCollect: _0x1a0425.maxCollect,
          generation: _0x5d04c0
        });
        _0x36dedb += _0x2ad35a.synced;
        _0x379707 += _0x2ad35a.duplicates;
        if (!_0x4ba05b.success && !_0x4ba05b.cancelled && !_0x2ad35a.received) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x2fe593 + "失败：" + (_0x4ba05b.error || "未知错误"), "error");
        } else {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + _0x2fe593 + "完成：" + _0x43ff91(_0x2ad35a) + (_0x4ba05b.cancelled ? "（提前结束，已入库已采数据）" : ""), entityIngestSummaryLevel(_0x2ad35a));
        }
        return _0x4ba05b;
      };
      const _0x26606b = async () => _0xa9175a("mutual");
      const _0x4e7b1f = async () => _0xa9175a("following");
      const _0x16e958 = async () => {
        if (_0x3e5511.liveWorkerEnabled === false) {
          return null;
        }
        while (true) {
          const _0x395168 = _0x36adf7();
          if (!_0x395168 || !_0x395168.config.sourceTypes.includes("live")) {
            return null;
          }
          if (_0x395168.stopRequested || _0x5e63d3(_0x395168)) {
            return null;
          }
          const _0x5c6938 = Array.isArray(_0x395168.config.liveUrls) ? _0x395168.config.liveUrls : [];
          if ((Number(_0x395168.nextLiveUrlIndex) || 0) >= _0x5c6938.length) {
            return null;
          }
          if (!(await _0x25efc1(_0x2e170b, _0x5d04c0, _0xbffe5d))) {
            return null;
          }
          const _0x363389 = _0x37cbb4(_0x36adf7());
          if (!_0x363389) {
            return null;
          }
          const _0x39f257 = _0x36adf7();
          if (!_0x39f257) {
            return null;
          }
          const {
            config: _0x18ed02,
            tasksApi: _0x37e03c,
            taskName: _0x10f145,
            knownKeys: _0x464716,
            progress: _0x4a0b95
          } = _0x39f257;
          const _0x59a76f = await _0x4cd8c8(_0x363389.rawUrl);
          if (!_0x59a76f) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 直播间链接无效，已跳过：" + String(_0x363389.rawUrl || "").slice(0, 80), "warning");
            continue;
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 领取直播间 " + (_0x363389.index + 1) + "/" + _0x363389.total + "：正在打开 " + _0x59a76f, "info");
          await _0x317311(_0x2cc526, "live", "");
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          let _0xdc1566 = null;
          try {
            await _0x44de06(_0x2cc526, _0x59a76f);
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            const _0x3c60c0 = _0x36adf7();
            if (!_0x3c60c0) {
              break;
            }
            _0xdc1566 = await _0x89f5d3(_0x2cc526, {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              accountName: _0xa0bd0b,
              sourceType: "live",
              searchKeyword: _0x59a76f,
              maxCollect: _0x18ed02.maxCollect,
              collectedThisRun: _0x3c60c0.progress.collectedThisRun,
              knownKeys: _0x464716,
              generation: _0x5d04c0,
              liveEventTypes: _0x18ed02.liveEventTypes,
              liveDurationSeconds: _0x18ed02.liveDurationSeconds
            });
          } catch (_0x27d0f1) {
            if (!_0x2cc526 || _0x2cc526.isDestroyed() || !_0x4ec184(_0x2e170b, _0x5d04c0)) {
              throw _0x27d0f1;
            }
            const _0x40e523 = String(_0x27d0f1?.message || _0x27d0f1 || "未知错误").slice(0, 120);
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 直播间打开失败，已跳过：" + _0x59a76f + "（" + _0x40e523 + "）", "warning");
            _0x28e1c2(_0x2e170b, _0x37e03c, {
              url: _0x59a76f,
              reason: "live_unreachable",
              message: "直播间打开失败，已跳过（" + _0x40e523 + "）"
            });
            continue;
          }
          const _0x2b1fc6 = _0x461305(_0xdc1566, {
            account: _0x3e5511,
            taskId: _0x2e170b,
            taskName: _0x10f145,
            tasksApi: _0x37e03c,
            knownKeys: _0x464716,
            sourceType: "live",
            progress: _0x4a0b95,
            maxCollect: _0x18ed02.maxCollect,
            generation: _0x5d04c0
          });
          _0x36dedb += _0x2b1fc6.synced;
          _0x379707 += _0x2b1fc6.duplicates;
          if (_0xdc1566.ended) {
            const _0x489b2 = _0xdc1566.endReason === "live_private";
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + (_0xdc1566.message || (_0x489b2 ? "直播间为私密或隐私设置，已跳过" : "直播间已经结束")) + "：" + _0x59a76f, "warning");
            if (_0x489b2) {
              _0x28e1c2(_0x2e170b, _0x37e03c, {
                url: _0x59a76f,
                reason: "live_private",
                message: String(_0xdc1566.message || "").replace(/^⏭\s*/, "").replace(/，已退出当前直播间监控$/, "") || "直播间为私密或隐私设置，已跳过"
              });
            }
            continue;
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 直播间「" + _0x59a76f + "」采集完成：" + _0x43ff91(_0x2b1fc6), entityIngestSummaryLevel(_0x2b1fc6));
        }
      };
      const _0x4f9a2a = async (_0xb53baf, {
        label = "视频列表",
        searchKeyword = "",
        sourceType = "video",
        skipComments = false,
        maxCollectOverride = null,
        skipLocalFilter = false
      } = {}) => {
        const _0x5d7218 = _0x36adf7();
        if (!_0x5d7218 || !_0xb53baf) {
          return _0xb53baf;
        }
        const _0x320e72 = _0x3c2c48(_0x5d7218.config, "video") || _0x3c2c48(_0x5d7218.config, "author");
        if (_0x320e72 && Array.isArray(_0xb53baf.users) && _0xb53baf.users.length) {
          const _0x4742ce = _0xb53baf.users;
          const _0x52af7d = String(sourceType || "") === "video_search" || String(_0x5d7218.config?.sourceTypes?.[0] || "") === "video_search";
          const _0x434bfd = _0x4742ce;
          const _0x49fd3f = skipLocalFilter ? _0x434bfd : _0x4c8c61(_0x434bfd, _0x5d7218.config);
          if (!skipLocalFilter && _0x49fd3f.length < _0x4742ce.length) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：本地过滤去掉 " + (_0x4742ce.length - _0x49fd3f.length) + "/" + _0x4742ce.length + " 条视频卡片", "info");
          }
          const _0x322219 = getEntityEntryMeta(sourceType || "video");
          const _0xc1b28c = _0x3ba01a(_0x49fd3f, _0x5d7218.config).map(_0x4ee280 => {
            const _0x273c8a = _0x52af7d ? enrichVideoPublishTime(_0x4ee280) : _0x4ee280;
            return {
              ..._0x273c8a,
              sourceType: "video",
              identityType: "video",
              entrySource: _0x4ee280.entrySource || _0x322219.entrySource,
              entryLabel: _0x4ee280.entryLabel || _0x322219.entryLabel,
              searchKeyword: searchKeyword || _0x4ee280.searchKeyword || ""
            };
          });
          if (_0x52af7d && _0xc1b28c[0]) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 搜索视频发布时间 " + JSON.stringify(buildVideoPublishTimeLogJson(_0xc1b28c[0])), "info");
          }
          if (!_0xc1b28c.length) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "卡片入库：0 条（勾选=" + ((_0x5d7218.config.scrapeTargets || []).join("+") || "无") + "，过滤后无有效卡片）", "warning");
          }
          const _0x202518 = {
            ..._0xb53baf,
            users: _0xc1b28c
          };
          const _0x58cf7a = maxCollectOverride != null ? Number(maxCollectOverride) || 0 : _0x5d7218.config.maxCollect;
          const _0x2cebd7 = _0xc1b28c.length ? _0x461305(_0x202518, {
            account: _0x3e5511,
            taskId: _0x2e170b,
            taskName: _0x5d7218.taskName,
            tasksApi: _0x5d7218.tasksApi,
            knownKeys: _0x5d7218.knownKeys,
            sourceType: "video",
            progress: _0x5d7218.progress,
            maxCollect: _0x58cf7a,
            generation: _0x5d04c0
          }) : {
            synced: 0,
            duplicates: 0,
            skipped: 0,
            truncated: 0,
            received: 0
          };
          _0x36dedb += _0x2cebd7.synced;
          _0x379707 += _0x2cebd7.duplicates;
          const _0x197342 = _0x43ff91(_0x2cebd7);
          const _0x4742c9 = _0xc1b28c[0]?.collectedFields?.length ? "，字段 " + _0xc1b28c[0].collectedFields.join("+") : "";
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "卡片入库：" + _0x197342 + _0x4742c9 + (Number(_0x2cebd7.synced || 0) === 0 && Number(_0x2cebd7.duplicates || 0) > 0 ? "（已在库，已跳过）" : Number(_0x2cebd7.synced || 0) === 0 && Number(_0x2cebd7.duplicates || 0) === 0 && Number(_0x2cebd7.received || 0) === 0 ? "（本条未计入，可能被筛选规则过滤）" : ""), entityIngestSummaryLevel(_0x2cebd7));
        } else if (Array.isArray(_0xb53baf.users) && _0xb53baf.users.length) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：未勾选视频链接/作者主页，跳过卡片入库（勾选=" + ((_0x5d7218.config.scrapeTargets || []).join("+") || "无") + "）", "info");
        }
        if (!skipComments && _0x3c2c48(_0x5d7218.config, "comments")) {
          const _0x499900 = _0x5752bd(_0xb53baf);
          if (!_0x499900.length) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：未找到可打开的视频（评论区跳过）", "warning");
            return _0xb53baf;
          }
          const _0x354ec4 = new Map();
          _0x499900.forEach(_0x3fa1b7 => {
            const _0x4f7dd4 = canonicalizeDouyinVideoUrl(_0x3fa1b7.url) || _0x3fa1b7.url;
            if (_0x4f7dd4 && _0x3fa1b7.title) {
              _0x354ec4.set(_0x4f7dd4, _0x3fa1b7.title);
            }
          });
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] " + label + "：找到 " + _0x499900.length + " 个视频，开始采集评论区", "info");
          return await _0x35e20c(_0x499900.map(_0x29d4d9 => _0x29d4d9.url), {
            label: label + "评论区",
            searchKeyword: searchKeyword,
            videoTitleByUrl: _0x354ec4
          });
        }
        return _0xb53baf;
      };
      const _0x114075 = async () => {
        const _0x4c1780 = _0x36adf7();
        if (!_0x4c1780 || _0x4c1780.stopRequested || _0x5e63d3(_0x4c1780)) {
          return null;
        }
        const _0x58137f = "https://www.douyin.com/user/self?showTab=like";
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 喜欢列表：打开点赞作品列表", "info");
        await _0x317311(_0x2cc526, "video", "like");
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return null;
        }
        await _0x44de06(_0x2cc526, _0x58137f);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return null;
        }
        const _0x1595b = _0x36adf7();
        if (!_0x1595b) {
          return null;
        }
        const _0x2bc410 = await _0x89f5d3(_0x2cc526, {
          taskId: _0x2e170b,
          accountId: _0xe78b8e,
          accountName: _0xa0bd0b,
          sourceType: "video",
          searchKeyword: "喜欢列表",
          maxCollect: _0x1595b.config.maxCollect,
          collectedThisRun: _0x1595b.progress.collectedThisRun,
          knownKeys: _0x1595b.knownKeys,
          generation: _0x5d04c0,
          skipIngest: false
        });
        return await _0x4f9a2a(_0x2bc410, {
          label: "喜欢列表",
          searchKeyword: "喜欢列表",
          sourceType: "video_like"
        });
      };
      const _0x163241 = async () => {
        const _0x3d1348 = _0x36adf7();
        if (!_0x3d1348 || _0x3d1348.stopRequested) {
          return null;
        }
        const _0x1b1612 = "https://www.douyin.com/?recommend=1&from_nav=1";
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：从当前第一条视频开始逐条识别", "info");
        const _0x2cd09e = await _0x3ca1a0(_0x2cc526, _0x2e170b, _0xa0bd0b);
        if (_0x2cd09e?.ok === false) {
          throw new Error("推荐页执行视口未就绪：" + (_0x2cd09e.reason || "unknown"));
        }
        await _0x317311(_0x2cc526, "video", "recommend");
        if (!_0x4ec184(_0x2e170b, _0x5d04c0)) {
          return null;
        }
        await _0x44de06(_0x2cc526, _0x1b1612);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0)) {
          return null;
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：页面刚打开，额外等待约 10 秒让首屏稳定…", "info");
        await sleep(10000);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0)) {
          return null;
        }
        const _0x78c436 = _0x36adf7();
        if (!_0x78c436) {
          return null;
        }
        const _0x17bcbe = _0x3c2c48(_0x78c436.config, "video") || _0x3c2c48(_0x78c436.config, "author");
        const _0x5901ea = _0x3c2c48(_0x78c436.config, "author");
        const _0x2f222b = _0x3c2c48(_0x78c436.config, "comments");
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页采集内容：" + ((_0x78c436.config.scrapeTargets || []).join("+") || "无") + ("（卡片=" + (_0x17bcbe ? "是" : "否") + "，评论=" + (_0x2f222b ? "是" : "否") + "）"), "info");
        const _0x2add2e = new Set();
        let _0x5dc082 = 0;
        let _0x1c549a = 0;
        let _0x1fcac3 = 0;
        let _0x48d7e8 = 0;
        let _0x158f5e = 0;
        let _0x399433 = 0;
        let _0x5b17c2 = 0;
        let _0x2d4465 = null;
        let _0x525cf1 = "";
        const _0x5bc1c2 = Number(_0x78c436.config.maxCollect) > 0 ? Number(_0x78c436.config.maxCollect) : 100;
        const _0x58b10a = Math.max(30, Math.min(2000, _0x5bc1c2 * 4));
        const _0x2c1d63 = () => _0x1c549a >= _0x5bc1c2;
        const _0x4e1d4f = () => {
          const _0xccf92c = _0x36adf7();
          if (!_0xccf92c || _0xccf92c.limitReached) {
            return;
          }
          _0xccf92c.limitReached = true;
          _0xccf92c.limitKind = "link_count";
        };
        const _0x2a5592 = async _0x5b2440 => {
          if (_0x399433 >= 3 || !_0x4ec184(_0x2e170b, _0x5d04c0)) {
            return false;
          }
          _0x399433 += 1;
          _0x2d4465 = null;
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：" + _0x5b2440 + "，正在重新进入推荐流恢复画面（" + _0x399433 + "/3）", "warning");
          try {
            _0x5dc34d(_0x2cc526);
            await _0x317311(_0x2cc526, "video", "recommend_recover_" + _0x399433);
            await _0x44de06(_0x2cc526, _0x1b1612);
            _0x158f5e = 0;
            return _0x4ec184(_0x2e170b, _0x5d04c0);
          } catch (_0x4c3e5e) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：恢复失败 " + (_0x4c3e5e?.message || _0x4c3e5e), "warning");
            return false;
          }
        };
        const _0x441b5e = _0xbfe78d => {
          const _0x24a172 = _0xbfe78d?.nextSnapshot;
          if (_0x24a172 && _0x24a172.ready) {
            _0x2d4465 = _0x24a172;
            _0x158f5e = 0;
            return true;
          }
          return !!_0xbfe78d?.success || !!_0xbfe78d?.continued;
        };
        const _0x3ae32d = async (_0x40afed, _0x1a78a3, _0x518910, {
          skipLive = false
        } = {}) => {
          const _0x542238 = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_MOVE_NEXT_RECOMMEND_VIDEO", {
            taskId: _0x2e170b,
            accountId: _0xe78b8e,
            accountName: _0xa0bd0b,
            generation: _0x5d04c0,
            runningSource: "recommend",
            skipLive: skipLive,
            previousIdentity: _0x40afed.identity || "",
            previousTitle: _0x40afed.title || "",
            previousVideoId: _0x1a78a3,
            previousVideoUrl: _0x518910 || _0x40afed.videoUrl || "",
            previousAuthor: _0x40afed.authorNickname || ""
          }, 40000);
          if (_0x542238?.cancelled) {
            return {
              cancelled: true
            };
          }
          if (!_0x441b5e(_0x542238)) {
            _0x158f5e += 1;
            _0x9d21b4(_0x2e170b, skipLive ? "[" + _0xa0bd0b + "] 推荐页：直播间跳过未生效（" + _0x158f5e + "/3）" : "[" + _0xa0bd0b + "] 推荐页：切换下一条未确认（" + _0x158f5e + "/3），将再核对当前画面", "warning");
            if (_0x158f5e >= 3) {
              const _0x29f023 = await _0x2a5592(skipLive ? "连续无法跳过直播间" : "连续切换下一条未响应");
              if (!_0x29f023) {
                return {
                  cancelled: true
                };
              }
            }
          }
          return {
            cancelled: false
          };
        };
        while (_0x5dc082 < _0x58b10a && _0x4ec184(_0x2e170b, _0x5d04c0) && !_0x2c1d63()) {
          const _0x1435ee = _0x36adf7();
          if (!_0x1435ee) {
            break;
          }
          let _0x38161c = _0x2d4465;
          _0x2d4465 = null;
          if (!_0x38161c?.ready) {
            for (let _0x4d7f8f = 1; _0x4d7f8f <= 3; _0x4d7f8f += 1) {
              if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x2c1d63()) {
                break;
              }
              if (_0x4d7f8f === 2) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：加载时间较长，重新进入推荐页后继续等待", "warning");
                _0x5dc34d(_0x2cc526);
                await _0x317311(_0x2cc526, "video", "recommend_retry");
                await _0x44de06(_0x2cc526, _0x1b1612);
              } else if (_0x4d7f8f === 3) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：页面仍在缓冲，延长等待当前第一条作品", "info");
                _0x5dc34d(_0x2cc526);
              }
              _0x38161c = await _0x176869(_0x2cc526, "ENTITY_LEADGEN_INSPECT_RECOMMEND_VIDEO", {
                taskId: _0x2e170b,
                accountId: _0xe78b8e,
                accountName: _0xa0bd0b,
                generation: _0x5d04c0,
                runningSource: "recommend",
                wantAuthor: _0x5901ea,
                maxWaitMs: _0x5dc082 === 0 && _0x4d7f8f === 1 ? 30000 : 20000,
                quietReady: _0x5dc082 > 0
              }, _0x5dc082 === 0 && _0x4d7f8f === 1 ? 45000 : 35000);
              if (_0x38161c?.cancelled || _0x38161c?.success && _0x38161c?.ready) {
                break;
              }
              if (_0x4d7f8f === 1) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：当前作品加载较慢，将自动重试，不会按 0 条直接结束", "info");
              }
            }
          }
          if (_0x38161c?.cancelled) {
            break;
          }
          if (!_0x38161c?.success || !_0x38161c?.ready) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：已等待并重试约 60 秒，当前视频仍未就绪，停止本轮采集", "warning");
            break;
          }
          _0x5dc082 += 1;
          const _0x2e6699 = String(_0x38161c.videoId || extractDouyinVideoId(_0x38161c.videoUrl) || "").trim();
          if (_0x525cf1 && _0x2e6699 && _0x2e6699 !== _0x525cf1) {
            _0x158f5e = 0;
          }
          if (_0x38161c.live) {
            _0x1fcac3 += 1;
            const _0x22f704 = await _0x3ae32d(_0x38161c, _0x2e6699, _0x38161c.videoUrl || "", {
              skipLive: true
            });
            if (_0x22f704.cancelled) {
              break;
            }
            continue;
          }
          const _0x433f3d = _0x2e6699;
          const _0x346ed1 = String(_0x38161c.videoUrl || (_0x433f3d ? "https://www.douyin.com/video/" + _0x433f3d : "")).trim();
          _0x525cf1 = _0x433f3d || _0x525cf1;
          if (!_0x433f3d || !_0x346ed1) {
            _0x5b17c2 += 1;
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：当前作品链接未识别，直接切换下一条", "warning");
          } else if (_0x2add2e.has(_0x433f3d) || _0x1435ee.knownKeys?.has("video:" + _0x433f3d)) {
            _0x48d7e8 += 1;
            if (!_0x2add2e.has(_0x433f3d)) {
              _0x2add2e.add(_0x433f3d);
            }
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：当前作品已分析，跳过且不计入链接数", "info");
          } else {
            _0x2add2e.add(_0x433f3d);
            _0x1c549a += 1;
            const _0x12d4c7 = Number(_0x1435ee.progress.collectedThisRun) || 0;
            const _0xe426a4 = String(_0x38161c.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：识别第 " + _0x1c549a + "/" + _0x5bc1c2 + " 条作品" + (_0xe426a4 ? "「" + _0xe426a4 + "」" : ""), "info");
            if (_0x17bcbe) {
              try {
                let _0x2a89c7 = String(_0x38161c.authorNickname || "").trim().replace(/^@+/, "");
                let _0x5bc49a = String(_0x38161c.authorUrl || "").trim();
                const _0x5b5c23 = /^\d{10,}$/.test(_0x433f3d) ? _0x433f3d : extractDouyinVideoId(_0x346ed1) || "";
                if (_0x5901ea && !/\/user\//i.test(_0x5bc49a)) {
                  try {
                    let _0x2e4627 = await _0x51be1d(_0x346ed1 || _0x5b5c23);
                    if (!_0x2e4627?.userUrl) {
                      await sleep(900);
                      _0x2e4627 = await _0x51be1d(_0x346ed1 || _0x5b5c23);
                    }
                    _0x5bc49a = String(_0x2e4627?.userUrl || "").trim() || _0x5bc49a;
                    _0x2a89c7 = String(_0x2e4627?.nickname || "").trim().replace(/^@+/, "") || _0x2a89c7;
                  } catch (_0x25269b) {
                    _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：读取作者主页失败 " + (_0x25269b?.message || _0x25269b), "warning");
                  }
                  if (!/\/user\//i.test(_0x5bc49a) && _0x5b5c23) {
                    try {
                      const _0x3d6d54 = _0x2cc526?.__radarEntityNetworkCapture?.findVideoUser?.(_0x5b5c23);
                      if (_0x3d6d54?.authorProfileUrl && /\/user\//i.test(_0x3d6d54.authorProfileUrl)) {
                        _0x5bc49a = String(_0x3d6d54.authorProfileUrl).trim();
                        _0x2a89c7 = String(_0x3d6d54.authorNickname || "").trim().replace(/^@+/, "") || _0x2a89c7;
                        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：已从网络包补齐作者主页", "info");
                      }
                    } catch (_0x43bf1f) {}
                  }
                  if (!/\/user\//i.test(_0x5bc49a)) {
                    _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：未识别到作者主页，主页本条未入库（视频链接仍会入库）", "warning");
                  }
                }
                if (!_0x5b5c23) {
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：作品 ID 无效，跳过卡片入库（" + (_0x433f3d || _0x346ed1) + "）", "warning");
                } else {
                  const _0x353133 = "https://www.douyin.com/video/" + _0x5b5c23;
                  await _0x4f9a2a({
                    success: true,
                    users: [{
                      nickname: _0x38161c.title || "抖音视频作品",
                      title: _0x38161c.title || "抖音视频作品",
                      userUrl: _0x353133,
                      videoUrl: _0x353133,
                      userKey: "video:" + _0x5b5c23,
                      content: _0x353133,
                      sourceType: "video",
                      identityType: "video",
                      entrySource: "entity_video_recommend",
                      entryLabel: "线索采集：推荐页",
                      searchKeyword: "推荐页",
                      authorNickname: _0x2a89c7,
                      authorProfileUrl: _0x5bc49a,
                      likeCount: Number(_0x38161c.likeCount) || 0,
                      commentCount: Number(_0x38161c.commentCount) || 0,
                      collectCount: Number(_0x38161c.collectCount) || 0,
                      shareCount: Number(_0x38161c.shareCount) || 0
                    }]
                  }, {
                    label: "推荐页第 " + _0x1c549a + " 条",
                    searchKeyword: "推荐页",
                    sourceType: "video_recommend",
                    skipComments: true,
                    maxCollectOverride: 0,
                    skipLocalFilter: true
                  });
                }
              } catch (_0x13df4b) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：卡片入库异常 " + (_0x13df4b?.message || _0x13df4b), "error");
              }
            }
            if (_0x2f222b) {
              const _0x370ae1 = _0x36adf7();
              if (!_0x370ae1) {
                break;
              }
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：采集当前作品评论区", "info");
              const _0x415c7a = await _0x89f5d3(_0x2cc526, {
                taskId: _0x2e170b,
                accountId: _0xe78b8e,
                accountName: _0xa0bd0b,
                sourceType: "comment",
                searchKeyword: _0x346ed1,
                targetVideoUrl: _0x346ed1,
                alreadyOnCurrentVideo: true,
                maxCollect: 0,
                collectedThisRun: _0x370ae1.progress.collectedThisRun,
                knownKeys: _0x370ae1.knownKeys,
                generation: _0x5d04c0,
                skipIngest: false,
                commentFilters: _0x1aefde(_0x370ae1.config)
              });
              const _0x2ef83a = _0x36adf7();
              if (!_0x2ef83a) {
                break;
              }
              const _0xb37949 = _0x461305(_0x415c7a, {
                account: _0x3e5511,
                taskId: _0x2e170b,
                taskName: _0x2ef83a.taskName,
                tasksApi: _0x2ef83a.tasksApi,
                knownKeys: _0x2ef83a.knownKeys,
                sourceType: "video_recommend",
                progress: _0x2ef83a.progress,
                maxCollect: 0,
                generation: _0x5d04c0
              });
              _0x36dedb += _0xb37949.synced;
              _0x379707 += _0xb37949.duplicates;
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页当前作品评论区：" + _0x43ff91(_0xb37949), entityIngestSummaryLevel(_0xb37949));
              if (_0x415c7a?.cancelled && _0x36adf7()?.stopRequested) {
                break;
              }
            }
            const _0x1c915f = Number(_0x36adf7()?.progress?.collectedThisRun) || _0x12d4c7;
            _0x5b17c2 = _0x1c915f > _0x12d4c7 ? 0 : _0x5b17c2 + 1;
          }
          if (_0x2c1d63()) {
            _0x4e1d4f();
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：已达到采集链接数 " + _0x5bc1c2 + "，结束本轮", "info");
            break;
          }
          if (_0x5b17c2 >= 20) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页：连续 20 条没有新增线索，结束本轮采集", "info");
            break;
          }
          const _0x756be3 = await _0x3ae32d(_0x38161c, _0x433f3d, _0x346ed1);
          if (_0x756be3.cancelled) {
            break;
          }
        }
        if (_0x2c1d63()) {
          _0x4e1d4f();
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 推荐页本轮完成：识别 " + _0x1c549a + "/" + _0x5bc1c2 + " 条作品，跳过直播 " + _0x1fcac3 + "、已分析 " + _0x48d7e8, "success");
        return {
          success: true,
          users: [],
          processedVideos: _0x1c549a,
          skippedLives: _0x1fcac3,
          skippedAnalyzed: _0x48d7e8
        };
      };
      const _0x51be1d = async (_0x10a011 = "", _0x1ae5d7 = {}) => {
        const _0x4edd83 = {
          nickname: "",
          userUrl: "",
          secUid: "",
          title: "",
          publishTimeMs: 0,
          publishTimeText: ""
        };
        if (!_0x2cc526 || _0x2cc526.isDestroyed() || _0x2cc526.webContents.isDestroyed()) {
          return _0x4edd83;
        }
        const _0x25ea37 = String(_0x10a011 || "").trim();
        const _0x3b1423 = buildDouyinVideoPublishTimeScrapeExpression({
          rejectPublishTimeTexts: Array.isArray(_0x1ae5d7?.rejectPublishTimeTexts) ? _0x1ae5d7.rejectPublishTimeTexts : []
        });
        try {
          const _0x3c17a4 = await withTimeout(_0x2cc526.webContents.executeJavaScript("\n              (() => {\n                try {\n                  const expected = " + JSON.stringify(_0x25ea37) + ";\n                  try {\n                    if (typeof ensureLeadgenScrapeApiHook === 'function') {\n                      ensureLeadgenScrapeApiHook({ force: true });\n                    }\n                  } catch (_) {}\n                  let fromApi = null;\n                  try {\n                    if (expected && typeof lookupLeadgenScrapeAweme === 'function') {\n                      fromApi = lookupLeadgenScrapeAweme(expected);\n                    }\n                  } catch (_) {}\n                  const filter = typeof resolveEntityVideoAuthorFilter === 'function'\n                    ? resolveEntityVideoAuthorFilter(document.body)\n                    : null;\n                  let title = '';\n                  try {\n                    if (typeof getVideoTitle === 'function') {\n                      const t = String(getVideoTitle() || '').trim();\n                      if (t && t !== '未知视频') title = t;\n                    }\n                  } catch (_) {}\n                  const apiUrl = String(fromApi?.authorUrl || '').trim();\n                  const filterUrl = String(filter?.userUrl || '').trim();\n                  const userUrl = apiUrl || filterUrl;\n                  const nickname = String(fromApi?.authorNickname || filter?.nickname || '')\n                    .trim()\n                    .replace(/^@+/, '');\n                  const secUid = String(filter?.secUid || '').trim()\n                    || (userUrl.match(/\\/user\\/([^/?#]+)/i)?.[1] || '');\n                  let publishTimeMs = Number(\n                    fromApi?.createTime || fromApi?.create_time || fromApi?.publishTime || 0,\n                  ) || 0;\n                  if (publishTimeMs > 0 && publishTimeMs < 1e12) publishTimeMs *= 1000;\n                  let publishTimeText = '';\n                  let publishTimeSource = publishTimeMs > 0 ? 'api' : '';\n                  // DOM：昵称旁 / create-time；相对时间优先；可压低上一条残留文案\n                  try {\n                    const pub = " + _0x3b1423 + ";\n                    const domMs = Number(pub && pub.publishTimeMs) || 0;\n                    const domText = String((pub && pub.publishTimeText) || '').trim();\n                    const domSource = String((pub && pub.source) || '');\n                    if (domMs > 0 && domText && !/^(rejected_|stale_)/.test(domSource)) {\n                      publishTimeMs = domMs;\n                      publishTimeText = domText;\n                      publishTimeSource = domSource || 'dom';\n                    }\n                  } catch (_) { /* ignore */ }\n                  return {\n                    nickname,\n                    userUrl,\n                    secUid,\n                    title: String(fromApi?.title || title || '').trim(),\n                    fromApi: !!apiUrl,\n                    publishTimeMs,\n                    publishTimeText,\n                    publishTimeSource,\n                  };\n                } catch (e) {\n                  return {\n                    nickname: '',\n                    userUrl: '',\n                    secUid: '',\n                    title: '',\n                    publishTimeMs: 0,\n                    publishTimeText: '',\n                    error: String(e && e.message || e),\n                  };\n                }\n              })()\n            ", true), Math.max(EXEC_JS_TIMEOUT_MS, 8000), "entity_capture_author_timeout");
          if (!_0x3c17a4 || typeof _0x3c17a4 !== "object") {
            return _0x4edd83;
          }
          const _0x4a5740 = normalizeAwemeCreateTimeMs(_0x3c17a4.publishTimeMs || 0) || parseDouyinRelativePublishTimeMs(_0x3c17a4.publishTimeText || "");
          return {
            ..._0x4edd83,
            ..._0x3c17a4,
            publishTimeMs: _0x4a5740,
            publishTimeText: String(_0x3c17a4.publishTimeText || "").trim()
          };
        } catch (_0x27704e) {
          return _0x4edd83;
        }
      };
      const _0x5508c7 = async () => {
        const _0x2c6a38 = _0x36adf7();
        if (!_0x2c6a38 || _0x2c6a38.stopRequested || _0x5e63d3(_0x2c6a38)) {
          return null;
        }
        const _0x4833b0 = _0x2c6a38.config || {};
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 正在解析指定博主主页…", "info");
        const _0x1fe7d3 = await resolveBloggerProfileUrls(_0x4833b0.bloggerProfileUrls);
        if (!_0x1fe7d3.length) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：未找到有效主页链接", "warning");
          return null;
        }
        const _0x118a23 = normalizeBloggerWorkSelectMode(_0x4833b0.bloggerWorkSelectMode);
        const _0x20a7c0 = _0x4833b0.bloggerExcludePinned !== false;
        const _0x94063d = _0x118a23 === "count" ? "前 " + normalizeBloggerWorkCount(_0x4833b0.bloggerWorkCount) + " 条" : normalizeBloggerPublishWithinDays(_0x4833b0.bloggerPublishWithinDays) + " 天内";
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：" + _0x1fe7d3.length + " 个主页，作品筛选=" + _0x94063d + (_0x20a7c0 ? "（排除置顶）" : "（含置顶）"), "info");
        const _0x3e6dfe = _0x3c2c48(_0x4833b0, "video");
        const _0x258b4f = _0x3c2c48(_0x4833b0, "comments");
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主采集目标：视频链接=" + (_0x3e6dfe ? "是" : "否") + "，评论区=" + (_0x258b4f ? "是" : "否"), _0x258b4f || _0x3e6dfe ? "info" : "warning");
        if (!_0x3e6dfe && !_0x258b4f) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：未勾选视频链接/评论区，跳过", "warning");
          return null;
        }
        let _0x4d6d8c = {
          success: true,
          users: []
        };
        for (let _0x117e3e = 0; _0x117e3e < _0x1fe7d3.length; _0x117e3e += 1) {
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x242c7e = _0x1fe7d3[_0x117e3e];
          const _0x444f57 = String(_0x242c7e.secUid || "").trim();
          const _0x23b894 = _0x444f57 ? "@" + _0x444f57.slice(0, 12) + "…" : "主页 " + (_0x117e3e + 1);
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 (" + (_0x117e3e + 1) + "/" + _0x1fe7d3.length + ")：打开 " + _0x242c7e.url, "info");
          let _0x782300;
          try {
            if (_0x117e3e > 0) {
              await _0x22f4bb(_0x2cc526);
            }
            _0x782300 = await captureBloggerProfileWorks(_0x2cc526, {
              profileUrl: _0x242c7e.url,
              secUid: _0x444f57,
              maxWorks: resolveCaptureMaxWorks(_0x4833b0),
              filterPinned: _0x20a7c0,
              scrollRounds: resolveScrollRounds(_0x4833b0),
              withinDays: _0x118a23 === "days" ? normalizeBloggerPublishWithinDays(_0x4833b0.bloggerPublishWithinDays) : 0,
              loadUrl: _0x44de06,
              isActive: () => _0x4ec184(_0x2e170b, _0x5d04c0)
            });
          } catch (_0x58a477) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + _0x23b894 + "：主页打开失败 " + (_0x58a477?.message || _0x58a477), "warning");
            continue;
          }
          const _0x5e5d6c = String(_0x782300.authorName || "").trim();
          let _0x2b699c = Array.isArray(_0x782300.works) ? _0x782300.works.slice() : [];
          const _0x34976e = _0x782300?.diagnostics || {};
          if (_0x34976e.pinFilterFallback) {
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：置顶过滤疑似误判（" + (_0x34976e.pinnedCount || 0) + "/" + (_0x34976e.beforePinFilter || 0) + "），已回退保留作品列表", "warning");
          }
          if (_0x20a7c0) {
            const _0x521248 = _0x2b699c.length;
            _0x2b699c = _0x2b699c.filter(_0x117371 => !_0x117371?.pinned);
            const _0x255716 = _0x521248 - _0x2b699c.length;
            if (_0x255716 > 0) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：已排除置顶 " + _0x255716 + " 条", "info");
            }
          }
          if (!_0x2b699c.length) {
            const _0x1ad6ac = [];
            if (_0x34976e.scrapeError) {
              _0x1ad6ac.push("错误 " + _0x34976e.scrapeError);
            }
            if (_0x34976e.cardsFound != null) {
              _0x1ad6ac.push("卡片候选 " + _0x34976e.cardsFound);
            }
            if (_0x34976e.hrefLinkCount != null) {
              _0x1ad6ac.push("视频链 " + _0x34976e.hrefLinkCount);
            }
            if (_0x34976e.beforePinFilter != null) {
              _0x1ad6ac.push("刮取 " + _0x34976e.beforePinFilter + "/置顶标记 " + (_0x34976e.pinnedCount || 0));
            }
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：DOM 未识别到作品" + (_0x1ad6ac.length ? "（" + _0x1ad6ac.join("，") + "）" : ""), "warning");
          }
          const _0x2c6b0f = _0x2b699c.filter(_0x3226b8 => !normalizeAwemeCreateTimeMs(_0x3226b8.createTime || 0)).length;
          const _0x60cb5 = _0x2c6b0f > 0 && (_0x118a23 === "days" || _0x3e6dfe || _0x258b4f);
          const _0x5694ba = (_0x60cb5 || _0x258b4f) && _0x2b699c.length > 0;
          const _0x457217 = [];
          let _0x1816b0 = false;
          if (_0x5694ba) {
            if (_0x60cb5) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：" + _0x2c6b0f + " 条缺发布时间，打开作品识别" + (_0x258b4f ? "并采集评论…" : "…"), "info");
            } else {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：打开作品采集评论…", "info");
            }
            const _0x567da5 = Math.min(_0x2b699c.length, _0x118a23 === "count" ? normalizeBloggerWorkCount(_0x4833b0.bloggerWorkCount) : resolveCaptureMaxWorks(_0x4833b0));
            const _0x58c360 = _0x118a23 === "count" ? normalizeBloggerWorkCount(_0x4833b0.bloggerWorkCount) : 0;
            let _0xffc89c = false;
            const _0x420929 = [];
            for (let _0x5685eb = 0; _0x5685eb < _0x567da5; _0x5685eb += 1) {
              if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
                break;
              }
              const _0x1e8caa = _0x2b699c[_0x5685eb];
              if (!_0x1e8caa) {
                continue;
              }
              if (_0x20a7c0 && _0x1e8caa.pinned) {
                continue;
              }
              let _0x43aeb5 = _0x1e8caa.url || "";
              let _0x417d0f = false;
              if (!_0xffc89c) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：点击主页作品 (" + (_0x5685eb + 1) + "/" + _0x2b699c.length + ")", "info");
                try {
                  const _0x1ec92d = String(_0x2cc526.webContents?.getURL?.() || "");
                  if (!/\/user\//i.test(_0x1ec92d) || /[?&]modal_id=/i.test(_0x1ec92d)) {
                    await _0x44de06(_0x2cc526, _0x242c7e.url);
                    await sleep(1200);
                  }
                } catch (_0x517a61) {}
                const _0x1d1d06 = await _0x16b42b.openAuthorWork(_0x2cc526.webContents, {
                  taskId: _0x2e170b,
                  awemeId: _0x1e8caa.awemeId || extractDouyinVideoId(_0x1e8caa.url),
                  url: _0x1e8caa.url,
                  authorUrl: _0x242c7e.url,
                  preferFirstCard: _0x457217.length === 0,
                  skipPinnedCards: _0x20a7c0 && _0x457217.length === 0,
                  knownHasWorks: true,
                  allowUrlFallback: false,
                  timeoutMs: 50000
                });
                if (_0x1d1d06?.cancelled) {
                  _0x4d6d8c = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                _0x417d0f = !!_0x1d1d06?.ok;
                if (_0x1d1d06?.videoUrl) {
                  _0x43aeb5 = _0x1d1d06.videoUrl;
                  _0x1e8caa.url = _0x1d1d06.videoUrl;
                }
                if (_0x1d1d06?.awemeId) {
                  _0x1e8caa.awemeId = _0x1d1d06.awemeId;
                }
                _0xffc89c = _0x417d0f;
                if (!_0x417d0f) {
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：未能点击打开作品（" + (_0x1d1d06?.reason || _0x1d1d06?.error || "unknown") + "）" + (_0x1d1d06?.debug ? "｜" + _0x1d1d06.debug : ""), "warning");
                  if (_0x457217.length === 0) {
                    break;
                  }
                  continue;
                }
              } else {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：下一条 (" + (_0x5685eb + 1) + "/" + _0x2b699c.length + ")", "info");
                const _0x6346c7 = await _0x16b42b.moveNextAuthorWork(_0x2cc526.webContents, {
                  taskId: _0x2e170b,
                  expectedAwemeId: _0x1e8caa.awemeId || extractDouyinVideoId(_0x1e8caa.url),
                  expectedUrl: _0x1e8caa.url,
                  requireMatch: false
                });
                if (_0x6346c7?.cancelled) {
                  _0x4d6d8c = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                _0x417d0f = !!_0x6346c7?.ok;
                if (_0x6346c7?.videoUrl) {
                  _0x43aeb5 = _0x6346c7.videoUrl;
                  _0x1e8caa.url = _0x6346c7.videoUrl;
                }
                if (_0x6346c7?.awemeId) {
                  _0x1e8caa.awemeId = _0x6346c7.awemeId;
                }
                if (!_0x417d0f) {
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：下一条失败，回主页点卡继续", "warning");
                  _0xffc89c = false;
                  try {
                    await _0x44de06(_0x2cc526, _0x242c7e.url);
                    await sleep(900);
                  } catch (_0x3962f3) {}
                  _0x5685eb -= 1;
                  continue;
                }
              }
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：等待发布时间控件刷新…", "info");
              const _0x1df4ec = await _0x460524(_0x2cc526, {
                seenTexts: _0x420929,
                timeoutMs: 12000,
                taskId: _0x2e170b,
                generation: _0x5d04c0
              });
              if (_0x1df4ec?.cancelled) {
                _0x4d6d8c = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!_0x1df4ec?.refreshed) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：作品 (" + (_0x5685eb + 1) + "/" + _0x2b699c.length + ") 发布时间控件未刷新" + (_0x1df4ec?.text ? "（仍为 " + _0x1df4ec.text + "）" : "") + "，跳过本条", "warning");
                continue;
              }
              await _0x1c60ea(_0x2cc526);
              const _0xf32e4b = String(_0x1df4ec.text || "").trim();
              const _0x4c8fe0 = parseDouyinRelativePublishTimeMs(_0xf32e4b);
              const _0x2d7cae = _0x4d8ab(_0xf32e4b);
              if (_0x4c8fe0 > 0 && _0xf32e4b) {
                _0x1e8caa.createTime = _0x4c8fe0;
                _0x1e8caa.publishTimeText = _0xf32e4b;
                if (_0x2d7cae) {
                  _0x420929.push(_0x2d7cae);
                }
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：作品 (" + (_0x5685eb + 1) + "/" + _0x2b699c.length + ") 识别发布时间: " + _0xf32e4b + "（dom-video-create-time）", "info");
              } else {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：作品 (" + (_0x5685eb + 1) + "/" + _0x2b699c.length + ") 未识别到可信发布时间" + (_0x118a23 === "days" ? "，跳过本条" : ""), "warning");
                if (_0x118a23 === "days") {
                  continue;
                }
              }
              const _0xd48ac8 = await _0x51be1d(_0x43aeb5 || _0x1e8caa.url);
              const _0x381945 = String(_0xd48ac8?.secUid || "").trim();
              if (_0x444f57 && _0x381945 && _0x381945 !== _0x444f57) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：切条后非本博主作品（已离开作品流），跳下一个博主", "warning");
                break;
              }
              const _0x586208 = normalizeAwemeCreateTimeMs(_0x1e8caa.createTime || 0);
              if (_0x118a23 === "days" && (_0x586208 > 0 || _0x1e8caa.publishTimeText)) {
                const _0x590b6f = isBloggerWorkWithinPublishDays(_0x1e8caa, _0x4833b0.bloggerPublishWithinDays);
                if (!_0x590b6f) {
                  const _0x299ed0 = _0x1e8caa.publishTimeText || new Date(_0x586208).toLocaleDateString("zh-CN");
                  const _0x5ed620 = !!_0x1e8caa.pinned || looksLikeMissedPinnedPublishTime(_0x586208, _0x1e8caa.publishTimeText || "", _0x4833b0.bloggerPublishWithinDays);
                  if (_0x5ed620) {
                    _0x1e8caa.pinned = true;
                    _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：作品 (" + (_0x5685eb + 1) + ") 为置顶作品且发布时间 (" + _0x299ed0 + ") 超出设置范围，跳过并切下一条", "warning");
                    continue;
                  }
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主：作品 (" + (_0x5685eb + 1) + ") 为非置顶作品且发布时间 (" + _0x299ed0 + ") 超出 " + (normalizeBloggerPublishWithinDays(_0x4833b0.bloggerPublishWithinDays) + " 天内，停止本博主"), "info");
                  break;
                }
              }
              if (_0x1e8caa.pinned) {
                continue;
              }
              _0x457217.push(_0x1e8caa);
              if (_0x258b4f) {
                const _0x4ffa35 = _0x36adf7();
                if (!_0x4ffa35) {
                  break;
                }
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：打开评论区 (" + _0x457217.length + "/" + (_0x58c360 || _0x457217.length) + ")", "info");
                await _0x317311(_0x2cc526, "comment", _0x43aeb5);
                const _0x592a85 = await _0x89f5d3(_0x2cc526, {
                  taskId: _0x2e170b,
                  accountId: _0xe78b8e,
                  accountName: _0xa0bd0b,
                  sourceType: "comment",
                  searchKeyword: "指定博主",
                  maxCollect: _0x4ffa35.config.maxCollect,
                  collectedThisRun: _0x4ffa35.progress.collectedThisRun,
                  knownKeys: _0x4ffa35.knownKeys,
                  generation: _0x5d04c0,
                  commentFilters: _0x1aefde(_0x4ffa35.config),
                  targetVideoUrl: _0x43aeb5,
                  alreadyOnCurrentVideo: true
                });
                _0x1816b0 = true;
                if (_0x592a85?.cancelled) {
                  _0x4d6d8c = _0x592a85;
                  break;
                }
                if (_0x592a85?.videoUnavailable) {
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：视频失效，已跳过", "warning");
                } else if (_0x592a85?.needReload || _0x592a85?.videoNotReady) {
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：详情未就绪，跳过", "warning");
                  _0xffc89c = false;
                } else {
                  const _0x49a610 = _0x461305(_0x592a85, {
                    account: _0x3e5511,
                    taskId: _0x2e170b,
                    taskName: _0x4ffa35.taskName,
                    tasksApi: _0x4ffa35.tasksApi,
                    knownKeys: _0x4ffa35.knownKeys,
                    sourceType: "comment",
                    progress: _0x4ffa35.progress,
                    maxCollect: _0x4ffa35.config.maxCollect,
                    generation: _0x5d04c0
                  });
                  _0x36dedb += _0x49a610.synced;
                  _0x379707 += _0x49a610.duplicates;
                  _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论完成：" + _0x43ff91(_0x49a610), entityIngestSummaryLevel(_0x49a610));
                  _0x4d6d8c = _0x592a85;
                }
              }
              if (_0x58c360 > 0 && _0x457217.length >= _0x58c360) {
                break;
              }
              if (_0x5e63d3(_0x36adf7())) {
                break;
              }
            }
            if (_0x20a7c0) {
              _0x2b699c = _0x2b699c.filter(_0x3164cc => !_0x3164cc?.pinned);
            }
          }
          const _0x26be21 = _0x5694ba && (_0x118a23 === "days" || _0x258b4f) ? selectWorksForBloggerConfig(_0x457217, _0x4833b0) : selectWorksForBloggerConfig(_0x2b699c, _0x4833b0);
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：DOM 识别 " + _0x2b699c.length + " 条，筛选后 " + _0x26be21.length + " 条" + (_0x60cb5 ? "（已补时间 " + _0x2b699c.filter(_0x29f4ca => normalizeAwemeCreateTimeMs(_0x29f4ca.createTime || 0)).length + "）" : "") + (_0x1816b0 ? "（评论已同趟采集）" : ""), _0x26be21.length ? "info" : "warning");
          if (!_0x26be21.length) {
            continue;
          }
          if (_0x3e6dfe) {
            const _0x2e8bc6 = _0x26be21.map(_0xb2585d => ({
              nickname: _0x5e5d6c || _0xb2585d.authorName || "未知作者",
              title: _0xb2585d.title || "博主作品",
              videoUrl: _0xb2585d.url,
              userUrl: _0xb2585d.url,
              userKey: _0xb2585d.awemeId ? "video:" + _0xb2585d.awemeId : _0xb2585d.url,
              identityType: "video",
              sourceType: "author_profile",
              searchKeyword: "指定博主",
              authorProfileUrl: _0x242c7e.url,
              authorNickname: _0x5e5d6c || _0xb2585d.authorName || "",
              secUid: _0x444f57 || _0xb2585d.authorSecUid || "",
              createTime: normalizeAwemeCreateTimeMs(_0xb2585d.createTime || 0),
              publishTime: normalizeAwemeCreateTimeMs(_0xb2585d.createTime || 0),
              timeText: _0xb2585d.publishTimeText || ""
            }));
            await _0x4f9a2a({
              success: true,
              users: _0x2e8bc6
            }, {
              label: "指定博主 " + (_0x5e5d6c || _0x23b894),
              searchKeyword: "指定博主",
              sourceType: "author_profile",
              skipComments: true
            });
          }
          if (!_0x258b4f || _0x1816b0) {
            continue;
          }
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          let _0x285e6d = false;
          let _0x1047db = false;
          for (let _0x17ad10 = 0; _0x17ad10 < _0x26be21.length; _0x17ad10 += 1) {
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            const _0x694de6 = _0x26be21[_0x17ad10];
            let _0x43f828 = _0x694de6.url || "";
            if (!_0x1047db) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：点击主页作品 (" + (_0x17ad10 + 1) + "/" + _0x26be21.length + ")", "info");
              try {
                const _0x36aef7 = String(_0x2cc526.webContents?.getURL?.() || "");
                if (!/\/user\//i.test(_0x36aef7) || /[?&]modal_id=/i.test(_0x36aef7)) {
                  await _0x44de06(_0x2cc526, _0x242c7e.url);
                  await sleep(1200);
                }
              } catch (_0x2ad13d) {}
              const _0x2697b6 = await _0x16b42b.openAuthorWork(_0x2cc526.webContents, {
                taskId: _0x2e170b,
                awemeId: _0x694de6.awemeId || extractDouyinVideoId(_0x694de6.url),
                url: _0x694de6.url,
                authorUrl: _0x242c7e.url,
                preferFirstCard: _0x17ad10 === 0,
                skipPinnedCards: _0x20a7c0 && _0x17ad10 === 0,
                knownHasWorks: true,
                allowUrlFallback: false,
                timeoutMs: 50000
              });
              if (_0x2697b6?.cancelled) {
                _0x4d6d8c = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!_0x2697b6?.ok) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：未能点击打开（" + (_0x2697b6?.reason || _0x2697b6?.error || "unknown") + "）", "warning");
                if (_0x17ad10 === 0) {
                  break;
                }
                continue;
              }
              if (_0x2697b6.videoUrl) {
                _0x43f828 = _0x2697b6.videoUrl;
              }
              _0x1047db = true;
            } else {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：下一条 (" + (_0x17ad10 + 1) + "/" + _0x26be21.length + ")", "info");
              const _0x337386 = await _0x16b42b.moveNextAuthorWork(_0x2cc526.webContents, {
                taskId: _0x2e170b,
                expectedAwemeId: _0x694de6.awemeId || extractDouyinVideoId(_0x694de6.url),
                expectedUrl: _0x694de6.url,
                requireMatch: false
              });
              if (_0x337386?.cancelled) {
                _0x4d6d8c = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!_0x337386?.ok) {
                _0x1047db = false;
                _0x17ad10 -= 1;
                try {
                  await _0x44de06(_0x2cc526, _0x242c7e.url);
                  await sleep(900);
                } catch (_0x30943d) {}
                continue;
              }
              if (_0x337386.videoUrl) {
                _0x43f828 = _0x337386.videoUrl;
              }
            }
            const _0x400f73 = await _0x51be1d(_0x43f828 || _0x694de6.url);
            const _0x739879 = String(_0x400f73.secUid || "").trim();
            if (_0x444f57 && _0x739879 && _0x739879 !== _0x444f57) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主 " + (_0x5e5d6c || _0x23b894) + "：已离开本博主作品流，进入下一作者", "warning");
              _0x285e6d = true;
              break;
            }
            const _0x14b3fb = _0x36adf7();
            if (!_0x14b3fb) {
              break;
            }
            await _0x317311(_0x2cc526, "comment", _0x43f828);
            const _0x3e7d56 = await _0x89f5d3(_0x2cc526, {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              accountName: _0xa0bd0b,
              sourceType: "comment",
              searchKeyword: "指定博主",
              maxCollect: _0x14b3fb.config.maxCollect,
              collectedThisRun: _0x14b3fb.progress.collectedThisRun,
              knownKeys: _0x14b3fb.knownKeys,
              generation: _0x5d04c0,
              commentFilters: _0x1aefde(_0x14b3fb.config),
              targetVideoUrl: _0x43f828,
              alreadyOnCurrentVideo: true
            });
            if (_0x3e7d56?.cancelled) {
              _0x4d6d8c = _0x3e7d56;
              break;
            }
            if (_0x3e7d56?.videoUnavailable || _0x3e7d56?.needReload || _0x3e7d56?.videoNotReady) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论：详情未就绪或失效，跳过 (" + (_0x17ad10 + 1) + "/" + _0x26be21.length + ")", "warning");
              _0x1047db = false;
              continue;
            }
            const _0x37be4a = _0x461305(_0x3e7d56, {
              account: _0x3e5511,
              taskId: _0x2e170b,
              taskName: _0x14b3fb.taskName,
              tasksApi: _0x14b3fb.tasksApi,
              knownKeys: _0x14b3fb.knownKeys,
              sourceType: "comment",
              progress: _0x14b3fb.progress,
              maxCollect: _0x14b3fb.config.maxCollect,
              generation: _0x5d04c0
            });
            _0x36dedb += _0x37be4a.synced;
            _0x379707 += _0x37be4a.duplicates;
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定博主评论 (" + (_0x17ad10 + 1) + "/" + _0x26be21.length + ") 完成：" + _0x43ff91(_0x37be4a), entityIngestSummaryLevel(_0x37be4a));
            _0x4d6d8c = _0x3e7d56;
          }
          if (_0x285e6d) {
            continue;
          }
        }
        return _0x4d6d8c;
      };
      const _0x5bdb8f = async () => {
        const _0x5453f5 = _0x36adf7();
        if (!_0x5453f5 || _0x5453f5.stopRequested || _0x5e63d3(_0x5453f5)) {
          return null;
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 正在解析指定视频链接…", "info");
        const _0x38c6ee = _0xc7ac45(_0x5453f5.config.specifiedUrls);
        if (!_0x38c6ee.length) {
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频：未找到有效链接", "warning");
          return null;
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频：解析出 " + _0x38c6ee.length + " 个链接", "info");
        const _0x1172c7 = _0x3c2c48(_0x5453f5.config, "author");
        const _0x83b12 = _0x3c2c48(_0x5453f5.config, "video");
        const _0x3d9c6d = _0x3c2c48(_0x5453f5.config, "comments");
        const _0x2f6294 = _0x36656e => {
          const _0x5a7022 = extractDouyinVideoId(_0x36656e) || "";
          return {
            nickname: "未知作者",
            title: "指定视频",
            videoUrl: _0x36656e,
            userUrl: _0x36656e,
            userKey: _0x5a7022 ? "video:" + _0x5a7022 : _0x36656e,
            identityType: "video",
            sourceType: "video_specific",
            searchKeyword: "指定视频"
          };
        };
        if (_0x83b12 && !_0x1172c7 && !_0x3d9c6d) {
          const _0x46804c = _0x38c6ee.map(_0x2f6294);
          return await _0x4f9a2a({
            success: true,
            users: _0x46804c
          }, {
            label: "指定视频",
            searchKeyword: "指定视频",
            sourceType: "video_specific",
            skipComments: true
          });
        }
        const {
          config: _0x21c34a,
          tasksApi: _0x31345a,
          taskName: _0x5d31d3,
          knownKeys: _0x4e2a91,
          progress: _0x5d521a
        } = _0x5453f5;
        let _0x474c65 = {
          success: true,
          users: []
        };
        for (let _0x37083d = 0; _0x37083d < _0x38c6ee.length; _0x37083d += 1) {
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x5c25c4 = _0x38c6ee[_0x37083d];
          const _0x21613f = toDouyinJingxuanUrl(_0x5c25c4);
          const _0x3359d6 = 3;
          let _0x4fee1e = false;
          let _0x598657 = null;
          for (let _0x11d51e = 1; _0x11d51e <= _0x3359d6; _0x11d51e += 1) {
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            _0x9d21b4(_0x2e170b, _0x11d51e === 1 ? "[" + _0xa0bd0b + "] 指定视频：打开视频 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")" : "[" + _0xa0bd0b + "] 指定视频：重新打开 (" + _0x11d51e + "/" + _0x3359d6 + ")", _0x11d51e === 1 ? "info" : "warning");
            if (_0x37083d > 0 || _0x11d51e > 1) {
              await _0x22f4bb(_0x2cc526);
            }
            if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
              break;
            }
            await _0x317311(_0x2cc526, _0x3d9c6d ? "comment" : "video", _0x21613f);
            try {
              await _0x44de06(_0x2cc526, _0x21613f);
            } catch (_0x3c09ec) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频：打开失败 " + (_0x3c09ec?.message || _0x3c09ec), "warning");
              if (_0x11d51e < _0x3359d6) {
                await _0x22f4bb(_0x2cc526);
                await sleep(800 + _0x11d51e * 400);
                continue;
              }
              break;
            }
            if (_0x3d9c6d) {
              const _0x134831 = _0x36adf7();
              if (!_0x134831) {
                break;
              }
              _0x598657 = await _0x89f5d3(_0x2cc526, {
                taskId: _0x2e170b,
                accountId: _0xe78b8e,
                accountName: _0xa0bd0b,
                sourceType: "comment",
                searchKeyword: "指定视频",
                maxCollect: _0x21c34a.maxCollect,
                collectedThisRun: _0x134831.progress.collectedThisRun,
                knownKeys: _0x4e2a91,
                generation: _0x5d04c0,
                commentFilters: _0x1aefde(_0x21c34a),
                targetVideoUrl: _0x21613f
              });
              if (_0x598657?.cancelled) {
                _0x474c65 = _0x598657;
                break;
              }
              if (_0x598657?.videoUnavailable) {
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频：视频失效，已跳过 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")", "warning");
                _0x4fee1e = false;
                break;
              }
              if (_0x598657?.needReload || _0x598657?.videoNotReady) {
                if (_0x11d51e < _0x3359d6) {
                  await sleep(600 + _0x11d51e * 300);
                  continue;
                }
                _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频：多次重进仍未进入视频，跳过 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")", "warning");
                _0x4fee1e = false;
                break;
              }
              _0x4fee1e = true;
              break;
            }
            await sleep(1600 + _0x11d51e * 200);
            _0x4fee1e = true;
            break;
          }
          if (!_0x4fee1e || !_0x4ec184(_0x2e170b, _0x5d04c0)) {
            if (_0x598657?.cancelled) {
              break;
            }
            continue;
          }
          let _0x2e91e0 = await _0x51be1d(_0x5c25c4);
          if (_0x1172c7 && !_0x2e91e0.userUrl) {
            await sleep(1200);
            _0x2e91e0 = await _0x51be1d(_0x5c25c4);
          }
          const _0xe0f11d = {
            ..._0x2f6294(_0x5c25c4),
            authorProfileUrl: String(_0x2e91e0.userUrl || "").trim(),
            authorNickname: String(_0x2e91e0.nickname || "").trim().replace(/^@+/, ""),
            nickname: String(_0x2e91e0.nickname || "").trim().replace(/^@+/, "") || "未知作者",
            title: String(_0x2e91e0.title || "").trim() || "指定视频",
            secUid: String(_0x2e91e0.secUid || "").trim()
          };
          if (_0x83b12 || _0x1172c7) {
            if (_0x1172c7 && !_0xe0f11d.authorProfileUrl) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")：未识别到作者主页，主页未入库", "warning");
            } else if (_0x1172c7 && _0xe0f11d.authorProfileUrl) {
              _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")：作者 @" + (_0xe0f11d.authorNickname || "未知") + " " + _0xe0f11d.authorProfileUrl, "info");
            }
            await _0x4f9a2a({
              success: true,
              users: [_0xe0f11d]
            }, {
              label: "指定视频 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ")",
              searchKeyword: "指定视频",
              sourceType: "video_specific",
              skipComments: true
            });
          }
          if (_0x3d9c6d && _0x598657 && !_0x598657.videoUnavailable && !_0x598657.needReload) {
            const _0x3b2bb5 = _0x461305(_0x598657, {
              account: _0x3e5511,
              taskId: _0x2e170b,
              taskName: _0x5d31d3,
              tasksApi: _0x31345a,
              knownKeys: _0x4e2a91,
              sourceType: "comment",
              progress: _0x5d521a,
              maxCollect: _0x21c34a.maxCollect,
              generation: _0x5d04c0
            });
            _0x36dedb += _0x3b2bb5.synced;
            _0x379707 += _0x3b2bb5.duplicates;
            _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 指定视频评论区 (" + (_0x37083d + 1) + "/" + _0x38c6ee.length + ") 完成：" + _0x43ff91(_0x3b2bb5), entityIngestSummaryLevel(_0x3b2bb5));
            _0x474c65 = _0x598657;
          }
        }
        return _0x474c65;
      };
      const _0x4ce78f = async _0x44f5ff => {
        const _0x11f975 = _0x36adf7();
        if (!_0x11f975 || _0x5e63d3(_0x11f975)) {
          return {
            success: true,
            users: [],
            cancelled: !!_0x11f975?.stopRequested,
            reachedLimit: true
          };
        }
        const _0x1279c4 = _0x11f975.config || {};
        const _0x43fccb = [];
        if (String(_0x1279c4.searchSort || "0") !== "0") {
          _0x43fccb.push(["综合排序", "最新发布", "最多点赞"][Number(_0x1279c4.searchSort)] || "排序");
        }
        if (String(_0x1279c4.searchPublishTime || "0") !== "0") {
          _0x43fccb.push(["", "一天内", "一周内", "半年内"][Number(_0x1279c4.searchPublishTime)] || "发布时间");
        }
        if (String(_0x1279c4.searchDuration || "0") !== "0") {
          _0x43fccb.push(["", "1分钟以下", "1-5分钟", "5分钟以上"][Number(_0x1279c4.searchDuration)] || "时长");
        }
        if (String(_0x1279c4.searchScope || "0") !== "0") {
          _0x43fccb.push(["", "关注的人", "最近看过", "还未看过"][Number(_0x1279c4.searchScope)] || "范围");
        }
        if (String(_0x1279c4.searchFormat || "0") !== "0") {
          _0x43fccb.push(["", "视频", "图文"][Number(_0x1279c4.searchFormat)] || "形式");
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 搜索视频：打开搜索页「" + _0x44f5ff + "」" + (_0x43fccb.length ? "（官方筛选：" + _0x43fccb.join(" · ") + "）" : ""), "info");
        const _0x6e5ab5 = await _0x3ca1a0(_0x2cc526, _0x2e170b, _0xa0bd0b);
        if (_0x6e5ab5?.ok === false) {
          throw new Error("搜索页执行视口未就绪：" + (_0x6e5ab5.reason || "unknown"));
        }
        try {
          if (_0x2cc526 && !_0x2cc526.isDestroyed()) {
            _0x2cc526.webContents.send("entity-leadgen-clear-scrape-aweme", {
              reason: "keyword:" + _0x44f5ff
            });
            await sleep(80);
          }
        } catch (_0x5508bf) {}
        await _0x317311(_0x2cc526, "video", _0x44f5ff);
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await _0x44de06(_0x2cc526, buildDouyinSearchUrl(_0x44f5ff, _0x480154()));
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const _0xad9edf = _0x36adf7();
        if (!_0xad9edf) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const _0x4a56d3 = _0xad9edf.config || {};
        const _0x1ed36b = _0x3c2c48(_0x4a56d3, "comments");
        const _0x22e52e = _0x3c2c48(_0x4a56d3, "video") || _0x3c2c48(_0x4a56d3, "author");
        if (_0x1ed36b && !_0x22e52e) {
          _0x3637c0 += 1;
          return await _0x25402a({
            label: "搜索视频「" + _0x44f5ff + "」",
            searchKeyword: _0x44f5ff,
            alsoIngestCards: false
          });
        }
        const _0x2fc774 = await _0x89f5d3(_0x2cc526, {
          taskId: _0x2e170b,
          accountId: _0xe78b8e,
          accountName: _0xa0bd0b,
          sourceType: "video",
          searchKeyword: _0x44f5ff,
          maxCollect: _0xad9edf.config.maxCollect,
          collectedThisRun: _0xad9edf.progress.collectedThisRun,
          knownKeys: _0xad9edf.knownKeys,
          generation: _0x5d04c0,
          skipIngest: false,
          searchSort: _0x4a56d3.searchSort,
          searchPublishTime: _0x4a56d3.searchPublishTime,
          searchDuration: _0x4a56d3.searchDuration,
          searchScope: _0x4a56d3.searchScope,
          searchFormat: _0x4a56d3.searchFormat
        });
        _0x3637c0 += 1;
        const _0x416b19 = await _0x4f9a2a(_0x2fc774, {
          label: "搜索视频「" + _0x44f5ff + "」",
          searchKeyword: _0x44f5ff,
          sourceType: "video_search",
          skipComments: true
        });
        if (!_0x1ed36b) {
          return _0x416b19;
        }
        if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
          return _0x416b19;
        }
        _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 搜索视频「" + _0x44f5ff + "」：列表采完，回顶从第一条开始采评论区", "info");
        return await _0x25402a({
          label: "搜索视频「" + _0x44f5ff + "」",
          searchKeyword: _0x44f5ff,
          alsoIngestCards: false
        });
      };
      const _0x2a8e85 = (_0x36adf7()?.config?.sourceTypes || [])[0] || "video_search";
      if (_0x2a8e85 === "user") {
        while (true) {
          const _0x6bc192 = _0x36adf7();
          if (!_0x6bc192) {
            break;
          }
          const _0x21d341 = _0x41ccb7(_0x6bc192);
          if (!_0x21d341) {
            break;
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 领取关键词「" + _0x21d341.keyword + "」（" + (_0x21d341.index + 1) + "/" + _0x6bc192.config.keywords.length + "）", "info");
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x34fca0 = await _0x5b6acf(_0x21d341.keyword, "user");
          if (_0x34fca0?.cancelled && _0x36adf7()?.stopRequested) {
            break;
          }
          if (_0x5e63d3(_0x36adf7())) {
            break;
          }
        }
      } else if (_0x2a8e85 === "video_search") {
        while (true) {
          const _0x1542f7 = _0x36adf7();
          if (!_0x1542f7) {
            break;
          }
          const _0x80ffd3 = _0x41ccb7(_0x1542f7);
          if (!_0x80ffd3) {
            break;
          }
          _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 领取关键词「" + _0x80ffd3.keyword + "」（" + (_0x80ffd3.index + 1) + "/" + _0x1542f7.config.keywords.length + "）", "info");
          if (!_0x4ec184(_0x2e170b, _0x5d04c0) || _0x5e63d3(_0x36adf7())) {
            break;
          }
          const _0x6b1b13 = await _0x4ce78f(_0x80ffd3.keyword);
          if (_0x6b1b13?.cancelled && _0x36adf7()?.stopRequested) {
            break;
          }
          if (_0x5e63d3(_0x36adf7())) {
            break;
          }
        }
      } else if (_0x2a8e85 === "mutual") {
        await _0x26606b();
      } else if (_0x2a8e85 === "following") {
        await _0x4e7b1f();
      } else if (_0x2a8e85 === "video_like") {
        await _0x114075();
      } else if (_0x2a8e85 === "video_recommend") {
        await _0x163241();
      } else if (_0x2a8e85 === "video_specific") {
        await _0x5bdb8f();
      } else if (_0x2a8e85 === "author_profile") {
        await _0x5508c7();
      } else if (_0x2a8e85 === "live") {
        await _0x16e958();
      }
      if (_0x3637c0 > 0) {
        const _0x44780e = _0x36adf7();
        if (_0x44780e?.tasksApi) {
          _0x44780e.tasksApi.incrementStats(_0x2e170b, {
            keywordsDone: _0x3637c0,
            lastCycleAt: Date.now()
          });
        }
      }
      const _0x43009a = _0x36adf7()?.progress?.collectedThisRun ?? _0x783633 + _0x36dedb;
      const _0x1ceb28 = Math.max(_0x36dedb, _0x43009a - _0x783633);
      _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 本账号结束：新入库 " + _0x1ceb28 + (_0x379707 > 0 ? "，线索库已有跳过 " + _0x379707 : ""), "success");
      return {
        collected: _0x1ceb28,
        duplicates: _0x379707
      };
    } catch (_0x32f08a) {
      _0x9d21b4(_0x2e170b, "[" + _0xa0bd0b + "] 异常：" + (_0x32f08a.message || _0x32f08a), "error");
      return {
        collected: _0x36dedb,
        duplicates: _0x379707
      };
    } finally {
      if (_0x2cc526 && !_0x2cc526.isDestroyed()) {
        try {
          _0x2cc526.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: _0x2e170b,
              accountId: _0xe78b8e,
              generation: _0x5d04c0
            }
          });
        } catch (_0x35b1fc) {}
      }
      _0x14e7cd(_0x2cc526);
    }
  }
  async function _0x187aa5(_0xcc7d73) {
    const _0x4ede73 = _0x5ea9b0.get(_0xcc7d73);
    if (!_0x4ede73 || _0x4ede73.running) {
      return;
    }
    _0x4ede73.running = true;
    const _0x238af5 = _0x4ede73.generation;
    const {
      config: _0x47c68e,
      accounts: _0x342e7f,
      tasksApi: _0x535302,
      taskName: _0x68c40a
    } = _0x4ede73;
    const _0x4fa6a5 = _0x2f7dbf(_0x47c68e.sourceTypes[0]);
    const _0xbdc38c = {
      collectedThisRun: 0
    };
    _0x4ede73.knownKeys = _0x4fa6a5;
    _0x4ede73.ingestedKeysThisRun = new Set();
    _0x4ede73.duplicateTrailKeys = new Set();
    _0x4ede73.progress = _0xbdc38c;
    _0x4ede73.nextKeywordIndex = 0;
    _0x4ede73.nextLiveUrlIndex = 0;
    _0x4ede73.windowKeys = new Set();
    const _0x1e77ca = _0x47c68e.sourceTypes.length === 1 && _0x47c68e.sourceTypes[0] === "live";
    const _0xa0b1ea = (Array.isArray(_0x342e7f) ? _0x342e7f : []).filter(_0x5a5968 => {
      const _0x54644b = String(_0x5a5968?.id || "").trim();
      return _0x54644b && !isAnonymousEntityAccountId(_0x54644b);
    });
    let _0x2f6375 = _0xa0b1ea;
    if (_0x1e77ca) {
      const _0x4feeae = Array.isArray(_0x47c68e.liveUrls) ? _0x47c68e.liveUrls.length : 0;
      if (_0xa0b1ea.length > 0) {
        const _0x37f394 = await _0x2f1658(_0xcc7d73, _0x238af5, Math.min(_0x4feeae, _0xa0b1ea.length), _0x47c68e.liveConcurrency);
        _0x2f6375 = _0xa0b1ea.map((_0x3cfa35, _0x44a167) => ({
          ..._0x3cfa35,
          liveWorkerIndex: _0x44a167,
          liveWorkerEnabled: _0x44a167 < _0x37f394
        }));
        _0x9d21b4(_0xcc7d73, "直播间将由 " + Math.min(_0x37f394, _0xa0b1ea.length) + " 个账号窗口共享领取（并发上限 " + normalizeLiveConcurrency(_0x47c68e.liveConcurrency) + "）" + ("" + (_0x5ea9b0.get(_0xcc7d73)?.liveConcurrencyDetails?.reason ? "；本机自适应：" + _0x5ea9b0.get(_0xcc7d73).liveConcurrencyDetails.reason : "")), _0x37f394 < normalizeLiveConcurrency(_0x47c68e.liveConcurrency) ? "warning" : "info");
      } else {
        const _0x13bc4e = await _0x2f1658(_0xcc7d73, _0x238af5, _0x4feeae, _0x47c68e.liveConcurrency);
        _0x2f6375 = Array.from({
          length: _0x13bc4e
        }, (_0x26f0bd, _0x131c97) => ({
          id: "anonymous:" + _0xcc7d73 + ":" + _0x131c97,
          platform: "douyin",
          name: "无账号采集 " + (_0x131c97 + 1),
          nickname: "无账号采集 " + (_0x131c97 + 1),
          liveWorkerIndex: _0x131c97
        }));
        if (_0x13bc4e > 0) {
          const _0x27e014 = _0x5ea9b0.get(_0xcc7d73)?.liveConcurrencyDetails;
          const _0xaeaeb0 = _0x27e014?.reason ? "；本机自适应：" + _0x27e014.reason : "";
          _0x9d21b4(_0xcc7d73, "无账号直播间队列已启动：" + _0x4feeae + " 个直播间，并发上限 " + normalizeLiveConcurrency(_0x47c68e.liveConcurrency) + "，实际启动 " + _0x13bc4e + " 个" + _0xaeaeb0, _0x13bc4e < normalizeLiveConcurrency(_0x47c68e.liveConcurrency) ? "warning" : "success");
        }
      }
    }
    if (!_0x2f6375.length) {
      _0x9d21b4(_0xcc7d73, _0x1e77ca ? "直播采集任务已取消启动" : "未选择执行账号，已取消启动（游客仅可跑直播间）", "error");
      _0x4ede73.running = false;
      _0x5ea9b0.delete(_0xcc7d73);
      releaseTaskRuntimeGuard(_0x494c23(_0xcc7d73));
      return;
    }
    const _0x5012f7 = _0x47c68e.sourceTypes[0] || "video_search";
    const _0x44e405 = Array.isArray(_0x47c68e.scrapeTargets) ? _0x47c68e.scrapeTargets.join("+") : "";
    let _0x294b4f = "";
    if (_0x3c2c48(_0x47c68e, "comments")) {
      try {
        const {
          formatEntityCommentFiltersSummary: _0x4eaae6
        } = require("../shared/entityCommentFilters");
        const _0x1e849f = _0x4eaae6(_0x47c68e);
        if (_0x1e849f && _0x1e849f !== "不限") {
          _0x294b4f = "；评论筛选 " + _0x1e849f;
        }
      } catch (_0x485747) {}
    }
    const _0x39ed09 = _0x5012f7 === "video_specific" ? "指定视频 " + _0xc7ac45(_0x47c68e.specifiedUrls).length + " 个" : _0x5012f7 === "video_recommend" ? "采集链接数 " + (_0x47c68e.maxCollect || 100) : _0x5012f7 === "live" ? "直播间 " + _0x47c68e.liveUrls.length + " 个" : "关键词 " + (_0x47c68e.keywords.length || 0) + " 个";
    const _0x2027b9 = _0x5012f7 === "video_specific" ? "无上限" : _0x5012f7 === "video_recommend" ? "采集链接数 " + (_0x47c68e.maxCollect || 100) : "上限 " + (_0x47c68e.maxCollect || "不限");
    const _0x5c90c9 = isEntityRelationAuthorSource(_0x5012f7) ? "采集主页" : "线索库";
    _0x9d21b4(_0xcc7d73, "线索采集已启动：来源 " + _0x5012f7 + (_0x44e405 ? "（" + _0x44e405 + "）" : "") + "，" + _0x39ed09 + "，" + _0x2027b9 + "，账号 " + (_0x1e77ca && !_0xa0b1ea.length ? "无账号游客" : _0x2f6375.map(_0x56182f => _0x56182f.nickname || _0x56182f.name || _0x56182f.id).join("、")) + "；" + _0x5c90c9 + "已有 " + _0x4fa6a5.size + " 个用户将自动跳过" + _0x294b4f, "success");
    try {
      await Promise.all(_0x2f6375.map(_0x42bd89 => _0xe58fbe(_0xcc7d73, _0x42bd89, _0x238af5)));
      const _0x46cb53 = _0x5ea9b0.get(_0xcc7d73);
      if (!_0x46cb53 || _0x46cb53.generation !== _0x238af5) {
        return;
      }
      const _0x458b9e = Date.now();
      const _0x37f124 = _0x46cb53.stopRequested ? "manual_stop" : _0x5e63d3(_0x46cb53) ? "limit_reached" : "completed";
      const _0x2149b1 = _0x46cb53.stopRequested ? "stopped" : "completed";
      if (_0x37f124 === "limit_reached") {
        const _0x348ea4 = _0x46cb53.limitKind || (_0x5012f7 === "video_recommend" ? "link_count" : "max_collect");
        _0x9d21b4(_0xcc7d73, _0x348ea4 === "link_count" ? "已达到采集链接数 " + _0x47c68e.maxCollect + "，结束任务" : "已达到最大采集数 " + _0x47c68e.maxCollect + "，结束任务", "info");
      }
      const _0x1f3460 = (_0x535302.findTaskById(_0xcc7d73)?.runs || []).map(_0x3c7331 => ({
        ..._0x3c7331,
        endedAt: _0x3c7331.endedAt || _0x458b9e,
        endReason: _0x3c7331.endReason || _0x37f124
      }));
      _0x535302.patchTask(_0xcc7d73, {
        status: _0x2149b1,
        endedAt: _0x458b9e,
        endReason: _0x37f124,
        runs: _0x1f3460
      });
      _0x9d21b4(_0xcc7d73, _0x2149b1 === "completed" ? "线索采集任务已完成" : "线索采集任务已停止", _0x2149b1 === "completed" ? "success" : "info");
      _0x396135(_0xcc7d73, {
        type: "finished",
        status: _0x2149b1,
        endReason: _0x37f124,
        ts: _0x458b9e
      });
    } catch (_0x572ceb) {
      const _0xc897d8 = _0x5ea9b0.get(_0xcc7d73);
      if (!_0xc897d8 || _0xc897d8.generation !== _0x238af5) {
        return;
      }
      const _0x3e7d7c = Date.now();
      _0x535302.patchTask(_0xcc7d73, {
        status: "stopped",
        endedAt: _0x3e7d7c,
        endReason: "error"
      });
      _0x9d21b4(_0xcc7d73, "任务异常结束：" + (_0x572ceb.message || _0x572ceb), "error");
      _0x396135(_0xcc7d73, {
        type: "finished",
        status: "stopped",
        endReason: "error",
        ts: _0x3e7d7c
      });
    } finally {
      const _0x2ed12c = _0x5ea9b0.get(_0xcc7d73);
      if (_0x2ed12c && _0x2ed12c.generation === _0x238af5) {
        const _0x1dec3f = _0x2ed12c.windowKeys && _0x2ed12c.windowKeys.size ? [..._0x2ed12c.windowKeys] : _0x745e87(_0x2ed12c.accounts || []);
        _0x5ea9b0.delete(_0xcc7d73);
        releaseTaskRuntimeGuard(_0x494c23(_0xcc7d73));
        _0xf412fd(_0x1dec3f);
      } else {
        releaseTaskRuntimeGuard(_0x494c23(_0xcc7d73));
      }
    }
  }
  function _0x59800c(_0x57315e, _0x900263, _0x5f873f) {
    const _0x7551d9 = _0x57315e.id;
    const _0x2411d5 = _0x28ca8e(_0x57315e.configSnapshot || {});
    if (_0x26fd46(_0x2411d5) && _0x22bc32(_0x7551d9)) {
      return {
        ok: false,
        error: "已有直播间采集任务在运行，请先停止后再启动"
      };
    }
    const _0x3b5f2e = [];
    const _0x38570d = Array.isArray(_0x900263) ? _0x900263 : [];
    for (const _0x12665f of _0x38570d) {
      const _0x3d319f = String(_0x12665f?.id || "").trim();
      if (!_0x3d319f || isAnonymousEntityAccountId(_0x3d319f)) {
        continue;
      }
      if (typeof isCommentLeadgenAccountBusy === "function" && isCommentLeadgenAccountBusy(_0x3d319f)) {
        _0x3b5f2e.push(_0x3d319f);
      } else if (typeof isVideoMonitorAccountBusy === "function" && isVideoMonitorAccountBusy(_0x3d319f)) {
        _0x3b5f2e.push(_0x3d319f);
      }
    }
    if (_0x3b5f2e.length) {
      return {
        ok: false,
        error: "账号正在评论获客或监控任务中，请先停止后再启动线索采集（" + _0x3b5f2e.join("、") + "）",
        conflictAccountIds: _0x3b5f2e
      };
    }
    const _0x211ef6 = _0x5ea9b0.get(_0x7551d9);
    const _0x31a195 = (_0x211ef6?.generation || 0) + 1;
    if (_0x211ef6) {
      _0x211ef6.stopRequested = true;
      _0x23fbd4(_0x7551d9, "任务已重启");
      const _0x53f28e = _0x745e87(_0x211ef6.accounts || []);
      for (const _0x519c2a of _0x53f28e) {
        const _0x3f5487 = _0x31c2d3.get(String(_0x519c2a));
        if (!_0x3f5487 || _0x3f5487.isDestroyed()) {
          continue;
        }
        try {
          _0x3f5487.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: _0x7551d9,
              accountId: _0x519c2a,
              generation: _0x211ef6.generation
            }
          });
        } catch (_0x2d285e) {}
      }
    }
    const _0x51224c = _0x745e87(_0x900263 || []);
    const _0x2087df = _0x51224c.filter(_0x847fd8 => isAnonymousEntityAccountId(_0x847fd8));
    if (_0x2087df.length) {
      _0x3ea421(_0x2087df);
    }
    _0x5ea9b0.set(_0x7551d9, {
      config: _0x2411d5,
      accounts: Array.isArray(_0x900263) ? _0x900263 : [],
      tasksApi: _0x5f873f,
      taskName: _0x57315e.name || "线索采集",
      running: false,
      stopRequested: false,
      generation: _0x31a195,
      nextKeywordIndex: 0,
      nextLiveUrlIndex: 0,
      liveWorkerCount: 0,
      windowKeys: new Set()
    });
    acquireTaskRuntimeGuard(_0x494c23(_0x7551d9), {
      type: "entity-leadgen",
      taskId: _0x7551d9
    });
    setTimeout(() => {
      _0x187aa5(_0x7551d9);
    }, 300);
    return {
      ok: true
    };
  }
  function _0x4b8fec(_0x5068fc = {}) {
    try {
      _0x16b42b.handleNavResult(_0x5068fc || {});
    } catch (_0x1ee4f3) {}
  }
  function _0x288fee(_0x31dc97) {
    const _0x5d0705 = _0x5ea9b0.get(_0x31dc97);
    if (!_0x5d0705) {
      _0x23fbd4(_0x31dc97, "任务已停止");
      try {
        _0x16b42b.cancelPendingForTask(_0x31dc97);
      } catch (_0x3f3ef8) {}
      return false;
    }
    const _0x48484c = _0x5d0705.generation;
    const _0x1c06c9 = !!_0x5d0705.running;
    _0x5d0705.stopRequested = true;
    _0x23fbd4(_0x31dc97, "任务已停止");
    try {
      _0x16b42b.cancelPendingForTask(_0x31dc97);
    } catch (_0x5ce491) {}
    const _0x3e0f45 = _0x5d0705.windowKeys && _0x5d0705.windowKeys.size ? [..._0x5d0705.windowKeys] : _0x745e87(_0x5d0705.accounts || []);
    for (const _0x192aa4 of _0x3e0f45) {
      const _0xd9075e = _0x31c2d3.get(String(_0x192aa4));
      if (!_0xd9075e || _0xd9075e.isDestroyed()) {
        continue;
      }
      try {
        _0xd9075e.webContents.send("control-task", {
          type: "ENTITY_LEADGEN_CANCEL",
          payload: {
            taskId: _0x31dc97,
            accountId: _0x192aa4,
            generation: _0x48484c
          }
        });
      } catch (_0x21ef21) {}
    }
    _0xf412fd(_0x3e0f45);
    _0x5ea9b0.delete(_0x31dc97);
    releaseTaskRuntimeGuard(_0x494c23(_0x31dc97));
    _0x9d21b4(_0x31dc97, _0x1c06c9 ? "线索采集任务已停止（账号占用已释放）" : "线索采集任务已停止", "info");
    _0x396135(_0x31dc97, {
      type: "finished",
      status: "stopped",
      endReason: "manual_stop",
      ts: Date.now()
    });
    return true;
  }
  function _0x3eef61(_0x55faa9) {
    const _0x5c1e06 = _0x5ea9b0.get(_0x55faa9);
    return !!_0x5c1e06 && !_0x5c1e06.stopRequested;
  }
  function _0x33b519() {
    return [..._0x5ea9b0.entries()].filter(([, _0x41b0ab]) => _0x41b0ab && !_0x41b0ab.stopRequested).map(([_0x4fca9f]) => _0x4fca9f);
  }
  function _0x34a005() {
    let _0x3f9169 = 0;
    for (const _0x1c9eb7 of _0x5ea9b0.values()) {
      if (_0x1c9eb7?.stopRequested) {
        continue;
      }
      const _0x4e0571 = Array.isArray(_0x1c9eb7.accounts) ? _0x1c9eb7.accounts : [];
      _0x3f9169 += _0x4e0571.filter(_0x391942 => {
        const _0x247186 = String(_0x391942?.id || "").trim();
        return _0x247186 && !isAnonymousEntityAccountId(_0x247186);
      }).length;
    }
    return _0x3f9169;
  }
  function _0x27521e() {
    const _0x5e1523 = [];
    for (const _0x7c51e7 of _0x5ea9b0.values()) {
      if (_0x7c51e7?.stopRequested) {
        continue;
      }
      const _0x4edf49 = Array.isArray(_0x7c51e7.accounts) ? _0x7c51e7.accounts : [];
      _0x4edf49.forEach(_0x195985 => {
        const _0x468461 = String(_0x195985?.id || "").trim();
        if (_0x468461 && !isAnonymousEntityAccountId(_0x468461)) {
          _0x5e1523.push(_0x468461);
        }
      });
    }
    return _0x5e1523;
  }
  function _0x26fd46(_0x4cabd1 = {}) {
    const _0x4fc653 = Array.isArray(_0x4cabd1?.sourceTypes) ? _0x4cabd1.sourceTypes : [];
    return _0x4fc653.map(String).includes("live");
  }
  function _0x22bc32(_0x535df4 = null) {
    for (const [_0x30e6b0, _0x341c9c] of _0x5ea9b0.entries()) {
      if (_0x535df4 && String(_0x30e6b0) === String(_0x535df4)) {
        continue;
      }
      if (_0x26fd46(_0x341c9c?.config)) {
        return true;
      }
    }
    return false;
  }
  function _0x3ce21d() {
    const _0x5124a4 = [];
    for (const [_0xfe5ec5, _0x8b6672] of _0x5ea9b0.entries()) {
      if (_0x26fd46(_0x8b6672?.config)) {
        _0x5124a4.push(_0xfe5ec5);
      }
    }
    return _0x5124a4;
  }
  function _0x5a1016() {
    [..._0x5ea9b0.keys()].forEach(_0x5094e2 => _0x288fee(_0x5094e2));
  }
  function _0x248269() {
    return [..._0x31c2d3.values()].filter(_0x37ec1c => _0x37ec1c && !_0x37ec1c.isDestroyed()).map(_0x5df170 => _0x5df170.webContents).filter(_0x473316 => _0x473316 && !_0x473316.isDestroyed?.());
  }
  return {
    startTask: _0x59800c,
    stopTask: _0x288fee,
    stopAll: _0x5a1016,
    isTaskRunning: _0x3eef61,
    listRunningTaskIds: _0x33b519,
    countRunningAccounts: _0x34a005,
    listBusyAccountIds: _0x27521e,
    hasRunningLiveTask: _0x22bc32,
    listRunningLiveTaskIds: _0x3ce21d,
    listWebContents: _0x248269,
    getTaskLogs: _0x2ea3e5,
    clearTaskLogs: _0x5db3ad,
    handleCollectProgress: _0x314742,
    handleCollectResult: _0x5bf25b,
    handleAuthorNavResult: _0x4b8fec,
    showMonitorWindow: _0xd6004,
    hideMonitorWindow: _0x2d7f14,
    consumePendingLivePreview: _0x49db9b
  };
}
module.exports = {
  createEntityLeadgenRunner: createEntityLeadgenRunner
};
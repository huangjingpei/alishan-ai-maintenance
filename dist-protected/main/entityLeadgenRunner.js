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
function sleep(arg1) {
  return new Promise(arg12 => setTimeout(arg12, arg1));
}
function withTimeout(arg1, arg2, text = "timeout") {
  let local = null;
  return Promise.race([Promise.resolve(arg1), new Promise((arg1, arg22) => {
    local = setTimeout(() => {
      arg22(Object.assign(new Error(text), {
        code: "entity_timeout"
      }));
    }, arg2);
  })]).finally(() => {
    if (local) {
      clearTimeout(local);
    }
  });
}
function createEntityLeadgenRunner(arg1) {
  const local = () => runtimeConfig?.getPlain?.()?.urls || null;
  const result = createMonitorAuthorWorkNav();
  const {
    app: app,
    store: store,
    fs: fs,
    mainWindow: mainWindow,
    runtimeConfig = null,
    applyAccountProxy: applyAccountProxy,
    configureAutomationSession: configureAutomationSession,
    applyPackagedWindowMenuPolicy: applyPackagedWindowMenuPolicy,
    attachProtocolGuard: attachProtocolGuard,
    appendHistory: appendHistory,
    listKnownLeadUserKeys: listKnownLeadUserKeys,
    listKnownCollectedAuthorKeys: listKnownCollectedAuthorKeys,
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
    resolveAutomationPreloadPath: resolveAutomationPreloadPath = null,
    automationUserAgent = "",
    getViewSettingsMap = null,
    isCommentLeadgenAccountBusy = null,
    isVideoMonitorAccountBusy = null
  } = arg1;
  let local2 = null;
  function fn(arg1) {
    if (!arg1 || arg1.isDestroyed?.() || !mainWindow || mainWindow.isDestroyed?.()) {
      return false;
    }
    const result = String(arg1.__radarEntityViewKey || "").trim();
    const value = result && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result) : null;
    if (!value) {
      return false;
    }
    try {
      return mainWindow.getBrowserViews?.().includes(value) === true;
    } catch (error) {
      return false;
    }
  }
  function fn2(arg1) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.webContents?.isDestroyed?.()) {
      return;
    }
    const result = fn(arg1);
    const result2 = String(arg1.__radarEntityViewKey || "").trim();
    if (result2) {
      try {
        automationLiveViewLifecycle?.wake?.(result2);
      } catch (error) {}
    }
    try {
      arg1.webContents.setBackgroundThrottling?.(false);
    } catch (error) {}
    try {
      arg1.webContents.setFrameRate?.(30);
    } catch (error) {}
    try {
      arg1.webContents.invalidate?.();
    } catch (error) {}
    if (result) {
      return;
    }
  }
  function fn3() {
    if (typeof resolveAutomationPreloadPath === "function") {
      try {
        return resolveAutomationPreloadPath();
      } catch (error) {}
    }
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const result2 = store.get("latest_resource_path");
      if (result2 && fs.existsSync(path.join(result2, "automation-preload.js"))) {
        result = path.join(result2, "automation-preload.js");
      }
    }
    return result;
  }
  const result2 = createEntityAutomationViewHostFactory({
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => null,
    getMainWindow: () => mainWindow,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    applyAccountProxy: applyAccountProxy,
    resolveAutomationPreloadPath: fn3,
    automationUserAgent: automationUserAgent,
    store: store,
    destroyAutomationBrowserView: destroyAutomationBrowserView
  });
  async function fn4(arg1) {
    if (!runtimeConfig || !arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await withTimeout(runtimeConfig.ensureFetched(), 8000, "entity_runtime_config_timeout");
      }
      runtimeConfig.pushToWebContents?.(arg1);
    } catch (error) {
      console.warn("[EntityLeadgen] runtime config push failed:", error?.message || error);
    }
  }
  function fn5(arg1) {
    if (!arg1) {
      return [];
    }
    const result = String(arg1);
    const list = [];
    const pattern = /(https?:\/\/[^\s,，;；"'<>()]+|(?:v\.)?douyin\.com\/[^\s,，;；"'<>()]+)/gi;
    let local;
    while ((local = pattern.exec(result)) !== null) {
      let result = local[1].replace(/[),.;:，。！？、》」』】]+$/g, "");
      if (!/^https?:\/\//i.test(result)) {
        result = "https://" + result;
      }
      if (/douyin\.com|iesdouyin\.com/i.test(result) && !list.includes(result)) {
        list.push(result);
      }
    }
    const pattern2 = /\b(\d{18,20})\b/g;
    while ((local = pattern2.exec(result)) !== null) {
      const value = local[1];
      const value2 = "https://www.douyin.com/video/" + value;
      if (!list.some(arg1 => arg1.includes(value))) {
        list.push(value2);
      }
    }
    return list;
  }
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const local3 = arg1 => "entity-leadgen:" + arg1;
  function fn6() {
    const result = os.totalmem();
    const result2 = os.freemem();
    const value = result2 / 1073741824;
    const value2 = result > 0 ? result2 / result : 1;
    let num = 0;
    let num2 = 0;
    try {
      (app.getAppMetrics?.() || []).forEach(arg1 => {
        num += Number(arg1?.cpu?.percentCPUUsage || 0);
        if (arg1?.type === "Tab" || arg1?.type === "Renderer") {
          const value = Number(arg1?.memory?.workingSetSize || 0) / 1024;
          num2 = Math.max(num2, value);
        }
      });
    } catch (error) {}
    const result3 = Math.min(100, num / Math.max(1, os.cpus().length));
    const local = value < 2 || value2 < 0.12 || result3 >= 75 || num2 >= 700;
    return {
      pressured: local,
      freeMemGB: value,
      appCpuPercent: result3,
      largestRendererMemoryMb: num2
    };
  }
  function fn7(arg1, arg2) {
    try {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents?.isDestroyed?.()) {
        mainWindow.webContents.send("entity-leadgen-task-event", {
          taskId: arg1,
          ...arg2
        });
      }
    } catch (error) {}
  }
  function fn8(arg1, arg2, text = "info", options = {}) {
    if (!arg1 || !arg2) {
      return;
    }
    let result = String(options.accountId || "").trim();
    if (!result) {
      try {
        const result2 = map.get(arg1);
        const value = Array.isArray(result2?.accounts) ? result2.accounts : [];
        const result3 = String(arg2).match(/^\[([^\]]+)\]/);
        if (result3) {
          const value2 = result3[1];
          const result2 = value.find(arg1 => String(arg1?.nickname || "") === value2 || String(arg1?.name || "") === value2 || String(arg1?.id || "") === value2);
          if (result2?.id) {
            result = String(result2.id);
          }
        }
        if (!result && value.length === 1 && value[0]?.id) {
          result = String(value[0].id);
        }
      } catch (error) {}
    }
    const obj = {
      taskId: arg1,
      type: "log",
      message: arg2,
      level: text,
      ts: Date.now(),
      ...(result ? {
        accountId: result
      } : {})
    };
    if (!map3.has(arg1) && map3.size >= RUNTIME_LOG_TASK_LIMIT) {
      const local = [...map3.keys()].find(arg1 => !map.has(arg1)) || map3.keys().next().value;
      if (local != null) {
        map3.delete(local);
      }
    }
    const local = map3.get(arg1) || [];
    local.push(obj);
    if (local.length > RUNTIME_LOG_LIMIT) {
      local.splice(0, local.length - RUNTIME_LOG_LIMIT);
    }
    map3.set(arg1, local);
    fn7(arg1, obj);
  }
  function fn9(arg1, arg2, options = {}) {
    if (!arg1 || !arg2?.patchTask || !options?.url) {
      return null;
    }
    const local = arg2.findTaskById?.(arg1);
    const value = Array.isArray(local?.roomHints) ? local.roomHints : [];
    const obj = {
      url: String(options.url || ""),
      reason: String(options.reason || "live_private"),
      message: String(options.message || "直播间为私密或隐私设置，已跳过"),
      ts: Number(options.ts || Date.now()) || Date.now()
    };
    const result = [...value.filter(arg1 => arg1.url !== obj.url || arg1.reason !== obj.reason), obj].slice(-50);
    const result2 = arg2.patchTask(arg1, {
      roomHints: result
    });
    if (result2) {
      fn7(arg1, {
        type: "task-updated",
        task: result2
      });
    }
    return result2;
  }
  function fn10(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return (map3.get(arg1) || []).map(arg1 => ({
        ...arg1
      }));
    }
    const obj = {};
    for (const [local, local2] of map3.entries()) {
      obj[local] = local2.map(arg1 => ({
        ...arg1
      }));
    }
    return obj;
  }
  function fn11(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return map3.delete(arg1);
    }
    const value = map3.size > 0;
    map3.clear();
    return value;
  }
  function fn12(arg1) {
    return String(arg1 || "").split(/[\n,，、;；]+/).map(arg1 => arg1.trim()).filter(Boolean);
  }
  function fn13(options = {}) {
    const set = new Set(["user", "following", "mutual", "live", "video_search", "video_recommend", "video_like", "video_specific", "author_profile"]);
    const set2 = new Set(["comments", "video", "author"]);
    const set3 = new Set(["enter", "like", "follow", "comment", "interaction", "gift"]);
    const list = [...set3];
    const value = Array.isArray(options.sourceTypes) ? [...new Set(options.sourceTypes.filter(arg1 => set.has(arg1)))] : [];
    const value2 = value.length ? [value[0]] : ["video_search"];
    const value3 = value2[0];
    const result = ["video_search", "video_recommend", "video_like", "video_specific", "author_profile"].includes(value3);
    let value4 = Array.isArray(options.scrapeTargets) ? [...new Set(options.scrapeTargets.filter(arg1 => set2.has(arg1)))] : [];
    if (value3 === "video_specific") {
      value4 = ["comments"];
    } else if (value3 === "author_profile") {
      const set = new Set(["comments", "video"]);
      value4 = value4.filter(arg1 => set.has(arg1));
      if (!value4.length) {
        value4 = ["comments", "video"];
      }
    } else if (result && !value4.length) {
      value4 = ["comments", "video", "author"];
    }
    if (!result) {
      value4 = [];
    }
    const value5 = Array.isArray(options.liveEventTypes) ? [...new Set(options.liveEventTypes.filter(arg1 => set3.has(arg1)))] : list;
    const result2 = Number(options.maxCollect);
    let num = 0;
    if (value3 === "video_recommend") {
      num = Number.isFinite(result2) && result2 > 0 ? Math.min(20000, Math.floor(result2)) : 100;
    } else {
      num = Number.isFinite(result2) && result2 > 0 ? Math.min(20000, Math.floor(result2)) : 0;
    }
    const set4 = new Set(["0", "1", "2", "3", "4", "5"]);
    const set5 = new Set(["0", "1", "2", "3"]);
    const result3 = String(options.userFanCount == null ? "0" : options.userFanCount);
    const result4 = String(options.userTypeFilter == null ? "0" : options.userTypeFilter);
    const result5 = parseEntityLiveUrls(Array.isArray(options.liveUrls) ? options.liveUrls.join("\n") : options.liveUrls);
    const result6 = String(options.specifiedUrls || "").trim();
    const result7 = String(options.bloggerProfileUrls || "").trim();
    const result8 = normalizeBloggerWorkSelectMode(options.bloggerWorkSelectMode);
    const result9 = normalizeBloggerWorkCount(options.bloggerWorkCount);
    const result10 = normalizeBloggerPublishWithinDays(options.bloggerPublishWithinDays);
    const value6 = options.bloggerExcludePinned !== false;
    const local = (arg1, arg2, text = "0") => {
      const result = String(arg1 == null ? text : arg1);
      if (arg2.has(result)) {
        return result;
      } else {
        return text;
      }
    };
    const local2 = arg1 => {
      const result = Number(arg1);
      if (!Number.isFinite(result) || result <= 0) {
        return 0;
      }
      return Math.floor(result);
    };
    const result11 = Number(options.liveDurationSeconds);
    const value7 = Number.isFinite(result11) && result11 >= 0 ? Math.min(10080, Math.max(0, Math.round(result11 / 60))) * 60 : 180;
    const result12 = normalizeLiveConcurrency(options.liveConcurrency, LIVE_CONCURRENCY_DEFAULT);
    const set6 = new Set(["all", "1d", "3d", "1w", "1mo", "custom"]);
    let result13 = String(options.commentTimePreset || "").trim();
    const obj = {
      all: 0,
      "1d": 1440,
      "3d": 4320,
      "1w": 10080,
      "1mo": 43200
    };
    const result14 = Number(options.commentWindowMinutes);
    let value8 = Number.isFinite(result14) && result14 > 0 ? Math.min(43200, Math.floor(result14)) : 0;
    if (!set6.has(result13)) {
      if (value8 <= 0) {
        result13 = "all";
      } else {
        const result = Object.entries(obj).find(([, arg1]) => arg1 === value8);
        result13 = result ? result[0] : "custom";
      }
    }
    if (result13 !== "custom" && Object.prototype.hasOwnProperty.call(obj, result13)) {
      value8 = obj[result13];
    }
    const value9 = options.commentLocationFilterMode === "exclude" ? "exclude" : "include";
    const value10 = Array.isArray(options.commentLocationFilterRegions) ? options.commentLocationFilterRegions.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : String(options.commentLocationFilterRegions || "").split(/[,，\n\r]+/).map(arg1 => arg1.trim()).filter(Boolean);
    return {
      selectedAccounts: Array.isArray(options.selectedAccounts) ? options.selectedAccounts.map(String) : [],
      sourceTypes: value2,
      scrapeTargets: value4,
      keywords: Array.isArray(options.keywords) ? options.keywords.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : fn12(options.keywords),
      specifiedUrls: result6,
      bloggerProfileUrls: result7,
      bloggerWorkSelectMode: result8,
      bloggerWorkCount: result9,
      bloggerPublishWithinDays: result10,
      bloggerExcludePinned: value6,
      liveUrls: result5,
      liveEventTypes: value5,
      liveDurationSeconds: value7,
      liveConcurrency: result12,
      userFanCount: set4.has(result3) ? result3 : "0",
      userTypeFilter: set5.has(result4) ? result4 : "0",
      maxCollect: num,
      searchSort: local(options.searchSort, new Set(["0", "1", "2"])),
      searchPublishTime: local(options.searchPublishTime, new Set(["0", "1", "2", "3"])),
      searchDuration: local(options.searchDuration, new Set(["0", "1", "2", "3"])),
      searchScope: local(options.searchScope, new Set(["0", "1", "2", "3"])),
      searchFormat: local(options.searchFormat, new Set(["0", "1", "2"])),
      excludeTitleKeywords: String(options.excludeTitleKeywords || ""),
      includeTitleKeywords: String(options.includeTitleKeywords || ""),
      excludeAuthorAccounts: String(options.excludeAuthorAccounts || ""),
      videoPublishWithinDays: local2(options.videoPublishWithinDays),
      localVideoDuration: local(options.localVideoDuration, new Set(["0", "1", "2", "3"])),
      minVideoLike: local2(options.minVideoLike),
      minVideoComment: local2(options.minVideoComment),
      minVideoCollect: local2(options.minVideoCollect),
      minVideoShare: local2(options.minVideoShare),
      commentTimePreset: result13,
      commentWindowMinutes: value8,
      commentLocationFilterMode: value9,
      commentLocationFilterRegions: value10,
      commentIncludeKeywords: String(options.commentIncludeKeywords || ""),
      commentExcludeKeywords: String(options.commentExcludeKeywords || "")
    };
  }
  function fn14(arg1, arg2) {
    return Array.isArray(arg1?.scrapeTargets) && arg1.scrapeTargets.includes(arg2);
  }
  function fn15(options = {}) {
    if (isEntityRelationAuthorSource(options.sourceType, options.entrySource)) {
      return false;
    }
    const result = String(options.sourceType || "").trim();
    if (result === "video" || result.startsWith("video_") || result === "author_profile") {
      return true;
    }
    if (String(options.identityType || "") === "video") {
      return true;
    }
    if (String(options.leadKind || "") === "video_card") {
      return true;
    }
    if (/^video:\d{10,}$/.test(String(options.userKey || options.leadId || options.key || "").trim())) {
      return true;
    }
    const value = Array.isArray(options.collectedFields) ? options.collectedFields : [];
    return value.includes("video") || value.includes("author");
  }
  function fn16(arg1, arg2) {
    const result = fn14(arg2, "video");
    const result2 = fn14(arg2, "author");
    if (!result && !result2) {
      return arg1;
    }
    return (Array.isArray(arg1) ? arg1 : []).map(arg1 => {
      const local = String(arg1.authorProfileUrl || "").trim() || (/\/user\//i.test(String(arg1.userUrl || "")) && !/\/(?:video|note)\//i.test(String(arg1.userUrl || "")) ? String(arg1.userUrl || "").trim() : "");
      const result3 = String(arg1.authorNickname || "").trim().replace(/^@+/, "");
      const list = [];
      if (result) {
        list.push("video");
      }
      if (result2 && local && !/\/(?:video|note)\//i.test(local)) {
        list.push("author");
      }
      const result4 = getEntityEntryMeta(arg1.sourceType || "video");
      return {
        ...arg1,
        authorProfileUrl: local,
        authorNickname: result3 || (list.includes("author") ? "未知作者" : ""),
        collectedFields: list,
        sourceType: "video",
        identityType: "video",
        entrySource: arg1.entrySource || result4.entrySource,
        entryLabel: arg1.entryLabel || result4.entryLabel
      };
    }).filter(arg1 => Array.isArray(arg1.collectedFields) && arg1.collectedFields.length > 0);
  }
  function fn17(arg1) {
    return String(arg1 || "").split(/[,，、;；\n\r]+/).map(arg1 => arg1.trim()).filter(Boolean);
  }
  function fn18(arg1, options = {}) {
    const result = fn17(options.excludeTitleKeywords).map(arg1 => arg1.toLowerCase());
    const result2 = fn17(options.includeTitleKeywords).map(arg1 => arg1.toLowerCase());
    const set = new Set(fn17(options.excludeAuthorAccounts).map(arg1 => arg1.replace(/^@+/, "").toLowerCase()));
    const local = Number(options.minVideoLike) || 0;
    const local2 = Number(options.minVideoComment) || 0;
    const local3 = Number(options.minVideoCollect) || 0;
    const local4 = Number(options.minVideoShare) || 0;
    const result3 = String(Array.isArray(options.sourceTypes) && options.sourceTypes[0] || options.sourceType || "");
    const value = result3 !== "video_search";
    const value2 = value ? Number(options.videoPublishWithinDays) || 0 : 0;
    const value3 = value ? String(options.localVideoDuration || "0") : "0";
    const result4 = Date.now();
    const result5 = (Array.isArray(arg1) ? arg1 : []).map(arg1 => result3 === "video_search" ? enrichVideoPublishTime(arg1, result4) : arg1);
    return result5.filter(arg1 => {
      const result3 = String(arg1.title || arg1.nickname || "").toLowerCase();
      if (result.length && result.some(arg1 => result3.includes(arg1))) {
        return false;
      }
      if (result2.length && !result2.some(arg1 => result3.includes(arg1))) {
        return false;
      }
      const result5 = String(arg1.authorNickname || arg1.nickname || "").replace(/^@+/, "").toLowerCase();
      if (result5 && set.has(result5)) {
        return false;
      }
      const result6 = Number(arg1.likeCount || arg1.diggCount || 0);
      const result7 = Number(arg1.commentCount || 0);
      const result8 = Number(arg1.collectCount || 0);
      const result9 = Number(arg1.shareCount || 0);
      if (local > 0 && result6 < local) {
        return false;
      }
      if (local2 > 0 && result7 < local2) {
        return false;
      }
      if (local3 > 0 && result8 < local3) {
        return false;
      }
      if (local4 > 0 && result9 < local4) {
        return false;
      }
      if (value2 > 0) {
        const result = Number(arg1.createTime || arg1.publishTime || arg1.eventTimestamp || 0);
        const value = result > 1000000000000 ? result : result > 1000000000 ? result * 1000 : 0;
        if (value > 0 && result4 - value > value2 * 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      const result10 = Number(arg1.duration || arg1.videoDuration || 0);
      if (value3 !== "0" && result10 > 0) {
        if (value3 === "1" && result10 >= 60) {
          return false;
        }
        if (value3 === "2" && (result10 < 60 || result10 > 300)) {
          return false;
        }
        if (value3 === "3" && result10 <= 300) {
          return false;
        }
      }
      return true;
    });
  }
  function fn19(options = {}, arg2 = null) {
    const set = new Set(Array.isArray(arg2) ? arg2 : ["enter", "like", "follow", "comment", "interaction", "gift"]);
    const value = Array.isArray(options.liveEvents) ? options.liveEvents : options.liveEvent ? [options.liveEvent] : [];
    const result = value.filter(arg1 => set.has(resolveLiveEventCategory(arg1)));
    if (!result.length) {
      return null;
    }
    const value2 = result[result.length - 1];
    return {
      ...options,
      content: value2.content || options.content || "",
      liveEvent: value2,
      liveEvents: result,
      messageId: value2.messageId || options.messageId || "",
      eventTimestamp: value2.occurredAt || options.eventTimestamp || 0
    };
  }
  function fn20(arg1) {
    if (!arg1 || typeof arg1 !== "string") {
      return false;
    }
    const result = arg1.trim();
    if (result.length < 15) {
      return false;
    }
    if (["self", "login", "anonymous", "undefined", "null"].includes(result.toLowerCase())) {
      return false;
    }
    if (result.startsWith("name:") || result.startsWith("live_")) {
      return false;
    }
    return /^[A-Za-z0-9_\-]+$/.test(result);
  }
  function fn21(arg1) {
    const result = String(arg1 || "").trim();
    return /^\d{5,24}$/.test(result) && !/^0+$/.test(result) && result !== "111111";
  }
  function fn22(arg1) {
    const result = String(arg1 || "").trim();
    return result.length >= 15 && result !== "111111" && /^[A-Za-z0-9_\-]+$/.test(result);
  }
  function fn23(options = {}) {
    const result = String(options.userKey || "").trim();
    if (/^video:\d{10,}$/.test(result)) {
      return result;
    }
    const result2 = String(options.sourceType || "").trim();
    const local = result2 === "video" || result2.startsWith("video_") || String(options.identityType || "") === "video" || result.startsWith("video:");
    const result3 = /douyin\.com\/(?:video|note)\//i.test(String(options.userUrl || ""));
    if (local || result3) {
      const local = extractDouyinVideoId(options.userUrl || "") || extractDouyinVideoId(options.videoUrl || "") || extractDouyinVideoId(options.content || "") || (result.startsWith("video:") ? result.slice(6) : "");
      if (local) {
        return "video:" + local;
      }
    }
    const result4 = String(options.secUid || options.sec_uid || "").trim();
    if (fn20(result4)) {
      return result4;
    }
    const result5 = String(options.webcastUid || options.webcast_uid || options.webcast_uid_str || "").trim();
    if (fn22(result5)) {
      return "webcast:" + result5;
    }
    const result6 = leadUserKey.getLeadUserKey({
      userUrl: options.userUrl
    });
    if (result6) {
      return result6;
    }
    const result7 = String(options.uid || options.id_str || options.idStr || options.user_id || "").trim();
    if (fn21(result7)) {
      return "uid:" + result7;
    }
    if (fn20(result) || /^uid:\d{5,24}$/.test(result) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(result)) {
      return result;
    }
    const result8 = String(options.nickname || "").trim();
    if (result8) {
      return "name:" + result8;
    } else {
      return "";
    }
  }
  function fn24(options = {}) {
    const obj = {
      ...options
    };
    let result = String(obj.userUrl || obj.content || "").trim();
    if (fn15(obj)) {
      const local = extractDouyinVideoId(obj.videoUrl || "") || extractDouyinVideoId(result) || extractDouyinVideoId(obj.content || "") || (String(obj.userKey || "").startsWith("video:") ? String(obj.userKey).slice(6) : "");
      if (local) {
        const value = "https://www.douyin.com/video/" + local;
        const local2 = String(obj.authorProfileUrl || "").trim() || (/\/user\//i.test(String(obj.userUrl || "")) && !/\/(?:video|note)\//i.test(String(obj.userUrl || "")) ? String(obj.userUrl || "").trim() : "");
        const result = String(obj.authorNickname || "").trim().replace(/^@+/, "");
        const result2 = getEntityEntryMeta(obj.sourceType || "video");
        obj.videoUrl = value;
        obj.userUrl = value;
        obj.userKey = "video:" + local;
        obj.content = value;
        obj.title = String(obj.title || obj.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
        obj.nickname = obj.title;
        obj.authorProfileUrl = local2;
        obj.authorNickname = result;
        obj.secUid = "";
        obj.uid = "";
        obj.webcastUid = "";
        obj.identityType = "video";
        obj.sourceType = "video";
        obj.entrySource = obj.entrySource || result2.entrySource;
        obj.entryLabel = obj.entryLabel || result2.entryLabel;
        obj.profileAvailable = false;
        obj.profileUnavailable = true;
        obj.profileUnavailableReason = "视频作品链接";
        return obj;
      }
    }
    const result2 = String(obj.secUid || obj.sec_uid || "").trim();
    const result3 = String(obj.webcastUid || obj.webcast_uid || obj.webcast_uid_str || "").trim();
    const result4 = leadUserKey.extractUserKeyFromUrl(result);
    const value = fn20(result2) ? result2 : !result3 && fn20(result4) ? result4 : "";
    const result5 = String(obj.uid || obj.id_str || obj.idStr || obj.user_id || "").trim();
    const value2 = fn21(result5) ? result5 : "";
    const value3 = !value2 && !value && fn22(result3) ? result3 : "";
    if (value) {
      result = "https://www.douyin.com/user/" + value;
      obj.secUid = value;
    } else {
      obj.secUid = "";
      if (!/\/user\//i.test(result) || /\/(?:video|note)\//i.test(result)) {
        result = "";
      }
    }
    obj.uid = value2;
    obj.webcastUid = value3;
    obj.userUrl = result;
    obj.userKey = fn23(obj);
    obj.nickname = String(obj.nickname || "").trim().replace(/^@+/, "");
    obj.identityType = value ? "profile" : value3 ? "webcast" : "numeric";
    obj.profileAvailable = !!value;
    obj.profileUnavailable = !value;
    obj.profileUnavailableReason = value ? "" : String(obj.profileUnavailableReason || (value3 ? "主播设置不支持查看他人资料" : "实时消息未提供主页标识"));
    obj.liveEvents = Array.isArray(obj.liveEvents) ? obj.liveEvents.filter(arg1 => arg1 && typeof arg1 === "object") : obj.liveEvent ? [obj.liveEvent] : [];
    return obj;
  }
  function fn25() {
    try {
      if (typeof listKnownLeadUserKeys === "function") {
        const result = listKnownLeadUserKeys();
        return new Set(Array.isArray(result) ? result.map(String).filter(Boolean) : []);
      }
    } catch (error) {}
    return new Set();
  }
  function fn26() {
    try {
      if (typeof listKnownCollectedAuthorKeys === "function") {
        const result = listKnownCollectedAuthorKeys();
        return new Set(Array.isArray(result) ? result.map(String).filter(Boolean) : []);
      }
    } catch (error) {}
    return new Set();
  }
  function fn27(arg1) {
    if (isEntityRelationAuthorSource(arg1)) {
      return fn26();
    }
    return fn25();
  }
  async function fn28(arg1, arg2, {
    guest = false,
    platform = "douyin"
  } = {}) {
    const {
      facade: facade,
      viewKey: viewKey
    } = await result2.createEntityAccountHost(arg1, arg2, {
      guest: guest || isAnonymousEntityAccountId(arg1),
      platform: platform || "douyin"
    });
    facade.__radarEntityViewKey = viewKey;
    try {
      const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
      value?.set?.(viewKey, {
        taskId: "entity-host:" + arg1,
        accountId: String(arg1),
        platform: platform || "douyin",
        taskMode: "entity_leadgen",
        entityLeadgen: true
      });
    } catch (error) {}
    facade.webContents.on("dom-ready", () => {
      runtimeConfig?.ensureAndPushToWebContents?.(facade.webContents);
      fn2(facade);
      try {
        nudgeAutomationViewRepaint?.(facade.webContents, getPlatformViews?.()?.get?.(viewKey));
      } catch (error) {}
    });
    facade.webContents.on("did-finish-load", () => {
      fn2(facade);
      try {
        nudgeAutomationViewRepaint?.(facade.webContents, getPlatformViews?.()?.get?.(viewKey));
      } catch (error) {}
      try {
        requestAutomationLayoutRefresh?.();
      } catch (error) {}
    });
    facade.webContents.on("render-process-gone", () => {
      facade.__radarEntityUnhealthy = true;
    });
    facade.webContents.on("unresponsive", () => {
      facade.__radarEntityUnhealthy = true;
    });
    facade.webContents.on("responsive", () => {
      facade.__radarEntityUnhealthy = false;
    });
    try {
      ensureAutomationPaintWatchdog?.();
    } catch (error) {}
    facade.__radarEntityNetworkCapture = createEntityLeadgenNetworkCapture(facade);
    return facade;
  }
  function fn29(arg1, arg2, text = "") {
    if (!arg1 || arg1.isDestroyed?.()) {
      return false;
    }
    const result = String(arg1.__radarEntityViewKey || "").trim();
    const value = result && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result) : null;
    if (!value || value.webContents?.isDestroyed?.()) {
      return false;
    }
    fn2(arg1);
    const local = automationLiveViewLifecycle?.beginTask?.(result, {
      taskId: String(text || "entity-host:" + arg2),
      runtimeTaskId: String(text || ""),
      accountId: String(arg2),
      taskMode: "entity_leadgen",
      entityLeadgen: true
    });
    return local?.ok === true;
  }
  async function fn30(arg1, arg2, text = "") {
    if (!arg1 || arg1.isDestroyed?.()) {
      return {
        ok: false,
        reason: "window_unavailable"
      };
    }
    const result = String(arg1.__radarEntityViewKey || "").trim();
    const value = result && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result) : null;
    if (!value || value.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable"
      };
    }
    const result2 = await automationLiveViewLifecycle?.acquireExecutionViewport?.(result, {
      runtimeTaskId: String(arg2 || "")
    });
    if (result2?.ok === false) {
      return result2;
    }
    arg1.__radarEntityExecutionViewportGeneration = result2?.generation ?? null;
    if (fn(arg1)) {
      try {
        const local = value.getBounds?.() || {};
        const result = Math.max(1, Number(local.width) || 1);
        const result2 = Math.max(1, Number(local.height) || 1);
        const result3 = Math.max(0.25, Math.min(1, result / 1200, result2 / 800));
        value.webContents.setZoomFactor?.(result3);
      } catch (error) {}
    }
    await sleep(180);
    let local = null;
    try {
      local = await withTimeout(value.webContents.executeJavaScript("({\n          innerWidth: window.innerWidth || 0,\n          innerHeight: window.innerHeight || 0,\n          scrollHeight: Math.max(document.documentElement?.scrollHeight || 0, document.body?.scrollHeight || 0),\n          visibility: String(document.visibilityState || '')\n        })", true), 2500, "entity_execution_viewport_probe_timeout");
    } catch (error) {}
    if (local && (Number(local.innerWidth) < 1000 || Number(local.innerHeight) < 650)) {
      fn8(arg2, "[" + (text || "采集账号") + "] 执行视口偏小 " + local.innerWidth + "×" + local.innerHeight + "，已保持桌面缩放继续运行", "warning");
    }
    return {
      ok: true,
      ...result2,
      viewport: local
    };
  }
  function fn31(arg1) {
    if (!arg1) {
      return;
    }
    const result = String(arg1.__radarEntityViewKey || "").trim();
    if (!result) {
      return;
    }
    const value = arg1.__radarEntityExecutionViewportGeneration;
    arg1.__radarEntityExecutionViewportGeneration = null;
    try {
      automationLiveViewLifecycle?.releaseExecutionViewport?.(result, {
        generation: value
      });
    } catch (error) {}
  }
  async function fn32(arg1, arg2, {
    platform = "douyin",
    runtimeTaskId = ""
  } = {}) {
    const result = String(arg1);
    const flag = isAnonymousEntityAccountId(result);
    let result2 = map4.get(result);
    if (result2 && !result2.isDestroyed() && !result2.__radarEntityUnhealthy) {
      const result3 = String(result2.__radarEntityViewKey || "").trim();
      const value = result3 && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result3) : null;
      if (value?.webContents === result2.webContents && !value.webContents?.isDestroyed?.()) {
        const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap()?.get?.(result3) : null;
        const local = !!runtimeTaskId && !value?.finishedAt && String(value?.runtimeTaskId || "") === String(runtimeTaskId);
        if (local) {
          fn29(result2, arg1, runtimeTaskId);
          return result2;
        }
        try {
          cancelPendingAutomationViewDestroy?.(result3);
        } catch (error) {}
      }
      try {
        result2.destroy?.();
      } catch (error) {}
      map4.delete(result);
      result2 = null;
      await sleep(process.platform === "darwin" ? 1300 : 260);
    }
    if (result2 && !result2.isDestroyed()) {
      try {
        result2.destroy?.();
      } catch (error) {}
      map4.delete(result);
      result2 = null;
      await sleep(process.platform === "darwin" ? 1300 : 260);
    }
    result2 = await fn28(arg1, arg2, {
      guest: flag,
      platform: platform
    });
    map4.set(result, result2);
    result2.on("closed", () => {
      try {
        result2.__radarEntityNetworkCapture?.dispose?.();
      } catch (error) {}
      if (map4.get(result) === result2) {
        map4.delete(result);
      }
    });
    try {
      result2.setTitle(flag ? "线索采集（无账号游客）" : "线索采集 - " + arg1);
    } catch (error) {}
    fn29(result2, arg1, runtimeTaskId);
    await fn4(result2.webContents);
    return result2;
  }
  function fn33() {
    const set = new Set();
    for (const item of map.values()) {
      if (item?.windowKeys && item.windowKeys.size) {
        for (const item2 of item.windowKeys) {
          if (item2) {
            set.add(String(item2));
          }
        }
      }
      const value = Array.isArray(item?.accounts) ? item.accounts : [];
      for (const item of value) {
        const result = String(item?.id || "").trim();
        if (result) {
          set.add(result);
        }
      }
    }
    return set;
  }
  function fn34(arg1 = null) {
    let local;
    if (arg1 != null && arg1 !== "") {
      local = [String(arg1)];
    } else {
      const result = fn33();
      local = result.size ? [...result] : [];
    }
    const list = [];
    const set = new Set();
    local.forEach(arg1 => {
      const result = map4.get(String(arg1));
      if (!result || result.isDestroyed?.()) {
        return;
      }
      const value = result.__radarEntityViewKey;
      if (!value || set.has(value)) {
        return;
      }
      const value2 = typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(value) : null;
      if (!value2 || value2.webContents?.isDestroyed?.()) {
        return;
      }
      set.add(value);
      list.push(value);
    });
    return list;
  }
  function fn35(arg1 = null) {
    const result = fn34(arg1);
    if (!result.length) {
      return {
        success: false,
        error: "暂无采集窗口可监控",
        shown: 0
      };
    }
    for (const item of result) {
      const result = [...map4.values()].find(arg1 => arg1?.__radarEntityViewKey === item);
      fn2(result);
    }
    local2 = {
      viewKeys: result,
      accountId: arg1 != null ? String(arg1) : null,
      at: Date.now()
    };
    try {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents?.isDestroyed?.()) {
        mainWindow.webContents.send("entity-leadgen-open-live-preview", {
          viewKeys: result,
          accountId: arg1 != null ? String(arg1) : null
        });
      }
    } catch (error) {}
    return {
      success: true,
      shown: result.length,
      viewKeys: result,
      livePreview: true
    };
  }
  function fn36(arg1 = null) {
    const result = fn34(arg1);
    local2 = null;
    try {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents?.isDestroyed?.()) {
        mainWindow.webContents.send("entity-leadgen-close-live-preview", {
          viewKeys: result,
          accountId: arg1 != null ? String(arg1) : null
        });
      }
    } catch (error) {}
    return {
      success: true,
      hidden: result.length,
      viewKeys: result,
      livePreview: true
    };
  }
  function fn37() {
    if (!local2) {
      return null;
    }
    const obj = {
      ...local2,
      viewKeys: Array.isArray(local2.viewKeys) ? [...local2.viewKeys] : []
    };
    local2 = null;
    const result = obj.viewKeys.filter(arg1 => {
      try {
        const value = typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(arg1) : null;
        return !!value && !value.webContents?.isDestroyed?.();
      } catch (error) {
        return false;
      }
    });
    if (!result.length) {
      return null;
    }
    return {
      ...obj,
      viewKeys: result
    };
  }
  function fn38(arg1) {
    const result = String(arg1 || "");
    return /douyin\.com\/(?:video|note|jingxuan)\//i.test(result) || /[?&#]modal_id=/i.test(result);
  }
  function fn39(arg1) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return;
    }
    withTimeout(arg1.webContents.executeJavaScript("\n      (() => {\n        const pauseMedia = (media) => {\n          try {\n            media.muted = true;\n            media.autoplay = false;\n            media.loop = false;\n            if (typeof media.pause === 'function') media.pause();\n            media.preload = 'metadata';\n          } catch (_) {}\n        };\n        document.querySelectorAll('video, audio').forEach(pauseMedia);\n        if (!window.__radarEntityVideoMediaBlockerInstalled) {\n          window.__radarEntityVideoMediaBlockerInstalled = true;\n          document.addEventListener('play', (event) => {\n            if (window.__radarEntityAllowVideoPlay) return;\n            const media = event.target;\n            if (media && (media.tagName === 'VIDEO' || media.tagName === 'AUDIO')) {\n              pauseMedia(media);\n            }\n          }, true);\n        }\n        return true;\n      })()\n    ", true), EXEC_JS_TIMEOUT_MS, "entity_media_blocker_timeout").catch(() => {});
  }
  async function fn40(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.webContents?.isDestroyed?.()) {
      return false;
    }
    try {
      await withTimeout(arg1.webContents.executeJavaScript("window.__radarEntityAllowVideoPlay = " + (arg2 ? "true" : "false") + "; true;", true), EXEC_JS_TIMEOUT_MS, "entity_allow_play_timeout");
      return true;
    } catch (error) {
      return false;
    }
  }
  async function fn41(arg1) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.webContents?.isDestroyed?.()) {
      return false;
    }
    await fn40(arg1, false);
    fn39(arg1);
    try {
      await withTimeout(arg1.webContents.executeJavaScript("\n          (() => {\n            document.querySelectorAll('video, audio').forEach((media) => {\n              try {\n                media.muted = true;\n                media.autoplay = false;\n                if (typeof media.pause === 'function') media.pause();\n              } catch (_) {}\n            });\n            return true;\n          })()\n        ", true), EXEC_JS_TIMEOUT_MS, "entity_publish_time_pause_timeout");
      return true;
    } catch (error) {
      return false;
    }
  }
  async function fn42(arg1) {
    if (!arg1 || arg1.isDestroyed?.() || arg1.webContents?.isDestroyed?.()) {
      return "";
    }
    try {
      const result = await withTimeout(arg1.webContents.executeJavaScript(buildDouyinVideoCreateTimeWidgetReadExpression(), true), EXEC_JS_TIMEOUT_MS, "entity_create_time_widget_timeout");
      return String(result || "").trim();
    } catch (error) {
      return "";
    }
  }
  function fn43(arg1) {
    return String(arg1 || "").replace(/\s+/g, "").trim();
  }
  async function fn44(arg1, {
    seenTexts = [],
    timeoutMs = 12000,
    taskId: taskId = "",
    generation: generation = 0
  } = {}) {
    const set = new Set((Array.isArray(seenTexts) ? seenTexts : []).map(arg1 => fn43(arg1)).filter(Boolean));
    await fn40(arg1, true);
    let text = "";
    const result = Date.now();
    while (Date.now() - result < timeoutMs) {
      if (taskId && !fn45(taskId, generation)) {
        return {
          text: "",
          refreshed: false,
          cancelled: true
        };
      }
      const result = await fn42(arg1);
      const result2 = fn43(result);
      if (result2 && !set.has(result2)) {
        if (result2 === text) {
          return {
            text: result,
            refreshed: true
          };
        }
        text = result2;
      } else {
        text = "";
      }
      await sleep(500);
    }
    return {
      text: text,
      refreshed: false
    };
  }
  async function fn46(arg1) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return;
    }
    try {
      arg1.webContents.stop();
    } catch (error) {}
    try {
      await withTimeout(arg1.loadURL("about:blank"), BLANK_NAV_TIMEOUT_MS, "entity_blank_timeout");
    } catch (error) {
      try {
        arg1.webContents.stop();
      } catch (error) {}
    }
    await sleep(280);
  }
  async function fn47(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      throw new Error("线索采集窗口已销毁");
    }
    fn2(arg1);
    const local = () => {
      if (!arg1 || arg1.isDestroyed()) {
        return;
      }
      const local = runtimeConfig?.getPlain?.()?.apiHooks || null;
      withTimeout(arg1.webContents.executeJavaScript(getEntityLeadgenApiHookInstaller(local), true), EXEC_JS_TIMEOUT_MS, "entity_api_hook_timeout").catch(() => {});
      withTimeout(arg1.webContents.executeJavaScript(getLeadgenScrapeApiHookInstaller(local), true), EXEC_JS_TIMEOUT_MS, "leadgen_scrape_api_hook_timeout").catch(() => {});
      if (/^https:\/\/live\.douyin\.com\//i.test(String(arg2 || ""))) {
        withTimeout(arg1.webContents.executeJavaScript(getEntityLeadgenLiveHookInstaller(), true), EXEC_JS_TIMEOUT_MS, "entity_live_hook_timeout").catch(() => {});
      }
      if (fn38(arg2)) {
        fn39(arg1);
      }
    };
    const local2 = () => local();
    const local3 = () => local();
    try {
      arg1.webContents.once("dom-ready", local2);
      arg1.webContents.once("did-finish-load", local3);
    } catch (error) {}
    let local4 = null;
    try {
      await Promise.race([arg1.loadURL(arg2), new Promise((arg1, arg2) => {
        local4 = setTimeout(() => {
          arg2(Object.assign(new Error("页面加载超时"), {
            code: "entity_navigation_timeout"
          }));
        }, NAVIGATION_TIMEOUT_MS);
      })]);
    } catch (error) {
      if (error?.code === "entity_navigation_timeout") {
        try {
          arg1.webContents.stop();
        } catch (error) {}
        throw error;
      }
      const result = String(error?.message || error || "");
      if (!/ERR_ABORTED|\(-3\)/.test(result)) {
        throw error;
      }
      console.log("[EntityLeadgen] loadURL aborted（已忽略）: " + String(arg2 || "").slice(0, 120));
    } finally {
      if (local4) {
        clearTimeout(local4);
      }
      try {
        arg1.webContents.removeListener("dom-ready", local2);
        arg1.webContents.removeListener("did-finish-load", local3);
      } catch (error) {}
    }
    local();
    await fn48(arg1);
    local();
  }
  async function fn48(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    const result = Date.now();
    await sleep(PAGE_SETTLE_MIN_MS);
    while (Date.now() - result < PAGE_SETTLE_MAX_MS) {
      if (!arg1 || arg1.isDestroyed()) {
        return;
      }
      let flag = false;
      try {
        flag = await withTimeout(arg1.webContents.executeJavaScript("(() => {\n              try {\n                if (document.readyState !== 'complete') return false;\n                const text = ((document.body && document.body.innerText) || '').trim();\n                return text.length > 60;\n              } catch (_) { return false; }\n            })()", true), EXEC_JS_TIMEOUT_MS, "entity_settle_js_timeout");
      } catch (error) {
        flag = false;
      }
      if (flag) {
        return;
      }
      await sleep(400);
    }
  }
  async function fn49(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || !arg1.__radarEntityGuest) {
      return;
    }
    if (arg1.__radarEntityGuestWarmed) {
      return;
    }
    fn8(arg2, "正在准备无账号采集环境…", "info");
    try {
      await fn47(arg1, "https://www.douyin.com/");
      await sleep(1800);
    } catch (error) {
      fn8(arg2, "无账号采集环境准备未完成，将继续尝试", "warning");
    }
    arg1.__radarEntityGuestWarmed = true;
  }
  function fn50(list = []) {
    return (Array.isArray(list) ? list : []).map(arg1 => String(arg1?.id || arg1 || "").trim()).filter(Boolean);
  }
  function fn51(arg1 = null) {
    const value = arg1 == null ? [...map4.keys()] : fn50(arg1);
    value.forEach(arg1 => {
      const result = map4.get(arg1);
      if (!result) {
        return;
      }
      map4.delete(arg1);
      try {
        result.__radarEntityNetworkCapture?.dispose?.();
      } catch (error) {}
      try {
        const value = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
        const value2 = result.__radarEntityViewKey;
        if (value && value2) {
          value.delete(value2);
        }
      } catch (error) {}
      try {
        if (typeof result.destroy === "function") {
          result.destroy();
        } else {
          result.close?.();
        }
      } catch (error) {}
    });
  }
  function fn52(arg1 = null) {
    local2 = null;
    const value = arg1 == null ? [...map4.keys()] : fn50(arg1);
    const list = [];
    value.forEach(arg1 => {
      const result = map4.get(String(arg1));
      if (!result || result.isDestroyed?.()) {
        return;
      }
      const value = result.__radarEntityViewKey;
      if (!value) {
        return;
      }
      list.push(value);
      try {
        const value2 = typeof getViewSettingsMap === "function" ? getViewSettingsMap() : null;
        const local = value2?.get?.(value);
        automationLiveViewLifecycle?.finishTask?.(value, {
          reason: "entity-finished",
          settingsSnapshot: local && typeof local === "object" ? {
            ...local
          } : null
        });
      } catch (error) {}
    });
    try {
      const local = mainWindow;
      if (local && !local.isDestroyed() && !local.webContents?.isDestroyed?.()) {
        local.webContents.send("entity-leadgen-detach-live-preview", {
          viewKeys: list,
          accountIds: arg1 == null ? null : value.map(String)
        });
      }
    } catch (error) {}
  }
  async function fn53(arg1, arg2, text = "", text2 = "") {
    try {
      await arg1?.__radarEntityNetworkCapture?.begin?.({
        sourceType: arg2,
        searchKeyword: text,
        sourceVideoUrl: arg2 === "comment" ? text2 || text : text2
      });
    } catch (error) {}
  }
  function fn54(arg1, arg2) {
    const result = String(arg2 || "0");
    if (result === "0") {
      return true;
    }
    const result2 = Number(arg1);
    if (!Number.isFinite(result2) || result2 < 0) {
      return false;
    }
    if (result === "1") {
      return result2 < 1000;
    }
    if (result === "2") {
      return result2 >= 1000 && result2 < 10000;
    }
    if (result === "3") {
      return result2 >= 10000 && result2 < 100000;
    }
    if (result === "4") {
      return result2 >= 100000 && result2 < 1000000;
    }
    if (result === "5") {
      return result2 >= 1000000;
    }
    return true;
  }
  async function fn55(arg1, arg2, num = 0, {
    sourceType = "",
    userFanCount = "0",
    liveEventTypes = null,
    commentFilters = null,
    targetVideoUrl = ""
  } = {}) {
    await sleep(350);
    let list = [];
    try {
      list = arg1?.__radarEntityNetworkCapture?.takeUsers?.(num) || [];
    } catch (error) {}
    if (sourceType === "video") {
      list = list.filter(arg1 => String(arg1?.sourceType || "") === "video" || String(arg1?.userKey || "").startsWith("video:") || !!extractDouyinVideoId(arg1?.userUrl || arg1?.videoUrl || arg1?.content || ""));
      const value = Array.isArray(arg2?.users) ? arg2.users : [];
      const set = new Set(value.map(arg1 => fn23(arg1)).filter(Boolean));
      if (set.size) {
        list = list.filter(arg1 => set.has(fn23(arg1)));
      }
      if (!list.length) {
        return arg2 || {
          success: true,
          users: value
        };
      }
    }
    if (!list.length) {
      return arg2;
    }
    if (sourceType === "user" && String(userFanCount || "0") !== "0") {
      list = list.filter(arg1 => fn54(arg1.followerCount, userFanCount));
    }
    if (sourceType === "comment") {
      const result = normalizeEntityCommentFilters(commentFilters || {});
      if (result.active) {
        list = list.filter(arg1 => evaluateEntityCommentFilters(arg1, result).pass);
      }
      if (!list.length) {
        return arg2 || {
          success: true,
          users: []
        };
      }
    }
    const map = new Map();
    const result = [...(Array.isArray(arg2?.users) ? arg2.users : []), ...list].map(arg1 => sourceType === "live" ? fn19(arg1, liveEventTypes) : arg1).filter(Boolean);
    result.forEach(arg1 => {
      const result = fn23(arg1);
      if (!result) {
        return;
      }
      if (!map.has(result)) {
        map.set(result, arg1);
        return;
      }
      if (sourceType === "video") {
        const local = map.get(result) || {};
        const local2 = (arg1, arg2) => {
          const result = String(arg1 || "").trim();
          const result2 = String(arg2 || "").trim();
          return result || result2;
        };
        map.set(result, {
          ...local,
          ...arg1,
          title: local2(local.title || local.nickname, arg1.title || arg1.nickname),
          nickname: local2(local.title || local.nickname, arg1.title || arg1.nickname),
          videoUrl: local2(local.videoUrl, arg1.videoUrl),
          authorProfileUrl: local2(local.authorProfileUrl, arg1.authorProfileUrl),
          authorNickname: local2(local.authorNickname, arg1.authorNickname),
          publishTimeText: local2(local.publishTimeText, arg1.publishTimeText),
          createTime: Number(local.createTime || arg1.createTime || 0) || Number(arg1.createTime || local.createTime || 0) || 0,
          publishTime: Number(local.publishTime || arg1.publishTime || local.createTime || arg1.createTime || 0) || 0
        });
        return;
      }
      if (sourceType === "comment") {
        const local = map.get(result) || {};
        const local2 = (arg1, arg2) => {
          const result = String(arg1 || "").trim();
          const result2 = String(arg2 || "").trim();
          if (result && result !== "视频评论区潜客" && result !== "实体获客" && result !== "线索采集") {
            return result;
          }
          return result2 || result;
        };
        map.set(result, {
          ...local,
          ...arg1,
          content: local2(local.content, arg1.content),
          time: local2(local.time, arg1.time),
          timeText: local2(local.timeText, arg1.timeText),
          ipLocation: local2(local.ipLocation, arg1.ipLocation) || local2(local.location, arg1.location),
          location: local2(local.location, arg1.location) || local2(local.ipLocation, arg1.ipLocation),
          videoUrl: canonicalizeDouyinVideoUrl(local.videoUrl) || canonicalizeDouyinVideoUrl(arg1.videoUrl) || ""
        });
      }
    });
    let list2 = [...map.values()];
    if (sourceType === "comment") {
      const result = normalizeEntityCommentFilters(commentFilters || {});
      if (result.active) {
        list2 = list2.filter(arg1 => evaluateEntityCommentFilters(arg1, result).pass);
      }
      const result2 = canonicalizeDouyinVideoUrl(targetVideoUrl);
      if (result2) {
        list2 = list2.map(arg1 => ({
          ...arg1,
          videoUrl: canonicalizeDouyinVideoUrl(arg1.videoUrl) || result2,
          title: String(arg1.title || arg1.sourceVideoTitle || "").trim(),
          sourceVideoTitle: String(arg1.sourceVideoTitle || arg1.title || "").trim()
        }));
      }
    }
    return {
      ...(arg2 || {}),
      success: arg2?.success !== false || list2.length > 0,
      users: num > 0 ? list2.slice(0, num) : list2
    };
  }
  function fn56(arg1, arg2, arg3, arg4) {
    const result = getEntityEntryMeta(arg1.sourceType);
    const result2 = Date.now();
    const result3 = Number(arg1.eventTimestamp || arg1.liveEvent?.occurredAt || 0);
    const value = Number.isFinite(result3) && result3 > 0 ? result3 : result2;
    const result4 = String(arg1.sourceType || "").trim();
    const value2 = fn15(arg1) ? extractDouyinVideoId(arg1.videoUrl || arg1.userUrl || arg1.content || "") || (String(arg1.userKey || "").startsWith("video:") ? String(arg1.userKey).slice(6) : "") : "";
    if (value2) {
      const value3 = "https://www.douyin.com/video/" + value2;
      const local = String(arg1.title || arg1.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
      const value4 = "video:" + value2;
      const value5 = Array.isArray(arg1.collectedFields) && arg1.collectedFields.length ? arg1.collectedFields.map(String) : ["video"];
      const local2 = String(arg1.authorProfileUrl || "").trim() || (/\/user\//i.test(String(arg1.userUrl || "")) && !/\/(?:video|note)\//i.test(String(arg1.userUrl || "")) ? String(arg1.userUrl || "").trim() : "");
      const result2 = String(arg1.authorNickname || "").trim().replace(/^@+/, "");
      const result3 = String(arg1.entrySource || result.entrySource || "").trim();
      const result4 = String(arg1.entryLabel || result.entryLabel || "").trim();
      const result5 = normalizeAwemeCreateTimeMs(arg1.publishTime ?? arg1.createTime ?? arg1.create_time ?? 0);
      const result6 = String(arg1.publishTimeText || "").trim();
      const obj = {
        platform: "DY",
        leadKind: "video_card",
        leadId: value4,
        key: value4,
        userKey: value4,
        type: "LEAD",
        title: local,
        nickname: result2 || "未知作者",
        content: "",
        timeText: result6 || "卡片采集",
        ipLocation: "",
        userUrl: "",
        authorProfileUrl: "",
        url: value3,
        videoUrl: value3,
        uid: "",
        secUid: "",
        webcastUid: "",
        privacyMasked: false,
        identityType: "video",
        profileAvailable: false,
        profileUnavailable: true,
        profileUnavailableReason: "视频作品链接",
        collectedFields: value5,
        messageId: "",
        liveEvent: null,
        liveEvents: [],
        eventTimestamp: value,
        publishTime: result5,
        publishTimeText: result6,
        createTime: result5,
        firstSeenAt: value,
        lastSeenAt: value,
        liveUrl: "",
        timestamp: value,
        capturedAt: new Date(value).toISOString(),
        isHighIntention: true,
        accountId: String(arg2.id || arg2.accountId || ""),
        accountName: arg2.nickname || arg2.name || "未知账号",
        taskName: arg4,
        taskId: arg3,
        searchKeyword: String(arg1.searchKeyword || ""),
        entrySource: result3 || result.entrySource,
        entryLabel: result4 || result.entryLabel,
        thought: result4 || result.entryLabel || "线索采集：从搜索结果采集视频链接",
        actions: {
          liked: false,
          replied: false,
          messaged: false,
          followed: false
        },
        sourceType: "video"
      };
      if (value5.includes("author") && local2 && !/\/(?:video|note)\//i.test(local2)) {
        obj.userUrl = local2;
        obj.authorProfileUrl = local2;
        obj.nickname = result2 || obj.nickname;
        obj.profileAvailable = true;
        obj.profileUnavailable = false;
        obj.profileUnavailableReason = "";
      }
      return obj;
    }
    if (isEntityRelationAuthorSource(result4, arg1.entrySource)) {
      const result2 = resolveAuthorSecUidFromLead(arg1);
      if (result2) {
        const result3 = normalizeAuthorProfileUrl(result2);
        const result5 = toCollectedAuthorKey(result2);
        const local = String(arg1.nickname || "").trim().replace(/^@+/, "") || "未知用户";
        return {
          platform: "DY",
          leadKind: "collected_author",
          leadId: result5,
          key: result5,
          userKey: result5,
          type: "LEAD",
          title: "",
          nickname: local,
          authorNickname: local,
          content: result.entryLabel || "线索采集",
          timeText: stripLocationFromCommentTimeText(arg1.timeText || arg1.time) || String(arg1.timeText || arg1.time || "").trim() || "线索采集",
          ipLocation: String(arg1.ipLocation || arg1.location || "").trim(),
          userUrl: result3,
          authorProfileUrl: result3,
          url: result3,
          videoUrl: "",
          uid: String(arg1.uid || "").trim(),
          secUid: result2,
          webcastUid: "",
          privacyMasked: !!arg1.privacyMasked,
          identityType: "author",
          profileAvailable: true,
          profileUnavailable: false,
          profileUnavailableReason: "",
          collectedFields: ["author"],
          messageId: "",
          liveEvent: null,
          liveEvents: [],
          eventTimestamp: value,
          firstSeenAt: value,
          lastSeenAt: value,
          timestamp: value,
          capturedAt: new Date(value).toISOString(),
          isHighIntention: false,
          accountId: String(arg2.id || arg2.accountId || ""),
          accountName: arg2.nickname || arg2.name || "未知账号",
          taskName: arg4,
          taskId: arg3,
          searchKeyword: String(arg1.searchKeyword || ""),
          entrySource: result.entrySource,
          entryLabel: result.entryLabel,
          thought: result.entryLabel,
          actions: {
            liked: false,
            replied: false,
            messaged: false,
            followed: false
          },
          sourceType: result4
        };
      }
    }
    const obj = {
      platform: "DY",
      title: arg1.liveUrl ? "直播间：" + arg1.liveUrl : String(arg1.title || arg1.sourceVideoTitle || "").replace(/\s+/g, " ").trim(),
      sourceVideoTitle: String(arg1.sourceVideoTitle || arg1.title || "").replace(/\s+/g, " ").trim(),
      nickname: String(arg1.nickname || "").trim() || "未知用户",
      content: arg1.content ? arg1.content : arg1.searchKeyword ? "线索采集关键词：" + arg1.searchKeyword : result.entryLabel || "线索采集",
      timeText: stripLocationFromCommentTimeText(arg1.timeText || arg1.time) || String(arg1.timeText || arg1.time || "").trim() || "线索采集",
      ipLocation: String(arg1.ipLocation || arg1.location || "").trim(),
      userUrl: String(arg1.userUrl || "").trim(),
      url: String(arg1.userUrl || arg1.liveUrl || "").trim(),
      videoUrl: canonicalizeDouyinVideoUrl(arg1.videoUrl) || (result4 === "comment" ? canonicalizeDouyinVideoUrl(arg1.sourceVideoUrl || arg1.searchKeyword) : "") || "",
      uid: String(arg1.uid || "").trim(),
      secUid: String(arg1.secUid || "").trim(),
      webcastUid: String(arg1.webcastUid || "").trim(),
      privacyMasked: !!arg1.privacyMasked,
      identityType: String(arg1.identityType || ""),
      profileAvailable: !!arg1.profileAvailable,
      profileUnavailable: !!arg1.profileUnavailable,
      profileUnavailableReason: String(arg1.profileUnavailableReason || ""),
      userKey: fn23(arg1),
      messageId: String(arg1.messageId || arg1.liveEvent?.messageId || "").trim(),
      liveEvent: arg1.liveEvent || null,
      liveEvents: Array.isArray(arg1.liveEvents) ? arg1.liveEvents : [],
      eventTimestamp: value,
      firstSeenAt: value,
      lastSeenAt: value,
      liveUrl: String(arg1.liveUrl || "").trim(),
      timestamp: value,
      capturedAt: new Date(value).toISOString(),
      type: "LEAD",
      isHighIntention: true,
      accountId: String(arg2.id || arg2.accountId || ""),
      accountName: arg2.nickname || arg2.name || "未知账号",
      taskName: arg4,
      taskId: arg3,
      searchKeyword: String(arg1.searchKeyword || ""),
      entrySource: result.entrySource,
      entryLabel: result.entryLabel,
      thought: result.entryLabel,
      actions: {
        liked: false,
        replied: false,
        messaged: false,
        followed: false
      },
      sourceType: result4
    };
    const result5 = leadUserKey.buildLeadId(obj);
    obj.leadId = result5;
    obj.key = result5;
    return obj;
  }
  function fn57(arg1, arg2, arg3) {
    const result = (Array.isArray(arg1) ? arg1 : [arg1]).filter(isEntityLeadEligibleForLeadPool);
    if (!result.length || typeof appendHistory !== "function") {
      return 0;
    }
    appendHistory(result, arg2, arg3);
    const result2 = result.filter(arg1 => arg1.leadKind !== "collected_author" && arg1.leadKind !== "collected_video" && arg1.leadKind !== "video_card" && !/^author:/.test(String(arg1.leadId || arg1.key || "")));
    if (result2.length && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("automation-data", {
        type: "comment",
        payload: result2.length === 1 ? result2[0] : result2,
        taskId: arg2,
        taskName: arg3
      });
    }
    return result.length;
  }
  function fn58(arg1, arg2) {
    const result = map2.get(arg1);
    if (!result) {
      return;
    }
    clearTimeout(result.timer);
    if (result.softFailTimer) {
      clearTimeout(result.softFailTimer);
    }
    map2.delete(arg1);
    result.resolve(arg2 || {});
  }
  function fn59(arg1, arg2) {
    for (const [local, local2] of map2.entries()) {
      if (String(local2.taskId) !== String(arg1)) {
        continue;
      }
      if (local2.failing) {
        continue;
      }
      local2.failing = true;
      if (local2.softFailTimer) {
        clearTimeout(local2.softFailTimer);
      }
      local2.softFailTimer = setTimeout(() => {
        if (!map2.has(local)) {
          return;
        }
        clearTimeout(local2.timer);
        map2.delete(local);
        local2.resolve({
          success: false,
          cancelled: true,
          error: arg2 || "任务已停止",
          users: []
        });
      }, 2500);
    }
  }
  function fn60(arg1, arg2) {
    const value = "entity_scrape_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    return new Promise(arg12 => {
      const local = arg2.sourceType === "live" && Number(arg2.liveDurationSeconds) === 0;
      const value2 = arg2.sourceType === "live" ? Math.max(0, Number(arg2.liveDurationSeconds) || 0) * 1000 : 0;
      const value3 = arg2.sourceType === "live" ? Math.max(PAGE_SCRAPE_TIMEOUT_MS, value2 + 60000) : PAGE_SCRAPE_TIMEOUT_MS;
      const value4 = local ? null : setTimeout(() => {
        map2.delete(value);
        arg12({
          success: false,
          error: "页面采集超时（" + Math.round(value3 / 60000) + " 分钟）",
          users: []
        });
      }, value3);
      map2.set(value, {
        resolve: arg12,
        timer: value4,
        taskId: arg2.taskId,
        webContentsId: arg1.webContents.id
      });
      (async () => {
        try {
          await fn4(arg1.webContents);
          if (!arg1 || arg1.isDestroyed()) {
            throw new Error("线索采集窗口已销毁");
          }
          arg1.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_SCRAPE_PAGE",
            payload: {
              ...arg2,
              requestId: value
            }
          });
        } catch (error) {
          clearTimeout(value4);
          map2.delete(value);
          arg12({
            success: false,
            error: error.message || "发送采集指令失败",
            users: []
          });
        }
      })();
    });
  }
  function fn61(arg1, arg2, options = {}, num = 45000) {
    const value = "entity_ctrl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    return new Promise(arg12 => {
      const result = setTimeout(() => {
        map2.delete(value);
        arg12({
          success: false,
          error: "操作超时",
          timedOut: true
        });
      }, Math.max(8000, Number(num) || 45000));
      map2.set(value, {
        resolve: arg12,
        timer: result,
        taskId: options.taskId,
        webContentsId: arg1?.webContents?.id
      });
      (async () => {
        try {
          await fn4(arg1.webContents);
          if (!arg1 || arg1.isDestroyed()) {
            throw new Error("线索采集窗口已销毁");
          }
          arg1.webContents.send("control-task", {
            type: arg2,
            payload: {
              ...options,
              requestId: value
            }
          });
        } catch (error) {
          clearTimeout(result);
          map2.delete(value);
          arg12({
            success: false,
            error: error.message || "发送指令失败"
          });
        }
      })();
    });
  }
  function fn45(arg1, arg2) {
    const result = map.get(arg1);
    return !!result && result.generation === arg2 && !result.stopRequested;
  }
  function fn62(arg1) {
    if (!arg1) {
      return false;
    }
    if (arg1.limitReached) {
      return true;
    }
    const value = Array.isArray(arg1.config?.sourceTypes) ? arg1.config.sourceTypes[0] : "";
    if (value === "video_recommend") {
      return false;
    }
    const local = Number(arg1?.config?.maxCollect) || 0;
    if (local <= 0) {
      return false;
    }
    return (arg1?.progress?.collectedThisRun || 0) >= local;
  }
  function fn63(arg1) {
    if (!arg1 || arg1.stopRequested || fn62(arg1)) {
      return null;
    }
    const value = Array.isArray(arg1.config?.keywords) ? arg1.config.keywords : [];
    const local = Number(arg1.nextKeywordIndex) || 0;
    if (local >= value.length) {
      return null;
    }
    const value2 = value[local];
    arg1.nextKeywordIndex = local + 1;
    return {
      keyword: value2,
      index: local
    };
  }
  function fn64(arg1) {
    if (!arg1 || arg1.stopRequested || fn62(arg1)) {
      return null;
    }
    const value = Array.isArray(arg1.config?.liveUrls) ? arg1.config.liveUrls : [];
    const local = Number(arg1.nextLiveUrlIndex) || 0;
    if (local >= value.length) {
      return null;
    }
    const value2 = value[local];
    arg1.nextLiveUrlIndex = local + 1;
    return {
      rawUrl: value2,
      index: local,
      total: value.length
    };
  }
  async function fn65(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "";
    }
    const result2 = buildDouyinLiveUrl(result);
    if (result2 && /^https:\/\/live\.douyin\.com\/\d{6,24}$/i.test(result2)) {
      return result2;
    }
    if (/v\.douyin\.com|iesdouyin\.com\/share|webcast\.amemv\.com|\/webcast\/reflow\//i.test(result) || /v\.douyin\.com|iesdouyin\.com\/share|webcast\.amemv\.com|\/webcast\/reflow\//i.test(result2)) {
      try {
        const result3 = await resolveDouyinShareUrl(result);
        const result4 = buildDouyinLiveUrl(result3 || "");
        if (result4 && /^https:\/\/live\.douyin\.com\/\d{6,24}$/i.test(result4)) {
          return result4;
        }
        return result4 || result2 || result;
      } catch (error) {
        return result2 || result;
      }
    }
    return result2 || result;
  }
  async function fn66(arg1, arg2, num = 0) {
    if (num <= 0) {
      return true;
    }
    let flag = false;
    while (fn45(arg1, arg2)) {
      const result = fn6();
      if (!result.pressured) {
        if (flag) {
          fn8(arg1, "电脑资源已恢复，继续启动下一个直播间", "info");
        }
        return true;
      }
      if (!flag) {
        flag = true;
        fn8(arg1, "当前电脑负载较高，暂停启动新的直播间（可用内存 " + result.freeMemGB.toFixed(1) + "GB，应用 CPU " + result.appCpuPercent.toFixed(0) + "%）", "warning");
      }
      await sleep(3000);
    }
    return false;
  }
  function fn67(arg1 = null) {
    let num = 0;
    for (const [local, local2] of map.entries()) {
      if (arg1 && String(local) === String(arg1)) {
        continue;
      }
      num += Math.max(0, Number(local2.liveWorkerCount) || 0);
    }
    return num;
  }
  async function fn68(arg1, arg2, arg3, arg4 = LIVE_CONCURRENCY_DEFAULT) {
    let flag = false;
    const result = normalizeLiveConcurrency(arg4, LIVE_CONCURRENCY_DEFAULT);
    while (fn45(arg1, arg2)) {
      const result2 = getLocalLiveRoomConcurrencyDetails(arg3, result);
      const result3 = getLocalLiveRoomConcurrencyDetails(result, result);
      const result4 = Math.max(0, result3.workers - fn67(arg1));
      if (result4 > 0) {
        const result = Math.max(1, Math.min(result2.workers, result4));
        const result3 = map.get(arg1);
        if (result3 && result3.generation === arg2) {
          result3.liveWorkerCount = result;
          result3.liveConcurrencyDetails = result2;
        }
        if (flag) {
          fn8(arg1, "直播采集资源已释放，开始处理直播间队列", "info");
        }
        return result;
      }
      if (!flag) {
        flag = true;
        fn8(arg1, "其它直播采集任务已占满安全并发额度，正在排队等待", "warning");
      }
      await sleep(3000);
    }
    return 0;
  }
  function fn69(options = {}) {
    const value = options.taskId;
    if (!value || !map.has(value)) {
      return;
    }
    const result = map.get(value);
    if (!result) {
      return;
    }
    if (options.generation != null && result.generation != null && Number(options.generation) !== Number(result.generation)) {
      return;
    }
    if (options.resetNetworkCapture) {
      const result = map4.get(String(options.accountId || ""));
      try {
        result?.__radarEntityNetworkCapture?.begin?.({
          sourceType: options.sourceType || "mutual",
          searchKeyword: ""
        });
      } catch (error) {}
      try {
        if (result && !result.isDestroyed()) {
          result.webContents.send("entity-leadgen-clear-scrape-aweme", {
            reason: "reset-network-capture"
          });
        }
      } catch (error) {}
    }
    if (options.message) {
      const result2 = String(options.accountId || "");
      const result3 = (result.accounts || []).find(arg1 => String(arg1.id) === result2);
      const result4 = String(options.accountName || result3?.nickname || result3?.name || (result2 === "anonymous" ? "无账号采集" : result2)).trim();
      const result5 = String(options.message);
      const value2 = result4 && !result5.startsWith("[" + result4 + "]") ? "[" + result4 + "] " + result5 : result5;
      fn8(value, value2, options.level || "info", {
        accountId: result2 || String(result3?.id || "")
      });
    }
    const value2 = Array.isArray(options.users) ? options.users : [];
    if (!value2.length) {
      return;
    }
    if (options.skipIngest) {
      return;
    }
    if (!result?.knownKeys || !result.tasksApi) {
      return;
    }
    const result2 = String(options.accountId || "");
    const local = (result.accounts || []).find(arg1 => String(arg1.id) === result2) || (result.accounts || [])[0] || {
      id: result2 || "anonymous",
      nickname: options.accountName || "无账号采集",
      name: "无账号采集"
    };
    const result3 = String(options.sourceType || "blogger");
    let local2 = value2;
    let local3 = result3;
    if (result3 === "video" || result3.startsWith("video_") || result3 === "blogger" || result3 === "author_profile") {
      const local = fn14(result.config, "video") || fn14(result.config, "author");
      if (local) {
        const result2 = fn18(value2, result.config);
        const result4 = getEntityEntryMeta(result3 === "blogger" ? "video_search" : result3);
        local2 = fn16(result2, result.config).map(arg1 => ({
          ...arg1,
          sourceType: "video",
          identityType: "video",
          entrySource: arg1.entrySource || result4.entrySource,
          entryLabel: arg1.entryLabel || result4.entryLabel
        }));
        local3 = "video";
      }
    }
    if (!local2.length) {
      return;
    }
    fn70({
      users: local2,
      account: local,
      taskId: value,
      taskName: result.taskName || "线索采集",
      tasksApi: result.tasksApi,
      knownKeys: result.knownKeys,
      sourceType: local3,
      progress: result.progress,
      maxCollect: result.config?.maxCollect || 0,
      generation: result.generation
    });
  }
  function fn71(options = {}) {
    if (!options.requestId) {
      return;
    }
    fn58(options.requestId, options);
  }
  function fn70({
    users: users,
    account: account,
    taskId: taskId,
    taskName: taskName,
    tasksApi: tasksApi,
    knownKeys: knownKeys,
    sourceType: sourceType,
    progress = null,
    maxCollect = 0,
    generation = null
  }) {
    const result = map.get(taskId);
    if (generation != null && result && Number(result.generation) !== Number(generation)) {
      return {
        synced: 0,
        duplicates: 0,
        skipped: 0,
        received: 0,
        truncated: 0
      };
    }
    const result2 = (Array.isArray(users) ? users : []).map(arg1 => fn24(arg1)).filter(arg1 => {
      if (!arg1 || !arg1.nickname) {
        return false;
      }
      const local = arg1.sourceType || sourceType;
      if (local === "live" || arg1.entrySource === "entity_live") {
        return hasUsableSecUid(arg1);
      }
      return true;
    });
    const list = [];
    const list2 = [];
    const list3 = [];
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    const local = progress || result?.progress || null;
    if (result && !(result.ingestedKeysThisRun instanceof Set)) {
      result.ingestedKeysThisRun = new Set();
    }
    if (result && !(result.duplicateTrailKeys instanceof Set)) {
      result.duplicateTrailKeys = new Set();
    }
    const local2 = result?.ingestedKeysThisRun || null;
    const local3 = result?.duplicateTrailKeys || null;
    const value = Number(maxCollect) > 0 ? Number(maxCollect) : Number(result?.config?.maxCollect) || 0;
    result2.forEach(arg1 => {
      if (isEntityRelationAuthorSource(arg1.sourceType || sourceType, arg1.entrySource)) {
        const result = resolveAuthorSecUidFromLead({
          ...arg1,
          sourceType: arg1.sourceType || sourceType
        });
        if (result) {
          arg1.secUid = result;
          arg1.userUrl = normalizeAuthorProfileUrl(result);
          arg1.authorProfileUrl = arg1.userUrl;
        }
      }
      const result = fn23(arg1);
      if (!result) {
        num4 += 1;
        return;
      }
      if (knownKeys.has(result)) {
        if ((arg1.sourceType || sourceType) === "live" && (arg1.liveEvent || arg1.liveEvents?.length || arg1.messageId || arg1.content)) {
          list2.push({
            ...arg1,
            userKey: result,
            sourceType: "live"
          });
        } else if (local2?.has(result)) {
          num3 += 1;
        } else {
          num2 += 1;
          if (!local3?.has(result)) {
            try {
              local3?.add(result);
            } catch (error) {}
            num += 1;
            list3.push({
              ...arg1,
              userKey: result,
              sourceType: arg1.sourceType || sourceType
            });
          }
        }
        return;
      }
      if (value > 0 && local && (local.collectedThisRun || 0) + list.length >= value) {
        num5 += 1;
        return;
      }
      knownKeys.add(result);
      try {
        local2?.add(result);
      } catch (error) {}
      list.push({
        ...arg1,
        userKey: result,
        sourceType: arg1.sourceType || sourceType
      });
    });
    if (local && list.length) {
      local.collectedThisRun = (local.collectedThisRun || 0) + list.length;
    }
    if (value > 0 && local && (local.collectedThisRun || 0) >= value && result && !result.limitReached) {
      result.limitReached = true;
      fn59(taskId, "已达到最大采集数");
      const value = result.windowKeys && result.windowKeys.size ? [...result.windowKeys] : fn50(result.accounts || []);
      for (const item of value) {
        const result2 = map4.get(String(item));
        if (!result2 || result2.isDestroyed()) {
          continue;
        }
        try {
          result2.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: taskId,
              accountId: item,
              generation: result.generation
            }
          });
        } catch (error) {}
      }
    }
    const list4 = [...list, ...list2];
    const result3 = list4.map(arg1 => fn56(arg1, account, taskId, taskName));
    fn57(result3, taskId, taskName);
    const value2 = list.length;
    const local4 = (arg1, {
      duplicate = false,
      tsOffset = 0
    } = {}) => {
      const result = fn56(arg1, account, taskId, taskName);
      const local = result.leadKind === "video_card" || (arg1.sourceType || sourceType) === "video" || String(arg1.identityType || "") === "video" || String(arg1.userKey || "").startsWith("video:");
      const value = Array.isArray(result.collectedFields) && result.collectedFields.length ? result.collectedFields.map(String) : Array.isArray(arg1.collectedFields) && arg1.collectedFields.length ? arg1.collectedFields.map(String) : local ? ["video"] : [];
      const result2 = getEntityEntryMeta(local ? arg1.entrySource || result.entrySource || "video" : arg1.sourceType || sourceType);
      return {
        accountId: String(account.id),
        accountName: account.nickname || account.name || "",
        nickname: local ? result.nickname || arg1.authorNickname || result.title || arg1.nickname : arg1.nickname,
        title: result.title || arg1.title || arg1.sourceVideoTitle || "",
        sourceVideoTitle: result.sourceVideoTitle || arg1.sourceVideoTitle || arg1.title || "",
        uid: local ? "" : arg1.uid || "",
        secUid: local ? "" : arg1.secUid || "",
        webcastUid: local ? "" : arg1.webcastUid || "",
        privacyMasked: !!arg1.privacyMasked,
        identityType: local ? "video" : arg1.identityType || "",
        profileAvailable: local ? !!result.profileAvailable : !!arg1.profileAvailable,
        profileUnavailable: local ? !!result.profileUnavailable : !!arg1.profileUnavailable,
        profileUnavailableReason: local ? result.profileUnavailableReason || "视频作品链接" : arg1.profileUnavailableReason || "",
        userUrl: local ? result.userUrl || result.authorProfileUrl || "" : arg1.userUrl || "",
        authorProfileUrl: local ? result.authorProfileUrl || arg1.authorProfileUrl || "" : "",
        authorNickname: local ? arg1.authorNickname || result.nickname || "" : "",
        videoUrl: result.videoUrl || canonicalizeDouyinVideoUrl(arg1.videoUrl) || "",
        url: local ? result.url || result.videoUrl || "" : result.userUrl || arg1.userUrl || "",
        leadKind: local ? "video_card" : "",
        leadId: result.leadId || "",
        collectedFields: value,
        content: local ? result.videoUrl || arg1.content || "" : arg1.content || "",
        timeText: local ? String(arg1.publishTimeText || result.timeText || "").trim() || "卡片采集" : stripLocationFromCommentTimeText(arg1.timeText || arg1.time) || String(arg1.timeText || arg1.time || "").trim(),
        ipLocation: local ? "" : String(arg1.ipLocation || arg1.location || "").trim(),
        messageId: arg1.messageId || arg1.liveEvent?.messageId || "",
        eventTimestamp: arg1.eventTimestamp || arg1.liveEvent?.occurredAt || 0,
        publishTime: local ? normalizeAwemeCreateTimeMs(arg1.publishTime ?? arg1.createTime ?? arg1.create_time ?? result.publishTime ?? 0) : 0,
        publishTimeText: local ? String(arg1.publishTimeText || "").trim() : "",
        liveEvent: arg1.liveEvent || null,
        liveEvents: Array.isArray(arg1.liveEvents) ? arg1.liveEvents : [],
        sourceType: local ? "video" : arg1.sourceType || sourceType,
        searchKeyword: arg1.searchKeyword || "",
        entrySource: arg1.entrySource || result.entrySource || result2.entrySource,
        entryLabel: arg1.entryLabel || result.entryLabel || result2.entryLabel,
        duplicate: !!duplicate,
        ts: Date.now() + tsOffset
      };
    };
    const list5 = [...list4.map((arg1, arg2) => local4(arg1, {
      duplicate: arg2 >= list.length,
      tsOffset: arg2
    })), ...list3.map((arg1, arg2) => local4(arg1, {
      duplicate: true,
      tsOffset: list4.length + arg2
    }))];
    if (list5.length) {
      tasksApi.appendLeadRecords(taskId, list5);
    }
    const local5 = arg1 => list.filter(arg12 => {
      const value = Array.isArray(arg12.collectedFields) ? arg12.collectedFields : [];
      if (arg1 === "video" || arg1 === "author") {
        return value.includes(arg1) || arg1 === "video" && ((arg12.sourceType || sourceType) === "video" || String(arg12.userKey || "").startsWith("video:")) && !value.length;
      }
      return (arg12.sourceType || sourceType) === arg1;
    }).length;
    const obj = {
      collected: value2 || list.length,
      duplicates: num,
      blogger: local5("blogger"),
      user: local5("user"),
      mutual: local5("mutual"),
      following: local5("following"),
      live: local5("live"),
      comment: local5("comment"),
      video: local5("video"),
      author: local5("author"),
      lastCycleAt: Date.now()
    };
    if (value2 || num || list.length || list2.length || list3.length) {
      const result = tasksApi.incrementStats(taskId, obj);
      fn7(taskId, {
        type: "stats",
        accountId: String(account?.id || ""),
        delta: obj,
        ts: Date.now()
      });
      if (result) {
        fn7(taskId, {
          type: "task-updated",
          task: {
            id: taskId,
            stats: result.stats,
            status: result.status
          },
          ts: Date.now()
        });
      }
    }
    if (list5.length) {
      fn7(taskId, {
        type: "leads",
        ts: Date.now()
      });
    }
    return {
      synced: value2,
      updated: list2.length,
      duplicates: num,
      inPool: num2,
      alreadyCounted: num3,
      skipped: num4,
      truncated: num5,
      received: result2.length,
      duplicatePoolLabel: isEntityRelationAuthorSource(sourceType) ? "采集主页" : "线索库"
    };
  }
  function fn72(options = {}) {
    return formatEntityIngestSummary(options);
  }
  function fn73(arg1, arg2) {
    const value = Array.isArray(arg1?.users) ? arg1.users : [];
    if (!value.length) {
      return {
        synced: 0,
        duplicates: 0,
        skipped: 0,
        truncated: 0,
        received: 0
      };
    }
    return fn70({
      users: value,
      account: arg2.account,
      taskId: arg2.taskId,
      taskName: arg2.taskName,
      tasksApi: arg2.tasksApi,
      knownKeys: arg2.knownKeys,
      sourceType: arg2.sourceType,
      progress: arg2.progress,
      maxCollect: arg2.maxCollect,
      generation: arg2.generation
    });
  }
  async function fn74(arg1, {
    taskId: taskId,
    accountId: accountId,
    accountName: accountName,
    sourceType: sourceType,
    searchKeyword: searchKeyword,
    maxCollect: maxCollect,
    collectedThisRun: collectedThisRun,
    knownKeys: knownKeys,
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
    const value = maxCollect > 0 ? Math.max(0, maxCollect - collectedThisRun) : 0;
    if (maxCollect > 0 && value <= 0) {
      return {
        success: true,
        users: [],
        reachedLimit: true
      };
    }
    const result = await fn60(arg1, {
      taskId: taskId,
      accountId: accountId,
      accountName: accountName,
      sourceType: sourceType,
      searchKeyword: searchKeyword || "",
      maxCollect: maxCollect > 0 ? value : 0,
      seenKeys: sourceType === "video" || sourceType === "comment" ? [] : [...knownKeys],
      generation: generation,
      skipIngest: !!skipIngest,
      userFanCount: sourceType === "user" ? String(userFanCount || "0") : "0",
      userTypeFilter: sourceType === "user" ? String(userTypeFilter || "0") : "0",
      ...(sourceType === "video" ? {
        searchSort: String(searchSort || "0"),
        searchPublishTime: String(searchPublishTime || "0"),
        searchDuration: String(searchDuration || "0"),
        searchScope: String(searchScope || "0"),
        searchFormat: String(searchFormat || "0")
      } : {}),
      liveEventTypes: sourceType === "live" && Array.isArray(liveEventTypes) ? liveEventTypes : undefined,
      liveDurationSeconds: sourceType === "live" ? liveDurationSeconds : undefined,
      commentFilters: sourceType === "comment" && commentFilters ? commentFilters : undefined,
      targetVideoUrl: sourceType === "comment" ? String(targetVideoUrl || "").trim() : undefined,
      alreadyOnCurrentVideo: sourceType === "comment" ? !!alreadyOnCurrentVideo : undefined
    });
    return fn55(arg1, result, value, {
      sourceType: sourceType,
      userFanCount: userFanCount,
      liveEventTypes: liveEventTypes,
      commentFilters: commentFilters,
      targetVideoUrl: sourceType === "comment" ? String(targetVideoUrl || "").trim() : ""
    });
  }
  function fn75(options = {}) {
    return {
      commentTimePreset: String(options.commentTimePreset || "all"),
      commentWindowMinutes: Number(options.commentWindowMinutes) || 0,
      commentLocationFilterMode: options.commentLocationFilterMode === "exclude" ? "exclude" : "include",
      commentLocationFilterRegions: Array.isArray(options.commentLocationFilterRegions) ? options.commentLocationFilterRegions : [],
      commentIncludeKeywords: String(options.commentIncludeKeywords || ""),
      commentExcludeKeywords: String(options.commentExcludeKeywords || "")
    };
  }
  async function fn76(arg1, arg2, arg3) {
    const result2 = String(arg2.id);
    const local2 = arg2.nickname || arg2.name || result2;
    const result3 = Math.max(0, Number(arg2.liveWorkerIndex) || 0);
    fn8(arg1, "[" + local2 + "] 开始线索采集", "info", {
      accountId: result2
    });
    let local3;
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    const result4 = map.get(arg1);
    const local4 = result4?.progress?.collectedThisRun || 0;
    const local5 = () => {
      const result = map.get(arg1);
      if (!result || result.generation !== arg3) {
        return null;
      }
      return result;
    };
    try {
      if (isAnonymousEntityAccountId(result2) && result3 > 0) {
        await sleep(result3 * 600);
      }
      fn8(arg1, "[" + local2 + "] 正在创建采集窗口…", "info");
      local3 = await fn32(result2, arg2.proxy, {
        platform: arg2.platform || "douyin",
        runtimeTaskId: arg1
      });
      if (!fn45(arg1, arg3)) {
        return {
          collected: 0,
          duplicates: 0
        };
      }
      {
        const result = local5();
        if (result) {
          if (!result.windowKeys) {
            result.windowKeys = new Set();
          }
          result.windowKeys.add(result2);
        }
      }
      fn8(arg1, "[" + local2 + "] 采集窗口已就绪", "info");
      const result4 = await fn30(local3, arg1, local2);
      if (result4?.ok === false) {
        throw new Error("无法准备稳定执行视口：" + (result4.reason || "unknown"));
      }
      await fn49(local3, arg1);
      if (!fn45(arg1, arg3)) {
        return {
          collected: 0,
          duplicates: 0
        };
      }
      const local6 = arg1 => {
        const value = Array.isArray(arg1?.users) ? arg1.users : [];
        const list = [];
        const set = new Set();
        for (const item of value) {
          const result = String(item?.videoUrl || item?.userUrl || item?.content || item?.userKey || "").trim();
          const local = extractDouyinVideoId(result) || (result.startsWith("video:") ? result.slice(6) : "");
          if (!local || set.has(local)) {
            continue;
          }
          set.add(local);
          const result2 = String(item?.title || item?.nickname || "").replace(/\s+/g, " ").trim();
          list.push({
            url: "https://www.douyin.com/video/" + local,
            title: result2 && result2 !== "抖音视频作品" && result2 !== "未知视频" ? result2 : ""
          });
        }
        return list;
      };
      const local7 = arg1 => local6(arg1).map(arg1 => arg1.url);
      const local8 = async (arg12, {
        label = "视频评论区",
        searchKeyword = "",
        videoTitleByUrl = null
      } = {}) => {
        const result = local5();
        if (!result) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const {
          config: config,
          tasksApi: tasksApi,
          taskName: taskName,
          knownKeys: knownKeys,
          progress: progress
        } = result;
        const value = Array.isArray(arg12) ? arg12.filter(Boolean) : [];
        const value2 = videoTitleByUrl instanceof Map ? videoTitleByUrl : new Map();
        const result3 = String(searchKeyword || "").trim();
        const local = !!result3 && result3 !== "喜欢列表" && result3 !== "推荐页";
        const num3 = 3;
        let obj = {
          success: true,
          users: []
        };
        let flag = false;
        const local4 = async (arg12, arg2, arg32) => {
          const result = buildEntitySearchModalUrl(arg12, result3);
          if (!result) {
            return {
              ok: false,
              targetUrl: toDouyinJingxuanUrl(arg12)
            };
          }
          fn8(arg1, arg32 === 1 ? "[" + local2 + "] " + label + "：搜索页打开视频 (" + (arg2 + 1) + "/" + value.length + ")" : "[" + local2 + "] " + label + "：重新在搜索页打开 (" + arg32 + "/" + num3 + ")", arg32 === 1 ? "info" : "warning");
          if (flag || arg32 === 1) {
            const result4 = await fn61(local3, "ENTITY_LEADGEN_OPEN_SEARCH_VIDEO", {
              taskId: arg1,
              accountId: result2,
              accountName: local2,
              generation: arg3,
              videoUrl: arg12,
              searchKeyword: result3,
              softOnly: true
            }, 35000);
            if (result4?.cancelled) {
              return {
                ok: false,
                cancelled: true,
                targetUrl: result
              };
            }
            if (result4?.ready || result4?.success) {
              flag = true;
              return {
                ok: true,
                targetUrl: result,
                openedUrl: result4.videoUrl || arg12
              };
            }
            if (result4?.navigating) {
              await sleep(2200);
              const result3 = await fn61(local3, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
                taskId: arg1,
                accountId: result2,
                generation: arg3,
                videoUrl: arg12
              }, 25000);
              if (result3?.ready || result3?.success) {
                flag = true;
                return {
                  ok: true,
                  targetUrl: result,
                  openedUrl: result3.videoUrl || arg12
                };
              }
            }
          }
          fn8(arg1, "[" + local2 + "] " + label + "：加载搜索详情弹层 (" + (arg2 + 1) + "/" + value.length + ")…", "info");
          if (flag === false && (arg2 > 0 || arg32 > 1)) {
            await fn46(local3);
          }
          try {
            await fn47(local3, result);
          } catch (error) {
            return {
              ok: false,
              targetUrl: result,
              error: error?.message || String(error)
            };
          }
          await sleep(1600);
          const result4 = await fn61(local3, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
            taskId: arg1,
            accountId: result2,
            generation: arg3,
            videoUrl: arg12
          }, 25000);
          if (result4?.ready || result4?.success) {
            flag = true;
            return {
              ok: true,
              targetUrl: result,
              openedUrl: result4.videoUrl || arg12
            };
          }
          return {
            ok: false,
            targetUrl: result
          };
        };
        const local6 = async arg12 => {
          fn8(arg1, "[" + local2 + "] " + label + "：弹层切到下一条 (" + (arg12 + 1) + "/" + value.length + ")", "info");
          const result = await fn61(local3, "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO", {
            taskId: arg1,
            accountId: result2,
            accountName: local2,
            generation: arg3
          }, 40000);
          if (result?.cancelled) {
            return {
              ok: false,
              cancelled: true
            };
          }
          if (result?.success || result?.continued) {
            return {
              ok: true,
              openedUrl: result.videoUrl || ""
            };
          }
          return {
            ok: false
          };
        };
        for (let num4 = 0; num4 < value.length; num4 += 1) {
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const value3 = value[num4];
          const local7 = value2.get(canonicalizeDouyinVideoUrl(value3)) || value2.get(String(value3 || "").trim()) || "";
          let obj2 = {
            success: false,
            users: []
          };
          let value4 = local ? buildEntitySearchModalUrl(value3, result3) || toDouyinJingxuanUrl(value3) : toDouyinJingxuanUrl(value3);
          let flag2 = false;
          for (let num = 1; num <= num3; num += 1) {
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            if (local) {
              if (num4 > 0 && num === 1 && flag) {
                const result = await local6(num4);
                if (result.cancelled) {
                  obj2 = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                if (result.ok) {
                  flag2 = true;
                  if (result.openedUrl) {
                    value4 = result.openedUrl;
                  }
                }
              }
              if (!flag2) {
                const result = await local4(value3, num4, num);
                if (result.cancelled) {
                  obj2 = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                value4 = result.targetUrl || value4;
                flag2 = !!result.ok;
                if (result.openedUrl) {
                  value4 = result.openedUrl;
                }
              }
              if (!flag2 && num >= num3) {
                fn8(arg1, "[" + local2 + "] " + label + "：搜索弹层未就绪，回退精选页打开 (" + (num4 + 1) + "/" + value.length + ")", "warning");
                value4 = toDouyinJingxuanUrl(value3);
                await fn46(local3);
                try {
                  await fn47(local3, value4);
                  flag2 = true;
                } catch (error) {
                  obj2 = {
                    success: false,
                    error: error?.message || String(error),
                    users: []
                  };
                  break;
                }
              }
              if (!flag2) {
                await sleep(600 + num * 300);
                continue;
              }
            } else {
              fn8(arg1, num === 1 ? "[" + local2 + "] " + label + "：打开视频 (" + (num4 + 1) + "/" + value.length + ")" : "[" + local2 + "] " + label + "：页面未进入视频，重新打开 (" + num + "/" + num3 + ")", num === 1 ? "info" : "warning");
              if (num4 > 0 || num > 1) {
                fn8(arg1, "[" + local2 + "] " + label + "：清理上一页后加载 (" + (num4 + 1) + "/" + value.length + ")", "info");
                await fn46(local3);
              }
              if (!fn45(arg1, arg3) || fn62(local5())) {
                break;
              }
              await fn53(local3, "comment", value4);
              try {
                fn8(arg1, "[" + local2 + "] " + label + "：正在加载视频页 (" + (num4 + 1) + "/" + value.length + ")…", "info");
                await fn47(local3, value4);
                flag2 = true;
              } catch (error) {
                fn8(arg1, "[" + local2 + "] " + label + "：打开视频失败 " + (error?.message || error), "warning");
                if (num < num3) {
                  await fn46(local3);
                  await sleep(800 + num * 400);
                  continue;
                }
                obj2 = {
                  success: false,
                  error: error?.message || String(error),
                  users: []
                };
                break;
              }
            }
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            const result = local5();
            if (!result) {
              break;
            }
            fn8(arg1, "[" + local2 + "] " + label + "：视频页已打开，开始采集评论区 (" + (num4 + 1) + "/" + value.length + ")", "info");
            await fn53(local3, "comment", value4);
            obj2 = await fn74(local3, {
              taskId: arg1,
              accountId: result2,
              accountName: local2,
              sourceType: "comment",
              searchKeyword: result3 || value4,
              maxCollect: config.maxCollect,
              collectedThisRun: result.progress.collectedThisRun,
              knownKeys: knownKeys,
              generation: arg3,
              commentFilters: fn75(config),
              targetVideoUrl: value4
            });
            if (obj2?.cancelled) {
              break;
            }
            if (obj2?.videoUnavailable) {
              fn8(arg1, "[" + local2 + "] " + label + "：视频失效，已跳过 (" + (num4 + 1) + "/" + value.length + ")" + (obj2?.unavailableReason ? "（" + obj2.unavailableReason + "）" : ""), "warning");
              flag = false;
              break;
            }
            if (obj2?.needReload || obj2?.videoNotReady) {
              flag2 = false;
              flag = false;
              if (num < num3) {
                await sleep(600 + num * 300);
                continue;
              }
              fn8(arg1, "[" + local2 + "] " + label + "：多次重进仍未进入视频，跳过 (" + (num4 + 1) + "/" + value.length + ")", "warning");
            }
            break;
          }
          obj = obj2;
          if (obj2?.cancelled || !fn45(arg1, arg3)) {
            break;
          }
          if (obj2?.videoUnavailable) {
            continue;
          }
          if (obj2?.needReload || obj2?.videoNotReady) {
            continue;
          }
          const local8 = canonicalizeDouyinVideoUrl(value4) || canonicalizeDouyinVideoUrl(value3);
          let local9 = local7;
          if (!local9) {
            try {
              local9 = await withTimeout(local3.webContents.executeJavaScript("\n                  (() => {\n                    try {\n                      const t = typeof getVideoTitle === 'function' ? String(getVideoTitle() || '').trim() : '';\n                      return t && t !== '未知视频' ? t : '';\n                    } catch (_) { return ''; }\n                  })()\n                ", true), EXEC_JS_TIMEOUT_MS, "entity_comment_title_timeout");
            } catch (error) {
              local9 = "";
            }
          }
          const result = (Array.isArray(obj2?.users) ? obj2.users : []).map(arg1 => ({
            ...arg1,
            videoUrl: canonicalizeDouyinVideoUrl(arg1.videoUrl) || local8 || "",
            title: String(arg1.title || arg1.sourceVideoTitle || local9 || "").trim(),
            sourceVideoTitle: String(arg1.sourceVideoTitle || arg1.title || local9 || "").trim()
          }));
          const obj3 = {
            ...obj2,
            users: result
          };
          const result4 = fn73(obj3, {
            account: arg2,
            taskId: arg1,
            taskName: taskName,
            tasksApi: tasksApi,
            knownKeys: knownKeys,
            sourceType: "comment",
            progress: progress,
            maxCollect: config.maxCollect,
            generation: arg3
          });
          num += result4.synced;
          num2 += result4.duplicates;
          fn8(arg1, "[" + local2 + "] " + label + " 视频 (" + (num4 + 1) + "/" + value.length + ") 完成：" + fn72(result4), entityIngestSummaryLevel(result4));
        }
        return obj;
      };
      const local9 = async ({
        label = "搜索视频评论区",
        searchKeyword = "",
        alsoIngestCards = false
      } = {}) => {
        const result = local5();
        if (!result) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const {
          config: config,
          tasksApi: tasksApi,
          taskName: taskName,
          knownKeys: knownKeys,
          progress: progress
        } = result;
        const result3 = String(searchKeyword || "").trim();
        const local = config || {};
        fn8(arg1, "[" + local2 + "] " + label + "：应用筛选后从第一条视频开始采集评论区", "info");
        const result4 = await fn61(local3, "ENTITY_LEADGEN_OPEN_FIRST_SEARCH_VIDEO", {
          taskId: arg1,
          accountId: result2,
          accountName: local2,
          generation: arg3,
          searchKeyword: result3,
          searchSort: local.searchSort,
          searchPublishTime: local.searchPublishTime,
          searchDuration: local.searchDuration,
          searchScope: local.searchScope,
          searchFormat: local.searchFormat
        }, 60000);
        if (result4?.cancelled) {
          return {
            success: false,
            cancelled: true,
            users: []
          };
        }
        let local4 = result4;
        if (local4?.navigating) {
          fn8(arg1, "[" + local2 + "] " + label + "：等待搜索详情弹层加载…", "info");
          await sleep(2000);
          local4 = await fn61(local3, "ENTITY_LEADGEN_WAIT_VIDEO_READY", {
            taskId: arg1,
            accountId: result2,
            generation: arg3,
            videoUrl: local4.videoUrl || ""
          }, 25000);
        }
        if (!local4?.ready && !local4?.success) {
          fn8(arg1, "[" + local2 + "] " + label + "：未能打开搜索结果第一条视频（" + (local4?.reason || local4?.error || "未知") + "）", "warning");
          return {
            success: false,
            users: [],
            error: local4?.error || local4?.reason || "open_first_failed"
          };
        }
        let result5 = String(local4.videoUrl || result4?.videoUrl || "").trim();
        let obj = {
          success: true,
          users: []
        };
        const result6 = Math.max(20, Math.min(500, Number(local.maxCollect) > 0 ? Number(local.maxCollect) : 200));
        let num3 = 0;
        for (let num4 = 0; num4 < result6; num4 += 1) {
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const result = local5();
          if (!result) {
            break;
          }
          fn8(arg1, "[" + local2 + "] " + label + "：采集第 " + (num4 + 1) + " 条视频评论区", "info");
          await fn53(local3, "comment", result5 || result3);
          let result4 = await fn74(local3, {
            taskId: arg1,
            accountId: result2,
            accountName: local2,
            sourceType: "comment",
            searchKeyword: result3,
            targetVideoUrl: result5,
            maxCollect: result.config.maxCollect,
            collectedThisRun: result.progress.collectedThisRun,
            knownKeys: result.knownKeys,
            generation: arg3,
            commentFilters: fn75(result.config)
          });
          if (result4?.cancelled) {
            return {
              success: false,
              cancelled: true,
              users: []
            };
          }
          obj = result4 || obj;
          if (alsoIngestCards && Array.isArray(result4?.videoUsers) && result4.videoUsers.length) {
            await local10({
              success: true,
              users: result4.videoUsers
            }, {
              label: label + "卡片",
              searchKeyword: result3,
              sourceType: "video_search",
              skipComments: true
            });
          }
          const result6 = String(result4?.videoTitle || "").trim();
          const local = canonicalizeDouyinVideoUrl(result5) || result5;
          const result7 = (Array.isArray(result4?.users) ? result4.users : []).map(arg1 => ({
            ...arg1,
            videoUrl: canonicalizeDouyinVideoUrl(arg1.videoUrl) || local || "",
            title: String(arg1.title || arg1.sourceVideoTitle || result6 || "").trim(),
            sourceVideoTitle: String(arg1.sourceVideoTitle || arg1.title || result6 || "").trim()
          }));
          const result8 = fn73({
            ...result4,
            users: result7
          }, {
            account: arg2,
            taskId: arg1,
            taskName: taskName,
            tasksApi: tasksApi,
            knownKeys: knownKeys,
            sourceType: "comment",
            progress: progress,
            maxCollect: config.maxCollect,
            generation: arg3
          });
          num += result8.synced;
          num2 += result8.duplicates;
          fn8(arg1, "[" + local2 + "] " + label + " 第 " + (num4 + 1) + " 条完成：" + fn72(result8), entityIngestSummaryLevel(result8));
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          let flag = false;
          let num5 = 0;
          while (fn45(arg1, arg3) && !fn62(local5())) {
            fn8(arg1, "[" + local2 + "] " + label + "：弹层切到下一条", "info");
            const result = await fn61(local3, "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO", {
              taskId: arg1,
              accountId: result2,
              accountName: local2,
              generation: arg3
            }, 40000);
            if (result?.cancelled) {
              return {
                success: false,
                cancelled: true,
                users: []
              };
            }
            const result3 = String(result?.videoUrl || "").trim();
            const result4 = extractDouyinVideoId(result5);
            const result6 = extractDouyinVideoId(result3);
            const local = !!result4 && !!result6 && result4 === result6 || result?.reason === "same_video";
            if (local) {
              num5 += 1;
              if (num5 >= 2) {
                fn8(arg1, "[" + local2 + "] " + label + "：连续两次切条仍是同一视频，结束本词", "info");
                break;
              }
              fn8(arg1, "[" + local2 + "] " + label + "：切条后仍是同一视频（" + num5 + "/2），再切一次以防卡顿误判", "info");
              continue;
            }
            if (result?.success || result?.continued) {
              num3 = 0;
              if (result.videoUrl) {
                result5 = String(result.videoUrl).trim();
              }
              flag = true;
              break;
            }
            num3 += 1;
            if (num3 >= 2) {
              fn8(arg1, "[" + local2 + "] " + label + "：无法继续切到下一条，结束本词", "info");
              break;
            }
            fn8(arg1, "[" + local2 + "] " + label + "：切条未成功，再试一次", "warning");
          }
          if (!flag) {
            break;
          }
        }
        return obj;
      };
      const local11 = async (arg12, arg22) => {
        const result = local5();
        if (!result || fn62(result)) {
          return {
            success: true,
            users: [],
            cancelled: !!result?.stopRequested,
            reachedLimit: true
          };
        }
        const {
          config: config,
          tasksApi: tasksApi,
          taskName: taskName,
          knownKeys: knownKeys,
          progress: progress
        } = result;
        let text = "搜索视频博主";
        if (arg22 === "user") {
          text = "搜索用户";
        }
        if (arg22 === "comment") {
          text = "视频评论区潜客";
        }
        if (arg22 === "video") {
          text = "视频作品链接";
        }
        const value = arg22 === "user" && (config.userFanCount !== "0" || config.userTypeFilter !== "0") ? "（粉丝" + ({
          0: "不限",
          1: "1000以下",
          2: "1000-1w",
          3: "1w-10w",
          4: "10w-100w",
          5: "100w以上"
        }[config.userFanCount] || "不限") + "·类型" + ({
          0: "不限",
          1: "普通用户",
          2: "企业认证",
          3: "个人认证"
        }[config.userTypeFilter] || "不限") + "）" : "";
        fn8(arg1, "[" + local2 + "] " + text + "：打开搜索页「" + arg12 + "」" + value, "info");
        await fn53(local3, arg22 === "comment" ? "video" : arg22, arg12);
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await fn47(local3, arg22 === "user" ? buildDouyinUserSearchUrl(arg12, {
          userFanCount: config.userFanCount,
          userTypeFilter: config.userTypeFilter
        }) : buildDouyinSearchUrl(arg12, local()));
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const result3 = local5();
        if (!result3) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        if (arg22 === "comment") {
          num3 += 1;
          return await local9({
            label: text + "「" + arg12 + "」",
            searchKeyword: arg12,
            alsoIngestCards: false
          });
        }
        const result4 = await fn74(local3, {
          taskId: arg1,
          accountId: result2,
          accountName: local2,
          sourceType: arg22,
          searchKeyword: arg12,
          maxCollect: config.maxCollect,
          collectedThisRun: result3.progress.collectedThisRun,
          knownKeys: knownKeys,
          generation: arg3,
          userFanCount: config.userFanCount,
          userTypeFilter: config.userTypeFilter
        });
        num3 += 1;
        const result5 = fn73(result4, {
          account: arg2,
          taskId: arg1,
          taskName: taskName,
          tasksApi: tasksApi,
          knownKeys: knownKeys,
          sourceType: arg22,
          progress: progress,
          maxCollect: config.maxCollect,
          generation: arg3
        });
        num += result5.synced;
        num2 += result5.duplicates;
        if (!result4.success && !result4.cancelled && !result5.received) {
          fn8(arg1, "[" + local2 + "] " + text + "「" + arg12 + "」失败：" + (result4.error || "未知错误"), "error");
        } else {
          fn8(arg1, "[" + local2 + "] " + text + "「" + arg12 + "」完成：" + fn72(result5) + (result4.cancelled ? "（提前结束，已入库已采数据）" : ""), entityIngestSummaryLevel(result5));
        }
        return result4;
      };
      const local12 = async arg12 => {
        const value = arg12 === "following" ? "following" : "mutual";
        const value2 = value === "following" ? "关注列表" : "相互关注";
        const result = local5();
        if (!result || !result.config.sourceTypes.includes(value)) {
          return null;
        }
        if (result.stopRequested || fn62(result)) {
          return null;
        }
        const {
          config: config,
          tasksApi: tasksApi,
          taskName: taskName,
          knownKeys: knownKeys,
          progress: progress
        } = result;
        fn8(arg1, "[" + local2 + "] " + value2 + "：打开当前账号主页", "info");
        await fn53(local3, value, "");
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await fn47(local3, DOUYIN_SELF_PROFILE_URL);
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const result3 = local5();
        if (!result3) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const result4 = await fn74(local3, {
          taskId: arg1,
          accountId: result2,
          accountName: local2,
          sourceType: value,
          searchKeyword: "",
          maxCollect: config.maxCollect,
          collectedThisRun: result3.progress.collectedThisRun,
          knownKeys: knownKeys,
          generation: arg3
        });
        const result5 = fn73(result4, {
          account: arg2,
          taskId: arg1,
          taskName: taskName,
          tasksApi: tasksApi,
          knownKeys: knownKeys,
          sourceType: value,
          progress: progress,
          maxCollect: config.maxCollect,
          generation: arg3
        });
        num += result5.synced;
        num2 += result5.duplicates;
        if (!result4.success && !result4.cancelled && !result5.received) {
          fn8(arg1, "[" + local2 + "] " + value2 + "失败：" + (result4.error || "未知错误"), "error");
        } else {
          fn8(arg1, "[" + local2 + "] " + value2 + "完成：" + fn72(result5) + (result4.cancelled ? "（提前结束，已入库已采数据）" : ""), entityIngestSummaryLevel(result5));
        }
        return result4;
      };
      const local13 = async () => local12("mutual");
      const local14 = async () => local12("following");
      const local15 = async () => {
        if (arg2.liveWorkerEnabled === false) {
          return null;
        }
        while (true) {
          const result = local5();
          if (!result || !result.config.sourceTypes.includes("live")) {
            return null;
          }
          if (result.stopRequested || fn62(result)) {
            return null;
          }
          const value = Array.isArray(result.config.liveUrls) ? result.config.liveUrls : [];
          if ((Number(result.nextLiveUrlIndex) || 0) >= value.length) {
            return null;
          }
          if (!(await fn66(arg1, arg3, result3))) {
            return null;
          }
          const result4 = fn64(local5());
          if (!result4) {
            return null;
          }
          const result5 = local5();
          if (!result5) {
            return null;
          }
          const {
            config: config,
            tasksApi: tasksApi,
            taskName: taskName,
            knownKeys: knownKeys,
            progress: progress
          } = result5;
          const result6 = await fn65(result4.rawUrl);
          if (!result6) {
            fn8(arg1, "[" + local2 + "] 直播间链接无效，已跳过：" + String(result4.rawUrl || "").slice(0, 80), "warning");
            continue;
          }
          fn8(arg1, "[" + local2 + "] 领取直播间 " + (result4.index + 1) + "/" + result4.total + "：正在打开 " + result6, "info");
          await fn53(local3, "live", "");
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          let local = null;
          try {
            await fn47(local3, result6);
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            const result = local5();
            if (!result) {
              break;
            }
            local = await fn74(local3, {
              taskId: arg1,
              accountId: result2,
              accountName: local2,
              sourceType: "live",
              searchKeyword: result6,
              maxCollect: config.maxCollect,
              collectedThisRun: result.progress.collectedThisRun,
              knownKeys: knownKeys,
              generation: arg3,
              liveEventTypes: config.liveEventTypes,
              liveDurationSeconds: config.liveDurationSeconds
            });
          } catch (error) {
            if (!local3 || local3.isDestroyed() || !fn45(arg1, arg3)) {
              throw error;
            }
            const result = String(error?.message || error || "未知错误").slice(0, 120);
            fn8(arg1, "[" + local2 + "] 直播间打开失败，已跳过：" + result6 + "（" + result + "）", "warning");
            fn9(arg1, tasksApi, {
              url: result6,
              reason: "live_unreachable",
              message: "直播间打开失败，已跳过（" + result + "）"
            });
            continue;
          }
          const result7 = fn73(local, {
            account: arg2,
            taskId: arg1,
            taskName: taskName,
            tasksApi: tasksApi,
            knownKeys: knownKeys,
            sourceType: "live",
            progress: progress,
            maxCollect: config.maxCollect,
            generation: arg3
          });
          num += result7.synced;
          num2 += result7.duplicates;
          if (local.ended) {
            const value = local.endReason === "live_private";
            fn8(arg1, "[" + local2 + "] " + (local.message || (value ? "直播间为私密或隐私设置，已跳过" : "直播间已经结束")) + "：" + result6, "warning");
            if (value) {
              fn9(arg1, tasksApi, {
                url: result6,
                reason: "live_private",
                message: String(local.message || "").replace(/^⏭\s*/, "").replace(/，已退出当前直播间监控$/, "") || "直播间为私密或隐私设置，已跳过"
              });
            }
            continue;
          }
          fn8(arg1, "[" + local2 + "] 直播间「" + result6 + "」采集完成：" + fn72(result7), entityIngestSummaryLevel(result7));
        }
      };
      const local10 = async (arg12, {
        label = "视频列表",
        searchKeyword = "",
        sourceType = "video",
        skipComments = false,
        maxCollectOverride = null,
        skipLocalFilter = false
      } = {}) => {
        const result = local5();
        if (!result || !arg12) {
          return arg12;
        }
        const local = fn14(result.config, "video") || fn14(result.config, "author");
        if (local && Array.isArray(arg12.users) && arg12.users.length) {
          const value = arg12.users;
          const local = String(sourceType || "") === "video_search" || String(result.config?.sourceTypes?.[0] || "") === "video_search";
          const local3 = value;
          const value2 = skipLocalFilter ? local3 : fn18(local3, result.config);
          if (!skipLocalFilter && value2.length < value.length) {
            fn8(arg1, "[" + local2 + "] " + label + "：本地过滤去掉 " + (value.length - value2.length) + "/" + value.length + " 条视频卡片", "info");
          }
          const result2 = getEntityEntryMeta(sourceType || "video");
          const result3 = fn16(value2, result.config).map(arg1 => {
            const value = local ? enrichVideoPublishTime(arg1) : arg1;
            return {
              ...value,
              sourceType: "video",
              identityType: "video",
              entrySource: arg1.entrySource || result2.entrySource,
              entryLabel: arg1.entryLabel || result2.entryLabel,
              searchKeyword: searchKeyword || arg1.searchKeyword || ""
            };
          });
          if (local && result3[0]) {
            fn8(arg1, "[" + local2 + "] 搜索视频发布时间 " + JSON.stringify(buildVideoPublishTimeLogJson(result3[0])), "info");
          }
          if (!result3.length) {
            fn8(arg1, "[" + local2 + "] " + label + "卡片入库：0 条（勾选=" + ((result.config.scrapeTargets || []).join("+") || "无") + "，过滤后无有效卡片）", "warning");
          }
          const obj = {
            ...arg12,
            users: result3
          };
          const value3 = maxCollectOverride != null ? Number(maxCollectOverride) || 0 : result.config.maxCollect;
          const value4 = result3.length ? fn73(obj, {
            account: arg2,
            taskId: arg1,
            taskName: result.taskName,
            tasksApi: result.tasksApi,
            knownKeys: result.knownKeys,
            sourceType: "video",
            progress: result.progress,
            maxCollect: value3,
            generation: arg3
          }) : {
            synced: 0,
            duplicates: 0,
            skipped: 0,
            truncated: 0,
            received: 0
          };
          num += value4.synced;
          num2 += value4.duplicates;
          const result4 = fn72(value4);
          const value5 = result3[0]?.collectedFields?.length ? "，字段 " + result3[0].collectedFields.join("+") : "";
          fn8(arg1, "[" + local2 + "] " + label + "卡片入库：" + result4 + value5 + (Number(value4.synced || 0) === 0 && Number(value4.duplicates || 0) > 0 ? "（已在库，已跳过）" : Number(value4.synced || 0) === 0 && Number(value4.duplicates || 0) === 0 && Number(value4.received || 0) === 0 ? "（本条未计入，可能被筛选规则过滤）" : ""), entityIngestSummaryLevel(value4));
        } else if (Array.isArray(arg12.users) && arg12.users.length) {
          fn8(arg1, "[" + local2 + "] " + label + "：未勾选视频链接/作者主页，跳过卡片入库（勾选=" + ((result.config.scrapeTargets || []).join("+") || "无") + "）", "info");
        }
        if (!skipComments && fn14(result.config, "comments")) {
          const result = local6(arg12);
          if (!result.length) {
            fn8(arg1, "[" + local2 + "] " + label + "：未找到可打开的视频（评论区跳过）", "warning");
            return arg12;
          }
          const map = new Map();
          result.forEach(arg1 => {
            const local = canonicalizeDouyinVideoUrl(arg1.url) || arg1.url;
            if (local && arg1.title) {
              map.set(local, arg1.title);
            }
          });
          fn8(arg1, "[" + local2 + "] " + label + "：找到 " + result.length + " 个视频，开始采集评论区", "info");
          return await local8(result.map(arg1 => arg1.url), {
            label: label + "评论区",
            searchKeyword: searchKeyword,
            videoTitleByUrl: map
          });
        }
        return arg12;
      };
      const local16 = async () => {
        const result = local5();
        if (!result || result.stopRequested || fn62(result)) {
          return null;
        }
        const text = "https://www.douyin.com/user/self?showTab=like";
        fn8(arg1, "[" + local2 + "] 喜欢列表：打开点赞作品列表", "info");
        await fn53(local3, "video", "like");
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return null;
        }
        await fn47(local3, text);
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return null;
        }
        const result3 = local5();
        if (!result3) {
          return null;
        }
        const result4 = await fn74(local3, {
          taskId: arg1,
          accountId: result2,
          accountName: local2,
          sourceType: "video",
          searchKeyword: "喜欢列表",
          maxCollect: result3.config.maxCollect,
          collectedThisRun: result3.progress.collectedThisRun,
          knownKeys: result3.knownKeys,
          generation: arg3,
          skipIngest: false
        });
        return await local10(result4, {
          label: "喜欢列表",
          searchKeyword: "喜欢列表",
          sourceType: "video_like"
        });
      };
      const local17 = async () => {
        const result = local5();
        if (!result || result.stopRequested) {
          return null;
        }
        const text = "https://www.douyin.com/?recommend=1&from_nav=1";
        fn8(arg1, "[" + local2 + "] 推荐页：从当前第一条视频开始逐条识别", "info");
        const result3 = await fn30(local3, arg1, local2);
        if (result3?.ok === false) {
          throw new Error("推荐页执行视口未就绪：" + (result3.reason || "unknown"));
        }
        await fn53(local3, "video", "recommend");
        if (!fn45(arg1, arg3)) {
          return null;
        }
        await fn47(local3, text);
        if (!fn45(arg1, arg3)) {
          return null;
        }
        fn8(arg1, "[" + local2 + "] 推荐页：页面刚打开，额外等待约 10 秒让首屏稳定…", "info");
        await sleep(10000);
        if (!fn45(arg1, arg3)) {
          return null;
        }
        const result4 = local5();
        if (!result4) {
          return null;
        }
        const local = fn14(result4.config, "video") || fn14(result4.config, "author");
        const result5 = fn14(result4.config, "author");
        const result6 = fn14(result4.config, "comments");
        fn8(arg1, "[" + local2 + "] 推荐页采集内容：" + ((result4.config.scrapeTargets || []).join("+") || "无") + ("（卡片=" + (local ? "是" : "否") + "，评论=" + (result6 ? "是" : "否") + "）"), "info");
        const set = new Set();
        let num3 = 0;
        let num4 = 0;
        let num5 = 0;
        let num6 = 0;
        let num7 = 0;
        let num8 = 0;
        let num9 = 0;
        let local4 = null;
        let text2 = "";
        const value = Number(result4.config.maxCollect) > 0 ? Number(result4.config.maxCollect) : 100;
        const result7 = Math.max(30, Math.min(2000, value * 4));
        const local6 = () => num4 >= value;
        const local7 = () => {
          const result = local5();
          if (!result || result.limitReached) {
            return;
          }
          result.limitReached = true;
          result.limitKind = "link_count";
        };
        const local8 = async arg12 => {
          if (num8 >= 3 || !fn45(arg1, arg3)) {
            return false;
          }
          num8 += 1;
          local4 = null;
          fn8(arg1, "[" + local2 + "] 推荐页：" + arg12 + "，正在重新进入推荐流恢复画面（" + num8 + "/3）", "warning");
          try {
            fn2(local3);
            await fn53(local3, "video", "recommend_recover_" + num8);
            await fn47(local3, text);
            num7 = 0;
            return fn45(arg1, arg3);
          } catch (error) {
            fn8(arg1, "[" + local2 + "] 推荐页：恢复失败 " + (error?.message || error), "warning");
            return false;
          }
        };
        const local9 = arg1 => {
          const local = arg1?.nextSnapshot;
          if (local && local.ready) {
            local4 = local;
            num7 = 0;
            return true;
          }
          return !!arg1?.success || !!arg1?.continued;
        };
        const local11 = async (arg12, arg2, arg32, {
          skipLive = false
        } = {}) => {
          const result = await fn61(local3, "ENTITY_LEADGEN_MOVE_NEXT_RECOMMEND_VIDEO", {
            taskId: arg1,
            accountId: result2,
            accountName: local2,
            generation: arg3,
            runningSource: "recommend",
            skipLive: skipLive,
            previousIdentity: arg12.identity || "",
            previousTitle: arg12.title || "",
            previousVideoId: arg2,
            previousVideoUrl: arg32 || arg12.videoUrl || "",
            previousAuthor: arg12.authorNickname || ""
          }, 40000);
          if (result?.cancelled) {
            return {
              cancelled: true
            };
          }
          if (!local9(result)) {
            num7 += 1;
            fn8(arg1, skipLive ? "[" + local2 + "] 推荐页：直播间跳过未生效（" + num7 + "/3）" : "[" + local2 + "] 推荐页：切换下一条未确认（" + num7 + "/3），将再核对当前画面", "warning");
            if (num7 >= 3) {
              const result = await local8(skipLive ? "连续无法跳过直播间" : "连续切换下一条未响应");
              if (!result) {
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
        while (num3 < result7 && fn45(arg1, arg3) && !local6()) {
          const result = local5();
          if (!result) {
            break;
          }
          let local8 = local4;
          local4 = null;
          if (!local8?.ready) {
            for (let num = 1; num <= 3; num += 1) {
              if (!fn45(arg1, arg3) || local6()) {
                break;
              }
              if (num === 2) {
                fn8(arg1, "[" + local2 + "] 推荐页：加载时间较长，重新进入推荐页后继续等待", "warning");
                fn2(local3);
                await fn53(local3, "video", "recommend_retry");
                await fn47(local3, text);
              } else if (num === 3) {
                fn8(arg1, "[" + local2 + "] 推荐页：页面仍在缓冲，延长等待当前第一条作品", "info");
                fn2(local3);
              }
              local8 = await fn61(local3, "ENTITY_LEADGEN_INSPECT_RECOMMEND_VIDEO", {
                taskId: arg1,
                accountId: result2,
                accountName: local2,
                generation: arg3,
                runningSource: "recommend",
                wantAuthor: result5,
                maxWaitMs: num3 === 0 && num === 1 ? 30000 : 20000,
                quietReady: num3 > 0
              }, num3 === 0 && num === 1 ? 45000 : 35000);
              if (local8?.cancelled || local8?.success && local8?.ready) {
                break;
              }
              if (num === 1) {
                fn8(arg1, "[" + local2 + "] 推荐页：当前作品加载较慢，将自动重试，不会按 0 条直接结束", "info");
              }
            }
          }
          if (local8?.cancelled) {
            break;
          }
          if (!local8?.success || !local8?.ready) {
            fn8(arg1, "[" + local2 + "] 推荐页：已等待并重试约 60 秒，当前视频仍未就绪，停止本轮采集", "warning");
            break;
          }
          num3 += 1;
          const result3 = String(local8.videoId || extractDouyinVideoId(local8.videoUrl) || "").trim();
          if (text2 && result3 && result3 !== text2) {
            num7 = 0;
          }
          if (local8.live) {
            num5 += 1;
            const result = await local11(local8, result3, local8.videoUrl || "", {
              skipLive: true
            });
            if (result.cancelled) {
              break;
            }
            continue;
          }
          const local9 = result3;
          const result4 = String(local8.videoUrl || (local9 ? "https://www.douyin.com/video/" + local9 : "")).trim();
          text2 = local9 || text2;
          if (!local9 || !result4) {
            num9 += 1;
            fn8(arg1, "[" + local2 + "] 推荐页：当前作品链接未识别，直接切换下一条", "warning");
          } else if (set.has(local9) || result.knownKeys?.has("video:" + local9)) {
            num6 += 1;
            if (!set.has(local9)) {
              set.add(local9);
            }
            fn8(arg1, "[" + local2 + "] 推荐页：当前作品已分析，跳过且不计入链接数", "info");
          } else {
            set.add(local9);
            num4 += 1;
            const local4 = Number(result.progress.collectedThisRun) || 0;
            const result3 = String(local8.title || "").replace(/\s+/g, " ").trim().slice(0, 40);
            fn8(arg1, "[" + local2 + "] 推荐页：识别第 " + num4 + "/" + value + " 条作品" + (result3 ? "「" + result3 + "」" : ""), "info");
            if (local) {
              try {
                let result = String(local8.authorNickname || "").trim().replace(/^@+/, "");
                let result2 = String(local8.authorUrl || "").trim();
                const value = /^\d{10,}$/.test(local9) ? local9 : extractDouyinVideoId(result4) || "";
                if (result5 && !/\/user\//i.test(result2)) {
                  try {
                    let result3 = await local18(result4 || value);
                    if (!result3?.userUrl) {
                      await sleep(900);
                      result3 = await local18(result4 || value);
                    }
                    result2 = String(result3?.userUrl || "").trim() || result2;
                    result = String(result3?.nickname || "").trim().replace(/^@+/, "") || result;
                  } catch (error) {
                    fn8(arg1, "[" + local2 + "] 推荐页：读取作者主页失败 " + (error?.message || error), "warning");
                  }
                  if (!/\/user\//i.test(result2) && value) {
                    try {
                      const local = local3?.__radarEntityNetworkCapture?.findVideoUser?.(value);
                      if (local?.authorProfileUrl && /\/user\//i.test(local.authorProfileUrl)) {
                        result2 = String(local.authorProfileUrl).trim();
                        result = String(local.authorNickname || "").trim().replace(/^@+/, "") || result;
                        fn8(arg1, "[" + local2 + "] 推荐页：已从网络包补齐作者主页", "info");
                      }
                    } catch (error) {}
                  }
                  if (!/\/user\//i.test(result2)) {
                    fn8(arg1, "[" + local2 + "] 推荐页：未识别到作者主页，主页本条未入库（视频链接仍会入库）", "warning");
                  }
                }
                if (!value) {
                  fn8(arg1, "[" + local2 + "] 推荐页：作品 ID 无效，跳过卡片入库（" + (local9 || result4) + "）", "warning");
                } else {
                  const value2 = "https://www.douyin.com/video/" + value;
                  await local10({
                    success: true,
                    users: [{
                      nickname: local8.title || "抖音视频作品",
                      title: local8.title || "抖音视频作品",
                      userUrl: value2,
                      videoUrl: value2,
                      userKey: "video:" + value,
                      content: value2,
                      sourceType: "video",
                      identityType: "video",
                      entrySource: "entity_video_recommend",
                      entryLabel: "线索采集：推荐页",
                      searchKeyword: "推荐页",
                      authorNickname: result,
                      authorProfileUrl: result2,
                      likeCount: Number(local8.likeCount) || 0,
                      commentCount: Number(local8.commentCount) || 0,
                      collectCount: Number(local8.collectCount) || 0,
                      shareCount: Number(local8.shareCount) || 0
                    }]
                  }, {
                    label: "推荐页第 " + num4 + " 条",
                    searchKeyword: "推荐页",
                    sourceType: "video_recommend",
                    skipComments: true,
                    maxCollectOverride: 0,
                    skipLocalFilter: true
                  });
                }
              } catch (error) {
                fn8(arg1, "[" + local2 + "] 推荐页：卡片入库异常 " + (error?.message || error), "error");
              }
            }
            if (result6) {
              const result = local5();
              if (!result) {
                break;
              }
              fn8(arg1, "[" + local2 + "] 推荐页：采集当前作品评论区", "info");
              const result3 = await fn74(local3, {
                taskId: arg1,
                accountId: result2,
                accountName: local2,
                sourceType: "comment",
                searchKeyword: result4,
                targetVideoUrl: result4,
                alreadyOnCurrentVideo: true,
                maxCollect: 0,
                collectedThisRun: result.progress.collectedThisRun,
                knownKeys: result.knownKeys,
                generation: arg3,
                skipIngest: false,
                commentFilters: fn75(result.config)
              });
              const result5 = local5();
              if (!result5) {
                break;
              }
              const result6 = fn73(result3, {
                account: arg2,
                taskId: arg1,
                taskName: result5.taskName,
                tasksApi: result5.tasksApi,
                knownKeys: result5.knownKeys,
                sourceType: "video_recommend",
                progress: result5.progress,
                maxCollect: 0,
                generation: arg3
              });
              num += result6.synced;
              num2 += result6.duplicates;
              fn8(arg1, "[" + local2 + "] 推荐页当前作品评论区：" + fn72(result6), entityIngestSummaryLevel(result6));
              if (result3?.cancelled && local5()?.stopRequested) {
                break;
              }
            }
            const local6 = Number(local5()?.progress?.collectedThisRun) || local4;
            num9 = local6 > local4 ? 0 : num9 + 1;
          }
          if (local6()) {
            local7();
            fn8(arg1, "[" + local2 + "] 推荐页：已达到采集链接数 " + value + "，结束本轮", "info");
            break;
          }
          if (num9 >= 20) {
            fn8(arg1, "[" + local2 + "] 推荐页：连续 20 条没有新增线索，结束本轮采集", "info");
            break;
          }
          const result7 = await local11(local8, local9, result4);
          if (result7.cancelled) {
            break;
          }
        }
        if (local6()) {
          local7();
        }
        fn8(arg1, "[" + local2 + "] 推荐页本轮完成：识别 " + num4 + "/" + value + " 条作品，跳过直播 " + num5 + "、已分析 " + num6, "success");
        return {
          success: true,
          users: [],
          processedVideos: num4,
          skippedLives: num5,
          skippedAnalyzed: num6
        };
      };
      const local18 = async (text = "", options = {}) => {
        const obj = {
          nickname: "",
          userUrl: "",
          secUid: "",
          title: "",
          publishTimeMs: 0,
          publishTimeText: ""
        };
        if (!local3 || local3.isDestroyed() || local3.webContents.isDestroyed()) {
          return obj;
        }
        const result = String(text || "").trim();
        const result2 = buildDouyinVideoPublishTimeScrapeExpression({
          rejectPublishTimeTexts: Array.isArray(options?.rejectPublishTimeTexts) ? options.rejectPublishTimeTexts : []
        });
        try {
          const result3 = await withTimeout(local3.webContents.executeJavaScript("\n              (() => {\n                try {\n                  const expected = " + JSON.stringify(result) + ";\n                  try {\n                    if (typeof ensureLeadgenScrapeApiHook === 'function') {\n                      ensureLeadgenScrapeApiHook({ force: true });\n                    }\n                  } catch (_) {}\n                  let fromApi = null;\n                  try {\n                    if (expected && typeof lookupLeadgenScrapeAweme === 'function') {\n                      fromApi = lookupLeadgenScrapeAweme(expected);\n                    }\n                  } catch (_) {}\n                  const filter = typeof resolveEntityVideoAuthorFilter === 'function'\n                    ? resolveEntityVideoAuthorFilter(document.body)\n                    : null;\n                  let title = '';\n                  try {\n                    if (typeof getVideoTitle === 'function') {\n                      const t = String(getVideoTitle() || '').trim();\n                      if (t && t !== '未知视频') title = t;\n                    }\n                  } catch (_) {}\n                  const apiUrl = String(fromApi?.authorUrl || '').trim();\n                  const filterUrl = String(filter?.userUrl || '').trim();\n                  const userUrl = apiUrl || filterUrl;\n                  const nickname = String(fromApi?.authorNickname || filter?.nickname || '')\n                    .trim()\n                    .replace(/^@+/, '');\n                  const secUid = String(filter?.secUid || '').trim()\n                    || (userUrl.match(/\\/user\\/([^/?#]+)/i)?.[1] || '');\n                  let publishTimeMs = Number(\n                    fromApi?.createTime || fromApi?.create_time || fromApi?.publishTime || 0,\n                  ) || 0;\n                  if (publishTimeMs > 0 && publishTimeMs < 1e12) publishTimeMs *= 1000;\n                  let publishTimeText = '';\n                  let publishTimeSource = publishTimeMs > 0 ? 'api' : '';\n                  // DOM：昵称旁 / create-time；相对时间优先；可压低上一条残留文案\n                  try {\n                    const pub = " + result2 + ";\n                    const domMs = Number(pub && pub.publishTimeMs) || 0;\n                    const domText = String((pub && pub.publishTimeText) || '').trim();\n                    const domSource = String((pub && pub.source) || '');\n                    if (domMs > 0 && domText && !/^(rejected_|stale_)/.test(domSource)) {\n                      publishTimeMs = domMs;\n                      publishTimeText = domText;\n                      publishTimeSource = domSource || 'dom';\n                    }\n                  } catch (_) { /* ignore */ }\n                  return {\n                    nickname,\n                    userUrl,\n                    secUid,\n                    title: String(fromApi?.title || title || '').trim(),\n                    fromApi: !!apiUrl,\n                    publishTimeMs,\n                    publishTimeText,\n                    publishTimeSource,\n                  };\n                } catch (e) {\n                  return {\n                    nickname: '',\n                    userUrl: '',\n                    secUid: '',\n                    title: '',\n                    publishTimeMs: 0,\n                    publishTimeText: '',\n                    error: String(e && e.message || e),\n                  };\n                }\n              })()\n            ", true), Math.max(EXEC_JS_TIMEOUT_MS, 8000), "entity_capture_author_timeout");
          if (!result3 || typeof result3 !== "object") {
            return obj;
          }
          const local = normalizeAwemeCreateTimeMs(result3.publishTimeMs || 0) || parseDouyinRelativePublishTimeMs(result3.publishTimeText || "");
          return {
            ...obj,
            ...result3,
            publishTimeMs: local,
            publishTimeText: String(result3.publishTimeText || "").trim()
          };
        } catch (error) {
          return obj;
        }
      };
      const local19 = async () => {
        const result3 = local5();
        if (!result3 || result3.stopRequested || fn62(result3)) {
          return null;
        }
        const local = result3.config || {};
        fn8(arg1, "[" + local2 + "] 正在解析指定博主主页…", "info");
        const result4 = await resolveBloggerProfileUrls(local.bloggerProfileUrls);
        if (!result4.length) {
          fn8(arg1, "[" + local2 + "] 指定博主：未找到有效主页链接", "warning");
          return null;
        }
        const result5 = normalizeBloggerWorkSelectMode(local.bloggerWorkSelectMode);
        const value = local.bloggerExcludePinned !== false;
        const value2 = result5 === "count" ? "前 " + normalizeBloggerWorkCount(local.bloggerWorkCount) + " 条" : normalizeBloggerPublishWithinDays(local.bloggerPublishWithinDays) + " 天内";
        fn8(arg1, "[" + local2 + "] 指定博主：" + result4.length + " 个主页，作品筛选=" + value2 + (value ? "（排除置顶）" : "（含置顶）"), "info");
        const result6 = fn14(local, "video");
        const result7 = fn14(local, "comments");
        fn8(arg1, "[" + local2 + "] 指定博主采集目标：视频链接=" + (result6 ? "是" : "否") + "，评论区=" + (result7 ? "是" : "否"), result7 || result6 ? "info" : "warning");
        if (!result6 && !result7) {
          fn8(arg1, "[" + local2 + "] 指定博主：未勾选视频链接/评论区，跳过", "warning");
          return null;
        }
        let obj = {
          success: true,
          users: []
        };
        for (let num3 = 0; num3 < result4.length; num3 += 1) {
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const value2 = result4[num3];
          const result3 = String(value2.secUid || "").trim();
          const value3 = result3 ? "@" + result3.slice(0, 12) + "…" : "主页 " + (num3 + 1);
          fn8(arg1, "[" + local2 + "] 指定博主 (" + (num3 + 1) + "/" + result4.length + ")：打开 " + value2.url, "info");
          let local4;
          try {
            if (num3 > 0) {
              await fn46(local3);
            }
            local4 = await captureBloggerProfileWorks(local3, {
              profileUrl: value2.url,
              secUid: result3,
              maxWorks: resolveCaptureMaxWorks(local),
              filterPinned: value,
              scrollRounds: resolveScrollRounds(local),
              withinDays: result5 === "days" ? normalizeBloggerPublishWithinDays(local.bloggerPublishWithinDays) : 0,
              loadUrl: fn47,
              isActive: () => fn45(arg1, arg3)
            });
          } catch (error) {
            fn8(arg1, "[" + local2 + "] 指定博主 " + value3 + "：主页打开失败 " + (error?.message || error), "warning");
            continue;
          }
          const result8 = String(local4.authorName || "").trim();
          let value4 = Array.isArray(local4.works) ? local4.works.slice() : [];
          const local6 = local4?.diagnostics || {};
          if (local6.pinFilterFallback) {
            fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：置顶过滤疑似误判（" + (local6.pinnedCount || 0) + "/" + (local6.beforePinFilter || 0) + "），已回退保留作品列表", "warning");
          }
          if (value) {
            const value = value4.length;
            value4 = value4.filter(arg1 => !arg1?.pinned);
            const value2 = value - value4.length;
            if (value2 > 0) {
              fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：已排除置顶 " + value2 + " 条", "info");
            }
          }
          if (!value4.length) {
            const list = [];
            if (local6.scrapeError) {
              list.push("错误 " + local6.scrapeError);
            }
            if (local6.cardsFound != null) {
              list.push("卡片候选 " + local6.cardsFound);
            }
            if (local6.hrefLinkCount != null) {
              list.push("视频链 " + local6.hrefLinkCount);
            }
            if (local6.beforePinFilter != null) {
              list.push("刮取 " + local6.beforePinFilter + "/置顶标记 " + (local6.pinnedCount || 0));
            }
            fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：DOM 未识别到作品" + (list.length ? "（" + list.join("，") + "）" : ""), "warning");
          }
          const value5 = value4.filter(arg1 => !normalizeAwemeCreateTimeMs(arg1.createTime || 0)).length;
          const local7 = value5 > 0 && (result5 === "days" || result6 || result7);
          const local8 = (local7 || result7) && value4.length > 0;
          const list = [];
          let flag = false;
          if (local8) {
            if (local7) {
              fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：" + value5 + " 条缺发布时间，打开作品识别" + (result7 ? "并采集评论…" : "…"), "info");
            } else {
              fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：打开作品采集评论…", "info");
            }
            const result4 = Math.min(value4.length, result5 === "count" ? normalizeBloggerWorkCount(local.bloggerWorkCount) : resolveCaptureMaxWorks(local));
            const value6 = result5 === "count" ? normalizeBloggerWorkCount(local.bloggerWorkCount) : 0;
            let flag2 = false;
            const list2 = [];
            for (let num3 = 0; num3 < result4; num3 += 1) {
              if (!fn45(arg1, arg3) || fn62(local5())) {
                break;
              }
              const value5 = value4[num3];
              if (!value5) {
                continue;
              }
              if (value && value5.pinned) {
                continue;
              }
              let local4 = value5.url || "";
              let flag3 = false;
              if (!flag2) {
                fn8(arg1, "[" + local2 + "] 指定博主：点击主页作品 (" + (num3 + 1) + "/" + value4.length + ")", "info");
                try {
                  const result = String(local3.webContents?.getURL?.() || "");
                  if (!/\/user\//i.test(result) || /[?&]modal_id=/i.test(result)) {
                    await fn47(local3, value2.url);
                    await sleep(1200);
                  }
                } catch (error) {}
                const result2 = await result.openAuthorWork(local3.webContents, {
                  taskId: arg1,
                  awemeId: value5.awemeId || extractDouyinVideoId(value5.url),
                  url: value5.url,
                  authorUrl: value2.url,
                  preferFirstCard: list.length === 0,
                  skipPinnedCards: value && list.length === 0,
                  knownHasWorks: true,
                  allowUrlFallback: false,
                  timeoutMs: 50000
                });
                if (result2?.cancelled) {
                  obj = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                flag3 = !!result2?.ok;
                if (result2?.videoUrl) {
                  local4 = result2.videoUrl;
                  value5.url = result2.videoUrl;
                }
                if (result2?.awemeId) {
                  value5.awemeId = result2.awemeId;
                }
                flag2 = flag3;
                if (!flag3) {
                  fn8(arg1, "[" + local2 + "] 指定博主：未能点击打开作品（" + (result2?.reason || result2?.error || "unknown") + "）" + (result2?.debug ? "｜" + result2.debug : ""), "warning");
                  if (list.length === 0) {
                    break;
                  }
                  continue;
                }
              } else {
                fn8(arg1, "[" + local2 + "] 指定博主：下一条 (" + (num3 + 1) + "/" + value4.length + ")", "info");
                const result2 = await result.moveNextAuthorWork(local3.webContents, {
                  taskId: arg1,
                  expectedAwemeId: value5.awemeId || extractDouyinVideoId(value5.url),
                  expectedUrl: value5.url,
                  requireMatch: false
                });
                if (result2?.cancelled) {
                  obj = {
                    success: false,
                    cancelled: true,
                    users: []
                  };
                  break;
                }
                flag3 = !!result2?.ok;
                if (result2?.videoUrl) {
                  local4 = result2.videoUrl;
                  value5.url = result2.videoUrl;
                }
                if (result2?.awemeId) {
                  value5.awemeId = result2.awemeId;
                }
                if (!flag3) {
                  fn8(arg1, "[" + local2 + "] 指定博主：下一条失败，回主页点卡继续", "warning");
                  flag2 = false;
                  try {
                    await fn47(local3, value2.url);
                    await sleep(900);
                  } catch (error) {}
                  num3 -= 1;
                  continue;
                }
              }
              fn8(arg1, "[" + local2 + "] 指定博主：等待发布时间控件刷新…", "info");
              const result4 = await fn44(local3, {
                seenTexts: list2,
                timeoutMs: 12000,
                taskId: arg1,
                generation: arg3
              });
              if (result4?.cancelled) {
                obj = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!result4?.refreshed) {
                fn8(arg1, "[" + local2 + "] 指定博主：作品 (" + (num3 + 1) + "/" + value4.length + ") 发布时间控件未刷新" + (result4?.text ? "（仍为 " + result4.text + "）" : "") + "，跳过本条", "warning");
                continue;
              }
              await fn41(local3);
              const result6 = String(result4.text || "").trim();
              const result9 = parseDouyinRelativePublishTimeMs(result6);
              const result10 = fn43(result6);
              if (result9 > 0 && result6) {
                value5.createTime = result9;
                value5.publishTimeText = result6;
                if (result10) {
                  list2.push(result10);
                }
                fn8(arg1, "[" + local2 + "] 指定博主：作品 (" + (num3 + 1) + "/" + value4.length + ") 识别发布时间: " + result6 + "（dom-video-create-time）", "info");
              } else {
                fn8(arg1, "[" + local2 + "] 指定博主：作品 (" + (num3 + 1) + "/" + value4.length + ") 未识别到可信发布时间" + (result5 === "days" ? "，跳过本条" : ""), "warning");
                if (result5 === "days") {
                  continue;
                }
              }
              const result11 = await local18(local4 || value5.url);
              const result12 = String(result11?.secUid || "").trim();
              if (result3 && result12 && result12 !== result3) {
                fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：切条后非本博主作品（已离开作品流），跳下一个博主", "warning");
                break;
              }
              const result13 = normalizeAwemeCreateTimeMs(value5.createTime || 0);
              if (result5 === "days" && (result13 > 0 || value5.publishTimeText)) {
                const flag = isBloggerWorkWithinPublishDays(value5, local.bloggerPublishWithinDays);
                if (!flag) {
                  const local3 = value5.publishTimeText || new Date(result13).toLocaleDateString("zh-CN");
                  const local4 = !!value5.pinned || looksLikeMissedPinnedPublishTime(result13, value5.publishTimeText || "", local.bloggerPublishWithinDays);
                  if (local4) {
                    value5.pinned = true;
                    fn8(arg1, "[" + local2 + "] 指定博主：作品 (" + (num3 + 1) + ") 为置顶作品且发布时间 (" + local3 + ") 超出设置范围，跳过并切下一条", "warning");
                    continue;
                  }
                  fn8(arg1, "[" + local2 + "] 指定博主：作品 (" + (num3 + 1) + ") 为非置顶作品且发布时间 (" + local3 + ") 超出 " + (normalizeBloggerPublishWithinDays(local.bloggerPublishWithinDays) + " 天内，停止本博主"), "info");
                  break;
                }
              }
              if (value5.pinned) {
                continue;
              }
              list.push(value5);
              if (result7) {
                const result = local5();
                if (!result) {
                  break;
                }
                fn8(arg1, "[" + local2 + "] 指定博主评论：打开评论区 (" + list.length + "/" + (value6 || list.length) + ")", "info");
                await fn53(local3, "comment", local4);
                const result3 = await fn74(local3, {
                  taskId: arg1,
                  accountId: result2,
                  accountName: local2,
                  sourceType: "comment",
                  searchKeyword: "指定博主",
                  maxCollect: result.config.maxCollect,
                  collectedThisRun: result.progress.collectedThisRun,
                  knownKeys: result.knownKeys,
                  generation: arg3,
                  commentFilters: fn75(result.config),
                  targetVideoUrl: local4,
                  alreadyOnCurrentVideo: true
                });
                flag = true;
                if (result3?.cancelled) {
                  obj = result3;
                  break;
                }
                if (result3?.videoUnavailable) {
                  fn8(arg1, "[" + local2 + "] 指定博主评论：视频失效，已跳过", "warning");
                } else if (result3?.needReload || result3?.videoNotReady) {
                  fn8(arg1, "[" + local2 + "] 指定博主评论：详情未就绪，跳过", "warning");
                  flag2 = false;
                } else {
                  const result2 = fn73(result3, {
                    account: arg2,
                    taskId: arg1,
                    taskName: result.taskName,
                    tasksApi: result.tasksApi,
                    knownKeys: result.knownKeys,
                    sourceType: "comment",
                    progress: result.progress,
                    maxCollect: result.config.maxCollect,
                    generation: arg3
                  });
                  num += result2.synced;
                  num2 += result2.duplicates;
                  fn8(arg1, "[" + local2 + "] 指定博主评论完成：" + fn72(result2), entityIngestSummaryLevel(result2));
                  obj = result3;
                }
              }
              if (value6 > 0 && list.length >= value6) {
                break;
              }
              if (fn62(local5())) {
                break;
              }
            }
            if (value) {
              value4 = value4.filter(arg1 => !arg1?.pinned);
            }
          }
          const value6 = local8 && (result5 === "days" || result7) ? selectWorksForBloggerConfig(list, local) : selectWorksForBloggerConfig(value4, local);
          fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：DOM 识别 " + value4.length + " 条，筛选后 " + value6.length + " 条" + (local7 ? "（已补时间 " + value4.filter(arg1 => normalizeAwemeCreateTimeMs(arg1.createTime || 0)).length + "）" : "") + (flag ? "（评论已同趟采集）" : ""), value6.length ? "info" : "warning");
          if (!value6.length) {
            continue;
          }
          if (result6) {
            const result = value6.map(arg1 => ({
              nickname: result8 || arg1.authorName || "未知作者",
              title: arg1.title || "博主作品",
              videoUrl: arg1.url,
              userUrl: arg1.url,
              userKey: arg1.awemeId ? "video:" + arg1.awemeId : arg1.url,
              identityType: "video",
              sourceType: "author_profile",
              searchKeyword: "指定博主",
              authorProfileUrl: value2.url,
              authorNickname: result8 || arg1.authorName || "",
              secUid: result3 || arg1.authorSecUid || "",
              createTime: normalizeAwemeCreateTimeMs(arg1.createTime || 0),
              publishTime: normalizeAwemeCreateTimeMs(arg1.createTime || 0),
              timeText: arg1.publishTimeText || ""
            }));
            await local10({
              success: true,
              users: result
            }, {
              label: "指定博主 " + (result8 || value3),
              searchKeyword: "指定博主",
              sourceType: "author_profile",
              skipComments: true
            });
          }
          if (!result7 || flag) {
            continue;
          }
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          let flag2 = false;
          let flag3 = false;
          for (let num3 = 0; num3 < value6.length; num3 += 1) {
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            const value4 = value6[num3];
            let local = value4.url || "";
            if (!flag3) {
              fn8(arg1, "[" + local2 + "] 指定博主评论：点击主页作品 (" + (num3 + 1) + "/" + value6.length + ")", "info");
              try {
                const result = String(local3.webContents?.getURL?.() || "");
                if (!/\/user\//i.test(result) || /[?&]modal_id=/i.test(result)) {
                  await fn47(local3, value2.url);
                  await sleep(1200);
                }
              } catch (error) {}
              const result2 = await result.openAuthorWork(local3.webContents, {
                taskId: arg1,
                awemeId: value4.awemeId || extractDouyinVideoId(value4.url),
                url: value4.url,
                authorUrl: value2.url,
                preferFirstCard: num3 === 0,
                skipPinnedCards: value && num3 === 0,
                knownHasWorks: true,
                allowUrlFallback: false,
                timeoutMs: 50000
              });
              if (result2?.cancelled) {
                obj = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!result2?.ok) {
                fn8(arg1, "[" + local2 + "] 指定博主评论：未能点击打开（" + (result2?.reason || result2?.error || "unknown") + "）", "warning");
                if (num3 === 0) {
                  break;
                }
                continue;
              }
              if (result2.videoUrl) {
                local = result2.videoUrl;
              }
              flag3 = true;
            } else {
              fn8(arg1, "[" + local2 + "] 指定博主评论：下一条 (" + (num3 + 1) + "/" + value6.length + ")", "info");
              const result2 = await result.moveNextAuthorWork(local3.webContents, {
                taskId: arg1,
                expectedAwemeId: value4.awemeId || extractDouyinVideoId(value4.url),
                expectedUrl: value4.url,
                requireMatch: false
              });
              if (result2?.cancelled) {
                obj = {
                  success: false,
                  cancelled: true,
                  users: []
                };
                break;
              }
              if (!result2?.ok) {
                flag3 = false;
                num3 -= 1;
                try {
                  await fn47(local3, value2.url);
                  await sleep(900);
                } catch (error) {}
                continue;
              }
              if (result2.videoUrl) {
                local = result2.videoUrl;
              }
            }
            const result4 = await local18(local || value4.url);
            const result5 = String(result4.secUid || "").trim();
            if (result3 && result5 && result5 !== result3) {
              fn8(arg1, "[" + local2 + "] 指定博主 " + (result8 || value3) + "：已离开本博主作品流，进入下一作者", "warning");
              flag2 = true;
              break;
            }
            const result6 = local5();
            if (!result6) {
              break;
            }
            await fn53(local3, "comment", local);
            const result7 = await fn74(local3, {
              taskId: arg1,
              accountId: result2,
              accountName: local2,
              sourceType: "comment",
              searchKeyword: "指定博主",
              maxCollect: result6.config.maxCollect,
              collectedThisRun: result6.progress.collectedThisRun,
              knownKeys: result6.knownKeys,
              generation: arg3,
              commentFilters: fn75(result6.config),
              targetVideoUrl: local,
              alreadyOnCurrentVideo: true
            });
            if (result7?.cancelled) {
              obj = result7;
              break;
            }
            if (result7?.videoUnavailable || result7?.needReload || result7?.videoNotReady) {
              fn8(arg1, "[" + local2 + "] 指定博主评论：详情未就绪或失效，跳过 (" + (num3 + 1) + "/" + value6.length + ")", "warning");
              flag3 = false;
              continue;
            }
            const result9 = fn73(result7, {
              account: arg2,
              taskId: arg1,
              taskName: result6.taskName,
              tasksApi: result6.tasksApi,
              knownKeys: result6.knownKeys,
              sourceType: "comment",
              progress: result6.progress,
              maxCollect: result6.config.maxCollect,
              generation: arg3
            });
            num += result9.synced;
            num2 += result9.duplicates;
            fn8(arg1, "[" + local2 + "] 指定博主评论 (" + (num3 + 1) + "/" + value6.length + ") 完成：" + fn72(result9), entityIngestSummaryLevel(result9));
            obj = result7;
          }
          if (flag2) {
            continue;
          }
        }
        return obj;
      };
      const local20 = async () => {
        const result = local5();
        if (!result || result.stopRequested || fn62(result)) {
          return null;
        }
        fn8(arg1, "[" + local2 + "] 正在解析指定视频链接…", "info");
        const result3 = fn5(result.config.specifiedUrls);
        if (!result3.length) {
          fn8(arg1, "[" + local2 + "] 指定视频：未找到有效链接", "warning");
          return null;
        }
        fn8(arg1, "[" + local2 + "] 指定视频：解析出 " + result3.length + " 个链接", "info");
        const result4 = fn14(result.config, "author");
        const result5 = fn14(result.config, "video");
        const result6 = fn14(result.config, "comments");
        const local = arg1 => {
          const local = extractDouyinVideoId(arg1) || "";
          return {
            nickname: "未知作者",
            title: "指定视频",
            videoUrl: arg1,
            userUrl: arg1,
            userKey: local ? "video:" + local : arg1,
            identityType: "video",
            sourceType: "video_specific",
            searchKeyword: "指定视频"
          };
        };
        if (result5 && !result4 && !result6) {
          const result = result3.map(local);
          return await local10({
            success: true,
            users: result
          }, {
            label: "指定视频",
            searchKeyword: "指定视频",
            sourceType: "video_specific",
            skipComments: true
          });
        }
        const {
          config: config,
          tasksApi: tasksApi,
          taskName: taskName,
          knownKeys: knownKeys,
          progress: progress
        } = result;
        let obj = {
          success: true,
          users: []
        };
        for (let num3 = 0; num3 < result3.length; num3 += 1) {
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const value = result3[num3];
          const result = toDouyinJingxuanUrl(value);
          const num4 = 3;
          let flag = false;
          let local4 = null;
          for (let num = 1; num <= num4; num += 1) {
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            fn8(arg1, num === 1 ? "[" + local2 + "] 指定视频：打开视频 (" + (num3 + 1) + "/" + result3.length + ")" : "[" + local2 + "] 指定视频：重新打开 (" + num + "/" + num4 + ")", num === 1 ? "info" : "warning");
            if (num3 > 0 || num > 1) {
              await fn46(local3);
            }
            if (!fn45(arg1, arg3) || fn62(local5())) {
              break;
            }
            await fn53(local3, result6 ? "comment" : "video", result);
            try {
              await fn47(local3, result);
            } catch (error) {
              fn8(arg1, "[" + local2 + "] 指定视频：打开失败 " + (error?.message || error), "warning");
              if (num < num4) {
                await fn46(local3);
                await sleep(800 + num * 400);
                continue;
              }
              break;
            }
            if (result6) {
              const result4 = local5();
              if (!result4) {
                break;
              }
              local4 = await fn74(local3, {
                taskId: arg1,
                accountId: result2,
                accountName: local2,
                sourceType: "comment",
                searchKeyword: "指定视频",
                maxCollect: config.maxCollect,
                collectedThisRun: result4.progress.collectedThisRun,
                knownKeys: knownKeys,
                generation: arg3,
                commentFilters: fn75(config),
                targetVideoUrl: result
              });
              if (local4?.cancelled) {
                obj = local4;
                break;
              }
              if (local4?.videoUnavailable) {
                fn8(arg1, "[" + local2 + "] 指定视频：视频失效，已跳过 (" + (num3 + 1) + "/" + result3.length + ")", "warning");
                flag = false;
                break;
              }
              if (local4?.needReload || local4?.videoNotReady) {
                if (num < num4) {
                  await sleep(600 + num * 300);
                  continue;
                }
                fn8(arg1, "[" + local2 + "] 指定视频：多次重进仍未进入视频，跳过 (" + (num3 + 1) + "/" + result3.length + ")", "warning");
                flag = false;
                break;
              }
              flag = true;
              break;
            }
            await sleep(1600 + num * 200);
            flag = true;
            break;
          }
          if (!flag || !fn45(arg1, arg3)) {
            if (local4?.cancelled) {
              break;
            }
            continue;
          }
          let result7 = await local18(value);
          if (result4 && !result7.userUrl) {
            await sleep(1200);
            result7 = await local18(value);
          }
          const obj2 = {
            ...local(value),
            authorProfileUrl: String(result7.userUrl || "").trim(),
            authorNickname: String(result7.nickname || "").trim().replace(/^@+/, ""),
            nickname: String(result7.nickname || "").trim().replace(/^@+/, "") || "未知作者",
            title: String(result7.title || "").trim() || "指定视频",
            secUid: String(result7.secUid || "").trim()
          };
          if (result5 || result4) {
            if (result4 && !obj2.authorProfileUrl) {
              fn8(arg1, "[" + local2 + "] 指定视频 (" + (num3 + 1) + "/" + result3.length + ")：未识别到作者主页，主页未入库", "warning");
            } else if (result4 && obj2.authorProfileUrl) {
              fn8(arg1, "[" + local2 + "] 指定视频 (" + (num3 + 1) + "/" + result3.length + ")：作者 @" + (obj2.authorNickname || "未知") + " " + obj2.authorProfileUrl, "info");
            }
            await local10({
              success: true,
              users: [obj2]
            }, {
              label: "指定视频 (" + (num3 + 1) + "/" + result3.length + ")",
              searchKeyword: "指定视频",
              sourceType: "video_specific",
              skipComments: true
            });
          }
          if (result6 && local4 && !local4.videoUnavailable && !local4.needReload) {
            const result = fn73(local4, {
              account: arg2,
              taskId: arg1,
              taskName: taskName,
              tasksApi: tasksApi,
              knownKeys: knownKeys,
              sourceType: "comment",
              progress: progress,
              maxCollect: config.maxCollect,
              generation: arg3
            });
            num += result.synced;
            num2 += result.duplicates;
            fn8(arg1, "[" + local2 + "] 指定视频评论区 (" + (num3 + 1) + "/" + result3.length + ") 完成：" + fn72(result), entityIngestSummaryLevel(result));
            obj = local4;
          }
        }
        return obj;
      };
      const local21 = async arg12 => {
        const result = local5();
        if (!result || fn62(result)) {
          return {
            success: true,
            users: [],
            cancelled: !!result?.stopRequested,
            reachedLimit: true
          };
        }
        const local4 = result.config || {};
        const list = [];
        if (String(local4.searchSort || "0") !== "0") {
          list.push(["综合排序", "最新发布", "最多点赞"][Number(local4.searchSort)] || "排序");
        }
        if (String(local4.searchPublishTime || "0") !== "0") {
          list.push(["", "一天内", "一周内", "半年内"][Number(local4.searchPublishTime)] || "发布时间");
        }
        if (String(local4.searchDuration || "0") !== "0") {
          list.push(["", "1分钟以下", "1-5分钟", "5分钟以上"][Number(local4.searchDuration)] || "时长");
        }
        if (String(local4.searchScope || "0") !== "0") {
          list.push(["", "关注的人", "最近看过", "还未看过"][Number(local4.searchScope)] || "范围");
        }
        if (String(local4.searchFormat || "0") !== "0") {
          list.push(["", "视频", "图文"][Number(local4.searchFormat)] || "形式");
        }
        fn8(arg1, "[" + local2 + "] 搜索视频：打开搜索页「" + arg12 + "」" + (list.length ? "（官方筛选：" + list.join(" · ") + "）" : ""), "info");
        const result3 = await fn30(local3, arg1, local2);
        if (result3?.ok === false) {
          throw new Error("搜索页执行视口未就绪：" + (result3.reason || "unknown"));
        }
        try {
          if (local3 && !local3.isDestroyed()) {
            local3.webContents.send("entity-leadgen-clear-scrape-aweme", {
              reason: "keyword:" + arg12
            });
            await sleep(80);
          }
        } catch (error) {}
        await fn53(local3, "video", arg12);
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        await fn47(local3, buildDouyinSearchUrl(arg12, local()));
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const result4 = local5();
        if (!result4) {
          return {
            success: true,
            users: [],
            cancelled: true
          };
        }
        const local6 = result4.config || {};
        const result5 = fn14(local6, "comments");
        const local7 = fn14(local6, "video") || fn14(local6, "author");
        if (result5 && !local7) {
          num3 += 1;
          return await local9({
            label: "搜索视频「" + arg12 + "」",
            searchKeyword: arg12,
            alsoIngestCards: false
          });
        }
        const result6 = await fn74(local3, {
          taskId: arg1,
          accountId: result2,
          accountName: local2,
          sourceType: "video",
          searchKeyword: arg12,
          maxCollect: result4.config.maxCollect,
          collectedThisRun: result4.progress.collectedThisRun,
          knownKeys: result4.knownKeys,
          generation: arg3,
          skipIngest: false,
          searchSort: local6.searchSort,
          searchPublishTime: local6.searchPublishTime,
          searchDuration: local6.searchDuration,
          searchScope: local6.searchScope,
          searchFormat: local6.searchFormat
        });
        num3 += 1;
        const result7 = await local10(result6, {
          label: "搜索视频「" + arg12 + "」",
          searchKeyword: arg12,
          sourceType: "video_search",
          skipComments: true
        });
        if (!result5) {
          return result7;
        }
        if (!fn45(arg1, arg3) || fn62(local5())) {
          return result7;
        }
        fn8(arg1, "[" + local2 + "] 搜索视频「" + arg12 + "」：列表采完，回顶从第一条开始采评论区", "info");
        return await local9({
          label: "搜索视频「" + arg12 + "」",
          searchKeyword: arg12,
          alsoIngestCards: false
        });
      };
      const local22 = (local5()?.config?.sourceTypes || [])[0] || "video_search";
      if (local22 === "user") {
        while (true) {
          const result = local5();
          if (!result) {
            break;
          }
          const result2 = fn63(result);
          if (!result2) {
            break;
          }
          fn8(arg1, "[" + local2 + "] 领取关键词「" + result2.keyword + "」（" + (result2.index + 1) + "/" + result.config.keywords.length + "）", "info");
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const result3 = await local11(result2.keyword, "user");
          if (result3?.cancelled && local5()?.stopRequested) {
            break;
          }
          if (fn62(local5())) {
            break;
          }
        }
      } else if (local22 === "video_search") {
        while (true) {
          const result = local5();
          if (!result) {
            break;
          }
          const result2 = fn63(result);
          if (!result2) {
            break;
          }
          fn8(arg1, "[" + local2 + "] 领取关键词「" + result2.keyword + "」（" + (result2.index + 1) + "/" + result.config.keywords.length + "）", "info");
          if (!fn45(arg1, arg3) || fn62(local5())) {
            break;
          }
          const result3 = await local21(result2.keyword);
          if (result3?.cancelled && local5()?.stopRequested) {
            break;
          }
          if (fn62(local5())) {
            break;
          }
        }
      } else if (local22 === "mutual") {
        await local13();
      } else if (local22 === "following") {
        await local14();
      } else if (local22 === "video_like") {
        await local16();
      } else if (local22 === "video_recommend") {
        await local17();
      } else if (local22 === "video_specific") {
        await local20();
      } else if (local22 === "author_profile") {
        await local19();
      } else if (local22 === "live") {
        await local15();
      }
      if (num3 > 0) {
        const result = local5();
        if (result?.tasksApi) {
          result.tasksApi.incrementStats(arg1, {
            keywordsDone: num3,
            lastCycleAt: Date.now()
          });
        }
      }
      const local23 = local5()?.progress?.collectedThisRun ?? local4 + num;
      const result5 = Math.max(num, local23 - local4);
      fn8(arg1, "[" + local2 + "] 本账号结束：新入库 " + result5 + (num2 > 0 ? "，线索库已有跳过 " + num2 : ""), "success");
      return {
        collected: result5,
        duplicates: num2
      };
    } catch (error) {
      fn8(arg1, "[" + local2 + "] 异常：" + (error.message || error), "error");
      return {
        collected: num,
        duplicates: num2
      };
    } finally {
      if (local3 && !local3.isDestroyed()) {
        try {
          local3.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: arg1,
              accountId: result2,
              generation: arg3
            }
          });
        } catch (error) {}
      }
      fn31(local3);
    }
  }
  async function fn77(arg1) {
    const result = map.get(arg1);
    if (!result || result.running) {
      return;
    }
    result.running = true;
    const value = result.generation;
    const {
      config: config,
      accounts: accounts,
      tasksApi: tasksApi,
      taskName: taskName
    } = result;
    const result2 = fn27(config.sourceTypes[0]);
    const obj = {
      collectedThisRun: 0
    };
    result.knownKeys = result2;
    result.ingestedKeysThisRun = new Set();
    result.duplicateTrailKeys = new Set();
    result.progress = obj;
    result.nextKeywordIndex = 0;
    result.nextLiveUrlIndex = 0;
    result.windowKeys = new Set();
    const local = config.sourceTypes.length === 1 && config.sourceTypes[0] === "live";
    const result3 = (Array.isArray(accounts) ? accounts : []).filter(arg1 => {
      const result = String(arg1?.id || "").trim();
      return result && !isAnonymousEntityAccountId(result);
    });
    let local2 = result3;
    if (local) {
      const value2 = Array.isArray(config.liveUrls) ? config.liveUrls.length : 0;
      if (result3.length > 0) {
        const result = await fn68(arg1, value, Math.min(value2, result3.length), config.liveConcurrency);
        local2 = result3.map((arg1, arg2) => ({
          ...arg1,
          liveWorkerIndex: arg2,
          liveWorkerEnabled: arg2 < result
        }));
        fn8(arg1, "直播间将由 " + Math.min(result, result3.length) + " 个账号窗口共享领取（并发上限 " + normalizeLiveConcurrency(config.liveConcurrency) + "）" + ("" + (map.get(arg1)?.liveConcurrencyDetails?.reason ? "；本机自适应：" + map.get(arg1).liveConcurrencyDetails.reason : "")), result < normalizeLiveConcurrency(config.liveConcurrency) ? "warning" : "info");
      } else {
        const result = await fn68(arg1, value, value2, config.liveConcurrency);
        local2 = Array.from({
          length: result
        }, (arg12, arg2) => ({
          id: "anonymous:" + arg1 + ":" + arg2,
          platform: "douyin",
          name: "无账号采集 " + (arg2 + 1),
          nickname: "无账号采集 " + (arg2 + 1),
          liveWorkerIndex: arg2
        }));
        if (result > 0) {
          const local = map.get(arg1)?.liveConcurrencyDetails;
          const value = local?.reason ? "；本机自适应：" + local.reason : "";
          fn8(arg1, "无账号直播间队列已启动：" + value2 + " 个直播间，并发上限 " + normalizeLiveConcurrency(config.liveConcurrency) + "，实际启动 " + result + " 个" + value, result < normalizeLiveConcurrency(config.liveConcurrency) ? "warning" : "success");
        }
      }
    }
    if (!local2.length) {
      fn8(arg1, local ? "直播采集任务已取消启动" : "未选择执行账号，已取消启动（游客仅可跑直播间）", "error");
      result.running = false;
      map.delete(arg1);
      releaseTaskRuntimeGuard(local3(arg1));
      return;
    }
    const local4 = config.sourceTypes[0] || "video_search";
    const value2 = Array.isArray(config.scrapeTargets) ? config.scrapeTargets.join("+") : "";
    let text = "";
    if (fn14(config, "comments")) {
      try {
        const {
          formatEntityCommentFiltersSummary: formatEntityCommentFiltersSummary
        } = require("../shared/entityCommentFilters");
        const result = formatEntityCommentFiltersSummary(config);
        if (result && result !== "不限") {
          text = "；评论筛选 " + result;
        }
      } catch (error) {}
    }
    const value3 = local4 === "video_specific" ? "指定视频 " + fn5(config.specifiedUrls).length + " 个" : local4 === "video_recommend" ? "采集链接数 " + (config.maxCollect || 100) : local4 === "live" ? "直播间 " + config.liveUrls.length + " 个" : "关键词 " + (config.keywords.length || 0) + " 个";
    const value4 = local4 === "video_specific" ? "无上限" : local4 === "video_recommend" ? "采集链接数 " + (config.maxCollect || 100) : "上限 " + (config.maxCollect || "不限");
    const value5 = isEntityRelationAuthorSource(local4) ? "采集主页" : "线索库";
    fn8(arg1, "线索采集已启动：来源 " + local4 + (value2 ? "（" + value2 + "）" : "") + "，" + value3 + "，" + value4 + "，账号 " + (local && !result3.length ? "无账号游客" : local2.map(arg1 => arg1.nickname || arg1.name || arg1.id).join("、")) + "；" + value5 + "已有 " + result2.size + " 个用户将自动跳过" + text, "success");
    try {
      await Promise.all(local2.map(arg12 => fn76(arg1, arg12, value)));
      const result = map.get(arg1);
      if (!result || result.generation !== value) {
        return;
      }
      const result2 = Date.now();
      const value2 = result.stopRequested ? "manual_stop" : fn62(result) ? "limit_reached" : "completed";
      const value3 = result.stopRequested ? "stopped" : "completed";
      if (value2 === "limit_reached") {
        const local = result.limitKind || (local4 === "video_recommend" ? "link_count" : "max_collect");
        fn8(arg1, local === "link_count" ? "已达到采集链接数 " + config.maxCollect + "，结束任务" : "已达到最大采集数 " + config.maxCollect + "，结束任务", "info");
      }
      const result3 = (tasksApi.findTaskById(arg1)?.runs || []).map(arg1 => ({
        ...arg1,
        endedAt: arg1.endedAt || result2,
        endReason: arg1.endReason || value2
      }));
      tasksApi.patchTask(arg1, {
        status: value3,
        endedAt: result2,
        endReason: value2,
        runs: result3
      });
      fn8(arg1, value3 === "completed" ? "线索采集任务已完成" : "线索采集任务已停止", value3 === "completed" ? "success" : "info");
      fn7(arg1, {
        type: "finished",
        status: value3,
        endReason: value2,
        ts: result2
      });
    } catch (error) {
      const result = map.get(arg1);
      if (!result || result.generation !== value) {
        return;
      }
      const result2 = Date.now();
      tasksApi.patchTask(arg1, {
        status: "stopped",
        endedAt: result2,
        endReason: "error"
      });
      fn8(arg1, "任务异常结束：" + (error.message || error), "error");
      fn7(arg1, {
        type: "finished",
        status: "stopped",
        endReason: "error",
        ts: result2
      });
    } finally {
      const result = map.get(arg1);
      if (result && result.generation === value) {
        const value = result.windowKeys && result.windowKeys.size ? [...result.windowKeys] : fn50(result.accounts || []);
        map.delete(arg1);
        releaseTaskRuntimeGuard(local3(arg1));
        fn52(value);
      } else {
        releaseTaskRuntimeGuard(local3(arg1));
      }
    }
  }
  function fn78(arg1, arg2, arg3) {
    const value = arg1.id;
    const result = fn13(arg1.configSnapshot || {});
    if (fn79(result) && fn80(value)) {
      return {
        ok: false,
        error: "已有直播间采集任务在运行，请先停止后再启动"
      };
    }
    const list = [];
    const value2 = Array.isArray(arg2) ? arg2 : [];
    for (const item of value2) {
      const result = String(item?.id || "").trim();
      if (!result || isAnonymousEntityAccountId(result)) {
        continue;
      }
      if (typeof isCommentLeadgenAccountBusy === "function" && isCommentLeadgenAccountBusy(result)) {
        list.push(result);
      } else if (typeof isVideoMonitorAccountBusy === "function" && isVideoMonitorAccountBusy(result)) {
        list.push(result);
      }
    }
    if (list.length) {
      return {
        ok: false,
        error: "账号正在评论获客或监控任务中，请先停止后再启动线索采集（" + list.join("、") + "）",
        conflictAccountIds: list
      };
    }
    const result2 = map.get(value);
    const value3 = (result2?.generation || 0) + 1;
    if (result2) {
      result2.stopRequested = true;
      fn59(value, "任务已重启");
      const result = fn50(result2.accounts || []);
      for (const item of result) {
        const result = map4.get(String(item));
        if (!result || result.isDestroyed()) {
          continue;
        }
        try {
          result.webContents.send("control-task", {
            type: "ENTITY_LEADGEN_CANCEL",
            payload: {
              taskId: value,
              accountId: item,
              generation: result2.generation
            }
          });
        } catch (error) {}
      }
    }
    const result3 = fn50(arg2 || []);
    const result4 = result3.filter(arg1 => isAnonymousEntityAccountId(arg1));
    if (result4.length) {
      fn51(result4);
    }
    map.set(value, {
      config: result,
      accounts: Array.isArray(arg2) ? arg2 : [],
      tasksApi: arg3,
      taskName: arg1.name || "线索采集",
      running: false,
      stopRequested: false,
      generation: value3,
      nextKeywordIndex: 0,
      nextLiveUrlIndex: 0,
      liveWorkerCount: 0,
      windowKeys: new Set()
    });
    acquireTaskRuntimeGuard(local3(value), {
      type: "entity-leadgen",
      taskId: value
    });
    setTimeout(() => {
      fn77(value);
    }, 300);
    return {
      ok: true
    };
  }
  function fn81(options = {}) {
    try {
      result.handleNavResult(options || {});
    } catch (error) {}
  }
  function fn82(arg1) {
    const result2 = map.get(arg1);
    if (!result2) {
      fn59(arg1, "任务已停止");
      try {
        result.cancelPendingForTask(arg1);
      } catch (error) {}
      return false;
    }
    const value = result2.generation;
    const flag = !!result2.running;
    result2.stopRequested = true;
    fn59(arg1, "任务已停止");
    try {
      result.cancelPendingForTask(arg1);
    } catch (error) {}
    const value2 = result2.windowKeys && result2.windowKeys.size ? [...result2.windowKeys] : fn50(result2.accounts || []);
    for (const item of value2) {
      const result = map4.get(String(item));
      if (!result || result.isDestroyed()) {
        continue;
      }
      try {
        result.webContents.send("control-task", {
          type: "ENTITY_LEADGEN_CANCEL",
          payload: {
            taskId: arg1,
            accountId: item,
            generation: value
          }
        });
      } catch (error) {}
    }
    fn52(value2);
    map.delete(arg1);
    releaseTaskRuntimeGuard(local3(arg1));
    fn8(arg1, flag ? "线索采集任务已停止（账号占用已释放）" : "线索采集任务已停止", "info");
    fn7(arg1, {
      type: "finished",
      status: "stopped",
      endReason: "manual_stop",
      ts: Date.now()
    });
    return true;
  }
  function fn83(arg1) {
    const result = map.get(arg1);
    return !!result && !result.stopRequested;
  }
  function fn84() {
    return [...map.entries()].filter(([, arg1]) => arg1 && !arg1.stopRequested).map(([arg1]) => arg1);
  }
  function fn85() {
    let num = 0;
    for (const item of map.values()) {
      if (item?.stopRequested) {
        continue;
      }
      const value = Array.isArray(item.accounts) ? item.accounts : [];
      num += value.filter(arg1 => {
        const result = String(arg1?.id || "").trim();
        return result && !isAnonymousEntityAccountId(result);
      }).length;
    }
    return num;
  }
  function fn86() {
    const list = [];
    for (const item of map.values()) {
      if (item?.stopRequested) {
        continue;
      }
      const value = Array.isArray(item.accounts) ? item.accounts : [];
      value.forEach(arg1 => {
        const result = String(arg1?.id || "").trim();
        if (result && !isAnonymousEntityAccountId(result)) {
          list.push(result);
        }
      });
    }
    return list;
  }
  function fn79(options = {}) {
    const value = Array.isArray(options?.sourceTypes) ? options.sourceTypes : [];
    return value.map(String).includes("live");
  }
  function fn80(arg1 = null) {
    for (const [local, local2] of map.entries()) {
      if (arg1 && String(local) === String(arg1)) {
        continue;
      }
      if (fn79(local2?.config)) {
        return true;
      }
    }
    return false;
  }
  function fn87() {
    const list = [];
    for (const [local, local2] of map.entries()) {
      if (fn79(local2?.config)) {
        list.push(local);
      }
    }
    return list;
  }
  function fn88() {
    [...map.keys()].forEach(arg1 => fn82(arg1));
  }
  function fn89() {
    return [...map4.values()].filter(arg1 => arg1 && !arg1.isDestroyed()).map(arg1 => arg1.webContents).filter(arg1 => arg1 && !arg1.isDestroyed?.());
  }
  return {
    startTask: fn78,
    stopTask: fn82,
    stopAll: fn88,
    isTaskRunning: fn83,
    listRunningTaskIds: fn84,
    countRunningAccounts: fn85,
    listBusyAccountIds: fn86,
    hasRunningLiveTask: fn80,
    listRunningLiveTaskIds: fn87,
    listWebContents: fn89,
    getTaskLogs: fn10,
    clearTaskLogs: fn11,
    handleCollectProgress: fn69,
    handleCollectResult: fn71,
    handleAuthorNavResult: fn81,
    showMonitorWindow: fn35,
    hideMonitorWindow: fn36,
    consumePendingLivePreview: fn37
  };
}
module.exports = {
  createEntityLeadgenRunner: createEntityLeadgenRunner
};
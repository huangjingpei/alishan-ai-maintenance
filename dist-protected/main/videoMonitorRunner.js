const path = require("path");
const os = require("os");
const {
  BrowserWindow
} = require("electron");
const {
  acquireTaskRuntimeGuard,
  releaseTaskRuntimeGuard
} = require("./taskRuntimeGuard");
const {
  MONITOR_MAX_COMMENTS,
  resolveMonitorCommentWindowMinutes,
  parseCommentAgeMinutes,
  formatCommentAgeLabel
} = require("./monitorCommentTime");
const {
  buildMonitorSkipContext,
  shouldSkipMonitorComment,
  matchExcludeCommentKeyword,
  markUserReplied,
  formatExcludeCommentersForLog,
  formatOperatorAccountsForLog,
  normalizeMonitorNickname,
  buildMonitorUserDedupKey,
  isKnownMonitorUser,
  rememberMonitorUser
} = require("./monitorCommentFilter");
const {
  claimGlobalMonitorUser,
  rememberGlobalMonitorUser
} = require("./monitorGlobalUserDedup");
const {
  ensureHiddenWindowStaysHidden,
  primeHiddenWindowForInteraction
} = require("./hiddenWindowGuards");
const {
  createMonitorAutomationViewHostFactory
} = require("./monitorAutomationViewHost");
const {
  createMonitorLivePreviewController
} = require("./monitorLivePreview");
const {
  createMonitorProfileSubviewRunner
} = require("./monitorProfileSubview");
const {
  createMonitorAuthorPostCapture
} = require("./monitorAuthorPostCapture");
const {
  createMonitorAuthorWorkNav
} = require("./monitorAuthorWorkNav");
const {
  resolveDouyinShareUrls,
  toCanonicalDouyinVideoUrl
} = require("../shared/resolveDouyinShareUrl");
const {
  isDouyinAuthorProfileUrl,
  normalizeDouyinAuthorUrl,
  getDouyinAuthorProfileKey,
  resolveDouyinAuthorIdentityKey,
  isSameDouyinAuthorIdentity,
  isDouyinSecUidIdentity,
  classifyDouyinAuthorIdentity
} = require("../shared/douyinAuthorUrl");
const {
  extractDouyinVideoId,
  normalizeProcessedVideoKey,
  buildDouyinCommentLocateUrl
} = require("../shared/processedVideoKey");
const leadUserKey = require("../shared/leadUserKey");
const leadTouch = require("../shared/leadTouch");
const {
  appendRandomEmojiSuffix
} = require("../shared/randomTextSuffix");
const {
  createAccountActionLimitStore,
  getAccountActionLimitStatus,
  recordAccountActionLimitSuccess,
  formatAccountActionLimitSummary
} = require("../shared/actionLimit");
const {
  normalizeActionCountResetTime,
  msUntilNextActionCountReset,
  getLatestActionCountResetBoundary
} = require("../shared/actionCountAutoReset");
const {
  normalizeGenderFilter,
  GENDER_FILTER_LABELS
} = require("../shared/genderFilter");
const {
  buildSignedDingtalkUrl,
  isHttpWebhookUrl
} = require("./chatMessageNotifications");
const {
  listAccountVideoMainCommentedIds,
  accountHasVideoMainCommented,
  hasMonitorVideoMainNonTextExtras,
  formatMonitorVideoMainCommentLogLabel,
  buildMonitorVideoMainCommentExtras
} = require("./monitorVideoMainComment");
const {
  metricsFromMatchRecords
} = require("./monitorTaskCycles");
const MONITOR_ACTION_LIMIT_SPECS = Object.freeze([{
  key: "like",
  label: "自动点赞",
  enabledField: "autoLikeLimitEnabled",
  minField: "autoLikeLimitMin",
  maxField: "autoLikeLimitMax"
}, {
  key: "reply",
  label: "自动回复",
  enabledField: "autoReplyLimitEnabled",
  minField: "autoReplyLimitMin",
  maxField: "autoReplyLimitMax"
}, {
  key: "follow",
  label: "自动关注",
  enabledField: "autoFollowLimitEnabled",
  minField: "autoFollowLimitMin",
  maxField: "autoFollowLimitMax"
}, {
  key: "dm",
  label: "自动私信",
  enabledField: "autoDmLimitEnabled",
  minField: "autoDmLimitMin",
  maxField: "autoDmLimitMax"
}]);
function resolveDouyinMonitorVideoUrl(arg1, arg2 = null) {
  const local = toCanonicalDouyinVideoUrl(arg1) || String(arg1 || "").trim();
  return buildDouyinCommentLocateUrl(local, arg2) || local;
}
function isMonitorVideoUrlInvalid(options = {}) {
  return !!options && !!options.invalid;
}
function formatMonitorInvalidReason(text = "") {
  const result = String(text || "").trim();
  if (!result) {
    return "链接失效或无法观看";
  }
  if (/user_not_found|USER_NOT_FOUND|用户不存在|无此用户|主页链接失效/i.test(result)) {
    return "用户不存在（主页链接失效）";
  }
  if (/bare_jingxuan/i.test(result)) {
    return "精选页无详情（打开超时/慢网，未永久失效）";
  }
  if (/unavailable/i.test(result)) {
    return "视频不存在或无法观看";
  }
  return result;
}
function isMonitorAuthorUrlInvalid(options = {}) {
  return !!options && !!options.invalid;
}
function monitorVideoItemsMatch(arg1, arg2) {
  const result = String(arg1?.url || "").trim();
  const result2 = String(arg2?.url || "").trim();
  if (result && result2 && result === result2) {
    return true;
  }
  const result3 = extractDouyinVideoId(result);
  const result4 = extractDouyinVideoId(result2);
  return !!result3 && !!result4 && result3 === result4;
}
function isSameMonitorVideo(arg1, arg2) {
  const result = extractDouyinVideoId(arg1);
  const result2 = extractDouyinVideoId(arg2);
  if (result && result2) {
    return result === result2;
  }
  return String(arg1 || "").trim() === String(arg2 || "").trim();
}
function resolveMonitorExpectedAuthor(options = {}) {
  if (String(options?.source || "") !== "author_latest") {
    return {
      url: "",
      secUid: ""
    };
  }
  const result = String(options.authorUrl || options.authorProfileUrl || "").trim();
  return {
    url: result,
    secUid: resolveDouyinAuthorIdentityKey(result)
  };
}
function isMonitorScrapeIdentityMismatch(options = {}) {
  return !!options?.videoMismatch || !!options?.authorMismatch || !!options?.authorUnconfirmed;
}
function resolveMonitorWebhookTarget(options = {}) {
  if (!options.enableWebhook) {
    return null;
  }
  const value = String(options.webhookType || "").trim().toLowerCase() === "dingtalk" ? "dingtalk" : "feishu";
  const value2 = value === "dingtalk" ? String(options.webhookUrlDingtalk || options.webhookUrl || "").trim() : String(options.webhookUrlFeishu || options.webhookUrl || "").trim();
  const value3 = value === "dingtalk" ? String(options.webhookSecretDingtalk || options.webhookSecret || "").trim() : "";
  if (!isHttpWebhookUrl(value2)) {
    return null;
  }
  return {
    type: value,
    url: value2,
    secret: value3
  };
}
function clipMonitorWebhookText(arg1, num = 120) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result) {
    return "";
  }
  if (result.length > num) {
    return result.slice(0, num) + "…";
  } else {
    return result;
  }
}
function buildMonitorMatchWebhookPayload(arg1, options = {}) {
  const local = options.title || "监控任务命中";
  const local2 = options.content || "";
  const local3 = options.time || new Date().toLocaleString();
  if (arg1 === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: local,
        text: "### " + local + "\n\n" + local2 + "\n\n> ⏰ " + local3
      }
    };
  }
  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: local
        },
        template: "orange"
      },
      elements: [{
        tag: "div",
        text: {
          tag: "lark_md",
          content: local2
        }
      }, {
        tag: "note",
        elements: [{
          tag: "plain_text",
          content: "⏰ " + local3
        }]
      }]
    }
  };
}
function isMonitorWebhookResponseSuccess(arg1, arg2) {
  if (!arg2 || arg2.status !== 200) {
    return false;
  }
  const value = arg2.data;
  if (value && value.errcode !== undefined && value.errcode !== 0) {
    return false;
  }
  if (arg1 === "feishu" && value && value.code !== undefined && value.code !== 0) {
    return false;
  }
  return true;
}
function createVideoMonitorRunner(arg1) {
  const {
    app: app,
    store: store,
    fs: fs,
    axios: axios,
    mainWindow: mainWindow,
    runtimeConfig = null,
    applyAccountProxy: applyAccountProxy,
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    analyzeMonitorCommentsBatch: analyzeMonitorCommentsBatch,
    generateMonitorPersonaContent: generateMonitorPersonaContent,
    matchKeywords: matchKeywords,
    isMonitorAccountAiEnabled: isMonitorAccountAiEnabled,
    isMonitorAiIntentJudgeEnabled: isMonitorAiIntentJudgeEnabled,
    pickRandomTemplateLine: pickRandomTemplateLine,
    appendHistory: appendHistory,
    listKnownLeadUserKeys: listKnownLeadUserKeys,
    getPlatformViews = null,
    getInteractionViewsMap = null,
    attachAutomationViewToBackgroundHost = null,
    ensureBackgroundAutomationHostWindow = null,
    removeAutomationViewFromBackgroundHost = null,
    restoreForegroundAutomationRendering = null,
    nudgeAutomationViewRepaint = null,
    safeSetTopBrowserView = null,
    getBoundsStateByViewKey = null,
    isValidAutomationBounds = null,
    requestAutomationLayoutRefresh = null,
    automationViewportSession = null,
    automationLiveViewLifecycle = null,
    destroyAutomationBrowserView = null,
    resolveAutomationPreloadPath: resolveAutomationPreloadPath = null,
    automationUserAgent = "",
    getViewSettingsMap = null,
    getMainWindow = null,
    isCommentLeadgenAccountBusy = null,
    isEntityLeadgenAccountBusy = null
  } = arg1;
  const local = () => {
    if (typeof getMainWindow === "function") {
      try {
        return getMainWindow();
      } catch (error) {}
    }
    return mainWindow;
  };
  async function fn(arg1) {
    if (!runtimeConfig || !arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(arg1);
    } catch (error) {
      console.warn("[Monitor] runtime config push failed:", error?.message || error);
    }
  }
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  const map4 = new Map();
  const map5 = new Map();
  const map6 = new Map();
  const map7 = new Map();
  const value = os.totalmem() / 1073741824;
  const value2 = os.cpus().length;
  let num = 2;
  if (value < 12) {
    num = 1;
  } else if (value < 24) {
    num = 2;
  } else if (value < 40) {
    num = 4;
  } else if (value < 56) {
    num = 6;
  } else {
    num = 10;
  }
  let num2 = 4;
  if (value2 <= 4) {
    num2 = 1;
  } else if (value2 <= 8) {
    num2 = 2;
  } else if (value2 <= 12) {
    num2 = 4;
  } else if (value2 <= 16) {
    num2 = 6;
  } else {
    num2 = 10;
  }
  const result = Math.max(1, Math.min(num, num2));
  let num3 = 1;
  let num4 = 10;
  let num5 = 3;
  let num6 = 550;
  let num7 = 3;
  if (result <= 1) {
    num3 = 1;
    num4 = 8;
    num5 = 2;
    num6 = 450;
    num7 = 3;
  } else if (result <= 2) {
    num3 = 1;
    num4 = 10;
    num5 = 3;
    num6 = 550;
    num7 = 3;
  } else if (result <= 4) {
    num3 = 2;
    num4 = 15;
    num5 = 6;
    num6 = 900;
    num7 = 2;
  } else if (result <= 6) {
    num3 = 3;
    num4 = 15;
    num5 = 8;
    num6 = 1000;
    num7 = 2;
  } else {
    num3 = 4;
    num4 = 15;
    num5 = 10;
    num6 = 1200;
    num7 = 2;
  }
  const num8 = 2;
  const num9 = 45000;
  const num10 = 600000;
  const num11 = 630000;
  const num12 = 8000;
  const num13 = 8000;
  const num14 = 90000;
  const num15 = 800;
  const num16 = 120000;
  const num17 = 30000;
  const num18 = 2500;
  const num19 = 15000;
  const num20 = 2;
  const num21 = 45000;
  const num22 = 1;
  const set = new Set(["monitor_scrape_timeout", "monitor_scrape_stalled", "monitor_scrape_page_timeout", "monitor_scrape_dispatch_failed", "monitor_renderer_unresponsive", "monitor_renderer_gone", "monitor_renderer_unhealthy", "monitor_window_closed"]);
  const num23 = 500;
  const num24 = 50;
  const num25 = 5000;
  const num26 = 1000;
  const num27 = 5000;
  let local2 = null;
  let num28 = 0;
  const list = [];
  const local3 = arg1 => "video-monitor:" + arg1;
  function fn2() {
    if (typeof resolveAutomationPreloadPath === "function") {
      try {
        const result = resolveAutomationPreloadPath();
        if (result) {
          return result;
        }
      } catch (error) {}
    }
    return path.join(__dirname, "..", "automation-preload.js");
  }
  const result2 = createMonitorAutomationViewHostFactory({
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => new Map(),
    getMainWindow: local,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    applyAccountProxy: applyAccountProxy,
    resolveAutomationPreloadPath: fn2,
    automationUserAgent: automationUserAgent,
    store: store,
    getViewSettingsMap: getViewSettingsMap,
    destroyAutomationBrowserView: destroyAutomationBrowserView
  });
  const result3 = createMonitorLivePreviewController({
    getMainWindow: local,
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => new Map(),
    getViewSettingsMap: getViewSettingsMap,
    getActiveTasks: () => map,
    getMonitorWindows: () => map6,
    automationLiveViewLifecycle: automationLiveViewLifecycle
  });
  const result4 = createMonitorAuthorWorkNav();
  const result5 = createMonitorProfileSubviewRunner({
    getInteractionViewsMap: typeof getInteractionViewsMap === "function" ? getInteractionViewsMap : () => new Map(),
    configureAutomationSession: configureAutomationSession,
    attachProtocolGuard: attachProtocolGuard,
    applyAccountProxy: applyAccountProxy,
    resolveAutomationPreloadPath: fn2,
    automationUserAgent: automationUserAgent,
    store: store,
    runtimeConfig: runtimeConfig,
    automationViewportSession: automationViewportSession
  });
  function fn3(options = {}) {
    const result = (options.accounts || []).map(arg1 => arg1?.id).filter(Boolean);
    if (result.length) {
      return result;
    }
    return (options.config?.selectedAccounts || []).filter(Boolean);
  }
  function fn4(options = {}) {
    return createAccountActionLimitStore(options.config || {}, MONITOR_ACTION_LIMIT_SPECS, fn3(options));
  }
  function fn5(arg1, arg2) {
    const result = String(arg2 || "").trim();
    if (!result) {
      return "";
    }
    const result2 = (arg1?.accounts || []).find(arg1 => String(arg1?.id) === result);
    const local = result2?.nickname || result2?.name || "";
    if (local) {
      return "账号 " + local + " ";
    } else {
      return "账号 " + result + " ";
    }
  }
  function fn6(arg1, arg2, arg3) {
    return getAccountActionLimitStatus(map.get(arg1)?.actionLimitState, arg3, arg2);
  }
  function fn7(arg1, arg2, arg3) {
    return fn6(arg1, arg2, arg3).allowed;
  }
  function fn8(options = {}) {
    return options.enableAutoLike === true || options.enableAutoReply === true || options.enableAutoFollow === true || options.enableAutoDM === true;
  }
  function fn9(arg1, options = {}, arg3) {
    const list = [[options.enableAutoLike === true, "like"], [options.enableAutoReply === true, "reply"], [options.enableAutoFollow === true, "follow"], [options.enableAutoDM === true, "dm"]];
    for (const [local, local2] of list) {
      if (!local) {
        continue;
      }
      if (fn7(arg1, local2, arg3)) {
        return true;
      }
    }
    return false;
  }
  function fn10(arg1, arg2, arg3) {
    const result = fn6(arg1, arg2, arg3);
    if (!result?.enabled || !!result.allowed) {
      return "";
    }
    const obj = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    return "已达本账号本次" + (obj[arg2] || result.label || "动作") + "上限";
  }
  function fn11(arg1, arg2, text = "", arg4) {
    return fn10(arg1, arg2, arg4) || String(text || "").trim() || "当前无法执行该动作";
  }
  function fn12(options = {}) {
    if (options?.isPrivate || options?.followIsPrivate) {
      return true;
    }
    if (options?.dmBlocked || options?.blockType === "privacy_settings") {
      return true;
    }
    if (options?.errorCode === "private_account" || options?.errorCode === "privacy_settings") {
      return true;
    }
    if (options?.errorCode === "follow_privacy_restricted") {
      return true;
    }
    const result = String(options?.error || options?.filterReason || options?.detail || "");
    return /私密账号|隐私设置|对方账号设置了隐私|无法发送消息/.test(result);
  }
  function fn13(text = "互动", options = {}) {
    const result = String(options?.error || options?.filterReason || options?.detail || "").trim();
    if (/对方账号设置了隐私/.test(result)) {
      return result;
    }
    if (/隐私设置|无法发送消息|follow_privacy/.test(result) || options?.blockType === "privacy_settings") {
      return "对方账号设置了隐私，无法" + text;
    }
    return "对方账号设置了隐私，未执行" + text;
  }
  function fn14(arg1, arg2, arg3) {
    const result = map.get(arg1);
    if (!result?.actionLimitState) {
      return;
    }
    const result2 = recordAccountActionLimitSuccess(result.actionLimitState, arg3, arg2);
    if (!result2.enabled) {
      return;
    }
    const result3 = fn5(result, arg3);
    fn15(arg1, result2.label + " " + result3 + "本次计数 " + result2.count + "/" + result2.limit, "info");
    const value = String(arg3 || "") + ":" + arg2;
    if (!result2.allowed && !result.actionLimitReachedLogged?.has(value)) {
      if (!result.actionLimitReachedLogged) {
        result.actionLimitReachedLogged = new Set();
      }
      result.actionLimitReachedLogged.add(value);
      fn15(arg1, result2.label + " " + result3 + "已达到本次上限 " + result2.limit + "，该账号后续将跳过该动作", "warning");
    }
  }
  function fn16(arg1) {
    const result = Math.max(0, Math.round((Number(arg1) || 0) / 1000));
    if (result < 60) {
      return result + " 秒";
    }
    const result2 = Math.floor(result / 60);
    const value = result % 60;
    if (value > 0) {
      return result2 + " 分 " + value + " 秒";
    } else {
      return result2 + " 分钟";
    }
  }
  function fn17(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return null;
    }
    try {
      for (const item of map6.values()) {
        if (item?.webContents === arg1) {
          return item;
        }
      }
    } catch (error) {}
    return null;
  }
  function fn18(arg1, arg2 = null) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return () => {};
    }
    const local = String(arg2?.__radarMonitorViewKey || "").trim() || fn19(arg1);
    try {
      arg1.setBackgroundThrottling?.(false);
    } catch (error) {}
    try {
      arg1.setFrameRate?.(30);
    } catch (error) {}
    if (local) {
      automationLiveViewLifecycle?.wake?.(local);
    }
    try {
      const result = JSON.stringify(local || "");
      arg1.executeJavaScript("(() => {\n          try {\n            if (" + result + ") {\n              window.__radar_view_key = " + result + ";\n              try { sessionStorage.setItem('radar_view_key', " + result + "); } catch (_) {}\n            }\n            document.body && document.body.focus();\n          } catch (_) {}\n          return true;\n        })()", true).catch(() => {});
    } catch (error) {}
    return () => {};
  }
  function fn20(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    try {
      fn21(arg1, true);
    } catch (error) {}
    try {
      fn22(arg1);
    } catch (error) {}
    try {
      fn23(arg1);
    } catch (error) {}
  }
  function fn24(arg1, arg2 = null) {
    if (arg1?.__radarMonitorHost || arg1?.__radarMonitorInteraction) {
      return true;
    }
    if (arg1?.__radarEntityHost) {
      return true;
    }
    const local = arg2 || arg1?.webContents;
    if (!local || local.isDestroyed?.()) {
      return false;
    }
    try {
      for (const item of map6.values()) {
        if (item?.webContents === local) {
          return true;
        }
      }
    } catch (error) {}
    try {
      const value = typeof getPlatformViews === "function" ? getPlatformViews() : null;
      if (value) {
        for (const [local2, local3] of value.entries()) {
          if (local3?.webContents === local && String(local2).startsWith("monitor_")) {
            return true;
          }
        }
      }
    } catch (error) {}
    return false;
  }
  function fn23(arg1, arg2 = null) {
    const local = arg2 || arg1?.webContents;
    if (fn24(arg1, local)) {
      return fn18(local, arg1);
    }
    if (arg1 && !arg1.isDestroyed?.()) {
      return primeHiddenWindowForInteraction(arg1) || (() => {});
    }
    return () => {};
  }
  function fn19(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return "";
    }
    try {
      for (const item of map6.values()) {
        if (item?.webContents === arg1) {
          return String(item.__radarMonitorViewKey || "").trim();
        }
      }
    } catch (error) {}
    try {
      const value = typeof getPlatformViews === "function" ? getPlatformViews() : null;
      if (value) {
        for (const [local, local2] of value.entries()) {
          if (local2?.webContents === arg1 && String(local).startsWith("monitor_")) {
            return String(local);
          }
        }
      }
    } catch (error) {}
    return "";
  }
  function fn25(arg1, arg2 = null) {
    const local = arg2 || arg1?.webContents || null;
    const local2 = String(arg1?.__radarMonitorViewKey || "").trim() || fn19(local);
    if (!local2 || typeof getPlatformViews !== "function") {
      return false;
    }
    try {
      const local = getPlatformViews()?.get?.(local2);
      const value = typeof getMainWindow === "function" ? getMainWindow() : null;
      if (!local || !value || value.isDestroyed?.()) {
        return false;
      }
      return !!value.getBrowserViews?.()?.includes?.(local);
    } catch (error) {
      return false;
    }
  }
  function fn21(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    const value = arg1.webContents;
    if (!value || value.isDestroyed()) {
      return;
    }
    arg1.__radarMonitorActive = !!arg2;
    arg1.__radarMonitorLastUsedAt = Date.now();
    const result = fn25(arg1);
    try {
      value.setBackgroundThrottling(false);
    } catch (error) {}
    try {
      value.setFrameRate(arg2 || result ? num4 : num8);
    } catch (error) {}
    try {
      value.setImageAnimationPolicy(arg2 || result ? "animateOnce" : "noAnimation");
    } catch (error) {}
    if (!arg2 && !result) {
      value.executeJavaScript("\n        (() => {\n          document.querySelectorAll('video, audio').forEach((media) => {\n            try { media.pause(); } catch (_) {}\n          });\n          return true;\n        })()\n      ", true).catch(() => {});
    }
  }
  function fn22(arg1) {
    if (!arg1 || arg1.isDestroyed?.()) {
      return;
    }
    if (arg1.__radarMonitorHost || arg1.__radarMonitorInteraction) {
      return;
    }
    if (arg1.__radarAllowVisibleMonitor) {
      return;
    }
    ensureHiddenWindowStaysHidden(arg1);
  }
  function fn26({
    taskId = null,
    accountId = null
  } = {}) {
    if (accountId != null && accountId !== "") {
      return [String(accountId)];
    }
    if (taskId != null && taskId !== "") {
      const result = map.get(String(taskId));
      const result2 = (Array.isArray(result?.accounts) ? result.accounts : []).map(arg1 => String(arg1?.id || arg1?.accountId || "").trim()).filter(Boolean);
      if (result2.length) {
        return result2;
      }
    }
    return [...result3.listActiveMonitorAccountIds()];
  }
  async function fn27({
    taskId = null,
    accountId = null
  } = {}) {
    const value = taskId != null && taskId !== "" ? String(taskId) : null;
    const value2 = value ? map.get(value) : null;
    if (value && !value2) {
      return {
        success: false,
        shown: 0,
        error: "任务未在运行"
      };
    }
    const result = fn26({
      taskId: value,
      accountId: accountId
    });
    const map2 = new Map((Array.isArray(value2?.accounts) ? value2.accounts : []).map(arg1 => [String(arg1?.id || arg1?.accountId || ""), arg1]).filter(([arg1]) => arg1));
    for (const item of result) {
      const result = map6.get(item);
      if (result && !result.isDestroyed() && !result.__radarMonitorUnhealthy) {
        continue;
      }
      const result2 = map2.get(item);
      if (!result2) {
        continue;
      }
      try {
        await fn28(item, result2.proxy, value || "");
      } catch (error) {
        console.warn("[VideoMonitor] 打开监控画面时创建宿主失败 " + item + ":", error?.message || error);
      }
    }
    for (const item of result) {
      const result = map6.get(String(item));
      if (!result || result.isDestroyed?.()) {
        continue;
      }
      try {
        fn21(result, true);
      } catch (error) {}
      try {
        fn23(result);
      } catch (error) {}
    }
    return result3.showMonitorLivePreview({
      taskId: value,
      accountId: accountId
    });
  }
  function fn29({
    taskId = null,
    accountId = null
  } = {}) {
    return result3.hideMonitorLivePreview({
      taskId: taskId,
      accountId: accountId
    });
  }
  function fn30(arg1 = num14) {
    if (num28 < result) {
      num28 += 1;
      return Promise.resolve(fn31());
    }
    const result2 = Math.max(15000, Number(arg1) || num14);
    return new Promise((arg1, arg2) => {
      let flag = false;
      const result = setTimeout(() => {
        if (flag) {
          return;
        }
        flag = true;
        const result = list.indexOf(local);
        if (result >= 0) {
          list.splice(result, 1);
        }
        const error = new Error("等待后台页面执行名额超时");
        error.code = "monitor_operation_slot_timeout";
        arg2(error);
      }, result2);
      const local = arg12 => {
        if (flag) {
          try {
            arg12?.();
          } catch (error) {}
          return;
        }
        flag = true;
        clearTimeout(result);
        arg1(arg12);
      };
      list.push(local);
    });
  }
  function fn31() {
    let flag = false;
    return () => {
      if (flag) {
        return;
      }
      flag = true;
      const result = list.shift();
      if (result) {
        result(fn31());
      } else {
        num28 = Math.max(0, num28 - 1);
      }
    };
  }
  function fn32(arg1 = null) {
    const value = arg1 == null ? null : String(arg1);
    const result = [...map6.entries()].filter(([arg1, arg12]) => arg1 !== value && arg12 && !arg12.isDestroyed() && !arg12.__radarMonitorActive && !arg12.__radarAllowVisibleMonitor && !fn25(arg12)).sort((arg1, arg2) => Number(arg2[1].__radarMonitorLastUsedAt || 0) - Number(arg1[1].__radarMonitorLastUsedAt || 0));
    const result2 = Math.max(0, num3 - (value ? 1 : 0));
    result.slice(result2).forEach(([arg1, arg12]) => {
      try {
        arg12.destroy();
      } catch (error) {}
      if (map6.get(arg1) === arg12) {
        map6.delete(arg1);
      }
    });
  }
  function fn33(arg1) {
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return;
    }
    arg1.webContents.executeJavaScript("\n      (() => {\n        const pauseMedia = (media) => {\n          try {\n            media.muted = true;\n            media.pause();\n            media.preload = 'metadata';\n          } catch (_) {}\n        };\n        document.querySelectorAll('video, audio').forEach(pauseMedia);\n        if (!window.__radarMonitorMediaBlockerInstalled) {\n          window.__radarMonitorMediaBlockerInstalled = true;\n          document.addEventListener('play', (event) => {\n            const media = event.target;\n            if (media && (media.tagName === 'VIDEO' || media.tagName === 'AUDIO')) {\n              pauseMedia(media);\n            }\n          }, true);\n        }\n        return true;\n      })()\n    ", true).catch(() => {});
  }
  async function fn34(arg1, arg2, arg3, arg4 = () => map.has(arg2)) {
    const result2 = String(arg1);
    const local = map7.get(result2) || Promise.resolve();
    let local2;
    const promise = new Promise(arg1 => {
      local2 = arg1;
    });
    const result3 = local.catch(() => {}).then(() => promise);
    map7.set(result2, result3);
    const result4 = Date.now();
    await local.catch(() => {});
    const value = Date.now() - result4;
    if (value >= 500) {
      fn15(arg2, "同账号监控窗口排队 " + (value / 1000).toFixed(1) + " 秒，已开始继续执行", "info");
    }
    let local3 = () => {};
    const result5 = map.get(arg2);
    const local4 = result5?.currentAccountId;
    try {
      const result3 = Date.now();
      try {
        local3 = await fn30();
      } catch (error) {
        fn15(arg2, "设备降载保护：等待后台页面执行名额超过 " + Math.round(num14 / 1000) + " 秒，本项已跳过以免卡住（" + (error?.message || error) + "）", "warning");
        return null;
      }
      const value = Date.now() - result3;
      if (value >= 1000) {
        fn15(arg2, "设备降载保护：等待 " + (value / 1000).toFixed(1) + " 秒后获得后台页面执行名额（最多并行 " + result + " 个）", "info");
      }
      const result4 = map6.get(result2);
      fn21(result4, true);
      fn32(result2);
      if (result5) {
        result5.currentAccountId = result2;
      }
      if (!arg4()) {
        return null;
      }
      return await arg3();
    } finally {
      if (result5) {
        if (local4 != null) {
          result5.currentAccountId = local4;
        } else {
          delete result5.currentAccountId;
        }
      }
      fn21(map6.get(result2), false);
      fn32(result2);
      try {
        local3();
      } catch (error) {}
      local2();
      if (map7.get(result2) === result3) {
        map7.delete(result2);
      }
    }
  }
  function fn35() {
    try {
      result5.destroyAllInteractionViews();
    } catch (error) {}
    for (const item of map6.values()) {
      if (item && !item.isDestroyed()) {
        item.destroy();
      }
    }
    map6.clear();
  }
  function fn36(arg1) {
    if (!arg1) {
      return;
    }
    if (arg1.timer) {
      clearTimeout(arg1.timer);
      arg1.timer = null;
    }
    if (arg1.resourceTimer) {
      clearInterval(arg1.resourceTimer);
      arg1.resourceTimer = null;
    }
    if (arg1.heartbeatTimer) {
      clearInterval(arg1.heartbeatTimer);
      arg1.heartbeatTimer = null;
    }
  }
  function fn37(arg1, arg2, arg3) {
    if (arg1 == null) {
      return 0;
    }
    let num = 0;
    const local = (arg12, options = {}) => {
      for (const [local, local2] of arg12.entries()) {
        if (local2.webContentsId !== arg1) {
          continue;
        }
        arg12.delete(local);
        fn36(local2);
        local2.resolve({
          success: false,
          error: arg3,
          errorCode: arg2,
          elapsedMs: Date.now() - local2.startedAt,
          ...options
        });
        num += 1;
      }
    };
    local(map2);
    local(map3, {
      comments: []
    });
    local(map4, {
      works: []
    });
    try {
      num += result4.failPendingForWebContents(arg1, arg2, arg3) || 0;
    } catch (error) {}
    return num;
  }
  function fn38(options = {}) {
    const result = map2.get(options.requestId);
    if (!result) {
      return;
    }
    map2.delete(options.requestId);
    fn36(result);
    const value = Date.now() - result.startedAt;
    if (Date.now() > result.deadline) {
      result.resolve({
        success: false,
        error: "监控互动超过 " + Math.round(result.timeoutMs / 1000) + " 秒，已终止本次动作",
        errorCode: "monitor_action_timeout",
        elapsedMs: value
      });
      return;
    }
    result.resolve({
      ...options,
      elapsedMs: value
    });
  }
  function fn39(options = {}) {
    const result = String(options?.requestId || "").trim();
    const result2 = String(options?.message || "").trim();
    if (!result || !result2) {
      return;
    }
    const result3 = map2.get(result);
    if (!result3?.taskId) {
      return;
    }
    const result4 = ((Date.now() - result3.startedAt) / 1000).toFixed(1);
    const value = result3.action === "like" ? "点赞" : result3.action === "reply" ? "回复" : result3.action === "follow" ? "关注" : "互动";
    fn15(result3.taskId, value + "进度 +" + result4 + "s：" + result2, "info");
  }
  function fn40(options = {}) {
    const result = map3.get(options.requestId);
    if (!result) {
      return;
    }
    map3.delete(options.requestId);
    fn36(result);
    const value = Date.now() - result.startedAt;
    const value2 = result.latestProgress;
    const local = Date.now() > result.deadline || options.errorCode === "monitor_scrape_page_timeout";
    if (local && Array.isArray(value2?.comments) && value2.comments.length > 0) {
      result.resolve({
        ...value2,
        success: true,
        partialDueToDeadline: true,
        capped: false,
        elapsedMs: value
      });
      return;
    }
    if (Date.now() > result.deadline) {
      result.resolve({
        success: false,
        error: "评论抓取超过 " + Math.round(result.timeoutMs / 1000) + " 秒，已跳过当前视频",
        errorCode: "monitor_scrape_timeout",
        comments: [],
        elapsedMs: value
      });
      return;
    }
    result.resolve({
      ...options,
      elapsedMs: value
    });
  }
  function fn41(options = {}) {
    const result = map3.get(options.requestId);
    if (!result) {
      return;
    }
    const value = Array.isArray(options.comments) ? options.comments.slice(0, MONITOR_MAX_COMMENTS) : [];
    result.latestProgress = {
      ...options,
      comments: value,
      resumeState: options.resumeState && typeof options.resumeState === "object" ? {
        ...options.resumeState
      } : null,
      receivedAt: Date.now()
    };
  }
  function fn42(arg1) {
    const value = arg1 + "_";
    const set = new Set();
    const local = (arg1, options = {}) => {
      for (const [local, local2] of arg1.entries()) {
        if (!String(local).startsWith(value)) {
          continue;
        }
        arg1.delete(local);
        fn36(local2);
        if (local2.webContentsId != null) {
          set.add(local2.webContentsId);
        }
        local2.resolve({
          success: false,
          error: "监控任务已停止",
          errorCode: "monitor_task_stopped",
          elapsedMs: Date.now() - local2.startedAt,
          ...options
        });
      }
    };
    local(map2);
    local(map3, {
      comments: []
    });
    local(map4, {
      works: []
    });
    try {
      result4.cancelPendingForTask(arg1);
    } catch (error) {}
    return set;
  }
  function fn43(options = {}) {
    const result = map4.get(options.requestId);
    if (!result) {
      return;
    }
    map4.delete(options.requestId);
    if (result.timer) {
      clearTimeout(result.timer);
    }
    const value = Date.now() - result.startedAt;
    if (Date.now() > result.deadline) {
      result.resolve({
        success: false,
        error: "主播作品抓取超过 " + Math.round(result.timeoutMs / 1000) + " 秒",
        errorCode: "monitor_author_works_timeout",
        works: [],
        elapsedMs: value
      });
      return;
    }
    result.resolve({
      ...options,
      elapsedMs: value
    });
  }
  function fn44(options = {}) {
    try {
      result4.handleNavResult(options || {});
    } catch (error) {}
  }
  async function fn45(arg1, arg2, num = 90000) {
    const result = String(arg2?.action || "");
    const result2 = String(arg2?.taskId || "").trim();
    const local = arg1?.__radarMonitorAbortSignal || null;
    const result3 = ["reply", "like", "follow", "dm", "profile-first-comment", "profile-target-check", "video-main-comment"].includes(result);
    let local2 = () => {};
    if (result3) {
      try {
        if (result2 && result === "like") {
          fn15(result2, "点赞：唤醒监控页面 @" + (arg2?.nickname || "用户") + "…", "info");
        }
        const result3 = fn17(arg1);
        local2 = fn18(arg1, result3);
        await new Promise(arg1 => setTimeout(arg1, 120));
      } catch (error) {}
    }
    let flag = false;
    const local3 = () => {
      if (flag) {
        return;
      }
      flag = true;
      try {
        local2();
      } catch (error) {}
    };
    try {
      return await new Promise(arg12 => {
        const result3 = Date.now();
        let flag = false;
        let local2 = null;
        const local4 = arg1 => {
          if (flag) {
            return;
          }
          flag = true;
          if (local2 && local) {
            try {
              local.removeEventListener("abort", local2);
            } catch (error) {}
          }
          local3();
          arg12(arg1);
        };
        const result4 = setTimeout(() => {
          map2.delete(arg2.requestId);
          local4({
            success: false,
            error: "监控互动等待超时（" + Math.round(num / 1000) + " 秒）",
            errorCode: "monitor_action_timeout",
            elapsedMs: Date.now() - result3
          });
        }, num);
        local2 = () => {
          clearTimeout(result4);
          map2.delete(arg2.requestId);
          local4({
            success: false,
            error: "监控互动已取消",
            errorCode: "monitor_interaction_aborted",
            elapsedMs: Date.now() - result3
          });
        };
        if (local?.aborted) {
          local2();
          return;
        }
        try {
          local?.addEventListener?.("abort", local2, {
            once: true
          });
        } catch (error) {}
        map2.set(arg2.requestId, {
          resolve: arg1 => {
            clearTimeout(result4);
            local4(arg1);
          },
          timer: result4,
          startedAt: result3,
          deadline: result3 + num,
          timeoutMs: num,
          webContentsId: arg1?.id,
          taskId: result2,
          action: result
        });
        try {
          if (!arg1 || arg1.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          if (arg1.__radarMonitorUnhealthy) {
            const error = new Error("后台监控渲染进程状态异常");
            error.code = "monitor_renderer_unhealthy";
            throw error;
          }
          if (result2 && result === "like") {
            fn15(result2, "点赞：已下发页面动作，开始定位评论 @" + (arg2?.nickname || "用户") + "…", "info");
          }
          arg1.send("control-task", {
            type: "VIDEO_MONITOR_ACTION",
            payload: arg2
          });
        } catch (error) {
          clearTimeout(result4);
          map2.delete(arg2.requestId);
          local4({
            success: false,
            error: error.message || "无法向监控窗口下发互动动作",
            errorCode: error.code || "monitor_action_dispatch_failed"
          });
        }
      });
    } catch (error) {
      local3();
      return {
        success: false,
        error: error?.message || "监控互动执行异常",
        errorCode: error?.code || "monitor_action_exception"
      };
    }
  }
  async function fn46(arg1, arg2, arg3 = num11) {
    const result = Number(arg3);
    const value = Number.isFinite(result) ? Math.max(45000, Math.floor(result)) : num11;
    return new Promise(arg12 => {
      const result = Date.now();
      let flag = false;
      const local = String(arg2?.taskId || "").trim() || String(arg2?.requestId || "").split("_")[0];
      const local2 = arg1 => {
        if (flag) {
          return;
        }
        flag = true;
        const result = map3.get(arg2.requestId);
        map3.delete(arg2.requestId);
        fn36(result);
        arg12(arg1);
      };
      const result2 = setTimeout(() => {
        const result2 = map3.get(arg2.requestId);
        const local = result2?.latestProgress;
        if (Array.isArray(local?.comments) && local.comments.length > 0) {
          local2({
            ...local,
            success: true,
            partialDueToDeadline: true,
            capped: false,
            elapsedMs: Date.now() - result
          });
          return;
        }
        local2({
          success: false,
          error: "评论抓取超过 " + Math.round(value / 1000) + " 秒，已跳过当前视频",
          errorCode: "monitor_scrape_timeout",
          comments: result2?.latestProgress?.comments || [],
          resumeState: result2?.latestProgress?.resumeState || null,
          elapsedMs: Date.now() - result
        });
      }, value);
      const obj = {
        resolve: local2,
        timer: result2,
        resourceTimer: null,
        heartbeatTimer: null,
        lastHeartbeatAt: 0,
        resourcePressureSamples: 0,
        latestProgress: null,
        startedAt: result,
        deadline: result + value,
        timeoutMs: value,
        webContentsId: arg1?.id,
        taskId: local
      };
      map3.set(arg2.requestId, obj);
      obj.heartbeatTimer = setInterval(() => {
        const result2 = map3.get(arg2.requestId);
        if (!result2 || result2 !== obj || flag) {
          return;
        }
        const local3 = Number(result2.latestProgress?.receivedAt) || result;
        const value = Date.now() - local3;
        const value2 = Date.now() - result;
        if (local && value >= num17 && Date.now() - Number(result2.lastHeartbeatAt || 0) >= num17) {
          result2.lastHeartbeatAt = Date.now();
          fn15(local, "评论抓取仍在进行（已 " + Math.round(value2 / 1000) + " 秒，页面已 " + Math.round(value / 1000) + " 秒无进度回报）", "info");
        }
        if (value < num16) {
          return;
        }
        const value3 = result2.latestProgress;
        if (Array.isArray(value3?.comments) && value3.comments.length > 0) {
          local2({
            ...value3,
            success: true,
            partialDueToDeadline: true,
            errorCode: "monitor_scrape_stalled",
            error: "评论抓取已 " + Math.round(num16 / 1000) + " 秒无进度，保留已抓评论并跳过以免卡住",
            elapsedMs: value2
          });
          return;
        }
        local2({
          success: false,
          error: "评论抓取已 " + Math.round(num16 / 1000) + " 秒无进度，已跳过当前视频以免卡住",
          errorCode: "monitor_scrape_stalled",
          comments: [],
          resumeState: value3?.resumeState || null,
          elapsedMs: value2
        });
      }, 5000);
      if (typeof obj.heartbeatTimer.unref === "function") {
        obj.heartbeatTimer.unref();
      }
      if (arg2.allowResourceCheckpoint !== false) {
        obj.resourceTimer = setInterval(() => {
          const result2 = map3.get(arg2.requestId);
          if (!result2 || result2 !== obj) {
            return;
          }
          if (Date.now() - result < num19) {
            return;
          }
          const result3 = fn47(arg1);
          if (result3 < num6) {
            result2.resourcePressureSamples = 0;
            return;
          }
          result2.resourcePressureSamples += 1;
          const value = result2.latestProgress;
          if (result2.resourcePressureSamples < num20 || !value || !Array.isArray(value.comments) || value.comments.length === 0 || Number(value.resumeState?.scrollRound || 0) < 1) {
            return;
          }
          local2({
            ...value,
            success: false,
            resourceCheckpoint: true,
            errorCode: "monitor_renderer_resource_checkpoint",
            error: "渲染内存连续达到 " + result3 + "MB，已保存采集进度",
            rendererMemoryMb: result3,
            elapsedMs: Date.now() - result
          });
        }, num18);
        if (typeof obj.resourceTimer.unref === "function") {
          obj.resourceTimer.unref();
        }
      }
      (async () => {
        try {
          if (!arg1 || arg1.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          if (arg1.__radarMonitorUnhealthy) {
            const error = new Error("后台监控渲染进程状态异常");
            error.code = "monitor_renderer_unhealthy";
            throw error;
          }
          await fn(arg1);
          if (!arg1 || arg1.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          arg1.send("control-task", {
            type: "VIDEO_MONITOR_SCRAPE",
            payload: {
              ...arg2,
              taskId: local || arg2.taskId
            }
          });
        } catch (error) {
          local2({
            success: false,
            error: error.message || "无法向监控窗口下发评论抓取",
            errorCode: error.code || "monitor_scrape_dispatch_failed",
            comments: [],
            elapsedMs: Date.now() - result
          });
        }
      })();
    });
  }
  async function fn48(arg1, arg2, num = 90000) {
    return new Promise(arg12 => {
      const result = Date.now();
      const result2 = setTimeout(() => {
        map4.delete(arg2.requestId);
        arg12({
          success: false,
          error: "主播作品抓取超过 " + Math.round(num / 1000) + " 秒",
          errorCode: "monitor_author_works_timeout",
          works: [],
          elapsedMs: Date.now() - result
        });
      }, num);
      map4.set(arg2.requestId, {
        resolve: arg12,
        timer: result2,
        startedAt: result,
        deadline: result + num,
        timeoutMs: num,
        webContentsId: arg1?.id
      });
      try {
        if (!arg1 || arg1.isDestroyed()) {
          throw new Error("监控窗口已销毁");
        }
        if (arg1.__radarMonitorUnhealthy) {
          const error = new Error("后台监控渲染进程状态异常");
          error.code = "monitor_renderer_unhealthy";
          throw error;
        }
        arg1.send("control-task", {
          type: "VIDEO_MONITOR_AUTHOR_WORKS",
          payload: arg2
        });
      } catch (error) {
        clearTimeout(result2);
        map4.delete(arg2.requestId);
        arg12({
          success: false,
          error: error.message || "无法向监控窗口下发主播作品抓取",
          errorCode: error.code || "monitor_author_works_dispatch_failed",
          works: [],
          elapsedMs: Date.now() - result
        });
      }
    });
  }
  function fn49(arg1) {
    return "monitor_task_seen_" + arg1;
  }
  function fn50(arg1) {
    const monitorTaskSeenAccess = require("./monitorTaskSeenAccess");
    return monitorTaskSeenAccess.getSeenKeys(store, arg1);
  }
  function fn51(arg1, arg2, options = {}) {
    const result = String(arg1 || "");
    const result2 = map.get(result);
    const value = options.seenEpoch;
    if (result2 && value != null && (result2.seenInventoryEpoch || 0) !== value) {
      return false;
    }
    const monitorTaskSeenAccess = require("./monitorTaskSeenAccess");
    return monitorTaskSeenAccess.saveSeenKeys(store, result, arg2);
  }
  function fn52(arg1) {
    const result = String(arg1 || "");
    if (!result) {
      return {
        count: 0
      };
    }
    return {
      count: fn50(result).length
    };
  }
  function fn53(arg1) {
    const result = String(arg1 || "");
    if (!result) {
      return {
        success: false,
        error: "缺少任务 ID"
      };
    }
    const monitorTaskSeenAccess = require("./monitorTaskSeenAccess");
    const result2 = monitorTaskSeenAccess.clearSeenKeys(store, result);
    try {
      store.delete("monitor_task_video_baseline_" + result);
    } catch (error) {}
    const result3 = map.get(result);
    if (result3) {
      result3.seenInventoryEpoch = (Number(result3.seenInventoryEpoch) || 0) + 1;
      const value = result3.liveSeenState;
      if (value && Array.isArray(value.updatedSeenKeys) && value.seenKeySet instanceof Set) {
        value.updatedSeenKeys.length = 0;
        value.seenKeySet.clear();
      }
    }
    fn15(result, result2 > 0 ? "已清空评论去重记录 " + result2 + " 条；下一轮将按当前时间窗重新研判历史评论" : "评论去重记录已是空的；下一轮将按当前时间窗研判", "success");
    return {
      success: true,
      cleared: result2,
      running: !!result3
    };
  }
  function fn54(arg1) {
    return "monitor_task_author_seen_" + arg1;
  }
  function fn55(arg1) {
    return "monitor_task_author_baseline_" + arg1;
  }
  function fn56(arg1) {
    const result = store.get(fn54(arg1), []);
    if (Array.isArray(result)) {
      return result;
    } else {
      return [];
    }
  }
  function fn57(arg1, arg2) {
    store.set(fn54(arg1), [...new Set(arg2.filter(Boolean))].slice(-5000));
  }
  function fn58(arg1) {
    const local = store.get(fn55(arg1), {}) || {};
    if (local && typeof local === "object") {
      return local;
    } else {
      return {};
    }
  }
  function fn59(arg1, arg2) {
    return !!fn58(arg1)[arg2];
  }
  function fn60(arg1, arg2) {
    const result = fn58(arg1);
    result[arg2] = Date.now();
    store.set(fn55(arg1), result);
  }
  function fn61(arg1) {
    return leadUserKey.extractUserKeyFromUrl(arg1) || "";
  }
  const set2 = new Set(["主账号", "默认账号", "本账号", "未知账号", "已登录(待识别)", "我的", "登录"]);
  function fn62(arg1, arg2) {
    const result = String(arg1?.nickname || "").trim();
    const result2 = String(arg1?.remark || arg1?.note || arg1?.alias || "").trim();
    const result3 = String(arg1?.name || "").trim();
    const local = arg1 => {
      const result2 = String(arg1 || "").trim();
      if (!result2 || set2.has(result2) || result2 === result) {
        return "";
      }
      return result2;
    };
    if (result) {
      const local2 = local(result2) || local(result3);
      if (local2) {
        return result + " (" + local2 + ")";
      } else {
        return result;
      }
    }
    if (result2 && !set2.has(result2)) {
      return result2;
    }
    if (result3 && !set2.has(result3)) {
      return result3;
    }
    const result4 = String(arg2 || arg1?.id || "").trim();
    if (result4 && result4 !== "default") {
      return "账号" + result4;
    }
    return "未知账号";
  }
  function fn63(arg1, arg2) {
    const local = fn61(arg2?.userUrl || arg2?.authorProfileUrl || arg2?.secUid) || (arg2?.nickname ? normalizeMonitorNickname(arg2.nickname) : "");
    return arg1 + "_" + local + "_" + arg2.text;
  }
  function fn64(arg1, arg2, arg3, arg4, text = "") {
    const local = fn61(text) || arg3 || "";
    const value = arg1 + "_" + (arg2 || "") + "_" + local + "_" + (arg4 || "");
    let num = 0;
    for (let num2 = 0; num2 < value.length; num2 += 1) {
      num = (num << 5) - num + value.charCodeAt(num2);
      num |= 0;
    }
    return "match_" + Math.abs(num).toString(36) + "_" + value.length;
  }
  function fn65(arg1, arg2, arg3, arg4) {
    if (!arg4) {
      return false;
    }
    if (arg1?.has(arg4)) {
      return true;
    }
    if (Array.isArray(arg3) && arg3.includes(arg4)) {
      return true;
    }
    if (Array.isArray(arg2) && arg2.includes(arg4)) {
      return true;
    }
    const value = "_" + arg4;
    const local = arg1 => typeof arg1 === "string" && arg1.length > arg4.length && arg1.endsWith(value);
    if (arg1) {
      for (const item of arg1) {
        if (local(item)) {
          return true;
        }
      }
    }
    if (Array.isArray(arg3) && arg3.some(local)) {
      return true;
    }
    if (Array.isArray(arg2) && arg2.some(local)) {
      return true;
    }
    return false;
  }
  function fn66(arg1, arg2) {
    const local = arg2?.findTaskById?.(arg1);
    return local?.name || "监控任务 " + arg1;
  }
  function fn67({
    comment: comment,
    videoItem: videoItem,
    account: account,
    accountId: accountId,
    taskId: taskId,
    taskName: taskName,
    evaluation: evaluation,
    matchRecord: matchRecord,
    touchOnlyTypes = null
  }) {
    const local = comment?.nickname || "";
    const local2 = comment?.text || "";
    let result = String(comment?.userUrl || comment?.authorProfileUrl || "").trim();
    const local3 = comment?.ipLocation || comment?.location || "";
    const local4 = fn61(result) || fn61(comment?.authorProfileUrl || "");
    const result2 = String(comment?.secUid || comment?.sec_uid || "").trim();
    const local5 = local4 || (leadUserKey.isDouyinSecUid(result2) ? result2 : "");
    if (local5 && !fn61(result)) {
      result = "https://www.douyin.com/user/" + local5;
    }
    const result3 = fn62(account, accountId);
    const obj = {
      platform: "DY",
      title: videoItem?.title || "",
      nickname: local,
      content: local2,
      timeText: comment?.time || "",
      userUrl: result,
      secUid: local5 || undefined,
      url: videoItem?.url || "",
      videoUrl: videoItem?.url || "",
      sourceType: "comment",
      timestamp: Date.now(),
      capturedAt: new Date().toISOString(),
      type: "LEAD",
      isHighIntention: false,
      accountId: String(accountId ?? account?.id ?? ""),
      accountName: result3,
      taskName: taskName,
      taskId: taskId,
      ipLocation: local3,
      location: local3 || "未知",
      entrySource: "monitor",
      entryLabel: "监控: " + taskName,
      actions: {
        liked: false,
        replied: false,
        messaged: false,
        followed: false
      }
    };
    if (evaluation) {
      obj.isHighIntention = !!evaluation.matched;
      if (evaluation.excludedCommentKeyword) {
        obj.excludedCommentKeyword = evaluation.excludedCommentKeyword;
      }
      const local = evaluation.reason || evaluation.judgeReason || "";
      if (evaluation.matched) {
        obj.thought = local || (evaluation.matchType === "ai" ? "监控人设命中" : "监控关键词命中");
        if (evaluation.aiResult?.thought || evaluation.aiResult?.reason) {
          obj.aiThought = evaluation.aiResult.thought || evaluation.aiResult.reason;
        } else if (evaluation.matchType === "ai") {
          obj.aiThought = local;
        }
      } else {
        obj.thought = local || "监控未命中";
      }
    } else {
      obj.thought = "监控新评论";
    }
    if (matchRecord) {
      if (matchRecord.isPrivate !== undefined) {
        obj.isPrivate = !!matchRecord.isPrivate;
      }
      if (matchRecord.noWorks !== undefined) {
        obj.noWorks = !!matchRecord.noWorks;
      }
      if (matchRecord.worksCount !== undefined) {
        obj.worksCount = Number(matchRecord.worksCount || 0);
      }
      if (matchRecord.followIsPrivate !== undefined && matchRecord.followIsPrivate) {
        obj.isPrivate = true;
      }
      if (matchRecord.followStatus && matchRecord.followStatus !== "none") {
        obj.followStatus = matchRecord.followStatus;
        obj.followRequested = !!matchRecord.followRequested;
        obj.followRequestSent = !!matchRecord.followRequestSent;
        obj.followIsPrivate = !!matchRecord.followIsPrivate;
        if (matchRecord.followError) {
          obj.followError = matchRecord.followError;
        }
      }
      if (matchRecord.replyContent) {
        obj.replyContent = matchRecord.replyContent;
        obj.actions = {
          ...(obj.actions || {}),
          replyContent: matchRecord.replyContent
        };
      }
      if (matchRecord.replyStatus && matchRecord.replyStatus !== "none") {
        obj.replyStatus = matchRecord.replyStatus;
        if (matchRecord.replyError) {
          obj.replyError = matchRecord.replyError;
        }
      }
      if (matchRecord.dmContent) {
        obj.dmContent = matchRecord.dmContent;
        obj.actions = {
          ...(obj.actions || {}),
          dmContent: matchRecord.dmContent
        };
      }
      if (matchRecord.dmStatus && matchRecord.dmStatus !== "none") {
        obj.dmStatus = matchRecord.dmStatus;
        if (matchRecord.dmError) {
          obj.dmError = matchRecord.dmError;
        }
      }
      if (matchRecord.likeStatus && matchRecord.likeStatus !== "none") {
        obj.likeStatus = matchRecord.likeStatus;
        if (matchRecord.likeError) {
          obj.likeError = matchRecord.likeError;
        }
      }
      fn68(obj, matchRecord, {
        onlyTypes: Array.isArray(touchOnlyTypes) ? touchOnlyTypes : null
      });
      if (matchRecord.followStatus === "success" || matchRecord.followStatus === "already_followed" || matchRecord.followStatus === "requested" && matchRecord.followRequestSent) {
        obj.actions.followed = true;
        obj.followed = true;
      }
      const local = Array.isArray(touchOnlyTypes) && touchOnlyTypes.length > 0 && touchOnlyTypes.every(arg1 => arg1 === "follow" || arg1 === "message");
      if (!local) {
        if (matchRecord.likeStatus === "success") {
          obj.actions.liked = true;
          obj.liked = true;
        }
        if (matchRecord.replyStatus === "success") {
          const local = matchRecord.replyTarget === "profile_first" || String(matchRecord.profileCommentStatus || "") === "success";
          if (local) {
            obj.actions.profileWorkCommented = true;
            obj.profileCommentAt = obj.profileCommentAt || Date.now();
          } else {
            obj.actions.replied = true;
            obj.replied = true;
          }
        } else if (matchRecord.profileCommentStatus === "success") {
          obj.actions.profileWorkCommented = true;
          obj.profileCommentAt = obj.profileCommentAt || Date.now();
        }
      }
      if (matchRecord.dmStatus === "success") {
        obj.actions.messaged = true;
        obj.messaged = true;
      }
    }
    const result4 = leadUserKey.buildLeadId(obj);
    obj.leadId = result4;
    obj.key = result4;
    return obj;
  }
  function fn68(arg1, arg2, options = {}) {
    if (!arg1 || !arg2) {
      return arg1;
    }
    leadTouch.ensureLeadMeta(arg1);
    const value = Array.isArray(options.onlyTypes) && options.onlyTypes.length ? new Set(options.onlyTypes.map(String)) : null;
    const local = arg1 => !value || value.has(arg1);
    const obj = {
      accountName: arg1.accountName || "",
      source: "monitor",
      channel: "监控任务",
      success: true
    };
    if (local("like") && arg2.likeStatus === "success") {
      leadTouch.recordTouchOnLead(arg1, {
        ...obj,
        type: "like"
      });
    }
    const local2 = arg2.replyTarget === "profile_first" || String(arg2.profileCommentStatus || "none") === "success";
    if (local("profileComment") && (arg2.profileCommentStatus === "success" || local2 && arg2.replyStatus === "success")) {
      leadTouch.recordTouchOnLead(arg1, {
        ...obj,
        type: "profileComment",
        content: arg2.replyContent || arg1.replyContent || ""
      });
    } else if (local("reply") && arg2.replyStatus === "success") {
      leadTouch.recordTouchOnLead(arg1, {
        ...obj,
        type: "reply",
        content: arg2.replyContent || arg1.replyContent || ""
      });
    }
    if (local("follow") && (arg2.followStatus === "success" || arg2.followStatus === "requested" && arg2.followRequestSent)) {
      leadTouch.recordTouchOnLead(arg1, {
        ...obj,
        type: "follow"
      });
    } else if (local("follow") && arg2.followStatus === "already_followed") {
      arg1.touchCounts.follow = Math.max(Number(arg1.touchCounts.follow || 0), 1);
    }
    if (local("message") && arg2.dmStatus === "success") {
      leadTouch.recordTouchOnLead(arg1, {
        ...obj,
        type: "message",
        content: arg2.dmContent || arg1.dmContent || ""
      });
    }
    return arg1;
  }
  const list2 = ["followStatus", "followError", "followErrorCode", "followDiagnostic", "followRequested", "followRequestSent", "followIsPrivate", "dmStatus", "dmError", "dmContent", "isPrivate", "worksCount", "noWorks"];
  function fn69(arg1) {
    return !arg1 || arg1 === "none" || arg1 === "pending";
  }
  function fn70(arg1, {
    followAllowed = false,
    dmAllowed = false,
    error = "子视图加载失败"
  } = {}) {
    if (!arg1) {
      return;
    }
    if (followAllowed && fn69(arg1.followStatus)) {
      arg1.followStatus = "failed";
      arg1.followError = error;
    }
    if (dmAllowed && fn69(arg1.dmStatus)) {
      arg1.dmStatus = "failed";
      arg1.dmError = error;
    }
  }
  function fn71(arg1, list = []) {
    if (!arg1 || !Array.isArray(list)) {
      return;
    }
    for (const item of list) {
      if (!item || item === arg1) {
        continue;
      }
      for (const item2 of list2) {
        if (arg1[item2] !== undefined) {
          item[item2] = arg1[item2];
        }
      }
    }
  }
  function fn72(options = {}, options2 = {}) {
    const result = normalizeGenderFilter(options.genderFilter !== undefined ? options.genderFilter : options2.profileActionGenderFilter, "all");
    const value = options.ageFilterEnabled !== undefined ? options.ageFilterEnabled === true : options2.profileActionAgeFilterEnabled === true;
    const value2 = Number.isFinite(Number(options.ageMin)) ? Number(options.ageMin) : options2.profileActionAgeMin;
    const value3 = Number.isFinite(Number(options.ageMax)) ? Number(options.ageMax) : options2.profileActionAgeMax;
    const local = result !== "all" || value === true;
    const value4 = local ? String(options.userUrl || options.nickname || "").trim() || "unknown-user" : "bypass";
    return {
      genderFilter: result,
      ageEnabled: value,
      ageMin: value2,
      ageMax: value3,
      filterActive: local,
      cacheKey: value4 + "|" + result + "|" + (value ? 1 : 0) + "|" + value2 + "|" + value3
    };
  }
  function fn73(arg1, arg2, arg3, arg4 = null, options = {}) {
    const result = (Array.isArray(arg1) ? arg1 : [arg1]).filter(arg1 => arg1?.content || arg1?.nickname);
    if (!result.length || typeof appendHistory !== "function") {
      return 0;
    }
    const value = options.updateOnly === true;
    const local = appendHistory(result, arg2, arg3, {
      updateOnly: value
    }) || 0;
    result.forEach(arg1 => {
      const local = leadUserKey.getLeadUserKey(arg1) || buildMonitorUserDedupKey(arg1);
      if (local && arg4) {
        arg4.add(local);
      }
      rememberMonitorUser(arg4, arg1);
      rememberGlobalMonitorUser(store, arg1);
    });
    if ((!value || local > 0) && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("automation-data", {
        type: "comment",
        payload: result.length === 1 ? result[0] : result,
        taskId: arg2,
        taskName: arg3,
        updateOnly: !!value
      });
    }
    if (value) {
      return local;
    } else {
      return result.length;
    }
  }
  function fn74(arg1, arg2, arg3) {
    if (!arg3) {
      return 0;
    }
    let num = 0;
    const local = arg1 => {
      if (!arg1) {
        return;
      }
      const result = String(arg1).trim();
      if (!result || result.startsWith("nick:") || result.length < 15) {
        return;
      }
      if (result.startsWith("video:") || result.startsWith("uid:") || result.startsWith("webcast:")) {
        return;
      }
      if (arg3.has(result)) {
        return;
      }
      arg3.add(result);
      num += 1;
    };
    try {
      const local2 = arg2?.listMatchUserKeys?.(arg1) || [];
      local2.forEach(arg1 => {
        if (arg1?.matchType === "skipped" && Number(arg1?.matched) === 0) {
          const result = String(arg1?.judgeReason || "");
          if (result.includes("同用户") || result.includes("跳过重复")) {
            return;
          }
        }
        local(fn61(arg1?.userUrl || ""));
        local(arg1?.secUid || arg1?.sec_uid || "");
      });
    } catch (error) {}
    return num;
  }
  function fn75(arg1) {
    return store.get("monitor_task_video_baseline_" + arg1, {}) || {};
  }
  function fn76(arg1, arg2) {
    return !!fn75(arg1)[arg2];
  }
  function fn77(arg1, arg2) {
    const result = fn75(arg1);
    result[arg2] = Date.now();
    store.set("monitor_task_video_baseline_" + arg1, result);
  }
  function fn78(arg1, arg2, arg3) {
    if (!arg3 || arg2.has(arg3)) {
      return false;
    }
    arg2.add(arg3);
    arg1.push(arg3);
    return true;
  }
  function fn79(arg1, arg2, list = []) {
    list.forEach(({
      key: key
    }) => {
      fn78(arg1, arg2, key);
    });
  }
  function fn80({
    comments: comments,
    videoUrl: videoUrl,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    taskId: taskId,
    skipContext: skipContext,
    commentWindowMinutes: commentWindowMinutes,
    knownUserKeySet = null
  }) {
    const flag = !fn76(taskId, videoUrl);
    const result = resolveMonitorCommentWindowMinutes({
      commentWindowMinutes: commentWindowMinutes
    });
    const list = [];
    const list2 = [];
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    const obj = {};
    comments.forEach(arg1 => {
      const result2 = fn63(videoUrl, arg1);
      if (fn65(seenKeySet, seenKeys, updatedSeenKeys, result2)) {
        num += 1;
        fn15(taskId, "[采到评论-指纹重复跳过] @" + (arg1.nickname || "用户") + "（时间：" + (arg1.time || "未知") + "）：\"" + (arg1.text || "") + "\"", "info");
        return;
      }
      if (isKnownMonitorUser(arg1, knownUserKeySet)) {
        num5 += 1;
        num4 += 1;
        const text = "同用户已入库";
        obj[text] = (obj[text] || 0) + 1;
        list2.push({
          comment: arg1,
          key: result2,
          reason: text
        });
        fn15(taskId, "[用户去重] @" + (arg1.nickname || "用户") + " 本任务已处理过该用户，跳过重复" + ("｜评论：「" + String(arg1.text || "").slice(0, 60) + "」"), "info");
        return;
      }
      const value = skipContext ? shouldSkipMonitorComment(arg1, skipContext) : {
        skip: false
      };
      if (value.skip) {
        num4 += 1;
        const local = value.reason || "已过滤";
        obj[local] = (obj[local] || 0) + 1;
        list2.push({
          comment: arg1,
          key: result2,
          reason: value.reason || "已过滤"
        });
        fn15(taskId, "[排除过滤] " + (value.detail || value.reason || "已过滤") + ("｜评论：「" + String(arg1.text || "").slice(0, 60) + "」｜时间：" + (arg1.time || "未知")), "warning");
        return;
      }
      const result3 = parseCommentAgeMinutes(arg1.time);
      if (result3 == null) {
        num3 += 1;
        list2.push({
          comment: arg1,
          key: result2,
          reason: "时间未知，仅记录去重"
        });
        fn15(taskId, "[采到评论-时间未知跳过] @" + (arg1.nickname || "用户") + "（时间：" + (arg1.time || "未抓到时间") + "）：\"" + (arg1.text || "") + "\" | 跳过原因: 无法解析发布时间", "warning");
        return;
      }
      if (result3 < result) {
        const result = claimGlobalMonitorUser(store, arg1);
        if (!result.claimed) {
          num5 += 1;
          num4 += 1;
          const value = result.reason === "lead_pool" ? "线索库已有该用户" : "其他任务已处理该用户";
          obj[value] = (obj[value] || 0) + 1;
          rememberMonitorUser(knownUserKeySet, arg1);
          list2.push({
            comment: arg1,
            key: result2,
            reason: value
          });
          fn15(taskId, "[全局去重] @" + (arg1.nickname || "用户") + " " + value + "，跳过" + ("｜评论：「" + String(arg1.text || "").slice(0, 60) + "」"), "info");
          return;
        }
        rememberMonitorUser(knownUserKeySet, arg1);
        list.push({
          comment: arg1,
          key: result2,
          ageMinutes: result3
        });
        fn15(taskId, "[采到评论-成功入库待研判] @" + (arg1.nickname || "用户") + "（时间：" + arg1.time + "，距今 " + result3 + " 分钟）：\"" + (arg1.text || "") + "\"", "info");
        return;
      }
      num2 += 1;
      list2.push({
        comment: arg1,
        key: result2,
        reason: "超过 " + result + " 分钟"
      });
      fn15(taskId, "[采到评论-超过时间范围跳过] @" + (arg1.nickname || "用户") + "（时间：" + arg1.time + "，距今 " + result3 + " 分钟）：\"" + (arg1.text || "") + "\" | 跳过原因: 超过设定的 " + result + " 分钟", "warning");
    });
    return {
      isFirstBaseline: flag,
      windowMin: result,
      toEvaluate: list,
      toSeedOnly: list2,
      inInventoryCount: num,
      outsideWindowCount: num2,
      unknownTimeCount: num3,
      skippedFilterCount: num4,
      duplicateUserCount: num5,
      skippedByReason: obj
    };
  }
  function fn81(arg1, arg2) {
    try {
      if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents?.isDestroyed?.()) {
        mainWindow.webContents.send("monitor-task-event", {
          taskId: arg1,
          ...arg2
        });
      }
    } catch (error) {}
  }
  const map8 = new Map();
  const map9 = new Map();
  function fn82(options = {}, options2 = {}) {
    Object.keys(options2 || {}).forEach(arg1 => {
      const result = Number(options2[arg1]);
      if (Number.isFinite(result) && result > 0) {
        options[arg1] = Number(options[arg1] || 0) + Math.floor(result);
      }
    });
    return options;
  }
  function fn83(arg1) {
    const result = String(arg1 || "");
    if (!result) {
      return;
    }
    const result2 = map9.get(result);
    if (result2) {
      clearTimeout(result2);
      map9.delete(result);
    }
    const result3 = map8.get(result);
    map8.delete(result);
    if (!result3?.cycleId) {
      return;
    }
    const result4 = map.get(result);
    if (!result4?.monitorTasksApi?.incrementCycleMetrics) {
      return;
    }
    try {
      result4.monitorTasksApi.incrementCycleMetrics(result, result3.cycleId, result3.delta || {});
      if (result3.emit) {
        fn81(result, {
          type: "cycle-progress",
          ts: Date.now(),
          cycleId: result3.cycleId
        });
      }
    } catch (error) {}
  }
  function fn84(arg1, options = {}, {
    emit = false
  } = {}) {
    const result = map.get(arg1);
    const local = result?.currentCycleId;
    if (!result?.monitorTasksApi?.incrementCycleMetrics || !local) {
      return;
    }
    const result2 = Object.values(options || {}).some(arg1 => Number(arg1) > 0);
    if (!result2) {
      return;
    }
    const result3 = String(arg1);
    const result4 = map8.get(result3);
    if (result4 && result4.cycleId !== local) {
      fn83(result3);
    }
    const local2 = map8.get(result3) || {
      cycleId: local,
      delta: {},
      emit: false
    };
    local2.cycleId = local;
    fn82(local2.delta, options);
    local2.emit = local2.emit || emit;
    map8.set(result3, local2);
    if (!map9.has(result3)) {
      const result = setTimeout(() => {
        map9.delete(result3);
        fn83(result3);
      }, num15);
      map9.set(result3, result);
    }
  }
  async function fn85(arg1, arg2, {
    taskName = "",
    account = null,
    videoItem = null,
    comment = null,
    matchRecord = null
  } = {}) {
    const result = resolveMonitorWebhookTarget(arg2 || {});
    if (!result) {
      if (arg2?.enableWebhook) {
        fn15(arg1, "命中通知已开启，但 Webhook 地址无效，已跳过推送", "warning");
      }
      return false;
    }
    if (!axios || typeof axios.post !== "function") {
      fn15(arg1, "命中通知推送失败：缺少 HTTP 客户端", "warning");
      return false;
    }
    const local = account?.nickname || account?.name || matchRecord?.accountName || "监控账号";
    const result2 = clipMonitorWebhookText(videoItem?.title || matchRecord?.videoTitle || "未命名视频", 48);
    const result3 = String(videoItem?.url || matchRecord?.videoUrl || "").trim();
    const local2 = comment?.nickname || matchRecord?.nickname || "用户";
    const result4 = clipMonitorWebhookText(comment?.text || matchRecord?.commentText || "", 160);
    const local3 = matchRecord?.matchType || "keyword";
    const result5 = clipMonitorWebhookText(matchRecord?.aiIntention || "", 40);
    const result6 = String(comment?.userUrl || "").trim();
    const value = result6 ? "[" + local2 + "](" + result6 + ")" : "@" + local2;
    const value2 = result3 ? "[" + (result2 || "视频") + "](" + result3 + ")" : result2 || "视频";
    const result7 = ["**任务**: " + (taskName || arg1), "**监控账号**: " + local, "**视频**: " + value2, "**评论用户**: " + value, "**评论内容**: " + (result4 || "（无正文）"), "**命中方式**: " + local3 + (result5 ? " · " + result5 : "")].join("\n");
    try {
      const result2 = buildMonitorMatchWebhookPayload(result.type, {
        title: "🎯 监控命中 - " + (taskName || "监控任务"),
        content: result7,
        time: new Date().toLocaleString()
      });
      const value = result.type === "dingtalk" ? buildSignedDingtalkUrl(result.url, result.secret) : result.url;
      const result3 = await axios.post(value, result2, {
        timeout: 10000
      });
      const flag = isMonitorWebhookResponseSuccess(result.type, result3);
      if (matchRecord) {
        matchRecord.webhookStatus = flag ? "success" : "failed";
        if (!flag) {
          matchRecord.webhookError = "Webhook 返回异常";
        }
      }
      fn15(arg1, flag ? "命中通知已推送 @" + local2 : "命中通知推送失败：机器人返回异常 @" + local2, flag ? "success" : "warning");
      return flag;
    } catch (error) {
      if (matchRecord) {
        matchRecord.webhookStatus = "failed";
        matchRecord.webhookError = error?.message || String(error);
      }
      fn15(arg1, "命中通知推送失败：" + (error?.message || error), "warning");
      return false;
    }
  }
  function fn15(arg1, arg2, text = "info", options = {}) {
    if (!arg1 || !arg2) {
      return;
    }
    let result = String(options?.accountId || "").trim();
    if (!result) {
      try {
        const result2 = map.get(arg1);
        result = String(result2?.currentAccountId || "").trim();
        if (!result) {
          const value = Array.isArray(result2?.accounts) ? result2.accounts : [];
          if (value.length === 1 && value[0]?.id) {
            result = String(value[0].id);
          }
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
    if (!map5.has(arg1) && map5.size >= num24) {
      const local = [...map5.keys()].find(arg1 => !map.has(arg1)) || map5.keys().next().value;
      if (local != null) {
        map5.delete(local);
      }
    }
    const local = map5.get(arg1) || [];
    local.push(obj);
    if (local.length > num23) {
      local.splice(0, local.length - num23);
    }
    map5.set(arg1, local);
    fn81(arg1, obj);
  }
  function fn86(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return (map5.get(arg1) || []).map(arg1 => ({
        ...arg1
      }));
    }
    const obj = {};
    for (const [local, local2] of map5.entries()) {
      obj[local] = local2.map(arg1 => ({
        ...arg1
      }));
    }
    return obj;
  }
  function fn87(arg1 = null) {
    if (arg1 != null && arg1 !== "") {
      return map5.delete(arg1);
    }
    const value = map5.size > 0;
    map5.clear();
    return value;
  }
  function fn88() {
    let result = path.join(__dirname, "..", "automation-preload.js");
    if (app.isPackaged) {
      const result2 = store.get("latest_resource_path");
      if (result2 && fs.existsSync(path.join(result2, "automation-preload.js"))) {
        result = path.join(result2, "automation-preload.js");
      }
    }
    return result;
  }
  function fn89(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed() || arg1.__radarMonitorHealthGuardsAttached) {
      return;
    }
    const value = arg1.webContents;
    const value2 = value.id;
    let local = null;
    arg1.__radarMonitorHealthGuardsAttached = true;
    arg1.__radarMonitorUnhealthy = false;
    value.__radarMonitorUnhealthy = false;
    const local2 = () => {
      if (!local) {
        return;
      }
      clearTimeout(local);
      local = null;
    };
    const local3 = (arg12, arg22) => {
      if (arg1.__radarMonitorUnhealthy) {
        return;
      }
      arg1.__radarMonitorUnhealthy = true;
      value.__radarMonitorUnhealthy = true;
      const result = fn37(value2, arg12, arg22);
      console.warn("[Monitor][" + arg2 + "] " + arg12 + ": " + arg22 + "，已提前结束 " + result + " 个等待中的页面指令");
      const result2 = String(arg2 || "");
      for (const [local, local2] of map.entries()) {
        const result3 = (Array.isArray(local2?.accounts) ? local2.accounts : []).some(arg1 => String(arg1?.id || arg1?.accountId || "") === result2);
        if (!result3) {
          continue;
        }
        fn15(local, "后台监控页异常（" + arg12 + "：" + arg22 + "），已结束 " + result + " 个等待中的页面指令，任务继续", "warning", {
          accountId: result2
        });
      }
    };
    value.on("unresponsive", () => {
      if (arg1.__radarMonitorUnhealthy || local) {
        return;
      }
      arg1.__radarMonitorUnresponsive = true;
      local = setTimeout(() => {
        local = null;
        if (arg1.isDestroyed() || !arg1.__radarMonitorUnresponsive) {
          return;
        }
        local3("monitor_renderer_unresponsive", "后台监控页持续无响应超过 " + Math.round(num12 / 1000) + " 秒");
      }, num12);
    });
    value.on("responsive", () => {
      arg1.__radarMonitorUnresponsive = false;
      local2();
    });
    value.on("render-process-gone", (arg1, options = {}) => {
      local2();
      const local = options.reason || "unknown";
      local3("monitor_renderer_gone", "后台监控渲染进程已退出（" + local + "）");
    });
    arg1.on("closed", () => {
      local2();
      fn37(value2, "monitor_window_closed", "后台监控窗口已关闭");
    });
  }
  function fn47(arg1) {
    try {
      if (!arg1 || arg1.isDestroyed()) {
        return 0;
      }
      const result = arg1.getOSProcessId();
      const result2 = app.getAppMetrics().find(arg1 => arg1.pid === result);
      return Math.round(Number(result2?.memory?.workingSetSize || 0) / 1024);
    } catch (error) {
      return 0;
    }
  }
  function fn90(arg1) {
    if (!arg1 || arg1.isDestroyed()) {
      return 0;
    }
    return fn47(arg1.webContents);
  }
  async function fn91(arg1, arg2) {
    const {
      facade: facade,
      viewKey: viewKey
    } = await result2.createMonitorAccountHost(arg1, arg2, {
      platform: "douyin"
    });
    facade.__radarMonitorViewKey = viewKey;
    facade.__radarMonitorActive = false;
    facade.__radarAllowVisibleMonitor = false;
    facade.__radarMonitorLastUsedAt = Date.now();
    facade.__radarMonitorProcessedVideos = 0;
    try {
      facade.setTitle("监控任务 - " + arg1);
    } catch (error) {}
    fn89(facade, arg1);
    facade.__radarMonitorAuthorPostCapture = createMonitorAuthorPostCapture(facade);
    const local = () => {
      try {
        facade.__radarMonitorAuthorPostCapture?.detachIfOwned?.();
      } catch (error) {}
      try {
        const local = facade.webContents?.debugger;
        if (local?.isAttached?.()) {
          local.detach();
        }
      } catch (error) {}
    };
    try {
      facade.webContents.setMaxListeners?.(32);
    } catch (error) {}
    try {
      facade.webContents.on("before-input-event", (arg1, arg2) => {
        if (!arg2 || arg2.type !== "keyDown") {
          return;
        }
        const result = String(arg2.key || "");
        const result2 = result.toLowerCase();
        const local2 = !!arg2.control || !!arg2.meta;
        const local3 = result === "F12" || local2 && arg2.alt && result2 === "i" || local2 && arg2.shift && result2 === "i";
        if (local3) {
          local();
        }
      });
    } catch (error) {}
    try {
      const value = facade.webContents;
      if (typeof value.openDevTools === "function" && !value.__radarMonitorDevToolsPatched) {
        const result = value.openDevTools.bind(value);
        value.openDevTools = (...restArgs) => {
          local();
          return result(...restArgs);
        };
        value.__radarMonitorDevToolsPatched = true;
      }
    } catch (error) {}
    facade.webContents.on("dom-ready", () => {
      fn33(facade);
      runtimeConfig?.ensureAndPushToWebContents?.(facade.webContents);
      try {
        const result = JSON.stringify(viewKey || "");
        facade.webContents.executeJavaScript("(() => {\n            try {\n              if (" + result + ") {\n                window.__radar_view_key = " + result + ";\n                sessionStorage.setItem('radar_view_key', " + result + ");\n              }\n            } catch (_) {}\n            return true;\n          })()", true).catch(() => {});
      } catch (error) {}
      automationLiveViewLifecycle?.wake?.(viewKey);
    });
    facade.webContents.on("did-finish-load", () => {
      automationLiveViewLifecycle?.wake?.(viewKey);
      try {
        requestAutomationLayoutRefresh?.();
      } catch (error) {}
    });
    return facade;
  }
  async function fn92(arg1, arg2) {
    if (!arg1 || arg1.isDestroyed?.()) {
      throw new Error("监控窗口已销毁");
    }
    if (arg1.__radarMonitorUnhealthy || arg1.webContents?.__radarMonitorUnhealthy) {
      const error = new Error("后台监控渲染进程状态异常");
      error.code = "monitor_renderer_unhealthy";
      throw error;
    }
    fn21(arg1, true);
    fn22(arg1);
    const value = typeof arg1.loadURL === "function" ? () => arg1.loadURL(arg2) : () => arg1.webContents.loadURL(arg2);
    let local = null;
    try {
      await Promise.race([value(), new Promise((arg1, arg2) => {
        local = setTimeout(() => {
          const error = new Error("页面加载超过 " + Math.round(num9 / 1000) + " 秒");
          error.code = "monitor_navigation_timeout";
          arg2(error);
        }, num9);
      })]);
    } catch (error) {
      if (error?.code === "monitor_navigation_timeout") {
        try {
          arg1.webContents.stop();
        } catch (error) {}
        throw error;
      }
      const result = String(error?.message || error || "");
      if (result.includes("ERR_ABORTED") || result.includes("ERR_FAILED") || /\(-3\)/.test(result)) {
        console.log("[Monitor] loadURL aborted/failed（已忽略）: " + String(arg2 || "").slice(0, 120));
      } else {
        throw error;
      }
    } finally {
      if (local) {
        clearTimeout(local);
      }
    }
    fn33(arg1);
    fn22(arg1);
    await fn(arg1.webContents);
  }
  async function fn93(arg1, arg2, arg3, arg4, arg5) {
    return result5.runMonitorProfileActionsInSubview(arg1, arg2, arg3, arg4, arg5, fn92);
  }
  async function fn94(arg1, arg2, arg3, text = "") {
    const result = String(arg1);
    const result2 = map6.get(result);
    const local = result2 || arg3;
    const result3 = fn25(local);
    if (local && !local.isDestroyed()) {
      try {
        local.destroy();
      } catch (error) {}
    }
    if (map6.get(result) === local) {
      map6.delete(result);
    }
    const result4 = await fn28(arg1, arg2, text);
    if (result3 && text) {
      try {
        await fn27({
          taskId: String(text),
          accountId: result
        });
      } catch (error) {}
    }
    return result4;
  }
  function fn95(arg1, arg2, text = "") {
    if (!arg1 || arg1.isDestroyed?.()) {
      return false;
    }
    const result = String(arg1.__radarMonitorViewKey || "").trim();
    const value = result && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result) : null;
    if (!value || value.webContents?.isDestroyed?.()) {
      return false;
    }
    const local = automationLiveViewLifecycle?.beginTask?.(result, {
      taskId: String(text || "monitor-host:" + arg2),
      runtimeTaskId: String(text || ""),
      accountId: String(arg2),
      taskMode: "video_monitor",
      videoMonitor: true
    });
    return local?.ok === true;
  }
  async function fn28(arg1, arg2, text = "") {
    const result = String(arg1);
    let result2 = map6.get(result);
    if (result2 && !result2.isDestroyed() && !result2.__radarMonitorUnhealthy) {
      const result = String(result2.__radarMonitorViewKey || "").trim();
      const value = result && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(result) : null;
      if (value?.webContents === result2.webContents && !value.webContents?.isDestroyed?.()) {
        fn95(result2, arg1, text);
        return result2;
      }
    }
    if (result2 && !result2.isDestroyed()) {
      const result3 = fn25(result2);
      try {
        result2.destroy();
      } catch (error) {}
      if (map6.get(result) === result2) {
        map6.delete(result);
      }
      result2 = await fn91(arg1, arg2);
      fn21(result2, true);
      map6.set(result, result2);
      result2.on("closed", () => {
        try {
          result2.__radarMonitorAuthorPostCapture?.dispose?.();
        } catch (error) {}
        if (map6.get(result) === result2) {
          map6.delete(result);
        }
      });
      fn95(result2, arg1, text);
      if (result3 && text) {
        try {
          await fn27({
            taskId: String(text),
            accountId: result
          });
        } catch (error) {}
      }
      return result2;
    }
    result2 = await fn91(arg1, arg2);
    fn21(result2, true);
    map6.set(result, result2);
    result2.on("closed", () => {
      try {
        result2.__radarMonitorAuthorPostCapture?.dispose?.();
      } catch (error) {}
      if (map6.get(result) === result2) {
        map6.delete(result);
      }
    });
    fn95(result2, arg1, text);
    return result2;
  }
  function fn96(arg1, num = 80) {
    const result = String(arg1 || "").replace(/\s+/g, " ").trim();
    if (result.length <= num) {
      return result;
    }
    return result.slice(0, num) + "…";
  }
  function fn97(num = 5000, num2 = 10000) {
    const result = Math.max(0, Math.min(Number(num) || 0, Number(num2) || 0));
    const result2 = Math.max(result, Math.max(Number(num) || 0, Number(num2) || 0));
    const value = result + Math.floor(Math.random() * (result2 - result + 1));
    return new Promise(arg1 => setTimeout(arg1, value)).then(() => value);
  }
  function fn98(arg1, arg2, arg3 = num13) {
    if (!arg1 || arg1.isDestroyed?.()) {
      const error = new Error("监控窗口已销毁");
      error.code = "monitor_window_closed";
      return Promise.reject(error);
    }
    const result = Math.max(2000, Number(arg3) || num13);
    return new Promise((arg12, arg22) => {
      let flag = false;
      const result2 = setTimeout(() => {
        if (flag) {
          return;
        }
        flag = true;
        const error = new Error("页面脚本超过 " + Math.round(result / 1000) + " 秒未返回");
        error.code = "monitor_javascript_timeout";
        arg22(error);
      }, result);
      Promise.resolve(arg1.executeJavaScript(arg2, true)).then(arg1 => {
        if (flag) {
          return;
        }
        flag = true;
        clearTimeout(result2);
        arg12(arg1);
      }).catch(arg1 => {
        if (flag) {
          return;
        }
        flag = true;
        clearTimeout(result2);
        arg22(arg1);
      });
    });
  }
  async function fn99(arg1, arg2) {
    const value = !arg1 || arg1.isDestroyed() ? "" : String(arg1.webContents.getURL() || "");
    const flag = isSameMonitorVideo(arg2, value);
    const obj = {
      sameVideo: flag,
      url: value,
      loading: false,
      panelOpen: false,
      commentItems: 0,
      networkError: false,
      blankPage: false
    };
    if (!arg1 || arg1.isDestroyed() || arg1.webContents.isDestroyed()) {
      return {
        ...obj,
        blankPage: true,
        sameVideo: false
      };
    }
    try {
      const result = await fn98(arg1.webContents, "(() => {\n        try {\n          const text = String(document.body?.innerText || '').replace(/\\s+/g, ' ').slice(0, 1600);\n          const networkError = /网络不太顺畅|网络异常|加载失败|请检查网络|刷新重试|连接超时|请求超时/.test(text);\n          const loadingText = /加载中|正在加载|请稍候|内容加载/.test(text);\n          let loadingEl = false;\n          try {\n            loadingEl = Array.from(document.querySelectorAll(\n              '[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]'\n            )).some((el) => {\n              const r = el.getBoundingClientRect();\n              return r.width >= 6 && r.height >= 6 && r.bottom > 0 && r.top < (window.innerHeight || 800);\n            });\n          } catch (_) { loadingEl = false; }\n          const panel = document.querySelector(\n            '[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-list\"], [class*=\"CommentList\"], [class*=\"comment-main\"]'\n          );\n          let panelOpen = false;\n          let commentItems = 0;\n          if (panel) {\n            const pr = panel.getBoundingClientRect();\n            panelOpen = pr.height > 60 && pr.width > 60;\n            try {\n              commentItems = panel.querySelectorAll(\n                '[data-e2e=\"comment-item\"], [class*=\"comment-item\"], [class*=\"CommentItem\"]'\n              ).length;\n            } catch (_) { commentItems = 0; }\n          }\n          const blankPage = !text || text.length < 8;\n          return {\n            loading: loadingText || loadingEl,\n            panelOpen,\n            commentItems,\n            networkError,\n            blankPage,\n            href: String(location.href || ''),\n          };\n        } catch (err) {\n          return {\n            loading: false,\n            panelOpen: false,\n            commentItems: 0,\n            networkError: false,\n            blankPage: true,\n            href: '',\n            error: String(err && err.message || err || ''),\n          };\n        }\n      })()");
      return {
        ...obj,
        sameVideo: isSameMonitorVideo(arg2, result?.href || value),
        url: result?.href || value,
        loading: !!result?.loading,
        panelOpen: !!result?.panelOpen,
        commentItems: Number(result?.commentItems) || 0,
        networkError: !!result?.networkError,
        blankPage: !!result?.blankPage
      };
    } catch (error) {
      return {
        ...obj,
        blankPage: true
      };
    }
  }
  function fn100(options = {}, text = "") {
    if (!options.sameVideo) {
      return {
        reload: true,
        reason: "当前页面已不是目标视频"
      };
    }
    if (options.blankPage && !options.panelOpen) {
      return {
        reload: true,
        reason: "页面几乎空白，可能加载失败"
      };
    }
    if (options.networkError && !options.panelOpen && options.commentItems <= 0) {
      return {
        reload: true,
        reason: "页面提示网络异常且评论区不可用"
      };
    }
    if (["comment_node_not_found", "like_button_not_found", "comment_like_failed", "reply_button_not_found", "reply_input_not_found", "target_comment_not_found"].includes(String(text || ""))) {
      return {
        reload: false,
        reason: options.loading ? "页面仍在加载，先等待网络恢复" : options.panelOpen ? "评论区仍在（可见 " + options.commentItems + " 条），先等待后原地重试" : "仍在目标视频页，先等待后原地重试"
      };
    }
    return {
      reload: false,
      reason: "仍在目标视频页，先等待后原地重试"
    };
  }
  async function fn101({
    win: win,
    taskId: taskId,
    videoItem: videoItem,
    commentCid = "",
    nickname = "",
    errorCode = "",
    actionLabel = "互动",
    runRetry: runRetry
  }) {
    const result = await fn99(win, videoItem?.url || "");
    const result2 = fn100(result, errorCode);
    if (result2.reload) {
      fn15(taskId, actionLabel + "首次未成功（" + (errorCode || "未知") + "）：" + result2.reason + "，将重载目标视频后再试 @" + (nickname || "用户"), "info");
      await fn92(win, resolveDouyinMonitorVideoUrl(videoItem.url, commentCid));
    } else {
      fn15(taskId, actionLabel + "首次未成功（" + (errorCode || "未知") + "）：" + result2.reason + "（加载中=" + (result.loading ? "是" : "否") + "，评论区=" + (result.panelOpen ? "开" : "关") + "，可见评论=" + result.commentItems + "），不重载页面", "info");
    }
    const result3 = await fn97(5000, 10000);
    fn15(taskId, actionLabel + "重试前已停留 " + (result3 / 1000).toFixed(1) + " 秒，开始第二次 @" + (nickname || "用户"), "info");
    fn22(win);
    return runRetry();
  }
  function fn102(arg1, text = "未知原因") {
    let local = arg1?.error || text;
    let local2 = arg1?.errorCode || "";
    const result = String(arg1?.diagnostic || "").trim();
    const local3 = !!arg1?.noWorks || local === "no_works" || local2 === "no_works";
    const local4 = local === "profile_works_not_ready" || local2 === "profile_works_not_ready";
    if (local3) {
      const obj = {
        tab_count_zero: "该用户主页作品数为 0，没有可评论的首作",
        empty_state: "该用户主页显示暂无作品，没有可评论的首作",
        empty_grid: "该用户主页作品列表为空，没有可评论的首作",
        empty_state_late: "等待后仍显示暂无作品，没有可评论的首作",
        timeout_empty: "等待作品区加载超时且未发现公开作品，没有可评论的首作",
        no_video_cards: "该用户主页未找到可打开的作品卡片，没有可评论的首作"
      };
      local = obj[result] || (local && local !== "no_works" ? String(local) : "该用户主页未发布公开作品，没有可评论的首作");
      local2 = "";
    } else if (local4) {
      const obj = {
        timeout_unknown: "用户主页作品区加载超时，尚未确认是否有公开作品（可重试）",
        aborted: "等待作品区加载时任务已停止",
        unknown: "用户主页作品区尚未加载完成，暂时无法评论首作（可重试）"
      };
      local = obj[result] || (local && local !== "profile_works_not_ready" ? String(local) : "用户主页作品区未就绪，暂时无法评论首作（可重试）");
      local2 = "";
    }
    const result2 = fn96(local, 120);
    const result3 = fn96(local2, 50);
    const value = local3 || local4 ? "" : fn96(arg1?.diagnostic || arg1?.detail || "", 180);
    return [result2, result3 ? "错误码=" + result3 : "", value ? "环境=" + value : ""].filter(Boolean).join("；");
  }
  function fn103(arg1) {
    return new Set(["target_comment_not_found", "reply_button_not_found", "reply_input_not_found"]).has(arg1?.errorCode);
  }
  function fn104(arg1, options = {}) {
    const result = String(options.videoTitle || "").trim();
    const result2 = String(arg1?.title || "").trim();
    const result3 = fn96(result || (result2 && result2 !== "手动添加" ? result2 : "") || result2 || "未知视频", 60);
    const result4 = String(options.videoUrl || arg1?.url || "").trim();
    const value = options.totalCount != null ? Number(options.totalCount) : null;
    return {
      title: result3,
      url: result4,
      totalCount: value
    };
  }
  function fn105(arg1, text = "") {
    const value = arg1.url ? " " + arg1.url : "";
    const value2 = Number.isFinite(arg1.totalCount) ? "，评论总数 " + arg1.totalCount : "";
    return "视频「" + arg1.title + "」" + value + value2 + text;
  }
  function fn106(arg1, options = {}) {
    const local = arg1?.nickname || "用户";
    const value = options.matched ? "命中" : "未命中";
    const value2 = options.matchType === "ai" ? "AI" : "关键词";
    const value3 = arg1?.text ? "「" + fn96(arg1.text, 60) + "」" : "「未解析到正文」";
    const value4 = options.reason ? "：" + fn96(options.reason, 100) : "";
    return "评论研判：@" + local + " " + value3 + " → " + value + "（" + value2 + "）" + value4;
  }
  function fn107(arg1, arg2) {
    const value = typeof isMonitorAiIntentJudgeEnabled === "function" ? isMonitorAiIntentJudgeEnabled(arg1) : arg1?.useAiJudge === true;
    if (value) {
      if (isMonitorAccountAiEnabled(arg1, arg2)) {
        return "账号绑定的 AI 智能体";
      } else {
        return "通用 AI（账号未绑定智能体）";
      }
    }
    const result = String(arg1?.keywords || "").split(/[,，]/).map(arg1 => arg1.trim()).filter(Boolean);
    const value2 = result.length > 0 ? "关键词匹配「" + fn96(result.join("、"), 80) + "」" : "关键词匹配（未设置关键词，所有新评论均视为命中）";
    return value2 + "；账号绑定智能体不参与意向判定";
  }
  function fn108(options = {}) {
    const value = typeof options === "string" ? options : options.url;
    const result = normalizeDouyinAuthorUrl(value);
    if (!result) {
      return null;
    }
    const obj = {
      url: result,
      name: String(options.name || options.nickname || options.title || "").trim()
    };
    if (options && options.invalid) {
      obj.invalid = true;
      if (options.invalidReason) {
        obj.invalidReason = String(options.invalidReason);
      }
      if (options.invalidAt) {
        obj.invalidAt = Number(options.invalidAt) || options.invalidAt;
      }
    }
    return obj;
  }
  function fn109(options = {}) {
    return getDouyinAuthorProfileKey(options.url || options);
  }
  function fn110(arg1, options = {}) {
    const result = fn109(arg1);
    const result2 = normalizeProcessedVideoKey(options.url || options.videoUrl || "");
    return result + "__" + (result2 || options.awemeId || options.id || "");
  }
  function fn111(arg1, arg2) {
    const result = normalizeProcessedVideoKey(arg2);
    return (arg1.videoUrls || []).some(arg1 => {
      const result2 = normalizeProcessedVideoKey(arg1?.url || "");
      if (result && result2) {
        return result === result2;
      } else {
        return String(arg1?.url || "") === String(arg2 || "");
      }
    });
  }
  function fn112(arg1, arg2, arg3) {
    if (!Array.isArray(arg1.videoUrls)) {
      arg1.videoUrls = [];
    }
    if (!arg3?.url || fn111(arg1, arg3.url)) {
      return false;
    }
    const local = arg3.authorName || arg2.name || "主播";
    const local2 = arg3.title || arg3.desc || local + "的新作品";
    arg1.videoUrls.push({
      url: arg3.url,
      title: local2,
      author: local,
      source: "author_latest",
      authorUrl: arg2.url,
      discoveredAt: Date.now()
    });
    return true;
  }
  function fn113(options = {}) {
    if (options.enableCommentImage && Array.isArray(options.commentImagePaths) && options.commentImagePaths.some(arg1 => String(arg1 || "").trim())) {
      return true;
    }
    if (options.enableCommentExpression) {
      return true;
    }
    if (options.enableCommentMention && String(options.commentMentionNicknames || "").trim()) {
      return true;
    }
    return false;
  }
  function fn114(text = "", options = {}) {
    const result = String(text || "").trim();
    if (result) {
      return result.slice(0, 40);
    }
    const list = [];
    if (options.enableCommentImage) {
      list.push("图片");
    }
    if (options.enableCommentExpression) {
      list.push("表情包");
    }
    if (options.enableCommentMention && String(options.commentMentionNicknames || "").trim()) {
      list.push("@账号");
    }
    if (list.length) {
      return "仅" + list.join("+");
    } else {
      return "（无正文）";
    }
  }
  async function fn115({
    taskId: taskId,
    accountId: accountId,
    account: account,
    config: config,
    videoItem: videoItem,
    videoProgressLabel: videoProgressLabel,
    win: win,
    isRuntimeActive: isRuntimeActive,
    monitorTasksApi: monitorTasksApi
  }) {
    if (!config.enableVideoComment) {
      return {
        skipped: true,
        reason: "disabled"
      };
    }
    if (!isRuntimeActive?.()) {
      return {
        skipped: true,
        reason: "stopped"
      };
    }
    const local = videoItem?.url || "";
    const local2 = extractDouyinVideoId(local) || local;
    if (accountHasVideoMainCommented(store, accountId, local)) {
      fn15(taskId, videoProgressLabel + " 视频主评：本账号已评论过此视频，跳过", "info");
      return {
        skipped: true,
        reason: "already_commented"
      };
    }
    const flag = hasMonitorVideoMainNonTextExtras(config);
    const value = config.enableVideoCommentWithoutText === true;
    let text = "";
    if (!value) {
      if (config.videoCommentMode === "ai" && isMonitorAccountAiEnabled(config, accountId)) {
        try {
          fn15(taskId, videoProgressLabel + " AI 生成视频主评文案…", "info");
          text = await generateMonitorPersonaContent(config, accountId, account, videoItem, {
            nickname: "观众",
            text: "请针对该视频发一条自然的主贴评论，不要像回复某条评论"
          }, {
            onRetry: (arg1, arg2) => {
              fn15(taskId, "AI 主评生成中（第 " + arg1 + " 次重试）" + (arg2 ? "：" + arg2 : ""), "info");
            }
          });
        } catch (error) {
          fn15(taskId, videoProgressLabel + " AI 主评文案失败：" + (error?.message || error) + "，改用固定模板", "warning");
          text = pickRandomTemplateLine(config.videoCommentContent);
        }
      } else {
        text = pickRandomTemplateLine(config.videoCommentContent);
        if (text && config.videoCommentUseRandomSuffix) {
          text = appendRandomEmojiSuffix(text);
        }
      }
    }
    if (!String(text || "").trim() && !flag && !value) {
      fn15(taskId, videoProgressLabel + " 视频主评：未配置文案或附带内容，已跳过", "warning");
      return {
        skipped: true,
        reason: "empty"
      };
    }
    const result = formatMonitorVideoMainCommentLogLabel(text, config);
    const result2 = await fn116({
      taskId: taskId,
      config: config,
      isRuntimeActive: isRuntimeActive,
      logPrefix: videoProgressLabel
    });
    if (!result2) {
      return {
        skipped: true,
        reason: "stopped"
      };
    }
    fn15(taskId, videoProgressLabel + " 正在发表视频主评…", "info");
    const result3 = await fn45(win.webContents, {
      requestId: taskId + "_mainc_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      ...buildMonitorVideoMainCommentExtras(config, {
        taskId: taskId,
        accountId: accountId,
        commentText: text,
        videoTitle: videoItem?.title || "",
        videoKey: local || local2,
        videoMainCommentedVideoIds: listAccountVideoMainCommentedIds(store, accountId)
      })
    }, 120000);
    if (result3?.success) {
      fn15(taskId, videoProgressLabel + " 已发表视频主评：" + result, "success");
      fn117({
        taskId: taskId,
        accountId: accountId,
        account: account,
        videoItem: videoItem,
        videoId: local2,
        content: result3.content || text,
        status: "success",
        monitorTasksApi: monitorTasksApi
      });
      return {
        success: true,
        content: result3.content || text
      };
    }
    if (result3?.skipped && result3?.reason === "already_commented") {
      fn15(taskId, videoProgressLabel + " 视频主评：本账号已评论过此视频，跳过", "info");
      return {
        skipped: true,
        reason: "already_commented"
      };
    }
    fn15(taskId, videoProgressLabel + " 视频主评失败：" + (result3?.error || "未完成"), "warning");
    fn117({
      taskId: taskId,
      accountId: accountId,
      account: account,
      videoItem: videoItem,
      videoId: local2,
      content: text,
      status: "failed",
      error: result3?.error || "video_main_comment_failed",
      monitorTasksApi: monitorTasksApi
    });
    return {
      success: false,
      error: result3?.error || "video_main_comment_failed"
    };
  }
  function fn117({
    taskId: taskId,
    accountId: accountId,
    account: account,
    videoItem: videoItem,
    videoId: videoId,
    content: content,
    status: status,
    error = "",
    monitorTasksApi: monitorTasksApi
  }) {
    if (!taskId || !monitorTasksApi?.appendVideoCommentRecords) {
      return;
    }
    try {
      monitorTasksApi.appendVideoCommentRecords(taskId, [{
        ts: Date.now(),
        accountId: accountId || "",
        accountName: account?.nickname || account?.name || "",
        videoUrl: videoItem?.url || "",
        videoTitle: videoItem?.title || "",
        videoId: videoId || extractDouyinVideoId(videoItem?.url || "") || "",
        content: content || "",
        status: status,
        error: error
      }]);
      fn81(taskId, {
        type: "video-comments-update",
        ts: Date.now()
      });
    } catch (error) {
      fn15(taskId, "视频主评记录落盘失败：" + (error?.message || error), "warning");
    }
  }
  async function fn118(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    const result = isMonitorAccountAiEnabled(arg3, arg2);
    const local = arg12 => (arg13, arg2) => {
      fn15(arg1, "AI " + arg12 + "生成中（第 " + arg13 + " 次重试）" + (arg2 ? "：" + arg2 : ""), "info");
    };
    let result2 = (arg7.replyContent || "").trim();
    let text = "";
    const value = arg3.enableAutoReply === true;
    const value2 = arg3.enableAutoFollow === true;
    const value3 = arg3.enableAutoLike === true;
    const value4 = arg3.enableAutoDM === true;
    const local2 = value && fn7(arg1, "reply", arg2);
    const local3 = value2 && fn7(arg1, "follow", arg2);
    const local4 = value3 && fn7(arg1, "like", arg2);
    const local5 = value4 && fn7(arg1, "dm", arg2);
    const result3 = fn113(arg3);
    const value5 = arg3.enableCommentWithoutText === true;
    if (local2) {
      if (value5) {
        result2 = "";
      } else if (arg3.replyMode === "ai" && result) {
        if (!result2) {
          fn15(arg1, "AI 生成回复文案 @" + (arg5.nickname || "用户") + "…", "info");
          result2 = await generateMonitorPersonaContent(arg3, arg2, arg6, arg4, arg5, {
            forDm: false,
            onRetry: local("回复")
          });
        }
      } else {
        result2 = pickRandomTemplateLine(arg3.replyTemplate);
        if (result2 && arg3.commentUseRandomSuffix) {
          result2 = appendRandomEmojiSuffix(result2);
        }
      }
    }
    if (local5) {
      if (arg3.dmMode === "ai" && result) {
        fn15(arg1, "AI 生成私信文案 @" + (arg5.nickname || "用户") + "…", "info");
        text = await generateMonitorPersonaContent(arg3, arg2, arg6, arg4, arg5, {
          forDm: true,
          onRetry: local("私信")
        });
      } else {
        text = pickRandomTemplateLine(arg3.dmTemplate) || result2;
      }
    }
    const flag = !!String(result2 || "").trim();
    const local6 = !flag && (value5 || result3) && result3;
    return {
      ...arg7,
      replyContent: result2,
      dmContent: text,
      shouldFollow: value2,
      shouldLike: value3,
      shouldReply: value && (flag || local6),
      shouldDM: value4 && !!text.trim(),
      allowEmptyReplyText: local6
    };
  }
  async function fn119(arg1, arg2, arg3, arg4, arg5, arg6) {
    return analyzeMonitorCommentsBatch(arg3, arg2, arg5, arg4, arg6, {
      onLog: arg12 => fn15(arg1, arg12, "info"),
      onRetry: (arg12, arg2) => {
        fn15(arg1, "AI 批量研判重试（第 " + arg12 + " 次）" + (arg2 ? "：" + arg2 : ""), "warning");
      }
    });
  }
  async function fn120(arg1, arg2) {
    const value = Array.isArray(arg2?.videoUrls) ? arg2.videoUrls : [];
    const result = value.map(arg1 => String(arg1?.url || "").trim());
    const list = [];
    const list2 = [];
    result.forEach((arg1, arg2) => {
      if (!arg1) {
        return;
      }
      if (toCanonicalDouyinVideoUrl(arg1)) {
        return;
      }
      if (/v\.douyin\.com/i.test(arg1) || /iesdouyin\.com\/share/i.test(arg1)) {
        list.push(arg2);
        list2.push(arg1);
      }
    });
    let local = list2;
    if (list2.length > 0) {
      try {
        local = await resolveDouyinShareUrls(list2);
      } catch (error) {
        local = list2;
      }
    }
    const map = new Map();
    list.forEach((arg1, arg2) => {
      map.set(arg1, String(local[arg2] || result[arg1]).trim() || result[arg1]);
    });
    const list3 = [];
    const set = new Set();
    for (let num = 0; num < value.length; num += 1) {
      const value2 = value[num];
      const value3 = result[num];
      if (!value3) {
        continue;
      }
      const local = map.get(num) || value3;
      const local2 = toCanonicalDouyinVideoUrl(local) || local;
      const result2 = extractDouyinVideoId(local2);
      if (result2 && set.has(result2)) {
        continue;
      }
      if (result2) {
        set.add(result2);
      }
      if (local2 !== value3) {
        fn15(arg1, "视频链接已解析：" + value3 + " → " + local2, "info");
      }
      list3.push({
        ...value2,
        url: local2
      });
    }
    arg2.videoUrls = list3;
  }
  function fn121(arg1, text = "") {
    const result = String(text || "").trim().toLowerCase();
    if (!result) {
      return false;
    }
    if (/timeout|未就绪|soft/.test(result)) {
      return false;
    }
    if (/bare_jingxuan/.test(result)) {
      return false;
    }
    const result2 = String(arg1?.source || "").trim();
    if (result2 === "author_latest") {
      return false;
    }
    if (arg1?.authorUrl) {
      return false;
    }
    return /unavailable/.test(result);
  }
  function fn122(arg1, arg2, arg3, text = "user_not_found") {
    if (!arg2 || !arg3?.url) {
      return false;
    }
    if (!Array.isArray(arg2.authorUrls)) {
      arg2.authorUrls = [];
    }
    const local = String(text || "user_not_found").trim() || "user_not_found";
    const result = fn109(arg3);
    let flag = false;
    arg2.authorUrls = arg2.authorUrls.map(arg1 => {
      const result2 = fn109(arg1);
      const local2 = result && result2 && result === result2 || String(arg1?.url || "").trim() === String(arg3.url || "").trim();
      if (!local2) {
        return arg1;
      }
      if (arg1.invalid && String(arg1.invalidReason || "") === local) {
        return arg1;
      }
      flag = true;
      return {
        ...arg1,
        invalid: true,
        invalidReason: local,
        invalidAt: Date.now()
      };
    });
    if (!flag) {
      const result = fn108({
        ...arg3,
        invalid: true,
        invalidReason: local,
        invalidAt: Date.now()
      });
      if (result && !arg2.authorUrls.some(arg1 => fn109(arg1) === fn109(result))) {
        arg2.authorUrls.push(result);
        flag = true;
      }
    }
    if (!flag) {
      return false;
    }
    try {
      const local = map.get(arg1)?.monitorTasksApi;
      local?.patchTask?.(arg1, {
        configSnapshot: {
          ...arg2
        }
      });
      fn81(arg1, {
        type: "config-update",
        ts: Date.now()
      });
    } catch (error) {}
    const local2 = String(arg3.name || "").trim() || "主播主页";
    fn15(arg1, "已标记主页失效（后续轮询跳过）：「" + local2 + "」 " + arg3.url + " — " + formatMonitorInvalidReason(local), "warning");
    return true;
  }
  async function fn123(arg1, {
    timeoutMs = 10000,
    isActive = () => true
  } = {}) {
    if (!arg1?.webContents || arg1.isDestroyed?.() || arg1.webContents.isDestroyed?.()) {
      return {
        gone: false,
        reason: "no_window"
      };
    }
    const value = Date.now() + Math.max(3000, Number(timeoutMs) || 10000);
    let num = 0;
    let num2 = 0;
    while (Date.now() < value && isActive()) {
      let obj = {
        gone: false,
        reason: "unknown"
      };
      try {
        obj = await fn98(arg1.webContents, "\n          (() => {\n            try {\n              const href = String(location.href || '');\n              if (!href.includes('/user/')) return { gone: false, reason: 'not_profile' };\n              const body = document.body;\n              if (!body) return { gone: false, reason: 'no_body' };\n              const errEl = document.querySelector('[data-e2e=\"error-page\"], .Ms08YIEh');\n              const text = String(body.innerText || body.textContent || '');\n              const hasProfileFrame = /抖音号|获赞|粉丝|关注|作品|喜欢/.test(text);\n              const goneText = /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(text);\n              if (errEl || (!hasProfileFrame && goneText)) {\n                return { gone: true, reason: 'user_not_found' };\n              }\n              if (hasProfileFrame) return { gone: false, reason: 'ok' };\n              return { gone: false, reason: 'unknown' };\n            } catch (_) {\n              return { gone: false, reason: 'probe_error' };\n            }\n          })()\n        ");
      } catch (error) {
        obj = {
          gone: false,
          reason: "probe_failed"
        };
      }
      if (obj?.gone) {
        num += 1;
        num2 = 0;
        if (num >= 3) {
          return {
            gone: true,
            reason: obj.reason || "user_not_found"
          };
        }
      } else if (obj?.reason === "ok") {
        num2 += 1;
        num = 0;
        if (num2 >= 2) {
          return {
            gone: false,
            reason: "ok"
          };
        }
      } else {
        num = 0;
      }
      await new Promise(arg1 => setTimeout(arg1, 400));
    }
    return {
      gone: false,
      reason: "timeout"
    };
  }
  function fn124(arg1, arg2, arg3, text = "unavailable") {
    if (!arg2 || !arg3?.url) {
      return false;
    }
    if (!fn121(arg3, text)) {
      return false;
    }
    if (!Array.isArray(arg2.videoUrls)) {
      arg2.videoUrls = [];
    }
    const local = String(text || "unavailable").trim() || "unavailable";
    let flag = false;
    arg2.videoUrls = arg2.videoUrls.map(arg1 => {
      if (!monitorVideoItemsMatch(arg1, arg3)) {
        return arg1;
      }
      if (arg1.invalid && String(arg1.invalidReason || "") === local) {
        return arg1;
      }
      flag = true;
      return {
        ...arg1,
        invalid: true,
        invalidReason: local,
        invalidAt: Date.now()
      };
    });
    if (!flag) {
      if (!arg2.videoUrls.some(arg1 => monitorVideoItemsMatch(arg1, arg3))) {
        arg2.videoUrls.push({
          url: String(arg3.url || "").trim(),
          title: String(arg3.title || "").trim() || "手动添加",
          source: arg3.source || undefined,
          invalid: true,
          invalidReason: local,
          invalidAt: Date.now()
        });
        flag = true;
      }
    }
    if (!flag) {
      return false;
    }
    try {
      const local = map.get(arg1)?.monitorTasksApi;
      local?.patchTask?.(arg1, {
        configSnapshot: {
          ...arg2
        }
      });
      fn81(arg1, {
        type: "config-update",
        ts: Date.now()
      });
    } catch (error) {}
    const local2 = String(arg3.title || "").trim() || "视频";
    const result = formatMonitorInvalidReason(local);
    fn15(arg1, "已标记失效（后续轮询跳过）：「" + local2 + "」 " + arg3.url + " — " + result, "warning");
    return true;
  }
  async function fn125(arg1, arg2) {
    const value = Array.isArray(arg2?.authorUrls) ? arg2.authorUrls : [];
    const list = [];
    const result = value.map(arg1 => {
      const result = String(arg1?.url || arg1 || "").trim();
      if (!result) {
        return {
          item: arg1,
          raw: "",
          resolved: ""
        };
      }
      if (isDouyinAuthorProfileUrl(result)) {
        return {
          item: arg1,
          raw: result,
          resolved: normalizeDouyinAuthorUrl(result)
        };
      }
      if (/v\.douyin\.com/i.test(result) || /iesdouyin\.com\/share/i.test(result)) {
        list.push(result);
        return {
          item: arg1,
          raw: result,
          resolved: ""
        };
      }
      return {
        item: arg1,
        raw: result,
        resolved: ""
      };
    });
    let map = new Map();
    if (list.length > 0) {
      try {
        const list2 = [...new Set(list)];
        const result = await resolveDouyinShareUrls(list2);
        list2.forEach((arg1, arg2) => {
          map.set(arg1, String(result[arg2] || arg1).trim() || arg1);
        });
      } catch (error) {
        map = new Map();
      }
    }
    const list2 = [];
    for (const item of result) {
      if (!item.raw) {
        continue;
      }
      const local = item.resolved || map.get(item.raw) || item.raw;
      const result = fn108({
        ...item.item,
        url: local
      });
      if (!result) {
        continue;
      }
      if (!list2.some(arg1 => fn109(arg1) === fn109(result))) {
        list2.push(result);
        if (result.url !== item.raw) {
          fn15(arg1, "主播链接已规范化：" + item.raw + " → " + result.url, "info");
        }
      }
    }
    arg2.authorUrls = list2;
  }
  async function fn126({
    taskId: taskId,
    accountId: accountId,
    account: account,
    authorItem: authorItem,
    config: config,
    isRuntimeActive = () => map.has(taskId),
    win: win = null
  }) {
    const result = Math.max(1, Math.min(Number(config.maxAuthorWorksPerCheck) || 6, 20));
    const value = config.filterPinnedAuthorWorks === true;
    let local = win || (await fn28(accountId, account.proxy, taskId));
    if (!local.__radarMonitorAuthorPostCapture) {
      local.__radarMonitorAuthorPostCapture = createMonitorAuthorPostCapture(local);
    }
    fn15(taskId, "正在打开主播主页：" + (authorItem.name || authorItem.url) + "（将处理最新 " + result + " 条作品" + (value ? "，已过滤置顶" : "") + "）", "info", {
      accountId: accountId
    });
    try {
      await local.__radarMonitorAuthorPostCapture.begin({
        maxWorks: result,
        authorName: authorItem.name || "",
        secUid: fn109(authorItem) || "",
        filterPinned: value
      });
    } catch (error) {}
    try {
      let obj = {
        works: [],
        hasPostListPayload: false,
        authorName: "",
        worksCount: null
      };
      const result2 = fn92(local, authorItem.url).then(() => ({
        kind: "loaded",
        ok: true
      })).catch(arg1 => ({
        kind: "loaded",
        ok: false,
        error: arg1
      }));
      const result3 = local.__radarMonitorAuthorPostCapture.waitForWorks({
        timeoutMs: 7000,
        isActive: isRuntimeActive
      }).then(arg1 => ({
        kind: "capture",
        snapshot: arg1
      })).catch(() => ({
        kind: "capture",
        snapshot: null
      }));
      const result4 = await Promise.race([result2, result3]);
      const value2 = result4?.kind === "capture" ? result4.snapshot : null;
      const local2 = !!value2?.hasPostListPayload || !!Array.isArray(value2?.works) && !!(value2.works.length > 0);
      if (local2) {
        obj = value2;
      } else {
        const value = result4?.kind === "loaded" ? result4 : await result2;
        if (!value?.ok) {
          throw value?.error || new Error("主播主页加载失败");
        }
      }
      if (!isRuntimeActive()) {
        return {
          win: local,
          works: [],
          authorLabel: authorItem.name || authorItem.url,
          maxWorks: result,
          error: "stopped"
        };
      }
      if (!local2) {
        const result2 = await fn123(local, {
          timeoutMs: 10000,
          isActive: isRuntimeActive
        });
        if (!isRuntimeActive()) {
          return {
            win: local,
            works: [],
            authorLabel: authorItem.name || authorItem.url,
            maxWorks: result,
            error: "stopped"
          };
        }
        if (result2.gone) {
          const local2 = result2.reason || "user_not_found";
          fn15(taskId, "主播主页已失效：" + (authorItem.name || authorItem.url) + "（" + formatMonitorInvalidReason(local2) + "）", "warning", {
            accountId: accountId
          });
          try {
            fn122(taskId, config, authorItem, local2);
          } catch (error) {}
          return {
            win: local,
            works: [],
            authorLabel: authorItem.name || authorItem.url,
            maxWorks: result,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
        try {
          obj = (await local.__radarMonitorAuthorPostCapture.waitForWorks({
            timeoutMs: 10000,
            isActive: isRuntimeActive
          })) || obj;
        } catch (error) {}
      }
      if (!isRuntimeActive()) {
        return {
          win: local,
          works: [],
          authorLabel: authorItem.name || authorItem.url,
          maxWorks: result,
          error: "stopped"
        };
      }
      if (!obj.hasPostListPayload && (!Array.isArray(obj.works) || obj.works.length === 0)) {
        const result2 = await fn123(local, {
          timeoutMs: 4000,
          isActive: isRuntimeActive
        });
        if (result2.gone) {
          const local2 = result2.reason || "user_not_found";
          fn15(taskId, "主播主页已失效：" + (authorItem.name || authorItem.url) + "（" + formatMonitorInvalidReason(local2) + "）", "warning", {
            accountId: accountId
          });
          try {
            fn122(taskId, config, authorItem, local2);
          } catch (error) {}
          return {
            win: local,
            works: [],
            authorLabel: authorItem.name || authorItem.url,
            maxWorks: result,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
      }
      const local3 = obj.hasPostListPayload || Array.isArray(obj.works) && obj.works.length > 0;
      if (local3) {
        if (obj.authorName && !authorItem.name) {
          authorItem.name = obj.authorName;
        }
        const local2 = obj.authorName || authorItem.name || authorItem.url;
        const result2 = (obj.works || []).filter(arg1 => arg1?.url).slice(0, result);
        fn15(taskId, result2.length > 0 ? "已获取主播最新 " + result2.length + " 条作品：" + local2 : "主播主页暂无作品：" + local2, "info", {
          accountId: accountId
        });
        return {
          win: local,
          works: result2,
          authorLabel: local2,
          maxWorks: result,
          authorName: obj.authorName || authorItem.name || "",
          source: "author_post_api"
        };
      }
      const result5 = await fn48(local.webContents, {
        requestId: taskId + "_author_" + Date.now() + "_" + Math.random().toString(36).slice(2),
        maxWorks: result,
        authorUrl: authorItem.url,
        filterPinned: value
      }, 45000);
      if (!result5?.success || !Array.isArray(result5.works)) {
        const result2 = String(result5?.errorCode || result5?.reason || "").trim();
        const local2 = result5?.error || "未获取到作品列表";
        const local3 = result2 === "USER_NOT_FOUND" || result2 === "user_not_found" || /用户不存在|无此用户|主页链接失效/i.test(local2);
        if (local3) {
          fn15(taskId, "主播主页已失效：" + (authorItem.name || authorItem.url) + "（" + formatMonitorInvalidReason(result2 || local2) + "）", "warning", {
            accountId: accountId
          });
          try {
            fn122(taskId, config, authorItem, "user_not_found");
          } catch (error) {}
          return {
            win: local,
            works: [],
            authorLabel: authorItem.name || authorItem.url,
            maxWorks: result,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
        fn15(taskId, "主播主页检查失败：" + (authorItem.name || authorItem.url) + "（" + local2 + "）", "warning", {
          accountId: accountId
        });
        return {
          win: local,
          works: [],
          authorLabel: authorItem.name || authorItem.url,
          maxWorks: result,
          error: local2
        };
      }
      if (result5.authorName && !authorItem.name) {
        authorItem.name = result5.authorName;
      }
      const local4 = result5.authorName || authorItem.name || authorItem.url;
      const result6 = result5.works.filter(arg1 => arg1?.url).slice(0, result);
      return {
        win: local,
        works: result6,
        authorLabel: local4,
        maxWorks: result,
        authorName: result5.authorName || authorItem.name || "",
        source: "author_post_dom"
      };
    } finally {
      try {
        local.__radarMonitorAuthorPostCapture?.detachIfOwned?.();
      } catch (error) {}
    }
  }
  async function fn127({
    taskId: taskId,
    accountId: accountId,
    account: account,
    authorItem: authorItem,
    authorIndex: authorIndex,
    authorTotal: authorTotal,
    config: config,
    accounts: accounts,
    monitorTasksApi: monitorTasksApi,
    isRuntimeActive: isRuntimeActive,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    counters: counters,
    monitorTaskName: monitorTaskName,
    win: win2,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    let local = win2;
    if (!isRuntimeActive() || !authorItem?.url) {
      return {
        win: local,
        processedVideos: 0,
        discovered: 0
      };
    }
    const result = fn109(authorItem);
    const flag = !fn59(taskId, result);
    const value = "[主播 " + (authorIndex + 1) + "/" + authorTotal + "]";
    let num = 0;
    let num2 = 0;
    try {
      const result2 = await fn126({
        taskId: taskId,
        accountId: accountId,
        account: account,
        authorItem: authorItem,
        config: config,
        isRuntimeActive: isRuntimeActive,
        win: local
      });
      local = result2.win;
      if (!isRuntimeActive()) {
        return {
          win: local,
          processedVideos: num2,
          discovered: num
        };
      }
      if (result2.error && (!result2.works || result2.works.length === 0)) {
        return {
          win: local,
          processedVideos: num2,
          discovered: num
        };
      }
      const {
        works: works,
        authorLabel: authorLabel,
        maxWorks: maxWorks,
        authorName: authorName
      } = result2;
      const value2 = config.filterPinnedAuthorWorks === true;
      const result3 = fn56(taskId);
      const list = [...result3];
      const list2 = [];
      works.forEach(arg1 => {
        const result = fn110(authorItem, arg1);
        if (!result) {
          return;
        }
        const local = result3.includes(result) || list.includes(result);
        if (!list.includes(result)) {
          list.push(result);
        }
        if (!flag && !local) {
          list2.push(arg1);
          num += 1;
        }
      });
      fn57(taskId, list);
      if (flag) {
        fn60(taskId, result);
        fn15(taskId, value + " " + authorLabel + " 首次检查：最新 " + works.length + " 条作品将建立评论基线（首跑不自动回复）", works.length > 0 ? "success" : "warning", {
          accountId: accountId
        });
      } else if (list2.length > 0) {
        list2.forEach(arg1 => {
          fn15(taskId, value + " 发现新作品：" + (arg1.title || arg1.url), "success", {
            accountId: accountId
          });
        });
      } else {
        fn15(taskId, value + " " + authorLabel + " 暂无新作品，继续处理最新 " + works.length + " 条评论", "info", {
          accountId: accountId
        });
      }
      if (num > 0) {
        try {
          monitorTasksApi?.incrementStats?.(taskId, {
            newWorks: num
          });
        } catch (error) {}
        fn84(taskId, {
          newWorks: num
        }, {
          emit: true
        });
      }
      const result5 = Math.max(0, Math.min(maxWorks, works.length || 0));
      if (result5 < maxWorks) {
        fn15(taskId, value + " " + authorLabel + " 主页实际 " + result5 + " 条作品（配置每次 " + maxWorks + " 条），只处理这些，不链切进推荐流", "info", {
          accountId: accountId
        });
      }
      if (result5 === 0) {
        return {
          win: local,
          processedVideos: num2,
          discovered: num
        };
      }
      let flag2 = false;
      const result6 = resolveMonitorExpectedAuthor({
        source: "author_latest",
        authorUrl: authorItem.url
      });
      for (let num = 0; num < result5; num += 1) {
        if (!isRuntimeActive()) {
          break;
        }
        const local2 = result5;
        let obj = {
          url: "",
          title: (authorName || authorItem.name || "主播") + "的作品",
          author: authorName || authorItem.name || "主播",
          source: "author_latest",
          authorUrl: authorItem.url,
          discoveredAt: Date.now()
        };
        if (num === 0) {
          fn15(taskId, value2 ? value + " 从主页点击首个非置顶作品…" : value + " 从主页点击第 1 条作品…", "info", {
            accountId: accountId
          });
          try {
            fn23(local);
          } catch (error) {}
          const result = await result4.openAuthorWork(local.webContents, {
            taskId: taskId,
            authorUrl: authorItem.url,
            preferFirstCard: true,
            skipPinnedCards: value2,
            knownHasWorks: true,
            allowUrlFallback: false,
            timeoutMs: 50000
          });
          if (!result?.ok) {
            fn15(taskId, value + " 未能从主页点开作品（" + (result?.reason || result?.error || "unknown") + (result?.debug ? "｜" + result.debug : "") + "），停止本博主（不改用链接/推荐流）", "warning", {
              accountId: accountId
            });
            break;
          }
          if (result.videoUrl) {
            obj.url = result.videoUrl;
          }
          flag2 = result.reason !== "opened_via_jingxuan_modal_id";
        } else if (flag2 && result4.canContinueAuthorFeed(local)) {
          fn15(taskId, value + " 点击下一条 [" + (num + 1) + "/" + local2 + "]…", "info", {
            accountId: accountId
          });
          const result = await result4.moveNextAuthorWork(local.webContents, {
            taskId: taskId,
            requireMatch: false
          });
          if (!result?.ok || !result.switched) {
            fn15(taskId, value + " 没有更多本博主作品可切（" + (result?.reason || result?.error || "unknown") + "），结束本博主", "info", {
              accountId: accountId
            });
            break;
          }
          if (result.videoUrl) {
            obj.url = result.videoUrl;
          }
        } else {
          fn15(taskId, value + " 已不在本博主作品流，停止后续作品", "warning", {
            accountId: accountId
          });
          break;
        }
        if (result6.secUid) {
          let obj2 = {
            matched: false
          };
          try {
            obj2 = await result4.confirmAuthor(local.webContents, {
              taskId: taskId,
              videoUrl: obj.url,
              expectedAuthorUrl: result6.url,
              expectedSecUid: result6.secUid,
              timeoutMs: 6000
            });
          } catch (error) {
            obj2 = {
              matched: false
            };
          }
          const result = classifyDouyinAuthorIdentity(obj2.secUid || obj2.authorUrl || obj2.pageUrl, result6.secUid || result6.url);
          if (result.foreign || obj2.authorMismatch) {
            fn15(taskId, value + " 当前作品不是目标博主，停止本博主后续作品（对齐指定博主，避免推荐流）", "warning", {
              accountId: accountId
            });
            break;
          }
        }
        fn15(taskId, value + " 开始处理作品 [" + (num + 1) + "/" + local2 + "] " + fn105(fn104(obj), "…"), "info", {
          accountId: accountId
        });
        const result = await fn128({
          taskId: taskId,
          accountId: accountId,
          account: account,
          config: config,
          videoItem: obj,
          videoIndex: num,
          videoTotal: local2,
          accounts: accounts,
          monitorTasksApi: monitorTasksApi,
          isRuntimeActive: isRuntimeActive,
          seenKeys: seenKeys,
          updatedSeenKeys: updatedSeenKeys,
          seenKeySet: seenKeySet,
          counters: counters,
          monitorTaskName: monitorTaskName,
          win: local,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet,
          navigateMode: "skip"
        });
        local = result?.win || local;
        if (result?.authorMismatch) {
          fn15(taskId, value + " 采集中发现已离开目标博主，停止本博主后续作品", "warning", {
            accountId: accountId
          });
          break;
        }
        flag2 = !!local && !local.isDestroyed?.() && !local.__radarMonitorUnhealthy && !!result4.canContinueAuthorFeed(local);
        num2 += 1;
      }
    } catch (error) {
      fn15(taskId, value + " 主播主页处理异常：" + (error?.message || error), "error", {
        accountId: accountId
      });
    }
    return {
      win: local,
      processedVideos: num2,
      discovered: num
    };
  }
  function fn129(arg1, arg2, arg3 = MONITOR_MAX_COMMENTS) {
    const list = [];
    const set = new Set();
    [...(arg1 || []), ...(arg2 || [])].forEach(arg1 => {
      if (!arg1 || !arg1.nickname || !arg1.text || list.length >= arg3) {
        return;
      }
      const value = arg1.nickname + "__" + arg1.text;
      if (set.has(value)) {
        return;
      }
      set.add(value);
      list.push(arg1);
    });
    return list;
  }
  async function fn130({
    taskId: taskId,
    account: account,
    initialWindow: initialWindow,
    videoUrl: videoUrl,
    loadUrl: loadUrl,
    videoProgressLabel: videoProgressLabel,
    chunkSize = 0,
    initialComments = [],
    initialResumeState = null,
    expectedAuthorUrl = "",
    expectedSecUid = "",
    scrapeDeadlineAt = null,
    isRuntimeActive = () => map.has(taskId)
  }) {
    const result = Date.now();
    const value = Number.isFinite(Number(scrapeDeadlineAt)) ? Number(scrapeDeadlineAt) : result + num10;
    let local = initialWindow;
    let value2 = Array.isArray(initialComments) ? [...initialComments] : [];
    let value3 = initialResumeState && typeof initialResumeState === "object" ? {
      ...initialResumeState
    } : null;
    let num = 0;
    while (isRuntimeActive()) {
      const value4 = value - Date.now();
      if (value4 <= 15000) {
        if (value2.length > 0) {
          return {
            win: local,
            result: {
              success: true,
              partialDueToDeadline: true,
              partialChunk: false,
              capped: false,
              comments: value2,
              resumeState: value3,
              elapsedMs: Date.now() - result
            }
          };
        }
        return {
          win: local,
          result: {
            success: false,
            error: "评论页面抓取超过 " + Math.round(num10 / 1000) + " 秒",
            errorCode: "monitor_scrape_page_timeout",
            comments: value2,
            resumeState: value3,
            elapsedMs: Date.now() - result
          }
        };
      }
      const local2 = num < num7 && value4 > num21;
      const value5 = taskId + "_scrape_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const result2 = await fn46(local.webContents, {
        requestId: value5,
        maxComments: MONITOR_MAX_COMMENTS,
        chunkSize: Number(chunkSize) > 0 ? Number(chunkSize) : 0,
        targetVideoUrl: videoUrl,
        expectedAuthorUrl: expectedAuthorUrl,
        expectedSecUid: expectedSecUid,
        scrapePageTimeoutMs: value4,
        resumeComments: value2,
        resumeState: value3,
        allowResourceCheckpoint: local2
      }, Math.min(num11, value4 + 30000));
      if (isMonitorScrapeIdentityMismatch(result2)) {
        return {
          win: local,
          result: {
            ...result2,
            comments: [],
            resumeState: null,
            elapsedMs: Date.now() - result
          }
        };
      }
      value2 = fn129(value2, result2?.comments, MONITOR_MAX_COMMENTS);
      if (result2?.resumeState && typeof result2.resumeState === "object") {
        value3 = result2.resumeState;
      }
      if (!result2?.resourceCheckpoint) {
        return {
          win: local,
          result: {
            ...result2,
            comments: value2,
            resumeState: value3,
            partialChunk: !!result2?.partialChunk,
            elapsedMs: Date.now() - result
          }
        };
      }
      num += 1;
      fn15(taskId, videoProgressLabel + " 设备降载保护：渲染内存 " + (result2.rendererMemoryMb || "偏高") + "MB，已保存 " + value2.length + " 条评论进度；正在重建后台页面并继续当前视频（" + num + "/" + num7 + "）", "info");
      if (!isRuntimeActive()) {
        const result = String(account.id);
        if (map6.get(result) === local) {
          map6.delete(result);
        }
        try {
          if (local && !local.isDestroyed()) {
            local.destroy();
          }
        } catch (error) {}
        local = null;
        break;
      }
      local = await fn94(account.id, account.proxy, local, taskId);
      await fn92(local, loadUrl);
      try {
        await result4.waitVideoReady(local.webContents, {
          taskId: taskId,
          videoUrl: loadUrl || videoUrl,
          timeoutMs: 15000
        });
      } catch (error) {
        await new Promise(arg1 => setTimeout(arg1, 1500));
      }
    }
    return {
      win: local,
      result: {
        success: false,
        error: "监控任务已停止",
        errorCode: "monitor_task_stopped",
        comments: value2,
        resumeState: value3,
        partialChunk: false,
        elapsedMs: Date.now() - result
      }
    };
  }
  async function fn131({
    taskId: taskId,
    accountId: accountId,
    account: account,
    config: config,
    videoItem: videoItem,
    batchComments: batchComments,
    win: win,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    skipContext: skipContext,
    monitorTaskName: monitorTaskName,
    monitorTasksApi: monitorTasksApi,
    isRuntimeActive: isRuntimeActive,
    videoProgressLabel: videoProgressLabel,
    videoCtx: videoCtx,
    batchLabel: batchLabel,
    accumulatedCount: accumulatedCount,
    videoStartedAt: videoStartedAt,
    counters: counters,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const result = fn80({
      comments: batchComments,
      videoUrl: videoItem.url,
      seenKeys: seenKeys,
      updatedSeenKeys: updatedSeenKeys,
      seenKeySet: seenKeySet,
      taskId: taskId,
      skipContext: skipContext,
      commentWindowMinutes: config.commentWindowMinutes,
      knownUserKeySet: knownUserKeySet
    });
    fn79(updatedSeenKeys, seenKeySet, result.toSeedOnly);
    const result2 = result.toEvaluate.map(arg1 => arg1.comment);
    const value = result2.length;
    const value2 = result.toSeedOnly.length;
    const value3 = result.windowMin + " 分钟内";
    fn15(taskId, videoProgressLabel + " " + batchLabel + "新增 " + batchComments.length + " 条，累计已采 " + accumulatedCount + " 条，" + value3 + "待研判 " + value + " 条" + ("" + (result.inInventoryCount > 0 ? "（" + result.inInventoryCount + " 条已在库存）" : "")) + ("" + (result.skippedFilterCount > 0 ? "，" + result.skippedFilterCount + " 条已过滤" : "")) + ("" + (value2 > 0 ? "，" + value2 + " 条仅记录去重" : "")) + ("，当前耗时 " + fn16(Date.now() - videoStartedAt)), value > 0 ? "success" : "info");
    if (result.skippedFilterCount > 0) {
      const result2 = Object.entries(result.skippedByReason || {}).map(([arg1, arg12]) => arg1 + " " + arg12).join("、");
      fn15(taskId, "[排除汇总] 已过滤评论：" + result2, "info");
    }
    if (result.isFirstBaseline && value2 > 0) {
      fn15(taskId, "首轮基线：" + batchLabel + "记录 " + value2 + " 条历史评论去重，不写入线索库、不研判", "info");
    }
    if (value === 0) {
      fn15(taskId, fn105(videoCtx) + " " + result.windowMin + " 分钟内无新评论需研判", "info");
      return {
        win: win,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: value2,
        classified: result,
        evaluateFailed: false,
        stopped: !isRuntimeActive()
      };
    }
    fn15(taskId, "开始研判 " + value + " 条新评论（" + value3 + "）…", "info");
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    let num6 = 0;
    let array = new Array(result2.length);
    try {
      const list = [];
      const list2 = [];
      result2.forEach((arg1, arg2) => {
        const result = matchExcludeCommentKeyword(arg1?.text, config.excludeCommentKeywords);
        if (result) {
          array[arg2] = {
            matched: false,
            matchType: "excluded_keyword",
            intent: "low",
            reason: "命中排除评论关键词「" + result + "」，直接判定为低意向",
            excludedCommentKeyword: result
          };
        } else {
          list.push(arg1);
          list2.push(arg2);
        }
      });
      if (list.length > 0) {
        const result = await fn119(taskId, accountId, config, videoItem, account, list);
        if (result.length !== list.length) {
          throw new Error("批量研判结果数量异常");
        }
        result.forEach((arg1, arg2) => {
          array[list2[arg2]] = arg1;
        });
      }
    } catch (error) {
      fn15(taskId, "批量研判失败，本轮将稍后重试：" + error.message, "error");
      return {
        win: win,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: value2,
        classified: result,
        evaluateFailed: true,
        stopped: !isRuntimeActive()
      };
    }
    if (array.length !== result2.length) {
      fn15(taskId, "批量研判结果数量异常，本轮跳过", "warning");
      return {
        win: win,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: value2,
        classified: result,
        evaluateFailed: true,
        stopped: !isRuntimeActive()
      };
    }
    const value4 = array.filter(arg1 => arg1?.matched).length;
    fn15(taskId, "批量研判完成：" + result2.length + " 条，命中 " + value4 + " 条", value4 > 0 ? "success" : "info");
    const list = [];
    let num7 = 0;
    let num8 = 0;
    const local = (text = "") => {
      if (!list.length) {
        return;
      }
      const result = list.splice(0, list.length);
      try {
        fn51(taskId, updatedSeenKeys, {
          seenEpoch: seenEpoch
        });
        monitorTasksApi?.appendMatchRecords?.(taskId, result);
        num7 += result.length;
        fn84(taskId, metricsFromMatchRecords(result));
        fn81(taskId, {
          type: "matches-update",
          ts: Date.now(),
          added: result.length,
          reason: text || "batch"
        });
      } catch (error) {
        list.unshift(...result);
        fn15(taskId, "研判详情落盘失败：" + (error?.message || error), "warning");
      }
    };
    for (let num7 = 0; num7 < result2.length; num7 += 1) {
      if (!isRuntimeActive()) {
        break;
      }
      const value = result2[num7];
      const result = fn63(videoItem.url, value);
      rememberMonitorUser(knownUserKeySet, value);
      let local2 = array[num7] || {
        matched: false,
        reason: "研判无结果"
      };
      fn15(taskId, fn106(value, local2) + "（" + formatCommentAgeLabel(value.time) + "）", local2.matched ? "success" : "info");
      const result3 = shouldSkipMonitorComment(value, skipContext);
      if (result3.skip) {
        local2 = {
          matched: false,
          reason: "已跳过互动（" + result3.reason + "）",
          matchType: "skipped"
        };
        fn15(taskId, "[排除过滤-动作拦截] " + (result3.detail || result3.reason), "warning");
      }
      const obj = {
        id: fn64(taskId, videoItem.url, value.nickname, value.text, value.userUrl || value.authorProfileUrl || ""),
        ts: Date.now(),
        accountId: accountId,
        accountName: fn62(account, accountId),
        videoUrl: videoItem.url || "",
        videoTitle: videoItem.title || "",
        nickname: value.nickname || "",
        userUrl: value.userUrl || value.authorProfileUrl || "",
        commentText: value.text || "",
        matchType: local2.matchType || (local2.matched ? "keyword" : "none"),
        aiIntention: local2.aiResult?.intention || local2.intent || "",
        judgeReason: local2.reason || "",
        matched: !!local2.matched,
        excludedCommentKeyword: local2.excludedCommentKeyword || "",
        likeStatus: "none",
        likeError: "",
        followStatus: "none",
        followError: "",
        followErrorCode: "",
        followDiagnostic: "",
        followRequested: false,
        followRequestSent: false,
        followIsPrivate: false,
        replyContent: "",
        replyStatus: "none",
        replyError: "",
        replyErrorCode: "",
        replyDiagnostic: "",
        replyTarget: "",
        profileCommentStatus: "none",
        profileCommentError: "",
        profileCommentErrorCode: "",
        dmContent: "",
        dmStatus: "none",
        dmError: "",
        webhookStatus: "none",
        webhookError: ""
      };
      if (!local2.matched) {
        obj.likeStatus = config.enableAutoLike ? "skipped" : "none";
        obj.likeError = config.enableAutoLike ? "未满足匹配意向" : "";
        obj.replyStatus = config.enableAutoReply ? "skipped" : "none";
        obj.replyError = config.enableAutoReply ? "未满足匹配意向" : "";
        obj.followStatus = config.enableAutoFollow ? "skipped" : "none";
        obj.followError = config.enableAutoFollow ? "未满足匹配意向" : "";
        obj.dmStatus = config.enableAutoDM ? "skipped" : "none";
        obj.dmError = config.enableAutoDM ? "未满足匹配意向" : "";
        const result2 = fn67({
          comment: value,
          videoItem: videoItem,
          account: account,
          accountId: accountId,
          taskId: taskId,
          taskName: monitorTaskName,
          evaluation: local2,
          matchRecord: obj
        });
        list.push(obj);
        fn78(updatedSeenKeys, seenKeySet, result);
        local("miss-item");
        num8 += fn73(result2, taskId, monitorTaskName, knownUserKeySet);
        continue;
      }
      try {
        local2 = await fn118(taskId, accountId, config, videoItem, value, account, local2);
      } catch (error) {
        fn15(taskId, "动作生成异常，本条将下次重试：" + error.message, "error");
        continue;
      }
      counters.matchedCount += 1;
      num += 1;
      obj.matchType = local2.matchType || "keyword";
      fn81(taskId, {
        type: "match",
        accountId: accountId,
        videoUrl: videoItem.url,
        videoTitle: videoItem.title,
        nickname: value.nickname,
        text: value.text,
        matchType: obj.matchType,
        aiIntention: obj.aiIntention,
        aiResult: local2.aiResult || null,
        ts: obj.ts
      });
      if (config.enableWebhook) {
        await fn85(taskId, config, {
          taskName: monitorTaskName,
          account: account,
          videoItem: videoItem,
          comment: value,
          matchRecord: obj
        });
      }
      if (local2.shouldLike || local2.shouldReply || local2.shouldFollow || local2.shouldDM) {
        const result = await fn116({
          taskId: taskId,
          config: config,
          isRuntimeActive: isRuntimeActive,
          logPrefix: "命中可互动内容 @" + (value.nickname || "用户")
        });
        if (!result) {
          break;
        }
        fn15(taskId, "动作延迟结束，开始执行互动 @" + (value.nickname || "用户") + "…", "info");
      }
      const local3 = value.cid || value.commentId || value.id || "";
      if ((local2.shouldLike || local2.shouldReply) && win && !win.isDestroyed()) {
        const result = win.webContents.getURL();
        if (!isSameMonitorVideo(videoItem.url, result)) {
          fn15(taskId, "当前窗口位于用户主页，正在重定向回视频页 @" + (value.nickname || "用户") + "…", "info");
          try {
            await fn92(win, resolveDouyinMonitorVideoUrl(videoItem.url, local3));
            await new Promise(arg1 => setTimeout(arg1, 2500));
            fn22(win);
          } catch (error) {
            console.warn("[VideoMonitor] 重定向回视频页失败:", error?.message || error);
          }
        }
      }
      if (local2.shouldLike) {
        if (!fn7(taskId, "like", accountId)) {
          obj.likeStatus = "skipped";
          obj.likeError = fn11(taskId, "like", "当前无法执行点赞", accountId);
          fn15(taskId, "点赞跳过 @" + (value.nickname || "用户") + "：" + obj.likeError, "warning");
        } else {
          const obj2 = {
            requestId: taskId + "_like_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            taskId: taskId,
            action: "like",
            nickname: value.nickname,
            commentText: value.text,
            userUrl: value.userUrl || "",
            commentId: local3,
            timeText: value.time || value.timeText || ""
          };
          let result = await fn45(win.webContents, obj2);
          const local = !result?.success && ["comment_like_failed", "like_button_not_found", "comment_node_not_found"].includes(String(result?.errorCode || ""));
          if (local) {
            try {
              result = await fn101({
                win: win,
                taskId: taskId,
                videoItem: videoItem,
                commentCid: local3,
                nickname: value.nickname,
                errorCode: result?.errorCode || "",
                actionLabel: "点赞",
                runRetry: () => fn45(win.webContents, {
                  ...obj2,
                  requestId: taskId + "_like_retry_" + Date.now() + "_" + Math.random().toString(36).slice(2)
                })
              });
            } catch (error) {
              result = {
                success: false,
                error: "点赞重试失败：" + error.message,
                errorCode: "comment_like_reload_failed"
              };
            }
          }
          if (result?.success) {
            counters.likeCount += 1;
            num2 += 1;
            obj.likeStatus = "success";
            obj.likeError = "";
            if (!result?.alreadyLiked) {
              fn14(taskId, "like", accountId);
            }
            const result2 = Number(result?.elapsedMs);
            fn15(taskId, "已点赞评论 @" + (value.nickname || "用户") + (Number.isFinite(result2) ? "（页面动作耗时 " + (result2 / 1000).toFixed(1) + "s）" : ""), "success");
          } else {
            obj.likeStatus = "failed";
            obj.likeError = result?.error || "点赞未完成";
            fn15(taskId, "点赞失败 @" + (value.nickname || "用户") + "：" + obj.likeError, "warning");
          }
        }
      } else if (config.enableAutoLike) {
        obj.likeStatus = "skipped";
        const value2 = !fn7(taskId, "like", accountId) ? fn11(taskId, "like", "当前无法执行点赞", accountId) : "无须点赞";
        obj.likeError = value2;
        if (!fn7(taskId, "like", accountId)) {
          fn15(taskId, "点赞跳过 @" + (value.nickname || "用户") + "：" + value2, "warning");
        }
      }
      let map = new Map();
      const local4 = async (options = {}, arg2 = win) => {
        const {
          genderFilter: genderFilter,
          ageEnabled: ageEnabled,
          ageMin: ageMin,
          ageMax: ageMax,
          filterActive: filterActive,
          cacheKey: cacheKey
        } = fn72(options, config);
        if (map.has(cacheKey)) {
          return map.get(cacheKey);
        }
        if (!filterActive) {
          const obj = {
            success: true,
            eligible: true,
            filterBypassed: true
          };
          map.set(cacheKey, obj);
          return obj;
        }
        const local = arg2?.webContents || win.webContents;
        const result = await fn45(local, {
          requestId: taskId + "_profile_filter_" + Date.now() + "_" + Math.random().toString(36).slice(2),
          action: "profile-target-check",
          nickname: options.nickname || "",
          profileActionGenderFilter: genderFilter,
          profileActionAgeFilterEnabled: ageEnabled,
          profileActionAgeMin: ageMin,
          profileActionAgeMax: ageMax
        });
        let local2;
        if (!result?.success) {
          local2 = {
            ...result,
            eligible: false,
            filterReason: result?.error || "主页资料识别失败"
          };
          fn15(taskId, "主页目标筛选失败 @" + (value.nickname || "用户") + "：" + fn102(result, "主页资料识别失败") + "，已跳过主页动作", "warning");
        } else {
          local2 = result;
          const value2 = result.age !== null && result.age !== undefined && Number.isFinite(Number(result.age)) ? result.age + " 岁" : "未知";
          fn15(taskId, "主页目标筛选 @" + (value.nickname || "用户") + "：性别 " + (result.genderFilterLabel || "不限") + "（识别 " + (result.genderObservedLabel || "未知") + "）；年龄 " + (result.ageFilterLabel || "关闭") + "（识别 " + value2 + "）→ " + (result.eligible ? "通过" : "跳过：" + (result.filterReason || "不符合条件")), result.eligible ? "info" : "warning");
        }
        map.set(cacheKey, local2);
        return local2;
      };
      const result4 = (local2.replyContent || "").trim();
      const local5 = !!local2.allowEmptyReplyText || !result4 && fn113(config);
      const result5 = fn114(result4, config);
      if (local2.shouldReply) {
        let flag = false;
        let flag2 = false;
        let flag3 = false;
        let flag4 = false;
        const local = config.enableAutoReply && fn7(taskId, "reply", accountId);
        const local3 = config.enableAutoReply && config.commentOnProfileFirstWork === true && fn7(taskId, "reply", accountId);
        const value2 = Number.isFinite(Number(config.commentAttachmentPercent)) ? Number(config.commentAttachmentPercent) : 100;
        const obj2 = {
          monitorTaskId: taskId,
          isMonitorAction: true,
          enableCommentMention: !!config.enableCommentMention,
          commentMentionNicknames: config.commentMentionNicknames || "",
          commentMentionPosition: config.commentMentionPosition || "before",
          commentMentionPercent: Number.isFinite(Number(config.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(config.commentMentionPercent)))) : 100,
          enableCommentImage: !!config.enableCommentImage,
          commentImagePaths: config.commentImagePaths || [],
          enableCommentExpression: !!config.enableCommentExpression,
          commentExpressionCount: config.commentExpressionCount || 3,
          commentUseRandomSuffix: false,
          enableCommentWithoutText: local5 || config.enableCommentWithoutText === true,
          commentAttachmentPercent: local5 ? 100 : value2
        };
        if (local3 && value.userUrl) {
          fn15(taskId, "在子视图打开用户主页尝试首作评论 @" + (value.nickname || "用户") + "…", "info");
          let local3 = null;
          await fn93(accountId, account?.proxy, value.userUrl, win, async arg1 => {
            const result = await local4({
              nickname: value.nickname,
              userUrl: value.userUrl,
              genderFilter: config.profileFirstGenderFilter,
              ageFilterEnabled: config.profileFirstAgeFilterEnabled,
              ageMin: config.profileFirstAgeMin,
              ageMax: config.profileFirstAgeMax
            }, arg1);
            flag3 = result.filtered === true || result.eligible === false;
            local3 = result.eligible ? await fn45(arg1.webContents, {
              requestId: taskId + "_firstcmt_" + Date.now() + "_" + Math.random().toString(36).slice(2),
              action: "profile-first-comment",
              nickname: value.nickname,
              replyContent: result4,
              ...obj2,
              profileFirstWorkLikePercent: config.profileFirstWorkLikePercent !== undefined ? config.profileFirstWorkLikePercent : 10,
              profileFirstWorkCollectPercent: config.profileFirstWorkCollectPercent !== undefined ? config.profileFirstWorkCollectPercent : 10,
              commentOnProfileFirstWork: true
            }) : {
              success: false,
              error: result.filterReason || "主页目标不符合筛选条件",
              errorCode: result.filtered ? "profile_target_filtered" : "profile_page_load_failed"
            };
            if (!flag3 && (local2.shouldFollow || local2.shouldDM)) {
              if (local2.shouldFollow && fn7(taskId, "follow", accountId)) {
                const result = await fn45(arg1.webContents, {
                  requestId: taskId + "_follow_inline_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  action: "follow",
                  userUrl: value.userUrl,
                  nickname: value.nickname
                });
                const local = result?.followStatus || (result?.success ? "success" : "failed");
                obj.followStatus = local;
                obj.followError = result?.error || "";
                obj.followErrorCode = result?.errorCode || "";
                obj.followDiagnostic = result?.diagnostic || result?.detail || "";
                obj.followRequested = local === "requested" || !!result?.followRequested;
                obj.followRequestSent = !!result?.followRequestSent;
                obj.followIsPrivate = !!result?.isPrivate || !!obj.isPrivate;
                if (result?.worksCount !== undefined) {
                  obj.worksCount = Number(result.worksCount || 0);
                }
                if (result?.noWorks !== undefined) {
                  obj.noWorks = !!result.noWorks;
                }
                if (local === "success") {
                  counters.followCount += 1;
                  num4 += 1;
                  fn14(taskId, "follow", accountId);
                  fn15(taskId, "已顺带完成关注 @" + (value.nickname || "用户"), "success");
                } else if (local === "already_followed") {
                  fn15(taskId, "@" + (value.nickname || "用户") + " 原本已关注，未重复点击", "info");
                } else if (local === "requested") {
                  if (obj.followRequestSent) {
                    counters.followRequestCount += 1;
                    num5 += 1;
                    fn14(taskId, "follow", accountId);
                  }
                  fn15(taskId, "已顺带提交关注请求 @" + (value.nickname || "用户") + "，等待对方通过", "warning");
                } else {
                  fn15(taskId, "顺带关注未成功 @" + (value.nickname || "用户") + "：" + (result?.error || "状态未确认"), "warning");
                }
                local2.shouldFollow = false;
              }
              if (local2.shouldDM && fn7(taskId, "dm", accountId)) {
                const result = (local2.dmContent || "").trim();
                if (result) {
                  const result2 = await fn45(arg1.webContents, {
                    requestId: taskId + "_dm_inline_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                    action: "dm",
                    userUrl: value.userUrl,
                    nickname: value.nickname,
                    dmContent: result
                  });
                  obj.dmContent = result;
                  if (result2?.success) {
                    await new Promise(arg1 => setTimeout(arg1, 2500));
                    counters.messageCount += 1;
                    num6 += 1;
                    obj.dmStatus = "success";
                    fn14(taskId, "dm", accountId);
                    markUserReplied(taskId, value.nickname, store);
                    fn15(taskId, "已顺带完成私信 @" + value.nickname + "：" + result.slice(0, 40), "success");
                  } else {
                    obj.dmStatus = "failed";
                    fn15(taskId, "顺带私信未成功 @" + value.nickname + "：" + (result2?.error || "未知"), "warning");
                  }
                  local2.shouldDM = false;
                }
              }
            }
          }).catch(arg1 => {
            fn15(taskId, "首作评论子视图异常 @" + (value.nickname || "用户") + "：" + (arg1?.message || arg1), "warning");
            local3 = {
              success: false,
              error: arg1?.message || "首作评论页面加载失败"
            };
          });
          if (local3?.success) {
            flag = true;
            flag2 = true;
            counters.replyCount += 1;
            num3 += 1;
            obj.replyContent = result4;
            obj.replyStatus = "success";
            obj.replyError = "";
            obj.replyErrorCode = "";
            obj.replyDiagnostic = "";
            obj.replyTarget = "profile_first";
            obj.profileCommentStatus = "success";
            obj.profileCommentError = "";
            obj.profileCommentErrorCode = "";
            fn14(taskId, "reply", accountId);
            markUserReplied(taskId, value.nickname, store);
            fn15(taskId, "主页作品评论成功 @" + value.nickname + "：" + result5, "success");
            if (local3?.workLiked) {
              obj.liked = true;
              fn15(taskId, "首作作品已点赞 @" + (value.nickname || "用户"), "success");
            }
            if (local3?.workCollected) {
              obj.collected = true;
              fn15(taskId, "首作作品已收藏 @" + (value.nickname || "用户"), "success");
            }
          } else {
            const result = fn102(local3, "无可评论作品");
            fn15(taskId, "主页作品评论跳过/失败：" + result, "warning");
            obj.profileCommentStatus = flag3 ? "skipped" : "failed";
            obj.profileCommentError = result;
            obj.profileCommentErrorCode = local3?.errorCode === "no_works" || local3?.noWorks ? "no_works" : local3?.errorCode === "profile_works_not_ready" ? "profile_works_not_ready" : local3?.errorCode || "profile_first_comment_failed";
            if ((config.profileFirstCommentFallbackMode || "reply") === "reply" && (!flag3 || local)) {
              flag4 = local;
              if (flag4) {
                fn15(taskId, "正在在当前视频页回复原评论 @" + value.nickname + "…", "info");
              }
            } else {
              obj.replyContent = result4;
              obj.replyStatus = "failed";
              obj.replyError = result;
              obj.replyErrorCode = obj.profileCommentErrorCode;
              obj.replyDiagnostic = local3?.diagnostic || local3?.detail || "";
              obj.replyTarget = "profile_first";
              if (local3?.noWorks || local3?.errorCode === "no_works") {
                obj.noWorks = true;
                if (local3?.worksCount !== undefined) {
                  obj.worksCount = Number(local3.worksCount || 0);
                }
              }
              fn15(taskId, "已按“仅首作评论”模式跳过原评论回复", "info");
            }
          }
        } else if (local3 && !value.userUrl) {
          if ((config.profileFirstCommentFallbackMode || "reply") === "reply") {
            flag4 = local;
          } else {
            obj.replyStatus = "skipped";
            obj.replyError = "未解析到用户主页链接，且为仅首作评论模式";
            obj.replyTarget = "profile_first";
            obj.profileCommentStatus = "skipped";
            obj.profileCommentError = obj.replyError;
            obj.profileCommentErrorCode = "no_user_url";
            fn15(taskId, "回复跳过 @" + (value.nickname || "用户") + "：无主页链接且仅首作评论", "warning");
          }
        } else {
          flag4 = local;
        }
        if (!flag2 && flag4) {
          if (!config.commentOnProfileFirstWork) {
            fn15(taskId, "正在回复原评论 @" + (value.nickname || "用户") + "…", "info");
          }
          const local = value.cid || value.commentId || value.id || "";
          const obj3 = {
            action: "reply",
            nickname: value.nickname,
            commentText: value.text,
            replyContent: result4,
            commentId: local,
            userUrl: value.userUrl || "",
            timeText: value.time || value.timeText || "",
            ...obj2
          };
          let result = await fn45(win.webContents, {
            requestId: taskId + "_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            ...obj3
          });
          if (!result?.success && fn103(result)) {
            try {
              result = await fn101({
                win: win,
                taskId: taskId,
                videoItem: videoItem,
                commentCid: local,
                nickname: value.nickname,
                errorCode: result?.errorCode || "",
                actionLabel: "回复",
                runRetry: () => fn45(win.webContents, {
                  requestId: taskId + "_retry_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  ...obj3
                })
              });
            } catch (error) {
              result = {
                success: false,
                error: "回复重试失败：" + error.message,
                errorCode: "reply_reload_failed"
              };
            }
          }
          obj.replyContent = result4;
          obj.replyTarget = "comment";
          if (result?.success) {
            flag = true;
            counters.replyCount += 1;
            num3 += 1;
            obj.replyStatus = "success";
            obj.replyError = "";
            obj.replyErrorCode = "";
            obj.replyDiagnostic = "";
            fn14(taskId, "reply", accountId);
            markUserReplied(taskId, value.nickname, store);
            fn15(taskId, "已回复 @" + value.nickname + "：" + result5, "success");
          } else {
            obj.replyStatus = "failed";
            obj.replyError = result?.error || "回复未完成";
            obj.replyErrorCode = result?.errorCode || "reply_failed";
            obj.replyDiagnostic = result?.diagnostic || result?.detail || "";
            fn15(taskId, "回复失败 @" + value.nickname + "：" + fn102(result, "回复未完成"), "warning");
          }
        } else if (!flag && !flag2 && !local) {
          obj.replyStatus = "skipped";
          obj.replyError = fn11(taskId, "reply", config.enableAutoReply ? "当前无法执行回复" : "未开启自动回复", accountId);
          fn15(taskId, "回复跳过 @" + (value.nickname || "用户") + "：" + obj.replyError, "warning");
        }
      } else if (config.enableAutoReply) {
        obj.replyStatus = "skipped";
        const value2 = !fn7(taskId, "reply", accountId) ? fn11(taskId, "reply", "当前无法执行回复", accountId) : !result4 && !fn113(config) ? config.enableCommentWithoutText ? "已开启不发文字但未配置图片/表情/@" : "未填写文字且未配置图片/表情/@" : "当前无法执行回复";
        obj.replyError = value2;
        fn15(taskId, "回复跳过 @" + (value.nickname || "用户") + "：" + value2, "warning");
      }
      const local6 = local2.shouldFollow || local2.shouldDM;
      if (local6 && value.userUrl) {
        const local = local2.shouldFollow && fn7(taskId, "follow", accountId);
        const local3 = local2.shouldDM && fn7(taskId, "dm", accountId);
        if (local2.shouldFollow && !local) {
          obj.followStatus = "skipped";
          obj.followError = fn11(taskId, "follow", "当前无法执行关注", accountId);
          fn15(taskId, "关注跳过 @" + (value.nickname || "用户") + "：" + obj.followError, "warning");
        } else if (config.enableAutoFollow && !local2.shouldFollow) {
          obj.followStatus = "skipped";
          const result = fn10(taskId, "follow", accountId);
          obj.followError = result || "主页目标不符合筛选条件";
        }
        if (local2.shouldDM && !local3) {
          obj.dmStatus = "skipped";
          obj.dmError = fn11(taskId, "dm", "当前无法执行私信", accountId);
          fn15(taskId, "私信跳过 @" + (value.nickname || "用户") + "：" + obj.dmError, "warning");
        } else if (config.enableAutoDM && !local2.shouldDM) {
          obj.dmStatus = "skipped";
          const result = fn10(taskId, "dm", accountId);
          obj.dmError = result || (!(local2.dmContent || "").trim() ? "私信内容为空" : "主页目标不符合筛选条件");
        }
        if (local || local3) {
          const result = [local ? "关注" : "", local3 ? "私信" : ""].filter(Boolean).join("并");
          fn15(taskId, "正在在子视图打开用户页" + result + " @" + (value.nickname || "用户") + "…", "info");
          await fn93(accountId, account?.proxy, value.userUrl, win, async arg1 => {
            let result = await local4({
              nickname: value.nickname,
              userUrl: value.userUrl,
              genderFilter: config.profileActionGenderFilter,
              ageFilterEnabled: config.profileActionAgeFilterEnabled,
              ageMin: config.profileActionAgeMin,
              ageMax: config.profileActionAgeMax
            }, arg1);
            let value2 = result.eligible === true;
            if (result) {
              if (result.isPrivate !== undefined) {
                obj.isPrivate = !!result.isPrivate;
              }
              if (result.worksCount !== undefined) {
                obj.worksCount = Number(result.worksCount || 0);
              }
              if (result.noWorks !== undefined) {
                obj.noWorks = !!result.noWorks;
              }
              if (result.isPrivate) {
                obj.followIsPrivate = true;
              }
            }
            if (local) {
              if (!value2) {
                obj.followStatus = "skipped";
                obj.followError = result?.filterReason || "主页目标不符合筛选条件";
                obj.followErrorCode = result?.filtered ? "profile_target_filtered" : "profile_target_check_failed";
                fn15(taskId, "关注跳过 @" + (value.nickname || "用户") + "：" + obj.followError, "info");
              } else {
                const result = await fn45(arg1.webContents, {
                  requestId: taskId + "_follow_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  action: "follow",
                  userUrl: value.userUrl,
                  nickname: value.nickname
                });
                const local = result?.followStatus || (result?.success ? "success" : "failed");
                obj.followStatus = local;
                obj.followError = result?.error || (local === "failed" ? "关注状态未确认" : "");
                obj.followErrorCode = result?.errorCode || "";
                obj.followDiagnostic = result?.diagnostic || result?.detail || "";
                obj.followRequested = local === "requested" || !!result?.followRequested;
                obj.followRequestSent = !!result?.followRequestSent;
                obj.followIsPrivate = !!result?.isPrivate || !!obj.isPrivate;
                if (result?.worksCount !== undefined) {
                  obj.worksCount = Number(result.worksCount || 0);
                }
                if (result?.noWorks !== undefined) {
                  obj.noWorks = !!result.noWorks;
                }
                if (local === "skipped" || local === "failed" && fn12(result)) {
                  obj.followStatus = "skipped";
                  obj.followError = fn13("关注", result);
                  obj.followErrorCode = result?.errorCode || "private_account";
                  if (fn12(result)) {
                    obj.followIsPrivate = true;
                  }
                  fn15(taskId, "关注跳过 @" + (value.nickname || "用户") + "：" + obj.followError, "info");
                } else if (local === "success") {
                  counters.followCount += 1;
                  num4 += 1;
                  fn14(taskId, "follow", accountId);
                  fn15(taskId, "关注成功 @" + (value.nickname || "用户"), "success");
                } else if (local === "already_followed") {
                  fn15(taskId, "@" + (value.nickname || "用户") + " 原本已关注，本次未重复点击", "info");
                } else if (local === "requested") {
                  if (obj.followRequestSent) {
                    counters.followRequestCount += 1;
                    num5 += 1;
                    fn14(taskId, "follow", accountId);
                  }
                  const value2 = obj.followIsPrivate ? "（私密账号）" : "";
                  fn15(taskId, obj.followRequestSent ? "已向 @" + (value.nickname || "用户") + " 提交关注请求" + value2 + "，等待对方通过" : "@" + (value.nickname || "用户") + " 的关注请求仍在等待通过" + value2 + "，本次未重复提交", "warning");
                } else {
                  const result2 = fn102(result, "关注状态未确认");
                  obj.followError = result2;
                  fn15(taskId, "关注失败 @" + (value.nickname || "用户") + "：" + result2, "warning");
                }
              }
            }
            if (local3) {
              const result2 = (local2.dmContent || "").trim();
              if (result2 && value2) {
                const value2 = taskId + "_dm_" + Date.now() + "_" + Math.random().toString(36).slice(2);
                const result3 = await fn45(arg1.webContents, {
                  requestId: value2,
                  action: "dm",
                  userUrl: value.userUrl,
                  nickname: value.nickname,
                  dmContent: result2,
                  profileDetail: result?.profileDetail || null,
                  genderFilter: config.profileActionGenderFilter,
                  ageFilterEnabled: config.profileActionAgeFilterEnabled,
                  ageMin: config.profileActionAgeMin,
                  ageMax: config.profileActionAgeMax
                });
                obj.dmContent = result2;
                if (result3?.isPrivate !== undefined) {
                  obj.isPrivate = !!result3.isPrivate;
                }
                if (result3?.worksCount !== undefined) {
                  obj.worksCount = Number(result3.worksCount || 0);
                }
                if (result3?.noWorks !== undefined) {
                  obj.noWorks = !!result3.noWorks;
                }
                if (result3?.success) {
                  await new Promise(arg1 => setTimeout(arg1, 2500));
                  counters.messageCount += 1;
                  num6 += 1;
                  obj.dmStatus = "success";
                  fn14(taskId, "dm", accountId);
                  markUserReplied(taskId, value.nickname, store);
                  fn15(taskId, "已私信 @" + value.nickname + "：" + result2.slice(0, 40), "success");
                } else if (result3?.skipped || fn12(result3) || /私密账号|隐私设置|对方账号设置了隐私/.test(String(result3?.error || ""))) {
                  obj.dmStatus = "skipped";
                  obj.dmError = fn13("私信", result3);
                  obj.isPrivate = true;
                  fn15(taskId, "私信跳过 @" + value.nickname + "：" + obj.dmError, "info");
                } else {
                  obj.dmStatus = "failed";
                  obj.dmError = result3?.error || result3?.detail || "私信发送失败";
                  fn15(taskId, "私信失败 @" + value.nickname + "：" + obj.dmError, "warning");
                }
              } else if (!value2) {
                obj.dmStatus = "skipped";
                obj.dmError = result?.filterReason || "主页目标不符合筛选条件";
                fn15(taskId, "私信跳过 @" + (value.nickname || "用户") + "：" + obj.dmError, "info");
              }
            }
          }).catch(arg1 => {
            fn15(taskId, "关注/私信子视图异常 @" + (value.nickname || "用户") + "：" + (arg1?.message || arg1), "warning");
            fn70(obj, {
              followAllowed: local,
              dmAllowed: local3,
              error: arg1?.message || "子视图加载失败"
            });
          });
        }
      }
      const result6 = fn67({
        comment: value,
        videoItem: videoItem,
        account: account,
        accountId: accountId,
        taskId: taskId,
        taskName: monitorTaskName,
        evaluation: local2,
        matchRecord: obj
      });
      list.push(obj);
      fn78(updatedSeenKeys, seenKeySet, result);
      local("hit");
      num8 += fn73(result6, taskId, monitorTaskName, knownUserKeySet);
    }
    if (num8 > 0) {
      fn15(taskId, "已实时同步 " + num8 + " 条研判结果到线索库", "info");
    }
    local("batch-end");
    counters.newCommentsThisRound += num7;
    return {
      win: win,
      videoMatched: num,
      videoLikes: num2,
      videoReplies: num3,
      videoFollows: num4,
      videoFollowRequests: num5,
      videoMessages: num6,
      newCount: num7,
      seededCount: value2,
      classified: result,
      evaluateFailed: false,
      stopped: !isRuntimeActive()
    };
  }
  async function fn128({
    taskId: taskId,
    accountId: accountId,
    account: account,
    config: config,
    videoItem: videoItem,
    videoIndex: videoIndex,
    videoTotal: videoTotal,
    accounts: accounts,
    monitorTasksApi: monitorTasksApi,
    isRuntimeActive: isRuntimeActive,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    counters: counters,
    monitorTaskName: monitorTaskName,
    win: win,
    seenEpoch = 0,
    knownUserKeySet = null,
    navigateMode = "load"
  }) {
    let local = win;
    if (!isRuntimeActive()) {
      return {
        win: local
      };
    }
    const result = Date.now();
    const value = "[" + (videoIndex + 1) + "/" + videoTotal + "]";
    let local2 = null;
    let flag = false;
    try {
      const local3 = videoItem.url || "";
      const result2 = resolveDouyinMonitorVideoUrl(local3);
      const value2 = String(navigateMode || "load") === "skip";
      fn15(taskId, value2 ? value + " 已在目标作品，开始检索评论…" : value + " 正在检索" + fn105(fn104(videoItem), "…"), "info");
      fn20(local);
      let flag2 = false;
      let flag3 = false;
      let text = "unavailable";
      if (value2) {
        let local2 = null;
        try {
          local2 = await result4.waitVideoReady(local.webContents, {
            taskId: taskId,
            videoUrl: result2 || local3,
            timeoutMs: 35000
          });
        } catch (error) {
          local2 = {
            ok: false
          };
        }
        flag3 = !!local2?.unavailable;
        flag2 = !!local2?.ok || !!local2?.ready;
        if (flag3) {
          text = local2?.reason || "unavailable";
        }
      } else {
        fn15(taskId, value + " 正在打开指定视频（精选详情）…", "info");
        try {
          await fn92(local, result2);
        } catch (error) {
          fn15(taskId, value + " 打开视频失败：" + (error?.message || error), "warning");
        }
        fn20(local);
        await new Promise(arg1 => setTimeout(arg1, fn24(local) ? 350 : 700));
        let local2 = null;
        try {
          local2 = await result4.openSpecificVideo(local.webContents, {
            taskId: taskId,
            videoUrl: result2 || local3,
            timeoutMs: 110000
          });
        } catch (error) {
          local2 = {
            ok: false,
            status: "timeout"
          };
        }
        flag3 = !!local2?.unavailable || local2?.status === "unavailable";
        flag2 = !!local2?.ok || !!local2?.ready;
        if (flag3) {
          text = local2?.reason || local2?.status || "unavailable";
        }
        if (!flag2 && !flag3 && isRuntimeActive()) {
          fn15(taskId, value + " 精选未就绪，主进程再整页打开一次…", "warning");
          try {
            await fn92(local, result2);
          } catch (error) {}
          fn20(local);
          await new Promise(arg1 => setTimeout(arg1, 400));
          try {
            local2 = await result4.waitVideoReady(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3,
              timeoutMs: 35000
            });
          } catch (error) {
            local2 = {
              ok: false,
              status: "timeout"
            };
          }
          flag3 = !!local2?.unavailable;
          flag2 = !!local2?.ok || !!local2?.ready;
          if (flag3) {
            text = local2?.reason || "unavailable";
          }
        }
      }
      if (flag3) {
        const result = fn121(videoItem, text);
        fn15(taskId, result ? value + " 视频失效或无法观看，已跳过" : value + " 视频暂未打开成功（" + formatMonitorInvalidReason(text) + "），本轮跳过，下轮重试", "warning");
        if (result) {
          try {
            fn124(taskId, config, videoItem, text);
          } catch (error) {}
        }
        return {
          win: local
        };
      }
      if (!flag2) {
        fn15(taskId, value + " 指定视频打开较慢仍未就绪，本轮跳过（不标记失效）", "warning");
        return {
          win: local
        };
      }
      const result3 = resolveMonitorExpectedAuthor(videoItem);
      if (result3.secUid) {
        fn15(taskId, value + " 正在确认当前作品是否为目标博主…", "info");
        let obj = {
          matched: false
        };
        try {
          obj = await result4.confirmAuthor(local.webContents, {
            taskId: taskId,
            videoUrl: result2 || local3,
            expectedAuthorUrl: result3.url,
            expectedSecUid: result3.secUid,
            timeoutMs: 6000
          });
        } catch (error) {
          obj = {
            matched: false
          };
        }
        const result = classifyDouyinAuthorIdentity(obj.secUid || obj.authorUrl || obj.pageUrl, result3.secUid || result3.url);
        if (result.matched || obj.matched) {
          obj.matched = true;
          obj.authorMismatch = false;
        } else if (result.foreign || obj.authorMismatch) {
          obj.matched = false;
          obj.authorMismatch = true;
        } else {
          obj.matched = false;
          obj.authorMismatch = false;
          obj.authorUnconfirmed = true;
        }
        if (obj.authorMismatch && value2) {
          fn15(taskId, String(videoItem.source || "") === "author_latest" ? value + " 当前作品不是目标博主，停止本博主后续作品（不改用链接打开）" : value + " 当前作品不是目标博主，改用链接打开后再确认（不采集当前页评论）", "warning");
          if (String(videoItem.source || "") === "author_latest") {
            return {
              win: local,
              authorMismatch: true
            };
          }
          try {
            await fn92(local, result2);
          } catch (error) {}
          try {
            await result4.waitVideoReady(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3,
              timeoutMs: 25000
            });
          } catch (error) {}
          try {
            obj = await result4.confirmAuthor(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3,
              expectedAuthorUrl: result3.url,
              expectedSecUid: result3.secUid,
              timeoutMs: 6000
            });
          } catch (error) {
            obj = {
              matched: false
            };
          }
          const result = classifyDouyinAuthorIdentity(obj.secUid || obj.authorUrl || obj.pageUrl, result3.secUid || result3.url);
          if (result.matched || obj.matched) {
            obj.matched = true;
            obj.authorMismatch = false;
          } else if (result.foreign || obj.authorMismatch) {
            obj.matched = false;
            obj.authorMismatch = true;
          } else {
            obj.matched = false;
            obj.authorMismatch = false;
            obj.authorUnconfirmed = true;
          }
        }
        if (obj.authorMismatch) {
          fn15(taskId, value + " 未对准目标博主，已跳过评论采集" + (isDouyinSecUidIdentity(obj.secUid) ? "（当前 " + String(obj.secUid).slice(0, 12) + "…）" : ""), "warning");
          return {
            win: local,
            authorMismatch: true
          };
        }
        if (obj.matched) {
          fn15(taskId, value + " 已对准博主" + (obj.nickname ? "「" + obj.nickname + "」" : "") + "，开始采集评论", "info");
        } else {
          fn15(taskId, value + " 页面尚未读到作者 secUid，作品来自目标主页列表，继续采集（若滑到其他博主会立即停止）", "info");
        }
      }
      if (config.enableVideoComment === true && isRuntimeActive()) {
        await fn115({
          taskId: taskId,
          accountId: accountId,
          account: account,
          config: config,
          videoItem: videoItem,
          videoProgressLabel: value,
          win: local,
          isRuntimeActive: isRuntimeActive,
          monitorTasksApi: monitorTasksApi
        });
      }
      const result5 = fn8(config);
      let value3 = result5 && fn9(taskId, config, accountId) ? num22 : 0;
      fn15(taskId, value3 > 0 ? value + " 正在打开评论区并抓取评论（边找边互动：每露屏 " + value3 + " 条即时研判互动）…" : value + " 正在打开评论区并快速拉取评论…", "info");
      let list = [];
      let local4 = null;
      let num = 0;
      let num2 = 0;
      let num3 = 0;
      let num4 = 0;
      let num5 = 0;
      let num6 = 0;
      let num7 = 0;
      let result6 = fn104(videoItem);
      let result7 = buildMonitorSkipContext({
        config: config,
        accounts: accounts,
        account: account,
        taskId: taskId,
        monitorTasksApi: monitorTasksApi,
        store: store,
        videoAuthor: videoItem.author || "",
        videoAuthorUrl: videoItem.authorUrl || videoItem.authorProfileUrl || ""
      });
      let flag4 = false;
      let flag5 = false;
      let flag6 = false;
      const value4 = Date.now() + num10;
      while (isRuntimeActive() && !flag5) {
        num += 1;
        if (value3 > 0 && !fn9(taskId, config, accountId)) {
          value3 = 0;
          fn15(taskId, value + " 互动动作已达上限或不可执行，后续改为整页快采…", "info");
        }
        const value2 = list.length;
        if (flag4) {
          await fn92(local, result2);
          try {
            await result4.waitVideoReady(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3,
              timeoutMs: 12000
            });
          } catch (error) {
            await new Promise(arg1 => setTimeout(arg1, 1200));
          }
          fn22(local);
          flag4 = false;
        }
        let result5 = await fn130({
          taskId: taskId,
          account: account,
          initialWindow: local,
          videoUrl: local3,
          loadUrl: result2,
          videoProgressLabel: value,
          expectedAuthorUrl: result3.url,
          expectedSecUid: result3.secUid,
          chunkSize: value3,
          initialComments: list,
          initialResumeState: local4,
          scrapeDeadlineAt: value4,
          isRuntimeActive: isRuntimeActive
        });
        local = result5.win;
        local2 = local;
        let value5 = result5.result;
        if (!isRuntimeActive()) {
          flag5 = true;
          break;
        }
        if (value5?.videoUnavailable) {
          const local = value5?.unavailableReason || value5?.reason || "unavailable";
          const result = fn121(videoItem, local);
          fn15(taskId, result ? value + " 视频失效或无法观看，已跳过" : value + " 评论抓取时视频暂未就绪（" + formatMonitorInvalidReason(local) + "），本轮跳过，下轮重试", "warning");
          if (result) {
            try {
              fn124(taskId, config, videoItem, local);
            } catch (error) {}
          }
          flag5 = true;
          break;
        }
        const local5 = !!value5?.needReload || !!value5?.videoNotReady || !!value5?.panelNotOpen || value5?.panelOpened === false && !value5?.success;
        if (local5 && !flag6 && isRuntimeActive()) {
          flag6 = true;
          fn15(taskId, value + " " + (value5?.error || "视频/评论区未就绪") + "，重新打开视频后重试…", "warning");
          fn20(local);
          try {
            await fn92(local, result2);
            fn20(local);
            await result4.openSpecificVideo(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3
            });
          } catch (error) {
            await new Promise(arg1 => setTimeout(arg1, 1500));
          }
          result5 = await fn130({
            taskId: taskId,
            account: account,
            initialWindow: local,
            videoUrl: local3,
            loadUrl: result2,
            videoProgressLabel: value,
            expectedAuthorUrl: result3.url,
            expectedSecUid: result3.secUid,
            chunkSize: value3,
            initialComments: list,
            initialResumeState: null,
            scrapeDeadlineAt: value4,
            isRuntimeActive: isRuntimeActive
          });
          local = result5.win;
          local2 = local;
          value5 = result5.result;
          if (!isRuntimeActive()) {
            flag5 = true;
            break;
          }
        }
        if (isMonitorScrapeIdentityMismatch(value5)) {
          fn15(taskId, value5?.authorMismatch ? value + " 采集中发现当前不是目标博主，正在重新打开目标作品（已丢弃本页评论）…" : "检测到视频已自动跳转，正在重新加载目标视频…", "warning");
          await fn92(local, result2);
          try {
            await result4.waitVideoReady(local.webContents, {
              taskId: taskId,
              videoUrl: result2 || local3,
              timeoutMs: 25000
            });
          } catch (error) {
            await new Promise(arg1 => setTimeout(arg1, 1500));
          }
          if (result3.secUid) {
            let obj = {
              matched: false
            };
            try {
              obj = await result4.confirmAuthor(local.webContents, {
                taskId: taskId,
                videoUrl: result2 || local3,
                expectedAuthorUrl: result3.url,
                expectedSecUid: result3.secUid,
                timeoutMs: 6000
              });
            } catch (error) {
              obj = {
                matched: false
              };
            }
            if (!obj.matched) {
              fn15(taskId, value + " 重开后仍未对准目标博主，已跳过评论采集", "warning");
              flag5 = true;
              flag = true;
              break;
            }
          }
          result5 = await fn130({
            taskId: taskId,
            account: account,
            initialWindow: local,
            videoUrl: local3,
            loadUrl: result2,
            videoProgressLabel: value,
            expectedAuthorUrl: result3.url,
            expectedSecUid: result3.secUid,
            chunkSize: value3,
            initialComments: list,
            initialResumeState: local4,
            scrapeDeadlineAt: value4,
            isRuntimeActive: isRuntimeActive
          });
          local = result5.win;
          local2 = local;
          value5 = result5.result;
          if (!isRuntimeActive()) {
            flag5 = true;
            break;
          }
        }
        if (isMonitorScrapeIdentityMismatch(value5)) {
          fn15(taskId, value5?.authorMismatch ? fn105(fn104(videoItem, value5)) + " 当前不是目标博主，已跳过（未采集评论）" : fn105(fn104(videoItem, value5)) + " 视频已漂移，已跳过（请检查链接是否为短视频连播页）", "warning");
          flag5 = true;
          flag = !!value5?.authorMismatch;
          break;
        }
        if (value5?.videoUrl && !isSameMonitorVideo(local3, value5.videoUrl)) {
          fn15(taskId, fn105(fn104(videoItem, value5)) + " 当前页面与配置视频不一致，已跳过", "warning");
          flag5 = true;
          break;
        }
        const local6 = value5?.success && Array.isArray(value5.comments) && value5.comments.length === 0 && list.length === 0 && Number(value5.totalCount) > 10;
        if (local6 && !flag6 && isRuntimeActive()) {
          flag6 = true;
          fn15(taskId, value + " 评论总数 " + (value5.totalCount || "未知") + " 但未抓到评论，唤醒后台页面重试一次…", "warning");
          const result = fn23(local);
          try {
            await new Promise(arg1 => setTimeout(arg1, fn24(local) ? 900 : 1200));
            result5 = await fn130({
              taskId: taskId,
              account: account,
              initialWindow: local,
              videoUrl: local3,
              loadUrl: result2,
              videoProgressLabel: value,
              expectedAuthorUrl: result3.url,
              expectedSecUid: result3.secUid,
              chunkSize: value3,
              initialComments: list,
              initialResumeState: null,
              scrapeDeadlineAt: value4,
              isRuntimeActive: isRuntimeActive
            });
            local = result5.win;
            local2 = local;
            value5 = result5.result;
          } finally {
            try {
              result();
            } catch (error) {}
            fn22(local);
          }
          if (!isRuntimeActive()) {
            flag5 = true;
            break;
          }
          const value2 = Array.isArray(value5?.comments) ? value5.comments.length : 0;
          fn15(taskId, value2 > 0 ? value + " 唤醒重试后抓到 " + value2 + " 条评论" : value + " 唤醒重试后仍未抓到评论，按无评论继续", value2 > 0 ? "success" : "warning");
        }
        if (!value5?.success || !Array.isArray(value5.comments)) {
          fn15(taskId, fn105(fn104(videoItem, value5)) + " 检查失败：" + (value5?.error || "未获取到评论列表"), "warning");
          if (set.has(value5?.errorCode)) {
            const local2 = value5.errorCode || "unknown";
            const value = Number(value5.elapsedMs) > 0 ? "，已等待 " + fn16(value5.elapsedMs) : "";
            fn15(taskId, "账号 " + (account.nickname || account.name || accountId) + " 的后台监控页未按时返回（" + local2 + value + "），正在释放该渲染进程并重建；任务会继续检查下一个视频", "warning");
            if (isRuntimeActive()) {
              local = await fn94(accountId, account.proxy, local, taskId);
            }
          }
          flag5 = true;
          break;
        }
        if (value5.partialDueToDeadline) {
          fn15(taskId, "评论页面已达到 " + Math.round(num10 / 1000) + " 秒期限，已保留并继续研判当前抓到的评论", "warning");
        } else if (num === 1 && Number(value5.elapsedMs) >= 45000 && !value5.partialChunk) {
          fn15(taskId, "本次评论抓取耗时 " + Math.round(value5.elapsedMs / 1000) + " 秒，页面响应偏慢但已完成", "warning");
        }
        list = Array.isArray(value5.comments) ? value5.comments : list;
        local4 = value5.resumeState || local4;
        const result8 = list.slice(value2);
        const flag2 = !!value5.partialChunk;
        result6 = fn104(videoItem, value5);
        if (value5.videoTitle && value5.videoTitle.trim()) {
          videoItem.title = value5.videoTitle.trim();
        }
        if (value5.videoAuthor && value5.videoAuthor.trim()) {
          videoItem.author = value5.videoAuthor.trim();
        }
        if (value5.videoAuthorUrl && value5.videoAuthorUrl.trim()) {
          const result = value5.videoAuthorUrl.trim();
          if (!result3.secUid || isSameDouyinAuthorIdentity(result, result3.secUid)) {
            videoItem.authorUrl = result;
          }
        }
        result7 = buildMonitorSkipContext({
          config: config,
          accounts: accounts,
          account: account,
          taskId: taskId,
          monitorTasksApi: monitorTasksApi,
          store: store,
          videoAuthor: value5.videoAuthor || videoItem.author || "",
          videoAuthorUrl: value5.videoAuthorUrl || videoItem.authorUrl || videoItem.authorProfileUrl || ""
        });
        if (num === 1) {
          const result = resolveMonitorCommentWindowMinutes({
            commentWindowMinutes: config.commentWindowMinutes
          });
          fn15(taskId, "[任务判定条件] 时间范围: " + result + " 分钟 | AI判定: " + (config.useAiJudge ? "开启" : "关闭") + " | 关键词: \"" + (config.keywords || "留空(全部匹配)") + "\" | 排除关键词: \"" + (config.excludeCommentKeywords || "无") + "\" | 视频作者: \"" + (value5.videoAuthor || videoItem.author || "未识别") + "\"", "info");
          fn15(taskId, "[排除名单] 配置排除：" + formatExcludeCommentersForLog(result7) + "｜自动排除执行账号：" + formatOperatorAccountsForLog(result7), "info");
        }
        if (result8.length === 0) {
          if (!flag2) {
            fn15(taskId, value + " " + fn105(result6) + " 无新增评论，已到底", "info");
            break;
          }
          continue;
        }
        const value6 = "本批#" + num;
        const result9 = await fn131({
          taskId: taskId,
          accountId: accountId,
          account: account,
          config: config,
          videoItem: videoItem,
          batchComments: result8,
          win: local,
          seenKeys: seenKeys,
          updatedSeenKeys: updatedSeenKeys,
          seenKeySet: seenKeySet,
          skipContext: result7,
          monitorTaskName: monitorTaskName,
          monitorTasksApi: monitorTasksApi,
          isRuntimeActive: isRuntimeActive,
          videoProgressLabel: value,
          videoCtx: result6,
          batchLabel: value6,
          accumulatedCount: list.length,
          videoStartedAt: result,
          counters: counters,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet
        });
        local = result9.win || local;
        num2 += result9.videoMatched || 0;
        num3 += result9.videoLikes || 0;
        num4 += result9.videoReplies || 0;
        num5 += result9.videoFollows || 0;
        num6 += result9.videoFollowRequests || 0;
        num7 += result9.videoMessages || 0;
        if (flag2 && local && !local.isDestroyed()) {
          try {
            const local2 = local.webContents?.getURL?.() || "";
            flag4 = !isSameMonitorVideo(local3, local2);
          } catch (error) {
            flag4 = true;
          }
        }
        const value7 = flag2 ? "，继续抓取" : "，已到底";
        fn15(taskId, value + " " + value6 + "：新增 " + result8.length + "，命中 " + (result9.videoMatched || 0) + ("，点赞 " + (result9.videoLikes || 0) + "，回复 " + (result9.videoReplies || 0)) + ("，关注 " + (result9.videoFollows || 0) + "，私信 " + (result9.videoMessages || 0) + value7), (result9.videoMatched || 0) > 0 ? "success" : "info");
        if (result9.evaluateFailed || result9.stopped || !isRuntimeActive()) {
          flag5 = true;
          break;
        }
        if (!flag2) {
          break;
        }
      }
      if (!flag5) {
        fn15(taskId, value + " " + fn105(result6) + " 本视频完成：命中 " + num2 + "，点赞 " + num3 + "，回复 " + num4 + ("，关注 " + num5 + "，关注待通过 " + num6 + "，私信 " + num7) + ("，累计评论 " + list.length + "，本视频总耗时 " + fn16(Date.now() - result)), "info");
        fn77(taskId, videoItem.url);
      }
    } catch (error) {
      fn15(taskId, value + " 视频检查异常（已耗时 " + fn16(Date.now() - result) + "）：" + error.message, "error");
      if (isRuntimeActive() && (error?.code === "monitor_navigation_timeout" || error?.code === "monitor_renderer_unhealthy" || local?.isDestroyed?.())) {
        fn15(taskId, "监控页面加载异常，正在重建后台窗口后继续", "warning");
        try {
          local = await fn94(accountId, account.proxy, local, taskId);
        } catch (error) {
          fn15(taskId, "后台窗口重建失败：" + error.message, "error");
        }
      }
    } finally {
      if (isRuntimeActive() && local === local2 && local && !local.isDestroyed()) {
        local.__radarMonitorProcessedVideos = Number(local.__radarMonitorProcessedVideos || 0) + 1;
        const result = fn90(local);
        const value = local.__radarMonitorUnhealthy ? "渲染进程状态异常" : result >= num6 ? "渲染内存 " + result + "MB" : local.__radarMonitorProcessedVideos >= num5 ? "已连续处理 " + local.__radarMonitorProcessedVideos + " 个视频" : "";
        if (value) {
          fn15(taskId, "设备降载保护：" + value + "，正在轮换后台页面后继续（登录状态保留）", "info");
          try {
            local = await fn94(accountId, account.proxy, local, taskId);
          } catch (error) {
            fn15(taskId, "后台页面轮换失败：" + error.message, "warning");
          }
        }
      }
    }
    return {
      win: local,
      authorMismatch: flag
    };
  }
  async function fn132({
    taskId: taskId,
    accountId: accountId,
    config: config,
    accounts: accounts,
    monitorTasksApi: monitorTasksApi,
    isRuntimeActive: isRuntimeActive,
    claimNextWork: claimNextWork,
    workTotal: workTotal,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const result = accounts.find(arg1 => String(arg1.id) === String(accountId));
    if (!result) {
      return null;
    }
    const result2 = map.get(taskId);
    const local = result2?.currentAccountId;
    if (result2) {
      result2.currentAccountId = String(accountId);
    }
    try {
      return await fn133({
        taskId: taskId,
        accountId: accountId,
        account: result,
        config: config,
        accounts: accounts,
        monitorTasksApi: monitorTasksApi,
        isRuntimeActive: isRuntimeActive,
        claimNextWork: claimNextWork,
        workTotal: workTotal,
        seenKeys: seenKeys,
        updatedSeenKeys: updatedSeenKeys,
        seenKeySet: seenKeySet,
        seenEpoch: seenEpoch,
        knownUserKeySet: knownUserKeySet
      });
    } finally {
      if (result2) {
        if (local != null) {
          result2.currentAccountId = local;
        } else {
          delete result2.currentAccountId;
        }
      }
    }
  }
  async function fn133({
    taskId: taskId,
    accountId: accountId,
    account: account,
    config: config,
    accounts: accounts,
    monitorTasksApi: monitorTasksApi,
    isRuntimeActive: isRuntimeActive,
    claimNextWork: claimNextWork,
    workTotal: workTotal,
    seenKeys: seenKeys,
    updatedSeenKeys: updatedSeenKeys,
    seenKeySet: seenKeySet,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const obj = {
      matchedCount: 0,
      likeCount: 0,
      replyCount: 0,
      followCount: 0,
      followRequestCount: 0,
      messageCount: 0,
      newCommentsThisRound: 0,
      newWorks: 0
    };
    fn15(taskId, "账号 " + (account.nickname || account.name) + " 参与抢活（池内 " + workTotal + " 项：视频/主页）；意向判定：" + fn107(config, accountId), "info", {
      accountId: accountId
    });
    const result = fn66(taskId, monitorTasksApi);
    let num = 0;
    let num2 = 0;
    let num3 = 0;
    while (isRuntimeActive()) {
      const result2 = claimNextWork();
      if (!result2) {
        fn15(taskId, num > 0 ? "本轮任务池已空，账号 " + (account.nickname || account.name) + " 收工（已领取 " + num + " 项）" : "本轮任务池已空，账号 " + (account.nickname || account.name) + " 收工", "info", {
          accountId: accountId
        });
        break;
      }
      num += 1;
      if (result2.type === "author") {
        num3 += 1;
        const {
          authorItem: authorItem,
          authorIndex: authorIndex,
          authorTotal: authorTotal
        } = result2;
        fn15(taskId, "账号 " + (account.nickname || account.name) + " 领取主播主页 [" + (authorIndex + 1) + "/" + authorTotal + "] " + (authorItem.name || authorItem.url), "info", {
          accountId: accountId
        });
        const result3 = await fn34(accountId, taskId, async () => {
          let result2 = await fn28(accountId, account.proxy, taskId);
          return fn127({
            taskId: taskId,
            accountId: accountId,
            account: account,
            authorItem: authorItem,
            authorIndex: authorIndex,
            authorTotal: authorTotal,
            config: config,
            accounts: accounts,
            monitorTasksApi: monitorTasksApi,
            isRuntimeActive: isRuntimeActive,
            seenKeys: seenKeys,
            updatedSeenKeys: updatedSeenKeys,
            seenKeySet: seenKeySet,
            counters: obj,
            monitorTaskName: result,
            win: result2,
            seenEpoch: seenEpoch,
            knownUserKeySet: knownUserKeySet
          });
        }, isRuntimeActive);
        obj.newWorks += Number(result3?.discovered) || 0;
        continue;
      }
      num2 += 1;
      const {
        videoItem: videoItem,
        videoIndex: videoIndex,
        videoTotal: videoTotal
      } = result2;
      fn15(taskId, "账号 " + (account.nickname || account.name) + " 领取视频 [" + (videoIndex + 1) + "/" + videoTotal + "] " + fn105(fn104(videoItem), "…"), "info", {
        accountId: accountId
      });
      await fn34(accountId, taskId, async () => {
        let result2 = await fn28(accountId, account.proxy, taskId);
        return fn128({
          taskId: taskId,
          accountId: accountId,
          account: account,
          config: config,
          videoItem: videoItem,
          videoIndex: videoIndex,
          videoTotal: videoTotal,
          accounts: accounts,
          monitorTasksApi: monitorTasksApi,
          isRuntimeActive: isRuntimeActive,
          seenKeys: seenKeys,
          updatedSeenKeys: updatedSeenKeys,
          seenKeySet: seenKeySet,
          counters: obj,
          monitorTaskName: result,
          win: result2,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet
        });
      }, isRuntimeActive);
    }
    if (num > 0) {
      monitorTasksApi.incrementStats(taskId, {
        checks: 1,
        newComments: obj.newCommentsThisRound,
        commentsTotal: obj.newCommentsThisRound,
        matched: obj.matchedCount,
        likes: obj.likeCount,
        replies: obj.replyCount,
        follows: obj.followCount,
        followRequests: obj.followRequestCount,
        messages: obj.messageCount,
        lastCycleAt: Date.now(),
        lastCycleComments: obj.newCommentsThisRound
      });
      fn15(taskId, "账号 " + (account.nickname || account.name) + " 本轮完成：领取 " + num + " 项（视频 " + num2 + " · 主页 " + num3 + "），新评论 " + obj.newCommentsThisRound + " 条，命中 " + obj.matchedCount + "，点赞 " + obj.likeCount + "，回复 " + obj.replyCount + "，关注 " + obj.followCount + "，关注待通过 " + obj.followRequestCount + "，私信 " + obj.messageCount, obj.newCommentsThisRound > 0 || obj.matchedCount > 0 ? "success" : "info", {
        accountId: accountId
      });
      fn81(taskId, {
        type: "stats-update",
        accountId: accountId,
        statsDelta: {
          checks: 1,
          newComments: obj.newCommentsThisRound,
          commentsTotal: obj.newCommentsThisRound,
          matched: obj.matchedCount,
          likes: obj.likeCount,
          replies: obj.replyCount,
          follows: obj.followCount,
          followRequests: obj.followRequestCount,
          messages: obj.messageCount,
          lastCycleComments: obj.newCommentsThisRound,
          lastCycleAt: Date.now()
        },
        ts: Date.now()
      });
    }
    return {
      commentsScanned: obj.newCommentsThisRound,
      matchedCount: obj.matchedCount,
      likeCount: obj.likeCount,
      replyCount: obj.replyCount,
      followCount: obj.followCount,
      followRequestCount: obj.followRequestCount,
      messageCount: obj.messageCount,
      newWorks: obj.newWorks,
      claimedCount: num,
      claimedVideos: num2,
      claimedAuthors: num3
    };
  }
  function fn134(options = {}) {
    const obj = {
      ...options
    };
    if (!Array.isArray(obj.videoUrls)) {
      obj.videoUrls = [];
    }
    if (!Array.isArray(obj.authorUrls)) {
      obj.authorUrls = [];
    }
    if (!Array.isArray(obj.selectedAccounts)) {
      obj.selectedAccounts = [];
    }
    const value = Array.isArray(obj.monitorTargetTypes) ? obj.monitorTargetTypes.filter(arg1 => arg1 === "video" || arg1 === "author") : [];
    const set = new Set();
    if (value.length > 0) {
      value.forEach(arg1 => set.add(arg1));
    } else {
      if ((obj.videoUrls || []).some(arg1 => arg1?.url)) {
        set.add("video");
      }
      if ((obj.authorUrls || []).some(arg1 => arg1?.url)) {
        set.add("author");
      }
      if (set.size === 0) {
        set.add("video");
      }
    }
    obj.monitorTargetTypes = [...set];
    for (const item of MONITOR_ACTION_LIMIT_SPECS) {
      obj[item.enabledField] = obj[item.enabledField] === true;
      let result = Number(obj[item.minField]);
      let result2 = Number(obj[item.maxField]);
      if (!Number.isFinite(result)) {
        result = 10;
      }
      if (!Number.isFinite(result2)) {
        result2 = 20;
      }
      result = Math.max(1, Math.min(10000, Math.floor(result)));
      result2 = Math.max(1, Math.min(10000, Math.floor(result2)));
      if (result > result2) {
        [result, result2] = [result2, result];
      }
      obj[item.minField] = result;
      obj[item.maxField] = result2;
    }
    obj.profileActionGenderFilter = normalizeGenderFilter(obj.profileActionGenderFilter, "all");
    obj.profileActionAgeFilterEnabled = obj.profileActionAgeFilterEnabled === true;
    let result = Number(obj.profileActionAgeMin);
    let result2 = Number(obj.profileActionAgeMax);
    if (!Number.isFinite(result)) {
      result = 0;
    }
    if (!Number.isFinite(result2)) {
      result2 = 50;
    }
    result = Math.max(0, Math.min(120, Math.floor(result)));
    result2 = Math.max(0, Math.min(120, Math.floor(result2)));
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    obj.profileActionAgeMin = result;
    obj.profileActionAgeMax = result2;
    obj.enableVideoComment = obj.enableVideoComment === true;
    obj.videoCommentMode = obj.videoCommentMode === "custom" ? "custom" : "ai";
    obj.videoCommentContent = String(obj.videoCommentContent || "");
    obj.videoCommentUseRandomSuffix = obj.videoCommentUseRandomSuffix === true;
    obj.enableVideoCommentWithoutText = obj.enableVideoCommentWithoutText === true;
    obj.enableVideoCommentImage = obj.enableVideoCommentImage === true;
    obj.enableVideoCommentExpression = obj.enableVideoCommentExpression === true;
    obj.enableVideoCommentMention = obj.enableVideoCommentMention === true;
    if (!Array.isArray(obj.videoCommentImagePaths)) {
      obj.videoCommentImagePaths = [];
    }
    {
      let result = Number(obj.videoCommentExpressionCount);
      if (!Number.isFinite(result)) {
        result = 3;
      }
      obj.videoCommentExpressionCount = Math.max(1, Math.min(8, Math.floor(result)));
    }
    {
      const result = Number(obj.videoCommentAttachmentPercent);
      obj.videoCommentAttachmentPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, Math.round(result))) : 20;
    }
    obj.videoCommentMentionPosition = obj.videoCommentMentionPosition === "after" ? "after" : "before";
    {
      const result = Number(obj.videoCommentMentionPercent);
      obj.videoCommentMentionPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, Math.round(result))) : 100;
    }
    obj.commentOnProfileFirstWork = obj.commentOnProfileFirstWork === true;
    if (!["reply", "skip"].includes(obj.profileFirstCommentFallbackMode)) {
      obj.profileFirstCommentFallbackMode = "reply";
    }
    const result3 = Number(obj.profileFirstWorkLikePercent);
    obj.profileFirstWorkLikePercent = Number.isFinite(result3) ? Math.max(0, Math.min(100, Math.round(result3))) : 10;
    const result4 = Number(obj.profileFirstWorkCollectPercent);
    obj.profileFirstWorkCollectPercent = Number.isFinite(result4) ? Math.max(0, Math.min(100, Math.round(result4))) : 10;
    obj.profileFirstGenderFilter = normalizeGenderFilter(obj.profileFirstGenderFilter, "all");
    obj.profileFirstAgeFilterEnabled = obj.profileFirstAgeFilterEnabled === true;
    let result5 = Number(obj.profileFirstAgeMin);
    let result6 = Number(obj.profileFirstAgeMax);
    if (!Number.isFinite(result5)) {
      result5 = 0;
    }
    if (!Number.isFinite(result6)) {
      result6 = 50;
    }
    result5 = Math.max(0, Math.min(120, Math.floor(result5)));
    result6 = Math.max(0, Math.min(120, Math.floor(result6)));
    if (result5 > result6) {
      [result5, result6] = [result6, result5];
    }
    obj.profileFirstAgeMin = result5;
    obj.profileFirstAgeMax = result6;
    obj.commentUseRandomSuffix = obj.commentUseRandomSuffix === true;
    obj.enableCommentWithoutText = obj.enableCommentWithoutText === true;
    obj.enableCommentImage = obj.enableCommentImage === true;
    obj.enableCommentExpression = obj.enableCommentExpression === true;
    obj.enableCommentMention = obj.enableCommentMention === true;
    if (!Array.isArray(obj.commentImagePaths)) {
      const result = String(obj.commentImagePath || "").trim();
      obj.commentImagePaths = result ? [result] : [];
    }
    let result7 = Number(obj.commentExpressionCount);
    if (!Number.isFinite(result7)) {
      result7 = 3;
    }
    obj.commentExpressionCount = Math.max(1, Math.min(8, Math.floor(result7)));
    if (Object.prototype.hasOwnProperty.call(options || {}, "commentAttachmentPercent")) {
      const result = Number(obj.commentAttachmentPercent);
      obj.commentAttachmentPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, Math.round(result))) : 20;
    } else if (obj.enableCommentImage === true || obj.enableCommentExpression === true || obj.enableCommentMention === true) {
      obj.commentAttachmentPercent = 100;
    } else {
      obj.commentAttachmentPercent = 20;
    }
    obj.commentMentionPosition = obj.commentMentionPosition === "after" ? "after" : "before";
    {
      const result = Number(obj.commentMentionPercent);
      obj.commentMentionPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, Math.round(result))) : 100;
    }
    obj.actionCountAutoResetEnabled = obj.actionCountAutoResetEnabled === true;
    obj.actionCountAutoResetTime = normalizeActionCountResetTime(obj.actionCountAutoResetTime, "00:00");
    return obj;
  }
  async function fn135(arg1) {
    const result = map.get(arg1);
    if (!result || result.running) {
      return;
    }
    const local = () => map.get(arg1) === result;
    result.running = true;
    const result2 = Date.now();
    let local2 = null;
    let text = "done";
    let num = 1;
    let num2 = 0;
    let num3 = 0;
    let num4 = 0;
    let num5 = 0;
    let num6 = 0;
    let num7 = 0;
    let num8 = 0;
    let num9 = 0;
    try {
      const {
        accounts: accounts
      } = result;
      result.config = fn134(result.config);
      const value = result.config;
      const local3 = value.selectedAccounts || [];
      try {
        const result3 = result.monitorTasksApi.beginCycle(arg1, {
          startedAt: result2
        });
        local2 = result3?.cycles?.[0]?.id || null;
        num = Number(result3?.cycles?.[0]?.round) || 1;
        result.currentCycleId = local2;
        fn81(arg1, {
          type: "cycle-start",
          ts: result2,
          cycleId: local2
        });
      } catch (error) {}
      const result3 = (value.monitorTargetTypes || []).includes("video");
      const result4 = (value.monitorTargetTypes || []).includes("author");
      const value2 = result3 ? (Array.isArray(value.videoUrls) ? value.videoUrls : []).filter(arg1 => arg1?.url && String(arg1.source || "") !== "author_latest") : [];
      const value3 = value2.filter(arg1 => isMonitorVideoUrlInvalid(arg1)).length;
      const value4 = value2.length - value3;
      const value5 = result4 ? (value.authorUrls || []).filter(arg1 => arg1?.url) : [];
      const value6 = value5.filter(arg1 => isMonitorAuthorUrlInvalid(arg1)).length;
      const value7 = value5.length - value6;
      fn15(arg1, "开始第 " + num + " 轮轮询（指定视频 " + value4 + ("" + (value3 > 0 ? "，失效跳过 " + value3 : "")) + (" · 主播主页 " + value7) + ("" + (value6 > 0 ? "，主页失效跳过 " + value6 : "")) + "；主页领取后当场处理最新作品）", "info");
      if (!result.urlsResolved) {
        fn15(arg1, "正在检测并规范化监控链接…", "info");
        if (result3) {
          await fn120(arg1, value);
        }
        if (result4) {
          await fn125(arg1, value);
        }
        if (!local()) {
          return;
        }
        result.urlsResolved = true;
        fn15(arg1, "链接检测完成，准备领取任务并打开页面…", "info");
      }
      const value8 = result3 ? (Array.isArray(value.videoUrls) ? value.videoUrls : []).filter(arg1 => arg1?.url && String(arg1.source || "") !== "author_latest" && !isMonitorVideoUrlInvalid(arg1)) : [];
      const value9 = result4 ? (Array.isArray(value.authorUrls) ? value.authorUrls : []).map(fn108).filter(arg1 => arg1 && !isMonitorAuthorUrlInvalid(arg1)) : [];
      if (value3 > 0) {
        fn15(arg1, "本轮跳过 " + value3 + " 条已标记失效的视频链接（详见任务详情）", "info");
      }
      if (value6 > 0) {
        fn15(arg1, "本轮跳过 " + value6 + " 条已标记失效的主播主页（详见任务详情）", "info");
      }
      if (value9.length === 0 && value8.length === 0) {
        fn15(arg1, value3 > 0 || value6 > 0 ? "当前没有可监控目标（配置的链接均已标记失效）" : "当前没有可监控目标（请配置主播主页或视频链接）", "warning");
      } else if (local3.length === 0) {
        fn15(arg1, "未选择监控账号，跳过本轮检查", "warning");
      } else {
        const list = [];
        value9.forEach((arg1, arg2) => {
          list.push({
            type: "author",
            authorItem: arg1,
            authorIndex: arg2,
            authorTotal: value9.length
          });
        });
        value8.forEach((arg1, arg2) => {
          list.push({
            type: "video",
            videoItem: arg1,
            videoIndex: arg2,
            videoTotal: value8.length
          });
        });
        const local2 = () => list.length > 0 ? list.shift() : null;
        const local4 = Number(result.seenInventoryEpoch) || 0;
        const result2 = fn50(arg1);
        const list2 = [...result2];
        const set = new Set(list2);
        const set2 = new Set();
        const result3 = fn74(arg1, result.monitorTasksApi, set2);
        result.liveSeenState = {
          updatedSeenKeys: list2,
          seenKeySet: set,
          seenEpoch: local4,
          knownUserKeySet: set2
        };
        const value2 = list.length;
        fn15(arg1, "本轮任务池 " + value2 + " 项（主页 " + value9.length + " · 视频 " + value8.length + "），" + local3.length + " 个账号抢活领取" + (result3 > 0 ? "；已加载本任务 " + result3 + " 个已研判用户用于跨视频去重" : ""), "info");
        try {
          const result3 = await Promise.all(local3.map(arg12 => fn132({
            taskId: arg1,
            accountId: arg12,
            config: value,
            accounts: accounts,
            monitorTasksApi: result.monitorTasksApi,
            isRuntimeActive: local,
            claimNextWork: local2,
            workTotal: value2,
            seenKeys: result2,
            updatedSeenKeys: list2,
            seenKeySet: set,
            seenEpoch: local4,
            knownUserKeySet: set2
          })));
          const result4 = fn51(arg1, list2, {
            seenEpoch: local4
          });
          if (!result4) {
            fn15(arg1, "本轮去重记录已在中途清空，未回写旧指纹", "info");
          }
          for (const item of result3) {
            if (!item) {
              continue;
            }
            num2 += item.commentsScanned || 0;
            num3 += item.matchedCount || 0;
            num4 += item.likeCount || 0;
            num5 += item.replyCount || 0;
            num6 += item.followCount || 0;
            num7 += item.followRequestCount || 0;
            num8 += item.messageCount || 0;
            num9 += item.newWorks || 0;
          }
          if (!local()) {
            return;
          }
        } finally {
          if (result.liveSeenState?.seenEpoch === local4) {
            result.liveSeenState = null;
          }
        }
      }
      if (!local()) {
        text = "stopped";
        return;
      }
      fn15(arg1, "本轮轮询结束：新评论 " + num2 + " 条，命中 " + num3 + "，点赞 " + num4 + "，回复 " + num5 + "，关注 " + num6 + "，关注待通过 " + num7 + "，私信 " + num8 + ("，整轮耗时 " + fn16(Date.now() - result2)), "success");
    } catch (error) {
      text = "error";
      if (local()) {
        fn15(arg1, "轮询异常（已运行 " + fn16(Date.now() - result2) + "）：" + error.message, "error");
      }
    } finally {
      if (!local() && text === "done") {
        text = "stopped";
      }
      const result3 = Date.now();
      if (local2) {
        try {
          fn83(arg1);
          result.monitorTasksApi.finishCycle(arg1, local2, {
            endedAt: result3,
            durationMs: Math.max(0, result3 - result2),
            status: text,
            newComments: num2,
            newWorks: num9,
            matched: num3,
            likes: num4,
            replies: num5,
            follows: num6,
            followRequests: num7,
            messages: num8
          });
        } catch (error) {}
      }
      result.currentCycleId = null;
      fn81(arg1, {
        type: "cycle-done",
        ts: result3,
        cycleId: local2,
        status: text
      });
      if (local()) {
        result.running = false;
      }
    }
  }
  function fn136(options = {}) {
    let result = Number(options.intervalSecondsMin);
    let result2 = Number(options.intervalSecondsMax);
    if ((!Number.isFinite(result) || !Number.isFinite(result2)) && options.intervalMinutes != null) {
      const result3 = Math.max(30, Math.round(Number(options.intervalMinutes) * 60));
      result = result3;
      result2 = result3;
    }
    if (!Number.isFinite(result)) {
      result = 60;
    }
    if (!Number.isFinite(result2)) {
      result2 = 120;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    result = Math.max(15, Math.floor(result));
    result2 = Math.max(result, Math.floor(result2));
    return {
      min: result,
      max: result2
    };
  }
  function fn137(arg1) {
    const {
      min: min,
      max: max
    } = fn136(arg1);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value * 1000;
  }
  function fn138(options = {}) {
    let result = Number(options.actionDelaySecondsMin);
    let result2 = Number(options.actionDelaySecondsMax);
    if (!Number.isFinite(result)) {
      result = 3;
    }
    if (!Number.isFinite(result2)) {
      result2 = 8;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    result = Math.max(1, Math.floor(result));
    result2 = Math.max(result, Math.floor(result2));
    return {
      min: result,
      max: result2
    };
  }
  function fn139(options = {}) {
    const {
      min: min,
      max: max
    } = fn138(options);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value * 1000;
  }
  async function fn116({
    taskId: taskId,
    config: config,
    isRuntimeActive: isRuntimeActive,
    logPrefix = ""
  }) {
    const {
      min: min,
      max: max
    } = fn138(config);
    const result = fn139(config);
    const result2 = String(logPrefix || "").trim();
    fn15(taskId, (result2 ? result2 + "，" : "") + "等待 " + Math.round(result / 1000) + " 秒后执行动作（区间 " + min + "–" + max + "s 随机）", "info");
    await new Promise(arg1 => setTimeout(arg1, result));
    return isRuntimeActive?.() !== false;
  }
  function fn140(arg1) {
    if (!arg1?.timer) {
      return;
    }
    clearTimeout(arg1.timer);
    arg1.timer = null;
  }
  function fn141(arg1) {
    if (!arg1?.actionResetTimer) {
      return;
    }
    clearTimeout(arg1.actionResetTimer);
    arg1.actionResetTimer = null;
  }
  function fn142(arg1, text = "schedule") {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    if (result.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const result2 = normalizeActionCountResetTime(result.config.actionCountAutoResetTime, "00:00");
    result.actionLimitState = fn4(result);
    result.actionLimitReachedLogged = new Set();
    result.lastActionCountResetAt = Date.now();
    const result3 = formatAccountActionLimitSummary(result.actionLimitState);
    fn15(arg1, text === "catchup" ? "自动动作数量已补重置（计划每日 " + result2 + "，累计统计不变）：" + result3 : "自动动作数量已按计划重置（每日 " + result2 + "，累计统计不变）：" + result3, "info");
    return true;
  }
  function fn143(arg1) {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    fn141(result);
    if (result.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const result2 = normalizeActionCountResetTime(result.config.actionCountAutoResetTime, "00:00");
    const result3 = msUntilNextActionCountReset(result2);
    const date = new Date(Date.now() + result3);
    const result4 = date.toLocaleString("zh-CN", {
      hour12: false
    });
    result.actionResetTimer = setTimeout(() => {
      const result = map.get(arg1);
      if (!result) {
        return;
      }
      result.actionResetTimer = null;
      fn142(arg1, "schedule");
      fn143(arg1);
    }, result3);
    fn15(arg1, "自动动作数量自动重置已启用：每日 " + result2 + "（下次约 " + result4 + "；仅重置限制数量本周期计数）", "info");
    return true;
  }
  function fn144(arg1) {
    const result = map.get(arg1);
    if (!result || result.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const result2 = getLatestActionCountResetBoundary(result.config.actionCountAutoResetTime);
    const local = Number(result.lastActionCountResetAt) || 0;
    if (local >= result2) {
      return false;
    }
    return fn142(arg1, "catchup");
  }
  function fn145(arg1, arg2, text = "poll") {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    fn140(result);
    const result2 = Math.max(0, Math.floor(Number(arg2) || 0));
    const result3 = Date.now();
    result.scheduledAt = result3;
    result.plannedDelayMs = result2;
    result.nextRunAt = result3 + result2;
    result.scheduleKind = text;
    result.timer = setTimeout(() => {
      const result = map.get(arg1);
      if (result) {
        result.timer = null;
      }
      fn146(arg1, "timer").catch(arg12 => {
        fn15(arg1, "轮询定时器触发异常：" + (arg12.message || arg12), "error");
      });
    }, result2);
    return true;
  }
  function fn147(arg1, arg2) {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    result.config = fn134(arg2 || {});
    result.actionLimitState = fn4(result);
    result.actionLimitReachedLogged = new Set();
    fn15(arg1, "任务配置已实时更新（监控对象：" + (result.config.monitorTargetTypes || []).join(", ") + "）", "info");
    fn15(arg1, "动作数量限制已按新配置重置：" + formatAccountActionLimitSummary(result.actionLimitState), "info");
    fn143(arg1);
    return true;
  }
  function fn148(arg1) {
    const result = map.get(arg1);
    if (!result?.nextRunAt || result.running || result.triggering) {
      return false;
    }
    fn140(result);
    const result2 = Math.max(0, result.nextRunAt - Date.now());
    result.timer = setTimeout(() => {
      const result = map.get(arg1);
      if (result) {
        result.timer = null;
      }
      fn146(arg1, "timer").catch(arg12 => {
        fn15(arg1, "轮询定时器触发异常：" + (arg12.message || arg12), "error");
      });
    }, result2);
    return true;
  }
  async function fn146(arg1, text = "timer") {
    const result = map.get(arg1);
    if (!result || result.running || result.triggering) {
      return false;
    }
    result.triggering = true;
    fn140(result);
    fn144(arg1);
    const local = Number(result.nextRunAt) || Date.now();
    const result2 = Math.max(0, Date.now() - local);
    const local2 = result.scheduleKind || "poll";
    result.nextRunAt = null;
    result.scheduledAt = null;
    result.plannedDelayMs = null;
    result.scheduleKind = null;
    const result3 = (result2 / 1000).toFixed(result2 >= 1000 ? 1 : 2);
    if (local2 === "initial") {
      fn15(arg1, "首次轮询定时器已触发（误差 " + result3 + " 秒），开始执行", "info");
    } else if (text === "watchdog") {
      fn15(arg1, "到点守护检测到轮询已到期，延迟 " + result3 + " 秒后补触发下一整轮", "warning");
    } else if (text === "system-resume") {
      fn15(arg1, "系统恢复后发现轮询已到期，延迟 " + result3 + " 秒后立即补触发下一整轮", "warning");
    } else if (result2 >= num27) {
      fn15(arg1, "轮询定时器延迟 " + result3 + " 秒后触发，开始下一整轮", "warning");
    } else {
      fn15(arg1, "轮询定时器已按计划触发（误差 " + result3 + " 秒），开始下一整轮", "info");
    }
    const result4 = acquireTaskRuntimeGuard(local3(arg1), {
      type: "video-monitor",
      taskId: arg1
    });
    if (!result4) {
      fn15(arg1, "后台运行守护当前未生效，任务仍会继续并由到点守护检测", "warning");
    }
    try {
      await fn135(arg1);
      return true;
    } finally {
      const result2 = map.get(arg1);
      if (result2 === result) {
        result2.triggering = false;
        fn149(arg1);
      }
    }
  }
  function fn150() {
    if (local2 || map.size === 0) {
      return;
    }
    local2 = setInterval(() => {
      const result = Date.now();
      for (const [local, local2] of map.entries()) {
        if (local2.running || local2.triggering || !local2.nextRunAt) {
          continue;
        }
        if (result < local2.nextRunAt + num26) {
          continue;
        }
        fn146(local, "watchdog").catch(arg1 => {
          fn15(local, "到点守护补触发失败：" + (arg1.message || arg1), "error");
        });
      }
    }, num25);
    if (typeof local2.unref === "function") {
      local2.unref();
    }
  }
  function fn151() {
    if (map.size > 0 || !local2) {
      return;
    }
    clearInterval(local2);
    local2 = null;
  }
  function fn149(arg1) {
    const result = map.get(arg1);
    if (!result) {
      return;
    }
    const {
      min: min,
      max: max
    } = fn136(result.config);
    const result2 = fn137(result.config);
    const value = (result.config.videoUrls || []).filter(arg1 => arg1?.url).length;
    const value2 = (result.config.authorUrls || []).filter(arg1 => arg1?.url).length;
    fn15(arg1, "下次完整轮询将在约 " + Math.round(result2 / 1000) + " 秒后开始（随机区间 " + min + "–" + max + " 秒；本轮共 " + value + " 个视频、" + value2 + " 个主播；整轮处理耗时不计入该间隔）", "info");
    fn145(arg1, result2, "poll");
  }
  function fn152(arg1, arg2, arg3) {
    const value2 = arg1.id;
    fn153(value2);
    const result2 = fn134(arg1.configSnapshot || {});
    const value3 = Array.isArray(arg2) ? arg2 : [];
    for (const item of value3) {
      const result = String(item?.id || item?.accountId || "").trim();
      if (!result) {
        continue;
      }
      if (typeof isCommentLeadgenAccountBusy === "function" && isCommentLeadgenAccountBusy(result)) {
        const error = new Error("账号 " + result + " 正在执行评论获客，无法同时启动监控");
        error.code = "monitor_account_busy";
        throw error;
      }
      if (typeof isEntityLeadgenAccountBusy === "function" && isEntityLeadgenAccountBusy(result)) {
        const error = new Error("账号 " + result + " 正在执行线索采集，无法同时启动监控");
        error.code = "monitor_account_busy";
        throw error;
      }
    }
    const {
      min: min,
      max: max
    } = fn136(result2);
    const result3 = createAccountActionLimitStore(result2, MONITOR_ACTION_LIMIT_SPECS, value3.map(arg1 => arg1?.id).filter(Boolean));
    map.set(value2, {
      timer: null,
      actionResetTimer: null,
      config: result2,
      accounts: value3,
      monitorTasksApi: arg3,
      running: false,
      triggering: false,
      urlsResolved: false,
      scheduledAt: null,
      plannedDelayMs: null,
      nextRunAt: null,
      scheduleKind: null,
      actionLimitState: result3,
      actionLimitReachedLogged: new Set(),
      lastActionCountResetAt: Date.now()
    });
    const result4 = acquireTaskRuntimeGuard(local3(value2), {
      type: "video-monitor",
      taskId: value2
    });
    fn150();
    fn15(value2, "监控任务已启动，轮询间隔 " + min + "–" + max + " 秒（视频 " + (result2.videoUrls || []).length + " · 主播 " + (result2.authorUrls || []).length + "）", "success");
    const result5 = formatAccountActionLimitSummary(result3);
    const result6 = Object.values(result3?.template?.limits || {}).some(arg1 => arg1?.enabled);
    fn15(value2, result6 ? "动作数量限制：" + result5 + "；各账号独立计数，停止或重启任务后清零并重新取值" : "动作数量限制：全部不限（未开启「限制数量」）", "info");
    const local = GENDER_FILTER_LABELS[result2.profileActionGenderFilter] || GENDER_FILTER_LABELS.all;
    const value4 = result2.profileActionAgeFilterEnabled ? result2.profileActionAgeMin + "-" + result2.profileActionAgeMax + " 岁" : "关闭";
    fn15(value2, "关注/私信主页筛选：性别 " + local + "；年龄 " + value4, "info");
    if (result2.enableAutoReply && result2.commentOnProfileFirstWork) {
      const local = GENDER_FILTER_LABELS[result2.profileFirstGenderFilter] || GENDER_FILTER_LABELS.all;
      const value = result2.profileFirstAgeFilterEnabled ? result2.profileFirstAgeMin + "-" + result2.profileFirstAgeMax + " 岁" : "关闭";
      fn15(value2, "自动回复·首作评论已开启（无首作=" + (result2.profileFirstCommentFallbackMode === "skip" ? "仅首作" : "回评原评论") + "；性别 " + local + "；年龄 " + value + "；点赞 " + result2.profileFirstWorkLikePercent + "% / 收藏 " + result2.profileFirstWorkCollectPercent + "%）", "info");
    }
    fn15(value2, result4 ? "后台运行守护已启用，最小化不会暂停监控任务" : "后台运行守护启用失败，已保留到点守护继续检测", result4 ? "info" : "warning");
    fn15(value2, "设备性能保护：检测到 " + value.toFixed(1) + "GB 内存，后台页面最多同时活跃 " + result + " 个、空闲保留 " + num3 + " 个；渲染内存连续达到 " + num6 + "MB 时先保存评论进度并续跑当前视频，单视频 " + Math.round(num10 / 1000) + " 秒期限和 " + MONITOR_MAX_COMMENTS + " 条上限保持不变", "info");
    fn143(value2);
    fn145(value2, 3000, "initial");
    return true;
  }
  function fn153(arg1) {
    const result = map.get(arg1);
    if (!result) {
      return false;
    }
    fn140(result);
    fn141(result);
    fn83(arg1);
    const result2 = (Array.isArray(result.accounts) ? result.accounts : []).map(arg1 => String(arg1?.id || arg1?.accountId || "").trim()).filter(Boolean);
    map.delete(arg1);
    const result4 = fn42(arg1);
    try {
      result3.releaseMonitorLiveSurfaces(result2.length ? result2 : null);
    } catch (error) {}
    if (map.size > 0 && result4.size > 0) {
      for (const [local, local2] of map6.entries()) {
        if (!local2 || local2.isDestroyed() || !result4.has(local2.webContents.id)) {
          continue;
        }
        map6.delete(local);
        try {
          local2.destroy();
        } catch (error) {}
      }
    }
    releaseTaskRuntimeGuard(local3(arg1));
    if (map.size === 0) {
      fn35();
    }
    fn151();
    fn15(arg1, "监控任务已停止", "info");
    return true;
  }
  function fn154(arg1) {
    return map.has(arg1);
  }
  function fn155(arg1) {
    if (!arg1) {
      return false;
    }
    const result = String(arg1).trim().replace(/^(douyin_|kuaishou_|xhs_)/, "");
    for (const item of map.values()) {
      const value = Array.isArray(item.accounts) ? item.accounts : [];
      if (value.some(arg1 => String(arg1?.id || arg1?.accountId || "").trim() === result)) {
        return true;
      }
    }
    const result2 = map6.get(result);
    return !!result2 && !result2.isDestroyed();
  }
  function fn156() {
    return [...map.keys()];
  }
  function fn157() {
    const list = [...map.keys()];
    list.forEach(arg1 => fn153(arg1));
    fn151();
  }
  function fn158() {
    const result = Date.now();
    let num = 0;
    for (const [local, local2] of map.entries()) {
      acquireTaskRuntimeGuard(local3(local), {
        type: "video-monitor",
        taskId: local
      });
      if (local2.running || local2.triggering || !local2.nextRunAt) {
        continue;
      }
      num += 1;
      fn144(local);
      if (!local2.actionResetTimer && local2.config?.actionCountAutoResetEnabled === true) {
        fn143(local);
      }
      if (local2.nextRunAt <= result) {
        fn146(local, "system-resume").catch(arg1 => {
          fn15(local, "系统恢复补触发失败：" + (arg1.message || arg1), "error");
        });
      } else {
        fn148(local);
        fn15(local, "系统恢复，轮询计划仍有效，将在约 " + Math.ceil((local2.nextRunAt - result) / 1000) + " 秒后开始下一整轮", "info");
      }
    }
    fn150();
    return num;
  }
  function fn159() {
    return [...map6.values()].filter(arg1 => arg1 && !arg1.isDestroyed()).map(arg1 => arg1.webContents).filter(arg1 => arg1 && !arg1.isDestroyed?.());
  }
  return {
    startTask: fn152,
    stopTask: fn153,
    updateTaskConfig: fn147,
    isTaskRunning: fn154,
    isAccountRunning: fn155,
    listRunningTaskIds: fn156,
    listWebContents: fn159,
    getTaskLogs: fn86,
    clearTaskLogs: fn87,
    handleSystemResume: fn158,
    stopAll: fn157,
    handleActionResult: fn38,
    handleActionProgress: fn39,
    handleScrapeResult: fn40,
    handleScrapeProgress: fn41,
    handleAuthorWorksResult: fn43,
    handleAuthorNavResult: fn44,
    showMonitorWindow: fn27,
    hideMonitorWindow: fn29,
    consumePendingLivePreview: result3.consumePendingLivePreview,
    getCommentSeenInventoryStats: fn52,
    clearCommentSeenInventory: fn53
  };
}
module.exports = {
  createVideoMonitorRunner: createVideoMonitorRunner
};
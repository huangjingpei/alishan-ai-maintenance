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
function resolveDouyinMonitorVideoUrl(_0x4f03a1, _0x74f329 = null) {
  const _0x47561a = toCanonicalDouyinVideoUrl(_0x4f03a1) || String(_0x4f03a1 || "").trim();
  return buildDouyinCommentLocateUrl(_0x47561a, _0x74f329) || _0x47561a;
}
function isMonitorVideoUrlInvalid(_0x263bb5 = {}) {
  return !!_0x263bb5 && !!_0x263bb5.invalid;
}
function formatMonitorInvalidReason(_0x158869 = "") {
  const _0x3b6c97 = String(_0x158869 || "").trim();
  if (!_0x3b6c97) {
    return "链接失效或无法观看";
  }
  if (/user_not_found|USER_NOT_FOUND|用户不存在|无此用户|主页链接失效/i.test(_0x3b6c97)) {
    return "用户不存在（主页链接失效）";
  }
  if (/bare_jingxuan/i.test(_0x3b6c97)) {
    return "精选页无详情（打开超时/慢网，未永久失效）";
  }
  if (/unavailable/i.test(_0x3b6c97)) {
    return "视频不存在或无法观看";
  }
  return _0x3b6c97;
}
function isMonitorAuthorUrlInvalid(_0x32c1f7 = {}) {
  return !!_0x32c1f7 && !!_0x32c1f7.invalid;
}
function monitorVideoItemsMatch(_0xf7cf7a, _0x2501c9) {
  const _0x5e4e0d = String(_0xf7cf7a?.url || "").trim();
  const _0x185f84 = String(_0x2501c9?.url || "").trim();
  if (_0x5e4e0d && _0x185f84 && _0x5e4e0d === _0x185f84) {
    return true;
  }
  const _0x464ce3 = extractDouyinVideoId(_0x5e4e0d);
  const _0xd88a3e = extractDouyinVideoId(_0x185f84);
  return !!_0x464ce3 && !!_0xd88a3e && _0x464ce3 === _0xd88a3e;
}
function isSameMonitorVideo(_0x14ee66, _0x2d768f) {
  const _0x22cfe7 = extractDouyinVideoId(_0x14ee66);
  const _0x4d3456 = extractDouyinVideoId(_0x2d768f);
  if (_0x22cfe7 && _0x4d3456) {
    return _0x22cfe7 === _0x4d3456;
  }
  return String(_0x14ee66 || "").trim() === String(_0x2d768f || "").trim();
}
function resolveMonitorExpectedAuthor(_0x42184d = {}) {
  if (String(_0x42184d?.source || "") !== "author_latest") {
    return {
      url: "",
      secUid: ""
    };
  }
  const _0x39f10d = String(_0x42184d.authorUrl || _0x42184d.authorProfileUrl || "").trim();
  return {
    url: _0x39f10d,
    secUid: resolveDouyinAuthorIdentityKey(_0x39f10d)
  };
}
function isMonitorScrapeIdentityMismatch(_0x54ff88 = {}) {
  return !!_0x54ff88?.videoMismatch || !!_0x54ff88?.authorMismatch || !!_0x54ff88?.authorUnconfirmed;
}
function resolveMonitorWebhookTarget(_0x379df5 = {}) {
  if (!_0x379df5.enableWebhook) {
    return null;
  }
  const _0x1db77f = String(_0x379df5.webhookType || "").trim().toLowerCase() === "dingtalk" ? "dingtalk" : "feishu";
  const _0x48046e = _0x1db77f === "dingtalk" ? String(_0x379df5.webhookUrlDingtalk || _0x379df5.webhookUrl || "").trim() : String(_0x379df5.webhookUrlFeishu || _0x379df5.webhookUrl || "").trim();
  const _0x105345 = _0x1db77f === "dingtalk" ? String(_0x379df5.webhookSecretDingtalk || _0x379df5.webhookSecret || "").trim() : "";
  if (!isHttpWebhookUrl(_0x48046e)) {
    return null;
  }
  return {
    type: _0x1db77f,
    url: _0x48046e,
    secret: _0x105345
  };
}
function clipMonitorWebhookText(_0x33965d, _0x3379f4 = 120) {
  const _0xfed0d1 = String(_0x33965d || "").replace(/\s+/g, " ").trim();
  if (!_0xfed0d1) {
    return "";
  }
  if (_0xfed0d1.length > _0x3379f4) {
    return _0xfed0d1.slice(0, _0x3379f4) + "…";
  } else {
    return _0xfed0d1;
  }
}
function buildMonitorMatchWebhookPayload(_0x5529e0, _0x3e664c = {}) {
  const _0x13bef5 = _0x3e664c.title || "监控任务命中";
  const _0xbefb2a = _0x3e664c.content || "";
  const _0x201417 = _0x3e664c.time || new Date().toLocaleString();
  if (_0x5529e0 === "dingtalk") {
    return {
      msgtype: "markdown",
      markdown: {
        title: _0x13bef5,
        text: "### " + _0x13bef5 + "\n\n" + _0xbefb2a + "\n\n> ⏰ " + _0x201417
      }
    };
  }
  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: _0x13bef5
        },
        template: "orange"
      },
      elements: [{
        tag: "div",
        text: {
          tag: "lark_md",
          content: _0xbefb2a
        }
      }, {
        tag: "note",
        elements: [{
          tag: "plain_text",
          content: "⏰ " + _0x201417
        }]
      }]
    }
  };
}
function isMonitorWebhookResponseSuccess(_0x691df8, _0x100b99) {
  if (!_0x100b99 || _0x100b99.status !== 200) {
    return false;
  }
  const _0x2c028b = _0x100b99.data;
  if (_0x2c028b && _0x2c028b.errcode !== undefined && _0x2c028b.errcode !== 0) {
    return false;
  }
  if (_0x691df8 === "feishu" && _0x2c028b && _0x2c028b.code !== undefined && _0x2c028b.code !== 0) {
    return false;
  }
  return true;
}
function createVideoMonitorRunner(_0xd69489) {
  const {
    app: _0x1b7ef4,
    store: _0x3639c8,
    fs: _0x5bb1c6,
    axios: _0x392dab,
    mainWindow: _0x4cfaac,
    runtimeConfig = null,
    applyAccountProxy: _0x4c8708,
    configureAutomationSession: _0x2c5a3a,
    attachProtocolGuard: _0xd73048,
    analyzeMonitorCommentsBatch: _0x4c5487,
    generateMonitorPersonaContent: _0x2a69d7,
    matchKeywords: _0xadaf23,
    isMonitorAccountAiEnabled: _0x3efaad,
    isMonitorAiIntentJudgeEnabled: _0x4b4cae,
    pickRandomTemplateLine: _0x4bf7c2,
    appendHistory: _0x1e1b1c,
    listKnownLeadUserKeys: _0x3395aa,
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
    resolveAutomationPreloadPath: _0x3b2787 = null,
    automationUserAgent = "",
    getViewSettingsMap = null,
    getMainWindow = null,
    isCommentLeadgenAccountBusy = null,
    isEntityLeadgenAccountBusy = null
  } = _0xd69489;
  const _0x5b15e0 = () => {
    if (typeof getMainWindow === "function") {
      try {
        return getMainWindow();
      } catch (_0x3f0e68) {}
    }
    return _0x4cfaac;
  };
  async function _0x586088(_0x3e66ba) {
    if (!runtimeConfig || !_0x3e66ba || _0x3e66ba.isDestroyed?.()) {
      return;
    }
    try {
      if (typeof runtimeConfig.ensureFetched === "function") {
        await runtimeConfig.ensureFetched();
      }
      runtimeConfig.pushToWebContents?.(_0x3e66ba);
    } catch (_0x20810d) {
      console.warn("[Monitor] runtime config push failed:", _0x20810d?.message || _0x20810d);
    }
  }
  const _0x21e6e0 = new Map();
  const _0x297008 = new Map();
  const _0x2f672f = new Map();
  const _0x8467de = new Map();
  const _0x130d12 = new Map();
  const _0x279862 = new Map();
  const _0x1a0154 = new Map();
  const _0x4089db = os.totalmem() / 1073741824;
  const _0x6a5c43 = os.cpus().length;
  let _0x268b98 = 2;
  if (_0x4089db < 12) {
    _0x268b98 = 1;
  } else if (_0x4089db < 24) {
    _0x268b98 = 2;
  } else if (_0x4089db < 40) {
    _0x268b98 = 4;
  } else if (_0x4089db < 56) {
    _0x268b98 = 6;
  } else {
    _0x268b98 = 10;
  }
  let _0x307fca = 4;
  if (_0x6a5c43 <= 4) {
    _0x307fca = 1;
  } else if (_0x6a5c43 <= 8) {
    _0x307fca = 2;
  } else if (_0x6a5c43 <= 12) {
    _0x307fca = 4;
  } else if (_0x6a5c43 <= 16) {
    _0x307fca = 6;
  } else {
    _0x307fca = 10;
  }
  const _0x10669c = Math.max(1, Math.min(_0x268b98, _0x307fca));
  let _0x26a7fd = 1;
  let _0x1cdebb = 10;
  let _0x934cfd = 3;
  let _0x494f62 = 550;
  let _0x2d4063 = 3;
  if (_0x10669c <= 1) {
    _0x26a7fd = 1;
    _0x1cdebb = 8;
    _0x934cfd = 2;
    _0x494f62 = 450;
    _0x2d4063 = 3;
  } else if (_0x10669c <= 2) {
    _0x26a7fd = 1;
    _0x1cdebb = 10;
    _0x934cfd = 3;
    _0x494f62 = 550;
    _0x2d4063 = 3;
  } else if (_0x10669c <= 4) {
    _0x26a7fd = 2;
    _0x1cdebb = 15;
    _0x934cfd = 6;
    _0x494f62 = 900;
    _0x2d4063 = 2;
  } else if (_0x10669c <= 6) {
    _0x26a7fd = 3;
    _0x1cdebb = 15;
    _0x934cfd = 8;
    _0x494f62 = 1000;
    _0x2d4063 = 2;
  } else {
    _0x26a7fd = 4;
    _0x1cdebb = 15;
    _0x934cfd = 10;
    _0x494f62 = 1200;
    _0x2d4063 = 2;
  }
  const _0x16f9ba = 2;
  const _0x19b687 = 45000;
  const _0x19e276 = 600000;
  const _0x41235d = 630000;
  const _0x5d2103 = 8000;
  const _0x42350e = 8000;
  const _0x2e0160 = 90000;
  const _0x1f40e5 = 800;
  const _0x55e74c = 120000;
  const _0x5a4f35 = 30000;
  const _0x599f51 = 2500;
  const _0x2c99f6 = 15000;
  const _0x2b1711 = 2;
  const _0x475409 = 45000;
  const _0x2a10aa = 1;
  const _0x446e66 = new Set(["monitor_scrape_timeout", "monitor_scrape_stalled", "monitor_scrape_page_timeout", "monitor_scrape_dispatch_failed", "monitor_renderer_unresponsive", "monitor_renderer_gone", "monitor_renderer_unhealthy", "monitor_window_closed"]);
  const _0x1e9edf = 500;
  const _0x3ef8bc = 50;
  const _0x1e0759 = 5000;
  const _0x2d70ce = 1000;
  const _0x1debcb = 5000;
  let _0x4fd334 = null;
  let _0x56d1cd = 0;
  const _0x210757 = [];
  const _0x41297e = _0x3934e9 => "video-monitor:" + _0x3934e9;
  function _0x30af1f() {
    if (typeof _0x3b2787 === "function") {
      try {
        const _0x524a23 = _0x3b2787();
        if (_0x524a23) {
          return _0x524a23;
        }
      } catch (_0x20c805) {}
    }
    return path.join(__dirname, "..", "automation-preload.js");
  }
  const _0x359f8a = createMonitorAutomationViewHostFactory({
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => new Map(),
    getMainWindow: _0x5b15e0,
    attachAutomationViewToBackgroundHost: attachAutomationViewToBackgroundHost,
    ensureBackgroundAutomationHostWindow: ensureBackgroundAutomationHostWindow,
    configureAutomationSession: _0x2c5a3a,
    attachProtocolGuard: _0xd73048,
    applyAccountProxy: _0x4c8708,
    resolveAutomationPreloadPath: _0x30af1f,
    automationUserAgent: automationUserAgent,
    store: _0x3639c8,
    getViewSettingsMap: getViewSettingsMap,
    destroyAutomationBrowserView: destroyAutomationBrowserView
  });
  const _0x362177 = createMonitorLivePreviewController({
    getMainWindow: _0x5b15e0,
    getPlatformViews: typeof getPlatformViews === "function" ? getPlatformViews : () => new Map(),
    getViewSettingsMap: getViewSettingsMap,
    getActiveTasks: () => _0x21e6e0,
    getMonitorWindows: () => _0x279862,
    automationLiveViewLifecycle: automationLiveViewLifecycle
  });
  const _0x14dbf9 = createMonitorAuthorWorkNav();
  const _0x14f1c8 = createMonitorProfileSubviewRunner({
    getInteractionViewsMap: typeof getInteractionViewsMap === "function" ? getInteractionViewsMap : () => new Map(),
    configureAutomationSession: _0x2c5a3a,
    attachProtocolGuard: _0xd73048,
    applyAccountProxy: _0x4c8708,
    resolveAutomationPreloadPath: _0x30af1f,
    automationUserAgent: automationUserAgent,
    store: _0x3639c8,
    runtimeConfig: runtimeConfig,
    automationViewportSession: automationViewportSession
  });
  function _0x1f3a3a(_0x18ae76 = {}) {
    const _0x3365e2 = (_0x18ae76.accounts || []).map(_0x187a3b => _0x187a3b?.id).filter(Boolean);
    if (_0x3365e2.length) {
      return _0x3365e2;
    }
    return (_0x18ae76.config?.selectedAccounts || []).filter(Boolean);
  }
  function _0x1f2cb2(_0x201e07 = {}) {
    return createAccountActionLimitStore(_0x201e07.config || {}, MONITOR_ACTION_LIMIT_SPECS, _0x1f3a3a(_0x201e07));
  }
  function _0x49ca0f(_0x462923, _0x1fb170) {
    const _0x3f42c3 = String(_0x1fb170 || "").trim();
    if (!_0x3f42c3) {
      return "";
    }
    const _0x2a1a6b = (_0x462923?.accounts || []).find(_0x34e4d7 => String(_0x34e4d7?.id) === _0x3f42c3);
    const _0x52d0da = _0x2a1a6b?.nickname || _0x2a1a6b?.name || "";
    if (_0x52d0da) {
      return "账号 " + _0x52d0da + " ";
    } else {
      return "账号 " + _0x3f42c3 + " ";
    }
  }
  function _0x3482fb(_0x341980, _0x494be0, _0x2dc351) {
    return getAccountActionLimitStatus(_0x21e6e0.get(_0x341980)?.actionLimitState, _0x2dc351, _0x494be0);
  }
  function _0x488f92(_0xa19e65, _0x51c495, _0x4052ea) {
    return _0x3482fb(_0xa19e65, _0x51c495, _0x4052ea).allowed;
  }
  function _0x3e1544(_0x582090 = {}) {
    return _0x582090.enableAutoLike === true || _0x582090.enableAutoReply === true || _0x582090.enableAutoFollow === true || _0x582090.enableAutoDM === true;
  }
  function _0x4ee7d2(_0xfb781d, _0x713703 = {}, _0x3985d3) {
    const _0x3786bd = [[_0x713703.enableAutoLike === true, "like"], [_0x713703.enableAutoReply === true, "reply"], [_0x713703.enableAutoFollow === true, "follow"], [_0x713703.enableAutoDM === true, "dm"]];
    for (const [_0x52a3a7, _0x41d0b1] of _0x3786bd) {
      if (!_0x52a3a7) {
        continue;
      }
      if (_0x488f92(_0xfb781d, _0x41d0b1, _0x3985d3)) {
        return true;
      }
    }
    return false;
  }
  function _0x2c7b6e(_0x2ee186, _0x247d2e, _0x4f408a) {
    const _0x30aedf = _0x3482fb(_0x2ee186, _0x247d2e, _0x4f408a);
    if (!_0x30aedf?.enabled || !!_0x30aedf.allowed) {
      return "";
    }
    const _0xd694ed = {
      like: "点赞",
      reply: "回复",
      follow: "关注",
      dm: "私信"
    };
    return "已达本账号本次" + (_0xd694ed[_0x247d2e] || _0x30aedf.label || "动作") + "上限";
  }
  function _0x5b4eb7(_0x5984da, _0x3a04a8, _0x4b2ec5 = "", _0x37cad9) {
    return _0x2c7b6e(_0x5984da, _0x3a04a8, _0x37cad9) || String(_0x4b2ec5 || "").trim() || "当前无法执行该动作";
  }
  function _0x43e97f(_0x6a1c0d = {}) {
    if (_0x6a1c0d?.isPrivate || _0x6a1c0d?.followIsPrivate) {
      return true;
    }
    if (_0x6a1c0d?.dmBlocked || _0x6a1c0d?.blockType === "privacy_settings") {
      return true;
    }
    if (_0x6a1c0d?.errorCode === "private_account" || _0x6a1c0d?.errorCode === "privacy_settings") {
      return true;
    }
    if (_0x6a1c0d?.errorCode === "follow_privacy_restricted") {
      return true;
    }
    const _0x26f2d1 = String(_0x6a1c0d?.error || _0x6a1c0d?.filterReason || _0x6a1c0d?.detail || "");
    return /私密账号|隐私设置|对方账号设置了隐私|无法发送消息/.test(_0x26f2d1);
  }
  function _0x546b94(_0x3dd4d6 = "互动", _0x4d5186 = {}) {
    const _0x5def71 = String(_0x4d5186?.error || _0x4d5186?.filterReason || _0x4d5186?.detail || "").trim();
    if (/对方账号设置了隐私/.test(_0x5def71)) {
      return _0x5def71;
    }
    if (/隐私设置|无法发送消息|follow_privacy/.test(_0x5def71) || _0x4d5186?.blockType === "privacy_settings") {
      return "对方账号设置了隐私，无法" + _0x3dd4d6;
    }
    return "对方账号设置了隐私，未执行" + _0x3dd4d6;
  }
  function _0x309a11(_0x2da7a2, _0x2e4ea2, _0x4bdff5) {
    const _0x4f6468 = _0x21e6e0.get(_0x2da7a2);
    if (!_0x4f6468?.actionLimitState) {
      return;
    }
    const _0x2966b0 = recordAccountActionLimitSuccess(_0x4f6468.actionLimitState, _0x4bdff5, _0x2e4ea2);
    if (!_0x2966b0.enabled) {
      return;
    }
    const _0x1ec1f2 = _0x49ca0f(_0x4f6468, _0x4bdff5);
    _0x45fff9(_0x2da7a2, _0x2966b0.label + " " + _0x1ec1f2 + "本次计数 " + _0x2966b0.count + "/" + _0x2966b0.limit, "info");
    const _0x44a2a0 = String(_0x4bdff5 || "") + ":" + _0x2e4ea2;
    if (!_0x2966b0.allowed && !_0x4f6468.actionLimitReachedLogged?.has(_0x44a2a0)) {
      if (!_0x4f6468.actionLimitReachedLogged) {
        _0x4f6468.actionLimitReachedLogged = new Set();
      }
      _0x4f6468.actionLimitReachedLogged.add(_0x44a2a0);
      _0x45fff9(_0x2da7a2, _0x2966b0.label + " " + _0x1ec1f2 + "已达到本次上限 " + _0x2966b0.limit + "，该账号后续将跳过该动作", "warning");
    }
  }
  function _0x310e3b(_0x3d6afd) {
    const _0x319ed3 = Math.max(0, Math.round((Number(_0x3d6afd) || 0) / 1000));
    if (_0x319ed3 < 60) {
      return _0x319ed3 + " 秒";
    }
    const _0x24851e = Math.floor(_0x319ed3 / 60);
    const _0x4acd70 = _0x319ed3 % 60;
    if (_0x4acd70 > 0) {
      return _0x24851e + " 分 " + _0x4acd70 + " 秒";
    } else {
      return _0x24851e + " 分钟";
    }
  }
  function _0x42ec6a(_0xe5ab3c) {
    if (!_0xe5ab3c || _0xe5ab3c.isDestroyed?.()) {
      return null;
    }
    try {
      for (const _0x351dd8 of _0x279862.values()) {
        if (_0x351dd8?.webContents === _0xe5ab3c) {
          return _0x351dd8;
        }
      }
    } catch (_0x35bf03) {}
    return null;
  }
  function _0x4a1205(_0x5136e7, _0x2e119a = null) {
    if (!_0x5136e7 || _0x5136e7.isDestroyed?.()) {
      return () => {};
    }
    const _0x315830 = String(_0x2e119a?.__radarMonitorViewKey || "").trim() || _0x5f030(_0x5136e7);
    try {
      _0x5136e7.setBackgroundThrottling?.(false);
    } catch (_0x1a21e3) {}
    try {
      _0x5136e7.setFrameRate?.(30);
    } catch (_0x4ee4fd) {}
    if (_0x315830) {
      automationLiveViewLifecycle?.wake?.(_0x315830);
    }
    try {
      const _0xe8eb0f = JSON.stringify(_0x315830 || "");
      _0x5136e7.executeJavaScript("(() => {\n          try {\n            if (" + _0xe8eb0f + ") {\n              window.__radar_view_key = " + _0xe8eb0f + ";\n              try { sessionStorage.setItem('radar_view_key', " + _0xe8eb0f + "); } catch (_) {}\n            }\n            document.body && document.body.focus();\n          } catch (_) {}\n          return true;\n        })()", true).catch(() => {});
    } catch (_0x559426) {}
    return () => {};
  }
  function _0x1ffce8(_0x310555) {
    if (!_0x310555 || _0x310555.isDestroyed?.()) {
      return;
    }
    try {
      _0x3e0637(_0x310555, true);
    } catch (_0x1aaa0b) {}
    try {
      _0x192d35(_0x310555);
    } catch (_0x5101b0) {}
    try {
      _0x1b311a(_0x310555);
    } catch (_0x3f5a5a) {}
  }
  function _0x369a53(_0x3484e6, _0x227255 = null) {
    if (_0x3484e6?.__radarMonitorHost || _0x3484e6?.__radarMonitorInteraction) {
      return true;
    }
    if (_0x3484e6?.__radarEntityHost) {
      return true;
    }
    const _0x11bdac = _0x227255 || _0x3484e6?.webContents;
    if (!_0x11bdac || _0x11bdac.isDestroyed?.()) {
      return false;
    }
    try {
      for (const _0x14657c of _0x279862.values()) {
        if (_0x14657c?.webContents === _0x11bdac) {
          return true;
        }
      }
    } catch (_0xdfb39f) {}
    try {
      const _0xadf961 = typeof getPlatformViews === "function" ? getPlatformViews() : null;
      if (_0xadf961) {
        for (const [_0x5c320b, _0x2150fc] of _0xadf961.entries()) {
          if (_0x2150fc?.webContents === _0x11bdac && String(_0x5c320b).startsWith("monitor_")) {
            return true;
          }
        }
      }
    } catch (_0x41f6fd) {}
    return false;
  }
  function _0x1b311a(_0x3ecf68, _0x100f79 = null) {
    const _0x113eb7 = _0x100f79 || _0x3ecf68?.webContents;
    if (_0x369a53(_0x3ecf68, _0x113eb7)) {
      return _0x4a1205(_0x113eb7, _0x3ecf68);
    }
    if (_0x3ecf68 && !_0x3ecf68.isDestroyed?.()) {
      return primeHiddenWindowForInteraction(_0x3ecf68) || (() => {});
    }
    return () => {};
  }
  function _0x5f030(_0x21fc1f) {
    if (!_0x21fc1f || _0x21fc1f.isDestroyed?.()) {
      return "";
    }
    try {
      for (const _0x211caf of _0x279862.values()) {
        if (_0x211caf?.webContents === _0x21fc1f) {
          return String(_0x211caf.__radarMonitorViewKey || "").trim();
        }
      }
    } catch (_0xa8c780) {}
    try {
      const _0x2f8b4a = typeof getPlatformViews === "function" ? getPlatformViews() : null;
      if (_0x2f8b4a) {
        for (const [_0x442609, _0x4b3985] of _0x2f8b4a.entries()) {
          if (_0x4b3985?.webContents === _0x21fc1f && String(_0x442609).startsWith("monitor_")) {
            return String(_0x442609);
          }
        }
      }
    } catch (_0x1e7ecd) {}
    return "";
  }
  function _0x45c4f7(_0x25517d, _0x658bda = null) {
    const _0x4f8bc3 = _0x658bda || _0x25517d?.webContents || null;
    const _0x56439a = String(_0x25517d?.__radarMonitorViewKey || "").trim() || _0x5f030(_0x4f8bc3);
    if (!_0x56439a || typeof getPlatformViews !== "function") {
      return false;
    }
    try {
      const _0x199fd8 = getPlatformViews()?.get?.(_0x56439a);
      const _0x598001 = typeof getMainWindow === "function" ? getMainWindow() : null;
      if (!_0x199fd8 || !_0x598001 || _0x598001.isDestroyed?.()) {
        return false;
      }
      return !!_0x598001.getBrowserViews?.()?.includes?.(_0x199fd8);
    } catch (_0x47e559) {
      return false;
    }
  }
  function _0x3e0637(_0x176575, _0x538bd4) {
    if (!_0x176575 || _0x176575.isDestroyed()) {
      return;
    }
    const _0x571c10 = _0x176575.webContents;
    if (!_0x571c10 || _0x571c10.isDestroyed()) {
      return;
    }
    _0x176575.__radarMonitorActive = !!_0x538bd4;
    _0x176575.__radarMonitorLastUsedAt = Date.now();
    const _0x4338e2 = _0x45c4f7(_0x176575);
    try {
      _0x571c10.setBackgroundThrottling(false);
    } catch (_0x1d3073) {}
    try {
      _0x571c10.setFrameRate(_0x538bd4 || _0x4338e2 ? _0x1cdebb : _0x16f9ba);
    } catch (_0x16ef23) {}
    try {
      _0x571c10.setImageAnimationPolicy(_0x538bd4 || _0x4338e2 ? "animateOnce" : "noAnimation");
    } catch (_0x426142) {}
    if (!_0x538bd4 && !_0x4338e2) {
      _0x571c10.executeJavaScript("\n        (() => {\n          document.querySelectorAll('video, audio').forEach((media) => {\n            try { media.pause(); } catch (_) {}\n          });\n          return true;\n        })()\n      ", true).catch(() => {});
    }
  }
  function _0x192d35(_0xfcc08a) {
    if (!_0xfcc08a || _0xfcc08a.isDestroyed?.()) {
      return;
    }
    if (_0xfcc08a.__radarMonitorHost || _0xfcc08a.__radarMonitorInteraction) {
      return;
    }
    if (_0xfcc08a.__radarAllowVisibleMonitor) {
      return;
    }
    ensureHiddenWindowStaysHidden(_0xfcc08a);
  }
  function _0xc0d0({
    taskId = null,
    accountId = null
  } = {}) {
    if (accountId != null && accountId !== "") {
      return [String(accountId)];
    }
    if (taskId != null && taskId !== "") {
      const _0x10cf32 = _0x21e6e0.get(String(taskId));
      const _0x4e03ff = (Array.isArray(_0x10cf32?.accounts) ? _0x10cf32.accounts : []).map(_0x2cc8b8 => String(_0x2cc8b8?.id || _0x2cc8b8?.accountId || "").trim()).filter(Boolean);
      if (_0x4e03ff.length) {
        return _0x4e03ff;
      }
    }
    return [..._0x362177.listActiveMonitorAccountIds()];
  }
  async function _0x4dd83e({
    taskId = null,
    accountId = null
  } = {}) {
    const _0x2d4030 = taskId != null && taskId !== "" ? String(taskId) : null;
    const _0x4995d6 = _0x2d4030 ? _0x21e6e0.get(_0x2d4030) : null;
    if (_0x2d4030 && !_0x4995d6) {
      return {
        success: false,
        shown: 0,
        error: "任务未在运行"
      };
    }
    const _0x4d31b6 = _0xc0d0({
      taskId: _0x2d4030,
      accountId: accountId
    });
    const _0x19adf2 = new Map((Array.isArray(_0x4995d6?.accounts) ? _0x4995d6.accounts : []).map(_0x20251f => [String(_0x20251f?.id || _0x20251f?.accountId || ""), _0x20251f]).filter(([_0x3e78c4]) => _0x3e78c4));
    for (const _0x17309e of _0x4d31b6) {
      const _0x2ba88d = _0x279862.get(_0x17309e);
      if (_0x2ba88d && !_0x2ba88d.isDestroyed() && !_0x2ba88d.__radarMonitorUnhealthy) {
        continue;
      }
      const _0x20e453 = _0x19adf2.get(_0x17309e);
      if (!_0x20e453) {
        continue;
      }
      try {
        await _0x36b772(_0x17309e, _0x20e453.proxy, _0x2d4030 || "");
      } catch (_0x111573) {
        console.warn("[VideoMonitor] 打开监控画面时创建宿主失败 " + _0x17309e + ":", _0x111573?.message || _0x111573);
      }
    }
    for (const _0x1419dd of _0x4d31b6) {
      const _0x59a95d = _0x279862.get(String(_0x1419dd));
      if (!_0x59a95d || _0x59a95d.isDestroyed?.()) {
        continue;
      }
      try {
        _0x3e0637(_0x59a95d, true);
      } catch (_0x38f106) {}
      try {
        _0x1b311a(_0x59a95d);
      } catch (_0x22125d) {}
    }
    return _0x362177.showMonitorLivePreview({
      taskId: _0x2d4030,
      accountId: accountId
    });
  }
  function _0x5ee4ef({
    taskId = null,
    accountId = null
  } = {}) {
    return _0x362177.hideMonitorLivePreview({
      taskId: taskId,
      accountId: accountId
    });
  }
  function _0x453c98(_0x51e82d = _0x2e0160) {
    if (_0x56d1cd < _0x10669c) {
      _0x56d1cd += 1;
      return Promise.resolve(_0x12626e());
    }
    const _0x1967b7 = Math.max(15000, Number(_0x51e82d) || _0x2e0160);
    return new Promise((_0x556432, _0x561ce3) => {
      let _0x428ae0 = false;
      const _0x26df3c = setTimeout(() => {
        if (_0x428ae0) {
          return;
        }
        _0x428ae0 = true;
        const _0x2ace83 = _0x210757.indexOf(_0x17d317);
        if (_0x2ace83 >= 0) {
          _0x210757.splice(_0x2ace83, 1);
        }
        const _0x13df11 = new Error("等待后台页面执行名额超时");
        _0x13df11.code = "monitor_operation_slot_timeout";
        _0x561ce3(_0x13df11);
      }, _0x1967b7);
      const _0x17d317 = _0x3ce801 => {
        if (_0x428ae0) {
          try {
            _0x3ce801?.();
          } catch (_0x32916c) {}
          return;
        }
        _0x428ae0 = true;
        clearTimeout(_0x26df3c);
        _0x556432(_0x3ce801);
      };
      _0x210757.push(_0x17d317);
    });
  }
  function _0x12626e() {
    let _0x48b7c6 = false;
    return () => {
      if (_0x48b7c6) {
        return;
      }
      _0x48b7c6 = true;
      const _0x5d8dfb = _0x210757.shift();
      if (_0x5d8dfb) {
        _0x5d8dfb(_0x12626e());
      } else {
        _0x56d1cd = Math.max(0, _0x56d1cd - 1);
      }
    };
  }
  function _0x357cba(_0x574419 = null) {
    const _0x59e7de = _0x574419 == null ? null : String(_0x574419);
    const _0x424e88 = [..._0x279862.entries()].filter(([_0x21feb7, _0x4c548d]) => _0x21feb7 !== _0x59e7de && _0x4c548d && !_0x4c548d.isDestroyed() && !_0x4c548d.__radarMonitorActive && !_0x4c548d.__radarAllowVisibleMonitor && !_0x45c4f7(_0x4c548d)).sort((_0xaff60d, _0x13f793) => Number(_0x13f793[1].__radarMonitorLastUsedAt || 0) - Number(_0xaff60d[1].__radarMonitorLastUsedAt || 0));
    const _0x1f570d = Math.max(0, _0x26a7fd - (_0x59e7de ? 1 : 0));
    _0x424e88.slice(_0x1f570d).forEach(([_0x135896, _0x2e51be]) => {
      try {
        _0x2e51be.destroy();
      } catch (_0x315363) {}
      if (_0x279862.get(_0x135896) === _0x2e51be) {
        _0x279862.delete(_0x135896);
      }
    });
  }
  function _0x26ed9a(_0x13f5c) {
    if (!_0x13f5c || _0x13f5c.isDestroyed() || _0x13f5c.webContents.isDestroyed()) {
      return;
    }
    _0x13f5c.webContents.executeJavaScript("\n      (() => {\n        const pauseMedia = (media) => {\n          try {\n            media.muted = true;\n            media.pause();\n            media.preload = 'metadata';\n          } catch (_) {}\n        };\n        document.querySelectorAll('video, audio').forEach(pauseMedia);\n        if (!window.__radarMonitorMediaBlockerInstalled) {\n          window.__radarMonitorMediaBlockerInstalled = true;\n          document.addEventListener('play', (event) => {\n            const media = event.target;\n            if (media && (media.tagName === 'VIDEO' || media.tagName === 'AUDIO')) {\n              pauseMedia(media);\n            }\n          }, true);\n        }\n        return true;\n      })()\n    ", true).catch(() => {});
  }
  async function _0x11cdd6(_0xcf740b, _0x428456, _0x2fb3af, _0x386fed = () => _0x21e6e0.has(_0x428456)) {
    const _0x50046c = String(_0xcf740b);
    const _0x5a788d = _0x1a0154.get(_0x50046c) || Promise.resolve();
    let _0x12e3a9;
    const _0x4a4219 = new Promise(_0x3ca39a => {
      _0x12e3a9 = _0x3ca39a;
    });
    const _0x4fbef8 = _0x5a788d.catch(() => {}).then(() => _0x4a4219);
    _0x1a0154.set(_0x50046c, _0x4fbef8);
    const _0x17f502 = Date.now();
    await _0x5a788d.catch(() => {});
    const _0x2fa8c4 = Date.now() - _0x17f502;
    if (_0x2fa8c4 >= 500) {
      _0x45fff9(_0x428456, "同账号监控窗口排队 " + (_0x2fa8c4 / 1000).toFixed(1) + " 秒，已开始继续执行", "info");
    }
    let _0x3d58e9 = () => {};
    const _0x263915 = _0x21e6e0.get(_0x428456);
    const _0x1ceb2b = _0x263915?.currentAccountId;
    try {
      const _0x85ccea = Date.now();
      try {
        _0x3d58e9 = await _0x453c98();
      } catch (_0x49c4e6) {
        _0x45fff9(_0x428456, "设备降载保护：等待后台页面执行名额超过 " + Math.round(_0x2e0160 / 1000) + " 秒，本项已跳过以免卡住（" + (_0x49c4e6?.message || _0x49c4e6) + "）", "warning");
        return null;
      }
      const _0x33edf2 = Date.now() - _0x85ccea;
      if (_0x33edf2 >= 1000) {
        _0x45fff9(_0x428456, "设备降载保护：等待 " + (_0x33edf2 / 1000).toFixed(1) + " 秒后获得后台页面执行名额（最多并行 " + _0x10669c + " 个）", "info");
      }
      const _0x535dff = _0x279862.get(_0x50046c);
      _0x3e0637(_0x535dff, true);
      _0x357cba(_0x50046c);
      if (_0x263915) {
        _0x263915.currentAccountId = _0x50046c;
      }
      if (!_0x386fed()) {
        return null;
      }
      return await _0x2fb3af();
    } finally {
      if (_0x263915) {
        if (_0x1ceb2b != null) {
          _0x263915.currentAccountId = _0x1ceb2b;
        } else {
          delete _0x263915.currentAccountId;
        }
      }
      _0x3e0637(_0x279862.get(_0x50046c), false);
      _0x357cba(_0x50046c);
      try {
        _0x3d58e9();
      } catch (_0x33eba3) {}
      _0x12e3a9();
      if (_0x1a0154.get(_0x50046c) === _0x4fbef8) {
        _0x1a0154.delete(_0x50046c);
      }
    }
  }
  function _0x292c4e() {
    try {
      _0x14f1c8.destroyAllInteractionViews();
    } catch (_0x4279e3) {}
    for (const _0x5921d8 of _0x279862.values()) {
      if (_0x5921d8 && !_0x5921d8.isDestroyed()) {
        _0x5921d8.destroy();
      }
    }
    _0x279862.clear();
  }
  function _0x2ff835(_0x231f3f) {
    if (!_0x231f3f) {
      return;
    }
    if (_0x231f3f.timer) {
      clearTimeout(_0x231f3f.timer);
      _0x231f3f.timer = null;
    }
    if (_0x231f3f.resourceTimer) {
      clearInterval(_0x231f3f.resourceTimer);
      _0x231f3f.resourceTimer = null;
    }
    if (_0x231f3f.heartbeatTimer) {
      clearInterval(_0x231f3f.heartbeatTimer);
      _0x231f3f.heartbeatTimer = null;
    }
  }
  function _0xe5656a(_0x40596e, _0x319037, _0x2a93f5) {
    if (_0x40596e == null) {
      return 0;
    }
    let _0x52642f = 0;
    const _0xd3e376 = (_0x3c252c, _0x58b26e = {}) => {
      for (const [_0x40458e, _0x19f25a] of _0x3c252c.entries()) {
        if (_0x19f25a.webContentsId !== _0x40596e) {
          continue;
        }
        _0x3c252c.delete(_0x40458e);
        _0x2ff835(_0x19f25a);
        _0x19f25a.resolve({
          success: false,
          error: _0x2a93f5,
          errorCode: _0x319037,
          elapsedMs: Date.now() - _0x19f25a.startedAt,
          ..._0x58b26e
        });
        _0x52642f += 1;
      }
    };
    _0xd3e376(_0x297008);
    _0xd3e376(_0x2f672f, {
      comments: []
    });
    _0xd3e376(_0x8467de, {
      works: []
    });
    try {
      _0x52642f += _0x14dbf9.failPendingForWebContents(_0x40596e, _0x319037, _0x2a93f5) || 0;
    } catch (_0x3db269) {}
    return _0x52642f;
  }
  function _0x5e3e55(_0x347dd5 = {}) {
    const _0x533f3e = _0x297008.get(_0x347dd5.requestId);
    if (!_0x533f3e) {
      return;
    }
    _0x297008.delete(_0x347dd5.requestId);
    _0x2ff835(_0x533f3e);
    const _0x47cc98 = Date.now() - _0x533f3e.startedAt;
    if (Date.now() > _0x533f3e.deadline) {
      _0x533f3e.resolve({
        success: false,
        error: "监控互动超过 " + Math.round(_0x533f3e.timeoutMs / 1000) + " 秒，已终止本次动作",
        errorCode: "monitor_action_timeout",
        elapsedMs: _0x47cc98
      });
      return;
    }
    _0x533f3e.resolve({
      ..._0x347dd5,
      elapsedMs: _0x47cc98
    });
  }
  function _0xa2ffce(_0x33fc6f = {}) {
    const _0x1784b7 = String(_0x33fc6f?.requestId || "").trim();
    const _0x2a6e85 = String(_0x33fc6f?.message || "").trim();
    if (!_0x1784b7 || !_0x2a6e85) {
      return;
    }
    const _0x46fb0a = _0x297008.get(_0x1784b7);
    if (!_0x46fb0a?.taskId) {
      return;
    }
    const _0x27c47e = ((Date.now() - _0x46fb0a.startedAt) / 1000).toFixed(1);
    const _0x2260c3 = _0x46fb0a.action === "like" ? "点赞" : _0x46fb0a.action === "reply" ? "回复" : _0x46fb0a.action === "follow" ? "关注" : "互动";
    _0x45fff9(_0x46fb0a.taskId, _0x2260c3 + "进度 +" + _0x27c47e + "s：" + _0x2a6e85, "info");
  }
  function _0x36f742(_0x4360cf = {}) {
    const _0x3cc858 = _0x2f672f.get(_0x4360cf.requestId);
    if (!_0x3cc858) {
      return;
    }
    _0x2f672f.delete(_0x4360cf.requestId);
    _0x2ff835(_0x3cc858);
    const _0x5356fc = Date.now() - _0x3cc858.startedAt;
    const _0x175fc4 = _0x3cc858.latestProgress;
    const _0x34679e = Date.now() > _0x3cc858.deadline || _0x4360cf.errorCode === "monitor_scrape_page_timeout";
    if (_0x34679e && Array.isArray(_0x175fc4?.comments) && _0x175fc4.comments.length > 0) {
      _0x3cc858.resolve({
        ..._0x175fc4,
        success: true,
        partialDueToDeadline: true,
        capped: false,
        elapsedMs: _0x5356fc
      });
      return;
    }
    if (Date.now() > _0x3cc858.deadline) {
      _0x3cc858.resolve({
        success: false,
        error: "评论抓取超过 " + Math.round(_0x3cc858.timeoutMs / 1000) + " 秒，已跳过当前视频",
        errorCode: "monitor_scrape_timeout",
        comments: [],
        elapsedMs: _0x5356fc
      });
      return;
    }
    _0x3cc858.resolve({
      ..._0x4360cf,
      elapsedMs: _0x5356fc
    });
  }
  function _0x28b1f1(_0x4a7f4c = {}) {
    const _0x46003f = _0x2f672f.get(_0x4a7f4c.requestId);
    if (!_0x46003f) {
      return;
    }
    const _0x1f1e05 = Array.isArray(_0x4a7f4c.comments) ? _0x4a7f4c.comments.slice(0, MONITOR_MAX_COMMENTS) : [];
    _0x46003f.latestProgress = {
      ..._0x4a7f4c,
      comments: _0x1f1e05,
      resumeState: _0x4a7f4c.resumeState && typeof _0x4a7f4c.resumeState === "object" ? {
        ..._0x4a7f4c.resumeState
      } : null,
      receivedAt: Date.now()
    };
  }
  function _0x239dbb(_0x3987f7) {
    const _0x949e11 = _0x3987f7 + "_";
    const _0x2cd02c = new Set();
    const _0x45bd0c = (_0x515aca, _0x2d9cdf = {}) => {
      for (const [_0x10d8f, _0xb11af7] of _0x515aca.entries()) {
        if (!String(_0x10d8f).startsWith(_0x949e11)) {
          continue;
        }
        _0x515aca.delete(_0x10d8f);
        _0x2ff835(_0xb11af7);
        if (_0xb11af7.webContentsId != null) {
          _0x2cd02c.add(_0xb11af7.webContentsId);
        }
        _0xb11af7.resolve({
          success: false,
          error: "监控任务已停止",
          errorCode: "monitor_task_stopped",
          elapsedMs: Date.now() - _0xb11af7.startedAt,
          ..._0x2d9cdf
        });
      }
    };
    _0x45bd0c(_0x297008);
    _0x45bd0c(_0x2f672f, {
      comments: []
    });
    _0x45bd0c(_0x8467de, {
      works: []
    });
    try {
      _0x14dbf9.cancelPendingForTask(_0x3987f7);
    } catch (_0x3442e9) {}
    return _0x2cd02c;
  }
  function _0x2a3829(_0x191d14 = {}) {
    const _0x3b0619 = _0x8467de.get(_0x191d14.requestId);
    if (!_0x3b0619) {
      return;
    }
    _0x8467de.delete(_0x191d14.requestId);
    if (_0x3b0619.timer) {
      clearTimeout(_0x3b0619.timer);
    }
    const _0x51d95a = Date.now() - _0x3b0619.startedAt;
    if (Date.now() > _0x3b0619.deadline) {
      _0x3b0619.resolve({
        success: false,
        error: "主播作品抓取超过 " + Math.round(_0x3b0619.timeoutMs / 1000) + " 秒",
        errorCode: "monitor_author_works_timeout",
        works: [],
        elapsedMs: _0x51d95a
      });
      return;
    }
    _0x3b0619.resolve({
      ..._0x191d14,
      elapsedMs: _0x51d95a
    });
  }
  function _0x28f5a8(_0x2ef169 = {}) {
    try {
      _0x14dbf9.handleNavResult(_0x2ef169 || {});
    } catch (_0x56d875) {}
  }
  async function _0x1509eb(_0x5b8fe3, _0x5ee26e, _0x2320cd = 90000) {
    const _0x4335e7 = String(_0x5ee26e?.action || "");
    const _0x320261 = String(_0x5ee26e?.taskId || "").trim();
    const _0x5b2855 = _0x5b8fe3?.__radarMonitorAbortSignal || null;
    const _0x93a46a = ["reply", "like", "follow", "dm", "profile-first-comment", "profile-target-check", "video-main-comment"].includes(_0x4335e7);
    let _0x5a47fc = () => {};
    if (_0x93a46a) {
      try {
        if (_0x320261 && _0x4335e7 === "like") {
          _0x45fff9(_0x320261, "点赞：唤醒监控页面 @" + (_0x5ee26e?.nickname || "用户") + "…", "info");
        }
        const _0x514554 = _0x42ec6a(_0x5b8fe3);
        _0x5a47fc = _0x4a1205(_0x5b8fe3, _0x514554);
        await new Promise(_0x2f0ea7 => setTimeout(_0x2f0ea7, 120));
      } catch (_0x1ee760) {}
    }
    let _0x591404 = false;
    const _0x2502b3 = () => {
      if (_0x591404) {
        return;
      }
      _0x591404 = true;
      try {
        _0x5a47fc();
      } catch (_0x2d90de) {}
    };
    try {
      return await new Promise(_0x87203 => {
        const _0x29ec37 = Date.now();
        let _0x38df18 = false;
        let _0x4f4fa4 = null;
        const _0x42bd93 = _0x11da05 => {
          if (_0x38df18) {
            return;
          }
          _0x38df18 = true;
          if (_0x4f4fa4 && _0x5b2855) {
            try {
              _0x5b2855.removeEventListener("abort", _0x4f4fa4);
            } catch (_0x134297) {}
          }
          _0x2502b3();
          _0x87203(_0x11da05);
        };
        const _0x166a56 = setTimeout(() => {
          _0x297008.delete(_0x5ee26e.requestId);
          _0x42bd93({
            success: false,
            error: "监控互动等待超时（" + Math.round(_0x2320cd / 1000) + " 秒）",
            errorCode: "monitor_action_timeout",
            elapsedMs: Date.now() - _0x29ec37
          });
        }, _0x2320cd);
        _0x4f4fa4 = () => {
          clearTimeout(_0x166a56);
          _0x297008.delete(_0x5ee26e.requestId);
          _0x42bd93({
            success: false,
            error: "监控互动已取消",
            errorCode: "monitor_interaction_aborted",
            elapsedMs: Date.now() - _0x29ec37
          });
        };
        if (_0x5b2855?.aborted) {
          _0x4f4fa4();
          return;
        }
        try {
          _0x5b2855?.addEventListener?.("abort", _0x4f4fa4, {
            once: true
          });
        } catch (_0x2b65bb) {}
        _0x297008.set(_0x5ee26e.requestId, {
          resolve: _0x57ce66 => {
            clearTimeout(_0x166a56);
            _0x42bd93(_0x57ce66);
          },
          timer: _0x166a56,
          startedAt: _0x29ec37,
          deadline: _0x29ec37 + _0x2320cd,
          timeoutMs: _0x2320cd,
          webContentsId: _0x5b8fe3?.id,
          taskId: _0x320261,
          action: _0x4335e7
        });
        try {
          if (!_0x5b8fe3 || _0x5b8fe3.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          if (_0x5b8fe3.__radarMonitorUnhealthy) {
            const _0x1ed2c1 = new Error("后台监控渲染进程状态异常");
            _0x1ed2c1.code = "monitor_renderer_unhealthy";
            throw _0x1ed2c1;
          }
          if (_0x320261 && _0x4335e7 === "like") {
            _0x45fff9(_0x320261, "点赞：已下发页面动作，开始定位评论 @" + (_0x5ee26e?.nickname || "用户") + "…", "info");
          }
          _0x5b8fe3.send("control-task", {
            type: "VIDEO_MONITOR_ACTION",
            payload: _0x5ee26e
          });
        } catch (_0x1ebe88) {
          clearTimeout(_0x166a56);
          _0x297008.delete(_0x5ee26e.requestId);
          _0x42bd93({
            success: false,
            error: _0x1ebe88.message || "无法向监控窗口下发互动动作",
            errorCode: _0x1ebe88.code || "monitor_action_dispatch_failed"
          });
        }
      });
    } catch (_0x377d46) {
      _0x2502b3();
      return {
        success: false,
        error: _0x377d46?.message || "监控互动执行异常",
        errorCode: _0x377d46?.code || "monitor_action_exception"
      };
    }
  }
  async function _0x14afc1(_0x115717, _0x321832, _0x1103de = _0x41235d) {
    const _0x31d008 = Number(_0x1103de);
    const _0x455bf4 = Number.isFinite(_0x31d008) ? Math.max(45000, Math.floor(_0x31d008)) : _0x41235d;
    return new Promise(_0x4b6d7d => {
      const _0x1e8f1b = Date.now();
      let _0xd83ef5 = false;
      const _0x5aa270 = String(_0x321832?.taskId || "").trim() || String(_0x321832?.requestId || "").split("_")[0];
      const _0x356483 = _0x55f8ef => {
        if (_0xd83ef5) {
          return;
        }
        _0xd83ef5 = true;
        const _0x117d82 = _0x2f672f.get(_0x321832.requestId);
        _0x2f672f.delete(_0x321832.requestId);
        _0x2ff835(_0x117d82);
        _0x4b6d7d(_0x55f8ef);
      };
      const _0x4439f3 = setTimeout(() => {
        const _0x1d966a = _0x2f672f.get(_0x321832.requestId);
        const _0x295f95 = _0x1d966a?.latestProgress;
        if (Array.isArray(_0x295f95?.comments) && _0x295f95.comments.length > 0) {
          _0x356483({
            ..._0x295f95,
            success: true,
            partialDueToDeadline: true,
            capped: false,
            elapsedMs: Date.now() - _0x1e8f1b
          });
          return;
        }
        _0x356483({
          success: false,
          error: "评论抓取超过 " + Math.round(_0x455bf4 / 1000) + " 秒，已跳过当前视频",
          errorCode: "monitor_scrape_timeout",
          comments: _0x1d966a?.latestProgress?.comments || [],
          resumeState: _0x1d966a?.latestProgress?.resumeState || null,
          elapsedMs: Date.now() - _0x1e8f1b
        });
      }, _0x455bf4);
      const _0x46d5e1 = {
        resolve: _0x356483,
        timer: _0x4439f3,
        resourceTimer: null,
        heartbeatTimer: null,
        lastHeartbeatAt: 0,
        resourcePressureSamples: 0,
        latestProgress: null,
        startedAt: _0x1e8f1b,
        deadline: _0x1e8f1b + _0x455bf4,
        timeoutMs: _0x455bf4,
        webContentsId: _0x115717?.id,
        taskId: _0x5aa270
      };
      _0x2f672f.set(_0x321832.requestId, _0x46d5e1);
      _0x46d5e1.heartbeatTimer = setInterval(() => {
        const _0x5d91b9 = _0x2f672f.get(_0x321832.requestId);
        if (!_0x5d91b9 || _0x5d91b9 !== _0x46d5e1 || _0xd83ef5) {
          return;
        }
        const _0x560329 = Number(_0x5d91b9.latestProgress?.receivedAt) || _0x1e8f1b;
        const _0x121519 = Date.now() - _0x560329;
        const _0x127626 = Date.now() - _0x1e8f1b;
        if (_0x5aa270 && _0x121519 >= _0x5a4f35 && Date.now() - Number(_0x5d91b9.lastHeartbeatAt || 0) >= _0x5a4f35) {
          _0x5d91b9.lastHeartbeatAt = Date.now();
          _0x45fff9(_0x5aa270, "评论抓取仍在进行（已 " + Math.round(_0x127626 / 1000) + " 秒，页面已 " + Math.round(_0x121519 / 1000) + " 秒无进度回报）", "info");
        }
        if (_0x121519 < _0x55e74c) {
          return;
        }
        const _0x232484 = _0x5d91b9.latestProgress;
        if (Array.isArray(_0x232484?.comments) && _0x232484.comments.length > 0) {
          _0x356483({
            ..._0x232484,
            success: true,
            partialDueToDeadline: true,
            errorCode: "monitor_scrape_stalled",
            error: "评论抓取已 " + Math.round(_0x55e74c / 1000) + " 秒无进度，保留已抓评论并跳过以免卡住",
            elapsedMs: _0x127626
          });
          return;
        }
        _0x356483({
          success: false,
          error: "评论抓取已 " + Math.round(_0x55e74c / 1000) + " 秒无进度，已跳过当前视频以免卡住",
          errorCode: "monitor_scrape_stalled",
          comments: [],
          resumeState: _0x232484?.resumeState || null,
          elapsedMs: _0x127626
        });
      }, 5000);
      if (typeof _0x46d5e1.heartbeatTimer.unref === "function") {
        _0x46d5e1.heartbeatTimer.unref();
      }
      if (_0x321832.allowResourceCheckpoint !== false) {
        _0x46d5e1.resourceTimer = setInterval(() => {
          const _0x2e413d = _0x2f672f.get(_0x321832.requestId);
          if (!_0x2e413d || _0x2e413d !== _0x46d5e1) {
            return;
          }
          if (Date.now() - _0x1e8f1b < _0x2c99f6) {
            return;
          }
          const _0x32ecf8 = _0x405dec(_0x115717);
          if (_0x32ecf8 < _0x494f62) {
            _0x2e413d.resourcePressureSamples = 0;
            return;
          }
          _0x2e413d.resourcePressureSamples += 1;
          const _0x71829a = _0x2e413d.latestProgress;
          if (_0x2e413d.resourcePressureSamples < _0x2b1711 || !_0x71829a || !Array.isArray(_0x71829a.comments) || _0x71829a.comments.length === 0 || Number(_0x71829a.resumeState?.scrollRound || 0) < 1) {
            return;
          }
          _0x356483({
            ..._0x71829a,
            success: false,
            resourceCheckpoint: true,
            errorCode: "monitor_renderer_resource_checkpoint",
            error: "渲染内存连续达到 " + _0x32ecf8 + "MB，已保存采集进度",
            rendererMemoryMb: _0x32ecf8,
            elapsedMs: Date.now() - _0x1e8f1b
          });
        }, _0x599f51);
        if (typeof _0x46d5e1.resourceTimer.unref === "function") {
          _0x46d5e1.resourceTimer.unref();
        }
      }
      (async () => {
        try {
          if (!_0x115717 || _0x115717.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          if (_0x115717.__radarMonitorUnhealthy) {
            const _0x5b4c30 = new Error("后台监控渲染进程状态异常");
            _0x5b4c30.code = "monitor_renderer_unhealthy";
            throw _0x5b4c30;
          }
          await _0x586088(_0x115717);
          if (!_0x115717 || _0x115717.isDestroyed()) {
            throw new Error("监控窗口已销毁");
          }
          _0x115717.send("control-task", {
            type: "VIDEO_MONITOR_SCRAPE",
            payload: {
              ..._0x321832,
              taskId: _0x5aa270 || _0x321832.taskId
            }
          });
        } catch (_0x1338da) {
          _0x356483({
            success: false,
            error: _0x1338da.message || "无法向监控窗口下发评论抓取",
            errorCode: _0x1338da.code || "monitor_scrape_dispatch_failed",
            comments: [],
            elapsedMs: Date.now() - _0x1e8f1b
          });
        }
      })();
    });
  }
  async function _0xef8ac4(_0x2818db, _0x17c981, _0x1cb8f7 = 90000) {
    return new Promise(_0x16bedb => {
      const _0xff83fc = Date.now();
      const _0x46ecd4 = setTimeout(() => {
        _0x8467de.delete(_0x17c981.requestId);
        _0x16bedb({
          success: false,
          error: "主播作品抓取超过 " + Math.round(_0x1cb8f7 / 1000) + " 秒",
          errorCode: "monitor_author_works_timeout",
          works: [],
          elapsedMs: Date.now() - _0xff83fc
        });
      }, _0x1cb8f7);
      _0x8467de.set(_0x17c981.requestId, {
        resolve: _0x16bedb,
        timer: _0x46ecd4,
        startedAt: _0xff83fc,
        deadline: _0xff83fc + _0x1cb8f7,
        timeoutMs: _0x1cb8f7,
        webContentsId: _0x2818db?.id
      });
      try {
        if (!_0x2818db || _0x2818db.isDestroyed()) {
          throw new Error("监控窗口已销毁");
        }
        if (_0x2818db.__radarMonitorUnhealthy) {
          const _0x29298b = new Error("后台监控渲染进程状态异常");
          _0x29298b.code = "monitor_renderer_unhealthy";
          throw _0x29298b;
        }
        _0x2818db.send("control-task", {
          type: "VIDEO_MONITOR_AUTHOR_WORKS",
          payload: _0x17c981
        });
      } catch (_0x15f41f) {
        clearTimeout(_0x46ecd4);
        _0x8467de.delete(_0x17c981.requestId);
        _0x16bedb({
          success: false,
          error: _0x15f41f.message || "无法向监控窗口下发主播作品抓取",
          errorCode: _0x15f41f.code || "monitor_author_works_dispatch_failed",
          works: [],
          elapsedMs: Date.now() - _0xff83fc
        });
      }
    });
  }
  function _0x459217(_0x84d21d) {
    return "monitor_task_seen_" + _0x84d21d;
  }
  function _0xb44e4a(_0x8410c3) {
    const _0x3a5d40 = require("./monitorTaskSeenAccess");
    return _0x3a5d40.getSeenKeys(_0x3639c8, _0x8410c3);
  }
  function _0x3653fd(_0x522e85, _0x232834, _0x1d8a14 = {}) {
    const _0x399713 = String(_0x522e85 || "");
    const _0xd20cc0 = _0x21e6e0.get(_0x399713);
    const _0x2de4bd = _0x1d8a14.seenEpoch;
    if (_0xd20cc0 && _0x2de4bd != null && (_0xd20cc0.seenInventoryEpoch || 0) !== _0x2de4bd) {
      return false;
    }
    const _0x42b01d = require("./monitorTaskSeenAccess");
    return _0x42b01d.saveSeenKeys(_0x3639c8, _0x399713, _0x232834);
  }
  function _0x5e7393(_0x530a3d) {
    const _0x2fdcf2 = String(_0x530a3d || "");
    if (!_0x2fdcf2) {
      return {
        count: 0
      };
    }
    return {
      count: _0xb44e4a(_0x2fdcf2).length
    };
  }
  function _0x27cc40(_0xcde4d5) {
    const _0x20ea87 = String(_0xcde4d5 || "");
    if (!_0x20ea87) {
      return {
        success: false,
        error: "缺少任务 ID"
      };
    }
    const _0x33a3d1 = require("./monitorTaskSeenAccess");
    const _0x3b0a29 = _0x33a3d1.clearSeenKeys(_0x3639c8, _0x20ea87);
    try {
      _0x3639c8.delete("monitor_task_video_baseline_" + _0x20ea87);
    } catch (_0x2eba78) {}
    const _0x27abed = _0x21e6e0.get(_0x20ea87);
    if (_0x27abed) {
      _0x27abed.seenInventoryEpoch = (Number(_0x27abed.seenInventoryEpoch) || 0) + 1;
      const _0x5c8c70 = _0x27abed.liveSeenState;
      if (_0x5c8c70 && Array.isArray(_0x5c8c70.updatedSeenKeys) && _0x5c8c70.seenKeySet instanceof Set) {
        _0x5c8c70.updatedSeenKeys.length = 0;
        _0x5c8c70.seenKeySet.clear();
      }
    }
    _0x45fff9(_0x20ea87, _0x3b0a29 > 0 ? "已清空评论去重记录 " + _0x3b0a29 + " 条；下一轮将按当前时间窗重新研判历史评论" : "评论去重记录已是空的；下一轮将按当前时间窗研判", "success");
    return {
      success: true,
      cleared: _0x3b0a29,
      running: !!_0x27abed
    };
  }
  function _0xeda9c6(_0x104285) {
    return "monitor_task_author_seen_" + _0x104285;
  }
  function _0xa16ee5(_0xe191e) {
    return "monitor_task_author_baseline_" + _0xe191e;
  }
  function _0x30c9e6(_0x1c8813) {
    const _0x32849b = _0x3639c8.get(_0xeda9c6(_0x1c8813), []);
    if (Array.isArray(_0x32849b)) {
      return _0x32849b;
    } else {
      return [];
    }
  }
  function _0x3e8e04(_0x2721dd, _0x18a46b) {
    _0x3639c8.set(_0xeda9c6(_0x2721dd), [...new Set(_0x18a46b.filter(Boolean))].slice(-5000));
  }
  function _0x112620(_0x794f97) {
    const _0x3bba39 = _0x3639c8.get(_0xa16ee5(_0x794f97), {}) || {};
    if (_0x3bba39 && typeof _0x3bba39 === "object") {
      return _0x3bba39;
    } else {
      return {};
    }
  }
  function _0x44d765(_0x332cf7, _0x2c8004) {
    return !!_0x112620(_0x332cf7)[_0x2c8004];
  }
  function _0x4cce46(_0x3f5b8b, _0x3d098d) {
    const _0x502f3f = _0x112620(_0x3f5b8b);
    _0x502f3f[_0x3d098d] = Date.now();
    _0x3639c8.set(_0xa16ee5(_0x3f5b8b), _0x502f3f);
  }
  function _0x35827d(_0x5dacba) {
    return leadUserKey.extractUserKeyFromUrl(_0x5dacba) || "";
  }
  const _0xf3c3a2 = new Set(["主账号", "默认账号", "本账号", "未知账号", "已登录(待识别)", "我的", "登录"]);
  function _0x1feeff(_0x265968, _0x52a720) {
    const _0x40d591 = String(_0x265968?.nickname || "").trim();
    const _0x1251a5 = String(_0x265968?.remark || _0x265968?.note || _0x265968?.alias || "").trim();
    const _0x53bd2b = String(_0x265968?.name || "").trim();
    const _0x574200 = _0x43ce4b => {
      const _0x51f470 = String(_0x43ce4b || "").trim();
      if (!_0x51f470 || _0xf3c3a2.has(_0x51f470) || _0x51f470 === _0x40d591) {
        return "";
      }
      return _0x51f470;
    };
    if (_0x40d591) {
      const _0x1be1c8 = _0x574200(_0x1251a5) || _0x574200(_0x53bd2b);
      if (_0x1be1c8) {
        return _0x40d591 + " (" + _0x1be1c8 + ")";
      } else {
        return _0x40d591;
      }
    }
    if (_0x1251a5 && !_0xf3c3a2.has(_0x1251a5)) {
      return _0x1251a5;
    }
    if (_0x53bd2b && !_0xf3c3a2.has(_0x53bd2b)) {
      return _0x53bd2b;
    }
    const _0x107fb1 = String(_0x52a720 || _0x265968?.id || "").trim();
    if (_0x107fb1 && _0x107fb1 !== "default") {
      return "账号" + _0x107fb1;
    }
    return "未知账号";
  }
  function _0x1414c1(_0x13a3f0, _0x4583e6) {
    const _0x1c99a0 = _0x35827d(_0x4583e6?.userUrl || _0x4583e6?.authorProfileUrl || _0x4583e6?.secUid) || (_0x4583e6?.nickname ? normalizeMonitorNickname(_0x4583e6.nickname) : "");
    return _0x13a3f0 + "_" + _0x1c99a0 + "_" + _0x4583e6.text;
  }
  function _0x4a8378(_0x5aaa5f, _0x4de628, _0xbbc1b9, _0x4e4ec1, _0x11770e = "") {
    const _0x2ac9cf = _0x35827d(_0x11770e) || _0xbbc1b9 || "";
    const _0xa4b9a8 = _0x5aaa5f + "_" + (_0x4de628 || "") + "_" + _0x2ac9cf + "_" + (_0x4e4ec1 || "");
    let _0x2cb857 = 0;
    for (let _0x502ba5 = 0; _0x502ba5 < _0xa4b9a8.length; _0x502ba5 += 1) {
      _0x2cb857 = (_0x2cb857 << 5) - _0x2cb857 + _0xa4b9a8.charCodeAt(_0x502ba5);
      _0x2cb857 |= 0;
    }
    return "match_" + Math.abs(_0x2cb857).toString(36) + "_" + _0xa4b9a8.length;
  }
  function _0x2d5b79(_0x1ac4c7, _0xdc374a, _0x233d65, _0x412855) {
    if (!_0x412855) {
      return false;
    }
    if (_0x1ac4c7?.has(_0x412855)) {
      return true;
    }
    if (Array.isArray(_0x233d65) && _0x233d65.includes(_0x412855)) {
      return true;
    }
    if (Array.isArray(_0xdc374a) && _0xdc374a.includes(_0x412855)) {
      return true;
    }
    const _0x26e2e9 = "_" + _0x412855;
    const _0x4e7f2d = _0x1f6961 => typeof _0x1f6961 === "string" && _0x1f6961.length > _0x412855.length && _0x1f6961.endsWith(_0x26e2e9);
    if (_0x1ac4c7) {
      for (const _0x2822cb of _0x1ac4c7) {
        if (_0x4e7f2d(_0x2822cb)) {
          return true;
        }
      }
    }
    if (Array.isArray(_0x233d65) && _0x233d65.some(_0x4e7f2d)) {
      return true;
    }
    if (Array.isArray(_0xdc374a) && _0xdc374a.some(_0x4e7f2d)) {
      return true;
    }
    return false;
  }
  function _0x21082b(_0x3f7dc6, _0x15ddcb) {
    const _0x17527a = _0x15ddcb?.findTaskById?.(_0x3f7dc6);
    return _0x17527a?.name || "监控任务 " + _0x3f7dc6;
  }
  function _0x16672a({
    comment: _0x1c6b53,
    videoItem: _0x593b22,
    account: _0x4fa0bd,
    accountId: _0x59d11c,
    taskId: _0x12822e,
    taskName: _0x275689,
    evaluation: _0x423b91,
    matchRecord: _0x2dcd03,
    touchOnlyTypes = null
  }) {
    const _0x24b647 = _0x1c6b53?.nickname || "";
    const _0x49e9d8 = _0x1c6b53?.text || "";
    let _0x28518c = String(_0x1c6b53?.userUrl || _0x1c6b53?.authorProfileUrl || "").trim();
    const _0xd902fd = _0x1c6b53?.ipLocation || _0x1c6b53?.location || "";
    const _0x1bf919 = _0x35827d(_0x28518c) || _0x35827d(_0x1c6b53?.authorProfileUrl || "");
    const _0x4cb19c = String(_0x1c6b53?.secUid || _0x1c6b53?.sec_uid || "").trim();
    const _0x267efa = _0x1bf919 || (leadUserKey.isDouyinSecUid(_0x4cb19c) ? _0x4cb19c : "");
    if (_0x267efa && !_0x35827d(_0x28518c)) {
      _0x28518c = "https://www.douyin.com/user/" + _0x267efa;
    }
    const _0x1cd7f5 = _0x1feeff(_0x4fa0bd, _0x59d11c);
    const _0x177952 = {
      platform: "DY",
      title: _0x593b22?.title || "",
      nickname: _0x24b647,
      content: _0x49e9d8,
      timeText: _0x1c6b53?.time || "",
      userUrl: _0x28518c,
      secUid: _0x267efa || undefined,
      url: _0x593b22?.url || "",
      videoUrl: _0x593b22?.url || "",
      sourceType: "comment",
      timestamp: Date.now(),
      capturedAt: new Date().toISOString(),
      type: "LEAD",
      isHighIntention: false,
      accountId: String(_0x59d11c ?? _0x4fa0bd?.id ?? ""),
      accountName: _0x1cd7f5,
      taskName: _0x275689,
      taskId: _0x12822e,
      ipLocation: _0xd902fd,
      location: _0xd902fd || "未知",
      entrySource: "monitor",
      entryLabel: "监控: " + _0x275689,
      actions: {
        liked: false,
        replied: false,
        messaged: false,
        followed: false
      }
    };
    if (_0x423b91) {
      _0x177952.isHighIntention = !!_0x423b91.matched;
      if (_0x423b91.excludedCommentKeyword) {
        _0x177952.excludedCommentKeyword = _0x423b91.excludedCommentKeyword;
      }
      const _0x388122 = _0x423b91.reason || _0x423b91.judgeReason || "";
      if (_0x423b91.matched) {
        _0x177952.thought = _0x388122 || (_0x423b91.matchType === "ai" ? "监控人设命中" : "监控关键词命中");
        if (_0x423b91.aiResult?.thought || _0x423b91.aiResult?.reason) {
          _0x177952.aiThought = _0x423b91.aiResult.thought || _0x423b91.aiResult.reason;
        } else if (_0x423b91.matchType === "ai") {
          _0x177952.aiThought = _0x388122;
        }
      } else {
        _0x177952.thought = _0x388122 || "监控未命中";
      }
    } else {
      _0x177952.thought = "监控新评论";
    }
    if (_0x2dcd03) {
      if (_0x2dcd03.isPrivate !== undefined) {
        _0x177952.isPrivate = !!_0x2dcd03.isPrivate;
      }
      if (_0x2dcd03.noWorks !== undefined) {
        _0x177952.noWorks = !!_0x2dcd03.noWorks;
      }
      if (_0x2dcd03.worksCount !== undefined) {
        _0x177952.worksCount = Number(_0x2dcd03.worksCount || 0);
      }
      if (_0x2dcd03.followIsPrivate !== undefined && _0x2dcd03.followIsPrivate) {
        _0x177952.isPrivate = true;
      }
      if (_0x2dcd03.followStatus && _0x2dcd03.followStatus !== "none") {
        _0x177952.followStatus = _0x2dcd03.followStatus;
        _0x177952.followRequested = !!_0x2dcd03.followRequested;
        _0x177952.followRequestSent = !!_0x2dcd03.followRequestSent;
        _0x177952.followIsPrivate = !!_0x2dcd03.followIsPrivate;
        if (_0x2dcd03.followError) {
          _0x177952.followError = _0x2dcd03.followError;
        }
      }
      if (_0x2dcd03.replyContent) {
        _0x177952.replyContent = _0x2dcd03.replyContent;
        _0x177952.actions = {
          ...(_0x177952.actions || {}),
          replyContent: _0x2dcd03.replyContent
        };
      }
      if (_0x2dcd03.replyStatus && _0x2dcd03.replyStatus !== "none") {
        _0x177952.replyStatus = _0x2dcd03.replyStatus;
        if (_0x2dcd03.replyError) {
          _0x177952.replyError = _0x2dcd03.replyError;
        }
      }
      if (_0x2dcd03.dmContent) {
        _0x177952.dmContent = _0x2dcd03.dmContent;
        _0x177952.actions = {
          ...(_0x177952.actions || {}),
          dmContent: _0x2dcd03.dmContent
        };
      }
      if (_0x2dcd03.dmStatus && _0x2dcd03.dmStatus !== "none") {
        _0x177952.dmStatus = _0x2dcd03.dmStatus;
        if (_0x2dcd03.dmError) {
          _0x177952.dmError = _0x2dcd03.dmError;
        }
      }
      if (_0x2dcd03.likeStatus && _0x2dcd03.likeStatus !== "none") {
        _0x177952.likeStatus = _0x2dcd03.likeStatus;
        if (_0x2dcd03.likeError) {
          _0x177952.likeError = _0x2dcd03.likeError;
        }
      }
      _0x2ba1f7(_0x177952, _0x2dcd03, {
        onlyTypes: Array.isArray(touchOnlyTypes) ? touchOnlyTypes : null
      });
      if (_0x2dcd03.followStatus === "success" || _0x2dcd03.followStatus === "already_followed" || _0x2dcd03.followStatus === "requested" && _0x2dcd03.followRequestSent) {
        _0x177952.actions.followed = true;
        _0x177952.followed = true;
      }
      const _0x104ccf = Array.isArray(touchOnlyTypes) && touchOnlyTypes.length > 0 && touchOnlyTypes.every(_0x47ee36 => _0x47ee36 === "follow" || _0x47ee36 === "message");
      if (!_0x104ccf) {
        if (_0x2dcd03.likeStatus === "success") {
          _0x177952.actions.liked = true;
          _0x177952.liked = true;
        }
        if (_0x2dcd03.replyStatus === "success") {
          const _0x553fe8 = _0x2dcd03.replyTarget === "profile_first" || String(_0x2dcd03.profileCommentStatus || "") === "success";
          if (_0x553fe8) {
            _0x177952.actions.profileWorkCommented = true;
            _0x177952.profileCommentAt = _0x177952.profileCommentAt || Date.now();
          } else {
            _0x177952.actions.replied = true;
            _0x177952.replied = true;
          }
        } else if (_0x2dcd03.profileCommentStatus === "success") {
          _0x177952.actions.profileWorkCommented = true;
          _0x177952.profileCommentAt = _0x177952.profileCommentAt || Date.now();
        }
      }
      if (_0x2dcd03.dmStatus === "success") {
        _0x177952.actions.messaged = true;
        _0x177952.messaged = true;
      }
    }
    const _0x2b0056 = leadUserKey.buildLeadId(_0x177952);
    _0x177952.leadId = _0x2b0056;
    _0x177952.key = _0x2b0056;
    return _0x177952;
  }
  function _0x2ba1f7(_0x1c6196, _0x15e9f3, _0x29f294 = {}) {
    if (!_0x1c6196 || !_0x15e9f3) {
      return _0x1c6196;
    }
    leadTouch.ensureLeadMeta(_0x1c6196);
    const _0x600a6a = Array.isArray(_0x29f294.onlyTypes) && _0x29f294.onlyTypes.length ? new Set(_0x29f294.onlyTypes.map(String)) : null;
    const _0x13e358 = _0x37a7ce => !_0x600a6a || _0x600a6a.has(_0x37a7ce);
    const _0x486354 = {
      accountName: _0x1c6196.accountName || "",
      source: "monitor",
      channel: "监控任务",
      success: true
    };
    if (_0x13e358("like") && _0x15e9f3.likeStatus === "success") {
      leadTouch.recordTouchOnLead(_0x1c6196, {
        ..._0x486354,
        type: "like"
      });
    }
    const _0x37d3ae = _0x15e9f3.replyTarget === "profile_first" || String(_0x15e9f3.profileCommentStatus || "none") === "success";
    if (_0x13e358("profileComment") && (_0x15e9f3.profileCommentStatus === "success" || _0x37d3ae && _0x15e9f3.replyStatus === "success")) {
      leadTouch.recordTouchOnLead(_0x1c6196, {
        ..._0x486354,
        type: "profileComment",
        content: _0x15e9f3.replyContent || _0x1c6196.replyContent || ""
      });
    } else if (_0x13e358("reply") && _0x15e9f3.replyStatus === "success") {
      leadTouch.recordTouchOnLead(_0x1c6196, {
        ..._0x486354,
        type: "reply",
        content: _0x15e9f3.replyContent || _0x1c6196.replyContent || ""
      });
    }
    if (_0x13e358("follow") && (_0x15e9f3.followStatus === "success" || _0x15e9f3.followStatus === "requested" && _0x15e9f3.followRequestSent)) {
      leadTouch.recordTouchOnLead(_0x1c6196, {
        ..._0x486354,
        type: "follow"
      });
    } else if (_0x13e358("follow") && _0x15e9f3.followStatus === "already_followed") {
      _0x1c6196.touchCounts.follow = Math.max(Number(_0x1c6196.touchCounts.follow || 0), 1);
    }
    if (_0x13e358("message") && _0x15e9f3.dmStatus === "success") {
      leadTouch.recordTouchOnLead(_0x1c6196, {
        ..._0x486354,
        type: "message",
        content: _0x15e9f3.dmContent || _0x1c6196.dmContent || ""
      });
    }
    return _0x1c6196;
  }
  const _0x40b1b4 = ["followStatus", "followError", "followErrorCode", "followDiagnostic", "followRequested", "followRequestSent", "followIsPrivate", "dmStatus", "dmError", "dmContent", "isPrivate", "worksCount", "noWorks"];
  function _0x269116(_0x59b6f5) {
    return !_0x59b6f5 || _0x59b6f5 === "none" || _0x59b6f5 === "pending";
  }
  function _0x1d1883(_0x5afeb1, {
    followAllowed = false,
    dmAllowed = false,
    error = "子视图加载失败"
  } = {}) {
    if (!_0x5afeb1) {
      return;
    }
    if (followAllowed && _0x269116(_0x5afeb1.followStatus)) {
      _0x5afeb1.followStatus = "failed";
      _0x5afeb1.followError = error;
    }
    if (dmAllowed && _0x269116(_0x5afeb1.dmStatus)) {
      _0x5afeb1.dmStatus = "failed";
      _0x5afeb1.dmError = error;
    }
  }
  function _0x132ffd(_0x3c2cfd, _0x41c743 = []) {
    if (!_0x3c2cfd || !Array.isArray(_0x41c743)) {
      return;
    }
    for (const _0x2759cc of _0x41c743) {
      if (!_0x2759cc || _0x2759cc === _0x3c2cfd) {
        continue;
      }
      for (const _0x316a24 of _0x40b1b4) {
        if (_0x3c2cfd[_0x316a24] !== undefined) {
          _0x2759cc[_0x316a24] = _0x3c2cfd[_0x316a24];
        }
      }
    }
  }
  function _0x5d5fbe(_0x579827 = {}, _0x49715b = {}) {
    const _0x179aa8 = normalizeGenderFilter(_0x579827.genderFilter !== undefined ? _0x579827.genderFilter : _0x49715b.profileActionGenderFilter, "all");
    const _0x36c6b6 = _0x579827.ageFilterEnabled !== undefined ? _0x579827.ageFilterEnabled === true : _0x49715b.profileActionAgeFilterEnabled === true;
    const _0x30e080 = Number.isFinite(Number(_0x579827.ageMin)) ? Number(_0x579827.ageMin) : _0x49715b.profileActionAgeMin;
    const _0x5b6830 = Number.isFinite(Number(_0x579827.ageMax)) ? Number(_0x579827.ageMax) : _0x49715b.profileActionAgeMax;
    const _0x312c9d = _0x179aa8 !== "all" || _0x36c6b6 === true;
    const _0x1af33c = _0x312c9d ? String(_0x579827.userUrl || _0x579827.nickname || "").trim() || "unknown-user" : "bypass";
    return {
      genderFilter: _0x179aa8,
      ageEnabled: _0x36c6b6,
      ageMin: _0x30e080,
      ageMax: _0x5b6830,
      filterActive: _0x312c9d,
      cacheKey: _0x1af33c + "|" + _0x179aa8 + "|" + (_0x36c6b6 ? 1 : 0) + "|" + _0x30e080 + "|" + _0x5b6830
    };
  }
  function _0x5a1dc1(_0x3d0249, _0xa0fb26, _0x2c99a2, _0x31ea6f = null, _0x412252 = {}) {
    const _0x31b7d6 = (Array.isArray(_0x3d0249) ? _0x3d0249 : [_0x3d0249]).filter(_0x4f2217 => _0x4f2217?.content || _0x4f2217?.nickname);
    if (!_0x31b7d6.length || typeof _0x1e1b1c !== "function") {
      return 0;
    }
    const _0x1ac55f = _0x412252.updateOnly === true;
    const _0x4392c4 = _0x1e1b1c(_0x31b7d6, _0xa0fb26, _0x2c99a2, {
      updateOnly: _0x1ac55f
    }) || 0;
    _0x31b7d6.forEach(_0x355176 => {
      const _0x108db4 = leadUserKey.getLeadUserKey(_0x355176) || buildMonitorUserDedupKey(_0x355176);
      if (_0x108db4 && _0x31ea6f) {
        _0x31ea6f.add(_0x108db4);
      }
      rememberMonitorUser(_0x31ea6f, _0x355176);
      rememberGlobalMonitorUser(_0x3639c8, _0x355176);
    });
    if ((!_0x1ac55f || _0x4392c4 > 0) && _0x4cfaac && !_0x4cfaac.isDestroyed()) {
      _0x4cfaac.webContents.send("automation-data", {
        type: "comment",
        payload: _0x31b7d6.length === 1 ? _0x31b7d6[0] : _0x31b7d6,
        taskId: _0xa0fb26,
        taskName: _0x2c99a2,
        updateOnly: !!_0x1ac55f
      });
    }
    if (_0x1ac55f) {
      return _0x4392c4;
    } else {
      return _0x31b7d6.length;
    }
  }
  function _0x47c8d0(_0x2d6ab0, _0x1732e6, _0xca5cb2) {
    if (!_0xca5cb2) {
      return 0;
    }
    let _0x468ab0 = 0;
    const _0x97ae42 = _0x4822c0 => {
      if (!_0x4822c0) {
        return;
      }
      const _0x2bbc8e = String(_0x4822c0).trim();
      if (!_0x2bbc8e || _0x2bbc8e.startsWith("nick:") || _0x2bbc8e.length < 15) {
        return;
      }
      if (_0x2bbc8e.startsWith("video:") || _0x2bbc8e.startsWith("uid:") || _0x2bbc8e.startsWith("webcast:")) {
        return;
      }
      if (_0xca5cb2.has(_0x2bbc8e)) {
        return;
      }
      _0xca5cb2.add(_0x2bbc8e);
      _0x468ab0 += 1;
    };
    try {
      const _0x42f0bc = _0x1732e6?.listMatchUserKeys?.(_0x2d6ab0) || [];
      _0x42f0bc.forEach(_0x237886 => {
        if (_0x237886?.matchType === "skipped" && Number(_0x237886?.matched) === 0) {
          const _0xefb059 = String(_0x237886?.judgeReason || "");
          if (_0xefb059.includes("同用户") || _0xefb059.includes("跳过重复")) {
            return;
          }
        }
        _0x97ae42(_0x35827d(_0x237886?.userUrl || ""));
        _0x97ae42(_0x237886?.secUid || _0x237886?.sec_uid || "");
      });
    } catch (_0x2b21ee) {}
    return _0x468ab0;
  }
  function _0x373b05(_0x4bd43d) {
    return _0x3639c8.get("monitor_task_video_baseline_" + _0x4bd43d, {}) || {};
  }
  function _0x4b4348(_0xc0a658, _0x357a1e) {
    return !!_0x373b05(_0xc0a658)[_0x357a1e];
  }
  function _0x332f4d(_0xec30f8, _0xafc3a0) {
    const _0x2e5209 = _0x373b05(_0xec30f8);
    _0x2e5209[_0xafc3a0] = Date.now();
    _0x3639c8.set("monitor_task_video_baseline_" + _0xec30f8, _0x2e5209);
  }
  function _0x121d97(_0x515075, _0x58d21e, _0x3406e9) {
    if (!_0x3406e9 || _0x58d21e.has(_0x3406e9)) {
      return false;
    }
    _0x58d21e.add(_0x3406e9);
    _0x515075.push(_0x3406e9);
    return true;
  }
  function _0x5c99a1(_0x2ca58f, _0x29d339, _0x50a598 = []) {
    _0x50a598.forEach(({
      key: _0x225118
    }) => {
      _0x121d97(_0x2ca58f, _0x29d339, _0x225118);
    });
  }
  function _0x563ca5({
    comments: _0x193624,
    videoUrl: _0x50b461,
    seenKeys: _0x1fa8ea,
    updatedSeenKeys: _0x2fe225,
    seenKeySet: _0x11c3c7,
    taskId: _0x491335,
    skipContext: _0x309910,
    commentWindowMinutes: _0x2a9710,
    knownUserKeySet = null
  }) {
    const _0xf6a8ac = !_0x4b4348(_0x491335, _0x50b461);
    const _0x4edbd1 = resolveMonitorCommentWindowMinutes({
      commentWindowMinutes: _0x2a9710
    });
    const _0x42d394 = [];
    const _0x46f930 = [];
    let _0x2e9c8d = 0;
    let _0x469efb = 0;
    let _0x6d2f89 = 0;
    let _0x513717 = 0;
    let _0x5a2de0 = 0;
    const _0x3b8478 = {};
    _0x193624.forEach(_0x91b608 => {
      const _0x26b4d8 = _0x1414c1(_0x50b461, _0x91b608);
      if (_0x2d5b79(_0x11c3c7, _0x1fa8ea, _0x2fe225, _0x26b4d8)) {
        _0x2e9c8d += 1;
        _0x45fff9(_0x491335, "[采到评论-指纹重复跳过] @" + (_0x91b608.nickname || "用户") + "（时间：" + (_0x91b608.time || "未知") + "）：\"" + (_0x91b608.text || "") + "\"", "info");
        return;
      }
      if (isKnownMonitorUser(_0x91b608, knownUserKeySet)) {
        _0x5a2de0 += 1;
        _0x513717 += 1;
        const _0x49c815 = "同用户已入库";
        _0x3b8478[_0x49c815] = (_0x3b8478[_0x49c815] || 0) + 1;
        _0x46f930.push({
          comment: _0x91b608,
          key: _0x26b4d8,
          reason: _0x49c815
        });
        _0x45fff9(_0x491335, "[用户去重] @" + (_0x91b608.nickname || "用户") + " 本任务已处理过该用户，跳过重复" + ("｜评论：「" + String(_0x91b608.text || "").slice(0, 60) + "」"), "info");
        return;
      }
      const _0x5dd081 = _0x309910 ? shouldSkipMonitorComment(_0x91b608, _0x309910) : {
        skip: false
      };
      if (_0x5dd081.skip) {
        _0x513717 += 1;
        const _0x541fcd = _0x5dd081.reason || "已过滤";
        _0x3b8478[_0x541fcd] = (_0x3b8478[_0x541fcd] || 0) + 1;
        _0x46f930.push({
          comment: _0x91b608,
          key: _0x26b4d8,
          reason: _0x5dd081.reason || "已过滤"
        });
        _0x45fff9(_0x491335, "[排除过滤] " + (_0x5dd081.detail || _0x5dd081.reason || "已过滤") + ("｜评论：「" + String(_0x91b608.text || "").slice(0, 60) + "」｜时间：" + (_0x91b608.time || "未知")), "warning");
        return;
      }
      const _0x41b6c5 = parseCommentAgeMinutes(_0x91b608.time);
      if (_0x41b6c5 == null) {
        _0x6d2f89 += 1;
        _0x46f930.push({
          comment: _0x91b608,
          key: _0x26b4d8,
          reason: "时间未知，仅记录去重"
        });
        _0x45fff9(_0x491335, "[采到评论-时间未知跳过] @" + (_0x91b608.nickname || "用户") + "（时间：" + (_0x91b608.time || "未抓到时间") + "）：\"" + (_0x91b608.text || "") + "\" | 跳过原因: 无法解析发布时间", "warning");
        return;
      }
      if (_0x41b6c5 < _0x4edbd1) {
        const _0x3067cc = claimGlobalMonitorUser(_0x3639c8, _0x91b608);
        if (!_0x3067cc.claimed) {
          _0x5a2de0 += 1;
          _0x513717 += 1;
          const _0x218169 = _0x3067cc.reason === "lead_pool" ? "线索库已有该用户" : "其他任务已处理该用户";
          _0x3b8478[_0x218169] = (_0x3b8478[_0x218169] || 0) + 1;
          rememberMonitorUser(knownUserKeySet, _0x91b608);
          _0x46f930.push({
            comment: _0x91b608,
            key: _0x26b4d8,
            reason: _0x218169
          });
          _0x45fff9(_0x491335, "[全局去重] @" + (_0x91b608.nickname || "用户") + " " + _0x218169 + "，跳过" + ("｜评论：「" + String(_0x91b608.text || "").slice(0, 60) + "」"), "info");
          return;
        }
        rememberMonitorUser(knownUserKeySet, _0x91b608);
        _0x42d394.push({
          comment: _0x91b608,
          key: _0x26b4d8,
          ageMinutes: _0x41b6c5
        });
        _0x45fff9(_0x491335, "[采到评论-成功入库待研判] @" + (_0x91b608.nickname || "用户") + "（时间：" + _0x91b608.time + "，距今 " + _0x41b6c5 + " 分钟）：\"" + (_0x91b608.text || "") + "\"", "info");
        return;
      }
      _0x469efb += 1;
      _0x46f930.push({
        comment: _0x91b608,
        key: _0x26b4d8,
        reason: "超过 " + _0x4edbd1 + " 分钟"
      });
      _0x45fff9(_0x491335, "[采到评论-超过时间范围跳过] @" + (_0x91b608.nickname || "用户") + "（时间：" + _0x91b608.time + "，距今 " + _0x41b6c5 + " 分钟）：\"" + (_0x91b608.text || "") + "\" | 跳过原因: 超过设定的 " + _0x4edbd1 + " 分钟", "warning");
    });
    return {
      isFirstBaseline: _0xf6a8ac,
      windowMin: _0x4edbd1,
      toEvaluate: _0x42d394,
      toSeedOnly: _0x46f930,
      inInventoryCount: _0x2e9c8d,
      outsideWindowCount: _0x469efb,
      unknownTimeCount: _0x6d2f89,
      skippedFilterCount: _0x513717,
      duplicateUserCount: _0x5a2de0,
      skippedByReason: _0x3b8478
    };
  }
  function _0x5eacfc(_0x44c947, _0x35c3bc) {
    try {
      if (_0x4cfaac && !_0x4cfaac.isDestroyed() && !_0x4cfaac.webContents?.isDestroyed?.()) {
        _0x4cfaac.webContents.send("monitor-task-event", {
          taskId: _0x44c947,
          ..._0x35c3bc
        });
      }
    } catch (_0x2ccb23) {}
  }
  const _0x452b76 = new Map();
  const _0x59cd8f = new Map();
  function _0x2581b4(_0x34df3d = {}, _0x2b0712 = {}) {
    Object.keys(_0x2b0712 || {}).forEach(_0x5a632a => {
      const _0x386549 = Number(_0x2b0712[_0x5a632a]);
      if (Number.isFinite(_0x386549) && _0x386549 > 0) {
        _0x34df3d[_0x5a632a] = Number(_0x34df3d[_0x5a632a] || 0) + Math.floor(_0x386549);
      }
    });
    return _0x34df3d;
  }
  function _0x3a111b(_0x41711a) {
    const _0x5c5df0 = String(_0x41711a || "");
    if (!_0x5c5df0) {
      return;
    }
    const _0x48ce81 = _0x59cd8f.get(_0x5c5df0);
    if (_0x48ce81) {
      clearTimeout(_0x48ce81);
      _0x59cd8f.delete(_0x5c5df0);
    }
    const _0x131c64 = _0x452b76.get(_0x5c5df0);
    _0x452b76.delete(_0x5c5df0);
    if (!_0x131c64?.cycleId) {
      return;
    }
    const _0x5f1582 = _0x21e6e0.get(_0x5c5df0);
    if (!_0x5f1582?.monitorTasksApi?.incrementCycleMetrics) {
      return;
    }
    try {
      _0x5f1582.monitorTasksApi.incrementCycleMetrics(_0x5c5df0, _0x131c64.cycleId, _0x131c64.delta || {});
      if (_0x131c64.emit) {
        _0x5eacfc(_0x5c5df0, {
          type: "cycle-progress",
          ts: Date.now(),
          cycleId: _0x131c64.cycleId
        });
      }
    } catch (_0x1b3449) {}
  }
  function _0xdd9c41(_0x3bb875, _0x40a6e1 = {}, {
    emit = false
  } = {}) {
    const _0x4e7514 = _0x21e6e0.get(_0x3bb875);
    const _0x54f656 = _0x4e7514?.currentCycleId;
    if (!_0x4e7514?.monitorTasksApi?.incrementCycleMetrics || !_0x54f656) {
      return;
    }
    const _0x4df93f = Object.values(_0x40a6e1 || {}).some(_0x3bf467 => Number(_0x3bf467) > 0);
    if (!_0x4df93f) {
      return;
    }
    const _0x476851 = String(_0x3bb875);
    const _0x3fb6e6 = _0x452b76.get(_0x476851);
    if (_0x3fb6e6 && _0x3fb6e6.cycleId !== _0x54f656) {
      _0x3a111b(_0x476851);
    }
    const _0x14742e = _0x452b76.get(_0x476851) || {
      cycleId: _0x54f656,
      delta: {},
      emit: false
    };
    _0x14742e.cycleId = _0x54f656;
    _0x2581b4(_0x14742e.delta, _0x40a6e1);
    _0x14742e.emit = _0x14742e.emit || emit;
    _0x452b76.set(_0x476851, _0x14742e);
    if (!_0x59cd8f.has(_0x476851)) {
      const _0x59ca59 = setTimeout(() => {
        _0x59cd8f.delete(_0x476851);
        _0x3a111b(_0x476851);
      }, _0x1f40e5);
      _0x59cd8f.set(_0x476851, _0x59ca59);
    }
  }
  async function _0x5c271f(_0xe7038a, _0x3f7eb3, {
    taskName = "",
    account = null,
    videoItem = null,
    comment = null,
    matchRecord = null
  } = {}) {
    const _0x3ccc62 = resolveMonitorWebhookTarget(_0x3f7eb3 || {});
    if (!_0x3ccc62) {
      if (_0x3f7eb3?.enableWebhook) {
        _0x45fff9(_0xe7038a, "命中通知已开启，但 Webhook 地址无效，已跳过推送", "warning");
      }
      return false;
    }
    if (!_0x392dab || typeof _0x392dab.post !== "function") {
      _0x45fff9(_0xe7038a, "命中通知推送失败：缺少 HTTP 客户端", "warning");
      return false;
    }
    const _0x2aecb4 = account?.nickname || account?.name || matchRecord?.accountName || "监控账号";
    const _0x31cb8b = clipMonitorWebhookText(videoItem?.title || matchRecord?.videoTitle || "未命名视频", 48);
    const _0x12b88b = String(videoItem?.url || matchRecord?.videoUrl || "").trim();
    const _0x56b5c6 = comment?.nickname || matchRecord?.nickname || "用户";
    const _0x1ed7cf = clipMonitorWebhookText(comment?.text || matchRecord?.commentText || "", 160);
    const _0x73ecae = matchRecord?.matchType || "keyword";
    const _0x9649fa = clipMonitorWebhookText(matchRecord?.aiIntention || "", 40);
    const _0x40b3ca = String(comment?.userUrl || "").trim();
    const _0x2e6e5c = _0x40b3ca ? "[" + _0x56b5c6 + "](" + _0x40b3ca + ")" : "@" + _0x56b5c6;
    const _0x353220 = _0x12b88b ? "[" + (_0x31cb8b || "视频") + "](" + _0x12b88b + ")" : _0x31cb8b || "视频";
    const _0x72e472 = ["**任务**: " + (taskName || _0xe7038a), "**监控账号**: " + _0x2aecb4, "**视频**: " + _0x353220, "**评论用户**: " + _0x2e6e5c, "**评论内容**: " + (_0x1ed7cf || "（无正文）"), "**命中方式**: " + _0x73ecae + (_0x9649fa ? " · " + _0x9649fa : "")].join("\n");
    try {
      const _0x434ee1 = buildMonitorMatchWebhookPayload(_0x3ccc62.type, {
        title: "🎯 监控命中 - " + (taskName || "监控任务"),
        content: _0x72e472,
        time: new Date().toLocaleString()
      });
      const _0x581dec = _0x3ccc62.type === "dingtalk" ? buildSignedDingtalkUrl(_0x3ccc62.url, _0x3ccc62.secret) : _0x3ccc62.url;
      const _0x53c56e = await _0x392dab.post(_0x581dec, _0x434ee1, {
        timeout: 10000
      });
      const _0x55e027 = isMonitorWebhookResponseSuccess(_0x3ccc62.type, _0x53c56e);
      if (matchRecord) {
        matchRecord.webhookStatus = _0x55e027 ? "success" : "failed";
        if (!_0x55e027) {
          matchRecord.webhookError = "Webhook 返回异常";
        }
      }
      _0x45fff9(_0xe7038a, _0x55e027 ? "命中通知已推送 @" + _0x56b5c6 : "命中通知推送失败：机器人返回异常 @" + _0x56b5c6, _0x55e027 ? "success" : "warning");
      return _0x55e027;
    } catch (_0x574435) {
      if (matchRecord) {
        matchRecord.webhookStatus = "failed";
        matchRecord.webhookError = _0x574435?.message || String(_0x574435);
      }
      _0x45fff9(_0xe7038a, "命中通知推送失败：" + (_0x574435?.message || _0x574435), "warning");
      return false;
    }
  }
  function _0x45fff9(_0x3ad47a, _0x8983bb, _0xaab5d0 = "info", _0x5d5aa0 = {}) {
    if (!_0x3ad47a || !_0x8983bb) {
      return;
    }
    let _0x56a07f = String(_0x5d5aa0?.accountId || "").trim();
    if (!_0x56a07f) {
      try {
        const _0x3aa20a = _0x21e6e0.get(_0x3ad47a);
        _0x56a07f = String(_0x3aa20a?.currentAccountId || "").trim();
        if (!_0x56a07f) {
          const _0x263c1b = Array.isArray(_0x3aa20a?.accounts) ? _0x3aa20a.accounts : [];
          if (_0x263c1b.length === 1 && _0x263c1b[0]?.id) {
            _0x56a07f = String(_0x263c1b[0].id);
          }
        }
      } catch (_0x5eca67) {}
    }
    const _0x1602bf = {
      taskId: _0x3ad47a,
      type: "log",
      message: _0x8983bb,
      level: _0xaab5d0,
      ts: Date.now(),
      ...(_0x56a07f ? {
        accountId: _0x56a07f
      } : {})
    };
    if (!_0x130d12.has(_0x3ad47a) && _0x130d12.size >= _0x3ef8bc) {
      const _0x3fd95d = [..._0x130d12.keys()].find(_0x39a75b => !_0x21e6e0.has(_0x39a75b)) || _0x130d12.keys().next().value;
      if (_0x3fd95d != null) {
        _0x130d12.delete(_0x3fd95d);
      }
    }
    const _0x2c4969 = _0x130d12.get(_0x3ad47a) || [];
    _0x2c4969.push(_0x1602bf);
    if (_0x2c4969.length > _0x1e9edf) {
      _0x2c4969.splice(0, _0x2c4969.length - _0x1e9edf);
    }
    _0x130d12.set(_0x3ad47a, _0x2c4969);
    _0x5eacfc(_0x3ad47a, _0x1602bf);
  }
  function _0x298069(_0x8608eb = null) {
    if (_0x8608eb != null && _0x8608eb !== "") {
      return (_0x130d12.get(_0x8608eb) || []).map(_0x36cf24 => ({
        ..._0x36cf24
      }));
    }
    const _0x2c7d78 = {};
    for (const [_0xc8ab28, _0x1e0052] of _0x130d12.entries()) {
      _0x2c7d78[_0xc8ab28] = _0x1e0052.map(_0x122ea3 => ({
        ..._0x122ea3
      }));
    }
    return _0x2c7d78;
  }
  function _0x280196(_0xdd3e0d = null) {
    if (_0xdd3e0d != null && _0xdd3e0d !== "") {
      return _0x130d12.delete(_0xdd3e0d);
    }
    const _0x980fd2 = _0x130d12.size > 0;
    _0x130d12.clear();
    return _0x980fd2;
  }
  function _0x55c83d() {
    let _0x11fe20 = path.join(__dirname, "..", "automation-preload.js");
    if (_0x1b7ef4.isPackaged) {
      const _0x594387 = _0x3639c8.get("latest_resource_path");
      if (_0x594387 && _0x5bb1c6.existsSync(path.join(_0x594387, "automation-preload.js"))) {
        _0x11fe20 = path.join(_0x594387, "automation-preload.js");
      }
    }
    return _0x11fe20;
  }
  function _0x382b78(_0x4e5e9c, _0x5c6a08) {
    if (!_0x4e5e9c || _0x4e5e9c.isDestroyed() || _0x4e5e9c.__radarMonitorHealthGuardsAttached) {
      return;
    }
    const _0x12884c = _0x4e5e9c.webContents;
    const _0x153def = _0x12884c.id;
    let _0x48b828 = null;
    _0x4e5e9c.__radarMonitorHealthGuardsAttached = true;
    _0x4e5e9c.__radarMonitorUnhealthy = false;
    _0x12884c.__radarMonitorUnhealthy = false;
    const _0x1beb47 = () => {
      if (!_0x48b828) {
        return;
      }
      clearTimeout(_0x48b828);
      _0x48b828 = null;
    };
    const _0x32aa44 = (_0x3e71fd, _0x566905) => {
      if (_0x4e5e9c.__radarMonitorUnhealthy) {
        return;
      }
      _0x4e5e9c.__radarMonitorUnhealthy = true;
      _0x12884c.__radarMonitorUnhealthy = true;
      const _0x3a8008 = _0xe5656a(_0x153def, _0x3e71fd, _0x566905);
      console.warn("[Monitor][" + _0x5c6a08 + "] " + _0x3e71fd + ": " + _0x566905 + "，已提前结束 " + _0x3a8008 + " 个等待中的页面指令");
      const _0x3a5315 = String(_0x5c6a08 || "");
      for (const [_0xe6beac, _0x216b92] of _0x21e6e0.entries()) {
        const _0x180392 = (Array.isArray(_0x216b92?.accounts) ? _0x216b92.accounts : []).some(_0x15cdf5 => String(_0x15cdf5?.id || _0x15cdf5?.accountId || "") === _0x3a5315);
        if (!_0x180392) {
          continue;
        }
        _0x45fff9(_0xe6beac, "后台监控页异常（" + _0x3e71fd + "：" + _0x566905 + "），已结束 " + _0x3a8008 + " 个等待中的页面指令，任务继续", "warning", {
          accountId: _0x3a5315
        });
      }
    };
    _0x12884c.on("unresponsive", () => {
      if (_0x4e5e9c.__radarMonitorUnhealthy || _0x48b828) {
        return;
      }
      _0x4e5e9c.__radarMonitorUnresponsive = true;
      _0x48b828 = setTimeout(() => {
        _0x48b828 = null;
        if (_0x4e5e9c.isDestroyed() || !_0x4e5e9c.__radarMonitorUnresponsive) {
          return;
        }
        _0x32aa44("monitor_renderer_unresponsive", "后台监控页持续无响应超过 " + Math.round(_0x5d2103 / 1000) + " 秒");
      }, _0x5d2103);
    });
    _0x12884c.on("responsive", () => {
      _0x4e5e9c.__radarMonitorUnresponsive = false;
      _0x1beb47();
    });
    _0x12884c.on("render-process-gone", (_0x272e17, _0x38391b = {}) => {
      _0x1beb47();
      const _0x5bf0cf = _0x38391b.reason || "unknown";
      _0x32aa44("monitor_renderer_gone", "后台监控渲染进程已退出（" + _0x5bf0cf + "）");
    });
    _0x4e5e9c.on("closed", () => {
      _0x1beb47();
      _0xe5656a(_0x153def, "monitor_window_closed", "后台监控窗口已关闭");
    });
  }
  function _0x405dec(_0x1f9929) {
    try {
      if (!_0x1f9929 || _0x1f9929.isDestroyed()) {
        return 0;
      }
      const _0x492c08 = _0x1f9929.getOSProcessId();
      const _0x2f1a94 = _0x1b7ef4.getAppMetrics().find(_0x99673e => _0x99673e.pid === _0x492c08);
      return Math.round(Number(_0x2f1a94?.memory?.workingSetSize || 0) / 1024);
    } catch (_0x50f088) {
      return 0;
    }
  }
  function _0x5e9015(_0x28ee98) {
    if (!_0x28ee98 || _0x28ee98.isDestroyed()) {
      return 0;
    }
    return _0x405dec(_0x28ee98.webContents);
  }
  async function _0x5addde(_0x56c5a2, _0x1d008f) {
    const {
      facade: _0xf14477,
      viewKey: _0x520d09
    } = await _0x359f8a.createMonitorAccountHost(_0x56c5a2, _0x1d008f, {
      platform: "douyin"
    });
    _0xf14477.__radarMonitorViewKey = _0x520d09;
    _0xf14477.__radarMonitorActive = false;
    _0xf14477.__radarAllowVisibleMonitor = false;
    _0xf14477.__radarMonitorLastUsedAt = Date.now();
    _0xf14477.__radarMonitorProcessedVideos = 0;
    try {
      _0xf14477.setTitle("监控任务 - " + _0x56c5a2);
    } catch (_0x3978d1) {}
    _0x382b78(_0xf14477, _0x56c5a2);
    _0xf14477.__radarMonitorAuthorPostCapture = createMonitorAuthorPostCapture(_0xf14477);
    const _0x3dad36 = () => {
      try {
        _0xf14477.__radarMonitorAuthorPostCapture?.detachIfOwned?.();
      } catch (_0x5a587c) {}
      try {
        const _0x44ff6c = _0xf14477.webContents?.debugger;
        if (_0x44ff6c?.isAttached?.()) {
          _0x44ff6c.detach();
        }
      } catch (_0x4c5f58) {}
    };
    try {
      _0xf14477.webContents.setMaxListeners?.(32);
    } catch (_0x177617) {}
    try {
      _0xf14477.webContents.on("before-input-event", (_0x5b22a5, _0xf34f59) => {
        if (!_0xf34f59 || _0xf34f59.type !== "keyDown") {
          return;
        }
        const _0x319f12 = String(_0xf34f59.key || "");
        const _0x3af965 = _0x319f12.toLowerCase();
        const _0x7f2794 = !!_0xf34f59.control || !!_0xf34f59.meta;
        const _0x1be1df = _0x319f12 === "F12" || _0x7f2794 && _0xf34f59.alt && _0x3af965 === "i" || _0x7f2794 && _0xf34f59.shift && _0x3af965 === "i";
        if (_0x1be1df) {
          _0x3dad36();
        }
      });
    } catch (_0x3343b8) {}
    try {
      const _0x238ad9 = _0xf14477.webContents;
      if (typeof _0x238ad9.openDevTools === "function" && !_0x238ad9.__radarMonitorDevToolsPatched) {
        const _0x33dff1 = _0x238ad9.openDevTools.bind(_0x238ad9);
        _0x238ad9.openDevTools = (..._0x3175d5) => {
          _0x3dad36();
          return _0x33dff1(..._0x3175d5);
        };
        _0x238ad9.__radarMonitorDevToolsPatched = true;
      }
    } catch (_0x1747c4) {}
    _0xf14477.webContents.on("dom-ready", () => {
      _0x26ed9a(_0xf14477);
      runtimeConfig?.ensureAndPushToWebContents?.(_0xf14477.webContents);
      try {
        const _0x50d0ee = JSON.stringify(_0x520d09 || "");
        _0xf14477.webContents.executeJavaScript("(() => {\n            try {\n              if (" + _0x50d0ee + ") {\n                window.__radar_view_key = " + _0x50d0ee + ";\n                sessionStorage.setItem('radar_view_key', " + _0x50d0ee + ");\n              }\n            } catch (_) {}\n            return true;\n          })()", true).catch(() => {});
      } catch (_0xb02950) {}
      automationLiveViewLifecycle?.wake?.(_0x520d09);
    });
    _0xf14477.webContents.on("did-finish-load", () => {
      automationLiveViewLifecycle?.wake?.(_0x520d09);
      try {
        requestAutomationLayoutRefresh?.();
      } catch (_0x25f4d2) {}
    });
    return _0xf14477;
  }
  async function _0xfc3a53(_0x3bc25b, _0x49d52f) {
    if (!_0x3bc25b || _0x3bc25b.isDestroyed?.()) {
      throw new Error("监控窗口已销毁");
    }
    if (_0x3bc25b.__radarMonitorUnhealthy || _0x3bc25b.webContents?.__radarMonitorUnhealthy) {
      const _0x3cd08b = new Error("后台监控渲染进程状态异常");
      _0x3cd08b.code = "monitor_renderer_unhealthy";
      throw _0x3cd08b;
    }
    _0x3e0637(_0x3bc25b, true);
    _0x192d35(_0x3bc25b);
    const _0x333214 = typeof _0x3bc25b.loadURL === "function" ? () => _0x3bc25b.loadURL(_0x49d52f) : () => _0x3bc25b.webContents.loadURL(_0x49d52f);
    let _0x294541 = null;
    try {
      await Promise.race([_0x333214(), new Promise((_0x29e904, _0x75c1f3) => {
        _0x294541 = setTimeout(() => {
          const _0x35f14d = new Error("页面加载超过 " + Math.round(_0x19b687 / 1000) + " 秒");
          _0x35f14d.code = "monitor_navigation_timeout";
          _0x75c1f3(_0x35f14d);
        }, _0x19b687);
      })]);
    } catch (_0x4b0cb2) {
      if (_0x4b0cb2?.code === "monitor_navigation_timeout") {
        try {
          _0x3bc25b.webContents.stop();
        } catch (_0x16a3cd) {}
        throw _0x4b0cb2;
      }
      const _0x498946 = String(_0x4b0cb2?.message || _0x4b0cb2 || "");
      if (_0x498946.includes("ERR_ABORTED") || _0x498946.includes("ERR_FAILED") || /\(-3\)/.test(_0x498946)) {
        console.log("[Monitor] loadURL aborted/failed（已忽略）: " + String(_0x49d52f || "").slice(0, 120));
      } else {
        throw _0x4b0cb2;
      }
    } finally {
      if (_0x294541) {
        clearTimeout(_0x294541);
      }
    }
    _0x26ed9a(_0x3bc25b);
    _0x192d35(_0x3bc25b);
    await _0x586088(_0x3bc25b.webContents);
  }
  async function _0x18cf64(_0x145998, _0x334e33, _0x1cabff, _0xa78bc9, _0x19136e) {
    return _0x14f1c8.runMonitorProfileActionsInSubview(_0x145998, _0x334e33, _0x1cabff, _0xa78bc9, _0x19136e, _0xfc3a53);
  }
  async function _0x316536(_0x5c86f5, _0x34ef39, _0x242001, _0x2cfd00 = "") {
    const _0x389496 = String(_0x5c86f5);
    const _0x4d2338 = _0x279862.get(_0x389496);
    const _0x429479 = _0x4d2338 || _0x242001;
    const _0x2f1f32 = _0x45c4f7(_0x429479);
    if (_0x429479 && !_0x429479.isDestroyed()) {
      try {
        _0x429479.destroy();
      } catch (_0x57fa7e) {}
    }
    if (_0x279862.get(_0x389496) === _0x429479) {
      _0x279862.delete(_0x389496);
    }
    const _0x1b6432 = await _0x36b772(_0x5c86f5, _0x34ef39, _0x2cfd00);
    if (_0x2f1f32 && _0x2cfd00) {
      try {
        await _0x4dd83e({
          taskId: String(_0x2cfd00),
          accountId: _0x389496
        });
      } catch (_0x3ba574) {}
    }
    return _0x1b6432;
  }
  function _0x177598(_0x5598de, _0x5ccde3, _0x10095a = "") {
    if (!_0x5598de || _0x5598de.isDestroyed?.()) {
      return false;
    }
    const _0x1dc6e7 = String(_0x5598de.__radarMonitorViewKey || "").trim();
    const _0x94d314 = _0x1dc6e7 && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x1dc6e7) : null;
    if (!_0x94d314 || _0x94d314.webContents?.isDestroyed?.()) {
      return false;
    }
    const _0x919e04 = automationLiveViewLifecycle?.beginTask?.(_0x1dc6e7, {
      taskId: String(_0x10095a || "monitor-host:" + _0x5ccde3),
      runtimeTaskId: String(_0x10095a || ""),
      accountId: String(_0x5ccde3),
      taskMode: "video_monitor",
      videoMonitor: true
    });
    return _0x919e04?.ok === true;
  }
  async function _0x36b772(_0x1df5a1, _0x89f7f9, _0x4f7f0e = "") {
    const _0x2e7b5e = String(_0x1df5a1);
    let _0x5d23ca = _0x279862.get(_0x2e7b5e);
    if (_0x5d23ca && !_0x5d23ca.isDestroyed() && !_0x5d23ca.__radarMonitorUnhealthy) {
      const _0x20a87a = String(_0x5d23ca.__radarMonitorViewKey || "").trim();
      const _0x3e750 = _0x20a87a && typeof getPlatformViews === "function" ? getPlatformViews()?.get?.(_0x20a87a) : null;
      if (_0x3e750?.webContents === _0x5d23ca.webContents && !_0x3e750.webContents?.isDestroyed?.()) {
        _0x177598(_0x5d23ca, _0x1df5a1, _0x4f7f0e);
        return _0x5d23ca;
      }
    }
    if (_0x5d23ca && !_0x5d23ca.isDestroyed()) {
      const _0x37d40d = _0x45c4f7(_0x5d23ca);
      try {
        _0x5d23ca.destroy();
      } catch (_0x738d29) {}
      if (_0x279862.get(_0x2e7b5e) === _0x5d23ca) {
        _0x279862.delete(_0x2e7b5e);
      }
      _0x5d23ca = await _0x5addde(_0x1df5a1, _0x89f7f9);
      _0x3e0637(_0x5d23ca, true);
      _0x279862.set(_0x2e7b5e, _0x5d23ca);
      _0x5d23ca.on("closed", () => {
        try {
          _0x5d23ca.__radarMonitorAuthorPostCapture?.dispose?.();
        } catch (_0x5cca57) {}
        if (_0x279862.get(_0x2e7b5e) === _0x5d23ca) {
          _0x279862.delete(_0x2e7b5e);
        }
      });
      _0x177598(_0x5d23ca, _0x1df5a1, _0x4f7f0e);
      if (_0x37d40d && _0x4f7f0e) {
        try {
          await _0x4dd83e({
            taskId: String(_0x4f7f0e),
            accountId: _0x2e7b5e
          });
        } catch (_0xa41d88) {}
      }
      return _0x5d23ca;
    }
    _0x5d23ca = await _0x5addde(_0x1df5a1, _0x89f7f9);
    _0x3e0637(_0x5d23ca, true);
    _0x279862.set(_0x2e7b5e, _0x5d23ca);
    _0x5d23ca.on("closed", () => {
      try {
        _0x5d23ca.__radarMonitorAuthorPostCapture?.dispose?.();
      } catch (_0x320db5) {}
      if (_0x279862.get(_0x2e7b5e) === _0x5d23ca) {
        _0x279862.delete(_0x2e7b5e);
      }
    });
    _0x177598(_0x5d23ca, _0x1df5a1, _0x4f7f0e);
    return _0x5d23ca;
  }
  function _0x5c505b(_0x47b5aa, _0x16452a = 80) {
    const _0x5b79a7 = String(_0x47b5aa || "").replace(/\s+/g, " ").trim();
    if (_0x5b79a7.length <= _0x16452a) {
      return _0x5b79a7;
    }
    return _0x5b79a7.slice(0, _0x16452a) + "…";
  }
  function _0x3630c1(_0x3dbece = 5000, _0x44b32b = 10000) {
    const _0x439c56 = Math.max(0, Math.min(Number(_0x3dbece) || 0, Number(_0x44b32b) || 0));
    const _0xd09e8f = Math.max(_0x439c56, Math.max(Number(_0x3dbece) || 0, Number(_0x44b32b) || 0));
    const _0x25cc40 = _0x439c56 + Math.floor(Math.random() * (_0xd09e8f - _0x439c56 + 1));
    return new Promise(_0x40d799 => setTimeout(_0x40d799, _0x25cc40)).then(() => _0x25cc40);
  }
  function _0xb20a91(_0x21e1d2, _0x49723c, _0x1e5a2 = _0x42350e) {
    if (!_0x21e1d2 || _0x21e1d2.isDestroyed?.()) {
      const _0x6b552d = new Error("监控窗口已销毁");
      _0x6b552d.code = "monitor_window_closed";
      return Promise.reject(_0x6b552d);
    }
    const _0x36815b = Math.max(2000, Number(_0x1e5a2) || _0x42350e);
    return new Promise((_0x207705, _0x1f1c3c) => {
      let _0x175481 = false;
      const _0x54adbb = setTimeout(() => {
        if (_0x175481) {
          return;
        }
        _0x175481 = true;
        const _0x12bb08 = new Error("页面脚本超过 " + Math.round(_0x36815b / 1000) + " 秒未返回");
        _0x12bb08.code = "monitor_javascript_timeout";
        _0x1f1c3c(_0x12bb08);
      }, _0x36815b);
      Promise.resolve(_0x21e1d2.executeJavaScript(_0x49723c, true)).then(_0x10f8c1 => {
        if (_0x175481) {
          return;
        }
        _0x175481 = true;
        clearTimeout(_0x54adbb);
        _0x207705(_0x10f8c1);
      }).catch(_0x3c5c13 => {
        if (_0x175481) {
          return;
        }
        _0x175481 = true;
        clearTimeout(_0x54adbb);
        _0x1f1c3c(_0x3c5c13);
      });
    });
  }
  async function _0x382c1a(_0x13922e, _0x3d89a1) {
    const _0x45fe18 = !_0x13922e || _0x13922e.isDestroyed() ? "" : String(_0x13922e.webContents.getURL() || "");
    const _0x26079b = isSameMonitorVideo(_0x3d89a1, _0x45fe18);
    const _0x21d78d = {
      sameVideo: _0x26079b,
      url: _0x45fe18,
      loading: false,
      panelOpen: false,
      commentItems: 0,
      networkError: false,
      blankPage: false
    };
    if (!_0x13922e || _0x13922e.isDestroyed() || _0x13922e.webContents.isDestroyed()) {
      return {
        ..._0x21d78d,
        blankPage: true,
        sameVideo: false
      };
    }
    try {
      const _0x74d583 = await _0xb20a91(_0x13922e.webContents, "(() => {\n        try {\n          const text = String(document.body?.innerText || '').replace(/\\s+/g, ' ').slice(0, 1600);\n          const networkError = /网络不太顺畅|网络异常|加载失败|请检查网络|刷新重试|连接超时|请求超时/.test(text);\n          const loadingText = /加载中|正在加载|请稍候|内容加载/.test(text);\n          let loadingEl = false;\n          try {\n            loadingEl = Array.from(document.querySelectorAll(\n              '[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]'\n            )).some((el) => {\n              const r = el.getBoundingClientRect();\n              return r.width >= 6 && r.height >= 6 && r.bottom > 0 && r.top < (window.innerHeight || 800);\n            });\n          } catch (_) { loadingEl = false; }\n          const panel = document.querySelector(\n            '[data-e2e=\"comment-list\"], .comment-mainContent, [class*=\"comment-list\"], [class*=\"CommentList\"], [class*=\"comment-main\"]'\n          );\n          let panelOpen = false;\n          let commentItems = 0;\n          if (panel) {\n            const pr = panel.getBoundingClientRect();\n            panelOpen = pr.height > 60 && pr.width > 60;\n            try {\n              commentItems = panel.querySelectorAll(\n                '[data-e2e=\"comment-item\"], [class*=\"comment-item\"], [class*=\"CommentItem\"]'\n              ).length;\n            } catch (_) { commentItems = 0; }\n          }\n          const blankPage = !text || text.length < 8;\n          return {\n            loading: loadingText || loadingEl,\n            panelOpen,\n            commentItems,\n            networkError,\n            blankPage,\n            href: String(location.href || ''),\n          };\n        } catch (err) {\n          return {\n            loading: false,\n            panelOpen: false,\n            commentItems: 0,\n            networkError: false,\n            blankPage: true,\n            href: '',\n            error: String(err && err.message || err || ''),\n          };\n        }\n      })()");
      return {
        ..._0x21d78d,
        sameVideo: isSameMonitorVideo(_0x3d89a1, _0x74d583?.href || _0x45fe18),
        url: _0x74d583?.href || _0x45fe18,
        loading: !!_0x74d583?.loading,
        panelOpen: !!_0x74d583?.panelOpen,
        commentItems: Number(_0x74d583?.commentItems) || 0,
        networkError: !!_0x74d583?.networkError,
        blankPage: !!_0x74d583?.blankPage
      };
    } catch (_0x915ae2) {
      return {
        ..._0x21d78d,
        blankPage: true
      };
    }
  }
  function _0x1598e4(_0x13ef99 = {}, _0x589a4d = "") {
    if (!_0x13ef99.sameVideo) {
      return {
        reload: true,
        reason: "当前页面已不是目标视频"
      };
    }
    if (_0x13ef99.blankPage && !_0x13ef99.panelOpen) {
      return {
        reload: true,
        reason: "页面几乎空白，可能加载失败"
      };
    }
    if (_0x13ef99.networkError && !_0x13ef99.panelOpen && _0x13ef99.commentItems <= 0) {
      return {
        reload: true,
        reason: "页面提示网络异常且评论区不可用"
      };
    }
    if (["comment_node_not_found", "like_button_not_found", "comment_like_failed", "reply_button_not_found", "reply_input_not_found", "target_comment_not_found"].includes(String(_0x589a4d || ""))) {
      return {
        reload: false,
        reason: _0x13ef99.loading ? "页面仍在加载，先等待网络恢复" : _0x13ef99.panelOpen ? "评论区仍在（可见 " + _0x13ef99.commentItems + " 条），先等待后原地重试" : "仍在目标视频页，先等待后原地重试"
      };
    }
    return {
      reload: false,
      reason: "仍在目标视频页，先等待后原地重试"
    };
  }
  async function _0x43a025({
    win: _0x5f5240,
    taskId: _0x2d79b3,
    videoItem: _0x2a088d,
    commentCid = "",
    nickname = "",
    errorCode = "",
    actionLabel = "互动",
    runRetry: _0x38aa74
  }) {
    const _0x8b03c1 = await _0x382c1a(_0x5f5240, _0x2a088d?.url || "");
    const _0x7858d9 = _0x1598e4(_0x8b03c1, errorCode);
    if (_0x7858d9.reload) {
      _0x45fff9(_0x2d79b3, actionLabel + "首次未成功（" + (errorCode || "未知") + "）：" + _0x7858d9.reason + "，将重载目标视频后再试 @" + (nickname || "用户"), "info");
      await _0xfc3a53(_0x5f5240, resolveDouyinMonitorVideoUrl(_0x2a088d.url, commentCid));
    } else {
      _0x45fff9(_0x2d79b3, actionLabel + "首次未成功（" + (errorCode || "未知") + "）：" + _0x7858d9.reason + "（加载中=" + (_0x8b03c1.loading ? "是" : "否") + "，评论区=" + (_0x8b03c1.panelOpen ? "开" : "关") + "，可见评论=" + _0x8b03c1.commentItems + "），不重载页面", "info");
    }
    const _0x393d57 = await _0x3630c1(5000, 10000);
    _0x45fff9(_0x2d79b3, actionLabel + "重试前已停留 " + (_0x393d57 / 1000).toFixed(1) + " 秒，开始第二次 @" + (nickname || "用户"), "info");
    _0x192d35(_0x5f5240);
    return _0x38aa74();
  }
  function _0x254963(_0xe5dd81, _0x345851 = "未知原因") {
    let _0x1eaeb8 = _0xe5dd81?.error || _0x345851;
    let _0x1d9a84 = _0xe5dd81?.errorCode || "";
    const _0x20e469 = String(_0xe5dd81?.diagnostic || "").trim();
    const _0x1d70cf = !!_0xe5dd81?.noWorks || _0x1eaeb8 === "no_works" || _0x1d9a84 === "no_works";
    const _0x1faab8 = _0x1eaeb8 === "profile_works_not_ready" || _0x1d9a84 === "profile_works_not_ready";
    if (_0x1d70cf) {
      const _0x193344 = {
        tab_count_zero: "该用户主页作品数为 0，没有可评论的首作",
        empty_state: "该用户主页显示暂无作品，没有可评论的首作",
        empty_grid: "该用户主页作品列表为空，没有可评论的首作",
        empty_state_late: "等待后仍显示暂无作品，没有可评论的首作",
        timeout_empty: "等待作品区加载超时且未发现公开作品，没有可评论的首作",
        no_video_cards: "该用户主页未找到可打开的作品卡片，没有可评论的首作"
      };
      _0x1eaeb8 = _0x193344[_0x20e469] || (_0x1eaeb8 && _0x1eaeb8 !== "no_works" ? String(_0x1eaeb8) : "该用户主页未发布公开作品，没有可评论的首作");
      _0x1d9a84 = "";
    } else if (_0x1faab8) {
      const _0x30f21e = {
        timeout_unknown: "用户主页作品区加载超时，尚未确认是否有公开作品（可重试）",
        aborted: "等待作品区加载时任务已停止",
        unknown: "用户主页作品区尚未加载完成，暂时无法评论首作（可重试）"
      };
      _0x1eaeb8 = _0x30f21e[_0x20e469] || (_0x1eaeb8 && _0x1eaeb8 !== "profile_works_not_ready" ? String(_0x1eaeb8) : "用户主页作品区未就绪，暂时无法评论首作（可重试）");
      _0x1d9a84 = "";
    }
    const _0x3a9035 = _0x5c505b(_0x1eaeb8, 120);
    const _0x229a1b = _0x5c505b(_0x1d9a84, 50);
    const _0x3b1cb4 = _0x1d70cf || _0x1faab8 ? "" : _0x5c505b(_0xe5dd81?.diagnostic || _0xe5dd81?.detail || "", 180);
    return [_0x3a9035, _0x229a1b ? "错误码=" + _0x229a1b : "", _0x3b1cb4 ? "环境=" + _0x3b1cb4 : ""].filter(Boolean).join("；");
  }
  function _0x28deb7(_0x1afe5a) {
    return new Set(["target_comment_not_found", "reply_button_not_found", "reply_input_not_found"]).has(_0x1afe5a?.errorCode);
  }
  function _0x27b958(_0x2160af, _0x186b5d = {}) {
    const _0x2cd158 = String(_0x186b5d.videoTitle || "").trim();
    const _0x426c81 = String(_0x2160af?.title || "").trim();
    const _0x3e2595 = _0x5c505b(_0x2cd158 || (_0x426c81 && _0x426c81 !== "手动添加" ? _0x426c81 : "") || _0x426c81 || "未知视频", 60);
    const _0x2e07d6 = String(_0x186b5d.videoUrl || _0x2160af?.url || "").trim();
    const _0x8b922e = _0x186b5d.totalCount != null ? Number(_0x186b5d.totalCount) : null;
    return {
      title: _0x3e2595,
      url: _0x2e07d6,
      totalCount: _0x8b922e
    };
  }
  function _0xef49b9(_0x47bae3, _0x488da5 = "") {
    const _0x711ea7 = _0x47bae3.url ? " " + _0x47bae3.url : "";
    const _0x595a2b = Number.isFinite(_0x47bae3.totalCount) ? "，评论总数 " + _0x47bae3.totalCount : "";
    return "视频「" + _0x47bae3.title + "」" + _0x711ea7 + _0x595a2b + _0x488da5;
  }
  function _0xc79d27(_0x3a6b09, _0x4e285a = {}) {
    const _0x26281d = _0x3a6b09?.nickname || "用户";
    const _0x30a6ff = _0x4e285a.matched ? "命中" : "未命中";
    const _0x57af39 = _0x4e285a.matchType === "ai" ? "AI" : "关键词";
    const _0x292f8f = _0x3a6b09?.text ? "「" + _0x5c505b(_0x3a6b09.text, 60) + "」" : "「未解析到正文」";
    const _0x5eeb0f = _0x4e285a.reason ? "：" + _0x5c505b(_0x4e285a.reason, 100) : "";
    return "评论研判：@" + _0x26281d + " " + _0x292f8f + " → " + _0x30a6ff + "（" + _0x57af39 + "）" + _0x5eeb0f;
  }
  function _0xb69888(_0x4e38bf, _0xd4982c) {
    const _0x2ff3d8 = typeof _0x4b4cae === "function" ? _0x4b4cae(_0x4e38bf) : _0x4e38bf?.useAiJudge === true;
    if (_0x2ff3d8) {
      if (_0x3efaad(_0x4e38bf, _0xd4982c)) {
        return "账号绑定的 AI 智能体";
      } else {
        return "通用 AI（账号未绑定智能体）";
      }
    }
    const _0x4009eb = String(_0x4e38bf?.keywords || "").split(/[,，]/).map(_0x4f045e => _0x4f045e.trim()).filter(Boolean);
    const _0x370136 = _0x4009eb.length > 0 ? "关键词匹配「" + _0x5c505b(_0x4009eb.join("、"), 80) + "」" : "关键词匹配（未设置关键词，所有新评论均视为命中）";
    return _0x370136 + "；账号绑定智能体不参与意向判定";
  }
  function _0x339424(_0xbc637f = {}) {
    const _0x158276 = typeof _0xbc637f === "string" ? _0xbc637f : _0xbc637f.url;
    const _0x3d602e = normalizeDouyinAuthorUrl(_0x158276);
    if (!_0x3d602e) {
      return null;
    }
    const _0x6707fa = {
      url: _0x3d602e,
      name: String(_0xbc637f.name || _0xbc637f.nickname || _0xbc637f.title || "").trim()
    };
    if (_0xbc637f && _0xbc637f.invalid) {
      _0x6707fa.invalid = true;
      if (_0xbc637f.invalidReason) {
        _0x6707fa.invalidReason = String(_0xbc637f.invalidReason);
      }
      if (_0xbc637f.invalidAt) {
        _0x6707fa.invalidAt = Number(_0xbc637f.invalidAt) || _0xbc637f.invalidAt;
      }
    }
    return _0x6707fa;
  }
  function _0x36db49(_0x23ee14 = {}) {
    return getDouyinAuthorProfileKey(_0x23ee14.url || _0x23ee14);
  }
  function _0x35a69d(_0xb0f64d, _0x45bd7f = {}) {
    const _0xadc506 = _0x36db49(_0xb0f64d);
    const _0x1e1298 = normalizeProcessedVideoKey(_0x45bd7f.url || _0x45bd7f.videoUrl || "");
    return _0xadc506 + "__" + (_0x1e1298 || _0x45bd7f.awemeId || _0x45bd7f.id || "");
  }
  function _0x444f0c(_0x918820, _0x45e0db) {
    const _0x149b83 = normalizeProcessedVideoKey(_0x45e0db);
    return (_0x918820.videoUrls || []).some(_0x262c96 => {
      const _0x186b76 = normalizeProcessedVideoKey(_0x262c96?.url || "");
      if (_0x149b83 && _0x186b76) {
        return _0x149b83 === _0x186b76;
      } else {
        return String(_0x262c96?.url || "") === String(_0x45e0db || "");
      }
    });
  }
  function _0x2200d2(_0x5d7c5, _0x4efcdf, _0x15b319) {
    if (!Array.isArray(_0x5d7c5.videoUrls)) {
      _0x5d7c5.videoUrls = [];
    }
    if (!_0x15b319?.url || _0x444f0c(_0x5d7c5, _0x15b319.url)) {
      return false;
    }
    const _0x31e2db = _0x15b319.authorName || _0x4efcdf.name || "主播";
    const _0x2178e2 = _0x15b319.title || _0x15b319.desc || _0x31e2db + "的新作品";
    _0x5d7c5.videoUrls.push({
      url: _0x15b319.url,
      title: _0x2178e2,
      author: _0x31e2db,
      source: "author_latest",
      authorUrl: _0x4efcdf.url,
      discoveredAt: Date.now()
    });
    return true;
  }
  function _0x17d99e(_0x164b0b = {}) {
    if (_0x164b0b.enableCommentImage && Array.isArray(_0x164b0b.commentImagePaths) && _0x164b0b.commentImagePaths.some(_0xfe7858 => String(_0xfe7858 || "").trim())) {
      return true;
    }
    if (_0x164b0b.enableCommentExpression) {
      return true;
    }
    if (_0x164b0b.enableCommentMention && String(_0x164b0b.commentMentionNicknames || "").trim()) {
      return true;
    }
    return false;
  }
  function _0x5a24ed(_0x4e6ba6 = "", _0x1dec56 = {}) {
    const _0x2642b6 = String(_0x4e6ba6 || "").trim();
    if (_0x2642b6) {
      return _0x2642b6.slice(0, 40);
    }
    const _0x57f290 = [];
    if (_0x1dec56.enableCommentImage) {
      _0x57f290.push("图片");
    }
    if (_0x1dec56.enableCommentExpression) {
      _0x57f290.push("表情包");
    }
    if (_0x1dec56.enableCommentMention && String(_0x1dec56.commentMentionNicknames || "").trim()) {
      _0x57f290.push("@账号");
    }
    if (_0x57f290.length) {
      return "仅" + _0x57f290.join("+");
    } else {
      return "（无正文）";
    }
  }
  async function _0x3dd087({
    taskId: _0x59fa12,
    accountId: _0x3eee1e,
    account: _0x328658,
    config: _0x125aff,
    videoItem: _0x3580c1,
    videoProgressLabel: _0x11b6b1,
    win: _0x185167,
    isRuntimeActive: _0x32f131,
    monitorTasksApi: _0x5abd31
  }) {
    if (!_0x125aff.enableVideoComment) {
      return {
        skipped: true,
        reason: "disabled"
      };
    }
    if (!_0x32f131?.()) {
      return {
        skipped: true,
        reason: "stopped"
      };
    }
    const _0x39f1ca = _0x3580c1?.url || "";
    const _0x81b371 = extractDouyinVideoId(_0x39f1ca) || _0x39f1ca;
    if (accountHasVideoMainCommented(_0x3639c8, _0x3eee1e, _0x39f1ca)) {
      _0x45fff9(_0x59fa12, _0x11b6b1 + " 视频主评：本账号已评论过此视频，跳过", "info");
      return {
        skipped: true,
        reason: "already_commented"
      };
    }
    const _0x5d6443 = hasMonitorVideoMainNonTextExtras(_0x125aff);
    const _0x584c1e = _0x125aff.enableVideoCommentWithoutText === true;
    let _0x5f5116 = "";
    if (!_0x584c1e) {
      if (_0x125aff.videoCommentMode === "ai" && _0x3efaad(_0x125aff, _0x3eee1e)) {
        try {
          _0x45fff9(_0x59fa12, _0x11b6b1 + " AI 生成视频主评文案…", "info");
          _0x5f5116 = await _0x2a69d7(_0x125aff, _0x3eee1e, _0x328658, _0x3580c1, {
            nickname: "观众",
            text: "请针对该视频发一条自然的主贴评论，不要像回复某条评论"
          }, {
            onRetry: (_0x1606e9, _0x5a2551) => {
              _0x45fff9(_0x59fa12, "AI 主评生成中（第 " + _0x1606e9 + " 次重试）" + (_0x5a2551 ? "：" + _0x5a2551 : ""), "info");
            }
          });
        } catch (_0x125e65) {
          _0x45fff9(_0x59fa12, _0x11b6b1 + " AI 主评文案失败：" + (_0x125e65?.message || _0x125e65) + "，改用固定模板", "warning");
          _0x5f5116 = _0x4bf7c2(_0x125aff.videoCommentContent);
        }
      } else {
        _0x5f5116 = _0x4bf7c2(_0x125aff.videoCommentContent);
        if (_0x5f5116 && _0x125aff.videoCommentUseRandomSuffix) {
          _0x5f5116 = appendRandomEmojiSuffix(_0x5f5116);
        }
      }
    }
    if (!String(_0x5f5116 || "").trim() && !_0x5d6443 && !_0x584c1e) {
      _0x45fff9(_0x59fa12, _0x11b6b1 + " 视频主评：未配置文案或附带内容，已跳过", "warning");
      return {
        skipped: true,
        reason: "empty"
      };
    }
    const _0x2966e4 = formatMonitorVideoMainCommentLogLabel(_0x5f5116, _0x125aff);
    const _0x718298 = await _0x3c452f({
      taskId: _0x59fa12,
      config: _0x125aff,
      isRuntimeActive: _0x32f131,
      logPrefix: _0x11b6b1
    });
    if (!_0x718298) {
      return {
        skipped: true,
        reason: "stopped"
      };
    }
    _0x45fff9(_0x59fa12, _0x11b6b1 + " 正在发表视频主评…", "info");
    const _0x29c60e = await _0x1509eb(_0x185167.webContents, {
      requestId: _0x59fa12 + "_mainc_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      ...buildMonitorVideoMainCommentExtras(_0x125aff, {
        taskId: _0x59fa12,
        accountId: _0x3eee1e,
        commentText: _0x5f5116,
        videoTitle: _0x3580c1?.title || "",
        videoKey: _0x39f1ca || _0x81b371,
        videoMainCommentedVideoIds: listAccountVideoMainCommentedIds(_0x3639c8, _0x3eee1e)
      })
    }, 120000);
    if (_0x29c60e?.success) {
      _0x45fff9(_0x59fa12, _0x11b6b1 + " 已发表视频主评：" + _0x2966e4, "success");
      _0x3999c5({
        taskId: _0x59fa12,
        accountId: _0x3eee1e,
        account: _0x328658,
        videoItem: _0x3580c1,
        videoId: _0x81b371,
        content: _0x29c60e.content || _0x5f5116,
        status: "success",
        monitorTasksApi: _0x5abd31
      });
      return {
        success: true,
        content: _0x29c60e.content || _0x5f5116
      };
    }
    if (_0x29c60e?.skipped && _0x29c60e?.reason === "already_commented") {
      _0x45fff9(_0x59fa12, _0x11b6b1 + " 视频主评：本账号已评论过此视频，跳过", "info");
      return {
        skipped: true,
        reason: "already_commented"
      };
    }
    _0x45fff9(_0x59fa12, _0x11b6b1 + " 视频主评失败：" + (_0x29c60e?.error || "未完成"), "warning");
    _0x3999c5({
      taskId: _0x59fa12,
      accountId: _0x3eee1e,
      account: _0x328658,
      videoItem: _0x3580c1,
      videoId: _0x81b371,
      content: _0x5f5116,
      status: "failed",
      error: _0x29c60e?.error || "video_main_comment_failed",
      monitorTasksApi: _0x5abd31
    });
    return {
      success: false,
      error: _0x29c60e?.error || "video_main_comment_failed"
    };
  }
  function _0x3999c5({
    taskId: _0x4a76eb,
    accountId: _0x5f3079,
    account: _0x561b83,
    videoItem: _0x19d113,
    videoId: _0x12233e,
    content: _0x576465,
    status: _0x15972e,
    error = "",
    monitorTasksApi: _0x36f51f
  }) {
    if (!_0x4a76eb || !_0x36f51f?.appendVideoCommentRecords) {
      return;
    }
    try {
      _0x36f51f.appendVideoCommentRecords(_0x4a76eb, [{
        ts: Date.now(),
        accountId: _0x5f3079 || "",
        accountName: _0x561b83?.nickname || _0x561b83?.name || "",
        videoUrl: _0x19d113?.url || "",
        videoTitle: _0x19d113?.title || "",
        videoId: _0x12233e || extractDouyinVideoId(_0x19d113?.url || "") || "",
        content: _0x576465 || "",
        status: _0x15972e,
        error: error
      }]);
      _0x5eacfc(_0x4a76eb, {
        type: "video-comments-update",
        ts: Date.now()
      });
    } catch (_0x53dc53) {
      _0x45fff9(_0x4a76eb, "视频主评记录落盘失败：" + (_0x53dc53?.message || _0x53dc53), "warning");
    }
  }
  async function _0x43deb8(_0xbc98e2, _0x2eb1c8, _0x562812, _0x22847a, _0x19fe84, _0x2802b1, _0x16e7b8) {
    const _0x1cbb4e = _0x3efaad(_0x562812, _0x2eb1c8);
    const _0x516cb1 = _0x425bf9 => (_0x535760, _0x190525) => {
      _0x45fff9(_0xbc98e2, "AI " + _0x425bf9 + "生成中（第 " + _0x535760 + " 次重试）" + (_0x190525 ? "：" + _0x190525 : ""), "info");
    };
    let _0x286e76 = (_0x16e7b8.replyContent || "").trim();
    let _0x276b7c = "";
    const _0x43b5a5 = _0x562812.enableAutoReply === true;
    const _0x5a9ae8 = _0x562812.enableAutoFollow === true;
    const _0x92f3e8 = _0x562812.enableAutoLike === true;
    const _0x214c0b = _0x562812.enableAutoDM === true;
    const _0x1195d1 = _0x43b5a5 && _0x488f92(_0xbc98e2, "reply", _0x2eb1c8);
    const _0x124f4a = _0x5a9ae8 && _0x488f92(_0xbc98e2, "follow", _0x2eb1c8);
    const _0x12e65d = _0x92f3e8 && _0x488f92(_0xbc98e2, "like", _0x2eb1c8);
    const _0x18b5b5 = _0x214c0b && _0x488f92(_0xbc98e2, "dm", _0x2eb1c8);
    const _0x188d02 = _0x17d99e(_0x562812);
    const _0xead191 = _0x562812.enableCommentWithoutText === true;
    if (_0x1195d1) {
      if (_0xead191) {
        _0x286e76 = "";
      } else if (_0x562812.replyMode === "ai" && _0x1cbb4e) {
        if (!_0x286e76) {
          _0x45fff9(_0xbc98e2, "AI 生成回复文案 @" + (_0x19fe84.nickname || "用户") + "…", "info");
          _0x286e76 = await _0x2a69d7(_0x562812, _0x2eb1c8, _0x2802b1, _0x22847a, _0x19fe84, {
            forDm: false,
            onRetry: _0x516cb1("回复")
          });
        }
      } else {
        _0x286e76 = _0x4bf7c2(_0x562812.replyTemplate);
        if (_0x286e76 && _0x562812.commentUseRandomSuffix) {
          _0x286e76 = appendRandomEmojiSuffix(_0x286e76);
        }
      }
    }
    if (_0x18b5b5) {
      if (_0x562812.dmMode === "ai" && _0x1cbb4e) {
        _0x45fff9(_0xbc98e2, "AI 生成私信文案 @" + (_0x19fe84.nickname || "用户") + "…", "info");
        _0x276b7c = await _0x2a69d7(_0x562812, _0x2eb1c8, _0x2802b1, _0x22847a, _0x19fe84, {
          forDm: true,
          onRetry: _0x516cb1("私信")
        });
      } else {
        _0x276b7c = _0x4bf7c2(_0x562812.dmTemplate) || _0x286e76;
      }
    }
    const _0x54a08c = !!String(_0x286e76 || "").trim();
    const _0xd50cda = !_0x54a08c && (_0xead191 || _0x188d02) && _0x188d02;
    return {
      ..._0x16e7b8,
      replyContent: _0x286e76,
      dmContent: _0x276b7c,
      shouldFollow: _0x5a9ae8,
      shouldLike: _0x92f3e8,
      shouldReply: _0x43b5a5 && (_0x54a08c || _0xd50cda),
      shouldDM: _0x214c0b && !!_0x276b7c.trim(),
      allowEmptyReplyText: _0xd50cda
    };
  }
  async function _0x150a82(_0x106a86, _0x53ca30, _0x45e2d5, _0x34441d, _0x2e954d, _0x10991e) {
    return _0x4c5487(_0x45e2d5, _0x53ca30, _0x2e954d, _0x34441d, _0x10991e, {
      onLog: _0x415bcc => _0x45fff9(_0x106a86, _0x415bcc, "info"),
      onRetry: (_0x2ff6f7, _0xaf7f54) => {
        _0x45fff9(_0x106a86, "AI 批量研判重试（第 " + _0x2ff6f7 + " 次）" + (_0xaf7f54 ? "：" + _0xaf7f54 : ""), "warning");
      }
    });
  }
  async function _0x49f63f(_0xbfe3, _0x1e2d55) {
    const _0x98ca21 = Array.isArray(_0x1e2d55?.videoUrls) ? _0x1e2d55.videoUrls : [];
    const _0x277840 = _0x98ca21.map(_0x5c697f => String(_0x5c697f?.url || "").trim());
    const _0x1a073d = [];
    const _0x5423e1 = [];
    _0x277840.forEach((_0x5d2c1b, _0x2e7c48) => {
      if (!_0x5d2c1b) {
        return;
      }
      if (toCanonicalDouyinVideoUrl(_0x5d2c1b)) {
        return;
      }
      if (/v\.douyin\.com/i.test(_0x5d2c1b) || /iesdouyin\.com\/share/i.test(_0x5d2c1b)) {
        _0x1a073d.push(_0x2e7c48);
        _0x5423e1.push(_0x5d2c1b);
      }
    });
    let _0x4e0b5a = _0x5423e1;
    if (_0x5423e1.length > 0) {
      try {
        _0x4e0b5a = await resolveDouyinShareUrls(_0x5423e1);
      } catch (_0x319782) {
        _0x4e0b5a = _0x5423e1;
      }
    }
    const _0x4153d9 = new Map();
    _0x1a073d.forEach((_0x4dedc2, _0x34abc7) => {
      _0x4153d9.set(_0x4dedc2, String(_0x4e0b5a[_0x34abc7] || _0x277840[_0x4dedc2]).trim() || _0x277840[_0x4dedc2]);
    });
    const _0x8de78a = [];
    const _0x21f18c = new Set();
    for (let _0x3a834c = 0; _0x3a834c < _0x98ca21.length; _0x3a834c += 1) {
      const _0x3cab81 = _0x98ca21[_0x3a834c];
      const _0x42ce03 = _0x277840[_0x3a834c];
      if (!_0x42ce03) {
        continue;
      }
      const _0x264392 = _0x4153d9.get(_0x3a834c) || _0x42ce03;
      const _0x40bad0 = toCanonicalDouyinVideoUrl(_0x264392) || _0x264392;
      const _0x1593bb = extractDouyinVideoId(_0x40bad0);
      if (_0x1593bb && _0x21f18c.has(_0x1593bb)) {
        continue;
      }
      if (_0x1593bb) {
        _0x21f18c.add(_0x1593bb);
      }
      if (_0x40bad0 !== _0x42ce03) {
        _0x45fff9(_0xbfe3, "视频链接已解析：" + _0x42ce03 + " → " + _0x40bad0, "info");
      }
      _0x8de78a.push({
        ..._0x3cab81,
        url: _0x40bad0
      });
    }
    _0x1e2d55.videoUrls = _0x8de78a;
  }
  function _0x48f6c2(_0x3bfd3e, _0x1f7409 = "") {
    const _0x5c7a0c = String(_0x1f7409 || "").trim().toLowerCase();
    if (!_0x5c7a0c) {
      return false;
    }
    if (/timeout|未就绪|soft/.test(_0x5c7a0c)) {
      return false;
    }
    if (/bare_jingxuan/.test(_0x5c7a0c)) {
      return false;
    }
    const _0x259ac1 = String(_0x3bfd3e?.source || "").trim();
    if (_0x259ac1 === "author_latest") {
      return false;
    }
    if (_0x3bfd3e?.authorUrl) {
      return false;
    }
    return /unavailable/.test(_0x5c7a0c);
  }
  function _0x4c6e0f(_0x477606, _0x5a55ae, _0x3f75d2, _0x404fee = "user_not_found") {
    if (!_0x5a55ae || !_0x3f75d2?.url) {
      return false;
    }
    if (!Array.isArray(_0x5a55ae.authorUrls)) {
      _0x5a55ae.authorUrls = [];
    }
    const _0x28d190 = String(_0x404fee || "user_not_found").trim() || "user_not_found";
    const _0x5cf6e = _0x36db49(_0x3f75d2);
    let _0x78efdc = false;
    _0x5a55ae.authorUrls = _0x5a55ae.authorUrls.map(_0x1f4dcc => {
      const _0xaa370f = _0x36db49(_0x1f4dcc);
      const _0x1e5018 = _0x5cf6e && _0xaa370f && _0x5cf6e === _0xaa370f || String(_0x1f4dcc?.url || "").trim() === String(_0x3f75d2.url || "").trim();
      if (!_0x1e5018) {
        return _0x1f4dcc;
      }
      if (_0x1f4dcc.invalid && String(_0x1f4dcc.invalidReason || "") === _0x28d190) {
        return _0x1f4dcc;
      }
      _0x78efdc = true;
      return {
        ..._0x1f4dcc,
        invalid: true,
        invalidReason: _0x28d190,
        invalidAt: Date.now()
      };
    });
    if (!_0x78efdc) {
      const _0x3e0ec1 = _0x339424({
        ..._0x3f75d2,
        invalid: true,
        invalidReason: _0x28d190,
        invalidAt: Date.now()
      });
      if (_0x3e0ec1 && !_0x5a55ae.authorUrls.some(_0x478b78 => _0x36db49(_0x478b78) === _0x36db49(_0x3e0ec1))) {
        _0x5a55ae.authorUrls.push(_0x3e0ec1);
        _0x78efdc = true;
      }
    }
    if (!_0x78efdc) {
      return false;
    }
    try {
      const _0x3b287b = _0x21e6e0.get(_0x477606)?.monitorTasksApi;
      _0x3b287b?.patchTask?.(_0x477606, {
        configSnapshot: {
          ..._0x5a55ae
        }
      });
      _0x5eacfc(_0x477606, {
        type: "config-update",
        ts: Date.now()
      });
    } catch (_0x568990) {}
    const _0x75289a = String(_0x3f75d2.name || "").trim() || "主播主页";
    _0x45fff9(_0x477606, "已标记主页失效（后续轮询跳过）：「" + _0x75289a + "」 " + _0x3f75d2.url + " — " + formatMonitorInvalidReason(_0x28d190), "warning");
    return true;
  }
  async function _0x28f3c8(_0x35fab7, {
    timeoutMs = 10000,
    isActive = () => true
  } = {}) {
    if (!_0x35fab7?.webContents || _0x35fab7.isDestroyed?.() || _0x35fab7.webContents.isDestroyed?.()) {
      return {
        gone: false,
        reason: "no_window"
      };
    }
    const _0x39e548 = Date.now() + Math.max(3000, Number(timeoutMs) || 10000);
    let _0xe996dd = 0;
    let _0xa91caf = 0;
    while (Date.now() < _0x39e548 && isActive()) {
      let _0x50bcbb = {
        gone: false,
        reason: "unknown"
      };
      try {
        _0x50bcbb = await _0xb20a91(_0x35fab7.webContents, "\n          (() => {\n            try {\n              const href = String(location.href || '');\n              if (!href.includes('/user/')) return { gone: false, reason: 'not_profile' };\n              const body = document.body;\n              if (!body) return { gone: false, reason: 'no_body' };\n              const errEl = document.querySelector('[data-e2e=\"error-page\"], .Ms08YIEh');\n              const text = String(body.innerText || body.textContent || '');\n              const hasProfileFrame = /抖音号|获赞|粉丝|关注|作品|喜欢/.test(text);\n              const goneText = /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(text);\n              if (errEl || (!hasProfileFrame && goneText)) {\n                return { gone: true, reason: 'user_not_found' };\n              }\n              if (hasProfileFrame) return { gone: false, reason: 'ok' };\n              return { gone: false, reason: 'unknown' };\n            } catch (_) {\n              return { gone: false, reason: 'probe_error' };\n            }\n          })()\n        ");
      } catch (_0x39006f) {
        _0x50bcbb = {
          gone: false,
          reason: "probe_failed"
        };
      }
      if (_0x50bcbb?.gone) {
        _0xe996dd += 1;
        _0xa91caf = 0;
        if (_0xe996dd >= 3) {
          return {
            gone: true,
            reason: _0x50bcbb.reason || "user_not_found"
          };
        }
      } else if (_0x50bcbb?.reason === "ok") {
        _0xa91caf += 1;
        _0xe996dd = 0;
        if (_0xa91caf >= 2) {
          return {
            gone: false,
            reason: "ok"
          };
        }
      } else {
        _0xe996dd = 0;
      }
      await new Promise(_0x1e0451 => setTimeout(_0x1e0451, 400));
    }
    return {
      gone: false,
      reason: "timeout"
    };
  }
  function _0x59bba9(_0x4223d5, _0x411fa2, _0x10bd42, _0x4b6620 = "unavailable") {
    if (!_0x411fa2 || !_0x10bd42?.url) {
      return false;
    }
    if (!_0x48f6c2(_0x10bd42, _0x4b6620)) {
      return false;
    }
    if (!Array.isArray(_0x411fa2.videoUrls)) {
      _0x411fa2.videoUrls = [];
    }
    const _0x457a67 = String(_0x4b6620 || "unavailable").trim() || "unavailable";
    let _0x2de813 = false;
    _0x411fa2.videoUrls = _0x411fa2.videoUrls.map(_0x45aaa7 => {
      if (!monitorVideoItemsMatch(_0x45aaa7, _0x10bd42)) {
        return _0x45aaa7;
      }
      if (_0x45aaa7.invalid && String(_0x45aaa7.invalidReason || "") === _0x457a67) {
        return _0x45aaa7;
      }
      _0x2de813 = true;
      return {
        ..._0x45aaa7,
        invalid: true,
        invalidReason: _0x457a67,
        invalidAt: Date.now()
      };
    });
    if (!_0x2de813) {
      if (!_0x411fa2.videoUrls.some(_0x249f14 => monitorVideoItemsMatch(_0x249f14, _0x10bd42))) {
        _0x411fa2.videoUrls.push({
          url: String(_0x10bd42.url || "").trim(),
          title: String(_0x10bd42.title || "").trim() || "手动添加",
          source: _0x10bd42.source || undefined,
          invalid: true,
          invalidReason: _0x457a67,
          invalidAt: Date.now()
        });
        _0x2de813 = true;
      }
    }
    if (!_0x2de813) {
      return false;
    }
    try {
      const _0x35cc06 = _0x21e6e0.get(_0x4223d5)?.monitorTasksApi;
      _0x35cc06?.patchTask?.(_0x4223d5, {
        configSnapshot: {
          ..._0x411fa2
        }
      });
      _0x5eacfc(_0x4223d5, {
        type: "config-update",
        ts: Date.now()
      });
    } catch (_0x26b43e) {}
    const _0x50489c = String(_0x10bd42.title || "").trim() || "视频";
    const _0x578ddb = formatMonitorInvalidReason(_0x457a67);
    _0x45fff9(_0x4223d5, "已标记失效（后续轮询跳过）：「" + _0x50489c + "」 " + _0x10bd42.url + " — " + _0x578ddb, "warning");
    return true;
  }
  async function _0x31700b(_0x248ada, _0x1d2e3f) {
    const _0x554929 = Array.isArray(_0x1d2e3f?.authorUrls) ? _0x1d2e3f.authorUrls : [];
    const _0x568dd7 = [];
    const _0x248253 = _0x554929.map(_0x2a6840 => {
      const _0x84cf2d = String(_0x2a6840?.url || _0x2a6840 || "").trim();
      if (!_0x84cf2d) {
        return {
          item: _0x2a6840,
          raw: "",
          resolved: ""
        };
      }
      if (isDouyinAuthorProfileUrl(_0x84cf2d)) {
        return {
          item: _0x2a6840,
          raw: _0x84cf2d,
          resolved: normalizeDouyinAuthorUrl(_0x84cf2d)
        };
      }
      if (/v\.douyin\.com/i.test(_0x84cf2d) || /iesdouyin\.com\/share/i.test(_0x84cf2d)) {
        _0x568dd7.push(_0x84cf2d);
        return {
          item: _0x2a6840,
          raw: _0x84cf2d,
          resolved: ""
        };
      }
      return {
        item: _0x2a6840,
        raw: _0x84cf2d,
        resolved: ""
      };
    });
    let _0x412212 = new Map();
    if (_0x568dd7.length > 0) {
      try {
        const _0x18ab44 = [...new Set(_0x568dd7)];
        const _0x20cbf6 = await resolveDouyinShareUrls(_0x18ab44);
        _0x18ab44.forEach((_0x4e08af, _0x3c4c3e) => {
          _0x412212.set(_0x4e08af, String(_0x20cbf6[_0x3c4c3e] || _0x4e08af).trim() || _0x4e08af);
        });
      } catch (_0x480fc5) {
        _0x412212 = new Map();
      }
    }
    const _0x43d6d3 = [];
    for (const _0x68cae3 of _0x248253) {
      if (!_0x68cae3.raw) {
        continue;
      }
      const _0x5a284d = _0x68cae3.resolved || _0x412212.get(_0x68cae3.raw) || _0x68cae3.raw;
      const _0x47e712 = _0x339424({
        ..._0x68cae3.item,
        url: _0x5a284d
      });
      if (!_0x47e712) {
        continue;
      }
      if (!_0x43d6d3.some(_0x13a6eb => _0x36db49(_0x13a6eb) === _0x36db49(_0x47e712))) {
        _0x43d6d3.push(_0x47e712);
        if (_0x47e712.url !== _0x68cae3.raw) {
          _0x45fff9(_0x248ada, "主播链接已规范化：" + _0x68cae3.raw + " → " + _0x47e712.url, "info");
        }
      }
    }
    _0x1d2e3f.authorUrls = _0x43d6d3;
  }
  async function _0x52d8aa({
    taskId: _0x4cb33f,
    accountId: _0x30a438,
    account: _0x1bc5b0,
    authorItem: _0x56a525,
    config: _0x22c774,
    isRuntimeActive = () => _0x21e6e0.has(_0x4cb33f),
    win: _0x1ab0d5 = null
  }) {
    const _0x2b91c2 = Math.max(1, Math.min(Number(_0x22c774.maxAuthorWorksPerCheck) || 6, 20));
    const _0x5e206e = _0x22c774.filterPinnedAuthorWorks === true;
    let _0x57f7e2 = _0x1ab0d5 || (await _0x36b772(_0x30a438, _0x1bc5b0.proxy, _0x4cb33f));
    if (!_0x57f7e2.__radarMonitorAuthorPostCapture) {
      _0x57f7e2.__radarMonitorAuthorPostCapture = createMonitorAuthorPostCapture(_0x57f7e2);
    }
    _0x45fff9(_0x4cb33f, "正在打开主播主页：" + (_0x56a525.name || _0x56a525.url) + "（将处理最新 " + _0x2b91c2 + " 条作品" + (_0x5e206e ? "，已过滤置顶" : "") + "）", "info", {
      accountId: _0x30a438
    });
    try {
      await _0x57f7e2.__radarMonitorAuthorPostCapture.begin({
        maxWorks: _0x2b91c2,
        authorName: _0x56a525.name || "",
        secUid: _0x36db49(_0x56a525) || "",
        filterPinned: _0x5e206e
      });
    } catch (_0x463a77) {}
    try {
      let _0x879dd1 = {
        works: [],
        hasPostListPayload: false,
        authorName: "",
        worksCount: null
      };
      const _0x4e4a35 = _0xfc3a53(_0x57f7e2, _0x56a525.url).then(() => ({
        kind: "loaded",
        ok: true
      })).catch(_0x223278 => ({
        kind: "loaded",
        ok: false,
        error: _0x223278
      }));
      const _0x4b16b9 = _0x57f7e2.__radarMonitorAuthorPostCapture.waitForWorks({
        timeoutMs: 7000,
        isActive: isRuntimeActive
      }).then(_0x5d00c1 => ({
        kind: "capture",
        snapshot: _0x5d00c1
      })).catch(() => ({
        kind: "capture",
        snapshot: null
      }));
      const _0x1e7f14 = await Promise.race([_0x4e4a35, _0x4b16b9]);
      const _0x5ea16c = _0x1e7f14?.kind === "capture" ? _0x1e7f14.snapshot : null;
      const _0x395f7d = !!_0x5ea16c?.hasPostListPayload || !!Array.isArray(_0x5ea16c?.works) && !!(_0x5ea16c.works.length > 0);
      if (_0x395f7d) {
        _0x879dd1 = _0x5ea16c;
      } else {
        const _0x552900 = _0x1e7f14?.kind === "loaded" ? _0x1e7f14 : await _0x4e4a35;
        if (!_0x552900?.ok) {
          throw _0x552900?.error || new Error("主播主页加载失败");
        }
      }
      if (!isRuntimeActive()) {
        return {
          win: _0x57f7e2,
          works: [],
          authorLabel: _0x56a525.name || _0x56a525.url,
          maxWorks: _0x2b91c2,
          error: "stopped"
        };
      }
      if (!_0x395f7d) {
        const _0x1d236e = await _0x28f3c8(_0x57f7e2, {
          timeoutMs: 10000,
          isActive: isRuntimeActive
        });
        if (!isRuntimeActive()) {
          return {
            win: _0x57f7e2,
            works: [],
            authorLabel: _0x56a525.name || _0x56a525.url,
            maxWorks: _0x2b91c2,
            error: "stopped"
          };
        }
        if (_0x1d236e.gone) {
          const _0x1d428d = _0x1d236e.reason || "user_not_found";
          _0x45fff9(_0x4cb33f, "主播主页已失效：" + (_0x56a525.name || _0x56a525.url) + "（" + formatMonitorInvalidReason(_0x1d428d) + "）", "warning", {
            accountId: _0x30a438
          });
          try {
            _0x4c6e0f(_0x4cb33f, _0x22c774, _0x56a525, _0x1d428d);
          } catch (_0x2bffb7) {}
          return {
            win: _0x57f7e2,
            works: [],
            authorLabel: _0x56a525.name || _0x56a525.url,
            maxWorks: _0x2b91c2,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
        try {
          _0x879dd1 = (await _0x57f7e2.__radarMonitorAuthorPostCapture.waitForWorks({
            timeoutMs: 10000,
            isActive: isRuntimeActive
          })) || _0x879dd1;
        } catch (_0x581b0b) {}
      }
      if (!isRuntimeActive()) {
        return {
          win: _0x57f7e2,
          works: [],
          authorLabel: _0x56a525.name || _0x56a525.url,
          maxWorks: _0x2b91c2,
          error: "stopped"
        };
      }
      if (!_0x879dd1.hasPostListPayload && (!Array.isArray(_0x879dd1.works) || _0x879dd1.works.length === 0)) {
        const _0x250993 = await _0x28f3c8(_0x57f7e2, {
          timeoutMs: 4000,
          isActive: isRuntimeActive
        });
        if (_0x250993.gone) {
          const _0x562c76 = _0x250993.reason || "user_not_found";
          _0x45fff9(_0x4cb33f, "主播主页已失效：" + (_0x56a525.name || _0x56a525.url) + "（" + formatMonitorInvalidReason(_0x562c76) + "）", "warning", {
            accountId: _0x30a438
          });
          try {
            _0x4c6e0f(_0x4cb33f, _0x22c774, _0x56a525, _0x562c76);
          } catch (_0x15d5d6) {}
          return {
            win: _0x57f7e2,
            works: [],
            authorLabel: _0x56a525.name || _0x56a525.url,
            maxWorks: _0x2b91c2,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
      }
      const _0xa5529d = _0x879dd1.hasPostListPayload || Array.isArray(_0x879dd1.works) && _0x879dd1.works.length > 0;
      if (_0xa5529d) {
        if (_0x879dd1.authorName && !_0x56a525.name) {
          _0x56a525.name = _0x879dd1.authorName;
        }
        const _0xe1debb = _0x879dd1.authorName || _0x56a525.name || _0x56a525.url;
        const _0x559dbd = (_0x879dd1.works || []).filter(_0x4665a7 => _0x4665a7?.url).slice(0, _0x2b91c2);
        _0x45fff9(_0x4cb33f, _0x559dbd.length > 0 ? "已获取主播最新 " + _0x559dbd.length + " 条作品：" + _0xe1debb : "主播主页暂无作品：" + _0xe1debb, "info", {
          accountId: _0x30a438
        });
        return {
          win: _0x57f7e2,
          works: _0x559dbd,
          authorLabel: _0xe1debb,
          maxWorks: _0x2b91c2,
          authorName: _0x879dd1.authorName || _0x56a525.name || "",
          source: "author_post_api"
        };
      }
      const _0x2134ae = await _0xef8ac4(_0x57f7e2.webContents, {
        requestId: _0x4cb33f + "_author_" + Date.now() + "_" + Math.random().toString(36).slice(2),
        maxWorks: _0x2b91c2,
        authorUrl: _0x56a525.url,
        filterPinned: _0x5e206e
      }, 45000);
      if (!_0x2134ae?.success || !Array.isArray(_0x2134ae.works)) {
        const _0x1e362b = String(_0x2134ae?.errorCode || _0x2134ae?.reason || "").trim();
        const _0x268e74 = _0x2134ae?.error || "未获取到作品列表";
        const _0x16239d = _0x1e362b === "USER_NOT_FOUND" || _0x1e362b === "user_not_found" || /用户不存在|无此用户|主页链接失效/i.test(_0x268e74);
        if (_0x16239d) {
          _0x45fff9(_0x4cb33f, "主播主页已失效：" + (_0x56a525.name || _0x56a525.url) + "（" + formatMonitorInvalidReason(_0x1e362b || _0x268e74) + "）", "warning", {
            accountId: _0x30a438
          });
          try {
            _0x4c6e0f(_0x4cb33f, _0x22c774, _0x56a525, "user_not_found");
          } catch (_0x26b3c7) {}
          return {
            win: _0x57f7e2,
            works: [],
            authorLabel: _0x56a525.name || _0x56a525.url,
            maxWorks: _0x2b91c2,
            error: "user_not_found",
            errorCode: "USER_NOT_FOUND",
            authorGone: true
          };
        }
        _0x45fff9(_0x4cb33f, "主播主页检查失败：" + (_0x56a525.name || _0x56a525.url) + "（" + _0x268e74 + "）", "warning", {
          accountId: _0x30a438
        });
        return {
          win: _0x57f7e2,
          works: [],
          authorLabel: _0x56a525.name || _0x56a525.url,
          maxWorks: _0x2b91c2,
          error: _0x268e74
        };
      }
      if (_0x2134ae.authorName && !_0x56a525.name) {
        _0x56a525.name = _0x2134ae.authorName;
      }
      const _0x27d0a6 = _0x2134ae.authorName || _0x56a525.name || _0x56a525.url;
      const _0x7be862 = _0x2134ae.works.filter(_0x20540d => _0x20540d?.url).slice(0, _0x2b91c2);
      return {
        win: _0x57f7e2,
        works: _0x7be862,
        authorLabel: _0x27d0a6,
        maxWorks: _0x2b91c2,
        authorName: _0x2134ae.authorName || _0x56a525.name || "",
        source: "author_post_dom"
      };
    } finally {
      try {
        _0x57f7e2.__radarMonitorAuthorPostCapture?.detachIfOwned?.();
      } catch (_0x38d1fb) {}
    }
  }
  async function _0x5cfe68({
    taskId: _0x323ff9,
    accountId: _0x657df6,
    account: _0x37d0bd,
    authorItem: _0x1eba49,
    authorIndex: _0x1c5512,
    authorTotal: _0x1282f2,
    config: _0x877386,
    accounts: _0x327dbe,
    monitorTasksApi: _0x36b52a,
    isRuntimeActive: _0x52c57c,
    seenKeys: _0x5a3c9b,
    updatedSeenKeys: _0x199a8b,
    seenKeySet: _0x3b02eb,
    counters: _0x3edaa6,
    monitorTaskName: _0x51e765,
    win: _0x191d8c,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    let _0x50c293 = _0x191d8c;
    if (!_0x52c57c() || !_0x1eba49?.url) {
      return {
        win: _0x50c293,
        processedVideos: 0,
        discovered: 0
      };
    }
    const _0x128ed4 = _0x36db49(_0x1eba49);
    const _0x2ab85f = !_0x44d765(_0x323ff9, _0x128ed4);
    const _0x547aca = "[主播 " + (_0x1c5512 + 1) + "/" + _0x1282f2 + "]";
    let _0x542a20 = 0;
    let _0x59f18b = 0;
    try {
      const _0x1bab2f = await _0x52d8aa({
        taskId: _0x323ff9,
        accountId: _0x657df6,
        account: _0x37d0bd,
        authorItem: _0x1eba49,
        config: _0x877386,
        isRuntimeActive: _0x52c57c,
        win: _0x50c293
      });
      _0x50c293 = _0x1bab2f.win;
      if (!_0x52c57c()) {
        return {
          win: _0x50c293,
          processedVideos: _0x59f18b,
          discovered: _0x542a20
        };
      }
      if (_0x1bab2f.error && (!_0x1bab2f.works || _0x1bab2f.works.length === 0)) {
        return {
          win: _0x50c293,
          processedVideos: _0x59f18b,
          discovered: _0x542a20
        };
      }
      const {
        works: _0x13192f,
        authorLabel: _0x19acdf,
        maxWorks: _0x1f815b,
        authorName: _0x20dccf
      } = _0x1bab2f;
      const _0x36b540 = _0x877386.filterPinnedAuthorWorks === true;
      const _0x2fd7f7 = _0x30c9e6(_0x323ff9);
      const _0x3ab811 = [..._0x2fd7f7];
      const _0x55e334 = [];
      _0x13192f.forEach(_0x2d51e4 => {
        const _0xb9ada2 = _0x35a69d(_0x1eba49, _0x2d51e4);
        if (!_0xb9ada2) {
          return;
        }
        const _0x4d21cd = _0x2fd7f7.includes(_0xb9ada2) || _0x3ab811.includes(_0xb9ada2);
        if (!_0x3ab811.includes(_0xb9ada2)) {
          _0x3ab811.push(_0xb9ada2);
        }
        if (!_0x2ab85f && !_0x4d21cd) {
          _0x55e334.push(_0x2d51e4);
          _0x542a20 += 1;
        }
      });
      _0x3e8e04(_0x323ff9, _0x3ab811);
      if (_0x2ab85f) {
        _0x4cce46(_0x323ff9, _0x128ed4);
        _0x45fff9(_0x323ff9, _0x547aca + " " + _0x19acdf + " 首次检查：最新 " + _0x13192f.length + " 条作品将建立评论基线（首跑不自动回复）", _0x13192f.length > 0 ? "success" : "warning", {
          accountId: _0x657df6
        });
      } else if (_0x55e334.length > 0) {
        _0x55e334.forEach(_0x5e7b6b => {
          _0x45fff9(_0x323ff9, _0x547aca + " 发现新作品：" + (_0x5e7b6b.title || _0x5e7b6b.url), "success", {
            accountId: _0x657df6
          });
        });
      } else {
        _0x45fff9(_0x323ff9, _0x547aca + " " + _0x19acdf + " 暂无新作品，继续处理最新 " + _0x13192f.length + " 条评论", "info", {
          accountId: _0x657df6
        });
      }
      if (_0x542a20 > 0) {
        try {
          _0x36b52a?.incrementStats?.(_0x323ff9, {
            newWorks: _0x542a20
          });
        } catch (_0xc33926) {}
        _0xdd9c41(_0x323ff9, {
          newWorks: _0x542a20
        }, {
          emit: true
        });
      }
      const _0x151af7 = Math.max(0, Math.min(_0x1f815b, _0x13192f.length || 0));
      if (_0x151af7 < _0x1f815b) {
        _0x45fff9(_0x323ff9, _0x547aca + " " + _0x19acdf + " 主页实际 " + _0x151af7 + " 条作品（配置每次 " + _0x1f815b + " 条），只处理这些，不链切进推荐流", "info", {
          accountId: _0x657df6
        });
      }
      if (_0x151af7 === 0) {
        return {
          win: _0x50c293,
          processedVideos: _0x59f18b,
          discovered: _0x542a20
        };
      }
      let _0x1a5474 = false;
      const _0x5b9fd7 = resolveMonitorExpectedAuthor({
        source: "author_latest",
        authorUrl: _0x1eba49.url
      });
      for (let _0x417790 = 0; _0x417790 < _0x151af7; _0x417790 += 1) {
        if (!_0x52c57c()) {
          break;
        }
        const _0x40d43f = _0x151af7;
        let _0x272098 = {
          url: "",
          title: (_0x20dccf || _0x1eba49.name || "主播") + "的作品",
          author: _0x20dccf || _0x1eba49.name || "主播",
          source: "author_latest",
          authorUrl: _0x1eba49.url,
          discoveredAt: Date.now()
        };
        if (_0x417790 === 0) {
          _0x45fff9(_0x323ff9, _0x36b540 ? _0x547aca + " 从主页点击首个非置顶作品…" : _0x547aca + " 从主页点击第 1 条作品…", "info", {
            accountId: _0x657df6
          });
          try {
            _0x1b311a(_0x50c293);
          } catch (_0x1bbc33) {}
          const _0x38f7d5 = await _0x14dbf9.openAuthorWork(_0x50c293.webContents, {
            taskId: _0x323ff9,
            authorUrl: _0x1eba49.url,
            preferFirstCard: true,
            skipPinnedCards: _0x36b540,
            knownHasWorks: true,
            allowUrlFallback: false,
            timeoutMs: 50000
          });
          if (!_0x38f7d5?.ok) {
            _0x45fff9(_0x323ff9, _0x547aca + " 未能从主页点开作品（" + (_0x38f7d5?.reason || _0x38f7d5?.error || "unknown") + (_0x38f7d5?.debug ? "｜" + _0x38f7d5.debug : "") + "），停止本博主（不改用链接/推荐流）", "warning", {
              accountId: _0x657df6
            });
            break;
          }
          if (_0x38f7d5.videoUrl) {
            _0x272098.url = _0x38f7d5.videoUrl;
          }
          _0x1a5474 = _0x38f7d5.reason !== "opened_via_jingxuan_modal_id";
        } else if (_0x1a5474 && _0x14dbf9.canContinueAuthorFeed(_0x50c293)) {
          _0x45fff9(_0x323ff9, _0x547aca + " 点击下一条 [" + (_0x417790 + 1) + "/" + _0x40d43f + "]…", "info", {
            accountId: _0x657df6
          });
          const _0x38d006 = await _0x14dbf9.moveNextAuthorWork(_0x50c293.webContents, {
            taskId: _0x323ff9,
            requireMatch: false
          });
          if (!_0x38d006?.ok || !_0x38d006.switched) {
            _0x45fff9(_0x323ff9, _0x547aca + " 没有更多本博主作品可切（" + (_0x38d006?.reason || _0x38d006?.error || "unknown") + "），结束本博主", "info", {
              accountId: _0x657df6
            });
            break;
          }
          if (_0x38d006.videoUrl) {
            _0x272098.url = _0x38d006.videoUrl;
          }
        } else {
          _0x45fff9(_0x323ff9, _0x547aca + " 已不在本博主作品流，停止后续作品", "warning", {
            accountId: _0x657df6
          });
          break;
        }
        if (_0x5b9fd7.secUid) {
          let _0x35928f = {
            matched: false
          };
          try {
            _0x35928f = await _0x14dbf9.confirmAuthor(_0x50c293.webContents, {
              taskId: _0x323ff9,
              videoUrl: _0x272098.url,
              expectedAuthorUrl: _0x5b9fd7.url,
              expectedSecUid: _0x5b9fd7.secUid,
              timeoutMs: 6000
            });
          } catch (_0x4c6e86) {
            _0x35928f = {
              matched: false
            };
          }
          const _0x5d1bdd = classifyDouyinAuthorIdentity(_0x35928f.secUid || _0x35928f.authorUrl || _0x35928f.pageUrl, _0x5b9fd7.secUid || _0x5b9fd7.url);
          if (_0x5d1bdd.foreign || _0x35928f.authorMismatch) {
            _0x45fff9(_0x323ff9, _0x547aca + " 当前作品不是目标博主，停止本博主后续作品（对齐指定博主，避免推荐流）", "warning", {
              accountId: _0x657df6
            });
            break;
          }
        }
        _0x45fff9(_0x323ff9, _0x547aca + " 开始处理作品 [" + (_0x417790 + 1) + "/" + _0x40d43f + "] " + _0xef49b9(_0x27b958(_0x272098), "…"), "info", {
          accountId: _0x657df6
        });
        const _0x1f9a8a = await _0x1b47bc({
          taskId: _0x323ff9,
          accountId: _0x657df6,
          account: _0x37d0bd,
          config: _0x877386,
          videoItem: _0x272098,
          videoIndex: _0x417790,
          videoTotal: _0x40d43f,
          accounts: _0x327dbe,
          monitorTasksApi: _0x36b52a,
          isRuntimeActive: _0x52c57c,
          seenKeys: _0x5a3c9b,
          updatedSeenKeys: _0x199a8b,
          seenKeySet: _0x3b02eb,
          counters: _0x3edaa6,
          monitorTaskName: _0x51e765,
          win: _0x50c293,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet,
          navigateMode: "skip"
        });
        _0x50c293 = _0x1f9a8a?.win || _0x50c293;
        if (_0x1f9a8a?.authorMismatch) {
          _0x45fff9(_0x323ff9, _0x547aca + " 采集中发现已离开目标博主，停止本博主后续作品", "warning", {
            accountId: _0x657df6
          });
          break;
        }
        _0x1a5474 = !!_0x50c293 && !_0x50c293.isDestroyed?.() && !_0x50c293.__radarMonitorUnhealthy && !!_0x14dbf9.canContinueAuthorFeed(_0x50c293);
        _0x59f18b += 1;
      }
    } catch (_0x390112) {
      _0x45fff9(_0x323ff9, _0x547aca + " 主播主页处理异常：" + (_0x390112?.message || _0x390112), "error", {
        accountId: _0x657df6
      });
    }
    return {
      win: _0x50c293,
      processedVideos: _0x59f18b,
      discovered: _0x542a20
    };
  }
  function _0x279f83(_0x5b501b, _0x53a8f3, _0x190538 = MONITOR_MAX_COMMENTS) {
    const _0x325086 = [];
    const _0x1f33a4 = new Set();
    [...(_0x5b501b || []), ...(_0x53a8f3 || [])].forEach(_0xacf6fd => {
      if (!_0xacf6fd || !_0xacf6fd.nickname || !_0xacf6fd.text || _0x325086.length >= _0x190538) {
        return;
      }
      const _0x58964a = _0xacf6fd.nickname + "__" + _0xacf6fd.text;
      if (_0x1f33a4.has(_0x58964a)) {
        return;
      }
      _0x1f33a4.add(_0x58964a);
      _0x325086.push(_0xacf6fd);
    });
    return _0x325086;
  }
  async function _0x4ea981({
    taskId: _0x43ea83,
    account: _0x8bf5e1,
    initialWindow: _0x276ce7,
    videoUrl: _0x368e43,
    loadUrl: _0x548a75,
    videoProgressLabel: _0x1d35e6,
    chunkSize = 0,
    initialComments = [],
    initialResumeState = null,
    expectedAuthorUrl = "",
    expectedSecUid = "",
    scrapeDeadlineAt = null,
    isRuntimeActive = () => _0x21e6e0.has(_0x43ea83)
  }) {
    const _0x2297e1 = Date.now();
    const _0x46d580 = Number.isFinite(Number(scrapeDeadlineAt)) ? Number(scrapeDeadlineAt) : _0x2297e1 + _0x19e276;
    let _0x57e1a9 = _0x276ce7;
    let _0x54ba7a = Array.isArray(initialComments) ? [...initialComments] : [];
    let _0x103ca0 = initialResumeState && typeof initialResumeState === "object" ? {
      ...initialResumeState
    } : null;
    let _0x5252f = 0;
    while (isRuntimeActive()) {
      const _0x144f2b = _0x46d580 - Date.now();
      if (_0x144f2b <= 15000) {
        if (_0x54ba7a.length > 0) {
          return {
            win: _0x57e1a9,
            result: {
              success: true,
              partialDueToDeadline: true,
              partialChunk: false,
              capped: false,
              comments: _0x54ba7a,
              resumeState: _0x103ca0,
              elapsedMs: Date.now() - _0x2297e1
            }
          };
        }
        return {
          win: _0x57e1a9,
          result: {
            success: false,
            error: "评论页面抓取超过 " + Math.round(_0x19e276 / 1000) + " 秒",
            errorCode: "monitor_scrape_page_timeout",
            comments: _0x54ba7a,
            resumeState: _0x103ca0,
            elapsedMs: Date.now() - _0x2297e1
          }
        };
      }
      const _0x217009 = _0x5252f < _0x2d4063 && _0x144f2b > _0x475409;
      const _0x5e132e = _0x43ea83 + "_scrape_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const _0x50158d = await _0x14afc1(_0x57e1a9.webContents, {
        requestId: _0x5e132e,
        maxComments: MONITOR_MAX_COMMENTS,
        chunkSize: Number(chunkSize) > 0 ? Number(chunkSize) : 0,
        targetVideoUrl: _0x368e43,
        expectedAuthorUrl: expectedAuthorUrl,
        expectedSecUid: expectedSecUid,
        scrapePageTimeoutMs: _0x144f2b,
        resumeComments: _0x54ba7a,
        resumeState: _0x103ca0,
        allowResourceCheckpoint: _0x217009
      }, Math.min(_0x41235d, _0x144f2b + 30000));
      if (isMonitorScrapeIdentityMismatch(_0x50158d)) {
        return {
          win: _0x57e1a9,
          result: {
            ..._0x50158d,
            comments: [],
            resumeState: null,
            elapsedMs: Date.now() - _0x2297e1
          }
        };
      }
      _0x54ba7a = _0x279f83(_0x54ba7a, _0x50158d?.comments, MONITOR_MAX_COMMENTS);
      if (_0x50158d?.resumeState && typeof _0x50158d.resumeState === "object") {
        _0x103ca0 = _0x50158d.resumeState;
      }
      if (!_0x50158d?.resourceCheckpoint) {
        return {
          win: _0x57e1a9,
          result: {
            ..._0x50158d,
            comments: _0x54ba7a,
            resumeState: _0x103ca0,
            partialChunk: !!_0x50158d?.partialChunk,
            elapsedMs: Date.now() - _0x2297e1
          }
        };
      }
      _0x5252f += 1;
      _0x45fff9(_0x43ea83, _0x1d35e6 + " 设备降载保护：渲染内存 " + (_0x50158d.rendererMemoryMb || "偏高") + "MB，已保存 " + _0x54ba7a.length + " 条评论进度；正在重建后台页面并继续当前视频（" + _0x5252f + "/" + _0x2d4063 + "）", "info");
      if (!isRuntimeActive()) {
        const _0xbffe94 = String(_0x8bf5e1.id);
        if (_0x279862.get(_0xbffe94) === _0x57e1a9) {
          _0x279862.delete(_0xbffe94);
        }
        try {
          if (_0x57e1a9 && !_0x57e1a9.isDestroyed()) {
            _0x57e1a9.destroy();
          }
        } catch (_0x22940b) {}
        _0x57e1a9 = null;
        break;
      }
      _0x57e1a9 = await _0x316536(_0x8bf5e1.id, _0x8bf5e1.proxy, _0x57e1a9, _0x43ea83);
      await _0xfc3a53(_0x57e1a9, _0x548a75);
      try {
        await _0x14dbf9.waitVideoReady(_0x57e1a9.webContents, {
          taskId: _0x43ea83,
          videoUrl: _0x548a75 || _0x368e43,
          timeoutMs: 15000
        });
      } catch (_0x21aeb3) {
        await new Promise(_0x12063d => setTimeout(_0x12063d, 1500));
      }
    }
    return {
      win: _0x57e1a9,
      result: {
        success: false,
        error: "监控任务已停止",
        errorCode: "monitor_task_stopped",
        comments: _0x54ba7a,
        resumeState: _0x103ca0,
        partialChunk: false,
        elapsedMs: Date.now() - _0x2297e1
      }
    };
  }
  async function _0x2c2c01({
    taskId: _0x51b4ae,
    accountId: _0x49d081,
    account: _0x4a2ac0,
    config: _0x1e5a09,
    videoItem: _0x2c64e2,
    batchComments: _0x445e66,
    win: _0x3dcf98,
    seenKeys: _0x45c0f3,
    updatedSeenKeys: _0x315ad9,
    seenKeySet: _0x2da441,
    skipContext: _0x405316,
    monitorTaskName: _0x7cd3e8,
    monitorTasksApi: _0x3f9e3f,
    isRuntimeActive: _0x4847bb,
    videoProgressLabel: _0x3c88f3,
    videoCtx: _0xe5d807,
    batchLabel: _0x311ced,
    accumulatedCount: _0x2a312b,
    videoStartedAt: _0x974692,
    counters: _0x5c93c1,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const _0x2ebdff = _0x563ca5({
      comments: _0x445e66,
      videoUrl: _0x2c64e2.url,
      seenKeys: _0x45c0f3,
      updatedSeenKeys: _0x315ad9,
      seenKeySet: _0x2da441,
      taskId: _0x51b4ae,
      skipContext: _0x405316,
      commentWindowMinutes: _0x1e5a09.commentWindowMinutes,
      knownUserKeySet: knownUserKeySet
    });
    _0x5c99a1(_0x315ad9, _0x2da441, _0x2ebdff.toSeedOnly);
    const _0x52f3f7 = _0x2ebdff.toEvaluate.map(_0x45c3cb => _0x45c3cb.comment);
    const _0x490976 = _0x52f3f7.length;
    const _0x4a2244 = _0x2ebdff.toSeedOnly.length;
    const _0x5980ab = _0x2ebdff.windowMin + " 分钟内";
    _0x45fff9(_0x51b4ae, _0x3c88f3 + " " + _0x311ced + "新增 " + _0x445e66.length + " 条，累计已采 " + _0x2a312b + " 条，" + _0x5980ab + "待研判 " + _0x490976 + " 条" + ("" + (_0x2ebdff.inInventoryCount > 0 ? "（" + _0x2ebdff.inInventoryCount + " 条已在库存）" : "")) + ("" + (_0x2ebdff.skippedFilterCount > 0 ? "，" + _0x2ebdff.skippedFilterCount + " 条已过滤" : "")) + ("" + (_0x4a2244 > 0 ? "，" + _0x4a2244 + " 条仅记录去重" : "")) + ("，当前耗时 " + _0x310e3b(Date.now() - _0x974692)), _0x490976 > 0 ? "success" : "info");
    if (_0x2ebdff.skippedFilterCount > 0) {
      const _0x1ca6aa = Object.entries(_0x2ebdff.skippedByReason || {}).map(([_0x1b7786, _0x327fdd]) => _0x1b7786 + " " + _0x327fdd).join("、");
      _0x45fff9(_0x51b4ae, "[排除汇总] 已过滤评论：" + _0x1ca6aa, "info");
    }
    if (_0x2ebdff.isFirstBaseline && _0x4a2244 > 0) {
      _0x45fff9(_0x51b4ae, "首轮基线：" + _0x311ced + "记录 " + _0x4a2244 + " 条历史评论去重，不写入线索库、不研判", "info");
    }
    if (_0x490976 === 0) {
      _0x45fff9(_0x51b4ae, _0xef49b9(_0xe5d807) + " " + _0x2ebdff.windowMin + " 分钟内无新评论需研判", "info");
      return {
        win: _0x3dcf98,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: _0x4a2244,
        classified: _0x2ebdff,
        evaluateFailed: false,
        stopped: !_0x4847bb()
      };
    }
    _0x45fff9(_0x51b4ae, "开始研判 " + _0x490976 + " 条新评论（" + _0x5980ab + "）…", "info");
    let _0x523736 = 0;
    let _0x1f0305 = 0;
    let _0x2c495f = 0;
    let _0x162bc9 = 0;
    let _0x552bbf = 0;
    let _0x15a855 = 0;
    let _0x141856 = new Array(_0x52f3f7.length);
    try {
      const _0x3e62d8 = [];
      const _0x479eb0 = [];
      _0x52f3f7.forEach((_0x374847, _0x15d8f8) => {
        const _0x6d4c64 = matchExcludeCommentKeyword(_0x374847?.text, _0x1e5a09.excludeCommentKeywords);
        if (_0x6d4c64) {
          _0x141856[_0x15d8f8] = {
            matched: false,
            matchType: "excluded_keyword",
            intent: "low",
            reason: "命中排除评论关键词「" + _0x6d4c64 + "」，直接判定为低意向",
            excludedCommentKeyword: _0x6d4c64
          };
        } else {
          _0x3e62d8.push(_0x374847);
          _0x479eb0.push(_0x15d8f8);
        }
      });
      if (_0x3e62d8.length > 0) {
        const _0x50ea3c = await _0x150a82(_0x51b4ae, _0x49d081, _0x1e5a09, _0x2c64e2, _0x4a2ac0, _0x3e62d8);
        if (_0x50ea3c.length !== _0x3e62d8.length) {
          throw new Error("批量研判结果数量异常");
        }
        _0x50ea3c.forEach((_0x13c67c, _0x2c97eb) => {
          _0x141856[_0x479eb0[_0x2c97eb]] = _0x13c67c;
        });
      }
    } catch (_0x3cdcec) {
      _0x45fff9(_0x51b4ae, "批量研判失败，本轮将稍后重试：" + _0x3cdcec.message, "error");
      return {
        win: _0x3dcf98,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: _0x4a2244,
        classified: _0x2ebdff,
        evaluateFailed: true,
        stopped: !_0x4847bb()
      };
    }
    if (_0x141856.length !== _0x52f3f7.length) {
      _0x45fff9(_0x51b4ae, "批量研判结果数量异常，本轮跳过", "warning");
      return {
        win: _0x3dcf98,
        videoMatched: 0,
        videoLikes: 0,
        videoReplies: 0,
        videoFollows: 0,
        videoFollowRequests: 0,
        videoMessages: 0,
        newCount: 0,
        seededCount: _0x4a2244,
        classified: _0x2ebdff,
        evaluateFailed: true,
        stopped: !_0x4847bb()
      };
    }
    const _0x177638 = _0x141856.filter(_0x99b94d => _0x99b94d?.matched).length;
    _0x45fff9(_0x51b4ae, "批量研判完成：" + _0x52f3f7.length + " 条，命中 " + _0x177638 + " 条", _0x177638 > 0 ? "success" : "info");
    const _0x3b385e = [];
    let _0x4c5e5f = 0;
    let _0x4c6545 = 0;
    const _0x1678a8 = (_0x1fda6a = "") => {
      if (!_0x3b385e.length) {
        return;
      }
      const _0x44608b = _0x3b385e.splice(0, _0x3b385e.length);
      try {
        _0x3653fd(_0x51b4ae, _0x315ad9, {
          seenEpoch: seenEpoch
        });
        _0x3f9e3f?.appendMatchRecords?.(_0x51b4ae, _0x44608b);
        _0x4c5e5f += _0x44608b.length;
        _0xdd9c41(_0x51b4ae, metricsFromMatchRecords(_0x44608b));
        _0x5eacfc(_0x51b4ae, {
          type: "matches-update",
          ts: Date.now(),
          added: _0x44608b.length,
          reason: _0x1fda6a || "batch"
        });
      } catch (_0x359b35) {
        _0x3b385e.unshift(..._0x44608b);
        _0x45fff9(_0x51b4ae, "研判详情落盘失败：" + (_0x359b35?.message || _0x359b35), "warning");
      }
    };
    for (let _0x5affd4 = 0; _0x5affd4 < _0x52f3f7.length; _0x5affd4 += 1) {
      if (!_0x4847bb()) {
        break;
      }
      const _0x442df9 = _0x52f3f7[_0x5affd4];
      const _0x365c64 = _0x1414c1(_0x2c64e2.url, _0x442df9);
      rememberMonitorUser(knownUserKeySet, _0x442df9);
      let _0x116973 = _0x141856[_0x5affd4] || {
        matched: false,
        reason: "研判无结果"
      };
      _0x45fff9(_0x51b4ae, _0xc79d27(_0x442df9, _0x116973) + "（" + formatCommentAgeLabel(_0x442df9.time) + "）", _0x116973.matched ? "success" : "info");
      const _0x597e89 = shouldSkipMonitorComment(_0x442df9, _0x405316);
      if (_0x597e89.skip) {
        _0x116973 = {
          matched: false,
          reason: "已跳过互动（" + _0x597e89.reason + "）",
          matchType: "skipped"
        };
        _0x45fff9(_0x51b4ae, "[排除过滤-动作拦截] " + (_0x597e89.detail || _0x597e89.reason), "warning");
      }
      const _0x34fa3d = {
        id: _0x4a8378(_0x51b4ae, _0x2c64e2.url, _0x442df9.nickname, _0x442df9.text, _0x442df9.userUrl || _0x442df9.authorProfileUrl || ""),
        ts: Date.now(),
        accountId: _0x49d081,
        accountName: _0x1feeff(_0x4a2ac0, _0x49d081),
        videoUrl: _0x2c64e2.url || "",
        videoTitle: _0x2c64e2.title || "",
        nickname: _0x442df9.nickname || "",
        userUrl: _0x442df9.userUrl || _0x442df9.authorProfileUrl || "",
        commentText: _0x442df9.text || "",
        matchType: _0x116973.matchType || (_0x116973.matched ? "keyword" : "none"),
        aiIntention: _0x116973.aiResult?.intention || _0x116973.intent || "",
        judgeReason: _0x116973.reason || "",
        matched: !!_0x116973.matched,
        excludedCommentKeyword: _0x116973.excludedCommentKeyword || "",
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
      if (!_0x116973.matched) {
        _0x34fa3d.likeStatus = _0x1e5a09.enableAutoLike ? "skipped" : "none";
        _0x34fa3d.likeError = _0x1e5a09.enableAutoLike ? "未满足匹配意向" : "";
        _0x34fa3d.replyStatus = _0x1e5a09.enableAutoReply ? "skipped" : "none";
        _0x34fa3d.replyError = _0x1e5a09.enableAutoReply ? "未满足匹配意向" : "";
        _0x34fa3d.followStatus = _0x1e5a09.enableAutoFollow ? "skipped" : "none";
        _0x34fa3d.followError = _0x1e5a09.enableAutoFollow ? "未满足匹配意向" : "";
        _0x34fa3d.dmStatus = _0x1e5a09.enableAutoDM ? "skipped" : "none";
        _0x34fa3d.dmError = _0x1e5a09.enableAutoDM ? "未满足匹配意向" : "";
        const _0xdcd181 = _0x16672a({
          comment: _0x442df9,
          videoItem: _0x2c64e2,
          account: _0x4a2ac0,
          accountId: _0x49d081,
          taskId: _0x51b4ae,
          taskName: _0x7cd3e8,
          evaluation: _0x116973,
          matchRecord: _0x34fa3d
        });
        _0x3b385e.push(_0x34fa3d);
        _0x121d97(_0x315ad9, _0x2da441, _0x365c64);
        _0x1678a8("miss-item");
        _0x4c6545 += _0x5a1dc1(_0xdcd181, _0x51b4ae, _0x7cd3e8, knownUserKeySet);
        continue;
      }
      try {
        _0x116973 = await _0x43deb8(_0x51b4ae, _0x49d081, _0x1e5a09, _0x2c64e2, _0x442df9, _0x4a2ac0, _0x116973);
      } catch (_0x7deb19) {
        _0x45fff9(_0x51b4ae, "动作生成异常，本条将下次重试：" + _0x7deb19.message, "error");
        continue;
      }
      _0x5c93c1.matchedCount += 1;
      _0x523736 += 1;
      _0x34fa3d.matchType = _0x116973.matchType || "keyword";
      _0x5eacfc(_0x51b4ae, {
        type: "match",
        accountId: _0x49d081,
        videoUrl: _0x2c64e2.url,
        videoTitle: _0x2c64e2.title,
        nickname: _0x442df9.nickname,
        text: _0x442df9.text,
        matchType: _0x34fa3d.matchType,
        aiIntention: _0x34fa3d.aiIntention,
        aiResult: _0x116973.aiResult || null,
        ts: _0x34fa3d.ts
      });
      if (_0x1e5a09.enableWebhook) {
        await _0x5c271f(_0x51b4ae, _0x1e5a09, {
          taskName: _0x7cd3e8,
          account: _0x4a2ac0,
          videoItem: _0x2c64e2,
          comment: _0x442df9,
          matchRecord: _0x34fa3d
        });
      }
      if (_0x116973.shouldLike || _0x116973.shouldReply || _0x116973.shouldFollow || _0x116973.shouldDM) {
        const _0x54e5b3 = await _0x3c452f({
          taskId: _0x51b4ae,
          config: _0x1e5a09,
          isRuntimeActive: _0x4847bb,
          logPrefix: "命中可互动内容 @" + (_0x442df9.nickname || "用户")
        });
        if (!_0x54e5b3) {
          break;
        }
        _0x45fff9(_0x51b4ae, "动作延迟结束，开始执行互动 @" + (_0x442df9.nickname || "用户") + "…", "info");
      }
      const _0x194308 = _0x442df9.cid || _0x442df9.commentId || _0x442df9.id || "";
      if ((_0x116973.shouldLike || _0x116973.shouldReply) && _0x3dcf98 && !_0x3dcf98.isDestroyed()) {
        const _0x279064 = _0x3dcf98.webContents.getURL();
        if (!isSameMonitorVideo(_0x2c64e2.url, _0x279064)) {
          _0x45fff9(_0x51b4ae, "当前窗口位于用户主页，正在重定向回视频页 @" + (_0x442df9.nickname || "用户") + "…", "info");
          try {
            await _0xfc3a53(_0x3dcf98, resolveDouyinMonitorVideoUrl(_0x2c64e2.url, _0x194308));
            await new Promise(_0x19c8f2 => setTimeout(_0x19c8f2, 2500));
            _0x192d35(_0x3dcf98);
          } catch (_0x59a602) {
            console.warn("[VideoMonitor] 重定向回视频页失败:", _0x59a602?.message || _0x59a602);
          }
        }
      }
      if (_0x116973.shouldLike) {
        if (!_0x488f92(_0x51b4ae, "like", _0x49d081)) {
          _0x34fa3d.likeStatus = "skipped";
          _0x34fa3d.likeError = _0x5b4eb7(_0x51b4ae, "like", "当前无法执行点赞", _0x49d081);
          _0x45fff9(_0x51b4ae, "点赞跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.likeError, "warning");
        } else {
          const _0x5547e1 = {
            requestId: _0x51b4ae + "_like_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            taskId: _0x51b4ae,
            action: "like",
            nickname: _0x442df9.nickname,
            commentText: _0x442df9.text,
            userUrl: _0x442df9.userUrl || "",
            commentId: _0x194308,
            timeText: _0x442df9.time || _0x442df9.timeText || ""
          };
          let _0x2384b5 = await _0x1509eb(_0x3dcf98.webContents, _0x5547e1);
          const _0x54678b = !_0x2384b5?.success && ["comment_like_failed", "like_button_not_found", "comment_node_not_found"].includes(String(_0x2384b5?.errorCode || ""));
          if (_0x54678b) {
            try {
              _0x2384b5 = await _0x43a025({
                win: _0x3dcf98,
                taskId: _0x51b4ae,
                videoItem: _0x2c64e2,
                commentCid: _0x194308,
                nickname: _0x442df9.nickname,
                errorCode: _0x2384b5?.errorCode || "",
                actionLabel: "点赞",
                runRetry: () => _0x1509eb(_0x3dcf98.webContents, {
                  ..._0x5547e1,
                  requestId: _0x51b4ae + "_like_retry_" + Date.now() + "_" + Math.random().toString(36).slice(2)
                })
              });
            } catch (_0x509231) {
              _0x2384b5 = {
                success: false,
                error: "点赞重试失败：" + _0x509231.message,
                errorCode: "comment_like_reload_failed"
              };
            }
          }
          if (_0x2384b5?.success) {
            _0x5c93c1.likeCount += 1;
            _0x1f0305 += 1;
            _0x34fa3d.likeStatus = "success";
            _0x34fa3d.likeError = "";
            if (!_0x2384b5?.alreadyLiked) {
              _0x309a11(_0x51b4ae, "like", _0x49d081);
            }
            const _0x4f41ed = Number(_0x2384b5?.elapsedMs);
            _0x45fff9(_0x51b4ae, "已点赞评论 @" + (_0x442df9.nickname || "用户") + (Number.isFinite(_0x4f41ed) ? "（页面动作耗时 " + (_0x4f41ed / 1000).toFixed(1) + "s）" : ""), "success");
          } else {
            _0x34fa3d.likeStatus = "failed";
            _0x34fa3d.likeError = _0x2384b5?.error || "点赞未完成";
            _0x45fff9(_0x51b4ae, "点赞失败 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.likeError, "warning");
          }
        }
      } else if (_0x1e5a09.enableAutoLike) {
        _0x34fa3d.likeStatus = "skipped";
        const _0x3de6b0 = !_0x488f92(_0x51b4ae, "like", _0x49d081) ? _0x5b4eb7(_0x51b4ae, "like", "当前无法执行点赞", _0x49d081) : "无须点赞";
        _0x34fa3d.likeError = _0x3de6b0;
        if (!_0x488f92(_0x51b4ae, "like", _0x49d081)) {
          _0x45fff9(_0x51b4ae, "点赞跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x3de6b0, "warning");
        }
      }
      let _0x5933f5 = new Map();
      const _0x33dd91 = async (_0x4e6acd = {}, _0x4b3be3 = _0x3dcf98) => {
        const {
          genderFilter: _0x3322fb,
          ageEnabled: _0x27bee6,
          ageMin: _0x265f18,
          ageMax: _0x1230c1,
          filterActive: _0x19c63e,
          cacheKey: _0x2bebd6
        } = _0x5d5fbe(_0x4e6acd, _0x1e5a09);
        if (_0x5933f5.has(_0x2bebd6)) {
          return _0x5933f5.get(_0x2bebd6);
        }
        if (!_0x19c63e) {
          const _0x14137f = {
            success: true,
            eligible: true,
            filterBypassed: true
          };
          _0x5933f5.set(_0x2bebd6, _0x14137f);
          return _0x14137f;
        }
        const _0x43137e = _0x4b3be3?.webContents || _0x3dcf98.webContents;
        const _0x70dcc4 = await _0x1509eb(_0x43137e, {
          requestId: _0x51b4ae + "_profile_filter_" + Date.now() + "_" + Math.random().toString(36).slice(2),
          action: "profile-target-check",
          nickname: _0x4e6acd.nickname || "",
          profileActionGenderFilter: _0x3322fb,
          profileActionAgeFilterEnabled: _0x27bee6,
          profileActionAgeMin: _0x265f18,
          profileActionAgeMax: _0x1230c1
        });
        let _0x4bd1b2;
        if (!_0x70dcc4?.success) {
          _0x4bd1b2 = {
            ..._0x70dcc4,
            eligible: false,
            filterReason: _0x70dcc4?.error || "主页资料识别失败"
          };
          _0x45fff9(_0x51b4ae, "主页目标筛选失败 @" + (_0x442df9.nickname || "用户") + "：" + _0x254963(_0x70dcc4, "主页资料识别失败") + "，已跳过主页动作", "warning");
        } else {
          _0x4bd1b2 = _0x70dcc4;
          const _0x84519c = _0x70dcc4.age !== null && _0x70dcc4.age !== undefined && Number.isFinite(Number(_0x70dcc4.age)) ? _0x70dcc4.age + " 岁" : "未知";
          _0x45fff9(_0x51b4ae, "主页目标筛选 @" + (_0x442df9.nickname || "用户") + "：性别 " + (_0x70dcc4.genderFilterLabel || "不限") + "（识别 " + (_0x70dcc4.genderObservedLabel || "未知") + "）；年龄 " + (_0x70dcc4.ageFilterLabel || "关闭") + "（识别 " + _0x84519c + "）→ " + (_0x70dcc4.eligible ? "通过" : "跳过：" + (_0x70dcc4.filterReason || "不符合条件")), _0x70dcc4.eligible ? "info" : "warning");
        }
        _0x5933f5.set(_0x2bebd6, _0x4bd1b2);
        return _0x4bd1b2;
      };
      const _0x4b73ea = (_0x116973.replyContent || "").trim();
      const _0x346ae9 = !!_0x116973.allowEmptyReplyText || !_0x4b73ea && _0x17d99e(_0x1e5a09);
      const _0x39967d = _0x5a24ed(_0x4b73ea, _0x1e5a09);
      if (_0x116973.shouldReply) {
        let _0x4f437e = false;
        let _0x2d5c2f = false;
        let _0x307f27 = false;
        let _0x2fcf97 = false;
        const _0x287a02 = _0x1e5a09.enableAutoReply && _0x488f92(_0x51b4ae, "reply", _0x49d081);
        const _0x2334be = _0x1e5a09.enableAutoReply && _0x1e5a09.commentOnProfileFirstWork === true && _0x488f92(_0x51b4ae, "reply", _0x49d081);
        const _0x552c0d = Number.isFinite(Number(_0x1e5a09.commentAttachmentPercent)) ? Number(_0x1e5a09.commentAttachmentPercent) : 100;
        const _0x57e60d = {
          monitorTaskId: _0x51b4ae,
          isMonitorAction: true,
          enableCommentMention: !!_0x1e5a09.enableCommentMention,
          commentMentionNicknames: _0x1e5a09.commentMentionNicknames || "",
          commentMentionPosition: _0x1e5a09.commentMentionPosition || "before",
          commentMentionPercent: Number.isFinite(Number(_0x1e5a09.commentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x1e5a09.commentMentionPercent)))) : 100,
          enableCommentImage: !!_0x1e5a09.enableCommentImage,
          commentImagePaths: _0x1e5a09.commentImagePaths || [],
          enableCommentExpression: !!_0x1e5a09.enableCommentExpression,
          commentExpressionCount: _0x1e5a09.commentExpressionCount || 3,
          commentUseRandomSuffix: false,
          enableCommentWithoutText: _0x346ae9 || _0x1e5a09.enableCommentWithoutText === true,
          commentAttachmentPercent: _0x346ae9 ? 100 : _0x552c0d
        };
        if (_0x2334be && _0x442df9.userUrl) {
          _0x45fff9(_0x51b4ae, "在子视图打开用户主页尝试首作评论 @" + (_0x442df9.nickname || "用户") + "…", "info");
          let _0x3c2723 = null;
          await _0x18cf64(_0x49d081, _0x4a2ac0?.proxy, _0x442df9.userUrl, _0x3dcf98, async _0x33283f => {
            const _0x16ae7c = await _0x33dd91({
              nickname: _0x442df9.nickname,
              userUrl: _0x442df9.userUrl,
              genderFilter: _0x1e5a09.profileFirstGenderFilter,
              ageFilterEnabled: _0x1e5a09.profileFirstAgeFilterEnabled,
              ageMin: _0x1e5a09.profileFirstAgeMin,
              ageMax: _0x1e5a09.profileFirstAgeMax
            }, _0x33283f);
            _0x307f27 = _0x16ae7c.filtered === true || _0x16ae7c.eligible === false;
            _0x3c2723 = _0x16ae7c.eligible ? await _0x1509eb(_0x33283f.webContents, {
              requestId: _0x51b4ae + "_firstcmt_" + Date.now() + "_" + Math.random().toString(36).slice(2),
              action: "profile-first-comment",
              nickname: _0x442df9.nickname,
              replyContent: _0x4b73ea,
              ..._0x57e60d,
              profileFirstWorkLikePercent: _0x1e5a09.profileFirstWorkLikePercent !== undefined ? _0x1e5a09.profileFirstWorkLikePercent : 10,
              profileFirstWorkCollectPercent: _0x1e5a09.profileFirstWorkCollectPercent !== undefined ? _0x1e5a09.profileFirstWorkCollectPercent : 10,
              commentOnProfileFirstWork: true
            }) : {
              success: false,
              error: _0x16ae7c.filterReason || "主页目标不符合筛选条件",
              errorCode: _0x16ae7c.filtered ? "profile_target_filtered" : "profile_page_load_failed"
            };
            if (!_0x307f27 && (_0x116973.shouldFollow || _0x116973.shouldDM)) {
              if (_0x116973.shouldFollow && _0x488f92(_0x51b4ae, "follow", _0x49d081)) {
                const _0x4eb636 = await _0x1509eb(_0x33283f.webContents, {
                  requestId: _0x51b4ae + "_follow_inline_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  action: "follow",
                  userUrl: _0x442df9.userUrl,
                  nickname: _0x442df9.nickname
                });
                const _0x238429 = _0x4eb636?.followStatus || (_0x4eb636?.success ? "success" : "failed");
                _0x34fa3d.followStatus = _0x238429;
                _0x34fa3d.followError = _0x4eb636?.error || "";
                _0x34fa3d.followErrorCode = _0x4eb636?.errorCode || "";
                _0x34fa3d.followDiagnostic = _0x4eb636?.diagnostic || _0x4eb636?.detail || "";
                _0x34fa3d.followRequested = _0x238429 === "requested" || !!_0x4eb636?.followRequested;
                _0x34fa3d.followRequestSent = !!_0x4eb636?.followRequestSent;
                _0x34fa3d.followIsPrivate = !!_0x4eb636?.isPrivate || !!_0x34fa3d.isPrivate;
                if (_0x4eb636?.worksCount !== undefined) {
                  _0x34fa3d.worksCount = Number(_0x4eb636.worksCount || 0);
                }
                if (_0x4eb636?.noWorks !== undefined) {
                  _0x34fa3d.noWorks = !!_0x4eb636.noWorks;
                }
                if (_0x238429 === "success") {
                  _0x5c93c1.followCount += 1;
                  _0x162bc9 += 1;
                  _0x309a11(_0x51b4ae, "follow", _0x49d081);
                  _0x45fff9(_0x51b4ae, "已顺带完成关注 @" + (_0x442df9.nickname || "用户"), "success");
                } else if (_0x238429 === "already_followed") {
                  _0x45fff9(_0x51b4ae, "@" + (_0x442df9.nickname || "用户") + " 原本已关注，未重复点击", "info");
                } else if (_0x238429 === "requested") {
                  if (_0x34fa3d.followRequestSent) {
                    _0x5c93c1.followRequestCount += 1;
                    _0x552bbf += 1;
                    _0x309a11(_0x51b4ae, "follow", _0x49d081);
                  }
                  _0x45fff9(_0x51b4ae, "已顺带提交关注请求 @" + (_0x442df9.nickname || "用户") + "，等待对方通过", "warning");
                } else {
                  _0x45fff9(_0x51b4ae, "顺带关注未成功 @" + (_0x442df9.nickname || "用户") + "：" + (_0x4eb636?.error || "状态未确认"), "warning");
                }
                _0x116973.shouldFollow = false;
              }
              if (_0x116973.shouldDM && _0x488f92(_0x51b4ae, "dm", _0x49d081)) {
                const _0x1f0b46 = (_0x116973.dmContent || "").trim();
                if (_0x1f0b46) {
                  const _0x52d6cf = await _0x1509eb(_0x33283f.webContents, {
                    requestId: _0x51b4ae + "_dm_inline_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                    action: "dm",
                    userUrl: _0x442df9.userUrl,
                    nickname: _0x442df9.nickname,
                    dmContent: _0x1f0b46
                  });
                  _0x34fa3d.dmContent = _0x1f0b46;
                  if (_0x52d6cf?.success) {
                    await new Promise(_0x497b0b => setTimeout(_0x497b0b, 2500));
                    _0x5c93c1.messageCount += 1;
                    _0x15a855 += 1;
                    _0x34fa3d.dmStatus = "success";
                    _0x309a11(_0x51b4ae, "dm", _0x49d081);
                    markUserReplied(_0x51b4ae, _0x442df9.nickname, _0x3639c8);
                    _0x45fff9(_0x51b4ae, "已顺带完成私信 @" + _0x442df9.nickname + "：" + _0x1f0b46.slice(0, 40), "success");
                  } else {
                    _0x34fa3d.dmStatus = "failed";
                    _0x45fff9(_0x51b4ae, "顺带私信未成功 @" + _0x442df9.nickname + "：" + (_0x52d6cf?.error || "未知"), "warning");
                  }
                  _0x116973.shouldDM = false;
                }
              }
            }
          }).catch(_0x289c0e => {
            _0x45fff9(_0x51b4ae, "首作评论子视图异常 @" + (_0x442df9.nickname || "用户") + "：" + (_0x289c0e?.message || _0x289c0e), "warning");
            _0x3c2723 = {
              success: false,
              error: _0x289c0e?.message || "首作评论页面加载失败"
            };
          });
          if (_0x3c2723?.success) {
            _0x4f437e = true;
            _0x2d5c2f = true;
            _0x5c93c1.replyCount += 1;
            _0x2c495f += 1;
            _0x34fa3d.replyContent = _0x4b73ea;
            _0x34fa3d.replyStatus = "success";
            _0x34fa3d.replyError = "";
            _0x34fa3d.replyErrorCode = "";
            _0x34fa3d.replyDiagnostic = "";
            _0x34fa3d.replyTarget = "profile_first";
            _0x34fa3d.profileCommentStatus = "success";
            _0x34fa3d.profileCommentError = "";
            _0x34fa3d.profileCommentErrorCode = "";
            _0x309a11(_0x51b4ae, "reply", _0x49d081);
            markUserReplied(_0x51b4ae, _0x442df9.nickname, _0x3639c8);
            _0x45fff9(_0x51b4ae, "主页作品评论成功 @" + _0x442df9.nickname + "：" + _0x39967d, "success");
            if (_0x3c2723?.workLiked) {
              _0x34fa3d.liked = true;
              _0x45fff9(_0x51b4ae, "首作作品已点赞 @" + (_0x442df9.nickname || "用户"), "success");
            }
            if (_0x3c2723?.workCollected) {
              _0x34fa3d.collected = true;
              _0x45fff9(_0x51b4ae, "首作作品已收藏 @" + (_0x442df9.nickname || "用户"), "success");
            }
          } else {
            const _0x42b61c = _0x254963(_0x3c2723, "无可评论作品");
            _0x45fff9(_0x51b4ae, "主页作品评论跳过/失败：" + _0x42b61c, "warning");
            _0x34fa3d.profileCommentStatus = _0x307f27 ? "skipped" : "failed";
            _0x34fa3d.profileCommentError = _0x42b61c;
            _0x34fa3d.profileCommentErrorCode = _0x3c2723?.errorCode === "no_works" || _0x3c2723?.noWorks ? "no_works" : _0x3c2723?.errorCode === "profile_works_not_ready" ? "profile_works_not_ready" : _0x3c2723?.errorCode || "profile_first_comment_failed";
            if ((_0x1e5a09.profileFirstCommentFallbackMode || "reply") === "reply" && (!_0x307f27 || _0x287a02)) {
              _0x2fcf97 = _0x287a02;
              if (_0x2fcf97) {
                _0x45fff9(_0x51b4ae, "正在在当前视频页回复原评论 @" + _0x442df9.nickname + "…", "info");
              }
            } else {
              _0x34fa3d.replyContent = _0x4b73ea;
              _0x34fa3d.replyStatus = "failed";
              _0x34fa3d.replyError = _0x42b61c;
              _0x34fa3d.replyErrorCode = _0x34fa3d.profileCommentErrorCode;
              _0x34fa3d.replyDiagnostic = _0x3c2723?.diagnostic || _0x3c2723?.detail || "";
              _0x34fa3d.replyTarget = "profile_first";
              if (_0x3c2723?.noWorks || _0x3c2723?.errorCode === "no_works") {
                _0x34fa3d.noWorks = true;
                if (_0x3c2723?.worksCount !== undefined) {
                  _0x34fa3d.worksCount = Number(_0x3c2723.worksCount || 0);
                }
              }
              _0x45fff9(_0x51b4ae, "已按“仅首作评论”模式跳过原评论回复", "info");
            }
          }
        } else if (_0x2334be && !_0x442df9.userUrl) {
          if ((_0x1e5a09.profileFirstCommentFallbackMode || "reply") === "reply") {
            _0x2fcf97 = _0x287a02;
          } else {
            _0x34fa3d.replyStatus = "skipped";
            _0x34fa3d.replyError = "未解析到用户主页链接，且为仅首作评论模式";
            _0x34fa3d.replyTarget = "profile_first";
            _0x34fa3d.profileCommentStatus = "skipped";
            _0x34fa3d.profileCommentError = _0x34fa3d.replyError;
            _0x34fa3d.profileCommentErrorCode = "no_user_url";
            _0x45fff9(_0x51b4ae, "回复跳过 @" + (_0x442df9.nickname || "用户") + "：无主页链接且仅首作评论", "warning");
          }
        } else {
          _0x2fcf97 = _0x287a02;
        }
        if (!_0x2d5c2f && _0x2fcf97) {
          if (!_0x1e5a09.commentOnProfileFirstWork) {
            _0x45fff9(_0x51b4ae, "正在回复原评论 @" + (_0x442df9.nickname || "用户") + "…", "info");
          }
          const _0x132ff5 = _0x442df9.cid || _0x442df9.commentId || _0x442df9.id || "";
          const _0x32b784 = {
            action: "reply",
            nickname: _0x442df9.nickname,
            commentText: _0x442df9.text,
            replyContent: _0x4b73ea,
            commentId: _0x132ff5,
            userUrl: _0x442df9.userUrl || "",
            timeText: _0x442df9.time || _0x442df9.timeText || "",
            ..._0x57e60d
          };
          let _0x10d18e = await _0x1509eb(_0x3dcf98.webContents, {
            requestId: _0x51b4ae + "_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            ..._0x32b784
          });
          if (!_0x10d18e?.success && _0x28deb7(_0x10d18e)) {
            try {
              _0x10d18e = await _0x43a025({
                win: _0x3dcf98,
                taskId: _0x51b4ae,
                videoItem: _0x2c64e2,
                commentCid: _0x132ff5,
                nickname: _0x442df9.nickname,
                errorCode: _0x10d18e?.errorCode || "",
                actionLabel: "回复",
                runRetry: () => _0x1509eb(_0x3dcf98.webContents, {
                  requestId: _0x51b4ae + "_retry_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  ..._0x32b784
                })
              });
            } catch (_0x3ac5e3) {
              _0x10d18e = {
                success: false,
                error: "回复重试失败：" + _0x3ac5e3.message,
                errorCode: "reply_reload_failed"
              };
            }
          }
          _0x34fa3d.replyContent = _0x4b73ea;
          _0x34fa3d.replyTarget = "comment";
          if (_0x10d18e?.success) {
            _0x4f437e = true;
            _0x5c93c1.replyCount += 1;
            _0x2c495f += 1;
            _0x34fa3d.replyStatus = "success";
            _0x34fa3d.replyError = "";
            _0x34fa3d.replyErrorCode = "";
            _0x34fa3d.replyDiagnostic = "";
            _0x309a11(_0x51b4ae, "reply", _0x49d081);
            markUserReplied(_0x51b4ae, _0x442df9.nickname, _0x3639c8);
            _0x45fff9(_0x51b4ae, "已回复 @" + _0x442df9.nickname + "：" + _0x39967d, "success");
          } else {
            _0x34fa3d.replyStatus = "failed";
            _0x34fa3d.replyError = _0x10d18e?.error || "回复未完成";
            _0x34fa3d.replyErrorCode = _0x10d18e?.errorCode || "reply_failed";
            _0x34fa3d.replyDiagnostic = _0x10d18e?.diagnostic || _0x10d18e?.detail || "";
            _0x45fff9(_0x51b4ae, "回复失败 @" + _0x442df9.nickname + "：" + _0x254963(_0x10d18e, "回复未完成"), "warning");
          }
        } else if (!_0x4f437e && !_0x2d5c2f && !_0x287a02) {
          _0x34fa3d.replyStatus = "skipped";
          _0x34fa3d.replyError = _0x5b4eb7(_0x51b4ae, "reply", _0x1e5a09.enableAutoReply ? "当前无法执行回复" : "未开启自动回复", _0x49d081);
          _0x45fff9(_0x51b4ae, "回复跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.replyError, "warning");
        }
      } else if (_0x1e5a09.enableAutoReply) {
        _0x34fa3d.replyStatus = "skipped";
        const _0x564e55 = !_0x488f92(_0x51b4ae, "reply", _0x49d081) ? _0x5b4eb7(_0x51b4ae, "reply", "当前无法执行回复", _0x49d081) : !_0x4b73ea && !_0x17d99e(_0x1e5a09) ? _0x1e5a09.enableCommentWithoutText ? "已开启不发文字但未配置图片/表情/@" : "未填写文字且未配置图片/表情/@" : "当前无法执行回复";
        _0x34fa3d.replyError = _0x564e55;
        _0x45fff9(_0x51b4ae, "回复跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x564e55, "warning");
      }
      const _0x5a66aa = _0x116973.shouldFollow || _0x116973.shouldDM;
      if (_0x5a66aa && _0x442df9.userUrl) {
        const _0x38d02e = _0x116973.shouldFollow && _0x488f92(_0x51b4ae, "follow", _0x49d081);
        const _0x2e8899 = _0x116973.shouldDM && _0x488f92(_0x51b4ae, "dm", _0x49d081);
        if (_0x116973.shouldFollow && !_0x38d02e) {
          _0x34fa3d.followStatus = "skipped";
          _0x34fa3d.followError = _0x5b4eb7(_0x51b4ae, "follow", "当前无法执行关注", _0x49d081);
          _0x45fff9(_0x51b4ae, "关注跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.followError, "warning");
        } else if (_0x1e5a09.enableAutoFollow && !_0x116973.shouldFollow) {
          _0x34fa3d.followStatus = "skipped";
          const _0x1cec32 = _0x2c7b6e(_0x51b4ae, "follow", _0x49d081);
          _0x34fa3d.followError = _0x1cec32 || "主页目标不符合筛选条件";
        }
        if (_0x116973.shouldDM && !_0x2e8899) {
          _0x34fa3d.dmStatus = "skipped";
          _0x34fa3d.dmError = _0x5b4eb7(_0x51b4ae, "dm", "当前无法执行私信", _0x49d081);
          _0x45fff9(_0x51b4ae, "私信跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.dmError, "warning");
        } else if (_0x1e5a09.enableAutoDM && !_0x116973.shouldDM) {
          _0x34fa3d.dmStatus = "skipped";
          const _0x2ea77c = _0x2c7b6e(_0x51b4ae, "dm", _0x49d081);
          _0x34fa3d.dmError = _0x2ea77c || (!(_0x116973.dmContent || "").trim() ? "私信内容为空" : "主页目标不符合筛选条件");
        }
        if (_0x38d02e || _0x2e8899) {
          const _0x1a978d = [_0x38d02e ? "关注" : "", _0x2e8899 ? "私信" : ""].filter(Boolean).join("并");
          _0x45fff9(_0x51b4ae, "正在在子视图打开用户页" + _0x1a978d + " @" + (_0x442df9.nickname || "用户") + "…", "info");
          await _0x18cf64(_0x49d081, _0x4a2ac0?.proxy, _0x442df9.userUrl, _0x3dcf98, async _0x191c22 => {
            let _0x1e4a3c = await _0x33dd91({
              nickname: _0x442df9.nickname,
              userUrl: _0x442df9.userUrl,
              genderFilter: _0x1e5a09.profileActionGenderFilter,
              ageFilterEnabled: _0x1e5a09.profileActionAgeFilterEnabled,
              ageMin: _0x1e5a09.profileActionAgeMin,
              ageMax: _0x1e5a09.profileActionAgeMax
            }, _0x191c22);
            let _0x418cff = _0x1e4a3c.eligible === true;
            if (_0x1e4a3c) {
              if (_0x1e4a3c.isPrivate !== undefined) {
                _0x34fa3d.isPrivate = !!_0x1e4a3c.isPrivate;
              }
              if (_0x1e4a3c.worksCount !== undefined) {
                _0x34fa3d.worksCount = Number(_0x1e4a3c.worksCount || 0);
              }
              if (_0x1e4a3c.noWorks !== undefined) {
                _0x34fa3d.noWorks = !!_0x1e4a3c.noWorks;
              }
              if (_0x1e4a3c.isPrivate) {
                _0x34fa3d.followIsPrivate = true;
              }
            }
            if (_0x38d02e) {
              if (!_0x418cff) {
                _0x34fa3d.followStatus = "skipped";
                _0x34fa3d.followError = _0x1e4a3c?.filterReason || "主页目标不符合筛选条件";
                _0x34fa3d.followErrorCode = _0x1e4a3c?.filtered ? "profile_target_filtered" : "profile_target_check_failed";
                _0x45fff9(_0x51b4ae, "关注跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.followError, "info");
              } else {
                const _0x4dc60d = await _0x1509eb(_0x191c22.webContents, {
                  requestId: _0x51b4ae + "_follow_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                  action: "follow",
                  userUrl: _0x442df9.userUrl,
                  nickname: _0x442df9.nickname
                });
                const _0x70041e = _0x4dc60d?.followStatus || (_0x4dc60d?.success ? "success" : "failed");
                _0x34fa3d.followStatus = _0x70041e;
                _0x34fa3d.followError = _0x4dc60d?.error || (_0x70041e === "failed" ? "关注状态未确认" : "");
                _0x34fa3d.followErrorCode = _0x4dc60d?.errorCode || "";
                _0x34fa3d.followDiagnostic = _0x4dc60d?.diagnostic || _0x4dc60d?.detail || "";
                _0x34fa3d.followRequested = _0x70041e === "requested" || !!_0x4dc60d?.followRequested;
                _0x34fa3d.followRequestSent = !!_0x4dc60d?.followRequestSent;
                _0x34fa3d.followIsPrivate = !!_0x4dc60d?.isPrivate || !!_0x34fa3d.isPrivate;
                if (_0x4dc60d?.worksCount !== undefined) {
                  _0x34fa3d.worksCount = Number(_0x4dc60d.worksCount || 0);
                }
                if (_0x4dc60d?.noWorks !== undefined) {
                  _0x34fa3d.noWorks = !!_0x4dc60d.noWorks;
                }
                if (_0x70041e === "skipped" || _0x70041e === "failed" && _0x43e97f(_0x4dc60d)) {
                  _0x34fa3d.followStatus = "skipped";
                  _0x34fa3d.followError = _0x546b94("关注", _0x4dc60d);
                  _0x34fa3d.followErrorCode = _0x4dc60d?.errorCode || "private_account";
                  if (_0x43e97f(_0x4dc60d)) {
                    _0x34fa3d.followIsPrivate = true;
                  }
                  _0x45fff9(_0x51b4ae, "关注跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.followError, "info");
                } else if (_0x70041e === "success") {
                  _0x5c93c1.followCount += 1;
                  _0x162bc9 += 1;
                  _0x309a11(_0x51b4ae, "follow", _0x49d081);
                  _0x45fff9(_0x51b4ae, "关注成功 @" + (_0x442df9.nickname || "用户"), "success");
                } else if (_0x70041e === "already_followed") {
                  _0x45fff9(_0x51b4ae, "@" + (_0x442df9.nickname || "用户") + " 原本已关注，本次未重复点击", "info");
                } else if (_0x70041e === "requested") {
                  if (_0x34fa3d.followRequestSent) {
                    _0x5c93c1.followRequestCount += 1;
                    _0x552bbf += 1;
                    _0x309a11(_0x51b4ae, "follow", _0x49d081);
                  }
                  const _0x5566a5 = _0x34fa3d.followIsPrivate ? "（私密账号）" : "";
                  _0x45fff9(_0x51b4ae, _0x34fa3d.followRequestSent ? "已向 @" + (_0x442df9.nickname || "用户") + " 提交关注请求" + _0x5566a5 + "，等待对方通过" : "@" + (_0x442df9.nickname || "用户") + " 的关注请求仍在等待通过" + _0x5566a5 + "，本次未重复提交", "warning");
                } else {
                  const _0x3c1db7 = _0x254963(_0x4dc60d, "关注状态未确认");
                  _0x34fa3d.followError = _0x3c1db7;
                  _0x45fff9(_0x51b4ae, "关注失败 @" + (_0x442df9.nickname || "用户") + "：" + _0x3c1db7, "warning");
                }
              }
            }
            if (_0x2e8899) {
              const _0x52075c = (_0x116973.dmContent || "").trim();
              if (_0x52075c && _0x418cff) {
                const _0x175531 = _0x51b4ae + "_dm_" + Date.now() + "_" + Math.random().toString(36).slice(2);
                const _0x3fa405 = await _0x1509eb(_0x191c22.webContents, {
                  requestId: _0x175531,
                  action: "dm",
                  userUrl: _0x442df9.userUrl,
                  nickname: _0x442df9.nickname,
                  dmContent: _0x52075c,
                  profileDetail: _0x1e4a3c?.profileDetail || null,
                  genderFilter: _0x1e5a09.profileActionGenderFilter,
                  ageFilterEnabled: _0x1e5a09.profileActionAgeFilterEnabled,
                  ageMin: _0x1e5a09.profileActionAgeMin,
                  ageMax: _0x1e5a09.profileActionAgeMax
                });
                _0x34fa3d.dmContent = _0x52075c;
                if (_0x3fa405?.isPrivate !== undefined) {
                  _0x34fa3d.isPrivate = !!_0x3fa405.isPrivate;
                }
                if (_0x3fa405?.worksCount !== undefined) {
                  _0x34fa3d.worksCount = Number(_0x3fa405.worksCount || 0);
                }
                if (_0x3fa405?.noWorks !== undefined) {
                  _0x34fa3d.noWorks = !!_0x3fa405.noWorks;
                }
                if (_0x3fa405?.success) {
                  await new Promise(_0x48d878 => setTimeout(_0x48d878, 2500));
                  _0x5c93c1.messageCount += 1;
                  _0x15a855 += 1;
                  _0x34fa3d.dmStatus = "success";
                  _0x309a11(_0x51b4ae, "dm", _0x49d081);
                  markUserReplied(_0x51b4ae, _0x442df9.nickname, _0x3639c8);
                  _0x45fff9(_0x51b4ae, "已私信 @" + _0x442df9.nickname + "：" + _0x52075c.slice(0, 40), "success");
                } else if (_0x3fa405?.skipped || _0x43e97f(_0x3fa405) || /私密账号|隐私设置|对方账号设置了隐私/.test(String(_0x3fa405?.error || ""))) {
                  _0x34fa3d.dmStatus = "skipped";
                  _0x34fa3d.dmError = _0x546b94("私信", _0x3fa405);
                  _0x34fa3d.isPrivate = true;
                  _0x45fff9(_0x51b4ae, "私信跳过 @" + _0x442df9.nickname + "：" + _0x34fa3d.dmError, "info");
                } else {
                  _0x34fa3d.dmStatus = "failed";
                  _0x34fa3d.dmError = _0x3fa405?.error || _0x3fa405?.detail || "私信发送失败";
                  _0x45fff9(_0x51b4ae, "私信失败 @" + _0x442df9.nickname + "：" + _0x34fa3d.dmError, "warning");
                }
              } else if (!_0x418cff) {
                _0x34fa3d.dmStatus = "skipped";
                _0x34fa3d.dmError = _0x1e4a3c?.filterReason || "主页目标不符合筛选条件";
                _0x45fff9(_0x51b4ae, "私信跳过 @" + (_0x442df9.nickname || "用户") + "：" + _0x34fa3d.dmError, "info");
              }
            }
          }).catch(_0x230a94 => {
            _0x45fff9(_0x51b4ae, "关注/私信子视图异常 @" + (_0x442df9.nickname || "用户") + "：" + (_0x230a94?.message || _0x230a94), "warning");
            _0x1d1883(_0x34fa3d, {
              followAllowed: _0x38d02e,
              dmAllowed: _0x2e8899,
              error: _0x230a94?.message || "子视图加载失败"
            });
          });
        }
      }
      const _0xe9f411 = _0x16672a({
        comment: _0x442df9,
        videoItem: _0x2c64e2,
        account: _0x4a2ac0,
        accountId: _0x49d081,
        taskId: _0x51b4ae,
        taskName: _0x7cd3e8,
        evaluation: _0x116973,
        matchRecord: _0x34fa3d
      });
      _0x3b385e.push(_0x34fa3d);
      _0x121d97(_0x315ad9, _0x2da441, _0x365c64);
      _0x1678a8("hit");
      _0x4c6545 += _0x5a1dc1(_0xe9f411, _0x51b4ae, _0x7cd3e8, knownUserKeySet);
    }
    if (_0x4c6545 > 0) {
      _0x45fff9(_0x51b4ae, "已实时同步 " + _0x4c6545 + " 条研判结果到线索库", "info");
    }
    _0x1678a8("batch-end");
    _0x5c93c1.newCommentsThisRound += _0x4c5e5f;
    return {
      win: _0x3dcf98,
      videoMatched: _0x523736,
      videoLikes: _0x1f0305,
      videoReplies: _0x2c495f,
      videoFollows: _0x162bc9,
      videoFollowRequests: _0x552bbf,
      videoMessages: _0x15a855,
      newCount: _0x4c5e5f,
      seededCount: _0x4a2244,
      classified: _0x2ebdff,
      evaluateFailed: false,
      stopped: !_0x4847bb()
    };
  }
  async function _0x1b47bc({
    taskId: _0x499566,
    accountId: _0x52f0fa,
    account: _0xcdc21,
    config: _0x3c604d,
    videoItem: _0x9d57a,
    videoIndex: _0x32ee95,
    videoTotal: _0x5d2183,
    accounts: _0x44a07b,
    monitorTasksApi: _0x2e920c,
    isRuntimeActive: _0x135c98,
    seenKeys: _0x42b9a6,
    updatedSeenKeys: _0x42b163,
    seenKeySet: _0x36f8b3,
    counters: _0x95c616,
    monitorTaskName: _0x12e9dc,
    win: _0x1eae60,
    seenEpoch = 0,
    knownUserKeySet = null,
    navigateMode = "load"
  }) {
    let _0x3eecf6 = _0x1eae60;
    if (!_0x135c98()) {
      return {
        win: _0x3eecf6
      };
    }
    const _0x1de79b = Date.now();
    const _0x2022d4 = "[" + (_0x32ee95 + 1) + "/" + _0x5d2183 + "]";
    let _0x179bf9 = null;
    let _0x589879 = false;
    try {
      const _0x3e2661 = _0x9d57a.url || "";
      const _0x5af49b = resolveDouyinMonitorVideoUrl(_0x3e2661);
      const _0x103bc0 = String(navigateMode || "load") === "skip";
      _0x45fff9(_0x499566, _0x103bc0 ? _0x2022d4 + " 已在目标作品，开始检索评论…" : _0x2022d4 + " 正在检索" + _0xef49b9(_0x27b958(_0x9d57a), "…"), "info");
      _0x1ffce8(_0x3eecf6);
      let _0x1f8f5c = false;
      let _0x201d2b = false;
      let _0x3a7f8d = "unavailable";
      if (_0x103bc0) {
        let _0x214a60 = null;
        try {
          _0x214a60 = await _0x14dbf9.waitVideoReady(_0x3eecf6.webContents, {
            taskId: _0x499566,
            videoUrl: _0x5af49b || _0x3e2661,
            timeoutMs: 35000
          });
        } catch (_0x156e07) {
          _0x214a60 = {
            ok: false
          };
        }
        _0x201d2b = !!_0x214a60?.unavailable;
        _0x1f8f5c = !!_0x214a60?.ok || !!_0x214a60?.ready;
        if (_0x201d2b) {
          _0x3a7f8d = _0x214a60?.reason || "unavailable";
        }
      } else {
        _0x45fff9(_0x499566, _0x2022d4 + " 正在打开指定视频（精选详情）…", "info");
        try {
          await _0xfc3a53(_0x3eecf6, _0x5af49b);
        } catch (_0x33c39a) {
          _0x45fff9(_0x499566, _0x2022d4 + " 打开视频失败：" + (_0x33c39a?.message || _0x33c39a), "warning");
        }
        _0x1ffce8(_0x3eecf6);
        await new Promise(_0x484720 => setTimeout(_0x484720, _0x369a53(_0x3eecf6) ? 350 : 700));
        let _0xcf90ca = null;
        try {
          _0xcf90ca = await _0x14dbf9.openSpecificVideo(_0x3eecf6.webContents, {
            taskId: _0x499566,
            videoUrl: _0x5af49b || _0x3e2661,
            timeoutMs: 110000
          });
        } catch (_0x2467f0) {
          _0xcf90ca = {
            ok: false,
            status: "timeout"
          };
        }
        _0x201d2b = !!_0xcf90ca?.unavailable || _0xcf90ca?.status === "unavailable";
        _0x1f8f5c = !!_0xcf90ca?.ok || !!_0xcf90ca?.ready;
        if (_0x201d2b) {
          _0x3a7f8d = _0xcf90ca?.reason || _0xcf90ca?.status || "unavailable";
        }
        if (!_0x1f8f5c && !_0x201d2b && _0x135c98()) {
          _0x45fff9(_0x499566, _0x2022d4 + " 精选未就绪，主进程再整页打开一次…", "warning");
          try {
            await _0xfc3a53(_0x3eecf6, _0x5af49b);
          } catch (_0x5b749e) {}
          _0x1ffce8(_0x3eecf6);
          await new Promise(_0x388213 => setTimeout(_0x388213, 400));
          try {
            _0xcf90ca = await _0x14dbf9.waitVideoReady(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661,
              timeoutMs: 35000
            });
          } catch (_0x58e6de) {
            _0xcf90ca = {
              ok: false,
              status: "timeout"
            };
          }
          _0x201d2b = !!_0xcf90ca?.unavailable;
          _0x1f8f5c = !!_0xcf90ca?.ok || !!_0xcf90ca?.ready;
          if (_0x201d2b) {
            _0x3a7f8d = _0xcf90ca?.reason || "unavailable";
          }
        }
      }
      if (_0x201d2b) {
        const _0x424999 = _0x48f6c2(_0x9d57a, _0x3a7f8d);
        _0x45fff9(_0x499566, _0x424999 ? _0x2022d4 + " 视频失效或无法观看，已跳过" : _0x2022d4 + " 视频暂未打开成功（" + formatMonitorInvalidReason(_0x3a7f8d) + "），本轮跳过，下轮重试", "warning");
        if (_0x424999) {
          try {
            _0x59bba9(_0x499566, _0x3c604d, _0x9d57a, _0x3a7f8d);
          } catch (_0x7b82e2) {}
        }
        return {
          win: _0x3eecf6
        };
      }
      if (!_0x1f8f5c) {
        _0x45fff9(_0x499566, _0x2022d4 + " 指定视频打开较慢仍未就绪，本轮跳过（不标记失效）", "warning");
        return {
          win: _0x3eecf6
        };
      }
      const _0x13f199 = resolveMonitorExpectedAuthor(_0x9d57a);
      if (_0x13f199.secUid) {
        _0x45fff9(_0x499566, _0x2022d4 + " 正在确认当前作品是否为目标博主…", "info");
        let _0x1034ab = {
          matched: false
        };
        try {
          _0x1034ab = await _0x14dbf9.confirmAuthor(_0x3eecf6.webContents, {
            taskId: _0x499566,
            videoUrl: _0x5af49b || _0x3e2661,
            expectedAuthorUrl: _0x13f199.url,
            expectedSecUid: _0x13f199.secUid,
            timeoutMs: 6000
          });
        } catch (_0x2d4096) {
          _0x1034ab = {
            matched: false
          };
        }
        const _0x40798d = classifyDouyinAuthorIdentity(_0x1034ab.secUid || _0x1034ab.authorUrl || _0x1034ab.pageUrl, _0x13f199.secUid || _0x13f199.url);
        if (_0x40798d.matched || _0x1034ab.matched) {
          _0x1034ab.matched = true;
          _0x1034ab.authorMismatch = false;
        } else if (_0x40798d.foreign || _0x1034ab.authorMismatch) {
          _0x1034ab.matched = false;
          _0x1034ab.authorMismatch = true;
        } else {
          _0x1034ab.matched = false;
          _0x1034ab.authorMismatch = false;
          _0x1034ab.authorUnconfirmed = true;
        }
        if (_0x1034ab.authorMismatch && _0x103bc0) {
          _0x45fff9(_0x499566, String(_0x9d57a.source || "") === "author_latest" ? _0x2022d4 + " 当前作品不是目标博主，停止本博主后续作品（不改用链接打开）" : _0x2022d4 + " 当前作品不是目标博主，改用链接打开后再确认（不采集当前页评论）", "warning");
          if (String(_0x9d57a.source || "") === "author_latest") {
            return {
              win: _0x3eecf6,
              authorMismatch: true
            };
          }
          try {
            await _0xfc3a53(_0x3eecf6, _0x5af49b);
          } catch (_0x4ec291) {}
          try {
            await _0x14dbf9.waitVideoReady(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661,
              timeoutMs: 25000
            });
          } catch (_0x3f1d81) {}
          try {
            _0x1034ab = await _0x14dbf9.confirmAuthor(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661,
              expectedAuthorUrl: _0x13f199.url,
              expectedSecUid: _0x13f199.secUid,
              timeoutMs: 6000
            });
          } catch (_0xe3f153) {
            _0x1034ab = {
              matched: false
            };
          }
          const _0x34a196 = classifyDouyinAuthorIdentity(_0x1034ab.secUid || _0x1034ab.authorUrl || _0x1034ab.pageUrl, _0x13f199.secUid || _0x13f199.url);
          if (_0x34a196.matched || _0x1034ab.matched) {
            _0x1034ab.matched = true;
            _0x1034ab.authorMismatch = false;
          } else if (_0x34a196.foreign || _0x1034ab.authorMismatch) {
            _0x1034ab.matched = false;
            _0x1034ab.authorMismatch = true;
          } else {
            _0x1034ab.matched = false;
            _0x1034ab.authorMismatch = false;
            _0x1034ab.authorUnconfirmed = true;
          }
        }
        if (_0x1034ab.authorMismatch) {
          _0x45fff9(_0x499566, _0x2022d4 + " 未对准目标博主，已跳过评论采集" + (isDouyinSecUidIdentity(_0x1034ab.secUid) ? "（当前 " + String(_0x1034ab.secUid).slice(0, 12) + "…）" : ""), "warning");
          return {
            win: _0x3eecf6,
            authorMismatch: true
          };
        }
        if (_0x1034ab.matched) {
          _0x45fff9(_0x499566, _0x2022d4 + " 已对准博主" + (_0x1034ab.nickname ? "「" + _0x1034ab.nickname + "」" : "") + "，开始采集评论", "info");
        } else {
          _0x45fff9(_0x499566, _0x2022d4 + " 页面尚未读到作者 secUid，作品来自目标主页列表，继续采集（若滑到其他博主会立即停止）", "info");
        }
      }
      if (_0x3c604d.enableVideoComment === true && _0x135c98()) {
        await _0x3dd087({
          taskId: _0x499566,
          accountId: _0x52f0fa,
          account: _0xcdc21,
          config: _0x3c604d,
          videoItem: _0x9d57a,
          videoProgressLabel: _0x2022d4,
          win: _0x3eecf6,
          isRuntimeActive: _0x135c98,
          monitorTasksApi: _0x2e920c
        });
      }
      const _0x28e1b3 = _0x3e1544(_0x3c604d);
      let _0x22688e = _0x28e1b3 && _0x4ee7d2(_0x499566, _0x3c604d, _0x52f0fa) ? _0x2a10aa : 0;
      _0x45fff9(_0x499566, _0x22688e > 0 ? _0x2022d4 + " 正在打开评论区并抓取评论（边找边互动：每露屏 " + _0x22688e + " 条即时研判互动）…" : _0x2022d4 + " 正在打开评论区并快速拉取评论…", "info");
      let _0x5ec939 = [];
      let _0x2b3b81 = null;
      let _0x50f696 = 0;
      let _0x1312a3 = 0;
      let _0x4b80ae = 0;
      let _0x22d8f0 = 0;
      let _0x14f3ea = 0;
      let _0x46b461 = 0;
      let _0x5d6e84 = 0;
      let _0x17cb59 = _0x27b958(_0x9d57a);
      let _0x5d6037 = buildMonitorSkipContext({
        config: _0x3c604d,
        accounts: _0x44a07b,
        account: _0xcdc21,
        taskId: _0x499566,
        monitorTasksApi: _0x2e920c,
        store: _0x3639c8,
        videoAuthor: _0x9d57a.author || "",
        videoAuthorUrl: _0x9d57a.authorUrl || _0x9d57a.authorProfileUrl || ""
      });
      let _0x17833f = false;
      let _0x1733bf = false;
      let _0x32aeb0 = false;
      const _0x511293 = Date.now() + _0x19e276;
      while (_0x135c98() && !_0x1733bf) {
        _0x50f696 += 1;
        if (_0x22688e > 0 && !_0x4ee7d2(_0x499566, _0x3c604d, _0x52f0fa)) {
          _0x22688e = 0;
          _0x45fff9(_0x499566, _0x2022d4 + " 互动动作已达上限或不可执行，后续改为整页快采…", "info");
        }
        const _0x17cf83 = _0x5ec939.length;
        if (_0x17833f) {
          await _0xfc3a53(_0x3eecf6, _0x5af49b);
          try {
            await _0x14dbf9.waitVideoReady(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661,
              timeoutMs: 12000
            });
          } catch (_0x2d9885) {
            await new Promise(_0x4eef8c => setTimeout(_0x4eef8c, 1200));
          }
          _0x192d35(_0x3eecf6);
          _0x17833f = false;
        }
        let _0x256b62 = await _0x4ea981({
          taskId: _0x499566,
          account: _0xcdc21,
          initialWindow: _0x3eecf6,
          videoUrl: _0x3e2661,
          loadUrl: _0x5af49b,
          videoProgressLabel: _0x2022d4,
          expectedAuthorUrl: _0x13f199.url,
          expectedSecUid: _0x13f199.secUid,
          chunkSize: _0x22688e,
          initialComments: _0x5ec939,
          initialResumeState: _0x2b3b81,
          scrapeDeadlineAt: _0x511293,
          isRuntimeActive: _0x135c98
        });
        _0x3eecf6 = _0x256b62.win;
        _0x179bf9 = _0x3eecf6;
        let _0x45dc2b = _0x256b62.result;
        if (!_0x135c98()) {
          _0x1733bf = true;
          break;
        }
        if (_0x45dc2b?.videoUnavailable) {
          const _0x37bb97 = _0x45dc2b?.unavailableReason || _0x45dc2b?.reason || "unavailable";
          const _0x363dbc = _0x48f6c2(_0x9d57a, _0x37bb97);
          _0x45fff9(_0x499566, _0x363dbc ? _0x2022d4 + " 视频失效或无法观看，已跳过" : _0x2022d4 + " 评论抓取时视频暂未就绪（" + formatMonitorInvalidReason(_0x37bb97) + "），本轮跳过，下轮重试", "warning");
          if (_0x363dbc) {
            try {
              _0x59bba9(_0x499566, _0x3c604d, _0x9d57a, _0x37bb97);
            } catch (_0x521b8f) {}
          }
          _0x1733bf = true;
          break;
        }
        const _0x5dd5d2 = !!_0x45dc2b?.needReload || !!_0x45dc2b?.videoNotReady || !!_0x45dc2b?.panelNotOpen || _0x45dc2b?.panelOpened === false && !_0x45dc2b?.success;
        if (_0x5dd5d2 && !_0x32aeb0 && _0x135c98()) {
          _0x32aeb0 = true;
          _0x45fff9(_0x499566, _0x2022d4 + " " + (_0x45dc2b?.error || "视频/评论区未就绪") + "，重新打开视频后重试…", "warning");
          _0x1ffce8(_0x3eecf6);
          try {
            await _0xfc3a53(_0x3eecf6, _0x5af49b);
            _0x1ffce8(_0x3eecf6);
            await _0x14dbf9.openSpecificVideo(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661
            });
          } catch (_0x5cffd1) {
            await new Promise(_0xc555b1 => setTimeout(_0xc555b1, 1500));
          }
          _0x256b62 = await _0x4ea981({
            taskId: _0x499566,
            account: _0xcdc21,
            initialWindow: _0x3eecf6,
            videoUrl: _0x3e2661,
            loadUrl: _0x5af49b,
            videoProgressLabel: _0x2022d4,
            expectedAuthorUrl: _0x13f199.url,
            expectedSecUid: _0x13f199.secUid,
            chunkSize: _0x22688e,
            initialComments: _0x5ec939,
            initialResumeState: null,
            scrapeDeadlineAt: _0x511293,
            isRuntimeActive: _0x135c98
          });
          _0x3eecf6 = _0x256b62.win;
          _0x179bf9 = _0x3eecf6;
          _0x45dc2b = _0x256b62.result;
          if (!_0x135c98()) {
            _0x1733bf = true;
            break;
          }
        }
        if (isMonitorScrapeIdentityMismatch(_0x45dc2b)) {
          _0x45fff9(_0x499566, _0x45dc2b?.authorMismatch ? _0x2022d4 + " 采集中发现当前不是目标博主，正在重新打开目标作品（已丢弃本页评论）…" : "检测到视频已自动跳转，正在重新加载目标视频…", "warning");
          await _0xfc3a53(_0x3eecf6, _0x5af49b);
          try {
            await _0x14dbf9.waitVideoReady(_0x3eecf6.webContents, {
              taskId: _0x499566,
              videoUrl: _0x5af49b || _0x3e2661,
              timeoutMs: 25000
            });
          } catch (_0x3e2311) {
            await new Promise(_0x4bf570 => setTimeout(_0x4bf570, 1500));
          }
          if (_0x13f199.secUid) {
            let _0x30038b = {
              matched: false
            };
            try {
              _0x30038b = await _0x14dbf9.confirmAuthor(_0x3eecf6.webContents, {
                taskId: _0x499566,
                videoUrl: _0x5af49b || _0x3e2661,
                expectedAuthorUrl: _0x13f199.url,
                expectedSecUid: _0x13f199.secUid,
                timeoutMs: 6000
              });
            } catch (_0x26e112) {
              _0x30038b = {
                matched: false
              };
            }
            if (!_0x30038b.matched) {
              _0x45fff9(_0x499566, _0x2022d4 + " 重开后仍未对准目标博主，已跳过评论采集", "warning");
              _0x1733bf = true;
              _0x589879 = true;
              break;
            }
          }
          _0x256b62 = await _0x4ea981({
            taskId: _0x499566,
            account: _0xcdc21,
            initialWindow: _0x3eecf6,
            videoUrl: _0x3e2661,
            loadUrl: _0x5af49b,
            videoProgressLabel: _0x2022d4,
            expectedAuthorUrl: _0x13f199.url,
            expectedSecUid: _0x13f199.secUid,
            chunkSize: _0x22688e,
            initialComments: _0x5ec939,
            initialResumeState: _0x2b3b81,
            scrapeDeadlineAt: _0x511293,
            isRuntimeActive: _0x135c98
          });
          _0x3eecf6 = _0x256b62.win;
          _0x179bf9 = _0x3eecf6;
          _0x45dc2b = _0x256b62.result;
          if (!_0x135c98()) {
            _0x1733bf = true;
            break;
          }
        }
        if (isMonitorScrapeIdentityMismatch(_0x45dc2b)) {
          _0x45fff9(_0x499566, _0x45dc2b?.authorMismatch ? _0xef49b9(_0x27b958(_0x9d57a, _0x45dc2b)) + " 当前不是目标博主，已跳过（未采集评论）" : _0xef49b9(_0x27b958(_0x9d57a, _0x45dc2b)) + " 视频已漂移，已跳过（请检查链接是否为短视频连播页）", "warning");
          _0x1733bf = true;
          _0x589879 = !!_0x45dc2b?.authorMismatch;
          break;
        }
        if (_0x45dc2b?.videoUrl && !isSameMonitorVideo(_0x3e2661, _0x45dc2b.videoUrl)) {
          _0x45fff9(_0x499566, _0xef49b9(_0x27b958(_0x9d57a, _0x45dc2b)) + " 当前页面与配置视频不一致，已跳过", "warning");
          _0x1733bf = true;
          break;
        }
        const _0x2398d1 = _0x45dc2b?.success && Array.isArray(_0x45dc2b.comments) && _0x45dc2b.comments.length === 0 && _0x5ec939.length === 0 && Number(_0x45dc2b.totalCount) > 10;
        if (_0x2398d1 && !_0x32aeb0 && _0x135c98()) {
          _0x32aeb0 = true;
          _0x45fff9(_0x499566, _0x2022d4 + " 评论总数 " + (_0x45dc2b.totalCount || "未知") + " 但未抓到评论，唤醒后台页面重试一次…", "warning");
          const _0x55c2c3 = _0x1b311a(_0x3eecf6);
          try {
            await new Promise(_0x3e2b56 => setTimeout(_0x3e2b56, _0x369a53(_0x3eecf6) ? 900 : 1200));
            _0x256b62 = await _0x4ea981({
              taskId: _0x499566,
              account: _0xcdc21,
              initialWindow: _0x3eecf6,
              videoUrl: _0x3e2661,
              loadUrl: _0x5af49b,
              videoProgressLabel: _0x2022d4,
              expectedAuthorUrl: _0x13f199.url,
              expectedSecUid: _0x13f199.secUid,
              chunkSize: _0x22688e,
              initialComments: _0x5ec939,
              initialResumeState: null,
              scrapeDeadlineAt: _0x511293,
              isRuntimeActive: _0x135c98
            });
            _0x3eecf6 = _0x256b62.win;
            _0x179bf9 = _0x3eecf6;
            _0x45dc2b = _0x256b62.result;
          } finally {
            try {
              _0x55c2c3();
            } catch (_0x562382) {}
            _0x192d35(_0x3eecf6);
          }
          if (!_0x135c98()) {
            _0x1733bf = true;
            break;
          }
          const _0x1f89f6 = Array.isArray(_0x45dc2b?.comments) ? _0x45dc2b.comments.length : 0;
          _0x45fff9(_0x499566, _0x1f89f6 > 0 ? _0x2022d4 + " 唤醒重试后抓到 " + _0x1f89f6 + " 条评论" : _0x2022d4 + " 唤醒重试后仍未抓到评论，按无评论继续", _0x1f89f6 > 0 ? "success" : "warning");
        }
        if (!_0x45dc2b?.success || !Array.isArray(_0x45dc2b.comments)) {
          _0x45fff9(_0x499566, _0xef49b9(_0x27b958(_0x9d57a, _0x45dc2b)) + " 检查失败：" + (_0x45dc2b?.error || "未获取到评论列表"), "warning");
          if (_0x446e66.has(_0x45dc2b?.errorCode)) {
            const _0x2dd0c1 = _0x45dc2b.errorCode || "unknown";
            const _0x1d8ba1 = Number(_0x45dc2b.elapsedMs) > 0 ? "，已等待 " + _0x310e3b(_0x45dc2b.elapsedMs) : "";
            _0x45fff9(_0x499566, "账号 " + (_0xcdc21.nickname || _0xcdc21.name || _0x52f0fa) + " 的后台监控页未按时返回（" + _0x2dd0c1 + _0x1d8ba1 + "），正在释放该渲染进程并重建；任务会继续检查下一个视频", "warning");
            if (_0x135c98()) {
              _0x3eecf6 = await _0x316536(_0x52f0fa, _0xcdc21.proxy, _0x3eecf6, _0x499566);
            }
          }
          _0x1733bf = true;
          break;
        }
        if (_0x45dc2b.partialDueToDeadline) {
          _0x45fff9(_0x499566, "评论页面已达到 " + Math.round(_0x19e276 / 1000) + " 秒期限，已保留并继续研判当前抓到的评论", "warning");
        } else if (_0x50f696 === 1 && Number(_0x45dc2b.elapsedMs) >= 45000 && !_0x45dc2b.partialChunk) {
          _0x45fff9(_0x499566, "本次评论抓取耗时 " + Math.round(_0x45dc2b.elapsedMs / 1000) + " 秒，页面响应偏慢但已完成", "warning");
        }
        _0x5ec939 = Array.isArray(_0x45dc2b.comments) ? _0x45dc2b.comments : _0x5ec939;
        _0x2b3b81 = _0x45dc2b.resumeState || _0x2b3b81;
        const _0x4079c3 = _0x5ec939.slice(_0x17cf83);
        const _0x3b4731 = !!_0x45dc2b.partialChunk;
        _0x17cb59 = _0x27b958(_0x9d57a, _0x45dc2b);
        if (_0x45dc2b.videoTitle && _0x45dc2b.videoTitle.trim()) {
          _0x9d57a.title = _0x45dc2b.videoTitle.trim();
        }
        if (_0x45dc2b.videoAuthor && _0x45dc2b.videoAuthor.trim()) {
          _0x9d57a.author = _0x45dc2b.videoAuthor.trim();
        }
        if (_0x45dc2b.videoAuthorUrl && _0x45dc2b.videoAuthorUrl.trim()) {
          const _0x45f6c9 = _0x45dc2b.videoAuthorUrl.trim();
          if (!_0x13f199.secUid || isSameDouyinAuthorIdentity(_0x45f6c9, _0x13f199.secUid)) {
            _0x9d57a.authorUrl = _0x45f6c9;
          }
        }
        _0x5d6037 = buildMonitorSkipContext({
          config: _0x3c604d,
          accounts: _0x44a07b,
          account: _0xcdc21,
          taskId: _0x499566,
          monitorTasksApi: _0x2e920c,
          store: _0x3639c8,
          videoAuthor: _0x45dc2b.videoAuthor || _0x9d57a.author || "",
          videoAuthorUrl: _0x45dc2b.videoAuthorUrl || _0x9d57a.authorUrl || _0x9d57a.authorProfileUrl || ""
        });
        if (_0x50f696 === 1) {
          const _0x1c6397 = resolveMonitorCommentWindowMinutes({
            commentWindowMinutes: _0x3c604d.commentWindowMinutes
          });
          _0x45fff9(_0x499566, "[任务判定条件] 时间范围: " + _0x1c6397 + " 分钟 | AI判定: " + (_0x3c604d.useAiJudge ? "开启" : "关闭") + " | 关键词: \"" + (_0x3c604d.keywords || "留空(全部匹配)") + "\" | 排除关键词: \"" + (_0x3c604d.excludeCommentKeywords || "无") + "\" | 视频作者: \"" + (_0x45dc2b.videoAuthor || _0x9d57a.author || "未识别") + "\"", "info");
          _0x45fff9(_0x499566, "[排除名单] 配置排除：" + formatExcludeCommentersForLog(_0x5d6037) + "｜自动排除执行账号：" + formatOperatorAccountsForLog(_0x5d6037), "info");
        }
        if (_0x4079c3.length === 0) {
          if (!_0x3b4731) {
            _0x45fff9(_0x499566, _0x2022d4 + " " + _0xef49b9(_0x17cb59) + " 无新增评论，已到底", "info");
            break;
          }
          continue;
        }
        const _0x5f334d = "本批#" + _0x50f696;
        const _0x737fb0 = await _0x2c2c01({
          taskId: _0x499566,
          accountId: _0x52f0fa,
          account: _0xcdc21,
          config: _0x3c604d,
          videoItem: _0x9d57a,
          batchComments: _0x4079c3,
          win: _0x3eecf6,
          seenKeys: _0x42b9a6,
          updatedSeenKeys: _0x42b163,
          seenKeySet: _0x36f8b3,
          skipContext: _0x5d6037,
          monitorTaskName: _0x12e9dc,
          monitorTasksApi: _0x2e920c,
          isRuntimeActive: _0x135c98,
          videoProgressLabel: _0x2022d4,
          videoCtx: _0x17cb59,
          batchLabel: _0x5f334d,
          accumulatedCount: _0x5ec939.length,
          videoStartedAt: _0x1de79b,
          counters: _0x95c616,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet
        });
        _0x3eecf6 = _0x737fb0.win || _0x3eecf6;
        _0x1312a3 += _0x737fb0.videoMatched || 0;
        _0x4b80ae += _0x737fb0.videoLikes || 0;
        _0x22d8f0 += _0x737fb0.videoReplies || 0;
        _0x14f3ea += _0x737fb0.videoFollows || 0;
        _0x46b461 += _0x737fb0.videoFollowRequests || 0;
        _0x5d6e84 += _0x737fb0.videoMessages || 0;
        if (_0x3b4731 && _0x3eecf6 && !_0x3eecf6.isDestroyed()) {
          try {
            const _0x2cb81f = _0x3eecf6.webContents?.getURL?.() || "";
            _0x17833f = !isSameMonitorVideo(_0x3e2661, _0x2cb81f);
          } catch (_0x114379) {
            _0x17833f = true;
          }
        }
        const _0x28ed07 = _0x3b4731 ? "，继续抓取" : "，已到底";
        _0x45fff9(_0x499566, _0x2022d4 + " " + _0x5f334d + "：新增 " + _0x4079c3.length + "，命中 " + (_0x737fb0.videoMatched || 0) + ("，点赞 " + (_0x737fb0.videoLikes || 0) + "，回复 " + (_0x737fb0.videoReplies || 0)) + ("，关注 " + (_0x737fb0.videoFollows || 0) + "，私信 " + (_0x737fb0.videoMessages || 0) + _0x28ed07), (_0x737fb0.videoMatched || 0) > 0 ? "success" : "info");
        if (_0x737fb0.evaluateFailed || _0x737fb0.stopped || !_0x135c98()) {
          _0x1733bf = true;
          break;
        }
        if (!_0x3b4731) {
          break;
        }
      }
      if (!_0x1733bf) {
        _0x45fff9(_0x499566, _0x2022d4 + " " + _0xef49b9(_0x17cb59) + " 本视频完成：命中 " + _0x1312a3 + "，点赞 " + _0x4b80ae + "，回复 " + _0x22d8f0 + ("，关注 " + _0x14f3ea + "，关注待通过 " + _0x46b461 + "，私信 " + _0x5d6e84) + ("，累计评论 " + _0x5ec939.length + "，本视频总耗时 " + _0x310e3b(Date.now() - _0x1de79b)), "info");
        _0x332f4d(_0x499566, _0x9d57a.url);
      }
    } catch (_0x457ead) {
      _0x45fff9(_0x499566, _0x2022d4 + " 视频检查异常（已耗时 " + _0x310e3b(Date.now() - _0x1de79b) + "）：" + _0x457ead.message, "error");
      if (_0x135c98() && (_0x457ead?.code === "monitor_navigation_timeout" || _0x457ead?.code === "monitor_renderer_unhealthy" || _0x3eecf6?.isDestroyed?.())) {
        _0x45fff9(_0x499566, "监控页面加载异常，正在重建后台窗口后继续", "warning");
        try {
          _0x3eecf6 = await _0x316536(_0x52f0fa, _0xcdc21.proxy, _0x3eecf6, _0x499566);
        } catch (_0x1e8725) {
          _0x45fff9(_0x499566, "后台窗口重建失败：" + _0x1e8725.message, "error");
        }
      }
    } finally {
      if (_0x135c98() && _0x3eecf6 === _0x179bf9 && _0x3eecf6 && !_0x3eecf6.isDestroyed()) {
        _0x3eecf6.__radarMonitorProcessedVideos = Number(_0x3eecf6.__radarMonitorProcessedVideos || 0) + 1;
        const _0x3e85a1 = _0x5e9015(_0x3eecf6);
        const _0x2e2fbd = _0x3eecf6.__radarMonitorUnhealthy ? "渲染进程状态异常" : _0x3e85a1 >= _0x494f62 ? "渲染内存 " + _0x3e85a1 + "MB" : _0x3eecf6.__radarMonitorProcessedVideos >= _0x934cfd ? "已连续处理 " + _0x3eecf6.__radarMonitorProcessedVideos + " 个视频" : "";
        if (_0x2e2fbd) {
          _0x45fff9(_0x499566, "设备降载保护：" + _0x2e2fbd + "，正在轮换后台页面后继续（登录状态保留）", "info");
          try {
            _0x3eecf6 = await _0x316536(_0x52f0fa, _0xcdc21.proxy, _0x3eecf6, _0x499566);
          } catch (_0x2d81dd) {
            _0x45fff9(_0x499566, "后台页面轮换失败：" + _0x2d81dd.message, "warning");
          }
        }
      }
    }
    return {
      win: _0x3eecf6,
      authorMismatch: _0x589879
    };
  }
  async function _0x25661f({
    taskId: _0x992d29,
    accountId: _0x568908,
    config: _0x2a2349,
    accounts: _0xeba575,
    monitorTasksApi: _0x1bcaeb,
    isRuntimeActive: _0xf5ec6d,
    claimNextWork: _0x40f5f0,
    workTotal: _0x53a19d,
    seenKeys: _0x254419,
    updatedSeenKeys: _0x42de1e,
    seenKeySet: _0x35efde,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const _0x6c63d4 = _0xeba575.find(_0x1ed87e => String(_0x1ed87e.id) === String(_0x568908));
    if (!_0x6c63d4) {
      return null;
    }
    const _0x532b69 = _0x21e6e0.get(_0x992d29);
    const _0x467d6d = _0x532b69?.currentAccountId;
    if (_0x532b69) {
      _0x532b69.currentAccountId = String(_0x568908);
    }
    try {
      return await _0x32146c({
        taskId: _0x992d29,
        accountId: _0x568908,
        account: _0x6c63d4,
        config: _0x2a2349,
        accounts: _0xeba575,
        monitorTasksApi: _0x1bcaeb,
        isRuntimeActive: _0xf5ec6d,
        claimNextWork: _0x40f5f0,
        workTotal: _0x53a19d,
        seenKeys: _0x254419,
        updatedSeenKeys: _0x42de1e,
        seenKeySet: _0x35efde,
        seenEpoch: seenEpoch,
        knownUserKeySet: knownUserKeySet
      });
    } finally {
      if (_0x532b69) {
        if (_0x467d6d != null) {
          _0x532b69.currentAccountId = _0x467d6d;
        } else {
          delete _0x532b69.currentAccountId;
        }
      }
    }
  }
  async function _0x32146c({
    taskId: _0x5d78ba,
    accountId: _0x25d85d,
    account: _0x44e29e,
    config: _0x266959,
    accounts: _0x4a8a1b,
    monitorTasksApi: _0x1dced2,
    isRuntimeActive: _0x3b0c7d,
    claimNextWork: _0x35bf5f,
    workTotal: _0x2e213f,
    seenKeys: _0x2de80d,
    updatedSeenKeys: _0x92ad89,
    seenKeySet: _0x3da9c9,
    seenEpoch = 0,
    knownUserKeySet = null
  }) {
    const _0x617b92 = {
      matchedCount: 0,
      likeCount: 0,
      replyCount: 0,
      followCount: 0,
      followRequestCount: 0,
      messageCount: 0,
      newCommentsThisRound: 0,
      newWorks: 0
    };
    _0x45fff9(_0x5d78ba, "账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 参与抢活（池内 " + _0x2e213f + " 项：视频/主页）；意向判定：" + _0xb69888(_0x266959, _0x25d85d), "info", {
      accountId: _0x25d85d
    });
    const _0x36a256 = _0x21082b(_0x5d78ba, _0x1dced2);
    let _0x56c0b3 = 0;
    let _0x3b5133 = 0;
    let _0x2f6cfc = 0;
    while (_0x3b0c7d()) {
      const _0x2160e0 = _0x35bf5f();
      if (!_0x2160e0) {
        _0x45fff9(_0x5d78ba, _0x56c0b3 > 0 ? "本轮任务池已空，账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 收工（已领取 " + _0x56c0b3 + " 项）" : "本轮任务池已空，账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 收工", "info", {
          accountId: _0x25d85d
        });
        break;
      }
      _0x56c0b3 += 1;
      if (_0x2160e0.type === "author") {
        _0x2f6cfc += 1;
        const {
          authorItem: _0x5a9f4e,
          authorIndex: _0x1b5b0d,
          authorTotal: _0x35acbd
        } = _0x2160e0;
        _0x45fff9(_0x5d78ba, "账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 领取主播主页 [" + (_0x1b5b0d + 1) + "/" + _0x35acbd + "] " + (_0x5a9f4e.name || _0x5a9f4e.url), "info", {
          accountId: _0x25d85d
        });
        const _0x1d2e99 = await _0x11cdd6(_0x25d85d, _0x5d78ba, async () => {
          let _0x1f5577 = await _0x36b772(_0x25d85d, _0x44e29e.proxy, _0x5d78ba);
          return _0x5cfe68({
            taskId: _0x5d78ba,
            accountId: _0x25d85d,
            account: _0x44e29e,
            authorItem: _0x5a9f4e,
            authorIndex: _0x1b5b0d,
            authorTotal: _0x35acbd,
            config: _0x266959,
            accounts: _0x4a8a1b,
            monitorTasksApi: _0x1dced2,
            isRuntimeActive: _0x3b0c7d,
            seenKeys: _0x2de80d,
            updatedSeenKeys: _0x92ad89,
            seenKeySet: _0x3da9c9,
            counters: _0x617b92,
            monitorTaskName: _0x36a256,
            win: _0x1f5577,
            seenEpoch: seenEpoch,
            knownUserKeySet: knownUserKeySet
          });
        }, _0x3b0c7d);
        _0x617b92.newWorks += Number(_0x1d2e99?.discovered) || 0;
        continue;
      }
      _0x3b5133 += 1;
      const {
        videoItem: _0xa3ac5f,
        videoIndex: _0x33a4b8,
        videoTotal: _0x1f4ea8
      } = _0x2160e0;
      _0x45fff9(_0x5d78ba, "账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 领取视频 [" + (_0x33a4b8 + 1) + "/" + _0x1f4ea8 + "] " + _0xef49b9(_0x27b958(_0xa3ac5f), "…"), "info", {
        accountId: _0x25d85d
      });
      await _0x11cdd6(_0x25d85d, _0x5d78ba, async () => {
        let _0x1dd55b = await _0x36b772(_0x25d85d, _0x44e29e.proxy, _0x5d78ba);
        return _0x1b47bc({
          taskId: _0x5d78ba,
          accountId: _0x25d85d,
          account: _0x44e29e,
          config: _0x266959,
          videoItem: _0xa3ac5f,
          videoIndex: _0x33a4b8,
          videoTotal: _0x1f4ea8,
          accounts: _0x4a8a1b,
          monitorTasksApi: _0x1dced2,
          isRuntimeActive: _0x3b0c7d,
          seenKeys: _0x2de80d,
          updatedSeenKeys: _0x92ad89,
          seenKeySet: _0x3da9c9,
          counters: _0x617b92,
          monitorTaskName: _0x36a256,
          win: _0x1dd55b,
          seenEpoch: seenEpoch,
          knownUserKeySet: knownUserKeySet
        });
      }, _0x3b0c7d);
    }
    if (_0x56c0b3 > 0) {
      _0x1dced2.incrementStats(_0x5d78ba, {
        checks: 1,
        newComments: _0x617b92.newCommentsThisRound,
        commentsTotal: _0x617b92.newCommentsThisRound,
        matched: _0x617b92.matchedCount,
        likes: _0x617b92.likeCount,
        replies: _0x617b92.replyCount,
        follows: _0x617b92.followCount,
        followRequests: _0x617b92.followRequestCount,
        messages: _0x617b92.messageCount,
        lastCycleAt: Date.now(),
        lastCycleComments: _0x617b92.newCommentsThisRound
      });
      _0x45fff9(_0x5d78ba, "账号 " + (_0x44e29e.nickname || _0x44e29e.name) + " 本轮完成：领取 " + _0x56c0b3 + " 项（视频 " + _0x3b5133 + " · 主页 " + _0x2f6cfc + "），新评论 " + _0x617b92.newCommentsThisRound + " 条，命中 " + _0x617b92.matchedCount + "，点赞 " + _0x617b92.likeCount + "，回复 " + _0x617b92.replyCount + "，关注 " + _0x617b92.followCount + "，关注待通过 " + _0x617b92.followRequestCount + "，私信 " + _0x617b92.messageCount, _0x617b92.newCommentsThisRound > 0 || _0x617b92.matchedCount > 0 ? "success" : "info", {
        accountId: _0x25d85d
      });
      _0x5eacfc(_0x5d78ba, {
        type: "stats-update",
        accountId: _0x25d85d,
        statsDelta: {
          checks: 1,
          newComments: _0x617b92.newCommentsThisRound,
          commentsTotal: _0x617b92.newCommentsThisRound,
          matched: _0x617b92.matchedCount,
          likes: _0x617b92.likeCount,
          replies: _0x617b92.replyCount,
          follows: _0x617b92.followCount,
          followRequests: _0x617b92.followRequestCount,
          messages: _0x617b92.messageCount,
          lastCycleComments: _0x617b92.newCommentsThisRound,
          lastCycleAt: Date.now()
        },
        ts: Date.now()
      });
    }
    return {
      commentsScanned: _0x617b92.newCommentsThisRound,
      matchedCount: _0x617b92.matchedCount,
      likeCount: _0x617b92.likeCount,
      replyCount: _0x617b92.replyCount,
      followCount: _0x617b92.followCount,
      followRequestCount: _0x617b92.followRequestCount,
      messageCount: _0x617b92.messageCount,
      newWorks: _0x617b92.newWorks,
      claimedCount: _0x56c0b3,
      claimedVideos: _0x3b5133,
      claimedAuthors: _0x2f6cfc
    };
  }
  function _0x408d52(_0x10d5fc = {}) {
    const _0x2e64a2 = {
      ..._0x10d5fc
    };
    if (!Array.isArray(_0x2e64a2.videoUrls)) {
      _0x2e64a2.videoUrls = [];
    }
    if (!Array.isArray(_0x2e64a2.authorUrls)) {
      _0x2e64a2.authorUrls = [];
    }
    if (!Array.isArray(_0x2e64a2.selectedAccounts)) {
      _0x2e64a2.selectedAccounts = [];
    }
    const _0x274ebe = Array.isArray(_0x2e64a2.monitorTargetTypes) ? _0x2e64a2.monitorTargetTypes.filter(_0x3d5ac1 => _0x3d5ac1 === "video" || _0x3d5ac1 === "author") : [];
    const _0x12ae91 = new Set();
    if (_0x274ebe.length > 0) {
      _0x274ebe.forEach(_0x3e6d05 => _0x12ae91.add(_0x3e6d05));
    } else {
      if ((_0x2e64a2.videoUrls || []).some(_0x2e1ee8 => _0x2e1ee8?.url)) {
        _0x12ae91.add("video");
      }
      if ((_0x2e64a2.authorUrls || []).some(_0x2b5b89 => _0x2b5b89?.url)) {
        _0x12ae91.add("author");
      }
      if (_0x12ae91.size === 0) {
        _0x12ae91.add("video");
      }
    }
    _0x2e64a2.monitorTargetTypes = [..._0x12ae91];
    for (const _0x30324d of MONITOR_ACTION_LIMIT_SPECS) {
      _0x2e64a2[_0x30324d.enabledField] = _0x2e64a2[_0x30324d.enabledField] === true;
      let _0x239903 = Number(_0x2e64a2[_0x30324d.minField]);
      let _0x336798 = Number(_0x2e64a2[_0x30324d.maxField]);
      if (!Number.isFinite(_0x239903)) {
        _0x239903 = 10;
      }
      if (!Number.isFinite(_0x336798)) {
        _0x336798 = 20;
      }
      _0x239903 = Math.max(1, Math.min(10000, Math.floor(_0x239903)));
      _0x336798 = Math.max(1, Math.min(10000, Math.floor(_0x336798)));
      if (_0x239903 > _0x336798) {
        [_0x239903, _0x336798] = [_0x336798, _0x239903];
      }
      _0x2e64a2[_0x30324d.minField] = _0x239903;
      _0x2e64a2[_0x30324d.maxField] = _0x336798;
    }
    _0x2e64a2.profileActionGenderFilter = normalizeGenderFilter(_0x2e64a2.profileActionGenderFilter, "all");
    _0x2e64a2.profileActionAgeFilterEnabled = _0x2e64a2.profileActionAgeFilterEnabled === true;
    let _0x569108 = Number(_0x2e64a2.profileActionAgeMin);
    let _0x566ec4 = Number(_0x2e64a2.profileActionAgeMax);
    if (!Number.isFinite(_0x569108)) {
      _0x569108 = 0;
    }
    if (!Number.isFinite(_0x566ec4)) {
      _0x566ec4 = 50;
    }
    _0x569108 = Math.max(0, Math.min(120, Math.floor(_0x569108)));
    _0x566ec4 = Math.max(0, Math.min(120, Math.floor(_0x566ec4)));
    if (_0x569108 > _0x566ec4) {
      [_0x569108, _0x566ec4] = [_0x566ec4, _0x569108];
    }
    _0x2e64a2.profileActionAgeMin = _0x569108;
    _0x2e64a2.profileActionAgeMax = _0x566ec4;
    _0x2e64a2.enableVideoComment = _0x2e64a2.enableVideoComment === true;
    _0x2e64a2.videoCommentMode = _0x2e64a2.videoCommentMode === "custom" ? "custom" : "ai";
    _0x2e64a2.videoCommentContent = String(_0x2e64a2.videoCommentContent || "");
    _0x2e64a2.videoCommentUseRandomSuffix = _0x2e64a2.videoCommentUseRandomSuffix === true;
    _0x2e64a2.enableVideoCommentWithoutText = _0x2e64a2.enableVideoCommentWithoutText === true;
    _0x2e64a2.enableVideoCommentImage = _0x2e64a2.enableVideoCommentImage === true;
    _0x2e64a2.enableVideoCommentExpression = _0x2e64a2.enableVideoCommentExpression === true;
    _0x2e64a2.enableVideoCommentMention = _0x2e64a2.enableVideoCommentMention === true;
    if (!Array.isArray(_0x2e64a2.videoCommentImagePaths)) {
      _0x2e64a2.videoCommentImagePaths = [];
    }
    {
      let _0x277436 = Number(_0x2e64a2.videoCommentExpressionCount);
      if (!Number.isFinite(_0x277436)) {
        _0x277436 = 3;
      }
      _0x2e64a2.videoCommentExpressionCount = Math.max(1, Math.min(8, Math.floor(_0x277436)));
    }
    {
      const _0x5c052e = Number(_0x2e64a2.videoCommentAttachmentPercent);
      _0x2e64a2.videoCommentAttachmentPercent = Number.isFinite(_0x5c052e) ? Math.max(0, Math.min(100, Math.round(_0x5c052e))) : 20;
    }
    _0x2e64a2.videoCommentMentionPosition = _0x2e64a2.videoCommentMentionPosition === "after" ? "after" : "before";
    {
      const _0x457c97 = Number(_0x2e64a2.videoCommentMentionPercent);
      _0x2e64a2.videoCommentMentionPercent = Number.isFinite(_0x457c97) ? Math.max(0, Math.min(100, Math.round(_0x457c97))) : 100;
    }
    _0x2e64a2.commentOnProfileFirstWork = _0x2e64a2.commentOnProfileFirstWork === true;
    if (!["reply", "skip"].includes(_0x2e64a2.profileFirstCommentFallbackMode)) {
      _0x2e64a2.profileFirstCommentFallbackMode = "reply";
    }
    const _0x327e39 = Number(_0x2e64a2.profileFirstWorkLikePercent);
    _0x2e64a2.profileFirstWorkLikePercent = Number.isFinite(_0x327e39) ? Math.max(0, Math.min(100, Math.round(_0x327e39))) : 10;
    const _0x20f7fa = Number(_0x2e64a2.profileFirstWorkCollectPercent);
    _0x2e64a2.profileFirstWorkCollectPercent = Number.isFinite(_0x20f7fa) ? Math.max(0, Math.min(100, Math.round(_0x20f7fa))) : 10;
    _0x2e64a2.profileFirstGenderFilter = normalizeGenderFilter(_0x2e64a2.profileFirstGenderFilter, "all");
    _0x2e64a2.profileFirstAgeFilterEnabled = _0x2e64a2.profileFirstAgeFilterEnabled === true;
    let _0x5edfe1 = Number(_0x2e64a2.profileFirstAgeMin);
    let _0x134bf9 = Number(_0x2e64a2.profileFirstAgeMax);
    if (!Number.isFinite(_0x5edfe1)) {
      _0x5edfe1 = 0;
    }
    if (!Number.isFinite(_0x134bf9)) {
      _0x134bf9 = 50;
    }
    _0x5edfe1 = Math.max(0, Math.min(120, Math.floor(_0x5edfe1)));
    _0x134bf9 = Math.max(0, Math.min(120, Math.floor(_0x134bf9)));
    if (_0x5edfe1 > _0x134bf9) {
      [_0x5edfe1, _0x134bf9] = [_0x134bf9, _0x5edfe1];
    }
    _0x2e64a2.profileFirstAgeMin = _0x5edfe1;
    _0x2e64a2.profileFirstAgeMax = _0x134bf9;
    _0x2e64a2.commentUseRandomSuffix = _0x2e64a2.commentUseRandomSuffix === true;
    _0x2e64a2.enableCommentWithoutText = _0x2e64a2.enableCommentWithoutText === true;
    _0x2e64a2.enableCommentImage = _0x2e64a2.enableCommentImage === true;
    _0x2e64a2.enableCommentExpression = _0x2e64a2.enableCommentExpression === true;
    _0x2e64a2.enableCommentMention = _0x2e64a2.enableCommentMention === true;
    if (!Array.isArray(_0x2e64a2.commentImagePaths)) {
      const _0x1151d1 = String(_0x2e64a2.commentImagePath || "").trim();
      _0x2e64a2.commentImagePaths = _0x1151d1 ? [_0x1151d1] : [];
    }
    let _0x55d493 = Number(_0x2e64a2.commentExpressionCount);
    if (!Number.isFinite(_0x55d493)) {
      _0x55d493 = 3;
    }
    _0x2e64a2.commentExpressionCount = Math.max(1, Math.min(8, Math.floor(_0x55d493)));
    if (Object.prototype.hasOwnProperty.call(_0x10d5fc || {}, "commentAttachmentPercent")) {
      const _0x4c82b1 = Number(_0x2e64a2.commentAttachmentPercent);
      _0x2e64a2.commentAttachmentPercent = Number.isFinite(_0x4c82b1) ? Math.max(0, Math.min(100, Math.round(_0x4c82b1))) : 20;
    } else if (_0x2e64a2.enableCommentImage === true || _0x2e64a2.enableCommentExpression === true || _0x2e64a2.enableCommentMention === true) {
      _0x2e64a2.commentAttachmentPercent = 100;
    } else {
      _0x2e64a2.commentAttachmentPercent = 20;
    }
    _0x2e64a2.commentMentionPosition = _0x2e64a2.commentMentionPosition === "after" ? "after" : "before";
    {
      const _0x5a5082 = Number(_0x2e64a2.commentMentionPercent);
      _0x2e64a2.commentMentionPercent = Number.isFinite(_0x5a5082) ? Math.max(0, Math.min(100, Math.round(_0x5a5082))) : 100;
    }
    _0x2e64a2.actionCountAutoResetEnabled = _0x2e64a2.actionCountAutoResetEnabled === true;
    _0x2e64a2.actionCountAutoResetTime = normalizeActionCountResetTime(_0x2e64a2.actionCountAutoResetTime, "00:00");
    return _0x2e64a2;
  }
  async function _0x558e6c(_0x1f6e59) {
    const _0x493afb = _0x21e6e0.get(_0x1f6e59);
    if (!_0x493afb || _0x493afb.running) {
      return;
    }
    const _0x2404d8 = () => _0x21e6e0.get(_0x1f6e59) === _0x493afb;
    _0x493afb.running = true;
    const _0x473169 = Date.now();
    let _0x3152df = null;
    let _0x28fe1a = "done";
    let _0x163362 = 1;
    let _0x295024 = 0;
    let _0x39d654 = 0;
    let _0x2c8754 = 0;
    let _0x4e091c = 0;
    let _0x523c56 = 0;
    let _0xa14874 = 0;
    let _0x34b267 = 0;
    let _0x3f6eff = 0;
    try {
      const {
        accounts: _0x1ba116
      } = _0x493afb;
      _0x493afb.config = _0x408d52(_0x493afb.config);
      const _0x37bf47 = _0x493afb.config;
      const _0x4bc40d = _0x37bf47.selectedAccounts || [];
      try {
        const _0x188688 = _0x493afb.monitorTasksApi.beginCycle(_0x1f6e59, {
          startedAt: _0x473169
        });
        _0x3152df = _0x188688?.cycles?.[0]?.id || null;
        _0x163362 = Number(_0x188688?.cycles?.[0]?.round) || 1;
        _0x493afb.currentCycleId = _0x3152df;
        _0x5eacfc(_0x1f6e59, {
          type: "cycle-start",
          ts: _0x473169,
          cycleId: _0x3152df
        });
      } catch (_0x2f6358) {}
      const _0x5bcb5f = (_0x37bf47.monitorTargetTypes || []).includes("video");
      const _0x587613 = (_0x37bf47.monitorTargetTypes || []).includes("author");
      const _0x4b7745 = _0x5bcb5f ? (Array.isArray(_0x37bf47.videoUrls) ? _0x37bf47.videoUrls : []).filter(_0x7073f6 => _0x7073f6?.url && String(_0x7073f6.source || "") !== "author_latest") : [];
      const _0x2e0ee6 = _0x4b7745.filter(_0x521a85 => isMonitorVideoUrlInvalid(_0x521a85)).length;
      const _0x50b87e = _0x4b7745.length - _0x2e0ee6;
      const _0x30c1d5 = _0x587613 ? (_0x37bf47.authorUrls || []).filter(_0x460c2b => _0x460c2b?.url) : [];
      const _0x4d97f7 = _0x30c1d5.filter(_0x39469b => isMonitorAuthorUrlInvalid(_0x39469b)).length;
      const _0x40206a = _0x30c1d5.length - _0x4d97f7;
      _0x45fff9(_0x1f6e59, "开始第 " + _0x163362 + " 轮轮询（指定视频 " + _0x50b87e + ("" + (_0x2e0ee6 > 0 ? "，失效跳过 " + _0x2e0ee6 : "")) + (" · 主播主页 " + _0x40206a) + ("" + (_0x4d97f7 > 0 ? "，主页失效跳过 " + _0x4d97f7 : "")) + "；主页领取后当场处理最新作品）", "info");
      if (!_0x493afb.urlsResolved) {
        _0x45fff9(_0x1f6e59, "正在检测并规范化监控链接…", "info");
        if (_0x5bcb5f) {
          await _0x49f63f(_0x1f6e59, _0x37bf47);
        }
        if (_0x587613) {
          await _0x31700b(_0x1f6e59, _0x37bf47);
        }
        if (!_0x2404d8()) {
          return;
        }
        _0x493afb.urlsResolved = true;
        _0x45fff9(_0x1f6e59, "链接检测完成，准备领取任务并打开页面…", "info");
      }
      const _0x1fab0a = _0x5bcb5f ? (Array.isArray(_0x37bf47.videoUrls) ? _0x37bf47.videoUrls : []).filter(_0x37cc65 => _0x37cc65?.url && String(_0x37cc65.source || "") !== "author_latest" && !isMonitorVideoUrlInvalid(_0x37cc65)) : [];
      const _0x36e974 = _0x587613 ? (Array.isArray(_0x37bf47.authorUrls) ? _0x37bf47.authorUrls : []).map(_0x339424).filter(_0x282547 => _0x282547 && !isMonitorAuthorUrlInvalid(_0x282547)) : [];
      if (_0x2e0ee6 > 0) {
        _0x45fff9(_0x1f6e59, "本轮跳过 " + _0x2e0ee6 + " 条已标记失效的视频链接（详见任务详情）", "info");
      }
      if (_0x4d97f7 > 0) {
        _0x45fff9(_0x1f6e59, "本轮跳过 " + _0x4d97f7 + " 条已标记失效的主播主页（详见任务详情）", "info");
      }
      if (_0x36e974.length === 0 && _0x1fab0a.length === 0) {
        _0x45fff9(_0x1f6e59, _0x2e0ee6 > 0 || _0x4d97f7 > 0 ? "当前没有可监控目标（配置的链接均已标记失效）" : "当前没有可监控目标（请配置主播主页或视频链接）", "warning");
      } else if (_0x4bc40d.length === 0) {
        _0x45fff9(_0x1f6e59, "未选择监控账号，跳过本轮检查", "warning");
      } else {
        const _0x10ea02 = [];
        _0x36e974.forEach((_0xfa73a4, _0x293ad5) => {
          _0x10ea02.push({
            type: "author",
            authorItem: _0xfa73a4,
            authorIndex: _0x293ad5,
            authorTotal: _0x36e974.length
          });
        });
        _0x1fab0a.forEach((_0x571cc4, _0x1f8614) => {
          _0x10ea02.push({
            type: "video",
            videoItem: _0x571cc4,
            videoIndex: _0x1f8614,
            videoTotal: _0x1fab0a.length
          });
        });
        const _0x86f419 = () => _0x10ea02.length > 0 ? _0x10ea02.shift() : null;
        const _0x1fc3a3 = Number(_0x493afb.seenInventoryEpoch) || 0;
        const _0x2257e8 = _0xb44e4a(_0x1f6e59);
        const _0x2a17bb = [..._0x2257e8];
        const _0x500985 = new Set(_0x2a17bb);
        const _0x389c7c = new Set();
        const _0x1e2be5 = _0x47c8d0(_0x1f6e59, _0x493afb.monitorTasksApi, _0x389c7c);
        _0x493afb.liveSeenState = {
          updatedSeenKeys: _0x2a17bb,
          seenKeySet: _0x500985,
          seenEpoch: _0x1fc3a3,
          knownUserKeySet: _0x389c7c
        };
        const _0x209163 = _0x10ea02.length;
        _0x45fff9(_0x1f6e59, "本轮任务池 " + _0x209163 + " 项（主页 " + _0x36e974.length + " · 视频 " + _0x1fab0a.length + "），" + _0x4bc40d.length + " 个账号抢活领取" + (_0x1e2be5 > 0 ? "；已加载本任务 " + _0x1e2be5 + " 个已研判用户用于跨视频去重" : ""), "info");
        try {
          const _0x3c3234 = await Promise.all(_0x4bc40d.map(_0x29aa4b => _0x25661f({
            taskId: _0x1f6e59,
            accountId: _0x29aa4b,
            config: _0x37bf47,
            accounts: _0x1ba116,
            monitorTasksApi: _0x493afb.monitorTasksApi,
            isRuntimeActive: _0x2404d8,
            claimNextWork: _0x86f419,
            workTotal: _0x209163,
            seenKeys: _0x2257e8,
            updatedSeenKeys: _0x2a17bb,
            seenKeySet: _0x500985,
            seenEpoch: _0x1fc3a3,
            knownUserKeySet: _0x389c7c
          })));
          const _0x49994b = _0x3653fd(_0x1f6e59, _0x2a17bb, {
            seenEpoch: _0x1fc3a3
          });
          if (!_0x49994b) {
            _0x45fff9(_0x1f6e59, "本轮去重记录已在中途清空，未回写旧指纹", "info");
          }
          for (const _0x4a7f02 of _0x3c3234) {
            if (!_0x4a7f02) {
              continue;
            }
            _0x295024 += _0x4a7f02.commentsScanned || 0;
            _0x39d654 += _0x4a7f02.matchedCount || 0;
            _0x2c8754 += _0x4a7f02.likeCount || 0;
            _0x4e091c += _0x4a7f02.replyCount || 0;
            _0x523c56 += _0x4a7f02.followCount || 0;
            _0xa14874 += _0x4a7f02.followRequestCount || 0;
            _0x34b267 += _0x4a7f02.messageCount || 0;
            _0x3f6eff += _0x4a7f02.newWorks || 0;
          }
          if (!_0x2404d8()) {
            return;
          }
        } finally {
          if (_0x493afb.liveSeenState?.seenEpoch === _0x1fc3a3) {
            _0x493afb.liveSeenState = null;
          }
        }
      }
      if (!_0x2404d8()) {
        _0x28fe1a = "stopped";
        return;
      }
      _0x45fff9(_0x1f6e59, "本轮轮询结束：新评论 " + _0x295024 + " 条，命中 " + _0x39d654 + "，点赞 " + _0x2c8754 + "，回复 " + _0x4e091c + "，关注 " + _0x523c56 + "，关注待通过 " + _0xa14874 + "，私信 " + _0x34b267 + ("，整轮耗时 " + _0x310e3b(Date.now() - _0x473169)), "success");
    } catch (_0x4acddd) {
      _0x28fe1a = "error";
      if (_0x2404d8()) {
        _0x45fff9(_0x1f6e59, "轮询异常（已运行 " + _0x310e3b(Date.now() - _0x473169) + "）：" + _0x4acddd.message, "error");
      }
    } finally {
      if (!_0x2404d8() && _0x28fe1a === "done") {
        _0x28fe1a = "stopped";
      }
      const _0x46f57b = Date.now();
      if (_0x3152df) {
        try {
          _0x3a111b(_0x1f6e59);
          _0x493afb.monitorTasksApi.finishCycle(_0x1f6e59, _0x3152df, {
            endedAt: _0x46f57b,
            durationMs: Math.max(0, _0x46f57b - _0x473169),
            status: _0x28fe1a,
            newComments: _0x295024,
            newWorks: _0x3f6eff,
            matched: _0x39d654,
            likes: _0x2c8754,
            replies: _0x4e091c,
            follows: _0x523c56,
            followRequests: _0xa14874,
            messages: _0x34b267
          });
        } catch (_0x30d98a) {}
      }
      _0x493afb.currentCycleId = null;
      _0x5eacfc(_0x1f6e59, {
        type: "cycle-done",
        ts: _0x46f57b,
        cycleId: _0x3152df,
        status: _0x28fe1a
      });
      if (_0x2404d8()) {
        _0x493afb.running = false;
      }
    }
  }
  function _0x1ba9da(_0x53691d = {}) {
    let _0x27871b = Number(_0x53691d.intervalSecondsMin);
    let _0x38218d = Number(_0x53691d.intervalSecondsMax);
    if ((!Number.isFinite(_0x27871b) || !Number.isFinite(_0x38218d)) && _0x53691d.intervalMinutes != null) {
      const _0x21846e = Math.max(30, Math.round(Number(_0x53691d.intervalMinutes) * 60));
      _0x27871b = _0x21846e;
      _0x38218d = _0x21846e;
    }
    if (!Number.isFinite(_0x27871b)) {
      _0x27871b = 60;
    }
    if (!Number.isFinite(_0x38218d)) {
      _0x38218d = 120;
    }
    if (_0x27871b > _0x38218d) {
      [_0x27871b, _0x38218d] = [_0x38218d, _0x27871b];
    }
    _0x27871b = Math.max(15, Math.floor(_0x27871b));
    _0x38218d = Math.max(_0x27871b, Math.floor(_0x38218d));
    return {
      min: _0x27871b,
      max: _0x38218d
    };
  }
  function _0x1c71b7(_0x310205) {
    const {
      min: _0x12aa3e,
      max: _0x5655c4
    } = _0x1ba9da(_0x310205);
    const _0x3f8bbc = Math.floor(Math.random() * (_0x5655c4 - _0x12aa3e + 1)) + _0x12aa3e;
    return _0x3f8bbc * 1000;
  }
  function _0x5907b5(_0x505f79 = {}) {
    let _0x3e1755 = Number(_0x505f79.actionDelaySecondsMin);
    let _0x21b833 = Number(_0x505f79.actionDelaySecondsMax);
    if (!Number.isFinite(_0x3e1755)) {
      _0x3e1755 = 3;
    }
    if (!Number.isFinite(_0x21b833)) {
      _0x21b833 = 8;
    }
    if (_0x3e1755 > _0x21b833) {
      [_0x3e1755, _0x21b833] = [_0x21b833, _0x3e1755];
    }
    _0x3e1755 = Math.max(1, Math.floor(_0x3e1755));
    _0x21b833 = Math.max(_0x3e1755, Math.floor(_0x21b833));
    return {
      min: _0x3e1755,
      max: _0x21b833
    };
  }
  function _0xc205a7(_0x5d734d = {}) {
    const {
      min: _0x45325c,
      max: _0x23a959
    } = _0x5907b5(_0x5d734d);
    const _0xef9517 = Math.floor(Math.random() * (_0x23a959 - _0x45325c + 1)) + _0x45325c;
    return _0xef9517 * 1000;
  }
  async function _0x3c452f({
    taskId: _0x3abf8d,
    config: _0x1935d4,
    isRuntimeActive: _0x4296cb,
    logPrefix = ""
  }) {
    const {
      min: _0x13013d,
      max: _0x23c4a4
    } = _0x5907b5(_0x1935d4);
    const _0x3b1bca = _0xc205a7(_0x1935d4);
    const _0x1e24cc = String(logPrefix || "").trim();
    _0x45fff9(_0x3abf8d, (_0x1e24cc ? _0x1e24cc + "，" : "") + "等待 " + Math.round(_0x3b1bca / 1000) + " 秒后执行动作（区间 " + _0x13013d + "–" + _0x23c4a4 + "s 随机）", "info");
    await new Promise(_0xe4105 => setTimeout(_0xe4105, _0x3b1bca));
    return _0x4296cb?.() !== false;
  }
  function _0x254a18(_0x1754b7) {
    if (!_0x1754b7?.timer) {
      return;
    }
    clearTimeout(_0x1754b7.timer);
    _0x1754b7.timer = null;
  }
  function _0x69b97e(_0x33e49e) {
    if (!_0x33e49e?.actionResetTimer) {
      return;
    }
    clearTimeout(_0x33e49e.actionResetTimer);
    _0x33e49e.actionResetTimer = null;
  }
  function _0x10811c(_0x3b61b5, _0x12e7c5 = "schedule") {
    const _0x3c98af = _0x21e6e0.get(_0x3b61b5);
    if (!_0x3c98af) {
      return false;
    }
    if (_0x3c98af.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const _0x44b6c7 = normalizeActionCountResetTime(_0x3c98af.config.actionCountAutoResetTime, "00:00");
    _0x3c98af.actionLimitState = _0x1f2cb2(_0x3c98af);
    _0x3c98af.actionLimitReachedLogged = new Set();
    _0x3c98af.lastActionCountResetAt = Date.now();
    const _0x5eca82 = formatAccountActionLimitSummary(_0x3c98af.actionLimitState);
    _0x45fff9(_0x3b61b5, _0x12e7c5 === "catchup" ? "自动动作数量已补重置（计划每日 " + _0x44b6c7 + "，累计统计不变）：" + _0x5eca82 : "自动动作数量已按计划重置（每日 " + _0x44b6c7 + "，累计统计不变）：" + _0x5eca82, "info");
    return true;
  }
  function _0x3157cc(_0x5c84a7) {
    const _0x279240 = _0x21e6e0.get(_0x5c84a7);
    if (!_0x279240) {
      return false;
    }
    _0x69b97e(_0x279240);
    if (_0x279240.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const _0x3b9efd = normalizeActionCountResetTime(_0x279240.config.actionCountAutoResetTime, "00:00");
    const _0x314a6e = msUntilNextActionCountReset(_0x3b9efd);
    const _0x4237af = new Date(Date.now() + _0x314a6e);
    const _0x3ce60a = _0x4237af.toLocaleString("zh-CN", {
      hour12: false
    });
    _0x279240.actionResetTimer = setTimeout(() => {
      const _0x2ee5b0 = _0x21e6e0.get(_0x5c84a7);
      if (!_0x2ee5b0) {
        return;
      }
      _0x2ee5b0.actionResetTimer = null;
      _0x10811c(_0x5c84a7, "schedule");
      _0x3157cc(_0x5c84a7);
    }, _0x314a6e);
    _0x45fff9(_0x5c84a7, "自动动作数量自动重置已启用：每日 " + _0x3b9efd + "（下次约 " + _0x3ce60a + "；仅重置限制数量本周期计数）", "info");
    return true;
  }
  function _0x1943a7(_0x55ac22) {
    const _0xb3b215 = _0x21e6e0.get(_0x55ac22);
    if (!_0xb3b215 || _0xb3b215.config?.actionCountAutoResetEnabled !== true) {
      return false;
    }
    const _0x523b65 = getLatestActionCountResetBoundary(_0xb3b215.config.actionCountAutoResetTime);
    const _0x34070a = Number(_0xb3b215.lastActionCountResetAt) || 0;
    if (_0x34070a >= _0x523b65) {
      return false;
    }
    return _0x10811c(_0x55ac22, "catchup");
  }
  function _0x49622d(_0x2cb360, _0x2fdad8, _0x4de0e9 = "poll") {
    const _0x198240 = _0x21e6e0.get(_0x2cb360);
    if (!_0x198240) {
      return false;
    }
    _0x254a18(_0x198240);
    const _0x85e778 = Math.max(0, Math.floor(Number(_0x2fdad8) || 0));
    const _0x25626f = Date.now();
    _0x198240.scheduledAt = _0x25626f;
    _0x198240.plannedDelayMs = _0x85e778;
    _0x198240.nextRunAt = _0x25626f + _0x85e778;
    _0x198240.scheduleKind = _0x4de0e9;
    _0x198240.timer = setTimeout(() => {
      const _0x545242 = _0x21e6e0.get(_0x2cb360);
      if (_0x545242) {
        _0x545242.timer = null;
      }
      _0x5c2953(_0x2cb360, "timer").catch(_0x450514 => {
        _0x45fff9(_0x2cb360, "轮询定时器触发异常：" + (_0x450514.message || _0x450514), "error");
      });
    }, _0x85e778);
    return true;
  }
  function _0x269594(_0x5d00c7, _0x56b74c) {
    const _0x160ad9 = _0x21e6e0.get(_0x5d00c7);
    if (!_0x160ad9) {
      return false;
    }
    _0x160ad9.config = _0x408d52(_0x56b74c || {});
    _0x160ad9.actionLimitState = _0x1f2cb2(_0x160ad9);
    _0x160ad9.actionLimitReachedLogged = new Set();
    _0x45fff9(_0x5d00c7, "任务配置已实时更新（监控对象：" + (_0x160ad9.config.monitorTargetTypes || []).join(", ") + "）", "info");
    _0x45fff9(_0x5d00c7, "动作数量限制已按新配置重置：" + formatAccountActionLimitSummary(_0x160ad9.actionLimitState), "info");
    _0x3157cc(_0x5d00c7);
    return true;
  }
  function _0x3cbd9f(_0x32e83c) {
    const _0x4810e0 = _0x21e6e0.get(_0x32e83c);
    if (!_0x4810e0?.nextRunAt || _0x4810e0.running || _0x4810e0.triggering) {
      return false;
    }
    _0x254a18(_0x4810e0);
    const _0x182762 = Math.max(0, _0x4810e0.nextRunAt - Date.now());
    _0x4810e0.timer = setTimeout(() => {
      const _0x2ee523 = _0x21e6e0.get(_0x32e83c);
      if (_0x2ee523) {
        _0x2ee523.timer = null;
      }
      _0x5c2953(_0x32e83c, "timer").catch(_0x2ba026 => {
        _0x45fff9(_0x32e83c, "轮询定时器触发异常：" + (_0x2ba026.message || _0x2ba026), "error");
      });
    }, _0x182762);
    return true;
  }
  async function _0x5c2953(_0x52c13f, _0x2ca878 = "timer") {
    const _0x4bd8ff = _0x21e6e0.get(_0x52c13f);
    if (!_0x4bd8ff || _0x4bd8ff.running || _0x4bd8ff.triggering) {
      return false;
    }
    _0x4bd8ff.triggering = true;
    _0x254a18(_0x4bd8ff);
    _0x1943a7(_0x52c13f);
    const _0x47bf7a = Number(_0x4bd8ff.nextRunAt) || Date.now();
    const _0x472535 = Math.max(0, Date.now() - _0x47bf7a);
    const _0x4975d4 = _0x4bd8ff.scheduleKind || "poll";
    _0x4bd8ff.nextRunAt = null;
    _0x4bd8ff.scheduledAt = null;
    _0x4bd8ff.plannedDelayMs = null;
    _0x4bd8ff.scheduleKind = null;
    const _0x5244ac = (_0x472535 / 1000).toFixed(_0x472535 >= 1000 ? 1 : 2);
    if (_0x4975d4 === "initial") {
      _0x45fff9(_0x52c13f, "首次轮询定时器已触发（误差 " + _0x5244ac + " 秒），开始执行", "info");
    } else if (_0x2ca878 === "watchdog") {
      _0x45fff9(_0x52c13f, "到点守护检测到轮询已到期，延迟 " + _0x5244ac + " 秒后补触发下一整轮", "warning");
    } else if (_0x2ca878 === "system-resume") {
      _0x45fff9(_0x52c13f, "系统恢复后发现轮询已到期，延迟 " + _0x5244ac + " 秒后立即补触发下一整轮", "warning");
    } else if (_0x472535 >= _0x1debcb) {
      _0x45fff9(_0x52c13f, "轮询定时器延迟 " + _0x5244ac + " 秒后触发，开始下一整轮", "warning");
    } else {
      _0x45fff9(_0x52c13f, "轮询定时器已按计划触发（误差 " + _0x5244ac + " 秒），开始下一整轮", "info");
    }
    const _0x3e68f9 = acquireTaskRuntimeGuard(_0x41297e(_0x52c13f), {
      type: "video-monitor",
      taskId: _0x52c13f
    });
    if (!_0x3e68f9) {
      _0x45fff9(_0x52c13f, "后台运行守护当前未生效，任务仍会继续并由到点守护检测", "warning");
    }
    try {
      await _0x558e6c(_0x52c13f);
      return true;
    } finally {
      const _0x2e53e5 = _0x21e6e0.get(_0x52c13f);
      if (_0x2e53e5 === _0x4bd8ff) {
        _0x2e53e5.triggering = false;
        _0x5b169f(_0x52c13f);
      }
    }
  }
  function _0x299f63() {
    if (_0x4fd334 || _0x21e6e0.size === 0) {
      return;
    }
    _0x4fd334 = setInterval(() => {
      const _0x57cd0f = Date.now();
      for (const [_0x317d1f, _0x28d9aa] of _0x21e6e0.entries()) {
        if (_0x28d9aa.running || _0x28d9aa.triggering || !_0x28d9aa.nextRunAt) {
          continue;
        }
        if (_0x57cd0f < _0x28d9aa.nextRunAt + _0x2d70ce) {
          continue;
        }
        _0x5c2953(_0x317d1f, "watchdog").catch(_0x32403b => {
          _0x45fff9(_0x317d1f, "到点守护补触发失败：" + (_0x32403b.message || _0x32403b), "error");
        });
      }
    }, _0x1e0759);
    if (typeof _0x4fd334.unref === "function") {
      _0x4fd334.unref();
    }
  }
  function _0x3a66c1() {
    if (_0x21e6e0.size > 0 || !_0x4fd334) {
      return;
    }
    clearInterval(_0x4fd334);
    _0x4fd334 = null;
  }
  function _0x5b169f(_0x18bcbf) {
    const _0x4bf9fa = _0x21e6e0.get(_0x18bcbf);
    if (!_0x4bf9fa) {
      return;
    }
    const {
      min: _0x1a416a,
      max: _0x6a8117
    } = _0x1ba9da(_0x4bf9fa.config);
    const _0x2ae3b6 = _0x1c71b7(_0x4bf9fa.config);
    const _0x3cc947 = (_0x4bf9fa.config.videoUrls || []).filter(_0x434d88 => _0x434d88?.url).length;
    const _0x42e37c = (_0x4bf9fa.config.authorUrls || []).filter(_0x1a67df => _0x1a67df?.url).length;
    _0x45fff9(_0x18bcbf, "下次完整轮询将在约 " + Math.round(_0x2ae3b6 / 1000) + " 秒后开始（随机区间 " + _0x1a416a + "–" + _0x6a8117 + " 秒；本轮共 " + _0x3cc947 + " 个视频、" + _0x42e37c + " 个主播；整轮处理耗时不计入该间隔）", "info");
    _0x49622d(_0x18bcbf, _0x2ae3b6, "poll");
  }
  function _0x32b2bb(_0x3bc9a0, _0x2a6288, _0x49b7be) {
    const _0xbe4c90 = _0x3bc9a0.id;
    _0x1cf733(_0xbe4c90);
    const _0x31d675 = _0x408d52(_0x3bc9a0.configSnapshot || {});
    const _0x499805 = Array.isArray(_0x2a6288) ? _0x2a6288 : [];
    for (const _0x481616 of _0x499805) {
      const _0x509c82 = String(_0x481616?.id || _0x481616?.accountId || "").trim();
      if (!_0x509c82) {
        continue;
      }
      if (typeof isCommentLeadgenAccountBusy === "function" && isCommentLeadgenAccountBusy(_0x509c82)) {
        const _0x1dcd99 = new Error("账号 " + _0x509c82 + " 正在执行评论获客，无法同时启动监控");
        _0x1dcd99.code = "monitor_account_busy";
        throw _0x1dcd99;
      }
      if (typeof isEntityLeadgenAccountBusy === "function" && isEntityLeadgenAccountBusy(_0x509c82)) {
        const _0x12b552 = new Error("账号 " + _0x509c82 + " 正在执行线索采集，无法同时启动监控");
        _0x12b552.code = "monitor_account_busy";
        throw _0x12b552;
      }
    }
    const {
      min: _0x3be3a1,
      max: _0x3bde0d
    } = _0x1ba9da(_0x31d675);
    const _0x35ac63 = createAccountActionLimitStore(_0x31d675, MONITOR_ACTION_LIMIT_SPECS, _0x499805.map(_0x3fb03e => _0x3fb03e?.id).filter(Boolean));
    _0x21e6e0.set(_0xbe4c90, {
      timer: null,
      actionResetTimer: null,
      config: _0x31d675,
      accounts: _0x499805,
      monitorTasksApi: _0x49b7be,
      running: false,
      triggering: false,
      urlsResolved: false,
      scheduledAt: null,
      plannedDelayMs: null,
      nextRunAt: null,
      scheduleKind: null,
      actionLimitState: _0x35ac63,
      actionLimitReachedLogged: new Set(),
      lastActionCountResetAt: Date.now()
    });
    const _0x5eba09 = acquireTaskRuntimeGuard(_0x41297e(_0xbe4c90), {
      type: "video-monitor",
      taskId: _0xbe4c90
    });
    _0x299f63();
    _0x45fff9(_0xbe4c90, "监控任务已启动，轮询间隔 " + _0x3be3a1 + "–" + _0x3bde0d + " 秒（视频 " + (_0x31d675.videoUrls || []).length + " · 主播 " + (_0x31d675.authorUrls || []).length + "）", "success");
    const _0xbc0675 = formatAccountActionLimitSummary(_0x35ac63);
    const _0x1a2667 = Object.values(_0x35ac63?.template?.limits || {}).some(_0x5d7686 => _0x5d7686?.enabled);
    _0x45fff9(_0xbe4c90, _0x1a2667 ? "动作数量限制：" + _0xbc0675 + "；各账号独立计数，停止或重启任务后清零并重新取值" : "动作数量限制：全部不限（未开启「限制数量」）", "info");
    const _0x347af4 = GENDER_FILTER_LABELS[_0x31d675.profileActionGenderFilter] || GENDER_FILTER_LABELS.all;
    const _0x59ed46 = _0x31d675.profileActionAgeFilterEnabled ? _0x31d675.profileActionAgeMin + "-" + _0x31d675.profileActionAgeMax + " 岁" : "关闭";
    _0x45fff9(_0xbe4c90, "关注/私信主页筛选：性别 " + _0x347af4 + "；年龄 " + _0x59ed46, "info");
    if (_0x31d675.enableAutoReply && _0x31d675.commentOnProfileFirstWork) {
      const _0x23e45c = GENDER_FILTER_LABELS[_0x31d675.profileFirstGenderFilter] || GENDER_FILTER_LABELS.all;
      const _0x5b3c6b = _0x31d675.profileFirstAgeFilterEnabled ? _0x31d675.profileFirstAgeMin + "-" + _0x31d675.profileFirstAgeMax + " 岁" : "关闭";
      _0x45fff9(_0xbe4c90, "自动回复·首作评论已开启（无首作=" + (_0x31d675.profileFirstCommentFallbackMode === "skip" ? "仅首作" : "回评原评论") + "；性别 " + _0x23e45c + "；年龄 " + _0x5b3c6b + "；点赞 " + _0x31d675.profileFirstWorkLikePercent + "% / 收藏 " + _0x31d675.profileFirstWorkCollectPercent + "%）", "info");
    }
    _0x45fff9(_0xbe4c90, _0x5eba09 ? "后台运行守护已启用，最小化不会暂停监控任务" : "后台运行守护启用失败，已保留到点守护继续检测", _0x5eba09 ? "info" : "warning");
    _0x45fff9(_0xbe4c90, "设备性能保护：检测到 " + _0x4089db.toFixed(1) + "GB 内存，后台页面最多同时活跃 " + _0x10669c + " 个、空闲保留 " + _0x26a7fd + " 个；渲染内存连续达到 " + _0x494f62 + "MB 时先保存评论进度并续跑当前视频，单视频 " + Math.round(_0x19e276 / 1000) + " 秒期限和 " + MONITOR_MAX_COMMENTS + " 条上限保持不变", "info");
    _0x3157cc(_0xbe4c90);
    _0x49622d(_0xbe4c90, 3000, "initial");
    return true;
  }
  function _0x1cf733(_0x21121b) {
    const _0x32b191 = _0x21e6e0.get(_0x21121b);
    if (!_0x32b191) {
      return false;
    }
    _0x254a18(_0x32b191);
    _0x69b97e(_0x32b191);
    _0x3a111b(_0x21121b);
    const _0x350fed = (Array.isArray(_0x32b191.accounts) ? _0x32b191.accounts : []).map(_0xc0919e => String(_0xc0919e?.id || _0xc0919e?.accountId || "").trim()).filter(Boolean);
    _0x21e6e0.delete(_0x21121b);
    const _0x3d38c8 = _0x239dbb(_0x21121b);
    try {
      _0x362177.releaseMonitorLiveSurfaces(_0x350fed.length ? _0x350fed : null);
    } catch (_0x5c88ca) {}
    if (_0x21e6e0.size > 0 && _0x3d38c8.size > 0) {
      for (const [_0x23c663, _0x49358a] of _0x279862.entries()) {
        if (!_0x49358a || _0x49358a.isDestroyed() || !_0x3d38c8.has(_0x49358a.webContents.id)) {
          continue;
        }
        _0x279862.delete(_0x23c663);
        try {
          _0x49358a.destroy();
        } catch (_0x1ca3f6) {}
      }
    }
    releaseTaskRuntimeGuard(_0x41297e(_0x21121b));
    if (_0x21e6e0.size === 0) {
      _0x292c4e();
    }
    _0x3a66c1();
    _0x45fff9(_0x21121b, "监控任务已停止", "info");
    return true;
  }
  function _0x3c4ca2(_0x3a35e9) {
    return _0x21e6e0.has(_0x3a35e9);
  }
  function _0x534ac1(_0x18afd7) {
    if (!_0x18afd7) {
      return false;
    }
    const _0x208d62 = String(_0x18afd7).trim().replace(/^(douyin_|kuaishou_|xhs_)/, "");
    for (const _0x262b95 of _0x21e6e0.values()) {
      const _0x87e95b = Array.isArray(_0x262b95.accounts) ? _0x262b95.accounts : [];
      if (_0x87e95b.some(_0x4170c6 => String(_0x4170c6?.id || _0x4170c6?.accountId || "").trim() === _0x208d62)) {
        return true;
      }
    }
    const _0x9833a8 = _0x279862.get(_0x208d62);
    return !!_0x9833a8 && !_0x9833a8.isDestroyed();
  }
  function _0x2d73b1() {
    return [..._0x21e6e0.keys()];
  }
  function _0x51e3d3() {
    const _0x5437ab = [..._0x21e6e0.keys()];
    _0x5437ab.forEach(_0x2e130b => _0x1cf733(_0x2e130b));
    _0x3a66c1();
  }
  function _0x9d3c81() {
    const _0x1c590e = Date.now();
    let _0x4231ef = 0;
    for (const [_0x48a737, _0x4e8f53] of _0x21e6e0.entries()) {
      acquireTaskRuntimeGuard(_0x41297e(_0x48a737), {
        type: "video-monitor",
        taskId: _0x48a737
      });
      if (_0x4e8f53.running || _0x4e8f53.triggering || !_0x4e8f53.nextRunAt) {
        continue;
      }
      _0x4231ef += 1;
      _0x1943a7(_0x48a737);
      if (!_0x4e8f53.actionResetTimer && _0x4e8f53.config?.actionCountAutoResetEnabled === true) {
        _0x3157cc(_0x48a737);
      }
      if (_0x4e8f53.nextRunAt <= _0x1c590e) {
        _0x5c2953(_0x48a737, "system-resume").catch(_0x23bf9e => {
          _0x45fff9(_0x48a737, "系统恢复补触发失败：" + (_0x23bf9e.message || _0x23bf9e), "error");
        });
      } else {
        _0x3cbd9f(_0x48a737);
        _0x45fff9(_0x48a737, "系统恢复，轮询计划仍有效，将在约 " + Math.ceil((_0x4e8f53.nextRunAt - _0x1c590e) / 1000) + " 秒后开始下一整轮", "info");
      }
    }
    _0x299f63();
    return _0x4231ef;
  }
  function _0x1ffc4e() {
    return [..._0x279862.values()].filter(_0x5a4a74 => _0x5a4a74 && !_0x5a4a74.isDestroyed()).map(_0x553b11 => _0x553b11.webContents).filter(_0x2ecc61 => _0x2ecc61 && !_0x2ecc61.isDestroyed?.());
  }
  return {
    startTask: _0x32b2bb,
    stopTask: _0x1cf733,
    updateTaskConfig: _0x269594,
    isTaskRunning: _0x3c4ca2,
    isAccountRunning: _0x534ac1,
    listRunningTaskIds: _0x2d73b1,
    listWebContents: _0x1ffc4e,
    getTaskLogs: _0x298069,
    clearTaskLogs: _0x280196,
    handleSystemResume: _0x9d3c81,
    stopAll: _0x51e3d3,
    handleActionResult: _0x5e3e55,
    handleActionProgress: _0xa2ffce,
    handleScrapeResult: _0x36f742,
    handleScrapeProgress: _0x28b1f1,
    handleAuthorWorksResult: _0x2a3829,
    handleAuthorNavResult: _0x28f5a8,
    showMonitorWindow: _0x4dd83e,
    hideMonitorWindow: _0x5ee4ef,
    consumePendingLivePreview: _0x362177.consumePendingLivePreview,
    getCommentSeenInventoryStats: _0x5e7393,
    clearCommentSeenInventory: _0x27cc40
  };
}
module.exports = {
  createVideoMonitorRunner: createVideoMonitorRunner
};
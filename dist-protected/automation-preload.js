const {
  ipcRenderer,
  webFrame
} = require("electron");

function getSafeStorage(type) {
  try {
    const s = type === "session" ? window.sessionStorage : window.localStorage;
    if (s && typeof s.getItem === "function") {
      return s;
    }
  } catch (_) {}
  return null;
}

function createSafeStorageProxy(type) {
  const memoryFallback = new Map();
  return {
    getItem(key) {
      try {
        const s = getSafeStorage(type);
        if (s) {
          const val = s.getItem(key);
          if (val !== null && val !== undefined) {
            return val;
          }
        }
      } catch (_) {}
      return memoryFallback.has(key) ? memoryFallback.get(key) : null;
    },
    setItem(key, value) {
      const strVal = String(value);
      memoryFallback.set(key, strVal);
      try {
        const s = getSafeStorage(type);
        if (s) {
          s.setItem(key, strVal);
        }
      } catch (_) {}
    },
    removeItem(key) {
      memoryFallback.delete(key);
      try {
        const s = getSafeStorage(type);
        if (s) {
          s.removeItem(key);
        }
      } catch (_) {}
    },
    clear() {
      memoryFallback.clear();
      try {
        const s = getSafeStorage(type);
        if (s) {
          s.clear();
        }
      } catch (_) {}
    },
    key(index) {
      const allKeys = new Set();
      try {
        const s = getSafeStorage(type);
        if (s && typeof s.length === "number") {
          for (let i = 0; i < s.length; i++) {
            const k = s.key(i);
            if (k) allKeys.add(k);
          }
        }
      } catch (_) {}
      for (const k of memoryFallback.keys()) {
        allKeys.add(k);
      }
      const arr = Array.from(allKeys);
      return arr[index] ?? null;
    },
    get length() {
      const allKeys = new Set();
      try {
        const s = getSafeStorage(type);
        if (s && typeof s.length === "number") {
          for (let i = 0; i < s.length; i++) {
            const k = s.key(i);
            if (k) allKeys.add(k);
          }
        }
      } catch (_) {}
      for (const k of memoryFallback.keys()) {
        allKeys.add(k);
      }
      return allKeys.size;
    }
  };
}

const safeLocalStorage = createSafeStorageProxy("local");
const safeSessionStorage = createSafeStorageProxy("session");
const localStorage = safeLocalStorage;
const sessionStorage = safeSessionStorage;

function safeSessionGet(arg1, arg2 = null) {
  try {
    return sessionStorage.getItem(arg1);
  } catch (error) {
    return arg2;
  }
}
function sanitizeInlinePageScript(arg1) {
  return String(arg1 || "").replace(/<\/script/gi, "<\\/script");
}
function safeSessionSet(arg1, arg2) {
  try {
    sessionStorage.setItem(arg1, arg2);
    return true;
  } catch (error) {
    return false;
  }
}
let commentAutomationController = null;
let commentAutomationControllerLoadError = null;
let _createDouyinVideoAuthorApiFn;
function loadCreateDouyinVideoAuthorApi() {
  if (_createDouyinVideoAuthorApiFn !== undefined) {
    return _createDouyinVideoAuthorApiFn;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinVideoAuthorCapture", "./shared/douyinVideoAuthorCapture.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinVideoAuthorCapture.js"), result.join(__dirname, "shared", "douyinVideoAuthorCapture"), result.join(__dirname, "..", "shared", "douyinVideoAuthorCapture.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.createDouyinVideoAuthorApi === "function") {
        _createDouyinVideoAuthorApiFn = result.createDouyinVideoAuthorApi;
        console.log("[Built-in-Debug] douyinVideoAuthorCapture 已加载: " + item);
        return _createDouyinVideoAuthorApiFn;
      }
    } catch (error) {}
  }
  console.error("[Built-in-Debug] douyinVideoAuthorCapture 模块未找到");
  _createDouyinVideoAuthorApiFn = null;
  return null;
}
let _classifyLiveRoomAvailabilityFn;
function loadClassifyLiveRoomAvailability() {
  if (_classifyLiveRoomAvailabilityFn !== undefined) {
    return _classifyLiveRoomAvailabilityFn;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/entityLiveScheduler", "./shared/entityLiveScheduler.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "entityLiveScheduler.js"), result.join(__dirname, "..", "shared", "entityLiveScheduler.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.classifyLiveRoomAvailability === "function") {
        _classifyLiveRoomAvailabilityFn = result.classifyLiveRoomAvailability;
        return _classifyLiveRoomAvailabilityFn;
      }
    } catch (error) {}
  }
  _classifyLiveRoomAvailabilityFn = ({
    text = "",
    hasChatContainer = false,
    elapsedMs = 0,
    capturedAnyEvent = false,
    privacyAudienceOnly = false,
    privacyAudienceCount = 0
  } = {}) => {
    const result = String(text || "").replace(/\s+/g, " ").trim();
    if (/直播(?:间)?已结束|直播结束了|主播已下播|该直播间已关闭|本场直播已结束|主播暂时不在/.test(result)) {
      return {
        ended: true,
        reason: "live_ended",
        message: "直播间已经结束"
      };
    }
    if (/私密直播|加密直播|密码房|输入密码|需要密码|仅邀请|仅好友可见|好友可见|直播间已加密|无法进入(?:该)?直播间|该直播间仅.*可见|主播开启了隐私保护|不支持查看他人资料|观众资料.*不可见|隐私设置.*无法观看/.test(result)) {
      return {
        ended: true,
        reason: "live_private",
        message: "直播间为私密或隐私设置，已跳过"
      };
    }
    if (privacyAudienceOnly && Number(privacyAudienceCount) >= 3 && (Number(elapsedMs) >= 8000 || Number(privacyAudienceCount) >= 8)) {
      return {
        ended: true,
        reason: "live_private",
        message: "直播间开启了观众隐私保护，已跳过"
      };
    }
    if (Number(elapsedMs) >= 10000 && !hasChatContainer && /直播不存在|房间不存在|页面不存在|服务器开小差|点击刷新重试|暂时无法观看/.test(result)) {
      return {
        ended: true,
        reason: "live_unavailable",
        message: "直播间当前不可用"
      };
    }
    if (Number(elapsedMs) >= 30000 && !hasChatContainer && !capturedAnyEvent) {
      return {
        ended: true,
        reason: "live_unavailable",
        message: "未检测到有效直播内容，直播间可能已结束或无法访问"
      };
    }
    return {
      ended: false,
      reason: "",
      message: ""
    };
  };
  return _classifyLiveRoomAvailabilityFn;
}
let _hardwareFingerprintMod;
function loadHardwareFingerprint() {
  if (_hardwareFingerprintMod !== undefined) {
    return _hardwareFingerprintMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/hardwareFingerprint", "./shared/hardwareFingerprint.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "hardwareFingerprint.js"), result.join(__dirname, "shared", "hardwareFingerprint"), result.join(__dirname, "..", "shared", "hardwareFingerprint.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.buildFingerprintInjectionScript === "function") {
        _hardwareFingerprintMod = result;
        return _hardwareFingerprintMod;
      }
    } catch (error) {}
  }
  _hardwareFingerprintMod = null;
  return null;
}
let _feedSwitchGuard;
function getFeedSwitchGuard() {
  if (_feedSwitchGuard) {
    return _feedSwitchGuard;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinFeedSwitchGuard", "./shared/douyinFeedSwitchGuard.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinFeedSwitchGuard.js"), result.join(__dirname, "..", "shared", "douyinFeedSwitchGuard.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.createFeedSwitchGuard === "function") {
        _feedSwitchGuard = result.createFeedSwitchGuard();
        return _feedSwitchGuard;
      }
    } catch (error) {}
  }
  let num = 0;
  let flag = false;
  _feedSwitchGuard = {
    noteAttempt({
      byButton = false
    } = {}) {
      num = Date.now();
      flag = !!byButton;
    },
    shouldSkipButtonClick({
      force = false
    } = {}) {
      if (force || !flag || !num) {
        return false;
      }
      return Date.now() - num < 3200;
    },
    shouldRetrySettleSwitch({
      waitStart = 0,
      round = 0,
      sawSwitchProgress = false
    } = {}) {
      if (sawSwitchProgress || !(Number(round) > 0)) {
        return false;
      }
      if (!waitStart || Date.now() - waitStart < 5000) {
        return false;
      }
      return Number(round) % 10 === 0;
    },
    reset() {
      num = 0;
      flag = false;
    }
  };
  return _feedSwitchGuard;
}
let _specificVideoOpenMod;
function getSpecificVideoOpenModule() {
  if (_specificVideoOpenMod !== undefined) {
    return _specificVideoOpenMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinSpecificVideoOpen", "./shared/douyinSpecificVideoOpen.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinSpecificVideoOpen.js"), result.join(__dirname, "..", "shared", "douyinSpecificVideoOpen.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.isDouyinLoadingLabelText === "function") {
        _specificVideoOpenMod = result;
        return _specificVideoOpenMod;
      }
    } catch (error) {}
  }
  _specificVideoOpenMod = null;
  return null;
}
let _searchPageReadyMod;
function getSearchPageReadyModule() {
  if (_searchPageReadyMod !== undefined) {
    return _searchPageReadyMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinSearchPageReady", "./shared/douyinSearchPageReady.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinSearchPageReady.js"), result.join(__dirname, "..", "shared", "douyinSearchPageReady.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.createSearchApiReadyTracker === "function") {
        _searchPageReadyMod = result;
        return _searchPageReadyMod;
      }
    } catch (error) {}
  }
  _searchPageReadyMod = null;
  return null;
}
let _videoSearchScrapePolicyMod;
function getVideoSearchScrapePolicyModule() {
  if (_videoSearchScrapePolicyMod !== undefined) {
    return _videoSearchScrapePolicyMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinVideoSearchScrapePolicy", "./shared/douyinVideoSearchScrapePolicy.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinVideoSearchScrapePolicy.js"), result.join(__dirname, "..", "shared", "douyinVideoSearchScrapePolicy.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.canLinkOnlyScrapeWithoutOpen === "function") {
        _videoSearchScrapePolicyMod = result;
        return _videoSearchScrapePolicyMod;
      }
    } catch (error) {}
  }
  _videoSearchScrapePolicyMod = null;
  return null;
}
let _videoSearchCollectionEngineMod;
function getVideoSearchCollectionEngineModule() {
  if (_videoSearchCollectionEngineMod !== undefined) {
    return _videoSearchCollectionEngineMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinVideoSearchCollectionEngine", "./shared/douyinVideoSearchCollectionEngine.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinVideoSearchCollectionEngine.js"), result.join(__dirname, "..", "shared", "douyinVideoSearchCollectionEngine.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.performVideoSearchWindowScroll === "function" && typeof result?.evaluateVideoSearchCollectionRound === "function") {
        _videoSearchCollectionEngineMod = result;
        return _videoSearchCollectionEngineMod;
      }
    } catch (error) {}
  }
  _videoSearchCollectionEngineMod = null;
  return null;
}
let _applySearchFiltersMod;
function getApplySearchFiltersModule() {
  if (_applySearchFiltersMod !== undefined) {
    return _applySearchFiltersMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinApplySearchFilters", "./shared/douyinApplySearchFilters.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinApplySearchFilters.js"), result.join(__dirname, "..", "shared", "douyinApplySearchFilters.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.applyOfficialSearchFilters === "function") {
        _applySearchFiltersMod = result;
        return _applySearchFiltersMod;
      }
    } catch (error) {}
  }
  _applySearchFiltersMod = null;
  return null;
}
let _searchFilterSessionMod;
function getSearchFilterSessionModule() {
  if (_searchFilterSessionMod !== undefined) {
    return _searchFilterSessionMod;
  }
  const result = (() => {
    try {
      return require("path");
    } catch (error) {
      return null;
    }
  })();
  const list = ["./shared/douyinSearchFilterSession", "./shared/douyinSearchFilterSession.js"];
  if (result && typeof __dirname === "string") {
    list.push(result.join(__dirname, "shared", "douyinSearchFilterSession.js"), result.join(__dirname, "..", "shared", "douyinSearchFilterSession.js"));
  }
  for (const item of list) {
    try {
      const result = require(item);
      if (typeof result?.clearAppliedSearchFilterSession === "function") {
        _searchFilterSessionMod = result;
        return _searchFilterSessionMod;
      }
    } catch (error) {}
  }
  _searchFilterSessionMod = null;
  return null;
}
let _searchApiReadyTracker;
function getSearchApiReadyTracker() {
  if (_searchApiReadyTracker) {
    return _searchApiReadyTracker;
  }
  const result = getSearchPageReadyModule();
  if (result?.createSearchApiReadyTracker) {
    _searchApiReadyTracker = result.createSearchApiReadyTracker();
  } else {
    let num = 0;
    let local = null;
    _searchApiReadyTracker = {
      bumpGeneration() {
        num += 1;
        local = null;
        return num;
      },
      getGeneration() {
        return num;
      },
      noteApiDetail() {
        return null;
      },
      getSignal() {
        return local;
      },
      hasFreshResults() {
        return false;
      },
      hasFreshEmpty() {
        return false;
      },
      reset() {
        local = null;
      }
    };
  }
  return _searchApiReadyTracker;
}
function prepareSearchPageReload(arg1, arg2, text = "") {
  try {
    getSearchApiReadyTracker().bumpGeneration();
  } catch (error) {}
  try {
    const result = getSearchFilterSessionModule();
    const local = result?.clearAppliedSearchFilterSession?.(sessionStorage, arg1, arg2) || 0;
    if (local > 0) {
      console.log("[Built-in-Debug] [官方筛选] 重载前清筛选锁 " + local + " 项" + ((text ? "（" + text + "）" : "") + ": " + (arg2 || "-")));
    }
  } catch (error) {}
}
let specificVideoApiHookInstalled = false;
let specificVideoApiBridgeReady = false;
const specificVideoApiById = new Map();
function rememberSpecificVideoApiProbe(options = {}) {
  const result = String(options?.awemeId || "").trim();
  if (!result) {
    return;
  }
  specificVideoApiById.set(result, {
    status: options.status || "unknown",
    awemeId: result,
    statusCode: Number(options.statusCode) || 0,
    reason: String(options.reason || ""),
    at: Number(options.at) || Date.now()
  });
  if (specificVideoApiById.size > 200) {
    const result = [...specificVideoApiById.keys()].slice(0, specificVideoApiById.size - 120);
    result.forEach(arg1 => specificVideoApiById.delete(arg1));
  }
}
function lookupSpecificVideoApiProbe(arg1) {
  const local = extractSpecificVideoId(arg1) || String(arg1 || "").trim();
  if (!local) {
    return null;
  }
  return specificVideoApiById.get(local) || null;
}
function ensureSpecificVideoApiBridge() {
  if (specificVideoApiBridgeReady) {
    return;
  }
  specificVideoApiBridgeReady = true;
  document.addEventListener("__radar_specific_video_api", arg1 => {
    try {
      rememberSpecificVideoApiProbe(arg1?.detail || {});
    } catch (error) {
      console.warn("[SpecificVideo][API] bridge error:", error?.message || error);
    }
  });
}
function ensureSpecificVideoApiHook() {
  ensureSpecificVideoApiBridge();
  if (specificVideoApiHookInstalled || window.__radar_specific_video_api_hooked) {
    specificVideoApiHookInstalled = true;
    return true;
  }
  const result = getSpecificVideoOpenModule();
  const value = typeof result?.getSpecificVideoApiHookInstaller === "function" ? result.getSpecificVideoApiHookInstaller() : "";
  if (!value) {
    return false;
  }
  try {
    const result = document.createElement("script");
    result.textContent = sanitizeInlinePageScript(value);
    (document.documentElement || document.head || document.body).appendChild(result);
    result.remove();
    specificVideoApiHookInstalled = true;
    console.log("[SpecificVideo][API] hook installed");
    return true;
  } catch (error) {
    console.warn("[SpecificVideo][API] inject failed:", error?.message || error);
    return false;
  }
}
(function installProtocolClickGuard() {
  if (window._radar_protocol_click_guard) {
    return;
  }
  window._radar_protocol_click_guard = true;
  const local = arg1 => /^(https?:|about:|blob:|data:|javascript:)/i.test(String(arg1 || "").trim());
  const local2 = () => {
    document.addEventListener("click", arg1 => {
      const local2 = arg1.target?.closest?.("a[href]");
      if (!local2) {
        return;
      }
      const result = String(local2.getAttribute("href") || "").trim();
      if (!result || local(result)) {
        return;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(result)) {
        arg1.preventDefault();
        arg1.stopPropagation();
        console.log("[Protocol] 已拦截自定义协议点击: " + result.slice(0, 96));
      }
    }, true);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", local2, {
      once: true
    });
  } else {
    local2();
  }
})();
(function injectCompatLayer() {
  if (window._radar_compat_active) {
    return;
  }
  window._radar_compat_active = true;
  const value = console.error;
  const value2 = console.warn;
  console.error = function (...restArgs) {
    if (restArgs[0] && typeof restArgs[0] === "string" && (restArgs[0].includes("read only property 'call'") || restArgs[0].includes("slardar"))) {
      return;
    }
    return value.apply(console, restArgs);
  };
  console.warn = function (...restArgs) {
    if (restArgs[0] && typeof restArgs[0] === "string" && (restArgs[0].includes("eventName is null") || restArgs[0].includes("call"))) {
      return;
    }
    return value2.apply(console, restArgs);
  };
  try {
    const local = window._radar_account_id || safeSessionGet("radar_account_id");
    let obj = {
      policy: "passthrough"
    };
    try {
      obj = ipcRenderer.sendSync("get-account-fingerprint-info-sync", local) || {
        policy: "passthrough"
      };
    } catch (error) {}
    if (!obj || obj.policy === "passthrough" || !obj.seed || obj.seed === "passthrough") {
      console.log("%c[Fingerprint] 旧账号继承原生设备指纹，0 修改直通 (0 风险)", "color: #3b82f6;");
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 8
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 8
      });
    } else {
      const result = loadHardwareFingerprint();
      if (result && typeof result.buildFingerprintInjectionScript === "function") {
        const result2 = result.buildFingerprintInjectionScript(obj.seed, process.platform);
        if (result2) {
          const result = document.createElement("script");
          result.textContent = sanitizeInlinePageScript(result2);
          (document.head || document.documentElement).appendChild(result);
          result.remove();
          console.log("%c[Fingerprint] 新账号已动态激活拟真设备指纹与混音噪声 (Seed: " + obj.seed + ")", "color: #10b981; font-weight: bold;");
        }
      }
    }
    Object.defineProperty(document, "visibilityState", {
      get: () => "visible",
      configurable: true
    });
    Object.defineProperty(document, "hidden", {
      get: () => false,
      configurable: true
    });
    Object.defineProperty(document, "hasFocus", {
      value: () => true,
      configurable: true,
      writable: false
    });
  } catch (error) {}
  console.log("%c[系统提示] 运行环境适配层已就绪", "color: #10b981; font-weight: bold;");
})();
let activeLoopId = null;
let taskRunning = false;
let stopRequested = false;
let wanderingGeneration = 0;
let activeWanderingContext = null;
function cancelRandomWandering(text = "cancelled") {
  const local = activeWanderingContext;
  wanderingGeneration += 1;
  if (local) {
    local.cancelWait?.();
    const value = local.source === "batch" ? "[批量间隙闲逛]" : "[拟人闲逛]";
    console.log(value + " 已取消 (" + text + ", run=" + (local.batchRunId ?? "-") + ")");
  }
  activeWanderingContext = null;
}
function suspendAutomationForNavigation() {
  taskRunning = false;
  syncSpecificVideoPauseWatcher();
}
let processedVideos = new Set();
let interactedInSession = new Set();
let sessionProcessedCount = 0;
let targetVideoCount = 0;
let lastClickedId = null;
let pendingLeadVideoUrl = "";
let pendingLeadVideoUrlAt = 0;
let lockedLeadVideoUrl = "";
let lockedFeedIdentity = "";
let lastDouyinSearchZeroDiagAt = 0;
let searchCardOpenFailures = new Map();
let searchCardOpenFailureStreak = 0;
const SEARCH_CARD_OPEN_FAILURE_TTL_MS = 120000;
const SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER = 2;
const SEARCH_CARD_OPEN_STUCK_RELOAD_AFTER = 4;
const SEARCH_ZERO_CARD_SCANS_BEFORE_RELOAD = 2;
const SEARCH_ZERO_CARD_MAX_RELOADS = 2;
const SEARCH_ZERO_CARD_STATE_TTL_MS = 600000;
const SEARCH_ZERO_CARD_NETWORK_WAIT_MS = 30000;
const SEARCH_ZERO_CARD_POLL_MS = 700;
let pausedTask = null;
let currentTask = null;
let currentRunningSource = null;
let pausedForSubview = false;
let pendingTaskRestart = false;
let allowSpecificReprocess = false;
let videoMainCommentedVideoIds = new Set();
let radarSessionStateModule = null;
try {
  radarSessionStateModule = require("./shared/radarSessionState");
} catch (error) {
  console.error("[Built-in-Debug] 任务断点兼容模块加载失败:", error);
}
function getRadarSessionStateMethod(arg1) {
  const local = radarSessionStateModule?.[arg1];
  if (typeof local !== "function") {
    throw new Error("任务断点兼容模块缺少 " + arg1);
  }
  return local;
}
function legacyRadarSessionKey(arg1) {
  const local = arg1 || window._radar_account_id || "default";
  return getRadarSessionStateMethod("buildLegacyRadarSessionKey")(local);
}
function radarSessionKey(arg1, arg2 = null) {
  const local = arg1 || window._radar_account_id || "default";
  const local2 = arg2 || activeLoopId || currentTask?.taskId || "";
  return getRadarSessionStateMethod("buildRadarSessionKey")(local, local2);
}
function readRadarSessionState(arg1, arg2, {
  migrateLegacy = false
} = {}) {
  const local = arg1 || window._radar_account_id || "default";
  const local2 = arg2 || activeLoopId || currentTask?.taskId || "";
  return getRadarSessionStateMethod("readRadarSessionState")(localStorage, {
    accountId: local,
    taskId: local2,
    migrateLegacy: migrateLegacy
  });
}
function restoreAutomationSessionLimits(arg1, arg2) {
  return getRadarSessionStateMethod("restoreAutomationSessionLimits")(arg1, arg2);
}
function logTaskDbg(arg1, arg2, arg3 = null) {
  const value = arg3 ? " " + JSON.stringify(arg3) : "";
  console.log("[Built-in-Debug] [" + arg1 + "] " + arg2 + value);
}
let sessionInteractionCount = 0;
let sessionInteractionLimit = Infinity;
let sessionFollowCount = 0;
let sessionFollowLimit = Infinity;
let sessionDmCount = 0;
let sessionDmLimit = Infinity;
let sessionFollowLimitLogged = false;
let sessionDmLimitLogged = false;
const _TOUCH_TYPES = ["like", "reply", "follow", "message", "profileComment"];
const _TOUCH_TYPE_LABELS = {
  like: "点赞",
  reply: "回复",
  follow: "关注",
  message: "私信",
  profileComment: "评论"
};
function _touchEntryAt(arg1) {
  return Number(arg1?.at || arg1?.timestamp || 0);
}
function _pickTouchContent(arg1) {
  for (const item of arg1) {
    const result = (item?.content || "").trim();
    if (result) {
      return result;
    }
  }
  return "";
}
function _normalizeTouchLogEntries(arg1) {
  if (!Array.isArray(arg1) || !arg1.length) {
    return [];
  }
  const result = arg1.map(arg1 => ({
    ...arg1
  }));
  const set = new Set();
  const list = [];
  for (let num = 0; num < result.length; num++) {
    if (set.has(num)) {
      continue;
    }
    const value = result[num];
    const result2 = _touchEntryAt(value);
    const local = value.accountName || "";
    if (value.type === "reply" || value.type === "profileComment") {
      const list2 = [num];
      for (let num2 = 0; num2 < result.length; num2++) {
        if (num2 === num || set.has(num2)) {
          continue;
        }
        const value = result[num2];
        if (value.type !== "reply" && value.type !== "profileComment") {
          continue;
        }
        if ((value.accountName || "") !== local) {
          continue;
        }
        const result3 = _touchEntryAt(value);
        if (result2 && result3 && Math.abs(result3 - result2) > 15000) {
          continue;
        }
        list2.push(num2);
      }
      const result3 = list2.some(arg1 => result[arg1].type === "reply");
      const result4 = list2.some(arg1 => result[arg1].type === "profileComment");
      if (result3 && result4) {
        const result2 = list2.map(arg1 => result[arg1]);
        list2.forEach(arg1 => set.add(arg1));
        const local = result2.map(arg1 => _touchEntryAt(arg1)).find(Boolean) || Date.now();
        const local2 = result2.find(arg1 => arg1.type === "profileComment") || result2[0];
        list.push({
          ...local2,
          type: "profileComment",
          label: _TOUCH_TYPE_LABELS.profileComment,
          content: _pickTouchContent(result2),
          at: local
        });
        continue;
      }
    }
    set.add(num);
    list.push({
      ...value,
      label: value.type === "profileComment" ? _TOUCH_TYPE_LABELS.profileComment : value.label || _TOUCH_TYPE_LABELS[value.type] || value.type,
      at: result2 || Date.now()
    });
  }
  const result2 = list.sort((arg1, arg2) => _touchEntryAt(arg2) - _touchEntryAt(arg1));
  const set2 = new Set();
  return result2.filter(arg1 => {
    const result = _touchEntryAt(arg1);
    if (arg1.type === "profileComment") {
      const value = arg1.type + "|" + (arg1.accountName || "") + "|" + (result ? Math.floor(result / 120000) : 0);
      if (set2.has(value)) {
        return false;
      }
      set2.add(value);
      return true;
    }
    const value = result ? Math.floor(result / 1000) : 0;
    const result2 = String(arg1.content || "").trim().slice(0, 80);
    const value2 = arg1.type + "|" + (arg1.accountName || "") + "|" + result2 + "|" + value;
    if (set2.has(value2)) {
      return false;
    }
    set2.add(value2);
    return true;
  });
}
function _syncTouchCountsFromLog(arg1) {
  const result = _createEmptyTouchCounts();
  for (const item of arg1.touchLog || []) {
    if (_TOUCH_TYPES.includes(item.type)) {
      result[item.type] += 1;
    }
  }
  arg1.touchCounts = result;
}
function _createEmptyTouchCounts() {
  return {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0
  };
}
function _normalizeTouchCounts(arg1) {
  const result = _createEmptyTouchCounts();
  if (!arg1 || typeof arg1 !== "object") {
    return result;
  }
  _TOUCH_TYPES.forEach(arg12 => {
    const result2 = Number(arg1[arg12]);
    result[arg12] = Number.isFinite(result2) && result2 > 0 ? Math.floor(result2) : 0;
  });
  return result;
}
function _migrateTouchCountsFromLegacy(arg1) {
  if (!arg1) {
    return _createEmptyTouchCounts();
  }
  const result = _normalizeTouchCounts(arg1.touchCounts);
  if (_TOUCH_TYPES.reduce((arg1, arg2) => arg1 + result[arg2], 0) > 0) {
    return result;
  }
  const result2 = _createEmptyTouchCounts();
  if (arg1.liked || arg1.actions?.liked) {
    result2.like = 1;
  }
  const local = (arg1.touchCounts?.profileComment || 0) > 0 || Array.isArray(arg1.touchLog) && arg1.touchLog.some(arg1 => arg1.type === "profileComment") || !!arg1.actions?.profileWorkCommented && !!arg1.profileCommentAt;
  if (local) {
    result2.profileComment = 1;
  } else if (arg1.replied || arg1.actions?.replied) {
    result2.reply = 1;
  }
  if (arg1.followed || arg1.actions?.followed) {
    result2.follow = 1;
  }
  if (arg1.messaged || arg1.actions?.messaged) {
    result2.message = 1;
  }
  return result2;
}
const leadTouch = {
  ensureLeadMeta(arg1) {
    if (!arg1) {
      return arg1;
    }
    if (!Array.isArray(arg1.touchLog)) {
      arg1.touchLog = [];
    }
    arg1.touchCounts = _migrateTouchCountsFromLegacy(arg1);
    if (arg1.worksCount === undefined) {
      arg1.worksCount = null;
    }
    return arg1;
  },
  recordTouchOnLead(arg1, arg2) {
    if (!arg1 || !arg2?.type || !_TOUCH_TYPES.includes(arg2.type)) {
      return arg1;
    }
    leadTouch.ensureLeadMeta(arg1);
    const local = arg2.at || Date.now();
    const local2 = arg2.source || "acquire";
    const local3 = arg2.channel || (local2 === "batch" ? "线索库批量" : "自动获客");
    const local4 = arg2.accountName || arg1.accountName || "";
    let local5 = arg2.content || "";
    if (arg2.type === "profileComment") {
      const result = arg1.touchLog.filter(arg1 => arg1.type === "reply" && (arg1.accountName || "") === local4 && (!_touchEntryAt(arg1) || !local || Math.abs(_touchEntryAt(arg1) - local) < 15000));
      if (!local5.trim() && result.length) {
        local5 = _pickTouchContent(result);
      }
      if (result.length) {
        arg1.touchLog = arg1.touchLog.filter(arg1 => !result.includes(arg1));
      }
    }
    const result = arg1.touchLog.some(arg1 => {
      if (arg1.type !== arg2.type) {
        return false;
      }
      if ((arg1.accountName || "") !== local4) {
        return false;
      }
      if (arg2.type === "profileComment") {
        const result = _touchEntryAt(arg1);
        return result && Math.abs(result - local) < 120000;
      }
      return Math.abs(_touchEntryAt(arg1) - local) < 2500;
    });
    if (result) {
      return arg1;
    }
    arg1.touchCounts[arg2.type] = (arg1.touchCounts[arg2.type] || 0) + 1;
    arg1.touchLog.unshift({
      type: arg2.type,
      label: arg2.type === "profileComment" ? _TOUCH_TYPE_LABELS.profileComment : _TOUCH_TYPE_LABELS[arg2.type] || arg2.type,
      at: local,
      content: local5,
      accountName: local4,
      success: arg2.success !== false,
      source: local2,
      channel: local3
    });
    arg1.touchLog = _normalizeTouchLogEntries(arg1.touchLog);
    _syncTouchCountsFromLog(arg1);
    if (arg1.touchLog.length > 200) {
      arg1.touchLog.length = 200;
    }
    return arg1;
  }
};
function extractUserKeyFromUrl(arg1) {
  if (!arg1 || typeof arg1 !== "string") {
    return "";
  }
  try {
    let result = arg1.trim();
    if (result.startsWith("//")) {
      result = "https:" + result;
    }
    if (!result.startsWith("http")) {
      result = "https://www.douyin.com" + (result.startsWith("/") ? result : "/" + result);
    }
    const url = new URL(result);
    const result2 = url.pathname.match(/\/user\/([^/?#]+)/i);
    if (result2 && result2[1]) {
      const result = decodeURIComponent(result2[1]);
      if (result && !["self", "login"].includes(result.toLowerCase())) {
        return result;
      }
    }
    const result3 = url.pathname.match(/\/user\/profile\/([^/?#]+)/i);
    if (result3 && result3[1]) {
      return decodeURIComponent(result3[1]);
    }
  } catch (error) {}
  return "";
}
function normalizeUserUrl(arg1) {
  if (!arg1) {
    return "";
  }
  try {
    const url = new URL(arg1.startsWith("http") ? arg1 : "https://www.douyin.com" + (arg1.startsWith("/") ? arg1 : "/" + arg1));
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch (error) {
    return arg1;
  }
}
function buildLeadIdFromLead(arg1, arg2, arg3) {
  const result = extractUserKeyFromUrl(arg1);
  if (result) {
    return result;
  }
  const result2 = (arg2 || "").trim();
  const result3 = (arg3 || "").trim();
  if (result2 && result3) {
    return result2 + "_" + result3;
  }
  if (result2) {
    return result2;
  }
  return "unknown_" + Date.now();
}
function getLeadPrimaryKey(arg1) {
  if (!arg1) {
    return "";
  }
  return arg1.leadId || extractUserKeyFromUrl(arg1.userUrl) || buildLeadIdFromLead(arg1.userUrl, arg1.nickname, arg1.content);
}
function getLeadAliasKeys(arg1) {
  const set = new Set();
  const result = getLeadPrimaryKey(arg1);
  if (result) {
    set.add(result);
  }
  const result2 = extractUserKeyFromUrl(arg1?.userUrl);
  if (result2) {
    set.add(result2);
  }
  const result3 = normalizeUserUrl(arg1?.userUrl);
  if (result3) {
    set.add(result3);
  }
  if (arg1?.nickname) {
    set.add(arg1.nickname);
  }
  return [...set];
}
function isLeadInSession(arg1) {
  return getLeadAliasKeys(arg1).some(arg1 => interactedInSession.has(arg1));
}
function isLeadInKnownPool(arg1) {
  const local = currentTask?.interactedUsers;
  if (!local?.length) {
    return false;
  }
  return getLeadAliasKeys(arg1).some(arg1 => local.includes(arg1));
}
const KNOWN_LEAD_LOOKUP_CACHE_LIMIT = 5000;
let knownLeadLookupTaskToken = "";
const knownLeadLookupCache = new Map();
function rememberKnownLeadLookup(arg1, arg2) {
  if (!arg1) {
    return;
  }
  if (knownLeadLookupCache.has(arg1)) {
    knownLeadLookupCache.delete(arg1);
  }
  knownLeadLookupCache.set(arg1, !!arg2);
  while (knownLeadLookupCache.size > KNOWN_LEAD_LOOKUP_CACHE_LIMIT) {
    const value = knownLeadLookupCache.keys().next().value;
    knownLeadLookupCache.delete(value);
  }
}
async function queryKnownLeadKeys(arg1) {
  const result = String(currentTask?.taskId || currentTask?.batchRunId || currentTask?.runId || "");
  if (result !== knownLeadLookupTaskToken) {
    knownLeadLookupTaskToken = result;
    knownLeadLookupCache.clear();
  }
  const set = new Set();
  const list = [];
  const set2 = new Set(Array.isArray(currentTask?.interactedUsers) ? currentTask.interactedUsers : []);
  for (const item of Array.isArray(arg1) ? arg1 : []) {
    for (const item2 of getLeadAliasKeys(item)) {
      if (set2.has(item2) || knownLeadLookupCache.get(item2) === true) {
        set.add(item2);
      } else if (!knownLeadLookupCache.has(item2)) {
        list.push(item2);
      }
    }
  }
  const list2 = [...new Set(list)];
  if (!list2.length) {
    return set;
  }
  try {
    for (let num = 0; num < list2.length; num += 200) {
      const result = list2.slice(num, num + 200);
      const result2 = await ipcRenderer.invoke("check-interacted-user-keys", {
        keys: result
      });
      if (!result2?.complete || !Array.isArray(result2.matched)) {
        return null;
      }
      const set2 = new Set(result2.matched.map(arg1 => String(arg1 || "").trim()).filter(Boolean));
      result.forEach(arg1 => {
        const result = set2.has(arg1);
        rememberKnownLeadLookup(arg1, result);
        if (result) {
          set.add(arg1);
        }
      });
    }
    return set;
  } catch (error) {
    console.warn("[Built-in-Debug] 历史线索批量去重查询失败，使用任务内兼容数据:", error?.message || error);
    return null;
  }
}
function rememberCurrentTaskInteractedKey(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || !currentTask) {
    return false;
  }
  if (!Array.isArray(currentTask.interactedUsers)) {
    currentTask.interactedUsers = [];
  }
  if (!currentTask.interactedUsers.includes(result)) {
    currentTask.interactedUsers.push(result);
    if (currentTask.interactedUsers.length > KNOWN_LEAD_LOOKUP_CACHE_LIMIT) {
      currentTask.interactedUsers.splice(0, currentTask.interactedUsers.length - KNOWN_LEAD_LOOKUP_CACHE_LIMIT);
    }
    return true;
  }
  return false;
}
function markLeadInSession(arg1) {
  getLeadAliasKeys(arg1).forEach(arg1 => {
    interactedInSession.add(arg1);
    rememberCurrentTaskInteractedKey(arg1);
  });
}
function syncEntryContext(arg1, arg2, arg3) {
  window._radar_entry_context = {
    videoSource: arg1,
    searchKeyword: arg2 ?? null,
    entryLabel: arg3
  };
}
function applyEntryMetaToLead(arg1) {
  const local = window._radar_entry_context || {};
  if (!arg1.entrySource && local.videoSource) {
    arg1.entrySource = local.videoSource;
  }
  if (arg1.searchKeyword === undefined) {
    arg1.searchKeyword = local.searchKeyword ?? null;
  }
  if (!arg1.entryLabel && local.entryLabel) {
    arg1.entryLabel = local.entryLabel;
  }
  leadTouch.ensureLeadMeta(arg1);
  return arg1;
}
function summarizeLeadTouchForBlacklist(arg1) {
  const local = arg1?.touchCounts || {};
  const obj = {
    like: "点赞",
    reply: "回复",
    follow: "关注",
    message: "私信",
    profileComment: "首作评论"
  };
  const result = Object.keys(obj).filter(arg1 => (local[arg1] || 0) > 0).map(arg1 => obj[arg1]);
  if (result.length) {
    return result.join("·");
  } else {
    return "已触达";
  }
}
function buildBlacklistEntry(arg1, arg2) {
  const result = normalizeUserUrl(arg1.userUrl);
  const value = arg2.platform === "douyin" ? "DY" : arg2.platform;
  return {
    id: result || arg1.nickname,
    nickname: arg1.nickname,
    userUrl: arg1.userUrl,
    platform: value,
    accountId: arg2.accountId || "default",
    accountName: window._radar_account_name || arg2?.nickname || arg2?.name || "本账号",
    taskName: arg2?.taskName || "无",
    timestamp: Date.now(),
    touchSummary: summarizeLeadTouchForBlacklist(arg1),
    lastChannel: arg2?.isBatchAction ? "线索库批量" : arg2?.taskName?.includes("批量") ? "线索库批量" : "自动获客"
  };
}
function recordLeadTouch(arg1, arg2, options = {}) {
  if (!arg1) {
    return;
  }
  const result = Date.now();
  const local = options.accountName || window._radar_account_name || currentTask?.nickname || "主账号";
  if (arg2 === "profileComment") {
    if ((arg1.touchCounts?.profileComment || 0) > 0) {
      arg1.actions = arg1.actions || {};
      arg1.actions.profileWorkCommented = true;
      arg1.replied = true;
      arg1.actions.replied = true;
      if (options.content && !arg1.replyContent) {
        arg1.replyContent = options.content;
        arg1.actions.replyContent = options.content;
      }
      return;
    }
    const result2 = String(options.content || "").trim();
    const result3 = (arg1.touchLog || []).some(arg1 => {
      if (arg1.type !== "profileComment") {
        return false;
      }
      if ((arg1.accountName || "") !== local) {
        return false;
      }
      const result2 = _touchEntryAt(arg1);
      return result2 && Math.abs(result - result2) < 120000;
    });
    if (result3) {
      arg1.actions = arg1.actions || {};
      arg1.actions.profileWorkCommented = true;
      arg1.replied = true;
      arg1.actions.replied = true;
      return;
    }
  }
  leadTouch.recordTouchOnLead(arg1, {
    type: arg2,
    content: options.content,
    at: options.at || result,
    accountName: local,
    success: options.success !== false,
    source: options.source || "acquire"
  });
  arg1.lastTouchAt = options.at || result;
  arg1.actions = arg1.actions || {};
  switch (arg2) {
    case "like":
      arg1.liked = true;
      arg1.actions.liked = true;
      break;
    case "reply":
      arg1.replied = true;
      arg1.actions.replied = true;
      if (options.content) {
        arg1.replyContent = options.content;
        arg1.actions.replyContent = options.content;
      }
      break;
    case "follow":
      arg1.followed = true;
      arg1.actions.followed = true;
      break;
    case "message":
      arg1.messaged = true;
      arg1.actions.messaged = true;
      if (options.content) {
        arg1.dmContent = options.content;
        arg1.actions.dmContent = options.content;
      }
      break;
    case "profileComment":
      arg1.replied = true;
      arg1.actions.replied = true;
      arg1.actions.profileWorkCommented = true;
      arg1.profileCommentAt = options.at || result;
      if (options.content) {
        arg1.replyContent = options.content;
        arg1.actions.replyContent = options.content;
      }
      break;
  }
}
function buildTaskFinishedPayload(arg1, text = "completed") {
  const value = Number.isFinite(Number(targetVideoCount)) ? Number(targetVideoCount) : 0;
  const value2 = Number.isFinite(Number(sessionProcessedCount)) ? Number(sessionProcessedCount) : 0;
  const value3 = Number.isFinite(Number(sessionInteractionCount)) ? Number(sessionInteractionCount) : 0;
  const local = Number.isFinite(Number(sessionInteractionLimit)) && sessionInteractionLimit !== Infinity;
  return {
    taskId: arg1,
    accountId: window._radar_account_id || currentTask?.accountId || null,
    reason: text,
    progress: {
      videos: {
        planned: value,
        done: value2
      },
      interactions: {
        planned: local ? Number(sessionInteractionLimit) : null,
        done: value3
      }
    }
  };
}
function buildTaskFinishMessage(arg1, options = {}) {
  const result = String(arg1 || "completed");
  switch (result) {
    case "specific_all_processed":
      return "任务结束：指定视频 " + (options.configuredCount || 0) + " 条已无待处理链接（可能已被其他账号领完，或本轮已全部跳过）";
    case "specific_pool_empty":
      return "任务结束：指定视频抢活池已空（配置 " + (options.configuredCount || 0) + " 条，可能已被其他账号领完）";
    case "specific_empty":
      return "任务结束：未配置指定视频链接";
    case "specific_completed":
      if (options.configuredCount != null) {
        return "任务结束：指定视频已全部处理（" + options.configuredCount + " 条）";
      }
      return "任务结束：指定视频列表已全部处理完毕";
    case "all_sources_completed":
      {
        const local = options.viewed ?? sessionProcessedCount ?? 0;
        const local2 = options.planned ?? targetVideoCount ?? 0;
        return "任务结束：全部视频入口已完成（本次浏览 " + local + "/" + local2 + " 个视频）";
      }
    case "interaction_limit_reached":
      {
        const local = options.current ?? sessionInteractionCount ?? 0;
        const local2 = options.limit ?? sessionInteractionLimit ?? 0;
        return "任务结束：互动总量已达上限（" + local + "/" + local2 + "），自动停止";
      }
    case "startup_aborted":
      return "任务结束：未启动（" + clipTraceText(options.detail || "配置异常", 80) + "）";
    case "manual_stop":
      return "任务结束：已手动停止";
    case "loop_stopped":
      return "任务结束：任务循环已退出";
    case "like_list_empty":
      return "任务结束：喜欢列表没有检测到视频作品";
    case "like_list_completed":
      return "任务结束：喜欢列表中的视频均已处理完毕";
    case "comment_publish_failed":
      return "任务结束：评论发布失败，账号任务已停止";
    default:
      return "任务结束：已正常完成";
  }
}
function taskFinishLogLevel(arg1) {
  const set = new Set(["specific_all_processed", "specific_pool_empty", "specific_empty", "startup_aborted", "interaction_limit_reached", "comment_publish_failed", "like_list_empty", "loop_stopped"]);
  if (set.has(String(arg1 || ""))) {
    return "warning";
  } else {
    return "normal";
  }
}
async function finalizeAccountTask(arg1, arg2, options = {}, options2 = {}) {
  const {
    storageKey = null,
    drainAiQueue = false,
    stopRunning = true
  } = options2;
  const result = buildTaskFinishMessage(arg2, options);
  const result2 = taskFinishLogLevel(arg2);
  reportCommentFlowTrace("finalizeAccountTask", "reason=" + arg2 + " stopRunning=" + stopRunning);
  reportTraceLog("🏁 " + result, null, result2);
  logTaskDbg("任务结束", result, {
    reason: arg2,
    ...options
  });
  if (drainAiQueue && scrapeAiQueue.length > 0) {
    await processScrapeAiQueue();
  }
  if (storageKey) {
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
      const result = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (result.loopId === arg1) {
        result.finishedAt = Date.now();
        result.finishReason = arg2;
        localStorage.setItem(storageKey, JSON.stringify(result));
      }
    } catch (error) {}
  }
  try {
    trimRuntimeMemory(document.body, "task-finished:" + arg2);
  } catch (error) {}
  ipcRenderer.send("automation-data", {
    type: "status",
    payload: {
      accountId: window._radar_account_id,
      status: "finished",
      finishReason: arg2,
      finishMessage: result
    }
  });
  if (stopRunning) {
    currentRunningSource = null;
    taskRunning = false;
    allowSpecificReprocess = false;
    syncSpecificVideoPauseWatcher();
  }
  ipcRenderer.send("task-finished", buildTaskFinishedPayload(arg1, arg2));
}
console.log("[Built-in-Debug] !!! 自动化引擎 V5.2：Main World 降维点击版启动 !!!");
const PLATFORM_SELECTORS = {
  "douyin.com": {}
};
let remoteRuntimeConfig = null;
function pickRemoteStringList(arg1) {
  if (!Array.isArray(arg1)) {
    return [];
  }
  return arg1.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
}
function getGatedTextPack(arg1) {
  const local = remoteRuntimeConfig?.gated?.[arg1];
  return {
    exactTexts: pickRemoteStringList(local?.exactTexts),
    preferredTexts: pickRemoteStringList(local?.preferredTexts)
  };
}
function getGatedVariantList(arg1) {
  return pickRemoteStringList(remoteRuntimeConfig?.gated?.[arg1]);
}
function getGatedString(arg1) {
  const local = remoteRuntimeConfig?.gated?.[arg1];
  if (typeof local === "string" && local.trim()) {
    return local.trim();
  } else {
    return "";
  }
}
function hasRemoteGatedConfig() {
  return Boolean(remoteRuntimeConfig?.gated);
}
function getCommentV2String(arg1) {
  const local = remoteRuntimeConfig?.commentV2?.[arg1];
  if (typeof local === "string" && local.trim()) {
    return local.trim();
  } else {
    return "";
  }
}
function getCommentV2List(arg1) {
  return pickRemoteStringList(remoteRuntimeConfig?.commentV2?.[arg1]);
}
function getCommentV2Number(arg1) {
  const local = remoteRuntimeConfig?.commentV2?.[arg1];
  const result = Number(local);
  if (Number.isFinite(result)) {
    return result;
  } else {
    return null;
  }
}
function getVideoEngageV2String(arg1) {
  const local = remoteRuntimeConfig?.videoEngageV2?.[arg1];
  if (typeof local === "string" && local.trim()) {
    return local.trim();
  } else {
    return "";
  }
}
function getDmV2String(arg1) {
  const local = remoteRuntimeConfig?.dmV2?.[arg1];
  if (typeof local === "string" && local.trim()) {
    return local.trim();
  } else {
    return "";
  }
}
function getDmV2List(arg1) {
  return pickRemoteStringList(remoteRuntimeConfig?.dmV2?.[arg1]);
}
const PROFILE_ACTION_RUNTIME_STRING_KEYS = ["profileFollowBtn", "profileMessageBtn", "profileName"];
const DM_RUNTIME_REQUIRED_STRING_KEYS = [...PROFILE_ACTION_RUNTIME_STRING_KEYS, "dmInput", "dmSendBtn", "dmSendPrimary", "dmExplicitSendSvg", "dmDialog", "dmInputHint", "dmSendSvgCandidates", "dmSendClickableRoot", "dmSendTextCandidates", "conversationItem", "conversationTitle", "conversationPreview", "conversationUnread", "conversationAvatar", "conversationAvatarRoot", "dmBlockActiveRoots", "dmBlockNodeCandidates", "dmBlockGlobalHints", "dmMessageItems", "dmHistoryMessageItems", "dmMessageContainer", "dmFailureCandidates", "dmFailureIconInner", "groupRowHints", "groupAvatarImages", "conversationHeader"];
function hasProfileActionRuntimeReady() {
  if (!PROFILE_ACTION_RUNTIME_STRING_KEYS.every(arg1 => !!getDmV2String(arg1))) {
    return false;
  }
  const list = ["profileReadyPattern", "actionButtonCandidates", "actionClickableRoot", "profilePositiveContextPattern", "profileRejectContextPattern", "profileRejectOverlaySelector", "profileRejectNoticeSelector"];
  if (!list.every(arg1 => !!getGatedString(arg1))) {
    return false;
  }
  return getGatedTextPack("profileFollow").exactTexts.length > 0 && getGatedTextPack("profileMessage").exactTexts.length > 0;
}
function hasDmRuntimeReady() {
  if (!hasProfileActionRuntimeReady()) {
    return false;
  }
  if (!DM_RUNTIME_REQUIRED_STRING_KEYS.every(arg1 => !!getDmV2String(arg1))) {
    return false;
  }
  return getDmV2List("strangerFolderTexts").length > 0 && getDmV2List("sendExactTexts").length > 0 && getDmV2List("sendSvgHints").length > 0 && getGatedTextPack("dmSend").exactTexts.length > 0;
}
function getVideoEngagePack() {
  const local = remoteRuntimeConfig?.videoEngageV2;
  if (local && typeof local === "object") {
    return local;
  } else {
    return null;
  }
}
function hasVideoEngageRuntimeReady() {
  const result = getVideoEngagePack();
  if (!result) {
    return false;
  }
  const result2 = getVideoEngageV2String("likeSelectors");
  const result3 = getVideoEngageV2String("collectSelectors");
  const result4 = getVideoEngageV2String("shareSelectors");
  return !!result2 || !!result3 || !!result4;
}
const COMMENT_RUNTIME_REQUIRED_STRING_KEYS = ["commentInput", "openCommentBtns", "commentPanel", "emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector", "commentFloatingChrome", "commentComposerChrome", "commentStickerImageSelector", "commentStickerAltPattern", "commentAvatarImagePattern"];
function hasCommentRuntimeReady() {
  if (!hasRemoteGatedConfig()) {
    return false;
  }
  if (!COMMENT_RUNTIME_REQUIRED_STRING_KEYS.every(arg1 => !!getCommentV2String(arg1))) {
    return false;
  }
  return ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"].every(arg1 => Number(getCommentV2Number(arg1)) > 0);
}
function matchesPlaceholderHint(arg1) {
  const result = getCommentV2List("placeholderHints");
  if (!result.length) {
    return false;
  }
  const result2 = String(arg1 || "");
  return result.some(arg1 => result2.includes(arg1));
}
function isReplyBtnText(arg1) {
  const result = getCommentV2List("replyBtnTexts");
  if (!result.length) {
    return false;
  }
  const result2 = String(arg1 || "").replace(/\s+/g, " ").trim();
  return result.includes(result2);
}
function getCommentTabPrefix() {
  return getCommentV2String("commentTabPrefix");
}
function applyRemoteRuntimeConfig(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return;
  }
  remoteRuntimeConfig = arg1;
  const value = PLATFORM_SELECTORS["douyin.com"];
  const set = new Set(PROFILE_ACTION_RUNTIME_STRING_KEYS.concat(["dmInput", "dmSendBtn"]));
  for (const item of set) {
    delete value[item];
  }
  const local = arg1.selectors?.["douyin.com"];
  if (local && typeof local === "object") {
    for (const [local2, local3] of Object.entries(local)) {
      if (set.has(local2)) {
        continue;
      }
      if (typeof local3 === "string" && local3.trim()) {
        value[local2] = local3.trim();
      }
    }
  }
  const result = getCommentV2String("commentPanel");
  const result2 = getCommentV2String("commentItem");
  const result3 = getCommentV2String("openCommentBtns");
  if (result) {
    value.commentPanel = result;
  }
  if (result2) {
    value.commentItem = result2;
  }
  if (result3) {
    value.commentBtn = result3;
  }
  for (const item of set) {
    const result = getDmV2String(item);
    if (result) {
      value[item] = result;
    }
  }
  const value2 = arg1.urls && typeof arg1.urls === "object" ? Object.keys(arg1.urls).length : 0;
  const value3 = arg1.apiHooks && typeof arg1.apiHooks === "object" ? Object.keys(arg1.apiHooks).length : 0;
  console.log("[Built-in-Debug] [RuntimeConfig] 已应用 version=" + (arg1.version || "-") + (" commentV2=" + (hasCommentRuntimeReady() ? "ready" : "missing")) + (" videoEngageV2=" + (hasVideoEngageRuntimeReady() ? "ready" : "missing")) + (" profileActions=" + (hasProfileActionRuntimeReady() ? "ready" : "missing")) + (" dmV2=" + (hasDmRuntimeReady() ? "ready" : "missing")) + (" urls=" + value2 + " apiHooks=" + value3));
}
ipcRenderer.on("apply-runtime-config", (arg1, arg2) => {
  try {
    applyRemoteRuntimeConfig(arg2);
  } catch (error) {
    console.warn("[Built-in-Debug] [RuntimeConfig] 应用失败，gated 文案不可用:", error?.message || error);
  }
});
const {
  DEFAULT_DOUYIN_URLS,
  getDouyinRecommendUrl: resolveDouyinRecommendUrl,
  getDouyinFollowUrl: resolveDouyinFollowUrl,
  getDouyinLikeEntryUrl: resolveDouyinLikeEntryUrl,
  buildDouyinSearchUrl: resolveDouyinSearchUrl
} = require("./shared/douyinRuntimeUrls");
const DOUYIN_RECOMMEND_URL = DEFAULT_DOUYIN_URLS.douyinRecommend;
const DOUYIN_FOLLOW_URL = DEFAULT_DOUYIN_URLS.douyinFollow;
const DOUYIN_LIKE_ENTRY_URL = DEFAULT_DOUYIN_URLS.douyinLikeEntry;
const DOUYIN_LIKE_ENTRY_NAV_KEY = "radar_like_entry_navigation_at";
const DOUYIN_LIKE_ENTRY_NAV_TTL_MS = 120000;
function getRuntimeUrls() {
  return remoteRuntimeConfig?.urls || null;
}
function getRuntimeApiHooks() {
  return remoteRuntimeConfig?.apiHooks || null;
}
function getDouyinRecommendUrl() {
  return resolveDouyinRecommendUrl(getRuntimeUrls());
}
function getDouyinFollowUrl() {
  return resolveDouyinFollowUrl(getRuntimeUrls());
}
function getDouyinLikeEntryUrl() {
  return resolveDouyinLikeEntryUrl(getRuntimeUrls());
}
function buildDouyinSearchUrl(arg1) {
  return resolveDouyinSearchUrl(arg1, getRuntimeUrls());
}
function getSearchZeroCardRecoveryKey(arg1, arg2) {
  return "radar_search_zero_cards_" + String(arg1 || "unknown") + "_" + encodeURIComponent(String(arg2 || "").trim());
}
function readSearchZeroCardRecoveryState(arg1, arg2) {
  const result = getSearchZeroCardRecoveryKey(arg1, arg2);
  try {
    const result2 = JSON.parse(sessionStorage.getItem(result) || "{}");
    if (!result2.updatedAt || Date.now() - Number(result2.updatedAt) > SEARCH_ZERO_CARD_STATE_TTL_MS) {
      sessionStorage.removeItem(result);
      return {
        scans: 0,
        reloads: 0,
        emptyConfirmations: 0,
        exhausted: false
      };
    }
    return {
      scans: Math.max(0, Number(result2.scans) || 0),
      reloads: Math.max(0, Number(result2.reloads) || 0),
      emptyConfirmations: Math.max(0, Number(result2.emptyConfirmations) || 0),
      exhausted: result2.exhausted === true
    };
  } catch (error) {
    return {
      scans: 0,
      reloads: 0,
      emptyConfirmations: 0,
      exhausted: false
    };
  }
}
function saveSearchZeroCardRecoveryState(arg1, arg2, arg3) {
  try {
    sessionStorage.setItem(getSearchZeroCardRecoveryKey(arg1, arg2), JSON.stringify({
      scans: Math.max(0, Number(arg3?.scans) || 0),
      reloads: Math.max(0, Number(arg3?.reloads) || 0),
      emptyConfirmations: Math.max(0, Number(arg3?.emptyConfirmations) || 0),
      exhausted: arg3?.exhausted === true,
      updatedAt: Date.now()
    }));
  } catch (error) {}
}
function clearSearchZeroCardRecoveryState(arg1, arg2) {
  try {
    sessionStorage.removeItem(getSearchZeroCardRecoveryKey(arg1, arg2));
  } catch (error) {}
}
function clearSearchZeroCardRecoveryStatesForLoop(arg1) {
  const value = "radar_search_zero_cards_" + String(arg1 || "unknown") + "_";
  try {
    const list = [];
    for (let num = 0; num < sessionStorage.length; num += 1) {
      const result = sessionStorage.key(num);
      if (result?.startsWith(value)) {
        list.push(result);
      }
    }
    list.forEach(arg1 => sessionStorage.removeItem(arg1));
  } catch (error) {}
}
function isCurrentTaskUsingProxy(arg1 = currentTask) {
  const local = arg1?.proxy;
  if (typeof local === "string") {
    return local.trim().length > 0;
  }
  if (!local || typeof local !== "object") {
    return false;
  }
  return local.enabled === true && String(local.host || "").trim().length > 0 && Number(local.port) > 0;
}
function getDouyinSearchZeroCardWaitBudgetMs() {
  return SEARCH_ZERO_CARD_NETWORK_WAIT_MS;
}
function getDouyinSearchRenderableContentCounts() {
  const value = Array.from(document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"]")).filter(isVisibleElement).length;
  const value2 = collectDouyinSearchResultCards().filter(arg1 => !!findDouyinSearchCardContentId(arg1)).length;
  return {
    visibleLinks: value,
    contentCards: value2
  };
}
async function waitForDouyinSearchContentAfterZero(arg1, arg2) {
  const flag = isCurrentTaskUsingProxy();
  const result = getDouyinSearchZeroCardWaitBudgetMs();
  const result2 = Date.now();
  let num = 0;
  const result3 = getSearchPageReadyModule();
  const result4 = getSearchApiReadyTracker();
  const result5 = result4.getGeneration();
  const value = typeof result3?.pickRenderSettleMs === "function" ? result3.pickRenderSettleMs() : 4000;
  let num2 = 0;
  while (Date.now() - result2 < result) {
    if (shouldAbort(arg1)) {
      return {
        ready: false,
        aborted: true,
        diagnostics: null
      };
    }
    const local = typeof isDouyinSearchPageContentLoading === "function" && isDouyinSearchPageContentLoading();
    const result6 = getDouyinSearchRenderableContentCounts();
    const result7 = getDouyinSearchZeroDiagnostics({
      standardLinkCount: result6.visibleLinks,
      customCardCount: result6.contentCards
    });
    const result8 = result4.hasFreshResults(result5);
    if (result8 && !num2) {
      num2 = result4.getSignal()?.at || Date.now();
      console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (arg2 || "-") + " 搜索 API 已回报 " + ("awemes=" + (result4.getSignal()?.awemeCount || 0) + "，进入渲染缓冲 " + value + "ms"));
      try {
        reportCurrentAction("搜索接口已返回，等待页面渲染约 " + Math.ceil(value / 1000) + " 秒…");
      } catch (error) {}
    }
    const value2 = typeof result3?.evaluateSearchSlowNetTick === "function" ? result3.evaluateSearchSlowNetTick({
      pageLoading: local,
      domVisibleLinks: result6.visibleLinks,
      domContentCards: result6.contentCards,
      loginGate: !!result7.loginGate,
      emptyResult: !!result7.emptyResult,
      apiHasResults: result8,
      apiReadyAt: num2,
      settleMs: value,
      now: Date.now()
    }) : null;
    if (!value2) {
      if (local) {
        if (Date.now() - num >= 4000) {
          num = Date.now();
          try {
            reportCurrentAction("检测到「加载中」，等待搜索结果加载完成…");
          } catch (error) {}
        }
        await sleep(SEARCH_ZERO_CARD_POLL_MS);
        continue;
      }
      if (result6.visibleLinks > 0 || result6.contentCards > 0) {
        return {
          ready: true,
          aborted: false,
          diagnostics: null,
          waitedMs: Date.now() - result2,
          counts: result6
        };
      }
      if (result7.loginGate || result7.emptyResult) {
        return {
          ready: false,
          aborted: false,
          diagnostics: result7,
          waitedMs: Date.now() - result2,
          counts: result6
        };
      }
      await sleep(SEARCH_ZERO_CARD_POLL_MS);
      continue;
    }
    if (value2.action === "wait_loading") {
      if (Date.now() - num >= 4000) {
        num = Date.now();
        console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (arg2 || "-") + " 仍显示「加载中」 " + ("elapsed=" + (Date.now() - result2) + "/" + result + "ms"));
        try {
          reportCurrentAction("检测到「加载中」，等待搜索结果加载完成…");
        } catch (error) {}
      }
      await sleep(SEARCH_ZERO_CARD_POLL_MS);
      continue;
    }
    if (value2.ready) {
      return {
        ready: true,
        aborted: false,
        diagnostics: null,
        waitedMs: Date.now() - result2,
        counts: result6,
        via: value2.action
      };
    }
    if (value2.action === "login_gate" || value2.action === "empty") {
      return {
        ready: false,
        aborted: false,
        diagnostics: result7,
        waitedMs: Date.now() - result2,
        counts: result6
      };
    }
    if (value2.action === "settle_render") {
      if (Date.now() - num >= 2000) {
        num = Date.now();
        try {
          reportCurrentAction("搜索结果渲染中，约 " + Math.ceil((value2.settleRemainingMs || 0) / 1000) + " 秒…");
        } catch (error) {}
      }
      await sleep(Math.min(SEARCH_ZERO_CARD_POLL_MS, Math.max(200, value2.settleRemainingMs || SEARCH_ZERO_CARD_POLL_MS)));
      continue;
    }
    if (Date.now() - num >= 5000) {
      num = Date.now();
      console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (arg2 || "-") + " " + ("proxy=" + flag + " action=" + value2.action + " ") + ("elapsed=" + (Date.now() - result2) + "/" + result + "ms"));
    }
    await sleep(SEARCH_ZERO_CARD_POLL_MS);
  }
  const result6 = getDouyinSearchRenderableContentCounts();
  const result7 = result4.hasFreshResults(result5);
  return {
    ready: result6.visibleLinks > 0 || result6.contentCards > 0 || result7,
    aborted: false,
    diagnostics: getDouyinSearchZeroDiagnostics({
      standardLinkCount: result6.visibleLinks,
      customCardCount: result6.contentCards
    }),
    waitedMs: Date.now() - result2,
    counts: result6,
    via: result7 ? "api_timeout_fallback" : "timeout"
  };
}
function resetSearchCardOpenFailureState() {
  searchCardOpenFailures.clear();
  searchCardOpenFailureStreak = 0;
}
function pruneSearchCardOpenFailures(arg1 = Date.now()) {
  for (const [local, local2] of searchCardOpenFailures.entries()) {
    if (!local2?.expiresAt || local2.expiresAt <= arg1) {
      searchCardOpenFailures.delete(local);
    }
  }
}
function getSearchCardOpenFailureState(arg1) {
  const result = normalizeUrl(arg1);
  if (!result) {
    return null;
  }
  pruneSearchCardOpenFailures();
  return searchCardOpenFailures.get(result) || null;
}
function shouldSkipSearchCardAfterOpenFailures(arg1) {
  const result = getSearchCardOpenFailureState(arg1);
  return (result?.count || 0) >= SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER;
}
function rememberSearchCardOpenFailure(arg1, text = "detail-timeout") {
  const result = normalizeUrl(arg1);
  if (!result) {
    return 0;
  }
  const result2 = Date.now();
  pruneSearchCardOpenFailures(result2);
  const local = searchCardOpenFailures.get(result) || {};
  const value = (local.count || 0) + 1;
  searchCardOpenFailures.set(result, {
    count: value,
    reason: text,
    lastAt: result2,
    expiresAt: result2 + SEARCH_CARD_OPEN_FAILURE_TTL_MS
  });
  searchCardOpenFailureStreak += 1;
  return value;
}
function rememberSearchCardOpenSuccess(arg1) {
  const result = normalizeUrl(arg1);
  if (result) {
    searchCardOpenFailures.delete(result);
  }
  searchCardOpenFailureStreak = 0;
}
async function reloadCurrentSearchPageAfterOpenFailures(arg1, arg2, text = "搜索结果打开失败") {
  const result = buildDouyinSearchUrl(arg2);
  console.warn("[Built-in-Debug] [搜索页自愈] " + text + "，重载当前关键词搜索页: " + arg2);
  reportCurrentAction("搜索结果页面异常，正在重新加载当前关键词...");
  reportTraceLog("⚠️ 搜索页自愈：" + text + "，重新加载「" + (arg2 || "当前关键词") + "」", null, "warning");
  clearPendingLeadVideoUrl();
  resetSearchCardOpenFailureState();
  prepareSearchPageReload(arg1, arg2, text);
  window.location.href = result;
  await randomDelay(4500, 7000, arg1, "重载搜索页");
}
function isDouyinSearchVideoTabUrl(arg1 = window.location.href) {
  try {
    const url = new URL(arg1);
    return url.hostname.includes("douyin.com") && url.pathname.includes("/search/") && url.searchParams.get("type") === "video";
  } catch (error) {
    return /douyin\.com\/search\/.+[?&]type=video/.test(String(arg1 || ""));
  }
}
function isOnDouyinRecommendPage(arg1 = window.location.href) {
  try {
    const url = new URL(arg1);
    if (!url.hostname.includes("douyin.com")) {
      return false;
    }
    if (url.pathname.includes("/jingxuan")) {
      return false;
    }
    if (/[?&]recommend=1/.test(url.search) && (url.pathname === "/" || url.pathname === "")) {
      return true;
    }
    if (typeof document !== "undefined") {
      const result = document.querySelector(".tab-recommend.OzCCrM8C, .tab-recommend.OL5JF59M, .tab-recommend.Zalb4HfP");
      if (result && !window.location.pathname.includes("/jingxuan")) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
async function ensureDouyinRecommendFeed(arg1) {
  if (isOnDouyinRecommendPage()) {
    return true;
  }
  const result = document.querySelector("a[href*=\"recommend=1\"]");
  if (result && isVisibleElement(result)) {
    console.log("[Built-in-Debug] [导航] 尝试点击侧栏「推荐」Tab...");
    reportCurrentAction("正在切换到推荐页...");
    await simulateHumanClick(result, arg1);
    await randomDelay(3500, 5500, arg1, "切换推荐页");
    if (isOnDouyinRecommendPage()) {
      return true;
    }
  }
  console.log("[Built-in-Debug] [导航] 侧栏切换未生效，强制 load 推荐流 URL:", getDouyinRecommendUrl());
  window.location.href = getDouyinRecommendUrl();
  return false;
}
async function reloadCurrentFeedSource(arg1, arg2) {
  const value = arg2 === "follow" ? "关注列表" : "推荐页";
  const value2 = arg2 === "follow" ? getDouyinFollowUrl() : getDouyinRecommendUrl();
  console.warn("[Built-in-Debug] [导航] 连续卡在已处理视频，重新进入" + value);
  reportCurrentAction("列表滑动受阻，正在重新进入" + value + "...");
  window.location.href = value2;
  await randomDelay(4500, 7000, arg1, "刷新列表");
}
async function reloadRecommendFeedAfterSwitchStall(arg1) {
  console.warn("[Built-in-Debug] [导航] 推荐页视频切换连续未响应，重新进入推荐页");
  reportCurrentAction("推荐页切换受阻，正在刷新推荐页继续浏览...");
  suspendAutomationForNavigation();
  window.location.href = getDouyinRecommendUrl();
  await randomDelay(4500, 7000, arg1, "刷新推荐页");
}
function isOnDouyinSearchPage(arg1 = window.location.href) {
  try {
    const url = new URL(arg1);
    return url.hostname.includes("douyin.com") && url.pathname.includes("/search/");
  } catch (error) {
    return String(arg1 || "").includes("/search/");
  }
}
function isOnDouyinFollowPage(arg1 = window.location.href) {
  try {
    const url = new URL(arg1);
    return url.hostname.includes("douyin.com") && url.pathname.includes("/follow");
  } catch (error) {
    return String(arg1 || "").includes("/follow");
  }
}
function markDouyinLikeEntryNavigation() {
  try {
    sessionStorage.setItem(DOUYIN_LIKE_ENTRY_NAV_KEY, String(Date.now()));
  } catch (error) {}
}
function hasRecentDouyinLikeEntryNavigation() {
  try {
    const result = Number(sessionStorage.getItem(DOUYIN_LIKE_ENTRY_NAV_KEY) || 0);
    return result > 0 && Date.now() - result < DOUYIN_LIKE_ENTRY_NAV_TTL_MS;
  } catch (error) {
    return false;
  }
}
function navigateToDouyinLikeEntry() {
  markDouyinLikeEntryNavigation();
  window.location.href = getDouyinLikeEntryUrl();
}
function findLikeTabElement() {
  const result = Array.from(document.querySelectorAll("[role=\"tab\"], button, a, div, span, p"));
  const result2 = result.find(arg1 => {
    if (!isVisibleElement(arg1) || arg1.children.length > 8) {
      return false;
    }
    const result = (arg1.innerText || "").trim().replace(/\s+/g, "");
    return result.startsWith("喜欢") && result.length <= 10;
  });
  return result2?.closest?.("[role=\"tab\"], button, a") || result2 || null;
}
function isLikeTabActive(arg1) {
  if (!arg1) {
    return false;
  }
  const list = [];
  let local = arg1;
  for (let num = 0; local && num < 4; num += 1) {
    list.push(local);
    local = local.parentElement;
  }
  return list.some(arg1 => {
    const result = String(arg1.className || "");
    return arg1.classList?.contains("active") || arg1.getAttribute("aria-selected") === "true" || arg1.getAttribute("data-active") === "true" || arg1.getAttribute("data-selected") === "true" || /active|selected|current/i.test(result);
  });
}
function getDouyinLikeEntryState(arg1 = window.location.href) {
  const obj = {
    onUser: false,
    hasShowTab: false,
    recentNavigation: hasRecentDouyinLikeEntryNavigation(),
    tabFound: false,
    tabActive: false,
    ready: false
  };
  try {
    const url = new URL(arg1);
    obj.onUser = url.hostname.includes("douyin.com") && url.pathname.includes("/user/");
    obj.hasShowTab = url.searchParams.get("showTab") === "like";
  } catch (error) {
    const result = String(arg1 || "");
    obj.onUser = result.includes("/user/");
    obj.hasShowTab = result.includes("showTab=like");
  }
  const value = typeof document !== "undefined" ? findLikeTabElement() : null;
  obj.tabFound = !!value;
  obj.tabActive = isLikeTabActive(value);
  obj.ready = obj.onUser && (obj.hasShowTab || obj.recentNavigation || obj.tabActive);
  return obj;
}
function isOnDouyinLikeEntryPage(arg1 = window.location.href) {
  return getDouyinLikeEntryState(arg1).ready;
}
async function ensureCurrentSourcePage(arg1, arg2) {
  const value = window.location.href;
  const flag = isViewingDouyinVideoPage(value);
  if (arg2 === "recommend") {
    if (isDouyinFullLivePage(value) && !isDouyinFeedInlineContext()) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务误入直播间，返回推荐流");
      reportCurrentAction("检测到直播间页面，正在返回推荐页...");
      await ensureDouyinRecommendFeed(arg1);
      await randomDelay(3500, 5500, arg1, "离开直播间");
      return false;
    }
    if (isOnDouyinSearchPage(value)) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务却落在搜索页，拉回推荐流");
      reportCurrentAction("检测到误入搜索页，正在返回推荐页...");
      window.location.href = getDouyinRecommendUrl();
      await randomDelay(4000, 6500, arg1, "返回推荐页");
      return false;
    }
    if (value.includes("/jingxuan") && !flag) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务落在精选页，拉回推荐流");
      reportCurrentAction("检测到误入精选页，正在返回推荐页...");
      window.location.href = getDouyinRecommendUrl();
      await randomDelay(4000, 6500, arg1, "返回推荐页");
      return false;
    }
    if (!isOnDouyinRecommendPage(value) && !flag) {
      const result = await ensureDouyinRecommendFeed(arg1);
      if (!result) {
        await randomDelay(3500, 5500, arg1, "进入推荐页");
      }
      return isOnDouyinRecommendPage();
    }
  } else if (arg2 === "follow") {
    if (!isOnDouyinFollowPage(value) && !flag) {
      console.warn("[Built-in-Debug] [导航纠正] 关注入口任务不在关注页，正在跳转");
      reportCurrentAction("正在进入关注列表...");
      window.location.href = "https://www.douyin.com/follow";
      await randomDelay(4000, 6500, arg1, "进入关注页");
      return false;
    }
  } else if (arg2 === "like") {
    const result = value.includes("/user/");
    if (!result && !flag) {
      console.warn("[Built-in-Debug] [导航纠正] 喜欢列表任务不在个人主页，正在跳转");
      reportCurrentAction("正在进入个人喜欢列表...");
      navigateToDouyinLikeEntry();
      await randomDelay(4000, 6500, arg1, "进入喜欢列表页");
      return false;
    }
    if (result && !flag) {
      const result = await ensureLikeTabActive(arg1);
      if (result) {
        return false;
      }
    }
  } else if (arg2 === "specific") {
    const local = window._specificVideoUrls || getSpecificVideoUrlList(currentTask);
    const result = extractSpecificVideoId(value);
    if (result && local.some(arg1 => extractSpecificVideoId(arg1) === result)) {
      if (value.includes("modal_id=") || value.includes("/jingxuan")) {
        return true;
      }
      if (value.includes("/video/") || value.includes("/note/")) {
        const result2 = getSpecificVideoProbeState(result);
        if (result2?.probing) {
          return true;
        }
        logTaskDbg("导航纠正", "指定视频 " + result + "：独立播放页 → jingxuan modal");
        reportCurrentAction("正在优化页面布局...");
        window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + result;
        await randomDelay(4000, 6500, arg1, "切换到 modal 布局");
        return false;
      }
      return true;
    }
    const result2 = extractVideoIdFromHref(value);
    if (result2 && (value.includes("/video/") || value.includes("/note/"))) {
      const result = getSpecificVideoProbeState(result2);
      if (result?.probing) {
        return true;
      }
      logTaskDbg("导航纠正", "指定视频 " + result2 + "：独立播放页 → jingxuan modal");
      reportCurrentAction("正在优化页面布局...");
      window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + result2;
      await randomDelay(4000, 6500, arg1, "切换到 modal 布局");
      return false;
    }
  }
  return true;
}
function isViewingDouyinVideoPage(arg1 = window.location.href) {
  if (arg1.includes("/video/") || arg1.includes("/note/")) {
    return true;
  }
  if (String(arg1 || "").includes("/search/")) {
    try {
      return !!resolveDouyinVideoDetailModal({
        includeFeed: false
      });
    } catch (error) {
      return false;
    }
  }
  if (arg1.includes("modal_id=")) {
    return true;
  }
  try {
    return !!resolveDouyinVideoDetailModal({
      includeFeed: false
    });
  } catch (error) {
    return false;
  }
}
function normalizeProfileUrlForReturn(arg1) {
  if (!arg1 || typeof arg1 !== "string") {
    return "";
  }
  try {
    const url = new URL(arg1.startsWith("http") ? arg1 : "https://www.douyin.com" + (arg1.startsWith("/") ? arg1 : "/" + arg1));
    url.searchParams.delete("modal_id");
    url.searchParams.delete("vid");
    url.searchParams.delete("aweme_id");
    url.searchParams.set("from_tab_name", "main");
    return url.toString();
  } catch (error) {
    const value = arg1.split("#")[0].split("?")[0];
    if (value.includes("from_tab_name=")) {
      return value;
    } else {
      return value + "?from_tab_name=main";
    }
  }
}
function persistSubviewTaskForResume(arg1, options = {}) {
  if (!arg1 || !arg1.lead) {
    return false;
  }
  try {
    localStorage.setItem("radar_pending_subview_task", JSON.stringify({
      ...arg1,
      ...options,
      createdAt: Date.now()
    }));
    safeSessionSet("radar_is_interaction_view", "true");
    if (arg1.viewKey) {
      safeSessionSet("radar_view_key", arg1.viewKey);
    }
    return true;
  } catch (error) {
    console.warn("[子视图] 保存续跑任务失败:", error.message);
    return false;
  }
}
function clearPendingSubviewTask() {
  try {
    localStorage.removeItem("radar_pending_subview_task");
  } catch (error) {}
}
async function restoreProfileAfterWarmup(arg1, arg2, text = "预热结束", arg4 = null) {
  const result = normalizeProfileUrlForReturn(arg1?.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
  await closeAllModals(arg2);
  await sleep(800);
  const value = window.location.href;
  const result2 = Boolean(result && (isViewingDouyinVideoPage(value) || !value.includes("/user/") || !findSmartElementQuiet("profileMessageBtn") && !findSmartElementQuiet("profileFollowBtn")));
  if (result2) {
    console.log("[节奏控制] " + text + "后恢复用户主页: " + result);
    reportCurrentAction(text + "：正在返回用户主页...", arg1?.accountId);
    if (arg4) {
      persistSubviewTaskForResume(arg4, {
        __warmupRestored: true,
        enableWarmup: false
      });
    }
    window.location.href = result;
    return true;
  }
  return false;
}
async function ensureLikeTabActive(arg1) {
  const result = findLikeTabElement();
  if (!result) {
    window._radar_like_tab_wait_count = (window._radar_like_tab_wait_count || 0) + 1;
    if (window._radar_like_tab_wait_count <= 6) {
      console.log("[Built-in-Debug] 未检测到“喜欢”页签，等待主页渲染 (" + window._radar_like_tab_wait_count + "/6)...");
      reportCurrentAction("等待「喜欢」页签渲染中 (" + window._radar_like_tab_wait_count + "/6)...");
      await randomDelay(1200, 2200, arg1, "等待喜欢页签");
      return true;
    }
    console.warn("[Built-in-Debug] 连续未检测到“喜欢”页签，重新进入喜欢列表入口");
    reportCurrentAction("未检测到「喜欢」页签，正在重新进入喜欢列表...");
    navigateToDouyinLikeEntry();
    window._radar_like_tab_wait_count = 0;
    await randomDelay(3500, 5500, arg1, "重新进入喜欢列表");
    return true;
  }
  window._radar_like_tab_wait_count = 0;
  if (result) {
    if (!isLikeTabActive(result)) {
      console.log("[Built-in-Debug] 检测到“喜欢”页签未处于激活状态，正在模拟点击...");
      reportCurrentAction("正在切换到「喜欢」列表页签...");
      reportTraceLog("🎬 轨迹详情：正在点击选择个人主页中的「喜欢」页签");
      await simulateHumanClick(result, arg1);
      await randomDelay(2500, 4500, arg1, "切换喜欢页签");
      return true;
    }
  }
  return false;
}
async function collectLikedVideos(arg1) {
  reportCurrentAction("正在扫描喜欢列表中的视频，请稍候...");
  reportTraceLog("🔍 喜欢列表扫描：正在扫描喜欢列表中的视频，以对齐喜欢列表界限...");
  let set = new Set();
  for (let num = 0; num < 3; num++) {
    if (shouldAbort(arg1)) {
      break;
    }
    const result = findProfileVideoCards({
      ignoreNoWorksGuard: true
    });
    result.forEach(arg1 => {
      let local = arg1.href || arg1.getAttribute("href");
      if (!local) {
        const result = arg1.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
        if (result) {
          local = result.href || result.getAttribute("href");
        }
      }
      const result = normalizeUrl(local || "");
      if (result) {
        set.add(result);
      }
    });
    window.scrollBy(0, 1000);
    reportTraceLog("🎬 轨迹详情：喜欢列表扫描中，滚动加载第 " + (num + 1) + " 次（当前已收集 " + set.size + " 个视频）");
    await sleep(1000);
  }
  window.scrollTo(0, 0);
  await sleep(1500);
  const result = Array.from(set);
  reportTraceLog("✅ 喜欢列表边界扫描完成：对齐 " + result.length + " 个视频（尚未写入线索库，接下来开始入库）");
  return result;
}
function isFeedStyleSource(arg1) {
  return arg1 === "recommend" || arg1 === "follow";
}
function isOnUserProfilePage() {
  try {
    return window.location.pathname.includes("/user/");
  } catch (error) {
    return false;
  }
}
function resolveProfileVideoCommentScope() {
  const list = [];
  const list2 = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[class*=\"SearchDetail\"]", PLATFORM_SELECTORS["douyin.com"].modalContainer];
  for (const item of list2) {
    try {
      document.querySelectorAll(item).forEach(arg1 => {
        if (arg1 && isVisibleElement(arg1)) {
          list.push(arg1);
        }
      });
    } catch (error) {}
  }
  let value = document.body;
  let num = 0;
  for (const item of list) {
    const result = item.getBoundingClientRect();
    const value2 = result.width * result.height;
    if (value2 > num) {
      num = value2;
      value = item;
    }
  }
  if (num < 8000) {
    console.log("[Built-in-Debug] [主页首作评论] 详情容器过小(area=" + Math.round(num) + ")，使用 document.body");
    return document.body;
  }
  console.log("[Built-in-Debug] [主页首作评论] 评论范围=" + value.tagName + " (area≈" + Math.round(num) + ")");
  return value;
}
function getVideoIdFromPageUrl(arg1 = window.location.href) {
  try {
    const url = new URL(arg1);
    return url.searchParams.get("modal_id") || url.pathname.match(/\/(?:video|note)\/(\d{15,})/i)?.[1] || "";
  } catch (error) {
    return "";
  }
}
function hasProfileVideoDetailEvidence(text = "") {
  try {
    const result = getVideoIdFromPageUrl();
    if (result && text && String(result) !== String(text)) {
      return false;
    }
    if (text && isSpecificVideoDetailReady(toSpecificVideoJingxuanUrl(text))) {
      return true;
    }
    const result2 = resolveDouyinVideoDetailModal({
      includeFeed: false
    });
    if (result2 && isVisibleElement(result2)) {
      return true;
    }
    return Array.from(document.querySelectorAll("video")).some(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      const value = result.left + result.width / 2;
      const value2 = result.top + result.height / 2;
      return result.width >= 320 && result.height >= 220 && result.width * result.height >= 100000 && value > 0 && value2 > 0 && value < window.innerWidth && value2 < window.innerHeight;
    });
  } catch (error) {
    return false;
  }
}
function isProfileCommentUiVisible() {
  const local = PLATFORM_SELECTORS["douyin.com"].commentPanel || getCommentV2String("commentPanel");
  if (!local) {
    return false;
  }
  const result = document.querySelector(local);
  if (result && isVisibleElement(result)) {
    return true;
  }
  return Array.from(document.querySelectorAll("div, span, p")).some(arg1 => isMainCommentPlaceholderCandidate(arg1, {
    requireViewport: true,
    profileVideo: true
  }));
}
async function openProfileVideoCommentPanel(arg1, options = {}) {
  console.log("%c[主页首作评论] 正在打开评论区...", "color: #a78bfa; font-style: italic;");
  if (!hasCommentRuntimeReady()) {
    console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，无法打开主页评论区");
    return false;
  }
  let flag = false;
  const result = getCommentV2String("feedCommentIcon");
  const result2 = getCommentV2String("videoCommentIcon");
  const result3 = getCommentTabPrefix();
  const result4 = Number(options.deadlineAt || 0);
  const value = result4 > 0 ? result4 : Date.now() + 18000;
  const num = 3;
  let local = num;
  let flag2 = false;
  for (let num2 = 0; num2 < local && Date.now() < value; num2++) {
    if (shouldAbort(arg1)) {
      break;
    }
    if (isProfileCommentUiVisible()) {
      console.log("[Built-in-Debug] [主页首作评论] 评论区已展开");
      return true;
    }
    const value2 = result ? Array.from(document.querySelectorAll(result)).filter(isVisibleElement) : [];
    if (value2.length > 0) {
      const value3 = value2.length >= 2 ? value2[1] : value2[value2.length - 1];
      console.log("[Built-in-Debug] [主页首作评论] 点击 feed-comment-icon（第 " + (num2 + 1) + " 轮）");
      await simulateTrustedElementClick(value3, arg1, "主页评论入口", {
        deadlineAt: value
      });
      flag = true;
      await randomDelayWithinDeadline(1800, 2800, arg1, "打开评论", value);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    const result4 = await openFeedCommentDrawer(arg1, {
      deadlineAt: value
    });
    flag = flag || result4;
    if (isProfileCommentUiVisible()) {
      return true;
    }
    const value3 = result2 ? Array.from(document.querySelectorAll(result2)).filter(isVisibleElement) : [];
    if (value3.length > 0) {
      console.log("[Built-in-Debug] [主页首作评论] 点击 video-comment-icon");
      await simulateTrustedElementClick(value3[value3.length - 1], arg1, "主页视频评论入口", {
        deadlineAt: value
      });
      flag = true;
      await randomDelayWithinDeadline(1500, 2500, arg1, "打开评论", value);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    const value4 = result3 ? Array.from(document.querySelectorAll("div, span, p")).filter(arg1 => {
      if (!isVisibleElement(arg1) || arg1.children.length > 8) {
        return false;
      }
      const result = (arg1.textContent || "").trim();
      return result.startsWith(result3) && result.length < 24;
    }).sort((arg1, arg2) => arg2.getBoundingClientRect().right - arg1.getBoundingClientRect().right) : [];
    for (const item of value4.slice(0, 2)) {
      console.log("[Built-in-Debug] [主页首作评论] 尝试评论页签: \"" + (item.textContent || "").trim() + "\"");
      await simulateTrustedElementClick(item, arg1, "主页评论页签", {
        deadlineAt: value
      });
      flag = true;
      await sleepWithinDeadline(1500, value);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    if (!flag2 && flag && num2 >= num - 1 && !isProfileCommentUiVisible()) {
      local = getExtendedReadyRounds(num, {
        progress: true,
        hardCapRounds: 4
      });
      if (local > num) {
        flag2 = true;
        console.log("[Built-in-Debug] [慢环境] 主页评论入口已点但面板未展开，延长至 " + local + " 轮");
      }
    }
    if (num2 < local - 1) {
      await sleepWithinDeadline(900 + num2 * 400, value);
    }
  }
  if (flag) {
    console.log("[Built-in-Debug] [主页首作评论] 已点击评论入口，继续录入（DOM 可能未命中 commentPanel）");
    return true;
  }
  console.warn("[Built-in-Debug] [主页首作评论] 未能找到任何评论入口");
  return isProfileCommentUiVisible();
}
let lastProfileVideoDetailDiagnostic = "none";
function ownsActiveSubviewInteraction(text = "") {
  const result = String(text || "").trim();
  if (!result) {
    return false;
  }
  return subviewTaskStarted && activeSubviewInteractionId === result && String(currentTask?.interactionId || "") === result;
}
function shouldAbortProfileVideoDetailWait(arg1, text = "") {
  if (ownsActiveSubviewInteraction(text)) {
    return false;
  }
  return shouldAbort(arg1);
}
async function waitForProfileVideoDetailScope(arg1, text = "", options = {}) {
  const result = Math.max(1000, Number(options.maxWaitMs || 6500));
  const result2 = String(options.interactionId || currentTask?.interactionId || "");
  const result3 = Date.now();
  let num = 0;
  while (Date.now() - result3 < result) {
    if (shouldAbortProfileVideoDetailWait(arg1, result2)) {
      lastProfileVideoDetailDiagnostic = "aborted " + describeTaskAbortReason(arg1) + " interactionId=" + (result2 || "none") + " activeInteractionId=" + (activeSubviewInteractionId || "none");
      return null;
    }
    const value = PLATFORM_SELECTORS["douyin.com"].modalContainer;
    const value2 = value ? document.querySelector(value) : null;
    const result4 = Array.from(document.querySelectorAll("[data-e2e=\"video-player-container\"], video")).find(arg1 => isVisibleElement(arg1));
    if (value2 && isVisibleElement(value2) || hasProfileVideoDetailEvidence(text)) {
      lastProfileVideoDetailDiagnostic = "ready elapsed=" + (Date.now() - result3) + "ms routeVideoId=" + (getVideoIdFromPageUrl() || "none") + " scope=" + (value2?.tagName || result4?.tagName || "body");
      return resolveProfileVideoCommentScope();
    }
    if (Date.now() - num >= 5000) {
      num = Date.now();
      const result = ((Date.now() - result3) / 1000).toFixed(1);
      reportProfileFirstTrace("等待作品详情渲染（" + result + "s，routeVideoId=" + (getVideoIdFromPageUrl() || "none") + "，player=" + (result4 ? "partial" : "none") + "）");
    }
    await sleep(Math.min(500, Math.max(0, result - (Date.now() - result3))));
  }
  const flag = hasProfileVideoDetailEvidence(text);
  lastProfileVideoDetailDiagnostic = (flag ? "ready_at_deadline" : "timeout") + " elapsed=" + (Date.now() - result3) + "ms url=" + clipTraceText(window.location.href, 120) + " routeVideoId=" + (getVideoIdFromPageUrl() || "none");
  if (flag) {
    return resolveProfileVideoCommentScope();
  } else {
    return null;
  }
}
function getDouyinFeedScope() {
  const list = ["[data-e2e=\"feed-active-video\"]", "[data-e2e=\"feed-active-live\"]", "[data-e2e=\"browse-live\"]", "[data-e2e=\"feed-live\"]", "[data-e2e=\"webcast-player\"]"];
  const list2 = [];
  for (const item of list) {
    const result = document.querySelectorAll(item);
    for (const item of result) {
      if (isElementInFeedCenter(item)) {
        list2.push(item);
      }
    }
  }
  if (list2.length > 0) {
    if (list2.length === 1) {
      return list2[0];
    }
    const value = window.innerHeight / 2;
    const value2 = window.innerWidth / 2;
    list2.sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      const result3 = Math.sqrt(Math.pow(result.top + result.height / 2 - value, 2) + Math.pow(result.left + result.width / 2 - value2, 2));
      const result4 = Math.sqrt(Math.pow(result2.top + result2.height / 2 - value, 2) + Math.pow(result2.left + result2.width / 2 - value2, 2));
      return result3 - result4;
    });
    return list2[0];
  }
  const result = document.querySelector("[data-e2e=\"feed-active-video\"]");
  if (result && isVisibleElement(result)) {
    return result;
  }
  for (const item of ["feed-active-live", "browse-live", "feed-live", "webcast-player"]) {
    const result = document.querySelector("[data-e2e=\"" + item + "\"]");
    if (result && isVisibleElement(result)) {
      return result;
    }
  }
  const result2 = document.querySelector("[data-e2e=\"video-player\"]");
  if (result2) {
    const result = result2.closest("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-item\"]");
    if (result && isVisibleElement(result)) {
      return result;
    }
  }
  const result3 = document.querySelector("video");
  if (result3) {
    const result = result3.closest("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-active-live\"], [data-e2e=\"feed-live\"], [data-e2e=\"feed-item\"]");
    if (result && isVisibleElement(result)) {
      return result;
    }
  }
  return null;
}
function isElementInFeedCenter(arg1) {
  if (!arg1 || !isVisibleElement(arg1)) {
    return false;
  }
  const result = arg1.getBoundingClientRect();
  const value = result.left + result.width / 2;
  const value2 = result.top + result.height / 2;
  const value3 = window.innerWidth;
  const value4 = window.innerHeight;
  return value >= value3 * 0.12 && value <= value3 * 0.82 && value2 >= value4 * 0.06 && value2 <= value4 * 0.94;
}
function hasFeedLiveEnterHint(arg1 = null) {
  const pattern = /点击或按.{0,4}进入直播间|按.{0,4}进入直播间/;
  const list = [];
  const value = arg1 && arg1.querySelectorAll ? arg1 : getDouyinFeedScope();
  if (value) {
    list.push(value);
  }
  if (!list.length) {
    list.push(document.body);
  }
  for (const item of list) {
    const result = (item.innerText || "").replace(/\s+/g, "");
    if (pattern.test(result)) {
      return true;
    }
    const local = item.querySelectorAll?.("span, div, p, button, a, [data-e2e]") || [];
    for (const item of local) {
      if (!isVisibleElement(item) || !isElementInFeedCenter(item)) {
        continue;
      }
      const result = (item.innerText || item.textContent || "").replace(/\s+/g, "");
      if (pattern.test(result)) {
        return true;
      }
    }
  }
  return false;
}
function isDouyinFeedPlaying() {
  if (isDouyinFeedLiveStream()) {
    return false;
  }
  const result = getDouyinFeedScope();
  if (!result || !isVisibleElement(result)) {
    return false;
  }
  const local = result.querySelector("video") || document.querySelector("video");
  if (local && isVisibleElement(local)) {
    return true;
  }
  const result2 = result.querySelector("img, canvas, [data-e2e=\"image-feed\"]");
  return !!result2;
}
function getFeedVideoIdentity(arg1 = null) {
  const local = arg1 || getDouyinFeedScope() || document;
  const result = local.querySelector("[data-e2e=\"video-desc\"]");
  const result2 = cleanTitle(result?.innerText || "");
  const local2 = local.querySelector("[data-e2e=\"feed-video-nickname\"]")?.innerText?.trim() || "";
  const result3 = local.querySelector("video");
  let text = "";
  try {
    const local = result3?.currentSrc || result3?.src || "";
    const result = local.match(/file_id=([^&]+)/);
    const result2 = local.match(/(\d{15,})/);
    text = result?.[1] || result2?.[1] || "";
  } catch (error) {}
  return ("feed:" + (text || "na") + ":" + local2 + ":" + result2).slice(0, 240);
}
function captureFeedVideoShareUrl(arg1) {
  if (!arg1) {
    return "";
  }
  const result = arg1.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]");
  for (const item of result) {
    const result = extractVideoIdFromHref(item.href || item.getAttribute("href") || "");
    if (result) {
      return buildDouyinVideoShareUrl(result);
    }
  }
  const local = arg1.getAttribute("data-item-id") || arg1.querySelector("[data-item-id]")?.getAttribute("data-item-id");
  if (local && /^\d+$/.test(local)) {
    return buildDouyinVideoShareUrl(local);
  }
  const result2 = Array.from(arg1.querySelectorAll("video")).filter(arg1 => isVisibleElement(arg1)).sort((arg1, arg2) => {
    const result = arg1.getBoundingClientRect();
    const result2 = arg2.getBoundingClientRect();
    return result2.width * result2.height - result.width * result.height;
  });
  for (const item of result2) {
    const local = item.currentSrc || item.src || item.getAttribute("src") || "";
    const local2 = local.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || local.match(/\/(\d{19})\//) || local.match(/(\d{19})/);
    if (local2?.[1]) {
      return buildDouyinVideoShareUrl(local2[1]);
    }
  }
  return "";
}
function lockFeedLeadVideoUrl(arg1) {
  lockedFeedIdentity = getFeedVideoIdentity(arg1);
  lockedLeadVideoUrl = captureFeedVideoShareUrl(arg1);
  if (lockedLeadVideoUrl) {
    console.log("[Built-in-Debug] [推荐流] 已锁定视频链接: " + lockedLeadVideoUrl);
  }
  return lockedLeadVideoUrl;
}
function clearLockedLeadVideoUrl() {
  lockedLeadVideoUrl = "";
  lockedFeedIdentity = "";
}
function pickLeadVideoUrl(text = "", arg2 = document) {
  const result = normalizeUrl(text);
  if (isDouyinVideoShareUrl(result)) {
    return result;
  }
  if (isDouyinVideoShareUrl(lockedLeadVideoUrl)) {
    return lockedLeadVideoUrl;
  }
  if (isDouyinVideoShareUrl(pendingLeadVideoUrl) && Date.now() - pendingLeadVideoUrlAt < 120000) {
    return pendingLeadVideoUrl;
  }
  return resolveLeadVideoUrl(text, arg2);
}
async function openFeedCommentDrawer(arg1, options = {}) {
  if (isDouyinFeedLiveStream() || hasFeedLiveEnterHint() || isDouyinLiveStreamTitle(getVideoTitle())) {
    console.log("[Built-in-Debug] [推荐流] 当前为直播间，跳过打开评论");
    return false;
  }
  if (!hasCommentRuntimeReady()) {
    console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过打开评论");
    return false;
  }
  const result = Number(options.deadlineAt || 0);
  const result2 = [getCommentV2String("feedCommentIcon"), getCommentV2String("videoCommentIcon"), getCommentV2String("openCommentAria")].filter(Boolean);
  for (const item of result2) {
    const result2 = Array.from(document.querySelectorAll(item)).filter(arg1 => isVisibleElement(arg1) && isElementInViewport(arg1));
    const value = result2.sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      const value = Math.abs(result.left + result.width / 2 - window.innerWidth * 0.82) + Math.abs(result.top + result.height / 2 - window.innerHeight * 0.5);
      const value2 = Math.abs(result2.left + result2.width / 2 - window.innerWidth * 0.82) + Math.abs(result2.top + result2.height / 2 - window.innerHeight * 0.5);
      return value - value2;
    })[0];
    if (value) {
      console.log("[Built-in-Debug] [推荐流] 点击评论图标:", item);
      await simulateHumanClick(value, arg1, {
        deadlineAt: result
      });
      await randomDelayWithinDeadline(1500, 2500, arg1, "打开评论", result);
      return true;
    }
  }
  const result3 = getCommentTabPrefix();
  const value = result3 ? Array.from(document.querySelectorAll("div, span, p, button")).find(arg1 => {
    if (!isVisibleElement(arg1) || !isElementInViewport(arg1) || arg1.children.length > 2) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    if (result.left < window.innerWidth * 0.55) {
      return false;
    }
    return (arg1.innerText || "").trim() === result3;
  }) : null;
  if (value) {
    console.log("[Built-in-Debug] [推荐流] 点击右侧互动栏「评论」文字入口");
    await simulateHumanClick(value, arg1, {
      deadlineAt: result
    });
    await randomDelayWithinDeadline(1500, 2500, arg1, "打开评论", result);
    return true;
  }
  return false;
}
function getMyDouyinId() {
  try {
    try {
      const local = localStorage.getItem("user_info") || localStorage.getItem("index_user_info");
      if (local) {
        const result = JSON.parse(local);
        if (result.short_id) {
          return String(result.short_id).trim();
        }
        if (result.display_id) {
          return String(result.display_id).trim();
        }
        if (result.unique_id && !String(result.unique_id).startsWith("MS4w")) {
          return String(result.unique_id).trim();
        }
      }
    } catch (error) {}
    const result = document.querySelectorAll("script");
    for (const item of result) {
      const local = item.textContent || "";
      if (!local.includes("display_id") && !local.includes("shortId") && !local.includes("unique_id")) {
        continue;
      }
      const list = [/"display_id":"([^"]+)"/, /"shortId":"([^"]+)"/, /"short_id":"([^"]+)"/, /"unique_id":"([^"]+)"/];
      for (const item of list) {
        const result = local.match(item);
        if (result && result[1] && result[1].length >= 4 && result[1].length <= 32) {
          return result[1].trim();
        }
      }
    }
    const result2 = Array.from(document.querySelectorAll("span, div, p"));
    const result3 = result2.find(arg1 => {
      const result = (arg1.innerText || "").trim();
      return result.includes("抖音号：") && result.length < 40 && isVisibleElement(arg1);
    });
    if (result3) {
      return result3.innerText.replace(/抖音号[：:]\s*/g, "").trim();
    }
  } catch (error) {
    console.warn("[账号自检] 抖音号识别异常:", error.message);
  }
  return "";
}
function getMyProfileUrl() {
  try {
    const result = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const item of result) {
      const local = item.getAttribute("href") || "";
      if (!local.includes("/user/self") && local.includes("/user/") && local.length > 20) {
        if (local.startsWith("http")) {
          return local.split("?")[0];
        }
        return "https://www.douyin.com" + local.split("?")[0];
      }
    }
    const result2 = document.querySelectorAll("script");
    for (const item of result2) {
      const result = (item.textContent || "").match(/"sec_uid":"([^"]+)"/);
      if (result && result[1]) {
        return "https://www.douyin.com/user/" + result[1];
      }
    }
  } catch (error) {}
  return "";
}
function getMyNickname() {
  try {
    const result = document.cookie.split("; ");
    for (const item of result) {
      if (item.startsWith("nickname-high-priority=") || item.startsWith("n_sdk_dict=")) {
        try {
          const result = decodeURIComponent(item.split("=")[1]);
          if (result && result.length > 1 && result.length < 30 && !result.includes("{")) {
            return result;
          }
        } catch (error) {}
      }
    }
    try {
      const local = localStorage.getItem("user_info") || localStorage.getItem("index_user_info");
      if (local) {
        const result = JSON.parse(local);
        if (result.nickname) {
          return result.nickname;
        }
      }
    } catch (error) {}
    const list = ["[class*=\"nick--\"]", "[class*=\"nick\"]", "[class*=\"header\"] [class*=\"nick\"]", "[class*=\"user-info\"] [class*=\"name\"]", "a[href*=\"/personal\"]", ".user-info-wrapper .name", ".pc-header-user-info__nickname", "[data-e2e=\"user-name\"]", ".dy-account-name", "a[href*=\"/user/self\"]", ".account-name"];
    for (const item of list) {
      const result = document.querySelector(item);
      if (result && result.innerText?.trim()) {
        const result2 = result.innerText.trim();
        const list = ["我的", "登录", "精选", "推荐", "关注", "朋友", "直播", "放映厅", "短剧"];
        if (result2.length > 1 && !list.includes(result2)) {
          return result2;
        }
      }
    }
    const result2 = document.querySelectorAll("script");
    for (const item of result2) {
      const value = item.textContent;
      if (value && value.includes("nickname")) {
        const result = value.match(/"nickname":"([^"]+)"/);
        if (result && result[1]) {
          try {
            const result2 = JSON.parse("\"" + result[1] + "\"");
            if (result2 && result2.length > 1 && result2 !== "我的") {
              return result2;
            }
          } catch (error) {}
        }
      }
    }
    const result3 = document.querySelector("img[alt][src*=\"avatar\"], [data-e2e=\"user-avatar\"] img");
    if (result3 && result3.alt && result3.alt !== "头像" && result3.alt.length > 1) {
      return result3.alt.trim();
    }
    if (document.querySelector(".user-avatar, [data-e2e=\"user-avatar\"], .message-icon, [class*=\"user-order-container\"], [class*=\"nick\"]")) {
      return "已登录(待识别)";
    }
  } catch (error) {
    console.error("[Debug] 识别逻辑报错:", error.message);
  }
  return "";
}
let specificVideoPauseWatcher = null;
try {
  const {
    createDouyinSpecificVideoPauseWatcher
  } = require("./shared/douyinSpecificVideoPauseWatcher");
  specificVideoPauseWatcher = createDouyinSpecificVideoPauseWatcher({
    storage: localStorage,
    getTaskState: () => ({
      taskRunning: taskRunning,
      stopRequested: stopRequested,
      currentRunningSource: currentRunningSource
    }),
    getCurrentUrl: () => window.location.href,
    isViewingVideoPage: isViewingDouyinVideoPage,
    queryVideos: () => document.querySelectorAll("video"),
    log: arg1 => console.log(arg1)
  });
} catch (error) {
  console.error("[Built-in-Debug] 指定视频暂停守护器加载失败:", error);
}
function syncSpecificVideoPauseWatcher() {
  specificVideoPauseWatcher?.sync();
}
syncSpecificVideoPauseWatcher();
(function () {
  console.log("%c[系统提示] 捕捉引擎 V2.9 (全能终结版) 已就绪...", "color: #a78bfa; font-style: italic;");
  if (safeSessionGet("radar_is_interaction_view") === "true") {
    return;
  }
  setTimeout(() => {
    let num = 0;
    const num2 = 30;
    const result = setInterval(() => {
      num++;
      const local = window.location.href || "";
      const local2 = local.includes("douyin.com") || local.includes("goofish.com");
      if (local === "about:blank" || !local2) {
        if (num >= 3) {
          clearInterval(result);
        }
        return;
      }
      const result2 = getMyNickname();
      const result3 = getMyDouyinId();
      const result4 = getMyProfileUrl();
      const result5 = local.includes("goofish.com");
      if (num % 5 === 0) {
        console.log("[账号自检] 第 " + num + " 次探测。当前URL: " + local);
        console.log("[Debug] Cookie包含昵称标记: " + document.cookie.includes("nickname"));
      }
      const local3 = result2 && (result2 !== "已登录(待识别)" || result5);
      if (local3) {
        const value = result2 === "已登录(待识别)" ? "闲鱼用户" : result2;
        clearInterval(result);
        console.log("%c[账号自检] 识别成功: " + value + (result3 ? " | 抖音号: " + result3 : ""), "color: #fff; background: #10b981; padding: 4px;");
        ipcRenderer.send("account-logged-in", {
          name: value,
          douyinId: result3,
          userUrl: result4
        });
      } else if (num >= 4 && !safeSessionGet("radar_self_profile_checked") && local.includes("douyin.com") && !local.includes("/user/") && /(?:^|;\s)(sessionid|sessionid_ss|sid_tt|uid_tt)=/i.test(document.cookie || "")) {
        safeSessionSet("radar_self_profile_checked", "1");
        console.log("[账号自检] 尝试跳转个人主页以识别抖音号...");
        window.location.href = "https://www.douyin.com/user/self";
      } else if (num >= num2) {
        clearInterval(result);
        ipcRenderer.send("account-login-failed");
      }
    }, 1500);
  }, 4000);
})();
let currentViewKey = safeSessionGet("radar_view_key") || null;
let isInteractionView = safeSessionGet("radar_is_interaction_view") === "true";
let commentFailureStoppedTaskId = null;
let lastTrustedClickDiagnostic = "none";
let lastNativeClickBackgroundHosted = false;
ipcRenderer.on("control-task", (arg1, {
  type: type,
  payload: payload
}) => {
  if (type === "START_TASK" && payload.viewKey) {
    currentViewKey = payload.viewKey;
    safeSessionSet("radar_view_key", payload.viewKey);
  }
});
let subviewTaskStarted = false;
let subviewTaskSeq = 0;
let activeSubviewInteractionId = "";
const cancelledSubviewInteractionIds = new Set();
const batchProfileCommentDoneKeys = new Set();
let subviewTaskAls = null;
try {
  const {
    AsyncLocalStorage
  } = require("async_hooks");
  subviewTaskAls = new AsyncLocalStorage();
} catch (error) {
  subviewTaskAls = null;
}
function getBoundSubviewInteractionId() {
  const local = subviewTaskAls?.getStore?.()?.interactionId;
  if (local) {
    return String(local);
  }
  return String(currentTask?.interactionId || activeSubviewInteractionId || "");
}
function markSubviewInteractionCancelled(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return;
  }
  cancelledSubviewInteractionIds.add(result);
  while (cancelledSubviewInteractionIds.size > 40) {
    const value = cancelledSubviewInteractionIds.values().next().value;
    cancelledSubviewInteractionIds.delete(value);
  }
}
function isSubviewInteractionCancelled(arg1) {
  const result = String(arg1 || "").trim();
  return !!result && !!cancelledSubviewInteractionIds.has(result);
}
function batchProfileCommentDoneKey(arg1, text = "") {
  const local = arg1?.lead || arg1;
  const result = String(text || arg1?.viewKey || currentViewKey || "").trim();
  const result2 = String(arg1?.batchRunId ?? local?.batchRunId ?? "").trim();
  const result3 = String(local?.leadId || local?.userUrl || local?.secUid || local?.nickname || "").trim();
  if (!result && !result3) {
    return "";
  }
  return result2 + "::" + result + "::" + result3;
}
function markBatchProfileCommentDone(arg1) {
  const result = batchProfileCommentDoneKey(arg1);
  if (result) {
    batchProfileCommentDoneKeys.add(result);
  }
}
function wasBatchProfileCommentDone(arg1) {
  const result = batchProfileCommentDoneKey(arg1);
  return !!result && !!batchProfileCommentDoneKeys.has(result);
}
function pingInteractionActivity(text = "", num = 0) {
  try {
    const obj = {
      viewKey: currentViewKey,
      interactionId: currentTask?.interactionId || activeSubviewInteractionId || "",
      batchRunId: currentTask?.batchRunId,
      reason: text
    };
    if (Number.isFinite(Number(num)) && Number(num) > 0) {
      obj.extendMs = Number(num);
    }
    ipcRenderer.send("interaction-activity", obj);
  } catch (error) {}
}
const sleep = arg1 => new Promise(arg12 => setTimeout(arg12, arg1));
let backgroundAutomationLayoutDepth = 0;
let backgroundAutomationLayoutAcquirePromise = null;
let backgroundAutomationLayoutReleasePromise = null;
let backgroundAutomationLayoutReleaseNeeded = false;
let backgroundAutomationLayoutOwnerViewKey = null;
async function withBackgroundAutomationLayout(arg1, options = {}) {
  if (typeof arg1 !== "function") {
    return undefined;
  }
  const local = currentViewKey;
  if (!local || typeof ipcRenderer === "undefined") {
    return arg1();
  }
  const value = typeof options.onProgress === "function" ? options.onProgress : null;
  let flag = false;
  try {
    if (backgroundAutomationLayoutDepth === 0) {
      if (backgroundAutomationLayoutReleasePromise) {
        value?.("等待上一批后台互动释放…");
        await backgroundAutomationLayoutReleasePromise;
      }
      if (!backgroundAutomationLayoutAcquirePromise) {
        value?.("申请后台互动执行权…");
        backgroundAutomationLayoutAcquirePromise = ipcRenderer.invoke("ensure-background-automation-layout", {
          viewKey: local,
          claimInteractionSlot: true,
          requireComposerSurface: options.requireComposerSurface === true
        });
      }
      const result = await backgroundAutomationLayoutAcquirePromise;
      if (result?.ok === false) {
        console.warn("[BackgroundLayout] 申请后台互动执行权受阻 (" + (result?.reason || "unknown") + ")，尝试降级执行 DOM 动作");
      }
      backgroundAutomationLayoutReleaseNeeded = backgroundAutomationLayoutReleaseNeeded || !!result?.attached && !result?.visible || !!result?.interactionSlotAcquired;
      backgroundAutomationLayoutOwnerViewKey = local;
      if (Number(result?.interactionSlotWaitedMs || 0) >= 200) {
        const result2 = (result.interactionSlotWaitedMs / 1000).toFixed(1);
        value?.("后台互动排队等待 " + result2 + " 秒");
        reportTraceLog("⏱ 后台互动排队：等待 " + result2 + " 秒");
      }
      if (currentTask?.canCommentFirstWork) {
        const value = result?.visible ? "前台实况" : result?.composerSurface ? "互动激活面" : result?.interaction ? "互动宿主" : result?.parkedInMainWindow ? "主窗离屏" : "后台宿主";
        reportCommentFlowTrace("互动执行环境", "view=" + clipTraceText(local, 18) + " host=" + value + (" slotWait=" + Math.round(Number(result?.interactionSlotWaitedMs || 0)) + "ms") + (" viewport=" + window.innerWidth + "x" + window.innerHeight) + (" visible=" + document.visibilityState + " focused=" + (document.hasFocus?.() !== false)) + (" focusEmulated=" + !!result?.focusEmulated) + (" warmup=" + Math.round(Number(result?.surfaceWarmupMs || 0)) + "ms") + (" nativeWindowFocused=" + !!result?.nativeWindowFocused) + (" webContentsFocused=" + !!result?.webContentsFocused));
      }
    }
    backgroundAutomationLayoutDepth += 1;
    flag = true;
    return await arg1();
  } finally {
    if (flag) {
      backgroundAutomationLayoutDepth = Math.max(0, backgroundAutomationLayoutDepth - 1);
    }
    if (backgroundAutomationLayoutDepth === 0) {
      const local2 = backgroundAutomationLayoutReleaseNeeded;
      const local3 = backgroundAutomationLayoutOwnerViewKey || local;
      backgroundAutomationLayoutAcquirePromise = null;
      backgroundAutomationLayoutReleaseNeeded = false;
      backgroundAutomationLayoutOwnerViewKey = null;
      if (local2) {
        const result = ipcRenderer.invoke("release-background-automation-layout", {
          viewKey: local3,
          preferReacquireMs: Math.max(0, Number(options.preferReacquireMs) || 0)
        }).catch(() => null);
        backgroundAutomationLayoutReleasePromise = result;
        const result2 = await result;
        if (result2?.interactionSlotReserved) {
          reportTraceLog("🔗 已为同一用户后续动作保留互动执行权 " + Math.round(Number(options.preferReacquireMs) || 0) / 1000 + " 秒", currentTask?.lead?.accountId);
        }
        if (backgroundAutomationLayoutReleasePromise === result) {
          backgroundAutomationLayoutReleasePromise = null;
        }
      }
    }
  }
}
function focusCurrentAutomationViewForComment() {
  try {
    window.focus?.();
  } catch (error) {}
  try {
    if (currentViewKey && typeof ipcRenderer !== "undefined") {
      ipcRenderer.send("focus-automation-view", {
        viewKey: currentViewKey,
        bringToFront: true
      });
    }
  } catch (error) {}
}
let automationRuntimeController = null;
let automationRuntimeControllerLoadError = null;
try {
  const {
    createAutomationRuntimeController
  } = require("./shared/automationRuntimeController");
  const automationRuntimeState = {};
  Object.defineProperties(automationRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: arg1 => {
        currentViewKey = arg1;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: arg1 => {
        lastTrustedClickDiagnostic = arg1;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: arg1 => {
        pausedForSubview = arg1;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: arg1 => {
        sessionDmCount = arg1;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: arg1 => {
        sessionFollowCount = arg1;
      }
    },
    sessionInteractionCount: {
      enumerable: true,
      get: () => sessionInteractionCount,
      set: arg1 => {
        sessionInteractionCount = arg1;
      }
    },
    sessionInteractionLimit: {
      enumerable: true,
      get: () => sessionInteractionLimit,
      set: arg1 => {
        sessionInteractionLimit = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    }
  });
  automationRuntimeController = createAutomationRuntimeController({
    DOUYIN_LIKE_ENTRY_URL: DOUYIN_LIKE_ENTRY_URL,
    DOUYIN_RECOMMEND_URL: DOUYIN_RECOMMEND_URL,
    getDouyinLikeEntryUrl: getDouyinLikeEntryUrl,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    getDouyinFollowUrl: getDouyinFollowUrl,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    dismissEntityLoginPopupsCore: dismissEntityLoginPopupsCore,
    finalizeAccountTask: finalizeAccountTask,
    getCommentV2String: getCommentV2String,
    getCommentV2List: getCommentV2List,
    getMainCommentInputShellSelector: getMainCommentInputShellSelector,
    hasCommentNonTextPayload: hasCommentNonTextPayload,
    ipcRenderer: ipcRenderer,
    isAiInvokeCancelled: isAiInvokeCancelled,
    isElementInViewport: isElementInViewport,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isMonitorLoopId: isMonitorLoopId,
    isProfileFirstCommentAiMode: isProfileFirstCommentAiMode,
    isVisibleElement: isVisibleElement,
    localStorage: localStorage,
    matchesPlaceholderHint: matchesPlaceholderHint,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    readRadarSessionState: readRadarSessionState,
    resolveMainCommentWritableElement: resolveMainCommentWritableElement,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    sleep: sleep,
    preloadDir: __dirname,
    state: automationRuntimeState
  });
} catch (error) {
  automationRuntimeControllerLoadError = error;
  console.error("[Built-in-Debug] 自动化公共运行时控制器加载失败:", error);
}
function abortAutomationStartup(...restArgs) {
  return automationRuntimeController?.abortAutomationStartup(...restArgs);
}
function awaitSearchPageLoginGate(...restArgs) {
  return automationRuntimeController?.awaitSearchPageLoginGate(...restArgs);
}
function awaitSecurityChallengeIfPresent(...restArgs) {
  return automationRuntimeController?.awaitSecurityChallengeIfPresent(...restArgs);
}
function buildAutomationAiPayload(...restArgs) {
  return automationRuntimeController?.buildAutomationAiPayload(...restArgs);
}
function buildMainCommentAbortResult(...restArgs) {
  return automationRuntimeController?.buildMainCommentAbortResult(...restArgs);
}
function checkAndClickOneClickLogin(...restArgs) {
  return automationRuntimeController?.checkAndClickOneClickLogin(...restArgs);
}
function clipTraceText(...restArgs) {
  return automationRuntimeController?.clipTraceText(...restArgs) || "";
}
function describeCommentLikeState(...restArgs) {
  return automationRuntimeController?.describeCommentLikeState(...restArgs) || "";
}
function describeMainCommentInputEnvironment(...restArgs) {
  return automationRuntimeController?.describeMainCommentInputEnvironment(...restArgs);
}
function describeTaskAbortReason(...restArgs) {
  return automationRuntimeController?.describeTaskAbortReason(...restArgs) || "";
}
function detectPageSecurityChallenge(...restArgs) {
  return automationRuntimeController?.detectPageSecurityChallenge(...restArgs);
}
function evaluateLeadLocationFilter(...restArgs) {
  return automationRuntimeController?.evaluateLeadLocationFilter(...restArgs);
}
function formatTaskLocationFilterSummary(...restArgs) {
  return automationRuntimeController?.formatTaskLocationFilterSummary(...restArgs) || "";
}
function getAutomationTextHelpersModule(...restArgs) {
  return automationRuntimeController?.getAutomationTextHelpersModule(...restArgs);
}
function getCommentPlaceholderText(...restArgs) {
  return automationRuntimeController?.getCommentPlaceholderText(...restArgs) || "";
}
function getIncludeTitleKeywordMatch(...restArgs) {
  return automationRuntimeController?.getIncludeTitleKeywordMatch(...restArgs);
}
function getLocationFilterModule(...restArgs) {
  return automationRuntimeController?.getLocationFilterModule(...restArgs);
}
function handleGlobalAutomationPopupsAndSecurity(...restArgs) {
  return automationRuntimeController?.handleGlobalAutomationPopupsAndSecurity(...restArgs);
}
function hasCommentLikeTakenEffect(...restArgs) {
  return automationRuntimeController?.hasCommentLikeTakenEffect(...restArgs) || false;
}
function hasLocalReplyTemplates(...restArgs) {
  return automationRuntimeController?.hasLocalReplyTemplates(...restArgs) || false;
}
function hasVideoCommentTemplates(...restArgs) {
  return automationRuntimeController?.hasVideoCommentTemplates(...restArgs) || false;
}
function incrementInteractionCount(...restArgs) {
  return automationRuntimeController?.incrementInteractionCount(...restArgs);
}
function isDouyinProfileTargetingEnabled(...restArgs) {
  return automationRuntimeController?.isDouyinProfileTargetingEnabled(...restArgs) || false;
}
function isFatalAiAuthError(...restArgs) {
  return automationRuntimeController?.isFatalAiAuthError(...restArgs) || false;
}
function isInteractionLimitReached(...restArgs) {
  return automationRuntimeController?.isInteractionLimitReached(...restArgs) || false;
}
function isMainCommentPlaceholderCandidate(...restArgs) {
  return automationRuntimeController?.isMainCommentPlaceholderCandidate(...restArgs) || false;
}
function matchCurrentVideoForDy(...restArgs) {
  return automationRuntimeController?.matchCurrentVideoForDy(...restArgs);
}
function matchExcludedCommentKeyword(...restArgs) {
  return automationRuntimeController?.matchExcludedCommentKeyword(...restArgs) || false;
}
function matchLeadProfileForDy(...restArgs) {
  return automationRuntimeController?.matchLeadProfileForDy(...restArgs);
}
function matchTitleKeywordList(...restArgs) {
  return automationRuntimeController?.matchTitleKeywordList(...restArgs) || false;
}
function parseTitleKeywordList(...restArgs) {
  return automationRuntimeController?.parseTitleKeywordList(...restArgs) || [];
}
function persistSessionInteractionCount(...restArgs) {
  return automationRuntimeController?.persistSessionInteractionCount(...restArgs);
}
function personalizeDmTemplate(...restArgs) {
  return automationRuntimeController?.personalizeDmTemplate(...restArgs) || "";
}
function prefetchAiMainPostComment(...restArgs) {
  return automationRuntimeController?.prefetchAiMainPostComment(...restArgs);
}
function prefetchKeywordReplyContents(...restArgs) {
  return automationRuntimeController?.prefetchKeywordReplyContents(...restArgs);
}
function prepareLeadsForAiAnalysis(...restArgs) {
  return automationRuntimeController?.prepareLeadsForAiAnalysis(...restArgs);
}
function reportCommentFlowTrace(...restArgs) {
  return automationRuntimeController?.reportCommentFlowTrace(...restArgs);
}
function reportCurrentAction(...restArgs) {
  return automationRuntimeController?.reportCurrentAction(...restArgs) || "";
}
function reportProfileFirstTrace(...restArgs) {
  return automationRuntimeController?.reportProfileFirstTrace(...restArgs);
}
function reportTraceLog(...restArgs) {
  return automationRuntimeController?.reportTraceLog(...restArgs);
}
function resolveCommentLikeControlInNode(...restArgs) {
  return automationRuntimeController?.resolveCommentLikeControlInNode(...restArgs);
}
function resolveTaskEntryUrl(...restArgs) {
  return automationRuntimeController?.resolveTaskEntryUrl(...restArgs) || "";
}
function resolveTaskLocationFilterRegions(...restArgs) {
  return automationRuntimeController?.resolveTaskLocationFilterRegions(...restArgs) || [];
}
function scoreMainCommentPlaceholderCandidate(...restArgs) {
  return automationRuntimeController?.scoreMainCommentPlaceholderCandidate(...restArgs);
}
function shouldEnforceIncludeTitleKeywords(...restArgs) {
  return automationRuntimeController?.shouldEnforceIncludeTitleKeywords(...restArgs) || false;
}
function shouldForceSelectByIncludeTitle(...restArgs) {
  return automationRuntimeController?.shouldForceSelectByIncludeTitle(...restArgs) || false;
}
function shouldGenerateAiVideoMainPost(...restArgs) {
  return automationRuntimeController?.shouldGenerateAiVideoMainPost(...restArgs) || false;
}
function shouldPrefetchMainPostWithVideoMatch(...restArgs) {
  return automationRuntimeController?.shouldPrefetchMainPostWithVideoMatch(...restArgs) || false;
}
function shouldUseAiCommentAnalysis(...restArgs) {
  return automationRuntimeController?.shouldUseAiCommentAnalysis(...restArgs) || false;
}
function shouldUseAiReplyGeneration(...restArgs) {
  return automationRuntimeController?.shouldUseAiReplyGeneration(...restArgs) || false;
}
function shouldUseCommentKeywordFilter(...restArgs) {
  return automationRuntimeController?.shouldUseCommentKeywordFilter(...restArgs) || false;
}
function shouldUsePersonaVideoFilter(...restArgs) {
  return automationRuntimeController?.shouldUsePersonaVideoFilter(...restArgs) || false;
}
function shouldUseTextlessReplyPayload(...restArgs) {
  return automationRuntimeController?.shouldUseTextlessReplyPayload(...restArgs) || false;
}
function shouldUseTextlessVideoCommentPayload(...restArgs) {
  return automationRuntimeController?.shouldUseTextlessVideoCommentPayload(...restArgs) || false;
}
function snapshotCommentLikeControlState(...restArgs) {
  return automationRuntimeController?.snapshotCommentLikeControlState(...restArgs);
}
function taskLocationFilterEnabled(...restArgs) {
  return automationRuntimeController?.taskLocationFilterEnabled(...restArgs) || false;
}
function allowEmptyCommentText(flag = false, flag2 = false, arg3 = currentTask) {
  if (flag2) {
    return !!arg3?.enableCommentWithoutText;
  }
  if (flag) {
    return shouldUseTextlessVideoCommentPayload(arg3);
  }
  return shouldUseTextlessReplyPayload(arg3);
}
function applySubviewRuntimeTask(options = {}) {
  const value = currentTask && typeof currentTask === "object" ? currentTask : {};
  const obj = {
    ...value,
    ...options
  };
  obj.enableCommentWithoutText = !!options.enableCommentWithoutText;
  obj.enableVideoCommentWithoutText = !!options.enableVideoCommentWithoutText;
  if ("enableCommentMention" in options) {
    obj.enableCommentMention = !!options.enableCommentMention;
  }
  if ("commentMentionNicknames" in options) {
    obj.commentMentionNicknames = options.commentMentionNicknames || "";
  }
  if ("commentMentionPosition" in options) {
    obj.commentMentionPosition = options.commentMentionPosition === "after" ? "after" : "before";
  }
  if ("commentMentionPercent" in options) {
    const result = Number(options.commentMentionPercent);
    if (Number.isFinite(result)) {
      obj.commentMentionPercent = Math.max(0, Math.min(100, Math.round(result)));
    } else if (!Number.isFinite(Number(obj.commentMentionPercent))) {
      obj.commentMentionPercent = 100;
    }
  }
  if ("enableVideoCommentMention" in options) {
    obj.enableVideoCommentMention = !!options.enableVideoCommentMention;
  }
  if ("videoCommentMentionNicknames" in options) {
    obj.videoCommentMentionNicknames = options.videoCommentMentionNicknames || "";
  }
  if ("videoCommentMentionPosition" in options) {
    obj.videoCommentMentionPosition = options.videoCommentMentionPosition === "after" ? "after" : "before";
  }
  if ("videoCommentMentionPercent" in options) {
    const result = Number(options.videoCommentMentionPercent);
    if (Number.isFinite(result)) {
      obj.videoCommentMentionPercent = Math.max(0, Math.min(100, Math.round(result)));
    } else if (!Number.isFinite(Number(obj.videoCommentMentionPercent))) {
      obj.videoCommentMentionPercent = 100;
    }
  }
  if ("commentUseRandomSuffix" in options) {
    obj.commentUseRandomSuffix = !!options.commentUseRandomSuffix;
  }
  if ("enableCommentWithoutText" in options) {
    obj.enableCommentWithoutText = !!options.enableCommentWithoutText;
  }
  if ("enableCommentImage" in options) {
    obj.enableCommentImage = !!options.enableCommentImage;
  }
  if ("commentImagePaths" in options) {
    obj.commentImagePaths = Array.isArray(options.commentImagePaths) ? options.commentImagePaths.filter(arg1 => typeof arg1 === "string" && arg1.trim()) : [];
  }
  if ("commentImagePath" in options) {
    obj.commentImagePath = options.commentImagePath || "";
  }
  if ("enableCommentExpression" in options) {
    obj.enableCommentExpression = !!options.enableCommentExpression;
  }
  if ("commentExpressionCount" in options) {
    obj.commentExpressionCount = Math.max(1, Math.min(8, Number(options.commentExpressionCount) || 3));
  }
  if ("commentAttachmentPercent" in options) {
    const result = Number(options.commentAttachmentPercent);
    obj.commentAttachmentPercent = Number.isFinite(result) ? Math.max(0, Math.min(100, result)) : 20;
  }
  if (options.lead) {
    obj.lead = options.lead;
  }
  const local = obj.accountId || obj.lead?.accountId;
  if (local) {
    window._radar_account_id = local;
    try {
      sessionStorage.setItem("radar_account_id", local);
    } catch (error) {}
  }
  {
    const result = String(obj.name || obj.nickname || "").trim();
    const result2 = String(obj.lead?.accountName || "").trim();
    const result3 = String(obj.lead?.nickname || "").trim();
    let local = result || result2;
    if (local && result3 && local === result3 && !obj.name && result2 && result2 !== result3) {
      local = result2;
    }
    if (local) {
      window._radar_account_name = local;
    }
  }
  currentTask = obj;
  try {
    syncCommentAttachmentRotationFromBatchStorage();
  } catch (error) {}
  return currentTask;
}
function mergeProfileInfoToLead(arg1, arg2) {
  if (!arg1 || !arg2) {
    return arg1;
  }
  const result = String(arg2.nickname || "").trim().replace(/^@+/, "");
  const result2 = String(arg1.nickname || "").trim().replace(/^@+/, "");
  if (result) {
    const flag = isRejectedProfileNicknameCandidate(result);
    if (!flag) {
      arg1.nickname = result;
    } else if (!result2 && !/抖音号|IP属地|关注|粉丝|获赞|私密账号/.test(result)) {
      arg1.nickname = result;
    }
  }
  if (arg2.location) {
    arg1.location = arg2.location;
  }
  if (arg2.douyinId) {
    arg1.douyinId = arg2.douyinId;
  }
  if (arg2.gender) {
    arg1.gender = arg2.gender;
  }
  if (arg2.age != null) {
    arg1.age = arg2.age;
  }
  if (arg2.profileAgeChecked) {
    arg1.profileAgeChecked = true;
  }
  if (arg2.signature) {
    arg1.signature = arg2.signature;
  }
  if (arg2.contact) {
    arg1.contact = arg2.contact;
  }
  if (arg2.isPrivate !== undefined) {
    arg1.isPrivate = !!arg2.isPrivate;
  }
  if (arg2.worksCount !== undefined && arg2.worksCount !== null) {
    arg1.worksCount = arg2.worksCount;
    if (Number(arg2.worksCount) === 0) {
      arg1.noWorks = true;
    }
  }
  if (arg2.noWorks) {
    arg1.noWorks = true;
  }
  return arg1;
}
function leadHasProfileInfo(arg1) {
  if (!arg1) {
    return false;
  }
  return !!String(arg1.nickname || "").trim() || arg1.age != null || !!arg1.gender && arg1.gender !== "未知" || !!arg1.location || !!arg1.douyinId || !!arg1.signature || !!arg1.contact;
}
function emitLeadProfileUpdate(arg1, options = {}) {
  if (!arg1) {
    return;
  }
  Object.assign(arg1, options);
  if (!leadHasProfileInfo(arg1)) {
    return;
  }
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [arg1],
      taskId: activeLoopId,
      viewKey: currentTask?.viewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask)
    });
  } catch (error) {}
}
function persistScrapedLeadProfile(arg1, arg2, arg3 = null, options = {}) {
  if (!arg1 || !arg2) {
    return arg1;
  }
  applyEntryMetaToLead(arg1);
  mergeProfileInfoToLead(arg1, arg2);
  if (arg2.profileAgeChecked) {
    arg1.profileAgeChecked = true;
  }
  const local = arg3 || currentTask || {};
  const value = arg1.accountId;
  if (arg2.age != null) {
    if (arg2.age === 0) {
      console.log("%c[主页资料] @" + arg1.nickname + " 主页未显示年龄，记为 0 岁，已同步线索库", "color: #94a3b8; font-weight: bold;");
      reportTraceLog("👤 @" + arg1.nickname + "：主页未显示年龄，记为 0 岁", value);
    } else {
      console.log("%c[主页资料] @" + arg1.nickname + " 年龄 " + arg2.age + " 岁，已同步线索库", "color: #22c55e; font-weight: bold;");
      reportTraceLog("👤 @" + arg1.nickname + "：主页识别年龄 " + arg2.age + " 岁", value);
    }
  }
  if (arg2.isPrivate) {
    reportTraceLog("🔒 @" + arg1.nickname + "：识别为私密账号，已标记到线索", value, "warning");
  }
  if (arg2.worksCount === 0 || arg2.noWorks) {
    reportTraceLog("📭 @" + arg1.nickname + "：作品数为 0，已标记到线索", value, "warning");
  }
  if (isBatchAgeFilterActive(local) && arg2.age != null) {
    const result = checkBatchAgeFilter(arg2, local);
    const result2 = formatAgeFilterRangeLabel(local);
    if (!result.pass) {
      reportTraceLog("👤 @" + arg1.nickname + "：年龄 " + arg2.age + " 岁，不在设置范围 " + result2 + "（" + result.reason + "）", value, "warning");
    } else {
      reportTraceLog("👤 @" + arg1.nickname + "：年龄 " + arg2.age + " 岁，符合设置范围 " + result2, value);
    }
  }
  if (options.emit !== false) {
    emitLeadProfileUpdate(arg1);
  }
  return arg1;
}
function pickReusableProfileDetail(options = {}) {
  return {
    nickname: options.nickname || "",
    douyinId: options.douyinId || "",
    signature: options.signature || "",
    contact: options.contact || "",
    location: options.location || options.ipLocation || "",
    gender: options.gender || "未知",
    age: options.age ?? null,
    profileAgeChecked: !!options.profileAgeChecked,
    isPrivate: !!options.isPrivate,
    worksCount: options.worksCount,
    genderTimedOut: !!options.genderTimedOut,
    genderUnresolved: !!options.genderUnresolved,
    genderWaitMs: Number(options.genderWaitMs) || 0
  };
}
function emitLeadInteractionUpdate(arg1, options = {}) {
  if (!arg1) {
    return;
  }
  Object.assign(arg1, {
    interactionResolved: true,
    ...options
  });
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [arg1],
      taskId: activeLoopId,
      viewKey: currentTask?.viewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask)
    });
  } catch (error) {}
}
function emitSubviewActionCheckpoint(arg1, arg2) {
  if (!arg1 || !arg2) {
    return;
  }
  if (currentTask?.isMonitorAction) {
    return;
  }
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [arg1],
      taskId: currentTask?.taskId || currentTask?.parentTaskId || activeLoopId,
      viewKey: currentTask?.viewKey || currentViewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask),
      checkpointAction: arg2
    });
    reportTraceLog("💾 @" + (arg1.nickname || "用户") + "：" + arg2 + "已同步到线索库", arg1.accountId);
  } catch (error) {}
}
const LIKE_ERROR_REASON_TEXT = {
  comment_node_not_found: "未定位到该条评论节点（评论区可能已刷新或折叠）",
  like_button_not_found: "未找到该评论的点赞控件",
  like_not_confirmed: "已点击点赞但页面未回显已赞状态",
  like_exception: "点赞过程异常"
};
function describeAttemptedInteractions() {
  const list = [];
  if (currentTask?.enableLike) {
    list.push("点赞");
  }
  if (currentTask?.enableComment) {
    list.push("回复");
  }
  if (currentTask?.enableFollow) {
    list.push("关注");
  }
  if (currentTask?.enableDM) {
    list.push("私信");
  }
  return list.join("/");
}
function isVideoLocalQuotaExhaustedReason(arg1) {
  const result = String(arg1 || "");
  return result === "已达单视频上限" || result.includes("本视频点赞/回复配额已用完") || result.includes("单视频上限");
}
function noteVideoLocalQuotaExhaustedOnce(arg1) {
  const value = "_videoQuotaExhaustedLogged_" + String(arg1 || "");
  if (window[value]) {
    return false;
  }
  window[value] = true;
  reportTraceLog("已达单视频上限", null, "warning");
  return true;
}
function clearVideoLocalQuotaExhaustedFlag(arg1) {
  try {
    delete window["_videoQuotaExhaustedLogged_" + String(arg1 || "")];
  } catch (error) {}
}
function resolveInteractionSkipReason(arg1, {
  budget = {},
  aiDecision = null,
  interactionEntered = true,
  actionAttempted = false,
  likeErrorCode = ""
} = {}) {
  if (currentTask?.taskMode === "scrape") {
    return "仅采集模式不执行互动";
  }
  if (!arg1?.isHighIntention) {
    return "非高意向评论，已跳过互动";
  }
  if (arg1?.actionSkipReason) {
    return arg1.actionSkipReason;
  }
  if (isInteractionLimitReached()) {
    return "互动总上限已达（" + sessionInteractionCount + "/" + sessionInteractionLimit + "）";
  }
  if (!currentTask?.enableLike && !currentTask?.enableComment && !currentTask?.enableFollow && !currentTask?.enableDM) {
    return "未开启自动点赞/回复/关注/私信";
  }
  const local = Number(budget.likes) || 0;
  const local2 = Number(budget.comments) || 0;
  if (!interactionEntered) {
    return "本视频未分配互动配额（请检查是否开启点赞/回复，或单视频配额是否为 0）";
  }
  if (local <= 0 && local2 <= 0 && (currentTask?.enableLike || currentTask?.enableComment)) {
    return "已达单视频上限";
  }
  if (shouldUseAiCommentAnalysis(currentTask) && !aiDecision) {
    return "AI 模式下未获得分析结果";
  }
  if (aiDecision?.decision === "ignore") {
    return "AI 判定为忽略";
  }
  const local3 = hasLocalReplyTemplates() || hasCommentNonTextPayload(false) || !!currentTask?.enableCommentWithoutText;
  const local4 = !!String(aiDecision?.replyContent || "").trim() || !!String(arg1?.actions?.replyContent || arg1?.replyContent || "").trim();
  if (currentTask?.enableComment && !shouldUseAiReplyGeneration(currentTask) && !local3) {
    return "未配置本地回复文案且未绑定智能体";
  }
  if (actionAttempted) {
    const local = describeAttemptedInteractions() || "互动";
    const local2 = LIKE_ERROR_REASON_TEXT[likeErrorCode] || "";
    if (local2) {
      return local + "均未成功：" + local2;
    } else {
      return local + "均未成功（未找到评论节点或发布未成功）";
    }
  }
  if (currentTask?.enableComment && shouldUseAiReplyGeneration(currentTask) && !local3 && !local4) {
    return "未绑定智能体或 AI 未生成回复文案";
  }
  if (!currentTask?.enableLike && !currentTask?.enableComment && (currentTask?.enableFollow || currentTask?.enableDM)) {
    return "已尝试关注/私信但未成功";
  }
  return "配额或策略限制，已保留线索";
}
function reportFollowUpLimitReached(arg1) {
  const value = arg1 === "follow";
  const value2 = value ? sessionFollowCount : sessionDmCount;
  const value3 = value ? sessionFollowLimit : sessionDmLimit;
  const value4 = value ? sessionFollowLimitLogged : sessionDmLimitLogged;
  if (value3 === Infinity || value2 < value3 || value4) {
    return false;
  }
  const value5 = value ? "关注" : "私信";
  if (value) {
    sessionFollowLimitLogged = true;
  } else {
    sessionDmLimitLogged = true;
  }
  console.log("%c[节奏控制] 本次任务" + value5 + "总上限已达 (" + value2 + "/" + value3 + ")，后续不再" + value5, value ? "color: #8b5cf6; font-weight: bold;" : "color: #10b981; font-weight: bold;");
  reportTraceLog("🛡 本次任务" + value5 + "总上限已达（" + value2 + "/" + value3 + "），后续用户不再执行" + value5, null, "warning");
  reportCurrentAction("本次任务" + value5 + "已达上限 " + value2 + "/" + value3 + "，后续不再" + value5);
  return true;
}
function settleFollowUpFromExistingActions(arg1, arg2, arg3) {
  if (!arg1?.actions || !arg2) {
    return false;
  }
  let flag = false;
  let flag2 = false;
  if (arg1.actions.followed) {
    flag2 = true;
    const result = (arg1.touchLog || []).some(arg1 => arg1.type === "follow");
    if (!arg1.actions._followQuotaSettled) {
      if (arg2.follows > 0) {
        arg2.follows--;
      }
      sessionFollowCount++;
      persistSessionInteractionCount();
      arg1.actions._followQuotaSettled = true;
      if (!result) {
        recordLeadTouch(arg1, "follow");
      }
      flag = true;
      reportFollowUpLimitReached("follow");
    }
  }
  if (arg1.actions.messaged) {
    flag2 = true;
    const result = (arg1.touchLog || []).some(arg1 => arg1.type === "message");
    if (arg1.actions.dmSkipped) {
      arg1.actions._dmQuotaSettled = true;
    } else if (!arg1.actions._dmQuotaSettled) {
      if (arg2.dms > 0) {
        arg2.dms--;
      }
      sessionDmCount++;
      persistSessionInteractionCount();
      arg1.actions._dmQuotaSettled = true;
      if (!result) {
        recordLeadTouch(arg1, "message", {
          content: arg1.actions.dmContent || "已发送私信"
        });
      }
      flag = true;
      reportFollowUpLimitReached("dm");
    }
  }
  if (flag) {
    arg3();
  }
  return flag2;
}
ipcRenderer.on("interaction-result", (arg1, arg2) => {
  console.log("[Built-in-Debug] [主视图] 收到子视图回传结果");
  window._radar_subview_result = arg2;
});
let douyinDirectMessageController = null;
let douyinDirectMessageControllerLoadError = null;
try {
  const {
    createDouyinDirectMessageController
  } = require("./shared/douyinDirectMessageController");
  const douyinDirectMessageRuntimeState = {};
  Object.defineProperties(douyinDirectMessageRuntimeState, {
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: arg1 => {
        currentViewKey = arg1;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: arg1 => {
        lastTrustedClickDiagnostic = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    }
  });
  douyinDirectMessageController = createDouyinDirectMessageController({
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    findSmartElement: findSmartElement,
    getDmV2List: getDmV2List,
    getDmV2String: getDmV2String,
    getElementClassText: getElementClassText,
    getComputedStyle: arg1 => window.getComputedStyle(arg1),
    hasDmRuntimeReady: hasDmRuntimeReady,
    insertTextIntoEditable: insertTextIntoEditable,
    ipcRenderer: ipcRenderer,
    isElementInViewport: isElementInViewport,
    isVisibleElement: isVisibleElement,
    randomDelay: randomDelay,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedEnter: simulateTrustedEnter,
    sleep: sleep,
    waitForDmInput: waitForDmInput,
    waitForSmartElement: waitForSmartElement,
    state: douyinDirectMessageRuntimeState
  });
} catch (error) {
  douyinDirectMessageControllerLoadError = error;
  console.error("[Built-in-Debug] 抖音私信控制器加载失败:", error);
}
function logSelfWarmupDm(...restArgs) {
  if (douyinDirectMessageController?.logSelfWarmupDm) {
    return douyinDirectMessageController.logSelfWarmupDm(...restArgs);
  }
  console.warn("[Built-in-Debug] [私信] 控制器不可用", ...restArgs);
}
function replyDmInConversation(...restArgs) {
  if (douyinDirectMessageController?.replyDmInConversation) {
    return douyinDirectMessageController.replyDmInConversation(...restArgs);
  }
  const local = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
  return Promise.resolve({
    success: false,
    ok: false,
    reason: local
  });
}
function sendDmOnCurrentProfile(...restArgs) {
  if (douyinDirectMessageController?.sendDmOnCurrentProfile) {
    return douyinDirectMessageController.sendDmOnCurrentProfile(...restArgs);
  }
  const local = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
  return Promise.resolve({
    success: false,
    ok: false,
    reason: local
  });
}
let douyinDomInteractionController = null;
let douyinDomInteractionControllerLoadError = null;
try {
  const {
    createDouyinDomInteractionController
  } = require("./shared/douyinDomInteractionController");
  const douyinDomInteractionRuntimeState = {};
  Object.defineProperties(douyinDomInteractionRuntimeState, {
    currentActionMentionRolled: {
      enumerable: true,
      get: () => currentActionMentionRolled,
      set: arg1 => {
        currentActionMentionRolled = arg1;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lastNativeClickBackgroundHosted: {
      enumerable: true,
      get: () => lastNativeClickBackgroundHosted,
      set: arg1 => {
        lastNativeClickBackgroundHosted = arg1;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: arg1 => {
        lastTrustedClickDiagnostic = arg1;
      }
    }
  });
  douyinDomInteractionController = createDouyinDomInteractionController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    briefEl: briefEl,
    describeDomControl: describeDomControl,
    buildImageAttachScope: buildImageAttachScope,
    clipTraceText: clipTraceText,
    collectCommentImageTriggerCandidates: collectCommentImageTriggerCandidates,
    elementsNearlyOverlap: elementsNearlyOverlap,
    findCommentScrollContainer: findCommentScrollContainer,
    findEmojiTriggerBtn: findEmojiTriggerBtn,
    findProfileFollowButtonByText: findProfileFollowButtonByText,
    findProfileMessageButtonByText: findProfileMessageButtonByText,
    getCommentComposerRoot: getCommentComposerRoot,
    getCommentV2String: getCommentV2String,
    getDmV2String: getDmV2String,
    getGatedString: getGatedString,
    getGatedTextPack: getGatedTextPack,
    getGatedVariantList: getGatedVariantList,
    getDouyinFeedScope: getDouyinFeedScope,
    getExtendedReadyBudgetMs: getExtendedReadyBudgetMs,
    hasDmRuntimeReady: hasDmRuntimeReady,
    hasProfileActionRuntimeReady: hasProfileActionRuntimeReady,
    ipcRenderer: ipcRenderer,
    isEmojiTriggerCandidate: isEmojiTriggerCandidate,
    isFeedStyleSource: isFeedStyleSource,
    randomDelay: randomDelay,
    reportEmojiDebug: reportEmojiDebug,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    shouldAbort: shouldAbort,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    state: douyinDomInteractionRuntimeState,
    webFrame: webFrame
  });
} catch (error) {
  douyinDomInteractionControllerLoadError = error;
  console.error("[Built-in-Debug] 抖音 DOM 交互控制器加载失败:", error);
}
let profileInteractionController = null;
let profileInteractionControllerLoadError = null;
try {
  const {
    createProfileInteractionController
  } = require("./shared/profileInteractionController");
  const profileInteractionRuntimeState = {};
  Object.defineProperties(profileInteractionRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    activeSubviewInteractionId: {
      enumerable: true,
      get: () => activeSubviewInteractionId,
      set: arg1 => {
        activeSubviewInteractionId = arg1;
      }
    },
    cancelledSubviewInteractionIds: {
      enumerable: true,
      get: () => cancelledSubviewInteractionIds,
      set: arg1 => {
        cancelledSubviewInteractionIds = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: arg1 => {
        currentViewKey = arg1;
      }
    },
    isInteractionView: {
      enumerable: true,
      get: () => isInteractionView,
      set: arg1 => {
        isInteractionView = arg1;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: arg1 => {
        pausedForSubview = arg1;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: arg1 => {
        sessionDmCount = arg1;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: arg1 => {
        sessionDmLimit = arg1;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: arg1 => {
        sessionFollowCount = arg1;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: arg1 => {
        sessionFollowLimit = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    subviewTaskAls: {
      enumerable: true,
      get: () => subviewTaskAls,
      set: arg1 => {
        subviewTaskAls = arg1;
      }
    },
    subviewTaskSeq: {
      enumerable: true,
      get: () => subviewTaskSeq,
      set: arg1 => {
        subviewTaskSeq = arg1;
      }
    },
    subviewTaskStarted: {
      enumerable: true,
      get: () => subviewTaskStarted,
      set: arg1 => {
        subviewTaskStarted = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    }
  });
  profileInteractionController = createProfileInteractionController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    _normalizeTouchLogEntries: _normalizeTouchLogEntries,
    applyEntryMetaToLead: applyEntryMetaToLead,
    applySubviewRuntimeTask: applySubviewRuntimeTask,
    clearPendingSubviewTask: clearPendingSubviewTask,
    clipTraceText: clipTraceText,
    detectMonitorPrivateProfile: detectMonitorPrivateProfile,
    emitLeadInteractionUpdate: emitLeadInteractionUpdate,
    emitSubviewActionCheckpoint: emitSubviewActionCheckpoint,
    findProfileVideoCards: findProfileVideoCards,
    findSmartElement: findSmartElement,
    getAutomationTextHelpersModule: getAutomationTextHelpersModule,
    getGatedTextPack: getGatedTextPack,
    getGatedVariantList: getGatedVariantList,
    getGatedString: getGatedString,
    getVideoEngagePack: getVideoEngagePack,
    getProfilePostListRoot: getProfilePostListRoot,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    hasDmRuntimeReady: hasDmRuntimeReady,
    hasProfileActionRuntimeReady: hasProfileActionRuntimeReady,
    hasRemoteGatedConfig: hasRemoteGatedConfig,
    ipcRenderer: ipcRenderer,
    isDouyinProfileTargetingEnabled: isDouyinProfileTargetingEnabled,
    isProfileFirstCommentAiMode: isProfileFirstCommentAiMode,
    isProfileFirstWorkCommentDone: isProfileFirstWorkCommentDone,
    isVisibleElement: isVisibleElement,
    localStorage: localStorage,
    markBatchProfileCommentDone: markBatchProfileCommentDone,
    markSubviewInteractionCancelled: markSubviewInteractionCancelled,
    matchLeadProfileForDy: matchLeadProfileForDy,
    mergeProfileInfoToLead: mergeProfileInfoToLead,
    normalizeProfileUrlForReturn: normalizeProfileUrlForReturn,
    normalizeUserUrl: normalizeUserUrl,
    parseProfileWorksCount: parseProfileWorksCount,
    performProfileActions: performProfileActions,
    performProfileFirstWorkComment: performProfileFirstWorkComment,
    performVideoMonitorFollow: performVideoMonitorFollow,
    persistScrapedLeadProfile: persistScrapedLeadProfile,
    persistSubviewTaskForResume: persistSubviewTaskForResume,
    personalizeDmTemplate: personalizeDmTemplate,
    pickReusableProfileDetail: pickReusableProfileDetail,
    profileHasNoPublicWorks: profileHasNoPublicWorks,
    randomDelay: randomDelay,
    recordLeadTouch: recordLeadTouch,
    reportCurrentAction: reportCurrentAction,
    reportProfileFirstTrace: reportProfileFirstTrace,
    reportTraceLog: reportTraceLog,
    restoreProfileAfterWarmup: restoreProfileAfterWarmup,
    safeSessionSet: safeSessionSet,
    sendDmOnCurrentProfile: sendDmOnCurrentProfile,
    settleFollowUpFromExistingActions: settleFollowUpFromExistingActions,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedKey: simulateTrustedKey,
    sleep: sleep,
    waitForProfileWorksReady: waitForProfileWorksReady,
    wasBatchProfileCommentDone: wasBatchProfileCommentDone,
    withBackgroundAutomationLayout: withBackgroundAutomationLayout,
    preloadDir: __dirname,
    state: profileInteractionRuntimeState
  });
} catch (error) {
  profileInteractionControllerLoadError = error;
  console.error("[Built-in-Debug] 子视图主页互动控制器加载失败:", error);
}
function appendRandomEmojiSuffix(...restArgs) {
  return profileInteractionController?.appendRandomEmojiSuffix(...restArgs) || "";
}
function applyFollowUpActions(...restArgs) {
  return profileInteractionController?.applyFollowUpActions(...restArgs);
}
function applyRiskyEmojiReplaceForComment(...restArgs) {
  return profileInteractionController?.applyRiskyEmojiReplaceForComment(...restArgs) || "";
}
function checkBatchAgeFilter(...restArgs) {
  return profileInteractionController?.checkBatchAgeFilter(...restArgs);
}
function classifyCommentFailureToastLocal(...restArgs) {
  return profileInteractionController?.classifyCommentFailureToastLocal(...restArgs) || "";
}
function closeAllModals(...restArgs) {
  return profileInteractionController?.closeAllModals(...restArgs);
}
function commentDraftHasCoreTextLocal(...restArgs) {
  return profileInteractionController?.commentDraftHasCoreTextLocal(...restArgs) || false;
}
function evaluateTaskGenderFilter(...restArgs) {
  return profileInteractionController?.evaluateTaskGenderFilter(...restArgs);
}
function extractUserIdFromUrl(...restArgs) {
  return profileInteractionController?.extractUserIdFromUrl(...restArgs) || "";
}
function findProfileFollowButtonByText(...restArgs) {
  return profileInteractionController?.findProfileFollowButtonByText(...restArgs);
}
function findProfileMessageButtonByText(...restArgs) {
  return profileInteractionController?.findProfileMessageButtonByText(...restArgs);
}
function findSmartElementQuiet(...restArgs) {
  return profileInteractionController?.findSmartElementQuiet(...restArgs);
}
function formatAgeFilterRangeLabel(...restArgs) {
  return profileInteractionController?.formatAgeFilterRangeLabel(...restArgs) || "";
}
function formatObservedAgeLabel(...restArgs) {
  return profileInteractionController?.formatObservedAgeLabel(...restArgs) || "";
}
function getElementClassText(...restArgs) {
  return profileInteractionController?.getElementClassText(...restArgs) || "";
}
function isBatchAgeFilterActive(...restArgs) {
  return profileInteractionController?.isBatchAgeFilterActive(...restArgs) || false;
}
function isCommentDraftOnlyEmojiDriftLocal(...restArgs) {
  return profileInteractionController?.isCommentDraftOnlyEmojiDriftLocal(...restArgs) || false;
}
function isRejectedProfileNicknameCandidate(...restArgs) {
  return profileInteractionController?.isRejectedProfileNicknameCandidate(...restArgs) || false;
}
function parseProfileGenderFromApiPayload(...restArgs) {
  return profileInteractionController?.parseProfileGenderFromApiPayload(...restArgs);
}
function performProfileActionsLogic(...restArgs) {
  return profileInteractionController?.performProfileActionsLogic(...restArgs);
}
function rememberProfileApiGenderHit(...restArgs) {
  return profileInteractionController?.rememberProfileApiGenderHit(...restArgs);
}
function replaceRiskyCommentEmojisLocal(...restArgs) {
  return profileInteractionController?.replaceRiskyCommentEmojisLocal(...restArgs) || "";
}
function resolveFollowUpFlags(...restArgs) {
  return profileInteractionController?.resolveFollowUpFlags(...restArgs);
}
function resolveProfileFirstGenderFilter(...restArgs) {
  return profileInteractionController?.resolveProfileFirstGenderFilter(...restArgs) || "";
}
function resolveTaskGenderFilter(...restArgs) {
  return profileInteractionController?.resolveTaskGenderFilter(...restArgs) || "";
}
function scrapeDetailedProfile(...restArgs) {
  return profileInteractionController?.scrapeDetailedProfile(...restArgs);
}
function shouldAppendCommentRandomSuffix(...restArgs) {
  return profileInteractionController?.shouldAppendCommentRandomSuffix(...restArgs) || false;
}
function shouldAppendVideoCommentRandomSuffix(...restArgs) {
  return profileInteractionController?.shouldAppendVideoCommentRandomSuffix(...restArgs) || false;
}
function waitForSmartElement(...restArgs) {
  return profileInteractionController?.waitForSmartElement(...restArgs);
}
let automationMediaController = null;
let automationMediaControllerLoadError = null;
try {
  const {
    createAutomationMediaController
  } = require("./shared/automationMediaController");
  const automationMediaRuntimeState = {};
  Object.defineProperties(automationMediaRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: arg1 => {
        lockedLeadVideoUrl = arg1;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: arg1 => {
        pausedForSubview = arg1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: arg1 => {
        processedVideos = arg1;
      }
    },
    scrapeAiQueue: {
      enumerable: true,
      get: () => scrapeAiQueue,
      set: arg1 => {
        scrapeAiQueue = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    subviewTaskAls: {
      enumerable: true,
      get: () => subviewTaskAls,
      set: arg1 => {
        subviewTaskAls = arg1;
      }
    },
    subviewTaskSeq: {
      enumerable: true,
      get: () => subviewTaskSeq,
      set: arg1 => {
        subviewTaskSeq = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    }
  });
  automationMediaController = createAutomationMediaController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    formatScrapeGuardWaitLabel: formatScrapeGuardWaitLabel,
    getBoundSubviewInteractionId: getBoundSubviewInteractionId,
    getDouyinFeedScope: getDouyinFeedScope,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoTitle: getVideoTitle,
    ipcRenderer: ipcRenderer,
    isSubviewInteractionCancelled: isSubviewInteractionCancelled,
    isVisibleElement: isVisibleElement,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    pickLeadVideoUrl: pickLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    sleep: sleep,
    state: automationMediaRuntimeState
  });
} catch (error) {
  automationMediaControllerLoadError = error;
  console.error("[Built-in-Debug] 自动化媒体守护控制器加载失败:", error);
}
function burstPauseWithinOneSecond(...restArgs) {
  return automationMediaController?.burstPauseWithinOneSecond(...restArgs);
}
function getCurrentContentPauseProfile(...restArgs) {
  return automationMediaController?.getCurrentContentPauseProfile(...restArgs);
}
function getCurrentVideoGuardState(...restArgs) {
  return automationMediaController?.getCurrentVideoGuardState(...restArgs);
}
function getVisibleDouyinVideoDurationMs(...restArgs) {
  return automationMediaController?.getVisibleDouyinVideoDurationMs(...restArgs);
}
function guardedCurrentVideoDelay(...restArgs) {
  return automationMediaController?.guardedCurrentVideoDelay(...restArgs) || Promise.resolve();
}
function guardedPauseDelay(...restArgs) {
  return automationMediaController?.guardedPauseDelay(...restArgs) || Promise.resolve();
}
function isAiInvokeCancelled(...restArgs) {
  if (!automationMediaController) {
    return true;
  }
  return automationMediaController.isAiInvokeCancelled(...restArgs);
}
function isMonitorLoopId(...restArgs) {
  return automationMediaController?.isMonitorLoopId(...restArgs) || false;
}
function isSameVideoTitleLoose(...restArgs) {
  return automationMediaController?.isSameVideoTitleLoose(...restArgs) || false;
}
function pauseVisibleDouyinVideos(...restArgs) {
  return automationMediaController?.pauseVisibleDouyinVideos(...restArgs) || 0;
}
function randomDelay(...restArgs) {
  return automationMediaController?.randomDelay(...restArgs) || Promise.resolve();
}
function randomDelayWithinDeadline(...restArgs) {
  return automationMediaController?.randomDelayWithinDeadline(...restArgs) || Promise.resolve();
}
function releaseAbandonedVideoClaim(...restArgs) {
  return automationMediaController?.releaseAbandonedVideoClaim(...restArgs);
}
function resetScrapeAiQueueOnStop(...restArgs) {
  return automationMediaController?.resetScrapeAiQueueOnStop(...restArgs);
}
function resumeVisibleDouyinVideos(...restArgs) {
  return automationMediaController?.resumeVisibleDouyinVideos(...restArgs) || 0;
}
function shouldAbort(...restArgs) {
  if (!automationMediaController) {
    return true;
  }
  return automationMediaController.shouldAbort(...restArgs);
}
function sleepWithinDeadline(...restArgs) {
  return automationMediaController?.sleepWithinDeadline(...restArgs) || Promise.resolve();
}
function startCurrentVideoPauseGuard(...restArgs) {
  return automationMediaController?.startCurrentVideoPauseGuard(...restArgs);
}
function isCurrentVideoPauseGuardDrifted(arg1) {
  if (!arg1) {
    return false;
  }
  if (arg1.drifted) {
    return true;
  }
  if (arg1.lastState) {
    return !arg1.lastState.same;
  } else {
    return false;
  }
}
async function awaitInteractionCooldown(arg1, options = {}) {
  const local = parseInt(currentTask?.intervalMin, 10) || 5;
  const local2 = parseInt(currentTask?.intervalMax, 10) || 12;
  const value = options.profileWorkCommented ? "主页评论后间隔" : "互动间隔";
  const result = Math.floor(Math.random() * (local2 - local + 1) + local);
  console.log("%c[节奏控制] 本条线索互动已完成，冷却 " + result + " 秒后继续（可在设置里调整「互动间隔」）", "color: #94a3b8; font-style: italic;");
  reportTraceLog("🛡 节奏冷却：本条互动完成，随机等待 " + result + " 秒后继续");
  await randomDelay(result * 1000, result * 1000, arg1, value);
}
async function awaitPostActionRest(arg1, options = {}) {
  if (options.profileWork) {
    await randomDelay(800, 1500, arg1, "操作后休眠");
  } else {
    await randomDelay(2000, 4000, arg1, "操作后休眠");
  }
}
function buildVideoCardLead(...restArgs) {
  return douyinSearchMetadataController?.buildVideoCardLead(...restArgs);
}
function canLinkOnlyScrapeWithoutOpen(...restArgs) {
  return douyinSearchMetadataController?.canLinkOnlyScrapeWithoutOpen(...restArgs) || false;
}
function collectDouyinSearchResultCards(...restArgs) {
  return douyinSearchMetadataController?.collectDouyinSearchResultCards(...restArgs) || [];
}
function emitLinkOnlyScrapeLead(...restArgs) {
  return douyinSearchMetadataController?.emitLinkOnlyScrapeLead(...restArgs);
}
function emitVideoCardLead(...restArgs) {
  return douyinSearchMetadataController?.emitVideoCardLead(...restArgs);
}
function ensureLeadgenScrapeApiBridge(...restArgs) {
  return douyinSearchMetadataController?.ensureLeadgenScrapeApiBridge(...restArgs) || false;
}
function ensureLeadgenScrapeApiHook(...restArgs) {
  return douyinSearchMetadataController?.ensureLeadgenScrapeApiHook(...restArgs) || false;
}
function findAwemeIdForCard(...restArgs) {
  return douyinSearchMetadataController?.findAwemeIdForCard(...restArgs);
}
function findDouyinSearchCardContentId(...restArgs) {
  return douyinSearchMetadataController?.findDouyinSearchCardContentId(...restArgs) || "";
}
function findSearchCardAuthorNickname(...restArgs) {
  return douyinSearchMetadataController?.findSearchCardAuthorNickname(...restArgs) || "";
}
function findSearchCardAuthorProfileUrl(...restArgs) {
  return douyinSearchMetadataController?.findSearchCardAuthorProfileUrl(...restArgs) || "";
}
function findSearchCardVideoUrl(...restArgs) {
  return douyinSearchMetadataController?.findSearchCardVideoUrl(...restArgs) || "";
}
function getDouyinSearchCardClickTarget(...restArgs) {
  return douyinSearchMetadataController?.getDouyinSearchCardClickTarget(...restArgs);
}
function getDouyinSearchCardRoot(...restArgs) {
  return douyinSearchMetadataController?.getDouyinSearchCardRoot(...restArgs);
}
function getDouyinSearchZeroDiagnostics(...restArgs) {
  return douyinSearchMetadataController?.getDouyinSearchZeroDiagnostics(...restArgs);
}
function getDouyinVideoAuthorApi(...restArgs) {
  return douyinSearchMetadataController?.getDouyinVideoAuthorApi(...restArgs);
}
function getScrapeTargetSet(...restArgs) {
  return douyinSearchMetadataController?.getScrapeTargetSet(...restArgs);
}
function isLinkOnlyScrapeTask(...restArgs) {
  return douyinSearchMetadataController?.isLinkOnlyScrapeTask(...restArgs) || false;
}
function listLeadgenScrapeAwemes(...restArgs) {
  return douyinSearchMetadataController?.listLeadgenScrapeAwemes(...restArgs) || [];
}
function clearLeadgenScrapeAwemeCache(...restArgs) {
  return douyinSearchMetadataController?.clearLeadgenScrapeAwemeCache(...restArgs);
}
function lookupLeadgenScrapeAweme(...restArgs) {
  return douyinSearchMetadataController?.lookupLeadgenScrapeAweme(...restArgs);
}
function maybeReportDouyinSearchZeroDiagnostics(...restArgs) {
  return douyinSearchMetadataController?.maybeReportDouyinSearchZeroDiagnostics(...restArgs);
}
function normalizeDouyinAuthorProfileUrl(...restArgs) {
  return douyinSearchMetadataController?.normalizeDouyinAuthorProfileUrl(...restArgs) || "";
}
function resolveSearchCardScrapeFields(...restArgs) {
  return douyinSearchMetadataController?.resolveSearchCardScrapeFields(...restArgs);
}
function shouldCollectScrapeVideoMetadata(...restArgs) {
  return douyinSearchMetadataController?.shouldCollectScrapeVideoMetadata(...restArgs) || false;
}
function waitLeadgenScrapeAwemeAuthor(...restArgs) {
  return douyinSearchMetadataController?.waitLeadgenScrapeAwemeAuthor(...restArgs);
}
let searchVideoQueueController = null;
let searchVideoQueueControllerLoadError = null;
try {
  const {
    createSearchVideoQueueController
  } = require("./shared/searchVideoQueueController");
  const searchVideoQueueRuntimeState = {};
  Object.defineProperties(searchVideoQueueRuntimeState, {
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: arg1 => {
        lastClickedId = arg1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: arg1 => {
        processedVideos = arg1;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: arg1 => {
        sessionProcessedCount = arg1;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: arg1 => {
        targetVideoCount = arg1;
      }
    }
  });
  searchVideoQueueController = createSearchVideoQueueController({
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    closeAllModals: closeAllModals,
    collectDouyinSearchResultCards: collectDouyinSearchResultCards,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findDouyinSearchCardContentId: findDouyinSearchCardContentId,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getDouyinSearchCardRoot: getDouyinSearchCardRoot,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    isVisibleElement: isVisibleElement,
    listLeadgenScrapeAwemes: listLeadgenScrapeAwemes,
    moveToNextVideo: moveToNextVideo,
    normalizeUrl: normalizeUrl,
    randomDelay: randomDelay,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    shouldAbort: shouldAbort,
    sleep: sleep,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    state: searchVideoQueueRuntimeState
  });
} catch (error) {
  searchVideoQueueControllerLoadError = error;
  console.error("[Built-in-Debug] 搜索视频队列控制器加载失败:", error);
}
function advanceAfterSearchQueuedVideo(...restArgs) {
  return searchVideoQueueController?.advanceAfterSearchQueuedVideo(...restArgs);
}
function buildDouyinSearchResultCardMap(...restArgs) {
  return searchVideoQueueController?.buildDouyinSearchResultCardMap(...restArgs);
}
function clearSearchPendingOpenUrl(...restArgs) {
  return searchVideoQueueController?.clearSearchPendingOpenUrl(...restArgs);
}
function clearSearchSlideOscillationState(...restArgs) {
  return searchVideoQueueController?.clearSearchSlideOscillationState(...restArgs);
}
function clearSearchVideoUrlQueue(...restArgs) {
  return searchVideoQueueController?.clearSearchVideoUrlQueue(...restArgs);
}
function collectSearchVideoUrlsForCommentTask(...restArgs) {
  return searchVideoQueueController?.collectSearchVideoUrlsForCommentTask(...restArgs);
}
function findNextUnprocessedSearchQueueUrl(...restArgs) {
  return searchVideoQueueController?.findNextUnprocessedSearchQueueUrl(...restArgs);
}
function isSearchQueueUrlSessionDone(...restArgs) {
  return searchVideoQueueController?.isSearchQueueUrlSessionDone(...restArgs);
}
function markSearchQueueUrlSkipped(...restArgs) {
  return searchVideoQueueController?.markSearchQueueUrlSkipped(...restArgs) || "";
}
function normalizeSearchQueueVideoUrl(...restArgs) {
  return searchVideoQueueController?.normalizeSearchQueueVideoUrl(...restArgs) || "";
}
function noteSearchSlideVideoKey(...restArgs) {
  return searchVideoQueueController?.noteSearchSlideVideoKey(...restArgs);
}
function openSearchQueueVideoByUrl(...restArgs) {
  return searchVideoQueueController?.openSearchQueueVideoByUrl(...restArgs);
}
function peekSearchPendingOpenUrl(...restArgs) {
  return searchVideoQueueController?.peekSearchPendingOpenUrl(...restArgs) || "";
}
function setSearchPendingOpenUrl(...restArgs) {
  return searchVideoQueueController?.setSearchPendingOpenUrl(...restArgs) || "";
}
function shouldUseSearchVideoUrlQueue(...restArgs) {
  return searchVideoQueueController?.shouldUseSearchVideoUrlQueue(...restArgs) || false;
}
let douyinSearchMetadataController = null;
let douyinSearchMetadataControllerLoadError = null;
try {
  const {
    createDouyinSearchMetadataController
  } = require("./shared/douyinSearchMetadataController");
  const douyinSearchMetadataRuntimeState = {};
  Object.defineProperties(douyinSearchMetadataRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lastDouyinSearchZeroDiagAt: {
      enumerable: true,
      get: () => lastDouyinSearchZeroDiagAt,
      set: arg1 => {
        lastDouyinSearchZeroDiagAt = arg1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: arg1 => {
        processedVideos = arg1;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: arg1 => {
        sessionProcessedCount = arg1;
      }
    }
  });
  douyinSearchMetadataController = createDouyinSearchMetadataController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    applyEntryMetaToLead: applyEntryMetaToLead,
    clipTraceText: clipTraceText,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserIdFromUrl: extractUserIdFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    getPlannedVideoCountForDisplay: getPlannedVideoCountForDisplay,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getSearchApiReadyTracker: getSearchApiReadyTracker,
    getRuntimeApiHooks: getRuntimeApiHooks,
    getVideoSearchScrapePolicyModule: getVideoSearchScrapePolicyModule,
    ipcRenderer: ipcRenderer,
    isVisibleElement: isVisibleElement,
    loadCreateDouyinVideoAuthorApi: loadCreateDouyinVideoAuthorApi,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    matchTitleKeywordList: matchTitleKeywordList,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    parseTitleKeywordList: parseTitleKeywordList,
    reportTraceLog: reportTraceLog,
    sleep: sleep,
    preloadDir: __dirname,
    state: douyinSearchMetadataRuntimeState
  });
} catch (error) {
  douyinSearchMetadataControllerLoadError = error;
  console.error("[Built-in-Debug] 抖音搜索元数据控制器加载失败:", error);
}
function appendCommentMentionsAfterAttachments(...restArgs) {
  return douyinDomInteractionController?.appendCommentMentionsAfterAttachments(...restArgs);
}
function composeCommentInputWithMentions(...restArgs) {
  return douyinDomInteractionController?.composeCommentInputWithMentions(...restArgs);
}
function findSmartElement(...restArgs) {
  return douyinDomInteractionController?.findSmartElement(...restArgs);
}
function focusWithoutScroll(...restArgs) {
  return douyinDomInteractionController?.focusWithoutScroll(...restArgs);
}
function insertTextIntoEditable(...restArgs) {
  return douyinDomInteractionController?.insertTextIntoEditable(...restArgs);
}
function isElementInViewport(...restArgs) {
  return douyinDomInteractionController?.isElementInViewport(...restArgs) || false;
}
function isElementInViewportForAutomation(...restArgs) {
  return douyinDomInteractionController?.isElementInViewportForAutomation(...restArgs) || false;
}
function isVisibleElement(...restArgs) {
  return douyinDomInteractionController?.isVisibleElement(...restArgs) || false;
}
function reportMentionDebug(...restArgs) {
  return douyinDomInteractionController?.reportMentionDebug(...restArgs);
}
function resolveActiveMentionPercent(...restArgs) {
  return douyinDomInteractionController?.resolveActiveMentionPercent(...restArgs);
}
function resolveCommentMentionPosition(...restArgs) {
  return douyinDomInteractionController?.resolveCommentMentionPosition(...restArgs) || "";
}
function rollMentionProbability(...restArgs) {
  return douyinDomInteractionController?.rollMentionProbability(...restArgs);
}
function safeScrollTargetIntoView(...restArgs) {
  return douyinDomInteractionController?.safeScrollTargetIntoView(...restArgs);
}
function shouldUseCommentMentions(...restArgs) {
  return douyinDomInteractionController?.shouldUseCommentMentions(...restArgs) || false;
}
function simulateHumanClick(...restArgs) {
  return douyinDomInteractionController?.simulateHumanClick(...restArgs);
}
function simulateTrustedElementClick(...restArgs) {
  return douyinDomInteractionController?.simulateTrustedElementClick(...restArgs);
}
function simulateTrustedEnter(...restArgs) {
  return douyinDomInteractionController?.simulateTrustedEnter(...restArgs);
}
function simulateTrustedKey(...restArgs) {
  return douyinDomInteractionController?.simulateTrustedKey(...restArgs);
}
function waitForDmInput(...restArgs) {
  return douyinDomInteractionController?.waitForDmInput(...restArgs);
}
let currentActionMentionRolled = null;
const SPECIFIC_VIDEO_NAV_MISS_MAX = 4;
const SPECIFIC_VIDEO_LOAD_TIMEOUT_MS = 60000;
const SPECIFIC_VIDEO_OPEN_RETRY_MAX = 3;
const SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS = 15000;
const SPECIFIC_VIDEO_NAV_APPEAR_WAIT_MS = 15000;
const SPECIFIC_VIDEO_STATE_KEY = "radar_specific_video_state_v1";
let specificVideoNavigationController = null;
let specificVideoNavigationControllerLoadError = null;
try {
  const {
    createSpecificVideoNavigationController
  } = require("./shared/specificVideoNavigationController");
  const specificVideoNavigationRuntimeState = {};
  Object.defineProperties(specificVideoNavigationRuntimeState, {
    allowSpecificReprocess: {
      enumerable: true,
      get: () => allowSpecificReprocess,
      set: arg1 => {
        allowSpecificReprocess = arg1;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: arg1 => {
        lastClickedId = arg1;
      }
    },
    pendingTaskRestart: {
      enumerable: true,
      get: () => pendingTaskRestart,
      set: arg1 => {
        pendingTaskRestart = arg1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: arg1 => {
        processedVideos = arg1;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: arg1 => {
        sessionProcessedCount = arg1;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: arg1 => {
        targetVideoCount = arg1;
      }
    },
    videoMainCommentedVideoIds: {
      enumerable: true,
      get: () => videoMainCommentedVideoIds,
      set: arg1 => {
        videoMainCommentedVideoIds = arg1;
      }
    }
  });
  specificVideoNavigationController = createSpecificVideoNavigationController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: SPECIFIC_VIDEO_LOAD_TIMEOUT_MS,
    SPECIFIC_VIDEO_NAV_APPEAR_WAIT_MS: SPECIFIC_VIDEO_NAV_APPEAR_WAIT_MS,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: SPECIFIC_VIDEO_OPEN_RETRY_MAX,
    SPECIFIC_VIDEO_STATE_KEY: SPECIFIC_VIDEO_STATE_KEY,
    clipTraceText: clipTraceText,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    extractVideoIdFromHref: extractVideoIdFromHref,
    finalizeAccountTask: finalizeAccountTask,
    findCommentScrollContainer: findCommentScrollContainer,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getSpecificVideoOpenModule: getSpecificVideoOpenModule,
    getVideoEngagePack: getVideoEngagePack,
    ipcRenderer: ipcRenderer,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    legacyRadarSessionKey: legacyRadarSessionKey,
    localStorage: localStorage,
    logTaskDbg: logTaskDbg,
    lookupSpecificVideoApiProbe: lookupSpecificVideoApiProbe,
    normalizeUrl: normalizeUrl,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    scrollCommentList: scrollCommentList,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    sleep: sleep,
    state: specificVideoNavigationRuntimeState
  });
} catch (error) {
  specificVideoNavigationControllerLoadError = error;
  console.error("[Built-in-Debug] 指定视频导航控制器加载失败:", error);
}
function awaitSpecificVideoOpenSettle(...restArgs) {
  return specificVideoNavigationController?.awaitSpecificVideoOpenSettle(...restArgs);
}
function clearClaimedSpecificVideoUrl(...restArgs) {
  return specificVideoNavigationController?.clearClaimedSpecificVideoUrl(...restArgs);
}
function clickCommentPanelLoadingPlaceholder(...restArgs) {
  return specificVideoNavigationController?.clickCommentPanelLoadingPlaceholder(...restArgs);
}
function consumeTaskRestartFlag(...restArgs) {
  return specificVideoNavigationController?.consumeTaskRestartFlag(...restArgs);
}
function convertToDouyinModalUrl(...restArgs) {
  return specificVideoNavigationController?.convertToDouyinModalUrl(...restArgs) || "";
}
function describeSpecificVideoSkipReason(...restArgs) {
  return specificVideoNavigationController?.describeSpecificVideoSkipReason(...restArgs);
}
function ensureClaimedSpecificVideoUrl(...restArgs) {
  return specificVideoNavigationController?.ensureClaimedSpecificVideoUrl(...restArgs);
}
function evaluateSpecificVideoOpenProgress(...restArgs) {
  return specificVideoNavigationController?.evaluateSpecificVideoOpenProgress(...restArgs);
}
function extractSpecificVideoId(...restArgs) {
  return specificVideoNavigationController?.extractSpecificVideoId(...restArgs) || "";
}
function finishSpecificSourceTask(...restArgs) {
  return specificVideoNavigationController?.finishSpecificSourceTask(...restArgs);
}
function getPlannedVideoCountForDisplay(...restArgs) {
  return specificVideoNavigationController?.getPlannedVideoCountForDisplay(...restArgs);
}
function getSpecificPlannedVideoCount(...restArgs) {
  return specificVideoNavigationController?.getSpecificPlannedVideoCount(...restArgs);
}
function getSpecificVideoProbeState(...restArgs) {
  return specificVideoNavigationController?.getSpecificVideoProbeState(...restArgs);
}
function getSpecificVideoUrlList(...restArgs) {
  return specificVideoNavigationController?.getSpecificVideoUrlList(...restArgs);
}
function hasSpecificVideoTargetInUrl(...restArgs) {
  return specificVideoNavigationController?.hasSpecificVideoTargetInUrl(...restArgs) || false;
}
function hasVideoMainCommented(...restArgs) {
  return specificVideoNavigationController?.hasVideoMainCommented(...restArgs) || false;
}
function initProcessedVideosFromTask(...restArgs) {
  return specificVideoNavigationController?.initProcessedVideosFromTask(...restArgs);
}
function initVideoMainCommentMemoryFromTask(...restArgs) {
  return specificVideoNavigationController?.initVideoMainCommentMemoryFromTask(...restArgs);
}
function isDouyinJingxuanContentLoading(...restArgs) {
  return specificVideoNavigationController?.isDouyinJingxuanContentLoading(...restArgs) || false;
}
function isDouyinSearchPageContentLoading(...restArgs) {
  return specificVideoNavigationController?.isDouyinSearchPageContentLoading(...restArgs) || false;
}
function isDouyinSpecificVideoUnavailable(...restArgs) {
  return specificVideoNavigationController?.isDouyinSpecificVideoUnavailable(...restArgs) || false;
}
function isDouyinVisibleLoadingPlaceholder(...restArgs) {
  return specificVideoNavigationController?.isDouyinVisibleLoadingPlaceholder(...restArgs) || false;
}
function isOnSpecificTargetVideo(...restArgs) {
  return specificVideoNavigationController?.isOnSpecificTargetVideo(...restArgs) || false;
}
function isSpecificVideoCompletedThisSession(...restArgs) {
  return specificVideoNavigationController?.isSpecificVideoCompletedThisSession(...restArgs) || false;
}
function isSpecificVideoDetailReady(...restArgs) {
  return specificVideoNavigationController?.isSpecificVideoDetailReady(...restArgs) || false;
}
function isVideoInSpecificList(...restArgs) {
  return specificVideoNavigationController?.isVideoInSpecificList(...restArgs) || false;
}
function loadSpecificVideoState(...restArgs) {
  return specificVideoNavigationController?.loadSpecificVideoState(...restArgs);
}
function markSpecificVideoCompletedThisSession(...restArgs) {
  return specificVideoNavigationController?.markSpecificVideoCompletedThisSession(...restArgs);
}
function markSpecificVideoHandled(...restArgs) {
  return specificVideoNavigationController?.markSpecificVideoHandled(...restArgs);
}
function markTaskRestartFromPayload(...restArgs) {
  return specificVideoNavigationController?.markTaskRestartFromPayload(...restArgs);
}
function normalizeSpecificVideoKey(...restArgs) {
  return specificVideoNavigationController?.normalizeSpecificVideoKey(...restArgs) || "";
}
function openSpecificVideoWithRetries(...restArgs) {
  return specificVideoNavigationController?.openSpecificVideoWithRetries(...restArgs);
}
function probeSpecificVideoOnDirectPage(...restArgs) {
  return specificVideoNavigationController?.probeSpecificVideoOnDirectPage(...restArgs);
}
function rememberVideoMainComment(...restArgs) {
  return specificVideoNavigationController?.rememberVideoMainComment(...restArgs);
}
function resolveDouyinVideoDetailModal(...restArgs) {
  return specificVideoNavigationController?.resolveDouyinVideoDetailModal(...restArgs);
}
function saveSpecificVideoState(...restArgs) {
  return specificVideoNavigationController?.saveSpecificVideoState(...restArgs);
}
function shouldBypassSpecificBrowseDedup(...restArgs) {
  return specificVideoNavigationController?.shouldBypassSpecificBrowseDedup(...restArgs) || false;
}
function shouldReprocessConfiguredSpecific(...restArgs) {
  return specificVideoNavigationController?.shouldReprocessConfiguredSpecific(...restArgs) || false;
}
function skipFailedSpecificVideoAndOpenNext(...restArgs) {
  return specificVideoNavigationController?.skipFailedSpecificVideoAndOpenNext(...restArgs);
}
function toSpecificVideoDirectUrl(...restArgs) {
  return specificVideoNavigationController?.toSpecificVideoDirectUrl(...restArgs) || "";
}
function toSpecificVideoJingxuanUrl(...restArgs) {
  return specificVideoNavigationController?.toSpecificVideoJingxuanUrl(...restArgs) || "";
}
function usesSpecificVideoPool(...restArgs) {
  return specificVideoNavigationController?.usesSpecificVideoPool(...restArgs) || false;
}
function waitSpecificVideoNavAppear(...restArgs) {
  return specificVideoNavigationController?.waitSpecificVideoNavAppear(...restArgs);
}
function normalizeUrl(arg1) {
  if (!arg1) {
    return "";
  }
  try {
    let result = arg1.trim();
    if (result.startsWith("//")) {
      result = "https:" + result;
    }
    const url = new URL(result);
    const local = url.searchParams.get("modal_id") || url.searchParams.get("vid") || url.searchParams.get("aweme_id");
    if (local && /^\d+$/.test(local)) {
      return "https://www.douyin.com/video/" + local;
    }
    const result2 = url.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (result2 && result2[1]) {
      return "https://www.douyin.com/video/" + result2[1];
    }
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch (error) {
    return arg1;
  }
}
let _processedVideoKeyModule;
function getProcessedVideoKeyModule() {
  if (_processedVideoKeyModule !== undefined) {
    return _processedVideoKeyModule;
  }
  try {
    _processedVideoKeyModule = require("./shared/processedVideoKey");
  } catch (error) {
    console.warn("[Built-in-Debug] processedVideoKey 加载失败，回退 normalizeUrl:", error.message);
    _processedVideoKeyModule = {
      extractDouyinVideoId: extractVideoIdFromHref,
      normalizeProcessedVideoKey: normalizeUrl,
      rememberProcessedVideoKey: (arg1, arg2) => {
        if (!arg1 || !arg2) {
          return;
        }
        arg1.add(arg2);
        const result = normalizeUrl(arg2);
        if (result && result !== arg2) {
          arg1.add(result);
        }
        const result2 = extractVideoIdFromHref(arg2);
        if (result2) {
          arg1.add("https://www.douyin.com/video/" + result2);
        }
      },
      hasProcessedVideoKey: (arg1, arg2) => {
        if (!arg1 || !arg2) {
          return false;
        }
        if (arg1.has(arg2) || arg1.has(normalizeUrl(arg2))) {
          return true;
        }
        const result = extractVideoIdFromHref(arg2);
        if (!result) {
          return false;
        }
        for (const item of arg1) {
          if (extractVideoIdFromHref(item) === result) {
            return true;
          }
        }
        return false;
      },
      forgetProcessedVideoKey: (arg1, arg2) => {
        if (!arg1 || !arg2) {
          return;
        }
        arg1.delete(arg2);
        const result = normalizeUrl(arg2);
        if (result) {
          arg1.delete(result);
        }
        const result2 = extractVideoIdFromHref(arg2);
        if (!result2) {
          return;
        }
        for (const item of [...arg1]) {
          if (extractVideoIdFromHref(item) === result2) {
            arg1.delete(item);
          }
        }
      },
      initProcessedVideoSet: arg1 => {
        const set = new Set();
        (arg1 || []).forEach(arg1 => {
          set.add(arg1);
          const result = normalizeUrl(arg1);
          if (result) {
            set.add(result);
          }
        });
        return set;
      }
    };
  }
  return _processedVideoKeyModule;
}
function isDouyinVideoShareUrl(arg1) {
  return /douyin\.com\/(video|note)\/\d+/.test(String(arg1 || ""));
}
function extractVideoIdFromHref(arg1) {
  if (!arg1) {
    return "";
  }
  try {
    const value = arg1.startsWith("http") ? arg1 : "https://www.douyin.com" + (arg1.startsWith("/") ? arg1 : "/" + arg1);
    const url = new URL(value);
    const local = url.searchParams.get("modal_id") || url.searchParams.get("vid") || url.searchParams.get("aweme_id");
    if (local && /^\d+$/.test(local)) {
      return local;
    }
    const result = url.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (result?.[1]) {
      return result[1];
    }
  } catch (error) {}
  const result = String(arg1).match(/(?:share\/)?(?:video|note|modal_id=|vid=|aweme_id=)(\d{15,})/);
  return result?.[1] || "";
}
function buildDouyinVideoShareUrl(arg1) {
  if (!arg1) {
    return "";
  }
  return "https://www.douyin.com/video/" + arg1;
}
function rememberPendingLeadVideoUrl(arg1) {
  const result = normalizeUrl(arg1);
  if (isDouyinVideoShareUrl(result)) {
    pendingLeadVideoUrl = result;
    pendingLeadVideoUrlAt = Date.now();
  }
}
function peekPendingLeadVideoUrl(num = 120000) {
  if (!pendingLeadVideoUrl || Date.now() - pendingLeadVideoUrlAt > num) {
    return "";
  }
  return pendingLeadVideoUrl;
}
function clearPendingLeadVideoUrl() {
  pendingLeadVideoUrl = "";
  pendingLeadVideoUrlAt = 0;
  clearLockedLeadVideoUrl();
}
function isDouyinNonVideoPageUrl(arg1) {
  const result = String(arg1 || "");
  if (isDouyinVideoShareUrl(result)) {
    return false;
  }
  return /douyin\.com\/search\//.test(result) || /^https?:\/\/(www\.)?douyin\.com\/?(\?|$)/.test(result) || result.startsWith("feed:");
}
function resolveLeadVideoUrl(text = "", arg2 = document) {
  const result = peekPendingLeadVideoUrl();
  if (result) {
    return result;
  }
  if (isDouyinVideoShareUrl(lockedLeadVideoUrl)) {
    return lockedLeadVideoUrl;
  }
  const result2 = normalizeUrl(text);
  if (isDouyinVideoShareUrl(result2)) {
    return result2;
  }
  const result3 = normalizeUrl(window.location.href);
  if (isDouyinVideoShareUrl(result3)) {
    return result3;
  }
  const result4 = extractVideoIdFromHref(window.location.href);
  if (result4) {
    return buildDouyinVideoShareUrl(result4);
  }
  const result5 = document.querySelector("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"SearchDetail\"]");
  const list = [];
  if (arg2 && arg2.querySelectorAll) {
    list.push(arg2);
  }
  if (result5 && !list.includes(result5)) {
    list.push(result5);
  }
  const result6 = document.querySelector("[data-e2e=\"video-player-container\"], [data-e2e=\"feed-active-video\"]");
  if (result6 && !list.includes(result6)) {
    list.push(result6);
  }
  if (!list.includes(document.body)) {
    list.push(document.body);
  }
  for (const item of list) {
    const result = item.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]");
    for (const item of result) {
      const local = item.href || item.getAttribute("href") || "";
      const result = extractVideoIdFromHref(local);
      if (result) {
        return buildDouyinVideoShareUrl(result);
      }
    }
  }
  try {
    const value = arg2?.getAttribute?.("data-e2e") === "feed-active-video" ? arg2 : arg2?.querySelector?.("[data-e2e=\"feed-active-video\"]");
    const list = [];
    if (value) {
      list.push(value);
    } else if (arg2?.querySelectorAll) {
      list.push(arg2);
    }
    if (!value && result6) {
      list.push(result6);
    }
    if (!list.length) {
      list.push(document.body);
    }
    for (const item of list) {
      const result = Array.from(item.querySelectorAll?.("video") || []).filter(arg1 => isVisibleElement(arg1)).sort((arg1, arg2) => {
        const result = arg1.getBoundingClientRect();
        const result2 = arg2.getBoundingClientRect();
        return result2.width * result2.height - result.width * result.height;
      });
      for (const item of result) {
        const local = item.currentSrc || item.src || item.getAttribute("src") || "";
        const local2 = local.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || local.match(/\/(\d{19})\//) || local.match(/(\d{19})/);
        if (local2?.[1]) {
          return buildDouyinVideoShareUrl(local2[1]);
        }
      }
    }
  } catch (error) {}
  return "";
}
function resolveCurrentVisibleVideoUrl(text = "", arg2 = document) {
  const result = normalizeUrl(text);
  if (isDouyinVideoShareUrl(result)) {
    return result;
  }
  const result2 = normalizeUrl(window.location.href);
  if (isDouyinVideoShareUrl(result2)) {
    return result2;
  }
  const result3 = extractVideoIdFromHref(window.location.href);
  if (result3) {
    return buildDouyinVideoShareUrl(result3);
  }
  const result4 = document.querySelector("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"SearchDetail\"]");
  const list = [];
  if (arg2 && arg2.querySelectorAll) {
    list.push(arg2);
  }
  if (result4 && !list.includes(result4)) {
    list.push(result4);
  }
  const result5 = document.querySelector("[data-e2e=\"video-player-container\"], [data-e2e=\"feed-active-video\"]");
  if (result5 && !list.includes(result5)) {
    list.push(result5);
  }
  for (const item of list) {
    const local = item.querySelectorAll?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]") || [];
    for (const item of local) {
      const result = extractVideoIdFromHref(item.href || item.getAttribute("href") || "");
      if (result) {
        return buildDouyinVideoShareUrl(result);
      }
    }
  }
  try {
    for (const item of list.length ? list : [document.body]) {
      const result = Array.from(item.querySelectorAll?.("video") || []).filter(arg1 => isVisibleElement(arg1)).sort((arg1, arg2) => {
        const result = arg1.getBoundingClientRect();
        const result2 = arg2.getBoundingClientRect();
        return result2.width * result2.height - result.width * result.height;
      });
      for (const item of result) {
        const local = item.currentSrc || item.src || item.getAttribute("src") || "";
        const local2 = local.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || local.match(/\/(\d{19})\//) || local.match(/(\d{19})/);
        if (local2?.[1]) {
          return buildDouyinVideoShareUrl(local2[1]);
        }
      }
    }
  } catch (error) {}
  return "";
}
async function waitForVideoDetailReadyAndPause(arg1, text = "", num = 8000) {
  const result = normalizeUrl(text);
  const local = extractSpecificVideoId(result) || extractVideoIdFromHref(result);
  const result2 = Date.now();
  const local2 = num;
  let local3 = local2;
  let flag = false;
  let flag2 = false;
  let flag3 = false;
  while (Date.now() - result2 < local3) {
    if (shouldAbort(arg1)) {
      throw new Error("TASK_ABORTED");
    }
    const result3 = String(window.location.href || "");
    const local4 = result3.includes("/search/") && !result3.includes("modal_id=") && !result3.includes("/video/") && !result3.includes("/note/");
    const result4 = resolveDouyinVideoDetailModal({
      includeFeed: false
    });
    const local5 = !!result4 && !!isVisibleElement(result4);
    const local6 = local4 && !local5;
    const flag4 = isViewingDouyinVideoPage(result3);
    const value = local5 ? result4 : getDouyinFeedScope() || document;
    const value2 = local5 || flag4 ? resolveCurrentVisibleVideoUrl(normalizeUrl(result3), value) : "";
    const local7 = extractSpecificVideoId(value2) || extractVideoIdFromHref(value2) || extractSpecificVideoId(result3) || extractVideoIdFromHref(result3);
    const result5 = Array.from(value.querySelectorAll?.("video, img, canvas") || []).some(isVisibleElement);
    const value3 = getVideoTitle() !== "未知视频";
    const result6 = Array.from(document.querySelectorAll("video")).some(arg1 => {
      try {
        return isVisibleElement(arg1) && !arg1.paused && !arg1.ended;
      } catch (error) {
        return false;
      }
    });
    const local8 = !local || !!local7 && String(local7) === String(local);
    if (local5 || flag4 || result5 || result6 || value3) {
      flag2 = true;
    }
    if (!flag) {
      pauseVisibleDouyinVideos(value, "进入视频后立即暂停");
      flag = true;
    } else {
      pauseVisibleDouyinVideos(value);
    }
    if (local6) {
      await sleep(200);
      continue;
    }
    const result7 = result3.includes("/search/");
    if (result7 && !local5) {
      await sleep(200);
      continue;
    }
    if (local && !local7) {
      await sleep(200);
      continue;
    }
    if ((local5 && (result5 || value3 || value2) || !result7 && flag4) && local8) {
      pauseVisibleDouyinVideos(value, "视频详情已出现，防止等待期间自动连播");
      if (result && isDouyinVideoShareUrl(result) && value2 && value2 !== result) {
        console.warn("[Built-in-Debug] [视频防跳] 打开后检测到当前视频与点击目标不同: target=" + result + ", current=" + value2);
      }
      return true;
    }
    if (!flag3 && flag2 && Date.now() - result2 >= local2 - 250) {
      local3 = getExtendedReadyBudgetMs(local2, {
        progress: true,
        hardCapMs: Math.min(Math.round(local2 * 2.5), 20000)
      });
      if (local3 > local2) {
        flag3 = true;
        console.log("[Built-in-Debug] [慢环境] 视频详情仍在加载，延长等待 " + local2 + "→" + local3 + "ms");
        try {
          reportCurrentAction("页面加载较慢，继续等待视频就绪…");
        } catch (error) {}
      }
    }
    await sleep(200);
  }
  console.warn("[Built-in-Debug] [视频防跳] 等待视频详情就绪超时 (" + local3 + "ms)");
  return false;
}
function cleanTitle(arg1) {
  if (!arg1) {
    return "未知视频";
  }
  return arg1.replace(" - 抖音", "").replace("发现更多精彩视频搜索", "").replace("抖音 - 记录美好生活", "").trim() || "未知视频";
}
function isWithinTimeLimit(arg1, arg2) {
  if (!arg2 || arg2 === "all") {
    return true;
  }
  const value = typeof getCommentTimeModule === "function" ? getCommentTimeModule() : null;
  if (value?.isCommentWithinTimeFilter) {
    return value.isCommentWithinTimeFilter(arg1, arg2);
  }
  const obj = {
    "5m": 5,
    "1h": 60,
    "1d": 1440,
    "3d": 4320,
    "1w": 10080,
    "1mo": 43200,
    "1y": 525600
  };
  const local = obj[String(arg2)] || 0;
  if (local <= 0) {
    return true;
  }
  const local2 = value?.parseCommentAgeMinutes?.(arg1);
  if (local2 == null || !Number.isFinite(local2)) {
    return false;
  }
  return local2 < local;
}
function reportEmojiDebug(arg1) {
  const result = String(arg1 || "").trim();
  if (result) {
    console.log("[评论表情包] " + result);
  }
}
function briefEl(arg1) {
  if (!arg1) {
    return "null";
  }
  const result = arg1.getBoundingClientRect();
  const value = arg1.className;
  const local = String(typeof value === "string" ? value : value?.baseVal || "").split(/\s+/).filter(Boolean)[0] || "";
  const result2 = (arg1.textContent || "").trim().slice(0, 8);
  return "" + arg1.tagName + (local ? "." + local : "") + (result2 ? "(\"" + result2 + "\")" : "") + " @(" + Math.round(result.left) + "," + Math.round(result.top) + ")";
}
function describeDomControl(arg1) {
  if (!arg1) {
    return "无";
  }
  let obj = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  try {
    obj = arg1.getBoundingClientRect();
  } catch (error) {}
  const local = arg1.getAttribute?.("data-e2e") || "";
  const result = String(arg1.getAttribute?.("aria-label") || arg1.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().slice(0, 12);
  const value = arg1.className;
  const local2 = String(typeof value === "string" ? value : value?.baseVal || "").split(/\s+/).filter(Boolean)[0] || "";
  const result2 = String(arg1.textContent || "").replace(/\s+/g, " ").trim().slice(0, 10);
  const value2 = arg1.isConnected !== false;
  return "" + arg1.tagName + (local ? "[e2e=" + local + "]" : "") + (local2 ? "." + local2 : "") + (result ? "{" + result + "}" : "") + (result2 ? "(\"" + result2 + "\")" : "") + (" " + Math.round(obj.width) + "x" + Math.round(obj.height) + "@(" + Math.round(obj.left) + "," + Math.round(obj.top) + ")") + ("" + (value2 ? "" : " 已卸载"));
}
function briefPanel(arg1) {
  if (!arg1) {
    return "无";
  }
  const result = arg1.getBoundingClientRect();
  const result2 = String(arg1.className || "").split(/\s+/).slice(0, 2).join(".");
  const result3 = getCommentV2String("emojiStickerItems");
  let num = 0;
  if (result3) {
    try {
      num = arg1.querySelectorAll(result3).length;
    } catch (error) {
      num = 0;
    }
  }
  return arg1.tagName + "." + result2 + " " + Math.round(result.width) + "x" + Math.round(result.height) + " 贴纸=" + num;
}
function compileCommentV2Regex(arg1) {
  const result = getCommentV2String(arg1);
  if (!result) {
    return null;
  }
  try {
    return new RegExp(result, "i");
  } catch (error) {
    return null;
  }
}
function elementsNearlyOverlap(arg1, arg2, num = 8) {
  if (!arg1 || !arg2) {
    return false;
  }
  const result = arg1.getBoundingClientRect();
  const result2 = arg2.getBoundingClientRect();
  const result3 = Math.abs((result.left + result.right) / 2 - (result2.left + result2.right) / 2);
  const result4 = Math.abs((result.top + result.bottom) / 2 - (result2.top + result2.bottom) / 2);
  return result3 < num && result4 < num;
}
function isEmojiTriggerCandidate(arg1, arg2) {
  if (!arg1) {
    return true;
  }
  if (arg2 && (arg1 === arg2 || arg2.contains(arg1) || arg1.contains(arg2))) {
    return true;
  }
  if (arg2 && elementsNearlyOverlap(arg1, arg2)) {
    return true;
  }
  return false;
}
function isCommentAreaElement(arg1) {
  if (!arg1?.closest) {
    return false;
  }
  const result = [getCommentV2String("commentPanel"), getCommentV2String("commentItem"), getCommentV2String("commentItemLoose"), getCommentV2String("replyItem")].filter(Boolean).join(", ");
  if (!result) {
    return false;
  }
  try {
    return !!arg1.closest(result);
  } catch (error) {
    return false;
  }
}
function isCommentStatsTabContainer(arg1) {
  if (!arg1) {
    return true;
  }
  const result = (arg1.textContent || "").trim();
  const result2 = getCommentV2String("emojiPanelRejectSelector");
  if (result2) {
    try {
      if (arg1.matches?.(result2) || arg1.querySelector?.(result2)) {
        return true;
      }
    } catch (error) {}
  }
  const result3 = compileCommentV2Regex("emojiTabRejectPattern");
  const result4 = compileCommentV2Regex("emojiTabPositivePattern");
  if (result3?.test(result) && !result4?.test(result)) {
    return true;
  }
  return false;
}
function panelMatchesRemoteSelector(arg1) {
  const value = typeof getCommentV2String === "function" ? getCommentV2String("emojiPanel") : "";
  if (!arg1 || !value) {
    return false;
  }
  try {
    return arg1.matches(value);
  } catch (error) {
    return false;
  }
}
function isValidEmojiPickerPanel(arg1, arg2) {
  if (!arg1 || !isVisibleElement(arg1) || isCommentAreaElement(arg1)) {
    return false;
  }
  if (arg2 && arg1.contains(arg2)) {
    return false;
  }
  return panelMatchesRemoteSelector(arg1);
}
function snapshotComposerEmojiState(arg1, arg2 = null) {
  const result = getComposerEmojiSearchRoots(arg1, arg2);
  const result2 = getCommentV2String("emojiComposerPayload");
  const result3 = getCommentV2String("emojiTextTokenPattern");
  const result4 = getCommentV2String("emojiPanel");
  const set = new Set();
  const set2 = new Set();
  let num = 0;
  if (!result2 || !result3) {
    return {
      payloadCount: 0,
      textTokenCount: 0
    };
  }
  const local = arg1 => {
    if (!arg1 || !result4) {
      return false;
    }
    try {
      return !!arg1.closest?.(result4);
    } catch (error) {
      return false;
    }
  };
  for (const item of result) {
    if (!item || item.isConnected === false) {
      continue;
    }
    try {
      if (item.matches?.(result2) && !local(item)) {
        set.add(item);
      }
      item.querySelectorAll(result2).forEach(arg1 => {
        if (!local(arg1)) {
          set.add(arg1);
        }
      });
      if (item.matches?.("[contenteditable=\"true\"]") && !local(item)) {
        set2.add(item);
      }
      item.querySelectorAll?.("[contenteditable=\"true\"]").forEach(arg1 => {
        if (!local(arg1)) {
          set2.add(arg1);
        }
      });
    } catch (error) {
      return {
        payloadCount: 0,
        textTokenCount: 0
      };
    }
  }
  for (const item of set2) {
    try {
      const result = String(item.innerText || item.textContent || "");
      const local = result.match(new RegExp(result3, "g")) || [];
      num = Math.max(num, local.length);
    } catch (error) {
      return {
        payloadCount: 0,
        textTokenCount: 0
      };
    }
  }
  return {
    payloadCount: set.size,
    textTokenCount: num
  };
}
function getComposerEmojiSearchRoots(arg1, arg2 = null) {
  const list = [];
  const local = arg1 => {
    if (arg1 && !list.includes(arg1)) {
      list.push(arg1);
    }
  };
  local(arg1);
  for (const item of ["draftEditor", "commentInputShell", "commentInputShellLoose"]) {
    const result = getCommentV2String(item);
    if (!result) {
      continue;
    }
    try {
      local(arg1?.closest?.(result));
    } catch (error) {}
  }
  local(getCommentComposerRoot(arg1));
  if (arg2?.roots?.length) {
    arg2.roots.forEach(local);
  }
  let local2 = arg1;
  for (let num = 0; num < 8 && local2 && local2 !== document.body; num++) {
    local(local2);
    local2 = local2.parentElement;
  }
  return list;
}
function scoreEmojiTabContainer(arg1, arg2, arg3) {
  if (!arg1 || !isVisibleElement(arg1)) {
    return -999;
  }
  if (arg3 && arg1 === arg3) {
    return -999;
  }
  if (isCommentAreaElement(arg1) || isCommentStatsTabContainer(arg1)) {
    return -999;
  }
  const result = arg1.getBoundingClientRect();
  const local = arg2?.getBoundingClientRect?.();
  const local2 = arg3?.getBoundingClientRect?.();
  const result2 = (arg1.textContent || "").trim();
  const result3 = compileCommentV2Regex("emojiTabPositivePattern");
  const result4 = compileCommentV2Regex("emojiTabRejectPattern");
  if (!result3 || !result4) {
    return -999;
  }
  const result5 = result3.test(result2);
  const result6 = Array.from(arg1.children).filter(arg1 => isVisibleElement(arg1) && !isEmojiTriggerCandidate(arg1, arg3));
  const result7 = result6.filter(arg1 => arg1.querySelector("svg"));
  const result8 = result6.filter(arg1 => {
    const result = String(arg1.getAttribute?.("role") || "").toLowerCase();
    return arg1.tagName === "BUTTON" || result === "tab" || result === "button" || arg1.getAttribute?.("aria-selected") != null;
  });
  const value = String(arg1.getAttribute?.("role") || "").toLowerCase() === "tablist";
  if (arg3 && arg1.contains(arg3) && result7.length < 2 && result8.length < 2) {
    return -999;
  }
  if (result6.length < 2 || result6.length > 8) {
    return -999;
  }
  if (result7.length < 2 && result8.length < 2 && !value) {
    return -999;
  }
  if (result2.length > 40) {
    return -999;
  }
  if (result6.some(arg1 => (arg1.textContent || "").trim().length > 12)) {
    return -999;
  }
  if (result4.test(result2) && !result5 && result2.length > 6) {
    return -999;
  }
  let num = 0;
  num += result7.length >= 4 ? 30 : result7.length >= 3 ? 25 : result7.length >= 2 ? 15 : 0;
  num += result8.length >= 2 ? 25 : 0;
  num += value ? 20 : 0;
  num += result6.length === 4 ? 12 : result6.length === 3 ? 8 : 0;
  num += result6.every(arg1 => arg1.tagName === "SPAN" || arg1.tagName === "BUTTON" || arg1.querySelector("svg") || ["tab", "button"].includes(String(arg1.getAttribute?.("role") || "").toLowerCase())) ? 10 : 0;
  if (result5) {
    num += 20;
  }
  if (local) {
    const value = Math.min(result.right, local.right) - Math.max(result.left, local.left);
    const value2 = Math.min(result.bottom, local.bottom) - Math.max(result.top, local.top);
    if (value > 0 && value2 > 0) {
      num += 30;
    }
    if (Math.abs(result.top - local.top) < 50) {
      num += 12;
    }
  }
  if (local2) {
    const result2 = Math.abs((result.left + result.right) / 2 - (local2.left + local2.right) / 2);
    if (result2 < 80) {
      num += 20;
    } else if (result2 < 140) {
      num += 5;
    }
    if (Math.abs(result.top - local2.top) < 35) {
      num += 10;
    }
  }
  return num;
}
function findBestEmojiTabContainer(arg1, arg2, arg3) {
  let local = null;
  let value = -999;
  const set = new Set();
  const result = getCommentV2String("emojiTabContainerCandidates");
  if (!result) {
    return null;
  }
  for (const item of arg3) {
    if (!item) {
      continue;
    }
    let list = [];
    try {
      list = item.querySelectorAll(result);
    } catch (error) {
      return null;
    }
    for (const item of list) {
      if (set.has(item)) {
        continue;
      }
      set.add(item);
      const result = scoreEmojiTabContainer(item, arg1, arg2);
      if (result > value) {
        value = result;
        local = item;
      }
    }
  }
  if (value > 0) {
    return local;
  } else {
    return null;
  }
}
function describeEmojiViewport() {
  const value = window.visualViewport;
  return "视口 " + (window.innerWidth || 0) + "x" + (window.innerHeight || 0) + (" visual=" + Math.round(Number(value?.width) || 0) + "x" + Math.round(Number(value?.height) || 0));
}
function summarizeEmojiTabDebug(arg1, arg2, options = {}) {
  const value = typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : [];
  const local = options.tabs || [];
  const result = local.slice(0, 8).map((arg1, arg2) => {
    const result = String((arg1?.textContent || "").trim() || arg1?.getAttribute?.("aria-label") || "").slice(0, 8);
    let obj = {
      width: 0,
      height: 0
    };
    try {
      obj = arg1.getBoundingClientRect();
    } catch (error) {}
    return "#" + arg2 + (result ? "\"" + result + "\"" : "无文案") + Math.round(obj.width) + "x" + Math.round(obj.height);
  }).join(",");
  return describeEmojiViewport() + " 面板=" + briefPanel(arg1) + " tab栏=" + briefEl(options.tabContainer) + (" tabs=" + local.length + (result ? "[" + result + "]" : "")) + (" 收藏文案提示=[" + (value || []).join("|") + "]（仅诊断，不按下标点击）") + (" fav=" + briefEl(options.favTab) + " 入口=" + briefEl(arg2));
}
function findFavTabByExactText(arg1, arg2) {
  if (!arg1) {
    return null;
  }
  const result = (typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : []).map(arg1 => String(arg1 || "").replace(/\s+/g, "").trim()).filter(Boolean);
  if (!result.length) {
    return null;
  }
  const result2 = getCommentV2String("emojiTabTextCandidates");
  if (!result2) {
    return null;
  }
  const list = [];
  let list2 = [];
  try {
    list2 = arg1.querySelectorAll(result2);
  } catch (error) {
    return null;
  }
  for (const item of list2) {
    if (!isVisibleElement(item) || isEmojiTriggerCandidate(item, arg2)) {
      continue;
    }
    const result2 = String((item.textContent || "").trim() || item.getAttribute?.("aria-label") || item.getAttribute?.("title") || "").replace(/\s+/g, "").trim();
    if (!result2 || result2.length > 8) {
      continue;
    }
    if (!result.includes(result2)) {
      continue;
    }
    list.push(item);
  }
  if (!list.length) {
    return null;
  }
  list.sort((arg1, arg2) => {
    const result = arg1.getBoundingClientRect();
    const result2 = arg2.getBoundingClientRect();
    return result.width * result.height - result2.width * result2.height;
  });
  return list[0];
}
function dumpEmojiPanelTabCandidates(arg1, arg2, options = {}) {
  if (!arg1) {
    return;
  }
  const result = arg1.getBoundingClientRect();
  const local = arg2?.getBoundingClientRect?.();
  reportEmojiDebug("--- Tab候选 " + describeEmojiViewport() + " " + briefPanel(arg1) + " emojiBtn=" + briefEl(arg2) + " ---");
  const list = [];
  const set = new Set();
  const result2 = getCommentV2String("emojiTabDebugCandidates");
  if (!result2) {
    return;
  }
  let list2 = [];
  try {
    list2 = arg1.querySelectorAll(result2);
  } catch (error) {
    return;
  }
  for (const item of list2) {
    if (set.has(item) || !isVisibleElement(item)) {
      continue;
    }
    set.add(item);
    const result2 = item.getBoundingClientRect();
    if (result2.height < 14 || result2.height > 80) {
      continue;
    }
    if (result2.top < result.top - 10 || result2.bottom > result.bottom + 10) {
      continue;
    }
    const result3 = Array.from(item.children).filter(isVisibleElement);
    if (result3.length < 2 || result3.length > 8) {
      continue;
    }
    const value = result3.filter(arg1 => arg1.querySelector("svg")).length;
    const result4 = (item.textContent || "").trim().slice(0, 24);
    const result5 = scoreEmojiTabContainer(item, arg1, arg2);
    list.push({
      el: item,
      svgCount: value,
      childCount: result3.length,
      text: result4,
      score: result5,
      rect: result2
    });
  }
  list.sort((arg1, arg2) => arg2.score - arg1.score || arg1.rect.top - arg2.rect.top);
  list.slice(0, 10).forEach((arg1, arg2) => {
    const result = Array.from(arg1.el.children).slice(0, 6).map((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const flag = !!arg1.querySelector("svg");
      const result2 = (arg1.textContent || "").trim().slice(0, 6);
      return "[" + arg2 + "]" + arg1.tagName + (flag ? "+svg" : "") + (result2 ? "(\"" + result2 + "\")" : "") + "@(" + Math.round(result.left) + "," + Math.round(result.top) + ")";
    }).join(" ");
    reportEmojiDebug("  #" + (arg2 + 1) + " score=" + arg1.score + " " + briefEl(arg1.el) + " svg=" + arg1.svgCount + "子=" + arg1.childCount + " \"" + arg1.text + "\" | " + result);
  });
  if (local) {
    reportEmojiDebug("  emojiBtn中心=(" + Math.round(local.left + local.width / 2) + "," + Math.round(local.top + local.height / 2) + ") 面板=(" + Math.round(result.left) + "," + Math.round(result.top) + "-" + Math.round(result.right) + "," + Math.round(result.bottom) + ")");
  }
  const result3 = summarizeEmojiTabDebug(arg1, arg2, resolveDouyinEmojiTabs(arg1, arg2));
  reportEmojiDebug(result3);
  if (options.traceToRunLog) {
    const value = typeof clipTraceText === "function" ? clipTraceText(result3, 220) : result3.slice(0, 220);
    reportTraceLog("📎 调试：" + value, null, "warning");
  }
}
function findDouyinEmojiTabContainer(arg1, arg2) {
  if (!arg1) {
    return null;
  }
  return findBestEmojiTabContainer(arg1, arg2, [arg1]);
}
function resolveDouyinEmojiTabs(arg1, arg2) {
  const result = findDouyinEmojiTabContainer(arg1, arg2);
  const value = result ? Array.from(result.children) : [];
  const result2 = value.filter(arg1 => isVisibleElement(arg1) && !isEmojiTriggerCandidate(arg1, arg2));
  const result3 = compileCommentV2Regex("emojiTabRejectPattern");
  if (!result3) {
    return {
      favTab: null,
      tabContainer: result,
      tabs: value
    };
  }
  const local = arg1 => {
    const result = arg1.filter(arg1 => !isEmojiTriggerCandidate(arg1, arg2));
    const value = typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : [];
    const local = arg1 => String((arg1?.textContent || "").trim() || arg1?.getAttribute?.("aria-label") || arg1?.getAttribute?.("title") || "").replace(/\s+/g, "").trim();
    const value2 = value.length ? result.find(arg1 => {
      const result = local(arg1);
      if (!result || result.length > 8) {
        return false;
      }
      if (result3.test(result)) {
        return false;
      }
      return value.some(arg1 => result === String(arg1 || "").replace(/\s+/g, ""));
    }) : null;
    if (value2) {
      return value2;
    }
    return null;
  };
  let result4 = local(result2);
  if (!result4 && value.length >= 3) {
    result4 = local(value.filter(arg1 => !isEmojiTriggerCandidate(arg1, arg2)));
  }
  if (!result4) {
    result4 = findFavTabByExactText(result, arg2) || findFavTabByExactText(arg1, arg2);
  }
  return {
    favTab: result4,
    tabContainer: result,
    tabs: value
  };
}
async function reopenEmojiPanelIfNeeded(arg1, arg2, arg3) {
  let result = findDouyinEmojiPanel(arg1);
  if (result && isVisibleElement(result)) {
    return result;
  }
  const result2 = findEmojiTriggerBtn(arg1, arg3);
  if (!result2) {
    return null;
  }
  reportEmojiDebug("面板已关闭，重新打开");
  await simulateTrustedElementClick(result2, arg2, "打开评论表情面板", {
    allowScrollIntoView: false
  });
  for (let num = 0; num < 8; num++) {
    await sleep(280);
    result = findDouyinEmojiPanel(arg1);
    if (result && isVisibleElement(result)) {
      return result;
    }
  }
  return null;
}
let commentImageRotateIndex = 0;
let videoCommentImageRotateIndex = 0;
let commentExpressionRotateIndex = 0;
let videoCommentExpressionRotateIndex = 0;
try {
  const {
    createCommentAutomationController
  } = require("./shared/commentAutomationController");
  const commentAutomationRuntimeState = {};
  Object.defineProperties(commentAutomationRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    commentExpressionRotateIndex: {
      enumerable: true,
      get: () => commentExpressionRotateIndex,
      set: arg1 => {
        commentExpressionRotateIndex = arg1;
      }
    },
    commentFailureStoppedTaskId: {
      enumerable: true,
      get: () => commentFailureStoppedTaskId,
      set: arg1 => {
        commentFailureStoppedTaskId = arg1;
      }
    },
    commentImageRotateIndex: {
      enumerable: true,
      get: () => commentImageRotateIndex,
      set: arg1 => {
        commentImageRotateIndex = arg1;
      }
    },
    currentActionMentionRolled: {
      enumerable: true,
      get: () => currentActionMentionRolled,
      set: arg1 => {
        currentActionMentionRolled = arg1;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: arg1 => {
        currentViewKey = arg1;
      }
    },
    lastNativeClickBackgroundHosted: {
      enumerable: true,
      get: () => lastNativeClickBackgroundHosted,
      set: arg1 => {
        lastNativeClickBackgroundHosted = arg1;
      }
    },
    lastProfileVideoDetailDiagnostic: {
      enumerable: true,
      get: () => lastProfileVideoDetailDiagnostic,
      set: arg1 => {
        lastProfileVideoDetailDiagnostic = arg1;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: arg1 => {
        lastTrustedClickDiagnostic = arg1;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: arg1 => {
        lockedFeedIdentity = arg1;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: arg1 => {
        lockedLeadVideoUrl = arg1;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: arg1 => {
        pausedForSubview = arg1;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: arg1 => {
        sessionDmCount = arg1;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: arg1 => {
        sessionDmLimit = arg1;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: arg1 => {
        sessionFollowCount = arg1;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: arg1 => {
        sessionFollowLimit = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    },
    videoCommentExpressionRotateIndex: {
      enumerable: true,
      get: () => videoCommentExpressionRotateIndex,
      set: arg1 => {
        videoCommentExpressionRotateIndex = arg1;
      }
    },
    videoCommentImageRotateIndex: {
      enumerable: true,
      get: () => videoCommentImageRotateIndex,
      set: arg1 => {
        videoCommentImageRotateIndex = arg1;
      }
    }
  });
  commentAutomationController = createCommentAutomationController({
    ClipboardEvent: ClipboardEvent,
    Infinity: Infinity,
    InputEvent: InputEvent,
    KeyboardEvent: KeyboardEvent,
    MouseEvent: MouseEvent,
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    PointerEvent: PointerEvent,
    Uint8Array: Uint8Array,
    _migrateTouchCountsFromLegacy: _migrateTouchCountsFromLegacy,
    _normalizeTouchLogEntries: _normalizeTouchLogEntries,
    _syncTouchCountsFromLog: _syncTouchCountsFromLog,
    allowEmptyCommentText: allowEmptyCommentText,
    appendCommentMentionsAfterAttachments: appendCommentMentionsAfterAttachments,
    appendRandomEmojiSuffix: appendRandomEmojiSuffix,
    applyEntryMetaToLead: applyEntryMetaToLead,
    applyFollowUpActions: applyFollowUpActions,
    applyRiskyEmojiReplaceForComment: applyRiskyEmojiReplaceForComment,
    atob: atob,
    awaitInteractionCooldown: awaitInteractionCooldown,
    awaitPostActionRest: awaitPostActionRest,
    briefEl: briefEl,
    describeDomControl: describeDomControl,
    briefPanel: briefPanel,
    buildAutomationAiPayload: buildAutomationAiPayload,
    buildBlacklistEntry: buildBlacklistEntry,
    buildLeadCommentFingerprint: buildLeadCommentFingerprint,
    buildLeadIdFromLead: buildLeadIdFromLead,
    buildMainCommentAbortResult: buildMainCommentAbortResult,
    buildNodeCommentFingerprint: buildNodeCommentFingerprint,
    buildTaskFinishedPayload: buildTaskFinishedPayload,
    burstPauseWithinOneSecond: burstPauseWithinOneSecond,
    classifyCommentFailureToastLocal: classifyCommentFailureToastLocal,
    cleanTitle: cleanTitle,
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    collectDouyinCommentEmojiHints: collectDouyinCommentEmojiHints,
    commentDraftHasCoreTextLocal: commentDraftHasCoreTextLocal,
    commentNodeViewportBonus: commentNodeViewportBonus,
    composeCommentInputWithMentions: composeCommentInputWithMentions,
    describeCommentLikeState: describeCommentLikeState,
    describeMainCommentInputEnvironment: describeMainCommentInputEnvironment,
    describeTaskAbortReason: describeTaskAbortReason,
    dumpEmojiPanelTabCandidates: dumpEmojiPanelTabCandidates,
    emitLeadInteractionUpdate: emitLeadInteractionUpdate,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    evaluateLeadLocationFilter: evaluateLeadLocationFilter,
    extractDouyinCommentContent: extractDouyinCommentContent,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserIdFromUrl: extractUserIdFromUrl,
    extractUserKeyFromUrl: extractUserKeyFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentScrollContainer: findCommentScrollContainer,
    focusCurrentAutomationViewForComment: focusCurrentAutomationViewForComment,
    focusWithoutScroll: focusWithoutScroll,
    formatTaskLocationFilterSummary: formatTaskLocationFilterSummary,
    getApplySearchFiltersModule: getApplySearchFiltersModule,
    getBoundSubviewInteractionId: getBoundSubviewInteractionId,
    getCommentPlaceholderText: getCommentPlaceholderText,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getCommentV2List: getCommentV2List,
    getCommentV2Number: getCommentV2Number,
    getVideoEngagePack: getVideoEngagePack,
    getCommentsTotalCount: getCommentsTotalCount,
    getCurrentContentPauseProfile: getCurrentContentPauseProfile,
    getDouyinFeedScope: getDouyinFeedScope,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    getDouyinVideoAuthorApi: getDouyinVideoAuthorApi,
    getExtendedReadyRounds: getExtendedReadyRounds,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getLeadAliasKeys: getLeadAliasKeys,
    getLeadPrimaryKey: getLeadPrimaryKey,
    getLocationFilterModule: getLocationFilterModule,
    getMyNickname: getMyNickname,
    getSearchApiReadyTracker: getSearchApiReadyTracker,
    getSearchFilterSessionModule: getSearchFilterSessionModule,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    getVideoStats: getVideoStats,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasCommentLikeTakenEffect: hasCommentLikeTakenEffect,
    hasCommentRuntimeReady: hasCommentRuntimeReady,
    hasLocalReplyTemplates: hasLocalReplyTemplates,
    hasVideoCommentTemplates: hasVideoCommentTemplates,
    hasVideoMainCommented: hasVideoMainCommented,
    incrementInteractionCount: incrementInteractionCount,
    insertTextIntoEditable: insertTextIntoEditable,
    installEntityFeedSwipeLock: installEntityFeedSwipeLock,
    ipcRenderer: ipcRenderer,
    isAiInvokeCancelled: isAiInvokeCancelled,
    isCommentAreaElement: isCommentAreaElement,
    isCommentDraftOnlyEmojiDriftLocal: isCommentDraftOnlyEmojiDriftLocal,
    isCommentFromVideoAuthor: isCommentFromVideoAuthor,
    isDouyinVideoShareUrl: isDouyinVideoShareUrl,
    isElementInViewport: isElementInViewport,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isEmojiTriggerCandidate: isEmojiTriggerCandidate,
    isEntityLeadgenActive: isEntityLeadgenActive,
    isFatalAiAuthError: isFatalAiAuthError,
    isInteractionLimitReached: isInteractionLimitReached,
    isLeadInKnownPool: isLeadInKnownPool,
    isLeadInSession: isLeadInSession,
    isLinkOnlyScrapeTask: isLinkOnlyScrapeTask,
    isMainCommentPlaceholderCandidate: isMainCommentPlaceholderCandidate,
    isProfileCommentUiVisible: isProfileCommentUiVisible,
    isReplyBtnText: isReplyBtnText,
    isSameVideoTitleLoose: isSameVideoTitleLoose,
    isSubviewInteractionCancelled: isSubviewInteractionCancelled,
    isValidEmojiPickerPanel: isValidEmojiPickerPanel,
    isVideoLocalQuotaExhaustedReason: isVideoLocalQuotaExhaustedReason,
    isVisibleElement: isVisibleElement,
    isWithinTimeLimit: isWithinTimeLimit,
    localStorage: localStorage,
    lockFeedLeadVideoUrl: lockFeedLeadVideoUrl,
    lookupLeadgenScrapeAweme: lookupLeadgenScrapeAweme,
    markLeadInSession: markLeadInSession,
    queryKnownLeadKeys: queryKnownLeadKeys,
    matchExcludedCommentKeyword: matchExcludedCommentKeyword,
    matchesPlaceholderHint: matchesPlaceholderHint,
    mergeProfileInfoToLead: mergeProfileInfoToLead,
    normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
    normalizeDouyinCommentContent: normalizeDouyinCommentContent,
    normalizeUrl: normalizeUrl,
    normalizeUserUrl: normalizeUserUrl,
    noteVideoLocalQuotaExhaustedOnce: noteVideoLocalQuotaExhaustedOnce,
    openProfileVideoCommentPanel: openProfileVideoCommentPanel,
    parseDouyinCommentNode: parseDouyinCommentNode,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    persistSubviewTaskForResume: persistSubviewTaskForResume,
    pickLeadVideoUrl: pickLeadVideoUrl,
    pingInteractionActivity: pingInteractionActivity,
    prefetchKeywordReplyContents: prefetchKeywordReplyContents,
    prepareLeadsForAiAnalysis: prepareLeadsForAiAnalysis,
    pushToScrapeAiQueue: pushToScrapeAiQueue,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    readRadarSessionState: readRadarSessionState,
    recordLeadTouch: recordLeadTouch,
    rememberVideoMainComment: rememberVideoMainComment,
    removeEntityFeedSwipeLock: removeEntityFeedSwipeLock,
    reopenEmojiPanelIfNeeded: reopenEmojiPanelIfNeeded,
    replaceRiskyCommentEmojisLocal: replaceRiskyCommentEmojisLocal,
    reportCommentFlowTrace: reportCommentFlowTrace,
    reportCurrentAction: reportCurrentAction,
    reportEmojiDebug: reportEmojiDebug,
    reportMentionDebug: reportMentionDebug,
    reportProfileFirstTrace: reportProfileFirstTrace,
    reportTraceLog: reportTraceLog,
    resetScrapeAiQueueOnStop: resetScrapeAiQueueOnStop,
    resolveActiveMentionPercent: resolveActiveMentionPercent,
    resolveCommentLikeControlInNode: resolveCommentLikeControlInNode,
    resolveCommentMentionPosition: resolveCommentMentionPosition,
    resolveDouyinEmojiTabs: resolveDouyinEmojiTabs,
    resolveFollowUpFlags: resolveFollowUpFlags,
    resolveInteractionSkipReason: resolveInteractionSkipReason,
    resolveProfileFirstGenderFilter: resolveProfileFirstGenderFilter,
    resolveTaskGenderFilter: resolveTaskGenderFilter,
    resolveTaskLocationFilterRegions: resolveTaskLocationFilterRegions,
    rollMentionProbability: rollMentionProbability,
    safeScrollTargetIntoView: safeScrollTargetIntoView,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    scoreCommentContentFingerprints: scoreCommentContentFingerprints,
    scoreEmojiTabContainer: scoreEmojiTabContainer,
    scoreMainCommentPlaceholderCandidate: scoreMainCommentPlaceholderCandidate,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    shouldAbortProfileVideoDetailWait: shouldAbortProfileVideoDetailWait,
    shouldAppendCommentRandomSuffix: shouldAppendCommentRandomSuffix,
    shouldAppendVideoCommentRandomSuffix: shouldAppendVideoCommentRandomSuffix,
    shouldUseAiCommentAnalysis: shouldUseAiCommentAnalysis,
    shouldUseAiReplyGeneration: shouldUseAiReplyGeneration,
    shouldUseCommentKeywordFilter: shouldUseCommentKeywordFilter,
    shouldUseCommentMentions: shouldUseCommentMentions,
    shouldUseTextlessReplyPayload: shouldUseTextlessReplyPayload,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedEnter: simulateTrustedEnter,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    snapshotCommentLikeControlState: snapshotCommentLikeControlState,
    snapshotComposerEmojiState: snapshotComposerEmojiState,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    taskLocationFilterEnabled: taskLocationFilterEnabled,
    toSpecificVideoDirectUrl: toSpecificVideoDirectUrl,
    toSpecificVideoJingxuanUrl: toSpecificVideoJingxuanUrl,
    waitForProfileVideoDetailScope: waitForProfileVideoDetailScope,
    waitLeadgenScrapeAwemeAuthor: waitLeadgenScrapeAwemeAuthor,
    markBatchProfileCommentDone: markBatchProfileCommentDone,
    wasBatchProfileCommentDone: wasBatchProfileCommentDone,
    withBackgroundAutomationLayout: withBackgroundAutomationLayout,
    state: commentAutomationRuntimeState
  });
} catch (error) {
  commentAutomationControllerLoadError = error;
  console.error("[Built-in-Debug] 评论采集与互动控制器加载失败:", error);
}
try {
  if (profileInteractionController?.bootPendingSubviewTask) {
    profileInteractionController.bootPendingSubviewTask();
  }
} catch (error) {
  console.error("[Built-in-Debug] 子视图待恢复任务启动失败:", error);
}
function applySearchFilters(...restArgs) {
  return commentAutomationController?.applySearchFilters(...restArgs);
}
function buildImageAttachScope(...restArgs) {
  return commentAutomationController?.buildImageAttachScope(...restArgs);
}
function captureCurrentVideoMetadata(...restArgs) {
  return commentAutomationController?.captureCurrentVideoMetadata(...restArgs);
}
function collectCommentImageTriggerCandidates(...restArgs) {
  return commentAutomationController?.collectCommentImageTriggerCandidates(...restArgs);
}
function describeProfileNoWorksReason(...restArgs) {
  return commentAutomationController?.describeProfileNoWorksReason(...restArgs);
}
function describeProfileWorksNotReadyReason(...restArgs) {
  return commentAutomationController?.describeProfileWorksNotReadyReason(...restArgs);
}
function describeReplyEnvironment(...restArgs) {
  return commentAutomationController?.describeReplyEnvironment(...restArgs);
}
function ensureProfileWorksTab(...restArgs) {
  return commentAutomationController?.ensureProfileWorksTab(...restArgs);
}
function extractLeads(...restArgs) {
  return commentAutomationController?.extractLeads(...restArgs);
}
function findCommentPanelRoot(...restArgs) {
  return commentAutomationController?.findCommentPanelRoot(...restArgs);
}
function findDouyinEmojiPanel(...restArgs) {
  return commentAutomationController?.findDouyinEmojiPanel(...restArgs);
}
function findEmojiTriggerBtn(...restArgs) {
  return commentAutomationController?.findEmojiTriggerBtn(...restArgs);
}
function findMainVideoCommentInput(...restArgs) {
  return commentAutomationController?.findMainVideoCommentInput(...restArgs);
}
function findProfileVideoCards(...restArgs) {
  return commentAutomationController?.findProfileVideoCards(...restArgs);
}
function findTargetNode(...restArgs) {
  return commentAutomationController?.findTargetNode(...restArgs);
}
function formatScrapeCommentScrollAction(...restArgs) {
  return commentAutomationController?.formatScrapeCommentScrollAction(...restArgs);
}
function formatScrapeGuardWaitLabel(...restArgs) {
  return commentAutomationController?.formatScrapeGuardWaitLabel(...restArgs);
}
function getCommentComposerRoot(...restArgs) {
  return commentAutomationController?.getCommentComposerRoot(...restArgs);
}
function getCommentItemLooseSelector(...restArgs) {
  return commentAutomationController?.getCommentItemLooseSelector(...restArgs);
}
function getCommentItemSelector(...restArgs) {
  return commentAutomationController?.getCommentItemSelector(...restArgs);
}
function getCommentPanelSelector(...restArgs) {
  return commentAutomationController?.getCommentPanelSelector(...restArgs);
}
function getMainCommentInputShellSelector(...restArgs) {
  return commentAutomationController?.getMainCommentInputShellSelector(...restArgs);
}
function getProfilePostListRoot(...restArgs) {
  return commentAutomationController?.getProfilePostListRoot(...restArgs);
}
function getVideoAuthorInfo(...restArgs) {
  return commentAutomationController?.getVideoAuthorInfo(...restArgs);
}
function getVideoAuthorNickname(...restArgs) {
  return commentAutomationController?.getVideoAuthorNickname(...restArgs);
}
function getVideoAuthorProfileUrl(...restArgs) {
  return commentAutomationController?.getVideoAuthorProfileUrl(...restArgs);
}
function getVideoTitle(...restArgs) {
  return commentAutomationController?.getVideoTitle(...restArgs);
}
function hasCommentNonTextPayload(...restArgs) {
  return commentAutomationController?.hasCommentNonTextPayload(...restArgs);
}
function isProfileFirstCommentAiMode(...restArgs) {
  return commentAutomationController?.isProfileFirstCommentAiMode(...restArgs);
}
function isProfileFirstWorkCommentDone(...restArgs) {
  return commentAutomationController?.isProfileFirstWorkCommentDone(...restArgs);
}
function matchExcludedVideoAuthor(...restArgs) {
  return commentAutomationController?.matchExcludedVideoAuthor(...restArgs);
}
function mergeCommentSelectors(...restArgs) {
  return commentAutomationController?.mergeCommentSelectors(...restArgs);
}
function normalizeAuthorAccountName(...restArgs) {
  return commentAutomationController?.normalizeAuthorAccountName(...restArgs);
}
function parseExcludeAuthorAccounts(...restArgs) {
  return commentAutomationController?.parseExcludeAuthorAccounts(...restArgs);
}
function parseProfileWorksCount(...restArgs) {
  return commentAutomationController?.parseProfileWorksCount(...restArgs);
}
function pauseSettleThenCaptureVideoMetadata(...restArgs) {
  return commentAutomationController?.pauseSettleThenCaptureVideoMetadata(...restArgs);
}
function performLike(...restArgs) {
  return commentAutomationController?.performLike(...restArgs);
}
function performProfileActions(...restArgs) {
  return commentAutomationController?.performProfileActions(...restArgs);
}
function performProfileFirstWorkComment(...restArgs) {
  return commentAutomationController?.performProfileFirstWorkComment(...restArgs);
}
function performReply(...restArgs) {
  return commentAutomationController?.performReply(...restArgs);
}
function postVideoComment(...restArgs) {
  return commentAutomationController?.postVideoComment(...restArgs);
}
function profileHasNoPublicWorks(...restArgs) {
  return commentAutomationController?.profileHasNoPublicWorks(...restArgs);
}
function queryCommentItemNodes(...restArgs) {
  return commentAutomationController?.queryCommentItemNodes(...restArgs);
}
function reportMonitorActionProgress(...restArgs) {
  return commentAutomationController?.reportMonitorActionProgress(...restArgs);
}
function resetCommentImageRotation(...restArgs) {
  return commentAutomationController?.resetCommentImageRotation(...restArgs);
}
function resolveCommentImagePaths(...restArgs) {
  return commentAutomationController?.resolveCommentImagePaths(...restArgs);
}
function resolveCommentPanelRoot(...restArgs) {
  return commentAutomationController?.resolveCommentPanelRoot(...restArgs);
}
function resolveMainCommentWritableElement(...restArgs) {
  return commentAutomationController?.resolveMainCommentWritableElement(...restArgs);
}
function resolveMainVideoCommentText(...restArgs) {
  return commentAutomationController?.resolveMainVideoCommentText(...restArgs);
}
function resolveVideoCommentImagePaths(...restArgs) {
  return commentAutomationController?.resolveVideoCommentImagePaths(...restArgs);
}
function restoreCommentAttachmentRotationFromSession(...restArgs) {
  return commentAutomationController?.restoreCommentAttachmentRotationFromSession(...restArgs);
}
function persistCommentAttachmentRotation(...restArgs) {
  return commentAutomationController?.persistCommentAttachmentRotation(...restArgs);
}
function saveCommentScrapeProgress(...restArgs) {
  return commentAutomationController?.saveCommentScrapeProgress(...restArgs);
}
function syncCommentAttachmentRotationFromBatchStorage(...restArgs) {
  return commentAutomationController?.syncCommentAttachmentRotationFromBatchStorage(...restArgs);
}
function waitAndCaptureCurrentVideoMetadata(...restArgs) {
  return commentAutomationController?.waitAndCaptureCurrentVideoMetadata(...restArgs);
}
function waitForProfileWorksReady(...restArgs) {
  return commentAutomationController?.waitForProfileWorksReady(...restArgs);
}
let commentFeedNavigationController = null;
let commentFeedNavigationControllerLoadError = null;
try {
  const {
    createCommentFeedNavigationController
  } = require("./shared/commentFeedNavigationController");
  const commentFeedNavigationRuntimeState = {};
  Object.defineProperties(commentFeedNavigationRuntimeState, {
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    }
  });
  commentFeedNavigationController = createCommentFeedNavigationController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    buildDouyinVideoShareUrl: buildDouyinVideoShareUrl,
    captureFeedVideoShareUrl: captureFeedVideoShareUrl,
    clearPendingLeadVideoUrl: clearPendingLeadVideoUrl,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentPanelRoot: findCommentPanelRoot,
    findMainVideoCommentInput: findMainVideoCommentInput,
    getCommentItemLooseSelector: getCommentItemLooseSelector,
    getCommentItemSelector: getCommentItemSelector,
    getCommentPanelSelector: getCommentPanelSelector,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getVideoEngagePack: getVideoEngagePack,
    getDouyinFeedScope: getDouyinFeedScope,
    getFeedSwitchGuard: getFeedSwitchGuard,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getMyNickname: getMyNickname,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoTitle: getVideoTitle,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasCommentRuntimeReady: hasCommentRuntimeReady,
    hasFeedLiveEnterHint: hasFeedLiveEnterHint,
    isDouyinFeedLiveStream: isDouyinFeedLiveStream,
    isDouyinLiveStreamTitle: isDouyinLiveStreamTitle,
    isDouyinVideoShareUrl: isDouyinVideoShareUrl,
    isDouyinVisibleLoadingPlaceholder: isDouyinVisibleLoadingPlaceholder,
    isElementInFeedCenter: isElementInFeedCenter,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isOnUserProfilePage: isOnUserProfilePage,
    isProfileCommentUiVisible: isProfileCommentUiVisible,
    isVisibleElement: isVisibleElement,
    mergeCommentSelectors: mergeCommentSelectors,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    openFeedCommentDrawer: openFeedCommentDrawer,
    openProfileVideoCommentPanel: openProfileVideoCommentPanel,
    parseDouyinCommentNode: parseDouyinCommentNode,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    pruneSearchCardOpenFailures: pruneSearchCardOpenFailures,
    queryCommentItemNodes: queryCommentItemNodes,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    safeScrollTargetIntoView: safeScrollTargetIntoView,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedKey: simulateTrustedKey,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    state: commentFeedNavigationRuntimeState
  });
} catch (error) {
  commentFeedNavigationControllerLoadError = error;
  console.error("[Built-in-Debug] 评论面板与推荐流导航控制器加载失败:", error);
}
function aggressiveCommentListScroll(...restArgs) {
  return commentFeedNavigationController?.aggressiveCommentListScroll(...restArgs);
}
function awaitFeedVideoSwitchSettled(...restArgs) {
  return commentFeedNavigationController?.awaitFeedVideoSwitchSettled(...restArgs);
}
function ensureCommentPanelOpen(...restArgs) {
  return commentFeedNavigationController?.ensureCommentPanelOpen(...restArgs);
}
function expandReplies(...restArgs) {
  return commentFeedNavigationController?.expandReplies(...restArgs);
}
function findCommentScrollContainer(...restArgs) {
  return commentFeedNavigationController?.findCommentScrollContainer(...restArgs);
}
function getAdaptiveCommentWaitRange(...restArgs) {
  return commentFeedNavigationController?.getAdaptiveCommentWaitRange(...restArgs);
}
function getCommentEndHintText(...restArgs) {
  return commentFeedNavigationController?.getCommentEndHintText(...restArgs) || "";
}
function getCommentScrollMetrics(...restArgs) {
  return commentFeedNavigationController?.getCommentScrollMetrics(...restArgs);
}
function getCommentsTotalCount(...restArgs) {
  return commentFeedNavigationController?.getCommentsTotalCount(...restArgs) || 0;
}
function getExtendedReadyBudgetMs(...restArgs) {
  return commentFeedNavigationController?.getExtendedReadyBudgetMs(...restArgs) || 0;
}
function getExtendedReadyRounds(...restArgs) {
  return commentFeedNavigationController?.getExtendedReadyRounds(...restArgs) || 0;
}
function getScrapeNoCompliantTolerance(...restArgs) {
  return commentFeedNavigationController?.getScrapeNoCompliantTolerance(...restArgs) || 0;
}
function getScrapeNoNewDataTolerance(...restArgs) {
  return commentFeedNavigationController?.getScrapeNoNewDataTolerance(...restArgs) || 0;
}
function getVideoStats(...restArgs) {
  return commentFeedNavigationController?.getVideoStats(...restArgs);
}
function getVisibleCommentNodeCount(...restArgs) {
  return commentFeedNavigationController?.getVisibleCommentNodeCount(...restArgs) || 0;
}
function getVisibleCommentViewportFingerprint(...restArgs) {
  return commentFeedNavigationController?.getVisibleCommentViewportFingerprint(...restArgs) || "";
}
function isCommentPanelContentLoading(...restArgs) {
  return commentFeedNavigationController?.isCommentPanelContentLoading(...restArgs) || false;
}
function isCommentPanelEmptyHint(...restArgs) {
  return commentFeedNavigationController?.isCommentPanelEmptyHint(...restArgs) || false;
}
function maybeTrimRuntimeMemory(...restArgs) {
  return commentFeedNavigationController?.maybeTrimRuntimeMemory(...restArgs);
}
function moveToNextVideo(...restArgs) {
  return commentFeedNavigationController?.moveToNextVideo(...restArgs);
}
function parseLocalizedCountText(...restArgs) {
  return commentFeedNavigationController?.parseLocalizedCountText(...restArgs) || 0;
}
function pruneStaleCommentDom(...restArgs) {
  return commentFeedNavigationController?.pruneStaleCommentDom(...restArgs);
}
function resolveEffectiveCommentTotalCount(...restArgs) {
  return commentFeedNavigationController?.resolveEffectiveCommentTotalCount(...restArgs);
}
function sampleVisibleCommentTexts(...restArgs) {
  return commentFeedNavigationController?.sampleVisibleCommentTexts(...restArgs) || [];
}
function scrollCommentList(...restArgs) {
  return commentFeedNavigationController?.scrollCommentList(...restArgs);
}
function shouldContinueScrapeAfterDuplicateWindow(...restArgs) {
  return commentFeedNavigationController?.shouldContinueScrapeAfterDuplicateWindow(...restArgs) || false;
}
function shouldExpandFoldedCommentReplies(...restArgs) {
  return commentFeedNavigationController?.shouldExpandFoldedCommentReplies(...restArgs) || false;
}
function shouldProbeIncompleteScrapeBoundary(...restArgs) {
  return commentFeedNavigationController?.shouldProbeIncompleteScrapeBoundary(...restArgs) || false;
}
function trimRuntimeMemory(...restArgs) {
  return commentFeedNavigationController?.trimRuntimeMemory(...restArgs);
}
function waitForCommentDomWarmup(...restArgs) {
  return commentFeedNavigationController?.waitForCommentDomWarmup(...restArgs);
}
function waitForFeedItemChange(...restArgs) {
  return commentFeedNavigationController?.waitForFeedItemChange(...restArgs) || false;
}
let nurtureAutomationController = null;
let nurtureAutomationControllerLoadError = null;
try {
  const {
    createNurtureAutomationController
  } = require("./shared/nurtureAutomationController");
  const nurtureAutomationRuntimeState = {};
  Object.defineProperties(nurtureAutomationRuntimeState, {
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    }
  });
  nurtureAutomationController = createNurtureAutomationController({
    DOUYIN_RECOMMEND_URL: DOUYIN_RECOMMEND_URL,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    buildAutomationAiPayload: buildAutomationAiPayload,
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    cleanTitle: cleanTitle,
    clearPendingLeadVideoUrl: clearPendingLeadVideoUrl,
    clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureDouyinRecommendFeed: ensureDouyinRecommendFeed,
    extractSpecificVideoId: extractSpecificVideoId,
    getCommentV2String: getCommentV2String,
    getVideoEngagePack: getVideoEngagePack,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getVideoTitle: getVideoTitle,
    getVisibleCommentNodeCount: getVisibleCommentNodeCount,
    getVisibleDouyinVideoDurationMs: getVisibleDouyinVideoDurationMs,
    hasFeedLiveEnterHint: hasFeedLiveEnterHint,
    ipcRenderer: ipcRenderer,
    isElementInFeedCenter: isElementInFeedCenter,
    isOnDouyinFollowPage: isOnDouyinFollowPage,
    isOnDouyinRecommendPage: isOnDouyinRecommendPage,
    isOnUserProfilePage: isOnUserProfilePage,
    isVisibleElement: isVisibleElement,
    moveToNextVideo: moveToNextVideo,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    performRandomWandering: performRandomWandering,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    resolveLeadVideoUrl: resolveLeadVideoUrl,
    resumeVisibleDouyinVideos: resumeVisibleDouyinVideos,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    sessionStorage: sessionStorage,
    setSearchPendingOpenUrl: setSearchPendingOpenUrl,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    waitForFeedItemChange: waitForFeedItemChange,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitForDouyinSearchContentAfterZero: waitForDouyinSearchContentAfterZero,
    prepareSearchPageReload: prepareSearchPageReload,
    state: nurtureAutomationRuntimeState
  });
} catch (error) {
  nurtureAutomationControllerLoadError = error;
  console.error("[Built-in-Debug] 养号控制器加载失败:", error);
}
function isDouyinFeedInlineContext(...restArgs) {
  return nurtureAutomationController?.isDouyinFeedInlineContext(...restArgs) || false;
}
function isDouyinFeedLiveStream(...restArgs) {
  return nurtureAutomationController?.isDouyinFeedLiveStream(...restArgs) || false;
}
function isDouyinFullLivePage(...restArgs) {
  return nurtureAutomationController?.isDouyinFullLivePage(...restArgs) || false;
}
function isDouyinLiveStreamTitle(...restArgs) {
  return nurtureAutomationController?.isDouyinLiveStreamTitle(...restArgs) || false;
}
function skipDouyinFeedLiveStream(...restArgs) {
  return nurtureAutomationController?.skipDouyinFeedLiveStream(...restArgs);
}
function startNurtureLoop(...restArgs) {
  if (automationMediaController && commentFeedNavigationController && nurtureAutomationController?.startNurtureLoop) {
    return nurtureAutomationController.startNurtureLoop(...restArgs);
  }
  const value = restArgs[0];
  const local = automationMediaControllerLoadError?.message || commentFeedNavigationControllerLoadError?.message || nurtureAutomationControllerLoadError?.message || "养号控制器未完成初始化";
  const value2 = "养号任务初始化失败：" + local;
  reportTraceLog("❌ " + value2, null, "warning");
  abortAutomationStartup(value, value2);
  return Promise.resolve();
}
let leadgenAutomationController = null;
try {
  const {
    createLeadgenAutomationController
  } = require("./shared/leadgenAutomationController");
  const leadgenAutomationRuntimeState = {};
  Object.defineProperties(leadgenAutomationRuntimeState, {
    allowSpecificReprocess: {
      enumerable: true,
      get: () => allowSpecificReprocess,
      set: arg1 => {
        allowSpecificReprocess = arg1;
      }
    },
    commentExpressionRotateIndex: {
      enumerable: true,
      get: () => commentExpressionRotateIndex,
      set: arg1 => {
        commentExpressionRotateIndex = arg1;
      }
    },
    commentImageRotateIndex: {
      enumerable: true,
      get: () => commentImageRotateIndex,
      set: arg1 => {
        commentImageRotateIndex = arg1;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    interactedInSession: {
      enumerable: true,
      get: () => interactedInSession,
      set: arg1 => {
        interactedInSession = arg1;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: arg1 => {
        lastClickedId = arg1;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: arg1 => {
        lockedFeedIdentity = arg1;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: arg1 => {
        lockedLeadVideoUrl = arg1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: arg1 => {
        processedVideos = arg1;
      }
    },
    scrapeAiQueue: {
      enumerable: true,
      get: () => scrapeAiQueue,
      set: arg1 => {
        scrapeAiQueue = arg1;
      }
    },
    searchCardOpenFailureStreak: {
      enumerable: true,
      get: () => searchCardOpenFailureStreak,
      set: arg1 => {
        searchCardOpenFailureStreak = arg1;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: arg1 => {
        sessionDmCount = arg1;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: arg1 => {
        sessionDmLimit = arg1;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: arg1 => {
        sessionFollowCount = arg1;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: arg1 => {
        sessionFollowLimit = arg1;
      }
    },
    sessionInteractionCount: {
      enumerable: true,
      get: () => sessionInteractionCount,
      set: arg1 => {
        sessionInteractionCount = arg1;
      }
    },
    sessionInteractionLimit: {
      enumerable: true,
      get: () => sessionInteractionLimit,
      set: arg1 => {
        sessionInteractionLimit = arg1;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: arg1 => {
        sessionProcessedCount = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: arg1 => {
        targetVideoCount = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    },
    videoCommentExpressionRotateIndex: {
      enumerable: true,
      get: () => videoCommentExpressionRotateIndex,
      set: arg1 => {
        videoCommentExpressionRotateIndex = arg1;
      }
    },
    videoCommentImageRotateIndex: {
      enumerable: true,
      get: () => videoCommentImageRotateIndex,
      set: arg1 => {
        videoCommentImageRotateIndex = arg1;
      }
    }
  });
  leadgenAutomationController = createLeadgenAutomationController({
    DOUYIN_LIKE_ENTRY_URL: DOUYIN_LIKE_ENTRY_URL,
    DOUYIN_RECOMMEND_URL: DOUYIN_RECOMMEND_URL,
    getDouyinLikeEntryUrl: getDouyinLikeEntryUrl,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    Infinity: Infinity,
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER: SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER,
    SEARCH_CARD_OPEN_STUCK_RELOAD_AFTER: SEARCH_CARD_OPEN_STUCK_RELOAD_AFTER,
    SEARCH_ZERO_CARD_MAX_RELOADS: SEARCH_ZERO_CARD_MAX_RELOADS,
    SEARCH_ZERO_CARD_SCANS_BEFORE_RELOAD: SEARCH_ZERO_CARD_SCANS_BEFORE_RELOAD,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: SPECIFIC_VIDEO_LOAD_TIMEOUT_MS,
    SPECIFIC_VIDEO_NAV_MISS_MAX: SPECIFIC_VIDEO_NAV_MISS_MAX,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: SPECIFIC_VIDEO_OPEN_RETRY_MAX,
    WeakSet: WeakSet,
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
    state: leadgenAutomationRuntimeState
  });
} catch (error) {
  console.error("[Built-in-Debug] 评论获客主流程控制器加载失败:", error);
}
function startAutomation(...restArgs) {
  const value = restArgs[0];
  if (!commentFeedNavigationController) {
    const local = commentFeedNavigationControllerLoadError?.message || "评论面板与推荐流导航控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!douyinSearchMetadataController) {
    const local = douyinSearchMetadataControllerLoadError?.message || "抖音搜索元数据控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!douyinDomInteractionController) {
    const local = douyinDomInteractionControllerLoadError?.message || "抖音 DOM 交互控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!profileInteractionController) {
    const local = profileInteractionControllerLoadError?.message || "子视图主页互动控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!douyinDirectMessageController) {
    const local = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!automationMediaController) {
    const local = automationMediaControllerLoadError?.message || "自动化媒体守护控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!specificVideoNavigationController) {
    const local = specificVideoNavigationControllerLoadError?.message || "指定视频导航控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!searchVideoQueueController) {
    const local = searchVideoQueueControllerLoadError?.message || "搜索视频队列控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!commentAutomationController) {
    const local = commentAutomationControllerLoadError?.message || "评论控制器未完成初始化";
    const value2 = "评论获客初始化失败：" + local;
    reportTraceLog("❌ " + value2, null, "warning");
    abortAutomationStartup(value, value2);
    return Promise.resolve();
  }
  if (!leadgenAutomationController?.startAutomation) {
    const text = "评论获客初始化失败：主流程控制器不可用";
    reportTraceLog("❌ " + text, null, "warning");
    abortAutomationStartup(value, text);
    return Promise.resolve();
  }
  return leadgenAutomationController.startAutomation(...restArgs);
}
ipcRenderer.on("self-warmup-profile-dm", async (arg1, options = {}) => {
  const {
    requestId: requestId,
    dmText: dmText,
    nickname: nickname,
    userUrl: userUrl
  } = options;
  stopRequested = false;
  pausedForSubview = false;
  try {
    const result = await sendDmOnCurrentProfile(dmText, "SELF_WARMUP", {
      nickname: nickname,
      userUrl: userUrl
    });
    ipcRenderer.send("self-warmup-profile-dm-result", {
      requestId: requestId,
      ...result
    });
  } catch (error) {
    logSelfWarmupDm("私信异常", {
      nickname: nickname,
      error: error?.message || String(error)
    });
    ipcRenderer.send("self-warmup-profile-dm-result", {
      requestId: requestId,
      ok: false,
      reason: error?.message || String(error)
    });
  }
});
ipcRenderer.on("self-warmup-reply-dm", async (arg1, options = {}) => {
  const {
    requestId: requestId,
    dmText: dmText,
    nickname: nickname,
    text: text,
    config: config,
    accountId: accountId,
    account: account,
    excludeGroupChats: excludeGroupChats
  } = options;
  stopRequested = false;
  pausedForSubview = false;
  try {
    const result = await replyDmInConversation(dmText, "SELF_WARMUP", {
      nickname: nickname,
      text: text,
      config: config,
      accountId: accountId,
      account: account,
      excludeGroupChats: excludeGroupChats !== false
    });
    ipcRenderer.send("self-warmup-reply-dm-result", {
      requestId: requestId,
      ...result
    });
  } catch (error) {
    logSelfWarmupDm("回复私信异常", {
      nickname: nickname,
      error: error?.message || String(error)
    });
    ipcRenderer.send("self-warmup-reply-dm-result", {
      requestId: requestId,
      ok: false,
      reason: error?.message || String(error)
    });
  }
});
ipcRenderer.on("self-warmup-close-dm", async (arg1, options = {}) => {
  const {
    requestId: requestId
  } = options;
  try {
    const result = Array.from(document.querySelectorAll("button, div, span, a")).find(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = (arg1.innerText || arg1.textContent || "").trim();
      return result === "关闭会话" || result.includes("关闭会话");
    });
    const result2 = [".RightPanelHeadercloseImPage", "[class*=\"closeImPage\"]", "[class*=\"CloseImPage\"]", "[class*=\"RightPanelHeader\"] [class*=\"close\"]", "[class*=\"RightPanelHeader\"] svg", "#imSaasContainerId [aria-label=\"关闭\"]", "[data-e2e=\"im-dialog\"] [aria-label=\"关闭\"]", "[class*=\"Header\"] [class*=\"close\"]", "[class*=\"header\"] [class*=\"close\"]", "[class*=\"im-dialog\"] [class*=\"close\"]", "[class*=\"im-dialog\"] [aria-label=\"关闭\"]"].join(", ");
    const result3 = Array.from(document.querySelectorAll(result2)).find(isVisibleElement);
    const local = result || result3;
    let flag = false;
    if (local) {
      console.log("[Built-in-Debug] [私信关闭] 发现私信窗口顶部「关闭会话」按钮，点击关闭会话...");
      await simulateHumanClick(local, "SELF_WARMUP");
      await sleep(600);
      flag = true;
    }
    window.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27,
      bubbles: true
    }));
    await sleep(300);
    await closeAllModals("SELF_WARMUP");
    ipcRenderer.send("self-warmup-close-dm-result", {
      requestId: requestId,
      ok: true,
      closedByBtn: flag
    });
  } catch (error) {
    ipcRenderer.send("self-warmup-close-dm-result", {
      requestId: requestId,
      ok: false,
      reason: error?.message || String(error)
    });
  }
});
let videoMonitorController = null;
try {
  const {
    createVideoMonitorController
  } = require("./shared/videoMonitorController");
  const videoMonitorRuntimeState = {};
  Object.defineProperties(videoMonitorRuntimeState, {
    activeLoopId: {
      enumerable: true,
      get: () => activeLoopId,
      set: arg1 => {
        activeLoopId = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: arg1 => {
        currentViewKey = arg1;
      }
    },
    lastProfileVideoDetailDiagnostic: {
      enumerable: true,
      get: () => lastProfileVideoDetailDiagnostic,
      set: arg1 => {
        lastProfileVideoDetailDiagnostic = arg1;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: arg1 => {
        lastTrustedClickDiagnostic = arg1;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: arg1 => {
        pausedForSubview = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    }
  });
  videoMonitorController = createVideoMonitorController({
    PLATFORM_SELECTORS: PLATFORM_SELECTORS,
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    buildEntityCommentScraperDeps: buildEntityCommentScraperDeps,
    checkBatchAgeFilter: checkBatchAgeFilter,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    closeAllModals: closeAllModals,
    convertToDouyinModalUrl: convertToDouyinModalUrl,
    describeProfileNoWorksReason: describeProfileNoWorksReason,
    describeProfileWorksNotReadyReason: describeProfileWorksNotReadyReason,
    describeReplyEnvironment: describeReplyEnvironment,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureProfileWorksTab: ensureProfileWorksTab,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    evaluateSpecificVideoOpenProgress: evaluateSpecificVideoOpenProgress,
    evaluateTaskGenderFilter: evaluateTaskGenderFilter,
    expandReplies: expandReplies,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserKeyFromUrl: extractUserKeyFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentScrollContainer: findCommentScrollContainer,
    findProfileFollowButtonByText: findProfileFollowButtonByText,
    findProfileVideoCards: findProfileVideoCards,
    findSmartElementQuiet: findSmartElementQuiet,
    formatAgeFilterRangeLabel: formatAgeFilterRangeLabel,
    formatObservedAgeLabel: formatObservedAgeLabel,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getCommentsTotalCount: getCommentsTotalCount,
    getDouyinFeedScope: getDouyinFeedScope,
    getEntityCommentScraperModule: getEntityCommentScraperModule,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProfilePostListRoot: getProfilePostListRoot,
    getVideoAuthorInfo: getVideoAuthorInfo,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoAuthorProfileUrl: getVideoAuthorProfileUrl,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    getVideoEngagePack: getVideoEngagePack,
    getVideoStats: getVideoStats,
    getVideoTitle: getVideoTitle,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasSpecificVideoTargetInUrl: hasSpecificVideoTargetInUrl,
    ipcRenderer: ipcRenderer,
    isBatchAgeFilterActive: isBatchAgeFilterActive,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isCurrentVideoPauseGuardDrifted: isCurrentVideoPauseGuardDrifted,
    isOnSpecificTargetVideo: isOnSpecificTargetVideo,
    isSpecificVideoDetailReady: isSpecificVideoDetailReady,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    lookupSpecificVideoApiProbe: lookupSpecificVideoApiProbe,
    moveToNextVideo: moveToNextVideo,
    normalizeSpecificVideoKey: normalizeSpecificVideoKey,
    normalizeUrl: normalizeUrl,
    parseLocalizedCountText: parseLocalizedCountText,
    parseProfileWorksCount: parseProfileWorksCount,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    performLike: performLike,
    performProfileActionsLogic: performProfileActionsLogic,
    performProfileFirstWorkComment: performProfileFirstWorkComment,
    performReply: performReply,
    postVideoComment: postVideoComment,
    hasVideoMainCommented: hasVideoMainCommented,
    initVideoMainCommentMemoryFromTask: initVideoMainCommentMemoryFromTask,
    pruneStaleCommentDom: pruneStaleCommentDom,
    queryCommentItemNodes: queryCommentItemNodes,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportMonitorActionProgress: reportMonitorActionProgress,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    safeSessionGet: safeSessionGet,
    saveSpecificVideoState: saveSpecificVideoState,
    scrapeDetailedProfile: scrapeDetailedProfile,
    shouldAbort: shouldAbort,
    shouldExpandFoldedCommentReplies: shouldExpandFoldedCommentReplies,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    syncCommentAttachmentRotationFromBatchStorage: syncCommentAttachmentRotationFromBatchStorage,
    toSpecificVideoJingxuanUrl: toSpecificVideoJingxuanUrl,
    waitForCommentDomWarmup: waitForCommentDomWarmup,
    waitForProfileVideoDetailScope: waitForProfileVideoDetailScope,
    waitForProfileWorksReady: waitForProfileWorksReady,
    waitForSmartElement: waitForSmartElement,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitSpecificVideoNavAppear: waitSpecificVideoNavAppear,
    preloadDir: __dirname,
    state: videoMonitorRuntimeState
  });
} catch (error) {
  console.error("[Built-in-Debug] 视频监控控制器加载失败:", error);
}
function buildLeadCommentFingerprint(...restArgs) {
  return videoMonitorController?.buildLeadCommentFingerprint(...restArgs);
}
function buildNodeCommentFingerprint(...restArgs) {
  return videoMonitorController?.buildNodeCommentFingerprint(...restArgs);
}
function collectDouyinCommentEmojiHints(...restArgs) {
  return videoMonitorController?.collectDouyinCommentEmojiHints(...restArgs);
}
function commentNodeViewportBonus(...restArgs) {
  return videoMonitorController?.commentNodeViewportBonus(...restArgs);
}
function detectMonitorPrivateProfile(...restArgs) {
  return videoMonitorController?.detectMonitorPrivateProfile(...restArgs);
}
function extractDouyinCommentContent(...restArgs) {
  return videoMonitorController?.extractDouyinCommentContent(...restArgs);
}
function getCommentTimeModule(...restArgs) {
  return videoMonitorController?.getCommentTimeModule(...restArgs);
}
function isCommentFromVideoAuthor(...restArgs) {
  return videoMonitorController?.isCommentFromVideoAuthor(...restArgs);
}
function normalizeDouyinCommentContent(...restArgs) {
  return videoMonitorController?.normalizeDouyinCommentContent(...restArgs);
}
function parseDouyinCommentNode(...restArgs) {
  return videoMonitorController?.parseDouyinCommentNode(...restArgs);
}
function performVideoMonitorFollow(...restArgs) {
  return videoMonitorController?.performVideoMonitorFollow(...restArgs);
}
function runVideoMonitorAction(...restArgs) {
  return videoMonitorController?.runVideoMonitorAction(...restArgs);
}
function runVideoMonitorAuthorWorksScrape(...restArgs) {
  return videoMonitorController?.runVideoMonitorAuthorWorksScrape(...restArgs);
}
function runVideoMonitorMoveNextVideo(...restArgs) {
  return videoMonitorController?.runVideoMonitorMoveNextVideo(...restArgs);
}
function runVideoMonitorOpenAuthorWork(...restArgs) {
  return videoMonitorController?.runVideoMonitorOpenAuthorWork(...restArgs);
}
function runVideoMonitorOpenSpecificVideo(...restArgs) {
  return videoMonitorController?.runVideoMonitorOpenSpecificVideo(...restArgs);
}
function runVideoMonitorScrapeComments(...restArgs) {
  return videoMonitorController?.runVideoMonitorScrapeComments(...restArgs);
}
function runVideoMonitorWaitVideoReady(...restArgs) {
  return videoMonitorController?.runVideoMonitorWaitVideoReady(...restArgs);
}
function runVideoMonitorConfirmAuthor(...restArgs) {
  return videoMonitorController?.runVideoMonitorConfirmAuthor(...restArgs);
}
function scoreCommentContentFingerprints(...restArgs) {
  return videoMonitorController?.scoreCommentContentFingerprints(...restArgs);
}
let entityLeadgenController = null;
try {
  const {
    createEntityLeadgenController
  } = require("./shared/entityLeadgenController");
  const entityLeadgenRuntimeState = {};
  Object.defineProperties(entityLeadgenRuntimeState, {
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: arg1 => {
        currentRunningSource = arg1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: arg1 => {
        currentTask = arg1;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: arg1 => {
        lastClickedId = arg1;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: arg1 => {
        lockedFeedIdentity = arg1;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: arg1 => {
        lockedLeadVideoUrl = arg1;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: arg1 => {
        stopRequested = arg1;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: arg1 => {
        taskRunning = arg1;
      }
    }
  });
  entityLeadgenController = createEntityLeadgenController({
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS,
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
    preloadDir: __dirname,
    state: entityLeadgenRuntimeState
  });
} catch (error) {
  console.error("[Built-in-Debug] 线索采集控制器加载失败:", error);
}
function runEntityLeadgenScrapePage(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenScrapePage(...restArgs);
}
function getEntityCommentScraperModule(...restArgs) {
  return entityLeadgenController?.getEntityCommentScraperModule(...restArgs);
}
function buildEntityCommentScraperDeps(...restArgs) {
  return entityLeadgenController?.buildEntityCommentScraperDeps(...restArgs) || {};
}
function dismissEntityLoginPopupsCore(...restArgs) {
  return entityLeadgenController?.dismissEntityLoginPopupsCore(...restArgs);
}
function ensureEntityApiBridge(...restArgs) {
  return entityLeadgenController?.ensureEntityApiBridge(...restArgs);
}
function ensureEntityApiHook(...restArgs) {
  return entityLeadgenController?.ensureEntityApiHook(...restArgs);
}
function ensureEntityLiveHook(...restArgs) {
  return entityLeadgenController?.ensureEntityLiveHook(...restArgs);
}
function installEntityFeedSwipeLock(...restArgs) {
  return entityLeadgenController?.installEntityFeedSwipeLock(...restArgs);
}
function removeEntityFeedSwipeLock(...restArgs) {
  return entityLeadgenController?.removeEntityFeedSwipeLock(...restArgs);
}
function isEntityLeadgenActive() {
  return !!entityLeadgenController?.isActive();
}
function runEntityLeadgenOpenFirstSearchVideo(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenOpenFirstSearchVideo(...restArgs);
}
function runEntityLeadgenOpenSearchVideo(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenOpenSearchVideo(...restArgs);
}
function runEntityLeadgenWaitVideoReady(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenWaitVideoReady(...restArgs);
}
function runEntityLeadgenInspectRecommendVideo(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenInspectRecommendVideo(...restArgs);
}
function runEntityLeadgenMoveNextRecommendVideo(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenMoveNextRecommendVideo(...restArgs);
}
function runEntityLeadgenMoveNextSearchVideo(...restArgs) {
  return entityLeadgenController?.runEntityLeadgenMoveNextSearchVideo(...restArgs);
}
function cancelEntityLeadgenCollect(...restArgs) {
  return entityLeadgenController?.cancelEntityLeadgenCollect(...restArgs);
}
(function bootEntityApiHookOnLoad() {
  try {
    if (!/douyin\.com/i.test(String(location.href || ""))) {
      return;
    }
    ensureEntityApiBridge();
    ensureEntityApiHook();
    if (/live\.douyin\.com/i.test(String(location.href || ""))) {
      ensureEntityLiveHook();
    }
    document.addEventListener("DOMContentLoaded", () => {
      try {
        ensureEntityApiHook();
        if (/live\.douyin\.com/i.test(String(location.href || ""))) {
          ensureEntityLiveHook();
        }
      } catch (error) {}
    }, {
      once: true
    });
  } catch (error) {}
})();
ipcRenderer.on("control-task", (arg1, {
  type: type,
  payload: payload
}) => {
  if (type === "START_TASK") {
    if (!hasRemoteGatedConfig()) {
      console.error("[Built-in-Debug] [Security-Preload] 运行配置/授权尚未就绪，拒绝启动任务");
      reportTraceLog("⚠️ 运行环境尚未就绪，请先连接服务器获取配置。");
      ipcRenderer.send("task-finished", buildTaskFinishedPayload(payload.taskId, "runtime_config_missing"));
      return;
    }
    if (window.location.href.includes("/user/") && payload.taskMode !== "nurture") {
      const result = resolveTaskEntryUrl(payload);
      const result2 = result.includes("showTab=like");
      const local = window.location.href.includes("/user/") && (result2 ? isOnDouyinLikeEntryPage() : !window.location.href.includes("showTab=like"));
      if (!local) {
        console.log("[Built-in-Debug] 检测到外部个人主页，先跳转任务入口再启动");
        reportTraceLog("检测到外部个人主页，正在跳转任务入口…");
        if (result2) {
          markDouyinLikeEntryNavigation();
        }
        window.location.href = result;
        return;
      }
    }
    if (!payload.taskId) {
      console.log("[Built-in-Debug] 收到环境加载指令，未检测到任务 ID，跳过自动化启动。");
      return;
    }
    let flag = false;
    let obj = {};
    try {
      const result = readRadarSessionState(payload.accountId, payload.taskId, {
        migrateLegacy: true
      });
      obj = result;
      flag = result.loopId === payload.taskId;
      if (flag) {
        const result2 = Number(result.videoMin);
        const result3 = Number(result.videoMax);
        if (Number.isFinite(result2) && result2 > 0) {
          payload.videoMin = result.videoMin;
        }
        if (Number.isFinite(result3) && result3 > 0) {
          payload.videoMax = result.videoMax;
        }
      }
      if (flag && result.activeKeyword && payload.useGlobalKeywordPool) {
        const result2 = String(payload.keywords || "").trim();
        if (result2 && result2 !== result.activeKeyword) {
          payload.keywords = result.activeKeyword;
          if (!payload.keywordPoolResumeMatched) {
            ipcRenderer.invoke("claim-leadgen-keyword", {
              leadgenTaskId: payload.leadgenTaskId,
              accountId: payload.accountId,
              reuseActive: true,
              preferredKeyword: result.activeKeyword
            }).catch(() => {});
          }
        } else {
          payload.keywords = result.activeKeyword;
        }
      }
    } catch (error) {}
    if (taskRunning && activeLoopId === payload.taskId && !flag) {
      logTaskDbg("START_TASK", "忽略重复下发 taskId=" + payload.taskId);
      return;
    }
    if (taskRunning && activeLoopId === payload.taskId && flag) {
      logTaskDbg("START_TASK", "页面导航后续跑 taskId=" + payload.taskId);
      taskRunning = false;
    }
    if (taskRunning) {
      logTaskDbg("START_TASK", "切换任务 " + activeLoopId + " → " + payload.taskId);
      stopRequested = true;
    }
    cancelRandomWandering("start-task");
    const result = markTaskRestartFromPayload(payload);
    if (result) {
      obj = {};
    }
    logTaskDbg("START_TASK", "taskId=" + payload.taskId, {
      restart: result,
      resume: flag,
      taskRunning: taskRunning,
      url: clipTraceText(window.location.href, 80)
    });
    currentTask = payload;
    if (result) {
      resetCommentImageRotation();
      try {
        persistCommentAttachmentRotation();
      } catch (error) {}
    } else if (!flag) {
      resetCommentImageRotation();
      try {
        syncCommentAttachmentRotationFromBatchStorage();
      } catch (error) {}
    } else {
      restoreCommentAttachmentRotationFromSession(payload.accountId, payload.taskId);
      try {
        syncCommentAttachmentRotationFromBatchStorage();
      } catch (error) {}
    }
    try {
      const result = resolveCommentImagePaths();
      const result2 = resolveVideoCommentImagePaths();
      if (result.length || result2.length) {
        console.log("[评论配图] 图片池: 回复=" + result.length + " 主评=" + result2.length + (" | 轮询位: 回复=" + commentImageRotateIndex % Math.max(result.length, 1)) + (" 主评=" + videoCommentImageRotateIndex % Math.max(result2.length, 1)));
      }
    } catch (error) {}
    activeLoopId = payload.taskId;
    window._radar_account_id = payload.accountId;
    window._radar_account_name = payload.nickname || payload.name;
    window._radar_platform = payload.platform;
    if (payload.isFree) {
      payload.enableComment = false;
      payload.enableVideoComment = false;
      payload.enableFollow = false;
      payload.enableDM = false;
      payload.enableWarmup = false;
      console.log("[Built-in-Debug] [安全策略-Preload] 检测到免费版标识，已强制熔断自动回复、发表评论、关注、私信与预热特权");
    }
    if (payload.taskMode === "scrape") {
      payload.enableLike = false;
      payload.enableComment = false;
      payload.enableFollow = false;
      payload.enableDM = false;
      payload.enableWarmup = false;
      console.log("[Built-in-Debug] [安全策略] 已在 preload 环境下强制屏蔽所有物理互动及预热策略 (Scrape Mode Active)");
    }
    if (payload.taskMode === "nurture") {
      payload.enableLike = false;
      payload.enableComment = false;
      payload.enableFollow = false;
      payload.enableDM = false;
      payload.enableWarmup = false;
      payload.enableVideoComment = false;
      payload.aiReplyMode = false;
      payload.videoSources = ["recommend"];
      payload.processedVideos = [];
      processedVideos = new Set();
      sessionInteractionLimit = Infinity;
      console.log("[Built-in-Debug] [安全策略] 养号模式：已禁用全部获客互动，且不读写浏览视频库 (Nurture Mode Active)");
    }
    const result2 = restoreAutomationSessionLimits(payload, obj);
    sessionInteractionCount = result2.interactionCount;
    sessionInteractionLimit = result2.interactionLimit;
    if (sessionInteractionLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务互动总上限: " + sessionInteractionLimit + " (点赞+回复+发表评论 合计)" + (sessionInteractionCount > 0 ? "，已恢复累计 " + sessionInteractionCount : ""), "color: #fbbf24; font-weight: bold;");
      ipcRenderer.send("automation-data", {
        type: "interaction-total-progress",
        payload: {
          accountId: payload.accountId,
          current: sessionInteractionCount,
          limit: sessionInteractionLimit
        }
      });
    }
    sessionFollowCount = result2.followCount;
    sessionFollowLimit = result2.followLimit;
    sessionDmCount = result2.dmCount;
    sessionDmLimit = result2.dmLimit;
    sessionFollowLimitLogged = false;
    sessionDmLimitLogged = false;
    if (sessionFollowLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务关注上限: " + sessionFollowLimit + "，已恢复累计: " + sessionFollowCount, "color: #8b5cf6; font-weight: bold;");
    }
    if (sessionDmLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务私信上限: " + sessionDmLimit + "，已恢复累计: " + sessionDmCount, "color: #10b981; font-weight: bold;");
    }
    const value = sessionFollowLimit === Infinity ? "不限" : sessionFollowLimit + " 人";
    const value2 = sessionDmLimit === Infinity ? "不限" : sessionDmLimit + " 人";
    reportTraceLog("🛡 本次任务总上限：关注 " + value + "（已完成 " + sessionFollowCount + "），私信 " + value2 + "（已完成 " + sessionDmCount + "）");
    reportFollowUpLimitReached("follow");
    reportFollowUpLimitReached("dm");
    const result3 = resolveTaskLocationFilterRegions(payload);
    if (result3.length) {
      const flag = !!getLocationFilterModule();
      reportTraceLog("📍 地区过滤已启用：" + formatTaskLocationFilterSummary(payload) + ("（模块:" + (flag ? "shared" : "内置回退") + "）"));
      console.log("[Built-in-Debug] [地区过滤] 任务启动 mode=" + (payload.locationFilterMode || "include") + (" regions=" + JSON.stringify(result3)));
    }
    pausedForSubview = false;
    commentFailureStoppedTaskId = null;
    currentRunningSource = null;
    taskRunning = true;
    stopRequested = false;
    syncSpecificVideoPauseWatcher();
    if (payload.taskMode === "nurture") {
      startNurtureLoop(payload.taskId);
    } else {
      startAutomation(payload.taskId);
    }
  } else if (type === "STOP_TASK") {
    const local = payload?.taskId || null;
    if (local && activeLoopId && local !== activeLoopId) {
      console.log("[Built-in-Debug] 忽略过期 STOP_TASK: " + local + " (当前 " + activeLoopId + ")");
      return;
    }
    pausedForSubview = false;
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
    } catch (error) {}
    stopRequested = true;
    taskRunning = false;
    cancelRandomWandering("stop-task");
    pendingTaskRestart = false;
    allowSpecificReprocess = false;
    currentRunningSource = null;
    syncSpecificVideoPauseWatcher();
    resetScrapeAiQueueOnStop();
  } else if (type === "PAUSE_TASK") {
    console.log("[Built-in-Debug] 收到暂停指令，挂起当前任务循环。");
    cancelRandomWandering("pause-task");
    pausedForSubview = false;
    taskRunning = false;
    currentRunningSource = null;
    syncSpecificVideoPauseWatcher();
  } else if (type === "CANCEL_WANDERING") {
    cancelRandomWandering(payload?.reason || "batch-cancelled");
  } else if (type === "PERFORM_WANDERING") {
    const {
      duration: duration,
      traceAccountId: traceAccountId,
      batchRunId: batchRunId
    } = payload || {};
    performRandomWandering(duration, traceAccountId, {
      source: "batch",
      batchRunId: batchRunId
    }).catch(arg1 => {
      console.warn("[拟人闲逛] 执行异常: " + arg1.message);
    });
  } else if (type === "VIDEO_MONITOR_ACTION") {
    runVideoMonitorAction(payload);
  } else if (type === "VIDEO_MONITOR_SCRAPE") {
    runVideoMonitorScrapeComments(payload);
  } else if (type === "VIDEO_MONITOR_AUTHOR_WORKS") {
    runVideoMonitorAuthorWorksScrape(payload);
  } else if (type === "VIDEO_MONITOR_OPEN_AUTHOR_WORK") {
    runVideoMonitorOpenAuthorWork(payload || {});
  } else if (type === "VIDEO_MONITOR_MOVE_NEXT_VIDEO") {
    runVideoMonitorMoveNextVideo(payload || {});
  } else if (type === "VIDEO_MONITOR_WAIT_VIDEO_READY") {
    runVideoMonitorWaitVideoReady(payload || {});
  } else if (type === "VIDEO_MONITOR_CONFIRM_AUTHOR") {
    runVideoMonitorConfirmAuthor(payload || {});
  } else if (type === "VIDEO_MONITOR_OPEN_SPECIFIC_VIDEO") {
    runVideoMonitorOpenSpecificVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_SCRAPE_PAGE") {
    runEntityLeadgenScrapePage(payload || {});
  } else if (type === "ENTITY_LEADGEN_COLLECT") {
    runEntityLeadgenScrapePage({
      ...(payload || {}),
      sourceType: Array.isArray(payload?.sourceTypes) ? payload.sourceTypes[0] : payload?.sourceType
    });
  } else if (type === "ENTITY_LEADGEN_OPEN_FIRST_SEARCH_VIDEO") {
    runEntityLeadgenOpenFirstSearchVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_OPEN_SEARCH_VIDEO") {
    runEntityLeadgenOpenSearchVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_WAIT_VIDEO_READY") {
    runEntityLeadgenWaitVideoReady(payload || {});
  } else if (type === "ENTITY_LEADGEN_INSPECT_RECOMMEND_VIDEO") {
    runEntityLeadgenInspectRecommendVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_MOVE_NEXT_RECOMMEND_VIDEO") {
    runEntityLeadgenMoveNextRecommendVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO") {
    runEntityLeadgenMoveNextSearchVideo(payload || {});
  } else if (type === "ENTITY_LEADGEN_CANCEL") {
    cancelEntityLeadgenCollect();
  }
});
async function performRandomWandering(arg1, arg2 = null, options = {}) {
  if (!arg1 || arg1 < 2000) {
    return;
  }
  if (activeWanderingContext) {
    cancelRandomWandering("superseded");
  }
  const local = ++wanderingGeneration;
  const local2 = options.source || "task";
  const value = options.batchRunId;
  const value2 = local2 === "batch" ? "[批量间隙闲逛]" : "[闲逛]";
  activeWanderingContext = {
    token: local,
    source: local2,
    batchRunId: value,
    cancelWait: null
  };
  const local3 = () => local !== wanderingGeneration;
  const local4 = arg1 => new Promise(arg12 => {
    if (local3()) {
      arg12(false);
      return;
    }
    let flag = false;
    let local2 = null;
    const local4 = arg1 => {
      if (flag) {
        return;
      }
      flag = true;
      if (local2) {
        clearTimeout(local2);
      }
      if (activeWanderingContext?.token === local) {
        activeWanderingContext.cancelWait = null;
      }
      arg12(arg1 && !local3());
    };
    local2 = setTimeout(() => local4(true), Math.max(0, arg1));
    if (activeWanderingContext?.token === local) {
      activeWanderingContext.cancelWait = () => local4(false);
    }
    if (local3()) {
      local4(false);
    }
  });
  const result = Math.round(arg1 / 1000);
  const value3 = Date.now() + arg1;
  const local5 = window.location.pathname === "/" || window.location.pathname === "/recommend" || window.location.pathname === "";
  if (local5) {
    console.log("%c" + value2 + " 开始在推荐页刷视频闲逛 " + result + "s...", "color: #10b981; font-weight: bold;");
    if (local2 === "batch") {
      reportTraceLog("🚶 批量间隙：推荐页拟人闲逛已启动", arg2);
    }
  } else {
    console.log("%c" + value2 + " 开始在当前主页随机闲逛 " + result + "s...", "color: #10b981; font-weight: bold;");
    if (local2 === "batch") {
      reportTraceLog("🚶 批量间隙：主页拟人闲逛已启动", arg2);
    }
  }
  while (Date.now() < value3 && !local3()) {
    try {
      if (local5) {
        console.log(value2 + " 推荐页：切换下一个视频");
        window.dispatchEvent(new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true
        }));
        const local = document.querySelector("[data-e2e=\"feed-active-video\"]") || document.body;
        if (local) {
          local.scrollIntoView({
            behavior: "smooth"
          });
        }
        const result = Math.min(value3 - Date.now(), Math.floor(Math.random() * 4000) + 4000);
        if (result > 0) {
          if (!(await local4(result))) {
            break;
          }
        }
      } else {
        const result = Math.random();
        if (result > 0.6) {
          const value = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 400) + 100);
          window.scrollBy({
            top: value,
            behavior: "smooth"
          });
          console.log(value2 + " 模拟滑动: " + value + "px");
        } else if (result > 0.3) {
          console.log(value2 + " 模拟停顿阅读...");
          if (!(await local4(1000))) {
            break;
          }
        }
        if (!(await local4(Math.floor(Math.random() * 2000) + 1000))) {
          break;
        }
      }
    } catch (error) {
      if (!(await local4(1000))) {
        break;
      }
    }
  }
  const result2 = local3();
  if (!result2) {
    console.log(value2 + " 结束");
  }
  if (activeWanderingContext?.token === local) {
    activeWanderingContext = null;
  }
}
ipcRenderer.on("sync-processed-video", (arg1, {
  url: url
}) => {
  if (url) {
    getProcessedVideoKeyModule().rememberProcessedVideoKey(processedVideos, url);
    console.log("[Built-in-Debug] [同步记忆] 已同步来自其他账号的扫描记录: " + url);
  }
});
ipcRenderer.on("clear-processed-videos-cache", () => {
  processedVideos = new Set();
  console.log("[Built-in-Debug] [记忆清空] 已清空本窗口视频库缓存");
});
ipcRenderer.on("forget-processed-videos", (arg1, options = {}) => {
  const value = Array.isArray(options?.urls) ? options.urls : [options?.url || options];
  const result = getProcessedVideoKeyModule();
  let num = 0;
  for (const item of value) {
    if (!item) {
      continue;
    }
    const value = processedVideos.size;
    if (typeof result.forgetProcessedVideoKey === "function") {
      result.forgetProcessedVideoKey(processedVideos, item);
    } else {
      processedVideos.delete(item);
      const local = result.normalizeProcessedVideoKey?.(item);
      if (local) {
        processedVideos.delete(local);
      }
    }
    if (processedVideos.size < value) {
      num += 1;
    }
  }
  if (num > 0) {
    console.log("[Built-in-Debug] [记忆同步] 已从本窗口移除 " + num + " 条历史视频去重记录");
  }
});
ipcRenderer.on("sync-interacted-user", (arg1, {
  entries: entries
}) => {
  if (entries && Array.isArray(entries)) {
    entries.forEach(arg1 => {
      const value = typeof arg1 === "string" ? arg1 : arg1.id || arg1.userUrl || arg1.nickname;
      if (value) {
        interactedInSession.add(value);
        rememberKnownLeadLookup(value, true);
        if (rememberCurrentTaskInteractedKey(value)) {
          console.log("[Built-in-Debug] [同步黑名单] 已同步来自其他账号的互动记录: " + value);
        }
      }
    });
  }
});
let scrapeAiQueue = [];
let isProcessingScrapeAi = false;
function pushToScrapeAiQueue(arg1) {
  for (const item of arg1) {
    const result = getLeadPrimaryKey(item);
    if (!result) {
      scrapeAiQueue.push(item);
      continue;
    }
    if (scrapeAiQueue.some(arg1 => getLeadPrimaryKey(arg1) === result)) {
      continue;
    }
    scrapeAiQueue.push(item);
  }
  if (!isProcessingScrapeAi && (scrapeAiQueue.length >= 10 || !taskRunning || stopRequested)) {
    processScrapeAiQueue();
  }
}
async function processScrapeAiQueue() {
  if (isProcessingScrapeAi || scrapeAiQueue.length === 0) {
    return;
  }
  isProcessingScrapeAi = true;
  try {
    while (scrapeAiQueue.length >= 10 || scrapeAiQueue.length > 0 && !taskRunning) {
      if (stopRequested) {
        break;
      }
      const result = Math.min(scrapeAiQueue.length, 10);
      const result2 = scrapeAiQueue.splice(0, result);
      const {
        forBackend: forBackend,
        localCount: localCount,
        localLeads: localLeads
      } = prepareLeadsForAiAnalysis(result2);
      if (localCount > 0) {
        reportTraceLog("🤖 异步 AI：" + localCount + " 条已本地判定，" + forBackend.length + " 条提交后端…");
        ipcRenderer.send("automation-data", {
          type: "comment",
          payload: localLeads,
          taskId: activeLoopId,
          viewKey: currentTask?.viewKey,
          isAiMode: true
        });
      }
      if (forBackend.length === 0) {
        console.log("[Built-in-Debug] [异步AI] 批次 " + result2.length + " 条均已本地判定，跳过云端");
        if (!taskRunning && scrapeAiQueue.length < 20) {
          break;
        }
        continue;
      }
      console.log("[Built-in-Debug] [异步AI] 正在分析批次 (" + forBackend.length + "条)...");
      console.log("%c[AI分析] 🤖 AI 正在分析 " + forBackend.length + " 条评论 (队列剩余: " + scrapeAiQueue.length + ")...", "color: #8b5cf6; font-weight: bold;");
      reportTraceLog("🤖 异步 AI：分析 " + forBackend.length + " 条（队列剩余 " + scrapeAiQueue.length + "），请求后端（失败将自动重试直至成功）…");
      const result3 = Date.now();
      const result4 = await ipcRenderer.invoke("ai-intelligent-analyze-batch", buildAutomationAiPayload({
        leads: forBackend,
        config: {
          aiRole: currentTask.aiRole,
          aiGoal: currentTask.aiGoal,
          aiStyle: currentTask.aiStyle,
          aiPrompt: currentTask.aiPrompt
        }
      }));
      if (stopRequested || isAiInvokeCancelled(result4)) {
        reportTraceLog("🤖 异步 AI：任务已停止，终止队列处理");
        break;
      }
      const result5 = ((Date.now() - result3) / 1000).toFixed(1);
      if (result4.success && result4.data) {
        console.log("%c[AI分析] ✅ 批次分析完成 (" + forBackend.length + " 条)", "color: #10b981; font-weight: bold;");
        reportTraceLog("🤖 异步 AI：批次完成（耗时 " + result5 + "s，" + forBackend.length + " 条）");
        result4.data.forEach((arg1, arg2) => {
          if (forBackend[arg2]) {
            forBackend[arg2].isHighIntention = arg1.decision !== "ignore";
            forBackend[arg2].aiThought = arg1.aiThought;
            if (arg1.aiThought) {
              forBackend[arg2].thought = arg1.aiThought;
            }
          }
        });
        ipcRenderer.send("automation-data", {
          type: "comment",
          payload: forBackend,
          taskId: activeLoopId,
          viewKey: currentTask?.viewKey,
          isAiMode: true
        });
        console.log("[Built-in-Debug] [异步AI] 批次分析完成并上报。");
      } else {
        const value = isFatalAiAuthError(result4?.msg) ? "（额度/授权问题，已停止重试）" : "";
        reportTraceLog("🤖 异步 AI：批次失败（耗时 " + result5 + "s）" + value + "：" + clipTraceText(result4?.msg || "未知原因"));
      }
      if (!taskRunning && scrapeAiQueue.length < 20) {
        break;
      }
      reportTraceLog("⏱ 异步 AI：批次间隔等待 2 秒…");
      await new Promise(arg1 => setTimeout(arg1, 2000));
    }
  } catch (error) {
    console.error("[Built-in-Debug] [异步AI] 处理失败:", error);
  } finally {
    isProcessingScrapeAi = false;
    if (stopRequested) {
      resetScrapeAiQueueOnStop();
    }
  }
}
function injectNoticeJsonInterceptor() {
  try {
    if (typeof window === "undefined" || !window.document) {
      return;
    }
    if (window.__radarNoticeInterceptorInjected) {
      return;
    }
    window.__radarNoticeInterceptorInjected = true;
    window.addEventListener("radar-notice-json", arg1 => {
      try {
        const value = arg1.detail;
        if (value && typeof ipcRenderer !== "undefined") {
          ipcRenderer.send("self-warmup-notice-json", value);
        }
      } catch (error) {}
    });
    window.addEventListener("radar-im-json", arg1 => {
      try {
        const value = arg1.detail;
        if (value && typeof ipcRenderer !== "undefined") {
          ipcRenderer.send("self-warmup-im-json", value);
        }
      } catch (error) {}
    });
    window.addEventListener("radar-profile-json", arg1 => {
      try {
        const local = arg1.detail || {};
        const result = parseProfileGenderFromApiPayload(local.data);
        if (result) {
          rememberProfileApiGenderHit(result, {
            url: local.url || "",
            source: "api_intercept"
          });
          console.log("[Built-in-Debug] 截获 profile/other 性别: " + result.gender + ("（code=" + (result.genderCode ?? "-") + "，sec_uid=" + (result.secUid || "").slice(0, 16) + "…）"));
        }
      } catch (error) {}
    });
    const result = document.createElement("script");
    result.textContent = sanitizeInlinePageScript("(() => {\n            if (window.__radarMainNoticeHooked) return;\n            window.__radarMainNoticeHooked = true;\n\n            const notify = (url, jsonText) => {\n                try {\n                    if (!jsonText) return;\n                    const u = String(url || '');\n                    const isNotice = /\\/notice\\/|\\/aweme\\/v1\\/web\\/notice/i.test(u);\n                    const isIm = /\\/im\\/|\\/chat\\/|\\/session\\/|\\/conversation\\//i.test(u);\n                    const isProfile = /\\/aweme\\/v1\\/web\\/user\\/profile\\/other\\//i.test(u);\n                    const isCommentList = /\\/aweme\\/v1\\/web\\/comment\\/list/i.test(u);\n                    if (!isNotice && !isIm && !isProfile && !isCommentList) return;\n\n                    const data = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;\n                    if (isNotice) {\n                        window.dispatchEvent(new CustomEvent('radar-notice-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isIm) {\n                        window.dispatchEvent(new CustomEvent('radar-im-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isProfile) {\n                        window.dispatchEvent(new CustomEvent('radar-profile-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isCommentList) {\n                        const raw = (data && data.comments) || (data && data.data && data.data.comments) || [];\n                        const list = Array.isArray(raw) ? raw : [];\n                        const cids = [];\n                        for (let i = 0; i < list.length; i++) {\n                            const cid = String((list[i] && (list[i].cid || list[i].comment_id || list[i].commentId)) || '').trim();\n                            if (/^\\d{10,}$/.test(cid) && cids.indexOf(cid) < 0) cids.push(cid);\n                        }\n                        let awemeId = '';\n                        try {\n                            awemeId = String(new URL(u, location.origin).searchParams.get('aweme_id') || '').trim();\n                        } catch (_) {}\n                        window.__radarLatestCommentList = {\n                            url: u,\n                            ts: Date.now(),\n                            awemeId,\n                            cids,\n                            count: list.length,\n                        };\n                    }\n                } catch (_) {}\n            };\n\n            const shouldHook = (url) => /\\/notice\\/|\\/aweme\\/v1\\/web\\/notice|\\/im\\/|\\/chat\\/|\\/session\\/|\\/aweme\\/v1\\/web\\/user\\/profile\\/other\\/|\\/aweme\\/v1\\/web\\/comment\\/list/i.test(String(url || ''));\n\n            const origFetch = window.fetch;\n            if (typeof origFetch === 'function') {\n                window.fetch = async function(...args) {\n                    const res = await origFetch.apply(this, args);\n                    try {\n                        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');\n                        if (shouldHook(url)) {\n                            const clone = res.clone();\n                            clone.text().then(text => notify(url, text)).catch(() => {});\n                        }\n                    } catch (_) {}\n                    return res;\n                };\n            }\n\n            const origOpen = XMLHttpRequest.prototype.open;\n            const origSend = XMLHttpRequest.prototype.send;\n            XMLHttpRequest.prototype.open = function(method, url, ...rest) {\n                this.__radarUrl = url;\n                return origOpen.call(this, method, url, ...rest);\n            };\n            XMLHttpRequest.prototype.send = function(...args) {\n                this.addEventListener('load', function() {\n                    try {\n                        const url = String(this.__radarUrl || '');\n                        if (shouldHook(url)) {\n                            notify(url, this.responseText);\n                        }\n                    } catch (_) {}\n                }, { once: true });\n                return origSend.apply(this, args);\n            };\n        })();");
    (document.head || document.documentElement).appendChild(result);
    result.remove();
  } catch (error) {}
}
if (typeof document !== "undefined") {
  try {
    injectNoticeJsonInterceptor();
  } catch (error) {}
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectNoticeJsonInterceptor, {
      once: true
    });
  }
}

const {
  ipcRenderer,
  webFrame
} = require("electron");
function safeSessionGet(_0xbe61ed, _0x3a73a6 = null) {
  try {
    return sessionStorage.getItem(_0xbe61ed);
  } catch (_0x3683c9) {
    return _0x3a73a6;
  }
}
function sanitizeInlinePageScript(_0x1be23a) {
  return String(_0x1be23a || "").replace(/<\/script/gi, "<\\/script");
}
function safeSessionSet(_0x449313, _0x3e445d) {
  try {
    sessionStorage.setItem(_0x449313, _0x3e445d);
    return true;
  } catch (_0x5018c1) {
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
  const _0x5cd5e9 = (() => {
    try {
      return require("path");
    } catch (_0x2d73ff) {
      return null;
    }
  })();
  const _0x1386bb = ["./shared/douyinVideoAuthorCapture", "./shared/douyinVideoAuthorCapture.js"];
  if (_0x5cd5e9 && typeof __dirname === "string") {
    _0x1386bb.push(_0x5cd5e9.join(__dirname, "shared", "douyinVideoAuthorCapture.js"), _0x5cd5e9.join(__dirname, "shared", "douyinVideoAuthorCapture"), _0x5cd5e9.join(__dirname, "..", "shared", "douyinVideoAuthorCapture.js"));
  }
  for (const _0x58c6fa of _0x1386bb) {
    try {
      const _0xac669f = require(_0x58c6fa);
      if (typeof _0xac669f?.createDouyinVideoAuthorApi === "function") {
        _createDouyinVideoAuthorApiFn = _0xac669f.createDouyinVideoAuthorApi;
        console.log("[Built-in-Debug] douyinVideoAuthorCapture 已加载: " + _0x58c6fa);
        return _createDouyinVideoAuthorApiFn;
      }
    } catch (_0x4ca86c) {}
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
  const _0x5a4848 = (() => {
    try {
      return require("path");
    } catch (_0x23a367) {
      return null;
    }
  })();
  const _0x371a61 = ["./shared/entityLiveScheduler", "./shared/entityLiveScheduler.js"];
  if (_0x5a4848 && typeof __dirname === "string") {
    _0x371a61.push(_0x5a4848.join(__dirname, "shared", "entityLiveScheduler.js"), _0x5a4848.join(__dirname, "..", "shared", "entityLiveScheduler.js"));
  }
  for (const _0xb8f10d of _0x371a61) {
    try {
      const _0x46b396 = require(_0xb8f10d);
      if (typeof _0x46b396?.classifyLiveRoomAvailability === "function") {
        _classifyLiveRoomAvailabilityFn = _0x46b396.classifyLiveRoomAvailability;
        return _classifyLiveRoomAvailabilityFn;
      }
    } catch (_0x2579d6) {}
  }
  _classifyLiveRoomAvailabilityFn = ({
    text = "",
    hasChatContainer = false,
    elapsedMs = 0,
    capturedAnyEvent = false,
    privacyAudienceOnly = false,
    privacyAudienceCount = 0
  } = {}) => {
    const _0x2c43ce = String(text || "").replace(/\s+/g, " ").trim();
    if (/直播(?:间)?已结束|直播结束了|主播已下播|该直播间已关闭|本场直播已结束|主播暂时不在/.test(_0x2c43ce)) {
      return {
        ended: true,
        reason: "live_ended",
        message: "直播间已经结束"
      };
    }
    if (/私密直播|加密直播|密码房|输入密码|需要密码|仅邀请|仅好友可见|好友可见|直播间已加密|无法进入(?:该)?直播间|该直播间仅.*可见|主播开启了隐私保护|不支持查看他人资料|观众资料.*不可见|隐私设置.*无法观看/.test(_0x2c43ce)) {
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
    if (Number(elapsedMs) >= 10000 && !hasChatContainer && /直播不存在|房间不存在|页面不存在|服务器开小差|点击刷新重试|暂时无法观看/.test(_0x2c43ce)) {
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
  const _0x1ba3cc = (() => {
    try {
      return require("path");
    } catch (_0x289900) {
      return null;
    }
  })();
  const _0xf79e5c = ["./shared/hardwareFingerprint", "./shared/hardwareFingerprint.js"];
  if (_0x1ba3cc && typeof __dirname === "string") {
    _0xf79e5c.push(_0x1ba3cc.join(__dirname, "shared", "hardwareFingerprint.js"), _0x1ba3cc.join(__dirname, "shared", "hardwareFingerprint"), _0x1ba3cc.join(__dirname, "..", "shared", "hardwareFingerprint.js"));
  }
  for (const _0x470de9 of _0xf79e5c) {
    try {
      const _0x5e2f46 = require(_0x470de9);
      if (typeof _0x5e2f46?.buildFingerprintInjectionScript === "function") {
        _hardwareFingerprintMod = _0x5e2f46;
        return _hardwareFingerprintMod;
      }
    } catch (_0x3b8912) {}
  }
  _hardwareFingerprintMod = null;
  return null;
}
let _feedSwitchGuard;
function getFeedSwitchGuard() {
  if (_feedSwitchGuard) {
    return _feedSwitchGuard;
  }
  const _0x11051f = (() => {
    try {
      return require("path");
    } catch (_0x5d1d9c) {
      return null;
    }
  })();
  const _0x138fa6 = ["./shared/douyinFeedSwitchGuard", "./shared/douyinFeedSwitchGuard.js"];
  if (_0x11051f && typeof __dirname === "string") {
    _0x138fa6.push(_0x11051f.join(__dirname, "shared", "douyinFeedSwitchGuard.js"), _0x11051f.join(__dirname, "..", "shared", "douyinFeedSwitchGuard.js"));
  }
  for (const _0x1c7c29 of _0x138fa6) {
    try {
      const _0x55f90e = require(_0x1c7c29);
      if (typeof _0x55f90e?.createFeedSwitchGuard === "function") {
        _feedSwitchGuard = _0x55f90e.createFeedSwitchGuard();
        return _feedSwitchGuard;
      }
    } catch (_0x3e0daf) {}
  }
  let _0x1d275d = 0;
  let _0x4d1e1e = false;
  _feedSwitchGuard = {
    noteAttempt({
      byButton = false
    } = {}) {
      _0x1d275d = Date.now();
      _0x4d1e1e = !!byButton;
    },
    shouldSkipButtonClick({
      force = false
    } = {}) {
      if (force || !_0x4d1e1e || !_0x1d275d) {
        return false;
      }
      return Date.now() - _0x1d275d < 3200;
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
      _0x1d275d = 0;
      _0x4d1e1e = false;
    }
  };
  return _feedSwitchGuard;
}
let _specificVideoOpenMod;
function getSpecificVideoOpenModule() {
  if (_specificVideoOpenMod !== undefined) {
    return _specificVideoOpenMod;
  }
  const _0x2dcaa5 = (() => {
    try {
      return require("path");
    } catch (_0x521d12) {
      return null;
    }
  })();
  const _0x472a81 = ["./shared/douyinSpecificVideoOpen", "./shared/douyinSpecificVideoOpen.js"];
  if (_0x2dcaa5 && typeof __dirname === "string") {
    _0x472a81.push(_0x2dcaa5.join(__dirname, "shared", "douyinSpecificVideoOpen.js"), _0x2dcaa5.join(__dirname, "..", "shared", "douyinSpecificVideoOpen.js"));
  }
  for (const _0xeddbbf of _0x472a81) {
    try {
      const _0x553d05 = require(_0xeddbbf);
      if (typeof _0x553d05?.isDouyinLoadingLabelText === "function") {
        _specificVideoOpenMod = _0x553d05;
        return _specificVideoOpenMod;
      }
    } catch (_0x27b013) {}
  }
  _specificVideoOpenMod = null;
  return null;
}
let _searchPageReadyMod;
function getSearchPageReadyModule() {
  if (_searchPageReadyMod !== undefined) {
    return _searchPageReadyMod;
  }
  const _0x5a1558 = (() => {
    try {
      return require("path");
    } catch (_0x7f8ebb) {
      return null;
    }
  })();
  const _0x2d531c = ["./shared/douyinSearchPageReady", "./shared/douyinSearchPageReady.js"];
  if (_0x5a1558 && typeof __dirname === "string") {
    _0x2d531c.push(_0x5a1558.join(__dirname, "shared", "douyinSearchPageReady.js"), _0x5a1558.join(__dirname, "..", "shared", "douyinSearchPageReady.js"));
  }
  for (const _0x328bb5 of _0x2d531c) {
    try {
      const _0x3d0f0a = require(_0x328bb5);
      if (typeof _0x3d0f0a?.createSearchApiReadyTracker === "function") {
        _searchPageReadyMod = _0x3d0f0a;
        return _searchPageReadyMod;
      }
    } catch (_0x547437) {}
  }
  _searchPageReadyMod = null;
  return null;
}
let _videoSearchScrapePolicyMod;
function getVideoSearchScrapePolicyModule() {
  if (_videoSearchScrapePolicyMod !== undefined) {
    return _videoSearchScrapePolicyMod;
  }
  const _0x4f4531 = (() => {
    try {
      return require("path");
    } catch (_0x30e37b) {
      return null;
    }
  })();
  const _0x1797b8 = ["./shared/douyinVideoSearchScrapePolicy", "./shared/douyinVideoSearchScrapePolicy.js"];
  if (_0x4f4531 && typeof __dirname === "string") {
    _0x1797b8.push(_0x4f4531.join(__dirname, "shared", "douyinVideoSearchScrapePolicy.js"), _0x4f4531.join(__dirname, "..", "shared", "douyinVideoSearchScrapePolicy.js"));
  }
  for (const _0x48d501 of _0x1797b8) {
    try {
      const _0x1cf0d0 = require(_0x48d501);
      if (typeof _0x1cf0d0?.canLinkOnlyScrapeWithoutOpen === "function") {
        _videoSearchScrapePolicyMod = _0x1cf0d0;
        return _videoSearchScrapePolicyMod;
      }
    } catch (_0x39b3c5) {}
  }
  _videoSearchScrapePolicyMod = null;
  return null;
}
let _videoSearchCollectionEngineMod;
function getVideoSearchCollectionEngineModule() {
  if (_videoSearchCollectionEngineMod !== undefined) {
    return _videoSearchCollectionEngineMod;
  }
  const _0x460be2 = (() => {
    try {
      return require("path");
    } catch (_0x3e3e26) {
      return null;
    }
  })();
  const _0x2dd70e = ["./shared/douyinVideoSearchCollectionEngine", "./shared/douyinVideoSearchCollectionEngine.js"];
  if (_0x460be2 && typeof __dirname === "string") {
    _0x2dd70e.push(_0x460be2.join(__dirname, "shared", "douyinVideoSearchCollectionEngine.js"), _0x460be2.join(__dirname, "..", "shared", "douyinVideoSearchCollectionEngine.js"));
  }
  for (const _0x24fab3 of _0x2dd70e) {
    try {
      const _0x73bf6b = require(_0x24fab3);
      if (typeof _0x73bf6b?.performVideoSearchWindowScroll === "function" && typeof _0x73bf6b?.evaluateVideoSearchCollectionRound === "function") {
        _videoSearchCollectionEngineMod = _0x73bf6b;
        return _videoSearchCollectionEngineMod;
      }
    } catch (_0x2e9e3d) {}
  }
  _videoSearchCollectionEngineMod = null;
  return null;
}
let _applySearchFiltersMod;
function getApplySearchFiltersModule() {
  if (_applySearchFiltersMod !== undefined) {
    return _applySearchFiltersMod;
  }
  const _0x548a03 = (() => {
    try {
      return require("path");
    } catch (_0x393e80) {
      return null;
    }
  })();
  const _0xf02476 = ["./shared/douyinApplySearchFilters", "./shared/douyinApplySearchFilters.js"];
  if (_0x548a03 && typeof __dirname === "string") {
    _0xf02476.push(_0x548a03.join(__dirname, "shared", "douyinApplySearchFilters.js"), _0x548a03.join(__dirname, "..", "shared", "douyinApplySearchFilters.js"));
  }
  for (const _0x2ada85 of _0xf02476) {
    try {
      const _0x38f759 = require(_0x2ada85);
      if (typeof _0x38f759?.applyOfficialSearchFilters === "function") {
        _applySearchFiltersMod = _0x38f759;
        return _applySearchFiltersMod;
      }
    } catch (_0x3ce316) {}
  }
  _applySearchFiltersMod = null;
  return null;
}
let _searchFilterSessionMod;
function getSearchFilterSessionModule() {
  if (_searchFilterSessionMod !== undefined) {
    return _searchFilterSessionMod;
  }
  const _0x477005 = (() => {
    try {
      return require("path");
    } catch (_0x304507) {
      return null;
    }
  })();
  const _0x8af57f = ["./shared/douyinSearchFilterSession", "./shared/douyinSearchFilterSession.js"];
  if (_0x477005 && typeof __dirname === "string") {
    _0x8af57f.push(_0x477005.join(__dirname, "shared", "douyinSearchFilterSession.js"), _0x477005.join(__dirname, "..", "shared", "douyinSearchFilterSession.js"));
  }
  for (const _0x127575 of _0x8af57f) {
    try {
      const _0x3847cd = require(_0x127575);
      if (typeof _0x3847cd?.clearAppliedSearchFilterSession === "function") {
        _searchFilterSessionMod = _0x3847cd;
        return _searchFilterSessionMod;
      }
    } catch (_0x167717) {}
  }
  _searchFilterSessionMod = null;
  return null;
}
let _searchApiReadyTracker;
function getSearchApiReadyTracker() {
  if (_searchApiReadyTracker) {
    return _searchApiReadyTracker;
  }
  const _0x1f6a8b = getSearchPageReadyModule();
  if (_0x1f6a8b?.createSearchApiReadyTracker) {
    _searchApiReadyTracker = _0x1f6a8b.createSearchApiReadyTracker();
  } else {
    let _0x440b89 = 0;
    let _0x1a62fd = null;
    _searchApiReadyTracker = {
      bumpGeneration() {
        _0x440b89 += 1;
        _0x1a62fd = null;
        return _0x440b89;
      },
      getGeneration() {
        return _0x440b89;
      },
      noteApiDetail() {
        return null;
      },
      getSignal() {
        return _0x1a62fd;
      },
      hasFreshResults() {
        return false;
      },
      hasFreshEmpty() {
        return false;
      },
      reset() {
        _0x1a62fd = null;
      }
    };
  }
  return _searchApiReadyTracker;
}
function prepareSearchPageReload(_0x7beb54, _0x56d3b1, _0x561889 = "") {
  try {
    getSearchApiReadyTracker().bumpGeneration();
  } catch (_0x2a873f) {}
  try {
    const _0x1620f4 = getSearchFilterSessionModule();
    const _0x4b2528 = _0x1620f4?.clearAppliedSearchFilterSession?.(sessionStorage, _0x7beb54, _0x56d3b1) || 0;
    if (_0x4b2528 > 0) {
      console.log("[Built-in-Debug] [官方筛选] 重载前清筛选锁 " + _0x4b2528 + " 项" + ((_0x561889 ? "（" + _0x561889 + "）" : "") + ": " + (_0x56d3b1 || "-")));
    }
  } catch (_0x4e0e3b) {}
}
let specificVideoApiHookInstalled = false;
let specificVideoApiBridgeReady = false;
const specificVideoApiById = new Map();
function rememberSpecificVideoApiProbe(_0x30f446 = {}) {
  const _0x6b262c = String(_0x30f446?.awemeId || "").trim();
  if (!_0x6b262c) {
    return;
  }
  specificVideoApiById.set(_0x6b262c, {
    status: _0x30f446.status || "unknown",
    awemeId: _0x6b262c,
    statusCode: Number(_0x30f446.statusCode) || 0,
    reason: String(_0x30f446.reason || ""),
    at: Number(_0x30f446.at) || Date.now()
  });
  if (specificVideoApiById.size > 200) {
    const _0x3cf233 = [...specificVideoApiById.keys()].slice(0, specificVideoApiById.size - 120);
    _0x3cf233.forEach(_0x5ac0df => specificVideoApiById.delete(_0x5ac0df));
  }
}
function lookupSpecificVideoApiProbe(_0x4fcbf5) {
  const _0x450d61 = extractSpecificVideoId(_0x4fcbf5) || String(_0x4fcbf5 || "").trim();
  if (!_0x450d61) {
    return null;
  }
  return specificVideoApiById.get(_0x450d61) || null;
}
function ensureSpecificVideoApiBridge() {
  if (specificVideoApiBridgeReady) {
    return;
  }
  specificVideoApiBridgeReady = true;
  document.addEventListener("__radar_specific_video_api", _0x879163 => {
    try {
      rememberSpecificVideoApiProbe(_0x879163?.detail || {});
    } catch (_0x35260d) {
      console.warn("[SpecificVideo][API] bridge error:", _0x35260d?.message || _0x35260d);
    }
  });
}
function ensureSpecificVideoApiHook() {
  ensureSpecificVideoApiBridge();
  if (specificVideoApiHookInstalled || window.__radar_specific_video_api_hooked) {
    specificVideoApiHookInstalled = true;
    return true;
  }
  const _0xb87389 = getSpecificVideoOpenModule();
  const _0x241919 = typeof _0xb87389?.getSpecificVideoApiHookInstaller === "function" ? _0xb87389.getSpecificVideoApiHookInstaller() : "";
  if (!_0x241919) {
    return false;
  }
  try {
    const _0x2a86d7 = document.createElement("script");
    _0x2a86d7.textContent = sanitizeInlinePageScript(_0x241919);
    (document.documentElement || document.head || document.body).appendChild(_0x2a86d7);
    _0x2a86d7.remove();
    specificVideoApiHookInstalled = true;
    console.log("[SpecificVideo][API] hook installed");
    return true;
  } catch (_0x4c748f) {
    console.warn("[SpecificVideo][API] inject failed:", _0x4c748f?.message || _0x4c748f);
    return false;
  }
}
(function installProtocolClickGuard() {
  if (window._radar_protocol_click_guard) {
    return;
  }
  window._radar_protocol_click_guard = true;
  const _0x19a40e = _0x57dd3b => /^(https?:|about:|blob:|data:|javascript:)/i.test(String(_0x57dd3b || "").trim());
  const _0x3d02cd = () => {
    document.addEventListener("click", _0x1cc509 => {
      const _0x52650a = _0x1cc509.target?.closest?.("a[href]");
      if (!_0x52650a) {
        return;
      }
      const _0x1ce6a9 = String(_0x52650a.getAttribute("href") || "").trim();
      if (!_0x1ce6a9 || _0x19a40e(_0x1ce6a9)) {
        return;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(_0x1ce6a9)) {
        _0x1cc509.preventDefault();
        _0x1cc509.stopPropagation();
        console.log("[Protocol] 已拦截自定义协议点击: " + _0x1ce6a9.slice(0, 96));
      }
    }, true);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _0x3d02cd, {
      once: true
    });
  } else {
    _0x3d02cd();
  }
})();
(function injectCompatLayer() {
  if (window._radar_compat_active) {
    return;
  }
  window._radar_compat_active = true;
  const _0x1e592a = console.error;
  const _0x365da9 = console.warn;
  console.error = function (..._0x5e65a6) {
    if (_0x5e65a6[0] && typeof _0x5e65a6[0] === "string" && (_0x5e65a6[0].includes("read only property 'call'") || _0x5e65a6[0].includes("slardar"))) {
      return;
    }
    return _0x1e592a.apply(console, _0x5e65a6);
  };
  console.warn = function (..._0x1674f5) {
    if (_0x1674f5[0] && typeof _0x1674f5[0] === "string" && (_0x1674f5[0].includes("eventName is null") || _0x1674f5[0].includes("call"))) {
      return;
    }
    return _0x365da9.apply(console, _0x1674f5);
  };
  try {
    const _0x546c22 = window._radar_account_id || safeSessionGet("radar_account_id");
    let _0x336983 = {
      policy: "passthrough"
    };
    try {
      _0x336983 = ipcRenderer.sendSync("get-account-fingerprint-info-sync", _0x546c22) || {
        policy: "passthrough"
      };
    } catch (_0x441322) {}
    if (!_0x336983 || _0x336983.policy === "passthrough" || !_0x336983.seed || _0x336983.seed === "passthrough") {
      console.log("%c[Fingerprint] 旧账号继承原生设备指纹，0 修改直通 (0 风险)", "color: #3b82f6;");
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 8
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 8
      });
    } else {
      const _0x358c57 = loadHardwareFingerprint();
      if (_0x358c57 && typeof _0x358c57.buildFingerprintInjectionScript === "function") {
        const _0x565ee7 = _0x358c57.buildFingerprintInjectionScript(_0x336983.seed, process.platform);
        if (_0x565ee7) {
          const _0x2802b1 = document.createElement("script");
          _0x2802b1.textContent = sanitizeInlinePageScript(_0x565ee7);
          (document.head || document.documentElement).appendChild(_0x2802b1);
          _0x2802b1.remove();
          console.log("%c[Fingerprint] 新账号已动态激活拟真设备指纹与混音噪声 (Seed: " + _0x336983.seed + ")", "color: #10b981; font-weight: bold;");
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
  } catch (_0x5ed81a) {}
  console.log("%c[系统提示] 运行环境适配层已就绪", "color: #10b981; font-weight: bold;");
})();
let activeLoopId = null;
let taskRunning = false;
let stopRequested = false;
let wanderingGeneration = 0;
let activeWanderingContext = null;
function cancelRandomWandering(_0x42174f = "cancelled") {
  const _0x55acbf = activeWanderingContext;
  wanderingGeneration += 1;
  if (_0x55acbf) {
    _0x55acbf.cancelWait?.();
    const _0x1da0bc = _0x55acbf.source === "batch" ? "[批量间隙闲逛]" : "[拟人闲逛]";
    console.log(_0x1da0bc + " 已取消 (" + _0x42174f + ", run=" + (_0x55acbf.batchRunId ?? "-") + ")");
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
} catch (_0x4996dd) {
  console.error("[Built-in-Debug] 任务断点兼容模块加载失败:", _0x4996dd);
}
function getRadarSessionStateMethod(_0x1960ee) {
  const _0x3ab532 = radarSessionStateModule?.[_0x1960ee];
  if (typeof _0x3ab532 !== "function") {
    throw new Error("任务断点兼容模块缺少 " + _0x1960ee);
  }
  return _0x3ab532;
}
function legacyRadarSessionKey(_0x29a302) {
  const _0x1ec262 = _0x29a302 || window._radar_account_id || "default";
  return getRadarSessionStateMethod("buildLegacyRadarSessionKey")(_0x1ec262);
}
function radarSessionKey(_0x1f7f66, _0x48b793 = null) {
  const _0xd2fffe = _0x1f7f66 || window._radar_account_id || "default";
  const _0x3574a3 = _0x48b793 || activeLoopId || currentTask?.taskId || "";
  return getRadarSessionStateMethod("buildRadarSessionKey")(_0xd2fffe, _0x3574a3);
}
function readRadarSessionState(_0x2f6239, _0x3e6f71, {
  migrateLegacy = false
} = {}) {
  const _0x3e240c = _0x2f6239 || window._radar_account_id || "default";
  const _0x2fc3f4 = _0x3e6f71 || activeLoopId || currentTask?.taskId || "";
  return getRadarSessionStateMethod("readRadarSessionState")(localStorage, {
    accountId: _0x3e240c,
    taskId: _0x2fc3f4,
    migrateLegacy: migrateLegacy
  });
}
function restoreAutomationSessionLimits(_0x33922b, _0x1130fd) {
  return getRadarSessionStateMethod("restoreAutomationSessionLimits")(_0x33922b, _0x1130fd);
}
function logTaskDbg(_0xc80636, _0x2f88e4, _0x4d0f9b = null) {
  const _0x3d82a3 = _0x4d0f9b ? " " + JSON.stringify(_0x4d0f9b) : "";
  console.log("[Built-in-Debug] [" + _0xc80636 + "] " + _0x2f88e4 + _0x3d82a3);
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
function _touchEntryAt(_0x3188e7) {
  return Number(_0x3188e7?.at || _0x3188e7?.timestamp || 0);
}
function _pickTouchContent(_0x5640d1) {
  for (const _0x2f3564 of _0x5640d1) {
    const _0x38a8c6 = (_0x2f3564?.content || "").trim();
    if (_0x38a8c6) {
      return _0x38a8c6;
    }
  }
  return "";
}
function _normalizeTouchLogEntries(_0xfb557b) {
  if (!Array.isArray(_0xfb557b) || !_0xfb557b.length) {
    return [];
  }
  const _0x39a939 = _0xfb557b.map(_0x5c4411 => ({
    ..._0x5c4411
  }));
  const _0x27dbb1 = new Set();
  const _0x5d91b7 = [];
  for (let _0x411b56 = 0; _0x411b56 < _0x39a939.length; _0x411b56++) {
    if (_0x27dbb1.has(_0x411b56)) {
      continue;
    }
    const _0x145820 = _0x39a939[_0x411b56];
    const _0x51992d = _touchEntryAt(_0x145820);
    const _0x484d6d = _0x145820.accountName || "";
    if (_0x145820.type === "reply" || _0x145820.type === "profileComment") {
      const _0x342ad3 = [_0x411b56];
      for (let _0x423122 = 0; _0x423122 < _0x39a939.length; _0x423122++) {
        if (_0x423122 === _0x411b56 || _0x27dbb1.has(_0x423122)) {
          continue;
        }
        const _0x37f150 = _0x39a939[_0x423122];
        if (_0x37f150.type !== "reply" && _0x37f150.type !== "profileComment") {
          continue;
        }
        if ((_0x37f150.accountName || "") !== _0x484d6d) {
          continue;
        }
        const _0x36efcf = _touchEntryAt(_0x37f150);
        if (_0x51992d && _0x36efcf && Math.abs(_0x36efcf - _0x51992d) > 15000) {
          continue;
        }
        _0x342ad3.push(_0x423122);
      }
      const _0x1cbcd9 = _0x342ad3.some(_0x142388 => _0x39a939[_0x142388].type === "reply");
      const _0x5ed97e = _0x342ad3.some(_0x3fe3d5 => _0x39a939[_0x3fe3d5].type === "profileComment");
      if (_0x1cbcd9 && _0x5ed97e) {
        const _0x32b895 = _0x342ad3.map(_0x39bf64 => _0x39a939[_0x39bf64]);
        _0x342ad3.forEach(_0x12e84c => _0x27dbb1.add(_0x12e84c));
        const _0x11383e = _0x32b895.map(_0x2f8230 => _touchEntryAt(_0x2f8230)).find(Boolean) || Date.now();
        const _0x44010b = _0x32b895.find(_0x398f7f => _0x398f7f.type === "profileComment") || _0x32b895[0];
        _0x5d91b7.push({
          ..._0x44010b,
          type: "profileComment",
          label: _TOUCH_TYPE_LABELS.profileComment,
          content: _pickTouchContent(_0x32b895),
          at: _0x11383e
        });
        continue;
      }
    }
    _0x27dbb1.add(_0x411b56);
    _0x5d91b7.push({
      ..._0x145820,
      label: _0x145820.type === "profileComment" ? _TOUCH_TYPE_LABELS.profileComment : _0x145820.label || _TOUCH_TYPE_LABELS[_0x145820.type] || _0x145820.type,
      at: _0x51992d || Date.now()
    });
  }
  const _0x47ada0 = _0x5d91b7.sort((_0x3cd5bc, _0x282936) => _touchEntryAt(_0x282936) - _touchEntryAt(_0x3cd5bc));
  const _0x3dba6a = new Set();
  return _0x47ada0.filter(_0x522417 => {
    const _0x12b9d7 = _touchEntryAt(_0x522417);
    if (_0x522417.type === "profileComment") {
      const _0x550ce5 = _0x522417.type + "|" + (_0x522417.accountName || "") + "|" + (_0x12b9d7 ? Math.floor(_0x12b9d7 / 120000) : 0);
      if (_0x3dba6a.has(_0x550ce5)) {
        return false;
      }
      _0x3dba6a.add(_0x550ce5);
      return true;
    }
    const _0x30a24a = _0x12b9d7 ? Math.floor(_0x12b9d7 / 1000) : 0;
    const _0x165653 = String(_0x522417.content || "").trim().slice(0, 80);
    const _0xfa6478 = _0x522417.type + "|" + (_0x522417.accountName || "") + "|" + _0x165653 + "|" + _0x30a24a;
    if (_0x3dba6a.has(_0xfa6478)) {
      return false;
    }
    _0x3dba6a.add(_0xfa6478);
    return true;
  });
}
function _syncTouchCountsFromLog(_0x179c31) {
  const _0x138f6a = _createEmptyTouchCounts();
  for (const _0x11c1d8 of _0x179c31.touchLog || []) {
    if (_TOUCH_TYPES.includes(_0x11c1d8.type)) {
      _0x138f6a[_0x11c1d8.type] += 1;
    }
  }
  _0x179c31.touchCounts = _0x138f6a;
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
function _normalizeTouchCounts(_0x38b7da) {
  const _0x3d8acd = _createEmptyTouchCounts();
  if (!_0x38b7da || typeof _0x38b7da !== "object") {
    return _0x3d8acd;
  }
  _TOUCH_TYPES.forEach(_0x50375e => {
    const _0x5363be = Number(_0x38b7da[_0x50375e]);
    _0x3d8acd[_0x50375e] = Number.isFinite(_0x5363be) && _0x5363be > 0 ? Math.floor(_0x5363be) : 0;
  });
  return _0x3d8acd;
}
function _migrateTouchCountsFromLegacy(_0x24edc7) {
  if (!_0x24edc7) {
    return _createEmptyTouchCounts();
  }
  const _0x45465c = _normalizeTouchCounts(_0x24edc7.touchCounts);
  if (_TOUCH_TYPES.reduce((_0x152335, _0x3e7610) => _0x152335 + _0x45465c[_0x3e7610], 0) > 0) {
    return _0x45465c;
  }
  const _0x52f498 = _createEmptyTouchCounts();
  if (_0x24edc7.liked || _0x24edc7.actions?.liked) {
    _0x52f498.like = 1;
  }
  const _0x3e8381 = (_0x24edc7.touchCounts?.profileComment || 0) > 0 || Array.isArray(_0x24edc7.touchLog) && _0x24edc7.touchLog.some(_0x3c20b3 => _0x3c20b3.type === "profileComment") || !!_0x24edc7.actions?.profileWorkCommented && !!_0x24edc7.profileCommentAt;
  if (_0x3e8381) {
    _0x52f498.profileComment = 1;
  } else if (_0x24edc7.replied || _0x24edc7.actions?.replied) {
    _0x52f498.reply = 1;
  }
  if (_0x24edc7.followed || _0x24edc7.actions?.followed) {
    _0x52f498.follow = 1;
  }
  if (_0x24edc7.messaged || _0x24edc7.actions?.messaged) {
    _0x52f498.message = 1;
  }
  return _0x52f498;
}
const leadTouch = {
  ensureLeadMeta(_0x263829) {
    if (!_0x263829) {
      return _0x263829;
    }
    if (!Array.isArray(_0x263829.touchLog)) {
      _0x263829.touchLog = [];
    }
    _0x263829.touchCounts = _migrateTouchCountsFromLegacy(_0x263829);
    if (_0x263829.worksCount === undefined) {
      _0x263829.worksCount = null;
    }
    return _0x263829;
  },
  recordTouchOnLead(_0x8501ea, _0x530194) {
    if (!_0x8501ea || !_0x530194?.type || !_TOUCH_TYPES.includes(_0x530194.type)) {
      return _0x8501ea;
    }
    leadTouch.ensureLeadMeta(_0x8501ea);
    const _0x111386 = _0x530194.at || Date.now();
    const _0x544be = _0x530194.source || "acquire";
    const _0x2448c0 = _0x530194.channel || (_0x544be === "batch" ? "线索库批量" : "自动获客");
    const _0x13c6fd = _0x530194.accountName || _0x8501ea.accountName || "";
    let _0x3cc52e = _0x530194.content || "";
    if (_0x530194.type === "profileComment") {
      const _0xeb8506 = _0x8501ea.touchLog.filter(_0x58bb8c => _0x58bb8c.type === "reply" && (_0x58bb8c.accountName || "") === _0x13c6fd && (!_touchEntryAt(_0x58bb8c) || !_0x111386 || Math.abs(_touchEntryAt(_0x58bb8c) - _0x111386) < 15000));
      if (!_0x3cc52e.trim() && _0xeb8506.length) {
        _0x3cc52e = _pickTouchContent(_0xeb8506);
      }
      if (_0xeb8506.length) {
        _0x8501ea.touchLog = _0x8501ea.touchLog.filter(_0x214302 => !_0xeb8506.includes(_0x214302));
      }
    }
    const _0x561aa7 = _0x8501ea.touchLog.some(_0x39d6cd => {
      if (_0x39d6cd.type !== _0x530194.type) {
        return false;
      }
      if ((_0x39d6cd.accountName || "") !== _0x13c6fd) {
        return false;
      }
      if (_0x530194.type === "profileComment") {
        const _0x2d3598 = _touchEntryAt(_0x39d6cd);
        return _0x2d3598 && Math.abs(_0x2d3598 - _0x111386) < 120000;
      }
      return Math.abs(_touchEntryAt(_0x39d6cd) - _0x111386) < 2500;
    });
    if (_0x561aa7) {
      return _0x8501ea;
    }
    _0x8501ea.touchCounts[_0x530194.type] = (_0x8501ea.touchCounts[_0x530194.type] || 0) + 1;
    _0x8501ea.touchLog.unshift({
      type: _0x530194.type,
      label: _0x530194.type === "profileComment" ? _TOUCH_TYPE_LABELS.profileComment : _TOUCH_TYPE_LABELS[_0x530194.type] || _0x530194.type,
      at: _0x111386,
      content: _0x3cc52e,
      accountName: _0x13c6fd,
      success: _0x530194.success !== false,
      source: _0x544be,
      channel: _0x2448c0
    });
    _0x8501ea.touchLog = _normalizeTouchLogEntries(_0x8501ea.touchLog);
    _syncTouchCountsFromLog(_0x8501ea);
    if (_0x8501ea.touchLog.length > 200) {
      _0x8501ea.touchLog.length = 200;
    }
    return _0x8501ea;
  }
};
function extractUserKeyFromUrl(_0x2f86d5) {
  if (!_0x2f86d5 || typeof _0x2f86d5 !== "string") {
    return "";
  }
  try {
    let _0x19deb7 = _0x2f86d5.trim();
    if (_0x19deb7.startsWith("//")) {
      _0x19deb7 = "https:" + _0x19deb7;
    }
    if (!_0x19deb7.startsWith("http")) {
      _0x19deb7 = "https://www.douyin.com" + (_0x19deb7.startsWith("/") ? _0x19deb7 : "/" + _0x19deb7);
    }
    const _0x5465d9 = new URL(_0x19deb7);
    const _0x1cb83b = _0x5465d9.pathname.match(/\/user\/([^/?#]+)/i);
    if (_0x1cb83b && _0x1cb83b[1]) {
      const _0x11af80 = decodeURIComponent(_0x1cb83b[1]);
      if (_0x11af80 && !["self", "login"].includes(_0x11af80.toLowerCase())) {
        return _0x11af80;
      }
    }
    const _0x999cab = _0x5465d9.pathname.match(/\/user\/profile\/([^/?#]+)/i);
    if (_0x999cab && _0x999cab[1]) {
      return decodeURIComponent(_0x999cab[1]);
    }
  } catch (_0x23c268) {}
  return "";
}
function normalizeUserUrl(_0x5e01ab) {
  if (!_0x5e01ab) {
    return "";
  }
  try {
    const _0x530bd6 = new URL(_0x5e01ab.startsWith("http") ? _0x5e01ab : "https://www.douyin.com" + (_0x5e01ab.startsWith("/") ? _0x5e01ab : "/" + _0x5e01ab));
    return _0x530bd6.origin + _0x530bd6.pathname.replace(/\/$/, "");
  } catch (_0x3dd1ac) {
    return _0x5e01ab;
  }
}
function buildLeadIdFromLead(_0x28623e, _0x37b0a3, _0x4a1a84) {
  const _0x181a4e = extractUserKeyFromUrl(_0x28623e);
  if (_0x181a4e) {
    return _0x181a4e;
  }
  const _0x7087a = (_0x37b0a3 || "").trim();
  const _0x158566 = (_0x4a1a84 || "").trim();
  if (_0x7087a && _0x158566) {
    return _0x7087a + "_" + _0x158566;
  }
  if (_0x7087a) {
    return _0x7087a;
  }
  return "unknown_" + Date.now();
}
function getLeadPrimaryKey(_0x5e4beb) {
  if (!_0x5e4beb) {
    return "";
  }
  return _0x5e4beb.leadId || extractUserKeyFromUrl(_0x5e4beb.userUrl) || buildLeadIdFromLead(_0x5e4beb.userUrl, _0x5e4beb.nickname, _0x5e4beb.content);
}
function getLeadAliasKeys(_0x17a9dd) {
  const _0x1720bd = new Set();
  const _0x9e748a = getLeadPrimaryKey(_0x17a9dd);
  if (_0x9e748a) {
    _0x1720bd.add(_0x9e748a);
  }
  const _0x553337 = extractUserKeyFromUrl(_0x17a9dd?.userUrl);
  if (_0x553337) {
    _0x1720bd.add(_0x553337);
  }
  const _0x4c98a4 = normalizeUserUrl(_0x17a9dd?.userUrl);
  if (_0x4c98a4) {
    _0x1720bd.add(_0x4c98a4);
  }
  if (_0x17a9dd?.nickname) {
    _0x1720bd.add(_0x17a9dd.nickname);
  }
  return [..._0x1720bd];
}
function isLeadInSession(_0x880e51) {
  return getLeadAliasKeys(_0x880e51).some(_0xca798c => interactedInSession.has(_0xca798c));
}
function isLeadInKnownPool(_0x4c6b19) {
  const _0x580a28 = currentTask?.interactedUsers;
  if (!_0x580a28?.length) {
    return false;
  }
  return getLeadAliasKeys(_0x4c6b19).some(_0x2ad942 => _0x580a28.includes(_0x2ad942));
}
const KNOWN_LEAD_LOOKUP_CACHE_LIMIT = 5000;
let knownLeadLookupTaskToken = "";
const knownLeadLookupCache = new Map();
function rememberKnownLeadLookup(_0x59a9a3, _0x1d6556) {
  if (!_0x59a9a3) {
    return;
  }
  if (knownLeadLookupCache.has(_0x59a9a3)) {
    knownLeadLookupCache.delete(_0x59a9a3);
  }
  knownLeadLookupCache.set(_0x59a9a3, !!_0x1d6556);
  while (knownLeadLookupCache.size > KNOWN_LEAD_LOOKUP_CACHE_LIMIT) {
    const _0x12332a = knownLeadLookupCache.keys().next().value;
    knownLeadLookupCache.delete(_0x12332a);
  }
}
async function queryKnownLeadKeys(_0x3dae37) {
  const _0x13ab66 = String(currentTask?.taskId || currentTask?.batchRunId || currentTask?.runId || "");
  if (_0x13ab66 !== knownLeadLookupTaskToken) {
    knownLeadLookupTaskToken = _0x13ab66;
    knownLeadLookupCache.clear();
  }
  const _0x315103 = new Set();
  const _0x1809b4 = [];
  const _0xc690c5 = new Set(Array.isArray(currentTask?.interactedUsers) ? currentTask.interactedUsers : []);
  for (const _0x72b685 of Array.isArray(_0x3dae37) ? _0x3dae37 : []) {
    for (const _0x97a16 of getLeadAliasKeys(_0x72b685)) {
      if (_0xc690c5.has(_0x97a16) || knownLeadLookupCache.get(_0x97a16) === true) {
        _0x315103.add(_0x97a16);
      } else if (!knownLeadLookupCache.has(_0x97a16)) {
        _0x1809b4.push(_0x97a16);
      }
    }
  }
  const _0xb0c394 = [...new Set(_0x1809b4)];
  if (!_0xb0c394.length) {
    return _0x315103;
  }
  try {
    for (let _0xe9267a = 0; _0xe9267a < _0xb0c394.length; _0xe9267a += 200) {
      const _0x347c62 = _0xb0c394.slice(_0xe9267a, _0xe9267a + 200);
      const _0x28b577 = await ipcRenderer.invoke("check-interacted-user-keys", {
        keys: _0x347c62
      });
      if (!_0x28b577?.complete || !Array.isArray(_0x28b577.matched)) {
        return null;
      }
      const _0x3d259d = new Set(_0x28b577.matched.map(_0x2d5782 => String(_0x2d5782 || "").trim()).filter(Boolean));
      _0x347c62.forEach(_0x484e02 => {
        const _0x518353 = _0x3d259d.has(_0x484e02);
        rememberKnownLeadLookup(_0x484e02, _0x518353);
        if (_0x518353) {
          _0x315103.add(_0x484e02);
        }
      });
    }
    return _0x315103;
  } catch (_0x2f07d2) {
    console.warn("[Built-in-Debug] 历史线索批量去重查询失败，使用任务内兼容数据:", _0x2f07d2?.message || _0x2f07d2);
    return null;
  }
}
function rememberCurrentTaskInteractedKey(_0x341ee2) {
  const _0x2bcc9e = String(_0x341ee2 || "").trim();
  if (!_0x2bcc9e || !currentTask) {
    return false;
  }
  if (!Array.isArray(currentTask.interactedUsers)) {
    currentTask.interactedUsers = [];
  }
  if (!currentTask.interactedUsers.includes(_0x2bcc9e)) {
    currentTask.interactedUsers.push(_0x2bcc9e);
    if (currentTask.interactedUsers.length > KNOWN_LEAD_LOOKUP_CACHE_LIMIT) {
      currentTask.interactedUsers.splice(0, currentTask.interactedUsers.length - KNOWN_LEAD_LOOKUP_CACHE_LIMIT);
    }
    return true;
  }
  return false;
}
function markLeadInSession(_0x355c42) {
  getLeadAliasKeys(_0x355c42).forEach(_0x48d302 => {
    interactedInSession.add(_0x48d302);
    rememberCurrentTaskInteractedKey(_0x48d302);
  });
}
function syncEntryContext(_0x4575dc, _0x350ede, _0x1dbb6d) {
  window._radar_entry_context = {
    videoSource: _0x4575dc,
    searchKeyword: _0x350ede ?? null,
    entryLabel: _0x1dbb6d
  };
}
function applyEntryMetaToLead(_0x1a6188) {
  const _0x371087 = window._radar_entry_context || {};
  if (!_0x1a6188.entrySource && _0x371087.videoSource) {
    _0x1a6188.entrySource = _0x371087.videoSource;
  }
  if (_0x1a6188.searchKeyword === undefined) {
    _0x1a6188.searchKeyword = _0x371087.searchKeyword ?? null;
  }
  if (!_0x1a6188.entryLabel && _0x371087.entryLabel) {
    _0x1a6188.entryLabel = _0x371087.entryLabel;
  }
  leadTouch.ensureLeadMeta(_0x1a6188);
  return _0x1a6188;
}
function summarizeLeadTouchForBlacklist(_0x151633) {
  const _0x8a074f = _0x151633?.touchCounts || {};
  const _0x231d40 = {
    like: "点赞",
    reply: "回复",
    follow: "关注",
    message: "私信",
    profileComment: "首作评论"
  };
  const _0x4e07a6 = Object.keys(_0x231d40).filter(_0xc933f3 => (_0x8a074f[_0xc933f3] || 0) > 0).map(_0x184b3f => _0x231d40[_0x184b3f]);
  if (_0x4e07a6.length) {
    return _0x4e07a6.join("·");
  } else {
    return "已触达";
  }
}
function buildBlacklistEntry(_0x373341, _0x2e5e60) {
  const _0x4bad55 = normalizeUserUrl(_0x373341.userUrl);
  const _0x25b59f = _0x2e5e60.platform === "douyin" ? "DY" : _0x2e5e60.platform;
  return {
    id: _0x4bad55 || _0x373341.nickname,
    nickname: _0x373341.nickname,
    userUrl: _0x373341.userUrl,
    platform: _0x25b59f,
    accountId: _0x2e5e60.accountId || "default",
    accountName: window._radar_account_name || _0x2e5e60?.nickname || _0x2e5e60?.name || "本账号",
    taskName: _0x2e5e60?.taskName || "无",
    timestamp: Date.now(),
    touchSummary: summarizeLeadTouchForBlacklist(_0x373341),
    lastChannel: _0x2e5e60?.isBatchAction ? "线索库批量" : _0x2e5e60?.taskName?.includes("批量") ? "线索库批量" : "自动获客"
  };
}
function recordLeadTouch(_0xec5100, _0x2e6da7, _0x2d9994 = {}) {
  if (!_0xec5100) {
    return;
  }
  const _0x5b4068 = Date.now();
  const _0x1c2f0c = _0x2d9994.accountName || window._radar_account_name || currentTask?.nickname || "主账号";
  if (_0x2e6da7 === "profileComment") {
    if ((_0xec5100.touchCounts?.profileComment || 0) > 0) {
      _0xec5100.actions = _0xec5100.actions || {};
      _0xec5100.actions.profileWorkCommented = true;
      _0xec5100.replied = true;
      _0xec5100.actions.replied = true;
      if (_0x2d9994.content && !_0xec5100.replyContent) {
        _0xec5100.replyContent = _0x2d9994.content;
        _0xec5100.actions.replyContent = _0x2d9994.content;
      }
      return;
    }
    const _0x1b908d = String(_0x2d9994.content || "").trim();
    const _0x52b929 = (_0xec5100.touchLog || []).some(_0x38337e => {
      if (_0x38337e.type !== "profileComment") {
        return false;
      }
      if ((_0x38337e.accountName || "") !== _0x1c2f0c) {
        return false;
      }
      const _0x5b9c9c = _touchEntryAt(_0x38337e);
      return _0x5b9c9c && Math.abs(_0x5b4068 - _0x5b9c9c) < 120000;
    });
    if (_0x52b929) {
      _0xec5100.actions = _0xec5100.actions || {};
      _0xec5100.actions.profileWorkCommented = true;
      _0xec5100.replied = true;
      _0xec5100.actions.replied = true;
      return;
    }
  }
  leadTouch.recordTouchOnLead(_0xec5100, {
    type: _0x2e6da7,
    content: _0x2d9994.content,
    at: _0x2d9994.at || _0x5b4068,
    accountName: _0x1c2f0c,
    success: _0x2d9994.success !== false,
    source: _0x2d9994.source || "acquire"
  });
  _0xec5100.lastTouchAt = _0x2d9994.at || _0x5b4068;
  _0xec5100.actions = _0xec5100.actions || {};
  switch (_0x2e6da7) {
    case "like":
      _0xec5100.liked = true;
      _0xec5100.actions.liked = true;
      break;
    case "reply":
      _0xec5100.replied = true;
      _0xec5100.actions.replied = true;
      if (_0x2d9994.content) {
        _0xec5100.replyContent = _0x2d9994.content;
        _0xec5100.actions.replyContent = _0x2d9994.content;
      }
      break;
    case "follow":
      _0xec5100.followed = true;
      _0xec5100.actions.followed = true;
      break;
    case "message":
      _0xec5100.messaged = true;
      _0xec5100.actions.messaged = true;
      if (_0x2d9994.content) {
        _0xec5100.dmContent = _0x2d9994.content;
        _0xec5100.actions.dmContent = _0x2d9994.content;
      }
      break;
    case "profileComment":
      _0xec5100.replied = true;
      _0xec5100.actions.replied = true;
      _0xec5100.actions.profileWorkCommented = true;
      _0xec5100.profileCommentAt = _0x2d9994.at || _0x5b4068;
      if (_0x2d9994.content) {
        _0xec5100.replyContent = _0x2d9994.content;
        _0xec5100.actions.replyContent = _0x2d9994.content;
      }
      break;
  }
}
function buildTaskFinishedPayload(_0x37f5aa, _0x140b8d = "completed") {
  const _0x6b9121 = Number.isFinite(Number(targetVideoCount)) ? Number(targetVideoCount) : 0;
  const _0x58eb67 = Number.isFinite(Number(sessionProcessedCount)) ? Number(sessionProcessedCount) : 0;
  const _0x391a9a = Number.isFinite(Number(sessionInteractionCount)) ? Number(sessionInteractionCount) : 0;
  const _0x1f9336 = Number.isFinite(Number(sessionInteractionLimit)) && sessionInteractionLimit !== Infinity;
  return {
    taskId: _0x37f5aa,
    accountId: window._radar_account_id || currentTask?.accountId || null,
    reason: _0x140b8d,
    progress: {
      videos: {
        planned: _0x6b9121,
        done: _0x58eb67
      },
      interactions: {
        planned: _0x1f9336 ? Number(sessionInteractionLimit) : null,
        done: _0x391a9a
      }
    }
  };
}
function buildTaskFinishMessage(_0x5a8ba8, _0x1fca68 = {}) {
  const _0x1e23c2 = String(_0x5a8ba8 || "completed");
  switch (_0x1e23c2) {
    case "specific_all_processed":
      return "任务结束：指定视频 " + (_0x1fca68.configuredCount || 0) + " 条已无待处理链接（可能已被其他账号领完，或本轮已全部跳过）";
    case "specific_pool_empty":
      return "任务结束：指定视频抢活池已空（配置 " + (_0x1fca68.configuredCount || 0) + " 条，可能已被其他账号领完）";
    case "specific_empty":
      return "任务结束：未配置指定视频链接";
    case "specific_completed":
      if (_0x1fca68.configuredCount != null) {
        return "任务结束：指定视频已全部处理（" + _0x1fca68.configuredCount + " 条）";
      }
      return "任务结束：指定视频列表已全部处理完毕";
    case "all_sources_completed":
      {
        const _0xc325af = _0x1fca68.viewed ?? sessionProcessedCount ?? 0;
        const _0x2853a9 = _0x1fca68.planned ?? targetVideoCount ?? 0;
        return "任务结束：全部视频入口已完成（本次浏览 " + _0xc325af + "/" + _0x2853a9 + " 个视频）";
      }
    case "interaction_limit_reached":
      {
        const _0x1f7bb3 = _0x1fca68.current ?? sessionInteractionCount ?? 0;
        const _0x2a953d = _0x1fca68.limit ?? sessionInteractionLimit ?? 0;
        return "任务结束：互动总量已达上限（" + _0x1f7bb3 + "/" + _0x2a953d + "），自动停止";
      }
    case "startup_aborted":
      return "任务结束：未启动（" + clipTraceText(_0x1fca68.detail || "配置异常", 80) + "）";
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
function taskFinishLogLevel(_0x1de580) {
  const _0x410847 = new Set(["specific_all_processed", "specific_pool_empty", "specific_empty", "startup_aborted", "interaction_limit_reached", "comment_publish_failed", "like_list_empty", "loop_stopped"]);
  if (_0x410847.has(String(_0x1de580 || ""))) {
    return "warning";
  } else {
    return "normal";
  }
}
async function finalizeAccountTask(_0x559eb0, _0x40a6cd, _0x38b10a = {}, _0x3daa8e = {}) {
  const {
    storageKey = null,
    drainAiQueue = false,
    stopRunning = true
  } = _0x3daa8e;
  const _0x3ea895 = buildTaskFinishMessage(_0x40a6cd, _0x38b10a);
  const _0x2a8367 = taskFinishLogLevel(_0x40a6cd);
  reportCommentFlowTrace("finalizeAccountTask", "reason=" + _0x40a6cd + " stopRunning=" + stopRunning);
  reportTraceLog("🏁 " + _0x3ea895, null, _0x2a8367);
  logTaskDbg("任务结束", _0x3ea895, {
    reason: _0x40a6cd,
    ..._0x38b10a
  });
  if (drainAiQueue && scrapeAiQueue.length > 0) {
    await processScrapeAiQueue();
  }
  if (storageKey) {
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
      const _0x153732 = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (_0x153732.loopId === _0x559eb0) {
        _0x153732.finishedAt = Date.now();
        _0x153732.finishReason = _0x40a6cd;
        localStorage.setItem(storageKey, JSON.stringify(_0x153732));
      }
    } catch (_0x3a0817) {}
  }
  try {
    trimRuntimeMemory(document.body, "task-finished:" + _0x40a6cd);
  } catch (_0x1a70ee) {}
  ipcRenderer.send("automation-data", {
    type: "status",
    payload: {
      accountId: window._radar_account_id,
      status: "finished",
      finishReason: _0x40a6cd,
      finishMessage: _0x3ea895
    }
  });
  if (stopRunning) {
    currentRunningSource = null;
    taskRunning = false;
    allowSpecificReprocess = false;
    syncSpecificVideoPauseWatcher();
  }
  ipcRenderer.send("task-finished", buildTaskFinishedPayload(_0x559eb0, _0x40a6cd));
}
console.log("[Built-in-Debug] !!! 自动化引擎 V5.2：Main World 降维点击版启动 !!!");
const PLATFORM_SELECTORS = {
  "douyin.com": {}
};
let remoteRuntimeConfig = null;
function pickRemoteStringList(_0x56cf11) {
  if (!Array.isArray(_0x56cf11)) {
    return [];
  }
  return _0x56cf11.map(_0x438e73 => String(_0x438e73 || "").trim()).filter(Boolean);
}
function getGatedTextPack(_0x3a0906) {
  const _0x129222 = remoteRuntimeConfig?.gated?.[_0x3a0906];
  return {
    exactTexts: pickRemoteStringList(_0x129222?.exactTexts),
    preferredTexts: pickRemoteStringList(_0x129222?.preferredTexts)
  };
}
function getGatedVariantList(_0x4f82ba) {
  return pickRemoteStringList(remoteRuntimeConfig?.gated?.[_0x4f82ba]);
}
function getGatedString(_0x44ff65) {
  const _0x55527d = remoteRuntimeConfig?.gated?.[_0x44ff65];
  if (typeof _0x55527d === "string" && _0x55527d.trim()) {
    return _0x55527d.trim();
  } else {
    return "";
  }
}
function hasRemoteGatedConfig() {
  return Boolean(remoteRuntimeConfig?.gated);
}
function getCommentV2String(_0x16ce31) {
  const _0x4982ed = remoteRuntimeConfig?.commentV2?.[_0x16ce31];
  if (typeof _0x4982ed === "string" && _0x4982ed.trim()) {
    return _0x4982ed.trim();
  } else {
    return "";
  }
}
function getCommentV2List(_0x9d9d24) {
  return pickRemoteStringList(remoteRuntimeConfig?.commentV2?.[_0x9d9d24]);
}
function getCommentV2Number(_0x1b2643) {
  const _0x5a0afd = remoteRuntimeConfig?.commentV2?.[_0x1b2643];
  const _0x166b9f = Number(_0x5a0afd);
  if (Number.isFinite(_0x166b9f)) {
    return _0x166b9f;
  } else {
    return null;
  }
}
function getVideoEngageV2String(_0x123d6b) {
  const _0x3aa143 = remoteRuntimeConfig?.videoEngageV2?.[_0x123d6b];
  if (typeof _0x3aa143 === "string" && _0x3aa143.trim()) {
    return _0x3aa143.trim();
  } else {
    return "";
  }
}
function getDmV2String(_0x35f79f) {
  const _0x328bb2 = remoteRuntimeConfig?.dmV2?.[_0x35f79f];
  if (typeof _0x328bb2 === "string" && _0x328bb2.trim()) {
    return _0x328bb2.trim();
  } else {
    return "";
  }
}
function getDmV2List(_0x5c7a54) {
  return pickRemoteStringList(remoteRuntimeConfig?.dmV2?.[_0x5c7a54]);
}
const PROFILE_ACTION_RUNTIME_STRING_KEYS = ["profileFollowBtn", "profileMessageBtn", "profileName"];
const DM_RUNTIME_REQUIRED_STRING_KEYS = [...PROFILE_ACTION_RUNTIME_STRING_KEYS, "dmInput", "dmSendBtn", "dmSendPrimary", "dmExplicitSendSvg", "dmDialog", "dmInputHint", "dmSendSvgCandidates", "dmSendClickableRoot", "dmSendTextCandidates", "conversationItem", "conversationTitle", "conversationPreview", "conversationUnread", "conversationAvatar", "conversationAvatarRoot", "dmBlockActiveRoots", "dmBlockNodeCandidates", "dmBlockGlobalHints", "dmMessageItems", "dmHistoryMessageItems", "dmMessageContainer", "dmFailureCandidates", "dmFailureIconInner", "groupRowHints", "groupAvatarImages", "conversationHeader"];
function hasProfileActionRuntimeReady() {
  if (!PROFILE_ACTION_RUNTIME_STRING_KEYS.every(_0x1a4451 => !!getDmV2String(_0x1a4451))) {
    return false;
  }
  const _0x4d0fa0 = ["profileReadyPattern", "actionButtonCandidates", "actionClickableRoot", "profilePositiveContextPattern", "profileRejectContextPattern", "profileRejectOverlaySelector", "profileRejectNoticeSelector"];
  if (!_0x4d0fa0.every(_0x595691 => !!getGatedString(_0x595691))) {
    return false;
  }
  return getGatedTextPack("profileFollow").exactTexts.length > 0 && getGatedTextPack("profileMessage").exactTexts.length > 0;
}
function hasDmRuntimeReady() {
  if (!hasProfileActionRuntimeReady()) {
    return false;
  }
  if (!DM_RUNTIME_REQUIRED_STRING_KEYS.every(_0x46d651 => !!getDmV2String(_0x46d651))) {
    return false;
  }
  return getDmV2List("strangerFolderTexts").length > 0 && getDmV2List("sendExactTexts").length > 0 && getDmV2List("sendSvgHints").length > 0 && getGatedTextPack("dmSend").exactTexts.length > 0;
}
function getVideoEngagePack() {
  const _0x55da1f = remoteRuntimeConfig?.videoEngageV2;
  if (_0x55da1f && typeof _0x55da1f === "object") {
    return _0x55da1f;
  } else {
    return null;
  }
}
function hasVideoEngageRuntimeReady() {
  const _0x1fd8f1 = getVideoEngagePack();
  if (!_0x1fd8f1) {
    return false;
  }
  const _0x37f47f = getVideoEngageV2String("likeSelectors");
  const _0x496c13 = getVideoEngageV2String("collectSelectors");
  const _0xb0aaf6 = getVideoEngageV2String("shareSelectors");
  return !!_0x37f47f || !!_0x496c13 || !!_0xb0aaf6;
}
const COMMENT_RUNTIME_REQUIRED_STRING_KEYS = ["commentInput", "openCommentBtns", "commentPanel", "emojiPanel", "emojiTrigger", "emojiStickerItems", "emojiItemCandidates", "emojiStickerClickableRoot", "emojiStickerInteractiveRoot", "emojiStickerSourcePattern", "emojiTextSourcePattern", "emojiTextTokenPattern", "emojiComposerPayload", "emojiTabContainerCandidates", "emojiTabTextCandidates", "emojiTabDebugCandidates", "emojiTabPositivePattern", "emojiTabRejectPattern", "emojiPanelRejectSelector", "commentFloatingChrome", "commentComposerChrome", "commentStickerImageSelector", "commentStickerAltPattern", "commentAvatarImagePattern"];
function hasCommentRuntimeReady() {
  if (!hasRemoteGatedConfig()) {
    return false;
  }
  if (!COMMENT_RUNTIME_REQUIRED_STRING_KEYS.every(_0x1b6903 => !!getCommentV2String(_0x1b6903))) {
    return false;
  }
  return ["emojiStickerMinImageSide", "emojiStickerMinFillRatio", "emojiTabProbeTimeoutMs"].every(_0x4a67a3 => Number(getCommentV2Number(_0x4a67a3)) > 0);
}
function matchesPlaceholderHint(_0x239662) {
  const _0x3b300b = getCommentV2List("placeholderHints");
  if (!_0x3b300b.length) {
    return false;
  }
  const _0x2eabfe = String(_0x239662 || "");
  return _0x3b300b.some(_0x102bdb => _0x2eabfe.includes(_0x102bdb));
}
function isReplyBtnText(_0x3fe793) {
  const _0x38d6ce = getCommentV2List("replyBtnTexts");
  if (!_0x38d6ce.length) {
    return false;
  }
  const _0x2a3639 = String(_0x3fe793 || "").replace(/\s+/g, " ").trim();
  return _0x38d6ce.includes(_0x2a3639);
}
function getCommentTabPrefix() {
  return getCommentV2String("commentTabPrefix");
}
function applyRemoteRuntimeConfig(_0x582742) {
  if (!_0x582742 || typeof _0x582742 !== "object") {
    return;
  }
  remoteRuntimeConfig = _0x582742;
  const _0x1da077 = PLATFORM_SELECTORS["douyin.com"];
  const _0x25e503 = new Set(PROFILE_ACTION_RUNTIME_STRING_KEYS.concat(["dmInput", "dmSendBtn"]));
  for (const _0x3b68e6 of _0x25e503) {
    delete _0x1da077[_0x3b68e6];
  }
  const _0xbf2ff1 = _0x582742.selectors?.["douyin.com"];
  if (_0xbf2ff1 && typeof _0xbf2ff1 === "object") {
    for (const [_0x5e2947, _0x272b50] of Object.entries(_0xbf2ff1)) {
      if (_0x25e503.has(_0x5e2947)) {
        continue;
      }
      if (typeof _0x272b50 === "string" && _0x272b50.trim()) {
        _0x1da077[_0x5e2947] = _0x272b50.trim();
      }
    }
  }
  const _0x2f524f = getCommentV2String("commentPanel");
  const _0x283c30 = getCommentV2String("commentItem");
  const _0x23e971 = getCommentV2String("openCommentBtns");
  if (_0x2f524f) {
    _0x1da077.commentPanel = _0x2f524f;
  }
  if (_0x283c30) {
    _0x1da077.commentItem = _0x283c30;
  }
  if (_0x23e971) {
    _0x1da077.commentBtn = _0x23e971;
  }
  for (const _0x3ff633 of _0x25e503) {
    const _0x199e4d = getDmV2String(_0x3ff633);
    if (_0x199e4d) {
      _0x1da077[_0x3ff633] = _0x199e4d;
    }
  }
  const _0x52bf7c = _0x582742.urls && typeof _0x582742.urls === "object" ? Object.keys(_0x582742.urls).length : 0;
  const _0x458017 = _0x582742.apiHooks && typeof _0x582742.apiHooks === "object" ? Object.keys(_0x582742.apiHooks).length : 0;
  console.log("[Built-in-Debug] [RuntimeConfig] 已应用 version=" + (_0x582742.version || "-") + (" commentV2=" + (hasCommentRuntimeReady() ? "ready" : "missing")) + (" videoEngageV2=" + (hasVideoEngageRuntimeReady() ? "ready" : "missing")) + (" profileActions=" + (hasProfileActionRuntimeReady() ? "ready" : "missing")) + (" dmV2=" + (hasDmRuntimeReady() ? "ready" : "missing")) + (" urls=" + _0x52bf7c + " apiHooks=" + _0x458017));
}
ipcRenderer.on("apply-runtime-config", (_0x5ef109, _0x2e914d) => {
  try {
    applyRemoteRuntimeConfig(_0x2e914d);
  } catch (_0x4913b4) {
    console.warn("[Built-in-Debug] [RuntimeConfig] 应用失败，gated 文案不可用:", _0x4913b4?.message || _0x4913b4);
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
function buildDouyinSearchUrl(_0x36f0b0) {
  return resolveDouyinSearchUrl(_0x36f0b0, getRuntimeUrls());
}
function getSearchZeroCardRecoveryKey(_0x3ba160, _0x38445e) {
  return "radar_search_zero_cards_" + String(_0x3ba160 || "unknown") + "_" + encodeURIComponent(String(_0x38445e || "").trim());
}
function readSearchZeroCardRecoveryState(_0x538821, _0x3182ac) {
  const _0x3d73f5 = getSearchZeroCardRecoveryKey(_0x538821, _0x3182ac);
  try {
    const _0x432ec3 = JSON.parse(sessionStorage.getItem(_0x3d73f5) || "{}");
    if (!_0x432ec3.updatedAt || Date.now() - Number(_0x432ec3.updatedAt) > SEARCH_ZERO_CARD_STATE_TTL_MS) {
      sessionStorage.removeItem(_0x3d73f5);
      return {
        scans: 0,
        reloads: 0,
        emptyConfirmations: 0,
        exhausted: false
      };
    }
    return {
      scans: Math.max(0, Number(_0x432ec3.scans) || 0),
      reloads: Math.max(0, Number(_0x432ec3.reloads) || 0),
      emptyConfirmations: Math.max(0, Number(_0x432ec3.emptyConfirmations) || 0),
      exhausted: _0x432ec3.exhausted === true
    };
  } catch (_0x3462e2) {
    return {
      scans: 0,
      reloads: 0,
      emptyConfirmations: 0,
      exhausted: false
    };
  }
}
function saveSearchZeroCardRecoveryState(_0x18cb69, _0x3c6750, _0x214b69) {
  try {
    sessionStorage.setItem(getSearchZeroCardRecoveryKey(_0x18cb69, _0x3c6750), JSON.stringify({
      scans: Math.max(0, Number(_0x214b69?.scans) || 0),
      reloads: Math.max(0, Number(_0x214b69?.reloads) || 0),
      emptyConfirmations: Math.max(0, Number(_0x214b69?.emptyConfirmations) || 0),
      exhausted: _0x214b69?.exhausted === true,
      updatedAt: Date.now()
    }));
  } catch (_0x4c5024) {}
}
function clearSearchZeroCardRecoveryState(_0x1ad981, _0xe5cda4) {
  try {
    sessionStorage.removeItem(getSearchZeroCardRecoveryKey(_0x1ad981, _0xe5cda4));
  } catch (_0x1ccaa9) {}
}
function clearSearchZeroCardRecoveryStatesForLoop(_0x8b8a3c) {
  const _0x9a9140 = "radar_search_zero_cards_" + String(_0x8b8a3c || "unknown") + "_";
  try {
    const _0x470c27 = [];
    for (let _0x4ba545 = 0; _0x4ba545 < sessionStorage.length; _0x4ba545 += 1) {
      const _0x29d500 = sessionStorage.key(_0x4ba545);
      if (_0x29d500?.startsWith(_0x9a9140)) {
        _0x470c27.push(_0x29d500);
      }
    }
    _0x470c27.forEach(_0x34db2d => sessionStorage.removeItem(_0x34db2d));
  } catch (_0x58ab43) {}
}
function isCurrentTaskUsingProxy(_0x3baf65 = currentTask) {
  const _0x27390c = _0x3baf65?.proxy;
  if (typeof _0x27390c === "string") {
    return _0x27390c.trim().length > 0;
  }
  if (!_0x27390c || typeof _0x27390c !== "object") {
    return false;
  }
  return _0x27390c.enabled === true && String(_0x27390c.host || "").trim().length > 0 && Number(_0x27390c.port) > 0;
}
function getDouyinSearchZeroCardWaitBudgetMs() {
  return SEARCH_ZERO_CARD_NETWORK_WAIT_MS;
}
function getDouyinSearchRenderableContentCounts() {
  const _0x439ee9 = Array.from(document.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"]")).filter(isVisibleElement).length;
  const _0x50c170 = collectDouyinSearchResultCards().filter(_0x415b87 => !!findDouyinSearchCardContentId(_0x415b87)).length;
  return {
    visibleLinks: _0x439ee9,
    contentCards: _0x50c170
  };
}
async function waitForDouyinSearchContentAfterZero(_0x5d664b, _0x59fbbb) {
  const _0x8f25eb = isCurrentTaskUsingProxy();
  const _0x2694bf = getDouyinSearchZeroCardWaitBudgetMs();
  const _0x33ddb4 = Date.now();
  let _0x595f68 = 0;
  const _0x42c664 = getSearchPageReadyModule();
  const _0x12fd36 = getSearchApiReadyTracker();
  const _0x54547e = _0x12fd36.getGeneration();
  const _0x376470 = typeof _0x42c664?.pickRenderSettleMs === "function" ? _0x42c664.pickRenderSettleMs() : 4000;
  let _0x50ad93 = 0;
  while (Date.now() - _0x33ddb4 < _0x2694bf) {
    if (shouldAbort(_0x5d664b)) {
      return {
        ready: false,
        aborted: true,
        diagnostics: null
      };
    }
    const _0x5f5ad9 = typeof isDouyinSearchPageContentLoading === "function" && isDouyinSearchPageContentLoading();
    const _0x161c86 = getDouyinSearchRenderableContentCounts();
    const _0x102848 = getDouyinSearchZeroDiagnostics({
      standardLinkCount: _0x161c86.visibleLinks,
      customCardCount: _0x161c86.contentCards
    });
    const _0x19f0ca = _0x12fd36.hasFreshResults(_0x54547e);
    if (_0x19f0ca && !_0x50ad93) {
      _0x50ad93 = _0x12fd36.getSignal()?.at || Date.now();
      console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (_0x59fbbb || "-") + " 搜索 API 已回报 " + ("awemes=" + (_0x12fd36.getSignal()?.awemeCount || 0) + "，进入渲染缓冲 " + _0x376470 + "ms"));
      try {
        reportCurrentAction("搜索接口已返回，等待页面渲染约 " + Math.ceil(_0x376470 / 1000) + " 秒…");
      } catch (_0x21d451) {}
    }
    const _0x2d7fc0 = typeof _0x42c664?.evaluateSearchSlowNetTick === "function" ? _0x42c664.evaluateSearchSlowNetTick({
      pageLoading: _0x5f5ad9,
      domVisibleLinks: _0x161c86.visibleLinks,
      domContentCards: _0x161c86.contentCards,
      loginGate: !!_0x102848.loginGate,
      emptyResult: !!_0x102848.emptyResult,
      apiHasResults: _0x19f0ca,
      apiReadyAt: _0x50ad93,
      settleMs: _0x376470,
      now: Date.now()
    }) : null;
    if (!_0x2d7fc0) {
      if (_0x5f5ad9) {
        if (Date.now() - _0x595f68 >= 4000) {
          _0x595f68 = Date.now();
          try {
            reportCurrentAction("检测到「加载中」，等待搜索结果加载完成…");
          } catch (_0x20770f) {}
        }
        await sleep(SEARCH_ZERO_CARD_POLL_MS);
        continue;
      }
      if (_0x161c86.visibleLinks > 0 || _0x161c86.contentCards > 0) {
        return {
          ready: true,
          aborted: false,
          diagnostics: null,
          waitedMs: Date.now() - _0x33ddb4,
          counts: _0x161c86
        };
      }
      if (_0x102848.loginGate || _0x102848.emptyResult) {
        return {
          ready: false,
          aborted: false,
          diagnostics: _0x102848,
          waitedMs: Date.now() - _0x33ddb4,
          counts: _0x161c86
        };
      }
      await sleep(SEARCH_ZERO_CARD_POLL_MS);
      continue;
    }
    if (_0x2d7fc0.action === "wait_loading") {
      if (Date.now() - _0x595f68 >= 4000) {
        _0x595f68 = Date.now();
        console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (_0x59fbbb || "-") + " 仍显示「加载中」 " + ("elapsed=" + (Date.now() - _0x33ddb4) + "/" + _0x2694bf + "ms"));
        try {
          reportCurrentAction("检测到「加载中」，等待搜索结果加载完成…");
        } catch (_0x542051) {}
      }
      await sleep(SEARCH_ZERO_CARD_POLL_MS);
      continue;
    }
    if (_0x2d7fc0.ready) {
      return {
        ready: true,
        aborted: false,
        diagnostics: null,
        waitedMs: Date.now() - _0x33ddb4,
        counts: _0x161c86,
        via: _0x2d7fc0.action
      };
    }
    if (_0x2d7fc0.action === "login_gate" || _0x2d7fc0.action === "empty") {
      return {
        ready: false,
        aborted: false,
        diagnostics: _0x102848,
        waitedMs: Date.now() - _0x33ddb4,
        counts: _0x161c86
      };
    }
    if (_0x2d7fc0.action === "settle_render") {
      if (Date.now() - _0x595f68 >= 2000) {
        _0x595f68 = Date.now();
        try {
          reportCurrentAction("搜索结果渲染中，约 " + Math.ceil((_0x2d7fc0.settleRemainingMs || 0) / 1000) + " 秒…");
        } catch (_0x304f8d) {}
      }
      await sleep(Math.min(SEARCH_ZERO_CARD_POLL_MS, Math.max(200, _0x2d7fc0.settleRemainingMs || SEARCH_ZERO_CARD_POLL_MS)));
      continue;
    }
    if (Date.now() - _0x595f68 >= 5000) {
      _0x595f68 = Date.now();
      console.log("[Built-in-Debug] [搜索慢网等待] keyword=" + (_0x59fbbb || "-") + " " + ("proxy=" + _0x8f25eb + " action=" + _0x2d7fc0.action + " ") + ("elapsed=" + (Date.now() - _0x33ddb4) + "/" + _0x2694bf + "ms"));
    }
    await sleep(SEARCH_ZERO_CARD_POLL_MS);
  }
  const _0x44739c = getDouyinSearchRenderableContentCounts();
  const _0x590b6c = _0x12fd36.hasFreshResults(_0x54547e);
  return {
    ready: _0x44739c.visibleLinks > 0 || _0x44739c.contentCards > 0 || _0x590b6c,
    aborted: false,
    diagnostics: getDouyinSearchZeroDiagnostics({
      standardLinkCount: _0x44739c.visibleLinks,
      customCardCount: _0x44739c.contentCards
    }),
    waitedMs: Date.now() - _0x33ddb4,
    counts: _0x44739c,
    via: _0x590b6c ? "api_timeout_fallback" : "timeout"
  };
}
function resetSearchCardOpenFailureState() {
  searchCardOpenFailures.clear();
  searchCardOpenFailureStreak = 0;
}
function pruneSearchCardOpenFailures(_0x1a96d8 = Date.now()) {
  for (const [_0x1fed10, _0x53aae6] of searchCardOpenFailures.entries()) {
    if (!_0x53aae6?.expiresAt || _0x53aae6.expiresAt <= _0x1a96d8) {
      searchCardOpenFailures.delete(_0x1fed10);
    }
  }
}
function getSearchCardOpenFailureState(_0x233194) {
  const _0xddb945 = normalizeUrl(_0x233194);
  if (!_0xddb945) {
    return null;
  }
  pruneSearchCardOpenFailures();
  return searchCardOpenFailures.get(_0xddb945) || null;
}
function shouldSkipSearchCardAfterOpenFailures(_0x42e776) {
  const _0x501695 = getSearchCardOpenFailureState(_0x42e776);
  return (_0x501695?.count || 0) >= SEARCH_CARD_OPEN_FAILURE_SKIP_AFTER;
}
function rememberSearchCardOpenFailure(_0x3f90f7, _0x242eee = "detail-timeout") {
  const _0x27cd76 = normalizeUrl(_0x3f90f7);
  if (!_0x27cd76) {
    return 0;
  }
  const _0x5ddc28 = Date.now();
  pruneSearchCardOpenFailures(_0x5ddc28);
  const _0x5a7ba0 = searchCardOpenFailures.get(_0x27cd76) || {};
  const _0x691bd3 = (_0x5a7ba0.count || 0) + 1;
  searchCardOpenFailures.set(_0x27cd76, {
    count: _0x691bd3,
    reason: _0x242eee,
    lastAt: _0x5ddc28,
    expiresAt: _0x5ddc28 + SEARCH_CARD_OPEN_FAILURE_TTL_MS
  });
  searchCardOpenFailureStreak += 1;
  return _0x691bd3;
}
function rememberSearchCardOpenSuccess(_0x3bab09) {
  const _0x3c0aa1 = normalizeUrl(_0x3bab09);
  if (_0x3c0aa1) {
    searchCardOpenFailures.delete(_0x3c0aa1);
  }
  searchCardOpenFailureStreak = 0;
}
async function reloadCurrentSearchPageAfterOpenFailures(_0x5b4791, _0xfd24c5, _0x4f7d2a = "搜索结果打开失败") {
  const _0x595ab9 = buildDouyinSearchUrl(_0xfd24c5);
  console.warn("[Built-in-Debug] [搜索页自愈] " + _0x4f7d2a + "，重载当前关键词搜索页: " + _0xfd24c5);
  reportCurrentAction("搜索结果页面异常，正在重新加载当前关键词...");
  reportTraceLog("⚠️ 搜索页自愈：" + _0x4f7d2a + "，重新加载「" + (_0xfd24c5 || "当前关键词") + "」", null, "warning");
  clearPendingLeadVideoUrl();
  resetSearchCardOpenFailureState();
  prepareSearchPageReload(_0x5b4791, _0xfd24c5, _0x4f7d2a);
  window.location.href = _0x595ab9;
  await randomDelay(4500, 7000, _0x5b4791, "重载搜索页");
}
function isDouyinSearchVideoTabUrl(_0x90d5f = window.location.href) {
  try {
    const _0x4117b3 = new URL(_0x90d5f);
    return _0x4117b3.hostname.includes("douyin.com") && _0x4117b3.pathname.includes("/search/") && _0x4117b3.searchParams.get("type") === "video";
  } catch (_0x5699ff) {
    return /douyin\.com\/search\/.+[?&]type=video/.test(String(_0x90d5f || ""));
  }
}
function isOnDouyinRecommendPage(_0x24c59f = window.location.href) {
  try {
    const _0x3062fa = new URL(_0x24c59f);
    if (!_0x3062fa.hostname.includes("douyin.com")) {
      return false;
    }
    if (_0x3062fa.pathname.includes("/jingxuan")) {
      return false;
    }
    if (/[?&]recommend=1/.test(_0x3062fa.search) && (_0x3062fa.pathname === "/" || _0x3062fa.pathname === "")) {
      return true;
    }
    if (typeof document !== "undefined") {
      const _0x3740fe = document.querySelector(".tab-recommend.OzCCrM8C, .tab-recommend.OL5JF59M, .tab-recommend.Zalb4HfP");
      if (_0x3740fe && !window.location.pathname.includes("/jingxuan")) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
async function ensureDouyinRecommendFeed(_0x254386) {
  if (isOnDouyinRecommendPage()) {
    return true;
  }
  const _0x579761 = document.querySelector("a[href*=\"recommend=1\"]");
  if (_0x579761 && isVisibleElement(_0x579761)) {
    console.log("[Built-in-Debug] [导航] 尝试点击侧栏「推荐」Tab...");
    reportCurrentAction("正在切换到推荐页...");
    await simulateHumanClick(_0x579761, _0x254386);
    await randomDelay(3500, 5500, _0x254386, "切换推荐页");
    if (isOnDouyinRecommendPage()) {
      return true;
    }
  }
  console.log("[Built-in-Debug] [导航] 侧栏切换未生效，强制 load 推荐流 URL:", getDouyinRecommendUrl());
  window.location.href = getDouyinRecommendUrl();
  return false;
}
async function reloadCurrentFeedSource(_0x2cb13f, _0x4b82db) {
  const _0x23e11c = _0x4b82db === "follow" ? "关注列表" : "推荐页";
  const _0xdd16ba = _0x4b82db === "follow" ? getDouyinFollowUrl() : getDouyinRecommendUrl();
  console.warn("[Built-in-Debug] [导航] 连续卡在已处理视频，重新进入" + _0x23e11c);
  reportCurrentAction("列表滑动受阻，正在重新进入" + _0x23e11c + "...");
  window.location.href = _0xdd16ba;
  await randomDelay(4500, 7000, _0x2cb13f, "刷新列表");
}
async function reloadRecommendFeedAfterSwitchStall(_0x8e846a) {
  console.warn("[Built-in-Debug] [导航] 推荐页视频切换连续未响应，重新进入推荐页");
  reportCurrentAction("推荐页切换受阻，正在刷新推荐页继续浏览...");
  suspendAutomationForNavigation();
  window.location.href = getDouyinRecommendUrl();
  await randomDelay(4500, 7000, _0x8e846a, "刷新推荐页");
}
function isOnDouyinSearchPage(_0x2e456d = window.location.href) {
  try {
    const _0x25a966 = new URL(_0x2e456d);
    return _0x25a966.hostname.includes("douyin.com") && _0x25a966.pathname.includes("/search/");
  } catch (_0x32bccc) {
    return String(_0x2e456d || "").includes("/search/");
  }
}
function isOnDouyinFollowPage(_0xef63c0 = window.location.href) {
  try {
    const _0x5f32b2 = new URL(_0xef63c0);
    return _0x5f32b2.hostname.includes("douyin.com") && _0x5f32b2.pathname.includes("/follow");
  } catch (_0x47706f) {
    return String(_0xef63c0 || "").includes("/follow");
  }
}
function markDouyinLikeEntryNavigation() {
  try {
    sessionStorage.setItem(DOUYIN_LIKE_ENTRY_NAV_KEY, String(Date.now()));
  } catch (_0x5c9cd5) {}
}
function hasRecentDouyinLikeEntryNavigation() {
  try {
    const _0x3f8596 = Number(sessionStorage.getItem(DOUYIN_LIKE_ENTRY_NAV_KEY) || 0);
    return _0x3f8596 > 0 && Date.now() - _0x3f8596 < DOUYIN_LIKE_ENTRY_NAV_TTL_MS;
  } catch (_0x123f6c) {
    return false;
  }
}
function navigateToDouyinLikeEntry() {
  markDouyinLikeEntryNavigation();
  window.location.href = getDouyinLikeEntryUrl();
}
function findLikeTabElement() {
  const _0x5c07a5 = Array.from(document.querySelectorAll("[role=\"tab\"], button, a, div, span, p"));
  const _0x42a2bc = _0x5c07a5.find(_0xb6fd98 => {
    if (!isVisibleElement(_0xb6fd98) || _0xb6fd98.children.length > 8) {
      return false;
    }
    const _0x2c7595 = (_0xb6fd98.innerText || "").trim().replace(/\s+/g, "");
    return _0x2c7595.startsWith("喜欢") && _0x2c7595.length <= 10;
  });
  return _0x42a2bc?.closest?.("[role=\"tab\"], button, a") || _0x42a2bc || null;
}
function isLikeTabActive(_0x3e2f8e) {
  if (!_0x3e2f8e) {
    return false;
  }
  const _0x9ebead = [];
  let _0x63e76d = _0x3e2f8e;
  for (let _0x2c9a3d = 0; _0x63e76d && _0x2c9a3d < 4; _0x2c9a3d += 1) {
    _0x9ebead.push(_0x63e76d);
    _0x63e76d = _0x63e76d.parentElement;
  }
  return _0x9ebead.some(_0xe8cdde => {
    const _0x533b9d = String(_0xe8cdde.className || "");
    return _0xe8cdde.classList?.contains("active") || _0xe8cdde.getAttribute("aria-selected") === "true" || _0xe8cdde.getAttribute("data-active") === "true" || _0xe8cdde.getAttribute("data-selected") === "true" || /active|selected|current/i.test(_0x533b9d);
  });
}
function getDouyinLikeEntryState(_0x46d73c = window.location.href) {
  const _0x45bc2b = {
    onUser: false,
    hasShowTab: false,
    recentNavigation: hasRecentDouyinLikeEntryNavigation(),
    tabFound: false,
    tabActive: false,
    ready: false
  };
  try {
    const _0x561546 = new URL(_0x46d73c);
    _0x45bc2b.onUser = _0x561546.hostname.includes("douyin.com") && _0x561546.pathname.includes("/user/");
    _0x45bc2b.hasShowTab = _0x561546.searchParams.get("showTab") === "like";
  } catch (_0x31527f) {
    const _0x5d8634 = String(_0x46d73c || "");
    _0x45bc2b.onUser = _0x5d8634.includes("/user/");
    _0x45bc2b.hasShowTab = _0x5d8634.includes("showTab=like");
  }
  const _0x1d8111 = typeof document !== "undefined" ? findLikeTabElement() : null;
  _0x45bc2b.tabFound = !!_0x1d8111;
  _0x45bc2b.tabActive = isLikeTabActive(_0x1d8111);
  _0x45bc2b.ready = _0x45bc2b.onUser && (_0x45bc2b.hasShowTab || _0x45bc2b.recentNavigation || _0x45bc2b.tabActive);
  return _0x45bc2b;
}
function isOnDouyinLikeEntryPage(_0x198e2a = window.location.href) {
  return getDouyinLikeEntryState(_0x198e2a).ready;
}
async function ensureCurrentSourcePage(_0x3e17d3, _0x1764c1) {
  const _0x547c93 = window.location.href;
  const _0x313fbb = isViewingDouyinVideoPage(_0x547c93);
  if (_0x1764c1 === "recommend") {
    if (isDouyinFullLivePage(_0x547c93) && !isDouyinFeedInlineContext()) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务误入直播间，返回推荐流");
      reportCurrentAction("检测到直播间页面，正在返回推荐页...");
      await ensureDouyinRecommendFeed(_0x3e17d3);
      await randomDelay(3500, 5500, _0x3e17d3, "离开直播间");
      return false;
    }
    if (isOnDouyinSearchPage(_0x547c93)) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务却落在搜索页，拉回推荐流");
      reportCurrentAction("检测到误入搜索页，正在返回推荐页...");
      window.location.href = getDouyinRecommendUrl();
      await randomDelay(4000, 6500, _0x3e17d3, "返回推荐页");
      return false;
    }
    if (_0x547c93.includes("/jingxuan") && !_0x313fbb) {
      console.warn("[Built-in-Debug] [导航纠正] 推荐入口任务落在精选页，拉回推荐流");
      reportCurrentAction("检测到误入精选页，正在返回推荐页...");
      window.location.href = getDouyinRecommendUrl();
      await randomDelay(4000, 6500, _0x3e17d3, "返回推荐页");
      return false;
    }
    if (!isOnDouyinRecommendPage(_0x547c93) && !_0x313fbb) {
      const _0x113499 = await ensureDouyinRecommendFeed(_0x3e17d3);
      if (!_0x113499) {
        await randomDelay(3500, 5500, _0x3e17d3, "进入推荐页");
      }
      return isOnDouyinRecommendPage();
    }
  } else if (_0x1764c1 === "follow") {
    if (!isOnDouyinFollowPage(_0x547c93) && !_0x313fbb) {
      console.warn("[Built-in-Debug] [导航纠正] 关注入口任务不在关注页，正在跳转");
      reportCurrentAction("正在进入关注列表...");
      window.location.href = "https://www.douyin.com/follow";
      await randomDelay(4000, 6500, _0x3e17d3, "进入关注页");
      return false;
    }
  } else if (_0x1764c1 === "like") {
    const _0x1156d1 = _0x547c93.includes("/user/");
    if (!_0x1156d1 && !_0x313fbb) {
      console.warn("[Built-in-Debug] [导航纠正] 喜欢列表任务不在个人主页，正在跳转");
      reportCurrentAction("正在进入个人喜欢列表...");
      navigateToDouyinLikeEntry();
      await randomDelay(4000, 6500, _0x3e17d3, "进入喜欢列表页");
      return false;
    }
    if (_0x1156d1 && !_0x313fbb) {
      const _0x1e55b2 = await ensureLikeTabActive(_0x3e17d3);
      if (_0x1e55b2) {
        return false;
      }
    }
  } else if (_0x1764c1 === "specific") {
    const _0x3e0974 = window._specificVideoUrls || getSpecificVideoUrlList(currentTask);
    const _0x3ca676 = extractSpecificVideoId(_0x547c93);
    if (_0x3ca676 && _0x3e0974.some(_0x57535b => extractSpecificVideoId(_0x57535b) === _0x3ca676)) {
      if (_0x547c93.includes("modal_id=") || _0x547c93.includes("/jingxuan")) {
        return true;
      }
      if (_0x547c93.includes("/video/") || _0x547c93.includes("/note/")) {
        const _0x1e2ab9 = getSpecificVideoProbeState(_0x3ca676);
        if (_0x1e2ab9?.probing) {
          return true;
        }
        logTaskDbg("导航纠正", "指定视频 " + _0x3ca676 + "：独立播放页 → jingxuan modal");
        reportCurrentAction("正在优化页面布局...");
        window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + _0x3ca676;
        await randomDelay(4000, 6500, _0x3e17d3, "切换到 modal 布局");
        return false;
      }
      return true;
    }
    const _0x2b8ece = extractVideoIdFromHref(_0x547c93);
    if (_0x2b8ece && (_0x547c93.includes("/video/") || _0x547c93.includes("/note/"))) {
      const _0xfb6162 = getSpecificVideoProbeState(_0x2b8ece);
      if (_0xfb6162?.probing) {
        return true;
      }
      logTaskDbg("导航纠正", "指定视频 " + _0x2b8ece + "：独立播放页 → jingxuan modal");
      reportCurrentAction("正在优化页面布局...");
      window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + _0x2b8ece;
      await randomDelay(4000, 6500, _0x3e17d3, "切换到 modal 布局");
      return false;
    }
  }
  return true;
}
function isViewingDouyinVideoPage(_0xfa31e0 = window.location.href) {
  if (_0xfa31e0.includes("/video/") || _0xfa31e0.includes("/note/")) {
    return true;
  }
  if (String(_0xfa31e0 || "").includes("/search/")) {
    try {
      return !!resolveDouyinVideoDetailModal({
        includeFeed: false
      });
    } catch (_0x36f127) {
      return false;
    }
  }
  if (_0xfa31e0.includes("modal_id=")) {
    return true;
  }
  try {
    return !!resolveDouyinVideoDetailModal({
      includeFeed: false
    });
  } catch (_0x5ce59f) {
    return false;
  }
}
function normalizeProfileUrlForReturn(_0xef06d7) {
  if (!_0xef06d7 || typeof _0xef06d7 !== "string") {
    return "";
  }
  try {
    const _0xc11133 = new URL(_0xef06d7.startsWith("http") ? _0xef06d7 : "https://www.douyin.com" + (_0xef06d7.startsWith("/") ? _0xef06d7 : "/" + _0xef06d7));
    _0xc11133.searchParams.delete("modal_id");
    _0xc11133.searchParams.delete("vid");
    _0xc11133.searchParams.delete("aweme_id");
    _0xc11133.searchParams.set("from_tab_name", "main");
    return _0xc11133.toString();
  } catch (_0x249838) {
    const _0x319afa = _0xef06d7.split("#")[0].split("?")[0];
    if (_0x319afa.includes("from_tab_name=")) {
      return _0x319afa;
    } else {
      return _0x319afa + "?from_tab_name=main";
    }
  }
}
function persistSubviewTaskForResume(_0x5280e7, _0x3a1736 = {}) {
  if (!_0x5280e7 || !_0x5280e7.lead) {
    return false;
  }
  try {
    localStorage.setItem("radar_pending_subview_task", JSON.stringify({
      ..._0x5280e7,
      ..._0x3a1736,
      createdAt: Date.now()
    }));
    safeSessionSet("radar_is_interaction_view", "true");
    if (_0x5280e7.viewKey) {
      safeSessionSet("radar_view_key", _0x5280e7.viewKey);
    }
    return true;
  } catch (_0x2edd8b) {
    console.warn("[子视图] 保存续跑任务失败:", _0x2edd8b.message);
    return false;
  }
}
function clearPendingSubviewTask() {
  try {
    localStorage.removeItem("radar_pending_subview_task");
  } catch (_0x3345cc) {}
}
async function restoreProfileAfterWarmup(_0x1a5c4f, _0x5b0598, _0x238729 = "预热结束", _0x3d8e12 = null) {
  const _0x1deb4e = normalizeProfileUrlForReturn(_0x1a5c4f?.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
  await closeAllModals(_0x5b0598);
  await sleep(800);
  const _0x164d5d = window.location.href;
  const _0x4e72f2 = Boolean(_0x1deb4e && (isViewingDouyinVideoPage(_0x164d5d) || !_0x164d5d.includes("/user/") || !findSmartElementQuiet("profileMessageBtn") && !findSmartElementQuiet("profileFollowBtn")));
  if (_0x4e72f2) {
    console.log("[节奏控制] " + _0x238729 + "后恢复用户主页: " + _0x1deb4e);
    reportCurrentAction(_0x238729 + "：正在返回用户主页...", _0x1a5c4f?.accountId);
    if (_0x3d8e12) {
      persistSubviewTaskForResume(_0x3d8e12, {
        __warmupRestored: true,
        enableWarmup: false
      });
    }
    window.location.href = _0x1deb4e;
    return true;
  }
  return false;
}
async function ensureLikeTabActive(_0x304fcc) {
  const _0x14e98c = findLikeTabElement();
  if (!_0x14e98c) {
    window._radar_like_tab_wait_count = (window._radar_like_tab_wait_count || 0) + 1;
    if (window._radar_like_tab_wait_count <= 6) {
      console.log("[Built-in-Debug] 未检测到“喜欢”页签，等待主页渲染 (" + window._radar_like_tab_wait_count + "/6)...");
      reportCurrentAction("等待「喜欢」页签渲染中 (" + window._radar_like_tab_wait_count + "/6)...");
      await randomDelay(1200, 2200, _0x304fcc, "等待喜欢页签");
      return true;
    }
    console.warn("[Built-in-Debug] 连续未检测到“喜欢”页签，重新进入喜欢列表入口");
    reportCurrentAction("未检测到「喜欢」页签，正在重新进入喜欢列表...");
    navigateToDouyinLikeEntry();
    window._radar_like_tab_wait_count = 0;
    await randomDelay(3500, 5500, _0x304fcc, "重新进入喜欢列表");
    return true;
  }
  window._radar_like_tab_wait_count = 0;
  if (_0x14e98c) {
    if (!isLikeTabActive(_0x14e98c)) {
      console.log("[Built-in-Debug] 检测到“喜欢”页签未处于激活状态，正在模拟点击...");
      reportCurrentAction("正在切换到「喜欢」列表页签...");
      reportTraceLog("🎬 轨迹详情：正在点击选择个人主页中的「喜欢」页签");
      await simulateHumanClick(_0x14e98c, _0x304fcc);
      await randomDelay(2500, 4500, _0x304fcc, "切换喜欢页签");
      return true;
    }
  }
  return false;
}
async function collectLikedVideos(_0x3f15c6) {
  reportCurrentAction("正在扫描喜欢列表中的视频，请稍候...");
  reportTraceLog("🔍 喜欢列表扫描：正在扫描喜欢列表中的视频，以对齐喜欢列表界限...");
  let _0x413da0 = new Set();
  for (let _0xd69c18 = 0; _0xd69c18 < 3; _0xd69c18++) {
    if (shouldAbort(_0x3f15c6)) {
      break;
    }
    const _0x5449fc = findProfileVideoCards({
      ignoreNoWorksGuard: true
    });
    _0x5449fc.forEach(_0x3b6f2c => {
      let _0x2f8d4a = _0x3b6f2c.href || _0x3b6f2c.getAttribute("href");
      if (!_0x2f8d4a) {
        const _0x189481 = _0x3b6f2c.querySelector("a[href*=\"/video/\"], a[href*=\"/note/\"]");
        if (_0x189481) {
          _0x2f8d4a = _0x189481.href || _0x189481.getAttribute("href");
        }
      }
      const _0xd4249b = normalizeUrl(_0x2f8d4a || "");
      if (_0xd4249b) {
        _0x413da0.add(_0xd4249b);
      }
    });
    window.scrollBy(0, 1000);
    reportTraceLog("🎬 轨迹详情：喜欢列表扫描中，滚动加载第 " + (_0xd69c18 + 1) + " 次（当前已收集 " + _0x413da0.size + " 个视频）");
    await sleep(1000);
  }
  window.scrollTo(0, 0);
  await sleep(1500);
  const _0x57994e = Array.from(_0x413da0);
  reportTraceLog("✅ 喜欢列表边界扫描完成：对齐 " + _0x57994e.length + " 个视频（尚未写入线索库，接下来开始入库）");
  return _0x57994e;
}
function isFeedStyleSource(_0x540d62) {
  return _0x540d62 === "recommend" || _0x540d62 === "follow";
}
function isOnUserProfilePage() {
  try {
    return window.location.pathname.includes("/user/");
  } catch (_0x24de91) {
    return false;
  }
}
function resolveProfileVideoCommentScope() {
  const _0x4e3612 = [];
  const _0x1fe817 = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[class*=\"SearchDetail\"]", PLATFORM_SELECTORS["douyin.com"].modalContainer];
  for (const _0x55a518 of _0x1fe817) {
    try {
      document.querySelectorAll(_0x55a518).forEach(_0x1720b7 => {
        if (_0x1720b7 && isVisibleElement(_0x1720b7)) {
          _0x4e3612.push(_0x1720b7);
        }
      });
    } catch (_0x5b1b83) {}
  }
  let _0x1afff5 = document.body;
  let _0x4f0284 = 0;
  for (const _0x368334 of _0x4e3612) {
    const _0x42b1e0 = _0x368334.getBoundingClientRect();
    const _0x4745c9 = _0x42b1e0.width * _0x42b1e0.height;
    if (_0x4745c9 > _0x4f0284) {
      _0x4f0284 = _0x4745c9;
      _0x1afff5 = _0x368334;
    }
  }
  if (_0x4f0284 < 8000) {
    console.log("[Built-in-Debug] [主页首作评论] 详情容器过小(area=" + Math.round(_0x4f0284) + ")，使用 document.body");
    return document.body;
  }
  console.log("[Built-in-Debug] [主页首作评论] 评论范围=" + _0x1afff5.tagName + " (area≈" + Math.round(_0x4f0284) + ")");
  return _0x1afff5;
}
function getVideoIdFromPageUrl(_0x4c15a1 = window.location.href) {
  try {
    const _0x51f92c = new URL(_0x4c15a1);
    return _0x51f92c.searchParams.get("modal_id") || _0x51f92c.pathname.match(/\/(?:video|note)\/(\d{15,})/i)?.[1] || "";
  } catch (_0x425c0f) {
    return "";
  }
}
function hasProfileVideoDetailEvidence(_0x5f34ed = "") {
  try {
    const _0x29f592 = getVideoIdFromPageUrl();
    if (_0x29f592 && _0x5f34ed && String(_0x29f592) !== String(_0x5f34ed)) {
      return false;
    }
    if (_0x5f34ed && isSpecificVideoDetailReady(toSpecificVideoJingxuanUrl(_0x5f34ed))) {
      return true;
    }
    const _0x22251e = resolveDouyinVideoDetailModal({
      includeFeed: false
    });
    if (_0x22251e && isVisibleElement(_0x22251e)) {
      return true;
    }
    return Array.from(document.querySelectorAll("video")).some(_0x2c4180 => {
      if (!isVisibleElement(_0x2c4180)) {
        return false;
      }
      const _0x2ea822 = _0x2c4180.getBoundingClientRect();
      const _0x18ea4e = _0x2ea822.left + _0x2ea822.width / 2;
      const _0x27d4be = _0x2ea822.top + _0x2ea822.height / 2;
      return _0x2ea822.width >= 320 && _0x2ea822.height >= 220 && _0x2ea822.width * _0x2ea822.height >= 100000 && _0x18ea4e > 0 && _0x27d4be > 0 && _0x18ea4e < window.innerWidth && _0x27d4be < window.innerHeight;
    });
  } catch (_0x58df3a) {
    return false;
  }
}
function isProfileCommentUiVisible() {
  const _0x55f5c1 = PLATFORM_SELECTORS["douyin.com"].commentPanel || getCommentV2String("commentPanel");
  if (!_0x55f5c1) {
    return false;
  }
  const _0x2f4ab6 = document.querySelector(_0x55f5c1);
  if (_0x2f4ab6 && isVisibleElement(_0x2f4ab6)) {
    return true;
  }
  return Array.from(document.querySelectorAll("div, span, p")).some(_0x330eeb => isMainCommentPlaceholderCandidate(_0x330eeb, {
    requireViewport: true,
    profileVideo: true
  }));
}
async function openProfileVideoCommentPanel(_0x587490, _0x52ee60 = {}) {
  console.log("%c[主页首作评论] 正在打开评论区...", "color: #a78bfa; font-style: italic;");
  if (!hasCommentRuntimeReady()) {
    console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，无法打开主页评论区");
    return false;
  }
  let _0x4b8ccd = false;
  const _0x3d77f3 = getCommentV2String("feedCommentIcon");
  const _0x5e1bf1 = getCommentV2String("videoCommentIcon");
  const _0x390c98 = getCommentTabPrefix();
  const _0x59c120 = Number(_0x52ee60.deadlineAt || 0);
  const _0x1f822a = _0x59c120 > 0 ? _0x59c120 : Date.now() + 18000;
  const _0x2e1fd7 = 3;
  let _0x5a144f = _0x2e1fd7;
  let _0x59f920 = false;
  for (let _0x4e765a = 0; _0x4e765a < _0x5a144f && Date.now() < _0x1f822a; _0x4e765a++) {
    if (shouldAbort(_0x587490)) {
      break;
    }
    if (isProfileCommentUiVisible()) {
      console.log("[Built-in-Debug] [主页首作评论] 评论区已展开");
      return true;
    }
    const _0x5952ab = _0x3d77f3 ? Array.from(document.querySelectorAll(_0x3d77f3)).filter(isVisibleElement) : [];
    if (_0x5952ab.length > 0) {
      const _0x40e4f0 = _0x5952ab.length >= 2 ? _0x5952ab[1] : _0x5952ab[_0x5952ab.length - 1];
      console.log("[Built-in-Debug] [主页首作评论] 点击 feed-comment-icon（第 " + (_0x4e765a + 1) + " 轮）");
      await simulateTrustedElementClick(_0x40e4f0, _0x587490, "主页评论入口", {
        deadlineAt: _0x1f822a
      });
      _0x4b8ccd = true;
      await randomDelayWithinDeadline(1800, 2800, _0x587490, "打开评论", _0x1f822a);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    const _0x552645 = await openFeedCommentDrawer(_0x587490, {
      deadlineAt: _0x1f822a
    });
    _0x4b8ccd = _0x4b8ccd || _0x552645;
    if (isProfileCommentUiVisible()) {
      return true;
    }
    const _0x24f08d = _0x5e1bf1 ? Array.from(document.querySelectorAll(_0x5e1bf1)).filter(isVisibleElement) : [];
    if (_0x24f08d.length > 0) {
      console.log("[Built-in-Debug] [主页首作评论] 点击 video-comment-icon");
      await simulateTrustedElementClick(_0x24f08d[_0x24f08d.length - 1], _0x587490, "主页视频评论入口", {
        deadlineAt: _0x1f822a
      });
      _0x4b8ccd = true;
      await randomDelayWithinDeadline(1500, 2500, _0x587490, "打开评论", _0x1f822a);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    const _0x2d7d44 = _0x390c98 ? Array.from(document.querySelectorAll("div, span, p")).filter(_0x1e7a94 => {
      if (!isVisibleElement(_0x1e7a94) || _0x1e7a94.children.length > 8) {
        return false;
      }
      const _0x27f37a = (_0x1e7a94.textContent || "").trim();
      return _0x27f37a.startsWith(_0x390c98) && _0x27f37a.length < 24;
    }).sort((_0x160075, _0x1e1884) => _0x1e1884.getBoundingClientRect().right - _0x160075.getBoundingClientRect().right) : [];
    for (const _0x343bfa of _0x2d7d44.slice(0, 2)) {
      console.log("[Built-in-Debug] [主页首作评论] 尝试评论页签: \"" + (_0x343bfa.textContent || "").trim() + "\"");
      await simulateTrustedElementClick(_0x343bfa, _0x587490, "主页评论页签", {
        deadlineAt: _0x1f822a
      });
      _0x4b8ccd = true;
      await sleepWithinDeadline(1500, _0x1f822a);
      if (isProfileCommentUiVisible()) {
        return true;
      }
    }
    if (!_0x59f920 && _0x4b8ccd && _0x4e765a >= _0x2e1fd7 - 1 && !isProfileCommentUiVisible()) {
      _0x5a144f = getExtendedReadyRounds(_0x2e1fd7, {
        progress: true,
        hardCapRounds: 4
      });
      if (_0x5a144f > _0x2e1fd7) {
        _0x59f920 = true;
        console.log("[Built-in-Debug] [慢环境] 主页评论入口已点但面板未展开，延长至 " + _0x5a144f + " 轮");
      }
    }
    if (_0x4e765a < _0x5a144f - 1) {
      await sleepWithinDeadline(900 + _0x4e765a * 400, _0x1f822a);
    }
  }
  if (_0x4b8ccd) {
    console.log("[Built-in-Debug] [主页首作评论] 已点击评论入口，继续录入（DOM 可能未命中 commentPanel）");
    return true;
  }
  console.warn("[Built-in-Debug] [主页首作评论] 未能找到任何评论入口");
  return isProfileCommentUiVisible();
}
let lastProfileVideoDetailDiagnostic = "none";
function ownsActiveSubviewInteraction(_0x55c001 = "") {
  const _0x3b50f1 = String(_0x55c001 || "").trim();
  if (!_0x3b50f1) {
    return false;
  }
  return subviewTaskStarted && activeSubviewInteractionId === _0x3b50f1 && String(currentTask?.interactionId || "") === _0x3b50f1;
}
function shouldAbortProfileVideoDetailWait(_0x5cc1fd, _0x43e7bf = "") {
  if (ownsActiveSubviewInteraction(_0x43e7bf)) {
    return false;
  }
  return shouldAbort(_0x5cc1fd);
}
async function waitForProfileVideoDetailScope(_0x3829a3, _0xf282b8 = "", _0x2f4d7f = {}) {
  const _0x3539aa = Math.max(1000, Number(_0x2f4d7f.maxWaitMs || 6500));
  const _0xa520c3 = String(_0x2f4d7f.interactionId || currentTask?.interactionId || "");
  const _0x303a3c = Date.now();
  let _0x17f096 = 0;
  while (Date.now() - _0x303a3c < _0x3539aa) {
    if (shouldAbortProfileVideoDetailWait(_0x3829a3, _0xa520c3)) {
      lastProfileVideoDetailDiagnostic = "aborted " + describeTaskAbortReason(_0x3829a3) + " interactionId=" + (_0xa520c3 || "none") + " activeInteractionId=" + (activeSubviewInteractionId || "none");
      return null;
    }
    const _0x2f52bf = PLATFORM_SELECTORS["douyin.com"].modalContainer;
    const _0x176f1a = _0x2f52bf ? document.querySelector(_0x2f52bf) : null;
    const _0x1e9394 = Array.from(document.querySelectorAll("[data-e2e=\"video-player-container\"], video")).find(_0x403755 => isVisibleElement(_0x403755));
    if (_0x176f1a && isVisibleElement(_0x176f1a) || hasProfileVideoDetailEvidence(_0xf282b8)) {
      lastProfileVideoDetailDiagnostic = "ready elapsed=" + (Date.now() - _0x303a3c) + "ms routeVideoId=" + (getVideoIdFromPageUrl() || "none") + " scope=" + (_0x176f1a?.tagName || _0x1e9394?.tagName || "body");
      return resolveProfileVideoCommentScope();
    }
    if (Date.now() - _0x17f096 >= 5000) {
      _0x17f096 = Date.now();
      const _0x1056e2 = ((Date.now() - _0x303a3c) / 1000).toFixed(1);
      reportProfileFirstTrace("等待作品详情渲染（" + _0x1056e2 + "s，routeVideoId=" + (getVideoIdFromPageUrl() || "none") + "，player=" + (_0x1e9394 ? "partial" : "none") + "）");
    }
    await sleep(Math.min(500, Math.max(0, _0x3539aa - (Date.now() - _0x303a3c))));
  }
  const _0x4c7081 = hasProfileVideoDetailEvidence(_0xf282b8);
  lastProfileVideoDetailDiagnostic = (_0x4c7081 ? "ready_at_deadline" : "timeout") + " elapsed=" + (Date.now() - _0x303a3c) + "ms url=" + clipTraceText(window.location.href, 120) + " routeVideoId=" + (getVideoIdFromPageUrl() || "none");
  if (_0x4c7081) {
    return resolveProfileVideoCommentScope();
  } else {
    return null;
  }
}
function getDouyinFeedScope() {
  const _0x102278 = ["[data-e2e=\"feed-active-video\"]", "[data-e2e=\"feed-active-live\"]", "[data-e2e=\"browse-live\"]", "[data-e2e=\"feed-live\"]", "[data-e2e=\"webcast-player\"]"];
  const _0x5ef621 = [];
  for (const _0x5172c1 of _0x102278) {
    const _0x3037a0 = document.querySelectorAll(_0x5172c1);
    for (const _0x2a57d5 of _0x3037a0) {
      if (isElementInFeedCenter(_0x2a57d5)) {
        _0x5ef621.push(_0x2a57d5);
      }
    }
  }
  if (_0x5ef621.length > 0) {
    if (_0x5ef621.length === 1) {
      return _0x5ef621[0];
    }
    const _0x2160c5 = window.innerHeight / 2;
    const _0x191865 = window.innerWidth / 2;
    _0x5ef621.sort((_0x336ca7, _0x14c037) => {
      const _0x130b50 = _0x336ca7.getBoundingClientRect();
      const _0x373b13 = _0x14c037.getBoundingClientRect();
      const _0xffbc75 = Math.sqrt(Math.pow(_0x130b50.top + _0x130b50.height / 2 - _0x2160c5, 2) + Math.pow(_0x130b50.left + _0x130b50.width / 2 - _0x191865, 2));
      const _0x3fabb0 = Math.sqrt(Math.pow(_0x373b13.top + _0x373b13.height / 2 - _0x2160c5, 2) + Math.pow(_0x373b13.left + _0x373b13.width / 2 - _0x191865, 2));
      return _0xffbc75 - _0x3fabb0;
    });
    return _0x5ef621[0];
  }
  const _0x45ff38 = document.querySelector("[data-e2e=\"feed-active-video\"]");
  if (_0x45ff38 && isVisibleElement(_0x45ff38)) {
    return _0x45ff38;
  }
  for (const _0x256758 of ["feed-active-live", "browse-live", "feed-live", "webcast-player"]) {
    const _0x5729e6 = document.querySelector("[data-e2e=\"" + _0x256758 + "\"]");
    if (_0x5729e6 && isVisibleElement(_0x5729e6)) {
      return _0x5729e6;
    }
  }
  const _0x4f24b0 = document.querySelector("[data-e2e=\"video-player\"]");
  if (_0x4f24b0) {
    const _0x4e6e7b = _0x4f24b0.closest("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-item\"]");
    if (_0x4e6e7b && isVisibleElement(_0x4e6e7b)) {
      return _0x4e6e7b;
    }
  }
  const _0x16b7c7 = document.querySelector("video");
  if (_0x16b7c7) {
    const _0x43fae1 = _0x16b7c7.closest("[data-e2e=\"feed-active-video\"], [data-e2e=\"feed-active-live\"], [data-e2e=\"feed-live\"], [data-e2e=\"feed-item\"]");
    if (_0x43fae1 && isVisibleElement(_0x43fae1)) {
      return _0x43fae1;
    }
  }
  return null;
}
function isElementInFeedCenter(_0x1711d2) {
  if (!_0x1711d2 || !isVisibleElement(_0x1711d2)) {
    return false;
  }
  const _0x2ff511 = _0x1711d2.getBoundingClientRect();
  const _0x145c02 = _0x2ff511.left + _0x2ff511.width / 2;
  const _0x3d0e11 = _0x2ff511.top + _0x2ff511.height / 2;
  const _0x4b2861 = window.innerWidth;
  const _0x569ec7 = window.innerHeight;
  return _0x145c02 >= _0x4b2861 * 0.12 && _0x145c02 <= _0x4b2861 * 0.82 && _0x3d0e11 >= _0x569ec7 * 0.06 && _0x3d0e11 <= _0x569ec7 * 0.94;
}
function hasFeedLiveEnterHint(_0x4968fd = null) {
  const _0x5079ec = /点击或按.{0,4}进入直播间|按.{0,4}进入直播间/;
  const _0x585b67 = [];
  const _0x5f2f41 = _0x4968fd && _0x4968fd.querySelectorAll ? _0x4968fd : getDouyinFeedScope();
  if (_0x5f2f41) {
    _0x585b67.push(_0x5f2f41);
  }
  if (!_0x585b67.length) {
    _0x585b67.push(document.body);
  }
  for (const _0x5c685a of _0x585b67) {
    const _0x54d611 = (_0x5c685a.innerText || "").replace(/\s+/g, "");
    if (_0x5079ec.test(_0x54d611)) {
      return true;
    }
    const _0x67631c = _0x5c685a.querySelectorAll?.("span, div, p, button, a, [data-e2e]") || [];
    for (const _0xd01eac of _0x67631c) {
      if (!isVisibleElement(_0xd01eac) || !isElementInFeedCenter(_0xd01eac)) {
        continue;
      }
      const _0x3523b7 = (_0xd01eac.innerText || _0xd01eac.textContent || "").replace(/\s+/g, "");
      if (_0x5079ec.test(_0x3523b7)) {
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
  const _0x4f4252 = getDouyinFeedScope();
  if (!_0x4f4252 || !isVisibleElement(_0x4f4252)) {
    return false;
  }
  const _0x3da80d = _0x4f4252.querySelector("video") || document.querySelector("video");
  if (_0x3da80d && isVisibleElement(_0x3da80d)) {
    return true;
  }
  const _0x288d04 = _0x4f4252.querySelector("img, canvas, [data-e2e=\"image-feed\"]");
  return !!_0x288d04;
}
function getFeedVideoIdentity(_0x12d255 = null) {
  const _0x26c4c4 = _0x12d255 || getDouyinFeedScope() || document;
  const _0x1d8b82 = _0x26c4c4.querySelector("[data-e2e=\"video-desc\"]");
  const _0x3f6c18 = cleanTitle(_0x1d8b82?.innerText || "");
  const _0x486773 = _0x26c4c4.querySelector("[data-e2e=\"feed-video-nickname\"]")?.innerText?.trim() || "";
  const _0x38462d = _0x26c4c4.querySelector("video");
  let _0x2bb48c = "";
  try {
    const _0x23993d = _0x38462d?.currentSrc || _0x38462d?.src || "";
    const _0x38dcaf = _0x23993d.match(/file_id=([^&]+)/);
    const _0x54b3d5 = _0x23993d.match(/(\d{15,})/);
    _0x2bb48c = _0x38dcaf?.[1] || _0x54b3d5?.[1] || "";
  } catch (_0xc7784b) {}
  return ("feed:" + (_0x2bb48c || "na") + ":" + _0x486773 + ":" + _0x3f6c18).slice(0, 240);
}
function captureFeedVideoShareUrl(_0xb86f0c) {
  if (!_0xb86f0c) {
    return "";
  }
  const _0xe4bf09 = _0xb86f0c.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]");
  for (const _0x485407 of _0xe4bf09) {
    const _0x167f14 = extractVideoIdFromHref(_0x485407.href || _0x485407.getAttribute("href") || "");
    if (_0x167f14) {
      return buildDouyinVideoShareUrl(_0x167f14);
    }
  }
  const _0x9f39c2 = _0xb86f0c.getAttribute("data-item-id") || _0xb86f0c.querySelector("[data-item-id]")?.getAttribute("data-item-id");
  if (_0x9f39c2 && /^\d+$/.test(_0x9f39c2)) {
    return buildDouyinVideoShareUrl(_0x9f39c2);
  }
  const _0x5ea3a8 = Array.from(_0xb86f0c.querySelectorAll("video")).filter(_0x2f5409 => isVisibleElement(_0x2f5409)).sort((_0x356581, _0x5b384e) => {
    const _0x5e1b1b = _0x356581.getBoundingClientRect();
    const _0x2ec9d5 = _0x5b384e.getBoundingClientRect();
    return _0x2ec9d5.width * _0x2ec9d5.height - _0x5e1b1b.width * _0x5e1b1b.height;
  });
  for (const _0x3eee13 of _0x5ea3a8) {
    const _0x3dda13 = _0x3eee13.currentSrc || _0x3eee13.src || _0x3eee13.getAttribute("src") || "";
    const _0x4e8a01 = _0x3dda13.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || _0x3dda13.match(/\/(\d{19})\//) || _0x3dda13.match(/(\d{19})/);
    if (_0x4e8a01?.[1]) {
      return buildDouyinVideoShareUrl(_0x4e8a01[1]);
    }
  }
  return "";
}
function lockFeedLeadVideoUrl(_0x596b4d) {
  lockedFeedIdentity = getFeedVideoIdentity(_0x596b4d);
  lockedLeadVideoUrl = captureFeedVideoShareUrl(_0x596b4d);
  if (lockedLeadVideoUrl) {
    console.log("[Built-in-Debug] [推荐流] 已锁定视频链接: " + lockedLeadVideoUrl);
  }
  return lockedLeadVideoUrl;
}
function clearLockedLeadVideoUrl() {
  lockedLeadVideoUrl = "";
  lockedFeedIdentity = "";
}
function pickLeadVideoUrl(_0x509b75 = "", _0x3448a5 = document) {
  const _0x6c0cca = normalizeUrl(_0x509b75);
  if (isDouyinVideoShareUrl(_0x6c0cca)) {
    return _0x6c0cca;
  }
  if (isDouyinVideoShareUrl(lockedLeadVideoUrl)) {
    return lockedLeadVideoUrl;
  }
  if (isDouyinVideoShareUrl(pendingLeadVideoUrl) && Date.now() - pendingLeadVideoUrlAt < 120000) {
    return pendingLeadVideoUrl;
  }
  return resolveLeadVideoUrl(_0x509b75, _0x3448a5);
}
async function openFeedCommentDrawer(_0x419acb, _0x95f225 = {}) {
  if (isDouyinFeedLiveStream() || hasFeedLiveEnterHint() || isDouyinLiveStreamTitle(getVideoTitle())) {
    console.log("[Built-in-Debug] [推荐流] 当前为直播间，跳过打开评论");
    return false;
  }
  if (!hasCommentRuntimeReady()) {
    console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过打开评论");
    return false;
  }
  const _0x291f98 = Number(_0x95f225.deadlineAt || 0);
  const _0xe2d2c4 = [getCommentV2String("feedCommentIcon"), getCommentV2String("videoCommentIcon"), getCommentV2String("openCommentAria")].filter(Boolean);
  for (const _0xce4d72 of _0xe2d2c4) {
    const _0x54cbe2 = Array.from(document.querySelectorAll(_0xce4d72)).filter(_0x1f9dd0 => isVisibleElement(_0x1f9dd0) && isElementInViewport(_0x1f9dd0));
    const _0x3d2f7a = _0x54cbe2.sort((_0xcf48d7, _0x3b5e4f) => {
      const _0x585eb1 = _0xcf48d7.getBoundingClientRect();
      const _0x2370eb = _0x3b5e4f.getBoundingClientRect();
      const _0x287db1 = Math.abs(_0x585eb1.left + _0x585eb1.width / 2 - window.innerWidth * 0.82) + Math.abs(_0x585eb1.top + _0x585eb1.height / 2 - window.innerHeight * 0.5);
      const _0x3c8956 = Math.abs(_0x2370eb.left + _0x2370eb.width / 2 - window.innerWidth * 0.82) + Math.abs(_0x2370eb.top + _0x2370eb.height / 2 - window.innerHeight * 0.5);
      return _0x287db1 - _0x3c8956;
    })[0];
    if (_0x3d2f7a) {
      console.log("[Built-in-Debug] [推荐流] 点击评论图标:", _0xce4d72);
      await simulateHumanClick(_0x3d2f7a, _0x419acb, {
        deadlineAt: _0x291f98
      });
      await randomDelayWithinDeadline(1500, 2500, _0x419acb, "打开评论", _0x291f98);
      return true;
    }
  }
  const _0x21f8ed = getCommentTabPrefix();
  const _0x260f53 = _0x21f8ed ? Array.from(document.querySelectorAll("div, span, p, button")).find(_0xb06233 => {
    if (!isVisibleElement(_0xb06233) || !isElementInViewport(_0xb06233) || _0xb06233.children.length > 2) {
      return false;
    }
    const _0x282d5a = _0xb06233.getBoundingClientRect();
    if (_0x282d5a.left < window.innerWidth * 0.55) {
      return false;
    }
    return (_0xb06233.innerText || "").trim() === _0x21f8ed;
  }) : null;
  if (_0x260f53) {
    console.log("[Built-in-Debug] [推荐流] 点击右侧互动栏「评论」文字入口");
    await simulateHumanClick(_0x260f53, _0x419acb, {
      deadlineAt: _0x291f98
    });
    await randomDelayWithinDeadline(1500, 2500, _0x419acb, "打开评论", _0x291f98);
    return true;
  }
  return false;
}
function getMyDouyinId() {
  try {
    try {
      const _0x3de9e7 = localStorage.getItem("user_info") || localStorage.getItem("index_user_info");
      if (_0x3de9e7) {
        const _0x52d6c0 = JSON.parse(_0x3de9e7);
        if (_0x52d6c0.short_id) {
          return String(_0x52d6c0.short_id).trim();
        }
        if (_0x52d6c0.display_id) {
          return String(_0x52d6c0.display_id).trim();
        }
        if (_0x52d6c0.unique_id && !String(_0x52d6c0.unique_id).startsWith("MS4w")) {
          return String(_0x52d6c0.unique_id).trim();
        }
      }
    } catch (_0x41a3cc) {}
    const _0x16048e = document.querySelectorAll("script");
    for (const _0x157e72 of _0x16048e) {
      const _0x111501 = _0x157e72.textContent || "";
      if (!_0x111501.includes("display_id") && !_0x111501.includes("shortId") && !_0x111501.includes("unique_id")) {
        continue;
      }
      const _0x11c643 = [/"display_id":"([^"]+)"/, /"shortId":"([^"]+)"/, /"short_id":"([^"]+)"/, /"unique_id":"([^"]+)"/];
      for (const _0x27f9e4 of _0x11c643) {
        const _0x35f1e8 = _0x111501.match(_0x27f9e4);
        if (_0x35f1e8 && _0x35f1e8[1] && _0x35f1e8[1].length >= 4 && _0x35f1e8[1].length <= 32) {
          return _0x35f1e8[1].trim();
        }
      }
    }
    const _0x5910f9 = Array.from(document.querySelectorAll("span, div, p"));
    const _0x422a04 = _0x5910f9.find(_0x2f2d39 => {
      const _0x400733 = (_0x2f2d39.innerText || "").trim();
      return _0x400733.includes("抖音号：") && _0x400733.length < 40 && isVisibleElement(_0x2f2d39);
    });
    if (_0x422a04) {
      return _0x422a04.innerText.replace(/抖音号[：:]\s*/g, "").trim();
    }
  } catch (_0x4e2c3d) {
    console.warn("[账号自检] 抖音号识别异常:", _0x4e2c3d.message);
  }
  return "";
}
function getMyProfileUrl() {
  try {
    const _0x4624d2 = Array.from(document.querySelectorAll("a[href*=\"/user/\"]"));
    for (const _0x1ab7f2 of _0x4624d2) {
      const _0x198169 = _0x1ab7f2.getAttribute("href") || "";
      if (!_0x198169.includes("/user/self") && _0x198169.includes("/user/") && _0x198169.length > 20) {
        if (_0x198169.startsWith("http")) {
          return _0x198169.split("?")[0];
        }
        return "https://www.douyin.com" + _0x198169.split("?")[0];
      }
    }
    const _0x547061 = document.querySelectorAll("script");
    for (const _0x1b0ebc of _0x547061) {
      const _0x51d5fb = (_0x1b0ebc.textContent || "").match(/"sec_uid":"([^"]+)"/);
      if (_0x51d5fb && _0x51d5fb[1]) {
        return "https://www.douyin.com/user/" + _0x51d5fb[1];
      }
    }
  } catch (_0x5b26aa) {}
  return "";
}
function getMyNickname() {
  try {
    const _0x1f1a93 = document.cookie.split("; ");
    for (const _0x1639f8 of _0x1f1a93) {
      if (_0x1639f8.startsWith("nickname-high-priority=") || _0x1639f8.startsWith("n_sdk_dict=")) {
        try {
          const _0x4447f3 = decodeURIComponent(_0x1639f8.split("=")[1]);
          if (_0x4447f3 && _0x4447f3.length > 1 && _0x4447f3.length < 30 && !_0x4447f3.includes("{")) {
            return _0x4447f3;
          }
        } catch (_0xbcd3b5) {}
      }
    }
    try {
      const _0x1a43c0 = localStorage.getItem("user_info") || localStorage.getItem("index_user_info");
      if (_0x1a43c0) {
        const _0x4b3364 = JSON.parse(_0x1a43c0);
        if (_0x4b3364.nickname) {
          return _0x4b3364.nickname;
        }
      }
    } catch (_0x23015e) {}
    const _0x305709 = ["[class*=\"nick--\"]", "[class*=\"nick\"]", "[class*=\"header\"] [class*=\"nick\"]", "[class*=\"user-info\"] [class*=\"name\"]", "a[href*=\"/personal\"]", ".user-info-wrapper .name", ".pc-header-user-info__nickname", "[data-e2e=\"user-name\"]", ".dy-account-name", "a[href*=\"/user/self\"]", ".account-name"];
    for (const _0x2569ed of _0x305709) {
      const _0x550d9b = document.querySelector(_0x2569ed);
      if (_0x550d9b && _0x550d9b.innerText?.trim()) {
        const _0x1a386a = _0x550d9b.innerText.trim();
        const _0x58159a = ["我的", "登录", "精选", "推荐", "关注", "朋友", "直播", "放映厅", "短剧"];
        if (_0x1a386a.length > 1 && !_0x58159a.includes(_0x1a386a)) {
          return _0x1a386a;
        }
      }
    }
    const _0x31b680 = document.querySelectorAll("script");
    for (const _0x3a8e06 of _0x31b680) {
      const _0x323613 = _0x3a8e06.textContent;
      if (_0x323613 && _0x323613.includes("nickname")) {
        const _0x402429 = _0x323613.match(/"nickname":"([^"]+)"/);
        if (_0x402429 && _0x402429[1]) {
          try {
            const _0x4209ee = JSON.parse("\"" + _0x402429[1] + "\"");
            if (_0x4209ee && _0x4209ee.length > 1 && _0x4209ee !== "我的") {
              return _0x4209ee;
            }
          } catch (_0x4415c7) {}
        }
      }
    }
    const _0x560599 = document.querySelector("img[alt][src*=\"avatar\"], [data-e2e=\"user-avatar\"] img");
    if (_0x560599 && _0x560599.alt && _0x560599.alt !== "头像" && _0x560599.alt.length > 1) {
      return _0x560599.alt.trim();
    }
    if (document.querySelector(".user-avatar, [data-e2e=\"user-avatar\"], .message-icon, [class*=\"user-order-container\"], [class*=\"nick\"]")) {
      return "已登录(待识别)";
    }
  } catch (_0x17e29b) {
    console.error("[Debug] 识别逻辑报错:", _0x17e29b.message);
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
    log: _0x5e9e0c => console.log(_0x5e9e0c)
  });
} catch (_0xf3f67f) {
  console.error("[Built-in-Debug] 指定视频暂停守护器加载失败:", _0xf3f67f);
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
    let _0x499e40 = 0;
    const _0x5a55c8 = 30;
    const _0x307792 = setInterval(() => {
      _0x499e40++;
      const _0x2ae650 = window.location.href || "";
      const _0x3aef93 = _0x2ae650.includes("douyin.com") || _0x2ae650.includes("goofish.com");
      if (_0x2ae650 === "about:blank" || !_0x3aef93) {
        if (_0x499e40 >= 3) {
          clearInterval(_0x307792);
        }
        return;
      }
      const _0x5c7849 = getMyNickname();
      const _0x565c51 = getMyDouyinId();
      const _0x114b72 = getMyProfileUrl();
      const _0x113444 = _0x2ae650.includes("goofish.com");
      if (_0x499e40 % 5 === 0) {
        console.log("[账号自检] 第 " + _0x499e40 + " 次探测。当前URL: " + _0x2ae650);
        console.log("[Debug] Cookie包含昵称标记: " + document.cookie.includes("nickname"));
      }
      const _0x295313 = _0x5c7849 && (_0x5c7849 !== "已登录(待识别)" || _0x113444);
      if (_0x295313) {
        const _0x42bfd6 = _0x5c7849 === "已登录(待识别)" ? "闲鱼用户" : _0x5c7849;
        clearInterval(_0x307792);
        console.log("%c[账号自检] 识别成功: " + _0x42bfd6 + (_0x565c51 ? " | 抖音号: " + _0x565c51 : ""), "color: #fff; background: #10b981; padding: 4px;");
        ipcRenderer.send("account-logged-in", {
          name: _0x42bfd6,
          douyinId: _0x565c51,
          userUrl: _0x114b72
        });
      } else if (_0x499e40 >= 4 && !safeSessionGet("radar_self_profile_checked") && _0x2ae650.includes("douyin.com") && !_0x2ae650.includes("/user/") && /(?:^|;\s)(sessionid|sessionid_ss|sid_tt|uid_tt)=/i.test(document.cookie || "")) {
        safeSessionSet("radar_self_profile_checked", "1");
        console.log("[账号自检] 尝试跳转个人主页以识别抖音号...");
        window.location.href = "https://www.douyin.com/user/self";
      } else if (_0x499e40 >= _0x5a55c8) {
        clearInterval(_0x307792);
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
ipcRenderer.on("control-task", (_0x23a7d8, {
  type: _0x5576ed,
  payload: _0x2fd217
}) => {
  if (_0x5576ed === "START_TASK" && _0x2fd217.viewKey) {
    currentViewKey = _0x2fd217.viewKey;
    safeSessionSet("radar_view_key", _0x2fd217.viewKey);
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
} catch (_0x582a0c) {
  subviewTaskAls = null;
}
function getBoundSubviewInteractionId() {
  const _0x2ccfea = subviewTaskAls?.getStore?.()?.interactionId;
  if (_0x2ccfea) {
    return String(_0x2ccfea);
  }
  return String(currentTask?.interactionId || activeSubviewInteractionId || "");
}
function markSubviewInteractionCancelled(_0x35700b) {
  const _0x3b4c9b = String(_0x35700b || "").trim();
  if (!_0x3b4c9b) {
    return;
  }
  cancelledSubviewInteractionIds.add(_0x3b4c9b);
  while (cancelledSubviewInteractionIds.size > 40) {
    const _0x4e7bd3 = cancelledSubviewInteractionIds.values().next().value;
    cancelledSubviewInteractionIds.delete(_0x4e7bd3);
  }
}
function isSubviewInteractionCancelled(_0xcea865) {
  const _0x1573a2 = String(_0xcea865 || "").trim();
  return !!_0x1573a2 && !!cancelledSubviewInteractionIds.has(_0x1573a2);
}
function batchProfileCommentDoneKey(_0x371db3, _0x1f9315 = "") {
  const _0x416f9c = _0x371db3?.lead || _0x371db3;
  const _0x44070e = String(_0x1f9315 || _0x371db3?.viewKey || currentViewKey || "").trim();
  const _0x1e1f35 = String(_0x371db3?.batchRunId ?? _0x416f9c?.batchRunId ?? "").trim();
  const _0x55ed66 = String(_0x416f9c?.leadId || _0x416f9c?.userUrl || _0x416f9c?.secUid || _0x416f9c?.nickname || "").trim();
  if (!_0x44070e && !_0x55ed66) {
    return "";
  }
  return _0x1e1f35 + "::" + _0x44070e + "::" + _0x55ed66;
}
function markBatchProfileCommentDone(_0x155a2a) {
  const _0x12bdff = batchProfileCommentDoneKey(_0x155a2a);
  if (_0x12bdff) {
    batchProfileCommentDoneKeys.add(_0x12bdff);
  }
}
function wasBatchProfileCommentDone(_0x1d0b8d) {
  const _0x33f9d8 = batchProfileCommentDoneKey(_0x1d0b8d);
  return !!_0x33f9d8 && !!batchProfileCommentDoneKeys.has(_0x33f9d8);
}
function pingInteractionActivity(_0x5c7794 = "", _0x338636 = 0) {
  try {
    const _0x1696ea = {
      viewKey: currentViewKey,
      interactionId: currentTask?.interactionId || activeSubviewInteractionId || "",
      batchRunId: currentTask?.batchRunId,
      reason: _0x5c7794
    };
    if (Number.isFinite(Number(_0x338636)) && Number(_0x338636) > 0) {
      _0x1696ea.extendMs = Number(_0x338636);
    }
    ipcRenderer.send("interaction-activity", _0x1696ea);
  } catch (_0x19c469) {}
}
const sleep = _0x2ed76b => new Promise(_0x269766 => setTimeout(_0x269766, _0x2ed76b));
let backgroundAutomationLayoutDepth = 0;
let backgroundAutomationLayoutAcquirePromise = null;
let backgroundAutomationLayoutReleasePromise = null;
let backgroundAutomationLayoutReleaseNeeded = false;
let backgroundAutomationLayoutOwnerViewKey = null;
async function withBackgroundAutomationLayout(_0x4c7e68, _0x879688 = {}) {
  if (typeof _0x4c7e68 !== "function") {
    return undefined;
  }
  const _0x26e489 = currentViewKey;
  if (!_0x26e489 || typeof ipcRenderer === "undefined") {
    return _0x4c7e68();
  }
  const _0x39b75d = typeof _0x879688.onProgress === "function" ? _0x879688.onProgress : null;
  let _0xef51ac = false;
  try {
    if (backgroundAutomationLayoutDepth === 0) {
      if (backgroundAutomationLayoutReleasePromise) {
        _0x39b75d?.("等待上一批后台互动释放…");
        await backgroundAutomationLayoutReleasePromise;
      }
      if (!backgroundAutomationLayoutAcquirePromise) {
        _0x39b75d?.("申请后台互动执行权…");
        backgroundAutomationLayoutAcquirePromise = ipcRenderer.invoke("ensure-background-automation-layout", {
          viewKey: _0x26e489,
          claimInteractionSlot: true,
          requireComposerSurface: _0x879688.requireComposerSurface === true
        });
      }
      const _0x249cf9 = await backgroundAutomationLayoutAcquirePromise;
      if (_0x249cf9?.ok === false) {
        console.warn("[BackgroundLayout] 申请后台互动执行权受阻 (" + (_0x249cf9?.reason || "unknown") + ")，尝试降级执行 DOM 动作");
      }
      backgroundAutomationLayoutReleaseNeeded = backgroundAutomationLayoutReleaseNeeded || !!_0x249cf9?.attached && !_0x249cf9?.visible || !!_0x249cf9?.interactionSlotAcquired;
      backgroundAutomationLayoutOwnerViewKey = _0x26e489;
      if (Number(_0x249cf9?.interactionSlotWaitedMs || 0) >= 200) {
        const _0x795374 = (_0x249cf9.interactionSlotWaitedMs / 1000).toFixed(1);
        _0x39b75d?.("后台互动排队等待 " + _0x795374 + " 秒");
        reportTraceLog("⏱ 后台互动排队：等待 " + _0x795374 + " 秒");
      }
      if (currentTask?.canCommentFirstWork) {
        const _0x27fd55 = _0x249cf9?.visible ? "前台实况" : _0x249cf9?.composerSurface ? "互动激活面" : _0x249cf9?.interaction ? "互动宿主" : _0x249cf9?.parkedInMainWindow ? "主窗离屏" : "后台宿主";
        reportCommentFlowTrace("互动执行环境", "view=" + clipTraceText(_0x26e489, 18) + " host=" + _0x27fd55 + (" slotWait=" + Math.round(Number(_0x249cf9?.interactionSlotWaitedMs || 0)) + "ms") + (" viewport=" + window.innerWidth + "x" + window.innerHeight) + (" visible=" + document.visibilityState + " focused=" + (document.hasFocus?.() !== false)) + (" focusEmulated=" + !!_0x249cf9?.focusEmulated) + (" warmup=" + Math.round(Number(_0x249cf9?.surfaceWarmupMs || 0)) + "ms") + (" nativeWindowFocused=" + !!_0x249cf9?.nativeWindowFocused) + (" webContentsFocused=" + !!_0x249cf9?.webContentsFocused));
      }
    }
    backgroundAutomationLayoutDepth += 1;
    _0xef51ac = true;
    return await _0x4c7e68();
  } finally {
    if (_0xef51ac) {
      backgroundAutomationLayoutDepth = Math.max(0, backgroundAutomationLayoutDepth - 1);
    }
    if (backgroundAutomationLayoutDepth === 0) {
      const _0x3a053c = backgroundAutomationLayoutReleaseNeeded;
      const _0x5e949b = backgroundAutomationLayoutOwnerViewKey || _0x26e489;
      backgroundAutomationLayoutAcquirePromise = null;
      backgroundAutomationLayoutReleaseNeeded = false;
      backgroundAutomationLayoutOwnerViewKey = null;
      if (_0x3a053c) {
        const _0x2703fa = ipcRenderer.invoke("release-background-automation-layout", {
          viewKey: _0x5e949b,
          preferReacquireMs: Math.max(0, Number(_0x879688.preferReacquireMs) || 0)
        }).catch(() => null);
        backgroundAutomationLayoutReleasePromise = _0x2703fa;
        const _0x2a1675 = await _0x2703fa;
        if (_0x2a1675?.interactionSlotReserved) {
          reportTraceLog("🔗 已为同一用户后续动作保留互动执行权 " + Math.round(Number(_0x879688.preferReacquireMs) || 0) / 1000 + " 秒", currentTask?.lead?.accountId);
        }
        if (backgroundAutomationLayoutReleasePromise === _0x2703fa) {
          backgroundAutomationLayoutReleasePromise = null;
        }
      }
    }
  }
}
function focusCurrentAutomationViewForComment() {
  try {
    window.focus?.();
  } catch (_0x2214ea) {}
  try {
    if (currentViewKey && typeof ipcRenderer !== "undefined") {
      ipcRenderer.send("focus-automation-view", {
        viewKey: currentViewKey,
        bringToFront: true
      });
    }
  } catch (_0x396722) {}
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
      set: _0x38a423 => {
        activeLoopId = _0x38a423;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x343946 => {
        currentTask = _0x343946;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: _0x5603b6 => {
        currentViewKey = _0x5603b6;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: _0x1031b2 => {
        lastTrustedClickDiagnostic = _0x1031b2;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: _0x4aaa5e => {
        pausedForSubview = _0x4aaa5e;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: _0x2611c7 => {
        sessionDmCount = _0x2611c7;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: _0x2dc65a => {
        sessionFollowCount = _0x2dc65a;
      }
    },
    sessionInteractionCount: {
      enumerable: true,
      get: () => sessionInteractionCount,
      set: _0x406a36 => {
        sessionInteractionCount = _0x406a36;
      }
    },
    sessionInteractionLimit: {
      enumerable: true,
      get: () => sessionInteractionLimit,
      set: _0x26c932 => {
        sessionInteractionLimit = _0x26c932;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x214e29 => {
        stopRequested = _0x214e29;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x1e7deb => {
        taskRunning = _0x1e7deb;
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
} catch (_0x36c0fa) {
  automationRuntimeControllerLoadError = _0x36c0fa;
  console.error("[Built-in-Debug] 自动化公共运行时控制器加载失败:", _0x36c0fa);
}
function abortAutomationStartup(..._0xc194c4) {
  return automationRuntimeController?.abortAutomationStartup(..._0xc194c4);
}
function awaitSearchPageLoginGate(..._0x1dc68c) {
  return automationRuntimeController?.awaitSearchPageLoginGate(..._0x1dc68c);
}
function awaitSecurityChallengeIfPresent(..._0x3b0519) {
  return automationRuntimeController?.awaitSecurityChallengeIfPresent(..._0x3b0519);
}
function buildAutomationAiPayload(..._0x50bee4) {
  return automationRuntimeController?.buildAutomationAiPayload(..._0x50bee4);
}
function buildMainCommentAbortResult(..._0x4d5840) {
  return automationRuntimeController?.buildMainCommentAbortResult(..._0x4d5840);
}
function checkAndClickOneClickLogin(..._0x4bc9eb) {
  return automationRuntimeController?.checkAndClickOneClickLogin(..._0x4bc9eb);
}
function clipTraceText(..._0x3eeaeb) {
  return automationRuntimeController?.clipTraceText(..._0x3eeaeb) || "";
}
function describeCommentLikeState(..._0x33bc45) {
  return automationRuntimeController?.describeCommentLikeState(..._0x33bc45) || "";
}
function describeMainCommentInputEnvironment(..._0x358d8d) {
  return automationRuntimeController?.describeMainCommentInputEnvironment(..._0x358d8d);
}
function describeTaskAbortReason(..._0x27cf8) {
  return automationRuntimeController?.describeTaskAbortReason(..._0x27cf8) || "";
}
function detectPageSecurityChallenge(..._0x2f36f6) {
  return automationRuntimeController?.detectPageSecurityChallenge(..._0x2f36f6);
}
function evaluateLeadLocationFilter(..._0x5af229) {
  return automationRuntimeController?.evaluateLeadLocationFilter(..._0x5af229);
}
function formatTaskLocationFilterSummary(..._0x237d52) {
  return automationRuntimeController?.formatTaskLocationFilterSummary(..._0x237d52) || "";
}
function getAutomationTextHelpersModule(..._0x2997a9) {
  return automationRuntimeController?.getAutomationTextHelpersModule(..._0x2997a9);
}
function getCommentPlaceholderText(..._0x36421b) {
  return automationRuntimeController?.getCommentPlaceholderText(..._0x36421b) || "";
}
function getIncludeTitleKeywordMatch(..._0x25f213) {
  return automationRuntimeController?.getIncludeTitleKeywordMatch(..._0x25f213);
}
function getLocationFilterModule(..._0x3545f4) {
  return automationRuntimeController?.getLocationFilterModule(..._0x3545f4);
}
function handleGlobalAutomationPopupsAndSecurity(..._0x1e0a7c) {
  return automationRuntimeController?.handleGlobalAutomationPopupsAndSecurity(..._0x1e0a7c);
}
function hasCommentLikeTakenEffect(..._0x402ca1) {
  return automationRuntimeController?.hasCommentLikeTakenEffect(..._0x402ca1) || false;
}
function hasLocalReplyTemplates(..._0x2a0b71) {
  return automationRuntimeController?.hasLocalReplyTemplates(..._0x2a0b71) || false;
}
function hasVideoCommentTemplates(..._0xdee2a5) {
  return automationRuntimeController?.hasVideoCommentTemplates(..._0xdee2a5) || false;
}
function incrementInteractionCount(..._0x29ff8e) {
  return automationRuntimeController?.incrementInteractionCount(..._0x29ff8e);
}
function isDouyinProfileTargetingEnabled(..._0x587ad2) {
  return automationRuntimeController?.isDouyinProfileTargetingEnabled(..._0x587ad2) || false;
}
function isFatalAiAuthError(..._0x3152f5) {
  return automationRuntimeController?.isFatalAiAuthError(..._0x3152f5) || false;
}
function isInteractionLimitReached(..._0x1e1776) {
  return automationRuntimeController?.isInteractionLimitReached(..._0x1e1776) || false;
}
function isMainCommentPlaceholderCandidate(..._0x77c682) {
  return automationRuntimeController?.isMainCommentPlaceholderCandidate(..._0x77c682) || false;
}
function matchCurrentVideoForDy(..._0x50ba44) {
  return automationRuntimeController?.matchCurrentVideoForDy(..._0x50ba44);
}
function matchExcludedCommentKeyword(..._0x200738) {
  return automationRuntimeController?.matchExcludedCommentKeyword(..._0x200738) || false;
}
function matchLeadProfileForDy(..._0x3f884a) {
  return automationRuntimeController?.matchLeadProfileForDy(..._0x3f884a);
}
function matchTitleKeywordList(..._0x5923b9) {
  return automationRuntimeController?.matchTitleKeywordList(..._0x5923b9) || false;
}
function parseTitleKeywordList(..._0x5cd150) {
  return automationRuntimeController?.parseTitleKeywordList(..._0x5cd150) || [];
}
function persistSessionInteractionCount(..._0x24a2e8) {
  return automationRuntimeController?.persistSessionInteractionCount(..._0x24a2e8);
}
function personalizeDmTemplate(..._0x2f6e7f) {
  return automationRuntimeController?.personalizeDmTemplate(..._0x2f6e7f) || "";
}
function prefetchAiMainPostComment(..._0x489928) {
  return automationRuntimeController?.prefetchAiMainPostComment(..._0x489928);
}
function prefetchKeywordReplyContents(..._0x584cdd) {
  return automationRuntimeController?.prefetchKeywordReplyContents(..._0x584cdd);
}
function prepareLeadsForAiAnalysis(..._0x5aefb2) {
  return automationRuntimeController?.prepareLeadsForAiAnalysis(..._0x5aefb2);
}
function reportCommentFlowTrace(..._0x185a55) {
  return automationRuntimeController?.reportCommentFlowTrace(..._0x185a55);
}
function reportCurrentAction(..._0xe33e52) {
  return automationRuntimeController?.reportCurrentAction(..._0xe33e52) || "";
}
function reportProfileFirstTrace(..._0x17eee7) {
  return automationRuntimeController?.reportProfileFirstTrace(..._0x17eee7);
}
function reportTraceLog(..._0x5edb9d) {
  return automationRuntimeController?.reportTraceLog(..._0x5edb9d);
}
function resolveCommentLikeControlInNode(..._0x39028a) {
  return automationRuntimeController?.resolveCommentLikeControlInNode(..._0x39028a);
}
function resolveTaskEntryUrl(..._0x55ccf2) {
  return automationRuntimeController?.resolveTaskEntryUrl(..._0x55ccf2) || "";
}
function resolveTaskLocationFilterRegions(..._0x3e6a29) {
  return automationRuntimeController?.resolveTaskLocationFilterRegions(..._0x3e6a29) || [];
}
function scoreMainCommentPlaceholderCandidate(..._0x22c3a5) {
  return automationRuntimeController?.scoreMainCommentPlaceholderCandidate(..._0x22c3a5);
}
function shouldEnforceIncludeTitleKeywords(..._0x5cb65e) {
  return automationRuntimeController?.shouldEnforceIncludeTitleKeywords(..._0x5cb65e) || false;
}
function shouldForceSelectByIncludeTitle(..._0x31d65a) {
  return automationRuntimeController?.shouldForceSelectByIncludeTitle(..._0x31d65a) || false;
}
function shouldGenerateAiVideoMainPost(..._0x18cba4) {
  return automationRuntimeController?.shouldGenerateAiVideoMainPost(..._0x18cba4) || false;
}
function shouldPrefetchMainPostWithVideoMatch(..._0x32d635) {
  return automationRuntimeController?.shouldPrefetchMainPostWithVideoMatch(..._0x32d635) || false;
}
function shouldUseAiCommentAnalysis(..._0x664942) {
  return automationRuntimeController?.shouldUseAiCommentAnalysis(..._0x664942) || false;
}
function shouldUseAiReplyGeneration(..._0x3a0908) {
  return automationRuntimeController?.shouldUseAiReplyGeneration(..._0x3a0908) || false;
}
function shouldUseCommentKeywordFilter(..._0x18b2ca) {
  return automationRuntimeController?.shouldUseCommentKeywordFilter(..._0x18b2ca) || false;
}
function shouldUsePersonaVideoFilter(..._0xf394db) {
  return automationRuntimeController?.shouldUsePersonaVideoFilter(..._0xf394db) || false;
}
function shouldUseTextlessReplyPayload(..._0x42444e) {
  return automationRuntimeController?.shouldUseTextlessReplyPayload(..._0x42444e) || false;
}
function shouldUseTextlessVideoCommentPayload(..._0x25547b) {
  return automationRuntimeController?.shouldUseTextlessVideoCommentPayload(..._0x25547b) || false;
}
function snapshotCommentLikeControlState(..._0x406e84) {
  return automationRuntimeController?.snapshotCommentLikeControlState(..._0x406e84);
}
function taskLocationFilterEnabled(..._0x1f58b4) {
  return automationRuntimeController?.taskLocationFilterEnabled(..._0x1f58b4) || false;
}
function allowEmptyCommentText(_0x5b120a = false, _0xa4712a = false, _0x4940cf = currentTask) {
  if (_0xa4712a) {
    return !!_0x4940cf?.enableCommentWithoutText;
  }
  if (_0x5b120a) {
    return shouldUseTextlessVideoCommentPayload(_0x4940cf);
  }
  return shouldUseTextlessReplyPayload(_0x4940cf);
}
function applySubviewRuntimeTask(_0x23d1b6 = {}) {
  const _0x6b3bf1 = currentTask && typeof currentTask === "object" ? currentTask : {};
  const _0x392bfa = {
    ..._0x6b3bf1,
    ..._0x23d1b6
  };
  _0x392bfa.enableCommentWithoutText = !!_0x23d1b6.enableCommentWithoutText;
  _0x392bfa.enableVideoCommentWithoutText = !!_0x23d1b6.enableVideoCommentWithoutText;
  if ("enableCommentMention" in _0x23d1b6) {
    _0x392bfa.enableCommentMention = !!_0x23d1b6.enableCommentMention;
  }
  if ("commentMentionNicknames" in _0x23d1b6) {
    _0x392bfa.commentMentionNicknames = _0x23d1b6.commentMentionNicknames || "";
  }
  if ("commentMentionPosition" in _0x23d1b6) {
    _0x392bfa.commentMentionPosition = _0x23d1b6.commentMentionPosition === "after" ? "after" : "before";
  }
  if ("commentMentionPercent" in _0x23d1b6) {
    const _0x3c16fc = Number(_0x23d1b6.commentMentionPercent);
    if (Number.isFinite(_0x3c16fc)) {
      _0x392bfa.commentMentionPercent = Math.max(0, Math.min(100, Math.round(_0x3c16fc)));
    } else if (!Number.isFinite(Number(_0x392bfa.commentMentionPercent))) {
      _0x392bfa.commentMentionPercent = 100;
    }
  }
  if ("enableVideoCommentMention" in _0x23d1b6) {
    _0x392bfa.enableVideoCommentMention = !!_0x23d1b6.enableVideoCommentMention;
  }
  if ("videoCommentMentionNicknames" in _0x23d1b6) {
    _0x392bfa.videoCommentMentionNicknames = _0x23d1b6.videoCommentMentionNicknames || "";
  }
  if ("videoCommentMentionPosition" in _0x23d1b6) {
    _0x392bfa.videoCommentMentionPosition = _0x23d1b6.videoCommentMentionPosition === "after" ? "after" : "before";
  }
  if ("videoCommentMentionPercent" in _0x23d1b6) {
    const _0xfc2659 = Number(_0x23d1b6.videoCommentMentionPercent);
    if (Number.isFinite(_0xfc2659)) {
      _0x392bfa.videoCommentMentionPercent = Math.max(0, Math.min(100, Math.round(_0xfc2659)));
    } else if (!Number.isFinite(Number(_0x392bfa.videoCommentMentionPercent))) {
      _0x392bfa.videoCommentMentionPercent = 100;
    }
  }
  if ("commentUseRandomSuffix" in _0x23d1b6) {
    _0x392bfa.commentUseRandomSuffix = !!_0x23d1b6.commentUseRandomSuffix;
  }
  if ("enableCommentWithoutText" in _0x23d1b6) {
    _0x392bfa.enableCommentWithoutText = !!_0x23d1b6.enableCommentWithoutText;
  }
  if ("enableCommentImage" in _0x23d1b6) {
    _0x392bfa.enableCommentImage = !!_0x23d1b6.enableCommentImage;
  }
  if ("commentImagePaths" in _0x23d1b6) {
    _0x392bfa.commentImagePaths = Array.isArray(_0x23d1b6.commentImagePaths) ? _0x23d1b6.commentImagePaths.filter(_0x325fed => typeof _0x325fed === "string" && _0x325fed.trim()) : [];
  }
  if ("commentImagePath" in _0x23d1b6) {
    _0x392bfa.commentImagePath = _0x23d1b6.commentImagePath || "";
  }
  if ("enableCommentExpression" in _0x23d1b6) {
    _0x392bfa.enableCommentExpression = !!_0x23d1b6.enableCommentExpression;
  }
  if ("commentExpressionCount" in _0x23d1b6) {
    _0x392bfa.commentExpressionCount = Math.max(1, Math.min(8, Number(_0x23d1b6.commentExpressionCount) || 3));
  }
  if ("commentAttachmentPercent" in _0x23d1b6) {
    const _0x519d03 = Number(_0x23d1b6.commentAttachmentPercent);
    _0x392bfa.commentAttachmentPercent = Number.isFinite(_0x519d03) ? Math.max(0, Math.min(100, _0x519d03)) : 20;
  }
  if (_0x23d1b6.lead) {
    _0x392bfa.lead = _0x23d1b6.lead;
  }
  const _0x47e78f = _0x392bfa.accountId || _0x392bfa.lead?.accountId;
  if (_0x47e78f) {
    window._radar_account_id = _0x47e78f;
    try {
      sessionStorage.setItem("radar_account_id", _0x47e78f);
    } catch (_0x388c8a) {}
  }
  {
    const _0x25e02c = String(_0x392bfa.name || _0x392bfa.nickname || "").trim();
    const _0x23d90c = String(_0x392bfa.lead?.accountName || "").trim();
    const _0x264c29 = String(_0x392bfa.lead?.nickname || "").trim();
    let _0x44926c = _0x25e02c || _0x23d90c;
    if (_0x44926c && _0x264c29 && _0x44926c === _0x264c29 && !_0x392bfa.name && _0x23d90c && _0x23d90c !== _0x264c29) {
      _0x44926c = _0x23d90c;
    }
    if (_0x44926c) {
      window._radar_account_name = _0x44926c;
    }
  }
  currentTask = _0x392bfa;
  try {
    syncCommentAttachmentRotationFromBatchStorage();
  } catch (_0x96f419) {}
  return currentTask;
}
function mergeProfileInfoToLead(_0x55294a, _0x4e63da) {
  if (!_0x55294a || !_0x4e63da) {
    return _0x55294a;
  }
  const _0x221258 = String(_0x4e63da.nickname || "").trim().replace(/^@+/, "");
  const _0x112f6f = String(_0x55294a.nickname || "").trim().replace(/^@+/, "");
  if (_0x221258) {
    const _0x1d0c38 = isRejectedProfileNicknameCandidate(_0x221258);
    if (!_0x1d0c38) {
      _0x55294a.nickname = _0x221258;
    } else if (!_0x112f6f && !/抖音号|IP属地|关注|粉丝|获赞|私密账号/.test(_0x221258)) {
      _0x55294a.nickname = _0x221258;
    }
  }
  if (_0x4e63da.location) {
    _0x55294a.location = _0x4e63da.location;
  }
  if (_0x4e63da.douyinId) {
    _0x55294a.douyinId = _0x4e63da.douyinId;
  }
  if (_0x4e63da.gender) {
    _0x55294a.gender = _0x4e63da.gender;
  }
  if (_0x4e63da.age != null) {
    _0x55294a.age = _0x4e63da.age;
  }
  if (_0x4e63da.profileAgeChecked) {
    _0x55294a.profileAgeChecked = true;
  }
  if (_0x4e63da.signature) {
    _0x55294a.signature = _0x4e63da.signature;
  }
  if (_0x4e63da.contact) {
    _0x55294a.contact = _0x4e63da.contact;
  }
  if (_0x4e63da.isPrivate !== undefined) {
    _0x55294a.isPrivate = !!_0x4e63da.isPrivate;
  }
  if (_0x4e63da.worksCount !== undefined && _0x4e63da.worksCount !== null) {
    _0x55294a.worksCount = _0x4e63da.worksCount;
    if (Number(_0x4e63da.worksCount) === 0) {
      _0x55294a.noWorks = true;
    }
  }
  if (_0x4e63da.noWorks) {
    _0x55294a.noWorks = true;
  }
  return _0x55294a;
}
function leadHasProfileInfo(_0x52ec94) {
  if (!_0x52ec94) {
    return false;
  }
  return !!String(_0x52ec94.nickname || "").trim() || _0x52ec94.age != null || !!_0x52ec94.gender && _0x52ec94.gender !== "未知" || !!_0x52ec94.location || !!_0x52ec94.douyinId || !!_0x52ec94.signature || !!_0x52ec94.contact;
}
function emitLeadProfileUpdate(_0x258104, _0x45ea81 = {}) {
  if (!_0x258104) {
    return;
  }
  Object.assign(_0x258104, _0x45ea81);
  if (!leadHasProfileInfo(_0x258104)) {
    return;
  }
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [_0x258104],
      taskId: activeLoopId,
      viewKey: currentTask?.viewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask)
    });
  } catch (_0xed3c50) {}
}
function persistScrapedLeadProfile(_0x9f8909, _0x3ea1f0, _0x534431 = null, _0x96ee05 = {}) {
  if (!_0x9f8909 || !_0x3ea1f0) {
    return _0x9f8909;
  }
  applyEntryMetaToLead(_0x9f8909);
  mergeProfileInfoToLead(_0x9f8909, _0x3ea1f0);
  if (_0x3ea1f0.profileAgeChecked) {
    _0x9f8909.profileAgeChecked = true;
  }
  const _0x4b58a8 = _0x534431 || currentTask || {};
  const _0x58f5f5 = _0x9f8909.accountId;
  if (_0x3ea1f0.age != null) {
    if (_0x3ea1f0.age === 0) {
      console.log("%c[主页资料] @" + _0x9f8909.nickname + " 主页未显示年龄，记为 0 岁，已同步线索库", "color: #94a3b8; font-weight: bold;");
      reportTraceLog("👤 @" + _0x9f8909.nickname + "：主页未显示年龄，记为 0 岁", _0x58f5f5);
    } else {
      console.log("%c[主页资料] @" + _0x9f8909.nickname + " 年龄 " + _0x3ea1f0.age + " 岁，已同步线索库", "color: #22c55e; font-weight: bold;");
      reportTraceLog("👤 @" + _0x9f8909.nickname + "：主页识别年龄 " + _0x3ea1f0.age + " 岁", _0x58f5f5);
    }
  }
  if (_0x3ea1f0.isPrivate) {
    reportTraceLog("🔒 @" + _0x9f8909.nickname + "：识别为私密账号，已标记到线索", _0x58f5f5, "warning");
  }
  if (_0x3ea1f0.worksCount === 0 || _0x3ea1f0.noWorks) {
    reportTraceLog("📭 @" + _0x9f8909.nickname + "：作品数为 0，已标记到线索", _0x58f5f5, "warning");
  }
  if (isBatchAgeFilterActive(_0x4b58a8) && _0x3ea1f0.age != null) {
    const _0x128c07 = checkBatchAgeFilter(_0x3ea1f0, _0x4b58a8);
    const _0x32a958 = formatAgeFilterRangeLabel(_0x4b58a8);
    if (!_0x128c07.pass) {
      reportTraceLog("👤 @" + _0x9f8909.nickname + "：年龄 " + _0x3ea1f0.age + " 岁，不在设置范围 " + _0x32a958 + "（" + _0x128c07.reason + "）", _0x58f5f5, "warning");
    } else {
      reportTraceLog("👤 @" + _0x9f8909.nickname + "：年龄 " + _0x3ea1f0.age + " 岁，符合设置范围 " + _0x32a958, _0x58f5f5);
    }
  }
  if (_0x96ee05.emit !== false) {
    emitLeadProfileUpdate(_0x9f8909);
  }
  return _0x9f8909;
}
function pickReusableProfileDetail(_0x234afa = {}) {
  return {
    nickname: _0x234afa.nickname || "",
    douyinId: _0x234afa.douyinId || "",
    signature: _0x234afa.signature || "",
    contact: _0x234afa.contact || "",
    location: _0x234afa.location || _0x234afa.ipLocation || "",
    gender: _0x234afa.gender || "未知",
    age: _0x234afa.age ?? null,
    profileAgeChecked: !!_0x234afa.profileAgeChecked,
    isPrivate: !!_0x234afa.isPrivate,
    worksCount: _0x234afa.worksCount,
    genderTimedOut: !!_0x234afa.genderTimedOut,
    genderUnresolved: !!_0x234afa.genderUnresolved,
    genderWaitMs: Number(_0x234afa.genderWaitMs) || 0
  };
}
function emitLeadInteractionUpdate(_0x1f7850, _0x490c9b = {}) {
  if (!_0x1f7850) {
    return;
  }
  Object.assign(_0x1f7850, {
    interactionResolved: true,
    ..._0x490c9b
  });
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [_0x1f7850],
      taskId: activeLoopId,
      viewKey: currentTask?.viewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask)
    });
  } catch (_0x3aa9b1) {}
}
function emitSubviewActionCheckpoint(_0x12f6c3, _0x43a625) {
  if (!_0x12f6c3 || !_0x43a625) {
    return;
  }
  if (currentTask?.isMonitorAction) {
    return;
  }
  try {
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [_0x12f6c3],
      taskId: currentTask?.taskId || currentTask?.parentTaskId || activeLoopId,
      viewKey: currentTask?.viewKey || currentViewKey,
      isAiMode: shouldUseAiCommentAnalysis(currentTask),
      checkpointAction: _0x43a625
    });
    reportTraceLog("💾 @" + (_0x12f6c3.nickname || "用户") + "：" + _0x43a625 + "已同步到线索库", _0x12f6c3.accountId);
  } catch (_0x3bbbf8) {}
}
const LIKE_ERROR_REASON_TEXT = {
  comment_node_not_found: "未定位到该条评论节点（评论区可能已刷新或折叠）",
  like_button_not_found: "未找到该评论的点赞控件",
  like_not_confirmed: "已点击点赞但页面未回显已赞状态",
  like_exception: "点赞过程异常"
};
function describeAttemptedInteractions() {
  const _0x9e4989 = [];
  if (currentTask?.enableLike) {
    _0x9e4989.push("点赞");
  }
  if (currentTask?.enableComment) {
    _0x9e4989.push("回复");
  }
  if (currentTask?.enableFollow) {
    _0x9e4989.push("关注");
  }
  if (currentTask?.enableDM) {
    _0x9e4989.push("私信");
  }
  return _0x9e4989.join("/");
}
function isVideoLocalQuotaExhaustedReason(_0x119380) {
  const _0x147137 = String(_0x119380 || "");
  return _0x147137 === "已达单视频上限" || _0x147137.includes("本视频点赞/回复配额已用完") || _0x147137.includes("单视频上限");
}
function noteVideoLocalQuotaExhaustedOnce(_0x37ffa9) {
  const _0x3f11e2 = "_videoQuotaExhaustedLogged_" + String(_0x37ffa9 || "");
  if (window[_0x3f11e2]) {
    return false;
  }
  window[_0x3f11e2] = true;
  reportTraceLog("已达单视频上限", null, "warning");
  return true;
}
function clearVideoLocalQuotaExhaustedFlag(_0x3e6dc0) {
  try {
    delete window["_videoQuotaExhaustedLogged_" + String(_0x3e6dc0 || "")];
  } catch (_0xba5d4f) {}
}
function resolveInteractionSkipReason(_0x39a7f4, {
  budget = {},
  aiDecision = null,
  interactionEntered = true,
  actionAttempted = false,
  likeErrorCode = ""
} = {}) {
  if (currentTask?.taskMode === "scrape") {
    return "仅采集模式不执行互动";
  }
  if (!_0x39a7f4?.isHighIntention) {
    return "非高意向评论，已跳过互动";
  }
  if (_0x39a7f4?.actionSkipReason) {
    return _0x39a7f4.actionSkipReason;
  }
  if (isInteractionLimitReached()) {
    return "互动总上限已达（" + sessionInteractionCount + "/" + sessionInteractionLimit + "）";
  }
  if (!currentTask?.enableLike && !currentTask?.enableComment && !currentTask?.enableFollow && !currentTask?.enableDM) {
    return "未开启自动点赞/回复/关注/私信";
  }
  const _0x417d02 = Number(budget.likes) || 0;
  const _0x5c72d1 = Number(budget.comments) || 0;
  if (!interactionEntered) {
    return "本视频未分配互动配额（请检查是否开启点赞/回复，或单视频配额是否为 0）";
  }
  if (_0x417d02 <= 0 && _0x5c72d1 <= 0 && (currentTask?.enableLike || currentTask?.enableComment)) {
    return "已达单视频上限";
  }
  if (shouldUseAiCommentAnalysis(currentTask) && !aiDecision) {
    return "AI 模式下未获得分析结果";
  }
  if (aiDecision?.decision === "ignore") {
    return "AI 判定为忽略";
  }
  const _0x53fa26 = hasLocalReplyTemplates() || hasCommentNonTextPayload(false) || !!currentTask?.enableCommentWithoutText;
  const _0x5486d2 = !!String(aiDecision?.replyContent || "").trim() || !!String(_0x39a7f4?.actions?.replyContent || _0x39a7f4?.replyContent || "").trim();
  if (currentTask?.enableComment && !shouldUseAiReplyGeneration(currentTask) && !_0x53fa26) {
    return "未配置本地回复文案且未绑定智能体";
  }
  if (actionAttempted) {
    const _0x4ee3b7 = describeAttemptedInteractions() || "互动";
    const _0x36b82d = LIKE_ERROR_REASON_TEXT[likeErrorCode] || "";
    if (_0x36b82d) {
      return _0x4ee3b7 + "均未成功：" + _0x36b82d;
    } else {
      return _0x4ee3b7 + "均未成功（未找到评论节点或发布未成功）";
    }
  }
  if (currentTask?.enableComment && shouldUseAiReplyGeneration(currentTask) && !_0x53fa26 && !_0x5486d2) {
    return "未绑定智能体或 AI 未生成回复文案";
  }
  if (!currentTask?.enableLike && !currentTask?.enableComment && (currentTask?.enableFollow || currentTask?.enableDM)) {
    return "已尝试关注/私信但未成功";
  }
  return "配额或策略限制，已保留线索";
}
function reportFollowUpLimitReached(_0x15a1b5) {
  const _0x5d6d29 = _0x15a1b5 === "follow";
  const _0xc7cbec = _0x5d6d29 ? sessionFollowCount : sessionDmCount;
  const _0x6ce1d = _0x5d6d29 ? sessionFollowLimit : sessionDmLimit;
  const _0x5d7705 = _0x5d6d29 ? sessionFollowLimitLogged : sessionDmLimitLogged;
  if (_0x6ce1d === Infinity || _0xc7cbec < _0x6ce1d || _0x5d7705) {
    return false;
  }
  const _0x331c56 = _0x5d6d29 ? "关注" : "私信";
  if (_0x5d6d29) {
    sessionFollowLimitLogged = true;
  } else {
    sessionDmLimitLogged = true;
  }
  console.log("%c[节奏控制] 本次任务" + _0x331c56 + "总上限已达 (" + _0xc7cbec + "/" + _0x6ce1d + ")，后续不再" + _0x331c56, _0x5d6d29 ? "color: #8b5cf6; font-weight: bold;" : "color: #10b981; font-weight: bold;");
  reportTraceLog("🛡 本次任务" + _0x331c56 + "总上限已达（" + _0xc7cbec + "/" + _0x6ce1d + "），后续用户不再执行" + _0x331c56, null, "warning");
  reportCurrentAction("本次任务" + _0x331c56 + "已达上限 " + _0xc7cbec + "/" + _0x6ce1d + "，后续不再" + _0x331c56);
  return true;
}
function settleFollowUpFromExistingActions(_0x6687f9, _0x5548b9, _0x103f94) {
  if (!_0x6687f9?.actions || !_0x5548b9) {
    return false;
  }
  let _0x4bd127 = false;
  let _0x1a8898 = false;
  if (_0x6687f9.actions.followed) {
    _0x1a8898 = true;
    const _0x457258 = (_0x6687f9.touchLog || []).some(_0x10b85f => _0x10b85f.type === "follow");
    if (!_0x6687f9.actions._followQuotaSettled) {
      if (_0x5548b9.follows > 0) {
        _0x5548b9.follows--;
      }
      sessionFollowCount++;
      persistSessionInteractionCount();
      _0x6687f9.actions._followQuotaSettled = true;
      if (!_0x457258) {
        recordLeadTouch(_0x6687f9, "follow");
      }
      _0x4bd127 = true;
      reportFollowUpLimitReached("follow");
    }
  }
  if (_0x6687f9.actions.messaged) {
    _0x1a8898 = true;
    const _0x20c8be = (_0x6687f9.touchLog || []).some(_0xe73c48 => _0xe73c48.type === "message");
    if (_0x6687f9.actions.dmSkipped) {
      _0x6687f9.actions._dmQuotaSettled = true;
    } else if (!_0x6687f9.actions._dmQuotaSettled) {
      if (_0x5548b9.dms > 0) {
        _0x5548b9.dms--;
      }
      sessionDmCount++;
      persistSessionInteractionCount();
      _0x6687f9.actions._dmQuotaSettled = true;
      if (!_0x20c8be) {
        recordLeadTouch(_0x6687f9, "message", {
          content: _0x6687f9.actions.dmContent || "已发送私信"
        });
      }
      _0x4bd127 = true;
      reportFollowUpLimitReached("dm");
    }
  }
  if (_0x4bd127) {
    _0x103f94();
  }
  return _0x1a8898;
}
ipcRenderer.on("interaction-result", (_0x40ae9c, _0x5122ba) => {
  console.log("[Built-in-Debug] [主视图] 收到子视图回传结果");
  window._radar_subview_result = _0x5122ba;
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
      set: _0x1b851d => {
        currentTask = _0x1b851d;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: _0x29d2ef => {
        currentViewKey = _0x29d2ef;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: _0x90c83d => {
        lastTrustedClickDiagnostic = _0x90c83d;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x2d252c => {
        stopRequested = _0x2d252c;
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
    getComputedStyle: _0x360bcb => window.getComputedStyle(_0x360bcb),
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
} catch (_0x4085f0) {
  douyinDirectMessageControllerLoadError = _0x4085f0;
  console.error("[Built-in-Debug] 抖音私信控制器加载失败:", _0x4085f0);
}
function logSelfWarmupDm(..._0x2b1170) {
  if (douyinDirectMessageController?.logSelfWarmupDm) {
    return douyinDirectMessageController.logSelfWarmupDm(..._0x2b1170);
  }
  console.warn("[Built-in-Debug] [私信] 控制器不可用", ..._0x2b1170);
}
function replyDmInConversation(..._0x3e2f27) {
  if (douyinDirectMessageController?.replyDmInConversation) {
    return douyinDirectMessageController.replyDmInConversation(..._0x3e2f27);
  }
  const _0x5ac0ba = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
  return Promise.resolve({
    success: false,
    ok: false,
    reason: _0x5ac0ba
  });
}
function sendDmOnCurrentProfile(..._0x1f8631) {
  if (douyinDirectMessageController?.sendDmOnCurrentProfile) {
    return douyinDirectMessageController.sendDmOnCurrentProfile(..._0x1f8631);
  }
  const _0x5f132b = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
  return Promise.resolve({
    success: false,
    ok: false,
    reason: _0x5f132b
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
      set: _0x40fe16 => {
        currentActionMentionRolled = _0x40fe16;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: _0x369a66 => {
        currentRunningSource = _0x369a66;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x36f5b6 => {
        currentTask = _0x36f5b6;
      }
    },
    lastNativeClickBackgroundHosted: {
      enumerable: true,
      get: () => lastNativeClickBackgroundHosted,
      set: _0x3020f7 => {
        lastNativeClickBackgroundHosted = _0x3020f7;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: _0x6cada0 => {
        lastTrustedClickDiagnostic = _0x6cada0;
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
} catch (_0x202d4a) {
  douyinDomInteractionControllerLoadError = _0x202d4a;
  console.error("[Built-in-Debug] 抖音 DOM 交互控制器加载失败:", _0x202d4a);
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
      set: _0x4e5f96 => {
        activeLoopId = _0x4e5f96;
      }
    },
    activeSubviewInteractionId: {
      enumerable: true,
      get: () => activeSubviewInteractionId,
      set: _0x30cc6a => {
        activeSubviewInteractionId = _0x30cc6a;
      }
    },
    cancelledSubviewInteractionIds: {
      enumerable: true,
      get: () => cancelledSubviewInteractionIds,
      set: _0x29f28b => {
        cancelledSubviewInteractionIds = _0x29f28b;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x47fae0 => {
        currentTask = _0x47fae0;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: _0x53feb2 => {
        currentViewKey = _0x53feb2;
      }
    },
    isInteractionView: {
      enumerable: true,
      get: () => isInteractionView,
      set: _0x571ed5 => {
        isInteractionView = _0x571ed5;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: _0x4b6b32 => {
        pausedForSubview = _0x4b6b32;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: _0x3c81fb => {
        sessionDmCount = _0x3c81fb;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: _0x167881 => {
        sessionDmLimit = _0x167881;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: _0x102305 => {
        sessionFollowCount = _0x102305;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: _0x252c0f => {
        sessionFollowLimit = _0x252c0f;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x520635 => {
        stopRequested = _0x520635;
      }
    },
    subviewTaskAls: {
      enumerable: true,
      get: () => subviewTaskAls,
      set: _0x1e4013 => {
        subviewTaskAls = _0x1e4013;
      }
    },
    subviewTaskSeq: {
      enumerable: true,
      get: () => subviewTaskSeq,
      set: _0x2abc9a => {
        subviewTaskSeq = _0x2abc9a;
      }
    },
    subviewTaskStarted: {
      enumerable: true,
      get: () => subviewTaskStarted,
      set: _0x1968a7 => {
        subviewTaskStarted = _0x1968a7;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x555041 => {
        taskRunning = _0x555041;
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
} catch (_0x1111b1) {
  profileInteractionControllerLoadError = _0x1111b1;
  console.error("[Built-in-Debug] 子视图主页互动控制器加载失败:", _0x1111b1);
}
function appendRandomEmojiSuffix(..._0x309ea1) {
  return profileInteractionController?.appendRandomEmojiSuffix(..._0x309ea1) || "";
}
function applyFollowUpActions(..._0x3b9e32) {
  return profileInteractionController?.applyFollowUpActions(..._0x3b9e32);
}
function applyRiskyEmojiReplaceForComment(..._0x3c311c) {
  return profileInteractionController?.applyRiskyEmojiReplaceForComment(..._0x3c311c) || "";
}
function checkBatchAgeFilter(..._0x82de46) {
  return profileInteractionController?.checkBatchAgeFilter(..._0x82de46);
}
function classifyCommentFailureToastLocal(..._0x2841f0) {
  return profileInteractionController?.classifyCommentFailureToastLocal(..._0x2841f0) || "";
}
function closeAllModals(..._0x4bbc02) {
  return profileInteractionController?.closeAllModals(..._0x4bbc02);
}
function commentDraftHasCoreTextLocal(..._0x4433c0) {
  return profileInteractionController?.commentDraftHasCoreTextLocal(..._0x4433c0) || false;
}
function evaluateTaskGenderFilter(..._0x52215e) {
  return profileInteractionController?.evaluateTaskGenderFilter(..._0x52215e);
}
function extractUserIdFromUrl(..._0x50f66f) {
  return profileInteractionController?.extractUserIdFromUrl(..._0x50f66f) || "";
}
function findProfileFollowButtonByText(..._0x1a749d) {
  return profileInteractionController?.findProfileFollowButtonByText(..._0x1a749d);
}
function findProfileMessageButtonByText(..._0x4189e5) {
  return profileInteractionController?.findProfileMessageButtonByText(..._0x4189e5);
}
function findSmartElementQuiet(..._0x55508a) {
  return profileInteractionController?.findSmartElementQuiet(..._0x55508a);
}
function formatAgeFilterRangeLabel(..._0x474ec5) {
  return profileInteractionController?.formatAgeFilterRangeLabel(..._0x474ec5) || "";
}
function formatObservedAgeLabel(..._0x195138) {
  return profileInteractionController?.formatObservedAgeLabel(..._0x195138) || "";
}
function getElementClassText(..._0x1c263e) {
  return profileInteractionController?.getElementClassText(..._0x1c263e) || "";
}
function isBatchAgeFilterActive(..._0x1e0456) {
  return profileInteractionController?.isBatchAgeFilterActive(..._0x1e0456) || false;
}
function isCommentDraftOnlyEmojiDriftLocal(..._0x54ba55) {
  return profileInteractionController?.isCommentDraftOnlyEmojiDriftLocal(..._0x54ba55) || false;
}
function isRejectedProfileNicknameCandidate(..._0x3ed5b2) {
  return profileInteractionController?.isRejectedProfileNicknameCandidate(..._0x3ed5b2) || false;
}
function parseProfileGenderFromApiPayload(..._0x4f222d) {
  return profileInteractionController?.parseProfileGenderFromApiPayload(..._0x4f222d);
}
function performProfileActionsLogic(..._0x531ef8) {
  return profileInteractionController?.performProfileActionsLogic(..._0x531ef8);
}
function rememberProfileApiGenderHit(..._0x53a21a) {
  return profileInteractionController?.rememberProfileApiGenderHit(..._0x53a21a);
}
function replaceRiskyCommentEmojisLocal(..._0xc85f1) {
  return profileInteractionController?.replaceRiskyCommentEmojisLocal(..._0xc85f1) || "";
}
function resolveFollowUpFlags(..._0x2a81dd) {
  return profileInteractionController?.resolveFollowUpFlags(..._0x2a81dd);
}
function resolveProfileFirstGenderFilter(..._0x1e20d5) {
  return profileInteractionController?.resolveProfileFirstGenderFilter(..._0x1e20d5) || "";
}
function resolveTaskGenderFilter(..._0x57be70) {
  return profileInteractionController?.resolveTaskGenderFilter(..._0x57be70) || "";
}
function scrapeDetailedProfile(..._0x5a5871) {
  return profileInteractionController?.scrapeDetailedProfile(..._0x5a5871);
}
function shouldAppendCommentRandomSuffix(..._0x558982) {
  return profileInteractionController?.shouldAppendCommentRandomSuffix(..._0x558982) || false;
}
function shouldAppendVideoCommentRandomSuffix(..._0x43b0de) {
  return profileInteractionController?.shouldAppendVideoCommentRandomSuffix(..._0x43b0de) || false;
}
function waitForSmartElement(..._0x303edc) {
  return profileInteractionController?.waitForSmartElement(..._0x303edc);
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
      set: _0x102fd7 => {
        activeLoopId = _0x102fd7;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x247928 => {
        currentTask = _0x247928;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: _0x89011c => {
        lockedLeadVideoUrl = _0x89011c;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: _0x59a21e => {
        pausedForSubview = _0x59a21e;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: _0x3dfbc5 => {
        processedVideos = _0x3dfbc5;
      }
    },
    scrapeAiQueue: {
      enumerable: true,
      get: () => scrapeAiQueue,
      set: _0x48565e => {
        scrapeAiQueue = _0x48565e;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x1a8d15 => {
        stopRequested = _0x1a8d15;
      }
    },
    subviewTaskAls: {
      enumerable: true,
      get: () => subviewTaskAls,
      set: _0x1526df => {
        subviewTaskAls = _0x1526df;
      }
    },
    subviewTaskSeq: {
      enumerable: true,
      get: () => subviewTaskSeq,
      set: _0x350b47 => {
        subviewTaskSeq = _0x350b47;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x1949e0 => {
        taskRunning = _0x1949e0;
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
} catch (_0x59b49b) {
  automationMediaControllerLoadError = _0x59b49b;
  console.error("[Built-in-Debug] 自动化媒体守护控制器加载失败:", _0x59b49b);
}
function burstPauseWithinOneSecond(..._0x56de91) {
  return automationMediaController?.burstPauseWithinOneSecond(..._0x56de91);
}
function getCurrentContentPauseProfile(..._0x51d72f) {
  return automationMediaController?.getCurrentContentPauseProfile(..._0x51d72f);
}
function getCurrentVideoGuardState(..._0x8edf7e) {
  return automationMediaController?.getCurrentVideoGuardState(..._0x8edf7e);
}
function getVisibleDouyinVideoDurationMs(..._0x2e0b66) {
  return automationMediaController?.getVisibleDouyinVideoDurationMs(..._0x2e0b66);
}
function guardedCurrentVideoDelay(..._0x5179c0) {
  return automationMediaController?.guardedCurrentVideoDelay(..._0x5179c0) || Promise.resolve();
}
function guardedPauseDelay(..._0x38d533) {
  return automationMediaController?.guardedPauseDelay(..._0x38d533) || Promise.resolve();
}
function isAiInvokeCancelled(..._0x1b0466) {
  if (!automationMediaController) {
    return true;
  }
  return automationMediaController.isAiInvokeCancelled(..._0x1b0466);
}
function isMonitorLoopId(..._0x3f36e0) {
  return automationMediaController?.isMonitorLoopId(..._0x3f36e0) || false;
}
function isSameVideoTitleLoose(..._0x47a6d4) {
  return automationMediaController?.isSameVideoTitleLoose(..._0x47a6d4) || false;
}
function pauseVisibleDouyinVideos(..._0x320737) {
  return automationMediaController?.pauseVisibleDouyinVideos(..._0x320737) || 0;
}
function randomDelay(..._0xbed713) {
  return automationMediaController?.randomDelay(..._0xbed713) || Promise.resolve();
}
function randomDelayWithinDeadline(..._0x46b45d) {
  return automationMediaController?.randomDelayWithinDeadline(..._0x46b45d) || Promise.resolve();
}
function releaseAbandonedVideoClaim(..._0x4eb4bb) {
  return automationMediaController?.releaseAbandonedVideoClaim(..._0x4eb4bb);
}
function resetScrapeAiQueueOnStop(..._0x3f92db) {
  return automationMediaController?.resetScrapeAiQueueOnStop(..._0x3f92db);
}
function resumeVisibleDouyinVideos(..._0x519d6d) {
  return automationMediaController?.resumeVisibleDouyinVideos(..._0x519d6d) || 0;
}
function shouldAbort(..._0x509b79) {
  if (!automationMediaController) {
    return true;
  }
  return automationMediaController.shouldAbort(..._0x509b79);
}
function sleepWithinDeadline(..._0x211fb2) {
  return automationMediaController?.sleepWithinDeadline(..._0x211fb2) || Promise.resolve();
}
function startCurrentVideoPauseGuard(..._0x32bba7) {
  return automationMediaController?.startCurrentVideoPauseGuard(..._0x32bba7);
}
function isCurrentVideoPauseGuardDrifted(_0x534499) {
  if (!_0x534499) {
    return false;
  }
  if (_0x534499.drifted) {
    return true;
  }
  if (_0x534499.lastState) {
    return !_0x534499.lastState.same;
  } else {
    return false;
  }
}
async function awaitInteractionCooldown(_0x169bbd, _0x3b2d29 = {}) {
  const _0x2503f3 = parseInt(currentTask?.intervalMin, 10) || 5;
  const _0x241a0a = parseInt(currentTask?.intervalMax, 10) || 12;
  const _0x25cae3 = _0x3b2d29.profileWorkCommented ? "主页评论后间隔" : "互动间隔";
  const _0x2cc074 = Math.floor(Math.random() * (_0x241a0a - _0x2503f3 + 1) + _0x2503f3);
  console.log("%c[节奏控制] 本条线索互动已完成，冷却 " + _0x2cc074 + " 秒后继续（可在设置里调整「互动间隔」）", "color: #94a3b8; font-style: italic;");
  reportTraceLog("🛡 节奏冷却：本条互动完成，随机等待 " + _0x2cc074 + " 秒后继续");
  await randomDelay(_0x2cc074 * 1000, _0x2cc074 * 1000, _0x169bbd, _0x25cae3);
}
async function awaitPostActionRest(_0x5bee3a, _0x103790 = {}) {
  if (_0x103790.profileWork) {
    await randomDelay(800, 1500, _0x5bee3a, "操作后休眠");
  } else {
    await randomDelay(2000, 4000, _0x5bee3a, "操作后休眠");
  }
}
function buildVideoCardLead(..._0x49adb5) {
  return douyinSearchMetadataController?.buildVideoCardLead(..._0x49adb5);
}
function canLinkOnlyScrapeWithoutOpen(..._0x3e55bc) {
  return douyinSearchMetadataController?.canLinkOnlyScrapeWithoutOpen(..._0x3e55bc) || false;
}
function collectDouyinSearchResultCards(..._0x200ddb) {
  return douyinSearchMetadataController?.collectDouyinSearchResultCards(..._0x200ddb) || [];
}
function emitLinkOnlyScrapeLead(..._0x1bfbe0) {
  return douyinSearchMetadataController?.emitLinkOnlyScrapeLead(..._0x1bfbe0);
}
function emitVideoCardLead(..._0x18a1cf) {
  return douyinSearchMetadataController?.emitVideoCardLead(..._0x18a1cf);
}
function ensureLeadgenScrapeApiBridge(..._0x4645a9) {
  return douyinSearchMetadataController?.ensureLeadgenScrapeApiBridge(..._0x4645a9) || false;
}
function ensureLeadgenScrapeApiHook(..._0x44f4c9) {
  return douyinSearchMetadataController?.ensureLeadgenScrapeApiHook(..._0x44f4c9) || false;
}
function findAwemeIdForCard(..._0x2a537c) {
  return douyinSearchMetadataController?.findAwemeIdForCard(..._0x2a537c);
}
function findDouyinSearchCardContentId(..._0x424f19) {
  return douyinSearchMetadataController?.findDouyinSearchCardContentId(..._0x424f19) || "";
}
function findSearchCardAuthorNickname(..._0x4b2ecb) {
  return douyinSearchMetadataController?.findSearchCardAuthorNickname(..._0x4b2ecb) || "";
}
function findSearchCardAuthorProfileUrl(..._0x343b46) {
  return douyinSearchMetadataController?.findSearchCardAuthorProfileUrl(..._0x343b46) || "";
}
function findSearchCardVideoUrl(..._0x2cce97) {
  return douyinSearchMetadataController?.findSearchCardVideoUrl(..._0x2cce97) || "";
}
function getDouyinSearchCardClickTarget(..._0x54dc0c) {
  return douyinSearchMetadataController?.getDouyinSearchCardClickTarget(..._0x54dc0c);
}
function getDouyinSearchCardRoot(..._0x9c296c) {
  return douyinSearchMetadataController?.getDouyinSearchCardRoot(..._0x9c296c);
}
function getDouyinSearchZeroDiagnostics(..._0x480691) {
  return douyinSearchMetadataController?.getDouyinSearchZeroDiagnostics(..._0x480691);
}
function getDouyinVideoAuthorApi(..._0x5cf3e5) {
  return douyinSearchMetadataController?.getDouyinVideoAuthorApi(..._0x5cf3e5);
}
function getScrapeTargetSet(..._0x5ae0c0) {
  return douyinSearchMetadataController?.getScrapeTargetSet(..._0x5ae0c0);
}
function isLinkOnlyScrapeTask(..._0x474b2c) {
  return douyinSearchMetadataController?.isLinkOnlyScrapeTask(..._0x474b2c) || false;
}
function listLeadgenScrapeAwemes(..._0x34c6b0) {
  return douyinSearchMetadataController?.listLeadgenScrapeAwemes(..._0x34c6b0) || [];
}
function clearLeadgenScrapeAwemeCache(..._0x5b3ced) {
  return douyinSearchMetadataController?.clearLeadgenScrapeAwemeCache(..._0x5b3ced);
}
function lookupLeadgenScrapeAweme(..._0x4d56bf) {
  return douyinSearchMetadataController?.lookupLeadgenScrapeAweme(..._0x4d56bf);
}
function maybeReportDouyinSearchZeroDiagnostics(..._0x2a1ddb) {
  return douyinSearchMetadataController?.maybeReportDouyinSearchZeroDiagnostics(..._0x2a1ddb);
}
function normalizeDouyinAuthorProfileUrl(..._0x505be7) {
  return douyinSearchMetadataController?.normalizeDouyinAuthorProfileUrl(..._0x505be7) || "";
}
function resolveSearchCardScrapeFields(..._0x1716dd) {
  return douyinSearchMetadataController?.resolveSearchCardScrapeFields(..._0x1716dd);
}
function shouldCollectScrapeVideoMetadata(..._0x12d603) {
  return douyinSearchMetadataController?.shouldCollectScrapeVideoMetadata(..._0x12d603) || false;
}
function waitLeadgenScrapeAwemeAuthor(..._0x28cdf3) {
  return douyinSearchMetadataController?.waitLeadgenScrapeAwemeAuthor(..._0x28cdf3);
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
      set: _0x5d4a05 => {
        currentTask = _0x5d4a05;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: _0x251bef => {
        lastClickedId = _0x251bef;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: _0x326aa9 => {
        processedVideos = _0x326aa9;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: _0x2005a3 => {
        sessionProcessedCount = _0x2005a3;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: _0x3f3195 => {
        targetVideoCount = _0x3f3195;
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
} catch (_0x198e39) {
  searchVideoQueueControllerLoadError = _0x198e39;
  console.error("[Built-in-Debug] 搜索视频队列控制器加载失败:", _0x198e39);
}
function advanceAfterSearchQueuedVideo(..._0x4a2e89) {
  return searchVideoQueueController?.advanceAfterSearchQueuedVideo(..._0x4a2e89);
}
function buildDouyinSearchResultCardMap(..._0x33440a) {
  return searchVideoQueueController?.buildDouyinSearchResultCardMap(..._0x33440a);
}
function clearSearchPendingOpenUrl(..._0x1c202c) {
  return searchVideoQueueController?.clearSearchPendingOpenUrl(..._0x1c202c);
}
function clearSearchSlideOscillationState(..._0xa20075) {
  return searchVideoQueueController?.clearSearchSlideOscillationState(..._0xa20075);
}
function clearSearchVideoUrlQueue(..._0x56e083) {
  return searchVideoQueueController?.clearSearchVideoUrlQueue(..._0x56e083);
}
function collectSearchVideoUrlsForCommentTask(..._0x8a2e61) {
  return searchVideoQueueController?.collectSearchVideoUrlsForCommentTask(..._0x8a2e61);
}
function findNextUnprocessedSearchQueueUrl(..._0x364ecb) {
  return searchVideoQueueController?.findNextUnprocessedSearchQueueUrl(..._0x364ecb);
}
function isSearchQueueUrlSessionDone(..._0xa0484d) {
  return searchVideoQueueController?.isSearchQueueUrlSessionDone(..._0xa0484d);
}
function markSearchQueueUrlSkipped(..._0x5c0679) {
  return searchVideoQueueController?.markSearchQueueUrlSkipped(..._0x5c0679) || "";
}
function normalizeSearchQueueVideoUrl(..._0x45732c) {
  return searchVideoQueueController?.normalizeSearchQueueVideoUrl(..._0x45732c) || "";
}
function noteSearchSlideVideoKey(..._0x4e9a9e) {
  return searchVideoQueueController?.noteSearchSlideVideoKey(..._0x4e9a9e);
}
function openSearchQueueVideoByUrl(..._0x363611) {
  return searchVideoQueueController?.openSearchQueueVideoByUrl(..._0x363611);
}
function peekSearchPendingOpenUrl(..._0x47ee88) {
  return searchVideoQueueController?.peekSearchPendingOpenUrl(..._0x47ee88) || "";
}
function setSearchPendingOpenUrl(..._0x44760d) {
  return searchVideoQueueController?.setSearchPendingOpenUrl(..._0x44760d) || "";
}
function shouldUseSearchVideoUrlQueue(..._0x271c2f) {
  return searchVideoQueueController?.shouldUseSearchVideoUrlQueue(..._0x271c2f) || false;
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
      set: _0x8dd414 => {
        activeLoopId = _0x8dd414;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: _0x2778d9 => {
        currentRunningSource = _0x2778d9;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x273f70 => {
        currentTask = _0x273f70;
      }
    },
    lastDouyinSearchZeroDiagAt: {
      enumerable: true,
      get: () => lastDouyinSearchZeroDiagAt,
      set: _0x535041 => {
        lastDouyinSearchZeroDiagAt = _0x535041;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: _0x4c5f2e => {
        processedVideos = _0x4c5f2e;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: _0x1749da => {
        sessionProcessedCount = _0x1749da;
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
} catch (_0x285415) {
  douyinSearchMetadataControllerLoadError = _0x285415;
  console.error("[Built-in-Debug] 抖音搜索元数据控制器加载失败:", _0x285415);
}
function appendCommentMentionsAfterAttachments(..._0x326717) {
  return douyinDomInteractionController?.appendCommentMentionsAfterAttachments(..._0x326717);
}
function composeCommentInputWithMentions(..._0x5035a9) {
  return douyinDomInteractionController?.composeCommentInputWithMentions(..._0x5035a9);
}
function findSmartElement(..._0x27a0de) {
  return douyinDomInteractionController?.findSmartElement(..._0x27a0de);
}
function focusWithoutScroll(..._0x3acd81) {
  return douyinDomInteractionController?.focusWithoutScroll(..._0x3acd81);
}
function insertTextIntoEditable(..._0x4d28f5) {
  return douyinDomInteractionController?.insertTextIntoEditable(..._0x4d28f5);
}
function isElementInViewport(..._0xa6fb81) {
  return douyinDomInteractionController?.isElementInViewport(..._0xa6fb81) || false;
}
function isElementInViewportForAutomation(..._0x124464) {
  return douyinDomInteractionController?.isElementInViewportForAutomation(..._0x124464) || false;
}
function isVisibleElement(..._0x354b3f) {
  return douyinDomInteractionController?.isVisibleElement(..._0x354b3f) || false;
}
function reportMentionDebug(..._0x48c55a) {
  return douyinDomInteractionController?.reportMentionDebug(..._0x48c55a);
}
function resolveActiveMentionPercent(..._0x241c98) {
  return douyinDomInteractionController?.resolveActiveMentionPercent(..._0x241c98);
}
function resolveCommentMentionPosition(..._0x5244ac) {
  return douyinDomInteractionController?.resolveCommentMentionPosition(..._0x5244ac) || "";
}
function rollMentionProbability(..._0x3f0ff6) {
  return douyinDomInteractionController?.rollMentionProbability(..._0x3f0ff6);
}
function safeScrollTargetIntoView(..._0x31a440) {
  return douyinDomInteractionController?.safeScrollTargetIntoView(..._0x31a440);
}
function shouldUseCommentMentions(..._0x17a8f3) {
  return douyinDomInteractionController?.shouldUseCommentMentions(..._0x17a8f3) || false;
}
function simulateHumanClick(..._0x52eaec) {
  return douyinDomInteractionController?.simulateHumanClick(..._0x52eaec);
}
function simulateTrustedElementClick(..._0x519efb) {
  return douyinDomInteractionController?.simulateTrustedElementClick(..._0x519efb);
}
function simulateTrustedEnter(..._0x2c2636) {
  return douyinDomInteractionController?.simulateTrustedEnter(..._0x2c2636);
}
function simulateTrustedKey(..._0x31f7b8) {
  return douyinDomInteractionController?.simulateTrustedKey(..._0x31f7b8);
}
function waitForDmInput(..._0x265c94) {
  return douyinDomInteractionController?.waitForDmInput(..._0x265c94);
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
      set: _0x501cb4 => {
        allowSpecificReprocess = _0x501cb4;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: _0x43420d => {
        currentRunningSource = _0x43420d;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x25cf83 => {
        currentTask = _0x25cf83;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: _0x4233c8 => {
        lastClickedId = _0x4233c8;
      }
    },
    pendingTaskRestart: {
      enumerable: true,
      get: () => pendingTaskRestart,
      set: _0x1c55a1 => {
        pendingTaskRestart = _0x1c55a1;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: _0x26b80c => {
        processedVideos = _0x26b80c;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: _0x51a1d1 => {
        sessionProcessedCount = _0x51a1d1;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: _0x5a7f86 => {
        targetVideoCount = _0x5a7f86;
      }
    },
    videoMainCommentedVideoIds: {
      enumerable: true,
      get: () => videoMainCommentedVideoIds,
      set: _0x24d2d9 => {
        videoMainCommentedVideoIds = _0x24d2d9;
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
} catch (_0x10ae4d) {
  specificVideoNavigationControllerLoadError = _0x10ae4d;
  console.error("[Built-in-Debug] 指定视频导航控制器加载失败:", _0x10ae4d);
}
function awaitSpecificVideoOpenSettle(..._0x495a9e) {
  return specificVideoNavigationController?.awaitSpecificVideoOpenSettle(..._0x495a9e);
}
function clearClaimedSpecificVideoUrl(..._0x2a53f1) {
  return specificVideoNavigationController?.clearClaimedSpecificVideoUrl(..._0x2a53f1);
}
function clickCommentPanelLoadingPlaceholder(..._0x578035) {
  return specificVideoNavigationController?.clickCommentPanelLoadingPlaceholder(..._0x578035);
}
function consumeTaskRestartFlag(..._0x1bc3e0) {
  return specificVideoNavigationController?.consumeTaskRestartFlag(..._0x1bc3e0);
}
function convertToDouyinModalUrl(..._0x520ff8) {
  return specificVideoNavigationController?.convertToDouyinModalUrl(..._0x520ff8) || "";
}
function describeSpecificVideoSkipReason(..._0x1f4a72) {
  return specificVideoNavigationController?.describeSpecificVideoSkipReason(..._0x1f4a72);
}
function ensureClaimedSpecificVideoUrl(..._0x35e3fb) {
  return specificVideoNavigationController?.ensureClaimedSpecificVideoUrl(..._0x35e3fb);
}
function evaluateSpecificVideoOpenProgress(..._0x5073f9) {
  return specificVideoNavigationController?.evaluateSpecificVideoOpenProgress(..._0x5073f9);
}
function extractSpecificVideoId(..._0x2ccdac) {
  return specificVideoNavigationController?.extractSpecificVideoId(..._0x2ccdac) || "";
}
function finishSpecificSourceTask(..._0xb00b0f) {
  return specificVideoNavigationController?.finishSpecificSourceTask(..._0xb00b0f);
}
function getPlannedVideoCountForDisplay(..._0x53a773) {
  return specificVideoNavigationController?.getPlannedVideoCountForDisplay(..._0x53a773);
}
function getSpecificPlannedVideoCount(..._0x3fd854) {
  return specificVideoNavigationController?.getSpecificPlannedVideoCount(..._0x3fd854);
}
function getSpecificVideoProbeState(..._0x4e788f) {
  return specificVideoNavigationController?.getSpecificVideoProbeState(..._0x4e788f);
}
function getSpecificVideoUrlList(..._0x5dbbcb) {
  return specificVideoNavigationController?.getSpecificVideoUrlList(..._0x5dbbcb);
}
function hasSpecificVideoTargetInUrl(..._0x4aa28f) {
  return specificVideoNavigationController?.hasSpecificVideoTargetInUrl(..._0x4aa28f) || false;
}
function hasVideoMainCommented(..._0x3eabb3) {
  return specificVideoNavigationController?.hasVideoMainCommented(..._0x3eabb3) || false;
}
function initProcessedVideosFromTask(..._0x4738b7) {
  return specificVideoNavigationController?.initProcessedVideosFromTask(..._0x4738b7);
}
function initVideoMainCommentMemoryFromTask(..._0x487e60) {
  return specificVideoNavigationController?.initVideoMainCommentMemoryFromTask(..._0x487e60);
}
function isDouyinJingxuanContentLoading(..._0x4d4d78) {
  return specificVideoNavigationController?.isDouyinJingxuanContentLoading(..._0x4d4d78) || false;
}
function isDouyinSearchPageContentLoading(..._0x39278d) {
  return specificVideoNavigationController?.isDouyinSearchPageContentLoading(..._0x39278d) || false;
}
function isDouyinSpecificVideoUnavailable(..._0x5320c9) {
  return specificVideoNavigationController?.isDouyinSpecificVideoUnavailable(..._0x5320c9) || false;
}
function isDouyinVisibleLoadingPlaceholder(..._0xf90ee5) {
  return specificVideoNavigationController?.isDouyinVisibleLoadingPlaceholder(..._0xf90ee5) || false;
}
function isOnSpecificTargetVideo(..._0x4cc391) {
  return specificVideoNavigationController?.isOnSpecificTargetVideo(..._0x4cc391) || false;
}
function isSpecificVideoCompletedThisSession(..._0x2c83c0) {
  return specificVideoNavigationController?.isSpecificVideoCompletedThisSession(..._0x2c83c0) || false;
}
function isSpecificVideoDetailReady(..._0x3be98b) {
  return specificVideoNavigationController?.isSpecificVideoDetailReady(..._0x3be98b) || false;
}
function isVideoInSpecificList(..._0x1d4784) {
  return specificVideoNavigationController?.isVideoInSpecificList(..._0x1d4784) || false;
}
function loadSpecificVideoState(..._0x1b568e) {
  return specificVideoNavigationController?.loadSpecificVideoState(..._0x1b568e);
}
function markSpecificVideoCompletedThisSession(..._0x39fdfb) {
  return specificVideoNavigationController?.markSpecificVideoCompletedThisSession(..._0x39fdfb);
}
function markSpecificVideoHandled(..._0x4aa3cf) {
  return specificVideoNavigationController?.markSpecificVideoHandled(..._0x4aa3cf);
}
function markTaskRestartFromPayload(..._0x3d19ca) {
  return specificVideoNavigationController?.markTaskRestartFromPayload(..._0x3d19ca);
}
function normalizeSpecificVideoKey(..._0x5c30a3) {
  return specificVideoNavigationController?.normalizeSpecificVideoKey(..._0x5c30a3) || "";
}
function openSpecificVideoWithRetries(..._0x5a95f3) {
  return specificVideoNavigationController?.openSpecificVideoWithRetries(..._0x5a95f3);
}
function probeSpecificVideoOnDirectPage(..._0x5d11b2) {
  return specificVideoNavigationController?.probeSpecificVideoOnDirectPage(..._0x5d11b2);
}
function rememberVideoMainComment(..._0x31ade8) {
  return specificVideoNavigationController?.rememberVideoMainComment(..._0x31ade8);
}
function resolveDouyinVideoDetailModal(..._0x6c4848) {
  return specificVideoNavigationController?.resolveDouyinVideoDetailModal(..._0x6c4848);
}
function saveSpecificVideoState(..._0x3c4c19) {
  return specificVideoNavigationController?.saveSpecificVideoState(..._0x3c4c19);
}
function shouldBypassSpecificBrowseDedup(..._0x62169d) {
  return specificVideoNavigationController?.shouldBypassSpecificBrowseDedup(..._0x62169d) || false;
}
function shouldReprocessConfiguredSpecific(..._0x25f37b) {
  return specificVideoNavigationController?.shouldReprocessConfiguredSpecific(..._0x25f37b) || false;
}
function skipFailedSpecificVideoAndOpenNext(..._0x229d94) {
  return specificVideoNavigationController?.skipFailedSpecificVideoAndOpenNext(..._0x229d94);
}
function toSpecificVideoDirectUrl(..._0x3cf88b) {
  return specificVideoNavigationController?.toSpecificVideoDirectUrl(..._0x3cf88b) || "";
}
function toSpecificVideoJingxuanUrl(..._0x27ee20) {
  return specificVideoNavigationController?.toSpecificVideoJingxuanUrl(..._0x27ee20) || "";
}
function usesSpecificVideoPool(..._0xc2bcd2) {
  return specificVideoNavigationController?.usesSpecificVideoPool(..._0xc2bcd2) || false;
}
function waitSpecificVideoNavAppear(..._0x18ec2b) {
  return specificVideoNavigationController?.waitSpecificVideoNavAppear(..._0x18ec2b);
}
function normalizeUrl(_0x3efcaf) {
  if (!_0x3efcaf) {
    return "";
  }
  try {
    let _0xab07f2 = _0x3efcaf.trim();
    if (_0xab07f2.startsWith("//")) {
      _0xab07f2 = "https:" + _0xab07f2;
    }
    const _0x5ae28b = new URL(_0xab07f2);
    const _0x54c588 = _0x5ae28b.searchParams.get("modal_id") || _0x5ae28b.searchParams.get("vid") || _0x5ae28b.searchParams.get("aweme_id");
    if (_0x54c588 && /^\d+$/.test(_0x54c588)) {
      return "https://www.douyin.com/video/" + _0x54c588;
    }
    const _0x32c7c1 = _0x5ae28b.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (_0x32c7c1 && _0x32c7c1[1]) {
      return "https://www.douyin.com/video/" + _0x32c7c1[1];
    }
    return _0x5ae28b.origin + _0x5ae28b.pathname.replace(/\/$/, "");
  } catch (_0x56e2cf) {
    return _0x3efcaf;
  }
}
let _processedVideoKeyModule;
function getProcessedVideoKeyModule() {
  if (_processedVideoKeyModule !== undefined) {
    return _processedVideoKeyModule;
  }
  try {
    _processedVideoKeyModule = require("./shared/processedVideoKey");
  } catch (_0x21c4a2) {
    console.warn("[Built-in-Debug] processedVideoKey 加载失败，回退 normalizeUrl:", _0x21c4a2.message);
    _processedVideoKeyModule = {
      extractDouyinVideoId: extractVideoIdFromHref,
      normalizeProcessedVideoKey: normalizeUrl,
      rememberProcessedVideoKey: (_0x346715, _0x23dd38) => {
        if (!_0x346715 || !_0x23dd38) {
          return;
        }
        _0x346715.add(_0x23dd38);
        const _0x3239ab = normalizeUrl(_0x23dd38);
        if (_0x3239ab && _0x3239ab !== _0x23dd38) {
          _0x346715.add(_0x3239ab);
        }
        const _0x28faba = extractVideoIdFromHref(_0x23dd38);
        if (_0x28faba) {
          _0x346715.add("https://www.douyin.com/video/" + _0x28faba);
        }
      },
      hasProcessedVideoKey: (_0x99f1b0, _0xf62b00) => {
        if (!_0x99f1b0 || !_0xf62b00) {
          return false;
        }
        if (_0x99f1b0.has(_0xf62b00) || _0x99f1b0.has(normalizeUrl(_0xf62b00))) {
          return true;
        }
        const _0x2aea73 = extractVideoIdFromHref(_0xf62b00);
        if (!_0x2aea73) {
          return false;
        }
        for (const _0x41df4d of _0x99f1b0) {
          if (extractVideoIdFromHref(_0x41df4d) === _0x2aea73) {
            return true;
          }
        }
        return false;
      },
      forgetProcessedVideoKey: (_0x1ad6b2, _0x4a1970) => {
        if (!_0x1ad6b2 || !_0x4a1970) {
          return;
        }
        _0x1ad6b2.delete(_0x4a1970);
        const _0x55bf33 = normalizeUrl(_0x4a1970);
        if (_0x55bf33) {
          _0x1ad6b2.delete(_0x55bf33);
        }
        const _0xfc5d6c = extractVideoIdFromHref(_0x4a1970);
        if (!_0xfc5d6c) {
          return;
        }
        for (const _0x26a566 of [..._0x1ad6b2]) {
          if (extractVideoIdFromHref(_0x26a566) === _0xfc5d6c) {
            _0x1ad6b2.delete(_0x26a566);
          }
        }
      },
      initProcessedVideoSet: _0x3fe640 => {
        const _0x177fdb = new Set();
        (_0x3fe640 || []).forEach(_0x261009 => {
          _0x177fdb.add(_0x261009);
          const _0x554f65 = normalizeUrl(_0x261009);
          if (_0x554f65) {
            _0x177fdb.add(_0x554f65);
          }
        });
        return _0x177fdb;
      }
    };
  }
  return _processedVideoKeyModule;
}
function isDouyinVideoShareUrl(_0x2af30d) {
  return /douyin\.com\/(video|note)\/\d+/.test(String(_0x2af30d || ""));
}
function extractVideoIdFromHref(_0xffae54) {
  if (!_0xffae54) {
    return "";
  }
  try {
    const _0x128f00 = _0xffae54.startsWith("http") ? _0xffae54 : "https://www.douyin.com" + (_0xffae54.startsWith("/") ? _0xffae54 : "/" + _0xffae54);
    const _0x3fe29f = new URL(_0x128f00);
    const _0x33243b = _0x3fe29f.searchParams.get("modal_id") || _0x3fe29f.searchParams.get("vid") || _0x3fe29f.searchParams.get("aweme_id");
    if (_0x33243b && /^\d+$/.test(_0x33243b)) {
      return _0x33243b;
    }
    const _0x3d6e03 = _0x3fe29f.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (_0x3d6e03?.[1]) {
      return _0x3d6e03[1];
    }
  } catch (_0xf1dd54) {}
  const _0x6e1977 = String(_0xffae54).match(/(?:share\/)?(?:video|note|modal_id=|vid=|aweme_id=)(\d{15,})/);
  return _0x6e1977?.[1] || "";
}
function buildDouyinVideoShareUrl(_0x1a7d0e) {
  if (!_0x1a7d0e) {
    return "";
  }
  return "https://www.douyin.com/video/" + _0x1a7d0e;
}
function rememberPendingLeadVideoUrl(_0x40a175) {
  const _0x3c8d1f = normalizeUrl(_0x40a175);
  if (isDouyinVideoShareUrl(_0x3c8d1f)) {
    pendingLeadVideoUrl = _0x3c8d1f;
    pendingLeadVideoUrlAt = Date.now();
  }
}
function peekPendingLeadVideoUrl(_0x600874 = 120000) {
  if (!pendingLeadVideoUrl || Date.now() - pendingLeadVideoUrlAt > _0x600874) {
    return "";
  }
  return pendingLeadVideoUrl;
}
function clearPendingLeadVideoUrl() {
  pendingLeadVideoUrl = "";
  pendingLeadVideoUrlAt = 0;
  clearLockedLeadVideoUrl();
}
function isDouyinNonVideoPageUrl(_0x59e102) {
  const _0x1f8b80 = String(_0x59e102 || "");
  if (isDouyinVideoShareUrl(_0x1f8b80)) {
    return false;
  }
  return /douyin\.com\/search\//.test(_0x1f8b80) || /^https?:\/\/(www\.)?douyin\.com\/?(\?|$)/.test(_0x1f8b80) || _0x1f8b80.startsWith("feed:");
}
function resolveLeadVideoUrl(_0x2147a0 = "", _0x3bd858 = document) {
  const _0x1c24ea = peekPendingLeadVideoUrl();
  if (_0x1c24ea) {
    return _0x1c24ea;
  }
  if (isDouyinVideoShareUrl(lockedLeadVideoUrl)) {
    return lockedLeadVideoUrl;
  }
  const _0x529660 = normalizeUrl(_0x2147a0);
  if (isDouyinVideoShareUrl(_0x529660)) {
    return _0x529660;
  }
  const _0x2d1c95 = normalizeUrl(window.location.href);
  if (isDouyinVideoShareUrl(_0x2d1c95)) {
    return _0x2d1c95;
  }
  const _0x1d10ab = extractVideoIdFromHref(window.location.href);
  if (_0x1d10ab) {
    return buildDouyinVideoShareUrl(_0x1d10ab);
  }
  const _0x4b5b9f = document.querySelector("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"SearchDetail\"]");
  const _0x3dbff1 = [];
  if (_0x3bd858 && _0x3bd858.querySelectorAll) {
    _0x3dbff1.push(_0x3bd858);
  }
  if (_0x4b5b9f && !_0x3dbff1.includes(_0x4b5b9f)) {
    _0x3dbff1.push(_0x4b5b9f);
  }
  const _0x2c2f05 = document.querySelector("[data-e2e=\"video-player-container\"], [data-e2e=\"feed-active-video\"]");
  if (_0x2c2f05 && !_0x3dbff1.includes(_0x2c2f05)) {
    _0x3dbff1.push(_0x2c2f05);
  }
  if (!_0x3dbff1.includes(document.body)) {
    _0x3dbff1.push(document.body);
  }
  for (const _0x224bbe of _0x3dbff1) {
    const _0x2d8a17 = _0x224bbe.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]");
    for (const _0x58005e of _0x2d8a17) {
      const _0xf5d55f = _0x58005e.href || _0x58005e.getAttribute("href") || "";
      const _0x407df6 = extractVideoIdFromHref(_0xf5d55f);
      if (_0x407df6) {
        return buildDouyinVideoShareUrl(_0x407df6);
      }
    }
  }
  try {
    const _0x3da64d = _0x3bd858?.getAttribute?.("data-e2e") === "feed-active-video" ? _0x3bd858 : _0x3bd858?.querySelector?.("[data-e2e=\"feed-active-video\"]");
    const _0x49b21a = [];
    if (_0x3da64d) {
      _0x49b21a.push(_0x3da64d);
    } else if (_0x3bd858?.querySelectorAll) {
      _0x49b21a.push(_0x3bd858);
    }
    if (!_0x3da64d && _0x2c2f05) {
      _0x49b21a.push(_0x2c2f05);
    }
    if (!_0x49b21a.length) {
      _0x49b21a.push(document.body);
    }
    for (const _0x2838d4 of _0x49b21a) {
      const _0x2c40fb = Array.from(_0x2838d4.querySelectorAll?.("video") || []).filter(_0x50239f => isVisibleElement(_0x50239f)).sort((_0x46ede3, _0x5e0c69) => {
        const _0x1080b7 = _0x46ede3.getBoundingClientRect();
        const _0xeefedc = _0x5e0c69.getBoundingClientRect();
        return _0xeefedc.width * _0xeefedc.height - _0x1080b7.width * _0x1080b7.height;
      });
      for (const _0x1d8ec0 of _0x2c40fb) {
        const _0x2915ff = _0x1d8ec0.currentSrc || _0x1d8ec0.src || _0x1d8ec0.getAttribute("src") || "";
        const _0x41c9b6 = _0x2915ff.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || _0x2915ff.match(/\/(\d{19})\//) || _0x2915ff.match(/(\d{19})/);
        if (_0x41c9b6?.[1]) {
          return buildDouyinVideoShareUrl(_0x41c9b6[1]);
        }
      }
    }
  } catch (_0x23639a) {}
  return "";
}
function resolveCurrentVisibleVideoUrl(_0x229b87 = "", _0x138e90 = document) {
  const _0x3666cc = normalizeUrl(_0x229b87);
  if (isDouyinVideoShareUrl(_0x3666cc)) {
    return _0x3666cc;
  }
  const _0x2548a4 = normalizeUrl(window.location.href);
  if (isDouyinVideoShareUrl(_0x2548a4)) {
    return _0x2548a4;
  }
  const _0x3d8a1f = extractVideoIdFromHref(window.location.href);
  if (_0x3d8a1f) {
    return buildDouyinVideoShareUrl(_0x3d8a1f);
  }
  const _0x2ae4fa = document.querySelector("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"SearchDetail\"]");
  const _0x4f23a1 = [];
  if (_0x138e90 && _0x138e90.querySelectorAll) {
    _0x4f23a1.push(_0x138e90);
  }
  if (_0x2ae4fa && !_0x4f23a1.includes(_0x2ae4fa)) {
    _0x4f23a1.push(_0x2ae4fa);
  }
  const _0xb6e6d6 = document.querySelector("[data-e2e=\"video-player-container\"], [data-e2e=\"feed-active-video\"]");
  if (_0xb6e6d6 && !_0x4f23a1.includes(_0xb6e6d6)) {
    _0x4f23a1.push(_0xb6e6d6);
  }
  for (const _0x18d84f of _0x4f23a1) {
    const _0x2cdf7 = _0x18d84f.querySelectorAll?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]") || [];
    for (const _0x14d52a of _0x2cdf7) {
      const _0x3373ca = extractVideoIdFromHref(_0x14d52a.href || _0x14d52a.getAttribute("href") || "");
      if (_0x3373ca) {
        return buildDouyinVideoShareUrl(_0x3373ca);
      }
    }
  }
  try {
    for (const _0x2abfbb of _0x4f23a1.length ? _0x4f23a1 : [document.body]) {
      const _0x5ea9b2 = Array.from(_0x2abfbb.querySelectorAll?.("video") || []).filter(_0x8f8fd => isVisibleElement(_0x8f8fd)).sort((_0x3cd152, _0x31f87e) => {
        const _0x26a0dd = _0x3cd152.getBoundingClientRect();
        const _0x135975 = _0x31f87e.getBoundingClientRect();
        return _0x135975.width * _0x135975.height - _0x26a0dd.width * _0x26a0dd.height;
      });
      for (const _0x4bd3bd of _0x5ea9b2) {
        const _0x4b6f76 = _0x4bd3bd.currentSrc || _0x4bd3bd.src || _0x4bd3bd.getAttribute("src") || "";
        const _0x1cc3d1 = _0x4b6f76.match(/(?:aweme_id|item_id|video_id)=(\d{15,})/) || _0x4b6f76.match(/\/(\d{19})\//) || _0x4b6f76.match(/(\d{19})/);
        if (_0x1cc3d1?.[1]) {
          return buildDouyinVideoShareUrl(_0x1cc3d1[1]);
        }
      }
    }
  } catch (_0x1bd18c) {}
  return "";
}
async function waitForVideoDetailReadyAndPause(_0x4d65a3, _0x280d6a = "", _0x1d3586 = 8000) {
  const _0x120af1 = normalizeUrl(_0x280d6a);
  const _0x1e1cb1 = extractSpecificVideoId(_0x120af1) || extractVideoIdFromHref(_0x120af1);
  const _0x34469d = Date.now();
  const _0x431dbb = _0x1d3586;
  let _0x42cc91 = _0x431dbb;
  let _0x5b6b5f = false;
  let _0x2fa449 = false;
  let _0x36d6a7 = false;
  while (Date.now() - _0x34469d < _0x42cc91) {
    if (shouldAbort(_0x4d65a3)) {
      throw new Error("TASK_ABORTED");
    }
    const _0xabf872 = String(window.location.href || "");
    const _0xddd190 = _0xabf872.includes("/search/") && !_0xabf872.includes("modal_id=") && !_0xabf872.includes("/video/") && !_0xabf872.includes("/note/");
    const _0x10b855 = resolveDouyinVideoDetailModal({
      includeFeed: false
    });
    const _0x495ca7 = !!_0x10b855 && !!isVisibleElement(_0x10b855);
    const _0x305e09 = _0xddd190 && !_0x495ca7;
    const _0x111fef = isViewingDouyinVideoPage(_0xabf872);
    const _0x1369c7 = _0x495ca7 ? _0x10b855 : getDouyinFeedScope() || document;
    const _0x1b411f = _0x495ca7 || _0x111fef ? resolveCurrentVisibleVideoUrl(normalizeUrl(_0xabf872), _0x1369c7) : "";
    const _0x1838a4 = extractSpecificVideoId(_0x1b411f) || extractVideoIdFromHref(_0x1b411f) || extractSpecificVideoId(_0xabf872) || extractVideoIdFromHref(_0xabf872);
    const _0x1e0375 = Array.from(_0x1369c7.querySelectorAll?.("video, img, canvas") || []).some(isVisibleElement);
    const _0x2d8b72 = getVideoTitle() !== "未知视频";
    const _0x1dca07 = Array.from(document.querySelectorAll("video")).some(_0x399d63 => {
      try {
        return isVisibleElement(_0x399d63) && !_0x399d63.paused && !_0x399d63.ended;
      } catch (_0x6f5e37) {
        return false;
      }
    });
    const _0x44d104 = !_0x1e1cb1 || !!_0x1838a4 && String(_0x1838a4) === String(_0x1e1cb1);
    if (_0x495ca7 || _0x111fef || _0x1e0375 || _0x1dca07 || _0x2d8b72) {
      _0x2fa449 = true;
    }
    if (!_0x5b6b5f) {
      pauseVisibleDouyinVideos(_0x1369c7, "进入视频后立即暂停");
      _0x5b6b5f = true;
    } else {
      pauseVisibleDouyinVideos(_0x1369c7);
    }
    if (_0x305e09) {
      await sleep(200);
      continue;
    }
    const _0x4b46c4 = _0xabf872.includes("/search/");
    if (_0x4b46c4 && !_0x495ca7) {
      await sleep(200);
      continue;
    }
    if (_0x1e1cb1 && !_0x1838a4) {
      await sleep(200);
      continue;
    }
    if ((_0x495ca7 && (_0x1e0375 || _0x2d8b72 || _0x1b411f) || !_0x4b46c4 && _0x111fef) && _0x44d104) {
      pauseVisibleDouyinVideos(_0x1369c7, "视频详情已出现，防止等待期间自动连播");
      if (_0x120af1 && isDouyinVideoShareUrl(_0x120af1) && _0x1b411f && _0x1b411f !== _0x120af1) {
        console.warn("[Built-in-Debug] [视频防跳] 打开后检测到当前视频与点击目标不同: target=" + _0x120af1 + ", current=" + _0x1b411f);
      }
      return true;
    }
    if (!_0x36d6a7 && _0x2fa449 && Date.now() - _0x34469d >= _0x431dbb - 250) {
      _0x42cc91 = getExtendedReadyBudgetMs(_0x431dbb, {
        progress: true,
        hardCapMs: Math.min(Math.round(_0x431dbb * 2.5), 20000)
      });
      if (_0x42cc91 > _0x431dbb) {
        _0x36d6a7 = true;
        console.log("[Built-in-Debug] [慢环境] 视频详情仍在加载，延长等待 " + _0x431dbb + "→" + _0x42cc91 + "ms");
        try {
          reportCurrentAction("页面加载较慢，继续等待视频就绪…");
        } catch (_0xad3abc) {}
      }
    }
    await sleep(200);
  }
  console.warn("[Built-in-Debug] [视频防跳] 等待视频详情就绪超时 (" + _0x42cc91 + "ms)");
  return false;
}
function cleanTitle(_0x57366b) {
  if (!_0x57366b) {
    return "未知视频";
  }
  return _0x57366b.replace(" - 抖音", "").replace("发现更多精彩视频搜索", "").replace("抖音 - 记录美好生活", "").trim() || "未知视频";
}
function isWithinTimeLimit(_0x4b9a75, _0x24e361) {
  if (!_0x24e361 || _0x24e361 === "all") {
    return true;
  }
  const _0x38641d = typeof getCommentTimeModule === "function" ? getCommentTimeModule() : null;
  if (_0x38641d?.isCommentWithinTimeFilter) {
    return _0x38641d.isCommentWithinTimeFilter(_0x4b9a75, _0x24e361);
  }
  const _0x6c1ad3 = {
    "5m": 5,
    "1h": 60,
    "1d": 1440,
    "3d": 4320,
    "1w": 10080,
    "1mo": 43200,
    "1y": 525600
  };
  const _0x414468 = _0x6c1ad3[String(_0x24e361)] || 0;
  if (_0x414468 <= 0) {
    return true;
  }
  const _0x41606f = _0x38641d?.parseCommentAgeMinutes?.(_0x4b9a75);
  if (_0x41606f == null || !Number.isFinite(_0x41606f)) {
    return false;
  }
  return _0x41606f < _0x414468;
}
function reportEmojiDebug(_0xf0a46a) {
  const _0x21e502 = String(_0xf0a46a || "").trim();
  if (_0x21e502) {
    console.log("[评论表情包] " + _0x21e502);
  }
}
function briefEl(_0x530e04) {
  if (!_0x530e04) {
    return "null";
  }
  const _0x15000e = _0x530e04.getBoundingClientRect();
  const _0x54cc98 = _0x530e04.className;
  const _0x518fe9 = String(typeof _0x54cc98 === "string" ? _0x54cc98 : _0x54cc98?.baseVal || "").split(/\s+/).filter(Boolean)[0] || "";
  const _0x47d1c9 = (_0x530e04.textContent || "").trim().slice(0, 8);
  return "" + _0x530e04.tagName + (_0x518fe9 ? "." + _0x518fe9 : "") + (_0x47d1c9 ? "(\"" + _0x47d1c9 + "\")" : "") + " @(" + Math.round(_0x15000e.left) + "," + Math.round(_0x15000e.top) + ")";
}
function describeDomControl(_0x573843) {
  if (!_0x573843) {
    return "无";
  }
  let _0x1a1369 = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  try {
    _0x1a1369 = _0x573843.getBoundingClientRect();
  } catch (_0x55a02d) {}
  const _0x4f8a29 = _0x573843.getAttribute?.("data-e2e") || "";
  const _0x230ae9 = String(_0x573843.getAttribute?.("aria-label") || _0x573843.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().slice(0, 12);
  const _0x44ad6f = _0x573843.className;
  const _0xfe7870 = String(typeof _0x44ad6f === "string" ? _0x44ad6f : _0x44ad6f?.baseVal || "").split(/\s+/).filter(Boolean)[0] || "";
  const _0x300047 = String(_0x573843.textContent || "").replace(/\s+/g, " ").trim().slice(0, 10);
  const _0x2db2f0 = _0x573843.isConnected !== false;
  return "" + _0x573843.tagName + (_0x4f8a29 ? "[e2e=" + _0x4f8a29 + "]" : "") + (_0xfe7870 ? "." + _0xfe7870 : "") + (_0x230ae9 ? "{" + _0x230ae9 + "}" : "") + (_0x300047 ? "(\"" + _0x300047 + "\")" : "") + (" " + Math.round(_0x1a1369.width) + "x" + Math.round(_0x1a1369.height) + "@(" + Math.round(_0x1a1369.left) + "," + Math.round(_0x1a1369.top) + ")") + ("" + (_0x2db2f0 ? "" : " 已卸载"));
}
function briefPanel(_0x2562ba) {
  if (!_0x2562ba) {
    return "无";
  }
  const _0x18bb51 = _0x2562ba.getBoundingClientRect();
  const _0x2ba8d7 = String(_0x2562ba.className || "").split(/\s+/).slice(0, 2).join(".");
  const _0xf230c = getCommentV2String("emojiStickerItems");
  let _0x10b092 = 0;
  if (_0xf230c) {
    try {
      _0x10b092 = _0x2562ba.querySelectorAll(_0xf230c).length;
    } catch (_0x2d6fa3) {
      _0x10b092 = 0;
    }
  }
  return _0x2562ba.tagName + "." + _0x2ba8d7 + " " + Math.round(_0x18bb51.width) + "x" + Math.round(_0x18bb51.height) + " 贴纸=" + _0x10b092;
}
function compileCommentV2Regex(_0x50aa15) {
  const _0x2bb6d5 = getCommentV2String(_0x50aa15);
  if (!_0x2bb6d5) {
    return null;
  }
  try {
    return new RegExp(_0x2bb6d5, "i");
  } catch (_0x1021a4) {
    return null;
  }
}
function elementsNearlyOverlap(_0x80c14a, _0x2c0871, _0x9eb840 = 8) {
  if (!_0x80c14a || !_0x2c0871) {
    return false;
  }
  const _0x1e1cde = _0x80c14a.getBoundingClientRect();
  const _0x584174 = _0x2c0871.getBoundingClientRect();
  const _0x5ad2a0 = Math.abs((_0x1e1cde.left + _0x1e1cde.right) / 2 - (_0x584174.left + _0x584174.right) / 2);
  const _0x30d707 = Math.abs((_0x1e1cde.top + _0x1e1cde.bottom) / 2 - (_0x584174.top + _0x584174.bottom) / 2);
  return _0x5ad2a0 < _0x9eb840 && _0x30d707 < _0x9eb840;
}
function isEmojiTriggerCandidate(_0x3e2cd3, _0x3a6b09) {
  if (!_0x3e2cd3) {
    return true;
  }
  if (_0x3a6b09 && (_0x3e2cd3 === _0x3a6b09 || _0x3a6b09.contains(_0x3e2cd3) || _0x3e2cd3.contains(_0x3a6b09))) {
    return true;
  }
  if (_0x3a6b09 && elementsNearlyOverlap(_0x3e2cd3, _0x3a6b09)) {
    return true;
  }
  return false;
}
function isCommentAreaElement(_0x20967c) {
  if (!_0x20967c?.closest) {
    return false;
  }
  const _0x22f775 = [getCommentV2String("commentPanel"), getCommentV2String("commentItem"), getCommentV2String("commentItemLoose"), getCommentV2String("replyItem")].filter(Boolean).join(", ");
  if (!_0x22f775) {
    return false;
  }
  try {
    return !!_0x20967c.closest(_0x22f775);
  } catch (_0xada675) {
    return false;
  }
}
function isCommentStatsTabContainer(_0x2232fb) {
  if (!_0x2232fb) {
    return true;
  }
  const _0xe41413 = (_0x2232fb.textContent || "").trim();
  const _0x854159 = getCommentV2String("emojiPanelRejectSelector");
  if (_0x854159) {
    try {
      if (_0x2232fb.matches?.(_0x854159) || _0x2232fb.querySelector?.(_0x854159)) {
        return true;
      }
    } catch (_0x20ee09) {}
  }
  const _0x1953f3 = compileCommentV2Regex("emojiTabRejectPattern");
  const _0x400388 = compileCommentV2Regex("emojiTabPositivePattern");
  if (_0x1953f3?.test(_0xe41413) && !_0x400388?.test(_0xe41413)) {
    return true;
  }
  return false;
}
function panelMatchesRemoteSelector(_0x158013) {
  const _0x58779a = typeof getCommentV2String === "function" ? getCommentV2String("emojiPanel") : "";
  if (!_0x158013 || !_0x58779a) {
    return false;
  }
  try {
    return _0x158013.matches(_0x58779a);
  } catch (_0x7b7178) {
    return false;
  }
}
function isValidEmojiPickerPanel(_0x3664ba, _0xc8543e) {
  if (!_0x3664ba || !isVisibleElement(_0x3664ba) || isCommentAreaElement(_0x3664ba)) {
    return false;
  }
  if (_0xc8543e && _0x3664ba.contains(_0xc8543e)) {
    return false;
  }
  return panelMatchesRemoteSelector(_0x3664ba);
}
function snapshotComposerEmojiState(_0x406fe2, _0x28164c = null) {
  const _0x2e8804 = getComposerEmojiSearchRoots(_0x406fe2, _0x28164c);
  const _0x588046 = getCommentV2String("emojiComposerPayload");
  const _0xaa0e5c = getCommentV2String("emojiTextTokenPattern");
  const _0x500cd2 = getCommentV2String("emojiPanel");
  const _0x3ebead = new Set();
  const _0x587e4b = new Set();
  let _0x15caed = 0;
  if (!_0x588046 || !_0xaa0e5c) {
    return {
      payloadCount: 0,
      textTokenCount: 0
    };
  }
  const _0x5f30c9 = _0x7a6767 => {
    if (!_0x7a6767 || !_0x500cd2) {
      return false;
    }
    try {
      return !!_0x7a6767.closest?.(_0x500cd2);
    } catch (_0x569d39) {
      return false;
    }
  };
  for (const _0x3db7a3 of _0x2e8804) {
    if (!_0x3db7a3 || _0x3db7a3.isConnected === false) {
      continue;
    }
    try {
      if (_0x3db7a3.matches?.(_0x588046) && !_0x5f30c9(_0x3db7a3)) {
        _0x3ebead.add(_0x3db7a3);
      }
      _0x3db7a3.querySelectorAll(_0x588046).forEach(_0x2290cd => {
        if (!_0x5f30c9(_0x2290cd)) {
          _0x3ebead.add(_0x2290cd);
        }
      });
      if (_0x3db7a3.matches?.("[contenteditable=\"true\"]") && !_0x5f30c9(_0x3db7a3)) {
        _0x587e4b.add(_0x3db7a3);
      }
      _0x3db7a3.querySelectorAll?.("[contenteditable=\"true\"]").forEach(_0x2dce67 => {
        if (!_0x5f30c9(_0x2dce67)) {
          _0x587e4b.add(_0x2dce67);
        }
      });
    } catch (_0x5b447d) {
      return {
        payloadCount: 0,
        textTokenCount: 0
      };
    }
  }
  for (const _0x525977 of _0x587e4b) {
    try {
      const _0x5924ad = String(_0x525977.innerText || _0x525977.textContent || "");
      const _0x28d2d2 = _0x5924ad.match(new RegExp(_0xaa0e5c, "g")) || [];
      _0x15caed = Math.max(_0x15caed, _0x28d2d2.length);
    } catch (_0x4af379) {
      return {
        payloadCount: 0,
        textTokenCount: 0
      };
    }
  }
  return {
    payloadCount: _0x3ebead.size,
    textTokenCount: _0x15caed
  };
}
function getComposerEmojiSearchRoots(_0x358a80, _0x2f772e = null) {
  const _0x2cb258 = [];
  const _0x232fb8 = _0x5d38fd => {
    if (_0x5d38fd && !_0x2cb258.includes(_0x5d38fd)) {
      _0x2cb258.push(_0x5d38fd);
    }
  };
  _0x232fb8(_0x358a80);
  for (const _0x10dd0d of ["draftEditor", "commentInputShell", "commentInputShellLoose"]) {
    const _0x3527b8 = getCommentV2String(_0x10dd0d);
    if (!_0x3527b8) {
      continue;
    }
    try {
      _0x232fb8(_0x358a80?.closest?.(_0x3527b8));
    } catch (_0x5f2781) {}
  }
  _0x232fb8(getCommentComposerRoot(_0x358a80));
  if (_0x2f772e?.roots?.length) {
    _0x2f772e.roots.forEach(_0x232fb8);
  }
  let _0x29929a = _0x358a80;
  for (let _0x22d9e5 = 0; _0x22d9e5 < 8 && _0x29929a && _0x29929a !== document.body; _0x22d9e5++) {
    _0x232fb8(_0x29929a);
    _0x29929a = _0x29929a.parentElement;
  }
  return _0x2cb258;
}
function scoreEmojiTabContainer(_0x62b61a, _0x3e1546, _0x3c2780) {
  if (!_0x62b61a || !isVisibleElement(_0x62b61a)) {
    return -999;
  }
  if (_0x3c2780 && _0x62b61a === _0x3c2780) {
    return -999;
  }
  if (isCommentAreaElement(_0x62b61a) || isCommentStatsTabContainer(_0x62b61a)) {
    return -999;
  }
  const _0x1cc8dd = _0x62b61a.getBoundingClientRect();
  const _0x367fe3 = _0x3e1546?.getBoundingClientRect?.();
  const _0x3c3ba9 = _0x3c2780?.getBoundingClientRect?.();
  const _0x31c09b = (_0x62b61a.textContent || "").trim();
  const _0x43e5c3 = compileCommentV2Regex("emojiTabPositivePattern");
  const _0x652490 = compileCommentV2Regex("emojiTabRejectPattern");
  if (!_0x43e5c3 || !_0x652490) {
    return -999;
  }
  const _0x5e12ff = _0x43e5c3.test(_0x31c09b);
  const _0x16e893 = Array.from(_0x62b61a.children).filter(_0x593411 => isVisibleElement(_0x593411) && !isEmojiTriggerCandidate(_0x593411, _0x3c2780));
  const _0x226ca4 = _0x16e893.filter(_0x3cde67 => _0x3cde67.querySelector("svg"));
  const _0x2d7eb2 = _0x16e893.filter(_0x2db6af => {
    const _0x2c6118 = String(_0x2db6af.getAttribute?.("role") || "").toLowerCase();
    return _0x2db6af.tagName === "BUTTON" || _0x2c6118 === "tab" || _0x2c6118 === "button" || _0x2db6af.getAttribute?.("aria-selected") != null;
  });
  const _0x38a12e = String(_0x62b61a.getAttribute?.("role") || "").toLowerCase() === "tablist";
  if (_0x3c2780 && _0x62b61a.contains(_0x3c2780) && _0x226ca4.length < 2 && _0x2d7eb2.length < 2) {
    return -999;
  }
  if (_0x16e893.length < 2 || _0x16e893.length > 8) {
    return -999;
  }
  if (_0x226ca4.length < 2 && _0x2d7eb2.length < 2 && !_0x38a12e) {
    return -999;
  }
  if (_0x31c09b.length > 40) {
    return -999;
  }
  if (_0x16e893.some(_0x5e8f02 => (_0x5e8f02.textContent || "").trim().length > 12)) {
    return -999;
  }
  if (_0x652490.test(_0x31c09b) && !_0x5e12ff && _0x31c09b.length > 6) {
    return -999;
  }
  let _0x35c2b0 = 0;
  _0x35c2b0 += _0x226ca4.length >= 4 ? 30 : _0x226ca4.length >= 3 ? 25 : _0x226ca4.length >= 2 ? 15 : 0;
  _0x35c2b0 += _0x2d7eb2.length >= 2 ? 25 : 0;
  _0x35c2b0 += _0x38a12e ? 20 : 0;
  _0x35c2b0 += _0x16e893.length === 4 ? 12 : _0x16e893.length === 3 ? 8 : 0;
  _0x35c2b0 += _0x16e893.every(_0x56dfca => _0x56dfca.tagName === "SPAN" || _0x56dfca.tagName === "BUTTON" || _0x56dfca.querySelector("svg") || ["tab", "button"].includes(String(_0x56dfca.getAttribute?.("role") || "").toLowerCase())) ? 10 : 0;
  if (_0x5e12ff) {
    _0x35c2b0 += 20;
  }
  if (_0x367fe3) {
    const _0x3a4ced = Math.min(_0x1cc8dd.right, _0x367fe3.right) - Math.max(_0x1cc8dd.left, _0x367fe3.left);
    const _0x163e73 = Math.min(_0x1cc8dd.bottom, _0x367fe3.bottom) - Math.max(_0x1cc8dd.top, _0x367fe3.top);
    if (_0x3a4ced > 0 && _0x163e73 > 0) {
      _0x35c2b0 += 30;
    }
    if (Math.abs(_0x1cc8dd.top - _0x367fe3.top) < 50) {
      _0x35c2b0 += 12;
    }
  }
  if (_0x3c3ba9) {
    const _0x561b6c = Math.abs((_0x1cc8dd.left + _0x1cc8dd.right) / 2 - (_0x3c3ba9.left + _0x3c3ba9.right) / 2);
    if (_0x561b6c < 80) {
      _0x35c2b0 += 20;
    } else if (_0x561b6c < 140) {
      _0x35c2b0 += 5;
    }
    if (Math.abs(_0x1cc8dd.top - _0x3c3ba9.top) < 35) {
      _0x35c2b0 += 10;
    }
  }
  return _0x35c2b0;
}
function findBestEmojiTabContainer(_0x2d3825, _0x1353cb, _0x333a8e) {
  let _0x115531 = null;
  let _0x1b8c1b = -999;
  const _0x4a6612 = new Set();
  const _0x39a1e0 = getCommentV2String("emojiTabContainerCandidates");
  if (!_0x39a1e0) {
    return null;
  }
  for (const _0x4a113a of _0x333a8e) {
    if (!_0x4a113a) {
      continue;
    }
    let _0xcb3de1 = [];
    try {
      _0xcb3de1 = _0x4a113a.querySelectorAll(_0x39a1e0);
    } catch (_0x5221bb) {
      return null;
    }
    for (const _0x1eb174 of _0xcb3de1) {
      if (_0x4a6612.has(_0x1eb174)) {
        continue;
      }
      _0x4a6612.add(_0x1eb174);
      const _0x136f41 = scoreEmojiTabContainer(_0x1eb174, _0x2d3825, _0x1353cb);
      if (_0x136f41 > _0x1b8c1b) {
        _0x1b8c1b = _0x136f41;
        _0x115531 = _0x1eb174;
      }
    }
  }
  if (_0x1b8c1b > 0) {
    return _0x115531;
  } else {
    return null;
  }
}
function describeEmojiViewport() {
  const _0x1e1086 = window.visualViewport;
  return "视口 " + (window.innerWidth || 0) + "x" + (window.innerHeight || 0) + (" visual=" + Math.round(Number(_0x1e1086?.width) || 0) + "x" + Math.round(Number(_0x1e1086?.height) || 0));
}
function summarizeEmojiTabDebug(_0x40a84c, _0x3dc57a, _0x59f463 = {}) {
  const _0x2c1131 = typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : [];
  const _0x16d216 = _0x59f463.tabs || [];
  const _0x2c5d41 = _0x16d216.slice(0, 8).map((_0x48de5d, _0x74b83b) => {
    const _0x2f0f7f = String((_0x48de5d?.textContent || "").trim() || _0x48de5d?.getAttribute?.("aria-label") || "").slice(0, 8);
    let _0x30ba44 = {
      width: 0,
      height: 0
    };
    try {
      _0x30ba44 = _0x48de5d.getBoundingClientRect();
    } catch (_0x18c09a) {}
    return "#" + _0x74b83b + (_0x2f0f7f ? "\"" + _0x2f0f7f + "\"" : "无文案") + Math.round(_0x30ba44.width) + "x" + Math.round(_0x30ba44.height);
  }).join(",");
  return describeEmojiViewport() + " 面板=" + briefPanel(_0x40a84c) + " tab栏=" + briefEl(_0x59f463.tabContainer) + (" tabs=" + _0x16d216.length + (_0x2c5d41 ? "[" + _0x2c5d41 + "]" : "")) + (" 收藏文案提示=[" + (_0x2c1131 || []).join("|") + "]（仅诊断，不按下标点击）") + (" fav=" + briefEl(_0x59f463.favTab) + " 入口=" + briefEl(_0x3dc57a));
}
function findFavTabByExactText(_0xab6d65, _0x20f15e) {
  if (!_0xab6d65) {
    return null;
  }
  const _0x35f268 = (typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : []).map(_0x62f924 => String(_0x62f924 || "").replace(/\s+/g, "").trim()).filter(Boolean);
  if (!_0x35f268.length) {
    return null;
  }
  const _0x353fe8 = getCommentV2String("emojiTabTextCandidates");
  if (!_0x353fe8) {
    return null;
  }
  const _0x23e1f8 = [];
  let _0x195976 = [];
  try {
    _0x195976 = _0xab6d65.querySelectorAll(_0x353fe8);
  } catch (_0x492c6c) {
    return null;
  }
  for (const _0x5f5081 of _0x195976) {
    if (!isVisibleElement(_0x5f5081) || isEmojiTriggerCandidate(_0x5f5081, _0x20f15e)) {
      continue;
    }
    const _0x279cbe = String((_0x5f5081.textContent || "").trim() || _0x5f5081.getAttribute?.("aria-label") || _0x5f5081.getAttribute?.("title") || "").replace(/\s+/g, "").trim();
    if (!_0x279cbe || _0x279cbe.length > 8) {
      continue;
    }
    if (!_0x35f268.includes(_0x279cbe)) {
      continue;
    }
    _0x23e1f8.push(_0x5f5081);
  }
  if (!_0x23e1f8.length) {
    return null;
  }
  _0x23e1f8.sort((_0x396328, _0x5b2e73) => {
    const _0xd8417b = _0x396328.getBoundingClientRect();
    const _0x303d24 = _0x5b2e73.getBoundingClientRect();
    return _0xd8417b.width * _0xd8417b.height - _0x303d24.width * _0x303d24.height;
  });
  return _0x23e1f8[0];
}
function dumpEmojiPanelTabCandidates(_0x4ecfe2, _0x3f9ea4, _0x57a19d = {}) {
  if (!_0x4ecfe2) {
    return;
  }
  const _0x3696f7 = _0x4ecfe2.getBoundingClientRect();
  const _0x26af8d = _0x3f9ea4?.getBoundingClientRect?.();
  reportEmojiDebug("--- Tab候选 " + describeEmojiViewport() + " " + briefPanel(_0x4ecfe2) + " emojiBtn=" + briefEl(_0x3f9ea4) + " ---");
  const _0x224c98 = [];
  const _0x5a11cb = new Set();
  const _0x4b8616 = getCommentV2String("emojiTabDebugCandidates");
  if (!_0x4b8616) {
    return;
  }
  let _0x4e86c5 = [];
  try {
    _0x4e86c5 = _0x4ecfe2.querySelectorAll(_0x4b8616);
  } catch (_0x2cc8d7) {
    return;
  }
  for (const _0x9c2f26 of _0x4e86c5) {
    if (_0x5a11cb.has(_0x9c2f26) || !isVisibleElement(_0x9c2f26)) {
      continue;
    }
    _0x5a11cb.add(_0x9c2f26);
    const _0xfd2e8a = _0x9c2f26.getBoundingClientRect();
    if (_0xfd2e8a.height < 14 || _0xfd2e8a.height > 80) {
      continue;
    }
    if (_0xfd2e8a.top < _0x3696f7.top - 10 || _0xfd2e8a.bottom > _0x3696f7.bottom + 10) {
      continue;
    }
    const _0x16cbe9 = Array.from(_0x9c2f26.children).filter(isVisibleElement);
    if (_0x16cbe9.length < 2 || _0x16cbe9.length > 8) {
      continue;
    }
    const _0x3d7ce3 = _0x16cbe9.filter(_0x1a1e4e => _0x1a1e4e.querySelector("svg")).length;
    const _0x5a8698 = (_0x9c2f26.textContent || "").trim().slice(0, 24);
    const _0x52abfe = scoreEmojiTabContainer(_0x9c2f26, _0x4ecfe2, _0x3f9ea4);
    _0x224c98.push({
      el: _0x9c2f26,
      svgCount: _0x3d7ce3,
      childCount: _0x16cbe9.length,
      text: _0x5a8698,
      score: _0x52abfe,
      rect: _0xfd2e8a
    });
  }
  _0x224c98.sort((_0x1a0c05, _0x3dddfb) => _0x3dddfb.score - _0x1a0c05.score || _0x1a0c05.rect.top - _0x3dddfb.rect.top);
  _0x224c98.slice(0, 10).forEach((_0x276b00, _0x58d1e4) => {
    const _0x34d450 = Array.from(_0x276b00.el.children).slice(0, 6).map((_0x197771, _0x3704a6) => {
      const _0x81075a = _0x197771.getBoundingClientRect();
      const _0x5bf435 = !!_0x197771.querySelector("svg");
      const _0x489b9a = (_0x197771.textContent || "").trim().slice(0, 6);
      return "[" + _0x3704a6 + "]" + _0x197771.tagName + (_0x5bf435 ? "+svg" : "") + (_0x489b9a ? "(\"" + _0x489b9a + "\")" : "") + "@(" + Math.round(_0x81075a.left) + "," + Math.round(_0x81075a.top) + ")";
    }).join(" ");
    reportEmojiDebug("  #" + (_0x58d1e4 + 1) + " score=" + _0x276b00.score + " " + briefEl(_0x276b00.el) + " svg=" + _0x276b00.svgCount + "子=" + _0x276b00.childCount + " \"" + _0x276b00.text + "\" | " + _0x34d450);
  });
  if (_0x26af8d) {
    reportEmojiDebug("  emojiBtn中心=(" + Math.round(_0x26af8d.left + _0x26af8d.width / 2) + "," + Math.round(_0x26af8d.top + _0x26af8d.height / 2) + ") 面板=(" + Math.round(_0x3696f7.left) + "," + Math.round(_0x3696f7.top) + "-" + Math.round(_0x3696f7.right) + "," + Math.round(_0x3696f7.bottom) + ")");
  }
  const _0x53cacf = summarizeEmojiTabDebug(_0x4ecfe2, _0x3f9ea4, resolveDouyinEmojiTabs(_0x4ecfe2, _0x3f9ea4));
  reportEmojiDebug(_0x53cacf);
  if (_0x57a19d.traceToRunLog) {
    const _0x2fddf6 = typeof clipTraceText === "function" ? clipTraceText(_0x53cacf, 220) : _0x53cacf.slice(0, 220);
    reportTraceLog("📎 调试：" + _0x2fddf6, null, "warning");
  }
}
function findDouyinEmojiTabContainer(_0x4aca57, _0x3c5b04) {
  if (!_0x4aca57) {
    return null;
  }
  return findBestEmojiTabContainer(_0x4aca57, _0x3c5b04, [_0x4aca57]);
}
function resolveDouyinEmojiTabs(_0x192d44, _0x1f7eab) {
  const _0x18f1ce = findDouyinEmojiTabContainer(_0x192d44, _0x1f7eab);
  const _0x3658ea = _0x18f1ce ? Array.from(_0x18f1ce.children) : [];
  const _0x108467 = _0x3658ea.filter(_0x233f49 => isVisibleElement(_0x233f49) && !isEmojiTriggerCandidate(_0x233f49, _0x1f7eab));
  const _0x122344 = compileCommentV2Regex("emojiTabRejectPattern");
  if (!_0x122344) {
    return {
      favTab: null,
      tabContainer: _0x18f1ce,
      tabs: _0x3658ea
    };
  }
  const _0x40ee0d = _0x6b4e19 => {
    const _0xd6581f = _0x6b4e19.filter(_0x363965 => !isEmojiTriggerCandidate(_0x363965, _0x1f7eab));
    const _0x32a735 = typeof getCommentV2List === "function" ? getCommentV2List("emojiFavTabTexts") : [];
    const _0x58c11c = _0x216b8e => String((_0x216b8e?.textContent || "").trim() || _0x216b8e?.getAttribute?.("aria-label") || _0x216b8e?.getAttribute?.("title") || "").replace(/\s+/g, "").trim();
    const _0x44deaf = _0x32a735.length ? _0xd6581f.find(_0xaf1952 => {
      const _0x12fd29 = _0x58c11c(_0xaf1952);
      if (!_0x12fd29 || _0x12fd29.length > 8) {
        return false;
      }
      if (_0x122344.test(_0x12fd29)) {
        return false;
      }
      return _0x32a735.some(_0x1beb11 => _0x12fd29 === String(_0x1beb11 || "").replace(/\s+/g, ""));
    }) : null;
    if (_0x44deaf) {
      return _0x44deaf;
    }
    return null;
  };
  let _0x23a6bd = _0x40ee0d(_0x108467);
  if (!_0x23a6bd && _0x3658ea.length >= 3) {
    _0x23a6bd = _0x40ee0d(_0x3658ea.filter(_0x5432e4 => !isEmojiTriggerCandidate(_0x5432e4, _0x1f7eab)));
  }
  if (!_0x23a6bd) {
    _0x23a6bd = findFavTabByExactText(_0x18f1ce, _0x1f7eab) || findFavTabByExactText(_0x192d44, _0x1f7eab);
  }
  return {
    favTab: _0x23a6bd,
    tabContainer: _0x18f1ce,
    tabs: _0x3658ea
  };
}
async function reopenEmojiPanelIfNeeded(_0x47c2f1, _0x9f169f, _0x40d7f7) {
  let _0x27cc5c = findDouyinEmojiPanel(_0x47c2f1);
  if (_0x27cc5c && isVisibleElement(_0x27cc5c)) {
    return _0x27cc5c;
  }
  const _0x55145e = findEmojiTriggerBtn(_0x47c2f1, _0x40d7f7);
  if (!_0x55145e) {
    return null;
  }
  reportEmojiDebug("面板已关闭，重新打开");
  await simulateTrustedElementClick(_0x55145e, _0x9f169f, "打开评论表情面板", {
    allowScrollIntoView: false
  });
  for (let _0x1d5861 = 0; _0x1d5861 < 8; _0x1d5861++) {
    await sleep(280);
    _0x27cc5c = findDouyinEmojiPanel(_0x47c2f1);
    if (_0x27cc5c && isVisibleElement(_0x27cc5c)) {
      return _0x27cc5c;
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
      set: _0x375715 => {
        activeLoopId = _0x375715;
      }
    },
    commentExpressionRotateIndex: {
      enumerable: true,
      get: () => commentExpressionRotateIndex,
      set: _0x4d6681 => {
        commentExpressionRotateIndex = _0x4d6681;
      }
    },
    commentFailureStoppedTaskId: {
      enumerable: true,
      get: () => commentFailureStoppedTaskId,
      set: _0x20adb2 => {
        commentFailureStoppedTaskId = _0x20adb2;
      }
    },
    commentImageRotateIndex: {
      enumerable: true,
      get: () => commentImageRotateIndex,
      set: _0x54ae38 => {
        commentImageRotateIndex = _0x54ae38;
      }
    },
    currentActionMentionRolled: {
      enumerable: true,
      get: () => currentActionMentionRolled,
      set: _0x526586 => {
        currentActionMentionRolled = _0x526586;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: _0x292367 => {
        currentRunningSource = _0x292367;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x596fd7 => {
        currentTask = _0x596fd7;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: _0x5603d1 => {
        currentViewKey = _0x5603d1;
      }
    },
    lastNativeClickBackgroundHosted: {
      enumerable: true,
      get: () => lastNativeClickBackgroundHosted,
      set: _0x3135c1 => {
        lastNativeClickBackgroundHosted = _0x3135c1;
      }
    },
    lastProfileVideoDetailDiagnostic: {
      enumerable: true,
      get: () => lastProfileVideoDetailDiagnostic,
      set: _0x590737 => {
        lastProfileVideoDetailDiagnostic = _0x590737;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: _0x364bee => {
        lastTrustedClickDiagnostic = _0x364bee;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: _0x3356b1 => {
        lockedFeedIdentity = _0x3356b1;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: _0x5e5c55 => {
        lockedLeadVideoUrl = _0x5e5c55;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: _0x5660b5 => {
        pausedForSubview = _0x5660b5;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: _0x1264da => {
        sessionDmCount = _0x1264da;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: _0x2cc748 => {
        sessionDmLimit = _0x2cc748;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: _0x1e45f9 => {
        sessionFollowCount = _0x1e45f9;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: _0x5d6783 => {
        sessionFollowLimit = _0x5d6783;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x13f4d4 => {
        stopRequested = _0x13f4d4;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x127206 => {
        taskRunning = _0x127206;
      }
    },
    videoCommentExpressionRotateIndex: {
      enumerable: true,
      get: () => videoCommentExpressionRotateIndex,
      set: _0xe3efd0 => {
        videoCommentExpressionRotateIndex = _0xe3efd0;
      }
    },
    videoCommentImageRotateIndex: {
      enumerable: true,
      get: () => videoCommentImageRotateIndex,
      set: _0xd45fc4 => {
        videoCommentImageRotateIndex = _0xd45fc4;
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
} catch (_0x1a626b) {
  commentAutomationControllerLoadError = _0x1a626b;
  console.error("[Built-in-Debug] 评论采集与互动控制器加载失败:", _0x1a626b);
}
try {
  if (profileInteractionController?.bootPendingSubviewTask) {
    profileInteractionController.bootPendingSubviewTask();
  }
} catch (_0x37f58c) {
  console.error("[Built-in-Debug] 子视图待恢复任务启动失败:", _0x37f58c);
}
function applySearchFilters(..._0x21c1ff) {
  return commentAutomationController?.applySearchFilters(..._0x21c1ff);
}
function buildImageAttachScope(..._0xe3dc14) {
  return commentAutomationController?.buildImageAttachScope(..._0xe3dc14);
}
function captureCurrentVideoMetadata(..._0x39d993) {
  return commentAutomationController?.captureCurrentVideoMetadata(..._0x39d993);
}
function collectCommentImageTriggerCandidates(..._0x4a6f8a) {
  return commentAutomationController?.collectCommentImageTriggerCandidates(..._0x4a6f8a);
}
function describeProfileNoWorksReason(..._0x109d62) {
  return commentAutomationController?.describeProfileNoWorksReason(..._0x109d62);
}
function describeProfileWorksNotReadyReason(..._0x3e214c) {
  return commentAutomationController?.describeProfileWorksNotReadyReason(..._0x3e214c);
}
function describeReplyEnvironment(..._0x20ea0f) {
  return commentAutomationController?.describeReplyEnvironment(..._0x20ea0f);
}
function ensureProfileWorksTab(..._0x189ea5) {
  return commentAutomationController?.ensureProfileWorksTab(..._0x189ea5);
}
function extractLeads(..._0x4afa94) {
  return commentAutomationController?.extractLeads(..._0x4afa94);
}
function findCommentPanelRoot(..._0x163acc) {
  return commentAutomationController?.findCommentPanelRoot(..._0x163acc);
}
function findDouyinEmojiPanel(..._0x530147) {
  return commentAutomationController?.findDouyinEmojiPanel(..._0x530147);
}
function findEmojiTriggerBtn(..._0x532850) {
  return commentAutomationController?.findEmojiTriggerBtn(..._0x532850);
}
function findMainVideoCommentInput(..._0x18e609) {
  return commentAutomationController?.findMainVideoCommentInput(..._0x18e609);
}
function findProfileVideoCards(..._0x24935b) {
  return commentAutomationController?.findProfileVideoCards(..._0x24935b);
}
function findTargetNode(..._0x556d6d) {
  return commentAutomationController?.findTargetNode(..._0x556d6d);
}
function formatScrapeCommentScrollAction(..._0x5a2ea3) {
  return commentAutomationController?.formatScrapeCommentScrollAction(..._0x5a2ea3);
}
function formatScrapeGuardWaitLabel(..._0x54f24a) {
  return commentAutomationController?.formatScrapeGuardWaitLabel(..._0x54f24a);
}
function getCommentComposerRoot(..._0x19fb6f) {
  return commentAutomationController?.getCommentComposerRoot(..._0x19fb6f);
}
function getCommentItemLooseSelector(..._0x4be938) {
  return commentAutomationController?.getCommentItemLooseSelector(..._0x4be938);
}
function getCommentItemSelector(..._0x3eee5c) {
  return commentAutomationController?.getCommentItemSelector(..._0x3eee5c);
}
function getCommentPanelSelector(..._0x339a63) {
  return commentAutomationController?.getCommentPanelSelector(..._0x339a63);
}
function getMainCommentInputShellSelector(..._0x26a3fb) {
  return commentAutomationController?.getMainCommentInputShellSelector(..._0x26a3fb);
}
function getProfilePostListRoot(..._0x5a52f5) {
  return commentAutomationController?.getProfilePostListRoot(..._0x5a52f5);
}
function getVideoAuthorInfo(..._0x25d536) {
  return commentAutomationController?.getVideoAuthorInfo(..._0x25d536);
}
function getVideoAuthorNickname(..._0x2f6325) {
  return commentAutomationController?.getVideoAuthorNickname(..._0x2f6325);
}
function getVideoAuthorProfileUrl(..._0x21db5d) {
  return commentAutomationController?.getVideoAuthorProfileUrl(..._0x21db5d);
}
function getVideoTitle(..._0x184c9b) {
  return commentAutomationController?.getVideoTitle(..._0x184c9b);
}
function hasCommentNonTextPayload(..._0x2ea51d) {
  return commentAutomationController?.hasCommentNonTextPayload(..._0x2ea51d);
}
function isProfileFirstCommentAiMode(..._0x32a925) {
  return commentAutomationController?.isProfileFirstCommentAiMode(..._0x32a925);
}
function isProfileFirstWorkCommentDone(..._0x358ea5) {
  return commentAutomationController?.isProfileFirstWorkCommentDone(..._0x358ea5);
}
function matchExcludedVideoAuthor(..._0x446a57) {
  return commentAutomationController?.matchExcludedVideoAuthor(..._0x446a57);
}
function mergeCommentSelectors(..._0x3f03f4) {
  return commentAutomationController?.mergeCommentSelectors(..._0x3f03f4);
}
function normalizeAuthorAccountName(..._0x522b56) {
  return commentAutomationController?.normalizeAuthorAccountName(..._0x522b56);
}
function parseExcludeAuthorAccounts(..._0xc3f4ea) {
  return commentAutomationController?.parseExcludeAuthorAccounts(..._0xc3f4ea);
}
function parseProfileWorksCount(..._0x20fb0e) {
  return commentAutomationController?.parseProfileWorksCount(..._0x20fb0e);
}
function pauseSettleThenCaptureVideoMetadata(..._0x214333) {
  return commentAutomationController?.pauseSettleThenCaptureVideoMetadata(..._0x214333);
}
function performLike(..._0x58c6fd) {
  return commentAutomationController?.performLike(..._0x58c6fd);
}
function performProfileActions(..._0x2b9c59) {
  return commentAutomationController?.performProfileActions(..._0x2b9c59);
}
function performProfileFirstWorkComment(..._0x3baeb3) {
  return commentAutomationController?.performProfileFirstWorkComment(..._0x3baeb3);
}
function performReply(..._0x3ab4dc) {
  return commentAutomationController?.performReply(..._0x3ab4dc);
}
function postVideoComment(..._0x5e6f67) {
  return commentAutomationController?.postVideoComment(..._0x5e6f67);
}
function profileHasNoPublicWorks(..._0x2e1e89) {
  return commentAutomationController?.profileHasNoPublicWorks(..._0x2e1e89);
}
function queryCommentItemNodes(..._0xdb361e) {
  return commentAutomationController?.queryCommentItemNodes(..._0xdb361e);
}
function reportMonitorActionProgress(..._0x46c55e) {
  return commentAutomationController?.reportMonitorActionProgress(..._0x46c55e);
}
function resetCommentImageRotation(..._0x20dfc3) {
  return commentAutomationController?.resetCommentImageRotation(..._0x20dfc3);
}
function resolveCommentImagePaths(..._0x4adb4c) {
  return commentAutomationController?.resolveCommentImagePaths(..._0x4adb4c);
}
function resolveCommentPanelRoot(..._0x40da91) {
  return commentAutomationController?.resolveCommentPanelRoot(..._0x40da91);
}
function resolveMainCommentWritableElement(..._0x21e32a) {
  return commentAutomationController?.resolveMainCommentWritableElement(..._0x21e32a);
}
function resolveMainVideoCommentText(..._0x48b37a) {
  return commentAutomationController?.resolveMainVideoCommentText(..._0x48b37a);
}
function resolveVideoCommentImagePaths(..._0x12ba4f) {
  return commentAutomationController?.resolveVideoCommentImagePaths(..._0x12ba4f);
}
function restoreCommentAttachmentRotationFromSession(..._0x1a0a41) {
  return commentAutomationController?.restoreCommentAttachmentRotationFromSession(..._0x1a0a41);
}
function persistCommentAttachmentRotation(..._0x26fb0a) {
  return commentAutomationController?.persistCommentAttachmentRotation(..._0x26fb0a);
}
function saveCommentScrapeProgress(..._0x1114d7) {
  return commentAutomationController?.saveCommentScrapeProgress(..._0x1114d7);
}
function syncCommentAttachmentRotationFromBatchStorage(..._0x87a8d4) {
  return commentAutomationController?.syncCommentAttachmentRotationFromBatchStorage(..._0x87a8d4);
}
function waitAndCaptureCurrentVideoMetadata(..._0x52715e) {
  return commentAutomationController?.waitAndCaptureCurrentVideoMetadata(..._0x52715e);
}
function waitForProfileWorksReady(..._0x12e03b) {
  return commentAutomationController?.waitForProfileWorksReady(..._0x12e03b);
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
      set: _0x230431 => {
        currentRunningSource = _0x230431;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0xf1b8dd => {
        currentTask = _0xf1b8dd;
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
} catch (_0x3f2947) {
  commentFeedNavigationControllerLoadError = _0x3f2947;
  console.error("[Built-in-Debug] 评论面板与推荐流导航控制器加载失败:", _0x3f2947);
}
function aggressiveCommentListScroll(..._0x32cac6) {
  return commentFeedNavigationController?.aggressiveCommentListScroll(..._0x32cac6);
}
function awaitFeedVideoSwitchSettled(..._0x1d149c) {
  return commentFeedNavigationController?.awaitFeedVideoSwitchSettled(..._0x1d149c);
}
function ensureCommentPanelOpen(..._0x4b6574) {
  return commentFeedNavigationController?.ensureCommentPanelOpen(..._0x4b6574);
}
function expandReplies(..._0x23ec97) {
  return commentFeedNavigationController?.expandReplies(..._0x23ec97);
}
function findCommentScrollContainer(..._0x1e5bc8) {
  return commentFeedNavigationController?.findCommentScrollContainer(..._0x1e5bc8);
}
function getAdaptiveCommentWaitRange(..._0x3dbc17) {
  return commentFeedNavigationController?.getAdaptiveCommentWaitRange(..._0x3dbc17);
}
function getCommentEndHintText(..._0x24f91f) {
  return commentFeedNavigationController?.getCommentEndHintText(..._0x24f91f) || "";
}
function getCommentScrollMetrics(..._0x1f0c77) {
  return commentFeedNavigationController?.getCommentScrollMetrics(..._0x1f0c77);
}
function getCommentsTotalCount(..._0x4e58c3) {
  return commentFeedNavigationController?.getCommentsTotalCount(..._0x4e58c3) || 0;
}
function getExtendedReadyBudgetMs(..._0x95e47f) {
  return commentFeedNavigationController?.getExtendedReadyBudgetMs(..._0x95e47f) || 0;
}
function getExtendedReadyRounds(..._0x4b59ee) {
  return commentFeedNavigationController?.getExtendedReadyRounds(..._0x4b59ee) || 0;
}
function getScrapeNoCompliantTolerance(..._0x17c303) {
  return commentFeedNavigationController?.getScrapeNoCompliantTolerance(..._0x17c303) || 0;
}
function getScrapeNoNewDataTolerance(..._0xbfcfaf) {
  return commentFeedNavigationController?.getScrapeNoNewDataTolerance(..._0xbfcfaf) || 0;
}
function getVideoStats(..._0x50679a) {
  return commentFeedNavigationController?.getVideoStats(..._0x50679a);
}
function getVisibleCommentNodeCount(..._0x243191) {
  return commentFeedNavigationController?.getVisibleCommentNodeCount(..._0x243191) || 0;
}
function getVisibleCommentViewportFingerprint(..._0x5927f6) {
  return commentFeedNavigationController?.getVisibleCommentViewportFingerprint(..._0x5927f6) || "";
}
function isCommentPanelContentLoading(..._0x24d980) {
  return commentFeedNavigationController?.isCommentPanelContentLoading(..._0x24d980) || false;
}
function isCommentPanelEmptyHint(..._0x4e8160) {
  return commentFeedNavigationController?.isCommentPanelEmptyHint(..._0x4e8160) || false;
}
function maybeTrimRuntimeMemory(..._0x3d8d4c) {
  return commentFeedNavigationController?.maybeTrimRuntimeMemory(..._0x3d8d4c);
}
function moveToNextVideo(..._0x311ad0) {
  return commentFeedNavigationController?.moveToNextVideo(..._0x311ad0);
}
function parseLocalizedCountText(..._0x30e052) {
  return commentFeedNavigationController?.parseLocalizedCountText(..._0x30e052) || 0;
}
function pruneStaleCommentDom(..._0x401857) {
  return commentFeedNavigationController?.pruneStaleCommentDom(..._0x401857);
}
function resolveEffectiveCommentTotalCount(..._0x1f9167) {
  return commentFeedNavigationController?.resolveEffectiveCommentTotalCount(..._0x1f9167);
}
function sampleVisibleCommentTexts(..._0x33bb2d) {
  return commentFeedNavigationController?.sampleVisibleCommentTexts(..._0x33bb2d) || [];
}
function scrollCommentList(..._0x17d726) {
  return commentFeedNavigationController?.scrollCommentList(..._0x17d726);
}
function shouldContinueScrapeAfterDuplicateWindow(..._0x176d0f) {
  return commentFeedNavigationController?.shouldContinueScrapeAfterDuplicateWindow(..._0x176d0f) || false;
}
function shouldExpandFoldedCommentReplies(..._0x3791ee) {
  return commentFeedNavigationController?.shouldExpandFoldedCommentReplies(..._0x3791ee) || false;
}
function shouldProbeIncompleteScrapeBoundary(..._0x1e9c15) {
  return commentFeedNavigationController?.shouldProbeIncompleteScrapeBoundary(..._0x1e9c15) || false;
}
function trimRuntimeMemory(..._0x53c07b) {
  return commentFeedNavigationController?.trimRuntimeMemory(..._0x53c07b);
}
function waitForCommentDomWarmup(..._0x5f023e) {
  return commentFeedNavigationController?.waitForCommentDomWarmup(..._0x5f023e);
}
function waitForFeedItemChange(..._0x15d3f4) {
  return commentFeedNavigationController?.waitForFeedItemChange(..._0x15d3f4) || false;
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
      set: _0x1d16b5 => {
        currentTask = _0x1d16b5;
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
} catch (_0x1b640f) {
  nurtureAutomationControllerLoadError = _0x1b640f;
  console.error("[Built-in-Debug] 养号控制器加载失败:", _0x1b640f);
}
function isDouyinFeedInlineContext(..._0x2ef2bb) {
  return nurtureAutomationController?.isDouyinFeedInlineContext(..._0x2ef2bb) || false;
}
function isDouyinFeedLiveStream(..._0x55b341) {
  return nurtureAutomationController?.isDouyinFeedLiveStream(..._0x55b341) || false;
}
function isDouyinFullLivePage(..._0x461d3a) {
  return nurtureAutomationController?.isDouyinFullLivePage(..._0x461d3a) || false;
}
function isDouyinLiveStreamTitle(..._0x3f891c) {
  return nurtureAutomationController?.isDouyinLiveStreamTitle(..._0x3f891c) || false;
}
function skipDouyinFeedLiveStream(..._0x303353) {
  return nurtureAutomationController?.skipDouyinFeedLiveStream(..._0x303353);
}
function startNurtureLoop(..._0x4ad5ad) {
  if (automationMediaController && commentFeedNavigationController && nurtureAutomationController?.startNurtureLoop) {
    return nurtureAutomationController.startNurtureLoop(..._0x4ad5ad);
  }
  const _0x3df39d = _0x4ad5ad[0];
  const _0x1c5ac9 = automationMediaControllerLoadError?.message || commentFeedNavigationControllerLoadError?.message || nurtureAutomationControllerLoadError?.message || "养号控制器未完成初始化";
  const _0x190ff8 = "养号任务初始化失败：" + _0x1c5ac9;
  reportTraceLog("❌ " + _0x190ff8, null, "warning");
  abortAutomationStartup(_0x3df39d, _0x190ff8);
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
      set: _0x56531c => {
        allowSpecificReprocess = _0x56531c;
      }
    },
    commentExpressionRotateIndex: {
      enumerable: true,
      get: () => commentExpressionRotateIndex,
      set: _0x1901fa => {
        commentExpressionRotateIndex = _0x1901fa;
      }
    },
    commentImageRotateIndex: {
      enumerable: true,
      get: () => commentImageRotateIndex,
      set: _0x4bab69 => {
        commentImageRotateIndex = _0x4bab69;
      }
    },
    currentRunningSource: {
      enumerable: true,
      get: () => currentRunningSource,
      set: _0x2bc6f2 => {
        currentRunningSource = _0x2bc6f2;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x4528cd => {
        currentTask = _0x4528cd;
      }
    },
    interactedInSession: {
      enumerable: true,
      get: () => interactedInSession,
      set: _0x5d47f3 => {
        interactedInSession = _0x5d47f3;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: _0x397d4e => {
        lastClickedId = _0x397d4e;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: _0x426b82 => {
        lockedFeedIdentity = _0x426b82;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: _0x3aa751 => {
        lockedLeadVideoUrl = _0x3aa751;
      }
    },
    processedVideos: {
      enumerable: true,
      get: () => processedVideos,
      set: _0x17c40e => {
        processedVideos = _0x17c40e;
      }
    },
    scrapeAiQueue: {
      enumerable: true,
      get: () => scrapeAiQueue,
      set: _0x34d079 => {
        scrapeAiQueue = _0x34d079;
      }
    },
    searchCardOpenFailureStreak: {
      enumerable: true,
      get: () => searchCardOpenFailureStreak,
      set: _0x25896c => {
        searchCardOpenFailureStreak = _0x25896c;
      }
    },
    sessionDmCount: {
      enumerable: true,
      get: () => sessionDmCount,
      set: _0x22c8a6 => {
        sessionDmCount = _0x22c8a6;
      }
    },
    sessionDmLimit: {
      enumerable: true,
      get: () => sessionDmLimit,
      set: _0x254309 => {
        sessionDmLimit = _0x254309;
      }
    },
    sessionFollowCount: {
      enumerable: true,
      get: () => sessionFollowCount,
      set: _0x12d12f => {
        sessionFollowCount = _0x12d12f;
      }
    },
    sessionFollowLimit: {
      enumerable: true,
      get: () => sessionFollowLimit,
      set: _0x3f6d60 => {
        sessionFollowLimit = _0x3f6d60;
      }
    },
    sessionInteractionCount: {
      enumerable: true,
      get: () => sessionInteractionCount,
      set: _0x10092f => {
        sessionInteractionCount = _0x10092f;
      }
    },
    sessionInteractionLimit: {
      enumerable: true,
      get: () => sessionInteractionLimit,
      set: _0x56590d => {
        sessionInteractionLimit = _0x56590d;
      }
    },
    sessionProcessedCount: {
      enumerable: true,
      get: () => sessionProcessedCount,
      set: _0x45d9b3 => {
        sessionProcessedCount = _0x45d9b3;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x23d755 => {
        stopRequested = _0x23d755;
      }
    },
    targetVideoCount: {
      enumerable: true,
      get: () => targetVideoCount,
      set: _0x36aff7 => {
        targetVideoCount = _0x36aff7;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x3313b6 => {
        taskRunning = _0x3313b6;
      }
    },
    videoCommentExpressionRotateIndex: {
      enumerable: true,
      get: () => videoCommentExpressionRotateIndex,
      set: _0x16a0db => {
        videoCommentExpressionRotateIndex = _0x16a0db;
      }
    },
    videoCommentImageRotateIndex: {
      enumerable: true,
      get: () => videoCommentImageRotateIndex,
      set: _0x460fcf => {
        videoCommentImageRotateIndex = _0x460fcf;
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
} catch (_0x2ea679) {
  console.error("[Built-in-Debug] 评论获客主流程控制器加载失败:", _0x2ea679);
}
function startAutomation(..._0x37e2b9) {
  const _0x4ac138 = _0x37e2b9[0];
  if (!commentFeedNavigationController) {
    const _0x5f3a70 = commentFeedNavigationControllerLoadError?.message || "评论面板与推荐流导航控制器未完成初始化";
    const _0x3f3ab3 = "评论获客初始化失败：" + _0x5f3a70;
    reportTraceLog("❌ " + _0x3f3ab3, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x3f3ab3);
    return Promise.resolve();
  }
  if (!douyinSearchMetadataController) {
    const _0x32ca3c = douyinSearchMetadataControllerLoadError?.message || "抖音搜索元数据控制器未完成初始化";
    const _0x148c78 = "评论获客初始化失败：" + _0x32ca3c;
    reportTraceLog("❌ " + _0x148c78, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x148c78);
    return Promise.resolve();
  }
  if (!douyinDomInteractionController) {
    const _0x14cb40 = douyinDomInteractionControllerLoadError?.message || "抖音 DOM 交互控制器未完成初始化";
    const _0x1a9c4c = "评论获客初始化失败：" + _0x14cb40;
    reportTraceLog("❌ " + _0x1a9c4c, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x1a9c4c);
    return Promise.resolve();
  }
  if (!profileInteractionController) {
    const _0x2d4d3c = profileInteractionControllerLoadError?.message || "子视图主页互动控制器未完成初始化";
    const _0x132123 = "评论获客初始化失败：" + _0x2d4d3c;
    reportTraceLog("❌ " + _0x132123, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x132123);
    return Promise.resolve();
  }
  if (!douyinDirectMessageController) {
    const _0x55b2e1 = douyinDirectMessageControllerLoadError?.message || "抖音私信控制器未完成初始化";
    const _0x2697c6 = "评论获客初始化失败：" + _0x55b2e1;
    reportTraceLog("❌ " + _0x2697c6, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x2697c6);
    return Promise.resolve();
  }
  if (!automationMediaController) {
    const _0x4795dd = automationMediaControllerLoadError?.message || "自动化媒体守护控制器未完成初始化";
    const _0x385de3 = "评论获客初始化失败：" + _0x4795dd;
    reportTraceLog("❌ " + _0x385de3, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x385de3);
    return Promise.resolve();
  }
  if (!specificVideoNavigationController) {
    const _0x2acbae = specificVideoNavigationControllerLoadError?.message || "指定视频导航控制器未完成初始化";
    const _0x520e7d = "评论获客初始化失败：" + _0x2acbae;
    reportTraceLog("❌ " + _0x520e7d, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x520e7d);
    return Promise.resolve();
  }
  if (!searchVideoQueueController) {
    const _0x246ee1 = searchVideoQueueControllerLoadError?.message || "搜索视频队列控制器未完成初始化";
    const _0x5817c3 = "评论获客初始化失败：" + _0x246ee1;
    reportTraceLog("❌ " + _0x5817c3, null, "warning");
    abortAutomationStartup(_0x4ac138, _0x5817c3);
    return Promise.resolve();
  }
  if (!commentAutomationController) {
    const _0x19578a = commentAutomationControllerLoadError?.message || "评论控制器未完成初始化";
    const _0xff523d = "评论获客初始化失败：" + _0x19578a;
    reportTraceLog("❌ " + _0xff523d, null, "warning");
    abortAutomationStartup(_0x4ac138, _0xff523d);
    return Promise.resolve();
  }
  if (!leadgenAutomationController?.startAutomation) {
    const _0xe76285 = "评论获客初始化失败：主流程控制器不可用";
    reportTraceLog("❌ " + _0xe76285, null, "warning");
    abortAutomationStartup(_0x4ac138, _0xe76285);
    return Promise.resolve();
  }
  return leadgenAutomationController.startAutomation(..._0x37e2b9);
}
ipcRenderer.on("self-warmup-profile-dm", async (_0x5e9446, _0x5b9752 = {}) => {
  const {
    requestId: _0xc16887,
    dmText: _0x149671,
    nickname: _0xa368e4,
    userUrl: _0x485425
  } = _0x5b9752;
  stopRequested = false;
  pausedForSubview = false;
  try {
    const _0xa58c95 = await sendDmOnCurrentProfile(_0x149671, "SELF_WARMUP", {
      nickname: _0xa368e4,
      userUrl: _0x485425
    });
    ipcRenderer.send("self-warmup-profile-dm-result", {
      requestId: _0xc16887,
      ..._0xa58c95
    });
  } catch (_0x4aa220) {
    logSelfWarmupDm("私信异常", {
      nickname: _0xa368e4,
      error: _0x4aa220?.message || String(_0x4aa220)
    });
    ipcRenderer.send("self-warmup-profile-dm-result", {
      requestId: _0xc16887,
      ok: false,
      reason: _0x4aa220?.message || String(_0x4aa220)
    });
  }
});
ipcRenderer.on("self-warmup-reply-dm", async (_0x206edb, _0x101863 = {}) => {
  const {
    requestId: _0x679c94,
    dmText: _0x520a43,
    nickname: _0x50f844,
    text: _0x43dd72,
    config: _0x1df269,
    accountId: _0x116c81,
    account: _0x265697,
    excludeGroupChats: _0x31a429
  } = _0x101863;
  stopRequested = false;
  pausedForSubview = false;
  try {
    const _0x2717c8 = await replyDmInConversation(_0x520a43, "SELF_WARMUP", {
      nickname: _0x50f844,
      text: _0x43dd72,
      config: _0x1df269,
      accountId: _0x116c81,
      account: _0x265697,
      excludeGroupChats: _0x31a429 !== false
    });
    ipcRenderer.send("self-warmup-reply-dm-result", {
      requestId: _0x679c94,
      ..._0x2717c8
    });
  } catch (_0xb88a9f) {
    logSelfWarmupDm("回复私信异常", {
      nickname: _0x50f844,
      error: _0xb88a9f?.message || String(_0xb88a9f)
    });
    ipcRenderer.send("self-warmup-reply-dm-result", {
      requestId: _0x679c94,
      ok: false,
      reason: _0xb88a9f?.message || String(_0xb88a9f)
    });
  }
});
ipcRenderer.on("self-warmup-close-dm", async (_0x4c4b0f, _0x43b70d = {}) => {
  const {
    requestId: _0x4c6a3e
  } = _0x43b70d;
  try {
    const _0x2daec5 = Array.from(document.querySelectorAll("button, div, span, a")).find(_0x610bf1 => {
      if (!isVisibleElement(_0x610bf1)) {
        return false;
      }
      const _0x5b79d2 = (_0x610bf1.innerText || _0x610bf1.textContent || "").trim();
      return _0x5b79d2 === "关闭会话" || _0x5b79d2.includes("关闭会话");
    });
    const _0x39ec50 = [".RightPanelHeadercloseImPage", "[class*=\"closeImPage\"]", "[class*=\"CloseImPage\"]", "[class*=\"RightPanelHeader\"] [class*=\"close\"]", "[class*=\"RightPanelHeader\"] svg", "#imSaasContainerId [aria-label=\"关闭\"]", "[data-e2e=\"im-dialog\"] [aria-label=\"关闭\"]", "[class*=\"Header\"] [class*=\"close\"]", "[class*=\"header\"] [class*=\"close\"]", "[class*=\"im-dialog\"] [class*=\"close\"]", "[class*=\"im-dialog\"] [aria-label=\"关闭\"]"].join(", ");
    const _0x257644 = Array.from(document.querySelectorAll(_0x39ec50)).find(isVisibleElement);
    const _0x3ba1f7 = _0x2daec5 || _0x257644;
    let _0x1487fc = false;
    if (_0x3ba1f7) {
      console.log("[Built-in-Debug] [私信关闭] 发现私信窗口顶部「关闭会话」按钮，点击关闭会话...");
      await simulateHumanClick(_0x3ba1f7, "SELF_WARMUP");
      await sleep(600);
      _0x1487fc = true;
    }
    window.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27,
      bubbles: true
    }));
    await sleep(300);
    await closeAllModals("SELF_WARMUP");
    ipcRenderer.send("self-warmup-close-dm-result", {
      requestId: _0x4c6a3e,
      ok: true,
      closedByBtn: _0x1487fc
    });
  } catch (_0x227f65) {
    ipcRenderer.send("self-warmup-close-dm-result", {
      requestId: _0x4c6a3e,
      ok: false,
      reason: _0x227f65?.message || String(_0x227f65)
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
      set: _0x4711f7 => {
        activeLoopId = _0x4711f7;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x2a4be9 => {
        currentTask = _0x2a4be9;
      }
    },
    currentViewKey: {
      enumerable: true,
      get: () => currentViewKey,
      set: _0x3e4d67 => {
        currentViewKey = _0x3e4d67;
      }
    },
    lastProfileVideoDetailDiagnostic: {
      enumerable: true,
      get: () => lastProfileVideoDetailDiagnostic,
      set: _0x398772 => {
        lastProfileVideoDetailDiagnostic = _0x398772;
      }
    },
    lastTrustedClickDiagnostic: {
      enumerable: true,
      get: () => lastTrustedClickDiagnostic,
      set: _0x1cabe9 => {
        lastTrustedClickDiagnostic = _0x1cabe9;
      }
    },
    pausedForSubview: {
      enumerable: true,
      get: () => pausedForSubview,
      set: _0x395991 => {
        pausedForSubview = _0x395991;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x246cd5 => {
        stopRequested = _0x246cd5;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x3dd029 => {
        taskRunning = _0x3dd029;
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
} catch (_0x2597c8) {
  console.error("[Built-in-Debug] 视频监控控制器加载失败:", _0x2597c8);
}
function buildLeadCommentFingerprint(..._0x2c90bd) {
  return videoMonitorController?.buildLeadCommentFingerprint(..._0x2c90bd);
}
function buildNodeCommentFingerprint(..._0x43c46e) {
  return videoMonitorController?.buildNodeCommentFingerprint(..._0x43c46e);
}
function collectDouyinCommentEmojiHints(..._0x5aff57) {
  return videoMonitorController?.collectDouyinCommentEmojiHints(..._0x5aff57);
}
function commentNodeViewportBonus(..._0x77d207) {
  return videoMonitorController?.commentNodeViewportBonus(..._0x77d207);
}
function detectMonitorPrivateProfile(..._0x4cd50e) {
  return videoMonitorController?.detectMonitorPrivateProfile(..._0x4cd50e);
}
function extractDouyinCommentContent(..._0x201ca2) {
  return videoMonitorController?.extractDouyinCommentContent(..._0x201ca2);
}
function getCommentTimeModule(..._0x32ac68) {
  return videoMonitorController?.getCommentTimeModule(..._0x32ac68);
}
function isCommentFromVideoAuthor(..._0x50745f) {
  return videoMonitorController?.isCommentFromVideoAuthor(..._0x50745f);
}
function normalizeDouyinCommentContent(..._0x4dc45f) {
  return videoMonitorController?.normalizeDouyinCommentContent(..._0x4dc45f);
}
function parseDouyinCommentNode(..._0x8861bc) {
  return videoMonitorController?.parseDouyinCommentNode(..._0x8861bc);
}
function performVideoMonitorFollow(..._0x1f37da) {
  return videoMonitorController?.performVideoMonitorFollow(..._0x1f37da);
}
function runVideoMonitorAction(..._0x484987) {
  return videoMonitorController?.runVideoMonitorAction(..._0x484987);
}
function runVideoMonitorAuthorWorksScrape(..._0x383c3c) {
  return videoMonitorController?.runVideoMonitorAuthorWorksScrape(..._0x383c3c);
}
function runVideoMonitorMoveNextVideo(..._0x1ae6c0) {
  return videoMonitorController?.runVideoMonitorMoveNextVideo(..._0x1ae6c0);
}
function runVideoMonitorOpenAuthorWork(..._0x1616fa) {
  return videoMonitorController?.runVideoMonitorOpenAuthorWork(..._0x1616fa);
}
function runVideoMonitorOpenSpecificVideo(..._0x506849) {
  return videoMonitorController?.runVideoMonitorOpenSpecificVideo(..._0x506849);
}
function runVideoMonitorScrapeComments(..._0xde2d30) {
  return videoMonitorController?.runVideoMonitorScrapeComments(..._0xde2d30);
}
function runVideoMonitorWaitVideoReady(..._0x2f753b) {
  return videoMonitorController?.runVideoMonitorWaitVideoReady(..._0x2f753b);
}
function runVideoMonitorConfirmAuthor(..._0x531962) {
  return videoMonitorController?.runVideoMonitorConfirmAuthor(..._0x531962);
}
function scoreCommentContentFingerprints(..._0x5b57a8) {
  return videoMonitorController?.scoreCommentContentFingerprints(..._0x5b57a8);
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
      set: _0x2254a1 => {
        currentRunningSource = _0x2254a1;
      }
    },
    currentTask: {
      enumerable: true,
      get: () => currentTask,
      set: _0x4961f2 => {
        currentTask = _0x4961f2;
      }
    },
    lastClickedId: {
      enumerable: true,
      get: () => lastClickedId,
      set: _0xf944bd => {
        lastClickedId = _0xf944bd;
      }
    },
    lockedFeedIdentity: {
      enumerable: true,
      get: () => lockedFeedIdentity,
      set: _0x438d13 => {
        lockedFeedIdentity = _0x438d13;
      }
    },
    lockedLeadVideoUrl: {
      enumerable: true,
      get: () => lockedLeadVideoUrl,
      set: _0x2c010c => {
        lockedLeadVideoUrl = _0x2c010c;
      }
    },
    stopRequested: {
      enumerable: true,
      get: () => stopRequested,
      set: _0x2b4de7 => {
        stopRequested = _0x2b4de7;
      }
    },
    taskRunning: {
      enumerable: true,
      get: () => taskRunning,
      set: _0x4784de => {
        taskRunning = _0x4784de;
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
} catch (_0x36c5ce) {
  console.error("[Built-in-Debug] 线索采集控制器加载失败:", _0x36c5ce);
}
function runEntityLeadgenScrapePage(..._0x21097b) {
  return entityLeadgenController?.runEntityLeadgenScrapePage(..._0x21097b);
}
function getEntityCommentScraperModule(..._0x5a1444) {
  return entityLeadgenController?.getEntityCommentScraperModule(..._0x5a1444);
}
function buildEntityCommentScraperDeps(..._0x552ed8) {
  return entityLeadgenController?.buildEntityCommentScraperDeps(..._0x552ed8) || {};
}
function dismissEntityLoginPopupsCore(..._0x5c8c50) {
  return entityLeadgenController?.dismissEntityLoginPopupsCore(..._0x5c8c50);
}
function ensureEntityApiBridge(..._0xf5a806) {
  return entityLeadgenController?.ensureEntityApiBridge(..._0xf5a806);
}
function ensureEntityApiHook(..._0x52409c) {
  return entityLeadgenController?.ensureEntityApiHook(..._0x52409c);
}
function ensureEntityLiveHook(..._0x2956f1) {
  return entityLeadgenController?.ensureEntityLiveHook(..._0x2956f1);
}
function installEntityFeedSwipeLock(..._0x43966d) {
  return entityLeadgenController?.installEntityFeedSwipeLock(..._0x43966d);
}
function removeEntityFeedSwipeLock(..._0x74ab9b) {
  return entityLeadgenController?.removeEntityFeedSwipeLock(..._0x74ab9b);
}
function isEntityLeadgenActive() {
  return !!entityLeadgenController?.isActive();
}
function runEntityLeadgenOpenFirstSearchVideo(..._0x4a4b1d) {
  return entityLeadgenController?.runEntityLeadgenOpenFirstSearchVideo(..._0x4a4b1d);
}
function runEntityLeadgenOpenSearchVideo(..._0x35f565) {
  return entityLeadgenController?.runEntityLeadgenOpenSearchVideo(..._0x35f565);
}
function runEntityLeadgenWaitVideoReady(..._0x6bd0f6) {
  return entityLeadgenController?.runEntityLeadgenWaitVideoReady(..._0x6bd0f6);
}
function runEntityLeadgenInspectRecommendVideo(..._0x394962) {
  return entityLeadgenController?.runEntityLeadgenInspectRecommendVideo(..._0x394962);
}
function runEntityLeadgenMoveNextRecommendVideo(..._0xb93309) {
  return entityLeadgenController?.runEntityLeadgenMoveNextRecommendVideo(..._0xb93309);
}
function runEntityLeadgenMoveNextSearchVideo(..._0x240104) {
  return entityLeadgenController?.runEntityLeadgenMoveNextSearchVideo(..._0x240104);
}
function cancelEntityLeadgenCollect(..._0x307c2b) {
  return entityLeadgenController?.cancelEntityLeadgenCollect(..._0x307c2b);
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
      } catch (_0x503b9) {}
    }, {
      once: true
    });
  } catch (_0x29e4ba) {}
})();
ipcRenderer.on("control-task", (_0x1639c8, {
  type: _0xa0e23a,
  payload: _0x151227
}) => {
  if (_0xa0e23a === "START_TASK") {
    if (!hasRemoteGatedConfig()) {
      console.error("[Built-in-Debug] [Security-Preload] 运行配置/授权尚未就绪，拒绝启动任务");
      reportTraceLog("⚠️ 运行环境尚未就绪，请先连接服务器获取配置。");
      ipcRenderer.send("task-finished", buildTaskFinishedPayload(_0x151227.taskId, "runtime_config_missing"));
      return;
    }
    if (window.location.href.includes("/user/") && _0x151227.taskMode !== "nurture") {
      const _0x4fae96 = resolveTaskEntryUrl(_0x151227);
      const _0x47495c = _0x4fae96.includes("showTab=like");
      const _0x2d26ef = window.location.href.includes("/user/") && (_0x47495c ? isOnDouyinLikeEntryPage() : !window.location.href.includes("showTab=like"));
      if (!_0x2d26ef) {
        console.log("[Built-in-Debug] 检测到外部个人主页，先跳转任务入口再启动");
        reportTraceLog("检测到外部个人主页，正在跳转任务入口…");
        if (_0x47495c) {
          markDouyinLikeEntryNavigation();
        }
        window.location.href = _0x4fae96;
        return;
      }
    }
    if (!_0x151227.taskId) {
      console.log("[Built-in-Debug] 收到环境加载指令，未检测到任务 ID，跳过自动化启动。");
      return;
    }
    let _0x42a1e9 = false;
    let _0x28688f = {};
    try {
      const _0x130d6f = readRadarSessionState(_0x151227.accountId, _0x151227.taskId, {
        migrateLegacy: true
      });
      _0x28688f = _0x130d6f;
      _0x42a1e9 = _0x130d6f.loopId === _0x151227.taskId;
      if (_0x42a1e9) {
        const _0x47f3a6 = Number(_0x130d6f.videoMin);
        const _0x49ca30 = Number(_0x130d6f.videoMax);
        if (Number.isFinite(_0x47f3a6) && _0x47f3a6 > 0) {
          _0x151227.videoMin = _0x130d6f.videoMin;
        }
        if (Number.isFinite(_0x49ca30) && _0x49ca30 > 0) {
          _0x151227.videoMax = _0x130d6f.videoMax;
        }
      }
      if (_0x42a1e9 && _0x130d6f.activeKeyword && _0x151227.useGlobalKeywordPool) {
        const _0x407c8b = String(_0x151227.keywords || "").trim();
        if (_0x407c8b && _0x407c8b !== _0x130d6f.activeKeyword) {
          _0x151227.keywords = _0x130d6f.activeKeyword;
          if (!_0x151227.keywordPoolResumeMatched) {
            ipcRenderer.invoke("claim-leadgen-keyword", {
              leadgenTaskId: _0x151227.leadgenTaskId,
              accountId: _0x151227.accountId,
              reuseActive: true,
              preferredKeyword: _0x130d6f.activeKeyword
            }).catch(() => {});
          }
        } else {
          _0x151227.keywords = _0x130d6f.activeKeyword;
        }
      }
    } catch (_0x492487) {}
    if (taskRunning && activeLoopId === _0x151227.taskId && !_0x42a1e9) {
      logTaskDbg("START_TASK", "忽略重复下发 taskId=" + _0x151227.taskId);
      return;
    }
    if (taskRunning && activeLoopId === _0x151227.taskId && _0x42a1e9) {
      logTaskDbg("START_TASK", "页面导航后续跑 taskId=" + _0x151227.taskId);
      taskRunning = false;
    }
    if (taskRunning) {
      logTaskDbg("START_TASK", "切换任务 " + activeLoopId + " → " + _0x151227.taskId);
      stopRequested = true;
    }
    cancelRandomWandering("start-task");
    const _0x30701b = markTaskRestartFromPayload(_0x151227);
    if (_0x30701b) {
      _0x28688f = {};
    }
    logTaskDbg("START_TASK", "taskId=" + _0x151227.taskId, {
      restart: _0x30701b,
      resume: _0x42a1e9,
      taskRunning: taskRunning,
      url: clipTraceText(window.location.href, 80)
    });
    currentTask = _0x151227;
    if (_0x30701b) {
      resetCommentImageRotation();
      try {
        persistCommentAttachmentRotation();
      } catch (_0x19cdff) {}
    } else if (!_0x42a1e9) {
      resetCommentImageRotation();
      try {
        syncCommentAttachmentRotationFromBatchStorage();
      } catch (_0x109e29) {}
    } else {
      restoreCommentAttachmentRotationFromSession(_0x151227.accountId, _0x151227.taskId);
      try {
        syncCommentAttachmentRotationFromBatchStorage();
      } catch (_0x3ac393) {}
    }
    try {
      const _0x2f4191 = resolveCommentImagePaths();
      const _0x4229a6 = resolveVideoCommentImagePaths();
      if (_0x2f4191.length || _0x4229a6.length) {
        console.log("[评论配图] 图片池: 回复=" + _0x2f4191.length + " 主评=" + _0x4229a6.length + (" | 轮询位: 回复=" + commentImageRotateIndex % Math.max(_0x2f4191.length, 1)) + (" 主评=" + videoCommentImageRotateIndex % Math.max(_0x4229a6.length, 1)));
      }
    } catch (_0x3d8552) {}
    activeLoopId = _0x151227.taskId;
    window._radar_account_id = _0x151227.accountId;
    window._radar_account_name = _0x151227.nickname || _0x151227.name;
    window._radar_platform = _0x151227.platform;
    if (_0x151227.isFree) {
      _0x151227.enableComment = false;
      _0x151227.enableVideoComment = false;
      _0x151227.enableFollow = false;
      _0x151227.enableDM = false;
      _0x151227.enableWarmup = false;
      console.log("[Built-in-Debug] [安全策略-Preload] 检测到免费版标识，已强制熔断自动回复、发表评论、关注、私信与预热特权");
    }
    if (_0x151227.taskMode === "scrape") {
      _0x151227.enableLike = false;
      _0x151227.enableComment = false;
      _0x151227.enableFollow = false;
      _0x151227.enableDM = false;
      _0x151227.enableWarmup = false;
      console.log("[Built-in-Debug] [安全策略] 已在 preload 环境下强制屏蔽所有物理互动及预热策略 (Scrape Mode Active)");
    }
    if (_0x151227.taskMode === "nurture") {
      _0x151227.enableLike = false;
      _0x151227.enableComment = false;
      _0x151227.enableFollow = false;
      _0x151227.enableDM = false;
      _0x151227.enableWarmup = false;
      _0x151227.enableVideoComment = false;
      _0x151227.aiReplyMode = false;
      _0x151227.videoSources = ["recommend"];
      _0x151227.processedVideos = [];
      processedVideos = new Set();
      sessionInteractionLimit = Infinity;
      console.log("[Built-in-Debug] [安全策略] 养号模式：已禁用全部获客互动，且不读写浏览视频库 (Nurture Mode Active)");
    }
    const _0x1e2a08 = restoreAutomationSessionLimits(_0x151227, _0x28688f);
    sessionInteractionCount = _0x1e2a08.interactionCount;
    sessionInteractionLimit = _0x1e2a08.interactionLimit;
    if (sessionInteractionLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务互动总上限: " + sessionInteractionLimit + " (点赞+回复+发表评论 合计)" + (sessionInteractionCount > 0 ? "，已恢复累计 " + sessionInteractionCount : ""), "color: #fbbf24; font-weight: bold;");
      ipcRenderer.send("automation-data", {
        type: "interaction-total-progress",
        payload: {
          accountId: _0x151227.accountId,
          current: sessionInteractionCount,
          limit: sessionInteractionLimit
        }
      });
    }
    sessionFollowCount = _0x1e2a08.followCount;
    sessionFollowLimit = _0x1e2a08.followLimit;
    sessionDmCount = _0x1e2a08.dmCount;
    sessionDmLimit = _0x1e2a08.dmLimit;
    sessionFollowLimitLogged = false;
    sessionDmLimitLogged = false;
    if (sessionFollowLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务关注上限: " + sessionFollowLimit + "，已恢复累计: " + sessionFollowCount, "color: #8b5cf6; font-weight: bold;");
    }
    if (sessionDmLimit !== Infinity) {
      console.log("%c[节奏控制] 本次任务私信上限: " + sessionDmLimit + "，已恢复累计: " + sessionDmCount, "color: #10b981; font-weight: bold;");
    }
    const _0x4df9e8 = sessionFollowLimit === Infinity ? "不限" : sessionFollowLimit + " 人";
    const _0x2172ba = sessionDmLimit === Infinity ? "不限" : sessionDmLimit + " 人";
    reportTraceLog("🛡 本次任务总上限：关注 " + _0x4df9e8 + "（已完成 " + sessionFollowCount + "），私信 " + _0x2172ba + "（已完成 " + sessionDmCount + "）");
    reportFollowUpLimitReached("follow");
    reportFollowUpLimitReached("dm");
    const _0xee810 = resolveTaskLocationFilterRegions(_0x151227);
    if (_0xee810.length) {
      const _0x650884 = !!getLocationFilterModule();
      reportTraceLog("📍 地区过滤已启用：" + formatTaskLocationFilterSummary(_0x151227) + ("（模块:" + (_0x650884 ? "shared" : "内置回退") + "）"));
      console.log("[Built-in-Debug] [地区过滤] 任务启动 mode=" + (_0x151227.locationFilterMode || "include") + (" regions=" + JSON.stringify(_0xee810)));
    }
    pausedForSubview = false;
    commentFailureStoppedTaskId = null;
    currentRunningSource = null;
    taskRunning = true;
    stopRequested = false;
    syncSpecificVideoPauseWatcher();
    if (_0x151227.taskMode === "nurture") {
      startNurtureLoop(_0x151227.taskId);
    } else {
      startAutomation(_0x151227.taskId);
    }
  } else if (_0xa0e23a === "STOP_TASK") {
    const _0x11fc61 = _0x151227?.taskId || null;
    if (_0x11fc61 && activeLoopId && _0x11fc61 !== activeLoopId) {
      console.log("[Built-in-Debug] 忽略过期 STOP_TASK: " + _0x11fc61 + " (当前 " + activeLoopId + ")");
      return;
    }
    pausedForSubview = false;
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      }
    } catch (_0x42e6aa) {}
    stopRequested = true;
    taskRunning = false;
    cancelRandomWandering("stop-task");
    pendingTaskRestart = false;
    allowSpecificReprocess = false;
    currentRunningSource = null;
    syncSpecificVideoPauseWatcher();
    resetScrapeAiQueueOnStop();
  } else if (_0xa0e23a === "PAUSE_TASK") {
    console.log("[Built-in-Debug] 收到暂停指令，挂起当前任务循环。");
    cancelRandomWandering("pause-task");
    pausedForSubview = false;
    taskRunning = false;
    currentRunningSource = null;
    syncSpecificVideoPauseWatcher();
  } else if (_0xa0e23a === "CANCEL_WANDERING") {
    cancelRandomWandering(_0x151227?.reason || "batch-cancelled");
  } else if (_0xa0e23a === "PERFORM_WANDERING") {
    const {
      duration: _0x427650,
      traceAccountId: _0x312208,
      batchRunId: _0x35440e
    } = _0x151227 || {};
    performRandomWandering(_0x427650, _0x312208, {
      source: "batch",
      batchRunId: _0x35440e
    }).catch(_0x5e3191 => {
      console.warn("[拟人闲逛] 执行异常: " + _0x5e3191.message);
    });
  } else if (_0xa0e23a === "VIDEO_MONITOR_ACTION") {
    runVideoMonitorAction(_0x151227);
  } else if (_0xa0e23a === "VIDEO_MONITOR_SCRAPE") {
    runVideoMonitorScrapeComments(_0x151227);
  } else if (_0xa0e23a === "VIDEO_MONITOR_AUTHOR_WORKS") {
    runVideoMonitorAuthorWorksScrape(_0x151227);
  } else if (_0xa0e23a === "VIDEO_MONITOR_OPEN_AUTHOR_WORK") {
    runVideoMonitorOpenAuthorWork(_0x151227 || {});
  } else if (_0xa0e23a === "VIDEO_MONITOR_MOVE_NEXT_VIDEO") {
    runVideoMonitorMoveNextVideo(_0x151227 || {});
  } else if (_0xa0e23a === "VIDEO_MONITOR_WAIT_VIDEO_READY") {
    runVideoMonitorWaitVideoReady(_0x151227 || {});
  } else if (_0xa0e23a === "VIDEO_MONITOR_CONFIRM_AUTHOR") {
    runVideoMonitorConfirmAuthor(_0x151227 || {});
  } else if (_0xa0e23a === "VIDEO_MONITOR_OPEN_SPECIFIC_VIDEO") {
    runVideoMonitorOpenSpecificVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_SCRAPE_PAGE") {
    runEntityLeadgenScrapePage(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_COLLECT") {
    runEntityLeadgenScrapePage({
      ...(_0x151227 || {}),
      sourceType: Array.isArray(_0x151227?.sourceTypes) ? _0x151227.sourceTypes[0] : _0x151227?.sourceType
    });
  } else if (_0xa0e23a === "ENTITY_LEADGEN_OPEN_FIRST_SEARCH_VIDEO") {
    runEntityLeadgenOpenFirstSearchVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_OPEN_SEARCH_VIDEO") {
    runEntityLeadgenOpenSearchVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_WAIT_VIDEO_READY") {
    runEntityLeadgenWaitVideoReady(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_INSPECT_RECOMMEND_VIDEO") {
    runEntityLeadgenInspectRecommendVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_MOVE_NEXT_RECOMMEND_VIDEO") {
    runEntityLeadgenMoveNextRecommendVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_MOVE_NEXT_SEARCH_VIDEO") {
    runEntityLeadgenMoveNextSearchVideo(_0x151227 || {});
  } else if (_0xa0e23a === "ENTITY_LEADGEN_CANCEL") {
    cancelEntityLeadgenCollect();
  }
});
async function performRandomWandering(_0x28a5f0, _0xea79c6 = null, _0x288f5f = {}) {
  if (!_0x28a5f0 || _0x28a5f0 < 2000) {
    return;
  }
  if (activeWanderingContext) {
    cancelRandomWandering("superseded");
  }
  const _0x4951e2 = ++wanderingGeneration;
  const _0xb52115 = _0x288f5f.source || "task";
  const _0x13e692 = _0x288f5f.batchRunId;
  const _0x379817 = _0xb52115 === "batch" ? "[批量间隙闲逛]" : "[闲逛]";
  activeWanderingContext = {
    token: _0x4951e2,
    source: _0xb52115,
    batchRunId: _0x13e692,
    cancelWait: null
  };
  const _0x2c138b = () => _0x4951e2 !== wanderingGeneration;
  const _0x48c599 = _0x43a02e => new Promise(_0x149e33 => {
    if (_0x2c138b()) {
      _0x149e33(false);
      return;
    }
    let _0xcec9c5 = false;
    let _0x56879e = null;
    const _0x2bda86 = _0x34995c => {
      if (_0xcec9c5) {
        return;
      }
      _0xcec9c5 = true;
      if (_0x56879e) {
        clearTimeout(_0x56879e);
      }
      if (activeWanderingContext?.token === _0x4951e2) {
        activeWanderingContext.cancelWait = null;
      }
      _0x149e33(_0x34995c && !_0x2c138b());
    };
    _0x56879e = setTimeout(() => _0x2bda86(true), Math.max(0, _0x43a02e));
    if (activeWanderingContext?.token === _0x4951e2) {
      activeWanderingContext.cancelWait = () => _0x2bda86(false);
    }
    if (_0x2c138b()) {
      _0x2bda86(false);
    }
  });
  const _0xc55362 = Math.round(_0x28a5f0 / 1000);
  const _0x36dd66 = Date.now() + _0x28a5f0;
  const _0x456ffa = window.location.pathname === "/" || window.location.pathname === "/recommend" || window.location.pathname === "";
  if (_0x456ffa) {
    console.log("%c" + _0x379817 + " 开始在推荐页刷视频闲逛 " + _0xc55362 + "s...", "color: #10b981; font-weight: bold;");
    if (_0xb52115 === "batch") {
      reportTraceLog("🚶 批量间隙：推荐页拟人闲逛已启动", _0xea79c6);
    }
  } else {
    console.log("%c" + _0x379817 + " 开始在当前主页随机闲逛 " + _0xc55362 + "s...", "color: #10b981; font-weight: bold;");
    if (_0xb52115 === "batch") {
      reportTraceLog("🚶 批量间隙：主页拟人闲逛已启动", _0xea79c6);
    }
  }
  while (Date.now() < _0x36dd66 && !_0x2c138b()) {
    try {
      if (_0x456ffa) {
        console.log(_0x379817 + " 推荐页：切换下一个视频");
        window.dispatchEvent(new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true
        }));
        const _0x1dbf4d = document.querySelector("[data-e2e=\"feed-active-video\"]") || document.body;
        if (_0x1dbf4d) {
          _0x1dbf4d.scrollIntoView({
            behavior: "smooth"
          });
        }
        const _0x1a3902 = Math.min(_0x36dd66 - Date.now(), Math.floor(Math.random() * 4000) + 4000);
        if (_0x1a3902 > 0) {
          if (!(await _0x48c599(_0x1a3902))) {
            break;
          }
        }
      } else {
        const _0x1582d0 = Math.random();
        if (_0x1582d0 > 0.6) {
          const _0x47f90a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 400) + 100);
          window.scrollBy({
            top: _0x47f90a,
            behavior: "smooth"
          });
          console.log(_0x379817 + " 模拟滑动: " + _0x47f90a + "px");
        } else if (_0x1582d0 > 0.3) {
          console.log(_0x379817 + " 模拟停顿阅读...");
          if (!(await _0x48c599(1000))) {
            break;
          }
        }
        if (!(await _0x48c599(Math.floor(Math.random() * 2000) + 1000))) {
          break;
        }
      }
    } catch (_0xa5b5b4) {
      if (!(await _0x48c599(1000))) {
        break;
      }
    }
  }
  const _0x24ecba = _0x2c138b();
  if (!_0x24ecba) {
    console.log(_0x379817 + " 结束");
  }
  if (activeWanderingContext?.token === _0x4951e2) {
    activeWanderingContext = null;
  }
}
ipcRenderer.on("sync-processed-video", (_0x562886, {
  url: _0x3a73b5
}) => {
  if (_0x3a73b5) {
    getProcessedVideoKeyModule().rememberProcessedVideoKey(processedVideos, _0x3a73b5);
    console.log("[Built-in-Debug] [同步记忆] 已同步来自其他账号的扫描记录: " + _0x3a73b5);
  }
});
ipcRenderer.on("clear-processed-videos-cache", () => {
  processedVideos = new Set();
  console.log("[Built-in-Debug] [记忆清空] 已清空本窗口视频库缓存");
});
ipcRenderer.on("forget-processed-videos", (_0x5ebe8b, _0x4a85d4 = {}) => {
  const _0x9c53ac = Array.isArray(_0x4a85d4?.urls) ? _0x4a85d4.urls : [_0x4a85d4?.url || _0x4a85d4];
  const _0x302809 = getProcessedVideoKeyModule();
  let _0x5ae3f7 = 0;
  for (const _0x175241 of _0x9c53ac) {
    if (!_0x175241) {
      continue;
    }
    const _0x2861da = processedVideos.size;
    if (typeof _0x302809.forgetProcessedVideoKey === "function") {
      _0x302809.forgetProcessedVideoKey(processedVideos, _0x175241);
    } else {
      processedVideos.delete(_0x175241);
      const _0x18f0e8 = _0x302809.normalizeProcessedVideoKey?.(_0x175241);
      if (_0x18f0e8) {
        processedVideos.delete(_0x18f0e8);
      }
    }
    if (processedVideos.size < _0x2861da) {
      _0x5ae3f7 += 1;
    }
  }
  if (_0x5ae3f7 > 0) {
    console.log("[Built-in-Debug] [记忆同步] 已从本窗口移除 " + _0x5ae3f7 + " 条历史视频去重记录");
  }
});
ipcRenderer.on("sync-interacted-user", (_0x4f8cbb, {
  entries: _0xb547ea
}) => {
  if (_0xb547ea && Array.isArray(_0xb547ea)) {
    _0xb547ea.forEach(_0xd87ee2 => {
      const _0x53ce80 = typeof _0xd87ee2 === "string" ? _0xd87ee2 : _0xd87ee2.id || _0xd87ee2.userUrl || _0xd87ee2.nickname;
      if (_0x53ce80) {
        interactedInSession.add(_0x53ce80);
        rememberKnownLeadLookup(_0x53ce80, true);
        if (rememberCurrentTaskInteractedKey(_0x53ce80)) {
          console.log("[Built-in-Debug] [同步黑名单] 已同步来自其他账号的互动记录: " + _0x53ce80);
        }
      }
    });
  }
});
let scrapeAiQueue = [];
let isProcessingScrapeAi = false;
function pushToScrapeAiQueue(_0xa4c99a) {
  for (const _0x287cac of _0xa4c99a) {
    const _0x159d73 = getLeadPrimaryKey(_0x287cac);
    if (!_0x159d73) {
      scrapeAiQueue.push(_0x287cac);
      continue;
    }
    if (scrapeAiQueue.some(_0x4d06a0 => getLeadPrimaryKey(_0x4d06a0) === _0x159d73)) {
      continue;
    }
    scrapeAiQueue.push(_0x287cac);
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
      const _0x41868d = Math.min(scrapeAiQueue.length, 10);
      const _0x5d4a2e = scrapeAiQueue.splice(0, _0x41868d);
      const {
        forBackend: _0x4b81a8,
        localCount: _0x5382f7,
        localLeads: _0x40b472
      } = prepareLeadsForAiAnalysis(_0x5d4a2e);
      if (_0x5382f7 > 0) {
        reportTraceLog("🤖 异步 AI：" + _0x5382f7 + " 条已本地判定，" + _0x4b81a8.length + " 条提交后端…");
        ipcRenderer.send("automation-data", {
          type: "comment",
          payload: _0x40b472,
          taskId: activeLoopId,
          viewKey: currentTask?.viewKey,
          isAiMode: true
        });
      }
      if (_0x4b81a8.length === 0) {
        console.log("[Built-in-Debug] [异步AI] 批次 " + _0x5d4a2e.length + " 条均已本地判定，跳过云端");
        if (!taskRunning && scrapeAiQueue.length < 20) {
          break;
        }
        continue;
      }
      console.log("[Built-in-Debug] [异步AI] 正在分析批次 (" + _0x4b81a8.length + "条)...");
      console.log("%c[AI分析] 🤖 AI 正在分析 " + _0x4b81a8.length + " 条评论 (队列剩余: " + scrapeAiQueue.length + ")...", "color: #8b5cf6; font-weight: bold;");
      reportTraceLog("🤖 异步 AI：分析 " + _0x4b81a8.length + " 条（队列剩余 " + scrapeAiQueue.length + "），请求后端（失败将自动重试直至成功）…");
      const _0x3f9c1c = Date.now();
      const _0x245760 = await ipcRenderer.invoke("ai-intelligent-analyze-batch", buildAutomationAiPayload({
        leads: _0x4b81a8,
        config: {
          aiRole: currentTask.aiRole,
          aiGoal: currentTask.aiGoal,
          aiStyle: currentTask.aiStyle,
          aiPrompt: currentTask.aiPrompt
        }
      }));
      if (stopRequested || isAiInvokeCancelled(_0x245760)) {
        reportTraceLog("🤖 异步 AI：任务已停止，终止队列处理");
        break;
      }
      const _0x313c5b = ((Date.now() - _0x3f9c1c) / 1000).toFixed(1);
      if (_0x245760.success && _0x245760.data) {
        console.log("%c[AI分析] ✅ 批次分析完成 (" + _0x4b81a8.length + " 条)", "color: #10b981; font-weight: bold;");
        reportTraceLog("🤖 异步 AI：批次完成（耗时 " + _0x313c5b + "s，" + _0x4b81a8.length + " 条）");
        _0x245760.data.forEach((_0x141772, _0x5a311f) => {
          if (_0x4b81a8[_0x5a311f]) {
            _0x4b81a8[_0x5a311f].isHighIntention = _0x141772.decision !== "ignore";
            _0x4b81a8[_0x5a311f].aiThought = _0x141772.aiThought;
            if (_0x141772.aiThought) {
              _0x4b81a8[_0x5a311f].thought = _0x141772.aiThought;
            }
          }
        });
        ipcRenderer.send("automation-data", {
          type: "comment",
          payload: _0x4b81a8,
          taskId: activeLoopId,
          viewKey: currentTask?.viewKey,
          isAiMode: true
        });
        console.log("[Built-in-Debug] [异步AI] 批次分析完成并上报。");
      } else {
        const _0x3b7232 = isFatalAiAuthError(_0x245760?.msg) ? "（额度/授权问题，已停止重试）" : "";
        reportTraceLog("🤖 异步 AI：批次失败（耗时 " + _0x313c5b + "s）" + _0x3b7232 + "：" + clipTraceText(_0x245760?.msg || "未知原因"));
      }
      if (!taskRunning && scrapeAiQueue.length < 20) {
        break;
      }
      reportTraceLog("⏱ 异步 AI：批次间隔等待 2 秒…");
      await new Promise(_0x1dc4a2 => setTimeout(_0x1dc4a2, 2000));
    }
  } catch (_0x37409c) {
    console.error("[Built-in-Debug] [异步AI] 处理失败:", _0x37409c);
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
    window.addEventListener("radar-notice-json", _0x47f3d6 => {
      try {
        const _0x2f8906 = _0x47f3d6.detail;
        if (_0x2f8906 && typeof ipcRenderer !== "undefined") {
          ipcRenderer.send("self-warmup-notice-json", _0x2f8906);
        }
      } catch (_0x3e6078) {}
    });
    window.addEventListener("radar-im-json", _0x2b6221 => {
      try {
        const _0x171699 = _0x2b6221.detail;
        if (_0x171699 && typeof ipcRenderer !== "undefined") {
          ipcRenderer.send("self-warmup-im-json", _0x171699);
        }
      } catch (_0x2e88ab) {}
    });
    window.addEventListener("radar-profile-json", _0x463aa1 => {
      try {
        const _0x4758c4 = _0x463aa1.detail || {};
        const _0x18ec31 = parseProfileGenderFromApiPayload(_0x4758c4.data);
        if (_0x18ec31) {
          rememberProfileApiGenderHit(_0x18ec31, {
            url: _0x4758c4.url || "",
            source: "api_intercept"
          });
          console.log("[Built-in-Debug] 截获 profile/other 性别: " + _0x18ec31.gender + ("（code=" + (_0x18ec31.genderCode ?? "-") + "，sec_uid=" + (_0x18ec31.secUid || "").slice(0, 16) + "…）"));
        }
      } catch (_0x1610fa) {}
    });
    const _0x507bc6 = document.createElement("script");
    _0x507bc6.textContent = sanitizeInlinePageScript("(() => {\n            if (window.__radarMainNoticeHooked) return;\n            window.__radarMainNoticeHooked = true;\n\n            const notify = (url, jsonText) => {\n                try {\n                    if (!jsonText) return;\n                    const u = String(url || '');\n                    const isNotice = /\\/notice\\/|\\/aweme\\/v1\\/web\\/notice/i.test(u);\n                    const isIm = /\\/im\\/|\\/chat\\/|\\/session\\/|\\/conversation\\//i.test(u);\n                    const isProfile = /\\/aweme\\/v1\\/web\\/user\\/profile\\/other\\//i.test(u);\n                    const isCommentList = /\\/aweme\\/v1\\/web\\/comment\\/list/i.test(u);\n                    if (!isNotice && !isIm && !isProfile && !isCommentList) return;\n\n                    const data = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;\n                    if (isNotice) {\n                        window.dispatchEvent(new CustomEvent('radar-notice-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isIm) {\n                        window.dispatchEvent(new CustomEvent('radar-im-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isProfile) {\n                        window.dispatchEvent(new CustomEvent('radar-profile-json', { detail: { url: u, data, ts: Date.now() } }));\n                    }\n                    if (isCommentList) {\n                        const raw = (data && data.comments) || (data && data.data && data.data.comments) || [];\n                        const list = Array.isArray(raw) ? raw : [];\n                        const cids = [];\n                        for (let i = 0; i < list.length; i++) {\n                            const cid = String((list[i] && (list[i].cid || list[i].comment_id || list[i].commentId)) || '').trim();\n                            if (/^\\d{10,}$/.test(cid) && cids.indexOf(cid) < 0) cids.push(cid);\n                        }\n                        let awemeId = '';\n                        try {\n                            awemeId = String(new URL(u, location.origin).searchParams.get('aweme_id') || '').trim();\n                        } catch (_) {}\n                        window.__radarLatestCommentList = {\n                            url: u,\n                            ts: Date.now(),\n                            awemeId,\n                            cids,\n                            count: list.length,\n                        };\n                    }\n                } catch (_) {}\n            };\n\n            const shouldHook = (url) => /\\/notice\\/|\\/aweme\\/v1\\/web\\/notice|\\/im\\/|\\/chat\\/|\\/session\\/|\\/aweme\\/v1\\/web\\/user\\/profile\\/other\\/|\\/aweme\\/v1\\/web\\/comment\\/list/i.test(String(url || ''));\n\n            const origFetch = window.fetch;\n            if (typeof origFetch === 'function') {\n                window.fetch = async function(...args) {\n                    const res = await origFetch.apply(this, args);\n                    try {\n                        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');\n                        if (shouldHook(url)) {\n                            const clone = res.clone();\n                            clone.text().then(text => notify(url, text)).catch(() => {});\n                        }\n                    } catch (_) {}\n                    return res;\n                };\n            }\n\n            const origOpen = XMLHttpRequest.prototype.open;\n            const origSend = XMLHttpRequest.prototype.send;\n            XMLHttpRequest.prototype.open = function(method, url, ...rest) {\n                this.__radarUrl = url;\n                return origOpen.call(this, method, url, ...rest);\n            };\n            XMLHttpRequest.prototype.send = function(...args) {\n                this.addEventListener('load', function() {\n                    try {\n                        const url = String(this.__radarUrl || '');\n                        if (shouldHook(url)) {\n                            notify(url, this.responseText);\n                        }\n                    } catch (_) {}\n                }, { once: true });\n                return origSend.apply(this, args);\n            };\n        })();");
    (document.head || document.documentElement).appendChild(_0x507bc6);
    _0x507bc6.remove();
  } catch (_0x157cdf) {}
}
if (typeof document !== "undefined") {
  try {
    injectNoticeJsonInterceptor();
  } catch (_0x2d51a1) {}
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectNoticeJsonInterceptor, {
      once: true
    });
  }
}

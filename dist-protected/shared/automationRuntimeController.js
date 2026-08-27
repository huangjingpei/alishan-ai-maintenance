'use strict';

function createAutomationRuntimeController(_0x4e6eeb = {}) {
  const {
    DOUYIN_LIKE_ENTRY_URL: _0x542118,
    DOUYIN_RECOMMEND_URL: _0xc9047c,
    getDouyinLikeEntryUrl: _0x3896cb,
    getDouyinRecommendUrl: _0x22aefe,
    getDouyinFollowUrl: _0x5c87ec,
    buildDouyinSearchUrl: _0x1f83ec,
    dismissEntityLoginPopupsCore: _0x50140c,
    finalizeAccountTask: _0x3f0212,
    getCommentV2String: _0x1fbb3e,
    getCommentV2List: _0x570b08,
    getMainCommentInputShellSelector: _0x328a9a,
    hasCommentNonTextPayload: _0x55a0db,
    ipcRenderer: _0x511cd4,
    isAiInvokeCancelled: _0x4f940c,
    isElementInViewport: _0x552c68,
    isElementInViewportForAutomation: _0x316aed,
    isMonitorLoopId: _0x302b34,
    isProfileFirstCommentAiMode: _0x4938d4,
    isVisibleElement: _0x21b65c,
    localStorage: _0x35f377,
    matchesPlaceholderHint: _0x56c995,
    radarSessionKey: _0x283cd6,
    randomDelay: _0x1ebf90,
    readRadarSessionState: _0x1a2ccc,
    resolveMainCommentWritableElement: _0x5f1c47,
    sessionStorage: _0x3ffb63,
    shouldAbort: _0x4913fc,
    simulateHumanClick: _0x1060de,
    sleep: _0x224c1b,
    preloadDir: _0x207d3c,
    state: _0x3b9fd2
  } = _0x4e6eeb;
  const _0x370af9 = _0x207d3c;
  const _0x3bdfe2 = () => typeof _0x22aefe === "function" ? _0x22aefe() : _0xc9047c;
  const _0x4835b7 = () => typeof _0x3896cb === "function" ? _0x3896cb() : _0x542118;
  const _0x9deeea = () => typeof _0x5c87ec === "function" ? _0x5c87ec() : "https://www.douyin.com/follow";
  function _0x290466(_0x3e0983, _0x565122 = null, _0x36aeda = "normal") {
    if (!_0x3e0983) {
      return;
    }
    _0x140dc2(_0x3e0983, _0x565122, _0x36aeda);
    try {
      const _0x546398 = _0x565122 || window._radar_account_id || _0x3ffb63.getItem("radar_account_id") || "default";
      _0x511cd4.send("automation-data", {
        type: "current-action",
        payload: {
          accountId: _0x546398,
          action: _0x3e0983,
          level: _0x36aeda
        }
      });
    } catch (_0xf32a81) {
      console.warn("[Built-in-Debug] 汇报当前动作失败:", _0xf32a81);
    }
  }
  function _0x140dc2(_0x4f0adc, _0x55bcc1 = null, _0x14a865 = "normal") {
    const _0x2c3ddb = String(_0x4f0adc || "").trim();
    if (!_0x2c3ddb) {
      return;
    }
    try {
      const _0x3b35cf = _0x55bcc1 || window._radar_account_id || _0x3ffb63.getItem("radar_account_id") || "default";
      const _0x598c82 = _0x3b9fd2.currentTask?.isBatchAction ? _0x3b9fd2.currentTask.batchRunId ?? _0x3b9fd2.currentTask.runId : undefined;
      _0x511cd4.send("automation-data", {
        type: "trace-log",
        payload: {
          accountId: _0x3b35cf,
          message: _0x2c3ddb,
          level: _0x14a865,
          runId: _0x598c82,
          batchRunId: _0x598c82
        }
      });
    } catch (_0x64cc9d) {
      console.warn("[Built-in-Debug] 轨迹详情上报失败:", _0x64cc9d);
    }
  }
  function _0x3709dd() {
    return window._radar_account_id || _0x3ffb63.getItem("radar_account_id") || "default";
  }
  function _0x2b9e3f(_0x150424 = {}) {
    return {
      accountId: _0x3709dd(),
      ..._0x150424
    };
  }
  function _0x334fa9(_0x321038, _0x9f9f75 = null) {
    const _0x173b98 = String(_0x321038 || "").trim();
    if (!_0x173b98) {
      return;
    }
    _0x140dc2("📝 首作评论：" + _0x173b98, _0x9f9f75);
  }
  function _0x31dea9(_0x1c5546, _0x599430 = "", _0x4937e5 = "normal") {
    const _0x3124ba = _0x2fbda9(window._radar_account_name || window._radar_account_id || "?", 10);
    const _0x54221f = _0x599430 ? "：" + _0x599430 : "";
    _0x140dc2("🔍[主评·" + _0x3124ba + "] " + _0x1c5546 + _0x54221f, null, _0x4937e5);
  }
  function _0x57afe6(_0xe226fb, _0x4d3b72) {
    const _0x2dbe48 = "task_aborted_" + _0xe226fb;
    _0x31dea9("流程被中断", _0x2dbe48 + "；" + _0x3cf170(_0x4d3b72), "warning");
    return {
      success: false,
      error: _0x2dbe48,
      aborted: true
    };
  }
  function _0x129413(_0x1a640d) {
    if (!_0x1a640d) {
      return "";
    }
    return [_0x1a640d.getAttribute?.("placeholder") || "", _0x1a640d.getAttribute?.("data-placeholder") || "", _0x1a640d.getAttribute?.("aria-label") || "", _0x1a640d.innerText || _0x1a640d.textContent || ""].join(" ").replace(/\s+/g, " ").trim();
  }
  function _0x4b0572(_0x1a474c, {
    requireViewport = true,
    profileVideo = false
  } = {}) {
    if (!_0x1a474c || !_0x21b65c(_0x1a474c)) {
      return false;
    }
    if (requireViewport) {
      if (profileVideo ? !_0x552c68(_0x1a474c) : !_0x316aed(_0x1a474c)) {
        return false;
      }
    }
    const _0x2528a9 = [_0x1a474c.getAttribute?.("placeholder") || "", _0x1a474c.getAttribute?.("data-placeholder") || "", _0x1a474c.getAttribute?.("aria-label") || ""].join(" ").replace(/\s+/g, " ").trim();
    const _0x58e50d = (_0x1a474c.innerText || _0x1a474c.textContent || "").replace(/\s+/g, " ").trim();
    const _0x33ddd6 = _0x2528a9 || _0x58e50d;
    const _0x134308 = typeof _0x1a474c.className === "string" ? _0x1a474c.className.toLowerCase() : "";
    let _0x2c6d07 = false;
    if (_0x134308.includes("placeholder")) {
      const _0x2ec9db = _0x328a9a();
      try {
        _0x2c6d07 = !!_0x2ec9db && !!_0x1a474c.closest(_0x2ec9db);
      } catch (_0xca298a) {}
    }
    const _0x4f0d09 = _0x56c995(_0x33ddd6) || /说点什么|留下.*评论|友善交流|发条评论|写下.*评论|输入.*评论|发表评论/.test(_0x33ddd6) || _0x2c6d07;
    if (!_0x4f0d09) {
      return false;
    }
    if (_0x1a474c.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")) {
      return false;
    }
    if (!_0x2c6d07 && _0x1a474c.closest("button, [role=\"button\"]")) {
      return false;
    }
    if (!_0x2c6d07) {
      if (!_0x2528a9 && (_0x1a474c.children.length > 3 || _0x58e50d.length > 100)) {
        return false;
      }
      if (!_0x2528a9 && Array.from(_0x1a474c.children || []).some(_0x1c00e4 => {
        const _0x46c877 = _0x129413(_0x1c00e4);
        return _0x46c877 && _0x46c877.length <= 100 && _0x56c995(_0x46c877);
      })) {
        return false;
      }
    }
    const _0x390779 = _0x1a474c.getBoundingClientRect();
    const _0x4be839 = Math.max(800, Math.floor(window.innerWidth * 0.72));
    const _0x38bf4c = _0x2c6d07 ? 180 : 140;
    if (_0x390779.height > _0x38bf4c || _0x390779.width > _0x4be839) {
      return false;
    }
    if (_0x390779.width < 12 || _0x390779.height < 12) {
      return false;
    }
    const _0x115dc5 = _0x390779.left + _0x390779.width / 2;
    const _0x4cd68b = _0x390779.top + _0x390779.height / 2;
    if (requireViewport && (_0x115dc5 <= 5 || _0x4cd68b <= 5 || _0x115dc5 >= window.innerWidth - 5 || _0x4cd68b >= window.innerHeight - 5)) {
      return false;
    }
    return true;
  }
  function _0x34336e(_0xb9b191) {
    if (!_0xb9b191) {
      return -Infinity;
    }
    const _0x255380 = _0xb9b191.getBoundingClientRect();
    let _0x38cb73 = 0;
    const _0x7216ab = [_0xb9b191.getAttribute?.("placeholder") || "", _0xb9b191.getAttribute?.("data-placeholder") || "", _0xb9b191.getAttribute?.("aria-label") || ""].join(" ").trim();
    const _0x2ae35f = _0x328a9a();
    try {
      if (_0x2ae35f && _0xb9b191.closest(_0x2ae35f)) {
        _0x38cb73 += 240;
      }
    } catch (_0x40358a) {}
    if (_0x7216ab) {
      _0x38cb73 += 120;
    }
    if ((_0xb9b191.innerText || _0xb9b191.textContent || "").trim().length <= 50) {
      _0x38cb73 += 40;
    }
    if (_0x255380.left >= window.innerWidth * 0.45) {
      _0x38cb73 += 35;
    }
    _0x38cb73 += Math.max(0, Math.min(35, _0x255380.bottom / Math.max(window.innerHeight, 1) * 35));
    _0x38cb73 -= Math.min(60, _0xb9b191.querySelectorAll?.("*")?.length || 0);
    return _0x38cb73;
  }
  function _0x31c9cd(_0x45f929) {
    try {
      const _0xbe56a2 = _0x45f929 || document.body;
      const _0x55679b = _0x1fbb3e("commentInput");
      const _0x1a45b7 = _0x55679b ? new Set(Array.from(_0xbe56a2?.querySelectorAll?.(_0x55679b) || []).map(_0x5f1c47).filter(Boolean)).size : 0;
      const _0x448ca6 = Array.from(_0xbe56a2?.querySelectorAll?.("div, span, p, textarea[placeholder], input[placeholder], [contenteditable=\"true\"][data-placeholder], [role=\"textbox\"][aria-label]") || []).filter(_0x1a92c1 => {
        const _0x35af9e = _0x129413(_0x1a92c1);
        return _0x56c995(_0x35af9e) || /评论|说点什么|留下.*评论|友善交流/.test(_0x35af9e);
      });
      const _0x380f2f = _0x448ca6.length;
      const _0x153ecb = _0x448ca6.filter(_0x4ffb5f => _0x4b0572(_0x4ffb5f, {
        requireViewport: true,
        profileVideo: false
      })).length;
      const _0x3ec037 = _0x448ca6.filter(_0x1804c9 => _0x4b0572(_0x1804c9, {
        requireViewport: false,
        profileVideo: false
      })).length;
      return ["viewport=" + window.innerWidth + "x" + window.innerHeight, "visibility=" + document.visibilityState, "focused=" + (document.hasFocus?.() !== false), "modalConnected=" + !!_0x45f929?.isConnected, "editable=" + _0x1a45b7, "placeholder=" + _0x380f2f, "phClickable=" + _0x153ecb, "phLoose=" + _0x3ec037, "active=" + (document.activeElement?.tagName || "none"), "native=" + _0x3b9fd2.lastTrustedClickDiagnostic].join(" ");
    } catch (_0xbd9a67) {
      return "diagnostic_failed=" + _0x2fbda9(_0xbd9a67?.message || _0xbd9a67, 40);
    }
  }
  function _0x3cf170(_0x45e8cc) {
    const _0x472b32 = ["state.taskRunning=" + _0x3b9fd2.taskRunning, "state.stopRequested=" + _0x3b9fd2.stopRequested, "state.pausedForSubview=" + _0x3b9fd2.pausedForSubview, "loopId=" + (_0x45e8cc || "null"), "state.activeLoopId=" + (_0x3b9fd2.activeLoopId || "null")];
    if (_0x45e8cc && _0x45e8cc !== _0x3b9fd2.activeLoopId) {
      _0x472b32.push("loopId_mismatch");
    }
    if (!_0x3b9fd2.taskRunning && _0x45e8cc !== "BATCH" && _0x45e8cc !== "SELF_WARMUP" && (typeof _0x45e8cc !== "string" || !_0x45e8cc.startsWith("MONITOR"))) {
      _0x472b32.push("taskRunning_false");
    }
    return _0x472b32.join(", ");
  }
  let _0x2de608;
  function _0x13b88b() {
    if (_0x2de608 !== undefined) {
      return _0x2de608;
    }
    const _0x74fce3 = (() => {
      try {
        return require("path");
      } catch (_0x51edd3) {
        return null;
      }
    })();
    const _0x2b5b43 = ["./shared/automationTextHelpers", "./shared/automationTextHelpers.js"];
    if (_0x74fce3 && typeof _0x370af9 === "string") {
      _0x2b5b43.push(_0x74fce3.join(_0x370af9, "shared", "automationTextHelpers.js"), _0x74fce3.join(_0x370af9, "shared", "automationTextHelpers"), _0x74fce3.join(_0x370af9, "..", "shared", "automationTextHelpers.js"));
    }
    for (const _0x5a2421 of _0x2b5b43) {
      try {
        const _0x120ce4 = require(_0x5a2421);
        if (typeof _0x120ce4?.clipTraceText === "function" && typeof _0x120ce4?.personalizeDmTemplate === "function") {
          _0x2de608 = _0x120ce4;
          return _0x2de608;
        }
      } catch (_0x5009e1) {}
    }
    console.warn("[Built-in-Debug] automationTextHelpers 模块未找到，回退内置实现");
    _0x2de608 = null;
    return _0x2de608;
  }
  function _0x34f96f(_0x39c236) {
    const _0xdaff4d = _0x13b88b();
    if (_0xdaff4d?.isFatalAiAuthError) {
      return _0xdaff4d.isFatalAiAuthError(_0x39c236);
    }
    if (!_0x39c236) {
      return false;
    }
    const _0x153a58 = String(_0x39c236);
    return _0x153a58.includes("额度已用完") || _0x153a58.includes("已用完") || _0x153a58.includes("卡密已过期") || _0x153a58.includes("授权码无效") || _0x153a58.includes("设备已被封") || _0x153a58.includes("余额不足") || _0x153a58.includes("未授权");
  }
  function _0x2fbda9(_0x4c383b, _0x2e8f4a = 120) {
    const _0x298f78 = _0x13b88b();
    if (_0x298f78?.clipTraceText) {
      return _0x298f78.clipTraceText(_0x4c383b, _0x2e8f4a);
    }
    const _0x44bad1 = String(_0x4c383b || "").trim();
    if (!_0x44bad1) {
      return "";
    }
    if (_0x44bad1.length > _0x2e8f4a) {
      return _0x44bad1.slice(0, _0x2e8f4a) + "…";
    } else {
      return _0x44bad1;
    }
  }
  function _0x4686eb(_0x47402b, _0x28265a = {}) {
    const _0x51d7be = _0x13b88b();
    if (_0x51d7be?.personalizeDmTemplate) {
      return _0x51d7be.personalizeDmTemplate(_0x47402b, _0x28265a);
    }
    const _0x3cb136 = String(_0x28265a?.nickname || _0x28265a?.name || "朋友").trim() || "朋友";
    return String(_0x47402b || "").replace(/\{nickname\}/g, _0x3cb136);
  }
  let _0x30f8e7;
  function _0x4d9a5b(_0x148113 = _0x3b9fd2.currentTask) {
    const _0x92a81b = _0x148113?.locationFilterRegions;
    if (!_0x92a81b) {
      return [];
    }
    const _0x40f9a3 = Array.isArray(_0x92a81b) ? _0x92a81b : String(_0x92a81b).split(/[,，\s\n]+/);
    return _0x40f9a3.map(_0x33b33e => String(_0x33b33e || "").trim()).filter(Boolean);
  }
  function _0x5b929a(_0x48543f = _0x3b9fd2.currentTask) {
    return _0x4d9a5b(_0x48543f).length > 0;
  }
  function _0x3aef23(_0x4fd76c = _0x3b9fd2.currentTask) {
    const _0x3e5ff7 = _0x4d9a5b(_0x4fd76c);
    if (!_0x3e5ff7.length) {
      return "不限";
    }
    const _0x57762f = _0x4fd76c?.locationFilterMode === "exclude" ? "不包含" : "包含";
    return _0x57762f + "：" + _0x3e5ff7.join("、");
  }
  function _0x259d43(_0x3c6ca2, _0x4683c4 = _0x3b9fd2.currentTask) {
    const _0x16f4bd = _0x4d9a5b(_0x4683c4);
    if (!_0x16f4bd.length) {
      return {
        pass: true
      };
    }
    const _0x4aec0a = _0x2b7132();
    if (_0x4aec0a?.evaluateTaskLocationFilter) {
      return _0x4aec0a.evaluateTaskLocationFilter(_0x3c6ca2, _0x4683c4);
    }
    const _0x17945e = String(_0x3c6ca2?.ipLocation || _0x3c6ca2?.location || "").trim();
    const _0x17a495 = _0x4683c4?.locationFilterMode === "exclude" ? "exclude" : "include";
    if (_0x17a495 === "exclude") {
      if (!_0x17945e || _0x17945e === "未知") {
        return {
          pass: true
        };
      }
      if (_0x16f4bd.some(_0x1026f0 => _0x1026f0 && _0x17945e.includes(_0x1026f0))) {
        return {
          pass: false,
          reason: "地区排除（" + _0x17945e + "）"
        };
      }
      return {
        pass: true
      };
    }
    if (!_0x17945e || _0x17945e === "未知") {
      return {
        pass: false,
        reason: "地区未知"
      };
    }
    if (_0x16f4bd.some(_0x1a2d11 => _0x1a2d11 && _0x17945e.includes(_0x1a2d11))) {
      return {
        pass: true
      };
    }
    return {
      pass: false,
      reason: "地区不符（" + _0x17945e + "）"
    };
  }
  function _0x2b7132() {
    if (_0x30f8e7 !== undefined) {
      return _0x30f8e7;
    }
    const _0x3e307f = (() => {
      try {
        return require("path");
      } catch (_0x4629c5) {
        return null;
      }
    })();
    const _0x203a3d = ["./shared/locationFilter"];
    if (_0x3e307f && typeof _0x370af9 === "string") {
      _0x203a3d.push(_0x3e307f.join(_0x370af9, "shared", "locationFilter"), _0x3e307f.join(_0x370af9, "..", "shared", "locationFilter"));
    }
    for (const _0x8b04e1 of _0x203a3d) {
      try {
        _0x30f8e7 = require(_0x8b04e1);
        console.log("[Built-in-Debug] locationFilter 已加载: " + _0x8b04e1);
        return _0x30f8e7;
      } catch (_0x51981e) {}
    }
    console.warn("[Built-in-Debug] locationFilter 模块未找到，使用内置回退逻辑");
    _0x30f8e7 = null;
    return _0x30f8e7;
  }
  let _0xe00c95;
  function _0x262a76() {
    if (_0xe00c95 !== undefined) {
      return _0xe00c95;
    }
    try {
      _0xe00c95 = require("./shared/localCommentAnalysis");
    } catch (_0x15b081) {
      console.warn("[Built-in-Debug] localCommentAnalysis 加载失败，跳过后端预筛:", _0x15b081.message);
      _0xe00c95 = null;
    }
    return _0xe00c95;
  }
  let _0x2588d2;
  function _0x14a84f() {
    if (_0x2588d2 !== undefined) {
      return _0x2588d2;
    }
    const _0x447cd7 = (() => {
      try {
        return require("path");
      } catch (_0x2cfa8d) {
        return null;
      }
    })();
    const _0x12319c = ["./shared/douyinCommentLike", "./shared/douyinCommentLike.js"];
    if (_0x447cd7 && typeof _0x370af9 === "string") {
      _0x12319c.push(_0x447cd7.join(_0x370af9, "shared", "douyinCommentLike.js"), _0x447cd7.join(_0x370af9, "shared", "douyinCommentLike"), _0x447cd7.join(_0x370af9, "..", "shared", "douyinCommentLike.js"));
    }
    for (const _0x31d4da of _0x12319c) {
      try {
        const _0x3594ad = require(_0x31d4da);
        if (typeof _0x3594ad?.resolveCommentLikeControl === "function") {
          _0x2588d2 = _0x3594ad;
          console.log("[Built-in-Debug] douyinCommentLike 已加载: " + _0x31d4da);
          return _0x2588d2;
        }
      } catch (_0x25ee37) {}
    }
    console.warn("[Built-in-Debug] douyinCommentLike 模块未找到，跳过评论点赞定位");
    _0x2588d2 = null;
    return _0x2588d2;
  }
  function _0x5b4b75(_0xd4e4ec) {
    const _0x43fafc = _0x14a84f();
    if (_0x43fafc?.resolveCommentLikeControl) {
      return _0x43fafc.resolveCommentLikeControl(_0xd4e4ec, {
        isVisibleElement: _0x21b65c,
        getCommentV2String: _0x1fbb3e,
        getCommentV2List: _0x570b08
      });
    }
    return {
      button: null,
      alreadyLiked: false,
      reason: "like_button_not_found",
      score: -1
    };
  }
  function _0xdb1961(_0x4280c1) {
    if (!_0x4280c1) {
      return null;
    }
    const _0xe0164f = _0x14a84f();
    if (_0xe0164f?.snapshotCommentLikeState) {
      return _0xe0164f.snapshotCommentLikeState(_0x4280c1, _0xe0164f.resolveCommentLikePack?.({
        getCommentV2String: _0x1fbb3e,
        getCommentV2List: _0x570b08
      }));
    }
    return {
      liked: false,
      count: null,
      likedClass: false
    };
  }
  function _0x4f4b1e(_0x936474, _0xe55a28) {
    const _0x566386 = _0x14a84f();
    if (_0x566386?.hasCommentLikeTakenEffect) {
      return _0x566386.hasCommentLikeTakenEffect(_0x936474, _0xe55a28);
    }
    return !!_0xe55a28?.liked;
  }
  function _0x470680(_0x76a409) {
    if (!_0x76a409) {
      return "none";
    }
    return "liked=" + (_0x76a409.liked ? 1 : 0) + " count=" + (_0x76a409.count == null ? "-" : _0x76a409.count) + " cls=" + (_0x76a409.likedClass ? 1 : 0);
  }
  function _0x78f795(_0x1db25c) {
    const _0x8712a3 = Array.isArray(_0x1db25c) ? _0x1db25c : [];
    const _0x49f729 = [];
    const _0x5d2f83 = [];
    const _0x427d1b = new Map();
    for (const _0x2e3185 of _0x8712a3) {
      if (_0x2e3185?.excludedCommentKeyword) {
        const _0x29f0f4 = _0x2e3185.aiThought || _0x2e3185.thought || "命中排除评论关键词「" + _0x2e3185.excludedCommentKeyword + "」，直接判定为低意向";
        _0x2e3185.isHighIntention = false;
        _0x2e3185.aiThought = _0x29f0f4;
        _0x2e3185.thought = _0x29f0f4;
        const _0x45bd9b = {
          decision: "ignore",
          replyContent: "",
          aiThought: _0x29f0f4
        };
        _0x427d1b.set(_0x2e3185.leadId, _0x45bd9b);
        _0x49f729.push(_0x2e3185);
      } else {
        _0x5d2f83.push(_0x2e3185);
      }
    }
    const _0x6b1828 = _0x262a76();
    if (!_0x6b1828) {
      return {
        forBackend: _0x5d2f83,
        localDecisions: _0x427d1b,
        localCount: _0x49f729.length,
        localLeads: _0x49f729
      };
    }
    const {
      forBackend: _0x4d7b7d,
      localDecisions: _0x545ed5,
      localCount: _0x2ea30d
    } = _0x6b1828.partitionLeadsForAiAnalysis(_0x5d2f83);
    _0x427d1b.forEach((_0x432c1b, _0x30b0ea) => _0x545ed5.set(_0x30b0ea, _0x432c1b));
    const _0x2f7c01 = [..._0x49f729];
    for (const _0x335c6a of _0x5d2f83) {
      const _0x5f2a97 = _0x545ed5.get(_0x335c6a.leadId);
      if (_0x5f2a97) {
        _0x6b1828.applyLocalAiDecisionToLead(_0x335c6a, _0x5f2a97);
        _0x2f7c01.push(_0x335c6a);
      }
    }
    return {
      forBackend: _0x4d7b7d,
      localDecisions: _0x545ed5,
      localCount: _0x2ea30d + _0x49f729.length,
      localLeads: _0x2f7c01
    };
  }
  function _0x2131d1(_0xdf0f8b = _0x3b9fd2.currentTask?.excludeCommentKeywords) {
    const _0xc5a3b0 = _0x13b88b();
    if (_0xc5a3b0?.parseExcludedCommentKeywords) {
      return _0xc5a3b0.parseExcludedCommentKeywords(_0xdf0f8b);
    }
    return String(_0xdf0f8b || "").split(/[,，\n\r]+/).map(_0x3fa860 => _0x3fa860.trim()).filter(Boolean);
  }
  function _0xf99804(_0x263bbe) {
    const _0x2939e5 = _0x13b88b();
    if (_0x2939e5?.parseTitleKeywordList) {
      return _0x2939e5.parseTitleKeywordList(_0x263bbe);
    }
    return String(_0x263bbe || "").split(/[,，]/).map(_0x5d4da8 => _0x5d4da8.trim()).filter(Boolean);
  }
  function _0x3dab1(_0xe9c99b, _0x237f29 = []) {
    const _0xa6d3a6 = _0x13b88b();
    if (_0xa6d3a6?.matchTitleKeywordList) {
      return _0xa6d3a6.matchTitleKeywordList(_0xe9c99b, _0x237f29);
    }
    const _0x47516e = String(_0xe9c99b || "").toLowerCase();
    if (!_0x47516e || !Array.isArray(_0x237f29) || !_0x237f29.length) {
      return "";
    }
    return _0x237f29.find(_0x2465bc => _0x47516e.includes(String(_0x2465bc).toLowerCase())) || "";
  }
  function _0x3094bb(_0x165456, _0x5f0e65 = _0x3b9fd2.currentTask) {
    return _0x3dab1(_0x165456, _0xf99804(_0x5f0e65?.includeTitleKeywords));
  }
  function _0xd654dc(_0x5eefb7 = _0x3b9fd2.currentTask) {
    return _0xf99804(_0x5eefb7?.includeTitleKeywords).length > 0;
  }
  function _0x3128ba(_0x213fa6, _0x3eb927 = _0x3b9fd2.currentTask) {
    return !!_0x3094bb(_0x213fa6, _0x3eb927);
  }
  function _0x4db715(_0x597ba1 = _0x3b9fd2.currentTask) {
    return !!_0x597ba1?.enableVideoComment && _0x597ba1?.taskMode === "interaction" && _0x597ba1?.videoCommentMode === "ai" && !_0x597ba1?.enableVideoCommentWithoutText && !!_0x483cf8(_0x597ba1);
  }
  function _0x20c3a3(_0xb6be75, _0x10f096 = _0x3b9fd2.currentTask) {
    const _0x419559 = String(_0xb6be75 || "").toLowerCase();
    if (!_0x419559) {
      return "";
    }
    return _0x2131d1(_0x10f096?.excludeCommentKeywords).find(_0x285b45 => _0x419559.includes(_0x285b45.toLowerCase())) || "";
  }
  function _0x498226(_0x4d5c7e = _0x3b9fd2.currentTask) {
    const _0x4ec28f = String(_0x4d5c7e?.platform || window._radar_platform || "").toLowerCase();
    return _0x4ec28f === "douyin" || _0x4ec28f === "dy" || _0x4ec28f.includes("douyin");
  }
  function _0x146b5e(_0xdb227f = _0x3b9fd2.currentTask) {
    const _0x370488 = _0xdb227f?.authInfo || {};
    if (_0x370488 && (_0x370488.isFree !== undefined || _0x370488.isTrial !== undefined)) {
      return _0x370488.isFree === false && _0x370488.isTrial === false;
    }
    if (_0xdb227f && (_0xdb227f.isFree !== undefined || _0xdb227f.isTrial !== undefined)) {
      return _0xdb227f.isFree === false && _0xdb227f.isTrial === false;
    }
    return false;
  }
  function _0x3896de(_0x178447 = _0x3b9fd2.currentTask) {
    return !!_0x498226(_0x178447) && _0x178447?.taskMode === "interaction" && !!_0x2932a8(_0x178447) && !!_0x146b5e(_0x178447);
  }
  function _0x483cf8(_0x5681b9 = _0x3b9fd2.currentTask) {
    return !!_0x5681b9?.aiReplyMode && (!!_0x5681b9?.aiRole || !!_0x5681b9?.aiPrompt || !!_0x5681b9?.aiGoal);
  }
  function _0x310cc3(_0x12c431 = _0x3b9fd2.currentTask) {
    if (_0x12c431?.enablePersonaVideoFilter === false) {
      return false;
    }
    return !!_0x498226(_0x12c431) && !!_0x483cf8(_0x12c431) && !!_0x146b5e(_0x12c431);
  }
  function _0x23e809(_0x258736 = _0x3b9fd2.currentTask) {
    return !!_0x258736?.enableCommentKeywordFilter;
  }
  function _0x2932a8(_0xc36fe5 = _0x3b9fd2.currentTask) {
    if (_0x23e809(_0xc36fe5)) {
      return false;
    }
    return !!_0xc36fe5?.aiReplyMode;
  }
  function _0x2a5122(_0x58ed24 = _0x3b9fd2.currentTask) {
    return !!_0x58ed24?.aiReplyMode;
  }
  async function _0x39e094(_0x3949ef, _0x5d9c36) {
    const _0x265e0a = new Map();
    if (!_0x23e809(_0x3b9fd2.currentTask) || !_0x2a5122(_0x3b9fd2.currentTask)) {
      return _0x265e0a;
    }
    if (!_0x3b9fd2.currentTask?.enableComment) {
      return _0x265e0a;
    }
    if (_0x37e7f5()) {
      _0x140dc2("🤖 关键词+AI回复：已配置纯图片/表情/@，跳过后端回复文案生成");
      return _0x265e0a;
    }
    const _0x1064aa = _0x3949ef.filter(_0x1346bb => _0x1346bb.isHighIntention);
    if (_0x1064aa.length === 0) {
      return _0x265e0a;
    }
    _0x140dc2("🤖 关键词+AI回复：" + _0x1064aa.length + " 条已匹配关键词，批量请求生成回复（跳过意向判定）…");
    for (let _0x4df2d3 = 0; _0x4df2d3 < _0x1064aa.length; _0x4df2d3 += 10) {
      if (_0x4913fc(_0x5d9c36)) {
        break;
      }
      const _0x21b862 = _0x1064aa.slice(_0x4df2d3, _0x4df2d3 + 10);
      const _0x1e18f3 = Math.floor(_0x4df2d3 / 10) + 1;
      const _0x5f27eb = Math.ceil(_0x1064aa.length / 10) || 1;
      _0x140dc2("🤖 关键词回复：第 " + _0x1e18f3 + "/" + _0x5f27eb + " 批，" + _0x21b862.length + " 条…");
      const _0x7c55ba = Date.now();
      const _0x137c72 = await _0x511cd4.invoke("ai-intelligent-analyze-batch", _0x2b9e3f({
        leads: _0x21b862,
        generationMode: "keyword_reply_only",
        config: _0x1645aa(_0x3b9fd2.currentTask)
      }));
      if (_0x4913fc(_0x5d9c36) || _0x4f940c(_0x137c72)) {
        break;
      }
      const _0x3ba1c3 = ((Date.now() - _0x7c55ba) / 1000).toFixed(1);
      if (_0x137c72.success && Array.isArray(_0x137c72.data)) {
        _0x140dc2("🤖 关键词回复：第 " + _0x1e18f3 + " 批完成（耗时 " + _0x3ba1c3 + "s，返回 " + _0x137c72.data.length + " 条）");
        _0x137c72.data.forEach((_0x462cba, _0x2e0540) => {
          const _0x2be091 = _0x21b862[_0x2e0540];
          const _0x170e7e = String(_0x462cba?.replyContent || "").trim();
          if (_0x2be091?.leadId && _0x170e7e) {
            _0x265e0a.set(_0x2be091.leadId, _0x170e7e);
            _0x2be091.actions = _0x2be091.actions || {};
            _0x2be091.actions.replyContent = _0x170e7e;
          }
        });
      } else {
        _0x140dc2("🤖 关键词回复：第 " + _0x1e18f3 + " 批失败（耗时 " + _0x3ba1c3 + "s）：" + _0x2fbda9(_0x137c72?.msg || "未知原因"));
      }
    }
    return _0x265e0a;
  }
  function _0x461d0f(_0x517605 = _0x3b9fd2.currentTask) {
    return !!_0x3896de(_0x517605) && !!_0x517605?.commentOnProfileFirstWork;
  }
  function _0x1645aa(_0x375815 = _0x3b9fd2.currentTask) {
    return {
      aiRole: _0x375815?.aiRole,
      aiGoal: _0x375815?.aiGoal,
      aiStyle: _0x375815?.aiStyle,
      aiPrompt: _0x375815?.aiPrompt,
      videoGoal: _0x375815?.videoGoal,
      videoStyle: _0x375815?.videoStyle,
      videoPrompt: _0x375815?.videoPrompt,
      firstPostGoal: _0x375815?.firstPostGoal,
      firstPostStyle: _0x375815?.firstPostStyle,
      firstPostPrompt: _0x375815?.firstPostPrompt
    };
  }
  function _0x4feeb9(_0x5ca932 = _0x3b9fd2.currentTask) {
    return _0x4db715(_0x5ca932) && _0x310cc3(_0x5ca932);
  }
  async function _0xf44916(_0x33e50c, _0xb0fca9, _0x1a8781) {
    if (!_0x4db715(_0x3b9fd2.currentTask)) {
      return "";
    }
    const _0x5a1fef = Array.isArray(_0xb0fca9) ? _0xb0fca9.filter(Boolean).slice(0, 8) : [];
    _0x140dc2("🤖 视频主评：标题已选中，正在向后端获取文案…");
    try {
      const _0x2eb2d6 = Math.floor(Math.random() * 1500) + 150;
      await _0x224c1b(_0x2eb2d6);
      const _0x2680cd = await _0x511cd4.invoke("ai-generate-video-comment", _0x2b9e3f({
        videoTitle: (_0x33e50c || "").trim() || "未知视频",
        comments: _0x5a1fef,
        generationMode: "main_post_comment",
        config: _0x1645aa(_0x3b9fd2.currentTask)
      }));
      if (_0x4913fc(_0x1a8781) || _0x4f940c(_0x2680cd)) {
        return "";
      }
      const _0x39affa = String(_0x2680cd?.content || "").trim();
      if (_0x2680cd?.success && _0x39affa) {
        _0x140dc2("🤖 视频主评：已获取文案 →「" + _0x2fbda9(_0x39affa, 32) + "」");
        return _0x39affa;
      }
      _0x140dc2("🤖 视频主评：后端未返回文案，发表时将重试");
      return "";
    } catch (_0xf1ad84) {
      console.warn("[Built-in-Debug] [标题选中主评预取] 异常:", _0xf1ad84.message || _0xf1ad84);
      _0x140dc2("🤖 视频主评：预取失败，发表时将重试");
      return "";
    }
  }
  async function _0x436e5a(_0x17ec21, _0x31695e, _0x3050f9, _0x247f84 = {}) {
    if (!_0x310cc3(_0x3b9fd2.currentTask)) {
      const _0x200a1a = _0x3b9fd2.currentTask?.enablePersonaVideoFilter === false ? "已关闭人设视频筛选" : !_0x483cf8(_0x3b9fd2.currentTask) ? "未绑定智能体，视频直接通过" : "未启用 DY 智能预筛";
      return {
        success: true,
        pass: true,
        score: 100,
        reason: _0x200a1a,
        mainPostComment: ""
      };
    }
    try {
      const _0x2106c0 = Array.isArray(_0x31695e) ? _0x31695e.filter(Boolean).slice(0, 10) : [];
      const _0x48df3b = _0x247f84.withMainPost !== undefined ? !!_0x247f84.withMainPost : _0x4feeb9(_0x3b9fd2.currentTask);
      _0x140dc2(_0x48df3b ? "🎯 智能预筛中（顺带生成主评）…" : "🎯 智能预筛中…");
      const _0x227e48 = await _0x511cd4.invoke("ai-match-video-context", _0x2b9e3f({
        videoTitle: _0x17ec21,
        comments: _0x2106c0,
        keywords: _0x3b9fd2.currentTask?.keywords || _0x3b9fd2.currentTask?.intentionKeywords || "",
        authorNickname: _0x3b9fd2.currentTask?.videoAuthor || "",
        matchScene: "leadgen_persona",
        withMainPost: _0x48df3b,
        config: _0x1645aa(_0x3b9fd2.currentTask)
      }));
      if (_0x4913fc(_0x3050f9)) {
        return {
          success: false,
          pass: true,
          reason: "任务已停止，预筛结果忽略",
          mainPostComment: ""
        };
      }
      if (_0x227e48?.pass === false) {
        _0x140dc2("🎯 智能预筛：不匹配，跳过");
        return _0x227e48;
      }
      const _0x1265f5 = String(_0x227e48?.mainPostComment || "").trim();
      if (_0x48df3b && _0x1265f5) {
        _0x140dc2("🎯 智能预筛通过，已生成主评 →「" + _0x2fbda9(_0x1265f5, 32) + "」");
      } else if (_0x48df3b) {
        _0x140dc2("🎯 智能预筛通过（主评将另行生成）");
      } else {
        _0x140dc2("🎯 智能预筛通过");
      }
      return {
        ...(_0x227e48 || {}),
        pass: true,
        mainPostComment: _0x1265f5
      };
    } catch (_0x24e09e) {
      console.warn("[Built-in-Debug] [DY智能预筛] 异常，未放行:", _0x24e09e.message || _0x24e09e);
      _0x140dc2("🎯 智能预筛异常，跳过当前视频");
      return {
        success: false,
        pass: false,
        reason: "视频预筛异常，未确认匹配",
        mainPostComment: ""
      };
    }
  }
  async function _0x289310(_0x1f7063, _0x3a2110, _0x36efa5, _0x1677a1 = _0x3b9fd2.currentTask) {
    if (!_0x461d0f(_0x1677a1)) {
      return {
        success: true,
        pass: true,
        score: 100,
        reason: "未启用 DY 画像判断"
      };
    }
    try {
      _0x334fa9("@" + (_0x1f7063?.nickname || "?") + " 提交画像判断", _0x1f7063?.accountId);
      const _0x113079 = await _0x511cd4.invoke("ai-match-lead-profile", _0x2b9e3f({
        lead: _0x1f7063,
        videoTitle: _0x3a2110 || _0x1f7063?.title || _0x1f7063?.videoTitle || "",
        config: _0x1645aa(_0x1677a1)
      }));
      if (_0x4913fc(_0x36efa5)) {
        return {
          success: false,
          pass: true,
          reason: "任务已停止，画像结果忽略"
        };
      }
      if (_0x113079?.pass === false) {
        _0x334fa9("@" + (_0x1f7063?.nickname || "?") + " 画像不匹配，已跳过（" + _0x2fbda9(_0x113079.reason || "非目标人群", 80) + "）", _0x1f7063?.accountId);
        return _0x113079;
      }
      _0x334fa9("@" + (_0x1f7063?.nickname || "?") + " 画像通过（" + _0x2fbda9(_0x113079?.reason || "匹配目标人群", 80) + "）", _0x1f7063?.accountId);
      return {
        ...(_0x113079 || {}),
        pass: true
      };
    } catch (_0x5c7684) {
      console.warn("[Built-in-Debug] [DY画像判断] 异常，未放行:", _0x5c7684.message || _0x5c7684);
      _0x334fa9("@" + (_0x1f7063?.nickname || "?") + " 画像判断异常，未确认匹配，跳过（" + _0x2fbda9(_0x5c7684.message || _0x5c7684, 80) + "）", _0x1f7063?.accountId);
      return {
        success: false,
        pass: false,
        reason: "画像判断异常，未确认匹配"
      };
    }
  }
  function _0x59ff7f(_0x814cb2) {
    const _0x5993dc = Array.isArray(_0x814cb2?.videoSources) && _0x814cb2.videoSources.length > 0 ? _0x814cb2.videoSources : ["search"];
    const _0x32c34c = String(_0x814cb2?.keywords || "").split(/[,，\s\n]+/).map(_0x4bd1a6 => _0x4bd1a6.trim()).filter(Boolean);
    const _0x3f49a1 = _0x5993dc.find(_0x2bd86b => ["search", "follow", "recommend", "like", "specific"].includes(_0x2bd86b) && (_0x2bd86b !== "search" || _0x32c34c.length > 0)) || (_0x32c34c.length > 0 ? "search" : "recommend");
    if (_0x3f49a1 === "follow") {
      return _0x9deeea();
    }
    if (_0x3f49a1 === "recommend") {
      return _0x3bdfe2();
    }
    if (_0x3f49a1 === "like") {
      return _0x4835b7();
    }
    if (_0x3f49a1 === "specific") {
      const _0x13c758 = String(_0x814cb2?.specifiedUrls || "").split(/[\n,，\s]+/).map(_0xe6b62 => _0xe6b62.trim()).filter(Boolean);
      if (_0x13c758[0]) {
        return _0x13c758[0];
      }
      return _0x3bdfe2();
    }
    if (_0x32c34c[0]) {
      return _0x1f83ec(_0x32c34c[0]);
    }
    return _0x3bdfe2();
  }
  function _0x52184e(_0x28ed6b, _0x503da0) {
    _0x3b9fd2.taskRunning = false;
    _0x3b9fd2.stopRequested = false;
    const _0x44c97b = String(_0x503da0 || "未知原因").trim();
    console.warn("[Built-in-Debug] [任务启动中止] " + _0x44c97b);
    try {
      _0x3f0212(_0x28ed6b, "startup_aborted", {
        detail: _0x44c97b
      }, {
        stopRunning: true
      });
    } catch (_0xe93b55) {}
  }
  let _0x361cf8 = {
    key: "",
    at: 0
  };
  const _0x15a2f2 = 30000;
  let _0x1ae979 = false;
  const _0x2cd67b = /请完成.{0,12}验证|拖动滑块|滑块验证|完成验证|输入验证码|短信验证码|人机验证|图形验证|请按住滑块|向右滑动|请进行验证/;
  const _0x35bceb = /拖动|滑块|按住|向右滑动/;
  const _0xed7c50 = /验证码|短信码|图形码|输入.*码/;
  function _0x1aa046() {
    const _0x6cb59f = [];
    for (const _0x40eac5 of document.querySelectorAll("iframe")) {
      if (!_0x21b65c(_0x40eac5)) {
        continue;
      }
      const _0x3e9a6c = (_0x40eac5.src || _0x40eac5.getAttribute("src") || "").toLowerCase();
      if (/captcha|geetest|verify|sec-verify|nocaptcha|slider|secsdk/.test(_0x3e9a6c)) {
        _0x6cb59f.push({
          kind: "iframe",
          hint: _0x2fbda9(_0x3e9a6c, 80)
        });
      }
    }
    for (const _0x396f9d of document.querySelectorAll("input, textarea")) {
      if (!_0x21b65c(_0x396f9d)) {
        continue;
      }
      const _0x47072a = (_0x396f9d.placeholder || _0x396f9d.getAttribute("aria-label") || "").trim();
      const _0x3c9a35 = ((_0x396f9d.name || "") + " " + (_0x396f9d.id || "")).toLowerCase();
      if (_0xed7c50.test(_0x47072a) || /captcha|verifycode|verify_code/.test(_0x3c9a35)) {
        _0x6cb59f.push({
          kind: "captcha-input",
          hint: _0x2fbda9(_0x47072a || _0x3c9a35, 60)
        });
      }
    }
    const _0x1554b5 = [".geetest_slider_button", ".geetest_slider", ".geetest_panel", ".captcha-slider", ".secsdk-captcha", "[class*=\"captcha\"][class*=\"slider\"]", "[class*=\"verify\"][class*=\"slider\"]"];
    for (const _0x1632ee of _0x1554b5) {
      const _0x1c7195 = document.querySelector(_0x1632ee);
      if (_0x1c7195 && _0x21b65c(_0x1c7195)) {
        _0x6cb59f.push({
          kind: "slider",
          hint: _0x1632ee
        });
        break;
      }
    }
    const _0xf989b = ["[role=\"dialog\"]", "[class*=\"captcha\"]", "[class*=\"Captcha\"]", "[class*=\"verify\"]", "[class*=\"Verify\"]", "[id*=\"captcha\"]", "[id*=\"verify\"]", "[class*=\"geetest\"]"];
    for (const _0x92fdc8 of _0xf989b) {
      for (const _0x3babc0 of document.querySelectorAll(_0x92fdc8)) {
        if (!_0x21b65c(_0x3babc0)) {
          continue;
        }
        const _0x334716 = _0x3babc0.getBoundingClientRect();
        if (_0x334716.width < 120 || _0x334716.height < 60) {
          continue;
        }
        const _0xa62ef8 = (_0x3babc0.innerText || "").replace(/\s+/g, " ").slice(0, 240);
        if (!_0x2cd67b.test(_0xa62ef8)) {
          continue;
        }
        if (_0x35bceb.test(_0xa62ef8)) {
          _0x6cb59f.push({
            kind: "slider",
            hint: _0x2fbda9(_0xa62ef8, 60)
          });
        } else if (_0xed7c50.test(_0xa62ef8)) {
          _0x6cb59f.push({
            kind: "captcha",
            hint: _0x2fbda9(_0xa62ef8, 60)
          });
        } else {
          _0x6cb59f.push({
            kind: "verify",
            hint: _0x2fbda9(_0xa62ef8, 60)
          });
        }
        break;
      }
      if (_0x6cb59f.length) {
        break;
      }
    }
    if (!_0x6cb59f.length) {
      try {
        const _0x347c80 = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const _0x3c1c81 = _0x347c80?.closest?.("[role=\"dialog\"], [class*=\"captcha\"], [class*=\"verify\"], [class*=\"geetest\"]");
        if (_0x3c1c81 && _0x21b65c(_0x3c1c81)) {
          const _0x4a0752 = (_0x3c1c81.innerText || "").replace(/\s+/g, " ").slice(0, 240);
          if (_0x2cd67b.test(_0x4a0752)) {
            const _0x538e09 = _0x35bceb.test(_0x4a0752) ? "slider" : _0xed7c50.test(_0x4a0752) ? "captcha" : "verify";
            _0x6cb59f.push({
              kind: _0x538e09,
              hint: _0x2fbda9(_0x4a0752, 60)
            });
          }
        }
      } catch (_0x27f34a) {}
    }
    if (!_0x6cb59f.length) {
      return null;
    }
    return _0x6cb59f.find(_0x403ed3 => _0x403ed3.kind === "slider") || _0x6cb59f.find(_0x21f108 => _0x21f108.kind === "captcha-input") || _0x6cb59f.find(_0x5cc22f => _0x5cc22f.kind === "captcha") || _0x6cb59f[0];
  }
  function _0x1d59b5() {
    try {
      if (_0x3b9fd2.currentViewKey) {
        _0x511cd4.send("focus-automation-view", {
          viewKey: _0x3b9fd2.currentViewKey,
          bringToFront: true
        });
      }
    } catch (_0x4779d0) {}
  }
  function _0x2709ef(_0x7ead1f) {
    if (_0x3b9fd2.stopRequested) {
      return true;
    }
    if (_0x7ead1f === "BATCH" || _0x7ead1f === "SELF_WARMUP") {
      return !!_0x3b9fd2.stopRequested;
    }
    if (_0x302b34(_0x7ead1f)) {
      return !!_0x3b9fd2.stopRequested;
    }
    if (!_0x3b9fd2.taskRunning) {
      return true;
    }
    if (_0x7ead1f && _0x3b9fd2.activeLoopId && _0x7ead1f !== _0x3b9fd2.activeLoopId) {
      return true;
    }
    return false;
  }
  function _0x4e2859(_0x3a7493 = {}) {
    const {
      force = false,
      waiting = false
    } = _0x3a7493;
    const _0xe794f1 = _0x1aa046();
    const _0x294718 = Date.now();
    if (!_0xe794f1) {
      if (_0x361cf8.key) {
        const _0x215b0f = "✅ 安全验证界面已消失，任务继续执行";
        console.log("[Built-in-Debug] [安全验证]", _0x215b0f);
        _0x140dc2(_0x215b0f);
        _0x361cf8 = {
          key: "",
          at: 0
        };
        try {
          _0x511cd4.send("automation-data", {
            type: "security-challenge-cleared",
            payload: {
              accountId: window._radar_account_id
            }
          });
        } catch (_0x246749) {}
      }
      return false;
    }
    const _0x1ee7d8 = _0xe794f1.kind + ":" + _0xe794f1.hint;
    if (!force && _0x361cf8.key === _0x1ee7d8 && _0x294718 - _0x361cf8.at < _0x15a2f2) {
      return true;
    }
    _0x361cf8 = {
      key: _0x1ee7d8,
      at: _0x294718
    };
    const _0x29454b = {
      slider: "滑块验证",
      captcha: "验证码",
      "captcha-input": "验证码输入",
      iframe: "验证页",
      verify: "安全验证"
    };
    const _0x58a4a2 = _0x29454b[_0xe794f1.kind] || "安全验证";
    const _0x42dd4e = waiting ? "⚠️ 检测到" + _0x58a4a2 + "，任务已暂停，请在本账号窗口手动完成后再继续（" + (_0xe794f1.hint || "请查看页面") + "）" : "⚠️ 检测到" + _0x58a4a2 + "，请在本账号窗口手动完成（" + (_0xe794f1.hint || "请查看页面") + "）";
    console.warn("[Built-in-Debug] [安全验证]", _0xe794f1.kind, _0xe794f1.hint || "");
    _0x140dc2(_0x42dd4e, null, "warn");
    _0x290466(_0x42dd4e);
    try {
      _0x511cd4.send("automation-data", {
        type: "security-challenge",
        payload: {
          accountId: window._radar_account_id,
          kind: _0xe794f1.kind,
          hint: _0xe794f1.hint || "",
          waiting: !!waiting,
          viewKey: _0x3b9fd2.currentViewKey || "",
          message: _0x42dd4e
        }
      });
    } catch (_0x162b45) {}
    return true;
  }
  async function _0x3b5470(_0x360f17) {
    if (!_0x1aa046()) {
      _0x4e2859();
      return false;
    }
    _0x1ae979 = true;
    const _0x58b3e6 = Date.now();
    let _0x5239eb = 0;
    try {
      _0x4e2859({
        force: true,
        waiting: true
      });
      _0x1d59b5();
      _0x140dc2("⏸ 任务已暂停，等待人工完成安全验证后继续", null, "warn");
      _0x290466("⏸ 检测到安全验证，已暂停任务，请在本账号窗口完成验证…");
      while (_0x1aa046()) {
        if (_0x2709ef(_0x360f17)) {
          throw new Error("TASK_ABORTED");
        }
        const _0x3bbb4a = Date.now();
        if (_0x3bbb4a - _0x5239eb >= _0x15a2f2) {
          _0x5239eb = _0x3bbb4a;
          const _0x55fbd3 = Math.floor((_0x3bbb4a - _0x58b3e6) / 1000);
          _0x4e2859({
            force: true,
            waiting: true
          });
          _0x1d59b5();
          _0x290466("⏸ 仍在等待安全验证（已 " + _0x55fbd3 + " 秒），请完成后再继续…");
          _0x140dc2("⏸ 仍在等待安全验证（已 " + _0x55fbd3 + " 秒）", null, "warn");
        }
        await _0x224c1b(1000);
      }
      _0x4e2859();
      _0x290466("✅ 安全验证已完成，继续执行任务");
      _0x140dc2("✅ 安全验证已完成，继续执行任务", null, "info");
      return true;
    } finally {
      _0x1ae979 = false;
    }
  }
  async function _0x2cac46() {
    try {
      const _0x4d8635 = Array.from(document.querySelectorAll("button, [role=\"button\"], a, div, span, [class*=\"login\"], [class*=\"Login\"], [class*=\"btn\"], [class*=\"Btn\"]")).filter(_0x245e73 => _0x21b65c(_0x245e73));
      for (const _0x1fce9f of _0x4d8635) {
        const _0xb77921 = String(_0x1fce9f.innerText || _0x1fce9f.textContent || "").trim().replace(/\s+/g, "");
        if (!_0xb77921 || _0xb77921.length > 24) {
          continue;
        }
        const _0x287ff4 = /^(一键登录|快捷登录|同意并登录|手机号一键登录|授权登录|本机号码一键登录|微信一键登录|QQ一键登录)$/.test(_0xb77921) || _0xb77921.length <= 16 && /一键登录|快捷登录|同意并登录|手机号.*登录|授权登录/.test(_0xb77921);
        if (_0x287ff4) {
          console.log("[Built-in-Debug] [一键登录] 发现一键登录/授权按钮，自动点击:", _0xb77921);
          _0x140dc2("🔓 检测到「" + _0xb77921 + "」弹窗按钮，已自动点击登录…");
          _0x290466("🔓 自动点击「" + _0xb77921 + "」…");
          await _0x1060de(_0x1fce9f, null);
          await _0x224c1b(1200);
          return true;
        }
      }
    } catch (_0x358117) {}
    return false;
  }
  async function _0x5ec3ed(_0x2d8ee2 = "") {
    _0x290466("搜索页提示需要登录，正在尝试一键登录…");
    _0x140dc2("🔓 搜索页登录墙：尝试自动点击「一键登录」…", null, "warning");
    let _0x3f3e3a = false;
    const _0x50a589 = Date.now() + 12000;
    while (Date.now() < _0x50a589 && !_0x4913fc(_0x2d8ee2)) {
      if (_0x1aa046()) {
        await _0x3b5470(_0x2d8ee2);
        break;
      }
      if (await _0x2cac46()) {
        _0x3f3e3a = true;
        break;
      }
      await _0x224c1b(800);
    }
    if (_0x3f3e3a) {
      _0x290466("已点击一键登录，等待搜索结果刷新…");
      await _0x1ebf90(2500, 4500, _0x2d8ee2, "一键登录后等待搜索页");
      return true;
    }
    _0x290466("搜索页提示需要登录，等待登录完成后继续扫描...");
    await _0x1ebf90(5000, 8000, _0x2d8ee2, "等待搜索页登录");
    try {
      await _0x2cac46();
    } catch (_0x4cf159) {}
    return false;
  }
  async function _0x268adb(_0x530732 = "") {
    if (_0x1aa046()) {
      await _0x3b5470(_0x530732);
      return true;
    }
    const _0x5e1dc = await _0x2cac46();
    if (_0x5e1dc) {
      return true;
    }
    try {
      await _0x50140c(_0x530732);
    } catch (_0x203afe) {}
    return false;
  }
  function _0x20578e() {
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      } else {
        const _0x181ea9 = _0x283cd6(window._radar_account_id, _0x3b9fd2.activeLoopId);
        const _0x1093e1 = _0x1a2ccc(window._radar_account_id, _0x3b9fd2.activeLoopId);
        if (_0x1093e1.loopId === _0x3b9fd2.activeLoopId) {
          _0x1093e1.sessionInteractionCount = _0x3b9fd2.sessionInteractionCount;
          _0x1093e1.followCount = _0x3b9fd2.sessionFollowCount;
          _0x1093e1.dmCount = _0x3b9fd2.sessionDmCount;
          _0x35f377.setItem(_0x181ea9, JSON.stringify(_0x1093e1));
        }
      }
    } catch (_0x512028) {}
  }
  function _0x5b1d44(_0x57fd66 = 1) {
    _0x3b9fd2.sessionInteractionCount += _0x57fd66;
    _0x20578e();
    const _0xde669 = _0x3b9fd2.sessionInteractionLimit === Infinity ? "∞" : _0x3b9fd2.sessionInteractionLimit;
    _0x140dc2("📊 互动总次数已更新：" + _0x3b9fd2.sessionInteractionCount + "/" + _0xde669);
    try {
      _0x511cd4.send("automation-data", {
        type: "interaction-total-progress",
        payload: {
          accountId: window._radar_account_id,
          current: _0x3b9fd2.sessionInteractionCount,
          limit: _0x3b9fd2.sessionInteractionLimit
        }
      });
    } catch (_0x310edf) {}
  }
  function _0x59e979() {
    return _0x3b9fd2.sessionInteractionLimit !== Infinity && _0x3b9fd2.sessionInteractionCount >= _0x3b9fd2.sessionInteractionLimit;
  }
  function _0x46fa9d(_0x4fbb30 = _0x3b9fd2.currentTask) {
    const _0x4fbab4 = _0x4fbb30?.replyTemplates || (_0x4fbb30?.commentContent ? _0x4fbb30.commentContent.split("\n").filter(_0x10b8ec => _0x10b8ec.trim()) : []);
    return _0x4fbab4.length > 0;
  }
  function _0x17bd86(_0x5492af = _0x3b9fd2.currentTask) {
    return String(_0x5492af?.videoCommentContent || "").split("\n").some(_0x36c4f3 => _0x36c4f3.trim());
  }
  function _0x37e7f5(_0x2d707a = _0x3b9fd2.currentTask) {
    if (_0x2d707a?.enableCommentWithoutText) {
      return true;
    }
    if (_0x2a5122(_0x2d707a) || _0x4938d4(_0x2d707a)) {
      return false;
    }
    return _0x55a0db(false) && !_0x46fa9d(_0x2d707a);
  }
  function _0xa83238(_0x2ed324 = _0x3b9fd2.currentTask) {
    if (_0x2ed324?.enableVideoCommentWithoutText) {
      return true;
    }
    return _0x55a0db(true) && !_0x17bd86(_0x2ed324);
  }
  return {
    abortAutomationStartup: _0x52184e,
    awaitSearchPageLoginGate: _0x5ec3ed,
    awaitSecurityChallengeIfPresent: _0x3b5470,
    buildAutomationAiPayload: _0x2b9e3f,
    buildMainCommentAbortResult: _0x57afe6,
    checkAndClickOneClickLogin: _0x2cac46,
    clipTraceText: _0x2fbda9,
    describeCommentLikeState: _0x470680,
    describeMainCommentInputEnvironment: _0x31c9cd,
    describeTaskAbortReason: _0x3cf170,
    detectPageSecurityChallenge: _0x1aa046,
    evaluateLeadLocationFilter: _0x259d43,
    formatTaskLocationFilterSummary: _0x3aef23,
    getAutomationTextHelpersModule: _0x13b88b,
    getCommentPlaceholderText: _0x129413,
    getIncludeTitleKeywordMatch: _0x3094bb,
    getLocationFilterModule: _0x2b7132,
    handleGlobalAutomationPopupsAndSecurity: _0x268adb,
    hasCommentLikeTakenEffect: _0x4f4b1e,
    hasLocalReplyTemplates: _0x46fa9d,
    hasVideoCommentTemplates: _0x17bd86,
    incrementInteractionCount: _0x5b1d44,
    isDouyinProfileTargetingEnabled: _0x461d0f,
    isFatalAiAuthError: _0x34f96f,
    isInteractionLimitReached: _0x59e979,
    isMainCommentPlaceholderCandidate: _0x4b0572,
    matchCurrentVideoForDy: _0x436e5a,
    matchExcludedCommentKeyword: _0x20c3a3,
    matchLeadProfileForDy: _0x289310,
    matchTitleKeywordList: _0x3dab1,
    parseTitleKeywordList: _0xf99804,
    persistSessionInteractionCount: _0x20578e,
    personalizeDmTemplate: _0x4686eb,
    prefetchAiMainPostComment: _0xf44916,
    prefetchKeywordReplyContents: _0x39e094,
    prepareLeadsForAiAnalysis: _0x78f795,
    reportCommentFlowTrace: _0x31dea9,
    reportCurrentAction: _0x290466,
    reportProfileFirstTrace: _0x334fa9,
    reportTraceLog: _0x140dc2,
    resolveCommentLikeControlInNode: _0x5b4b75,
    resolveTaskEntryUrl: _0x59ff7f,
    resolveTaskLocationFilterRegions: _0x4d9a5b,
    scoreMainCommentPlaceholderCandidate: _0x34336e,
    shouldEnforceIncludeTitleKeywords: _0xd654dc,
    shouldForceSelectByIncludeTitle: _0x3128ba,
    shouldGenerateAiVideoMainPost: _0x4db715,
    shouldPrefetchMainPostWithVideoMatch: _0x4feeb9,
    shouldUseAiCommentAnalysis: _0x2932a8,
    shouldUseAiReplyGeneration: _0x2a5122,
    shouldUseCommentKeywordFilter: _0x23e809,
    shouldUsePersonaVideoFilter: _0x310cc3,
    shouldUseTextlessReplyPayload: _0x37e7f5,
    shouldUseTextlessVideoCommentPayload: _0xa83238,
    snapshotCommentLikeControlState: _0xdb1961,
    taskLocationFilterEnabled: _0x5b929a
  };
}
module.exports = {
  createAutomationRuntimeController: createAutomationRuntimeController
};
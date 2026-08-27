'use strict';

const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction,
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createProfileInteractionController(_0x4c8690 = {}) {
  const {
    PLATFORM_SELECTORS: _0x50d6b9,
    _normalizeTouchLogEntries: _0x5ef1e1,
    applyEntryMetaToLead: _0x4c2b1b,
    applySubviewRuntimeTask: _0x480305,
    clearPendingSubviewTask: _0x4c16e2,
    clipTraceText: _0x1e43ea,
    detectMonitorPrivateProfile: _0x485b90,
    emitLeadInteractionUpdate: _0x3955ba,
    emitSubviewActionCheckpoint: _0x5bc11c,
    findProfileVideoCards: _0x120eff,
    findSmartElement: _0x5ec01e,
    getAutomationTextHelpersModule: _0x2e44c2,
    getGatedTextPack: _0x1bd81e,
    getGatedVariantList: _0x40c1a2,
    getGatedString: _0x23b2e4,
    getVideoEngagePack: _0xc6fb9b,
    getProfilePostListRoot: _0x47e0fa,
    getVideoIdFromPageUrl: _0x487d0e,
    hasDmRuntimeReady: _0x19d595,
    hasProfileActionRuntimeReady: _0x3b7953,
    hasRemoteGatedConfig: _0x3b868b,
    ipcRenderer: _0x1a22a7,
    isDouyinProfileTargetingEnabled: _0x3ddab0,
    isProfileFirstCommentAiMode: _0x1e66c4,
    isProfileFirstWorkCommentDone: _0x4daafd,
    isVisibleElement: _0x503f79,
    localStorage: _0x40c2d1,
    markBatchProfileCommentDone: _0x9ecf63,
    markSubviewInteractionCancelled: _0x374584,
    matchLeadProfileForDy: _0x237526,
    mergeProfileInfoToLead: _0xa99d5c,
    normalizeProfileUrlForReturn: _0x5c2671,
    normalizeUserUrl: _0x210e83,
    parseProfileWorksCount: _0x573709,
    performProfileActions: _0x2cb79a,
    performProfileFirstWorkComment: _0xb8b00d,
    performVideoMonitorFollow: _0x16abc7,
    persistScrapedLeadProfile: _0x1cfa8a,
    persistSubviewTaskForResume: _0x20af8b,
    personalizeDmTemplate: _0x5db96d,
    pickReusableProfileDetail: _0x5b10d3,
    profileHasNoPublicWorks: _0x8aef63,
    randomDelay: _0xad73ac,
    recordLeadTouch: _0x4b1a04,
    reportCurrentAction: _0x31951d,
    reportProfileFirstTrace: _0x532ba2,
    reportTraceLog: _0x350801,
    restoreProfileAfterWarmup: _0x2424a8,
    safeSessionSet: _0xe87fea,
    sendDmOnCurrentProfile: _0x7eeb78,
    settleFollowUpFromExistingActions: _0x476d18,
    shouldAbort: _0x1b8f97,
    simulateHumanClick: _0x2e0904,
    simulateTrustedElementClick: _0x9922d7,
    simulateTrustedKey: _0x1d4135,
    sleep: _0x37707b,
    waitForProfileWorksReady: _0x3bc2e8,
    wasBatchProfileCommentDone: _0x8648a5,
    withBackgroundAutomationLayout: _0x37c163,
    preloadDir: _0xc1ae48,
    state: _0x2c7585
  } = _0x4c8690;
  const _0x22d6d9 = _0xc1ae48;
  function _0x26e367(_0xc14776) {
    return {
      canFollow: !!_0x2c7585.currentTask?.enableFollow && !!(_0xc14776?.follows > 0) && !!(_0x2c7585.sessionFollowCount < _0x2c7585.sessionFollowLimit),
      canDM: !!_0x2c7585.currentTask?.enableDM && !!(_0xc14776?.dms > 0) && !!(_0x2c7585.sessionDmCount < _0x2c7585.sessionDmLimit)
    };
  }
  async function _0x50ffba(_0x35e7c9, _0x411043, _0x3e97b0, _0x3e4fb5, _0x348907) {
    const _0x1d7ad7 = _0x2c7585.currentTask.enableFollow && _0x3e4fb5.follows > 0 && _0x2c7585.sessionFollowCount < _0x2c7585.sessionFollowLimit;
    const _0x415dbb = _0x2c7585.currentTask.enableDM && _0x3e4fb5.dms > 0 && _0x2c7585.sessionDmCount < _0x2c7585.sessionDmLimit;
    if (_0x411043.actions?.followed || _0x411043.actions?.messaged) {
      return _0x476d18(_0x411043, _0x3e4fb5, _0x348907);
    }
    if (!_0x1d7ad7 && !_0x415dbb) {
      return false;
    }
    if (_0x411043.actions?.profileWorkCommented) {
      _0x350801("↪ @" + _0x411043.nickname + "：首作评论已完成，补开主页执行" + (_0x1d7ad7 && _0x415dbb ? "关注+私信" : _0x1d7ad7 ? "关注" : "私信") + "…");
    }
    const _0x503378 = await _0x2cb79a(_0x35e7c9, _0x411043, _0x3e97b0, _0x1d7ad7, _0x415dbb);
    if (_0x503378?.isPrivate || _0x503378?.skipReason && String(_0x503378.skipReason).includes("私密账号")) {
      const _0x1b8455 = _0x503378.skipReason || "对方账号设置了隐私，未执行关注/私信";
      _0xa99d5c(_0x411043, _0x503378);
      _0x411043.isPrivate = true;
      _0x350801("🔒 @" + _0x411043.nickname + "：" + _0x1b8455, _0x411043.accountId, "warning");
      _0x3955ba(_0x411043, {
        actionSkipReason: _0x1b8455,
        isPrivate: true,
        interactionResolved: true
      });
      _0x348907();
      return false;
    }
    if (!_0x503378 || !_0x503378.followed && !_0x503378.messaged) {
      if (_0x503378?.skipReason) {
        _0x350801("⏭ @" + _0x411043.nickname + "：" + _0x503378.skipReason, _0x411043.accountId, "warning");
        _0x3955ba(_0x411043, {
          actionSkipReason: _0x503378.skipReason,
          interactionResolved: true
        });
      }
      return false;
    }
    _0x411043.actions = _0x411043.actions || {};
    if (_0x503378.followed) {
      _0x411043.actions.followed = true;
    }
    if (_0x503378.messaged) {
      _0x411043.actions.messaged = true;
      _0x411043.actions.dmSkipped = !!_0x503378.dmSkipped;
      if (_0x503378.dmContent) {
        _0x411043.actions.dmContent = _0x503378.dmContent;
      }
    }
    const _0x2864f7 = _0x476d18(_0x411043, _0x3e4fb5, _0x348907);
    _0xa99d5c(_0x411043, _0x503378);
    return _0x2864f7;
  }
  function _0x154882(_0xf708d3) {
    const _0x4608f0 = (_0xf708d3 || "").split(", ");
    for (const _0x525c48 of _0x4608f0) {
      if (!_0x525c48 || _0x525c48.includes(":contains") || _0x525c48.includes(":has-text")) {
        continue;
      }
      try {
        const _0xc5a551 = Array.from(document.querySelectorAll(_0x525c48)).find(_0x503f79);
        if (_0xc5a551) {
          return _0xc5a551;
        }
      } catch (_0x5bdfe7) {}
    }
    return null;
  }
  function _0x3326e2(_0x2bd3b7, _0x37a190 = "douyin.com") {
    if (["profileFollowBtn", "profileMessageBtn"].includes(_0x2bd3b7) && (typeof _0x3b7953 !== "function" || !_0x3b7953())) {
      return null;
    }
    if (["dmInput", "dmSendBtn"].includes(_0x2bd3b7) && (typeof _0x19d595 !== "function" || !_0x19d595())) {
      return null;
    }
    if (!_0x3b868b()) {
      console.warn("[Security-Preload] config not ready, reject findSmartElementQuiet for: " + _0x2bd3b7);
      return null;
    }
    if (_0x2bd3b7 === "profileFollowBtn") {
      const _0x2ec486 = _0x382d10(false);
      if (_0x2ec486) {
        return _0x2ec486;
      }
    }
    if (_0x2bd3b7 === "profileMessageBtn") {
      const _0x4e4b0d = _0x11c55e(false);
      if (_0x4e4b0d) {
        return _0x4e4b0d;
      }
    }
    const _0x451688 = _0x50d6b9[_0x37a190] || {};
    const _0x4e0440 = _0x154882(_0x451688[_0x2bd3b7]);
    if (_0x4e0440) {
      return _0x4e0440;
    }
    const _0x41081e = _0x2bd3b7.toLowerCase();
    if (_0x41081e === "dminput") {
      return null;
    }
    let _0x2bb9d2 = [];
    if (_0x41081e.includes("follow")) {
      _0x2bb9d2 = _0x40c1a2("followVariants");
    } else if (_0x41081e.includes("message")) {
      _0x2bb9d2 = _0x40c1a2("messageVariants");
    } else if (_0x41081e.includes("send")) {
      _0x2bb9d2 = _0x1bd81e("dmSend").exactTexts;
    }
    if (!_0x2bb9d2.length && (_0x41081e.includes("follow") || _0x41081e.includes("message") || _0x41081e.includes("send"))) {
      if (!_0x3b868b()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] gated 文案未就绪，跳过按钮文本匹配");
      }
      return null;
    }
    if (_0x2bb9d2.length === 0) {
      return null;
    }
    const _0xd2a530 = _0x23b2e4("actionButtonCandidates");
    if (!_0xd2a530) {
      return null;
    }
    let _0x2d843e = [];
    try {
      _0x2d843e = Array.from(document.querySelectorAll(_0xd2a530));
    } catch (_0x46397d) {
      return null;
    }
    return _0x2d843e.find(_0x487a96 => {
      const _0x5b4f1a = (_0x487a96.innerText || _0x487a96.textContent || "").trim();
      return _0x503f79(_0x487a96) && _0x2bb9d2.some(_0x48f479 => _0x5b4f1a.includes(_0x48f479));
    }) || null;
  }
  function _0x41aac8(_0x519d98) {
    return (_0x519d98?.innerText || _0x519d98?.textContent || "").replace(/\s+/g, "").trim();
  }
  function _0x2a44b9(_0x3ebbf2) {
    if (!_0x3ebbf2) {
      return null;
    }
    const _0x3f5e31 = _0x23b2e4("actionClickableRoot");
    if (!_0x3f5e31) {
      return null;
    }
    try {
      return _0x3ebbf2.closest?.(_0x3f5e31) || null;
    } catch (_0x395e38) {
      return null;
    }
  }
  function _0x31a7b6(_0x7b74b5) {
    const _0x22f411 = _0x7b74b5?.className || "";
    if (typeof _0x22f411 === "string") {
      return _0x22f411;
    } else {
      return String(_0x22f411?.baseVal || _0x22f411 || "");
    }
  }
  function _0x2d0f0e(_0x41f8e0, _0x37ae36 = 5) {
    const _0xaddb55 = [];
    let _0x25de34 = _0x41f8e0;
    for (let _0x9ec8d9 = 0; _0x9ec8d9 < _0x37ae36 && _0x25de34 && _0x25de34 !== document.body; _0x9ec8d9++) {
      _0xaddb55.push(_0x25de34.getAttribute?.("data-e2e") || "");
      _0xaddb55.push(_0x31a7b6(_0x25de34));
      const _0x10696a = (_0x25de34.innerText || _0x25de34.textContent || "").replace(/\s+/g, " ").trim();
      if (_0x10696a && _0x10696a.length < 500) {
        _0xaddb55.push(_0x10696a);
      }
      _0x25de34 = _0x25de34.parentElement;
    }
    return _0xaddb55.join(" ");
  }
  function _0x22171e(_0x320d3f = {}) {
    const {
      exactTexts = [],
      preferredTexts = [],
      logPrefix = "主页动作按钮",
      verbose = true,
      minScore = 150
    } = _0x320d3f;
    const _0x343302 = _0x154882(_0x50d6b9["douyin.com"]?.profileName || "");
    const _0x9e4d6e = _0x343302?.getBoundingClientRect?.() || null;
    const _0x5811f2 = _0x41aac8({
      innerText: _0x2c7585.currentTask?.lead?.nickname || _0x2c7585.currentTask?.nickname || ""
    });
    const _0xdf419e = window.innerHeight || 900;
    const _0x38f09a = new Set();
    const _0xfed115 = [];
    const _0x3dbd92 = _0x23b2e4("actionButtonCandidates");
    if (!_0x3dbd92) {
      return null;
    }
    let _0x420198 = [];
    try {
      _0x420198 = Array.from(document.querySelectorAll(_0x3dbd92));
    } catch (_0x365094) {
      return null;
    }
    const _0x148b84 = (_0x408f0f, _0x229ee8) => {
      const _0x5f018c = _0x23b2e4(_0x408f0f);
      if (!_0x5f018c) {
        return false;
      }
      try {
        return new RegExp(_0x5f018c).test(String(_0x229ee8 || ""));
      } catch (_0x4b202a) {
        return false;
      }
    };
    const _0x1054fe = _0x23b2e4("profileRejectOverlaySelector");
    const _0x9f9db1 = _0x23b2e4("profileRejectNoticeSelector");
    for (const _0x473861 of _0x420198) {
      const _0x2fecc9 = _0x2a44b9(_0x473861);
      if (!_0x2fecc9 || _0x38f09a.has(_0x2fecc9) || !_0x503f79(_0x2fecc9)) {
        continue;
      }
      _0x38f09a.add(_0x2fecc9);
      const _0x1257c0 = _0x41aac8(_0x473861);
      const _0x4c05e1 = _0x41aac8(_0x2fecc9);
      const _0x2651da = exactTexts.includes(_0x1257c0) ? _0x1257c0 : _0x4c05e1;
      if (!exactTexts.includes(_0x2651da)) {
        continue;
      }
      if (_0x2fecc9.getAttribute?.("aria-disabled") === "true" || _0x2fecc9.disabled) {
        continue;
      }
      const _0x3e091a = _0x2fecc9.getBoundingClientRect();
      const _0x3d67f7 = _0x31a7b6(_0x2fecc9);
      const _0x5b8a71 = _0x2d0f0e(_0x2fecc9);
      const _0x4b84b1 = _0x5b8a71.replace(/\s+/g, "");
      const _0x9b7abc = _0x3e091a.top + _0x3e091a.height / 2;
      let _0x18ca59 = 100;
      if (preferredTexts.includes(_0x2651da)) {
        _0x18ca59 += 40;
      }
      if (_0x2fecc9.tagName === "BUTTON") {
        _0x18ca59 += 25;
      }
      if (_0x3d67f7.includes("semi-button")) {
        _0x18ca59 += 15;
      }
      if (_0x3e091a.top < _0xdf419e * 0.28) {
        _0x18ca59 += 35;
      } else if (_0x3e091a.top < _0xdf419e * 0.45) {
        _0x18ca59 += 15;
      } else {
        _0x18ca59 -= 35;
      }
      if (_0x3e091a.width >= 44 && _0x3e091a.height >= 26) {
        _0x18ca59 += 10;
      } else {
        _0x18ca59 -= 20;
      }
      if (_0x9e4d6e) {
        const _0x38e70f = _0x9e4d6e.top + _0x9e4d6e.height / 2;
        const _0x32ea73 = Math.abs(_0x9b7abc - _0x38e70f);
        if (_0x32ea73 < 120) {
          _0x18ca59 += 90;
        } else if (_0x32ea73 < 240) {
          _0x18ca59 += 45;
        } else if (_0x32ea73 > 420) {
          _0x18ca59 -= 70;
        }
        if (_0x3e091a.top < _0x9e4d6e.top - 100) {
          _0x18ca59 -= 25;
        }
        if (_0x3e091a.top > _0x9e4d6e.bottom + 320) {
          _0x18ca59 -= 45;
        }
      }
      if (_0x5811f2 && _0x4b84b1.includes(_0x5811f2)) {
        _0x18ca59 += 80;
      }
      if (_0x148b84("profilePositiveContextPattern", _0x5b8a71)) {
        _0x18ca59 += 35;
      }
      if (_0x148b84("profileRejectContextPattern", _0x5b8a71)) {
        _0x18ca59 -= 55;
      }
      if (_0x1054fe && _0x2fecc9.closest?.(_0x1054fe)) {
        _0x18ca59 -= 70;
      }
      if (_0x9f9db1 && _0x2fecc9.closest?.(_0x9f9db1)) {
        _0x18ca59 -= 120;
      }
      _0xfed115.push({
        root: _0x2fecc9,
        text: _0x2651da,
        score: _0x18ca59,
        rect: _0x3e091a,
        contextText: _0x5b8a71
      });
    }
    _0xfed115.sort((_0x59024d, _0xc31161) => _0xc31161.score - _0x59024d.score || _0x59024d.rect.top - _0xc31161.rect.top || _0xc31161.rect.width - _0x59024d.rect.width);
    if (_0xfed115[0]) {
      if (verbose) {
        _0xfed115.slice(0, 5).forEach((_0x48ccda, _0x33236d) => {
          console.log("[Built-in-Debug] [" + logPrefix + "候选 " + (_0x33236d + 1) + "] score=" + Math.round(_0x48ccda.score) + ", Text=\"" + _0x48ccda.text + "\", Tag=" + _0x48ccda.root.tagName + ", Rect=" + Math.round(_0x48ccda.rect.width) + "x" + Math.round(_0x48ccda.rect.height) + "@(" + Math.round(_0x48ccda.rect.left) + "," + Math.round(_0x48ccda.rect.top) + "), Class=\"" + _0x1e43ea(_0x31a7b6(_0x48ccda.root), 50) + "\", Hint=\"" + _0x1e43ea(_0x48ccda.contextText, 80) + "\"");
        });
      }
      if (_0xfed115[0].score < minScore) {
        if (verbose) {
          console.warn("[Built-in-Debug] [" + logPrefix + "精确识别] 候选分数过低(" + Math.round(_0xfed115[0].score) + ")，疑似非主页头部按钮，跳过");
        }
        return null;
      }
      if (verbose) {
        console.log("[Built-in-Debug] [" + logPrefix + "精确命中] score=" + Math.round(_0xfed115[0].score) + ", Text=\"" + _0xfed115[0].text + "\", Tag=" + _0xfed115[0].root.tagName + ", Class=\"" + _0x31a7b6(_0xfed115[0].root) + "\"");
      }
      return _0xfed115[0].root;
    }
    return null;
  }
  function _0x11c55e(_0x1dc16a = true) {
    if (typeof _0x3b7953 !== "function" || !_0x3b7953()) {
      return null;
    }
    const _0x547553 = _0x1bd81e("profileMessage");
    if (!_0x547553.exactTexts.length) {
      if (_0x1dc16a) {
        console.warn("[Built-in-Debug] [RuntimeConfig] profileMessage 文案未下发，无法定位私信按钮");
      }
      return null;
    }
    return _0x22171e({
      exactTexts: _0x547553.exactTexts,
      preferredTexts: _0x547553.preferredTexts,
      logPrefix: "私信按钮",
      verbose: _0x1dc16a,
      minScore: 150
    });
  }
  function _0x382d10(_0x51cd0a = true) {
    if (typeof _0x3b7953 !== "function" || !_0x3b7953()) {
      return null;
    }
    const _0x42595a = _0x1bd81e("profileFollow");
    if (!_0x42595a.exactTexts.length) {
      if (_0x51cd0a) {
        console.warn("[Built-in-Debug] [RuntimeConfig] profileFollow 文案未下发，无法定位关注按钮");
      }
      return null;
    }
    return _0x22171e({
      exactTexts: _0x42595a.exactTexts,
      preferredTexts: _0x42595a.preferredTexts,
      logPrefix: "关注按钮",
      verbose: _0x51cd0a,
      minScore: 145
    });
  }
  function _0x4380ce(_0x238c9f) {
    const _0x201faf = _0x50d6b9["douyin.com"];
    const _0x1d9a31 = document.body;
    const _0x125e11 = (_0x1d9a31?.innerText || _0x1d9a31?.textContent || "").trim();
    const _0x12e0dc = (() => {
      const _0x504ae3 = typeof _0x23b2e4 === "function" ? _0x23b2e4("profileReadyPattern") : "";
      if (!_0x504ae3) {
        return false;
      }
      try {
        return new RegExp(_0x504ae3).test(_0x125e11);
      } catch (_0x52e6ba) {
        return false;
      }
    })();
    const _0x3f1986 = _0x238c9f.canFollow && _0x3326e2("profileFollowBtn") || _0x238c9f.canDM && _0x3326e2("profileMessageBtn");
    const _0x4250b7 = _0x154882(_0x201faf.profileName);
    let _0x29920e = "";
    if (_0x4250b7) {
      _0x29920e = "profile_name";
    } else if (_0x3f1986) {
      _0x29920e = "profile_action";
    } else if (_0x125e11.length > 30 && _0x12e0dc) {
      _0x29920e = "profile_text";
    }
    let _0x16db35 = null;
    let _0x521453 = false;
    let _0x34a08b = false;
    if (!_0x29920e && _0x238c9f?.canCommentFirstWork) {
      try {
        const _0x53e672 = _0x47e0fa();
        const _0x2b82cd = _0x53e672?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]");
        _0x521453 = !!_0x2b82cd && !!_0x503f79(_0x2b82cd);
        if (!_0x521453) {
          _0x16db35 = _0x573709();
        }
        _0x34a08b = _0x16db35 === 0 || /暂无作品|还没有发布作品|还没有发布过|暂未发布作品|Ta还没有发布|TA还没有发布|该用户还未发布|暂无内容/.test(_0x125e11.slice(0, 8000));
      } catch (_0x2c955b) {}
    }
    if (!_0x29920e && _0x521453) {
      _0x29920e = "works_grid";
    } else if (_0x16db35 !== null) {
      _0x29920e = "works_count_" + _0x16db35;
    } else if (_0x34a08b) {
      _0x29920e = "works_empty";
    }
    return {
      ready: !!_0x29920e,
      reason: _0x29920e || "none",
      bodyChars: _0x125e11.length,
      worksCount: _0x16db35,
      hasWorkCard: _0x521453,
      noWorks: _0x34a08b,
      documentReadyState: document.readyState || "unknown"
    };
  }
  function _0x338205(_0x36717a) {
    return _0x4380ce(_0x36717a).ready;
  }
  async function _0x4e5e47(_0x3fd037, _0x1beb15, _0x49d04f = 60000) {
    const _0x5a5789 = Date.now();
    let _0x47a3ed = 0;
    let _0x4a5ba3 = 0;
    const _0x22b21b = _0x3456c2(_0x3fd037?.lead?.userUrl || "");
    const _0x31d561 = !!_0x3fd037?.isBatchAction || !!_0x3fd037?.batchConfig;
    while (Date.now() - _0x5a5789 < _0x49d04f) {
      if (_0x1b8f97(_0x1beb15)) {
        throw new Error("TASK_ABORTED");
      }
      const _0x48d89f = document.body;
      const _0x5d2bd2 = _0x48d89f?.getBoundingClientRect?.();
      const _0x1a3c48 = document.documentElement?.getBoundingClientRect?.();
      const _0x547337 = window.location.href;
      const _0x569f58 = _0x547337.includes("/user/");
      const _0x35ace7 = Number(window.innerWidth || 0);
      const _0x164c0b = Number(window.innerHeight || 0);
      const _0x46ca78 = !!_0x5d2bd2 && !!(_0x5d2bd2.width > 0) && !!(_0x5d2bd2.height > 0);
      const _0x4c3d0b = !!_0x1a3c48 && !!(_0x1a3c48.width > 0) && !!(_0x1a3c48.height > 0);
      const _0x46c247 = _0x35ace7 > 0 && _0x164c0b > 0;
      const _0x213871 = Boolean(_0x48d89f && (_0x46ca78 || _0x4c3d0b || _0x46c247));
      if (_0x569f58 && _0x22b21b) {
        const _0x5c2795 = _0x3456c2(_0x547337);
        if (_0x5c2795 && _0x5c2795 !== _0x22b21b) {
          if (Date.now() - _0x47a3ed > 2000) {
            console.warn("[子视图任务] 当前主页 UID(" + _0x5c2795 + ") 与目标(" + _0x22b21b + ") 不一致，继续等待导航…");
            _0x47a3ed = Date.now();
          }
          await _0x37707b(300);
          continue;
        }
      }
      if (_0x213871) {
        const _0x5b626f = _0x4380ce(_0x3fd037);
        if (_0x569f58 && _0x5b626f.ready) {
          console.log("%c[页面就绪] 目标用户主页加载完成", "color: #94a3b8; font-style: italic;");
          _0x31951d("主页跟进：主页已就绪（" + _0x5b626f.reason + (_0x5b626f.worksCount !== null ? "，作品数=" + _0x5b626f.worksCount : "") + "）");
          await _0x37707b(1200);
          return true;
        }
        if (_0x3fd037?.canCommentFirstWork && _0x569f58) {
          try {
            const _0x946b0 = _0x8aef63();
            if (_0x946b0.noWorks) {
              console.log("%c[页面就绪] 检测到目标主页作品数为 0，跳过渲染长等待", "color: #94a3b8; font-style: italic;");
              _0x31951d((_0x3fd037?.profileFirstCommentFallbackMode || "reply") === "skip" ? "主页跟进：检测到作品数为 0，仅首作评论模式将跳过回复..." : "主页跟进：检测到作品数为 0，准备回退为回复原评论...");
              return true;
            }
          } catch (_0x491cca) {}
        }
        const _0x5656ff = document.querySelector("[data-e2e=\"error-page\"]") || document.querySelector(".Ms08YIEh");
        const _0x107e17 = _0x48d89f.innerText || _0x48d89f.textContent || "";
        const _0x366e1e = !/抖音号|获赞|粉丝|关注|作品|喜欢/.test(_0x107e17);
        const _0x2ab6bd = _0x5656ff || _0x366e1e && /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(_0x107e17);
        if (_0x2ab6bd) {
          console.warn("%c[页面就绪] 检测到目标用户页面显示异常（无此用户/封禁等），立即中止任务！", "color: #ef4444; font-weight: bold;");
          throw new Error("USER_NOT_FOUND");
        }
        const _0x25e6c7 = Date.now() - _0x5a5789;
        const _0x15c4e7 = document.readyState === "interactive" || document.readyState === "complete";
        if (_0x3fd037?.canCommentFirstWork && _0x569f58 && _0x15c4e7 && _0x5b626f.bodyChars > 30 && _0x25e6c7 > 6000) {
          console.warn("[子视图任务] 主页旧版就绪信号未命中，转入作品区专用探测");
          _0x31951d("主页跟进：基础内容已渲染，转入作品区探测（ready=" + _0x5b626f.reason + "，text=" + _0x5b626f.bodyChars + "）...");
          return true;
        }
        if (!_0x31d561 && !_0x3fd037?.canCommentFirstWork && _0x569f58 && _0x213871 && _0x15c4e7 && _0x25e6c7 > 9000) {
          console.warn("[子视图任务] 主页就绪信号等待超过 9 秒，降级继续执行关注/私信动作");
          _0x31951d("主页跟进：主页信号等待较久，尝试继续执行后续动作...");
          return true;
        }
      }
      if (Date.now() - _0x47a3ed > 5000) {
        console.log("%c[子视图任务] 等待主页渲染中... (URL: " + window.location.href.split("?")[0] + ")", "color: #94a3b8; font-style: italic;");
        _0x47a3ed = Date.now();
      }
      if (Date.now() - _0x4a5ba3 > 5000) {
        const _0x5975d6 = Math.round((Date.now() - _0x5a5789) / 1000);
        let _0x144887 = "";
        try {
          const _0x3db4ee = _0x4380ce(_0x3fd037);
          const _0x3ef5c4 = _0x3456c2(window.location.href) || "none";
          const _0x240ff7 = "body=" + Math.round(_0x5d2bd2?.width || 0) + "x" + Math.round(_0x5d2bd2?.height || 0) + "/html=" + Math.round(_0x1a3c48?.width || 0) + "x" + Math.round(_0x1a3c48?.height || 0) + "/vp=" + _0x35ace7 + "x" + _0x164c0b;
          _0x144887 = "，uid=" + (_0x3ef5c4 === _0x22b21b ? "match" : _0x1e43ea(_0x3ef5c4, 18)) + "，doc=" + _0x3db4ee.documentReadyState + "，text=" + _0x3db4ee.bodyChars + "，works=" + (_0x3db4ee.worksCount ?? "unknown") + "，card=" + (_0x3db4ee.hasWorkCard ? 1 : 0) + "，layout=" + _0x240ff7;
        } catch (_0xfe6da9) {}
        _0x31951d("主页跟进：等待主页渲染中（" + _0x5975d6 + "s" + _0x144887 + "）...");
        _0x4a5ba3 = Date.now();
      }
      await _0x37707b(300);
    }
    if (!_0x31d561 && window.location.href.includes("/user/")) {
      console.warn("[子视图任务] 主页就绪等待超时，但仍在用户主页，降级继续执行后续流程");
      _0x31951d("主页跟进：主页渲染等待超时，尝试继续执行后续动作...");
      return true;
    }
    throw new Error("PROFILE_READY_TIMEOUT");
  }
  async function _0x446522(_0x5e6766, _0x204095, _0x3fbdbf = 15000) {
    const _0x2a737b = Date.now();
    while (Date.now() - _0x2a737b < _0x3fbdbf) {
      if (_0x1b8f97(_0x204095)) {
        throw new Error("TASK_ABORTED");
      }
      const _0x5d4011 = _0x3326e2(_0x5e6766) || _0x5ec01e(_0x5e6766);
      if (_0x5d4011 && _0x503f79(_0x5d4011)) {
        return _0x5d4011;
      }
      await _0x37707b(600);
    }
    return null;
  }
  function _0x81e50a(_0x299768) {
    const _0xfdcbb5 = _0x299768?.__profileFirstResume;
    if (!_0xfdcbb5 || _0xfdcbb5.phase !== "video_detail") {
      return null;
    }
    if (_0xfdcbb5.interactionId && _0x299768?.interactionId && String(_0xfdcbb5.interactionId) !== String(_0x299768.interactionId)) {
      return null;
    }
    const _0x119369 = Number(_0xfdcbb5.createdAt || 0);
    if (!_0x119369 || Date.now() - _0x119369 > 420000) {
      return null;
    }
    return _0xfdcbb5;
  }
  async function _0x41139e({
    task: _0x10d455,
    lead: _0x3dff7f,
    loopId: _0x3377c8,
    isBatch: _0xf530e2,
    detailInfo: _0x6f6c88,
    followedNow: _0x4c1f5a,
    batchCommentOpts: _0x2d23c8,
    resumeState = null
  }) {
    const _0x16b39b = await _0xb8b00d(_0x3dff7f, _0x3377c8, {
      ...(_0x2d23c8 || {}),
      resumeState: resumeState,
      resumeContext: {
        isBatch: !!_0xf530e2,
        detailInfo: _0x6f6c88 || {},
        followedNow: !!_0x4c1f5a
      }
    });
    if (_0x16b39b.worksCount !== undefined && _0x16b39b.worksCount !== null) {
      _0x3dff7f.worksCount = _0x16b39b.worksCount;
    }
    if (_0x16b39b.noWorks || _0x3dff7f.worksCount === 0) {
      _0x3dff7f.worksCount = _0x16b39b.worksCount ?? 0;
      _0x532ba2("@" + _0x3dff7f.nickname + " 执行中检测到无作品，未触达", _0x3dff7f.accountId);
      const _0x3dac34 = Math.floor(Math.random() * 5000) + 3000;
      _0x532ba2("@" + _0x3dff7f.nickname + " 无公开作品，拟真停留 " + (_0x3dac34 / 1000).toFixed(1) + " 秒...", _0x3dff7f.accountId);
      await _0x37707b(_0x3dac34);
      return {
        success: false,
        noWorks: true,
        skipped: !_0xf530e2,
        skipReason: "作品数为0",
        error: _0xf530e2 ? "作品数为0" : "",
        followed: !!_0x4c1f5a,
        ...(_0x6f6c88 || {}),
        worksCount: _0x3dff7f.worksCount
      };
    }
    if (_0x16b39b.success) {
      if (_0x16b39b.workLiked) {
        _0x4b1a04(_0x3dff7f, "like", {
          content: "首作作品点赞"
        });
        _0x5bc11c(_0x3dff7f, "首作作品点赞");
      }
      if (_0x16b39b.workCollected) {
        _0x5bc11c(_0x3dff7f, "首作作品收藏");
      }
      _0x4b1a04(_0x3dff7f, "profileComment", {
        content: _0x16b39b.content || "已评论"
      });
      _0x5bc11c(_0x3dff7f, "首作评论");
      _0x532ba2("@" + _0x3dff7f.nickname + " 已完成 →「" + _0x1e43ea(_0x16b39b.content || "已评论", 32) + "」", _0x3dff7f.accountId);
      const _0x236c30 = (_0x3dff7f.touchLog || []).find(_0x20ec46 => _0x20ec46.type === "profileComment");
      const _0x1169a0 = Number(_0x236c30?.at || 0) || Date.now();
      const _0x2b0097 = Math.max(0, ...(_0x3dff7f.touchLog || []).map(_0x27ce8c => Number(_0x27ce8c.at || _0x27ce8c.timestamp || 0)));
      const _0x4e34c4 = {
        success: true,
        content: _0x16b39b.content,
        profileWorkCommented: true,
        workLiked: !!_0x16b39b.workLiked,
        workCollected: !!_0x16b39b.workCollected,
        followed: !!_0x4c1f5a,
        ...(_0x6f6c88 || {}),
        worksCount: _0x3dff7f.worksCount,
        touchCounts: _0x3dff7f.touchCounts,
        touchLog: _0x3dff7f.touchLog,
        profileCommentAt: _0x1169a0,
        lastTouchAt: _0x2b0097
      };
      if (_0xf530e2) {
        _0x9ecf63(_0x10d455);
        try {
          _0x1a22a7.send("interaction-success-checkpoint", {
            viewKey: _0x2c7585.currentViewKey,
            interactionId: _0x10d455.interactionId,
            batchRunId: _0x10d455.batchRunId,
            results: _0x4e34c4
          });
        } catch (_0x4918f8) {}
      }
      return _0x4e34c4;
    }
    _0x532ba2("@" + _0x3dff7f.nickname + " 失败（" + _0x1e43ea(_0x16b39b.error || "首作评论失败", 40) + "）", _0x3dff7f.accountId);
    return {
      success: false,
      error: _0x16b39b.error || "首作评论失败",
      followed: !!_0x4c1f5a,
      ...(_0x6f6c88 || {}),
      worksCount: _0x3dff7f.worksCount
    };
  }
  async function _0x4395d8(_0x565c80, _0x177759) {
    const _0x22e6a5 = _0x565c80.lead;
    const _0x45fe66 = !!_0x565c80.isBatchAction || _0x565c80.batchConfig?.type === "profile_first_comment";
    if (_0x45fe66 && (_0x8648a5(_0x565c80) || !!_0x22e6a5?.actions?.profileWorkCommented || Number(_0x22e6a5?.touchCounts?.profileComment || 0) > 0)) {
      _0x532ba2("@" + (_0x22e6a5?.nickname || "?") + " 本轮已首作评论成功，跳过重复发表", _0x22e6a5?.accountId);
      _0x9ecf63(_0x565c80);
      return {
        success: true,
        profileWorkCommented: true,
        alreadyProfileCommented: true,
        content: _0x22e6a5?.replyContent || _0x22e6a5?.actions?.replyContent || "",
        worksCount: _0x22e6a5?.worksCount,
        touchCounts: _0x22e6a5?.touchCounts,
        touchLog: _0x22e6a5?.touchLog,
        profileCommentAt: _0x22e6a5?.profileCommentAt || Date.now()
      };
    }
    const _0x2d1283 = _0x81e50a(_0x565c80);
    if (_0x2d1283) {
      _0x22e6a5.worksCount = Number(_0x2d1283.worksCount ?? _0x22e6a5.worksCount ?? 0);
      _0x31951d("主页首作评论：恢复 @" + _0x22e6a5.nickname + " 已打开的作品详情", _0x22e6a5.accountId);
      _0x532ba2("@" + _0x22e6a5.nickname + " 导航后从作品详情继续（interactionId=" + _0x1e43ea(_0x565c80.interactionId || "?", 24) + "），不重复读取主页和生成任务", _0x22e6a5.accountId);
      const _0x2b4672 = await _0x41139e({
        task: _0x565c80,
        lead: _0x22e6a5,
        loopId: _0x177759,
        isBatch: _0x45fe66,
        detailInfo: _0x2d1283.detailInfo || {},
        followedNow: !!_0x2d1283.followedNow,
        batchCommentOpts: _0x2d1283.batchCommentOpts || {},
        resumeState: _0x2d1283
      });
      _0x2b4672.followAttempted = !!_0x565c80.canFollow;
      return _0x2b4672;
    }
    console.log("%c[主页首作评论] 正在处理: " + _0x22e6a5.nickname + (_0x45fe66 ? " (线索库批量)" : " (获客跟进)"), "color: #a78bfa; font-weight: bold;");
    _0x31951d("主页首作评论：读取 @" + _0x22e6a5.nickname + " 主页", _0x22e6a5.accountId);
    _0x532ba2("@" + _0x22e6a5.nickname + " 开始" + (_0x45fe66 ? "（线索库批量）" : "（获客跟进）"), _0x22e6a5.accountId);
    _0x4c2b1b(_0x22e6a5);
    const _0xb39ba8 = _0x45fe66 ? _0x11a922(_0x565c80) : _0x1025ab(_0x565c80);
    const _0x4ddd8f = await _0x57802f({
      genderFilter: _0xb39ba8,
      loopId: _0x177759
    });
    _0x1cfa8a(_0x22e6a5, _0x4ddd8f, _0x565c80, {
      emit: false
    });
    const _0x3287cd = _0x573709();
    if (_0x3287cd !== null && _0x3287cd !== undefined) {
      _0x22e6a5.worksCount = _0x3287cd;
    }
    const _0x4efd35 = _0x2b0062(_0x4ddd8f.gender, _0xb39ba8);
    const _0x1c9581 = _0x45fe66 ? _0x565c80 : _0x22eafe(_0x565c80);
    const _0x2b084a = _0x2f2d17(_0x1c9581) ? _0x11f1e6(_0x1c9581) : "关闭";
    const _0x3711ca = _0x4ddd8f.genderTimedOut ? "（等待" + ((Number(_0x4ddd8f.genderWaitMs) || 0) / 1000).toFixed(1) + "s仍未知）" : "";
    _0x532ba2("@" + _0x22e6a5.nickname + " 目标筛选：性别 " + _0x4efd35.filterLabel + "（识别 " + _0x4efd35.observedLabel + _0x3711ca + "）；年龄 " + _0x2b084a + "（识别 " + _0x5c1281(_0x4ddd8f) + "）", _0x22e6a5.accountId);
    if (_0x4ddd8f.genderUnresolved) {
      const _0x270fa9 = "性别尚未识别完成（主页加载偏慢），已跳过以免误判";
      _0x532ba2("@" + _0x22e6a5.nickname + " " + _0x270fa9, _0x22e6a5.accountId);
      const _0x4b0467 = Math.floor(Math.random() * 5000) + 3000;
      await _0x37707b(_0x4b0467);
      return {
        success: _0x45fe66 ? false : true,
        skipped: !_0x45fe66,
        profileFirstTargetFiltered: true,
        skipReason: _0x270fa9,
        error: _0x45fe66 ? _0x270fa9 : "",
        ..._0x4ddd8f,
        worksCount: _0x22e6a5.worksCount
      };
    }
    if (!_0x4efd35.pass) {
      _0x532ba2("@" + _0x22e6a5.nickname + " " + _0x4efd35.reason + "，" + (_0x45fe66 ? "记为失败" : "已跳过"), _0x22e6a5.accountId);
      const _0x276245 = Math.floor(Math.random() * 5000) + 3000;
      _0x532ba2("@" + _0x22e6a5.nickname + " 性别不符，拟真停留 " + (_0x276245 / 1000).toFixed(1) + " 秒...", _0x22e6a5.accountId);
      await _0x37707b(_0x276245);
      return {
        success: _0x45fe66 ? false : true,
        skipped: !_0x45fe66,
        profileFirstTargetFiltered: true,
        skipReason: _0x4efd35.reason,
        error: _0x45fe66 ? _0x4efd35.reason : "",
        ..._0x4ddd8f,
        worksCount: _0x22e6a5.worksCount
      };
    }
    if (_0x2f2d17(_0x1c9581)) {
      const _0x1a29a8 = _0x4c3312(_0x4ddd8f, _0x1c9581);
      if (!_0x1a29a8.pass) {
        _0x532ba2("@" + _0x22e6a5.nickname + " " + _0x1a29a8.reason + "，" + (_0x45fe66 ? "记为失败" : "已跳过"), _0x22e6a5.accountId);
        const _0x470682 = Math.floor(Math.random() * 5000) + 3000;
        _0x532ba2("@" + _0x22e6a5.nickname + " 年龄不符，拟真停留 " + (_0x470682 / 1000).toFixed(1) + " 秒...", _0x22e6a5.accountId);
        await _0x37707b(_0x470682);
        return {
          success: _0x45fe66 ? false : true,
          skipped: !_0x45fe66,
          profileFirstTargetFiltered: true,
          skipReason: _0x1a29a8.reason,
          error: _0x45fe66 ? _0x1a29a8.reason : "",
          ..._0x4ddd8f,
          worksCount: _0x22e6a5.worksCount
        };
      }
    }
    if (_0x4ddd8f.isPrivate) {
      const _0x3479dc = "对方账号设置了隐私，未执行关注/私信/首作评论";
      _0x532ba2("@" + _0x22e6a5.nickname + " " + _0x3479dc, _0x22e6a5.accountId);
      const _0x5152d0 = Math.floor(Math.random() * 5000) + 3000;
      _0x532ba2("@" + _0x22e6a5.nickname + " 私密账号，拟真停留 " + (_0x5152d0 / 1000).toFixed(1) + " 秒...", _0x22e6a5.accountId);
      await _0x37707b(_0x5152d0);
      return {
        success: true,
        skipped: true,
        skipReason: _0x3479dc,
        ..._0x4ddd8f,
        worksCount: _0x22e6a5.worksCount
      };
    }
    if (_0x22e6a5.worksCount === 0) {
      _0x532ba2("@" + _0x22e6a5.nickname + " 作品数为0，未触达", _0x22e6a5.accountId);
      const _0x2fb3f8 = Math.floor(Math.random() * 5000) + 3000;
      _0x532ba2("@" + _0x22e6a5.nickname + " 无公开作品，拟真停留 " + (_0x2fb3f8 / 1000).toFixed(1) + " 秒...", _0x22e6a5.accountId);
      await _0x37707b(_0x2fb3f8);
      return {
        success: false,
        noWorks: true,
        skipped: !_0x45fe66,
        skipReason: "作品数为0",
        error: _0x45fe66 ? "作品数为0" : "",
        ..._0x4ddd8f,
        worksCount: 0
      };
    }
    const _0x2875c8 = _0x1e66c4(_0x565c80);
    if (!_0x45fe66 && _0x2875c8 && _0x3ddab0(_0x565c80)) {
      const _0x135f32 = await _0x237526(_0x22e6a5, _0x565c80.videoTitle || _0x22e6a5.videoTitle || _0x22e6a5.title || "", _0x177759, _0x565c80);
      if (_0x135f32?.pass === false) {
        _0x22e6a5.isHighIntention = false;
        _0x22e6a5.aiThought = _0x135f32.reason || "主页画像判断不匹配";
        const _0x1331e2 = Math.floor(Math.random() * 5000) + 3000;
        _0x532ba2("@" + _0x22e6a5.nickname + " 画像不匹配，拟真停留 " + (_0x1331e2 / 1000).toFixed(1) + " 秒...", _0x22e6a5.accountId);
        await _0x37707b(_0x1331e2);
        return {
          success: true,
          skipped: true,
          targetRejected: true,
          skipReason: "非目标人群",
          targetReason: _0x135f32.reason || "主页画像判断不匹配",
          targetScore: _0x135f32.score,
          ..._0x4ddd8f,
          worksCount: _0x22e6a5.worksCount
        };
      }
    }
    _0x532ba2("@" + _0x22e6a5.nickname + " 主页作品数=" + _0x22e6a5.worksCount + "，准备评论首个", _0x22e6a5.accountId);
    const _0x266bcb = !!_0x565c80.enableCommentWithoutText || !!_0x565c80.batchConfig?.enableCommentWithoutText;
    const _0x231fcd = (_0x565c80.commentTemplate || _0x565c80.commentContent || _0x565c80.batchConfig?.commentTemplate || "").trim();
    const _0x524c7f = (_0x565c80.videoCommentContent || "").trim();
    const _0x372c1 = _0x231fcd || _0x524c7f;
    if (_0x2875c8) {
      _0x480305({
        ..._0x565c80,
        aiReplyMode: true,
        profileFirstCommentUseAi: true,
        enableCommentWithoutText: _0x266bcb
      });
    } else {
      _0x480305({
        ..._0x565c80,
        commentContent: _0x231fcd || _0x565c80.commentContent || "",
        videoCommentContent: _0x524c7f || _0x231fcd || _0x565c80.videoCommentContent || "",
        aiReplyMode: false,
        profileFirstCommentUseAi: false,
        enableCommentWithoutText: _0x266bcb
      });
    }
    const _0x35a39e = _0x266bcb ? {
      templateText: "",
      forceTemplateOnly: true
    } : _0x2875c8 ? {
      forceAi: true
    } : _0x372c1 ? {
      templateText: _0x372c1,
      forceTemplateOnly: true
    } : {};
    console.log("%c[主页首作评论] 文案模式: " + (_0x266bcb ? "不发文字" : _0x2875c8 ? "AI智能体" : "固定模板") + " (aiReplyMode=" + !!_0x2c7585.currentTask?.aiReplyMode + ", aiRole=" + !!_0x2c7585.currentTask?.aiRole + ")", "color: #a78bfa; font-weight: bold;");
    _0x532ba2("@" + _0x22e6a5.nickname + " 文案模式=" + (_0x266bcb ? "不发文字" : _0x2875c8 ? "AI智能体" : "固定模板") + "（aiReplyMode=" + !!_0x2c7585.currentTask?.aiReplyMode + "，aiRole=" + !!_0x2c7585.currentTask?.aiRole + "，noText=" + _0x266bcb + "）", _0x22e6a5.accountId);
    let _0xdc0d81 = false;
    if (_0x565c80.canFollow) {
      _0x532ba2("@" + _0x22e6a5.nickname + " 先在主页执行关注，再评论首作", _0x22e6a5.accountId);
      const _0x313054 = await _0x20e4ce(_0x22e6a5, _0x177759, true, false, _0x565c80.dmContent, false, _0x565c80, _0x4ddd8f);
      _0xdc0d81 = !!_0x313054?.followed;
      if (_0xdc0d81) {
        _0x532ba2("@" + _0x22e6a5.nickname + " 关注成功", _0x22e6a5.accountId);
        await _0x31ddc1(_0x177759, _0x565c80, _0x22e6a5);
      } else if (_0x313054?.skipped) {
        _0x532ba2("@" + _0x22e6a5.nickname + " " + _0x1e43ea(_0x313054.skipReason || "不符合关注筛选", 36) + "，未执行关注", _0x22e6a5.accountId);
      } else if (_0x313054?.error) {
        _0x532ba2("@" + _0x22e6a5.nickname + " 关注未成功（" + _0x1e43ea(_0x313054.error, 24) + "）", _0x22e6a5.accountId);
        await _0x37707b(1000);
      } else {
        await _0x37707b(1000);
      }
    }
    const _0x8a80fc = await _0x41139e({
      task: _0x565c80,
      lead: _0x22e6a5,
      loopId: _0x177759,
      isBatch: _0x45fe66,
      detailInfo: _0x4ddd8f,
      followedNow: _0xdc0d81,
      batchCommentOpts: _0x35a39e
    });
    _0x8a80fc.followAttempted = !!_0x565c80.canFollow;
    return _0x8a80fc;
  }
  async function _0xb4c5f4(_0x3db565) {
    const _0x39a756 = String(_0x3db565?.interactionId || "").trim();
    if (_0x2c7585.subviewTaskStarted && _0x39a756 && _0x2c7585.activeSubviewInteractionId === _0x39a756) {
      console.warn("[子视图任务] 忽略重复启动 interactionId=" + _0x39a756);
      _0x532ba2("忽略重复任务（interactionId=" + _0x1e43ea(_0x39a756, 24) + "）", _0x3db565?.lead?.accountId);
      return;
    }
    const _0x1f79e2 = ++_0x2c7585.subviewTaskSeq;
    if (_0x2c7585.subviewTaskStarted) {
      if (_0x2c7585.activeSubviewInteractionId) {
        _0x374584(_0x2c7585.activeSubviewInteractionId);
      }
      console.warn("[子视图任务] 新任务抢占上一任务，开始处理 @" + (_0x3db565.lead?.nickname || "?") + " (seq=" + _0x1f79e2 + ")");
    }
    if (_0x3db565.lead?.userUrl && !_0x288fc9(_0x3db565)) {
      const _0xd3d528 = _0x3456c2(window.location.href) || "?";
      const _0x1a76d6 = _0x3456c2(_0x3db565.lead.userUrl) || "?";
      console.warn("[子视图任务] 主页 UID 不匹配，拒绝执行：当前=" + _0xd3d528 + "，目标=" + _0x1a76d6);
      _0x4c16e2();
      _0x1a22a7.send("interaction-done", {
        viewKey: _0x2c7585.currentViewKey,
        interactionId: _0x3db565.interactionId,
        batchRunId: _0x3db565.batchRunId,
        results: {
          followed: false,
          messaged: false,
          error: "profile_url_mismatch"
        }
      });
      return;
    }
    _0x2c7585.subviewTaskStarted = true;
    const _0x13f581 = _0x39a756 || "seq-" + _0x1f79e2;
    _0x2c7585.activeSubviewInteractionId = _0x13f581;
    _0x2c7585.cancelledSubviewInteractionIds.delete(_0x13f581);
    if (_0x3db565.viewKey) {
      _0x2c7585.currentViewKey = _0x3db565.viewKey;
      _0xe87fea("radar_view_key", _0x3db565.viewKey);
    }
    console.log("%c[子视图任务] 正在处理线索：" + _0x3db565.lead.nickname, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
    console.log("%c[执行策略] 预热=" + (_0x3db565.enableWarmup ? "开启" : "关闭") + (_0x3db565.__warmupRestored ? "（已完成）" : "") + ", 关注=" + (_0x3db565.canFollow ? "开启" : "关闭") + ", 私信=" + (_0x3db565.canDM ? "开启" : "关闭") + ", 主页首作评论=" + (_0x3db565.canCommentFirstWork ? "开启" : "关闭"), "color: #a78bfa; font-style: italic;");
    _0x480305(_0x3db565);
    _0x3db565 = _0x2c7585.currentTask;
    const _0x3b0ca3 = _0x2c7585.activeLoopId;
    _0x2c7585.pausedForSubview = false;
    _0x2c7585.stopRequested = false;
    _0x2c7585.taskRunning = true;
    _0x2c7585.activeLoopId = "SUBVIEW_TASK";
    const _0x5bdc4a = async () => {
      try {
        let _0x87a33 = 60000;
        if (_0x3db565.isBatchAction || _0x3db565.batchConfig) {
          const _0x260cf2 = Number(_0x3db565.__batchProfileOpenDeadline || 0);
          _0x87a33 = _0x260cf2 > 0 ? Math.max(1000, _0x260cf2 - Date.now()) : 30000;
        }
        const _0x5858be = _0x81e50a(_0x3db565);
        if (_0x5858be) {
          _0x532ba2("检测到同一 interactionId 的详情续跑阶段，跳过主页二次就绪与画像读取", _0x3db565?.lead?.accountId);
        } else {
          await _0x4e5e47(_0x3db565, _0x2c7585.activeLoopId, _0x87a33);
        }
        try {
          _0x1a22a7.send("interaction-profile-ready", {
            viewKey: _0x2c7585.currentViewKey,
            interactionId: _0x3db565.interactionId,
            batchRunId: _0x3db565.batchRunId
          });
        } catch (_0x568cdc) {}
        if (_0x3db565.canCommentFirstWork) {
          const _0x3f0587 = await _0x4395d8(_0x3db565, _0x2c7585.activeLoopId);
          const _0x2e3731 = !_0x3f0587?.targetRejected && !_0x3f0587?.profileFirstTargetFiltered && !_0x3f0587?.demographicFilterFailed && !_0x3f0587?.isPrivate && _0x1f79e2 === _0x2c7585.subviewTaskSeq;
          const _0x567321 = !!_0x3db565.canFollow && !_0x3f0587?.followAttempted;
          const _0x5806b1 = !!_0x3db565.canDM;
          if (_0x2e3731 && (_0x567321 || _0x5806b1)) {
            console.log("%c[主页跟进] 复用当前子视图，继续完成" + (_0x567321 && _0x5806b1 ? "关注+私信" : _0x567321 ? "关注" : "私信"), "color: #fff; background: #6366f1; padding: 2px 4px; border-radius: 2px;");
            const _0xc4385f = _0x3db565.lead?.nickname || "";
            const _0x2223b2 = _0x3db565.lead?.accountId;
            const _0xd6c32c = _0x567321 && _0x5806b1 ? "关注+私信" : _0x567321 ? "关注" : "私信";
            _0x31951d("复用当前主页，继续" + _0xd6c32c + " @" + _0xc4385f, _0x2223b2);
            _0x350801("↪ @" + _0xc4385f + "：不重新打开主页，继续" + _0xd6c32c + "…", _0x2223b2);
            try {
              const _0x3e5767 = await _0x4c0383(_0x2c7585.activeLoopId);
              if (!_0x3e5767) {
                if (_0x5806b1) {
                  _0x3f0587.messaged = false;
                }
                _0x3f0587.followUpError = "profile_work_detail_close_failed";
              } else {
                if (_0x4daafd(_0x3f0587)) {
                  _0x350801("📨 @" + _0xc4385f + "：已回当前主页，拟真停留后继续" + _0xd6c32c + "…", _0x2223b2);
                  await _0xad73ac(2000, 4000, _0x2c7585.activeLoopId, "首作评论后拟真停留");
                }
                const _0x4e7a35 = await _0x20e4ce(_0x3db565.lead, _0x2c7585.activeLoopId, _0x567321, _0x5806b1, _0x3db565.dmContent, false, _0x3db565, _0x3f0587);
                if (_0x4e7a35 && !_0x4e7a35.pendingNavigation) {
                  _0x3f0587.followed = !!_0x3f0587.followed || !!_0x4e7a35.followed;
                  _0x3f0587.messaged = !!_0x3f0587.messaged || !!_0x4e7a35.messaged;
                  _0x3f0587.followAttempted = !!_0x3f0587.followAttempted || !!_0x567321;
                  if (_0x4e7a35.dmSkipped !== undefined) {
                    _0x3f0587.dmSkipped = !!_0x4e7a35.dmSkipped;
                  }
                  if (_0x4e7a35.dmContent) {
                    _0x3f0587.dmContent = _0x4e7a35.dmContent;
                  }
                  if (_0x4e7a35.gender) {
                    _0x3f0587.gender = _0x4e7a35.gender;
                  }
                  if (_0x4e7a35.isPrivate != null) {
                    _0x3f0587.isPrivate = _0x4e7a35.isPrivate;
                  }
                  if (_0x4e7a35.error) {
                    _0x3f0587.followUpError = _0x4e7a35.error;
                  }
                  if (_0x4e7a35.touchCounts) {
                    _0x3f0587.touchCounts = {
                      ...(_0x3f0587.touchCounts || {}),
                      ..._0x4e7a35.touchCounts
                    };
                  }
                  if (Array.isArray(_0x4e7a35.touchLog) && _0x4e7a35.touchLog.length) {
                    _0x3f0587.touchLog = _0x5ef1e1([...(_0x4e7a35.touchLog || []), ...(_0x3f0587.touchLog || [])]).slice(0, 200);
                  }
                  if (_0x4e7a35.lastTouchAt) {
                    _0x3f0587.lastTouchAt = Math.max(Number(_0x3f0587.lastTouchAt || 0), Number(_0x4e7a35.lastTouchAt || 0));
                  }
                }
              }
            } catch (_0x359792) {
              console.warn("[主页跟进] 当前主页后续动作异常:", _0x359792?.message || _0x359792);
            }
          }
          _0x4c16e2();
          if (_0x3f0587?.success && _0x3f0587?.profileWorkCommented && !_0x3f0587?.skipped && !_0x3db565.canDM && _0x1f79e2 === _0x2c7585.subviewTaskSeq) {
            await _0xad73ac(3000, 6000, _0x2c7585.activeLoopId, "首作评论成功后驻留");
          }
          if (_0x1f79e2 !== _0x2c7585.subviewTaskSeq) {
            console.warn("[子视图任务] 首作评论驻留已被新任务取消 (seq=" + _0x1f79e2 + ")");
            return;
          }
          _0x1a22a7.send("interaction-done", {
            viewKey: _0x2c7585.currentViewKey,
            interactionId: _0x3db565.interactionId,
            batchRunId: _0x3db565.batchRunId,
            results: _0x3f0587
          });
          return;
        }
        const _0x3bbe64 = await _0x20e4ce(_0x3db565.lead, _0x2c7585.activeLoopId, _0x3db565.canFollow, _0x3db565.canDM, _0x3db565.dmContent, _0x3db565.enableWarmup && !_0x3db565.__warmupRestored, _0x3db565);
        if (_0x3bbe64?.pendingNavigation) {
          return;
        }
        _0x4c16e2();
        _0x1a22a7.send("interaction-done", {
          viewKey: _0x2c7585.currentViewKey,
          interactionId: _0x3db565.interactionId,
          batchRunId: _0x3db565.batchRunId,
          results: _0x3bbe64
        });
      } catch (_0x1f9fd6) {
        _0x4c16e2();
        const _0x13ab7a = _0x1f9fd6?.message || String(_0x1f9fd6 || "");
        const _0x3f3aed = _0x13ab7a === "USER_NOT_FOUND" || /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(_0x13ab7a);
        if (_0x3f3aed) {
          const _0x54076f = "用户不存在（可能已注销）";
          console.warn("%c[子视图任务] " + _0x54076f + "，跳过本条跟进", "color: #f59e0b; font-weight: bold;");
          _0x1a22a7.send("interaction-done", {
            viewKey: _0x2c7585.currentViewKey,
            interactionId: _0x3db565.interactionId,
            batchRunId: _0x3db565.batchRunId,
            results: {
              followed: false,
              messaged: false,
              skipped: true,
              skipReason: _0x54076f,
              userGone: true,
              profileUnavailable: true,
              profileUnavailableReason: _0x54076f,
              error: _0x54076f,
              errorCode: "USER_NOT_FOUND"
            }
          });
        } else {
          _0x1a22a7.send("interaction-done", {
            viewKey: _0x2c7585.currentViewKey,
            interactionId: _0x3db565.interactionId,
            batchRunId: _0x3db565.batchRunId,
            results: {
              followed: false,
              messaged: false,
              error: _0x13ab7a
            }
          });
        }
      } finally {
        if (_0x1f79e2 === _0x2c7585.subviewTaskSeq) {
          _0x2c7585.taskRunning = false;
          _0x2c7585.activeLoopId = _0x3b0ca3;
          _0x2c7585.subviewTaskStarted = false;
          if (_0x2c7585.activeSubviewInteractionId === _0x13f581) {
            _0x2c7585.activeSubviewInteractionId = "";
          }
        }
      }
    };
    if (_0x2c7585.subviewTaskAls) {
      return _0x2c7585.subviewTaskAls.run({
        interactionId: _0x13f581,
        taskSeq: _0x1f79e2
      }, _0x5bdc4a);
    }
    return _0x5bdc4a();
  }
  async function _0x40180a(_0x36c4a1) {
    console.log("%c[环境清理] 正在检查并清除遮挡弹窗...", "color: #94a3b8; font-style: italic;");
    let _0x26fc67 = false;
    for (let _0x35823b = 0; _0x35823b < 3; _0x35823b++) {
      const _0x539d50 = ["[data-e2e=\"video-player-close-icon\"]", ".dy-modal-close", "[class*=\"ModalClose\"]", "[class*=\"modal-close\"]", "[class*=\"close-btn\"]", "[class*=\"CloseBtn\"]", "[class*=\"close-icon\"]", "[class*=\"CloseIcon\"]", ".RightPanelHeadercloseImPage"];
      const _0x100a25 = Array.from(document.querySelectorAll(_0x539d50.join(", "))).find(_0x503f79) || Array.from(document.querySelectorAll("svg")).find(_0x1d875a => _0x503f79(_0x1d875a) && (_0x1d875a.innerHTML.includes("M24.24") || _0x1d875a.innerHTML.includes("M6.5 6.5") || _0x1d875a.innerHTML.includes("M11.867 11.867") || _0x1d875a.innerHTML.includes("close") || _0x1d875a.innerHTML.includes("Close")))?.closest("button, [role=\"button\"], div") || Array.from(document.querySelectorAll("[class*=\"close\"], [class*=\"Close\"]")).find(_0x503f79);
      if (_0x100a25 && _0x503f79(_0x100a25)) {
        console.log("%c[拟人操作] 发现遮挡弹窗，正在关闭...", "color: #fbbf24; font-style: italic;");
        await _0x9922d7(_0x100a25, _0x36c4a1, "关闭视频详情");
        await _0x37707b(1000);
        _0x26fc67 = true;
      } else {
        const _0x656ca7 = await _0x1d4135("Escape", _0x36c4a1, "关闭弹层");
        if (!_0x656ca7) {
          window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27
          }));
        }
        await _0x37707b(500);
        if (_0x35823b > 0 && !document.querySelector("[data-e2e=\"video-player-container\"]")) {
          break;
        }
      }
    }
    if (_0x26fc67) {
      await _0x37707b(1000);
      console.log("%c[环境清理] 弹窗清理完毕，UI 已重置", "color: #94a3b8; font-style: italic;");
    }
  }
  function _0x11a235() {
    const _0x1335c8 = [_0x50d6b9["douyin.com"].modalContainer, "[data-e2e=\"video-detail-container\"]", "[data-e2e=\"video-player-container\"]", "[class*=\"SearchDetail\"]"].filter(Boolean).join(", ");
    return Array.from(document.querySelectorAll(_0x1335c8)).some(_0x21e6a5 => {
      if (!_0x503f79(_0x21e6a5)) {
        return false;
      }
      if (_0x21e6a5.matches?.("[data-e2e=\"video-player-container\"]")) {
        return !!_0x21e6a5.closest?.("[data-e2e=\"video-detail-container\"], [class*=\"SearchDetail\"], [role=\"dialog\"]");
      }
      return true;
    });
  }
  async function _0x4c0383(_0x359ab3) {
    if (!_0x11a235()) {
      return true;
    }
    console.log("%c[主页首作评论] 评论完成，正在关闭作品详情返回主页...", "color: #f59e0b; font-weight: bold;");
    _0x31951d("首作评论完成，正在关闭作品返回主页...");
    _0x350801("📨 正在关闭作品详情，返回主页以便私信…");
    const _0x4f34c5 = ["[data-e2e=\"video-player-close-icon\"]", "[data-e2e=\"video-detail-container\"] [data-e2e=\"close\"]", "[data-e2e=\"video-detail-container\"] [aria-label=\"关闭\"]", "[data-e2e=\"video-detail-container\"] [class*=\"close\"]", "[data-e2e=\"video-detail-container\"] [class*=\"Close\"]", "[class*=\"SearchDetail\"] [aria-label=\"关闭\"]", "[class*=\"SearchDetail\"] [class*=\"close\"]", "[class*=\"SearchDetail\"] [class*=\"Close\"]", ".dy-modal-close", "[class*=\"ModalClose\"]", "[class*=\"modal-close\"]"];
    for (let _0x400b4a = 0; _0x400b4a < 4; _0x400b4a++) {
      if (_0x400b4a > 0) {
        _0x350801("📨 作品详情尚未关闭，第 " + (_0x400b4a + 1) + "/4 次重试…");
      }
      const _0x400f03 = Array.from(document.querySelectorAll(_0x4f34c5.join(", "))).filter(_0x503f79).sort((_0x42ef33, _0x4a664b) => {
        const _0x50994d = _0x42ef33.getBoundingClientRect();
        const _0x5c134d = _0x4a664b.getBoundingClientRect();
        return _0x50994d.top - _0x5c134d.top || _0x50994d.left - _0x5c134d.left;
      });
      if (_0x400f03[0]) {
        await _0x9922d7(_0x400f03[0], _0x359ab3, "关闭主页作品详情");
      } else {
        const _0x3dd016 = await _0x1d4135("Escape", _0x359ab3, "关闭主页作品详情");
        if (!_0x3dd016) {
          const _0x2a4300 = document.activeElement || document;
          for (const _0x2f3f47 of ["keydown", "keyup"]) {
            _0x2a4300.dispatchEvent(new KeyboardEvent(_0x2f3f47, {
              key: "Escape",
              code: "Escape",
              keyCode: 27,
              which: 27,
              bubbles: true,
              composed: true
            }));
          }
        }
      }
      for (let _0x45d7ee = 0; _0x45d7ee < 8; _0x45d7ee++) {
        await _0x37707b(250);
        if (!_0x11a235()) {
          console.log("%c[主页首作评论] 作品详情已关闭，已返回主页", "color: #10b981; font-weight: bold;");
          _0x350801("📨 作品详情已关闭，已返回主页");
          return true;
        }
      }
    }
    console.warn("[主页首作评论] 作品详情关闭失败，取消关注/私信，防止误点详情页按钮");
    _0x31951d("作品详情未能关闭，已取消本次关注/私信");
    return false;
  }
  function _0x3456c2(_0x1d7b22) {
    if (!_0x1d7b22 || typeof _0x1d7b22 !== "string") {
      return "";
    }
    try {
      let _0x1f88d8 = _0x1d7b22.trim();
      if (_0x1f88d8.startsWith("//")) {
        _0x1f88d8 = "https:" + _0x1f88d8;
      }
      if (!_0x1f88d8.startsWith("http")) {
        _0x1f88d8 = "https://www.douyin.com" + (_0x1f88d8.startsWith("/") ? _0x1f88d8 : "/" + _0x1f88d8);
      }
      const _0x414cc3 = new URL(_0x1f88d8);
      const _0x1155c8 = _0x414cc3.pathname.match(/\/user\/([^/?#]+)/i);
      if (_0x1155c8 && _0x1155c8[1]) {
        const _0xd66a01 = decodeURIComponent(_0x1155c8[1]);
        if (_0xd66a01 && !["self", "login"].includes(_0xd66a01.toLowerCase())) {
          return _0xd66a01;
        }
      }
      const _0x31f0d9 = _0x414cc3.pathname.match(/\/user\/profile\/([^/?#]+)/i);
      if (_0x31f0d9 && _0x31f0d9[1]) {
        return decodeURIComponent(_0x31f0d9[1]);
      }
    } catch (_0x1e6868) {}
    return "";
  }
  function _0x288fc9(_0x11996e) {
    const _0x49b350 = window.location.href;
    if (_0x49b350 === "about:blank") {
      return false;
    }
    const _0x381ef8 = _0x81e50a(_0x11996e);
    if (_0x381ef8?.videoId) {
      const _0x55feb0 = _0x487d0e(_0x49b350);
      if (_0x55feb0 && String(_0x55feb0) === String(_0x381ef8.videoId)) {
        return true;
      }
    }
    if (!_0x49b350.includes("/user/")) {
      return false;
    }
    const _0xa16a43 = _0x11996e.lead?.userUrl || "";
    const _0x2bee7e = _0x3456c2(_0x49b350);
    const _0x28c839 = _0x3456c2(_0xa16a43);
    if (_0x2bee7e && _0x28c839) {
      return _0x2bee7e === _0x28c839;
    }
    if (_0x28c839 && !_0x2bee7e) {
      return false;
    }
    if (!_0x28c839 && _0x2bee7e) {
      return false;
    }
    if (_0xa16a43) {
      const _0x2c7a15 = _0x210e83(_0xa16a43);
      const _0x4e82ca = _0x210e83(_0x49b350);
      if (_0x2c7a15 && _0x4e82ca && _0x2c7a15 === _0x4e82ca) {
        return true;
      }
    }
    return false;
  }
  async function _0x822eaf(_0x36bc24, _0x3858c7 = 20000) {
    const _0x4577e8 = Date.now() + _0x3858c7;
    while (Date.now() < _0x4577e8) {
      if (_0x288fc9(_0x36bc24)) {
        return true;
      }
      await _0x37707b(300);
    }
    return _0x288fc9(_0x36bc24);
  }
  _0x1a22a7.on("interaction-preempt", (_0x5327f3, _0x171a8b = {}) => {
    if (_0x2c7585.activeSubviewInteractionId) {
      _0x374584(_0x2c7585.activeSubviewInteractionId);
    }
    if (_0x2c7585.currentTask?.interactionId) {
      _0x374584(_0x2c7585.currentTask.interactionId);
    }
    _0x2c7585.subviewTaskSeq += 1;
    _0x2c7585.subviewTaskStarted = false;
    _0x2c7585.activeSubviewInteractionId = "";
    _0x4c16e2();
    console.warn("[子视图任务] 收到抢占通知，重置状态（下一主页=" + (_0x171a8b.url || "?") + "，reason=" + (_0x171a8b.reason || "") + "）");
  });
  _0x1a22a7.on("interaction-prepare-task", async (_0x298327, _0x8a1c47) => {
    try {
      console.log("%c[子视图任务] 准备执行：" + _0x8a1c47.lead.nickname, "color: #fff; background: #3b82f6; font-weight: bold; padding: 4px;");
      if (_0x8a1c47.viewKey) {
        _0x2c7585.currentViewKey = _0x8a1c47.viewKey;
        _0xe87fea("radar_view_key", _0x8a1c47.viewKey);
      }
      _0xe87fea("radar_is_interaction_view", "true");
      _0x2c7585.isInteractionView = true;
      try {
        _0x40c2d1.setItem("radar_pending_subview_task", JSON.stringify(_0x8a1c47));
      } catch (_0x12c22e) {
        console.warn("[子视图] 暂存任务失败，等待页面就绪后直接执行:", _0x12c22e.message);
      }
      const _0x268047 = _0x3456c2(window.location.href);
      const _0x50edee = _0x3456c2(_0x8a1c47.lead?.userUrl || "");
      const _0x127bf9 = !!_0x8a1c47.isBatchAction || !!_0x8a1c47.batchConfig;
      const _0x25d628 = _0x127bf9 ? Date.now() + 30000 : 0;
      const _0x574679 = _0x127bf9 ? Math.max(1000, _0x25d628 - Date.now()) : 20000;
      const _0x20804b = _0x288fc9(_0x8a1c47) ? true : await _0x822eaf(_0x8a1c47, _0x574679);
      if (_0x20804b) {
        if (_0x127bf9 && _0x25d628) {
          _0x8a1c47.__batchProfileOpenDeadline = _0x25d628;
        }
        _0x480305(_0x8a1c47);
        const _0x50d657 = _0x1e66c4(_0x8a1c47);
        _0x532ba2("子视图就绪 @" + (_0x8a1c47.lead?.nickname || "?") + "（uid=" + (_0x50edee || _0x268047 || "?") + "，canCommentFirstWork=" + !!_0x8a1c47.canCommentFirstWork + "，aiReplyMode=" + !!_0x8a1c47.aiReplyMode + "，aiRole=" + !!_0x8a1c47.aiRole + "，profileAi=" + _0x50d657 + "）", _0x8a1c47.lead?.accountId);
        await _0xb4c5f4(_0x2c7585.currentTask);
      } else {
        const _0x24a37d = _0x3456c2(window.location.href) || window.location.href.split("?")[0];
        const _0x59c583 = _0x3456c2(_0x8a1c47.lead?.userUrl || "") || _0x8a1c47.lead?.userUrl || "?";
        console.warn("[子视图] 主页 URL 不匹配，放弃执行：当前=" + _0x24a37d + "，目标=" + _0x59c583);
        _0x532ba2("子视图 URL 不匹配 @" + (_0x8a1c47.lead?.nickname || "?") + "（当前 " + _0x24a37d + "，目标 " + _0x59c583 + "）", _0x8a1c47.lead?.accountId);
        _0x4c16e2();
        _0x1a22a7.send("interaction-done", {
          viewKey: _0x2c7585.currentViewKey,
          interactionId: _0x8a1c47.interactionId,
          batchRunId: _0x8a1c47.batchRunId,
          results: {
            followed: false,
            messaged: false,
            error: "profile_url_mismatch"
          }
        });
      }
    } catch (_0x287b27) {
      console.error("[子视图] 准备异常:", _0x287b27);
    }
  });
  async function _0x99a7d2(_0x4d51ad) {
    console.log("%c[节奏控制] [操作预热] 已进入抖音首页推荐流，设定随机浏览时长: " + _0x4d51ad.watchDuration + " 秒...", "color: #fff; background: #059669; padding: 2px 4px; border-radius: 2px;");
    _0x31951d("操作预热：进入官方推荐流...");
    _0x350801("🔥 操作预热：进入推荐流，计划浏览 " + _0x4d51ad.watchDuration + " 秒");
    _0x350801("⏱ 操作预热：等待页面稳定载入 3 秒…");
    await _0x37707b(3000);
    const _0x2f6377 = Date.now();
    const _0x51d5c6 = _0x4d51ad.watchDuration * 1000;
    let _0xfce6ab = -1;
    while (Date.now() - _0x2f6377 < _0x51d5c6) {
      const _0x208bc2 = Math.round((_0x51d5c6 - (Date.now() - _0x2f6377)) / 1000);
      console.log("%c[节奏控制] [拟人阅读] 正在模拟观看推荐页随机视频，剩余时间: " + _0x208bc2 + " 秒...", "color: #10b981; font-style: italic;");
      _0x31951d("节奏控制：拟真观看推荐页视频 (还需 " + _0x208bc2 + " 秒)");
      if (_0x208bc2 !== _0xfce6ab && (_0x208bc2 <= 5 || _0x208bc2 % 15 === 0)) {
        _0x350801("🔥 操作预热：拟真观看中，剩余约 " + _0x208bc2 + " 秒");
        _0xfce6ab = _0x208bc2;
      }
      if (Math.random() < 0.3) {
        try {
          window.scrollBy({
            top: Math.floor(Math.random() * 80) - 20,
            behavior: "smooth"
          });
        } catch (_0x418a40) {}
      }
      await _0x37707b(3000);
    }
    console.log("%c[节奏控制] [预热完成] 推荐页拟真随机视频浏览完毕，即将安全关闭窗口。", "color: #fff; background: #047857; padding: 2px 4px; border-radius: 2px;");
    _0x40c2d1.removeItem("radar_subview_recommend_state");
    _0x1a22a7.send("interaction-done", {
      viewKey: _0x4d51ad.viewKey,
      interactionId: _0x4d51ad.interactionId,
      batchRunId: _0x4d51ad.batchRunId,
      results: _0x4d51ad.results
    });
  }
  async function _0xde2405() {
    let _0x167aff = false;
    try {
      const _0x540ac8 = _0x40c2d1.getItem("radar_subview_recommend_state");
      if (_0x540ac8) {
        const _0x44674b = JSON.parse(_0x540ac8);
        if (_0x44674b.createdAt && Date.now() - _0x44674b.createdAt < 60000) {
          await _0x99a7d2(_0x44674b);
          return;
        } else {
          _0x40c2d1.removeItem("radar_subview_recommend_state");
          _0x1a22a7.send("interaction-done", {
            viewKey: _0x44674b.viewKey,
            interactionId: _0x44674b.interactionId,
            batchRunId: _0x44674b.batchRunId,
            results: _0x44674b.results
          });
          return;
        }
      }
      if (!_0x2c7585.isInteractionView && !_0x40c2d1.getItem("radar_pending_subview_task")) {
        return;
      }
      const _0x481903 = _0x40c2d1.getItem("radar_pending_subview_task");
      if (_0x481903) {
        const _0x49a35f = JSON.parse(_0x481903);
        if (!_0x49a35f.createdAt || Date.now() - _0x49a35f.createdAt > 420000) {
          _0x40c2d1.removeItem("radar_pending_subview_task");
          return;
        }
        if (_0x288fc9(_0x49a35f)) {
          _0x167aff = true;
          _0x480305(_0x49a35f);
          await _0xb4c5f4(_0x2c7585.currentTask);
        }
      }
    } catch (_0x21c0b0) {
      console.error("[子视图任务处理器] 异常:", _0x21c0b0);
      if (_0x167aff) {
        _0x1a22a7.send("interaction-done", {
          viewKey: _0x2c7585.currentViewKey,
          interactionId: _0x2c7585.currentTask?.interactionId,
          batchRunId: _0x2c7585.currentTask?.batchRunId,
          results: {
            followed: false,
            messaged: false,
            error: _0x21c0b0.message
          }
        });
      }
    }
  }
  function _0x42c482(_0xb80c8d = null) {
    const _0x265a9c = _0xb80c8d || _0x2c7585.currentTask || {};
    const _0x34e2de = _0x265a9c.batchConfig || {};
    let _0x4cfd0c = parseInt(_0x265a9c.followDmDelayMin ?? _0x34e2de.followDmDelayMin, 10);
    let _0x5add5a = parseInt(_0x265a9c.followDmDelayMax ?? _0x34e2de.followDmDelayMax, 10);
    if (!Number.isFinite(_0x4cfd0c) || _0x4cfd0c < 1) {
      _0x4cfd0c = 10;
    }
    if (!Number.isFinite(_0x5add5a) || _0x5add5a < 1) {
      _0x5add5a = 20;
    }
    if (_0x4cfd0c > _0x5add5a) {
      [_0x4cfd0c, _0x5add5a] = [_0x5add5a, _0x4cfd0c];
    }
    return {
      minSec: _0x4cfd0c,
      maxSec: _0x5add5a
    };
  }
  function _0x45363d(_0x36604f = null) {
    const _0x482b6c = _0x36604f || _0x2c7585.currentTask || {};
    const _0x525355 = _0x482b6c.batchConfig || {};
    if (_0x482b6c.dmUseRandomSuffix != null) {
      return !!_0x482b6c.dmUseRandomSuffix;
    }
    if (_0x482b6c.useRandomSuffix != null) {
      return !!_0x482b6c.useRandomSuffix;
    }
    if (_0x525355.dmUseRandomSuffix != null) {
      return !!_0x525355.dmUseRandomSuffix;
    }
    if (_0x525355.useRandomSuffix != null) {
      return !!_0x525355.useRandomSuffix;
    }
    return false;
  }
  let _0x242f0e;
  function _0x47976d() {
    if (_0x242f0e !== undefined) {
      return _0x242f0e;
    }
    const _0x238e6b = (() => {
      try {
        return require("path");
      } catch (_0xf5851d) {
        return null;
      }
    })();
    const _0x4ca98e = ["./shared/randomTextSuffix", "./shared/randomTextSuffix.js"];
    if (_0x238e6b && typeof _0x22d6d9 === "string") {
      _0x4ca98e.push(_0x238e6b.join(_0x22d6d9, "shared", "randomTextSuffix.js"), _0x238e6b.join(_0x22d6d9, "shared", "randomTextSuffix"), _0x238e6b.join(_0x22d6d9, "..", "shared", "randomTextSuffix.js"));
    }
    for (const _0x1adf65 of _0x4ca98e) {
      try {
        const _0x1d6ba3 = require(_0x1adf65);
        if (typeof _0x1d6ba3?.appendRandomEmojiSuffix === "function" && typeof _0x1d6ba3?.buildRandomEmojiSuffix === "function") {
          _0x242f0e = _0x1d6ba3;
          return _0x242f0e;
        }
      } catch (_0x4992e9) {}
    }
    console.warn("[Built-in-Debug] randomTextSuffix 模块未找到，回退内置后缀实现");
    _0x242f0e = null;
    return _0x242f0e;
  }
  let _0x272706;
  function _0x438b92() {
    if (_0x272706 !== undefined) {
      return _0x272706;
    }
    const _0x283554 = (() => {
      try {
        return require("path");
      } catch (_0x363ed1) {
        return null;
      }
    })();
    const _0x49202b = ["./shared/commentTextNormalize", "./shared/commentTextNormalize.js"];
    if (_0x283554 && typeof _0x22d6d9 === "string") {
      _0x49202b.push(_0x283554.join(_0x22d6d9, "shared", "commentTextNormalize.js"), _0x283554.join(_0x22d6d9, "..", "shared", "commentTextNormalize.js"));
    }
    for (const _0x345be0 of _0x49202b) {
      try {
        const _0x109d41 = require(_0x345be0);
        if (typeof _0x109d41?.replaceRiskyCommentEmojis === "function") {
          _0x272706 = _0x109d41;
          return _0x272706;
        }
      } catch (_0x4b4215) {}
    }
    console.warn("[Built-in-Debug] commentTextNormalize 模块未找到，回退内置实现");
    _0x272706 = null;
    return _0x272706;
  }
  function _0x23a5dd(_0x15bb30) {
    const _0x454595 = _0x438b92();
    if (_0x454595?.replaceRiskyCommentEmojis) {
      return _0x454595.replaceRiskyCommentEmojis(_0x15bb30);
    }
    return {
      text: String(_0x15bb30 || ""),
      replaced: false,
      labels: ""
    };
  }
  function _0xe3ef96(_0x290336, _0x243817 = "comment") {
    const _0x3ff6 = _0x23a5dd(_0x290336);
    if (!_0x3ff6.replaced) {
      return String(_0x290336 || "");
    }
    const _0xf02840 = "装饰表情已改为中文标记（" + _0x1e43ea(_0x3ff6.labels, 24) + "）";
    if (_0x243817 === "profile") {
      _0x532ba2(_0xf02840);
    } else if (_0x243817 === "reply") {
      _0x350801("💬 回复：" + _0xf02840, null, "warning");
    } else {
      _0x350801("📝 视频主评：" + _0xf02840, null, "warning");
    }
    return _0x3ff6.text;
  }
  function _0xe9b961(_0x2b0a3d, _0xbb0909) {
    const _0x188859 = _0x438b92();
    if (_0x188859?.commentDraftHasCoreText) {
      return _0x188859.commentDraftHasCoreText(_0x2b0a3d, _0xbb0909);
    }
    const _0x16b698 = _0x981055 => String(_0x981055 || "").replace(/\s+/g, "").trim();
    const _0x5cb5d2 = _0x16b698(_0x2b0a3d);
    const _0x1c3c13 = _0x16b698(_0xbb0909);
    return !!_0x5cb5d2 && !!_0x1c3c13 && (_0x5cb5d2 === _0x1c3c13 || !!(_0x5cb5d2.length >= 4) && !!_0x1c3c13.includes(_0x5cb5d2));
  }
  function _0x1d1955(_0x392dc9, _0x45bdfa) {
    const _0x3ead78 = _0x438b92();
    if (_0x3ead78?.isCommentDraftOnlyEmojiDrift) {
      return _0x3ead78.isCommentDraftOnlyEmojiDrift(_0x392dc9, _0x45bdfa);
    }
    return _0xe9b961(_0x392dc9, _0x45bdfa);
  }
  function _0xed4a41(_0x4aca9f) {
    const _0x4db256 = _0x438b92();
    if (_0x4db256?.classifyCommentFailureToast) {
      return _0x4db256.classifyCommentFailureToast(_0x4aca9f);
    }
    const _0x23a698 = String(_0x4aca9f || "");
    if (/操作太频繁|请稍后再试|内容不符合|包含违规/.test(_0x23a698)) {
      return {
        code: "rate_limited",
        stopAccount: true,
        label: _0x23a698.slice(0, 40)
      };
    }
    return {
      code: "comment_publish_failed",
      stopAccount: false,
      label: _0x23a698.slice(0, 40) || "发布评论失败"
    };
  }
  const _0x433cee = ["͏", "᠎", "​", "‌", "‍", "⁠", "⁡", "⁢", "⁣", "⁤", "﻿"];
  const _0x50340b = ["😊", "🙂", "😄", "😁", "😃", "🤗", "😌", "😇", "👍", "👏", "🙌", "🤝", "✌️", "👋", "💪", "✨", "🌟", "⭐", "💫", "☀️", "🎉", "🎊"];
  function _0x27698b() {
    const _0x17ec00 = 4 + Math.floor(Math.random() * 5);
    const _0x213a4c = Array.from({
      length: _0x17ec00
    }, () => _0x433cee[Math.floor(Math.random() * _0x433cee.length)]).join("");
    const _0x1ff425 = _0x50340b[Math.floor(Math.random() * _0x50340b.length)];
    return " " + _0x1ff425 + _0x213a4c;
  }
  function _0x456ffb() {
    const _0x118f15 = _0x47976d();
    if (_0x118f15?.buildRandomEmojiSuffix) {
      return _0x118f15.buildRandomEmojiSuffix();
    }
    return _0x27698b();
  }
  function _0x5e12ec(_0x130e30) {
    const _0x4f7ac5 = _0x47976d();
    if (_0x4f7ac5?.appendRandomEmojiSuffix) {
      return _0x4f7ac5.appendRandomEmojiSuffix(_0x130e30);
    }
    const _0x551a18 = String(_0x130e30 || "");
    if (!_0x551a18.trim()) {
      return _0x551a18;
    }
    return _0x551a18 + _0x27698b();
  }
  function _0x37daa3(_0x5c0411 = null) {
    const _0x4df1c1 = _0x5c0411 || _0x2c7585.currentTask || {};
    if (_0x4df1c1.videoCommentMode && _0x4df1c1.videoCommentMode !== "custom") {
      return false;
    }
    return !!_0x4df1c1.videoCommentUseRandomSuffix;
  }
  function _0x1b09bc(_0x12572a = null) {
    const _0x5cee38 = _0x12572a || _0x2c7585.currentTask || {};
    return !!_0x5cee38.commentUseRandomSuffix;
  }
  async function _0x31ddc1(_0x318bbe, _0x3afcd6 = null, _0x5c0f11 = null) {
    const {
      minSec: _0x17c465,
      maxSec: _0x375c03
    } = _0x42c482(_0x3afcd6);
    const _0x7ad402 = _0x5c0f11?.nickname ? "@" + _0x5c0f11.nickname : "";
    _0x31951d((_0x7ad402 + " 关注完成，按「关注后停留」随机等待 " + _0x17c465 + "-" + _0x375c03 + " 秒…").trim(), _0x5c0f11?.accountId);
    await _0xad73ac(_0x17c465 * 1000, _0x375c03 * 1000, _0x318bbe, "关注后停留");
  }
  function _0xd0af99(_0x2f5379 = {}) {
    const _0x409922 = String(_0x2f5379?.followStatus || "");
    const _0x8a8cc8 = !!_0x2f5379?.alreadyFollowed || _0x409922 === "already_followed";
    const _0x3cf734 = !_0x8a8cc8 && !!_0x2f5379?.followed && _0x409922 !== "already_followed" || !!_0x2f5379?.followRequestSent;
    const _0x363507 = !!_0x2f5379?.followRequested || !!_0x2f5379?.followRequestSent || _0x409922 === "requested";
    const _0xeb1dae = _0x3cf734 || _0x8a8cc8 || _0x363507;
    return {
      followed: _0x3cf734,
      error: _0xeb1dae ? "" : String(_0x2f5379?.error || "关注未确认"),
      followStatus: _0x409922 || (_0xeb1dae ? "success" : "failed"),
      alreadyFollowed: _0x8a8cc8,
      followRequested: _0x363507,
      followRequestSent: !!_0x2f5379?.followRequestSent,
      stateConfirmed: _0xeb1dae,
      errorCode: _0x2f5379?.errorCode || "",
      isPrivate: !!_0x2f5379?.isPrivate
    };
  }
  async function _0x6d124c(_0x1b76a5, _0x127dca) {
    _0x31951d("正在定位关注按钮...");
    const _0x33aaac = _0x1b76a5?.nickname ? "[" + _0x1b76a5.nickname + "]" : "";
    const _0xdb83bf = _0x1b76a5?.nickname ? "@" + _0x1b76a5.nickname : "@用户";
    if (_0x33aaac) {
      _0x31951d("正在自动关注用户 " + _0x33aaac + "...");
    }
    const _0x57359f = await _0x16abc7(_0x1b76a5 || {}, _0x127dca);
    const _0xe69cee = _0xd0af99(_0x57359f);
    const _0x4f295d = String(_0x57359f?.diagnostic || "").trim();
    if (_0xe69cee.followed) {
      const _0x5650e1 = _0xe69cee.followRequestSent ? "已申请关注" : "关注成功";
      console.log("%c[互动成功] " + _0x5650e1, "color: #fff; background: #4f46e5; padding: 2px 4px; border-radius: 2px;");
      _0x350801("👤 " + _0xdb83bf + "：" + _0x5650e1, _0x1b76a5?.accountId);
    } else if (_0xe69cee.alreadyFollowed) {
      console.log("%c[主页跟进] 此前已经关注，本轮不重复计数", "color: #94a3b8; font-style: italic;");
      _0x350801("👤 " + _0xdb83bf + "：此前已关注，本轮跳过重复关注", _0x1b76a5?.accountId);
    } else if (_0xe69cee.followRequested) {
      console.log("%c[主页跟进] 此前已申请关注，本轮不重复计数", "color: #94a3b8; font-style: italic;");
      _0x350801("👤 " + _0xdb83bf + "：此前已申请关注，本轮跳过", _0x1b76a5?.accountId);
    } else {
      const _0x7b8c53 = _0xe69cee.error || "关注未确认";
      console.warn("[交互警告] 关注未确认: " + _0x7b8c53 + (_0xe69cee.errorCode ? " (" + _0xe69cee.errorCode + ")" : ""));
      _0x350801("👤 " + _0xdb83bf + "：关注失败（" + _0x1e43ea(_0x7b8c53, 48) + (_0xe69cee.errorCode ? "/" + _0xe69cee.errorCode : "") + "）" + ("" + (_0x4f295d ? "；" + _0x1e43ea(_0x4f295d, 120) : "")), _0x1b76a5?.accountId, "warning");
    }
    return _0xe69cee;
  }
  async function _0x20e4ce(_0x5b517f, _0x3fccc8, _0x294853, _0x332e28, _0x2a2deb, _0x4c4945 = false, _0x2718e1 = null, _0x289583 = null) {
    let _0x62c15f = {
      followed: false,
      messaged: false,
      alreadyFollowed: false,
      alreadyMessaged: false
    };
    const _0x58c95e = _0x2718e1 || _0x2c7585.currentTask || {};
    const _0x2de012 = _0x11a922(_0x58c95e);
    let _0x305dc1 = _0x289583 ? _0x5b10d3(_0x289583) : await _0x57802f({
      genderFilter: _0x2de012,
      loopId: _0x3fccc8
    });
    if (_0x289583 && _0x2de012 !== "all" && (!_0x305dc1.gender || _0x305dc1.gender === "未知")) {
      const _0x3e4a1e = await _0x57802f({
        genderFilter: _0x2de012,
        loopId: _0x3fccc8
      });
      _0x305dc1 = {
        ..._0x305dc1,
        ..._0x3e4a1e
      };
    }
    Object.assign(_0x62c15f, _0x305dc1);
    if (!_0x289583) {
      _0x1cfa8a(_0x5b517f, _0x305dc1, _0x58c95e, {
        emit: false
      });
    } else {
      _0xa99d5c(_0x5b517f, _0x305dc1);
    }
    const _0x59bfdc = _0x2b0062(_0x305dc1.gender, _0x2de012);
    _0x350801("👤 @" + _0x5b517f.nickname + " 目标筛选：性别 " + _0x59bfdc.filterLabel + "（识别 " + _0x59bfdc.observedLabel + ((_0x305dc1.genderTimedOut ? "，等待" + ((Number(_0x305dc1.genderWaitMs) || 0) / 1000).toFixed(1) + "s仍未知" : "") + "）；") + ("年龄 " + (_0x2f2d17(_0x58c95e) ? _0x11f1e6(_0x58c95e) : "关闭") + "（识别 " + _0x5c1281(_0x305dc1) + "）"), _0x5b517f.accountId);
    if (_0x305dc1.genderUnresolved) {
      const _0x238fb0 = "性别尚未识别完成（主页加载偏慢），已跳过以免误判";
      console.log("%c[性别过滤] " + _0x238fb0, "color: #94a3b8; font-style: italic;");
      _0x31951d("@" + _0x5b517f.nickname + " " + _0x238fb0, _0x5b517f.accountId);
      const _0x3ecb05 = !!_0x58c95e.isBatchAction || !!_0x58c95e.batchConfig;
      return {
        ..._0x62c15f,
        success: _0x3ecb05 ? false : undefined,
        skipped: !_0x3ecb05,
        skipReason: _0x238fb0,
        error: _0x3ecb05 ? _0x238fb0 : undefined,
        demographicFilterFailed: true
      };
    }
    if (!_0x59bfdc.pass) {
      console.log("%c[性别过滤] " + _0x59bfdc.reason + "，跳过关注/私信", "color: #94a3b8; font-style: italic;");
      _0x31951d("@" + _0x5b517f.nickname + " " + _0x59bfdc.reason + "，已跳过关注/私信", _0x5b517f.accountId);
      const _0x5cb6b8 = !!_0x58c95e.isBatchAction || !!_0x58c95e.batchConfig;
      return {
        ..._0x62c15f,
        success: _0x5cb6b8 ? false : undefined,
        skipped: !_0x5cb6b8,
        skipReason: _0x59bfdc.reason,
        error: _0x5cb6b8 ? _0x59bfdc.reason : undefined,
        demographicFilterFailed: true
      };
    }
    if (_0x2f2d17(_0x58c95e)) {
      const _0x88ffef = _0x4c3312(_0x305dc1, _0x58c95e);
      if (!_0x88ffef.pass) {
        console.log("%c[年龄过滤] " + _0x88ffef.reason + "，不符合任务设置，跳过关注/私信", "color: #94a3b8; font-style: italic;");
        _0x31951d("@" + _0x5b517f.nickname + " " + _0x88ffef.reason + "，已跳过关注/私信", _0x5b517f.accountId);
        _0x350801("⏭ @" + _0x5b517f.nickname + "：" + _0x88ffef.reason + "，已跳过关注/私信", _0x5b517f.accountId, "warning");
        const _0x373a8a = !!_0x58c95e.isBatchAction || !!_0x58c95e.batchConfig;
        return {
          ..._0x62c15f,
          success: _0x373a8a ? false : undefined,
          skipped: !_0x373a8a,
          skipReason: _0x88ffef.reason,
          error: _0x373a8a ? _0x88ffef.reason : undefined,
          demographicFilterFailed: true
        };
      }
    }
    return _0x37c163(async () => {
      try {
        _0x31951d("正在获取用户 [" + _0x5b517f.nickname + "] 的性别与隐私属性...");
        if (_0x4c4945 && (_0x294853 || _0x332e28)) {
          if (_0x305dc1.isPrivate) {
            console.log("%c[节奏控制] 检测到私密账号，自动跳过作品预热环节", "color: #94a3b8; font-style: italic;");
          } else {
            _0x31951d("账号养护中：正在浏览 [" + _0x5b517f.nickname + "] 的历史作品进行点赞预热...");
            const _0x4b8ac6 = await _0x2e48b0(_0x3fccc8, {
              lead: _0x5b517f,
              resumeTask: _0x2718e1 || _0x2c7585.currentTask
            });
            if (_0x4b8ac6?.pendingNavigation) {
              return {
                ..._0x62c15f,
                pendingNavigation: true
              };
            }
            const _0x21572e = await _0x2424a8(_0x5b517f, _0x3fccc8, "操作预热", _0x2718e1 || _0x2c7585.currentTask);
            if (_0x21572e) {
              return {
                ..._0x62c15f,
                pendingNavigation: true
              };
            }
          }
        }
        const _0x45c7c2 = _0x2718e1 || _0x2c7585.currentTask || {};
        const _0x478076 = !!_0x289583;
        if (_0x45c7c2.enableRandomLike && (_0x294853 || _0x332e28) && !_0x478076) {
          if (_0x305dc1.isPrivate) {
            console.log("%c[主页跟进] 检测到私密账号，不执行作品点赞", "color: #94a3b8; font-style: italic;");
            _0x31951d("主页跟进：@" + _0x5b517f.nickname + " 是私密账号，本条不执行作品点赞", _0x5b517f.accountId);
          } else {
            const _0x39fa5c = _0x194dae(_0x45c7c2);
            console.log("[主页跟进] 正在进行作品点赞概率判断（配置 " + _0x39fa5c + "%）...");
            _0x31951d("主页跟进：正在判断是否给 @" + _0x5b517f.nickname + " 的作品点赞（配置概率 " + _0x39fa5c + "%）", _0x5b517f.accountId);
            await _0xe23269(_0x3fccc8, {
              lead: _0x5b517f,
              config: _0x45c7c2
            });
            const _0x4c789c = await _0x2424a8(_0x5b517f, _0x3fccc8, "随机点赞", _0x45c7c2);
            if (_0x4c789c) {
              return {
                ..._0x62c15f,
                pendingNavigation: true
              };
            }
          }
        } else if (_0x478076 && _0x45c7c2.enableRandomLike) {
          _0x350801("📨 @" + _0x5b517f.nickname + "：首作评论后直发私信，跳过随机作品点赞", _0x5b517f.accountId);
        }
        console.log("%c[互动动作] 正在执行主页跟进：关注=" + _0x294853 + ", 私信=" + _0x332e28, "color: #fff; background: #6366f1; padding: 2px 4px; border-radius: 2px;");
        let _0x3e3f20 = !!_0x305dc1.isPrivate;
        try {
          if (!_0x3e3f20 && typeof _0x485b90 === "function") {
            _0x3e3f20 = !!_0x485b90();
          }
        } catch (_0xf9386f) {}
        if (_0x3e3f20) {
          _0x305dc1.isPrivate = true;
          _0x62c15f.isPrivate = true;
          if (_0x294853 || _0x332e28) {
            const _0x515131 = [];
            if (_0x294853) {
              _0x515131.push("关注");
            }
            if (_0x332e28) {
              _0x515131.push("私信");
            }
            const _0x515c7d = "对方账号设置了隐私，未执行" + _0x515131.join("/");
            const _0x41dc96 = !!_0x45c7c2.isBatchAction || !!_0x45c7c2.batchConfig || !!_0x2c7585.currentTask?.isBatchAction;
            _0x62c15f.skipped = true;
            _0x62c15f.skipReason = _0x515c7d;
            _0x62c15f.followSkipped = !!_0x294853;
            _0x62c15f.dmSkippedDueToPrivate = !!_0x332e28;
            _0x62c15f.success = _0x41dc96 ? false : undefined;
            _0x62c15f.error = _0x41dc96 ? _0x515c7d : undefined;
            console.log("%c[主页跟进] " + _0x515c7d, "color: #f59e0b; font-weight: bold;");
            _0x31951d("@" + _0x5b517f.nickname + " " + _0x515c7d, _0x5b517f.accountId);
            _0x350801("🔒 @" + _0x5b517f.nickname + "：" + _0x515c7d, _0x5b517f.accountId, "warning");
          }
        } else {
          let _0x13564f = null;
          if (_0x294853) {
            _0x13564f = await _0x6d124c(_0x5b517f, _0x3fccc8);
            if (_0x13564f.followed) {
              _0x62c15f.followed = true;
              _0x4b1a04(_0x5b517f, "follow", {
                source: _0x2718e1?.isBatchAction || _0x2718e1?.batchConfig || _0x2c7585.currentTask?.isBatchAction ? "batch" : "acquire"
              });
              _0x5bc11c(_0x5b517f, "关注用户");
            }
            if (_0x13564f.alreadyFollowed || _0x13564f.followRequested && !_0x13564f.followRequestSent) {
              _0x62c15f.alreadyFollowed = true;
            }
            if (_0x13564f.error) {
              _0x62c15f.error = _0x13564f.error;
            }
            if (_0x13564f.followed && _0x332e28) {
              await _0x31ddc1(_0x3fccc8, _0x45c7c2, _0x5b517f);
            }
          }
          const _0x56e4f4 = String(_0x45c7c2?.dmTarget || _0x45c7c2?.batchConfig?.dmTarget || "all");
          const _0x111cd0 = !!_0x13564f?.followed || !!_0x13564f?.alreadyFollowed || !!_0x13564f?.followRequested || !!_0x13564f?.stateConfirmed || !!_0x62c15f.followed || !!_0x62c15f.alreadyFollowed;
          if (_0x332e28 && _0x294853 && _0x56e4f4 === "followed_only" && !_0x111cd0) {
            _0x62c15f.dmSkipped = true;
            _0x62c15f.dmSkipReason = "关注未成功，已按「仅关注成功」跳过私信";
            _0x350801("📨 @" + _0x5b517f.nickname + "：关注未成功，已按「仅关注成功」跳过私信", _0x5b517f.accountId, "warning");
          } else if (_0x332e28) {
            _0x350801("📨 @" + _0x5b517f.nickname + "：正在查找私信入口…", _0x5b517f.accountId);
            const _0x2097db = !!_0x2718e1?.isBatchAction || !!_0x2718e1?.batchConfig || !!_0x2c7585.currentTask?.isBatchAction;
            let _0x51ac3c = _0x2a2deb || "你好，交个朋友！";
            if (!_0x2097db) {
              const _0x17c56a = String(_0x51ac3c).split("\n").filter(_0x942751 => _0x942751.trim());
              _0x51ac3c = _0x17c56a[Math.floor(Math.random() * _0x17c56a.length)] || "你好！";
            }
            let _0x3fb938 = _0x5db96d(_0x51ac3c, _0x5b517f);
            if (_0x45363d(_0x2718e1 || _0x2c7585.currentTask)) {
              _0x3fb938 = _0x5e12ec(_0x3fb938);
            }
            console.log("%c[互动动作] 正在发送私信: \"" + _0x1e43ea(_0x3fb938, 40) + "\"", "color: #fff; background: #8b5cf6; padding: 2px 4px; border-radius: 2px;");
            _0x31951d("正在发送私信给 [" + _0x5b517f.nickname + "]...", _0x5b517f.accountId);
            _0x350801("📨 @" + _0x5b517f.nickname + "：正在发送私信…", _0x5b517f.accountId);
            const _0x1faf55 = (() => {
              const _0x58c2b3 = [_0x5b517f?.userUrl, _0x5b517f?.profileUrl, _0x5b517f?.authorProfileUrl, window.location.href?.includes?.("/user/") ? window.location.href : ""];
              for (const _0x2cee42 of _0x58c2b3) {
                const _0x1a698b = String(_0x2cee42 || "").trim();
                if (!_0x1a698b) {
                  continue;
                }
                if (/(?:video|note)\/\d{10,}/i.test(_0x1a698b)) {
                  continue;
                }
                return _0x1a698b;
              }
              return "";
            })();
            const _0x244089 = await _0x7eeb78(_0x3fb938, _0x3fccc8, {
              nickname: _0x5b517f?.nickname || "",
              userUrl: _0x1faf55,
              accountId: _0x5b517f?.accountId
            });
            if (_0x244089?.ok) {
              _0x62c15f.dmContent = _0x244089.sentText || _0x3fb938;
              if (_0x244089.skipped) {
                _0x62c15f.messaged = false;
                _0x62c15f.alreadyMessaged = true;
                _0x62c15f.dmSkipped = true;
                _0x62c15f.dmSkipReason = _0x244089.reason || "";
                _0x350801("📨 @" + _0x5b517f.nickname + "：" + (_0x244089.reason || "会话中已有我方私信，跳过"), _0x5b517f.accountId);
              } else {
                _0x62c15f.messaged = true;
                _0x4b1a04(_0x5b517f, "message", {
                  content: _0x62c15f.dmContent || _0x3fb938,
                  source: _0x2718e1?.isBatchAction || _0x2718e1?.batchConfig || _0x2c7585.currentTask?.isBatchAction ? "batch" : "acquire"
                });
                _0x5bc11c(_0x5b517f, "发送私信");
                _0x350801("📨 @" + _0x5b517f.nickname + "：私信发送成功" + (_0x244089.viaStranger ? "（经陌生人消息）" : "") + "，当前会话停留 2-5 秒后继续", _0x5b517f.accountId);
                try {
                  await _0xad73ac(2000, 5000, _0x3fccc8, "私信发送后停留");
                } catch (_0x233033) {
                  if (String(_0x233033?.message || _0x233033) !== "TASK_ABORTED") {
                    throw _0x233033;
                  }
                }
              }
            } else {
              _0x62c15f.error = _0x244089?.reason || "私信发送失败";
              if (_0x244089?.blocked) {
                _0x62c15f.dmBlocked = true;
                _0x62c15f.blockType = _0x244089.blockType || "";
              }
              _0x350801("📨 @" + _0x5b517f.nickname + "：私信失败（" + _0x62c15f.error + "）", _0x5b517f.accountId, "warning");
              console.warn("%c[交互警告] 私信失败: " + _0x62c15f.error, "color: #ef4444;");
            }
          }
        }
      } catch (_0x644c20) {
        const _0x574aff = _0x644c20?.message || String(_0x644c20);
        console.error("[主页交互] 失败:", _0x644c20);
        _0x62c15f.error = _0x574aff || "主页交互失败";
      }
      try {
        const _0x101ea6 = _0x573709();
        if (_0x101ea6 !== null && _0x101ea6 !== undefined) {
          _0x62c15f.worksCount = _0x101ea6;
          if (_0x101ea6 === 0) {
            _0x62c15f.noWorks = true;
          }
        }
      } catch (_0x229d74) {}
      if (!_0x62c15f.followed && !_0x62c15f.messaged && !_0x62c15f.error && (_0x62c15f.alreadyFollowed || _0x62c15f.alreadyMessaged)) {
        const _0x3e7a12 = [];
        if (_0x62c15f.alreadyFollowed) {
          _0x3e7a12.push("此前已关注/已申请");
        }
        if (_0x62c15f.alreadyMessaged) {
          _0x3e7a12.push("会话已有我方私信");
        }
        _0x62c15f.skipped = true;
        _0x62c15f.skipReason = _0x3e7a12.join("，") + "，本轮未执行新动作";
      }
      const _0xca2ed4 = _0x2718e1?.isBatchAction || _0x2718e1?.batchConfig || _0x2c7585.currentTask?.isBatchAction ? "batch" : "acquire";
      if (_0x62c15f.followed && !(_0x5b517f.touchCounts?.follow > 0)) {
        _0x4b1a04(_0x5b517f, "follow", {
          source: _0xca2ed4
        });
      }
      if (_0x62c15f.messaged && !_0x62c15f.dmSkipped && !(_0x5b517f.touchCounts?.message > 0)) {
        _0x4b1a04(_0x5b517f, "message", {
          content: _0x62c15f.dmContent || _0x2a2deb || "",
          source: _0xca2ed4
        });
      }
      const _0x143a86 = Math.max(Number(_0x5b517f.lastTouchAt || 0), ...(_0x5b517f.touchLog || []).map(_0x18f6de => Number(_0x18f6de.at || _0x18f6de.timestamp || 0)));
      return {
        ..._0x62c15f,
        dmContent: _0x62c15f.dmContent || _0x2a2deb,
        touchCounts: _0x5b517f.touchCounts,
        touchLog: _0x5b517f.touchLog,
        lastTouchAt: _0x143a86 || undefined
      };
    });
  }
  function _0xc144bc(_0x589edb) {
    const _0x187e22 = _0x2e44c2();
    if (_0x187e22?.parseAgeFromText) {
      return _0x187e22.parseAgeFromText(_0x589edb);
    }
    if (!_0x589edb) {
      return null;
    }
    const _0x2cd9b6 = String(_0x589edb).match(/(\d{1,2})岁/);
    if (!_0x2cd9b6) {
      return null;
    }
    const _0x164db3 = parseInt(_0x2cd9b6[1], 10);
    if (!Number.isFinite(_0x164db3) || _0x164db3 < 1 || _0x164db3 > 120) {
      return null;
    }
    return _0x164db3;
  }
  let _0x28c94f;
  function _0x1b4020() {
    if (_0x28c94f !== undefined) {
      return _0x28c94f;
    }
    const _0x1d7e7b = (() => {
      try {
        return require("path");
      } catch (_0x4d8b28) {
        return null;
      }
    })();
    const _0x4cf551 = ["./shared/genderFilter", "./shared/genderFilter.js"];
    if (_0x1d7e7b && typeof _0x22d6d9 === "string") {
      _0x4cf551.push(_0x1d7e7b.join(_0x22d6d9, "shared", "genderFilter.js"), _0x1d7e7b.join(_0x22d6d9, "shared", "genderFilter"), _0x1d7e7b.join(_0x22d6d9, "..", "shared", "genderFilter.js"));
    }
    for (const _0x417542 of _0x4cf551) {
      try {
        const _0x59389c = require(_0x417542);
        if (typeof _0x59389c?.evaluateGenderFilter === "function") {
          _0x28c94f = _0x59389c;
          console.log("[Built-in-Debug] genderFilter 已加载: " + _0x417542);
          return _0x28c94f;
        }
      } catch (_0x42e17b) {}
    }
    console.warn("[Built-in-Debug] genderFilter 模块未找到，使用内置五档筛选逻辑");
    _0x28c94f = null;
    return _0x28c94f;
  }
  let _0x407b9f;
  function _0x38bdc7() {
    if (_0x407b9f !== undefined) {
      return _0x407b9f;
    }
    const _0x34907e = (() => {
      try {
        return require("path");
      } catch (_0x123c0b) {
        return null;
      }
    })();
    const _0x551a84 = ["./shared/profileGenderFromApi", "./shared/profileGenderFromApi.js"];
    if (_0x34907e && typeof _0x22d6d9 === "string") {
      _0x551a84.push(_0x34907e.join(_0x22d6d9, "shared", "profileGenderFromApi.js"), _0x34907e.join(_0x22d6d9, "shared", "profileGenderFromApi"), _0x34907e.join(_0x22d6d9, "..", "shared", "profileGenderFromApi.js"));
    }
    for (const _0x197900 of _0x551a84) {
      try {
        const _0x5c779d = require(_0x197900);
        if (typeof _0x5c779d?.parseProfileGenderFromApi === "function") {
          _0x407b9f = _0x5c779d;
          console.log("[Built-in-Debug] profileGenderFromApi 已加载: " + _0x197900);
          return _0x407b9f;
        }
      } catch (_0x4c39b2) {}
    }
    console.warn("[Built-in-Debug] profileGenderFromApi 未找到，使用内置映射");
    _0x407b9f = null;
    return _0x407b9f;
  }
  let _0x103ccd = null;
  function _0x542dc2(_0x5d4819) {
    const _0x4527b2 = Number(_0x5d4819);
    if (_0x4527b2 === 1) {
      return "男";
    }
    if (_0x4527b2 === 2) {
      return "女";
    }
    return "未知";
  }
  function _0x2305cc(_0x14b01a) {
    const _0x5aa29d = _0x38bdc7();
    if (typeof _0x5aa29d?.parseProfileGenderFromApi === "function") {
      return _0x5aa29d.parseProfileGenderFromApi(_0x14b01a);
    }
    const _0x232b65 = _0x14b01a?.user || _0x14b01a?.data?.user || _0x14b01a?.user_info;
    if (!_0x232b65 || typeof _0x232b65 !== "object" || !Object.prototype.hasOwnProperty.call(_0x232b65, "gender")) {
      return null;
    }
    const _0x19a99d = Number(_0x232b65.user_age ?? _0x232b65.age);
    return {
      gender: _0x542dc2(_0x232b65.gender),
      age: Number.isFinite(_0x19a99d) && _0x19a99d >= 0 && _0x19a99d <= 120 ? Math.floor(_0x19a99d) : null,
      secUid: String(_0x232b65.sec_uid || _0x232b65.secUid || "").trim(),
      nickname: String(_0x232b65.nickname || "").trim(),
      genderCode: Number(_0x232b65.gender),
      settled: true
    };
  }
  function _0x4de303() {
    const _0x23a67b = _0x38bdc7();
    const _0x3da771 = typeof location !== "undefined" && location.href ? location.href : "";
    if (typeof _0x23a67b?.extractSecUidFromProfileUrl === "function") {
      return _0x23a67b.extractSecUidFromProfileUrl(_0x3da771);
    }
    const _0x4df4e1 = _0x3da771.match(/\/user\/([^/?#]+)/) || _0x3da771.match(/[?&]sec_uid=([^&#]+)/i);
    if (!_0x4df4e1) {
      return "";
    }
    try {
      return decodeURIComponent(_0x4df4e1[1]).trim();
    } catch (_0x18e29d) {
      return String(_0x4df4e1[1] || "").trim();
    }
  }
  function _0x11e411(_0x2e77a0, _0x410d10 = {}) {
    if (!_0x2e77a0 || !_0x2e77a0.settled) {
      return;
    }
    _0x103ccd = {
      ..._0x2e77a0,
      ts: Date.now(),
      url: _0x410d10.url || "",
      source: _0x410d10.source || "api"
    };
    try {
      if (typeof window !== "undefined") {
        window.__radarLastProfileGenderApi = _0x103ccd;
      }
    } catch (_0x22cd77) {}
  }
  function _0xd7d9df() {
    const _0x261091 = _0x103ccd || (typeof window !== "undefined" ? window.__radarLastProfileGenderApi : null);
    if (!_0x261091 || !_0x261091.settled) {
      return null;
    }
    const _0xe76df3 = _0x4de303();
    const _0x322e99 = _0x38bdc7();
    const _0x57917b = typeof _0x322e99?.profileApiMatchesPage === "function" ? _0x322e99.profileApiMatchesPage(_0x261091, _0xe76df3) : !_0xe76df3 || !_0x261091.secUid || _0xe76df3 === _0x261091.secUid;
    if (!_0x57917b) {
      return null;
    }
    if (_0x261091.ts && Date.now() - _0x261091.ts > 60000) {
      return null;
    }
    return _0x261091;
  }
  async function _0x4f7694() {
    const _0x13d54f = _0x4de303();
    if (!_0x13d54f || typeof fetch !== "function") {
      return null;
    }
    try {
      const _0x1e927f = new URLSearchParams({
        sec_user_id: _0x13d54f,
        device_platform: "webapp",
        aid: "6383",
        publish_video_strategy_type: "2",
        source: "channel_pc_web",
        personal_center_strategy: "1"
      });
      const _0x2f4e24 = "https://www.douyin.com/aweme/v1/web/user/profile/other/?" + _0x1e927f.toString();
      const _0x2d3fc5 = await fetch(_0x2f4e24, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*"
        }
      });
      const _0x3d29e0 = await _0x2d3fc5.text();
      if (!_0x3d29e0 || !String(_0x3d29e0).trim()) {
        return null;
      }
      const _0x1185b8 = JSON.parse(_0x3d29e0);
      const _0x25c552 = _0x2305cc(_0x1185b8);
      if (_0x25c552) {
        _0x11e411(_0x25c552, {
          url: _0x2f4e24,
          source: "api_fetch"
        });
        return _0xd7d9df();
      }
    } catch (_0x431002) {
      console.warn("[Built-in-Debug] profile/other 主动拉取失败:", _0x431002?.message || _0x431002);
    }
    return null;
  }
  const _0xb34cf8 = Object.freeze({
    all: "不限",
    male_unknown: "男+未知",
    male: "男",
    female_unknown: "女+未知",
    female: "女"
  });
  function _0x8f570d(_0x3f06fe, _0x4e3490 = "all") {
    const _0x4f2708 = _0x1b4020();
    if (typeof _0x4f2708?.normalizeGenderFilter === "function") {
      return _0x4f2708.normalizeGenderFilter(_0x3f06fe, _0x4e3490);
    }
    const _0x41e40c = String(_0x3f06fe || "").trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(_0xb34cf8, _0x41e40c)) {
      return _0x41e40c;
    }
    const _0x4ef489 = String(_0x4e3490 || "all").trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(_0xb34cf8, _0x4ef489)) {
      return _0x4ef489;
    } else {
      return "all";
    }
  }
  function _0x2b0062(_0x207d58, _0x1c90ac) {
    const _0x45bcef = _0x1b4020();
    if (typeof _0x45bcef?.evaluateGenderFilter === "function") {
      return _0x45bcef.evaluateGenderFilter(_0x207d58, _0x1c90ac);
    }
    const _0x583053 = _0x8f570d(_0x1c90ac);
    const _0x391d55 = String(_0x207d58 ?? "").trim().toLowerCase().replace(/\s+/g, "");
    const _0x2c574e = /^(男|男性|男生|male|m|♂)$/.test(_0x391d55) ? "male" : /^(女|女性|女生|female|f|♀)$/.test(_0x391d55) ? "female" : "unknown";
    const _0x32e2fb = _0x583053 === "all" || _0x583053 === _0x2c574e || _0x583053 === "male_unknown" && (_0x2c574e === "male" || _0x2c574e === "unknown") || _0x583053 === "female_unknown" && (_0x2c574e === "female" || _0x2c574e === "unknown");
    const _0x19fd99 = _0x2c574e === "male" ? "男" : _0x2c574e === "female" ? "女" : "未知";
    const _0x56d51f = _0xb34cf8[_0x583053] || _0xb34cf8.all;
    return {
      pass: _0x32e2fb,
      filter: _0x583053,
      filterLabel: _0x56d51f,
      observed: _0x2c574e,
      observedLabel: _0x19fd99,
      reason: _0x32e2fb ? "" : "性别不符（识别：" + _0x19fd99 + "，筛选：" + _0x56d51f + "）"
    };
  }
  function _0x11a922(_0x50aa8c) {
    const _0x365029 = _0x50aa8c?.batchConfig || _0x50aa8c || {};
    const _0x119bc6 = _0x365029.genderFilter ?? _0x365029.targetGender ?? "all";
    return _0x8f570d(_0x119bc6, "all");
  }
  function _0x1025ab(_0x4d2d2a) {
    return _0x8f570d(_0x4d2d2a?.profileFirstGenderFilter, "all");
  }
  function _0x22eafe(_0x546ca7) {
    return {
      ageFilterEnabled: _0x546ca7?.profileFirstAgeFilterEnabled === true,
      ageMin: _0x546ca7?.profileFirstAgeMin,
      ageMax: _0x546ca7?.profileFirstAgeMax
    };
  }
  function _0x51191c(_0x5d4b68) {
    const _0x21bdb6 = {
      all: "不限",
      male: "男",
      male_unknown: "男+未知",
      female: "女",
      female_unknown: "女+未知"
    };
    return _0x21bdb6[_0x5d4b68] || "不限";
  }
  function _0x34bacb(_0x110e23, _0x554938) {
    const _0x6d7d62 = _0x110e23 === "男" || _0x110e23 === "女" ? _0x110e23 : "未知";
    const _0x5a571 = {
      male: ["男"],
      male_unknown: ["男", "未知"],
      female: ["女"],
      female_unknown: ["女", "未知"]
    };
    const _0x57956b = _0x5a571[_0x554938];
    return !_0x57956b || _0x57956b.includes(_0x6d7d62);
  }
  function _0x11f1e6(_0x441d77) {
    const {
      min: _0x5ab708,
      max: _0x536823
    } = _0x201201(_0x441d77);
    if (_0x5ab708 != null && _0x536823 != null) {
      return _0x5ab708 + "-" + _0x536823 + " 岁";
    }
    if (_0x5ab708 != null) {
      return "≥" + _0x5ab708 + " 岁";
    }
    if (_0x536823 != null) {
      return "≤" + _0x536823 + " 岁";
    }
    return "不限";
  }
  function _0x5c1281(_0x18cfc9 = {}) {
    const _0x511c6f = _0x18cfc9.age;
    if (_0x511c6f === null || _0x511c6f === undefined || _0x511c6f === "") {
      return "未知";
    }
    const _0x5a4610 = Number(_0x511c6f);
    if (Number.isFinite(_0x5a4610)) {
      return _0x5a4610 + " 岁";
    } else {
      return "未知";
    }
  }
  function _0x201201(_0x404167) {
    const _0x1c9107 = _0x404167?.batchConfig || _0x404167 || {};
    if (_0x1c9107.ageFilterEnabled === false) {
      return {
        min: null,
        max: null
      };
    }
    const _0x1274fb = _0x1c9107.ageFilterEnabled === true;
    const _0x4bb47f = _0x1c9107.ageMin ?? _0x1c9107.targetAgeMin;
    const _0x60afb5 = _0x1c9107.ageMax ?? _0x1c9107.targetAgeMax;
    const _0x120601 = _0x4bb47f != null && _0x4bb47f !== "" ? Number(_0x4bb47f) : null;
    const _0x478747 = _0x60afb5 != null && _0x60afb5 !== "" ? Number(_0x60afb5) : null;
    let _0xbedfad = _0x120601 != null && (_0x1274fb ? _0x120601 >= 0 : _0x120601 > 0) ? _0x120601 : null;
    let _0x19ca78 = _0x478747 != null && (_0x1274fb ? _0x478747 >= 0 : _0x478747 > 0) ? _0x478747 : null;
    if (_0xbedfad != null && _0x19ca78 != null && _0xbedfad > _0x19ca78) {
      [_0xbedfad, _0x19ca78] = [_0x19ca78, _0xbedfad];
    }
    return {
      min: _0xbedfad,
      max: _0x19ca78
    };
  }
  function _0x2f2d17(_0x38eab0) {
    const {
      min: _0x2c5b6b,
      max: _0x696b01
    } = _0x201201(_0x38eab0);
    return _0x2c5b6b != null || _0x696b01 != null;
  }
  function _0x4c3312(_0x59fb3d, _0x48479c) {
    const {
      min: _0x49dd53,
      max: _0x51f761
    } = _0x201201(_0x48479c);
    if (_0x49dd53 == null && _0x51f761 == null) {
      return {
        pass: true
      };
    }
    const _0x58877e = Number(_0x59fb3d?.age);
    if (!Number.isFinite(_0x58877e)) {
      return {
        pass: true
      };
    }
    if (_0x49dd53 != null && _0x58877e < _0x49dd53) {
      return {
        pass: false,
        reason: "低于最小年龄（" + _0x58877e + "岁 < " + _0x49dd53 + "岁）"
      };
    }
    if (_0x51f761 != null && _0x58877e > _0x51f761) {
      return {
        pass: false,
        reason: "超过最大年龄（" + _0x58877e + "岁 > " + _0x51f761 + "岁）"
      };
    }
    return {
      pass: true
    };
  }
  function _0x2a3b79(_0x5cb489) {
    const _0x1b0461 = String(_0x5cb489 || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
    if (!_0x1b0461 || _0x1b0461.length > 40) {
      return true;
    }
    if (/抖音号|IP属地|关注|粉丝|获赞|私密账号|作品|喜欢|收藏/.test(_0x1b0461)) {
      return true;
    }
    try {
      const _0x40da77 = /\/user\/self(?:\/|$|\?)/i.test(String(location.pathname || ""));
      if (!_0x40da77) {
        const _0x124290 = new Set();
        const _0x45bd77 = _0x24da41 => {
          const _0x5ba85e = String(_0x24da41 || "").trim().replace(/^@+/, "");
          if (_0x5ba85e && _0x5ba85e.length >= 2 && _0x5ba85e.length <= 40) {
            _0x124290.add(_0x5ba85e);
          }
        };
        _0x45bd77(window._radar_account_name);
        _0x45bd77(_0x2c7585.currentTask?.nickname);
        _0x45bd77(_0x2c7585.currentTask?.name);
        _0x45bd77(_0x2c7585.currentTask?.lead?.accountName);
        if (_0x124290.has(_0x1b0461)) {
          return true;
        }
      }
    } catch (_0xfa7f58) {}
    return false;
  }
  function _0xb489a1() {
    const _0x490bab = ["[data-e2e=\"user-title\"]", ".user-info__name", "[class*=\"user-info\"] [class*=\"name\"]", "h1"];
    const _0x36ddb6 = String(_0x50d6b9["douyin.com"]?.profileName || "").split(",").map(_0x9557e7 => _0x9557e7.trim()).filter(Boolean);
    const _0x46c13e = [..._0x490bab, ..._0x36ddb6.filter(_0x3b7728 => !_0x490bab.includes(_0x3b7728))];
    const _0x10e1a7 = _0x311798 => {
      for (const _0x5d529e of _0x311798) {
        if (!_0x5d529e || typeof _0x503f79 === "function" && !_0x503f79(_0x5d529e)) {
          continue;
        }
        const _0x12a587 = String(_0x5d529e.innerText || _0x5d529e.textContent || "").replace(/\s+/g, " ").trim();
        if (_0x2a3b79(_0x12a587)) {
          continue;
        }
        try {
          const _0x1e2639 = _0x5d529e.getBoundingClientRect?.();
          if (_0x1e2639 && _0x1e2639.width > 0 && _0x1e2639.height > 0 && _0x1e2639.top < 56 && _0x1e2639.right > (window.innerWidth || 0) - 220) {
            continue;
          }
        } catch (_0x5e19bd) {}
        return _0x12a587.replace(/^@+/, "");
      }
      return "";
    };
    for (const _0x33ff9b of _0x46c13e) {
      try {
        const _0x465159 = _0x10e1a7(Array.from(document.querySelectorAll(_0x33ff9b)));
        if (_0x465159) {
          return _0x465159;
        }
      } catch (_0x3fba94) {}
    }
    try {
      const _0x195546 = _0x10e1a7(Array.from(document.querySelectorAll("[data-e2e=\"user-title\"], h1")));
      if (_0x195546) {
        return _0x195546;
      }
    } catch (_0x4fb2fd) {}
    return "";
  }
  function _0x4b1eee() {
    let _0x85c724 = "未知";
    let _0x4dc346 = null;
    try {
      const _0x21a822 = Array.from(document.querySelectorAll("span, p, div"));
      const _0x41ba86 = (_0x52d276, _0x1280d5 = "") => {
        const _0x570e99 = String(_0x52d276 || "").toLowerCase();
        const _0x3fdbc5 = String(_0x1280d5 || "");
        return _0x3fdbc5.includes("M8 1.25") || _0x570e99.includes("mars") || _0x570e99.includes("#168ef9") || _0x570e99.includes("rgb(22, 142, 249)") || _0x570e99.includes("rgb(22,142,249)");
      };
      const _0x5a29c1 = (_0x2aa4e2, _0x56aadc = "") => {
        const _0x15b3a1 = String(_0x2aa4e2 || "").toLowerCase();
        const _0x336bed = String(_0x56aadc || "");
        return _0x336bed.includes("M10.75 6.75") || _0x15b3a1.includes("venus") || _0x15b3a1.includes("#f5588e") || _0x15b3a1.includes("rgb(245, 88, 142)") || _0x15b3a1.includes("rgb(245,88,142)") || _0x15b3a1.includes("#fe2c55") || _0x15b3a1.includes("rgb(254, 44, 85)") || _0x15b3a1.includes("rgb(254,44,85)");
      };
      let _0x17fa16 = _0x21a822.find(_0x4c7149 => {
        const _0x18c114 = (_0x4c7149.innerText || "").trim();
        if (_0x18c114.length >= 20 || !_0x4c7149.querySelector("svg")) {
          return false;
        }
        const _0x5dff92 = _0x4c7149.querySelector("svg");
        const _0x54e6b1 = _0x5dff92?.outerHTML || "";
        const _0x480362 = _0x5dff92?.innerHTML || "";
        return _0x41ba86(_0x54e6b1, _0x480362) || _0x5a29c1(_0x54e6b1, _0x480362);
      });
      if (!_0x17fa16) {
        for (const _0x1c7b6c of Array.from(document.querySelectorAll("svg"))) {
          const _0x3ea770 = _0x1c7b6c.outerHTML || "";
          const _0x1f24f7 = _0x1c7b6c.innerHTML || "";
          if (_0x41ba86(_0x3ea770, _0x1f24f7)) {
            _0x85c724 = "男";
            break;
          }
          if (_0x5a29c1(_0x3ea770, _0x1f24f7)) {
            _0x85c724 = "女";
            break;
          }
        }
      }
      if (_0x17fa16) {
        const _0x40c4a6 = _0x17fa16.innerText || "";
        const _0x10bfd0 = _0x17fa16.querySelector("svg");
        const _0x107d46 = _0x10bfd0 ? _0x10bfd0.innerHTML : "";
        const _0x4ce146 = _0x10bfd0 ? _0x10bfd0.outerHTML : "";
        if (_0x40c4a6.includes("男")) {
          _0x85c724 = "男";
        } else if (_0x40c4a6.includes("女")) {
          _0x85c724 = "女";
        } else if (_0x41ba86(_0x4ce146, _0x107d46)) {
          _0x85c724 = "男";
        } else if (_0x5a29c1(_0x4ce146, _0x107d46)) {
          _0x85c724 = "女";
        }
        const _0x1c994c = _0xc144bc(_0x40c4a6);
        if (_0x1c994c != null) {
          _0x4dc346 = _0x1c994c;
        }
      }
      if (_0x4dc346 == null) {
        const _0x2b6376 = _0x21a822.find(_0x424542 => /^\d{1,2}岁$/.test((_0x424542.innerText || "").trim()));
        if (_0x2b6376) {
          const _0x326394 = _0xc144bc(_0x2b6376.innerText);
          if (_0x326394 != null) {
            _0x4dc346 = _0x326394;
          }
        }
      }
    } catch (_0x2c8bbc) {}
    return {
      gender: _0x85c724,
      age: _0x4dc346
    };
  }
  async function _0x46a73d(_0x1fb357 = {}) {
    const _0x14442b = _0x8f570d(_0x1fb357.genderFilter || "all", "all");
    const _0x483d73 = _0x14442b !== "all";
    const _0x26e8b5 = _0x483d73 ? Math.max(8000, Number(_0x1fb357.genderWaitMs) || 12000) : Math.max(2000, Number(_0x1fb357.genderWaitMs) || 2500);
    const _0x9f283f = _0x483d73 ? 450 : 800;
    const _0x1dfc4f = Date.now();
    let _0x198efb = {
      gender: "未知",
      age: null,
      genderSource: "dom"
    };
    let _0x9a26fd = 0;
    let _0x4e471d = false;
    while (Date.now() - _0x1dfc4f < _0x26e8b5) {
      if (_0x1fb357.loopId && _0x1b8f97(_0x1fb357.loopId)) {
        break;
      }
      _0x9a26fd += 1;
      const _0x1d3d5a = _0xd7d9df();
      if (_0x1d3d5a) {
        const _0x1420ba = Date.now() - _0x1dfc4f;
        console.log("[Built-in-Debug] 性别识别成功(API): " + _0x1d3d5a.gender + ("（code=" + (_0x1d3d5a.genderCode ?? "-") + "，第 " + _0x9a26fd + " 次，") + ("耗时 " + (_0x1420ba / 1000).toFixed(1) + "s，来源=" + (_0x1d3d5a.source || "api") + "，") + ("筛选=" + _0x51191c(_0x14442b) + "）"));
        return {
          gender: _0x1d3d5a.gender || "未知",
          age: _0x1d3d5a.age ?? null,
          genderSource: _0x1d3d5a.source || "api",
          genderTimedOut: false,
          genderWaitMs: _0x1420ba,
          genderFromApi: true
        };
      }
      if (_0x483d73 && !_0x4e471d && Date.now() - _0x1dfc4f >= 800) {
        _0x4e471d = true;
        await _0x4f7694();
        const _0x42efa8 = _0xd7d9df();
        if (_0x42efa8) {
          const _0xdab6a9 = Date.now() - _0x1dfc4f;
          console.log("[Built-in-Debug] 性别识别成功(API拉取): " + _0x42efa8.gender + ("（code=" + (_0x42efa8.genderCode ?? "-") + "，耗时 " + (_0xdab6a9 / 1000).toFixed(1) + "s，") + ("筛选=" + _0x51191c(_0x14442b) + "）"));
          return {
            gender: _0x42efa8.gender || "未知",
            age: _0x42efa8.age ?? null,
            genderSource: "api_fetch",
            genderTimedOut: false,
            genderWaitMs: _0xdab6a9,
            genderFromApi: true
          };
        }
      }
      _0x198efb = {
        ..._0x4b1eee(),
        genderSource: "dom"
      };
      if (_0x198efb.gender !== "未知") {
        console.log("[Built-in-Debug] 性别识别成功(DOM): " + _0x198efb.gender + ("（第 " + _0x9a26fd + " 次，耗时 " + ((Date.now() - _0x1dfc4f) / 1000).toFixed(1) + "s，筛选=" + _0x51191c(_0x14442b) + "）"));
        return {
          ..._0x198efb,
          genderTimedOut: false,
          genderWaitMs: Date.now() - _0x1dfc4f,
          genderFromApi: false
        };
      }
      if (!_0x483d73 && _0x9a26fd >= 3) {
        break;
      }
      await _0x37707b(_0x9f283f);
    }
    const _0x43a192 = ((Date.now() - _0x1dfc4f) / 1000).toFixed(1);
    if (_0x483d73) {
      console.warn("[Built-in-Debug] 性别等待 " + _0x43a192 + "s 仍未知（筛选=" + _0x51191c(_0x14442b) + "，API未命中），若主页稍后才刷出女标，可能被「男+未知」误放行——请以本条日志排查");
    }
    return {
      ..._0x198efb,
      genderTimedOut: _0x483d73 && _0x198efb.gender === "未知",
      genderWaitMs: Date.now() - _0x1dfc4f,
      genderFromApi: false
    };
  }
  async function _0x57802f(_0x184b3c = {}) {
    const _0x5b9a39 = {
      nickname: "",
      douyinId: "",
      signature: "",
      contact: "",
      location: "",
      gender: "未知",
      age: null,
      isPrivate: false,
      genderTimedOut: false,
      genderWaitMs: 0,
      genderSource: "",
      genderFromApi: false
    };
    try {
      try {
        const _0x43650d = Array.from(document.querySelectorAll("span, p, div")).find(_0x43695d => _0x43695d.innerText?.trim() === "私密账号");
        if (_0x43650d) {
          _0x5b9a39.isPrivate = true;
        }
      } catch (_0x433e1f) {}
      if (!_0x5b9a39.nickname) {
        _0x5b9a39.nickname = _0xb489a1();
      }
      const _0xee5aaa = await _0x46a73d({
        genderFilter: _0x184b3c.genderFilter || "all",
        genderWaitMs: _0x184b3c.genderWaitMs,
        loopId: _0x184b3c.loopId
      });
      _0x5b9a39.gender = _0xee5aaa.gender || "未知";
      if (_0xee5aaa.age != null) {
        _0x5b9a39.age = _0xee5aaa.age;
      }
      _0x5b9a39.genderTimedOut = !!_0xee5aaa.genderTimedOut;
      _0x5b9a39.genderWaitMs = Number(_0xee5aaa.genderWaitMs) || 0;
      _0x5b9a39.genderSource = _0xee5aaa.genderSource || (_0xee5aaa.genderFromApi ? "api" : "dom");
      _0x5b9a39.genderFromApi = !!_0xee5aaa.genderFromApi;
      try {
        const _0x4f8737 = Array.from(document.querySelectorAll("span, p, div"));
        if (_0x5b9a39.age == null) {
          const _0x3d7feb = _0x4f8737.find(_0xbb42d2 => /^\d{1,2}岁$/.test((_0xbb42d2.innerText || "").trim()));
          if (_0x3d7feb) {
            const _0x130150 = _0xc144bc(_0x3d7feb.innerText);
            if (_0x130150 != null) {
              _0x5b9a39.age = _0x130150;
            }
          }
        }
        const _0x46e2c1 = _0x4f8737.find(_0x5b0b03 => _0x5b0b03.innerText?.includes("抖音号：") && _0x5b0b03.innerText?.length < 30);
        if (_0x46e2c1) {
          _0x5b9a39.douyinId = _0x46e2c1.innerText.replace("抖音号：", "").trim();
        }
        const _0x5291bd = _0x4f8737.find(_0x2cec50 => _0x2cec50.innerText?.includes("IP属地：") && _0x2cec50.innerText?.length < 20);
        if (_0x5291bd) {
          _0x5b9a39.location = _0x5291bd.innerText.replace("IP属地：", "").trim();
        }
        const _0x54429f = document.querySelector("[class*=\"signature\"]") || document.querySelector("[class*=\"desc\"]") || _0x4f8737.find(_0x2a679e => _0x2a679e.className?.includes("yvX7_5G1"));
        if (_0x54429f) {
          _0x5b9a39.signature = _0x54429f.innerText.trim();
        }
        if (!_0x5b9a39.nickname) {
          _0x5b9a39.nickname = _0xb489a1();
        }
        const _0x4b4cff = (_0x5b9a39.nickname + " " + _0x5b9a39.signature + " " + document.body.innerText.substring(0, 1000)).toLowerCase();
        const _0x2151fc = _0x4b4cff.match(/1[3-9]\d{9}/);
        const _0x554966 = _0x4b4cff.match(/(?:vx|v|微|wechat|➕|🛰️)[:：]?\s*([a-zA-Z0-9_-]{5,20})/);
        const _0xde48dc = [];
        if (_0x2151fc) {
          _0xde48dc.push("手机: " + _0x2151fc[0]);
        }
        if (_0x554966 && !_0x554966[1].includes("http")) {
          _0xde48dc.push("微信: " + _0x554966[1]);
        }
        _0x5b9a39.contact = _0xde48dc.join(" | ");
      } catch (_0x1adb02) {
        console.warn("[主页信息提取] 异常:", _0x1adb02.message);
      }
      if (!_0x5b9a39.nickname) {
        _0x5b9a39.nickname = _0xb489a1();
      }
      try {
        const _0x16d108 = _0x573709();
        if (_0x16d108 !== null && _0x16d108 !== undefined) {
          _0x5b9a39.worksCount = _0x16d108;
          if (_0x16d108 === 0) {
            _0x5b9a39.noWorks = true;
          }
        }
      } catch (_0x2f4aee) {}
      const _0x5de7e8 = _0x8f570d(_0x184b3c.genderFilter || "all", "all");
      const _0x333a96 = !!_0x5b9a39.douyinId || !!_0x5b9a39.location || !!_0x5b9a39.nickname && _0x5b9a39.worksCount != null;
      _0x5b9a39.genderUnresolved = _0x5de7e8 !== "all" && _0x5b9a39.gender === "未知" && !!_0x5b9a39.genderTimedOut && !_0x333a96;
      console.log("[Built-in-Debug] [详细信息提取] 昵称: " + (_0x5b9a39.nickname || "-") + ", 抖音号: " + (_0x5b9a39.douyinId || "-") + "," + (" 性别: " + _0x5b9a39.gender + (_0x5b9a39.genderTimedOut ? "(等待超时)" : "")) + ("" + (_0x5b9a39.genderUnresolved ? "(未就绪)" : "")) + ((_0x5b9a39.genderSource ? "(" + _0x5b9a39.genderSource + ")" : "") + ",") + (" 年龄: " + (_0x5b9a39.age != null ? _0x5b9a39.age + "岁" : "未知") + ", 作品数: " + (_0x5b9a39.worksCount ?? "未知") + ",") + (" 私密: " + (_0x5b9a39.isPrivate ? "是" : "否") + ", 联系方式: " + (_0x5b9a39.contact || "-")));
    } catch (_0x5d5bd2) {
      console.warn("[子视图] 详细信息采集异常:", _0x5d5bd2.message);
    }
    if (_0x5b9a39.age == null) {
      _0x5b9a39.age = 0;
    }
    _0x5b9a39.profileAgeChecked = true;
    return _0x5b9a39;
  }
  function _0x4e2178() {
    return {
      createdAt: Date.now(),
      stackHits: 0,
      flipCount: 0,
      lastScrollY: window.scrollY || document.documentElement.scrollTop || 0,
      lastDirection: 0,
      recovering: false,
      lastDiagnostics: null
    };
  }
  function _0x4adba4() {
    const _0x293d75 = window.innerHeight || 800;
    const _0x442fe7 = window.innerWidth || 1200;
    const _0x46cf33 = _0x314d49 => _0x314d49.bottom > 20 && _0x314d49.top < _0x293d75 - 20 && _0x314d49.right > 20 && _0x314d49.left < _0x442fe7 - 20;
    const _0x5e477c = Array.from(document.querySelectorAll("video")).filter(_0x1f28f8 => {
      if (!_0x503f79(_0x1f28f8)) {
        return false;
      }
      const _0x32760b = _0x1f28f8.getBoundingClientRect();
      return _0x46cf33(_0x32760b);
    }).map(_0x350388 => {
      const _0x410f52 = _0x350388.getBoundingClientRect();
      return {
        paused: !!_0x350388.paused,
        top: Math.round(_0x410f52.top),
        height: Math.round(_0x410f52.height),
        width: Math.round(_0x410f52.width),
        area: Math.round(_0x410f52.width * _0x410f52.height),
        large: _0x410f52.height >= _0x293d75 * 0.42 && _0x410f52.width >= _0x442fe7 * 0.35
      };
    }).sort((_0x238a68, _0x3bf16e) => _0x3bf16e.area - _0x238a68.area);
    const _0x442e9e = _0x5e477c.filter(_0x178eba => _0x178eba.large);
    const _0x4a56ae = _0x442e9e.filter(_0x296452 => !_0x296452.paused);
    const _0x3ddfdd = Array.from(document.querySelectorAll("[data-e2e=\"video-player-container\"], [data-e2e=\"video-detail-container\"], [class*=\"video-player\"], [class*=\"VideoPlayer\"]")).filter(_0x1cb3bf => {
      if (!_0x503f79(_0x1cb3bf)) {
        return false;
      }
      const _0xa38b42 = _0x1cb3bf.getBoundingClientRect();
      return _0x46cf33(_0xa38b42) && _0xa38b42.height >= _0x293d75 * 0.36 && _0xa38b42.width >= _0x442fe7 * 0.32;
    });
    return {
      url: window.location.href,
      scrollY: window.scrollY || document.documentElement.scrollTop || 0,
      visibleVideoCount: _0x5e477c.length,
      largeVideoCount: _0x442e9e.length,
      playingLargeVideoCount: _0x4a56ae.length,
      detailContainerCount: _0x3ddfdd.length,
      stackLike: _0x442e9e.length >= 2 || _0x4a56ae.length >= 2,
      videos: _0x5e477c.slice(0, 4)
    };
  }
  function _0x49c7f3(_0x4ab4ea) {
    const _0x403343 = _0x4adba4();
    _0x4ab4ea.lastDiagnostics = _0x403343;
    if (_0x403343.stackLike) {
      _0x4ab4ea.stackHits += 1;
    } else {
      _0x4ab4ea.stackHits = Math.max(0, _0x4ab4ea.stackHits - 1);
    }
    const _0x258aa7 = _0x403343.scrollY - _0x4ab4ea.lastScrollY;
    if (Math.abs(_0x258aa7) >= 60) {
      const _0x52be93 = _0x258aa7 > 0 ? 1 : -1;
      if (_0x4ab4ea.lastDirection && _0x52be93 !== _0x4ab4ea.lastDirection) {
        _0x4ab4ea.flipCount += 1;
      } else {
        _0x4ab4ea.flipCount = Math.max(0, _0x4ab4ea.flipCount - 1);
      }
      _0x4ab4ea.lastDirection = _0x52be93;
      _0x4ab4ea.lastScrollY = _0x403343.scrollY;
    }
    const _0x39d86c = Date.now() - _0x4ab4ea.createdAt;
    const _0x31c8b7 = _0x4ab4ea.stackHits >= 3;
    const _0x50a412 = _0x39d86c > 2000 && _0x4ab4ea.flipCount >= 4;
    return {
      diagnostics: _0x403343,
      stuck: _0x31c8b7 || _0x50a412,
      reason: _0x31c8b7 ? "检测到 " + _0x403343.largeVideoCount + " 个大视频同时可见" : _0x50a412 ? "检测到页面多次上下滑动" : ""
    };
  }
  async function _0x50fbd7(_0x2b3c59, _0x4dff11, _0x212d3d, _0x398b87, _0x528d73) {
    if (_0x528d73?.recovering) {
      return {
        pendingNavigation: true,
        reason: _0x398b87
      };
    }
    if (_0x528d73) {
      _0x528d73.recovering = true;
    }
    console.warn("[养号预热] " + _0x398b87 + "，判定预热页面可能卡住，准备重新进入用户主页");
    _0x31951d("养号预热疑似卡住：" + _0x398b87 + "，正在重新进入主页...", _0x212d3d?.lead?.accountId);
    _0x350801("养号预热自愈：" + _0x398b87 + "，重新进入用户主页后继续后续动作", _0x212d3d?.lead?.accountId, "warning");
    try {
      await _0x40180a(_0x4dff11);
      await _0x37707b(800);
    } catch (_0x305cf1) {}
    if (!_0x2b3c59) {
      console.warn("[养号预热] 缺少用户主页 URL，无法重新进入页面，只能跳过本次预热");
      return {
        pendingNavigation: false,
        recovered: false,
        reason: _0x398b87
      };
    }
    if (_0x212d3d) {
      _0x20af8b(_0x212d3d, {
        __warmupRestored: true,
        enableWarmup: false
      });
    }
    window.location.href = _0x2b3c59;
    return {
      pendingNavigation: true,
      reason: _0x398b87
    };
  }
  async function _0xbb8e84(_0x585f9a, _0x4b5ea7, _0x1e4ee0, _0xc5e156, _0x33d67b) {
    const _0x121c90 = _0x49c7f3(_0x585f9a);
    if (!_0x121c90.stuck) {
      return null;
    }
    const _0x41a2ed = _0x121c90.diagnostics?.videos?.map(_0x353ab6 => "top=" + _0x353ab6.top + ",h=" + _0x353ab6.height + ",paused=" + _0x353ab6.paused).join(" | ");
    const _0xb9553f = _0x33d67b + "：" + _0x121c90.reason + (_0x41a2ed ? "（" + _0x41a2ed + "）" : "");
    return _0x50fbd7(_0x4b5ea7, _0x1e4ee0, _0xc5e156, _0xb9553f, _0x585f9a);
  }
  async function _0x5a7bfa(_0x3e2ee5, _0xe80f1c, _0x1f3933, _0x50ba09, _0xc21a1c) {
    const _0x26ca2c = Date.now() + _0x3e2ee5;
    while (Date.now() < _0x26ca2c) {
      if (_0x1b8f97(_0x50ba09)) {
        throw new Error("TASK_ABORTED");
      }
      const _0x3f9547 = await _0xbb8e84(_0xe80f1c, _0x1f3933, _0x50ba09, _0xc21a1c, "观看预热视频时");
      if (_0x3f9547?.pendingNavigation) {
        return _0x3f9547;
      }
      await _0x37707b(Math.min(700, Math.max(120, _0x26ca2c - Date.now())));
    }
    return null;
  }
  async function _0x2e48b0(_0x3ed74a, _0x8f9235 = {}) {
    try {
      const _0xe3dfe0 = _0x8f9235.lead || _0x2c7585.currentTask?.lead || {};
      const _0x3544dd = _0x8f9235.resumeTask !== undefined ? _0x8f9235.resumeTask : _0x3ed74a === "BATCH" ? null : _0x2c7585.currentTask || null;
      const _0x5dfd03 = _0x5c2671(_0x8f9235.profileUrl || _0xe3dfe0.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
      const _0x12fe67 = _0x4e2178();
      await _0x37707b(1500);
      const _0x4bd87e = await _0x3bc2e8(_0x3ed74a, 10000);
      if (_0x4bd87e.noWorks) {
        console.log("%c[养号预热] 该用户作品数为 0，跳过预热环节", "color: #94a3b8; font-style: italic;");
        return;
      }
      const _0x1ccbe7 = _0x120eff();
      const _0x3968d7 = _0x1ccbe7.length;
      if (_0x3968d7 === 0) {
        console.log("%c[养号预热] 该用户暂无公开作品或作品不可见，跳过预热环节", "color: #94a3b8; font-style: italic;");
        return;
      }
      const _0x4f9743 = Math.min(5, _0x3968d7);
      const _0x21038e = Math.random() > 0.5 ? 2 : 1;
      const _0x1a4f0b = Math.min(_0x21038e, _0x3968d7);
      console.log("%c[节奏控制] 检测到 " + _0x3968d7 + " 个公开作品，准备随机浏览其中的 " + _0x1a4f0b + " 个", "color: #fff; background: #06b6d4; padding: 2px 4px; border-radius: 2px;");
      const _0x4e0f0b = [];
      const _0x1bed03 = _0x1ccbe7.slice(0, _0x4f9743);
      while (_0x4e0f0b.length < _0x1a4f0b) {
        const _0x1db342 = Math.floor(Math.random() * _0x1bed03.length);
        if (!_0x4e0f0b.includes(_0x1db342)) {
          _0x4e0f0b.push(_0x1db342);
        }
      }
      for (const _0x3a8f66 of _0x4e0f0b) {
        const _0x4aeca7 = _0x1ccbe7[_0x3a8f66];
        console.log("%c[拟人操作] 正在进入第 " + (_0x3a8f66 + 1) + " 个视频进行“深度阅读”", "color: #67e8f9; font-style: italic;");
        await _0x2e0904(_0x4aeca7, _0x3ed74a);
        await _0xad73ac(2000, 4000, _0x3ed74a, "等待视频加载");
        const _0x5073e7 = await _0xbb8e84(_0x12fe67, _0x5dfd03, _0x3ed74a, _0x3544dd, "打开预热视频后");
        if (_0x5073e7?.pendingNavigation) {
          return _0x5073e7;
        }
        const _0x12a637 = Math.floor(Math.random() * 3000) + 3000;
        console.log("%c[拟人操作] 模拟播放观看中 (" + _0x12a637 + "ms)...", "color: #67e8f9; font-style: italic;");
        const _0x5e1284 = await _0x5a7bfa(_0x12a637, _0x12fe67, _0x5dfd03, _0x3ed74a, _0x3544dd);
        if (_0x5e1284?.pendingNavigation) {
          return _0x5e1284;
        }
        const _0x16e84b = Math.random() > 0.4;
        if (Math.random() > 0.3) {
          console.log("%c[拟人操作] 对预热视频执行随机" + (_0x16e84b ? "点赞" : "收藏"), "color: #67e8f9; font-style: italic;");
          const _0x174eb9 = {
            simulateHumanClick: _0x2e0904,
            randomDelay: _0xad73ac,
            isVisibleElement: _0x503f79,
            getVideoEngagePack: _0xc6fb9b
          };
          if (_0x16e84b) {
            await likeCurrentVideoSideAction(_0x3ed74a, _0x174eb9);
          } else {
            await collectCurrentVideoSideAction(_0x3ed74a, _0x174eb9);
          }
          await _0xad73ac(1000, 2000, _0x3ed74a);
        }
        await _0x40180a(_0x3ed74a);
        await _0xad73ac(1000, 1500, _0x3ed74a);
        const _0x9da56b = await _0xbb8e84(_0x12fe67, _0x5dfd03, _0x3ed74a, _0x3544dd, "关闭预热视频后");
        if (_0x9da56b?.pendingNavigation) {
          return _0x9da56b;
        }
      }
      await _0x40180a(_0x3ed74a);
      try {
        document.querySelectorAll("video").forEach(_0x5975ff => {
          if (!_0x5975ff.paused) {
            console.log("[节奏控制] 预热结束，检测到有残留视频播放，已执行静音暂停");
            _0x5975ff.pause();
          }
        });
      } catch (_0x49b64f) {}
      console.log("%c[节奏控制] 养号预热环节结束，开始主体互动", "color: #22d3ee; font-style: italic;");
      return {
        pendingNavigation: false
      };
    } catch (_0x4495eb) {
      console.warn("[子视图] 养号互动异常:", _0x4495eb.message);
      return {
        pendingNavigation: false,
        error: _0x4495eb.message
      };
    }
  }
  function _0x194dae(_0x320b3c = {}) {
    const _0xa7ee88 = Number(_0x320b3c.randomLikeProbability ?? 50);
    if (Number.isFinite(_0xa7ee88)) {
      return Math.min(100, Math.max(0, Math.round(_0xa7ee88)));
    } else {
      return 50;
    }
  }
  async function _0xe23269(_0x989d85, _0x7efab3 = {}) {
    return _0x37c163(async () => {
      const _0x20235e = _0x7efab3.lead || _0x2c7585.currentTask?.lead || {};
      try {
        const _0x3fa1b0 = _0x7efab3.config || _0x2c7585.currentTask || {};
        const _0x22151b = _0x7efab3.resumeTask !== undefined ? _0x7efab3.resumeTask : _0x989d85 === "BATCH" ? null : _0x2c7585.currentTask || null;
        const _0x536d43 = _0x5c2671(_0x7efab3.profileUrl || _0x20235e.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
        const _0x1cf050 = _0x194dae(_0x3fa1b0);
        const _0x2cda0f = Math.floor(Math.random() * 100) + 1;
        if (_0x2cda0f > _0x1cf050) {
          const _0x3cf686 = "作品点赞概率判断：随机值 " + _0x2cda0f + "，命中区间 1-" + _0x1cf050 + "（" + _0x1cf050 + "%）；未命中，仅跳过本条线索的作品点赞，后续跟进继续";
          console.log("[作品点赞] " + _0x3cf686);
          _0x31951d(_0x3cf686, _0x20235e.accountId);
          return;
        }
        const _0x1538c9 = "作品点赞概率判断：随机值 " + _0x2cda0f + "，命中区间 1-" + _0x1cf050 + "（" + _0x1cf050 + "%）；已命中，准备随机选择 1 个作品点赞";
        console.log("[作品点赞] " + _0x1538c9);
        _0x31951d(_0x1538c9, _0x20235e.accountId);
        await _0x37707b(1500);
        const _0x43bd5d = await _0x3bc2e8(_0x989d85, 8000);
        if (_0x43bd5d.noWorks) {
          const _0x8b1c93 = "作品点赞：该用户作品数为 0，本条不执行点赞，后续跟进继续";
          console.log("[作品点赞] " + _0x8b1c93);
          _0x31951d(_0x8b1c93, _0x20235e.accountId);
          return;
        }
        const _0x3fdcc0 = _0x120eff();
        const _0x5d786b = _0x3fdcc0.length;
        if (_0x5d786b === 0) {
          const _0x2137b9 = "作品点赞：该用户暂无公开作品，本条不执行点赞，后续跟进继续";
          console.log("[作品点赞] " + _0x2137b9);
          _0x31951d(_0x2137b9, _0x20235e.accountId);
          return;
        }
        const _0xc73750 = Math.floor(Math.random() * _0x5d786b);
        const _0x1e622a = _0x3fdcc0[_0xc73750];
        const _0x25d398 = "作品点赞：已从 " + _0x5d786b + " 个作品中随机选择第 " + (_0xc73750 + 1) + " 个，正在打开";
        console.log("%c[作品点赞] " + _0x25d398, "color: #ff007f; font-weight: bold;");
        _0x31951d(_0x25d398, _0x20235e.accountId);
        _0x350801("👍 " + (_0x989d85 === "BATCH" ? "批量任务" : "主页跟进") + "：准备点赞随机选中的第 " + (_0xc73750 + 1) + " 个作品", _0x20235e.accountId);
        await _0x9922d7(_0x1e622a, _0x989d85, "打开随机点赞作品");
        await _0xad73ac(2000, 4000, _0x989d85, "等待视频加载");
        const _0x26fdda = getVideoEngageSelector({
          getVideoEngagePack: _0xc6fb9b
        }, "likeSelectors");
        const _0x56c441 = _0x26fdda ? document.querySelector(_0x26fdda) : null;
        if (_0x56c441) {
          const _0x41cddf = _0x56c441.closest("div[role=\"button\"]") || _0x56c441.closest("button") || _0x56c441;
          const _0x32e4a9 = "作品点赞：正在点击点赞按钮";
          console.log("%c[作品点赞] " + _0x32e4a9, "color: #ff007f; font-style: italic;");
          _0x31951d(_0x32e4a9, _0x20235e.accountId);
          await _0x9922d7(_0x41cddf, _0x989d85, "随机作品点赞");
          await _0xad73ac(1200, 2000, _0x989d85);
          _0x31951d("作品点赞：随机选中的第 " + (_0xc73750 + 1) + " 个作品已点赞", _0x20235e.accountId);
        } else {
          const _0x2fd923 = "作品点赞：未找到点赞按钮，本次未执行点赞";
          console.warn("[作品点赞] " + _0x2fd923);
          _0x31951d(_0x2fd923, _0x20235e.accountId);
        }
        await _0x40180a(_0x989d85);
        await _0xad73ac(1000, 1500, _0x989d85);
      } catch (_0x573d78) {
        const _0x2427fc = "作品点赞：执行异常，本次未完成点赞（" + _0x573d78.message + "）";
        console.error("[作品点赞] " + _0x2427fc, _0x573d78);
        _0x31951d(_0x2427fc, _0x20235e.accountId);
      }
    });
  }
  return {
    appendRandomEmojiSuffix: _0x5e12ec,
    applyFollowUpActions: _0x50ffba,
    applyRiskyEmojiReplaceForComment: _0xe3ef96,
    bootPendingSubviewTask: _0xde2405,
    checkBatchAgeFilter: _0x4c3312,
    classifyCommentFailureToastLocal: _0xed4a41,
    closeAllModals: _0x40180a,
    commentDraftHasCoreTextLocal: _0xe9b961,
    evaluateTaskGenderFilter: _0x2b0062,
    extractUserIdFromUrl: _0x3456c2,
    findProfileFollowButtonByText: _0x382d10,
    findProfileMessageButtonByText: _0x11c55e,
    findSmartElementQuiet: _0x3326e2,
    formatAgeFilterRangeLabel: _0x11f1e6,
    formatObservedAgeLabel: _0x5c1281,
    getElementClassText: _0x31a7b6,
    isBatchAgeFilterActive: _0x2f2d17,
    isCommentDraftOnlyEmojiDriftLocal: _0x1d1955,
    isRejectedProfileNicknameCandidate: _0x2a3b79,
    parseProfileGenderFromApiPayload: _0x2305cc,
    performProfileActionsLogic: _0x20e4ce,
    rememberProfileApiGenderHit: _0x11e411,
    replaceRiskyCommentEmojisLocal: _0x23a5dd,
    resolveFollowUpFlags: _0x26e367,
    resolveProfileFirstGenderFilter: _0x1025ab,
    resolveTaskGenderFilter: _0x11a922,
    scrapeDetailedProfile: _0x57802f,
    shouldAppendCommentRandomSuffix: _0x1b09bc,
    shouldAppendVideoCommentRandomSuffix: _0x37daa3,
    waitForSmartElement: _0x446522
  };
}
module.exports = {
  createProfileInteractionController: createProfileInteractionController
};
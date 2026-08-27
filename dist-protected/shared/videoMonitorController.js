const {
  classifyDouyinAuthorIdentity,
  resolveDouyinAuthorIdentityKey
} = require("./douyinAuthorUrl");
const {
  extractDouyinCommentCidFromNode
} = require("./douyinCommentCid");
const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
const {
  filterDouyinCommentContentLines,
  pickDouyinCommentLineText,
  resolveDouyinCommentBodyText,
  isUnusableCommentBodyText,
  isDouyinCommentActionChromeText
} = require("./douyinCommentContentLines");
function createVideoMonitorController(_0x37a1ad = {}) {
  const {
    PLATFORM_SELECTORS: _0x4a39d8,
    awaitFeedVideoSwitchSettled: _0x4c10c9,
    buildEntityCommentScraperDeps: _0x565d44,
    checkBatchAgeFilter: _0xd91b3a,
    clickCommentPanelLoadingPlaceholder: _0x15676e,
    closeAllModals: _0x5c2c6f,
    convertToDouyinModalUrl: _0x150161,
    describeProfileNoWorksReason: _0x58aeb1,
    describeProfileWorksNotReadyReason: _0xebf437,
    describeReplyEnvironment: _0x1e5e87,
    ensureCommentPanelOpen: _0x342015,
    ensureProfileWorksTab: _0x5c8776,
    ensureSpecificVideoApiHook: _0x3f7df9,
    evaluateSpecificVideoOpenProgress: _0x3b16ef,
    evaluateTaskGenderFilter: _0xf88759,
    expandReplies: _0x484c54,
    extractSpecificVideoId: _0xb26a14,
    extractUserKeyFromUrl: _0x38314b,
    extractVideoIdFromHref: _0xfc142b,
    findCommentScrollContainer: _0x54568e,
    findProfileFollowButtonByText: _0x3214ea,
    findProfileVideoCards: _0x46e228,
    findSmartElementQuiet: _0xb0db56,
    formatAgeFilterRangeLabel: _0x5c9ebc,
    formatObservedAgeLabel: _0x541d0e,
    getCommentEndHintText: _0x3d5d80,
    getCommentScrollMetrics: _0x336234,
    getCommentTabPrefix: _0x2e34d4,
    getCommentV2String: _0x169b8b,
    getCommentsTotalCount: _0x149fad,
    getDouyinFeedScope: _0x26fde2,
    getEntityCommentScraperModule: _0x54fe96,
    getFeedVideoIdentity: _0xc0a38a,
    getProfilePostListRoot: _0x3a29db,
    getVideoAuthorInfo: _0x525faa,
    getVideoAuthorNickname: _0xb049ea,
    getVideoAuthorProfileUrl: _0x4c9dba,
    getVideoIdFromPageUrl: _0xa8f20d,
    getVideoEngagePack: _0x2758ee,
    getVideoStats: _0x3068f3,
    getVideoTitle: _0x446071,
    handleGlobalAutomationPopupsAndSecurity: _0x3297b4,
    hasSpecificVideoTargetInUrl: _0x5b1fbe,
    ipcRenderer: _0x47cc4f,
    isBatchAgeFilterActive: _0x787c76,
    isCommentPanelContentLoading: _0x1cda08,
    isCurrentVideoPauseGuardDrifted: _0x185b80,
    isOnSpecificTargetVideo: _0x48eadc,
    isSpecificVideoDetailReady: _0x32ff66,
    isViewingDouyinVideoPage: _0x23a3bb,
    isVisibleElement: _0x18c19c,
    lookupSpecificVideoApiProbe: _0x2c3369,
    moveToNextVideo: _0x54a462,
    normalizeSpecificVideoKey: _0x4d7a8c,
    normalizeUrl: _0x5e30db,
    parseLocalizedCountText: _0x1174eb,
    parseProfileWorksCount: _0x2a9d67,
    pauseVisibleDouyinVideos: _0x32621a,
    performLike: _0x576202,
    performProfileActionsLogic: _0x5d1418,
    performProfileFirstWorkComment: _0x4956b1,
    performReply: _0x3b5af6,
    postVideoComment: _0x58324c,
    hasVideoMainCommented: _0x3e8c5d,
    initVideoMainCommentMemoryFromTask: _0x3c0924,
    pruneStaleCommentDom: _0x4c354c,
    queryCommentItemNodes: _0x3019e5,
    randomDelay: _0x22333c,
    reportCurrentAction: _0x1cbac,
    reportMonitorActionProgress: _0xdf061f,
    reportTraceLog: _0x336b2f,
    resolveCommentPanelRoot: _0x41f3c3,
    resolveCurrentVisibleVideoUrl: _0x84a7a3,
    resolveDouyinVideoDetailModal: _0x2e5c6f,
    safeSessionGet: _0x2d3c03,
    saveSpecificVideoState: _0x3bae7b,
    scrapeDetailedProfile: _0x106278,
    shouldAbort: _0x414526,
    shouldExpandFoldedCommentReplies: _0x563e15,
    simulateHumanClick: _0x328f21,
    simulateTrustedElementClick: _0x5da649,
    sleep: _0x5bcced,
    startCurrentVideoPauseGuard: _0x50d391,
    syncCommentAttachmentRotationFromBatchStorage: _0x137710,
    toSpecificVideoJingxuanUrl: _0x5324d7,
    waitForCommentDomWarmup: _0x566c52,
    waitForProfileVideoDetailScope: _0x23cec6,
    waitForProfileWorksReady: _0x2e7c53,
    waitForSmartElement: _0xbaefde,
    waitForVideoDetailReadyAndPause: _0x3d6401,
    waitSpecificVideoNavAppear: _0x35bd5d,
    preloadDir: _0x480b9c,
    state: _0x35732d
  } = _0x37a1ad;
  if (!_0x35732d) {
    throw new TypeError("createVideoMonitorController requires a runtime state bridge");
  }
  let _0x18c9a3;
  function _0x5c14d4() {
    if (_0x18c9a3 !== undefined) {
      return _0x18c9a3;
    }
    const _0x1cda1c = (() => {
      try {
        return require("path");
      } catch (_0x33d5df) {
        return null;
      }
    })();
    const _0x3fbd35 = ["./commentTime", "./commentTime.js"];
    if (_0x1cda1c && typeof _0x480b9c === "string") {
      _0x3fbd35.push(_0x1cda1c.join(_0x480b9c, "shared", "commentTime.js"), _0x1cda1c.join(_0x480b9c, "shared", "commentTime"), _0x1cda1c.join(_0x480b9c, "..", "shared", "commentTime.js"));
    }
    for (const _0x419159 of _0x3fbd35) {
      try {
        _0x18c9a3 = require(_0x419159);
        return _0x18c9a3;
      } catch (_0x18f988) {}
    }
    _0x18c9a3 = null;
    return _0x18c9a3;
  }
  const _0x2e7c89 = ["[class*=\"reply-container\"]", "[class*=\"reply-list\"]", "[class*=\"ReplyContainer\"]", "[class*=\"ReplyList\"]", "[class*=\"sub-comment\"]", "[class*=\"SubComment\"]", "[class*=\"subComment\"]", "[data-e2e=\"comment-reply-item\"]", "[data-e2e=\"comment-reply-list\"]", "div[class*=\"reply-item\"]", "div[class*=\"ReplyItem\"]"].join(", ");
  function _0x24959e(_0x3a46b0) {
    if (!_0x3a46b0?.querySelectorAll) {
      return _0x3a46b0;
    }
    try {
      _0x3a46b0.querySelectorAll(_0x2e7c89).forEach(_0x3979d8 => {
        try {
          _0x3979d8.remove();
        } catch (_0x361e12) {}
      });
    } catch (_0x11979c) {}
    return _0x3a46b0;
  }
  function _0xcd44e(_0x3c5d4b, _0x5cc344 = []) {
    const _0x1d6dd = (Array.isArray(_0x5cc344) ? _0x5cc344 : []).slice(0, 8).some(_0xb3df38 => String(_0xb3df38 || "").trim() === "作者");
    if (_0x1d6dd) {
      return true;
    }
    if (!_0x3c5d4b?.querySelectorAll) {
      return false;
    }
    try {
      const _0xea5abf = Array.from(_0x3c5d4b.querySelectorAll("span, div, label, em, i, strong"));
      for (const _0x35d49b of _0xea5abf) {
        if (!_0x141e1a(_0x35d49b, _0x3c5d4b)) {
          continue;
        }
        if ((_0x35d49b.children?.length || 0) > 1) {
          continue;
        }
        const _0x4f0243 = (_0x35d49b.innerText || _0x35d49b.textContent || "").replace(/\s+/g, " ").trim();
        if (_0x4f0243 === "作者") {
          return true;
        }
      }
    } catch (_0x3f4621) {}
    return false;
  }
  function _0x27f4e5(_0x4ae33e = {}, _0x679316 = {}) {
    const _0x24b093 = String(_0x4ae33e?.nickname || "").trim().replace(/^@+/, "");
    const _0x17d25f = String(_0x4ae33e?.userUrl || "").trim();
    const _0x3fcd63 = _0x38314b(_0x17d25f) || String(_0x4ae33e?.secUid || "").trim();
    const _0x56bf57 = String(_0x679316?.nickname || _0x679316?.authorNickname || "").trim().replace(/^@+/, "");
    const _0x1ec019 = String(_0x679316?.profileUrl || _0x679316?.authorUrl || _0x679316?.userUrl || "").trim();
    const _0xdd37c1 = _0x38314b(_0x1ec019) || String(_0x679316?.secUid || "").trim();
    if (_0xdd37c1 && _0x3fcd63 && _0xdd37c1 === _0x3fcd63) {
      return true;
    }
    if (_0x1ec019 && _0x17d25f) {
      const _0x123550 = _0x1ec019.split("?")[0].replace(/\/+$/, "");
      const _0x27b4e7 = _0x17d25f.split("?")[0].replace(/\/+$/, "");
      if (_0x123550 && _0x27b4e7 && _0x123550 === _0x27b4e7) {
        return true;
      }
    }
    if (_0x56bf57 && _0x24b093 && _0x56bf57 === _0x24b093) {
      return true;
    }
    return false;
  }
  function _0x2cbfec(_0x1c910d) {
    return String(_0x1c910d || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").replace(/\s*(?:展开全文|收起全文|查看全文)\s*$/g, "").trim();
  }
  function _0x195446(_0x271378) {
    const _0x104745 = typeof _0x169b8b === "function" ? _0x169b8b(_0x271378) : "";
    if (!_0x104745) {
      return null;
    }
    try {
      return new RegExp(_0x104745, "i");
    } catch (_0x3f8925) {
      return null;
    }
  }
  function _0x23a9ad(_0x673f7b) {
    const _0x346cce = _0x195446("commentAvatarImagePattern");
    if (!_0x673f7b || !_0x346cce) {
      return false;
    }
    const _0x49a62b = String(_0x673f7b.getAttribute?.("src") || _0x673f7b.src || "");
    return _0x346cce.test(_0x49a62b);
  }
  function _0x3e6b72(_0x4573b2) {
    if (!_0x4573b2) {
      return false;
    }
    const _0x3df1b5 = typeof _0x169b8b === "function" ? _0x169b8b("commentStickerImageSelector") : "";
    if (_0x3df1b5) {
      try {
        if (_0x4573b2.matches?.(_0x3df1b5)) {
          return true;
        }
      } catch (_0x2e32bf) {
        return false;
      }
    }
    const _0x418e88 = _0x195446("commentStickerAltPattern");
    if (!_0x418e88) {
      return false;
    }
    const _0x22ec57 = String(_0x4573b2.getAttribute?.("alt") || _0x4573b2.getAttribute?.("aria-label") || "");
    return _0x418e88.test(_0x22ec57);
  }
  function _0x30dafc(_0x2108a0) {
    const _0x546027 = _0x2cbfec(_0x2108a0);
    if (!_0x546027) {
      return true;
    }
    if (/^[.。…·•・\s]{2,}$/.test(_0x546027)) {
      return true;
    }
    if (/^(回复|展开|收起|展开回复|收起回复|作者赞过|置顶|举报|分享|删除|点赞)$/.test(_0x546027)) {
      return true;
    }
    return isDouyinCommentActionChromeText(_0x546027);
  }
  function _0x1df73a(_0x577825) {
    if (!_0x577825?.querySelectorAll) {
      return 0;
    }
    let _0x431d08 = 0;
    try {
      Array.from(_0x577825.querySelectorAll("img")).forEach(_0x4d811e => {
        if (!_0x141e1a(_0x4d811e, _0x577825)) {
          return;
        }
        if (_0x4d811e.closest?.("a[href*=\"/user/\"]")) {
          return;
        }
        if (_0x23a9ad(_0x4d811e)) {
          return;
        }
        if (_0x3e6b72(_0x4d811e)) {
          _0x431d08 += 1;
        }
      });
    } catch (_0x16cb46) {}
    return _0x431d08;
  }
  function _0x54d039(_0x32f5d9) {
    if (!_0x32f5d9?.querySelectorAll) {
      return 0;
    }
    let _0x2e17f1 = 0;
    try {
      Array.from(_0x32f5d9.querySelectorAll("img")).forEach(_0x4d15ea => {
        if (!_0x141e1a(_0x4d15ea, _0x32f5d9)) {
          return;
        }
        if (_0x4d15ea.closest?.("a[href*=\"/user/\"]")) {
          return;
        }
        if (_0x4d15ea.closest?.("button, [role=\"button\"], [class*=\"like\"], [class*=\"Like\"], [class*=\"digg\"], [class*=\"Digg\"]")) {
          return;
        }
        if (_0x23a9ad(_0x4d15ea)) {
          return;
        }
        if (_0x3e6b72(_0x4d15ea)) {
          return;
        }
        const _0x19736d = String(_0x4d15ea.getAttribute?.("alt") || _0x4d15ea.getAttribute?.("aria-label") || "");
        if (/图片|查看图片|评论图片/.test(_0x19736d)) {
          _0x2e17f1 += 1;
          return;
        }
        const _0x329967 = (_0x4d15ea.className || "") + " " + (_0x4d15ea.parentElement?.className || "");
        if (/comment[-_]?image|comment[-_]?pic|image-list|ImageList|picture|photo/i.test(_0x329967)) {
          _0x2e17f1 += 1;
          return;
        }
        const _0x362be6 = Number(_0x4d15ea.naturalWidth || _0x4d15ea.width || _0x4d15ea.getBoundingClientRect?.().width || 0);
        const _0x2f77b1 = Number(_0x4d15ea.naturalHeight || _0x4d15ea.height || _0x4d15ea.getBoundingClientRect?.().height || 0);
        if (_0x362be6 >= 72 && _0x2f77b1 >= 72) {
          _0x2e17f1 += 1;
        }
      });
    } catch (_0x48f2ca) {}
    return _0x2e17f1;
  }
  function _0x52e532(_0x44fbd1) {
    return _0x2cbfec(_0x44fbd1).replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/👍|👏|❤|♥|💕|💗|💖|💘/g, "").replace(/\s+/g, " ").trim();
  }
  function _0x516665(_0x3e2bfa) {
    if (!_0x3e2bfa?.querySelectorAll) {
      return [];
    }
    const _0x5ad429 = [];
    try {
      Array.from(_0x3e2bfa.querySelectorAll("img[alt], img[aria-label], [data-emoji], [data-sticker], [title]")).forEach(_0x434fc1 => {
        if (!_0x141e1a(_0x434fc1, _0x3e2bfa)) {
          return;
        }
        if (_0x434fc1.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        [_0x434fc1.getAttribute?.("alt"), _0x434fc1.getAttribute?.("aria-label"), _0x434fc1.getAttribute?.("data-text"), _0x434fc1.getAttribute?.("data-emoji"), _0x434fc1.getAttribute?.("title")].forEach(_0x328c15 => {
          const _0x2576eb = _0x2cbfec(_0x328c15);
          if (!_0x2576eb || _0x372270(_0x2576eb)) {
            return;
          }
          _0x5ad429.push(_0x2576eb);
        });
      });
    } catch (_0x54823f) {}
    return _0x5ad429;
  }
  function _0x9b8390(_0x89909f, _0x327f65 = "") {
    let _0x1728de = _0x52e532(_0x89909f);
    const _0x53d555 = _0x2cbfec(_0x327f65).replace(/^@+/, "");
    if (_0x53d555) {
      _0x1728de = _0x1728de.split("@" + _0x53d555).join(" ").split(_0x53d555).join(" ");
    }
    let _0x4c2d37 = _0x1728de.replace(/回复|展开|收起|作者赞过|置顶|分享|举报|不喜欢|点赞/g, " ").replace(/(?:刚刚|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|月|年)前).*$/g, " ").replace(/IP(?:属地)?[：:\s\S]*$/i, " ").replace(/[·•]/g, " ").replace(/\s+/g, " ").trim();
    const _0x2e93c6 = _0x4c2d37.replace(/\s+/g, "");
    if (/^\d+$/.test(_0x2e93c6)) {
      return _0x2e93c6;
    }
    return _0x4c2d37.replace(/\d+(?:\.\d+)?[万wWkK]?/g, " ").replace(/\s+/g, "").trim();
  }
  function _0x2a75c0(_0x150db5) {
    return Array.from(String(_0x150db5 || "").matchAll(/\[([^\[\]\n]{1,16})\]/g)).map(_0x4678f7 => _0x4678f7[1]);
  }
  function _0x4fed90(_0x15c581) {
    const _0x34b7e4 = _0x2cbfec(_0x15c581);
    const _0x3fe241 = _0x2a75c0(_0x34b7e4);
    const _0x212e5c = _0x52e532(_0x34b7e4);
    const _0x4fa30e = /\[图片\]|\[图片评论\]|图片评论|发了张图片|\[视频\]/.test(_0x34b7e4);
    return {
      raw: _0x34b7e4,
      plain: _0x212e5c,
      emojiNames: _0x3fe241,
      emojiCount: _0x3fe241.length,
      hasImageToken: _0x4fa30e,
      mediaHeavy: !_0x212e5c || _0x4fa30e || _0x3fe241.length > 0 && _0x212e5c.length <= 6
    };
  }
  function _0x5b6610(_0x2edcc9, _0x1aedc8, _0x3d9c79, _0x3a7a3d = []) {
    const _0x49dcba = Array.from(_0x2edcc9?.querySelectorAll?.("img") || []).filter(_0x5879e7 => _0x141e1a(_0x5879e7, _0x2edcc9) && !_0x5879e7.closest?.("a[href*=\"/user/\"]"));
    const _0x264587 = _0x49dcba.filter(_0x3e6b72);
    const _0x585bf4 = _0x49dcba.filter(_0x2c090f => !_0x264587.includes(_0x2c090f));
    const _0x5d0001 = [];
    for (const _0x4f18af of _0x3a7a3d) {
      const _0x230a7a = _0x2a75c0(_0x4f18af);
      if (_0x230a7a.length) {
        _0x5d0001.push(..._0x230a7a);
      } else {
        const _0x5fcf85 = _0x2cbfec(_0x4f18af).replace(/^\[|\]$/g, "");
        if (_0x5fcf85 && _0x5fcf85.length <= 12 && !/^\d+$/.test(_0x5fcf85) && !_0x372270(_0x5fcf85, _0x1aedc8)) {
          _0x5d0001.push(_0x5fcf85);
        }
      }
    }
    _0x264587.forEach(_0x144c1a => {
      const _0x4b21c5 = _0x2cbfec(_0x144c1a.getAttribute?.("alt") || _0x144c1a.getAttribute?.("aria-label") || _0x144c1a.getAttribute?.("data-emoji") || "");
      _0x2a75c0(_0x4b21c5).forEach(_0x54eee8 => _0x5d0001.push(_0x54eee8));
      const _0x3126c9 = _0x4b21c5.replace(/^\[|\]$/g, "");
      if (_0x3126c9 && _0x3126c9.length <= 12) {
        _0x5d0001.push(_0x3126c9);
      }
    });
    const _0x41fcbf = _0x9b8390(_0x3d9c79 || "", _0x1aedc8);
    return {
      plain: _0x41fcbf,
      emojiNames: [...new Set(_0x5d0001.filter(Boolean))],
      emojiCount: Math.max(_0x264587.length, _0x5d0001.length),
      imageCount: _0x585bf4.length,
      mediaHeavy: !_0x41fcbf || _0x264587.length > 0 || _0x585bf4.length > 0
    };
  }
  function _0x371417(_0x2490df, _0x96ff69, _0x1c9aa7 = [], _0xaea4ab = "") {
    if (!_0x2490df?.raw) {
      return {
        hit: true,
        scoreBonus: 0,
        mode: "empty"
      };
    }
    if (_0x1c9aa7.some(_0x2eb558 => _0x2eb558.includes(_0x2490df.raw))) {
      return {
        hit: true,
        scoreBonus: 24,
        mode: "full"
      };
    }
    const _0x39eea5 = _0x2490df.raw.slice(0, 40);
    if (_0x39eea5 && _0x1c9aa7.some(_0x4d21c1 => _0x4d21c1.includes(_0x39eea5))) {
      return {
        hit: true,
        scoreBonus: 14,
        mode: "snippet"
      };
    }
    let _0x3c36c1 = 0;
    let _0x35070e = false;
    let _0x2d7e9d = "miss";
    const _0x1cd085 = _0x1c9aa7.map(_0x3a9b9a => _0x9b8390(_0x3a9b9a, _0xaea4ab)).filter(Boolean);
    if (_0x2490df.plain) {
      const _0x20c4a5 = [_0x96ff69.plain, ..._0x1cd085].filter(Boolean).some(_0x29ffd2 => _0x29ffd2 === _0x2490df.plain || _0x29ffd2.includes(_0x2490df.plain) || _0x2490df.plain.includes(_0x29ffd2));
      if (_0x20c4a5) {
        _0x35070e = true;
        _0x3c36c1 += _0x2490df.plain.length <= 4 ? 16 : 20;
        _0x2d7e9d = "plain";
      } else if (_0x2490df.plain.length <= 1 && !_0x2490df.emojiCount) {
        return {
          hit: false,
          scoreBonus: 0,
          mode: "plain_short_reject"
        };
      }
    }
    if (_0x2490df.emojiNames.length) {
      const _0x241a41 = new Set(_0x96ff69.emojiNames);
      const _0xa75706 = _0x1c9aa7.join("\n");
      let _0x163f8a = 0;
      for (const _0x2e5d4f of _0x2490df.emojiNames) {
        if (_0x241a41.has(_0x2e5d4f) || _0xa75706.includes("[" + _0x2e5d4f + "]") || _0xa75706.includes(_0x2e5d4f)) {
          _0x163f8a += 1;
        }
      }
      if (_0x163f8a > 0) {
        _0x35070e = true;
        _0x3c36c1 += Math.min(18, _0x163f8a * 6);
        _0x2d7e9d = _0x2d7e9d === "miss" ? "emoji" : _0x2d7e9d + "+emoji";
      } else if (!_0x2490df.plain && _0x96ff69.emojiCount > 0) {
        _0x35070e = true;
        _0x3c36c1 += 8;
        _0x2d7e9d = "emoji_soft";
      }
    }
    if (_0x2490df.hasImageToken && _0x96ff69.imageCount > 0) {
      _0x35070e = true;
      _0x3c36c1 += 14;
      _0x2d7e9d = _0x2d7e9d === "miss" ? "image" : _0x2d7e9d + "+image";
    } else if (_0x2490df.hasImageToken && !_0x96ff69.plain && _0x96ff69.mediaHeavy) {
      _0x35070e = true;
      _0x3c36c1 += 8;
      _0x2d7e9d = "image_soft";
    }
    if (!_0x35070e && _0x2490df.mediaHeavy) {
      return {
        hit: true,
        scoreBonus: 3,
        mode: "media_soft",
        soft: true
      };
    }
    return {
      hit: _0x35070e,
      scoreBonus: _0x3c36c1,
      mode: _0x2d7e9d,
      soft: false
    };
  }
  function _0x12ddd4(_0x5ee228) {
    try {
      const _0x490248 = _0x5ee228.getBoundingClientRect?.();
      if (!_0x490248 || !(_0x490248.height > 0) || !(_0x490248.bottom > 8) || !(_0x490248.top < window.innerHeight - 8)) {
        return 0;
      }
      const _0x3c4020 = (_0x490248.top + _0x490248.bottom) / 2;
      const _0x3d3257 = window.innerHeight / 2;
      const _0x4e63f3 = Math.abs(_0x3c4020 - _0x3d3257) / Math.max(1, window.innerHeight);
      return Math.round((1 - Math.min(1, _0x4e63f3 * 1.2)) * 14);
    } catch (_0x31636f) {
      return 0;
    }
  }
  function _0x372270(_0x20b0f3, _0x5288ef = "") {
    const _0x1ee2b7 = _0x2cbfec(_0x20b0f3);
    if (_0x30dafc(_0x1ee2b7) || _0x1ee2b7 === _0x5288ef) {
      return true;
    }
    if (/^(作者|作者赞过|赞|点赞|不喜欢|更多|头像|用户头像)$/.test(_0x1ee2b7)) {
      return true;
    }
    if (/^IP(?:属地)?[：:\s]/i.test(_0x1ee2b7)) {
      return true;
    }
    if (/^(?:刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前|\d{1,4}-\d{1,2}(?:-\d{1,2})?)(?:\s*[·•]\s*[\u4e00-\u9fff]{2,10})?$/.test(_0x1ee2b7)) {
      return true;
    }
    return false;
  }
  function _0x141e1a(_0x2edf77, _0x317834) {
    if (!_0x2edf77 || !_0x317834 || !_0x317834.contains?.(_0x2edf77)) {
      return false;
    }
    const _0x572ceb = "[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"]";
    const _0x1ae4a4 = _0x2edf77.closest?.(_0x572ceb) || null;
    const _0x38dad3 = _0x317834.matches?.(_0x572ceb) ? _0x317834 : _0x317834.closest?.(_0x572ceb) || null;
    if (_0x1ae4a4 && _0x38dad3) {
      return _0x1ae4a4 === _0x38dad3;
    }
    const _0x4a2395 = _0x2edf77.closest?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"]");
    return !_0x4a2395 || _0x4a2395 === _0x317834 || !_0x317834.contains(_0x4a2395);
  }
  function _0x1ce79f(_0x5522c8, _0x4dc07e = "") {
    if (!_0x5522c8) {
      return "";
    }
    const _0x51d400 = ["[data-e2e=\"comment-content\"]", "[data-e2e=\"comment-text\"]", "[data-e2e*=\"comment-content\" i]", "[data-e2e*=\"comment-text\" i]", "[class*=\"comment-content\" i]", "[class*=\"commentContent\"]", "[class*=\"comment-text\" i]", "[class*=\"CommentText\"]", "[class*=\"contentText\"]", "[class*=\"ContentText\"]"];
    const _0x37cee5 = [];
    let _0x1d7864 = [];
    try {
      _0x1d7864 = Array.from(_0x5522c8.querySelectorAll(_0x51d400.join(", ")));
    } catch (_0x216ac9) {}
    _0x1d7864.forEach(_0x4e275a => {
      if (!_0x141e1a(_0x4e275a, _0x5522c8)) {
        return;
      }
      if (_0x4e275a.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
        return;
      }
      let _0x5d7d90 = _0x51d400.findIndex(_0x2a2488 => {
        try {
          return _0x4e275a.matches?.(_0x2a2488);
        } catch (_0x37cec7) {
          return false;
        }
      });
      if (_0x5d7d90 < 0) {
        _0x5d7d90 = _0x51d400.length - 1;
      }
      const _0x3edd9a = [_0x4e275a.getAttribute?.("data-full-text"), _0x4e275a.getAttribute?.("data-text"), _0x4e275a.textContent, _0x4e275a.innerText, _0x4e275a.getAttribute?.("aria-label"), _0x4e275a.getAttribute?.("title")];
      _0x3edd9a.forEach((_0x522778, _0x1cb3cf) => {
        const _0xc5640b = _0x2cbfec(_0x522778);
        if (_0x372270(_0xc5640b, _0x4dc07e)) {
          return;
        }
        if (_0x30dafc(_0xc5640b) || isUnusableCommentBodyText(_0xc5640b, _0x4dc07e)) {
          return;
        }
        _0x37cee5.push({
          text: _0xc5640b,
          score: (_0x51d400.length - _0x5d7d90) * 1000 + (_0x1cb3cf <= 2 ? 300 : 0) + Math.min(_0xc5640b.length, 80)
        });
      });
    });
    if (_0x37cee5.length === 0) {
      const _0x1323e7 = _0x5522c8.querySelector?.("a[href*=\"/user/\"]") || null;
      Array.from(_0x5522c8.querySelectorAll?.("p, span, div") || []).forEach(_0x312fab => {
        if (_0x312fab === _0x5522c8 || !_0x141e1a(_0x312fab, _0x5522c8)) {
          return;
        }
        if (_0x312fab.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        if (_0x1323e7 && _0x312fab.contains?.(_0x1323e7)) {
          return;
        }
        if (_0x312fab.querySelector?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"]")) {
          return;
        }
        if ((_0x312fab.children?.length || 0) > 4) {
          return;
        }
        const _0x26ced3 = (_0x312fab.getAttribute?.("data-e2e") || "") + " " + (_0x312fab.className || "");
        const _0x8ac63 = [_0x312fab.textContent, _0x312fab.innerText, _0x312fab.getAttribute?.("data-text"), _0x312fab.getAttribute?.("aria-label"), _0x312fab.getAttribute?.("title")];
        _0x8ac63.forEach((_0x153f05, _0x47b1c7) => {
          const _0x35fd9d = _0x2cbfec(_0x153f05);
          if (_0x372270(_0x35fd9d, _0x4dc07e)) {
            return;
          }
          if (_0x30dafc(_0x35fd9d) || isUnusableCommentBodyText(_0x35fd9d, _0x4dc07e)) {
            return;
          }
          const _0x55f2d0 = /^\d+$/.test(_0x35fd9d);
          _0x37cee5.push({
            text: _0x35fd9d,
            score: (/comment|content|text/i.test(_0x26ced3) ? 500 : 0) + ((_0x312fab.children?.length || 0) === 0 ? 120 : 0) + (/^(P|SPAN)$/.test(_0x312fab.tagName || "") ? 60 : 0) + (_0x47b1c7 >= 2 ? 40 : 0) + Math.min(_0x35fd9d.length, 240) + (_0x55f2d0 ? -400 : 0)
          });
        });
      });
    }
    if (_0x37cee5.length === 0) {
      const _0x90536c = _0x54d039(_0x5522c8);
      if (_0x90536c > 0) {
        _0x37cee5.push({
          text: "[图片]",
          score: 280
        });
      }
      const _0x55a3e8 = _0x1df73a(_0x5522c8);
      let _0x42d9ca = _0x55a3e8 > 0;
      Array.from(_0x5522c8.querySelectorAll?.("img[alt], img[aria-label], [data-emoji], [data-sticker]") || []).forEach(_0x18f62c => {
        if (!_0x141e1a(_0x18f62c, _0x5522c8)) {
          return;
        }
        if (_0x18f62c.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        const _0xa75333 = [_0x18f62c.getAttribute?.("alt"), _0x18f62c.getAttribute?.("aria-label"), _0x18f62c.getAttribute?.("data-text"), _0x18f62c.getAttribute?.("title")];
        _0xa75333.forEach(_0x364342 => {
          let _0x1dff50 = _0x2cbfec(_0x364342);
          if (/^(图片|查看图片|评论图片|\[图片\]|\[图片评论\])$/.test(_0x1dff50)) {
            _0x37cee5.push({
              text: "[图片]",
              score: 260
            });
            return;
          }
          if (_0x372270(_0x1dff50, _0x4dc07e)) {
            return;
          }
          if (_0x1dff50) {
            _0x42d9ca = true;
          }
        });
      });
      if (_0x37cee5.length === 0 && _0x42d9ca) {
        _0x37cee5.push({
          text: "[表情或表情包]",
          score: 200
        });
      }
    }
    _0x37cee5.sort((_0x2c2ff9, _0x57c060) => _0x57c060.score - _0x2c2ff9.score);
    return _0x37cee5[0]?.text || "";
  }
  function _0x2bf2b4(_0xa5e3c6, _0x32566f = {}) {
    const {
      requireTime = false,
      skipAuthor = true
    } = _0x32566f;
    if (!_0xa5e3c6) {
      return null;
    }
    const _0x3d7363 = Array.from(_0xa5e3c6.querySelectorAll?.("a[href*=\"/user/\"]") || []);
    const _0x30e44f = (() => {
      try {
        const _0x2ca78a = String(_0xa5e3c6.innerText || "").split("\n").map(_0xf7d381 => _0xf7d381.trim()).filter(Boolean);
        return _0x2cbfec(_0x2ca78a[0] || "").replace(/^@+/, "");
      } catch (_0x2de424) {
        return "";
      }
    })();
    const _0x4b6338 = () => {
      if (!_0x3d7363.length) {
        return null;
      }
      if (_0x30e44f) {
        const _0x182a06 = _0x3d7363.find(_0x30a2a0 => {
          const _0x18ddcf = _0x2cbfec(_0x30a2a0?.innerText || _0x30a2a0?.textContent || _0x30a2a0?.getAttribute?.("title") || "").replace(/^@+/, "");
          return _0x18ddcf && (_0x18ddcf === _0x30e44f || _0x18ddcf.includes(_0x30e44f) || _0x30e44f.includes(_0x18ddcf));
        });
        if (_0x182a06) {
          return _0x182a06;
        }
      }
      return _0x3d7363[0];
    };
    const _0x203f54 = _0x4b6338();
    const _0x35d51d = _0x203f54 ? _0x203f54.href || _0x203f54.getAttribute?.("href") || "" : "";
    const _0x2252d0 = _0x2cbfec(_0x203f54?.innerText || _0x203f54?.textContent || _0x203f54?.getAttribute?.("title") || "").replace(/^@+/, "");
    const _0x5fd175 = _0xa5e3c6.cloneNode(true);
    _0x24959e(_0x5fd175);
    const _0x3be90c = document.createElement("div");
    _0x3be90c.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:1000px;height:auto;overflow:hidden;pointer-events:none;";
    document.body.appendChild(_0x3be90c);
    _0x3be90c.appendChild(_0x5fd175);
    const _0x56f0aa = _0x5fd175.innerText.split("\n").map(_0x1f48ae => _0x1f48ae.trim()).filter(_0x402fb8 => _0x402fb8.length > 0);
    _0x3be90c.remove();
    const _0x1858f7 = _0x2252d0 || _0x56f0aa[0] || "未知用户";
    if (!_0x1858f7 || _0x1858f7 === "未知用户") {
      return null;
    }
    const _0x246047 = _0xcd44e(_0xa5e3c6, _0x56f0aa);
    if (skipAuthor && _0x246047) {
      return null;
    }
    const _0x1490b3 = _0x5c14d4();
    const _0x10fa1a = typeof _0x1490b3?.pickPrimaryCommentTimeMeta === "function" ? _0x1490b3.pickPrimaryCommentTimeMeta(_0x56f0aa) : null;
    let _0x30e67d = String(_0x10fa1a?.time || "").trim();
    let _0x261637 = String(_0x10fa1a?.timeOriginal || "").trim();
    if (!_0x30e67d) {
      const _0x172124 = /(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/;
      const _0x5ef31c = typeof _0x1490b3?.linesBeforeNestedReplies === "function" ? _0x1490b3.linesBeforeNestedReplies(_0x56f0aa) : _0x56f0aa;
      for (let _0x3e10fc = 0; _0x3e10fc < _0x5ef31c.length; _0x3e10fc += 1) {
        const _0x3e3a13 = _0x5ef31c[_0x3e10fc].match(_0x172124);
        if (_0x3e3a13) {
          _0x30e67d = _0x3e3a13[1] || _0x3e3a13[0];
          _0x261637 = _0x5ef31c[_0x3e10fc];
          break;
        }
      }
    }
    if (requireTime && !_0x30e67d) {
      return null;
    }
    let _0x2c76f0 = String(_0x10fa1a?.ipLocation || "").trim();
    if (!_0x2c76f0 && _0x261637) {
      _0x2c76f0 = typeof _0x1490b3?.resolveCommentLocationText === "function" ? _0x1490b3.resolveCommentLocationText({
        timeOriginal: _0x261637
      }) : "";
    }
    _0x2c76f0 &&= typeof _0x1490b3?.normalizeCommentIpLocationText === "function" ? _0x1490b3.normalizeCommentIpLocationText(_0x2c76f0) : String(_0x2c76f0).trim();
    const _0x8c7861 = pickDouyinCommentLineText(filterDouyinCommentContentLines(_0x56f0aa, {
      nickname: _0x1858f7,
      timeOriginal: _0x261637,
      ipLocation: _0x2c76f0
    }));
    const _0x4bd76a = _0x516665(_0xa5e3c6);
    const _0x476c7a = _0x1df73a(_0xa5e3c6);
    const _0x4e86aa = _0x54d039(_0xa5e3c6);
    const _0x2d04cd = resolveDouyinCommentBodyText({
      explicitText: _0x1ce79f(_0xa5e3c6, _0x1858f7),
      lineText: _0x8c7861,
      nickname: _0x1858f7,
      emojiHints: _0x4bd76a,
      stickerCount: _0x476c7a,
      hasStickerMedia: _0x476c7a > 0,
      imageCount: _0x4e86aa,
      hasImageMedia: _0x4e86aa > 0
    });
    if (!_0x2d04cd || _0x2d04cd.trim().length === 0) {
      return null;
    }
    if (_0x2d04cd.includes("@豆包") || _0x2d04cd.includes("@元宝") || _0x2d04cd.includes("@通义") || _0x2d04cd.includes("@文心")) {
      return null;
    }
    return {
      nickname: _0x1858f7,
      userUrl: _0x35d51d,
      text: _0x2d04cd,
      time: _0x30e67d,
      timeOriginal: _0x261637,
      ipLocation: _0x2c76f0,
      isAuthor: !!_0x246047,
      cid: extractDouyinCommentCidFromNode(_0xa5e3c6)
    };
  }
  function _0x4de99d(_0x3820f4) {
    const _0x2626da = _0x2bf2b4(_0x3820f4, {
      requireTime: true,
      skipAuthor: false
    });
    if (!_0x2626da) {
      return null;
    }
    const _0x192edb = _0x2626da.ipLocation || "";
    return {
      nickname: _0x2626da.nickname,
      userUrl: _0x2626da.userUrl,
      text: _0x2626da.text,
      time: _0x2626da.time || _0x2626da.timeOriginal || "",
      ipLocation: _0x192edb,
      location: _0x192edb,
      isAuthor: !!_0x2626da.isAuthor,
      isAuthorComment: !!_0x2626da.isAuthor,
      cid: _0x2626da.cid || "",
      commentId: _0x2626da.cid || ""
    };
  }
  function _0x57d3a9(_0x27b7f5, _0x4dc770 = "") {
    const _0x156147 = _0x27b7f5 || document;
    const _0x237368 = (typeof _0x525faa === "function" ? _0x525faa(_0x156147, _0x4dc770) : null) || {};
    const _0x5e3737 = String(_0x237368.profileUrl || "").trim() || (typeof _0x4c9dba === "function" ? _0x4c9dba(_0x156147, _0x4dc770) : "") || "";
    const _0x8e7e57 = String(_0x237368.nickname || "").trim() || (typeof _0xb049ea === "function" ? _0xb049ea(_0x156147) : "") || "";
    const _0x156924 = resolveDouyinAuthorIdentityKey(_0x5e3737) || String((typeof _0x38314b === "function" ? _0x38314b(_0x5e3737) : "") || "").trim();
    const _0x425c19 = String(window.location.href || "").trim();
    const _0x7f1eda = resolveDouyinAuthorIdentityKey(_0x425c19) || String((typeof _0x38314b === "function" ? _0x38314b(_0x425c19) : "") || "").trim();
    return {
      nickname: _0x8e7e57,
      profileUrl: _0x5e3737,
      pageUrl: _0x425c19,
      secUid: _0x156924 || _0x7f1eda,
      pageSecUid: _0x7f1eda
    };
  }
  function _0x2942b7(_0x300994, _0x5c797e) {
    return String(resolveDouyinAuthorIdentityKey(_0x300994) || resolveDouyinAuthorIdentityKey(_0x5c797e) || _0x5c797e || "").trim();
  }
  function _0x29d373(_0x4fe5f8, _0x199f7c, _0x2219fc) {
    const _0x116e6b = _0x199f7c || _0x2219fc;
    const _0x2d3145 = [_0x4fe5f8?.pageUrl, _0x4fe5f8?.pageSecUid, _0x4fe5f8?.profileUrl, _0x4fe5f8?.secUid];
    let _0x5ded18 = null;
    for (const _0x19c53c of _0x2d3145) {
      const _0x1f3397 = classifyDouyinAuthorIdentity(_0x19c53c, _0x116e6b);
      if (_0x1f3397.matched) {
        return {
          ok: true,
          authorMismatch: false,
          authorUnconfirmed: false,
          author: _0x4fe5f8,
          currentKey: _0x1f3397.currentKey,
          expectedKey: _0x1f3397.expectedKey
        };
      }
      if (_0x1f3397.foreign && !_0x5ded18) {
        _0x5ded18 = _0x1f3397;
      }
    }
    if (_0x5ded18) {
      return {
        ok: false,
        authorMismatch: true,
        authorUnconfirmed: false,
        author: {
          ..._0x4fe5f8,
          secUid: _0x5ded18.currentKey || _0x4fe5f8?.secUid || ""
        },
        currentKey: _0x5ded18.currentKey,
        expectedKey: _0x5ded18.expectedKey
      };
    }
    return {
      ok: false,
      authorMismatch: false,
      authorUnconfirmed: true,
      author: _0x4fe5f8
    };
  }
  function _0x21a8bc(_0x15220b, _0x24de94, _0x52090f) {
    return !!_0x29d373(_0x15220b, _0x24de94, _0x52090f).authorMismatch;
  }
  async function _0x36f525(_0x3b1806, {
    expectedVideoUrl = "",
    expectedAuthorUrl = "",
    expectedSecUid = "",
    timeoutMs = 4000
  } = {}) {
    const _0x15be76 = _0x2942b7(expectedAuthorUrl, expectedSecUid);
    let _0x2f86eb = _0x57d3a9(_0x3b1806, expectedVideoUrl);
    if (!_0x15be76) {
      return {
        ok: true,
        skipped: true,
        author: _0x2f86eb
      };
    }
    let _0x4e6d55 = _0x29d373(_0x2f86eb, expectedAuthorUrl, expectedSecUid);
    if (_0x4e6d55.ok) {
      return {
        ok: true,
        author: _0x2f86eb
      };
    }
    const _0x2c5a37 = Date.now() + Math.max(800, Number(timeoutMs) || 4000);
    while (Date.now() < _0x2c5a37) {
      if (_0x4e6d55.authorMismatch) {
        return {
          ok: false,
          authorMismatch: true,
          author: _0x4e6d55.author
        };
      }
      await _0x5bcced(350);
      _0x2f86eb = _0x57d3a9(_0x3b1806, expectedVideoUrl);
      _0x4e6d55 = _0x29d373(_0x2f86eb, expectedAuthorUrl, expectedSecUid);
      if (_0x4e6d55.ok) {
        return {
          ok: true,
          author: _0x2f86eb
        };
      }
    }
    return {
      ok: !!_0x4e6d55.ok,
      authorMismatch: !!_0x4e6d55.authorMismatch,
      authorUnconfirmed: !!_0x4e6d55.authorUnconfirmed,
      author: _0x4e6d55.author || _0x2f86eb
    };
  }
  async function _0x5cbb3b(_0x5470df = {}) {
    const {
      requestId: _0x446d80,
      maxComments: _0x194c68,
      chunkSize: _0x49ac1c,
      targetVideoUrl: _0x1ee10f,
      expectedAuthorUrl: _0x222432,
      expectedSecUid: _0x57d983,
      scrapePageTimeoutMs: _0x28f079,
      resumeComments: _0x266f5d,
      resumeState: _0x3b8094
    } = _0x5470df;
    const _0x2c4d16 = String(_0x222432 || "").trim();
    const _0x136222 = String(_0x57d983 || "").trim();
    const _0xfdeade = Number.isFinite(Number(_0x194c68)) && Number(_0x194c68) > 0 ? Math.floor(Number(_0x194c68)) : 200;
    const _0x1b88c1 = Number.isFinite(Number(_0x49ac1c)) && Number(_0x49ac1c) > 0 ? Math.min(_0xfdeade, Math.floor(Number(_0x49ac1c))) : 0;
    const _0x887628 = (Array.isArray(_0x266f5d) ? _0x266f5d : []).filter(_0x1f9b18 => _0x1f9b18 && _0x1f9b18.nickname && _0x1f9b18.text).slice(0, _0xfdeade).map(_0x43532c => ({
      ..._0x43532c
    }));
    const _0x1bec33 = _0x887628.length;
    const _0x20df51 = _0x3b8094 && typeof _0x3b8094 === "object" ? {
      ..._0x3b8094
    } : {};
    const _0x1b8916 = "MONITOR_SCRAPE_" + (_0x446d80 || Date.now());
    const _0x28eb07 = Date.now();
    const _0x463b48 = Number(_0x28f079);
    const _0x4ac266 = Number.isFinite(_0x463b48) ? Math.min(600000, Math.max(15000, Math.floor(_0x463b48))) : 600000;
    const _0x1a9d6a = _0x28eb07 + _0x4ac266;
    const _0x589e50 = () => {
      if (Date.now() <= _0x1a9d6a) {
        return;
      }
      const _0x26d244 = new Error("评论页面抓取超过 " + Math.round(_0x4ac266 / 1000) + " 秒");
      _0x26d244.code = "monitor_scrape_page_timeout";
      throw _0x26d244;
    };
    const _0x3e449c = _0xcf490a => {
      _0x47cc4f.send("video-monitor-scrape-result", {
        requestId: _0x446d80,
        ..._0xcf490a
      });
    };
    let _0x242d16 = 0;
    let _0x478642 = -1;
    const _0x46a313 = (_0x4a8739, {
      force = false
    } = {}) => {
      const _0x9ee805 = Date.now();
      const _0x2122f4 = Array.isArray(_0x4a8739.comments) ? _0x4a8739.comments.length : 0;
      const _0x413e6c = _0x478642 < 0 || _0x2122f4 - _0x478642 >= 10;
      if (!force && _0x9ee805 - _0x242d16 < 2000 && !_0x413e6c) {
        return;
      }
      _0x242d16 = _0x9ee805;
      _0x478642 = _0x2122f4;
      _0x47cc4f.send("video-monitor-scrape-progress", {
        requestId: _0x446d80,
        ..._0x4a8739,
        elapsedMs: _0x9ee805 - _0x28eb07
      });
    };
    const _0x39848a = (_0x5a7144, _0x2fcf87, _0x426540, _0x6eea17) => {
      const _0x3d95b1 = _0x3019e5(_0x5a7144 || document).filter(_0x18c19c);
      let _0x8a7dd7 = 0;
      _0x3d95b1.forEach(_0x150323 => {
        if (_0x6eea17.length >= _0xfdeade) {
          return;
        }
        const _0xf93ed8 = _0x4de99d(_0x150323);
        if (!_0xf93ed8) {
          return;
        }
        const _0x2a5d32 = _0xf93ed8.nickname + "__" + _0xf93ed8.text;
        if (_0x426540.has(_0x2a5d32)) {
          return;
        }
        _0x426540.add(_0x2a5d32);
        _0x6eea17.push(_0xf93ed8);
        _0x8a7dd7 += 1;
      });
      return {
        added: _0x8a7dd7,
        visibleCount: _0x3d95b1.length
      };
    };
    const _0x333e95 = () => {
      const _0x9c56c9 = _0x4a39d8["douyin.com"].modalContainer;
      const _0x345fa6 = document.querySelector(_0x9c56c9);
      if (_0x345fa6 && _0x18c19c(_0x345fa6)) {
        return _0x345fa6;
      } else {
        return document.body;
      }
    };
    const _0x477af6 = () => {
      if (!_0x1ee10f) {
        return true;
      }
      return _0x48eadc(window.location.href, _0x1ee10f);
    };
    let _0x38b6bd = null;
    try {
      try {
        await _0x3297b4(_0x1b8916);
      } catch (_0x564f8b) {}
      _0x589e50();
      const _0x20448e = _0x1ee10f ? _0x4d7a8c(_0x1ee10f) : "";
      if (_0x20448e) {
        let _0x266588 = await _0x1e1ba8(_0x1b8916, _0x1ee10f, 20000);
        _0x589e50();
        if (_0x266588.status === "cancelled" || _0x414526(_0x1b8916)) {
          _0x3e449c({
            success: false,
            cancelled: true,
            error: "已取消",
            comments: []
          });
          return;
        }
        if (_0x266588.status === "unavailable") {
          _0x3e449c({
            success: false,
            videoUnavailable: true,
            unavailableReason: _0x266588.reason || "unavailable",
            error: "视频失效或无法打开",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: _0x1ee10f
          });
          return;
        }
        if (_0x266588.status !== "ready" || !_0x477af6()) {
          const _0xc67696 = _0x150161(_0x1ee10f);
          if (_0xc67696 && _0xc67696 !== window.location.href) {
            window.location.href = _0xc67696;
            _0x266588 = await _0x1e1ba8(_0x1b8916, _0x1ee10f, 18000);
            _0x589e50();
          }
        }
        if (_0x266588.status === "unavailable") {
          _0x3e449c({
            success: false,
            videoUnavailable: true,
            unavailableReason: _0x266588.reason || "unavailable",
            error: "视频失效或无法打开",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: _0x1ee10f
          });
          return;
        }
        if (_0x266588.status !== "ready") {
          _0x3e449c({
            success: false,
            needReload: true,
            videoNotReady: true,
            panelOpened: false,
            error: "视频页未就绪",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: _0x1ee10f
          });
          return;
        }
        if (!_0x477af6()) {
          _0x3e449c({
            success: false,
            videoMismatch: true,
            error: "当前页面与目标视频不一致",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: _0x1ee10f
          });
          return;
        }
      }
      const _0x1d45de = typeof _0x2e5c6f === "function" ? _0x2e5c6f({
        includeFeed: false
      }) || _0x2e5c6f({
        includeFeed: true
      }) : null;
      const _0x12b0dd = _0x1d45de && _0x18c19c(_0x1d45de) ? _0x1d45de : _0x333e95();
      _0x32621a(_0x12b0dd, "监控抓取：锁定视频防止自动连播");
      const _0x2ba28f = {
        scope: _0x12b0dd,
        leadVideoUrl: _0x20448e || _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd),
        videoTitle: _0x446071()
      };
      _0x38b6bd = _0x50d391(_0x2ba28f, _0x1b8916, {
        intervalMs: 1000,
        driftConfirmTicks: 2
      });
      const _0x1e339d = (typeof _0x446071 === "function" ? _0x446071() : "") || "";
      const _0x5c5234 = _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href || "";
      let _0x548f0d = "";
      let _0x52eee7 = "";
      const _0xe82f9e = await _0x36f525(_0x12b0dd, {
        expectedVideoUrl: _0x20448e || _0x5c5234,
        expectedAuthorUrl: _0x2c4d16,
        expectedSecUid: _0x136222,
        timeoutMs: 4000
      });
      _0x548f0d = String(_0xe82f9e.author?.nickname || "").trim();
      _0x52eee7 = String(_0xe82f9e.author?.profileUrl || "").trim();
      if (_0xe82f9e.authorMismatch && _0x2942b7(_0x2c4d16, _0x136222)) {
        _0x3e449c({
          success: false,
          authorMismatch: true,
          authorUnconfirmed: false,
          videoMismatch: true,
          error: "当前作品不是目标博主，已停止采集评论",
          comments: [],
          videoTitle: _0x1e339d,
          videoUrl: _0x5c5234,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      const _0x453f14 = () => {
        if (_0x185b80(_0x38b6bd) || !_0x477af6()) {
          return true;
        }
        return _0x21a8bc(_0x57d3a9(_0x12b0dd, _0x20448e || _0x5c5234), _0x2c4d16, _0x136222);
      };
      const _0x261608 = await _0x8436f9(_0x1b8916, _0x12b0dd);
      _0x589e50();
      if (!_0x261608) {
        console.warn("[Monitor-Scrape] 评论面板未打开，请求重新进入视频");
        _0x3e449c({
          success: false,
          needReload: true,
          panelOpened: false,
          panelNotOpen: true,
          error: "评论面板未打开",
          comments: [],
          totalCount: _0x149fad(_0x12b0dd) || null,
          videoTitle: _0x1e339d,
          videoUrl: _0x5c5234,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      _0x32621a(_0x12b0dd, "监控抓取：评论区打开后再次锁定视频");
      if (_0x453f14()) {
        _0x3e449c({
          success: false,
          videoMismatch: true,
          authorMismatch: _0x21a8bc(_0x57d3a9(_0x12b0dd, _0x20448e || _0x5c5234), _0x2c4d16, _0x136222),
          error: "打开评论区后检测到视频已漂移",
          comments: [],
          videoTitle: _0x1e339d,
          videoUrl: _0x5c5234,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      let _0x2c8f5b = _0x149fad(_0x12b0dd);
      if (_0x2c8f5b == null || _0x2c8f5b === 0) {
        const _0x22f69c = Number(_0x3068f3(_0x12b0dd)?.comments) || 0;
        if (_0x22f69c > 0) {
          _0x2c8f5b = _0x22f69c;
        }
      }
      if (_0x2c8f5b === 0 && _0x887628.length === 0) {
        _0x3e449c({
          success: true,
          comments: [],
          totalCount: 0,
          visibleCount: 0,
          maxComments: _0xfdeade,
          panelOpened: _0x261608,
          videoTitle: _0x1e339d,
          videoUrl: _0x5c5234,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      await _0x566c52(_0x12b0dd, _0x1b8916, _0x2c8f5b);
      _0x589e50();
      await _0x15676e(_0x12b0dd, _0x1b8916);
      _0x589e50();
      const _0x349de8 = _0x149fad(_0x12b0dd);
      if (_0x349de8 != null && _0x349de8 > 0 && (_0x2c8f5b == null || _0x349de8 > _0x2c8f5b)) {
        _0x2c8f5b = _0x349de8;
      } else if (_0x2c8f5b == null || _0x2c8f5b === 0) {
        const _0x167fef = Number(_0x3068f3(_0x12b0dd)?.comments) || 0;
        if (_0x167fef > 0) {
          _0x2c8f5b = _0x167fef;
        }
      }
      const _0x545552 = _0x4a39d8["douyin.com"];
      let _0xc643fd = _0x41f3c3(_0x12b0dd);
      if (!_0xc643fd || !_0x18c19c(_0xc643fd)) {
        _0xc643fd = _0x12b0dd;
      }
      const _0x2c9717 = [];
      const _0x3bdaad = new Set();
      _0x887628.forEach(_0x487821 => {
        if (_0x2c9717.length >= _0xfdeade) {
          return;
        }
        const _0x2ce041 = _0x487821.nickname + "__" + _0x487821.text;
        if (_0x3bdaad.has(_0x2ce041)) {
          return;
        }
        _0x3bdaad.add(_0x2ce041);
        _0x2c9717.push(_0x487821);
      });
      let _0x22c140 = 0;
      _0x39848a(_0xc643fd, _0x545552, _0x3bdaad, _0x2c9717);
      if (_0x453f14()) {
        _0x3e449c({
          success: false,
          videoMismatch: true,
          authorMismatch: _0x21a8bc(_0x57d3a9(_0x12b0dd, _0x20448e || _0x5c5234), _0x2c4d16, _0x136222),
          error: "首屏采集时检测到视频已漂移",
          comments: [],
          videoTitle: _0x446071() || _0x1e339d,
          videoUrl: _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      const _0x4abf05 = () => Math.max(0, _0x2c9717.length - _0x1bec33);
      const _0x2e6823 = () => Number.isFinite(Number(_0x2c8f5b)) && Number(_0x2c8f5b) >= 0 && _0x2c9717.length >= Number(_0x2c8f5b);
      const _0x389813 = () => _0x1b88c1 > 0 && _0x4abf05() >= _0x1b88c1 && _0x2c9717.length < _0xfdeade && !_0x2e6823();
      const _0x17a40d = _0x54568e(_0xc643fd) || _0xc643fd;
      const _0x1c7b43 = Math.max(0, Number(_0x20df51.scrollTop) || 0);
      const _0x56354b = Math.max(0, Math.min(1, Number(_0x20df51.scrollRatio) || 0));
      const _0xe677b = Math.max(0, Math.floor(Number(_0x20df51.scrollRound) || 0));
      if (_0x1c7b43 > 0 || _0x56354b > 0) {
        try {
          const _0x482e41 = Math.max(0, Number(_0x17a40d.scrollHeight || 0) - Number(_0x17a40d.clientHeight || 0));
          const _0x2671b6 = _0x1c7b43 > 0 ? Math.min(_0x1c7b43, _0x482e41) : Math.round(_0x482e41 * _0x56354b);
          _0x17a40d.scrollTop = _0x2671b6;
          _0x17a40d.dispatchEvent(new Event("scroll", {
            bubbles: true
          }));
          await _0x5bcced(500);
          _0x39848a(_0xc643fd, _0x545552, _0x3bdaad, _0x2c9717);
        } catch (_0x1a6e04) {}
      }
      const _0x2890e7 = _0x287451 => {
        const _0x460d2c = _0x336234(_0xc643fd);
        const _0x43b020 = Math.max(0, _0x460d2c.scrollHeight - _0x460d2c.clientHeight);
        return {
          comments: _0x2c9717.slice(0, _0xfdeade),
          totalCount: _0x2c8f5b ?? null,
          visibleCount: _0x22c140,
          maxComments: _0xfdeade,
          videoTitle: _0x446071() || _0x1e339d,
          videoUrl: _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href || "",
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f,
          resumeState: {
            scrollRound: Math.max(0, Number(_0x287451) || 0),
            scrollTop: _0x460d2c.scrollTop,
            scrollHeight: _0x460d2c.scrollHeight,
            clientHeight: _0x460d2c.clientHeight,
            scrollRatio: _0x43b020 > 0 ? Math.max(0, Math.min(1, _0x460d2c.scrollTop / _0x43b020)) : 0
          }
        };
      };
      _0x46a313(_0x2890e7(_0xe677b), {
        force: true
      });
      if (_0x389813()) {
        const _0x29e411 = _0x2890e7(_0xe677b);
        const _0xa58cf7 = {
          success: true,
          partialChunk: true,
          comments: _0x2c9717.slice(0, _0xfdeade),
          totalCount: _0x2c8f5b ?? null,
          visibleCount: _0x22c140,
          maxComments: _0xfdeade,
          capped: false,
          chunkSize: _0x1b88c1,
          newlyCollected: _0x4abf05(),
          videoTitle: _0x446071() || _0x1e339d,
          videoUrl: _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href || "",
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f,
          resumeState: _0x29e411.resumeState
        };
        _0x46a313(_0xa58cf7, {
          force: true
        });
        _0x3e449c(_0xa58cf7);
        return;
      }
      const _0xf565d0 = Math.min(_0xfdeade, _0x2c8f5b != null && _0x2c8f5b > 0 ? _0x2c8f5b : _0xfdeade);
      const _0x437dbe = Math.max(12, Math.ceil(_0xf565d0 / 5) + 8);
      const _0x37ab29 = Math.min(120, _0x437dbe + Math.min(_0xe677b, 60));
      let _0xb1ab51 = 0;
      const _0x4c61a5 = _0x2c8f5b != null && _0x2c8f5b <= 5 ? 2 : _0x2c8f5b != null && _0x2c8f5b <= 10 ? 3 : 6;
      const _0x2b50c1 = Math.min(60, _0xe677b + _0x4c61a5);
      let _0x34eceb = _0xe677b;
      let _0x34a465 = false;
      for (let _0x97c1db = 0; _0x2c9717.length < _0xfdeade && !_0x2e6823() && _0x97c1db < _0x37ab29; _0x97c1db += 1) {
        _0x589e50();
        if (_0x453f14()) {
          _0x3e449c({
            success: false,
            videoMismatch: true,
            authorMismatch: _0x21a8bc(_0x57d3a9(_0x12b0dd, _0x20448e || _0x5c5234), _0x2c4d16, _0x136222),
            error: "评论滚动期间检测到视频已漂移",
            comments: [],
            totalCount: _0x2c8f5b,
            visibleCount: _0x22c140,
            maxComments: _0xfdeade,
            videoTitle: _0x446071(),
            videoUrl: _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href,
            videoAuthor: _0x548f0d,
            videoAuthorUrl: _0x52eee7,
            targetVideoUrl: _0x1ee10f
          });
          return;
        }
        _0x32621a(_0x12b0dd, "监控抓取：滚动评论期间锁定视频");
        const _0x16eeae = _0x2c9717.length;
        if (_0x563e15({
          forMonitorScrape: true
        })) {
          await _0x484c54(_0xc643fd, _0x1b8916, null, {
            failCount: 0,
            skipExpand: false
          }, {
            forMonitorScrape: true
          });
        }
        if (_0x17a40d && typeof _0x17a40d.scrollBy === "function") {
          const _0x33e08a = _0xb1ab51 >= 2 ? 1100 : 700;
          _0x17a40d.scrollBy(0, _0x33e08a);
        }
        await _0x5bcced(_0xb1ab51 >= 2 ? 900 : 700);
        _0x589e50();
        if (_0x1cda08(_0xc643fd) || _0xb1ab51 >= 1) {
          await _0x15676e(_0xc643fd, _0x1b8916);
          await _0x5bcced(350);
        }
        const _0x5ae653 = _0x39848a(_0xc643fd, _0x545552, _0x3bdaad, _0x2c9717);
        _0x22c140 = _0x5ae653.visibleCount;
        _0x4c354c(_0xc643fd, {
          context: "monitor"
        });
        _0x34eceb = _0xe677b + _0x97c1db + 1;
        _0x46a313(_0x2890e7(_0x34eceb));
        if (_0x2c9717.length >= _0xfdeade) {
          break;
        }
        if (_0x389813()) {
          _0x34a465 = true;
          break;
        }
        if (_0x2c9717.length === _0x16eeae) {
          _0xb1ab51 += 1;
          const _0x555960 = _0x1cda08(_0xc643fd);
          const _0x7664f7 = typeof _0x3d5d80 === "function" ? _0x3d5d80(_0xc643fd) : "";
          const _0x355c95 = typeof _0x336234 === "function" ? _0x336234(_0xc643fd) : null;
          if (_0x7664f7 || !_0x555960 && _0xb1ab51 >= _0x4c61a5 && (_0x2c8f5b == null || _0x2c8f5b <= 10 || _0x355c95?.nearBottom)) {
            break;
          }
          if (_0xb1ab51 >= _0x4c61a5 && _0x97c1db >= _0x2b50c1) {
            break;
          }
        } else {
          _0xb1ab51 = 0;
        }
      }
      const _0xe2a3c0 = _0x84a7a3(_0x5e30db(window.location.href), _0x12b0dd) || window.location.href || "";
      if (_0x453f14()) {
        _0x3e449c({
          success: false,
          videoMismatch: true,
          authorMismatch: _0x21a8bc(_0x57d3a9(_0x12b0dd, _0x20448e || _0x5c5234), _0x2c4d16, _0x136222),
          error: "抓取完成时检测到视频与目标不一致",
          comments: [],
          videoTitle: _0x446071(),
          videoUrl: _0xe2a3c0,
          videoAuthor: _0x548f0d,
          videoAuthorUrl: _0x52eee7,
          targetVideoUrl: _0x1ee10f
        });
        return;
      }
      const _0x243ec9 = _0x2c9717.length >= _0xfdeade && (_0x2c8f5b == null || _0x2c8f5b > _0xfdeade);
      const _0x2d409d = _0x2890e7(_0x34eceb);
      const _0x29a708 = {
        success: true,
        partialChunk: !!_0x34a465,
        comments: _0x2c9717.slice(0, _0xfdeade),
        totalCount: _0x2c8f5b ?? null,
        visibleCount: _0x22c140,
        maxComments: _0xfdeade,
        capped: _0x243ec9,
        chunkSize: _0x1b88c1,
        panelOpened: _0x261608,
        newlyCollected: _0x4abf05(),
        videoTitle: _0x446071() || _0x1e339d,
        videoUrl: _0xe2a3c0,
        videoAuthor: _0x548f0d,
        videoAuthorUrl: _0x52eee7,
        targetVideoUrl: _0x1ee10f,
        resumeState: _0x2d409d.resumeState
      };
      _0x46a313(_0x29a708, {
        force: true
      });
      _0x3e449c(_0x29a708);
    } catch (_0x5534a9) {
      _0x3e449c({
        success: false,
        error: _0x5534a9.message,
        errorCode: _0x5534a9.code || "monitor_scrape_page_failed",
        elapsedMs: Date.now() - _0x28eb07,
        comments: []
      });
    } finally {
      if (_0x38b6bd?.stop) {
        _0x38b6bd.stop();
      }
    }
  }
  function _0x153177(_0x18d3d6) {
    if (!_0x18d3d6) {
      return "";
    }
    try {
      let _0x7c3b25 = String(_0x18d3d6 || "").trim();
      if (!_0x7c3b25) {
        return "";
      }
      if (_0x7c3b25.startsWith("//")) {
        _0x7c3b25 = "https:" + _0x7c3b25;
      }
      if (_0x7c3b25.startsWith("/")) {
        _0x7c3b25 = "" + window.location.origin + _0x7c3b25;
      }
      const _0x3bb689 = _0xb26a14(_0x7c3b25);
      if (_0x3bb689) {
        return "https://www.douyin.com/video/" + _0x3bb689;
      }
      return _0x7c3b25;
    } catch (_0xf23163) {
      return String(_0x18d3d6 || "").trim();
    }
  }
  function _0x37bdd4() {
    const _0x55847d = ["div[data-e2e=user-detail] div[data-e2e=user-info] h1", "#douyin-right-container div[data-e2e=user-info] h1", "#douyin-right-container h1", "h1"];
    for (const _0x3fdde3 of _0x55847d) {
      const _0x17926a = document.querySelector(_0x3fdde3);
      const _0x45853b = _0x17926a?.innerText?.trim();
      if (_0x45853b) {
        return _0x45853b.replace(/\s+/g, " ");
      }
    }
    return "";
  }
  function _0x624cf0(_0x5d55f2) {
    try {
      const _0x5f0eba = require("./douyinProfileWorkPinned");
      if (typeof _0x5f0eba?.isDouyinProfileWorkPinnedNode === "function") {
        return !!_0x5f0eba.isDouyinProfileWorkPinnedNode(_0x5d55f2);
      }
    } catch (_0x2ad552) {}
    if (!_0x5d55f2) {
      return false;
    }
    const _0x109724 = _0x5d55f2.closest?.("[data-e2e=\"user-post-item\"], [data-e2e=user-post-item], li, article") || _0x5d55f2;
    try {
      const _0x2a7a59 = Array.from(_0x109724.querySelectorAll?.("span, div, p, i, label, em") || []);
      for (const _0xf6571c of _0x2a7a59) {
        const _0x992796 = String(_0xf6571c.textContent || "").replace(/\s+/g, "").trim();
        if (_0x992796 === "置顶" || _0x992796.length <= 8 && _0x992796.includes("置顶") && !/取消/.test(_0x992796)) {
          return true;
        }
      }
      const _0x24d3f4 = String(_0x109724.innerText || "").split("\n").map(_0x93c57e => _0x93c57e.replace(/\s+/g, "").trim()).filter(Boolean);
      return _0x24d3f4.some(_0x238c63 => _0x238c63 === "置顶" || _0x238c63.length <= 8 && _0x238c63.includes("置顶"));
    } catch (_0x429239) {
      return false;
    }
  }
  function _0x4eabd5(_0x3ac2d2, _0x13372f, _0x3993d5) {
    if (!_0x3ac2d2) {
      return null;
    }
    const _0x4989c5 = _0x3ac2d2.matches?.("a[href]") ? _0x3ac2d2 : _0x3ac2d2.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"], a[href]");
    const _0x11c608 = _0x153177(_0x4989c5?.href || _0x4989c5?.getAttribute?.("href"));
    const _0x3adab9 = _0xb26a14(_0x11c608);
    if (!_0x11c608 || !_0x3adab9) {
      return null;
    }
    const _0x34d83a = _0x4989c5?.querySelector?.("img[alt]")?.getAttribute("alt") || "";
    const _0x171c09 = _0x4989c5?.getAttribute?.("aria-label") || _0x4989c5?.getAttribute?.("title") || _0x34d83a || _0x3ac2d2.innerText || "";
    const _0x41c054 = String(_0x171c09 || "").split("\n").map(_0x51851d => _0x51851d.trim()).filter(Boolean).find(_0x1da0c0 => !/^\d+$/.test(_0x1da0c0) && !/^(赞|评论|分享|置顶)$/.test(_0x1da0c0)) || (_0x3993d5 || "主播") + "的新作品 " + (_0x13372f + 1);
    return {
      url: _0x11c608,
      awemeId: _0x3adab9,
      title: _0x41c054.replace(/\s+/g, " ").slice(0, 120),
      authorName: _0x3993d5,
      rank: _0x13372f + 1,
      pinned: _0x624cf0(_0x4989c5 || _0x3ac2d2)
    };
  }
  async function _0x1fa862(_0xe7ffba, _0x517212, {
    filterPinned = false
  } = {}) {
    const _0x1ba687 = [];
    const _0x43b09c = new Set();
    const _0x3816d5 = filterPinned === true;
    const _0x586205 = _0xae75cd => {
      (_0xae75cd || []).forEach((_0x5f89ff, _0x341428) => {
        if (_0x1ba687.length >= _0xe7ffba) {
          return;
        }
        if (_0x3816d5 && _0x624cf0(_0x5f89ff)) {
          return;
        }
        const _0x15a5f7 = _0x5f89ff?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? _0x5f89ff : _0x5f89ff?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || _0x5f89ff;
        const _0x35a1cc = _0x4eabd5(_0x15a5f7 || _0x5f89ff, _0x341428, _0x517212);
        if (!_0x35a1cc || _0x43b09c.has(_0x35a1cc.awemeId)) {
          return;
        }
        if (_0x3816d5 && _0x35a1cc.pinned) {
          return;
        }
        _0x43b09c.add(_0x35a1cc.awemeId);
        _0x1ba687.push(_0x35a1cc);
      });
    };
    _0x586205(typeof _0x46e228 === "function" ? _0x46e228({
      ignoreNoWorksGuard: true
    }) : []);
    if (_0x1ba687.length >= _0xe7ffba) {
      return _0x1ba687;
    }
    const _0x1eb879 = typeof _0x3a29db === "function" && _0x3a29db() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.querySelector("#douyin-right-container") || document.body;
    const _0x537dcc = Array.from(_0x1eb879.querySelectorAll?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || []).filter(_0x18c19c);
    _0x537dcc.forEach((_0x3ed7bf, _0x319d30) => {
      if (_0x1ba687.length >= _0xe7ffba) {
        return;
      }
      if (_0x3816d5 && _0x624cf0(_0x3ed7bf)) {
        return;
      }
      const _0x1e8230 = _0x4eabd5(_0x3ed7bf, _0x319d30, _0x517212);
      if (!_0x1e8230 || _0x43b09c.has(_0x1e8230.awemeId)) {
        return;
      }
      if (_0x3816d5 && _0x1e8230.pinned) {
        return;
      }
      _0x43b09c.add(_0x1e8230.awemeId);
      _0x1ba687.push(_0x1e8230);
    });
    return _0x1ba687;
  }
  function _0x18cefd() {
    try {
      const _0x1d3bdf = String(window.location.href || "");
      if (!_0x1d3bdf.includes("/user/")) {
        return {
          gone: false,
          reason: "not_profile"
        };
      }
      const _0x190da3 = document.body;
      if (!_0x190da3) {
        return {
          gone: false,
          reason: "no_body"
        };
      }
      const _0x5311be = document.querySelector("[data-e2e=\"error-page\"], .Ms08YIEh");
      const _0x38479b = String(_0x190da3.innerText || _0x190da3.textContent || "");
      const _0x4f5da4 = /抖音号|获赞|粉丝|关注|作品|喜欢/.test(_0x38479b);
      const _0x4eba3d = /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(_0x38479b);
      if (_0x5311be || !_0x4f5da4 && _0x4eba3d) {
        return {
          gone: true,
          reason: "user_not_found"
        };
      }
      if (_0x4f5da4) {
        return {
          gone: false,
          reason: "ok"
        };
      }
      return {
        gone: false,
        reason: "unknown"
      };
    } catch (_0x42107b) {
      return {
        gone: false,
        reason: "probe_error"
      };
    }
  }
  async function _0x59ceba(_0x51b8f0 = {}) {
    const {
      requestId: _0x30ce62,
      maxWorks: _0x4c74ac,
      authorUrl: _0x32a1b7,
      filterPinned: _0x92dfa4
    } = _0x51b8f0;
    const _0x488bfe = Number.isFinite(Number(_0x4c74ac)) && Number(_0x4c74ac) > 0 ? Math.min(Math.floor(Number(_0x4c74ac)), 20) : 6;
    const _0x393799 = _0x92dfa4 === true;
    const _0x565871 = _0x1c2ae8 => {
      _0x47cc4f.send("video-monitor-author-works-result", {
        requestId: _0x30ce62,
        ..._0x1c2ae8
      });
    };
    const _0x1300ec = "MONITOR_AUTHOR_WORKS";
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      if (_0x32a1b7 && !window.location.href.includes("/user/")) {
        window.location.href = _0x32a1b7;
        await _0x5bcced(1200);
      }
      let _0x2cdba3 = 0;
      for (let _0x18b4ac = 0; _0x18b4ac < 8 && !_0x414526(_0x1300ec); _0x18b4ac += 1) {
        const _0x3e2391 = _0x18cefd();
        if (_0x3e2391.gone) {
          _0x2cdba3 += 1;
          if (_0x2cdba3 >= 3) {
            _0x565871({
              success: false,
              error: "用户不存在（主页链接失效）",
              errorCode: "USER_NOT_FOUND",
              reason: "user_not_found",
              works: [],
              authorUrl: window.location.href
            });
            return;
          }
        } else if (_0x3e2391.reason === "ok") {
          break;
        } else {
          _0x2cdba3 = 0;
        }
        await _0x5bcced(350);
      }
      const _0x576a1f = (typeof _0x37bdd4 === "function" ? _0x37bdd4() : "") || "";
      let _0x29eae3 = null;
      if (typeof _0x2e7c53 === "function") {
        try {
          _0x29eae3 = await _0x2e7c53(_0x1300ec, 8000);
        } catch (_0x3e57c2) {
          _0x29eae3 = null;
        }
      }
      if (_0x29eae3?.noWorks) {
        _0x565871({
          success: false,
          error: "主播暂无公开作品",
          works: [],
          authorName: _0x576a1f,
          worksCount: 0,
          reason: _0x29eae3.reason || "no_works",
          authorUrl: window.location.href
        });
        return;
      }
      let _0x9bd83 = await _0x1fa862(_0x488bfe, _0x576a1f, {
        filterPinned: _0x393799
      });
      if (_0x9bd83.length < _0x488bfe) {
        const _0x2a0929 = typeof _0x3a29db === "function" && _0x3a29db() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
        for (let _0x3faf5e = 0; _0x3faf5e < 4 && _0x9bd83.length < _0x488bfe; _0x3faf5e += 1) {
          try {
            _0x2a0929?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]")?.scrollBy?.(0, 700);
            window.scrollBy?.(0, 500);
          } catch (_0x5f4f64) {}
          await _0x5bcced(500);
          _0x9bd83 = await _0x1fa862(_0x488bfe, _0x576a1f, {
            filterPinned: _0x393799
          });
        }
      }
      if (_0x9bd83.length === 0) {
        const _0x99f0e5 = _0x29eae3?.worksCount ?? (typeof _0x2a9d67 === "function" ? _0x2a9d67() : null);
        const _0x414b8d = _0x99f0e5 === 0 || !!_0x29eae3?.noWorks;
        _0x565871({
          success: false,
          error: _0x414b8d ? "主播暂无公开作品" : "未解析到作品链接，请确认主页可访问",
          works: [],
          authorName: _0x576a1f,
          worksCount: _0x99f0e5,
          reason: _0x414b8d ? "no_works" : "no_video_cards",
          authorUrl: window.location.href
        });
        return;
      }
      _0x565871({
        success: true,
        works: _0x9bd83,
        authorName: _0x576a1f,
        worksCount: _0x29eae3?.worksCount ?? _0x9bd83.length,
        authorUrl: window.location.href
      });
    } catch (_0x239efc) {
      _0x565871({
        success: false,
        error: _0x239efc.message,
        works: []
      });
    }
  }
  function _0x27ab7d(_0x4e98b6, _0x234061) {
    const _0x174e02 = String(_0x4e98b6 || _0xb26a14(_0x234061) || _0xfc142b(_0x234061) || "").trim();
    const _0x240e00 = _0x2f3b25(24);
    for (const _0x28dcdb of _0x240e00) {
      const _0x46ea44 = _0x28dcdb?.href || _0x28dcdb?.getAttribute?.("href") || "";
      const _0x2fb915 = _0xb26a14(_0x46ea44) || _0xfc142b(_0x46ea44);
      if (_0x174e02 && _0x2fb915 && String(_0x2fb915) === _0x174e02) {
        return _0x28dcdb;
      }
    }
    return null;
  }
  async function _0x55dbd3(_0x5f15dd, _0xfa43fc, _0x18a20f) {
    let _0x1a29e3 = _0x27ab7d(_0x5f15dd, _0xfa43fc);
    if (_0x1a29e3) {
      return _0x1a29e3;
    }
    if (typeof _0x5c8776 === "function") {
      try {
        await _0x5c8776(_0x18a20f);
      } catch (_0x297952) {}
    }
    const _0x4fc5c4 = typeof _0x3a29db === "function" && _0x3a29db() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
    for (let _0x29ef16 = 0; _0x29ef16 < 6 && !_0x1a29e3; _0x29ef16 += 1) {
      try {
        const _0x202d9d = _0x4fc5c4?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]") || _0x4fc5c4;
        _0x202d9d?.scrollBy?.(0, 700);
        window.scrollBy?.(0, 500);
      } catch (_0x329c47) {}
      await _0x5bcced(450);
      _0x1a29e3 = _0x27ab7d(_0x5f15dd, _0xfa43fc);
    }
    return _0x1a29e3;
  }
  function _0x122a6d() {
    const _0x4e4a62 = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[data-e2e=\"video-player-container\"]", "[class*=\"VideoDetail\"]", "[class*=\"video-detail\"]", "[class*=\"DetailModal\"]", "[class*=\"detail-modal\"]", "[class*=\"SearchDetail\"]", "[role=\"dialog\"]"];
    for (const _0x476c1e of _0x4e4a62) {
      try {
        const _0x28de88 = document.querySelectorAll(_0x476c1e);
        for (const _0x224f7a of _0x28de88) {
          if (!_0x224f7a) {
            continue;
          }
          const _0xa2ed57 = getVideoEngageSelector({
            getVideoEngagePack: _0x2758ee
          }, "likeSelectors");
          const _0x35f981 = _0xa2ed57 ? "video, [data-e2e=\"video-player\"], .xgplayer, img, canvas, " + _0xa2ed57 : "video, [data-e2e=\"video-player\"], .xgplayer, img, canvas";
          const _0xcc2c28 = !!_0x224f7a.querySelector?.(_0x35f981);
          const _0x51a247 = !!_0x224f7a.querySelector?.("[data-e2e=\"video-player-close-icon\"], [aria-label=\"关闭\"], [class*=\"close\"]");
          if (_0xcc2c28 || _0x51a247 || /video-detail|VideoDetail|modal-video/i.test(_0x476c1e)) {
            return _0x224f7a;
          }
        }
      } catch (_0x4a8a8f) {}
    }
    return null;
  }
  function _0x2280da(_0x5494f3) {
    const _0x36976d = String(_0x5494f3 || "").trim();
    try {
      if (typeof _0x32ff66 === "function" && _0x32ff66(_0x36976d)) {
        return true;
      }
    } catch (_0x252486) {}
    try {
      if (typeof _0x5b1fbe === "function" && !_0x5b1fbe(_0x36976d)) {
        return false;
      }
    } catch (_0x368232) {}
    const _0x11965f = String(window.location.href || "");
    if (/\/(?:video|note)\//.test(_0x11965f)) {
      const _0x18e777 = getVideoEngageSelector({
        getVideoEngagePack: _0x2758ee
      }, "likeSelectors");
      return !!document.querySelector("video, [data-e2e=\"video-player\"], .xgplayer") || !!_0x18e777 && !!document.querySelector(_0x18e777);
    }
    if (!/\/jingxuan/.test(_0x11965f) && !/modal_id=/.test(_0x11965f)) {
      return false;
    }
    if (_0x122a6d()) {
      return true;
    }
    const _0x1bb9b7 = getVideoEngageSelector({
      getVideoEngagePack: _0x2758ee
    }, "likeSelectors");
    if (_0x1bb9b7 && document.querySelector(_0x1bb9b7)) {
      return true;
    }
    try {
      const _0x4cfcd1 = typeof _0x2c3369 === "function" ? _0x2c3369(_0x36976d) : null;
      if (_0x4cfcd1?.status === "ready") {
        return true;
      }
    } catch (_0x4855a0) {}
    return false;
  }
  async function _0x1e1ba8(_0x15ed16, _0x129d39 = "", _0x1872b3 = 35000) {
    const _0x3d1d95 = String(_0x129d39 || "").trim();
    try {
      _0x3f7df9();
    } catch (_0x29317a) {}
    const _0x5ea8ae = Date.now();
    let _0x1836fe = 0;
    let _0x14072b = 0;
    const _0x2dda1a = 28000;
    const _0x303bf0 = 18000;
    const _0x125d70 = Math.max(12000, Math.min(70000, Number(_0x1872b3) || 35000));
    while (!_0x414526(_0x15ed16) && Date.now() - _0x5ea8ae < _0x125d70) {
      try {
        const _0xd218e8 = _0x122a6d() || (typeof _0x2e5c6f === "function" ? _0x2e5c6f({
          includeFeed: false
        }) : null);
        const _0x48d874 = _0xd218e8 || (typeof _0x26fde2 === "function" ? _0x26fde2() : null) || document;
        _0x32621a(_0x48d874, "监控：等待视频有效性确认期间暂停");
      } catch (_0x294d12) {}
      if (_0x2280da(_0x3d1d95)) {
        return {
          status: "ready",
          cancelled: false
        };
      }
      let _0x2bf877 = "waiting";
      try {
        if (typeof _0x3b16ef === "function") {
          _0x2bf877 = _0x3b16ef(_0x3d1d95);
        }
      } catch (_0x3a089f) {
        _0x2bf877 = "waiting";
      }
      if (_0x2bf877 === "ready") {
        return {
          status: "ready",
          cancelled: false
        };
      }
      if (_0x2bf877 === "unavailable") {
        _0x1836fe += 1;
        if (_0x1836fe >= 8 && Date.now() - _0x5ea8ae >= _0x303bf0) {
          return {
            status: "unavailable",
            reason: "unavailable",
            cancelled: false
          };
        }
      } else {
        _0x1836fe = 0;
      }
      if (_0x2bf877 === "loading") {
        _0x14072b = 0;
        _0x1836fe = 0;
        await _0x5bcced(500);
        continue;
      }
      if (_0x2bf877 === "bare_jingxuan") {
        _0x14072b += 1;
        if (_0x14072b >= 10 && Date.now() - _0x5ea8ae >= _0x2dda1a && !_0x122a6d()) {
          return {
            status: "bare_jingxuan",
            reason: "bare_jingxuan",
            cancelled: false
          };
        }
      } else {
        _0x14072b = 0;
      }
      await _0x5bcced(400);
    }
    if (_0x414526(_0x15ed16)) {
      return {
        status: "cancelled",
        cancelled: true
      };
    }
    if (_0x2280da(_0x3d1d95)) {
      return {
        status: "ready",
        cancelled: false
      };
    }
    return {
      status: "timeout",
      cancelled: false
    };
  }
  async function _0x4a1943(_0xf95784 = {}) {
    const {
      requestId: _0x3b53e9,
      videoUrl: _0x4b6bea,
      timeoutMs: _0x381272
    } = _0xf95784;
    const _0x125f8e = _0x43ff6e => {
      _0x47cc4f.send("video-monitor-nav-result", {
        requestId: _0x3b53e9,
        ..._0x43ff6e
      });
    };
    const _0x5753e2 = "MONITOR_WAIT_READY";
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      const _0x59b189 = String(_0x4b6bea || "").trim();
      const _0x2b7ca6 = Number.isFinite(Number(_0x381272)) && Number(_0x381272) > 0 ? Math.min(70000, Math.max(12000, Math.floor(Number(_0x381272)))) : 35000;
      const _0x1af8cb = await _0x1e1ba8(_0x5753e2, _0x59b189, _0x2b7ca6);
      const _0x461bfe = _0x1af8cb.status === "ready" ? "ready" : _0x1af8cb.status === "unavailable" ? "unavailable" : _0x1af8cb.status === "cancelled" ? "aborted" : "timeout";
      const _0x5e0062 = _0x461bfe === "ready";
      const _0xa3d56b = _0x461bfe === "unavailable";
      const _0x130c2e = _0x122a6d() || (typeof _0x2e5c6f === "function" ? _0x2e5c6f({
        includeFeed: false
      }) : null);
      const _0x39eba8 = _0x130c2e || _0x26fde2?.() || document;
      try {
        _0x32621a(_0x39eba8, "监控：视频就绪后暂停");
      } catch (_0x489805) {}
      const _0x2c3205 = typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0x39eba8) || "" : window.location.href || "";
      _0x125f8e({
        success: !!_0x5e0062,
        ready: !!_0x5e0062,
        unavailable: _0xa3d56b,
        reason: _0xa3d56b ? _0x1af8cb.reason || "unavailable" : _0x1af8cb.status === "bare_jingxuan" ? "bare_jingxuan_soft" : "",
        status: _0x461bfe,
        videoUrl: _0x2c3205 || _0x59b189,
        error: _0x5e0062 ? "" : _0xa3d56b ? "视频失效或无法打开" : _0x461bfe === "aborted" ? "已取消" : "视频页未就绪"
      });
    } catch (_0x409491) {
      if (String(_0x409491?.message || _0x409491) === "TASK_ABORTED") {
        _0x125f8e({
          success: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      _0x125f8e({
        success: false,
        ready: false,
        error: _0x409491?.message || String(_0x409491)
      });
    }
  }
  async function _0x11239b(_0x2bf1f6 = {}) {
    const {
      requestId: _0x2b7cc7,
      videoUrl: _0x51cdb2,
      expectedAuthorUrl: _0x1e2524,
      expectedSecUid: _0x5ee77d,
      timeoutMs: _0x196f34
    } = _0x2bf1f6;
    const _0x155620 = _0x3d8bf2 => {
      _0x47cc4f.send("video-monitor-nav-result", {
        requestId: _0x2b7cc7,
        ..._0x3d8bf2
      });
    };
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      const _0x15969d = _0x2942b7(_0x1e2524, _0x5ee77d);
      if (!_0x15969d) {
        _0x155620({
          success: true,
          matched: true,
          skipped: true,
          reason: "no_expected_author"
        });
        return;
      }
      const _0x1aa24e = _0x122a6d() || (typeof _0x2e5c6f === "function" ? _0x2e5c6f({
        includeFeed: false
      }) : null);
      const _0x4d932d = _0x1aa24e || _0x26fde2?.() || document;
      try {
        _0x32621a(_0x4d932d, "监控：确认博主前暂停");
      } catch (_0x2bb05c) {}
      const _0x299e3d = Number.isFinite(Number(_0x196f34)) && Number(_0x196f34) > 0 ? Math.min(12000, Math.max(2000, Math.floor(Number(_0x196f34)))) : 6000;
      const _0x175288 = await _0x36f525(_0x4d932d, {
        expectedVideoUrl: _0x51cdb2,
        expectedAuthorUrl: _0x1e2524,
        expectedSecUid: _0x5ee77d,
        timeoutMs: _0x299e3d
      });
      const _0x5aa7c9 = _0x175288.author || {};
      _0x155620({
        success: !!_0x175288.ok,
        matched: !!_0x175288.ok,
        authorMismatch: !!_0x175288.authorMismatch,
        authorUnconfirmed: !!_0x175288.authorUnconfirmed,
        nickname: String(_0x5aa7c9.nickname || "").trim(),
        authorUrl: String(_0x5aa7c9.profileUrl || "").trim(),
        pageUrl: String(_0x5aa7c9.pageUrl || window.location.href || "").trim(),
        secUid: String(_0x5aa7c9.secUid || _0x5aa7c9.pageSecUid || "").trim(),
        videoUrl: typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0x4d932d) || window.location.href || "" : window.location.href || "",
        error: _0x175288.ok ? "" : _0x175288.authorMismatch ? "当前作品不是目标博主" : "未能确认当前作品博主"
      });
    } catch (_0x206eab) {
      if (String(_0x206eab?.message || _0x206eab) === "TASK_ABORTED") {
        _0x155620({
          success: false,
          matched: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      _0x155620({
        success: false,
        matched: false,
        error: _0x206eab?.message || String(_0x206eab)
      });
    }
  }
  async function _0x410ed4(_0x18f48f = {}) {
    const {
      requestId: _0x21a43,
      videoUrl: _0x1e4e69
    } = _0x18f48f;
    const _0x165cd6 = _0x344846 => {
      _0x47cc4f.send("video-monitor-nav-result", {
        requestId: _0x21a43,
        ..._0x344846
      });
    };
    const _0xf05ceb = "MONITOR_OPEN_SPECIFIC";
    const _0x2a8947 = 35000;
    const _0x695afd = 3;
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      const _0xa4e7 = String(_0x1e4e69 || "").trim();
      if (!_0xa4e7) {
        _0x165cd6({
          success: false,
          ready: false,
          status: "timeout",
          error: "缺少视频链接"
        });
        return;
      }
      const _0x44d438 = typeof _0x150161 === "function" ? _0x150161(_0xa4e7) : _0xa4e7;
      try {
        const _0x2f7980 = _0xb26a14(_0x44d438 || _0xa4e7);
        if (_0x2f7980 && typeof _0x3bae7b === "function") {
          _0x3bae7b(_0x2f7980, {
            openAttempt: 0,
            loadStartedAt: Date.now(),
            count: 0,
            probing: false,
            probed: false
          });
        }
      } catch (_0x16bf14) {}
      let _0x124539 = "timeout";
      let _0x1c7346 = "";
      for (let _0xd967b6 = 1; _0xd967b6 <= _0x695afd; _0xd967b6 += 1) {
        if (_0x414526(_0xf05ceb)) {
          _0x124539 = "aborted";
          break;
        }
        const _0x2c5766 = typeof _0x5b1fbe === "function" ? _0x5b1fbe(_0x44d438 || _0xa4e7) : false;
        if (!_0x2c5766 || _0xd967b6 > 1) {
          try {
            window.location.href = _0x44d438 || _0xa4e7;
            if (typeof _0x35bd5d === "function") {
              await _0x35bd5d(_0xf05ceb);
            } else {
              await _0x5bcced(1500);
            }
          } catch (_0x1efe57) {}
        }
        const _0xd6013 = await _0x1e1ba8(_0xf05ceb, _0x44d438 || _0xa4e7, _0x2a8947);
        if (_0xd6013.status === "ready") {
          _0x124539 = "ready";
          _0x1c7346 = "";
          break;
        }
        if (_0xd6013.status === "unavailable") {
          _0x124539 = "unavailable";
          _0x1c7346 = _0xd6013.reason || "unavailable";
          break;
        }
        if (_0xd6013.status === "cancelled") {
          _0x124539 = "aborted";
          break;
        }
        _0x124539 = "timeout";
        _0x1c7346 = _0xd6013.reason || _0xd6013.status || "timeout";
        if (_0xd967b6 < _0x695afd) {
          console.warn("[Monitor-Open] 第 " + _0xd967b6 + "/" + _0x695afd + " 次精选未就绪" + ((_0xd6013.status === "bare_jingxuan" ? "（精选空壳，慢网重试）" : "") + "，同链重进…"));
        }
      }
      const _0x100d29 = _0x124539 === "ready";
      const _0x2da34f = _0x124539 === "unavailable";
      const _0x4dd6c6 = _0x122a6d() || (typeof _0x2e5c6f === "function" ? _0x2e5c6f({
        includeFeed: false
      }) : null);
      const _0xf78d49 = _0x4dd6c6 || _0x26fde2?.() || document;
      try {
        _0x32621a(_0xf78d49, "监控：指定视频打开后暂停");
      } catch (_0x5ec228) {}
      const _0x28dc61 = typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0xf78d49) || "" : window.location.href || "";
      _0x165cd6({
        success: _0x100d29,
        ready: _0x100d29,
        status: _0x124539,
        unavailable: _0x2da34f,
        reason: _0x2da34f ? _0x1c7346 || "unavailable" : _0x1c7346 || "",
        videoUrl: _0x28dc61 || _0x44d438 || _0xa4e7,
        error: _0x100d29 ? "" : _0x2da34f ? "视频失效或无法打开" : _0x124539 === "aborted" ? "已取消" : "指定视频打开超时"
      });
    } catch (_0x3114a0) {
      if (String(_0x3114a0?.message || _0x3114a0) === "TASK_ABORTED") {
        _0x165cd6({
          success: false,
          cancelled: true,
          status: "aborted",
          error: "已取消"
        });
        return;
      }
      _0x165cd6({
        success: false,
        ready: false,
        status: "timeout",
        error: _0x3114a0?.message || String(_0x3114a0)
      });
    }
  }
  async function _0x8436f9(_0x5ab5c1, _0x42d1ab, _0xc40875 = "") {
    const _0x37519 = _0x42d1ab || document.body;
    const _0x576f56 = 40000;
    const _0x308243 = Date.now() + _0x576f56;
    const _0x11f6e7 = async (_0x340c23 = 1) => {
      let _0x58e4ff = false;
      const _0x59f2ed = _0x308243 - Date.now();
      if (_0x59f2ed <= 800) {
        return false;
      }
      try {
        const _0x10dbd1 = typeof _0x54fe96 === "function" ? _0x54fe96() : null;
        if (_0x10dbd1?.openEntityCommentPanel) {
          const _0x593c48 = typeof _0x565d44 === "function" ? _0x565d44() : {};
          const _0x3176b1 = _0x340c23 >= 2;
          const _0x22911c = await _0x10dbd1.openEntityCommentPanel({
            ..._0x593c48,
            token: Date.now(),
            taskId: _0xc40875 || "",
            scope: _0x37519,
            loopId: _0x5ab5c1,
            getCommentTabPrefix: typeof _0x2e34d4 === "function" ? _0x2e34d4 : () => "评论",
            isVisibleElement: _0x18c19c,
            simulateHumanClick: typeof _0x328f21 === "function" ? _0x328f21 : null,
            waitFn: async _0x268b1e => {
              if (Date.now() >= _0x308243 || _0x414526(_0x5ab5c1)) {
                return false;
              }
              await _0x5bcced(Math.min(_0x268b1e, Math.max(0, _0x308243 - Date.now())));
              return !_0x414526(_0x5ab5c1) && Date.now() < _0x308243;
            },
            isCancelled: () => _0x414526(_0x5ab5c1) || Date.now() >= _0x308243,
            logFn: () => {},
            postTabWaitMs: _0x3176b1 ? 1200 : 900,
            postIconWaitMs: _0x3176b1 ? 1400 : 1100,
            postTabAgainWaitMs: _0x3176b1 ? 1000 : 800,
            maxInspectRounds: _0x3176b1 ? 18 : 14,
            inspectIntervalMs: _0x3176b1 ? 1000 : 850
          });
          _0x58e4ff = !!_0x22911c?.opened;
        }
      } catch (_0x169900) {
        console.warn("[Monitor-Scrape] 共用开评路径异常:", _0x169900?.message || _0x169900);
      }
      if (!_0x58e4ff && typeof _0x342015 === "function" && Date.now() < _0x308243) {
        try {
          _0x58e4ff = !!(await _0x342015(_0x37519, _0x5ab5c1, {
            deadlineAt: Math.min(_0x308243, Date.now() + (_0x340c23 >= 2 ? 18000 : 14000))
          }));
        } catch (_0x3752a0) {}
      }
      return _0x58e4ff;
    };
    if (_0x414526(_0x5ab5c1)) {
      return false;
    }
    for (let _0x5d5399 = 1; _0x5d5399 <= 2; _0x5d5399 += 1) {
      if (_0x414526(_0x5ab5c1) || Date.now() >= _0x308243) {
        return false;
      }
      const _0xb2ffe5 = await _0x11f6e7(_0x5d5399);
      if (_0xb2ffe5) {
        return true;
      }
      console.warn("[Monitor-Scrape] 第 " + _0x5d5399 + "/2 次打开评论区未成功，继续重试…");
      if (_0x5d5399 < 2) {
        try {
          await _0x5bcced(900);
        } catch (_0x34b47e) {}
      }
    }
    return false;
  }
  function _0x2f3b25(_0x1f04cb = 12) {
    const _0x4bf1f7 = [];
    const _0x3a3715 = new Set();
    const _0x52aa2c = _0x507a2b => {
      if (!_0x507a2b || _0x4bf1f7.length >= _0x1f04cb) {
        return;
      }
      const _0x70076a = _0x507a2b.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") ? _0x507a2b : _0x507a2b.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || null;
      const _0x3b0b28 = _0x70076a || _0x507a2b;
      const _0x4a95dc = String(_0x3b0b28?.href || _0x3b0b28?.getAttribute?.("href") || "").trim();
      const _0x5ca42b = _0xb26a14(_0x4a95dc) || _0xfc142b(_0x4a95dc) || "";
      const _0x540610 = _0x5ca42b || _0x4a95dc || _0x3b0b28?.outerHTML?.slice(0, 60);
      if (!_0x540610 || _0x3a3715.has(_0x540610)) {
        return;
      }
      if (!_0x5ca42b && !/\/video\/|\/note\/|modal_id=/.test(_0x4a95dc)) {
        return;
      }
      _0x3a3715.add(_0x540610);
      _0x4bf1f7.push(_0x3b0b28);
    };
    const _0x133055 = typeof _0x3a29db === "function" && _0x3a29db() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.querySelector("#douyin-right-container") || document.body;
    const _0x245de9 = ["a[href*=\"/video/\"]", "a[href*=\"/note/\"]", "a[href*=\"modal_id\"]", "[data-e2e=\"user-post-item\"]", "ul[data-e2e=scroll-list] > li", "ul[data-e2e=\"scroll-list\"] > li", "[role=\"listitem\"]"];
    for (const _0x92649c of _0x245de9) {
      try {
        Array.from(_0x133055.querySelectorAll?.(_0x92649c) || []).forEach(_0x52aa2c);
      } catch (_0x508f1c) {}
      if (_0x4bf1f7.length >= _0x1f04cb) {
        break;
      }
    }
    return _0x4bf1f7;
  }
  function _0x3f5e95(_0xb9e618, {
    skipPinned = false
  } = {}) {
    const _0x475ede = Array.isArray(_0xb9e618) ? _0xb9e618 : [];
    if (!skipPinned) {
      return _0x475ede[0] || null;
    }
    return _0x475ede.find(_0x1e151a => !_0x624cf0(_0x1e151a)) || null;
  }
  async function _0x597132(_0xe0f454, _0x1c79fb = {}) {
    const _0xb74f09 = _0x1c79fb.knownHasWorks === true;
    const _0x73c9cb = _0x1c79fb.skipPinned === true;
    const _0x34035e = _0x73c9cb ? 20 : 8;
    if (!_0xb74f09 && typeof _0x2e7c53 === "function") {
      try {
        const _0x18da3e = await _0x2e7c53(_0xe0f454, 6000);
        if (_0x18da3e?.noWorks) {
          return null;
        }
      } catch (_0x1059a2) {}
    } else if (typeof _0x5c8776 === "function") {
      try {
        await _0x5c8776(_0xe0f454);
      } catch (_0x35f896) {}
    }
    let _0x3c5778 = _0x2f3b25(_0x34035e);
    let _0x43c64b = _0x3f5e95(_0x3c5778, {
      skipPinned: _0x73c9cb
    });
    if (_0x43c64b) {
      return _0x43c64b;
    }
    const _0xd664c0 = typeof _0x3a29db === "function" && _0x3a29db() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
    const _0x2fcab8 = _0xb74f09 ? 6 : 3;
    for (let _0xa3a6a = 0; _0xa3a6a < _0x2fcab8 && !_0x43c64b; _0xa3a6a += 1) {
      try {
        const _0x4e49bd = _0xd664c0?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]") || _0xd664c0;
        _0x4e49bd?.scrollBy?.(0, 500);
        window.scrollBy?.(0, 400);
      } catch (_0x1edc7e) {}
      await _0x5bcced(_0xb74f09 ? 400 : 300);
      _0x3c5778 = _0x2f3b25(_0x34035e);
      _0x43c64b = _0x3f5e95(_0x3c5778, {
        skipPinned: _0x73c9cb
      });
    }
    return _0x43c64b || null;
  }
  async function _0x565b45(_0x37035d = {}) {
    const {
      requestId: _0x51ef5e,
      awemeId: _0x408da1,
      url: _0x4a1bd6,
      preferFirstCard: _0x42ce82,
      skipPinnedCards: _0x18c627,
      knownHasWorks: _0x1cae18,
      authorUrl: _0x1d44d3,
      allowUrlFallback: _0x331ffe
    } = _0x37035d;
    const _0x53b4e7 = _0x331ffe !== false;
    const _0x5390df = _0x39fab5 => {
      _0x47cc4f.send("video-monitor-nav-result", {
        requestId: _0x51ef5e,
        ..._0x39fab5
      });
    };
    const _0x1f7c64 = "MONITOR_OPEN_AUTHOR_WORK";
    const _0x2f5f09 = (_0x35e97f, _0x44d71f = {}) => {
      const _0x24c7e3 = "[Monitor-Open] " + _0x35e97f;
      console.log(_0x24c7e3, Object.keys(_0x44d71f).length ? _0x44d71f : "");
      return _0x24c7e3;
    };
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      try {
        if (!_0x35732d.currentViewKey) {
          _0x35732d.currentViewKey = window.__radar_view_key || _0x2d3c03("radar_view_key") || null;
        }
      } catch (_0x1335a1) {}
      const _0x37d1ff = String(_0x408da1 || _0xb26a14(_0x4a1bd6) || "").trim();
      const _0x48cdf2 = String(_0x1d44d3 || "").trim() || (window.location.href.includes("/user/") ? window.location.href : "");
      const _0x47997f = _0x42ce82 !== false;
      const _0x3b2900 = _0x18c627 === true;
      const _0x2e7740 = [];
      _0x2f5f09("start abort=" + _0x414526(_0x1f7c64) + " stop=" + _0x35732d.stopRequested + " taskRunning=" + _0x35732d.taskRunning + " viewKey=" + (_0x35732d.currentViewKey || "none") + " skipPinned=" + _0x3b2900 + " href=" + String(window.location.href || "").slice(0, 80));
      _0x2e7740.push("abort=" + _0x414526(_0x1f7c64) + ",viewKey=" + !!_0x35732d.currentViewKey + ",skipPinned=" + _0x3b2900);
      if (!window.location.href.includes("/user/") && _0x48cdf2) {
        window.location.href = _0x48cdf2.split("?")[0];
        await _0x5bcced(1500);
      }
      if (!window.location.href.includes("/user/")) {
        _0x5390df({
          success: false,
          reason: "not_on_profile",
          error: "当前不在主播主页",
          debug: _0x2e7740.join("|")
        });
        return;
      }
      let _0x1044b6 = null;
      let _0x2d8710 = "";
      if (_0x47997f) {
        const _0x58cde6 = typeof _0x46e228 === "function" ? _0x46e228({
          ignoreNoWorksGuard: true
        }) : [];
        _0x1044b6 = _0x3f5e95(_0x58cde6, {
          skipPinned: _0x3b2900
        });
        if (_0x1044b6) {
          _0x2d8710 = _0x3b2900 ? "shared_non_pinned" : "shared";
        } else {
          _0x1044b6 = await _0x597132(_0x1f7c64, {
            knownHasWorks: _0x1cae18 === true || !!_0x37d1ff,
            skipPinned: _0x3b2900
          });
          _0x2d8710 = _0x1044b6 ? _0x3b2900 ? "monitor_non_pinned" : "monitor" : "";
        }
      }
      if (!_0x1044b6 && _0x37d1ff) {
        _0x1044b6 = await _0x55dbd3(_0x37d1ff, _0x4a1bd6, _0x1f7c64);
        if (_0x1044b6) {
          _0x2d8710 = "by_id";
        }
      }
      const _0xcb5fe2 = _0x1044b6?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? _0x1044b6 : _0x1044b6?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || _0x1044b6;
      const _0x51eeb0 = _0xcb5fe2?.href || _0xcb5fe2?.getAttribute?.("href") || "";
      let _0x3db9af = _0xb26a14(_0x51eeb0) || _0xfc142b(_0x51eeb0) || _0x37d1ff;
      const _0x542254 = _0xcb5fe2?.getBoundingClientRect?.() || null;
      _0x2f5f09("card source=" + (_0x2d8710 || "none") + " clickId=" + (_0x3db9af || "none") + " href=" + String(_0x51eeb0).slice(0, 60) + " size=" + (_0x542254 ? Math.round(_0x542254.width) + "x" + Math.round(_0x542254.height) : "n/a"));
      _0x2e7740.push("card=" + (_0x2d8710 || "none") + ",id=" + (_0x3db9af || "none") + ",size=" + (_0x542254 ? Math.round(_0x542254.width) + "x" + Math.round(_0x542254.height) : 0));
      try {
        window.focus?.();
      } catch (_0x38cd2c) {}
      try {
        if (_0x35732d.currentViewKey) {
          _0x47cc4f.send("focus-automation-view", {
            viewKey: _0x35732d.currentViewKey,
            bringToFront: false
          });
        }
      } catch (_0xa72139) {
        _0x2f5f09("focus soft failed: " + (_0xa72139?.message || _0xa72139));
        _0x2e7740.push("focus_soft_fail");
      }
      let _0x3c221a = false;
      if (_0xcb5fe2 && !_0x414526(_0x1f7c64)) {
        try {
          _0x2f5f09("simulateHumanClick abort=" + _0x414526(_0x1f7c64));
          await _0x328f21(_0xcb5fe2, _0x1f7c64);
          _0x3c221a = true;
          _0x2e7740.push("clicked");
        } catch (_0x5bef8f) {
          const _0x151bb2 = String(_0x5bef8f?.message || _0x5bef8f);
          _0x2f5f09("click error: " + _0x151bb2);
          _0x2e7740.push("click_err=" + _0x151bb2);
          if (_0x151bb2 === "TASK_ABORTED") {
            throw _0x5bef8f;
          }
        }
      } else if (!_0xcb5fe2) {
        _0x2e7740.push("no_card");
      } else {
        _0x2e7740.push("skip_click_aborted");
      }
      let _0x4d03b9 = false;
      if (_0x3c221a) {
        if (typeof _0x23cec6 === "function") {
          const _0x1c423a = await _0x23cec6(_0x1f7c64, _0x3db9af || "", {
            maxWaitMs: 6500
          });
          _0x4d03b9 = !!_0x1c423a;
          _0x2f5f09("detailScope ready=" + _0x4d03b9 + " diag=" + (_0x35732d.lastProfileVideoDetailDiagnostic || ""));
          _0x2e7740.push("scope=" + _0x4d03b9);
          if (!_0x3db9af && typeof _0xa8f20d === "function") {
            _0x3db9af = _0xa8f20d() || _0x3db9af;
          }
        }
        if (!_0x4d03b9) {
          _0x4d03b9 = await _0x3d6401(_0x1f7c64, _0x3db9af ? "https://www.douyin.com/video/" + _0x3db9af : _0x4a1bd6 || "", 4000);
          _0x2e7740.push("readyWait=" + _0x4d03b9);
        }
      }
      if (!_0x4d03b9 && _0x3db9af && _0x53b4e7) {
        const _0x43a08d = typeof _0x5324d7 === "function" ? _0x5324d7(_0x3db9af) : "https://www.douyin.com/jingxuan?modal_id=" + _0x3db9af;
        _0x2f5f09("click no detail → jingxuan " + _0x43a08d);
        _0x2e7740.push("fallback_jingxuan");
        try {
          window.location.href = _0x43a08d;
          _0x4d03b9 = await _0x3d6401(_0x1f7c64, "https://www.douyin.com/video/" + _0x3db9af, 10000);
          if (_0x4d03b9) {
            _0x5390df({
              success: true,
              videoUrl: "https://www.douyin.com/video/" + _0x3db9af,
              awemeId: _0x3db9af,
              matched: true,
              reason: "opened_via_jingxuan_modal_id",
              error: "",
              debug: _0x2e7740.join("|")
            });
            return;
          }
        } catch (_0x5b3ec5) {
          if (String(_0x5b3ec5?.message || _0x5b3ec5) === "TASK_ABORTED") {
            throw _0x5b3ec5;
          }
          _0x2e7740.push("jingxuan_err=" + (_0x5b3ec5?.message || _0x5b3ec5));
        }
      } else if (!_0x4d03b9 && _0x3db9af && !_0x53b4e7) {
        _0x2e7740.push("url_fallback_disabled");
      }
      const _0x5a63ff = _0x2e5c6f({
        includeFeed: true
      });
      const _0x18019a = _0x5a63ff && _0x18c19c(_0x5a63ff) ? _0x5a63ff : _0x26fde2() || document;
      try {
        _0x32621a(_0x18019a, "监控：打开作品后暂停");
      } catch (_0x2c0091) {}
      const _0x3d1f0e = typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0x18019a) || "" : window.location.href || "";
      const _0x519c08 = _0xb26a14(_0x3d1f0e) || _0xfc142b(_0x3d1f0e) || _0xb26a14(window.location.href) || (_0x4d03b9 ? _0x3db9af : "");
      const _0xa84673 = _0x47997f ? !!_0x519c08 : !_0x37d1ff || !!_0x519c08 && String(_0x519c08) === _0x37d1ff;
      const _0x230451 = !!_0x4d03b9 && !!_0xa84673 && !!_0x519c08;
      _0x2f5f09("finish ok=" + _0x230451 + " openedId=" + (_0x519c08 || "none") + " ready=" + _0x4d03b9 + " steps=" + _0x2e7740.join("|"));
      _0x5390df({
        success: _0x230451,
        videoUrl: _0x3d1f0e || (_0x519c08 ? "https://www.douyin.com/video/" + _0x519c08 : ""),
        awemeId: _0x519c08 || "",
        matched: _0xa84673,
        reason: _0x4d03b9 ? _0xa84673 ? _0x3c221a ? "opened_first_card" : "opened" : "mismatch" : _0x1044b6 ? "click_no_detail" : "card_not_found",
        error: _0x4d03b9 ? _0xa84673 ? "" : "打开后作品不匹配" : _0x1044b6 ? "已点卡片但详情未打开" : "主页未找到作品卡片",
        debug: _0x2e7740.join("|")
      });
    } catch (_0x49b5b2) {
      if (String(_0x49b5b2?.message || _0x49b5b2) === "TASK_ABORTED") {
        _0x5390df({
          success: false,
          cancelled: true,
          reason: "aborted",
          error: "已取消",
          debug: "abort stop=" + _0x35732d.stopRequested + " taskRunning=" + _0x35732d.taskRunning + " activeLoop=" + (_0x35732d.activeLoopId || "")
        });
        return;
      }
      _0x5390df({
        success: false,
        error: _0x49b5b2?.message || String(_0x49b5b2)
      });
    }
  }
  async function _0x54e07f(_0x9eea68 = {}) {
    const {
      requestId: _0x3322bf,
      expectedAwemeId: _0x5a8ae0,
      requireMatch: _0x5eb7a7
    } = _0x9eea68;
    const _0x21a71c = _0x4b2375 => {
      _0x47cc4f.send("video-monitor-nav-result", {
        requestId: _0x3322bf,
        ..._0x4b2375
      });
    };
    const _0x3ddaa3 = "MONITOR_MOVE_NEXT";
    try {
      if (!_0x35732d.taskRunning) {
        _0x35732d.stopRequested = false;
      }
      const _0x22ae52 = String(_0x5a8ae0 || "").trim();
      const _0x5bfee2 = _0x5eb7a7 === true;
      const _0x1df49d = typeof _0x2e5c6f === "function" ? _0x2e5c6f({
        includeFeed: true
      }) : null;
      const _0x30679a = typeof _0x23a3bb === "function" ? _0x23a3bb(window.location.href) : /\/video\/|\/note\/|modal_id=/.test(window.location.href || "");
      if ((!_0x1df49d || !_0x18c19c(_0x1df49d)) && !_0x30679a) {
        _0x21a71c({
          success: false,
          continued: false,
          reason: "no_video_surface",
          error: "当前不在视频详情"
        });
        return;
      }
      const _0xbc0c4d = _0x26fde2?.() || _0x1df49d || document;
      const _0x49d26d = typeof _0xc0a38a === "function" ? _0xc0a38a(_0xbc0c4d) || "" : "";
      const _0x55e7dc = typeof _0x446071 === "function" ? String(_0x446071() || "") : "";
      const _0x22ee6d = typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0xbc0c4d) || "" : "";
      const _0x28048a = _0xb26a14(_0x22ee6d) || _0xfc142b(_0x22ee6d) || _0xb26a14(window.location.href) || "";
      await _0x54a462(_0x3ddaa3);
      let _0x42af4a = false;
      if (typeof _0x4c10c9 === "function") {
        _0x42af4a = await _0x4c10c9(_0x3ddaa3, {
          previousIdentity: _0x49d26d,
          previousTitle: _0x55e7dc,
          leadVideoUrl: _0x22ee6d || (_0x28048a ? "https://www.douyin.com/video/" + _0x28048a : ""),
          dedupKey: _0x28048a,
          phaseLabel: "监控主页切条",
          preferredScope: null,
          acceptTitleOnlySwitch: true
        });
      } else {
        await _0x5bcced(1800);
        const _0x380398 = typeof _0xc0a38a === "function" ? _0xc0a38a(_0x26fde2?.() || _0x1df49d || document) || "" : "";
        _0x42af4a = !!_0x380398 && _0x380398 !== _0x49d26d;
      }
      const _0x515347 = _0x1df49d && _0x18c19c(_0x1df49d) ? _0x1df49d : _0x26fde2() || document;
      try {
        _0x32621a(_0x515347, "监控：切条后暂停");
      } catch (_0x3b567d) {}
      const _0x28e1c1 = typeof _0x84a7a3 === "function" ? _0x84a7a3(window.location.href, _0x515347) || "" : window.location.href || "";
      const _0x2820fd = _0xb26a14(_0x28e1c1) || _0xfc142b(_0x28e1c1) || _0xb26a14(window.location.href) || "";
      const _0x5c52af = !!_0x2820fd && !!_0x28048a && _0x2820fd !== _0x28048a;
      if (!_0x42af4a && _0x5c52af) {
        _0x42af4a = true;
      }
      const _0x421345 = !_0x22ae52 || !!_0x2820fd && String(_0x2820fd) === _0x22ae52;
      const _0x2cfb6b = _0x5bfee2 ? !!_0x42af4a && !!_0x421345 : !!_0x42af4a;
      _0x21a71c({
        success: _0x2cfb6b,
        continued: !!_0x42af4a,
        videoUrl: _0x28e1c1 || (_0x2820fd ? "https://www.douyin.com/video/" + _0x2820fd : ""),
        awemeId: _0x2820fd,
        matched: _0x421345,
        reason: _0x42af4a ? _0x421345 || !_0x5bfee2 ? "switched" : "mismatch" : "not_switched",
        error: _0x2cfb6b ? "" : _0x42af4a ? "下一条作品不匹配" : "未能切换到下一条"
      });
    } catch (_0x4f3de1) {
      if (String(_0x4f3de1?.message || _0x4f3de1) === "TASK_ABORTED") {
        _0x21a71c({
          success: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      _0x21a71c({
        success: false,
        continued: false,
        error: _0x4f3de1?.message || String(_0x4f3de1)
      });
    }
  }
  function _0x25d994(_0x4613d9) {
    const _0x5e387f = String(_0x4613d9 || "").replace(/\s+/g, "").trim();
    if (!_0x5e387f) {
      return "unknown";
    }
    if (/请求中|已请求|等待通过|待通过/.test(_0x5e387f)) {
      return "requested";
    }
    if (/已关注|相互关注|互相关注|取消关注/.test(_0x5e387f)) {
      return "followed";
    }
    if (/^(关注|\+关注|关注Ta|回关|\+)$/.test(_0x5e387f)) {
      return "available";
    }
    return "unknown";
  }
  function _0x522e6a(_0x1272f0) {
    if (!_0x1272f0) {
      return "";
    }
    const _0x1c5e49 = [_0x1272f0.innerText, _0x1272f0.textContent, _0x1272f0.getAttribute?.("aria-label"), _0x1272f0.getAttribute?.("title")].map(_0x2d9cda => String(_0x2d9cda || "").trim()).filter(Boolean);
    return _0x1c5e49.find(_0x367f0d => _0x25d994(_0x367f0d) !== "unknown") || _0x1c5e49[0] || "";
  }
  function _0x350d2f(_0x506913) {
    if (!_0x506913) {
      return "无控件";
    }
    try {
      const _0x3e38c9 = _0x506913.getBoundingClientRect();
      const _0xb652e4 = String(_0x506913.tagName || "?").toUpperCase();
      return _0xb652e4 + " " + Math.round(_0x3e38c9.width) + "x" + Math.round(_0x3e38c9.height) + ("@(" + Math.round(_0x3e38c9.left) + "," + Math.round(_0x3e38c9.top) + ")");
    } catch (_0x7f101e) {
      return String(_0x506913.tagName || "未知控件");
    }
  }
  function _0x34e35c() {
    const _0x128eba = document.querySelector("[data-e2e*=\"private\" i], [class*=\"private\" i], [class*=\"privacy\" i]");
    const _0xc0bfa9 = String(_0x128eba?.innerText || _0x128eba?.textContent || "").trim();
    if (/私密账号|私密用户|仅粉丝可见/.test(_0xc0bfa9)) {
      return true;
    }
    return Array.from(document.querySelectorAll("span, p")).some(_0x2b5723 => /^(私密账号|私密用户|仅粉丝可见)$/.test(String(_0x2b5723.innerText || _0x2b5723.textContent || "").trim()));
  }
  function _0x549e5d(_0x1d84ac, _0x4528e1, _0x57e247, _0x3035e4 = "") {
    const _0x1b77b1 = ["关注前=" + (_0x1d84ac || "未知"), "关注后=" + (_0x4528e1 || "未知"), "私密账号=" + (_0x57e247 ? "是" : "否/未识别")];
    if (_0x3035e4) {
      _0x1b77b1.push("点击=" + _0x3035e4);
    }
    return _0x1b77b1.join("；");
  }
  function _0x3aae85() {
    const _0x28dc4a = Array.from(document.querySelectorAll("[role=\"alert\"], [role=\"dialog\"], .semi-toast-content, [class*=\"toast\" i], [class*=\"Toast\"], [class*=\"modal\" i]"));
    for (const _0x589dce of _0x28dc4a) {
      if (!_0x18c19c(_0x589dce)) {
        continue;
      }
      const _0x2fb791 = String(_0x589dce.innerText || _0x589dce.textContent || "").replace(/\s+/g, " ").trim();
      if (!_0x2fb791 || _0x2fb791.length > 300) {
        continue;
      }
      if (/隐私设置|无法关注|不能关注|关注失败|操作频繁|请求失败|关注人数.*上限|稍后再试/.test(_0x2fb791)) {
        return _0x2fb791;
      }
    }
    return "";
  }
  async function _0x622b99(_0x2638ef = {}, _0x46d88b) {
    const _0x76b06a = _0x46d88b || "PROFILE_FOLLOW_" + Date.now();
    const _0x5cbb38 = _0x35732d.currentTask;
    _0x35732d.currentTask = {
      ...(_0x5cbb38 || {}),
      taskMode: "interaction",
      enableFollow: true,
      nickname: _0x2638ef.nickname || _0x5cbb38?.nickname || "",
      lead: {
        ...(_0x5cbb38?.lead || {}),
        nickname: _0x2638ef.nickname || "",
        userUrl: _0x2638ef.userUrl || ""
      }
    };
    try {
      try {
        await _0x5c2c6f(_0x76b06a);
      } catch (_0x9406f8) {}
      if (!String(window.location.href || "").includes("/user/")) {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: "当前不在用户主页，无法关注",
          errorCode: "not_on_profile",
          isPrivate: false,
          diagnostic: "url=" + window.location.href
        };
      }
      return await _0x3d81e0({
        nickname: _0x2638ef.nickname || "",
        userUrl: _0x2638ef.userUrl || ""
      }, _0x76b06a);
    } finally {
      _0x35732d.currentTask = _0x5cbb38;
    }
  }
  async function _0x4029bf(_0x3031e3 = {}, _0x2201ac) {
    const {
      nickname = "",
      userUrl = "",
      content = "",
      commentText = "",
      timeText = "",
      replyText = "",
      replyContent = "",
      commentId = "",
      cid = "",
      fastLocate = false
    } = _0x3031e3 || {};
    const _0x4d04c7 = _0x2201ac || "COMMENT_REPLY_" + Date.now();
    const _0x2b1a86 = String(commentId || cid || "").trim();
    const _0x1e8064 = {
      nickname: nickname,
      userUrl: userUrl,
      content: content || commentText || "",
      comment: content || commentText || "",
      timeText: timeText || "",
      commentId: _0x2b1a86,
      cid: _0x2b1a86
    };
    const _0x3f8dee = replyText || replyContent || "";
    const _0x30b84f = !!fastLocate;
    const _0x3d8f18 = _0x35732d.currentTask;
    _0x35732d.currentTask = {
      ...(_0x3d8f18 || {}),
      taskMode: "interaction",
      enableComment: true,
      enableLike: true,
      enableDM: true,
      aiReplyMode: false,
      nickname: nickname,
      lead: _0x1e8064
    };
    try {
      try {
        await _0x342015(document.body, _0x4d04c7);
        if (!_0x30b84f) {
          const _0x17df67 = _0x54568e(document.body);
          if (_0x17df67 && _0x17df67.scrollTop > 20) {
            _0x17df67.scrollTop = 0;
            await _0x5bcced(700);
          }
        }
      } catch (_0x3c1f80) {}
      return await _0x3b5af6(document, _0x1e8064, _0x4d04c7, _0x3f8dee, {
        fastLocate: _0x30b84f
      });
    } finally {
      _0x35732d.currentTask = _0x3d8f18;
    }
  }
  _0x47cc4f.on("self-warmup-profile-follow", async (_0x53b7a6, _0x1be8e1 = {}) => {
    const {
      requestId: _0x3842b0,
      nickname: _0x49883b,
      userUrl: _0x1db76b
    } = _0x1be8e1;
    _0x35732d.stopRequested = false;
    _0x35732d.pausedForSubview = false;
    const _0x15adc3 = _0x35732d.currentTask;
    try {
      _0x35732d.currentTask = {
        ...(_0x15adc3 || {}),
        taskMode: "interaction",
        enableFollow: true,
        nickname: _0x49883b || "",
        lead: {
          nickname: _0x49883b || "",
          userUrl: _0x1db76b || ""
        }
      };
      const _0x5b4f8e = await _0x622b99({
        nickname: _0x49883b,
        userUrl: _0x1db76b
      }, "SELF_WARMUP");
      const _0x3f4dc1 = !!_0x5b4f8e?.followed || !!_0x5b4f8e?.alreadyFollowed;
      const _0x4e02f5 = !!_0x5b4f8e?.followRequested || _0x5b4f8e?.followStatus === "requested";
      _0x47cc4f.send("self-warmup-profile-follow-result", {
        requestId: _0x3842b0,
        ok: _0x3f4dc1 || _0x4e02f5,
        reason: _0x3f4dc1 || _0x4e02f5 ? "" : _0x5b4f8e?.error || "关注未确认",
        alreadyFollowed: !!_0x5b4f8e?.alreadyFollowed,
        followStatus: _0x5b4f8e?.followStatus || "",
        followed: !!_0x5b4f8e?.followed,
        followRequested: _0x4e02f5 && !_0x3f4dc1,
        isPrivate: !!_0x5b4f8e?.isPrivate,
        errorCode: _0x5b4f8e?.errorCode || "",
        diagnostic: _0x5b4f8e?.diagnostic || null
      });
    } catch (_0x153a3b) {
      _0x47cc4f.send("self-warmup-profile-follow-result", {
        requestId: _0x3842b0,
        ok: false,
        reason: _0x153a3b?.message || String(_0x153a3b)
      });
    } finally {
      _0x35732d.currentTask = _0x15adc3;
    }
  });
  _0x47cc4f.on("self-warmup-reply-comment", async (_0x5bbdbb, _0xe3084d = {}) => {
    const {
      requestId: _0xd77c5e,
      nickname: _0x4713f1,
      userUrl: _0x10fe6f,
      commentText: _0xde5891,
      timeText: _0x30409f,
      replyText: _0x22b863
    } = _0xe3084d;
    _0x35732d.stopRequested = false;
    _0x35732d.pausedForSubview = false;
    const _0x4f0953 = _0x35732d.currentTask;
    try {
      const _0x388760 = !String(_0x22b863 || "").trim();
      const _0x3a4e44 = !!_0xe3084d.enableCommentExpression || !!_0xe3084d.enableCommentImage && (Array.isArray(_0xe3084d.commentImagePaths) ? _0xe3084d.commentImagePaths.some(_0x2b52df => String(_0x2b52df || "").trim()) : !!String(_0xe3084d.commentImagePath || "").trim()) || !!_0xe3084d.enableCommentMention && !!String(_0xe3084d.commentMentionNicknames || "").trim();
      _0x35732d.currentTask = {
        ...(_0x4f0953 || {}),
        ..._0xe3084d,
        taskMode: "interaction",
        enableComment: true,
        enableLike: true,
        enableDM: true,
        aiReplyMode: false,
        enableCommentWithoutText: !!_0xe3084d.enableCommentWithoutText || _0x388760 && _0x3a4e44,
        commentContent: _0x388760 ? "" : _0xe3084d.commentContent || _0x4f0953?.commentContent || "",
        replyTemplates: _0x388760 ? [] : _0xe3084d.replyTemplates || _0x4f0953?.replyTemplates || [],
        commentUseRandomSuffix: false,
        commentAttachmentPercent: _0x388760 ? 100 : Number.isFinite(Number(_0xe3084d.commentAttachmentPercent)) ? Number(_0xe3084d.commentAttachmentPercent) : Number.isFinite(Number(_0x4f0953?.commentAttachmentPercent)) ? Number(_0x4f0953.commentAttachmentPercent) : 100
      };
      const _0x10754f = await _0x4029bf({
        nickname: _0x4713f1,
        userUrl: _0x10fe6f,
        content: _0xde5891,
        commentText: _0xde5891,
        timeText: _0x30409f,
        replyText: _0x22b863,
        commentId: _0xe3084d.commentId || _0xe3084d.cid || "",
        cid: _0xe3084d.commentId || _0xe3084d.cid || ""
      }, "SELF_WARMUP");
      const _0x3b90d3 = _0x10754f === true || _0x10754f?.success === true;
      const _0x2e8e56 = _0x3b90d3 ? String(_0x10754f?.content || _0x22b863 || "").replace(/\s+/g, " ").trim() : "";
      _0x47cc4f.send("self-warmup-reply-comment-result", {
        requestId: _0xd77c5e,
        ok: _0x3b90d3,
        reason: _0x3b90d3 ? "" : _0x10754f?.error || "回复未完成",
        sentText: _0x2e8e56,
        errorCode: _0x3b90d3 ? "" : _0x10754f?.errorCode || "reply_failed",
        diagnostic: _0x3b90d3 ? "" : _0x10754f?.diagnostic || _0x1e5e87(null),
        detail: _0x3b90d3 ? "" : _0x10754f?.detail || ""
      });
    } catch (_0x147d9a) {
      _0x47cc4f.send("self-warmup-reply-comment-result", {
        requestId: _0xd77c5e,
        ok: false,
        reason: _0x147d9a?.message || String(_0x147d9a),
        errorCode: "reply_exception",
        diagnostic: _0x1e5e87(null)
      });
    } finally {
      _0x35732d.currentTask = _0x4f0953;
    }
  });
  _0x47cc4f.on("self-warmup-like-comment", async (_0x40649f, _0x53784d = {}) => {
    const {
      requestId: _0x2c79ea,
      nickname: _0x54cde2,
      userUrl: _0x26efb3,
      commentText: _0x1b8b16,
      timeText: _0x1dfe86
    } = _0x53784d;
    _0x35732d.stopRequested = false;
    _0x35732d.pausedForSubview = false;
    const _0x1138fb = _0x35732d.currentTask;
    try {
      const _0x1d1745 = {
        nickname: _0x54cde2 || "",
        userUrl: _0x26efb3 || "",
        content: _0x1b8b16 || "",
        comment: _0x1b8b16 || "",
        timeText: _0x1dfe86 || "",
        commentId: _0x53784d.commentId || _0x53784d.cid || "",
        cid: _0x53784d.commentId || _0x53784d.cid || ""
      };
      _0x35732d.currentTask = {
        ...(_0x1138fb || {}),
        taskMode: "interaction",
        enableLike: true,
        nickname: _0x54cde2 || "",
        lead: _0x1d1745
      };
      try {
        await _0x342015(document.body, "SELF_WARMUP");
      } catch (_0x824648) {}
      const _0x5a55d4 = await _0x576202(document, _0x1d1745, "SELF_WARMUP", {
        force: true,
        detail: true,
        fastLocate: false,
        stableLocate: !_0x53784d.commentId && !_0x53784d.cid
      });
      const _0x42a379 = !!_0x5a55d4?.success;
      _0x47cc4f.send("self-warmup-like-comment-result", {
        requestId: _0x2c79ea,
        ok: _0x42a379,
        alreadyLiked: !!_0x5a55d4?.alreadyLiked,
        reason: _0x42a379 ? "" : _0x5a55d4?.error || "未找到目标评论或点赞控件",
        errorCode: _0x42a379 ? "" : _0x5a55d4?.errorCode || "comment_like_failed"
      });
    } catch (_0x5b77e7) {
      _0x47cc4f.send("self-warmup-like-comment-result", {
        requestId: _0x2c79ea,
        ok: false,
        reason: _0x5b77e7?.message || String(_0x5b77e7),
        errorCode: "comment_like_exception"
      });
    } finally {
      _0x35732d.currentTask = _0x1138fb;
    }
  });
  const _0x1ef69d = new Set(["follow_click_not_dispatched", "follow_state_unconfirmed", "follow_reverted", "follow_state_unstable"]);
  const _0x1e0b5f = 4;
  async function _0x5e4168(_0x25b518, _0x1a4e16, _0x1ceb19, _0x137b8e, _0x6208b9 = "主页关注按钮", _0x17d97d = {}) {
    const _0x52e5a1 = _0x3214ea(false) || _0xb0db56("profileFollowBtn");
    if (_0x52e5a1 && _0x52e5a1.isConnected !== false) {
      _0x25b518 = _0x52e5a1;
    }
    if (!_0x25b518 || _0x25b518.isConnected === false) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注按钮已失效或当前页面未找到可用控件",
        errorCode: "follow_click_not_dispatched",
        isPrivate: _0x1ceb19,
        diagnostic: _0x549e5d(_0x137b8e, "", _0x1ceb19, "button_detached")
      };
    }
    const _0x1f3729 = _0x522e6a(_0x25b518) || _0x137b8e;
    const _0x26a0ed = _0x25d994(_0x1f3729);
    if (_0x26a0ed === "followed") {
      return {
        success: true,
        followed: true,
        alreadyFollowed: true,
        followStatus: "already_followed",
        isPrivate: _0x1ceb19,
        diagnostic: _0x549e5d(_0x137b8e, _0x1f3729, _0x1ceb19)
      };
    }
    if (_0x26a0ed === "requested") {
      return {
        success: true,
        followed: false,
        followRequested: true,
        followRequestSent: false,
        followStatus: "requested",
        isPrivate: true,
        diagnostic: _0x549e5d(_0x137b8e, _0x1f3729, _0x1ceb19)
      };
    }
    const _0x1ea527 = _0x17d97d?.nickname ? "@" + _0x17d97d.nickname : "@用户";
    _0x336b2f("👤 " + _0x1ea527 + "：关注按钮已定位（文案=" + (_0x1f3729 || "无") + "，" + _0x350d2f(_0x25b518) + "），正在点击…", _0x17d97d?.accountId);
    const _0x3c26cc = await _0x5da649(_0x25b518, _0x1a4e16, _0x6208b9, {
      allowOffsetSamples: true,
      requireTargetHit: true,
      waitForStableTarget: true
    });
    const _0x2c7aa5 = String(_0x35732d.lastTrustedClickDiagnostic || "");
    if (!_0x3c26cc) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注按钮当前被遮挡、位置未稳定或原生点击未派发",
        errorCode: "follow_click_not_dispatched",
        isPrivate: _0x1ceb19,
        diagnostic: _0x549e5d(_0x137b8e, _0x1f3729, _0x1ceb19, _0x2c7aa5)
      };
    }
    _0x336b2f("👤 " + _0x1ea527 + "：关注点击已派发，正在确认页面状态…", _0x17d97d?.accountId);
    let _0x441473 = "";
    let _0x421174 = "unknown";
    let _0x50cd07 = "";
    const _0x26a119 = Date.now() + 10000;
    while (Date.now() < _0x26a119) {
      if (_0x414526(_0x1a4e16)) {
        throw new Error("TASK_ABORTED");
      }
      await _0x5bcced(500);
      _0x50cd07 = _0x3aae85();
      if (_0x50cd07) {
        break;
      }
      const _0x273886 = _0x3214ea(false) || _0xb0db56("profileFollowBtn");
      _0x441473 = _0x522e6a(_0x273886);
      _0x421174 = _0x25d994(_0x441473);
      if (_0x421174 === "followed" || _0x421174 === "requested") {
        break;
      }
    }
    const _0xa4e940 = _0x549e5d(_0x137b8e, _0x441473, _0x1ceb19, _0x2c7aa5);
    if (_0x50cd07) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: _0x50cd07,
        errorCode: /隐私/.test(_0x50cd07) ? "follow_privacy_restricted" : /频繁|上限|稍后/.test(_0x50cd07) ? "follow_rate_limited" : "follow_rejected",
        isPrivate: _0x1ceb19,
        diagnostic: _0xa4e940
      };
    }
    if (_0x421174 === "followed" || _0x421174 === "requested") {
      await _0x5bcced(2500);
      _0x50cd07 = _0x3aae85();
      const _0x1917a1 = _0x3214ea(false) || _0xb0db56("profileFollowBtn");
      const _0x3def78 = _0x522e6a(_0x1917a1);
      const _0x3c4232 = _0x25d994(_0x3def78);
      const _0x1431f6 = _0x549e5d(_0x137b8e, _0x3def78 || _0x441473, _0x1ceb19, _0x2c7aa5);
      if (_0x50cd07) {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: _0x50cd07,
          errorCode: /隐私/.test(_0x50cd07) ? "follow_privacy_restricted" : /频繁|上限|稍后/.test(_0x50cd07) ? "follow_rate_limited" : "follow_rejected",
          isPrivate: _0x1ceb19,
          diagnostic: _0x1431f6
        };
      }
      if (_0x3c4232 === "followed") {
        return {
          success: true,
          followed: true,
          followStatus: "success",
          isPrivate: _0x1ceb19,
          diagnostic: _0x1431f6
        };
      }
      if (_0x3c4232 === "requested") {
        return {
          success: true,
          followed: false,
          followRequested: true,
          followRequestSent: true,
          followStatus: "requested",
          isPrivate: true,
          diagnostic: _0x1431f6
        };
      }
      if (_0x3c4232 === "available") {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: "关注后状态回退为未关注，可能未真正成功",
          errorCode: "follow_reverted",
          isPrivate: _0x1ceb19,
          diagnostic: _0x1431f6
        };
      }
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注后状态未稳住（" + (_0x3def78 || _0x441473 || "无文字") + "）",
        errorCode: "follow_state_unstable",
        isPrivate: _0x1ceb19,
        diagnostic: _0x1431f6
      };
    }
    return {
      success: false,
      followed: false,
      followStatus: "failed",
      error: "点击关注后未确认到“已关注”或“请求中”状态",
      errorCode: "follow_state_unconfirmed",
      isPrivate: _0x1ceb19,
      diagnostic: _0xa4e940
    };
  }
  async function _0x3d81e0(_0x3aa7e4, _0x52d0af) {
    try {
      window.focus?.();
    } catch (_0x89f824) {}
    try {
      if (_0x35732d.currentViewKey && !window.__radar_monitor_interaction) {
        _0x47cc4f.send("focus-automation-view", {
          viewKey: _0x35732d.currentViewKey,
          bringToFront: true
        });
        const _0x420136 = await _0x47cc4f.invoke("ensure-background-automation-layout", {
          viewKey: _0x35732d.currentViewKey,
          claimInteractionSlot: true
        });
        if (_0x420136 && _0x420136.ok === false) {
          _0x336b2f("👤 @" + (_0x3aa7e4?.nickname || "用户") + "：关注执行视口未完成就绪（" + (_0x420136.reason || "unknown") + "），继续等待控件稳定…", _0x3aa7e4?.accountId, "warning");
        }
      }
    } catch (_0x7f102) {
      _0x336b2f("👤 @" + (_0x3aa7e4?.nickname || "用户") + "：关注执行视口准备异常（" + (_0x7f102?.message || _0x7f102) + "），继续等待控件稳定…", _0x3aa7e4?.accountId, "warning");
    }
    const _0x45d191 = _0x34e35c();
    let _0x58be5b = await _0xbaefde("profileFollowBtn", _0x52d0af, 20000);
    if (!_0x58be5b) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: _0x45d191 ? "私密账号未找到可用的关注或请求关注按钮" : "未找到用户主页关注按钮",
        errorCode: "follow_button_not_found",
        isPrivate: _0x45d191,
        diagnostic: _0x549e5d("", "", _0x45d191)
      };
    }
    const _0x3df395 = _0x522e6a(_0x58be5b);
    const _0x4d0e65 = _0x25d994(_0x3df395);
    if (_0x4d0e65 === "followed") {
      return {
        success: true,
        followed: true,
        alreadyFollowed: true,
        followStatus: "already_followed",
        isPrivate: _0x45d191,
        diagnostic: _0x549e5d(_0x3df395, _0x3df395, _0x45d191)
      };
    }
    if (_0x4d0e65 === "requested") {
      return {
        success: true,
        followed: false,
        followRequested: true,
        followRequestSent: false,
        followStatus: "requested",
        isPrivate: _0x45d191,
        diagnostic: _0x549e5d(_0x3df395, _0x3df395, _0x45d191)
      };
    }
    if (_0x4d0e65 !== "available") {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "无法确认关注按钮状态（" + (_0x3df395 || "无文字") + "）",
        errorCode: "follow_button_state_unknown",
        isPrivate: _0x45d191,
        diagnostic: _0x549e5d(_0x3df395, _0x3df395, _0x45d191)
      };
    }
    const _0xb1341f = _0x3aa7e4?.nickname ? "@" + _0x3aa7e4.nickname : "@用户";
    let _0x33e8d = null;
    let _0x248698 = _0x3df395;
    for (let _0x13afd1 = 1; _0x13afd1 <= _0x1e0b5f; _0x13afd1 += 1) {
      if (_0x13afd1 > 1) {
        _0x58be5b = _0x3214ea(false) || _0xb0db56("profileFollowBtn");
        if (!_0x58be5b) {
          _0x58be5b = await _0xbaefde("profileFollowBtn", _0x52d0af, 8000);
        }
        if (!_0x58be5b) {
          return {
            ..._0x33e8d,
            error: (_0x33e8d?.error || "关注未确认") + "；第 " + _0x13afd1 + "/" + _0x1e0b5f + " 次尝试前未找到关注按钮",
            retryAttempted: true,
            attemptCount: _0x13afd1 - 1,
            maxAttempts: _0x1e0b5f
          };
        }
        const _0x4ca715 = _0x522e6a(_0x58be5b);
        const _0x272333 = _0x25d994(_0x4ca715);
        if (_0x272333 === "followed") {
          return {
            success: true,
            followed: true,
            followStatus: "success",
            isPrivate: _0x45d191,
            retryAttempted: true,
            attemptCount: _0x13afd1 - 1,
            maxAttempts: _0x1e0b5f,
            diagnostic: _0x549e5d(_0x3df395, _0x4ca715, _0x45d191)
          };
        }
        if (_0x272333 === "requested") {
          return {
            success: true,
            followed: false,
            followRequested: true,
            followRequestSent: true,
            followStatus: "requested",
            isPrivate: true,
            retryAttempted: true,
            attemptCount: _0x13afd1 - 1,
            maxAttempts: _0x1e0b5f,
            diagnostic: _0x549e5d(_0x3df395, _0x4ca715, _0x45d191)
          };
        }
        if (_0x272333 !== "available") {
          return {
            ..._0x33e8d,
            error: (_0x33e8d?.error || "关注未确认") + "；第 " + _0x13afd1 + "/" + _0x1e0b5f + " 次尝试前按钮状态异常（" + (_0x4ca715 || "无文字") + "）",
            retryAttempted: true,
            attemptCount: _0x13afd1 - 1,
            maxAttempts: _0x1e0b5f,
            diagnostic: _0x549e5d(_0x3df395, _0x4ca715, _0x45d191)
          };
        }
        _0x248698 = _0x4ca715 || _0x3df395;
        _0x1cbac("正在第 " + _0x13afd1 + "/" + _0x1e0b5f + " 次尝试关注" + (_0x3aa7e4?.nickname ? " [" + _0x3aa7e4.nickname + "]" : "") + "...", _0x3aa7e4?.accountId);
      }
      _0x33e8d = await _0x5e4168(_0x58be5b, _0x52d0af, _0x45d191, _0x248698, _0x13afd1 === 1 ? "主页关注按钮" : "主页关注按钮(第" + _0x13afd1 + "/" + _0x1e0b5f + "次)", _0x3aa7e4);
      _0x33e8d.retryAttempted = _0x13afd1 > 1;
      _0x33e8d.attemptCount = _0x13afd1;
      _0x33e8d.maxAttempts = _0x1e0b5f;
      if (_0x33e8d.success || !_0x1ef69d.has(String(_0x33e8d.errorCode || ""))) {
        return _0x33e8d;
      }
      if (_0x13afd1 >= _0x1e0b5f) {
        return _0x33e8d;
      }
      const _0x36dae0 = _0x13afd1 + 1;
      const _0x516c9a = _0x13afd1 + 3;
      _0x336b2f("👤 " + _0xb1341f + "：第 " + _0x13afd1 + "/" + _0x1e0b5f + " 次关注未确认（" + (_0x33e8d.errorCode || "unknown") + "），" + ("等待 " + _0x36dae0 + "-" + _0x516c9a + " 秒后进行第 " + (_0x13afd1 + 1) + "/" + _0x1e0b5f + " 次尝试…"), _0x3aa7e4?.accountId, "warning");
      await _0x22333c(_0x36dae0 * 1000, _0x516c9a * 1000, _0x52d0af, "关注重试等待");
      if (_0x414526(_0x52d0af)) {
        throw new Error("TASK_ABORTED");
      }
    }
    return _0x33e8d;
  }
  async function _0x2fefec(_0x1a0c29 = {}) {
    const {
      requestId: _0x1dc2ed,
      action: _0x1a16aa,
      nickname: _0x49278f,
      commentText: _0x4cab77,
      replyContent: _0x58a395,
      dmContent: _0x40cbb4
    } = _0x1a0c29;
    const _0x748b78 = "MONITOR_" + (_0x1dc2ed || Date.now());
    const _0x1d52fe = _0x35732d.currentTask;
    const _0x2df689 = _0x5cf298 => {
      _0x47cc4f.send("video-monitor-action-result", {
        requestId: _0x1dc2ed,
        ..._0x5cf298
      });
    };
    try {
      if (_0x1a0c29.accountId) {
        try {
          window._radar_account_id = _0x1a0c29.accountId;
        } catch (_0x59f3aa) {}
      }
      if (window.__radar_monitor_interaction) {
        _0x35732d.currentViewKey = null;
        try {
          window.__radar_view_key = "";
        } catch (_0x501e51) {}
      }
      const _0x157cea = !String(_0x1a0c29.replyContent || "").trim();
      const _0xb3dd5b = !!_0x1a0c29.enableCommentExpression || !!_0x1a0c29.enableCommentImage && (Array.isArray(_0x1a0c29.commentImagePaths) ? _0x1a0c29.commentImagePaths.some(_0x470aba => String(_0x470aba || "").trim()) : !!String(_0x1a0c29.commentImagePath || "").trim()) || !!_0x1a0c29.enableCommentMention && !!String(_0x1a0c29.commentMentionNicknames || "").trim();
      _0x35732d.currentTask = {
        ...(_0x1d52fe || {}),
        ..._0x1a0c29,
        taskMode: "interaction",
        enableLike: true,
        enableComment: true,
        enableDM: true,
        aiReplyMode: false,
        isMonitorAction: true,
        monitorTaskId: _0x1a0c29.monitorTaskId || _0x1a0c29.monitorRunId || _0x1d52fe?.monitorTaskId || "",
        enableCommentWithoutText: !!_0x1a0c29.enableCommentWithoutText || _0x157cea && _0xb3dd5b,
        commentContent: _0x157cea ? "" : _0x1a0c29.commentContent || _0x1d52fe?.commentContent || "",
        replyTemplates: _0x157cea ? [] : _0x1a0c29.replyTemplates || _0x1d52fe?.replyTemplates || []
      };
      try {
        _0x137710();
      } catch (_0x3b797f) {}
      if (_0x1a16aa === "like") {
        const _0x2f1c04 = {
          nickname: _0x49278f,
          content: _0x4cab77,
          comment: _0x4cab77,
          userUrl: _0x1a0c29.userUrl || "",
          commentId: _0x1a0c29.commentId || _0x1a0c29.cid || "",
          cid: _0x1a0c29.commentId || _0x1a0c29.cid || "",
          timeText: _0x1a0c29.timeText || _0x1a0c29.commentTime || "",
          commentTime: _0x1a0c29.timeText || _0x1a0c29.commentTime || ""
        };
        const _0x21c231 = _0x40c241 => _0xdf061f(_0x1dc2ed, _0x40c241);
        _0x21c231("打开评论区…");
        try {
          await _0x342015(document.body, _0x748b78);
        } catch (_0x37f075) {}
        _0x21c231("准备点赞（后台布局/定位评论）…");
        const _0x5cc609 = await _0x576202(document, _0x2f1c04, _0x748b78, {
          force: true,
          detail: true,
          fastLocate: true,
          onProgress: _0x21c231
        });
        const _0x585c15 = !!_0x5cc609?.success;
        _0x2df689({
          success: _0x585c15,
          alreadyLiked: !!_0x5cc609?.alreadyLiked,
          error: _0x585c15 ? "" : _0x5cc609?.error || "未找到目标评论或点赞控件",
          errorCode: _0x585c15 ? "" : _0x5cc609?.errorCode || "comment_like_failed"
        });
        return;
      }
      if (_0x1a16aa === "reply") {
        const _0x13728c = await _0x4029bf({
          nickname: _0x49278f,
          content: _0x4cab77,
          commentText: _0x4cab77,
          userUrl: _0x1a0c29.userUrl || "",
          timeText: _0x1a0c29.timeText || _0x1a0c29.commentTime || "",
          replyContent: _0x58a395,
          commentId: _0x1a0c29.commentId || _0x1a0c29.cid || "",
          cid: _0x1a0c29.commentId || _0x1a0c29.cid || "",
          fastLocate: true
        }, _0x748b78);
        const _0x5461fb = _0x13728c === true || _0x13728c?.success === true;
        _0x2df689({
          success: _0x5461fb,
          error: _0x5461fb ? "" : _0x13728c?.error || "回复未完成",
          errorCode: _0x5461fb ? "" : _0x13728c?.errorCode || "reply_failed",
          diagnostic: _0x5461fb ? "" : _0x13728c?.diagnostic || _0x1e5e87(null),
          detail: _0x5461fb ? "" : _0x13728c?.detail || ""
        });
        return;
      }
      if (_0x1a16aa === "video-main-comment") {
        _0x3c0924?.({
          videoMainCommentedVideoIds: _0x1a0c29.videoMainCommentedVideoIds || []
        });
        const _0xce0338 = String(_0x1a0c29.videoKey || _0x1a0c29.videoUrl || window.location.href || "");
        if (_0xce0338 && _0x3e8c5d?.(_0xce0338)) {
          _0x2df689({
            success: false,
            skipped: true,
            reason: "already_commented"
          });
          return;
        }
        _0x1cbac("正在发表视频主评…");
        const _0x1f0b43 = await _0x58324c(document.body, _0x748b78, {
          skipEnableCheck: true,
          expandScope: true,
          videoKey: _0xce0338,
          videoTitle: _0x1a0c29.videoTitle || "",
          prefetchedCommentText: _0x1a0c29.prefetchedCommentText || ""
        });
        _0x2df689({
          success: !!_0x1f0b43?.success,
          skipped: !!_0x1f0b43?.skipped,
          reason: _0x1f0b43?.reason || "",
          error: _0x1f0b43?.success ? "" : _0x1f0b43?.error || "视频主评未完成",
          errorCode: _0x1f0b43?.success ? "" : _0x1f0b43?.errorCode || _0x1f0b43?.error || "video_main_comment_failed",
          content: _0x1f0b43?.content || ""
        });
        return;
      }
      if (_0x1a16aa === "profile-first-comment") {
        const _0x3f318a = {
          nickname: _0x49278f,
          leadId: _0x49278f
        };
        const _0x34db28 = await _0x4956b1(_0x3f318a, _0x748b78, {
          templateText: _0x58a395,
          forceAi: false,
          forceTemplateOnly: true
        });
        const _0x1df43e = !!_0x34db28.noWorks;
        const _0x52d9aa = _0x1df43e ? _0x34db28.error && !/^no_works$/i.test(String(_0x34db28.error)) ? String(_0x34db28.error) : _0x58aeb1(_0x34db28.diagnostic || _0x34db28.error || "no_works") : "";
        const _0x44f03f = !_0x34db28.success && (_0x34db28.errorCode === "profile_works_not_ready" || /^profile_works_not_ready$/i.test(String(_0x34db28.error || "")));
        const _0x3f0bb4 = _0x44f03f ? _0x34db28.error && !/^profile_works_not_ready$/i.test(String(_0x34db28.error)) ? String(_0x34db28.error) : _0xebf437(_0x34db28.diagnostic || "unknown") : "";
        _0x2df689({
          success: !!_0x34db28.success,
          noWorks: _0x1df43e,
          worksCount: _0x34db28.worksCount,
          workLiked: !!_0x34db28.workLiked,
          workCollected: !!_0x34db28.workCollected,
          error: _0x34db28.success ? "" : _0x52d9aa || _0x3f0bb4 || _0x34db28.error || "",
          errorCode: _0x34db28.errorCode || (_0x1df43e ? "no_works" : "") || (_0x44f03f ? "profile_works_not_ready" : ""),
          diagnostic: _0x34db28.diagnostic || ""
        });
        return;
      }
      if (_0x1a16aa === "profile-target-check") {
        const _0x4d27ed = await _0x106278({
          genderFilter: _0x1a0c29.profileActionGenderFilter || "all"
        });
        if (_0x4d27ed.genderUnresolved) {
          _0x2df689({
            success: true,
            eligible: false,
            filtered: true,
            filterReason: "性别尚未识别完成（主页加载偏慢），已跳过以免误判",
            ..._0x4d27ed
          });
          return;
        }
        const _0x158475 = _0xf88759(_0x4d27ed.gender, _0x1a0c29.profileActionGenderFilter || "all");
        const _0x2e3f56 = {
          ageFilterEnabled: _0x1a0c29.profileActionAgeFilterEnabled === true,
          ageMin: _0x1a0c29.profileActionAgeMin,
          ageMax: _0x1a0c29.profileActionAgeMax
        };
        const _0x49f25f = _0xd91b3a(_0x4d27ed, _0x2e3f56);
        const _0x26bcde = _0x787c76(_0x2e3f56) ? _0x5c9ebc(_0x2e3f56) : "关闭";
        const _0x3edc8b = _0x158475.pass && _0x49f25f.pass && !_0x4d27ed.isPrivate;
        _0x2df689({
          success: true,
          eligible: _0x3edc8b,
          filtered: !_0x3edc8b,
          filterReason: !_0x158475.pass ? _0x158475.reason : !_0x49f25f.pass ? _0x49f25f.reason : _0x4d27ed.isPrivate ? "对方账号设置了隐私，未执行关注/私信" : "",
          gender: _0x4d27ed.gender || "未知",
          genderObserved: _0x158475.observed,
          genderObservedLabel: _0x158475.observedLabel,
          genderFilter: _0x158475.filter,
          genderFilterLabel: _0x158475.filterLabel,
          age: _0x541d0e(_0x4d27ed) === "未知" ? null : Number(_0x4d27ed.age),
          ageFilterLabel: _0x26bcde,
          isPrivate: !!_0x4d27ed.isPrivate,
          worksCount: Number(_0x4d27ed.worksCount || 0),
          noWorks: !!_0x4d27ed.noWorks || Number(_0x4d27ed.worksCount || 0) === 0,
          profileDetail: _0x4d27ed
        });
        return;
      }
      if (_0x1a16aa === "follow") {
        const _0x1f01c3 = await _0x106278().catch(() => null);
        const _0x31ecc7 = !!_0x1f01c3?.isPrivate || !!_0x34e35c();
        if (_0x31ecc7) {
          _0x2df689({
            success: false,
            followed: false,
            followStatus: "skipped",
            skipped: true,
            error: "对方账号设置了隐私，未执行关注",
            errorCode: "private_account",
            isPrivate: true,
            worksCount: Number(_0x1f01c3?.worksCount || 0),
            noWorks: !!_0x1f01c3?.noWorks || Number(_0x1f01c3?.worksCount || 0) === 0,
            profileDetail: _0x1f01c3 || null
          });
          return;
        }
        const _0x1aab2a = await _0x622b99({
          nickname: _0x49278f,
          userUrl: _0x1a0c29.userUrl
        }, _0x748b78);
        _0x2df689({
          ..._0x1aab2a,
          isPrivate: !!_0x1f01c3?.isPrivate || !!_0x1aab2a?.isPrivate,
          worksCount: Number(_0x1f01c3?.worksCount !== undefined ? _0x1f01c3.worksCount : _0x1aab2a?.worksCount || 0),
          noWorks: !!_0x1f01c3?.noWorks || Number(_0x1f01c3?.worksCount || 0) === 0 || !!_0x1aab2a?.noWorks,
          profileDetail: _0x1f01c3 || null
        });
        return;
      }
      if (_0x1a16aa === "dm") {
        const _0xa5c523 = _0x1a0c29.profileDetail || (await _0x106278().catch(() => null));
        const _0x3350b2 = !!_0xa5c523?.isPrivate || !!_0x34e35c();
        if (_0x3350b2) {
          _0x2df689({
            success: false,
            skipped: true,
            error: "对方账号设置了隐私，未执行私信",
            errorCode: "private_account",
            isPrivate: true,
            worksCount: Number(_0xa5c523?.worksCount || 0),
            noWorks: !!_0xa5c523?.noWorks || Number(_0xa5c523?.worksCount || 0) === 0,
            profileDetail: _0xa5c523 || null
          });
          return;
        }
        const _0x3df21d = {
          nickname: _0x49278f || "用户",
          content: _0x4cab77 || _0x1a0c29.commentText || "",
          comment: _0x4cab77 || _0x1a0c29.commentText || "",
          userUrl: _0x1a0c29.userUrl || "",
          secUid: _0x1a0c29.secUid || _0x1a0c29.sec_uid || "",
          accountId: _0x1a0c29.accountId || "",
          accountName: _0x1a0c29.accountName || ""
        };
        const _0x4693f1 = await _0x5d1418(_0x3df21d, _0x748b78, false, true, _0x40cbb4, false, _0x35732d.currentTask, _0xa5c523);
        const _0x579c98 = !!_0x4693f1.dmBlocked && (_0x4693f1.blockType === "privacy_settings" || /对方账号设置了隐私|隐私设置|无法发送消息/.test(String(_0x4693f1.error || "")));
        const _0xc79560 = _0x579c98 ? String(_0x4693f1.error || "").trim() || "对方账号设置了隐私，无法私信" : "";
        _0x2df689({
          success: !!_0x4693f1.messaged,
          skipped: !!_0x4693f1.skipped || _0x579c98,
          error: _0x4693f1.skipReason || _0xc79560 || _0x4693f1.error || (_0x4693f1.messaged ? "" : "私信未完成"),
          errorCode: _0x4693f1.skipped && _0x4693f1.isPrivate ? "private_account" : _0x579c98 ? "privacy_settings" : "",
          isPrivate: !!_0xa5c523?.isPrivate || !!_0x4693f1.isPrivate,
          dmBlocked: !!_0x4693f1.dmBlocked,
          blockType: _0x4693f1.blockType || "",
          worksCount: Number(_0xa5c523?.worksCount || 0),
          noWorks: !!_0xa5c523?.noWorks || Number(_0xa5c523?.worksCount || 0) === 0,
          profileDetail: _0xa5c523 || null
        });
        return;
      }
      _0x2df689({
        success: false,
        error: "unknown action: " + _0x1a16aa
      });
    } catch (_0x234560) {
      _0x2df689({
        success: false,
        error: _0x234560.message || "监控互动执行异常",
        errorCode: "monitor_action_exception",
        diagnostic: _0x1a16aa === "reply" ? _0x1e5e87(null) : ""
      });
    } finally {
      _0x35732d.currentTask = _0x1d52fe;
    }
  }
  return {
    buildLeadCommentFingerprint: _0x4fed90,
    buildNodeCommentFingerprint: _0x5b6610,
    collectDouyinCommentEmojiHints: _0x516665,
    commentNodeViewportBonus: _0x12ddd4,
    detectMonitorPrivateProfile: _0x34e35c,
    detectMonitorAuthorProfileGone: _0x18cefd,
    extractDouyinCommentContent: _0x1ce79f,
    getCommentTimeModule: _0x5c14d4,
    isCommentFromVideoAuthor: _0x27f4e5,
    normalizeDouyinCommentContent: _0x2cbfec,
    parseDouyinCommentNode: _0x2bf2b4,
    performVideoMonitorFollow: _0x3d81e0,
    runVideoMonitorAction: _0x2fefec,
    runVideoMonitorAuthorWorksScrape: _0x59ceba,
    runVideoMonitorMoveNextVideo: _0x54e07f,
    runVideoMonitorOpenAuthorWork: _0x565b45,
    runVideoMonitorOpenSpecificVideo: _0x410ed4,
    runVideoMonitorScrapeComments: _0x5cbb3b,
    runVideoMonitorWaitVideoReady: _0x4a1943,
    runVideoMonitorConfirmAuthor: _0x11239b,
    scoreCommentContentFingerprints: _0x371417
  };
}
module.exports = {
  createVideoMonitorController: createVideoMonitorController
};
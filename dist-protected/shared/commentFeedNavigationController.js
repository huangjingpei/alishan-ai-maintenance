'use strict';

const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createCommentFeedNavigationController(_0x51d8eb = {}) {
  const {
    PLATFORM_SELECTORS: _0x1a3fd0,
    buildDouyinVideoShareUrl: _0x3f336a,
    captureFeedVideoShareUrl: _0x15f856,
    clearPendingLeadVideoUrl: _0x3b07e5,
    clickCommentPanelLoadingPlaceholder: _0x5f3c7f,
    extractSpecificVideoId: _0x5b0aef,
    extractVideoIdFromHref: _0x48d604,
    findCommentPanelRoot: _0x149b22,
    findMainVideoCommentInput: _0x3d8e02,
    getCommentItemLooseSelector: _0x5ecb3a,
    getCommentItemSelector: _0x54606f,
    getCommentPanelSelector: _0x181657,
    getCommentTabPrefix: _0x243420,
    getCommentV2String: _0x96e9a7,
    getVideoEngagePack: _0x135993,
    getDouyinFeedScope: _0x554dee,
    getFeedSwitchGuard: _0x12c3a7,
    getFeedVideoIdentity: _0x379016,
    getMyNickname: _0x56991c,
    getVideoAuthorNickname: _0x60283,
    getVideoTitle: _0x251e6e,
    handleGlobalAutomationPopupsAndSecurity: _0x51d744,
    hasCommentRuntimeReady: _0x577931,
    hasFeedLiveEnterHint: _0x57923c,
    isDouyinFeedLiveStream: _0x2784ab,
    isDouyinLiveStreamTitle: _0x5af672,
    isDouyinVideoShareUrl: _0x46d6bb,
    isDouyinVisibleLoadingPlaceholder: _0x47a09c,
    isElementInFeedCenter: _0x191379,
    isElementInViewportForAutomation: _0x3ca431,
    isOnUserProfilePage: _0x5a8eba,
    isProfileCommentUiVisible: _0x5852c7,
    isVisibleElement: _0x5261d7,
    mergeCommentSelectors: _0x7cba7b,
    normalizeAuthorAccountName: _0x186b5d,
    normalizeUrl: _0x510d83,
    openFeedCommentDrawer: _0x1df147,
    openProfileVideoCommentPanel: _0x3f7971,
    parseDouyinCommentNode: _0x3d961d,
    pauseVisibleDouyinVideos: _0x59b5e8,
    pruneSearchCardOpenFailures: _0x201d1b,
    queryCommentItemNodes: _0x4308ac,
    randomDelay: _0x485121,
    reportCurrentAction: _0x485cbc,
    reportTraceLog: _0x4237de,
    resolveCommentPanelRoot: _0x37c277,
    resolveDouyinVideoDetailModal: _0x5ce888,
    safeScrollTargetIntoView: _0x479ccd,
    shouldAbort: _0x6ae554,
    simulateHumanClick: _0x44e4a6,
    simulateTrustedElementClick: _0x10f0d2,
    simulateTrustedKey: _0x287fca,
    sleep: _0x3f311d,
    sleepWithinDeadline: _0x30d71f,
    state: _0x357c41
  } = _0x51d8eb;
  function _0x2cf46e(_0x257eb7) {
    const _0x21aad6 = String(_0x257eb7 || "").trim().replace(/,/g, "").replace(/\s+/g, "");
    const _0xafb88e = _0x21aad6.match(/(\d+(?:\.\d+)?)(万|w|W|千|k|K)?/);
    if (!_0xafb88e) {
      return null;
    }
    let _0x494c23 = parseFloat(_0xafb88e[1]);
    if (!Number.isFinite(_0x494c23)) {
      return null;
    }
    const _0x549308 = _0xafb88e[2];
    if (_0x549308 === "万" || _0x549308 === "w" || _0x549308 === "W") {
      _0x494c23 *= 10000;
    }
    if (_0x549308 === "千" || _0x549308 === "k" || _0x549308 === "K") {
      _0x494c23 *= 1000;
    }
    return Math.round(_0x494c23);
  }
  function _0x383b31(_0x3f91d0) {
    try {
      const _0x559424 = Array.from(_0x3f91d0.querySelectorAll("div, span, p")).filter(_0x5261d7);
      for (const _0x1ea365 of _0x559424) {
        if (_0x1ea365.children.length > 2) {
          continue;
        }
        const _0x1f03c9 = _0x1ea365.textContent ? _0x1ea365.textContent.trim() : "";
        const _0x5aeb14 = "([\\d.,]+)\\s*([万wW千kK])?\\+?";
        const _0x217ed9 = _0x1f03c9.match(new RegExp("(?:全部评论|评论)\\s*[\\(\\（]?\\s*" + _0x5aeb14 + "\\s*[\\)\\）]?|^" + _0x5aeb14 + "\\s*(?:条评论|个评论|评论)$"));
        if (_0x217ed9) {
          const _0x125c01 = _0x217ed9[1] ? "" + _0x217ed9[1] + (_0x217ed9[2] || "") : "" + _0x217ed9[3] + (_0x217ed9[4] || "");
          const _0x3b8b48 = _0x2cf46e(_0x125c01);
          if (_0x3b8b48 !== null) {
            return _0x3b8b48;
          }
        }
      }
    } catch (_0x3e46a9) {
      console.error("[Built-in-Debug] [获取总评论数异常]", _0x3e46a9);
    }
    return null;
  }
  function _0x56787c(_0x1f8648 = document) {
    try {
      const _0x299df0 = _0x37c277(_0x1f8648) || _0x1f8648 || document.body;
      if (!_0x299df0) {
        return false;
      }
      if (_0x4219bb(_0x299df0) > 0) {
        return false;
      }
      if (_0x322721(_0x299df0)) {
        return false;
      }
      const _0x511163 = String(_0x299df0.innerText || _0x299df0.textContent || "").replace(/\s+/g, " ").trim().slice(0, 1600);
      if (!_0x511163) {
        return false;
      }
      return /暂无评论|还没有人评论|还没有评论|暂无人评论|没有评论|快来抢沙发|期待你的第一条评论|留下你的第一条评论|成为第一个评论的人/.test(_0x511163);
    } catch (_0x122eb5) {
      return false;
    }
  }
  function _0x295978(_0x7ea139, _0x97974e) {
    const _0x17071e = Number(_0x97974e);
    const _0x6aa2d7 = Number.isFinite(_0x17071e) && _0x17071e > 0 ? Math.floor(_0x17071e) : 0;
    if (_0x56787c(_0x7ea139)) {
      return 0;
    }
    return _0x6aa2d7;
  }
  function _0x1b1fb7(_0x47fbc7 = document) {
    const _0x4b8405 = {
      likes: 0,
      comments: 0,
      collects: 0,
      shares: 0
    };
    try {
      const _0x35f2cb = _0x47fbc7 || document;
      const _0x2b33b7 = "[data-e2e=\"video-detail-container\"], [data-e2e=\"feed-active-video\"], .modal-video-container, [class*=\"SearchDetail\"], [data-e2e=\"video-player-container\"]";
      const _0x38c280 = _0x35f2cb.matches?.(_0x2b33b7) ? _0x35f2cb : _0x35f2cb.querySelector?.(_0x2b33b7) || (_0x35f2cb === document ? document.body : _0x35f2cb);
      const _0x1f3595 = _0x2cf477 => {
        if (!_0x2cf477) {
          return null;
        }
        const _0x2bb87e = Array.from(_0x38c280.querySelectorAll(_0x2cf477));
        return _0x2bb87e.find(_0x11c3ea => _0x5261d7(_0x11c3ea) && !_0x3aec57(_0x11c3ea));
      };
      const _0x792bf8 = getVideoEngageSelector({
        getVideoEngagePack: _0x135993
      }, "likeSelectors");
      const _0x4b5c6c = getVideoEngageSelector({
        getVideoEngagePack: _0x135993
      }, "collectSelectors");
      const _0x32cf54 = getVideoEngageSelector({
        getVideoEngagePack: _0x135993
      }, "shareSelectors");
      const _0x16ccb4 = _0x1f3595(_0x792bf8);
      if (_0x16ccb4) {
        _0x4b8405.likes = _0x38a96d(_0x16ccb4) || 0;
      }
      let _0x91d4f9 = _0x383b31(_0x38c280);
      if (_0x91d4f9 === null || _0x91d4f9 === 0) {
        const _0x170335 = [_0x96e9a7("openCommentBtns"), _0x96e9a7("openCommentAria"), _0x96e9a7("videoPlayerComment") || "[data-e2e=\"video-player-comment\"]"].filter(Boolean).join(", ");
        const _0x18da63 = _0x170335 ? _0x1f3595(_0x170335) : null;
        if (_0x18da63) {
          _0x91d4f9 = _0x38a96d(_0x18da63);
        }
      }
      _0x4b8405.comments = _0x91d4f9 || 0;
      const _0x41a371 = _0x1f3595(_0x4b5c6c);
      if (_0x41a371) {
        _0x4b8405.collects = _0x38a96d(_0x41a371) || 0;
      }
      const _0x3bdc09 = _0x1f3595(_0x32cf54);
      if (_0x3bdc09) {
        _0x4b8405.shares = _0x38a96d(_0x3bdc09) || 0;
      }
    } catch (_0x2037db) {
      console.error("[Built-in-Debug] [获取视频数据统计异常]", _0x2037db);
    }
    return _0x4b8405;
  }
  function _0x3aec57(_0x3350f6) {
    if (!_0x3350f6) {
      return false;
    }
    const _0x221c05 = "[data-e2e=\"comment-list\"], [class*=\"comment-list\"], [class*=\"CommentList\"], [data-e2e=\"comment-item\"], [class*=\"comment-item\"]";
    return !!_0x3350f6.closest(_0x221c05);
  }
  function _0x38a96d(_0x221803) {
    if (!_0x221803) {
      return 0;
    }
    let _0x5d242f = "";
    try {
      const _0x73d9fc = _0x221803.querySelector("span, p");
      if (_0x73d9fc && _0x5261d7(_0x73d9fc)) {
        _0x5d242f = _0x73d9fc.innerText || _0x73d9fc.textContent || "";
      }
    } catch (_0xcfadeb) {}
    if (!_0x5d242f || !/[\d]/.test(_0x5d242f)) {
      _0x5d242f = _0x221803.innerText || _0x221803.textContent || "";
    }
    if (!_0x5d242f || !/[\d]/.test(_0x5d242f)) {
      const _0x4366c9 = _0x221803.closest("div[role=\"button\"]") || _0x221803.closest("button") || _0x221803.parentElement;
      if (_0x4366c9) {
        _0x5d242f = _0x4366c9.innerText || _0x4366c9.textContent || "";
      }
    }
    if (_0x5d242f) {
      _0x5d242f = _0x5d242f.replace(/(点赞|赞|评论|收藏|分享|转发)/g, "").trim();
      const _0x3f43e2 = _0x2cf46e(_0x5d242f);
      if (_0x3f43e2 !== null) {
        return _0x3f43e2;
      }
    }
    return 0;
  }
  function _0x4219bb(_0xd327a8) {
    try {
      const _0xe5b052 = _0x37c277(_0xd327a8);
      return _0x4308ac(_0xe5b052).filter(_0x5261d7).length;
    } catch (_0x2bc8c5) {
      return 0;
    }
  }
  function _0x46c9b0(_0x3afd5d, _0xed194a = {}) {
    const _0x467ec9 = Array.from(_0x3afd5d || []).filter(Boolean);
    const _0x6780f4 = Math.max(0, Number(_0xed194a.keepHead) || 0);
    const _0x200dbc = Math.max(8, Number(_0xed194a.keepTail) || 28);
    const _0x51e517 = Math.max(_0x6780f4 + _0x200dbc + 12, Number(_0xed194a.trigger) || 70);
    if (_0x467ec9.length <= _0x51e517) {
      return 0;
    }
    let _0x3200fa = 0;
    const _0x17a0cf = Math.max(_0x6780f4, _0x467ec9.length - _0x200dbc);
    for (let _0x19f5e8 = _0x6780f4; _0x19f5e8 < _0x17a0cf; _0x19f5e8 += 1) {
      try {
        const _0x3f7db9 = _0x467ec9[_0x19f5e8];
        _0x3f7db9?.parentNode?.removeChild?.(_0x3f7db9);
        _0x3200fa += 1;
      } catch (_0x474f19) {}
    }
    return _0x3200fa;
  }
  function _0x1f2751(_0x3724bb, _0x35ac0 = "leadgen") {
    if (_0x35ac0 === "entity") {
      return {
        keepHead: 1,
        keepTail: 22,
        replyKeepHead: 0,
        replyKeepTail: 18,
        topTrigger: 48,
        replyTrigger: 40
      };
    }
    if (_0x35ac0 === "monitor") {
      return {
        keepHead: 1,
        keepTail: 26,
        replyKeepHead: 0,
        replyKeepTail: 22,
        topTrigger: 68,
        replyTrigger: 60
      };
    }
    if (_0x3724bb === "interaction") {
      return {
        keepHead: 1,
        keepTail: 34,
        replyKeepHead: 0,
        replyKeepTail: 28,
        topTrigger: 92,
        replyTrigger: 76
      };
    }
    if (_0x3724bb === "scrape") {
      return {
        keepHead: 1,
        keepTail: 28,
        replyKeepHead: 0,
        replyKeepTail: 24,
        topTrigger: 72,
        replyTrigger: 64
      };
    }
    return null;
  }
  function _0xd90a82(_0x148dd3, _0x3776ae = "leadgen") {
    if (_0x3776ae === "monitor") {
      return false;
    }
    if (_0x3776ae === "entity") {
      return true;
    }
    return _0x148dd3 === "scrape" || _0x148dd3 === "interaction";
  }
  function _0x1d4842(_0x535ef8, _0x51021b = {}) {
    const _0x35c65f = _0x51021b.context || "leadgen";
    const _0x127484 = _0x51021b.taskMode ?? _0x357c41.currentTask?.taskMode;
    if (!_0xd90a82(_0x127484, _0x35c65f)) {
      return 0;
    }
    const _0x3dacf8 = _0x51021b.profile || _0x1f2751(_0x127484, _0x35c65f);
    if (!_0x3dacf8) {
      return 0;
    }
    try {
      const _0x1cd9e1 = _0x54606f();
      const _0x1177c9 = _0x5ecb3a();
      const _0x3e15a7 = _0x5c29d8 => {
        if (!_0x5c29d8) {
          return false;
        }
        try {
          if (_0x1cd9e1 && _0x5c29d8.matches?.(_0x1cd9e1)) {
            return true;
          }
          if (_0x1177c9 && _0x5c29d8.matches?.(_0x1177c9)) {
            return true;
          }
          if (_0x1cd9e1 && _0x5c29d8.querySelector?.(_0x1cd9e1)) {
            return true;
          }
          if (_0x1177c9 && _0x5c29d8.querySelector?.(_0x1177c9)) {
            return true;
          }
        } catch (_0x6e4dee) {}
        return false;
      };
      const _0x54fbfe = _0x37c277(_0x535ef8) || _0x535ef8 || document.body;
      if (!_0x54fbfe) {
        return 0;
      }
      let _0x11abd6 = 0;
      const _0x200a55 = _0x54fbfe.matches?.(".comment-mainContent") ? _0x54fbfe : _0x54fbfe.querySelector?.(".comment-mainContent") || _0x54fbfe;
      const _0x26c54d = Array.from(_0x200a55.children || []).filter(_0x3e15a7);
      _0x11abd6 += _0x46c9b0(_0x26c54d, {
        keepHead: _0x3dacf8.keepHead,
        keepTail: _0x3dacf8.keepTail,
        trigger: _0x3dacf8.topTrigger
      });
      const _0x262745 = new Set();
      _0x4308ac(_0x54fbfe).forEach(_0x276625 => {
        const _0x571c0c = _0x276625.getAttribute?.("data-e2e") || "";
        const _0x5beff2 = String(_0x276625.className || "");
        if (_0x571c0c.includes("reply") || /reply-item|ReplyItem/i.test(_0x5beff2)) {
          if (_0x276625.parentElement) {
            _0x262745.add(_0x276625.parentElement);
          }
        }
      });
      _0x262745.forEach(_0x3a8105 => {
        const _0x3d3258 = Array.from(_0x3a8105.children || []).filter(_0x3e15a7);
        _0x11abd6 += _0x46c9b0(_0x3d3258, {
          keepHead: _0x3dacf8.replyKeepHead,
          keepTail: _0x3dacf8.replyKeepTail,
          trigger: _0x3dacf8.replyTrigger
        });
      });
      if (_0x11abd6 > 0) {
        const _0xfb9344 = _0x35c65f === "monitor" ? "监控" : _0x127484 === "interaction" ? "互动" : "采集";
        console.log("[Built-in-Debug] [评论DOM瘦身/" + _0xfb9344 + "] 已移除 " + _0x11abd6 + " 个旧评论节点，保留尾部窗口");
      }
      return _0x11abd6;
    } catch (_0x107356) {
      console.warn("[Built-in-Debug] [评论DOM瘦身] 执行异常:", _0x107356.message || _0x107356);
      return 0;
    }
  }
  const _0x5f3b62 = 60000;
  let _0x25e702 = 0;
  function _0x1a508c(_0x8d1cba = document.body, _0xcb34b2 = "periodic") {
    let _0xb70bc5 = 0;
    try {
      const _0x53cf3e = _0x1a3fd0["douyin.com"];
      const _0x27105b = _0x357c41.currentTask?.taskMode || "interaction";
      const _0x2427ac = {
        keepHead: 0,
        keepTail: _0x27105b === "interaction" ? 20 : 18,
        replyKeepHead: 0,
        replyKeepTail: _0x27105b === "interaction" ? 14 : 12,
        topTrigger: _0x27105b === "interaction" ? 46 : 40,
        replyTrigger: _0x27105b === "interaction" ? 34 : 30
      };
      const _0x516c00 = new Set([_0x8d1cba || document.body, document.body]);
      try {
        document.querySelectorAll(_0x53cf3e.commentPanel).forEach(_0x308da7 => _0x516c00.add(_0x308da7));
      } catch (_0x334a97) {}
      _0x516c00.forEach(_0x57415f => {
        _0xb70bc5 += _0x1d4842(_0x57415f, {
          taskMode: _0x27105b,
          profile: _0x2427ac
        });
      });
    } catch (_0x33ac92) {
      console.warn("[Built-in-Debug] [运行内存整理] 评论DOM清理异常:", _0x33ac92.message || _0x33ac92);
    }
    try {
      _0x201d1b();
    } catch (_0x24dab6) {}
    try {
      if (_0x357c41.currentTask?.taskMode !== "scrape") {
        window._commentScrapeProgress = null;
      }
    } catch (_0x250970) {}
    if (_0xb70bc5 > 0) {
      console.log("[Built-in-Debug] [运行内存整理] " + _0xcb34b2 + " 清理旧评论节点 " + _0xb70bc5 + " 个");
    }
    return _0xb70bc5;
  }
  function _0x8f6f16(_0x2b62cd = document.body, _0x2e8377 = "periodic", _0x589b59 = _0x5f3b62) {
    const _0x425d73 = Date.now();
    if (_0x425d73 - _0x25e702 < _0x589b59) {
      return 0;
    }
    _0x25e702 = _0x425d73;
    return _0x1a508c(_0x2b62cd, _0x2e8377);
  }
  function _0x56964c(_0x1ac258, _0xab92c3, _0x2e2dfb = 4) {
    if (!_0x1ac258) {
      return false;
    }
    const _0x27dd3b = _0x1ac258.getBoundingClientRect();
    const _0x31c461 = !_0xab92c3 || _0xab92c3 === document.body || _0xab92c3 === document.documentElement ? {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    } : _0xab92c3.getBoundingClientRect();
    return _0x27dd3b.bottom > _0x31c461.top + _0x2e2dfb && _0x27dd3b.top < _0x31c461.bottom - _0x2e2dfb && _0x27dd3b.right > _0x31c461.left + _0x2e2dfb && _0x27dd3b.left < _0x31c461.right - _0x2e2dfb;
  }
  function _0x2d3248(_0x11891f) {
    try {
      const _0x2e226c = _0x37c277(_0x11891f) || _0x11891f || document.body;
      const _0xa0b955 = _0x388d89(_0x11891f);
      const _0xd2fcb9 = _0x4308ac(_0x2e226c).filter(_0x5261d7);
      const _0x3503cb = _0xa0b955 ? _0xd2fcb9.filter(_0x3638b6 => _0x56964c(_0x3638b6, _0xa0b955)) : [];
      const _0xa38de0 = _0x3503cb.length ? _0x3503cb : _0xd2fcb9;
      if (!_0xa38de0.length) {
        return "";
      }
      const _0x1e8e72 = _0x4e3d8d => {
        const _0x22930d = _0x3d961d(_0x4e3d8d, {
          requireTime: false,
          skipAuthor: false
        });
        if (!_0x22930d) {
          return String(_0x4e3d8d.innerText || "").replace(/\s+/g, " ").trim().slice(0, 48);
        }
        return _0x22930d.nickname + "|" + String(_0x22930d.text || "").slice(0, 32);
      };
      const _0x179345 = _0xa38de0.slice(0, 3).map(_0x1e8e72).join("||");
      const _0x5a0ac4 = _0xa38de0.slice(-3).map(_0x1e8e72).join("||");
      return _0xa38de0.length + "#" + _0x179345 + "#" + _0x5a0ac4;
    } catch (_0x2077b4) {
      return "";
    }
  }
  function _0x506676(_0x56c245) {
    const _0x23661d = _0x388d89(_0x56c245);
    if (!_0x23661d) {
      return {
        container: null,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        remaining: 0,
        canScrollDown: false,
        nearBottom: true
      };
    }
    const _0x5a1eb6 = Math.max(0, Number(_0x23661d.scrollTop) || 0);
    const _0xdf518e = Math.max(0, Number(_0x23661d.scrollHeight) || 0);
    const _0x119779 = Math.max(0, Number(_0x23661d.clientHeight) || 0);
    const _0x709616 = Math.max(0, _0xdf518e - _0x119779);
    const _0x489954 = Math.max(0, _0x709616 - _0x5a1eb6);
    const _0x124983 = Math.max(80, Math.round(_0x119779 * 0.08));
    return {
      container: _0x23661d,
      scrollTop: _0x5a1eb6,
      scrollHeight: _0xdf518e,
      clientHeight: _0x119779,
      remaining: _0x489954,
      canScrollDown: _0x489954 > Math.max(24, Math.round(_0x119779 * 0.02)),
      nearBottom: _0x489954 <= _0x124983
    };
  }
  const _0x28929e = ["暂时没有更多评论", "暂无更多评论", "没有更多评论", "暂时没有更多了", "没有更多了", "已经到底了"];
  function _0x5afb7b(_0x164b09) {
    try {
      const _0x1c5566 = _0x1a3fd0["douyin.com"];
      const _0x62ea79 = _0x164b09 || document.body;
      const _0x4214d2 = _0x62ea79?.querySelector?.(_0x1c5566.commentPanel) || _0x62ea79;
      const _0x5e7ab3 = Array.from(new Set([_0x4214d2, _0x62ea79].filter(Boolean)));
      for (const _0x2d1e2d of _0x5e7ab3) {
        const _0x4fee9e = Array.from(_0x2d1e2d.querySelectorAll?.("div, span, p") || []);
        for (const _0x1a5e68 of _0x4fee9e) {
          if (!_0x5261d7(_0x1a5e68)) {
            continue;
          }
          if (_0x1a5e68.closest?.(_0x1c5566.commentItem)) {
            continue;
          }
          const _0x2f10d4 = String(_0x1a5e68.innerText || _0x1a5e68.textContent || "").replace(/\s+/g, "").trim();
          if (!_0x2f10d4 || _0x2f10d4.length > 32) {
            continue;
          }
          if (_0x28929e.some(_0x2d44b7 => _0x2f10d4.includes(_0x2d44b7))) {
            return String(_0x1a5e68.innerText || _0x1a5e68.textContent || "").replace(/\s+/g, " ").trim();
          }
        }
      }
    } catch (_0x1b289e) {}
    return "";
  }
  function _0x31c540(_0x18dd3a, _0x295363) {
    const _0x38570a = 8;
    if (!_0x18dd3a || _0x18dd3a <= 0) {
      return _0x38570a;
    }
    const _0x53e1dc = _0x295363 / _0x18dd3a;
    if (_0x53e1dc < 0.03) {
      return 25;
    }
    if (_0x53e1dc < 0.08) {
      return 18;
    }
    if (_0x53e1dc < 0.15) {
      return 14;
    }
    if (_0x53e1dc < 0.3) {
      return 11;
    }
    return _0x38570a;
  }
  function _0x31673e(_0x1a3cac, _0x401f5f) {
    return _0x31c540(_0x1a3cac, _0x401f5f) + 8;
  }
  function _0x40e648(_0x59f5c1, _0x554b70, _0x3a4a4b) {
    if (!_0x59f5c1 || _0x59f5c1 <= 0) {
      return false;
    }
    const _0x4c5ecf = Math.max(0, Math.min(1, _0x554b70 / _0x59f5c1));
    if (_0x4c5ecf >= 0.9) {
      return false;
    }
    const _0x534470 = _0x506676(_0x3a4a4b);
    return _0x534470.canScrollDown;
  }
  function _0x34cd40(_0x768f30, _0x34fc34, _0x54984c) {
    if (!_0x768f30 || _0x768f30 <= 0) {
      return false;
    }
    if (_0x54984c >= 3) {
      return false;
    }
    const _0x341280 = Math.max(0, Math.min(1, _0x34fc34 / _0x768f30));
    return _0x341280 < 0.9;
  }
  function _0x3deccb(_0x3d5743, _0x1b0ebc) {
    if (!_0x3d5743 || !_0x1b0ebc) {
      return true;
    }
    try {
      if (_0x3d5743 !== _0x1b0ebc && _0x3d5743.contains?.(_0x1b0ebc) && !_0x1b0ebc.contains?.(_0x3d5743)) {
        return true;
      }
    } catch (_0xaeda7c) {}
    const _0x4ae925 = (_0x3d5743.className || "") + " " + (_0x3d5743.getAttribute?.("data-e2e") || "") + " " + (_0x3d5743.id || "");
    if (/swiper|Swiper|slide-list|SlideList|feed-scroll|FeedScroll|video-switch|player-container|xgplayer|slider-group/i.test(_0x4ae925)) {
      return true;
    }
    try {
      const _0x353dfd = _0x3d5743.getBoundingClientRect();
      if (_0x353dfd.width > window.innerWidth * 0.55 && _0x353dfd.height > window.innerHeight * 0.65) {
        if (_0x3d5743 !== _0x1b0ebc && !_0x1b0ebc.contains(_0x3d5743)) {
          return true;
        }
      }
    } catch (_0x2891e3) {}
    return false;
  }
  function _0x388d89(_0x5ae50d) {
    const _0xce4298 = _0x37c277(_0x5ae50d);
    if (!_0xce4298) {
      return null;
    }
    const _0x5bca1b = Array.from(_0xce4298.querySelectorAll("[scrollable=\"true\"], [class*=\"Scroll\"], [class*=\"scroll\"]")).filter(_0x119809 => {
      if (!_0x5261d7(_0x119809)) {
        return false;
      }
      if (_0x3deccb(_0x119809, _0xce4298)) {
        return false;
      }
      const _0x5feb20 = _0x119809.scrollHeight || 0;
      const _0x2737ab = _0x119809.clientHeight || 0;
      return _0x5feb20 > _0x2737ab + 30;
    }).sort((_0x4c32c9, _0xb43751) => _0xb43751.scrollHeight - _0xb43751.clientHeight - (_0x4c32c9.scrollHeight - _0x4c32c9.clientHeight));
    if (_0x5bca1b.length) {
      return _0x5bca1b[0];
    }
    if (_0xce4298.scrollHeight > _0xce4298.clientHeight + 30) {
      return _0xce4298;
    }
    let _0x4d3ea0 = _0xce4298.parentElement;
    while (_0x4d3ea0 && _0x4d3ea0 !== document.body) {
      if (_0xce4298.contains(_0x4d3ea0) === false && _0x4d3ea0.contains?.(_0xce4298)) {
        break;
      }
      if (_0x4d3ea0.scrollHeight > _0x4d3ea0.clientHeight + 30 && _0x5261d7(_0x4d3ea0) && !_0x3deccb(_0x4d3ea0, _0xce4298)) {
        return _0x4d3ea0;
      }
      _0x4d3ea0 = _0x4d3ea0.parentElement;
    }
    try {
      const _0x541f00 = _0x4308ac(_0xce4298).find(_0x5261d7);
      let _0x1f7bd8 = _0x541f00?.parentElement;
      while (_0x1f7bd8 && _0x1f7bd8 !== document.body && _0xce4298.contains(_0x1f7bd8)) {
        if (_0x1f7bd8.scrollHeight > _0x1f7bd8.clientHeight + 30 && _0x5261d7(_0x1f7bd8) && !_0x3deccb(_0x1f7bd8, _0xce4298)) {
          return _0x1f7bd8;
        }
        _0x1f7bd8 = _0x1f7bd8.parentElement;
      }
    } catch (_0x423ad1) {}
    return _0xce4298;
  }
  async function _0x172781(_0x1fa679, _0x1ada0f, _0x5ca659, _0x55c885 = {}) {
    const _0x5a0eb5 = _0x388d89(_0x1fa679);
    if (!_0x5a0eb5) {
      return false;
    }
    const _0x56a556 = _0x5a0eb5.scrollTop;
    const _0x1df110 = Math.max(120, Math.min(Math.abs(_0x1ada0f), 3200));
    const _0x59ed07 = _0x1ada0f >= 0 ? 1 : -1;
    const _0x3fdad9 = _0x55c885.bubbles === true || !_0x55c885.containWheel && !window.__radarEntityFeedSwipeLockInstalled;
    try {
      _0x5a0eb5.scrollBy({
        top: _0x59ed07 * _0x1df110,
        behavior: _0x55c885.smooth ? "smooth" : "auto"
      });
    } catch (_0x23cc17) {
      _0x5a0eb5.scrollTop += _0x59ed07 * _0x1df110;
    }
    if (!_0x55c885.skipWheel) {
      const _0x133f85 = _0x5a0eb5.getBoundingClientRect();
      const _0x1bb27b = _0x133f85.left + _0x133f85.width / 2;
      const _0x2c1430 = _0x133f85.top + Math.min(_0x133f85.height * 0.78, _0x133f85.height - 12);
      const _0xcf6205 = new WheelEvent("wheel", {
        deltaY: _0x59ed07 * _0x1df110,
        deltaMode: 0,
        clientX: _0x1bb27b,
        clientY: _0x2c1430,
        bubbles: _0x3fdad9,
        cancelable: true
      });
      _0x5a0eb5.dispatchEvent(_0xcf6205);
      _0x5a0eb5.dispatchEvent(new WheelEvent("wheel", {
        deltaY: _0x59ed07 * Math.round(_0x1df110 * 0.6),
        deltaMode: 0,
        clientX: _0x1bb27b,
        clientY: _0x2c1430,
        bubbles: _0x3fdad9,
        cancelable: true
      }));
    }
    if (_0x55c885.delayMin !== 0) {
      await _0x485121(_0x55c885.delayMin || 60, _0x55c885.delayMax || 180, _0x5ca659);
    }
    return Math.abs(_0x5a0eb5.scrollTop - _0x56a556) > 2;
  }
  async function _0x6eb743(_0x29d597, _0x5089ce, _0x53bb03 = 1) {
    const _0x1a025a = _0x388d89(_0x29d597);
    if (!_0x1a025a) {
      return false;
    }
    const _0x24982 = Math.min(Math.max(_0x53bb03, 1), 8);
    let _0x2731a1 = false;
    const _0x1d29d2 = window.__radarEntityFeedSwipeLockInstalled ? {
      containWheel: true,
      bubbles: false
    } : {};
    if (_0x24982 <= 2) {
      _0x2731a1 = (await _0x172781(_0x29d597, 900, _0x5089ce, {
        delayMin: 80,
        delayMax: 160,
        ..._0x1d29d2
      })) || _0x2731a1;
      _0x2731a1 = (await _0x172781(_0x29d597, 1200, _0x5089ce, {
        delayMin: 80,
        delayMax: 160,
        ..._0x1d29d2
      })) || _0x2731a1;
    } else if (_0x24982 <= 5) {
      await _0x172781(_0x29d597, -240, _0x5089ce, {
        delayMin: 60,
        delayMax: 120,
        ..._0x1d29d2
      });
      _0x2731a1 = (await _0x172781(_0x29d597, 1800, _0x5089ce, {
        delayMin: 100,
        delayMax: 200,
        ..._0x1d29d2
      })) || _0x2731a1;
      _0x2731a1 = (await _0x172781(_0x29d597, 1400, _0x5089ce, {
        delayMin: 100,
        delayMax: 200,
        ..._0x1d29d2
      })) || _0x2731a1;
    } else {
      const _0x95dbf1 = Math.min(_0x1a025a.scrollHeight, _0x1a025a.scrollTop + _0x1a025a.clientHeight * (1.2 + _0x24982 * 0.08));
      const _0x842103 = _0x1a025a.scrollTop;
      _0x1a025a.scrollTop = _0x95dbf1;
      await _0x172781(_0x29d597, 2200, _0x5089ce, {
        delayMin: 120,
        delayMax: 220,
        ..._0x1d29d2
      });
      _0x2731a1 = Math.abs(_0x1a025a.scrollTop - _0x842103) > 2;
      if (!_0x2731a1) {
        _0x1a025a.scrollTop = _0x1a025a.scrollHeight;
        await _0x485121(300, 600, _0x5089ce);
        _0x2731a1 = _0x1a025a.scrollTop > _0x842103;
      }
    }
    return _0x2731a1;
  }
  function _0x5ba095(_0x5a30de, _0x2cb11d = {}) {
    const {
      progress = false,
      hardCapMs = Math.min(Math.round(_0x5a30de * 2.5), Math.max(_0x5a30de + 4000, 20000))
    } = _0x2cb11d;
    if (!progress) {
      return _0x5a30de;
    }
    return Math.min(hardCapMs, Math.round(_0x5a30de * 1.85));
  }
  function _0x18ba59(_0x52e61e, _0x4ee6fa = {}) {
    const {
      progress = false,
      hardCapRounds = Math.min(Math.ceil(_0x52e61e * 2), _0x52e61e + 10)
    } = _0x4ee6fa;
    if (!progress) {
      return _0x52e61e;
    }
    return Math.min(hardCapRounds, Math.ceil(_0x52e61e * 1.7));
  }
  function _0x21c0d7(_0xb8f9d9 = {}) {
    const {
      phase = "warmup",
      expectedTotalCount = 0,
      visibleCount = 0,
      emptyRounds = 0,
      scrollIndex = 0
    } = _0xb8f9d9;
    const _0x1ce925 = Number(expectedTotalCount) || 0;
    const _0x182de7 = Number(visibleCount) || 0;
    const _0x1f5ab3 = _0x1ce925 > 0;
    let _0x2e08aa = 0;
    if (_0x1f5ab3) {
      if (_0x182de7 <= 0) {
        _0x2e08aa += 2.5;
      } else if (_0x182de7 < Math.min(_0x1ce925, 3)) {
        _0x2e08aa += 1.5;
      } else if (_0x182de7 < Math.min(_0x1ce925, 6)) {
        _0x2e08aa += 0.75;
      }
    }
    _0x2e08aa += Math.min(Math.max(Number(emptyRounds) || 0, 0), 5) * 0.65;
    if (scrollIndex >= 4) {
      _0x2e08aa += 0.5;
    }
    if (_0x357c41.currentTask?.taskMode === "scrape") {
      _0x2e08aa += 0.4;
    }
    const _0x4165c3 = phase === "post-scroll" ? {
      min: 1500,
      max: 3000,
      stepMin: 350,
      stepMax: 550,
      capMin: 3800,
      capMax: 6500
    } : {
      min: 900,
      max: 1600,
      stepMin: 300,
      stepMax: 520,
      capMin: 3200,
      capMax: 5600
    };
    const _0x323379 = Math.round(Math.min(_0x4165c3.capMin, _0x4165c3.min + _0x2e08aa * _0x4165c3.stepMin));
    const _0x1d39b9 = Math.round(Math.min(_0x4165c3.capMax, _0x4165c3.max + _0x2e08aa * _0x4165c3.stepMax));
    return [_0x323379, Math.max(_0x323379 + 300, _0x1d39b9)];
  }
  async function _0x30a0fb(_0x540f15, _0x22a6cb, _0x302afd) {
    if (!_0x302afd || _0x302afd <= 0) {
      return 0;
    }
    if (_0x56787c(_0x540f15)) {
      console.log("[Built-in-Debug] [评论预热] 面板显示暂无评论，按 0 条结束预热");
      _0x485cbc("评论区显示暂无评论，按 0 条处理");
      return 0;
    }
    const _0x422b9e = Math.min(_0x302afd, _0x357c41.currentTask?.taskMode === "scrape" ? 10 : 6);
    let _0x3d235f = _0x4219bb(_0x540f15);
    let _0x34c8da = 0;
    const _0x47d929 = 6;
    let _0x457b08 = _0x47d929;
    let _0xe4b655 = false;
    let _0x35945d = 0;
    for (let _0x26b676 = 0; _0x26b676 < _0x457b08; _0x26b676 += 1) {
      if (_0x6ae554(_0x22a6cb)) {
        return _0x3d235f;
      }
      if (_0x56787c(_0x540f15)) {
        _0x35945d += 1;
        if (_0x35945d >= 2 || _0x3d235f === 0) {
          console.log("[Built-in-Debug] [评论预热] 确认暂无评论文案 (round=" + (_0x26b676 + 1) + ")，按 0 条结束");
          _0x485cbc("评论区显示暂无评论，按 0 条处理");
          return 0;
        }
      } else {
        _0x35945d = 0;
      }
      const _0x35364a = _0x4219bb(_0x540f15);
      if (_0x35364a > _0x3d235f) {
        _0x3d235f = _0x35364a;
        _0x34c8da = 0;
      } else if (_0x35364a > 0) {
        _0x34c8da += 1;
      }
      if (_0x3d235f >= _0x422b9e || _0x3d235f > 0 && _0x34c8da >= 2) {
        return _0x3d235f;
      }
      if (!_0xe4b655 && _0x3d235f > 0 && _0x3d235f < _0x422b9e && _0x26b676 >= _0x47d929 - 1) {
        _0x457b08 = _0x18ba59(_0x47d929, {
          progress: true,
          hardCapRounds: 10
        });
        if (_0x457b08 > _0x47d929) {
          _0xe4b655 = true;
          console.log("[Built-in-Debug] [慢环境] 评论区 DOM 仍在渲染，延长预热 " + _0x47d929 + "→" + _0x457b08 + " 轮");
        }
      }
      console.log("[Built-in-Debug] [慢设备保护] 评论区 DOM 渲染中: " + _0x3d235f + "/" + _0x302afd + "，继续等待 (" + (_0x26b676 + 1) + "/" + _0x457b08 + ")");
      _0x485cbc("评论区加载中：已渲染 " + _0x3d235f + "/" + _0x302afd + " 条，稍等...");
      const [_0x3ccfa8, _0x30b83b] = _0x21c0d7({
        phase: "warmup",
        expectedTotalCount: _0x302afd,
        visibleCount: _0x3d235f,
        emptyRounds: _0x26b676
      });
      await _0x485121(_0x3ccfa8, _0x30b83b, _0x22a6cb, "评论区加载");
    }
    if (_0x3d235f === 0 && _0x56787c(_0x540f15)) {
      _0x485cbc("评论区显示暂无评论，按 0 条处理");
      return 0;
    }
    return _0x3d235f;
  }
  function _0x645c7b(_0x269094, _0x4a2e08 = 8) {
    try {
      const _0x251ba9 = _0x37c277(_0x269094) || _0x269094 || document.body;
      const _0x44f497 = _0x4308ac(_0x251ba9);
      const _0x4994f9 = _0x56991c();
      const _0x3af4af = /(\d{1,2}-\d{1,2}|\d{4}-\d{1,2}-\d{1,2}|昨天|刚刚|\d+\s*(分钟|小时|天|周|月|年)前)/;
      const _0x2c4eba = [];
      const _0x439e27 = new Set();
      for (const _0x36d235 of _0x44f497) {
        if (_0x2c4eba.length >= _0x4a2e08) {
          break;
        }
        const _0x44b803 = (_0x36d235.innerText || "").split("\n").map(_0xf6327b => _0xf6327b.trim()).filter(_0x2c8c09 => _0x2c8c09.length > 0);
        if (_0x44b803.length < 2) {
          continue;
        }
        const _0xa166cd = _0x44b803[0];
        if (_0x4994f9 && _0xa166cd === _0x4994f9) {
          continue;
        }
        if (_0x44b803.some(_0x49cf15 => _0x49cf15 === "作者")) {
          continue;
        }
        const _0x2a9d22 = _0x44b803.filter(_0x2a65e2 => _0x2a65e2 !== _0xa166cd && _0x2a65e2 !== "作者赞过" && !_0x2a65e2.includes("回复") && !_0x2a65e2.includes("展开") && !/^\d+$/.test(_0x2a65e2) && (!(_0x2a65e2.length <= 6) || !_0x3af4af.test(_0x2a65e2)));
        let _0x526e04 = _0x2a9d22.length > 0 ? _0x2a9d22.sort((_0x248faa, _0x45fc40) => _0x45fc40.length - _0x248faa.length)[0] : "";
        if (!_0x526e04) {
          continue;
        }
        if (_0x526e04.includes("@豆包") || _0x526e04.includes("@元宝") || _0x526e04.includes("@通义") || _0x526e04.includes("@文心")) {
          continue;
        }
        if (_0x526e04.replace(/[.。·分享回复\s]/g, "").length < 2) {
          continue;
        }
        const _0x46c100 = _0x526e04.slice(0, 120);
        if (_0x439e27.has(_0x46c100)) {
          continue;
        }
        _0x439e27.add(_0x46c100);
        _0x2c4eba.push(_0x46c100);
      }
      return _0x2c4eba;
    } catch (_0x2e0bd9) {
      console.warn("[Built-in-Debug] [评论采样] 异常:", _0x2e0bd9.message || _0x2e0bd9);
      return [];
    }
  }
  function _0x322721(_0x4da6cc = document) {
    try {
      const _0x534143 = _0x37c277(_0x4da6cc);
      const _0x4d6908 = [];
      if (_0x534143) {
        _0x4d6908.push(_0x534143);
      }
      if (_0x4da6cc && _0x4da6cc !== _0x534143) {
        _0x4d6908.push(_0x4da6cc);
      }
      if (!_0x4d6908.length) {
        _0x4d6908.push(document.body);
      }
      for (const _0x6e317f of _0x4d6908) {
        if (_0x47a09c(_0x6e317f, {
          allowBodyFallback: false,
          maxScan: 400
        })) {
          return true;
        }
      }
    } catch (_0x327e7a) {}
    return false;
  }
  function _0x3494d5(_0x381b72 = document) {
    try {
      return !!_0x3d8e02(_0x381b72);
    } catch (_0x2b07f1) {}
    return false;
  }
  async function _0x48d5bf(_0x701438, _0x3fe9e8, _0x492515 = {}) {
    try {
      await _0x51d744(_0x3fe9e8);
    } catch (_0x114084) {}
    const {
      profileVideo = false,
      forMainPost = false
    } = _0x492515;
    const _0x371810 = Number(_0x492515.deadlineAt || 0);
    if (!profileVideo && !_0x5a8eba() && (_0x2784ab() || _0x57923c() || _0x5af672(_0x251e6e()))) {
      console.log("[Built-in-Debug] 直播间内容，跳过评论面板");
      return false;
    }
    if (!_0x577931()) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过打开评论面板");
      return false;
    }
    const _0x559490 = _0x181657();
    if (!_0x559490) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentPanel 选择器为空");
      return false;
    }
    const _0x157ecf = _0x357c41.currentRunningSource === "recommend" || _0x357c41.currentRunningSource === "follow";
    const _0x28dfeb = !profileVideo && !_0x5a8eba() && _0x157ecf && !!_0x554dee();
    const _0x3224bf = _0x28dfeb ? document : _0x701438;
    const _0x2c99c8 = _0x701438 === document.body ? [document] : [_0x701438, document];
    let _0x1f9e06 = _0x149b22(_0x3224bf);
    if (_0x1f9e06 && _0x5261d7(_0x1f9e06)) {
      if (!forMainPost && _0x4308ac(_0x1f9e06).length > 0) {
        console.log("[Built-in-Debug] 评论面板及节点已在视口就绪，极速放行");
        return true;
      }
    }
    if (!_0x1f9e06 || !_0x5261d7(_0x1f9e06)) {
      if (_0x28dfeb) {
        await _0x1df147(_0x3fe9e8, {
          deadlineAt: _0x371810
        });
        _0x1f9e06 = _0x149b22(document);
      } else if (profileVideo || _0x5a8eba()) {
        await _0x3f7971(_0x3fe9e8, {
          deadlineAt: _0x371810
        });
        _0x1f9e06 = _0x149b22(document);
      }
    }
    if ((profileVideo || _0x5a8eba()) && _0x5852c7()) {
      if (!forMainPost || _0x3494d5(_0x701438 || document)) {
        return true;
      }
      console.log("[Built-in-Debug] [主评] 评论区已展开但输入区未就绪，继续等待…");
    }
    if (!_0x1f9e06 || !_0x5261d7(_0x1f9e06)) {
      if (!_0x577931()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，无法展开评论列表");
        return false;
      }
      console.log("[Built-in-Debug] 评论列表未显示，尝试寻找“评论”页签/按钮以展开...");
      const _0x1ec523 = _0x243420() || "评论";
      let _0xed93f5 = null;
      for (const _0x58ba5c of _0x2c99c8) {
        _0xed93f5 = Array.from(_0x58ba5c.querySelectorAll("div, span")).find(_0x1213d4 => {
          if (_0x1213d4.children.length > 2) {
            return false;
          }
          const _0x43646b = _0x1213d4.textContent ? _0x1213d4.textContent.trim() : "";
          return _0x43646b.startsWith(_0x1ec523) && _0x43646b.length < 15 && _0x5261d7(_0x1213d4);
        });
        if (_0xed93f5) {
          break;
        }
      }
      if (_0xed93f5) {
        console.log("[Built-in-Debug] 找到页签按钮: \"" + _0xed93f5.textContent.trim() + "\"，执行切换点击");
        await _0x44e4a6(_0xed93f5.closest("button, [role=\"button\"]") || _0xed93f5, _0x3fe9e8, {
          deadlineAt: _0x371810
        });
        await _0x30d71f(450, _0x371810);
        _0x1f9e06 = _0x149b22(_0x701438);
      }
      if ((!_0x1f9e06 || !_0x5261d7(_0x1f9e06)) && !_0x3494d5(_0x701438 || document)) {
        const _0x29aa39 = _0x7cba7b(_0x96e9a7("openCommentBtns"), _0x96e9a7("openCommentAria"), _0x96e9a7("feedCommentIcon"), _0x96e9a7("videoCommentIcon"), _0x96e9a7("videoPlayerComment"), "[data-e2e=\"feed-comment-icon\"]", "[data-e2e=\"video-comment-icon\"]", "[data-e2e=\"video-player-comment\"]");
        let _0x24a9d1 = null;
        for (const _0x121f5c of _0x2c99c8) {
          const _0x300baa = _0x29aa39 ? Array.from(_0x121f5c.querySelectorAll(_0x29aa39)).filter(_0x11d9e3 => _0x5261d7(_0x11d9e3) && _0x3ca431(_0x11d9e3)) : [];
          if (_0x300baa.length > 0) {
            _0x24a9d1 = _0x300baa[_0x300baa.length - 1];
            break;
          }
        }
        if (_0x24a9d1) {
          console.log("[Built-in-Debug] 找到评论图标 (" + _0x29aa39 + ")，执行点击展开");
          await _0x44e4a6(_0x24a9d1.closest("button, [role=\"button\"]") || _0x24a9d1, _0x3fe9e8, {
            deadlineAt: _0x371810
          });
        }
      }
    }
    const _0x635d7f = forMainPost ? profileVideo ? 5 : 6 : 10;
    let _0xd14809 = _0x635d7f;
    let _0x43201f = false;
    let _0x4ea7fc = false;
    let _0xa077c4 = false;
    for (let _0xf101f4 = 0; _0xf101f4 < _0xd14809; _0xf101f4++) {
      if (_0x6ae554(_0x3fe9e8)) {
        return false;
      }
      if (_0x371810 > 0 && Date.now() >= _0x371810) {
        console.warn("[Built-in-Debug] [主评] 评论面板等待达到总预算，停止继续展开");
        break;
      }
      const _0x32dd49 = profileVideo || _0x5a8eba() ? document.body : _0x701438;
      const _0x28d4f1 = _0x383b31(_0x32dd49);
      const _0x303a74 = _0x322721(_0x32dd49);
      if (forMainPost && _0x3494d5(_0x701438 || document)) {
        console.log("[Built-in-Debug] [主评] 输入区已就绪 (" + (_0xf101f4 + 1) + "/" + _0xd14809 + ")" + (_0x303a74 ? "（列表仍在加载，忽略）" : ""));
        if (_0x303a74) {
          _0x4237de("📝 视频主评：输入框已就绪，无需等待评论列表加载");
        }
        return true;
      }
      if (!forMainPost && _0x28d4f1 === 0 && !_0x303a74) {
        console.log("[Built-in-Debug] 检测到该视频总评论数明确为 0，无需等待数据加载，立即放行");
        return true;
      }
      if (forMainPost && _0x28d4f1 === 0 && !_0x303a74 && _0x1f9e06 && _0x5261d7(_0x1f9e06)) {
        console.log("[Built-in-Debug] [主评] 0 评论且面板已开，进入输入框探测");
        return true;
      }
      if (forMainPost && _0x303a74 && !_0xa077c4) {
        _0xa077c4 = true;
        _0x4237de("📝 视频主评：评论列表加载中，同时侦测输入框…");
        _0x485cbc("侦测评论输入框…");
      }
      await _0x30d71f(forMainPost ? profileVideo ? 400 : 500 : profileVideo ? 600 : 1200, _0x371810);
      _0x1f9e06 = _0x149b22(_0x701438);
      if (_0x1f9e06 && _0x5261d7(_0x1f9e06)) {
        _0x4ea7fc = true;
        if (forMainPost) {
          if (_0x3494d5(_0x701438 || document) || _0x3d8e02(_0x701438 || document)) {
            console.log("[Built-in-Debug] [主评] 面板已开且输入区就绪");
            return true;
          }
          console.log("[Built-in-Debug] [主评] 面板可见，继续等输入区 (" + (_0xf101f4 + 1) + "/" + _0xd14809 + ")…");
        } else {
          const _0x30f950 = _0x4308ac(_0x1f9e06);
          const _0xa697df = _0x322721(_0x32dd49);
          if (_0xa697df) {
            console.log("[Built-in-Debug] 评论面板可见但仍在加载中 (" + (_0xf101f4 + 1) + "/" + _0xd14809 + ")，点击「加载中」并继续等待…");
            await _0x5f3c7f(_0x1f9e06, _0x3fe9e8);
          } else if (_0x30f950.length > 0) {
            console.log("[Built-in-Debug] 评论面板已成功处于开启/可见状态，且已成功加载出 " + _0x30f950.length + " 条评论节点");
            return true;
          } else if (profileVideo) {
            console.log("[Built-in-Debug] [主页作品] 评论面板已可见 (" + (_0xf101f4 + 1) + "/" + _0xd14809 + ")，允许 0 评论视频发主贴");
            return true;
          } else {
            console.log("[Built-in-Debug] 评论面板可见，但内容仍在加载中或暂无评论 (" + (_0xf101f4 + 1) + "/" + _0xd14809 + ")...");
            await _0x5f3c7f(_0x1f9e06, _0x3fe9e8);
          }
        }
      } else if (profileVideo && _0x5852c7()) {
        console.log("[Built-in-Debug] [主页作品] 评论 UI 已展开（占位符可见）");
        return true;
      }
      if (!_0x43201f && _0x4ea7fc && _0xf101f4 >= _0x635d7f - 1 && (forMainPost || _0x28d4f1 !== 0 || _0x303a74)) {
        _0xd14809 = _0x18ba59(_0x635d7f, {
          progress: true,
          hardCapRounds: forMainPost ? profileVideo ? 7 : 9 : 18
        });
        if (_0xd14809 > _0x635d7f) {
          _0x43201f = true;
          console.log("[Built-in-Debug] [慢环境] " + (forMainPost ? "主评输入区" : "评论节点") + "未就绪，延长等待 " + _0x635d7f + "→" + _0xd14809 + " 轮");
          _0x485cbc(forMainPost ? "评论输入加载较慢，继续等待…" : "评论区加载较慢，继续等待…");
        }
      }
    }
    if (forMainPost && _0x3494d5(_0x701438 || document)) {
      return true;
    }
    if (_0x1f9e06 && _0x5261d7(_0x1f9e06)) {
      console.log("[Built-in-Debug] 评论面板超时未加载出节点，判定该视频可能暂无评论，放行处理");
      return true;
    }
    if (profileVideo && _0x5852c7()) {
      return true;
    }
    return false;
  }
  const _0x4c252f = false;
  function _0xccbe40(_0x353a0a = {}) {
    if (_0x353a0a.forEntityLeadgen) {
      return false;
    }
    if (!_0x4c252f) {
      return false;
    }
    if (_0x353a0a.forMonitorScrape) {
      return true;
    }
    const _0x1a8089 = _0x353a0a.taskMode ?? _0x357c41.currentTask?.taskMode;
    return _0x1a8089 === "scrape";
  }
  async function _0x158519(_0x3246d2, _0x4d4c66, _0x1db5d0 = null, _0x42bb35 = null, _0x262fc2 = {}) {
    if (!_0xccbe40(_0x262fc2)) {
      return;
    }
    if (_0x42bb35?.skipExpand) {
      return;
    }
    const _0x569810 = /展开\s*\d*\s*条?回复|展开更多|——\s*展开/;
    if (_0x42bb35 && !_0x42bb35.expandedKeys) {
      _0x42bb35.expandedKeys = new Set();
    }
    const _0x475dc5 = _0x42bb35?.expandedKeys || new Set();
    const _0x25d09d = _0x3f634a => {
      const _0x27e81f = (_0x3f634a.textContent || "").trim();
      const _0x19ec35 = _0x3f634a.closest("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], [class*=\"CommentItem\"], li");
      let _0x4003f6 = "";
      if (_0x19ec35) {
        const _0x334ba8 = _0x19ec35.querySelector("[data-e2e=\"comment-username\"], [data-e2e=\"comment-at-user\"], [class*=\"nickname\"], a[href*=\"/user/\"]");
        _0x4003f6 = (_0x334ba8?.textContent || "").trim().slice(0, 32);
        const _0xfccb29 = _0x19ec35.parentElement ? Array.from(_0x19ec35.parentElement.children).indexOf(_0x19ec35) : -1;
        _0x4003f6 += "#" + _0xfccb29;
      }
      return _0x4003f6 + "|" + _0x27e81f;
    };
    const _0x4048d8 = _0x1e2460 => {
      const _0x2ab4f1 = Array.from(_0x1e2460.querySelectorAll("div, span, p")).filter(_0xa10055 => {
        if (_0xa10055 === _0x1e2460) {
          return false;
        }
        const _0x263404 = (_0xa10055.textContent || "").trim();
        return _0x263404.length > 0 && _0x263404.length <= 25 && _0x569810.test(_0x263404);
      });
      return _0x2ab4f1.length === 0;
    };
    const _0x14cd6b = Array.from(_0x3246d2.querySelectorAll("div[data-e2e], span[data-e2e], div[class*=\"expand\"], span[class*=\"expand\"], div[class*=\"Expand\"], span[class*=\"reply-btn\"], div[class*=\"reply-btn\"], div, span, p"));
    const _0x35615f = _0x14cd6b.filter(_0x322b46 => {
      if (_0x1db5d0 && _0x1db5d0.has(_0x322b46)) {
        return false;
      }
      const _0x291080 = (_0x322b46.textContent || "").trim();
      if (_0x291080.length === 0 || _0x291080.length > 25) {
        return false;
      }
      if (!_0x569810.test(_0x291080)) {
        return false;
      }
      if (!_0x4048d8(_0x322b46)) {
        return false;
      }
      const _0xe7a666 = _0x25d09d(_0x322b46);
      if (_0x475dc5.has(_0xe7a666)) {
        return false;
      }
      return true;
    });
    if (_0x35615f.length > 0) {
      console.log("[Built-in-Debug] [展开回复] 发现 " + _0x35615f.length + " 个新展开按钮，逐一展开...");
    }
    for (const _0x354fdc of _0x35615f) {
      if (_0x6ae554(_0x4d4c66)) {
        break;
      }
      if (_0x42bb35?.skipExpand) {
        break;
      }
      const _0x273124 = _0x25d09d(_0x354fdc);
      _0x475dc5.add(_0x273124);
      if (_0x1db5d0) {
        _0x1db5d0.add(_0x354fdc);
      }
      try {
        const _0x56d562 = _0x4219bb(_0x3246d2);
        const _0x5a772f = (_0x354fdc.textContent || "").trim();
        _0x479ccd(_0x354fdc, {
          force: true,
          block: "nearest"
        });
        await new Promise(_0x218c69 => setTimeout(_0x218c69, 300));
        _0x59b5e8(_0x3246d2);
        await _0x44e4a6(_0x354fdc, _0x4d4c66);
        _0x59b5e8(_0x3246d2);
        await new Promise(_0x385218 => setTimeout(_0x385218, 1200));
        const _0x1166a4 = _0x4219bb(_0x3246d2);
        const _0x2a63db = (_0x354fdc.textContent || "").trim();
        const _0x3d47d5 = _0x569810.test(_0x2a63db);
        const _0x11b9e6 = _0x1166a4 > _0x56d562 || _0x5a772f && _0x2a63db !== _0x5a772f && !_0x3d47d5;
        if (!_0x11b9e6 && _0x3d47d5 && _0x42bb35) {
          _0x42bb35.failCount = (_0x42bb35.failCount || 0) + 1;
          console.warn("[Built-in-Debug] [展开回复] 展开失败 (" + _0x42bb35.failCount + "/2): \"" + _0x5a772f + "\"（已标记，不再重试）");
          if (_0x42bb35.failCount >= 2) {
            _0x42bb35.skipExpand = true;
            console.warn("[Built-in-Debug] [展开回复] 本视频已连续 2 次展开失败，后续不再点击展开");
            break;
          }
        }
      } catch (_0x42cff4) {
        if (_0x42bb35) {
          _0x42bb35.failCount = (_0x42bb35.failCount || 0) + 1;
          if (_0x42bb35.failCount >= 2) {
            _0x42bb35.skipExpand = true;
            console.warn("[Built-in-Debug] [展开回复] 本视频已连续 2 次展开失败，后续不再点击展开");
            break;
          }
        }
      }
    }
  }
  function _0x5a6355(_0x1ed156 = null) {
    const _0x292878 = _0x1ed156 && _0x5261d7(_0x1ed156) ? _0x1ed156 : _0x554dee();
    const _0x53381f = [".xgplayer-playswitch-next", "[data-e2e=\"video-switch-next-btn\"]", "[data-e2e=\"video-switch-next-arrow\"]", ".video-switch-next"];
    const _0x623364 = "[class*=\"SwitchNext\"], [class*=\"switch-next\"], [aria-label*=\"下一条\"], [title*=\"下一条\"]";
    const _0x31b78f = "[data-e2e=\"feed-active-live\"], [data-e2e=\"browse-live\"], [data-e2e=\"feed-live\"], [data-e2e=\"webcast-player\"], [class*=\"live-card\"], [class*=\"LiveCard\"]";
    const _0x4d1669 = _0x1e8e50 => {
      if (!_0x1e8e50) {
        return true;
      }
      try {
        const _0x3c3b7a = [_0x1e8e50.className || "", _0x1e8e50.getAttribute?.("data-e2e") || "", _0x1e8e50.getAttribute?.("aria-label") || "", _0x1e8e50.getAttribute?.("title") || "", _0x1e8e50.id || "", (_0x1e8e50.textContent || "").slice(0, 20)].join(" ");
        if (/playswitch-prev|SwitchPrev|switch-prev|上一条|上一[个条首]|prev/i.test(_0x3c3b7a)) {
          return true;
        }
        if (_0x1e8e50.closest?.(".xgplayer-playswitch-prev, [data-e2e*=\"switch-prev\"], [class*=\"SwitchPrev\"]")) {
          return true;
        }
      } catch (_0xfa19ee) {}
      return false;
    };
    const _0x4a6f75 = _0x5255bf => {
      try {
        return !!_0x5255bf.closest?.(_0x31b78f);
      } catch (_0x302ee7) {
        return false;
      }
    };
    const _0xfc6fd8 = _0x31834e => {
      try {
        const _0x57cb91 = _0x31834e.getBoundingClientRect();
        const _0x803b9f = _0x31834e.getAttribute?.("data-e2e") || "";
        const _0x54af2f = String(_0x31834e.className || "").split(/\s+/).slice(0, 3).join(".");
        return "" + _0x31834e.tagName + (_0x803b9f ? "[data-e2e=" + _0x803b9f + "]" : "") + (_0x54af2f ? "." + _0x54af2f : "") + "@(" + Math.round(_0x57cb91.left) + "," + Math.round(_0x57cb91.top) + "," + Math.round(_0x57cb91.width) + "x" + Math.round(_0x57cb91.height) + ")";
      } catch (_0x2881e7) {
        return _0x31834e?.tagName || "?";
      }
    };
    const _0x4e15b0 = (_0x47ff84, _0x37c7b1) => {
      if (!_0x47ff84 || !_0x5261d7(_0x47ff84) || _0x4d1669(_0x47ff84) || _0x4a6f75(_0x47ff84)) {
        return -Infinity;
      }
      let _0x2de980;
      try {
        _0x2de980 = _0x47ff84.getBoundingClientRect();
      } catch (_0xc535c9) {
        return -Infinity;
      }
      if (!_0x2de980 || _0x2de980.width < 4 || _0x2de980.height < 4) {
        return -Infinity;
      }
      let _0x1feadf = _0x37c7b1;
      if (_0x191379(_0x47ff84)) {
        _0x1feadf += 50;
      }
      if (_0x292878 && typeof _0x292878.contains === "function" && _0x292878.contains(_0x47ff84)) {
        _0x1feadf += 40;
      }
      const _0xca203c = Math.max(1, window.innerWidth);
      _0x1feadf += Math.min(30, _0x2de980.left / _0xca203c * 30);
      _0x1feadf += Math.min(20, _0x2de980.width * _0x2de980.height / 400);
      if (_0x292878) {
        try {
          const _0x1bf73b = _0x292878.getBoundingClientRect();
          const _0x4b556e = _0x2de980.left + _0x2de980.width / 2 - (_0x1bf73b.left + _0x1bf73b.width / 2);
          const _0x27e30e = _0x2de980.top + _0x2de980.height / 2 - (_0x1bf73b.top + _0x1bf73b.height / 2);
          _0x1feadf += Math.max(0, 25 - Math.sqrt(_0x4b556e * _0x4b556e + _0x27e30e * _0x27e30e) / 20);
        } catch (_0x1fcddc) {}
      }
      return _0x1feadf;
    };
    const _0x2801bd = (_0x3b4302, _0xf236a1) => {
      const _0x32105f = [];
      try {
        Array.from(document.querySelectorAll(_0x3b4302)).forEach(_0x4c18af => {
          const _0x1ae73a = _0x4e15b0(_0x4c18af, _0xf236a1);
          if (Number.isFinite(_0x1ae73a) && _0x1ae73a > -Infinity) {
            _0x32105f.push({
              el: _0x4c18af,
              score: _0x1ae73a
            });
          }
        });
      } catch (_0x230e04) {}
      return _0x32105f;
    };
    let _0x840248 = [];
    for (const _0x2e13ab of _0x53381f) {
      _0x840248 = _0x840248.concat(_0x2801bd(_0x2e13ab, 100));
    }
    if (!_0x840248.length) {
      _0x840248 = _0x2801bd(_0x623364, 40);
    }
    if (!_0x840248.length) {
      return null;
    }
    _0x840248.sort((_0x323b74, _0x1629a6) => _0x1629a6.score - _0x323b74.score);
    const _0x3c6611 = _0x840248[0];
    console.log("[Built-in-Debug] [切条] 命中下一条按钮 score=" + _0x3c6611.score.toFixed(1) + " " + ("candidates=" + _0x840248.length + " hit=" + _0xfc6fd8(_0x3c6611.el)));
    return _0x3c6611.el;
  }
  async function _0x542620(_0x3b36ea, {
    aggressive = false,
    preferKeyboard = false,
    keyboardOnly = false
  } = {}) {
    if (_0x6ae554(_0x3b36ea)) {
      return false;
    }
    _0x3b07e5();
    const _0x3dbfee = _0x12c3a7();
    const _0x3e66f3 = preferKeyboard || keyboardOnly;
    const _0x21c25f = _0x3dbfee.shouldSkipButtonClick();
    console.log("[Built-in-Debug] 准备切换下一条视频..." + (" aggressive=" + !!aggressive + " preferKeyboard=" + !!preferKeyboard + " keyboardOnly=" + !!keyboardOnly) + (" buttonCooldown=" + _0x21c25f));
    if (!_0x3e66f3 && _0x21c25f) {
      console.log("[Built-in-Debug] 下一条按钮仍在冷却中，跳过重复切换（防连点）");
      return true;
    }
    const _0x4674ce = _0x554dee();
    const _0x2dc809 = _0x2784ab(_0x4674ce);
    if (_0x2dc809) {
      console.log("[Built-in-Debug] 当前处于直播间卡片，避免聚焦和向其发送键盘/滚轮事件");
      try {
        document.activeElement?.blur?.();
      } catch (_0x36c6cd) {}
      try {
        document.body?.focus?.();
      } catch (_0x470ec) {}
    } else if (_0x4674ce) {
      try {
        _0x4674ce.focus?.();
      } catch (_0x3e23f3) {}
    }
    const _0x347dfc = (_0x227f8c = document.body) => {
      _0x227f8c.dispatchEvent(new KeyboardEvent("keydown", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
        which: 40,
        bubbles: true
      }));
    };
    const _0x4d3f63 = _0x2dc809 || !_0x4674ce ? document.body : _0x4674ce;
    let _0x2bd36a = false;
    if (!_0x3e66f3) {
      const _0x413668 = _0x5a6355(_0x4674ce);
      if (_0x413668) {
        console.log("[Built-in-Debug] 命中下一条按钮，准备点击");
        _0x2bd36a = await _0x10f0d2(_0x413668, _0x3b36ea, "切换下一条视频");
        if (_0x2bd36a) {
          _0x3dbfee.noteAttempt({
            byButton: true
          });
        }
      }
    }
    if (!_0x2bd36a) {
      if (_0x3e66f3) {
        console.log("[Built-in-Debug] 按 preferKeyboard/keyboardOnly，仅用 ArrowDown 切换");
      } else {
        console.log("[Built-in-Debug] 下一条按钮不可用，回退到 ArrowDown 切换");
      }
      const _0x3c87fb = await _0x287fca("ArrowDown", _0x3b36ea, "切换下一条视频");
      if (!_0x3c87fb) {
        _0x347dfc(_0x4d3f63);
      }
      _0x3dbfee.noteAttempt({
        byButton: false
      });
    } else {
      console.log("[Built-in-Debug] 下一条按钮已点击，不再补按键（防连跳）");
    }
    if (aggressive && !_0x2bd36a) {
      await _0x3f311d(280);
      if (!(await _0x287fca("ArrowDown", _0x3b36ea, "再次切换下一条"))) {
        _0x347dfc(document.body);
      }
      await _0x3f311d(280);
      if (!(await _0x287fca("ArrowDown", _0x3b36ea, "第三次切换下一条"))) {
        _0x347dfc(document.body);
      }
      try {
        const _0x4b3a27 = _0x2dc809 || !_0x4674ce ? document.documentElement : _0x4674ce;
        _0x4b3a27.dispatchEvent(new WheelEvent("wheel", {
          deltaY: 520,
          bubbles: true,
          cancelable: true
        }));
      } catch (_0x3c2240) {}
    }
    return true;
  }
  async function _0x46a588(_0x38e181, {
    previousIdentity = "",
    previousTitle = "",
    previousAuthor = "",
    leadVideoUrl = "",
    dedupKey = "",
    phaseLabel = "导航",
    preferredScope = null,
    quietTrace = false,
    acceptTitleOnlySwitch = false,
    requireDistinctVideoId = false
  } = {}) {
    const _0x4496b6 = Date.now();
    let _0x143cc6 = false;
    let _0x1c3699 = "";
    let _0x1130f1 = 0;
    let _0x53de7e = 0;
    let _0x77ecb = false;
    let _0x3f5451 = 0;
    const _0x5ea362 = previousIdentity || _0x379016() || "";
    const _0x492127 = previousTitle || "";
    const _0x149782 = _0x186b5d(previousAuthor || "");
    const _0x108122 = _0x5b0aef(leadVideoUrl || dedupKey || _0x5ea362) || "";
    console.log("[Built-in-Debug] [" + phaseLabel + "] 正在监控视频切换状态...");
    if (!quietTrace) {
      _0x485cbc("等待新视频加载完成...");
    }
    for (let _0xa3d4e5 = 0; _0xa3d4e5 < 24; _0xa3d4e5++) {
      if (_0x6ae554(_0x38e181)) {
        return false;
      }
      const _0x5d3c9b = preferredScope && _0x5261d7(preferredScope) ? preferredScope : _0x5ce888({
        includeFeed: false
      });
      const _0x1f2e03 = _0x5d3c9b && _0x5261d7(_0x5d3c9b) ? _0x5d3c9b : _0x554dee() || document;
      const _0x49e4ed = _0x379016(_0x1f2e03) || "";
      const _0x4a7cc3 = (() => {
        try {
          const _0x6c13e6 = _0x15f856(_0x1f2e03);
          if (_0x46d6bb(_0x6c13e6)) {
            return _0x6c13e6;
          }
        } catch (_0x2a3be2) {}
        const _0x1188c3 = _0x510d83(window.location.href);
        if (_0x46d6bb(_0x1188c3)) {
          return _0x1188c3;
        }
        const _0x21e959 = _0x5b0aef(_0x1188c3) || _0x48d604(_0x1188c3);
        if (_0x21e959) {
          return _0x3f336a(_0x21e959);
        }
        return "";
      })();
      const _0x1b7130 = _0x5b0aef(window.location.href) || "";
      const _0xb46c21 = _0x5b0aef(_0x4a7cc3) || _0x1b7130 || _0x5b0aef(_0x49e4ed) || "";
      const _0x1cbfa8 = _0x251e6e(_0x1f2e03);
      const _0x32e279 = !!_0x5ea362 && !!_0x49e4ed && _0x49e4ed !== _0x5ea362;
      const _0xe605f8 = !!_0x108122 && !!_0xb46c21 && String(_0x108122) !== String(_0xb46c21);
      const _0x42e3ee = _0xe605f8 || (_0x46d6bb(leadVideoUrl) && _0x46d6bb(_0x4a7cc3) ? _0x4a7cc3 !== leadVideoUrl : dedupKey ? _0x4a7cc3 !== dedupKey : false);
      const _0x49f22e = !!_0x492127 && !!_0x1cbfa8 && _0x1cbfa8 !== "未知视频" && _0x1cbfa8 !== _0x492127;
      const _0x107c85 = !!_0x108122 && !!_0xb46c21 && String(_0x108122) === String(_0xb46c21);
      const _0x460d12 = _0x32e279 && (!requireDistinctVideoId || !_0x107c85);
      const _0xc8a69c = _0xe605f8 || _0x49f22e || _0x460d12 || _0x42e3ee && !_0x107c85;
      if (_0x2784ab() || _0x57923c()) {
        if (!quietTrace) {
          _0x485cbc("切换后检测到直播间预览，将自动跳过...");
        }
        _0x143cc6 = true;
        break;
      }
      if (_0xc8a69c) {
        _0x77ecb = true;
        const _0x95145c = _0x60283(_0x1f2e03, _0x4a7cc3 || _0xb46c21);
        const _0xe40bc5 = !!_0x149782 && !!_0x95145c && _0x186b5d(_0x95145c) === _0x149782;
        const _0x36f0fb = !!_0x1cbfa8 && _0x1cbfa8 !== "未知视频";
        const _0x12d88e = _0xe605f8 && _0x36f0fb;
        if (_0xe40bc5 && !_0x12d88e) {
          _0x3f5451 += 1;
        } else {
          _0x3f5451 = 0;
        }
        const _0x449c74 = _0x12d88e || _0x36f0fb && !!_0x95145c && !_0xe40bc5 || acceptTitleOnlySwitch && _0x49f22e && _0x36f0fb || _0x49f22e && _0x36f0fb && _0x3f5451 >= 3;
        const _0x3f21dd = (_0xb46c21 || _0x49e4ed || _0x4a7cc3 || "") + "|" + (_0x1cbfa8 || "") + "|" + (_0x95145c || "");
        if (!_0x449c74) {
          if (_0xe40bc5 && _0xa3d4e5 % 3 === 0) {
            console.log("[Built-in-Debug] [" + phaseLabel + "] 作者仍像上一条「" + _0x95145c + "」，继续快检对齐…");
          }
          _0x1c3699 = "";
          _0x1130f1 = 0;
        } else {
          if (_0x3f21dd === _0x1c3699) {
            _0x1130f1 += 1;
          } else {
            _0x1c3699 = _0x3f21dd;
            _0x1130f1 = 1;
          }
          const _0xf9f3c5 = _0x12d88e || acceptTitleOnlySwitch && _0x49f22e && _0x36f0fb ? 1 : 2;
          if (_0x1130f1 >= _0xf9f3c5) {
            const _0x5379bd = Date.now() - _0x4496b6;
            console.log("[Built-in-Debug] [" + phaseLabel + "] 切换成功！耗时: " + _0x5379bd + "ms, " + ("id=" + (_0xb46c21 || "n/a") + ", 作者: " + (_0x95145c || "待对齐") + ", ") + ("新标题: " + (_0x1cbfa8 || "").substring(0, 15) + "..."));
            if (!quietTrace) {
              _0x485cbc("新视频已加载：" + (_0x1cbfa8 || "未知").substring(0, 18) + "...");
            }
            _0x59b5e8(_0x1f2e03, "切条确认后立即暂停防连播");
            _0x143cc6 = true;
            break;
          }
        }
      }
      const _0x27a6b9 = _0x12c3a7();
      if (_0x27a6b9.shouldRetrySettleSwitch({
        waitStart: _0x4496b6,
        round: _0xa3d4e5,
        sawSwitchProgress: _0x77ecb
      })) {
        _0x53de7e += 1;
        console.log("[Built-in-Debug] [" + phaseLabel + "检测] 等待 " + _0xa3d4e5 + " 轮仍停在原视频，重新尝试切换下一条...");
        if (!quietTrace) {
          _0x485cbc("新视频未响应，重新尝试切换下一条...");
        }
        if (_0x53de7e === 1) {
          await _0x542620(_0x38e181, {
            preferKeyboard: true
          });
        } else {
          await _0x542620(_0x38e181, {
            aggressive: true,
            preferKeyboard: true
          });
        }
      }
      await _0x3f311d(_0x77ecb ? 280 : 420);
    }
    return _0x143cc6;
  }
  async function _0xd25427(_0x3dc549, _0x5660d1, _0x57dbc3 = 10) {
    const _0x42ac49 = _0x5660d1 || _0x379016();
    const _0x3442f2 = _0x57dbc3;
    let _0x195425 = _0x3442f2;
    let _0x4fd4b1 = false;
    let _0x4307aa = false;
    for (let _0x3da9c6 = 0; _0x3da9c6 < _0x195425; _0x3da9c6++) {
      if (_0x6ae554(_0x3dc549)) {
        return false;
      }
      await _0x3f311d(450);
      if (_0x2784ab() || _0x57923c()) {
        _0x4307aa = true;
        continue;
      }
      const _0x247442 = _0x379016();
      if (_0x247442 && _0x247442 !== _0x42ac49) {
        return true;
      }
      if (!_0x247442) {
        _0x4307aa = true;
      }
      const _0x33478b = _0x251e6e();
      if (_0x33478b && !_0x5af672(_0x33478b)) {
        return true;
      }
      if (!_0x4fd4b1 && (_0x4307aa || !_0x33478b || _0x33478b === "未知视频") && _0x3da9c6 >= _0x3442f2 - 1) {
        _0x195425 = _0x18ba59(_0x3442f2, {
          progress: true,
          hardCapRounds: Math.min(_0x3442f2 + 8, 18)
        });
        if (_0x195425 > _0x3442f2) {
          _0x4fd4b1 = true;
          console.log("[Built-in-Debug] [慢环境] 推荐流切换较慢，延长确认 " + _0x3442f2 + "→" + _0x195425 + " 轮");
        }
      }
    }
    return false;
  }
  return {
    aggressiveCommentListScroll: _0x6eb743,
    awaitFeedVideoSwitchSettled: _0x46a588,
    ensureCommentPanelOpen: _0x48d5bf,
    expandReplies: _0x158519,
    findCommentScrollContainer: _0x388d89,
    getAdaptiveCommentWaitRange: _0x21c0d7,
    getCommentEndHintText: _0x5afb7b,
    getCommentScrollMetrics: _0x506676,
    getCommentsTotalCount: _0x383b31,
    getExtendedReadyBudgetMs: _0x5ba095,
    getExtendedReadyRounds: _0x18ba59,
    getScrapeNoCompliantTolerance: _0x31673e,
    getScrapeNoNewDataTolerance: _0x31c540,
    getVideoStats: _0x1b1fb7,
    getVisibleCommentNodeCount: _0x4219bb,
    getVisibleCommentViewportFingerprint: _0x2d3248,
    isCommentPanelContentLoading: _0x322721,
    isCommentPanelEmptyHint: _0x56787c,
    maybeTrimRuntimeMemory: _0x8f6f16,
    moveToNextVideo: _0x542620,
    parseLocalizedCountText: _0x2cf46e,
    pruneStaleCommentDom: _0x1d4842,
    resolveEffectiveCommentTotalCount: _0x295978,
    sampleVisibleCommentTexts: _0x645c7b,
    scrollCommentList: _0x172781,
    shouldContinueScrapeAfterDuplicateWindow: _0x40e648,
    shouldExpandFoldedCommentReplies: _0xccbe40,
    shouldProbeIncompleteScrapeBoundary: _0x34cd40,
    trimRuntimeMemory: _0x1a508c,
    waitForCommentDomWarmup: _0x30a0fb,
    waitForFeedItemChange: _0xd25427
  };
}
module.exports = {
  createCommentFeedNavigationController: createCommentFeedNavigationController
};
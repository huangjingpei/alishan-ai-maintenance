'use strict';

function createSearchVideoQueueController(_0x57a992 = {}) {
  const {
    awaitFeedVideoSwitchSettled: _0x3249e2,
    buildDouyinSearchUrl: _0x171008,
    closeAllModals: _0x50d866,
    collectDouyinSearchResultCards: _0x270479,
    ensureLeadgenScrapeApiHook: _0x3601b4,
    extractSpecificVideoId: _0x5acb8f,
    extractVideoIdFromHref: _0x29deef,
    findDouyinSearchCardContentId: _0x4177aa,
    getDouyinFeedScope: _0x58d5c8,
    getDouyinSearchCardClickTarget: _0x1c4258,
    getDouyinSearchCardRoot: _0x3a9399,
    getFeedVideoIdentity: _0x1124d2,
    getProcessedVideoKeyModule: _0x178048,
    isVisibleElement: _0x2981fa,
    listLeadgenScrapeAwemes: _0x3f0e7c,
    moveToNextVideo: _0x5eec99,
    normalizeUrl: _0x330e4f,
    randomDelay: _0x2ba585,
    rememberPendingLeadVideoUrl: _0x8a82b7,
    reportCurrentAction: _0x524a82,
    reportTraceLog: _0x2ee40b,
    resolveCurrentVisibleVideoUrl: _0x5b323d,
    resolveDouyinVideoDetailModal: _0x4c322b,
    shouldAbort: _0x568604,
    sleep: _0x2ef22d,
    suspendAutomationForNavigation: _0x4fb33c,
    waitForVideoDetailReadyAndPause: _0x8ef68e,
    state: _0x1edba3
  } = _0x57a992;
  function _0x25d334(_0x1f3e33 = _0x1edba3.currentTask) {
    return false;
  }
  function _0x306e01(_0x2413dd) {
    const _0x1146bc = _0x5acb8f(_0x2413dd) || _0x29deef(_0x2413dd);
    if (!_0x1146bc || !/^\d{5,}$/.test(String(_0x1146bc))) {
      return "";
    }
    return "https://www.douyin.com/video/" + _0x1146bc;
  }
  function _0x561fe3(_0x12544c, _0x3f98eb = window._searchVideoUrls) {
    const _0x49b6a0 = _0x5acb8f(_0x12544c) || _0x29deef(_0x12544c);
    if (!_0x49b6a0 || !Array.isArray(_0x3f98eb) || !_0x3f98eb.length) {
      return false;
    }
    return _0x3f98eb.some(_0x177dd1 => _0x5acb8f(_0x177dd1) === _0x49b6a0);
  }
  function _0x1d44bb() {
    window._searchVideoUrls = [];
    window._searchVideoQueueKeyword = null;
    window._searchPendingOpenUrl = "";
    window._searchSessionSkippedUrls = [];
    _0xb736e();
  }
  function _0xb736e() {
    window._searchSlideLastKey = "";
    window._searchSlidePrevKey = "";
    window._searchSlidePairHits = 0;
    window._searchSlideSameHits = 0;
  }
  function _0x464c4b(_0xa03f6f) {
    const _0x52dec7 = _0x5acb8f(_0xa03f6f) || _0x29deef(_0xa03f6f) || String(_0xa03f6f || "").trim();
    if (!_0x52dec7) {
      return "";
    }
    const _0x5ced48 = String(window._searchSlideLastKey || "");
    const _0x2adaf6 = String(window._searchSlidePrevKey || "");
    if (_0x52dec7 === _0x5ced48) {
      window._searchSlideSameHits = (Number(window._searchSlideSameHits) || 1) + 1;
      console.log("[Built-in-Debug] [搜索末尾] 同一视频连续出现 " + window._searchSlideSameHits + "/3：…" + String(_0x52dec7).slice(-8));
      if (window._searchSlideSameHits >= 3) {
        return "same";
      } else {
        return "";
      }
    }
    window._searchSlideSameHits = 1;
    if (_0x2adaf6 && _0x5ced48 && _0x52dec7 === _0x2adaf6 && _0x52dec7 !== _0x5ced48) {
      window._searchSlidePairHits = (Number(window._searchSlidePairHits) || 0) + 1;
      console.log("[Built-in-Debug] [搜索末尾] 检测到末尾来回 " + window._searchSlidePairHits + "/2：" + ("…" + String(_0x5ced48).slice(-8) + " ↔ …" + String(_0x52dec7).slice(-8)));
      window._searchSlidePrevKey = _0x5ced48;
      window._searchSlideLastKey = _0x52dec7;
      if (window._searchSlidePairHits >= 2) {
        return "pair";
      } else {
        return "";
      }
    }
    if (_0x2adaf6 && _0x5ced48 && _0x52dec7 !== _0x5ced48 && _0x52dec7 !== _0x2adaf6) {
      window._searchSlidePairHits = 0;
    }
    window._searchSlidePrevKey = _0x5ced48;
    window._searchSlideLastKey = _0x52dec7;
    return "";
  }
  function _0x4eed18(_0x2af176, _0x3a1f7a = null) {
    const _0x5464a8 = _0x306e01(_0x2af176) || (() => {
      try {
        return _0x178048().normalizeProcessedVideoKey(_0x2af176) || "";
      } catch (_0x2737f7) {
        return "";
      }
    })() || String(_0x2af176 || "").trim();
    if (!_0x5464a8) {
      return "";
    }
    if (!Array.isArray(window._searchSessionSkippedUrls)) {
      window._searchSessionSkippedUrls = [];
    }
    const _0x4e23a6 = _0x5acb8f(_0x5464a8);
    const _0x17247a = window._searchSessionSkippedUrls.some(_0x456b37 => {
      if (_0x456b37 === _0x5464a8) {
        return true;
      }
      return _0x4e23a6 && _0x5acb8f(_0x456b37) === _0x4e23a6;
    });
    if (!_0x17247a) {
      window._searchSessionSkippedUrls.push(_0x5464a8);
      if (window._searchSessionSkippedUrls.length > 500) {
        window._searchSessionSkippedUrls = window._searchSessionSkippedUrls.slice(-400);
      }
    }
    try {
      _0x178048().rememberProcessedVideoKey(_0x1edba3.processedVideos, _0x5464a8);
      if (_0x4e23a6) {
        _0x178048().rememberProcessedVideoKey(_0x1edba3.processedVideos, "https://www.douyin.com/video/" + _0x4e23a6);
      }
    } catch (_0xd84e71) {}
    if (_0x3a1f7a && typeof _0x3a1f7a.add === "function") {
      _0x3a1f7a.add(_0x5464a8);
      if (_0x4e23a6) {
        _0x3a1f7a.add("https://www.douyin.com/video/" + _0x4e23a6);
      }
    }
    return _0x5464a8;
  }
  function _0x244776(_0x365936) {
    const _0x2d27f8 = _0x306e01(_0x365936) || String(_0x365936 || "").trim();
    window._searchPendingOpenUrl = _0x2d27f8 || "";
    if (_0x2d27f8) {
      _0x8a82b7(_0x2d27f8);
    }
    return _0x2d27f8;
  }
  function _0x4e521f() {
    window._searchPendingOpenUrl = "";
  }
  function _0x37cc06() {
    const _0x2de516 = _0x306e01(window._searchPendingOpenUrl || "") || String(window._searchPendingOpenUrl || "").trim();
    window._searchPendingOpenUrl = "";
    return _0x2de516;
  }
  function _0x3af028() {
    return _0x306e01(window._searchPendingOpenUrl || "") || String(window._searchPendingOpenUrl || "").trim();
  }
  function _0x5deedf(_0x14948a, _0x8892c2 = null) {
    if (!_0x14948a) {
      return false;
    }
    const _0xedfe40 = _0x5acb8f(_0x14948a);
    const _0x445ba3 = _0x306e01(_0x14948a);
    if (_0x8892c2 && typeof _0x8892c2.has === "function") {
      if (_0x445ba3 && _0x8892c2.has(_0x445ba3)) {
        return true;
      }
      if (_0x8892c2.has(_0x14948a)) {
        return true;
      }
      if (_0xedfe40 && _0x8892c2.has("https://www.douyin.com/video/" + _0xedfe40)) {
        return true;
      }
      for (const _0x70c76e of _0x8892c2) {
        if (!_0x70c76e) {
          continue;
        }
        if (_0x70c76e === _0x14948a || _0x70c76e === _0x445ba3) {
          return true;
        }
        if (_0xedfe40 && _0x5acb8f(_0x70c76e) === _0xedfe40) {
          return true;
        }
      }
    }
    try {
      if (_0x178048().hasProcessedVideoKey(_0x1edba3.processedVideos, _0x14948a)) {
        return true;
      }
      if (_0x445ba3 && _0x178048().hasProcessedVideoKey(_0x1edba3.processedVideos, _0x445ba3)) {
        return true;
      }
    } catch (_0x23dc30) {}
    return false;
  }
  function _0x1002ac({
    queue = window._searchVideoUrls,
    processedSet = null,
    sessionUrls = null,
    excludeIds = []
  } = {}) {
    const _0x7622a7 = Array.isArray(queue) ? queue : [];
    const _0x17fdc9 = new Set((Array.isArray(excludeIds) ? excludeIds : []).map(_0x4a4d12 => _0x5acb8f(_0x4a4d12) || String(_0x4a4d12 || "").trim()).filter(Boolean));
    const _0x3a6cbf = _0x5b996a => {
      try {
        if (processedSet && _0x178048().hasProcessedVideoKey(processedSet, _0x5b996a)) {
          return true;
        }
      } catch (_0x35ea6b) {}
      return _0x5deedf(_0x5b996a, sessionUrls);
    };
    return _0x7622a7.find(_0x3761a3 => {
      const _0x39f07f = _0x5acb8f(_0x3761a3);
      if (!_0x39f07f) {
        return false;
      }
      if (_0x17fdc9.has(_0x39f07f)) {
        return false;
      }
      if (_0x3a6cbf(_0x3761a3)) {
        return false;
      }
      return true;
    }) || "";
  }
  async function _0x36ecb1(_0xb0e6f3, _0x80012d, {
    allowHardNavigation = true,
    softWaitMs = 3500,
    hardWaitMs = 6500
  } = {}) {
    const _0x237c10 = _0x306e01(_0x80012d) || String(_0x80012d || "").trim();
    const _0x44efcb = _0x5acb8f(_0x237c10);
    if (!_0x237c10 || !_0x44efcb) {
      return "failed";
    }
    _0x8a82b7(_0x237c10);
    if (window.location.href.includes("/search/")) {
      try {
        const _0x3c5df2 = new URL(window.location.href);
        _0x3c5df2.searchParams.set("modal_id", _0x44efcb);
        const _0x2ea745 = _0x3c5df2.toString();
        if (_0x2ea745 !== window.location.href) {
          try {
            history.replaceState({}, "", _0x2ea745);
            window.dispatchEvent(new PopStateEvent("popstate"));
          } catch (_0x528add) {}
        }
        let _0x3dd35a = await _0x8ef68e(_0xb0e6f3, _0x237c10, softWaitMs);
        if (_0x3dd35a) {
          _0x1edba3.lastClickedId = _0x237c10;
          return "ready";
        }
        if (allowHardNavigation && !_0x568604(_0xb0e6f3)) {
          _0x4fb33c();
          window.location.href = _0x2ea745;
          return "navigating";
        }
      } catch (_0x11e486) {}
    }
    if (!allowHardNavigation) {
      return "failed";
    }
    _0x4fb33c();
    try {
      const _0x19669c = window.location.href.includes("/search/") ? window.location.href : _0x171008(window._searchVideoQueueKeyword || "");
      const _0x383548 = new URL(_0x19669c);
      _0x383548.searchParams.set("modal_id", _0x44efcb);
      window.location.href = _0x383548.toString();
    } catch (_0x595269) {
      window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + _0x44efcb;
    }
    return "navigating";
  }
  async function _0x1a10b7(_0x295051, {
    videoTitle = "",
    leadVideoUrl = "",
    dedupKey = "",
    modal = null,
    phaseLabel = "导航",
    activeKeyword = "",
    sessionUrls = null,
    onSwitchOk = null
  } = {}) {
    const _0x4161f5 = Array.isArray(window._searchVideoUrls) ? window._searchVideoUrls : [];
    const _0x3fc356 = _0x4161f5.length > 0 && _0x25d334(_0x1edba3.currentTask);
    if (!_0x3fc356) {
      return "fallback";
    }
    if (_0x1edba3.sessionProcessedCount >= _0x1edba3.targetVideoCount) {
      console.log("[Built-in-Debug] [搜索队列] 已处理 " + _0x1edba3.sessionProcessedCount + "/" + _0x1edba3.targetVideoCount + "，关闭弹窗并收尾本词");
      _0x524a82("本词搜索队列已处理完，正在关闭弹窗…");
      _0x2ee40b("ℹ️ 搜索评论队列：已完成 " + _0x1edba3.sessionProcessedCount + "/" + _0x1edba3.targetVideoCount + "，切换新词", null, "normal");
      await _0x50d866(_0x295051);
      return "done";
    }
    const _0x5a76c1 = _0x1124d2(_0x58d5c8() || modal) || "";
    await _0x5eec99(_0x295051);
    const _0x1de5eb = await _0x3249e2(_0x295051, {
      previousIdentity: _0x5a76c1,
      previousTitle: videoTitle,
      leadVideoUrl: leadVideoUrl,
      dedupKey: dedupKey,
      phaseLabel: phaseLabel
    });
    const _0x499d6a = _0x5b323d("", _0x58d5c8() || _0x4c322b({
      includeFeed: false
    }) || document) || "";
    const _0x1a8abc = _0x5acb8f(_0x499d6a) || _0x5acb8f(_0x1124d2() || "");
    const _0xe74690 = _0x1a8abc && _0x561fe3(_0x499d6a || _0x1a8abc, _0x4161f5);
    const _0x2b6166 = sessionUrls || new Set();
    const _0x232028 = _0x1a8abc && (_0x178048().hasProcessedVideoKey(_0x1edba3.processedVideos, _0x499d6a) || _0x178048().hasProcessedVideoKey(_0x1edba3.processedVideos, "https://www.douyin.com/video/" + _0x1a8abc) || _0x2b6166.has(_0x499d6a) || _0x2b6166.has("https://www.douyin.com/video/" + _0x1a8abc) || _0x5deedf(_0x499d6a || _0x1a8abc, _0x2b6166));
    if (_0x1de5eb && !_0x232028) {
      if (!_0xe74690) {
        console.log("[Built-in-Debug] [搜索队列] 切条成功但未命中预收集队列 (id=" + (_0x1a8abc || "unknown") + ")，继续处理当前条");
        _0x2ee40b("ℹ️ 搜索队列：切条已成功，继续分析当前视频", null, "normal");
      }
      if (typeof onSwitchOk === "function") {
        onSwitchOk();
      }
      window._modalSlideCount = (window._modalSlideCount || 0) + 1;
      await _0x2ba585(1500, 3000, _0x295051, "切换喘息");
      return "continued";
    }
    const _0x2bdb14 = _0x1002ac({
      queue: _0x4161f5,
      processedSet: _0x1edba3.processedVideos,
      sessionUrls: _0x2b6166,
      excludeIds: [dedupKey, leadVideoUrl, _0x499d6a, _0x1a8abc]
    });
    if (!_0x2bdb14) {
      console.log("[Built-in-Debug] [搜索队列] 无剩余未处理链接，收尾本词");
      _0x2ee40b("ℹ️ 搜索评论队列：无剩余链接，关闭弹窗并切换新词", null, "normal");
      await _0x50d866(_0x295051);
      _0x4e521f();
      _0x1edba3.sessionProcessedCount = Math.max(_0x1edba3.sessionProcessedCount, _0x1edba3.targetVideoCount);
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      return "done";
    }
    _0x4eed18(dedupKey || leadVideoUrl, _0x2b6166);
    if (_0x232028) {
      _0x4eed18(_0x499d6a || _0x1a8abc, _0x2b6166);
    }
    console.log("[Built-in-Debug] [搜索队列] 弹层切条未对准可用视频，改打开: " + _0x2bdb14 + " (switched=" + !!_0x1de5eb + ", inQueue=" + !!_0xe74690 + ", done=" + !!_0x232028 + ")");
    _0x524a82("搜索队列切条未对准，正在按链接打开下一条…");
    _0x2ee40b("🔗 搜索队列兜底打开：…" + String(_0x2bdb14).slice(-16));
    _0x244776(_0x2bdb14);
    _0x1edba3.lastClickedId = _0x2bdb14;
    _0x8a82b7(_0x2bdb14);
    if (window._saveRadarState) {
      window._saveRadarState();
    }
    const _0x255ffa = await _0x36ecb1(_0x295051, _0x2bdb14, {
      allowHardNavigation: true,
      softWaitMs: 4500,
      hardWaitMs: 6500
    });
    if (_0x255ffa === "navigating") {
      return "navigating";
    }
    if (_0x255ffa === "ready") {
      _0x4e521f();
      if (window._saveRadarState) {
        window._saveRadarState();
      }
      if (typeof onSwitchOk === "function") {
        onSwitchOk();
      }
      await _0x2ba585(1200, 2200, _0x295051, "队列打开喘息");
      return "continued";
    }
    await _0x50d866(_0x295051);
    _0x4fb33c();
    try {
      const _0x360fd1 = _0x5acb8f(_0x2bdb14);
      const _0x1c36b0 = window.location.href.includes("/search/") ? window.location.href : _0x171008(activeKeyword || "");
      const _0x3b1634 = new URL(_0x1c36b0);
      if (_0x360fd1) {
        _0x3b1634.searchParams.set("modal_id", _0x360fd1);
      }
      window.location.href = _0x360fd1 ? _0x3b1634.toString() : _0x2bdb14;
    } catch (_0x1cb668) {
      const _0x3096fe = _0x5acb8f(_0x2bdb14);
      window.location.href = _0x3096fe ? "https://www.douyin.com/jingxuan?modal_id=" + _0x3096fe : _0x2bdb14;
    }
    return "navigating";
  }
  function _0x4008ab() {
    const _0x4e1448 = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]";
    let _0x112417 = [];
    try {
      _0x112417 = Array.from(document.querySelectorAll(_0x4e1448)).filter(_0x2981fa);
    } catch (_0x2c087e) {
      _0x112417 = [];
    }
    const _0x2415dd = new Map();
    _0x112417.forEach(_0xab063d => {
      const _0x3746d2 = _0xab063d.href || _0xab063d.getAttribute("href");
      if (!_0x3746d2) {
        return;
      }
      const _0x570a17 = _0x306e01(_0x3746d2) || _0x330e4f(_0x3746d2);
      if (!_0x570a17 || _0x2415dd.has(_0x570a17)) {
        return;
      }
      _0x2415dd.set(_0x570a17, {
        clickTarget: _0xab063d,
        card: _0x3a9399(_0xab063d)
      });
    });
    const _0x1aa4b7 = _0x270479();
    _0x1aa4b7.forEach(_0x3671a4 => {
      const _0x378deb = _0x4177aa(_0x3671a4);
      if (!_0x378deb) {
        return;
      }
      const _0x13708a = _0x306e01("https://www.douyin.com/video/" + _0x378deb);
      if (!_0x13708a || _0x2415dd.has(_0x13708a)) {
        return;
      }
      _0x2415dd.set(_0x13708a, {
        clickTarget: _0x1c4258(_0x3671a4),
        card: _0x3a9399(_0x3671a4)
      });
    });
    return {
      cardMap: _0x2415dd,
      allLinks: _0x112417,
      customCards: _0x1aa4b7
    };
  }
  async function _0x3e00ab(_0x14a560, _0x6e15d5 = 20) {
    const _0x53cfcf = Math.max(1, Math.min(500, Math.floor(Number(_0x6e15d5) || 20)));
    _0x524a82("正在收集搜索结果视频链接（目标 " + _0x53cfcf + " 条）…");
    _0x2ee40b("🔍 搜索评论队列：开始收集，目标 " + _0x53cfcf + " 条");
    try {
      _0x3601b4({
        force: true
      });
    } catch (_0x5ea205) {}
    const _0x41b433 = [];
    const _0x57ad7c = new Set();
    const _0x502488 = _0x739781 => {
      const _0x2d19fb = _0x306e01(_0x739781);
      const _0x2a976a = _0x5acb8f(_0x2d19fb);
      if (!_0x2a976a || _0x57ad7c.has(_0x2a976a)) {
        return false;
      }
      _0x57ad7c.add(_0x2a976a);
      _0x41b433.push(_0x2d19fb);
      return true;
    };
    let _0x3af004 = 0;
    const _0x26c328 = Math.min(80, Math.max(10, _0x53cfcf * 3));
    for (let _0x1d17f3 = 0; _0x1d17f3 < _0x26c328; _0x1d17f3 += 1) {
      if (_0x568604(_0x14a560)) {
        break;
      }
      const _0x1f67f3 = _0x41b433.length;
      const {
        cardMap: _0x2d76a3
      } = _0x4008ab();
      for (const _0x567e3e of _0x2d76a3.keys()) {
        if (_0x41b433.length >= _0x53cfcf) {
          break;
        }
        _0x502488(_0x567e3e);
      }
      try {
        for (const _0x2458d8 of _0x3f0e7c() || []) {
          if (_0x41b433.length >= _0x53cfcf) {
            break;
          }
          _0x502488(_0x2458d8?.videoUrl || _0x2458d8?.videoId);
        }
      } catch (_0x1af9a5) {}
      const _0x294a9f = _0x41b433.length - _0x1f67f3;
      if (_0x41b433.length >= _0x53cfcf) {
        console.log("[Built-in-Debug] [搜索队列] 已达目标 " + _0x41b433.length + "/" + _0x53cfcf + "（第 " + (_0x1d17f3 + 1) + " 轮）");
        break;
      }
      if (_0x294a9f === 0) {
        _0x3af004 += 1;
      } else {
        _0x3af004 = 0;
      }
      let _0x5d6d42 = false;
      try {
        _0x5d6d42 = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      } catch (_0x1904ec) {}
      if (_0x3af004 >= 4 || _0x5d6d42 && _0x3af004 >= 2 || _0x2d76a3.size === 0 && _0x3af004 >= 2) {
        console.log("[Built-in-Debug] [搜索队列] 停止收集: emptyStreak=" + _0x3af004 + " bottom=" + _0x5d6d42 + " " + ("cards=" + _0x2d76a3.size + " got=" + _0x41b433.length + "/" + _0x53cfcf));
        break;
      }
      _0x524a82("搜索队列收集中 " + _0x41b433.length + "/" + _0x53cfcf + "，继续下拉…");
      if (_0x1d17f3 === 0 || _0x294a9f > 0 || _0x1d17f3 % 3 === 0) {
        _0x2ee40b("🎬 搜索评论队列：滚动第 " + (_0x1d17f3 + 1) + " 轮，已收集 " + _0x41b433.length + "/" + _0x53cfcf);
      }
      try {
        window.scrollBy(0, 1100);
      } catch (_0x2ec849) {}
      await _0x2ba585(900, 1600, _0x14a560, "搜索队列收集滚动");
    }
    try {
      window.scrollTo(0, 0);
    } catch (_0x423308) {}
    await _0x2ef22d(700);
    _0x2ee40b("✅ 搜索评论队列：收集完成 " + _0x41b433.length + " 条（目标 " + _0x53cfcf + "）");
    _0x524a82("已收集 " + _0x41b433.length + " 条搜索视频链接，准备从第一条进入…");
    return _0x41b433;
  }
  return {
    advanceAfterSearchQueuedVideo: _0x1a10b7,
    buildDouyinSearchResultCardMap: _0x4008ab,
    clearSearchPendingOpenUrl: _0x4e521f,
    clearSearchSlideOscillationState: _0xb736e,
    clearSearchVideoUrlQueue: _0x1d44bb,
    collectSearchVideoUrlsForCommentTask: _0x3e00ab,
    findNextUnprocessedSearchQueueUrl: _0x1002ac,
    isSearchQueueUrlSessionDone: _0x5deedf,
    markSearchQueueUrlSkipped: _0x4eed18,
    normalizeSearchQueueVideoUrl: _0x306e01,
    noteSearchSlideVideoKey: _0x464c4b,
    openSearchQueueVideoByUrl: _0x36ecb1,
    peekSearchPendingOpenUrl: _0x3af028,
    setSearchPendingOpenUrl: _0x244776,
    shouldUseSearchVideoUrlQueue: _0x25d334
  };
}
module.exports = {
  createSearchVideoQueueController: createSearchVideoQueueController
};
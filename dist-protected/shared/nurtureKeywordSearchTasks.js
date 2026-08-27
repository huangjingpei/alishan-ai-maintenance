'use strict';

const NURTURE_SEARCH_COLLECT_LIMIT = 8;
const NURTURE_SEARCH_READY_WAIT_MS = 5000;
const NURTURE_SEARCH_NAV_REUSE_MS = 45000;
const NURTURE_SEARCH_EMPTY_RETRY_BEFORE_RELOAD = 1;
const NURTURE_SEARCH_EMPTY_RETRY_BEFORE_ADVANCE = 2;
const NURTURE_SEARCH_KEYWORD_COOLDOWN_MS = 720000;
function persistNurtureSearchState(_0x5c4ae5, _0x1b31c8, _0x1a711d) {
  try {
    const {
      currentTask: _0x9b6474,
      ..._0xad0dc
    } = _0x1a711d || {};
    _0x5c4ae5.setItem(_0x1b31c8, JSON.stringify(_0xad0dc));
  } catch (_0x1e855a) {
    try {
      _0x5c4ae5.setItem(_0x1b31c8, JSON.stringify(_0x1a711d));
    } catch (_0x4f59f1) {}
  }
}
function safeDecodeURIComponent(_0x4d0463) {
  try {
    return decodeURIComponent(String(_0x4d0463 || ""));
  } catch (_0x321e83) {
    return String(_0x4d0463 || "");
  }
}
function extractSearchKeywordFromHref(_0x3a1412) {
  try {
    const _0x251426 = new URL(String(_0x3a1412 || ""), "https://www.douyin.com");
    const _0x1f5fe5 = String(_0x251426.pathname || "").match(/\/search\/([^/?#]+)/i);
    if (_0x1f5fe5?.[1]) {
      return safeDecodeURIComponent(_0x1f5fe5[1]).trim();
    }
    const _0x2ce0e6 = _0x251426.searchParams.get("keyword") || _0x251426.searchParams.get("search_keyword") || _0x251426.searchParams.get("keyword_id") || "";
    return safeDecodeURIComponent(_0x2ce0e6).trim();
  } catch (_0x5dbf9d) {
    return "";
  }
}
function isOnAnyDouyinSearchPage() {
  try {
    return /douyin\.com\/search/i.test(String(window.location.href || ""));
  } catch (_0x53a4dd) {
    return false;
  }
}
function pickNurtureSearchKeyword(_0x11f74c) {
  const _0x3f2b3f = Array.isArray(_0x11f74c.interestKeywords) ? _0x11f74c.interestKeywords.map(_0x40a6dd => String(_0x40a6dd || "").trim()).filter(Boolean) : [];
  if (!_0x3f2b3f.length) {
    return "";
  }
  const _0x3ed48b = _0x11f74c.searchExhaustedKeywords && typeof _0x11f74c.searchExhaustedKeywords === "object" ? _0x11f74c.searchExhaustedKeywords : {};
  const _0x40c343 = Date.now();
  const _0x281b6d = Math.max(0, Number(_0x11f74c.searchKeywordIndex) || 0) % _0x3f2b3f.length;
  for (let _0x1eb04e = 0; _0x1eb04e < _0x3f2b3f.length; _0x1eb04e += 1) {
    const _0x435ae7 = (_0x281b6d + _0x1eb04e) % _0x3f2b3f.length;
    const _0x338a3c = _0x3f2b3f[_0x435ae7];
    const _0x37a6b3 = Number(_0x3ed48b[_0x338a3c]) || 0;
    if (_0x37a6b3 && _0x40c343 < _0x37a6b3) {
      continue;
    }
    _0x11f74c.searchKeywordIndex = _0x435ae7;
    return _0x338a3c;
  }
  return "";
}
function advanceNurtureSearchKeyword(_0x823024) {
  const _0x1cbd88 = Array.isArray(_0x823024.interestKeywords) ? _0x823024.interestKeywords : [];
  if (!_0x1cbd88.length) {
    return;
  }
  _0x823024.searchKeywordIndex = (Math.max(0, Number(_0x823024.searchKeywordIndex) || 0) + 1) % _0x1cbd88.length;
  _0x823024.searchQueue = [];
  _0x823024.searchQueueIndex = 0;
  _0x823024.searchKeyword = "";
  delete _0x823024.searchQueueKeyword;
  _0x823024.searchEmptyStreak = 0;
  delete _0x823024.searchEmptyReloaded;
  delete _0x823024.pendingSearchOpenUrl;
  delete _0x823024.pendingSearchOpenIndex;
  delete _0x823024.pendingSearchHardNavTried;
}
function markNurtureSearchKeywordExhausted(_0x2c7469, _0x109b5c) {
  const _0xb7c46 = String(_0x109b5c || "").trim();
  if (!_0xb7c46) {
    return;
  }
  if (!_0x2c7469.searchExhaustedKeywords || typeof _0x2c7469.searchExhaustedKeywords !== "object") {
    _0x2c7469.searchExhaustedKeywords = {};
  }
  _0x2c7469.searchExhaustedKeywords[_0xb7c46] = Date.now() + NURTURE_SEARCH_KEYWORD_COOLDOWN_MS;
}
function isOnKeywordSearchPage(_0x5c7162) {
  try {
    const _0x3bd80d = String(window.location.href || "");
    if (!/douyin\.com\/search/i.test(_0x3bd80d)) {
      return false;
    }
    const _0xfcaf24 = String(_0x5c7162 || "").trim();
    if (!_0xfcaf24) {
      return true;
    }
    const _0x995fcb = encodeURIComponent(_0xfcaf24);
    if (_0x3bd80d.includes(_0x995fcb) || _0x3bd80d.includes(_0xfcaf24)) {
      return true;
    }
    const _0x34a08f = safeDecodeURIComponent(_0x3bd80d);
    if (_0x34a08f.includes(_0xfcaf24)) {
      return true;
    }
    const _0x26c4f2 = extractSearchKeywordFromHref(_0x3bd80d);
    if (!_0x26c4f2) {
      return false;
    }
    return _0x26c4f2 === _0xfcaf24 || _0x26c4f2.includes(_0xfcaf24) || _0xfcaf24.includes(_0x26c4f2);
  } catch (_0x3c474b) {
    return isOnAnyDouyinSearchPage();
  }
}
function shouldReuseCurrentSearchPage(_0x4798d8, _0x32e09d) {
  if (!isOnAnyDouyinSearchPage()) {
    return false;
  }
  if (isOnKeywordSearchPage(_0x32e09d)) {
    return true;
  }
  const _0x831b01 = String(_0x4798d8.searchNavKeyword || "") === String(_0x32e09d || "");
  const _0x53a9a2 = Date.now() - (Number(_0x4798d8.searchNavAt) || 0) < NURTURE_SEARCH_NAV_REUSE_MS;
  return _0x831b01 && _0x53a9a2;
}
function extractIdFromUrl(_0xfbc7da, _0x3dc12b) {
  try {
    return _0x3dc12b?.(_0xfbc7da) || "";
  } catch (_0x5314e2) {
    return "";
  }
}
function hrefHasModalId(_0x5c9cef) {
  try {
    const _0x531656 = String(window.location.href || "");
    if (!_0x5c9cef) {
      return /modal_id=/.test(_0x531656);
    }
    return _0x531656.includes("modal_id=" + _0x5c9cef) || _0x531656.includes("/video/" + _0x5c9cef) || _0x531656.includes("/note/" + _0x5c9cef);
  } catch (_0x519dfa) {
    return false;
  }
}
function findSearchCardForUrl(_0xd6fa75, _0x4d5fc0 = {}) {
  const {
    buildDouyinSearchResultCardMap: _0x108544,
    normalizeSearchQueueVideoUrl: _0x3723af,
    extractSpecificVideoId: _0x267cbe
  } = _0x4d5fc0;
  if (typeof _0x108544 !== "function") {
    return null;
  }
  const _0x2fc7e6 = _0x3723af?.(_0xd6fa75) || String(_0xd6fa75 || "").trim();
  const _0x47e480 = extractIdFromUrl(_0x2fc7e6, _0x267cbe);
  const {
    cardMap: _0x24c3b6
  } = _0x108544() || {};
  if (!_0x24c3b6 || typeof _0x24c3b6.get !== "function") {
    return null;
  }
  if (_0x2fc7e6 && _0x24c3b6.has(_0x2fc7e6)) {
    return _0x24c3b6.get(_0x2fc7e6);
  }
  for (const [_0x97ec9f, _0x2b407d] of _0x24c3b6.entries()) {
    const _0x183579 = extractIdFromUrl(_0x97ec9f, _0x267cbe);
    if (_0x47e480 && _0x183579 && String(_0x183579) === String(_0x47e480)) {
      return _0x2b407d;
    }
  }
  return null;
}
async function isNurtureSearchDetailReady(_0x40cc59, _0x5c648e, _0x4565b1 = {}, _0x5e6a98 = 0) {
  const {
    waitForVideoDetailReadyAndPause: _0x202543,
    resolveDouyinVideoDetailModal: _0x3bf51c,
    isVisibleElement: _0x2f9578
  } = _0x4565b1;
  if (typeof _0x202543 === "function" && _0x5e6a98 > 0) {
    const _0x460533 = await _0x202543(_0x40cc59, _0x5c648e, _0x5e6a98);
    if (_0x460533) {
      return true;
    }
  }
  try {
    const _0x2f6551 = _0x3bf51c?.({
      includeFeed: false
    });
    if (_0x2f6551 && (!_0x2f9578 || _0x2f9578(_0x2f6551))) {
      return true;
    }
  } catch (_0x4a03c3) {}
  return hrefHasModalId(extractIdFromUrl(_0x5c648e, _0x4565b1.extractSpecificVideoId));
}
async function openNurtureSearchVideo(_0x256b4a, _0x528699, _0x58a308, _0x46238c = {}) {
  const {
    simulateHumanClick: _0x3a882f,
    getDouyinSearchCardClickTarget: _0x1f6fb8,
    openSearchQueueVideoByUrl: _0x491f1b,
    waitForVideoDetailReadyAndPause: _0x70ea23,
    extractSpecificVideoId: _0x51b6e5,
    setSearchPendingOpenUrl: _0x11ca3b,
    suspendAutomationForNavigation: _0x4120ef,
    shouldAbort: _0x24fc97,
    reportTraceLog: _0x407b33,
    reportCurrentAction: _0x1b7a71,
    clipTraceText: _0x4c46d7
  } = _0x46238c;
  const _0x4f104f = extractIdFromUrl(_0x528699, _0x51b6e5);
  if (!_0x4f104f) {
    return "failed";
  }
  try {
    _0x11ca3b?.(_0x528699);
  } catch (_0x2e4483) {}
  if (await isNurtureSearchDetailReady(_0x256b4a, _0x528699, _0x46238c, 0)) {
    const _0x177351 = await isNurtureSearchDetailReady(_0x256b4a, _0x528699, _0x46238c, 2500);
    if (_0x177351) {
      _0x407b33?.("📺 养号：已在目标视频详情，开始完播");
      return "ready";
    }
  }
  const _0x525989 = findSearchCardForUrl(_0x528699, _0x46238c);
  const _0xdff283 = _0x525989 ? _0x1f6fb8?.(_0x525989.card) || _0x525989.clickTarget || _0x525989.card : null;
  if (_0xdff283 && typeof _0x3a882f === "function" && !_0x24fc97?.(_0x256b4a)) {
    _0x1b7a71?.("养号：点击搜索结果卡片打开视频…");
    _0x407b33?.("🖱 养号：点击搜索卡片打开 …" + String(_0x4f104f).slice(-8));
    try {
      await _0x3a882f(_0xdff283, _0x256b4a);
    } catch (_0x419890) {
      _0x407b33?.("养号：搜索卡片点击异常（" + (_0x4c46d7?.(_0x419890?.message || _0x419890, 40) || "error") + "）", null, "warning");
    }
    if (await isNurtureSearchDetailReady(_0x256b4a, _0x528699, _0x46238c, NURTURE_SEARCH_READY_WAIT_MS)) {
      return "ready";
    }
    if (_0x525989?.card && _0x525989.card !== _0xdff283) {
      try {
        await _0x3a882f(_0x1f6fb8?.(_0x525989.card) || _0x525989.card, _0x256b4a);
      } catch (_0x5e0640) {}
      if (await isNurtureSearchDetailReady(_0x256b4a, _0x528699, _0x46238c, 3500)) {
        return "ready";
      }
    }
  }
  if (typeof _0x491f1b === "function") {
    const _0x42c86f = await _0x491f1b(_0x256b4a, _0x528699, {
      allowHardNavigation: false,
      softWaitMs: NURTURE_SEARCH_READY_WAIT_MS
    });
    if (_0x42c86f === "ready") {
      return "ready";
    }
  } else if (typeof _0x70ea23 === "function" && window.location.href.includes("/search/")) {
    try {
      const _0x1ca153 = new URL(window.location.href);
      _0x1ca153.searchParams.set("modal_id", _0x4f104f);
      if (_0x1ca153.toString() !== window.location.href) {
        history.replaceState({}, "", _0x1ca153.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    } catch (_0x3723f7) {}
    if (await _0x70ea23(_0x256b4a, _0x528699, NURTURE_SEARCH_READY_WAIT_MS)) {
      return "ready";
    }
  }
  if (_0x58a308.pendingSearchHardNavTried) {
    _0x407b33?.("养号：该视频已硬跳仍未进详情，跳过本条", null, "warning");
    return "failed";
  }
  if (_0x24fc97?.(_0x256b4a)) {
    return "failed";
  }
  _0x58a308.pendingSearchHardNavTried = true;
  _0x1b7a71?.("养号：点击未拉起详情，modal_id 硬跳打开…");
  _0x407b33?.("🔗 养号：modal_id 硬跳打开 …" + String(_0x4f104f).slice(-8));
  try {
    _0x4120ef?.();
  } catch (_0xe6a8be) {}
  try {
    const _0x5dac91 = new URL(window.location.href.includes("/search/") ? window.location.href : "https://www.douyin.com/search/" + encodeURIComponent(_0x58a308.searchKeyword || ""));
    _0x5dac91.searchParams.set("modal_id", _0x4f104f);
    window.location.href = _0x5dac91.toString();
  } catch (_0x1790a7) {
    window.location.href = "https://www.douyin.com/jingxuan?modal_id=" + _0x4f104f;
  }
  return "navigating";
}
async function runNurtureKeywordSearchWatchRound(_0x5df4c2, _0x3b5399, _0x5605e8 = {}) {
  const {
    buildDouyinSearchUrl: _0x3ab945,
    collectSearchVideoUrlsForCommentTask: _0x3d1ab9,
    closeAllModals: _0x28bb6e,
    shouldAbort: _0x1d0aca,
    randomDelay: _0x356882,
    reportCurrentAction: _0x4c0611,
    reportTraceLog: _0xf724e8,
    clipTraceText: _0xf5ccfd,
    sessionStorage: _0x5d001c,
    getNurtureStateKey: _0x4ea8b7,
    nurtureWatchCurrentVideo: _0x35a393,
    awaitSecurityChallengeIfPresent: _0x481036,
    clearSearchPendingOpenUrl: _0x5a3659,
    waitForDouyinSearchContentAfterZero: _0x1e03e8,
    prepareSearchPageReload: _0xdc3c41
  } = _0x5605e8;
  if (typeof _0x3ab945 !== "function" || typeof _0x3d1ab9 !== "function" || typeof _0x35a393 !== "function") {
    return {
      didWork: false,
      skipped: true,
      reason: "search_deps_missing"
    };
  }
  const _0x204f4c = typeof _0x4ea8b7 === "function" ? _0x4ea8b7() : "";
  const _0x396d4a = String(_0x3b5399.searchKeyword || pickNurtureSearchKeyword(_0x3b5399) || "").trim();
  if (!_0x396d4a) {
    const _0x19a2fd = Array.isArray(_0x3b5399.interestKeywords) && _0x3b5399.interestKeywords.some(_0x49f022 => String(_0x49f022 || "").trim());
    if (_0x19a2fd) {
      _0xf724e8?.("🌱 养号：当前关键词暂无可用结果，短暂改走推荐流", null, "warning");
      await _0x356882?.(2500, 4500, _0x5df4c2, "养号搜索词冷却");
      return {
        didWork: false,
        skipped: true,
        reason: "search_temporarily_exhausted"
      };
    }
    _0xf724e8?.("🌱 养号：未配置兴趣关键词，跳过搜索完播");
    return {
      didWork: false,
      skipped: true,
      reason: "no_keywords"
    };
  }
  _0x3b5399.searchKeyword = _0x396d4a;
  try {
    window._searchVideoQueueKeyword = _0x396d4a;
  } catch (_0x3d5df1) {}
  if (!Array.isArray(_0x3b5399.searchQueue) || !_0x3b5399.searchQueue.length || _0x3b5399.searchQueueKeyword !== _0x396d4a) {
    if (!_0x3b5399.pendingSearchOpenUrl || !Array.isArray(_0x3b5399.searchQueue) || !_0x3b5399.searchQueue.length) {
      if (!shouldReuseCurrentSearchPage(_0x3b5399, _0x396d4a)) {
        const _0x1c1bd1 = _0x3ab945(_0x396d4a);
        _0x4c0611?.("养号：搜索「" + _0x396d4a + "」…");
        _0xf724e8?.("🔍 养号：打开搜索「" + (_0xf5ccfd?.(_0x396d4a, 24) || _0x396d4a) + "」并收集视频");
        _0x3b5399.searchNavKeyword = _0x396d4a;
        _0x3b5399.searchNavAt = Date.now();
        _0x3b5399.searchEmptyStreak = 0;
        delete _0x3b5399.searchEmptyReloaded;
        try {
          _0xdc3c41?.(_0x5df4c2, _0x396d4a, "养号打开搜索");
        } catch (_0x55aae3) {}
        persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
        window.location.href = _0x1c1bd1;
        return {
          didWork: true,
          navigated: true
        };
      }
      if (typeof _0x481036 === "function") {
        await _0x481036(_0x5df4c2);
      }
      await _0x356882?.(1800, 3200, _0x5df4c2, "搜索页加载");
      if (typeof _0x1e03e8 === "function") {
        _0x4c0611?.("养号：等待「" + _0x396d4a + "」搜索结果就绪…");
        const _0x3f21b6 = await _0x1e03e8(_0x5df4c2, _0x396d4a);
        if (_0x3f21b6?.aborted || _0x1d0aca?.(_0x5df4c2)) {
          return {
            didWork: false,
            skipped: true,
            reason: "aborted"
          };
        }
      }
      _0x4c0611?.("养号：收集「" + _0x396d4a + "」搜索结果…");
      const _0x7f0ea = await _0x3d1ab9(_0x5df4c2, NURTURE_SEARCH_COLLECT_LIMIT);
      _0x3b5399.searchQueue = Array.isArray(_0x7f0ea) ? _0x7f0ea.filter(Boolean) : [];
      _0x3b5399.searchQueueIndex = 0;
      _0x3b5399.searchQueueKeyword = _0x396d4a;
      try {
        window._searchVideoUrls = _0x3b5399.searchQueue.slice();
      } catch (_0x12c888) {}
      persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
      if (!_0x3b5399.searchQueue.length) {
        _0x3b5399.searchEmptyStreak = (Number(_0x3b5399.searchEmptyStreak) || 0) + 1;
        const _0x19c087 = _0x3b5399.searchEmptyStreak;
        if (_0x19c087 <= NURTURE_SEARCH_EMPTY_RETRY_BEFORE_RELOAD) {
          _0xf724e8?.("🔍 养号：「" + (_0xf5ccfd?.(_0x396d4a, 24) || _0x396d4a) + "」暂未扫到视频（第 " + _0x19c087 + " 次），稍后同页重试", null, "warning");
          persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
          await _0x356882?.(2800, 4500, _0x5df4c2, "养号空搜重试");
          return {
            didWork: true,
            skipped: true,
            reason: "empty_search_retry"
          };
        }
        if (_0x19c087 <= NURTURE_SEARCH_EMPTY_RETRY_BEFORE_ADVANCE && !_0x3b5399.searchEmptyReloaded) {
          _0x3b5399.searchEmptyReloaded = true;
          _0xf724e8?.("🔍 养号：「" + (_0xf5ccfd?.(_0x396d4a, 24) || _0x396d4a) + "」仍无结果，刷新搜索页一次", null, "warning");
          _0x3b5399.searchNavKeyword = _0x396d4a;
          _0x3b5399.searchNavAt = Date.now();
          try {
            _0xdc3c41?.(_0x5df4c2, _0x396d4a, "养号空搜自愈刷新");
          } catch (_0x45768d) {}
          persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
          window.location.href = _0x3ab945(_0x396d4a);
          return {
            didWork: true,
            navigated: true
          };
        }
        _0xf724e8?.("🔍 养号：关键词「" + (_0xf5ccfd?.(_0x396d4a, 24) || _0x396d4a) + "」多次无可用视频，切换下一词", null, "warning");
        markNurtureSearchKeywordExhausted(_0x3b5399, _0x396d4a);
        advanceNurtureSearchKeyword(_0x3b5399);
        persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
        await _0x356882?.(2000, 3500, _0x5df4c2, "养号切换搜索词");
        return {
          didWork: true,
          skipped: true,
          reason: "empty_search"
        };
      }
      _0x3b5399.searchEmptyStreak = 0;
      delete _0x3b5399.searchEmptyReloaded;
      if (_0x3b5399.searchExhaustedKeywords?.[_0x396d4a]) {
        delete _0x3b5399.searchExhaustedKeywords[_0x396d4a];
      }
      _0xf724e8?.("✅ 养号：「" + (_0xf5ccfd?.(_0x396d4a, 24) || _0x396d4a) + "」已收集 " + _0x3b5399.searchQueue.length + " 条，开始完播");
    }
  } else {
    try {
      window._searchVideoUrls = _0x3b5399.searchQueue.slice();
    } catch (_0x4e0efa) {}
  }
  let _0x49138c = String(_0x3b5399.pendingSearchOpenUrl || "").trim();
  let _0x515380 = Math.max(0, Number(_0x3b5399.searchQueueIndex) || 0);
  if (!_0x49138c) {
    if (_0x515380 >= _0x3b5399.searchQueue.length) {
      advanceNurtureSearchKeyword(_0x3b5399);
      persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
      return {
        didWork: true,
        skipped: true,
        reason: "queue_done"
      };
    }
    _0x49138c = _0x3b5399.searchQueue[_0x515380];
    _0x3b5399.pendingSearchOpenUrl = _0x49138c;
    _0x3b5399.pendingSearchHardNavTried = false;
    persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
  } else {
    _0x515380 = Math.max(0, Number(_0x3b5399.pendingSearchOpenIndex ?? _0x3b5399.searchQueueIndex) || 0);
  }
  _0x3b5399.pendingSearchOpenIndex = _0x515380;
  _0x4c0611?.("养号：完播搜索视频 " + (_0x515380 + 1) + "/" + _0x3b5399.searchQueue.length + "（" + _0x396d4a + "）…");
  _0xf724e8?.("📺 养号：打开搜索结果 " + (_0x515380 + 1) + "/" + _0x3b5399.searchQueue.length + "「" + (_0xf5ccfd?.(_0x396d4a, 20) || _0x396d4a) + "」");
  const _0x2c1ef5 = await openNurtureSearchVideo(_0x5df4c2, _0x49138c, _0x3b5399, _0x5605e8);
  persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
  if (_0x2c1ef5 === "navigating") {
    return {
      didWork: true,
      navigated: true
    };
  }
  if (_0x2c1ef5 !== "ready") {
    _0xf724e8?.("养号：搜索视频打开失败，跳过本条", null, "warning");
    delete _0x3b5399.pendingSearchOpenUrl;
    delete _0x3b5399.pendingSearchOpenIndex;
    delete _0x3b5399.pendingSearchHardNavTried;
    try {
      _0x5a3659?.();
    } catch (_0x1f016c) {}
    _0x3b5399.searchQueueIndex = _0x515380 + 1;
    if (_0x3b5399.searchQueueIndex >= _0x3b5399.searchQueue.length) {
      advanceNurtureSearchKeyword(_0x3b5399);
    }
    persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
    return {
      didWork: true,
      skipped: true,
      reason: "open_failed"
    };
  }
  if (typeof _0x481036 === "function") {
    await _0x481036(_0x5df4c2);
  }
  const _0x47a851 = await _0x35a393(_0x5df4c2, _0x3b5399, {
    forceComplete: true,
    fromSearch: true
  });
  delete _0x3b5399.pendingSearchOpenUrl;
  delete _0x3b5399.pendingSearchOpenIndex;
  delete _0x3b5399.pendingSearchHardNavTried;
  try {
    _0x5a3659?.();
  } catch (_0x173541) {}
  _0x3b5399.searchQueueIndex = _0x515380 + 1;
  if (typeof _0x28bb6e === "function") {
    try {
      await _0x28bb6e(_0x5df4c2);
    } catch (_0x263246) {}
  } else {
    try {
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        keyCode: 27,
        bubbles: true
      }));
    } catch (_0x12a86a) {}
  }
  await _0x356882?.(1200, 2200, _0x5df4c2, "搜索完播后回列表");
  if (_0x3b5399.searchQueueIndex >= _0x3b5399.searchQueue.length) {
    advanceNurtureSearchKeyword(_0x3b5399);
  }
  persistNurtureSearchState(_0x5d001c, _0x204f4c, _0x3b5399);
  return {
    didWork: true,
    watched: !_0x47a851?.skipped,
    skipped: !!_0x47a851?.skipped
  };
}
module.exports = {
  NURTURE_SEARCH_COLLECT_LIMIT: NURTURE_SEARCH_COLLECT_LIMIT,
  runNurtureKeywordSearchWatchRound: runNurtureKeywordSearchWatchRound,
  openNurtureSearchVideo: openNurtureSearchVideo,
  pickNurtureSearchKeyword: pickNurtureSearchKeyword,
  advanceNurtureSearchKeyword: advanceNurtureSearchKeyword,
  isOnKeywordSearchPage: isOnKeywordSearchPage,
  isOnAnyDouyinSearchPage: isOnAnyDouyinSearchPage,
  shouldReuseCurrentSearchPage: shouldReuseCurrentSearchPage,
  extractSearchKeywordFromHref: extractSearchKeywordFromHref,
  markNurtureSearchKeywordExhausted: markNurtureSearchKeywordExhausted
};
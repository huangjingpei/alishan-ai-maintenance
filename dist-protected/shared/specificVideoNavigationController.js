'use strict';

const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createSpecificVideoNavigationController(_0x214f6c = {}) {
  const {
    PLATFORM_SELECTORS: _0x3171f2,
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: _0x58067e,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: _0x403bd6,
    SPECIFIC_VIDEO_NAV_APPEAR_WAIT_MS: _0x55caf8,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: _0x11ddaf,
    SPECIFIC_VIDEO_STATE_KEY: _0x5ae0ad,
    clipTraceText: _0x2afb5a,
    ensureSpecificVideoApiHook: _0x14b27d,
    extractVideoIdFromHref: _0x49bb65,
    finalizeAccountTask: _0xeda8c3,
    findCommentScrollContainer: _0x5a2887,
    getProcessedVideoKeyModule: _0xc242da,
    getSpecificVideoOpenModule: _0x2c196b,
    getVideoEngagePack: _0x2c0fcb,
    ipcRenderer: _0x188b2a,
    isCommentPanelContentLoading: _0x28b2cc,
    isViewingDouyinVideoPage: _0x3db638,
    isVisibleElement: _0x199dc4,
    legacyRadarSessionKey: _0x31195b,
    localStorage: _0x3fd277,
    logTaskDbg: _0x3092cf,
    lookupSpecificVideoApiProbe: _0x4050f4,
    normalizeUrl: _0x494983,
    radarSessionKey: _0x533e40,
    randomDelay: _0x58b810,
    rememberPendingLeadVideoUrl: _0x100ac3,
    reportCurrentAction: _0x55854b,
    reportTraceLog: _0x58b17b,
    resolveCommentPanelRoot: _0x16b4aa,
    scrollCommentList: _0x5367e2,
    sessionStorage: _0x4c0621,
    shouldAbort: _0x519967,
    simulateHumanClick: _0x1995d2,
    sleep: _0x5a5981,
    state: _0x5e1b8b
  } = _0x214f6c;
  function _0x540c23(_0x39fb36) {
    if (!_0x39fb36) {
      return "";
    }
    const _0xbccbb4 = _0x49bb65(_0x39fb36);
    if (_0xbccbb4) {
      return "https://www.douyin.com/jingxuan?modal_id=" + _0xbccbb4;
    }
    return _0x39fb36;
  }
  function _0xda846a(_0x406262) {
    if (!_0x5e1b8b.allowSpecificReprocess || _0x5e1b8b.currentRunningSource !== "specific") {
      return false;
    }
    const _0x4a044b = window._specificVideoUrls || _0x395e22(_0x5e1b8b.currentTask);
    const _0x35e93f = _0x1f7513(_0x406262);
    return !!_0x35e93f && !!_0x4a044b.some(_0x4df3aa => _0x1f7513(_0x4df3aa) === _0x35e93f);
  }
  function _0x2108ca(_0x1641c2, _0x55ed2b = window._specificVideoUrls) {
    const _0x5cc1ab = _0x1f7513(_0x1641c2);
    if (!_0x5cc1ab) {
      return false;
    }
    const _0x1c7333 = Array.isArray(_0x55ed2b) && _0x55ed2b.length ? _0x55ed2b : _0x395e22(_0x5e1b8b.currentTask);
    return _0x1c7333.some(_0x345cbc => _0x1f7513(_0x345cbc) === _0x5cc1ab);
  }
  function _0x571927(_0x121136) {
    if (_0x5e1b8b.currentRunningSource !== "specific") {
      return false;
    }
    return _0x2108ca(_0x121136);
  }
  function _0x41ee72(_0x2abb28) {
    const _0x4014d9 = _0x1f7513(_0x2abb28);
    if (!_0x4014d9 || !window._specificSessionCompletedIds) {
      return false;
    }
    return window._specificSessionCompletedIds.has(_0x4014d9);
  }
  function _0x1178de(_0x5afc55) {
    const _0x3b40af = _0x1f7513(_0x5afc55);
    if (!_0x3b40af) {
      return;
    }
    if (!window._specificSessionCompletedIds) {
      window._specificSessionCompletedIds = new Set();
    }
    window._specificSessionCompletedIds.add(_0x3b40af);
    if (typeof window._saveRadarState === "function") {
      window._saveRadarState();
    }
  }
  function _0x395e22(_0x1c1508) {
    return String(_0x1c1508?.specifiedUrls || "").split(/[\n,，\s]+/).map(_0x389ac3 => _0x389ac3.trim()).filter(Boolean).map(_0x540c23);
  }
  function _0x366568(_0x187f76) {
    const _0x3de5e3 = Array.isArray(_0x187f76?.videoMainCommentedVideoIds) ? _0x187f76.videoMainCommentedVideoIds : [];
    _0x5e1b8b.videoMainCommentedVideoIds = new Set(_0x3de5e3.filter(Boolean));
    _0x3092cf("主评去重", "载入 " + _0x5e1b8b.videoMainCommentedVideoIds.size + " 条本账号已主评视频");
  }
  function _0x55bb5d(_0x2f2eb0) {
    if (!_0x2f2eb0 || _0x5e1b8b.videoMainCommentedVideoIds.size === 0) {
      return false;
    }
    const _0x10f2de = _0x1f7513(_0x2f2eb0);
    if (!_0x10f2de) {
      return false;
    }
    if (_0x5e1b8b.videoMainCommentedVideoIds.has(_0x10f2de)) {
      return true;
    }
    for (const _0x124968 of _0x5e1b8b.videoMainCommentedVideoIds) {
      if (_0x1f7513(_0x124968) === _0x10f2de) {
        return true;
      }
    }
    return false;
  }
  function _0x52bac5(_0x1d6371) {
    const _0x5b8579 = _0x1f7513(_0x1d6371);
    if (_0x5b8579) {
      _0x5e1b8b.videoMainCommentedVideoIds.add(_0x5b8579);
    }
  }
  function _0x31be50(_0x142129) {
    return _0x494983(_0x142129) || "";
  }
  function _0x1f7513(_0x1e7f3b) {
    if (!_0x1e7f3b) {
      return "";
    }
    const _0xcb0d1a = _0xc242da();
    if (typeof _0xcb0d1a.extractDouyinVideoId === "function") {
      const _0x25177c = _0xcb0d1a.extractDouyinVideoId(_0x1e7f3b);
      if (_0x25177c) {
        return _0x25177c;
      }
    }
    return _0x49bb65(_0x1e7f3b) || "";
  }
  function _0x44453d(_0x3ff275, _0x51a937) {
    if (!_0x3db638(_0x3ff275) || !_0x51a937) {
      return false;
    }
    const _0x2c4255 = _0x1f7513(_0x3ff275);
    const _0x116560 = _0x1f7513(_0x51a937);
    if (_0x2c4255 && _0x116560) {
      return _0x2c4255 === _0x116560;
    }
    return _0x31be50(_0x3ff275) === _0x31be50(_0x51a937);
  }
  function _0x578585(_0x7f4bb9 = {}) {
    const _0x560120 = _0x7f4bb9.includeFeed !== false;
    const _0x316b45 = String(window.location.href || "");
    const _0x23b308 = _0x316b45.includes("/search/") && !_0x316b45.includes("/video/") && !_0x316b45.includes("/note/");
    const _0x39985f = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[data-e2e=\"video-player-container\"]", ...(_0x560120 ? ["[data-e2e=\"feed-active-video\"]"] : []), "[class*=\"note-detail\"]", "[class*=\"NoteDetail\"]", "[class*=\"SearchDetail\"]", "[class*=\"search-detail\"]", "[class*=\"VideoDetail\"]", "[class*=\"video-detail\"]", "[class*=\"DetailModal\"]", "[class*=\"detail-modal\"]", "[role=\"dialog\"]"];
    const _0xf39c2b = [];
    for (const _0x4c59bd of _0x39985f) {
      try {
        document.querySelectorAll(_0x4c59bd).forEach(_0xe97433 => {
          if (!_0xe97433 || !_0x199dc4(_0xe97433)) {
            return;
          }
          const _0x36ea39 = _0xe97433.getBoundingClientRect();
          const _0x5d1c36 = _0x36ea39.width * _0x36ea39.height;
          if (_0x5d1c36 < 12000) {
            return;
          }
          const _0x168488 = !!_0xe97433.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, img, canvas");
          const _0x41d664 = _0xe97433.matches?.("[class*=\"SearchDetail\"]") ? _0xe97433 : _0xe97433.closest?.("[class*=\"SearchDetail\"]");
          const _0x1f272b = !!_0x41d664 && !!_0x199dc4(_0x41d664) && !!_0x41d664.querySelector?.("[data-e2e=\"video-player-close-icon\"], [aria-label=\"关闭\"], [class*=\"modal-close\"], [class*=\"ModalClose\"], [class*=\"close-btn\"], [class*=\"CloseBtn\"]") && !!_0x41d664.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, img, canvas");
          if (_0x4c59bd === "[role=\"dialog\"]" && !_0x168488) {
            return;
          }
          if (_0x23b308) {
            const _0x54c936 = _0x4c59bd === "[data-e2e=\"video-detail-container\"]" || _0x4c59bd === ".modal-video-container" || /note-detail|NoteDetail|VideoDetail|DetailModal|detail-modal/.test(_0x4c59bd) || _0x1f272b || _0x4c59bd === "[role=\"dialog\"]" || !!_0xe97433.closest?.("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"VideoDetail\"], [class*=\"DetailModal\"], [class*=\"note-detail\"], [class*=\"NoteDetail\"], [role=\"dialog\"]");
            if (!_0x54c936) {
              return;
            }
          }
          _0xf39c2b.push({
            el: _0xe97433,
            area: _0x5d1c36,
            hasMedia: _0x168488
          });
        });
      } catch (_0x15510d) {}
    }
    if (_0xf39c2b.length > 0) {
      _0xf39c2b.sort((_0x41640d, _0x28070d) => {
        if (_0x41640d.hasMedia !== _0x28070d.hasMedia) {
          if (_0x41640d.hasMedia) {
            return -1;
          } else {
            return 1;
          }
        }
        return _0x28070d.area - _0x41640d.area;
      });
      return _0xf39c2b[0].el;
    }
    if (_0x23b308) {
      return null;
    }
    const _0x43f903 = _0x3171f2["douyin.com"]?.modalContainer;
    if (!_0x43f903) {
      return null;
    }
    try {
      const _0x4c4ffc = document.querySelector(_0x43f903);
      if (_0x4c4ffc && _0x199dc4(_0x4c4ffc)) {
        const _0x24e3b1 = _0x4c4ffc.getBoundingClientRect();
        if (_0x24e3b1.width * _0x24e3b1.height >= 12000) {
          return _0x4c4ffc;
        }
      }
    } catch (_0x35dc60) {}
    return null;
  }
  function _0x5ee6c9() {
    try {
      if (_0x5e9d8d()) {
        return false;
      }
      if (_0x42e1db()) {
        return false;
      }
      if (_0x225d53()) {
        return false;
      }
      const _0x178db5 = String(document.body?.innerText || "").slice(0, 12000);
      return /你要观看的视频不存在|作品不存在|视频不存在|内容不见了|已删除|分享的作品已失效|该内容无法展示|页面不存在|视频已失效|作品已失效|链接不正确|暂无法观看|内容已失效|找不到该作品|找不到该视频/.test(_0x178db5);
    } catch (_0xac31a1) {
      return false;
    }
  }
  function _0x5e9d8d() {
    try {
      const _0x31d095 = String(window.location.href || "");
      const _0x585ade = /\/video\/|\/note\//.test(_0x31d095);
      const _0x21b6a5 = _0x578585({
        includeFeed: _0x585ade
      });
      if (_0x21b6a5 && _0x199dc4(_0x21b6a5)) {
        const _0x1fd8cf = !!_0x21b6a5.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, canvas, img");
        if (_0x1fd8cf || _0x585ade) {
          return true;
        }
      }
      const _0x78a24a = Array.from(document.querySelectorAll("video, [data-e2e=\"video-player\"], .xgplayer, [data-e2e=\"video-player-container\"], [class*=\"video-player\"], [class*=\"VideoPlayer\"], [class*=\"xgplayer\"]")).filter(_0x199dc4);
      if (_0x78a24a.some(_0x287a68 => {
        const _0x579974 = _0x287a68.getBoundingClientRect();
        return _0x579974.width >= 120 && _0x579974.height >= 120;
      })) {
        return true;
      }
      if (_0x585ade) {
        const _0x2db3e9 = Array.from(document.querySelectorAll("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"user-info\"], [data-e2e=\"browse-user-avatar\"], [class*=\"video-info\"], [class*=\"VideoInfo\"], [class*=\"author\"]")).some(_0x2a3002 => {
          if (!_0x199dc4(_0x2a3002)) {
            return false;
          }
          const _0x31c3cc = _0x2a3002.getBoundingClientRect();
          return _0x31c3cc.width >= 40 && _0x31c3cc.height >= 20;
        });
        if (_0x2db3e9) {
          return true;
        }
      }
      if (_0x42e1db()) {
        return true;
      }
      if (_0x225d53()) {
        return true;
      }
      return false;
    } catch (_0xfb8bdc) {
      return false;
    }
  }
  function _0x20d917(_0x5c02df) {
    if (!_0x5c02df) {
      return {
        id: "",
        count: 0,
        probing: false,
        probed: false,
        openAttempt: 0,
        loadStartedAt: 0
      };
    }
    try {
      const _0x39024f = _0x4c0621.getItem(_0x5ae0ad);
      if (!_0x39024f) {
        return {
          id: _0x5c02df,
          count: 0,
          probing: false,
          probed: false,
          openAttempt: 0,
          loadStartedAt: 0
        };
      }
      const _0x422522 = JSON.parse(_0x39024f);
      if (_0x422522?.id === _0x5c02df) {
        return {
          id: _0x5c02df,
          count: Math.max(0, Number(_0x422522.count) || 0),
          probing: !!_0x422522.probing,
          probed: !!_0x422522.probed,
          openAttempt: Math.max(0, Number(_0x422522.openAttempt) || 0),
          loadStartedAt: Math.max(0, Number(_0x422522.loadStartedAt) || 0)
        };
      }
    } catch (_0x4da89d) {}
    return {
      id: _0x5c02df,
      count: 0,
      probing: false,
      probed: false,
      openAttempt: 0,
      loadStartedAt: 0
    };
  }
  function _0x51d819(_0x582453, _0xc98f1a = {}) {
    if (!_0x582453) {
      return;
    }
    try {
      const _0x137ce4 = _0x20d917(_0x582453);
      _0x4c0621.setItem(_0x5ae0ad, JSON.stringify({
        ..._0x137ce4,
        ..._0xc98f1a,
        id: _0x582453,
        at: Date.now()
      }));
    } catch (_0x1adc3e) {}
  }
  async function _0x171038(_0x2f8d63) {
    const _0x488b61 = Math.floor(_0x55caf8 / 1000);
    _0x55854b("已跳转指定视频，等待视频出现… (" + _0x488b61 + "s)");
    _0x58b17b("⏳ 跳转后等待视频出现 " + _0x488b61 + " 秒");
    console.log("[Built-in-Debug] [指定视频] 跳转后等待视频出现 " + _0x488b61 + "s");
    await _0x58b810(_0x55caf8, _0x55caf8, _0x2f8d63, "跳转后等待视频出现");
  }
  function _0x47c61f(_0x4b6124) {
    return _0x20d917(_0x4b6124);
  }
  function _0x3fe54b(_0x16997c) {
    return _0x20d917(_0x16997c).count;
  }
  function _0x5572b9(_0x45ea1c, _0x223f8e) {
    _0x51d819(_0x45ea1c, {
      count: Math.max(0, Number(_0x223f8e) || 0)
    });
  }
  function _0x266a6e() {
    try {
      _0x4c0621.removeItem(_0x5ae0ad);
    } catch (_0x588736) {}
  }
  function _0xca7f8e(_0x360c35) {
    const _0x3ba002 = _0x1f7513(_0x360c35) || String(_0x360c35 || "").trim();
    if (_0x3ba002) {
      return "https://www.douyin.com/jingxuan?modal_id=" + _0x3ba002;
    } else {
      return "";
    }
  }
  function _0x5e023e(_0xc9436f) {
    const _0x37b824 = _0x1f7513(_0xc9436f) || String(_0xc9436f || "").trim();
    if (_0x37b824) {
      return "https://www.douyin.com/video/" + _0x37b824;
    } else {
      return "";
    }
  }
  function _0x3149ed(_0x22f054) {
    const _0x38bb66 = String(_0x22f054 || "").trim();
    const _0x4f60da = _0x1f7513(_0x38bb66);
    if (!_0x4f60da) {
      return _0x38bb66;
    }
    if (/\/video\/|\/note\//.test(_0x38bb66)) {
      return _0x5e023e(_0x4f60da);
    }
    return _0xca7f8e(_0x4f60da);
  }
  function _0xfc1878() {
    try {
      return document.readyState === "loading";
    } catch (_0xbd8f8a) {
      return false;
    }
  }
  function _0x9dc849(_0x28894d = document, _0x3448aa = {}) {
    try {
      const _0xee8753 = _0x3448aa.allowBodyFallback !== false;
      const _0x3fc6bd = _0x3448aa.mainStageOnly === true;
      const _0x3a818a = Number(_0x3448aa.maxScan) > 0 ? Number(_0x3448aa.maxScan) : 900;
      const _0xc8b800 = _0x2d6a8f => String(_0x2d6a8f || "").replace(/\s+/g, " ").trim();
      const _0x3eecbf = _0x2c196b();
      const _0x10806b = _0x123db1 => typeof _0x3eecbf?.isDouyinLoadingLabelText === "function" ? _0x3eecbf.isDouyinLoadingLabelText(_0x123db1) : !!_0x123db1 && _0x123db1.length <= 24 && (_0x123db1 === "加载中" || /^加载中[.。…]+$/.test(_0x123db1) || _0x123db1 === "正在加载" || /^正在加载[.。…]+$/.test(_0x123db1));
      const _0x2b1ca4 = _0x1284a4 => typeof _0x3eecbf?.isElementVisuallyShown === "function" ? _0x3eecbf.isElementVisuallyShown(_0x1284a4) : _0x199dc4(_0x1284a4);
      const _0x426d43 = _0x13b7b8 => {
        if (!_0x3fc6bd) {
          return true;
        }
        if (typeof _0x3eecbf?.isLoadingPlaceholderInMainStage === "function") {
          return _0x3eecbf.isLoadingPlaceholderInMainStage(_0x13b7b8);
        }
        return true;
      };
      const _0x89d89c = _0x28894d && _0x28894d.querySelectorAll ? _0x28894d : document;
      const _0x42cc27 = Array.from(_0x89d89c.querySelectorAll("div, span, p, section, button")).slice(0, _0x3a818a);
      let _0x607a0f = null;
      let _0x4927c8 = Infinity;
      for (const _0x411e20 of _0x42cc27) {
        if (!_0x2b1ca4(_0x411e20)) {
          continue;
        }
        if (_0x411e20.children && _0x411e20.children.length > 6) {
          continue;
        }
        const _0x2e9a50 = _0xc8b800(_0x411e20.innerText || _0x411e20.textContent || "");
        if (!_0x10806b(_0x2e9a50)) {
          continue;
        }
        if (!_0x426d43(_0x411e20)) {
          continue;
        }
        const _0x5b8e0d = _0x411e20.getBoundingClientRect();
        if (_0x5b8e0d.width < 4 || _0x5b8e0d.height < 4) {
          continue;
        }
        if (_0x5b8e0d.width > 420 || _0x5b8e0d.height > 160) {
          continue;
        }
        const _0x307afe = _0x5b8e0d.width * _0x5b8e0d.height;
        if (_0x307afe < _0x4927c8) {
          _0x607a0f = _0x411e20;
          _0x4927c8 = _0x307afe;
        }
      }
      if (_0x607a0f) {
        return _0x607a0f;
      }
      const _0x3bce76 = Array.from(_0x89d89c.querySelectorAll("[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]")).find(_0x17165e => {
        if (!_0x2b1ca4(_0x17165e)) {
          return false;
        }
        if (!_0x426d43(_0x17165e)) {
          return false;
        }
        const _0x12526f = _0x17165e.getBoundingClientRect();
        return _0x12526f.width >= 8 && _0x12526f.height >= 8 && _0x12526f.width <= 160 && _0x12526f.height <= 160;
      });
      if (_0x3bce76) {
        return _0x3bce76;
      }
      if (_0xee8753 && !_0x3fc6bd) {
        const _0x2feb1e = _0x28894d === document || _0x28894d === document.documentElement ? document.body : _0x28894d;
        const _0x62a2c2 = _0xc8b800(_0x2feb1e?.innerText || _0x2feb1e?.textContent || "").slice(0, 600);
        if (_0x62a2c2.length > 0 && _0x62a2c2.length < 120 && /加载中|正在加载/.test(_0x62a2c2)) {
          return _0x2feb1e || document.body;
        }
      }
      return null;
    } catch (_0x530ef5) {
      return null;
    }
  }
  function _0x2a363d(_0x460714 = document, _0xf60d79 = {}) {
    return !!_0x9dc849(_0x460714, _0xf60d79);
  }
  async function _0x27d009(_0x4f1331, _0x12e59d = "") {
    if (!_0x4f1331 || typeof _0x4f1331.getBoundingClientRect !== "function") {
      return false;
    }
    let _0x2605bf = 0;
    let _0x1fe01b = 0;
    const _0x13ac81 = (_0x55b480, _0x37d85, _0x205010, _0x34efff = 1) => {
      _0x2605bf = _0x37d85;
      _0x1fe01b = _0x205010;
      try {
        _0x4f1331.dispatchEvent(new PointerEvent(_0x55b480, {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          clientX: _0x37d85,
          clientY: _0x205010,
          buttons: _0x34efff
        }));
      } catch (_0x4c8ddd) {}
      try {
        const _0x4085e9 = _0x55b480 === "pointerdown" ? "mousedown" : _0x55b480 === "pointerup" ? "mouseup" : _0x55b480 === "pointermove" ? "mousemove" : _0x55b480 === "pointercancel" ? "mouseup" : "mouseleave";
        _0x4f1331.dispatchEvent(new MouseEvent(_0x4085e9, {
          bubbles: true,
          cancelable: true,
          clientX: _0x37d85,
          clientY: _0x205010,
          buttons: _0x34efff
        }));
      } catch (_0x5a34ec) {}
    };
    try {
      const _0x29b906 = _0x4f1331.getBoundingClientRect();
      if (_0x29b906.width < 40 || _0x29b906.height < 80) {
        return false;
      }
      const _0x1197cd = Math.round(_0x29b906.left + _0x29b906.width / 2);
      const _0x1553c5 = Math.round(_0x29b906.top + Math.min(_0x29b906.height * 0.92, _0x29b906.height - 16));
      const _0x202735 = Math.round(_0x29b906.top + Math.min(_0x29b906.height * 0.78, _0x1553c5 - 56));
      if (_0x202735 >= _0x1553c5 - 24) {
        return false;
      }
      const _0x4e789a = 4;
      _0x13ac81("pointerdown", _0x1197cd, _0x1553c5, 1);
      for (let _0x5958f5 = 1; _0x5958f5 <= _0x4e789a; _0x5958f5++) {
        const _0x1839af = Math.round(_0x1553c5 + (_0x202735 - _0x1553c5) * (_0x5958f5 / _0x4e789a));
        _0x13ac81("pointermove", _0x1197cd, _0x1839af, 1);
        await _0x5a5981(24 + Math.floor(Math.random() * 16));
      }
      _0x13ac81("pointerup", _0x1197cd, _0x202735, 0);
      _0x12e59d;
      return true;
    } catch (_0x463d12) {
      try {
        _0x13ac81("pointercancel", _0x2605bf || 0, _0x1fe01b || 0, 0);
      } catch (_0x257aaf) {}
      return false;
    }
  }
  async function _0x2560a8(_0x1a01d6 = document, _0x6ad787 = "") {
    try {
      const _0x2dafd6 = _0x16b4aa(_0x1a01d6) || _0x1a01d6 || document;
      const _0x3eea1c = [_0x2dafd6];
      if (_0x1a01d6 && _0x1a01d6 !== _0x2dafd6) {
        _0x3eea1c.push(_0x1a01d6);
      }
      let _0x141eee = null;
      for (const _0x4d90ae of _0x3eea1c) {
        _0x141eee = _0x9dc849(_0x4d90ae, {
          allowBodyFallback: false,
          maxScan: 500
        });
        if (_0x141eee) {
          break;
        }
      }
      const _0xdceb11 = !!_0x141eee || !!_0x28b2cc(_0x2dafd6);
      if (!_0xdceb11) {
        return false;
      }
      const _0x57f122 = _0x5a2887(_0x2dafd6) || (_0x2dafd6 && _0x2dafd6.querySelector ? _0x2dafd6.querySelector("[class*=\"comment\"]") : null) || _0x2dafd6;
      try {
        _0x55854b("评论区「加载中」，上滑继续加载评论…");
      } catch (_0x10fafc) {}
      console.log("[Built-in-Debug] [评论加载] 「加载中」→ 上滑评论列表（点击仅辅助）");
      if (_0x57f122) {
        for (let _0x31c1e1 = 0; _0x31c1e1 < 3; _0x31c1e1++) {
          await _0x5367e2(_0x2dafd6, 380 + _0x31c1e1 * 90, _0x6ad787 || "COMMENT_LOADING_SWIPE", {
            containWheel: true,
            delayMin: 160,
            delayMax: 280
          });
        }
        await _0x27d009(_0x57f122, _0x6ad787 || "COMMENT_LOADING_SWIPE");
        await _0x5a5981(220);
      }
      if (_0x141eee) {
        try {
          if (typeof _0x1995d2 === "function") {
            await _0x1995d2(_0x141eee, _0x6ad787 || "COMMENT_LOADING_CLICK");
          } else if (typeof _0x141eee.click === "function") {
            _0x141eee.click();
          }
        } catch (_0x2c814f) {}
      }
      await _0x5a5981(480);
      return true;
    } catch (_0x17e742) {
      console.warn("[Built-in-Debug] [评论加载] 上滑/点击「加载中」失败:", _0x17e742?.message || _0x17e742);
      return false;
    }
  }
  function _0x120265() {
    try {
      if (_0x42e1db()) {
        return false;
      }
      if (_0x225d53()) {
        return false;
      }
      if (_0x5e9d8d()) {
        return false;
      }
      if (_0x2a363d(document, {
        allowBodyFallback: false,
        mainStageOnly: true,
        maxScan: 700
      })) {
        return true;
      }
      return false;
    } catch (_0x501b8b) {
      return false;
    }
  }
  function _0x11222b() {
    if (_0x5e9d8d() || _0x42e1db() || _0x225d53()) {
      return false;
    }
    if (_0xfc1878() && !_0x4050f4(_0x1f7513(window.location.href) || "")) {
      return true;
    }
    return _0x120265();
  }
  function _0x332372() {
    try {
      if (document.readyState === "loading") {
        return true;
      }
    } catch (_0x290301) {}
    return _0x2a363d(document, {
      allowBodyFallback: true
    });
  }
  function _0x5277fa(_0x25ee01, _0x4b8111 = window.location.href) {
    const _0x542e11 = _0x1f7513(_0x25ee01);
    if (!_0x542e11) {
      return false;
    }
    const _0x52ad4b = _0x1f7513(_0x4b8111);
    return !!_0x52ad4b && _0x52ad4b === _0x542e11;
  }
  function _0x2d5c14() {
    try {
      const _0xd70a79 = ["[data-e2e=\"notification-entry\"]", "[data-e2e=\"im-entry\"]", "[data-e2e=\"something-button\"]"];
      for (const _0x304d55 of _0xd70a79) {
        const _0x2761bb = document.querySelector(_0x304d55);
        if (!_0x2761bb || !_0x199dc4(_0x2761bb)) {
          continue;
        }
        const _0x217ecc = _0x2761bb.getBoundingClientRect();
        if (_0x217ecc.top < 130 && _0x217ecc.width >= 8 && _0x217ecc.height >= 8) {
          return true;
        }
      }
      const _0x268589 = Array.from(document.querySelectorAll("button, a, span, div"));
      for (const _0x21bdf3 of _0x268589) {
        if (!_0x199dc4(_0x21bdf3)) {
          continue;
        }
        const _0x55ef40 = String(_0x21bdf3.innerText || _0x21bdf3.textContent || "").replace(/\s+/g, " ").trim();
        if (!/^(通知|投稿|发布)$/.test(_0x55ef40)) {
          continue;
        }
        const _0x14561b = _0x21bdf3.getBoundingClientRect();
        if (_0x14561b.top < 140 && _0x14561b.left < (window.innerWidth || 1280) * 0.6 && _0x14561b.width > 0 && _0x14561b.width < 220 && _0x14561b.height > 0 && _0x14561b.height < 72) {
          return true;
        }
      }
      return false;
    } catch (_0x5eb769) {
      return false;
    }
  }
  function _0x37be14() {
    return _0x578585({
      includeFeed: false
    });
  }
  function _0x225d53() {
    try {
      const _0x19fd74 = _0x4b41c5 => String(_0x4b41c5 || "").replace(/\s+/g, " ").trim();
      const _0x3d0687 = _0x5ac483 => /^(评论|评论\s*[\d.万w+()（）]*)$/i.test(_0x5ac483) || /^评论[\d.万w+()（）\s]{0,12}$/.test(_0x5ac483);
      const _0x31a7b6 = /^(详情|TA的作品|AI抖音|相关推荐)$/;
      const _0x1a538e = Array.from(document.querySelectorAll("div, span, button, a, li"));
      const _0x2b5755 = [];
      for (const _0x37c9ed of _0x1a538e) {
        if (!_0x199dc4(_0x37c9ed)) {
          continue;
        }
        if (_0x37c9ed.children && _0x37c9ed.children.length > 3) {
          continue;
        }
        const _0x19fdf0 = _0x19fd74(_0x37c9ed.innerText || _0x37c9ed.textContent || "");
        if (!_0x19fdf0 || _0x19fdf0.length > 18) {
          continue;
        }
        if (!_0x3d0687(_0x19fdf0)) {
          continue;
        }
        const _0x188e65 = _0x37c9ed.getBoundingClientRect();
        if (_0x188e65.width < 20 || _0x188e65.height < 12 || _0x188e65.width > 220 || _0x188e65.height > 64) {
          continue;
        }
        if (_0x188e65.left < (window.innerWidth || 1280) * 0.28) {
          continue;
        }
        if (_0x188e65.top < 40 || _0x188e65.top > (window.innerHeight || 800) * 0.55) {
          continue;
        }
        _0x2b5755.push({
          el: _0x37c9ed,
          r: _0x188e65
        });
      }
      for (const {
        el: _0x296f4b,
        r: _0x3a4b7f
      } of _0x2b5755) {
        let _0x4e14a3 = 0;
        for (const _0xe38a4e of _0x1a538e) {
          if (_0xe38a4e === _0x296f4b || !_0x199dc4(_0xe38a4e)) {
            continue;
          }
          if (_0xe38a4e.children && _0xe38a4e.children.length > 3) {
            continue;
          }
          const _0x4d4bf1 = _0x19fd74(_0xe38a4e.innerText || _0xe38a4e.textContent || "");
          if (!_0x31a7b6.test(_0x4d4bf1)) {
            continue;
          }
          const _0x478499 = _0xe38a4e.getBoundingClientRect();
          if (_0x478499.width < 20 || _0x478499.height < 12 || _0x478499.width > 220 || _0x478499.height > 64) {
            continue;
          }
          if (Math.abs(_0x478499.top - _0x3a4b7f.top) > 28) {
            continue;
          }
          if (Math.abs(_0x478499.left - _0x3a4b7f.left) > 520) {
            continue;
          }
          _0x4e14a3 += 1;
          if (_0x4e14a3 >= 1) {
            return true;
          }
        }
      }
      return false;
    } catch (_0x5b43b6) {
      return false;
    }
  }
  function _0x42e1db() {
    try {
      const _0x5baf89 = _0x308599 => String(_0x308599 || "").replace(/\s+/g, " ").trim();
      const _0x3d6368 = _0x5780d7 => {
        const _0x3c91cb = _0x5baf89(_0x5780d7);
        if (!_0x3c91cb || _0x3c91cb.length > 16) {
          return false;
        }
        if (/^(赞|点赞)$/.test(_0x3c91cb)) {
          return true;
        }
        if (/^[\d.]+[万wW千kK+]?$/.test(_0x3c91cb)) {
          return true;
        }
        if (/^\d{1,12}$/.test(_0x3c91cb)) {
          return true;
        }
        return false;
      };
      const _0x4d4d7b = getVideoEngageSelector({
        getVideoEngagePack: _0x2c0fcb
      }, "likeSelectors");
      if (!_0x4d4d7b) {
        return false;
      }
      const _0x184028 = [];
      const _0x19831f = _0x37be14();
      if (_0x19831f && _0x199dc4(_0x19831f)) {
        _0x184028.push(_0x19831f);
      }
      _0x184028.push(document);
      const _0x83d7be = new Set();
      for (const _0x58dbcc of _0x184028) {
        let _0x693326 = [];
        try {
          _0x693326 = Array.from(_0x58dbcc.querySelectorAll(_0x4d4d7b));
        } catch (_0x122dad) {
          _0x693326 = [];
        }
        for (const _0xe286b of _0x693326) {
          if (!_0xe286b || _0x83d7be.has(_0xe286b) || !_0x199dc4(_0xe286b)) {
            continue;
          }
          _0x83d7be.add(_0xe286b);
          const _0x4a0606 = _0xe286b.getBoundingClientRect();
          if (_0x4a0606.width < 10 || _0x4a0606.height < 10) {
            continue;
          }
          if (_0x4a0606.left < (window.innerWidth || 1280) * 0.35) {
            continue;
          }
          if (_0x4a0606.top < 60 || _0x4a0606.top > (window.innerHeight || 800) * 0.92) {
            continue;
          }
          const _0x1dae56 = _0x5baf89(_0xe286b.getAttribute("aria-label") || _0xe286b.getAttribute("title") || "");
          if (/赞|点赞|like|digg/i.test(_0x1dae56)) {
            return true;
          }
          const _0x343fc3 = _0xe286b.closest("button, [role=\"button\"], [class*=\"digg\"], [class*=\"like\"], [class*=\"Like\"]") || _0xe286b.parentElement;
          const _0x1b6068 = _0x5baf89(_0x343fc3?.innerText || _0x343fc3?.textContent || "");
          if (_0x3d6368(_0x1b6068) || /赞|点赞/.test(_0x1b6068)) {
            return true;
          }
          const _0xf58683 = _0x343fc3 || _0xe286b.parentElement;
          if (_0xf58683) {
            for (const _0x434ded of _0xf58683.querySelectorAll("span, div, p")) {
              if (_0x434ded === _0xe286b || !_0x199dc4(_0x434ded)) {
                continue;
              }
              if (_0x3d6368(_0x434ded.innerText || _0x434ded.textContent)) {
                return true;
              }
            }
          }
          if (_0x4a0606.width >= 16 && _0x4a0606.height >= 16) {
            return true;
          }
        }
      }
      return false;
    } catch (_0x15aa7e) {
      return false;
    }
  }
  function _0x5daf36(_0x15863c) {
    const _0x5a582d = String(window.location.href || "");
    if (/\/video\/|\/note\//.test(_0x5a582d)) {
      if (!_0x5277fa(_0x15863c, _0x5a582d)) {
        return false;
      }
      return _0x5e9d8d() || _0x42e1db() || _0x225d53();
    }
    if (!/\/jingxuan/.test(_0x5a582d)) {
      return false;
    }
    if (!_0x5277fa(_0x15863c, _0x5a582d)) {
      return false;
    }
    const _0x4a7c9c = _0x37be14();
    if (_0x4a7c9c && _0x199dc4(_0x4a7c9c)) {
      return true;
    }
    if (_0x42e1db()) {
      return true;
    }
    return _0x225d53();
  }
  function _0xe7cbe4(_0xede46a) {
    try {
      const _0x61b5d5 = String(window.location.href || "");
      if (/\/video\/|\/note\//.test(_0x61b5d5)) {
        return false;
      }
      if (!/\/jingxuan/.test(_0x61b5d5)) {
        return false;
      }
      if (_0x11222b()) {
        return false;
      }
      if (_0x5daf36(_0xede46a)) {
        return false;
      }
      const _0x4865b1 = _0x37be14();
      if (_0x4865b1 && _0x199dc4(_0x4865b1)) {
        return false;
      }
      if (_0x42e1db()) {
        return false;
      }
      if (_0x225d53()) {
        return false;
      }
      return _0x2d5c14();
    } catch (_0x869fac) {
      return false;
    }
  }
  function _0xa7a5fe(_0x246354) {
    try {
      _0x14b27d();
    } catch (_0x5a6f9e) {}
    const _0x3298bd = String(window.location.href || "");
    if (_0x5daf36(_0x246354)) {
      return "ready";
    }
    const _0x164e84 = _0x4050f4(_0x246354);
    if (_0x164e84?.status === "unavailable") {
      if (_0x5277fa(_0x246354, _0x3298bd) || /\/jingxuan|\/video\/|\/note\//.test(_0x3298bd)) {
        return "unavailable";
      }
    }
    if (_0x164e84?.status === "ready" && _0x5277fa(_0x246354, _0x3298bd)) {
      return "waiting";
    }
    if (_0x11222b()) {
      return "loading";
    }
    if (_0x5277fa(_0x246354, _0x3298bd) || /\/jingxuan/.test(_0x3298bd)) {
      if (_0x5ee6c9() && !_0x5daf36(_0x246354)) {
        return "unavailable";
      }
      if (_0xe7cbe4(_0x246354)) {
        return "bare_jingxuan";
      }
      return "waiting";
    }
    if (_0xe7cbe4(_0x246354)) {
      return "bare_jingxuan";
    }
    return "waiting";
  }
  async function _0x1be4a3(_0x4281ba, _0x372c34, _0x478222 = _0x403bd6) {
    const _0x364b26 = Date.now();
    let _0x4da942 = 0;
    let _0x18b48c = 0;
    let _0x5892ff = -1;
    while (!_0x519967(_0x4281ba) && Date.now() - _0x364b26 < _0x478222) {
      const _0xf97d1b = _0xa7a5fe(_0x372c34);
      if (_0xf97d1b === "ready") {
        return "ready";
      }
      if (_0xf97d1b === "unavailable") {
        _0x4da942 += 1;
        if (_0x4da942 >= 3) {
          return "unavailable";
        }
      } else {
        _0x4da942 = 0;
      }
      if (_0xf97d1b === "loading") {
        _0x18b48c = 0;
        const _0x1289bc = Math.floor((Date.now() - _0x364b26) / 1000);
        if (_0x1289bc !== _0x5892ff && (_0x1289bc === 0 || _0x1289bc % 5 === 0)) {
          _0x5892ff = _0x1289bc;
          _0x55854b("检测到「加载中」，等待页面加载完成… (" + _0x1289bc + "s/" + Math.floor(_0x478222 / 1000) + "s)");
        }
        await _0x58b810(500, 800, _0x4281ba, "指定视频加载中等待");
        continue;
      }
      if (_0xf97d1b === "bare_jingxuan") {
        _0x18b48c += 1;
        if (_0x18b48c >= 3 && Date.now() - _0x364b26 >= _0x58067e) {
          console.warn("[Built-in-Debug] [指定视频] 精选壳可见且无详情弹窗，判定链接失效");
          return "bare_jingxuan";
        }
      } else {
        _0x18b48c = 0;
      }
      const _0x2c4e1e = Math.floor((Date.now() - _0x364b26) / 1000);
      if (_0x2c4e1e > 0 && _0x2c4e1e % 8 === 0) {
        _0x55854b("指定视频打开中，耐心等待… (" + _0x2c4e1e + "s/" + Math.floor(_0x478222 / 1000) + "s)");
      }
      await _0x58b810(400, 650, _0x4281ba, "指定视频打开探测");
    }
    if (_0x519967(_0x4281ba)) {
      return "aborted";
    }
    const _0x2e8641 = _0xa7a5fe(_0x372c34);
    if (_0x2e8641 === "ready") {
      return "ready";
    }
    if (_0x2e8641 === "unavailable") {
      return "unavailable";
    }
    if (_0x2e8641 === "bare_jingxuan") {
      return "bare_jingxuan";
    }
    if (_0x2e8641 === "loading") {
      _0x55854b("页面仍显示「加载中」，准备重试打开…");
      console.warn("[Built-in-Debug] [指定视频] 等待超时仍显示加载中");
    }
    return "settled";
  }
  async function _0x5ef4ec(_0x3936df, _0x67ab40) {
    try {
      _0x14b27d();
    } catch (_0x5016be) {}
    const _0x5178e5 = _0x1f7513(_0x67ab40);
    const _0x277db8 = _0x3149ed(_0x67ab40);
    let _0x34e3e3 = _0x20d917(_0x5178e5);
    let _0x4e8cdc = Math.max(0, Number(_0x34e3e3.openAttempt) || 0);
    while (_0x4e8cdc < _0x11ddaf) {
      if (_0x519967(_0x3936df)) {
        return "aborted";
      }
      _0x4e8cdc += 1;
      _0x51d819(_0x5178e5, {
        openAttempt: _0x4e8cdc,
        loadStartedAt: Date.now(),
        count: 0,
        probing: false,
        probed: false
      });
      _0x55854b("正在打开指定视频 (" + _0x4e8cdc + "/" + _0x11ddaf + ")，最长等待约 " + Math.floor(_0x403bd6 / 1000) + " 秒…");
      _0x58b17b("👆 指定视频打开第 " + _0x4e8cdc + "/" + _0x11ddaf + " 次：" + _0x2afb5a(_0x277db8, 80));
      console.log("[Built-in-Debug] [指定视频] 打开尝试 " + _0x4e8cdc + "/" + _0x11ddaf + ": " + _0x277db8);
      const _0x39b335 = _0x5277fa(_0x67ab40);
      if (_0x5daf36(_0x67ab40)) {
        _0x51d819(_0x5178e5, {
          openAttempt: _0x4e8cdc,
          loadStartedAt: 0,
          count: 0,
          probed: true
        });
        _0x55854b("指定视频已打开，准备进入处理...");
        return "ready";
      }
      if (!_0x39b335) {
        window.location.href = _0x277db8;
        await _0x171038(_0x3936df);
      }
      const _0x1a7daa = await _0x1be4a3(_0x3936df, _0x67ab40, _0x403bd6);
      if (_0x1a7daa === "aborted") {
        return "aborted";
      }
      if (_0x1a7daa === "ready") {
        _0x51d819(_0x5178e5, {
          openAttempt: _0x4e8cdc,
          loadStartedAt: 0,
          count: 0,
          probed: true
        });
        _0x55854b("指定视频已打开，准备进入处理...");
        return "ready";
      }
      if (_0x1a7daa === "unavailable" || _0x1a7daa === "bare_jingxuan") {
        _0x51d819(_0x5178e5, {
          openAttempt: _0x4e8cdc,
          probed: true,
          loadStartedAt: 0
        });
        return "unavailable";
      }
      const _0x522032 = _0x120265();
      _0x58b17b("⚠️ 指定视频第 " + _0x4e8cdc + " 次打开超时" + (_0x522032 ? "（仍显示加载中）" : "未就绪") + "，" + ("" + (_0x4e8cdc < _0x11ddaf ? "准备重新进入" : "已达最大次数")), null, "warning");
      if (_0x4e8cdc >= _0x11ddaf) {
        break;
      }
      _0x55854b(_0x522032 ? "「加载中」超过 1 分钟，重新进入指定视频 (" + (_0x4e8cdc + 1) + "/" + _0x11ddaf + ")…" : "加载过慢，重新进入指定视频 (" + (_0x4e8cdc + 1) + "/" + _0x11ddaf + ")…");
      window.location.href = _0x277db8;
      await _0x171038(_0x3936df);
    }
    return "timeout";
  }
  async function _0x3d013f(_0x2e0543, _0x9a6944) {
    const _0x19e52c = _0x1f7513(_0x9a6944);
    if (!_0x19e52c) {
      return "settled";
    }
    const _0x488cc0 = _0x5e023e(_0x19e52c);
    _0x51d819(_0x19e52c, {
      probing: true,
      probed: false,
      count: 0,
      loadStartedAt: Date.now()
    });
    console.warn("[Built-in-Debug] [指定视频] 改开 /video/ 验证: " + _0x488cc0);
    _0x55854b("正在用播放页打开指定视频…");
    _0x58b17b("⚠️ 指定视频改开 /video/：" + _0x19e52c, null, "warning");
    window.location.href = _0x488cc0;
    await _0x171038(_0x2e0543);
    const _0x594616 = await _0x1be4a3(_0x2e0543, _0x9a6944, _0x403bd6);
    if (_0x594616 === "aborted") {
      return "aborted";
    }
    if (_0x594616 === "unavailable" || _0x594616 === "bare_jingxuan") {
      _0x51d819(_0x19e52c, {
        probing: false,
        probed: true,
        count: 0
      });
      return "unavailable";
    }
    if (_0x594616 === "ready" || _0x5e9d8d()) {
      _0x51d819(_0x19e52c, {
        probing: false,
        probed: true,
        count: 0
      });
      _0x55854b("播放页打开成功，继续处理...");
      _0x58b17b("✅ 指定视频 /video/ 打开成功：" + _0x19e52c);
      return "ready";
    }
    return "settled";
  }
  function _0x70da9c(_0x54b2c5 = "") {
    const _0x7c1e7d = String(_0x54b2c5 || "");
    if (/bare_jingxuan/.test(_0x7c1e7d)) {
      return {
        title: "指定视频链接无效",
        detail: "地址栏虽可能仍有 modal_id，但页面是精选壳（可见通知/投稿）且无详情弹窗",
        action: "链接无效，跳过并打开下一个..."
      };
    }
    if (/load_timeout|probe_timeout|timeout/.test(_0x7c1e7d)) {
      return {
        title: "指定视频加载超时",
        detail: "多次等待「加载中」仍未完成（单次最长约 1 分钟，共 3 次），已跳过",
        action: "加载超时，跳过并打开下一个..."
      };
    }
    if (/unavailable/.test(_0x7c1e7d)) {
      return {
        title: "指定视频链接无效",
        detail: "视频不存在或无法观看，已跳过",
        action: "链接无效，跳过并打开下一个..."
      };
    }
    if (/^nav_miss/.test(_0x7c1e7d)) {
      return {
        title: "指定视频无法打开",
        detail: "多次未能进入目标视频页，已跳过",
        action: "无法打开目标视频，跳过并打开下一个..."
      };
    }
    if (/^modal_timeout/.test(_0x7c1e7d)) {
      return {
        title: "指定视频加载失败",
        detail: "精选页长时间未出现详情，已跳过",
        action: "视频加载超时，跳过并打开下一个..."
      };
    }
    return {
      title: "指定视频加载失败",
      detail: "已跳过",
      action: "视频加载失败，跳过并打开下一个..."
    };
  }
  async function _0x319d4b(_0x5c1f3f, _0x5a5e23, _0x77c204, _0x13a867, _0x562103 = "modal_timeout") {
    const _0x3ce99e = _0x1f7513(_0x77c204) || _0x77c204;
    const _0x1faa8f = _0x70da9c(_0x562103);
    console.warn("[Built-in-Debug] [指定视频] " + _0x1faa8f.title + " (" + _0x562103 + "): " + _0x77c204);
    _0x58b17b("⚠️ " + _0x1faa8f.title + "：" + _0x2afb5a(String(_0x3ce99e), 40) + " — " + _0x1faa8f.detail, null, "warning");
    _0x55854b(_0x1faa8f.action);
    _0x266a6e();
    _0x1178de(_0x77c204);
    _0x305050(_0x5e1b8b.processedVideos, _0x77c204, _0x13a867, {
      persistGlobal: false
    });
    _0x305050(_0x5e1b8b.processedVideos, _0x31be50(window.location.href), _0x13a867, {
      persistGlobal: false
    });
    _0x45ff39();
    _0x5e1b8b.sessionProcessedCount += 1;
    const _0x109277 = await _0x471cfe({
      reuseActive: false,
      advance: true
    });
    if (!_0x109277) {
      console.log("[Built-in-Debug] [指定视频] 跳过后无剩余视频，任务结束");
      _0x55854b("指定视频列表已全部处理，任务结束");
      await _0x547d56(_0x5c1f3f, _0x5a5e23, "specific_completed", {
        configuredCount: (window._specificVideoUrls || _0x13a867 || []).length
      });
      return "done";
    }
    _0x5e1b8b.lastClickedId = _0x31be50(_0x109277);
    _0x100ac3(_0x5e1b8b.lastClickedId);
    console.log("[Built-in-Debug] [指定视频] 失败后改开下一条: " + _0x109277);
    const _0x1e048c = await _0x5ef4ec(_0x5c1f3f, _0x109277);
    if (_0x1e048c === "aborted") {
      return "done";
    }
    if (_0x1e048c === "ready") {
      return "advanced";
    }
    _0x55854b("精选打开未就绪，改用播放页再试一次…");
    const _0x52018b = await _0x3d013f(_0x5c1f3f, _0x109277);
    if (_0x52018b === "aborted") {
      return "done";
    }
    if (_0x52018b === "ready") {
      return "advanced";
    }
    return _0x319d4b(_0x5c1f3f, _0x5a5e23, _0x109277, _0x13a867, _0x1e048c === "timeout" || _0x52018b === "settled" ? "load_timeout_on_advance" : "unavailable_on_advance");
  }
  function _0x564d29(_0x925c47, _0x3b4965 = window._specificVideoUrls) {
    const _0x4e5713 = Array.isArray(_0x3b4965) ? _0x3b4965 : [];
    const _0x251b0e = _0x5e1b8b.currentRunningSource === "specific";
    return _0x4e5713.find(_0x51af09 => {
      if (_0x251b0e) {
        return !_0x41ee72(_0x51af09);
      }
      return !_0x251164(_0x925c47, _0x51af09);
    }) || null;
  }
  function _0x4fa71d() {
    return !!_0x5e1b8b.currentTask?.useGlobalSpecificVideoPool && !!_0x5e1b8b.currentTask?.leadgenTaskId;
  }
  function _0x45ff39() {
    window._specificClaimedUrl = null;
  }
  async function _0x471cfe(_0x4b46af = {}) {
    const _0x157148 = _0x4b46af.reuseActive !== false;
    const _0x1f4bba = !!_0x4b46af.advance;
    if (!_0x4fa71d()) {
      return _0x564d29(_0x5e1b8b.processedVideos, window._specificVideoUrls);
    }
    if (!_0x1f4bba && window._specificClaimedUrl && !_0x41ee72(window._specificClaimedUrl)) {
      return window._specificClaimedUrl;
    }
    try {
      const _0x426fee = await _0x188b2a.invoke("claim-leadgen-specific-video", {
        leadgenTaskId: _0x5e1b8b.currentTask.leadgenTaskId,
        accountId: _0x5e1b8b.currentTask.accountId,
        reuseActive: _0x1f4bba ? false : _0x157148,
        preferredUrl: !_0x1f4bba && _0x157148 ? window._specificClaimedUrl || "" : ""
      });
      if (_0x426fee?.error) {
        _0x58b17b("⚠️ 领取指定视频失败：" + _0x426fee.error);
      }
      window._specificClaimedUrl = _0x426fee?.url || null;
      if (_0x426fee?.url && !_0x426fee.resumed) {
        const _0x4f671f = _0x426fee.claimed || 0;
        const _0x4ffda4 = _0x426fee.total || 0;
        _0x58b17b("📋 领取指定视频 " + _0x4f671f + "/" + _0x4ffda4 + "（剩余 " + (_0x426fee.remaining || 0) + "）");
        _0x55854b("领取指定视频 (" + _0x4f671f + "/" + _0x4ffda4 + ")...");
      }
      return window._specificClaimedUrl;
    } catch (_0x5e416e) {
      _0x58b17b("⚠️ 领取指定视频异常：" + (_0x5e416e?.message || _0x5e416e));
      window._specificClaimedUrl = null;
      return null;
    }
  }
  function _0x305050(_0x46c840, _0x28f70d, _0x26574b = window._specificVideoUrls, {
    persistGlobal = true
  } = {}) {
    if (!_0x46c840 || !_0x28f70d) {
      return;
    }
    const _0x3bb21d = _0xc242da();
    _0x3bb21d.rememberProcessedVideoKey(_0x46c840, _0x28f70d);
    const _0x50c94c = _0x1f7513(_0x28f70d);
    if (_0x50c94c && Array.isArray(_0x26574b)) {
      for (const _0x3dc0a5 of _0x26574b) {
        if (_0x1f7513(_0x3dc0a5) === _0x50c94c) {
          _0x3bb21d.rememberProcessedVideoKey(_0x46c840, _0x3dc0a5);
        }
      }
    }
    _0x1178de(_0x28f70d);
    if (!persistGlobal) {
      return;
    }
    const _0x5c90b8 = _0x3bb21d.normalizeProcessedVideoKey(_0x28f70d) || _0x28f70d;
    if (_0x5c90b8) {
      _0x188b2a.send("update-processed-videos", {
        url: _0x5c90b8,
        title: "指定视频已处理",
        platform: "douyin",
        timestamp: Date.now()
      });
    }
  }
  function _0x2eed07(_0x27c7dc, _0x3277cc = window._specificVideoUrls) {
    const _0x157a8d = Array.isArray(_0x3277cc) && _0x3277cc.length ? _0x3277cc : _0x395e22(_0x27c7dc);
    return _0x157a8d.length || 1;
  }
  function _0x2abc41(_0x619e5c = _0x5e1b8b.currentRunningSource, _0x3b6cd2 = _0x5e1b8b.currentTask) {
    if (_0x619e5c === "specific") {
      return _0x2eed07(_0x3b6cd2);
    }
    return _0x5e1b8b.targetVideoCount;
  }
  function _0x251164(_0x2667c4, _0x532f89) {
    if (!_0x2667c4 || !_0x532f89) {
      return false;
    }
    const _0x46ad47 = _0xc242da();
    if (_0x46ad47.hasProcessedVideoKey(_0x2667c4, _0x532f89)) {
      return true;
    }
    const _0x1e4030 = _0x1f7513(_0x532f89);
    if (!_0x1e4030) {
      return false;
    }
    for (const _0x8e73f9 of _0x2667c4) {
      if (_0x1f7513(_0x8e73f9) === _0x1e4030) {
        return true;
      }
    }
    return false;
  }
  function _0x3bf1e7(_0x408bd7, _0x345d05) {
    if (!_0x408bd7 || !_0x345d05) {
      return 0;
    }
    const _0x2054ba = _0x1f7513(_0x345d05);
    const _0x2e3a5d = _0x31be50(_0x345d05);
    let _0x5844b9 = 0;
    for (const _0xbbc750 of [..._0x408bd7]) {
      const _0x1303c4 = _0xbbc750 === _0x345d05 || _0x2e3a5d && _0x31be50(_0xbbc750) === _0x2e3a5d || _0x2054ba && _0x1f7513(_0xbbc750) === _0x2054ba;
      if (_0x1303c4) {
        _0x408bd7.delete(_0xbbc750);
        _0x5844b9 += 1;
      }
    }
    return _0x5844b9;
  }
  function _0x38b41(_0x315c9f, _0x1b4364) {
    const _0x3f0361 = _0x395e22(_0x1b4364);
    if (!_0x3f0361.length) {
      return 0;
    }
    let _0x367cf5 = 0;
    for (const _0x2f83bb of _0x3f0361) {
      _0x367cf5 += _0x3bf1e7(_0x315c9f, _0x2f83bb);
    }
    return _0x367cf5;
  }
  function _0xa02977(_0x1dbc8b, {
    restart = false,
    resumeSpecific = false
  } = {}) {
    const _0x255e03 = _0xc242da();
    const _0x37d0c2 = _0x255e03.initProcessedVideoSet(_0x1dbc8b?.processedVideos || []);
    let _0xc34a9b = 0;
    const _0x4a1c11 = Array.isArray(_0x1dbc8b?.videoSources) && _0x1dbc8b.videoSources.includes("specific");
    if ((restart || resumeSpecific) && _0x4a1c11) {
      _0xc34a9b = _0x38b41(_0x37d0c2, _0x1dbc8b);
    }
    _0x3092cf("浏览库", "载入 " + _0x37d0c2.size + " 条避重记录", {
      restart: restart,
      resumeSpecific: resumeSpecific,
      specific: _0x4a1c11,
      unblockedKeys: _0xc34a9b,
      configuredUrls: _0x4a1c11 ? _0x395e22(_0x1dbc8b).length : 0
    });
    return _0x37d0c2;
  }
  function _0x3feb9b(_0x387f29) {
    if (!_0x387f29) {
      return false;
    }
    if (_0x387f29.isResume) {
      _0x5e1b8b.pendingTaskRestart = false;
      delete _0x387f29.isRestart;
      delete _0x387f29.isResume;
      _0x3092cf("继续", "保留会话断点，沿用视频、互动与关键词进度");
      return false;
    }
    if (!_0x387f29.isRestart) {
      delete _0x387f29.isResume;
      return false;
    }
    _0x5e1b8b.pendingTaskRestart = true;
    try {
      const _0x44f442 = [_0x533e40(_0x387f29.accountId, _0x387f29.taskId)];
      for (let _0x1b1ea9 = 0; _0x1b1ea9 < _0x3fd277.length; _0x1b1ea9++) {
        const _0x365f97 = _0x3fd277.key(_0x1b1ea9);
        if (!_0x365f97 || !_0x365f97.startsWith("radar_state_" + (_0x387f29.accountId || "default") + "_")) {
          continue;
        }
        const _0x568e54 = JSON.parse(_0x3fd277.getItem(_0x365f97) || "{}");
        if (_0x568e54.leadgenTaskId && _0x568e54.leadgenTaskId === _0x387f29.leadgenTaskId) {
          _0x44f442.push(_0x365f97);
        }
      }
      [...new Set(_0x44f442)].forEach(_0x3bbc0e => _0x3fd277.removeItem(_0x3bbc0e));
      const _0x55358d = _0x31195b(_0x387f29.accountId);
      const _0x1fb429 = JSON.parse(_0x3fd277.getItem(_0x55358d) || "{}");
      if (_0x1fb429.loopId === _0x387f29.taskId) {
        _0x3fd277.removeItem(_0x55358d);
      }
    } catch (_0x5a883c) {}
    delete _0x387f29.isRestart;
    delete _0x387f29.isResume;
    _0x3092cf("重启", "已清除会话断点，将从头运行");
    return true;
  }
  function _0x4efa97() {
    if (!_0x5e1b8b.pendingTaskRestart) {
      return false;
    }
    _0x5e1b8b.pendingTaskRestart = false;
    return true;
  }
  function _0x5973b4(_0x489be2, _0x2d717d = window._specificVideoUrls) {
    if (!_0x489be2 || !Array.isArray(_0x2d717d) || _0x2d717d.length === 0) {
      return false;
    }
    const _0x59850c = _0x31be50(_0x489be2);
    return _0x2d717d.some(_0xecf341 => _0x31be50(_0xecf341) === _0x59850c);
  }
  async function _0x547d56(_0x3aa91a, _0x54d841, _0x1821e4 = "specific_completed", _0x3c3b30 = {}) {
    await _0xeda8c3(_0x3aa91a, _0x1821e4, _0x3c3b30, {
      storageKey: _0x54d841,
      drainAiQueue: true
    });
  }
  return {
    awaitSpecificVideoOpenSettle: _0x1be4a3,
    clearClaimedSpecificVideoUrl: _0x45ff39,
    clickCommentPanelLoadingPlaceholder: _0x2560a8,
    consumeTaskRestartFlag: _0x4efa97,
    convertToDouyinModalUrl: _0x540c23,
    describeSpecificVideoSkipReason: _0x70da9c,
    ensureClaimedSpecificVideoUrl: _0x471cfe,
    evaluateSpecificVideoOpenProgress: _0xa7a5fe,
    extractSpecificVideoId: _0x1f7513,
    finishSpecificSourceTask: _0x547d56,
    getPlannedVideoCountForDisplay: _0x2abc41,
    getSpecificPlannedVideoCount: _0x2eed07,
    getSpecificVideoProbeState: _0x47c61f,
    getSpecificVideoUrlList: _0x395e22,
    hasSpecificVideoTargetInUrl: _0x5277fa,
    hasVideoMainCommented: _0x55bb5d,
    initProcessedVideosFromTask: _0xa02977,
    initVideoMainCommentMemoryFromTask: _0x366568,
    isDouyinJingxuanContentLoading: _0x120265,
    isDouyinSearchPageContentLoading: _0x332372,
    isDouyinSpecificVideoUnavailable: _0x5ee6c9,
    isDouyinVisibleLoadingPlaceholder: _0x2a363d,
    isOnSpecificTargetVideo: _0x44453d,
    isSpecificVideoCompletedThisSession: _0x41ee72,
    isSpecificVideoDetailReady: _0x5daf36,
    isVideoInSpecificList: _0x5973b4,
    loadSpecificVideoState: _0x20d917,
    markSpecificVideoCompletedThisSession: _0x1178de,
    markSpecificVideoHandled: _0x305050,
    markTaskRestartFromPayload: _0x3feb9b,
    normalizeSpecificVideoKey: _0x31be50,
    openSpecificVideoWithRetries: _0x5ef4ec,
    probeSpecificVideoOnDirectPage: _0x3d013f,
    rememberVideoMainComment: _0x52bac5,
    resolveDouyinVideoDetailModal: _0x578585,
    saveSpecificVideoState: _0x51d819,
    shouldBypassSpecificBrowseDedup: _0x571927,
    shouldReprocessConfiguredSpecific: _0xda846a,
    skipFailedSpecificVideoAndOpenNext: _0x319d4b,
    toSpecificVideoDirectUrl: _0x5e023e,
    toSpecificVideoJingxuanUrl: _0xca7f8e,
    usesSpecificVideoPool: _0x4fa71d,
    waitSpecificVideoNavAppear: _0x171038
  };
}
module.exports = {
  createSpecificVideoNavigationController: createSpecificVideoNavigationController
};
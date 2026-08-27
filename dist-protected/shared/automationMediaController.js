'use strict';

function createAutomationMediaController(_0x3741c0 = {}) {
  const {
    PLATFORM_SELECTORS: _0x23063a,
    awaitSecurityChallengeIfPresent: _0x14a583,
    extractSpecificVideoId: _0x322067,
    extractVideoIdFromHref: _0x80c4dd,
    formatScrapeGuardWaitLabel: _0x2c2270,
    getBoundSubviewInteractionId: _0x25c7ec,
    getDouyinFeedScope: _0x2defbf,
    getFeedVideoIdentity: _0x1e4a46,
    getProcessedVideoKeyModule: _0x5a70fa,
    getVideoAuthorNickname: _0x5b588d,
    getVideoTitle: _0x508285,
    ipcRenderer: _0x538aaa,
    isSubviewInteractionCancelled: _0x3f3e54,
    isVisibleElement: _0x34442d,
    normalizeAuthorAccountName: _0x53af8e,
    normalizeUrl: _0x3a4913,
    pickLeadVideoUrl: _0x17ad16,
    reportCurrentAction: _0x3d1794,
    reportTraceLog: _0x2c2873,
    resolveCurrentVisibleVideoUrl: _0x44f7a2,
    resolveDouyinVideoDetailModal: _0x3342c7,
    sleep: _0x26a304,
    state: _0x56c854
  } = _0x3741c0;
  function _0x1302ea(_0x8110f) {
    return typeof _0x8110f === "string" && (_0x8110f.startsWith("MONITOR") || _0x8110f === "VIDEO_MONITOR");
  }
  function _0x4f47d8(_0x12bd23) {
    if (_0x12bd23 === "BATCH" || _0x12bd23 === "SELF_WARMUP") {
      return _0x56c854.stopRequested;
    }
    if (typeof _0x12bd23 === "string" && _0x12bd23.startsWith("ENTITY")) {
      return _0x56c854.stopRequested;
    }
    if (_0x1302ea(_0x12bd23)) {
      return _0x56c854.stopRequested;
    }
    if (_0x12bd23 === "SUBVIEW_TASK") {
      const _0x31f3a2 = _0x56c854.subviewTaskAls?.getStore?.();
      const _0x5ac79e = String(_0x31f3a2?.interactionId || _0x25c7ec() || "").trim();
      if (_0x3f3e54(_0x5ac79e)) {
        return true;
      }
      if (_0x31f3a2?.taskSeq != null && _0x31f3a2.taskSeq !== _0x56c854.subviewTaskSeq) {
        return true;
      }
      if (_0x56c854.stopRequested) {
        return true;
      }
      if (_0x56c854.pausedForSubview && !_0x56c854.stopRequested) {
        return false;
      }
      return !_0x56c854.taskRunning || _0x12bd23 && _0x12bd23 !== _0x56c854.activeLoopId;
    }
    if (_0x56c854.pausedForSubview && _0x12bd23 === _0x56c854.activeLoopId && !_0x56c854.stopRequested) {
      return false;
    }
    return !_0x56c854.taskRunning || _0x56c854.stopRequested || _0x12bd23 && _0x12bd23 !== _0x56c854.activeLoopId;
  }
  const _0x55ba5a = _0x399635 => !!_0x399635 && !!_0x399635.cancelled;
  function _0x152c43() {
    _0x56c854.scrapeAiQueue.length = 0;
  }
  const _0x42dfa3 = 1500;
  const _0x364b14 = 2500;
  const _0x40110d = async (_0x471370, _0x236b31, _0x3e1302, _0x185f7d = "等待") => {
    if (_0x3e1302 !== undefined && _0x3e1302 !== null) {
      await _0x14a583(_0x3e1302);
    }
    const _0x41268c = Math.floor(Math.random() * (_0x236b31 - _0x471370 + 1) + _0x471370);
    const _0xd7df6e = _0x185f7d || "等待";
    const _0x4b4bc0 = _0xd7df6e === "等待" ? _0x364b14 : _0x42dfa3;
    const _0x3f2fc1 = _0x41268c >= _0x4b4bc0;
    if (_0x3f2fc1) {
      const _0x232cf8 = (_0x41268c / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + _0xd7df6e + "] 模拟拟人等待 " + _0x232cf8 + " 秒 (节奏间隔中，请稍候)...");
    }
    await new Promise(_0x5970e4 => setTimeout(_0x5970e4, _0x41268c));
    if (_0x3f2fc1) {
      const _0x2f9b66 = (_0x41268c / 1000).toFixed(1);
      const _0x1b59c8 = "⏱ " + _0xd7df6e + "：等待 " + _0x2f9b66 + " 秒";
      if (_0xd7df6e === "互动间隔" || _0xd7df6e === "主页评论后间隔") {
        _0x3d1794(_0x1b59c8);
      } else {
        _0x2c2873(_0x1b59c8);
      }
    }
    if (_0x4f47d8(_0x3e1302)) {
      throw new Error("TASK_ABORTED");
    }
  };
  async function _0x150747(_0x328205, _0xf87d6f = 0) {
    const _0x488093 = Math.max(0, Number(_0x328205) || 0);
    const _0x5af438 = _0xf87d6f > 0 ? Math.max(0, _0xf87d6f - Date.now()) : _0x488093;
    const _0x2b6316 = _0xf87d6f > 0 ? Math.min(_0x488093, _0x5af438) : _0x488093;
    if (_0x2b6316 <= 0) {
      return false;
    }
    await _0x26a304(_0x2b6316);
    return _0xf87d6f <= 0 || Date.now() < _0xf87d6f;
  }
  async function _0x31b91f(_0x14abc3, _0x18a817, _0x3d37a6, _0x2ae586, _0x2a39f8 = 0) {
    if (_0x3d37a6 !== undefined && _0x3d37a6 !== null) {
      await _0x14a583(_0x3d37a6);
    }
    const _0xd7b428 = _0x2a39f8 > 0 ? Math.max(0, _0x2a39f8 - Date.now()) : Number.MAX_SAFE_INTEGER;
    if (_0xd7b428 <= 0) {
      return false;
    }
    const _0x2c433a = Math.floor(Math.random() * (_0x18a817 - _0x14abc3 + 1) + _0x14abc3);
    const _0xecd33b = Math.min(_0x2c433a, _0xd7b428);
    if (_0xecd33b >= _0x42dfa3) {
      const _0x1b3d7d = (_0xecd33b / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + (_0x2ae586 || "等待") + "] 预算内等待 " + _0x1b3d7d + " 秒...");
      _0x2c2873("⏱ " + (_0x2ae586 || "等待") + "：等待 " + _0x1b3d7d + " 秒");
    }
    await _0x26a304(_0xecd33b);
    if (_0x4f47d8(_0x3d37a6)) {
      throw new Error("TASK_ABORTED");
    }
    return _0x2a39f8 <= 0 || Date.now() < _0x2a39f8;
  }
  const _0x419e7e = async (_0x36a77e, _0x20a652, _0x4eac6e, _0xbd1ebb = "等待", _0x2979b8 = document) => {
    if (_0x4eac6e !== undefined && _0x4eac6e !== null) {
      await _0x14a583(_0x4eac6e);
    }
    const _0x42b530 = Math.floor(Math.random() * (_0x20a652 - _0x36a77e + 1) + _0x36a77e);
    const _0x11be71 = _0xbd1ebb || "等待";
    const _0xa43c41 = _0x11be71 === "等待" ? _0x364b14 : _0x42dfa3;
    const _0x2eb370 = _0x42b530 >= _0xa43c41;
    if (_0x2eb370) {
      const _0x40259e = (_0x42b530 / 1000).toFixed(1);
      console.log("[Built-in-Debug] [" + _0x11be71 + "] 模拟拟人等待 " + _0x40259e + " 秒 (伴随播放器强制锁定中)...");
    }
    const _0xe83c4d = Date.now() + _0x42b530;
    while (Date.now() < _0xe83c4d) {
      if (_0x4f47d8(_0x4eac6e)) {
        throw new Error("TASK_ABORTED");
      }
      _0x38e687(_0x2979b8);
      await _0x26a304(Math.min(250, Math.max(50, _0xe83c4d - Date.now())));
    }
    if (_0x2eb370) {
      const _0x5a4447 = (_0x42b530 / 1000).toFixed(1);
      const _0x3bdf7a = "⏱ " + _0x11be71 + "：等待 " + _0x5a4447 + " 秒 (已锁定暂停)";
      if (_0x11be71 === "互动间隔" || _0x11be71 === "主页评论后间隔") {
        _0x3d1794(_0x3bdf7a);
      } else {
        _0x2c2873(_0x3bdf7a);
      }
    }
    if (_0x4f47d8(_0x4eac6e)) {
      throw new Error("TASK_ABORTED");
    }
  };
  function _0x38e687(_0x1e5bc2 = document, _0x340c91 = "") {
    const _0x4ff97b = [];
    const _0x24c089 = _0x28ed35 => {
      if (_0x28ed35 && _0x28ed35.querySelectorAll && !_0x4ff97b.includes(_0x28ed35)) {
        _0x4ff97b.push(_0x28ed35);
      }
    };
    _0x24c089(_0x1e5bc2);
    _0x24c089(document);
    const _0x44cd32 = [];
    if (_0x1e5bc2 && _0x1e5bc2 !== document && _0x1e5bc2.contains) {
      _0x44cd32.push(_0x1e5bc2);
    }
    try {
      const _0x2a4fc1 = _0x2defbf();
      if (_0x2a4fc1 && _0x2a4fc1.contains) {
        _0x44cd32.push(_0x2a4fc1);
      }
    } catch (_0x715ba7) {}
    try {
      const _0x3c464e = _0x3342c7({
        includeFeed: true
      });
      if (_0x3c464e && _0x3c464e.contains) {
        _0x44cd32.push(_0x3c464e);
      }
    } catch (_0x4b9d87) {}
    const _0x48ff01 = _0x422334 => {
      for (const _0x222f5d of _0x44cd32) {
        if (_0x222f5d.contains(_0x422334)) {
          return true;
        }
      }
      return false;
    };
    const _0x28a985 = _0xba1fc5 => {
      try {
        _0xba1fc5.muted = true;
        _0xba1fc5.autoplay = false;
        _0xba1fc5.loop = false;
        const _0x8c56ec = Number(_0xba1fc5.duration);
        if (Number.isFinite(_0x8c56ec) && _0x8c56ec > 0.15 && _0x8c56ec <= 15) {
          if (_0xba1fc5.currentTime >= Math.max(0.02, _0x8c56ec - 0.45) || _0x8c56ec <= 3 && _0xba1fc5.currentTime > 0.15) {
            _0xba1fc5.currentTime = Math.min(0.05, Math.max(0, _0x8c56ec * 0.05));
          }
        }
        if (typeof _0xba1fc5.pause === "function") {
          _0xba1fc5.pause();
        }
        return true;
      } catch (_0x49e580) {
        return false;
      }
    };
    const _0x17cd55 = new Set();
    let _0x1eb246 = 0;
    for (const _0x37b3af of _0x4ff97b) {
      if (!_0x37b3af.querySelectorAll) {
        continue;
      }
      const _0x397528 = Array.from(_0x37b3af.querySelectorAll("video")).filter(_0xf895b5 => !_0x17cd55.has(_0xf895b5));
      const _0x556ba2 = Array.from(_0x37b3af.querySelectorAll("audio")).filter(_0x5a15c5 => !_0x17cd55.has(_0x5a15c5));
      const _0x244a2d = [..._0x397528, ..._0x556ba2];
      for (const _0x2c3186 of _0x244a2d) {
        const _0x31f23a = _0x34442d(_0x2c3186);
        const _0x5e7c3e = _0x31f23a || _0x48ff01(_0x2c3186);
        if (!_0x5e7c3e) {
          continue;
        }
        _0x17cd55.add(_0x2c3186);
        if (_0x28a985(_0x2c3186)) {
          _0x1eb246 += 1;
        }
      }
      Array.from(_0x37b3af.querySelectorAll?.(".xgplayer, [class*=\"xgplayer\"], [data-e2e=\"video-player\"], [data-e2e=\"video-player-container\"]") || []).forEach(_0x20a579 => {
        if (!_0x20a579 || _0x17cd55.has(_0x20a579)) {
          return;
        }
        if (!_0x34442d(_0x20a579) && !_0x48ff01(_0x20a579)) {
          return;
        }
        _0x17cd55.add(_0x20a579);
        try {
          const _0x2c465d = _0x20a579.__player || _0x20a579.player || _0x20a579.xgPlayer || _0x20a579._player;
          if (_0x2c465d && typeof _0x2c465d.pause === "function") {
            _0x2c465d.pause();
            _0x1eb246 += 1;
          }
        } catch (_0x53d331) {}
        const _0x2b164a = _0x20a579.querySelector?.("video, audio");
        if (_0x2b164a && _0x28a985(_0x2b164a)) {
          _0x1eb246 += 1;
        }
      });
    }
    if (_0x1eb246 > 0 && _0x340c91) {
      console.log("[Built-in-Debug] [视频防跳] " + _0x340c91 + "，已暂停 " + _0x1eb246 + " 个可见或活动播放器");
    }
    return _0x1eb246;
  }
  async function _0x3cce10(_0x382068 = document, _0x4c5682 = null, {
    budgetMs = 1000,
    tickMs = 50,
    reason = "进入视频 1 秒内强制暂停"
  } = {}) {
    const _0x10161e = _0x382068 || document;
    const _0x175d88 = Date.now() + Math.max(400, Math.min(1500, Number(budgetMs) || 1000));
    let _0x2ffdaf = 0;
    let _0x28339a = 0;
    _0x2c2873("🧷 视频防跳：进入后 1 秒内强制暂停（含图文/短片）");
    while (Date.now() < _0x175d88) {
      if (_0x4c5682 != null && _0x4f47d8(_0x4c5682)) {
        throw new Error("TASK_ABORTED");
      }
      _0x2ffdaf += _0x38e687(_0x10161e, _0x28339a === 0 ? reason : "") || 0;
      _0x28339a += 1;
      await _0x26a304(Math.max(30, Number(tickMs) || 50));
    }
    _0x2ffdaf += _0x38e687(_0x10161e, reason + "（收尾）") || 0;
    return _0x2ffdaf;
  }
  function _0x20f11c(_0x1c6f1f = document, _0x361fee = "") {
    const _0x1f27a2 = [];
    const _0x312a3c = _0x3371f0 => {
      if (_0x3371f0 && _0x3371f0.querySelectorAll && !_0x1f27a2.includes(_0x3371f0)) {
        _0x1f27a2.push(_0x3371f0);
      }
    };
    _0x312a3c(_0x1c6f1f);
    _0x312a3c(document);
    const _0x3dc458 = [];
    if (_0x1c6f1f && _0x1c6f1f !== document && _0x1c6f1f.contains) {
      _0x3dc458.push(_0x1c6f1f);
    }
    try {
      const _0x4d9a41 = _0x2defbf();
      if (_0x4d9a41 && _0x4d9a41.contains) {
        _0x3dc458.push(_0x4d9a41);
      }
    } catch (_0x234459) {}
    const _0x33bbf2 = _0x279eff => {
      for (const _0x4cf0dc of _0x3dc458) {
        if (_0x4cf0dc.contains(_0x279eff)) {
          return true;
        }
      }
      return false;
    };
    const _0x90494c = new Set();
    let _0x86f034 = 0;
    for (const _0x326a4d of _0x1f27a2) {
      if (!_0x326a4d.querySelectorAll) {
        continue;
      }
      const _0x18773f = Array.from(_0x326a4d.querySelectorAll("video")).filter(_0x2668cf => !_0x90494c.has(_0x2668cf));
      const _0x327d91 = Array.from(_0x326a4d.querySelectorAll("audio")).filter(_0x396404 => !_0x90494c.has(_0x396404));
      const _0xd07c49 = [..._0x18773f, ..._0x327d91];
      for (const _0x145a58 of _0xd07c49) {
        const _0x237baf = _0x34442d(_0x145a58);
        const _0x1d6bfc = _0x237baf || _0x33bbf2(_0x145a58);
        if (!_0x1d6bfc) {
          continue;
        }
        _0x90494c.add(_0x145a58);
        try {
          _0x145a58.muted = true;
          const _0x4e3b35 = _0x145a58.play && _0x145a58.play();
          if (_0x4e3b35 && typeof _0x4e3b35.catch === "function") {
            _0x4e3b35.catch(() => {});
          }
          _0x86f034++;
        } catch (_0x2e4136) {}
      }
    }
    if (_0x86f034 > 0 && _0x361fee) {
      console.log("[Built-in-Debug] [养号播放] " + _0x361fee + "，已恢复 " + _0x86f034 + " 个可见或活动播放器");
    }
    return _0x86f034;
  }
  function _0x205ba4(_0x5e0975, _0x25dee5) {
    const _0x55ca5c = _0x3a4913(_0x5e0975 || "");
    const _0x25878a = _0x3a4913(_0x25dee5 || "");
    if (!_0x55ca5c || !_0x25878a) {
      return false;
    }
    if (_0x55ca5c === _0x25878a) {
      return true;
    }
    const _0x106e89 = _0x322067(_0x55ca5c);
    const _0x997dc3 = _0x322067(_0x25878a);
    return !!_0x106e89 && !!_0x997dc3 && _0x106e89 === _0x997dc3;
  }
  function _0x3c7204(_0x12acdb, _0x18763f) {
    const _0x2ff783 = String(_0x12acdb || "").trim();
    const _0x811eb5 = String(_0x18763f || "").trim();
    if (!_0x2ff783 || !_0x811eb5) {
      return true;
    }
    if (_0x2ff783 === "未知视频" || _0x811eb5 === "未知视频") {
      return true;
    }
    if (_0x2ff783 === _0x811eb5) {
      return true;
    }
    const _0x429245 = _0x2ff783.slice(0, 16);
    const _0x3094df = _0x811eb5.slice(0, 16);
    return _0x429245 === _0x3094df || _0x811eb5.includes(_0x429245) || _0x2ff783.includes(_0x3094df);
  }
  function _0x5b8f80(_0x2b9920 = {}) {
    const _0x11f1b2 = [];
    for (const _0x55f31b of [_0x2b9920.leadVideoUrl, _0x2b9920.dedupKey, _0x2b9920.videoId]) {
      const _0x4825b3 = _0x322067(_0x55f31b) || _0x80c4dd(_0x55f31b) || "";
      if (_0x4825b3 && !_0x11f1b2.includes(_0x4825b3)) {
        _0x11f1b2.push(_0x4825b3);
      }
    }
    return _0x11f1b2;
  }
  function _0x41a026(_0x1fdd5d = {}) {
    const _0x21f4d0 = _0x23063a["douyin.com"].modalContainer;
    const _0x3ece5a = _0x1fdd5d.isFeedPlayback ? _0x2defbf() || _0x1fdd5d.scope || document : document.querySelector(_0x21f4d0) || _0x1fdd5d.scope || document;
    const _0x5b75b5 = _0x3a4913(window.location.href);
    const _0x326b54 = _0x322067(_0x5b75b5) || _0x80c4dd(_0x5b75b5) || "";
    const _0xea5326 = _0x1fdd5d.isFeedPlayback ? _0x17ad16(_0x56c854.lockedLeadVideoUrl || _0x1e4a46(_0x3ece5a), _0x3ece5a) : _0x44f7a2(_0x5b75b5, _0x3ece5a);
    const _0x536a96 = _0x322067(_0xea5326) || _0x80c4dd(_0xea5326) || "";
    const _0xfeae06 = _0x508285(_0x3ece5a);
    const _0x316963 = [_0x1fdd5d.leadVideoUrl, _0x1fdd5d.dedupKey].filter(Boolean);
    const _0x429343 = _0x5b8f80(_0x1fdd5d);
    let _0x2003d9 = true;
    if (_0xea5326 && _0x316963.length) {
      _0x2003d9 = _0x316963.some(_0x71283f => _0x205ba4(_0xea5326, _0x71283f));
    } else if (_0x316963.length && !_0xea5326) {
      _0x2003d9 = _0x1fdd5d.lenientWhenUnresolved !== false;
    }
    const _0x41fce2 = _0x1fdd5d.videoTitle || "";
    const _0x573afa = _0x3c7204(_0x41fce2, _0xfeae06);
    const _0x5e49dc = _0x5b588d(_0x3ece5a, _0xea5326);
    const _0xaf1a28 = _0x53af8e(_0x1fdd5d.videoAuthor || "");
    const _0x17ab58 = _0x53af8e(_0x5e49dc);
    const _0x23b0a9 = !_0xaf1a28 || !_0x17ab58 || _0xaf1a28 === _0x17ab58;
    const _0x2f6fce = !!_0x326b54 && !!_0x429343.includes(String(_0x326b54)) || !!_0x536a96 && !!_0x429343.includes(String(_0x536a96)) || !!_0xea5326 && !!_0x316963.some(_0x19160d => _0x205ba4(_0xea5326, _0x19160d));
    const _0x21a97b = _0x2f6fce || _0x2003d9 && _0x573afa && _0x23b0a9;
    return {
      same: _0x21a97b,
      currentUrl: _0xea5326,
      currentTitle: _0xfeae06,
      currentAuthor: _0x5e49dc,
      sameUrl: _0x2003d9,
      sameTitle: _0x573afa,
      sameAuthor: _0x23b0a9,
      videoIdMatched: _0x2f6fce,
      locationId: _0x326b54,
      scope: _0x3ece5a
    };
  }
  async function _0x419b66(_0x260f1f = [], _0x4ae901 = "") {
    const _0x1ce4f4 = [...new Set((Array.isArray(_0x260f1f) ? _0x260f1f : [_0x260f1f]).filter(Boolean))];
    if (!_0x1ce4f4.length) {
      return;
    }
    try {
      const _0x45d4e2 = _0x5a70fa();
      for (const _0x2e331f of _0x1ce4f4) {
        if (typeof _0x45d4e2.forgetProcessedVideoKey === "function") {
          _0x45d4e2.forgetProcessedVideoKey(_0x56c854.processedVideos, _0x2e331f);
        } else {
          _0x56c854.processedVideos.delete(_0x2e331f);
        }
      }
    } catch (_0x1da152) {}
    try {
      await _0x538aaa.invoke("remove-processed-videos", _0x1ce4f4);
      console.log("[Built-in-Debug] [视频防跳] 已释放抢占记录 (" + (_0x4ae901 || "abandon") + "): " + _0x1ce4f4.map(_0x3981aa => _0x322067(_0x3981aa) || _0x3981aa).join(","));
    } catch (_0x1ad9a7) {
      console.warn("[Built-in-Debug] [视频防跳] 释放抢占记录失败: " + (_0x1ad9a7?.message || _0x1ad9a7));
    }
  }
  async function _0x4a07fe(_0x46af3b, _0x307e46, _0xe32621, _0x19684d, _0x23afd5 = {}, _0x375627 = {}) {
    const {
      allowRandomPlay: _0x42cca = true
    } = _0x375627;
    const _0x54b7d8 = _0x42cca && _0x56c854.currentTask?.taskMode !== "scrape";
    const _0x3bdcd3 = Math.floor(Math.random() * (_0x307e46 - _0x46af3b + 1) + _0x46af3b);
    const _0x251340 = _0x19684d || "等待";
    const _0x258d1f = _0x251340 === "等待" ? _0x364b14 : _0x42dfa3;
    const _0x578ea8 = _0x3bdcd3 >= _0x258d1f;
    const _0x38fa28 = _0x5169c4(_0x23afd5.scope || document);
    const _0x2abeac = Math.min(800, _0x38fa28.intervalMs || 800);
    if (_0x578ea8) {
      console.log("[Built-in-Debug] [" + _0x251340 + "] 守护等待 " + (_0x3bdcd3 / 1000).toFixed(1) + " 秒（" + _0x38fa28.label + "，" + _0x2abeac + "ms 暂停巡检）...");
    }
    const _0xb208e = Date.now();
    const _0x29b3af = _0xb208e + _0x3bdcd3;
    const _0x385418 = (_0x22cfda, _0x455c7f) => {
      if (_0x22cfda?.videoIdMatched || _0x22cfda?.same) {
        return false;
      }
      console.warn("[Built-in-Debug] [视频防跳] " + _0x455c7f + "检测到视频已漂移: urlSame=" + _0x22cfda?.sameUrl + ", titleSame=" + _0x22cfda?.sameTitle + ", idMatch=" + _0x22cfda?.videoIdMatched + ", locId=" + (_0x22cfda?.locationId || "") + ", current=" + (_0x22cfda?.currentUrl || _0x22cfda?.currentTitle || "unknown"));
      return true;
    };
    _0x38e687(_0x23afd5.scope || document, "守护等待开始，先暂停视频");
    const _0x22e52f = _0x5dc277(_0x23afd5.scope || document);
    let _0x4c6057 = 0;
    if (_0x22e52f > 0 && !_0x38fa28.imageText) {
      const _0x3fc859 = _0x22e52f > 2000 ? _0x22e52f - 2000 : Math.floor(_0x22e52f / 2);
      if (_0x3fc859 > 200) {
        const _0xbc3d96 = Math.floor(Math.random() * 3000) + 2000;
        _0x4c6057 = Math.min(_0xbc3d96, _0x3fc859);
      }
    }
    if (_0x4c6057 > 0 && _0x54b7d8) {
      console.log("[Built-in-Debug] [视频优化] 检测到视频时长 " + (_0x22e52f / 1000).toFixed(1) + " 秒，随机播放 " + (_0x4c6057 / 1000).toFixed(1) + " 秒后暂停");
      _0x20f11c(_0x23afd5.scope || document, "模拟视频随机播放阶段");
      const _0x28a9d1 = Date.now() + _0x4c6057;
      let _0x4b2c20 = 0;
      while (Date.now() < _0x28a9d1 && Date.now() < _0x29b3af) {
        if (_0x4f47d8(_0xe32621)) {
          throw new Error("TASK_ABORTED");
        }
        const _0x45bfbd = _0x41a026(_0x23afd5);
        if (!_0x45bfbd.same) {
          _0x4b2c20 += 1;
          if (_0x4b2c20 >= 3 && _0x385418(_0x45bfbd, "播放期间")) {
            return false;
          }
        } else {
          _0x4b2c20 = 0;
        }
        await _0x26a304(Math.min(200, Math.max(50, _0x28a9d1 - Date.now(), _0x29b3af - Date.now())));
      }
      _0x38e687(_0x23afd5.scope || document, "随机播放结束，锁定暂停");
    }
    let _0x2a5d14 = 0;
    while (Date.now() < _0x29b3af) {
      if (_0x4f47d8(_0xe32621)) {
        throw new Error("TASK_ABORTED");
      }
      _0x38e687(_0x23afd5.scope || document);
      const _0x6de615 = _0x41a026(_0x23afd5);
      if (!_0x6de615.same) {
        _0x2a5d14 += 1;
        if (_0x2a5d14 >= 3 && _0x385418(_0x6de615, "等待期间")) {
          return false;
        }
      } else {
        _0x2a5d14 = 0;
      }
      await _0x26a304(Math.min(_0x2abeac, Math.max(120, _0x29b3af - Date.now())));
    }
    if (_0x578ea8) {
      _0x2c2873(_0x2c2270(_0x251340, "" + (_0x3bdcd3 / 1000).toFixed(1)));
    }
    if (_0x4f47d8(_0xe32621)) {
      throw new Error("TASK_ABORTED");
    }
    return true;
  }
  function _0x2c5c48(_0x186d57) {
    const _0x2ebfdb = String(_0x186d57 || "").trim();
    if (!_0x2ebfdb) {
      return 0;
    }
    const _0x3b68ff = _0x2ebfdb.match(/(?:^|\s)(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s|$)|(?:^|\s)(\d{1,2}):(\d{2})(?:\s|$)/);
    if (!_0x3b68ff) {
      return 0;
    }
    let _0x19b28d = 0;
    let _0x22219b = 0;
    let _0x160e1c = 0;
    if (_0x3b68ff[2] !== undefined && _0x3b68ff[3] !== undefined) {
      _0x19b28d = parseInt(_0x3b68ff[1] || "0", 10);
      _0x22219b = parseInt(_0x3b68ff[2] || "0", 10);
      _0x160e1c = parseInt(_0x3b68ff[3] || "0", 10);
    } else {
      _0x22219b = parseInt(_0x3b68ff[4] || "0", 10);
      _0x160e1c = parseInt(_0x3b68ff[5] || "0", 10);
    }
    if (!Number.isFinite(_0x22219b) || !Number.isFinite(_0x160e1c)) {
      return 0;
    }
    return (_0x19b28d * 3600 + _0x22219b * 60 + _0x160e1c) * 1000;
  }
  function _0x5dc277(_0x4cf9e9 = document) {
    const _0x44106a = Array.from(_0x4cf9e9.querySelectorAll?.("video") || []).filter(_0x34442d).sort((_0x1ce7b3, _0x18df36) => {
      const _0x474b0b = _0x1ce7b3.getBoundingClientRect();
      const _0x3f17cd = _0x18df36.getBoundingClientRect();
      return _0x3f17cd.width * _0x3f17cd.height - _0x474b0b.width * _0x474b0b.height;
    });
    for (const _0x2d785d of _0x44106a) {
      try {
        const _0x505ce2 = Number(_0x2d785d.duration);
        if (Number.isFinite(_0x505ce2) && _0x505ce2 > 0 && _0x505ce2 < 86400) {
          return Math.round(_0x505ce2 * 1000);
        }
      } catch (_0x43f548) {}
    }
    const _0x1e8315 = [".xgplayer-time-duration", "[class*=\"time-duration\"]", "[class*=\"TimeDuration\"]", "[data-e2e*=\"duration\"]", "[aria-label*=\"时长\"]", "[title*=\"时长\"]"].join(", ");
    const _0x293045 = Array.from(_0x4cf9e9.querySelectorAll?.(_0x1e8315) || []).filter(_0x34442d);
    for (const _0x47de3c of _0x293045) {
      const _0x25ffcb = _0x2c5c48(_0x47de3c.innerText || _0x47de3c.textContent || _0x47de3c.getAttribute("aria-label") || _0x47de3c.getAttribute("title") || "");
      if (_0x25ffcb > 0) {
        return _0x25ffcb;
      }
    }
    return 0;
  }
  function _0x488d9e(_0x34344e = document) {
    const _0x1301b5 = Array.from(_0x34344e.querySelectorAll?.("video") || []).filter(_0x34442d);
    if (_0x1301b5.length > 0) {
      return false;
    }
    const _0x53a49c = Array.from(_0x34344e.querySelectorAll?.("img, canvas, [data-e2e*=\"image\"], [class*=\"image\"], [class*=\"Image\"], [class*=\"photo\"], [class*=\"Photo\"], [class*=\"slide\"], [class*=\"Slide\"]") || []).filter(_0x34442d);
    const _0x2d38b2 = (_0x34344e.innerText || _0x34344e.textContent || "").replace(/\s+/g, " ").trim();
    return _0x53a49c.length > 0 || /图文|图片|相册|共\d+张/.test(_0x2d38b2);
  }
  function _0x5169c4(_0x43c994 = document) {
    const _0x42d0b6 = _0x5dc277(_0x43c994);
    const _0x1de8b8 = !_0x42d0b6 && _0x488d9e(_0x43c994);
    let _0x3c8f4c = 650;
    if (_0x1de8b8) {
      _0x3c8f4c = 220;
    } else if (_0x42d0b6 > 0 && _0x42d0b6 <= 8000) {
      _0x3c8f4c = 220;
    } else if (_0x42d0b6 > 0 && _0x42d0b6 <= 15000) {
      _0x3c8f4c = 350;
    } else if (_0x42d0b6 > 0 && _0x42d0b6 <= 30000) {
      _0x3c8f4c = 500;
    }
    return {
      durationMs: _0x42d0b6,
      imageText: _0x1de8b8,
      intervalMs: _0x3c8f4c,
      label: _0x42d0b6 > 0 ? "视频时长约 " + (_0x42d0b6 / 1000).toFixed(1) + " 秒" : _0x1de8b8 ? "图文/短内容" : "未知时长"
    };
  }
  function _0xb71ef4(_0x5ad1ff = {}, _0x504f50 = null, _0x4c26a9 = {}) {
    const _0x5e9631 = _0x5ad1ff.scope || document;
    const _0x2660b2 = _0x5169c4(_0x5e9631);
    const _0x326b43 = _0x4c26a9.intervalMs || (_0x4c26a9.pauseOnly ? Math.min(80, _0x2660b2.intervalMs) : _0x2660b2.intervalMs);
    const _0x21fe39 = !!_0x4c26a9.pauseOnly;
    let _0x258073 = null;
    const _0x3dc520 = {
      drifted: false,
      stopped: false,
      driftStreak: 0,
      profile: _0x2660b2,
      lastState: null,
      hookedVideos: new Set(),
      stop: () => {}
    };
    const _0x3f5759 = _0x4c26a9.driftConfirmTicks || 3;
    const _0x9a96c0 = _0x2a11a2 => {
      if (_0x3dc520.stopped) {
        return;
      }
      try {
        const _0x6146eb = _0x2a11a2.target;
        if (_0x6146eb && _0x6146eb.pause) {
          _0x6146eb.pause();
          _0x6146eb.muted = true;
        }
        _0x38e687(_0x5e9631);
      } catch (_0x43c620) {}
    };
    const _0x2df87f = _0x36d664 => {
      if (_0x3dc520.stopped) {
        return;
      }
      try {
        const _0x59e8e2 = _0x36d664.target;
        if (!_0x59e8e2 || !_0x59e8e2.pause) {
          return;
        }
        _0x59e8e2.pause();
        _0x59e8e2.muted = true;
        const _0x557329 = Number(_0x59e8e2.duration);
        if (Number.isFinite(_0x557329) && _0x557329 > 0.15) {
          _0x59e8e2.currentTime = Math.min(0.05, Math.max(0, _0x557329 * 0.05));
        }
        _0x38e687(_0x5e9631, "ended 拦截：拉回并暂停防切条");
      } catch (_0x223678) {}
    };
    const _0x365061 = _0x37656b => {
      if (_0x3dc520.stopped || !_0x21fe39) {
        return;
      }
      try {
        const _0xcbe034 = _0x37656b.target;
        if (!_0xcbe034 || !_0xcbe034.pause) {
          return;
        }
        if (!_0xcbe034.paused) {
          _0xcbe034.pause();
        }
        const _0x561eb5 = Number(_0xcbe034.duration);
        if (Number.isFinite(_0x561eb5) && _0x561eb5 > 0 && _0x561eb5 <= 5 && _0xcbe034.currentTime > 0.2) {
          _0xcbe034.currentTime = 0.05;
          _0xcbe034.pause();
        }
      } catch (_0x1917de) {}
    };
    const _0x59442c = _0x5268bd => {
      if (!_0x5268bd?.querySelectorAll) {
        return;
      }
      Array.from(_0x5268bd.querySelectorAll("video, audio")).forEach(_0x5ed70c => {
        if (_0x3dc520.hookedVideos.has(_0x5ed70c)) {
          return;
        }
        _0x3dc520.hookedVideos.add(_0x5ed70c);
        _0x5ed70c.addEventListener("play", _0x9a96c0, true);
        _0x5ed70c.addEventListener("playing", _0x9a96c0, true);
        _0x5ed70c.addEventListener("ended", _0x2df87f, true);
        _0x5ed70c.addEventListener("timeupdate", _0x365061, true);
      });
    };
    const _0x660647 = _0x21fe39 ? "进入视频后立即锁暂停" : "评论期暂停守护";
    console.log("[Built-in-Debug] [视频防跳] 启动" + _0x660647 + "：" + _0x2660b2.label + "，间隔 " + _0x326b43 + "ms");
    if (!_0x21fe39) {
      _0x2c2873("🧷 视频防跳：" + _0x2660b2.label + "，评论分析期间持续暂停，防止自动进入下一条");
    } else {
      _0x2c2873("🧷 视频防跳：进入后持续锁暂停（目标 1 秒内停住，含图文/短片）");
    }
    const _0x5d70d4 = () => {
      if (_0x3dc520.stopped) {
        return;
      }
      if (_0x504f50 && _0x4f47d8(_0x504f50)) {
        _0x3dc520.stop();
        return;
      }
      _0x59442c(_0x5e9631);
      _0x59442c(document);
      _0x38e687(_0x5e9631);
      if (_0x21fe39) {
        return;
      }
      const _0x106f18 = _0x41a026(_0x5ad1ff);
      _0x3dc520.lastState = _0x106f18;
      if (!_0x106f18.same) {
        _0x3dc520.driftStreak += 1;
        if (_0x3dc520.driftStreak >= _0x3f5759) {
          _0x3dc520.drifted = true;
          _0x3dc520.stopped = true;
          console.warn("[Built-in-Debug] [视频防跳] 评论期检测到视频漂移(连续" + _0x3dc520.driftStreak + "次): urlSame=" + _0x106f18.sameUrl + ", titleSame=" + _0x106f18.sameTitle + ", idMatch=" + _0x106f18.videoIdMatched + ", current=" + (_0x106f18.currentUrl || _0x106f18.currentTitle || "unknown"));
        }
      } else {
        _0x3dc520.driftStreak = 0;
      }
    };
    _0x3dc520.stop = () => {
      if (_0x3dc520.stopped && _0x258073 === null && _0x3dc520.hookedVideos.size === 0) {
        return;
      }
      _0x3dc520.stopped = true;
      if (_0x258073 !== null) {
        clearInterval(_0x258073);
        _0x258073 = null;
      }
      _0x3dc520.hookedVideos.forEach(_0x1d233f => {
        try {
          _0x1d233f.removeEventListener("play", _0x9a96c0, true);
        } catch (_0x240596) {}
        try {
          _0x1d233f.removeEventListener("playing", _0x9a96c0, true);
        } catch (_0x15ac1f) {}
        try {
          _0x1d233f.removeEventListener("ended", _0x2df87f, true);
        } catch (_0xf57e9e) {}
        try {
          _0x1d233f.removeEventListener("timeupdate", _0x365061, true);
        } catch (_0x54fd3c) {}
      });
      _0x3dc520.hookedVideos.clear();
    };
    _0x5d70d4();
    if (!_0x3dc520.stopped) {
      _0x258073 = setInterval(_0x5d70d4, _0x326b43);
    }
    return _0x3dc520;
  }
  return {
    burstPauseWithinOneSecond: _0x3cce10,
    getCurrentContentPauseProfile: _0x5169c4,
    getCurrentVideoGuardState: _0x41a026,
    getVisibleDouyinVideoDurationMs: _0x5dc277,
    guardedCurrentVideoDelay: _0x4a07fe,
    guardedPauseDelay: _0x419e7e,
    isAiInvokeCancelled: _0x55ba5a,
    isMonitorLoopId: _0x1302ea,
    isSameVideoTitleLoose: _0x3c7204,
    pauseVisibleDouyinVideos: _0x38e687,
    randomDelay: _0x40110d,
    randomDelayWithinDeadline: _0x31b91f,
    releaseAbandonedVideoClaim: _0x419b66,
    resetScrapeAiQueueOnStop: _0x152c43,
    resumeVisibleDouyinVideos: _0x20f11c,
    shouldAbort: _0x4f47d8,
    sleepWithinDeadline: _0x150747,
    startCurrentVideoPauseGuard: _0xb71ef4
  };
}
module.exports = {
  createAutomationMediaController: createAutomationMediaController
};
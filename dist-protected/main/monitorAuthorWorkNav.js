'use strict';

const {
  extractDouyinVideoId
} = require("../shared/processedVideoKey");
function createMonitorAuthorWorkNav(_0x5bd8d8 = {}) {
  const _0x207998 = new Map();
  function _0x24dd9b(_0x67ab1d = "monitor_nav") {
    return _0x67ab1d + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  }
  function _0x380a9a(_0x512070 = {}) {
    const _0x578c3f = String(_0x512070?.requestId || "").trim();
    if (!_0x578c3f) {
      return;
    }
    const _0xdde5c9 = _0x207998.get(_0x578c3f);
    if (!_0xdde5c9) {
      return;
    }
    _0x207998.delete(_0x578c3f);
    if (_0xdde5c9.timer) {
      clearTimeout(_0xdde5c9.timer);
    }
    const _0x327e7b = Date.now() - _0xdde5c9.startedAt;
    if (Date.now() > _0xdde5c9.deadline) {
      _0xdde5c9.resolve({
        success: false,
        ok: false,
        error: "主页作品导航超过 " + Math.round(_0xdde5c9.timeoutMs / 1000) + " 秒",
        errorCode: "monitor_author_nav_timeout",
        elapsedMs: _0x327e7b
      });
      return;
    }
    _0xdde5c9.resolve({
      ..._0x512070,
      elapsedMs: _0x327e7b,
      ok: !!_0x512070?.success
    });
  }
  function _0x30b5bf(_0x2f71a5, _0x168d49 = {}) {
    const _0xc9197b = _0x2f71a5 + "_";
    const _0x48f940 = new Set();
    for (const [_0x34ea3b, _0xa907fc] of _0x207998.entries()) {
      if (!String(_0x34ea3b).startsWith(_0xc9197b) && _0xa907fc.taskId !== _0x2f71a5) {
        continue;
      }
      _0x207998.delete(_0x34ea3b);
      if (_0xa907fc.timer) {
        clearTimeout(_0xa907fc.timer);
      }
      if (_0xa907fc.webContentsId != null) {
        _0x48f940.add(_0xa907fc.webContentsId);
      }
      _0xa907fc.resolve({
        success: false,
        ok: false,
        error: "监控任务已停止",
        errorCode: "monitor_task_stopped",
        elapsedMs: Date.now() - _0xa907fc.startedAt,
        ..._0x168d49
      });
    }
    return _0x48f940;
  }
  function _0x49f775(_0x3c31cb, _0x46dc88, _0x404422) {
    if (_0x3c31cb == null) {
      return 0;
    }
    let _0x79a262 = 0;
    for (const [_0x18ad61, _0x3645a8] of _0x207998.entries()) {
      if (_0x3645a8.webContentsId !== _0x3c31cb) {
        continue;
      }
      _0x207998.delete(_0x18ad61);
      if (_0x3645a8.timer) {
        clearTimeout(_0x3645a8.timer);
      }
      _0x3645a8.resolve({
        success: false,
        ok: false,
        error: _0x404422,
        errorCode: _0x46dc88,
        elapsedMs: Date.now() - _0x3645a8.startedAt
      });
      _0x79a262 += 1;
    }
    return _0x79a262;
  }
  function _0x2763e1(_0x2eb101, _0x53d167, _0x309446 = {}, _0x5a365f = 40000) {
    const _0x3d70c7 = String(_0x309446.taskId || "").trim();
    const _0xbaecf3 = _0x309446.requestId || (_0x3d70c7 ? _0x3d70c7 + "_nav_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7) : _0x24dd9b());
    return new Promise(_0x19df18 => {
      const _0x2a3656 = Date.now();
      const _0x48da9b = setTimeout(() => {
        _0x207998.delete(_0xbaecf3);
        _0x19df18({
          success: false,
          ok: false,
          error: "主页作品导航超时（" + Math.round(_0x5a365f / 1000) + " 秒）",
          errorCode: "monitor_author_nav_timeout",
          elapsedMs: Date.now() - _0x2a3656
        });
      }, Math.max(5000, Number(_0x5a365f) || 40000));
      _0x207998.set(_0xbaecf3, {
        resolve: _0x19df18,
        timer: _0x48da9b,
        startedAt: _0x2a3656,
        deadline: _0x2a3656 + Math.max(5000, Number(_0x5a365f) || 40000),
        timeoutMs: Math.max(5000, Number(_0x5a365f) || 40000),
        webContentsId: _0x2eb101?.id,
        taskId: _0x3d70c7
      });
      try {
        if (!_0x2eb101 || _0x2eb101.isDestroyed?.()) {
          throw new Error("监控窗口已销毁");
        }
        if (_0x2eb101.__radarMonitorUnhealthy) {
          const _0x1eedc1 = new Error("后台监控渲染进程状态异常");
          _0x1eedc1.code = "monitor_renderer_unhealthy";
          throw _0x1eedc1;
        }
        _0x2eb101.send("control-task", {
          type: _0x53d167,
          payload: {
            ..._0x309446,
            requestId: _0xbaecf3
          }
        });
      } catch (_0x552527) {
        clearTimeout(_0x48da9b);
        _0x207998.delete(_0xbaecf3);
        _0x19df18({
          success: false,
          ok: false,
          error: _0x552527.message || "无法下发主页作品导航",
          errorCode: _0x552527.code || "monitor_author_nav_dispatch_failed",
          elapsedMs: Date.now() - _0x2a3656
        });
      }
    });
  }
  function _0x17bef7(_0x263261, _0x3e1648) {
    const _0x6a4347 = String(_0x263261 || "").trim();
    if (!_0x6a4347) {
      return true;
    }
    const _0x135d82 = extractDouyinVideoId(_0x3e1648) || String(_0x3e1648 || "").trim();
    return !!_0x135d82 && _0x135d82 === _0x6a4347;
  }
  async function _0x56e2a4(_0x198fb7, {
    taskId = "",
    awemeId = "",
    url = "",
    authorUrl = "",
    preferFirstCard = true,
    skipPinnedCards = false,
    knownHasWorks = false,
    allowUrlFallback = true,
    timeoutMs = 50000
  } = {}) {
    const _0x53565c = String(awemeId || extractDouyinVideoId(url) || "").trim();
    const _0xdacf34 = await _0x2763e1(_0x198fb7, "VIDEO_MONITOR_OPEN_AUTHOR_WORK", {
      taskId: taskId,
      awemeId: _0x53565c,
      url: url,
      authorUrl: String(authorUrl || "").trim(),
      preferFirstCard: preferFirstCard !== false,
      skipPinnedCards: skipPinnedCards === true,
      knownHasWorks: knownHasWorks === true || !!_0x53565c,
      allowUrlFallback: allowUrlFallback !== false
    }, timeoutMs);
    const _0x55b371 = String(_0xdacf34?.videoUrl || "").trim();
    const _0x343c58 = extractDouyinVideoId(_0x55b371) || String(_0xdacf34?.awemeId || "").trim();
    const _0xc4276e = preferFirstCard !== false ? !!_0x343c58 : !_0x53565c || _0x17bef7(_0x53565c, _0x343c58 || _0x55b371);
    const _0x56979b = !!_0xdacf34?.success && !!_0xc4276e && !!_0x343c58;
    return {
      ok: _0x56979b,
      success: _0x56979b,
      videoUrl: _0x55b371 || (_0x343c58 ? "https://www.douyin.com/video/" + _0x343c58 : ""),
      awemeId: _0x343c58 || _0x53565c,
      matched: _0xc4276e,
      error: _0x56979b ? "" : _0xdacf34?.error || "打开作品失败",
      reason: _0xdacf34?.reason || "",
      debug: _0xdacf34?.debug || "",
      cancelled: !!_0xdacf34?.cancelled
    };
  }
  async function _0x132901(_0x2c12ce, {
    taskId = "",
    expectedAwemeId = "",
    expectedUrl = "",
    requireMatch = false,
    timeoutMs = 40000
  } = {}) {
    const _0x2ac216 = String(expectedAwemeId || extractDouyinVideoId(expectedUrl) || "").trim();
    const _0x4416ae = await _0x2763e1(_0x2c12ce, "VIDEO_MONITOR_MOVE_NEXT_VIDEO", {
      taskId: taskId,
      expectedAwemeId: _0x2ac216,
      requireMatch: requireMatch === true
    }, timeoutMs);
    const _0xc77e1b = String(_0x4416ae?.videoUrl || "").trim();
    const _0x102958 = extractDouyinVideoId(_0xc77e1b) || String(_0x4416ae?.awemeId || "").trim();
    const _0x253da1 = !!_0x4416ae?.success || !!_0x4416ae?.continued;
    const _0x405a2c = !_0x2ac216 || _0x17bef7(_0x2ac216, _0x102958 || _0xc77e1b);
    const _0x36182a = requireMatch === true ? _0x253da1 && _0x405a2c : _0x253da1;
    return {
      ok: _0x36182a,
      success: _0x36182a,
      videoUrl: _0xc77e1b || (_0x102958 ? "https://www.douyin.com/video/" + _0x102958 : ""),
      awemeId: _0x102958 || _0x2ac216,
      matched: _0x405a2c,
      switched: _0x253da1,
      error: _0x36182a ? "" : _0x4416ae?.error || (!_0x253da1 ? "未能切换到下一条" : "下一条作品不匹配"),
      reason: _0x4416ae?.reason || ""
    };
  }
  async function _0xc65034(_0x416ef2, {
    taskId = "",
    videoUrl = "",
    timeoutMs = 35000
  } = {}) {
    const _0x2e8ccd = Math.max(12000, Number(timeoutMs) || 35000);
    const _0x261da5 = await _0x2763e1(_0x416ef2, "VIDEO_MONITOR_WAIT_VIDEO_READY", {
      taskId: taskId,
      videoUrl: videoUrl,
      timeoutMs: _0x2e8ccd
    }, _0x2e8ccd + 10000);
    return {
      ok: !!_0x261da5?.success || !!_0x261da5?.ready,
      success: !!_0x261da5?.success || !!_0x261da5?.ready,
      ready: !!_0x261da5?.ready || !!_0x261da5?.success,
      unavailable: !!_0x261da5?.unavailable,
      reason: String(_0x261da5?.reason || ""),
      videoUrl: String(_0x261da5?.videoUrl || videoUrl || "").trim(),
      error: _0x261da5?.error || ""
    };
  }
  async function _0x5e6fc6(_0x37dff3, {
    taskId = "",
    videoUrl = "",
    expectedAuthorUrl = "",
    expectedSecUid = "",
    timeoutMs = 6000
  } = {}) {
    const _0x420d79 = Math.max(2000, Math.min(12000, Number(timeoutMs) || 6000));
    const _0x151cd5 = await _0x2763e1(_0x37dff3, "VIDEO_MONITOR_CONFIRM_AUTHOR", {
      taskId: taskId,
      videoUrl: videoUrl,
      expectedAuthorUrl: expectedAuthorUrl,
      expectedSecUid: expectedSecUid,
      timeoutMs: _0x420d79
    }, _0x420d79 + 4000);
    return {
      ok: !!_0x151cd5?.matched,
      success: !!_0x151cd5?.matched,
      matched: !!_0x151cd5?.matched,
      skipped: !!_0x151cd5?.skipped,
      authorMismatch: !!_0x151cd5?.authorMismatch,
      authorUnconfirmed: !!_0x151cd5?.authorUnconfirmed,
      nickname: String(_0x151cd5?.nickname || "").trim(),
      authorUrl: String(_0x151cd5?.authorUrl || "").trim(),
      pageUrl: String(_0x151cd5?.pageUrl || "").trim(),
      secUid: String(_0x151cd5?.secUid || "").trim(),
      videoUrl: String(_0x151cd5?.videoUrl || videoUrl || "").trim(),
      error: _0x151cd5?.error || ""
    };
  }
  async function _0x30bf21(_0x182258, {
    taskId = "",
    videoUrl = "",
    timeoutMs = 110000
  } = {}) {
    const _0x331a32 = Math.max(60000, Math.min(130000, Number(timeoutMs) || 110000));
    const _0x47784f = await _0x2763e1(_0x182258, "VIDEO_MONITOR_OPEN_SPECIFIC_VIDEO", {
      taskId: taskId,
      videoUrl: videoUrl
    }, _0x331a32);
    const _0x29a9ef = String(_0x47784f?.status || "").trim();
    const _0x13c591 = !!_0x47784f?.success || !!_0x47784f?.ready || _0x29a9ef === "ready";
    return {
      ok: _0x13c591,
      success: _0x13c591,
      ready: _0x13c591,
      status: _0x29a9ef || (_0x13c591 ? "ready" : "timeout"),
      unavailable: _0x29a9ef === "unavailable" || !!_0x47784f?.unavailable,
      reason: String(_0x47784f?.reason || _0x29a9ef || ""),
      videoUrl: String(_0x47784f?.videoUrl || videoUrl || "").trim(),
      error: _0x47784f?.error || ""
    };
  }
  function _0x297466(_0x30e1a5) {
    if (!_0x30e1a5 || _0x30e1a5.isDestroyed?.() || _0x30e1a5.__radarMonitorUnhealthy) {
      return false;
    }
    let _0x2f5fa1 = "";
    try {
      _0x2f5fa1 = String(_0x30e1a5.webContents?.getURL?.() || "");
    } catch (_0x3c452c) {
      return false;
    }
    if (!_0x2f5fa1) {
      return false;
    }
    if (/\/video\/|\/note\/|modal_id=/.test(_0x2f5fa1)) {
      return true;
    }
    if (/\/user\//.test(_0x2f5fa1)) {
      return true;
    }
    return false;
  }
  return {
    openAuthorWork: _0x56e2a4,
    openSpecificVideo: _0x30bf21,
    moveNextAuthorWork: _0x132901,
    waitVideoReady: _0xc65034,
    confirmAuthor: _0x5e6fc6,
    canContinueAuthorFeed: _0x297466,
    handleNavResult: _0x380a9a,
    cancelPendingForTask: _0x30b5bf,
    failPendingForWebContents: _0x49f775,
    pendingNav: _0x207998
  };
}
module.exports = {
  createMonitorAuthorWorkNav: createMonitorAuthorWorkNav
};
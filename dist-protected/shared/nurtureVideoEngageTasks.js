'use strict';

const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction,
  findShareSideActionButton,
  findSharePanelCopyLinkButton,
  resolveVideoEngagePack
} = require("./douyinVideoSideActions");
const NURTURE_ENGAGE_LIKE_PERCENT = 10;
const NURTURE_ENGAGE_COLLECT_PERCENT = 10;
const NURTURE_ENGAGE_SHARE_PERCENT = 10;
function rollPercent(_0x4a520b) {
  const _0x1ab08d = Math.max(0, Math.min(100, Number(_0x4a520b) || 0));
  if (_0x1ab08d >= 100) {
    return true;
  }
  if (_0x1ab08d <= 0) {
    return false;
  }
  return Math.random() * 100 < _0x1ab08d;
}
async function nurtureLikeCurrentVideo(_0x4abfbd, _0x5e7c1e = {}) {
  const _0xb12d1a = (_0x1ec7c9, _0x5e50a1) => _0x5e7c1e.reportTraceLog?.(_0x1ec7c9.startsWith("养号") || _0x1ec7c9.startsWith("❤️") || _0x1ec7c9.startsWith("👍") ? _0x1ec7c9 : "养号：" + _0x1ec7c9, null, _0x5e50a1);
  const _0x1ccbbc = await likeCurrentVideoSideAction(_0x4abfbd, {
    ..._0x5e7c1e,
    reportTraceLog: (_0x4ac2c6, _0x461851, _0x5536a7) => _0xb12d1a(_0x4ac2c6, _0x5536a7)
  });
  if (_0x1ccbbc) {
    _0x5e7c1e.reportTraceLog?.("❤️ 养号：已点赞当前视频");
  }
  return _0x1ccbbc;
}
async function nurtureCollectCurrentVideo(_0x371a26, _0xf8cc53 = {}) {
  const _0x50dad1 = (_0x59920d, _0x1b38f1) => _0xf8cc53.reportTraceLog?.(_0x59920d.startsWith("养号") || _0x59920d.startsWith("⭐") || _0x59920d.startsWith("👍") ? _0x59920d : "养号：" + _0x59920d, null, _0x1b38f1);
  const _0x5a9c7f = await collectCurrentVideoSideAction(_0x371a26, {
    ..._0xf8cc53,
    reportTraceLog: (_0x25181f, _0x5f15df, _0x3a2a9a) => _0x50dad1(_0x25181f, _0x3a2a9a)
  });
  if (_0x5a9c7f) {
    _0xf8cc53.reportTraceLog?.("⭐ 养号：已收藏当前视频");
  }
  return _0x5a9c7f;
}
function pickVisibleVideoSurface(_0x4bda3d, _0x4a3979) {
  const _0x1f124e = _0x4bda3d || document;
  const _0x2e4a59 = [];
  try {
    _0x2e4a59.push(...Array.from(_0x1f124e.querySelectorAll("video")));
    _0x2e4a59.push(...Array.from(_0x1f124e.querySelectorAll("[class*=\"xgplayer\"], [class*=\"video-player\"], [data-e2e*=\"video-player\"], [class*=\"player-container\"]")));
  } catch (_0x3fab7e) {}
  let _0x426205 = null;
  let _0x4c75f2 = 0;
  for (const _0x3b182b of _0x2e4a59) {
    if (!_0x3b182b || _0x4a3979 && !_0x4a3979(_0x3b182b)) {
      continue;
    }
    let _0x28eff6;
    try {
      _0x28eff6 = _0x3b182b.getBoundingClientRect();
    } catch (_0x4b57a8) {
      continue;
    }
    if (!_0x28eff6 || _0x28eff6.width < 120 || _0x28eff6.height < 160) {
      continue;
    }
    const _0x1074ed = _0x28eff6.width * _0x28eff6.height;
    if (_0x1074ed > _0x4c75f2) {
      _0x426205 = _0x3b182b;
      _0x4c75f2 = _0x1074ed;
    }
  }
  return _0x426205;
}
function dispatchClientPointClick(_0x860c17, _0x5308ae, _0x2b30a9) {
  const _0x5388ce = Math.round(_0x860c17);
  const _0x463ff5 = Math.round(_0x5308ae);
  let _0x49039f = null;
  try {
    _0x49039f = document.elementFromPoint(_0x5388ce, _0x463ff5);
  } catch (_0x129dad) {}
  if (!_0x49039f) {
    _0x49039f = _0x2b30a9;
  }
  if (!_0x49039f) {
    return false;
  }
  const _0x29bee7 = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: _0x5388ce,
    clientY: _0x463ff5,
    buttons: 1
  };
  try {
    _0x49039f.dispatchEvent(new PointerEvent("pointerdown", _0x29bee7));
    _0x49039f.dispatchEvent(new MouseEvent("mousedown", _0x29bee7));
    _0x49039f.dispatchEvent(new PointerEvent("pointerup", _0x29bee7));
    _0x49039f.dispatchEvent(new MouseEvent("mouseup", _0x29bee7));
    _0x49039f.dispatchEvent(new MouseEvent("click", _0x29bee7));
    return true;
  } catch (_0x5360e1) {
    try {
      if (_0x2b30a9?.click) {
        _0x2b30a9.click();
        return true;
      }
    } catch (_0x108c15) {}
  }
  return false;
}
async function dismissSharePanelByClickingVideo(_0x590488, _0x36a7ab = {}) {
  const {
    getDouyinFeedScope: _0x1c4b61,
    isVisibleElement: _0x1bfa37,
    sleep: _0x44865c,
    reportTraceLog: _0x5c74b8,
    reportCurrentAction: _0x2f5464,
    shouldAbort: _0x140c7f,
    resumeVisibleDouyinVideos: _0xf77e0e
  } = _0x36a7ab;
  if (_0x140c7f?.(_0x590488)) {
    return false;
  }
  const _0x350888 = _0x1c4b61?.() || document;
  const _0x3fcf27 = pickVisibleVideoSurface(_0x350888, _0x1bfa37);
  if (!_0x3fcf27) {
    _0x5c74b8?.("养号：未找到视频画面，Esc 关闭分享面板", null, "warning");
    try {
      window.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Escape",
        keyCode: 27,
        bubbles: true
      }));
    } catch (_0x23e251) {}
    await _0x44865c?.(350);
    try {
      _0xf77e0e?.(_0x350888, "养号：分享面板关闭后恢复播放");
    } catch (_0x336409) {}
    return false;
  }
  const _0x54fa83 = _0x3fcf27.getBoundingClientRect();
  const _0x1692c4 = 0.28 + Math.random() * 0.34;
  const _0x1a8d6c = 0.3 + Math.random() * 0.28;
  const _0xc7f9a3 = _0x54fa83.left + _0x54fa83.width * _0x1692c4;
  const _0x43a8d3 = _0x54fa83.top + _0x54fa83.height * _0x1a8d6c;
  _0x2f5464?.("养号：点击视频关闭分享面板…");
  _0x5c74b8?.("🖱 养号：点击视频区域关闭分享面板并继续播放（" + Math.round(_0xc7f9a3) + "," + Math.round(_0x43a8d3) + "）");
  dispatchClientPointClick(_0xc7f9a3, _0x43a8d3, _0x3fcf27);
  await _0x44865c?.(450);
  try {
    _0xf77e0e?.(_0x350888, "养号：复制链接后确保继续播放");
  } catch (_0x25c644) {}
  return true;
}
async function nurtureShareCopyLinkCurrentVideo(_0x448d32, _0x32654b = {}, _0x573ce5 = {}) {
  const {
    simulateHumanClick: _0x2afa62,
    randomDelay: _0x201e71,
    reportTraceLog: _0x3771d2,
    reportCurrentAction: _0x5b54df,
    isVisibleElement: _0x1e63a4,
    sleep: _0xeff7ab,
    shouldAbort: _0x3dee6f
  } = _0x32654b;
  const _0xdf96b5 = resolveVideoEngagePack(_0x32654b);
  const _0x5f3a6c = await findShareSideActionButton(_0x448d32, _0x32654b);
  if (!_0x5f3a6c || typeof _0x2afa62 !== "function") {
    _0x3771d2?.("养号：未找到分享/转发按钮，跳过复制链接", null, "warning");
    return false;
  }
  _0x5b54df?.("养号：点击转发，等待分享面板…");
  _0x3771d2?.("↗️ 养号：已点击转发按钮，等待 2~3 秒后点「复制链接」");
  await _0x2afa62(_0x5f3a6c, _0x448d32);
  await _0x201e71?.(2200, 3200, _0x448d32, "等待分享面板就绪");
  if (_0x3dee6f?.(_0x448d32)) {
    return false;
  }
  let _0x1b847e = findSharePanelCopyLinkButton(_0x1e63a4, _0xdf96b5);
  const _0x4ea92d = Date.now() + 4000;
  while (!_0x1b847e && Date.now() < _0x4ea92d && !_0x3dee6f?.(_0x448d32)) {
    await (_0xeff7ab?.(160) || Promise.resolve());
    _0x1b847e = findSharePanelCopyLinkButton(_0x1e63a4, _0xdf96b5);
  }
  if (!_0x1b847e) {
    _0x3771d2?.("养号：分享面板未找到「复制链接」，关闭面板", null, "warning");
    try {
      _0x573ce5.releasePauseBeforeDismiss?.();
    } catch (_0xd3f62c) {}
    await dismissSharePanelByClickingVideo(_0x448d32, _0x32654b);
    return false;
  }
  _0x5b54df?.("养号：点击复制链接…");
  await _0x2afa62(_0x1b847e, _0x448d32);
  await _0x201e71?.(600, 1100, _0x448d32, "复制链接后");
  _0x3771d2?.("🔗 养号：已点击「复制链接」（转发）");
  try {
    _0x573ce5.releasePauseBeforeDismiss?.();
  } catch (_0x5df926) {}
  await dismissSharePanelByClickingVideo(_0x448d32, _0x32654b);
  return true;
}
function startEngagePauseLock(_0x1cc52f = {}, _0x14758d) {
  const _0x1989f6 = _0x1cc52f.getDouyinFeedScope?.() || document;
  try {
    _0x1cc52f.pauseVisibleDouyinVideos?.(_0x1989f6, "养号互动期间暂停，防止自动切下一条");
  } catch (_0x58e766) {}
  let _0x3f4490 = null;
  try {
    if (typeof _0x1cc52f.startCurrentVideoPauseGuard === "function") {
      _0x3f4490 = _0x1cc52f.startCurrentVideoPauseGuard({
        scope: _0x1989f6
      }, _0x14758d, {
        pauseOnly: true,
        intervalMs: 120
      });
    }
  } catch (_0x5182d6) {}
  let _0x5c21ef = false;
  return {
    stop({
      resume = true
    } = {}) {
      if (_0x5c21ef) {
        return;
      }
      _0x5c21ef = true;
      try {
        _0x3f4490?.stop?.();
      } catch (_0x8c87f3) {}
      if (!resume) {
        return;
      }
      try {
        _0x1cc52f.resumeVisibleDouyinVideos?.(_0x1989f6, "养号互动结束，恢复播放");
      } catch (_0x3a089b) {}
    }
  };
}
async function nurtureEngageCurrentVideo(_0x1f8b33, _0x4cfceb = {}, _0x34dbe9 = {}) {
  const {
    shouldAbort: _0x263480,
    randomDelay: _0x1ffd92,
    reportNurtureProgress: _0xb71dde,
    reportTraceLog: _0xde93b5,
    getVisibleDouyinVideoDurationMs: _0x738749,
    getDouyinFeedScope: _0x1fc499
  } = _0x34dbe9;
  if (_0x263480?.(_0x1f8b33)) {
    return {
      liked: false,
      collected: false,
      shared: false
    };
  }
  const _0x5bd824 = (_0x599ff6, _0x7331de) => {
    const _0x321d26 = Number(_0x599ff6);
    if (!Number.isFinite(_0x321d26)) {
      return _0x7331de;
    }
    return Math.max(0, Math.min(100, Math.round(_0x321d26)));
  };
  const _0x3e58b4 = _0x4cfceb.currentTask || {};
  const _0x746da2 = _0x5bd824(_0x4cfceb.nurtureLikePercent ?? _0x3e58b4.nurtureLikePercent, NURTURE_ENGAGE_LIKE_PERCENT);
  const _0xc07da0 = _0x5bd824(_0x4cfceb.nurtureCollectPercent ?? _0x3e58b4.nurtureCollectPercent, NURTURE_ENGAGE_COLLECT_PERCENT);
  const _0x20674f = _0x5bd824(_0x4cfceb.nurtureSharePercent ?? _0x3e58b4.nurtureSharePercent, NURTURE_ENGAGE_SHARE_PERCENT);
  const _0xdcacc6 = _0x1fc499?.() || document;
  const _0x3307e7 = Number(_0x738749?.(_0xdcacc6) || 0) || 0;
  if (_0x3307e7 > 0) {
    _0xde93b5?.("⏱ 养号：当前视频时长约 " + (_0x3307e7 / 1000).toFixed(1) + " 秒，互动前暂停防切条");
  }
  _0xb71dde?.(_0x4cfceb, _0x1f8b33, "养号：执行点赞/收藏/转发…", "🖐 养号：互动验收（赞" + _0x746da2 + "% / 藏" + _0xc07da0 + "% / 转" + _0x20674f + "%）");
  const _0x428313 = startEngagePauseLock(_0x34dbe9, _0x1f8b33);
  const _0x485c95 = {
    liked: false,
    collected: false,
    shared: false
  };
  try {
    if (rollPercent(_0x746da2) && !_0x263480?.(_0x1f8b33)) {
      _0x485c95.liked = await nurtureLikeCurrentVideo(_0x1f8b33, _0x34dbe9);
      if (_0x485c95.liked) {
        _0x4cfceb.likeActions = (_0x4cfceb.likeActions || 0) + 1;
      }
      await _0x1ffd92?.(500, 1100, _0x1f8b33, "点赞后间隔");
    }
    if (rollPercent(_0xc07da0) && !_0x263480?.(_0x1f8b33)) {
      _0x485c95.collected = await nurtureCollectCurrentVideo(_0x1f8b33, _0x34dbe9);
      if (_0x485c95.collected) {
        _0x4cfceb.collectActions = (_0x4cfceb.collectActions || 0) + 1;
      }
      await _0x1ffd92?.(500, 1100, _0x1f8b33, "收藏后间隔");
    }
    if (rollPercent(_0x20674f) && !_0x263480?.(_0x1f8b33)) {
      _0x485c95.shared = await nurtureShareCopyLinkCurrentVideo(_0x1f8b33, _0x34dbe9, {
        releasePauseBeforeDismiss: () => _0x428313.stop({
          resume: false
        })
      });
      if (_0x485c95.shared) {
        _0x4cfceb.shareActions = (_0x4cfceb.shareActions || 0) + 1;
      }
      await _0x1ffd92?.(500, 1000, _0x1f8b33, "转发后间隔");
    }
  } finally {
    _0x428313.stop();
  }
  _0xde93b5?.("🖐 养号互动结果：赞=" + (_0x485c95.liked ? "是" : "否") + " 藏=" + (_0x485c95.collected ? "是" : "否") + " 转=" + (_0x485c95.shared ? "是" : "否"));
  return _0x485c95;
}
function resolveNurtureEngageAfterMs(_0x420edc, _0x5f6998) {
  const _0x213c18 = 14000;
  const _0x493e39 = Number(_0x420edc) || 0;
  const _0x1e7014 = Number(_0x5f6998) || 8000;
  if (_0x493e39 > 0) {
    if (_0x493e39 <= 12000) {
      return Math.min(1500, Math.max(800, _0x493e39 - _0x213c18));
    }
    return Math.max(1500, Math.min(5500, _0x493e39 - _0x213c18));
  }
  return Math.min(5000, Math.max(2000, Math.floor(_0x1e7014 * 0.2)));
}
module.exports = {
  NURTURE_ENGAGE_LIKE_PERCENT: NURTURE_ENGAGE_LIKE_PERCENT,
  NURTURE_ENGAGE_COLLECT_PERCENT: NURTURE_ENGAGE_COLLECT_PERCENT,
  NURTURE_ENGAGE_SHARE_PERCENT: NURTURE_ENGAGE_SHARE_PERCENT,
  nurtureEngageCurrentVideo: nurtureEngageCurrentVideo,
  nurtureLikeCurrentVideo: nurtureLikeCurrentVideo,
  nurtureCollectCurrentVideo: nurtureCollectCurrentVideo,
  nurtureShareCopyLinkCurrentVideo: nurtureShareCopyLinkCurrentVideo,
  dismissSharePanelByClickingVideo: dismissSharePanelByClickingVideo,
  findSharePanelCopyLinkButton: findSharePanelCopyLinkButton,
  pickVisibleVideoSurface: pickVisibleVideoSurface,
  resolveNurtureEngageAfterMs: resolveNurtureEngageAfterMs,
  rollPercent: rollPercent
};
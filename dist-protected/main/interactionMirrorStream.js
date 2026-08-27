'use strict';

const INTERACTION_MIRROR_CAPTURE_INTERVAL_MS = 360;
const INTERACTION_MIRROR_WIDTH = 640;
const INTERACTION_MIRROR_JPEG_QUALITY = 58;
function isAliveView(_0x327dc8) {
  return !!_0x327dc8?.webContents && !_0x327dc8.webContents.isDestroyed?.() && typeof _0x327dc8.webContents.capturePage === "function";
}
function listEligibleInteractionMirrorKeys({
  interactionLocksMap: _0x5f646a,
  interactionViewsMap: _0x322853,
  automationViewsVisible: _0x46a98a,
  visibleAutomationViewKeys: _0x2549c2
} = {}) {
  if (!_0x46a98a) {
    return [];
  }
  const _0x3512a0 = _0x2549c2 instanceof Set ? _0x2549c2 : null;
  const _0x42e2ff = [];
  for (const [_0x565540, _0x46e575] of _0x5f646a?.entries?.() || []) {
    if (!_0x46e575?.requireStableViewport) {
      continue;
    }
    if (_0x3512a0 && !_0x3512a0.has(_0x565540)) {
      continue;
    }
    if (!isAliveView(_0x322853?.get?.(_0x565540))) {
      continue;
    }
    _0x42e2ff.push(String(_0x565540));
  }
  return _0x42e2ff.sort();
}
function createInteractionMirrorStream(_0x6a92ee = {}) {
  const {
    getMainWindow: _0x2652e3,
    getInteractionLocksMap: _0x3ef745,
    getInteractionViewsMap: _0x2ad3e,
    getAutomationViewsVisible: _0x496081,
    getVisibleAutomationViewKeys: _0x5dddcf,
    captureIntervalMs = INTERACTION_MIRROR_CAPTURE_INTERVAL_MS,
    mirrorWidth = INTERACTION_MIRROR_WIDTH,
    jpegQuality = INTERACTION_MIRROR_JPEG_QUALITY
  } = _0x6a92ee;
  let _0x101813 = new Set();
  let _0xba9877 = null;
  let _0x3cfbc6 = false;
  let _0x4d519b = false;
  let _0x3388e5 = 0;
  let _0x3f9e15 = 0;
  let _0x32af8a = "";
  const _0x30b36e = new Map();
  function _0x2a0244(_0x24559b, _0xf44e93) {
    const _0x2ceb39 = _0x2652e3?.();
    if (!_0x2ceb39 || _0x2ceb39.isDestroyed?.() || _0x2ceb39.webContents?.isDestroyed?.()) {
      return false;
    }
    try {
      _0x2ceb39.webContents.send(_0x24559b, _0xf44e93);
      return true;
    } catch (_0x37b01b) {
      return false;
    }
  }
  function _0x2f067c() {
    return listEligibleInteractionMirrorKeys({
      interactionLocksMap: _0x3ef745?.(),
      interactionViewsMap: _0x2ad3e?.(),
      automationViewsVisible: !!_0x496081?.(),
      visibleAutomationViewKeys: _0x5dddcf?.()
    });
  }
  function _0x1d25b0() {
    const _0x5be348 = _0x2f067c();
    const _0x2af556 = new Set(_0x5be348);
    for (const _0x9b2dca of _0x101813) {
      if (!_0x2af556.has(_0x9b2dca)) {
        _0x2a0244("automation-interaction-mirror-state", {
          viewKey: _0x9b2dca,
          active: false
        });
      }
    }
    for (const _0xe80520 of _0x2af556) {
      if (!_0x101813.has(_0xe80520)) {
        _0x2a0244("automation-interaction-mirror-state", {
          viewKey: _0xe80520,
          active: true,
          mode: "first-comment-large-native",
          sourceWidth: 1200,
          sourceHeight: 800
        });
      }
    }
    _0x101813 = _0x2af556;
    if (_0x3388e5 >= _0x5be348.length) {
      _0x3388e5 = 0;
    }
    return _0x5be348;
  }
  function _0x4b8f0c() {
    if (!_0xba9877) {
      return;
    }
    clearTimeout(_0xba9877);
    _0xba9877 = null;
  }
  function _0xe7793(_0x55d714 = captureIntervalMs) {
    if (_0x4d519b || _0xba9877 || _0x3cfbc6 || _0x101813.size === 0) {
      return;
    }
    _0xba9877 = setTimeout(() => {
      _0xba9877 = null;
      _0x232491();
    }, Math.max(0, Number(_0x55d714) || 0));
    if (typeof _0xba9877.unref === "function") {
      _0xba9877.unref();
    }
  }
  function _0x2e8b45(_0x3fa02e) {
    if (!_0x496081?.()) {
      return false;
    }
    const _0x4c2bb1 = _0x5dddcf?.();
    if (_0x4c2bb1 instanceof Set && !_0x4c2bb1.has(_0x3fa02e)) {
      return false;
    }
    const _0x2ecfcd = _0x3ef745?.().get?.(_0x3fa02e);
    return !!_0x2ecfcd?.requireStableViewport && !!isAliveView(_0x2ad3e?.().get?.(_0x3fa02e));
  }
  async function _0x232491() {
    if (_0x4d519b || _0x3cfbc6) {
      return;
    }
    _0x3cfbc6 = true;
    try {
      const _0xca778c = _0x1d25b0();
      if (!_0xca778c.length) {
        return;
      }
      const _0x794650 = _0xca778c[_0x3388e5 % _0xca778c.length];
      _0x32af8a = _0x794650;
      _0x3388e5 = (_0x3388e5 + 1) % _0xca778c.length;
      const _0x3065e2 = _0x2ad3e?.().get?.(_0x794650);
      if (!isAliveView(_0x3065e2)) {
        return;
      }
      const _0x9eef36 = await _0x3065e2.webContents.capturePage();
      if (!_0x2e8b45(_0x794650) || !_0x9eef36 || _0x9eef36.isEmpty?.()) {
        return;
      }
      const _0x2da7ff = _0x9eef36.getSize?.() || {
        width: 1200,
        height: 800
      };
      const _0x2d17e6 = Math.max(240, Math.min(Number(mirrorWidth) || INTERACTION_MIRROR_WIDTH, _0x2da7ff.width || 1200));
      const _0x1844c6 = _0x2da7ff.width > _0x2d17e6 ? _0x9eef36.resize({
        width: _0x2d17e6,
        quality: "good"
      }) : _0x9eef36;
      const _0x1a7d78 = _0x1844c6.getSize?.() || _0x2da7ff;
      const _0x4aee2e = _0x1844c6.toJPEG(Math.max(30, Math.min(85, Number(jpegQuality) || INTERACTION_MIRROR_JPEG_QUALITY)));
      if (!_0x4aee2e?.length || !_0x2e8b45(_0x794650)) {
        return;
      }
      _0x3f9e15 += 1;
      _0x2a0244("automation-interaction-mirror-frame", {
        viewKey: _0x794650,
        sequence: _0x3f9e15,
        capturedAt: Date.now(),
        width: Number(_0x1a7d78.width) || _0x2d17e6,
        height: Number(_0x1a7d78.height) || 0,
        jpeg: _0x4aee2e
      });
    } catch (_0x66cb70) {
      const _0x5adfb4 = _0x32af8a || "unknown";
      const _0x504572 = Date.now();
      if (_0x504572 - Number(_0x30b36e.get(_0x5adfb4) || 0) > 10000) {
        _0x30b36e.set(_0x5adfb4, _0x504572);
        console.warn("[Mirror] 互动页镜像捕获失败 " + _0x5adfb4 + ": " + (_0x66cb70?.message || _0x66cb70));
      }
    } finally {
      _0x32af8a = "";
      _0x3cfbc6 = false;
      if (!_0x4d519b) {
        _0x1d25b0();
        _0xe7793(captureIntervalMs);
      }
    }
  }
  function _0x2e2d66({
    immediate = true
  } = {}) {
    if (_0x4d519b) {
      return [];
    }
    const _0x5dc608 = _0x1d25b0();
    if (!_0x5dc608.length) {
      _0x4b8f0c();
      return _0x5dc608;
    }
    _0xe7793(immediate ? 0 : captureIntervalMs);
    return _0x5dc608;
  }
  function _0x35e2c3() {
    if (_0x4d519b) {
      return;
    }
    _0x4d519b = true;
    _0x4b8f0c();
    for (const _0x3329d2 of _0x101813) {
      _0x2a0244("automation-interaction-mirror-state", {
        viewKey: _0x3329d2,
        active: false
      });
    }
    _0x101813.clear();
    _0x30b36e.clear();
  }
  return {
    refresh: _0x2e2d66,
    dispose: _0x35e2c3,
    getActiveKeys: () => [..._0x101813]
  };
}
module.exports = {
  INTERACTION_MIRROR_CAPTURE_INTERVAL_MS: INTERACTION_MIRROR_CAPTURE_INTERVAL_MS,
  INTERACTION_MIRROR_WIDTH: INTERACTION_MIRROR_WIDTH,
  INTERACTION_MIRROR_JPEG_QUALITY: INTERACTION_MIRROR_JPEG_QUALITY,
  listEligibleInteractionMirrorKeys: listEligibleInteractionMirrorKeys,
  createInteractionMirrorStream: createInteractionMirrorStream
};
'use strict';

const {
  waitForInteractionViewVisualReady
} = require("./interactionViewVisualReady");
function createAutomationViewportSession(_0x4c1c3a = {}) {
  const {
    getPlatformViews: _0x2ea50c,
    getInteractionViewsMap: _0x5c4946,
    getInteractionLocksMap: _0x43b9ff,
    resolveInteractionViewportBounds: _0x39584a,
    restoreVisibleInteractionStack: _0x1c326a,
    shouldAttachAutomationView: _0x2a12fb,
    attachAutomationViewToBackgroundHost: _0x209c74,
    finishInteraction: _0x38c9c8,
    destroyIdleInteractionView: _0x282a9c
  } = _0x4c1c3a;
  function _0x3c398c(_0x27d4d9, _0x4c7375) {
    if (!_0x27d4d9 || !_0x4c7375) {
      return null;
    }
    _0x5c4946().set(_0x27d4d9, _0x4c7375);
    return _0x4c7375;
  }
  function _0x3a7bfa(_0x2a464c, {
    timeoutMs = 240000,
    onTimeout = null
  } = {}) {
    const _0x5088b3 = _0x2ea50c().get(_0x2a464c);
    const _0x3cec0d = _0x5c4946().get(_0x2a464c);
    if (!_0x5088b3 || !_0x3cec0d || _0x3cec0d.webContents?.isDestroyed?.()) {
      return {
        started: false,
        interactionId: "",
        reason: "view_unavailable"
      };
    }
    const _0x32ed1e = _0x43b9ff();
    const _0x2508c6 = _0x32ed1e.get(_0x2a464c);
    if (_0x2508c6?.timer) {
      clearTimeout(_0x2508c6.timer);
    }
    const _0x4a1cba = _0x39584a(_0x2a464c, _0x5088b3, _0x3cec0d, _0x2508c6);
    if (!_0x4a1cba || Number(_0x4a1cba.width) <= 50 || Number(_0x4a1cba.height) <= 50) {
      return {
        started: false,
        interactionId: "",
        reason: "invalid_bounds"
      };
    }
    const _0x45c7fe = Date.now() + "_" + Math.random().toString(36).slice(2);
    const _0x224858 = {
      bounds: {
        ..._0x4a1cba
      },
      zoomFactor: Number(_0x5088b3.webContents?.getZoomFactor?.()) || 1,
      previewBounds: {
        ..._0x4a1cba
      },
      previewZoomFactor: Number(_0x5088b3.webContents?.getZoomFactor?.()) || 1,
      startedAt: Date.now(),
      interactionId: _0x45c7fe,
      visibleSwapReady: false,
      timer: null,
      taskDispatchTimer: null,
      profileOpenTimer: null,
      loadListener: null,
      profileOpenReady: false
    };
    _0x224858.timer = setTimeout(() => {
      const _0x4a3f00 = _0x32ed1e.get(_0x2a464c);
      if (!_0x4a3f00 || _0x4a3f00.interactionId !== _0x45c7fe) {
        return;
      }
      if (typeof onTimeout === "function") {
        onTimeout({
          viewKey: _0x2a464c,
          interactionId: _0x45c7fe
        });
      }
    }, Math.max(1000, Number(timeoutMs) || 240000));
    _0x224858.timer.unref?.();
    _0x32ed1e.set(_0x2a464c, _0x224858);
    try {
      if (_0x2a12fb(_0x2a464c)) {
        const _0x46253e = _0x1c326a(_0x2a464c, "viewport-session-begin:" + _0x2a464c);
        if (!_0x46253e?.interactionStaged) {
          if (_0x224858.timer) {
            clearTimeout(_0x224858.timer);
          }
          _0x32ed1e.delete(_0x2a464c);
          return {
            started: false,
            interactionId: "",
            reason: "visible_stack_not_staged"
          };
        }
      } else {
        _0x209c74(_0x2a464c, _0x3cec0d, {
          active: false,
          force: true
        });
      }
    } catch (_0x16176c) {
      if (_0x224858.timer) {
        clearTimeout(_0x224858.timer);
      }
      _0x32ed1e.delete(_0x2a464c);
      return {
        started: false,
        interactionId: "",
        reason: "viewport_staging_failed",
        detail: _0x16176c?.message || String(_0x16176c || "")
      };
    }
    return {
      started: true,
      interactionId: _0x45c7fe,
      bounds: {
        ..._0x4a1cba
      }
    };
  }
  async function _0x1009b5(_0x1548b6, _0x545fd0, _0x37309c = 8000) {
    const _0xc36901 = _0x43b9ff();
    const _0x3555f3 = _0x5c4946().get(_0x1548b6);
    const _0x5562a2 = () => _0xc36901.get(_0x1548b6)?.interactionId === _0x545fd0;
    const _0x553b65 = await waitForInteractionViewVisualReady(_0x3555f3, _0x5562a2, _0x37309c);
    if (!_0x553b65.ready || !_0x5562a2()) {
      return _0x553b65;
    }
    const _0x3c46c5 = _0xc36901.get(_0x1548b6);
    _0x3c46c5.visibleSwapReady = true;
    _0x3c46c5.profileOpenReady = true;
    if (_0x2a12fb(_0x1548b6)) {
      const _0x25442d = _0x1c326a(_0x1548b6, "viewport-session-ready:" + _0x1548b6);
      if (!_0x25442d.interactionVisible) {
        return {
          ..._0x553b65,
          ready: false,
          reason: "visible_stack_not_restored"
        };
      }
    }
    return _0x553b65;
  }
  function _0x2dacbc(_0x1ff217, {
    interactionId = "",
    results = {},
    reason = "done",
    destroySubview = false
  } = {}) {
    const _0x3f434b = _0x43b9ff().get(_0x1ff217);
    if (interactionId && _0x3f434b && _0x3f434b.interactionId !== interactionId) {
      return false;
    }
    if (!_0x3f434b && interactionId) {
      return false;
    }
    const _0x2b8a89 = _0x38c9c8(_0x1ff217, results, reason, {
      notifyMainView: false,
      preferLatestBounds: true,
      skipIdleCleanup: destroySubview
    });
    let _0x986288 = false;
    if (destroySubview) {
      _0x986288 = _0x282a9c(_0x1ff217, _0x5c4946().get(_0x1ff217), reason);
    }
    return _0x2b8a89 !== false || _0x986288;
  }
  function _0x573911(_0x4e33eb, _0x547ca0 = "destroy") {
    const _0x20dcb9 = _0x43b9ff().get(_0x4e33eb);
    if (_0x20dcb9) {
      _0x38c9c8(_0x4e33eb, {}, _0x547ca0, {
        notifyMainView: false,
        preferLatestBounds: true,
        skipIdleCleanup: true
      });
    }
    return _0x282a9c(_0x4e33eb, _0x5c4946().get(_0x4e33eb), _0x547ca0);
  }
  return {
    registerInteractionSubview: _0x3c398c,
    beginViewportSession: _0x3a7bfa,
    revealViewportSession: _0x1009b5,
    endViewportSession: _0x2dacbc,
    destroyViewportSubview: _0x573911
  };
}
module.exports = {
  createAutomationViewportSession: createAutomationViewportSession
};
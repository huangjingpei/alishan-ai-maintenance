'use strict';

function createAutomationLiveViewLifecycle(_0x3275a5 = {}) {
  const {
    getPlatformViews: _0x5df713,
    getViewSettingsMap: _0x11a7f7,
    getBoundsStateByViewKey: _0x4900ed,
    shouldAttachAutomationView: _0x2a1997,
    cancelPendingAutomationViewDestroy: _0x1c007c,
    recoverMainAutomationView: _0x223491,
    attachMainAutomationView: _0x160b8c,
    preserveAutomationViewAfterTaskFinish: _0x301f96,
    nudgeAutomationViewRepaint: _0xe1d1d4,
    ensureAutomationPaintWatchdog: _0x2581be,
    requestAutomationLayoutRefresh: _0x1fab45,
    ensureBackgroundAutomationLayout: _0x187964,
    releaseBackgroundAutomationLayout: _0x1cd160,
    acquireEntityExecutionViewportLease: _0x5c5418,
    releaseEntityExecutionViewportLease: _0x494a59
  } = _0x3275a5;
  const _0x5d28be = new Map();
  const _0x50e2a2 = new Map();
  function _0x75f08e(_0x1882fa, _0x5222b9 = null) {
    if (String(_0x1882fa || "").startsWith("entity_") && typeof _0x494a59 === "function") {
      return _0x494a59(_0x1882fa, {
        taskGeneration: _0x5222b9?.generation ?? null
      });
    }
    return _0x1cd160?.(_0x1882fa);
  }
  function _0x4b6351(_0x532a60) {
    const _0x1bf147 = Number(_0x5d28be.get(_0x532a60) || 0) + 1;
    _0x5d28be.set(_0x532a60, _0x1bf147);
    return _0x1bf147;
  }
  function _0xa03b63(_0x1f62e1, _0x3ebe7f) {
    return _0x5d28be.get(_0x1f62e1) === _0x3ebe7f;
  }
  function _0x3820fe(_0x4e2096, _0x14d341 = {}) {
    const _0xf6c777 = _0x5df713?.()?.get?.(_0x4e2096);
    if (!_0xf6c777 || _0xf6c777.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        generation: _0x4b6351(_0x4e2096),
        reason: "view_unavailable"
      };
    }
    const _0x218ab8 = _0x11a7f7?.();
    const _0xc191 = _0x218ab8?.get?.(_0x4e2096);
    const _0x3524c4 = String(_0x14d341.runtimeTaskId || _0x14d341.taskId || "");
    const _0x34400d = String(_0xc191?.runtimeTaskId || _0xc191?.taskId || "");
    if (_0xc191 && !_0xc191.finishedAt && _0x3524c4 && _0x3524c4 === _0x34400d && _0x5d28be.has(_0x4e2096)) {
      _0x59be60(_0x4e2096);
      return {
        ok: true,
        generation: _0x5d28be.get(_0x4e2096),
        reused: true
      };
    }
    if (_0x50e2a2.has(_0x4e2096)) {
      const _0x464c6c = _0x50e2a2.get(_0x4e2096);
      _0x50e2a2.delete(_0x4e2096);
      try {
        _0x75f08e(_0x4e2096, _0x464c6c);
      } catch (_0x3fdcc8) {}
    }
    const _0x6dd8e4 = _0x4b6351(_0x4e2096);
    _0x1c007c?.(_0x4e2096);
    if (_0x218ab8) {
      const _0x414f21 = {
        ...(_0xc191 && typeof _0xc191 === "object" ? _0xc191 : {}),
        ..._0x14d341,
        startedAt: Date.now(),
        liveViewGeneration: _0x6dd8e4
      };
      delete _0x414f21.finishedAt;
      _0x218ab8.set(_0x4e2096, _0x414f21);
    }
    _0x2581be?.();
    const _0x59716d = _0x4900ed?.()?.get?.(_0x4e2096)?.bounds || null;
    if (_0x2a1997?.(_0x4e2096)) {
      _0x223491?.(_0x4e2096, _0x59716d, {
        force: true
      });
    } else {
      _0x160b8c?.(_0x4e2096);
    }
    try {
      _0xe1d1d4?.(_0xf6c777.webContents, _0xf6c777);
    } catch (_0x11373d) {}
    _0x1fab45?.();
    return {
      ok: true,
      generation: _0x6dd8e4
    };
  }
  function _0x59be60(_0x3cae7f) {
    const _0x3027cc = _0x5df713?.()?.get?.(_0x3cae7f);
    if (!_0x3027cc || _0x3027cc.webContents?.isDestroyed?.()) {
      return false;
    }
    _0x2581be?.();
    try {
      _0x3027cc.webContents.setBackgroundThrottling?.(false);
      _0x3027cc.webContents.setFrameRate?.(30);
      _0x3027cc.webContents.invalidate?.();
    } catch (_0x509292) {}
    return true;
  }
  function _0x25c4e5(_0x5b9ace, {
    reason = "completed",
    settingsSnapshot = null,
    skipHeavyRepaint = false
  } = {}) {
    const _0x555ce7 = _0x50e2a2.get(_0x5b9ace);
    _0x4b6351(_0x5b9ace);
    _0x50e2a2.delete(_0x5b9ace);
    try {
      _0x75f08e(_0x5b9ace, _0x555ce7);
    } catch (_0x1bf629) {}
    const _0x36b783 = _0x11a7f7?.();
    if (_0x36b783) {
      _0x36b783.delete(_0x5b9ace);
    }
    const _0x3ae265 = _0x301f96?.(_0x5b9ace, reason, {
      settingsSnapshot: settingsSnapshot,
      skipHeavyRepaint: skipHeavyRepaint
    });
    _0x1fab45?.();
    return _0x3ae265 !== false;
  }
  function _0x2e8bdd(_0x551ac8) {
    if (_0x50e2a2.has(_0x551ac8)) {
      const _0x5e40e0 = _0x50e2a2.get(_0x551ac8);
      _0x50e2a2.delete(_0x551ac8);
      try {
        _0x75f08e(_0x551ac8, _0x5e40e0);
      } catch (_0x5ba02c) {}
    }
    return _0x4b6351(_0x551ac8);
  }
  async function _0x50e0ea(_0x158f8e, {
    runtimeTaskId = ""
  } = {}) {
    const _0x3adc55 = Number(_0x5d28be.get(_0x158f8e) || 0);
    const _0x541619 = _0x5df713?.()?.get?.(_0x158f8e);
    if (!_0x3adc55 || !_0x541619 || _0x541619.webContents?.isDestroyed?.()) {
      return {
        ok: false,
        reason: "view_unavailable",
        generation: _0x3adc55
      };
    }
    const _0x13f3bf = {
      generation: _0x3adc55,
      runtimeTaskId: String(runtimeTaskId || ""),
      acquiredAt: Date.now()
    };
    _0x50e2a2.set(_0x158f8e, _0x13f3bf);
    const _0x243beb = String(_0x158f8e || "").startsWith("entity_") && typeof _0x5c5418 === "function" ? await _0x5c5418(_0x158f8e, {
      taskGeneration: _0x3adc55,
      runtimeTaskId: String(runtimeTaskId || "")
    }) : await _0x187964?.(_0x158f8e);
    const _0x199534 = _0x50e2a2.get(_0x158f8e);
    if (!_0x199534 || _0x199534.generation !== _0x3adc55 || !_0xa03b63(_0x158f8e, _0x3adc55) || _0x5df713?.()?.get?.(_0x158f8e) !== _0x541619) {
      return {
        ok: false,
        reason: "stale_execution_viewport",
        generation: _0x3adc55
      };
    }
    if (_0x243beb && _0x243beb.ok === false) {
      _0x50e2a2.delete(_0x158f8e);
      return {
        ..._0x243beb,
        generation: _0x3adc55
      };
    }
    return {
      ok: true,
      generation: _0x3adc55,
      layout: _0x243beb || null
    };
  }
  function _0x553416(_0x13890b, {
    generation = null
  } = {}) {
    const _0x4f712f = _0x50e2a2.get(_0x13890b);
    if (!_0x4f712f) {
      return {
        ok: true,
        skipped: true
      };
    }
    if (generation != null && Number(generation) !== Number(_0x4f712f.generation)) {
      return {
        ok: false,
        reason: "stale_execution_viewport_release"
      };
    }
    _0x50e2a2.delete(_0x13890b);
    const _0x34cd74 = _0x75f08e(_0x13890b, _0x4f712f);
    return {
      ok: _0x34cd74 !== false && _0x34cd74?.ok !== false,
      release: _0x34cd74 || null
    };
  }
  return {
    beginTask: _0x3820fe,
    wake: _0x59be60,
    finishTask: _0x25c4e5,
    invalidate: _0x2e8bdd,
    acquireExecutionViewport: _0x50e0ea,
    releaseExecutionViewport: _0x553416,
    hasExecutionViewport: _0x2fe91e => _0x50e2a2.has(_0x2fe91e),
    isCurrent: _0xa03b63,
    getGeneration: _0x1c6b21 => Number(_0x5d28be.get(_0x1c6b21) || 0)
  };
}
module.exports = {
  createAutomationLiveViewLifecycle: createAutomationLiveViewLifecycle
};
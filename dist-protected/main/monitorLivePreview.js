'use strict';

const {
  buildMonitorViewKey
} = require("./monitorAutomationViewHost");
function createMonitorLivePreviewController(_0x19c4a1 = {}) {
  const {
    getMainWindow: _0x4f6109,
    getPlatformViews: _0x3efb18,
    getViewSettingsMap: _0x3f2c1b,
    getActiveTasks: _0x181da6,
    getMonitorWindows: _0x184315,
    automationLiveViewLifecycle: _0x2f39c1
  } = _0x19c4a1;
  let _0x5bc436 = null;
  function _0x5e5c1f(_0x4f8932 = null) {
    const _0x1e0e6f = new Set();
    const _0x440fca = _0x181da6?.() || new Map();
    const _0x486695 = _0x4f8932 != null && _0x4f8932 !== "" ? [[String(_0x4f8932), _0x440fca.get(String(_0x4f8932))]].filter(([, _0x41e11d]) => _0x41e11d) : [..._0x440fca.entries()];
    for (const [, _0x3d2587] of _0x486695) {
      const _0x151696 = Array.isArray(_0x3d2587?.accounts) ? _0x3d2587.accounts : [];
      for (const _0x14020e of _0x151696) {
        const _0x2c8b42 = String(_0x14020e?.id || _0x14020e?.accountId || "").trim();
        if (_0x2c8b42) {
          _0x1e0e6f.add(_0x2c8b42);
        }
      }
    }
    return _0x1e0e6f;
  }
  function _0x3ed79a({
    taskId = null,
    accountId = null
  } = {}) {
    let _0x5f0827;
    if (accountId != null && accountId !== "") {
      _0x5f0827 = [String(accountId)];
    } else {
      const _0x29b6d0 = _0x5e5c1f(taskId);
      _0x5f0827 = _0x29b6d0.size ? [..._0x29b6d0] : [];
    }
    const _0x33148f = _0x184315?.() || new Map();
    const _0x29ddea = _0x3efb18?.() || new Map();
    const _0x4d6b9e = [];
    _0x5f0827.forEach(_0x55100e => {
      const _0x2b0880 = _0x33148f.get(String(_0x55100e));
      if (!_0x2b0880 || _0x2b0880.isDestroyed?.()) {
        return;
      }
      const _0x5725f9 = _0x2b0880.__radarMonitorViewKey || buildMonitorViewKey(_0x55100e);
      const _0x582048 = _0x29ddea.get?.(_0x5725f9);
      if (!_0x582048 || _0x582048.webContents?.isDestroyed?.()) {
        return;
      }
      _0x4d6b9e.push(_0x5725f9);
    });
    return _0x4d6b9e;
  }
  function _0x1da908({
    taskId = null,
    accountId = null
  } = {}) {
    const _0x79dbc6 = taskId != null && taskId !== "" ? String(taskId) : null;
    const _0x431f40 = _0x181da6?.() || new Map();
    if (_0x79dbc6 && !_0x431f40.has(_0x79dbc6)) {
      return {
        success: false,
        shown: 0,
        error: "任务未在运行"
      };
    }
    const _0x20037b = _0x3ed79a({
      taskId: _0x79dbc6,
      accountId: accountId
    });
    if (!_0x20037b.length) {
      return {
        success: false,
        shown: 0,
        error: "暂无监控窗口可打开",
        viewKeys: []
      };
    }
    _0x5bc436 = {
      viewKeys: _0x20037b,
      taskId: _0x79dbc6,
      accountId: accountId != null ? String(accountId) : null,
      at: Date.now()
    };
    const _0x155a4e = _0x4f6109?.();
    try {
      if (_0x155a4e && !_0x155a4e.isDestroyed() && !_0x155a4e.webContents?.isDestroyed?.()) {
        _0x155a4e.webContents.send("video-monitor-open-live-preview", {
          viewKeys: _0x20037b,
          taskId: _0x79dbc6,
          accountId: accountId != null ? String(accountId) : null
        });
      }
    } catch (_0xf631ef) {}
    return {
      success: true,
      shown: _0x20037b.length,
      viewKeys: _0x20037b,
      livePreview: true
    };
  }
  function _0x20169a({
    taskId = null,
    accountId = null
  } = {}) {
    const _0xf8f0bc = _0x3ed79a({
      taskId: taskId,
      accountId: accountId
    });
    _0x5bc436 = null;
    const _0x173802 = _0x4f6109?.();
    try {
      if (_0x173802 && !_0x173802.isDestroyed() && !_0x173802.webContents?.isDestroyed?.()) {
        _0x173802.webContents.send("video-monitor-close-live-preview", {
          viewKeys: _0xf8f0bc,
          taskId: taskId != null ? String(taskId) : null,
          accountId: accountId != null ? String(accountId) : null
        });
      }
    } catch (_0x4c8671) {}
    return {
      success: true,
      hidden: _0xf8f0bc.length,
      viewKeys: _0xf8f0bc,
      livePreview: true
    };
  }
  function _0x1d77a7() {
    if (!_0x5bc436) {
      return null;
    }
    const _0x26225b = {
      ..._0x5bc436,
      viewKeys: Array.isArray(_0x5bc436.viewKeys) ? [..._0x5bc436.viewKeys] : []
    };
    _0x5bc436 = null;
    const _0x10ddb2 = _0x3efb18?.();
    const _0x111965 = _0x26225b.viewKeys.filter(_0x19e769 => {
      try {
        const _0x5c223b = _0x10ddb2?.get?.(_0x19e769);
        return !!_0x5c223b && !_0x5c223b.webContents?.isDestroyed?.();
      } catch (_0x4d813b) {
        return false;
      }
    });
    if (!_0x111965.length) {
      return null;
    }
    return {
      ..._0x26225b,
      viewKeys: _0x111965
    };
  }
  function _0x127d10() {
    _0x5bc436 = null;
  }
  function _0x1daad1(_0x1534e1 = null) {
    _0x5bc436 = null;
    const _0x248619 = _0x184315?.() || new Map();
    const _0x41ed31 = _0x1534e1 == null ? [..._0x248619.keys()].map(String) : (Array.isArray(_0x1534e1) ? _0x1534e1 : [_0x1534e1]).map(String).filter(Boolean);
    const _0x48a61f = [];
    const _0x3853b5 = _0x3efb18?.();
    _0x41ed31.forEach(_0x12ba74 => {
      const _0x565cd4 = _0x248619.get(String(_0x12ba74));
      if (!_0x565cd4 || _0x565cd4.isDestroyed?.()) {
        return;
      }
      const _0x3d9df5 = _0x565cd4.__radarMonitorViewKey || buildMonitorViewKey(_0x12ba74);
      _0x48a61f.push(_0x3d9df5);
      const _0x367ead = _0x3853b5?.get?.(_0x3d9df5) || null;
      if (!_0x367ead) {
        return;
      }
      try {
        const _0x225299 = typeof _0x3f2c1b === "function" ? _0x3f2c1b() : null;
        const _0x5d7d81 = _0x225299?.get?.(_0x3d9df5);
        _0x2f39c1?.finishTask?.(_0x3d9df5, {
          reason: "monitor-finished",
          settingsSnapshot: _0x5d7d81 && typeof _0x5d7d81 === "object" ? {
            ..._0x5d7d81
          } : null
        });
      } catch (_0x473717) {}
    });
    try {
      const _0x3a94d0 = _0x4f6109?.();
      if (_0x3a94d0 && !_0x3a94d0.isDestroyed() && !_0x3a94d0.webContents?.isDestroyed?.()) {
        _0x3a94d0.webContents.send("video-monitor-detach-live-preview", {
          viewKeys: _0x48a61f,
          accountIds: _0x1534e1 == null ? null : _0x41ed31
        });
      }
    } catch (_0x1f8cf4) {}
    return {
      viewKeys: _0x48a61f
    };
  }
  return {
    listActiveMonitorAccountIds: _0x5e5c1f,
    listMonitorLiveViewKeys: _0x3ed79a,
    showMonitorLivePreview: _0x1da908,
    hideMonitorLivePreview: _0x20169a,
    consumePendingLivePreview: _0x1d77a7,
    clearPendingLivePreview: _0x127d10,
    releaseMonitorLiveSurfaces: _0x1daad1
  };
}
module.exports = {
  createMonitorLivePreviewController: createMonitorLivePreviewController
};
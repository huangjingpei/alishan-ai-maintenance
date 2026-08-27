'use strict';

const KNOWN_PARTITIONS_KEY = "automation_cache_known_partitions_v1";
const CACHE_STATE_KEY = "automation_cache_cleanup_state_v1";
const DEFAULT_MAX_CACHE_BYTES = 524288000;
const DEFAULT_MAX_CACHE_AGE_MS = 604800000;
const DEFAULT_CHECK_INTERVAL_MS = 86400000;
const DEFAULT_IDLE_CHECK_DELAY_MS = 15000;
function createAutomationSessionCacheManager({
  sessionApi: _0x467486,
  getAllWebContents: _0x54bd61,
  store: _0x49d21d,
  appendDiagnosticsLog = () => {},
  maxCacheBytes = DEFAULT_MAX_CACHE_BYTES,
  maxCacheAgeMs = DEFAULT_MAX_CACHE_AGE_MS,
  checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS,
  idleCheckDelayMs = DEFAULT_IDLE_CHECK_DELAY_MS
} = {}) {
  const _0x4b6eda = new Map();
  const _0x58aeeb = new Map();
  const _0x27a74b = new Map();
  function _0x4c8711() {
    const _0x5bd823 = _0x49d21d?.get?.(KNOWN_PARTITIONS_KEY, []);
    return [...new Set((Array.isArray(_0x5bd823) ? _0x5bd823 : []).map(String).filter(Boolean))];
  }
  function _0x2b3a18(_0x2f8111) {
    const _0x35687e = _0x4c8711();
    if (_0x35687e.includes(_0x2f8111)) {
      return;
    }
    _0x35687e.push(_0x2f8111);
    _0x49d21d?.set?.(KNOWN_PARTITIONS_KEY, _0x35687e.slice(-100));
  }
  function _0xe8f59c() {
    const _0x1ff983 = _0x49d21d?.get?.(CACHE_STATE_KEY, {});
    if (_0x1ff983 && typeof _0x1ff983 === "object") {
      return _0x1ff983;
    } else {
      return {};
    }
  }
  function _0x471f02(_0x47a994, _0x8866ce) {
    const _0x24f80c = _0xe8f59c();
    _0x24f80c[_0x47a994] = {
      ...(_0x24f80c[_0x47a994] || {}),
      ..._0x8866ce
    };
    _0x49d21d?.set?.(CACHE_STATE_KEY, _0x24f80c);
  }
  function _0x4d7dc2(_0x386390, _0x598487 = null) {
    const _0x33e7c8 = String(_0x386390 || "").trim();
    if (!_0x33e7c8) {
      return "";
    }
    const _0x1494c2 = _0x33e7c8.startsWith("persist:automation:") ? _0x33e7c8 : "persist:automation:" + _0x33e7c8;
    if (_0x598487) {
      _0x4b6eda.set(_0x1494c2, _0x598487);
    }
    _0x2b3a18(_0x1494c2);
    const _0x4a7c9b = _0xe8f59c();
    if (!_0x4a7c9b[_0x1494c2]?.firstSeenAt) {
      _0x471f02(_0x1494c2, {
        firstSeenAt: Date.now()
      });
    }
    return _0x1494c2;
  }
  function _0x2b7ba0(_0x5bc5e9) {
    if (_0x4b6eda.has(_0x5bc5e9)) {
      return _0x4b6eda.get(_0x5bc5e9);
    }
    const _0x1623a4 = _0x467486?.fromPartition?.(_0x5bc5e9) || null;
    if (_0x1623a4) {
      _0x4b6eda.set(_0x5bc5e9, _0x1623a4);
    }
    return _0x1623a4;
  }
  function _0x4db06f(_0x448ea8) {
    if (!_0x448ea8) {
      return true;
    }
    const _0x59f2b6 = typeof _0x54bd61 === "function" ? _0x54bd61() : [];
    return !(Array.isArray(_0x59f2b6) ? _0x59f2b6 : []).some(_0x5a1346 => {
      try {
        return _0x5a1346 && !_0x5a1346.isDestroyed?.() && _0x5a1346.session === _0x448ea8;
      } catch (_0x103b77) {
        return false;
      }
    });
  }
  async function _0x8e8dae(_0x3438db, _0x237687, _0xc7f285) {
    await _0x237687.clearCache();
    try {
      await _0x237687.closeAllConnections?.();
    } catch (_0x5546d6) {}
    const _0x196a94 = Date.now();
    _0x471f02(_0x3438db, {
      lastCheckedAt: _0x196a94,
      lastClearedAt: _0x196a94,
      lastCacheBytes: 0
    });
    appendDiagnosticsLog("CACHE", "automation session cache cleared", {
      partition: _0x3438db,
      reason: _0xc7f285
    });
    return {
      partition: _0x3438db,
      cleared: true,
      reason: _0xc7f285
    };
  }
  async function _0x480e3c(_0x17fb92, {
    force = false,
    allowActive = false,
    reason = "idle-policy"
  } = {}) {
    const _0x314c19 = _0x4d7dc2(_0x17fb92);
    if (!_0x314c19) {
      return {
        partition: "",
        cleared: false,
        reason: "invalid_partition"
      };
    }
    if (_0x27a74b.has(_0x314c19)) {
      return _0x27a74b.get(_0x314c19);
    }
    const _0x4c8ccb = (async () => {
      const _0x4b76c1 = _0x2b7ba0(_0x314c19);
      if (!_0x4b76c1) {
        return {
          partition: _0x314c19,
          cleared: false,
          reason: "session_unavailable"
        };
      }
      if (!allowActive && !_0x4db06f(_0x4b76c1)) {
        return {
          partition: _0x314c19,
          cleared: false,
          reason: "session_active"
        };
      }
      const _0x49f84b = Date.now();
      const _0x4dd4bf = _0xe8f59c()[_0x314c19] || {};
      if (!force && _0x4dd4bf.lastCheckedAt && _0x49f84b - _0x4dd4bf.lastCheckedAt < checkIntervalMs) {
        return {
          partition: _0x314c19,
          cleared: false,
          reason: "check_throttled"
        };
      }
      let _0xcb7f17 = 0;
      try {
        _0xcb7f17 = Number(await _0x4b76c1.getCacheSize?.()) || 0;
      } catch (_0x4092b8) {
        _0x471f02(_0x314c19, {
          lastCheckedAt: _0x49f84b
        });
        return {
          partition: _0x314c19,
          cleared: false,
          reason: "cache_size_failed",
          error: _0x4092b8?.message || String(_0x4092b8)
        };
      }
      _0x471f02(_0x314c19, {
        lastCheckedAt: _0x49f84b,
        lastCacheBytes: _0xcb7f17
      });
      const _0x36f8b1 = _0x4dd4bf.lastClearedAt || _0x4dd4bf.firstSeenAt || _0x49f84b;
      const _0x223d25 = _0x49f84b - _0x36f8b1 >= maxCacheAgeMs;
      if (!force && _0xcb7f17 < maxCacheBytes && !_0x223d25) {
        return {
          partition: _0x314c19,
          cleared: false,
          reason: "below_threshold",
          cacheBytes: _0xcb7f17
        };
      }
      return _0x8e8dae(_0x314c19, _0x4b76c1, force ? reason : _0x223d25 ? "age_limit" : "size_limit");
    })().finally(() => {
      _0x27a74b.delete(_0x314c19);
    });
    _0x27a74b.set(_0x314c19, _0x4c8ccb);
    return _0x4c8ccb;
  }
  function _0x3a4b6c(_0x55639c) {
    const _0x414274 = _0x4d7dc2(_0x55639c);
    if (!_0x414274) {
      return;
    }
    const _0x58438f = _0x58aeeb.get(_0x414274);
    if (_0x58438f) {
      clearTimeout(_0x58438f);
    }
    const _0x44eea4 = setTimeout(() => {
      _0x58aeeb.delete(_0x414274);
      _0x480e3c(_0x414274, {
        reason: "view-destroyed-idle"
      }).catch(_0x3bad51 => {
        appendDiagnosticsLog("WARN", "automation session cache cleanup failed", {
          partition: _0x414274,
          error: _0x3bad51?.message || String(_0x3bad51)
        });
      });
    }, idleCheckDelayMs);
    if (typeof _0x44eea4.unref === "function") {
      _0x44eea4.unref();
    }
    _0x58aeeb.set(_0x414274, _0x44eea4);
  }
  async function _0x28edb2({
    includeDefault = true
  } = {}) {
    const _0x314bc3 = _0x4c8711();
    const _0x2e47bd = [];
    if (includeDefault && _0x467486?.defaultSession) {
      _0x2e47bd.push({
        partition: "default",
        sessionObject: _0x467486.defaultSession
      });
    }
    _0x314bc3.forEach(_0xa15f71 => {
      const _0x1f9f9e = _0x2b7ba0(_0xa15f71);
      if (_0x1f9f9e) {
        _0x2e47bd.push({
          partition: _0xa15f71,
          sessionObject: _0x1f9f9e
        });
      }
    });
    const _0x4c0c4d = [];
    for (const _0x1b4b01 of _0x2e47bd) {
      try {
        if (_0x1b4b01.partition === "default") {
          await _0x1b4b01.sessionObject.clearCache();
          try {
            await _0x1b4b01.sessionObject.closeAllConnections?.();
          } catch (_0x51dcf8) {}
          _0x4c0c4d.push({
            partition: "default",
            cleared: true,
            reason: "manual"
          });
        } else {
          _0x4c0c4d.push(await _0x480e3c(_0x1b4b01.partition, {
            force: true,
            allowActive: false,
            reason: "manual"
          }));
        }
      } catch (_0x2bf500) {
        _0x4c0c4d.push({
          partition: _0x1b4b01.partition,
          cleared: false,
          reason: _0x2bf500?.message || String(_0x2bf500)
        });
      }
    }
    return {
      total: _0x4c0c4d.length,
      cleared: _0x4c0c4d.filter(_0x568001 => _0x568001.cleared).length,
      skipped: _0x4c0c4d.filter(_0x7ac2a4 => !_0x7ac2a4.cleared && _0x7ac2a4.reason === "session_active").length,
      failed: _0x4c0c4d.filter(_0x3a5b38 => !_0x3a5b38.cleared && _0x3a5b38.reason !== "session_active").length,
      results: _0x4c0c4d
    };
  }
  async function _0x535d71({
    includeDefault = true
  } = {}) {
    const _0x5644fe = [];
    if (includeDefault && _0x467486?.defaultSession) {
      _0x5644fe.push(_0x467486.defaultSession);
    }
    _0x4c8711().forEach(_0x44bde1 => {
      const _0x30330c = _0x2b7ba0(_0x44bde1);
      if (_0x30330c && !_0x5644fe.includes(_0x30330c)) {
        _0x5644fe.push(_0x30330c);
      }
    });
    let _0x154441 = 0;
    for (const _0x5ae101 of _0x5644fe) {
      try {
        _0x154441 += Number(await _0x5ae101.getCacheSize?.()) || 0;
      } catch (_0x383289) {}
    }
    return _0x154441;
  }
  return {
    register: _0x4d7dc2,
    maybeClear: _0x480e3c,
    scheduleIdleCheck: _0x3a4b6c,
    clearKnownCaches: _0x28edb2,
    getKnownCacheSize: _0x535d71,
    isSessionIdle: _0x4db06f,
    readKnownPartitions: _0x4c8711
  };
}
module.exports = {
  KNOWN_PARTITIONS_KEY: KNOWN_PARTITIONS_KEY,
  CACHE_STATE_KEY: CACHE_STATE_KEY,
  DEFAULT_MAX_CACHE_BYTES: DEFAULT_MAX_CACHE_BYTES,
  DEFAULT_MAX_CACHE_AGE_MS: DEFAULT_MAX_CACHE_AGE_MS,
  DEFAULT_CHECK_INTERVAL_MS: DEFAULT_CHECK_INTERVAL_MS,
  createAutomationSessionCacheManager: createAutomationSessionCacheManager
};
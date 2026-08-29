'use strict';

const KNOWN_PARTITIONS_KEY = "automation_cache_known_partitions_v1";
const CACHE_STATE_KEY = "automation_cache_cleanup_state_v1";
const DEFAULT_MAX_CACHE_BYTES = 524288000;
const DEFAULT_MAX_CACHE_AGE_MS = 604800000;
const DEFAULT_CHECK_INTERVAL_MS = 86400000;
const DEFAULT_IDLE_CHECK_DELAY_MS = 15000;
function createAutomationSessionCacheManager({
  sessionApi: sessionApi,
  getAllWebContents: getAllWebContents,
  store: store,
  appendDiagnosticsLog = () => {},
  maxCacheBytes = DEFAULT_MAX_CACHE_BYTES,
  maxCacheAgeMs = DEFAULT_MAX_CACHE_AGE_MS,
  checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS,
  idleCheckDelayMs = DEFAULT_IDLE_CHECK_DELAY_MS
} = {}) {
  const map = new Map();
  const map2 = new Map();
  const map3 = new Map();
  function readKnownPartitions() {
    const local = store?.get?.(KNOWN_PARTITIONS_KEY, []);
    return [...new Set((Array.isArray(local) ? local : []).map(String).filter(Boolean))];
  }
  function fn2(arg1) {
    const result = readKnownPartitions();
    if (result.includes(arg1)) {
      return;
    }
    result.push(arg1);
    store?.set?.(KNOWN_PARTITIONS_KEY, result.slice(-100));
  }
  function fn3() {
    const local = store?.get?.(CACHE_STATE_KEY, {});
    if (local && typeof local === "object") {
      return local;
    } else {
      return {};
    }
  }
  function fn4(arg1, arg2) {
    const result = fn3();
    result[arg1] = {
      ...(result[arg1] || {}),
      ...arg2
    };
    store?.set?.(CACHE_STATE_KEY, result);
  }
  function register(arg1, arg2 = null) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "";
    }
    const value = result.startsWith("persist:automation:") ? result : "persist:automation:" + result;
    if (arg2) {
      map.set(value, arg2);
    }
    fn2(value);
    const result2 = fn3();
    if (!result2[value]?.firstSeenAt) {
      fn4(value, {
        firstSeenAt: Date.now()
      });
    }
    return value;
  }
  function fn6(arg1) {
    if (map.has(arg1)) {
      return map.get(arg1);
    }
    const local = sessionApi?.fromPartition?.(arg1) || null;
    if (local) {
      map.set(arg1, local);
    }
    return local;
  }
  function isSessionIdle(arg1) {
    if (!arg1) {
      return true;
    }
    const value = typeof getAllWebContents === "function" ? getAllWebContents() : [];
    return !(Array.isArray(value) ? value : []).some(arg12 => {
      try {
        return arg12 && !arg12.isDestroyed?.() && arg12.session === arg1;
      } catch (error) {
        return false;
      }
    });
  }
  async function fn8(arg1, arg2, arg3) {
    await arg2.clearCache();
    try {
      await arg2.closeAllConnections?.();
    } catch (error) {}
    const result = Date.now();
    fn4(arg1, {
      lastCheckedAt: result,
      lastClearedAt: result,
      lastCacheBytes: 0
    });
    appendDiagnosticsLog("CACHE", "automation session cache cleared", {
      partition: arg1,
      reason: arg3
    });
    return {
      partition: arg1,
      cleared: true,
      reason: arg3
    };
  }
  async function maybeClear(arg1, {
    force = false,
    allowActive = false,
    reason = "idle-policy"
  } = {}) {
    const result = register(arg1);
    if (!result) {
      return {
        partition: "",
        cleared: false,
        reason: "invalid_partition"
      };
    }
    if (map3.has(result)) {
      return map3.get(result);
    }
    const result2 = (async () => {
      const result2 = fn6(result);
      if (!result2) {
        return {
          partition: result,
          cleared: false,
          reason: "session_unavailable"
        };
      }
      if (!allowActive && !isSessionIdle(result2)) {
        return {
          partition: result,
          cleared: false,
          reason: "session_active"
        };
      }
      const result3 = Date.now();
      const local = fn3()[result] || {};
      if (!force && local.lastCheckedAt && result3 - local.lastCheckedAt < checkIntervalMs) {
        return {
          partition: result,
          cleared: false,
          reason: "check_throttled"
        };
      }
      let num = 0;
      try {
        num = Number(await result2.getCacheSize?.()) || 0;
      } catch (error) {
        fn4(result, {
          lastCheckedAt: result3
        });
        return {
          partition: result,
          cleared: false,
          reason: "cache_size_failed",
          error: error?.message || String(error)
        };
      }
      fn4(result, {
        lastCheckedAt: result3,
        lastCacheBytes: num
      });
      const local2 = local.lastClearedAt || local.firstSeenAt || result3;
      const value = result3 - local2 >= maxCacheAgeMs;
      if (!force && num < maxCacheBytes && !value) {
        return {
          partition: result,
          cleared: false,
          reason: "below_threshold",
          cacheBytes: num
        };
      }
      return fn8(result, result2, force ? reason : value ? "age_limit" : "size_limit");
    })().finally(() => {
      map3.delete(result);
    });
    map3.set(result, result2);
    return result2;
  }
  function scheduleIdleCheck(arg1) {
    const result = register(arg1);
    if (!result) {
      return;
    }
    const result2 = map2.get(result);
    if (result2) {
      clearTimeout(result2);
    }
    const result3 = setTimeout(() => {
      map2.delete(result);
      maybeClear(result, {
        reason: "view-destroyed-idle"
      }).catch(arg1 => {
        appendDiagnosticsLog("WARN", "automation session cache cleanup failed", {
          partition: result,
          error: arg1?.message || String(arg1)
        });
      });
    }, idleCheckDelayMs);
    if (typeof result3.unref === "function") {
      result3.unref();
    }
    map2.set(result, result3);
  }
  async function clearKnownCaches({
    includeDefault = true
  } = {}) {
    const result = readKnownPartitions();
    const list = [];
    if (includeDefault && sessionApi?.defaultSession) {
      list.push({
        partition: "default",
        sessionObject: sessionApi.defaultSession
      });
    }
    result.forEach(arg1 => {
      const result = fn6(arg1);
      if (result) {
        list.push({
          partition: arg1,
          sessionObject: result
        });
      }
    });
    const list2 = [];
    for (const item of list) {
      try {
        if (item.partition === "default") {
          await item.sessionObject.clearCache();
          try {
            await item.sessionObject.closeAllConnections?.();
          } catch (error) {}
          list2.push({
            partition: "default",
            cleared: true,
            reason: "manual"
          });
        } else {
          list2.push(await maybeClear(item.partition, {
            force: true,
            allowActive: false,
            reason: "manual"
          }));
        }
      } catch (error) {
        list2.push({
          partition: item.partition,
          cleared: false,
          reason: error?.message || String(error)
        });
      }
    }
    return {
      total: list2.length,
      cleared: list2.filter(arg1 => arg1.cleared).length,
      skipped: list2.filter(arg1 => !arg1.cleared && arg1.reason === "session_active").length,
      failed: list2.filter(arg1 => !arg1.cleared && arg1.reason !== "session_active").length,
      results: list2
    };
  }
  async function getKnownCacheSize({
    includeDefault = true
  } = {}) {
    const list = [];
    if (includeDefault && sessionApi?.defaultSession) {
      list.push(sessionApi.defaultSession);
    }
    readKnownPartitions().forEach(arg1 => {
      const result = fn6(arg1);
      if (result && !list.includes(result)) {
        list.push(result);
      }
    });
    let num = 0;
    for (const item of list) {
      try {
        num += Number(await item.getCacheSize?.()) || 0;
      } catch (error) {}
    }
    return num;
  }
  return {
    register: register,
    maybeClear: maybeClear,
    scheduleIdleCheck: scheduleIdleCheck,
    clearKnownCaches: clearKnownCaches,
    getKnownCacheSize: getKnownCacheSize,
    isSessionIdle: isSessionIdle,
    readKnownPartitions: readKnownPartitions
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
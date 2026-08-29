'use strict';

const DEFAULT_MAX_KEYS_PER_REQUEST = 2000;
const DEFAULT_LEGACY_CACHE_TTL_MS = 5000;
function normalizeKeys(arg1, arg2 = DEFAULT_MAX_KEYS_PER_REQUEST) {
  const list = [];
  const set = new Set();
  for (const item of Array.isArray(arg1) ? arg1 : []) {
    const result = String(item || "").trim();
    if (!result || set.has(result)) {
      continue;
    }
    set.add(result);
    list.push(result);
    if (list.length >= arg2) {
      break;
    }
  }
  return list;
}
function createLeadDedupService({
  ipcMain: ipcMain,
  dbManager: dbManager,
  isLeadsSqliteRuntime: isLeadsSqliteRuntime,
  collectAllLeadUserKeysFromHistory: collectAllLeadUserKeysFromHistory,
  collectBlacklistIdentifiers: collectBlacklistIdentifiers,
  maxKeysPerRequest = DEFAULT_MAX_KEYS_PER_REQUEST,
  legacyCacheTtlMs = DEFAULT_LEGACY_CACHE_TTL_MS
} = {}) {
  let local = null;
  let num = 0;
  let flag = false;
  function fn() {
    const result = Date.now();
    if (!local || result - num >= legacyCacheTtlMs) {
      local = new Set(normalizeKeys(typeof collectAllLeadUserKeysFromHistory === "function" ? collectAllLeadUserKeysFromHistory() : [], Number.MAX_SAFE_INTEGER));
      num = result;
    }
    return local;
  }
  function invalidateLegacyCache() {
    local = null;
    num = 0;
  }
  function checkInteractedUserKeys(arg1) {
    const result = normalizeKeys(arg1, maxKeysPerRequest);
    if (!result.length) {
      return {
        matched: [],
        complete: true
      };
    }
    const set = new Set();
    const set2 = new Set(normalizeKeys(typeof collectBlacklistIdentifiers === "function" ? collectBlacklistIdentifiers() : [], Number.MAX_SAFE_INTEGER));
    result.forEach(arg1 => {
      if (set2.has(arg1)) {
        set.add(arg1);
      }
    });
    if (typeof isLeadsSqliteRuntime === "function" && isLeadsSqliteRuntime()) {
      const local = dbManager?.findExistingLeadUserKeys?.(result) || [];
      local.forEach(arg1 => set.add(String(arg1 || "").trim()));
    } else {
      const result2 = fn();
      result.forEach(arg1 => {
        if (result2.has(arg1)) {
          set.add(arg1);
        }
      });
    }
    return {
      matched: [...set].filter(Boolean),
      complete: true
    };
  }
  function registerIpc() {
    if (flag || !ipcMain?.handle) {
      return;
    }
    flag = true;
    ipcMain.handle("check-interacted-user-keys", async (arg1, options = {}) => {
      try {
        return checkInteractedUserKeys(options.keys);
      } catch (error) {
        console.warn("[LeadDedup] 批量历史去重查询失败:", error?.message || error);
        return {
          matched: [],
          complete: false,
          reason: error?.message || String(error)
        };
      }
    });
  }
  return {
    checkInteractedUserKeys: checkInteractedUserKeys,
    invalidateLegacyCache: invalidateLegacyCache,
    registerIpc: registerIpc
  };
}
module.exports = {
  DEFAULT_MAX_KEYS_PER_REQUEST: DEFAULT_MAX_KEYS_PER_REQUEST,
  normalizeKeys: normalizeKeys,
  createLeadDedupService: createLeadDedupService
};
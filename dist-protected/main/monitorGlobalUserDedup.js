'use strict';

const {
  buildMonitorUserDedupKey
} = require("./monitorCommentFilter");
const STORE_KEY = "monitor_global_user_sec_uids";
const MAX_KEYS = 20000;
function loadGlobalKeySet(arg1) {
  const set = new Set();
  if (!arg1 || typeof arg1.get !== "function") {
    return set;
  }
  const result = arg1.get(STORE_KEY, []);
  if (!Array.isArray(result)) {
    return set;
  }
  for (const item of result) {
    const result = String(item || "").trim();
    if (result && result.length >= 15 && !result.startsWith("nick:")) {
      set.add(result);
    }
  }
  return set;
}
function saveGlobalKeySet(arg1, arg2) {
  if (!arg1 || typeof arg1.set !== "function") {
    return;
  }
  const result = [...(arg2 || [])].filter(Boolean).slice(-MAX_KEYS);
  arg1.set(STORE_KEY, result);
}
function leadExistsInPool(arg1) {
  if (!arg1) {
    return false;
  }
  try {
    const dbManager = require("./dbManager");
    if (!dbManager.isLeadsRuntimeReady?.()) {
      return false;
    }
    const local = dbManager.getLeadById?.(arg1) || dbManager.getLeadByUserKey?.(arg1);
    return !!local;
  } catch (error) {
    return false;
  }
}
function claimGlobalMonitorUser(arg1, options = {}) {
  const result = buildMonitorUserDedupKey(options);
  if (!result) {
    return {
      claimed: true,
      key: "",
      reason: "no_sec_uid"
    };
  }
  const result2 = loadGlobalKeySet(arg1);
  if (result2.has(result)) {
    return {
      claimed: false,
      key: result,
      reason: "global_seen"
    };
  }
  if (leadExistsInPool(result)) {
    result2.add(result);
    saveGlobalKeySet(arg1, result2);
    return {
      claimed: false,
      key: result,
      reason: "lead_pool"
    };
  }
  result2.add(result);
  saveGlobalKeySet(arg1, result2);
  return {
    claimed: true,
    key: result,
    reason: "claimed"
  };
}
function rememberGlobalMonitorUser(arg1, options = {}) {
  const result = buildMonitorUserDedupKey(options);
  if (!result || !arg1) {
    return "";
  }
  const result2 = loadGlobalKeySet(arg1);
  if (result2.has(result)) {
    return result;
  }
  result2.add(result);
  saveGlobalKeySet(arg1, result2);
  return result;
}
function isGlobalKnownMonitorUser(arg1, options = {}) {
  const result = buildMonitorUserDedupKey(options);
  if (!result) {
    return false;
  }
  const result2 = loadGlobalKeySet(arg1);
  if (result2.has(result)) {
    return true;
  }
  return leadExistsInPool(result);
}
module.exports = {
  STORE_KEY: STORE_KEY,
  loadGlobalKeySet: loadGlobalKeySet,
  saveGlobalKeySet: saveGlobalKeySet,
  claimGlobalMonitorUser: claimGlobalMonitorUser,
  rememberGlobalMonitorUser: rememberGlobalMonitorUser,
  isGlobalKnownMonitorUser: isGlobalKnownMonitorUser,
  leadExistsInPool: leadExistsInPool
};
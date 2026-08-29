'use strict';

const fs = require("fs");
const path = require("path");
const BATCH_FOLLOW_RUNS_KEY = "batch_follow_runs";
const DEFAULT_BATCH_RUN_LIMIT = 30;
const DEFAULT_BATCH_RUN_LOG_LIMIT = 120;
const DEFAULT_BATCH_RUN_RESULT_LIMIT = 80;
const DEFAULT_MONITOR_SEEN_LIMIT = 3000;
const DEFAULT_MONITOR_SEEN_KEY_LIMIT = 40;
const DEFAULT_PARTITION_MAX_AGE_MS = 1209600000;
function safeStoreGet(arg1, arg2, arg3) {
  try {
    return arg1?.get?.(arg2, arg3);
  } catch (error) {
    return arg3;
  }
}
function safeStoreSet(arg1, arg2, arg3) {
  try {
    arg1?.set?.(arg2, arg3);
    return true;
  } catch (error) {
    console.warn("[StartupHousekeeping] 写入 " + arg2 + " 失败:", error?.message || error);
    return false;
  }
}
function safeStoreDelete(arg1, arg2) {
  try {
    if (typeof arg1?.delete === "function") {
      arg1.delete(arg2);
      return true;
    }
    arg1?.set?.(arg2, undefined);
    return true;
  } catch (error) {
    return false;
  }
}
function listStoreKeys(arg1) {
  try {
    if (typeof arg1?.store === "object" && arg1.store) {
      return Object.keys(arg1.store);
    }
  } catch (error) {}
  try {
    const value = arg1?.path ? fs.readFileSync(arg1.path, "utf8") : "";
    if (!value) {
      return [];
    }
    return Object.keys(JSON.parse(value) || {});
  } catch (error) {
    return [];
  }
}
function compactBatchFollowRuns(arg1, {
  runLimit = DEFAULT_BATCH_RUN_LIMIT,
  logLimit = DEFAULT_BATCH_RUN_LOG_LIMIT,
  resultLimit = DEFAULT_BATCH_RUN_RESULT_LIMIT
} = {}) {
  if (!Array.isArray(arg1)) {
    return [];
  }
  return arg1.slice(0, Math.max(1, runLimit)).map(arg1 => {
    if (!arg1 || typeof arg1 !== "object") {
      return arg1;
    }
    const obj = {
      ...arg1
    };
    if (Array.isArray(obj.logs) && obj.logs.length > logLimit) {
      obj.logs = obj.logs.slice(-logLimit);
    }
    if (Array.isArray(obj.results) && obj.results.length > resultLimit) {
      obj.results = obj.results.slice(0, resultLimit);
    }
    return obj;
  });
}
function pruneElectronStoreBloat(arg1, options = {}) {
  const obj = {
    batchRunsBefore: 0,
    batchRunsAfter: 0,
    monitorSeenTrimmed: 0,
    monitorSeenKeysRemoved: 0,
    changed: false
  };
  if (!arg1) {
    return obj;
  }
  const value = Number(options.monitorSeenLimit) > 0 ? Number(options.monitorSeenLimit) : DEFAULT_MONITOR_SEEN_LIMIT;
  const value2 = Number(options.monitorSeenKeyLimit) > 0 ? Number(options.monitorSeenKeyLimit) : DEFAULT_MONITOR_SEEN_KEY_LIMIT;
  const local = (arg1, arg2) => {
    if (!Array.isArray(arg1) || !arg1.length) {
      return;
    }
    if (!obj.batchRunsBefore) {
      obj.batchRunsBefore = arg1.length;
    }
    const result = compactBatchFollowRuns(arg1, options);
    obj.batchRunsAfter = result.length;
    const value = JSON.stringify(arg1).length;
    const value2 = JSON.stringify(result).length;
    if (result.length !== arg1.length || value2 < value) {
      arg2(result);
      obj.changed = true;
    }
  };
  try {
    const batchFollowRunsAccess = require("./batchFollowRunsAccess");
    local(batchFollowRunsAccess.listAll(arg1), arg12 => {
      batchFollowRunsAccess.replaceAll(arg1, arg12);
    });
  } catch (error) {}
  local(safeStoreGet(arg1, BATCH_FOLLOW_RUNS_KEY, []), arg12 => {
    safeStoreSet(arg1, BATCH_FOLLOW_RUNS_KEY, arg12);
  });
  try {
    const monitorTaskSeenAccess = require("./monitorTaskSeenAccess");
    const result = monitorTaskSeenAccess.pruneSqlite({
      seenLimit: value,
      seenKeyLimit: value2
    });
    if (result.trimmed || result.removed) {
      obj.monitorSeenTrimmed += result.trimmed;
      obj.monitorSeenKeysRemoved += result.removed;
      obj.changed = true;
    }
  } catch (error) {}
  const result = listStoreKeys(arg1).filter(arg1 => /^monitor_task_seen_/.test(arg1) || /^monitor_task_notified_/.test(arg1)).sort();
  if (result.length > value2) {
    const result2 = result.slice(0, result.length - value2);
    for (const item of result2) {
      if (safeStoreDelete(arg1, item)) {
        obj.monitorSeenKeysRemoved += 1;
        obj.changed = true;
      }
    }
  }
  const result2 = listStoreKeys(arg1).filter(arg1 => /^monitor_task_seen_/.test(arg1) || /^monitor_task_notified_/.test(arg1));
  for (const item of result2) {
    const result = safeStoreGet(arg1, item, []);
    if (!Array.isArray(result) || result.length <= value) {
      continue;
    }
    if (safeStoreSet(arg1, item, result.slice(-value))) {
      obj.monitorSeenTrimmed += 1;
      obj.changed = true;
    }
  }
  return obj;
}
function collectAccountIdsFromPool(arg1) {
  const set = new Set();
  const value = Array.isArray(arg1) ? arg1 : [];
  for (const item of value) {
    const result = String(item?.id || item?.accountId || "").trim();
    if (result) {
      set.add(result);
    }
  }
  return set;
}
function buildProtectedPartitionNames(list = []) {
  const set = new Set();
  for (const item of list) {
    set.add("automation:douyin_" + item);
    set.add("automation:xianyu_" + item);
    set.add("automation:entity_" + item);
    set.add("automation:douyin_entity-preview:entity_" + item);
    set.add("douyin_" + item);
    set.add("douyin_monitor_" + item);
  }
  return set;
}
function listActivePartitionNames(arg1) {
  const set = new Set();
  const value = typeof arg1 === "function" ? arg1() : [];
  for (const item of Array.isArray(value) ? value : []) {
    try {
      if (!item || item.isDestroyed?.()) {
        continue;
      }
      const result = String(item.session?.partition || "").trim();
      if (!result) {
        continue;
      }
      const value = result.startsWith("persist:") ? result.slice("persist:".length) : result;
      if (value) {
        set.add(value);
      }
    } catch (error) {}
  }
  return set;
}
function rmDirRecursive(arg1) {
  fs.rmSync(arg1, {
    recursive: true,
    force: true,
    maxRetries: 2
  });
}
function cleanupOrphanAutomationPartitions({
  userDataPath: userDataPath,
  accountPool: accountPool,
  getAllWebContents: getAllWebContents,
  maxAgeMs = DEFAULT_PARTITION_MAX_AGE_MS,
  now = Date.now(),
  dryRun = false
} = {}) {
  const obj = {
    scanned: 0,
    deleted: 0,
    skippedProtected: 0,
    skippedActive: 0,
    skippedFresh: 0,
    failed: 0,
    freedHint: []
  };
  const result = path.join(String(userDataPath || ""), "Partitions");
  if (!userDataPath || !fs.existsSync(result)) {
    return obj;
  }
  const result2 = collectAccountIdsFromPool(accountPool);
  const result3 = buildProtectedPartitionNames(result2);
  const result4 = listActivePartitionNames(getAllWebContents);
  const value = Number(maxAgeMs) > 0 ? Number(maxAgeMs) : DEFAULT_PARTITION_MAX_AGE_MS;
  let list = [];
  try {
    list = fs.readdirSync(result, {
      withFileTypes: true
    });
  } catch (error) {
    console.warn("[StartupHousekeeping] 读取 Partitions 失败:", error?.message || error);
    return obj;
  }
  for (const item of list) {
    if (!item?.isDirectory?.()) {
      continue;
    }
    obj.scanned += 1;
    const value2 = item.name;
    let local = value2;
    try {
      local = decodeURIComponent(value2);
    } catch (error) {}
    const result2 = path.join(result, value2);
    if (result3.has(local)) {
      obj.skippedProtected += 1;
      continue;
    }
    if (result4.has(local) || result4.has(value2)) {
      obj.skippedActive += 1;
      continue;
    }
    let num = 0;
    try {
      num = Number(fs.statSync(result2).mtimeMs) || 0;
    } catch (error) {
      obj.failed += 1;
      continue;
    }
    if (num && now - num < value) {
      obj.skippedFresh += 1;
      continue;
    }
    if (dryRun) {
      obj.deleted += 1;
      obj.freedHint.push(local);
      continue;
    }
    try {
      rmDirRecursive(result2);
      obj.deleted += 1;
      obj.freedHint.push(local);
    } catch (error) {
      obj.failed += 1;
      console.warn("[StartupHousekeeping] 删除 Partition 失败 " + local + ":", error?.message || error);
    }
  }
  return obj;
}
module.exports = {
  BATCH_FOLLOW_RUNS_KEY: BATCH_FOLLOW_RUNS_KEY,
  DEFAULT_BATCH_RUN_LIMIT: DEFAULT_BATCH_RUN_LIMIT,
  DEFAULT_BATCH_RUN_LOG_LIMIT: DEFAULT_BATCH_RUN_LOG_LIMIT,
  DEFAULT_BATCH_RUN_RESULT_LIMIT: DEFAULT_BATCH_RUN_RESULT_LIMIT,
  DEFAULT_MONITOR_SEEN_LIMIT: DEFAULT_MONITOR_SEEN_LIMIT,
  DEFAULT_PARTITION_MAX_AGE_MS: DEFAULT_PARTITION_MAX_AGE_MS,
  compactBatchFollowRuns: compactBatchFollowRuns,
  pruneElectronStoreBloat: pruneElectronStoreBloat,
  collectAccountIdsFromPool: collectAccountIdsFromPool,
  buildProtectedPartitionNames: buildProtectedPartitionNames,
  cleanupOrphanAutomationPartitions: cleanupOrphanAutomationPartitions
};
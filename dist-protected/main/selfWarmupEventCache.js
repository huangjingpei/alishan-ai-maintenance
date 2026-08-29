const {
  buildSelfWarmupEventSeenKey,
  normalizeName
} = require("../shared/selfWarmupDedupe");
const SEEN_PREFIX = "self_warmup_seen_";
const ROUNDS_PREFIX = "self_warmup_user_rounds_";
const PENDING_PREFIX = "self_warmup_pending_";
const BASELINES_PREFIX = "self_warmup_baselines_";
function getSeenKeys(arg1, arg2) {
  const result = arg1.get("" + SEEN_PREFIX + arg2, []);
  if (Array.isArray(result)) {
    return result;
  } else {
    return [];
  }
}
function saveSeenKeys(arg1, arg2, arg3) {
  arg1.set("" + SEEN_PREFIX + arg2, [...new Set(arg3.filter(Boolean))].slice(-5000));
}
function getPendingEvents(arg1, arg2) {
  const result = arg1.get("" + PENDING_PREFIX + arg2, []);
  if (Array.isArray(result)) {
    return result.filter(arg1 => arg1 && typeof arg1 === "object");
  } else {
    return [];
  }
}
function savePendingEvents(arg1, arg2, list = []) {
  const list2 = [];
  const set = new Set();
  for (const item of Array.isArray(list) ? list : []) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const result = buildSelfWarmupEventSeenKey(item);
    if (!result || set.has(result)) {
      continue;
    }
    set.add(result);
    list2.push(item);
  }
  arg1.set("" + PENDING_PREFIX + arg2, list2.slice(-500));
}
function clearTaskEventCache(arg1, arg2) {
  if (!arg2) {
    return;
  }
  arg1.delete("" + SEEN_PREFIX + arg2);
  arg1.delete("" + ROUNDS_PREFIX + arg2);
  arg1.delete("" + PENDING_PREFIX + arg2);
  arg1.delete("" + BASELINES_PREFIX + arg2);
}
function clearUserReplyRounds(arg1, arg2) {
  if (!arg2) {
    return false;
  }
  arg1.delete("" + ROUNDS_PREFIX + arg2);
  return true;
}
function removeEventsFromCache(arg1, arg2, list = []) {
  if (!arg2 || !list.length) {
    return;
  }
  const set = new Set(list.map(arg1 => buildSelfWarmupEventSeenKey(arg1)));
  const result = getSeenKeys(arg1, arg2).filter(arg1 => !set.has(arg1));
  saveSeenKeys(arg1, arg2, result);
  const result2 = getPendingEvents(arg1, arg2).filter(arg1 => !set.has(buildSelfWarmupEventSeenKey(arg1)));
  savePendingEvents(arg1, arg2, result2);
  const value = "" + ROUNDS_PREFIX + arg2;
  const obj = {
    ...(arg1.get(value, {}) || {})
  };
  let flag = false;
  for (const item of list) {
    const result = normalizeName(item.nickname);
    const result2 = String(item.accountId || "");
    const value = result2 + "|" + result;
    const list = [result, value, value + "|comment", value + "|dm"];
    try {
      const {
        extractUserKeyFromUrl: extractUserKeyFromUrl
      } = require("../shared/leadUserKey");
      const result = extractUserKeyFromUrl(item.userUrl || "");
      if (result) {
        list.push(result2 + "|uid:" + result + "|comment", result2 + "|uid:" + result + "|dm");
      }
    } catch (error) {}
    for (const item of list) {
      if (item && Object.prototype.hasOwnProperty.call(obj, item)) {
        delete obj[item];
        flag = true;
      }
    }
  }
  if (flag) {
    arg1.set(value, obj);
  }
}
function clearTaskEventCacheForTasks(arg1, list = []) {
  const value = Array.isArray(list) ? list : [list];
  value.forEach(arg12 => clearTaskEventCache(arg1, arg12));
}
module.exports = {
  getSeenKeys: getSeenKeys,
  saveSeenKeys: saveSeenKeys,
  getPendingEvents: getPendingEvents,
  savePendingEvents: savePendingEvents,
  clearTaskEventCache: clearTaskEventCache,
  clearUserReplyRounds: clearUserReplyRounds,
  removeEventsFromCache: removeEventsFromCache,
  clearTaskEventCacheForTasks: clearTaskEventCacheForTasks
};
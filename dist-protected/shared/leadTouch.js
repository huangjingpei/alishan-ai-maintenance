const TOUCH_TYPES = ["like", "reply", "follow", "message", "profileComment"];
const TOUCH_TYPE_LABELS = {
  like: "点赞",
  reply: "回复",
  follow: "关注",
  message: "私信",
  profileComment: "首作评论"
};
const ENTRY_SOURCE_LABELS = {
  search: "搜索关键词",
  follow: "关注列表",
  recommend: "推荐页"
};
function createEmptyTouchCounts() {
  return {
    like: 0,
    reply: 0,
    follow: 0,
    message: 0,
    profileComment: 0
  };
}
function normalizeTouchCounts(arg1) {
  const result = createEmptyTouchCounts();
  if (!arg1 || typeof arg1 !== "object") {
    return result;
  }
  TOUCH_TYPES.forEach(arg12 => {
    const result2 = Number(arg1[arg12]);
    result[arg12] = Number.isFinite(result2) && result2 > 0 ? Math.floor(result2) : 0;
  });
  return result;
}
function getTotalTouchCount(arg1) {
  const result = normalizeTouchCounts(arg1);
  return TOUCH_TYPES.reduce((arg1, arg2) => arg1 + result[arg2], 0);
}
function migrateTouchCountsFromLegacy(arg1) {
  if (!arg1) {
    return createEmptyTouchCounts();
  }
  const result = normalizeTouchCounts(arg1.touchCounts);
  if (arg1.liked || arg1.actions?.liked) {
    result.like = Math.max(result.like, 1);
  }
  if (arg1.actions?.profileWorkCommented) {
    result.profileComment = Math.max(result.profileComment, 1);
  } else if (arg1.replied || arg1.actions?.replied) {
    result.reply = Math.max(result.reply, 1);
  }
  if (arg1.followed || arg1.actions?.followed) {
    result.follow = Math.max(result.follow, 1);
  }
  if (arg1.messaged || arg1.actions?.messaged) {
    result.message = Math.max(result.message, 1);
  }
  return result;
}
function ensureLeadMeta(arg1) {
  if (!arg1) {
    return arg1;
  }
  if (!Array.isArray(arg1.touchLog)) {
    arg1.touchLog = [];
  }
  arg1.touchCounts = migrateTouchCountsFromLegacy(arg1);
  if (arg1.worksCount === undefined) {
    arg1.worksCount = null;
  }
  if (!arg1.entrySource && arg1.taskName) {
    const result = String(arg1.taskName);
    if (result.includes("关注列表")) {
      arg1.entrySource = "follow";
    } else if (result.includes("推荐")) {
      arg1.entrySource = "recommend";
    } else if (result && !result.includes("+")) {
      arg1.entrySource = "search";
    }
  }
  if (!arg1.entryLabel) {
    if (arg1.entrySource === "search" && arg1.searchKeyword) {
      arg1.entryLabel = "搜索: " + arg1.searchKeyword;
    } else if (arg1.entrySource === "follow") {
      arg1.entryLabel = "关注列表";
    } else if (arg1.entrySource === "recommend") {
      arg1.entryLabel = "推荐页";
    } else if (arg1.entrySource === "like") {
      arg1.entryLabel = "喜欢列表";
    } else if (arg1.entrySource === "specific") {
      arg1.entryLabel = "指定视频";
    } else if (arg1.entrySource === "monitor") {
      arg1.entryLabel = arg1.taskName ? "监控: " + arg1.taskName : "监控视频";
    } else if (arg1.entrySource === "entity_blogger") {
      arg1.entryLabel = "线索采集：搜索博主";
    } else if (arg1.entrySource === "entity_user") {
      arg1.entryLabel = "线索采集：搜索用户";
    } else if (arg1.entrySource === "entity_mutual") {
      arg1.entryLabel = "线索采集：相互关注";
    } else if (arg1.entrySource === "entity_following") {
      arg1.entryLabel = "线索采集：关注列表";
    } else if (arg1.taskName) {
      arg1.entryLabel = arg1.taskName;
    }
  }
  return arg1;
}
function recordTouchOnLead(arg1, arg2) {
  if (!arg1 || !arg2?.type || !TOUCH_TYPES.includes(arg2.type)) {
    return arg1;
  }
  ensureLeadMeta(arg1);
  const result = Number(arg2.at || Date.now());
  const local = arg2.accountName || arg1.accountName || "";
  const local2 = arg2.content || "";
  const local3 = arg2.source || "acquire";
  const local4 = arg2.channel || (local3 === "monitor" ? "监控任务" : local3 === "batch" ? "线索库批量" : "自动获客");
  const result2 = (arg1.touchLog || []).some(arg1 => {
    if (arg1.type !== arg2.type) {
      return false;
    }
    if ((arg1.accountName || "") !== local) {
      return false;
    }
    const result2 = Number(arg1.at || arg1.timestamp || 0);
    return result2 && Math.abs(result2 - result) < 2500;
  });
  if (result2) {
    return arg1;
  }
  arg1.touchCounts[arg2.type] = (arg1.touchCounts[arg2.type] || 0) + 1;
  arg1.touchLog.unshift({
    type: arg2.type,
    label: TOUCH_TYPE_LABELS[arg2.type] || arg2.type,
    at: result,
    content: local2,
    accountName: local,
    success: arg2.success !== false,
    source: local3,
    channel: local4
  });
  arg1.lastTouchAt = Math.max(Number(arg1.lastTouchAt || 0), result);
  if (arg1.touchLog.length > 200) {
    arg1.touchLog.length = 200;
  }
  return arg1;
}
function syncTouchCountsFromLog(arg1) {
  if (!arg1) {
    return arg1;
  }
  const result = createEmptyTouchCounts();
  for (const item of arg1.touchLog || []) {
    if (TOUCH_TYPES.includes(item.type)) {
      result[item.type] += 1;
    }
  }
  arg1.touchCounts = result;
  return arg1;
}
function mergeTouchLogs(list = [], list2 = []) {
  const list3 = [...(Array.isArray(list2) ? list2 : []), ...(Array.isArray(list) ? list : [])];
  const set = new Set();
  const list4 = [];
  for (const item of list3) {
    if (!item || !item.type) {
      continue;
    }
    const result = Number(item.at || item.timestamp || 0);
    const value = result ? Math.floor(result / 1000) : 0;
    const result2 = String(item.content || "").trim().slice(0, 80);
    const value2 = item.type + "|" + (item.accountName || "") + "|" + result2 + "|" + value;
    if (set.has(value2)) {
      continue;
    }
    set.add(value2);
    list4.push(item);
  }
  return list4.sort((arg1, arg2) => Number(arg2.at || arg2.timestamp || 0) - Number(arg1.at || arg1.timestamp || 0)).slice(0, 200);
}
function recountTouchCountsAfterMerge(arg1) {
  if (!arg1) {
    return arg1;
  }
  if (!Array.isArray(arg1.touchLog)) {
    arg1.touchLog = [];
  }
  if (arg1.touchLog.length) {
    syncTouchCountsFromLog(arg1);
  } else {
    arg1.touchCounts = normalizeTouchCounts(arg1.touchCounts);
  }
  arg1.touchCounts = migrateTouchCountsFromLegacy(arg1);
  return arg1;
}
const WORKS_COUNT_UNKNOWN = -1;
function normalizeWorksCount(arg1) {
  if (arg1 === null || arg1 === undefined) {
    return WORKS_COUNT_UNKNOWN;
  }
  if (typeof arg1 === "string") {
    const result = String(arg1).trim();
    if (!result || result === "未知" || result === "-" || result === "null" || result === "N/A" || /^unknown$/i.test(result)) {
      return WORKS_COUNT_UNKNOWN;
    }
  }
  const result = Number(String(arg1).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(result) || result < 0) {
    return WORKS_COUNT_UNKNOWN;
  }
  return Math.floor(result);
}
function formatWorksCount(arg1) {
  if (arg1 === null || arg1 === undefined || arg1 === "") {
    return "未知";
  }
  const result = normalizeWorksCount(arg1);
  if (result < 0) {
    return "未知";
  }
  return String(result);
}
function serializeWorksCountForCsv(arg1) {
  if (arg1 === null || arg1 === undefined || arg1 === "") {
    return String(WORKS_COUNT_UNKNOWN);
  }
  return String(normalizeWorksCount(arg1));
}
function formatTouchSummary(arg1) {
  const result = normalizeTouchCounts(arg1);
  const result2 = TOUCH_TYPES.filter(arg1 => result[arg1] > 0).map(arg1 => "" + TOUCH_TYPE_LABELS[arg1] + result[arg1]);
  if (result2.length) {
    return result2.join(" · ");
  } else {
    return "未触达";
  }
}
module.exports = {
  TOUCH_TYPES: TOUCH_TYPES,
  TOUCH_TYPE_LABELS: TOUCH_TYPE_LABELS,
  ENTRY_SOURCE_LABELS: ENTRY_SOURCE_LABELS,
  createEmptyTouchCounts: createEmptyTouchCounts,
  normalizeTouchCounts: normalizeTouchCounts,
  getTotalTouchCount: getTotalTouchCount,
  migrateTouchCountsFromLegacy: migrateTouchCountsFromLegacy,
  ensureLeadMeta: ensureLeadMeta,
  recordTouchOnLead: recordTouchOnLead,
  syncTouchCountsFromLog: syncTouchCountsFromLog,
  mergeTouchLogs: mergeTouchLogs,
  recountTouchCountsAfterMerge: recountTouchCountsAfterMerge,
  WORKS_COUNT_UNKNOWN: WORKS_COUNT_UNKNOWN,
  normalizeWorksCount: normalizeWorksCount,
  formatWorksCount: formatWorksCount,
  serializeWorksCountForCsv: serializeWorksCountForCsv,
  formatTouchSummary: formatTouchSummary
};
const leadTouch = require("./leadTouch");
const LEADGEN_ENTRY_SOURCES = new Set(["search", "follow", "recommend", "like", "specific"]);
const ENTITY_ENTRY_SOURCES = new Set(["entity_blogger", "entity_user", "entity_mutual", "entity_following", "entity_live", "entity_comment", "entity_video", "live"]);
function getLeadCaptureTimestamp(arg1) {
  const result = Number(arg1?.timestamp);
  if (Number.isFinite(result) && result > 0) {
    return result;
  }
  const result2 = Date.parse(arg1?.capturedAt || "");
  if (Number.isFinite(result2)) {
    return result2;
  } else {
    return 0;
  }
}
function parseCommentTime(arg1) {
  if (!arg1) {
    return 0;
  }
  const date = new Date();
  if (String(arg1).includes("刚刚")) {
    return date.getTime();
  }
  const result = String(arg1).match(/(\d+)分钟前/);
  if (result) {
    return date.getTime() - parseInt(result[1], 10) * 60 * 1000;
  }
  const result2 = String(arg1).match(/(\d+)小时前/);
  if (result2) {
    return date.getTime() - parseInt(result2[1], 10) * 3600 * 1000;
  }
  const result3 = String(arg1).match(/(\d+)天前/);
  if (result3) {
    return date.getTime() - parseInt(result3[1], 10) * 24 * 3600 * 1000;
  }
  if (String(arg1).includes("昨天")) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getTime();
  }
  try {
    const result = String(arg1).split("-");
    if (result.length === 2) {
      const date2 = new Date(date.getFullYear(), parseInt(result[0], 10) - 1, parseInt(result[1], 10));
      if (date2 > date) {
        date2.setFullYear(date.getFullYear() - 1);
      }
      return date2.getTime();
    }
    if (result.length === 3) {
      return new Date(arg1).getTime();
    }
  } catch (error) {}
  return 0;
}
function resolveLeadOrigin(options = {}) {
  const result = String(options.entrySource || "").trim();
  if (ENTITY_ENTRY_SOURCES.has(result)) {
    if (result === "live") {
      return "entity_live";
    } else {
      return result;
    }
  }
  if (result === "monitor") {
    return "monitor";
  }
  if (result === "import" || result === "UID导入") {
    return "import";
  }
  if (LEADGEN_ENTRY_SOURCES.has(result)) {
    return "leadgen";
  }
  const result2 = String(options.taskId || "");
  if (result2 === "import_uid" || result2.startsWith("import_")) {
    return "import";
  }
  if (result2.startsWith("monitor_")) {
    return "monitor";
  }
  if (result2.startsWith("entity_")) {
    return "entity_live";
  }
  const value = (options.entryLabel || "") + " " + (options.taskName || "");
  if (value.includes("监控")) {
    return "monitor";
  }
  if (value.includes("线索采集") || value.includes("实体获客")) {
    if (value.includes("博主")) {
      return "entity_blogger";
    }
    if (value.includes("用户")) {
      return "entity_user";
    }
    if (value.includes("关注列表")) {
      return "entity_following";
    }
    if (value.includes("相互关注")) {
      return "entity_mutual";
    }
    if (value.includes("直播")) {
      return "entity_live";
    }
    if (value.includes("评论")) {
      return "entity_comment";
    }
    if (value.includes("视频")) {
      return "entity_video";
    }
    return "entity_live";
  }
  if (options.searchKeyword || options.taskName || options.entryLabel || result) {
    return "leadgen";
  }
  return "legacy";
}
function leadHasAnyTouch(arg1) {
  if (leadTouch.getTotalTouchCount(arg1?.touchCounts) > 0) {
    return true;
  }
  if (!arg1) {
    return false;
  }
  return !!arg1.liked || !!arg1.replied || !!arg1.followed || !!arg1.messaged || !!(arg1.touchCounts?.profileComment > 0) || !!Array.isArray(arg1.touchLog) && !!arg1.touchLog.some(arg1 => arg1.type === "profileComment");
}
function leadHasTouchType(arg1, arg2) {
  if (!arg1 || !arg2) {
    return false;
  }
  const value = leadTouch.normalizeTouchCounts ? leadTouch.normalizeTouchCounts(arg1.touchCounts) : arg1.touchCounts || {};
  const local = arg12 => Array.isArray(arg1.touchLog) && arg1.touchLog.some(arg1 => arg1.type === arg12);
  switch (arg2) {
    case "like":
      return value.like > 0 || !!arg1.liked || !!arg1.actions?.liked || local("like");
    case "reply":
      return value.reply > 0 || local("reply") || !!arg1.replied && !(value.profileComment > 0) && !local("profileComment");
    case "follow":
      return value.follow > 0 || !!arg1.followed || !!arg1.actions?.followed || local("follow");
    case "message":
      return value.message > 0 || !!arg1.messaged || !!arg1.actions?.messaged || local("message");
    case "profileComment":
      return value.profileComment > 0 || local("profileComment");
    default:
      return false;
  }
}
function leadMatchesTouchFilters(arg1, arg2) {
  if (!Array.isArray(arg2) || arg2.length === 0) {
    return true;
  }
  const result = arg2.filter(arg1 => arg1 && arg1 !== "touched" && arg1 !== "untouched");
  const result2 = arg2.includes("untouched");
  const result3 = arg2.includes("touched");
  if (result.length > 0) {
    return result.some(arg12 => leadHasTouchType(arg1, arg12));
  }
  if (result2 && result3) {
    return true;
  }
  if (result2) {
    return !leadHasAnyTouch(arg1);
  }
  if (result3) {
    return leadHasAnyTouch(arg1);
  }
  return true;
}
function parseCaptureDateTimeParts(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return null;
  }
  let result2 = result.match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (result2) {
    return {
      year: Number(result2[1]),
      month: Number(result2[2]),
      day: Number(result2[3]),
      hour: result2[4] != null ? Number(result2[4]) : null,
      minute: result2[5] != null ? Number(result2[5]) : null
    };
  }
  result2 = result.match(/^(\d{1,2})[-/.月](\d{1,2})日?(?:[\sT]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!result2) {
    return null;
  }
  return {
    year: new Date().getFullYear(),
    month: Number(result2[1]),
    day: Number(result2[2]),
    hour: result2[3] != null ? Number(result2[3]) : null,
    minute: result2[4] != null ? Number(result2[4]) : null
  };
}
function partsToStartMs(arg1, {
  endOfMinute = false
} = {}) {
  if (!arg1) {
    return null;
  }
  const {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute
  } = arg1;
  if (![year, month, day].every(Number.isFinite)) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const local = hour != null && minute != null && Number.isFinite(hour) && Number.isFinite(minute) && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  const value = local ? hour : 0;
  const value2 = local ? minute : 0;
  const value3 = endOfMinute && local ? 59 : 0;
  const value4 = endOfMinute && local ? 999 : 0;
  const result = new Date(year, month - 1, day, value, value2, value3, value4).getTime();
  if (!Number.isFinite(result)) {
    return null;
  }
  return {
    ms: result,
    hasTime: local
  };
}
function parseCaptureTimeFilter(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || result === "all") {
    return null;
  }
  if (result === "1d" || result === "3d" || result === "1w" || result === "今天" || result === "3天内" || result === "一周内") {
    const value = result === "今天" ? "1d" : result === "3天内" ? "3d" : result === "一周内" ? "1w" : result;
    return {
      kind: "range",
      key: value
    };
  }
  if (result.includes("~")) {
    const [local, local2] = result.split("~").map(arg1 => arg1.trim());
    const result2 = partsToStartMs(parseCaptureDateTimeParts(local));
    const result3 = partsToStartMs(parseCaptureDateTimeParts(local2), {
      endOfMinute: true
    });
    if (!result2 || !result3 || result3.ms < result2.ms) {
      return null;
    }
    return {
      kind: result2.hasTime || result3.hasTime ? "minute" : "day",
      start: result2.ms,
      end: result3.ms + 1
    };
  }
  const result2 = partsToStartMs(parseCaptureDateTimeParts(result));
  if (!result2) {
    return null;
  }
  if (result2.hasTime) {
    return {
      kind: "minute",
      start: result2.ms,
      end: result2.ms + 60000
    };
  }
  const result3 = parseCaptureDateTimeParts(result);
  const result4 = new Date(result3.year, result3.month - 1, result3.day + 1, 0, 0, 0, 0).getTime();
  return {
    kind: "day",
    start: result2.ms,
    end: result4
  };
}
function leadMatchesCaptureTimeFilter(arg1, arg2) {
  const result = parseCaptureTimeFilter(arg2);
  if (!result) {
    return true;
  }
  const result2 = getLeadCaptureTimestamp(arg1);
  if (!result2) {
    return false;
  }
  if (result.kind === "day" || result.kind === "minute") {
    return result2 >= result.start && result2 < result.end;
  }
  const result3 = Date.now();
  if (result.key === "1d") {
    return result3 - result2 <= 86400000;
  }
  if (result.key === "3d") {
    return result3 - result2 <= 259200000;
  }
  if (result.key === "1w") {
    return result3 - result2 <= 604800000;
  }
  return true;
}
function leadMatchesComplexFilters(arg1, options = {}) {
  if (!arg1) {
    return false;
  }
  const local = options || {};
  if (Array.isArray(local.entrySource) && local.entrySource.length) {
    const result = resolveLeadOrigin(arg1);
    if (!local.entrySource.includes(result)) {
      return false;
    }
  }
  if (local.minTouchTotal != null && local.minTouchTotal !== "") {
    const result = Number(local.minTouchTotal);
    if (Number.isFinite(result) && leadTouch.getTotalTouchCount(arg1.touchCounts) < result) {
      return false;
    }
  }
  if (!leadMatchesTouchFilters(arg1, local.touchTypes)) {
    return false;
  }
  if (local.timeRange && local.timeRange !== "all") {
    const result = parseCommentTime(arg1.timeText);
    const result2 = Date.now();
    if (local.timeRange === "1d" && result2 - result > 86400000) {
      return false;
    }
    if (local.timeRange === "3d" && result2 - result > 259200000) {
      return false;
    }
    if (local.timeRange === "1w" && result2 - result > 604800000) {
      return false;
    }
  }
  if (local.captureTimeRange && !leadMatchesCaptureTimeFilter(arg1, local.captureTimeRange)) {
    return false;
  }
  if (Array.isArray(local.accountFlags) && local.accountFlags.length) {
    const result = local.accountFlags.includes("private");
    const result2 = local.accountFlags.includes("noWorks");
    const flag = !!arg1.isPrivate;
    const local2 = !!arg1.noWorks || arg1.worksCount !== null && arg1.worksCount !== undefined && Number(arg1.worksCount) === 0;
    if (result && result2) {
      if (!flag && !local2) {
        return false;
      }
    } else if (result && !flag) {
      return false;
    } else if (result2 && !local2) {
      return false;
    }
  }
  return true;
}
module.exports = {
  leadMatchesComplexFilters: leadMatchesComplexFilters,
  resolveLeadOrigin: resolveLeadOrigin,
  leadHasAnyTouch: leadHasAnyTouch,
  getLeadCaptureTimestamp: getLeadCaptureTimestamp,
  parseCommentTime: parseCommentTime
};
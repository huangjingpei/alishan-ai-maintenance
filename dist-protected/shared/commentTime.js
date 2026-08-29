const COMMENT_TIME_FILTER_PRESET_MINUTES = Object.freeze({
  all: 0,
  "5m": 5,
  "1h": 60,
  "1d": 1440,
  "3d": 4320,
  "1w": 10080,
  "1mo": 43200,
  "1y": 525600
});
function resolveCommentTimeFilterMinutes(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || result === "all") {
    return 0;
  }
  if (Object.prototype.hasOwnProperty.call(COMMENT_TIME_FILTER_PRESET_MINUTES, result)) {
    return COMMENT_TIME_FILTER_PRESET_MINUTES[result];
  }
  const result2 = Number(result);
  if (Number.isFinite(result2) && result2 > 0) {
    return Math.floor(result2);
  }
  return 0;
}
function isCommentWithinWindowMinutes(arg1, arg2, options = {}) {
  const local = Number(arg2) || 0;
  if (local <= 0) {
    return true;
  }
  const result = parseCommentAgeMinutes(arg1);
  if (result == null) {
    return options.allowUnknown === true;
  }
  return result < local;
}
function isCommentWithinTimeFilter(arg1, arg2, options = {}) {
  return isCommentWithinWindowMinutes(arg1, resolveCommentTimeFilterMinutes(arg2), options);
}
function parseCommentAgeMinutes(arg1) {
  if (!arg1 || !String(arg1).trim()) {
    return null;
  }
  const date = new Date();
  const result = String(arg1).trim();
  let local = null;
  const result2 = result.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const result3 = result.match(/^(\d{1,2})-(\d{1,2})/);
  const result4 = result.match(/^(\d{1,2}):(\d{2})$/);
  const result5 = result.match(/^昨天(?:\s*(\d{1,2}):(\d{2}))?/);
  if (result2) {
    local = new Date(result2[1], result2[2] - 1, result2[3]);
  } else if (result3 && !result.includes("前")) {
    local = new Date(date.getFullYear(), result3[1] - 1, result3[2]);
    if (local > date) {
      local.setFullYear(date.getFullYear() - 1);
    }
  } else if (result4) {
    local = new Date(date.getFullYear(), date.getMonth(), date.getDate(), result4[1], result4[2]);
    if (local > date) {
      local.setDate(date.getDate() - 1);
    }
  } else if (result5) {
    local = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, result5[1] || 12, result5[2] || 0);
  }
  let local2 = null;
  if (result.includes("刚刚")) {
    local2 = 0;
  } else if (result.includes("分钟前")) {
    local2 = parseInt(result, 10) || 0;
  } else if (result.includes("小时前")) {
    local2 = (parseInt(result, 10) || 0) * 60;
  } else if (result === "昨天" || result5) {
    if (local) {
      local2 = Math.max(0, Math.floor((date - local) / 60000));
    } else {
      local2 = 1440;
    }
  } else if (result.includes("天前")) {
    local2 = (parseInt(result, 10) || 0) * 24 * 60;
  } else if (result.includes("周前")) {
    local2 = (parseInt(result, 10) || 0) * 7 * 24 * 60;
  } else if (result.includes("月前")) {
    const result2 = parseInt(result, 10);
    local2 = (Number.isFinite(result2) && result2 > 0 ? result2 : 1) * 30 * 24 * 60;
  } else if (result.includes("年前")) {
    const result2 = parseInt(result, 10);
    local2 = (Number.isFinite(result2) && result2 > 0 ? result2 : 1) * 365 * 24 * 60;
  } else if (local) {
    local2 = Math.floor((date - local) / 60000);
  }
  if (local2 == null || !Number.isFinite(local2) || local2 < 0) {
    return null;
  }
  return local2;
}
function formatCommentAgeLabel(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "时间未知";
  }
  const result2 = parseCommentAgeMinutes(result);
  if (result2 == null) {
    return result;
  }
  if (result2 === 0) {
    return "刚刚";
  }
  if (result2 < 60) {
    return result2 + " 分钟前";
  }
  if (result2 < 1440) {
    return Math.floor(result2 / 60) + " 小时前";
  }
  return result;
}
function stripLocationFromCommentTimeText(arg1) {
  return String(arg1 || "").replace(/\s*[·•･・.\-|｜]\s*(?:IP属地[:：\s]*)?[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").replace(/\s*IP属地[:：\s]*[\u4e00-\u9fffA-Za-z]{2,12}\s*$/i, "").trim();
}
function formatCommentTimeWithLocation(arg1, text = "") {
  const result = String(arg1 || "").trim();
  const result2 = String(text || "").trim();
  const result3 = stripLocationFromCommentTimeText(result);
  const local = result3 || result;
  if (!result2 || result2 === "未知") {
    return result || local || "";
  }
  if (!local) {
    return result2;
  }
  return local + " · " + result2;
}
function normalizeCommentIpLocationText(arg1) {
  return String(arg1 || "").replace(/^IP[属地]*[:：\s]*/i, "").replace(/^[·•･・.\-|｜]\s*/, "").trim();
}
const COMMENT_RELATIVE_TIME_RE = /(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/;
function linesBeforeNestedReplies(list = []) {
  const list2 = [];
  for (const item of Array.isArray(list) ? list : []) {
    const result = String(item || "").trim();
    if (!result) {
      continue;
    }
    if (result === "作者") {
      break;
    }
    if (/展开\s*\d+\s*条/.test(result)) {
      break;
    }
    if (/^\d+\s*条回复/.test(result)) {
      break;
    }
    if (/^回复\s*\d+/.test(result)) {
      break;
    }
    list2.push(result);
  }
  return list2;
}
function pickPrimaryCommentTimeMeta(list = []) {
  const result = linesBeforeNestedReplies(list);
  for (const item of result) {
    const result = item.match(COMMENT_RELATIVE_TIME_RE);
    if (!result) {
      continue;
    }
    const local = result[1] || result[0];
    let text = "";
    const result2 = item.match(/(?:刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)\s*[·•･・.\-|｜]?\s*(?:IP属地[:：\s]*)?([\u4e00-\u9fff]{2,8})\s*$/);
    if (result2) {
      const result = normalizeCommentIpLocationText(result2[1]);
      if (result && !/^(分钟|小时|天|周|月|年|前|刚刚|昨天)$/.test(result)) {
        text = result;
      }
    }
    return {
      time: local,
      timeOriginal: item,
      ipLocation: text
    };
  }
  return {
    time: "",
    timeOriginal: "",
    ipLocation: ""
  };
}
function resolveCommentLocationText(options = {}) {
  const result = normalizeCommentIpLocationText(options.ipLocation || options.location || "");
  if (result && result !== "未知") {
    return result;
  }
  const result2 = String(options.timeOriginal || options.timeText || options.time || "").trim();
  if (!result2) {
    return "";
  }
  return pickPrimaryCommentTimeMeta([result2]).ipLocation || "";
}
module.exports = {
  COMMENT_TIME_FILTER_PRESET_MINUTES: COMMENT_TIME_FILTER_PRESET_MINUTES,
  resolveCommentTimeFilterMinutes: resolveCommentTimeFilterMinutes,
  isCommentWithinWindowMinutes: isCommentWithinWindowMinutes,
  isCommentWithinTimeFilter: isCommentWithinTimeFilter,
  parseCommentAgeMinutes: parseCommentAgeMinutes,
  formatCommentAgeLabel: formatCommentAgeLabel,
  stripLocationFromCommentTimeText: stripLocationFromCommentTimeText,
  formatCommentTimeWithLocation: formatCommentTimeWithLocation,
  COMMENT_RELATIVE_TIME_RE: COMMENT_RELATIVE_TIME_RE,
  linesBeforeNestedReplies: linesBeforeNestedReplies,
  pickPrimaryCommentTimeMeta: pickPrimaryCommentTimeMeta,
  normalizeCommentIpLocationText: normalizeCommentIpLocationText,
  resolveCommentLocationText: resolveCommentLocationText
};
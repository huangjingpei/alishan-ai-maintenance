const {
  evaluateLocationFilter,
  normalizeLocationFilterRegions
} = require("./locationFilter");
const {
  isCommentWithinWindowMinutes,
  parseCommentAgeMinutes,
  resolveCommentLocationText
} = require("./commentTime");
const {
  parseExcludedCommentKeywords
} = require("./automationTextHelpers");
const {
  normalizeCommentCompareText,
  isNicknameAsCommentBody,
  isNicknameCommentLine,
  isCommentCardDumpText,
  isDouyinCommentActionChromeText,
  looksLikeDouyinCommentLocationResidue
} = require("./douyinCommentContentLines");
const COMMENT_WINDOW_MAX_MINUTES = 43200;
const COMMENT_TIME_PRESET_LABELS = Object.freeze({
  all: "全部",
  "1d": "1天内",
  "3d": "3天内",
  "1w": "1周内",
  "1mo": "1个月内",
  custom: "自定义"
});
const COMMENT_TIME_PRESET_MINUTES = Object.freeze({
  all: 0,
  "1d": 1440,
  "3d": 4320,
  "1w": 10080,
  "1mo": 43200
});
function parseKeywordList(arg1) {
  return parseExcludedCommentKeywords(arg1);
}
function normalizeCommentWindowMinutes(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return 0;
  }
  return Math.min(COMMENT_WINDOW_MAX_MINUTES, Math.max(0, Math.floor(result)));
}
function normalizeCommentLocationMode(arg1) {
  if (arg1 === "exclude") {
    return "exclude";
  } else {
    return "include";
  }
}
function coerceKeywordList(arg1) {
  if (Array.isArray(arg1)) {
    return arg1.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  }
  return parseKeywordList(arg1);
}
function resolveWindowMinutesFromConfig(options = {}) {
  const result = String(options.commentTimePreset || "").trim();
  if (result && Object.prototype.hasOwnProperty.call(COMMENT_TIME_PRESET_MINUTES, result)) {
    if (result === "custom") {
      return normalizeCommentWindowMinutes(options.commentWindowMinutes ?? options.windowMinutes);
    }
    return COMMENT_TIME_PRESET_MINUTES[result];
  }
  return normalizeCommentWindowMinutes(options.commentWindowMinutes ?? options.windowMinutes);
}
function normalizeEntityCommentFilters(options = {}) {
  const result = resolveWindowMinutesFromConfig(options);
  const result2 = normalizeCommentLocationMode(options.commentLocationFilterMode ?? options.locationFilterMode ?? options.locationMode);
  const result3 = normalizeLocationFilterRegions(options.commentLocationFilterRegions ?? options.locationFilterRegions ?? options.locationRegions);
  const result4 = coerceKeywordList(options.commentIncludeKeywords ?? options.includeKeywords);
  const result5 = coerceKeywordList(options.commentExcludeKeywords ?? options.excludeKeywords);
  return {
    windowMinutes: result,
    locationMode: result2,
    locationRegions: result3,
    includeKeywords: result4,
    excludeKeywords: result5,
    active: result > 0 || result3.length > 0 || result4.length > 0 || result5.length > 0
  };
}
function escapeKeywordRegExp(arg1) {
  return String(arg1 || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const COMMENT_BODY_PLACEHOLDERS = new Set(["视频评论区潜客", "[表情或表情包]", "[表情]", "[图片]", "[图片评论]"]);
function isLikelyNicknameLeakAsBody(arg1, arg2) {
  if (isNicknameAsCommentBody(arg1, arg2) || isNicknameCommentLine(arg1, arg2)) {
    return true;
  }
  const result = normalizeCommentCompareText(arg1);
  const result2 = normalizeCommentCompareText(arg2);
  if (!result || !result2) {
    return false;
  }
  if (/[，。！？、,.!?]/.test(String(arg1 || ""))) {
    return false;
  }
  if (result.includes(result2) && result2.length >= 2 && result.length <= result2.length + 8 && !/\s/.test(String(arg1 || "").trim())) {
    return result.length >= 4 || result === result2;
  }
  if (result2.includes(result) && result.length >= 4 && result.length >= result2.length - 6) {
    return true;
  }
  return false;
}
function commentBodyForKeywordMatch(options = {}) {
  let result = String(options.content || options.text || "").trim();
  if (!result || COMMENT_BODY_PLACEHOLDERS.has(result)) {
    return "";
  }
  const result2 = String(options.nickname || options.nickName || "").trim().replace(/^@+/, "");
  if (isLikelyNicknameLeakAsBody(result, result2)) {
    return "";
  }
  if (isCommentCardDumpText(result, result2) && result2) {
    result = result.replace(new RegExp(escapeKeywordRegExp(result2), "g"), " ");
  } else if (result2) {
    const result3 = escapeKeywordRegExp(result2);
    result = result.replace(new RegExp("^@?" + result3 + "[\\s:：·•]*"), "").trim();
  }
  result = result.replace(/(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)(\s*[·•]\s*[\u4e00-\u9fff]{2,10})?/g, " ").replace(/IP属地[:：]?\s*[\u4e00-\u9fff]{2,10}/gi, " ").replace(/(?:展开\s*\d*\s*条?回复|查看\s*\d*\s*条?回复|更多回复|收起回复|作者赞过)/g, " ").replace(/\s+/g, " ").trim();
  if (!result || COMMENT_BODY_PLACEHOLDERS.has(result)) {
    return "";
  }
  if (isDouyinCommentActionChromeText(result)) {
    return "";
  }
  if (isLikelyNicknameLeakAsBody(result, result2)) {
    return "";
  }
  const result3 = String(options.ipLocation || options.location || "").trim();
  if (looksLikeDouyinCommentLocationResidue(result) && result3 && (normalizeCommentCompareText(result) === normalizeCommentCompareText(result3) || result3.includes(result))) {
    return "";
  }
  return result;
}
function matchesAnyKeyword(arg1, arg2) {
  const result = String(arg1 || "");
  if (!result || !arg2.length) {
    return false;
  }
  const result2 = result.toLowerCase();
  return arg2.some(arg1 => {
    const result3 = String(arg1 || "").trim();
    if (!result3) {
      return false;
    }
    return result.includes(result3) || result2.includes(result3.toLowerCase());
  });
}
function evaluateEntityCommentFilters(options = {}, options2 = {}) {
  const value = options2.active != null && options2.windowMinutes != null ? options2 : normalizeEntityCommentFilters(options2);
  if (!value.active) {
    return {
      pass: true,
      body: commentBodyForKeywordMatch(options)
    };
  }
  const result = commentBodyForKeywordMatch(options);
  const result2 = String(options.time || options.timeText || options.timeOriginal || "").trim();
  const result3 = resolveCommentLocationText(options);
  if (value.windowMinutes > 0) {
    if (!isCommentWithinWindowMinutes(result2, value.windowMinutes)) {
      const result3 = parseCommentAgeMinutes(result2);
      return {
        pass: false,
        reason: result3 == null ? "时间未知" : "超出 " + value.windowMinutes + " 分钟",
        body: result
      };
    }
  }
  if (value.locationRegions.length) {
    const result2 = evaluateLocationFilter(result3, value.locationMode, value.locationRegions);
    if (!result2.pass) {
      return {
        pass: false,
        reason: result2.reason || "地区不符",
        body: result
      };
    }
  }
  if (value.includeKeywords.length) {
    if (!matchesAnyKeyword(result, value.includeKeywords)) {
      return {
        pass: false,
        reason: "未命中包含关键词",
        body: result
      };
    }
  }
  if (value.excludeKeywords.length) {
    if (matchesAnyKeyword(result, value.excludeKeywords)) {
      return {
        pass: false,
        reason: "命中排除关键词",
        body: result
      };
    }
  }
  return {
    pass: true,
    body: result
  };
}
function clipEntityCommentFilterText(arg1, num = 36) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result) {
    return "";
  }
  if (result.length > num) {
    return result.slice(0, num) + "…";
  } else {
    return result;
  }
}
function formatEntityCommentFilterLogLine(options = {}, options2 = {}, options3 = {}) {
  const value = Array.isArray(options3?.includeKeywords) ? options3.includeKeywords : [];
  const result = String(options.nickname || "").trim();
  const result2 = String(options.content || options.text || "").trim();
  const result3 = String(options2?.body || "").trim();
  const result4 = value.filter(arg1 => result3.includes(arg1) || result2.includes(arg1));
  let value2 = "🔍 筛选@" + clipEntityCommentFilterText(result, 16) + " 原文「" + clipEntityCommentFilterText(result2) + "」";
  if (result3 && result3 !== result2) {
    value2 += " 正文「" + clipEntityCommentFilterText(result3) + "」";
  }
  if (options2?.pass) {
    value2 += result4.length ? " → 过筛（命中「" + result4.join("、") + "」）" : " → 过筛";
  } else {
    value2 += " → 未过筛" + (options2?.reason ? "（" + options2.reason + "）" : "");
  }
  return value2;
}
function formatEntityCommentFiltersSummary(options = {}) {
  const result = normalizeEntityCommentFilters(options);
  if (!result.active) {
    return "不限";
  }
  const list = [];
  if (result.windowMinutes > 0) {
    const result2 = String(options.commentTimePreset || "").trim();
    if (result2 && result2 !== "custom" && COMMENT_TIME_PRESET_LABELS[result2]) {
      list.push(COMMENT_TIME_PRESET_LABELS[result2]);
    } else if (result2 === "custom") {
      list.push("自定义 " + result.windowMinutes + " 分钟内");
    } else {
      list.push(result.windowMinutes + " 分钟内");
    }
  }
  if (result.locationRegions.length) {
    const value = result.locationMode === "exclude" ? "不包含" : "包含";
    list.push("地区" + value + " " + result.locationRegions.join("、"));
  }
  if (result.includeKeywords.length) {
    list.push("含词 " + result.includeKeywords.slice(0, 3).join("、") + (result.includeKeywords.length > 3 ? "…" : ""));
  }
  if (result.excludeKeywords.length) {
    list.push("排除 " + result.excludeKeywords.slice(0, 3).join("、") + (result.excludeKeywords.length > 3 ? "…" : ""));
  }
  return list.join("；") || "不限";
}
module.exports = {
  COMMENT_WINDOW_MAX_MINUTES: COMMENT_WINDOW_MAX_MINUTES,
  parseKeywordList: parseKeywordList,
  normalizeCommentWindowMinutes: normalizeCommentWindowMinutes,
  normalizeCommentLocationMode: normalizeCommentLocationMode,
  normalizeEntityCommentFilters: normalizeEntityCommentFilters,
  evaluateEntityCommentFilters: evaluateEntityCommentFilters,
  formatEntityCommentFiltersSummary: formatEntityCommentFiltersSummary,
  formatEntityCommentFilterLogLine: formatEntityCommentFilterLogLine,
  matchesAnyKeyword: matchesAnyKeyword,
  commentBodyForKeywordMatch: commentBodyForKeywordMatch
};
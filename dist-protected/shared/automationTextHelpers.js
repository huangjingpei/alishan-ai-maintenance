'use strict';

function isFatalAiAuthError(arg1) {
  if (!arg1) {
    return false;
  }
  const result = String(arg1);
  return result.includes("额度已用完") || result.includes("已用完") || result.includes("卡密已过期") || result.includes("授权码无效") || result.includes("设备已被封") || result.includes("余额不足") || result.includes("未授权");
}
function clipTraceText(arg1, num = 120) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (result.length > num) {
    return result.slice(0, num) + "…";
  } else {
    return result;
  }
}
function personalizeDmTemplate(arg1, options = {}) {
  const local = String(options?.nickname || options?.name || "朋友").trim() || "朋友";
  return String(arg1 || "").replace(/\{nickname\}/g, local);
}
function parseExcludedCommentKeywords(arg1) {
  return String(arg1 || "").split(/[,，\n\r]+/).map(arg1 => arg1.trim()).filter(Boolean);
}
function parseTitleKeywordList(arg1) {
  return String(arg1 || "").split(/[,，]/).map(arg1 => arg1.trim()).filter(Boolean);
}
function matchTitleKeywordList(arg1, list = []) {
  const result = String(arg1 || "").toLowerCase();
  if (!result || !Array.isArray(list) || !list.length) {
    return "";
  }
  return list.find(arg1 => result.includes(String(arg1).toLowerCase())) || "";
}
function parseAgeFromText(arg1) {
  if (!arg1) {
    return null;
  }
  const result = String(arg1).match(/(\d{1,2})岁/);
  if (!result) {
    return null;
  }
  const result2 = parseInt(result[1], 10);
  if (!Number.isFinite(result2) || result2 < 1 || result2 > 120) {
    return null;
  }
  return result2;
}
module.exports = {
  isFatalAiAuthError: isFatalAiAuthError,
  clipTraceText: clipTraceText,
  personalizeDmTemplate: personalizeDmTemplate,
  parseExcludedCommentKeywords: parseExcludedCommentKeywords,
  parseTitleKeywordList: parseTitleKeywordList,
  matchTitleKeywordList: matchTitleKeywordList,
  parseAgeFromText: parseAgeFromText
};
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
function parseKeywordList(_0x5e86ce) {
  return parseExcludedCommentKeywords(_0x5e86ce);
}
function normalizeCommentWindowMinutes(_0x2a8192) {
  const _0x5074d5 = Number(_0x2a8192);
  if (!Number.isFinite(_0x5074d5) || _0x5074d5 <= 0) {
    return 0;
  }
  return Math.min(COMMENT_WINDOW_MAX_MINUTES, Math.max(0, Math.floor(_0x5074d5)));
}
function normalizeCommentLocationMode(_0x6b71a7) {
  if (_0x6b71a7 === "exclude") {
    return "exclude";
  } else {
    return "include";
  }
}
function coerceKeywordList(_0x401299) {
  if (Array.isArray(_0x401299)) {
    return _0x401299.map(_0x112f4b => String(_0x112f4b || "").trim()).filter(Boolean);
  }
  return parseKeywordList(_0x401299);
}
function resolveWindowMinutesFromConfig(_0x24987c = {}) {
  const _0x5b5ff = String(_0x24987c.commentTimePreset || "").trim();
  if (_0x5b5ff && Object.prototype.hasOwnProperty.call(COMMENT_TIME_PRESET_MINUTES, _0x5b5ff)) {
    if (_0x5b5ff === "custom") {
      return normalizeCommentWindowMinutes(_0x24987c.commentWindowMinutes ?? _0x24987c.windowMinutes);
    }
    return COMMENT_TIME_PRESET_MINUTES[_0x5b5ff];
  }
  return normalizeCommentWindowMinutes(_0x24987c.commentWindowMinutes ?? _0x24987c.windowMinutes);
}
function normalizeEntityCommentFilters(_0x414102 = {}) {
  const _0x445036 = resolveWindowMinutesFromConfig(_0x414102);
  const _0x32be5a = normalizeCommentLocationMode(_0x414102.commentLocationFilterMode ?? _0x414102.locationFilterMode ?? _0x414102.locationMode);
  const _0x1fe2f1 = normalizeLocationFilterRegions(_0x414102.commentLocationFilterRegions ?? _0x414102.locationFilterRegions ?? _0x414102.locationRegions);
  const _0x2a77cd = coerceKeywordList(_0x414102.commentIncludeKeywords ?? _0x414102.includeKeywords);
  const _0x4282c5 = coerceKeywordList(_0x414102.commentExcludeKeywords ?? _0x414102.excludeKeywords);
  return {
    windowMinutes: _0x445036,
    locationMode: _0x32be5a,
    locationRegions: _0x1fe2f1,
    includeKeywords: _0x2a77cd,
    excludeKeywords: _0x4282c5,
    active: _0x445036 > 0 || _0x1fe2f1.length > 0 || _0x2a77cd.length > 0 || _0x4282c5.length > 0
  };
}
function escapeKeywordRegExp(_0x21bc81) {
  return String(_0x21bc81 || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const COMMENT_BODY_PLACEHOLDERS = new Set(["视频评论区潜客", "[表情或表情包]", "[表情]", "[图片]", "[图片评论]"]);
function isLikelyNicknameLeakAsBody(_0x552745, _0x1ac921) {
  if (isNicknameAsCommentBody(_0x552745, _0x1ac921) || isNicknameCommentLine(_0x552745, _0x1ac921)) {
    return true;
  }
  const _0x1b89a3 = normalizeCommentCompareText(_0x552745);
  const _0x2a79e1 = normalizeCommentCompareText(_0x1ac921);
  if (!_0x1b89a3 || !_0x2a79e1) {
    return false;
  }
  if (/[，。！？、,.!?]/.test(String(_0x552745 || ""))) {
    return false;
  }
  if (_0x1b89a3.includes(_0x2a79e1) && _0x2a79e1.length >= 2 && _0x1b89a3.length <= _0x2a79e1.length + 8 && !/\s/.test(String(_0x552745 || "").trim())) {
    return _0x1b89a3.length >= 4 || _0x1b89a3 === _0x2a79e1;
  }
  if (_0x2a79e1.includes(_0x1b89a3) && _0x1b89a3.length >= 4 && _0x1b89a3.length >= _0x2a79e1.length - 6) {
    return true;
  }
  return false;
}
function commentBodyForKeywordMatch(_0x533236 = {}) {
  let _0x4f7d70 = String(_0x533236.content || _0x533236.text || "").trim();
  if (!_0x4f7d70 || COMMENT_BODY_PLACEHOLDERS.has(_0x4f7d70)) {
    return "";
  }
  const _0xe6f7cd = String(_0x533236.nickname || _0x533236.nickName || "").trim().replace(/^@+/, "");
  if (isLikelyNicknameLeakAsBody(_0x4f7d70, _0xe6f7cd)) {
    return "";
  }
  if (isCommentCardDumpText(_0x4f7d70, _0xe6f7cd) && _0xe6f7cd) {
    _0x4f7d70 = _0x4f7d70.replace(new RegExp(escapeKeywordRegExp(_0xe6f7cd), "g"), " ");
  } else if (_0xe6f7cd) {
    const _0x449e32 = escapeKeywordRegExp(_0xe6f7cd);
    _0x4f7d70 = _0x4f7d70.replace(new RegExp("^@?" + _0x449e32 + "[\\s:：·•]*"), "").trim();
  }
  _0x4f7d70 = _0x4f7d70.replace(/(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)(\s*[·•]\s*[\u4e00-\u9fff]{2,10})?/g, " ").replace(/IP属地[:：]?\s*[\u4e00-\u9fff]{2,10}/gi, " ").replace(/(?:展开\s*\d*\s*条?回复|查看\s*\d*\s*条?回复|更多回复|收起回复|作者赞过)/g, " ").replace(/\s+/g, " ").trim();
  if (!_0x4f7d70 || COMMENT_BODY_PLACEHOLDERS.has(_0x4f7d70)) {
    return "";
  }
  if (isDouyinCommentActionChromeText(_0x4f7d70)) {
    return "";
  }
  if (isLikelyNicknameLeakAsBody(_0x4f7d70, _0xe6f7cd)) {
    return "";
  }
  const _0x230f70 = String(_0x533236.ipLocation || _0x533236.location || "").trim();
  if (looksLikeDouyinCommentLocationResidue(_0x4f7d70) && _0x230f70 && (normalizeCommentCompareText(_0x4f7d70) === normalizeCommentCompareText(_0x230f70) || _0x230f70.includes(_0x4f7d70))) {
    return "";
  }
  return _0x4f7d70;
}
function matchesAnyKeyword(_0x29a966, _0x5ca002) {
  const _0x5a33fc = String(_0x29a966 || "");
  if (!_0x5a33fc || !_0x5ca002.length) {
    return false;
  }
  const _0x459a34 = _0x5a33fc.toLowerCase();
  return _0x5ca002.some(_0x23c5d0 => {
    const _0x494f60 = String(_0x23c5d0 || "").trim();
    if (!_0x494f60) {
      return false;
    }
    return _0x5a33fc.includes(_0x494f60) || _0x459a34.includes(_0x494f60.toLowerCase());
  });
}
function evaluateEntityCommentFilters(_0x57d18d = {}, _0x1840b8 = {}) {
  const _0x31aa5b = _0x1840b8.active != null && _0x1840b8.windowMinutes != null ? _0x1840b8 : normalizeEntityCommentFilters(_0x1840b8);
  if (!_0x31aa5b.active) {
    return {
      pass: true,
      body: commentBodyForKeywordMatch(_0x57d18d)
    };
  }
  const _0x10754f = commentBodyForKeywordMatch(_0x57d18d);
  const _0x4b2cfc = String(_0x57d18d.time || _0x57d18d.timeText || _0x57d18d.timeOriginal || "").trim();
  const _0x9fc67d = resolveCommentLocationText(_0x57d18d);
  if (_0x31aa5b.windowMinutes > 0) {
    if (!isCommentWithinWindowMinutes(_0x4b2cfc, _0x31aa5b.windowMinutes)) {
      const _0x36bd9f = parseCommentAgeMinutes(_0x4b2cfc);
      return {
        pass: false,
        reason: _0x36bd9f == null ? "时间未知" : "超出 " + _0x31aa5b.windowMinutes + " 分钟",
        body: _0x10754f
      };
    }
  }
  if (_0x31aa5b.locationRegions.length) {
    const _0x59846c = evaluateLocationFilter(_0x9fc67d, _0x31aa5b.locationMode, _0x31aa5b.locationRegions);
    if (!_0x59846c.pass) {
      return {
        pass: false,
        reason: _0x59846c.reason || "地区不符",
        body: _0x10754f
      };
    }
  }
  if (_0x31aa5b.includeKeywords.length) {
    if (!matchesAnyKeyword(_0x10754f, _0x31aa5b.includeKeywords)) {
      return {
        pass: false,
        reason: "未命中包含关键词",
        body: _0x10754f
      };
    }
  }
  if (_0x31aa5b.excludeKeywords.length) {
    if (matchesAnyKeyword(_0x10754f, _0x31aa5b.excludeKeywords)) {
      return {
        pass: false,
        reason: "命中排除关键词",
        body: _0x10754f
      };
    }
  }
  return {
    pass: true,
    body: _0x10754f
  };
}
function clipEntityCommentFilterText(_0x44c55d, _0x15a8ac = 36) {
  const _0x59169c = String(_0x44c55d || "").replace(/\s+/g, " ").trim();
  if (!_0x59169c) {
    return "";
  }
  if (_0x59169c.length > _0x15a8ac) {
    return _0x59169c.slice(0, _0x15a8ac) + "…";
  } else {
    return _0x59169c;
  }
}
function formatEntityCommentFilterLogLine(_0x5968cc = {}, _0x1725b7 = {}, _0x43146d = {}) {
  const _0x557ad0 = Array.isArray(_0x43146d?.includeKeywords) ? _0x43146d.includeKeywords : [];
  const _0x54cf00 = String(_0x5968cc.nickname || "").trim();
  const _0x1a6a49 = String(_0x5968cc.content || _0x5968cc.text || "").trim();
  const _0x220d2c = String(_0x1725b7?.body || "").trim();
  const _0x39662d = _0x557ad0.filter(_0x3894e2 => _0x220d2c.includes(_0x3894e2) || _0x1a6a49.includes(_0x3894e2));
  let _0x46e7a1 = "🔍 筛选@" + clipEntityCommentFilterText(_0x54cf00, 16) + " 原文「" + clipEntityCommentFilterText(_0x1a6a49) + "」";
  if (_0x220d2c && _0x220d2c !== _0x1a6a49) {
    _0x46e7a1 += " 正文「" + clipEntityCommentFilterText(_0x220d2c) + "」";
  }
  if (_0x1725b7?.pass) {
    _0x46e7a1 += _0x39662d.length ? " → 过筛（命中「" + _0x39662d.join("、") + "」）" : " → 过筛";
  } else {
    _0x46e7a1 += " → 未过筛" + (_0x1725b7?.reason ? "（" + _0x1725b7.reason + "）" : "");
  }
  return _0x46e7a1;
}
function formatEntityCommentFiltersSummary(_0x22687e = {}) {
  const _0x350ae5 = normalizeEntityCommentFilters(_0x22687e);
  if (!_0x350ae5.active) {
    return "不限";
  }
  const _0x214296 = [];
  if (_0x350ae5.windowMinutes > 0) {
    const _0x1e0c2f = String(_0x22687e.commentTimePreset || "").trim();
    if (_0x1e0c2f && _0x1e0c2f !== "custom" && COMMENT_TIME_PRESET_LABELS[_0x1e0c2f]) {
      _0x214296.push(COMMENT_TIME_PRESET_LABELS[_0x1e0c2f]);
    } else if (_0x1e0c2f === "custom") {
      _0x214296.push("自定义 " + _0x350ae5.windowMinutes + " 分钟内");
    } else {
      _0x214296.push(_0x350ae5.windowMinutes + " 分钟内");
    }
  }
  if (_0x350ae5.locationRegions.length) {
    const _0x12212c = _0x350ae5.locationMode === "exclude" ? "不包含" : "包含";
    _0x214296.push("地区" + _0x12212c + " " + _0x350ae5.locationRegions.join("、"));
  }
  if (_0x350ae5.includeKeywords.length) {
    _0x214296.push("含词 " + _0x350ae5.includeKeywords.slice(0, 3).join("、") + (_0x350ae5.includeKeywords.length > 3 ? "…" : ""));
  }
  if (_0x350ae5.excludeKeywords.length) {
    _0x214296.push("排除 " + _0x350ae5.excludeKeywords.slice(0, 3).join("、") + (_0x350ae5.excludeKeywords.length > 3 ? "…" : ""));
  }
  return _0x214296.join("；") || "不限";
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
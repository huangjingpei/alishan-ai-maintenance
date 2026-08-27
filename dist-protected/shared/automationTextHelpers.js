'use strict';

function isFatalAiAuthError(_0x1d19dd) {
  if (!_0x1d19dd) {
    return false;
  }
  const _0x3f9655 = String(_0x1d19dd);
  return _0x3f9655.includes("额度已用完") || _0x3f9655.includes("已用完") || _0x3f9655.includes("卡密已过期") || _0x3f9655.includes("授权码无效") || _0x3f9655.includes("设备已被封") || _0x3f9655.includes("余额不足") || _0x3f9655.includes("未授权");
}
function clipTraceText(_0x96ceef, _0x248170 = 120) {
  const _0x5e00b6 = String(_0x96ceef || "").trim();
  if (!_0x5e00b6) {
    return "";
  }
  if (_0x5e00b6.length > _0x248170) {
    return _0x5e00b6.slice(0, _0x248170) + "…";
  } else {
    return _0x5e00b6;
  }
}
function personalizeDmTemplate(_0x547d91, _0x6557fd = {}) {
  const _0x7cf02 = String(_0x6557fd?.nickname || _0x6557fd?.name || "朋友").trim() || "朋友";
  return String(_0x547d91 || "").replace(/\{nickname\}/g, _0x7cf02);
}
function parseExcludedCommentKeywords(_0x1ff184) {
  return String(_0x1ff184 || "").split(/[,，\n\r]+/).map(_0x1ef1c0 => _0x1ef1c0.trim()).filter(Boolean);
}
function parseTitleKeywordList(_0x47bc69) {
  return String(_0x47bc69 || "").split(/[,，]/).map(_0xa0407c => _0xa0407c.trim()).filter(Boolean);
}
function matchTitleKeywordList(_0x355056, _0xb8fa0b = []) {
  const _0x41b355 = String(_0x355056 || "").toLowerCase();
  if (!_0x41b355 || !Array.isArray(_0xb8fa0b) || !_0xb8fa0b.length) {
    return "";
  }
  return _0xb8fa0b.find(_0x4bfa7f => _0x41b355.includes(String(_0x4bfa7f).toLowerCase())) || "";
}
function parseAgeFromText(_0x4f329b) {
  if (!_0x4f329b) {
    return null;
  }
  const _0x106f88 = String(_0x4f329b).match(/(\d{1,2})岁/);
  if (!_0x106f88) {
    return null;
  }
  const _0x24182c = parseInt(_0x106f88[1], 10);
  if (!Number.isFinite(_0x24182c) || _0x24182c < 1 || _0x24182c > 120) {
    return null;
  }
  return _0x24182c;
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
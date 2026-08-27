'use strict';

const INVISIBLE_CHAR_RE = /[\u034F\u180E\u200B-\u200D\u2060-\u2064\uFEFF]/g;
const RISKY_EMOJI_TO_CN = new Map([["🌹", "[玫瑰]"], ["🥀", "[玫瑰]"], ["🌷", "[鲜花]"], ["🌸", "[鲜花]"], ["🌺", "[鲜花]"], ["🌻", "[鲜花]"], ["🌼", "[鲜花]"], ["💐", "[花束]"], ["🍀", "[幸运]"], ["❤️", "[爱心]"], ["❤", "[爱心]"], ["♥️", "[爱心]"], ["♥", "[爱心]"], ["❣️", "[爱]"], ["❣", "[爱]"], ["💕", "[爱心]"], ["💖", "[爱心]"], ["💗", "[爱心]"], ["💓", "[爱心]"], ["💞", "[爱心]"], ["💘", "[爱心]"], ["💝", "[爱心]"], ["🧡", "[爱心]"], ["💛", "[爱心]"], ["💚", "[爱心]"], ["💙", "[爱心]"], ["💜", "[爱心]"], ["🤍", "[爱心]"], ["🖤", "[爱心]"], ["🤎", "[爱心]"], ["💢", "[爱]"]]);
const RISKY_COMMENT_EMOJI_RE = new RegExp("[\\u{1F337}-\\u{1F33F}\\u{1F490}-\\u{1F49F}\\u{1F9E1}\\u{2764}\\u{FE0F}?\\u{2665}\\u{FE0F}?\\u{2763}\\u{FE0F}?]", "gu");
function fallbackLabelForRiskyEmoji(_0x481fdd) {
  const _0x9f7a2f = _0x481fdd.codePointAt(0) || 0;
  if (_0x9f7a2f >= 127799 && _0x9f7a2f <= 127807) {
    return "[鲜花]";
  }
  if (_0x9f7a2f >= 128144 && _0x9f7a2f <= 128159) {
    return "[爱心]";
  }
  if (_0x9f7a2f === 10084 || _0x9f7a2f === 9829 || _0x9f7a2f === 10083 || _0x9f7a2f === 129505) {
    return "[爱心]";
  }
  return "[爱心]";
}
function normalizeCommentCompareText(_0x3b0f03) {
  return String(_0x3b0f03 || "").replace(INVISIBLE_CHAR_RE, "").replace(/\[[^\[\]]{1,12}\]/g, "").replace(RISKY_COMMENT_EMOJI_RE, "").replace(/\s+/g, "").trim();
}
function replaceRiskyCommentEmojis(_0x5de90d) {
  const _0x523e54 = String(_0x5de90d || "");
  if (!_0x523e54) {
    return {
      text: _0x523e54,
      replaced: false,
      labels: ""
    };
  }
  const _0x3224c1 = [];
  let _0x33c1e6 = "";
  let _0x1cf365 = 0;
  while (_0x1cf365 < _0x523e54.length) {
    const _0x281e28 = _0x523e54.codePointAt(_0x1cf365);
    const _0x54385f = String.fromCodePoint(_0x281e28);
    const _0xa1e876 = _0x1cf365 + _0x54385f.length < _0x523e54.length && _0x523e54[_0x1cf365 + _0x54385f.length] === "️" ? _0x54385f + "️" : _0x54385f;
    const _0x1c8a75 = RISKY_EMOJI_TO_CN.get(_0xa1e876) || RISKY_EMOJI_TO_CN.get(_0x54385f);
    if (_0x1c8a75) {
      _0x33c1e6 += _0x1c8a75;
      _0x3224c1.push(_0x1c8a75);
      _0x1cf365 += _0xa1e876.length;
      continue;
    }
    if (RISKY_COMMENT_EMOJI_RE.test(_0x54385f)) {
      RISKY_COMMENT_EMOJI_RE.lastIndex = 0;
      const _0xe7daf4 = fallbackLabelForRiskyEmoji(_0x54385f);
      _0x33c1e6 += _0xe7daf4;
      _0x3224c1.push(_0xe7daf4);
      _0x1cf365 += _0x54385f.length;
      continue;
    }
    RISKY_COMMENT_EMOJI_RE.lastIndex = 0;
    _0x33c1e6 += _0x54385f;
    _0x1cf365 += _0x54385f.length;
  }
  return {
    text: _0x33c1e6,
    replaced: _0x3224c1.length > 0,
    labels: [...new Set(_0x3224c1)].join("")
  };
}
function stripRiskyCommentEmojis(_0x506127) {
  const _0xdafdba = replaceRiskyCommentEmojis(_0x506127);
  return {
    text: _0xdafdba.text,
    stripped: _0xdafdba.replaced,
    removed: _0xdafdba.labels
  };
}
function commentDraftHasCoreText(_0xfa7f34, _0x14e41a) {
  const _0x5e467e = normalizeCommentCompareText(_0xfa7f34);
  const _0x4984d1 = normalizeCommentCompareText(_0x14e41a);
  if (!_0x5e467e || !_0x4984d1) {
    return false;
  }
  if (_0x5e467e === _0x4984d1) {
    return true;
  }
  if (_0x5e467e.length >= 4 && _0x4984d1.includes(_0x5e467e)) {
    return true;
  }
  if (_0x4984d1.length >= 4 && _0x5e467e.includes(_0x4984d1)) {
    return true;
  }
  const _0x561712 = Math.min(8, _0x5e467e.length, _0x4984d1.length);
  return _0x561712 >= 4 && _0x5e467e.slice(0, _0x561712) === _0x4984d1.slice(0, _0x561712);
}
function isCommentDraftOnlyEmojiDrift(_0x39ed92, _0x5985e0) {
  const _0x5b30df = normalizeCommentCompareText(_0x39ed92);
  const _0x4c7672 = normalizeCommentCompareText(_0x5985e0);
  if (!_0x4c7672) {
    return false;
  }
  if (!_0x5b30df) {
    return false;
  }
  return _0x5b30df === _0x4c7672 || _0x5b30df.length >= 4 && _0x4c7672.includes(_0x5b30df);
}
function classifyCommentFailureToast(_0x17cf3a) {
  const _0x38bb22 = String(_0x17cf3a || "").replace(/\s+/g, " ").trim();
  if (!_0x38bb22) {
    return {
      code: "comment_failed",
      stopAccount: false,
      label: "评论失败"
    };
  }
  if (/操作太频繁|请稍后再试/.test(_0x38bb22)) {
    return {
      code: "rate_limited",
      stopAccount: true,
      label: "操作太频繁"
    };
  }
  if (/内容不符合|包含违规|审核未通过/.test(_0x38bb22)) {
    return {
      code: "content_rejected",
      stopAccount: true,
      label: "内容被拒"
    };
  }
  if (/服务异常|网络异常/.test(_0x38bb22)) {
    return {
      code: "service_error",
      stopAccount: true,
      label: "服务异常"
    };
  }
  if (/无法评论|没有评论权限|评论权限|关闭了评论|不允许评论|仅粉丝可评论|仅互关|作者设置/.test(_0x38bb22)) {
    return {
      code: "comment_permission_denied",
      stopAccount: false,
      label: "作者限制评论"
    };
  }
  if (/发布评论失败|评论发布失败|发送失败|回复失败|评论失败/.test(_0x38bb22)) {
    return {
      code: "comment_publish_failed",
      stopAccount: false,
      label: "发布评论失败（可能作者限制）"
    };
  }
  return {
    code: "comment_failed",
    stopAccount: false,
    label: _0x38bb22.slice(0, 40)
  };
}
module.exports = {
  normalizeCommentCompareText: normalizeCommentCompareText,
  replaceRiskyCommentEmojis: replaceRiskyCommentEmojis,
  stripRiskyCommentEmojis: stripRiskyCommentEmojis,
  commentDraftHasCoreText: commentDraftHasCoreText,
  isCommentDraftOnlyEmojiDrift: isCommentDraftOnlyEmojiDrift,
  classifyCommentFailureToast: classifyCommentFailureToast,
  RISKY_COMMENT_EMOJI_RE: RISKY_COMMENT_EMOJI_RE
};
'use strict';

const DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER = "[表情或表情包]";
const DOUYIN_IMAGE_COMMENT_PLACEHOLDER = "[图片]";
function normalizeCommentCompareText(_0x596c67) {
  return String(_0x596c67 || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
}
function isNicknameAsCommentBody(_0x352168, _0x2f4864) {
  const _0x3d20b9 = normalizeCommentCompareText(_0x352168);
  const _0x34cd80 = normalizeCommentCompareText(_0x2f4864);
  return !!_0x3d20b9 && !!_0x34cd80 && _0x3d20b9 === _0x34cd80;
}
function isNicknameCommentLine(_0x4051d4, _0x37b0a4) {
  const _0x213762 = normalizeCommentCompareText(_0x4051d4);
  const _0x3f4057 = normalizeCommentCompareText(_0x37b0a4);
  if (!_0x213762 || !_0x3f4057) {
    return false;
  }
  if (_0x213762 === _0x3f4057) {
    return true;
  }
  if (_0x213762.startsWith(_0x3f4057) && _0x213762.length - _0x3f4057.length <= 6) {
    return true;
  }
  if (_0x3f4057.startsWith(_0x213762) && _0x213762.length >= Math.min(4, _0x3f4057.length) && _0x213762.length >= _0x3f4057.length - 6) {
    return true;
  }
  return false;
}
function isCommentCardDumpText(_0x3dd22c, _0x1b1847) {
  const _0x8fe4c7 = String(_0x3dd22c || "").replace(/\s+/g, " ").trim();
  if (!_0x8fe4c7 || _0x8fe4c7.length < 8) {
    return false;
  }
  const _0x134b0f = normalizeCommentCompareText(_0x1b1847);
  if (_0x134b0f && _0x8fe4c7.includes(_0x134b0f) && (/(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/.test(_0x8fe4c7) || /(?:分享|展开\s*\d*\s*条?回复|收起回复|作者赞过)/.test(_0x8fe4c7))) {
    return true;
  }
  return false;
}
function isUnusableCommentBodyText(_0x2831d9, _0x45d0fd = "") {
  const _0x4b056d = String(_0x2831d9 || "").trim();
  if (!_0x4b056d) {
    return true;
  }
  if (isNicknameCommentLine(_0x4b056d, _0x45d0fd) || isNicknameAsCommentBody(_0x4b056d, _0x45d0fd)) {
    return true;
  }
  if (isCommentCardDumpText(_0x4b056d, _0x45d0fd)) {
    return true;
  }
  if (isDouyinCommentActionChromeText(_0x4b056d)) {
    return true;
  }
  if (looksLikeDouyinCommentLocationResidue(_0x4b056d)) {
    return true;
  }
  const _0x5a4224 = normalizeCommentCompareText(_0x4b056d);
  if (/^[.。…·•・\s]{2,}$/.test(_0x5a4224)) {
    return true;
  }
  return false;
}
function isDouyinCommentActionChromeText(_0x4ed9cf) {
  const _0x2f6d66 = normalizeCommentCompareText(_0x4ed9cf);
  if (!_0x2f6d66) {
    return true;
  }
  if (_0x2f6d66 === DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER || _0x2f6d66 === "[表情]" || _0x2f6d66 === DOUYIN_IMAGE_COMMENT_PLACEHOLDER) {
    return false;
  }
  const _0x569cbf = _0x2f6d66.replace(/\s+/g, "");
  if (!/(?:分享|回复|点赞|不喜欢|举报|删除|转发|置顶|作者赞过|更多)/.test(_0x569cbf) && !/^赞$|^\d+赞$|^赞\d+$/.test(_0x569cbf)) {
    return false;
  }
  return /^(?:\d+(?:\.\d+)?[万wWkK]?|分享|回复|点赞|赞|更多|举报|不喜欢|删除|转发|置顶|作者赞过)+$/.test(_0x569cbf);
}
function isPureEmojiOrStickerBodyText(_0x41a46e) {
  const _0x33ed62 = String(_0x41a46e || "").trim();
  if (!_0x33ed62) {
    return false;
  }
  if (_0x33ed62 === DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER || _0x33ed62 === "[表情]" || _0x33ed62 === DOUYIN_IMAGE_COMMENT_PLACEHOLDER) {
    return true;
  }
  const _0x5612f5 = _0x33ed62.replace(/\[[^\[\]\n]{1,24}\]/g, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "").replace(/[👍👏❤♥💕💗💖💘🌹🌸🌺🌷💐❣🖤💔💞💓💟]/g, "").replace(/[\s·•.。…]+/g, "");
  return _0x5612f5.length === 0;
}
function filterDouyinCommentContentLines(_0x15eb80 = [], _0x1b21de = {}) {
  const _0x3e6e56 = normalizeCommentCompareText(_0x1b21de.nickname);
  const _0x49783c = String(_0x1b21de.timeOriginal || "");
  const _0x4a7cfa = normalizeCommentCompareText(_0x49783c);
  const _0x3e40cb = Array.isArray(_0x15eb80) ? _0x15eb80 : [];
  const _0x2c2273 = _0x49783c ? _0x3e40cb.findIndex(_0x5af769 => normalizeCommentCompareText(_0x5af769) === _0x4a7cfa || String(_0x5af769 || "").trim() === _0x49783c) : -1;
  const _0x12ba63 = [];
  let _0x344bf2 = false;
  for (let _0x3ba38f = 0; _0x3ba38f < _0x3e40cb.length; _0x3ba38f += 1) {
    const _0x4f7cbd = String(_0x3e40cb[_0x3ba38f] || "").trim();
    if (!_0x4f7cbd) {
      continue;
    }
    const _0x3a248a = normalizeCommentCompareText(_0x4f7cbd);
    if (_0x3e6e56 && isNicknameCommentLine(_0x4f7cbd, _0x1b21de.nickname)) {
      continue;
    }
    if (_0x49783c && (_0x4f7cbd === _0x49783c || _0x3a248a === _0x4a7cfa)) {
      continue;
    }
    const _0x4c38c7 = normalizeCommentCompareText(_0x1b21de.ipLocation);
    if (_0x4c38c7 && (_0x3a248a === _0x4c38c7 || _0x4f7cbd === String(_0x1b21de.ipLocation || "").trim())) {
      continue;
    }
    if (_0x4f7cbd.startsWith("IP：") || _0x4f7cbd.startsWith("IP属地") || looksLikeDouyinCommentLocationResidue(_0x4f7cbd)) {
      continue;
    }
    if (_0x4f7cbd === "作者赞过" || _0x3a248a === "作者赞过") {
      continue;
    }
    if (_0x4f7cbd === "回复" || _0x4f7cbd === "收起" || _0x4f7cbd === "收起回复" || _0x4f7cbd === "分享" || _0x4f7cbd === "点赞") {
      continue;
    }
    if (_0x4f7cbd === "展开" || _0x4f7cbd.startsWith("展开") && (_0x4f7cbd.includes("回复") || _0x4f7cbd.includes("条"))) {
      continue;
    }
    if (isDouyinCommentActionChromeText(_0x4f7cbd)) {
      continue;
    }
    if (/^\d+$/.test(_0x4f7cbd)) {
      if (_0x2c2273 >= 0 && _0x3ba38f > _0x2c2273) {
        continue;
      }
      if (_0x344bf2) {
        continue;
      }
      _0x344bf2 = true;
      _0x12ba63.push(_0x4f7cbd);
      continue;
    }
    _0x12ba63.push(_0x4f7cbd);
  }
  return _0x12ba63;
}
function looksLikeDouyinCommentLocationResidue(_0xb8e938) {
  const _0x280e73 = String(_0xb8e938 || "").trim();
  if (!_0x280e73 || _0x280e73.length > 10) {
    return false;
  }
  if (/^IP/i.test(_0x280e73) || _0x280e73.includes("属地")) {
    return true;
  }
  return /^(北京|天津|上海|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆|香港|澳门|深圳|广州|杭州|成都|武汉|南京|苏州|青岛|厦门|宁波|长沙|郑州|东莞|佛山|无锡|合肥|福州|济南|大连|沈阳|长春|哈尔滨|石家庄|昆明|南昌|贵阳|南宁|海口|乌鲁木齐|呼和浩特|银川|西宁|拉萨)$/.test(_0x280e73);
}
function pickDouyinCommentLineText(_0x16058f = []) {
  const _0xff9774 = (Array.isArray(_0x16058f) ? _0x16058f : []).map(_0xdb068f => String(_0xdb068f || "").trim()).filter(Boolean).filter(_0x4eca63 => !isDouyinCommentActionChromeText(_0x4eca63));
  if (!_0xff9774.length) {
    return "";
  }
  const _0x462a34 = _0xff9774.filter(_0x1e2001 => /^\d+$/.test(_0x1e2001));
  const _0x1d0285 = _0xff9774.filter(_0x58e4d2 => !/^\d+$/.test(_0x58e4d2));
  if (_0x1d0285.length) {
    const _0x377e55 = _0x1d0285.filter(_0x361a8e => !looksLikeDouyinCommentLocationResidue(_0x361a8e));
    if (_0x377e55.length) {
      return _0x377e55.slice().sort((_0x103328, _0x5f55a9) => _0x5f55a9.length - _0x103328.length)[0] || "";
    }
    return _0x462a34[0] || "";
  }
  return _0x462a34.slice().sort((_0x2a1e59, _0x2346cd) => _0x2346cd.length - _0x2a1e59.length)[0] || "";
}
function isLikeCountOnlyCommentText(_0x351f3e) {
  return /^\d+(?:\.\d+)?[万wWkK]?$/.test(String(_0x351f3e || "").replace(/\s+/g, ""));
}
function hasApiCommentPicture(_0x47c440) {
  if (!_0x47c440 || typeof _0x47c440 !== "object") {
    return false;
  }
  const _0x228e81 = _0x47c440.image_list || _0x47c440.imageList || _0x47c440.comment_image || _0x47c440.commentImage;
  if (Array.isArray(_0x228e81) && _0x228e81.length > 0) {
    return true;
  }
  if (_0x228e81 && typeof _0x228e81 === "object") {
    return true;
  }
  return Number(_0x47c440.image_list_length || _0x47c440.imageListLength) > 0;
}
function hasApiCommentSticker(_0x41032d) {
  if (!_0x41032d || typeof _0x41032d !== "object") {
    return false;
  }
  const _0x3e6827 = _0x41032d.sticker || _0x41032d.emoji || _0x41032d.sticker_info || _0x41032d.stickerInfo;
  if (Array.isArray(_0x3e6827) && _0x3e6827.length > 0) {
    return true;
  }
  if (_0x3e6827 && typeof _0x3e6827 === "object") {
    return true;
  }
  return !!_0x41032d.sticker_id || !!_0x41032d.stickerId || !!_0x41032d.emoji_id || !!_0x41032d.emojiId;
}
function resolveDouyinCommentBodyText(_0x4112d0 = {}) {
  const _0x155eba = _0x4112d0.nickname || "";
  const _0xf204a8 = _0x31aa2d => isUnusableCommentBodyText(_0x31aa2d, _0x155eba) ? "" : String(_0x31aa2d || "").trim();
  let _0x1c05f8 = _0xf204a8(_0x4112d0.explicitText);
  if (!_0x1c05f8) {
    _0x1c05f8 = _0xf204a8(_0x4112d0.lineText);
  }
  const _0x3a9956 = Number(_0x4112d0.stickerCount) || 0;
  const _0x5cf5ea = _0x3a9956 > 0 || !!_0x4112d0.hasStickerMedia;
  const _0x5b5fa1 = (Number(_0x4112d0.imageCount) || 0) > 0 || !!_0x4112d0.hasImageMedia;
  const _0x7f5247 = Array.isArray(_0x4112d0.emojiHints) ? _0x4112d0.emojiHints.map(_0x11add4 => String(_0x11add4 || "").trim()).filter(Boolean) : [];
  const _0x2a80b1 = _0x7f5247.length > 0;
  const _0xb188f = new Set();
  for (const _0x262144 of _0x7f5247) {
    const _0x4fb80a = normalizeCommentCompareText(_0x262144);
    if (!_0x4fb80a) {
      continue;
    }
    _0xb188f.add(_0x4fb80a);
    _0xb188f.add(_0x4fb80a.replace(/^\[|\]$/g, ""));
    if (!/^\[[^[\]]{1,24}\]$/.test(_0x4fb80a)) {
      _0xb188f.add("[" + _0x4fb80a.slice(0, 16) + "]");
    }
  }
  const _0x245ab0 = (() => {
    if (!_0x1c05f8) {
      return false;
    }
    const _0x47e5a1 = normalizeCommentCompareText(_0x1c05f8);
    if (!_0x47e5a1) {
      return false;
    }
    if (_0xb188f.has(_0x47e5a1) || _0xb188f.has(_0x47e5a1.replace(/^\[|\]$/g, ""))) {
      return true;
    }
    return /^\[[^[\]]{1,24}\]$/.test(_0x47e5a1);
  })();
  if (_0x1c05f8 && (_0x5cf5ea || _0x5b5fa1) && isLikeCountOnlyCommentText(_0x1c05f8)) {
    _0x1c05f8 = "";
  }
  if (_0x1c05f8 === "[图片评论]" || _0x1c05f8 === "[图片]") {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (_0x1c05f8 && (isPureEmojiOrStickerBodyText(_0x1c05f8) || (_0x5cf5ea || _0x2a80b1) && _0x245ab0)) {
    return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
  }
  if (!_0x1c05f8 && _0x5b5fa1) {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (!_0x1c05f8 && (_0x5cf5ea || _0x2a80b1)) {
    return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
  }
  return _0x1c05f8;
}
function readCommentTextFromApiObject(_0xe2ca6e) {
  if (!_0xe2ca6e || typeof _0xe2ca6e !== "object") {
    return "";
  }
  let _0xac6834 = String(_0xe2ca6e.text || _0xe2ca6e.content || "").trim();
  const _0x5f24ac = hasApiCommentPicture(_0xe2ca6e);
  const _0x238caf = hasApiCommentSticker(_0xe2ca6e);
  if (_0xac6834 && (_0x5f24ac || _0x238caf) && isLikeCountOnlyCommentText(_0xac6834)) {
    _0xac6834 = "";
  }
  if (_0xac6834 === "[图片评论]" || _0xac6834 === "[图片]") {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (_0xac6834) {
    if (isDouyinCommentActionChromeText(_0xac6834)) {} else if (isPureEmojiOrStickerBodyText(_0xac6834)) {
      return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
    } else {
      return _0xac6834;
    }
  }
  if (_0x5f24ac) {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (_0x238caf) {
    return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
  }
  return "";
}
module.exports = {
  DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER: DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER,
  DOUYIN_IMAGE_COMMENT_PLACEHOLDER: DOUYIN_IMAGE_COMMENT_PLACEHOLDER,
  normalizeCommentCompareText: normalizeCommentCompareText,
  isNicknameAsCommentBody: isNicknameAsCommentBody,
  isNicknameCommentLine: isNicknameCommentLine,
  isCommentCardDumpText: isCommentCardDumpText,
  isUnusableCommentBodyText: isUnusableCommentBodyText,
  isDouyinCommentActionChromeText: isDouyinCommentActionChromeText,
  isPureEmojiOrStickerBodyText: isPureEmojiOrStickerBodyText,
  filterDouyinCommentContentLines: filterDouyinCommentContentLines,
  looksLikeDouyinCommentLocationResidue: looksLikeDouyinCommentLocationResidue,
  pickDouyinCommentLineText: pickDouyinCommentLineText,
  resolveDouyinCommentBodyText: resolveDouyinCommentBodyText,
  readCommentTextFromApiObject: readCommentTextFromApiObject
};
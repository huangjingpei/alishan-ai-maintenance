'use strict';

const DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER = "[表情或表情包]";
const DOUYIN_IMAGE_COMMENT_PLACEHOLDER = "[图片]";
function normalizeCommentCompareText(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
}
function isNicknameAsCommentBody(arg1, arg2) {
  const result = normalizeCommentCompareText(arg1);
  const result2 = normalizeCommentCompareText(arg2);
  return !!result && !!result2 && result === result2;
}
function isNicknameCommentLine(arg1, arg2) {
  const result = normalizeCommentCompareText(arg1);
  const result2 = normalizeCommentCompareText(arg2);
  if (!result || !result2) {
    return false;
  }
  if (result === result2) {
    return true;
  }
  if (result.startsWith(result2) && result.length - result2.length <= 6) {
    return true;
  }
  if (result2.startsWith(result) && result.length >= Math.min(4, result2.length) && result.length >= result2.length - 6) {
    return true;
  }
  return false;
}
function isCommentCardDumpText(arg1, arg2) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result || result.length < 8) {
    return false;
  }
  const result2 = normalizeCommentCompareText(arg2);
  if (result2 && result.includes(result2) && (/(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/.test(result) || /(?:分享|展开\s*\d*\s*条?回复|收起回复|作者赞过)/.test(result))) {
    return true;
  }
  return false;
}
function isUnusableCommentBodyText(arg1, text = "") {
  const result = String(arg1 || "").trim();
  if (!result) {
    return true;
  }
  if (isNicknameCommentLine(result, text) || isNicknameAsCommentBody(result, text)) {
    return true;
  }
  if (isCommentCardDumpText(result, text)) {
    return true;
  }
  if (isDouyinCommentActionChromeText(result)) {
    return true;
  }
  if (looksLikeDouyinCommentLocationResidue(result)) {
    return true;
  }
  const result2 = normalizeCommentCompareText(result);
  if (/^[.。…·•・\s]{2,}$/.test(result2)) {
    return true;
  }
  return false;
}
function isDouyinCommentActionChromeText(arg1) {
  const result = normalizeCommentCompareText(arg1);
  if (!result) {
    return true;
  }
  if (result === DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER || result === "[表情]" || result === DOUYIN_IMAGE_COMMENT_PLACEHOLDER) {
    return false;
  }
  const result2 = result.replace(/\s+/g, "");
  if (!/(?:分享|回复|点赞|不喜欢|举报|删除|转发|置顶|作者赞过|更多)/.test(result2) && !/^赞$|^\d+赞$|^赞\d+$/.test(result2)) {
    return false;
  }
  return /^(?:\d+(?:\.\d+)?[万wWkK]?|分享|回复|点赞|赞|更多|举报|不喜欢|删除|转发|置顶|作者赞过)+$/.test(result2);
}
function isPureEmojiOrStickerBodyText(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  if (result === DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER || result === "[表情]" || result === DOUYIN_IMAGE_COMMENT_PLACEHOLDER) {
    return true;
  }
  const result2 = result.replace(/\[[^\[\]\n]{1,24}\]/g, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "").replace(/[👍👏❤♥💕💗💖💘🌹🌸🌺🌷💐❣🖤💔💞💓💟]/g, "").replace(/[\s·•.。…]+/g, "");
  return result2.length === 0;
}
function filterDouyinCommentContentLines(list = [], options = {}) {
  const result = normalizeCommentCompareText(options.nickname);
  const result2 = String(options.timeOriginal || "");
  const result3 = normalizeCommentCompareText(result2);
  const value = Array.isArray(list) ? list : [];
  const value2 = result2 ? value.findIndex(arg1 => normalizeCommentCompareText(arg1) === result3 || String(arg1 || "").trim() === result2) : -1;
  const list2 = [];
  let flag = false;
  for (let num = 0; num < value.length; num += 1) {
    const result4 = String(value[num] || "").trim();
    if (!result4) {
      continue;
    }
    const result5 = normalizeCommentCompareText(result4);
    if (result && isNicknameCommentLine(result4, options.nickname)) {
      continue;
    }
    if (result2 && (result4 === result2 || result5 === result3)) {
      continue;
    }
    const result6 = normalizeCommentCompareText(options.ipLocation);
    if (result6 && (result5 === result6 || result4 === String(options.ipLocation || "").trim())) {
      continue;
    }
    if (result4.startsWith("IP：") || result4.startsWith("IP属地") || looksLikeDouyinCommentLocationResidue(result4)) {
      continue;
    }
    if (result4 === "作者赞过" || result5 === "作者赞过") {
      continue;
    }
    if (result4 === "回复" || result4 === "收起" || result4 === "收起回复" || result4 === "分享" || result4 === "点赞") {
      continue;
    }
    if (result4 === "展开" || result4.startsWith("展开") && (result4.includes("回复") || result4.includes("条"))) {
      continue;
    }
    if (isDouyinCommentActionChromeText(result4)) {
      continue;
    }
    if (/^\d+$/.test(result4)) {
      if (value2 >= 0 && num > value2) {
        continue;
      }
      if (flag) {
        continue;
      }
      flag = true;
      list2.push(result4);
      continue;
    }
    list2.push(result4);
  }
  return list2;
}
function looksLikeDouyinCommentLocationResidue(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || result.length > 10) {
    return false;
  }
  if (/^IP/i.test(result) || result.includes("属地")) {
    return true;
  }
  return /^(北京|天津|上海|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆|香港|澳门|深圳|广州|杭州|成都|武汉|南京|苏州|青岛|厦门|宁波|长沙|郑州|东莞|佛山|无锡|合肥|福州|济南|大连|沈阳|长春|哈尔滨|石家庄|昆明|南昌|贵阳|南宁|海口|乌鲁木齐|呼和浩特|银川|西宁|拉萨)$/.test(result);
}
function pickDouyinCommentLineText(list = []) {
  const result = (Array.isArray(list) ? list : []).map(arg1 => String(arg1 || "").trim()).filter(Boolean).filter(arg1 => !isDouyinCommentActionChromeText(arg1));
  if (!result.length) {
    return "";
  }
  const result2 = result.filter(arg1 => /^\d+$/.test(arg1));
  const result3 = result.filter(arg1 => !/^\d+$/.test(arg1));
  if (result3.length) {
    const result = result3.filter(arg1 => !looksLikeDouyinCommentLocationResidue(arg1));
    if (result.length) {
      return result.slice().sort((arg1, arg2) => arg2.length - arg1.length)[0] || "";
    }
    return result2[0] || "";
  }
  return result2.slice().sort((arg1, arg2) => arg2.length - arg1.length)[0] || "";
}
function isLikeCountOnlyCommentText(arg1) {
  return /^\d+(?:\.\d+)?[万wWkK]?$/.test(String(arg1 || "").replace(/\s+/g, ""));
}
function hasApiCommentPicture(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  const local = arg1.image_list || arg1.imageList || arg1.comment_image || arg1.commentImage;
  if (Array.isArray(local) && local.length > 0) {
    return true;
  }
  if (local && typeof local === "object") {
    return true;
  }
  return Number(arg1.image_list_length || arg1.imageListLength) > 0;
}
function hasApiCommentSticker(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  const local = arg1.sticker || arg1.emoji || arg1.sticker_info || arg1.stickerInfo;
  if (Array.isArray(local) && local.length > 0) {
    return true;
  }
  if (local && typeof local === "object") {
    return true;
  }
  return !!arg1.sticker_id || !!arg1.stickerId || !!arg1.emoji_id || !!arg1.emojiId;
}
function resolveDouyinCommentBodyText(options = {}) {
  const local = options.nickname || "";
  const local2 = arg1 => isUnusableCommentBodyText(arg1, local) ? "" : String(arg1 || "").trim();
  let result = local2(options.explicitText);
  if (!result) {
    result = local2(options.lineText);
  }
  const local3 = Number(options.stickerCount) || 0;
  const local4 = local3 > 0 || !!options.hasStickerMedia;
  const local5 = (Number(options.imageCount) || 0) > 0 || !!options.hasImageMedia;
  const value = Array.isArray(options.emojiHints) ? options.emojiHints.map(arg1 => String(arg1 || "").trim()).filter(Boolean) : [];
  const value2 = value.length > 0;
  const set = new Set();
  for (const item of value) {
    const result = normalizeCommentCompareText(item);
    if (!result) {
      continue;
    }
    set.add(result);
    set.add(result.replace(/^\[|\]$/g, ""));
    if (!/^\[[^[\]]{1,24}\]$/.test(result)) {
      set.add("[" + result.slice(0, 16) + "]");
    }
  }
  const result2 = (() => {
    if (!result) {
      return false;
    }
    const result2 = normalizeCommentCompareText(result);
    if (!result2) {
      return false;
    }
    if (set.has(result2) || set.has(result2.replace(/^\[|\]$/g, ""))) {
      return true;
    }
    return /^\[[^[\]]{1,24}\]$/.test(result2);
  })();
  if (result && (local4 || local5) && isLikeCountOnlyCommentText(result)) {
    result = "";
  }
  if (result === "[图片评论]" || result === "[图片]") {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (result && (isPureEmojiOrStickerBodyText(result) || (local4 || value2) && result2)) {
    return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
  }
  if (!result && local5) {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (!result && (local4 || value2)) {
    return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
  }
  return result;
}
function readCommentTextFromApiObject(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return "";
  }
  let result = String(arg1.text || arg1.content || "").trim();
  const flag = hasApiCommentPicture(arg1);
  const flag2 = hasApiCommentSticker(arg1);
  if (result && (flag || flag2) && isLikeCountOnlyCommentText(result)) {
    result = "";
  }
  if (result === "[图片评论]" || result === "[图片]") {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (result) {
    if (isDouyinCommentActionChromeText(result)) {} else if (isPureEmojiOrStickerBodyText(result)) {
      return DOUYIN_EMOJI_OR_STICKER_PLACEHOLDER;
    } else {
      return result;
    }
  }
  if (flag) {
    return DOUYIN_IMAGE_COMMENT_PLACEHOLDER;
  }
  if (flag2) {
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
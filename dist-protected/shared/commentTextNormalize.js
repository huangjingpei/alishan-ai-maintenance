'use strict';

const INVISIBLE_CHAR_RE = /[\u034F\u180E\u200B-\u200D\u2060-\u2064\uFEFF]/g;
const RISKY_EMOJI_TO_CN = new Map([["🌹", "[玫瑰]"], ["🥀", "[玫瑰]"], ["🌷", "[鲜花]"], ["🌸", "[鲜花]"], ["🌺", "[鲜花]"], ["🌻", "[鲜花]"], ["🌼", "[鲜花]"], ["💐", "[花束]"], ["🍀", "[幸运]"], ["❤️", "[爱心]"], ["❤", "[爱心]"], ["♥️", "[爱心]"], ["♥", "[爱心]"], ["❣️", "[爱]"], ["❣", "[爱]"], ["💕", "[爱心]"], ["💖", "[爱心]"], ["💗", "[爱心]"], ["💓", "[爱心]"], ["💞", "[爱心]"], ["💘", "[爱心]"], ["💝", "[爱心]"], ["🧡", "[爱心]"], ["💛", "[爱心]"], ["💚", "[爱心]"], ["💙", "[爱心]"], ["💜", "[爱心]"], ["🤍", "[爱心]"], ["🖤", "[爱心]"], ["🤎", "[爱心]"], ["💢", "[爱]"]]);
const RISKY_COMMENT_EMOJI_RE = new RegExp("[\\u{1F337}-\\u{1F33F}\\u{1F490}-\\u{1F49F}\\u{1F9E1}\\u{2764}\\u{FE0F}?\\u{2665}\\u{FE0F}?\\u{2763}\\u{FE0F}?]", "gu");
function fallbackLabelForRiskyEmoji(arg1) {
  const local = arg1.codePointAt(0) || 0;
  if (local >= 127799 && local <= 127807) {
    return "[鲜花]";
  }
  if (local >= 128144 && local <= 128159) {
    return "[爱心]";
  }
  if (local === 10084 || local === 9829 || local === 10083 || local === 129505) {
    return "[爱心]";
  }
  return "[爱心]";
}
function normalizeCommentCompareText(arg1) {
  return String(arg1 || "").replace(INVISIBLE_CHAR_RE, "").replace(/\[[^\[\]]{1,12}\]/g, "").replace(RISKY_COMMENT_EMOJI_RE, "").replace(/\s+/g, "").trim();
}
function replaceRiskyCommentEmojis(arg1) {
  const result = String(arg1 || "");
  if (!result) {
    return {
      text: result,
      replaced: false,
      labels: ""
    };
  }
  const list = [];
  let text = "";
  let num = 0;
  while (num < result.length) {
    const result2 = result.codePointAt(num);
    const result3 = String.fromCodePoint(result2);
    const value = num + result3.length < result.length && result[num + result3.length] === "️" ? result3 + "️" : result3;
    const local = RISKY_EMOJI_TO_CN.get(value) || RISKY_EMOJI_TO_CN.get(result3);
    if (local) {
      text += local;
      list.push(local);
      num += value.length;
      continue;
    }
    if (RISKY_COMMENT_EMOJI_RE.test(result3)) {
      RISKY_COMMENT_EMOJI_RE.lastIndex = 0;
      const result = fallbackLabelForRiskyEmoji(result3);
      text += result;
      list.push(result);
      num += result3.length;
      continue;
    }
    RISKY_COMMENT_EMOJI_RE.lastIndex = 0;
    text += result3;
    num += result3.length;
  }
  return {
    text: text,
    replaced: list.length > 0,
    labels: [...new Set(list)].join("")
  };
}
function stripRiskyCommentEmojis(arg1) {
  const result = replaceRiskyCommentEmojis(arg1);
  return {
    text: result.text,
    stripped: result.replaced,
    removed: result.labels
  };
}
function commentDraftHasCoreText(arg1, arg2) {
  const result = normalizeCommentCompareText(arg1);
  const result2 = normalizeCommentCompareText(arg2);
  if (!result || !result2) {
    return false;
  }
  if (result === result2) {
    return true;
  }
  if (result.length >= 4 && result2.includes(result)) {
    return true;
  }
  if (result2.length >= 4 && result.includes(result2)) {
    return true;
  }
  const result3 = Math.min(8, result.length, result2.length);
  return result3 >= 4 && result.slice(0, result3) === result2.slice(0, result3);
}
function isCommentDraftOnlyEmojiDrift(arg1, arg2) {
  const result = normalizeCommentCompareText(arg1);
  const result2 = normalizeCommentCompareText(arg2);
  if (!result2) {
    return false;
  }
  if (!result) {
    return false;
  }
  return result === result2 || result.length >= 4 && result2.includes(result);
}
function classifyCommentFailureToast(arg1) {
  const result = String(arg1 || "").replace(/\s+/g, " ").trim();
  if (!result) {
    return {
      code: "comment_failed",
      stopAccount: false,
      label: "评论失败"
    };
  }
  if (/操作太频繁|请稍后再试/.test(result)) {
    return {
      code: "rate_limited",
      stopAccount: true,
      label: "操作太频繁"
    };
  }
  if (/内容不符合|包含违规|审核未通过/.test(result)) {
    return {
      code: "content_rejected",
      stopAccount: true,
      label: "内容被拒"
    };
  }
  if (/服务异常|网络异常/.test(result)) {
    return {
      code: "service_error",
      stopAccount: true,
      label: "服务异常"
    };
  }
  if (/无法评论|没有评论权限|评论权限|关闭了评论|不允许评论|仅粉丝可评论|仅互关|作者设置/.test(result)) {
    return {
      code: "comment_permission_denied",
      stopAccount: false,
      label: "作者限制评论"
    };
  }
  if (/发布评论失败|评论发布失败|发送失败|回复失败|评论失败/.test(result)) {
    return {
      code: "comment_publish_failed",
      stopAccount: false,
      label: "发布评论失败（可能作者限制）"
    };
  }
  return {
    code: "comment_failed",
    stopAccount: false,
    label: result.slice(0, 40)
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
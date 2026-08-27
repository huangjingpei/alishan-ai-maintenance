'use strict';

const DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR = ["[data-e2e=\"comment-reply-item\"]", "div[class*=\"reply-item\"]", "div[class*=\"ReplyItem\"]", "[class*=\"sub-comment-item\"]", "[class*=\"SubCommentItem\"]"].join(", ");
const DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR = ["[data-e2e=\"comment-reply-list\"]", "[class*=\"reply-list\"]", "[class*=\"ReplyList\"]", "[class*=\"reply-container\"]", "[class*=\"ReplyContainer\"]", "[class*=\"sub-comment\"]", "[class*=\"SubComment\"]"].join(", ");
function isNonZeroId(_0x4d4832) {
  const _0x58e26d = String(_0x4d4832 ?? "").trim();
  return !!_0x58e26d && _0x58e26d !== "0";
}
function isDouyinSecondaryCommentNode(_0x2c8f0c) {
  if (!_0x2c8f0c) {
    return false;
  }
  try {
    if (typeof _0x2c8f0c.matches === "function" && _0x2c8f0c.matches(DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR)) {
      return true;
    }
  } catch (_0x1c8deb) {}
  try {
    if (typeof _0x2c8f0c.closest === "function" && _0x2c8f0c.closest(DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR)) {
      return true;
    }
  } catch (_0x40b999) {}
  return false;
}
function isDouyinNestedReplyComment(_0x49fb6f) {
  if (!_0x49fb6f || typeof _0x49fb6f !== "object") {
    return false;
  }
  if (isNonZeroId(_0x49fb6f.reply_id ?? _0x49fb6f.replyId)) {
    return true;
  }
  if (isNonZeroId(_0x49fb6f.reply_to_reply_id ?? _0x49fb6f.replyToReplyId)) {
    return true;
  }
  if (isNonZeroId(_0x49fb6f.reply_to_userid ?? _0x49fb6f.reply_to_user_id ?? _0x49fb6f.replyToUserId)) {
    return true;
  }
  const _0x583b69 = Number(_0x49fb6f.level ?? _0x49fb6f.comment_level ?? _0x49fb6f.commentLevel);
  if (Number.isFinite(_0x583b69) && _0x583b69 >= 2) {
    return true;
  }
  return false;
}
function shouldWalkCommentNestedKey(_0x32ca18, {
  includeReplies = false
} = {}) {
  const _0x1e5a9c = String(_0x32ca18 || "");
  if (/^reply_comments?$/i.test(_0x1e5a9c) || /^replyComments?$/i.test(_0x1e5a9c)) {
    return !!includeReplies;
  }
  return true;
}
module.exports = {
  DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR: DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR,
  DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR: DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR,
  isDouyinSecondaryCommentNode: isDouyinSecondaryCommentNode,
  isDouyinNestedReplyComment: isDouyinNestedReplyComment,
  shouldWalkCommentNestedKey: shouldWalkCommentNestedKey
};
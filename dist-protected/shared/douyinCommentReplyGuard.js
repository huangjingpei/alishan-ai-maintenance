'use strict';

const DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR = ["[data-e2e=\"comment-reply-item\"]", "div[class*=\"reply-item\"]", "div[class*=\"ReplyItem\"]", "[class*=\"sub-comment-item\"]", "[class*=\"SubCommentItem\"]"].join(", ");
const DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR = ["[data-e2e=\"comment-reply-list\"]", "[class*=\"reply-list\"]", "[class*=\"ReplyList\"]", "[class*=\"reply-container\"]", "[class*=\"ReplyContainer\"]", "[class*=\"sub-comment\"]", "[class*=\"SubComment\"]"].join(", ");
function isNonZeroId(arg1) {
  const result = String(arg1 ?? "").trim();
  return !!result && result !== "0";
}
function isDouyinSecondaryCommentNode(arg1) {
  if (!arg1) {
    return false;
  }
  try {
    if (typeof arg1.matches === "function" && arg1.matches(DOUYIN_SECONDARY_COMMENT_NODE_SELECTOR)) {
      return true;
    }
  } catch (error) {}
  try {
    if (typeof arg1.closest === "function" && arg1.closest(DOUYIN_SECONDARY_COMMENT_ANCESTOR_SELECTOR)) {
      return true;
    }
  } catch (error) {}
  return false;
}
function isDouyinNestedReplyComment(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  if (isNonZeroId(arg1.reply_id ?? arg1.replyId)) {
    return true;
  }
  if (isNonZeroId(arg1.reply_to_reply_id ?? arg1.replyToReplyId)) {
    return true;
  }
  if (isNonZeroId(arg1.reply_to_userid ?? arg1.reply_to_user_id ?? arg1.replyToUserId)) {
    return true;
  }
  const result = Number(arg1.level ?? arg1.comment_level ?? arg1.commentLevel);
  if (Number.isFinite(result) && result >= 2) {
    return true;
  }
  return false;
}
function shouldWalkCommentNestedKey(arg1, {
  includeReplies = false
} = {}) {
  const result = String(arg1 || "");
  if (/^reply_comments?$/i.test(result) || /^replyComments?$/i.test(result)) {
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
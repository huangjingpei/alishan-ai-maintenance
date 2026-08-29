'use strict';

const accountVideoMainCommentsAccess = require("./accountVideoMainCommentsAccess");
const {
  extractDouyinVideoId,
  processedVideoKeysMatch
} = require("../shared/processedVideoKey");
function listAccountVideoMainCommentedIds(arg1, arg2) {
  return accountVideoMainCommentsAccess.listVideoIdsByAccount(arg1, arg2 || "default");
}
function accountHasVideoMainCommented(arg1, arg2, arg3) {
  const result = extractDouyinVideoId(arg3 || "");
  if (result) {
    return !!accountVideoMainCommentsAccess.findOne(arg1, arg2 || "default", result);
  }
  if (!arg3) {
    return false;
  }
  const local = accountVideoMainCommentsAccess.listByAccount(arg1, arg2 || "default") || [];
  return local.some(arg1 => processedVideoKeysMatch(arg1.url, arg3));
}
function hasMonitorVideoMainNonTextExtras(options = {}) {
  if (options.enableVideoCommentImage && Array.isArray(options.videoCommentImagePaths) && options.videoCommentImagePaths.some(arg1 => String(arg1 || "").trim())) {
    return true;
  }
  if (options.enableVideoCommentExpression) {
    return true;
  }
  if (options.enableVideoCommentMention && String(options.videoCommentMentionNicknames || "").trim()) {
    return true;
  }
  return false;
}
function formatMonitorVideoMainCommentLogLabel(text = "", options = {}) {
  const result = String(text || "").trim();
  if (result) {
    return result.slice(0, 40);
  }
  const list = [];
  if (options.enableVideoCommentImage) {
    list.push("图片");
  }
  if (options.enableVideoCommentExpression) {
    list.push("表情包");
  }
  if (options.enableVideoCommentMention && String(options.videoCommentMentionNicknames || "").trim()) {
    list.push("@账号");
  }
  if (list.length) {
    return "仅" + list.join("+");
  } else {
    return "（无正文）";
  }
}
function buildMonitorVideoMainCommentExtras(options = {}, {
  taskId: taskId,
  accountId: accountId,
  commentText: commentText,
  videoTitle: videoTitle,
  videoKey: videoKey,
  videoMainCommentedVideoIds: videoMainCommentedVideoIds
} = {}) {
  const local = options.enableVideoCommentWithoutText === true || !String(commentText || "").trim() && hasMonitorVideoMainNonTextExtras(options);
  const value = Number.isFinite(Number(options.videoCommentAttachmentPercent)) ? Number(options.videoCommentAttachmentPercent) : 20;
  return {
    action: "video-main-comment",
    monitorTaskId: taskId,
    isMonitorAction: true,
    accountId: accountId || "",
    videoTitle: videoTitle || "",
    videoKey: videoKey || "",
    prefetchedCommentText: String(commentText || ""),
    videoMainCommentedVideoIds: Array.isArray(videoMainCommentedVideoIds) ? videoMainCommentedVideoIds : [],
    enableVideoComment: true,
    videoCommentMode: String(commentText || "").trim() ? "custom" : options.videoCommentMode || "custom",
    videoCommentContent: String(commentText || ""),
    enableVideoCommentWithoutText: local,
    enableVideoCommentMention: !!options.enableVideoCommentMention,
    videoCommentMentionNicknames: options.videoCommentMentionNicknames || "",
    videoCommentMentionPosition: options.videoCommentMentionPosition || "before",
    videoCommentMentionPercent: Number.isFinite(Number(options.videoCommentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(options.videoCommentMentionPercent)))) : 100,
    enableVideoCommentImage: !!options.enableVideoCommentImage,
    videoCommentImagePaths: options.videoCommentImagePaths || [],
    enableVideoCommentExpression: !!options.enableVideoCommentExpression,
    videoCommentExpressionCount: options.videoCommentExpressionCount || 3,
    videoCommentUseRandomSuffix: false,
    videoCommentAttachmentPercent: local ? 100 : value
  };
}
module.exports = {
  listAccountVideoMainCommentedIds: listAccountVideoMainCommentedIds,
  accountHasVideoMainCommented: accountHasVideoMainCommented,
  hasMonitorVideoMainNonTextExtras: hasMonitorVideoMainNonTextExtras,
  formatMonitorVideoMainCommentLogLabel: formatMonitorVideoMainCommentLogLabel,
  buildMonitorVideoMainCommentExtras: buildMonitorVideoMainCommentExtras
};
'use strict';

const accountVideoMainCommentsAccess = require("./accountVideoMainCommentsAccess");
const {
  extractDouyinVideoId,
  processedVideoKeysMatch
} = require("../shared/processedVideoKey");
function listAccountVideoMainCommentedIds(_0x2afb64, _0x53e587) {
  return accountVideoMainCommentsAccess.listVideoIdsByAccount(_0x2afb64, _0x53e587 || "default");
}
function accountHasVideoMainCommented(_0x5ba8f5, _0xa9991f, _0x1073fb) {
  const _0x45e41d = extractDouyinVideoId(_0x1073fb || "");
  if (_0x45e41d) {
    return !!accountVideoMainCommentsAccess.findOne(_0x5ba8f5, _0xa9991f || "default", _0x45e41d);
  }
  if (!_0x1073fb) {
    return false;
  }
  const _0x5075a8 = accountVideoMainCommentsAccess.listByAccount(_0x5ba8f5, _0xa9991f || "default") || [];
  return _0x5075a8.some(_0x32de09 => processedVideoKeysMatch(_0x32de09.url, _0x1073fb));
}
function hasMonitorVideoMainNonTextExtras(_0x18a7c9 = {}) {
  if (_0x18a7c9.enableVideoCommentImage && Array.isArray(_0x18a7c9.videoCommentImagePaths) && _0x18a7c9.videoCommentImagePaths.some(_0x3254a6 => String(_0x3254a6 || "").trim())) {
    return true;
  }
  if (_0x18a7c9.enableVideoCommentExpression) {
    return true;
  }
  if (_0x18a7c9.enableVideoCommentMention && String(_0x18a7c9.videoCommentMentionNicknames || "").trim()) {
    return true;
  }
  return false;
}
function formatMonitorVideoMainCommentLogLabel(_0x4e651a = "", _0x2f94e4 = {}) {
  const _0x4d5753 = String(_0x4e651a || "").trim();
  if (_0x4d5753) {
    return _0x4d5753.slice(0, 40);
  }
  const _0x11f892 = [];
  if (_0x2f94e4.enableVideoCommentImage) {
    _0x11f892.push("图片");
  }
  if (_0x2f94e4.enableVideoCommentExpression) {
    _0x11f892.push("表情包");
  }
  if (_0x2f94e4.enableVideoCommentMention && String(_0x2f94e4.videoCommentMentionNicknames || "").trim()) {
    _0x11f892.push("@账号");
  }
  if (_0x11f892.length) {
    return "仅" + _0x11f892.join("+");
  } else {
    return "（无正文）";
  }
}
function buildMonitorVideoMainCommentExtras(_0x49167b = {}, {
  taskId: _0xcbd5ed,
  accountId: _0x5cb707,
  commentText: _0x245264,
  videoTitle: _0x25ec3a,
  videoKey: _0x1c4cff,
  videoMainCommentedVideoIds: _0x2bc270
} = {}) {
  const _0x316118 = _0x49167b.enableVideoCommentWithoutText === true || !String(_0x245264 || "").trim() && hasMonitorVideoMainNonTextExtras(_0x49167b);
  const _0x59b31d = Number.isFinite(Number(_0x49167b.videoCommentAttachmentPercent)) ? Number(_0x49167b.videoCommentAttachmentPercent) : 20;
  return {
    action: "video-main-comment",
    monitorTaskId: _0xcbd5ed,
    isMonitorAction: true,
    accountId: _0x5cb707 || "",
    videoTitle: _0x25ec3a || "",
    videoKey: _0x1c4cff || "",
    prefetchedCommentText: String(_0x245264 || ""),
    videoMainCommentedVideoIds: Array.isArray(_0x2bc270) ? _0x2bc270 : [],
    enableVideoComment: true,
    videoCommentMode: String(_0x245264 || "").trim() ? "custom" : _0x49167b.videoCommentMode || "custom",
    videoCommentContent: String(_0x245264 || ""),
    enableVideoCommentWithoutText: _0x316118,
    enableVideoCommentMention: !!_0x49167b.enableVideoCommentMention,
    videoCommentMentionNicknames: _0x49167b.videoCommentMentionNicknames || "",
    videoCommentMentionPosition: _0x49167b.videoCommentMentionPosition || "before",
    videoCommentMentionPercent: Number.isFinite(Number(_0x49167b.videoCommentMentionPercent)) ? Math.max(0, Math.min(100, Math.round(Number(_0x49167b.videoCommentMentionPercent)))) : 100,
    enableVideoCommentImage: !!_0x49167b.enableVideoCommentImage,
    videoCommentImagePaths: _0x49167b.videoCommentImagePaths || [],
    enableVideoCommentExpression: !!_0x49167b.enableVideoCommentExpression,
    videoCommentExpressionCount: _0x49167b.videoCommentExpressionCount || 3,
    videoCommentUseRandomSuffix: false,
    videoCommentAttachmentPercent: _0x316118 ? 100 : _0x59b31d
  };
}
module.exports = {
  listAccountVideoMainCommentedIds: listAccountVideoMainCommentedIds,
  accountHasVideoMainCommented: accountHasVideoMainCommented,
  hasMonitorVideoMainNonTextExtras: hasMonitorVideoMainNonTextExtras,
  formatMonitorVideoMainCommentLogLabel: formatMonitorVideoMainCommentLogLabel,
  buildMonitorVideoMainCommentExtras: buildMonitorVideoMainCommentExtras
};
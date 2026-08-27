'use strict';

const MAX_MONITOR_TASK_VIDEO_COMMENTS = 2000;
function normalizeMonitorVideoCommentRecord(_0x22bb1a = {}) {
  const _0x173e99 = ["success", "failed", "skipped"].includes(String(_0x22bb1a.status || "")) ? String(_0x22bb1a.status) : "success";
  return {
    id: String(_0x22bb1a.id || "vmc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(_0x22bb1a.ts || Date.now()) || Date.now(),
    accountId: String(_0x22bb1a.accountId || ""),
    accountName: String(_0x22bb1a.accountName || ""),
    videoUrl: String(_0x22bb1a.videoUrl || _0x22bb1a.url || ""),
    videoTitle: String(_0x22bb1a.videoTitle || _0x22bb1a.title || ""),
    videoId: String(_0x22bb1a.videoId || ""),
    content: String(_0x22bb1a.content || _0x22bb1a.commentText || _0x22bb1a.comment || ""),
    status: _0x173e99,
    error: String(_0x22bb1a.error || "")
  };
}
module.exports = {
  MAX_MONITOR_TASK_VIDEO_COMMENTS: MAX_MONITOR_TASK_VIDEO_COMMENTS,
  normalizeMonitorVideoCommentRecord: normalizeMonitorVideoCommentRecord
};
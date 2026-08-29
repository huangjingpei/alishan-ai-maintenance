'use strict';

const MAX_MONITOR_TASK_VIDEO_COMMENTS = 2000;
function normalizeMonitorVideoCommentRecord(options = {}) {
  const value = ["success", "failed", "skipped"].includes(String(options.status || "")) ? String(options.status) : "success";
  return {
    id: String(options.id || "vmc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)),
    ts: Number(options.ts || Date.now()) || Date.now(),
    accountId: String(options.accountId || ""),
    accountName: String(options.accountName || ""),
    videoUrl: String(options.videoUrl || options.url || ""),
    videoTitle: String(options.videoTitle || options.title || ""),
    videoId: String(options.videoId || ""),
    content: String(options.content || options.commentText || options.comment || ""),
    status: value,
    error: String(options.error || "")
  };
}
module.exports = {
  MAX_MONITOR_TASK_VIDEO_COMMENTS: MAX_MONITOR_TASK_VIDEO_COMMENTS,
  normalizeMonitorVideoCommentRecord: normalizeMonitorVideoCommentRecord
};
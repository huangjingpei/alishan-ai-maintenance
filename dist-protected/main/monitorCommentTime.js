const {
  parseCommentAgeMinutes,
  formatCommentAgeLabel,
  isCommentWithinWindowMinutes
} = require("../shared/commentTime");
const DEFAULT_MONITOR_COMMENT_WINDOW_MINUTES = 60;
function resolveMonitorCommentWindowMinutes(options = {}) {
  const local = options?.commentWindowMinutes;
  if (local != null && Number.isFinite(Number(local))) {
    const result = Math.floor(Number(local));
    if (result >= 1) {
      return Math.min(result, 10080);
    }
  }
  return DEFAULT_MONITOR_COMMENT_WINDOW_MINUTES;
}
const MONITOR_MAX_COMMENTS = 200;
module.exports = {
  DEFAULT_MONITOR_COMMENT_WINDOW_MINUTES: DEFAULT_MONITOR_COMMENT_WINDOW_MINUTES,
  MONITOR_MAX_COMMENTS: MONITOR_MAX_COMMENTS,
  resolveMonitorCommentWindowMinutes: resolveMonitorCommentWindowMinutes,
  parseCommentAgeMinutes: parseCommentAgeMinutes,
  formatCommentAgeLabel: formatCommentAgeLabel,
  isCommentWithinWindowMinutes: isCommentWithinWindowMinutes
};
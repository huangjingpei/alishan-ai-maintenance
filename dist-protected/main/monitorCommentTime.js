const {
  parseCommentAgeMinutes,
  formatCommentAgeLabel,
  isCommentWithinWindowMinutes
} = require("../shared/commentTime");
const DEFAULT_MONITOR_COMMENT_WINDOW_MINUTES = 60;
function resolveMonitorCommentWindowMinutes(_0x1c76f2 = {}) {
  const _0x429e40 = _0x1c76f2?.commentWindowMinutes;
  if (_0x429e40 != null && Number.isFinite(Number(_0x429e40))) {
    const _0x4294fe = Math.floor(Number(_0x429e40));
    if (_0x4294fe >= 1) {
      return Math.min(_0x4294fe, 10080);
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
'use strict';

const COMPLETE_WARMUP_SURFACE_STATUSES = new Set(["ready", "empty"]);
function isWarmupSurfaceComplete(options = {}) {
  return COMPLETE_WARMUP_SURFACE_STATUSES.has(String(options?.status || ""));
}
function canCommitNotificationScan(options = {}, num = 0) {
  return isWarmupSurfaceComplete(options) || Math.max(0, Number(num) || 0) > 0;
}
function canCommitDmScan({
  chatSurface = {},
  messageScanOk = false
} = {}) {
  return isWarmupSurfaceComplete(chatSurface) && messageScanOk === true;
}
module.exports = {
  COMPLETE_WARMUP_SURFACE_STATUSES: COMPLETE_WARMUP_SURFACE_STATUSES,
  isWarmupSurfaceComplete: isWarmupSurfaceComplete,
  canCommitNotificationScan: canCommitNotificationScan,
  canCommitDmScan: canCommitDmScan
};
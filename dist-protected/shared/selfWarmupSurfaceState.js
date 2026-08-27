'use strict';

const COMPLETE_WARMUP_SURFACE_STATUSES = new Set(["ready", "empty"]);
function isWarmupSurfaceComplete(_0x2c4ae8 = {}) {
  return COMPLETE_WARMUP_SURFACE_STATUSES.has(String(_0x2c4ae8?.status || ""));
}
function canCommitNotificationScan(_0x17c33a = {}, _0x42a457 = 0) {
  return isWarmupSurfaceComplete(_0x17c33a) || Math.max(0, Number(_0x42a457) || 0) > 0;
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
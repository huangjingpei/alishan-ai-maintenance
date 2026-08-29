'use strict';

function normalizeActionCountResetTime(arg1, text = "00:00") {
  const result = String(arg1 == null ? "" : arg1).trim();
  const result2 = result.match(/^(\d{1,2}):(\d{2})$/);
  if (!result2) {
    return text;
  }
  const result3 = Math.min(23, Math.max(0, parseInt(result2[1], 10)));
  const result4 = Math.min(59, Math.max(0, parseInt(result2[2], 10)));
  if (!Number.isFinite(result3) || !Number.isFinite(result4)) {
    return text;
  }
  return String(result3).padStart(2, "0") + ":" + String(result4).padStart(2, "0");
}
function msUntilNextActionCountReset(arg1, arg2 = new Date()) {
  const result = normalizeActionCountResetTime(arg1);
  const [local, local2] = result.split(":").map(arg1 => parseInt(arg1, 10));
  const value = arg2 instanceof Date ? arg2 : new Date(arg2);
  const date = new Date(value.getTime());
  date.setSeconds(0, 0);
  date.setHours(local, local2, 0, 0);
  if (date.getTime() <= value.getTime()) {
    date.setDate(date.getDate() + 1);
  }
  return Math.max(1000, date.getTime() - value.getTime());
}
function getLatestActionCountResetBoundary(arg1, arg2 = new Date()) {
  const result = normalizeActionCountResetTime(arg1);
  const [local, local2] = result.split(":").map(arg1 => parseInt(arg1, 10));
  const value = arg2 instanceof Date ? arg2 : new Date(arg2);
  const date = new Date(value.getTime());
  date.setSeconds(0, 0);
  date.setHours(local, local2, 0, 0);
  if (date.getTime() > value.getTime()) {
    date.setDate(date.getDate() - 1);
  }
  return date.getTime();
}
module.exports = {
  normalizeActionCountResetTime: normalizeActionCountResetTime,
  msUntilNextActionCountReset: msUntilNextActionCountReset,
  getLatestActionCountResetBoundary: getLatestActionCountResetBoundary
};
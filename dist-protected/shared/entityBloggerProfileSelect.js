'use strict';

const BLOGGER_WORK_SELECT_COUNT = "count";
const BLOGGER_WORK_SELECT_DAYS = "days";
const BLOGGER_WORK_COUNT_DEFAULT = 10;
const BLOGGER_WORK_COUNT_MAX = 50;
const BLOGGER_PUBLISH_DAYS_DEFAULT = 3;
const BLOGGER_PUBLISH_DAYS_MAX = 365;
const BLOGGER_PUBLISH_DAYS_PRESETS = Object.freeze([1, 3, 7, 30]);
function normalizeBloggerWorkSelectMode(arg1) {
  if (arg1 === BLOGGER_WORK_SELECT_COUNT) {
    return BLOGGER_WORK_SELECT_COUNT;
  } else {
    return BLOGGER_WORK_SELECT_DAYS;
  }
}
function normalizeBloggerWorkCount(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return BLOGGER_WORK_COUNT_DEFAULT;
  }
  return Math.max(1, Math.min(BLOGGER_WORK_COUNT_MAX, Math.floor(result)));
}
function normalizeBloggerPublishWithinDays(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return BLOGGER_PUBLISH_DAYS_DEFAULT;
  }
  return Math.max(1, Math.min(BLOGGER_PUBLISH_DAYS_MAX, Math.floor(result)));
}
function resolvePublishWithinDaysCutoffMs(arg1, arg2 = Date.now()) {
  const result = normalizeBloggerPublishWithinDays(arg1);
  const value = Number(arg2) > 0 ? Number(arg2) : Date.now();
  return value - result * 24 * 60 * 60 * 1000;
}
function normalizeAwemeCreateTimeMs(arg1) {
  const result = Number(arg1);
  if (!Number.isFinite(result) || result <= 0) {
    return 0;
  }
  if (result < 1000000000000) {
    return Math.floor(result * 1000);
  }
  return Math.floor(result);
}
function isBloggerWorkWithinPublishDays(options = {}, arg2, arg3 = Date.now()) {
  const result = normalizeBloggerPublishWithinDays(arg2);
  const value = Number(arg3) > 0 ? Number(arg3) : Date.now();
  const result2 = String(options.publishTimeText || options.timeText || "").replace(/\s+/g, "");
  const result3 = result2.match(/(\d{1,3})天前/);
  if (result3 && Number(result3[1]) >= result) {
    return false;
  }
  if (/昨天/.test(result2) && result <= 1) {
    return false;
  }
  if (/前天/.test(result2) && result <= 2) {
    return false;
  }
  const result4 = normalizeAwemeCreateTimeMs(options.createTimeMs ?? options.createTime ?? 0);
  if (!(result4 > 0)) {
    return true;
  }
  const result5 = resolvePublishWithinDaysCutoffMs(result, value);
  return result4 > result5;
}
function selectBloggerProfileWorks(arg1, options = {}) {
  const value = Array.isArray(arg1) ? arg1.filter(arg1 => arg1 && arg1.awemeId) : [];
  const result = normalizeBloggerWorkSelectMode(options.mode);
  if (result === BLOGGER_WORK_SELECT_COUNT) {
    const result = normalizeBloggerWorkCount(options.count);
    return value.slice(0, result);
  }
  const result2 = normalizeBloggerPublishWithinDays(options.withinDays);
  const value2 = Number(options.nowMs) > 0 ? Number(options.nowMs) : Date.now();
  const result3 = value.some(arg1 => normalizeAwemeCreateTimeMs(arg1.createTimeMs ?? arg1.createTime ?? 0) > 0 || String(arg1.publishTimeText || arg1.timeText || "").trim());
  if (!result3) {
    return value;
  }
  const list = [];
  for (const item of value) {
    const result = normalizeAwemeCreateTimeMs(item.createTimeMs ?? item.createTime ?? 0);
    const flag = !!String(item.publishTimeText || item.timeText || "").trim();
    if (result > 0 || flag) {
      if (!isBloggerWorkWithinPublishDays(item, result2, value2)) {
        break;
      }
      list.push(item);
      continue;
    }
    list.push(item);
  }
  return list;
}
module.exports = {
  BLOGGER_WORK_SELECT_COUNT: BLOGGER_WORK_SELECT_COUNT,
  BLOGGER_WORK_SELECT_DAYS: BLOGGER_WORK_SELECT_DAYS,
  BLOGGER_WORK_COUNT_DEFAULT: BLOGGER_WORK_COUNT_DEFAULT,
  BLOGGER_WORK_COUNT_MAX: BLOGGER_WORK_COUNT_MAX,
  BLOGGER_PUBLISH_DAYS_DEFAULT: BLOGGER_PUBLISH_DAYS_DEFAULT,
  BLOGGER_PUBLISH_DAYS_MAX: BLOGGER_PUBLISH_DAYS_MAX,
  BLOGGER_PUBLISH_DAYS_PRESETS: BLOGGER_PUBLISH_DAYS_PRESETS,
  normalizeBloggerWorkSelectMode: normalizeBloggerWorkSelectMode,
  normalizeBloggerWorkCount: normalizeBloggerWorkCount,
  normalizeBloggerPublishWithinDays: normalizeBloggerPublishWithinDays,
  normalizeAwemeCreateTimeMs: normalizeAwemeCreateTimeMs,
  resolvePublishWithinDaysCutoffMs: resolvePublishWithinDaysCutoffMs,
  isBloggerWorkWithinPublishDays: isBloggerWorkWithinPublishDays,
  selectBloggerProfileWorks: selectBloggerProfileWorks
};
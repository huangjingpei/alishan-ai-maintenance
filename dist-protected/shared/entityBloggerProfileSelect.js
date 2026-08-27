'use strict';

const BLOGGER_WORK_SELECT_COUNT = "count";
const BLOGGER_WORK_SELECT_DAYS = "days";
const BLOGGER_WORK_COUNT_DEFAULT = 10;
const BLOGGER_WORK_COUNT_MAX = 50;
const BLOGGER_PUBLISH_DAYS_DEFAULT = 3;
const BLOGGER_PUBLISH_DAYS_MAX = 365;
const BLOGGER_PUBLISH_DAYS_PRESETS = Object.freeze([1, 3, 7, 30]);
function normalizeBloggerWorkSelectMode(_0x71f4cc) {
  if (_0x71f4cc === BLOGGER_WORK_SELECT_COUNT) {
    return BLOGGER_WORK_SELECT_COUNT;
  } else {
    return BLOGGER_WORK_SELECT_DAYS;
  }
}
function normalizeBloggerWorkCount(_0x26cf18) {
  const _0x41131e = Number(_0x26cf18);
  if (!Number.isFinite(_0x41131e) || _0x41131e <= 0) {
    return BLOGGER_WORK_COUNT_DEFAULT;
  }
  return Math.max(1, Math.min(BLOGGER_WORK_COUNT_MAX, Math.floor(_0x41131e)));
}
function normalizeBloggerPublishWithinDays(_0x542b64) {
  const _0x25a943 = Number(_0x542b64);
  if (!Number.isFinite(_0x25a943) || _0x25a943 <= 0) {
    return BLOGGER_PUBLISH_DAYS_DEFAULT;
  }
  return Math.max(1, Math.min(BLOGGER_PUBLISH_DAYS_MAX, Math.floor(_0x25a943)));
}
function resolvePublishWithinDaysCutoffMs(_0x19f07c, _0x4965ec = Date.now()) {
  const _0x14fdb0 = normalizeBloggerPublishWithinDays(_0x19f07c);
  const _0x3eb0cb = Number(_0x4965ec) > 0 ? Number(_0x4965ec) : Date.now();
  return _0x3eb0cb - _0x14fdb0 * 24 * 60 * 60 * 1000;
}
function normalizeAwemeCreateTimeMs(_0x1838b8) {
  const _0x3de544 = Number(_0x1838b8);
  if (!Number.isFinite(_0x3de544) || _0x3de544 <= 0) {
    return 0;
  }
  if (_0x3de544 < 1000000000000) {
    return Math.floor(_0x3de544 * 1000);
  }
  return Math.floor(_0x3de544);
}
function isBloggerWorkWithinPublishDays(_0x5919ee = {}, _0x4dc92e, _0x5906ec = Date.now()) {
  const _0x33a059 = normalizeBloggerPublishWithinDays(_0x4dc92e);
  const _0x32acfd = Number(_0x5906ec) > 0 ? Number(_0x5906ec) : Date.now();
  const _0x104951 = String(_0x5919ee.publishTimeText || _0x5919ee.timeText || "").replace(/\s+/g, "");
  const _0x36ddbb = _0x104951.match(/(\d{1,3})天前/);
  if (_0x36ddbb && Number(_0x36ddbb[1]) >= _0x33a059) {
    return false;
  }
  if (/昨天/.test(_0x104951) && _0x33a059 <= 1) {
    return false;
  }
  if (/前天/.test(_0x104951) && _0x33a059 <= 2) {
    return false;
  }
  const _0x5b0d0a = normalizeAwemeCreateTimeMs(_0x5919ee.createTimeMs ?? _0x5919ee.createTime ?? 0);
  if (!(_0x5b0d0a > 0)) {
    return true;
  }
  const _0x1c2203 = resolvePublishWithinDaysCutoffMs(_0x33a059, _0x32acfd);
  return _0x5b0d0a > _0x1c2203;
}
function selectBloggerProfileWorks(_0x3377a1, _0x166f07 = {}) {
  const _0x3a15e0 = Array.isArray(_0x3377a1) ? _0x3377a1.filter(_0x3ba039 => _0x3ba039 && _0x3ba039.awemeId) : [];
  const _0x53f120 = normalizeBloggerWorkSelectMode(_0x166f07.mode);
  if (_0x53f120 === BLOGGER_WORK_SELECT_COUNT) {
    const _0x7ffe27 = normalizeBloggerWorkCount(_0x166f07.count);
    return _0x3a15e0.slice(0, _0x7ffe27);
  }
  const _0x37ddcd = normalizeBloggerPublishWithinDays(_0x166f07.withinDays);
  const _0x5daf81 = Number(_0x166f07.nowMs) > 0 ? Number(_0x166f07.nowMs) : Date.now();
  const _0x3cea31 = _0x3a15e0.some(_0x49a4c3 => normalizeAwemeCreateTimeMs(_0x49a4c3.createTimeMs ?? _0x49a4c3.createTime ?? 0) > 0 || String(_0x49a4c3.publishTimeText || _0x49a4c3.timeText || "").trim());
  if (!_0x3cea31) {
    return _0x3a15e0;
  }
  const _0x5eb768 = [];
  for (const _0x615352 of _0x3a15e0) {
    const _0x3c7284 = normalizeAwemeCreateTimeMs(_0x615352.createTimeMs ?? _0x615352.createTime ?? 0);
    const _0x517bdc = !!String(_0x615352.publishTimeText || _0x615352.timeText || "").trim();
    if (_0x3c7284 > 0 || _0x517bdc) {
      if (!isBloggerWorkWithinPublishDays(_0x615352, _0x37ddcd, _0x5daf81)) {
        break;
      }
      _0x5eb768.push(_0x615352);
      continue;
    }
    _0x5eb768.push(_0x615352);
  }
  return _0x5eb768;
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
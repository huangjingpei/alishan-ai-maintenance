'use strict';

const FILTER_LOCK_SUFFIXES = ["", "_attempts", "_sort", "_time", "_duration", "_scope", "_format", "_warned"];
function buildAppliedFiltersBaseKey(_0xa39916, _0x5c6387) {
  return "applied_filters_" + String(_0xa39916 || "") + "_" + String(_0x5c6387 || "");
}
function listAppliedFilterSessionKeys(_0x5c6b30, _0x1ac6bf) {
  const _0x1297c5 = buildAppliedFiltersBaseKey(_0x5c6b30, _0x1ac6bf);
  return FILTER_LOCK_SUFFIXES.map(_0x1b87be => "" + _0x1297c5 + _0x1b87be);
}
function clearAppliedSearchFilterSession(_0x4c9475, _0xcbc50a, _0x318ff7) {
  if (!_0x4c9475 || typeof _0x4c9475.removeItem !== "function") {
    return 0;
  }
  let _0x82eaf0 = 0;
  for (const _0x2dddc8 of listAppliedFilterSessionKeys(_0xcbc50a, _0x318ff7)) {
    try {
      if (typeof _0x4c9475.getItem === "function" && _0x4c9475.getItem(_0x2dddc8) == null) {
        continue;
      }
      _0x4c9475.removeItem(_0x2dddc8);
      _0x82eaf0 += 1;
    } catch (_0x2c0859) {}
  }
  return _0x82eaf0;
}
function shouldCountFilterAttempt({
  uiReady = false
} = {}) {
  return uiReady === true;
}
function shouldForceMarkFiltersApplied({
  attempts = 0,
  maxAttempts = 5
} = {}) {
  return Number(attempts) >= Math.max(1, Number(maxAttempts) || 5);
}
module.exports = {
  FILTER_LOCK_SUFFIXES: FILTER_LOCK_SUFFIXES,
  buildAppliedFiltersBaseKey: buildAppliedFiltersBaseKey,
  listAppliedFilterSessionKeys: listAppliedFilterSessionKeys,
  clearAppliedSearchFilterSession: clearAppliedSearchFilterSession,
  shouldCountFilterAttempt: shouldCountFilterAttempt,
  shouldForceMarkFiltersApplied: shouldForceMarkFiltersApplied
};
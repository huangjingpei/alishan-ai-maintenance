'use strict';

const FILTER_LOCK_SUFFIXES = ["", "_attempts", "_sort", "_time", "_duration", "_scope", "_format", "_warned"];
function buildAppliedFiltersBaseKey(arg1, arg2) {
  return "applied_filters_" + String(arg1 || "") + "_" + String(arg2 || "");
}
function listAppliedFilterSessionKeys(arg1, arg2) {
  const result = buildAppliedFiltersBaseKey(arg1, arg2);
  return FILTER_LOCK_SUFFIXES.map(arg1 => "" + result + arg1);
}
function clearAppliedSearchFilterSession(arg1, arg2, arg3) {
  if (!arg1 || typeof arg1.removeItem !== "function") {
    return 0;
  }
  let num = 0;
  for (const item of listAppliedFilterSessionKeys(arg2, arg3)) {
    try {
      if (typeof arg1.getItem === "function" && arg1.getItem(item) == null) {
        continue;
      }
      arg1.removeItem(item);
      num += 1;
    } catch (error) {}
  }
  return num;
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
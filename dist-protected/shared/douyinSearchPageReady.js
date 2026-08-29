'use strict';

const DEFAULT_RENDER_SETTLE_MIN_MS = 3000;
const DEFAULT_RENDER_SETTLE_MAX_MS = 5000;
const DEFAULT_RENDER_SETTLE_MS = 4000;
const SEARCH_API_URL_RE = /\/aweme\/v1\/web\/(?:general\/search|discover\/search|search\/item|search\/single|search\/)|aweme_general_search|\/search\/item|\/search\/single/i;
function isDouyinSearchApiUrl(arg1) {
  return SEARCH_API_URL_RE.test(String(arg1 || ""));
}
function pickRenderSettleMs(arg1 = Math.random) {
  const value = DEFAULT_RENDER_SETTLE_MAX_MS - DEFAULT_RENDER_SETTLE_MIN_MS;
  const value2 = typeof arg1 === "function" ? Number(arg1()) : 0.5;
  const value3 = Number.isFinite(value2) ? Math.min(1, Math.max(0, value2)) : 0.5;
  return Math.round(DEFAULT_RENDER_SETTLE_MIN_MS + value * value3);
}
function createSearchApiReadyTracker() {
  let num = 0;
  let local = null;
  return {
    bumpGeneration() {
      num += 1;
      local = null;
      return num;
    },
    getGeneration() {
      return num;
    },
    noteApiDetail(options = {}, arg2 = Date.now()) {
      const result = String(options.url || "");
      if (!isDouyinSearchApiUrl(result)) {
        return null;
      }
      const value = Array.isArray(options.awemes) ? options.awemes : [];
      const value2 = value.length;
      const value3 = options.searchEmpty === true;
      if (value2 <= 0 && !value3) {
        return null;
      }
      local = {
        generation: num,
        at: Number(arg2) || Date.now(),
        awemeCount: value2,
        empty: value2 <= 0,
        url: result.slice(0, 240)
      };
      return local;
    },
    getSignal() {
      return local;
    },
    hasFreshResults(arg1 = num) {
      return !!local && local.generation === arg1 && !local.empty && !!(Number(local.awemeCount) > 0);
    },
    hasFreshEmpty(arg1 = num) {
      return !!local && local.generation === arg1 && local.empty === true;
    },
    reset() {
      local = null;
    }
  };
}
function evaluateSearchSlowNetTick({
  pageLoading = false,
  domVisibleLinks = 0,
  domContentCards = 0,
  loginGate = false,
  emptyResult = false,
  apiHasResults = false,
  apiReadyAt = 0,
  settleMs = DEFAULT_RENDER_SETTLE_MS,
  now = Date.now()
} = {}) {
  if (pageLoading) {
    return {
      action: "wait_loading",
      ready: false
    };
  }
  const local = Number(domVisibleLinks) > 0 || Number(domContentCards) > 0;
  if (local) {
    return {
      action: "dom_ready",
      ready: true
    };
  }
  if (loginGate) {
    return {
      action: "login_gate",
      ready: false
    };
  }
  if (apiHasResults) {
    const local = Number(apiReadyAt) || Number(now) || 0;
    const result = Math.max(0, (Number(now) || Date.now()) - local);
    const result2 = Math.max(DEFAULT_RENDER_SETTLE_MIN_MS, Number(settleMs) || DEFAULT_RENDER_SETTLE_MS);
    if (result < result2) {
      return {
        action: "settle_render",
        ready: false,
        settleRemainingMs: result2 - result
      };
    }
    return {
      action: "api_ready_after_settle",
      ready: true
    };
  }
  if (emptyResult) {
    return {
      action: "empty",
      ready: false
    };
  }
  return {
    action: "wait_network",
    ready: false
  };
}
module.exports = {
  SEARCH_API_URL_RE: SEARCH_API_URL_RE,
  DEFAULT_RENDER_SETTLE_MIN_MS: DEFAULT_RENDER_SETTLE_MIN_MS,
  DEFAULT_RENDER_SETTLE_MAX_MS: DEFAULT_RENDER_SETTLE_MAX_MS,
  DEFAULT_RENDER_SETTLE_MS: DEFAULT_RENDER_SETTLE_MS,
  isDouyinSearchApiUrl: isDouyinSearchApiUrl,
  pickRenderSettleMs: pickRenderSettleMs,
  createSearchApiReadyTracker: createSearchApiReadyTracker,
  evaluateSearchSlowNetTick: evaluateSearchSlowNetTick
};
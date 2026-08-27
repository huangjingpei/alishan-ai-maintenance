'use strict';

const DEFAULT_RENDER_SETTLE_MIN_MS = 3000;
const DEFAULT_RENDER_SETTLE_MAX_MS = 5000;
const DEFAULT_RENDER_SETTLE_MS = 4000;
const SEARCH_API_URL_RE = /\/aweme\/v1\/web\/(?:general\/search|discover\/search|search\/item|search\/single|search\/)|aweme_general_search|\/search\/item|\/search\/single/i;
function isDouyinSearchApiUrl(_0x4c532f) {
  return SEARCH_API_URL_RE.test(String(_0x4c532f || ""));
}
function pickRenderSettleMs(_0x4cc5c6 = Math.random) {
  const _0x1ae0e3 = DEFAULT_RENDER_SETTLE_MAX_MS - DEFAULT_RENDER_SETTLE_MIN_MS;
  const _0x1f48b6 = typeof _0x4cc5c6 === "function" ? Number(_0x4cc5c6()) : 0.5;
  const _0x483315 = Number.isFinite(_0x1f48b6) ? Math.min(1, Math.max(0, _0x1f48b6)) : 0.5;
  return Math.round(DEFAULT_RENDER_SETTLE_MIN_MS + _0x1ae0e3 * _0x483315);
}
function createSearchApiReadyTracker() {
  let _0x10acfb = 0;
  let _0x1a27ef = null;
  return {
    bumpGeneration() {
      _0x10acfb += 1;
      _0x1a27ef = null;
      return _0x10acfb;
    },
    getGeneration() {
      return _0x10acfb;
    },
    noteApiDetail(_0x426a4d = {}, _0x50a5bc = Date.now()) {
      const _0x3074bd = String(_0x426a4d.url || "");
      if (!isDouyinSearchApiUrl(_0x3074bd)) {
        return null;
      }
      const _0x233f56 = Array.isArray(_0x426a4d.awemes) ? _0x426a4d.awemes : [];
      const _0x2715ac = _0x233f56.length;
      const _0x44bbc3 = _0x426a4d.searchEmpty === true;
      if (_0x2715ac <= 0 && !_0x44bbc3) {
        return null;
      }
      _0x1a27ef = {
        generation: _0x10acfb,
        at: Number(_0x50a5bc) || Date.now(),
        awemeCount: _0x2715ac,
        empty: _0x2715ac <= 0,
        url: _0x3074bd.slice(0, 240)
      };
      return _0x1a27ef;
    },
    getSignal() {
      return _0x1a27ef;
    },
    hasFreshResults(_0x303af9 = _0x10acfb) {
      return !!_0x1a27ef && _0x1a27ef.generation === _0x303af9 && !_0x1a27ef.empty && !!(Number(_0x1a27ef.awemeCount) > 0);
    },
    hasFreshEmpty(_0x50f48a = _0x10acfb) {
      return !!_0x1a27ef && _0x1a27ef.generation === _0x50f48a && _0x1a27ef.empty === true;
    },
    reset() {
      _0x1a27ef = null;
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
  const _0x3b6137 = Number(domVisibleLinks) > 0 || Number(domContentCards) > 0;
  if (_0x3b6137) {
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
    const _0x13a98 = Number(apiReadyAt) || Number(now) || 0;
    const _0x47418f = Math.max(0, (Number(now) || Date.now()) - _0x13a98);
    const _0x50d6b2 = Math.max(DEFAULT_RENDER_SETTLE_MIN_MS, Number(settleMs) || DEFAULT_RENDER_SETTLE_MS);
    if (_0x47418f < _0x50d6b2) {
      return {
        action: "settle_render",
        ready: false,
        settleRemainingMs: _0x50d6b2 - _0x47418f
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
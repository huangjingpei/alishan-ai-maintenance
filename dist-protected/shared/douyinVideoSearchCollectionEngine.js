'use strict';

const policy = require("./douyinVideoSearchScrapePolicy");
const DEFAULT_EMPTY_LIMIT = policy.ENTITY_VIDEO_SEARCH_EMPTY_LIMIT;
const DEFAULT_BOTTOM_EMPTY_LIMIT = 3;
const DEFAULT_SCROLL_DELTA = policy.VIDEO_SEARCH_SCROLL_DELTA_Y;
function normalizeCount(_0x4a6561) {
  const _0x490311 = Number(_0x4a6561);
  if (Number.isFinite(_0x490311) && _0x490311 > 0) {
    return Math.floor(_0x490311);
  } else {
    return 0;
  }
}
function evaluateVideoSearchCollectionRound({
  previousEmptyRounds = 0,
  added = 0,
  sourceGrew = false,
  atBottom = false,
  reachedLimit = false,
  emptyLimit = DEFAULT_EMPTY_LIMIT,
  bottomEmptyLimit = DEFAULT_BOTTOM_EMPTY_LIMIT
} = {}) {
  const _0x17afdb = normalizeCount(added) > 0 || sourceGrew === true;
  const _0x20afc8 = _0x17afdb ? 0 : normalizeCount(previousEmptyRounds) + 1;
  const _0x1e4f3d = Math.max(1, normalizeCount(emptyLimit) || DEFAULT_EMPTY_LIMIT);
  const _0x563476 = Math.max(1, Math.min(_0x1e4f3d, normalizeCount(bottomEmptyLimit) || DEFAULT_BOTTOM_EMPTY_LIMIT));
  const _0x1760d0 = !reachedLimit && (_0x20afc8 >= _0x1e4f3d || atBottom === true && _0x20afc8 >= _0x563476);
  return {
    gainedData: _0x17afdb,
    emptyRounds: _0x20afc8,
    reachedLimit: reachedLimit === true,
    exhausted: _0x1760d0,
    shouldStop: reachedLimit === true || _0x1760d0
  };
}
async function performVideoSearchWindowScroll({
  scrollBy: _0x357c46,
  wait: _0x344f6b,
  readApiCount = () => 0,
  readDomCount = () => 0,
  readViewport = () => ({}),
  delta = DEFAULT_SCROLL_DELTA,
  waitMinMs = 1800,
  waitMaxMs = 3200
} = {}) {
  if (typeof _0x357c46 !== "function") {
    throw new TypeError("scrollBy is required");
  }
  if (typeof _0x344f6b !== "function") {
    throw new TypeError("wait is required");
  }
  const _0x188c57 = normalizeCount(readApiCount());
  const _0x20bb28 = normalizeCount(readDomCount());
  const _0x3b3fe5 = readViewport() || {};
  await _0x357c46(Number(delta) || DEFAULT_SCROLL_DELTA);
  const _0x43348a = Math.max(0, Number(waitMaxMs) - Number(waitMinMs));
  const _0xd3b51f = Math.max(0, Number(waitMinMs) || 0) + Math.random() * _0x43348a;
  const _0x79d28a = await _0x344f6b(_0xd3b51f);
  if (_0x79d28a === false) {
    return {
      cancelled: true
    };
  }
  const _0x3c4b1b = normalizeCount(readApiCount());
  const _0x643b44 = normalizeCount(readDomCount());
  const _0x46d01f = readViewport() || {};
  return {
    cancelled: false,
    sourceGrew: _0x3c4b1b > _0x188c57 || _0x643b44 > _0x20bb28,
    beforeApi: _0x188c57,
    afterApi: _0x3c4b1b,
    beforeDom: _0x20bb28,
    afterDom: _0x643b44,
    beforeViewport: _0x3b3fe5,
    afterViewport: _0x46d01f,
    delta: Number(delta) || DEFAULT_SCROLL_DELTA,
    waitMs: Math.round(_0xd3b51f)
  };
}
module.exports = {
  DEFAULT_EMPTY_LIMIT: DEFAULT_EMPTY_LIMIT,
  DEFAULT_BOTTOM_EMPTY_LIMIT: DEFAULT_BOTTOM_EMPTY_LIMIT,
  DEFAULT_SCROLL_DELTA: DEFAULT_SCROLL_DELTA,
  evaluateVideoSearchCollectionRound: evaluateVideoSearchCollectionRound,
  performVideoSearchWindowScroll: performVideoSearchWindowScroll
};
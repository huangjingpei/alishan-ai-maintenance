'use strict';

const policy = require("./douyinVideoSearchScrapePolicy");
const DEFAULT_EMPTY_LIMIT = policy.ENTITY_VIDEO_SEARCH_EMPTY_LIMIT;
const DEFAULT_BOTTOM_EMPTY_LIMIT = 3;
const DEFAULT_SCROLL_DELTA = policy.VIDEO_SEARCH_SCROLL_DELTA_Y;
function normalizeCount(arg1) {
  const result = Number(arg1);
  if (Number.isFinite(result) && result > 0) {
    return Math.floor(result);
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
  const local = normalizeCount(added) > 0 || sourceGrew === true;
  const value = local ? 0 : normalizeCount(previousEmptyRounds) + 1;
  const result = Math.max(1, normalizeCount(emptyLimit) || DEFAULT_EMPTY_LIMIT);
  const result2 = Math.max(1, Math.min(result, normalizeCount(bottomEmptyLimit) || DEFAULT_BOTTOM_EMPTY_LIMIT));
  const local2 = !reachedLimit && (value >= result || atBottom === true && value >= result2);
  return {
    gainedData: local,
    emptyRounds: value,
    reachedLimit: reachedLimit === true,
    exhausted: local2,
    shouldStop: reachedLimit === true || local2
  };
}
async function performVideoSearchWindowScroll({
  scrollBy: scrollBy,
  wait: wait,
  readApiCount = () => 0,
  readDomCount = () => 0,
  readViewport = () => ({}),
  delta = DEFAULT_SCROLL_DELTA,
  waitMinMs = 1800,
  waitMaxMs = 3200
} = {}) {
  if (typeof scrollBy !== "function") {
    throw new TypeError("scrollBy is required");
  }
  if (typeof wait !== "function") {
    throw new TypeError("wait is required");
  }
  const result = normalizeCount(readApiCount());
  const result2 = normalizeCount(readDomCount());
  const local = readViewport() || {};
  await scrollBy(Number(delta) || DEFAULT_SCROLL_DELTA);
  const result3 = Math.max(0, Number(waitMaxMs) - Number(waitMinMs));
  const value = Math.max(0, Number(waitMinMs) || 0) + Math.random() * result3;
  const result4 = await wait(value);
  if (result4 === false) {
    return {
      cancelled: true
    };
  }
  const result5 = normalizeCount(readApiCount());
  const result6 = normalizeCount(readDomCount());
  const local2 = readViewport() || {};
  return {
    cancelled: false,
    sourceGrew: result5 > result || result6 > result2,
    beforeApi: result,
    afterApi: result5,
    beforeDom: result2,
    afterDom: result6,
    beforeViewport: local,
    afterViewport: local2,
    delta: Number(delta) || DEFAULT_SCROLL_DELTA,
    waitMs: Math.round(value)
  };
}
module.exports = {
  DEFAULT_EMPTY_LIMIT: DEFAULT_EMPTY_LIMIT,
  DEFAULT_BOTTOM_EMPTY_LIMIT: DEFAULT_BOTTOM_EMPTY_LIMIT,
  DEFAULT_SCROLL_DELTA: DEFAULT_SCROLL_DELTA,
  evaluateVideoSearchCollectionRound: evaluateVideoSearchCollectionRound,
  performVideoSearchWindowScroll: performVideoSearchWindowScroll
};
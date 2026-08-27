'use strict';

const ALLOWED_SCRAPE_TARGETS = new Set(["comments", "video", "author"]);
function getScrapeTargetSet(_0x156c92 = {}) {
  const _0x209ec1 = ALLOWED_SCRAPE_TARGETS;
  const _0x25ecbd = Array.isArray(_0x156c92?.scrapeTargets) ? _0x156c92.scrapeTargets.filter(_0x342f33 => _0x209ec1.has(_0x342f33)) : [];
  return new Set(_0x25ecbd.length > 0 ? _0x25ecbd : ["comments"]);
}
function isLinkOnlyScrapeTask(_0x1db8ee = {}) {
  if (_0x1db8ee?.taskMode !== "scrape") {
    return false;
  }
  const _0x5b2edf = getScrapeTargetSet(_0x1db8ee);
  return !_0x5b2edf.has("comments") && (_0x5b2edf.has("video") || _0x5b2edf.has("author"));
}
function hasMinVideoStatFilters(_0x237762 = {}) {
  return ["minVideoLike", "minVideoComment", "minVideoCollect", "minVideoShare"].some(_0x56b3dc => (parseInt(_0x237762?.[_0x56b3dc], 10) || 0) > 0);
}
function canLinkOnlyScrapeWithoutOpen(_0x1964c9 = {}) {
  return isLinkOnlyScrapeTask(_0x1964c9) && !hasMinVideoStatFilters(_0x1964c9);
}
function entityTargetsToScrapeTask(_0x299a73 = {}) {
  const _0x8c5d85 = Array.isArray(_0x299a73.scrapeTargets) ? _0x299a73.scrapeTargets.slice() : [];
  const _0x2ec694 = _0x8c5d85.filter(_0x5b7893 => ALLOWED_SCRAPE_TARGETS.has(_0x5b7893));
  return {
    taskMode: "scrape",
    scrapeTargets: _0x2ec694.length ? _0x2ec694 : ["video"],
    searchSort: _0x299a73.searchSort ?? "0",
    searchPublishTime: _0x299a73.searchPublishTime ?? "0",
    searchDuration: _0x299a73.searchDuration ?? "0",
    searchScope: _0x299a73.searchScope ?? "0",
    searchFormat: _0x299a73.searchFormat ?? "0",
    minVideoLike: _0x299a73.minVideoLike,
    minVideoComment: _0x299a73.minVideoComment,
    minVideoCollect: _0x299a73.minVideoCollect,
    minVideoShare: _0x299a73.minVideoShare
  };
}
function hasActiveOfficialSearchFilters(_0x5eab0c = {}) {
  return ["searchSort", "searchPublishTime", "searchDuration", "searchScope", "searchFormat"].some(_0x4b215b => String(_0x5eab0c?.[_0x4b215b] ?? "0") !== "0");
}
const VIDEO_SEARCH_SCROLL_DELTA_Y = 1000;
const ENTITY_VIDEO_SEARCH_EMPTY_LIMIT = 6;
const ENTITY_VIDEO_SEARCH_MAX_ROUNDS = 200;
module.exports = {
  ALLOWED_SCRAPE_TARGETS: ALLOWED_SCRAPE_TARGETS,
  getScrapeTargetSet: getScrapeTargetSet,
  isLinkOnlyScrapeTask: isLinkOnlyScrapeTask,
  hasMinVideoStatFilters: hasMinVideoStatFilters,
  canLinkOnlyScrapeWithoutOpen: canLinkOnlyScrapeWithoutOpen,
  entityTargetsToScrapeTask: entityTargetsToScrapeTask,
  hasActiveOfficialSearchFilters: hasActiveOfficialSearchFilters,
  VIDEO_SEARCH_SCROLL_DELTA_Y: VIDEO_SEARCH_SCROLL_DELTA_Y,
  ENTITY_VIDEO_SEARCH_EMPTY_LIMIT: ENTITY_VIDEO_SEARCH_EMPTY_LIMIT,
  ENTITY_VIDEO_SEARCH_MAX_ROUNDS: ENTITY_VIDEO_SEARCH_MAX_ROUNDS
};
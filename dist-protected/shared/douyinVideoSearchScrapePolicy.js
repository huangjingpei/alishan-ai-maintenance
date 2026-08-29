'use strict';

const ALLOWED_SCRAPE_TARGETS = new Set(["comments", "video", "author"]);
function getScrapeTargetSet(options = {}) {
  const local = ALLOWED_SCRAPE_TARGETS;
  const value = Array.isArray(options?.scrapeTargets) ? options.scrapeTargets.filter(arg1 => local.has(arg1)) : [];
  return new Set(value.length > 0 ? value : ["comments"]);
}
function isLinkOnlyScrapeTask(options = {}) {
  if (options?.taskMode !== "scrape") {
    return false;
  }
  const result = getScrapeTargetSet(options);
  return !result.has("comments") && (result.has("video") || result.has("author"));
}
function hasMinVideoStatFilters(options = {}) {
  return ["minVideoLike", "minVideoComment", "minVideoCollect", "minVideoShare"].some(arg1 => (parseInt(options?.[arg1], 10) || 0) > 0);
}
function canLinkOnlyScrapeWithoutOpen(options = {}) {
  return isLinkOnlyScrapeTask(options) && !hasMinVideoStatFilters(options);
}
function entityTargetsToScrapeTask(options = {}) {
  const value = Array.isArray(options.scrapeTargets) ? options.scrapeTargets.slice() : [];
  const result = value.filter(arg1 => ALLOWED_SCRAPE_TARGETS.has(arg1));
  return {
    taskMode: "scrape",
    scrapeTargets: result.length ? result : ["video"],
    searchSort: options.searchSort ?? "0",
    searchPublishTime: options.searchPublishTime ?? "0",
    searchDuration: options.searchDuration ?? "0",
    searchScope: options.searchScope ?? "0",
    searchFormat: options.searchFormat ?? "0",
    minVideoLike: options.minVideoLike,
    minVideoComment: options.minVideoComment,
    minVideoCollect: options.minVideoCollect,
    minVideoShare: options.minVideoShare
  };
}
function hasActiveOfficialSearchFilters(options = {}) {
  return ["searchSort", "searchPublishTime", "searchDuration", "searchScope", "searchFormat"].some(arg1 => String(options?.[arg1] ?? "0") !== "0");
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
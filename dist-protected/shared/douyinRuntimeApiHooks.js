'use strict';

const DEFAULT_ENTITY_INTERESTING = String.raw`/aweme/v1/web/(general/search|discover/search|search/item|search/single|search/|user/follower|user/following|comment/list|comment/list/reply|aweme/favorite|aweme/detail|aweme/post)|/search/item|/search/single|/comment/list|aweme_general_search|aweme_video_web|aweme_user_web|/webcast/`;
const DEFAULT_ENTITY_USERISH = String.raw`search_channel=aweme_user|aweme_user_web|\btype=user\b|/user/search|search/user|channel=aweme_user`;
const DEFAULT_ENTITY_RELATION = String.raw`follower/list|following/list|/user/follower|/user/following`;
const DEFAULT_ENTITY_LIVE = String.raw`/webcast/(im/fetch|room/reflow/info|chat)`;
const DEFAULT_ENTITY_USER_SEARCH = String.raw`/aweme/v1/web/discover/search|search_channel=aweme_user|aweme_user_web`;
const DEFAULT_SCRAPE_INTERESTING = String.raw`/aweme/v1/web/(?:general/search|discover/search|search/item|search/single|search/|aweme/detail|detail/|aweme/favorite|aweme/post|aweme/listcollection|tab/feed|module/feed|recommend/item|nearby/feed)|/web/api/v2/aweme/like|/search/item|/search/single|aweme_general_search|aweme_video_web`;
function sanitizeRegexSource(arg1) {
  const value = typeof arg1 === "string" ? arg1.trim() : "";
  if (!value || value.length < 3 || value.length > 4000) {
    return "";
  }
  try {
    new RegExp(value, "i");
    return value;
  } catch (error) {
    return "";
  }
}
function pickHook(arg1, arg2, arg3) {
  return sanitizeRegexSource(arg1?.[arg2]) || arg3;
}
function resolveEntityApiHooks(arg1) {
  return {
    interesting: pickHook(arg1, "interesting", DEFAULT_ENTITY_INTERESTING),
    userish: pickHook(arg1, "userish", DEFAULT_ENTITY_USERISH),
    relation: pickHook(arg1, "relation", DEFAULT_ENTITY_RELATION),
    live: pickHook(arg1, "live", DEFAULT_ENTITY_LIVE),
    userSearch: pickHook(arg1, "userSearch", DEFAULT_ENTITY_USER_SEARCH)
  };
}
function resolveScrapeApiHooks(arg1) {
  return {
    scrapeInteresting: pickHook(arg1, "scrapeInteresting", DEFAULT_SCRAPE_INTERESTING)
  };
}
function toJsRegexLiteral(arg1, text = "i") {
  const result = String(arg1).replace(/\\/g, "\\\\").replace(/\//g, "\\/");
  return "/" + result + "/" + text;
}
module.exports = {
  DEFAULT_ENTITY_INTERESTING: DEFAULT_ENTITY_INTERESTING,
  DEFAULT_ENTITY_USERISH: DEFAULT_ENTITY_USERISH,
  DEFAULT_ENTITY_RELATION: DEFAULT_ENTITY_RELATION,
  DEFAULT_ENTITY_LIVE: DEFAULT_ENTITY_LIVE,
  DEFAULT_ENTITY_USER_SEARCH: DEFAULT_ENTITY_USER_SEARCH,
  DEFAULT_SCRAPE_INTERESTING: DEFAULT_SCRAPE_INTERESTING,
  sanitizeRegexSource: sanitizeRegexSource,
  resolveEntityApiHooks: resolveEntityApiHooks,
  resolveScrapeApiHooks: resolveScrapeApiHooks,
  toJsRegexLiteral: toJsRegexLiteral
};
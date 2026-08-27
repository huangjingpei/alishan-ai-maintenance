'use strict';

const DEFAULT_ENTITY_INTERESTING = String.raw`/aweme/v1/web/(general/search|discover/search|search/item|search/single|search/|user/follower|user/following|comment/list|comment/list/reply|aweme/favorite|aweme/detail|aweme/post)|/search/item|/search/single|/comment/list|aweme_general_search|aweme_video_web|aweme_user_web|/webcast/`;
const DEFAULT_ENTITY_USERISH = String.raw`search_channel=aweme_user|aweme_user_web|\btype=user\b|/user/search|search/user|channel=aweme_user`;
const DEFAULT_ENTITY_RELATION = String.raw`follower/list|following/list|/user/follower|/user/following`;
const DEFAULT_ENTITY_LIVE = String.raw`/webcast/(im/fetch|room/reflow/info|chat)`;
const DEFAULT_ENTITY_USER_SEARCH = String.raw`/aweme/v1/web/discover/search|search_channel=aweme_user|aweme_user_web`;
const DEFAULT_SCRAPE_INTERESTING = String.raw`/aweme/v1/web/(?:general/search|discover/search|search/item|search/single|search/|aweme/detail|detail/|aweme/favorite|aweme/post|aweme/listcollection|tab/feed|module/feed|recommend/item|nearby/feed)|/web/api/v2/aweme/like|/search/item|/search/single|aweme_general_search|aweme_video_web`;
function sanitizeRegexSource(_0x522b59) {
  const _0x53a7fc = typeof _0x522b59 === "string" ? _0x522b59.trim() : "";
  if (!_0x53a7fc || _0x53a7fc.length < 3 || _0x53a7fc.length > 4000) {
    return "";
  }
  try {
    new RegExp(_0x53a7fc, "i");
    return _0x53a7fc;
  } catch (_0x1a5974) {
    return "";
  }
}
function pickHook(_0x120877, _0x20b27a, _0x513ca6) {
  return sanitizeRegexSource(_0x120877?.[_0x20b27a]) || _0x513ca6;
}
function resolveEntityApiHooks(_0x41a6ac) {
  return {
    interesting: pickHook(_0x41a6ac, "interesting", DEFAULT_ENTITY_INTERESTING),
    userish: pickHook(_0x41a6ac, "userish", DEFAULT_ENTITY_USERISH),
    relation: pickHook(_0x41a6ac, "relation", DEFAULT_ENTITY_RELATION),
    live: pickHook(_0x41a6ac, "live", DEFAULT_ENTITY_LIVE),
    userSearch: pickHook(_0x41a6ac, "userSearch", DEFAULT_ENTITY_USER_SEARCH)
  };
}
function resolveScrapeApiHooks(_0xe989e2) {
  return {
    scrapeInteresting: pickHook(_0xe989e2, "scrapeInteresting", DEFAULT_SCRAPE_INTERESTING)
  };
}
function toJsRegexLiteral(_0x17dbfd, _0x689914 = "i") {
  const _0xf69441 = String(_0x17dbfd).replace(/\\/g, "\\\\").replace(/\//g, "\\/");
  return "/" + _0xf69441 + "/" + _0x689914;
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
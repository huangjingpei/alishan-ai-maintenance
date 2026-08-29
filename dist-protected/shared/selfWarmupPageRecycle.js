'use strict';

function parseDouyinUrl(arg1) {
  try {
    const url = new URL(String(arg1 || ""));
    if (!/(^|\.)douyin\.com$/i.test(url.hostname)) {
      return null;
    }
    return url;
  } catch (error) {
    return null;
  }
}
function isDouyinChatPageUrl(arg1) {
  const result = parseDouyinUrl(arg1);
  return !!result && result.pathname === "/chat";
}
function isWarmupIdleJingxuanUrl(arg1) {
  const result = parseDouyinUrl(arg1);
  if (!result) {
    return false;
  }
  const local = result.pathname || "";
  if (local !== "/" && local !== "/jingxuan") {
    return false;
  }
  return !result.searchParams.get("modal_id");
}
function shouldWarmupIdleOnChat(options = {}) {
  return options.watchMessages !== false;
}
function isWarmupHeavyPageUrl(arg1) {
  if (isDouyinChatPageUrl(arg1)) {
    return false;
  }
  const result = parseDouyinUrl(arg1);
  if (!result) {
    return true;
  }
  const local = result.pathname || "";
  if (local === "/" || local === "/jingxuan") {
    return true;
  }
  if (/^\/(video|note|user|search|discover|aweme)\//i.test(local)) {
    return true;
  }
  if (result.searchParams.get("modal_id")) {
    return true;
  }
  return local !== "/chat";
}
module.exports = {
  isDouyinChatPageUrl: isDouyinChatPageUrl,
  isWarmupHeavyPageUrl: isWarmupHeavyPageUrl,
  isWarmupIdleJingxuanUrl: isWarmupIdleJingxuanUrl,
  shouldWarmupIdleOnChat: shouldWarmupIdleOnChat
};
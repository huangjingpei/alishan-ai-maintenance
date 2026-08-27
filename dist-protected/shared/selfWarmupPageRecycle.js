'use strict';

function parseDouyinUrl(_0x2d6567) {
  try {
    const _0xad3b6f = new URL(String(_0x2d6567 || ""));
    if (!/(^|\.)douyin\.com$/i.test(_0xad3b6f.hostname)) {
      return null;
    }
    return _0xad3b6f;
  } catch (_0x47f9c5) {
    return null;
  }
}
function isDouyinChatPageUrl(_0x321338) {
  const _0x5a55fd = parseDouyinUrl(_0x321338);
  return !!_0x5a55fd && _0x5a55fd.pathname === "/chat";
}
function isWarmupIdleJingxuanUrl(_0x2b44b9) {
  const _0x1755d0 = parseDouyinUrl(_0x2b44b9);
  if (!_0x1755d0) {
    return false;
  }
  const _0x102db2 = _0x1755d0.pathname || "";
  if (_0x102db2 !== "/" && _0x102db2 !== "/jingxuan") {
    return false;
  }
  return !_0x1755d0.searchParams.get("modal_id");
}
function shouldWarmupIdleOnChat(_0x2b42ce = {}) {
  return _0x2b42ce.watchMessages !== false;
}
function isWarmupHeavyPageUrl(_0x2c796f) {
  if (isDouyinChatPageUrl(_0x2c796f)) {
    return false;
  }
  const _0x318f5f = parseDouyinUrl(_0x2c796f);
  if (!_0x318f5f) {
    return true;
  }
  const _0x3bfc02 = _0x318f5f.pathname || "";
  if (_0x3bfc02 === "/" || _0x3bfc02 === "/jingxuan") {
    return true;
  }
  if (/^\/(video|note|user|search|discover|aweme)\//i.test(_0x3bfc02)) {
    return true;
  }
  if (_0x318f5f.searchParams.get("modal_id")) {
    return true;
  }
  return _0x3bfc02 !== "/chat";
}
module.exports = {
  isDouyinChatPageUrl: isDouyinChatPageUrl,
  isWarmupHeavyPageUrl: isWarmupHeavyPageUrl,
  isWarmupIdleJingxuanUrl: isWarmupIdleJingxuanUrl,
  shouldWarmupIdleOnChat: shouldWarmupIdleOnChat
};
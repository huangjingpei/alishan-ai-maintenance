'use strict';

const FRAME_HEADER_BLOCKLIST = new Set(["x-frame-options", "content-security-policy", "x-content-security-policy"]);
const DOCUMENT_RESOURCE_TYPES = new Set(["mainFrame", "subFrame"]);
function headerValue(_0x4d24f6, _0x1f2815) {
  const _0x3bf6c0 = _0x4d24f6 || {};
  const _0x273a67 = String(_0x1f2815 || "").toLowerCase();
  for (const _0x2bfa24 of Object.keys(_0x3bf6c0)) {
    if (_0x2bfa24.toLowerCase() !== _0x273a67) {
      continue;
    }
    const _0xe8e421 = _0x3bf6c0[_0x2bfa24];
    if (Array.isArray(_0xe8e421)) {
      return _0xe8e421.join(" ");
    } else {
      return String(_0xe8e421 || "");
    }
  }
  return "";
}
function looksLikeNonHtmlDocument(_0x2f6fd8) {
  const _0x2fe7a1 = headerValue(_0x2f6fd8, "content-type");
  if (!_0x2fe7a1) {
    return false;
  }
  if (/javascript|ecmascript|\bjson\b|octet-stream|wasm/i.test(_0x2fe7a1)) {
    return true;
  }
  if (/text\/css|image\/|font\/|audio\/|video\//i.test(_0x2fe7a1)) {
    return true;
  }
  return false;
}
function stripFrameBlockingHeaders(_0x29b496 = {}) {
  const _0x18b64b = _0x29b496.responseHeaders || {};
  const _0x2ee7a2 = String(_0x29b496.resourceType || "");
  if (!DOCUMENT_RESOURCE_TYPES.has(_0x2ee7a2) || looksLikeNonHtmlDocument(_0x18b64b)) {
    return {
      cancel: false,
      responseHeaders: _0x18b64b
    };
  }
  const _0x1d1da2 = {
    ..._0x18b64b
  };
  for (const _0x2c8299 of Object.keys(_0x1d1da2)) {
    if (FRAME_HEADER_BLOCKLIST.has(_0x2c8299.toLowerCase())) {
      delete _0x1d1da2[_0x2c8299];
    }
  }
  return {
    cancel: false,
    responseHeaders: _0x1d1da2
  };
}
function handleStripFrameBlockingHeaders(_0x20bd35, _0x55ed3f) {
  _0x55ed3f(stripFrameBlockingHeaders(_0x20bd35));
}
module.exports = {
  stripFrameBlockingHeaders: stripFrameBlockingHeaders,
  handleStripFrameBlockingHeaders: handleStripFrameBlockingHeaders
};
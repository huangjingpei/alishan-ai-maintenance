'use strict';

const FRAME_HEADER_BLOCKLIST = new Set(["x-frame-options", "content-security-policy", "x-content-security-policy"]);
const DOCUMENT_RESOURCE_TYPES = new Set(["mainFrame", "subFrame"]);
function headerValue(arg1, arg2) {
  const local = arg1 || {};
  const result = String(arg2 || "").toLowerCase();
  for (const item of Object.keys(local)) {
    if (item.toLowerCase() !== result) {
      continue;
    }
    const value = local[item];
    if (Array.isArray(value)) {
      return value.join(" ");
    } else {
      return String(value || "");
    }
  }
  return "";
}
function looksLikeNonHtmlDocument(arg1) {
  const result = headerValue(arg1, "content-type");
  if (!result) {
    return false;
  }
  if (/javascript|ecmascript|\bjson\b|octet-stream|wasm/i.test(result)) {
    return true;
  }
  if (/text\/css|image\/|font\/|audio\/|video\//i.test(result)) {
    return true;
  }
  return false;
}
function stripFrameBlockingHeaders(options = {}) {
  const local = options.responseHeaders || {};
  const result = String(options.resourceType || "");
  if (!DOCUMENT_RESOURCE_TYPES.has(result) || looksLikeNonHtmlDocument(local)) {
    return {
      cancel: false,
      responseHeaders: local
    };
  }
  const obj = {
    ...local
  };
  for (const item of Object.keys(obj)) {
    if (FRAME_HEADER_BLOCKLIST.has(item.toLowerCase())) {
      delete obj[item];
    }
  }
  return {
    cancel: false,
    responseHeaders: obj
  };
}
function handleStripFrameBlockingHeaders(arg1, arg2) {
  arg2(stripFrameBlockingHeaders(arg1));
}
module.exports = {
  stripFrameBlockingHeaders: stripFrameBlockingHeaders,
  handleStripFrameBlockingHeaders: handleStripFrameBlockingHeaders
};
'use strict';

const DEFAULT_DOUYIN_URLS = Object.freeze({
  douyinRecommend: "https://www.douyin.com/?recommend=1&from_nav=1",
  douyinFollow: "https://www.douyin.com/follow",
  douyinLikeEntry: "https://www.douyin.com/user/self?from_tab_name=main&showTab=like",
  douyinSearch: "https://www.douyin.com/search",
  douyinSearchWithKeyword: "https://www.douyin.com/search/{keyword}",
  douyinJingxuanModal: "https://www.douyin.com/jingxuan?modal_id={id}",
  douyinVideo: "https://www.douyin.com/video/{id}"
});
function pickUrl(_0x15ebb0, _0x48ddac) {
  const _0x3d1d32 = _0x15ebb0 && typeof _0x15ebb0 === "object" ? _0x15ebb0[_0x48ddac] : "";
  if (typeof _0x3d1d32 === "string" && _0x3d1d32.trim()) {
    return _0x3d1d32.trim();
  } else {
    return "";
  }
}
function getDouyinRecommendUrl(_0x1562da) {
  return pickUrl(_0x1562da, "douyinRecommend") || DEFAULT_DOUYIN_URLS.douyinRecommend;
}
function getDouyinFollowUrl(_0x59089e) {
  return pickUrl(_0x59089e, "douyinFollow") || DEFAULT_DOUYIN_URLS.douyinFollow;
}
function getDouyinLikeEntryUrl(_0x4ce158) {
  return pickUrl(_0x4ce158, "douyinLikeEntry") || DEFAULT_DOUYIN_URLS.douyinLikeEntry;
}
function getDouyinSearchBaseUrl(_0x3cda6c) {
  return pickUrl(_0x3cda6c, "douyinSearch") || DEFAULT_DOUYIN_URLS.douyinSearch;
}
function buildDouyinSearchUrl(_0x388d5d, _0x119eee) {
  const _0xb99d38 = String(_0x388d5d || "").trim();
  const _0x10d54b = getDouyinSearchBaseUrl(_0x119eee).replace(/\/$/, "");
  if (!_0xb99d38) {
    return _0x10d54b || DEFAULT_DOUYIN_URLS.douyinSearch;
  }
  const _0x1979f4 = pickUrl(_0x119eee, "douyinSearchWithKeyword") || DEFAULT_DOUYIN_URLS.douyinSearchWithKeyword;
  if (_0x1979f4.includes("{keyword}")) {
    return _0x1979f4.replace(/\{keyword\}/g, encodeURIComponent(_0xb99d38));
  }
  return _0x10d54b + "/" + encodeURIComponent(_0xb99d38);
}
function buildDouyinJingxuanModalUrl(_0x39cdf8, _0x525a94) {
  const _0x794cb0 = String(_0x39cdf8 || "").trim();
  if (!_0x794cb0) {
    return "";
  }
  const _0x250fbe = pickUrl(_0x525a94, "douyinJingxuanModal") || DEFAULT_DOUYIN_URLS.douyinJingxuanModal;
  if (_0x250fbe.includes("{id}")) {
    return _0x250fbe.replace(/\{id\}/g, encodeURIComponent(_0x794cb0));
  } else {
    return "" + _0x250fbe + _0x794cb0;
  }
}
function buildDouyinVideoUrl(_0x231a28, _0x1cdcc5) {
  const _0x81615f = String(_0x231a28 || "").trim();
  if (!_0x81615f) {
    return "";
  }
  const _0x7ee0d8 = pickUrl(_0x1cdcc5, "douyinVideo") || DEFAULT_DOUYIN_URLS.douyinVideo;
  if (_0x7ee0d8.includes("{id}")) {
    return _0x7ee0d8.replace(/\{id\}/g, encodeURIComponent(_0x81615f));
  } else {
    return "" + _0x7ee0d8 + _0x81615f;
  }
}
module.exports = {
  DEFAULT_DOUYIN_URLS: DEFAULT_DOUYIN_URLS,
  getDouyinRecommendUrl: getDouyinRecommendUrl,
  getDouyinFollowUrl: getDouyinFollowUrl,
  getDouyinLikeEntryUrl: getDouyinLikeEntryUrl,
  getDouyinSearchBaseUrl: getDouyinSearchBaseUrl,
  buildDouyinSearchUrl: buildDouyinSearchUrl,
  buildDouyinJingxuanModalUrl: buildDouyinJingxuanModalUrl,
  buildDouyinVideoUrl: buildDouyinVideoUrl
};
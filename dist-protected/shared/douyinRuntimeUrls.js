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
function pickUrl(arg1, arg2) {
  const value = arg1 && typeof arg1 === "object" ? arg1[arg2] : "";
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  } else {
    return "";
  }
}
function getDouyinRecommendUrl(arg1) {
  return pickUrl(arg1, "douyinRecommend") || DEFAULT_DOUYIN_URLS.douyinRecommend;
}
function getDouyinFollowUrl(arg1) {
  return pickUrl(arg1, "douyinFollow") || DEFAULT_DOUYIN_URLS.douyinFollow;
}
function getDouyinLikeEntryUrl(arg1) {
  return pickUrl(arg1, "douyinLikeEntry") || DEFAULT_DOUYIN_URLS.douyinLikeEntry;
}
function getDouyinSearchBaseUrl(arg1) {
  return pickUrl(arg1, "douyinSearch") || DEFAULT_DOUYIN_URLS.douyinSearch;
}
function buildDouyinSearchUrl(arg1, arg2) {
  const result = String(arg1 || "").trim();
  const result2 = getDouyinSearchBaseUrl(arg2).replace(/\/$/, "");
  if (!result) {
    return result2 || DEFAULT_DOUYIN_URLS.douyinSearch;
  }
  const local = pickUrl(arg2, "douyinSearchWithKeyword") || DEFAULT_DOUYIN_URLS.douyinSearchWithKeyword;
  if (local.includes("{keyword}")) {
    return local.replace(/\{keyword\}/g, encodeURIComponent(result));
  }
  return result2 + "/" + encodeURIComponent(result);
}
function buildDouyinJingxuanModalUrl(arg1, arg2) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const local = pickUrl(arg2, "douyinJingxuanModal") || DEFAULT_DOUYIN_URLS.douyinJingxuanModal;
  if (local.includes("{id}")) {
    return local.replace(/\{id\}/g, encodeURIComponent(result));
  } else {
    return "" + local + result;
  }
}
function buildDouyinVideoUrl(arg1, arg2) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const local = pickUrl(arg2, "douyinVideo") || DEFAULT_DOUYIN_URLS.douyinVideo;
  if (local.includes("{id}")) {
    return local.replace(/\{id\}/g, encodeURIComponent(result));
  } else {
    return "" + local + result;
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
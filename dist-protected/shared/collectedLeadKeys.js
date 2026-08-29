'use strict';

function extractAwemeId(text = "") {
  const result = String(text || "").trim();
  if (!result) {
    return "";
  }
  const local = result.match(/^video:(\d{10,})$/i)?.[1];
  if (local) {
    return local;
  }
  try {
    const {
      extractDouyinVideoId: extractDouyinVideoId
    } = require("./processedVideoKey");
    const result2 = extractDouyinVideoId(result);
    if (result2) {
      return result2;
    }
  } catch (error) {}
  return result.match(/(?:video|note)\/(\d{10,})/i)?.[1] || (/^\d{10,}$/.test(result) ? result : "");
}
function toCollectedVideoKey(text = "") {
  const result = extractAwemeId(text);
  if (result) {
    return "video:" + result;
  } else {
    return "";
  }
}
function extractAuthorSecUid(text = "") {
  const result = String(text || "").trim();
  if (!result) {
    return "";
  }
  const local = result.match(/^author:(.+)$/i)?.[1];
  if (local) {
    return decodeURIComponent(local).trim();
  }
  const result2 = result.match(/\/user\/([^/?#]+)/i);
  if (result2?.[1]) {
    try {
      return decodeURIComponent(result2[1]).trim();
    } catch (error) {
      return String(result2[1] || "").trim();
    }
  }
  if (/^[A-Za-z][A-Za-z0-9_-]{14,}$/.test(result)) {
    return result;
  }
  return "";
}
function toCollectedAuthorKey(text = "") {
  const result = extractAuthorSecUid(text);
  if (result) {
    return "author:" + result;
  } else {
    return "";
  }
}
function isEntityRelationAuthorSource(arg1, arg2) {
  const result = String(arg1 || "").trim();
  const result2 = String(arg2 || "").trim();
  return result === "following" || result === "mutual" || result2 === "entity_following" || result2 === "entity_mutual";
}
function resolveAuthorSecUidFromLead(options = {}) {
  return extractAuthorSecUid(options.authorProfileUrl || "") || extractAuthorSecUid(options.userUrl || "") || extractAuthorSecUid(options.profileUrl || "") || extractAuthorSecUid(options.leadId || options.key || "") || extractAuthorSecUid(options.userKey || "") || extractAuthorSecUid(options.secUid || options.sec_uid || "");
}
function normalizeAuthorProfileUrl(text = "") {
  const result = extractAuthorSecUid(text);
  if (!result) {
    return "";
  }
  return "https://www.douyin.com/user/" + result;
}
function resolveCollectedFieldSet(options = {}) {
  const result = Array.isArray(options.collectedFields);
  const value = result ? options.collectedFields.map(String).filter(Boolean) : [];
  if (options.leadKind === "collected_author" || options.identityType === "author" || isEntityRelationAuthorSource(options.sourceType, options.entrySource)) {
    if (!value.length) {
      return new Set(["author"]);
    }
    return new Set(value);
  }
  if (!result || value.length === 0) {
    return new Set(["video"]);
  }
  return new Set(value);
}
function wantsCollectedVideo(options = {}) {
  return resolveCollectedFieldSet(options).has("video");
}
function wantsCollectedAuthor(options = {}) {
  return resolveCollectedFieldSet(options).has("author");
}
function resolveCapturedAtMs(options = {}, arg2 = Date.now()) {
  const result = Number(options.timestamp || options.ts || options.captured_at);
  if (Number.isFinite(result) && result > 0) {
    return result;
  }
  const result2 = Date.parse(options.capturedAt || "");
  if (Number.isFinite(result2) && result2 > 0) {
    return result2;
  } else {
    return arg2;
  }
}
function splitVideoCardIntoCollectedRecords(options = {}) {
  const value = options && typeof options === "object" ? options : {};
  const result = resolveCollectedFieldSet(value);
  const result2 = Date.now();
  const result3 = resolveCapturedAtMs(value, result2);
  let local = null;
  let local2 = null;
  const result4 = extractAwemeId(value.leadId || value.userKey || value.key || value.id || value.videoUrl || value.url || value.content || value.video_id || "");
  if (result.has("video") && result4) {
    const value2 = "https://www.douyin.com/video/" + result4;
    const value3 = "video:" + result4;
    const local2 = String(value.title || value.videoTitle || value.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
    local = {
      id: value3,
      videoId: result4,
      videoUrl: value2,
      title: local2,
      authorNickname: String(value.authorNickname || value.nickname || "").trim(),
      authorProfileUrl: String(value.authorProfileUrl || "").trim() || (/(?:\/user\/)/i.test(String(value.userUrl || "")) ? String(value.userUrl).trim() : ""),
      accountId: String(value.accountId || "").trim(),
      accountName: String(value.accountName || "").trim(),
      entrySource: String(value.entrySource || "entity_video").trim(),
      entryLabel: String(value.entryLabel || "线索采集：视频作品链接").trim(),
      searchKeyword: String(value.searchKeyword || "").trim(),
      capturedAt: result3,
      platform: value.platform || "DY",
      raw: {
        ...value,
        leadKind: "collected_video",
        leadId: value3,
        key: value3,
        videoUrl: value2,
        url: value2
      }
    };
  }
  const value2 = result.has("author") ? resolveAuthorSecUidFromLead(value) : "";
  if (result.has("author") && value2) {
    const result = normalizeAuthorProfileUrl(value2);
    const value3 = "author:" + value2;
    local2 = {
      id: value3,
      secUid: value2,
      profileUrl: result,
      nickname: String(value.authorNickname || value.nickname || "").trim() || "未知作者",
      sourceVideoId: result4 || "",
      accountId: String(value.accountId || "").trim(),
      accountName: String(value.accountName || "").trim(),
      entrySource: String(value.entrySource || "entity_video").trim(),
      entryLabel: String(value.entryLabel || "线索采集：作者主页").trim(),
      searchKeyword: String(value.searchKeyword || "").trim(),
      capturedAt: result3,
      platform: value.platform || "DY",
      latestTitle: String(value.title || value.videoTitle || "").trim(),
      latestVideoUrl: result4 ? "https://www.douyin.com/video/" + result4 : "",
      raw: {
        ...value,
        leadKind: "collected_author",
        leadId: value3,
        key: value3,
        userUrl: result,
        authorProfileUrl: result
      }
    };
  }
  return {
    video: local,
    author: local2
  };
}
function videoRowToLibraryItemLight(options = {}) {
  const result = String(options.video_id || options.videoId || "").trim();
  const result2 = String(options.id || (result ? "video:" + result : "")).trim();
  const result3 = String(options.video_url || options.videoUrl || (result ? "https://www.douyin.com/video/" + result : "")).trim();
  const local = Number(options.captured_at || options.capturedAt || Date.now()) || Date.now();
  return {
    platform: "DY",
    leadKind: "video_card",
    leadId: result2,
    key: result2,
    userKey: result2,
    title: String(options.title || "抖音视频作品"),
    nickname: String(options.author_nickname || options.authorNickname || "未知作者"),
    authorNickname: String(options.author_nickname || options.authorNickname || ""),
    content: "",
    timeText: "卡片采集",
    userUrl: String(options.author_profile_url || options.authorProfileUrl || ""),
    authorProfileUrl: String(options.author_profile_url || options.authorProfileUrl || ""),
    url: result3,
    videoUrl: result3,
    identityType: "video",
    profileAvailable: false,
    profileUnavailable: true,
    profileUnavailableReason: "视频作品链接",
    collectedFields: ["video"],
    sourceType: "video",
    entrySource: String(options.entry_source || options.entrySource || "entity_video"),
    entryLabel: "线索采集：视频作品链接",
    searchKeyword: String(options.search_keyword || options.searchKeyword || ""),
    accountId: String(options.account_id || options.accountId || ""),
    accountName: String(options.account_name || options.accountName || ""),
    timestamp: local,
    capturedAt: new Date(local).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function videoRowToLibraryItem(options = {}) {
  const result = videoRowToLibraryItemLight(options);
  let obj = {};
  try {
    obj = typeof options.raw_data === "string" ? JSON.parse(options.raw_data || "{}") : options.raw || {};
  } catch (error) {
    obj = {};
  }
  if (!obj || typeof obj !== "object") {
    return result;
  }
  const local = Number(options.captured_at || options.capturedAt || obj.timestamp || result.timestamp) || result.timestamp;
  return {
    ...obj,
    ...result,
    title: String(options.title || obj.title || result.title),
    nickname: String(options.author_nickname || options.authorNickname || obj.nickname || obj.authorNickname || result.nickname),
    authorNickname: String(options.author_nickname || options.authorNickname || obj.authorNickname || result.authorNickname),
    content: String(obj.content || ""),
    timeText: obj.timeText || result.timeText,
    entrySource: String(options.entry_source || options.entrySource || obj.entrySource || result.entrySource),
    entryLabel: String(obj.entryLabel || result.entryLabel),
    searchKeyword: String(options.search_keyword || options.searchKeyword || obj.searchKeyword || ""),
    accountId: String(options.account_id || options.accountId || obj.accountId || ""),
    accountName: String(options.account_name || options.accountName || obj.accountName || ""),
    timestamp: local,
    capturedAt: obj.capturedAt || new Date(local).toISOString()
  };
}
function authorRowToLibraryItemLight(options = {}) {
  const result = String(options.sec_uid || options.secUid || "").trim();
  const result2 = String(options.id || (result ? "author:" + result : "")).trim();
  const result3 = String(options.profile_url || options.profileUrl || (result ? "https://www.douyin.com/user/" + result : "")).trim();
  const local = Number(options.captured_at || options.capturedAt || Date.now()) || Date.now();
  const result4 = String(options.source_video_id || options.sourceVideoId || "").trim();
  const value = result4 ? "https://www.douyin.com/video/" + result4 : "";
  const result5 = String(options.latest_title || options.latestTitle || "");
  return {
    platform: "DY",
    leadKind: "collected_author",
    leadId: result2,
    key: result2,
    userKey: result2,
    title: result5,
    latestTitle: result5,
    nickname: String(options.nickname || "未知作者"),
    authorNickname: String(options.nickname || ""),
    content: "",
    userUrl: result3,
    authorProfileUrl: result3,
    profileUrl: result3,
    url: value,
    videoUrl: value,
    latestVideoUrl: value,
    identityType: "author",
    collectedFields: ["author"],
    sourceType: "author",
    entrySource: String(options.entry_source || options.entrySource || "entity_video"),
    entryLabel: "线索采集：作者主页",
    searchKeyword: String(options.search_keyword || options.searchKeyword || ""),
    accountId: String(options.account_id || options.accountId || ""),
    accountName: String(options.account_name || options.accountName || ""),
    videoCount: Number(options.video_count || options.videoCount) || 0,
    timestamp: local,
    capturedAt: new Date(local).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function authorRowToLibraryItem(options = {}) {
  const result = authorRowToLibraryItemLight(options);
  let obj = {};
  try {
    obj = typeof options.raw_data === "string" ? JSON.parse(options.raw_data || "{}") : options.raw || {};
  } catch (error) {
    obj = {};
  }
  if (!obj || typeof obj !== "object") {
    return result;
  }
  const local = Number(options.captured_at || options.capturedAt || obj.timestamp || result.timestamp) || result.timestamp;
  const result2 = String(options.source_video_id || options.sourceVideoId || "").trim();
  const result3 = String(obj.latestVideoUrl || result.latestVideoUrl || (result2 ? "https://www.douyin.com/video/" + result2 : "")).trim();
  return {
    ...obj,
    ...result,
    title: String(obj.latestTitle || obj.title || result.title || ""),
    latestTitle: String(obj.latestTitle || result.latestTitle || ""),
    nickname: String(options.nickname || obj.nickname || obj.authorNickname || result.nickname),
    authorNickname: String(options.nickname || obj.authorNickname || result.authorNickname),
    url: result3,
    videoUrl: result3,
    latestVideoUrl: result3,
    entrySource: String(options.entry_source || options.entrySource || obj.entrySource || result.entrySource),
    entryLabel: String(obj.entryLabel || result.entryLabel),
    searchKeyword: String(options.search_keyword || options.searchKeyword || obj.searchKeyword || ""),
    accountId: String(options.account_id || options.accountId || obj.accountId || ""),
    accountName: String(options.account_name || options.accountName || obj.accountName || ""),
    timestamp: local,
    capturedAt: obj.capturedAt || new Date(local).toISOString()
  };
}
module.exports = {
  extractAwemeId: extractAwemeId,
  toCollectedVideoKey: toCollectedVideoKey,
  extractAuthorSecUid: extractAuthorSecUid,
  toCollectedAuthorKey: toCollectedAuthorKey,
  isEntityRelationAuthorSource: isEntityRelationAuthorSource,
  resolveAuthorSecUidFromLead: resolveAuthorSecUidFromLead,
  normalizeAuthorProfileUrl: normalizeAuthorProfileUrl,
  resolveCollectedFieldSet: resolveCollectedFieldSet,
  wantsCollectedVideo: wantsCollectedVideo,
  wantsCollectedAuthor: wantsCollectedAuthor,
  resolveCapturedAtMs: resolveCapturedAtMs,
  splitVideoCardIntoCollectedRecords: splitVideoCardIntoCollectedRecords,
  videoRowToLibraryItemLight: videoRowToLibraryItemLight,
  videoRowToLibraryItem: videoRowToLibraryItem,
  authorRowToLibraryItemLight: authorRowToLibraryItemLight,
  authorRowToLibraryItem: authorRowToLibraryItem
};
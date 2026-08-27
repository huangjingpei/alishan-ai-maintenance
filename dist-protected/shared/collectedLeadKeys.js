'use strict';

function extractAwemeId(_0x28d20a = "") {
  const _0x250724 = String(_0x28d20a || "").trim();
  if (!_0x250724) {
    return "";
  }
  const _0x2780e3 = _0x250724.match(/^video:(\d{10,})$/i)?.[1];
  if (_0x2780e3) {
    return _0x2780e3;
  }
  try {
    const {
      extractDouyinVideoId: _0x1c85c4
    } = require("./processedVideoKey");
    const _0x1c1419 = _0x1c85c4(_0x250724);
    if (_0x1c1419) {
      return _0x1c1419;
    }
  } catch (_0x3e8965) {}
  return _0x250724.match(/(?:video|note)\/(\d{10,})/i)?.[1] || (/^\d{10,}$/.test(_0x250724) ? _0x250724 : "");
}
function toCollectedVideoKey(_0x2d74e2 = "") {
  const _0x21e9a4 = extractAwemeId(_0x2d74e2);
  if (_0x21e9a4) {
    return "video:" + _0x21e9a4;
  } else {
    return "";
  }
}
function extractAuthorSecUid(_0x2e3d3b = "") {
  const _0x4fbf9f = String(_0x2e3d3b || "").trim();
  if (!_0x4fbf9f) {
    return "";
  }
  const _0x51a2d0 = _0x4fbf9f.match(/^author:(.+)$/i)?.[1];
  if (_0x51a2d0) {
    return decodeURIComponent(_0x51a2d0).trim();
  }
  const _0x3eb8fe = _0x4fbf9f.match(/\/user\/([^/?#]+)/i);
  if (_0x3eb8fe?.[1]) {
    try {
      return decodeURIComponent(_0x3eb8fe[1]).trim();
    } catch (_0x49c47c) {
      return String(_0x3eb8fe[1] || "").trim();
    }
  }
  if (/^[A-Za-z][A-Za-z0-9_-]{14,}$/.test(_0x4fbf9f)) {
    return _0x4fbf9f;
  }
  return "";
}
function toCollectedAuthorKey(_0x8890bd = "") {
  const _0x13cbfb = extractAuthorSecUid(_0x8890bd);
  if (_0x13cbfb) {
    return "author:" + _0x13cbfb;
  } else {
    return "";
  }
}
function isEntityRelationAuthorSource(_0x28fbd6, _0x3a1e6b) {
  const _0x522f99 = String(_0x28fbd6 || "").trim();
  const _0x309c02 = String(_0x3a1e6b || "").trim();
  return _0x522f99 === "following" || _0x522f99 === "mutual" || _0x309c02 === "entity_following" || _0x309c02 === "entity_mutual";
}
function resolveAuthorSecUidFromLead(_0x99c9c8 = {}) {
  return extractAuthorSecUid(_0x99c9c8.authorProfileUrl || "") || extractAuthorSecUid(_0x99c9c8.userUrl || "") || extractAuthorSecUid(_0x99c9c8.profileUrl || "") || extractAuthorSecUid(_0x99c9c8.leadId || _0x99c9c8.key || "") || extractAuthorSecUid(_0x99c9c8.userKey || "") || extractAuthorSecUid(_0x99c9c8.secUid || _0x99c9c8.sec_uid || "");
}
function normalizeAuthorProfileUrl(_0x6ca200 = "") {
  const _0xbe99b4 = extractAuthorSecUid(_0x6ca200);
  if (!_0xbe99b4) {
    return "";
  }
  return "https://www.douyin.com/user/" + _0xbe99b4;
}
function resolveCollectedFieldSet(_0x53cd4f = {}) {
  const _0x398886 = Array.isArray(_0x53cd4f.collectedFields);
  const _0x4e8501 = _0x398886 ? _0x53cd4f.collectedFields.map(String).filter(Boolean) : [];
  if (_0x53cd4f.leadKind === "collected_author" || _0x53cd4f.identityType === "author" || isEntityRelationAuthorSource(_0x53cd4f.sourceType, _0x53cd4f.entrySource)) {
    if (!_0x4e8501.length) {
      return new Set(["author"]);
    }
    return new Set(_0x4e8501);
  }
  if (!_0x398886 || _0x4e8501.length === 0) {
    return new Set(["video"]);
  }
  return new Set(_0x4e8501);
}
function wantsCollectedVideo(_0x49bdd0 = {}) {
  return resolveCollectedFieldSet(_0x49bdd0).has("video");
}
function wantsCollectedAuthor(_0x40dfae = {}) {
  return resolveCollectedFieldSet(_0x40dfae).has("author");
}
function resolveCapturedAtMs(_0x5dd36e = {}, _0x309cc7 = Date.now()) {
  const _0x4d4f36 = Number(_0x5dd36e.timestamp || _0x5dd36e.ts || _0x5dd36e.captured_at);
  if (Number.isFinite(_0x4d4f36) && _0x4d4f36 > 0) {
    return _0x4d4f36;
  }
  const _0x208a12 = Date.parse(_0x5dd36e.capturedAt || "");
  if (Number.isFinite(_0x208a12) && _0x208a12 > 0) {
    return _0x208a12;
  } else {
    return _0x309cc7;
  }
}
function splitVideoCardIntoCollectedRecords(_0x5aaf8b = {}) {
  const _0x1da015 = _0x5aaf8b && typeof _0x5aaf8b === "object" ? _0x5aaf8b : {};
  const _0x160eb6 = resolveCollectedFieldSet(_0x1da015);
  const _0x2cbf92 = Date.now();
  const _0x1d089e = resolveCapturedAtMs(_0x1da015, _0x2cbf92);
  let _0x6ea63a = null;
  let _0x4831a7 = null;
  const _0x509b8b = extractAwemeId(_0x1da015.leadId || _0x1da015.userKey || _0x1da015.key || _0x1da015.id || _0x1da015.videoUrl || _0x1da015.url || _0x1da015.content || _0x1da015.video_id || "");
  if (_0x160eb6.has("video") && _0x509b8b) {
    const _0x1c8fca = "https://www.douyin.com/video/" + _0x509b8b;
    const _0x34e418 = "video:" + _0x509b8b;
    const _0x1984df = String(_0x1da015.title || _0x1da015.videoTitle || _0x1da015.nickname || "").replace(/\s+/g, " ").trim() || "抖音视频作品";
    _0x6ea63a = {
      id: _0x34e418,
      videoId: _0x509b8b,
      videoUrl: _0x1c8fca,
      title: _0x1984df,
      authorNickname: String(_0x1da015.authorNickname || _0x1da015.nickname || "").trim(),
      authorProfileUrl: String(_0x1da015.authorProfileUrl || "").trim() || (/(?:\/user\/)/i.test(String(_0x1da015.userUrl || "")) ? String(_0x1da015.userUrl).trim() : ""),
      accountId: String(_0x1da015.accountId || "").trim(),
      accountName: String(_0x1da015.accountName || "").trim(),
      entrySource: String(_0x1da015.entrySource || "entity_video").trim(),
      entryLabel: String(_0x1da015.entryLabel || "线索采集：视频作品链接").trim(),
      searchKeyword: String(_0x1da015.searchKeyword || "").trim(),
      capturedAt: _0x1d089e,
      platform: _0x1da015.platform || "DY",
      raw: {
        ..._0x1da015,
        leadKind: "collected_video",
        leadId: _0x34e418,
        key: _0x34e418,
        videoUrl: _0x1c8fca,
        url: _0x1c8fca
      }
    };
  }
  const _0x3f1de1 = _0x160eb6.has("author") ? resolveAuthorSecUidFromLead(_0x1da015) : "";
  if (_0x160eb6.has("author") && _0x3f1de1) {
    const _0x21ab86 = normalizeAuthorProfileUrl(_0x3f1de1);
    const _0x40a1c2 = "author:" + _0x3f1de1;
    _0x4831a7 = {
      id: _0x40a1c2,
      secUid: _0x3f1de1,
      profileUrl: _0x21ab86,
      nickname: String(_0x1da015.authorNickname || _0x1da015.nickname || "").trim() || "未知作者",
      sourceVideoId: _0x509b8b || "",
      accountId: String(_0x1da015.accountId || "").trim(),
      accountName: String(_0x1da015.accountName || "").trim(),
      entrySource: String(_0x1da015.entrySource || "entity_video").trim(),
      entryLabel: String(_0x1da015.entryLabel || "线索采集：作者主页").trim(),
      searchKeyword: String(_0x1da015.searchKeyword || "").trim(),
      capturedAt: _0x1d089e,
      platform: _0x1da015.platform || "DY",
      latestTitle: String(_0x1da015.title || _0x1da015.videoTitle || "").trim(),
      latestVideoUrl: _0x509b8b ? "https://www.douyin.com/video/" + _0x509b8b : "",
      raw: {
        ..._0x1da015,
        leadKind: "collected_author",
        leadId: _0x40a1c2,
        key: _0x40a1c2,
        userUrl: _0x21ab86,
        authorProfileUrl: _0x21ab86
      }
    };
  }
  return {
    video: _0x6ea63a,
    author: _0x4831a7
  };
}
function videoRowToLibraryItemLight(_0x349685 = {}) {
  const _0x244fb4 = String(_0x349685.video_id || _0x349685.videoId || "").trim();
  const _0x27e6a7 = String(_0x349685.id || (_0x244fb4 ? "video:" + _0x244fb4 : "")).trim();
  const _0x5149cc = String(_0x349685.video_url || _0x349685.videoUrl || (_0x244fb4 ? "https://www.douyin.com/video/" + _0x244fb4 : "")).trim();
  const _0x2cb11a = Number(_0x349685.captured_at || _0x349685.capturedAt || Date.now()) || Date.now();
  return {
    platform: "DY",
    leadKind: "video_card",
    leadId: _0x27e6a7,
    key: _0x27e6a7,
    userKey: _0x27e6a7,
    title: String(_0x349685.title || "抖音视频作品"),
    nickname: String(_0x349685.author_nickname || _0x349685.authorNickname || "未知作者"),
    authorNickname: String(_0x349685.author_nickname || _0x349685.authorNickname || ""),
    content: "",
    timeText: "卡片采集",
    userUrl: String(_0x349685.author_profile_url || _0x349685.authorProfileUrl || ""),
    authorProfileUrl: String(_0x349685.author_profile_url || _0x349685.authorProfileUrl || ""),
    url: _0x5149cc,
    videoUrl: _0x5149cc,
    identityType: "video",
    profileAvailable: false,
    profileUnavailable: true,
    profileUnavailableReason: "视频作品链接",
    collectedFields: ["video"],
    sourceType: "video",
    entrySource: String(_0x349685.entry_source || _0x349685.entrySource || "entity_video"),
    entryLabel: "线索采集：视频作品链接",
    searchKeyword: String(_0x349685.search_keyword || _0x349685.searchKeyword || ""),
    accountId: String(_0x349685.account_id || _0x349685.accountId || ""),
    accountName: String(_0x349685.account_name || _0x349685.accountName || ""),
    timestamp: _0x2cb11a,
    capturedAt: new Date(_0x2cb11a).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function videoRowToLibraryItem(_0x2cad86 = {}) {
  const _0x108561 = videoRowToLibraryItemLight(_0x2cad86);
  let _0x1011cd = {};
  try {
    _0x1011cd = typeof _0x2cad86.raw_data === "string" ? JSON.parse(_0x2cad86.raw_data || "{}") : _0x2cad86.raw || {};
  } catch (_0x2004cf) {
    _0x1011cd = {};
  }
  if (!_0x1011cd || typeof _0x1011cd !== "object") {
    return _0x108561;
  }
  const _0x4589b5 = Number(_0x2cad86.captured_at || _0x2cad86.capturedAt || _0x1011cd.timestamp || _0x108561.timestamp) || _0x108561.timestamp;
  return {
    ..._0x1011cd,
    ..._0x108561,
    title: String(_0x2cad86.title || _0x1011cd.title || _0x108561.title),
    nickname: String(_0x2cad86.author_nickname || _0x2cad86.authorNickname || _0x1011cd.nickname || _0x1011cd.authorNickname || _0x108561.nickname),
    authorNickname: String(_0x2cad86.author_nickname || _0x2cad86.authorNickname || _0x1011cd.authorNickname || _0x108561.authorNickname),
    content: String(_0x1011cd.content || ""),
    timeText: _0x1011cd.timeText || _0x108561.timeText,
    entrySource: String(_0x2cad86.entry_source || _0x2cad86.entrySource || _0x1011cd.entrySource || _0x108561.entrySource),
    entryLabel: String(_0x1011cd.entryLabel || _0x108561.entryLabel),
    searchKeyword: String(_0x2cad86.search_keyword || _0x2cad86.searchKeyword || _0x1011cd.searchKeyword || ""),
    accountId: String(_0x2cad86.account_id || _0x2cad86.accountId || _0x1011cd.accountId || ""),
    accountName: String(_0x2cad86.account_name || _0x2cad86.accountName || _0x1011cd.accountName || ""),
    timestamp: _0x4589b5,
    capturedAt: _0x1011cd.capturedAt || new Date(_0x4589b5).toISOString()
  };
}
function authorRowToLibraryItemLight(_0x2eab2a = {}) {
  const _0x1eaa84 = String(_0x2eab2a.sec_uid || _0x2eab2a.secUid || "").trim();
  const _0x23af98 = String(_0x2eab2a.id || (_0x1eaa84 ? "author:" + _0x1eaa84 : "")).trim();
  const _0x38a6d3 = String(_0x2eab2a.profile_url || _0x2eab2a.profileUrl || (_0x1eaa84 ? "https://www.douyin.com/user/" + _0x1eaa84 : "")).trim();
  const _0x3ef70d = Number(_0x2eab2a.captured_at || _0x2eab2a.capturedAt || Date.now()) || Date.now();
  const _0x27520c = String(_0x2eab2a.source_video_id || _0x2eab2a.sourceVideoId || "").trim();
  const _0x4517b1 = _0x27520c ? "https://www.douyin.com/video/" + _0x27520c : "";
  const _0xbbbfb4 = String(_0x2eab2a.latest_title || _0x2eab2a.latestTitle || "");
  return {
    platform: "DY",
    leadKind: "collected_author",
    leadId: _0x23af98,
    key: _0x23af98,
    userKey: _0x23af98,
    title: _0xbbbfb4,
    latestTitle: _0xbbbfb4,
    nickname: String(_0x2eab2a.nickname || "未知作者"),
    authorNickname: String(_0x2eab2a.nickname || ""),
    content: "",
    userUrl: _0x38a6d3,
    authorProfileUrl: _0x38a6d3,
    profileUrl: _0x38a6d3,
    url: _0x4517b1,
    videoUrl: _0x4517b1,
    latestVideoUrl: _0x4517b1,
    identityType: "author",
    collectedFields: ["author"],
    sourceType: "author",
    entrySource: String(_0x2eab2a.entry_source || _0x2eab2a.entrySource || "entity_video"),
    entryLabel: "线索采集：作者主页",
    searchKeyword: String(_0x2eab2a.search_keyword || _0x2eab2a.searchKeyword || ""),
    accountId: String(_0x2eab2a.account_id || _0x2eab2a.accountId || ""),
    accountName: String(_0x2eab2a.account_name || _0x2eab2a.accountName || ""),
    videoCount: Number(_0x2eab2a.video_count || _0x2eab2a.videoCount) || 0,
    timestamp: _0x3ef70d,
    capturedAt: new Date(_0x3ef70d).toISOString(),
    isHighIntention: false,
    type: "LEAD"
  };
}
function authorRowToLibraryItem(_0x3ff4ab = {}) {
  const _0x757f95 = authorRowToLibraryItemLight(_0x3ff4ab);
  let _0x286359 = {};
  try {
    _0x286359 = typeof _0x3ff4ab.raw_data === "string" ? JSON.parse(_0x3ff4ab.raw_data || "{}") : _0x3ff4ab.raw || {};
  } catch (_0x5e1544) {
    _0x286359 = {};
  }
  if (!_0x286359 || typeof _0x286359 !== "object") {
    return _0x757f95;
  }
  const _0x7389 = Number(_0x3ff4ab.captured_at || _0x3ff4ab.capturedAt || _0x286359.timestamp || _0x757f95.timestamp) || _0x757f95.timestamp;
  const _0x388b74 = String(_0x3ff4ab.source_video_id || _0x3ff4ab.sourceVideoId || "").trim();
  const _0x152ceb = String(_0x286359.latestVideoUrl || _0x757f95.latestVideoUrl || (_0x388b74 ? "https://www.douyin.com/video/" + _0x388b74 : "")).trim();
  return {
    ..._0x286359,
    ..._0x757f95,
    title: String(_0x286359.latestTitle || _0x286359.title || _0x757f95.title || ""),
    latestTitle: String(_0x286359.latestTitle || _0x757f95.latestTitle || ""),
    nickname: String(_0x3ff4ab.nickname || _0x286359.nickname || _0x286359.authorNickname || _0x757f95.nickname),
    authorNickname: String(_0x3ff4ab.nickname || _0x286359.authorNickname || _0x757f95.authorNickname),
    url: _0x152ceb,
    videoUrl: _0x152ceb,
    latestVideoUrl: _0x152ceb,
    entrySource: String(_0x3ff4ab.entry_source || _0x3ff4ab.entrySource || _0x286359.entrySource || _0x757f95.entrySource),
    entryLabel: String(_0x286359.entryLabel || _0x757f95.entryLabel),
    searchKeyword: String(_0x3ff4ab.search_keyword || _0x3ff4ab.searchKeyword || _0x286359.searchKeyword || ""),
    accountId: String(_0x3ff4ab.account_id || _0x3ff4ab.accountId || _0x286359.accountId || ""),
    accountName: String(_0x3ff4ab.account_name || _0x3ff4ab.accountName || _0x286359.accountName || ""),
    timestamp: _0x7389,
    capturedAt: _0x286359.capturedAt || new Date(_0x7389).toISOString()
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
'use strict';

const {
  normalizeAwemeCreateTimeMs
} = require("./entityBloggerProfileSelect");
const {
  parseDouyinRelativePublishTimeMs
} = require("./douyinVideoPublishTime");
function officialSearchPublishTimeToDays(_0x52bf08) {
  const _0x1d77d2 = String(_0x52bf08 || "0").trim();
  if (_0x1d77d2 === "1") {
    return 1;
  }
  if (_0x1d77d2 === "2") {
    return 7;
  }
  if (_0x1d77d2 === "3") {
    return 180;
  }
  return 0;
}
function extractVideoIdFromUser(_0x2ef865 = {}) {
  const _0x140505 = String(_0x2ef865.videoUrl || _0x2ef865.userUrl || _0x2ef865.content || _0x2ef865.userKey || _0x2ef865.leadId || "").trim();
  const _0x49864c = _0x140505.match(/(\d{10,})/);
  if (_0x49864c) {
    return _0x49864c[1];
  }
  const _0x2d1931 = String(_0x2ef865.userKey || _0x2ef865.leadId || "");
  if (_0x2d1931.startsWith("video:")) {
    return _0x2d1931.slice(6);
  } else {
    return "";
  }
}
function enrichVideoPublishTime(_0x75439c = {}, _0x173a50 = Date.now()) {
  const _0x316c93 = String(_0x75439c.publishTimeText || "").trim() || (/卡片采集|实体获客|线索采集/.test(String(_0x75439c.timeText || "")) ? "" : String(_0x75439c.timeText || "").trim());
  const _0x5c0a93 = normalizeAwemeCreateTimeMs(_0x75439c.publishTime ?? _0x75439c.createTime ?? _0x75439c.create_time ?? 0);
  const _0xac5c95 = parseDouyinRelativePublishTimeMs(_0x316c93, _0x173a50);
  const _0x51c15f = _0x5c0a93 || _0xac5c95 || 0;
  return {
    ..._0x75439c,
    createTime: _0x51c15f || _0x75439c.createTime || 0,
    publishTime: _0x51c15f || 0,
    publishTimeText: _0x316c93
  };
}
function buildVideoPublishTimeLogJson(_0x5dd9ff = {}, _0x54d1bf = Date.now()) {
  const _0x273279 = enrichVideoPublishTime(_0x5dd9ff, _0x54d1bf);
  const _0x3e4fa6 = Number(_0x273279.publishTime) || 0;
  return {
    videoId: extractVideoIdFromUser(_0x273279),
    title: String(_0x273279.title || _0x273279.nickname || "").slice(0, 80),
    publishTimeMs: _0x3e4fa6 || 0,
    publishTimeText: String(_0x273279.publishTimeText || ""),
    publishTimeIso: _0x3e4fa6 ? new Date(_0x3e4fa6).toISOString() : "",
    ageHours: _0x3e4fa6 ? Math.round((_0x54d1bf - _0x3e4fa6) / 3600000) : null
  };
}
function isOutsideOfficialSearchPublishBucket(_0x432b85 = {}, _0x2a5fb2 = "0", _0x5d96a0 = Date.now()) {
  const _0x21a93d = String(_0x2a5fb2 || "0").trim();
  if (_0x21a93d === "0") {
    return false;
  }
  const _0x15246a = enrichVideoPublishTime(_0x432b85, _0x5d96a0);
  const _0x59d781 = String(_0x15246a.publishTimeText || "").replace(/\s+/g, "");
  const _0x1e3898 = Number(_0x15246a.publishTime) || 0;
  const _0x566b17 = _0x1e3898 > 0 ? _0x5d96a0 - _0x1e3898 : 0;
  if (/(\d+)\s*年前/.test(_0x59d781)) {
    return true;
  }
  if (_0x21a93d === "1") {
    if (/(\d+)\s*周前|(\d+)\s*个?月前/.test(_0x59d781)) {
      return true;
    }
    const _0x4f1f3f = _0x59d781.match(/(\d{1,3})天前/);
    if (_0x4f1f3f && Number(_0x4f1f3f[1]) >= 2) {
      return true;
    }
    if (/前天/.test(_0x59d781)) {
      return true;
    }
    if (_0x566b17 > 172800000) {
      return true;
    }
    return false;
  }
  if (_0x21a93d === "2") {
    if (/(\d+)\s*个?月前/.test(_0x59d781)) {
      return true;
    }
    const _0x3cf717 = _0x59d781.match(/(\d{1,2})周前/);
    if (_0x3cf717 && Number(_0x3cf717[1]) >= 2) {
      return true;
    }
    const _0x5526eb = _0x59d781.match(/(\d{1,3})天前/);
    if (_0x5526eb && Number(_0x5526eb[1]) >= 8) {
      return true;
    }
    if (_0x566b17 > 691200000) {
      return true;
    }
    return false;
  }
  if (_0x21a93d === "3") {
    const _0x5df236 = _0x59d781.match(/(\d{1,2})个?月前/);
    if (_0x5df236 && Number(_0x5df236[1]) >= 7) {
      return true;
    }
    if (_0x566b17 > 17280000000) {
      return true;
    }
    return false;
  }
  return false;
}
function filterVideosByOfficialSearchPublishTime(_0x4f16cb = [], _0x589ab6 = "0", _0x4fcb21 = Date.now()) {
  const _0x2f37b1 = (Array.isArray(_0x4f16cb) ? _0x4f16cb : []).map(_0xa52aab => enrichVideoPublishTime(_0xa52aab, _0x4fcb21));
  if (String(_0x589ab6 || "0") === "0") {
    return {
      kept: _0x2f37b1,
      dropped: []
    };
  }
  const _0x7ea8ad = [];
  const _0x224c2e = [];
  _0x2f37b1.forEach(_0x725e8f => {
    if (isOutsideOfficialSearchPublishBucket(_0x725e8f, _0x589ab6, _0x4fcb21)) {
      _0x224c2e.push(_0x725e8f);
    } else {
      _0x7ea8ad.push(_0x725e8f);
    }
  });
  return {
    kept: _0x7ea8ad,
    dropped: _0x224c2e
  };
}
module.exports = {
  officialSearchPublishTimeToDays: officialSearchPublishTimeToDays,
  enrichVideoPublishTime: enrichVideoPublishTime,
  buildVideoPublishTimeLogJson: buildVideoPublishTimeLogJson,
  isOutsideOfficialSearchPublishBucket: isOutsideOfficialSearchPublishBucket,
  filterVideosByOfficialSearchPublishTime: filterVideosByOfficialSearchPublishTime
};
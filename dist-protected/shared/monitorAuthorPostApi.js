'use strict';

const AUTHOR_POST_RESPONSE_RE = /\/aweme\/v1\/web\/aweme\/post(?:\/|\?|$)|\/aweme\/v1\/web\/aweme\/post\b/i;
function extractAwemeId(_0x39e69c) {
  if (!_0x39e69c || typeof _0x39e69c !== "object") {
    return "";
  }
  const _0x3575e8 = _0x39e69c.aweme_id || _0x39e69c.awemeId || _0x39e69c.group_id || _0x39e69c.groupId || _0x39e69c.item_id || _0x39e69c.itemId || _0x39e69c.aweme_id_str || _0x39e69c.id_str || _0x39e69c.id;
  const _0x27bd51 = String(_0x3575e8 || "").trim();
  if (/^\d{10,}$/.test(_0x27bd51)) {
    return _0x27bd51;
  } else {
    return "";
  }
}
function isJunkAweme(_0x4c130e) {
  if (!_0x4c130e || typeof _0x4c130e !== "object") {
    return true;
  }
  const _0x28b539 = Number(_0x4c130e.aweme_type ?? _0x4c130e.awemeType ?? _0x4c130e.media_type ?? _0x4c130e.mediaType);
  if (_0x28b539 === 101 || _0x28b539 === 400) {
    return true;
  }
  if (_0x4c130e.live_id || _0x4c130e.liveId || _0x4c130e.room_id || _0x4c130e.roomId || _0x4c130e.is_live || _0x4c130e.isLive) {
    return true;
  }
  return false;
}
function isAuthorPostWorkPinned(_0x4a4588) {
  if (!_0x4a4588 || typeof _0x4a4588 !== "object") {
    return false;
  }
  const _0x5b60da = _0x5aecec => _0x5aecec === true || _0x5aecec === 1 || _0x5aecec === "1" || _0x5aecec === "true";
  if (_0x5b60da(_0x4a4588.is_top) || _0x5b60da(_0x4a4588.isTop) || _0x5b60da(_0x4a4588.is_top_v2) || _0x5b60da(_0x4a4588.isTopV2)) {
    return true;
  }
  const _0x4c9dfe = _0x4a4588.status || _0x4a4588.aweme_status || _0x4a4588.awemeStatus;
  if (_0x4c9dfe && typeof _0x4c9dfe === "object") {
    if (_0x5b60da(_0x4c9dfe.is_top) || _0x5b60da(_0x4c9dfe.isTop) || _0x5b60da(_0x4c9dfe.is_top_v2)) {
      return true;
    }
  }
  const _0x52dade = String(_0x4a4588.label_top_text || _0x4a4588.labelTopText || _0x4a4588.top_text || _0x4a4588.topText || "").trim();
  return _0x52dade === "置顶";
}
function cleanTitle(_0x1c54ab, _0x3acad4 = "", _0x1f11b7 = 0) {
  let _0x54673e = String(_0x1c54ab.desc || _0x1c54ab.description || _0x1c54ab.title || _0x1c54ab.share_info?.share_title || _0x1c54ab.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim();
  if (/^(相关搜索|大家都在搜|猜你想搜|视频|直播|图文)$/i.test(_0x54673e)) {
    _0x54673e = "";
  }
  if (/的抖音直播间|抖音直播间/.test(_0x54673e)) {
    _0x54673e = "";
  }
  if (!_0x54673e) {
    _0x54673e = (_0x3acad4 || "主播") + "的新作品 " + (_0x1f11b7 + 1);
  }
  return _0x54673e.slice(0, 120);
}
function extractAwemeAuthorSecUid(_0x3b23ab) {
  if (!_0x3b23ab || typeof _0x3b23ab !== "object") {
    return "";
  }
  const _0x26bb5c = _0x3b23ab.author || _0x3b23ab.authorInfo || _0x3b23ab.author_info || {};
  return String(_0x26bb5c.sec_uid || _0x26bb5c.secUid || _0x26bb5c.sec_user_id || _0x26bb5c.secUserId || "").trim();
}
function extractAwemeCreateTime(_0x513b2d) {
  if (!_0x513b2d || typeof _0x513b2d !== "object") {
    return 0;
  }
  const _0x437b1e = Number(_0x513b2d.create_time ?? _0x513b2d.createTime ?? _0x513b2d.create_time_ms ?? _0x513b2d.createTimeMs ?? 0);
  if (!Number.isFinite(_0x437b1e) || _0x437b1e <= 0) {
    return 0;
  }
  if (_0x437b1e < 1000000000000) {
    return Math.floor(_0x437b1e * 1000);
  }
  return Math.floor(_0x437b1e);
}
function normalizeAuthorPostWork(_0x1207e8, {
  authorName = "",
  rank = 1,
  expectedSecUid = ""
} = {}) {
  const _0x2bc8bb = extractAwemeId(_0x1207e8);
  if (!_0x2bc8bb || isJunkAweme(_0x1207e8)) {
    return null;
  }
  const _0x281edc = _0x1207e8.author || _0x1207e8.authorInfo || _0x1207e8.author_info || {};
  const _0x1d3c46 = extractAwemeAuthorSecUid(_0x1207e8);
  const _0x57b0e3 = String(expectedSecUid || "").trim();
  if (_0x57b0e3 && _0x1d3c46 && _0x1d3c46 !== _0x57b0e3) {
    return null;
  }
  const _0x145b6b = String(authorName || _0x281edc.nickname || _0x281edc.nickName || _0x281edc.nick_name || "").trim();
  const _0x20165a = extractAwemeCreateTime(_0x1207e8);
  return {
    url: "https://www.douyin.com/video/" + _0x2bc8bb,
    awemeId: _0x2bc8bb,
    title: cleanTitle(_0x1207e8, _0x145b6b, rank - 1),
    authorName: _0x145b6b,
    authorSecUid: _0x1d3c46 || _0x57b0e3 || "",
    createTime: _0x20165a,
    rank: rank,
    source: "author_post_api"
  };
}
function extractAuthorPostWorksFromResponse(_0x37ca1a, {
  maxWorks = 6,
  authorName = "",
  expectedSecUid = "",
  filterPinned = false
} = {}) {
  const _0x52d77e = Math.max(1, Math.min(100, Math.floor(Number(maxWorks) || 6)));
  const _0x46d345 = filterPinned === true;
  const _0x4a41dd = [];
  const _0x480c60 = new Set();
  let _0x3f8569 = null;
  let _0x3a3cf4 = String(authorName || "").trim();
  let _0x3a950 = false;
  const _0x23559c = new WeakSet();
  const _0x570761 = String(expectedSecUid || "").trim();
  const _0x2bc800 = _0x5e59c8 => {
    if (_0x4a41dd.length >= _0x52d77e) {
      return;
    }
    if (_0x46d345 && isAuthorPostWorkPinned(_0x5e59c8)) {
      return;
    }
    const _0x577f76 = normalizeAuthorPostWork(_0x5e59c8, {
      authorName: _0x3a3cf4,
      rank: _0x4a41dd.length + 1,
      expectedSecUid: _0x570761
    });
    if (!_0x577f76 || _0x480c60.has(_0x577f76.awemeId)) {
      return;
    }
    _0x480c60.add(_0x577f76.awemeId);
    _0x4a41dd.push(_0x577f76);
    if (!_0x3a3cf4 && _0x577f76.authorName) {
      _0x3a3cf4 = _0x577f76.authorName;
    }
  };
  const _0x53eda1 = (_0x9e0614, _0xa2e60e = 0) => {
    if (typeof _0x9e0614 === "string") {
      const _0x51af4a = _0x9e0614.trim();
      if (_0x51af4a && (_0x51af4a[0] === "{" || _0x51af4a[0] === "[")) {
        try {
          _0x53eda1(JSON.parse(_0x51af4a), _0xa2e60e + 1);
        } catch (_0x9552f9) {}
      }
      return;
    }
    if (!_0x9e0614 || typeof _0x9e0614 !== "object" || _0xa2e60e > 10 || _0x23559c.has(_0x9e0614)) {
      return;
    }
    _0x23559c.add(_0x9e0614);
    if (Array.isArray(_0x9e0614)) {
      if (_0x9e0614.length > 0 && _0x9e0614.some(_0x5223c1 => _0x5223c1 && extractAwemeId(_0x5223c1))) {
        _0x3a950 = true;
        _0x9e0614.forEach(_0x1301e4 => _0x2bc800(_0x1301e4));
      } else {
        _0x9e0614.forEach(_0x2aac4b => _0x53eda1(_0x2aac4b, _0xa2e60e + 1));
      }
      return;
    }
    if (_0x9e0614.aweme_list != null || _0x9e0614.awemeList != null) {
      _0x3a950 = true;
      _0x53eda1(_0x9e0614.aweme_list ?? _0x9e0614.awemeList, _0xa2e60e + 1);
    }
    const _0x159ce6 = _0x9e0614.aweme_count ?? _0x9e0614.awemeCount ?? _0x9e0614.total_aweme ?? _0x9e0614.totalAweme ?? _0x9e0614.publish_count ?? _0x9e0614.publishCount ?? _0x9e0614.user?.aweme_count ?? _0x9e0614.user?.awemeCount ?? _0x9e0614.user_info?.aweme_count ?? _0x9e0614.userInfo?.aweme_count;
    const _0x2e6198 = Number(_0x159ce6);
    if (Number.isFinite(_0x2e6198) && _0x2e6198 >= 0 && _0x3f8569 == null) {
      _0x3f8569 = Math.floor(_0x2e6198);
    }
    const _0x9f8a93 = _0x9e0614.author || _0x9e0614.user || _0x9e0614.user_info || _0x9e0614.userInfo;
    if (_0x9f8a93 && typeof _0x9f8a93 === "object" && !_0x3a3cf4) {
      const _0x1ddd93 = String(_0x9f8a93.nickname || _0x9f8a93.nickName || _0x9f8a93.nick_name || "").trim();
      if (_0x1ddd93) {
        _0x3a3cf4 = _0x1ddd93;
      }
    }
    ["data", "cards", "aweme_list", "awemeList", "business_data", "aweme_detail", "awemeDetail", "user", "user_info", "userInfo"].forEach(_0xc1cc15 => {
      if (_0x9e0614[_0xc1cc15] != null) {
        _0x53eda1(_0x9e0614[_0xc1cc15], _0xa2e60e + 1);
      }
    });
  };
  _0x53eda1(_0x37ca1a);
  if (_0x3f8569 == null && _0x3a950) {
    _0x3f8569 = _0x4a41dd.length;
  }
  return {
    works: _0x4a41dd,
    worksCount: _0x3f8569,
    authorName: _0x3a3cf4,
    hasPostListPayload: _0x3a950
  };
}
function isAuthorPostApiUrl(_0x54f42c) {
  return AUTHOR_POST_RESPONSE_RE.test(String(_0x54f42c || ""));
}
function extractSecUserIdFromAuthorPostApiUrl(_0x22d423) {
  const _0x282e6c = String(_0x22d423 || "").trim();
  if (!_0x282e6c) {
    return "";
  }
  try {
    const _0x4dae8c = new URL(_0x282e6c);
    return String(_0x4dae8c.searchParams.get("sec_user_id") || _0x4dae8c.searchParams.get("sec_uid") || "").trim();
  } catch (_0x17baf5) {
    const _0x45f826 = _0x282e6c.match(/[?&](?:sec_user_id|sec_uid)=([^&#]+)/i);
    if (!_0x45f826?.[1]) {
      return "";
    }
    try {
      return decodeURIComponent(_0x45f826[1]).trim();
    } catch (_0x4b98fd) {
      return String(_0x45f826[1] || "").trim();
    }
  }
}
function isAuthorPostApiUrlForSecUid(_0x52937b, _0x76b67) {
  if (!isAuthorPostApiUrl(_0x52937b)) {
    return false;
  }
  const _0x447894 = String(_0x76b67 || "").trim();
  if (!_0x447894) {
    return true;
  }
  const _0x321fd6 = extractSecUserIdFromAuthorPostApiUrl(_0x52937b);
  return !!_0x321fd6 && _0x321fd6 === _0x447894;
}
module.exports = {
  AUTHOR_POST_RESPONSE_RE: AUTHOR_POST_RESPONSE_RE,
  isAuthorPostApiUrl: isAuthorPostApiUrl,
  extractSecUserIdFromAuthorPostApiUrl: extractSecUserIdFromAuthorPostApiUrl,
  isAuthorPostApiUrlForSecUid: isAuthorPostApiUrlForSecUid,
  extractAwemeId: extractAwemeId,
  extractAwemeAuthorSecUid: extractAwemeAuthorSecUid,
  extractAwemeCreateTime: extractAwemeCreateTime,
  isAuthorPostWorkPinned: isAuthorPostWorkPinned,
  normalizeAuthorPostWork: normalizeAuthorPostWork,
  extractAuthorPostWorksFromResponse: extractAuthorPostWorksFromResponse
};
const {
  extractDouyinUrlsFromText
} = require("./douyinShareText");
const {
  buildDouyinSearchUrl: buildDouyinSearchUrlFromPack
} = require("./douyinRuntimeUrls");
const USER_FAN_API_VALUES = Object.freeze({
  "0": "",
  "1": "0_1k",
  "2": "1k_1w",
  "3": "1w_10w",
  "4": "10w_100w",
  "5": "100w_"
});
const USER_TYPE_API_VALUES = Object.freeze({
  "0": "",
  "1": "common_user",
  "2": "enterprise_user",
  "3": "personal_user"
});
function mapEntityUserFanApiValue(_0x32fe03) {
  const _0x506c0d = String(_0x32fe03 == null ? "0" : _0x32fe03);
  return USER_FAN_API_VALUES[_0x506c0d] || "";
}
function mapEntityUserTypeApiValue(_0x5c3971) {
  const _0x2b58b3 = String(_0x5c3971 == null ? "0" : _0x5c3971);
  return USER_TYPE_API_VALUES[_0x2b58b3] || "";
}
function buildEntityUserSearchFilterSelected(_0x4d9ba3, _0x50655a) {
  const _0x1eb44f = mapEntityUserFanApiValue(_0x4d9ba3);
  const _0x36b153 = mapEntityUserTypeApiValue(_0x50655a);
  if (!_0x1eb44f && !_0x36b153) {
    return null;
  }
  const _0x29ae2b = {};
  if (_0x1eb44f) {
    _0x29ae2b.douyin_user_fans = _0x1eb44f;
  }
  if (_0x36b153) {
    _0x29ae2b.douyin_user_type = _0x36b153;
  }
  return _0x29ae2b;
}
function buildDouyinSearchUrl(_0x5347a4, _0x48132b) {
  return buildDouyinSearchUrlFromPack(_0x5347a4, _0x48132b);
}
function buildEntitySearchModalUrl(_0x35ffcf, _0x141bde = "", _0x103f04) {
  const _0x70506b = String(_0x35ffcf || "").trim();
  const _0x2fce79 = _0x70506b.match(/(?:video|note)\/(\d{6,30})/i) || _0x70506b.match(/[?&]modal_id=(\d{6,30})/i) || _0x70506b.match(/^(\d{6,30})$/);
  const _0x408a06 = _0x2fce79?.[1] || "";
  if (!_0x408a06) {
    return "";
  }
  const _0x302c0d = buildDouyinSearchUrl(_0x141bde, _0x103f04);
  try {
    const _0xbc7f4 = new URL(_0x302c0d);
    _0xbc7f4.searchParams.set("modal_id", _0x408a06);
    return _0xbc7f4.toString();
  } catch (_0x5a5a80) {
    const _0x5eb983 = encodeURIComponent(String(_0x141bde || "").trim());
    if (_0x5eb983) {
      return "https://www.douyin.com/search/" + _0x5eb983 + "?modal_id=" + _0x408a06;
    } else {
      return "https://www.douyin.com/search/?modal_id=" + _0x408a06;
    }
  }
}
function buildDouyinUserSearchUrl(_0x49a8eb, _0x284f60 = {}) {
  const _0x1f4eec = String(_0x49a8eb || "").trim();
  if (!_0x1f4eec) {
    return "https://www.douyin.com/search";
  }
  const _0x394c74 = new URLSearchParams();
  _0x394c74.set("type", "user");
  const _0x29dbb9 = buildEntityUserSearchFilterSelected(_0x284f60.userFanCount, _0x284f60.userTypeFilter);
  if (_0x29dbb9) {
    _0x394c74.set("is_filter_search", "1");
    _0x394c74.set("filter_selected", JSON.stringify(_0x29dbb9));
    if (_0x29dbb9.douyin_user_fans) {
      _0x394c74.set("douyin_user_fans", _0x29dbb9.douyin_user_fans);
    }
    if (_0x29dbb9.douyin_user_type) {
      _0x394c74.set("douyin_user_type", _0x29dbb9.douyin_user_type);
    }
  }
  return "https://www.douyin.com/search/" + encodeURIComponent(_0x1f4eec) + "?" + _0x394c74.toString();
}
function extractDouyinLiveWebRid(_0x73f5d2) {
  const _0x77189d = String(_0x73f5d2 || "").trim();
  if (!_0x77189d) {
    return "";
  }
  if (/^\d{6,24}$/.test(_0x77189d)) {
    return _0x77189d;
  }
  try {
    const _0x158973 = new URL(/^https?:\/\//i.test(_0x77189d) ? _0x77189d : "https://" + _0x77189d);
    const _0x17f78d = _0x158973.pathname.match(/^\/(\d{6,24})\/?$/);
    if (/live\.douyin\.com$/i.test(_0x158973.hostname) && _0x17f78d?.[1]) {
      return _0x17f78d[1];
    }
    for (const _0x1a34cc of ["web_rid", "webRid"]) {
      const _0x2d63e7 = _0x158973.searchParams.get(_0x1a34cc);
      if (_0x2d63e7 && /^\d{6,24}$/.test(_0x2d63e7)) {
        return _0x2d63e7;
      }
    }
  } catch (_0x507601) {}
  const _0x262ac8 = _0x77189d.match(/live\.douyin\.com\/(\d{6,24})/i);
  if (_0x262ac8?.[1]) {
    return _0x262ac8[1];
  }
  return "";
}
function extractDouyinLiveReflowRoomId(_0x3c3ce4) {
  const _0xeffc69 = String(_0x3c3ce4 || "").trim();
  if (!_0xeffc69) {
    return "";
  }
  try {
    const _0x4a57b0 = new URL(/^https?:\/\//i.test(_0xeffc69) ? _0xeffc69 : "https://" + _0xeffc69);
    const _0x187e8e = _0x4a57b0.pathname.match(/\/(?:webcast\/)?reflow\/(\d{6,24})/i);
    if (_0x187e8e?.[1]) {
      return _0x187e8e[1];
    }
    for (const _0x494773 of ["room_id", "roomId"]) {
      const _0x1666d3 = _0x4a57b0.searchParams.get(_0x494773);
      if (_0x1666d3 && /^\d{6,24}$/.test(_0x1666d3)) {
        return _0x1666d3;
      }
    }
  } catch (_0x21a12c) {}
  const _0x3d3564 = _0xeffc69.match(/\/(?:webcast\/)?reflow\/(\d{6,24})/i);
  if (_0x3d3564?.[1]) {
    return _0x3d3564[1];
  }
  return "";
}
function extractDouyinLiveRoomId(_0x298a37) {
  return extractDouyinLiveWebRid(_0x298a37) || extractDouyinLiveReflowRoomId(_0x298a37);
}
function isDouyinLiveReflowUrl(_0x4dc17f) {
  return !!extractDouyinLiveReflowRoomId(_0x4dc17f) || /webcast\.amemv\.com/i.test(String(_0x4dc17f || "")) || /\/webcast\/reflow\//i.test(String(_0x4dc17f || ""));
}
function isDouyinLiveRoomUrl(_0x20208a) {
  return !!extractDouyinLiveWebRid(_0x20208a) || isDouyinLiveReflowUrl(_0x20208a);
}
function isEntityLiveUrlCandidate(_0x38a37b) {
  const _0x8f9598 = String(_0x38a37b || "").trim();
  if (!_0x8f9598) {
    return false;
  }
  if (isDouyinLiveRoomUrl(_0x8f9598)) {
    return true;
  }
  return /v\.douyin\.com/i.test(_0x8f9598) || /iesdouyin\.com\/share/i.test(_0x8f9598);
}
function buildDouyinLiveUrl(_0x505899) {
  const _0x1e9c92 = String(_0x505899 || "").trim();
  if (!_0x1e9c92) {
    return "";
  }
  const _0x4aa41e = extractDouyinLiveWebRid(_0x1e9c92);
  if (_0x4aa41e) {
    return "https://live.douyin.com/" + _0x4aa41e;
  }
  const _0x4e9132 = extractDouyinLiveReflowRoomId(_0x1e9c92);
  if (_0x4e9132) {
    return "https://webcast.amemv.com/douyin/webcast/reflow/" + _0x4e9132;
  }
  if (!/^https?:\/\//i.test(_0x1e9c92)) {
    return "https://" + _0x1e9c92;
  }
  try {
    const _0x1306df = new URL(_0x1e9c92);
    return "" + _0x1306df.origin + _0x1306df.pathname.replace(/\/$/, "");
  } catch (_0xa57c62) {
    return _0x1e9c92;
  }
}
function parseEntityLiveUrls(_0x3679cb) {
  const _0x8219fd = String(_0x3679cb || "").trim();
  if (!_0x8219fd) {
    return [];
  }
  const _0x1f8aac = _0x8219fd.split(/[\n,，;；]+/).map(_0x31be95 => _0x31be95.trim()).filter(Boolean);
  const _0x5061e9 = [];
  const _0x2c6cb3 = new Set();
  const _0x38ad82 = _0x4c611f => {
    const _0x1d8476 = String(_0x4c611f || "").trim();
    if (!_0x1d8476 || !isEntityLiveUrlCandidate(_0x1d8476) || _0x2c6cb3.has(_0x1d8476)) {
      return;
    }
    _0x2c6cb3.add(_0x1d8476);
    _0x5061e9.push(_0x1d8476);
  };
  for (const _0xc3f767 of _0x1f8aac) {
    if (/^\d{6,24}$/.test(_0xc3f767) || /^https?:\/\//i.test(_0xc3f767) && !/\s/.test(_0xc3f767)) {
      _0x38ad82(_0xc3f767);
      continue;
    }
    const _0x448bc9 = extractDouyinUrlsFromText(_0xc3f767);
    if (_0x448bc9.length) {
      const _0x2b9bfa = _0x448bc9.find(_0x340571 => isDouyinLiveRoomUrl(_0x340571));
      if (_0x2b9bfa) {
        _0x38ad82(_0x2b9bfa);
        continue;
      }
      const _0x3e187f = _0x448bc9.find(_0x4a9c65 => /v\.douyin\.com|iesdouyin\.com\/share/i.test(_0x4a9c65));
      if (_0x3e187f) {
        _0x38ad82(_0x3e187f);
        continue;
      }
      _0x448bc9.forEach(_0x38ad82);
      continue;
    }
    const _0x4b061e = _0xc3f767.match(/(?:^|[^\d])(\d{6,24})(?:$|[^\d])/);
    if (_0x4b061e?.[1]) {
      _0x38ad82(_0x4b061e[1]);
    }
  }
  return _0x5061e9;
}
const DOUYIN_SELF_PROFILE_URL = "https://www.douyin.com/user/self";
module.exports = {
  buildDouyinSearchUrl: buildDouyinSearchUrl,
  buildEntitySearchModalUrl: buildEntitySearchModalUrl,
  buildDouyinUserSearchUrl: buildDouyinUserSearchUrl,
  buildDouyinLiveUrl: buildDouyinLiveUrl,
  buildEntityUserSearchFilterSelected: buildEntityUserSearchFilterSelected,
  mapEntityUserFanApiValue: mapEntityUserFanApiValue,
  mapEntityUserTypeApiValue: mapEntityUserTypeApiValue,
  extractDouyinLiveRoomId: extractDouyinLiveRoomId,
  extractDouyinLiveWebRid: extractDouyinLiveWebRid,
  extractDouyinLiveReflowRoomId: extractDouyinLiveReflowRoomId,
  isDouyinLiveReflowUrl: isDouyinLiveReflowUrl,
  isDouyinLiveRoomUrl: isDouyinLiveRoomUrl,
  isEntityLiveUrlCandidate: isEntityLiveUrlCandidate,
  parseEntityLiveUrls: parseEntityLiveUrls,
  DOUYIN_SELF_PROFILE_URL: DOUYIN_SELF_PROFILE_URL
};
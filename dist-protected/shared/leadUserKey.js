const leadTouch = require("./leadTouch");
const {
  getDouyinCommentId,
  buildDouyinCommentLocateUrl
} = require("./processedVideoKey");
function isDouyinSecUid(_0x442c40) {
  if (!_0x442c40 || typeof _0x442c40 !== "string") {
    return false;
  }
  const _0x2d9206 = _0x442c40.trim();
  if (_0x2d9206.length < 15) {
    return false;
  }
  if (["self", "login", "anonymous", "undefined", "null"].includes(_0x2d9206.toLowerCase())) {
    return false;
  }
  if (_0x2d9206.startsWith("name:") || _0x2d9206.startsWith("live_")) {
    return false;
  }
  return /^[A-Za-z0-9_\-]+$/.test(_0x2d9206);
}
function extractUserKeyFromUrl(_0x458279) {
  if (!_0x458279 || typeof _0x458279 !== "string") {
    return "";
  }
  try {
    let _0x1da5fd = _0x458279.trim();
    if (_0x1da5fd.startsWith("//")) {
      _0x1da5fd = "https:" + _0x1da5fd;
    }
    if (!_0x1da5fd.startsWith("http")) {
      _0x1da5fd = "https://www.douyin.com" + (_0x1da5fd.startsWith("/") ? _0x1da5fd : "/" + _0x1da5fd);
    }
    const _0x2d83bc = new URL(_0x1da5fd);
    const _0x129c4e = _0x2d83bc.pathname.match(/\/user\/([^/?#]+)/i);
    if (_0x129c4e && _0x129c4e[1]) {
      const _0x5b367c = decodeURIComponent(_0x129c4e[1]);
      if (isDouyinSecUid(_0x5b367c)) {
        return _0x5b367c;
      }
    }
  } catch (_0x90311) {}
  return "";
}
function normalizeUserProfileUrl(_0x49baf1) {
  if (!_0x49baf1) {
    return "";
  }
  try {
    const _0x407805 = new URL(_0x49baf1.startsWith("http") ? _0x49baf1 : "https://www.douyin.com" + (_0x49baf1.startsWith("/") ? _0x49baf1 : "/" + _0x49baf1));
    return _0x407805.origin + _0x407805.pathname.replace(/\/$/, "");
  } catch (_0x55bec4) {
    return _0x49baf1;
  }
}
function normalizeDouyinUid(_0x485174) {
  const _0x592f5c = String(_0x485174 || "").trim();
  if (/^\d{5,24}$/.test(_0x592f5c) && !/^0+$/.test(_0x592f5c) && _0x592f5c !== "111111") {
    return _0x592f5c;
  } else {
    return "";
  }
}
function normalizeDouyinWebcastUid(_0x273bd3) {
  const _0x1dfc80 = String(_0x273bd3 || "").trim();
  if (_0x1dfc80.length >= 15 && _0x1dfc80 !== "111111" && /^[A-Za-z0-9_-]+$/.test(_0x1dfc80)) {
    return _0x1dfc80;
  } else {
    return "";
  }
}
function isVideoLeadRecord(_0x3ba364) {
  if (!_0x3ba364) {
    return false;
  }
  if (_0x3ba364.leadKind === "video_card" || _0x3ba364.sourceType === "video" || _0x3ba364.identityType === "video") {
    return true;
  }
  const _0x40ff11 = String(_0x3ba364.leadId || _0x3ba364.userKey || _0x3ba364.key || "").trim();
  if (/^video:\d{10,}$/.test(_0x40ff11)) {
    return true;
  }
  const _0x3e8125 = String(_0x3ba364.userUrl || "").trim();
  return /(?:video|note)\/\d{10,}/i.test(_0x3e8125);
}
function resolveLeadSourceVideoUrl(_0x18e2cb) {
  if (!_0x18e2cb) {
    return "";
  }
  const _0x6d03cf = [_0x18e2cb.videoUrl, isVideoLeadRecord(_0x18e2cb) ? _0x18e2cb.url : "", _0x18e2cb.url];
  for (const _0x1d4d6d of _0x6d03cf) {
    const _0x58f16b = String(_0x1d4d6d || "").trim();
    if (!_0x58f16b) {
      continue;
    }
    if (/\/user\//i.test(_0x58f16b) && !/(?:video|note)\/\d{10,}/i.test(_0x58f16b) && !/modal_id=\d{10,}/i.test(_0x58f16b)) {
      continue;
    }
    const _0x32d3f2 = _0x58f16b.match(/(?:video|note)\/(\d{10,})/i) || _0x58f16b.match(/modal_id=(\d{10,})/i) || _0x58f16b.match(/aweme_id=(\d{10,})/i);
    if (_0x32d3f2?.[1]) {
      return "https://www.douyin.com/video/" + _0x32d3f2[1];
    }
  }
  return "";
}
function getLeadCommentId(_0x3b5b2c) {
  return getDouyinCommentId(_0x3b5b2c || {});
}
function buildLeadCommentLocateUrl(_0x12098b) {
  const _0xfd48c6 = resolveLeadSourceVideoUrl(_0x12098b);
  if (!_0xfd48c6) {
    return "";
  }
  return buildDouyinCommentLocateUrl(_0xfd48c6, getLeadCommentId(_0x12098b));
}
function canLocateLeadComment(_0x38a2e4) {
  if (!_0x38a2e4 || isVideoLeadRecord(_0x38a2e4)) {
    return false;
  }
  return !!resolveLeadSourceVideoUrl(_0x38a2e4);
}
function isCommentSectionLead(_0x3dd61f) {
  if (!_0x3dd61f || isVideoLeadRecord(_0x3dd61f)) {
    return false;
  }
  const _0x2f8ec6 = String(_0x3dd61f.entrySource || "").trim();
  if (["import", "entity_blogger", "entity_user", "entity_live", "entity_following", "entity_mutual", "entity_video"].includes(_0x2f8ec6)) {
    return false;
  }
  if (["search", "follow", "recommend", "like", "specific", "entity_comment"].includes(_0x2f8ec6)) {
    return true;
  }
  const _0x1a9af4 = String(_0x3dd61f.taskId || "");
  if (_0x1a9af4 === "import_uid" || _0x1a9af4.startsWith("import_")) {
    return false;
  }
  if (_0x1a9af4.startsWith("entity_") && _0x2f8ec6 !== "entity_comment") {
    return false;
  }
  const _0x4d1f36 = (_0x3dd61f.entryLabel || "") + " " + (_0x3dd61f.taskName || "");
  if (/评论获客|评论区潜客|评论区/.test(_0x4d1f36)) {
    return true;
  }
  const _0x436fbf = !!getLeadCommentId(_0x3dd61f) || !!String(_0x3dd61f.content || _0x3dd61f.comment || _0x3dd61f.commentText || "").trim();
  if (_0x2f8ec6 === "monitor" || _0x1a9af4.startsWith("monitor_") || /监控/.test(_0x4d1f36)) {
    return _0x436fbf && !!resolveLeadSourceVideoUrl(_0x3dd61f);
  }
  if (!_0x2f8ec6 && (_0x3dd61f.searchKeyword || _0x3dd61f.taskName) && _0x436fbf && resolveLeadSourceVideoUrl(_0x3dd61f)) {
    return true;
  }
  return !!getLeadCommentId(_0x3dd61f) && !!resolveLeadSourceVideoUrl(_0x3dd61f) && !!_0x436fbf;
}
function canInteractLeadComment(_0x38888e) {
  return isCommentSectionLead(_0x38888e) && !!resolveLeadSourceVideoUrl(_0x38888e);
}
function resolveLeadLocateAccountId(_0x2b4a1d = {}, _0x3b04ad = []) {
  const _0x4e8f41 = Array.isArray(_0x3b04ad) ? _0x3b04ad : [];
  const _0x13b5c2 = String(_0x2b4a1d.accountId || _0x2b4a1d.account_id || "").trim();
  if (_0x13b5c2 && _0x4e8f41.some(_0x1c60d9 => String(_0x1c60d9.id) === _0x13b5c2)) {
    return _0x13b5c2;
  }
  const _0x39aea3 = String(_0x2b4a1d.accountName || _0x2b4a1d.account || "").trim().toLowerCase();
  if (_0x39aea3) {
    const _0xf0700f = _0x4e8f41.find(_0x420f41 => {
      const _0x34bc7b = String(_0x420f41.nickname || _0x420f41.name || "").trim().toLowerCase();
      return _0x34bc7b && _0x34bc7b === _0x39aea3;
    });
    if (_0xf0700f) {
      return String(_0xf0700f.id);
    }
  }
  if (_0x4e8f41[0]) {
    return String(_0x4e8f41[0].id);
  } else {
    return "";
  }
}
function extractVideoLeadKey(_0x351c9e) {
  if (!isVideoLeadRecord(_0x351c9e)) {
    return "";
  }
  const _0x40337c = String(_0x351c9e.leadId || _0x351c9e.userKey || _0x351c9e.key || "").trim();
  if (/^video:\d{10,}$/.test(_0x40337c)) {
    return _0x40337c;
  }
  const _0x533fb6 = String(_0x351c9e.userUrl || "").match(/(?:video|note)\/(\d{10,})/i);
  if (_0x533fb6?.[1]) {
    return "video:" + _0x533fb6[1];
  }
  const _0x5b6d40 = String(_0x351c9e.videoUrl || _0x351c9e.url || _0x351c9e.content || "").trim();
  const _0x342455 = _0x5b6d40.match(/(?:video|note)\/(\d{10,})/i);
  if (_0x342455?.[1]) {
    return "video:" + _0x342455[1];
  }
  return "";
}
function getPersonLeadSecUid(_0x3061d6) {
  if (!_0x3061d6) {
    return "";
  }
  if (isVideoLeadRecord(_0x3061d6)) {
    return "";
  }
  const _0x38dc11 = String(_0x3061d6.secUid || _0x3061d6.sec_uid || "").trim();
  if (isDouyinSecUid(_0x38dc11)) {
    return _0x38dc11;
  }
  const _0x3c385b = normalizeDouyinWebcastUid(_0x3061d6.webcastUid || _0x3061d6.webcast_uid || _0x3061d6.webcast_uid_str);
  const _0x8cacbe = extractUserKeyFromUrl(_0x3061d6.userUrl || _0x3061d6.authorProfileUrl || "");
  if (_0x3c385b && _0x8cacbe && _0x8cacbe === _0x3c385b) {
    return "";
  }
  if (_0x3061d6.privacyMasked || _0x3061d6.identityType === "webcast") {
    if (_0x8cacbe && _0x8cacbe !== _0x3c385b && isDouyinSecUid(_0x8cacbe)) {
      return _0x8cacbe;
    }
    return "";
  }
  if (_0x8cacbe) {
    return _0x8cacbe;
  }
  const _0x345979 = String(_0x3061d6.userKey || "").trim();
  if (isDouyinSecUid(_0x345979)) {
    return _0x345979;
  }
  const _0x2f9012 = String(_0x3061d6.leadId || _0x3061d6.key || "").trim();
  if (isDouyinSecUid(_0x2f9012)) {
    return _0x2f9012;
  }
  return "";
}
function getLeadUserKey(_0x44eed6) {
  if (!_0x44eed6) {
    return "";
  }
  if (_0x44eed6.leadKind === "collected_author" || _0x44eed6.identityType === "author") {
    try {
      const {
        toCollectedAuthorKey: _0x289684,
        resolveAuthorSecUidFromLead: _0x270313
      } = require("./collectedLeadKeys");
      const _0x4e196f = _0x270313(_0x44eed6);
      if (_0x4e196f) {
        return _0x289684(_0x4e196f);
      }
    } catch (_0x43d60d) {}
    const _0x45c8fd = String(_0x44eed6.leadId || _0x44eed6.key || "").trim();
    if (/^author:/.test(_0x45c8fd)) {
      return _0x45c8fd;
    }
  }
  const _0x21a2a0 = extractVideoLeadKey(_0x44eed6);
  if (_0x21a2a0) {
    return _0x21a2a0;
  }
  if (_0x44eed6.leadKind === "video_card" && _0x44eed6.leadId) {
    return String(_0x44eed6.leadId);
  }
  const _0x2c446f = getPersonLeadSecUid(_0x44eed6);
  if (_0x2c446f) {
    return _0x2c446f;
  }
  const _0x739e3b = normalizeDouyinWebcastUid(_0x44eed6.webcastUid || _0x44eed6.webcast_uid || _0x44eed6.webcast_uid_str);
  if (_0x739e3b) {
    return "webcast:" + _0x739e3b;
  }
  const _0x14c921 = normalizeDouyinUid(_0x44eed6.uid || _0x44eed6.id_str || _0x44eed6.idStr || _0x44eed6.user_id);
  if (_0x14c921) {
    return "uid:" + _0x14c921;
  }
  const _0x5c9f05 = String(_0x44eed6.userKey || "").trim();
  if (/^uid:\d{5,24}$/.test(_0x5c9f05) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(_0x5c9f05)) {
    return _0x5c9f05;
  }
  const _0x2d5aac = String(_0x44eed6.leadId || _0x44eed6.key || "").trim();
  if (/^uid:\d{5,24}$/.test(_0x2d5aac) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(_0x2d5aac) || /^video:\d{10,}$/.test(_0x2d5aac)) {
    return _0x2d5aac;
  }
  return "";
}
function buildLeadId(_0x4ee794) {
  const _0x140fb2 = getPersonLeadSecUid(_0x4ee794);
  if (_0x140fb2) {
    return _0x140fb2;
  }
  const _0xadd44a = extractVideoLeadKey(_0x4ee794);
  if (_0xadd44a) {
    return _0xadd44a;
  }
  const _0x3311e4 = (_0x4ee794?.nickname || "").trim();
  const _0x6a7377 = (_0x4ee794?.content || "").trim();
  if (_0x3311e4 && _0x6a7377) {
    return _0x3311e4 + "_" + _0x6a7377;
  }
  if (_0x3311e4) {
    return _0x3311e4;
  }
  return "unknown_" + Date.now();
}
function isTransientLeadIdentityKey(_0x38265a) {
  const _0x4e1410 = String(_0x38265a || "").trim();
  return /^uid:\d{5,24}$/.test(_0x4e1410) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(_0x4e1410);
}
function mergeLeadRecords(_0x15fdc6, _0x4b5d77) {
  if (!_0x15fdc6 || !_0x4b5d77) {
    return _0x15fdc6;
  }
  const _0x56de41 = !isVideoLeadRecord(_0x15fdc6);
  const _0x43509d = getLeadUserKey(_0x4b5d77);
  const _0x414ffa = getLeadUserKey(_0x15fdc6);
  const _0x1e20c9 = _0x56de41 && _0x414ffa && /^video:\d{10,}$/.test(String(_0x43509d)) ? _0x414ffa : _0x43509d || _0x414ffa;
  if (_0x1e20c9) {
    const _0x47e07a = /^video:\d{10,}$/.test(String(_0x1e20c9));
    if (!_0x56de41 || !_0x47e07a) {
      _0x15fdc6.leadId = _0x1e20c9;
      _0x15fdc6.key = _0x1e20c9;
    }
  }
  const _0x2278c1 = normalizeDouyinWebcastUid(_0x4b5d77.webcastUid || _0x4b5d77.webcast_uid || _0x4b5d77.webcast_uid_str);
  if (_0x4b5d77.userUrl && !_0x2278c1 && !_0x15fdc6.userUrl) {
    const _0x3f9b21 = /(?:video|note)\/\d{10,}/i.test(String(_0x4b5d77.userUrl));
    if (!_0x3f9b21 || isVideoLeadRecord(_0x15fdc6)) {
      _0x15fdc6.userUrl = _0x4b5d77.userUrl;
    }
  }
  if (_0x4b5d77.uid) {
    _0x15fdc6.uid = String(_0x4b5d77.uid);
  }
  if (_0x4b5d77.secUid || _0x4b5d77.sec_uid) {
    _0x15fdc6.secUid = String(_0x4b5d77.secUid || _0x4b5d77.sec_uid);
  }
  if (_0x2278c1) {
    _0x15fdc6.webcastUid = _0x2278c1;
  }
  if (_0x2278c1 && !_0x15fdc6.secUid) {
    _0x15fdc6.userUrl = "";
  }
  if (_0x4b5d77.privacyMasked != null) {
    _0x15fdc6.privacyMasked = !!_0x4b5d77.privacyMasked;
  }
  if (_0x4b5d77.identityType) {
    _0x15fdc6.identityType = String(_0x4b5d77.identityType);
  }
  if (_0x4b5d77.profileAvailable != null) {
    _0x15fdc6.profileAvailable = !!_0x4b5d77.profileAvailable;
  }
  if (_0x4b5d77.profileUnavailable != null) {
    _0x15fdc6.profileUnavailable = !!_0x4b5d77.profileUnavailable;
  }
  if (_0x4b5d77.profileUnavailableReason) {
    _0x15fdc6.profileUnavailableReason = String(_0x4b5d77.profileUnavailableReason);
  }
  if (_0x4b5d77.userGone != null) {
    _0x15fdc6.userGone = !!_0x4b5d77.userGone;
  }
  if (_0x4b5d77.noWorks || _0x4b5d77.skipReason === "作品数为0") {
    _0x15fdc6.noWorks = true;
    if (_0x4b5d77.skipReason) {
      _0x15fdc6.lastBatchSkipReason = _0x4b5d77.skipReason;
    }
  }
  if (_0x4b5d77.isPrivate !== undefined) {
    _0x15fdc6.isPrivate = !!_0x4b5d77.isPrivate;
  }
  if (_0x4b5d77.worksCount !== undefined && _0x4b5d77.worksCount !== null) {
    _0x15fdc6.worksCount = _0x4b5d77.worksCount;
    if (Number(_0x4b5d77.worksCount) === 0) {
      _0x15fdc6.noWorks = true;
    }
  }
  if (_0x4b5d77.liveUrl) {
    _0x15fdc6.liveUrl = _0x4b5d77.liveUrl;
  }
  if (_0x4b5d77.nickname) {
    const _0xf45bc4 = _0x52e127 => {
      const _0xb665ed = extractUserKeyFromUrl(_0x52e127?.userUrl);
      if (_0xb665ed) {
        return _0xb665ed;
      }
      const _0xa12a9 = String(_0x52e127?.secUid || _0x52e127?.sec_uid || "").trim();
      if (isDouyinSecUid(_0xa12a9)) {
        return _0xa12a9;
      }
      const _0x121850 = String(_0x52e127?.leadId || _0x52e127?.key || "").trim();
      if (isDouyinSecUid(_0x121850)) {
        return _0x121850;
      }
      return "";
    };
    const _0x21b5a1 = _0xf45bc4(_0x4b5d77);
    const _0x4fcbd0 = _0xf45bc4(_0x15fdc6);
    if (!_0x15fdc6.nickname) {
      _0x15fdc6.nickname = _0x4b5d77.nickname;
    } else if (!_0x4fcbd0) {
      _0x15fdc6.nickname = _0x4b5d77.nickname;
    } else if (_0x21b5a1 && _0x21b5a1 === _0x4fcbd0) {
      _0x15fdc6.nickname = _0x4b5d77.nickname;
    }
  }
  if (_0x4b5d77.platform) {
    _0x15fdc6.platform = _0x4b5d77.platform;
  }
  if (_0x4b5d77.leadKind === "video_card") {
    if (isVideoLeadRecord(_0x15fdc6)) {
      _0x15fdc6.leadKind = "video_card";
      _0x15fdc6.videoUrl = _0x4b5d77.videoUrl || _0x4b5d77.url || _0x15fdc6.videoUrl;
      _0x15fdc6.url = _0x4b5d77.videoUrl || _0x4b5d77.url || _0x15fdc6.url;
      _0x15fdc6.title = _0x4b5d77.title || _0x15fdc6.title;
      _0x15fdc6.authorProfileUrl = _0x4b5d77.authorProfileUrl || _0x4b5d77.userUrl || _0x15fdc6.authorProfileUrl;
      if (_0x4b5d77.authorProfileUrl || _0x4b5d77.userUrl) {
        _0x15fdc6.userUrl = _0x4b5d77.authorProfileUrl || _0x4b5d77.userUrl;
      }
    } else {
      const _0x518f42 = resolveLeadSourceVideoUrl(_0x4b5d77);
      if (_0x518f42) {
        _0x15fdc6.videoUrl = _0x15fdc6.videoUrl || _0x518f42;
      }
      if (_0x4b5d77.title && !_0x15fdc6.title) {
        _0x15fdc6.title = _0x4b5d77.title;
      }
      if (_0x4b5d77.authorProfileUrl) {
        _0x15fdc6.authorProfileUrl = _0x4b5d77.authorProfileUrl;
      }
    }
    _0x15fdc6.collectedFields = [...new Set([...(Array.isArray(_0x15fdc6.collectedFields) ? _0x15fdc6.collectedFields : []), ...(Array.isArray(_0x4b5d77.collectedFields) ? _0x4b5d77.collectedFields : [])])];
  }
  const _0x2eed1d = _0x4b5d77.timestamp || _0x4b5d77.capturedAt || 0;
  const _0x4a2b1f = _0x15fdc6.timestamp || _0x15fdc6.capturedAt || 0;
  const _0x42f585 = _0x4f9c79 => {
    if (!_0x4f9c79) {
      return "";
    }
    for (const _0x104950 of [_0x4f9c79.content, _0x4f9c79.comment, _0x4f9c79.commentContent, _0x4f9c79.userComment, _0x4f9c79.commentText]) {
      const _0x231e13 = String(_0x104950 ?? "").trim();
      if (_0x231e13) {
        return _0x231e13;
      }
    }
    return "";
  };
  const _0x5a1d56 = _0x42f585(_0x4b5d77);
  const _0x2b4c78 = _0x42f585(_0x15fdc6);
  if (_0x5a1d56 && (!_0x2b4c78 || _0x2eed1d >= _0x4a2b1f)) {
    _0x15fdc6.content = _0x5a1d56;
    _0x15fdc6.title = _0x4b5d77.title || _0x15fdc6.title;
    _0x15fdc6.timeText = _0x4b5d77.timeText || _0x15fdc6.timeText;
    _0x15fdc6.ipLocation = _0x4b5d77.ipLocation || _0x4b5d77.location || _0x15fdc6.ipLocation || _0x15fdc6.location || "";
    const _0x43898a = resolveLeadSourceVideoUrl(_0x4b5d77);
    if (_0x43898a) {
      _0x15fdc6.videoUrl = _0x15fdc6.videoUrl || _0x43898a;
    }
    if (resolveLeadSourceVideoUrl({
      url: _0x4b5d77.url,
      videoUrl: ""
    })) {
      _0x15fdc6.url = _0x4b5d77.url || _0x15fdc6.url;
    }
  } else {
    if (!_0x15fdc6.timeText && _0x4b5d77.timeText) {
      _0x15fdc6.timeText = _0x4b5d77.timeText;
    }
    if (!_0x15fdc6.ipLocation && !_0x15fdc6.location && (_0x4b5d77.ipLocation || _0x4b5d77.location)) {
      _0x15fdc6.ipLocation = _0x4b5d77.ipLocation || _0x4b5d77.location;
    }
  }
  if (_0x4b5d77.excludedCommentKeyword && _0x2eed1d >= _0x4a2b1f) {
    _0x15fdc6.isHighIntention = false;
    _0x15fdc6.excludedCommentKeyword = _0x4b5d77.excludedCommentKeyword;
  } else if (_0x4b5d77.isHighIntention) {
    _0x15fdc6.isHighIntention = true;
  }
  if (_0x4b5d77.aiThought) {
    _0x15fdc6.aiThought = _0x4b5d77.aiThought;
  }
  if (_0x4b5d77.thought) {
    _0x15fdc6.thought = _0x4b5d77.thought;
  }
  if (_0x4b5d77.gender) {
    _0x15fdc6.gender = _0x4b5d77.gender;
  }
  if (_0x4b5d77.douyinId) {
    _0x15fdc6.douyinId = _0x4b5d77.douyinId;
  }
  if (_0x4b5d77.signature) {
    _0x15fdc6.signature = _0x4b5d77.signature;
  }
  if (_0x4b5d77.contact) {
    _0x15fdc6.contact = _0x4b5d77.contact;
  }
  const _0x168ef3 = getLeadCommentId(_0x4b5d77);
  const _0x155b4c = getLeadCommentId(_0x15fdc6);
  if (_0x168ef3 && (!_0x155b4c || _0x2eed1d >= _0x4a2b1f)) {
    _0x15fdc6.cid = _0x168ef3;
    _0x15fdc6.commentId = _0x168ef3;
  }
  if (_0x4b5d77.entrySource) {
    _0x15fdc6.entrySource = _0x4b5d77.entrySource;
  }
  if (_0x4b5d77.entryLabel) {
    _0x15fdc6.entryLabel = _0x4b5d77.entryLabel;
  }
  if (_0x4b5d77.searchKeyword !== undefined) {
    _0x15fdc6.searchKeyword = _0x4b5d77.searchKeyword;
  }
  if (_0x4b5d77.worksCount !== undefined && _0x4b5d77.worksCount !== null) {
    _0x15fdc6.worksCount = _0x4b5d77.worksCount;
  }
  if (_0x4b5d77.accountName) {
    const _0xfefc3a = String(_0x4b5d77.accountName || "").trim();
    const _0x50ff62 = new Set(["主账号", "默认账号", "本账号", "未知账号", "已登录(待识别)"]);
    const _0x4f56eb = String(_0x15fdc6.accountName || "").trim();
    if (_0xfefc3a && (!_0x50ff62.has(_0xfefc3a) || !_0x4f56eb || !!_0x50ff62.has(_0x4f56eb))) {
      _0x15fdc6.accountName = _0x4b5d77.accountName;
    }
  }
  if (_0x4b5d77.accountId) {
    _0x15fdc6.accountId = _0x4b5d77.accountId;
  }
  const _0x1ef1e3 = _0x55760f => {
    if (!_0x55760f || typeof _0x55760f !== "object") {
      return "";
    }
    const _0x7914c3 = String(_0x55760f.messageId || _0x55760f.msgId || "").trim();
    if (_0x7914c3) {
      return "id:" + _0x7914c3;
    }
    return [_0x55760f.method || _0x55760f.type || "", _0x55760f.occurredAt || _0x55760f.observedAt || "", _0x55760f.content || _0x55760f.text || ""].join("|");
  };
  const _0x28a69e = [...(Array.isArray(_0x15fdc6.liveEvents) ? _0x15fdc6.liveEvents : []), ...(_0x15fdc6.liveEvent ? [_0x15fdc6.liveEvent] : []), ...(Array.isArray(_0x4b5d77.liveEvents) ? _0x4b5d77.liveEvents : []), ...(_0x4b5d77.liveEvent ? [_0x4b5d77.liveEvent] : [])];
  if (_0x28a69e.length) {
    const _0x5f049f = new Map();
    _0x28a69e.forEach(_0x5b4e70 => {
      const _0x4a19c8 = _0x1ef1e3(_0x5b4e70);
      if (_0x4a19c8 && !_0x5f049f.has(_0x4a19c8)) {
        _0x5f049f.set(_0x4a19c8, _0x5b4e70);
      }
    });
    _0x15fdc6.liveEvents = [..._0x5f049f.values()].sort((_0x5a4d3b, _0x2c19c0) => Number(_0x5a4d3b.occurredAt || _0x5a4d3b.observedAt || 0) - Number(_0x2c19c0.occurredAt || _0x2c19c0.observedAt || 0)).slice(-500);
    _0x15fdc6.liveEvent = _0x15fdc6.liveEvents[_0x15fdc6.liveEvents.length - 1] || _0x4b5d77.liveEvent || _0x15fdc6.liveEvent;
    _0x15fdc6.messageId = String(_0x15fdc6.liveEvent?.messageId || _0x4b5d77.messageId || _0x15fdc6.messageId || "");
    const _0x3de115 = Number(_0x15fdc6.liveEvents[0]?.occurredAt || _0x15fdc6.liveEvents[0]?.observedAt || 0);
    const _0x39f00a = Number(_0x15fdc6.liveEvent?.occurredAt || _0x15fdc6.liveEvent?.observedAt || 0);
    if (_0x3de115 > 0) {
      _0x15fdc6.firstSeenAt = _0x15fdc6.firstSeenAt ? Math.min(Number(_0x15fdc6.firstSeenAt), _0x3de115) : _0x3de115;
    }
    if (_0x39f00a > 0) {
      _0x15fdc6.lastSeenAt = Math.max(Number(_0x15fdc6.lastSeenAt || 0), _0x39f00a);
    }
    if (_0x15fdc6.liveEvent?.content) {
      _0x15fdc6.content = _0x15fdc6.liveEvent.content;
    }
  }
  if (_0x2eed1d >= _0x4a2b1f) {
    if (_0x4b5d77.taskId) {
      _0x15fdc6.taskId = _0x4b5d77.taskId;
    }
    if (_0x4b5d77.taskName) {
      _0x15fdc6.taskName = _0x4b5d77.taskName;
    }
    _0x15fdc6.timestamp = _0x2eed1d || _0x15fdc6.timestamp;
    _0x15fdc6.capturedAt = _0x4b5d77.capturedAt || _0x15fdc6.capturedAt;
  }
  if (Array.isArray(_0x4b5d77.touchLog) && _0x4b5d77.touchLog.length) {
    _0x15fdc6.touchLog = leadTouch.mergeTouchLogs(_0x15fdc6.touchLog || [], _0x4b5d77.touchLog);
    leadTouch.recountTouchCountsAfterMerge(_0x15fdc6);
  } else if (_0x4b5d77.touchCounts) {
    _0x15fdc6.touchCounts = _0x15fdc6.touchCounts || {};
    Object.keys(_0x4b5d77.touchCounts).forEach(_0x3cef79 => {
      _0x15fdc6.touchCounts[_0x3cef79] = Math.max(_0x15fdc6.touchCounts[_0x3cef79] || 0, _0x4b5d77.touchCounts[_0x3cef79] || 0);
    });
    leadTouch.recountTouchCountsAfterMerge(_0x15fdc6);
  }
  if (_0x4b5d77.profileCommentAt) {
    _0x15fdc6.profileCommentAt = Number(_0x4b5d77.profileCommentAt);
  }
  if (_0x4b5d77.lastTouchAt) {
    _0x15fdc6.lastTouchAt = Math.max(Number(_0x15fdc6.lastTouchAt || 0), Number(_0x4b5d77.lastTouchAt || 0));
  }
  if (_0x4b5d77.liked || _0x4b5d77.actions?.liked) {
    _0x15fdc6.liked = true;
  }
  if (_0x4b5d77.replied || _0x4b5d77.actions?.replied) {
    _0x15fdc6.replied = true;
  }
  if (_0x4b5d77.followed || _0x4b5d77.actions?.followed) {
    _0x15fdc6.followed = true;
  }
  if (_0x4b5d77.followStatus) {
    _0x15fdc6.followStatus = _0x4b5d77.followStatus;
  }
  if (_0x4b5d77.followRequested !== undefined) {
    _0x15fdc6.followRequested = !!_0x4b5d77.followRequested;
  }
  if (_0x4b5d77.followRequestSent !== undefined) {
    _0x15fdc6.followRequestSent = !!_0x4b5d77.followRequestSent;
  }
  if (_0x4b5d77.followIsPrivate !== undefined) {
    _0x15fdc6.followIsPrivate = !!_0x4b5d77.followIsPrivate;
  }
  if (_0x4b5d77.followError) {
    _0x15fdc6.followError = _0x4b5d77.followError;
  }
  if (_0x4b5d77.messaged || _0x4b5d77.actions?.messaged) {
    _0x15fdc6.messaged = true;
  }
  if (_0x4b5d77.dmContent) {
    _0x15fdc6.dmContent = _0x4b5d77.dmContent;
    _0x15fdc6.actions = {
      ...(_0x15fdc6.actions || {}),
      dmContent: _0x4b5d77.dmContent
    };
  }
  if (_0x4b5d77.replyContent) {
    _0x15fdc6.replyContent = _0x4b5d77.replyContent;
    _0x15fdc6.actions = {
      ...(_0x15fdc6.actions || {}),
      replyContent: _0x4b5d77.replyContent
    };
  }
  if (_0x4b5d77.actions) {
    _0x15fdc6.actions = {
      ...(_0x15fdc6.actions || {}),
      ..._0x4b5d77.actions
    };
  }
  return _0x15fdc6;
}
module.exports = {
  isVideoLeadRecord: isVideoLeadRecord,
  resolveLeadSourceVideoUrl: resolveLeadSourceVideoUrl,
  getLeadCommentId: getLeadCommentId,
  buildLeadCommentLocateUrl: buildLeadCommentLocateUrl,
  canLocateLeadComment: canLocateLeadComment,
  isCommentSectionLead: isCommentSectionLead,
  canInteractLeadComment: canInteractLeadComment,
  resolveLeadLocateAccountId: resolveLeadLocateAccountId,
  isDouyinSecUid: isDouyinSecUid,
  normalizeDouyinUid: normalizeDouyinUid,
  extractUserKeyFromUrl: extractUserKeyFromUrl,
  normalizeUserProfileUrl: normalizeUserProfileUrl,
  getPersonLeadSecUid: getPersonLeadSecUid,
  isTransientLeadIdentityKey: isTransientLeadIdentityKey,
  getLeadUserKey: getLeadUserKey,
  buildLeadId: buildLeadId,
  mergeLeadRecords: mergeLeadRecords
};
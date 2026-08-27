const SEARCH_RESPONSE_RE = /\/aweme\/v1\/web\/(?:general\/search\/single|discover\/search|search\/item|search\/single|search\/)|\/search\/item|\/search\/single|search_channel=aweme_user|aweme_user_web|\/user\/search|channel=aweme_user/i;
const VIDEO_RESPONSE_RE = /\/aweme\/v1\/web\/(?:general\/search|discover\/search|search\/item|search\/single|search\/|aweme\/detail|detail\/|aweme\/favorite|aweme\/post|aweme\/listcollection|tab\/feed|module\/feed|recommend\/item|nearby\/feed)|\/web\/api\/v2\/aweme\/like|\/search\/item|\/search\/single|aweme_general_search|aweme_video_web/i;
const RELATION_RESPONSE_RE = /\/aweme\/v1\/web\/user\/(?:follower|following)|follower\/list|following\/list/i;
const LIVE_RESPONSE_RE = /\/webcast\/(?:im\/fetch|room\/reflow\/info|chat)|webcast3-ws-web/i;
const COMMENT_RESPONSE_RE = /\/aweme\/v1\/web\/comment\/list(?!\/reply)/i;
const ATTACH_TIMEOUT_MS = 1500;
const {
  readCommentMetaFromApiObject,
  mergeCommentUserFields
} = require("../shared/entityCommentMeta");
const {
  canonicalizeDouyinVideoUrl
} = require("../shared/processedVideoKey");
const {
  readCommentTextFromApiObject
} = require("../shared/douyinCommentContentLines");
const {
  isDouyinNestedReplyComment,
  shouldWalkCommentNestedKey
} = require("../shared/douyinCommentReplyGuard");
function cleanNickname(_0xe3a5f1) {
  return String(_0xe3a5f1 || "").trim().replace(/^@+/, "");
}
function parseFollowerCount(_0x52aa48) {
  if (!_0x52aa48 || typeof _0x52aa48 !== "object") {
    return null;
  }
  const _0x12932e = _0x52aa48.follower_count ?? _0x52aa48.followerCount ?? _0x52aa48.mplatform_followers_count ?? _0x52aa48.mplatformFollowersCount ?? _0x52aa48.fans_count ?? _0x52aa48.fansCount;
  const _0x1d27fd = Number(_0x12932e);
  if (Number.isFinite(_0x1d27fd) && _0x1d27fd >= 0) {
    return Math.floor(_0x1d27fd);
  } else {
    return null;
  }
}
function normalizeUser(_0x29fb17, _0xc97fe, _0x1c1ddf = {}) {
  if (!_0x29fb17 || typeof _0x29fb17 !== "object") {
    return null;
  }
  const _0x59a1f7 = String(_0x29fb17.sec_uid || _0x29fb17.secUid || "").trim();
  const _0x8455b0 = cleanNickname(_0x29fb17.nickname || _0x29fb17.nickName || _0x29fb17.nick_name);
  if (!_0x59a1f7 || _0x59a1f7.length < 8 || !_0x8455b0 || /^(self|login)$/i.test(_0x59a1f7)) {
    return null;
  }
  const _0x928b83 = String(_0x1c1ddf.timeText || _0x29fb17.timeText || _0x29fb17.time || "").trim();
  const _0x3a92b8 = String(_0x1c1ddf.ipLocation || _0x29fb17.ipLocation || _0x29fb17.location || "").trim();
  const _0x587f1d = String(_0x1c1ddf.videoUrl || _0x29fb17.videoUrl || "").trim();
  return {
    secUid: _0x59a1f7,
    userKey: _0x59a1f7,
    nickname: _0x8455b0,
    userUrl: "https://www.douyin.com/user/" + _0x59a1f7,
    sourceType: _0xc97fe,
    followerCount: parseFollowerCount(_0x29fb17),
    content: String(_0x1c1ddf.content || _0x29fb17.content || _0x29fb17.text || "").trim(),
    timeText: _0x928b83,
    time: _0x928b83,
    ipLocation: _0x3a92b8,
    location: _0x3a92b8,
    ...(_0x587f1d ? {
      videoUrl: _0x587f1d
    } : {})
  };
}
function extractAwemeVideoId(_0x17bcbc) {
  if (!_0x17bcbc || typeof _0x17bcbc !== "object") {
    return "";
  }
  const _0x2b4816 = _0x17bcbc.aweme_id || _0x17bcbc.awemeId || _0x17bcbc.group_id || _0x17bcbc.groupId || _0x17bcbc.item_id || _0x17bcbc.itemId || _0x17bcbc.aweme_id_str || _0x17bcbc.id_str || _0x17bcbc.id;
  const _0x3476cf = String(_0x2b4816 || "").trim();
  if (/^\d{10,}$/.test(_0x3476cf)) {
    return _0x3476cf;
  } else {
    return "";
  }
}
function isLiveOrJunkSearchAweme(_0x52040c) {
  if (!_0x52040c || typeof _0x52040c !== "object") {
    return true;
  }
  const _0x479dd1 = Number(_0x52040c.aweme_type ?? _0x52040c.awemeType ?? _0x52040c.media_type ?? _0x52040c.mediaType);
  if (_0x479dd1 === 101 || _0x479dd1 === 400) {
    return true;
  }
  if (_0x52040c.live_id || _0x52040c.liveId || _0x52040c.room_id || _0x52040c.roomId || _0x52040c.is_live || _0x52040c.isLive) {
    return true;
  }
  if (_0x52040c.cell_type === "related_search" || _0x52040c.card_type === "related_search") {
    return true;
  }
  const _0x521feb = String(_0x52040c.desc || _0x52040c.description || _0x52040c.title || _0x52040c.share_info?.share_title || _0x52040c.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim();
  if (/^(相关搜索|大家都在搜|猜你想搜)$/i.test(_0x521feb)) {
    return true;
  }
  if (/的抖音直播间|抖音直播间(?:直播)?$|正在直播|进入直播间/.test(_0x521feb)) {
    return true;
  }
  return false;
}
function normalizeVideoItem(_0x329c4c, _0x25c725 = "") {
  const _0x53c19e = extractAwemeVideoId(_0x329c4c);
  if (!_0x53c19e) {
    return null;
  }
  if (isLiveOrJunkSearchAweme(_0x329c4c)) {
    return null;
  }
  let _0x8e150c = String(_0x329c4c.desc || _0x329c4c.description || _0x329c4c.title || _0x329c4c.share_info?.share_title || _0x329c4c.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim().slice(0, 100);
  if (/^(相关搜索|大家都在搜|猜你想搜|视频|直播|图文)$/i.test(_0x8e150c)) {
    _0x8e150c = "";
  }
  if (/的抖音直播间|抖音直播间/.test(_0x8e150c)) {
    return null;
  }
  const _0x156a7b = "https://www.douyin.com/video/" + _0x53c19e;
  const _0x190e11 = _0x329c4c.author || _0x329c4c.authorInfo || _0x329c4c.author_info || {};
  const _0x5c35db = String(_0x190e11.sec_uid || _0x190e11.secUid || "").trim();
  const _0x597742 = cleanNickname(_0x190e11.nickname || _0x190e11.nickName || _0x190e11.nick_name);
  const _0x54cb25 = _0x5c35db.length >= 8 && !/^(self|login)$/i.test(_0x5c35db) ? "https://www.douyin.com/user/" + _0x5c35db : "";
  const _0x282295 = _0x329c4c.statistics || _0x329c4c.stats || {};
  return {
    nickname: _0x8e150c || "抖音视频作品",
    title: _0x8e150c || "抖音视频作品",
    userUrl: _0x156a7b,
    videoUrl: _0x156a7b,
    userKey: "video:" + _0x53c19e,
    content: _0x156a7b,
    sourceType: "video",
    entrySource: "entity_video",
    entryLabel: "线索采集：视频作品链接",
    searchKeyword: String(_0x25c725 || ""),
    authorNickname: _0x597742 || "",
    authorProfileUrl: _0x54cb25,
    authorSecUid: _0x54cb25 ? _0x5c35db : "",
    likeCount: Number(_0x282295.digg_count ?? _0x282295.diggCount ?? _0x329c4c.digg_count ?? 0) || 0,
    commentCount: Number(_0x282295.comment_count ?? _0x282295.commentCount ?? _0x329c4c.comment_count ?? 0) || 0,
    collectCount: Number(_0x282295.collect_count ?? _0x282295.collectCount ?? _0x329c4c.collect_count ?? 0) || 0,
    shareCount: Number(_0x282295.share_count ?? _0x282295.shareCount ?? _0x329c4c.share_count ?? 0) || 0,
    duration: Number(_0x329c4c.duration ?? _0x329c4c.video?.duration ?? 0) || 0,
    createTime: Number(_0x329c4c.create_time ?? _0x329c4c.createTime ?? 0) || 0
  };
}
function extractEntityUsersFromResponse(_0x1a680b, _0x87b76b = "blogger", _0x4be4bb = "") {
  if (!_0x1a680b || typeof _0x1a680b !== "object") {
    return [];
  }
  const _0x1837fe = new Map();
  const _0x1bcd39 = new WeakSet();
  const _0x22f49a = (_0x68848f, _0x55f514 = {}) => {
    const _0x4255e3 = normalizeUser(_0x68848f, _0x87b76b, _0x55f514);
    if (!_0x4255e3) {
      return;
    }
    if (!_0x1837fe.has(_0x4255e3.userKey)) {
      _0x1837fe.set(_0x4255e3.userKey, _0x4255e3);
      return;
    }
    _0x1837fe.set(_0x4255e3.userKey, mergeCommentUserFields(_0x1837fe.get(_0x4255e3.userKey), _0x4255e3));
  };
  const _0x7e4d36 = _0x440ceb => {
    const _0x353da0 = normalizeVideoItem(_0x440ceb, _0x4be4bb);
    if (_0x353da0 && !_0x1837fe.has(_0x353da0.userKey)) {
      _0x1837fe.set(_0x353da0.userKey, _0x353da0);
    }
  };
  const _0x1f1b98 = (_0x5530ab, _0x449d8e = 0) => {
    if (typeof _0x5530ab === "string") {
      const _0x43a1b5 = _0x5530ab.trim();
      if (_0x43a1b5 && (_0x43a1b5[0] === "{" || _0x43a1b5[0] === "[")) {
        try {
          _0x1f1b98(JSON.parse(_0x43a1b5), _0x449d8e + 1);
        } catch (_0x4e9f0d) {}
      }
      return;
    }
    if (!_0x5530ab || typeof _0x5530ab !== "object" || _0x449d8e > 12 || _0x1bcd39.has(_0x5530ab)) {
      return;
    }
    _0x1bcd39.add(_0x5530ab);
    if (Array.isArray(_0x5530ab)) {
      _0x5530ab.forEach(_0x73a9d2 => _0x1f1b98(_0x73a9d2, _0x449d8e + 1));
      return;
    }
    const _0xe371fa = _0x5530ab.aweme_info || _0x5530ab.awemeInfo || _0x5530ab.aweme || _0x5530ab.aweme_detail;
    if (_0xe371fa && typeof _0xe371fa === "object") {
      if (_0x87b76b === "video") {
        _0x7e4d36(_0xe371fa);
      } else if (_0x87b76b === "blogger") {
        _0x22f49a(_0xe371fa.author || _0xe371fa.authorInfo || _0xe371fa.author_info);
      }
    }
    if (_0x87b76b === "video" && extractAwemeVideoId(_0x5530ab) && (_0x5530ab.desc != null || _0x5530ab.author || _0x5530ab.video)) {
      _0x7e4d36(_0x5530ab);
    }
    const _0x51c25f = _0x87b76b === "comment" ? readCommentMetaFromApiObject(_0x5530ab) : null;
    const _0x2aca2c = _0x87b76b === "comment" ? readCommentTextFromApiObject(_0x5530ab) : "";
    const _0x278db4 = _0x87b76b === "comment" && isDouyinNestedReplyComment(_0x5530ab);
    const _0x4bd9ad = _0x5530ab.user_info || _0x5530ab.userInfo;
    if (!_0x278db4 && _0x4bd9ad && typeof _0x4bd9ad === "object" && _0x87b76b !== "blogger" && _0x87b76b !== "video") {
      _0x22f49a(_0x4bd9ad, _0x51c25f ? {
        content: _0x2aca2c,
        timeText: _0x51c25f.timeText,
        ipLocation: _0x51c25f.ipLocation
      } : {
        content: _0x2aca2c
      });
    }
    if (!_0x278db4 && _0x5530ab.user && typeof _0x5530ab.user === "object" && _0x87b76b !== "blogger" && _0x87b76b !== "video") {
      _0x22f49a(_0x5530ab.user, _0x51c25f ? {
        content: _0x2aca2c || _0x5530ab.user.content || _0x5530ab.user.text || "",
        timeText: _0x51c25f.timeText,
        ipLocation: _0x51c25f.ipLocation
      } : {
        content: _0x2aca2c || _0x5530ab.user.content || _0x5530ab.user.text || ""
      });
    }
    if (!_0x278db4 && _0x87b76b !== "blogger" && _0x87b76b !== "video" && (_0x5530ab.sec_uid || _0x5530ab.secUid) && (_0x5530ab.nickname || _0x5530ab.nickName || _0x5530ab.nick_name)) {
      _0x22f49a(_0x5530ab, _0x51c25f ? {
        content: _0x2aca2c,
        timeText: _0x51c25f.timeText,
        ipLocation: _0x51c25f.ipLocation
      } : {
        content: _0x2aca2c
      });
    }
    ["data", "cards", "aweme_list", "awemeList", "business_data", "user_list", "userList", "users", "followers", "followings", "follow_list", "messages", "data", "comments", "comment", "reply_comments"].forEach(_0x4b75fc => {
      if (_0x5530ab[_0x4b75fc] == null) {
        return;
      }
      if (_0x87b76b === "comment" && !shouldWalkCommentNestedKey(_0x4b75fc, {
        includeReplies: false
      })) {
        return;
      }
      _0x1f1b98(_0x5530ab[_0x4b75fc], _0x449d8e + 1);
    });
  };
  _0x1f1b98(_0x1a680b);
  return [..._0x1837fe.values()];
}
function isInterestingResponse(_0xbfe83c, _0x4befcc) {
  const _0x40176e = String(_0xbfe83c || "");
  if (_0x4befcc === "mutual" || _0x4befcc === "following") {
    return RELATION_RESPONSE_RE.test(_0x40176e);
  }
  if (_0x4befcc === "live") {
    return LIVE_RESPONSE_RE.test(_0x40176e);
  }
  if (_0x4befcc === "comment") {
    return COMMENT_RESPONSE_RE.test(_0x40176e);
  }
  if (_0x4befcc === "video") {
    return VIDEO_RESPONSE_RE.test(_0x40176e);
  }
  return SEARCH_RESPONSE_RE.test(_0x40176e);
}
function withTimeout(_0x243f9e, _0x2acaad, _0x445876 = "timeout") {
  let _0x3b2a84 = null;
  return Promise.race([Promise.resolve(_0x243f9e), new Promise((_0x40faf5, _0x5521ad) => {
    _0x3b2a84 = setTimeout(() => _0x5521ad(new Error(_0x445876)), _0x2acaad);
  })]).finally(() => {
    if (_0x3b2a84) {
      clearTimeout(_0x3b2a84);
    }
  });
}
function createEntityLeadgenNetworkCapture(_0x28a63e) {
  const _0x3ff1e = {
    attached: false,
    attaching: null,
    sourceType: "",
    searchKeyword: "",
    sourceVideoUrl: "",
    pendingRequests: new Map(),
    users: new Map()
  };
  const _0x559290 = async (_0x557c92, _0x3b291b, _0x248e0f = {}) => {
    if (_0x3b291b === "Network.responseReceived") {
      const _0x3cf395 = _0x248e0f.response?.url || "";
      if (_0x3ff1e.sourceType && isInterestingResponse(_0x3cf395, _0x3ff1e.sourceType)) {
        _0x3ff1e.pendingRequests.set(_0x248e0f.requestId, _0x3cf395);
      }
      return;
    }
    if (_0x3b291b === "Network.loadingFailed") {
      _0x3ff1e.pendingRequests.delete(_0x248e0f.requestId);
      return;
    }
    if (_0x3b291b !== "Network.loadingFinished") {
      return;
    }
    const _0x38f090 = _0x3ff1e.pendingRequests.get(_0x248e0f.requestId);
    if (!_0x38f090) {
      return;
    }
    _0x3ff1e.pendingRequests.delete(_0x248e0f.requestId);
    try {
      const _0x4ca2f7 = await withTimeout(_0x28a63e.webContents.debugger.sendCommand("Network.getResponseBody", {
        requestId: _0x248e0f.requestId
      }), 1200, "getResponseBody timeout");
      const _0x5bd370 = _0x4ca2f7?.base64Encoded ? Buffer.from(_0x4ca2f7.body || "", "base64").toString("utf8") : String(_0x4ca2f7?.body || "");
      if (!_0x5bd370 || _0x5bd370[0] !== "{" && _0x5bd370[0] !== "[") {
        return;
      }
      const _0x5d05dc = JSON.parse(_0x5bd370);
      extractEntityUsersFromResponse(_0x5d05dc, _0x3ff1e.sourceType, _0x3ff1e.searchKeyword).forEach(_0x54be25 => {
        const _0x371b70 = canonicalizeDouyinVideoUrl(_0x54be25.videoUrl) || _0x3ff1e.sourceVideoUrl || "";
        _0x3ff1e.users.set(_0x54be25.userKey, {
          ..._0x54be25,
          searchKeyword: _0x3ff1e.searchKeyword || _0x54be25.searchKeyword || "",
          ...(_0x371b70 ? {
            videoUrl: _0x371b70
          } : {})
        });
      });
    } catch (_0x2f284a) {}
  };
  async function _0x10277e() {
    if (_0x3ff1e.attached || !_0x28a63e || _0x28a63e.isDestroyed()) {
      return _0x3ff1e.attached;
    }
    if (_0x3ff1e.attaching) {
      return _0x3ff1e.attaching;
    }
    _0x3ff1e.attaching = (async () => {
      try {
        await withTimeout((async () => {
          if (!_0x28a63e.webContents.debugger.isAttached()) {
            _0x28a63e.webContents.debugger.attach("1.3");
          }
          _0x28a63e.webContents.debugger.removeListener("message", _0x559290);
          _0x28a63e.webContents.debugger.on("message", _0x559290);
          await _0x28a63e.webContents.debugger.sendCommand("Network.enable", {
            maxTotalBufferSize: 20971520,
            maxResourceBufferSize: 5242880
          });
        })(), ATTACH_TIMEOUT_MS, "debugger attach timeout");
        _0x3ff1e.attached = true;
      } catch (_0x535782) {
        _0x3ff1e.attached = false;
        try {
          if (_0x28a63e && !_0x28a63e.isDestroyed() && _0x28a63e.webContents.debugger.isAttached()) {
            _0x28a63e.webContents.debugger.detach();
          }
        } catch (_0x40ea36) {}
      } finally {
        _0x3ff1e.attaching = null;
      }
      return _0x3ff1e.attached;
    })();
    return _0x3ff1e.attaching;
  }
  async function _0x15936d({
    sourceType: _0x4a25c1,
    searchKeyword = "",
    sourceVideoUrl = ""
  } = {}) {
    _0x3ff1e.sourceType = String(_0x4a25c1 || "");
    _0x3ff1e.searchKeyword = String(searchKeyword || "");
    _0x3ff1e.sourceVideoUrl = canonicalizeDouyinVideoUrl(sourceVideoUrl) || (_0x4a25c1 === "comment" ? canonicalizeDouyinVideoUrl(searchKeyword) : "") || "";
    _0x3ff1e.pendingRequests.clear();
    _0x3ff1e.users.clear();
    try {
      await _0x10277e();
    } catch (_0x3a5f69) {}
    return _0x3ff1e.attached;
  }
  function _0x1ce434(_0x23b266 = 0) {
    const _0x471058 = [..._0x3ff1e.users.values()];
    _0x3ff1e.users.clear();
    if (Number(_0x23b266) > 0) {
      return _0x471058.slice(0, Math.floor(Number(_0x23b266)));
    }
    return _0x471058;
  }
  function _0x4edcff(_0x2fbdd9 = "") {
    const _0x344411 = String(_0x2fbdd9 || "").trim();
    if (!_0x344411) {
      return null;
    }
    const _0xf12ab4 = extractAwemeVideoId({
      aweme_id: _0x344411
    }) || _0x344411.match(/\/(?:video|note)\/(\d{10,})/i)?.[1] || "" || (/^\d{10,}$/.test(_0x344411) ? _0x344411 : "");
    if (!_0xf12ab4) {
      return null;
    }
    const _0x29c107 = _0x3ff1e.users.get("video:" + _0xf12ab4);
    if (_0x29c107) {
      return _0x29c107;
    }
    for (const _0x10e577 of _0x3ff1e.users.values()) {
      const _0x3b39a4 = String(_0x10e577?.userKey || "");
      if (_0x3b39a4 === "video:" + _0xf12ab4) {
        return _0x10e577;
      }
      const _0x1967df = String(_0x10e577?.videoUrl || _0x10e577?.userUrl || _0x10e577?.content || "");
      if (_0x1967df.includes(_0xf12ab4)) {
        return _0x10e577;
      }
    }
    return null;
  }
  function _0x28d0f5() {
    _0x3ff1e.pendingRequests.clear();
    _0x3ff1e.users.clear();
    _0x3ff1e.attaching = null;
    if (!_0x28a63e || _0x28a63e.isDestroyed()) {
      return;
    }
    try {
      _0x28a63e.webContents.debugger.removeListener("message", _0x559290);
    } catch (_0x4a2aed) {}
    try {
      if (_0x28a63e.webContents.debugger.isAttached()) {
        _0x28a63e.webContents.debugger.detach();
      }
    } catch (_0x523d81) {}
    _0x3ff1e.attached = false;
  }
  return {
    attach: _0x10277e,
    begin: _0x15936d,
    takeUsers: _0x1ce434,
    findVideoUser: _0x4edcff,
    dispose: _0x28d0f5,
    isAttached: () => _0x3ff1e.attached
  };
}
module.exports = {
  createEntityLeadgenNetworkCapture: createEntityLeadgenNetworkCapture,
  extractEntityUsersFromResponse: extractEntityUsersFromResponse
};
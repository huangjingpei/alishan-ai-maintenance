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
function cleanNickname(arg1) {
  return String(arg1 || "").trim().replace(/^@+/, "");
}
function parseFollowerCount(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  const local = arg1.follower_count ?? arg1.followerCount ?? arg1.mplatform_followers_count ?? arg1.mplatformFollowersCount ?? arg1.fans_count ?? arg1.fansCount;
  const result = Number(local);
  if (Number.isFinite(result) && result >= 0) {
    return Math.floor(result);
  } else {
    return null;
  }
}
function normalizeUser(arg1, arg2, options = {}) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  const result = String(arg1.sec_uid || arg1.secUid || "").trim();
  const result2 = cleanNickname(arg1.nickname || arg1.nickName || arg1.nick_name);
  if (!result || result.length < 8 || !result2 || /^(self|login)$/i.test(result)) {
    return null;
  }
  const result3 = String(options.timeText || arg1.timeText || arg1.time || "").trim();
  const result4 = String(options.ipLocation || arg1.ipLocation || arg1.location || "").trim();
  const result5 = String(options.videoUrl || arg1.videoUrl || "").trim();
  return {
    secUid: result,
    userKey: result,
    nickname: result2,
    userUrl: "https://www.douyin.com/user/" + result,
    sourceType: arg2,
    followerCount: parseFollowerCount(arg1),
    content: String(options.content || arg1.content || arg1.text || "").trim(),
    timeText: result3,
    time: result3,
    ipLocation: result4,
    location: result4,
    ...(result5 ? {
      videoUrl: result5
    } : {})
  };
}
function extractAwemeVideoId(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return "";
  }
  const local = arg1.aweme_id || arg1.awemeId || arg1.group_id || arg1.groupId || arg1.item_id || arg1.itemId || arg1.aweme_id_str || arg1.id_str || arg1.id;
  const result = String(local || "").trim();
  if (/^\d{10,}$/.test(result)) {
    return result;
  } else {
    return "";
  }
}
function isLiveOrJunkSearchAweme(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return true;
  }
  const result = Number(arg1.aweme_type ?? arg1.awemeType ?? arg1.media_type ?? arg1.mediaType);
  if (result === 101 || result === 400) {
    return true;
  }
  if (arg1.live_id || arg1.liveId || arg1.room_id || arg1.roomId || arg1.is_live || arg1.isLive) {
    return true;
  }
  if (arg1.cell_type === "related_search" || arg1.card_type === "related_search") {
    return true;
  }
  const result2 = String(arg1.desc || arg1.description || arg1.title || arg1.share_info?.share_title || arg1.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim();
  if (/^(相关搜索|大家都在搜|猜你想搜)$/i.test(result2)) {
    return true;
  }
  if (/的抖音直播间|抖音直播间(?:直播)?$|正在直播|进入直播间/.test(result2)) {
    return true;
  }
  return false;
}
function normalizeVideoItem(arg1, text = "") {
  const result = extractAwemeVideoId(arg1);
  if (!result) {
    return null;
  }
  if (isLiveOrJunkSearchAweme(arg1)) {
    return null;
  }
  let result2 = String(arg1.desc || arg1.description || arg1.title || arg1.share_info?.share_title || arg1.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim().slice(0, 100);
  if (/^(相关搜索|大家都在搜|猜你想搜|视频|直播|图文)$/i.test(result2)) {
    result2 = "";
  }
  if (/的抖音直播间|抖音直播间/.test(result2)) {
    return null;
  }
  const value = "https://www.douyin.com/video/" + result;
  const local = arg1.author || arg1.authorInfo || arg1.author_info || {};
  const result3 = String(local.sec_uid || local.secUid || "").trim();
  const result4 = cleanNickname(local.nickname || local.nickName || local.nick_name);
  const value2 = result3.length >= 8 && !/^(self|login)$/i.test(result3) ? "https://www.douyin.com/user/" + result3 : "";
  const local2 = arg1.statistics || arg1.stats || {};
  return {
    nickname: result2 || "抖音视频作品",
    title: result2 || "抖音视频作品",
    userUrl: value,
    videoUrl: value,
    userKey: "video:" + result,
    content: value,
    sourceType: "video",
    entrySource: "entity_video",
    entryLabel: "线索采集：视频作品链接",
    searchKeyword: String(text || ""),
    authorNickname: result4 || "",
    authorProfileUrl: value2,
    authorSecUid: value2 ? result3 : "",
    likeCount: Number(local2.digg_count ?? local2.diggCount ?? arg1.digg_count ?? 0) || 0,
    commentCount: Number(local2.comment_count ?? local2.commentCount ?? arg1.comment_count ?? 0) || 0,
    collectCount: Number(local2.collect_count ?? local2.collectCount ?? arg1.collect_count ?? 0) || 0,
    shareCount: Number(local2.share_count ?? local2.shareCount ?? arg1.share_count ?? 0) || 0,
    duration: Number(arg1.duration ?? arg1.video?.duration ?? 0) || 0,
    createTime: Number(arg1.create_time ?? arg1.createTime ?? 0) || 0
  };
}
function extractEntityUsersFromResponse(arg1, text = "blogger", text2 = "") {
  if (!arg1 || typeof arg1 !== "object") {
    return [];
  }
  const map = new Map();
  const weakSet = new WeakSet();
  const local = (arg1, options = {}) => {
    const result = normalizeUser(arg1, text, options);
    if (!result) {
      return;
    }
    if (!map.has(result.userKey)) {
      map.set(result.userKey, result);
      return;
    }
    map.set(result.userKey, mergeCommentUserFields(map.get(result.userKey), result));
  };
  const local2 = arg1 => {
    const result = normalizeVideoItem(arg1, text2);
    if (result && !map.has(result.userKey)) {
      map.set(result.userKey, result);
    }
  };
  const local3 = (arg1, num = 0) => {
    if (typeof arg1 === "string") {
      const result = arg1.trim();
      if (result && (result[0] === "{" || result[0] === "[")) {
        try {
          local3(JSON.parse(result), num + 1);
        } catch (error) {}
      }
      return;
    }
    if (!arg1 || typeof arg1 !== "object" || num > 12 || weakSet.has(arg1)) {
      return;
    }
    weakSet.add(arg1);
    if (Array.isArray(arg1)) {
      arg1.forEach(arg1 => local3(arg1, num + 1));
      return;
    }
    const local4 = arg1.aweme_info || arg1.awemeInfo || arg1.aweme || arg1.aweme_detail;
    if (local4 && typeof local4 === "object") {
      if (text === "video") {
        local2(local4);
      } else if (text === "blogger") {
        local(local4.author || local4.authorInfo || local4.author_info);
      }
    }
    if (text === "video" && extractAwemeVideoId(arg1) && (arg1.desc != null || arg1.author || arg1.video)) {
      local2(arg1);
    }
    const value = text === "comment" ? readCommentMetaFromApiObject(arg1) : null;
    const value2 = text === "comment" ? readCommentTextFromApiObject(arg1) : "";
    const local5 = text === "comment" && isDouyinNestedReplyComment(arg1);
    const local6 = arg1.user_info || arg1.userInfo;
    if (!local5 && local6 && typeof local6 === "object" && text !== "blogger" && text !== "video") {
      local(local6, value ? {
        content: value2,
        timeText: value.timeText,
        ipLocation: value.ipLocation
      } : {
        content: value2
      });
    }
    if (!local5 && arg1.user && typeof arg1.user === "object" && text !== "blogger" && text !== "video") {
      local(arg1.user, value ? {
        content: value2 || arg1.user.content || arg1.user.text || "",
        timeText: value.timeText,
        ipLocation: value.ipLocation
      } : {
        content: value2 || arg1.user.content || arg1.user.text || ""
      });
    }
    if (!local5 && text !== "blogger" && text !== "video" && (arg1.sec_uid || arg1.secUid) && (arg1.nickname || arg1.nickName || arg1.nick_name)) {
      local(arg1, value ? {
        content: value2,
        timeText: value.timeText,
        ipLocation: value.ipLocation
      } : {
        content: value2
      });
    }
    ["data", "cards", "aweme_list", "awemeList", "business_data", "user_list", "userList", "users", "followers", "followings", "follow_list", "messages", "data", "comments", "comment", "reply_comments"].forEach(arg12 => {
      if (arg1[arg12] == null) {
        return;
      }
      if (text === "comment" && !shouldWalkCommentNestedKey(arg12, {
        includeReplies: false
      })) {
        return;
      }
      local3(arg1[arg12], num + 1);
    });
  };
  local3(arg1);
  return [...map.values()];
}
function isInterestingResponse(arg1, arg2) {
  const result = String(arg1 || "");
  if (arg2 === "mutual" || arg2 === "following") {
    return RELATION_RESPONSE_RE.test(result);
  }
  if (arg2 === "live") {
    return LIVE_RESPONSE_RE.test(result);
  }
  if (arg2 === "comment") {
    return COMMENT_RESPONSE_RE.test(result);
  }
  if (arg2 === "video") {
    return VIDEO_RESPONSE_RE.test(result);
  }
  return SEARCH_RESPONSE_RE.test(result);
}
function withTimeout(arg1, arg2, text = "timeout") {
  let local = null;
  return Promise.race([Promise.resolve(arg1), new Promise((arg1, arg22) => {
    local = setTimeout(() => arg22(new Error(text)), arg2);
  })]).finally(() => {
    if (local) {
      clearTimeout(local);
    }
  });
}
function createEntityLeadgenNetworkCapture(arg1) {
  const obj = {
    attached: false,
    attaching: null,
    sourceType: "",
    searchKeyword: "",
    sourceVideoUrl: "",
    pendingRequests: new Map(),
    users: new Map()
  };
  const local = async (arg12, arg2, options = {}) => {
    if (arg2 === "Network.responseReceived") {
      const local = options.response?.url || "";
      if (obj.sourceType && isInterestingResponse(local, obj.sourceType)) {
        obj.pendingRequests.set(options.requestId, local);
      }
      return;
    }
    if (arg2 === "Network.loadingFailed") {
      obj.pendingRequests.delete(options.requestId);
      return;
    }
    if (arg2 !== "Network.loadingFinished") {
      return;
    }
    const result = obj.pendingRequests.get(options.requestId);
    if (!result) {
      return;
    }
    obj.pendingRequests.delete(options.requestId);
    try {
      const result = await withTimeout(arg1.webContents.debugger.sendCommand("Network.getResponseBody", {
        requestId: options.requestId
      }), 1200, "getResponseBody timeout");
      const value = result?.base64Encoded ? Buffer.from(result.body || "", "base64").toString("utf8") : String(result?.body || "");
      if (!value || value[0] !== "{" && value[0] !== "[") {
        return;
      }
      const result2 = JSON.parse(value);
      extractEntityUsersFromResponse(result2, obj.sourceType, obj.searchKeyword).forEach(arg1 => {
        const local = canonicalizeDouyinVideoUrl(arg1.videoUrl) || obj.sourceVideoUrl || "";
        obj.users.set(arg1.userKey, {
          ...arg1,
          searchKeyword: obj.searchKeyword || arg1.searchKeyword || "",
          ...(local ? {
            videoUrl: local
          } : {})
        });
      });
    } catch (error) {}
  };
  async function attach() {
    if (obj.attached || !arg1 || arg1.isDestroyed()) {
      return obj.attached;
    }
    if (obj.attaching) {
      return obj.attaching;
    }
    obj.attaching = (async () => {
      try {
        await withTimeout((async () => {
          if (!arg1.webContents.debugger.isAttached()) {
            arg1.webContents.debugger.attach("1.3");
          }
          arg1.webContents.debugger.removeListener("message", local);
          arg1.webContents.debugger.on("message", local);
          await arg1.webContents.debugger.sendCommand("Network.enable", {
            maxTotalBufferSize: 20971520,
            maxResourceBufferSize: 5242880
          });
        })(), ATTACH_TIMEOUT_MS, "debugger attach timeout");
        obj.attached = true;
      } catch (error) {
        obj.attached = false;
        try {
          if (arg1 && !arg1.isDestroyed() && arg1.webContents.debugger.isAttached()) {
            arg1.webContents.debugger.detach();
          }
        } catch (error) {}
      } finally {
        obj.attaching = null;
      }
      return obj.attached;
    })();
    return obj.attaching;
  }
  async function begin({
    sourceType: sourceType,
    searchKeyword = "",
    sourceVideoUrl = ""
  } = {}) {
    obj.sourceType = String(sourceType || "");
    obj.searchKeyword = String(searchKeyword || "");
    obj.sourceVideoUrl = canonicalizeDouyinVideoUrl(sourceVideoUrl) || (sourceType === "comment" ? canonicalizeDouyinVideoUrl(searchKeyword) : "") || "";
    obj.pendingRequests.clear();
    obj.users.clear();
    try {
      await attach();
    } catch (error) {}
    return obj.attached;
  }
  function takeUsers(num = 0) {
    const list = [...obj.users.values()];
    obj.users.clear();
    if (Number(num) > 0) {
      return list.slice(0, Math.floor(Number(num)));
    }
    return list;
  }
  function findVideoUser(text = "") {
    const result = String(text || "").trim();
    if (!result) {
      return null;
    }
    const local = extractAwemeVideoId({
      aweme_id: result
    }) || result.match(/\/(?:video|note)\/(\d{10,})/i)?.[1] || "" || (/^\d{10,}$/.test(result) ? result : "");
    if (!local) {
      return null;
    }
    const result2 = obj.users.get("video:" + local);
    if (result2) {
      return result2;
    }
    for (const item of obj.users.values()) {
      const result = String(item?.userKey || "");
      if (result === "video:" + local) {
        return item;
      }
      const result2 = String(item?.videoUrl || item?.userUrl || item?.content || "");
      if (result2.includes(local)) {
        return item;
      }
    }
    return null;
  }
  function dispose() {
    obj.pendingRequests.clear();
    obj.users.clear();
    obj.attaching = null;
    if (!arg1 || arg1.isDestroyed()) {
      return;
    }
    try {
      arg1.webContents.debugger.removeListener("message", local);
    } catch (error) {}
    try {
      if (arg1.webContents.debugger.isAttached()) {
        arg1.webContents.debugger.detach();
      }
    } catch (error) {}
    obj.attached = false;
  }
  return {
    attach: attach,
    begin: begin,
    takeUsers: takeUsers,
    findVideoUser: findVideoUser,
    dispose: dispose,
    isAttached: () => obj.attached
  };
}
module.exports = {
  createEntityLeadgenNetworkCapture: createEntityLeadgenNetworkCapture,
  extractEntityUsersFromResponse: extractEntityUsersFromResponse
};
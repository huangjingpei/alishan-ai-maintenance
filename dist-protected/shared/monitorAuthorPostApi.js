'use strict';

const AUTHOR_POST_RESPONSE_RE = /\/aweme\/v1\/web\/aweme\/post(?:\/|\?|$)|\/aweme\/v1\/web\/aweme\/post\b/i;
function extractAwemeId(arg1) {
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
function isJunkAweme(arg1) {
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
  return false;
}
function isAuthorPostWorkPinned(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return false;
  }
  const local = arg1 => arg1 === true || arg1 === 1 || arg1 === "1" || arg1 === "true";
  if (local(arg1.is_top) || local(arg1.isTop) || local(arg1.is_top_v2) || local(arg1.isTopV2)) {
    return true;
  }
  const local2 = arg1.status || arg1.aweme_status || arg1.awemeStatus;
  if (local2 && typeof local2 === "object") {
    if (local(local2.is_top) || local(local2.isTop) || local(local2.is_top_v2)) {
      return true;
    }
  }
  const result = String(arg1.label_top_text || arg1.labelTopText || arg1.top_text || arg1.topText || "").trim();
  return result === "置顶";
}
function cleanTitle(arg1, text = "", num = 0) {
  let result = String(arg1.desc || arg1.description || arg1.title || arg1.share_info?.share_title || arg1.shareInfo?.shareTitle || "").replace(/\s+/g, " ").trim();
  if (/^(相关搜索|大家都在搜|猜你想搜|视频|直播|图文)$/i.test(result)) {
    result = "";
  }
  if (/的抖音直播间|抖音直播间/.test(result)) {
    result = "";
  }
  if (!result) {
    result = (text || "主播") + "的新作品 " + (num + 1);
  }
  return result.slice(0, 120);
}
function extractAwemeAuthorSecUid(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return "";
  }
  const local = arg1.author || arg1.authorInfo || arg1.author_info || {};
  return String(local.sec_uid || local.secUid || local.sec_user_id || local.secUserId || "").trim();
}
function extractAwemeCreateTime(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return 0;
  }
  const result = Number(arg1.create_time ?? arg1.createTime ?? arg1.create_time_ms ?? arg1.createTimeMs ?? 0);
  if (!Number.isFinite(result) || result <= 0) {
    return 0;
  }
  if (result < 1000000000000) {
    return Math.floor(result * 1000);
  }
  return Math.floor(result);
}
function normalizeAuthorPostWork(arg1, {
  authorName = "",
  rank = 1,
  expectedSecUid = ""
} = {}) {
  const result = extractAwemeId(arg1);
  if (!result || isJunkAweme(arg1)) {
    return null;
  }
  const local = arg1.author || arg1.authorInfo || arg1.author_info || {};
  const result2 = extractAwemeAuthorSecUid(arg1);
  const result3 = String(expectedSecUid || "").trim();
  if (result3 && result2 && result2 !== result3) {
    return null;
  }
  const result4 = String(authorName || local.nickname || local.nickName || local.nick_name || "").trim();
  const result5 = extractAwemeCreateTime(arg1);
  return {
    url: "https://www.douyin.com/video/" + result,
    awemeId: result,
    title: cleanTitle(arg1, result4, rank - 1),
    authorName: result4,
    authorSecUid: result2 || result3 || "",
    createTime: result5,
    rank: rank,
    source: "author_post_api"
  };
}
function extractAuthorPostWorksFromResponse(arg1, {
  maxWorks = 6,
  authorName = "",
  expectedSecUid = "",
  filterPinned = false
} = {}) {
  const result = Math.max(1, Math.min(100, Math.floor(Number(maxWorks) || 6)));
  const value = filterPinned === true;
  const list = [];
  const set = new Set();
  let local = null;
  let result2 = String(authorName || "").trim();
  let flag = false;
  const weakSet = new WeakSet();
  const result3 = String(expectedSecUid || "").trim();
  const local2 = arg1 => {
    if (list.length >= result) {
      return;
    }
    if (value && isAuthorPostWorkPinned(arg1)) {
      return;
    }
    const result4 = normalizeAuthorPostWork(arg1, {
      authorName: result2,
      rank: list.length + 1,
      expectedSecUid: result3
    });
    if (!result4 || set.has(result4.awemeId)) {
      return;
    }
    set.add(result4.awemeId);
    list.push(result4);
    if (!result2 && result4.authorName) {
      result2 = result4.authorName;
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
    if (!arg1 || typeof arg1 !== "object" || num > 10 || weakSet.has(arg1)) {
      return;
    }
    weakSet.add(arg1);
    if (Array.isArray(arg1)) {
      if (arg1.length > 0 && arg1.some(arg1 => arg1 && extractAwemeId(arg1))) {
        flag = true;
        arg1.forEach(arg1 => local2(arg1));
      } else {
        arg1.forEach(arg1 => local3(arg1, num + 1));
      }
      return;
    }
    if (arg1.aweme_list != null || arg1.awemeList != null) {
      flag = true;
      local3(arg1.aweme_list ?? arg1.awemeList, num + 1);
    }
    const local4 = arg1.aweme_count ?? arg1.awemeCount ?? arg1.total_aweme ?? arg1.totalAweme ?? arg1.publish_count ?? arg1.publishCount ?? arg1.user?.aweme_count ?? arg1.user?.awemeCount ?? arg1.user_info?.aweme_count ?? arg1.userInfo?.aweme_count;
    const result = Number(local4);
    if (Number.isFinite(result) && result >= 0 && local == null) {
      local = Math.floor(result);
    }
    const local5 = arg1.author || arg1.user || arg1.user_info || arg1.userInfo;
    if (local5 && typeof local5 === "object" && !result2) {
      const result = String(local5.nickname || local5.nickName || local5.nick_name || "").trim();
      if (result) {
        result2 = result;
      }
    }
    ["data", "cards", "aweme_list", "awemeList", "business_data", "aweme_detail", "awemeDetail", "user", "user_info", "userInfo"].forEach(arg12 => {
      if (arg1[arg12] != null) {
        local3(arg1[arg12], num + 1);
      }
    });
  };
  local3(arg1);
  if (local == null && flag) {
    local = list.length;
  }
  return {
    works: list,
    worksCount: local,
    authorName: result2,
    hasPostListPayload: flag
  };
}
function isAuthorPostApiUrl(arg1) {
  return AUTHOR_POST_RESPONSE_RE.test(String(arg1 || ""));
}
function extractSecUserIdFromAuthorPostApiUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  try {
    const url = new URL(result);
    return String(url.searchParams.get("sec_user_id") || url.searchParams.get("sec_uid") || "").trim();
  } catch (error) {
    const result2 = result.match(/[?&](?:sec_user_id|sec_uid)=([^&#]+)/i);
    if (!result2?.[1]) {
      return "";
    }
    try {
      return decodeURIComponent(result2[1]).trim();
    } catch (error) {
      return String(result2[1] || "").trim();
    }
  }
}
function isAuthorPostApiUrlForSecUid(arg1, arg2) {
  if (!isAuthorPostApiUrl(arg1)) {
    return false;
  }
  const result = String(arg2 || "").trim();
  if (!result) {
    return true;
  }
  const result2 = extractSecUserIdFromAuthorPostApiUrl(arg1);
  return !!result2 && result2 === result;
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
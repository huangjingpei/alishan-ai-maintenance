const leadTouch = require("./leadTouch");
const {
  getDouyinCommentId,
  buildDouyinCommentLocateUrl
} = require("./processedVideoKey");
function isDouyinSecUid(arg1) {
  if (!arg1 || typeof arg1 !== "string") {
    return false;
  }
  const result = arg1.trim();
  if (result.length < 15) {
    return false;
  }
  if (["self", "login", "anonymous", "undefined", "null"].includes(result.toLowerCase())) {
    return false;
  }
  if (result.startsWith("name:") || result.startsWith("live_")) {
    return false;
  }
  return /^[A-Za-z0-9_\-]+$/.test(result);
}
function extractUserKeyFromUrl(arg1) {
  if (!arg1 || typeof arg1 !== "string") {
    return "";
  }
  try {
    let result = arg1.trim();
    if (result.startsWith("//")) {
      result = "https:" + result;
    }
    if (!result.startsWith("http")) {
      result = "https://www.douyin.com" + (result.startsWith("/") ? result : "/" + result);
    }
    const url = new URL(result);
    const result2 = url.pathname.match(/\/user\/([^/?#]+)/i);
    if (result2 && result2[1]) {
      const result = decodeURIComponent(result2[1]);
      if (isDouyinSecUid(result)) {
        return result;
      }
    }
  } catch (error) {}
  return "";
}
function normalizeUserProfileUrl(arg1) {
  if (!arg1) {
    return "";
  }
  try {
    const url = new URL(arg1.startsWith("http") ? arg1 : "https://www.douyin.com" + (arg1.startsWith("/") ? arg1 : "/" + arg1));
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch (error) {
    return arg1;
  }
}
function normalizeDouyinUid(arg1) {
  const result = String(arg1 || "").trim();
  if (/^\d{5,24}$/.test(result) && !/^0+$/.test(result) && result !== "111111") {
    return result;
  } else {
    return "";
  }
}
function normalizeDouyinWebcastUid(arg1) {
  const result = String(arg1 || "").trim();
  if (result.length >= 15 && result !== "111111" && /^[A-Za-z0-9_-]+$/.test(result)) {
    return result;
  } else {
    return "";
  }
}
function isVideoLeadRecord(arg1) {
  if (!arg1) {
    return false;
  }
  if (arg1.leadKind === "video_card" || arg1.sourceType === "video" || arg1.identityType === "video") {
    return true;
  }
  const result = String(arg1.leadId || arg1.userKey || arg1.key || "").trim();
  if (/^video:\d{10,}$/.test(result)) {
    return true;
  }
  const result2 = String(arg1.userUrl || "").trim();
  return /(?:video|note)\/\d{10,}/i.test(result2);
}
function resolveLeadSourceVideoUrl(arg1) {
  if (!arg1) {
    return "";
  }
  const list = [arg1.videoUrl, isVideoLeadRecord(arg1) ? arg1.url : "", arg1.url];
  for (const item of list) {
    const result = String(item || "").trim();
    if (!result) {
      continue;
    }
    if (/\/user\//i.test(result) && !/(?:video|note)\/\d{10,}/i.test(result) && !/modal_id=\d{10,}/i.test(result)) {
      continue;
    }
    const local = result.match(/(?:video|note)\/(\d{10,})/i) || result.match(/modal_id=(\d{10,})/i) || result.match(/aweme_id=(\d{10,})/i);
    if (local?.[1]) {
      return "https://www.douyin.com/video/" + local[1];
    }
  }
  return "";
}
function getLeadCommentId(arg1) {
  return getDouyinCommentId(arg1 || {});
}
function buildLeadCommentLocateUrl(arg1) {
  const result = resolveLeadSourceVideoUrl(arg1);
  if (!result) {
    return "";
  }
  return buildDouyinCommentLocateUrl(result, getLeadCommentId(arg1));
}
function canLocateLeadComment(arg1) {
  if (!arg1 || isVideoLeadRecord(arg1)) {
    return false;
  }
  return !!resolveLeadSourceVideoUrl(arg1);
}
function isCommentSectionLead(arg1) {
  if (!arg1 || isVideoLeadRecord(arg1)) {
    return false;
  }
  const result = String(arg1.entrySource || "").trim();
  if (["import", "entity_blogger", "entity_user", "entity_live", "entity_following", "entity_mutual", "entity_video"].includes(result)) {
    return false;
  }
  if (["search", "follow", "recommend", "like", "specific", "entity_comment"].includes(result)) {
    return true;
  }
  const result2 = String(arg1.taskId || "");
  if (result2 === "import_uid" || result2.startsWith("import_")) {
    return false;
  }
  if (result2.startsWith("entity_") && result !== "entity_comment") {
    return false;
  }
  const value = (arg1.entryLabel || "") + " " + (arg1.taskName || "");
  if (/评论获客|评论区潜客|评论区/.test(value)) {
    return true;
  }
  const local = !!getLeadCommentId(arg1) || !!String(arg1.content || arg1.comment || arg1.commentText || "").trim();
  if (result === "monitor" || result2.startsWith("monitor_") || /监控/.test(value)) {
    return local && !!resolveLeadSourceVideoUrl(arg1);
  }
  if (!result && (arg1.searchKeyword || arg1.taskName) && local && resolveLeadSourceVideoUrl(arg1)) {
    return true;
  }
  return !!getLeadCommentId(arg1) && !!resolveLeadSourceVideoUrl(arg1) && !!local;
}
function canInteractLeadComment(arg1) {
  return isCommentSectionLead(arg1) && !!resolveLeadSourceVideoUrl(arg1);
}
function resolveLeadLocateAccountId(options = {}, list = []) {
  const value = Array.isArray(list) ? list : [];
  const result = String(options.accountId || options.account_id || "").trim();
  if (result && value.some(arg1 => String(arg1.id) === result)) {
    return result;
  }
  const result2 = String(options.accountName || options.account || "").trim().toLowerCase();
  if (result2) {
    const result = value.find(arg1 => {
      const result = String(arg1.nickname || arg1.name || "").trim().toLowerCase();
      return result && result === result2;
    });
    if (result) {
      return String(result.id);
    }
  }
  if (value[0]) {
    return String(value[0].id);
  } else {
    return "";
  }
}
function extractVideoLeadKey(arg1) {
  if (!isVideoLeadRecord(arg1)) {
    return "";
  }
  const result = String(arg1.leadId || arg1.userKey || arg1.key || "").trim();
  if (/^video:\d{10,}$/.test(result)) {
    return result;
  }
  const result2 = String(arg1.userUrl || "").match(/(?:video|note)\/(\d{10,})/i);
  if (result2?.[1]) {
    return "video:" + result2[1];
  }
  const result3 = String(arg1.videoUrl || arg1.url || arg1.content || "").trim();
  const result4 = result3.match(/(?:video|note)\/(\d{10,})/i);
  if (result4?.[1]) {
    return "video:" + result4[1];
  }
  return "";
}
function getPersonLeadSecUid(arg1) {
  if (!arg1) {
    return "";
  }
  if (isVideoLeadRecord(arg1)) {
    return "";
  }
  const result = String(arg1.secUid || arg1.sec_uid || "").trim();
  if (isDouyinSecUid(result)) {
    return result;
  }
  const result2 = normalizeDouyinWebcastUid(arg1.webcastUid || arg1.webcast_uid || arg1.webcast_uid_str);
  const result3 = extractUserKeyFromUrl(arg1.userUrl || arg1.authorProfileUrl || "");
  if (result2 && result3 && result3 === result2) {
    return "";
  }
  if (arg1.privacyMasked || arg1.identityType === "webcast") {
    if (result3 && result3 !== result2 && isDouyinSecUid(result3)) {
      return result3;
    }
    return "";
  }
  if (result3) {
    return result3;
  }
  const result4 = String(arg1.userKey || "").trim();
  if (isDouyinSecUid(result4)) {
    return result4;
  }
  const result5 = String(arg1.leadId || arg1.key || "").trim();
  if (isDouyinSecUid(result5)) {
    return result5;
  }
  return "";
}
function getLeadUserKey(arg1) {
  if (!arg1) {
    return "";
  }
  if (arg1.leadKind === "collected_author" || arg1.identityType === "author") {
    try {
      const {
        toCollectedAuthorKey: toCollectedAuthorKey,
        resolveAuthorSecUidFromLead: resolveAuthorSecUidFromLead
      } = require("./collectedLeadKeys");
      const result = resolveAuthorSecUidFromLead(arg1);
      if (result) {
        return toCollectedAuthorKey(result);
      }
    } catch (error) {}
    const result = String(arg1.leadId || arg1.key || "").trim();
    if (/^author:/.test(result)) {
      return result;
    }
  }
  const result = extractVideoLeadKey(arg1);
  if (result) {
    return result;
  }
  if (arg1.leadKind === "video_card" && arg1.leadId) {
    return String(arg1.leadId);
  }
  const result2 = getPersonLeadSecUid(arg1);
  if (result2) {
    return result2;
  }
  const result3 = normalizeDouyinWebcastUid(arg1.webcastUid || arg1.webcast_uid || arg1.webcast_uid_str);
  if (result3) {
    return "webcast:" + result3;
  }
  const result4 = normalizeDouyinUid(arg1.uid || arg1.id_str || arg1.idStr || arg1.user_id);
  if (result4) {
    return "uid:" + result4;
  }
  const result5 = String(arg1.userKey || "").trim();
  if (/^uid:\d{5,24}$/.test(result5) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(result5)) {
    return result5;
  }
  const result6 = String(arg1.leadId || arg1.key || "").trim();
  if (/^uid:\d{5,24}$/.test(result6) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(result6) || /^video:\d{10,}$/.test(result6)) {
    return result6;
  }
  return "";
}
function buildLeadId(arg1) {
  const result = getPersonLeadSecUid(arg1);
  if (result) {
    return result;
  }
  const result2 = extractVideoLeadKey(arg1);
  if (result2) {
    return result2;
  }
  const result3 = (arg1?.nickname || "").trim();
  const result4 = (arg1?.content || "").trim();
  if (result3 && result4) {
    return result3 + "_" + result4;
  }
  if (result3) {
    return result3;
  }
  return "unknown_" + Date.now();
}
function isTransientLeadIdentityKey(arg1) {
  const result = String(arg1 || "").trim();
  return /^uid:\d{5,24}$/.test(result) || /^webcast:[A-Za-z0-9_-]{15,}$/.test(result);
}
function mergeLeadRecords(arg1, arg2) {
  if (!arg1 || !arg2) {
    return arg1;
  }
  const flag = !isVideoLeadRecord(arg1);
  const result = getLeadUserKey(arg2);
  const result2 = getLeadUserKey(arg1);
  const value = flag && result2 && /^video:\d{10,}$/.test(String(result)) ? result2 : result || result2;
  if (value) {
    const result = /^video:\d{10,}$/.test(String(value));
    if (!flag || !result) {
      arg1.leadId = value;
      arg1.key = value;
    }
  }
  const result3 = normalizeDouyinWebcastUid(arg2.webcastUid || arg2.webcast_uid || arg2.webcast_uid_str);
  if (arg2.userUrl && !result3 && !arg1.userUrl) {
    const result = /(?:video|note)\/\d{10,}/i.test(String(arg2.userUrl));
    if (!result || isVideoLeadRecord(arg1)) {
      arg1.userUrl = arg2.userUrl;
    }
  }
  if (arg2.uid) {
    arg1.uid = String(arg2.uid);
  }
  if (arg2.secUid || arg2.sec_uid) {
    arg1.secUid = String(arg2.secUid || arg2.sec_uid);
  }
  if (result3) {
    arg1.webcastUid = result3;
  }
  if (result3 && !arg1.secUid) {
    arg1.userUrl = "";
  }
  if (arg2.privacyMasked != null) {
    arg1.privacyMasked = !!arg2.privacyMasked;
  }
  if (arg2.identityType) {
    arg1.identityType = String(arg2.identityType);
  }
  if (arg2.profileAvailable != null) {
    arg1.profileAvailable = !!arg2.profileAvailable;
  }
  if (arg2.profileUnavailable != null) {
    arg1.profileUnavailable = !!arg2.profileUnavailable;
  }
  if (arg2.profileUnavailableReason) {
    arg1.profileUnavailableReason = String(arg2.profileUnavailableReason);
  }
  if (arg2.userGone != null) {
    arg1.userGone = !!arg2.userGone;
  }
  if (arg2.noWorks || arg2.skipReason === "作品数为0") {
    arg1.noWorks = true;
    if (arg2.skipReason) {
      arg1.lastBatchSkipReason = arg2.skipReason;
    }
  }
  if (arg2.isPrivate !== undefined) {
    arg1.isPrivate = !!arg2.isPrivate;
  }
  if (arg2.worksCount !== undefined && arg2.worksCount !== null) {
    arg1.worksCount = arg2.worksCount;
    if (Number(arg2.worksCount) === 0) {
      arg1.noWorks = true;
    }
  }
  if (arg2.liveUrl) {
    arg1.liveUrl = arg2.liveUrl;
  }
  if (arg2.nickname) {
    const local = arg1 => {
      const result = extractUserKeyFromUrl(arg1?.userUrl);
      if (result) {
        return result;
      }
      const result2 = String(arg1?.secUid || arg1?.sec_uid || "").trim();
      if (isDouyinSecUid(result2)) {
        return result2;
      }
      const result3 = String(arg1?.leadId || arg1?.key || "").trim();
      if (isDouyinSecUid(result3)) {
        return result3;
      }
      return "";
    };
    const result = local(arg2);
    const result2 = local(arg1);
    if (!arg1.nickname) {
      arg1.nickname = arg2.nickname;
    } else if (!result2) {
      arg1.nickname = arg2.nickname;
    } else if (result && result === result2) {
      arg1.nickname = arg2.nickname;
    }
  }
  if (arg2.platform) {
    arg1.platform = arg2.platform;
  }
  if (arg2.leadKind === "video_card") {
    if (isVideoLeadRecord(arg1)) {
      arg1.leadKind = "video_card";
      arg1.videoUrl = arg2.videoUrl || arg2.url || arg1.videoUrl;
      arg1.url = arg2.videoUrl || arg2.url || arg1.url;
      arg1.title = arg2.title || arg1.title;
      arg1.authorProfileUrl = arg2.authorProfileUrl || arg2.userUrl || arg1.authorProfileUrl;
      if (arg2.authorProfileUrl || arg2.userUrl) {
        arg1.userUrl = arg2.authorProfileUrl || arg2.userUrl;
      }
    } else {
      const result = resolveLeadSourceVideoUrl(arg2);
      if (result) {
        arg1.videoUrl = arg1.videoUrl || result;
      }
      if (arg2.title && !arg1.title) {
        arg1.title = arg2.title;
      }
      if (arg2.authorProfileUrl) {
        arg1.authorProfileUrl = arg2.authorProfileUrl;
      }
    }
    arg1.collectedFields = [...new Set([...(Array.isArray(arg1.collectedFields) ? arg1.collectedFields : []), ...(Array.isArray(arg2.collectedFields) ? arg2.collectedFields : [])])];
  }
  const local = arg2.timestamp || arg2.capturedAt || 0;
  const local2 = arg1.timestamp || arg1.capturedAt || 0;
  const local3 = arg1 => {
    if (!arg1) {
      return "";
    }
    for (const item of [arg1.content, arg1.comment, arg1.commentContent, arg1.userComment, arg1.commentText]) {
      const result = String(item ?? "").trim();
      if (result) {
        return result;
      }
    }
    return "";
  };
  const result4 = local3(arg2);
  const result5 = local3(arg1);
  if (result4 && (!result5 || local >= local2)) {
    arg1.content = result4;
    arg1.title = arg2.title || arg1.title;
    arg1.timeText = arg2.timeText || arg1.timeText;
    arg1.ipLocation = arg2.ipLocation || arg2.location || arg1.ipLocation || arg1.location || "";
    const result = resolveLeadSourceVideoUrl(arg2);
    if (result) {
      arg1.videoUrl = arg1.videoUrl || result;
    }
    if (resolveLeadSourceVideoUrl({
      url: arg2.url,
      videoUrl: ""
    })) {
      arg1.url = arg2.url || arg1.url;
    }
  } else {
    if (!arg1.timeText && arg2.timeText) {
      arg1.timeText = arg2.timeText;
    }
    if (!arg1.ipLocation && !arg1.location && (arg2.ipLocation || arg2.location)) {
      arg1.ipLocation = arg2.ipLocation || arg2.location;
    }
  }
  if (arg2.excludedCommentKeyword && local >= local2) {
    arg1.isHighIntention = false;
    arg1.excludedCommentKeyword = arg2.excludedCommentKeyword;
  } else if (arg2.isHighIntention) {
    arg1.isHighIntention = true;
  }
  if (arg2.aiThought) {
    arg1.aiThought = arg2.aiThought;
  }
  if (arg2.thought) {
    arg1.thought = arg2.thought;
  }
  if (arg2.gender) {
    arg1.gender = arg2.gender;
  }
  if (arg2.douyinId) {
    arg1.douyinId = arg2.douyinId;
  }
  if (arg2.signature) {
    arg1.signature = arg2.signature;
  }
  if (arg2.contact) {
    arg1.contact = arg2.contact;
  }
  const result6 = getLeadCommentId(arg2);
  const result7 = getLeadCommentId(arg1);
  if (result6 && (!result7 || local >= local2)) {
    arg1.cid = result6;
    arg1.commentId = result6;
  }
  if (arg2.entrySource) {
    arg1.entrySource = arg2.entrySource;
  }
  if (arg2.entryLabel) {
    arg1.entryLabel = arg2.entryLabel;
  }
  if (arg2.searchKeyword !== undefined) {
    arg1.searchKeyword = arg2.searchKeyword;
  }
  if (arg2.worksCount !== undefined && arg2.worksCount !== null) {
    arg1.worksCount = arg2.worksCount;
  }
  if (arg2.accountName) {
    const result = String(arg2.accountName || "").trim();
    const set = new Set(["主账号", "默认账号", "本账号", "未知账号", "已登录(待识别)"]);
    const result2 = String(arg1.accountName || "").trim();
    if (result && (!set.has(result) || !result2 || !!set.has(result2))) {
      arg1.accountName = arg2.accountName;
    }
  }
  if (arg2.accountId) {
    arg1.accountId = arg2.accountId;
  }
  const local4 = arg1 => {
    if (!arg1 || typeof arg1 !== "object") {
      return "";
    }
    const result = String(arg1.messageId || arg1.msgId || "").trim();
    if (result) {
      return "id:" + result;
    }
    return [arg1.method || arg1.type || "", arg1.occurredAt || arg1.observedAt || "", arg1.content || arg1.text || ""].join("|");
  };
  const list = [...(Array.isArray(arg1.liveEvents) ? arg1.liveEvents : []), ...(arg1.liveEvent ? [arg1.liveEvent] : []), ...(Array.isArray(arg2.liveEvents) ? arg2.liveEvents : []), ...(arg2.liveEvent ? [arg2.liveEvent] : [])];
  if (list.length) {
    const map = new Map();
    list.forEach(arg1 => {
      const result = local4(arg1);
      if (result && !map.has(result)) {
        map.set(result, arg1);
      }
    });
    arg1.liveEvents = [...map.values()].sort((arg1, arg2) => Number(arg1.occurredAt || arg1.observedAt || 0) - Number(arg2.occurredAt || arg2.observedAt || 0)).slice(-500);
    arg1.liveEvent = arg1.liveEvents[arg1.liveEvents.length - 1] || arg2.liveEvent || arg1.liveEvent;
    arg1.messageId = String(arg1.liveEvent?.messageId || arg2.messageId || arg1.messageId || "");
    const result = Number(arg1.liveEvents[0]?.occurredAt || arg1.liveEvents[0]?.observedAt || 0);
    const result2 = Number(arg1.liveEvent?.occurredAt || arg1.liveEvent?.observedAt || 0);
    if (result > 0) {
      arg1.firstSeenAt = arg1.firstSeenAt ? Math.min(Number(arg1.firstSeenAt), result) : result;
    }
    if (result2 > 0) {
      arg1.lastSeenAt = Math.max(Number(arg1.lastSeenAt || 0), result2);
    }
    if (arg1.liveEvent?.content) {
      arg1.content = arg1.liveEvent.content;
    }
  }
  if (local >= local2) {
    if (arg2.taskId) {
      arg1.taskId = arg2.taskId;
    }
    if (arg2.taskName) {
      arg1.taskName = arg2.taskName;
    }
    arg1.timestamp = local || arg1.timestamp;
    arg1.capturedAt = arg2.capturedAt || arg1.capturedAt;
  }
  if (Array.isArray(arg2.touchLog) && arg2.touchLog.length) {
    arg1.touchLog = leadTouch.mergeTouchLogs(arg1.touchLog || [], arg2.touchLog);
    leadTouch.recountTouchCountsAfterMerge(arg1);
  } else if (arg2.touchCounts) {
    arg1.touchCounts = arg1.touchCounts || {};
    Object.keys(arg2.touchCounts).forEach(arg12 => {
      arg1.touchCounts[arg12] = Math.max(arg1.touchCounts[arg12] || 0, arg2.touchCounts[arg12] || 0);
    });
    leadTouch.recountTouchCountsAfterMerge(arg1);
  }
  if (arg2.profileCommentAt) {
    arg1.profileCommentAt = Number(arg2.profileCommentAt);
  }
  if (arg2.lastTouchAt) {
    arg1.lastTouchAt = Math.max(Number(arg1.lastTouchAt || 0), Number(arg2.lastTouchAt || 0));
  }
  if (arg2.liked || arg2.actions?.liked) {
    arg1.liked = true;
  }
  if (arg2.replied || arg2.actions?.replied) {
    arg1.replied = true;
  }
  if (arg2.followed || arg2.actions?.followed) {
    arg1.followed = true;
  }
  if (arg2.followStatus) {
    arg1.followStatus = arg2.followStatus;
  }
  if (arg2.followRequested !== undefined) {
    arg1.followRequested = !!arg2.followRequested;
  }
  if (arg2.followRequestSent !== undefined) {
    arg1.followRequestSent = !!arg2.followRequestSent;
  }
  if (arg2.followIsPrivate !== undefined) {
    arg1.followIsPrivate = !!arg2.followIsPrivate;
  }
  if (arg2.followError) {
    arg1.followError = arg2.followError;
  }
  if (arg2.messaged || arg2.actions?.messaged) {
    arg1.messaged = true;
  }
  if (arg2.dmContent) {
    arg1.dmContent = arg2.dmContent;
    arg1.actions = {
      ...(arg1.actions || {}),
      dmContent: arg2.dmContent
    };
  }
  if (arg2.replyContent) {
    arg1.replyContent = arg2.replyContent;
    arg1.actions = {
      ...(arg1.actions || {}),
      replyContent: arg2.replyContent
    };
  }
  if (arg2.actions) {
    arg1.actions = {
      ...(arg1.actions || {}),
      ...arg2.actions
    };
  }
  return arg1;
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
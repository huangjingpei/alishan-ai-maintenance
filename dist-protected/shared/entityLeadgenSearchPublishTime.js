'use strict';

const {
  normalizeAwemeCreateTimeMs
} = require("./entityBloggerProfileSelect");
const {
  parseDouyinRelativePublishTimeMs
} = require("./douyinVideoPublishTime");
function officialSearchPublishTimeToDays(arg1) {
  const result = String(arg1 || "0").trim();
  if (result === "1") {
    return 1;
  }
  if (result === "2") {
    return 7;
  }
  if (result === "3") {
    return 180;
  }
  return 0;
}
function extractVideoIdFromUser(options = {}) {
  const result = String(options.videoUrl || options.userUrl || options.content || options.userKey || options.leadId || "").trim();
  const result2 = result.match(/(\d{10,})/);
  if (result2) {
    return result2[1];
  }
  const result3 = String(options.userKey || options.leadId || "");
  if (result3.startsWith("video:")) {
    return result3.slice(6);
  } else {
    return "";
  }
}
function enrichVideoPublishTime(options = {}, arg2 = Date.now()) {
  const local = String(options.publishTimeText || "").trim() || (/卡片采集|实体获客|线索采集/.test(String(options.timeText || "")) ? "" : String(options.timeText || "").trim());
  const result = normalizeAwemeCreateTimeMs(options.publishTime ?? options.createTime ?? options.create_time ?? 0);
  const result2 = parseDouyinRelativePublishTimeMs(local, arg2);
  const local2 = result || result2 || 0;
  return {
    ...options,
    createTime: local2 || options.createTime || 0,
    publishTime: local2 || 0,
    publishTimeText: local
  };
}
function buildVideoPublishTimeLogJson(options = {}, arg2 = Date.now()) {
  const result = enrichVideoPublishTime(options, arg2);
  const local = Number(result.publishTime) || 0;
  return {
    videoId: extractVideoIdFromUser(result),
    title: String(result.title || result.nickname || "").slice(0, 80),
    publishTimeMs: local || 0,
    publishTimeText: String(result.publishTimeText || ""),
    publishTimeIso: local ? new Date(local).toISOString() : "",
    ageHours: local ? Math.round((arg2 - local) / 3600000) : null
  };
}
function isOutsideOfficialSearchPublishBucket(options = {}, text = "0", arg3 = Date.now()) {
  const result = String(text || "0").trim();
  if (result === "0") {
    return false;
  }
  const result2 = enrichVideoPublishTime(options, arg3);
  const result3 = String(result2.publishTimeText || "").replace(/\s+/g, "");
  const local = Number(result2.publishTime) || 0;
  const value = local > 0 ? arg3 - local : 0;
  if (/(\d+)\s*年前/.test(result3)) {
    return true;
  }
  if (result === "1") {
    if (/(\d+)\s*周前|(\d+)\s*个?月前/.test(result3)) {
      return true;
    }
    const result = result3.match(/(\d{1,3})天前/);
    if (result && Number(result[1]) >= 2) {
      return true;
    }
    if (/前天/.test(result3)) {
      return true;
    }
    if (value > 172800000) {
      return true;
    }
    return false;
  }
  if (result === "2") {
    if (/(\d+)\s*个?月前/.test(result3)) {
      return true;
    }
    const result = result3.match(/(\d{1,2})周前/);
    if (result && Number(result[1]) >= 2) {
      return true;
    }
    const result2 = result3.match(/(\d{1,3})天前/);
    if (result2 && Number(result2[1]) >= 8) {
      return true;
    }
    if (value > 691200000) {
      return true;
    }
    return false;
  }
  if (result === "3") {
    const result = result3.match(/(\d{1,2})个?月前/);
    if (result && Number(result[1]) >= 7) {
      return true;
    }
    if (value > 17280000000) {
      return true;
    }
    return false;
  }
  return false;
}
function filterVideosByOfficialSearchPublishTime(list = [], text = "0", arg3 = Date.now()) {
  const result = (Array.isArray(list) ? list : []).map(arg1 => enrichVideoPublishTime(arg1, arg3));
  if (String(text || "0") === "0") {
    return {
      kept: result,
      dropped: []
    };
  }
  const list2 = [];
  const list3 = [];
  result.forEach(arg1 => {
    if (isOutsideOfficialSearchPublishBucket(arg1, text, arg3)) {
      list3.push(arg1);
    } else {
      list2.push(arg1);
    }
  });
  return {
    kept: list2,
    dropped: list3
  };
}
module.exports = {
  officialSearchPublishTimeToDays: officialSearchPublishTimeToDays,
  enrichVideoPublishTime: enrichVideoPublishTime,
  buildVideoPublishTimeLogJson: buildVideoPublishTimeLogJson,
  isOutsideOfficialSearchPublishBucket: isOutsideOfficialSearchPublishBucket,
  filterVideosByOfficialSearchPublishTime: filterVideosByOfficialSearchPublishTime
};
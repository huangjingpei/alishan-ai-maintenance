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
function mapEntityUserFanApiValue(arg1) {
  const result = String(arg1 == null ? "0" : arg1);
  return USER_FAN_API_VALUES[result] || "";
}
function mapEntityUserTypeApiValue(arg1) {
  const result = String(arg1 == null ? "0" : arg1);
  return USER_TYPE_API_VALUES[result] || "";
}
function buildEntityUserSearchFilterSelected(arg1, arg2) {
  const result = mapEntityUserFanApiValue(arg1);
  const result2 = mapEntityUserTypeApiValue(arg2);
  if (!result && !result2) {
    return null;
  }
  const obj = {};
  if (result) {
    obj.douyin_user_fans = result;
  }
  if (result2) {
    obj.douyin_user_type = result2;
  }
  return obj;
}
function buildDouyinSearchUrl(arg1, arg2) {
  return buildDouyinSearchUrlFromPack(arg1, arg2);
}
function buildEntitySearchModalUrl(arg1, text = "", arg3) {
  const result = String(arg1 || "").trim();
  const local = result.match(/(?:video|note)\/(\d{6,30})/i) || result.match(/[?&]modal_id=(\d{6,30})/i) || result.match(/^(\d{6,30})$/);
  const local2 = local?.[1] || "";
  if (!local2) {
    return "";
  }
  const result2 = buildDouyinSearchUrl(text, arg3);
  try {
    const url = new URL(result2);
    url.searchParams.set("modal_id", local2);
    return url.toString();
  } catch (error) {
    const result = encodeURIComponent(String(text || "").trim());
    if (result) {
      return "https://www.douyin.com/search/" + result + "?modal_id=" + local2;
    } else {
      return "https://www.douyin.com/search/?modal_id=" + local2;
    }
  }
}
function buildDouyinUserSearchUrl(arg1, options = {}) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "https://www.douyin.com/search";
  }
  const uRLSearchParams = new URLSearchParams();
  uRLSearchParams.set("type", "user");
  const result2 = buildEntityUserSearchFilterSelected(options.userFanCount, options.userTypeFilter);
  if (result2) {
    uRLSearchParams.set("is_filter_search", "1");
    uRLSearchParams.set("filter_selected", JSON.stringify(result2));
    if (result2.douyin_user_fans) {
      uRLSearchParams.set("douyin_user_fans", result2.douyin_user_fans);
    }
    if (result2.douyin_user_type) {
      uRLSearchParams.set("douyin_user_type", result2.douyin_user_type);
    }
  }
  return "https://www.douyin.com/search/" + encodeURIComponent(result) + "?" + uRLSearchParams.toString();
}
function extractDouyinLiveWebRid(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (/^\d{6,24}$/.test(result)) {
    return result;
  }
  try {
    const url = new URL(/^https?:\/\//i.test(result) ? result : "https://" + result);
    const result2 = url.pathname.match(/^\/(\d{6,24})\/?$/);
    if (/live\.douyin\.com$/i.test(url.hostname) && result2?.[1]) {
      return result2[1];
    }
    for (const item of ["web_rid", "webRid"]) {
      const result = url.searchParams.get(item);
      if (result && /^\d{6,24}$/.test(result)) {
        return result;
      }
    }
  } catch (error) {}
  const result2 = result.match(/live\.douyin\.com\/(\d{6,24})/i);
  if (result2?.[1]) {
    return result2[1];
  }
  return "";
}
function extractDouyinLiveReflowRoomId(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  try {
    const url = new URL(/^https?:\/\//i.test(result) ? result : "https://" + result);
    const result2 = url.pathname.match(/\/(?:webcast\/)?reflow\/(\d{6,24})/i);
    if (result2?.[1]) {
      return result2[1];
    }
    for (const item of ["room_id", "roomId"]) {
      const result = url.searchParams.get(item);
      if (result && /^\d{6,24}$/.test(result)) {
        return result;
      }
    }
  } catch (error) {}
  const result2 = result.match(/\/(?:webcast\/)?reflow\/(\d{6,24})/i);
  if (result2?.[1]) {
    return result2[1];
  }
  return "";
}
function extractDouyinLiveRoomId(arg1) {
  return extractDouyinLiveWebRid(arg1) || extractDouyinLiveReflowRoomId(arg1);
}
function isDouyinLiveReflowUrl(arg1) {
  return !!extractDouyinLiveReflowRoomId(arg1) || /webcast\.amemv\.com/i.test(String(arg1 || "")) || /\/webcast\/reflow\//i.test(String(arg1 || ""));
}
function isDouyinLiveRoomUrl(arg1) {
  return !!extractDouyinLiveWebRid(arg1) || isDouyinLiveReflowUrl(arg1);
}
function isEntityLiveUrlCandidate(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  if (isDouyinLiveRoomUrl(result)) {
    return true;
  }
  return /v\.douyin\.com/i.test(result) || /iesdouyin\.com\/share/i.test(result);
}
function buildDouyinLiveUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = extractDouyinLiveWebRid(result);
  if (result2) {
    return "https://live.douyin.com/" + result2;
  }
  const result3 = extractDouyinLiveReflowRoomId(result);
  if (result3) {
    return "https://webcast.amemv.com/douyin/webcast/reflow/" + result3;
  }
  if (!/^https?:\/\//i.test(result)) {
    return "https://" + result;
  }
  try {
    const url = new URL(result);
    return "" + url.origin + url.pathname.replace(/\/$/, "");
  } catch (error) {
    return result;
  }
}
function parseEntityLiveUrls(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return [];
  }
  const result2 = result.split(/[\n,，;；]+/).map(arg1 => arg1.trim()).filter(Boolean);
  const list = [];
  const set = new Set();
  const local = arg1 => {
    const result = String(arg1 || "").trim();
    if (!result || !isEntityLiveUrlCandidate(result) || set.has(result)) {
      return;
    }
    set.add(result);
    list.push(result);
  };
  for (const item of result2) {
    if (/^\d{6,24}$/.test(item) || /^https?:\/\//i.test(item) && !/\s/.test(item)) {
      local(item);
      continue;
    }
    const result = extractDouyinUrlsFromText(item);
    if (result.length) {
      const result2 = result.find(arg1 => isDouyinLiveRoomUrl(arg1));
      if (result2) {
        local(result2);
        continue;
      }
      const result3 = result.find(arg1 => /v\.douyin\.com|iesdouyin\.com\/share/i.test(arg1));
      if (result3) {
        local(result3);
        continue;
      }
      result.forEach(local);
      continue;
    }
    const result2 = item.match(/(?:^|[^\d])(\d{6,24})(?:$|[^\d])/);
    if (result2?.[1]) {
      local(result2[1]);
    }
  }
  return list;
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
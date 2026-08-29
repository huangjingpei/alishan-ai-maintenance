const http = require("http");
const https = require("https");
const {
  extractDouyinVideoId
} = require("./processedVideoKey");
const {
  isDouyinAuthorProfileUrl,
  normalizeDouyinAuthorUrl
} = require("./douyinAuthorUrl");
const {
  pickDouyinUrlFromText
} = require("./douyinShareText");
const {
  isDouyinLiveReflowUrl,
  buildDouyinLiveUrl,
  extractDouyinLiveWebRid,
  extractDouyinLiveReflowRoomId
} = require("./entityLeadgenUrls");
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const DEFAULT_RESOLVE_CONCURRENCY = 6;
const resolveCache = new Map();
const inflightResolves = new Map();
function isDouyinShortShareUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  return /v\.douyin\.com/i.test(result) || /iesdouyin\.com\/share/i.test(result) || /^https?:\/\/douyin\.com\//i.test(result);
}
function isDouyinNotePath(arg1) {
  return /\/(?:share\/)?note\/\d+/i.test(String(arg1 || ""));
}
function toCanonicalDouyinVideoUrl(arg1) {
  const result = extractDouyinVideoId(arg1);
  if (!result) {
    return "";
  }
  if (isDouyinNotePath(arg1)) {
    return "https://www.douyin.com/note/" + result;
  }
  return "https://www.douyin.com/video/" + result;
}
function normalizeRequestUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (result.startsWith("//")) {
    return "https:" + result;
  }
  if (/^https?:\/\//i.test(result)) {
    return result;
  }
  return "https://" + result;
}
function fetchRedirectLocation(arg1, arg2 = DEFAULT_USER_AGENT, text = "HEAD") {
  return new Promise(arg12 => {
    let local;
    try {
      local = new URL(normalizeRequestUrl(arg1));
    } catch (error) {
      arg12(null);
      return;
    }
    const value = local.protocol === "https:" ? https : http;
    const result = value.request({
      hostname: local.hostname,
      port: local.port || (local.protocol === "https:" ? 443 : 80),
      path: "" + local.pathname + local.search,
      method: text,
      headers: {
        "User-Agent": arg2,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    }, arg13 => {
      arg13.resume();
      if (arg13.statusCode >= 300 && arg13.statusCode < 400 && arg13.headers.location) {
        try {
          arg12(new URL(arg13.headers.location, arg1).href);
        } catch (error) {
          arg12(null);
        }
        return;
      }
      arg12(null);
    });
    result.on("error", () => arg12(null));
    result.setTimeout(12000, () => {
      result.destroy();
    });
    result.end();
  });
}
function finalizeResolvedShareUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (isDouyinAuthorProfileUrl(result)) {
    return normalizeDouyinAuthorUrl(result) || result;
  }
  const result2 = extractDouyinLiveWebRid(result);
  if (result2) {
    return "https://live.douyin.com/" + result2;
  }
  if (isDouyinLiveReflowUrl(result)) {
    return buildDouyinLiveUrl(result) || result;
  }
  return toCanonicalDouyinVideoUrl(result) || result;
}
function fetchTextBody(arg1, arg2 = DEFAULT_USER_AGENT) {
  return new Promise(arg12 => {
    let local;
    try {
      local = new URL(normalizeRequestUrl(arg1));
    } catch (error) {
      arg12("");
      return;
    }
    const value = local.protocol === "https:" ? https : http;
    const result = value.request({
      hostname: local.hostname,
      port: local.port || (local.protocol === "https:" ? 443 : 80),
      path: "" + local.pathname + local.search,
      method: "GET",
      headers: {
        "User-Agent": arg2,
        Accept: "application/json,text/html,*/*;q=0.8",
        Referer: "https://live.douyin.com/"
      }
    }, arg1 => {
      const list = [];
      arg1.on("data", arg1 => list.push(arg1));
      arg1.on("end", () => {
        arg12(Buffer.concat(list).toString("utf8"));
      });
    });
    result.on("error", () => arg12(""));
    result.setTimeout(12000, () => {
      result.destroy();
      arg12("");
    });
    result.end();
  });
}
function pickWebRidFromReflowInfoBody(arg1) {
  const result = String(arg1 || "");
  if (!result) {
    return "";
  }
  try {
    const result2 = JSON.parse(result);
    const local = result2?.data?.room || {};
    const result3 = String(local?.owner?.web_rid || local?.owner?.webRid || "").trim();
    if (/^\d{6,24}$/.test(result3)) {
      return result3;
    }
    const result4 = String(local?.web_rid || local?.webRid || "").trim();
    if (/^\d{6,24}$/.test(result4)) {
      return result4;
    }
    const result5 = String(result2?.data?.user?.web_rid || result2?.data?.user?.webRid || "").trim();
    if (/^\d{6,24}$/.test(result5)) {
      return result5;
    }
  } catch (error) {}
  const result2 = result.match(/"web_rid"\s*:\s*"(\d{6,24})"/);
  return result2?.[1] || "";
}
async function resolveLiveUrlFromReflowRoomId(arg1, arg2 = DEFAULT_USER_AGENT) {
  const result = String(arg1 || "").trim();
  if (!/^\d{6,24}$/.test(result)) {
    return "";
  }
  const value = "https://webcast.amemv.com/webcast/room/reflow/info/?type_id=0&live_id=1&room_id=" + encodeURIComponent(result) + "&app_id=1128";
  const result2 = await fetchTextBody(value, arg2);
  const result3 = pickWebRidFromReflowInfoBody(result2);
  if (result3) {
    return "https://live.douyin.com/" + result3;
  } else {
    return "";
  }
}
async function finalizeResolvedShareUrlAsync(arg1, arg2 = DEFAULT_USER_AGENT) {
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
    const result2 = await resolveLiveUrlFromReflowRoomId(result3, arg2);
    if (result2) {
      return result2;
    }
    return buildDouyinLiveUrl(result) || result;
  }
  return finalizeResolvedShareUrl(result);
}
async function followDouyinShareRedirects(arg1, arg2 = DEFAULT_USER_AGENT) {
  let result = normalizeRequestUrl(arg1);
  if (!result) {
    return "";
  }
  const set = new Set();
  for (let num = 0; num < 10; num += 1) {
    if (extractDouyinLiveWebRid(result) || isDouyinAuthorProfileUrl(result) || toCanonicalDouyinVideoUrl(result)) {
      return finalizeResolvedShareUrlAsync(result, arg2);
    }
    if (isDouyinLiveReflowUrl(result)) {
      return finalizeResolvedShareUrlAsync(result, arg2);
    }
    if (set.has(result)) {
      break;
    }
    set.add(result);
    let result2 = await fetchRedirectLocation(result, arg2, "HEAD");
    if (!result2) {
      result2 = await fetchRedirectLocation(result, arg2, "GET");
    }
    if (!result2 || result2 === result) {
      break;
    }
    result = result2;
  }
  return finalizeResolvedShareUrlAsync(result, arg2);
}
async function mapWithConcurrency(arg1, arg2, arg3) {
  const value = Array.isArray(arg1) ? arg1 : [];
  const array = new Array(value.length);
  let num = 0;
  const result = Math.max(1, Math.min(Number(arg2) || 1, value.length || 1));
  async function fn() {
    while (num < value.length) {
      const local = num;
      num += 1;
      array[local] = await arg3(value[local], local);
    }
  }
  await Promise.all(Array.from({
    length: result
  }, () => fn()));
  return array;
}
async function resolveDouyinShareUrl(arg1, options = {}) {
  const result = pickDouyinUrlFromText(arg1);
  const result2 = String(result || "").trim();
  if (!result2) {
    return "";
  }
  const result3 = resolveCache.get(result2);
  if (result3) {
    return result3;
  }
  if (isDouyinAuthorProfileUrl(result2)) {
    const result = normalizeDouyinAuthorUrl(result2);
    resolveCache.set(result2, result);
    return result;
  }
  const result4 = extractDouyinLiveWebRid(result2);
  if (result4) {
    const value = "https://live.douyin.com/" + result4;
    resolveCache.set(result2, value);
    return value;
  }
  const result5 = toCanonicalDouyinVideoUrl(result2);
  if (result5) {
    resolveCache.set(result2, result5);
    return result5;
  }
  const local = options.userAgent || DEFAULT_USER_AGENT;
  if (isDouyinLiveReflowUrl(result2)) {
    const result = inflightResolves.get(result2);
    if (result) {
      return result;
    }
    const result3 = (async () => {
      const result = await finalizeResolvedShareUrlAsync(result2, local);
      resolveCache.set(result2, result);
      return result;
    })().finally(() => {
      if (inflightResolves.get(result2) === result3) {
        inflightResolves.delete(result2);
      }
    });
    inflightResolves.set(result2, result3);
    return result3;
  }
  if (!isDouyinShortShareUrl(result2)) {
    const local = finalizeResolvedShareUrl(result2) || result2;
    resolveCache.set(result2, local);
    return local;
  }
  const result6 = inflightResolves.get(result2);
  if (result6) {
    return result6;
  }
  const result7 = (async () => {
    const result = await followDouyinShareRedirects(result2, local);
    const local2 = (await finalizeResolvedShareUrlAsync(result, local)) || result || result2;
    resolveCache.set(result2, local2);
    return local2;
  })().finally(() => {
    if (inflightResolves.get(result2) === result7) {
      inflightResolves.delete(result2);
    }
  });
  inflightResolves.set(result2, result7);
  return result7;
}
async function resolveDouyinShareUrls(list = [], options = {}) {
  const value = Array.isArray(list) ? list : [list];
  const result = Math.max(1, Number(options.concurrency) || DEFAULT_RESOLVE_CONCURRENCY);
  return mapWithConcurrency(value, result, arg1 => resolveDouyinShareUrl(arg1, options));
}
async function resolveDouyinSpecifiedUrlsText(arg1, options = {}) {
  const result = String(arg1 || "").split(/[\n,，]+/).map(arg1 => arg1.trim()).filter(Boolean);
  if (result.length === 0) {
    return "";
  }
  const result2 = await resolveDouyinShareUrls(result, options);
  return result2.join("\n");
}
module.exports = {
  DEFAULT_RESOLVE_CONCURRENCY: DEFAULT_RESOLVE_CONCURRENCY,
  isDouyinShortShareUrl: isDouyinShortShareUrl,
  isDouyinNotePath: isDouyinNotePath,
  toCanonicalDouyinVideoUrl: toCanonicalDouyinVideoUrl,
  resolveLiveUrlFromReflowRoomId: resolveLiveUrlFromReflowRoomId,
  resolveDouyinShareUrl: resolveDouyinShareUrl,
  resolveDouyinShareUrls: resolveDouyinShareUrls,
  resolveDouyinSpecifiedUrlsText: resolveDouyinSpecifiedUrlsText
};
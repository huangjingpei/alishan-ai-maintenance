function extractDouyinVideoId(arg1) {
  if (!arg1) {
    return "";
  }
  const result = String(arg1).trim();
  try {
    let local = result;
    if (local.startsWith("//")) {
      local = "https:" + local;
    }
    if (!/^https?:\/\//i.test(local)) {
      local = "https://www.douyin.com" + (local.startsWith("/") ? local : "/" + local);
    }
    const url = new URL(local);
    const local2 = url.searchParams.get("modal_id") || url.searchParams.get("vid") || url.searchParams.get("aweme_id");
    if (local2 && /^\d+$/.test(local2)) {
      return local2;
    }
    const result2 = url.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (result2?.[1]) {
      return result2[1];
    }
  } catch (error) {}
  const result2 = result.match(/(?:share\/)?(?:video|note)\/(\d{15,})|modal_id=(\d{15,})|vid=(\d{15,})|aweme_id=(\d{15,})/);
  if (result2) {
    return result2[1] || result2[2] || result2[3] || result2[4] || "";
  } else {
    return "";
  }
}
function normalizeProcessedVideoKey(arg1) {
  const result = extractDouyinVideoId(arg1);
  if (result) {
    return "https://www.douyin.com/video/" + result;
  }
  if (!arg1) {
    return "";
  }
  try {
    const url = new URL(String(arg1).trim().startsWith("http") ? arg1 : "https://" + arg1);
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch (error) {
    return String(arg1).trim();
  }
}
function processedVideoKeysMatch(arg1, arg2) {
  const result = normalizeProcessedVideoKey(arg1);
  const result2 = normalizeProcessedVideoKey(arg2);
  if (result && result2) {
    return result === result2;
  }
  return String(arg1 || "").trim() === String(arg2 || "").trim();
}
function rememberProcessedVideoKey(arg1, arg2) {
  if (!arg1 || !arg2) {
    return;
  }
  arg1.add(arg2);
  const result = normalizeProcessedVideoKey(arg2);
  if (result && result !== arg2) {
    arg1.add(result);
  }
}
function hasProcessedVideoKey(arg1, arg2) {
  if (!arg1 || !arg2) {
    return false;
  }
  if (arg1.has(arg2)) {
    return true;
  }
  const result = normalizeProcessedVideoKey(arg2);
  return !!result && !!arg1.has(result);
}
function forgetProcessedVideoKey(arg1, arg2) {
  if (!arg1 || !arg2) {
    return;
  }
  arg1.delete(arg2);
  const result = normalizeProcessedVideoKey(arg2);
  if (result) {
    arg1.delete(result);
  }
  const result2 = extractDouyinVideoId(arg2);
  if (!result2) {
    return;
  }
  for (const item of [...arg1]) {
    if (extractDouyinVideoId(item) === result2) {
      arg1.delete(item);
    }
  }
}
function initProcessedVideoSet(arg1) {
  const set = new Set();
  if (Array.isArray(arg1)) {
    arg1.forEach(arg1 => rememberProcessedVideoKey(set, arg1));
  }
  return set;
}
function toDouyinJingxuanUrl(arg1) {
  const local = extractDouyinVideoId(arg1) || (typeof arg1 === "string" && /^\d{15,20}$/.test(arg1.trim()) ? arg1.trim() : "");
  if (local) {
    return "https://www.douyin.com/jingxuan?modal_id=" + local;
  }
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (/^https?:\/\//i.test(result)) {
    return result;
  }
  return "https://" + result;
}
function extractCommentIdFromUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  try {
    let local = result;
    if (local.startsWith("//")) {
      local = "https:" + local;
    }
    if (!/^https?:\/\//i.test(local)) {
      local = "https://" + local;
    }
    const result2 = new URL(local).searchParams.get("comment_id");
    if (result2 && /^\d{5,}$/.test(result2)) {
      return result2;
    }
  } catch (error) {}
  const result2 = result.match(/[?&]comment_id=(\d{5,})/i);
  if (result2) {
    return result2[1];
  } else {
    return "";
  }
}
function getDouyinCommentId(options = {}) {
  if (options == null) {
    return "";
  }
  if (typeof options === "string" || typeof options === "number") {
    const result = String(options).trim();
    if (/^\d{5,}$/.test(result)) {
      return result;
    }
    return extractCommentIdFromUrl(result);
  }
  const list = [options.commentId, options.cid, options.comment_id, options.commentCid, options.comment?.cid, options.comment?.comment_id, options.comment?.commentId];
  for (const item of list) {
    const result = String(item || "").trim();
    if (/^\d{5,}$/.test(result)) {
      return result;
    }
  }
  return extractCommentIdFromUrl(options.videoUrl || options.url || options.commentUrl || "");
}
function buildDouyinCommentLocateUrl(arg1, arg2 = null) {
  const result = toDouyinJingxuanUrl(arg1);
  if (!result) {
    return "";
  }
  const local = String(arg2 ?? "").trim() || (arg1 && typeof arg1 === "object" ? getDouyinCommentId(arg1) : "") || extractCommentIdFromUrl(arg1);
  if (!local) {
    return result;
  }
  try {
    const url = new URL(result);
    url.searchParams.set("comment_id", local);
    return url.toString();
  } catch (error) {
    const value = result.includes("?") ? "&" : "?";
    return "" + result + value + "comment_id=" + encodeURIComponent(local);
  }
}
function canonicalizeDouyinVideoUrl(arg1) {
  const local = extractDouyinVideoId(arg1) || (typeof arg1 === "string" && /^\d{15,20}$/.test(String(arg1).trim()) ? String(arg1).trim() : "");
  if (local) {
    return "https://www.douyin.com/video/" + local;
  } else {
    return "";
  }
}
module.exports = {
  extractDouyinVideoId: extractDouyinVideoId,
  toDouyinJingxuanUrl: toDouyinJingxuanUrl,
  getDouyinCommentId: getDouyinCommentId,
  buildDouyinCommentLocateUrl: buildDouyinCommentLocateUrl,
  canonicalizeDouyinVideoUrl: canonicalizeDouyinVideoUrl,
  normalizeProcessedVideoKey: normalizeProcessedVideoKey,
  processedVideoKeysMatch: processedVideoKeysMatch,
  rememberProcessedVideoKey: rememberProcessedVideoKey,
  hasProcessedVideoKey: hasProcessedVideoKey,
  forgetProcessedVideoKey: forgetProcessedVideoKey,
  initProcessedVideoSet: initProcessedVideoSet
};
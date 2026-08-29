function compactText(arg1) {
  return String(arg1 || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
function isWeakSelfWarmupCommentText(arg1) {
  const result = compactText(arg1);
  if (!result) {
    return true;
  }
  const result2 = result.replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/赞了你的(?:作品|视频|评论|动态)?|点赞了你的(?:作品|视频|评论|动态)?|回复了你(?:的评论)?|评论了你的(?:作品|视频|评论|动态)?/g, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, "").trim();
  return result2.length < 2;
}
function normalizeName(arg1) {
  return compactText(arg1).replace(/^@+/, "").toLowerCase();
}
function normalizeEventContent(arg1) {
  let result = compactText(arg1);
  result = result.replace(/(?:\s*[·•]\s*|\s+)(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/u, "").replace(/\s+\d+(?:\+)?$/, "").trim();
  return result;
}
function buildSelfWarmupEventSeenKey(options = {}) {
  const result = normalizeName(options.nickname);
  const result2 = String(options.accountId || "");
  const local = options.eventType || "unknown";
  if (local === "follow" || local === "like") {
    const local2 = result || (options.userUrl ? String(options.userUrl).split("?")[0] : "unknown");
    return [result2, local, local2].join("|");
  }
  const local2 = result || (options.userUrl ? String(options.userUrl).split("?")[0] : "");
  const result3 = normalizeEventContent(options.text);
  return [result2, local, local2, result3.slice(0, 100)].join("|");
}
function escapeRegExp(arg1) {
  return String(arg1 || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeSelfWarmupNoticeMergeContent(options = {}) {
  const result = compactText(options.nickname).replace(/^@+/, "");
  let result2 = compactText(options.text || options.notificationRowText || "");
  if (result) {
    result2 = result2.replace(new RegExp("^@?" + escapeRegExp(result) + "\\s*", "i"), "");
  }
  return result2.replace(/(?:评论了你的(?:作品|视频|评论|动态)?|回复了你(?:的评论)?|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞了你的(?:作品|视频|评论|动态)?|喜欢了你的(?:作品|视频|评论|动态)?)/g, " ").replace(/(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/u, " ").replace(/\s+/g, " ").trim();
}
function buildSelfWarmupNoticeMergeKey(options = {}) {
  const local = options.eventType || "unknown";
  if (local === "follow" || local === "like") {
    return buildSelfWarmupEventSeenKey(options);
  }
  const result = String(options.accountId || "");
  const local2 = normalizeName(options.nickname) || (options.userUrl ? String(options.userUrl).split("?")[0] : "");
  const result2 = String(options.commentId || options.cid || options.comment_id || "").trim();
  const result3 = normalizeSelfWarmupNoticeMergeContent(options);
  if (result3) {
    return [result, local, local2, result3.slice(0, 100)].join("|");
  }
  return [result, local, local2, result2 ? "cid:" + result2 : ""].join("|");
}
function pickNonEmpty(...restArgs) {
  for (const item of restArgs) {
    const result = String(item || "").trim();
    if (result) {
      return result;
    }
  }
  return "";
}
function mergeSelfWarmupNoticeEvents(list = []) {
  const map = new Map();
  for (const item of list) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const result = buildSelfWarmupNoticeMergeKey(item);
    const result2 = map.get(result);
    if (!result2) {
      map.set(result, {
        ...item
      });
      continue;
    }
    const result3 = pickNonEmpty(result2.commentId, item.commentId, result2.cid, item.cid, result2.comment_id, item.comment_id);
    map.set(result, {
      ...result2,
      ...item,
      nickname: pickNonEmpty(result2.nickname, item.nickname),
      userUrl: pickNonEmpty(result2.userUrl, item.userUrl),
      videoUrl: pickNonEmpty(result2.videoUrl, item.videoUrl),
      commentId: result3,
      cid: result3,
      comment_id: result3,
      text: pickNonEmpty(result2.text, item.text),
      notificationRowText: pickNonEmpty(result2.notificationRowText, item.notificationRowText)
    });
  }
  return Array.from(map.values());
}
module.exports = {
  compactText: compactText,
  normalizeName: normalizeName,
  isWeakSelfWarmupCommentText: isWeakSelfWarmupCommentText,
  normalizeEventContent: normalizeEventContent,
  normalizeSelfWarmupNoticeMergeContent: normalizeSelfWarmupNoticeMergeContent,
  buildSelfWarmupEventSeenKey: buildSelfWarmupEventSeenKey,
  buildSelfWarmupNoticeMergeKey: buildSelfWarmupNoticeMergeKey,
  mergeSelfWarmupNoticeEvents: mergeSelfWarmupNoticeEvents
};
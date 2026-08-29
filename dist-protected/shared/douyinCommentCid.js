function looksLikeDouyinCommentCid(arg1) {
  const result = String(arg1 || "").trim();
  if (/^\d{10,}$/.test(result)) {
    return result;
  } else {
    return "";
  }
}
function extractDouyinCommentCidFromNode(arg1) {
  if (!arg1) {
    return "";
  }
  try {
    const list = ["data-cid", "data-comment-id", "data-id"];
    for (const item of list) {
      const result = looksLikeDouyinCommentCid(arg1.getAttribute?.(item));
      if (result) {
        return result;
      }
    }
    const local = arg1.querySelector?.("[data-cid], [data-comment-id]");
    if (local) {
      const result = looksLikeDouyinCommentCid(local.getAttribute("data-cid") || local.getAttribute("data-comment-id"));
      if (result) {
        return result;
      }
    }
    const local2 = arg1 => {
      if (!arg1 || typeof arg1 !== "object") {
        return "";
      }
      const result = looksLikeDouyinCommentCid(arg1.cid || arg1.commentId || arg1.comment_id);
      if (result) {
        return result;
      }
      if (arg1.comment && typeof arg1.comment === "object") {
        return looksLikeDouyinCommentCid(arg1.comment.cid || arg1.comment.comment_id || arg1.comment.commentId);
      }
      return "";
    };
    const result = Object.keys(arg1);
    for (const item of result) {
      if (!item.startsWith("__reactFiber") && !item.startsWith("__reactInternalInstance") && !item.startsWith("__reactProps")) {
        continue;
      }
      let value = arg1[item];
      for (let num = 0; num < 14 && value; num += 1) {
        const result = local2(value.memoizedProps);
        if (result) {
          return result;
        }
        const result2 = local2(value.pendingProps);
        if (result2) {
          return result2;
        }
        value = value.return;
      }
    }
  } catch (error) {}
  return "";
}
function summarizeDouyinCommentListPayload(arg1, arg2) {
  const value = arg2 && typeof arg2 === "object" ? arg2.comments || arg2.data?.comments || arg2.comment_list || [] : [];
  const value2 = Array.isArray(value) ? value : [];
  const list = [];
  for (const item of value2) {
    const result = looksLikeDouyinCommentCid(item?.cid || item?.comment_id || item?.commentId);
    if (result && !list.includes(result)) {
      list.push(result);
    }
  }
  let text = "";
  try {
    const url = new URL(String(arg1 || ""), "https://www.douyin.com");
    text = String(url.searchParams.get("aweme_id") || "").trim();
  } catch (error) {}
  return {
    url: String(arg1 || ""),
    ts: Date.now(),
    awemeId: text,
    cids: list,
    count: value2.length
  };
}
module.exports = {
  looksLikeDouyinCommentCid: looksLikeDouyinCommentCid,
  extractDouyinCommentCidFromNode: extractDouyinCommentCidFromNode,
  summarizeDouyinCommentListPayload: summarizeDouyinCommentListPayload
};
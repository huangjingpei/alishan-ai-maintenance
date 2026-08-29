'use strict';

function parseMaybeJson(arg1) {
  if (!arg1) {
    return null;
  }
  if (typeof arg1 === "object") {
    return arg1;
  }
  if (typeof arg1 !== "string") {
    return null;
  }
  const result = arg1.trim();
  if (!result.startsWith("{") && !result.startsWith("[")) {
    return null;
  }
  try {
    return JSON.parse(result);
  } catch (error) {
    return null;
  }
}
function isAwemeId(arg1) {
  return /^\d{15,}$/.test(String(arg1 || "").trim());
}
function collectNoticeItems(arg1) {
  const list = [];
  const set = new Set();
  const local = arg1 => {
    if (!arg1 || typeof arg1 !== "object" || set.has(arg1)) {
      return;
    }
    set.add(arg1);
    list.push(arg1);
    if (arg1.notice && typeof arg1.notice === "object") {
      local(arg1.notice);
    }
    local2(arg1.notice_list);
    local2(arg1.notices);
    local2(arg1.notice_group);
    local2(arg1.children);
  };
  const local2 = arg1 => {
    if (!Array.isArray(arg1)) {
      return;
    }
    for (const item of arg1) {
      local(item);
    }
  };
  if (!arg1 || typeof arg1 !== "object") {
    return list;
  }
  local2(arg1.notice_list);
  local2(arg1.notices);
  local2(arg1.notice_groups);
  local2(arg1.data?.notice_list);
  local2(arg1.data?.notices);
  local2(arg1.data?.notice_groups);
  return list;
}
function findAwemeIdDeep(arg1, num = 0, arg3 = new Set()) {
  if (!arg1 || num > 6) {
    return "";
  }
  if (typeof arg1 === "string") {
    const local = arg1.match(/modal_id=(\d{15,})/i) || arg1.match(/\/(?:video|note)\/(\d{15,})/i) || arg1.match(/aweme_id=(\d{15,})/i) || arg1.match(/group_id=(\d{15,})/i) || arg1.match(/\/aweme\/detail\/(\d{15,})/i) || arg1.match(/aweme\/detail\?[^"'\s]*\bid=(\d{15,})/i);
    if (local) {
      return local[1];
    } else {
      return "";
    }
  }
  if (typeof arg1 !== "object") {
    return "";
  }
  if (arg3.has(arg1)) {
    return "";
  }
  arg3.add(arg1);
  const result = parseMaybeJson(arg1.extra);
  const list = ["aweme_id", "awemeId", "modal_id", "modalId", "item_id", "itemId"];
  for (const item of list) {
    const result = String(arg1[item] || "").trim();
    if (isAwemeId(result)) {
      return result;
    }
  }
  const result2 = String(arg1.group_id || arg1.groupId || "").trim();
  if (isAwemeId(result2) && (arg1.aweme || arg1.comment || arg1.item || num > 0)) {
    return result2;
  }
  const list2 = [arg1.aweme, arg1.item, arg1.comment, arg1.content, result, arg1.notice, arg1.schema, arg1.open_url, arg1.web_url, arg1.url];
  for (const item of list2) {
    const result = findAwemeIdDeep(item, num + 1, arg3);
    if (result) {
      return result;
    }
  }
  return "";
}
function extractNoticeAwemeId(options = {}) {
  const local = parseMaybeJson(options.extra) || {};
  const list = [options.aweme?.aweme_id, options.aweme?.item_id, options.item?.aweme_id, options.item?.item_id, options.aweme_id, options.item_id, options.comment?.aweme_id, options.content?.aweme_id, options.content?.aweme?.aweme_id, local.aweme_id, local.group_id, local.item_id, options.notice?.aweme?.aweme_id, options.aweme_info?.aweme_id, options.content?.aweme_info?.aweme_id, options.group_id];
  for (const item of list) {
    const result = String(item || "").trim();
    if (isAwemeId(result)) {
      return result;
    }
  }
  return findAwemeIdDeep(options);
}
function extractNoticeCommentId(options = {}) {
  const local = parseMaybeJson(options.extra) || {};
  const local2 = options.comment || options.content?.comment || options.notice?.comment || {};
  const list = [local2.cid, local2.comment_id, local2.commentId, options.cid, options.comment_id, local.cid, options.notice?.cid, options.notice?.comment?.cid];
  for (const item of list) {
    const result = String(item || "").trim();
    if (/^\d{10,}$/.test(result)) {
      return result;
    }
  }
  return "";
}
module.exports = {
  collectNoticeItems: collectNoticeItems,
  extractNoticeAwemeId: extractNoticeAwemeId,
  extractNoticeCommentId: extractNoticeCommentId
};
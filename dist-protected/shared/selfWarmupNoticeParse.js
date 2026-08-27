'use strict';

function parseMaybeJson(_0x4c25e6) {
  if (!_0x4c25e6) {
    return null;
  }
  if (typeof _0x4c25e6 === "object") {
    return _0x4c25e6;
  }
  if (typeof _0x4c25e6 !== "string") {
    return null;
  }
  const _0x3b607f = _0x4c25e6.trim();
  if (!_0x3b607f.startsWith("{") && !_0x3b607f.startsWith("[")) {
    return null;
  }
  try {
    return JSON.parse(_0x3b607f);
  } catch (_0x326b61) {
    return null;
  }
}
function isAwemeId(_0x1ca727) {
  return /^\d{15,}$/.test(String(_0x1ca727 || "").trim());
}
function collectNoticeItems(_0x13b33e) {
  const _0x3521f8 = [];
  const _0x3b3a56 = new Set();
  const _0x2c60d4 = _0x3d5cf5 => {
    if (!_0x3d5cf5 || typeof _0x3d5cf5 !== "object" || _0x3b3a56.has(_0x3d5cf5)) {
      return;
    }
    _0x3b3a56.add(_0x3d5cf5);
    _0x3521f8.push(_0x3d5cf5);
    if (_0x3d5cf5.notice && typeof _0x3d5cf5.notice === "object") {
      _0x2c60d4(_0x3d5cf5.notice);
    }
    _0x31eb30(_0x3d5cf5.notice_list);
    _0x31eb30(_0x3d5cf5.notices);
    _0x31eb30(_0x3d5cf5.notice_group);
    _0x31eb30(_0x3d5cf5.children);
  };
  const _0x31eb30 = _0x25a9c4 => {
    if (!Array.isArray(_0x25a9c4)) {
      return;
    }
    for (const _0x162ce8 of _0x25a9c4) {
      _0x2c60d4(_0x162ce8);
    }
  };
  if (!_0x13b33e || typeof _0x13b33e !== "object") {
    return _0x3521f8;
  }
  _0x31eb30(_0x13b33e.notice_list);
  _0x31eb30(_0x13b33e.notices);
  _0x31eb30(_0x13b33e.notice_groups);
  _0x31eb30(_0x13b33e.data?.notice_list);
  _0x31eb30(_0x13b33e.data?.notices);
  _0x31eb30(_0x13b33e.data?.notice_groups);
  return _0x3521f8;
}
function findAwemeIdDeep(_0x5ae64b, _0x20805b = 0, _0x5898a9 = new Set()) {
  if (!_0x5ae64b || _0x20805b > 6) {
    return "";
  }
  if (typeof _0x5ae64b === "string") {
    const _0x55d1d1 = _0x5ae64b.match(/modal_id=(\d{15,})/i) || _0x5ae64b.match(/\/(?:video|note)\/(\d{15,})/i) || _0x5ae64b.match(/aweme_id=(\d{15,})/i) || _0x5ae64b.match(/group_id=(\d{15,})/i) || _0x5ae64b.match(/\/aweme\/detail\/(\d{15,})/i) || _0x5ae64b.match(/aweme\/detail\?[^"'\s]*\bid=(\d{15,})/i);
    if (_0x55d1d1) {
      return _0x55d1d1[1];
    } else {
      return "";
    }
  }
  if (typeof _0x5ae64b !== "object") {
    return "";
  }
  if (_0x5898a9.has(_0x5ae64b)) {
    return "";
  }
  _0x5898a9.add(_0x5ae64b);
  const _0x2df3fc = parseMaybeJson(_0x5ae64b.extra);
  const _0x242a13 = ["aweme_id", "awemeId", "modal_id", "modalId", "item_id", "itemId"];
  for (const _0x351b94 of _0x242a13) {
    const _0x527ff3 = String(_0x5ae64b[_0x351b94] || "").trim();
    if (isAwemeId(_0x527ff3)) {
      return _0x527ff3;
    }
  }
  const _0x5c03c8 = String(_0x5ae64b.group_id || _0x5ae64b.groupId || "").trim();
  if (isAwemeId(_0x5c03c8) && (_0x5ae64b.aweme || _0x5ae64b.comment || _0x5ae64b.item || _0x20805b > 0)) {
    return _0x5c03c8;
  }
  const _0x1a9069 = [_0x5ae64b.aweme, _0x5ae64b.item, _0x5ae64b.comment, _0x5ae64b.content, _0x2df3fc, _0x5ae64b.notice, _0x5ae64b.schema, _0x5ae64b.open_url, _0x5ae64b.web_url, _0x5ae64b.url];
  for (const _0x5cb3f4 of _0x1a9069) {
    const _0x6fce49 = findAwemeIdDeep(_0x5cb3f4, _0x20805b + 1, _0x5898a9);
    if (_0x6fce49) {
      return _0x6fce49;
    }
  }
  return "";
}
function extractNoticeAwemeId(_0x568dfa = {}) {
  const _0x6ed91f = parseMaybeJson(_0x568dfa.extra) || {};
  const _0x4b3932 = [_0x568dfa.aweme?.aweme_id, _0x568dfa.aweme?.item_id, _0x568dfa.item?.aweme_id, _0x568dfa.item?.item_id, _0x568dfa.aweme_id, _0x568dfa.item_id, _0x568dfa.comment?.aweme_id, _0x568dfa.content?.aweme_id, _0x568dfa.content?.aweme?.aweme_id, _0x6ed91f.aweme_id, _0x6ed91f.group_id, _0x6ed91f.item_id, _0x568dfa.notice?.aweme?.aweme_id, _0x568dfa.aweme_info?.aweme_id, _0x568dfa.content?.aweme_info?.aweme_id, _0x568dfa.group_id];
  for (const _0xe3cfe of _0x4b3932) {
    const _0x5958b = String(_0xe3cfe || "").trim();
    if (isAwemeId(_0x5958b)) {
      return _0x5958b;
    }
  }
  return findAwemeIdDeep(_0x568dfa);
}
function extractNoticeCommentId(_0x58a915 = {}) {
  const _0x2c528a = parseMaybeJson(_0x58a915.extra) || {};
  const _0x354ad1 = _0x58a915.comment || _0x58a915.content?.comment || _0x58a915.notice?.comment || {};
  const _0x2bb435 = [_0x354ad1.cid, _0x354ad1.comment_id, _0x354ad1.commentId, _0x58a915.cid, _0x58a915.comment_id, _0x2c528a.cid, _0x58a915.notice?.cid, _0x58a915.notice?.comment?.cid];
  for (const _0x6a5c01 of _0x2bb435) {
    const _0x7e3d4b = String(_0x6a5c01 || "").trim();
    if (/^\d{10,}$/.test(_0x7e3d4b)) {
      return _0x7e3d4b;
    }
  }
  return "";
}
module.exports = {
  collectNoticeItems: collectNoticeItems,
  extractNoticeAwemeId: extractNoticeAwemeId,
  extractNoticeCommentId: extractNoticeCommentId
};
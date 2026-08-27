function compactText(_0x41747e) {
  return String(_0x41747e || "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim();
}
function isWeakSelfWarmupCommentText(_0x307b7f) {
  const _0xeb5f20 = compactText(_0x307b7f);
  if (!_0xeb5f20) {
    return true;
  }
  const _0x9bffbd = _0xeb5f20.replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/赞了你的(?:作品|视频|评论|动态)?|点赞了你的(?:作品|视频|评论|动态)?|回复了你(?:的评论)?|评论了你的(?:作品|视频|评论|动态)?/g, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, "").trim();
  return _0x9bffbd.length < 2;
}
function normalizeName(_0x25c465) {
  return compactText(_0x25c465).replace(/^@+/, "").toLowerCase();
}
function normalizeEventContent(_0x4f6588) {
  let _0x25a01b = compactText(_0x4f6588);
  _0x25a01b = _0x25a01b.replace(/(?:\s*[·•]\s*|\s+)(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/u, "").replace(/\s+\d+(?:\+)?$/, "").trim();
  return _0x25a01b;
}
function buildSelfWarmupEventSeenKey(_0x30d43d = {}) {
  const _0x3a0a3a = normalizeName(_0x30d43d.nickname);
  const _0x235271 = String(_0x30d43d.accountId || "");
  const _0xb0063 = _0x30d43d.eventType || "unknown";
  if (_0xb0063 === "follow" || _0xb0063 === "like") {
    const _0x2d6f5a = _0x3a0a3a || (_0x30d43d.userUrl ? String(_0x30d43d.userUrl).split("?")[0] : "unknown");
    return [_0x235271, _0xb0063, _0x2d6f5a].join("|");
  }
  const _0x1dca0e = _0x3a0a3a || (_0x30d43d.userUrl ? String(_0x30d43d.userUrl).split("?")[0] : "");
  const _0x5a89ad = normalizeEventContent(_0x30d43d.text);
  return [_0x235271, _0xb0063, _0x1dca0e, _0x5a89ad.slice(0, 100)].join("|");
}
function escapeRegExp(_0x12df36) {
  return String(_0x12df36 || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeSelfWarmupNoticeMergeContent(_0x13f350 = {}) {
  const _0x376e7c = compactText(_0x13f350.nickname).replace(/^@+/, "");
  let _0x4dd904 = compactText(_0x13f350.text || _0x13f350.notificationRowText || "");
  if (_0x376e7c) {
    _0x4dd904 = _0x4dd904.replace(new RegExp("^@?" + escapeRegExp(_0x376e7c) + "\\s*", "i"), "");
  }
  return _0x4dd904.replace(/(?:评论了你的(?:作品|视频|评论|动态)?|回复了你(?:的评论)?|关注了你|开始关注你|赞了你的(?:作品|视频|评论|动态)?|点赞了你的(?:作品|视频|评论|动态)?|喜欢了你的(?:作品|视频|评论|动态)?)/g, " ").replace(/(?:刚刚|\d+秒前|\d+分钟前|\d+小时前|\d+天前|昨天|前天|星期.|\d{1,2}:\d{2}|\d{2}-\d{2}|\d{4}-\d{1,2}|\d{1,2}\/\d{1,2})$/u, " ").replace(/\s+/g, " ").trim();
}
function buildSelfWarmupNoticeMergeKey(_0x56b7b4 = {}) {
  const _0x14b6b3 = _0x56b7b4.eventType || "unknown";
  if (_0x14b6b3 === "follow" || _0x14b6b3 === "like") {
    return buildSelfWarmupEventSeenKey(_0x56b7b4);
  }
  const _0x34cd2b = String(_0x56b7b4.accountId || "");
  const _0x45c860 = normalizeName(_0x56b7b4.nickname) || (_0x56b7b4.userUrl ? String(_0x56b7b4.userUrl).split("?")[0] : "");
  const _0xf923bb = String(_0x56b7b4.commentId || _0x56b7b4.cid || _0x56b7b4.comment_id || "").trim();
  const _0x44ae04 = normalizeSelfWarmupNoticeMergeContent(_0x56b7b4);
  if (_0x44ae04) {
    return [_0x34cd2b, _0x14b6b3, _0x45c860, _0x44ae04.slice(0, 100)].join("|");
  }
  return [_0x34cd2b, _0x14b6b3, _0x45c860, _0xf923bb ? "cid:" + _0xf923bb : ""].join("|");
}
function pickNonEmpty(..._0x1007dc) {
  for (const _0x293b84 of _0x1007dc) {
    const _0x5bfd45 = String(_0x293b84 || "").trim();
    if (_0x5bfd45) {
      return _0x5bfd45;
    }
  }
  return "";
}
function mergeSelfWarmupNoticeEvents(_0x3eea9b = []) {
  const _0x337904 = new Map();
  for (const _0x46f18a of _0x3eea9b) {
    if (!_0x46f18a || typeof _0x46f18a !== "object") {
      continue;
    }
    const _0x3e36a7 = buildSelfWarmupNoticeMergeKey(_0x46f18a);
    const _0x1151ac = _0x337904.get(_0x3e36a7);
    if (!_0x1151ac) {
      _0x337904.set(_0x3e36a7, {
        ..._0x46f18a
      });
      continue;
    }
    const _0x4aeb5e = pickNonEmpty(_0x1151ac.commentId, _0x46f18a.commentId, _0x1151ac.cid, _0x46f18a.cid, _0x1151ac.comment_id, _0x46f18a.comment_id);
    _0x337904.set(_0x3e36a7, {
      ..._0x1151ac,
      ..._0x46f18a,
      nickname: pickNonEmpty(_0x1151ac.nickname, _0x46f18a.nickname),
      userUrl: pickNonEmpty(_0x1151ac.userUrl, _0x46f18a.userUrl),
      videoUrl: pickNonEmpty(_0x1151ac.videoUrl, _0x46f18a.videoUrl),
      commentId: _0x4aeb5e,
      cid: _0x4aeb5e,
      comment_id: _0x4aeb5e,
      text: pickNonEmpty(_0x1151ac.text, _0x46f18a.text),
      notificationRowText: pickNonEmpty(_0x1151ac.notificationRowText, _0x46f18a.notificationRowText)
    });
  }
  return Array.from(_0x337904.values());
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
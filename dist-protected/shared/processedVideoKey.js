function extractDouyinVideoId(_0x3a235e) {
  if (!_0x3a235e) {
    return "";
  }
  const _0x1c4db8 = String(_0x3a235e).trim();
  try {
    let _0x400510 = _0x1c4db8;
    if (_0x400510.startsWith("//")) {
      _0x400510 = "https:" + _0x400510;
    }
    if (!/^https?:\/\//i.test(_0x400510)) {
      _0x400510 = "https://www.douyin.com" + (_0x400510.startsWith("/") ? _0x400510 : "/" + _0x400510);
    }
    const _0x1454fc = new URL(_0x400510);
    const _0x582fab = _0x1454fc.searchParams.get("modal_id") || _0x1454fc.searchParams.get("vid") || _0x1454fc.searchParams.get("aweme_id");
    if (_0x582fab && /^\d+$/.test(_0x582fab)) {
      return _0x582fab;
    }
    const _0x54efdd = _0x1454fc.pathname.match(/\/(?:share\/)?(?:video|note)\/(\d+)/);
    if (_0x54efdd?.[1]) {
      return _0x54efdd[1];
    }
  } catch (_0x79ac3e) {}
  const _0x1a2d29 = _0x1c4db8.match(/(?:share\/)?(?:video|note)\/(\d{15,})|modal_id=(\d{15,})|vid=(\d{15,})|aweme_id=(\d{15,})/);
  if (_0x1a2d29) {
    return _0x1a2d29[1] || _0x1a2d29[2] || _0x1a2d29[3] || _0x1a2d29[4] || "";
  } else {
    return "";
  }
}
function normalizeProcessedVideoKey(_0x379f10) {
  const _0x2939b6 = extractDouyinVideoId(_0x379f10);
  if (_0x2939b6) {
    return "https://www.douyin.com/video/" + _0x2939b6;
  }
  if (!_0x379f10) {
    return "";
  }
  try {
    const _0x5165bf = new URL(String(_0x379f10).trim().startsWith("http") ? _0x379f10 : "https://" + _0x379f10);
    return _0x5165bf.origin + _0x5165bf.pathname.replace(/\/$/, "");
  } catch (_0x234624) {
    return String(_0x379f10).trim();
  }
}
function processedVideoKeysMatch(_0x5d65e8, _0xb887de) {
  const _0x3d76a4 = normalizeProcessedVideoKey(_0x5d65e8);
  const _0x43a2ea = normalizeProcessedVideoKey(_0xb887de);
  if (_0x3d76a4 && _0x43a2ea) {
    return _0x3d76a4 === _0x43a2ea;
  }
  return String(_0x5d65e8 || "").trim() === String(_0xb887de || "").trim();
}
function rememberProcessedVideoKey(_0x1e7855, _0x5e26a9) {
  if (!_0x1e7855 || !_0x5e26a9) {
    return;
  }
  _0x1e7855.add(_0x5e26a9);
  const _0x44bdde = normalizeProcessedVideoKey(_0x5e26a9);
  if (_0x44bdde && _0x44bdde !== _0x5e26a9) {
    _0x1e7855.add(_0x44bdde);
  }
}
function hasProcessedVideoKey(_0x58123b, _0x4a547c) {
  if (!_0x58123b || !_0x4a547c) {
    return false;
  }
  if (_0x58123b.has(_0x4a547c)) {
    return true;
  }
  const _0x4dca33 = normalizeProcessedVideoKey(_0x4a547c);
  return !!_0x4dca33 && !!_0x58123b.has(_0x4dca33);
}
function forgetProcessedVideoKey(_0x5ac260, _0x5481a2) {
  if (!_0x5ac260 || !_0x5481a2) {
    return;
  }
  _0x5ac260.delete(_0x5481a2);
  const _0x47a598 = normalizeProcessedVideoKey(_0x5481a2);
  if (_0x47a598) {
    _0x5ac260.delete(_0x47a598);
  }
  const _0x539e44 = extractDouyinVideoId(_0x5481a2);
  if (!_0x539e44) {
    return;
  }
  for (const _0x83c62d of [..._0x5ac260]) {
    if (extractDouyinVideoId(_0x83c62d) === _0x539e44) {
      _0x5ac260.delete(_0x83c62d);
    }
  }
}
function initProcessedVideoSet(_0x6c59f0) {
  const _0x234aae = new Set();
  if (Array.isArray(_0x6c59f0)) {
    _0x6c59f0.forEach(_0x45c09d => rememberProcessedVideoKey(_0x234aae, _0x45c09d));
  }
  return _0x234aae;
}
function toDouyinJingxuanUrl(_0x57d95d) {
  const _0x32aaf8 = extractDouyinVideoId(_0x57d95d) || (typeof _0x57d95d === "string" && /^\d{15,20}$/.test(_0x57d95d.trim()) ? _0x57d95d.trim() : "");
  if (_0x32aaf8) {
    return "https://www.douyin.com/jingxuan?modal_id=" + _0x32aaf8;
  }
  const _0x4e6855 = String(_0x57d95d || "").trim();
  if (!_0x4e6855) {
    return "";
  }
  if (/^https?:\/\//i.test(_0x4e6855)) {
    return _0x4e6855;
  }
  return "https://" + _0x4e6855;
}
function extractCommentIdFromUrl(_0x3afd95) {
  const _0x2c49c2 = String(_0x3afd95 || "").trim();
  if (!_0x2c49c2) {
    return "";
  }
  try {
    let _0x3136ed = _0x2c49c2;
    if (_0x3136ed.startsWith("//")) {
      _0x3136ed = "https:" + _0x3136ed;
    }
    if (!/^https?:\/\//i.test(_0x3136ed)) {
      _0x3136ed = "https://" + _0x3136ed;
    }
    const _0x480f2c = new URL(_0x3136ed).searchParams.get("comment_id");
    if (_0x480f2c && /^\d{5,}$/.test(_0x480f2c)) {
      return _0x480f2c;
    }
  } catch (_0x3b93a8) {}
  const _0x52e5d1 = _0x2c49c2.match(/[?&]comment_id=(\d{5,})/i);
  if (_0x52e5d1) {
    return _0x52e5d1[1];
  } else {
    return "";
  }
}
function getDouyinCommentId(_0x22ed52 = {}) {
  if (_0x22ed52 == null) {
    return "";
  }
  if (typeof _0x22ed52 === "string" || typeof _0x22ed52 === "number") {
    const _0x4c06a1 = String(_0x22ed52).trim();
    if (/^\d{5,}$/.test(_0x4c06a1)) {
      return _0x4c06a1;
    }
    return extractCommentIdFromUrl(_0x4c06a1);
  }
  const _0x314ed9 = [_0x22ed52.commentId, _0x22ed52.cid, _0x22ed52.comment_id, _0x22ed52.commentCid, _0x22ed52.comment?.cid, _0x22ed52.comment?.comment_id, _0x22ed52.comment?.commentId];
  for (const _0x472a7a of _0x314ed9) {
    const _0x49240c = String(_0x472a7a || "").trim();
    if (/^\d{5,}$/.test(_0x49240c)) {
      return _0x49240c;
    }
  }
  return extractCommentIdFromUrl(_0x22ed52.videoUrl || _0x22ed52.url || _0x22ed52.commentUrl || "");
}
function buildDouyinCommentLocateUrl(_0xc9942, _0x597c1d = null) {
  const _0x570b2d = toDouyinJingxuanUrl(_0xc9942);
  if (!_0x570b2d) {
    return "";
  }
  const _0x2cc7f6 = String(_0x597c1d ?? "").trim() || (_0xc9942 && typeof _0xc9942 === "object" ? getDouyinCommentId(_0xc9942) : "") || extractCommentIdFromUrl(_0xc9942);
  if (!_0x2cc7f6) {
    return _0x570b2d;
  }
  try {
    const _0x5a5c41 = new URL(_0x570b2d);
    _0x5a5c41.searchParams.set("comment_id", _0x2cc7f6);
    return _0x5a5c41.toString();
  } catch (_0x5a5e82) {
    const _0x54d283 = _0x570b2d.includes("?") ? "&" : "?";
    return "" + _0x570b2d + _0x54d283 + "comment_id=" + encodeURIComponent(_0x2cc7f6);
  }
}
function canonicalizeDouyinVideoUrl(_0x245648) {
  const _0x16842d = extractDouyinVideoId(_0x245648) || (typeof _0x245648 === "string" && /^\d{15,20}$/.test(String(_0x245648).trim()) ? String(_0x245648).trim() : "");
  if (_0x16842d) {
    return "https://www.douyin.com/video/" + _0x16842d;
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
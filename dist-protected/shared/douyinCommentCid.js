function looksLikeDouyinCommentCid(_0x41c192) {
  const _0x35dd7b = String(_0x41c192 || "").trim();
  if (/^\d{10,}$/.test(_0x35dd7b)) {
    return _0x35dd7b;
  } else {
    return "";
  }
}
function extractDouyinCommentCidFromNode(_0x116eea) {
  if (!_0x116eea) {
    return "";
  }
  try {
    const _0x4e6b60 = ["data-cid", "data-comment-id", "data-id"];
    for (const _0x113bc7 of _0x4e6b60) {
      const _0x50da0a = looksLikeDouyinCommentCid(_0x116eea.getAttribute?.(_0x113bc7));
      if (_0x50da0a) {
        return _0x50da0a;
      }
    }
    const _0x5ab9c7 = _0x116eea.querySelector?.("[data-cid], [data-comment-id]");
    if (_0x5ab9c7) {
      const _0x2e5a31 = looksLikeDouyinCommentCid(_0x5ab9c7.getAttribute("data-cid") || _0x5ab9c7.getAttribute("data-comment-id"));
      if (_0x2e5a31) {
        return _0x2e5a31;
      }
    }
    const _0x280c6c = _0xf59016 => {
      if (!_0xf59016 || typeof _0xf59016 !== "object") {
        return "";
      }
      const _0x141006 = looksLikeDouyinCommentCid(_0xf59016.cid || _0xf59016.commentId || _0xf59016.comment_id);
      if (_0x141006) {
        return _0x141006;
      }
      if (_0xf59016.comment && typeof _0xf59016.comment === "object") {
        return looksLikeDouyinCommentCid(_0xf59016.comment.cid || _0xf59016.comment.comment_id || _0xf59016.comment.commentId);
      }
      return "";
    };
    const _0x29a3be = Object.keys(_0x116eea);
    for (const _0x342d2f of _0x29a3be) {
      if (!_0x342d2f.startsWith("__reactFiber") && !_0x342d2f.startsWith("__reactInternalInstance") && !_0x342d2f.startsWith("__reactProps")) {
        continue;
      }
      let _0x4e042b = _0x116eea[_0x342d2f];
      for (let _0x59479f = 0; _0x59479f < 14 && _0x4e042b; _0x59479f += 1) {
        const _0x49ac06 = _0x280c6c(_0x4e042b.memoizedProps);
        if (_0x49ac06) {
          return _0x49ac06;
        }
        const _0x2326e8 = _0x280c6c(_0x4e042b.pendingProps);
        if (_0x2326e8) {
          return _0x2326e8;
        }
        _0x4e042b = _0x4e042b.return;
      }
    }
  } catch (_0xb2bcd3) {}
  return "";
}
function summarizeDouyinCommentListPayload(_0x13ffb6, _0x36f5ac) {
  const _0x1ce1ae = _0x36f5ac && typeof _0x36f5ac === "object" ? _0x36f5ac.comments || _0x36f5ac.data?.comments || _0x36f5ac.comment_list || [] : [];
  const _0x1cfc5f = Array.isArray(_0x1ce1ae) ? _0x1ce1ae : [];
  const _0x5617a5 = [];
  for (const _0x3bef0c of _0x1cfc5f) {
    const _0x1f35e3 = looksLikeDouyinCommentCid(_0x3bef0c?.cid || _0x3bef0c?.comment_id || _0x3bef0c?.commentId);
    if (_0x1f35e3 && !_0x5617a5.includes(_0x1f35e3)) {
      _0x5617a5.push(_0x1f35e3);
    }
  }
  let _0xddd56f = "";
  try {
    const _0x191dc3 = new URL(String(_0x13ffb6 || ""), "https://www.douyin.com");
    _0xddd56f = String(_0x191dc3.searchParams.get("aweme_id") || "").trim();
  } catch (_0x557ca4) {}
  return {
    url: String(_0x13ffb6 || ""),
    ts: Date.now(),
    awemeId: _0xddd56f,
    cids: _0x5617a5,
    count: _0x1cfc5f.length
  };
}
module.exports = {
  looksLikeDouyinCommentCid: looksLikeDouyinCommentCid,
  extractDouyinCommentCidFromNode: extractDouyinCommentCidFromNode,
  summarizeDouyinCommentListPayload: summarizeDouyinCommentListPayload
};
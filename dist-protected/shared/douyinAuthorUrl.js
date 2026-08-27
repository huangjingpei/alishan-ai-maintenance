const {
  extractDouyinUrlsFromText
} = require("./douyinShareText");
function normalizeRequestUrl(_0x53eb9f) {
  const _0x49efd3 = String(_0x53eb9f || "").trim();
  if (!_0x49efd3) {
    return "";
  }
  if (_0x49efd3.startsWith("//")) {
    return "https:" + _0x49efd3;
  }
  if (/^https?:\/\//i.test(_0x49efd3)) {
    return _0x49efd3;
  }
  return "https://" + _0x49efd3;
}
function isDouyinAuthorProfileUrl(_0x2af03c) {
  const _0x2f3fe3 = String(_0x2af03c || "").trim();
  if (!_0x2f3fe3) {
    return false;
  }
  if (/\s/.test(_0x2f3fe3)) {
    return false;
  }
  if (/douyin\.com\/(?:share\/)?user\//i.test(_0x2f3fe3)) {
    return true;
  }
  try {
    const _0x54a889 = new URL(normalizeRequestUrl(_0x2f3fe3));
    const _0x1c7220 = _0x54a889.hostname.toLowerCase();
    if (!_0x1c7220.endsWith("douyin.com")) {
      return false;
    }
    return /\/(?:share\/)?user\//i.test(_0x54a889.pathname) || Boolean(_0x54a889.searchParams.get("sec_uid"));
  } catch (_0x557cfe) {
    return false;
  }
}
function isCleanDouyinShortShareUrl(_0x465b52) {
  const _0x5a6452 = String(_0x465b52 || "").trim();
  if (!_0x5a6452 || /\s/.test(_0x5a6452)) {
    return false;
  }
  return /v\.douyin\.com/i.test(_0x5a6452) || /iesdouyin\.com\/share/i.test(_0x5a6452);
}
function isDouyinAuthorUrlCandidate(_0x6e22b7) {
  const _0x43887f = String(_0x6e22b7 || "").trim();
  if (!_0x43887f || /\s/.test(_0x43887f)) {
    return false;
  }
  if (isDouyinAuthorProfileUrl(_0x43887f) && !isCleanDouyinShortShareUrl(_0x43887f)) {
    return true;
  }
  if (/\/(?:video|note)\/\d+/i.test(_0x43887f)) {
    return false;
  }
  if (/[?&](?:modal_id|vid|aweme_id)=\d+/i.test(_0x43887f)) {
    return false;
  }
  return isCleanDouyinShortShareUrl(_0x43887f);
}
function normalizeDouyinAuthorUrl(_0x3b95c2, _0x4c5624 = {}) {
  const {
    preserveSearch = true
  } = _0x4c5624;
  const _0x4a45dd = String(_0x3b95c2 || "").trim();
  if (!_0x4a45dd) {
    return "";
  }
  try {
    const _0x3b9fea = new URL(normalizeRequestUrl(_0x4a45dd));
    const _0x1d8346 = _0x3b9fea.hostname.toLowerCase();
    if (!_0x1d8346.endsWith("douyin.com")) {
      return "";
    }
    const _0x35d0df = _0x3b9fea.pathname.match(/\/(?:share\/)?user\/([^/?#]+)/i);
    const _0x130317 = decodeURIComponent(_0x35d0df?.[1] || _0x3b9fea.searchParams.get("sec_uid") || "").trim();
    if (!_0x130317) {
      return "";
    }
    const _0x3efacb = "https://www.douyin.com/user/" + _0x130317;
    const _0x37f751 = _0x1d8346.includes("iesdouyin") || /\/share\/user\//i.test(_0x3b9fea.pathname);
    if (_0x37f751) {
      return _0x3efacb;
    }
    if (preserveSearch && _0x3b9fea.search) {
      return "" + _0x3efacb + _0x3b9fea.search;
    } else {
      return _0x3efacb;
    }
  } catch (_0x3e2ae7) {
    return "";
  }
}
function getDouyinAuthorProfileKey(_0x30c9e2) {
  const _0x3fe5c2 = normalizeDouyinAuthorUrl(_0x30c9e2, {
    preserveSearch: false
  });
  if (!_0x3fe5c2) {
    return "";
  }
  const _0x407300 = _0x3fe5c2.match(/\/user\/([^/?#]+)/)?.[1] || "";
  return _0x407300 || _0x3fe5c2;
}
function resolveDouyinAuthorIdentityKey(_0x39a1b0) {
  const _0x1d1cb7 = String(_0x39a1b0 || "").trim();
  if (!_0x1d1cb7) {
    return "";
  }
  const _0x22d207 = getDouyinAuthorProfileKey(_0x1d1cb7);
  if (_0x22d207) {
    return _0x22d207;
  }
  if (/^MS4wLjABAAAA[\w-]+$/i.test(_0x1d1cb7)) {
    return _0x1d1cb7;
  }
  const _0x1f9b69 = _0x1d1cb7.match(/\/(?:share\/)?user\/([^/?#]+)/i);
  if (_0x1f9b69?.[1]) {
    try {
      const _0x3e54e8 = decodeURIComponent(_0x1f9b69[1]).trim();
      return _0x3e54e8 || "";
    } catch (_0x527f53) {
      return String(_0x1f9b69[1] || "").trim();
    }
  }
  return "";
}
function isSameDouyinAuthorIdentity(_0x5a5716, _0x55c6f2) {
  const _0x1f5fcb = resolveDouyinAuthorIdentityKey(_0x5a5716);
  const _0x3bd72c = resolveDouyinAuthorIdentityKey(_0x55c6f2);
  return !!_0x1f5fcb && !!_0x3bd72c && _0x1f5fcb === _0x3bd72c;
}
function isDouyinSecUidIdentity(_0x5b679c) {
  const _0x2fb5fe = resolveDouyinAuthorIdentityKey(_0x5b679c);
  return /^MS4wLjABAAAA[\w-]+$/i.test(_0x2fb5fe);
}
function classifyDouyinAuthorIdentity(_0x4463b5, _0x51f622) {
  const _0x2d8352 = resolveDouyinAuthorIdentityKey(_0x51f622);
  const _0xc8dcf1 = resolveDouyinAuthorIdentityKey(_0x4463b5);
  if (!_0x2d8352) {
    return {
      matched: true,
      foreign: false,
      unconfirmed: false,
      skipped: true,
      currentKey: _0xc8dcf1,
      expectedKey: _0x2d8352
    };
  }
  if (_0xc8dcf1 && _0xc8dcf1 === _0x2d8352) {
    return {
      matched: true,
      foreign: false,
      unconfirmed: false,
      skipped: false,
      currentKey: _0xc8dcf1,
      expectedKey: _0x2d8352
    };
  }
  if (isDouyinSecUidIdentity(_0x2d8352) && isDouyinSecUidIdentity(_0xc8dcf1) && _0xc8dcf1 !== _0x2d8352) {
    return {
      matched: false,
      foreign: true,
      unconfirmed: false,
      skipped: false,
      currentKey: _0xc8dcf1,
      expectedKey: _0x2d8352
    };
  }
  return {
    matched: false,
    foreign: false,
    unconfirmed: true,
    skipped: false,
    currentKey: _0xc8dcf1,
    expectedKey: _0x2d8352
  };
}
function parseDouyinAuthorUrlCandidates(_0xa31742) {
  const _0x31d034 = String(_0xa31742 || "").split(/[\n,，]+/).map(_0x56ac16 => _0x56ac16.trim()).filter(Boolean);
  const _0xe8fc01 = new Set();
  const _0xb0d611 = [];
  const _0x3c27bd = _0x204870 => {
    const _0x42ca76 = String(_0x204870 || "").trim();
    if (!_0x42ca76 || !isDouyinAuthorUrlCandidate(_0x42ca76)) {
      return;
    }
    if (_0xe8fc01.has(_0x42ca76)) {
      return;
    }
    _0xe8fc01.add(_0x42ca76);
    _0xb0d611.push(_0x42ca76);
  };
  for (const _0x31509c of _0x31d034) {
    if (isDouyinAuthorUrlCandidate(_0x31509c)) {
      _0x3c27bd(_0x31509c);
      continue;
    }
    extractDouyinUrlsFromText(_0x31509c).forEach(_0x3c27bd);
  }
  if (_0xb0d611.length === 0) {
    extractDouyinUrlsFromText(_0xa31742).forEach(_0x3c27bd);
  }
  return _0xb0d611;
}
function parseAuthorUrlLines(_0x4dda13, _0xa45515 = []) {
  const _0x53a61f = parseDouyinAuthorUrlCandidates(_0x4dda13);
  const _0x596372 = new Set();
  const _0x36e5c6 = [];
  for (const _0x385a9b of _0x53a61f) {
    const _0x127e11 = normalizeDouyinAuthorUrl(_0x385a9b) || (isCleanDouyinShortShareUrl(_0x385a9b) ? _0x385a9b : "");
    if (!_0x127e11) {
      continue;
    }
    const _0x460a56 = getDouyinAuthorProfileKey(_0x127e11) || _0x127e11;
    if (!_0x460a56 || _0x596372.has(_0x460a56)) {
      continue;
    }
    _0x596372.add(_0x460a56);
    const _0x524d05 = (_0xa45515 || []).find(_0x407bab => {
      const _0x300469 = getDouyinAuthorProfileKey(_0x407bab?.url) || String(_0x407bab?.url || "").trim();
      return _0x300469 && _0x300469 === _0x460a56;
    });
    _0x36e5c6.push({
      url: _0x127e11,
      name: String(_0x524d05?.name || "").trim()
    });
  }
  return _0x36e5c6;
}
module.exports = {
  isDouyinAuthorProfileUrl: isDouyinAuthorProfileUrl,
  isCleanDouyinShortShareUrl: isCleanDouyinShortShareUrl,
  isDouyinAuthorUrlCandidate: isDouyinAuthorUrlCandidate,
  normalizeDouyinAuthorUrl: normalizeDouyinAuthorUrl,
  getDouyinAuthorProfileKey: getDouyinAuthorProfileKey,
  resolveDouyinAuthorIdentityKey: resolveDouyinAuthorIdentityKey,
  isSameDouyinAuthorIdentity: isSameDouyinAuthorIdentity,
  isDouyinSecUidIdentity: isDouyinSecUidIdentity,
  classifyDouyinAuthorIdentity: classifyDouyinAuthorIdentity,
  parseDouyinAuthorUrlCandidates: parseDouyinAuthorUrlCandidates,
  parseAuthorUrlLines: parseAuthorUrlLines
};
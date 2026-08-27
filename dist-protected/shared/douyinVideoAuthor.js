function normalizeAuthorNicknameText(_0x2a1416) {
  let _0x61ab2a = String(_0x2a1416 || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
  if (!_0x61ab2a) {
    return "";
  }
  _0x61ab2a = _0x61ab2a.replace(/\s*(认证徽章|企业认证|机构认证|个人认证|已关注|相互关注|回关|关注)\s*/g, " ").replace(/\s+/g, " ").trim();
  if (!_0x61ab2a || /^(关注|粉丝|获赞|私信|登录|我的)$/.test(_0x61ab2a)) {
    return "";
  }
  if (_0x61ab2a.length <= 50) {
    return _0x61ab2a;
  } else {
    return _0x61ab2a.slice(0, 50);
  }
}
function normalizeAuthorAccountName(_0x579b2c) {
  return normalizeAuthorNicknameText(_0x579b2c).toLowerCase();
}
function parseExcludeAuthorAccounts(_0x205190) {
  if (!_0x205190 || !String(_0x205190).trim()) {
    return [];
  }
  return String(_0x205190).split(/[,，\n]/).map(_0x2d0f08 => normalizeAuthorNicknameText(_0x2d0f08)).filter(Boolean);
}
function matchExcludedVideoAuthor(_0x39af9d, _0x354a7d = []) {
  if (!_0x39af9d || !Array.isArray(_0x354a7d) || _0x354a7d.length === 0) {
    return {
      excluded: false,
      matched: ""
    };
  }
  const _0x4c067d = normalizeAuthorAccountName(_0x39af9d);
  if (!_0x4c067d) {
    return {
      excluded: false,
      matched: ""
    };
  }
  const _0x32c24a = _0x354a7d.find(_0x1c782b => normalizeAuthorAccountName(_0x1c782b) === _0x4c067d);
  if (_0x32c24a) {
    return {
      excluded: true,
      matched: _0x32c24a
    };
  } else {
    return {
      excluded: false,
      matched: ""
    };
  }
}
module.exports = {
  normalizeAuthorNicknameText: normalizeAuthorNicknameText,
  normalizeAuthorAccountName: normalizeAuthorAccountName,
  parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
  matchExcludedVideoAuthor: matchExcludedVideoAuthor
};
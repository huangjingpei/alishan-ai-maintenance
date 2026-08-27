'use strict';

const PROFILE_OTHER_API_RE = /\/aweme\/v1\/web\/user\/profile\/other\//i;
function isProfileOtherApiUrl(_0x2298ab) {
  return PROFILE_OTHER_API_RE.test(String(_0x2298ab || ""));
}
function mapApiGenderCode(_0x2b8634) {
  const _0x422476 = Number(_0x2b8634);
  if (_0x422476 === 1) {
    return "男";
  }
  if (_0x422476 === 2) {
    return "女";
  }
  return "未知";
}
function extractProfileUserFromApiPayload(_0x687607) {
  if (!_0x687607 || typeof _0x687607 !== "object") {
    return null;
  }
  if (_0x687607.user && typeof _0x687607.user === "object") {
    return _0x687607.user;
  }
  if (_0x687607.data?.user && typeof _0x687607.data.user === "object") {
    return _0x687607.data.user;
  }
  if (_0x687607.user_info && typeof _0x687607.user_info === "object") {
    return _0x687607.user_info;
  }
  return null;
}
function parseAgeFromApiUser(_0x45b1b4) {
  if (!_0x45b1b4 || typeof _0x45b1b4 !== "object") {
    return null;
  }
  const _0x46a79f = _0x45b1b4.user_age ?? _0x45b1b4.age ?? _0x45b1b4.birthday_age;
  const _0x41a6a5 = Number(_0x46a79f);
  if (!Number.isFinite(_0x41a6a5) || _0x41a6a5 < 0 || _0x41a6a5 > 120) {
    return null;
  }
  return Math.floor(_0x41a6a5);
}
function parseProfileGenderFromApi(_0x5bae5b) {
  const _0x42e4df = extractProfileUserFromApiPayload(_0x5bae5b);
  if (!_0x42e4df) {
    return null;
  }
  const _0x2bba29 = Object.prototype.hasOwnProperty.call(_0x42e4df, "gender") || Object.prototype.hasOwnProperty.call(_0x42e4df, "Gender");
  if (!_0x2bba29) {
    return null;
  }
  const _0xc4bf3e = _0x42e4df.gender ?? _0x42e4df.Gender;
  const _0x2aa328 = Number(_0xc4bf3e);
  const _0x382f25 = mapApiGenderCode(_0xc4bf3e);
  const _0x382823 = String(_0x42e4df.sec_uid || _0x42e4df.secUid || "").trim();
  const _0x231f78 = String(_0x42e4df.nickname || _0x42e4df.nick_name || "").trim();
  return {
    gender: _0x382f25,
    age: parseAgeFromApiUser(_0x42e4df),
    secUid: _0x382823,
    nickname: _0x231f78,
    genderCode: Number.isFinite(_0x2aa328) ? _0x2aa328 : null,
    settled: true
  };
}
function extractSecUidFromProfileUrl(_0x22059b) {
  const _0x31b485 = String(_0x22059b || "");
  const _0x38c74b = _0x31b485.match(/\/user\/([^/?#]+)/) || _0x31b485.match(/[?&]sec_uid=([^&#]+)/i) || _0x31b485.match(/[?&]sec_user_id=([^&#]+)/i);
  if (!_0x38c74b) {
    return "";
  }
  try {
    return decodeURIComponent(_0x38c74b[1]).trim();
  } catch (_0x694ecf) {
    return String(_0x38c74b[1] || "").trim();
  }
}
function profileApiMatchesPage(_0x20bd60, _0x230032) {
  if (!_0x20bd60 || !_0x20bd60.settled) {
    return false;
  }
  const _0x45f0ec = String(_0x230032 || "").trim();
  const _0x194b67 = String(_0x20bd60.secUid || "").trim();
  if (!_0x45f0ec || !_0x194b67) {
    return true;
  }
  return _0x45f0ec === _0x194b67;
}
module.exports = {
  PROFILE_OTHER_API_RE: PROFILE_OTHER_API_RE,
  isProfileOtherApiUrl: isProfileOtherApiUrl,
  mapApiGenderCode: mapApiGenderCode,
  extractProfileUserFromApiPayload: extractProfileUserFromApiPayload,
  parseAgeFromApiUser: parseAgeFromApiUser,
  parseProfileGenderFromApi: parseProfileGenderFromApi,
  extractSecUidFromProfileUrl: extractSecUidFromProfileUrl,
  profileApiMatchesPage: profileApiMatchesPage
};
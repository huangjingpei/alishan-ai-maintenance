'use strict';

const PROFILE_OTHER_API_RE = /\/aweme\/v1\/web\/user\/profile\/other\//i;
function isProfileOtherApiUrl(arg1) {
  return PROFILE_OTHER_API_RE.test(String(arg1 || ""));
}
function mapApiGenderCode(arg1) {
  const result = Number(arg1);
  if (result === 1) {
    return "男";
  }
  if (result === 2) {
    return "女";
  }
  return "未知";
}
function extractProfileUserFromApiPayload(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  if (arg1.user && typeof arg1.user === "object") {
    return arg1.user;
  }
  if (arg1.data?.user && typeof arg1.data.user === "object") {
    return arg1.data.user;
  }
  if (arg1.user_info && typeof arg1.user_info === "object") {
    return arg1.user_info;
  }
  return null;
}
function parseAgeFromApiUser(arg1) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  const local = arg1.user_age ?? arg1.age ?? arg1.birthday_age;
  const result = Number(local);
  if (!Number.isFinite(result) || result < 0 || result > 120) {
    return null;
  }
  return Math.floor(result);
}
function parseProfileGenderFromApi(arg1) {
  const result = extractProfileUserFromApiPayload(arg1);
  if (!result) {
    return null;
  }
  const local = Object.prototype.hasOwnProperty.call(result, "gender") || Object.prototype.hasOwnProperty.call(result, "Gender");
  if (!local) {
    return null;
  }
  const local2 = result.gender ?? result.Gender;
  const result2 = Number(local2);
  const result3 = mapApiGenderCode(local2);
  const result4 = String(result.sec_uid || result.secUid || "").trim();
  const result5 = String(result.nickname || result.nick_name || "").trim();
  return {
    gender: result3,
    age: parseAgeFromApiUser(result),
    secUid: result4,
    nickname: result5,
    genderCode: Number.isFinite(result2) ? result2 : null,
    settled: true
  };
}
function extractSecUidFromProfileUrl(arg1) {
  const result = String(arg1 || "");
  const local = result.match(/\/user\/([^/?#]+)/) || result.match(/[?&]sec_uid=([^&#]+)/i) || result.match(/[?&]sec_user_id=([^&#]+)/i);
  if (!local) {
    return "";
  }
  try {
    return decodeURIComponent(local[1]).trim();
  } catch (error) {
    return String(local[1] || "").trim();
  }
}
function profileApiMatchesPage(arg1, arg2) {
  if (!arg1 || !arg1.settled) {
    return false;
  }
  const result = String(arg2 || "").trim();
  const result2 = String(arg1.secUid || "").trim();
  if (!result || !result2) {
    return true;
  }
  return result === result2;
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
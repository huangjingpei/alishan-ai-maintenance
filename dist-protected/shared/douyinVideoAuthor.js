function normalizeAuthorNicknameText(arg1) {
  let result = String(arg1 || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
  if (!result) {
    return "";
  }
  result = result.replace(/\s*(认证徽章|企业认证|机构认证|个人认证|已关注|相互关注|回关|关注)\s*/g, " ").replace(/\s+/g, " ").trim();
  if (!result || /^(关注|粉丝|获赞|私信|登录|我的)$/.test(result)) {
    return "";
  }
  if (result.length <= 50) {
    return result;
  } else {
    return result.slice(0, 50);
  }
}
function normalizeAuthorAccountName(arg1) {
  return normalizeAuthorNicknameText(arg1).toLowerCase();
}
function parseExcludeAuthorAccounts(arg1) {
  if (!arg1 || !String(arg1).trim()) {
    return [];
  }
  return String(arg1).split(/[,，\n]/).map(arg1 => normalizeAuthorNicknameText(arg1)).filter(Boolean);
}
function matchExcludedVideoAuthor(arg1, list = []) {
  if (!arg1 || !Array.isArray(list) || list.length === 0) {
    return {
      excluded: false,
      matched: ""
    };
  }
  const result = normalizeAuthorAccountName(arg1);
  if (!result) {
    return {
      excluded: false,
      matched: ""
    };
  }
  const result2 = list.find(arg1 => normalizeAuthorAccountName(arg1) === result);
  if (result2) {
    return {
      excluded: true,
      matched: result2
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
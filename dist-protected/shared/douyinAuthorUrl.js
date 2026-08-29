const {
  extractDouyinUrlsFromText
} = require("./douyinShareText");
function normalizeRequestUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  if (result.startsWith("//")) {
    return "https:" + result;
  }
  if (/^https?:\/\//i.test(result)) {
    return result;
  }
  return "https://" + result;
}
function isDouyinAuthorProfileUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return false;
  }
  if (/\s/.test(result)) {
    return false;
  }
  if (/douyin\.com\/(?:share\/)?user\//i.test(result)) {
    return true;
  }
  try {
    const url = new URL(normalizeRequestUrl(result));
    const result2 = url.hostname.toLowerCase();
    if (!result2.endsWith("douyin.com")) {
      return false;
    }
    return /\/(?:share\/)?user\//i.test(url.pathname) || Boolean(url.searchParams.get("sec_uid"));
  } catch (error) {
    return false;
  }
}
function isCleanDouyinShortShareUrl(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || /\s/.test(result)) {
    return false;
  }
  return /v\.douyin\.com/i.test(result) || /iesdouyin\.com\/share/i.test(result);
}
function isDouyinAuthorUrlCandidate(arg1) {
  const result = String(arg1 || "").trim();
  if (!result || /\s/.test(result)) {
    return false;
  }
  if (isDouyinAuthorProfileUrl(result) && !isCleanDouyinShortShareUrl(result)) {
    return true;
  }
  if (/\/(?:video|note)\/\d+/i.test(result)) {
    return false;
  }
  if (/[?&](?:modal_id|vid|aweme_id)=\d+/i.test(result)) {
    return false;
  }
  return isCleanDouyinShortShareUrl(result);
}
function normalizeDouyinAuthorUrl(arg1, options = {}) {
  const {
    preserveSearch = true
  } = options;
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  try {
    const url = new URL(normalizeRequestUrl(result));
    const result2 = url.hostname.toLowerCase();
    if (!result2.endsWith("douyin.com")) {
      return "";
    }
    const result3 = url.pathname.match(/\/(?:share\/)?user\/([^/?#]+)/i);
    const result4 = decodeURIComponent(result3?.[1] || url.searchParams.get("sec_uid") || "").trim();
    if (!result4) {
      return "";
    }
    const value = "https://www.douyin.com/user/" + result4;
    const local = result2.includes("iesdouyin") || /\/share\/user\//i.test(url.pathname);
    if (local) {
      return value;
    }
    if (preserveSearch && url.search) {
      return "" + value + url.search;
    } else {
      return value;
    }
  } catch (error) {
    return "";
  }
}
function getDouyinAuthorProfileKey(arg1) {
  const result = normalizeDouyinAuthorUrl(arg1, {
    preserveSearch: false
  });
  if (!result) {
    return "";
  }
  const local = result.match(/\/user\/([^/?#]+)/)?.[1] || "";
  return local || result;
}
function resolveDouyinAuthorIdentityKey(arg1) {
  const result = String(arg1 || "").trim();
  if (!result) {
    return "";
  }
  const result2 = getDouyinAuthorProfileKey(result);
  if (result2) {
    return result2;
  }
  if (/^MS4wLjABAAAA[\w-]+$/i.test(result)) {
    return result;
  }
  const result3 = result.match(/\/(?:share\/)?user\/([^/?#]+)/i);
  if (result3?.[1]) {
    try {
      const result = decodeURIComponent(result3[1]).trim();
      return result || "";
    } catch (error) {
      return String(result3[1] || "").trim();
    }
  }
  return "";
}
function isSameDouyinAuthorIdentity(arg1, arg2) {
  const result = resolveDouyinAuthorIdentityKey(arg1);
  const result2 = resolveDouyinAuthorIdentityKey(arg2);
  return !!result && !!result2 && result === result2;
}
function isDouyinSecUidIdentity(arg1) {
  const result = resolveDouyinAuthorIdentityKey(arg1);
  return /^MS4wLjABAAAA[\w-]+$/i.test(result);
}
function classifyDouyinAuthorIdentity(arg1, arg2) {
  const result = resolveDouyinAuthorIdentityKey(arg2);
  const result2 = resolveDouyinAuthorIdentityKey(arg1);
  if (!result) {
    return {
      matched: true,
      foreign: false,
      unconfirmed: false,
      skipped: true,
      currentKey: result2,
      expectedKey: result
    };
  }
  if (result2 && result2 === result) {
    return {
      matched: true,
      foreign: false,
      unconfirmed: false,
      skipped: false,
      currentKey: result2,
      expectedKey: result
    };
  }
  if (isDouyinSecUidIdentity(result) && isDouyinSecUidIdentity(result2) && result2 !== result) {
    return {
      matched: false,
      foreign: true,
      unconfirmed: false,
      skipped: false,
      currentKey: result2,
      expectedKey: result
    };
  }
  return {
    matched: false,
    foreign: false,
    unconfirmed: true,
    skipped: false,
    currentKey: result2,
    expectedKey: result
  };
}
function parseDouyinAuthorUrlCandidates(arg1) {
  const result = String(arg1 || "").split(/[\n,，]+/).map(arg1 => arg1.trim()).filter(Boolean);
  const set = new Set();
  const list = [];
  const local = arg1 => {
    const result = String(arg1 || "").trim();
    if (!result || !isDouyinAuthorUrlCandidate(result)) {
      return;
    }
    if (set.has(result)) {
      return;
    }
    set.add(result);
    list.push(result);
  };
  for (const item of result) {
    if (isDouyinAuthorUrlCandidate(item)) {
      local(item);
      continue;
    }
    extractDouyinUrlsFromText(item).forEach(local);
  }
  if (list.length === 0) {
    extractDouyinUrlsFromText(arg1).forEach(local);
  }
  return list;
}
function parseAuthorUrlLines(arg1, list = []) {
  const result = parseDouyinAuthorUrlCandidates(arg1);
  const set = new Set();
  const list2 = [];
  for (const item of result) {
    const local = normalizeDouyinAuthorUrl(item) || (isCleanDouyinShortShareUrl(item) ? item : "");
    if (!local) {
      continue;
    }
    const local2 = getDouyinAuthorProfileKey(local) || local;
    if (!local2 || set.has(local2)) {
      continue;
    }
    set.add(local2);
    const result = (list || []).find(arg1 => {
      const local = getDouyinAuthorProfileKey(arg1?.url) || String(arg1?.url || "").trim();
      return local && local === local2;
    });
    list2.push({
      url: local,
      name: String(result?.name || "").trim()
    });
  }
  return list2;
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
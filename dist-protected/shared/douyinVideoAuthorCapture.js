const {
  normalizeAuthorNicknameText,
  normalizeAuthorAccountName,
  parseExcludeAuthorAccounts,
  matchExcludedVideoAuthor
} = require("./douyinVideoAuthor");
const FEED_SCOPE_E2E = ["feed-active-video", "feed-active-live", "feed-live", "browse-live", "webcast-player"];
function createDouyinVideoAuthorApi(options = {}) {
  const local = options.isVisibleElement || (() => true);
  const local2 = options.extractAuthorFromReactFiber || (() => null);
  const local3 = options.normalizeDouyinAuthorProfileUrl || (arg1 => String(arg1 || "").trim());
  const local4 = options.getElementsIncludingRoot || ((arg1, arg2) => {
    if (!arg1?.querySelectorAll) {
      return [];
    }
    return Array.from(arg1.querySelectorAll(arg2));
  });
  const local5 = options.extractSpecificVideoId || (() => "");
  const local6 = options.getModalContainerSelector || (() => "[data-e2e=\"video-detail\"], .video-detail-container");
  function scoreAuthorProfileLink(arg1, arg2 = document) {
    if (!arg1) {
      return -999;
    }
    const result = local3(arg1.href || arg1.getAttribute?.("href") || "");
    if (!result) {
      return -999;
    }
    const local = arg1.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
    if (local) {
      return -999;
    }
    let num = 10;
    const result2 = normalizeAuthorNicknameText(arg1.innerText || arg1.textContent || arg1.getAttribute?.("title") || "");
    if (result2) {
      num += 25;
    }
    if (arg1.closest?.("[data-e2e=\"feed-video-nickname\"], [data-e2e=\"video-author-name\"], .author-card-user-name")) {
      num += 90;
    }
    if (arg1.closest?.("[data-e2e*=\"author\"], [data-e2e*=\"user-name\"], [class*=\"author-name\"], [class*=\"AuthorName\"], [class*=\"nickname\"]")) {
      num += 45;
    }
    if (arg1.closest?.(".video-info-detail, .account-card-container, [class*=\"video-info\"], [class*=\"VideoInfo\"]")) {
      num += 35;
    }
    if (arg1.closest?.("[data-e2e=\"video-desc\"], [data-e2e=\"note-desc\"], [class*=\"desc\"], [class*=\"Desc\"]")) {
      num -= 55;
    }
    try {
      const result = arg1.getBoundingClientRect();
      const local = arg2.getBoundingClientRect?.() || {
        top: 0,
        height: window.innerHeight,
        bottom: window.innerHeight
      };
      const value = result.top - (local.top || 0);
      const local2 = local.height || window.innerHeight;
      if (value >= 0 && value < Math.max(180, local2 * 0.35)) {
        num += 20;
      }
      if (result.top > (local.bottom || window.innerHeight) - 8) {
        num -= 120;
      }
      if (result.top > window.innerHeight * 0.72) {
        num -= 80;
      }
      const value2 = Math.min(result.bottom, local.bottom || window.innerHeight) - Math.max(result.top, local.top || 0);
      if (value2 < Math.min(result.height || 0, 16)) {
        num -= 100;
      }
    } catch (error) {}
    return num;
  }
  function fn2(arg1) {
    if (!arg1) {
      return "";
    }
    const list = [];
    const local = arg1 => {
      const result = String(arg1 || "").trim();
      if (result) {
        list.push(result);
      }
    };
    let local2 = arg1;
    for (let num = 0; num < 8 && local2; num += 1) {
      local(local2.getAttribute?.("href"));
      local(local2.getAttribute?.("to"));
      local(local2.getAttribute?.("data-href"));
      local(local2.dataset?.href);
      local(local2.getAttribute?.("data-user-url"));
      local(local2.getAttribute?.("data-sec-uid"));
      local(local2.getAttribute?.("data-secUid"));
      local(local2.dataset?.secUid);
      const local4 = local2.getAttribute?.("data-sec-uid") || local2.getAttribute?.("data-secUid") || local2.dataset?.secUid || "";
      if (/^[A-Za-z0-9._-]{12,}$/.test(local4) && !/^\d+$/.test(local4)) {
        return local3("https://www.douyin.com/user/" + local4);
      }
      const result = [local2.matches?.("a[href]") ? local2 : null, local2.querySelector?.("a[href*=\"/user/\"], a[href*=\"sec_uid\"], a[href*=\"secUid\"]")].filter(Boolean);
      for (const item of result) {
        local(item.href);
        local(item.getAttribute?.("href"));
      }
      local2 = local2.parentElement;
    }
    for (const item of list) {
      if (/^[A-Za-z0-9._-]{12,}$/.test(item) && !/^\d+$/.test(item) && !item.includes("/")) {
        const result = local3("https://www.douyin.com/user/" + item);
        if (result) {
          return result;
        }
      }
      const result = local3(item);
      if (result) {
        return result;
      }
    }
    return "";
  }
  function fn3(arg1, arg2) {
    const result = normalizeAuthorAccountName(arg2);
    if (!result || !arg1?.getBoundingClientRect) {
      return "";
    }
    const result2 = arg1.getBoundingClientRect();
    const result3 = Array.from(document.querySelectorAll("a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"]"));
    let text = "";
    let value = -Infinity;
    for (const item of result3) {
      if (!local(item)) {
        continue;
      }
      const local2 = item.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
      if (local2) {
        continue;
      }
      const result3 = normalizeAuthorNicknameText(item.innerText || item.textContent || item.getAttribute?.("title") || "");
      if (!result3 || normalizeAuthorAccountName(result3) !== result) {
        continue;
      }
      const result4 = local3(item.href || item.getAttribute?.("href") || "");
      if (!result4) {
        continue;
      }
      const result5 = item.getBoundingClientRect();
      if (result5.top >= result2.bottom - 12) {
        continue;
      }
      if (result5.top > result2.top + result2.height * 0.94) {
        continue;
      }
      const value2 = Math.min(result5.bottom, result2.bottom) - Math.max(result5.top, result2.top);
      const value3 = Math.min(result5.right, result2.right) - Math.max(result5.left, result2.left);
      if (value2 < 8 || value3 < 4) {
        continue;
      }
      const value4 = value2 + Math.min(value3, 60);
      if (value4 > value) {
        value = value4;
        text = result4;
      }
    }
    return text;
  }
  function fn4(arg1, arg2, arg3, arg4) {
    if (!arg4) {
      return "";
    }
    const result = fn2(arg1?.link);
    if (result) {
      return result;
    }
    try {
      const result = local2(arg1?.link, "", {
        maxSteps: 12,
        shallowOnly: true
      });
      if (result?.secUid) {
        const result2 = normalizeAuthorNicknameText(result.nickname || "");
        if (!result2 || normalizeAuthorAccountName(result2) === normalizeAuthorAccountName(arg4)) {
          return local3("https://www.douyin.com/user/" + result.secUid);
        }
      }
    } catch (error) {}
    try {
      const result = local2(arg2, arg3);
      if (result?.secUid) {
        const result2 = normalizeAuthorNicknameText(result.nickname || "");
        const local = result2 && normalizeAuthorAccountName(result2) === normalizeAuthorAccountName(arg4);
        if (local) {
          return local3("https://www.douyin.com/user/" + result.secUid);
        }
      }
    } catch (error) {}
    return fn3(arg2, arg4);
  }
  function findFeedPublisherNearScope(arg1) {
    if (!arg1 || !arg1.getBoundingClientRect) {
      return null;
    }
    const local4 = arg1.getAttribute?.("data-e2e") || "";
    if (!FEED_SCOPE_E2E.includes(local4)) {
      return null;
    }
    const result = arg1.getBoundingClientRect();
    if (result.height < 80 || result.width < 80) {
      return null;
    }
    const result2 = Array.from(document.querySelectorAll("[data-e2e=\"feed-video-nickname\"], [data-e2e=\"video-author-name\"], .author-card-user-name"));
    let local5 = null;
    let value = -Infinity;
    for (const item of result2) {
      if (!local(item)) {
        continue;
      }
      const result2 = item.getBoundingClientRect();
      const value2 = Math.min(result2.bottom, result.bottom) - Math.max(result2.top, result.top);
      const value3 = Math.min(result2.right, result.right) - Math.max(result2.left, result.left);
      if (value2 < Math.min(result2.height || 0, 12) || value3 < 8) {
        continue;
      }
      if (result2.top >= result.bottom - 12) {
        continue;
      }
      if (result2.top > result.top + result.height * 0.94) {
        continue;
      }
      const value4 = item.matches?.("a[href*=\"/user/\"]") ? item : item.closest?.("a[href*=\"/user/\"]") || item.querySelector?.("a[href*=\"/user/\"]") || item;
      let result3 = fn2(value4 || item);
      let result4 = normalizeAuthorNicknameText(value4?.innerText || item.innerText || item.textContent || item.getAttribute?.("title") || "");
      if (!result3 || !result4) {
        try {
          const result = local2(item, "", {
            maxSteps: 12,
            shallowOnly: true
          });
          if (!result3 && result?.secUid) {
            result3 = local3("https://www.douyin.com/user/" + result.secUid);
          }
          if (!result4 && result?.nickname) {
            result4 = normalizeAuthorNicknameText(result.nickname);
          }
        } catch (error) {}
      }
      if (!result3 && !result4) {
        continue;
      }
      let value5 = value2 + Math.min(value3, 80);
      if (result3) {
        value5 += 40;
      }
      if (result4) {
        value5 += 20;
      }
      if (item.getAttribute?.("data-e2e") === "feed-video-nickname") {
        value5 += 30;
      }
      value5 += Math.max(0, 120 - Math.abs(result2.top + result2.height / 2 - (result.top + result.height * 0.72)));
      if (value5 > value) {
        value = value5;
        local5 = {
          link: value4 || item,
          href: result3,
          nickname: result4
        };
      }
    }
    return local5;
  }
  function pickBestAuthorProfileLink(arg1) {
    if (!arg1) {
      return null;
    }
    const result = findFeedPublisherNearScope(arg1);
    if (result?.link && result.href) {
      return result.link;
    }
    const result2 = local4(arg1, "a[href*=\"/user/\"], a[href*=\"douyin.com/user/\"], [data-e2e*=\"author\"] a[href], [data-e2e*=\"user\"] a[href]");
    let local = null;
    let num = 40;
    for (const item of result2) {
      const result = scoreAuthorProfileLink(item, arg1);
      if (result > num) {
        local = item;
        num = result;
      }
    }
    return local;
  }
  function findDouyinAuthorProfileUrlInRoot(arg1, text = "") {
    if (!arg1) {
      return "";
    }
    const result = findFeedPublisherNearScope(arg1);
    if (result?.href) {
      return result.href;
    }
    const result2 = pickBestAuthorProfileLink(arg1);
    if (result2) {
      const result = local3(result2.href || result2.getAttribute?.("href") || "");
      if (result) {
        return result;
      }
    }
    try {
      const result = local2(arg1, text);
      if (result?.secUid) {
        return "https://www.douyin.com/user/" + result.secUid;
      }
    } catch (error) {}
    if (local5(text)) {
      return "";
    }
    const list = [arg1, ...Array.from(arg1.querySelectorAll?.("*") || []).slice(0, 180)];
    for (const item of list) {
      const local = item.getAttributeNames?.() || [];
      for (const item2 of local) {
        const result = String(item.getAttribute?.(item2) || "").trim();
        if (!result) {
          continue;
        }
        const list = [result];
        if (/%(?:2f|3a)/i.test(result)) {
          try {
            list.push(decodeURIComponent(result));
          } catch (error) {}
        }
        for (const item of list) {
          const result = local3(item);
          if (result) {
            return result;
          }
          const result2 = item.match(/(?:https?:)?\/\/(?:www\.)?douyin\.com\/user\/[^?&#"'\s<>]+|\/user\/[^?&#"'\s<>]+/i);
          const result3 = local3(result2?.[0] || "");
          if (result3) {
            return result3;
          }
        }
        if (/^(?:data-)?(?:author-)?sec[-_]?uid$/i.test(item2) && /^[A-Za-z0-9._-]{12,}$/.test(result) && !/^\d+$/.test(result)) {
          return "https://www.douyin.com/user/" + result;
        }
      }
    }
    return "";
  }
  function getVideoAuthorNickname(arg1 = null, text = "") {
    try {
      const local3 = arg1 || document;
      const result = pickBestAuthorProfileLink(local3);
      const result2 = normalizeAuthorNicknameText(result?.innerText || result?.textContent || result?.getAttribute?.("title") || "");
      if (result2) {
        return result2;
      }
      const value = local3.matches?.("[data-e2e=\"feed-video-nickname\"]") ? local3 : local3.querySelector?.("[data-e2e=\"feed-video-nickname\"]");
      const result3 = normalizeAuthorNicknameText(value?.innerText || "");
      if (result3) {
        return result3;
      }
      const local4 = local3.querySelector?.(local6()) || local3;
      const result4 = [local4.querySelector?.(".video-info-detail"), local4.querySelector?.(".account-card-container"), local4.querySelector?.("[class*=\"video-info\"]"), local4, local3].filter(Boolean);
      for (const item of result4) {
        const result = Array.from(item.querySelectorAll?.("a[href*=\"/user/\"]") || []).filter(arg1 => {
          const local2 = arg1.href || "";
          if (!local2.includes("/user/") || local2.includes("/user/self")) {
            return false;
          }
          return local(arg1);
        });
        for (const item of result) {
          const result = item.closest("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
          if (result) {
            continue;
          }
          const result2 = normalizeAuthorNicknameText(item.innerText || item.getAttribute("title") || "");
          if (result2) {
            return result2;
          }
        }
      }
      const list = [".account-name", ".author-card-user-name", "[class*=\"author-name\"]", "[class*=\"AccountName\"]", "[data-e2e=\"video-author-name\"]"];
      for (const item of list) {
        const local = local3.querySelector?.(item);
        const result = normalizeAuthorNicknameText(local?.innerText || "");
        if (result) {
          return result;
        }
      }
      try {
        const result = local2(local3, text);
        const result2 = normalizeAuthorNicknameText(result?.nickname || "");
        if (result2) {
          return result2;
        }
      } catch (error) {}
    } catch (error) {}
    return "";
  }
  function getVideoAuthorProfileUrl(arg1 = null, text = "") {
    try {
      const local = arg1 || document;
      const list = [...new Set([local.querySelector?.(local6()), local.querySelector?.(".video-info-detail"), local.querySelector?.(".account-card-container"), local, ...(arg1 ? [] : [document.querySelector?.(local6()), document.querySelector?.(".video-info-detail"), document.querySelector?.(".account-card-container"), document])].filter(Boolean))];
      for (const item of list) {
        const result = findDouyinAuthorProfileUrlInRoot(item, text);
        if (result) {
          return result;
        }
      }
      if (!arg1) {
        for (const item of list.slice(0, -1)) {
          const result = findDouyinAuthorProfileUrlInRoot(item);
          if (result) {
            return result;
          }
        }
      }
      try {
        const result = local2(local, text);
        if (result?.secUid) {
          return "https://www.douyin.com/user/" + result.secUid;
        }
      } catch (error) {}
    } catch (error) {}
    return "";
  }
  function getVideoAuthorInfo(arg1 = null, text = "") {
    const local = arg1 || document;
    const local4 = local.getAttribute?.("data-e2e") || "";
    const result = FEED_SCOPE_E2E.includes(local4);
    const result2 = findFeedPublisherNearScope(local);
    let local5 = result2?.href || "";
    let local6 = result2?.nickname || "";
    if (result && result2 && local6 && !local5) {
      local5 = fn4(result2, local, text, local6);
    } else if (!result || !result2) {
      if (!local5) {
        local5 = getVideoAuthorProfileUrl(local, text);
      }
      if (!local6) {
        local6 = normalizeAuthorNicknameText(getVideoAuthorNickname(local, text));
      }
    }
    if (local5) {
      const local4 = Array.from(document.querySelectorAll?.("a[href*=\"/user/\"]") || []).find(arg1 => {
        const local = arg1.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
        if (local) {
          return false;
        }
        return local3(arg1.href || arg1.getAttribute?.("href") || "") === local5;
      }) || (result2?.href === local5 ? result2.link : null);
      const result3 = normalizeAuthorNicknameText(local4?.innerText || local4?.textContent || local4?.getAttribute?.("title") || "");
      if (result3) {
        if (!local6 || normalizeAuthorAccountName(result3) === normalizeAuthorAccountName(local6)) {
          local6 = result3;
        }
      } else if (!local6 && (!result || !result2)) {
        try {
          const result = local2(local, text);
          const value = result?.secUid ? local3("https://www.douyin.com/user/" + result.secUid) : "";
          if (value === local5 && result?.nickname) {
            local6 = normalizeAuthorNicknameText(result.nickname);
          }
        } catch (error) {}
      }
    }
    return {
      nickname: local6 || "",
      profileUrl: local5 || "",
      source: result2 ? local5 && local6 ? "feed-publisher" : "feed-publisher-partial" : "scoped-fallback"
    };
  }
  return {
    normalizeAuthorNicknameText: normalizeAuthorNicknameText,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    scoreAuthorProfileLink: scoreAuthorProfileLink,
    findFeedPublisherNearScope: findFeedPublisherNearScope,
    pickBestAuthorProfileLink: pickBestAuthorProfileLink,
    findDouyinAuthorProfileUrlInRoot: findDouyinAuthorProfileUrlInRoot,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoAuthorProfileUrl: getVideoAuthorProfileUrl,
    getVideoAuthorInfo: getVideoAuthorInfo
  };
}
module.exports = {
  createDouyinVideoAuthorApi: createDouyinVideoAuthorApi,
  normalizeAuthorNicknameText: normalizeAuthorNicknameText,
  normalizeAuthorAccountName: normalizeAuthorAccountName,
  parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
  matchExcludedVideoAuthor: matchExcludedVideoAuthor
};
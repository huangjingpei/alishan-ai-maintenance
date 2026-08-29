'use strict';

const {
  sanitizeInlinePageScript
} = require("./sanitizeInlinePageScript");
function createDouyinSearchMetadataController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    applyEntryMetaToLead: applyEntryMetaToLead,
    clipTraceText: clipTraceText,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserIdFromUrl: extractUserIdFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    getPlannedVideoCountForDisplay: getPlannedVideoCountForDisplay,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getSearchApiReadyTracker: getSearchApiReadyTracker,
    getRuntimeApiHooks: getRuntimeApiHooks,
    getVideoSearchScrapePolicyModule: getVideoSearchScrapePolicyModule,
    ipcRenderer: ipcRenderer,
    isVisibleElement: isVisibleElement,
    loadCreateDouyinVideoAuthorApi: loadCreateDouyinVideoAuthorApi,
    matchExcludedVideoAuthor: matchExcludedVideoAuthor,
    matchTitleKeywordList: matchTitleKeywordList,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    parseExcludeAuthorAccounts: parseExcludeAuthorAccounts,
    parseTitleKeywordList: parseTitleKeywordList,
    reportTraceLog: reportTraceLog,
    sleep: sleep,
    preloadDir: preloadDir,
    state: state
  } = options;
  const local = preloadDir;
  function fn(arg1) {
    if (!arg1) {
      return null;
    }
    let local = null;
    try {
      const result = Object.getOwnPropertyNames(arg1);
      local = result.find(arg1 => arg1.startsWith("__reactProps") || arg1.startsWith("__reactFiber"));
    } catch (error) {
      return null;
    }
    if (!local) {
      return null;
    }
    const value = arg1[local];
    if (!value) {
      return null;
    }
    const set = new Set();
    function fn(arg1, num = 0) {
      if (num > 12) {
        return null;
      }
      if (!arg1 || typeof arg1 !== "object") {
        return null;
      }
      if (set.has(arg1)) {
        return null;
      }
      set.add(arg1);
      for (const item in arg1) {
        try {
          const value = arg1[item];
          if (typeof value === "string" || typeof value === "number") {
            const result = String(value);
            if (/^\d{19}$/.test(result)) {
              if (/id|aweme|group|item/i.test(item)) {
                return result;
              }
            }
          } else if (typeof value === "object" && value !== null) {
            if (item === "stateNode" || item === "child" || item === "sibling" || item === "return" || item === "alternate") {
              continue;
            }
            const result = fn(value, num + 1);
            if (result) {
              return result;
            }
          }
        } catch (error) {}
      }
      return null;
    }
    return fn(value);
  }
  function findAwemeIdForCard(arg1) {
    let result = fn(arg1);
    if (result) {
      return result;
    }
    const result2 = arg1.querySelectorAll("*");
    for (const item of result2) {
      result = fn(item);
      if (result) {
        return result;
      }
    }
    return null;
  }
  function fn3(arg1) {
    const result = String(arg1 || "");
    if (!result) {
      return "";
    }
    const result2 = result.match(/\/(?:video|note)\/(\d{15,})/);
    if (result2?.[1]) {
      return result2[1];
    }
    const result3 = result.match(/[?&](?:modal_id|vid|aweme_id)=(\d{15,})/i);
    if (result3?.[1]) {
      return result3[1];
    }
    const result4 = result.match(/waterfall[_-]?item[_-]?(\d{15,})/i);
    if (result4?.[1]) {
      return result4[1];
    }
    const result5 = result.match(/(?:aweme[_-]?id|item[_-]?id|group[_-]?id|modal[_-]?id|vid|aweme|group|item)["'\s:=/%_-]*(\d{15,})/i);
    return result5?.[1] || "";
  }
  function fn4(arg1) {
    if (!arg1) {
      return "";
    }
    const text = "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"], a[href*=\"vid=\"]";
    const list = [];
    if (arg1.matches?.(text)) {
      list.push(arg1);
    }
    list.push(...Array.from(arg1.querySelectorAll?.(text) || []));
    for (const item of list) {
      const result = extractVideoIdFromHref(item.href || item.getAttribute("href"));
      if (result) {
        return result;
      }
    }
    return "";
  }
  function fn5(arg1) {
    if (!arg1) {
      return "";
    }
    const local = arg1 => {
      for (const item of Array.from(arg1.attributes || [])) {
        const result = fn3(item.value);
        if (result) {
          return result;
        }
      }
      return "";
    };
    const list = [];
    const local2 = arg1 => {
      if (arg1 && !list.includes(arg1)) {
        list.push(arg1);
      }
    };
    local2(arg1);
    local2(arg1.closest?.("[id^=\"waterfall_item_\"]"));
    for (let value = arg1.parentElement, num = 0; value && num < 3; value = value.parentElement, num++) {
      local2(value);
    }
    for (const item of list) {
      const result = local(item);
      if (result) {
        return result;
      }
    }
    const result = Array.from(arg1.querySelectorAll?.("[href], [data-e2e], [data-id], [data-aweme-id], [data-item-id], [data-log-extra], [data-log], [data-key]") || []).slice(0, 120);
    for (const item of result) {
      const result = local(item);
      if (result) {
        return result;
      }
    }
    return "";
  }
  function fn6(arg1) {
    if (!arg1) {
      return false;
    }
    const result = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    if (/相关搜索|大家都在搜|猜你想搜|搜索历史|热搜榜/.test(result)) {
      return false;
    }
    if (/抖音号\s*[:：]/i.test(result) || /获赞/.test(result) && /粉丝/.test(result)) {
      return false;
    }
    if (fn4(arg1)) {
      return true;
    }
    const local = arg1.querySelector?.(".videoImage, [class*=\"videoImage\"], [class*=\"VideoImage\"], [class*=\"cover\"], [class*=\"Cover\"], img, video, canvas");
    if (local) {
      try {
        const result = local.getBoundingClientRect();
        if (result.width >= 48 && result.height >= 48) {
          return true;
        }
      } catch (error) {
        return true;
      }
    }
    if (/\b\d{1,2}:\d{2}\b/.test(result) && (/@/.test(result) || /万|点赞|评论|收藏/.test(result))) {
      return true;
    }
    return false;
  }
  function findDouyinSearchCardContentId(arg1) {
    const list = [];
    const local = arg1 => {
      if (arg1 && !list.includes(arg1)) {
        list.push(arg1);
      }
    };
    local(arg1);
    local(arg1.closest?.("[id^=\"waterfall_item_\"]"));
    for (let value = arg1.parentElement, num = 0; value && num < 3; value = value.parentElement, num++) {
      local(value);
    }
    for (const item of list) {
      const result = fn4(item);
      if (result) {
        return result;
      }
    }
    if (!fn6(arg1)) {
      return "";
    }
    for (const item of list) {
      const result = fn5(item);
      if (result) {
        return result;
      }
    }
    const result = String(arg1?.className || "");
    const local2 = /video|aweme|note|cover|search-result|SearchResult/i.test(result) || !!arg1.querySelector?.("video, [class*=\"video\"], [class*=\"Video\"], [class*=\"aweme\"], [class*=\"Aweme\"], [class*=\"cover\"], [class*=\"Cover\"]");
    if (!local2) {
      return "";
    }
    return findAwemeIdForCard(arg1) || "";
  }
  function getDouyinSearchCardClickTarget(arg1) {
    const result = ["a[href*=\"/video/\"]", "a[href*=\"/note/\"]", "a[href*=\"modal_id=\"]", "a[href*=\"aweme_id=\"]", "[role=\"link\"]", "video", "[class*=\"videoImage\"]", "[class*=\"VideoImage\"]", "[class*=\"cover\"]", "[class*=\"Cover\"]", "img", "canvas"].join(", ");
    const result2 = Array.from(arg1.querySelectorAll?.(result) || []).find(isVisibleElement);
    return result2 || arg1;
  }
  function fn9() {
    const local = document.querySelector("main") || document.body;
    if (!local?.querySelectorAll) {
      return [];
    }
    const list = [];
    const set = new Set();
    const local2 = arg1 => {
      if (!arg1 || set.has(arg1) || !isVisibleElement(arg1)) {
        return;
      }
      const result = arg1.getBoundingClientRect();
      if (result.width < 72 || result.height < 72) {
        return;
      }
      if (result.width > window.innerWidth * 0.92) {
        return;
      }
      if (result.top > window.innerHeight + 160) {
        return;
      }
      set.add(arg1);
      list.push(arg1);
    };
    const result = Array.from(local.querySelectorAll("img, video, canvas")).filter(isVisibleElement);
    for (const item of result) {
      let local;
      try {
        local = item.getBoundingClientRect();
      } catch (error) {
        continue;
      }
      if (local.width < 72 || local.height < 72 || local.width > 720) {
        continue;
      }
      if (local.top > window.innerHeight + 120 || local.bottom < -40) {
        continue;
      }
      let local3 = null;
      let value = item.parentElement;
      for (let num = 0; value && num < 8; value = value.parentElement, num += 1) {
        const set = new Set(fn10(value, "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"]").map(arg1 => extractSpecificVideoId(arg1.href || arg1.getAttribute?.("href") || "")).filter(Boolean));
        if (set.size > 1) {
          break;
        }
        const local = fn4(value) || fn5(value) || (fn6(value) ? "struct" : "");
        if (!local) {
          continue;
        }
        local3 = value;
        if (value.id?.startsWith?.("waterfall_item_") || /search-result|SearchResult|result-card|ResultCard|waterfall|WaterFall/i.test(String(value.className || ""))) {
          break;
        }
      }
      if (local3) {
        local2(local3);
      }
    }
    return list;
  }
  function collectDouyinSearchResultCards() {
    const local = document.querySelector("main") || document.body;
    const result = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e=\"search-result-card\"]", "[data-e2e*=\"search-result\"]", "[data-e2e*=\"search_result\"]", "[data-e2e*=\"scroll-list\"] [id*=\"item\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"result-card\"]", "[class*=\"ResultCard\"]", "[class*=\"search-card\"]", "[class*=\"SearchCard\"]", "[class*=\"video-card\"]", "[class*=\"VideoCard\"]", "[class*=\"WaterFall\"]", "[class*=\"waterfall\"]", "[class*=\"Waterfall\"]"].join(", ");
    const result2 = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e*=\"search\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"search-card\"]", "[class*=\"VideoCard\"]", "[class*=\"waterfall\"]", "[class*=\"WaterFall\"]", "[class*=\"card\"]", "[class*=\"Card\"]", "article", "li"].join(", ");
    const list = [];
    const set = new Set();
    const local2 = arg1 => {
      if (!arg1 || set.has(arg1) || !isVisibleElement(arg1)) {
        return;
      }
      const result = arg1.getBoundingClientRect();
      if (result.width < 40 || result.height < 30) {
        return;
      }
      set.add(arg1);
      list.push(arg1);
    };
    Array.from(local.querySelectorAll(result)).forEach(local2);
    Array.from(local.querySelectorAll("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"], a[href*=\"vid=\"]")).forEach(arg1 => {
      local2(arg1.closest(result2) || arg1);
    });
    fn9().forEach(local2);
    return list;
  }
  function fn12(arg1 = state.currentTask) {
    const result = getVideoSearchScrapePolicyModule();
    if (result?.getScrapeTargetSet) {
      return result.getScrapeTargetSet(arg1);
    }
    const set = new Set(["comments", "video", "author"]);
    const value = Array.isArray(arg1?.scrapeTargets) ? arg1.scrapeTargets.filter(arg1 => set.has(arg1)) : [];
    return new Set(value.length > 0 ? value : ["comments"]);
  }
  function fn13(arg1 = state.currentTask) {
    const result = getVideoSearchScrapePolicyModule();
    if (result?.isLinkOnlyScrapeTask) {
      return result.isLinkOnlyScrapeTask(arg1);
    }
    if (arg1?.taskMode !== "scrape") {
      return false;
    }
    const result2 = fn12(arg1);
    return !result2.has("comments") && (result2.has("video") || result2.has("author"));
  }
  function fn14(arg1 = state.currentTask) {
    const result = getVideoSearchScrapePolicyModule();
    if (result?.hasMinVideoStatFilters) {
      return result.hasMinVideoStatFilters(arg1);
    }
    return ["minVideoLike", "minVideoComment", "minVideoCollect", "minVideoShare"].some(arg12 => (parseInt(arg1?.[arg12]) || 0) > 0);
  }
  function fn15(arg1 = state.currentTask) {
    const result = getVideoSearchScrapePolicyModule();
    if (result?.canLinkOnlyScrapeWithoutOpen) {
      return result.canLinkOnlyScrapeWithoutOpen(arg1);
    }
    return fn13(arg1) && !fn14(arg1);
  }
  function shouldCollectScrapeVideoMetadata(arg1 = state.currentTask) {
    if (arg1?.taskMode !== "scrape") {
      return false;
    }
    const result = fn12(arg1);
    return result.has("video") || result.has("author");
  }
  const map = new Map();
  let flag = false;
  let flag2 = false;
  function fn17(options = {}) {
    const value = Array.isArray(options.awemes) ? options.awemes : [];
    if (!value.length) {
      return 0;
    }
    let num = 0;
    value.forEach(arg1 => {
      const result = String(arg1?.videoId || "").trim();
      if (!/^\d{5,}$/.test(result)) {
        return;
      }
      const local = map.get(result) || {};
      const local2 = normalizeDouyinAuthorProfileUrl(arg1.authorUrl || "") || local.authorUrl || "";
      const result2 = String(arg1.authorNickname || local.authorNickname || "").trim().replace(/^@+/, "");
      const obj = {
        videoId: result,
        videoUrl: normalizeUrl(arg1.videoUrl || local.videoUrl || "") || "https://www.douyin.com/video/" + result,
        title: String(arg1.title || local.title || "").trim(),
        authorNickname: result2,
        authorUrl: local2,
        createTime: Number(arg1.createTime || local.createTime || 0) || 0,
        updatedAt: Date.now()
      };
      map.set(result, obj);
      num += 1;
    });
    if (map.size > 800) {
      const result = [...map.keys()].slice(0, map.size - 600);
      result.forEach(arg1 => map.delete(arg1));
    }
    return num;
  }
  function lookupLeadgenScrapeAweme(arg1) {
    const local = extractSpecificVideoId(arg1) || String(arg1 || "").trim();
    if (!local) {
      return null;
    }
    return map.get(local) || null;
  }
  async function waitLeadgenScrapeAwemeAuthor(arg1, num = 2200) {
    const result = Date.now();
    let result2 = lookupLeadgenScrapeAweme(arg1);
    if (result2?.authorUrl) {
      return result2;
    }
    while (Date.now() - result < num) {
      await sleep(280);
      result2 = lookupLeadgenScrapeAweme(arg1);
      if (result2?.authorUrl) {
        return result2;
      }
    }
    return result2;
  }
  function ensureLeadgenScrapeApiBridge() {
    if (flag2) {
      return;
    }
    flag2 = true;
    document.addEventListener("__radar_leadgen_scrape_api", arg1 => {
      try {
        const local = arg1?.detail || {};
        const result = fn17(local);
        if (result > 0) {
          console.log("[LeadgenScrape][API] +" + result + " aweme cache=" + map.size);
        }
        try {
          getSearchApiReadyTracker().noteApiDetail(local);
        } catch (error) {}
      } catch (error) {
        console.warn("[LeadgenScrape][API] bridge error:", error?.message || error);
      }
    });
  }
  function clearLeadgenScrapeAwemeCache(text = "") {
    const value = map.size;
    map.clear();
    if (value > 0) {
      console.log("[LeadgenScrape][API] cleared " + value + (text ? " (" + text + ")" : ""));
    }
  }
  ensureLeadgenScrapeApiBridge();
  try {
    ipcRenderer.on("entity-leadgen-clear-scrape-aweme", (arg1, options = {}) => {
      clearLeadgenScrapeAwemeCache(options?.reason || "entity");
      ensureLeadgenScrapeApiHook({
        force: true
      });
    });
  } catch (error) {}
  function ensureLeadgenScrapeApiHook(options = {}) {
    const value = state.currentRunningSource === "search";
    if (!options.force && !fn13(state.currentTask) && !value) {
      return false;
    }
    ensureLeadgenScrapeApiBridge();
    if (flag || window.__radar_leadgen_scrape_api_hooked) {
      flag = true;
      return true;
    }
    let text = "";
    try {
      const result = (() => {
        try {
          return require("path");
        } catch (error) {
          return null;
        }
      })();
      const list = ["./shared/leadgenScrapeApiHook", "./shared/leadgenScrapeApiHook.js"];
      if (result && typeof local === "string") {
        list.push(result.join(local, "shared", "leadgenScrapeApiHook.js"), result.join(local, "..", "shared", "leadgenScrapeApiHook.js"));
      }
      for (const item of list) {
        try {
          const result = require(item);
          if (typeof result?.getLeadgenScrapeApiHookInstaller === "function") {
            const value = typeof getRuntimeApiHooks === "function" ? getRuntimeApiHooks() : null;
            text = result.getLeadgenScrapeApiHookInstaller(value);
            break;
          }
        } catch (error) {}
      }
    } catch (error) {}
    if (!text) {
      console.warn("[LeadgenScrape][API] installer module missing");
      return false;
    }
    try {
      const result = document.createElement("script");
      result.textContent = sanitizeInlinePageScript(text);
      (document.documentElement || document.head || document.body).appendChild(result);
      result.remove();
      flag = true;
      console.log("[LeadgenScrape][API] hook installed");
      return true;
    } catch (error) {
      console.warn("[LeadgenScrape][API] inject failed:", error?.message || error);
      return false;
    }
  }
  function resolveSearchCardScrapeFields(arg1, arg2) {
    const value = fn13(state.currentTask) ? lookupLeadgenScrapeAweme(arg2) : null;
    let local = value?.authorUrl || "";
    let local2 = value?.authorNickname || "";
    let local3 = value?.title || "";
    if (!local) {
      local = findSearchCardAuthorProfileUrl(arg1);
    }
    if (!local2) {
      local2 = findSearchCardAuthorNickname(arg1, local);
    }
    if (!local3) {
      local3 = fn27(arg1, local2);
    }
    local3 = String(local3 || "").trim() || "未知视频";
    const local4 = normalizeUrl(value?.videoUrl || arg2 || "") || arg2;
    return {
      videoUrl: local4,
      authorUrl: local,
      authorNickname: local2,
      title: local3,
      fromApi: !!value
    };
  }
  function listLeadgenScrapeAwemes() {
    return Array.from(map.values());
  }
  async function emitLinkOnlyScrapeLead({
    videoUrl: videoUrl2,
    title = "未知视频",
    authorNickname = "",
    authorUrl = "",
    source = "api_json",
    likedBoundaryUrls = null
  } = {}) {
    let local = normalizeUrl(videoUrl2 || "") || String(videoUrl2 || "").trim();
    if (!local) {
      return {
        emitted: false,
        reason: "no_url"
      };
    }
    const result = fn12(state.currentTask);
    const result2 = result.has("author");
    if (state.sessionProcessedCount >= getPlannedVideoCountForDisplay(state.currentRunningSource, state.currentTask)) {
      return {
        emitted: false,
        reason: "target_reached"
      };
    }
    if (Array.isArray(likedBoundaryUrls) && likedBoundaryUrls.length > 0) {
      const result = likedBoundaryUrls.some(arg1 => {
        const result = extractSpecificVideoId(arg1);
        const result2 = extractSpecificVideoId(local);
        return result && result2 && result === result2 || normalizeUrl(arg1) === local;
      });
      if (!result) {
        return {
          emitted: false,
          reason: "outside_like_boundary"
        };
      }
    }
    let result3 = lookupLeadgenScrapeAweme(local);
    if (result2 && !normalizeDouyinAuthorProfileUrl(result3?.authorUrl || authorUrl || "")) {
      result3 = await waitLeadgenScrapeAwemeAuthor(local, 2200);
    }
    let local2 = String(result3?.title || title || "").trim() || "未知视频";
    let result4 = String(result3?.authorNickname || authorNickname || "").trim().replace(/^@+/, "");
    let result5 = normalizeDouyinAuthorProfileUrl(result3?.authorUrl || authorUrl || "");
    if (result3?.videoUrl) {
      local = normalizeUrl(result3.videoUrl) || local;
    }
    const result6 = parseExcludeAuthorAccounts(state.currentTask.excludeAuthorAccounts);
    const result7 = parseTitleKeywordList(state.currentTask.excludeTitleKeywords);
    const result8 = parseTitleKeywordList(state.currentTask.includeTitleKeywords);
    const result9 = matchTitleKeywordList(local2, result7);
    if (result9) {
      getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
      return {
        emitted: false,
        reason: "exclude_title"
      };
    }
    if (result8.length > 0) {
      const result = matchTitleKeywordList(local2, result8);
      if (!result) {
        getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
        return {
          emitted: false,
          reason: "include_title"
        };
      }
    }
    const result10 = matchExcludedVideoAuthor(result4, result6);
    if (result10.excluded) {
      getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
      return {
        emitted: false,
        reason: "exclude_author"
      };
    }
    if (result2 && !result5) {
      console.log("[LeadgenScrape] skip missing_author id=" + (extractSpecificVideoId(local) || "?") + " nick=" + (result4 || "-"));
      return {
        emitted: false,
        reason: "missing_author"
      };
    }
    if (result2 && (!result4 || result4 === "未知作者")) {
      return {
        emitted: false,
        reason: "missing_author"
      };
    }
    const result11 = await ipcRenderer.invoke("claim-processed-video", {
      url: local,
      title: local2,
      authorUrl: result5,
      authorNickname: result4,
      platform: "douyin"
    });
    if (!result11?.claimed) {
      getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local);
      return {
        emitted: false,
        reason: result11?.reason === "already_processed" ? "processed" : "claimed_elsewhere"
      };
    }
    const result12 = buildVideoCardLead({
      videoUrl: local,
      title: local2,
      authorNickname: result4 || "未知作者",
      authorUrl: result5,
      source: result3 ? "api_json" : source
    });
    if (!emitVideoCardLead(result12)) {
      return {
        emitted: false,
        reason: "emit_rejected"
      };
    }
    const local3 = getProcessedVideoKeyModule().normalizeProcessedVideoKey(local) || local;
    getProcessedVideoKeyModule().rememberProcessedVideoKey(state.processedVideos, local3);
    ipcRenderer.send("update-processed-videos", {
      url: local3,
      title: local2,
      authorNickname: result4,
      authorUrl: result5,
      platform: "douyin",
      timestamp: Date.now()
    });
    state.sessionProcessedCount += 1;
    ipcRenderer.send("automation-data", {
      type: "video-processed",
      payload: {
        accountId: window._radar_account_id,
        accountName: window._radar_account_name,
        sessionCount: state.sessionProcessedCount,
        targetCount: getPlannedVideoCountForDisplay(state.currentRunningSource, state.currentTask)
      }
    });
    console.log("[LeadgenScrape] emit ok id=" + (extractSpecificVideoId(local3) || "?") + " author=" + (result4 || "-") + " hasProfile=" + !!result5);
    return {
      emitted: true,
      reason: "ok",
      videoUrl: local3,
      authorUrl: result5
    };
  }
  function fn32(arg1) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return "";
    }
    try {
      const url = new URL(result, window.location.origin);
      if (url.hostname.endsWith("douyin.com")) {
        return url.href;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  }
  function fn10(arg1, arg2) {
    if (!arg1 || !arg2) {
      return [];
    }
    const list = [];
    if (arg1.matches?.(arg2)) {
      list.push(arg1);
    }
    list.push(...Array.from(arg1.querySelectorAll?.(arg2) || []));
    return list;
  }
  function normalizeDouyinAuthorProfileUrl(arg1) {
    const result = fn32(String(arg1 || "").replace(/&amp;/g, "&"));
    const result2 = extractUserIdFromUrl(result);
    if (result2) {
      return "https://www.douyin.com/user/" + result2;
    } else {
      return "";
    }
  }
  function fn33(arg1, text = "", options = {}) {
    if (!arg1) {
      return null;
    }
    const list = [];
    if (arg1 === document || arg1 === document.body) {
      list.push(document.querySelector("[data-e2e=\"feed-active-video\"]"), document.querySelector(".video-info-detail"), document.querySelector(".xgplayer-container"), document.querySelector(".search-result-card .videoImage"), document.querySelector(".search-result-card a"), document.querySelector(".search-result-card"));
    } else if (typeof arg1.querySelector === "function") {
      list.push(arg1.querySelector("[data-e2e=\"feed-video-nickname\"]"), arg1.querySelector("[data-e2e*=\"author\"]"), arg1.querySelector("[data-e2e*=\"user-name\"]"), arg1.querySelector(".author-card-user-name"), arg1.querySelector("[class*=\"author-name\"]"), arg1.querySelector("[class*=\"AuthorName\"]"), arg1.querySelector("span.E3Qz9sDw"), arg1.querySelector(".videoImage"), arg1.querySelector("a[href*=\"/user/\"]"), arg1.querySelector("a[href*=\"/video/\"]"), arg1.querySelector("a[href*=\"/note/\"]"), arg1.querySelector("img"), arg1);
    } else {
      list.push(arg1);
    }
    let local = null;
    let local2 = null;
    for (const item of list.filter(Boolean)) {
      const result = Object.keys(item).find(arg1 => arg1.startsWith("__reactFiber$") || arg1.startsWith("__reactProps$"));
      if (result) {
        local = item;
        local2 = result;
        break;
      }
    }
    if (!local || !local2) {
      return null;
    }
    const result = Math.max(1, Number(options.maxSteps) || 20);
    const flag = !!options.shallowOnly;
    let value = local[local2];
    let num = 0;
    while (value && num < result) {
      const result = [value.pendingProps, value.memoizedProps].filter(Boolean);
      for (const item of result) {
        const result = (flag ? [item.authorInfo, item.author, item.user] : [item.awemeInfo, item.aweme, item.data, item.logParams?.awemeInfo, item.activeAweme, item.currentAweme]).filter(Boolean);
        for (const item of result) {
          if (!flag) {
            try {
              const local = extractSpecificVideoId(text) || extractSpecificVideoId(window.location.href);
              const local2 = item.awemeId || item.aweme_id || item.id || item.gid || item.itemId || item.item_id;
              if (local) {
                if (!local2 || String(local2) !== String(local)) {
                  continue;
                }
              } else {
                continue;
              }
            } catch (error) {
              continue;
            }
          }
          const value = item.authorInfo;
          if (value) {
            const local = value.secUid || value.sec_uid;
            const local2 = value.nickname || value.nickName;
            if (local && typeof local === "string" && local.length > 15 && local2) {
              return {
                secUid: local,
                nickname: String(local2).trim()
              };
            }
          }
          const local = item.author || item;
          const local2 = local.secUid || local.sec_uid;
          const local3 = local.nickname || local.nickName;
          if (local2 && typeof local2 === "string" && local2.length > 15 && local3) {
            return {
              secUid: local2,
              nickname: String(local3).trim()
            };
          }
        }
        if (flag) {
          const local = item.authorInfo || item.author || item.user;
          if (local) {
            const local2 = local.secUid || local.sec_uid;
            const local3 = local.nickname || local.nickName;
            if (local2 && typeof local2 === "string" && local2.length > 15) {
              return {
                secUid: local2,
                nickname: local3 ? String(local3).trim() : ""
              };
            }
          }
          if (item.secUid && typeof item.secUid === "string" && item.secUid.length > 15) {
            return {
              secUid: item.secUid,
              nickname: item.nickname || item.nickName || ""
            };
          }
          if (item.sec_uid && typeof item.sec_uid === "string" && item.sec_uid.length > 15) {
            return {
              secUid: item.sec_uid,
              nickname: item.nickname || item.nickName || ""
            };
          }
        }
      }
      value = value.return;
      num++;
    }
    return null;
  }
  function fn34(arg1) {
    try {
      const result = fn33(arg1);
      if (result) {
        return result.secUid;
      } else {
        return "";
      }
    } catch (error) {
      console.error("[Automation-Preload] extractSecUidFromReactFiber failed:", error);
      return "";
    }
  }
  let local2 = null;
  function getDouyinVideoAuthorApi() {
    if (local2) {
      return local2;
    }
    const result = loadCreateDouyinVideoAuthorApi();
    if (typeof result !== "function") {
      throw new Error("douyinVideoAuthorCapture 未加载：请确认 automation 视图已关闭 sandbox，且 shared/douyinVideoAuthorCapture.js 存在");
    }
    local2 = result({
      isVisibleElement: arg1 => isVisibleElement(arg1),
      extractAuthorFromReactFiber: (arg1, arg2, arg3) => fn33(arg1, arg2, arg3),
      normalizeDouyinAuthorProfileUrl: arg1 => normalizeDouyinAuthorProfileUrl(arg1),
      getElementsIncludingRoot: (arg1, arg2) => fn10(arg1, arg2),
      extractSpecificVideoId: arg1 => extractSpecificVideoId(arg1),
      getModalContainerSelector: () => platformSelectors["douyin.com"].modalContainer
    });
    return local2;
  }
  function fn36(arg1) {
    return getDouyinVideoAuthorApi().normalizeAuthorNicknameText(arg1);
  }
  function fn37(arg1, arg2 = document) {
    return getDouyinVideoAuthorApi().scoreAuthorProfileLink(arg1, arg2);
  }
  function fn38(arg1) {
    return getDouyinVideoAuthorApi().findFeedPublisherNearScope(arg1);
  }
  function fn39(arg1) {
    return getDouyinVideoAuthorApi().pickBestAuthorProfileLink(arg1);
  }
  function fn40(arg1, text = "") {
    return getDouyinVideoAuthorApi().findDouyinAuthorProfileUrlInRoot(arg1, text);
  }
  function getDouyinSearchCardRoot(arg1) {
    if (!arg1) {
      return null;
    }
    const result = [".search-result-card", "[id^=\"waterfall_item_\"]", "[data-e2e*=\"search-result\"]", "[data-e2e*=\"search_result\"]", "[class*=\"search-result\"]", "[class*=\"SearchResult\"]", "[class*=\"result-card\"]", "[class*=\"ResultCard\"]", "[class*=\"search-card\"]", "[class*=\"VideoCard\"]", "[class*=\"waterfall\"]", "[class*=\"WaterFall\"]", "article", "li"].join(", ");
    let local = arg1;
    let value = -1;
    for (let local2 = arg1, num = 0; local2 && num < 9; local2 = local2.parentElement, num += 1) {
      const local3 = local2.getBoundingClientRect?.();
      if (num > 0 && local3 && (local3.width > window.innerWidth * 0.96 || local3.height > window.innerHeight * 1.6)) {
        break;
      }
      const result2 = fn10(local2, "a[href*=\"/video/\"], a[href*=\"/note/\"]");
      const set = new Set(result2.map(arg1 => extractSpecificVideoId(arg1.href || arg1.getAttribute?.("href") || "")).filter(Boolean));
      if (set.size > 1) {
        break;
      }
      const result3 = String(local2.innerText || local2.textContent || "").replace(/\s+/g, " ").trim();
      const flag = !!fn40(local2);
      const flag2 = !!local2.querySelector?.(".author-card-user-name, [data-e2e*=\"author\"], [data-e2e*=\"user-name\"], [class*=\"author-name\"], [class*=\"AuthorName\"], [class*=\"nickname\"]");
      const flag3 = !!local2.querySelector?.("img[alt]:not([alt=\"\"]), [title]:not([title=\"\"]), [aria-label]:not([aria-label=\"\"])");
      const flag4 = !!local2.matches?.(result);
      const value2 = (flag ? 100 : 0) + (flag2 ? 30 : 0) + (flag4 ? 12 : 0) + (flag3 ? 6 : 0) + (result3.length >= 2 ? 4 : 0) + (set.size === 1 ? 8 : 0) + num;
      if (value2 >= value) {
        local = local2;
        value = value2;
      }
    }
    return local;
  }
  function findSearchCardVideoUrl(arg1) {
    if (!arg1) {
      return "";
    }
    const result = fn10(arg1, "a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id=\"], a[href*=\"aweme_id=\"]").find(arg1 => {
      const local = arg1.href || arg1.getAttribute?.("href") || "";
      return !!extractSpecificVideoId(local) || /\/(?:video|note)\//.test(local);
    });
    const local = result?.href || result?.getAttribute?.("href") || "";
    return normalizeUrl(local) || local || "";
  }
  function findSearchCardAuthorProfileUrl(arg1) {
    if (!arg1) {
      return "";
    }
    const result = findSearchCardVideoUrl(arg1);
    const result2 = fn40(arg1, result);
    if (result2) {
      return result2;
    }
    try {
      const result2 = fn33(arg1, result);
      if (result2?.secUid) {
        return "https://www.douyin.com/user/" + result2.secUid;
      }
    } catch (error) {}
    return "";
  }
  function findSearchCardAuthorNickname(arg1, text = "") {
    if (!arg1) {
      return "";
    }
    const result = normalizeDouyinAuthorProfileUrl(text);
    const local = Array.from(arg1.querySelectorAll?.("a[href*=\"/user/\"]") || []).find(arg1 => normalizeDouyinAuthorProfileUrl(arg1.href || arg1.getAttribute?.("href")) === result) || (result ? null : arg1.querySelector?.("a[href*=\"/user/\"]"));
    const local2 = arg1 => {
      const result = String(arg1?.innerText || arg1?.textContent || arg1?.getAttribute?.("title") || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
      if (result && result.length <= 50 && !/^(关注|粉丝|获赞|私信)$/.test(result)) {
        return result;
      } else {
        return "";
      }
    };
    if (result) {
      const result2 = local2(local);
      if (result2) {
        return result2;
      }
      try {
        const result2 = fn33(arg1, findSearchCardVideoUrl(arg1));
        const value = result2?.secUid ? normalizeDouyinAuthorProfileUrl("https://www.douyin.com/user/" + result2.secUid) : "";
        if (value === result && result2?.nickname) {
          return String(result2.nickname).trim().replace(/^@+/, "");
        }
      } catch (error) {}
      return "";
    }
    const result2 = [local, arg1.querySelector?.(".author-card-user-name"), arg1.querySelector?.("[data-e2e=\"feed-video-nickname\"]"), arg1.querySelector?.("[data-e2e*=\"user-name\"]"), arg1.querySelector?.("[data-e2e*=\"author\"]"), arg1.querySelector?.("[class*=\"author-name\"]"), arg1.querySelector?.("[class*=\"AuthorName\"]"), arg1.querySelector?.("[class*=\"nickname\"]")].filter(Boolean);
    for (const item of result2) {
      const local = item.closest?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], [class*=\"comment-item\"], [class*=\"reply-item\"]");
      if (local) {
        continue;
      }
      const result = local2(item);
      if (result) {
        return result;
      }
    }
    try {
      const result = fn33(arg1, findSearchCardVideoUrl(arg1));
      if (result?.nickname) {
        return result.nickname;
      }
    } catch (error) {}
    const result3 = String(arg1.innerText || arg1.textContent || "").split(/\n+/).map(arg1 => arg1.trim()).find(arg1 => /^@[^\s]{1,40}/.test(arg1));
    if (result3) {
      return result3.replace(/^@/, "").split(/\s+/)[0];
    } else {
      return "";
    }
  }
  function fn27(arg1, text = "") {
    if (!arg1) {
      return "";
    }
    const list = ["[data-e2e=\"video-desc\"]", "[data-e2e=\"note-desc\"]", "[data-e2e*=\"note-title\"]", "[data-e2e*=\"note-desc\"]", "[data-e2e*=\"video-title\"]", "[data-e2e*=\"search-card-desc\"]", "[data-e2e*=\"search-result-card-desc\"]", "[class*=\"video-title\"]", "[class*=\"VideoTitle\"]", "[class*=\"note-title\"]", "[class*=\"NoteTitle\"]", "[class*=\"note-desc\"]", "[class*=\"NoteDesc\"]", "[class*=\"desc\"]", "[class*=\"Desc\"]", "[class*=\"title\"]", "[class*=\"Title\"]", "h1", "h2", "h3"];
    const local = arg1 => {
      const result = String(arg1 || "").replace(/\s+/g, " ").trim();
      if (!result || result.length < 2 || result.length > 240) {
        return "";
      }
      if (/^(图片|图文|笔记|封面|视频|播放|查看详情|点击查看|抖音|关注|点赞|评论|收藏|分享)$/i.test(result)) {
        return "";
      }
      if (/^https?:\/\//i.test(result) || /^\d+(?:\.\d+)?[万wkW]?$/.test(result) || /^\d{1,2}:\d{2}$/.test(result)) {
        return "";
      }
      if (text && normalizeAuthorAccountName(result) === normalizeAuthorAccountName(text)) {
        return "";
      }
      return result.slice(0, 100);
    };
    for (const item of list) {
      const result = Array.from(arg1.querySelectorAll?.(item) || []);
      for (const item of result) {
        const result = local(item.innerText || item.textContent || "");
        if (result) {
          return result;
        }
      }
    }
    const list2 = [arg1, ...Array.from(arg1.querySelectorAll?.("a[title], a[aria-label], img[alt], [title], [aria-label]") || [])];
    for (const item of list2) {
      for (const item2 of ["title", "aria-label", "alt"]) {
        const result = local(item?.getAttribute?.(item2));
        if (result) {
          return result;
        }
      }
    }
    const result = String(arg1.innerText || arg1.textContent || "").split(/\n+/).map(arg1 => arg1.replace(/\s+/g, " ").trim()).find(arg1 => !arg1.startsWith("@") && local(arg1));
    return local(result);
  }
  function buildVideoCardLead({
    videoUrl: videoUrl,
    title: title,
    authorNickname: authorNickname,
    authorUrl: authorUrl,
    source = "search_card"
  } = {}) {
    const result = normalizeUrl(videoUrl || "");
    const local = extractSpecificVideoId(result) || String(result).replace(/\W+/g, "").slice(-40) || String(Date.now());
    const result2 = fn12(state.currentTask);
    const result3 = Date.now();
    const obj = {
      platform: "DY",
      leadKind: "video_card",
      leadId: "video:" + local,
      key: "video:" + local,
      type: "LEAD",
      title: String(title || "未知视频").trim() || "未知视频",
      nickname: String(authorNickname || "未知作者").trim() || "未知作者",
      content: "",
      timeText: "卡片采集",
      url: result,
      videoUrl: result,
      userUrl: result2.has("author") ? String(authorUrl || "").trim() : "",
      authorProfileUrl: result2.has("author") ? String(authorUrl || "").trim() : "",
      timestamp: result3,
      capturedAt: new Date(result3).toISOString(),
      isHighIntention: false,
      thought: source === "search_card" ? "仅采集：从搜索结果卡片获取视频与作者信息，未展开评论区" : "仅采集：记录当前视频与作者信息，未展开评论区",
      accountId: state.currentTask?.accountId || "default",
      accountName: window._radar_account_name || state.currentTask?.nickname || state.currentTask?.name || "默认账号",
      taskName: state.currentTask?.taskName || "未命名任务",
      actions: {
        liked: false,
        replied: false
      },
      collectedFields: [...result2]
    };
    applyEntryMetaToLead(obj);
    return obj;
  }
  function emitVideoCardLead(arg1) {
    if (!arg1?.videoUrl) {
      return false;
    }
    const set = new Set(Array.isArray(arg1.collectedFields) && arg1.collectedFields.length ? arg1.collectedFields : [...fn12(state.currentTask)]);
    if (set.has("author")) {
      const result = normalizeDouyinAuthorProfileUrl(arg1.authorProfileUrl || arg1.userUrl || "");
      const result2 = String(arg1.nickname || arg1.authorNickname || "").trim();
      if (!result || !result2 || result2 === "未知作者") {
        return false;
      }
    }
    if (set.has("video") && !arg1.videoUrl && !arg1.url) {
      return false;
    }
    ipcRenderer.send("automation-data", {
      type: "comment",
      payload: [arg1],
      taskId: state.activeLoopId,
      viewKey: state.currentTask?.viewKey,
      isAiMode: false
    });
    return true;
  }
  function fn43(arg1, num = 8) {
    return Array.from(document.querySelectorAll(arg1)).filter(isVisibleElement).slice(0, num).map(arg1 => {
      const result = arg1.getBoundingClientRect();
      return {
        tag: arg1.tagName,
        text: clipTraceText((arg1.innerText || arg1.textContent || "").replace(/\s+/g, " "), 120),
        href: clipTraceText(arg1.href || arg1.getAttribute?.("href") || "", 180),
        className: clipTraceText(String(arg1.className || ""), 120),
        dataE2e: clipTraceText(arg1.getAttribute?.("data-e2e") || "", 80),
        rect: Math.round(result.width) + "x" + Math.round(result.height) + "@" + Math.round(result.left) + "," + Math.round(result.top)
      };
    });
  }
  function fn44() {
    const obj = {
      videoLinks: "a[href*=\"/video/\"]",
      noteLinks: "a[href*=\"/note/\"]",
      modalLinks: "a[href*=\"modal_id=\"]",
      awemeLinks: "a[href*=\"aweme_id=\"]",
      vidLinks: "a[href*=\"vid=\"]",
      allLinks: "a[href]",
      searchResultCards: ".search-result-card",
      dataSearch: "[data-e2e*=\"search\"], [data-e2e*=\"search_result\"], [data-e2e*=\"search-result\"]",
      classSearch: "[class*=\"search\"], [class*=\"Search\"]",
      classCard: "[class*=\"card\"], [class*=\"Card\"]",
      classVideo: "[class*=\"video\"], [class*=\"Video\"]",
      roleLinks: "[role=\"link\"]"
    };
    const obj2 = {};
    for (const [local, local2] of Object.entries(obj)) {
      const result = Array.from(document.querySelectorAll(local2));
      obj2[local] = {
        total: result.length,
        visible: result.filter(isVisibleElement).length
      };
    }
    return obj2;
  }
  function fn45(num = 12) {
    const result = Array.from(document.querySelectorAll("[class], [data-e2e], article, li")).filter(isVisibleElement).filter(arg1 => {
      const value = arg1.tagName + " " + (arg1.className || "") + " " + (arg1.getAttribute?.("data-e2e") || "") + " " + (arg1.innerText || arg1.textContent || "").slice(0, 80);
      return /search|result|card|video|note|aweme|cover|waterfall|feed|content|综合|视频/i.test(value);
    }).slice(0, num);
    return result.map(arg1 => {
      const result = arg1.getBoundingClientRect();
      return {
        tag: arg1.tagName,
        className: clipTraceText(String(arg1.className || ""), 140),
        dataE2e: clipTraceText(arg1.getAttribute?.("data-e2e") || "", 80),
        text: clipTraceText((arg1.innerText || arg1.textContent || "").replace(/\s+/g, " "), 140),
        rect: Math.round(result.width) + "x" + Math.round(result.height) + "@" + Math.round(result.left) + "," + Math.round(result.top)
      };
    });
  }
  function getDouyinSearchZeroDiagnostics({
    standardLinkCount = 0,
    customCardCount = 0
  } = {}) {
    const result = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
    const local = /登录后即可搜索更多精彩视频|扫码登录|验证码登录|密码登录|一键登录|快捷登录|授权登录/.test(result) && !/退出登录|个人主页|我的关注/.test(result);
    const result2 = /没有找到相关|暂无搜索结果|换个关键词试试|搜索结果为空/.test(result);
    return {
      url: window.location.href,
      title: document.title,
      readyState: document.readyState,
      loginGate: local,
      emptyResult: result2,
      standardLinkCount: standardLinkCount,
      customCardCount: customCardCount,
      bodyHint: clipTraceText(result, 260),
      selectorCounts: fn44(),
      visibleLinks: fn43("a[href]", 10),
      candidateSamples: fn45(12)
    };
  }
  function maybeReportDouyinSearchZeroDiagnostics({
    standardLinkCount = 0,
    customCardCount = 0
  } = {}) {
    const result = Date.now();
    const result2 = getDouyinSearchZeroDiagnostics({
      standardLinkCount: standardLinkCount,
      customCardCount: customCardCount
    });
    if (result - state.lastDouyinSearchZeroDiagAt < 15000) {
      return result2;
    }
    state.lastDouyinSearchZeroDiagAt = result;
    console.warn("[Built-in-Debug] [搜索页诊断] 解析结果为 0，页面结构快照:", result2);
    if (result2.loginGate) {
      reportTraceLog("搜索页诊断：页面提示“登录后即可搜索更多精彩视频”，当前搜索结果 DOM 未渲染，请先完成抖音登录。", null, "warning");
    } else if (result2.emptyResult) {
      reportTraceLog("搜索页诊断：页面疑似返回空搜索结果，请检查关键词或筛选条件。", null, "warning");
    } else {
      reportTraceLog("搜索页诊断：未识别到作品卡片，已输出选择器计数和候选 DOM 样本到控制台。", null, "warning");
    }
    const local = result2.selectorCounts || {};
    const result3 = Object.entries(local).map(([arg1, arg12]) => arg1 + ":" + arg12.visible + "/" + arg12.total).join(" ");
    console.warn("[Built-in-Debug] [搜索页诊断] 选择器计数 visible/total => " + result3);
    console.warn("[Built-in-Debug] [搜索页诊断] 可见链接样本:", result2.visibleLinks);
    console.warn("[Built-in-Debug] [搜索页诊断] 候选元素样本:", result2.candidateSamples);
    reportTraceLog("搜索页诊断：" + clipTraceText(result3, 220), null, "warning");
    return result2;
  }
  return {
    buildVideoCardLead: buildVideoCardLead,
    canLinkOnlyScrapeWithoutOpen: fn15,
    collectDouyinSearchResultCards: collectDouyinSearchResultCards,
    emitLinkOnlyScrapeLead: emitLinkOnlyScrapeLead,
    emitVideoCardLead: emitVideoCardLead,
    ensureLeadgenScrapeApiBridge: ensureLeadgenScrapeApiBridge,
    ensureLeadgenScrapeApiHook: ensureLeadgenScrapeApiHook,
    findAwemeIdForCard: findAwemeIdForCard,
    findDouyinSearchCardContentId: findDouyinSearchCardContentId,
    findSearchCardAuthorNickname: findSearchCardAuthorNickname,
    findSearchCardAuthorProfileUrl: findSearchCardAuthorProfileUrl,
    findSearchCardVideoUrl: findSearchCardVideoUrl,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getDouyinSearchCardRoot: getDouyinSearchCardRoot,
    getDouyinSearchZeroDiagnostics: getDouyinSearchZeroDiagnostics,
    getDouyinVideoAuthorApi: getDouyinVideoAuthorApi,
    getScrapeTargetSet: fn12,
    isLinkOnlyScrapeTask: fn13,
    listLeadgenScrapeAwemes: listLeadgenScrapeAwemes,
    lookupLeadgenScrapeAweme: lookupLeadgenScrapeAweme,
    clearLeadgenScrapeAwemeCache: clearLeadgenScrapeAwemeCache,
    maybeReportDouyinSearchZeroDiagnostics: maybeReportDouyinSearchZeroDiagnostics,
    normalizeDouyinAuthorProfileUrl: normalizeDouyinAuthorProfileUrl,
    resolveSearchCardScrapeFields: resolveSearchCardScrapeFields,
    shouldCollectScrapeVideoMetadata: shouldCollectScrapeVideoMetadata,
    waitLeadgenScrapeAwemeAuthor: waitLeadgenScrapeAwemeAuthor
  };
}
module.exports = {
  createDouyinSearchMetadataController: createDouyinSearchMetadataController
};
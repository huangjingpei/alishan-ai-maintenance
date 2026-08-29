const {
  classifyDouyinAuthorIdentity,
  resolveDouyinAuthorIdentityKey
} = require("./douyinAuthorUrl");
const {
  extractDouyinCommentCidFromNode
} = require("./douyinCommentCid");
const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
const {
  filterDouyinCommentContentLines,
  pickDouyinCommentLineText,
  resolveDouyinCommentBodyText,
  isUnusableCommentBodyText,
  isDouyinCommentActionChromeText
} = require("./douyinCommentContentLines");
function createVideoMonitorController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    buildEntityCommentScraperDeps: buildEntityCommentScraperDeps,
    checkBatchAgeFilter: checkBatchAgeFilter,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    closeAllModals: closeAllModals,
    convertToDouyinModalUrl: convertToDouyinModalUrl,
    describeProfileNoWorksReason: describeProfileNoWorksReason,
    describeProfileWorksNotReadyReason: describeProfileWorksNotReadyReason,
    describeReplyEnvironment: describeReplyEnvironment,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureProfileWorksTab: ensureProfileWorksTab,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    evaluateSpecificVideoOpenProgress: evaluateSpecificVideoOpenProgress,
    evaluateTaskGenderFilter: evaluateTaskGenderFilter,
    expandReplies: expandReplies,
    extractSpecificVideoId: extractSpecificVideoId,
    extractUserKeyFromUrl: extractUserKeyFromUrl,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentScrollContainer: findCommentScrollContainer,
    findProfileFollowButtonByText: findProfileFollowButtonByText,
    findProfileVideoCards: findProfileVideoCards,
    findSmartElementQuiet: findSmartElementQuiet,
    formatAgeFilterRangeLabel: formatAgeFilterRangeLabel,
    formatObservedAgeLabel: formatObservedAgeLabel,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getCommentsTotalCount: getCommentsTotalCount,
    getDouyinFeedScope: getDouyinFeedScope,
    getEntityCommentScraperModule: getEntityCommentScraperModule,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getProfilePostListRoot: getProfilePostListRoot,
    getVideoAuthorInfo: getVideoAuthorInfo,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoAuthorProfileUrl: getVideoAuthorProfileUrl,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    getVideoEngagePack: getVideoEngagePack,
    getVideoStats: getVideoStats,
    getVideoTitle: getVideoTitle,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasSpecificVideoTargetInUrl: hasSpecificVideoTargetInUrl,
    ipcRenderer: ipcRenderer,
    isBatchAgeFilterActive: isBatchAgeFilterActive,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isCurrentVideoPauseGuardDrifted: isCurrentVideoPauseGuardDrifted,
    isOnSpecificTargetVideo: isOnSpecificTargetVideo,
    isSpecificVideoDetailReady: isSpecificVideoDetailReady,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    lookupSpecificVideoApiProbe: lookupSpecificVideoApiProbe,
    moveToNextVideo: moveToNextVideo,
    normalizeSpecificVideoKey: normalizeSpecificVideoKey,
    normalizeUrl: normalizeUrl,
    parseLocalizedCountText: parseLocalizedCountText,
    parseProfileWorksCount: parseProfileWorksCount,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    performLike: performLike,
    performProfileActionsLogic: performProfileActionsLogic,
    performProfileFirstWorkComment: performProfileFirstWorkComment,
    performReply: performReply,
    postVideoComment: postVideoComment,
    hasVideoMainCommented: hasVideoMainCommented,
    initVideoMainCommentMemoryFromTask: initVideoMainCommentMemoryFromTask,
    pruneStaleCommentDom: pruneStaleCommentDom,
    queryCommentItemNodes: queryCommentItemNodes,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportMonitorActionProgress: reportMonitorActionProgress,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveCurrentVisibleVideoUrl: resolveCurrentVisibleVideoUrl,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    safeSessionGet: safeSessionGet,
    saveSpecificVideoState: saveSpecificVideoState,
    scrapeDetailedProfile: scrapeDetailedProfile,
    shouldAbort: shouldAbort,
    shouldExpandFoldedCommentReplies: shouldExpandFoldedCommentReplies,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    syncCommentAttachmentRotationFromBatchStorage: syncCommentAttachmentRotationFromBatchStorage,
    toSpecificVideoJingxuanUrl: toSpecificVideoJingxuanUrl,
    waitForCommentDomWarmup: waitForCommentDomWarmup,
    waitForProfileVideoDetailScope: waitForProfileVideoDetailScope,
    waitForProfileWorksReady: waitForProfileWorksReady,
    waitForSmartElement: waitForSmartElement,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitSpecificVideoNavAppear: waitSpecificVideoNavAppear,
    preloadDir: preloadDir,
    state: state
  } = options;
  if (!state) {
    throw new TypeError("createVideoMonitorController requires a runtime state bridge");
  }
  let local;
  function getCommentTimeModule() {
    if (local !== undefined) {
      return local;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./commentTime", "./commentTime.js"];
    if (result && typeof preloadDir === "string") {
      list.push(result.join(preloadDir, "shared", "commentTime.js"), result.join(preloadDir, "shared", "commentTime"), result.join(preloadDir, "..", "shared", "commentTime.js"));
    }
    for (const item of list) {
      try {
        local = require(item);
        return local;
      } catch (error) {}
    }
    local = null;
    return local;
  }
  const result = ["[class*=\"reply-container\"]", "[class*=\"reply-list\"]", "[class*=\"ReplyContainer\"]", "[class*=\"ReplyList\"]", "[class*=\"sub-comment\"]", "[class*=\"SubComment\"]", "[class*=\"subComment\"]", "[data-e2e=\"comment-reply-item\"]", "[data-e2e=\"comment-reply-list\"]", "div[class*=\"reply-item\"]", "div[class*=\"ReplyItem\"]"].join(", ");
  function fn2(arg1) {
    if (!arg1?.querySelectorAll) {
      return arg1;
    }
    try {
      arg1.querySelectorAll(result).forEach(arg1 => {
        try {
          arg1.remove();
        } catch (error) {}
      });
    } catch (error) {}
    return arg1;
  }
  function fn3(arg1, list = []) {
    const result = (Array.isArray(list) ? list : []).slice(0, 8).some(arg1 => String(arg1 || "").trim() === "作者");
    if (result) {
      return true;
    }
    if (!arg1?.querySelectorAll) {
      return false;
    }
    try {
      const result = Array.from(arg1.querySelectorAll("span, div, label, em, i, strong"));
      for (const item of result) {
        if (!fn4(item, arg1)) {
          continue;
        }
        if ((item.children?.length || 0) > 1) {
          continue;
        }
        const result = (item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
        if (result === "作者") {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function isCommentFromVideoAuthor(options = {}, options2 = {}) {
    const result = String(options?.nickname || "").trim().replace(/^@+/, "");
    const result2 = String(options?.userUrl || "").trim();
    const local = extractUserKeyFromUrl(result2) || String(options?.secUid || "").trim();
    const result3 = String(options2?.nickname || options2?.authorNickname || "").trim().replace(/^@+/, "");
    const result4 = String(options2?.profileUrl || options2?.authorUrl || options2?.userUrl || "").trim();
    const local2 = extractUserKeyFromUrl(result4) || String(options2?.secUid || "").trim();
    if (local2 && local && local2 === local) {
      return true;
    }
    if (result4 && result2) {
      const result = result4.split("?")[0].replace(/\/+$/, "");
      const result3 = result2.split("?")[0].replace(/\/+$/, "");
      if (result && result3 && result === result3) {
        return true;
      }
    }
    if (result3 && result && result3 === result) {
      return true;
    }
    return false;
  }
  function normalizeDouyinCommentContent(arg1) {
    return String(arg1 || "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").replace(/\s*(?:展开全文|收起全文|查看全文)\s*$/g, "").trim();
  }
  function fn7(arg1) {
    const value = typeof getCommentV2String === "function" ? getCommentV2String(arg1) : "";
    if (!value) {
      return null;
    }
    try {
      return new RegExp(value, "i");
    } catch (error) {
      return null;
    }
  }
  function fn8(arg1) {
    const result = fn7("commentAvatarImagePattern");
    if (!arg1 || !result) {
      return false;
    }
    const result2 = String(arg1.getAttribute?.("src") || arg1.src || "");
    return result.test(result2);
  }
  function fn9(arg1) {
    if (!arg1) {
      return false;
    }
    const value = typeof getCommentV2String === "function" ? getCommentV2String("commentStickerImageSelector") : "";
    if (value) {
      try {
        if (arg1.matches?.(value)) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    const result = fn7("commentStickerAltPattern");
    if (!result) {
      return false;
    }
    const result2 = String(arg1.getAttribute?.("alt") || arg1.getAttribute?.("aria-label") || "");
    return result.test(result2);
  }
  function fn10(arg1) {
    const result = normalizeDouyinCommentContent(arg1);
    if (!result) {
      return true;
    }
    if (/^[.。…·•・\s]{2,}$/.test(result)) {
      return true;
    }
    if (/^(回复|展开|收起|展开回复|收起回复|作者赞过|置顶|举报|分享|删除|点赞)$/.test(result)) {
      return true;
    }
    return isDouyinCommentActionChromeText(result);
  }
  function fn11(arg1) {
    if (!arg1?.querySelectorAll) {
      return 0;
    }
    let num = 0;
    try {
      Array.from(arg1.querySelectorAll("img")).forEach(arg12 => {
        if (!fn4(arg12, arg1)) {
          return;
        }
        if (arg12.closest?.("a[href*=\"/user/\"]")) {
          return;
        }
        if (fn8(arg12)) {
          return;
        }
        if (fn9(arg12)) {
          num += 1;
        }
      });
    } catch (error) {}
    return num;
  }
  function fn12(arg1) {
    if (!arg1?.querySelectorAll) {
      return 0;
    }
    let num = 0;
    try {
      Array.from(arg1.querySelectorAll("img")).forEach(arg12 => {
        if (!fn4(arg12, arg1)) {
          return;
        }
        if (arg12.closest?.("a[href*=\"/user/\"]")) {
          return;
        }
        if (arg12.closest?.("button, [role=\"button\"], [class*=\"like\"], [class*=\"Like\"], [class*=\"digg\"], [class*=\"Digg\"]")) {
          return;
        }
        if (fn8(arg12)) {
          return;
        }
        if (fn9(arg12)) {
          return;
        }
        const result = String(arg12.getAttribute?.("alt") || arg12.getAttribute?.("aria-label") || "");
        if (/图片|查看图片|评论图片/.test(result)) {
          num += 1;
          return;
        }
        const value = (arg12.className || "") + " " + (arg12.parentElement?.className || "");
        if (/comment[-_]?image|comment[-_]?pic|image-list|ImageList|picture|photo/i.test(value)) {
          num += 1;
          return;
        }
        const result2 = Number(arg12.naturalWidth || arg12.width || arg12.getBoundingClientRect?.().width || 0);
        const result3 = Number(arg12.naturalHeight || arg12.height || arg12.getBoundingClientRect?.().height || 0);
        if (result2 >= 72 && result3 >= 72) {
          num += 1;
        }
      });
    } catch (error) {}
    return num;
  }
  function fn13(arg1) {
    return normalizeDouyinCommentContent(arg1).replace(/\[[^\[\]\n]{1,16}\]/g, "").replace(/👍|👏|❤|♥|💕|💗|💖|💘/g, "").replace(/\s+/g, " ").trim();
  }
  function collectDouyinCommentEmojiHints(arg1) {
    if (!arg1?.querySelectorAll) {
      return [];
    }
    const list = [];
    try {
      Array.from(arg1.querySelectorAll("img[alt], img[aria-label], [data-emoji], [data-sticker], [title]")).forEach(arg12 => {
        if (!fn4(arg12, arg1)) {
          return;
        }
        if (arg12.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        [arg12.getAttribute?.("alt"), arg12.getAttribute?.("aria-label"), arg12.getAttribute?.("data-text"), arg12.getAttribute?.("data-emoji"), arg12.getAttribute?.("title")].forEach(arg1 => {
          const result = normalizeDouyinCommentContent(arg1);
          if (!result || fn15(result)) {
            return;
          }
          list.push(result);
        });
      });
    } catch (error) {}
    return list;
  }
  function fn16(arg1, text = "") {
    let result = fn13(arg1);
    const result2 = normalizeDouyinCommentContent(text).replace(/^@+/, "");
    if (result2) {
      result = result.split("@" + result2).join(" ").split(result2).join(" ");
    }
    let result3 = result.replace(/回复|展开|收起|作者赞过|置顶|分享|举报|不喜欢|点赞/g, " ").replace(/(?:刚刚|昨天|前天|\d+\s*(?:秒|分钟|小时|天|周|月|年)前).*$/g, " ").replace(/IP(?:属地)?[：:\s\S]*$/i, " ").replace(/[·•]/g, " ").replace(/\s+/g, " ").trim();
    const result4 = result3.replace(/\s+/g, "");
    if (/^\d+$/.test(result4)) {
      return result4;
    }
    return result3.replace(/\d+(?:\.\d+)?[万wWkK]?/g, " ").replace(/\s+/g, "").trim();
  }
  function fn17(arg1) {
    return Array.from(String(arg1 || "").matchAll(/\[([^\[\]\n]{1,16})\]/g)).map(arg1 => arg1[1]);
  }
  function buildLeadCommentFingerprint(arg1) {
    const result = normalizeDouyinCommentContent(arg1);
    const result2 = fn17(result);
    const result3 = fn13(result);
    const result4 = /\[图片\]|\[图片评论\]|图片评论|发了张图片|\[视频\]/.test(result);
    return {
      raw: result,
      plain: result3,
      emojiNames: result2,
      emojiCount: result2.length,
      hasImageToken: result4,
      mediaHeavy: !result3 || result4 || result2.length > 0 && result3.length <= 6
    };
  }
  function buildNodeCommentFingerprint(arg1, arg2, arg3, list = []) {
    const result = Array.from(arg1?.querySelectorAll?.("img") || []).filter(arg12 => fn4(arg12, arg1) && !arg12.closest?.("a[href*=\"/user/\"]"));
    const result2 = result.filter(fn9);
    const result3 = result.filter(arg1 => !result2.includes(arg1));
    const list2 = [];
    for (const item of list) {
      const result = fn17(item);
      if (result.length) {
        list2.push(...result);
      } else {
        const result = normalizeDouyinCommentContent(item).replace(/^\[|\]$/g, "");
        if (result && result.length <= 12 && !/^\d+$/.test(result) && !fn15(result, arg2)) {
          list2.push(result);
        }
      }
    }
    result2.forEach(arg1 => {
      const result = normalizeDouyinCommentContent(arg1.getAttribute?.("alt") || arg1.getAttribute?.("aria-label") || arg1.getAttribute?.("data-emoji") || "");
      fn17(result).forEach(arg1 => list2.push(arg1));
      const result2 = result.replace(/^\[|\]$/g, "");
      if (result2 && result2.length <= 12) {
        list2.push(result2);
      }
    });
    const result4 = fn16(arg3 || "", arg2);
    return {
      plain: result4,
      emojiNames: [...new Set(list2.filter(Boolean))],
      emojiCount: Math.max(result2.length, list2.length),
      imageCount: result3.length,
      mediaHeavy: !result4 || result2.length > 0 || result3.length > 0
    };
  }
  function scoreCommentContentFingerprints(arg1, arg2, list = [], text = "") {
    if (!arg1?.raw) {
      return {
        hit: true,
        scoreBonus: 0,
        mode: "empty"
      };
    }
    if (list.some(arg12 => arg12.includes(arg1.raw))) {
      return {
        hit: true,
        scoreBonus: 24,
        mode: "full"
      };
    }
    const result = arg1.raw.slice(0, 40);
    if (result && list.some(arg1 => arg1.includes(result))) {
      return {
        hit: true,
        scoreBonus: 14,
        mode: "snippet"
      };
    }
    let num = 0;
    let flag = false;
    let text2 = "miss";
    const result2 = list.map(arg1 => fn16(arg1, text)).filter(Boolean);
    if (arg1.plain) {
      const result = [arg2.plain, ...result2].filter(Boolean).some(arg12 => arg12 === arg1.plain || arg12.includes(arg1.plain) || arg1.plain.includes(arg12));
      if (result) {
        flag = true;
        num += arg1.plain.length <= 4 ? 16 : 20;
        text2 = "plain";
      } else if (arg1.plain.length <= 1 && !arg1.emojiCount) {
        return {
          hit: false,
          scoreBonus: 0,
          mode: "plain_short_reject"
        };
      }
    }
    if (arg1.emojiNames.length) {
      const set = new Set(arg2.emojiNames);
      const result = list.join("\n");
      let num2 = 0;
      for (const item of arg1.emojiNames) {
        if (set.has(item) || result.includes("[" + item + "]") || result.includes(item)) {
          num2 += 1;
        }
      }
      if (num2 > 0) {
        flag = true;
        num += Math.min(18, num2 * 6);
        text2 = text2 === "miss" ? "emoji" : text2 + "+emoji";
      } else if (!arg1.plain && arg2.emojiCount > 0) {
        flag = true;
        num += 8;
        text2 = "emoji_soft";
      }
    }
    if (arg1.hasImageToken && arg2.imageCount > 0) {
      flag = true;
      num += 14;
      text2 = text2 === "miss" ? "image" : text2 + "+image";
    } else if (arg1.hasImageToken && !arg2.plain && arg2.mediaHeavy) {
      flag = true;
      num += 8;
      text2 = "image_soft";
    }
    if (!flag && arg1.mediaHeavy) {
      return {
        hit: true,
        scoreBonus: 3,
        mode: "media_soft",
        soft: true
      };
    }
    return {
      hit: flag,
      scoreBonus: num,
      mode: text2,
      soft: false
    };
  }
  function commentNodeViewportBonus(arg1) {
    try {
      const local = arg1.getBoundingClientRect?.();
      if (!local || !(local.height > 0) || !(local.bottom > 8) || !(local.top < window.innerHeight - 8)) {
        return 0;
      }
      const value = (local.top + local.bottom) / 2;
      const value2 = window.innerHeight / 2;
      const value3 = Math.abs(value - value2) / Math.max(1, window.innerHeight);
      return Math.round((1 - Math.min(1, value3 * 1.2)) * 14);
    } catch (error) {
      return 0;
    }
  }
  function fn15(arg1, text = "") {
    const result = normalizeDouyinCommentContent(arg1);
    if (fn10(result) || result === text) {
      return true;
    }
    if (/^(作者|作者赞过|赞|点赞|不喜欢|更多|头像|用户头像)$/.test(result)) {
      return true;
    }
    if (/^IP(?:属地)?[：:\s]/i.test(result)) {
      return true;
    }
    if (/^(?:刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前|\d{1,4}-\d{1,2}(?:-\d{1,2})?)(?:\s*[·•]\s*[\u4e00-\u9fff]{2,10})?$/.test(result)) {
      return true;
    }
    return false;
  }
  function fn4(arg1, arg2) {
    if (!arg1 || !arg2 || !arg2.contains?.(arg1)) {
      return false;
    }
    const text = "[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"]";
    const local = arg1.closest?.(text) || null;
    const value = arg2.matches?.(text) ? arg2 : arg2.closest?.(text) || null;
    if (local && value) {
      return local === value;
    }
    const local2 = arg1.closest?.("[data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"]");
    return !local2 || local2 === arg2 || !arg2.contains(local2);
  }
  function extractDouyinCommentContent(arg1, text2 = "") {
    if (!arg1) {
      return "";
    }
    const list = ["[data-e2e=\"comment-content\"]", "[data-e2e=\"comment-text\"]", "[data-e2e*=\"comment-content\" i]", "[data-e2e*=\"comment-text\" i]", "[class*=\"comment-content\" i]", "[class*=\"commentContent\"]", "[class*=\"comment-text\" i]", "[class*=\"CommentText\"]", "[class*=\"contentText\"]", "[class*=\"ContentText\"]"];
    const list2 = [];
    let list3 = [];
    try {
      list3 = Array.from(arg1.querySelectorAll(list.join(", ")));
    } catch (error) {}
    list3.forEach(arg12 => {
      if (!fn4(arg12, arg1)) {
        return;
      }
      if (arg12.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
        return;
      }
      let result = list.findIndex(arg1 => {
        try {
          return arg12.matches?.(arg1);
        } catch (error) {
          return false;
        }
      });
      if (result < 0) {
        result = list.length - 1;
      }
      const list3 = [arg12.getAttribute?.("data-full-text"), arg12.getAttribute?.("data-text"), arg12.textContent, arg12.innerText, arg12.getAttribute?.("aria-label"), arg12.getAttribute?.("title")];
      list3.forEach((arg1, arg2) => {
        const result2 = normalizeDouyinCommentContent(arg1);
        if (fn15(result2, text2)) {
          return;
        }
        if (fn10(result2) || isUnusableCommentBodyText(result2, text2)) {
          return;
        }
        list2.push({
          text: result2,
          score: (list.length - result) * 1000 + (arg2 <= 2 ? 300 : 0) + Math.min(result2.length, 80)
        });
      });
    });
    if (list2.length === 0) {
      const local = arg1.querySelector?.("a[href*=\"/user/\"]") || null;
      Array.from(arg1.querySelectorAll?.("p, span, div") || []).forEach(arg12 => {
        if (arg12 === arg1 || !fn4(arg12, arg1)) {
          return;
        }
        if (arg12.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        if (local && arg12.contains?.(local)) {
          return;
        }
        if (arg12.querySelector?.("[data-e2e=\"comment-item\"], [data-e2e=\"comment-reply-item\"], div[class*=\"reply-item\"], div[class*=\"ReplyItem\"]")) {
          return;
        }
        if ((arg12.children?.length || 0) > 4) {
          return;
        }
        const value = (arg12.getAttribute?.("data-e2e") || "") + " " + (arg12.className || "");
        const list = [arg12.textContent, arg12.innerText, arg12.getAttribute?.("data-text"), arg12.getAttribute?.("aria-label"), arg12.getAttribute?.("title")];
        list.forEach((arg1, arg2) => {
          const result = normalizeDouyinCommentContent(arg1);
          if (fn15(result, text2)) {
            return;
          }
          if (fn10(result) || isUnusableCommentBodyText(result, text2)) {
            return;
          }
          const result2 = /^\d+$/.test(result);
          list2.push({
            text: result,
            score: (/comment|content|text/i.test(value) ? 500 : 0) + ((arg12.children?.length || 0) === 0 ? 120 : 0) + (/^(P|SPAN)$/.test(arg12.tagName || "") ? 60 : 0) + (arg2 >= 2 ? 40 : 0) + Math.min(result.length, 240) + (result2 ? -400 : 0)
          });
        });
      });
    }
    if (list2.length === 0) {
      const result = fn12(arg1);
      if (result > 0) {
        list2.push({
          text: "[图片]",
          score: 280
        });
      }
      const result2 = fn11(arg1);
      let value = result2 > 0;
      Array.from(arg1.querySelectorAll?.("img[alt], img[aria-label], [data-emoji], [data-sticker]") || []).forEach(arg12 => {
        if (!fn4(arg12, arg1)) {
          return;
        }
        if (arg12.closest?.("a[href*=\"/user/\"], button, [role=\"button\"]")) {
          return;
        }
        const list = [arg12.getAttribute?.("alt"), arg12.getAttribute?.("aria-label"), arg12.getAttribute?.("data-text"), arg12.getAttribute?.("title")];
        list.forEach(arg1 => {
          let result = normalizeDouyinCommentContent(arg1);
          if (/^(图片|查看图片|评论图片|\[图片\]|\[图片评论\])$/.test(result)) {
            list2.push({
              text: "[图片]",
              score: 260
            });
            return;
          }
          if (fn15(result, text2)) {
            return;
          }
          if (result) {
            value = true;
          }
        });
      });
      if (list2.length === 0 && value) {
        list2.push({
          text: "[表情或表情包]",
          score: 200
        });
      }
    }
    list2.sort((arg1, arg2) => arg2.score - arg1.score);
    return list2[0]?.text || "";
  }
  function parseDouyinCommentNode(arg1, options = {}) {
    const {
      requireTime = false,
      skipAuthor = true
    } = options;
    if (!arg1) {
      return null;
    }
    const result = Array.from(arg1.querySelectorAll?.("a[href*=\"/user/\"]") || []);
    const result2 = (() => {
      try {
        const result = String(arg1.innerText || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean);
        return normalizeDouyinCommentContent(result[0] || "").replace(/^@+/, "");
      } catch (error) {
        return "";
      }
    })();
    const local = () => {
      if (!result.length) {
        return null;
      }
      if (result2) {
        const result3 = result.find(arg1 => {
          const result = normalizeDouyinCommentContent(arg1?.innerText || arg1?.textContent || arg1?.getAttribute?.("title") || "").replace(/^@+/, "");
          return result && (result === result2 || result.includes(result2) || result2.includes(result));
        });
        if (result3) {
          return result3;
        }
      }
      return result[0];
    };
    const result3 = local();
    const value = result3 ? result3.href || result3.getAttribute?.("href") || "" : "";
    const result4 = normalizeDouyinCommentContent(result3?.innerText || result3?.textContent || result3?.getAttribute?.("title") || "").replace(/^@+/, "");
    const result5 = arg1.cloneNode(true);
    fn2(result5);
    const result6 = document.createElement("div");
    result6.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:1000px;height:auto;overflow:hidden;pointer-events:none;";
    document.body.appendChild(result6);
    result6.appendChild(result5);
    const result7 = result5.innerText.split("\n").map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0);
    result6.remove();
    const local2 = result4 || result7[0] || "未知用户";
    if (!local2 || local2 === "未知用户") {
      return null;
    }
    const result8 = fn3(arg1, result7);
    if (skipAuthor && result8) {
      return null;
    }
    const result9 = getCommentTimeModule();
    const value2 = typeof result9?.pickPrimaryCommentTimeMeta === "function" ? result9.pickPrimaryCommentTimeMeta(result7) : null;
    let result10 = String(value2?.time || "").trim();
    let result11 = String(value2?.timeOriginal || "").trim();
    if (!result10) {
      const pattern = /(刚刚|昨天|\d+\s*(?:分钟|小时|天|周|月|年)前)/;
      const value = typeof result9?.linesBeforeNestedReplies === "function" ? result9.linesBeforeNestedReplies(result7) : result7;
      for (let num = 0; num < value.length; num += 1) {
        const result = value[num].match(pattern);
        if (result) {
          result10 = result[1] || result[0];
          result11 = value[num];
          break;
        }
      }
    }
    if (requireTime && !result10) {
      return null;
    }
    let result12 = String(value2?.ipLocation || "").trim();
    if (!result12 && result11) {
      result12 = typeof result9?.resolveCommentLocationText === "function" ? result9.resolveCommentLocationText({
        timeOriginal: result11
      }) : "";
    }
    result12 &&= typeof result9?.normalizeCommentIpLocationText === "function" ? result9.normalizeCommentIpLocationText(result12) : String(result12).trim();
    const result13 = pickDouyinCommentLineText(filterDouyinCommentContentLines(result7, {
      nickname: local2,
      timeOriginal: result11,
      ipLocation: result12
    }));
    const result14 = collectDouyinCommentEmojiHints(arg1);
    const result15 = fn11(arg1);
    const result16 = fn12(arg1);
    const result17 = resolveDouyinCommentBodyText({
      explicitText: extractDouyinCommentContent(arg1, local2),
      lineText: result13,
      nickname: local2,
      emojiHints: result14,
      stickerCount: result15,
      hasStickerMedia: result15 > 0,
      imageCount: result16,
      hasImageMedia: result16 > 0
    });
    if (!result17 || result17.trim().length === 0) {
      return null;
    }
    if (result17.includes("@豆包") || result17.includes("@元宝") || result17.includes("@通义") || result17.includes("@文心")) {
      return null;
    }
    return {
      nickname: local2,
      userUrl: value,
      text: result17,
      time: result10,
      timeOriginal: result11,
      ipLocation: result12,
      isAuthor: !!result8,
      cid: extractDouyinCommentCidFromNode(arg1)
    };
  }
  function fn24(arg1) {
    const result = parseDouyinCommentNode(arg1, {
      requireTime: true,
      skipAuthor: false
    });
    if (!result) {
      return null;
    }
    const local = result.ipLocation || "";
    return {
      nickname: result.nickname,
      userUrl: result.userUrl,
      text: result.text,
      time: result.time || result.timeOriginal || "",
      ipLocation: local,
      location: local,
      isAuthor: !!result.isAuthor,
      isAuthorComment: !!result.isAuthor,
      cid: result.cid || "",
      commentId: result.cid || ""
    };
  }
  function fn25(arg1, text = "") {
    const local = arg1 || document;
    const local2 = (typeof getVideoAuthorInfo === "function" ? getVideoAuthorInfo(local, text) : null) || {};
    const local3 = String(local2.profileUrl || "").trim() || (typeof getVideoAuthorProfileUrl === "function" ? getVideoAuthorProfileUrl(local, text) : "") || "";
    const local4 = String(local2.nickname || "").trim() || (typeof getVideoAuthorNickname === "function" ? getVideoAuthorNickname(local) : "") || "";
    const local5 = resolveDouyinAuthorIdentityKey(local3) || String((typeof extractUserKeyFromUrl === "function" ? extractUserKeyFromUrl(local3) : "") || "").trim();
    const result = String(window.location.href || "").trim();
    const local6 = resolveDouyinAuthorIdentityKey(result) || String((typeof extractUserKeyFromUrl === "function" ? extractUserKeyFromUrl(result) : "") || "").trim();
    return {
      nickname: local4,
      profileUrl: local3,
      pageUrl: result,
      secUid: local5 || local6,
      pageSecUid: local6
    };
  }
  function fn26(arg1, arg2) {
    return String(resolveDouyinAuthorIdentityKey(arg1) || resolveDouyinAuthorIdentityKey(arg2) || arg2 || "").trim();
  }
  function fn27(arg1, arg2, arg3) {
    const local = arg2 || arg3;
    const list = [arg1?.pageUrl, arg1?.pageSecUid, arg1?.profileUrl, arg1?.secUid];
    let local2 = null;
    for (const item of list) {
      const result = classifyDouyinAuthorIdentity(item, local);
      if (result.matched) {
        return {
          ok: true,
          authorMismatch: false,
          authorUnconfirmed: false,
          author: arg1,
          currentKey: result.currentKey,
          expectedKey: result.expectedKey
        };
      }
      if (result.foreign && !local2) {
        local2 = result;
      }
    }
    if (local2) {
      return {
        ok: false,
        authorMismatch: true,
        authorUnconfirmed: false,
        author: {
          ...arg1,
          secUid: local2.currentKey || arg1?.secUid || ""
        },
        currentKey: local2.currentKey,
        expectedKey: local2.expectedKey
      };
    }
    return {
      ok: false,
      authorMismatch: false,
      authorUnconfirmed: true,
      author: arg1
    };
  }
  function fn28(arg1, arg2, arg3) {
    return !!fn27(arg1, arg2, arg3).authorMismatch;
  }
  async function fn29(arg1, {
    expectedVideoUrl = "",
    expectedAuthorUrl = "",
    expectedSecUid = "",
    timeoutMs = 4000
  } = {}) {
    const result = fn26(expectedAuthorUrl, expectedSecUid);
    let result2 = fn25(arg1, expectedVideoUrl);
    if (!result) {
      return {
        ok: true,
        skipped: true,
        author: result2
      };
    }
    let result3 = fn27(result2, expectedAuthorUrl, expectedSecUid);
    if (result3.ok) {
      return {
        ok: true,
        author: result2
      };
    }
    const value = Date.now() + Math.max(800, Number(timeoutMs) || 4000);
    while (Date.now() < value) {
      if (result3.authorMismatch) {
        return {
          ok: false,
          authorMismatch: true,
          author: result3.author
        };
      }
      await sleep(350);
      result2 = fn25(arg1, expectedVideoUrl);
      result3 = fn27(result2, expectedAuthorUrl, expectedSecUid);
      if (result3.ok) {
        return {
          ok: true,
          author: result2
        };
      }
    }
    return {
      ok: !!result3.ok,
      authorMismatch: !!result3.authorMismatch,
      authorUnconfirmed: !!result3.authorUnconfirmed,
      author: result3.author || result2
    };
  }
  async function runVideoMonitorScrapeComments(options = {}) {
    const {
      requestId: requestId,
      maxComments: maxComments,
      chunkSize: chunkSize,
      targetVideoUrl: targetVideoUrl,
      expectedAuthorUrl: expectedAuthorUrl,
      expectedSecUid: expectedSecUid,
      scrapePageTimeoutMs: scrapePageTimeoutMs,
      resumeComments: resumeComments,
      resumeState: resumeState
    } = options;
    const result = String(expectedAuthorUrl || "").trim();
    const result2 = String(expectedSecUid || "").trim();
    const value = Number.isFinite(Number(maxComments)) && Number(maxComments) > 0 ? Math.floor(Number(maxComments)) : 200;
    const value2 = Number.isFinite(Number(chunkSize)) && Number(chunkSize) > 0 ? Math.min(value, Math.floor(Number(chunkSize))) : 0;
    const result3 = (Array.isArray(resumeComments) ? resumeComments : []).filter(arg1 => arg1 && arg1.nickname && arg1.text).slice(0, value).map(arg1 => ({
      ...arg1
    }));
    const value3 = result3.length;
    const value4 = resumeState && typeof resumeState === "object" ? {
      ...resumeState
    } : {};
    const value5 = "MONITOR_SCRAPE_" + (requestId || Date.now());
    const result4 = Date.now();
    const result5 = Number(scrapePageTimeoutMs);
    const value6 = Number.isFinite(result5) ? Math.min(600000, Math.max(15000, Math.floor(result5))) : 600000;
    const value7 = result4 + value6;
    const local = () => {
      if (Date.now() <= value7) {
        return;
      }
      const error = new Error("评论页面抓取超过 " + Math.round(value6 / 1000) + " 秒");
      error.code = "monitor_scrape_page_timeout";
      throw error;
    };
    const local2 = arg1 => {
      ipcRenderer.send("video-monitor-scrape-result", {
        requestId: requestId,
        ...arg1
      });
    };
    let num = 0;
    let value8 = -1;
    const local3 = (arg1, {
      force = false
    } = {}) => {
      const result = Date.now();
      const value = Array.isArray(arg1.comments) ? arg1.comments.length : 0;
      const local = value8 < 0 || value - value8 >= 10;
      if (!force && result - num < 2000 && !local) {
        return;
      }
      num = result;
      value8 = value;
      ipcRenderer.send("video-monitor-scrape-progress", {
        requestId: requestId,
        ...arg1,
        elapsedMs: result - result4
      });
    };
    const local4 = (arg1, arg2, arg3, arg4) => {
      const result = queryCommentItemNodes(arg1 || document).filter(isVisibleElement);
      let num = 0;
      result.forEach(arg1 => {
        if (arg4.length >= value) {
          return;
        }
        const result = fn24(arg1);
        if (!result) {
          return;
        }
        const value2 = result.nickname + "__" + result.text;
        if (arg3.has(value2)) {
          return;
        }
        arg3.add(value2);
        arg4.push(result);
        num += 1;
      });
      return {
        added: num,
        visibleCount: result.length
      };
    };
    const local5 = () => {
      const value = platformSelectors["douyin.com"].modalContainer;
      const result = document.querySelector(value);
      if (result && isVisibleElement(result)) {
        return result;
      } else {
        return document.body;
      }
    };
    const local6 = () => {
      if (!targetVideoUrl) {
        return true;
      }
      return isOnSpecificTargetVideo(window.location.href, targetVideoUrl);
    };
    let local7 = null;
    try {
      try {
        await handleGlobalAutomationPopupsAndSecurity(value5);
      } catch (error) {}
      local();
      const value6 = targetVideoUrl ? normalizeSpecificVideoKey(targetVideoUrl) : "";
      if (value6) {
        let result = await fn31(value5, targetVideoUrl, 20000);
        local();
        if (result.status === "cancelled" || shouldAbort(value5)) {
          local2({
            success: false,
            cancelled: true,
            error: "已取消",
            comments: []
          });
          return;
        }
        if (result.status === "unavailable") {
          local2({
            success: false,
            videoUnavailable: true,
            unavailableReason: result.reason || "unavailable",
            error: "视频失效或无法打开",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: targetVideoUrl
          });
          return;
        }
        if (result.status !== "ready" || !local6()) {
          const result2 = convertToDouyinModalUrl(targetVideoUrl);
          if (result2 && result2 !== window.location.href) {
            window.location.href = result2;
            result = await fn31(value5, targetVideoUrl, 18000);
            local();
          }
        }
        if (result.status === "unavailable") {
          local2({
            success: false,
            videoUnavailable: true,
            unavailableReason: result.reason || "unavailable",
            error: "视频失效或无法打开",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: targetVideoUrl
          });
          return;
        }
        if (result.status !== "ready") {
          local2({
            success: false,
            needReload: true,
            videoNotReady: true,
            panelOpened: false,
            error: "视频页未就绪",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: targetVideoUrl
          });
          return;
        }
        if (!local6()) {
          local2({
            success: false,
            videoMismatch: true,
            error: "当前页面与目标视频不一致",
            comments: [],
            videoUrl: window.location.href || "",
            targetVideoUrl: targetVideoUrl
          });
          return;
        }
      }
      const value7 = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) || resolveDouyinVideoDetailModal({
        includeFeed: true
      }) : null;
      const value8 = value7 && isVisibleElement(value7) ? value7 : local5();
      pauseVisibleDouyinVideos(value8, "监控抓取：锁定视频防止自动连播");
      const obj = {
        scope: value8,
        leadVideoUrl: value6 || resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8),
        videoTitle: getVideoTitle()
      };
      local7 = startCurrentVideoPauseGuard(obj, value5, {
        intervalMs: 1000,
        driftConfirmTicks: 2
      });
      const local8 = (typeof getVideoTitle === "function" ? getVideoTitle() : "") || "";
      const local9 = resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href || "";
      let text = "";
      let text2 = "";
      const result4 = await fn29(value8, {
        expectedVideoUrl: value6 || local9,
        expectedAuthorUrl: result,
        expectedSecUid: result2,
        timeoutMs: 4000
      });
      text = String(result4.author?.nickname || "").trim();
      text2 = String(result4.author?.profileUrl || "").trim();
      if (result4.authorMismatch && fn26(result, result2)) {
        local2({
          success: false,
          authorMismatch: true,
          authorUnconfirmed: false,
          videoMismatch: true,
          error: "当前作品不是目标博主，已停止采集评论",
          comments: [],
          videoTitle: local8,
          videoUrl: local9,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      const local10 = () => {
        if (isCurrentVideoPauseGuardDrifted(local7) || !local6()) {
          return true;
        }
        return fn28(fn25(value8, value6 || local9), result, result2);
      };
      const result5 = await fn32(value5, value8);
      local();
      if (!result5) {
        console.warn("[Monitor-Scrape] 评论面板未打开，请求重新进入视频");
        local2({
          success: false,
          needReload: true,
          panelOpened: false,
          panelNotOpen: true,
          error: "评论面板未打开",
          comments: [],
          totalCount: getCommentsTotalCount(value8) || null,
          videoTitle: local8,
          videoUrl: local9,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      pauseVisibleDouyinVideos(value8, "监控抓取：评论区打开后再次锁定视频");
      if (local10()) {
        local2({
          success: false,
          videoMismatch: true,
          authorMismatch: fn28(fn25(value8, value6 || local9), result, result2),
          error: "打开评论区后检测到视频已漂移",
          comments: [],
          videoTitle: local8,
          videoUrl: local9,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      let result6 = getCommentsTotalCount(value8);
      if (result6 == null || result6 === 0) {
        const local = Number(getVideoStats(value8)?.comments) || 0;
        if (local > 0) {
          result6 = local;
        }
      }
      if (result6 === 0 && result3.length === 0) {
        local2({
          success: true,
          comments: [],
          totalCount: 0,
          visibleCount: 0,
          maxComments: value,
          panelOpened: result5,
          videoTitle: local8,
          videoUrl: local9,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      await waitForCommentDomWarmup(value8, value5, result6);
      local();
      await clickCommentPanelLoadingPlaceholder(value8, value5);
      local();
      const result7 = getCommentsTotalCount(value8);
      if (result7 != null && result7 > 0 && (result6 == null || result7 > result6)) {
        result6 = result7;
      } else if (result6 == null || result6 === 0) {
        const local = Number(getVideoStats(value8)?.comments) || 0;
        if (local > 0) {
          result6 = local;
        }
      }
      const value9 = platformSelectors["douyin.com"];
      let result8 = resolveCommentPanelRoot(value8);
      if (!result8 || !isVisibleElement(result8)) {
        result8 = value8;
      }
      const list = [];
      const set = new Set();
      result3.forEach(arg1 => {
        if (list.length >= value) {
          return;
        }
        const value2 = arg1.nickname + "__" + arg1.text;
        if (set.has(value2)) {
          return;
        }
        set.add(value2);
        list.push(arg1);
      });
      let num = 0;
      local4(result8, value9, set, list);
      if (local10()) {
        local2({
          success: false,
          videoMismatch: true,
          authorMismatch: fn28(fn25(value8, value6 || local9), result, result2),
          error: "首屏采集时检测到视频已漂移",
          comments: [],
          videoTitle: getVideoTitle() || local8,
          videoUrl: resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      const local11 = () => Math.max(0, list.length - value3);
      const local12 = () => Number.isFinite(Number(result6)) && Number(result6) >= 0 && list.length >= Number(result6);
      const local13 = () => value2 > 0 && local11() >= value2 && list.length < value && !local12();
      const local14 = findCommentScrollContainer(result8) || result8;
      const result9 = Math.max(0, Number(value4.scrollTop) || 0);
      const result10 = Math.max(0, Math.min(1, Number(value4.scrollRatio) || 0));
      const result11 = Math.max(0, Math.floor(Number(value4.scrollRound) || 0));
      if (result9 > 0 || result10 > 0) {
        try {
          const result = Math.max(0, Number(local14.scrollHeight || 0) - Number(local14.clientHeight || 0));
          const value = result9 > 0 ? Math.min(result9, result) : Math.round(result * result10);
          local14.scrollTop = value;
          local14.dispatchEvent(new Event("scroll", {
            bubbles: true
          }));
          await sleep(500);
          local4(result8, value9, set, list);
        } catch (error) {}
      }
      const local15 = arg1 => {
        const result = getCommentScrollMetrics(result8);
        const result2 = Math.max(0, result.scrollHeight - result.clientHeight);
        return {
          comments: list.slice(0, value),
          totalCount: result6 ?? null,
          visibleCount: num,
          maxComments: value,
          videoTitle: getVideoTitle() || local8,
          videoUrl: resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href || "",
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl,
          resumeState: {
            scrollRound: Math.max(0, Number(arg1) || 0),
            scrollTop: result.scrollTop,
            scrollHeight: result.scrollHeight,
            clientHeight: result.clientHeight,
            scrollRatio: result2 > 0 ? Math.max(0, Math.min(1, result.scrollTop / result2)) : 0
          }
        };
      };
      local3(local15(result11), {
        force: true
      });
      if (local13()) {
        const result = local15(result11);
        const obj = {
          success: true,
          partialChunk: true,
          comments: list.slice(0, value),
          totalCount: result6 ?? null,
          visibleCount: num,
          maxComments: value,
          capped: false,
          chunkSize: value2,
          newlyCollected: local11(),
          videoTitle: getVideoTitle() || local8,
          videoUrl: resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href || "",
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl,
          resumeState: result.resumeState
        };
        local3(obj, {
          force: true
        });
        local2(obj);
        return;
      }
      const result12 = Math.min(value, result6 != null && result6 > 0 ? result6 : value);
      const result13 = Math.max(12, Math.ceil(result12 / 5) + 8);
      const result14 = Math.min(120, result13 + Math.min(result11, 60));
      let num2 = 0;
      const value10 = result6 != null && result6 <= 5 ? 2 : result6 != null && result6 <= 10 ? 3 : 6;
      const result15 = Math.min(60, result11 + value10);
      let local16 = result11;
      let flag = false;
      for (let num3 = 0; list.length < value && !local12() && num3 < result14; num3 += 1) {
        local();
        if (local10()) {
          local2({
            success: false,
            videoMismatch: true,
            authorMismatch: fn28(fn25(value8, value6 || local9), result, result2),
            error: "评论滚动期间检测到视频已漂移",
            comments: [],
            totalCount: result6,
            visibleCount: num,
            maxComments: value,
            videoTitle: getVideoTitle(),
            videoUrl: resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href,
            videoAuthor: text,
            videoAuthorUrl: text2,
            targetVideoUrl: targetVideoUrl
          });
          return;
        }
        pauseVisibleDouyinVideos(value8, "监控抓取：滚动评论期间锁定视频");
        const value2 = list.length;
        if (shouldExpandFoldedCommentReplies({
          forMonitorScrape: true
        })) {
          await expandReplies(result8, value5, null, {
            failCount: 0,
            skipExpand: false
          }, {
            forMonitorScrape: true
          });
        }
        if (local14 && typeof local14.scrollBy === "function") {
          const value = num2 >= 2 ? 1100 : 700;
          local14.scrollBy(0, value);
        }
        await sleep(num2 >= 2 ? 900 : 700);
        local();
        if (isCommentPanelContentLoading(result8) || num2 >= 1) {
          await clickCommentPanelLoadingPlaceholder(result8, value5);
          await sleep(350);
        }
        const result3 = local4(result8, value9, set, list);
        num = result3.visibleCount;
        pruneStaleCommentDom(result8, {
          context: "monitor"
        });
        local16 = result11 + num3 + 1;
        local3(local15(local16));
        if (list.length >= value) {
          break;
        }
        if (local13()) {
          flag = true;
          break;
        }
        if (list.length === value2) {
          num2 += 1;
          const result = isCommentPanelContentLoading(result8);
          const value = typeof getCommentEndHintText === "function" ? getCommentEndHintText(result8) : "";
          const value2 = typeof getCommentScrollMetrics === "function" ? getCommentScrollMetrics(result8) : null;
          if (value || !result && num2 >= value10 && (result6 == null || result6 <= 10 || value2?.nearBottom)) {
            break;
          }
          if (num2 >= value10 && num3 >= result15) {
            break;
          }
        } else {
          num2 = 0;
        }
      }
      const local17 = resolveCurrentVisibleVideoUrl(normalizeUrl(window.location.href), value8) || window.location.href || "";
      if (local10()) {
        local2({
          success: false,
          videoMismatch: true,
          authorMismatch: fn28(fn25(value8, value6 || local9), result, result2),
          error: "抓取完成时检测到视频与目标不一致",
          comments: [],
          videoTitle: getVideoTitle(),
          videoUrl: local17,
          videoAuthor: text,
          videoAuthorUrl: text2,
          targetVideoUrl: targetVideoUrl
        });
        return;
      }
      const local18 = list.length >= value && (result6 == null || result6 > value);
      const result16 = local15(local16);
      const obj2 = {
        success: true,
        partialChunk: !!flag,
        comments: list.slice(0, value),
        totalCount: result6 ?? null,
        visibleCount: num,
        maxComments: value,
        capped: local18,
        chunkSize: value2,
        panelOpened: result5,
        newlyCollected: local11(),
        videoTitle: getVideoTitle() || local8,
        videoUrl: local17,
        videoAuthor: text,
        videoAuthorUrl: text2,
        targetVideoUrl: targetVideoUrl,
        resumeState: result16.resumeState
      };
      local3(obj2, {
        force: true
      });
      local2(obj2);
    } catch (error) {
      local2({
        success: false,
        error: error.message,
        errorCode: error.code || "monitor_scrape_page_failed",
        elapsedMs: Date.now() - result4,
        comments: []
      });
    } finally {
      if (local7?.stop) {
        local7.stop();
      }
    }
  }
  function fn33(arg1) {
    if (!arg1) {
      return "";
    }
    try {
      let result = String(arg1 || "").trim();
      if (!result) {
        return "";
      }
      if (result.startsWith("//")) {
        result = "https:" + result;
      }
      if (result.startsWith("/")) {
        result = "" + window.location.origin + result;
      }
      const result2 = extractSpecificVideoId(result);
      if (result2) {
        return "https://www.douyin.com/video/" + result2;
      }
      return result;
    } catch (error) {
      return String(arg1 || "").trim();
    }
  }
  function fn34() {
    const list = ["div[data-e2e=user-detail] div[data-e2e=user-info] h1", "#douyin-right-container div[data-e2e=user-info] h1", "#douyin-right-container h1", "h1"];
    for (const item of list) {
      const result = document.querySelector(item);
      const local = result?.innerText?.trim();
      if (local) {
        return local.replace(/\s+/g, " ");
      }
    }
    return "";
  }
  function fn35(arg1) {
    try {
      const douyinProfileWorkPinned = require("./douyinProfileWorkPinned");
      if (typeof douyinProfileWorkPinned?.isDouyinProfileWorkPinnedNode === "function") {
        return !!douyinProfileWorkPinned.isDouyinProfileWorkPinnedNode(arg1);
      }
    } catch (error) {}
    if (!arg1) {
      return false;
    }
    const local = arg1.closest?.("[data-e2e=\"user-post-item\"], [data-e2e=user-post-item], li, article") || arg1;
    try {
      const result = Array.from(local.querySelectorAll?.("span, div, p, i, label, em") || []);
      for (const item of result) {
        const result = String(item.textContent || "").replace(/\s+/g, "").trim();
        if (result === "置顶" || result.length <= 8 && result.includes("置顶") && !/取消/.test(result)) {
          return true;
        }
      }
      const result2 = String(local.innerText || "").split("\n").map(arg1 => arg1.replace(/\s+/g, "").trim()).filter(Boolean);
      return result2.some(arg1 => arg1 === "置顶" || arg1.length <= 8 && arg1.includes("置顶"));
    } catch (error) {
      return false;
    }
  }
  function fn36(arg1, arg2, arg3) {
    if (!arg1) {
      return null;
    }
    const value = arg1.matches?.("a[href]") ? arg1 : arg1.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"], a[href]");
    const result = fn33(value?.href || value?.getAttribute?.("href"));
    const result2 = extractSpecificVideoId(result);
    if (!result || !result2) {
      return null;
    }
    const local = value?.querySelector?.("img[alt]")?.getAttribute("alt") || "";
    const local2 = value?.getAttribute?.("aria-label") || value?.getAttribute?.("title") || local || arg1.innerText || "";
    const local3 = String(local2 || "").split("\n").map(arg1 => arg1.trim()).filter(Boolean).find(arg1 => !/^\d+$/.test(arg1) && !/^(赞|评论|分享|置顶)$/.test(arg1)) || (arg3 || "主播") + "的新作品 " + (arg2 + 1);
    return {
      url: result,
      awemeId: result2,
      title: local3.replace(/\s+/g, " ").slice(0, 120),
      authorName: arg3,
      rank: arg2 + 1,
      pinned: fn35(value || arg1)
    };
  }
  async function fn37(arg1, arg2, {
    filterPinned = false
  } = {}) {
    const list = [];
    const set = new Set();
    const value = filterPinned === true;
    const local = arg12 => {
      (arg12 || []).forEach((arg12, arg22) => {
        if (list.length >= arg1) {
          return;
        }
        if (value && fn35(arg12)) {
          return;
        }
        const value2 = arg12?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? arg12 : arg12?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || arg12;
        const result = fn36(value2 || arg12, arg22, arg2);
        if (!result || set.has(result.awemeId)) {
          return;
        }
        if (value && result.pinned) {
          return;
        }
        set.add(result.awemeId);
        list.push(result);
      });
    };
    local(typeof findProfileVideoCards === "function" ? findProfileVideoCards({
      ignoreNoWorksGuard: true
    }) : []);
    if (list.length >= arg1) {
      return list;
    }
    const local2 = typeof getProfilePostListRoot === "function" && getProfilePostListRoot() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.querySelector("#douyin-right-container") || document.body;
    const result = Array.from(local2.querySelectorAll?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || []).filter(isVisibleElement);
    result.forEach((arg12, arg22) => {
      if (list.length >= arg1) {
        return;
      }
      if (value && fn35(arg12)) {
        return;
      }
      const result = fn36(arg12, arg22, arg2);
      if (!result || set.has(result.awemeId)) {
        return;
      }
      if (value && result.pinned) {
        return;
      }
      set.add(result.awemeId);
      list.push(result);
    });
    return list;
  }
  function detectMonitorAuthorProfileGone() {
    try {
      const result = String(window.location.href || "");
      if (!result.includes("/user/")) {
        return {
          gone: false,
          reason: "not_profile"
        };
      }
      const value = document.body;
      if (!value) {
        return {
          gone: false,
          reason: "no_body"
        };
      }
      const result2 = document.querySelector("[data-e2e=\"error-page\"], .Ms08YIEh");
      const result3 = String(value.innerText || value.textContent || "");
      const result4 = /抖音号|获赞|粉丝|关注|作品|喜欢/.test(result3);
      const result5 = /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(result3);
      if (result2 || !result4 && result5) {
        return {
          gone: true,
          reason: "user_not_found"
        };
      }
      if (result4) {
        return {
          gone: false,
          reason: "ok"
        };
      }
      return {
        gone: false,
        reason: "unknown"
      };
    } catch (error) {
      return {
        gone: false,
        reason: "probe_error"
      };
    }
  }
  async function runVideoMonitorAuthorWorksScrape(options = {}) {
    const {
      requestId: requestId,
      maxWorks: maxWorks,
      authorUrl: authorUrl,
      filterPinned: filterPinned
    } = options;
    const value = Number.isFinite(Number(maxWorks)) && Number(maxWorks) > 0 ? Math.min(Math.floor(Number(maxWorks)), 20) : 6;
    const value2 = filterPinned === true;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-author-works-result", {
        requestId: requestId,
        ...arg1
      });
    };
    const text = "MONITOR_AUTHOR_WORKS";
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      if (authorUrl && !window.location.href.includes("/user/")) {
        window.location.href = authorUrl;
        await sleep(1200);
      }
      let num = 0;
      for (let num2 = 0; num2 < 8 && !shouldAbort(text); num2 += 1) {
        const result = detectMonitorAuthorProfileGone();
        if (result.gone) {
          num += 1;
          if (num >= 3) {
            local({
              success: false,
              error: "用户不存在（主页链接失效）",
              errorCode: "USER_NOT_FOUND",
              reason: "user_not_found",
              works: [],
              authorUrl: window.location.href
            });
            return;
          }
        } else if (result.reason === "ok") {
          break;
        } else {
          num = 0;
        }
        await sleep(350);
      }
      const local2 = (typeof fn34 === "function" ? fn34() : "") || "";
      let local3 = null;
      if (typeof waitForProfileWorksReady === "function") {
        try {
          local3 = await waitForProfileWorksReady(text, 8000);
        } catch (error) {
          local3 = null;
        }
      }
      if (local3?.noWorks) {
        local({
          success: false,
          error: "主播暂无公开作品",
          works: [],
          authorName: local2,
          worksCount: 0,
          reason: local3.reason || "no_works",
          authorUrl: window.location.href
        });
        return;
      }
      let result = await fn37(value, local2, {
        filterPinned: value2
      });
      if (result.length < value) {
        const local = typeof getProfilePostListRoot === "function" && getProfilePostListRoot() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
        for (let num = 0; num < 4 && result.length < value; num += 1) {
          try {
            local?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]")?.scrollBy?.(0, 700);
            window.scrollBy?.(0, 500);
          } catch (error) {}
          await sleep(500);
          result = await fn37(value, local2, {
            filterPinned: value2
          });
        }
      }
      if (result.length === 0) {
        const local4 = local3?.worksCount ?? (typeof parseProfileWorksCount === "function" ? parseProfileWorksCount() : null);
        const local5 = local4 === 0 || !!local3?.noWorks;
        local({
          success: false,
          error: local5 ? "主播暂无公开作品" : "未解析到作品链接，请确认主页可访问",
          works: [],
          authorName: local2,
          worksCount: local4,
          reason: local5 ? "no_works" : "no_video_cards",
          authorUrl: window.location.href
        });
        return;
      }
      local({
        success: true,
        works: result,
        authorName: local2,
        worksCount: local3?.worksCount ?? result.length,
        authorUrl: window.location.href
      });
    } catch (error) {
      local({
        success: false,
        error: error.message,
        works: []
      });
    }
  }
  function fn40(arg1, arg2) {
    const result = String(arg1 || extractSpecificVideoId(arg2) || extractVideoIdFromHref(arg2) || "").trim();
    const result2 = fn41(24);
    for (const item of result2) {
      const local = item?.href || item?.getAttribute?.("href") || "";
      const local2 = extractSpecificVideoId(local) || extractVideoIdFromHref(local);
      if (result && local2 && String(local2) === result) {
        return item;
      }
    }
    return null;
  }
  async function fn42(arg1, arg2, arg3) {
    let result = fn40(arg1, arg2);
    if (result) {
      return result;
    }
    if (typeof ensureProfileWorksTab === "function") {
      try {
        await ensureProfileWorksTab(arg3);
      } catch (error) {}
    }
    const local = typeof getProfilePostListRoot === "function" && getProfilePostListRoot() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
    for (let num = 0; num < 6 && !result; num += 1) {
      try {
        const local2 = local?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]") || local;
        local2?.scrollBy?.(0, 700);
        window.scrollBy?.(0, 500);
      } catch (error) {}
      await sleep(450);
      result = fn40(arg1, arg2);
    }
    return result;
  }
  function fn43() {
    const list = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[data-e2e=\"video-player-container\"]", "[class*=\"VideoDetail\"]", "[class*=\"video-detail\"]", "[class*=\"DetailModal\"]", "[class*=\"detail-modal\"]", "[class*=\"SearchDetail\"]", "[role=\"dialog\"]"];
    for (const item of list) {
      try {
        const result = document.querySelectorAll(item);
        for (const item2 of result) {
          if (!item2) {
            continue;
          }
          const result = getVideoEngageSelector({
            getVideoEngagePack: getVideoEngagePack
          }, "likeSelectors");
          const value = result ? "video, [data-e2e=\"video-player\"], .xgplayer, img, canvas, " + result : "video, [data-e2e=\"video-player\"], .xgplayer, img, canvas";
          const flag = !!item2.querySelector?.(value);
          const flag2 = !!item2.querySelector?.("[data-e2e=\"video-player-close-icon\"], [aria-label=\"关闭\"], [class*=\"close\"]");
          if (flag || flag2 || /video-detail|VideoDetail|modal-video/i.test(item)) {
            return item2;
          }
        }
      } catch (error) {}
    }
    return null;
  }
  function fn44(arg1) {
    const result = String(arg1 || "").trim();
    try {
      if (typeof isSpecificVideoDetailReady === "function" && isSpecificVideoDetailReady(result)) {
        return true;
      }
    } catch (error) {}
    try {
      if (typeof hasSpecificVideoTargetInUrl === "function" && !hasSpecificVideoTargetInUrl(result)) {
        return false;
      }
    } catch (error) {}
    const result2 = String(window.location.href || "");
    if (/\/(?:video|note)\//.test(result2)) {
      const result = getVideoEngageSelector({
        getVideoEngagePack: getVideoEngagePack
      }, "likeSelectors");
      return !!document.querySelector("video, [data-e2e=\"video-player\"], .xgplayer") || !!result && !!document.querySelector(result);
    }
    if (!/\/jingxuan/.test(result2) && !/modal_id=/.test(result2)) {
      return false;
    }
    if (fn43()) {
      return true;
    }
    const result3 = getVideoEngageSelector({
      getVideoEngagePack: getVideoEngagePack
    }, "likeSelectors");
    if (result3 && document.querySelector(result3)) {
      return true;
    }
    try {
      const value = typeof lookupSpecificVideoApiProbe === "function" ? lookupSpecificVideoApiProbe(result) : null;
      if (value?.status === "ready") {
        return true;
      }
    } catch (error) {}
    return false;
  }
  async function fn31(arg1, text = "", num = 35000) {
    const result = String(text || "").trim();
    try {
      ensureSpecificVideoApiHook();
    } catch (error) {}
    const result2 = Date.now();
    let num2 = 0;
    let num3 = 0;
    const num4 = 28000;
    const num5 = 18000;
    const result3 = Math.max(12000, Math.min(70000, Number(num) || 35000));
    while (!shouldAbort(arg1) && Date.now() - result2 < result3) {
      try {
        const local = fn43() || (typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
          includeFeed: false
        }) : null);
        const local2 = local || (typeof getDouyinFeedScope === "function" ? getDouyinFeedScope() : null) || document;
        pauseVisibleDouyinVideos(local2, "监控：等待视频有效性确认期间暂停");
      } catch (error) {}
      if (fn44(result)) {
        return {
          status: "ready",
          cancelled: false
        };
      }
      let text = "waiting";
      try {
        if (typeof evaluateSpecificVideoOpenProgress === "function") {
          text = evaluateSpecificVideoOpenProgress(result);
        }
      } catch (error) {
        text = "waiting";
      }
      if (text === "ready") {
        return {
          status: "ready",
          cancelled: false
        };
      }
      if (text === "unavailable") {
        num2 += 1;
        if (num2 >= 8 && Date.now() - result2 >= num5) {
          return {
            status: "unavailable",
            reason: "unavailable",
            cancelled: false
          };
        }
      } else {
        num2 = 0;
      }
      if (text === "loading") {
        num3 = 0;
        num2 = 0;
        await sleep(500);
        continue;
      }
      if (text === "bare_jingxuan") {
        num3 += 1;
        if (num3 >= 10 && Date.now() - result2 >= num4 && !fn43()) {
          return {
            status: "bare_jingxuan",
            reason: "bare_jingxuan",
            cancelled: false
          };
        }
      } else {
        num3 = 0;
      }
      await sleep(400);
    }
    if (shouldAbort(arg1)) {
      return {
        status: "cancelled",
        cancelled: true
      };
    }
    if (fn44(result)) {
      return {
        status: "ready",
        cancelled: false
      };
    }
    return {
      status: "timeout",
      cancelled: false
    };
  }
  async function runVideoMonitorWaitVideoReady(options = {}) {
    const {
      requestId: requestId,
      videoUrl: videoUrl,
      timeoutMs: timeoutMs
    } = options;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-nav-result", {
        requestId: requestId,
        ...arg1
      });
    };
    const text = "MONITOR_WAIT_READY";
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const result = String(videoUrl || "").trim();
      const value = Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0 ? Math.min(70000, Math.max(12000, Math.floor(Number(timeoutMs)))) : 35000;
      const result2 = await fn31(text, result, value);
      const value2 = result2.status === "ready" ? "ready" : result2.status === "unavailable" ? "unavailable" : result2.status === "cancelled" ? "aborted" : "timeout";
      const value3 = value2 === "ready";
      const value4 = value2 === "unavailable";
      const local2 = fn43() || (typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) : null);
      const local3 = local2 || getDouyinFeedScope?.() || document;
      try {
        pauseVisibleDouyinVideos(local3, "监控：视频就绪后暂停");
      } catch (error) {}
      const value5 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, local3) || "" : window.location.href || "";
      local({
        success: !!value3,
        ready: !!value3,
        unavailable: value4,
        reason: value4 ? result2.reason || "unavailable" : result2.status === "bare_jingxuan" ? "bare_jingxuan_soft" : "",
        status: value2,
        videoUrl: value5 || result,
        error: value3 ? "" : value4 ? "视频失效或无法打开" : value2 === "aborted" ? "已取消" : "视频页未就绪"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      local({
        success: false,
        ready: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runVideoMonitorConfirmAuthor(options = {}) {
    const {
      requestId: requestId,
      videoUrl: videoUrl,
      expectedAuthorUrl: expectedAuthorUrl,
      expectedSecUid: expectedSecUid,
      timeoutMs: timeoutMs
    } = options;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-nav-result", {
        requestId: requestId,
        ...arg1
      });
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const result = fn26(expectedAuthorUrl, expectedSecUid);
      if (!result) {
        local({
          success: true,
          matched: true,
          skipped: true,
          reason: "no_expected_author"
        });
        return;
      }
      const local2 = fn43() || (typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) : null);
      const local3 = local2 || getDouyinFeedScope?.() || document;
      try {
        pauseVisibleDouyinVideos(local3, "监控：确认博主前暂停");
      } catch (error) {}
      const value = Number.isFinite(Number(timeoutMs)) && Number(timeoutMs) > 0 ? Math.min(12000, Math.max(2000, Math.floor(Number(timeoutMs)))) : 6000;
      const result2 = await fn29(local3, {
        expectedVideoUrl: videoUrl,
        expectedAuthorUrl: expectedAuthorUrl,
        expectedSecUid: expectedSecUid,
        timeoutMs: value
      });
      const local4 = result2.author || {};
      local({
        success: !!result2.ok,
        matched: !!result2.ok,
        authorMismatch: !!result2.authorMismatch,
        authorUnconfirmed: !!result2.authorUnconfirmed,
        nickname: String(local4.nickname || "").trim(),
        authorUrl: String(local4.profileUrl || "").trim(),
        pageUrl: String(local4.pageUrl || window.location.href || "").trim(),
        secUid: String(local4.secUid || local4.pageSecUid || "").trim(),
        videoUrl: typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, local3) || window.location.href || "" : window.location.href || "",
        error: result2.ok ? "" : result2.authorMismatch ? "当前作品不是目标博主" : "未能确认当前作品博主"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          matched: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      local({
        success: false,
        matched: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runVideoMonitorOpenSpecificVideo(options = {}) {
    const {
      requestId: requestId,
      videoUrl: videoUrl
    } = options;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-nav-result", {
        requestId: requestId,
        ...arg1
      });
    };
    const text = "MONITOR_OPEN_SPECIFIC";
    const num = 35000;
    const num2 = 3;
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const result = String(videoUrl || "").trim();
      if (!result) {
        local({
          success: false,
          ready: false,
          status: "timeout",
          error: "缺少视频链接"
        });
        return;
      }
      const value = typeof convertToDouyinModalUrl === "function" ? convertToDouyinModalUrl(result) : result;
      try {
        const result2 = extractSpecificVideoId(value || result);
        if (result2 && typeof saveSpecificVideoState === "function") {
          saveSpecificVideoState(result2, {
            openAttempt: 0,
            loadStartedAt: Date.now(),
            count: 0,
            probing: false,
            probed: false
          });
        }
      } catch (error) {}
      let text2 = "timeout";
      let text3 = "";
      for (let num3 = 1; num3 <= num2; num3 += 1) {
        if (shouldAbort(text)) {
          text2 = "aborted";
          break;
        }
        const value2 = typeof hasSpecificVideoTargetInUrl === "function" ? hasSpecificVideoTargetInUrl(value || result) : false;
        if (!value2 || num3 > 1) {
          try {
            window.location.href = value || result;
            if (typeof waitSpecificVideoNavAppear === "function") {
              await waitSpecificVideoNavAppear(text);
            } else {
              await sleep(1500);
            }
          } catch (error) {}
        }
        const result2 = await fn31(text, value || result, num);
        if (result2.status === "ready") {
          text2 = "ready";
          text3 = "";
          break;
        }
        if (result2.status === "unavailable") {
          text2 = "unavailable";
          text3 = result2.reason || "unavailable";
          break;
        }
        if (result2.status === "cancelled") {
          text2 = "aborted";
          break;
        }
        text2 = "timeout";
        text3 = result2.reason || result2.status || "timeout";
        if (num3 < num2) {
          console.warn("[Monitor-Open] 第 " + num3 + "/" + num2 + " 次精选未就绪" + ((result2.status === "bare_jingxuan" ? "（精选空壳，慢网重试）" : "") + "，同链重进…"));
        }
      }
      const value2 = text2 === "ready";
      const value3 = text2 === "unavailable";
      const local2 = fn43() || (typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: false
      }) : null);
      const local3 = local2 || getDouyinFeedScope?.() || document;
      try {
        pauseVisibleDouyinVideos(local3, "监控：指定视频打开后暂停");
      } catch (error) {}
      const value4 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, local3) || "" : window.location.href || "";
      local({
        success: value2,
        ready: value2,
        status: text2,
        unavailable: value3,
        reason: value3 ? text3 || "unavailable" : text3 || "",
        videoUrl: value4 || value || result,
        error: value2 ? "" : value3 ? "视频失效或无法打开" : text2 === "aborted" ? "已取消" : "指定视频打开超时"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true,
          status: "aborted",
          error: "已取消"
        });
        return;
      }
      local({
        success: false,
        ready: false,
        status: "timeout",
        error: error?.message || String(error)
      });
    }
  }
  async function fn32(arg1, arg2, text = "") {
    const local = arg2 || document.body;
    const num = 40000;
    const value = Date.now() + num;
    const local2 = async (num = 1) => {
      let flag = false;
      const value2 = value - Date.now();
      if (value2 <= 800) {
        return false;
      }
      try {
        const value2 = typeof getEntityCommentScraperModule === "function" ? getEntityCommentScraperModule() : null;
        if (value2?.openEntityCommentPanel) {
          const value3 = typeof buildEntityCommentScraperDeps === "function" ? buildEntityCommentScraperDeps() : {};
          const value4 = num >= 2;
          const result = await value2.openEntityCommentPanel({
            ...value3,
            token: Date.now(),
            taskId: text || "",
            scope: local,
            loopId: arg1,
            getCommentTabPrefix: typeof getCommentTabPrefix === "function" ? getCommentTabPrefix : () => "评论",
            isVisibleElement: isVisibleElement,
            simulateHumanClick: typeof simulateHumanClick === "function" ? simulateHumanClick : null,
            waitFn: async arg12 => {
              if (Date.now() >= value || shouldAbort(arg1)) {
                return false;
              }
              await sleep(Math.min(arg12, Math.max(0, value - Date.now())));
              return !shouldAbort(arg1) && Date.now() < value;
            },
            isCancelled: () => shouldAbort(arg1) || Date.now() >= value,
            logFn: () => {},
            postTabWaitMs: value4 ? 1200 : 900,
            postIconWaitMs: value4 ? 1400 : 1100,
            postTabAgainWaitMs: value4 ? 1000 : 800,
            maxInspectRounds: value4 ? 18 : 14,
            inspectIntervalMs: value4 ? 1000 : 850
          });
          flag = !!result?.opened;
        }
      } catch (error) {
        console.warn("[Monitor-Scrape] 共用开评路径异常:", error?.message || error);
      }
      if (!flag && typeof ensureCommentPanelOpen === "function" && Date.now() < value) {
        try {
          flag = !!(await ensureCommentPanelOpen(local, arg1, {
            deadlineAt: Math.min(value, Date.now() + (num >= 2 ? 18000 : 14000))
          }));
        } catch (error) {}
      }
      return flag;
    };
    if (shouldAbort(arg1)) {
      return false;
    }
    for (let num = 1; num <= 2; num += 1) {
      if (shouldAbort(arg1) || Date.now() >= value) {
        return false;
      }
      const result = await local2(num);
      if (result) {
        return true;
      }
      console.warn("[Monitor-Scrape] 第 " + num + "/2 次打开评论区未成功，继续重试…");
      if (num < 2) {
        try {
          await sleep(900);
        } catch (error) {}
      }
    }
    return false;
  }
  function fn41(num = 12) {
    const list = [];
    const set = new Set();
    const local = arg1 => {
      if (!arg1 || list.length >= num) {
        return;
      }
      const value = arg1.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") ? arg1 : arg1.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || null;
      const local = value || arg1;
      const result = String(local?.href || local?.getAttribute?.("href") || "").trim();
      const local2 = extractSpecificVideoId(result) || extractVideoIdFromHref(result) || "";
      const local3 = local2 || result || local?.outerHTML?.slice(0, 60);
      if (!local3 || set.has(local3)) {
        return;
      }
      if (!local2 && !/\/video\/|\/note\/|modal_id=/.test(result)) {
        return;
      }
      set.add(local3);
      list.push(local);
    };
    const local2 = typeof getProfilePostListRoot === "function" && getProfilePostListRoot() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.querySelector("#douyin-right-container") || document.body;
    const list2 = ["a[href*=\"/video/\"]", "a[href*=\"/note/\"]", "a[href*=\"modal_id\"]", "[data-e2e=\"user-post-item\"]", "ul[data-e2e=scroll-list] > li", "ul[data-e2e=\"scroll-list\"] > li", "[role=\"listitem\"]"];
    for (const item of list2) {
      try {
        Array.from(local2.querySelectorAll?.(item) || []).forEach(local);
      } catch (error) {}
      if (list.length >= num) {
        break;
      }
    }
    return list;
  }
  function fn48(arg1, {
    skipPinned = false
  } = {}) {
    const value = Array.isArray(arg1) ? arg1 : [];
    if (!skipPinned) {
      return value[0] || null;
    }
    return value.find(arg1 => !fn35(arg1)) || null;
  }
  async function fn49(arg1, options = {}) {
    const value = options.knownHasWorks === true;
    const value2 = options.skipPinned === true;
    const value3 = value2 ? 20 : 8;
    if (!value && typeof waitForProfileWorksReady === "function") {
      try {
        const result = await waitForProfileWorksReady(arg1, 6000);
        if (result?.noWorks) {
          return null;
        }
      } catch (error) {}
    } else if (typeof ensureProfileWorksTab === "function") {
      try {
        await ensureProfileWorksTab(arg1);
      } catch (error) {}
    }
    let result = fn41(value3);
    let result2 = fn48(result, {
      skipPinned: value2
    });
    if (result2) {
      return result2;
    }
    const local = typeof getProfilePostListRoot === "function" && getProfilePostListRoot() || document.querySelector("div[data-e2e=user-post-list], div[data-e2e=\"user-post-list\"]") || document.documentElement;
    const value4 = value ? 6 : 3;
    for (let num = 0; num < value4 && !result2; num += 1) {
      try {
        const local2 = local?.querySelector?.("[data-e2e=scroll-list], [data-e2e=\"scroll-list\"]") || local;
        local2?.scrollBy?.(0, 500);
        window.scrollBy?.(0, 400);
      } catch (error) {}
      await sleep(value ? 400 : 300);
      result = fn41(value3);
      result2 = fn48(result, {
        skipPinned: value2
      });
    }
    return result2 || null;
  }
  async function runVideoMonitorOpenAuthorWork(options = {}) {
    const {
      requestId: requestId,
      awemeId: awemeId,
      url: url,
      preferFirstCard: preferFirstCard,
      skipPinnedCards: skipPinnedCards,
      knownHasWorks: knownHasWorks,
      authorUrl: authorUrl,
      allowUrlFallback: allowUrlFallback
    } = options;
    const value = allowUrlFallback !== false;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-nav-result", {
        requestId: requestId,
        ...arg1
      });
    };
    const text = "MONITOR_OPEN_AUTHOR_WORK";
    const local2 = (arg1, options = {}) => {
      const value = "[Monitor-Open] " + arg1;
      console.log(value, Object.keys(options).length ? options : "");
      return value;
    };
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      try {
        if (!state.currentViewKey) {
          state.currentViewKey = window.__radar_view_key || safeSessionGet("radar_view_key") || null;
        }
      } catch (error) {}
      const result = String(awemeId || extractSpecificVideoId(url) || "").trim();
      const local3 = String(authorUrl || "").trim() || (window.location.href.includes("/user/") ? window.location.href : "");
      const value2 = preferFirstCard !== false;
      const value3 = skipPinnedCards === true;
      const list = [];
      local2("start abort=" + shouldAbort(text) + " stop=" + state.stopRequested + " taskRunning=" + state.taskRunning + " viewKey=" + (state.currentViewKey || "none") + " skipPinned=" + value3 + " href=" + String(window.location.href || "").slice(0, 80));
      list.push("abort=" + shouldAbort(text) + ",viewKey=" + !!state.currentViewKey + ",skipPinned=" + value3);
      if (!window.location.href.includes("/user/") && local3) {
        window.location.href = local3.split("?")[0];
        await sleep(1500);
      }
      if (!window.location.href.includes("/user/")) {
        local({
          success: false,
          reason: "not_on_profile",
          error: "当前不在主播主页",
          debug: list.join("|")
        });
        return;
      }
      let local4 = null;
      let text2 = "";
      if (value2) {
        const value = typeof findProfileVideoCards === "function" ? findProfileVideoCards({
          ignoreNoWorksGuard: true
        }) : [];
        local4 = fn48(value, {
          skipPinned: value3
        });
        if (local4) {
          text2 = value3 ? "shared_non_pinned" : "shared";
        } else {
          local4 = await fn49(text, {
            knownHasWorks: knownHasWorks === true || !!result,
            skipPinned: value3
          });
          text2 = local4 ? value3 ? "monitor_non_pinned" : "monitor" : "";
        }
      }
      if (!local4 && result) {
        local4 = await fn42(result, url, text);
        if (local4) {
          text2 = "by_id";
        }
      }
      const value4 = local4?.matches?.("a[href*=\"/video/\"], a[href*=\"/note/\"]") ? local4 : local4?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], a[href*=\"modal_id\"]") || local4;
      const local5 = value4?.href || value4?.getAttribute?.("href") || "";
      let local6 = extractSpecificVideoId(local5) || extractVideoIdFromHref(local5) || result;
      const local7 = value4?.getBoundingClientRect?.() || null;
      local2("card source=" + (text2 || "none") + " clickId=" + (local6 || "none") + " href=" + String(local5).slice(0, 60) + " size=" + (local7 ? Math.round(local7.width) + "x" + Math.round(local7.height) : "n/a"));
      list.push("card=" + (text2 || "none") + ",id=" + (local6 || "none") + ",size=" + (local7 ? Math.round(local7.width) + "x" + Math.round(local7.height) : 0));
      try {
        window.focus?.();
      } catch (error) {}
      try {
        if (state.currentViewKey) {
          ipcRenderer.send("focus-automation-view", {
            viewKey: state.currentViewKey,
            bringToFront: false
          });
        }
      } catch (error) {
        local2("focus soft failed: " + (error?.message || error));
        list.push("focus_soft_fail");
      }
      let flag = false;
      if (value4 && !shouldAbort(text)) {
        try {
          local2("simulateHumanClick abort=" + shouldAbort(text));
          await simulateHumanClick(value4, text);
          flag = true;
          list.push("clicked");
        } catch (error) {
          const result = String(error?.message || error);
          local2("click error: " + result);
          list.push("click_err=" + result);
          if (result === "TASK_ABORTED") {
            throw error;
          }
        }
      } else if (!value4) {
        list.push("no_card");
      } else {
        list.push("skip_click_aborted");
      }
      let flag2 = false;
      if (flag) {
        if (typeof waitForProfileVideoDetailScope === "function") {
          const result = await waitForProfileVideoDetailScope(text, local6 || "", {
            maxWaitMs: 6500
          });
          flag2 = !!result;
          local2("detailScope ready=" + flag2 + " diag=" + (state.lastProfileVideoDetailDiagnostic || ""));
          list.push("scope=" + flag2);
          if (!local6 && typeof getVideoIdFromPageUrl === "function") {
            local6 = getVideoIdFromPageUrl() || local6;
          }
        }
        if (!flag2) {
          flag2 = await waitForVideoDetailReadyAndPause(text, local6 ? "https://www.douyin.com/video/" + local6 : url || "", 4000);
          list.push("readyWait=" + flag2);
        }
      }
      if (!flag2 && local6 && value) {
        const value = typeof toSpecificVideoJingxuanUrl === "function" ? toSpecificVideoJingxuanUrl(local6) : "https://www.douyin.com/jingxuan?modal_id=" + local6;
        local2("click no detail → jingxuan " + value);
        list.push("fallback_jingxuan");
        try {
          window.location.href = value;
          flag2 = await waitForVideoDetailReadyAndPause(text, "https://www.douyin.com/video/" + local6, 10000);
          if (flag2) {
            local({
              success: true,
              videoUrl: "https://www.douyin.com/video/" + local6,
              awemeId: local6,
              matched: true,
              reason: "opened_via_jingxuan_modal_id",
              error: "",
              debug: list.join("|")
            });
            return;
          }
        } catch (error) {
          if (String(error?.message || error) === "TASK_ABORTED") {
            throw error;
          }
          list.push("jingxuan_err=" + (error?.message || error));
        }
      } else if (!flag2 && local6 && !value) {
        list.push("url_fallback_disabled");
      }
      const result2 = resolveDouyinVideoDetailModal({
        includeFeed: true
      });
      const value5 = result2 && isVisibleElement(result2) ? result2 : getDouyinFeedScope() || document;
      try {
        pauseVisibleDouyinVideos(value5, "监控：打开作品后暂停");
      } catch (error) {}
      const value6 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, value5) || "" : window.location.href || "";
      const local8 = extractSpecificVideoId(value6) || extractVideoIdFromHref(value6) || extractSpecificVideoId(window.location.href) || (flag2 ? local6 : "");
      const value7 = value2 ? !!local8 : !result || !!local8 && String(local8) === result;
      const local9 = !!flag2 && !!value7 && !!local8;
      local2("finish ok=" + local9 + " openedId=" + (local8 || "none") + " ready=" + flag2 + " steps=" + list.join("|"));
      local({
        success: local9,
        videoUrl: value6 || (local8 ? "https://www.douyin.com/video/" + local8 : ""),
        awemeId: local8 || "",
        matched: value7,
        reason: flag2 ? value7 ? flag ? "opened_first_card" : "opened" : "mismatch" : local4 ? "click_no_detail" : "card_not_found",
        error: flag2 ? value7 ? "" : "打开后作品不匹配" : local4 ? "已点卡片但详情未打开" : "主页未找到作品卡片",
        debug: list.join("|")
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true,
          reason: "aborted",
          error: "已取消",
          debug: "abort stop=" + state.stopRequested + " taskRunning=" + state.taskRunning + " activeLoop=" + (state.activeLoopId || "")
        });
        return;
      }
      local({
        success: false,
        error: error?.message || String(error)
      });
    }
  }
  async function runVideoMonitorMoveNextVideo(options = {}) {
    const {
      requestId: requestId,
      expectedAwemeId: expectedAwemeId,
      requireMatch: requireMatch
    } = options;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-nav-result", {
        requestId: requestId,
        ...arg1
      });
    };
    const text = "MONITOR_MOVE_NEXT";
    try {
      if (!state.taskRunning) {
        state.stopRequested = false;
      }
      const result = String(expectedAwemeId || "").trim();
      const value = requireMatch === true;
      const value2 = typeof resolveDouyinVideoDetailModal === "function" ? resolveDouyinVideoDetailModal({
        includeFeed: true
      }) : null;
      const value3 = typeof isViewingDouyinVideoPage === "function" ? isViewingDouyinVideoPage(window.location.href) : /\/video\/|\/note\/|modal_id=/.test(window.location.href || "");
      if ((!value2 || !isVisibleElement(value2)) && !value3) {
        local({
          success: false,
          continued: false,
          reason: "no_video_surface",
          error: "当前不在视频详情"
        });
        return;
      }
      const local2 = getDouyinFeedScope?.() || value2 || document;
      const value4 = typeof getFeedVideoIdentity === "function" ? getFeedVideoIdentity(local2) || "" : "";
      const value5 = typeof getVideoTitle === "function" ? String(getVideoTitle() || "") : "";
      const value6 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, local2) || "" : "";
      const local3 = extractSpecificVideoId(value6) || extractVideoIdFromHref(value6) || extractSpecificVideoId(window.location.href) || "";
      await moveToNextVideo(text);
      let flag = false;
      if (typeof awaitFeedVideoSwitchSettled === "function") {
        flag = await awaitFeedVideoSwitchSettled(text, {
          previousIdentity: value4,
          previousTitle: value5,
          leadVideoUrl: value6 || (local3 ? "https://www.douyin.com/video/" + local3 : ""),
          dedupKey: local3,
          phaseLabel: "监控主页切条",
          preferredScope: null,
          acceptTitleOnlySwitch: true
        });
      } else {
        await sleep(1800);
        const value = typeof getFeedVideoIdentity === "function" ? getFeedVideoIdentity(getDouyinFeedScope?.() || value2 || document) || "" : "";
        flag = !!value && value !== value4;
      }
      const value7 = value2 && isVisibleElement(value2) ? value2 : getDouyinFeedScope() || document;
      try {
        pauseVisibleDouyinVideos(value7, "监控：切条后暂停");
      } catch (error) {}
      const value8 = typeof resolveCurrentVisibleVideoUrl === "function" ? resolveCurrentVisibleVideoUrl(window.location.href, value7) || "" : window.location.href || "";
      const local4 = extractSpecificVideoId(value8) || extractVideoIdFromHref(value8) || extractSpecificVideoId(window.location.href) || "";
      const local5 = !!local4 && !!local3 && local4 !== local3;
      if (!flag && local5) {
        flag = true;
      }
      const local6 = !result || !!local4 && String(local4) === result;
      const value9 = value ? !!flag && !!local6 : !!flag;
      local({
        success: value9,
        continued: !!flag,
        videoUrl: value8 || (local4 ? "https://www.douyin.com/video/" + local4 : ""),
        awemeId: local4,
        matched: local6,
        reason: flag ? local6 || !value ? "switched" : "mismatch" : "not_switched",
        error: value9 ? "" : flag ? "下一条作品不匹配" : "未能切换到下一条"
      });
    } catch (error) {
      if (String(error?.message || error) === "TASK_ABORTED") {
        local({
          success: false,
          cancelled: true,
          error: "已取消"
        });
        return;
      }
      local({
        success: false,
        continued: false,
        error: error?.message || String(error)
      });
    }
  }
  function fn52(arg1) {
    const result = String(arg1 || "").replace(/\s+/g, "").trim();
    if (!result) {
      return "unknown";
    }
    if (/请求中|已请求|等待通过|待通过/.test(result)) {
      return "requested";
    }
    if (/已关注|相互关注|互相关注|取消关注/.test(result)) {
      return "followed";
    }
    if (/^(关注|\+关注|关注Ta|回关|\+)$/.test(result)) {
      return "available";
    }
    return "unknown";
  }
  function fn53(arg1) {
    if (!arg1) {
      return "";
    }
    const result = [arg1.innerText, arg1.textContent, arg1.getAttribute?.("aria-label"), arg1.getAttribute?.("title")].map(arg1 => String(arg1 || "").trim()).filter(Boolean);
    return result.find(arg1 => fn52(arg1) !== "unknown") || result[0] || "";
  }
  function fn54(arg1) {
    if (!arg1) {
      return "无控件";
    }
    try {
      const result = arg1.getBoundingClientRect();
      const result2 = String(arg1.tagName || "?").toUpperCase();
      return result2 + " " + Math.round(result.width) + "x" + Math.round(result.height) + ("@(" + Math.round(result.left) + "," + Math.round(result.top) + ")");
    } catch (error) {
      return String(arg1.tagName || "未知控件");
    }
  }
  function detectMonitorPrivateProfile() {
    const result = document.querySelector("[data-e2e*=\"private\" i], [class*=\"private\" i], [class*=\"privacy\" i]");
    const result2 = String(result?.innerText || result?.textContent || "").trim();
    if (/私密账号|私密用户|仅粉丝可见/.test(result2)) {
      return true;
    }
    return Array.from(document.querySelectorAll("span, p")).some(arg1 => /^(私密账号|私密用户|仅粉丝可见)$/.test(String(arg1.innerText || arg1.textContent || "").trim()));
  }
  function fn56(arg1, arg2, arg3, text = "") {
    const list = ["关注前=" + (arg1 || "未知"), "关注后=" + (arg2 || "未知"), "私密账号=" + (arg3 ? "是" : "否/未识别")];
    if (text) {
      list.push("点击=" + text);
    }
    return list.join("；");
  }
  function fn57() {
    const result = Array.from(document.querySelectorAll("[role=\"alert\"], [role=\"dialog\"], .semi-toast-content, [class*=\"toast\" i], [class*=\"Toast\"], [class*=\"modal\" i]"));
    for (const item of result) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const result = String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
      if (!result || result.length > 300) {
        continue;
      }
      if (/隐私设置|无法关注|不能关注|关注失败|操作频繁|请求失败|关注人数.*上限|稍后再试/.test(result)) {
        return result;
      }
    }
    return "";
  }
  async function fn58(options = {}, arg2) {
    const local = arg2 || "PROFILE_FOLLOW_" + Date.now();
    const value = state.currentTask;
    state.currentTask = {
      ...(value || {}),
      taskMode: "interaction",
      enableFollow: true,
      nickname: options.nickname || value?.nickname || "",
      lead: {
        ...(value?.lead || {}),
        nickname: options.nickname || "",
        userUrl: options.userUrl || ""
      }
    };
    try {
      try {
        await closeAllModals(local);
      } catch (error) {}
      if (!String(window.location.href || "").includes("/user/")) {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: "当前不在用户主页，无法关注",
          errorCode: "not_on_profile",
          isPrivate: false,
          diagnostic: "url=" + window.location.href
        };
      }
      return await performVideoMonitorFollow({
        nickname: options.nickname || "",
        userUrl: options.userUrl || ""
      }, local);
    } finally {
      state.currentTask = value;
    }
  }
  async function fn60(options = {}, arg2) {
    const {
      nickname = "",
      userUrl = "",
      content = "",
      commentText = "",
      timeText = "",
      replyText = "",
      replyContent = "",
      commentId = "",
      cid = "",
      fastLocate = false
    } = options || {};
    const local = arg2 || "COMMENT_REPLY_" + Date.now();
    const result = String(commentId || cid || "").trim();
    const obj = {
      nickname: nickname,
      userUrl: userUrl,
      content: content || commentText || "",
      comment: content || commentText || "",
      timeText: timeText || "",
      commentId: result,
      cid: result
    };
    const local2 = replyText || replyContent || "";
    const flag = !!fastLocate;
    const value = state.currentTask;
    state.currentTask = {
      ...(value || {}),
      taskMode: "interaction",
      enableComment: true,
      enableLike: true,
      enableDM: true,
      aiReplyMode: false,
      nickname: nickname,
      lead: obj
    };
    try {
      try {
        await ensureCommentPanelOpen(document.body, local);
        if (!flag) {
          const result = findCommentScrollContainer(document.body);
          if (result && result.scrollTop > 20) {
            result.scrollTop = 0;
            await sleep(700);
          }
        }
      } catch (error) {}
      return await performReply(document, obj, local, local2, {
        fastLocate: flag
      });
    } finally {
      state.currentTask = value;
    }
  }
  ipcRenderer.on("self-warmup-profile-follow", async (arg1, options = {}) => {
    const {
      requestId: requestId,
      nickname: nickname,
      userUrl: userUrl
    } = options;
    state.stopRequested = false;
    state.pausedForSubview = false;
    const value = state.currentTask;
    try {
      state.currentTask = {
        ...(value || {}),
        taskMode: "interaction",
        enableFollow: true,
        nickname: nickname || "",
        lead: {
          nickname: nickname || "",
          userUrl: userUrl || ""
        }
      };
      const result = await fn58({
        nickname: nickname,
        userUrl: userUrl
      }, "SELF_WARMUP");
      const local = !!result?.followed || !!result?.alreadyFollowed;
      const local2 = !!result?.followRequested || result?.followStatus === "requested";
      ipcRenderer.send("self-warmup-profile-follow-result", {
        requestId: requestId,
        ok: local || local2,
        reason: local || local2 ? "" : result?.error || "关注未确认",
        alreadyFollowed: !!result?.alreadyFollowed,
        followStatus: result?.followStatus || "",
        followed: !!result?.followed,
        followRequested: local2 && !local,
        isPrivate: !!result?.isPrivate,
        errorCode: result?.errorCode || "",
        diagnostic: result?.diagnostic || null
      });
    } catch (error) {
      ipcRenderer.send("self-warmup-profile-follow-result", {
        requestId: requestId,
        ok: false,
        reason: error?.message || String(error)
      });
    } finally {
      state.currentTask = value;
    }
  });
  ipcRenderer.on("self-warmup-reply-comment", async (arg1, options = {}) => {
    const {
      requestId: requestId,
      nickname: nickname,
      userUrl: userUrl,
      commentText: commentText,
      timeText: timeText,
      replyText: replyText
    } = options;
    state.stopRequested = false;
    state.pausedForSubview = false;
    const value = state.currentTask;
    try {
      const flag = !String(replyText || "").trim();
      const local = !!options.enableCommentExpression || !!options.enableCommentImage && (Array.isArray(options.commentImagePaths) ? options.commentImagePaths.some(arg1 => String(arg1 || "").trim()) : !!String(options.commentImagePath || "").trim()) || !!options.enableCommentMention && !!String(options.commentMentionNicknames || "").trim();
      state.currentTask = {
        ...(value || {}),
        ...options,
        taskMode: "interaction",
        enableComment: true,
        enableLike: true,
        enableDM: true,
        aiReplyMode: false,
        enableCommentWithoutText: !!options.enableCommentWithoutText || flag && local,
        commentContent: flag ? "" : options.commentContent || value?.commentContent || "",
        replyTemplates: flag ? [] : options.replyTemplates || value?.replyTemplates || [],
        commentUseRandomSuffix: false,
        commentAttachmentPercent: flag ? 100 : Number.isFinite(Number(options.commentAttachmentPercent)) ? Number(options.commentAttachmentPercent) : Number.isFinite(Number(value?.commentAttachmentPercent)) ? Number(value.commentAttachmentPercent) : 100
      };
      const result = await fn60({
        nickname: nickname,
        userUrl: userUrl,
        content: commentText,
        commentText: commentText,
        timeText: timeText,
        replyText: replyText,
        commentId: options.commentId || options.cid || "",
        cid: options.commentId || options.cid || ""
      }, "SELF_WARMUP");
      const local2 = result === true || result?.success === true;
      const value2 = local2 ? String(result?.content || replyText || "").replace(/\s+/g, " ").trim() : "";
      ipcRenderer.send("self-warmup-reply-comment-result", {
        requestId: requestId,
        ok: local2,
        reason: local2 ? "" : result?.error || "回复未完成",
        sentText: value2,
        errorCode: local2 ? "" : result?.errorCode || "reply_failed",
        diagnostic: local2 ? "" : result?.diagnostic || describeReplyEnvironment(null),
        detail: local2 ? "" : result?.detail || ""
      });
    } catch (error) {
      ipcRenderer.send("self-warmup-reply-comment-result", {
        requestId: requestId,
        ok: false,
        reason: error?.message || String(error),
        errorCode: "reply_exception",
        diagnostic: describeReplyEnvironment(null)
      });
    } finally {
      state.currentTask = value;
    }
  });
  ipcRenderer.on("self-warmup-like-comment", async (arg1, options = {}) => {
    const {
      requestId: requestId,
      nickname: nickname,
      userUrl: userUrl,
      commentText: commentText,
      timeText: timeText
    } = options;
    state.stopRequested = false;
    state.pausedForSubview = false;
    const value = state.currentTask;
    try {
      const obj = {
        nickname: nickname || "",
        userUrl: userUrl || "",
        content: commentText || "",
        comment: commentText || "",
        timeText: timeText || "",
        commentId: options.commentId || options.cid || "",
        cid: options.commentId || options.cid || ""
      };
      state.currentTask = {
        ...(value || {}),
        taskMode: "interaction",
        enableLike: true,
        nickname: nickname || "",
        lead: obj
      };
      try {
        await ensureCommentPanelOpen(document.body, "SELF_WARMUP");
      } catch (error) {}
      const result = await performLike(document, obj, "SELF_WARMUP", {
        force: true,
        detail: true,
        fastLocate: false,
        stableLocate: !options.commentId && !options.cid
      });
      const flag = !!result?.success;
      ipcRenderer.send("self-warmup-like-comment-result", {
        requestId: requestId,
        ok: flag,
        alreadyLiked: !!result?.alreadyLiked,
        reason: flag ? "" : result?.error || "未找到目标评论或点赞控件",
        errorCode: flag ? "" : result?.errorCode || "comment_like_failed"
      });
    } catch (error) {
      ipcRenderer.send("self-warmup-like-comment-result", {
        requestId: requestId,
        ok: false,
        reason: error?.message || String(error),
        errorCode: "comment_like_exception"
      });
    } finally {
      state.currentTask = value;
    }
  });
  const set = new Set(["follow_click_not_dispatched", "follow_state_unconfirmed", "follow_reverted", "follow_state_unstable"]);
  const num = 4;
  async function fn61(arg1, arg2, arg3, arg4, text = "主页关注按钮", options = {}) {
    const local = findProfileFollowButtonByText(false) || findSmartElementQuiet("profileFollowBtn");
    if (local && local.isConnected !== false) {
      arg1 = local;
    }
    if (!arg1 || arg1.isConnected === false) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注按钮已失效或当前页面未找到可用控件",
        errorCode: "follow_click_not_dispatched",
        isPrivate: arg3,
        diagnostic: fn56(arg4, "", arg3, "button_detached")
      };
    }
    const local2 = fn53(arg1) || arg4;
    const result = fn52(local2);
    if (result === "followed") {
      return {
        success: true,
        followed: true,
        alreadyFollowed: true,
        followStatus: "already_followed",
        isPrivate: arg3,
        diagnostic: fn56(arg4, local2, arg3)
      };
    }
    if (result === "requested") {
      return {
        success: true,
        followed: false,
        followRequested: true,
        followRequestSent: false,
        followStatus: "requested",
        isPrivate: true,
        diagnostic: fn56(arg4, local2, arg3)
      };
    }
    const value = options?.nickname ? "@" + options.nickname : "@用户";
    reportTraceLog("👤 " + value + "：关注按钮已定位（文案=" + (local2 || "无") + "，" + fn54(arg1) + "），正在点击…", options?.accountId);
    const result2 = await simulateTrustedElementClick(arg1, arg2, text, {
      allowOffsetSamples: true,
      requireTargetHit: true,
      waitForStableTarget: true
    });
    const result3 = String(state.lastTrustedClickDiagnostic || "");
    if (!result2) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注按钮当前被遮挡、位置未稳定或原生点击未派发",
        errorCode: "follow_click_not_dispatched",
        isPrivate: arg3,
        diagnostic: fn56(arg4, local2, arg3, result3)
      };
    }
    reportTraceLog("👤 " + value + "：关注点击已派发，正在确认页面状态…", options?.accountId);
    let text2 = "";
    let text3 = "unknown";
    let text4 = "";
    const value2 = Date.now() + 10000;
    while (Date.now() < value2) {
      if (shouldAbort(arg2)) {
        throw new Error("TASK_ABORTED");
      }
      await sleep(500);
      text4 = fn57();
      if (text4) {
        break;
      }
      const local = findProfileFollowButtonByText(false) || findSmartElementQuiet("profileFollowBtn");
      text2 = fn53(local);
      text3 = fn52(text2);
      if (text3 === "followed" || text3 === "requested") {
        break;
      }
    }
    const result4 = fn56(arg4, text2, arg3, result3);
    if (text4) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: text4,
        errorCode: /隐私/.test(text4) ? "follow_privacy_restricted" : /频繁|上限|稍后/.test(text4) ? "follow_rate_limited" : "follow_rejected",
        isPrivate: arg3,
        diagnostic: result4
      };
    }
    if (text3 === "followed" || text3 === "requested") {
      await sleep(2500);
      text4 = fn57();
      const local = findProfileFollowButtonByText(false) || findSmartElementQuiet("profileFollowBtn");
      const result = fn53(local);
      const result2 = fn52(result);
      const result4 = fn56(arg4, result || text2, arg3, result3);
      if (text4) {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: text4,
          errorCode: /隐私/.test(text4) ? "follow_privacy_restricted" : /频繁|上限|稍后/.test(text4) ? "follow_rate_limited" : "follow_rejected",
          isPrivate: arg3,
          diagnostic: result4
        };
      }
      if (result2 === "followed") {
        return {
          success: true,
          followed: true,
          followStatus: "success",
          isPrivate: arg3,
          diagnostic: result4
        };
      }
      if (result2 === "requested") {
        return {
          success: true,
          followed: false,
          followRequested: true,
          followRequestSent: true,
          followStatus: "requested",
          isPrivate: true,
          diagnostic: result4
        };
      }
      if (result2 === "available") {
        return {
          success: false,
          followed: false,
          followStatus: "failed",
          error: "关注后状态回退为未关注，可能未真正成功",
          errorCode: "follow_reverted",
          isPrivate: arg3,
          diagnostic: result4
        };
      }
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "关注后状态未稳住（" + (result || text2 || "无文字") + "）",
        errorCode: "follow_state_unstable",
        isPrivate: arg3,
        diagnostic: result4
      };
    }
    return {
      success: false,
      followed: false,
      followStatus: "failed",
      error: "点击关注后未确认到“已关注”或“请求中”状态",
      errorCode: "follow_state_unconfirmed",
      isPrivate: arg3,
      diagnostic: result4
    };
  }
  async function performVideoMonitorFollow(arg1, arg2) {
    try {
      window.focus?.();
    } catch (error) {}
    try {
      if (state.currentViewKey && !window.__radar_monitor_interaction) {
        ipcRenderer.send("focus-automation-view", {
          viewKey: state.currentViewKey,
          bringToFront: true
        });
        const result = await ipcRenderer.invoke("ensure-background-automation-layout", {
          viewKey: state.currentViewKey,
          claimInteractionSlot: true
        });
        if (result && result.ok === false) {
          reportTraceLog("👤 @" + (arg1?.nickname || "用户") + "：关注执行视口未完成就绪（" + (result.reason || "unknown") + "），继续等待控件稳定…", arg1?.accountId, "warning");
        }
      }
    } catch (error) {
      reportTraceLog("👤 @" + (arg1?.nickname || "用户") + "：关注执行视口准备异常（" + (error?.message || error) + "），继续等待控件稳定…", arg1?.accountId, "warning");
    }
    const result = detectMonitorPrivateProfile();
    let result2 = await waitForSmartElement("profileFollowBtn", arg2, 20000);
    if (!result2) {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: result ? "私密账号未找到可用的关注或请求关注按钮" : "未找到用户主页关注按钮",
        errorCode: "follow_button_not_found",
        isPrivate: result,
        diagnostic: fn56("", "", result)
      };
    }
    const result3 = fn53(result2);
    const result4 = fn52(result3);
    if (result4 === "followed") {
      return {
        success: true,
        followed: true,
        alreadyFollowed: true,
        followStatus: "already_followed",
        isPrivate: result,
        diagnostic: fn56(result3, result3, result)
      };
    }
    if (result4 === "requested") {
      return {
        success: true,
        followed: false,
        followRequested: true,
        followRequestSent: false,
        followStatus: "requested",
        isPrivate: result,
        diagnostic: fn56(result3, result3, result)
      };
    }
    if (result4 !== "available") {
      return {
        success: false,
        followed: false,
        followStatus: "failed",
        error: "无法确认关注按钮状态（" + (result3 || "无文字") + "）",
        errorCode: "follow_button_state_unknown",
        isPrivate: result,
        diagnostic: fn56(result3, result3, result)
      };
    }
    const value = arg1?.nickname ? "@" + arg1.nickname : "@用户";
    let local = null;
    let local2 = result3;
    for (let num2 = 1; num2 <= num; num2 += 1) {
      if (num2 > 1) {
        result2 = findProfileFollowButtonByText(false) || findSmartElementQuiet("profileFollowBtn");
        if (!result2) {
          result2 = await waitForSmartElement("profileFollowBtn", arg2, 8000);
        }
        if (!result2) {
          return {
            ...local,
            error: (local?.error || "关注未确认") + "；第 " + num2 + "/" + num + " 次尝试前未找到关注按钮",
            retryAttempted: true,
            attemptCount: num2 - 1,
            maxAttempts: num
          };
        }
        const result4 = fn53(result2);
        const result5 = fn52(result4);
        if (result5 === "followed") {
          return {
            success: true,
            followed: true,
            followStatus: "success",
            isPrivate: result,
            retryAttempted: true,
            attemptCount: num2 - 1,
            maxAttempts: num,
            diagnostic: fn56(result3, result4, result)
          };
        }
        if (result5 === "requested") {
          return {
            success: true,
            followed: false,
            followRequested: true,
            followRequestSent: true,
            followStatus: "requested",
            isPrivate: true,
            retryAttempted: true,
            attemptCount: num2 - 1,
            maxAttempts: num,
            diagnostic: fn56(result3, result4, result)
          };
        }
        if (result5 !== "available") {
          return {
            ...local,
            error: (local?.error || "关注未确认") + "；第 " + num2 + "/" + num + " 次尝试前按钮状态异常（" + (result4 || "无文字") + "）",
            retryAttempted: true,
            attemptCount: num2 - 1,
            maxAttempts: num,
            diagnostic: fn56(result3, result4, result)
          };
        }
        local2 = result4 || result3;
        reportCurrentAction("正在第 " + num2 + "/" + num + " 次尝试关注" + (arg1?.nickname ? " [" + arg1.nickname + "]" : "") + "...", arg1?.accountId);
      }
      local = await fn61(result2, arg2, result, local2, num2 === 1 ? "主页关注按钮" : "主页关注按钮(第" + num2 + "/" + num + "次)", arg1);
      local.retryAttempted = num2 > 1;
      local.attemptCount = num2;
      local.maxAttempts = num;
      if (local.success || !set.has(String(local.errorCode || ""))) {
        return local;
      }
      if (num2 >= num) {
        return local;
      }
      const value2 = num2 + 1;
      const value3 = num2 + 3;
      reportTraceLog("👤 " + value + "：第 " + num2 + "/" + num + " 次关注未确认（" + (local.errorCode || "unknown") + "），" + ("等待 " + value2 + "-" + value3 + " 秒后进行第 " + (num2 + 1) + "/" + num + " 次尝试…"), arg1?.accountId, "warning");
      await randomDelay(value2 * 1000, value3 * 1000, arg2, "关注重试等待");
      if (shouldAbort(arg2)) {
        throw new Error("TASK_ABORTED");
      }
    }
    return local;
  }
  async function runVideoMonitorAction(options = {}) {
    const {
      requestId: requestId,
      action: action,
      nickname: nickname,
      commentText: commentText,
      replyContent: replyContent,
      dmContent: dmContent
    } = options;
    const value = "MONITOR_" + (requestId || Date.now());
    const value2 = state.currentTask;
    const local = arg1 => {
      ipcRenderer.send("video-monitor-action-result", {
        requestId: requestId,
        ...arg1
      });
    };
    try {
      if (options.accountId) {
        try {
          window._radar_account_id = options.accountId;
        } catch (error) {}
      }
      if (window.__radar_monitor_interaction) {
        state.currentViewKey = null;
        try {
          window.__radar_view_key = "";
        } catch (error) {}
      }
      const flag = !String(options.replyContent || "").trim();
      const local2 = !!options.enableCommentExpression || !!options.enableCommentImage && (Array.isArray(options.commentImagePaths) ? options.commentImagePaths.some(arg1 => String(arg1 || "").trim()) : !!String(options.commentImagePath || "").trim()) || !!options.enableCommentMention && !!String(options.commentMentionNicknames || "").trim();
      state.currentTask = {
        ...(value2 || {}),
        ...options,
        taskMode: "interaction",
        enableLike: true,
        enableComment: true,
        enableDM: true,
        aiReplyMode: false,
        isMonitorAction: true,
        monitorTaskId: options.monitorTaskId || options.monitorRunId || value2?.monitorTaskId || "",
        enableCommentWithoutText: !!options.enableCommentWithoutText || flag && local2,
        commentContent: flag ? "" : options.commentContent || value2?.commentContent || "",
        replyTemplates: flag ? [] : options.replyTemplates || value2?.replyTemplates || []
      };
      try {
        syncCommentAttachmentRotationFromBatchStorage();
      } catch (error) {}
      if (action === "like") {
        const obj = {
          nickname: nickname,
          content: commentText,
          comment: commentText,
          userUrl: options.userUrl || "",
          commentId: options.commentId || options.cid || "",
          cid: options.commentId || options.cid || "",
          timeText: options.timeText || options.commentTime || "",
          commentTime: options.timeText || options.commentTime || ""
        };
        const local2 = arg1 => reportMonitorActionProgress(requestId, arg1);
        local2("打开评论区…");
        try {
          await ensureCommentPanelOpen(document.body, value);
        } catch (error) {}
        local2("准备点赞（后台布局/定位评论）…");
        const result = await performLike(document, obj, value, {
          force: true,
          detail: true,
          fastLocate: true,
          onProgress: local2
        });
        const flag = !!result?.success;
        local({
          success: flag,
          alreadyLiked: !!result?.alreadyLiked,
          error: flag ? "" : result?.error || "未找到目标评论或点赞控件",
          errorCode: flag ? "" : result?.errorCode || "comment_like_failed"
        });
        return;
      }
      if (action === "reply") {
        const result = await fn60({
          nickname: nickname,
          content: commentText,
          commentText: commentText,
          userUrl: options.userUrl || "",
          timeText: options.timeText || options.commentTime || "",
          replyContent: replyContent,
          commentId: options.commentId || options.cid || "",
          cid: options.commentId || options.cid || "",
          fastLocate: true
        }, value);
        const local2 = result === true || result?.success === true;
        local({
          success: local2,
          error: local2 ? "" : result?.error || "回复未完成",
          errorCode: local2 ? "" : result?.errorCode || "reply_failed",
          diagnostic: local2 ? "" : result?.diagnostic || describeReplyEnvironment(null),
          detail: local2 ? "" : result?.detail || ""
        });
        return;
      }
      if (action === "video-main-comment") {
        initVideoMainCommentMemoryFromTask?.({
          videoMainCommentedVideoIds: options.videoMainCommentedVideoIds || []
        });
        const result = String(options.videoKey || options.videoUrl || window.location.href || "");
        if (result && hasVideoMainCommented?.(result)) {
          local({
            success: false,
            skipped: true,
            reason: "already_commented"
          });
          return;
        }
        reportCurrentAction("正在发表视频主评…");
        const result2 = await postVideoComment(document.body, value, {
          skipEnableCheck: true,
          expandScope: true,
          videoKey: result,
          videoTitle: options.videoTitle || "",
          prefetchedCommentText: options.prefetchedCommentText || ""
        });
        local({
          success: !!result2?.success,
          skipped: !!result2?.skipped,
          reason: result2?.reason || "",
          error: result2?.success ? "" : result2?.error || "视频主评未完成",
          errorCode: result2?.success ? "" : result2?.errorCode || result2?.error || "video_main_comment_failed",
          content: result2?.content || ""
        });
        return;
      }
      if (action === "profile-first-comment") {
        const obj = {
          nickname: nickname,
          leadId: nickname
        };
        const result = await performProfileFirstWorkComment(obj, value, {
          templateText: replyContent,
          forceAi: false,
          forceTemplateOnly: true
        });
        const flag = !!result.noWorks;
        const value2 = flag ? result.error && !/^no_works$/i.test(String(result.error)) ? String(result.error) : describeProfileNoWorksReason(result.diagnostic || result.error || "no_works") : "";
        const local2 = !result.success && (result.errorCode === "profile_works_not_ready" || /^profile_works_not_ready$/i.test(String(result.error || "")));
        const value3 = local2 ? result.error && !/^profile_works_not_ready$/i.test(String(result.error)) ? String(result.error) : describeProfileWorksNotReadyReason(result.diagnostic || "unknown") : "";
        local({
          success: !!result.success,
          noWorks: flag,
          worksCount: result.worksCount,
          workLiked: !!result.workLiked,
          workCollected: !!result.workCollected,
          error: result.success ? "" : value2 || value3 || result.error || "",
          errorCode: result.errorCode || (flag ? "no_works" : "") || (local2 ? "profile_works_not_ready" : ""),
          diagnostic: result.diagnostic || ""
        });
        return;
      }
      if (action === "profile-target-check") {
        const result = await scrapeDetailedProfile({
          genderFilter: options.profileActionGenderFilter || "all"
        });
        if (result.genderUnresolved) {
          local({
            success: true,
            eligible: false,
            filtered: true,
            filterReason: "性别尚未识别完成（主页加载偏慢），已跳过以免误判",
            ...result
          });
          return;
        }
        const result2 = evaluateTaskGenderFilter(result.gender, options.profileActionGenderFilter || "all");
        const obj = {
          ageFilterEnabled: options.profileActionAgeFilterEnabled === true,
          ageMin: options.profileActionAgeMin,
          ageMax: options.profileActionAgeMax
        };
        const result3 = checkBatchAgeFilter(result, obj);
        const value = isBatchAgeFilterActive(obj) ? formatAgeFilterRangeLabel(obj) : "关闭";
        const local2 = result2.pass && result3.pass && !result.isPrivate;
        local({
          success: true,
          eligible: local2,
          filtered: !local2,
          filterReason: !result2.pass ? result2.reason : !result3.pass ? result3.reason : result.isPrivate ? "对方账号设置了隐私，未执行关注/私信" : "",
          gender: result.gender || "未知",
          genderObserved: result2.observed,
          genderObservedLabel: result2.observedLabel,
          genderFilter: result2.filter,
          genderFilterLabel: result2.filterLabel,
          age: formatObservedAgeLabel(result) === "未知" ? null : Number(result.age),
          ageFilterLabel: value,
          isPrivate: !!result.isPrivate,
          worksCount: Number(result.worksCount || 0),
          noWorks: !!result.noWorks || Number(result.worksCount || 0) === 0,
          profileDetail: result
        });
        return;
      }
      if (action === "follow") {
        const result = await scrapeDetailedProfile().catch(() => null);
        const local2 = !!result?.isPrivate || !!detectMonitorPrivateProfile();
        if (local2) {
          local({
            success: false,
            followed: false,
            followStatus: "skipped",
            skipped: true,
            error: "对方账号设置了隐私，未执行关注",
            errorCode: "private_account",
            isPrivate: true,
            worksCount: Number(result?.worksCount || 0),
            noWorks: !!result?.noWorks || Number(result?.worksCount || 0) === 0,
            profileDetail: result || null
          });
          return;
        }
        const result2 = await fn58({
          nickname: nickname,
          userUrl: options.userUrl
        }, value);
        local({
          ...result2,
          isPrivate: !!result?.isPrivate || !!result2?.isPrivate,
          worksCount: Number(result?.worksCount !== undefined ? result.worksCount : result2?.worksCount || 0),
          noWorks: !!result?.noWorks || Number(result?.worksCount || 0) === 0 || !!result2?.noWorks,
          profileDetail: result || null
        });
        return;
      }
      if (action === "dm") {
        const local2 = options.profileDetail || (await scrapeDetailedProfile().catch(() => null));
        const local3 = !!local2?.isPrivate || !!detectMonitorPrivateProfile();
        if (local3) {
          local({
            success: false,
            skipped: true,
            error: "对方账号设置了隐私，未执行私信",
            errorCode: "private_account",
            isPrivate: true,
            worksCount: Number(local2?.worksCount || 0),
            noWorks: !!local2?.noWorks || Number(local2?.worksCount || 0) === 0,
            profileDetail: local2 || null
          });
          return;
        }
        const obj = {
          nickname: nickname || "用户",
          content: commentText || options.commentText || "",
          comment: commentText || options.commentText || "",
          userUrl: options.userUrl || "",
          secUid: options.secUid || options.sec_uid || "",
          accountId: options.accountId || "",
          accountName: options.accountName || ""
        };
        const result = await performProfileActionsLogic(obj, value, false, true, dmContent, false, state.currentTask, local2);
        const local4 = !!result.dmBlocked && (result.blockType === "privacy_settings" || /对方账号设置了隐私|隐私设置|无法发送消息/.test(String(result.error || "")));
        const value2 = local4 ? String(result.error || "").trim() || "对方账号设置了隐私，无法私信" : "";
        local({
          success: !!result.messaged,
          skipped: !!result.skipped || local4,
          error: result.skipReason || value2 || result.error || (result.messaged ? "" : "私信未完成"),
          errorCode: result.skipped && result.isPrivate ? "private_account" : local4 ? "privacy_settings" : "",
          isPrivate: !!local2?.isPrivate || !!result.isPrivate,
          dmBlocked: !!result.dmBlocked,
          blockType: result.blockType || "",
          worksCount: Number(local2?.worksCount || 0),
          noWorks: !!local2?.noWorks || Number(local2?.worksCount || 0) === 0,
          profileDetail: local2 || null
        });
        return;
      }
      local({
        success: false,
        error: "unknown action: " + action
      });
    } catch (error) {
      local({
        success: false,
        error: error.message || "监控互动执行异常",
        errorCode: "monitor_action_exception",
        diagnostic: action === "reply" ? describeReplyEnvironment(null) : ""
      });
    } finally {
      state.currentTask = value2;
    }
  }
  return {
    buildLeadCommentFingerprint: buildLeadCommentFingerprint,
    buildNodeCommentFingerprint: buildNodeCommentFingerprint,
    collectDouyinCommentEmojiHints: collectDouyinCommentEmojiHints,
    commentNodeViewportBonus: commentNodeViewportBonus,
    detectMonitorPrivateProfile: detectMonitorPrivateProfile,
    detectMonitorAuthorProfileGone: detectMonitorAuthorProfileGone,
    extractDouyinCommentContent: extractDouyinCommentContent,
    getCommentTimeModule: getCommentTimeModule,
    isCommentFromVideoAuthor: isCommentFromVideoAuthor,
    normalizeDouyinCommentContent: normalizeDouyinCommentContent,
    parseDouyinCommentNode: parseDouyinCommentNode,
    performVideoMonitorFollow: performVideoMonitorFollow,
    runVideoMonitorAction: runVideoMonitorAction,
    runVideoMonitorAuthorWorksScrape: runVideoMonitorAuthorWorksScrape,
    runVideoMonitorMoveNextVideo: runVideoMonitorMoveNextVideo,
    runVideoMonitorOpenAuthorWork: runVideoMonitorOpenAuthorWork,
    runVideoMonitorOpenSpecificVideo: runVideoMonitorOpenSpecificVideo,
    runVideoMonitorScrapeComments: runVideoMonitorScrapeComments,
    runVideoMonitorWaitVideoReady: runVideoMonitorWaitVideoReady,
    runVideoMonitorConfirmAuthor: runVideoMonitorConfirmAuthor,
    scoreCommentContentFingerprints: scoreCommentContentFingerprints
  };
}
module.exports = {
  createVideoMonitorController: createVideoMonitorController
};
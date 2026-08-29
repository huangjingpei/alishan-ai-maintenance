'use strict';

const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createCommentFeedNavigationController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    buildDouyinVideoShareUrl: buildDouyinVideoShareUrl,
    captureFeedVideoShareUrl: captureFeedVideoShareUrl,
    clearPendingLeadVideoUrl: clearPendingLeadVideoUrl,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    extractSpecificVideoId: extractSpecificVideoId,
    extractVideoIdFromHref: extractVideoIdFromHref,
    findCommentPanelRoot: findCommentPanelRoot,
    findMainVideoCommentInput: findMainVideoCommentInput,
    getCommentItemLooseSelector: getCommentItemLooseSelector,
    getCommentItemSelector: getCommentItemSelector,
    getCommentPanelSelector: getCommentPanelSelector,
    getCommentTabPrefix: getCommentTabPrefix,
    getCommentV2String: getCommentV2String,
    getVideoEngagePack: getVideoEngagePack,
    getDouyinFeedScope: getDouyinFeedScope,
    getFeedSwitchGuard: getFeedSwitchGuard,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getMyNickname: getMyNickname,
    getVideoAuthorNickname: getVideoAuthorNickname,
    getVideoTitle: getVideoTitle,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasCommentRuntimeReady: hasCommentRuntimeReady,
    hasFeedLiveEnterHint: hasFeedLiveEnterHint,
    isDouyinFeedLiveStream: isDouyinFeedLiveStream,
    isDouyinLiveStreamTitle: isDouyinLiveStreamTitle,
    isDouyinVideoShareUrl: isDouyinVideoShareUrl,
    isDouyinVisibleLoadingPlaceholder: isDouyinVisibleLoadingPlaceholder,
    isElementInFeedCenter: isElementInFeedCenter,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isOnUserProfilePage: isOnUserProfilePage,
    isProfileCommentUiVisible: isProfileCommentUiVisible,
    isVisibleElement: isVisibleElement,
    mergeCommentSelectors: mergeCommentSelectors,
    normalizeAuthorAccountName: normalizeAuthorAccountName,
    normalizeUrl: normalizeUrl,
    openFeedCommentDrawer: openFeedCommentDrawer,
    openProfileVideoCommentPanel: openProfileVideoCommentPanel,
    parseDouyinCommentNode: parseDouyinCommentNode,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    pruneSearchCardOpenFailures: pruneSearchCardOpenFailures,
    queryCommentItemNodes: queryCommentItemNodes,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    safeScrollTargetIntoView: safeScrollTargetIntoView,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedKey: simulateTrustedKey,
    sleep: sleep,
    sleepWithinDeadline: sleepWithinDeadline,
    state: state
  } = options;
  function parseLocalizedCountText(arg1) {
    const result = String(arg1 || "").trim().replace(/,/g, "").replace(/\s+/g, "");
    const result2 = result.match(/(\d+(?:\.\d+)?)(万|w|W|千|k|K)?/);
    if (!result2) {
      return null;
    }
    let result3 = parseFloat(result2[1]);
    if (!Number.isFinite(result3)) {
      return null;
    }
    const value = result2[2];
    if (value === "万" || value === "w" || value === "W") {
      result3 *= 10000;
    }
    if (value === "千" || value === "k" || value === "K") {
      result3 *= 1000;
    }
    return Math.round(result3);
  }
  function getCommentsTotalCount(arg1) {
    try {
      const result = Array.from(arg1.querySelectorAll("div, span, p")).filter(isVisibleElement);
      for (const item of result) {
        if (item.children.length > 2) {
          continue;
        }
        const value = item.textContent ? item.textContent.trim() : "";
        const text = "([\\d.,]+)\\s*([万wW千kK])?\\+?";
        const result = value.match(new RegExp("(?:全部评论|评论)\\s*[\\(\\（]?\\s*" + text + "\\s*[\\)\\）]?|^" + text + "\\s*(?:条评论|个评论|评论)$"));
        if (result) {
          const value = result[1] ? "" + result[1] + (result[2] || "") : "" + result[3] + (result[4] || "");
          const result2 = parseLocalizedCountText(value);
          if (result2 !== null) {
            return result2;
          }
        }
      }
    } catch (error) {
      console.error("[Built-in-Debug] [获取总评论数异常]", error);
    }
    return null;
  }
  function isCommentPanelEmptyHint(arg1 = document) {
    try {
      const local = resolveCommentPanelRoot(arg1) || arg1 || document.body;
      if (!local) {
        return false;
      }
      if (getVisibleCommentNodeCount(local) > 0) {
        return false;
      }
      if (isCommentPanelContentLoading(local)) {
        return false;
      }
      const result = String(local.innerText || local.textContent || "").replace(/\s+/g, " ").trim().slice(0, 1600);
      if (!result) {
        return false;
      }
      return /暂无评论|还没有人评论|还没有评论|暂无人评论|没有评论|快来抢沙发|期待你的第一条评论|留下你的第一条评论|成为第一个评论的人/.test(result);
    } catch (error) {
      return false;
    }
  }
  function resolveEffectiveCommentTotalCount(arg1, arg2) {
    const result = Number(arg2);
    const value = Number.isFinite(result) && result > 0 ? Math.floor(result) : 0;
    if (isCommentPanelEmptyHint(arg1)) {
      return 0;
    }
    return value;
  }
  function getVideoStats(arg1 = document) {
    const obj = {
      likes: 0,
      comments: 0,
      collects: 0,
      shares: 0
    };
    try {
      const local = arg1 || document;
      const text = "[data-e2e=\"video-detail-container\"], [data-e2e=\"feed-active-video\"], .modal-video-container, [class*=\"SearchDetail\"], [data-e2e=\"video-player-container\"]";
      const value = local.matches?.(text) ? local : local.querySelector?.(text) || (local === document ? document.body : local);
      const local2 = arg1 => {
        if (!arg1) {
          return null;
        }
        const result = Array.from(value.querySelectorAll(arg1));
        return result.find(arg1 => isVisibleElement(arg1) && !fn8(arg1));
      };
      const result = getVideoEngageSelector({
        getVideoEngagePack: getVideoEngagePack
      }, "likeSelectors");
      const result2 = getVideoEngageSelector({
        getVideoEngagePack: getVideoEngagePack
      }, "collectSelectors");
      const result3 = getVideoEngageSelector({
        getVideoEngagePack: getVideoEngagePack
      }, "shareSelectors");
      const result4 = local2(result);
      if (result4) {
        obj.likes = fn9(result4) || 0;
      }
      let result5 = getCommentsTotalCount(value);
      if (result5 === null || result5 === 0) {
        const result = [getCommentV2String("openCommentBtns"), getCommentV2String("openCommentAria"), getCommentV2String("videoPlayerComment") || "[data-e2e=\"video-player-comment\"]"].filter(Boolean).join(", ");
        const value = result ? local2(result) : null;
        if (value) {
          result5 = fn9(value);
        }
      }
      obj.comments = result5 || 0;
      const result6 = local2(result2);
      if (result6) {
        obj.collects = fn9(result6) || 0;
      }
      const result7 = local2(result3);
      if (result7) {
        obj.shares = fn9(result7) || 0;
      }
    } catch (error) {
      console.error("[Built-in-Debug] [获取视频数据统计异常]", error);
    }
    return obj;
  }
  function fn8(arg1) {
    if (!arg1) {
      return false;
    }
    const text = "[data-e2e=\"comment-list\"], [class*=\"comment-list\"], [class*=\"CommentList\"], [data-e2e=\"comment-item\"], [class*=\"comment-item\"]";
    return !!arg1.closest(text);
  }
  function fn9(arg1) {
    if (!arg1) {
      return 0;
    }
    let text = "";
    try {
      const result = arg1.querySelector("span, p");
      if (result && isVisibleElement(result)) {
        text = result.innerText || result.textContent || "";
      }
    } catch (error) {}
    if (!text || !/[\d]/.test(text)) {
      text = arg1.innerText || arg1.textContent || "";
    }
    if (!text || !/[\d]/.test(text)) {
      const local = arg1.closest("div[role=\"button\"]") || arg1.closest("button") || arg1.parentElement;
      if (local) {
        text = local.innerText || local.textContent || "";
      }
    }
    if (text) {
      text = text.replace(/(点赞|赞|评论|收藏|分享|转发)/g, "").trim();
      const result = parseLocalizedCountText(text);
      if (result !== null) {
        return result;
      }
    }
    return 0;
  }
  function getVisibleCommentNodeCount(arg1) {
    try {
      const result = resolveCommentPanelRoot(arg1);
      return queryCommentItemNodes(result).filter(isVisibleElement).length;
    } catch (error) {
      return 0;
    }
  }
  function fn10(arg1, options = {}) {
    const result = Array.from(arg1 || []).filter(Boolean);
    const result2 = Math.max(0, Number(options.keepHead) || 0);
    const result3 = Math.max(8, Number(options.keepTail) || 28);
    const result4 = Math.max(result2 + result3 + 12, Number(options.trigger) || 70);
    if (result.length <= result4) {
      return 0;
    }
    let num = 0;
    const result5 = Math.max(result2, result.length - result3);
    for (let local = result2; local < result5; local += 1) {
      try {
        const value = result[local];
        value?.parentNode?.removeChild?.(value);
        num += 1;
      } catch (error) {}
    }
    return num;
  }
  function fn11(arg1, text = "leadgen") {
    if (text === "entity") {
      return {
        keepHead: 1,
        keepTail: 22,
        replyKeepHead: 0,
        replyKeepTail: 18,
        topTrigger: 48,
        replyTrigger: 40
      };
    }
    if (text === "monitor") {
      return {
        keepHead: 1,
        keepTail: 26,
        replyKeepHead: 0,
        replyKeepTail: 22,
        topTrigger: 68,
        replyTrigger: 60
      };
    }
    if (arg1 === "interaction") {
      return {
        keepHead: 1,
        keepTail: 34,
        replyKeepHead: 0,
        replyKeepTail: 28,
        topTrigger: 92,
        replyTrigger: 76
      };
    }
    if (arg1 === "scrape") {
      return {
        keepHead: 1,
        keepTail: 28,
        replyKeepHead: 0,
        replyKeepTail: 24,
        topTrigger: 72,
        replyTrigger: 64
      };
    }
    return null;
  }
  function fn12(arg1, text = "leadgen") {
    if (text === "monitor") {
      return false;
    }
    if (text === "entity") {
      return true;
    }
    return arg1 === "scrape" || arg1 === "interaction";
  }
  function pruneStaleCommentDom(arg1, options = {}) {
    const local = options.context || "leadgen";
    const local2 = options.taskMode ?? state.currentTask?.taskMode;
    if (!fn12(local2, local)) {
      return 0;
    }
    const local3 = options.profile || fn11(local2, local);
    if (!local3) {
      return 0;
    }
    try {
      const result = getCommentItemSelector();
      const result2 = getCommentItemLooseSelector();
      const local4 = arg1 => {
        if (!arg1) {
          return false;
        }
        try {
          if (result && arg1.matches?.(result)) {
            return true;
          }
          if (result2 && arg1.matches?.(result2)) {
            return true;
          }
          if (result && arg1.querySelector?.(result)) {
            return true;
          }
          if (result2 && arg1.querySelector?.(result2)) {
            return true;
          }
        } catch (error) {}
        return false;
      };
      const local5 = resolveCommentPanelRoot(arg1) || arg1 || document.body;
      if (!local5) {
        return 0;
      }
      let num = 0;
      const value = local5.matches?.(".comment-mainContent") ? local5 : local5.querySelector?.(".comment-mainContent") || local5;
      const result3 = Array.from(value.children || []).filter(local4);
      num += fn10(result3, {
        keepHead: local3.keepHead,
        keepTail: local3.keepTail,
        trigger: local3.topTrigger
      });
      const set = new Set();
      queryCommentItemNodes(local5).forEach(arg1 => {
        const local = arg1.getAttribute?.("data-e2e") || "";
        const result = String(arg1.className || "");
        if (local.includes("reply") || /reply-item|ReplyItem/i.test(result)) {
          if (arg1.parentElement) {
            set.add(arg1.parentElement);
          }
        }
      });
      set.forEach(arg1 => {
        const result = Array.from(arg1.children || []).filter(local4);
        num += fn10(result, {
          keepHead: local3.replyKeepHead,
          keepTail: local3.replyKeepTail,
          trigger: local3.replyTrigger
        });
      });
      if (num > 0) {
        const value = local === "monitor" ? "监控" : local2 === "interaction" ? "互动" : "采集";
        console.log("[Built-in-Debug] [评论DOM瘦身/" + value + "] 已移除 " + num + " 个旧评论节点，保留尾部窗口");
      }
      return num;
    } catch (error) {
      console.warn("[Built-in-Debug] [评论DOM瘦身] 执行异常:", error.message || error);
      return 0;
    }
  }
  const num = 60000;
  let num2 = 0;
  function trimRuntimeMemory(arg1 = document.body, text = "periodic") {
    let num = 0;
    try {
      const value = platformSelectors["douyin.com"];
      const local = state.currentTask?.taskMode || "interaction";
      const obj = {
        keepHead: 0,
        keepTail: local === "interaction" ? 20 : 18,
        replyKeepHead: 0,
        replyKeepTail: local === "interaction" ? 14 : 12,
        topTrigger: local === "interaction" ? 46 : 40,
        replyTrigger: local === "interaction" ? 34 : 30
      };
      const set = new Set([arg1 || document.body, document.body]);
      try {
        document.querySelectorAll(value.commentPanel).forEach(arg1 => set.add(arg1));
      } catch (error) {}
      set.forEach(arg1 => {
        num += pruneStaleCommentDom(arg1, {
          taskMode: local,
          profile: obj
        });
      });
    } catch (error) {
      console.warn("[Built-in-Debug] [运行内存整理] 评论DOM清理异常:", error.message || error);
    }
    try {
      pruneSearchCardOpenFailures();
    } catch (error) {}
    try {
      if (state.currentTask?.taskMode !== "scrape") {
        window._commentScrapeProgress = null;
      }
    } catch (error) {}
    if (num > 0) {
      console.log("[Built-in-Debug] [运行内存整理] " + text + " 清理旧评论节点 " + num + " 个");
    }
    return num;
  }
  function maybeTrimRuntimeMemory(arg1 = document.body, text = "periodic", arg3 = num) {
    const result = Date.now();
    if (result - num2 < arg3) {
      return 0;
    }
    num2 = result;
    return trimRuntimeMemory(arg1, text);
  }
  function fn16(arg1, arg2, num = 4) {
    if (!arg1) {
      return false;
    }
    const result = arg1.getBoundingClientRect();
    const value = !arg2 || arg2 === document.body || arg2 === document.documentElement ? {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight
    } : arg2.getBoundingClientRect();
    return result.bottom > value.top + num && result.top < value.bottom - num && result.right > value.left + num && result.left < value.right - num;
  }
  function getVisibleCommentViewportFingerprint(arg1) {
    try {
      const local = resolveCommentPanelRoot(arg1) || arg1 || document.body;
      const result = findCommentScrollContainer(arg1);
      const result2 = queryCommentItemNodes(local).filter(isVisibleElement);
      const value = result ? result2.filter(arg1 => fn16(arg1, result)) : [];
      const value2 = value.length ? value : result2;
      if (!value2.length) {
        return "";
      }
      const local2 = arg1 => {
        const result = parseDouyinCommentNode(arg1, {
          requireTime: false,
          skipAuthor: false
        });
        if (!result) {
          return String(arg1.innerText || "").replace(/\s+/g, " ").trim().slice(0, 48);
        }
        return result.nickname + "|" + String(result.text || "").slice(0, 32);
      };
      const result3 = value2.slice(0, 3).map(local2).join("||");
      const result4 = value2.slice(-3).map(local2).join("||");
      return value2.length + "#" + result3 + "#" + result4;
    } catch (error) {
      return "";
    }
  }
  function getCommentScrollMetrics(arg1) {
    const result = findCommentScrollContainer(arg1);
    if (!result) {
      return {
        container: null,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        remaining: 0,
        canScrollDown: false,
        nearBottom: true
      };
    }
    const result2 = Math.max(0, Number(result.scrollTop) || 0);
    const result3 = Math.max(0, Number(result.scrollHeight) || 0);
    const result4 = Math.max(0, Number(result.clientHeight) || 0);
    const result5 = Math.max(0, result3 - result4);
    const result6 = Math.max(0, result5 - result2);
    const result7 = Math.max(80, Math.round(result4 * 0.08));
    return {
      container: result,
      scrollTop: result2,
      scrollHeight: result3,
      clientHeight: result4,
      remaining: result6,
      canScrollDown: result6 > Math.max(24, Math.round(result4 * 0.02)),
      nearBottom: result6 <= result7
    };
  }
  const list = ["暂时没有更多评论", "暂无更多评论", "没有更多评论", "暂时没有更多了", "没有更多了", "已经到底了"];
  function getCommentEndHintText(arg1) {
    try {
      const value = platformSelectors["douyin.com"];
      const local = arg1 || document.body;
      const local2 = local?.querySelector?.(value.commentPanel) || local;
      const result = Array.from(new Set([local2, local].filter(Boolean)));
      for (const item of result) {
        const result = Array.from(item.querySelectorAll?.("div, span, p") || []);
        for (const item of result) {
          if (!isVisibleElement(item)) {
            continue;
          }
          if (item.closest?.(value.commentItem)) {
            continue;
          }
          const result = String(item.innerText || item.textContent || "").replace(/\s+/g, "").trim();
          if (!result || result.length > 32) {
            continue;
          }
          if (list.some(arg1 => result.includes(arg1))) {
            return String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
          }
        }
      }
    } catch (error) {}
    return "";
  }
  function getScrapeNoNewDataTolerance(arg1, arg2) {
    const num = 8;
    if (!arg1 || arg1 <= 0) {
      return num;
    }
    const value = arg2 / arg1;
    if (value < 0.03) {
      return 25;
    }
    if (value < 0.08) {
      return 18;
    }
    if (value < 0.15) {
      return 14;
    }
    if (value < 0.3) {
      return 11;
    }
    return num;
  }
  function getScrapeNoCompliantTolerance(arg1, arg2) {
    return getScrapeNoNewDataTolerance(arg1, arg2) + 8;
  }
  function shouldContinueScrapeAfterDuplicateWindow(arg1, arg2, arg3) {
    if (!arg1 || arg1 <= 0) {
      return false;
    }
    const result = Math.max(0, Math.min(1, arg2 / arg1));
    if (result >= 0.9) {
      return false;
    }
    const result2 = getCommentScrollMetrics(arg3);
    return result2.canScrollDown;
  }
  function shouldProbeIncompleteScrapeBoundary(arg1, arg2, arg3) {
    if (!arg1 || arg1 <= 0) {
      return false;
    }
    if (arg3 >= 3) {
      return false;
    }
    const result = Math.max(0, Math.min(1, arg2 / arg1));
    return result < 0.9;
  }
  function fn25(arg1, arg2) {
    if (!arg1 || !arg2) {
      return true;
    }
    try {
      if (arg1 !== arg2 && arg1.contains?.(arg2) && !arg2.contains?.(arg1)) {
        return true;
      }
    } catch (error) {}
    const value = (arg1.className || "") + " " + (arg1.getAttribute?.("data-e2e") || "") + " " + (arg1.id || "");
    if (/swiper|Swiper|slide-list|SlideList|feed-scroll|FeedScroll|video-switch|player-container|xgplayer|slider-group/i.test(value)) {
      return true;
    }
    try {
      const result = arg1.getBoundingClientRect();
      if (result.width > window.innerWidth * 0.55 && result.height > window.innerHeight * 0.65) {
        if (arg1 !== arg2 && !arg2.contains(arg1)) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function findCommentScrollContainer(arg1) {
    const result = resolveCommentPanelRoot(arg1);
    if (!result) {
      return null;
    }
    const result2 = Array.from(result.querySelectorAll("[scrollable=\"true\"], [class*=\"Scroll\"], [class*=\"scroll\"]")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      if (fn25(arg1, result)) {
        return false;
      }
      const local = arg1.scrollHeight || 0;
      const local2 = arg1.clientHeight || 0;
      return local > local2 + 30;
    }).sort((arg1, arg2) => arg2.scrollHeight - arg2.clientHeight - (arg1.scrollHeight - arg1.clientHeight));
    if (result2.length) {
      return result2[0];
    }
    if (result.scrollHeight > result.clientHeight + 30) {
      return result;
    }
    let value = result.parentElement;
    while (value && value !== document.body) {
      if (result.contains(value) === false && value.contains?.(result)) {
        break;
      }
      if (value.scrollHeight > value.clientHeight + 30 && isVisibleElement(value) && !fn25(value, result)) {
        return value;
      }
      value = value.parentElement;
    }
    try {
      const result2 = queryCommentItemNodes(result).find(isVisibleElement);
      let local = result2?.parentElement;
      while (local && local !== document.body && result.contains(local)) {
        if (local.scrollHeight > local.clientHeight + 30 && isVisibleElement(local) && !fn25(local, result)) {
          return local;
        }
        local = local.parentElement;
      }
    } catch (error) {}
    return result;
  }
  async function scrollCommentList(arg1, arg2, arg3, options = {}) {
    const result = findCommentScrollContainer(arg1);
    if (!result) {
      return false;
    }
    const value = result.scrollTop;
    const result2 = Math.max(120, Math.min(Math.abs(arg2), 3200));
    const value2 = arg2 >= 0 ? 1 : -1;
    const local = options.bubbles === true || !options.containWheel && !window.__radarEntityFeedSwipeLockInstalled;
    try {
      result.scrollBy({
        top: value2 * result2,
        behavior: options.smooth ? "smooth" : "auto"
      });
    } catch (error) {
      result.scrollTop += value2 * result2;
    }
    if (!options.skipWheel) {
      const result3 = result.getBoundingClientRect();
      const value = result3.left + result3.width / 2;
      const value3 = result3.top + Math.min(result3.height * 0.78, result3.height - 12);
      const wheelEvent = new WheelEvent("wheel", {
        deltaY: value2 * result2,
        deltaMode: 0,
        clientX: value,
        clientY: value3,
        bubbles: local,
        cancelable: true
      });
      result.dispatchEvent(wheelEvent);
      result.dispatchEvent(new WheelEvent("wheel", {
        deltaY: value2 * Math.round(result2 * 0.6),
        deltaMode: 0,
        clientX: value,
        clientY: value3,
        bubbles: local,
        cancelable: true
      }));
    }
    if (options.delayMin !== 0) {
      await randomDelay(options.delayMin || 60, options.delayMax || 180, arg3);
    }
    return Math.abs(result.scrollTop - value) > 2;
  }
  async function aggressiveCommentListScroll(arg1, arg2, num = 1) {
    const result = findCommentScrollContainer(arg1);
    if (!result) {
      return false;
    }
    const result2 = Math.min(Math.max(num, 1), 8);
    let flag = false;
    const value = window.__radarEntityFeedSwipeLockInstalled ? {
      containWheel: true,
      bubbles: false
    } : {};
    if (result2 <= 2) {
      flag = (await scrollCommentList(arg1, 900, arg2, {
        delayMin: 80,
        delayMax: 160,
        ...value
      })) || flag;
      flag = (await scrollCommentList(arg1, 1200, arg2, {
        delayMin: 80,
        delayMax: 160,
        ...value
      })) || flag;
    } else if (result2 <= 5) {
      await scrollCommentList(arg1, -240, arg2, {
        delayMin: 60,
        delayMax: 120,
        ...value
      });
      flag = (await scrollCommentList(arg1, 1800, arg2, {
        delayMin: 100,
        delayMax: 200,
        ...value
      })) || flag;
      flag = (await scrollCommentList(arg1, 1400, arg2, {
        delayMin: 100,
        delayMax: 200,
        ...value
      })) || flag;
    } else {
      const result3 = Math.min(result.scrollHeight, result.scrollTop + result.clientHeight * (1.2 + result2 * 0.08));
      const value2 = result.scrollTop;
      result.scrollTop = result3;
      await scrollCommentList(arg1, 2200, arg2, {
        delayMin: 120,
        delayMax: 220,
        ...value
      });
      flag = Math.abs(result.scrollTop - value2) > 2;
      if (!flag) {
        result.scrollTop = result.scrollHeight;
        await randomDelay(300, 600, arg2);
        flag = result.scrollTop > value2;
      }
    }
    return flag;
  }
  function getExtendedReadyBudgetMs(arg1, options = {}) {
    const {
      progress = false,
      hardCapMs = Math.min(Math.round(arg1 * 2.5), Math.max(arg1 + 4000, 20000))
    } = options;
    if (!progress) {
      return arg1;
    }
    return Math.min(hardCapMs, Math.round(arg1 * 1.85));
  }
  function getExtendedReadyRounds(arg1, options = {}) {
    const {
      progress = false,
      hardCapRounds = Math.min(Math.ceil(arg1 * 2), arg1 + 10)
    } = options;
    if (!progress) {
      return arg1;
    }
    return Math.min(hardCapRounds, Math.ceil(arg1 * 1.7));
  }
  function getAdaptiveCommentWaitRange(options = {}) {
    const {
      phase = "warmup",
      expectedTotalCount = 0,
      visibleCount = 0,
      emptyRounds = 0,
      scrollIndex = 0
    } = options;
    const local = Number(expectedTotalCount) || 0;
    const local2 = Number(visibleCount) || 0;
    const value = local > 0;
    let num = 0;
    if (value) {
      if (local2 <= 0) {
        num += 2.5;
      } else if (local2 < Math.min(local, 3)) {
        num += 1.5;
      } else if (local2 < Math.min(local, 6)) {
        num += 0.75;
      }
    }
    num += Math.min(Math.max(Number(emptyRounds) || 0, 0), 5) * 0.65;
    if (scrollIndex >= 4) {
      num += 0.5;
    }
    if (state.currentTask?.taskMode === "scrape") {
      num += 0.4;
    }
    const value2 = phase === "post-scroll" ? {
      min: 1500,
      max: 3000,
      stepMin: 350,
      stepMax: 550,
      capMin: 3800,
      capMax: 6500
    } : {
      min: 900,
      max: 1600,
      stepMin: 300,
      stepMax: 520,
      capMin: 3200,
      capMax: 5600
    };
    const result = Math.round(Math.min(value2.capMin, value2.min + num * value2.stepMin));
    const result2 = Math.round(Math.min(value2.capMax, value2.max + num * value2.stepMax));
    return [result, Math.max(result + 300, result2)];
  }
  async function waitForCommentDomWarmup(arg1, arg2, arg3) {
    if (!arg3 || arg3 <= 0) {
      return 0;
    }
    if (isCommentPanelEmptyHint(arg1)) {
      console.log("[Built-in-Debug] [评论预热] 面板显示暂无评论，按 0 条结束预热");
      reportCurrentAction("评论区显示暂无评论，按 0 条处理");
      return 0;
    }
    const result = Math.min(arg3, state.currentTask?.taskMode === "scrape" ? 10 : 6);
    let result2 = getVisibleCommentNodeCount(arg1);
    let num = 0;
    const num2 = 6;
    let local = num2;
    let flag = false;
    let num3 = 0;
    for (let num4 = 0; num4 < local; num4 += 1) {
      if (shouldAbort(arg2)) {
        return result2;
      }
      if (isCommentPanelEmptyHint(arg1)) {
        num3 += 1;
        if (num3 >= 2 || result2 === 0) {
          console.log("[Built-in-Debug] [评论预热] 确认暂无评论文案 (round=" + (num4 + 1) + ")，按 0 条结束");
          reportCurrentAction("评论区显示暂无评论，按 0 条处理");
          return 0;
        }
      } else {
        num3 = 0;
      }
      const result3 = getVisibleCommentNodeCount(arg1);
      if (result3 > result2) {
        result2 = result3;
        num = 0;
      } else if (result3 > 0) {
        num += 1;
      }
      if (result2 >= result || result2 > 0 && num >= 2) {
        return result2;
      }
      if (!flag && result2 > 0 && result2 < result && num4 >= num2 - 1) {
        local = getExtendedReadyRounds(num2, {
          progress: true,
          hardCapRounds: 10
        });
        if (local > num2) {
          flag = true;
          console.log("[Built-in-Debug] [慢环境] 评论区 DOM 仍在渲染，延长预热 " + num2 + "→" + local + " 轮");
        }
      }
      console.log("[Built-in-Debug] [慢设备保护] 评论区 DOM 渲染中: " + result2 + "/" + arg3 + "，继续等待 (" + (num4 + 1) + "/" + local + ")");
      reportCurrentAction("评论区加载中：已渲染 " + result2 + "/" + arg3 + " 条，稍等...");
      const [local2, local3] = getAdaptiveCommentWaitRange({
        phase: "warmup",
        expectedTotalCount: arg3,
        visibleCount: result2,
        emptyRounds: num4
      });
      await randomDelay(local2, local3, arg2, "评论区加载");
    }
    if (result2 === 0 && isCommentPanelEmptyHint(arg1)) {
      reportCurrentAction("评论区显示暂无评论，按 0 条处理");
      return 0;
    }
    return result2;
  }
  function sampleVisibleCommentTexts(arg1, num = 8) {
    try {
      const local = resolveCommentPanelRoot(arg1) || arg1 || document.body;
      const result = queryCommentItemNodes(local);
      const result2 = getMyNickname();
      const pattern = /(\d{1,2}-\d{1,2}|\d{4}-\d{1,2}-\d{1,2}|昨天|刚刚|\d+\s*(分钟|小时|天|周|月|年)前)/;
      const list = [];
      const set = new Set();
      for (const item of result) {
        if (list.length >= num) {
          break;
        }
        const result = (item.innerText || "").split("\n").map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0);
        if (result.length < 2) {
          continue;
        }
        const value = result[0];
        if (result2 && value === result2) {
          continue;
        }
        if (result.some(arg1 => arg1 === "作者")) {
          continue;
        }
        const result3 = result.filter(arg1 => arg1 !== value && arg1 !== "作者赞过" && !arg1.includes("回复") && !arg1.includes("展开") && !/^\d+$/.test(arg1) && (!(arg1.length <= 6) || !pattern.test(arg1)));
        let value2 = result3.length > 0 ? result3.sort((arg1, arg2) => arg2.length - arg1.length)[0] : "";
        if (!value2) {
          continue;
        }
        if (value2.includes("@豆包") || value2.includes("@元宝") || value2.includes("@通义") || value2.includes("@文心")) {
          continue;
        }
        if (value2.replace(/[.。·分享回复\s]/g, "").length < 2) {
          continue;
        }
        const result4 = value2.slice(0, 120);
        if (set.has(result4)) {
          continue;
        }
        set.add(result4);
        list.push(result4);
      }
      return list;
    } catch (error) {
      console.warn("[Built-in-Debug] [评论采样] 异常:", error.message || error);
      return [];
    }
  }
  function isCommentPanelContentLoading(arg1 = document) {
    try {
      const result = resolveCommentPanelRoot(arg1);
      const list = [];
      if (result) {
        list.push(result);
      }
      if (arg1 && arg1 !== result) {
        list.push(arg1);
      }
      if (!list.length) {
        list.push(document.body);
      }
      for (const item of list) {
        if (isDouyinVisibleLoadingPlaceholder(item, {
          allowBodyFallback: false,
          maxScan: 400
        })) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function fn33(arg1 = document) {
    try {
      return !!findMainVideoCommentInput(arg1);
    } catch (error) {}
    return false;
  }
  async function ensureCommentPanelOpen(arg1, arg2, options = {}) {
    try {
      await handleGlobalAutomationPopupsAndSecurity(arg2);
    } catch (error) {}
    const {
      profileVideo = false,
      forMainPost = false
    } = options;
    const result = Number(options.deadlineAt || 0);
    if (!profileVideo && !isOnUserProfilePage() && (isDouyinFeedLiveStream() || hasFeedLiveEnterHint() || isDouyinLiveStreamTitle(getVideoTitle()))) {
      console.log("[Built-in-Debug] 直播间内容，跳过评论面板");
      return false;
    }
    if (!hasCommentRuntimeReady()) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，跳过打开评论面板");
      return false;
    }
    const result2 = getCommentPanelSelector();
    if (!result2) {
      console.warn("[Built-in-Debug] [RuntimeConfig] commentPanel 选择器为空");
      return false;
    }
    const local = state.currentRunningSource === "recommend" || state.currentRunningSource === "follow";
    const local2 = !profileVideo && !isOnUserProfilePage() && local && !!getDouyinFeedScope();
    const value = local2 ? document : arg1;
    const value2 = arg1 === document.body ? [document] : [arg1, document];
    let result3 = findCommentPanelRoot(value);
    if (result3 && isVisibleElement(result3)) {
      if (!forMainPost && queryCommentItemNodes(result3).length > 0) {
        console.log("[Built-in-Debug] 评论面板及节点已在视口就绪，极速放行");
        return true;
      }
    }
    if (!result3 || !isVisibleElement(result3)) {
      if (local2) {
        await openFeedCommentDrawer(arg2, {
          deadlineAt: result
        });
        result3 = findCommentPanelRoot(document);
      } else if (profileVideo || isOnUserProfilePage()) {
        await openProfileVideoCommentPanel(arg2, {
          deadlineAt: result
        });
        result3 = findCommentPanelRoot(document);
      }
    }
    if ((profileVideo || isOnUserProfilePage()) && isProfileCommentUiVisible()) {
      if (!forMainPost || fn33(arg1 || document)) {
        return true;
      }
      console.log("[Built-in-Debug] [主评] 评论区已展开但输入区未就绪，继续等待…");
    }
    if (!result3 || !isVisibleElement(result3)) {
      if (!hasCommentRuntimeReady()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] commentV2 未就绪，无法展开评论列表");
        return false;
      }
      console.log("[Built-in-Debug] 评论列表未显示，尝试寻找“评论”页签/按钮以展开...");
      const local = getCommentTabPrefix() || "评论";
      let local2 = null;
      for (const item of value2) {
        local2 = Array.from(item.querySelectorAll("div, span")).find(arg1 => {
          if (arg1.children.length > 2) {
            return false;
          }
          const value = arg1.textContent ? arg1.textContent.trim() : "";
          return value.startsWith(local) && value.length < 15 && isVisibleElement(arg1);
        });
        if (local2) {
          break;
        }
      }
      if (local2) {
        console.log("[Built-in-Debug] 找到页签按钮: \"" + local2.textContent.trim() + "\"，执行切换点击");
        await simulateHumanClick(local2.closest("button, [role=\"button\"]") || local2, arg2, {
          deadlineAt: result
        });
        await sleepWithinDeadline(450, result);
        result3 = findCommentPanelRoot(arg1);
      }
      if ((!result3 || !isVisibleElement(result3)) && !fn33(arg1 || document)) {
        const result2 = mergeCommentSelectors(getCommentV2String("openCommentBtns"), getCommentV2String("openCommentAria"), getCommentV2String("feedCommentIcon"), getCommentV2String("videoCommentIcon"), getCommentV2String("videoPlayerComment"), "[data-e2e=\"feed-comment-icon\"]", "[data-e2e=\"video-comment-icon\"]", "[data-e2e=\"video-player-comment\"]");
        let local = null;
        for (const item of value2) {
          const value = result2 ? Array.from(item.querySelectorAll(result2)).filter(arg1 => isVisibleElement(arg1) && isElementInViewportForAutomation(arg1)) : [];
          if (value.length > 0) {
            local = value[value.length - 1];
            break;
          }
        }
        if (local) {
          console.log("[Built-in-Debug] 找到评论图标 (" + result2 + ")，执行点击展开");
          await simulateHumanClick(local.closest("button, [role=\"button\"]") || local, arg2, {
            deadlineAt: result
          });
        }
      }
    }
    const value3 = forMainPost ? profileVideo ? 5 : 6 : 10;
    let local3 = value3;
    let flag = false;
    let flag2 = false;
    let flag3 = false;
    for (let num = 0; num < local3; num++) {
      if (shouldAbort(arg2)) {
        return false;
      }
      if (result > 0 && Date.now() >= result) {
        console.warn("[Built-in-Debug] [主评] 评论面板等待达到总预算，停止继续展开");
        break;
      }
      const value = profileVideo || isOnUserProfilePage() ? document.body : arg1;
      const result2 = getCommentsTotalCount(value);
      const result4 = isCommentPanelContentLoading(value);
      if (forMainPost && fn33(arg1 || document)) {
        console.log("[Built-in-Debug] [主评] 输入区已就绪 (" + (num + 1) + "/" + local3 + ")" + (result4 ? "（列表仍在加载，忽略）" : ""));
        if (result4) {
          reportTraceLog("📝 视频主评：输入框已就绪，无需等待评论列表加载");
        }
        return true;
      }
      if (!forMainPost && result2 === 0 && !result4) {
        console.log("[Built-in-Debug] 检测到该视频总评论数明确为 0，无需等待数据加载，立即放行");
        return true;
      }
      if (forMainPost && result2 === 0 && !result4 && result3 && isVisibleElement(result3)) {
        console.log("[Built-in-Debug] [主评] 0 评论且面板已开，进入输入框探测");
        return true;
      }
      if (forMainPost && result4 && !flag3) {
        flag3 = true;
        reportTraceLog("📝 视频主评：评论列表加载中，同时侦测输入框…");
        reportCurrentAction("侦测评论输入框…");
      }
      await sleepWithinDeadline(forMainPost ? profileVideo ? 400 : 500 : profileVideo ? 600 : 1200, result);
      result3 = findCommentPanelRoot(arg1);
      if (result3 && isVisibleElement(result3)) {
        flag2 = true;
        if (forMainPost) {
          if (fn33(arg1 || document) || findMainVideoCommentInput(arg1 || document)) {
            console.log("[Built-in-Debug] [主评] 面板已开且输入区就绪");
            return true;
          }
          console.log("[Built-in-Debug] [主评] 面板可见，继续等输入区 (" + (num + 1) + "/" + local3 + ")…");
        } else {
          const result = queryCommentItemNodes(result3);
          const result2 = isCommentPanelContentLoading(value);
          if (result2) {
            console.log("[Built-in-Debug] 评论面板可见但仍在加载中 (" + (num + 1) + "/" + local3 + ")，点击「加载中」并继续等待…");
            await clickCommentPanelLoadingPlaceholder(result3, arg2);
          } else if (result.length > 0) {
            console.log("[Built-in-Debug] 评论面板已成功处于开启/可见状态，且已成功加载出 " + result.length + " 条评论节点");
            return true;
          } else if (profileVideo) {
            console.log("[Built-in-Debug] [主页作品] 评论面板已可见 (" + (num + 1) + "/" + local3 + ")，允许 0 评论视频发主贴");
            return true;
          } else {
            console.log("[Built-in-Debug] 评论面板可见，但内容仍在加载中或暂无评论 (" + (num + 1) + "/" + local3 + ")...");
            await clickCommentPanelLoadingPlaceholder(result3, arg2);
          }
        }
      } else if (profileVideo && isProfileCommentUiVisible()) {
        console.log("[Built-in-Debug] [主页作品] 评论 UI 已展开（占位符可见）");
        return true;
      }
      if (!flag && flag2 && num >= value3 - 1 && (forMainPost || result2 !== 0 || result4)) {
        local3 = getExtendedReadyRounds(value3, {
          progress: true,
          hardCapRounds: forMainPost ? profileVideo ? 7 : 9 : 18
        });
        if (local3 > value3) {
          flag = true;
          console.log("[Built-in-Debug] [慢环境] " + (forMainPost ? "主评输入区" : "评论节点") + "未就绪，延长等待 " + value3 + "→" + local3 + " 轮");
          reportCurrentAction(forMainPost ? "评论输入加载较慢，继续等待…" : "评论区加载较慢，继续等待…");
        }
      }
    }
    if (forMainPost && fn33(arg1 || document)) {
      return true;
    }
    if (result3 && isVisibleElement(result3)) {
      console.log("[Built-in-Debug] 评论面板超时未加载出节点，判定该视频可能暂无评论，放行处理");
      return true;
    }
    if (profileVideo && isProfileCommentUiVisible()) {
      return true;
    }
    return false;
  }
  const flag = false;
  function shouldExpandFoldedCommentReplies(options = {}) {
    if (options.forEntityLeadgen) {
      return false;
    }
    if (!flag) {
      return false;
    }
    if (options.forMonitorScrape) {
      return true;
    }
    const local = options.taskMode ?? state.currentTask?.taskMode;
    return local === "scrape";
  }
  async function expandReplies(arg1, arg2, arg3 = null, arg4 = null, options = {}) {
    if (!shouldExpandFoldedCommentReplies(options)) {
      return;
    }
    if (arg4?.skipExpand) {
      return;
    }
    const pattern = /展开\s*\d*\s*条?回复|展开更多|——\s*展开/;
    if (arg4 && !arg4.expandedKeys) {
      arg4.expandedKeys = new Set();
    }
    const local = arg4?.expandedKeys || new Set();
    const local2 = arg1 => {
      const result = (arg1.textContent || "").trim();
      const result2 = arg1.closest("[data-e2e=\"comment-item\"], [class*=\"comment-item\"], [class*=\"CommentItem\"], li");
      let text = "";
      if (result2) {
        const result = result2.querySelector("[data-e2e=\"comment-username\"], [data-e2e=\"comment-at-user\"], [class*=\"nickname\"], a[href*=\"/user/\"]");
        text = (result?.textContent || "").trim().slice(0, 32);
        const value = result2.parentElement ? Array.from(result2.parentElement.children).indexOf(result2) : -1;
        text += "#" + value;
      }
      return text + "|" + result;
    };
    const local3 = arg1 => {
      const result = Array.from(arg1.querySelectorAll("div, span, p")).filter(arg12 => {
        if (arg12 === arg1) {
          return false;
        }
        const result = (arg12.textContent || "").trim();
        return result.length > 0 && result.length <= 25 && pattern.test(result);
      });
      return result.length === 0;
    };
    const result = Array.from(arg1.querySelectorAll("div[data-e2e], span[data-e2e], div[class*=\"expand\"], span[class*=\"expand\"], div[class*=\"Expand\"], span[class*=\"reply-btn\"], div[class*=\"reply-btn\"], div, span, p"));
    const result2 = result.filter(arg1 => {
      if (arg3 && arg3.has(arg1)) {
        return false;
      }
      const result = (arg1.textContent || "").trim();
      if (result.length === 0 || result.length > 25) {
        return false;
      }
      if (!pattern.test(result)) {
        return false;
      }
      if (!local3(arg1)) {
        return false;
      }
      const result2 = local2(arg1);
      if (local.has(result2)) {
        return false;
      }
      return true;
    });
    if (result2.length > 0) {
      console.log("[Built-in-Debug] [展开回复] 发现 " + result2.length + " 个新展开按钮，逐一展开...");
    }
    for (const item of result2) {
      if (shouldAbort(arg2)) {
        break;
      }
      if (arg4?.skipExpand) {
        break;
      }
      const result = local2(item);
      local.add(result);
      if (arg3) {
        arg3.add(item);
      }
      try {
        const result = getVisibleCommentNodeCount(arg1);
        const result2 = (item.textContent || "").trim();
        safeScrollTargetIntoView(item, {
          force: true,
          block: "nearest"
        });
        await new Promise(arg1 => setTimeout(arg1, 300));
        pauseVisibleDouyinVideos(arg1);
        await simulateHumanClick(item, arg2);
        pauseVisibleDouyinVideos(arg1);
        await new Promise(arg1 => setTimeout(arg1, 1200));
        const result3 = getVisibleCommentNodeCount(arg1);
        const result4 = (item.textContent || "").trim();
        const result5 = pattern.test(result4);
        const local = result3 > result || result2 && result4 !== result2 && !result5;
        if (!local && result5 && arg4) {
          arg4.failCount = (arg4.failCount || 0) + 1;
          console.warn("[Built-in-Debug] [展开回复] 展开失败 (" + arg4.failCount + "/2): \"" + result2 + "\"（已标记，不再重试）");
          if (arg4.failCount >= 2) {
            arg4.skipExpand = true;
            console.warn("[Built-in-Debug] [展开回复] 本视频已连续 2 次展开失败，后续不再点击展开");
            break;
          }
        }
      } catch (error) {
        if (arg4) {
          arg4.failCount = (arg4.failCount || 0) + 1;
          if (arg4.failCount >= 2) {
            arg4.skipExpand = true;
            console.warn("[Built-in-Debug] [展开回复] 本视频已连续 2 次展开失败，后续不再点击展开");
            break;
          }
        }
      }
    }
  }
  function fn37(arg1 = null) {
    const value = arg1 && isVisibleElement(arg1) ? arg1 : getDouyinFeedScope();
    const list = [".xgplayer-playswitch-next", "[data-e2e=\"video-switch-next-btn\"]", "[data-e2e=\"video-switch-next-arrow\"]", ".video-switch-next"];
    const text = "[class*=\"SwitchNext\"], [class*=\"switch-next\"], [aria-label*=\"下一条\"], [title*=\"下一条\"]";
    const text2 = "[data-e2e=\"feed-active-live\"], [data-e2e=\"browse-live\"], [data-e2e=\"feed-live\"], [data-e2e=\"webcast-player\"], [class*=\"live-card\"], [class*=\"LiveCard\"]";
    const local = arg1 => {
      if (!arg1) {
        return true;
      }
      try {
        const result = [arg1.className || "", arg1.getAttribute?.("data-e2e") || "", arg1.getAttribute?.("aria-label") || "", arg1.getAttribute?.("title") || "", arg1.id || "", (arg1.textContent || "").slice(0, 20)].join(" ");
        if (/playswitch-prev|SwitchPrev|switch-prev|上一条|上一[个条首]|prev/i.test(result)) {
          return true;
        }
        if (arg1.closest?.(".xgplayer-playswitch-prev, [data-e2e*=\"switch-prev\"], [class*=\"SwitchPrev\"]")) {
          return true;
        }
      } catch (error) {}
      return false;
    };
    const local2 = arg1 => {
      try {
        return !!arg1.closest?.(text2);
      } catch (error) {
        return false;
      }
    };
    const local3 = arg1 => {
      try {
        const result = arg1.getBoundingClientRect();
        const local = arg1.getAttribute?.("data-e2e") || "";
        const result2 = String(arg1.className || "").split(/\s+/).slice(0, 3).join(".");
        return "" + arg1.tagName + (local ? "[data-e2e=" + local + "]" : "") + (result2 ? "." + result2 : "") + "@(" + Math.round(result.left) + "," + Math.round(result.top) + "," + Math.round(result.width) + "x" + Math.round(result.height) + ")";
      } catch (error) {
        return arg1?.tagName || "?";
      }
    };
    const local4 = (arg1, arg2) => {
      if (!arg1 || !isVisibleElement(arg1) || local(arg1) || local2(arg1)) {
        return -Infinity;
      }
      let local3;
      try {
        local3 = arg1.getBoundingClientRect();
      } catch (error) {
        return -Infinity;
      }
      if (!local3 || local3.width < 4 || local3.height < 4) {
        return -Infinity;
      }
      let local4 = arg2;
      if (isElementInFeedCenter(arg1)) {
        local4 += 50;
      }
      if (value && typeof value.contains === "function" && value.contains(arg1)) {
        local4 += 40;
      }
      const result = Math.max(1, window.innerWidth);
      local4 += Math.min(30, local3.left / result * 30);
      local4 += Math.min(20, local3.width * local3.height / 400);
      if (value) {
        try {
          const result = value.getBoundingClientRect();
          const value2 = local3.left + local3.width / 2 - (result.left + result.width / 2);
          const value3 = local3.top + local3.height / 2 - (result.top + result.height / 2);
          local4 += Math.max(0, 25 - Math.sqrt(value2 * value2 + value3 * value3) / 20);
        } catch (error) {}
      }
      return local4;
    };
    const local5 = (arg1, arg2) => {
      const list = [];
      try {
        Array.from(document.querySelectorAll(arg1)).forEach(arg1 => {
          const result = local4(arg1, arg2);
          if (Number.isFinite(result) && result > -Infinity) {
            list.push({
              el: arg1,
              score: result
            });
          }
        });
      } catch (error) {}
      return list;
    };
    let list2 = [];
    for (const item of list) {
      list2 = list2.concat(local5(item, 100));
    }
    if (!list2.length) {
      list2 = local5(text, 40);
    }
    if (!list2.length) {
      return null;
    }
    list2.sort((arg1, arg2) => arg2.score - arg1.score);
    const value2 = list2[0];
    console.log("[Built-in-Debug] [切条] 命中下一条按钮 score=" + value2.score.toFixed(1) + " " + ("candidates=" + list2.length + " hit=" + local3(value2.el)));
    return value2.el;
  }
  async function moveToNextVideo(arg1, {
    aggressive = false,
    preferKeyboard = false,
    keyboardOnly = false
  } = {}) {
    if (shouldAbort(arg1)) {
      return false;
    }
    clearPendingLeadVideoUrl();
    const result = getFeedSwitchGuard();
    const local = preferKeyboard || keyboardOnly;
    const result2 = result.shouldSkipButtonClick();
    console.log("[Built-in-Debug] 准备切换下一条视频..." + (" aggressive=" + !!aggressive + " preferKeyboard=" + !!preferKeyboard + " keyboardOnly=" + !!keyboardOnly) + (" buttonCooldown=" + result2));
    if (!local && result2) {
      console.log("[Built-in-Debug] 下一条按钮仍在冷却中，跳过重复切换（防连点）");
      return true;
    }
    const result3 = getDouyinFeedScope();
    const result4 = isDouyinFeedLiveStream(result3);
    if (result4) {
      console.log("[Built-in-Debug] 当前处于直播间卡片，避免聚焦和向其发送键盘/滚轮事件");
      try {
        document.activeElement?.blur?.();
      } catch (error) {}
      try {
        document.body?.focus?.();
      } catch (error) {}
    } else if (result3) {
      try {
        result3.focus?.();
      } catch (error) {}
    }
    const local2 = (arg1 = document.body) => {
      arg1.dispatchEvent(new KeyboardEvent("keydown", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
        which: 40,
        bubbles: true
      }));
    };
    const value = result4 || !result3 ? document.body : result3;
    let flag = false;
    if (!local) {
      const result2 = fn37(result3);
      if (result2) {
        console.log("[Built-in-Debug] 命中下一条按钮，准备点击");
        flag = await simulateTrustedElementClick(result2, arg1, "切换下一条视频");
        if (flag) {
          result.noteAttempt({
            byButton: true
          });
        }
      }
    }
    if (!flag) {
      if (local) {
        console.log("[Built-in-Debug] 按 preferKeyboard/keyboardOnly，仅用 ArrowDown 切换");
      } else {
        console.log("[Built-in-Debug] 下一条按钮不可用，回退到 ArrowDown 切换");
      }
      const result2 = await simulateTrustedKey("ArrowDown", arg1, "切换下一条视频");
      if (!result2) {
        local2(value);
      }
      result.noteAttempt({
        byButton: false
      });
    } else {
      console.log("[Built-in-Debug] 下一条按钮已点击，不再补按键（防连跳）");
    }
    if (aggressive && !flag) {
      await sleep(280);
      if (!(await simulateTrustedKey("ArrowDown", arg1, "再次切换下一条"))) {
        local2(document.body);
      }
      await sleep(280);
      if (!(await simulateTrustedKey("ArrowDown", arg1, "第三次切换下一条"))) {
        local2(document.body);
      }
      try {
        const value = result4 || !result3 ? document.documentElement : result3;
        value.dispatchEvent(new WheelEvent("wheel", {
          deltaY: 520,
          bubbles: true,
          cancelable: true
        }));
      } catch (error) {}
    }
    return true;
  }
  async function awaitFeedVideoSwitchSettled(arg1, {
    previousIdentity = "",
    previousTitle = "",
    previousAuthor = "",
    leadVideoUrl = "",
    dedupKey = "",
    phaseLabel = "导航",
    preferredScope = null,
    quietTrace = false,
    acceptTitleOnlySwitch = false,
    requireDistinctVideoId = false
  } = {}) {
    const result = Date.now();
    let flag = false;
    let text = "";
    let num = 0;
    let num2 = 0;
    let flag2 = false;
    let num3 = 0;
    const local = previousIdentity || getFeedVideoIdentity() || "";
    const local2 = previousTitle || "";
    const result2 = normalizeAuthorAccountName(previousAuthor || "");
    const local3 = extractSpecificVideoId(leadVideoUrl || dedupKey || local) || "";
    console.log("[Built-in-Debug] [" + phaseLabel + "] 正在监控视频切换状态...");
    if (!quietTrace) {
      reportCurrentAction("等待新视频加载完成...");
    }
    for (let num4 = 0; num4 < 24; num4++) {
      if (shouldAbort(arg1)) {
        return false;
      }
      const value = preferredScope && isVisibleElement(preferredScope) ? preferredScope : resolveDouyinVideoDetailModal({
        includeFeed: false
      });
      const value2 = value && isVisibleElement(value) ? value : getDouyinFeedScope() || document;
      const local4 = getFeedVideoIdentity(value2) || "";
      const result3 = (() => {
        try {
          const result = captureFeedVideoShareUrl(value2);
          if (isDouyinVideoShareUrl(result)) {
            return result;
          }
        } catch (error) {}
        const result = normalizeUrl(window.location.href);
        if (isDouyinVideoShareUrl(result)) {
          return result;
        }
        const local = extractSpecificVideoId(result) || extractVideoIdFromHref(result);
        if (local) {
          return buildDouyinVideoShareUrl(local);
        }
        return "";
      })();
      const local5 = extractSpecificVideoId(window.location.href) || "";
      const local6 = extractSpecificVideoId(result3) || local5 || extractSpecificVideoId(local4) || "";
      const result4 = getVideoTitle(value2);
      const local7 = !!local && !!local4 && local4 !== local;
      const local8 = !!local3 && !!local6 && String(local3) !== String(local6);
      const local9 = local8 || (isDouyinVideoShareUrl(leadVideoUrl) && isDouyinVideoShareUrl(result3) ? result3 !== leadVideoUrl : dedupKey ? result3 !== dedupKey : false);
      const local10 = !!local2 && !!result4 && result4 !== "未知视频" && result4 !== local2;
      const local11 = !!local3 && !!local6 && String(local3) === String(local6);
      const local12 = local7 && (!requireDistinctVideoId || !local11);
      const local13 = local8 || local10 || local12 || local9 && !local11;
      if (isDouyinFeedLiveStream() || hasFeedLiveEnterHint()) {
        if (!quietTrace) {
          reportCurrentAction("切换后检测到直播间预览，将自动跳过...");
        }
        flag = true;
        break;
      }
      if (local13) {
        flag2 = true;
        const result5 = getVideoAuthorNickname(value2, result3 || local6);
        const local = !!result2 && !!result5 && normalizeAuthorAccountName(result5) === result2;
        const local2 = !!result4 && result4 !== "未知视频";
        const local3 = local8 && local2;
        if (local && !local3) {
          num3 += 1;
        } else {
          num3 = 0;
        }
        const local5 = local3 || local2 && !!result5 && !local || acceptTitleOnlySwitch && local10 && local2 || local10 && local2 && num3 >= 3;
        const value = (local6 || local4 || result3 || "") + "|" + (result4 || "") + "|" + (result5 || "");
        if (!local5) {
          if (local && num4 % 3 === 0) {
            console.log("[Built-in-Debug] [" + phaseLabel + "] 作者仍像上一条「" + result5 + "」，继续快检对齐…");
          }
          text = "";
          num = 0;
        } else {
          if (value === text) {
            num += 1;
          } else {
            text = value;
            num = 1;
          }
          const value3 = local3 || acceptTitleOnlySwitch && local10 && local2 ? 1 : 2;
          if (num >= value3) {
            const value = Date.now() - result;
            console.log("[Built-in-Debug] [" + phaseLabel + "] 切换成功！耗时: " + value + "ms, " + ("id=" + (local6 || "n/a") + ", 作者: " + (result5 || "待对齐") + ", ") + ("新标题: " + (result4 || "").substring(0, 15) + "..."));
            if (!quietTrace) {
              reportCurrentAction("新视频已加载：" + (result4 || "未知").substring(0, 18) + "...");
            }
            pauseVisibleDouyinVideos(value2, "切条确认后立即暂停防连播");
            flag = true;
            break;
          }
        }
      }
      const result5 = getFeedSwitchGuard();
      if (result5.shouldRetrySettleSwitch({
        waitStart: result,
        round: num4,
        sawSwitchProgress: flag2
      })) {
        num2 += 1;
        console.log("[Built-in-Debug] [" + phaseLabel + "检测] 等待 " + num4 + " 轮仍停在原视频，重新尝试切换下一条...");
        if (!quietTrace) {
          reportCurrentAction("新视频未响应，重新尝试切换下一条...");
        }
        if (num2 === 1) {
          await moveToNextVideo(arg1, {
            preferKeyboard: true
          });
        } else {
          await moveToNextVideo(arg1, {
            aggressive: true,
            preferKeyboard: true
          });
        }
      }
      await sleep(flag2 ? 280 : 420);
    }
    return flag;
  }
  async function waitForFeedItemChange(arg1, arg2, num = 10) {
    const local = arg2 || getFeedVideoIdentity();
    const local2 = num;
    let local3 = local2;
    let flag = false;
    let flag2 = false;
    for (let num = 0; num < local3; num++) {
      if (shouldAbort(arg1)) {
        return false;
      }
      await sleep(450);
      if (isDouyinFeedLiveStream() || hasFeedLiveEnterHint()) {
        flag2 = true;
        continue;
      }
      const result = getFeedVideoIdentity();
      if (result && result !== local) {
        return true;
      }
      if (!result) {
        flag2 = true;
      }
      const result2 = getVideoTitle();
      if (result2 && !isDouyinLiveStreamTitle(result2)) {
        return true;
      }
      if (!flag && (flag2 || !result2 || result2 === "未知视频") && num >= local2 - 1) {
        local3 = getExtendedReadyRounds(local2, {
          progress: true,
          hardCapRounds: Math.min(local2 + 8, 18)
        });
        if (local3 > local2) {
          flag = true;
          console.log("[Built-in-Debug] [慢环境] 推荐流切换较慢，延长确认 " + local2 + "→" + local3 + " 轮");
        }
      }
    }
    return false;
  }
  return {
    aggressiveCommentListScroll: aggressiveCommentListScroll,
    awaitFeedVideoSwitchSettled: awaitFeedVideoSwitchSettled,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    expandReplies: expandReplies,
    findCommentScrollContainer: findCommentScrollContainer,
    getAdaptiveCommentWaitRange: getAdaptiveCommentWaitRange,
    getCommentEndHintText: getCommentEndHintText,
    getCommentScrollMetrics: getCommentScrollMetrics,
    getCommentsTotalCount: getCommentsTotalCount,
    getExtendedReadyBudgetMs: getExtendedReadyBudgetMs,
    getExtendedReadyRounds: getExtendedReadyRounds,
    getScrapeNoCompliantTolerance: getScrapeNoCompliantTolerance,
    getScrapeNoNewDataTolerance: getScrapeNoNewDataTolerance,
    getVideoStats: getVideoStats,
    getVisibleCommentNodeCount: getVisibleCommentNodeCount,
    getVisibleCommentViewportFingerprint: getVisibleCommentViewportFingerprint,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isCommentPanelEmptyHint: isCommentPanelEmptyHint,
    maybeTrimRuntimeMemory: maybeTrimRuntimeMemory,
    moveToNextVideo: moveToNextVideo,
    parseLocalizedCountText: parseLocalizedCountText,
    pruneStaleCommentDom: pruneStaleCommentDom,
    resolveEffectiveCommentTotalCount: resolveEffectiveCommentTotalCount,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    scrollCommentList: scrollCommentList,
    shouldContinueScrapeAfterDuplicateWindow: shouldContinueScrapeAfterDuplicateWindow,
    shouldExpandFoldedCommentReplies: shouldExpandFoldedCommentReplies,
    shouldProbeIncompleteScrapeBoundary: shouldProbeIncompleteScrapeBoundary,
    trimRuntimeMemory: trimRuntimeMemory,
    waitForCommentDomWarmup: waitForCommentDomWarmup,
    waitForFeedItemChange: waitForFeedItemChange
  };
}
module.exports = {
  createCommentFeedNavigationController: createCommentFeedNavigationController
};
'use strict';

const {
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createSpecificVideoNavigationController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    SPECIFIC_VIDEO_BARE_JINGXUAN_CONFIRM_MS: specificVideoBareJingxuanConfirmMs,
    SPECIFIC_VIDEO_LOAD_TIMEOUT_MS: specificVideoLoadTimeoutMs,
    SPECIFIC_VIDEO_NAV_APPEAR_WAIT_MS: specificVideoNavAppearWaitMs,
    SPECIFIC_VIDEO_OPEN_RETRY_MAX: specificVideoOpenRetryMax,
    SPECIFIC_VIDEO_STATE_KEY: specificVideoStateKey,
    clipTraceText: clipTraceText,
    ensureSpecificVideoApiHook: ensureSpecificVideoApiHook,
    extractVideoIdFromHref: extractVideoIdFromHref,
    finalizeAccountTask: finalizeAccountTask,
    findCommentScrollContainer: findCommentScrollContainer,
    getProcessedVideoKeyModule: getProcessedVideoKeyModule,
    getSpecificVideoOpenModule: getSpecificVideoOpenModule,
    getVideoEngagePack: getVideoEngagePack,
    ipcRenderer: ipcRenderer,
    isCommentPanelContentLoading: isCommentPanelContentLoading,
    isViewingDouyinVideoPage: isViewingDouyinVideoPage,
    isVisibleElement: isVisibleElement,
    legacyRadarSessionKey: legacyRadarSessionKey,
    localStorage: localStorage,
    logTaskDbg: logTaskDbg,
    lookupSpecificVideoApiProbe: lookupSpecificVideoApiProbe,
    normalizeUrl: normalizeUrl,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    rememberPendingLeadVideoUrl: rememberPendingLeadVideoUrl,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveCommentPanelRoot: resolveCommentPanelRoot,
    scrollCommentList: scrollCommentList,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    sleep: sleep,
    state: state
  } = options;
  function convertToDouyinModalUrl(arg1) {
    if (!arg1) {
      return "";
    }
    const result = extractVideoIdFromHref(arg1);
    if (result) {
      return "https://www.douyin.com/jingxuan?modal_id=" + result;
    }
    return arg1;
  }
  function shouldReprocessConfiguredSpecific(arg1) {
    if (!state.allowSpecificReprocess || state.currentRunningSource !== "specific") {
      return false;
    }
    const local = window._specificVideoUrls || getSpecificVideoUrlList(state.currentTask);
    const result = extractSpecificVideoId(arg1);
    return !!result && !!local.some(arg1 => extractSpecificVideoId(arg1) === result);
  }
  function fn5(arg1, arg2 = window._specificVideoUrls) {
    const result = extractSpecificVideoId(arg1);
    if (!result) {
      return false;
    }
    const value = Array.isArray(arg2) && arg2.length ? arg2 : getSpecificVideoUrlList(state.currentTask);
    return value.some(arg1 => extractSpecificVideoId(arg1) === result);
  }
  function shouldBypassSpecificBrowseDedup(arg1) {
    if (state.currentRunningSource !== "specific") {
      return false;
    }
    return fn5(arg1);
  }
  function isSpecificVideoCompletedThisSession(arg1) {
    const result = extractSpecificVideoId(arg1);
    if (!result || !window._specificSessionCompletedIds) {
      return false;
    }
    return window._specificSessionCompletedIds.has(result);
  }
  function markSpecificVideoCompletedThisSession(arg1) {
    const result = extractSpecificVideoId(arg1);
    if (!result) {
      return;
    }
    if (!window._specificSessionCompletedIds) {
      window._specificSessionCompletedIds = new Set();
    }
    window._specificSessionCompletedIds.add(result);
    if (typeof window._saveRadarState === "function") {
      window._saveRadarState();
    }
  }
  function getSpecificVideoUrlList(arg1) {
    return String(arg1?.specifiedUrls || "").split(/[\n,，\s]+/).map(arg1 => arg1.trim()).filter(Boolean).map(convertToDouyinModalUrl);
  }
  function initVideoMainCommentMemoryFromTask(arg1) {
    const value = Array.isArray(arg1?.videoMainCommentedVideoIds) ? arg1.videoMainCommentedVideoIds : [];
    state.videoMainCommentedVideoIds = new Set(value.filter(Boolean));
    logTaskDbg("主评去重", "载入 " + state.videoMainCommentedVideoIds.size + " 条本账号已主评视频");
  }
  function hasVideoMainCommented(arg1) {
    if (!arg1 || state.videoMainCommentedVideoIds.size === 0) {
      return false;
    }
    const result = extractSpecificVideoId(arg1);
    if (!result) {
      return false;
    }
    if (state.videoMainCommentedVideoIds.has(result)) {
      return true;
    }
    for (const item of state.videoMainCommentedVideoIds) {
      if (extractSpecificVideoId(item) === result) {
        return true;
      }
    }
    return false;
  }
  function rememberVideoMainComment(arg1) {
    const result = extractSpecificVideoId(arg1);
    if (result) {
      state.videoMainCommentedVideoIds.add(result);
    }
  }
  function normalizeSpecificVideoKey(arg1) {
    return normalizeUrl(arg1) || "";
  }
  function extractSpecificVideoId(arg1) {
    if (!arg1) {
      return "";
    }
    const result = getProcessedVideoKeyModule();
    if (typeof result.extractDouyinVideoId === "function") {
      const result2 = result.extractDouyinVideoId(arg1);
      if (result2) {
        return result2;
      }
    }
    return extractVideoIdFromHref(arg1) || "";
  }
  function isOnSpecificTargetVideo(arg1, arg2) {
    if (!isViewingDouyinVideoPage(arg1) || !arg2) {
      return false;
    }
    const result = extractSpecificVideoId(arg1);
    const result2 = extractSpecificVideoId(arg2);
    if (result && result2) {
      return result === result2;
    }
    return normalizeSpecificVideoKey(arg1) === normalizeSpecificVideoKey(arg2);
  }
  function resolveDouyinVideoDetailModal(options = {}) {
    const value = options.includeFeed !== false;
    const result = String(window.location.href || "");
    const local = result.includes("/search/") && !result.includes("/video/") && !result.includes("/note/");
    const list = ["[data-e2e=\"video-detail-container\"]", ".modal-video-container", "[data-e2e=\"video-player-container\"]", ...(value ? ["[data-e2e=\"feed-active-video\"]"] : []), "[class*=\"note-detail\"]", "[class*=\"NoteDetail\"]", "[class*=\"SearchDetail\"]", "[class*=\"search-detail\"]", "[class*=\"VideoDetail\"]", "[class*=\"video-detail\"]", "[class*=\"DetailModal\"]", "[class*=\"detail-modal\"]", "[role=\"dialog\"]"];
    const list2 = [];
    for (const item of list) {
      try {
        document.querySelectorAll(item).forEach(arg1 => {
          if (!arg1 || !isVisibleElement(arg1)) {
            return;
          }
          const result = arg1.getBoundingClientRect();
          const value = result.width * result.height;
          if (value < 12000) {
            return;
          }
          const flag = !!arg1.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, img, canvas");
          const value2 = arg1.matches?.("[class*=\"SearchDetail\"]") ? arg1 : arg1.closest?.("[class*=\"SearchDetail\"]");
          const local2 = !!value2 && !!isVisibleElement(value2) && !!value2.querySelector?.("[data-e2e=\"video-player-close-icon\"], [aria-label=\"关闭\"], [class*=\"modal-close\"], [class*=\"ModalClose\"], [class*=\"close-btn\"], [class*=\"CloseBtn\"]") && !!value2.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, img, canvas");
          if (item === "[role=\"dialog\"]" && !flag) {
            return;
          }
          if (local) {
            const local = item === "[data-e2e=\"video-detail-container\"]" || item === ".modal-video-container" || /note-detail|NoteDetail|VideoDetail|DetailModal|detail-modal/.test(item) || local2 || item === "[role=\"dialog\"]" || !!arg1.closest?.("[data-e2e=\"video-detail-container\"], .modal-video-container, [class*=\"VideoDetail\"], [class*=\"DetailModal\"], [class*=\"note-detail\"], [class*=\"NoteDetail\"], [role=\"dialog\"]");
            if (!local) {
              return;
            }
          }
          list2.push({
            el: arg1,
            area: value,
            hasMedia: flag
          });
        });
      } catch (error) {}
    }
    if (list2.length > 0) {
      list2.sort((arg1, arg2) => {
        if (arg1.hasMedia !== arg2.hasMedia) {
          if (arg1.hasMedia) {
            return -1;
          } else {
            return 1;
          }
        }
        return arg2.area - arg1.area;
      });
      return list2[0].el;
    }
    if (local) {
      return null;
    }
    const local2 = platformSelectors["douyin.com"]?.modalContainer;
    if (!local2) {
      return null;
    }
    try {
      const result = document.querySelector(local2);
      if (result && isVisibleElement(result)) {
        const result2 = result.getBoundingClientRect();
        if (result2.width * result2.height >= 12000) {
          return result;
        }
      }
    } catch (error) {}
    return null;
  }
  function isDouyinSpecificVideoUnavailable() {
    try {
      if (fn16()) {
        return false;
      }
      if (fn17()) {
        return false;
      }
      if (fn18()) {
        return false;
      }
      const result = String(document.body?.innerText || "").slice(0, 12000);
      return /你要观看的视频不存在|作品不存在|视频不存在|内容不见了|已删除|分享的作品已失效|该内容无法展示|页面不存在|视频已失效|作品已失效|链接不正确|暂无法观看|内容已失效|找不到该作品|找不到该视频/.test(result);
    } catch (error) {
      return false;
    }
  }
  function fn16() {
    try {
      const result = String(window.location.href || "");
      const result2 = /\/video\/|\/note\//.test(result);
      const result3 = resolveDouyinVideoDetailModal({
        includeFeed: result2
      });
      if (result3 && isVisibleElement(result3)) {
        const flag = !!result3.querySelector?.("video, [data-e2e=\"video-player\"], .xgplayer, canvas, img");
        if (flag || result2) {
          return true;
        }
      }
      const result4 = Array.from(document.querySelectorAll("video, [data-e2e=\"video-player\"], .xgplayer, [data-e2e=\"video-player-container\"], [class*=\"video-player\"], [class*=\"VideoPlayer\"], [class*=\"xgplayer\"]")).filter(isVisibleElement);
      if (result4.some(arg1 => {
        const result = arg1.getBoundingClientRect();
        return result.width >= 120 && result.height >= 120;
      })) {
        return true;
      }
      if (result2) {
        const result = Array.from(document.querySelectorAll("[data-e2e=\"comment-list\"], [data-e2e=\"comment-item\"], [data-e2e=\"user-info\"], [data-e2e=\"browse-user-avatar\"], [class*=\"video-info\"], [class*=\"VideoInfo\"], [class*=\"author\"]")).some(arg1 => {
          if (!isVisibleElement(arg1)) {
            return false;
          }
          const result = arg1.getBoundingClientRect();
          return result.width >= 40 && result.height >= 20;
        });
        if (result) {
          return true;
        }
      }
      if (fn17()) {
        return true;
      }
      if (fn18()) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function loadSpecificVideoState(arg1) {
    if (!arg1) {
      return {
        id: "",
        count: 0,
        probing: false,
        probed: false,
        openAttempt: 0,
        loadStartedAt: 0
      };
    }
    try {
      const result = sessionStorage.getItem(specificVideoStateKey);
      if (!result) {
        return {
          id: arg1,
          count: 0,
          probing: false,
          probed: false,
          openAttempt: 0,
          loadStartedAt: 0
        };
      }
      const result2 = JSON.parse(result);
      if (result2?.id === arg1) {
        return {
          id: arg1,
          count: Math.max(0, Number(result2.count) || 0),
          probing: !!result2.probing,
          probed: !!result2.probed,
          openAttempt: Math.max(0, Number(result2.openAttempt) || 0),
          loadStartedAt: Math.max(0, Number(result2.loadStartedAt) || 0)
        };
      }
    } catch (error) {}
    return {
      id: arg1,
      count: 0,
      probing: false,
      probed: false,
      openAttempt: 0,
      loadStartedAt: 0
    };
  }
  function saveSpecificVideoState(arg1, options = {}) {
    if (!arg1) {
      return;
    }
    try {
      const result = loadSpecificVideoState(arg1);
      sessionStorage.setItem(specificVideoStateKey, JSON.stringify({
        ...result,
        ...options,
        id: arg1,
        at: Date.now()
      }));
    } catch (error) {}
  }
  async function waitSpecificVideoNavAppear(arg1) {
    const result = Math.floor(specificVideoNavAppearWaitMs / 1000);
    reportCurrentAction("已跳转指定视频，等待视频出现… (" + result + "s)");
    reportTraceLog("⏳ 跳转后等待视频出现 " + result + " 秒");
    console.log("[Built-in-Debug] [指定视频] 跳转后等待视频出现 " + result + "s");
    await randomDelay(specificVideoNavAppearWaitMs, specificVideoNavAppearWaitMs, arg1, "跳转后等待视频出现");
  }
  function getSpecificVideoProbeState(arg1) {
    return loadSpecificVideoState(arg1);
  }
  function fn23(arg1) {
    return loadSpecificVideoState(arg1).count;
  }
  function fn24(arg1, arg2) {
    saveSpecificVideoState(arg1, {
      count: Math.max(0, Number(arg2) || 0)
    });
  }
  function fn25() {
    try {
      sessionStorage.removeItem(specificVideoStateKey);
    } catch (error) {}
  }
  function toSpecificVideoJingxuanUrl(arg1) {
    const local = extractSpecificVideoId(arg1) || String(arg1 || "").trim();
    if (local) {
      return "https://www.douyin.com/jingxuan?modal_id=" + local;
    } else {
      return "";
    }
  }
  function toSpecificVideoDirectUrl(arg1) {
    const local = extractSpecificVideoId(arg1) || String(arg1 || "").trim();
    if (local) {
      return "https://www.douyin.com/video/" + local;
    } else {
      return "";
    }
  }
  function fn28(arg1) {
    const result = String(arg1 || "").trim();
    const result2 = extractSpecificVideoId(result);
    if (!result2) {
      return result;
    }
    if (/\/video\/|\/note\//.test(result)) {
      return toSpecificVideoDirectUrl(result2);
    }
    return toSpecificVideoJingxuanUrl(result2);
  }
  function fn29() {
    try {
      return document.readyState === "loading";
    } catch (error) {
      return false;
    }
  }
  function fn30(arg1 = document, options = {}) {
    try {
      const value = options.allowBodyFallback !== false;
      const value2 = options.mainStageOnly === true;
      const value3 = Number(options.maxScan) > 0 ? Number(options.maxScan) : 900;
      const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
      const result = getSpecificVideoOpenModule();
      const local2 = arg1 => typeof result?.isDouyinLoadingLabelText === "function" ? result.isDouyinLoadingLabelText(arg1) : !!arg1 && arg1.length <= 24 && (arg1 === "加载中" || /^加载中[.。…]+$/.test(arg1) || arg1 === "正在加载" || /^正在加载[.。…]+$/.test(arg1));
      const local3 = arg1 => typeof result?.isElementVisuallyShown === "function" ? result.isElementVisuallyShown(arg1) : isVisibleElement(arg1);
      const local4 = arg1 => {
        if (!value2) {
          return true;
        }
        if (typeof result?.isLoadingPlaceholderInMainStage === "function") {
          return result.isLoadingPlaceholderInMainStage(arg1);
        }
        return true;
      };
      const value4 = arg1 && arg1.querySelectorAll ? arg1 : document;
      const result2 = Array.from(value4.querySelectorAll("div, span, p, section, button")).slice(0, value3);
      let local5 = null;
      let local6 = Infinity;
      for (const item of result2) {
        if (!local3(item)) {
          continue;
        }
        if (item.children && item.children.length > 6) {
          continue;
        }
        const result = local(item.innerText || item.textContent || "");
        if (!local2(result)) {
          continue;
        }
        if (!local4(item)) {
          continue;
        }
        const result2 = item.getBoundingClientRect();
        if (result2.width < 4 || result2.height < 4) {
          continue;
        }
        if (result2.width > 420 || result2.height > 160) {
          continue;
        }
        const value = result2.width * result2.height;
        if (value < local6) {
          local5 = item;
          local6 = value;
        }
      }
      if (local5) {
        return local5;
      }
      const result3 = Array.from(value4.querySelectorAll("[class*=\"loading\"], [class*=\"Loading\"], [class*=\"spinner\"], [class*=\"Spinner\"], [data-e2e*=\"loading\"]")).find(arg1 => {
        if (!local3(arg1)) {
          return false;
        }
        if (!local4(arg1)) {
          return false;
        }
        const result = arg1.getBoundingClientRect();
        return result.width >= 8 && result.height >= 8 && result.width <= 160 && result.height <= 160;
      });
      if (result3) {
        return result3;
      }
      if (value && !value2) {
        const value = arg1 === document || arg1 === document.documentElement ? document.body : arg1;
        const result = local(value?.innerText || value?.textContent || "").slice(0, 600);
        if (result.length > 0 && result.length < 120 && /加载中|正在加载/.test(result)) {
          return value || document.body;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  function isDouyinVisibleLoadingPlaceholder(arg1 = document, options = {}) {
    return !!fn30(arg1, options);
  }
  async function fn32(arg1, text = "") {
    if (!arg1 || typeof arg1.getBoundingClientRect !== "function") {
      return false;
    }
    let num = 0;
    let num2 = 0;
    const local = (arg12, arg2, arg3, num3 = 1) => {
      num = arg2;
      num2 = arg3;
      try {
        arg1.dispatchEvent(new PointerEvent(arg12, {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          clientX: arg2,
          clientY: arg3,
          buttons: num3
        }));
      } catch (error) {}
      try {
        const value = arg12 === "pointerdown" ? "mousedown" : arg12 === "pointerup" ? "mouseup" : arg12 === "pointermove" ? "mousemove" : arg12 === "pointercancel" ? "mouseup" : "mouseleave";
        arg1.dispatchEvent(new MouseEvent(value, {
          bubbles: true,
          cancelable: true,
          clientX: arg2,
          clientY: arg3,
          buttons: num3
        }));
      } catch (error) {}
    };
    try {
      const result = arg1.getBoundingClientRect();
      if (result.width < 40 || result.height < 80) {
        return false;
      }
      const result2 = Math.round(result.left + result.width / 2);
      const result3 = Math.round(result.top + Math.min(result.height * 0.92, result.height - 16));
      const result4 = Math.round(result.top + Math.min(result.height * 0.78, result3 - 56));
      if (result4 >= result3 - 24) {
        return false;
      }
      const num = 4;
      local("pointerdown", result2, result3, 1);
      for (let num2 = 1; num2 <= num; num2++) {
        const result = Math.round(result3 + (result4 - result3) * (num2 / num));
        local("pointermove", result2, result, 1);
        await sleep(24 + Math.floor(Math.random() * 16));
      }
      local("pointerup", result2, result4, 0);
      text;
      return true;
    } catch (error) {
      try {
        local("pointercancel", num || 0, num2 || 0, 0);
      } catch (error) {}
      return false;
    }
  }
  async function clickCommentPanelLoadingPlaceholder(arg1 = document, text = "") {
    try {
      const local = resolveCommentPanelRoot(arg1) || arg1 || document;
      const list = [local];
      if (arg1 && arg1 !== local) {
        list.push(arg1);
      }
      let local2 = null;
      for (const item of list) {
        local2 = fn30(item, {
          allowBodyFallback: false,
          maxScan: 500
        });
        if (local2) {
          break;
        }
      }
      const local3 = !!local2 || !!isCommentPanelContentLoading(local);
      if (!local3) {
        return false;
      }
      const local4 = findCommentScrollContainer(local) || (local && local.querySelector ? local.querySelector("[class*=\"comment\"]") : null) || local;
      try {
        reportCurrentAction("评论区「加载中」，上滑继续加载评论…");
      } catch (error) {}
      console.log("[Built-in-Debug] [评论加载] 「加载中」→ 上滑评论列表（点击仅辅助）");
      if (local4) {
        for (let num = 0; num < 3; num++) {
          await scrollCommentList(local, 380 + num * 90, text || "COMMENT_LOADING_SWIPE", {
            containWheel: true,
            delayMin: 160,
            delayMax: 280
          });
        }
        await fn32(local4, text || "COMMENT_LOADING_SWIPE");
        await sleep(220);
      }
      if (local2) {
        try {
          if (typeof simulateHumanClick === "function") {
            await simulateHumanClick(local2, text || "COMMENT_LOADING_CLICK");
          } else if (typeof local2.click === "function") {
            local2.click();
          }
        } catch (error) {}
      }
      await sleep(480);
      return true;
    } catch (error) {
      console.warn("[Built-in-Debug] [评论加载] 上滑/点击「加载中」失败:", error?.message || error);
      return false;
    }
  }
  function isDouyinJingxuanContentLoading() {
    try {
      if (fn17()) {
        return false;
      }
      if (fn18()) {
        return false;
      }
      if (fn16()) {
        return false;
      }
      if (isDouyinVisibleLoadingPlaceholder(document, {
        allowBodyFallback: false,
        mainStageOnly: true,
        maxScan: 700
      })) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function fn35() {
    if (fn16() || fn17() || fn18()) {
      return false;
    }
    if (fn29() && !lookupSpecificVideoApiProbe(extractSpecificVideoId(window.location.href) || "")) {
      return true;
    }
    return isDouyinJingxuanContentLoading();
  }
  function isDouyinSearchPageContentLoading() {
    try {
      if (document.readyState === "loading") {
        return true;
      }
    } catch (error) {}
    return isDouyinVisibleLoadingPlaceholder(document, {
      allowBodyFallback: true
    });
  }
  function hasSpecificVideoTargetInUrl(arg1, arg2 = window.location.href) {
    const result = extractSpecificVideoId(arg1);
    if (!result) {
      return false;
    }
    const result2 = extractSpecificVideoId(arg2);
    return !!result2 && result2 === result;
  }
  function fn38() {
    try {
      const list = ["[data-e2e=\"notification-entry\"]", "[data-e2e=\"im-entry\"]", "[data-e2e=\"something-button\"]"];
      for (const item of list) {
        const result = document.querySelector(item);
        if (!result || !isVisibleElement(result)) {
          continue;
        }
        const result2 = result.getBoundingClientRect();
        if (result2.top < 130 && result2.width >= 8 && result2.height >= 8) {
          return true;
        }
      }
      const result = Array.from(document.querySelectorAll("button, a, span, div"));
      for (const item of result) {
        if (!isVisibleElement(item)) {
          continue;
        }
        const result = String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
        if (!/^(通知|投稿|发布)$/.test(result)) {
          continue;
        }
        const result2 = item.getBoundingClientRect();
        if (result2.top < 140 && result2.left < (window.innerWidth || 1280) * 0.6 && result2.width > 0 && result2.width < 220 && result2.height > 0 && result2.height < 72) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function fn39() {
    return resolveDouyinVideoDetailModal({
      includeFeed: false
    });
  }
  function fn18() {
    try {
      const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
      const local2 = arg1 => /^(评论|评论\s*[\d.万w+()（）]*)$/i.test(arg1) || /^评论[\d.万w+()（）\s]{0,12}$/.test(arg1);
      const pattern = /^(详情|TA的作品|AI抖音|相关推荐)$/;
      const result = Array.from(document.querySelectorAll("div, span, button, a, li"));
      const list = [];
      for (const item of result) {
        if (!isVisibleElement(item)) {
          continue;
        }
        if (item.children && item.children.length > 3) {
          continue;
        }
        const result = local(item.innerText || item.textContent || "");
        if (!result || result.length > 18) {
          continue;
        }
        if (!local2(result)) {
          continue;
        }
        const result2 = item.getBoundingClientRect();
        if (result2.width < 20 || result2.height < 12 || result2.width > 220 || result2.height > 64) {
          continue;
        }
        if (result2.left < (window.innerWidth || 1280) * 0.28) {
          continue;
        }
        if (result2.top < 40 || result2.top > (window.innerHeight || 800) * 0.55) {
          continue;
        }
        list.push({
          el: item,
          r: result2
        });
      }
      for (const {
        el: el,
        r: r
      } of list) {
        let num = 0;
        for (const item of result) {
          if (item === el || !isVisibleElement(item)) {
            continue;
          }
          if (item.children && item.children.length > 3) {
            continue;
          }
          const result = local(item.innerText || item.textContent || "");
          if (!pattern.test(result)) {
            continue;
          }
          const result2 = item.getBoundingClientRect();
          if (result2.width < 20 || result2.height < 12 || result2.width > 220 || result2.height > 64) {
            continue;
          }
          if (Math.abs(result2.top - r.top) > 28) {
            continue;
          }
          if (Math.abs(result2.left - r.left) > 520) {
            continue;
          }
          num += 1;
          if (num >= 1) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function fn17() {
    try {
      const local = arg1 => String(arg1 || "").replace(/\s+/g, " ").trim();
      const local2 = arg1 => {
        const result = local(arg1);
        if (!result || result.length > 16) {
          return false;
        }
        if (/^(赞|点赞)$/.test(result)) {
          return true;
        }
        if (/^[\d.]+[万wW千kK+]?$/.test(result)) {
          return true;
        }
        if (/^\d{1,12}$/.test(result)) {
          return true;
        }
        return false;
      };
      const result = getVideoEngageSelector({
        getVideoEngagePack: getVideoEngagePack
      }, "likeSelectors");
      if (!result) {
        return false;
      }
      const list = [];
      const result2 = fn39();
      if (result2 && isVisibleElement(result2)) {
        list.push(result2);
      }
      list.push(document);
      const set = new Set();
      for (const item of list) {
        let list = [];
        try {
          list = Array.from(item.querySelectorAll(result));
        } catch (error) {
          list = [];
        }
        for (const item of list) {
          if (!item || set.has(item) || !isVisibleElement(item)) {
            continue;
          }
          set.add(item);
          const result = item.getBoundingClientRect();
          if (result.width < 10 || result.height < 10) {
            continue;
          }
          if (result.left < (window.innerWidth || 1280) * 0.35) {
            continue;
          }
          if (result.top < 60 || result.top > (window.innerHeight || 800) * 0.92) {
            continue;
          }
          const result2 = local(item.getAttribute("aria-label") || item.getAttribute("title") || "");
          if (/赞|点赞|like|digg/i.test(result2)) {
            return true;
          }
          const local3 = item.closest("button, [role=\"button\"], [class*=\"digg\"], [class*=\"like\"], [class*=\"Like\"]") || item.parentElement;
          const result3 = local(local3?.innerText || local3?.textContent || "");
          if (local2(result3) || /赞|点赞/.test(result3)) {
            return true;
          }
          const local4 = local3 || item.parentElement;
          if (local4) {
            for (const item2 of local4.querySelectorAll("span, div, p")) {
              if (item2 === item || !isVisibleElement(item2)) {
                continue;
              }
              if (local2(item2.innerText || item2.textContent)) {
                return true;
              }
            }
          }
          if (result.width >= 16 && result.height >= 16) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  function isSpecificVideoDetailReady(arg1) {
    const result = String(window.location.href || "");
    if (/\/video\/|\/note\//.test(result)) {
      if (!hasSpecificVideoTargetInUrl(arg1, result)) {
        return false;
      }
      return fn16() || fn17() || fn18();
    }
    if (!/\/jingxuan/.test(result)) {
      return false;
    }
    if (!hasSpecificVideoTargetInUrl(arg1, result)) {
      return false;
    }
    const result2 = fn39();
    if (result2 && isVisibleElement(result2)) {
      return true;
    }
    if (fn17()) {
      return true;
    }
    return fn18();
  }
  function fn41(arg1) {
    try {
      const result = String(window.location.href || "");
      if (/\/video\/|\/note\//.test(result)) {
        return false;
      }
      if (!/\/jingxuan/.test(result)) {
        return false;
      }
      if (fn35()) {
        return false;
      }
      if (isSpecificVideoDetailReady(arg1)) {
        return false;
      }
      const result2 = fn39();
      if (result2 && isVisibleElement(result2)) {
        return false;
      }
      if (fn17()) {
        return false;
      }
      if (fn18()) {
        return false;
      }
      return fn38();
    } catch (error) {
      return false;
    }
  }
  function evaluateSpecificVideoOpenProgress(arg1) {
    try {
      ensureSpecificVideoApiHook();
    } catch (error) {}
    const result = String(window.location.href || "");
    if (isSpecificVideoDetailReady(arg1)) {
      return "ready";
    }
    const result2 = lookupSpecificVideoApiProbe(arg1);
    if (result2?.status === "unavailable") {
      if (hasSpecificVideoTargetInUrl(arg1, result) || /\/jingxuan|\/video\/|\/note\//.test(result)) {
        return "unavailable";
      }
    }
    if (result2?.status === "ready" && hasSpecificVideoTargetInUrl(arg1, result)) {
      return "waiting";
    }
    if (fn35()) {
      return "loading";
    }
    if (hasSpecificVideoTargetInUrl(arg1, result) || /\/jingxuan/.test(result)) {
      if (isDouyinSpecificVideoUnavailable() && !isSpecificVideoDetailReady(arg1)) {
        return "unavailable";
      }
      if (fn41(arg1)) {
        return "bare_jingxuan";
      }
      return "waiting";
    }
    if (fn41(arg1)) {
      return "bare_jingxuan";
    }
    return "waiting";
  }
  async function awaitSpecificVideoOpenSettle(arg1, arg2, arg3 = specificVideoLoadTimeoutMs) {
    const result = Date.now();
    let num = 0;
    let num2 = 0;
    let value = -1;
    while (!shouldAbort(arg1) && Date.now() - result < arg3) {
      const result2 = evaluateSpecificVideoOpenProgress(arg2);
      if (result2 === "ready") {
        return "ready";
      }
      if (result2 === "unavailable") {
        num += 1;
        if (num >= 3) {
          return "unavailable";
        }
      } else {
        num = 0;
      }
      if (result2 === "loading") {
        num2 = 0;
        const result2 = Math.floor((Date.now() - result) / 1000);
        if (result2 !== value && (result2 === 0 || result2 % 5 === 0)) {
          value = result2;
          reportCurrentAction("检测到「加载中」，等待页面加载完成… (" + result2 + "s/" + Math.floor(arg3 / 1000) + "s)");
        }
        await randomDelay(500, 800, arg1, "指定视频加载中等待");
        continue;
      }
      if (result2 === "bare_jingxuan") {
        num2 += 1;
        if (num2 >= 3 && Date.now() - result >= specificVideoBareJingxuanConfirmMs) {
          console.warn("[Built-in-Debug] [指定视频] 精选壳可见且无详情弹窗，判定链接失效");
          return "bare_jingxuan";
        }
      } else {
        num2 = 0;
      }
      const result3 = Math.floor((Date.now() - result) / 1000);
      if (result3 > 0 && result3 % 8 === 0) {
        reportCurrentAction("指定视频打开中，耐心等待… (" + result3 + "s/" + Math.floor(arg3 / 1000) + "s)");
      }
      await randomDelay(400, 650, arg1, "指定视频打开探测");
    }
    if (shouldAbort(arg1)) {
      return "aborted";
    }
    const result2 = evaluateSpecificVideoOpenProgress(arg2);
    if (result2 === "ready") {
      return "ready";
    }
    if (result2 === "unavailable") {
      return "unavailable";
    }
    if (result2 === "bare_jingxuan") {
      return "bare_jingxuan";
    }
    if (result2 === "loading") {
      reportCurrentAction("页面仍显示「加载中」，准备重试打开…");
      console.warn("[Built-in-Debug] [指定视频] 等待超时仍显示加载中");
    }
    return "settled";
  }
  async function openSpecificVideoWithRetries(arg1, arg2) {
    try {
      ensureSpecificVideoApiHook();
    } catch (error) {}
    const result = extractSpecificVideoId(arg2);
    const result2 = fn28(arg2);
    let result3 = loadSpecificVideoState(result);
    let result4 = Math.max(0, Number(result3.openAttempt) || 0);
    while (result4 < specificVideoOpenRetryMax) {
      if (shouldAbort(arg1)) {
        return "aborted";
      }
      result4 += 1;
      saveSpecificVideoState(result, {
        openAttempt: result4,
        loadStartedAt: Date.now(),
        count: 0,
        probing: false,
        probed: false
      });
      reportCurrentAction("正在打开指定视频 (" + result4 + "/" + specificVideoOpenRetryMax + ")，最长等待约 " + Math.floor(specificVideoLoadTimeoutMs / 1000) + " 秒…");
      reportTraceLog("👆 指定视频打开第 " + result4 + "/" + specificVideoOpenRetryMax + " 次：" + clipTraceText(result2, 80));
      console.log("[Built-in-Debug] [指定视频] 打开尝试 " + result4 + "/" + specificVideoOpenRetryMax + ": " + result2);
      const result3 = hasSpecificVideoTargetInUrl(arg2);
      if (isSpecificVideoDetailReady(arg2)) {
        saveSpecificVideoState(result, {
          openAttempt: result4,
          loadStartedAt: 0,
          count: 0,
          probed: true
        });
        reportCurrentAction("指定视频已打开，准备进入处理...");
        return "ready";
      }
      if (!result3) {
        window.location.href = result2;
        await waitSpecificVideoNavAppear(arg1);
      }
      const result5 = await awaitSpecificVideoOpenSettle(arg1, arg2, specificVideoLoadTimeoutMs);
      if (result5 === "aborted") {
        return "aborted";
      }
      if (result5 === "ready") {
        saveSpecificVideoState(result, {
          openAttempt: result4,
          loadStartedAt: 0,
          count: 0,
          probed: true
        });
        reportCurrentAction("指定视频已打开，准备进入处理...");
        return "ready";
      }
      if (result5 === "unavailable" || result5 === "bare_jingxuan") {
        saveSpecificVideoState(result, {
          openAttempt: result4,
          probed: true,
          loadStartedAt: 0
        });
        return "unavailable";
      }
      const result6 = isDouyinJingxuanContentLoading();
      reportTraceLog("⚠️ 指定视频第 " + result4 + " 次打开超时" + (result6 ? "（仍显示加载中）" : "未就绪") + "，" + ("" + (result4 < specificVideoOpenRetryMax ? "准备重新进入" : "已达最大次数")), null, "warning");
      if (result4 >= specificVideoOpenRetryMax) {
        break;
      }
      reportCurrentAction(result6 ? "「加载中」超过 1 分钟，重新进入指定视频 (" + (result4 + 1) + "/" + specificVideoOpenRetryMax + ")…" : "加载过慢，重新进入指定视频 (" + (result4 + 1) + "/" + specificVideoOpenRetryMax + ")…");
      window.location.href = result2;
      await waitSpecificVideoNavAppear(arg1);
    }
    return "timeout";
  }
  async function probeSpecificVideoOnDirectPage(arg1, arg2) {
    const result = extractSpecificVideoId(arg2);
    if (!result) {
      return "settled";
    }
    const result2 = toSpecificVideoDirectUrl(result);
    saveSpecificVideoState(result, {
      probing: true,
      probed: false,
      count: 0,
      loadStartedAt: Date.now()
    });
    console.warn("[Built-in-Debug] [指定视频] 改开 /video/ 验证: " + result2);
    reportCurrentAction("正在用播放页打开指定视频…");
    reportTraceLog("⚠️ 指定视频改开 /video/：" + result, null, "warning");
    window.location.href = result2;
    await waitSpecificVideoNavAppear(arg1);
    const result3 = await awaitSpecificVideoOpenSettle(arg1, arg2, specificVideoLoadTimeoutMs);
    if (result3 === "aborted") {
      return "aborted";
    }
    if (result3 === "unavailable" || result3 === "bare_jingxuan") {
      saveSpecificVideoState(result, {
        probing: false,
        probed: true,
        count: 0
      });
      return "unavailable";
    }
    if (result3 === "ready" || fn16()) {
      saveSpecificVideoState(result, {
        probing: false,
        probed: true,
        count: 0
      });
      reportCurrentAction("播放页打开成功，继续处理...");
      reportTraceLog("✅ 指定视频 /video/ 打开成功：" + result);
      return "ready";
    }
    return "settled";
  }
  function describeSpecificVideoSkipReason(text = "") {
    const result = String(text || "");
    if (/bare_jingxuan/.test(result)) {
      return {
        title: "指定视频链接无效",
        detail: "地址栏虽可能仍有 modal_id，但页面是精选壳（可见通知/投稿）且无详情弹窗",
        action: "链接无效，跳过并打开下一个..."
      };
    }
    if (/load_timeout|probe_timeout|timeout/.test(result)) {
      return {
        title: "指定视频加载超时",
        detail: "多次等待「加载中」仍未完成（单次最长约 1 分钟，共 3 次），已跳过",
        action: "加载超时，跳过并打开下一个..."
      };
    }
    if (/unavailable/.test(result)) {
      return {
        title: "指定视频链接无效",
        detail: "视频不存在或无法观看，已跳过",
        action: "链接无效，跳过并打开下一个..."
      };
    }
    if (/^nav_miss/.test(result)) {
      return {
        title: "指定视频无法打开",
        detail: "多次未能进入目标视频页，已跳过",
        action: "无法打开目标视频，跳过并打开下一个..."
      };
    }
    if (/^modal_timeout/.test(result)) {
      return {
        title: "指定视频加载失败",
        detail: "精选页长时间未出现详情，已跳过",
        action: "视频加载超时，跳过并打开下一个..."
      };
    }
    return {
      title: "指定视频加载失败",
      detail: "已跳过",
      action: "视频加载失败，跳过并打开下一个..."
    };
  }
  async function skipFailedSpecificVideoAndOpenNext(arg1, arg2, arg3, arg4, text = "modal_timeout") {
    const local = extractSpecificVideoId(arg3) || arg3;
    const result = describeSpecificVideoSkipReason(text);
    console.warn("[Built-in-Debug] [指定视频] " + result.title + " (" + text + "): " + arg3);
    reportTraceLog("⚠️ " + result.title + "：" + clipTraceText(String(local), 40) + " — " + result.detail, null, "warning");
    reportCurrentAction(result.action);
    fn25();
    markSpecificVideoCompletedThisSession(arg3);
    markSpecificVideoHandled(state.processedVideos, arg3, arg4, {
      persistGlobal: false
    });
    markSpecificVideoHandled(state.processedVideos, normalizeSpecificVideoKey(window.location.href), arg4, {
      persistGlobal: false
    });
    clearClaimedSpecificVideoUrl();
    state.sessionProcessedCount += 1;
    const result2 = await ensureClaimedSpecificVideoUrl({
      reuseActive: false,
      advance: true
    });
    if (!result2) {
      console.log("[Built-in-Debug] [指定视频] 跳过后无剩余视频，任务结束");
      reportCurrentAction("指定视频列表已全部处理，任务结束");
      await finishSpecificSourceTask(arg1, arg2, "specific_completed", {
        configuredCount: (window._specificVideoUrls || arg4 || []).length
      });
      return "done";
    }
    state.lastClickedId = normalizeSpecificVideoKey(result2);
    rememberPendingLeadVideoUrl(state.lastClickedId);
    console.log("[Built-in-Debug] [指定视频] 失败后改开下一条: " + result2);
    const result3 = await openSpecificVideoWithRetries(arg1, result2);
    if (result3 === "aborted") {
      return "done";
    }
    if (result3 === "ready") {
      return "advanced";
    }
    reportCurrentAction("精选打开未就绪，改用播放页再试一次…");
    const result4 = await probeSpecificVideoOnDirectPage(arg1, result2);
    if (result4 === "aborted") {
      return "done";
    }
    if (result4 === "ready") {
      return "advanced";
    }
    return skipFailedSpecificVideoAndOpenNext(arg1, arg2, result2, arg4, result3 === "timeout" || result4 === "settled" ? "load_timeout_on_advance" : "unavailable_on_advance");
  }
  function fn52(arg1, arg2 = window._specificVideoUrls) {
    const value = Array.isArray(arg2) ? arg2 : [];
    const value2 = state.currentRunningSource === "specific";
    return value.find(arg12 => {
      if (value2) {
        return !isSpecificVideoCompletedThisSession(arg12);
      }
      return !fn53(arg1, arg12);
    }) || null;
  }
  function usesSpecificVideoPool() {
    return !!state.currentTask?.useGlobalSpecificVideoPool && !!state.currentTask?.leadgenTaskId;
  }
  function clearClaimedSpecificVideoUrl() {
    window._specificClaimedUrl = null;
  }
  async function ensureClaimedSpecificVideoUrl(options = {}) {
    const value = options.reuseActive !== false;
    const flag = !!options.advance;
    if (!usesSpecificVideoPool()) {
      return fn52(state.processedVideos, window._specificVideoUrls);
    }
    if (!flag && window._specificClaimedUrl && !isSpecificVideoCompletedThisSession(window._specificClaimedUrl)) {
      return window._specificClaimedUrl;
    }
    try {
      const result = await ipcRenderer.invoke("claim-leadgen-specific-video", {
        leadgenTaskId: state.currentTask.leadgenTaskId,
        accountId: state.currentTask.accountId,
        reuseActive: flag ? false : value,
        preferredUrl: !flag && value ? window._specificClaimedUrl || "" : ""
      });
      if (result?.error) {
        reportTraceLog("⚠️ 领取指定视频失败：" + result.error);
      }
      window._specificClaimedUrl = result?.url || null;
      if (result?.url && !result.resumed) {
        const local = result.claimed || 0;
        const local2 = result.total || 0;
        reportTraceLog("📋 领取指定视频 " + local + "/" + local2 + "（剩余 " + (result.remaining || 0) + "）");
        reportCurrentAction("领取指定视频 (" + local + "/" + local2 + ")...");
      }
      return window._specificClaimedUrl;
    } catch (error) {
      reportTraceLog("⚠️ 领取指定视频异常：" + (error?.message || error));
      window._specificClaimedUrl = null;
      return null;
    }
  }
  function markSpecificVideoHandled(arg1, arg2, arg3 = window._specificVideoUrls, {
    persistGlobal = true
  } = {}) {
    if (!arg1 || !arg2) {
      return;
    }
    const result = getProcessedVideoKeyModule();
    result.rememberProcessedVideoKey(arg1, arg2);
    const result2 = extractSpecificVideoId(arg2);
    if (result2 && Array.isArray(arg3)) {
      for (const item of arg3) {
        if (extractSpecificVideoId(item) === result2) {
          result.rememberProcessedVideoKey(arg1, item);
        }
      }
    }
    markSpecificVideoCompletedThisSession(arg2);
    if (!persistGlobal) {
      return;
    }
    const local = result.normalizeProcessedVideoKey(arg2) || arg2;
    if (local) {
      ipcRenderer.send("update-processed-videos", {
        url: local,
        title: "指定视频已处理",
        platform: "douyin",
        timestamp: Date.now()
      });
    }
  }
  function getSpecificPlannedVideoCount(arg1, arg2 = window._specificVideoUrls) {
    const value = Array.isArray(arg2) && arg2.length ? arg2 : getSpecificVideoUrlList(arg1);
    return value.length || 1;
  }
  function getPlannedVideoCountForDisplay(arg1 = state.currentRunningSource, arg2 = state.currentTask) {
    if (arg1 === "specific") {
      return getSpecificPlannedVideoCount(arg2);
    }
    return state.targetVideoCount;
  }
  function fn53(arg1, arg2) {
    if (!arg1 || !arg2) {
      return false;
    }
    const result = getProcessedVideoKeyModule();
    if (result.hasProcessedVideoKey(arg1, arg2)) {
      return true;
    }
    const result2 = extractSpecificVideoId(arg2);
    if (!result2) {
      return false;
    }
    for (const item of arg1) {
      if (extractSpecificVideoId(item) === result2) {
        return true;
      }
    }
    return false;
  }
  function fn57(arg1, arg2) {
    if (!arg1 || !arg2) {
      return 0;
    }
    const result = extractSpecificVideoId(arg2);
    const result2 = normalizeSpecificVideoKey(arg2);
    let num = 0;
    for (const item of [...arg1]) {
      const local = item === arg2 || result2 && normalizeSpecificVideoKey(item) === result2 || result && extractSpecificVideoId(item) === result;
      if (local) {
        arg1.delete(item);
        num += 1;
      }
    }
    return num;
  }
  function fn58(arg1, arg2) {
    const result = getSpecificVideoUrlList(arg2);
    if (!result.length) {
      return 0;
    }
    let num = 0;
    for (const item of result) {
      num += fn57(arg1, item);
    }
    return num;
  }
  function initProcessedVideosFromTask(arg1, {
    restart = false,
    resumeSpecific = false
  } = {}) {
    const result = getProcessedVideoKeyModule();
    const result2 = result.initProcessedVideoSet(arg1?.processedVideos || []);
    let num = 0;
    const local = Array.isArray(arg1?.videoSources) && arg1.videoSources.includes("specific");
    if ((restart || resumeSpecific) && local) {
      num = fn58(result2, arg1);
    }
    logTaskDbg("浏览库", "载入 " + result2.size + " 条避重记录", {
      restart: restart,
      resumeSpecific: resumeSpecific,
      specific: local,
      unblockedKeys: num,
      configuredUrls: local ? getSpecificVideoUrlList(arg1).length : 0
    });
    return result2;
  }
  function markTaskRestartFromPayload(arg1) {
    if (!arg1) {
      return false;
    }
    if (arg1.isResume) {
      state.pendingTaskRestart = false;
      delete arg1.isRestart;
      delete arg1.isResume;
      logTaskDbg("继续", "保留会话断点，沿用视频、互动与关键词进度");
      return false;
    }
    if (!arg1.isRestart) {
      delete arg1.isResume;
      return false;
    }
    state.pendingTaskRestart = true;
    try {
      const list = [radarSessionKey(arg1.accountId, arg1.taskId)];
      for (let num = 0; num < localStorage.length; num++) {
        const result = localStorage.key(num);
        if (!result || !result.startsWith("radar_state_" + (arg1.accountId || "default") + "_")) {
          continue;
        }
        const result2 = JSON.parse(localStorage.getItem(result) || "{}");
        if (result2.leadgenTaskId && result2.leadgenTaskId === arg1.leadgenTaskId) {
          list.push(result);
        }
      }
      [...new Set(list)].forEach(arg1 => localStorage.removeItem(arg1));
      const result = legacyRadarSessionKey(arg1.accountId);
      const result2 = JSON.parse(localStorage.getItem(result) || "{}");
      if (result2.loopId === arg1.taskId) {
        localStorage.removeItem(result);
      }
    } catch (error) {}
    delete arg1.isRestart;
    delete arg1.isResume;
    logTaskDbg("重启", "已清除会话断点，将从头运行");
    return true;
  }
  function consumeTaskRestartFlag() {
    if (!state.pendingTaskRestart) {
      return false;
    }
    state.pendingTaskRestart = false;
    return true;
  }
  function isVideoInSpecificList(arg1, arg2 = window._specificVideoUrls) {
    if (!arg1 || !Array.isArray(arg2) || arg2.length === 0) {
      return false;
    }
    const result = normalizeSpecificVideoKey(arg1);
    return arg2.some(arg1 => normalizeSpecificVideoKey(arg1) === result);
  }
  async function finishSpecificSourceTask(arg1, arg2, text = "specific_completed", options = {}) {
    await finalizeAccountTask(arg1, text, options, {
      storageKey: arg2,
      drainAiQueue: true
    });
  }
  return {
    awaitSpecificVideoOpenSettle: awaitSpecificVideoOpenSettle,
    clearClaimedSpecificVideoUrl: clearClaimedSpecificVideoUrl,
    clickCommentPanelLoadingPlaceholder: clickCommentPanelLoadingPlaceholder,
    consumeTaskRestartFlag: consumeTaskRestartFlag,
    convertToDouyinModalUrl: convertToDouyinModalUrl,
    describeSpecificVideoSkipReason: describeSpecificVideoSkipReason,
    ensureClaimedSpecificVideoUrl: ensureClaimedSpecificVideoUrl,
    evaluateSpecificVideoOpenProgress: evaluateSpecificVideoOpenProgress,
    extractSpecificVideoId: extractSpecificVideoId,
    finishSpecificSourceTask: finishSpecificSourceTask,
    getPlannedVideoCountForDisplay: getPlannedVideoCountForDisplay,
    getSpecificPlannedVideoCount: getSpecificPlannedVideoCount,
    getSpecificVideoProbeState: getSpecificVideoProbeState,
    getSpecificVideoUrlList: getSpecificVideoUrlList,
    hasSpecificVideoTargetInUrl: hasSpecificVideoTargetInUrl,
    hasVideoMainCommented: hasVideoMainCommented,
    initProcessedVideosFromTask: initProcessedVideosFromTask,
    initVideoMainCommentMemoryFromTask: initVideoMainCommentMemoryFromTask,
    isDouyinJingxuanContentLoading: isDouyinJingxuanContentLoading,
    isDouyinSearchPageContentLoading: isDouyinSearchPageContentLoading,
    isDouyinSpecificVideoUnavailable: isDouyinSpecificVideoUnavailable,
    isDouyinVisibleLoadingPlaceholder: isDouyinVisibleLoadingPlaceholder,
    isOnSpecificTargetVideo: isOnSpecificTargetVideo,
    isSpecificVideoCompletedThisSession: isSpecificVideoCompletedThisSession,
    isSpecificVideoDetailReady: isSpecificVideoDetailReady,
    isVideoInSpecificList: isVideoInSpecificList,
    loadSpecificVideoState: loadSpecificVideoState,
    markSpecificVideoCompletedThisSession: markSpecificVideoCompletedThisSession,
    markSpecificVideoHandled: markSpecificVideoHandled,
    markTaskRestartFromPayload: markTaskRestartFromPayload,
    normalizeSpecificVideoKey: normalizeSpecificVideoKey,
    openSpecificVideoWithRetries: openSpecificVideoWithRetries,
    probeSpecificVideoOnDirectPage: probeSpecificVideoOnDirectPage,
    rememberVideoMainComment: rememberVideoMainComment,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    saveSpecificVideoState: saveSpecificVideoState,
    shouldBypassSpecificBrowseDedup: shouldBypassSpecificBrowseDedup,
    shouldReprocessConfiguredSpecific: shouldReprocessConfiguredSpecific,
    skipFailedSpecificVideoAndOpenNext: skipFailedSpecificVideoAndOpenNext,
    toSpecificVideoDirectUrl: toSpecificVideoDirectUrl,
    toSpecificVideoJingxuanUrl: toSpecificVideoJingxuanUrl,
    usesSpecificVideoPool: usesSpecificVideoPool,
    waitSpecificVideoNavAppear: waitSpecificVideoNavAppear
  };
}
module.exports = {
  createSpecificVideoNavigationController: createSpecificVideoNavigationController
};
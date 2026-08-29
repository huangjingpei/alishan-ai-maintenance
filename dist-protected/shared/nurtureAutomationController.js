'use strict';

const {
  runNurtureKeywordSearchWatchRound
} = require("./nurtureKeywordSearchTasks");
const {
  nurtureEngageCurrentVideo,
  resolveNurtureEngageAfterMs
} = require("./nurtureVideoEngageTasks");
function createNurtureAutomationController(options = {}) {
  const {
    DOUYIN_RECOMMEND_URL: douyinRecommendUrl,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    PLATFORM_SELECTORS: platformSelectors,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    buildAutomationAiPayload: buildAutomationAiPayload,
    buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    cleanTitle: cleanTitle,
    clearPendingLeadVideoUrl: clearPendingLeadVideoUrl,
    clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
    clipTraceText: clipTraceText,
    closeAllModals: closeAllModals,
    collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
    ensureCommentPanelOpen: ensureCommentPanelOpen,
    ensureDouyinRecommendFeed: ensureDouyinRecommendFeed,
    extractSpecificVideoId: extractSpecificVideoId,
    getCommentV2String: getCommentV2String,
    getVideoEngagePack: getVideoEngagePack,
    getDouyinFeedScope: getDouyinFeedScope,
    getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
    getFeedVideoIdentity: getFeedVideoIdentity,
    getVideoTitle: getVideoTitle,
    getVisibleCommentNodeCount: getVisibleCommentNodeCount,
    getVisibleDouyinVideoDurationMs: getVisibleDouyinVideoDurationMs,
    hasFeedLiveEnterHint: hasFeedLiveEnterHint,
    ipcRenderer: ipcRenderer,
    isElementInFeedCenter: isElementInFeedCenter,
    isOnDouyinFollowPage: isOnDouyinFollowPage,
    isOnDouyinRecommendPage: isOnDouyinRecommendPage,
    isOnUserProfilePage: isOnUserProfilePage,
    isVisibleElement: isVisibleElement,
    moveToNextVideo: moveToNextVideo,
    normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
    openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
    pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
    performRandomWandering: performRandomWandering,
    randomDelay: randomDelay,
    reportCurrentAction: reportCurrentAction,
    reportTraceLog: reportTraceLog,
    resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
    resolveLeadVideoUrl: resolveLeadVideoUrl,
    resumeVisibleDouyinVideos: resumeVisibleDouyinVideos,
    sampleVisibleCommentTexts: sampleVisibleCommentTexts,
    sessionStorage: sessionStorage,
    setSearchPendingOpenUrl: setSearchPendingOpenUrl,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    sleep: sleep,
    startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
    suspendAutomationForNavigation: suspendAutomationForNavigation,
    waitForFeedItemChange: waitForFeedItemChange,
    waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
    waitForDouyinSearchContentAfterZero: waitForDouyinSearchContentAfterZero,
    prepareSearchPageReload: prepareSearchPageReload,
    state: state
  } = options;
  const local = () => typeof getDouyinRecommendUrl === "function" ? getDouyinRecommendUrl() : douyinRecommendUrl;
  const num = 14;
  const num2 = 3;
  const num3 = 4;
  const num4 = 20;
  function fn(arg1, arg2) {
    if (!arg2 || !arg1) {
      return;
    }
    if (!Array.isArray(arg1.recentSkipKeys)) {
      arg1.recentSkipKeys = [];
    }
    arg1.recentSkipKeys.push({
      key: arg2,
      at: Date.now()
    });
    if (arg1.recentSkipKeys.length > num) {
      arg1.recentSkipKeys = arg1.recentSkipKeys.slice(-num);
    }
  }
  function fn2(arg1, arg2) {
    const result = (arg1.recentSkipKeys || []).map(arg1 => arg1?.key).filter(Boolean);
    if (!arg2 || result.length < 3) {
      return false;
    }
    if (arg2.includes("未知视频") || arg2.includes("feed:na::")) {
      return false;
    }
    const value = result.filter(arg1 => arg1 === arg2).length;
    if (value >= num2) {
      return true;
    }
    const result2 = result.slice(-3);
    const list = [...new Set(result2)];
    return list.length === 2 && result2.length === 3;
  }
  async function fn3(arg1, arg2, text = "打破视频来回切换") {
    console.warn("[Built-in-Debug] [养号] " + text + "，强制刷新推荐流");
    reportTraceLog("🔄 养号：" + text + "，刷新推荐流");
    if (arg2) {
      arg2.recentSkipKeys = [];
      arg2.nurtureLiveSkipStreak = 0;
      arg2.nurtureLastLiveKey = "";
      delete arg2.lastNurtureVideoDecision;
      try {
        sessionStorage.setItem(getNurtureStateKey(), JSON.stringify(arg2));
      } catch (error) {}
    }
    window.location.href = local();
    await randomDelay(4000, 6500, arg1, "刷新推荐流");
    return {
      switched: true,
      reloaded: true
    };
  }
  async function fn5(arg1, arg2, {
    reason = "切换视频",
    aggressive = true
  } = {}) {
    if (shouldAbort(arg1)) {
      return {
        switched: false
      };
    }
    const result = fn6();
    const result2 = getFeedVideoIdentity();
    fn(arg2, result);
    delete arg2.lastNurtureVideoDecision;
    if (fn2(arg2, result)) {
      return fn3(arg1, arg2, "检测到反复回到同一视频");
    }
    for (let num = 0; num < 5; num++) {
      await moveToNextVideo(arg1, {
        aggressive: aggressive || num > 0
      });
      await randomDelay(700, 1400, arg1, reason);
      await waitForFeedItemChange(arg1, result2, num === 0 ? 8 : 10);
      if (isDouyinFeedLiveStream()) {
        const local = getFeedVideoIdentity() || getVideoTitle() || fn6();
        if (local && local === arg2.nurtureLastLiveKey) {
          arg2.nurtureLiveSkipStreak = (arg2.nurtureLiveSkipStreak || 0) + 1;
        } else {
          arg2.nurtureLiveSkipStreak = 1;
          arg2.nurtureLastLiveKey = local;
        }
        const value = (arg2.nurtureLiveSkipStreak || 0) >= num3;
        await skipDouyinFeedLiveStream(arg1, {
          forceReload: value
        });
        if (value) {
          arg2.nurtureLiveSkipStreak = 0;
          arg2.nurtureLastLiveKey = "";
        }
        await randomDelay(900, 1800, arg1, "跳过直播后继续");
        const result2 = fn6();
        if (result2 && result2 !== result && !isDouyinFeedLiveStream()) {
          return {
            switched: true,
            reloaded: value
          };
        }
        continue;
      }
      arg2.nurtureLiveSkipStreak = 0;
      arg2.nurtureLastLiveKey = "";
      const result3 = fn6();
      const result4 = getFeedVideoIdentity();
      if (result3 && result3 !== result || result4 && result4 !== result2) {
        return {
          switched: true,
          reloaded: false
        };
      }
    }
    return fn3(arg1, arg2, "多次切换仍未离开当前视频");
  }
  function fn9(arg1, arg2, text = "nurture_completed") {
    return {
      taskId: arg1,
      taskMode: "nurture",
      accountId: window._radar_account_id,
      reason: text,
      progress: {
        videos: {
          planned: null,
          done: arg2.videosWatched || 0
        },
        nurture: {
          totalMin: arg2.totalMinutes,
          actionsDone: arg2.actionsDone || 0
        }
      }
    };
  }
  function getNurtureStateKey() {
    return "nurture_state_" + (window._radar_account_id || "default");
  }
  function reportNurtureProgress(arg1, arg2, arg3, arg4) {
    const result = Math.max(1, Math.ceil((arg1.endTime - Date.now()) / 60000));
    reportCurrentAction(arg3 || "养号中：剩余约 " + result + " 分钟");
    if (arg4) {
      reportTraceLog(arg4);
    }
    try {
      ipcRenderer.send("automation-data", {
        type: "nurture-progress",
        payload: {
          accountId: window._radar_account_id,
          videosWatched: arg1.videosWatched || 0,
          remainingMin: result,
          totalMin: arg1.totalMinutes,
          action: arg3 || "养号中：剩余约 " + result + " 分钟",
          log: arg4 || null
        }
      });
    } catch (error) {}
  }
  function fn11(arg1) {
    if (Array.isArray(arg1)) {
      return arg1.map(arg1 => String(arg1).trim()).filter(Boolean);
    }
    return String(arg1 || "").split(/[,，、\s\n]+/).map(arg1 => arg1.trim()).filter(arg1 => arg1.length > 0);
  }
  const list = ["创业", "副业", "赚钱", "挣钱", "合伙人", "合作", "项目", "轻创业", "打工", "内卷", "搞钱", "兼职", "宝妈", "在家赚钱", "时间灵活", "大学生", "实习", "求职", "转行", "技能学习", "考证", "开店", "做生意", "小老板", "个体户", "引流", "获客", "私域", "降本增效", "装修", "翻新", "全屋定制", "设计", "报价", "工期", "教育", "培训", "择校", "报班", "护肤", "美甲", "美睫", "轻医美", "变美", "买车", "汽车", "车型", "贷款", "二手车", "买房", "租房", "楼盘", "学区", "首付", "本地生活", "同城", "家政", "维修", "摄影", "餐饮", "宠物", "电商", "带货", "拿货", "分销", "供应链", "直播合作", "软件开发", "系统定制", "自动化工具", "养生", "睡眠", "调理", "保健", "体重管理", "理财", "基金", "保险", "资产增值", "内存卡", "SD卡", "TF卡", "数码", "闲置", "批发"];
  const list2 = ["识别", "用户", "评论", "引导", "私信", "专业", "真诚", "需求", "目标人群", "回复", "策略", "风格", "身份", "目的", "要求", "控制", "以内", "适合", "智能体", "人群"];
  function fn12(arg1) {
    const set = new Set();
    const list = [];
    for (const item of arg1 || []) {
      const result = String(item || "").trim();
      if (!result || set.has(result)) {
        continue;
      }
      set.add(result);
      list.push(result);
    }
    return list;
  }
  function fn13(arg1) {
    return String(arg1 || "").replace(/[【】「」"'“”]/g, " ").split(/[，,。；;、\s/（）()：:·|+-]+/).map(arg1 => arg1.trim()).filter(arg1 => arg1.length >= 2 && arg1.length <= 8).filter(arg1 => !list2.some(arg12 => arg1.includes(arg12)));
  }
  function fn14(arg1, list2 = []) {
    if (!arg1) {
      return fn12(list2).slice(0, 12);
    }
    const result = [arg1.name, arg1.subtitle, arg1.role, arg1.goal, arg1.style, arg1.prompt, arg1.videoGoal, arg1.firstPostGoal].filter(Boolean).join(" ");
    const result2 = list.filter(arg1 => result.includes(arg1));
    const result3 = fn13((arg1.name || "") + " " + (arg1.subtitle || ""));
    const result4 = fn13((arg1.goal || "") + " " + (arg1.prompt || ""));
    return fn12([...result2, ...result3, ...result4, ...list2]).slice(0, 12);
  }
  function fn15(arg1, options = {}) {
    const value = Array.isArray(arg1?.nurtureKeywords) && arg1.nurtureKeywords.length ? arg1.nurtureKeywords : fn11(arg1?.keywords || options.personaKeywords);
    if (arg1?.nurtureStrategy === "persona") {
      const result = fn14(arg1.nurturePersona, value);
      if (result.length) {
        return result;
      }
    }
    return fn11(value);
  }
  function fn16(arg1, arg2) {
    const result = String(arg1 || "");
    if (!result || !arg2?.length) {
      return [];
    }
    return arg2.filter(arg1 => arg1 && result.includes(arg1));
  }
  function fn17() {
    const local = getDouyinFeedScope() || document;
    const local2 = local.querySelector("[data-e2e=\"video-desc\"]")?.innerText || "";
    const local3 = local.querySelector("[data-e2e=\"feed-video-nickname\"]")?.innerText || "";
    return (local2 + " " + local3).trim();
  }
  function fn6() {
    const local = getDouyinFeedScope() || document;
    return resolveLeadVideoUrl("", local) || getFeedVideoIdentity(local) || getVideoTitle() || fn17() || "未知视频";
  }
  function fn18(arg1 = state.currentTask) {
    const local = arg1?.nurturePersona || {};
    const result = [local.name, local.subtitle, local.role, local.goal, local.style, local.prompt, local.videoGoal, local.firstPostGoal].filter(Boolean).join("；");
    const value = Array.isArray(arg1?.nurtureKeywords) ? arg1.nurtureKeywords.join("、") : String(arg1?.keywords || "");
    return {
      aiRole: "抖音养号标签校准专家",
      aiGoal: "判断当前推荐视频是否适合用于校准账号人设标签：" + (local.name || arg1?.nurturePersonaName || "未命名人设"),
      aiStyle: result || value || "判断视频是否符合账号养号方向",
      aiPrompt: (result || "") + "\n养号标签关键词：" + value + "\n只放行明显有助于平台理解账号兴趣方向的视频；泛娱乐、无关、直播、硬广、低质搬运内容应判为不匹配。"
    };
  }
  async function fn19(arg1, arg2) {
    const result = fn6();
    if (arg2.lastNurtureVideoDecision?.key === result) {
      return arg2.lastNurtureVideoDecision;
    }
    const local = arg2.interestKeywords || [];
    const local2 = fn17() || getVideoTitle() || "未知视频";
    const result2 = fn16(local2, local);
    pauseVisibleDouyinVideos(document, "养号进入视频后先暂停，等待人设匹配判断");
    let local3 = null;
    if (result2.length > 0) {
      local3 = {
        success: true,
        pass: true,
        score: 90,
        reason: "命中人设标签：" + result2.join("、"),
        matched: result2,
        source: "local-keyword"
      };
      reportTraceLog("🎯 养号人设预筛：本地命中「" + result2.join("、") + "」，准备完播");
    } else {
      try {
        const result = sampleVisibleCommentTexts(document, 4);
        reportTraceLog("🎯 养号人设预筛：暂停视频，提交 AI 判断《" + clipTraceText(local2, 40) + "》…");
        const result2 = await ipcRenderer.invoke("ai-match-video-context", buildAutomationAiPayload({
          videoTitle: local2,
          comments: result,
          keywords: local.join(","),
          authorNickname: "",
          matchScene: "nurture",
          withMainPost: false,
          config: fn18(arg2.currentTask)
        }));
        if (shouldAbort(arg1)) {
          throw new Error("TASK_ABORTED");
        }
        local3 = {
          ...(result2 || {}),
          pass: result2?.pass !== false,
          matched: [],
          source: "ai",
          reason: result2?.reason || (result2?.pass === false ? "AI 判断不匹配" : "AI 判断匹配")
        };
        reportTraceLog("🎯 养号人设预筛：AI " + (local3.pass ? "通过" : "跳过") + "（" + clipTraceText(local3.reason, 70) + "）");
      } catch (error) {
        if (error.message === "TASK_ABORTED") {
          throw error;
        }
        local3 = {
          success: false,
          pass: false,
          score: 0,
          reason: "AI 判断异常，未确认匹配：" + clipTraceText(error.message || error, 60),
          matched: [],
          source: "ai-error"
        };
        reportTraceLog("🎯 养号人设预筛异常：" + clipTraceText(error.message || error, 80) + "，本视频快速跳过");
      }
    }
    arg2.lastNurtureVideoDecision = {
      ...local3,
      key: result,
      at: Date.now()
    };
    if (!local3.pass) {
      arg2.videosSkipped = (arg2.videosSkipped || 0) + 1;
      reportNurtureProgress(arg2, arg1, "养号：视频不符合人设，快速跳过...", "⏭️ 养号：人设不匹配，跳过当前视频（" + clipTraceText(local3.reason, 60) + "）");
    } else {
      arg2.lastVideoKeywordHit = local3.matched?.length ? local3.matched : ["AI匹配"];
    }
    return arg2.lastNurtureVideoDecision;
  }
  function fn20(flag = false) {
    const local = getDouyinFeedScope() || document;
    const result = getVisibleDouyinVideoDurationMs(local);
    if (flag && result > 0) {
      const result2 = Math.max(8000, Math.min(240000, Math.round(result * 0.92)));
      const result3 = Math.max(result2 + 1200, Math.min(300000, Math.round(result * 1.12)));
      return {
        minMs: result2,
        maxMs: result3,
        durationMs: result
      };
    }
    if (result > 0) {
      const result2 = Math.max(6000, Math.min(45000, Math.round(result * 0.55)));
      const result3 = Math.max(result2 + 1000, Math.min(65000, Math.round(result * 0.85)));
      return {
        minMs: result2,
        maxMs: result3,
        durationMs: result
      };
    }
    if (flag) {
      return {
        minMs: 24000,
        maxMs: 52000,
        durationMs: 0
      };
    } else {
      return {
        minMs: 8000,
        maxMs: 25000,
        durationMs: 0
      };
    }
  }
  async function fn21(arg1, arg2) {
    const local = getDouyinFeedScope() || document;
    const result = Array.from(local.querySelectorAll("[data-e2e*=\"share\"], [aria-label*=\"分享\"], button, div, span, a")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const value = (arg1.getAttribute("aria-label") || "") + " " + (arg1.getAttribute("title") || "") + " " + (arg1.getAttribute("data-e2e") || "") + " " + (arg1.innerText || "");
      if (!/分享|share/i.test(value)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      return result.width > 0 && result.height > 0;
    }).sort((arg1, arg2) => {
      const result = arg1.getBoundingClientRect();
      const result2 = arg2.getBoundingClientRect();
      return result2.left - result.left || result.top - result2.top;
    });
    const value = result[0];
    if (!value) {
      reportTraceLog("养号：未找到分享按钮，跳过分享模拟");
      return false;
    }
    reportNurtureProgress(arg2, arg1, "养号：模拟打开分享面板...", "↗️ 养号：打开分享面板，增强兴趣信号");
    await simulateHumanClick(value.closest("button, a, [role=\"button\"]") || value, arg1);
    await randomDelay(900, 1800, arg1, "分享面板停留");
    if (Math.random() < 0.45) {
      const result = Array.from(document.querySelectorAll("button, div, span, a, [role=\"button\"]")).find(arg1 => isVisibleElement(arg1) && /复制链接|复制口令|复制/.test((arg1.innerText || arg1.getAttribute("aria-label") || "").trim()));
      if (result) {
        await simulateHumanClick(result.closest("button, a, [role=\"button\"]") || result, arg1);
        await randomDelay(500, 1000, arg1, "复制分享链接");
        reportTraceLog("↗️ 养号：已模拟复制分享链接");
      }
    }
    await fn22(arg1);
    arg2.shareActions = (arg2.shareActions || 0) + 1;
    await randomDelay(600, 1200, arg1, "关闭分享面板");
    return true;
  }
  function fn23(arg1, arg2, num = 0) {
    if (!arg1 || !arg2?.length) {
      return [];
    }
    const list = [];
    const result = arg1.querySelectorAll(platformSelectors["douyin.com"].commentItem);
    const value = num > 0 ? Math.min(num, result.length) : result.length;
    for (let num = 0; num < value; num++) {
      const value = result[num];
      const result2 = fn16(value.innerText || "", arg2);
      if (result2.length) {
        list.push(...result2);
      }
    }
    return [...new Set(list)];
  }
  async function fn22(arg1) {
    window.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      keyCode: 27,
      bubbles: true
    }));
    await sleep(400);
  }
  async function fn24(arg1) {
    if (isOnDouyinRecommendPage()) {
      return true;
    }
    reportTraceLog("养号：返回推荐流");
    if (window.history.length > 1) {
      window.history.back();
      await randomDelay(2500, 4000, arg1, "返回推荐流");
    }
    if (!isOnDouyinRecommendPage()) {
      window.location.href = local();
      await randomDelay(3500, 5500, arg1, "加载推荐流");
    }
    return isOnDouyinRecommendPage();
  }
  async function nurtureWatchCurrentVideo(arg1, arg2, options = {}) {
    const flag = !!options.forceComplete;
    const flag2 = !!options.fromSearch;
    const local = arg2.interestKeywords || [];
    const result = fn6();
    const result2 = fn17();
    const result3 = fn16(result2, local);
    const value = arg2.nurtureStrategy === "persona";
    const value2 = (parseInt(arg2.currentTask?.stayMin, 10) || 8) * 1000;
    const value3 = (parseInt(arg2.currentTask?.stayMax, 10) || 25) * 1000;
    let local2 = value2;
    let local3 = value3;
    let local4 = null;
    if (value && !flag) {
      local4 = await fn19(arg1, arg2);
      if (local4?.pass === false) {
        return {
          skipped: true,
          reason: local4.reason || "人设不匹配"
        };
      }
    }
    if (flag || value && local4?.pass !== false) {
      const result = fn20(true);
      local2 = result.minMs;
      local3 = result.maxMs;
      const value = flag2 ? "搜索词「" + clipTraceText(arg2.searchKeyword || local[0] || "", 24) + "」" : local4?.reason || (result3.length ? "命中「" + result3.join("、") + "」" : "AI 判断匹配");
      reportNurtureProgress(arg2, arg1, flag2 ? "养号：搜索视频完播中..." : "养号：人设匹配，准备完播...", flag2 ? "📺 养号：完播搜索视频（" + value + "）" : "🎯 养号：人设匹配，完播当前视频（" + clipTraceText(value, 60) + "）");
    } else if (result3.length > 0) {
      const result = fn20(false);
      local2 = Math.max(result.minMs, value2 + 12000);
      local3 = Math.max(result.maxMs, value3 + 22000);
      arg2.lastVideoKeywordHit = result3;
      reportNurtureProgress(arg2, arg1, "养号：命中「" + result3[0] + "」，延长观看...", "🎯 养号：视频命中「" + result3.join("、") + "」，延长停留");
    } else {
      arg2.lastVideoKeywordHit = null;
      reportNurtureProgress(arg2, arg1, "养号：观看视频中...", "📺 养号：模拟观看当前视频");
    }
    const local5 = getDouyinFeedScope() || document;
    resumeVisibleDouyinVideos(local5, "人设匹配后恢复播放以完成观看");
    const local6 = Number(getVisibleDouyinVideoDurationMs(local5) || 0) || 0;
    const result4 = Math.max(800, resolveNurtureEngageAfterMs(local6, local2));
    const result5 = Math.max(1200, local2 - result4);
    const result6 = Math.max(result5 + 800, local3 - result4);
    if (local6 > 0) {
      reportTraceLog("⏱ 养号：视频约 " + (local6 / 1000).toFixed(1) + " 秒，先看 " + (result4 / 1000).toFixed(1) + " 秒再互动");
    }
    await randomDelay(result4, result4 + 800, arg1, "观看后互动前停顿");
    if (!shouldAbort(arg1)) {
      try {
        await nurtureEngageCurrentVideo(arg1, arg2, {
          shouldAbort: shouldAbort,
          randomDelay: randomDelay,
          reportNurtureProgress: reportNurtureProgress,
          reportTraceLog: reportTraceLog,
          reportCurrentAction: reportCurrentAction,
          simulateHumanClick: simulateHumanClick,
          isVisibleElement: isVisibleElement,
          getDouyinFeedScope: getDouyinFeedScope,
          getVideoEngagePack: getVideoEngagePack,
          getVisibleDouyinVideoDurationMs: getVisibleDouyinVideoDurationMs,
          pauseVisibleDouyinVideos: pauseVisibleDouyinVideos,
          resumeVisibleDouyinVideos: resumeVisibleDouyinVideos,
          startCurrentVideoPauseGuard: startCurrentVideoPauseGuard,
          sleep: sleep
        });
      } catch (error) {
        if (error?.message === "TASK_ABORTED") {
          throw error;
        }
        console.warn("[养号] 视频互动异常:", error?.message || error);
        reportTraceLog("养号：视频互动跳过（" + clipTraceText(error?.message || error, 48) + "）");
      }
    }
    if (!shouldAbort(arg1)) {
      resumeVisibleDouyinVideos(local5, "互动后继续观看");
      await randomDelay(result5, result6, arg1, flag || value ? "视频完播" : result3.length ? "兴趣视频观看" : "观看视频");
    }
    arg2.videosWatched = (arg2.videosWatched || 0) + 1;
    if (value && local4?.pass !== false && Math.random() < 0.32) {
      await fn26(arg1, arg2, {
        personaFocus: true,
        maxComments: num4
      });
    }
    const result7 = fn6();
    return {
      skipped: false,
      switchedDuringWatch: !!result && !!result7 && result !== result7,
      personaMatched: !!value && local4?.pass !== false
    };
  }
  async function fn26(arg1, arg2, {
    personaFocus = false,
    maxComments = 0
  } = {}) {
    const local = arg2.interestKeywords || [];
    const value = arg2.nurtureStrategy === "persona";
    const value2 = personaFocus || value ? maxComments > 0 ? maxComments : num4 : 0;
    const result = await ensureCommentPanelOpen(document.body, arg1);
    if (!result) {
      reportTraceLog("养号：评论区未能打开，跳过");
      return [];
    }
    const result2 = document.querySelector(platformSelectors["douyin.com"].commentPanel);
    const result3 = fn23(result2, local, value2);
    let value3 = personaFocus ? 0 : 2 + Math.floor(Math.random() * 3);
    let value4 = personaFocus ? 500 : 1200;
    let value5 = personaFocus ? 1000 : 2200;
    if (personaFocus) {
      reportNurtureProgress(arg2, arg1, "养号：人设匹配，快速浏览前 " + value2 + " 条评论...", "💬 养号：人设视频已完播，仅浏览前 " + value2 + " 条评论");
    } else if (result3.length > 0) {
      value3 += 3;
      value4 = 2500;
      value5 = 5000;
      reportNurtureProgress(arg2, arg1, "养号：评论命中「" + result3[0] + "」，多看一会...", "🎯 养号：评论命中「" + result3.join("、") + "」，延长浏览");
    } else if (value) {
      value3 = 1;
      value4 = 600;
      value5 = 1200;
      reportNurtureProgress(arg2, arg1, "养号：快速浏览前 " + (value2 || num4) + " 条评论...", "💬 养号：仅浏览前 " + (value2 || num4) + " 条评论后返回");
    } else {
      reportNurtureProgress(arg2, arg1, "养号：浏览评论区...", "💬 养号：打开评论区浏览");
    }
    if (result2) {
      const value = personaFocus ? 1 : value3;
      for (let num = 0; num < value; num++) {
        if (shouldAbort(arg1)) {
          break;
        }
        if (personaFocus) {
          const result = getVisibleCommentNodeCount(result2);
          if (result >= (value2 || num4)) {
            break;
          }
        }
        result2.scrollTop += personaFocus ? 60 + Math.floor(Math.random() * 80) : 100 + Math.floor(Math.random() * 220);
        await randomDelay(value4, value5, arg1, personaFocus ? "人设快速浏览评论" : result3.length ? "兴趣评论浏览" : "浏览评论");
      }
    }
    await fn22(arg1);
    await randomDelay(personaFocus ? 400 : 800, personaFocus ? 900 : 1500, arg1, "关闭评论");
    return result3;
  }
  async function fn27(arg1, arg2, text = "author") {
    let local = null;
    if (text === "author") {
      const local2 = getDouyinFeedScope() || document;
      const result = local2.querySelector("[data-e2e=\"feed-video-nickname\"]");
      local = result?.closest("a[href*=\"/user/\"]") || local2.querySelector("a[href*=\"/user/\"]");
      reportNurtureProgress(arg2, arg1, "养号：查看博主主页...", "👤 养号：进入博主主页浏览");
    } else {
      reportNurtureProgress(arg2, arg1, "养号：查看评论用户主页...", "👥 养号：进入评论用户主页");
      await ensureCommentPanelOpen(document.body, arg1);
      const result = Array.from(document.querySelectorAll(platformSelectors["douyin.com"].commentItem)).slice(0, arg2?.nurtureStrategy === "persona" ? num4 : 12);
      const value = result[Math.floor(Math.random() * Math.max(result.length, 1))];
      local = value?.querySelector("a[href*=\"/user/\"]");
      await fn22(arg1);
    }
    if (!local?.href || local.href.includes("/user/self")) {
      return;
    }
    await simulateHumanClick(local, arg1);
    await randomDelay(3500, 5500, arg1, "加载主页");
    if (!isOnUserProfilePage()) {
      return;
    }
    await performRandomWandering(8000 + Math.floor(Math.random() * 12000));
    await fn24(arg1);
  }
  function isDouyinFullLivePage(arg1 = window.location.href) {
    try {
      const result = String(arg1 || "");
      return /live\.douyin\.com/i.test(result) || /\/live\//i.test(result) || /webcast/i.test(result);
    } catch (error) {
      return false;
    }
  }
  function fn29(arg1 = window.location.href) {
    return isDouyinFullLivePage(arg1);
  }
  function isDouyinFeedInlineContext() {
    const result = getDouyinFeedScope();
    if (result && isVisibleElement(result)) {
      return true;
    }
    if (!isOnDouyinRecommendPage() && !isOnDouyinFollowPage()) {
      return false;
    }
    return !!document.querySelector("[data-e2e=\"feed-active-video\"], [data-e2e=\"video-switch-next-btn\"], [data-e2e=\"video-switch-next-arrow\"]");
  }
  function fn31() {
    if (fn29()) {
      return true;
    }
    if (hasFeedLiveEnterHint()) {
      return true;
    }
    return isDouyinFeedLiveStream();
  }
  const set = new Set(["live-player", "webcast-player", "feed-live", "live-room", "live-video", "browse-live"]);
  function fn32(arg1) {
    if (!arg1) {
      return false;
    }
    const result = String(arg1).toLowerCase();
    if (set.has(result)) {
      return true;
    }
    return /(^|[-_])(live|webcast)([-_]|$)/.test(result);
  }
  function isDouyinLiveStreamTitle(arg1) {
    const result = String(arg1 || "").trim();
    if (!result || result.length > 120) {
      return false;
    }
    if (/的抖音直播间(?:直播)?$/.test(result)) {
      return true;
    }
    if (/抖音直播间直播$/.test(result)) {
      return true;
    }
    if (/^正在直播/.test(result)) {
      return true;
    }
    return false;
  }
  function fn34(arg1) {
    if (!arg1?.querySelectorAll) {
      return false;
    }
    let flag = false;
    const result = arg1.querySelectorAll("a[href*=\"/live/\"], a[href*=\"webcast\"], a[href*=\"live.douyin.com\"]");
    for (const item of result) {
      if (!isVisibleElement(item) || !isElementInFeedCenter(item)) {
        continue;
      }
      const result = (item.innerText || item.getAttribute("aria-label") || "").trim();
      if (/进入直播间|点击进入直播|观看直播/.test(result)) {
        flag = true;
        break;
      }
      const result2 = item.getBoundingClientRect();
      if (result2.width >= 120 && result2.height >= 90) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      for (const item of arg1.querySelectorAll("[data-e2e]")) {
        if (!isElementInFeedCenter(item)) {
          continue;
        }
        if (fn32(item.getAttribute("data-e2e"))) {
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      const result = arg1.querySelectorAll("span, div, a, button, [class*=\"badge\"], [class*=\"Badge\"], [class*=\"tag\"], [class*=\"Tag\"]");
      for (const item of result) {
        if (!isVisibleElement(item) || !isElementInFeedCenter(item)) {
          continue;
        }
        const result = (item.innerText || "").trim();
        if (!result) {
          continue;
        }
        if (/^(直播中|直播|连麦中)$/.test(result)) {
          flag = true;
          break;
        }
        if (/进入直播间/.test(result) && result.length <= 40) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }
  function isDouyinFeedLiveStream(arg1 = getDouyinFeedScope()) {
    if (isDouyinFullLivePage() && !isDouyinFeedInlineContext()) {
      return true;
    }
    const value = arg1 && isVisibleElement(arg1) ? arg1 : getDouyinFeedScope();
    if (hasFeedLiveEnterHint(value)) {
      return true;
    }
    const result = getVideoTitle();
    if (isDouyinLiveStreamTitle(result)) {
      return true;
    }
    const local = value?.querySelector?.("[data-e2e=\"video-desc\"]") || document.querySelector("[data-e2e=\"feed-active-video\"] [data-e2e=\"video-desc\"]") || document.querySelector("[data-e2e=\"video-desc\"]");
    const result2 = cleanTitle(local?.innerText || "");
    if (isDouyinLiveStreamTitle(result2)) {
      return true;
    }
    if (!value) {
      return false;
    }
    const result3 = fn34(value);
    if (!result3) {
      return false;
    }
    const result4 = getCommentV2String("openCommentBtns");
    let flag = false;
    if (result4) {
      try {
        flag = !!value.querySelector(result4);
      } catch (error) {}
    }
    const local2 = !!value.querySelector("[data-e2e=\"video-desc\"]") || !!flag;
    const flag2 = !!value.querySelector("a[href*=\"/live/\"], a[href*=\"webcast\"]");
    if (local2 && !flag2 && !isDouyinLiveStreamTitle(result2)) {
      return false;
    }
    return true;
  }
  async function fn35(arg1) {
    const list = ["[data-e2e=\"close\"]", "[aria-label=\"关闭\"]", "[aria-label=\"close\"]", ".semi-modal-close", "[class*=\"close-btn\"]", "[class*=\"Close\"]"];
    for (const item of list) {
      const result = Array.from(document.querySelectorAll(item)).filter(isVisibleElement);
      for (const item of result.slice(0, 2)) {
        try {
          await simulateHumanClick(item, arg1);
          await sleep(250);
        } catch (error) {}
      }
    }
    document.body.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      which: 27,
      bubbles: true
    }));
  }
  async function skipDouyinFeedLiveStream(arg1, {
    forceReload = false
  } = {}) {
    clearPendingLeadVideoUrl();
    await fn35(arg1);
    const result = getFeedVideoIdentity();
    const result2 = isDouyinFeedInlineContext();
    if (forceReload) {
      console.warn("[Built-in-Debug] [推荐流] 连续跳过直播间失败，强制刷新推荐流");
      reportCurrentAction("直播间跳过受阻，正在刷新推荐页...");
      window.location.href = local();
      await randomDelay(4000, 6500, arg1, "刷新推荐流");
      return;
    }
    if (isDouyinFullLivePage() && !result2) {
      await ensureDouyinRecommendFeed(arg1);
      await randomDelay(2500, 4000, arg1, "离开直播间");
      return;
    }
    console.log("[Built-in-Debug] [推荐流] 内嵌直播卡片，滑动切换下一条");
    await moveToNextVideo(arg1);
    await randomDelay(1200, 2200, arg1, "跳过直播");
    const result3 = await waitForFeedItemChange(arg1, result);
    if (!result3) {
      console.warn("[Built-in-Debug] [推荐流] 首次滑动未离开直播，重试加强切换");
      await moveToNextVideo(arg1, {
        aggressive: true
      });
      await randomDelay(1500, 2800, arg1, "重试跳过直播");
      await waitForFeedItemChange(arg1, result, 8);
    }
  }
  async function fn36(arg1, arg2) {
    const result = Array.from(document.querySelectorAll("a, span, p, div[role=\"tab\"], li")).find(arg12 => {
      if (!isVisibleElement(arg12)) {
        return false;
      }
      const result = (arg12.innerText || "").trim();
      return result === arg1 && result.length <= 4;
    });
    if (!result) {
      return false;
    }
    const local = result.closest("a") || result;
    await simulateHumanClick(local, arg2);
    await randomDelay(3500, 5500, arg2, "打开" + arg1);
    return true;
  }
  async function fn37(arg1) {
    await sleep(1500);
    const result = Array.from(document.querySelectorAll("a[href*=\"live\"], a[href*=\"webcast\"]")).filter(arg1 => isVisibleElement(arg1) && arg1.href && !arg1.href.includes("/user/self"));
    if (result.length > 0) {
      const value = result[Math.floor(Math.random() * Math.min(result.length, 10))];
      await simulateHumanClick(value, arg1);
      await randomDelay(4000, 6500, arg1, "进入直播间");
      return true;
    }
    const result2 = Array.from(document.querySelectorAll("a, div[role=\"button\"], div[class*=\"card\"]")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = (arg1.innerText || "").slice(0, 100);
      return /直播中/.test(result);
    });
    if (result2.length > 0) {
      const value = result2[Math.floor(Math.random() * Math.min(result2.length, 8))];
      await simulateHumanClick(value, arg1);
      await randomDelay(4000, 6500, arg1, "进入直播间");
      return true;
    }
    return false;
  }
  async function fn38(arg1, arg2) {
    reportNurtureProgress(arg2, arg1, "养号：寻找直播间...", "📺 养号：随机进入直播间");
    let result = fn31();
    if (!result) {
      const result2 = await fn36("直播", arg1);
      if (result2) {
        result = await fn37(arg1);
      }
    }
    if (!result) {
      const local = getDouyinFeedScope() || document;
      const result2 = Array.from(local.querySelectorAll("a, span, div, button")).find(arg1 => isVisibleElement(arg1) && /直播中|进入直播/.test((arg1.innerText || "").trim()));
      if (result2) {
        await simulateHumanClick(result2.closest("a") || result2, arg1);
        await randomDelay(4000, 6500, arg1, "进入直播间");
        result = true;
      }
    }
    if (!result) {
      reportTraceLog("养号：未找到可进入的直播间，跳过");
      await fn24(arg1);
      return;
    }
    const value = (40 + Math.floor(Math.random() * 50)) * 1000;
    const value2 = Date.now() + value;
    let value3 = -1;
    reportTraceLog("📺 养号：观看直播中，计划 " + Math.round(value / 1000) + " 秒");
    while (Date.now() < value2 && !shouldAbort(arg1)) {
      const result = Math.ceil((value2 - Date.now()) / 1000);
      reportCurrentAction("养号：观看直播中（剩余约 " + result + " 秒）");
      if (result !== value3 && (result <= 10 || result % 20 === 0)) {
        reportTraceLog("📺 养号：观看直播中，剩余约 " + result + " 秒");
        value3 = result;
      }
      if (Math.random() < 0.25) {
        try {
          window.scrollBy({
            top: 40 + Math.floor(Math.random() * 100),
            behavior: "smooth"
          });
        } catch (error) {}
      }
      await sleep(2500 + Math.floor(Math.random() * 2500));
    }
    await fn22(arg1);
    await fn24(arg1);
  }
  async function startNurtureLoop(arg1) {
    const value = state.currentTask;
    if (!value || value.taskMode !== "nurture") {
      return;
    }
    const result = getNurtureStateKey();
    let obj = {};
    try {
      obj = JSON.parse(sessionStorage.getItem(result) || "{}");
    } catch (error) {}
    const local = obj.loopId === arg1 && obj.endTime > Date.now();
    if (local) {
      if (!obj.interestKeywords?.length) {
        obj.interestKeywords = fn15(value, obj);
      }
      if (!obj.nurtureStrategy) {
        obj.nurtureStrategy = value.nurtureStrategy || (value.nurturePersona ? "persona" : "keywords");
      }
      if (!obj.personaName && value.nurturePersonaName) {
        obj.personaName = value.nurturePersonaName;
      }
      if (!Number.isFinite(obj.nurtureLikePercent)) {
        obj.nurtureLikePercent = Number(value.nurtureLikePercent);
      }
      if (!Number.isFinite(obj.nurtureCollectPercent)) {
        obj.nurtureCollectPercent = Number(value.nurtureCollectPercent);
      }
      if (!Number.isFinite(obj.nurtureSharePercent)) {
        obj.nurtureSharePercent = Number(value.nurtureSharePercent);
      }
      delete obj.personaKeywords;
    }
    if (!local) {
      const local = parseInt(value.nurtureDurationMin, 10) || 60;
      const local2 = parseInt(value.nurtureDurationMax, 10) || 120;
      const value2 = Math.floor(Math.random() * (local2 - local + 1)) + local;
      const result2 = fn15(value);
      const local3 = value.nurtureStrategy || (value.nurturePersona ? "persona" : "keywords");
      obj = {
        loopId: arg1,
        endTime: Date.now() + value2 * 60 * 1000,
        totalMinutes: value2,
        videosWatched: 0,
        actionsDone: 0,
        interestKeywords: result2,
        nurtureStrategy: local3,
        personaName: value.nurturePersonaName || value.nurturePersona?.name || "",
        nurtureLikePercent: Number(value.nurtureLikePercent),
        nurtureCollectPercent: Number(value.nurtureCollectPercent),
        nurtureSharePercent: Number(value.nurtureSharePercent),
        searchKeywordIndex: 0,
        searchQueue: [],
        searchQueueIndex: 0,
        searchKeyword: ""
      };
      sessionStorage.setItem(result, JSON.stringify(obj));
      const value3 = result2.length ? "，标签：" + result2.slice(0, 4).join("、") : "";
      const value4 = local3 === "persona" && obj.personaName ? "，按人设「" + obj.personaName + "」校准" : "，按关键词搜索完播";
      reportTraceLog("🌱 养号开始：计划 " + value2 + " 分钟" + value4 + value3);
    }
    obj.currentTask = value;
    ipcRenderer.send("automation-data", {
      type: "status",
      payload: {
        accountId: window._radar_account_id,
        status: "running"
      }
    });
    const value2 = obj.nurtureStrategy === "persona";
    const value3 = value2 && obj.personaName ? "人设·" + obj.personaName : (obj.interestKeywords || []).slice(0, 3).join("、") || "关键词搜索";
    ipcRenderer.send("automation-data", {
      type: "keyword-changed",
      payload: {
        accountId: window._radar_account_id,
        keyword: "养号·" + value3,
        targetCount: obj.totalMinutes
      }
    });
    if (!local && value2 && !isOnDouyinRecommendPage() && !fn29()) {
      await ensureDouyinRecommendFeed(arg1);
      await randomDelay(3000, 5000, arg1, "加载推荐流");
    }
    const num = 0.08;
    const num2 = 0.1;
    const num5 = 0.06;
    const local2 = () => {
      try {
        const {
          currentTask: currentTask,
          ...local
        } = obj;
        sessionStorage.setItem(result, JSON.stringify(local));
      } catch (error) {
        try {
          sessionStorage.setItem(result, JSON.stringify(obj));
        } catch (error) {}
      }
    };
    while (Date.now() < obj.endTime && !shouldAbort(arg1)) {
      await awaitSecurityChallengeIfPresent(arg1);
      obj.currentTask = value;
      local2();
      if (!value2) {
        try {
          const result = await runNurtureKeywordSearchWatchRound(arg1, obj, {
            buildDouyinSearchResultCardMap: buildDouyinSearchResultCardMap,
            buildDouyinSearchUrl: buildDouyinSearchUrl,
            clearSearchPendingOpenUrl: clearSearchPendingOpenUrl,
            collectSearchVideoUrlsForCommentTask: collectSearchVideoUrlsForCommentTask,
            closeAllModals: closeAllModals,
            extractSpecificVideoId: extractSpecificVideoId,
            getDouyinSearchCardClickTarget: getDouyinSearchCardClickTarget,
            isVisibleElement: isVisibleElement,
            normalizeSearchQueueVideoUrl: normalizeSearchQueueVideoUrl,
            openSearchQueueVideoByUrl: openSearchQueueVideoByUrl,
            resolveDouyinVideoDetailModal: resolveDouyinVideoDetailModal,
            setSearchPendingOpenUrl: setSearchPendingOpenUrl,
            shouldAbort: shouldAbort,
            simulateHumanClick: simulateHumanClick,
            suspendAutomationForNavigation: suspendAutomationForNavigation,
            waitForVideoDetailReadyAndPause: waitForVideoDetailReadyAndPause,
            randomDelay: randomDelay,
            reportCurrentAction: reportCurrentAction,
            reportTraceLog: reportTraceLog,
            clipTraceText: clipTraceText,
            sessionStorage: sessionStorage,
            getNurtureStateKey: getNurtureStateKey,
            nurtureWatchCurrentVideo: nurtureWatchCurrentVideo,
            awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
            waitForDouyinSearchContentAfterZero: waitForDouyinSearchContentAfterZero,
            prepareSearchPageReload: prepareSearchPageReload
          });
          if (result?.navigated) {
            local2();
            return;
          }
          if (result?.didWork) {
            obj.actionsDone = (obj.actionsDone || 0) + 1;
            reportNurtureProgress(obj, arg1);
            continue;
          }
        } catch (error) {
          if (error.message === "TASK_ABORTED") {
            break;
          }
          console.warn("[养号] 关键词搜索完播异常，短暂回退推荐流:", error.message);
          reportTraceLog("养号：搜索完播跳过（" + error.message + "）");
          await randomDelay(1500, 2500, arg1, "养号搜索恢复");
        }
      }
      if (isDouyinFullLivePage() && !isDouyinFeedInlineContext()) {
        console.log("[Built-in-Debug] [养号] 检测到进入了独立直播间页面，返回推荐流");
        reportTraceLog("🔴 养号：检测到直播间页面，自动返回推荐流");
        reportCurrentAction("养号：检测到直播间，返回推荐流...");
        await fn24(arg1);
        await randomDelay(1500, 3000, arg1, "离开直播间");
        continue;
      }
      if (isDouyinFeedLiveStream()) {
        const local = getFeedVideoIdentity() || getVideoTitle() || fn6();
        if (local && local === obj.nurtureLastLiveKey) {
          obj.nurtureLiveSkipStreak = (obj.nurtureLiveSkipStreak || 0) + 1;
        } else {
          obj.nurtureLiveSkipStreak = 1;
          obj.nurtureLastLiveKey = local;
        }
        console.log("[Built-in-Debug] [养号] 推荐流中检测到直播卡片，自动划走");
        reportTraceLog("🔴 养号：推荐流直播卡片，自动跳过");
        reportCurrentAction("养号：检测到直播间，划走...");
        const result = fn6();
        fn(obj, result);
        if (fn2(obj, result)) {
          await fn3(arg1, obj, "直播跳过后检测到来回弹跳");
          continue;
        }
        const value = (obj.nurtureLiveSkipStreak || 0) >= num3;
        await skipDouyinFeedLiveStream(arg1, {
          forceReload: value
        });
        if (value) {
          obj.nurtureLiveSkipStreak = 0;
          obj.nurtureLastLiveKey = "";
        }
        await randomDelay(1000, 2000, arg1, "跳过直播");
        continue;
      } else {
        obj.nurtureLiveSkipStreak = 0;
        obj.nurtureLastLiveKey = "";
      }
      if (!value2) {
        await randomDelay(1200, 2000, arg1, "关键词搜索空轮等待");
        continue;
      }
      const result = await fn19(arg1, obj);
      if (result?.pass === false) {
        console.log("[Built-in-Debug] [养号人设] 当前视频不匹配，快速切换下一条: " + (result.reason || ""));
        await randomDelay(500, 1200, arg1, "人设不匹配停留");
        await fn5(arg1, obj, {
          reason: "人设不匹配切换",
          aggressive: true
        });
        await randomDelay(900, 1800, arg1, "切换视频");
        reportNurtureProgress(obj, arg1);
        continue;
      }
      obj.lastVideoKeywordHit = null;
      const result2 = Math.random();
      try {
        if (result2 < num) {
          await fn26(arg1, obj, {
            personaFocus: true,
            maxComments: num4
          });
        } else if (result2 < num + num2) {
          await fn27(arg1, obj, "author");
        } else if (result2 < num + num2 + num5) {
          await fn27(arg1, obj, "commenter");
        } else {
          const result = await nurtureWatchCurrentVideo(arg1, obj);
          if (result?.skipped) {
            await fn5(arg1, obj, {
              reason: "观看前人设不匹配",
              aggressive: true
            });
            await randomDelay(1200, 2200, arg1, "切换视频");
          } else if (!shouldAbort(arg1) && !result?.switchedDuringWatch) {
            await fn5(arg1, obj, {
              reason: "完播切换",
              aggressive: false
            });
            await randomDelay(1500, 3000, arg1, "切换视频");
          } else if (result?.switchedDuringWatch) {
            reportTraceLog("📺 养号：视频完播后页面已自动进入下一条，跳过额外滑动");
          }
        }
        obj.actionsDone = (obj.actionsDone || 0) + 1;
        reportNurtureProgress(obj, arg1);
      } catch (error) {
        if (error.message === "TASK_ABORTED") {
          break;
        }
        console.warn("[养号] 动作异常，继续下一轮:", error.message);
        reportTraceLog("养号：动作跳过（" + error.message + "）");
        await randomDelay(1500, 2500, arg1, "养号恢复");
      }
    }
    sessionStorage.removeItem(result);
    reportTraceLog("🌱 养号完成：共浏览 " + (obj.videosWatched || 0) + " 个视频，执行 " + (obj.actionsDone || 0) + " 次动作");
    ipcRenderer.send("automation-data", {
      type: "status",
      payload: {
        accountId: window._radar_account_id,
        status: "finished"
      }
    });
    ipcRenderer.send("task-finished", fn9(arg1, obj));
  }
  return {
    isDouyinFeedInlineContext: isDouyinFeedInlineContext,
    isDouyinFeedLiveStream: isDouyinFeedLiveStream,
    isDouyinFullLivePage: isDouyinFullLivePage,
    isDouyinLiveStreamTitle: isDouyinLiveStreamTitle,
    skipDouyinFeedLiveStream: skipDouyinFeedLiveStream,
    startNurtureLoop: startNurtureLoop
  };
}
module.exports = {
  createNurtureAutomationController: createNurtureAutomationController
};
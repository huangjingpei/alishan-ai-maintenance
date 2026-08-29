'use strict';

function createAutomationRuntimeController(options = {}) {
  const {
    DOUYIN_LIKE_ENTRY_URL: douyinLikeEntryUrl,
    DOUYIN_RECOMMEND_URL: douyinRecommendUrl,
    getDouyinLikeEntryUrl: getDouyinLikeEntryUrl,
    getDouyinRecommendUrl: getDouyinRecommendUrl,
    getDouyinFollowUrl: getDouyinFollowUrl,
    buildDouyinSearchUrl: buildDouyinSearchUrl,
    dismissEntityLoginPopupsCore: dismissEntityLoginPopupsCore,
    finalizeAccountTask: finalizeAccountTask,
    getCommentV2String: getCommentV2String,
    getCommentV2List: getCommentV2List,
    getMainCommentInputShellSelector: getMainCommentInputShellSelector,
    hasCommentNonTextPayload: hasCommentNonTextPayload,
    ipcRenderer: ipcRenderer,
    isAiInvokeCancelled: isAiInvokeCancelled,
    isElementInViewport: isElementInViewport,
    isElementInViewportForAutomation: isElementInViewportForAutomation,
    isMonitorLoopId: isMonitorLoopId,
    isProfileFirstCommentAiMode: isProfileFirstCommentAiMode,
    isVisibleElement: isVisibleElement,
    localStorage: localStorage,
    matchesPlaceholderHint: matchesPlaceholderHint,
    radarSessionKey: radarSessionKey,
    randomDelay: randomDelay,
    readRadarSessionState: readRadarSessionState,
    resolveMainCommentWritableElement: resolveMainCommentWritableElement,
    sessionStorage: sessionStorage,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    sleep: sleep,
    preloadDir: preloadDir,
    state: state
  } = options;
  const local = preloadDir;
  const local2 = () => typeof getDouyinRecommendUrl === "function" ? getDouyinRecommendUrl() : douyinRecommendUrl;
  const local3 = () => typeof getDouyinLikeEntryUrl === "function" ? getDouyinLikeEntryUrl() : douyinLikeEntryUrl;
  const local4 = () => typeof getDouyinFollowUrl === "function" ? getDouyinFollowUrl() : "https://www.douyin.com/follow";
  function reportCurrentAction(arg1, arg2 = null, text = "normal") {
    if (!arg1) {
      return;
    }
    reportTraceLog(arg1, arg2, text);
    try {
      const local = arg2 || window._radar_account_id || sessionStorage.getItem("radar_account_id") || "default";
      ipcRenderer.send("automation-data", {
        type: "current-action",
        payload: {
          accountId: local,
          action: arg1,
          level: text
        }
      });
    } catch (error) {
      console.warn("[Built-in-Debug] 汇报当前动作失败:", error);
    }
  }
  function reportTraceLog(arg1, arg2 = null, text = "normal") {
    const result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    try {
      const local = arg2 || window._radar_account_id || sessionStorage.getItem("radar_account_id") || "default";
      const value = state.currentTask?.isBatchAction ? state.currentTask.batchRunId ?? state.currentTask.runId : undefined;
      ipcRenderer.send("automation-data", {
        type: "trace-log",
        payload: {
          accountId: local,
          message: result,
          level: text,
          runId: value,
          batchRunId: value
        }
      });
    } catch (error) {
      console.warn("[Built-in-Debug] 轨迹详情上报失败:", error);
    }
  }
  function fn3() {
    return window._radar_account_id || sessionStorage.getItem("radar_account_id") || "default";
  }
  function buildAutomationAiPayload(options = {}) {
    return {
      accountId: fn3(),
      ...options
    };
  }
  function reportProfileFirstTrace(arg1, arg2 = null) {
    const result = String(arg1 || "").trim();
    if (!result) {
      return;
    }
    reportTraceLog("📝 首作评论：" + result, arg2);
  }
  function reportCommentFlowTrace(arg1, text = "", text2 = "normal") {
    const result = fn7(window._radar_account_name || window._radar_account_id || "?", 10);
    const value = text ? "：" + text : "";
    reportTraceLog("🔍[主评·" + result + "] " + arg1 + value, null, text2);
  }
  function buildMainCommentAbortResult(arg1, arg2) {
    const value = "task_aborted_" + arg1;
    reportCommentFlowTrace("流程被中断", value + "；" + describeTaskAbortReason(arg2), "warning");
    return {
      success: false,
      error: value,
      aborted: true
    };
  }
  function getCommentPlaceholderText(arg1) {
    if (!arg1) {
      return "";
    }
    return [arg1.getAttribute?.("placeholder") || "", arg1.getAttribute?.("data-placeholder") || "", arg1.getAttribute?.("aria-label") || "", arg1.innerText || arg1.textContent || ""].join(" ").replace(/\s+/g, " ").trim();
  }
  function isMainCommentPlaceholderCandidate(arg1, {
    requireViewport = true,
    profileVideo = false
  } = {}) {
    if (!arg1 || !isVisibleElement(arg1)) {
      return false;
    }
    if (requireViewport) {
      if (profileVideo ? !isElementInViewport(arg1) : !isElementInViewportForAutomation(arg1)) {
        return false;
      }
    }
    const result = [arg1.getAttribute?.("placeholder") || "", arg1.getAttribute?.("data-placeholder") || "", arg1.getAttribute?.("aria-label") || ""].join(" ").replace(/\s+/g, " ").trim();
    const result2 = (arg1.innerText || arg1.textContent || "").replace(/\s+/g, " ").trim();
    const local = result || result2;
    const value = typeof arg1.className === "string" ? arg1.className.toLowerCase() : "";
    let flag = false;
    if (value.includes("placeholder")) {
      const result = getMainCommentInputShellSelector();
      try {
        flag = !!result && !!arg1.closest(result);
      } catch (error) {}
    }
    const local2 = matchesPlaceholderHint(local) || /说点什么|留下.*评论|友善交流|发条评论|写下.*评论|输入.*评论|发表评论/.test(local) || flag;
    if (!local2) {
      return false;
    }
    if (arg1.closest("[class*=\"comment-item\"], [class*=\"CommentItem\"]")) {
      return false;
    }
    if (!flag && arg1.closest("button, [role=\"button\"]")) {
      return false;
    }
    if (!flag) {
      if (!result && (arg1.children.length > 3 || result2.length > 100)) {
        return false;
      }
      if (!result && Array.from(arg1.children || []).some(arg1 => {
        const result = getCommentPlaceholderText(arg1);
        return result && result.length <= 100 && matchesPlaceholderHint(result);
      })) {
        return false;
      }
    }
    const result3 = arg1.getBoundingClientRect();
    const result4 = Math.max(800, Math.floor(window.innerWidth * 0.72));
    const value2 = flag ? 180 : 140;
    if (result3.height > value2 || result3.width > result4) {
      return false;
    }
    if (result3.width < 12 || result3.height < 12) {
      return false;
    }
    const value3 = result3.left + result3.width / 2;
    const value4 = result3.top + result3.height / 2;
    if (requireViewport && (value3 <= 5 || value4 <= 5 || value3 >= window.innerWidth - 5 || value4 >= window.innerHeight - 5)) {
      return false;
    }
    return true;
  }
  function scoreMainCommentPlaceholderCandidate(arg1) {
    if (!arg1) {
      return -Infinity;
    }
    const result = arg1.getBoundingClientRect();
    let num = 0;
    const result2 = [arg1.getAttribute?.("placeholder") || "", arg1.getAttribute?.("data-placeholder") || "", arg1.getAttribute?.("aria-label") || ""].join(" ").trim();
    const result3 = getMainCommentInputShellSelector();
    try {
      if (result3 && arg1.closest(result3)) {
        num += 240;
      }
    } catch (error) {}
    if (result2) {
      num += 120;
    }
    if ((arg1.innerText || arg1.textContent || "").trim().length <= 50) {
      num += 40;
    }
    if (result.left >= window.innerWidth * 0.45) {
      num += 35;
    }
    num += Math.max(0, Math.min(35, result.bottom / Math.max(window.innerHeight, 1) * 35));
    num -= Math.min(60, arg1.querySelectorAll?.("*")?.length || 0);
    return num;
  }
  function describeMainCommentInputEnvironment(arg1) {
    try {
      const local = arg1 || document.body;
      const result = getCommentV2String("commentInput");
      const value = result ? new Set(Array.from(local?.querySelectorAll?.(result) || []).map(resolveMainCommentWritableElement).filter(Boolean)).size : 0;
      const result2 = Array.from(local?.querySelectorAll?.("div, span, p, textarea[placeholder], input[placeholder], [contenteditable=\"true\"][data-placeholder], [role=\"textbox\"][aria-label]") || []).filter(arg1 => {
        const result = getCommentPlaceholderText(arg1);
        return matchesPlaceholderHint(result) || /评论|说点什么|留下.*评论|友善交流/.test(result);
      });
      const value2 = result2.length;
      const value3 = result2.filter(arg1 => isMainCommentPlaceholderCandidate(arg1, {
        requireViewport: true,
        profileVideo: false
      })).length;
      const value4 = result2.filter(arg1 => isMainCommentPlaceholderCandidate(arg1, {
        requireViewport: false,
        profileVideo: false
      })).length;
      return ["viewport=" + window.innerWidth + "x" + window.innerHeight, "visibility=" + document.visibilityState, "focused=" + (document.hasFocus?.() !== false), "modalConnected=" + !!arg1?.isConnected, "editable=" + value, "placeholder=" + value2, "phClickable=" + value3, "phLoose=" + value4, "active=" + (document.activeElement?.tagName || "none"), "native=" + state.lastTrustedClickDiagnostic].join(" ");
    } catch (error) {
      return "diagnostic_failed=" + fn7(error?.message || error, 40);
    }
  }
  function describeTaskAbortReason(arg1) {
    const list = ["state.taskRunning=" + state.taskRunning, "state.stopRequested=" + state.stopRequested, "state.pausedForSubview=" + state.pausedForSubview, "loopId=" + (arg1 || "null"), "state.activeLoopId=" + (state.activeLoopId || "null")];
    if (arg1 && arg1 !== state.activeLoopId) {
      list.push("loopId_mismatch");
    }
    if (!state.taskRunning && arg1 !== "BATCH" && arg1 !== "SELF_WARMUP" && (typeof arg1 !== "string" || !arg1.startsWith("MONITOR"))) {
      list.push("taskRunning_false");
    }
    return list.join(", ");
  }
  let local5;
  function getAutomationTextHelpersModule() {
    if (local5 !== undefined) {
      return local5;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/automationTextHelpers", "./shared/automationTextHelpers.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "automationTextHelpers.js"), result.join(local, "shared", "automationTextHelpers"), result.join(local, "..", "shared", "automationTextHelpers.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.clipTraceText === "function" && typeof result?.personalizeDmTemplate === "function") {
          local5 = result;
          return local5;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] automationTextHelpers 模块未找到，回退内置实现");
    local5 = null;
    return local5;
  }
  function fn15(arg1) {
    const result = getAutomationTextHelpersModule();
    if (result?.isFatalAiAuthError) {
      return result.isFatalAiAuthError(arg1);
    }
    if (!arg1) {
      return false;
    }
    const result2 = String(arg1);
    return result2.includes("额度已用完") || result2.includes("已用完") || result2.includes("卡密已过期") || result2.includes("授权码无效") || result2.includes("设备已被封") || result2.includes("余额不足") || result2.includes("未授权");
  }
  function fn7(arg1, num = 120) {
    const result = getAutomationTextHelpersModule();
    if (result?.clipTraceText) {
      return result.clipTraceText(arg1, num);
    }
    const result2 = String(arg1 || "").trim();
    if (!result2) {
      return "";
    }
    if (result2.length > num) {
      return result2.slice(0, num) + "…";
    } else {
      return result2;
    }
  }
  function fn16(arg1, options = {}) {
    const result = getAutomationTextHelpersModule();
    if (result?.personalizeDmTemplate) {
      return result.personalizeDmTemplate(arg1, options);
    }
    const local = String(options?.nickname || options?.name || "朋友").trim() || "朋友";
    return String(arg1 || "").replace(/\{nickname\}/g, local);
  }
  let local6;
  function resolveTaskLocationFilterRegions(arg1 = state.currentTask) {
    const local = arg1?.locationFilterRegions;
    if (!local) {
      return [];
    }
    const value = Array.isArray(local) ? local : String(local).split(/[,，\s\n]+/);
    return value.map(arg1 => String(arg1 || "").trim()).filter(Boolean);
  }
  function taskLocationFilterEnabled(arg1 = state.currentTask) {
    return resolveTaskLocationFilterRegions(arg1).length > 0;
  }
  function formatTaskLocationFilterSummary(arg1 = state.currentTask) {
    const result = resolveTaskLocationFilterRegions(arg1);
    if (!result.length) {
      return "不限";
    }
    const value = arg1?.locationFilterMode === "exclude" ? "不包含" : "包含";
    return value + "：" + result.join("、");
  }
  function evaluateLeadLocationFilter(arg1, arg2 = state.currentTask) {
    const result = resolveTaskLocationFilterRegions(arg2);
    if (!result.length) {
      return {
        pass: true
      };
    }
    const result2 = getLocationFilterModule();
    if (result2?.evaluateTaskLocationFilter) {
      return result2.evaluateTaskLocationFilter(arg1, arg2);
    }
    const result3 = String(arg1?.ipLocation || arg1?.location || "").trim();
    const value = arg2?.locationFilterMode === "exclude" ? "exclude" : "include";
    if (value === "exclude") {
      if (!result3 || result3 === "未知") {
        return {
          pass: true
        };
      }
      if (result.some(arg1 => arg1 && result3.includes(arg1))) {
        return {
          pass: false,
          reason: "地区排除（" + result3 + "）"
        };
      }
      return {
        pass: true
      };
    }
    if (!result3 || result3 === "未知") {
      return {
        pass: false,
        reason: "地区未知"
      };
    }
    if (result.some(arg1 => arg1 && result3.includes(arg1))) {
      return {
        pass: true
      };
    }
    return {
      pass: false,
      reason: "地区不符（" + result3 + "）"
    };
  }
  function getLocationFilterModule() {
    if (local6 !== undefined) {
      return local6;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/locationFilter"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "locationFilter"), result.join(local, "..", "shared", "locationFilter"));
    }
    for (const item of list) {
      try {
        local6 = require(item);
        console.log("[Built-in-Debug] locationFilter 已加载: " + item);
        return local6;
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] locationFilter 模块未找到，使用内置回退逻辑");
    local6 = null;
    return local6;
  }
  let local7;
  function fn22() {
    if (local7 !== undefined) {
      return local7;
    }
    try {
      local7 = require("./shared/localCommentAnalysis");
    } catch (error) {
      console.warn("[Built-in-Debug] localCommentAnalysis 加载失败，跳过后端预筛:", error.message);
      local7 = null;
    }
    return local7;
  }
  let local8;
  function fn23() {
    if (local8 !== undefined) {
      return local8;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/douyinCommentLike", "./shared/douyinCommentLike.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "douyinCommentLike.js"), result.join(local, "shared", "douyinCommentLike"), result.join(local, "..", "shared", "douyinCommentLike.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.resolveCommentLikeControl === "function") {
          local8 = result;
          console.log("[Built-in-Debug] douyinCommentLike 已加载: " + item);
          return local8;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] douyinCommentLike 模块未找到，跳过评论点赞定位");
    local8 = null;
    return local8;
  }
  function resolveCommentLikeControlInNode(arg1) {
    const result = fn23();
    if (result?.resolveCommentLikeControl) {
      return result.resolveCommentLikeControl(arg1, {
        isVisibleElement: isVisibleElement,
        getCommentV2String: getCommentV2String,
        getCommentV2List: getCommentV2List
      });
    }
    return {
      button: null,
      alreadyLiked: false,
      reason: "like_button_not_found",
      score: -1
    };
  }
  function snapshotCommentLikeControlState(arg1) {
    if (!arg1) {
      return null;
    }
    const result = fn23();
    if (result?.snapshotCommentLikeState) {
      return result.snapshotCommentLikeState(arg1, result.resolveCommentLikePack?.({
        getCommentV2String: getCommentV2String,
        getCommentV2List: getCommentV2List
      }));
    }
    return {
      liked: false,
      count: null,
      likedClass: false
    };
  }
  function fn26(arg1, arg2) {
    const result = fn23();
    if (result?.hasCommentLikeTakenEffect) {
      return result.hasCommentLikeTakenEffect(arg1, arg2);
    }
    return !!arg2?.liked;
  }
  function describeCommentLikeState(arg1) {
    if (!arg1) {
      return "none";
    }
    return "liked=" + (arg1.liked ? 1 : 0) + " count=" + (arg1.count == null ? "-" : arg1.count) + " cls=" + (arg1.likedClass ? 1 : 0);
  }
  function prepareLeadsForAiAnalysis(arg1) {
    const value = Array.isArray(arg1) ? arg1 : [];
    const list = [];
    const list2 = [];
    const map = new Map();
    for (const item of value) {
      if (item?.excludedCommentKeyword) {
        const local = item.aiThought || item.thought || "命中排除评论关键词「" + item.excludedCommentKeyword + "」，直接判定为低意向";
        item.isHighIntention = false;
        item.aiThought = local;
        item.thought = local;
        const obj = {
          decision: "ignore",
          replyContent: "",
          aiThought: local
        };
        map.set(item.leadId, obj);
        list.push(item);
      } else {
        list2.push(item);
      }
    }
    const result = fn22();
    if (!result) {
      return {
        forBackend: list2,
        localDecisions: map,
        localCount: list.length,
        localLeads: list
      };
    }
    const {
      forBackend: forBackend,
      localDecisions: localDecisions,
      localCount: localCount
    } = result.partitionLeadsForAiAnalysis(list2);
    map.forEach((arg1, arg2) => localDecisions.set(arg2, arg1));
    const list3 = [...list];
    for (const item of list2) {
      const result2 = localDecisions.get(item.leadId);
      if (result2) {
        result.applyLocalAiDecisionToLead(item, result2);
        list3.push(item);
      }
    }
    return {
      forBackend: forBackend,
      localDecisions: localDecisions,
      localCount: localCount + list.length,
      localLeads: list3
    };
  }
  function fn29(arg1 = state.currentTask?.excludeCommentKeywords) {
    const result = getAutomationTextHelpersModule();
    if (result?.parseExcludedCommentKeywords) {
      return result.parseExcludedCommentKeywords(arg1);
    }
    return String(arg1 || "").split(/[,，\n\r]+/).map(arg1 => arg1.trim()).filter(Boolean);
  }
  function fn30(arg1) {
    const result = getAutomationTextHelpersModule();
    if (result?.parseTitleKeywordList) {
      return result.parseTitleKeywordList(arg1);
    }
    return String(arg1 || "").split(/[,，]/).map(arg1 => arg1.trim()).filter(Boolean);
  }
  function fn31(arg1, list = []) {
    const result = getAutomationTextHelpersModule();
    if (result?.matchTitleKeywordList) {
      return result.matchTitleKeywordList(arg1, list);
    }
    const result2 = String(arg1 || "").toLowerCase();
    if (!result2 || !Array.isArray(list) || !list.length) {
      return "";
    }
    return list.find(arg1 => result2.includes(String(arg1).toLowerCase())) || "";
  }
  function getIncludeTitleKeywordMatch(arg1, arg2 = state.currentTask) {
    return fn31(arg1, fn30(arg2?.includeTitleKeywords));
  }
  function shouldEnforceIncludeTitleKeywords(arg1 = state.currentTask) {
    return fn30(arg1?.includeTitleKeywords).length > 0;
  }
  function shouldForceSelectByIncludeTitle(arg1, arg2 = state.currentTask) {
    return !!getIncludeTitleKeywordMatch(arg1, arg2);
  }
  function shouldGenerateAiVideoMainPost(arg1 = state.currentTask) {
    return !!arg1?.enableVideoComment && arg1?.taskMode === "interaction" && arg1?.videoCommentMode === "ai" && !arg1?.enableVideoCommentWithoutText && !!fn36(arg1);
  }
  function matchExcludedCommentKeyword(arg1, arg2 = state.currentTask) {
    const result = String(arg1 || "").toLowerCase();
    if (!result) {
      return "";
    }
    return fn29(arg2?.excludeCommentKeywords).find(arg1 => result.includes(arg1.toLowerCase())) || "";
  }
  function fn38(arg1 = state.currentTask) {
    const result = String(arg1?.platform || window._radar_platform || "").toLowerCase();
    return result === "douyin" || result === "dy" || result.includes("douyin");
  }
  function fn39(arg1 = state.currentTask) {
    const local = arg1?.authInfo || {};
    if (local && (local.isFree !== undefined || local.isTrial !== undefined)) {
      return local.isFree === false && local.isTrial === false;
    }
    if (arg1 && (arg1.isFree !== undefined || arg1.isTrial !== undefined)) {
      return arg1.isFree === false && arg1.isTrial === false;
    }
    return false;
  }
  function fn40(arg1 = state.currentTask) {
    return !!fn38(arg1) && arg1?.taskMode === "interaction" && !!shouldUseAiCommentAnalysis(arg1) && !!fn39(arg1);
  }
  function fn36(arg1 = state.currentTask) {
    return !!arg1?.aiReplyMode && (!!arg1?.aiRole || !!arg1?.aiPrompt || !!arg1?.aiGoal);
  }
  function shouldUsePersonaVideoFilter(arg1 = state.currentTask) {
    if (arg1?.enablePersonaVideoFilter === false) {
      return false;
    }
    return !!fn38(arg1) && !!fn36(arg1) && !!fn39(arg1);
  }
  function shouldUseCommentKeywordFilter(arg1 = state.currentTask) {
    return !!arg1?.enableCommentKeywordFilter;
  }
  function shouldUseAiCommentAnalysis(arg1 = state.currentTask) {
    if (shouldUseCommentKeywordFilter(arg1)) {
      return false;
    }
    return !!arg1?.aiReplyMode;
  }
  function shouldUseAiReplyGeneration(arg1 = state.currentTask) {
    return !!arg1?.aiReplyMode;
  }
  async function prefetchKeywordReplyContents(arg1, arg2) {
    const map = new Map();
    if (!shouldUseCommentKeywordFilter(state.currentTask) || !shouldUseAiReplyGeneration(state.currentTask)) {
      return map;
    }
    if (!state.currentTask?.enableComment) {
      return map;
    }
    if (shouldUseTextlessReplyPayload()) {
      reportTraceLog("🤖 关键词+AI回复：已配置纯图片/表情/@，跳过后端回复文案生成");
      return map;
    }
    const result = arg1.filter(arg1 => arg1.isHighIntention);
    if (result.length === 0) {
      return map;
    }
    reportTraceLog("🤖 关键词+AI回复：" + result.length + " 条已匹配关键词，批量请求生成回复（跳过意向判定）…");
    for (let num = 0; num < result.length; num += 10) {
      if (shouldAbort(arg2)) {
        break;
      }
      const result2 = result.slice(num, num + 10);
      const value = Math.floor(num / 10) + 1;
      const local = Math.ceil(result.length / 10) || 1;
      reportTraceLog("🤖 关键词回复：第 " + value + "/" + local + " 批，" + result2.length + " 条…");
      const result3 = Date.now();
      const result4 = await ipcRenderer.invoke("ai-intelligent-analyze-batch", buildAutomationAiPayload({
        leads: result2,
        generationMode: "keyword_reply_only",
        config: fn47(state.currentTask)
      }));
      if (shouldAbort(arg2) || isAiInvokeCancelled(result4)) {
        break;
      }
      const result5 = ((Date.now() - result3) / 1000).toFixed(1);
      if (result4.success && Array.isArray(result4.data)) {
        reportTraceLog("🤖 关键词回复：第 " + value + " 批完成（耗时 " + result5 + "s，返回 " + result4.data.length + " 条）");
        result4.data.forEach((arg1, arg2) => {
          const value = result2[arg2];
          const result = String(arg1?.replyContent || "").trim();
          if (value?.leadId && result) {
            map.set(value.leadId, result);
            value.actions = value.actions || {};
            value.actions.replyContent = result;
          }
        });
      } else {
        reportTraceLog("🤖 关键词回复：第 " + value + " 批失败（耗时 " + result5 + "s）：" + fn7(result4?.msg || "未知原因"));
      }
    }
    return map;
  }
  function isDouyinProfileTargetingEnabled(arg1 = state.currentTask) {
    return !!fn40(arg1) && !!arg1?.commentOnProfileFirstWork;
  }
  function fn47(arg1 = state.currentTask) {
    return {
      aiRole: arg1?.aiRole,
      aiGoal: arg1?.aiGoal,
      aiStyle: arg1?.aiStyle,
      aiPrompt: arg1?.aiPrompt,
      videoGoal: arg1?.videoGoal,
      videoStyle: arg1?.videoStyle,
      videoPrompt: arg1?.videoPrompt,
      firstPostGoal: arg1?.firstPostGoal,
      firstPostStyle: arg1?.firstPostStyle,
      firstPostPrompt: arg1?.firstPostPrompt
    };
  }
  function shouldPrefetchMainPostWithVideoMatch(arg1 = state.currentTask) {
    return shouldGenerateAiVideoMainPost(arg1) && shouldUsePersonaVideoFilter(arg1);
  }
  async function prefetchAiMainPostComment(arg1, arg2, arg3) {
    if (!shouldGenerateAiVideoMainPost(state.currentTask)) {
      return "";
    }
    const value = Array.isArray(arg2) ? arg2.filter(Boolean).slice(0, 8) : [];
    reportTraceLog("🤖 视频主评：标题已选中，正在向后端获取文案…");
    try {
      const value2 = Math.floor(Math.random() * 1500) + 150;
      await sleep(value2);
      const result = await ipcRenderer.invoke("ai-generate-video-comment", buildAutomationAiPayload({
        videoTitle: (arg1 || "").trim() || "未知视频",
        comments: value,
        generationMode: "main_post_comment",
        config: fn47(state.currentTask)
      }));
      if (shouldAbort(arg3) || isAiInvokeCancelled(result)) {
        return "";
      }
      const result2 = String(result?.content || "").trim();
      if (result?.success && result2) {
        reportTraceLog("🤖 视频主评：已获取文案 →「" + fn7(result2, 32) + "」");
        return result2;
      }
      reportTraceLog("🤖 视频主评：后端未返回文案，发表时将重试");
      return "";
    } catch (error) {
      console.warn("[Built-in-Debug] [标题选中主评预取] 异常:", error.message || error);
      reportTraceLog("🤖 视频主评：预取失败，发表时将重试");
      return "";
    }
  }
  async function matchCurrentVideoForDy(arg1, arg2, arg3, options = {}) {
    if (!shouldUsePersonaVideoFilter(state.currentTask)) {
      const value = state.currentTask?.enablePersonaVideoFilter === false ? "已关闭人设视频筛选" : !fn36(state.currentTask) ? "未绑定智能体，视频直接通过" : "未启用 DY 智能预筛";
      return {
        success: true,
        pass: true,
        score: 100,
        reason: value,
        mainPostComment: ""
      };
    }
    try {
      const value = Array.isArray(arg2) ? arg2.filter(Boolean).slice(0, 10) : [];
      const value2 = options.withMainPost !== undefined ? !!options.withMainPost : shouldPrefetchMainPostWithVideoMatch(state.currentTask);
      reportTraceLog(value2 ? "🎯 智能预筛中（顺带生成主评）…" : "🎯 智能预筛中…");
      const result = await ipcRenderer.invoke("ai-match-video-context", buildAutomationAiPayload({
        videoTitle: arg1,
        comments: value,
        keywords: state.currentTask?.keywords || state.currentTask?.intentionKeywords || "",
        authorNickname: state.currentTask?.videoAuthor || "",
        matchScene: "leadgen_persona",
        withMainPost: value2,
        config: fn47(state.currentTask)
      }));
      if (shouldAbort(arg3)) {
        return {
          success: false,
          pass: true,
          reason: "任务已停止，预筛结果忽略",
          mainPostComment: ""
        };
      }
      if (result?.pass === false) {
        reportTraceLog("🎯 智能预筛：不匹配，跳过");
        return result;
      }
      const result2 = String(result?.mainPostComment || "").trim();
      if (value2 && result2) {
        reportTraceLog("🎯 智能预筛通过，已生成主评 →「" + fn7(result2, 32) + "」");
      } else if (value2) {
        reportTraceLog("🎯 智能预筛通过（主评将另行生成）");
      } else {
        reportTraceLog("🎯 智能预筛通过");
      }
      return {
        ...(result || {}),
        pass: true,
        mainPostComment: result2
      };
    } catch (error) {
      console.warn("[Built-in-Debug] [DY智能预筛] 异常，未放行:", error.message || error);
      reportTraceLog("🎯 智能预筛异常，跳过当前视频");
      return {
        success: false,
        pass: false,
        reason: "视频预筛异常，未确认匹配",
        mainPostComment: ""
      };
    }
  }
  async function matchLeadProfileForDy(arg1, arg2, arg3, arg4 = state.currentTask) {
    if (!isDouyinProfileTargetingEnabled(arg4)) {
      return {
        success: true,
        pass: true,
        score: 100,
        reason: "未启用 DY 画像判断"
      };
    }
    try {
      reportProfileFirstTrace("@" + (arg1?.nickname || "?") + " 提交画像判断", arg1?.accountId);
      const result = await ipcRenderer.invoke("ai-match-lead-profile", buildAutomationAiPayload({
        lead: arg1,
        videoTitle: arg2 || arg1?.title || arg1?.videoTitle || "",
        config: fn47(arg4)
      }));
      if (shouldAbort(arg3)) {
        return {
          success: false,
          pass: true,
          reason: "任务已停止，画像结果忽略"
        };
      }
      if (result?.pass === false) {
        reportProfileFirstTrace("@" + (arg1?.nickname || "?") + " 画像不匹配，已跳过（" + fn7(result.reason || "非目标人群", 80) + "）", arg1?.accountId);
        return result;
      }
      reportProfileFirstTrace("@" + (arg1?.nickname || "?") + " 画像通过（" + fn7(result?.reason || "匹配目标人群", 80) + "）", arg1?.accountId);
      return {
        ...(result || {}),
        pass: true
      };
    } catch (error) {
      console.warn("[Built-in-Debug] [DY画像判断] 异常，未放行:", error.message || error);
      reportProfileFirstTrace("@" + (arg1?.nickname || "?") + " 画像判断异常，未确认匹配，跳过（" + fn7(error.message || error, 80) + "）", arg1?.accountId);
      return {
        success: false,
        pass: false,
        reason: "画像判断异常，未确认匹配"
      };
    }
  }
  function resolveTaskEntryUrl(arg1) {
    const value = Array.isArray(arg1?.videoSources) && arg1.videoSources.length > 0 ? arg1.videoSources : ["search"];
    const result = String(arg1?.keywords || "").split(/[,，\s\n]+/).map(arg1 => arg1.trim()).filter(Boolean);
    const local = value.find(arg1 => ["search", "follow", "recommend", "like", "specific"].includes(arg1) && (arg1 !== "search" || result.length > 0)) || (result.length > 0 ? "search" : "recommend");
    if (local === "follow") {
      return local4();
    }
    if (local === "recommend") {
      return local2();
    }
    if (local === "like") {
      return local3();
    }
    if (local === "specific") {
      const result = String(arg1?.specifiedUrls || "").split(/[\n,，\s]+/).map(arg1 => arg1.trim()).filter(Boolean);
      if (result[0]) {
        return result[0];
      }
      return local2();
    }
    if (result[0]) {
      return buildDouyinSearchUrl(result[0]);
    }
    return local2();
  }
  function abortAutomationStartup(arg1, arg2) {
    state.taskRunning = false;
    state.stopRequested = false;
    const result = String(arg2 || "未知原因").trim();
    console.warn("[Built-in-Debug] [任务启动中止] " + result);
    try {
      finalizeAccountTask(arg1, "startup_aborted", {
        detail: result
      }, {
        stopRunning: true
      });
    } catch (error) {}
  }
  let obj = {
    key: "",
    at: 0
  };
  const num = 30000;
  let flag = false;
  const pattern = /请完成.{0,12}验证|拖动滑块|滑块验证|完成验证|输入验证码|短信验证码|人机验证|图形验证|请按住滑块|向右滑动|请进行验证/;
  const pattern2 = /拖动|滑块|按住|向右滑动/;
  const pattern3 = /验证码|短信码|图形码|输入.*码/;
  function detectPageSecurityChallenge() {
    const list = [];
    for (const item of document.querySelectorAll("iframe")) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const result = (item.src || item.getAttribute("src") || "").toLowerCase();
      if (/captcha|geetest|verify|sec-verify|nocaptcha|slider|secsdk/.test(result)) {
        list.push({
          kind: "iframe",
          hint: fn7(result, 80)
        });
      }
    }
    for (const item of document.querySelectorAll("input, textarea")) {
      if (!isVisibleElement(item)) {
        continue;
      }
      const result = (item.placeholder || item.getAttribute("aria-label") || "").trim();
      const result2 = ((item.name || "") + " " + (item.id || "")).toLowerCase();
      if (pattern3.test(result) || /captcha|verifycode|verify_code/.test(result2)) {
        list.push({
          kind: "captcha-input",
          hint: fn7(result || result2, 60)
        });
      }
    }
    const list2 = [".geetest_slider_button", ".geetest_slider", ".geetest_panel", ".captcha-slider", ".secsdk-captcha", "[class*=\"captcha\"][class*=\"slider\"]", "[class*=\"verify\"][class*=\"slider\"]"];
    for (const item of list2) {
      const result = document.querySelector(item);
      if (result && isVisibleElement(result)) {
        list.push({
          kind: "slider",
          hint: item
        });
        break;
      }
    }
    const list3 = ["[role=\"dialog\"]", "[class*=\"captcha\"]", "[class*=\"Captcha\"]", "[class*=\"verify\"]", "[class*=\"Verify\"]", "[id*=\"captcha\"]", "[id*=\"verify\"]", "[class*=\"geetest\"]"];
    for (const item of list3) {
      for (const item2 of document.querySelectorAll(item)) {
        if (!isVisibleElement(item2)) {
          continue;
        }
        const result = item2.getBoundingClientRect();
        if (result.width < 120 || result.height < 60) {
          continue;
        }
        const result2 = (item2.innerText || "").replace(/\s+/g, " ").slice(0, 240);
        if (!pattern.test(result2)) {
          continue;
        }
        if (pattern2.test(result2)) {
          list.push({
            kind: "slider",
            hint: fn7(result2, 60)
          });
        } else if (pattern3.test(result2)) {
          list.push({
            kind: "captcha",
            hint: fn7(result2, 60)
          });
        } else {
          list.push({
            kind: "verify",
            hint: fn7(result2, 60)
          });
        }
        break;
      }
      if (list.length) {
        break;
      }
    }
    if (!list.length) {
      try {
        const result = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        const local = result?.closest?.("[role=\"dialog\"], [class*=\"captcha\"], [class*=\"verify\"], [class*=\"geetest\"]");
        if (local && isVisibleElement(local)) {
          const result = (local.innerText || "").replace(/\s+/g, " ").slice(0, 240);
          if (pattern.test(result)) {
            const value = pattern2.test(result) ? "slider" : pattern3.test(result) ? "captcha" : "verify";
            list.push({
              kind: value,
              hint: fn7(result, 60)
            });
          }
        }
      } catch (error) {}
    }
    if (!list.length) {
      return null;
    }
    return list.find(arg1 => arg1.kind === "slider") || list.find(arg1 => arg1.kind === "captcha-input") || list.find(arg1 => arg1.kind === "captcha") || list[0];
  }
  function fn56() {
    try {
      if (state.currentViewKey) {
        ipcRenderer.send("focus-automation-view", {
          viewKey: state.currentViewKey,
          bringToFront: true
        });
      }
    } catch (error) {}
  }
  function fn57(arg1) {
    if (state.stopRequested) {
      return true;
    }
    if (arg1 === "BATCH" || arg1 === "SELF_WARMUP") {
      return !!state.stopRequested;
    }
    if (isMonitorLoopId(arg1)) {
      return !!state.stopRequested;
    }
    if (!state.taskRunning) {
      return true;
    }
    if (arg1 && state.activeLoopId && arg1 !== state.activeLoopId) {
      return true;
    }
    return false;
  }
  function fn58(options = {}) {
    const {
      force = false,
      waiting = false
    } = options;
    const result = detectPageSecurityChallenge();
    const result2 = Date.now();
    if (!result) {
      if (obj.key) {
        const text = "✅ 安全验证界面已消失，任务继续执行";
        console.log("[Built-in-Debug] [安全验证]", text);
        reportTraceLog(text);
        obj = {
          key: "",
          at: 0
        };
        try {
          ipcRenderer.send("automation-data", {
            type: "security-challenge-cleared",
            payload: {
              accountId: window._radar_account_id
            }
          });
        } catch (error) {}
      }
      return false;
    }
    const value = result.kind + ":" + result.hint;
    if (!force && obj.key === value && result2 - obj.at < num) {
      return true;
    }
    obj = {
      key: value,
      at: result2
    };
    const obj2 = {
      slider: "滑块验证",
      captcha: "验证码",
      "captcha-input": "验证码输入",
      iframe: "验证页",
      verify: "安全验证"
    };
    const local = obj2[result.kind] || "安全验证";
    const value2 = waiting ? "⚠️ 检测到" + local + "，任务已暂停，请在本账号窗口手动完成后再继续（" + (result.hint || "请查看页面") + "）" : "⚠️ 检测到" + local + "，请在本账号窗口手动完成（" + (result.hint || "请查看页面") + "）";
    console.warn("[Built-in-Debug] [安全验证]", result.kind, result.hint || "");
    reportTraceLog(value2, null, "warn");
    reportCurrentAction(value2);
    try {
      ipcRenderer.send("automation-data", {
        type: "security-challenge",
        payload: {
          accountId: window._radar_account_id,
          kind: result.kind,
          hint: result.hint || "",
          waiting: !!waiting,
          viewKey: state.currentViewKey || "",
          message: value2
        }
      });
    } catch (error) {}
    return true;
  }
  async function awaitSecurityChallengeIfPresent(arg1) {
    if (!detectPageSecurityChallenge()) {
      fn58();
      return false;
    }
    flag = true;
    const result = Date.now();
    let num2 = 0;
    try {
      fn58({
        force: true,
        waiting: true
      });
      fn56();
      reportTraceLog("⏸ 任务已暂停，等待人工完成安全验证后继续", null, "warn");
      reportCurrentAction("⏸ 检测到安全验证，已暂停任务，请在本账号窗口完成验证…");
      while (detectPageSecurityChallenge()) {
        if (fn57(arg1)) {
          throw new Error("TASK_ABORTED");
        }
        const result2 = Date.now();
        if (result2 - num2 >= num) {
          num2 = result2;
          const result3 = Math.floor((result2 - result) / 1000);
          fn58({
            force: true,
            waiting: true
          });
          fn56();
          reportCurrentAction("⏸ 仍在等待安全验证（已 " + result3 + " 秒），请完成后再继续…");
          reportTraceLog("⏸ 仍在等待安全验证（已 " + result3 + " 秒）", null, "warn");
        }
        await sleep(1000);
      }
      fn58();
      reportCurrentAction("✅ 安全验证已完成，继续执行任务");
      reportTraceLog("✅ 安全验证已完成，继续执行任务", null, "info");
      return true;
    } finally {
      flag = false;
    }
  }
  async function checkAndClickOneClickLogin() {
    try {
      const result = Array.from(document.querySelectorAll("button, [role=\"button\"], a, div, span, [class*=\"login\"], [class*=\"Login\"], [class*=\"btn\"], [class*=\"Btn\"]")).filter(arg1 => isVisibleElement(arg1));
      for (const item of result) {
        const result = String(item.innerText || item.textContent || "").trim().replace(/\s+/g, "");
        if (!result || result.length > 24) {
          continue;
        }
        const local = /^(一键登录|快捷登录|同意并登录|手机号一键登录|授权登录|本机号码一键登录|微信一键登录|QQ一键登录)$/.test(result) || result.length <= 16 && /一键登录|快捷登录|同意并登录|手机号.*登录|授权登录/.test(result);
        if (local) {
          console.log("[Built-in-Debug] [一键登录] 发现一键登录/授权按钮，自动点击:", result);
          reportTraceLog("🔓 检测到「" + result + "」弹窗按钮，已自动点击登录…");
          reportCurrentAction("🔓 自动点击「" + result + "」…");
          await simulateHumanClick(item, null);
          await sleep(1200);
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  async function awaitSearchPageLoginGate(text = "") {
    reportCurrentAction("搜索页提示需要登录，正在尝试一键登录…");
    reportTraceLog("🔓 搜索页登录墙：尝试自动点击「一键登录」…", null, "warning");
    let flag = false;
    const value = Date.now() + 12000;
    while (Date.now() < value && !shouldAbort(text)) {
      if (detectPageSecurityChallenge()) {
        await awaitSecurityChallengeIfPresent(text);
        break;
      }
      if (await checkAndClickOneClickLogin()) {
        flag = true;
        break;
      }
      await sleep(800);
    }
    if (flag) {
      reportCurrentAction("已点击一键登录，等待搜索结果刷新…");
      await randomDelay(2500, 4500, text, "一键登录后等待搜索页");
      return true;
    }
    reportCurrentAction("搜索页提示需要登录，等待登录完成后继续扫描...");
    await randomDelay(5000, 8000, text, "等待搜索页登录");
    try {
      await checkAndClickOneClickLogin();
    } catch (error) {}
    return false;
  }
  async function handleGlobalAutomationPopupsAndSecurity(text = "") {
    if (detectPageSecurityChallenge()) {
      await awaitSecurityChallengeIfPresent(text);
      return true;
    }
    const result = await checkAndClickOneClickLogin();
    if (result) {
      return true;
    }
    try {
      await dismissEntityLoginPopupsCore(text);
    } catch (error) {}
    return false;
  }
  function persistSessionInteractionCount() {
    try {
      if (typeof window._saveRadarState === "function") {
        window._saveRadarState();
      } else {
        const result = radarSessionKey(window._radar_account_id, state.activeLoopId);
        const result2 = readRadarSessionState(window._radar_account_id, state.activeLoopId);
        if (result2.loopId === state.activeLoopId) {
          result2.sessionInteractionCount = state.sessionInteractionCount;
          result2.followCount = state.sessionFollowCount;
          result2.dmCount = state.sessionDmCount;
          localStorage.setItem(result, JSON.stringify(result2));
        }
      }
    } catch (error) {}
  }
  function incrementInteractionCount(num = 1) {
    state.sessionInteractionCount += num;
    persistSessionInteractionCount();
    const value = state.sessionInteractionLimit === Infinity ? "∞" : state.sessionInteractionLimit;
    reportTraceLog("📊 互动总次数已更新：" + state.sessionInteractionCount + "/" + value);
    try {
      ipcRenderer.send("automation-data", {
        type: "interaction-total-progress",
        payload: {
          accountId: window._radar_account_id,
          current: state.sessionInteractionCount,
          limit: state.sessionInteractionLimit
        }
      });
    } catch (error) {}
  }
  function isInteractionLimitReached() {
    return state.sessionInteractionLimit !== Infinity && state.sessionInteractionCount >= state.sessionInteractionLimit;
  }
  function hasLocalReplyTemplates(arg1 = state.currentTask) {
    const local = arg1?.replyTemplates || (arg1?.commentContent ? arg1.commentContent.split("\n").filter(arg1 => arg1.trim()) : []);
    return local.length > 0;
  }
  function hasVideoCommentTemplates(arg1 = state.currentTask) {
    return String(arg1?.videoCommentContent || "").split("\n").some(arg1 => arg1.trim());
  }
  function shouldUseTextlessReplyPayload(arg1 = state.currentTask) {
    if (arg1?.enableCommentWithoutText) {
      return true;
    }
    if (shouldUseAiReplyGeneration(arg1) || isProfileFirstCommentAiMode(arg1)) {
      return false;
    }
    return hasCommentNonTextPayload(false) && !hasLocalReplyTemplates(arg1);
  }
  function shouldUseTextlessVideoCommentPayload(arg1 = state.currentTask) {
    if (arg1?.enableVideoCommentWithoutText) {
      return true;
    }
    return hasCommentNonTextPayload(true) && !hasVideoCommentTemplates(arg1);
  }
  return {
    abortAutomationStartup: abortAutomationStartup,
    awaitSearchPageLoginGate: awaitSearchPageLoginGate,
    awaitSecurityChallengeIfPresent: awaitSecurityChallengeIfPresent,
    buildAutomationAiPayload: buildAutomationAiPayload,
    buildMainCommentAbortResult: buildMainCommentAbortResult,
    checkAndClickOneClickLogin: checkAndClickOneClickLogin,
    clipTraceText: fn7,
    describeCommentLikeState: describeCommentLikeState,
    describeMainCommentInputEnvironment: describeMainCommentInputEnvironment,
    describeTaskAbortReason: describeTaskAbortReason,
    detectPageSecurityChallenge: detectPageSecurityChallenge,
    evaluateLeadLocationFilter: evaluateLeadLocationFilter,
    formatTaskLocationFilterSummary: formatTaskLocationFilterSummary,
    getAutomationTextHelpersModule: getAutomationTextHelpersModule,
    getCommentPlaceholderText: getCommentPlaceholderText,
    getIncludeTitleKeywordMatch: getIncludeTitleKeywordMatch,
    getLocationFilterModule: getLocationFilterModule,
    handleGlobalAutomationPopupsAndSecurity: handleGlobalAutomationPopupsAndSecurity,
    hasCommentLikeTakenEffect: fn26,
    hasLocalReplyTemplates: hasLocalReplyTemplates,
    hasVideoCommentTemplates: hasVideoCommentTemplates,
    incrementInteractionCount: incrementInteractionCount,
    isDouyinProfileTargetingEnabled: isDouyinProfileTargetingEnabled,
    isFatalAiAuthError: fn15,
    isInteractionLimitReached: isInteractionLimitReached,
    isMainCommentPlaceholderCandidate: isMainCommentPlaceholderCandidate,
    matchCurrentVideoForDy: matchCurrentVideoForDy,
    matchExcludedCommentKeyword: matchExcludedCommentKeyword,
    matchLeadProfileForDy: matchLeadProfileForDy,
    matchTitleKeywordList: fn31,
    parseTitleKeywordList: fn30,
    persistSessionInteractionCount: persistSessionInteractionCount,
    personalizeDmTemplate: fn16,
    prefetchAiMainPostComment: prefetchAiMainPostComment,
    prefetchKeywordReplyContents: prefetchKeywordReplyContents,
    prepareLeadsForAiAnalysis: prepareLeadsForAiAnalysis,
    reportCommentFlowTrace: reportCommentFlowTrace,
    reportCurrentAction: reportCurrentAction,
    reportProfileFirstTrace: reportProfileFirstTrace,
    reportTraceLog: reportTraceLog,
    resolveCommentLikeControlInNode: resolveCommentLikeControlInNode,
    resolveTaskEntryUrl: resolveTaskEntryUrl,
    resolveTaskLocationFilterRegions: resolveTaskLocationFilterRegions,
    scoreMainCommentPlaceholderCandidate: scoreMainCommentPlaceholderCandidate,
    shouldEnforceIncludeTitleKeywords: shouldEnforceIncludeTitleKeywords,
    shouldForceSelectByIncludeTitle: shouldForceSelectByIncludeTitle,
    shouldGenerateAiVideoMainPost: shouldGenerateAiVideoMainPost,
    shouldPrefetchMainPostWithVideoMatch: shouldPrefetchMainPostWithVideoMatch,
    shouldUseAiCommentAnalysis: shouldUseAiCommentAnalysis,
    shouldUseAiReplyGeneration: shouldUseAiReplyGeneration,
    shouldUseCommentKeywordFilter: shouldUseCommentKeywordFilter,
    shouldUsePersonaVideoFilter: shouldUsePersonaVideoFilter,
    shouldUseTextlessReplyPayload: shouldUseTextlessReplyPayload,
    shouldUseTextlessVideoCommentPayload: shouldUseTextlessVideoCommentPayload,
    snapshotCommentLikeControlState: snapshotCommentLikeControlState,
    taskLocationFilterEnabled: taskLocationFilterEnabled
  };
}
module.exports = {
  createAutomationRuntimeController: createAutomationRuntimeController
};
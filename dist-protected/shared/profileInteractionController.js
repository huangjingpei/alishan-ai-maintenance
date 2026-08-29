'use strict';

const {
  likeCurrentVideoSideAction,
  collectCurrentVideoSideAction,
  getVideoEngageSelector
} = require("./douyinVideoSideActions");
function createProfileInteractionController(options = {}) {
  const {
    PLATFORM_SELECTORS: platformSelectors,
    _normalizeTouchLogEntries: normalizeTouchLogEntries,
    applyEntryMetaToLead: applyEntryMetaToLead,
    applySubviewRuntimeTask: applySubviewRuntimeTask,
    clearPendingSubviewTask: clearPendingSubviewTask,
    clipTraceText: clipTraceText,
    detectMonitorPrivateProfile: detectMonitorPrivateProfile,
    emitLeadInteractionUpdate: emitLeadInteractionUpdate,
    emitSubviewActionCheckpoint: emitSubviewActionCheckpoint,
    findProfileVideoCards: findProfileVideoCards,
    findSmartElement: findSmartElement,
    getAutomationTextHelpersModule: getAutomationTextHelpersModule,
    getGatedTextPack: getGatedTextPack,
    getGatedVariantList: getGatedVariantList,
    getGatedString: getGatedString,
    getVideoEngagePack: getVideoEngagePack,
    getProfilePostListRoot: getProfilePostListRoot,
    getVideoIdFromPageUrl: getVideoIdFromPageUrl,
    hasDmRuntimeReady: hasDmRuntimeReady,
    hasProfileActionRuntimeReady: hasProfileActionRuntimeReady,
    hasRemoteGatedConfig: hasRemoteGatedConfig,
    ipcRenderer: ipcRenderer,
    isDouyinProfileTargetingEnabled: isDouyinProfileTargetingEnabled,
    isProfileFirstCommentAiMode: isProfileFirstCommentAiMode,
    isProfileFirstWorkCommentDone: isProfileFirstWorkCommentDone,
    isVisibleElement: isVisibleElement,
    localStorage: localStorage,
    markBatchProfileCommentDone: markBatchProfileCommentDone,
    markSubviewInteractionCancelled: markSubviewInteractionCancelled,
    matchLeadProfileForDy: matchLeadProfileForDy,
    mergeProfileInfoToLead: mergeProfileInfoToLead,
    normalizeProfileUrlForReturn: normalizeProfileUrlForReturn,
    normalizeUserUrl: normalizeUserUrl,
    parseProfileWorksCount: parseProfileWorksCount,
    performProfileActions: performProfileActions,
    performProfileFirstWorkComment: performProfileFirstWorkComment,
    performVideoMonitorFollow: performVideoMonitorFollow,
    persistScrapedLeadProfile: persistScrapedLeadProfile,
    persistSubviewTaskForResume: persistSubviewTaskForResume,
    personalizeDmTemplate: personalizeDmTemplate,
    pickReusableProfileDetail: pickReusableProfileDetail,
    profileHasNoPublicWorks: profileHasNoPublicWorks,
    randomDelay: randomDelay,
    recordLeadTouch: recordLeadTouch,
    reportCurrentAction: reportCurrentAction,
    reportProfileFirstTrace: reportProfileFirstTrace,
    reportTraceLog: reportTraceLog,
    restoreProfileAfterWarmup: restoreProfileAfterWarmup,
    safeSessionSet: safeSessionSet,
    sendDmOnCurrentProfile: sendDmOnCurrentProfile,
    settleFollowUpFromExistingActions: settleFollowUpFromExistingActions,
    shouldAbort: shouldAbort,
    simulateHumanClick: simulateHumanClick,
    simulateTrustedElementClick: simulateTrustedElementClick,
    simulateTrustedKey: simulateTrustedKey,
    sleep: sleep,
    waitForProfileWorksReady: waitForProfileWorksReady,
    wasBatchProfileCommentDone: wasBatchProfileCommentDone,
    withBackgroundAutomationLayout: withBackgroundAutomationLayout,
    preloadDir: preloadDir,
    state: state
  } = options;
  const local = preloadDir;
  function resolveFollowUpFlags(arg1) {
    return {
      canFollow: !!state.currentTask?.enableFollow && !!(arg1?.follows > 0) && !!(state.sessionFollowCount < state.sessionFollowLimit),
      canDM: !!state.currentTask?.enableDM && !!(arg1?.dms > 0) && !!(state.sessionDmCount < state.sessionDmLimit)
    };
  }
  async function applyFollowUpActions(arg1, arg2, arg3, arg4, arg5) {
    const local = state.currentTask.enableFollow && arg4.follows > 0 && state.sessionFollowCount < state.sessionFollowLimit;
    const local2 = state.currentTask.enableDM && arg4.dms > 0 && state.sessionDmCount < state.sessionDmLimit;
    if (arg2.actions?.followed || arg2.actions?.messaged) {
      return settleFollowUpFromExistingActions(arg2, arg4, arg5);
    }
    if (!local && !local2) {
      return false;
    }
    if (arg2.actions?.profileWorkCommented) {
      reportTraceLog("↪ @" + arg2.nickname + "：首作评论已完成，补开主页执行" + (local && local2 ? "关注+私信" : local ? "关注" : "私信") + "…");
    }
    const result = await performProfileActions(arg1, arg2, arg3, local, local2);
    if (result?.isPrivate || result?.skipReason && String(result.skipReason).includes("私密账号")) {
      const local = result.skipReason || "对方账号设置了隐私，未执行关注/私信";
      mergeProfileInfoToLead(arg2, result);
      arg2.isPrivate = true;
      reportTraceLog("🔒 @" + arg2.nickname + "：" + local, arg2.accountId, "warning");
      emitLeadInteractionUpdate(arg2, {
        actionSkipReason: local,
        isPrivate: true,
        interactionResolved: true
      });
      arg5();
      return false;
    }
    if (!result || !result.followed && !result.messaged) {
      if (result?.skipReason) {
        reportTraceLog("⏭ @" + arg2.nickname + "：" + result.skipReason, arg2.accountId, "warning");
        emitLeadInteractionUpdate(arg2, {
          actionSkipReason: result.skipReason,
          interactionResolved: true
        });
      }
      return false;
    }
    arg2.actions = arg2.actions || {};
    if (result.followed) {
      arg2.actions.followed = true;
    }
    if (result.messaged) {
      arg2.actions.messaged = true;
      arg2.actions.dmSkipped = !!result.dmSkipped;
      if (result.dmContent) {
        arg2.actions.dmContent = result.dmContent;
      }
    }
    const result2 = settleFollowUpFromExistingActions(arg2, arg4, arg5);
    mergeProfileInfoToLead(arg2, result);
    return result2;
  }
  function fn3(arg1) {
    const result = (arg1 || "").split(", ");
    for (const item of result) {
      if (!item || item.includes(":contains") || item.includes(":has-text")) {
        continue;
      }
      try {
        const result = Array.from(document.querySelectorAll(item)).find(isVisibleElement);
        if (result) {
          return result;
        }
      } catch (error) {}
    }
    return null;
  }
  function findSmartElementQuiet(arg1, text = "douyin.com") {
    if (["profileFollowBtn", "profileMessageBtn"].includes(arg1) && (typeof hasProfileActionRuntimeReady !== "function" || !hasProfileActionRuntimeReady())) {
      return null;
    }
    if (["dmInput", "dmSendBtn"].includes(arg1) && (typeof hasDmRuntimeReady !== "function" || !hasDmRuntimeReady())) {
      return null;
    }
    if (!hasRemoteGatedConfig()) {
      console.warn("[Security-Preload] config not ready, reject findSmartElementQuiet for: " + arg1);
      return null;
    }
    if (arg1 === "profileFollowBtn") {
      const result = findProfileFollowButtonByText(false);
      if (result) {
        return result;
      }
    }
    if (arg1 === "profileMessageBtn") {
      const result = findProfileMessageButtonByText(false);
      if (result) {
        return result;
      }
    }
    const local = platformSelectors[text] || {};
    const result = fn3(local[arg1]);
    if (result) {
      return result;
    }
    const result2 = arg1.toLowerCase();
    if (result2 === "dminput") {
      return null;
    }
    let list = [];
    if (result2.includes("follow")) {
      list = getGatedVariantList("followVariants");
    } else if (result2.includes("message")) {
      list = getGatedVariantList("messageVariants");
    } else if (result2.includes("send")) {
      list = getGatedTextPack("dmSend").exactTexts;
    }
    if (!list.length && (result2.includes("follow") || result2.includes("message") || result2.includes("send"))) {
      if (!hasRemoteGatedConfig()) {
        console.warn("[Built-in-Debug] [RuntimeConfig] gated 文案未就绪，跳过按钮文本匹配");
      }
      return null;
    }
    if (list.length === 0) {
      return null;
    }
    const result3 = getGatedString("actionButtonCandidates");
    if (!result3) {
      return null;
    }
    let list2 = [];
    try {
      list2 = Array.from(document.querySelectorAll(result3));
    } catch (error) {
      return null;
    }
    return list2.find(arg1 => {
      const result = (arg1.innerText || arg1.textContent || "").trim();
      return isVisibleElement(arg1) && list.some(arg1 => result.includes(arg1));
    }) || null;
  }
  function fn7(arg1) {
    return (arg1?.innerText || arg1?.textContent || "").replace(/\s+/g, "").trim();
  }
  function fn8(arg1) {
    if (!arg1) {
      return null;
    }
    const result = getGatedString("actionClickableRoot");
    if (!result) {
      return null;
    }
    try {
      return arg1.closest?.(result) || null;
    } catch (error) {
      return null;
    }
  }
  function getElementClassText(arg1) {
    const local = arg1?.className || "";
    if (typeof local === "string") {
      return local;
    } else {
      return String(local?.baseVal || local || "");
    }
  }
  function fn10(arg1, num = 5) {
    const list = [];
    let local = arg1;
    for (let num2 = 0; num2 < num && local && local !== document.body; num2++) {
      list.push(local.getAttribute?.("data-e2e") || "");
      list.push(getElementClassText(local));
      const result = (local.innerText || local.textContent || "").replace(/\s+/g, " ").trim();
      if (result && result.length < 500) {
        list.push(result);
      }
      local = local.parentElement;
    }
    return list.join(" ");
  }
  function fn11(options = {}) {
    const {
      exactTexts = [],
      preferredTexts = [],
      logPrefix = "主页动作按钮",
      verbose = true,
      minScore = 150
    } = options;
    const result = fn3(platformSelectors["douyin.com"]?.profileName || "");
    const local = result?.getBoundingClientRect?.() || null;
    const result2 = fn7({
      innerText: state.currentTask?.lead?.nickname || state.currentTask?.nickname || ""
    });
    const local2 = window.innerHeight || 900;
    const set = new Set();
    const list = [];
    const result3 = getGatedString("actionButtonCandidates");
    if (!result3) {
      return null;
    }
    let list2 = [];
    try {
      list2 = Array.from(document.querySelectorAll(result3));
    } catch (error) {
      return null;
    }
    const local3 = (arg1, arg2) => {
      const result = getGatedString(arg1);
      if (!result) {
        return false;
      }
      try {
        return new RegExp(result).test(String(arg2 || ""));
      } catch (error) {
        return false;
      }
    };
    const result4 = getGatedString("profileRejectOverlaySelector");
    const result5 = getGatedString("profileRejectNoticeSelector");
    for (const item of list2) {
      const result = fn8(item);
      if (!result || set.has(result) || !isVisibleElement(result)) {
        continue;
      }
      set.add(result);
      const result3 = fn7(item);
      const result6 = fn7(result);
      const value = exactTexts.includes(result3) ? result3 : result6;
      if (!exactTexts.includes(value)) {
        continue;
      }
      if (result.getAttribute?.("aria-disabled") === "true" || result.disabled) {
        continue;
      }
      const result7 = result.getBoundingClientRect();
      const result8 = getElementClassText(result);
      const result9 = fn10(result);
      const result10 = result9.replace(/\s+/g, "");
      const value2 = result7.top + result7.height / 2;
      let num = 100;
      if (preferredTexts.includes(value)) {
        num += 40;
      }
      if (result.tagName === "BUTTON") {
        num += 25;
      }
      if (result8.includes("semi-button")) {
        num += 15;
      }
      if (result7.top < local2 * 0.28) {
        num += 35;
      } else if (result7.top < local2 * 0.45) {
        num += 15;
      } else {
        num -= 35;
      }
      if (result7.width >= 44 && result7.height >= 26) {
        num += 10;
      } else {
        num -= 20;
      }
      if (local) {
        const value = local.top + local.height / 2;
        const result = Math.abs(value2 - value);
        if (result < 120) {
          num += 90;
        } else if (result < 240) {
          num += 45;
        } else if (result > 420) {
          num -= 70;
        }
        if (result7.top < local.top - 100) {
          num -= 25;
        }
        if (result7.top > local.bottom + 320) {
          num -= 45;
        }
      }
      if (result2 && result10.includes(result2)) {
        num += 80;
      }
      if (local3("profilePositiveContextPattern", result9)) {
        num += 35;
      }
      if (local3("profileRejectContextPattern", result9)) {
        num -= 55;
      }
      if (result4 && result.closest?.(result4)) {
        num -= 70;
      }
      if (result5 && result.closest?.(result5)) {
        num -= 120;
      }
      list.push({
        root: result,
        text: value,
        score: num,
        rect: result7,
        contextText: result9
      });
    }
    list.sort((arg1, arg2) => arg2.score - arg1.score || arg1.rect.top - arg2.rect.top || arg2.rect.width - arg1.rect.width);
    if (list[0]) {
      if (verbose) {
        list.slice(0, 5).forEach((arg1, arg2) => {
          console.log("[Built-in-Debug] [" + logPrefix + "候选 " + (arg2 + 1) + "] score=" + Math.round(arg1.score) + ", Text=\"" + arg1.text + "\", Tag=" + arg1.root.tagName + ", Rect=" + Math.round(arg1.rect.width) + "x" + Math.round(arg1.rect.height) + "@(" + Math.round(arg1.rect.left) + "," + Math.round(arg1.rect.top) + "), Class=\"" + clipTraceText(getElementClassText(arg1.root), 50) + "\", Hint=\"" + clipTraceText(arg1.contextText, 80) + "\"");
        });
      }
      if (list[0].score < minScore) {
        if (verbose) {
          console.warn("[Built-in-Debug] [" + logPrefix + "精确识别] 候选分数过低(" + Math.round(list[0].score) + ")，疑似非主页头部按钮，跳过");
        }
        return null;
      }
      if (verbose) {
        console.log("[Built-in-Debug] [" + logPrefix + "精确命中] score=" + Math.round(list[0].score) + ", Text=\"" + list[0].text + "\", Tag=" + list[0].root.tagName + ", Class=\"" + getElementClassText(list[0].root) + "\"");
      }
      return list[0].root;
    }
    return null;
  }
  function findProfileMessageButtonByText(flag = true) {
    if (typeof hasProfileActionRuntimeReady !== "function" || !hasProfileActionRuntimeReady()) {
      return null;
    }
    const result = getGatedTextPack("profileMessage");
    if (!result.exactTexts.length) {
      if (flag) {
        console.warn("[Built-in-Debug] [RuntimeConfig] profileMessage 文案未下发，无法定位私信按钮");
      }
      return null;
    }
    return fn11({
      exactTexts: result.exactTexts,
      preferredTexts: result.preferredTexts,
      logPrefix: "私信按钮",
      verbose: flag,
      minScore: 150
    });
  }
  function findProfileFollowButtonByText(flag = true) {
    if (typeof hasProfileActionRuntimeReady !== "function" || !hasProfileActionRuntimeReady()) {
      return null;
    }
    const result = getGatedTextPack("profileFollow");
    if (!result.exactTexts.length) {
      if (flag) {
        console.warn("[Built-in-Debug] [RuntimeConfig] profileFollow 文案未下发，无法定位关注按钮");
      }
      return null;
    }
    return fn11({
      exactTexts: result.exactTexts,
      preferredTexts: result.preferredTexts,
      logPrefix: "关注按钮",
      verbose: flag,
      minScore: 145
    });
  }
  function fn12(arg1) {
    const value = platformSelectors["douyin.com"];
    const value2 = document.body;
    const result = (value2?.innerText || value2?.textContent || "").trim();
    const result2 = (() => {
      const value = typeof getGatedString === "function" ? getGatedString("profileReadyPattern") : "";
      if (!value) {
        return false;
      }
      try {
        return new RegExp(value).test(result);
      } catch (error) {
        return false;
      }
    })();
    const local = arg1.canFollow && findSmartElementQuiet("profileFollowBtn") || arg1.canDM && findSmartElementQuiet("profileMessageBtn");
    const result3 = fn3(value.profileName);
    let text = "";
    if (result3) {
      text = "profile_name";
    } else if (local) {
      text = "profile_action";
    } else if (result.length > 30 && result2) {
      text = "profile_text";
    }
    let local2 = null;
    let flag = false;
    let flag2 = false;
    if (!text && arg1?.canCommentFirstWork) {
      try {
        const result2 = getProfilePostListRoot();
        const local = result2?.querySelector?.("a[href*=\"/video/\"], a[href*=\"/note/\"], [data-e2e=\"user-post-item\"], [role=\"listitem\"]");
        flag = !!local && !!isVisibleElement(local);
        if (!flag) {
          local2 = parseProfileWorksCount();
        }
        flag2 = local2 === 0 || /暂无作品|还没有发布作品|还没有发布过|暂未发布作品|Ta还没有发布|TA还没有发布|该用户还未发布|暂无内容/.test(result.slice(0, 8000));
      } catch (error) {}
    }
    if (!text && flag) {
      text = "works_grid";
    } else if (local2 !== null) {
      text = "works_count_" + local2;
    } else if (flag2) {
      text = "works_empty";
    }
    return {
      ready: !!text,
      reason: text || "none",
      bodyChars: result.length,
      worksCount: local2,
      hasWorkCard: flag,
      noWorks: flag2,
      documentReadyState: document.readyState || "unknown"
    };
  }
  function fn13(arg1) {
    return fn12(arg1).ready;
  }
  async function fn14(arg1, arg2, num = 60000) {
    const result = Date.now();
    let num2 = 0;
    let num3 = 0;
    const result2 = extractUserIdFromUrl(arg1?.lead?.userUrl || "");
    const local = !!arg1?.isBatchAction || !!arg1?.batchConfig;
    while (Date.now() - result < num) {
      if (shouldAbort(arg2)) {
        throw new Error("TASK_ABORTED");
      }
      const value = document.body;
      const local2 = value?.getBoundingClientRect?.();
      const local3 = document.documentElement?.getBoundingClientRect?.();
      const value2 = window.location.href;
      const result3 = value2.includes("/user/");
      const result4 = Number(window.innerWidth || 0);
      const result5 = Number(window.innerHeight || 0);
      const local4 = !!local2 && !!(local2.width > 0) && !!(local2.height > 0);
      const local5 = !!local3 && !!(local3.width > 0) && !!(local3.height > 0);
      const local6 = result4 > 0 && result5 > 0;
      const result6 = Boolean(value && (local4 || local5 || local6));
      if (result3 && result2) {
        const result = extractUserIdFromUrl(value2);
        if (result && result !== result2) {
          if (Date.now() - num2 > 2000) {
            console.warn("[子视图任务] 当前主页 UID(" + result + ") 与目标(" + result2 + ") 不一致，继续等待导航…");
            num2 = Date.now();
          }
          await sleep(300);
          continue;
        }
      }
      if (result6) {
        const result2 = fn12(arg1);
        if (result3 && result2.ready) {
          console.log("%c[页面就绪] 目标用户主页加载完成", "color: #94a3b8; font-style: italic;");
          reportCurrentAction("主页跟进：主页已就绪（" + result2.reason + (result2.worksCount !== null ? "，作品数=" + result2.worksCount : "") + "）");
          await sleep(1200);
          return true;
        }
        if (arg1?.canCommentFirstWork && result3) {
          try {
            const result = profileHasNoPublicWorks();
            if (result.noWorks) {
              console.log("%c[页面就绪] 检测到目标主页作品数为 0，跳过渲染长等待", "color: #94a3b8; font-style: italic;");
              reportCurrentAction((arg1?.profileFirstCommentFallbackMode || "reply") === "skip" ? "主页跟进：检测到作品数为 0，仅首作评论模式将跳过回复..." : "主页跟进：检测到作品数为 0，准备回退为回复原评论...");
              return true;
            }
          } catch (error) {}
        }
        const local2 = document.querySelector("[data-e2e=\"error-page\"]") || document.querySelector(".Ms08YIEh");
        const local3 = value.innerText || value.textContent || "";
        const flag = !/抖音号|获赞|粉丝|关注|作品|喜欢/.test(local3);
        const local4 = local2 || flag && /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(local3);
        if (local4) {
          console.warn("%c[页面就绪] 检测到目标用户页面显示异常（无此用户/封禁等），立即中止任务！", "color: #ef4444; font-weight: bold;");
          throw new Error("USER_NOT_FOUND");
        }
        const value2 = Date.now() - result;
        const local5 = document.readyState === "interactive" || document.readyState === "complete";
        if (arg1?.canCommentFirstWork && result3 && local5 && result2.bodyChars > 30 && value2 > 6000) {
          console.warn("[子视图任务] 主页旧版就绪信号未命中，转入作品区专用探测");
          reportCurrentAction("主页跟进：基础内容已渲染，转入作品区探测（ready=" + result2.reason + "，text=" + result2.bodyChars + "）...");
          return true;
        }
        if (!local && !arg1?.canCommentFirstWork && result3 && result6 && local5 && value2 > 9000) {
          console.warn("[子视图任务] 主页就绪信号等待超过 9 秒，降级继续执行关注/私信动作");
          reportCurrentAction("主页跟进：主页信号等待较久，尝试继续执行后续动作...");
          return true;
        }
      }
      if (Date.now() - num2 > 5000) {
        console.log("%c[子视图任务] 等待主页渲染中... (URL: " + window.location.href.split("?")[0] + ")", "color: #94a3b8; font-style: italic;");
        num2 = Date.now();
      }
      if (Date.now() - num3 > 5000) {
        const result3 = Math.round((Date.now() - result) / 1000);
        let text = "";
        try {
          const result = fn12(arg1);
          const local = extractUserIdFromUrl(window.location.href) || "none";
          const value = "body=" + Math.round(local2?.width || 0) + "x" + Math.round(local2?.height || 0) + "/html=" + Math.round(local3?.width || 0) + "x" + Math.round(local3?.height || 0) + "/vp=" + result4 + "x" + result5;
          text = "，uid=" + (local === result2 ? "match" : clipTraceText(local, 18)) + "，doc=" + result.documentReadyState + "，text=" + result.bodyChars + "，works=" + (result.worksCount ?? "unknown") + "，card=" + (result.hasWorkCard ? 1 : 0) + "，layout=" + value;
        } catch (error) {}
        reportCurrentAction("主页跟进：等待主页渲染中（" + result3 + "s" + text + "）...");
        num3 = Date.now();
      }
      await sleep(300);
    }
    if (!local && window.location.href.includes("/user/")) {
      console.warn("[子视图任务] 主页就绪等待超时，但仍在用户主页，降级继续执行后续流程");
      reportCurrentAction("主页跟进：主页渲染等待超时，尝试继续执行后续动作...");
      return true;
    }
    throw new Error("PROFILE_READY_TIMEOUT");
  }
  async function waitForSmartElement(arg1, arg2, num = 15000) {
    const result = Date.now();
    while (Date.now() - result < num) {
      if (shouldAbort(arg2)) {
        throw new Error("TASK_ABORTED");
      }
      const local = findSmartElementQuiet(arg1) || findSmartElement(arg1);
      if (local && isVisibleElement(local)) {
        return local;
      }
      await sleep(600);
    }
    return null;
  }
  function fn17(arg1) {
    const local = arg1?.__profileFirstResume;
    if (!local || local.phase !== "video_detail") {
      return null;
    }
    if (local.interactionId && arg1?.interactionId && String(local.interactionId) !== String(arg1.interactionId)) {
      return null;
    }
    const result = Number(local.createdAt || 0);
    if (!result || Date.now() - result > 420000) {
      return null;
    }
    return local;
  }
  async function fn18({
    task: task,
    lead: lead,
    loopId: loopId,
    isBatch: isBatch,
    detailInfo: detailInfo,
    followedNow: followedNow,
    batchCommentOpts: batchCommentOpts,
    resumeState = null
  }) {
    const result = await performProfileFirstWorkComment(lead, loopId, {
      ...(batchCommentOpts || {}),
      resumeState: resumeState,
      resumeContext: {
        isBatch: !!isBatch,
        detailInfo: detailInfo || {},
        followedNow: !!followedNow
      }
    });
    if (result.worksCount !== undefined && result.worksCount !== null) {
      lead.worksCount = result.worksCount;
    }
    if (result.noWorks || lead.worksCount === 0) {
      lead.worksCount = result.worksCount ?? 0;
      reportProfileFirstTrace("@" + lead.nickname + " 执行中检测到无作品，未触达", lead.accountId);
      const value = Math.floor(Math.random() * 5000) + 3000;
      reportProfileFirstTrace("@" + lead.nickname + " 无公开作品，拟真停留 " + (value / 1000).toFixed(1) + " 秒...", lead.accountId);
      await sleep(value);
      return {
        success: false,
        noWorks: true,
        skipped: !isBatch,
        skipReason: "作品数为0",
        error: isBatch ? "作品数为0" : "",
        followed: !!followedNow,
        ...(detailInfo || {}),
        worksCount: lead.worksCount
      };
    }
    if (result.success) {
      if (result.workLiked) {
        recordLeadTouch(lead, "like", {
          content: "首作作品点赞"
        });
        emitSubviewActionCheckpoint(lead, "首作作品点赞");
      }
      if (result.workCollected) {
        emitSubviewActionCheckpoint(lead, "首作作品收藏");
      }
      recordLeadTouch(lead, "profileComment", {
        content: result.content || "已评论"
      });
      emitSubviewActionCheckpoint(lead, "首作评论");
      reportProfileFirstTrace("@" + lead.nickname + " 已完成 →「" + clipTraceText(result.content || "已评论", 32) + "」", lead.accountId);
      const result2 = (lead.touchLog || []).find(arg1 => arg1.type === "profileComment");
      const local = Number(result2?.at || 0) || Date.now();
      const result3 = Math.max(0, ...(lead.touchLog || []).map(arg1 => Number(arg1.at || arg1.timestamp || 0)));
      const obj = {
        success: true,
        content: result.content,
        profileWorkCommented: true,
        workLiked: !!result.workLiked,
        workCollected: !!result.workCollected,
        followed: !!followedNow,
        ...(detailInfo || {}),
        worksCount: lead.worksCount,
        touchCounts: lead.touchCounts,
        touchLog: lead.touchLog,
        profileCommentAt: local,
        lastTouchAt: result3
      };
      if (isBatch) {
        markBatchProfileCommentDone(task);
        try {
          ipcRenderer.send("interaction-success-checkpoint", {
            viewKey: state.currentViewKey,
            interactionId: task.interactionId,
            batchRunId: task.batchRunId,
            results: obj
          });
        } catch (error) {}
      }
      return obj;
    }
    reportProfileFirstTrace("@" + lead.nickname + " 失败（" + clipTraceText(result.error || "首作评论失败", 40) + "）", lead.accountId);
    return {
      success: false,
      error: result.error || "首作评论失败",
      followed: !!followedNow,
      ...(detailInfo || {}),
      worksCount: lead.worksCount
    };
  }
  async function fn19(arg1, arg2) {
    const value = arg1.lead;
    const local = !!arg1.isBatchAction || arg1.batchConfig?.type === "profile_first_comment";
    if (local && (wasBatchProfileCommentDone(arg1) || !!value?.actions?.profileWorkCommented || Number(value?.touchCounts?.profileComment || 0) > 0)) {
      reportProfileFirstTrace("@" + (value?.nickname || "?") + " 本轮已首作评论成功，跳过重复发表", value?.accountId);
      markBatchProfileCommentDone(arg1);
      return {
        success: true,
        profileWorkCommented: true,
        alreadyProfileCommented: true,
        content: value?.replyContent || value?.actions?.replyContent || "",
        worksCount: value?.worksCount,
        touchCounts: value?.touchCounts,
        touchLog: value?.touchLog,
        profileCommentAt: value?.profileCommentAt || Date.now()
      };
    }
    const result = fn17(arg1);
    if (result) {
      value.worksCount = Number(result.worksCount ?? value.worksCount ?? 0);
      reportCurrentAction("主页首作评论：恢复 @" + value.nickname + " 已打开的作品详情", value.accountId);
      reportProfileFirstTrace("@" + value.nickname + " 导航后从作品详情继续（interactionId=" + clipTraceText(arg1.interactionId || "?", 24) + "），不重复读取主页和生成任务", value.accountId);
      const result2 = await fn18({
        task: arg1,
        lead: value,
        loopId: arg2,
        isBatch: local,
        detailInfo: result.detailInfo || {},
        followedNow: !!result.followedNow,
        batchCommentOpts: result.batchCommentOpts || {},
        resumeState: result
      });
      result2.followAttempted = !!arg1.canFollow;
      return result2;
    }
    console.log("%c[主页首作评论] 正在处理: " + value.nickname + (local ? " (线索库批量)" : " (获客跟进)"), "color: #a78bfa; font-weight: bold;");
    reportCurrentAction("主页首作评论：读取 @" + value.nickname + " 主页", value.accountId);
    reportProfileFirstTrace("@" + value.nickname + " 开始" + (local ? "（线索库批量）" : "（获客跟进）"), value.accountId);
    applyEntryMetaToLead(value);
    const value2 = local ? resolveTaskGenderFilter(arg1) : resolveProfileFirstGenderFilter(arg1);
    const result2 = await scrapeDetailedProfile({
      genderFilter: value2,
      loopId: arg2
    });
    persistScrapedLeadProfile(value, result2, arg1, {
      emit: false
    });
    const result3 = parseProfileWorksCount();
    if (result3 !== null && result3 !== undefined) {
      value.worksCount = result3;
    }
    const result4 = evaluateTaskGenderFilter(result2.gender, value2);
    const value3 = local ? arg1 : fn24(arg1);
    const value4 = isBatchAgeFilterActive(value3) ? formatAgeFilterRangeLabel(value3) : "关闭";
    const value5 = result2.genderTimedOut ? "（等待" + ((Number(result2.genderWaitMs) || 0) / 1000).toFixed(1) + "s仍未知）" : "";
    reportProfileFirstTrace("@" + value.nickname + " 目标筛选：性别 " + result4.filterLabel + "（识别 " + result4.observedLabel + value5 + "）；年龄 " + value4 + "（识别 " + formatObservedAgeLabel(result2) + "）", value.accountId);
    if (result2.genderUnresolved) {
      const text = "性别尚未识别完成（主页加载偏慢），已跳过以免误判";
      reportProfileFirstTrace("@" + value.nickname + " " + text, value.accountId);
      const value2 = Math.floor(Math.random() * 5000) + 3000;
      await sleep(value2);
      return {
        success: local ? false : true,
        skipped: !local,
        profileFirstTargetFiltered: true,
        skipReason: text,
        error: local ? text : "",
        ...result2,
        worksCount: value.worksCount
      };
    }
    if (!result4.pass) {
      reportProfileFirstTrace("@" + value.nickname + " " + result4.reason + "，" + (local ? "记为失败" : "已跳过"), value.accountId);
      const value2 = Math.floor(Math.random() * 5000) + 3000;
      reportProfileFirstTrace("@" + value.nickname + " 性别不符，拟真停留 " + (value2 / 1000).toFixed(1) + " 秒...", value.accountId);
      await sleep(value2);
      return {
        success: local ? false : true,
        skipped: !local,
        profileFirstTargetFiltered: true,
        skipReason: result4.reason,
        error: local ? result4.reason : "",
        ...result2,
        worksCount: value.worksCount
      };
    }
    if (isBatchAgeFilterActive(value3)) {
      const result = checkBatchAgeFilter(result2, value3);
      if (!result.pass) {
        reportProfileFirstTrace("@" + value.nickname + " " + result.reason + "，" + (local ? "记为失败" : "已跳过"), value.accountId);
        const value2 = Math.floor(Math.random() * 5000) + 3000;
        reportProfileFirstTrace("@" + value.nickname + " 年龄不符，拟真停留 " + (value2 / 1000).toFixed(1) + " 秒...", value.accountId);
        await sleep(value2);
        return {
          success: local ? false : true,
          skipped: !local,
          profileFirstTargetFiltered: true,
          skipReason: result.reason,
          error: local ? result.reason : "",
          ...result2,
          worksCount: value.worksCount
        };
      }
    }
    if (result2.isPrivate) {
      const text = "对方账号设置了隐私，未执行关注/私信/首作评论";
      reportProfileFirstTrace("@" + value.nickname + " " + text, value.accountId);
      const value2 = Math.floor(Math.random() * 5000) + 3000;
      reportProfileFirstTrace("@" + value.nickname + " 私密账号，拟真停留 " + (value2 / 1000).toFixed(1) + " 秒...", value.accountId);
      await sleep(value2);
      return {
        success: true,
        skipped: true,
        skipReason: text,
        ...result2,
        worksCount: value.worksCount
      };
    }
    if (value.worksCount === 0) {
      reportProfileFirstTrace("@" + value.nickname + " 作品数为0，未触达", value.accountId);
      const value2 = Math.floor(Math.random() * 5000) + 3000;
      reportProfileFirstTrace("@" + value.nickname + " 无公开作品，拟真停留 " + (value2 / 1000).toFixed(1) + " 秒...", value.accountId);
      await sleep(value2);
      return {
        success: false,
        noWorks: true,
        skipped: !local,
        skipReason: "作品数为0",
        error: local ? "作品数为0" : "",
        ...result2,
        worksCount: 0
      };
    }
    const result5 = isProfileFirstCommentAiMode(arg1);
    if (!local && result5 && isDouyinProfileTargetingEnabled(arg1)) {
      const result = await matchLeadProfileForDy(value, arg1.videoTitle || value.videoTitle || value.title || "", arg2, arg1);
      if (result?.pass === false) {
        value.isHighIntention = false;
        value.aiThought = result.reason || "主页画像判断不匹配";
        const value2 = Math.floor(Math.random() * 5000) + 3000;
        reportProfileFirstTrace("@" + value.nickname + " 画像不匹配，拟真停留 " + (value2 / 1000).toFixed(1) + " 秒...", value.accountId);
        await sleep(value2);
        return {
          success: true,
          skipped: true,
          targetRejected: true,
          skipReason: "非目标人群",
          targetReason: result.reason || "主页画像判断不匹配",
          targetScore: result.score,
          ...result2,
          worksCount: value.worksCount
        };
      }
    }
    reportProfileFirstTrace("@" + value.nickname + " 主页作品数=" + value.worksCount + "，准备评论首个", value.accountId);
    const local2 = !!arg1.enableCommentWithoutText || !!arg1.batchConfig?.enableCommentWithoutText;
    const result6 = (arg1.commentTemplate || arg1.commentContent || arg1.batchConfig?.commentTemplate || "").trim();
    const result7 = (arg1.videoCommentContent || "").trim();
    const local3 = result6 || result7;
    if (result5) {
      applySubviewRuntimeTask({
        ...arg1,
        aiReplyMode: true,
        profileFirstCommentUseAi: true,
        enableCommentWithoutText: local2
      });
    } else {
      applySubviewRuntimeTask({
        ...arg1,
        commentContent: result6 || arg1.commentContent || "",
        videoCommentContent: result7 || result6 || arg1.videoCommentContent || "",
        aiReplyMode: false,
        profileFirstCommentUseAi: false,
        enableCommentWithoutText: local2
      });
    }
    const value6 = local2 ? {
      templateText: "",
      forceTemplateOnly: true
    } : result5 ? {
      forceAi: true
    } : local3 ? {
      templateText: local3,
      forceTemplateOnly: true
    } : {};
    console.log("%c[主页首作评论] 文案模式: " + (local2 ? "不发文字" : result5 ? "AI智能体" : "固定模板") + " (aiReplyMode=" + !!state.currentTask?.aiReplyMode + ", aiRole=" + !!state.currentTask?.aiRole + ")", "color: #a78bfa; font-weight: bold;");
    reportProfileFirstTrace("@" + value.nickname + " 文案模式=" + (local2 ? "不发文字" : result5 ? "AI智能体" : "固定模板") + "（aiReplyMode=" + !!state.currentTask?.aiReplyMode + "，aiRole=" + !!state.currentTask?.aiRole + "，noText=" + local2 + "）", value.accountId);
    let flag = false;
    if (arg1.canFollow) {
      reportProfileFirstTrace("@" + value.nickname + " 先在主页执行关注，再评论首作", value.accountId);
      const result = await performProfileActionsLogic(value, arg2, true, false, arg1.dmContent, false, arg1, result2);
      flag = !!result?.followed;
      if (flag) {
        reportProfileFirstTrace("@" + value.nickname + " 关注成功", value.accountId);
        await fn30(arg2, arg1, value);
      } else if (result?.skipped) {
        reportProfileFirstTrace("@" + value.nickname + " " + clipTraceText(result.skipReason || "不符合关注筛选", 36) + "，未执行关注", value.accountId);
      } else if (result?.error) {
        reportProfileFirstTrace("@" + value.nickname + " 关注未成功（" + clipTraceText(result.error, 24) + "）", value.accountId);
        await sleep(1000);
      } else {
        await sleep(1000);
      }
    }
    const result8 = await fn18({
      task: arg1,
      lead: value,
      loopId: arg2,
      isBatch: local,
      detailInfo: result2,
      followedNow: flag,
      batchCommentOpts: value6
    });
    result8.followAttempted = !!arg1.canFollow;
    return result8;
  }
  async function fn31(arg1) {
    const result = String(arg1?.interactionId || "").trim();
    if (state.subviewTaskStarted && result && state.activeSubviewInteractionId === result) {
      console.warn("[子视图任务] 忽略重复启动 interactionId=" + result);
      reportProfileFirstTrace("忽略重复任务（interactionId=" + clipTraceText(result, 24) + "）", arg1?.lead?.accountId);
      return;
    }
    const local = ++state.subviewTaskSeq;
    if (state.subviewTaskStarted) {
      if (state.activeSubviewInteractionId) {
        markSubviewInteractionCancelled(state.activeSubviewInteractionId);
      }
      console.warn("[子视图任务] 新任务抢占上一任务，开始处理 @" + (arg1.lead?.nickname || "?") + " (seq=" + local + ")");
    }
    if (arg1.lead?.userUrl && !fn32(arg1)) {
      const local = extractUserIdFromUrl(window.location.href) || "?";
      const local2 = extractUserIdFromUrl(arg1.lead.userUrl) || "?";
      console.warn("[子视图任务] 主页 UID 不匹配，拒绝执行：当前=" + local + "，目标=" + local2);
      clearPendingSubviewTask();
      ipcRenderer.send("interaction-done", {
        viewKey: state.currentViewKey,
        interactionId: arg1.interactionId,
        batchRunId: arg1.batchRunId,
        results: {
          followed: false,
          messaged: false,
          error: "profile_url_mismatch"
        }
      });
      return;
    }
    state.subviewTaskStarted = true;
    const local2 = result || "seq-" + local;
    state.activeSubviewInteractionId = local2;
    state.cancelledSubviewInteractionIds.delete(local2);
    if (arg1.viewKey) {
      state.currentViewKey = arg1.viewKey;
      safeSessionSet("radar_view_key", arg1.viewKey);
    }
    console.log("%c[子视图任务] 正在处理线索：" + arg1.lead.nickname, "color: #fff; background: #8b5cf6; font-weight: bold; padding: 4px;");
    console.log("%c[执行策略] 预热=" + (arg1.enableWarmup ? "开启" : "关闭") + (arg1.__warmupRestored ? "（已完成）" : "") + ", 关注=" + (arg1.canFollow ? "开启" : "关闭") + ", 私信=" + (arg1.canDM ? "开启" : "关闭") + ", 主页首作评论=" + (arg1.canCommentFirstWork ? "开启" : "关闭"), "color: #a78bfa; font-style: italic;");
    applySubviewRuntimeTask(arg1);
    arg1 = state.currentTask;
    const value = state.activeLoopId;
    state.pausedForSubview = false;
    state.stopRequested = false;
    state.taskRunning = true;
    state.activeLoopId = "SUBVIEW_TASK";
    const local3 = async () => {
      try {
        let num = 60000;
        if (arg1.isBatchAction || arg1.batchConfig) {
          const result = Number(arg1.__batchProfileOpenDeadline || 0);
          num = result > 0 ? Math.max(1000, result - Date.now()) : 30000;
        }
        const result = fn17(arg1);
        if (result) {
          reportProfileFirstTrace("检测到同一 interactionId 的详情续跑阶段，跳过主页二次就绪与画像读取", arg1?.lead?.accountId);
        } else {
          await fn14(arg1, state.activeLoopId, num);
        }
        try {
          ipcRenderer.send("interaction-profile-ready", {
            viewKey: state.currentViewKey,
            interactionId: arg1.interactionId,
            batchRunId: arg1.batchRunId
          });
        } catch (error) {}
        if (arg1.canCommentFirstWork) {
          const result = await fn19(arg1, state.activeLoopId);
          const local2 = !result?.targetRejected && !result?.profileFirstTargetFiltered && !result?.demographicFilterFailed && !result?.isPrivate && local === state.subviewTaskSeq;
          const local3 = !!arg1.canFollow && !result?.followAttempted;
          const flag = !!arg1.canDM;
          if (local2 && (local3 || flag)) {
            console.log("%c[主页跟进] 复用当前子视图，继续完成" + (local3 && flag ? "关注+私信" : local3 ? "关注" : "私信"), "color: #fff; background: #6366f1; padding: 2px 4px; border-radius: 2px;");
            const local = arg1.lead?.nickname || "";
            const local2 = arg1.lead?.accountId;
            const value = local3 && flag ? "关注+私信" : local3 ? "关注" : "私信";
            reportCurrentAction("复用当前主页，继续" + value + " @" + local, local2);
            reportTraceLog("↪ @" + local + "：不重新打开主页，继续" + value + "…", local2);
            try {
              const result2 = await fn33(state.activeLoopId);
              if (!result2) {
                if (flag) {
                  result.messaged = false;
                }
                result.followUpError = "profile_work_detail_close_failed";
              } else {
                if (isProfileFirstWorkCommentDone(result)) {
                  reportTraceLog("📨 @" + local + "：已回当前主页，拟真停留后继续" + value + "…", local2);
                  await randomDelay(2000, 4000, state.activeLoopId, "首作评论后拟真停留");
                }
                const result2 = await performProfileActionsLogic(arg1.lead, state.activeLoopId, local3, flag, arg1.dmContent, false, arg1, result);
                if (result2 && !result2.pendingNavigation) {
                  result.followed = !!result.followed || !!result2.followed;
                  result.messaged = !!result.messaged || !!result2.messaged;
                  result.followAttempted = !!result.followAttempted || !!local3;
                  if (result2.dmSkipped !== undefined) {
                    result.dmSkipped = !!result2.dmSkipped;
                  }
                  if (result2.dmContent) {
                    result.dmContent = result2.dmContent;
                  }
                  if (result2.gender) {
                    result.gender = result2.gender;
                  }
                  if (result2.isPrivate != null) {
                    result.isPrivate = result2.isPrivate;
                  }
                  if (result2.error) {
                    result.followUpError = result2.error;
                  }
                  if (result2.touchCounts) {
                    result.touchCounts = {
                      ...(result.touchCounts || {}),
                      ...result2.touchCounts
                    };
                  }
                  if (Array.isArray(result2.touchLog) && result2.touchLog.length) {
                    result.touchLog = normalizeTouchLogEntries([...(result2.touchLog || []), ...(result.touchLog || [])]).slice(0, 200);
                  }
                  if (result2.lastTouchAt) {
                    result.lastTouchAt = Math.max(Number(result.lastTouchAt || 0), Number(result2.lastTouchAt || 0));
                  }
                }
              }
            } catch (error) {
              console.warn("[主页跟进] 当前主页后续动作异常:", error?.message || error);
            }
          }
          clearPendingSubviewTask();
          if (result?.success && result?.profileWorkCommented && !result?.skipped && !arg1.canDM && local === state.subviewTaskSeq) {
            await randomDelay(3000, 6000, state.activeLoopId, "首作评论成功后驻留");
          }
          if (local !== state.subviewTaskSeq) {
            console.warn("[子视图任务] 首作评论驻留已被新任务取消 (seq=" + local + ")");
            return;
          }
          ipcRenderer.send("interaction-done", {
            viewKey: state.currentViewKey,
            interactionId: arg1.interactionId,
            batchRunId: arg1.batchRunId,
            results: result
          });
          return;
        }
        const result2 = await performProfileActionsLogic(arg1.lead, state.activeLoopId, arg1.canFollow, arg1.canDM, arg1.dmContent, arg1.enableWarmup && !arg1.__warmupRestored, arg1);
        if (result2?.pendingNavigation) {
          return;
        }
        clearPendingSubviewTask();
        ipcRenderer.send("interaction-done", {
          viewKey: state.currentViewKey,
          interactionId: arg1.interactionId,
          batchRunId: arg1.batchRunId,
          results: result2
        });
      } catch (error) {
        clearPendingSubviewTask();
        const local = error?.message || String(error || "");
        const local2 = local === "USER_NOT_FOUND" || /无此用户|该用户不存在|用户不存在|账号已被封禁|该账号已被封禁/.test(local);
        if (local2) {
          const text = "用户不存在（可能已注销）";
          console.warn("%c[子视图任务] " + text + "，跳过本条跟进", "color: #f59e0b; font-weight: bold;");
          ipcRenderer.send("interaction-done", {
            viewKey: state.currentViewKey,
            interactionId: arg1.interactionId,
            batchRunId: arg1.batchRunId,
            results: {
              followed: false,
              messaged: false,
              skipped: true,
              skipReason: text,
              userGone: true,
              profileUnavailable: true,
              profileUnavailableReason: text,
              error: text,
              errorCode: "USER_NOT_FOUND"
            }
          });
        } else {
          ipcRenderer.send("interaction-done", {
            viewKey: state.currentViewKey,
            interactionId: arg1.interactionId,
            batchRunId: arg1.batchRunId,
            results: {
              followed: false,
              messaged: false,
              error: local
            }
          });
        }
      } finally {
        if (local === state.subviewTaskSeq) {
          state.taskRunning = false;
          state.activeLoopId = value;
          state.subviewTaskStarted = false;
          if (state.activeSubviewInteractionId === local2) {
            state.activeSubviewInteractionId = "";
          }
        }
      }
    };
    if (state.subviewTaskAls) {
      return state.subviewTaskAls.run({
        interactionId: local2,
        taskSeq: local
      }, local3);
    }
    return local3();
  }
  async function closeAllModals(arg1) {
    console.log("%c[环境清理] 正在检查并清除遮挡弹窗...", "color: #94a3b8; font-style: italic;");
    let flag = false;
    for (let num = 0; num < 3; num++) {
      const list = ["[data-e2e=\"video-player-close-icon\"]", ".dy-modal-close", "[class*=\"ModalClose\"]", "[class*=\"modal-close\"]", "[class*=\"close-btn\"]", "[class*=\"CloseBtn\"]", "[class*=\"close-icon\"]", "[class*=\"CloseIcon\"]", ".RightPanelHeadercloseImPage"];
      const local = Array.from(document.querySelectorAll(list.join(", "))).find(isVisibleElement) || Array.from(document.querySelectorAll("svg")).find(arg1 => isVisibleElement(arg1) && (arg1.innerHTML.includes("M24.24") || arg1.innerHTML.includes("M6.5 6.5") || arg1.innerHTML.includes("M11.867 11.867") || arg1.innerHTML.includes("close") || arg1.innerHTML.includes("Close")))?.closest("button, [role=\"button\"], div") || Array.from(document.querySelectorAll("[class*=\"close\"], [class*=\"Close\"]")).find(isVisibleElement);
      if (local && isVisibleElement(local)) {
        console.log("%c[拟人操作] 发现遮挡弹窗，正在关闭...", "color: #fbbf24; font-style: italic;");
        await simulateTrustedElementClick(local, arg1, "关闭视频详情");
        await sleep(1000);
        flag = true;
      } else {
        const result = await simulateTrustedKey("Escape", arg1, "关闭弹层");
        if (!result) {
          window.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27
          }));
        }
        await sleep(500);
        if (num > 0 && !document.querySelector("[data-e2e=\"video-player-container\"]")) {
          break;
        }
      }
    }
    if (flag) {
      await sleep(1000);
      console.log("%c[环境清理] 弹窗清理完毕，UI 已重置", "color: #94a3b8; font-style: italic;");
    }
  }
  function fn35() {
    const result = [platformSelectors["douyin.com"].modalContainer, "[data-e2e=\"video-detail-container\"]", "[data-e2e=\"video-player-container\"]", "[class*=\"SearchDetail\"]"].filter(Boolean).join(", ");
    return Array.from(document.querySelectorAll(result)).some(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      if (arg1.matches?.("[data-e2e=\"video-player-container\"]")) {
        return !!arg1.closest?.("[data-e2e=\"video-detail-container\"], [class*=\"SearchDetail\"], [role=\"dialog\"]");
      }
      return true;
    });
  }
  async function fn33(arg1) {
    if (!fn35()) {
      return true;
    }
    console.log("%c[主页首作评论] 评论完成，正在关闭作品详情返回主页...", "color: #f59e0b; font-weight: bold;");
    reportCurrentAction("首作评论完成，正在关闭作品返回主页...");
    reportTraceLog("📨 正在关闭作品详情，返回主页以便私信…");
    const list = ["[data-e2e=\"video-player-close-icon\"]", "[data-e2e=\"video-detail-container\"] [data-e2e=\"close\"]", "[data-e2e=\"video-detail-container\"] [aria-label=\"关闭\"]", "[data-e2e=\"video-detail-container\"] [class*=\"close\"]", "[data-e2e=\"video-detail-container\"] [class*=\"Close\"]", "[class*=\"SearchDetail\"] [aria-label=\"关闭\"]", "[class*=\"SearchDetail\"] [class*=\"close\"]", "[class*=\"SearchDetail\"] [class*=\"Close\"]", ".dy-modal-close", "[class*=\"ModalClose\"]", "[class*=\"modal-close\"]"];
    for (let num = 0; num < 4; num++) {
      if (num > 0) {
        reportTraceLog("📨 作品详情尚未关闭，第 " + (num + 1) + "/4 次重试…");
      }
      const result = Array.from(document.querySelectorAll(list.join(", "))).filter(isVisibleElement).sort((arg1, arg2) => {
        const result = arg1.getBoundingClientRect();
        const result2 = arg2.getBoundingClientRect();
        return result.top - result2.top || result.left - result2.left;
      });
      if (result[0]) {
        await simulateTrustedElementClick(result[0], arg1, "关闭主页作品详情");
      } else {
        const result = await simulateTrustedKey("Escape", arg1, "关闭主页作品详情");
        if (!result) {
          const local = document.activeElement || document;
          for (const item of ["keydown", "keyup"]) {
            local.dispatchEvent(new KeyboardEvent(item, {
              key: "Escape",
              code: "Escape",
              keyCode: 27,
              which: 27,
              bubbles: true,
              composed: true
            }));
          }
        }
      }
      for (let num = 0; num < 8; num++) {
        await sleep(250);
        if (!fn35()) {
          console.log("%c[主页首作评论] 作品详情已关闭，已返回主页", "color: #10b981; font-weight: bold;");
          reportTraceLog("📨 作品详情已关闭，已返回主页");
          return true;
        }
      }
    }
    console.warn("[主页首作评论] 作品详情关闭失败，取消关注/私信，防止误点详情页按钮");
    reportCurrentAction("作品详情未能关闭，已取消本次关注/私信");
    return false;
  }
  function extractUserIdFromUrl(arg1) {
    if (!arg1 || typeof arg1 !== "string") {
      return "";
    }
    try {
      let result = arg1.trim();
      if (result.startsWith("//")) {
        result = "https:" + result;
      }
      if (!result.startsWith("http")) {
        result = "https://www.douyin.com" + (result.startsWith("/") ? result : "/" + result);
      }
      const url = new URL(result);
      const result2 = url.pathname.match(/\/user\/([^/?#]+)/i);
      if (result2 && result2[1]) {
        const result = decodeURIComponent(result2[1]);
        if (result && !["self", "login"].includes(result.toLowerCase())) {
          return result;
        }
      }
      const result3 = url.pathname.match(/\/user\/profile\/([^/?#]+)/i);
      if (result3 && result3[1]) {
        return decodeURIComponent(result3[1]);
      }
    } catch (error) {}
    return "";
  }
  function fn32(arg1) {
    const value = window.location.href;
    if (value === "about:blank") {
      return false;
    }
    const result = fn17(arg1);
    if (result?.videoId) {
      const result2 = getVideoIdFromPageUrl(value);
      if (result2 && String(result2) === String(result.videoId)) {
        return true;
      }
    }
    if (!value.includes("/user/")) {
      return false;
    }
    const local = arg1.lead?.userUrl || "";
    const result2 = extractUserIdFromUrl(value);
    const result3 = extractUserIdFromUrl(local);
    if (result2 && result3) {
      return result2 === result3;
    }
    if (result3 && !result2) {
      return false;
    }
    if (!result3 && result2) {
      return false;
    }
    if (local) {
      const result = normalizeUserUrl(local);
      const result2 = normalizeUserUrl(value);
      if (result && result2 && result === result2) {
        return true;
      }
    }
    return false;
  }
  async function fn36(arg1, num = 20000) {
    const value = Date.now() + num;
    while (Date.now() < value) {
      if (fn32(arg1)) {
        return true;
      }
      await sleep(300);
    }
    return fn32(arg1);
  }
  ipcRenderer.on("interaction-preempt", (arg1, options = {}) => {
    if (state.activeSubviewInteractionId) {
      markSubviewInteractionCancelled(state.activeSubviewInteractionId);
    }
    if (state.currentTask?.interactionId) {
      markSubviewInteractionCancelled(state.currentTask.interactionId);
    }
    state.subviewTaskSeq += 1;
    state.subviewTaskStarted = false;
    state.activeSubviewInteractionId = "";
    clearPendingSubviewTask();
    console.warn("[子视图任务] 收到抢占通知，重置状态（下一主页=" + (options.url || "?") + "，reason=" + (options.reason || "") + "）");
  });
  ipcRenderer.on("interaction-prepare-task", async (arg1, arg2) => {
    try {
      console.log("%c[子视图任务] 准备执行：" + arg2.lead.nickname, "color: #fff; background: #3b82f6; font-weight: bold; padding: 4px;");
      if (arg2.viewKey) {
        state.currentViewKey = arg2.viewKey;
        safeSessionSet("radar_view_key", arg2.viewKey);
      }
      safeSessionSet("radar_is_interaction_view", "true");
      state.isInteractionView = true;
      try {
        localStorage.setItem("radar_pending_subview_task", JSON.stringify(arg2));
      } catch (error) {
        console.warn("[子视图] 暂存任务失败，等待页面就绪后直接执行:", error.message);
      }
      const result = extractUserIdFromUrl(window.location.href);
      const result2 = extractUserIdFromUrl(arg2.lead?.userUrl || "");
      const local = !!arg2.isBatchAction || !!arg2.batchConfig;
      const value = local ? Date.now() + 30000 : 0;
      const value2 = local ? Math.max(1000, value - Date.now()) : 20000;
      const value3 = fn32(arg2) ? true : await fn36(arg2, value2);
      if (value3) {
        if (local && value) {
          arg2.__batchProfileOpenDeadline = value;
        }
        applySubviewRuntimeTask(arg2);
        const result3 = isProfileFirstCommentAiMode(arg2);
        reportProfileFirstTrace("子视图就绪 @" + (arg2.lead?.nickname || "?") + "（uid=" + (result2 || result || "?") + "，canCommentFirstWork=" + !!arg2.canCommentFirstWork + "，aiReplyMode=" + !!arg2.aiReplyMode + "，aiRole=" + !!arg2.aiRole + "，profileAi=" + result3 + "）", arg2.lead?.accountId);
        await fn31(state.currentTask);
      } else {
        const local = extractUserIdFromUrl(window.location.href) || window.location.href.split("?")[0];
        const local2 = extractUserIdFromUrl(arg2.lead?.userUrl || "") || arg2.lead?.userUrl || "?";
        console.warn("[子视图] 主页 URL 不匹配，放弃执行：当前=" + local + "，目标=" + local2);
        reportProfileFirstTrace("子视图 URL 不匹配 @" + (arg2.lead?.nickname || "?") + "（当前 " + local + "，目标 " + local2 + "）", arg2.lead?.accountId);
        clearPendingSubviewTask();
        ipcRenderer.send("interaction-done", {
          viewKey: state.currentViewKey,
          interactionId: arg2.interactionId,
          batchRunId: arg2.batchRunId,
          results: {
            followed: false,
            messaged: false,
            error: "profile_url_mismatch"
          }
        });
      }
    } catch (error) {
      console.error("[子视图] 准备异常:", error);
    }
  });
  async function fn37(arg1) {
    console.log("%c[节奏控制] [操作预热] 已进入抖音首页推荐流，设定随机浏览时长: " + arg1.watchDuration + " 秒...", "color: #fff; background: #059669; padding: 2px 4px; border-radius: 2px;");
    reportCurrentAction("操作预热：进入官方推荐流...");
    reportTraceLog("🔥 操作预热：进入推荐流，计划浏览 " + arg1.watchDuration + " 秒");
    reportTraceLog("⏱ 操作预热：等待页面稳定载入 3 秒…");
    await sleep(3000);
    const result = Date.now();
    const value = arg1.watchDuration * 1000;
    let value2 = -1;
    while (Date.now() - result < value) {
      const result2 = Math.round((value - (Date.now() - result)) / 1000);
      console.log("%c[节奏控制] [拟人阅读] 正在模拟观看推荐页随机视频，剩余时间: " + result2 + " 秒...", "color: #10b981; font-style: italic;");
      reportCurrentAction("节奏控制：拟真观看推荐页视频 (还需 " + result2 + " 秒)");
      if (result2 !== value2 && (result2 <= 5 || result2 % 15 === 0)) {
        reportTraceLog("🔥 操作预热：拟真观看中，剩余约 " + result2 + " 秒");
        value2 = result2;
      }
      if (Math.random() < 0.3) {
        try {
          window.scrollBy({
            top: Math.floor(Math.random() * 80) - 20,
            behavior: "smooth"
          });
        } catch (error) {}
      }
      await sleep(3000);
    }
    console.log("%c[节奏控制] [预热完成] 推荐页拟真随机视频浏览完毕，即将安全关闭窗口。", "color: #fff; background: #047857; padding: 2px 4px; border-radius: 2px;");
    localStorage.removeItem("radar_subview_recommend_state");
    ipcRenderer.send("interaction-done", {
      viewKey: arg1.viewKey,
      interactionId: arg1.interactionId,
      batchRunId: arg1.batchRunId,
      results: arg1.results
    });
  }
  async function bootPendingSubviewTask() {
    let flag = false;
    try {
      const result = localStorage.getItem("radar_subview_recommend_state");
      if (result) {
        const result2 = JSON.parse(result);
        if (result2.createdAt && Date.now() - result2.createdAt < 60000) {
          await fn37(result2);
          return;
        } else {
          localStorage.removeItem("radar_subview_recommend_state");
          ipcRenderer.send("interaction-done", {
            viewKey: result2.viewKey,
            interactionId: result2.interactionId,
            batchRunId: result2.batchRunId,
            results: result2.results
          });
          return;
        }
      }
      if (!state.isInteractionView && !localStorage.getItem("radar_pending_subview_task")) {
        return;
      }
      const result2 = localStorage.getItem("radar_pending_subview_task");
      if (result2) {
        const result = JSON.parse(result2);
        if (!result.createdAt || Date.now() - result.createdAt > 420000) {
          localStorage.removeItem("radar_pending_subview_task");
          return;
        }
        if (fn32(result)) {
          flag = true;
          applySubviewRuntimeTask(result);
          await fn31(state.currentTask);
        }
      }
    } catch (error) {
      console.error("[子视图任务处理器] 异常:", error);
      if (flag) {
        ipcRenderer.send("interaction-done", {
          viewKey: state.currentViewKey,
          interactionId: state.currentTask?.interactionId,
          batchRunId: state.currentTask?.batchRunId,
          results: {
            followed: false,
            messaged: false,
            error: error.message
          }
        });
      }
    }
  }
  function fn39(arg1 = null) {
    const local = arg1 || state.currentTask || {};
    const local2 = local.batchConfig || {};
    let result = parseInt(local.followDmDelayMin ?? local2.followDmDelayMin, 10);
    let result2 = parseInt(local.followDmDelayMax ?? local2.followDmDelayMax, 10);
    if (!Number.isFinite(result) || result < 1) {
      result = 10;
    }
    if (!Number.isFinite(result2) || result2 < 1) {
      result2 = 20;
    }
    if (result > result2) {
      [result, result2] = [result2, result];
    }
    return {
      minSec: result,
      maxSec: result2
    };
  }
  function fn40(arg1 = null) {
    const local = arg1 || state.currentTask || {};
    const local2 = local.batchConfig || {};
    if (local.dmUseRandomSuffix != null) {
      return !!local.dmUseRandomSuffix;
    }
    if (local.useRandomSuffix != null) {
      return !!local.useRandomSuffix;
    }
    if (local2.dmUseRandomSuffix != null) {
      return !!local2.dmUseRandomSuffix;
    }
    if (local2.useRandomSuffix != null) {
      return !!local2.useRandomSuffix;
    }
    return false;
  }
  let local2;
  function fn41() {
    if (local2 !== undefined) {
      return local2;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/randomTextSuffix", "./shared/randomTextSuffix.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "randomTextSuffix.js"), result.join(local, "shared", "randomTextSuffix"), result.join(local, "..", "shared", "randomTextSuffix.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.appendRandomEmojiSuffix === "function" && typeof result?.buildRandomEmojiSuffix === "function") {
          local2 = result;
          return local2;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] randomTextSuffix 模块未找到，回退内置后缀实现");
    local2 = null;
    return local2;
  }
  let local3;
  function fn42() {
    if (local3 !== undefined) {
      return local3;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/commentTextNormalize", "./shared/commentTextNormalize.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "commentTextNormalize.js"), result.join(local, "..", "shared", "commentTextNormalize.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.replaceRiskyCommentEmojis === "function") {
          local3 = result;
          return local3;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] commentTextNormalize 模块未找到，回退内置实现");
    local3 = null;
    return local3;
  }
  function replaceRiskyCommentEmojisLocal(arg1) {
    const result = fn42();
    if (result?.replaceRiskyCommentEmojis) {
      return result.replaceRiskyCommentEmojis(arg1);
    }
    return {
      text: String(arg1 || ""),
      replaced: false,
      labels: ""
    };
  }
  function applyRiskyEmojiReplaceForComment(arg1, text = "comment") {
    const result = replaceRiskyCommentEmojisLocal(arg1);
    if (!result.replaced) {
      return String(arg1 || "");
    }
    const value = "装饰表情已改为中文标记（" + clipTraceText(result.labels, 24) + "）";
    if (text === "profile") {
      reportProfileFirstTrace(value);
    } else if (text === "reply") {
      reportTraceLog("💬 回复：" + value, null, "warning");
    } else {
      reportTraceLog("📝 视频主评：" + value, null, "warning");
    }
    return result.text;
  }
  function commentDraftHasCoreTextLocal(arg1, arg2) {
    const result = fn42();
    if (result?.commentDraftHasCoreText) {
      return result.commentDraftHasCoreText(arg1, arg2);
    }
    const local = arg1 => String(arg1 || "").replace(/\s+/g, "").trim();
    const result2 = local(arg1);
    const result3 = local(arg2);
    return !!result2 && !!result3 && (result2 === result3 || !!(result2.length >= 4) && !!result3.includes(result2));
  }
  function isCommentDraftOnlyEmojiDriftLocal(arg1, arg2) {
    const result = fn42();
    if (result?.isCommentDraftOnlyEmojiDrift) {
      return result.isCommentDraftOnlyEmojiDrift(arg1, arg2);
    }
    return commentDraftHasCoreTextLocal(arg1, arg2);
  }
  function classifyCommentFailureToastLocal(arg1) {
    const result = fn42();
    if (result?.classifyCommentFailureToast) {
      return result.classifyCommentFailureToast(arg1);
    }
    const result2 = String(arg1 || "");
    if (/操作太频繁|请稍后再试|内容不符合|包含违规/.test(result2)) {
      return {
        code: "rate_limited",
        stopAccount: true,
        label: result2.slice(0, 40)
      };
    }
    return {
      code: "comment_publish_failed",
      stopAccount: false,
      label: result2.slice(0, 40) || "发布评论失败"
    };
  }
  const list = ["͏", "᠎", "​", "‌", "‍", "⁠", "⁡", "⁢", "⁣", "⁤", "﻿"];
  const list2 = ["😊", "🙂", "😄", "😁", "😃", "🤗", "😌", "😇", "👍", "👏", "🙌", "🤝", "✌️", "👋", "💪", "✨", "🌟", "⭐", "💫", "☀️", "🎉", "🎊"];
  function fn48() {
    const value = 4 + Math.floor(Math.random() * 5);
    const result = Array.from({
      length: value
    }, () => list[Math.floor(Math.random() * list.length)]).join("");
    const value2 = list2[Math.floor(Math.random() * list2.length)];
    return " " + value2 + result;
  }
  function fn49() {
    const result = fn41();
    if (result?.buildRandomEmojiSuffix) {
      return result.buildRandomEmojiSuffix();
    }
    return fn48();
  }
  function fn50(arg1) {
    const result = fn41();
    if (result?.appendRandomEmojiSuffix) {
      return result.appendRandomEmojiSuffix(arg1);
    }
    const result2 = String(arg1 || "");
    if (!result2.trim()) {
      return result2;
    }
    return result2 + fn48();
  }
  function shouldAppendVideoCommentRandomSuffix(arg1 = null) {
    const local = arg1 || state.currentTask || {};
    if (local.videoCommentMode && local.videoCommentMode !== "custom") {
      return false;
    }
    return !!local.videoCommentUseRandomSuffix;
  }
  function shouldAppendCommentRandomSuffix(arg1 = null) {
    const local = arg1 || state.currentTask || {};
    return !!local.commentUseRandomSuffix;
  }
  async function fn30(arg1, arg2 = null, arg3 = null) {
    const {
      minSec: minSec,
      maxSec: maxSec
    } = fn39(arg2);
    const value = arg3?.nickname ? "@" + arg3.nickname : "";
    reportCurrentAction((value + " 关注完成，按「关注后停留」随机等待 " + minSec + "-" + maxSec + " 秒…").trim(), arg3?.accountId);
    await randomDelay(minSec * 1000, maxSec * 1000, arg1, "关注后停留");
  }
  function fn53(options = {}) {
    const result = String(options?.followStatus || "");
    const local = !!options?.alreadyFollowed || result === "already_followed";
    const local2 = !local && !!options?.followed && result !== "already_followed" || !!options?.followRequestSent;
    const local3 = !!options?.followRequested || !!options?.followRequestSent || result === "requested";
    const local4 = local2 || local || local3;
    return {
      followed: local2,
      error: local4 ? "" : String(options?.error || "关注未确认"),
      followStatus: result || (local4 ? "success" : "failed"),
      alreadyFollowed: local,
      followRequested: local3,
      followRequestSent: !!options?.followRequestSent,
      stateConfirmed: local4,
      errorCode: options?.errorCode || "",
      isPrivate: !!options?.isPrivate
    };
  }
  async function fn54(arg1, arg2) {
    reportCurrentAction("正在定位关注按钮...");
    const value = arg1?.nickname ? "[" + arg1.nickname + "]" : "";
    const value2 = arg1?.nickname ? "@" + arg1.nickname : "@用户";
    if (value) {
      reportCurrentAction("正在自动关注用户 " + value + "...");
    }
    const result = await performVideoMonitorFollow(arg1 || {}, arg2);
    const result2 = fn53(result);
    const result3 = String(result?.diagnostic || "").trim();
    if (result2.followed) {
      const value = result2.followRequestSent ? "已申请关注" : "关注成功";
      console.log("%c[互动成功] " + value, "color: #fff; background: #4f46e5; padding: 2px 4px; border-radius: 2px;");
      reportTraceLog("👤 " + value2 + "：" + value, arg1?.accountId);
    } else if (result2.alreadyFollowed) {
      console.log("%c[主页跟进] 此前已经关注，本轮不重复计数", "color: #94a3b8; font-style: italic;");
      reportTraceLog("👤 " + value2 + "：此前已关注，本轮跳过重复关注", arg1?.accountId);
    } else if (result2.followRequested) {
      console.log("%c[主页跟进] 此前已申请关注，本轮不重复计数", "color: #94a3b8; font-style: italic;");
      reportTraceLog("👤 " + value2 + "：此前已申请关注，本轮跳过", arg1?.accountId);
    } else {
      const local = result2.error || "关注未确认";
      console.warn("[交互警告] 关注未确认: " + local + (result2.errorCode ? " (" + result2.errorCode + ")" : ""));
      reportTraceLog("👤 " + value2 + "：关注失败（" + clipTraceText(local, 48) + (result2.errorCode ? "/" + result2.errorCode : "") + "）" + ("" + (result3 ? "；" + clipTraceText(result3, 120) : "")), arg1?.accountId, "warning");
    }
    return result2;
  }
  async function performProfileActionsLogic(arg1, arg2, arg3, arg4, arg5, flag = false, arg7 = null, arg8 = null) {
    let obj = {
      followed: false,
      messaged: false,
      alreadyFollowed: false,
      alreadyMessaged: false
    };
    const local = arg7 || state.currentTask || {};
    const result = resolveTaskGenderFilter(local);
    let value = arg8 ? pickReusableProfileDetail(arg8) : await scrapeDetailedProfile({
      genderFilter: result,
      loopId: arg2
    });
    if (arg8 && result !== "all" && (!value.gender || value.gender === "未知")) {
      const result2 = await scrapeDetailedProfile({
        genderFilter: result,
        loopId: arg2
      });
      value = {
        ...value,
        ...result2
      };
    }
    Object.assign(obj, value);
    if (!arg8) {
      persistScrapedLeadProfile(arg1, value, local, {
        emit: false
      });
    } else {
      mergeProfileInfoToLead(arg1, value);
    }
    const result2 = evaluateTaskGenderFilter(value.gender, result);
    reportTraceLog("👤 @" + arg1.nickname + " 目标筛选：性别 " + result2.filterLabel + "（识别 " + result2.observedLabel + ((value.genderTimedOut ? "，等待" + ((Number(value.genderWaitMs) || 0) / 1000).toFixed(1) + "s仍未知" : "") + "）；") + ("年龄 " + (isBatchAgeFilterActive(local) ? formatAgeFilterRangeLabel(local) : "关闭") + "（识别 " + formatObservedAgeLabel(value) + "）"), arg1.accountId);
    if (value.genderUnresolved) {
      const text = "性别尚未识别完成（主页加载偏慢），已跳过以免误判";
      console.log("%c[性别过滤] " + text, "color: #94a3b8; font-style: italic;");
      reportCurrentAction("@" + arg1.nickname + " " + text, arg1.accountId);
      const local2 = !!local.isBatchAction || !!local.batchConfig;
      return {
        ...obj,
        success: local2 ? false : undefined,
        skipped: !local2,
        skipReason: text,
        error: local2 ? text : undefined,
        demographicFilterFailed: true
      };
    }
    if (!result2.pass) {
      console.log("%c[性别过滤] " + result2.reason + "，跳过关注/私信", "color: #94a3b8; font-style: italic;");
      reportCurrentAction("@" + arg1.nickname + " " + result2.reason + "，已跳过关注/私信", arg1.accountId);
      const local2 = !!local.isBatchAction || !!local.batchConfig;
      return {
        ...obj,
        success: local2 ? false : undefined,
        skipped: !local2,
        skipReason: result2.reason,
        error: local2 ? result2.reason : undefined,
        demographicFilterFailed: true
      };
    }
    if (isBatchAgeFilterActive(local)) {
      const result = checkBatchAgeFilter(value, local);
      if (!result.pass) {
        console.log("%c[年龄过滤] " + result.reason + "，不符合任务设置，跳过关注/私信", "color: #94a3b8; font-style: italic;");
        reportCurrentAction("@" + arg1.nickname + " " + result.reason + "，已跳过关注/私信", arg1.accountId);
        reportTraceLog("⏭ @" + arg1.nickname + "：" + result.reason + "，已跳过关注/私信", arg1.accountId, "warning");
        const local2 = !!local.isBatchAction || !!local.batchConfig;
        return {
          ...obj,
          success: local2 ? false : undefined,
          skipped: !local2,
          skipReason: result.reason,
          error: local2 ? result.reason : undefined,
          demographicFilterFailed: true
        };
      }
    }
    return withBackgroundAutomationLayout(async () => {
      try {
        reportCurrentAction("正在获取用户 [" + arg1.nickname + "] 的性别与隐私属性...");
        if (flag && (arg3 || arg4)) {
          if (value.isPrivate) {
            console.log("%c[节奏控制] 检测到私密账号，自动跳过作品预热环节", "color: #94a3b8; font-style: italic;");
          } else {
            reportCurrentAction("账号养护中：正在浏览 [" + arg1.nickname + "] 的历史作品进行点赞预热...");
            const result = await fn55(arg2, {
              lead: arg1,
              resumeTask: arg7 || state.currentTask
            });
            if (result?.pendingNavigation) {
              return {
                ...obj,
                pendingNavigation: true
              };
            }
            const result2 = await restoreProfileAfterWarmup(arg1, arg2, "操作预热", arg7 || state.currentTask);
            if (result2) {
              return {
                ...obj,
                pendingNavigation: true
              };
            }
          }
        }
        const local = arg7 || state.currentTask || {};
        const flag2 = !!arg8;
        if (local.enableRandomLike && (arg3 || arg4) && !flag2) {
          if (value.isPrivate) {
            console.log("%c[主页跟进] 检测到私密账号，不执行作品点赞", "color: #94a3b8; font-style: italic;");
            reportCurrentAction("主页跟进：@" + arg1.nickname + " 是私密账号，本条不执行作品点赞", arg1.accountId);
          } else {
            const result = fn56(local);
            console.log("[主页跟进] 正在进行作品点赞概率判断（配置 " + result + "%）...");
            reportCurrentAction("主页跟进：正在判断是否给 @" + arg1.nickname + " 的作品点赞（配置概率 " + result + "%）", arg1.accountId);
            await fn57(arg2, {
              lead: arg1,
              config: local
            });
            const result2 = await restoreProfileAfterWarmup(arg1, arg2, "随机点赞", local);
            if (result2) {
              return {
                ...obj,
                pendingNavigation: true
              };
            }
          }
        } else if (flag2 && local.enableRandomLike) {
          reportTraceLog("📨 @" + arg1.nickname + "：首作评论后直发私信，跳过随机作品点赞", arg1.accountId);
        }
        console.log("%c[互动动作] 正在执行主页跟进：关注=" + arg3 + ", 私信=" + arg4, "color: #fff; background: #6366f1; padding: 2px 4px; border-radius: 2px;");
        let flag3 = !!value.isPrivate;
        try {
          if (!flag3 && typeof detectMonitorPrivateProfile === "function") {
            flag3 = !!detectMonitorPrivateProfile();
          }
        } catch (error) {}
        if (flag3) {
          value.isPrivate = true;
          obj.isPrivate = true;
          if (arg3 || arg4) {
            const list = [];
            if (arg3) {
              list.push("关注");
            }
            if (arg4) {
              list.push("私信");
            }
            const value = "对方账号设置了隐私，未执行" + list.join("/");
            const local2 = !!local.isBatchAction || !!local.batchConfig || !!state.currentTask?.isBatchAction;
            obj.skipped = true;
            obj.skipReason = value;
            obj.followSkipped = !!arg3;
            obj.dmSkippedDueToPrivate = !!arg4;
            obj.success = local2 ? false : undefined;
            obj.error = local2 ? value : undefined;
            console.log("%c[主页跟进] " + value, "color: #f59e0b; font-weight: bold;");
            reportCurrentAction("@" + arg1.nickname + " " + value, arg1.accountId);
            reportTraceLog("🔒 @" + arg1.nickname + "：" + value, arg1.accountId, "warning");
          }
        } else {
          let local2 = null;
          if (arg3) {
            local2 = await fn54(arg1, arg2);
            if (local2.followed) {
              obj.followed = true;
              recordLeadTouch(arg1, "follow", {
                source: arg7?.isBatchAction || arg7?.batchConfig || state.currentTask?.isBatchAction ? "batch" : "acquire"
              });
              emitSubviewActionCheckpoint(arg1, "关注用户");
            }
            if (local2.alreadyFollowed || local2.followRequested && !local2.followRequestSent) {
              obj.alreadyFollowed = true;
            }
            if (local2.error) {
              obj.error = local2.error;
            }
            if (local2.followed && arg4) {
              await fn30(arg2, local, arg1);
            }
          }
          const result = String(local?.dmTarget || local?.batchConfig?.dmTarget || "all");
          const local3 = !!local2?.followed || !!local2?.alreadyFollowed || !!local2?.followRequested || !!local2?.stateConfirmed || !!obj.followed || !!obj.alreadyFollowed;
          if (arg4 && arg3 && result === "followed_only" && !local3) {
            obj.dmSkipped = true;
            obj.dmSkipReason = "关注未成功，已按「仅关注成功」跳过私信";
            reportTraceLog("📨 @" + arg1.nickname + "：关注未成功，已按「仅关注成功」跳过私信", arg1.accountId, "warning");
          } else if (arg4) {
            reportTraceLog("📨 @" + arg1.nickname + "：正在查找私信入口…", arg1.accountId);
            const local = !!arg7?.isBatchAction || !!arg7?.batchConfig || !!state.currentTask?.isBatchAction;
            let local2 = arg5 || "你好，交个朋友！";
            if (!local) {
              const result = String(local2).split("\n").filter(arg1 => arg1.trim());
              local2 = result[Math.floor(Math.random() * result.length)] || "你好！";
            }
            let result = personalizeDmTemplate(local2, arg1);
            if (fn40(arg7 || state.currentTask)) {
              result = fn50(result);
            }
            console.log("%c[互动动作] 正在发送私信: \"" + clipTraceText(result, 40) + "\"", "color: #fff; background: #8b5cf6; padding: 2px 4px; border-radius: 2px;");
            reportCurrentAction("正在发送私信给 [" + arg1.nickname + "]...", arg1.accountId);
            reportTraceLog("📨 @" + arg1.nickname + "：正在发送私信…", arg1.accountId);
            const result2 = (() => {
              const list = [arg1?.userUrl, arg1?.profileUrl, arg1?.authorProfileUrl, window.location.href?.includes?.("/user/") ? window.location.href : ""];
              for (const item of list) {
                const result = String(item || "").trim();
                if (!result) {
                  continue;
                }
                if (/(?:video|note)\/\d{10,}/i.test(result)) {
                  continue;
                }
                return result;
              }
              return "";
            })();
            const result3 = await sendDmOnCurrentProfile(result, arg2, {
              nickname: arg1?.nickname || "",
              userUrl: result2,
              accountId: arg1?.accountId
            });
            if (result3?.ok) {
              obj.dmContent = result3.sentText || result;
              if (result3.skipped) {
                obj.messaged = false;
                obj.alreadyMessaged = true;
                obj.dmSkipped = true;
                obj.dmSkipReason = result3.reason || "";
                reportTraceLog("📨 @" + arg1.nickname + "：" + (result3.reason || "会话中已有我方私信，跳过"), arg1.accountId);
              } else {
                obj.messaged = true;
                recordLeadTouch(arg1, "message", {
                  content: obj.dmContent || result,
                  source: arg7?.isBatchAction || arg7?.batchConfig || state.currentTask?.isBatchAction ? "batch" : "acquire"
                });
                emitSubviewActionCheckpoint(arg1, "发送私信");
                reportTraceLog("📨 @" + arg1.nickname + "：私信发送成功" + (result3.viaStranger ? "（经陌生人消息）" : "") + "，当前会话停留 2-5 秒后继续", arg1.accountId);
                try {
                  await randomDelay(2000, 5000, arg2, "私信发送后停留");
                } catch (error) {
                  if (String(error?.message || error) !== "TASK_ABORTED") {
                    throw error;
                  }
                }
              }
            } else {
              obj.error = result3?.reason || "私信发送失败";
              if (result3?.blocked) {
                obj.dmBlocked = true;
                obj.blockType = result3.blockType || "";
              }
              reportTraceLog("📨 @" + arg1.nickname + "：私信失败（" + obj.error + "）", arg1.accountId, "warning");
              console.warn("%c[交互警告] 私信失败: " + obj.error, "color: #ef4444;");
            }
          }
        }
      } catch (error) {
        const local = error?.message || String(error);
        console.error("[主页交互] 失败:", error);
        obj.error = local || "主页交互失败";
      }
      try {
        const result = parseProfileWorksCount();
        if (result !== null && result !== undefined) {
          obj.worksCount = result;
          if (result === 0) {
            obj.noWorks = true;
          }
        }
      } catch (error) {}
      if (!obj.followed && !obj.messaged && !obj.error && (obj.alreadyFollowed || obj.alreadyMessaged)) {
        const list = [];
        if (obj.alreadyFollowed) {
          list.push("此前已关注/已申请");
        }
        if (obj.alreadyMessaged) {
          list.push("会话已有我方私信");
        }
        obj.skipped = true;
        obj.skipReason = list.join("，") + "，本轮未执行新动作";
      }
      const value2 = arg7?.isBatchAction || arg7?.batchConfig || state.currentTask?.isBatchAction ? "batch" : "acquire";
      if (obj.followed && !(arg1.touchCounts?.follow > 0)) {
        recordLeadTouch(arg1, "follow", {
          source: value2
        });
      }
      if (obj.messaged && !obj.dmSkipped && !(arg1.touchCounts?.message > 0)) {
        recordLeadTouch(arg1, "message", {
          content: obj.dmContent || arg5 || "",
          source: value2
        });
      }
      const result = Math.max(Number(arg1.lastTouchAt || 0), ...(arg1.touchLog || []).map(arg1 => Number(arg1.at || arg1.timestamp || 0)));
      return {
        ...obj,
        dmContent: obj.dmContent || arg5,
        touchCounts: arg1.touchCounts,
        touchLog: arg1.touchLog,
        lastTouchAt: result || undefined
      };
    });
  }
  function fn58(arg1) {
    const result = getAutomationTextHelpersModule();
    if (result?.parseAgeFromText) {
      return result.parseAgeFromText(arg1);
    }
    if (!arg1) {
      return null;
    }
    const result2 = String(arg1).match(/(\d{1,2})岁/);
    if (!result2) {
      return null;
    }
    const result3 = parseInt(result2[1], 10);
    if (!Number.isFinite(result3) || result3 < 1 || result3 > 120) {
      return null;
    }
    return result3;
  }
  let local4;
  function fn59() {
    if (local4 !== undefined) {
      return local4;
    }
    const result = (() => {
      try {
        return require("path");
      } catch (error) {
        return null;
      }
    })();
    const list = ["./shared/genderFilter", "./shared/genderFilter.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "genderFilter.js"), result.join(local, "shared", "genderFilter"), result.join(local, "..", "shared", "genderFilter.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.evaluateGenderFilter === "function") {
          local4 = result;
          console.log("[Built-in-Debug] genderFilter 已加载: " + item);
          return local4;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] genderFilter 模块未找到，使用内置五档筛选逻辑");
    local4 = null;
    return local4;
  }
  let local5;
  function fn60() {
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
    const list = ["./shared/profileGenderFromApi", "./shared/profileGenderFromApi.js"];
    if (result && typeof local === "string") {
      list.push(result.join(local, "shared", "profileGenderFromApi.js"), result.join(local, "shared", "profileGenderFromApi"), result.join(local, "..", "shared", "profileGenderFromApi.js"));
    }
    for (const item of list) {
      try {
        const result = require(item);
        if (typeof result?.parseProfileGenderFromApi === "function") {
          local5 = result;
          console.log("[Built-in-Debug] profileGenderFromApi 已加载: " + item);
          return local5;
        }
      } catch (error) {}
    }
    console.warn("[Built-in-Debug] profileGenderFromApi 未找到，使用内置映射");
    local5 = null;
    return local5;
  }
  let local6 = null;
  function fn61(arg1) {
    const result = Number(arg1);
    if (result === 1) {
      return "男";
    }
    if (result === 2) {
      return "女";
    }
    return "未知";
  }
  function parseProfileGenderFromApiPayload(arg1) {
    const result = fn60();
    if (typeof result?.parseProfileGenderFromApi === "function") {
      return result.parseProfileGenderFromApi(arg1);
    }
    const local = arg1?.user || arg1?.data?.user || arg1?.user_info;
    if (!local || typeof local !== "object" || !Object.prototype.hasOwnProperty.call(local, "gender")) {
      return null;
    }
    const result2 = Number(local.user_age ?? local.age);
    return {
      gender: fn61(local.gender),
      age: Number.isFinite(result2) && result2 >= 0 && result2 <= 120 ? Math.floor(result2) : null,
      secUid: String(local.sec_uid || local.secUid || "").trim(),
      nickname: String(local.nickname || "").trim(),
      genderCode: Number(local.gender),
      settled: true
    };
  }
  function fn63() {
    const result = fn60();
    const value = typeof location !== "undefined" && location.href ? location.href : "";
    if (typeof result?.extractSecUidFromProfileUrl === "function") {
      return result.extractSecUidFromProfileUrl(value);
    }
    const local = value.match(/\/user\/([^/?#]+)/) || value.match(/[?&]sec_uid=([^&#]+)/i);
    if (!local) {
      return "";
    }
    try {
      return decodeURIComponent(local[1]).trim();
    } catch (error) {
      return String(local[1] || "").trim();
    }
  }
  function rememberProfileApiGenderHit(arg1, options = {}) {
    if (!arg1 || !arg1.settled) {
      return;
    }
    local6 = {
      ...arg1,
      ts: Date.now(),
      url: options.url || "",
      source: options.source || "api"
    };
    try {
      if (typeof window !== "undefined") {
        window.__radarLastProfileGenderApi = local6;
      }
    } catch (error) {}
  }
  function fn65() {
    const local = local6 || (typeof window !== "undefined" ? window.__radarLastProfileGenderApi : null);
    if (!local || !local.settled) {
      return null;
    }
    const result = fn63();
    const result2 = fn60();
    const value = typeof result2?.profileApiMatchesPage === "function" ? result2.profileApiMatchesPage(local, result) : !result || !local.secUid || result === local.secUid;
    if (!value) {
      return null;
    }
    if (local.ts && Date.now() - local.ts > 60000) {
      return null;
    }
    return local;
  }
  async function fn66() {
    const result = fn63();
    if (!result || typeof fetch !== "function") {
      return null;
    }
    try {
      const uRLSearchParams = new URLSearchParams({
        sec_user_id: result,
        device_platform: "webapp",
        aid: "6383",
        publish_video_strategy_type: "2",
        source: "channel_pc_web",
        personal_center_strategy: "1"
      });
      const value = "https://www.douyin.com/aweme/v1/web/user/profile/other/?" + uRLSearchParams.toString();
      const result2 = await fetch(value, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json, text/plain, */*"
        }
      });
      const result3 = await result2.text();
      if (!result3 || !String(result3).trim()) {
        return null;
      }
      const result4 = JSON.parse(result3);
      const result5 = parseProfileGenderFromApiPayload(result4);
      if (result5) {
        rememberProfileApiGenderHit(result5, {
          url: value,
          source: "api_fetch"
        });
        return fn65();
      }
    } catch (error) {
      console.warn("[Built-in-Debug] profile/other 主动拉取失败:", error?.message || error);
    }
    return null;
  }
  const result = Object.freeze({
    all: "不限",
    male_unknown: "男+未知",
    male: "男",
    female_unknown: "女+未知",
    female: "女"
  });
  function fn67(arg1, text = "all") {
    const result2 = fn59();
    if (typeof result2?.normalizeGenderFilter === "function") {
      return result2.normalizeGenderFilter(arg1, text);
    }
    const result3 = String(arg1 || "").trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(result, result3)) {
      return result3;
    }
    const result4 = String(text || "all").trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(result, result4)) {
      return result4;
    } else {
      return "all";
    }
  }
  function evaluateTaskGenderFilter(arg1, arg2) {
    const result2 = fn59();
    if (typeof result2?.evaluateGenderFilter === "function") {
      return result2.evaluateGenderFilter(arg1, arg2);
    }
    const result3 = fn67(arg2);
    const result4 = String(arg1 ?? "").trim().toLowerCase().replace(/\s+/g, "");
    const value = /^(男|男性|男生|male|m|♂)$/.test(result4) ? "male" : /^(女|女性|女生|female|f|♀)$/.test(result4) ? "female" : "unknown";
    const local = result3 === "all" || result3 === value || result3 === "male_unknown" && (value === "male" || value === "unknown") || result3 === "female_unknown" && (value === "female" || value === "unknown");
    const value2 = value === "male" ? "男" : value === "female" ? "女" : "未知";
    const local2 = result[result3] || result.all;
    return {
      pass: local,
      filter: result3,
      filterLabel: local2,
      observed: value,
      observedLabel: value2,
      reason: local ? "" : "性别不符（识别：" + value2 + "，筛选：" + local2 + "）"
    };
  }
  function resolveTaskGenderFilter(arg1) {
    const local = arg1?.batchConfig || arg1 || {};
    const local2 = local.genderFilter ?? local.targetGender ?? "all";
    return fn67(local2, "all");
  }
  function resolveProfileFirstGenderFilter(arg1) {
    return fn67(arg1?.profileFirstGenderFilter, "all");
  }
  function fn24(arg1) {
    return {
      ageFilterEnabled: arg1?.profileFirstAgeFilterEnabled === true,
      ageMin: arg1?.profileFirstAgeMin,
      ageMax: arg1?.profileFirstAgeMax
    };
  }
  function fn68(arg1) {
    const obj = {
      all: "不限",
      male: "男",
      male_unknown: "男+未知",
      female: "女",
      female_unknown: "女+未知"
    };
    return obj[arg1] || "不限";
  }
  function fn69(arg1, arg2) {
    const value = arg1 === "男" || arg1 === "女" ? arg1 : "未知";
    const obj = {
      male: ["男"],
      male_unknown: ["男", "未知"],
      female: ["女"],
      female_unknown: ["女", "未知"]
    };
    const value2 = obj[arg2];
    return !value2 || value2.includes(value);
  }
  function formatAgeFilterRangeLabel(arg1) {
    const {
      min: min,
      max: max
    } = fn70(arg1);
    if (min != null && max != null) {
      return min + "-" + max + " 岁";
    }
    if (min != null) {
      return "≥" + min + " 岁";
    }
    if (max != null) {
      return "≤" + max + " 岁";
    }
    return "不限";
  }
  function formatObservedAgeLabel(options = {}) {
    const value = options.age;
    if (value === null || value === undefined || value === "") {
      return "未知";
    }
    const result = Number(value);
    if (Number.isFinite(result)) {
      return result + " 岁";
    } else {
      return "未知";
    }
  }
  function fn70(arg1) {
    const local = arg1?.batchConfig || arg1 || {};
    if (local.ageFilterEnabled === false) {
      return {
        min: null,
        max: null
      };
    }
    const value = local.ageFilterEnabled === true;
    const local2 = local.ageMin ?? local.targetAgeMin;
    const local3 = local.ageMax ?? local.targetAgeMax;
    const value2 = local2 != null && local2 !== "" ? Number(local2) : null;
    const value3 = local3 != null && local3 !== "" ? Number(local3) : null;
    let value4 = value2 != null && (value ? value2 >= 0 : value2 > 0) ? value2 : null;
    let value5 = value3 != null && (value ? value3 >= 0 : value3 > 0) ? value3 : null;
    if (value4 != null && value5 != null && value4 > value5) {
      [value4, value5] = [value5, value4];
    }
    return {
      min: value4,
      max: value5
    };
  }
  function isBatchAgeFilterActive(arg1) {
    const {
      min: min,
      max: max
    } = fn70(arg1);
    return min != null || max != null;
  }
  function checkBatchAgeFilter(arg1, arg2) {
    const {
      min: min,
      max: max
    } = fn70(arg2);
    if (min == null && max == null) {
      return {
        pass: true
      };
    }
    const result = Number(arg1?.age);
    if (!Number.isFinite(result)) {
      return {
        pass: true
      };
    }
    if (min != null && result < min) {
      return {
        pass: false,
        reason: "低于最小年龄（" + result + "岁 < " + min + "岁）"
      };
    }
    if (max != null && result > max) {
      return {
        pass: false,
        reason: "超过最大年龄（" + result + "岁 > " + max + "岁）"
      };
    }
    return {
      pass: true
    };
  }
  function isRejectedProfileNicknameCandidate(arg1) {
    const result = String(arg1 || "").replace(/\s+/g, " ").trim().replace(/^@+/, "");
    if (!result || result.length > 40) {
      return true;
    }
    if (/抖音号|IP属地|关注|粉丝|获赞|私密账号|作品|喜欢|收藏/.test(result)) {
      return true;
    }
    try {
      const result2 = /\/user\/self(?:\/|$|\?)/i.test(String(location.pathname || ""));
      if (!result2) {
        const set = new Set();
        const local = arg1 => {
          const result = String(arg1 || "").trim().replace(/^@+/, "");
          if (result && result.length >= 2 && result.length <= 40) {
            set.add(result);
          }
        };
        local(window._radar_account_name);
        local(state.currentTask?.nickname);
        local(state.currentTask?.name);
        local(state.currentTask?.lead?.accountName);
        if (set.has(result)) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  }
  function fn72() {
    const list = ["[data-e2e=\"user-title\"]", ".user-info__name", "[class*=\"user-info\"] [class*=\"name\"]", "h1"];
    const result = String(platformSelectors["douyin.com"]?.profileName || "").split(",").map(arg1 => arg1.trim()).filter(Boolean);
    const list2 = [...list, ...result.filter(arg1 => !list.includes(arg1))];
    const local = arg1 => {
      for (const item of arg1) {
        if (!item || typeof isVisibleElement === "function" && !isVisibleElement(item)) {
          continue;
        }
        const result = String(item.innerText || item.textContent || "").replace(/\s+/g, " ").trim();
        if (isRejectedProfileNicknameCandidate(result)) {
          continue;
        }
        try {
          const local = item.getBoundingClientRect?.();
          if (local && local.width > 0 && local.height > 0 && local.top < 56 && local.right > (window.innerWidth || 0) - 220) {
            continue;
          }
        } catch (error) {}
        return result.replace(/^@+/, "");
      }
      return "";
    };
    for (const item of list2) {
      try {
        const result = local(Array.from(document.querySelectorAll(item)));
        if (result) {
          return result;
        }
      } catch (error) {}
    }
    try {
      const result = local(Array.from(document.querySelectorAll("[data-e2e=\"user-title\"], h1")));
      if (result) {
        return result;
      }
    } catch (error) {}
    return "";
  }
  function fn73() {
    let text = "未知";
    let local = null;
    try {
      const result = Array.from(document.querySelectorAll("span, p, div"));
      const local2 = (arg1, text = "") => {
        const result = String(arg1 || "").toLowerCase();
        const result2 = String(text || "");
        return result2.includes("M8 1.25") || result.includes("mars") || result.includes("#168ef9") || result.includes("rgb(22, 142, 249)") || result.includes("rgb(22,142,249)");
      };
      const local3 = (arg1, text = "") => {
        const result = String(arg1 || "").toLowerCase();
        const result2 = String(text || "");
        return result2.includes("M10.75 6.75") || result.includes("venus") || result.includes("#f5588e") || result.includes("rgb(245, 88, 142)") || result.includes("rgb(245,88,142)") || result.includes("#fe2c55") || result.includes("rgb(254, 44, 85)") || result.includes("rgb(254,44,85)");
      };
      let result2 = result.find(arg1 => {
        const result = (arg1.innerText || "").trim();
        if (result.length >= 20 || !arg1.querySelector("svg")) {
          return false;
        }
        const result2 = arg1.querySelector("svg");
        const local = result2?.outerHTML || "";
        const local4 = result2?.innerHTML || "";
        return local2(local, local4) || local3(local, local4);
      });
      if (!result2) {
        for (const item of Array.from(document.querySelectorAll("svg"))) {
          const local = item.outerHTML || "";
          const local4 = item.innerHTML || "";
          if (local2(local, local4)) {
            text = "男";
            break;
          }
          if (local3(local, local4)) {
            text = "女";
            break;
          }
        }
      }
      if (result2) {
        const local4 = result2.innerText || "";
        const result = result2.querySelector("svg");
        const value = result ? result.innerHTML : "";
        const value2 = result ? result.outerHTML : "";
        if (local4.includes("男")) {
          text = "男";
        } else if (local4.includes("女")) {
          text = "女";
        } else if (local2(value2, value)) {
          text = "男";
        } else if (local3(value2, value)) {
          text = "女";
        }
        const result3 = fn58(local4);
        if (result3 != null) {
          local = result3;
        }
      }
      if (local == null) {
        const result2 = result.find(arg1 => /^\d{1,2}岁$/.test((arg1.innerText || "").trim()));
        if (result2) {
          const result = fn58(result2.innerText);
          if (result != null) {
            local = result;
          }
        }
      }
    } catch (error) {}
    return {
      gender: text,
      age: local
    };
  }
  async function fn74(options = {}) {
    const result = fn67(options.genderFilter || "all", "all");
    const value = result !== "all";
    const value2 = value ? Math.max(8000, Number(options.genderWaitMs) || 12000) : Math.max(2000, Number(options.genderWaitMs) || 2500);
    const value3 = value ? 450 : 800;
    const result2 = Date.now();
    let obj = {
      gender: "未知",
      age: null,
      genderSource: "dom"
    };
    let num = 0;
    let flag = false;
    while (Date.now() - result2 < value2) {
      if (options.loopId && shouldAbort(options.loopId)) {
        break;
      }
      num += 1;
      const result3 = fn65();
      if (result3) {
        const value = Date.now() - result2;
        console.log("[Built-in-Debug] 性别识别成功(API): " + result3.gender + ("（code=" + (result3.genderCode ?? "-") + "，第 " + num + " 次，") + ("耗时 " + (value / 1000).toFixed(1) + "s，来源=" + (result3.source || "api") + "，") + ("筛选=" + fn68(result) + "）"));
        return {
          gender: result3.gender || "未知",
          age: result3.age ?? null,
          genderSource: result3.source || "api",
          genderTimedOut: false,
          genderWaitMs: value,
          genderFromApi: true
        };
      }
      if (value && !flag && Date.now() - result2 >= 800) {
        flag = true;
        await fn66();
        const result3 = fn65();
        if (result3) {
          const value = Date.now() - result2;
          console.log("[Built-in-Debug] 性别识别成功(API拉取): " + result3.gender + ("（code=" + (result3.genderCode ?? "-") + "，耗时 " + (value / 1000).toFixed(1) + "s，") + ("筛选=" + fn68(result) + "）"));
          return {
            gender: result3.gender || "未知",
            age: result3.age ?? null,
            genderSource: "api_fetch",
            genderTimedOut: false,
            genderWaitMs: value,
            genderFromApi: true
          };
        }
      }
      obj = {
        ...fn73(),
        genderSource: "dom"
      };
      if (obj.gender !== "未知") {
        console.log("[Built-in-Debug] 性别识别成功(DOM): " + obj.gender + ("（第 " + num + " 次，耗时 " + ((Date.now() - result2) / 1000).toFixed(1) + "s，筛选=" + fn68(result) + "）"));
        return {
          ...obj,
          genderTimedOut: false,
          genderWaitMs: Date.now() - result2,
          genderFromApi: false
        };
      }
      if (!value && num >= 3) {
        break;
      }
      await sleep(value3);
    }
    const result3 = ((Date.now() - result2) / 1000).toFixed(1);
    if (value) {
      console.warn("[Built-in-Debug] 性别等待 " + result3 + "s 仍未知（筛选=" + fn68(result) + "，API未命中），若主页稍后才刷出女标，可能被「男+未知」误放行——请以本条日志排查");
    }
    return {
      ...obj,
      genderTimedOut: value && obj.gender === "未知",
      genderWaitMs: Date.now() - result2,
      genderFromApi: false
    };
  }
  async function scrapeDetailedProfile(options = {}) {
    const obj = {
      nickname: "",
      douyinId: "",
      signature: "",
      contact: "",
      location: "",
      gender: "未知",
      age: null,
      isPrivate: false,
      genderTimedOut: false,
      genderWaitMs: 0,
      genderSource: "",
      genderFromApi: false
    };
    try {
      try {
        const result = Array.from(document.querySelectorAll("span, p, div")).find(arg1 => arg1.innerText?.trim() === "私密账号");
        if (result) {
          obj.isPrivate = true;
        }
      } catch (error) {}
      if (!obj.nickname) {
        obj.nickname = fn72();
      }
      const result = await fn74({
        genderFilter: options.genderFilter || "all",
        genderWaitMs: options.genderWaitMs,
        loopId: options.loopId
      });
      obj.gender = result.gender || "未知";
      if (result.age != null) {
        obj.age = result.age;
      }
      obj.genderTimedOut = !!result.genderTimedOut;
      obj.genderWaitMs = Number(result.genderWaitMs) || 0;
      obj.genderSource = result.genderSource || (result.genderFromApi ? "api" : "dom");
      obj.genderFromApi = !!result.genderFromApi;
      try {
        const result = Array.from(document.querySelectorAll("span, p, div"));
        if (obj.age == null) {
          const result2 = result.find(arg1 => /^\d{1,2}岁$/.test((arg1.innerText || "").trim()));
          if (result2) {
            const result = fn58(result2.innerText);
            if (result != null) {
              obj.age = result;
            }
          }
        }
        const result2 = result.find(arg1 => arg1.innerText?.includes("抖音号：") && arg1.innerText?.length < 30);
        if (result2) {
          obj.douyinId = result2.innerText.replace("抖音号：", "").trim();
        }
        const result3 = result.find(arg1 => arg1.innerText?.includes("IP属地：") && arg1.innerText?.length < 20);
        if (result3) {
          obj.location = result3.innerText.replace("IP属地：", "").trim();
        }
        const local = document.querySelector("[class*=\"signature\"]") || document.querySelector("[class*=\"desc\"]") || result.find(arg1 => arg1.className?.includes("yvX7_5G1"));
        if (local) {
          obj.signature = local.innerText.trim();
        }
        if (!obj.nickname) {
          obj.nickname = fn72();
        }
        const result4 = (obj.nickname + " " + obj.signature + " " + document.body.innerText.substring(0, 1000)).toLowerCase();
        const result5 = result4.match(/1[3-9]\d{9}/);
        const result6 = result4.match(/(?:vx|v|微|wechat|➕|🛰️)[:：]?\s*([a-zA-Z0-9_-]{5,20})/);
        const list = [];
        if (result5) {
          list.push("手机: " + result5[0]);
        }
        if (result6 && !result6[1].includes("http")) {
          list.push("微信: " + result6[1]);
        }
        obj.contact = list.join(" | ");
      } catch (error) {
        console.warn("[主页信息提取] 异常:", error.message);
      }
      if (!obj.nickname) {
        obj.nickname = fn72();
      }
      try {
        const result = parseProfileWorksCount();
        if (result !== null && result !== undefined) {
          obj.worksCount = result;
          if (result === 0) {
            obj.noWorks = true;
          }
        }
      } catch (error) {}
      const result2 = fn67(options.genderFilter || "all", "all");
      const local = !!obj.douyinId || !!obj.location || !!obj.nickname && obj.worksCount != null;
      obj.genderUnresolved = result2 !== "all" && obj.gender === "未知" && !!obj.genderTimedOut && !local;
      console.log("[Built-in-Debug] [详细信息提取] 昵称: " + (obj.nickname || "-") + ", 抖音号: " + (obj.douyinId || "-") + "," + (" 性别: " + obj.gender + (obj.genderTimedOut ? "(等待超时)" : "")) + ("" + (obj.genderUnresolved ? "(未就绪)" : "")) + ((obj.genderSource ? "(" + obj.genderSource + ")" : "") + ",") + (" 年龄: " + (obj.age != null ? obj.age + "岁" : "未知") + ", 作品数: " + (obj.worksCount ?? "未知") + ",") + (" 私密: " + (obj.isPrivate ? "是" : "否") + ", 联系方式: " + (obj.contact || "-")));
    } catch (error) {
      console.warn("[子视图] 详细信息采集异常:", error.message);
    }
    if (obj.age == null) {
      obj.age = 0;
    }
    obj.profileAgeChecked = true;
    return obj;
  }
  function fn75() {
    return {
      createdAt: Date.now(),
      stackHits: 0,
      flipCount: 0,
      lastScrollY: window.scrollY || document.documentElement.scrollTop || 0,
      lastDirection: 0,
      recovering: false,
      lastDiagnostics: null
    };
  }
  function fn76() {
    const local = window.innerHeight || 800;
    const local2 = window.innerWidth || 1200;
    const local3 = arg1 => arg1.bottom > 20 && arg1.top < local - 20 && arg1.right > 20 && arg1.left < local2 - 20;
    const result = Array.from(document.querySelectorAll("video")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      return local3(result);
    }).map(arg1 => {
      const result = arg1.getBoundingClientRect();
      return {
        paused: !!arg1.paused,
        top: Math.round(result.top),
        height: Math.round(result.height),
        width: Math.round(result.width),
        area: Math.round(result.width * result.height),
        large: result.height >= local * 0.42 && result.width >= local2 * 0.35
      };
    }).sort((arg1, arg2) => arg2.area - arg1.area);
    const result2 = result.filter(arg1 => arg1.large);
    const result3 = result2.filter(arg1 => !arg1.paused);
    const result4 = Array.from(document.querySelectorAll("[data-e2e=\"video-player-container\"], [data-e2e=\"video-detail-container\"], [class*=\"video-player\"], [class*=\"VideoPlayer\"]")).filter(arg1 => {
      if (!isVisibleElement(arg1)) {
        return false;
      }
      const result = arg1.getBoundingClientRect();
      return local3(result) && result.height >= local * 0.36 && result.width >= local2 * 0.32;
    });
    return {
      url: window.location.href,
      scrollY: window.scrollY || document.documentElement.scrollTop || 0,
      visibleVideoCount: result.length,
      largeVideoCount: result2.length,
      playingLargeVideoCount: result3.length,
      detailContainerCount: result4.length,
      stackLike: result2.length >= 2 || result3.length >= 2,
      videos: result.slice(0, 4)
    };
  }
  function fn77(arg1) {
    const result = fn76();
    arg1.lastDiagnostics = result;
    if (result.stackLike) {
      arg1.stackHits += 1;
    } else {
      arg1.stackHits = Math.max(0, arg1.stackHits - 1);
    }
    const value = result.scrollY - arg1.lastScrollY;
    if (Math.abs(value) >= 60) {
      const value2 = value > 0 ? 1 : -1;
      if (arg1.lastDirection && value2 !== arg1.lastDirection) {
        arg1.flipCount += 1;
      } else {
        arg1.flipCount = Math.max(0, arg1.flipCount - 1);
      }
      arg1.lastDirection = value2;
      arg1.lastScrollY = result.scrollY;
    }
    const value2 = Date.now() - arg1.createdAt;
    const value3 = arg1.stackHits >= 3;
    const local = value2 > 2000 && arg1.flipCount >= 4;
    return {
      diagnostics: result,
      stuck: value3 || local,
      reason: value3 ? "检测到 " + result.largeVideoCount + " 个大视频同时可见" : local ? "检测到页面多次上下滑动" : ""
    };
  }
  async function fn78(arg1, arg2, arg3, arg4, arg5) {
    if (arg5?.recovering) {
      return {
        pendingNavigation: true,
        reason: arg4
      };
    }
    if (arg5) {
      arg5.recovering = true;
    }
    console.warn("[养号预热] " + arg4 + "，判定预热页面可能卡住，准备重新进入用户主页");
    reportCurrentAction("养号预热疑似卡住：" + arg4 + "，正在重新进入主页...", arg3?.lead?.accountId);
    reportTraceLog("养号预热自愈：" + arg4 + "，重新进入用户主页后继续后续动作", arg3?.lead?.accountId, "warning");
    try {
      await closeAllModals(arg2);
      await sleep(800);
    } catch (error) {}
    if (!arg1) {
      console.warn("[养号预热] 缺少用户主页 URL，无法重新进入页面，只能跳过本次预热");
      return {
        pendingNavigation: false,
        recovered: false,
        reason: arg4
      };
    }
    if (arg3) {
      persistSubviewTaskForResume(arg3, {
        __warmupRestored: true,
        enableWarmup: false
      });
    }
    window.location.href = arg1;
    return {
      pendingNavigation: true,
      reason: arg4
    };
  }
  async function fn79(arg1, arg2, arg3, arg4, arg5) {
    const result = fn77(arg1);
    if (!result.stuck) {
      return null;
    }
    const local = result.diagnostics?.videos?.map(arg1 => "top=" + arg1.top + ",h=" + arg1.height + ",paused=" + arg1.paused).join(" | ");
    const value = arg5 + "：" + result.reason + (local ? "（" + local + "）" : "");
    return fn78(arg2, arg3, arg4, value, arg1);
  }
  async function fn80(arg1, arg2, arg3, arg4, arg5) {
    const value = Date.now() + arg1;
    while (Date.now() < value) {
      if (shouldAbort(arg4)) {
        throw new Error("TASK_ABORTED");
      }
      const result = await fn79(arg2, arg3, arg4, arg5, "观看预热视频时");
      if (result?.pendingNavigation) {
        return result;
      }
      await sleep(Math.min(700, Math.max(120, value - Date.now())));
    }
    return null;
  }
  async function fn55(arg1, options = {}) {
    try {
      const local = options.lead || state.currentTask?.lead || {};
      const value = options.resumeTask !== undefined ? options.resumeTask : arg1 === "BATCH" ? null : state.currentTask || null;
      const result = normalizeProfileUrlForReturn(options.profileUrl || local.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
      const result2 = fn75();
      await sleep(1500);
      const result3 = await waitForProfileWorksReady(arg1, 10000);
      if (result3.noWorks) {
        console.log("%c[养号预热] 该用户作品数为 0，跳过预热环节", "color: #94a3b8; font-style: italic;");
        return;
      }
      const result4 = findProfileVideoCards();
      const value2 = result4.length;
      if (value2 === 0) {
        console.log("%c[养号预热] 该用户暂无公开作品或作品不可见，跳过预热环节", "color: #94a3b8; font-style: italic;");
        return;
      }
      const result5 = Math.min(5, value2);
      const value3 = Math.random() > 0.5 ? 2 : 1;
      const result6 = Math.min(value3, value2);
      console.log("%c[节奏控制] 检测到 " + value2 + " 个公开作品，准备随机浏览其中的 " + result6 + " 个", "color: #fff; background: #06b6d4; padding: 2px 4px; border-radius: 2px;");
      const list = [];
      const result7 = result4.slice(0, result5);
      while (list.length < result6) {
        const result = Math.floor(Math.random() * result7.length);
        if (!list.includes(result)) {
          list.push(result);
        }
      }
      for (const item of list) {
        const value2 = result4[item];
        console.log("%c[拟人操作] 正在进入第 " + (item + 1) + " 个视频进行“深度阅读”", "color: #67e8f9; font-style: italic;");
        await simulateHumanClick(value2, arg1);
        await randomDelay(2000, 4000, arg1, "等待视频加载");
        const result3 = await fn79(result2, result, arg1, value, "打开预热视频后");
        if (result3?.pendingNavigation) {
          return result3;
        }
        const value3 = Math.floor(Math.random() * 3000) + 3000;
        console.log("%c[拟人操作] 模拟播放观看中 (" + value3 + "ms)...", "color: #67e8f9; font-style: italic;");
        const result5 = await fn80(value3, result2, result, arg1, value);
        if (result5?.pendingNavigation) {
          return result5;
        }
        const value4 = Math.random() > 0.4;
        if (Math.random() > 0.3) {
          console.log("%c[拟人操作] 对预热视频执行随机" + (value4 ? "点赞" : "收藏"), "color: #67e8f9; font-style: italic;");
          const obj = {
            simulateHumanClick: simulateHumanClick,
            randomDelay: randomDelay,
            isVisibleElement: isVisibleElement,
            getVideoEngagePack: getVideoEngagePack
          };
          if (value4) {
            await likeCurrentVideoSideAction(arg1, obj);
          } else {
            await collectCurrentVideoSideAction(arg1, obj);
          }
          await randomDelay(1000, 2000, arg1);
        }
        await closeAllModals(arg1);
        await randomDelay(1000, 1500, arg1);
        const result6 = await fn79(result2, result, arg1, value, "关闭预热视频后");
        if (result6?.pendingNavigation) {
          return result6;
        }
      }
      await closeAllModals(arg1);
      try {
        document.querySelectorAll("video").forEach(arg1 => {
          if (!arg1.paused) {
            console.log("[节奏控制] 预热结束，检测到有残留视频播放，已执行静音暂停");
            arg1.pause();
          }
        });
      } catch (error) {}
      console.log("%c[节奏控制] 养号预热环节结束，开始主体互动", "color: #22d3ee; font-style: italic;");
      return {
        pendingNavigation: false
      };
    } catch (error) {
      console.warn("[子视图] 养号互动异常:", error.message);
      return {
        pendingNavigation: false,
        error: error.message
      };
    }
  }
  function fn56(options = {}) {
    const result = Number(options.randomLikeProbability ?? 50);
    if (Number.isFinite(result)) {
      return Math.min(100, Math.max(0, Math.round(result)));
    } else {
      return 50;
    }
  }
  async function fn57(arg1, options = {}) {
    return withBackgroundAutomationLayout(async () => {
      const local = options.lead || state.currentTask?.lead || {};
      try {
        const local2 = options.config || state.currentTask || {};
        const value = options.resumeTask !== undefined ? options.resumeTask : arg1 === "BATCH" ? null : state.currentTask || null;
        const result = normalizeProfileUrlForReturn(options.profileUrl || local.userUrl || (window.location.href.includes("/user/") ? window.location.href : ""));
        const result2 = fn56(local2);
        const value2 = Math.floor(Math.random() * 100) + 1;
        if (value2 > result2) {
          const value = "作品点赞概率判断：随机值 " + value2 + "，命中区间 1-" + result2 + "（" + result2 + "%）；未命中，仅跳过本条线索的作品点赞，后续跟进继续";
          console.log("[作品点赞] " + value);
          reportCurrentAction(value, local.accountId);
          return;
        }
        const value3 = "作品点赞概率判断：随机值 " + value2 + "，命中区间 1-" + result2 + "（" + result2 + "%）；已命中，准备随机选择 1 个作品点赞";
        console.log("[作品点赞] " + value3);
        reportCurrentAction(value3, local.accountId);
        await sleep(1500);
        const result3 = await waitForProfileWorksReady(arg1, 8000);
        if (result3.noWorks) {
          const text = "作品点赞：该用户作品数为 0，本条不执行点赞，后续跟进继续";
          console.log("[作品点赞] " + text);
          reportCurrentAction(text, local.accountId);
          return;
        }
        const result4 = findProfileVideoCards();
        const value4 = result4.length;
        if (value4 === 0) {
          const text = "作品点赞：该用户暂无公开作品，本条不执行点赞，后续跟进继续";
          console.log("[作品点赞] " + text);
          reportCurrentAction(text, local.accountId);
          return;
        }
        const result5 = Math.floor(Math.random() * value4);
        const value5 = result4[result5];
        const value6 = "作品点赞：已从 " + value4 + " 个作品中随机选择第 " + (result5 + 1) + " 个，正在打开";
        console.log("%c[作品点赞] " + value6, "color: #ff007f; font-weight: bold;");
        reportCurrentAction(value6, local.accountId);
        reportTraceLog("👍 " + (arg1 === "BATCH" ? "批量任务" : "主页跟进") + "：准备点赞随机选中的第 " + (result5 + 1) + " 个作品", local.accountId);
        await simulateTrustedElementClick(value5, arg1, "打开随机点赞作品");
        await randomDelay(2000, 4000, arg1, "等待视频加载");
        const result6 = getVideoEngageSelector({
          getVideoEngagePack: getVideoEngagePack
        }, "likeSelectors");
        const value7 = result6 ? document.querySelector(result6) : null;
        if (value7) {
          const local2 = value7.closest("div[role=\"button\"]") || value7.closest("button") || value7;
          const text = "作品点赞：正在点击点赞按钮";
          console.log("%c[作品点赞] " + text, "color: #ff007f; font-style: italic;");
          reportCurrentAction(text, local.accountId);
          await simulateTrustedElementClick(local2, arg1, "随机作品点赞");
          await randomDelay(1200, 2000, arg1);
          reportCurrentAction("作品点赞：随机选中的第 " + (result5 + 1) + " 个作品已点赞", local.accountId);
        } else {
          const text = "作品点赞：未找到点赞按钮，本次未执行点赞";
          console.warn("[作品点赞] " + text);
          reportCurrentAction(text, local.accountId);
        }
        await closeAllModals(arg1);
        await randomDelay(1000, 1500, arg1);
      } catch (error) {
        const value = "作品点赞：执行异常，本次未完成点赞（" + error.message + "）";
        console.error("[作品点赞] " + value, error);
        reportCurrentAction(value, local.accountId);
      }
    });
  }
  return {
    appendRandomEmojiSuffix: fn50,
    applyFollowUpActions: applyFollowUpActions,
    applyRiskyEmojiReplaceForComment: applyRiskyEmojiReplaceForComment,
    bootPendingSubviewTask: bootPendingSubviewTask,
    checkBatchAgeFilter: checkBatchAgeFilter,
    classifyCommentFailureToastLocal: classifyCommentFailureToastLocal,
    closeAllModals: closeAllModals,
    commentDraftHasCoreTextLocal: commentDraftHasCoreTextLocal,
    evaluateTaskGenderFilter: evaluateTaskGenderFilter,
    extractUserIdFromUrl: extractUserIdFromUrl,
    findProfileFollowButtonByText: findProfileFollowButtonByText,
    findProfileMessageButtonByText: findProfileMessageButtonByText,
    findSmartElementQuiet: findSmartElementQuiet,
    formatAgeFilterRangeLabel: formatAgeFilterRangeLabel,
    formatObservedAgeLabel: formatObservedAgeLabel,
    getElementClassText: getElementClassText,
    isBatchAgeFilterActive: isBatchAgeFilterActive,
    isCommentDraftOnlyEmojiDriftLocal: isCommentDraftOnlyEmojiDriftLocal,
    isRejectedProfileNicknameCandidate: isRejectedProfileNicknameCandidate,
    parseProfileGenderFromApiPayload: parseProfileGenderFromApiPayload,
    performProfileActionsLogic: performProfileActionsLogic,
    rememberProfileApiGenderHit: rememberProfileApiGenderHit,
    replaceRiskyCommentEmojisLocal: replaceRiskyCommentEmojisLocal,
    resolveFollowUpFlags: resolveFollowUpFlags,
    resolveProfileFirstGenderFilter: resolveProfileFirstGenderFilter,
    resolveTaskGenderFilter: resolveTaskGenderFilter,
    scrapeDetailedProfile: scrapeDetailedProfile,
    shouldAppendCommentRandomSuffix: shouldAppendCommentRandomSuffix,
    shouldAppendVideoCommentRandomSuffix: shouldAppendVideoCommentRandomSuffix,
    waitForSmartElement: waitForSmartElement
  };
}
module.exports = {
  createProfileInteractionController: createProfileInteractionController
};